"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/footer/Footer";
import { Button } from "@/components/ui/button";
import { LoadingEventDetail } from "@/components/loadingPage";
import { motion } from "framer-motion";
import { checkRegistrationEligibility } from "@/services/registration.service";
import { useAuth } from "@/contexts/AuthContext";
import { getCurrentYearOfStudy } from "@/lib/roll-number";
import { toast } from "sonner";
import {
  doc,
  getDoc,
  collection,
  getCountFromServer,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase-client";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Users,
  Star,
  CheckCircle,
  ChevronDown,
  Github,
  User,
  Globe,
  Monitor,
  Wifi,
} from "lucide-react";

/* ─── Types ──────────────────────────────────────────────── */

type EventOfficial = {
  role: "GUEST" | "SPEAKER" | "JURY";
  name: string;
  email: string;
  bio?: string;
  expertise?: string;
  imageUrl?: string;
  profileUrl?: string;
  linkedinUrl?: string;
};

type OngoingEvent = {
  id: string;
  title: string;
  description: string | null;
  bannerImage: string | null;
  posterImage: string | null;
  startDate: string | null;
  endDate: string | null;
  venue: string | null;
  mode: string;
  status: string;
  eventType: string;
  maxParticipants: number;
  registrationStart: string | null;
  registrationEnd: string | null;
  isRegistrationOpen: boolean;
  tags: string[] | null;
  keyHighlights: string[] | null;
  eligibilityCriteria: {
    yearOfGrad: boolean[];
    Dept: string[];
  };
  executiveBoard: {
    organiser: string;
    coOrganiser: string;
    facilitator: string;
  };
  eventOfficials: EventOfficial[];
  faqs: { question: string; answer: string }[];
  rules: { rule: string }[];
};

/* ─── Helpers ────────────────────────────────────────────── */

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "TBA";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(dateStr: string | null): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}


function getRoleBadgeColor(role: string) {
  switch (role) {
    case "SPEAKER":
      return "bg-blue-100 border-blue-500 text-blue-800";
    case "JURY":
      return "bg-red-100 border-red-500 text-red-800";
    case "GUEST":
      return "bg-yellow-100 border-yellow-500 text-yellow-800";
    default:
      return "bg-stone-100 border-stone-400 text-stone-700";
  }
}

/* ═══════════════════════════════════════════════════════════
   EVENT HERO CARD
   Flex-row: poster left (fixed) | content right (grows)
   ═══════════════════════════════════════════════════════════ */

