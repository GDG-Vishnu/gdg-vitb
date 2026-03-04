"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase-client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import Image from "next/image";
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
  const [registrationDates, setRegistrationDates] = useState<
    Record<string, string>
  >({});
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

  // Fetch registered events from user's registrations subcollection
  const fetchRegisteredEvents = useCallback(async () => {
    if (!firebaseUser) {
      setRegisteredEvents([]);
      setEventsLoading(false);
      return;
    }

    setEventsLoading(true);
    try {
      // Read from client_users/{uid}/registrations subcollection
      const regCol = collection(
        db,
        "client_users",
        firebaseUser.uid,
        "registrations",
      );
      const regSnap = await getDocs(regCol);

      if (regSnap.empty) {
        setRegisteredEvents([]);
        setEventsLoading(false);
        return;
      }

      // For each registration, fetch event details + registration date
      const dates: Record<string, string> = {};
      const eventPromises = regSnap.docs.map(async (regDoc) => {
        const regData = regDoc.data();
        const eventId = regData.event_id as string;
        const eventRef = doc(db, "managed_events", eventId);
        const eventSnap = await getDoc(eventRef);

        if (!eventSnap.exists()) return null;

        // Fetch registeredAt from managed_events/{eventId}/registrations/{uid}_{eventId}
        try {
          const regId = `${firebaseUser!.uid}_${eventId}`;
          const eventRegRef = doc(
            db,
            "managed_events",
            eventId,
            "registrations",
            regId,
          );
          const eventRegSnap = await getDoc(eventRegRef);
          if (eventRegSnap.exists()) {
            const rd = eventRegSnap.data();
            const ts = rd.registeredAt;
            if (ts?.toDate) {
              dates[eventId] = ts.toDate().toISOString();
            } else if (typeof ts === "string") {
              dates[eventId] = ts;
            }
          }
        } catch {
          // Non-critical — date just won't show
        }

        const d = eventSnap.data();
        return {
          id: eventSnap.id,
          title: d.title ?? "",
          description: d.description ?? "",
          bannerImage: d.bannerImage ?? "",
          posterImage: d.posterImage ?? "",
          startDate: d.startDate?.toDate?.().toISOString() ?? null,
          endDate: d.endDate?.toDate?.().toISOString() ?? null,
          venue: d.venue ?? "",
          mode: d.mode ?? "OFFLINE",
          status: d.status ?? "UPCOMING",
          eventType: d.eventType ?? "WORKSHOP",
          maxParticipants: d.maxParticipants ?? 0,
          registrationStart:
            d.registrationStart?.toDate?.().toISOString() ?? null,
          registrationEnd: d.registrationEnd?.toDate?.().toISOString() ?? null,
          isRegistrationOpen: d.isRegistrationOpen ?? false,
          executiveBoard: d.executiveBoard ?? [],
          eventOfficials: d.eventOfficials ?? [],
          eligibilityCriteria: d.eligibilityCriteria ?? "",
          faqs: d.faqs ?? [],
          rules: d.rules ?? [],
          tags: d.tags ?? [],
          keyHighlights: d.keyHighlights ?? [],
        } as EventSerialized;
      });

      const events = (await Promise.all(eventPromises)).filter(
        Boolean,
      ) as EventSerialized[];
      setRegisteredEvents(events);
      setRegistrationDates(dates);
    } catch (err) {
      console.error("[Profile] Failed to fetch registered events:", err);
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
        socialMedia: values.socialMedia, // Save all social links including custom ones
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
        <main className="flex justify-center py-[16px] sm:py-[24px] md:py-[32px] min-[1440px]:py-[48px] px-[12px] sm:px-[16px] md:px-[20px]">
          {/* ── MAIN PROFILE CONTAINER ──────────────────── */}
          <div
            className="
              bg-[#111111]
              w-full max-w-[1388px]
              flex flex-col items-center
              p-[16px] sm:p-[20px] md:p-[28px] lg:p-[36px]
              min-[1440px]:py-[50px] min-[1440px]:px-[62px]
              gap-[16px] sm:gap-[20px] md:gap-[24px] min-[1440px]:gap-[29px]
              rounded-[14px] sm:rounded-[20px] md:rounded-[28px] min-[1440px]:rounded-[38px]
            "
          >
            {/* ── PROFILE HEADER ROW ───────────────────── */}
            <div
              className="
                w-full min-[1440px]:w-[1264px]
                min-[1440px]:h-[51px]
                flex items-center justify-between
              "
            >
              {/* PROFILE TEXT */}
              <h1
                className="
                  text-gray-200
                  text-[22px] sm:text-[24px] md:text-[26px] min-[1440px]:text-[30px]
                  font-[900]
                  leading-[146%]
                  tracking-[0.11em]
                "
              >
                PROFILE
              </h1>

              {/* EDIT BUTTON */}
              <button
                onClick={() => setMode("edit")}
                className="
                  flex items-center justify-center gap-[8px] sm:gap-[10px]
                  bg-[#FFE7A5] text-black
                  text-[16px] sm:text-[18px] min-[1440px]:text-[20px]
                  font-[900]
                  px-[20px] py-[10px]
                  sm:px-[28px] sm:py-[12px]
                  min-[1440px]:w-[165px] min-[1440px]:h-[55px]
                  border-[1px] border-[#1E1E1E]
                  shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]
                  hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none
                  transition-all duration-200
                  cursor-pointer
                "
              >
                <Image
                  src="/edit.png"
                  alt="Edit"
                  width={22}
                  height={22}
                  className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px] min-[1440px]:w-[22px] min-[1440px]:h-[22px] object-contain"
                />
                EDIT
              </button>
            </div>

            {/* ── PROFILE CARD ─────────────────────────── */}
            <ProfileCard user={userProfile} />

            {/* ── REGISTERED EVENTS ────────────────────── */}
            <RegisteredEvents
              events={registeredEvents}
              registrationDates={registrationDates}
              loading={eventsLoading}
            />
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
