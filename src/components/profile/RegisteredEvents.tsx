"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { EventSerialized } from "@/types/event";

interface RegisteredEventsProps {
  events: EventSerialized[];
  registrationDates?: Record<string, string>;
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
    case "ONGOING":
      return "ONGOING";
    case "COMPLETED":
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
  registrationDates = {},
  loading,
}: RegisteredEventsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
      className="bg-[#1E1E1E] border border-white rounded-[14px] w-full min-[1440px]:w-[1264px] p-[16px] sm:p-[20px] md:p-[24px] lg:p-[32px] min-[1440px]:py-[41px] min-[1440px]:px-[45px]"
    >
      {/* ── TITLE ──────────────────────────────────────── */}
      <h2 className="text-gray-200 text-[18px] sm:text-[20px] md:text-[22px] min-[1440px]:text-[24px] font-[900] leading-[146%] tracking-[0.11em] uppercase mb-[14px] sm:mb-[18px] md:mb-[22px] min-[1440px]:mb-[27px]">
        Events Registered
      </h2>

      {loading ? (
        <div className="flex items-center justify-center py-[40px]">
          <div className="w-[32px] h-[32px] border-[4px] border-gray-600 border-t-[#E8D9A9] rounded-full animate-spin" />
        </div>
      ) : events.length === 0 ? (
        <p className="text-gray-400 text-[14px] sm:text-[16px] md:text-[18px] min-[1440px]:text-[20px] font-[400] leading-[146%] tracking-[0.04em] py-[24px] text-center uppercase">
          You haven&apos;t registered for any events yet.
        </p>
      ) : (
        <div className="flex flex-col gap-[12px] sm:gap-[16px] md:gap-[20px] min-[1440px]:gap-[25px]">
          {events.map((event, idx) => (
            <Link
              key={event.id}
              href={
                event.status === "COMPLETED"
                  ? `/events/${event.id}`
                  : `/events/ongoing/${event.id}`
              }
            >
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.05 * idx }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`${CARD_COLORS[idx % CARD_COLORS.length]} w-full flex flex-col sm:flex-row sm:items-center justify-between p-[12px] sm:p-[14px] md:p-[18px] min-[1440px]:py-[28px] min-[1440px]:px-[50px] border border-black shadow-[2px_2px_0px_0px_rgba(255,255,255,1),2px_2px_0px_1px_rgba(0,0,0,1)] gap-[8px] sm:gap-[12px] cursor-pointer transition-all hover:shadow-[3px_3px_0px_0px_rgba(255,255,255,1),3px_3px_0px_1px_rgba(0,0,0,1)]`}
              >
                {/* Event info */}
                <div className="min-w-0 flex flex-col gap-[2px] sm:gap-[4px] min-[1440px]:gap-[9px]">
                  <p className="text-black text-[15px] sm:text-[17px] md:text-[20px] min-[1440px]:text-[24px] font-[900] leading-[146%] tracking-[0.02em] truncate">
                    {event.title}
                  </p>
                  <p className="text-black/60 text-[12px] sm:text-[13px] md:text-[15px] min-[1440px]:text-[20px] font-[400] leading-[146%] tracking-[0.04em]">
                    Registered on{" "}
                    {formatDate(registrationDates[event.id] ?? null)}
                  </p>
                </div>

                {/* Status badge */}
                <div className="shrink-0 self-start sm:self-center flex items-center justify-center px-[10px] py-[4px] sm:px-[14px] sm:py-[6px] md:px-[18px] md:py-[8px] min-[1440px]:px-[34px] min-[1440px]:py-[15px] border border-black">
                  <span className="text-black text-[12px] sm:text-[13px] md:text-[15px] min-[1440px]:text-[20px] font-[400] leading-[146%] tracking-[0.1em] sm:tracking-[0.14em] min-[1440px]:tracking-[0.18em] uppercase whitespace-nowrap">
                    {statusLabel(event.status)}
                  </span>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      )}
    </motion.div>
  );
}
