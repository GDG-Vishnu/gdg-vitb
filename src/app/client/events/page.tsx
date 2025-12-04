"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/app/client/Home/navbar";
import Footer from "@/components/footer/Footer";
import {
  Calendar,
  MapPin,
  Users,
  Tag,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const carouselImages = [
  {
    url: "https://images.unsplash.com/photo-1580757468214-c73f7062a5cb?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Tech Event 1",
  },
  {
    url: "https://images.unsplash.com/photo-1626593261859-4fe4865d8cb1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Tech Event 2",
  },
  {
    url: "https://images.unsplash.com/photo-1594568284297-7c64464062b1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Tech Event 3",
  },
  {
    url: "https://images.unsplash.com/photo-1599454100789-b211e369bd04?q=80&w=1306&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Tech Event 4",
  },
];

function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % carouselImages.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex(
      (prev) => (prev - 1 + carouselImages.length) % carouselImages.length
    );
  }, []);

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <div
      className="relative bg-white w-full h-[400px] md:h-[500px] lg:h-[550px] overflow-hidden rounded-2xl shadow-xl"
      style={{
        backgroundColor: "white",
        backgroundImage: `linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)`,
        backgroundSize: "20px 20px",
      }}
    >
      {/* Images */}
      {carouselImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={image.url}
            alt={image.alt}
            fill
            className="object-cover"
            priority={index === 0}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>
      ))}

      {/* Content Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white z-10">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
          GDG on Campus Vishnu
        </h2>
        <p className="text-lg md:text-xl text-gray-200 max-w-2xl">
          Building the future, one event at a time. Join our community of
          developers!
        </p>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-colors z-20"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-colors z-20"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              index === currentIndex
                ? "bg-white w-8"
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

type Event = {
  id: number;
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
  ThemeColor?: string | null;
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

  return (
    <article
      className="bg-transparent shadow-md snap-start overflow-hidden"
      style={{
        width: 450,
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
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "transparent",
            overflow: "hidden",
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
              className="rounded-full flex items-center justify-center shadow-lg hover:opacity-80 transition-opacity"
              style={{
                width: 56,
                height: 56,
                fontSize: 18,
                display: "inline-flex",
                backgroundColor: theme.primary,
              }}
            >
              <img
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

const EVENTS_CACHE_KEY = "gdg_events_cache";
const EVENTS_CACHE_TIMESTAMP_KEY = "gdg_events_cache_timestamp";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function getEventsFromCache(): Event[] | null {
  if (typeof window === "undefined") return null;
  try {
    const cached = localStorage.getItem(EVENTS_CACHE_KEY);
    const timestamp = localStorage.getItem(EVENTS_CACHE_TIMESTAMP_KEY);
    if (cached && timestamp) {
      const age = Date.now() - parseInt(timestamp, 10);
      if (age < CACHE_DURATION) {
        return JSON.parse(cached);
      }
    }
  } catch (e) {
    console.error("Error reading events from cache:", e);
  }
  return null;
}

function setEventsToCache(events: Event[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(EVENTS_CACHE_KEY, JSON.stringify(events));
    localStorage.setItem(EVENTS_CACHE_TIMESTAMP_KEY, Date.now().toString());
  } catch (e) {
    console.error("Error saving events to cache:", e);
  }
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    // First, try to load from cache for instant display
    const cachedEvents = getEventsFromCache();
    if (cachedEvents && cachedEvents.length > 0) {
      setEvents(cachedEvents);
      setLoading(false);
    }

    // Then fetch fresh data from API
    (async () => {
      try {
        const res = await fetch("/api/events/list");
        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();
        if (!mounted) return;
        const eventsList = Array.isArray(data) ? data : [];
        setEvents(eventsList);
        setEventsToCache(eventsList); // Save to localStorage
      } catch (err: any) {
        console.error(err);
        // Only show error if we don't have cached data
        if (mounted && (!cachedEvents || cachedEvents.length === 0)) {
          setError(err?.message || "Unknown error");
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
      className="min-h-screen bg-gray-50 relative overflow-hidden"
      style={{
        backgroundColor: "white",
        backgroundImage: `linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)`,
        backgroundSize: "20px 20px",
      }}
    >
      <Navbar />

      <main className="relative z-10 py-12 px-4">
        {/* Hero Carousel 
        <div className="max-w-6xl mx-auto mb-12">
          <HeroCarousel />
        </div>*/}

        {/* Page Header */}
        <div className="max-w-6xl mx-auto mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Our Events</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover workshops, hackathons, and tech talks organized by GDG on
            Campus Vishnu. Join us to learn, build, and connect with fellow
            developers!
          </p>
        </div>

        {/* Events Grid */}
        <div className="max-w-6xl mx-auto">
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            </div>
          )}

          {!loading && error && (
            <div className="text-center py-20">
              <p className="text-red-500 font-medium">Error: {error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && events.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📅</div>
              <p className="text-gray-500 text-lg">No events found.</p>
              <p className="text-gray-400 text-sm mt-2">
                Check back later for upcoming events!
              </p>
            </div>
          )}

          {!loading && !error && events.length > 0 && (
            <div className="flex flex-wrap justify-center gap-6  w-full">
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
