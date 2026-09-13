# Recruitment Module — Client-Side Firestore Contract

Firestore collections for the GDG VITB recruitment module. This is the
source-of-truth contract implemented by the admin backend
(`gdg_admin`); the client app reads/writes these collections directly with the
Firebase client SDK.

- Region: default (same as other GDG collections)
- All timestamps are stored as **Firestore `Timestamp`**
- All strings are trimmed; emails are stored **lowercase**

---

## 1. Collections

| Collection                    | Access        | Purpose                       |
| ----------------------------- | ------------- | ----------------------------- |
| `recruitment_roles`           | read: signed-in | Job/team-role definitions   |
| `recruitment_applications`    | see rules       | Candidate submissions        |
| └ `recruitment_applications/<id>/reviews`        | admin only | Scoring/review notes  |
| └ `recruitment_applications/<id>/status_history` | admin only | Status-change audit log |
| `recruitment_settings`        | read: public    | Global toggles + defaults    |

---

## 2. `recruitment_roles` — role definitions

Document fields:

| Field               | Type                                                       | Notes |
| ------------------- | ---------------------------------------------------------- | ----- |
| `id`                | string (auto)                                              | doc id |
| `title`             | string                                                     | e.g. "Flutter Developer" |
| `description`       | string                                                     | shown on the public page |
| `icon`              | string                                                     | single glyph / emoji |
| `color`             | string hex `#RRGGBB`                                       | default `#4285F4` |
| `status`            | `RoleStatus`                                               | see below |
| `maxApplications`   | number \| null                                             | cap; `null` = unlimited |
| `applicationStart`  | Timestamp \| null                                          | applications open |
| `applicationEnd`    | Timestamp \| null                                          | applications close |
| `sections`          | `RecruitmentRoleSection[]`                                 | sectioned questions |
| `fields`            | `RecruitmentRoleField[]`                                   | question definitions |
| `createdBy`         | string                                                     | admin uid/email |
| `createdAt`         | Timestamp                                                  | |
| `updatedAt`         | Timestamp                                                  | |
| `applicationCount`  | — (not stored)                                             | computed via `count()` |

`RoleStatus`:

```
draft | open | closing-soon | closed | archived
```

- Applications may only be **created** while the role is `open` or
  `closing-soon`.

`RecruitmentRoleSection`:

```
{ number: int, title: string, description?: string, borderColor: string }
```

`RecruitmentRoleField` (the question definition):

```
{
  name: string,              // unique key, also used in answers map
  label: string,             // displayed question text
  type: FieldType,
  section: int,              // matches a section number
  required: bool,
  placeholder?: string,
  helpText?: string,
  options?: [ { label: string, value: string } ],   // select only
  accept?: string,           // file input accept string, e.g. ".pdf,.doc,.docx"
  maxSizeMB?: number,        // file only; falls back to global settings
  allowedExtensions?: [string],  // file only, e.g. [".pdf",".doc"]
  checkboxLabel?: string,    // checkbox only (alternative to label)
  minLength?: number, maxLength?: number,   // text inputs
  pattern?: string, patternMessage?: string, // regex validation
  order: int
}
```

`FieldType`:

```
text | email | tel | url | number | select | file | checkbox
```

### Reserved question names

Full name / email / phone / branch / year of study are **built-in** applicant
fields rendered by the client's standard "Your details" block. They are NOT
expected in `fields`, and the values are sent inside `applicant` (see §3),
not in `answers`.

`resume` and `taskSubmission` are reserved names for file questions; their
meta is stored in `files.resume` / `files.taskSubmission` (not `answers`).

---

## 3. `recruitment_applications` — submissions

Document fields:

| Field               | Type                       | Notes |
| ------------------- | -------------------------- | ----- |
| `id`                | string (auto)              | doc id |
| `roleId`            | string                     | target role doc id |
| `userId`            | string \| null             | Firebase Auth uid (may be null) |
| `userEmail`         | string                     | lowercase, must equal auth email |
| `applicant`         | `RecruitmentApplicantInfo` | standard fields |
| `socialLinks`       | `RecruitmentSocialLinks`   | optional links |
| `files`             | `RecruitmentFiles`         | resume + taskSubmission |
| `answers`           | map `name -> value`        | dynamic field answers |
| `status`            | `ApplicationStatus`        | initial value: `submitted` |
| `currentReviewer`   | string \| null             | assigned reviewer |
| `shortlistedAt`     | Timestamp \| null          | set on `shortlisted` |
| `reviewedAt`        | Timestamp \| null          | set on `under_review`/`interviewed` |
| `acceptedAt`        | Timestamp \| null          | set on `accepted` |
| `rejectedAt`        | Timestamp \| null          | set on `rejected` |
| `rejectedReason`    | string \| null             | reason when rejected |
| `dedupeKey`         | string                     | `"{roleId}_{email}"`, unique |
| `agreeToTerms`      | bool                       | must be `true` |
| `confirmInfo`       | bool                       | must be `true` |
| `isRead`            | bool                       | admin flag |
| `isStarred`         | bool                       | admin flag |
| `notes`             | string                     | admin notes |
| `submittedAt`       | Timestamp                  | |
| `updatedAt`         | Timestamp                  | |

