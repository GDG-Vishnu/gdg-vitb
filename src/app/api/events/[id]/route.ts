import { NextResponse, NextRequest } from "next/server";
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // Validate ID format
    if (!id || typeof id !== "string" || id.length > 128 || /[\/]/.test(id)) {
      return NextResponse.json({ error: "Invalid event ID" }, { status: 400 });
    }

    const docRef = adminDb.collection("managed_events").doc(id);
    const snap = await docRef.get();

    if (!snap.exists) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const d = snap.data()!;

    const event: EventSerialized = {
      id: snap.id,
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

    return NextResponse.json(event, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (err) {
    console.error("Failed to fetch event:", err);
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 },
    );
  }
}
