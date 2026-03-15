"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import {
  doc,
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
import { fetchEventList } from "@/lib/events-list-cache";

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
      // Read from client_users/{uid}/registrations subcollection — 1 read total.
      // Each doc stores a snapshot of the event fields written at registration time,
      // so there is NO follow-up getDoc per event (eliminates N+1).
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

      const dates: Record<string, string> = {};
      const events: EventSerialized[] = [];

      for (const regDoc of regSnap.docs) {
        const r = regDoc.data();
        const eventId = r.event_id as string;
        if (!eventId) continue;

        if (r.event_data) {
          dates[eventId] = r.event_data as string;
        }

        // Use the snapshot fields stored at registration time.
        // Falls back gracefully for older registrations that lack snapshot_ fields.
        events.push({
          id: eventId,
          title: r.snapshot_title ?? r.event_name ?? "",
          description: "",
          bannerImage: r.snapshot_bannerImage ?? "",
          posterImage: r.snapshot_posterImage ?? "",
          startDate: r.snapshot_startDate ?? null,
          endDate: r.snapshot_endDate ?? null,
          venue: r.snapshot_venue ?? "",
          mode: r.snapshot_mode ?? "OFFLINE",
          status: r.snapshot_status ?? "UPCOMING",
          eventType: r.snapshot_eventType ?? "WORKSHOP",
          maxParticipants: 0,
          registrationStart: null,
          registrationEnd: null,
          isRegistrationOpen: false,
          createdBy: "",
          executiveBoard: { organiser: "", coOrganiser: "", facilitator: "" },
          eventOfficials: [],
          eligibilityCriteria: { yearOfGrad: [], Dept: [] },
          faqs: [],
          rules: [],
          tags: [],
          keyHighlights: [],
          eventGallery: [],
          Theme: [],
        } as EventSerialized);
      }

      setRegisteredEvents(events);
      setRegistrationDates(dates);

      // ── Merge current status from the cached events list ──
      // snapshot_status is written at registration time and goes stale
      // (e.g. event moves UPCOMING → COMPLETED). The events-list-cache
      // uses an in-memory + API cache, so this costs 0 extra Firestore reads.
      fetchEventList<{ id: string; status: string }>()
        .then((allEvents) => {
          const statusMap = new Map(allEvents.map((e) => [e.id, e.status]));
          setRegisteredEvents((prev) =>
            prev.map((ev) => {
              const current = statusMap.get(ev.id);
              return current && current !== ev.status
                ? { ...ev, status: current as EventSerialized["status"] }
                : ev;
            }),
          );
        })
        .catch(() => {
          // Non-critical — snapshot status is used as fallback
        });
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
        admissionYear: values.admissionYear,
        isLateralEntry: values.isLateralEntry,
        currentYearOfStudy: values.currentYearOfStudy,
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