`RecruitmentApplicantInfo`:

```
{ fullName: string, email: string, phone: string,
  branch: string, yearOfStudy: string }
```

`RecruitmentSocialLinks` (all optional):

```
{ linkedin?: string, github?: string, portfolio?: string, gitRepoLink?: string }
```

`RecruitmentFiles`:

```
{
  resume: RecruitmentFileMeta,                   // always expected
  taskSubmission?: RecruitmentFileMeta
}
```

`RecruitmentFileMeta`:

```
{ url: string, cloudinaryId: string,
  originalName: string, mimeType: string, sizeBytes: int }
```

`answers` value types per question type:

| field.type   | answers value                       |
| ------------ | ----------------------------------- |
| text/email/tel/url | string                      |
| number       | int / double                        |
| select       | string (one `option.value`)         |
| checkbox     | bool (true when checked)           |
| file         | `RecruitmentFileMeta` (resume/taskSubmission files go to `files` instead) |

`ApplicationStatus` order:

```
submitted → under_review → shortlisted → interview_scheduled → interviewed
          → accepted | rejected | waitlisted | withdrawn
```

### Legal status transitions (enforced by the backend)

| from             | allowed to                                  |
| ---------------- | ------------------------------------------- |
| submitted        | under_review, rejected, waitlisted          |
| under_review     | shortlisted, rejected, waitlisted           |
| shortlisted      | interview_scheduled, rejected, waitlisted, accepted |
| interview_scheduled | interviewed, rejected, waitlisted       |
| interviewed      | accepted, rejected, waitlisted              |
| accepted         | withdrawn, waitlisted                       |
| rejected         | (none)                                      |
| waitlisted       | shortlisted, accepted, rejected             |
| withdrawn        | (none)                                      |

---

## 4. Subcollections

### `reviews` (admin only)

```
{
  reviewerId: string, reviewerName: string,
  score: int|null,                // 0-10
  criteria: { technical: int|null, communication: int|null,
              portfolio: int|null, culturalFit: int|null },  // each 0-10
  verdict: "pending" | "shortlist" | "reject" | "waitlist",
  strengths: string, weaknesses: string, comments: string,
  createdAt: Timestamp, updatedAt: Timestamp
}
```

### `status_history` (admin only)

```
{ fromStatus: string, toStatus: string,
  changedBy: string, reason: string, createdAt: Timestamp }
```

First entry on submission: `fromStatus: "none"`, `toStatus: "submitted"`,
`changedBy: "system"`.

---

## 5. `recruitment_settings` — singleton doc `global`

| Field                   | Type          | Default                 |
| ----------------------- | ------------- | ----------------------- |
| `isRecruitmentActive`   | bool          | `false`                 |
| `globalMessage`         | string        | ""                      |
| `allowedEmailDomain`    | string        | `"@vishnu.edu.in"`      |
| `maxResumeSizeMB`       | number        | 5                       |
| `maxTaskFileSizeMB`     | number        | 10                      |
| `allowedResumeTypes`    | string[]      | `[".pdf",".doc",".docx"]` |
| `allowedTaskTypes`      | string[]      | `[".doc",".docx"]`      |
| `notifyOnApplication`   | bool          | `false`                 |
| `notificationEmails`    | string[]      | []                      |
| `scriptUrl`             | string \| null | null                   |
| `updatedAt`             | Timestamp     | —                       |

Read publicly to answer "is recruitment currently active". When
`isRecruitmentActive` is `false`, reject all submissions and show
`globalMessage`.

---

## 6. Security rules

Rules file in the repo: `firestore.rules`. Copy these into your rules tab:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isSignedIn() {
      return request.auth != null;
    }
    function isAdmin() {
      return request.auth != null && request.auth.token.admin == true;
    }

    // Roles: anyone signed in can read; admins manage.
    match /recruitment_roles/{roleId} {
      allow read: if isSignedIn();
      allow write: if isAdmin();
    }

    // Applications
    match /recruitment_applications/{appId} {
      // Signed-in users may submit; dedupe key must match their own email.
      allow create: if isSignedIn()
        && request.resource.data.userEmail == request.auth.token.email
        && request.resource.data.dedupeKey
             == request.resource.data.roleId + "_" + request.auth.token.email
        && request.resource.data.status == "submitted";

      // Applicants read their own; admins read all.
      allow read: if isSignedIn()
        && (resource.data.userId == request.auth.uid
            || resource.data.userEmail == request.auth.token.email
            || isAdmin());

      // Admins only for updates/deletes.
      allow update, delete: if isAdmin();

      match /reviews/{reviewId} {
        allow read, write: if isAdmin();
      }
      match /status_history/{historyId} {
        allow read, write: if isAdmin();
      }
    }

    // Settings: public read, admin write.
    match /recruitment_settings/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }
  }
}
```

> **DedupeKey case-sensitivity:** the rule compares `dedupeKey` against
> `roleId + "_" + request.auth.token.email` verbatim, so build it from the
> **exact** token email (do not lowercase it in the client when creating the
> map key). Firestore has no unique index — uniqueness is enforced inside the
> create rule plus an application-level pre-check.

---

## 7. Required indexes

File in the repo: `firestore.indexes.json`. Needed for the admin list/detail
queries and the duplicate check:

```
recruitment_applications: roleId ASC, status ASC
recruitment_applications: dedupeKey ASC
recruitment_applications: userId ASC, roleId ASC
recruitment_applications: status ASC, submittedAt DESC
```

---

## 8. Client flows

### 8.1 List open roles

```dart
final snap = await FirebaseFirestore.instance
    .collection('recruitment_roles')
    .where('status', isIn: ['open', 'closing-soon'])
    .orderBy('status').get();
