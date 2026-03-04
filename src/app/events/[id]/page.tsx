"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/footer/Footer";
import {
  Camera,
  User,
  Users,
  Tag,
  ArrowLeft,
  Clock,
  Star,
  CheckCircle,
} from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import NextJsImage from "@/components/NextJsImage";
import { LoadingEventDetail } from "@/components/loadingPage";
import { checkRegistrationEligibility } from "@/services/registration.service";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase-client";

type Event = {
  id: string;
  title: string;
  description: string | null;
  date: string | null;
  endDate: string | null;
  venue: string | null;
  organizer: string | null;
  coOrganizer: string | null;
  keyHighlights: string[] | null;
  tags: string[] | null;
  status: string | null;
  imageUrl: string | null;
  rank: number;
  eventGallery: string[];
  coverUrl: string | null;
  theme: string[] | null;
  isDone: boolean;
  membersParticipated: number;
  registrationEnabled: boolean;
  teamSizeMin: number;
  teamSizeMax: number;
};

// Theme color helper - extracts colors from event Theme array
function getThemeColors(theme: string[] | null) {
  const defaultTheme = ["#f75590", "#f75590", "#ff7eb3", "#F44336", "#3D85C6"];
  const colors = theme && theme.length >= 5 ? theme : defaultTheme;
  return {
    primary: colors[0], // Main accent color
    secondary: colors[1], // Secondary accent
    accent: colors[2], // Lighter accent
    highlight: colors[3], // Highlight color
    bgAccent: colors[4], // Background accent
  };
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "TBA";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
const EventOpen = [
  "Ready to Join?",
  "Don't miss out on this amazing event. Register now and be part of something incredible!",
];
const EventClosed = [
  "Event Concluded",
  "Thank you for your interest. Stay tuned for more exciting events in the future!",
];

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { firebaseUser, signInWithGoogle } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [registering, setRegistering] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);

  // ── Check if user already registered for this event ─────

  useEffect(() => {
    if (!firebaseUser || !params.id) return;

    let mounted = true;
    const eventId = params.id as string;

    (async () => {
      try {
        const q = query(
          collection(db, "registrations"),
          where("userId", "==", firebaseUser.uid),
          where("eventId", "==", eventId),
        );
        const snap = await getDocs(q);
        if (mounted && !snap.empty) {
          setAlreadyRegistered(true);
        }
      } catch (err) {
        // Silently fail — non-critical check
        console.error("[Registration] check failed:", err);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [firebaseUser, params.id]);

  // ── Registration guard handler ──────────────────────────

  async function registerDirectly() {
    const user = auth.currentUser;
    if (!user || !params.id) return;

    const eventId = params.id as string;
    const regId = `${user.uid}_${eventId}`;
    const regRef = doc(db, "registrations", regId);
    const eventRef = doc(db, "events", eventId);

    await runTransaction(db, async (tx) => {
      const regSnap = await tx.get(regRef);
      if (regSnap.exists()) {
        // Already registered
        setAlreadyRegistered(true);
        return;
      }

      const eventSnap = await tx.get(eventRef);
      const currentCount =
        eventSnap.data()?.MembersParticipated ??
        eventSnap.data()?.membersParticipated ??
        0;

      tx.set(regRef, {
        userId: user.uid,
        eventId,
        eventTitle: event?.title ?? "Unknown Event",
        status: "registered",
        registeredAt: serverTimestamp(),
      });

      tx.update(eventRef, {
        MembersParticipated: currentCount + 1,
      });
    });

    setAlreadyRegistered(true);
    setEvent((prev) =>
      prev
        ? { ...prev, membersParticipated: prev.membersParticipated + 1 }
        : prev,
    );
    toast.success("You're registered! 🎉");
  }

  async function handleRegisterClick() {
    setRegistering(true);
    try {
      const result = await checkRegistrationEligibility();

      if (result.allowed) {
        await registerDirectly();
        return;
      }

      switch (result.reason) {
        case "not-logged-in":
          toast.info("Please sign in to register for this event.");
          try {
            await signInWithGoogle();
            // Re-check after sign-in
            const recheck = await checkRegistrationEligibility();
            if (recheck.allowed) {
              await registerDirectly();
            } else if (
              !recheck.allowed &&
              recheck.reason === "profile-incomplete"
            ) {
              toast.info("Complete your profile first to register.");
              router.push(
                `/profile/${auth.currentUser?.uid ?? ""}?redirect=/events/${params.id}`,
              );
            }
          } catch (signInErr) {
            toast.error(
              signInErr instanceof Error
                ? signInErr.message
                : "Sign-in failed.",
            );
          }
          break;

        case "profile-incomplete":
          toast.info("Complete your profile first to register for events.");
          router.push(
            `/profile/${firebaseUser?.uid ?? auth.currentUser?.uid ?? ""}?redirect=/events/${params.id}`,
          );
          break;

        case "blocked":
          toast.error("Your account has been blocked. Contact the admin.");
          break;
      }
    } catch (err) {
      console.error("[Registration] guard check failed:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setRegistering(false);
    }
  }

  useEffect(() => {
    let mounted = true;
    const eventId = params.id as string;

    (async () => {
      try {
        const res = await fetch(`/api/events/${eventId}`);
        if (!res.ok) {
          if (res.status === 404) throw new Error("Event not found");
          throw new Error("Failed to fetch event");
        }
        const data = await res.json();
        if (!mounted) return;
        setEvent(data);
      } catch (err: unknown) {
        console.error(err);
        if (mounted) {
          setError((err as Error)?.message || "Unknown error");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [params.id]);

  const statusColors: Record<string, string> = {
    Completed: "bg-green-100 text-green-800 border-green-200",
    Upcoming: "bg-blue-100 text-blue-800 border-blue-200",
    Ongoing: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Cancelled: "bg-red-100 text-red-800 border-red-200",
  };

  if (loading) {
    return (
      <div
        className="min-h-screen bg-white relative overflow-hidden"
        style={{
          backgroundColor: "white",
          backgroundImage: `linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      >
        <LoadingEventDetail variant="page" message="Loading Event Details..." />
        <Footer />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div
        className="min-h-screen bg-white relative overflow-hidden"
        style={{
          backgroundColor: "white",
          backgroundImage:
            "linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      >
        <div className="flex flex-col items-center justify-center py-40">
          <p className="text-red-500 font-medium text-lg mb-4">
            {error || "Event not found"}
          </p>
          <Link
            href="/events"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const statusClass =
    statusColors[event.status || ""] ||
    "bg-gray-100 text-gray-800 border-gray-200";

  // Get theme colors from event
  const theme = getThemeColors(event.theme);

  return (
    <div
      className="min-h-screen bg-white relative overflow-hidden"
      style={{
        backgroundColor: "white",
        backgroundImage:
          "linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      <main className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Back to Events */}
          <div className="mb-4">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium shadow-sm border border-stone-900 transition-all hover:opacity-80"
              style={{ backgroundColor: theme.primary, color: "#ffffff" }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Events
            </Link>
          </div>

          {/* Event Image Banner */}
          {(event.coverUrl || event.imageUrl) && (
            <div
              className="w-full mb-6 rounded-2xl overflow-hidden shadow-lg relative"
              style={{ maxWidth: 1394, height: 315 }}
            >
              {!imageLoaded && (
                <div className="absolute inset-0 bg-zinc-900 animate-pulse flex items-center justify-center z-10">
                  <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                </div>
              )}
              <picture>
                {/* Desktop image (≥1024px) */}
                {event.coverUrl && (
                  <source media="(min-width: 1024px)" srcSet={event.coverUrl} />
                )}

                {/* Mobile image (<1024px) */}
                <img
                  src={event.imageUrl || event.coverUrl || ""}
                  alt={event.title}
                  className={`w-full h-full object-cover transition-opacity duration-700 ${
                    imageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  style={{ width: "100%", height: 315 }}
                  onLoad={() => setImageLoaded(true)}
                />
              </picture>
            </div>
          )}
          <div className="flex flex-col sm:flex-row sm:justify-center sm:items-center justify-center items-center w-full">
            <ParticipantBadge
              text={`${event.membersParticipated}+`}
              icon={
                <img
                  src="/User.png"
                  alt="participants"
                  className="w-6 h-6 object-contain"
                />
              }
              bgColor={theme.primary}
            />

            <ParticipantBadge
              text={formatDate(event.date)}
              className="mt-3 sm:mt-0 sm:ml-4"
              icon={
                <img
                  src="/Calendar.png"
                  alt="date"
                  className="w-6 h-6 object-contain"
                />
              }
              bgColor={theme.primary}
            />

            <ParticipantBadge
              text={event.venue || "TBA"}
              className="mt-3 sm:mt-0 sm:ml-4"
              icon={
                <img
                  src="/Location.png"
                  alt="location"
                  className="w-6 h-6 object-contain"
                />
              }
              bgColor={theme.primary}
            />
          </div>
        </div>

        {/* Event Gallery Section */}
        {event.eventGallery && event.eventGallery.length > 0 && (
          <div className="max-w-7xl mx-auto mt-8">
            <div className="relative z-10 flex justify-center mb-6 flex-col items-center">
              <div
                style={{ background: theme.primary }}
                className="px-6 py-3 rounded-full mb-2 flex items-center gap-3 transform -rotate-3 hover:rotate-0 transition-transform duration-300 shadow-lg border-2 border-stone-900 relative"
              >
                <h1 className="text-2xl md:text-3xl font-bold text-stone-900 font-productSans">
                  Event Gallery
                </h1>
                <Camera className="w-7 h-7 text-stone-900" />

                {/* Connection line to next section */}
                <div
                  className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-1 h-6 rounded-full"
                  style={{ background: theme.primary }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {event.eventGallery.map((imageUrl, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-lg cursor-pointer hover:opacity-90 transition-opacity shadow-lg border border-stone-700"
                  onClick={() => {
                    setLightboxIndex(index);
                    setLightboxOpen(true);
                  }}
                >
                  <Image
                    src={imageUrl}
                    alt={`${event.title} Gallery ${index + 1}`}
                    width={400}
                    height={300}
                    className="w-full h-60 object-cover"
                  />
                </div>
              ))}
            </div>

            <Lightbox
              open={lightboxOpen}
              close={() => setLightboxOpen(false)}
              index={lightboxIndex}
              slides={event.eventGallery.map((imageUrl) => ({
                src: imageUrl,
                width: 1600,
                height: 900,
              }))}
              plugins={[Thumbnails, Zoom]}
              render={{ slide: NextJsImage }}
            />
          </div>
        )}

        <div className="max-w-7xl mx-auto rounded-[32px] overflow-hidden bg-[#111111] px-6 md:px-12 lg:px-20 py-8 md:py-14 mt-4">
          <div className="relative rounded-[32px]">
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)`,
                backgroundSize: "20px 20px, 40px 40px",
                backgroundPosition: "0 0, 10px 10px",
                opacity: 1,
                pointerEvents: "none",
                borderRadius: 28,
              }}
            />

            <div className="relative z-10 flex flex-col items-center gap-6">
              <h1 className="text-3xl font-bold text-white font-productSans">
                About the Event{" "}
              </h1>
              <div>
                <p className="text-base md:text-lg text-stone-300 md:max-w-4xl max-w-3xl mx-auto">
                  {event.description}
                </p>
              </div>
              <div className="flex justify-end items-end">
                <img
                  src="https://res.cloudinary.com/duvr3z2z0/image/upload/v1764655440/Group_6_mczuk3.png"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
        {/*     <BentoGrid tiles={tiles} */}

        <div className="max-w-7xl mx-auto rounded-[32px] overflow-hidden bg-[#111111] px-6 md:px-12 lg:px-20 py-8 md:py-14 mt-4">
          <div className="relative rounded-[32px]">
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)`,
                backgroundSize: "20px 20px, 40px 40px",
                backgroundPosition: "0 0, 10px 10px",
                opacity: 1,
                pointerEvents: "none",
                borderRadius: 28,
              }}
            />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Half - Key Highlights */}
              {event.keyHighlights && event.keyHighlights.length > 0 && (
                <div>
                  <div className="flex items-center mb-6">
                    <Star className="w-10 h-10 text-yellow-400" />
                    <h2 className="text-2xl md:text-3xl font-semibold text-white ml-3">
                      Key Highlights
                    </h2>
                  </div>

                  <div className="flex flex-col gap-3">
                    {event.keyHighlights.map((highlight, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 p-4 bg-[#1a1a1a] rounded-2xl border border-stone-800 transition-colors"
                        style={{ borderColor: "transparent" }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.borderColor = theme.primary)
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.borderColor = "transparent")
                        }
                      >
                        <span
                          className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-[#1a1a1a] rounded-full text-sm font-bold"
                          style={{ backgroundColor: theme.primary }}
                        >
                          {index + 1}
                        </span>
                        <span className="text-stone-300 text-sm md:text-base">
                          {highlight}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Right Half - Organizers + Tags */}
              <div className="flex flex-col gap-8">
                {/* Organizers */}
                {(event.organizer || event.coOrganizer) && (
                  <div>
                    <div className="flex items-center mb-6">
                      <Users className="w-10 h-10 text-green-400" />
                      <h2 className="text-2xl md:text-3xl font-semibold text-white ml-3">
                        Organized By
                      </h2>
                    </div>

                    <div className="flex flex-wrap gap-4">
                      {event.organizer && (
                        <div className="flex items-center gap-3 p-4 bg-[#1a1a1a] rounded-2xl border border-stone-800 flex-1 min-w-[200px]">
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: theme.primary }}
                          >
                            <User className="w-6 h-6 text-[#1a1a1a]" />
                          </div>
                          <div>
                            <p className="text-stone-400 text-xs">Organizer</p>
                            <p className="text-white text-base font-semibold">
                              {event.organizer}
                            </p>
                          </div>
                        </div>
                      )}
                      {event.coOrganizer && (
                        <div className="flex items-center gap-3 p-4 bg-[#1a1a1a] rounded-2xl border border-stone-800 flex-1 min-w-[200px]">
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: theme.highlight }}
                          >
                            <User className="w-6 h-6 text-[#1a1a1a]" />
                          </div>
                          <div>
                            <p className="text-stone-400 text-xs">
                              Co-Organizer
                            </p>
                            <p className="text-white text-base font-semibold">
                              {event.coOrganizer}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {event.tags && event.tags.length > 0 && (
                  <div>
                    <div className="flex items-center mb-6">
                      <Tag className="w-10 h-10 text-blue-400" />
                      <h2 className="text-2xl md:text-3xl font-semibold text-white ml-3">
                        Tags
                      </h2>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {event.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-[#1a1a1a] text-stone-300 rounded-full text-sm font-medium border border-stone-700 hover:text-white transition-colors"
                          style={{ borderColor: "rgb(68 64 60)" }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.borderColor = theme.primary)
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.borderColor =
                              "rgb(68 64 60)")
                          }
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Register / CTA Section */}
        <div
          className="max-w-7xl mx-auto rounded-[32px] overflow-hidden px-6 md:px-12 lg:px-20 py-10 md:py-16 mt-4 mb-8"
          style={{
            background: `linear-gradient(to right, ${theme.primary}, ${theme.accent}, ${theme.primary})`,
          }}
        >
          <div className="relative rounded-[32px]">
            <div className="relative z-10 flex flex-col items-center text-center">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                {event.isDone ? EventClosed[0] : EventOpen[0]}
              </h2>
              <p className="text-white/90 text-lg md:text-xl mb-8 max-w-2xl">
                {event.isDone ? EventClosed[1] : EventOpen[1]}
              </p>
              <div className="flex wrap justify-center gap-4">
                {!event.isDone && !alreadyRegistered && (
                  <button
                    onClick={handleRegisterClick}
                    disabled={registering}
                    className="px-8 py-4 bg-[#1a1a1a] text-white rounded-full text-lg font-semibold hover:bg-[#2a2a2a] transition-colors flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <Star className="w-5 h-5" />
                    {registering ? "Checking…" : "Register Now"}
                  </button>
                )}
                {!event.isDone && alreadyRegistered && (
                  <div className="px-8 py-4 bg-green-600 text-white rounded-full text-lg font-semibold flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Already Registered
                  </div>
                )}
                <Link
                  href="/events"
                  className="px-8 py-4 bg-white/20 text-white rounded-full text-lg font-semibold hover:bg-white/30 transition-colors flex items-center gap-2 backdrop-blur-sm"
                >
                  <ArrowLeft className="w-5 h-5" />
                  View All Events
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
interface ParticipantBadgeProps {
  text?: string | number;
  className?: string;
  icon?: React.ReactNode;
  bgColor?: string;
}

function ParticipantBadge({
  text = "500+",
  className = "",
  icon,
  bgColor = "#f75590",
}: ParticipantBadgeProps) {
  return (
    <div
      role="group"
      aria-label={text ? `badge ${text}` : "badge"}
      className={`flex items-center bg-[#1a1a1a] rounded-full pr-3 md:pr-6 mb-4 ${className}`}
      style={{ height: "48px" }}
    >
      {/* Colored circle with icon */}
      <div
        className="flex-shrink-0 flex justify-center items-center rounded-full m-1"
        // responsive sizes: w-10 h-10 on mobile, w-11 h-11 on md+
        style={{
          width: 40, // keeps exact pixel width if you prefer; could replace with className "w-10 h-10 md:w-11 md:h-11"
          height: 40,
          backgroundColor: bgColor,
        }}
      >
        {icon ? (
          icon
        ) : (
          <User
            className="w-6 h-6 md:w-8 md:h-8 text-[#1a1a1a]"
            strokeWidth={2}
          />
        )}
      </div>

      {/* Count text */}
      <span
        className="text-white font-semibold ml-3 md:ml-4 truncate"
        // responsive font-size: text-lg on mobile, text-2xl from md up
        style={{ fontSize: 18 }}
      >
        {text}
      </span>
    </div>
  );
}
