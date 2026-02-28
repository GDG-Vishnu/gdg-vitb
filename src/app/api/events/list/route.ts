import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import type { EventSerialized } from "@/types/event";

export const dynamic = "force-dynamic";
export const revalidate = 60; // ISR: revalidate every 60 seconds

// ─── Helpers ────────────────────────────────────────────────

/** Safely coerce values that may be stored as JSON strings */
function parseArray(val: unknown): string[] {
  if (Array.isArray(val)) return val;
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      /* not JSON */
    }
  }
  return [];
}

function parseBool(val: unknown): boolean {
  if (typeof val === "boolean") return val;
  if (val === "true") return true;
  return false;
}

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
      .collection("events")
      .orderBy("rank", "asc")
      .get();

    const events: EventSerialized[] = snap.docs.map((doc) => {
      const d = doc.data();

      return {
        id: doc.id,
        title: d.title ?? "",
        description: d.description ?? "",
        imageUrl: d.imageUrl ?? null,
        coverUrl: d.coverUrl ?? null,
        // Support both new "date" and legacy "Date" field
        date: parseTimestamp(d.date ?? d.Date),
        endDate: parseTimestamp(d.endDate),
        venue: d.venue ?? "",
        organizer: d.organizer ?? "",
        coOrganizer: d.coOrganizer ?? null,
        // Support both new lowercase and legacy PascalCase
        theme: parseArray(d.theme ?? d.Theme),
        tags: parseArray(d.tags),
        keyHighlights: parseArray(d.keyHighlights),
        eventGallery: parseArray(d.eventGallery),
        membersParticipated:
          d.membersParticipated ?? d.MembersParticipated ?? 0,
        rank: d.rank ?? 0,
        status: d.status ?? "upcoming",
        isDone: parseBool(d.isDone),
        registrationEnabled: parseBool(d.registrationEnabled),
        teamSizeMin: d.teamSizeMin ?? 1,
        teamSizeMax: d.teamSizeMax ?? 1,
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
