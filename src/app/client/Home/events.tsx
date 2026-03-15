"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LoadingEvents } from "@/components/loadingPage";
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
          <div key={ev.id} className="flex-shrink-0">
            <EventCard event={ev} />
          </div>
        ))}
      </div>
    </section>
  );
}

function EventCard({ event }: { event: EventItem }) {
  const getButtonStyle = () => {
    return {
      backgroundColor: "#4285F4",
      color: "#ffffff",
      borderColor: "#000000",
    };
  };

  return (
    <article className="bg-transparent shadow-md snap-start overflow-hidden border border-black rounded-[28px] md:rounded-[50px] flex flex-col justify-between box-border w-[300px] sm:w-[350px] md:w-[400px] lg:w-[450px] xl:w-[500px] h-auto md:h-[472px]">
      {event.posterImage && (
        <div className="flex items-center justify-center p-4 md:p-5">
          <div className="w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] md:w-[350px] md:h-[320px] rounded-2xl overflow-hidden">
            <img
              src={event.posterImage}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      <div className="p-5 md:p-[20px_30px_30px_30px]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg md:text-2xl font-semibold text-stone-950 font-productSans">
              {event.title}
            </h3>
          </div>

          <div>
            <Button
              asChild
              variant="noShadow"
              size="round"
              aria-label={`Open ${event.title}`}
              style={getButtonStyle()}
              className="translate-x-1 translate-y-1 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-0 hover:translate-y-0 hover:shadow-none transition-all scale-90 md:scale-100 origin-bottom-right"
            >
              <Link href={`/events/${event.id}`}>
                <img
                  src="https://res.cloudinary.com/duvr3z2z0/image/upload/v1760609469/Arrow_left_3x_dte4bu.png"
                  alt=""
                  className="w-[30px] h-[30px] md:w-[40px] md:h-[40px]"
                />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
