"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/app/client/Home/navbar";
import Footer from "@/components/footer/Footer";
import {
  Calendar,
  CalendarDays,
  MapPin,
  Users,
  Tag,
  ChevronLeft,
  ChevronRight,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import LoadingEvents from "@/components/loadingPage/loading_events";

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
      className="relative bg-white w-full h-[400px] md:h-[500px] lg:h-[550px] overflow-hidden rounded-3xl border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all duration-300"
      style={{
        backgroundColor: "white",
        backgroundImage: `radial-gradient(rgba(0,0,0,0.1) 1px, transparent 1px)`,
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
      <div className="absolute bottom-6 left-6 right-6 z-10">
        <div className="bg-white border-4 border-black rounded-2xl p-4 md:p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all duration-200">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 text-black font-productSans">
            GDG on Campus Vishnu
          </h2>
          <p className="text-base md:text-lg text-gray-700 max-w-2xl font-productSans">
            Building the future, one event at a time. Join our community of
            developers!
          </p>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-xl bg-yellow-400 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 z-20"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-black" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-xl bg-yellow-400 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 z-20"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-black" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-4 h-4 border-2 border-black transition-all duration-200 ${
              index === currentIndex
                ? "bg-yellow-400 w-8 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                : "bg-white rounded-full hover:bg-yellow-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
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
      } catch (err: any) {
        console.error(err);
        if (mounted) {
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
      className="min-h-screen bg-white relative overflow-hidden"
      style={{
        backgroundColor: "#f8fafc",
        backgroundImage: `radial-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), radial-gradient(rgba(59,130,246,0.03) 1px, transparent 1px)`,
        backgroundPosition: "0 0, 25px 25px",
        backgroundSize: "50px 50px",
      }}
    >
      <Navbar />

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
