import {
  setDoc,
  doc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase-client";

/**
 * Check if the user already applied for this role.
 * Looks for the deterministic application document: recruitment_applications/{roleId}_{email}
 */
export async function hasAlreadyApplied(): Promise<boolean> {
  if (!auth.currentUser) return false;
  const email = auth.currentUser.email!;
  const applicationId = email;
  const snap = await getDoc(doc(db, "recruitment_applications", applicationId));
  return snap.exists();
}

export async function submitApplication(payload: {
  roleId: string;
  applicant: Record<string, string>;
  socialLinks: Record<string, string>;
  files: Record<string, unknown>;
  answers: Record<string, unknown>;
  agreeToTerms: boolean;
  confirmInfo: boolean;
}): Promise<string> {
  if (!auth.currentUser) throw new Error("Sign in required");
  const email = auth.currentUser.email!;
  const uid = auth.currentUser.uid;
  const applicationId = email;

  const appData = {
    roleId: payload.roleId,
    userId: uid,
    userEmail: email,
    applicant: payload.applicant,
    socialLinks: payload.socialLinks,
    files: payload.files,
    answers: payload.answers,
    status: "submitted",
    currentReviewer: null,
    shortlistedAt: null,
    reviewedAt: null,
    acceptedAt: null,
    rejectedAt: null,
    rejectedReason: null,
    dedupeKey: applicationId,
    agreeToTerms: payload.agreeToTerms,
    confirmInfo: payload.confirmInfo,
    isRead: false,
    isStarred: false,
    notes: "",
    submittedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  console.log("[Recruitment] Writing application...");
  
  // By using setDoc with a deterministic ID, we eliminate the need for a separate dedupe collection.
  // If the document already exists, Firebase Security Rules should reject the write (or overwrite it if allowed).
  // Ideally, your security rules should have: allow create: if !exists(...)
  await setDoc(doc(db, "recruitment_applications", applicationId), appData);
  
  console.log("[Recruitment] Application written, id:", applicationId);

  return applicationId;
}
