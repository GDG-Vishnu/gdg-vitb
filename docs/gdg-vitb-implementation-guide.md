# gdg-vitb — Recruitment Implementation Guide (Next.js)

The **gdg-vitb** repo (main public site) hosts the student-facing recruitment
pages. The **gdg_admin** repo (admin portal) is already built and serves the
public API for uploads + the server-side email/Drive Apps Script webhooks.
The site repo is a **reader + submitter**: it never writes
`recruitment_roles` / `recruitment_settings` / `recruitment_field_templates`,
and it **never calls Apps Script URLs**.

## 1. Architecture map

```
gdg-vitb (this repo)                gdg_admin (admin portal, deployed)
─────────────────────               ─────────────────────────────────────
/recruitment list      ➜ Firestore  read  recruitment_roles
/recruitment/[roleId]  ➜ Firestore  read  role + recruitment_settings/global
file fields            ➜ POST {PORTAL}/api/recruitment/upload  ➜ Apps Script ➜ Drive
submit                 ➜ Firestore add recruitment_applications (+ status_history)
                                     backend fires Apps Script email webhook on submit
```

## 2. Prerequisites (already done in gdg_admin)

- `firestore.rules` deployed (applications create rule, admin-only writes).
- Drive upload + email Apps Script web apps deployed and configured in
  **Recruitment ▸ Settings** (Test buttons green).
- Admin portal deployed somewhere public (e.g. Vercel). Set its env var:
  `PUBLIC_SITE_ORIGIN=https://<gdg-vitb-domain>` (comma-separated for more
  origins). When unset the portal replies `Access-Control-Allow-Origin: *`,
  so uploads work even before you set it — but set it for production hygiene.

## 3. Env vars in gdg-vitb

`.env.local` (and your Vercel/Netlify deployment):

```env
# Firebase web app config — SAME project as the admin portal
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Admin portal origin for file uploads (no trailing slash)
NEXT_PUBLIC_PORTAL_ORIGIN=https://gdg-admin.example.com
```

Install the SDK: `npm i firebase`.

## 4. Firebase client singleton

`lib/firebase/client.ts`

```ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
```

## 5. Data hooks (real-time, no polling)

`lib/recruitment/hooks.ts`

```ts
"use client";
import { useEffect, useState } from "react";
import { onSnapshot, doc, collection, query, where, getCountFromServer } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export function useSettings() {
  const [settings, setSettings] = useState<any>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "recruitment_settings", "global"), (d) => {
      setSettings(d.data() ?? null);
      setReady(true);
    });
    return unsub;
  }, []);
  return { settings, ready };
}

export function useRole(roleId: string) {
  const [role, setRole] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!roleId) return;
    const unsub = onSnapshot(doc(db, "recruitment_roles", roleId), (d) => {
      setRole(d.exists() ? { id: d.id, ...d.data() } : null);
      setLoading(false);
    });
    return unsub;
  }, [roleId]);
  return { role, loading };
}
```

Role list page subscribes to
`query(collection(db, "recruitment_roles"), where("status", "in", ["open", "closing-soon"]))`.

## 6. File upload util (portal proxy, never Apps Script)

`lib/recruitment/upload.ts`

```ts
export async function uploadFile(file: File, roleId: string, fieldName: string) {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("roleId", roleId);
  fd.append("fieldName", fieldName);
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_PORTAL_ORIGIN}/api/recruitment/upload`,
    { method: "POST", body: fd },
  );
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error ?? "Upload failed");
  return data as { success: true; url: string; driveFileId: string; originalName: string; mimeType: string; sizeBytes: number };
}
```

Pre-validate extension/size client-side (against `field.allowedExtensions` /
`field.accept` and `field.maxSizeMB`, with `settings.maxResumeSizeMB` /
`maxTaskFileSizeMB` fallbacks for `resume` / `taskSubmission`; server hard cap
50 MB) before calling this.

## 7. Submit util (Firestore add + status_history seed)

`lib/recruitment/submit.ts` — builds `dedupeKey` from the **exact** token
email, writes applicant/files/answers per the rules, then seeds `status_history`:

```ts
import { addDoc, collection, doc, serverTimestamp, writeBatch } from "firebase/firestore";
import { db, auth } from "@/lib/firebase/client";

