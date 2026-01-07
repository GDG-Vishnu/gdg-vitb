"use client";
import Image from "next/image";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";

type EventItem = {
  id: string;
  title: string;
  description?: string;
  Date?: string;
  Time?: string;
  venue?: string;
  organizer?: string;
  coOrganizer?: string;
  keyHighlights?: string[];
  tags?: string[];
  status?: string;
  ThemeColor?: string;
  imageUrl?: string;
};

export default function EventsCarousel() {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

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

  function renderDesktop() {
    return (
      <div
        ref={scrollerRef}
        className="no-scrollbar flex overflow-x-auto px-4 py-3 snap-x snap-mandatory"
        style={{ scrollPadding: "1.5rem", gap: "14px" }}
      >
        {events
          .sort((a, b) => a.id - b.id)
          .map((ev) => (
            <EventCard key={ev.id} event={ev} />
          ))}
      </div>
    );
  }

  function renderMobile() {
    return (
      <div
        ref={scrollerRef}
        className="no-scrollbar flex overflow-x-auto px-4 snap-x snap-mandatory"
        style={{ scrollPadding: "1rem", gap: "12px" }}
      >
        {events
          .sort((a, b) => b.id - a.id)
          .map((ev) => (
            <EventCardMobile key={ev.id} event={ev} />
          ))}
      </div>
    );
  }

  if (loading) {
    return (
      <section className="w-full py-10">
        <div className="flex justify-center items-center h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return (
      <section className="w-full py-10">
        <div className="flex justify-center items-center h-[400px]">
          <p className="text-gray-500 text-lg">No events available</p>
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
  // Helper to get button color class based on ThemeColor
  const getButtonClass = (color?: string) => {
    const themeColor = color?.toLowerCase() || "pink";
    if (
      themeColor === "yellow" ||
      themeColor === "#ffeb3b" ||
      themeColor.includes("yellow")
    )
      return "bg-yellow-400 hover:bg-yellow-500 text-black";
    if (
      themeColor === "black" ||
      themeColor === "#000000" ||
      themeColor.includes("black")
    )
      return "bg-black hover:bg-gray-800 text-white";
    if (themeColor === "blue" || themeColor.includes("blue"))
      return "bg-blue-500 hover:bg-blue-600 text-white";
    if (themeColor === "green" || themeColor.includes("green"))
      return "bg-green-500 hover:bg-green-600 text-white";
    if (themeColor === "red" || themeColor.includes("red"))
      return "bg-red-500 hover:bg-red-600 text-white";
    return "bg-pink-500 hover:bg-pink-600 text-white";
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
          className="flex items-center justify-center overflow-hidden bg-transparent w-full"
          style={{ flex: 1 }}
        >
          <Image
            src={event.imageUrl}
            alt={event.title}
            width={600} // required: set width
            height={400} // required: set height
            className="
    w-full max-w-xs        /* mobile */
    sm:max-w-sm
    md:max-w-md
    lg:max-w-lg
    xl:max-w-xl
    h-auto object-contain
  "
          />
        </div>
      )}

      <div style={{ padding: 30 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div>
            <h3 className="text-2xl font-semibold text-stone-950">
              {event.title}
            </h3>
          </div>

          <div>
            <Link
              href={`/client/events/${event.id}`}
              aria-label={`Open ${event.title}`}
              className={`${getButtonClass(
                event.ThemeColor
              )} rounded-full flex items-center justify-center shadow-lg`}
              style={{
                width: 56,
                height: 56,
                fontSize: 18,
                display: "inline-flex",
              }}
            >
              <Image
                src="https://res.cloudinary.com/duvr3z2z0/image/upload/v1760609469/Arrow_left_3x_dte4bu.png"
                alt=""
                width={24}
                height={24}
              />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function EventCardMobile({ event }: { event: EventItem }) {
  // Helper to get button color class based on ThemeColor
  const getButtonClass = (color?: string) => {
    const themeColor = color?.toLowerCase() || "pink";
    if (
      themeColor === "yellow" ||
      themeColor === "#ffeb3b" ||
      themeColor.includes("yellow")
    )
      return "bg-yellow-400 hover:bg-yellow-500 text-black";
    if (
      themeColor === "black" ||
      themeColor === "#000000" ||
      themeColor.includes("black")
    )
      return "bg-black hover:bg-gray-800 text-white";
    if (themeColor === "blue" || themeColor.includes("blue"))
      return "bg-blue-500 hover:bg-blue-600 text-white";
    if (themeColor === "green" || themeColor.includes("green"))
      return "bg-green-500 hover:bg-green-600 text-white";
    if (themeColor === "red" || themeColor.includes("red"))
      return "bg-red-500 hover:bg-red-600 text-white";
    return "bg-pink-500 hover:bg-pink-600 text-white";
  };

  return (
    <article
      className="bg-transparent shadow-md overflow-hidden rounded-2xl flex-shrink-0 snap-start"
      style={{
        width: 280,
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
            height: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "transparent",
            overflow: "hidden",
            padding: 10,
          }}
        >
          <Image
            src={event.imageUrl}
            alt={event.title}
            style={{
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
            <h3 className="text-lg font-semibold text-stone-950">
              {event.title}
            </h3>
          </div>

          <div>
            <Link
              href={`/client/events/${event.id}`}
              aria-label={`Open ${event.title}`}
              className={`${getButtonClass(
                event.ThemeColor
              )} rounded-full flex items-center justify-center shadow-lg`}
              style={{
                width: 48,
                height: 48,
                fontSize: 16,
                display: "inline-flex",
              }}
            >
              <Image
                src="https://res.cloudinary.com/duvr3z2z0/image/upload/v1760609469/Arrow_left_3x_dte4bu.png"
                alt=""
              />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