function EventHeroCard({
  event,
  registering,
  alreadyRegistered,
  onRegisterClick,
  isEligible,
  eligibilityChecking,
}: {
  event: OngoingEvent;
  registering: boolean;
  alreadyRegistered: boolean;
  onRegisterClick: () => void;
  isEligible: boolean;
  eligibilityChecking: boolean;
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-5 sm:p-7 lg:p-10 bg-[#C3ECF6] min-h-[420px] sm:min-h-[500px]">
      {/* ── Left: Poster image ────────────────────────────── */}
      {event.posterImage && (
        <div className="w-full sm:w-[240px] lg:w-[320px] flex-shrink-0">
          <img
            src={event.posterImage}
            alt={event.title}
            className="w-full h-72 sm:h-full object-cover border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          />
        </div>
      )}

      {/* ── Right: Content (grows) ────────────────────────── */}
      <div className="flex flex-col gap-4 flex-1 min-w-0">
        {/* Title */}
        <h1 className="text-lg sm:text-xl lg:text-4xl font-bold text-black font-productSans leading-tight">
          {event.title.toUpperCase()}
        </h1>

        {/* Description — full, no clamp */}
        {event.description && (
          <p className="text-stone-700 font-productSans text-xs sm:text-sm leading-relaxed">
            {event.description}
          </p>
        )}

        {/* Details grid: 1 col on mobile, 2 cols on sm+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          {event.startDate && (
            <div className="flex items-center gap-2 text-black bg-white border-2 border-black px-3 py-2 text-xs sm:text-sm font-productSans font-semibold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 flex-shrink-0" />
              <span className="truncate">
                {formatDate(event.startDate)} - {formatDate(event.endDate)}
              </span>
            </div>
          )}
          {event.startDate && formatTime(event.startDate) && (
            <div className="flex items-center gap-2 text-black bg-white border-2 border-black px-3 py-2 text-xs sm:text-sm font-productSans font-semibold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600 flex-shrink-0" />
              <span className="truncate">
                {formatTime(event.startDate)} - {formatTime(event.endDate)}
              </span>
            </div>
          )}
          {event.venue && (
            <div className="flex items-center gap-2 text-black bg-white border-2 border-black px-3 py-2 text-xs sm:text-sm font-productSans font-semibold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500 flex-shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>
          )}
          {event.maxParticipants > 0 && (
            <div className="flex items-center gap-2 text-black bg-white border-2 border-black px-3 py-2 text-xs sm:text-sm font-productSans font-semibold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
              <span className="truncate">{event.maxParticipants} seats</span>
            </div>
          )}
        </div>

        {/* Register button */}
        <div className="mt-auto w-full">
          {eligibilityChecking ? (
            <div className="flex items-center justify-center gap-1.5 w-full px-4 py-2.5 bg-yellow-100 border-2 border-black text-yellow-800 font-bold text-sm font-productSans shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] animate-pulse">
              Checking eligibility…
            </div>
          ) : alreadyRegistered ? (
            <div className="flex items-center justify-center gap-2 w-full px-5 py-2.5 bg-green-100 border-2 border-black text-green-800 font-bold text-sm font-productSans shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <CheckCircle className="w-4 h-4" />
              You&apos;re Registered ✓
            </div>
          ) : event.isRegistrationOpen && isEligible ? (
            <Button
              variant="default"
              size="lg"
              className="w-full"
              onClick={onRegisterClick}
              disabled={registering}
            >
              {registering ? "Registering…" : "Register Now →"}
            </Button>
          ) : event.isRegistrationOpen && !isEligible ? (
            <div className="flex items-center justify-center gap-1.5 w-full px-4 py-2.5 bg-red-100 border-2 border-black text-red-800 font-bold text-sm font-productSans shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              Not Eligible for this Event
            </div>
          ) : (
            <div className="flex items-center justify-center gap-1.5 w-full px-4 py-2.5 bg-stone-100 border-2 border-black text-stone-700 font-bold text-sm font-productSans shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              Registration Closed
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ORGANIZING TEAM CARD
   ═══════════════════════════════════════════════════════════ */

function OrganizingTeamCard({
  executiveBoard,
}: {
  executiveBoard: OngoingEvent["executiveBoard"];
}) {
  const members = [
    { label: "Organizer", name: executiveBoard.organiser },
    { label: "Co-Organizer", name: executiveBoard.coOrganiser },
    { label: "Facilitator", name: executiveBoard.facilitator },
  ].filter((m) => m.name);

  if (members.length === 0) return null;

  return (
    <div className="flex flex-col items-center gap-10 p-10 border-[2px] border-black bg-[#C3ECF6] shadow-[6px_6px_0px_#000] h-full">
      <h3 className="text-[28px] font-bold  text-[#1E1E1E] tracking-wide text-center font-productSans">
        ORGANIZING TEAM
      </h3>
      <div className="flex flex-col gap-10 w-full items-center">
        {members.map((member, i) => (
          <div
            key={i}
            className="bg-[#FFFFFF] border-[2px] border-black shadow-[5px_5px_0px_#000] px-16 py-6 flex flex-col items-center gap-2"
          >
            <p className="text-[14px] uppercase tracking-widest text-gray-600 font-productSans">
              {member.label}
            </p>
            <p className="text-[22px] font-semibold text-[#1E1E1E] font-productSans">
              {member.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ELIGIBILITY CARD
   ═══════════════════════════════════════════════════════════ */

function EligibilityCard({
  eligibilityCriteria,
}: {
  eligibilityCriteria: OngoingEvent["eligibilityCriteria"];
}) {
  const departments = eligibilityCriteria?.Dept?.filter(Boolean) ?? [];
  const years = eligibilityCriteria?.yearOfGrad ?? [];

  const ordinals = ["1st", "2nd", "3rd", "4th"];
  const eligibleYears = years
    .map((allowed, i) => (allowed ? ordinals[i] : null))
    .filter(Boolean) as string[];

  const yearsValue =
    eligibleYears.length > 0 ? eligibleYears.join(", ") : "All Years";
  const branchesValue =
    departments.length > 0 ? departments.join(", ") : "All Branches";

  return (
    <div className="flex flex-col items-center gap-10 p-10 border-[2px] border-black bg-[#FFE7A5] shadow-[6px_6px_0px_#000] h-full">
      <h3 className="text-[28px] font-bold tracking-wide text-center font-productSans text-[#1E1E1E]">
        ELIGIBILITY
      </h3>

      <div className="flex flex-col items-center gap-12 w-full">
        <div className="bg-[#FFFFFF] border-[2px] border-black shadow-[5px_5px_0px_#000] px-16 py-8 flex flex-col items-center gap-3 text-center w-full">
          <p className="text-[16px] uppercase tracking-widest text-gray-700 font-productSans">
            YEARS
          </p>
          <p className="text-[24px] font-semibold text-black font-productSans">
            {yearsValue}
          </p>
        </div>

        <div className="bg-[#FFFFFF] border-[2px] border-black shadow-[5px_5px_0px_#000] px-16 py-8 flex flex-col items-center gap-3 text-center w-full">
          <p className="text-[16px] uppercase tracking-widest text-gray-700 font-productSans">
            BRANCHES
          </p>
          <p className="text-[24px] font-semibold text-black font-productSans">
            {branchesValue}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SPEAKER CARD (alternating layout)
   ═══════════════════════════════════════════════════════════ */

const SPEAKER_IMAGE_FALLBACKS: Record<string, string> = {
  narashima:
    "https://res.cloudinary.com/dlupkibvq/image/upload/v1767886987/ngv6uefackvxzjz1rozc.png",
  narasimha:
    "https://res.cloudinary.com/dlupkibvq/image/upload/v1767886987/ngv6uefackvxzjz1rozc.png",
  naidu:
    "https://res.cloudinary.com/dlupkibvq/image/upload/v1767886987/ngv6uefackvxzjz1rozc.png",
  ganesh:
    "https://res.cloudinary.com/dlupkibvq/image/upload/Ganesh_Android_lead_ctuyis.png",
};

function resolveSpeakerImage(official: EventOfficial): string | null {
  if (official.imageUrl) return official.imageUrl;
  const words = official.name.toLowerCase().split(/\s+/);
  for (const word of words) {
    if (SPEAKER_IMAGE_FALLBACKS[word]) return SPEAKER_IMAGE_FALLBACKS[word];
  }
  return null;
}

function SpeakerCard({
  official,
  reverse = false,
}: {
  official: EventOfficial;
  reverse?: boolean;
}) {
  const image = resolveSpeakerImage(official);

  return (
    <div
      className={`flex flex-col gap-10 p-1 border-[2px] border-black bg-white shadow-[6px_6px_0px_#000] ${
        reverse ? "sm:flex-row-reverse" : "sm:flex-row"
      } items-center`}
    >
      {/* SpeakerImageContainer */}
      <div className="w-full sm:w-[340px] h-[380px] border-[2px] border-black overflow-hidden flex-shrink-0 flex items-center justify-center bg-stone-200">
        {image ? (
          <img
            src={image}
            alt={official.name}
            className="w-full h-full object-cover object-top"
          />
        ) : (
          <User className="w-20 h-20 text-stone-400" />
        )}
      </div>

      {/* SpeakerContent */}
      <div className="flex flex-col gap-4 w-full max-w-[600px]">
        {/* SpeakerName */}
        <h4 className="text-[28px] font-semibold text-black font-productSans">
          {official.name}
        </h4>

        {/* SpeakerRole */}
        {official.expertise && (
          <p className="text-[16px] text-gray-600 font-productSans">
            {official.expertise}
          </p>
        )}

        {/* Role badge */}
        <span
          className={`text-xs font-bold px-3 py-1 border-[2px] border-black w-fit font-productSans ${getRoleBadgeColor(official.role)}`}
        >
          {official.role}
        </span>

        {/* SpeakerDescription */}
        {official.bio && (
          <p className="text-[15px] leading-relaxed text-gray-700 font-productSans line-clamp-6">
            {official.bio}
          </p>
        )}

        {/* SocialButtonsRow */}
        {(official.linkedinUrl || official.profileUrl) && (
          <div className="flex flex-wrap gap-4 mt-2">
            {official.linkedinUrl && (
              <a
                href={official.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 border-[2px] text-black border-black bg-[#F8D8D8] px-6 py-2 shadow-[4px_4px_0px_#000] font-medium font-productSans text-sm"
              >
                <img src="/linkedin.png" alt="LinkedIn" className="w-6 h-6" />
                LinkedIn
              </a>
            )}
            {official.profileUrl && (
              <a
                href={official.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 border-[2px] text-black border-black bg-[#F8D8D8] px-6 py-2 shadow-[4px_4px_0px_#000] font-medium font-productSans text-sm"
              >
                <Github className="w-5 h-5" />
                Github
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function SpeakersSection({ officials }: { officials: EventOfficial[] }) {
  if (!officials || officials.length === 0) return null;
  return (
    <div className="flex flex-col items-center gap-10 p-2 border-[2px] border-black bg-[#FFE7A5] shadow-[6px_6px_0px_#000]">
      <h3 className="text-[28px] font-bold tracking-wide text-center font-productSans text-[#1E1E1E]">
        SPEAKERS & GUESTS
      </h3>
      <div className="flex flex-col gap-8 w-full">
        {officials.map((official, i) => (
          <SpeakerCard key={i} official={official} reverse={i % 2 !== 0} />
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   KEY HIGHLIGHTS
   ═══════════════════════════════════════════════════════════ */

function KeyHighlightsSection({ highlights }: { highlights: string[] }) {
  if (!highlights || highlights.length === 0) return null;
  return (
    <div className="flex flex-col justify-center items-center gap-4 border-2 text-center border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-5 sm:p-6 bg-[#CCF6C5]">
      <h3 className="text-lg lg:text-3xl font-bold text-black font-productSans flex items-center gap-2">
        KEY HIGHLIGHTS
      </h3>
      <div className="flex flex-wrap w-full flex-col gap-3">
        {highlights.map((highlight, i) => (
          <div
            key={i}
            className="flex items-start gap-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] p-3 bg-white flex-1 min-w-[200px]"
          >
            <span className="flex-shrink-0 w-6 h-6 bg-[#CCF6C5]  border-2 border-black rounded-none flex items-center justify-center text-black text-xs font-bold">
              {i + 1}
            </span>
            <span className="text-stone-800 font-productSans text-sm leading-relaxed">
              {highlight}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   RULES SECTION
   ═══════════════════════════════════════════════════════════ */

function RulesSection({ rules }: { rules: { rule: string }[] }) {
  if (!rules || rules.length === 0) return null;
  return (
    <div className="flex flex-col items-center gap-4 border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-5 sm:p-6  bg-[#F8D8D8]">
      <h3 className="text-lg lg:text-3xl font-bold text-black font-productSans">
        Rules & Guidelines
      </h3>
      <div className="flex flex-col w-full gap-2">
        {rules.map((r, i) => (
          <div
            key={i}
            className="flex items-start gap-3 bg-white border-2 border-black p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            <span className="flex-shrink-0 w-6 h-6 bg-[#F8D8D8] text-black border-2 border-black flex items-center justify-center text-xs font-bold">
              {i + 1}
            </span>
            <span className="text-stone-800 font-productSans text-sm leading-relaxed">
              {r.rule}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   FAQ SECTION
   ═══════════════════════════════════════════════════════════ */

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      onClick={() => setOpen(!open)}
      className={`w-full text-left border-2 border-black p-4 transition-all duration-200 ${
        open
          ? "bg-yellow-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          : "bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-semibold text-black font-productSans text-sm md:text-base">
          {question}
        </span>
        <div className="flex-shrink-0 bg-black text-white w-7 h-7 flex items-center justify-center border-2 border-black">
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </div>
      </div>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? "600px" : "0px" }}
      >
        <p className="pt-3 text-stone-700 font-productSans text-sm leading-relaxed">
          {answer}
        </p>
      </div>
    </button>
  );
}

function FAQSection({
  faqs,
}: {
  faqs: { question: string; answer: string }[];
}) {
  if (!faqs || faqs.length === 0) return null;
  return (
    <div className="flex flex-col items-center gap-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-5 sm:p-6 bg-pink-200">
      <h3 className="text-lg lg:text-3xl font-bold text-black font-productSans">
        {" "}
        FAQs
      </h3>
      <div className="flex flex-col gap-3">
        {faqs.map((faq, i) => (
          <FAQItem key={i} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════ */

export default function OngoingEventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const {
    firebaseUser,
    userProfile,
    signInWithGoogle,
    loading: authLoading,
  } = useAuth();

  const [event, setEvent] = useState<OngoingEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registering, setRegistering] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);

  const eventId = params.id as string;

  /* ── Check if already registered ─────────────────────── */
  useEffect(() => {
    if (!firebaseUser || !eventId) return;
    let mounted = true;
    (async () => {
      try {
        const userRegRef = doc(
          db,
          "client_users",
          firebaseUser.uid,
          "registrations",
          eventId,
        );
        const snap = await getDoc(userRegRef);
        if (mounted && snap.exists()) setAlreadyRegistered(true);
      } catch {
        /* non-critical */
      }
    })();
    return () => {
      mounted = false;
    };
  }, [firebaseUser, eventId]);

  /* ── Fetch event ──────────────────────────────────────── */
  useEffect(() => {
    if (!eventId) return;
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`/api/events/${eventId}`);
        if (!res.ok)
          throw new Error(
            res.status === 404 ? "Event not found" : "Failed to fetch event",
          );
        const data = await res.json();
        if (mounted) setEvent(data);
      } catch (err: unknown) {
        if (mounted)
          setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [eventId]);

  /* ── Eligibility check ────────────────────────────────── */
  function isUserEligible(): boolean {
    if (!event || !userProfile) return true; // optimistic when no profile loaded
    const admissionYear = userProfile.admissionYear ?? 0;
    const isLateralEntry = userProfile.isLateralEntry ?? false;
    const currentYear =
      admissionYear > 0
        ? getCurrentYearOfStudy(admissionYear, isLateralEntry)
        : null;
    const yearOfGrad = event.eligibilityCriteria?.yearOfGrad ?? [];
    if (yearOfGrad.length > 0 && currentYear != null) {
      const idx = currentYear - 1;
      if (idx < 0 || idx >= yearOfGrad.length || !yearOfGrad[idx]) return false;
    }
    const eligibleDepts =
      event.eligibilityCriteria?.Dept?.filter(Boolean) ?? [];
    if (eligibleDepts.length > 0 && userProfile.branch) {
      if (!eligibleDepts.includes(userProfile.branch)) return false;
    }
    return true;
  }

  /* ── Registration ─────────────────────────────────────── */
  async function registerDirectly() {
    const user = auth.currentUser;
    if (!user || !event) return;
    const regId = `${user.uid}_${eventId}`;
    const phoneNumber: string = userProfile?.phoneNumber ?? "";

    if (event.maxParticipants > 0) {
      const regColRef = collection(
        db,
        "managed_events",
        eventId,
        "registrations",
      );
      const countSnap = await getCountFromServer(regColRef);
      if (countSnap.data().count >= event.maxParticipants) {
        toast.error(`Registrations full (${event.maxParticipants} max).`);
        return;
      }
    }

    const eventRegRef = doc(
      db,
      "managed_events",
      eventId,
      "registrations",
      regId,
    );
    const userRegRef = doc(
      db,
      "client_users",
      user.uid,
      "registrations",
      eventId,
    );

    await runTransaction(db, async (tx) => {
      const snap = await tx.get(userRegRef);
      if (snap.exists()) {
        setAlreadyRegistered(true);
        return;
      }
      tx.set(eventRegRef, {
        userId: user.uid,
        name: user.displayName ?? "",
        email: user.email ?? "",
        phone: phoneNumber,
        registrationType: "Individual",
        registeredAt: serverTimestamp(),
        isCheckedIn: false,
        checkedInAt: null,
      });
      tx.set(userRegRef, {
        event_id: eventId,
        event_name: event.title ?? "Unknown Event",
        event_data: new Date().toISOString(),
        isAttended: false,
        certificationLink: "",
      });
    });

    setAlreadyRegistered(true);
    toast.success("You're registered! 🎉");

    try {
      const eventDate = event.startDate
        ? new Date(event.startDate).toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "TBA";
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mail: user.email ?? "",
          name: user.displayName ?? "",
          event_name: event.title ?? "Event",
          date: eventDate,
        }),
      });
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
    }
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
          toast.info("Please sign in to register.");
          try {
            await signInWithGoogle();
            const recheck = await checkRegistrationEligibility();
            if (recheck.allowed) await registerDirectly();
            else if (recheck.reason === "profile-incomplete") {
              toast.info("Complete your profile first.");
              router.push(
                `/profile/${auth.currentUser?.uid ?? ""}?redirect=/events/ongoing/${eventId}`,
              );
            }
          } catch (e) {
            toast.error(e instanceof Error ? e.message : "Sign-in failed.");
          }
          break;
        case "profile-incomplete":
          toast.info("Complete your profile first.");
          router.push(
            `/profile/${firebaseUser?.uid ?? ""}?redirect=/events/ongoing/${eventId}`,
          );
          break;
        case "blocked":
          toast.error("Your account has been blocked. Contact the admin.");
          break;
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setRegistering(false);
    }
  }

  /* ── Render ───────────────────────────────────────────── */
  if (loading) {
    return (
      <div
        className="min-h-screen bg-white flex flex-col"
        style={{
          backgroundImage:
            "linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      >
        <div className="flex-1 flex items-center justify-center">
          <LoadingEventDetail
            variant="page"
            message="Loading Event Details..."
          />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div
        className="min-h-screen bg-white"
        style={{
          backgroundImage:
            "linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      >
        <div className="flex flex-col items-center justify-center py-40 gap-6">
          <div className="bg-red-100 border-4 border-red-500 rounded-2xl p-8 shadow-[8px_8px_0px_0px_rgba(239,68,68,1)] max-w-md mx-auto text-center">
            <p className="text-red-800 font-bold text-lg font-productSans mb-4">
              ⚠️ {error || "Event not found"}
            </p>
            <Link
              href="/events/ongoing"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-black border-2 border-black rounded-none font-productSans hover:translate-x-1 hover:translate-y-1 transition-all"
              style={{ boxShadow: "4px 4px 0px 0px rgba(255,255,255,1)" }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Events
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const isEligible = isUserEligible();

  return (
    <div
      className="min-h-screen bg-white relative"
      style={{
        backgroundImage:
          "linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      <main className="relative z-10 py-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="max-w-5xl mx-auto flex flex-col gap-7"
        >
          {/* Back button */}
          <div>
            <Link
              href="/events/ongoing"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm  font-bold bg-[#C3ECF6] text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none hover:border-none"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Events
            </Link>
          </div>

          {/* Hero */}
          <EventHeroCard
            event={event}
            registering={registering}
            alreadyRegistered={alreadyRegistered}
            onRegisterClick={handleRegisterClick}
            isEligible={isEligible}
            eligibilityChecking={authLoading}
          />

          {/* Team + Eligibility */}
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <OrganizingTeamCard executiveBoard={event.executiveBoard} />
            </div>
            <div className="flex-1">
              <EligibilityCard
                eligibilityCriteria={event.eligibilityCriteria}
              />
            </div>
          </div>

          {/* Speakers */}
          <SpeakersSection officials={event.eventOfficials} />

          {/* Key Highlights */}
          <KeyHighlightsSection highlights={event.keyHighlights ?? []} />

          {/* Rules */}
          <RulesSection rules={event.rules} />

          {/* FAQs */}
          <FAQSection faqs={event.faqs} />

          {/* CTA Footer */}
          <div className="p-6 sm:p-8 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-[#C3ECF6]">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-black font-productSans">
                  {authLoading
                    ? "Checking eligibility…"
                    : event.isRegistrationOpen && isEligible
                      ? "Don't miss out! Register now 🎉"
                      : event.isRegistrationOpen && !isEligible
                        ? "You are not eligible for this event"
                        : "Stay tuned for updates!"}
                </h3>
                <p className="text-stone-600 text-sm font-productSans mt-1">
                  {event.isRegistrationOpen && isEligible
                    ? "Secure your spot before registrations close."
                    : event.isRegistrationOpen && !isEligible
                      ? "This event is restricted based on eligibility criteria."
                      : "Follow us for the latest announcements."}
                </p>
              </div>
              {event.isRegistrationOpen && !alreadyRegistered && isEligible ? (
                <Button
                  variant="default"
                  size="lg"
                  onClick={handleRegisterClick}
                  disabled={registering}
                  className="bg-white text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none font-productSans"
                >
                  {registering ? "Registering…" : "Register Now →"}
                </Button>
              ) : alreadyRegistered ? (
                <div className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-black rounded-xl text-green-700 font-bold font-productSans shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <CheckCircle className="w-5 h-5" />
                  Registered ✓
                </div>
              ) : null}
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
