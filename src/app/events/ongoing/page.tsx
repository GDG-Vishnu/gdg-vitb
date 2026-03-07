"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Footer from "@/components/footer/Footer";
import { Button } from "@/components/ui/button";
import LoadingEvents from "@/components/loadingPage/loading_events";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock } from "lucide-react";

/* ─── Types ──────────────────────────────────────────────── */

type OngoingEvent = {
  id: string;
  title: string;
  posterImage: string | null;
  startDate: string | null;
  status: string;
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

/* ═══════════════════════════════════════════════════════════
   EVENT LIST CARD
   ═══════════════════════════════════════════════════════════ */

function EventListCard({
  event,
  index,
}: {
  event: OngoingEvent;
  index: number;
}) {
  const router = useRouter();
  const isLive = event.status === "ONGOING";

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: "easeOut" }}
      onClick={() => router.push(`/events/ongoing/${event.id}`)}
      className={`relative bg-white shadow-md snap-start overflow-hidden w-full border flex flex-col justify-between cursor-pointer
        rounded-[30px] sm:rounded-[40px] lg:rounded-[50px]
        h-[380px] sm:h-[420px] lg:h-[472px] transition-transform hover:-translate-y-1
        ${
          isLive
            ? "border-2 border-green-500 ring-2 ring-green-300/50"
            : "border-2 border-black"
        }`}
    >
      {/* Live badge */}
      {isLive && (
        <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-productSans">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
          </span>
          LIVE
        </div>
      )}

      {/* Upcoming badge */}
      {!isLive && (
        <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-productSans">
          <Clock className="w-3 h-3" />
          UPCOMING
        </div>
      )}

      {/* Image */}
      {event.posterImage && (
        <div className="flex-1 flex items-center justify-center bg-transparent overflow-hidden p-3 sm:p-4">
          <img
            src={event.posterImage}
            alt={event.title}
            className="w-full h-full object-cover rounded-[24px] sm:rounded-[32px] lg:rounded-[40px]"
          />
        </div>
      )}

      {/* Content */}
      <div className="px-4 py-3 sm:px-6 sm:py-4 lg:px-8 lg:py-6">
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-stone-950 font-productSans truncate">
              {event.title}
            </h3>
            {event.startDate && (
              <p className="text-xs text-stone-500 font-productSans mt-0.5">
                {formatDate(event.startDate)}
              </p>
            )}
          </div>
          <div className="flex-shrink-0">
            <div
              className="translate-x-1 translate-y-1 shadow-[3px_3px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_rgba(0,0,0,1)]
                hover:translate-x-0 hover:translate-y-0 hover:shadow-none transition-all
                w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 p-0 flex items-center justify-center
                rounded-full border-2 border-black"
              style={{ backgroundColor: "#4285F4" }}
            >
              <img
                src="https://res.cloudinary.com/duvr3z2z0/image/upload/v1760609469/Arrow_left_3x_dte4bu.png"
                alt=""
                className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/* ═══════════════════════════════════════════════════════════
   ONGOING EVENTS PAGE
   ═══════════════════════════════════════════════════════════ */

export default function OngoingEventsPage() {
  const [events, setEvents] = useState<OngoingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const res = await fetch("/api/events/list");
        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();
        if (!mounted) return;

        const filtered: OngoingEvent[] = (Array.isArray(data) ? data : [])
          .filter(
            (e: OngoingEvent) =>
              e.status === "UPCOMING" || e.status === "ONGOING",
          )
          .sort((a: OngoingEvent, b: OngoingEvent) => {
            if (a.status === "ONGOING" && b.status !== "ONGOING") return -1;
            if (a.status !== "ONGOING" && b.status === "ONGOING") return 1;
            const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
            const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
            return dateA - dateB;
          });

        setEvents(filtered);
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

  const ongoingEvents = events.filter((e) => e.status === "ONGOING");
  const upcomingEvents = events.filter((e) => e.status === "UPCOMING");

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
        {/* ── Page Header ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-6xl mx-auto mb-14 text-center relative"
        >
          <div className="absolute -top-4 -left-4 w-16 h-16 bg-blue-400 border-2 border-black rounded-xl rotate-12 opacity-20 animate-pulse pointer-events-none" />
          <div className="absolute -top-2 -right-8 w-12 h-12 bg-yellow-400 border-2 border-black rounded-full opacity-15 animate-bounce pointer-events-none" />
          <div className="absolute top-8 right-4 w-8 h-8 bg-red-400 border-2 border-black rounded-lg rotate-45 opacity-10 pointer-events-none" />
          <div className="absolute bottom-0 left-12 w-10 h-10 bg-blue-400 border-2 border-black rounded-full opacity-15 animate-bounce pointer-events-none" />

          <div className="flex justify-start mb-6">
            <Button asChild variant="default" size="sm">
              <Link href="/events" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                All Events
              </Link>
            </Button>
          </div>

          <div className="relative inline-block mb-5">
            <div className="absolute -inset-3 bg-blue-400 border-4 border-black rounded-3xl rotate-1 opacity-80 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" />
            <h1 className="relative text-4xl md:text-5xl lg:text-6xl font-bold text-black font-productSans px-6 py-3 flex items-center gap-3">
              <Calendar className="w-8 h-8 md:w-10 md:h-10 text-blue-700" />
              Events
            </h1>
          </div>

          <div className="relative inline-block mt-2">
            <div className="absolute -inset-3 bg-yellow-200 border-3 border-black rounded-2xl -rotate-1 opacity-70 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]" />
            <p className="relative text-base md:text-lg text-black font-productSans max-w-2xl mx-auto px-4 py-2 font-medium">
              Happening now & coming up soon — mark your calendar!
            </p>
          </div>
        </motion.div>

        {/* ── Content ─────────────────────────────────────────── */}
        <div className="max-w-6xl mx-auto">
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
                  No active events right now
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
            <div className="flex flex-col gap-14">
              {/* Happening Now */}
              {ongoingEvents.length > 0 && (
                <section>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex items-center gap-3 mb-7"
                  >
                    <div className="flex items-center gap-2.5 bg-green-100 border-2 border-black rounded-2xl px-5 py-2.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-600" />
                      </span>
                      <h2 className="text-xl md:text-2xl font-bold text-green-800 font-productSans">
                        Happening Now
                      </h2>
                    </div>
                    <div className="flex-1 h-0.5 bg-green-200 rounded-full" />
                  </motion.div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ongoingEvents.map((event, i) => (
                      <EventListCard key={event.id} event={event} index={i} />
                    ))}
                  </div>
                </section>
              )}

              {/* Upcoming Events */}
              {upcomingEvents.length > 0 && (
                <section>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="flex items-center gap-3 mb-7"
                  >
                    <div className="flex items-center gap-2.5 bg-blue-100 border-2 border-black rounded-2xl px-5 py-2.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <h2 className="text-xl md:text-2xl font-bold text-blue-800 font-productSans">
                        Upcoming Events
                      </h2>
                    </div>
                    <div className="flex-1 h-0.5 bg-blue-200 rounded-full" />
                  </motion.div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingEvents.map((event, i) => (
                      <EventListCard key={event.id} event={event} index={i} />
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
