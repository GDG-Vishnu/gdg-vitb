import { NextResponse, NextRequest } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import type { EventSerialized } from "@/types/event";

export const revalidate = 60; // ISR: revalidate every 60 seconds

// ─── Per-event in-memory cache ───────────────────────────────
// Prevents repeat Firestore reads when multiple users open the same event page.
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const _eventCache = new Map<
  string,
  { event: EventSerialized; expiresAt: number }
>();
const _inflightById = new Map<string, Promise<EventSerialized>>();

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
  let id = "";
  try {
    ({ id } = await params);

    // Validate ID format
    if (!id || typeof id !== "string" || id.length > 128 || /[\/]/.test(id)) {
      return NextResponse.json({ error: "Invalid event ID" }, { status: 400 });
    }

    // ── Serve from cache if still fresh ─────────────────────
    const cached = _eventCache.get(id);
    if (cached && Date.now() < cached.expiresAt) {
      return NextResponse.json(cached.event, {
        headers: {
          "Cache-Control":
            "public, max-age=60, s-maxage=60, stale-while-revalidate=300",
          "X-Cache": "HIT",
        },
      });
    }

    if (!_inflightById.has(id)) {
      const fetchPromise = (async () => {
        const docRef = adminDb.collection("managed_events").doc(id);
        const snap = await docRef.get();

        if (!snap.exists) {
          throw new Error("EVENT_NOT_FOUND");
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
          eventOfficials: Array.isArray(d.eventOfficials)
            ? d.eventOfficials
            : [],
          faqs: Array.isArray(d.faqs) ? d.faqs : [],
          rules: Array.isArray(d.rules) ? d.rules : [],
          eventGallery: Array.isArray(d.eventGallery) ? d.eventGallery : [],
          Theme: (() => {
            if (Array.isArray(d.Theme)) return d.Theme;
            if (typeof d.Theme === "string") {
              try {
                return JSON.parse(d.Theme);
              } catch {
                return [];
              }
            }
            return [];
          })(),
          createdAt: parseTimestamp(d.createdAt) ?? undefined,
          updatedAt: parseTimestamp(d.updatedAt) ?? undefined,
        };

        // Populate cache
        _eventCache.set(id, { event, expiresAt: Date.now() + CACHE_TTL_MS });
        return event;
      })().finally(() => {
        _inflightById.delete(id);
      });

      _inflightById.set(id, fetchPromise);
    }

    const event = await _inflightById.get(id)!;

    return NextResponse.json(event, {
      headers: {
        "Cache-Control":
          "public, max-age=60, s-maxage=60, stale-while-revalidate=300",
        "X-Cache": "MISS",
      },
    });
  } catch (err) {
    if (err instanceof Error && err.message === "EVENT_NOT_FOUND") {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    console.error("Failed to fetch event:", err);
    // If quota is exhausted but we have a stale entry for this id, serve it.
    const stale = _eventCache.get(id);
    if (stale) {
      console.warn(
        `Serving stale cache for event ${id} due to Firestore error`,
      );
      return NextResponse.json(stale.event, {
        headers: {
          "Cache-Control":
            "public, max-age=60, s-maxage=60, stale-while-revalidate=300",
          "X-Cache": "STALE",
        },
      });
    }
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 },
    );
  }
}
