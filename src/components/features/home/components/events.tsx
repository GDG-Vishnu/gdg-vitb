"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LoadingEvents } from "@/components/loadingPage";
import { ArrowUpRight } from "lucide-react";
import { fetchEventList } from "@/lib/events-list-cache";

type EventItem = {
  id: string;
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  venue?: string;
  mode?: string;
  status?: string;
  eventType?: string;
  keyHighlights?: string[];
  tags?: string[];
  posterImage?: string;
  bannerImage?: string;
};

export default function EventsCarousel() {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [scrollDirection, setScrollDirection] = useState(1); // 1 for right, -1 for left

  // Fetch events — uses the shared in-memory browser cache (2 min TTL).
  // Sort by startDate ascending so the carousel flows oldest → newest (latest event is at the right end).
  useEffect(() => {
    fetchEventList<EventItem>()
      .then((data) => {
        const sorted = [...data].sort((a, b) => {
          const ta = a.startDate ? new Date(a.startDate).getTime() : 0;
          const tb = b.startDate ? new Date(b.startDate).getTime() : 0;
          return tb - ta; // ascending: oldest left, latest right
        });
        setEvents(sorted);
      })
      .catch((err) => console.error("Failed to fetch events:", err))
      .finally(() => setLoading(false));
  }, []);

  // Auto-scroll functionality
  useEffect(() => {
    if (!isAutoScrolling || events.length === 0) return;

    const autoScroll = () => {
      if (scrollerRef.current) {
        const container = scrollerRef.current;
        const scrollAmount = 2; // pixels per frame
        const maxScrollLeft = container.scrollWidth - container.clientWidth;

        if (scrollDirection === 1) {
          // Scrolling right
          if (container.scrollLeft >= maxScrollLeft - 1) {
            setScrollDirection(-1); // Change direction to left
          } else {
            container.scrollLeft += scrollAmount;
          }
        } else {
          // Scrolling left
          if (container.scrollLeft <= 1) {
            setScrollDirection(1); // Change direction to right
          } else {
            container.scrollLeft -= scrollAmount;
          }
        }
      }
    };
    const intervalId = setInterval(autoScroll, 30); // Smooth 30ms interval
    return () => clearInterval(intervalId);
  }, [isAutoScrolling, events.length, scrollDirection]);

  // Pause auto-scroll on hover/interaction
  const handleMouseEnter = () => setIsAutoScrolling(false);
  const handleMouseLeave = () => setIsAutoScrolling(true);
  const handleTouchStart = () => setIsAutoScrolling(false);
  const handleTouchEnd = () => setTimeout(() => setIsAutoScrolling(true), 2000); // Resume after 2s

  // Set up non-passive wheel event listeners to prevent the passive event listener warning
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      setIsAutoScrolling(false);
      scroller.scrollLeft += e.deltaY;
      setTimeout(() => setIsAutoScrolling(true), 2000);
    };

    scroller.addEventListener("wheel", handleWheel, { passive: false });
    return () => scroller.removeEventListener("wheel", handleWheel);
  }, []);

  if (loading) {
    return <LoadingEvents variant="page" message="Loading Events..." />;
  }

  if (events.length === 0) {
    return (
      <section className="w-full py-10">
        <div className="flex justify-center items-center h-[400px]">
          <p className="text-gray-500 text-lg font-productSans">
            No events available
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-10">
      <div
        ref={scrollerRef}
        className="flex overflow-x-auto gap-3 md:gap-4 px-4 py-8 events-scrollbar"
        style={{
          scrollBehavior: "auto",
          WebkitOverflowScrolling: "touch",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {events.map((ev) => (
          <div
            key={ev.id}
            className="flex-shrink-0 w-[300px] sm:w-[350px] md:w-[400px] lg:w-[450px] xl:w-[500px]"
          >
            <EventCard event={ev} />
          </div>
        ))}
      </div>
    </section>
  );
}

function formatCardDate(dateStr?: string): string {
  if (!dateStr) return "TBA";
  const t = new Date(dateStr).getTime();
  if (Number.isNaN(t)) return "TBA";
  return new Date(t).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function normalizeImageSrc(src?: string): string | null {
  if (!src) return null;
  const trimmed = src.trim();
  return trimmed ? trimmed : null;
}

function EventCard({ event }: { event: EventItem }) {
  const accentColor = "#4285F4";
  const posterSrc = normalizeImageSrc(event.posterImage);
  const [imgError, setImgError] = useState(false);
  const getButtonStyle = () => {
    return {
      backgroundColor: accentColor,
      color: "#ffffff",
      borderColor: "#000000",
      borderWidth: "3px",
      borderStyle: "solid",
    };
  };

  return (
    <article className="relative bg-white shadow-md snap-start overflow-hidden w-full border border-black flex flex-col justify-between rounded-[30px] sm:rounded-[40px] lg:rounded-[50px] h-[440px] sm:h-[420px] lg:h-[472px]">
      {/* Image Container */}
      <div className="flex-1 relative overflow-hidden p-3 sm:p-4">
        {posterSrc && !imgError ? (
          <span className="relative block w-full h-full">
            <Image
              src={posterSrc}
              alt={event.title}
              fill
              loading="lazy"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover rounded-[24px] sm:rounded-[32px] lg:rounded-[40px]"
              onError={() => setImgError(true)}
            />
          </span>
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
                w-16 h-16 sm:w-12 sm:h-12 lg:w-14 lg:h-14 p-0 flex items-center justify-center"
            >
              <Link
                href={`/events/${event.id}`}
                aria-label={`Open ${event.title}`}
                className="flex h-full w-full items-center justify-center"
              >
                <ArrowUpRight className="w-12 h-12 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