```

Optionally filter client-side on `applicationEnd` / `start` windows.

### 8.2 Single role page

```dart
final doc = await FirebaseFirestore.instance
    .collection('recruitment_roles').doc(roleId).get();
```

### 8.3 Pre-check before showing the form

```dart
final s = await FirebaseFirestore.instance
    .collection('recruitment_settings').doc('global').get();
final active = (s.data()?['isRecruitmentActive'] as bool?) ?? false;
```

### 8.4 Submit an application

1. Render the standard applicant block + one field per `role.fields`
   entry (grouped by `role.sections`).
2. For `file` questions, upload the file first (see §8.5) to get a
   `RecruitmentFileMeta`.
3. Build `dedupeKey = "${role.roleId}_${auth.currentUser!.email}"` using the
   exact token email.
4. Write with client `add()`:

```dart
final roles = 'recruitment_roles';
await FirebaseFirestore.instance
    .collection('recruitment_applications').add({
  'roleId': roleId,
  'userId': FirebaseAuth.instance.currentUser?.uid,
  'userEmail': FirebaseAuth.instance.currentUser!.email,
  'applicant': { 'fullName': ..., 'email': ..., 'phone': ...,
                 'branch': ..., 'yearOfStudy': ... },
  'socialLinks': { if (linkedin.isNotEmpty) 'linkedin': linkedin, /* github, portfolio, gitRepoLink */ },
  'files': { 'resume': resumeMeta, if (taskMeta != null) 'taskSubmission': taskMeta },
  'answers': { fieldName: value, ... },   // per §3 types; NOT for reserved names
  'status': 'submitted',
  'currentReviewer': null,
  'shortlistedAt': null, 'reviewedAt': null,
  'acceptedAt': null, 'rejectedAt': null, 'rejectedReason': null,
  'dedupeKey': dedupeKey,
  'agreeToTerms': true, 'confirmInfo': true,
  'isRead': false, 'isStarred': false, 'notes': '',
  'submittedAt': FieldValue.serverTimestamp(),
  'updatedAt': FieldValue.serverTimestamp(),
});
await docRef.collection('status_history').add({
  'fromStatus': 'none', 'toStatus': 'submitted',
  'changedBy': 'system', 'reason': 'Application submitted',
  'createdAt': FieldValue.serverTimestamp(),
});
```

Server-side equivalents enforce additionally: active toggle, allowed domain,
deadline, `maxApplications`, and duplicate (`dedupeKey`).

### 8.5 File uploads

Upload to Cloudinary, then store metadata in `files.{resume,taskSubmission}`:

```
{ url, cloudinaryId, originalName, mimeType, sizeBytes }
```

Recommend reserving an **unsigned upload preset** for public submissions
(or proxy through your backend). Client hints:

- max size: `settings.maxResumeSizeMB` (resume) / `settings.maxTaskFileSizeMB`
  (task), or `field.maxSizeMB` when set.
- allowed types: `settings.allowedResumeTypes` / `settings.allowedTaskTypes`
  or `field.allowedExtensions`.

---

## 9. Reference: admin API routes (Next.js)

The admin portal exposes these HTTP routes (Admin SDK, bypasses security
rules). The client app should talk to Firestore directly; these are listed for
completeness.

| Method & path                          | Purpose |
| -------------------------------------- | ------- |
| GET/POST `/api/recruitment/roles`      | list all / create role |
| GET/PATCH/DELETE `/api/recruitment/roles/[id]` | single role (+count), update, cascade delete |
| GET/POST `/api/recruitment/applications` | list (filters roleId/status/search), submit |
| GET/PATCH/DELETE `/api/recruitment/applications/[id]` | detail (+reviews/history), transition, delete |
| GET/PUT `/api/recruitment/settings`    | read / update global settings |
| POST `/api/recruitment/upload`         | public file upload (Cloudinary) |