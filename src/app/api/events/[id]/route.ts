import { NextResponse, NextRequest } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

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

    const data = snap.data()!;

    // Helper: Firestore may store arrays as JSON strings — safely parse them
    const parseArray = (val: unknown): string[] => {
      if (Array.isArray(val)) return val;
      if (typeof val === "string") {
        try {
          const parsed = JSON.parse(val);
          if (Array.isArray(parsed)) return parsed;
        } catch {}
      }
      return [];
    };

    const parseBool = (val: unknown): boolean => {
      if (typeof val === "boolean") return val;
      if (val === "true") return true;
      return false;
    };

    const event = {
      id: snap.id,
      rank: data.rank ?? 0,
      title: data.title,
      description: data.description,
      Date: data.Date?.toDate?.().toISOString() ?? data.Date ?? null,
      Time: data.Time,
      venue: data.venue,
      organizer: data.organizer,
      coOrganizer: data.coOrganizer ?? null,
      keyHighlights: parseArray(data.keyHighlights),
      tags: parseArray(data.tags),
      status: data.status,
      eventGallery: parseArray(data.eventGallery),
      imageUrl: data.imageUrl ?? null,
      coverUrl: data.coverUrl ?? null,
      isDone: parseBool(data.isDone),
      MembersParticipated: data.MembersParticipated ?? 0,
      Theme: parseArray(data.Theme),
    };

    return NextResponse.json(event);
  } catch (err) {
    console.error("Failed to fetch event:", err);
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 },
    );
  }
}
