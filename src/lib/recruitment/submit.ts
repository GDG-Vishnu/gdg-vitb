import {
  setDoc,
  doc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase-client";

/**
 * Check if the user has already applied for ANY role.
 * Uses the appliedRoleId field on the user's profile.
 */
export async function hasAlreadyApplied(roleId: string): Promise<boolean> {
  if (!auth.currentUser) return false;
  try {
    const uid = auth.currentUser.uid;
    const snap = await getDoc(doc(db, "client_users", uid));
    if (snap.exists() && snap.data().appliedRoleId) {
      return true;
    }
    return false;
  } catch (err) {
    console.error("[Recruitment] Failed to check duplicate application:", err);
    // On error, assume not applied — let submit proceed and fail with proper message
    return false;
  }
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
  const applicationId = `${payload.roleId}_${email}`;

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

  // setDoc with merge:false ensures create-only — fails if doc already exists
  await setDoc(doc(db, "recruitment_applications", applicationId), appData, { merge: false });

  // Update the user's profile to indicate they have applied
  await setDoc(doc(db, "client_users", uid), { appliedRoleId: payload.roleId, updatedAt: serverTimestamp() }, { merge: true });

  console.log("[Recruitment] Application written, id:", applicationId);
  return applicationId;
}
