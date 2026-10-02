"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/footer/Footer";
import { Button } from "@/components/ui/button";
import LoadingEvents from "@/components/loadingPage/loading_events";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { fetchEventList } from "@/lib/events-list-cache";

type Event = {
  id: string;
  title: string;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
  venue: string | null;
  mode: string;
  status: string;
  eventType: string;
  maxParticipants: number;
  isRegistrationOpen: boolean;
  keyHighlights: string[] | null;
  tags: string[] | null;
  posterImage?: string | null;
  bannerImage?: string | null;
  Theme?: string[];
};

function getSortTime(dateStr: string | null | undefined): number | null {
  if (!dateStr) return null;
  const t = new Date(dateStr).getTime();
  return Number.isNaN(t) ? null : t;
}

function normalizeImageSrc(src: string | null | undefined): string | null {
  if (!src) return null;
  const trimmed = src.trim();
  return trimmed ? trimmed : null;
}

function formatCardDate(dateStr: string | null | undefined): string {
  const t = getSortTime(dateStr);
  if (t === null) return "TBA";
  return new Date(t).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function EventCard({ event, index = 0 }: { event: Event; index?: number }) {
  const accentColor = event.Theme?.[0] ?? "#4285F4";
  const posterSrc = normalizeImageSrc(event.posterImage);
  const getButtonStyle = () => ({
    backgroundColor: accentColor,
    color: "#ffffff",
    borderColor: "#000000",
    borderWidth: "3px",
    borderStyle: "solid",
  });

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: Math.min(index, 6) * 0.06,
        ease: "easeOut",
      }}
      className={`relative bg-white shadow-md snap-start overflow-hidden w-full border border-black flex flex-col justify-between
        rounded-[30px] sm:rounded-[40px] lg:rounded-[50px]
        h-[380px] sm:h-[420px] lg:h-[472px]`}
    >
      {/* Image Container */}
      <div className="flex-1 flex items-center justify-center bg-stone-100 overflow-hidden p-3 sm:p-4">
        {posterSrc ? (
          <Image
            src={posterSrc}
            alt={event.title}
            width={800}
            height={600}
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="w-full h-full object-cover rounded-[24px] sm:rounded-[32px] lg:rounded-[40px]"
          />
        ) : (
          <div
            role="img"
            aria-label={`${event.title} poster placeholder`}
            className="w-full h-full flex flex-col items-center justify-center gap-2 rounded-[24px] sm:rounded-[32px] lg:rounded-[40px] border-2 border-dashed border-stone-300 bg-stone-50"
          >
            <span
              aria-hidden
              className="flex h-14 w-14 items-center justify-center rounded-full text-2xl font-bold text-white"
              style={{ backgroundColor: accentColor }}
            >
              {event.title.charAt(0).toUpperCase()}
            </span>
            <span className="px-4 text-center text-sm font-semibold text-stone-500">
              Poster coming soon
            </span>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="px-4 py-3 sm:px-6 sm:py-4 lg:px-8 lg:py-6">
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <h3
              title={event.title}
              className="text-lg sm:text-xl lg:text-2xl font-semibold text-stone-950 font-productSans truncate"
            >
              {event.title}
            </h3>
            <p className="mt-1 truncate text-xs sm:text-sm text-stone-500 font-productSans">
              {formatCardDate(event.startDate)}
              {event.venue ? ` · ${event.venue}` : ""}
              {event.status ? ` · ${event.status}` : ""}
            </p>
          </div>
          <div className="flex-shrink-0">
            <Button
              asChild
              variant="noShadow"
              size="round"
              aria-label={`Open ${event.title}`}
              style={getButtonStyle()}
              className="translate-x-1 translate-y-1 shadow-[3px_3px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_rgba(0,0,0,1)]
                hover:translate-x-0 hover:translate-y-0 hover:shadow-none transition-all
                w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 p-0 flex items-center justify-center"
            >
              <Link
                href={`/events/${event.id}`}
                aria-label={`Open ${event.title}`}
                className="flex h-full w-full items-center justify-center"
              >
                <ArrowUpRight className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"ALL" | "ONGOING" | "UPCOMING" | "COMPLETED">(
    "ALL",
  );

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEventList<Event>();
      const eventsList: Event[] = [...data];
      // Sort each group: ONGOING/UPCOMING by soonest startDate first,
      // COMPLETED by most recent startDate first. Invalid/missing dates last.
      eventsList.sort((a, b) => {
        const timeA = getSortTime(a.startDate);
        const timeB = getSortTime(b.startDate);
        if (timeA === null && timeB === null) return 0;
        if (timeA === null) return 1;
        if (timeB === null) return -1;
        if (a.status === "COMPLETED" && b.status === "COMPLETED")
          return timeB - timeA;
        return timeA - timeB;
      });
      setEvents(eventsList);
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!mounted) return;
      await loadEvents();
    })();

    return () => {
      mounted = false;
    };
  }, [loadEvents]);

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
      <main className="relative z-10 py-14 px-4">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-6xl mx-auto mb-14 text-center relative"
        >
          {/* Decorative blobs */}
          <div className="absolute -top-4 -left-4 w-16 h-16 bg-blue-400 border-2 border-black rounded-xl rotate-12 opacity-20 animate-pulse pointer-events-none" />
          <div className="absolute -top-2 -right-8 w-12 h-12 bg-yellow-400 border-2 border-black rounded-full opacity-15 animate-bounce pointer-events-none" />
          <div className="absolute top-8 right-4 w-8 h-8 bg-red-400 border-2 border-black rounded-lg rotate-45 opacity-10 pointer-events-none" />

          <div className="relative inline-block mb-5">
            <div className="absolute -inset-3 bg-yellow-300 border-4 border-black rounded-3xl rotate-1 opacity-80 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" />
            <h1 className="relative text-4xl md:text-5xl lg:text-6xl font-bold text-black font-productSans px-6 py-3">
              Our Events
            </h1>
          </div>

          <div className="relative inline-block mt-2">
            <div className="absolute -inset-3 bg-blue-200 border-3 border-black rounded-2xl -rotate-1 opacity-70 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]" />
            <p className="relative text-base md:text-lg text-black font-productSans max-w-2xl mx-auto px-4 py-2 font-medium">
              Discover workshops, hackathons, and tech talks organized by GDG on
              Campus Vishnu. Join us to learn, build, and connect!
            </p>
          </div>
        </motion.div>

        {/* Events Grid */}
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
                  ⚠️ Error: {error}
                </p>
                <button
                  onClick={() => loadEvents()}
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
                <div className="text-7xl mb-6">📅</div>
                <p className="text-yellow-800 font-bold text-xl font-productSans mb-2">
                  No events found.
                </p>
                <p className="text-yellow-700 font-productSans text-base">
                  Check back later for upcoming events!
                </p>
              </div>
            </motion.div>
          )}

          {!loading && !error && events.length > 0 && (
            <>
              {/* ── Live / Upcoming banner → redirect to /events/ongoing ── */}
              {events.some(
                (e) => e.status === "ONGOING" || e.status === "UPCOMING",
              ) && (
                <motion.div
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="mb-12"
                >
                  <Link
                    href="/events/ongoing"
                    className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 sm:p-6 border-2 border-black bg-green-100 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-150"
                  >
                    <div className="flex items-center gap-3">
                      <span className="relative flex h-4 w-4 flex-shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-green-600" />
                      </span>
                      <div>
                        <p className="font-bold text-green-900 font-productSans text-base sm:text-lg leading-tight">
                          There are live / upcoming events right now!
                        </p>
                        <p className="text-green-800 font-productSans text-sm mt-0.5">
                          Visit the Ongoing Events section to register and see
                          details.
                        </p>
                      </div>
                    </div>
                    <span className="flex-shrink-0 px-5 py-2.5 bg-green-500 text-white font-bold border-2 border-black font-productSans text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] whitespace-nowrap">
                      View Now →
                    </span>
                  </Link>
                </motion.div>
              )}

              {/* ── Search + Tabs ── */}
              <div className="mb-10 flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                  <label htmlFor="event-search" className="sr-only">
                    Search events
                  </label>
                  <input
                    id="event-search"
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by title, venue, or tag..."
                    className="w-full sm:max-w-md px-4 py-2.5 bg-white text-black font-productSans border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div
                    role="tablist"
                    aria-label="Filter events by status"
                    className="flex flex-wrap gap-2"
                  >
                    {(["ALL", "ONGOING", "UPCOMING", "COMPLETED"] as const).map(
                      (t) => (
                        <button
                          key={t}
                          role="tab"
                          aria-selected={tab === t}
                          onClick={() => setTab(t)}
                          className={`px-4 py-2 text-sm font-bold border-2 border-black font-productSans transition-all ${
                            tab === t
                              ? "bg-black text-white shadow-[4px_4px_0px_0px_rgba(66,133,244,1)]"
                              : "bg-white text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5"
                          }`}
                        >
                          {t === "ALL"
                            ? "All"
                            : t === "ONGOING"
                              ? "Happening Now"
                              : t === "UPCOMING"
                                ? "Upcoming"
                                : "Past"}
                        </button>
                      ),
                    )}
                  </div>
                </div>
              </div>

              {/* ── Grouped Events ── */}
              {(() => {
                const q = query.trim().toLowerCase();
                const matches = (e: Event) =>
                  !q ||
                  e.title.toLowerCase().includes(q) ||
                  (e.venue ?? "").toLowerCase().includes(q) ||
                  (e.tags ?? []).some((t) => t.toLowerCase().includes(q));
                const byTab = (e: Event) =>
                  tab === "ALL" ? true : e.status === tab;
                const ongoing = events.filter(
                  (e) => e.status === "ONGOING" && byTab(e) && matches(e),
                );
                const upcoming = events.filter(
                  (e) => e.status === "UPCOMING" && byTab(e) && matches(e),
                );
                const completed = events.filter(
                  (e) => e.status === "COMPLETED" && byTab(e) && matches(e),
                );
                const groups = [
                  { title: "Happening Now", items: ongoing },
                  { title: "Upcoming Events", items: upcoming },
                  { title: "Past Events", items: completed },
                ].filter((g) => g.items.length > 0);
                if (groups.length === 0)
                  return (
                    <div className="text-center py-16">
                      <div className="bg-white border-4 border-black rounded-2xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-md mx-auto">
                        <p className="text-black font-bold text-lg font-productSans mb-2">
                          No events match your search.
                        </p>
                        <button
                          onClick={() => {
                            setQuery("");
                            setTab("ALL");
                          }}
                          className="mt-2 px-5 py-2.5 bg-yellow-300 text-black font-bold border-2 border-black font-productSans text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                        >
                          Clear filters
                        </button>
                      </div>
                    </div>
                  );
                return (
                  <div className="flex flex-col gap-12">
                    {groups.map((group) => (
                      <section key={group.title}>
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.2 }}
                          className="flex items-center gap-3 mb-7"
                        >
                          <div className="bg-stone-100 border-2 border-black rounded-2xl px-5 py-2.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <h2 className="text-xl md:text-2xl font-bold text-stone-600 font-productSans">
                              {group.title}
                            </h2>
                          </div>
                          <div className="flex-1 h-0.5 bg-stone-200 rounded-full" />
                        </motion.div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {group.items.map((event, i) => (
                            <EventCard key={event.id} event={event} index={i} />
                          ))}
                        </div>
                      </section>
                    ))}
                  </div>
                );
              })()}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
