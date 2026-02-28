import { NextResponse, NextRequest } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import type { EventSerialized } from "@/types/event";

export const dynamic = "force-dynamic";
export const revalidate = 60; // ISR: revalidate every 60 seconds

// ─── Helpers ────────────────────────────────────────────────

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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const docRef = adminDb.collection("events").doc(id);
    const snap = await docRef.get();

    if (!snap.exists) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const d = snap.data()!;

    const event: EventSerialized = {
      id: snap.id,
      title: d.title ?? "",
      description: d.description ?? "",
      imageUrl: d.imageUrl ?? null,
      coverUrl: d.coverUrl ?? null,
      date: parseTimestamp(d.date ?? d.Date),
      endDate: parseTimestamp(d.endDate),
      venue: d.venue ?? "",
      organizer: d.organizer ?? "",
      coOrganizer: d.coOrganizer ?? null,
      theme: parseArray(d.theme ?? d.Theme),
      tags: parseArray(d.tags),
      keyHighlights: parseArray(d.keyHighlights),
      eventGallery: parseArray(d.eventGallery),
      membersParticipated: d.membersParticipated ?? d.MembersParticipated ?? 0,
      rank: d.rank ?? 0,
      status: d.status ?? "upcoming",
      isDone: parseBool(d.isDone),
      registrationEnabled: parseBool(d.registrationEnabled),
      teamSizeMin: d.teamSizeMin ?? 1,
      teamSizeMax: d.teamSizeMax ?? 1,
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
