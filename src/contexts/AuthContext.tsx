"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase-client";
import type { UserSerialized } from "@/types/user";
import { isAllowedDomain } from "@/lib/auth-helpers";

// ─── Constants ──────────────────────────────────────────────

const USERS_COLLECTION = "client_users";

// ─── Context Types ──────────────────────────────────────────

interface AuthContextValue {
  /** Firebase auth user (null when logged out, undefined while loading) */
  firebaseUser: FirebaseUser | null;
  /** Firestore user profile (null when not loaded / logged out) */
  userProfile: UserSerialized | null;
  /** True while the initial auth state is being resolved */
  loading: boolean;
  /** Sign in with Google — rejects if domain is not allowed */
  signInWithGoogle: () => Promise<void>;
  /** Sign out */
  signOut: () => Promise<void>;
  /** Re-fetch the Firestore user profile (call after profile update) */
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ─── Provider ───────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserSerialized | null>(null);
  const [loading, setLoading] = useState(true);

  // ── Fetch / create Firestore profile ──────────────────────

  const ensureUserDocument = useCallback(
    async (user: FirebaseUser): Promise<UserSerialized> => {
      const ref = doc(db, USERS_COLLECTION, user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        return {
          id: snap.id,
          name: data.name,
          email: data.email,
          branch: data.branch ?? "",
          graduationYear: data.graduationYear ?? 0,
          phoneNumber: data.phoneNumber ?? "",
          profileUrl: data.profileUrl ?? "",
          socialMedia: data.socialMedia ?? {},
          resumeUrl: data.resumeUrl ?? null,
          participations: data.participations ?? [],
          role: data.role ?? "user",
          isBlocked: data.isBlocked ?? false,
          profileCompleted: data.profileCompleted ?? false,
          createdAt:
            data.createdAt?.toDate?.().toISOString() ??
            new Date().toISOString(),
          updatedAt:
            data.updatedAt?.toDate?.().toISOString() ??
            new Date().toISOString(),
        };
      }

      // First login — create the user document
      const newUser = {
        name: user.displayName ?? "",
        email: user.email ?? "",
        profileUrl: user.photoURL ?? "",
        branch: "",
        graduationYear: 0,
        phoneNumber: "",
        socialMedia: {},
        resumeUrl: "",
        participations: [],
        role: "user" as const,
        isBlocked: false,
        profileCompleted: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(ref, newUser);

      // Return a serialized version (timestamps not yet resolved server-side)
      const now = new Date().toISOString();
      return {
        id: user.uid,
        name: newUser.name,
        email: newUser.email,
        profileUrl: newUser.profileUrl,
        branch: "",
        graduationYear: 0,
        phoneNumber: "",
        socialMedia: {},
        resumeUrl: "",
        participations: [],
        role: "user",
        isBlocked: false,
        profileCompleted: false,
        createdAt: now,
        updatedAt: now,
      };
    },
    [],
  );

  // ── Listen for auth state changes ────────────────────────

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);

      if (user) {
        try {
          const profile = await ensureUserDocument(user);
          setUserProfile(profile);
        } catch (err) {
          console.error("[AuthContext] Failed to load user profile:", err);
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, [ensureUserDocument]);

  // ── Sign in ──────────────────────────────────────────────

  const signInWithGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    // Hint the domain so Google shows only matching accounts
    provider.setCustomParameters({ hd: "vishnu.edu.in" });

    const result = await signInWithPopup(auth, provider);
    const email = result.user.email ?? "";

    if (!isAllowedDomain(email)) {
      // Sign out immediately — domain not allowed
      await firebaseSignOut(auth);
      throw new Error(
        "Only @vishnu.edu.in email addresses are allowed to sign in.",
      );
    }

    // Profile creation is handled by onAuthStateChanged above
  }, []);

  // ── Sign out ─────────────────────────────────────────────

  const signOut = useCallback(async () => {
    // Clear state immediately for instant UI feedback
    setFirebaseUser(null);
    setUserProfile(null);
    // Then sign out of Firebase in the background
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      console.error("[AuthContext] sign-out error:", err);
    }
  }, []);

  // ── Refresh profile ──────────────────────────────────────

  const refreshProfile = useCallback(async () => {
    if (!firebaseUser) return;
    try {
      const profile = await ensureUserDocument(firebaseUser);
      setUserProfile(profile);
    } catch (err) {
      console.error("[AuthContext] Failed to refresh profile:", err);
    }
  }, [firebaseUser, ensureUserDocument]);

  // ── Value ────────────────────────────────────────────────

  const value = useMemo<AuthContextValue>(
    () => ({
      firebaseUser,
      userProfile,
      loading,
      signInWithGoogle,
      signOut,
      refreshProfile,
    }),
    [
      firebaseUser,
      userProfile,
      loading,
      signInWithGoogle,
      signOut,
      refreshProfile,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hook ───────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an <AuthProvider>");
  }
  return ctx;
}
