import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import type { EventSerialized } from "@/types/event";

export const revalidate = 60; // ISR: revalidate every 60 seconds

// ─── In-memory cache (server-side) ──────────────────────────
// Survives across requests within the same Node.js process,
// keeping Firestore reads to ~1 per TTL window instead of 1 per user.
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
let _cachedEvents: EventSerialized[] | null = null;
let _cacheExpiresAt = 0;

// ─── Helpers ────────────────────────────────────────────────

function parseTimestamp(val: unknown): string | null {
  if (!val) return null;
  if (typeof val === "object" && val !== null && "toDate" in val) {
    return (val as { toDate: () => Date }).toDate().toISOString();
  }
  if (typeof val === "string") return val;
  return null;
}

// ─── Dev-only mock data ──────────────────────────────────────
// Used when Firestore quota is exhausted and cache is empty (dev only).
// Edit these objects to match whatever you're testing on the ongoing page.
const DEV_MOCK_EVENTS: EventSerialized[] = [
  {
    id: "mock-event-ongoing-1",
    title: "GDG Mock Workshop (DEV)",
    description: "This is mock data — Firestore quota exhausted.",
    bannerImage: null,
    posterImage: null,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    venue: "Main Auditorium",
    mode: "OFFLINE",
    status: "ONGOING",
    eventType: "WORKSHOP",
    maxParticipants: 100,
    registrationStart: new Date(
      Date.now() - 7 * 24 * 60 * 60 * 1000,
    ).toISOString(),
    registrationEnd: new Date(
      Date.now() - 1 * 24 * 60 * 60 * 1000,
    ).toISOString(),
    isRegistrationOpen: false,
    createdBy: "dev@gdgvitb.in",
    tags: ["Android", "Web", "Cloud"],
    keyHighlights: ["Hands-on session", "Certificate", "Free goodies"],
    eligibilityCriteria: {
      yearOfGrad: [false, true, true, false],
      Dept: ["CSE", "IT"],
    },
    executiveBoard: {
      organiser: "Dev User",
      coOrganiser: "Dev Co",
      facilitator: "Dev Fac",
    },
    eventOfficials: [
      {
        role: "SPEAKER",
        name: "Jane Doe",
        email: "jane@example.com",
        bio: "Google Developer Expert",
        expertise: "Android",
        profileUrl: "",
        linkedinUrl: "",
      },
    ],
    faqs: [
      { question: "Is it free?", answer: "Yes, completely free." },
      { question: "Do I need a laptop?", answer: "Yes, bring your own." },
    ],
    rules: [{ rule: "Be on time." }, { rule: "Follow code of conduct." }],
    eventGallery: [],
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: undefined,
  },
  {
    id: "mock-event-upcoming-1",
    title: "GDG Mock Hackathon (DEV)",
    description: "Upcoming event mock for dev testing.",
    bannerImage: null,
    posterImage: null,
    startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    venue: "Lab Block",
    mode: "HYBRID",
    status: "UPCOMING",
    eventType: "HACKATHON",
    maxParticipants: 200,
    registrationStart: new Date().toISOString(),
    registrationEnd: new Date(
      Date.now() + 2 * 24 * 60 * 60 * 1000,
    ).toISOString(),
    isRegistrationOpen: true,
    createdBy: "dev@gdgvitb.in",
    tags: ["Hackathon", "Innovation"],
    keyHighlights: ["Cash prizes", "Mentors", "Networking"],
    eligibilityCriteria: { yearOfGrad: [true, true, true, true], Dept: [] },
    executiveBoard: { organiser: "Dev User", coOrganiser: "", facilitator: "" },
    eventOfficials: [],
    faqs: [],
    rules: [{ rule: "Teams of 2–4 only." }],
    eventGallery: [],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: undefined,
  },
];

// Fields needed by the list/card UI — heavy detail-only fields are excluded.
// This projection keeps each document read small and quota-friendly.
const LIST_FIELDS = [
  "title",
  "description",
  "bannerImage",
  "posterImage",
  "startDate",
  "endDate",
  "venue",
  "mode",
  "status",
  "eventType",
  "maxParticipants",
  "registrationStart",
  "registrationEnd",
  "isRegistrationOpen",
  "tags",
  "keyHighlights",
  "createdAt",
] as const;

export async function GET() {
  // ── Serve from cache if still fresh ─────────────────────
  if (_cachedEvents && Date.now() < _cacheExpiresAt) {
    return NextResponse.json(_cachedEvents, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        "X-Cache": "HIT",
      },
    });
  }

  try {
    // .select() projects only list-view fields — skips fetching faqs, rules,
    // eventGallery, eventOfficials, executiveBoard, eligibilityCriteria, createdBy.
    const snap = await adminDb
      .collection("managed_events")
      .select(...LIST_FIELDS)
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
        // Fields not in projection — return empty defaults
        createdBy: "",
        tags: Array.isArray(d.tags) ? d.tags : [],
        keyHighlights: Array.isArray(d.keyHighlights) ? d.keyHighlights : [],
        eligibilityCriteria: { yearOfGrad: [], Dept: [] },
        executiveBoard: { organiser: "", coOrganiser: "", facilitator: "" },
        eventOfficials: [],
        faqs: [],
        rules: [],
        eventGallery: [],
        createdAt: parseTimestamp(d.createdAt) ?? undefined,
        updatedAt: undefined,
      };
    });

    // Populate cache
    _cachedEvents = events;
    _cacheExpiresAt = Date.now() + CACHE_TTL_MS;

    return NextResponse.json(events, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        "X-Cache": "MISS",
      },
    });
  } catch (err) {
    console.error("Failed to fetch events:", err);
    // If quota is exhausted but we have stale cache, serve it rather than returning an error.
    // Users see slightly old data instead of a broken page.
    if (_cachedEvents) {
      console.warn("Serving stale cache due to Firestore error");
      return NextResponse.json(_cachedEvents, {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
          "X-Cache": "STALE",
        },
      });
    }
    // In development, return mock data so the UI can be tested without Firestore quota.
    if (process.env.NODE_ENV === "development") {
      console.warn("DEV: Firestore unavailable — returning mock event data");
      return NextResponse.json(DEV_MOCK_EVENTS, {
        headers: { "X-Cache": "DEV-MOCK" },
      });
    }
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 },
    );
  }
}
