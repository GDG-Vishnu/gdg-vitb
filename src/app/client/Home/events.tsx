"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import LoadingEvents from "@/components/loadingPage/loading_events";
type EventItem = {
  id: string;
  title: string;
  description?: string;
  Date?: string;
  Time?: string;
  Theme?: string[];
  venue?: string;
  organizer?: string;
  coOrganizer?: string;
  keyHighlights?: string[];
  tags?: string[];
  status?: string;
  ThemeColor?: string;
  imageUrl?: string;
  rank: number;
};

export default function EventsCarousel() {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [scrollDirection, setScrollDirection] = useState(1); // 1 for right, -1 for left
  // Fetch events from database
  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("/api/events/list");
        if (res.ok) {
          const data = await res.json();
          setEvents(data);
        }
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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

  function renderDesktop() {
    return (
      <div
        ref={scrollerRef}
        className="flex overflow-x-auto space-x-4 px-4 py-3 events-scrollbar"
        style={{
          scrollBehavior: "auto", // Changed to auto for smoother auto-scroll
          WebkitOverflowScrolling: "touch",
        }}
        onWheel={(e) => {
          if (scrollerRef.current) {
            e.preventDefault();
            setIsAutoScrolling(false); // Pause auto-scroll on manual interaction
            scrollerRef.current.scrollLeft += e.deltaY;
            setTimeout(() => setIsAutoScrolling(true), 2000); // Resume after 3s
          }
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
    );
  }

  function renderMobile() {
    return (
      <div
        ref={scrollerRef}
        className="flex overflow-x-auto px-4 events-scrollbar"
        style={{
          scrollPadding: "1rem",
          gap: "12px",
          scrollBehavior: "auto", // Changed to auto for smoother auto-scroll
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "thin",
          scrollbarColor: "#4285F4 #f1f1f1",
        }}
        onWheel={(e) => {
          if (scrollerRef.current) {
            e.preventDefault();
            setIsAutoScrolling(false);
            scrollerRef.current.scrollLeft += e.deltaY;
            setTimeout(() => setIsAutoScrolling(true), 3000);
          }
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {events.map((ev) => (
          <EventCardMobile key={ev.id} event={ev} />
        ))}
      </div>
    );
  }

  if (loading) {
    return <LoadingEvents variant="section" />;
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
      {isMobile ? renderMobile() : renderDesktop()}
    </section>
  );
}

function EventCard({ event }: { event: EventItem }) {
  // Get the primary theme color for the button
  const getButtonStyle = () => {
    const primaryColor =
      event.Theme && event.Theme[0] ? event.Theme[0] : "#4285F4";
    const isLightColor = (color: string) => {
      const hex = color.replace("#", "");
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness > 155;
    };

    const textColor = isLightColor(primaryColor) ? "#000000" : "#ffffff";

    return {
      backgroundColor: primaryColor,
      color: textColor,
      borderColor: "#000000",
    };
  };

  return (
    <article
      className="bg-transparent shadow-md snap-start overflow-hidden"
      style={{
        width: 500,
        height: 472,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "#000",
        borderRadius: 50,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "transparent",
      }}
    >
      {event.imageUrl && (
        <div
          style={{
            height: 350,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "transparent",
            overflow: "hidden",
            padding: "20px",
          }}
        >
          <img
            src={event.imageUrl}
            alt={event.title}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        </div>
      )}

      <div style={{ padding: "20px 30px 30px 30px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div>
            <h3 className="text-2xl font-semibold text-stone-950 font-productSans">
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
              className="translate-x-1 translate-y-1 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-0 hover:translate-y-0 hover:shadow-none transition-all"
            >
              <Link href={`/client/events/${event.id}`}>
                <img
                  src="https://res.cloudinary.com/duvr3z2z0/image/upload/v1760609469/Arrow_left_3x_dte4bu.png"
                  alt=""
                  className="w-[40px] h-[40px]"
                />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}

function EventCardMobile({ event }: { event: EventItem }) {
  // Get the primary theme color for the button
  const getButtonStyle = () => {
    const primaryColor =
      event.Theme && event.Theme[0] ? event.Theme[0] : "#4285F4";
    const isLightColor = (color: string) => {
      const hex = color.replace("#", "");
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness > 155;
    };

    const textColor = isLightColor(primaryColor) ? "#000000" : "#ffffff";

    return {
      backgroundColor: primaryColor,
      color: textColor,
      borderColor: "#000000",
    };
  };

  return (
    <article
      className="bg-transparent shadow-md overflow-hidden rounded-2xl flex-shrink-0 snap-start"
      style={{
        width: 300,
        minWidth: 280,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "#000",
        borderRadius: 28,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "transparent",
      }}
    >
      {event.imageUrl && (
        <div
          style={{
            height: 240,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "transparent",
            overflow: "hidden",
          }}
          className="p-4"
        >
          <img
            src={event.imageUrl}
            alt={event.title}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        </div>
      )}

      <div style={{ padding: 20 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div>
            <h3 className="text-lg font-semibold text-stone-950 font-productSans">
              {event.title}
            </h3>
          </div>

          <div>
            <Button
              asChild
              variant="noShadow"
              size="roundSm"
              aria-label={`Open ${event.title}`}
              style={getButtonStyle()}
              className="hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              <Link href={`/client/events/${event.id}`}>
                <img
                  src="https://res.cloudinary.com/duvr3z2z0/image/upload/v1760609469/Arrow_left_3x_dte4bu.png"
                  alt=""
                  className="w-[40px] h-[40px] sm:w-[30px] sm:h-[30px]"
                />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
