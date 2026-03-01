import {
  fetchSignInMethodsForEmail,
  EmailAuthProvider,
  signInWithEmailAndPassword,
  linkWithCredential,
  type Auth,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import type { Firestore } from "firebase/firestore";

// ─── Constants ──────────────────────────────────────────────

export const ALLOWED_DOMAIN = "@vishnu.edu.in";
export const USERS_COLLECTION = "client_users";

// ─── Domain Validation ─────────────────────────────────────

/**
 * Returns true if the email belongs to the allowed domain.
 */
export function isAllowedDomain(email: string): boolean {
  return email.toLowerCase().endsWith(ALLOWED_DOMAIN);
}

// ─── Firestore User Document ────────────────────────────────

/**
 * Creates a Firestore user document if one doesn't already exist.
 * Uses the user's UID as the document ID to prevent duplicates.
 * Returns true if a new document was created, false if it already existed.
 */
export async function ensureFirestoreUserDoc(
  db: Firestore,
  uid: string,
  data: {
    name: string;
    email: string;
    profileUrl?: string;
  },
): Promise<boolean> {
  const ref = doc(db, USERS_COLLECTION, uid);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    return false; // Document already exists — no duplicate
  }

  await setDoc(ref, {
    name: data.name,
    email: data.email,
    profileUrl: data.profileUrl ?? "",
    branch: "",
    graduationYear: 0,
    phoneNumber: "",
    socialMedia: {},
    resumeUrl: "",
    participations: [],
    role: "user",
    isBlocked: false,
    profileCompleted: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return true;
}

// ─── Provider Check & Credential Linking ────────────────────

/**
 * Checks what sign-in methods exist for an email.
 * Returns the list of provider IDs (e.g. ["google.com", "password"]).
 */
export async function getExistingProviders(
  authInstance: Auth,
  email: string,
): Promise<string[]> {
  try {
    const methods = await fetchSignInMethodsForEmail(authInstance, email);
    return methods;
  } catch {
    return [];
  }
}

/**
 * If a user already signed in via Google and now wants to add
 * email+password, this links the password credential to the
 * existing Google account.
 *
 * Steps:
 * 1. Sign in with the existing Google account using email+password
 *    (this will fail if password provider doesn't exist yet)
 * 2. If that fails, sign in via a temporary method and link.
 *
 * Returns the linked user, or throws if linking fails.
 */
export async function linkEmailPasswordToGoogle(
  authInstance: Auth,
  email: string,
  password: string,
): Promise<void> {
  // The user must first sign in with their Google account,
  // then we can link email/password to it.
  // Since we can't programmatically trigger Google sign-in here,
  // we try to sign in with email/password first.
  // If the account exists only with Google, Firebase will throw
  // "auth/wrong-password" or "auth/invalid-credential".

  // Try signing in — if password provider is already linked, this works
  try {
    await signInWithEmailAndPassword(authInstance, email, password);
    return;
  } catch {
    // Password provider not linked yet, or wrong password
  }

  // If we reach here, the user needs to sign in with Google first,
  // then link email/password. We throw a specific error message.
  throw new Error(
    "This email is registered with Google. Please sign in with Google first, then you can add a password from your profile settings.",
  );
}

/**
 * Links an email/password credential to the currently signed-in user.
 * Use this when a Google-authenticated user wants to also be able
 * to log in with email+password.
 */
export async function linkPasswordToCurrentUser(
  authInstance: Auth,
  email: string,
  password: string,
): Promise<void> {
  const currentUser = authInstance.currentUser;
  if (!currentUser) {
    throw new Error("No user is currently signed in.");
  }

  const credential = EmailAuthProvider.credential(email, password);
  await linkWithCredential(currentUser, credential);
}

// ─── Firebase Error Messages ────────────────────────────────

/**
 * Converts Firebase auth error codes to user-friendly messages.
 */
export function getAuthErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) return "An unexpected error occurred.";

  const message = error.message;

  if (message.includes("auth/email-already-in-use")) {
    return "This email is already registered. Try logging in instead.";
  }
  if (
    message.includes("auth/invalid-credential") ||
    message.includes("auth/wrong-password")
  ) {
    return "Invalid email or password. Please try again.";
  }
  if (message.includes("auth/user-not-found")) {
    return "No account found with this email. Please sign up first.";
  }
  if (message.includes("auth/too-many-requests")) {
    return "Too many attempts. Please try again later.";
  }
  if (message.includes("auth/popup-closed-by-user")) {
    return "Sign-in popup was closed. Please try again.";
  }
  if (message.includes("auth/account-exists-with-different-credential")) {
    return "An account already exists with this email using a different sign-in method.";
  }
  if (message.includes("auth/credential-already-in-use")) {
    return "This credential is already associated with another account.";
  }
  if (message.includes("auth/weak-password")) {
    return "Password is too weak. Use at least 6 characters.";
  }
  if (message.includes("auth/network-request-failed")) {
    return "Network error. Please check your connection.";
  }

  return message;
}
