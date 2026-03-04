"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

// ─── Spinner (shared) ───────────────────────────────────────

function FullPageSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
    </div>
  );
}

// ─── ProtectedRoute ─────────────────────────────────────────
// Wraps pages that require authentication.
// Redirects to /auth/login if the user is not logged in.

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { firebaseUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !firebaseUser) {
      router.replace("/auth/login");
    }
  }, [loading, firebaseUser, router]);

  if (loading || !firebaseUser) {
    return <FullPageSpinner />;
  }

  return <>{children}</>;
}

// ─── GuestRoute ─────────────────────────────────────────────
// Wraps auth pages (login, signup, forgot-password).
// Redirects to / (home) if the user is already logged in.

export function GuestRoute({ children }: { children: React.ReactNode }) {
  const { firebaseUser, userProfile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && firebaseUser) {
      // If profile is not completed, send to profile page first
      if (userProfile && !userProfile.profileCompleted) {
        router.replace(`/profile/${firebaseUser.uid}`);
      } else {
        router.replace("/");
      }
    }
  }, [loading, firebaseUser, userProfile, router]);

  if (loading) {
    return <FullPageSpinner />;
  }

  // If user is logged in, show spinner while redirecting
  if (firebaseUser) {
    return <FullPageSpinner />;
  }

  return <>{children}</>;
}
