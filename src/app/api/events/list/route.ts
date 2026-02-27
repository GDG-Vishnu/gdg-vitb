import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const snap = await adminDb
      .collection("events")
      .orderBy("rank", "asc")
      .get();

    const events = snap.docs.map((doc) => {
      const data = doc.data();

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

      return {
        id: doc.id,
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
    });

    return NextResponse.json(events);
  } catch (err) {
    console.error("Failed to fetch events:", err);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 },
    );
  }
}
