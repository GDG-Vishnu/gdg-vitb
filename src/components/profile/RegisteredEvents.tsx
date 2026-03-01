"use client";

import React from "react";
import { motion } from "framer-motion";
import type { EventSerialized } from "@/types/event";

interface RegisteredEventsProps {
  events: EventSerialized[];
  loading: boolean;
}

/** Pastel backgrounds cycled across cards */
const CARD_COLORS = [
  "bg-[#C3ECF6]", // blue-ish
  "bg-[#CCF6C5]", // green-ish
  "bg-[#F8D8D8]", // pink-ish
  "bg-[#D4C5E2]", // purple-ish
  "bg-[#E8D9A9]", // gold-ish
];

function statusLabel(status: string): string {
  switch (status) {
    case "ongoing":
      return "ONGOING";
    case "completed":
      return "COMPLETED";
    default:
      return "UPCOMING";
  }
}

function formatDate(iso: string | null): string {
  if (!iso) return "TBA";
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "TBA";
  }
}

export default function RegisteredEvents({
  events,
  loading,
}: RegisteredEventsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
      className="bg-[#1E1E1E] border border-white rounded-xl p-4 sm:p-6 shadow-lg mt-4 sm:mt-6"
    >
      <h2 className="text-gray-200 text-lg sm:text-xl font-bold tracking-widest uppercase mb-4 sm:mb-6">
        Events Registered
      </h2>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-gray-600 border-t-[#E8D9A9] rounded-full animate-spin" />
        </div>
      ) : events.length === 0 ? (
        <p className="text-gray-400 text-sm py-8 text-center uppercase tracking-wider">
          You haven&apos;t registered for any events yet.
        </p>
      ) : (
        <div className="space-y-5">
          {events.map((event, idx) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 * idx }}
              className="relative"
            >
              <div
                className={`relative ${CARD_COLORS[idx % CARD_COLORS.length]} p-3 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 border-2 border-black shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]`}
              >
                {/* Left: title + date */}
                <div className="min-w-0">
                  <p className="text-black font-bold text-base sm:text-lg uppercase tracking-wide truncate">
                    {event.title}
                  </p>
                  <p className="text-black/60 text-xs sm:text-sm mt-0.5 sm:mt-1 uppercase tracking-wider">
                    {formatDate(event.date)}
                  </p>
                </div>

                {/* Right: status badge */}
                <span className="shrink-0 self-start sm:self-center inline-block border-2 border-black text-black text-[10px] sm:text-xs font-bold tracking-widest uppercase px-3 sm:px-5 py-1 sm:py-1.5 shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                  {statusLabel(event.status)}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
