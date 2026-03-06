"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Footer from "@/components/footer/Footer";
import { Button } from "@/components/ui/button";
import LoadingEvents from "@/components/loadingPage/loading_events";
import { motion, useInView } from "framer-motion";
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
  Tag,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Linkedin,
  User,
  Zap,
  Sparkles,
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

function getModeIcon(mode: string) {
  switch (mode) {
    case "ONLINE":
      return <Globe className="w-4 h-4" />;
    case "HYBRID":
      return <Wifi className="w-4 h-4" />;
    default:
      return <Monitor className="w-4 h-4" />;
  }
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

/* ─── Animated Section Wrapper ───────────────────────────── */

function AnimatedSection({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── FAQ Accordion Item ─────────────────────────────────── */

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <button
      onClick={() => setOpen(!open)}
      className={`w-full text-left border-3 border-black p-4 transition-all duration-200 ${
        open
          ? "bg-yellow-200 border-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
          : "bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-semibold text-black font-productSans text-sm md:text-base">
          {question}
        </span>
        <div className="flex-shrink-0 bg-black text-white w-7 h-7 flex items-center justify-center border-2 border-black rounded-sm">
          {open ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </div>
      </div>
      <div
        className="grid transition-all duration-300"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p className="pt-3 text-stone-700 font-productSans text-sm leading-relaxed">
            {answer}
          </p>
        </div>
      </div>
    </button>
  );
}

/* ─── Event Official Card ────────────────────────────────── */

function OfficialCard({ official }: { official: EventOfficial }) {
  return (
    <div className="bg-white border-2 border-black rounded-2xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-200">
      {/* Browser-style header dots */}
      <div className="flex items-center gap-1.5 mb-3 pb-3 border-b border-stone-200">
        <div className="w-2.5 h-2.5 rounded-full bg-sky-200" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-100" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-100" />
        <span
          className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full border ${getRoleBadgeColor(official.role)}`}
        >
          {official.role}
        </span>
      </div>

      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-11 h-11 rounded-full bg-blue-500 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <User className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-black font-productSans text-sm truncate">
            {official.name}
          </h4>
          {official.expertise && (
            <p className="text-stone-500 text-xs mt-0.5 truncate">
              {official.expertise}
            </p>
          )}
          {official.bio && (
            <p className="text-stone-600 text-xs mt-1 line-clamp-2">
              {official.bio}
            </p>
          )}
        </div>
      </div>

      {/* Links */}
      {(official.linkedinUrl || official.profileUrl) && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-stone-200">
          {official.linkedinUrl && (
            <a
              href={official.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-blue-600 font-semibold hover:underline"
            >
              <Linkedin className="w-3.5 h-3.5" />
              LinkedIn
            </a>
          )}
          {official.profileUrl && (
            <a
              href={official.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-stone-600 font-semibold hover:underline"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Profile
            </a>
          )}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ONGOING EVENT DETAIL CARD — full-width expandable card
   ═══════════════════════════════════════════════════════════ */

function OngoingEventCard({
  event,
  index,
  registering,
  alreadyRegistered,
  onRegisterClick,
  isEligible,
  eligibilityChecking,
}: {
  event: OngoingEvent;
  index: number;
  registering: boolean;
  alreadyRegistered: boolean;
  onRegisterClick: () => void;
  isEligible: boolean;
  eligibilityChecking: boolean;
}) {
  const [expanded, setExpanded] = useState(index === 0);

  const departments = event.eligibilityCriteria?.Dept?.filter(Boolean) ?? [];

  return (
    <AnimatedSection delay={index * 0.1}>
      <div
        className={`bg-white border-4 border-black rounded-3xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 ${
          expanded
            ? "hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
            : "hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
        }`}
      >
        {/* ── Hero Banner ─────────────────────────────────── */}
        <div className="relative">
          {(event.bannerImage || event.posterImage) && (
            <div className="w-full h-48 sm:h-64 lg:h-72 overflow-hidden">
              {/* Mobile: show posterImage, Desktop: show bannerImage */}
              {event.posterImage && (
                <img
                  src={event.posterImage}
                  alt={event.title}
                  className="w-full h-full object-cover sm:hidden"
                />
              )}
              <img
                src={event.bannerImage || event.posterImage || ""}
                alt={event.title}
                className={`w-full h-full object-cover ${event.posterImage ? "hidden sm:block" : ""}`}
              />
            </div>
          )}

          {/* UPCOMING Badge */}
          <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-productSans">
            <Clock className="w-3.5 h-3.5" />
            UPCOMING
          </div>

          {/* Event Type & Mode Badge */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="bg-yellow-300 text-black text-xs font-bold px-3 py-1.5 rounded-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-productSans">
              {event.eventType}
            </span>
            <span className="bg-white text-black text-xs font-bold px-3 py-1.5 rounded-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-productSans flex items-center gap-1">
              {getModeIcon(event.mode)}
              {event.mode}
            </span>
          </div>
        </div>

        {/* ── Title & Meta Bar ────────────────────────────── */}
        <div className="px-5 sm:px-8 py-5 border-b-3 border-black bg-gradient-to-r from-blue-50 to-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black font-productSans leading-tight">
                {event.title}
              </h2>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              {event.isRegistrationOpen &&
                !alreadyRegistered &&
                eligibilityChecking && (
                  <div className="flex items-center gap-1.5 px-4 py-2 bg-yellow-100 border-2 border-black rounded-xl text-yellow-800 font-bold text-sm font-productSans shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] animate-pulse">
                    Checking…
                  </div>
                )}
              {event.isRegistrationOpen &&
                !alreadyRegistered &&
                !eligibilityChecking &&
                !isEligible && (
                  <div className="flex items-center gap-1.5 px-4 py-2 bg-red-100 border-2 border-black rounded-xl text-red-800 font-bold text-sm font-productSans shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                    Not Eligible
                  </div>
                )}
              {event.isRegistrationOpen &&
                !alreadyRegistered &&
                !eligibilityChecking &&
                isEligible && (
                  <Button
                    variant="default"
                    size="lg"
                    onClick={onRegisterClick}
                    disabled={registering}
                  >
                    {registering ? "Checking…" : "Register Now"}
                  </Button>
                )}
              {alreadyRegistered && (
                <div className="flex items-center gap-1.5 px-4 py-2 bg-green-100 border-2 border-black rounded-xl text-green-800 font-bold text-sm font-productSans shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <CheckCircle className="w-4 h-4" />
                  Registered
                </div>
              )}
              <Button
                variant="noShadow"
                size="round"
                onClick={() => setExpanded(!expanded)}
                className="w-12 h-12 border-2 border-black bg-yellow-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
              >
                {expanded ? (
                  <ChevronUp className="w-6 h-6" />
                ) : (
                  <ChevronDown className="w-6 h-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* ── Collapsible Detail Section ──────────────────── */}
        <div
          className="grid transition-all duration-500 ease-in-out"
          style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
        >
          <div className="overflow-hidden">
            <div className="px-5 sm:px-8 py-6 space-y-8">
              {/* ── Description ─────────────────────────────── */}
              {event.description && (
                <div className="bg-[#111111] rounded-[24px] p-6 sm:p-8 relative overflow-hidden">
                  <div
                    aria-hidden
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      backgroundImage:
                        "radial-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
                      backgroundSize: "20px 20px, 40px 40px",
                      backgroundPosition: "0 0, 10px 10px",
                    }}
                  />
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold text-white font-productSans mb-3 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-yellow-400" />
                      About This Event
                    </h3>
                    <p className="text-stone-300 font-productSans text-sm sm:text-base leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                </div>
              )}

              {/* ── Key Highlights + Eligibility Row ────────── */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Key Highlights */}
                {event.keyHighlights && event.keyHighlights.length > 0 && (
                  <div className="bg-blue-50 border-3 border-black rounded-2xl p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                    <h3 className="text-lg font-bold text-black font-productSans mb-4 flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      Key Highlights
                    </h3>
                    <div className="space-y-2.5">
                      {event.keyHighlights.map((highlight, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-7 h-7 bg-blue-500 border-2 border-black rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            {i + 1}
                          </span>
                          <span className="text-stone-800 font-productSans text-sm pt-0.5">
                            {highlight}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Eligibility & Registration Info */}
                <div className="bg-green-50 border-3 border-black rounded-2xl p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  <h3 className="text-lg font-bold text-black font-productSans mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-green-600" />
                    Eligibility & Info
                  </h3>

                  <div className="space-y-3">
                    {/* Registration Status */}
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border-2 border-black font-productSans shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                          event.isRegistrationOpen
                            ? "bg-green-400 text-black"
                            : "bg-red-400 text-white"
                        }`}
                      >
                        {event.isRegistrationOpen
                          ? "Registration Open"
                          : "Registration Closed"}
                      </span>
                    </div>

                    {/* Registration Window */}
                    {(event.registrationStart || event.registrationEnd) && (
                      <div className="bg-white border-2 border-black rounded-xl p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <p className="text-xs font-bold text-stone-500 font-productSans mb-1">
                          Registration Window
                        </p>
                        <p className="text-sm text-stone-800 font-productSans">
                          {formatDate(event.registrationStart)} –{" "}
                          {formatDate(event.registrationEnd)}
                        </p>
                      </div>
                    )}

                    {/* Eligible Years */}
                    {event.eligibilityCriteria?.yearOfGrad?.some(Boolean) && (
                      <div>
                        <p className="text-xs font-bold text-stone-500 font-productSans mb-2">
                          Eligible Years
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {event.eligibilityCriteria.yearOfGrad.map(
                            (allowed, i) =>
                              allowed && (
                                <span
                                  key={i}
                                  className="px-2.5 py-1 bg-yellow-100 border-2 border-black rounded-lg text-xs font-bold text-stone-700 font-productSans shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                                >
                                  Year {i + 1}
                                </span>
                              ),
                          )}
                        </div>
                      </div>
                    )}

                    {/* Departments */}
                    {departments.length > 0 && (
                      <div>
                        <p className="text-xs font-bold text-stone-500 font-productSans mb-2">
                          Eligible Departments
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {departments.map((dept, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-1 bg-white border-2 border-black rounded-lg text-xs font-bold text-stone-700 font-productSans shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                            >
                              {dept}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Max Participants */}
                    {event.maxParticipants > 0 && (
                      <div className="bg-white border-2 border-black rounded-xl p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <p className="text-xs font-bold text-stone-500 font-productSans mb-1">
                          Max Participants
                        </p>
                        <p className="text-lg font-bold text-black font-productSans">
                          {event.maxParticipants}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ── Executive Board ─────────────────────────── */}
              {(event.executiveBoard.organiser ||
                event.executiveBoard.coOrganiser ||
                event.executiveBoard.facilitator) && (
                <div>
                  <h3 className="text-lg font-bold text-black font-productSans mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-green-500" />
                    Executive Board
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      {
                        label: "Organiser",
                        name: event.executiveBoard.organiser,
                        color: "bg-blue-500",
                      },
                      {
                        label: "Co-Organiser",
                        name: event.executiveBoard.coOrganiser,
                        color: "bg-red-500",
                      },
                      {
                        label: "Facilitator",
                        name: event.executiveBoard.facilitator,
                        color: "bg-yellow-400",
                      },
                    ]
                      .filter((m) => m.name)
                      .map((member, i) => (
                        <div
                          key={i}
                          className="bg-white border-2 border-black rounded-2xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-full ${member.color} border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}
                            >
                              <User className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="text-xs text-stone-500 font-productSans font-bold">
                                {member.label}
                              </p>
                              <p className="text-sm font-bold text-black font-productSans">
                                {member.name}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* ── Event Officials (Speakers / Jury / Guests) */}
              {event.eventOfficials && event.eventOfficials.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-black font-productSans mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-500" />
                    Speakers, Jury & Guests
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {event.eventOfficials.map((official, i) => (
                      <OfficialCard key={i} official={official} />
                    ))}
                  </div>
                </div>
              )}

              {/* ── Rules ───────────────────────────────────── */}
              {event.rules && event.rules.length > 0 && (
                <div className="bg-red-50 border-3 border-black rounded-2xl p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  <h3 className="text-lg font-bold text-black font-productSans mb-4 flex items-center gap-2">
                    📋 Rules & Guidelines
                  </h3>
                  <div className="space-y-2">
                    {event.rules.map((r, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 bg-white border-2 border-black rounded-xl p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      >
                        <span className="flex-shrink-0 w-6 h-6 bg-red-500 border-2 border-black rounded-md flex items-center justify-center text-white text-xs font-bold">
                          {i + 1}
                        </span>
                        <span className="text-stone-800 font-productSans text-sm">
                          {r.rule}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── FAQs ────────────────────────────────────── */}
              {event.faqs && event.faqs.length > 0 && (
                <div className="bg-pink-200 border-4 border-black rounded-none p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <h3 className="text-lg font-bold text-black font-productSans mb-4 flex items-center gap-2">
                    💬 FAQs
                  </h3>
                  <div className="space-y-3">
                    {event.faqs.map((faq, i) => (
                      <FAQItem
                        key={i}
                        question={faq.question}
                        answer={faq.answer}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* ── CTA Footer ──────────────────────────────── */}
              <div className="rounded-2xl p-6 sm:p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-blue-100">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-black font-productSans">
                      {eligibilityChecking
                        ? "Checking eligibility…"
                        : event.isRegistrationOpen && isEligible
                          ? "Don't miss out! Register now 🎉"
                          : event.isRegistrationOpen && !isEligible
                            ? "You are not eligible for this event"
                            : "Stay tuned for updates!"}
                    </h3>
                    <p className="text-stone-600 text-sm font-productSans mt-1">
                      {eligibilityChecking
                        ? "Please wait while we verify your eligibility."
                        : event.isRegistrationOpen && isEligible
                          ? "Secure your spot before registrations close."
                          : event.isRegistrationOpen && !isEligible
                            ? "This event is restricted based on eligibility criteria."
                            : "Follow us for the latest announcements."}
                    </p>
                  </div>
                  {eligibilityChecking ? (
                    <div className="flex items-center gap-1.5 px-4 py-2 bg-yellow-100 border-2 border-black rounded-xl text-yellow-800 font-bold text-sm font-productSans shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] animate-pulse">
                      Checking…
                    </div>
                  ) : event.isRegistrationOpen &&
                    !alreadyRegistered &&
                    !isEligible ? (
                    <div className="flex items-center gap-1.5 px-4 py-2 bg-red-100 border-2 border-black rounded-xl text-red-800 font-bold text-sm font-productSans shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                      Not Eligible
                    </div>
                  ) : event.isRegistrationOpen &&
                    !alreadyRegistered &&
                    isEligible ? (
                    <Button
                      variant="default"
                      size="lg"
                      className="bg-white text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none font-productSans"
                      onClick={onRegisterClick}
                      disabled={registering}
                    >
                      {registering ? "Checking…" : "Register Now →"}
                    </Button>
                  ) : alreadyRegistered ? (
                    <div className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-black rounded-xl text-green-700 font-bold font-productSans shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <CheckCircle className="w-5 h-5" />
                      Registered ✓
                    </div>
                  ) : (
                    <Button
                      asChild
                      variant="default"
                      size="lg"
                      className="bg-white text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none font-productSans"
                    >
                      <Link href={`/events/${event.id}`}>View Event →</Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

/* ═══════════════════════════════════════════════════════════
   ONGOING EVENTS PAGE
   ═══════════════════════════════════════════════════════════ */

export default function OngoingEventsPage() {
  const router = useRouter();
  const {
    firebaseUser,
    userProfile,
    signInWithGoogle,
    loading: authLoading,
  } = useAuth();
  const [events, setEvents] = useState<OngoingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registeringEventId, setRegisteringEventId] = useState<string | null>(
    null,
  );
  const [registeredEventIds, setRegisteredEventIds] = useState<Set<string>>(
    new Set(),
  );

  // ── Check which events the user is already registered for ──
  useEffect(() => {
    if (!firebaseUser || events.length === 0) return;
    let mounted = true;

    (async () => {
      const registered = new Set<string>();
      await Promise.all(
        events.map(async (event) => {
          try {
            const userRegRef = doc(
              db,
              "client_users",
              firebaseUser.uid,
              "registrations",
              event.id,
            );
            const snap = await getDoc(userRegRef);
            if (snap.exists()) registered.add(event.id);
          } catch {
            // ignore check errors
          }
        }),
      );
      if (mounted) setRegisteredEventIds(registered);
    })();

    return () => {
      mounted = false;
    };
  }, [firebaseUser, events]);

  // ── Register directly for an event ──
  async function registerDirectly(event: OngoingEvent) {
    const user = auth.currentUser;
    if (!user) return;

    console.log("[Registration] User data:", {
      uid: user.uid,
      email: user.email,
      branch: userProfile?.branch,
      currentYearOfStudy: userProfile?.currentYearOfStudy,
      admissionYear: userProfile?.admissionYear,
      isLateralEntry: userProfile?.isLateralEntry,
      graduationYear: userProfile?.graduationYear,
    });
    console.log("[Registration] Event criteria:", {
      eventId: event.id,
      title: event.title,
      yearOfGrad: event.eligibilityCriteria?.yearOfGrad,
      Dept: event.eligibilityCriteria?.Dept,
      isRegistrationOpen: event.isRegistrationOpen,
      maxParticipants: event.maxParticipants,
    });

    const eventId = event.id;
    const regId = `${user.uid}_${eventId}`;
    const phoneNumber: string = userProfile?.phoneNumber ?? "";

    if (!isUserEligibleForEvent(event, userProfile)) {
      toast.error("You are not eligible for this event.");
      return;
    }

    // Registration open check removed — always allow registration
    // if (!event.isRegistrationOpen) {
    //   toast.error("Registrations are closed for this event.");
    //   return;
    // }

    // ── Check maxParticipants via server-side count (no doc downloads) ──
    if (event.maxParticipants > 0) {
      const regColRef = collection(
        db,
        "managed_events",
        eventId,
        "registrations",
      );
      const countSnap = await getCountFromServer(regColRef);
      if (countSnap.data().count >= event.maxParticipants) {
        toast.error(
          `Maximum participants (${event.maxParticipants}) reached. Registrations are full.`,
        );
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
      const userRegSnap = await tx.get(userRegRef);
      if (userRegSnap.exists()) {
        setRegisteredEventIds((prev) => new Set(prev).add(eventId));
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

    setRegisteredEventIds((prev) => new Set(prev).add(eventId));
    console.log("[Registration] Success — registered for:", eventId);
    toast.success("You're registered! 🎉");

    // Send confirmation email (non-blocking)
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

  // ── Registration click handler ──
  async function handleRegisterClick(event: OngoingEvent) {
    console.log("[Registration] Click — event:", event.id, event.title);
    setRegisteringEventId(event.id);
    try {
      const result = await checkRegistrationEligibility();
      console.log("[Registration] Eligibility guard result:", result);

      if (result.allowed) {
        await registerDirectly(event);
        return;
      }

      switch (result.reason) {
        case "not-logged-in":
          toast.info("Please sign in to register for this event.");
          try {
            await signInWithGoogle();
            const recheck = await checkRegistrationEligibility();
            if (recheck.allowed) {
              await registerDirectly(event);
            } else if (
              !recheck.allowed &&
              recheck.reason === "profile-incomplete"
            ) {
              toast.info("Complete your profile first to register.");
              router.push(
                `/profile/${auth.currentUser?.uid ?? ""}?redirect=/events/ongoing`,
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
            `/profile/${firebaseUser?.uid ?? auth.currentUser?.uid ?? ""}?redirect=/events/ongoing`,
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
      setRegisteringEventId(null);
    }
  }

  function isUserEligibleForEvent(
    event: OngoingEvent,
    userProfile: any,
  ): boolean {
    // Compute fresh currentYearOfStudy from admission data
    const admissionYear = userProfile?.admissionYear ?? 0;
    const isLateralEntry = userProfile?.isLateralEntry ?? false;
    const currentYearOfStudy =
      admissionYear > 0
        ? getCurrentYearOfStudy(admissionYear, isLateralEntry)
        : null;

    // Year eligibility
    const yearOfGrad = event.eligibilityCriteria?.yearOfGrad ?? [];
    if (yearOfGrad.length > 0 && currentYearOfStudy != null) {
      const idx = currentYearOfStudy - 1;
      if (idx < 0 || idx >= yearOfGrad.length || !yearOfGrad[idx]) return false;
    }
    // Dept eligibility
    const eligibleDepts =
      event.eligibilityCriteria?.Dept?.filter(Boolean) ?? [];
    if (eligibleDepts.length > 0 && userProfile?.branch) {
      if (!eligibleDepts.includes(userProfile.branch)) return false;
    }
    return true;
  }

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const res = await fetch("/api/events/list");
        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();
        if (!mounted) return;

        const ongoingEvents: OngoingEvent[] = (Array.isArray(data) ? data : [])
          .filter((e: OngoingEvent) => e.status === "UPCOMING")
          .sort((a: OngoingEvent, b: OngoingEvent) => {
            const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
            const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
            return dateA - dateB;
          });

        setEvents(ongoingEvents);
      } catch (err: unknown) {
        console.error(err);
        if (mounted) {
          setError(err instanceof Error ? err.message : "Unknown error");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div
      className="min-h-screen bg-white relative overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      <main className="relative z-10 py-14 px-4">
        {/* ── Page Header ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-6xl mx-auto mb-14 text-center relative"
        >
          {/* Decorative elements */}
          <div className="absolute -top-4 -left-4 w-16 h-16 bg-blue-400 border-2 border-black rounded-xl rotate-12 opacity-20 animate-pulse pointer-events-none" />
          <div className="absolute -top-2 -right-8 w-12 h-12 bg-yellow-400 border-2 border-black rounded-full opacity-15 animate-bounce pointer-events-none" />
          <div className="absolute top-8 right-4 w-8 h-8 bg-red-400 border-2 border-black rounded-lg rotate-45 opacity-10 pointer-events-none" />
          <div className="absolute bottom-0 left-12 w-10 h-10 bg-blue-400 border-2 border-black rounded-full opacity-15 animate-bounce pointer-events-none" />

          {/* Back button */}
          <div className="flex justify-start mb-6">
            <Button asChild variant="default" size="sm">
              <Link href="/events" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                All Events
              </Link>
            </Button>
          </div>

          {/* Title Label */}
          <div className="relative inline-block mb-5">
            <div className="absolute -inset-3 bg-blue-400 border-4 border-black rounded-3xl rotate-1 opacity-80 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" />
            <h1 className="relative text-4xl md:text-5xl lg:text-6xl font-bold text-black font-productSans px-6 py-3 flex items-center gap-3">
              <Calendar className="w-8 h-8 md:w-10 md:h-10 text-blue-700" />
              Upcoming Events
            </h1>
          </div>

          {/* Subtitle */}
          <div className="relative inline-block mt-2">
            <div className="absolute -inset-3 bg-yellow-200 border-3 border-black rounded-2xl -rotate-1 opacity-70 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]" />
            <p className="relative text-base md:text-lg text-black font-productSans max-w-2xl mx-auto px-4 py-2 font-medium">
              Events coming up soon — mark your calendar and get ready!
            </p>
          </div>
        </motion.div>

        {/* ── Content ─────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto">
          {loading && <LoadingEvents />}

          {!loading && error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="bg-red-100 border-4 border-red-500 rounded-2xl p-8 shadow-[8px_8px_0px_0px_rgba(239,68,68,1)] max-w-md mx-auto">
                <p className="text-red-800 font-bold text-lg font-productSans mb-4">
                  ⚠️ {error}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-red-500 text-white font-bold border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200 font-productSans"
                >
                  Try Again
                </button>
              </div>
            </motion.div>
          )}

          {!loading && !error && events.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="bg-yellow-100 border-4 border-yellow-500 rounded-3xl p-12 shadow-[12px_12px_0px_0px_rgba(234,179,8,1)] max-w-lg mx-auto">
                <div className="text-7xl mb-6">🎪</div>
                <p className="text-yellow-800 font-bold text-xl font-productSans mb-2">
                  No upcoming events right now
                </p>
                <p className="text-yellow-700 font-productSans text-base mb-6">
                  Check back later or browse all events!
                </p>
                <Button asChild variant="yellow">
                  <Link href="/events">Browse All Events</Link>
                </Button>
              </div>
            </motion.div>
          )}

          {!loading && !error && events.length > 0 && (
            <div className="space-y-8">
              {/* Live event count badge */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3"
              >
                <div className="flex items-center gap-2.5 bg-blue-100 border-2 border-black rounded-2xl px-5 py-2.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="text-lg font-bold text-blue-800 font-productSans">
                    {events.length} Upcoming Event{events.length > 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex-1 h-0.5 bg-blue-200 rounded-full" />
              </motion.div>

              {/* Event Cards */}
              {events.map((event, index) => (
                <OngoingEventCard
                  key={event.id}
                  event={event}
                  index={index}
                  registering={registeringEventId === event.id}
                  alreadyRegistered={registeredEventIds.has(event.id)}
                  onRegisterClick={() => handleRegisterClick(event)}
                  isEligible={isUserEligibleForEvent(event, userProfile)}
                  eligibilityChecking={authLoading}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
