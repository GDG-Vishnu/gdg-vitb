import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import type { EventSerialized } from "@/types/event";

export const revalidate = 60; // ISR: revalidate every 60 seconds

// ─── Helpers ────────────────────────────────────────────────

function parseTimestamp(val: unknown): string | null {
  if (!val) return null;
  if (typeof val === "object" && val !== null && "toDate" in val) {
    return (val as { toDate: () => Date }).toDate().toISOString();
  }
  if (typeof val === "string") return val;
  return null;
}

export async function GET() {
  try {
    const snap = await adminDb
      .collection("managed_events")
      .orderBy("createdAt", "desc")
      .get();

    const events: EventSerialized[] = snap.docs.map((doc) => {
      const d = doc.data();

      return {
        id: doc.id,
        title: d.title ?? "",
        description: d.description ?? "",
        bannerImage: d.bannerImage ?? null,
        posterImage: d.posterImage ?? null,
        startDate: parseTimestamp(d.startDate),
        endDate: parseTimestamp(d.endDate),
        venue: d.venue ?? "",
        mode: d.mode ?? "OFFLINE",
        status: d.status ?? "UPCOMING",
        eventType: d.eventType ?? "WORKSHOP",
        maxParticipants: d.maxParticipants ?? 0,
        registrationStart: parseTimestamp(d.registrationStart),
        registrationEnd: parseTimestamp(d.registrationEnd),
        isRegistrationOpen: d.isRegistrationOpen ?? false,
        createdBy: d.createdBy ?? "",
        tags: Array.isArray(d.tags) ? d.tags : [],
        keyHighlights: Array.isArray(d.keyHighlights) ? d.keyHighlights : [],
        eligibilityCriteria: d.eligibilityCriteria ?? {
          yearOfGrad: [],
          Dept: [],
        },
        executiveBoard: d.executiveBoard ?? {
          organiser: "",
          coOrganiser: "",
          facilitator: "",
        },
        eventOfficials: Array.isArray(d.eventOfficials) ? d.eventOfficials : [],
        faqs: Array.isArray(d.faqs) ? d.faqs : [],
        rules: Array.isArray(d.rules) ? d.rules : [],
        eventGallery: Array.isArray(d.eventGallery) ? d.eventGallery : [],
        createdAt: parseTimestamp(d.createdAt) ?? undefined,
        updatedAt: parseTimestamp(d.updatedAt) ?? undefined,
      };
    });

    return NextResponse.json(events, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (err) {
    console.error("Failed to fetch events:", err);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 },
    );
  }
}
