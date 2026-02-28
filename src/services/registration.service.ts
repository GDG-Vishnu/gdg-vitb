import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase-client";

export type RegistrationGuardResult =
  | { allowed: true }
  | {
      allowed: false;
      reason: "not-logged-in" | "profile-incomplete" | "blocked";
    };

/**
 * Checks whether the current user is eligible to register for an event.
 *
 * 1. Not logged in → not allowed ("not-logged-in")
 * 2. Blocked → not allowed ("blocked")
 * 3. profileCompleted === false → not allowed ("profile-incomplete")
 * 4. Otherwise → allowed
 *
 * Always fetches the latest user document from Firestore (bypasses cache).
 */
export async function checkRegistrationEligibility(): Promise<RegistrationGuardResult> {
  const user = auth.currentUser;

  if (!user) {
    return { allowed: false, reason: "not-logged-in" };
  }

  // Fetch the latest user document from Firestore
  const ref = doc(db, "client_users", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    // User doc missing — treat as not logged in
    return { allowed: false, reason: "not-logged-in" };
  }

  const data = snap.data();

  if (data.isBlocked === true) {
    return { allowed: false, reason: "blocked" };
  }

  if (data.profileCompleted !== true) {
    return { allowed: false, reason: "profile-incomplete" };
  }

  return { allowed: true };
}
