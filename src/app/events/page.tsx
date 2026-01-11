"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
//Navbar removed
import Footer from "@/components/footer/Footer";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoadingEvents from "@/components/loadingPage/loading_events";

type Event = {
  id: string;
  title: string;
  description: string | null;
  Date: string | null;
  Time: string | null;
  venue: string | null;
  organizer: string | null;
  coOrganizer: string | null;
  keyHighlights: string[] | null;
  tags: string[] | null;
  status: string | null;
  Theme: string[] | null;
  imageUrl?: string | null;

  coverUrl?: string | null;
};

// Theme color helper - extracts colors from event Theme array
function getThemeColors(theme: string[] | null) {
  const defaultTheme = ["#4285F4", "#34A853", "#FBBC05", "#EA4335", "#3D85C6"];
  const colors = theme && theme.length >= 5 ? theme : defaultTheme;
  return {
    primary: colors[0],
    secondary: colors[1],
    accent: colors[2],
    highlight: colors[3],
    bgAccent: colors[4],
  };
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "TBA";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function EventCard({ event }: { event: Event }) {
  const theme = getThemeColors(event.Theme);

  // Get the primary theme color for the button
  const getButtonStyle = () => {
    const primaryColor =
      event.Theme && event.Theme[0] ? event.Theme[0] : "#FBBC05";

    return {
      backgroundColor: primaryColor,
      color: "#000000",
      borderColor: "#000000",
      borderWidth: "3px",
      borderStyle: "solid",
    };
  };

  const startDate = event.Date ? formatDate(event.Date) : "TBA";
  const eventTime = event.Time ? event.Time : "TBA";
  const eventVenue = event.venue ? event.venue : "TBA";

  return (
    <article
      className="bg-white shadow-md snap-start overflow-hidden w-full border border-black flex flex-col justify-between
        rounded-[30px] sm:rounded-[40px] lg:rounded-[50px]
        h-[380px] sm:h-[420px] lg:h-[472px]"
    >
      {/* Image Container */}
      {event.imageUrl && (
        <div className="flex-1 flex items-center justify-center bg-transparent overflow-hidden p-3 sm:p-4">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover rounded-[24px] sm:rounded-[32px] lg:rounded-[40px]"
          />
        </div>
      )}

      {/* Content Container */}
      <div className="px-4 py-3 sm:px-6 sm:py-4 lg:px-8 lg:py-6">
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          {/* Title */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-stone-950 font-productSans truncate">
              {event.title}
            </h3>
          </div>

          {/* Button */}
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
              <Link href={`/events/${event.id}`}>
                <img
                  src="https://res.cloudinary.com/duvr3z2z0/image/upload/v1760609469/Arrow_left_3x_dte4bu.png"
                  alt=""
                  className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 object-contain"
                />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    // Fetch fresh data from API
    (async () => {
      try {
        const res = await fetch("/api/events/list");
        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();
        if (!mounted) return;
        const eventsList = Array.isArray(data) ? data : [];
        setEvents(eventsList);
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
        backgroundColor: "white",
        backgroundImage:
          "linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      {/* Navbar removed */}

      <main className="relative z-10 py-12 px-4">
        {/* Hero Carousel 
        <div className="max-w-6xl mx-auto mb-12">
          <HeroCarousel />
        </div>*/}

        {/* Page Header */}
        <div className="max-w-6xl mx-auto mb-12 text-center relative">
          {/* Decorative Elements */}
          <div className="absolute -top-4 -left-4 w-16 h-16 bg-blue-400 border-3 border-black rounded-xl rotate-12 opacity-20 animate-pulse"></div>
          <div className="absolute -top-2 -right-8 w-12 h-12 bg-yellow-400 border-3 border-black rounded-full opacity-15 animate-bounce"></div>
          <div className="absolute top-8 right-4 w-8 h-8 bg-red-400 border-2 border-black rounded-lg rotate-45 opacity-10"></div>

          <div className="relative inline-block mb-6">
            <div className="absolute -inset-4 bg-yellow-300 border-4 border-black rounded-3xl transform rotate-1 opacity-80 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"></div>
            <h1 className="relative text-4xl md:text-5xl lg:text-6xl font-bold text-black font-productSans px-6 py-4">
              Our Events
            </h1>
          </div>

          <div className="relative inline-block">
            <div className="absolute -inset-3 bg-blue-200 border-3 border-black rounded-2xl transform -rotate-1 opacity-70 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"></div>
            <p className="relative text-lg md:text-xl text-black font-productSans max-w-3xl mx-auto px-4 py-2 font-medium">
              Discover workshops, hackathons, and tech talks organized by GDG on
              Campus Vishnu. Join us to learn, build, and connect with fellow
              developers!
            </p>
          </div>
        </div>

        {/* Events Grid */}
        <div className="max-w-6xl mx-auto">
          {loading && <LoadingEvents />}

          {!loading && error && (
            <div className="text-center py-20">
              <div className="bg-red-100 border-4 border-red-500 rounded-2xl p-8 shadow-[8px_8px_0px_0px_rgba(239,68,68,1)] max-w-md mx-auto">
                <p className="text-red-800 font-bold text-lg font-productSans mb-4">
                  ⚠️ Error: {error}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-red-500 text-white font-bold border-3 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 font-productSans"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {!loading && !error && events.length === 0 && (
            <div className="text-center py-20">
              <div className="bg-yellow-100 border-4 border-yellow-500 rounded-3xl p-12 shadow-[12px_12px_0px_0px_rgba(234,179,8,1)] max-w-lg mx-auto">
                <div className="text-8xl mb-6 transform hover:scale-110 transition-transform duration-200">
                  📅
                </div>
                <p className="text-yellow-800 font-bold text-xl font-productSans mb-2">
                  No events found.
                </p>
                <p className="text-yellow-700 font-productSans text-base">
                  Check back later for upcoming events!
                </p>
              </div>
            </div>
          )}

          {!loading && !error && events.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
