"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/app/client/Home/navbar";
import Footer from "@/components/footer/Footer";

type EventItem = {
  id: string;
  event_title: string;
  description?: string | null;
  date_time?: string | null;
  venue_or_mode?: string | null;
  organizers?: any;
  key_highlights?: string[] | null;
  tags_or_categories?: string[] | null;
  status?: string | null;
  created_at?: string | null;
};

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const res = await fetch("/api/events/list");
        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();
        if (!mounted) return;
        setEvents(Array.isArray(data) ? data : []);
      } catch (err: any) {
        console.error(err);
        if (mounted) setError(err?.message || "Unknown error");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <Navbar />

      <main className="relative z-10 flex flex-col items-center justify-start pt-8 px-4">
        <h1 className="text-2xl font-bold mb-4 text-stone-950">Events</h1>

        <div className="w-full max-w-4xl">
          {loading && <div>Loading events...</div>}

          {!loading && error && (
            <div className="text-center text-destructive">Error: {error}</div>
          )}

          {!loading && !error && events.length === 0 && (
            <div className="text-center text-muted-foreground">
              No events found.
            </div>
          )}

          {!loading && !error && events.length > 0 && (
            <ul className="space-y-4">
              {events.map((ev) => (
                <li
                  key={ev.id}
                  className="p-4 border rounded-lg shadow-sm bg-white"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold">
                        {ev.event_title}
                      </h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        {ev.date_time} • {ev.venue_or_mode}
                      </p>
                      {ev.description && (
                        <p className="mt-2 text-sm text-stone-700">
                          {ev.description.length > 300
                            ? ev.description.slice(0, 300) + "..."
                            : ev.description}
                        </p>
                      )}
                    </div>

                    <div className="text-right">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          ev.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {ev.status || "Unknown"}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
