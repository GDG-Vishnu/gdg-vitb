"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import {
  doc,
  updateDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase-client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import Footer from "@/components/footer/Footer";
import ProfileCard from "@/components/profile/ProfileCard";
import RegisteredEvents from "@/components/profile/RegisteredEvents";
import EditProfileForm from "@/components/profile/EditProfileForm";
import type { EditProfileSubmitData } from "@/components/profile/EditProfileForm";
import type { EventSerialized } from "@/types/event";

// ─── Page ───────────────────────────────────────────────────

export default function ProfilePage() {
  const { firebaseUser, userProfile, loading, refreshProfile } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const redirectTo = searchParams.get("redirect");

  const userId = params.userId as string;

  // View mode: "profile" (read-only card) or "edit" (form)
  const [mode, setMode] = useState<"profile" | "edit">("profile");
  const [submitting, setSubmitting] = useState(false);

  // Registered events
  const [registeredEvents, setRegisteredEvents] = useState<EventSerialized[]>(
    [],
  );
  const [eventsLoading, setEventsLoading] = useState(true);

  // If profile isn't completed yet, force edit mode
  useEffect(() => {
    if (userProfile && !userProfile.profileCompleted) {
      setMode("edit");
    }
  }, [userProfile]);

  // Auth guard — must be logged in, and the URL userId must match the logged-in user
  useEffect(() => {
    if (loading) return;
    if (!firebaseUser) {
      router.replace("/auth/login");
      return;
    }
    // If the userId in the URL doesn't match the logged-in user, redirect to their own profile
    if (firebaseUser.uid !== userId) {
      router.replace(`/profile/${firebaseUser.uid}`);
    }
  }, [loading, firebaseUser, router, userId]);

  // Fetch registered events from registrations collection
  const fetchRegisteredEvents = useCallback(async () => {
    if (!firebaseUser) {
      setRegisteredEvents([]);
      setEventsLoading(false);
      return;
    }

    setEventsLoading(true);
    try {
      const regQuery = query(
        collection(db, "registrations"),
        where("userId", "==", firebaseUser.uid),
      );
      const regSnap = await getDocs(regQuery);

      if (regSnap.empty) {
        setRegisteredEvents([]);
        setEventsLoading(false);
        return;
      }

      const registeredEventIds = regSnap.docs.map(
        (d) => d.data().eventId as string,
      );

      const res = await fetch("/api/events/list");
      if (!res.ok) throw new Error("Failed to fetch events");
      const data = await res.json();
      const allEvents: EventSerialized[] = data.events ?? data ?? [];
      const registered = allEvents.filter((e) =>
        registeredEventIds.includes(e.id),
      );
      setRegisteredEvents(registered);
    } catch (err) {
      console.error("[Profile] Failed to fetch events:", err);
      setRegisteredEvents([]);
    } finally {
      setEventsLoading(false);
    }
  }, [firebaseUser]);

  useEffect(() => {
    if (firebaseUser) {
      fetchRegisteredEvents();
    }
  }, [firebaseUser, fetchRegisteredEvents]);

  // ── Submit handler (passed to EditProfileForm) ──────────

  async function handleSubmit(values: EditProfileSubmitData) {
    if (!firebaseUser) {
      toast.error("You must be signed in.");
      return;
    }

    setSubmitting(true);

    try {
      const ref = doc(db, "client_users", firebaseUser.uid);
      await updateDoc(ref, {
        name: values.name,
        branch: values.branch,
        graduationYear: values.graduationYear,
        phoneNumber: values.phoneNumber,
        socialMedia: {
          linkedin: values.socialMedia.linkedin,
          github: values.socialMedia.github,
          twitter: values.socialMedia.twitter,
        },
        resumeUrl: values.resumeUrl,
        profileUrl: values.profileUrl,
        profileCompleted: true,
        updatedAt: serverTimestamp(),
      });

      await refreshProfile();
      toast.success("Profile saved!");

      if (!userProfile?.profileCompleted) {
        router.replace(redirectTo || "/");
      } else {
        setMode("profile");
      }
    } catch (err) {
      console.error("[Profile] update failed:", err);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Loading / guard ─────────────────────────────────────

  if (loading || !firebaseUser || !userProfile || firebaseUser.uid !== userId) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundColor: "white",
          backgroundImage:
            "linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      >
        <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  const isEditing = userProfile.profileCompleted;

  // ── Profile View (read-only) ────────────────────────────

  if (mode === "profile" && isEditing) {
    return (
      <div
        className="min-h-screen"
        style={{
          backgroundColor: "white",
          backgroundImage:
            "linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      >
        <main className="py-6 sm:py-8 md:py-12 px-3 sm:px-4">
          <div className="max-w-6xl mx-auto">
            {/* Outer container card */}
            <div className="bg-[#111111] border border-gray-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl">
              {/* Header row: PROFILE title + EDIT button */}
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h1 className="text-gray-200 text-xl sm:text-2xl font-bold tracking-widest uppercase">
                  Profile
                </h1>
                <button
                  onClick={() => setMode("edit")}
                  className="flex items-center gap-1.5 bg-[#FFE7A5] text-black text-sm font-bold px-5 py-2 border-2 border-[#1E1E1E] shadow-[2px_2px_0px_0px_#F0F0F0,2px_2px_0px_1px_#1E1E1E] hover:bg-[#ffd96e] transition-all duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                    <path d="m15 5 4 4" />
                  </svg>
                  EDIT
                </button>
              </div>

              {/* Profile details card */}
              <ProfileCard user={userProfile} />

              {/* Registered events card */}
              <RegisteredEvents
                events={registeredEvents}
                loading={eventsLoading}
              />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── Edit / Setup Form ───────────────────────────────────

  return (
    <>
      <EditProfileForm
        user={userProfile}
        isFirstSetup={!isEditing}
        submitting={submitting}
        onSubmit={handleSubmit}
        onCancel={() => setMode("profile")}
      />
      <Footer />
    </>
  );
}
