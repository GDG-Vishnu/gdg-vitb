import { doc, getDoc } from "firebase/firestore";
import type { Firestore } from "firebase/firestore";
import { auth } from "@/lib/firebase-client";
import type { UserSerialized } from "@/types/user";

export type RegistrationGuardResult =
  | { allowed: true }
  | {
      allowed: false;
      reason: "not-logged-in" | "profile-incomplete" | "blocked";
    };

/**
 * Sync eligibility check using the already-loaded userProfile from AuthContext.
 * Saves 1 Firestore read per registration attempt in the normal (logged-in) flow.
 */
export function checkRegistrationEligibility(
  userProfile: UserSerialized | null,
): RegistrationGuardResult {
  const user = auth.currentUser;

  if (!user || !userProfile) {
    return { allowed: false, reason: "not-logged-in" };
  }

  if (userProfile.isBlocked === true) {
    return { allowed: false, reason: "blocked" };
  }

  if (userProfile.profileCompleted !== true) {
    return { allowed: false, reason: "profile-incomplete" };
  }

  return { allowed: true };
}

/**
 * Async fallback — fetches the latest user profile from Firestore directly.
 * Use ONLY for the post-sign-in recheck where the component state may not
 * have re-rendered with the new userProfile yet.
 */
export async function fetchAndCheckEligibility(
  db: Firestore,
): Promise<RegistrationGuardResult> {
  const user = auth.currentUser;

  if (!user) return { allowed: false, reason: "not-logged-in" };

  const snap = await getDoc(doc(db, "client_users", user.uid));

  if (!snap.exists()) return { allowed: false, reason: "not-logged-in" };

  const data = snap.data();

  if (data.isBlocked === true) return { allowed: false, reason: "blocked" };

  if (data.profileCompleted !== true) {
    return { allowed: false, reason: "profile-incomplete" };
  }

  return { allowed: true };
}