export async function submitApplication(payload: {
  roleId: string;
  applicant: Record<string, string | boolean>;
  files: Record<string, unknown>;
  answers: Record<string, unknown>;
}) {
  if (!auth.currentUser) throw new Error("Sign in required");
  const email = auth.currentUser.email!;          // EXACT token email
  const appData = {
    roleId: payload.roleId,
    userId: auth.currentUser.uid,
    userEmail: email,
    applicant: payload.applicant,
    socialLinks: {},
    files: payload.files,
    answers: payload.answers,
    status: "submitted",
    currentReviewer: null,
    shortlistedAt: null, reviewedAt: null,
    acceptedAt: null, rejectedAt: null, rejectedReason: null,
    dedupeKey: `${payload.roleId}_${email}`,        // case-sensitive
    agreeToTerms: true, confirmInfo: true,
    isRead: false, isStarred: false, notes: "",
    submittedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const ref = await addDoc(collection(db, "recruitment_applications"), appData);
  await addDoc(collection(ref, "status_history"), {
    fromStatus: "none", toStatus: "submitted",
    changedBy: "system", reason: "Application submitted",
    createdAt: serverTimestamp(),
  });
  return ref.id;
}
```

Handle `"already-applied"` / duplicate errors, domain rejection
(`Only @vishnu.edu.in …`), and "recruitment closed" as distinct user-facing
states (see smooth-journey checklist in `docs/client-app-recruitment-prompt.md`).

## 8. Pages to add in gdg-vitb

| File | Content |
|---|---|
| `app/recruitment/page.tsx` | (client) list open roles, live from Firestore; empty state; banner from `globalMessage`; entry hidden when `isRecruitmentActive === false`. |
| `app/recruitment/[roleId]/page.tsx` | (client) `useRole` + `useSettings`; render the gating screen (inactive / `status` closed / window / `maxApplications`) or the form. Gate reacts live to snapshot changes. |
| `components/recruitment/RoleForm.tsx` | Port of **`components/recruitment/PublicRecruitmentForm.tsx` from gdg_admin** (already Next.js). Swap the portal origin to `NEXT_PUBLIC_PORTAL_ORIGIN` in its `fetch("/api/recruitment/upload", …)`, keep everything else (validation, file chip UX, inline errors, success screen with reference id + "We've sent a confirmation email to <email>"). |

Other ui primitives (Card/Input/Select/Checkbox/Button/toast): reuse your site's
own UI kit or copy the ones from `components/ui` in gdg_admin (shadcn/ui style,
Radix-based, same project conventions).

## 9. Auth gating

- Application rules require a signed-in user. On `/recruitment/*` without a
  session, redirect to your sign-in page with a `?next=` return path so the
  student lands back on the same role after authenticating.
- Sign the students in with your standard Firebase email/password (or Google)
  flow — same as the rest of the site.

## 10. Deployment checklist

- [ ] Firebase web app enabled (API key comes from the same GCP project).
- [ ] Ports of the two public files in gdg_admin added with `NEXT_PUBLIC_PORTAL_ORIGIN` pointing at the deployed portal.
- [ ] gdg_admin env `PUBLIC_SITE_ORIGIN=https://<gdg-vitb-domain>` set + redeployed.
- [ ] Roles/settings/scripts verified via the portal's "Open" button on one role and the Settings test buttons.
- [ ] Smoke test: apply with a test `@vishnu.edu.in`-style email against a
      burnable role; confirm the email webhook fired (check the portal server
      logs / real inbox), the Drive folder got the file, and the application
      shows in the portal Applications tab.
- [ ] `firestore.indexes.json` deployed if the list/dedupe queries need
      composite indexes (recruitment list uses status; dedupe uses dedupeKey).