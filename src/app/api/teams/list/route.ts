import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export const revalidate = 3600; // 1 hour

// ─── In-memory cache (server-side) ──────────────────────────
// Survives across requests in the same Node.js process —
// keeps Firestore reads to ~1 per TTL window instead of 1 per page visit.
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
let _cached: unknown[] | null = null;
let _cacheExpiresAt = 0; // starts expired — forces fresh fetch on first request
let _inflight: Promise<unknown[]> | null = null;

const TEAM_LIST_FIELDS = [
  "imageUrl",
  "logo",
  "name",
  "designation",
  "position",
  "linkedinUrl",
  "mail",
  "dept_logo",
  "bgColor",
  "rank",
  "dept_rank",
] as const;

export async function GET() {
  // ── Serve from cache if still fresh ─────────────────────
  if (_cached && Date.now() < _cacheExpiresAt) {
    return NextResponse.json(_cached, {
      headers: {
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
        "X-Cache": "HIT",
      },
    });
  }

  try {
    if (!_inflight) {
      _inflight = (async () => {
        const snap = await adminDb
          .collection("team_members")
          .select(...TEAM_LIST_FIELDS)
          .orderBy("name", "asc")
          .get();

        const members = snap.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            imageUrl: data.imageUrl,
            logo: data.logo ?? null,
            name: data.name,
            designation: data.designation,
            position: data.position ?? null,
            linkedinUrl: data.linkedinUrl ?? null,
            mail: data.mail ?? null,
            dept_logo: data.dept_logo ?? null,
            bgColor: data.bgColor ?? null,
            rank: data.rank ?? 0,
            dept_rank: data.dept_rank ?? 0,
          };
        });

        // Populate server-side cache
        _cached = members;
        _cacheExpiresAt = Date.now() + CACHE_TTL_MS;
        return members;
      })().finally(() => {
        _inflight = null;
      });
    }

    const members = await _inflight;

    return NextResponse.json(members, {
      headers: {
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
        "X-Cache": "MISS",
      },
    });
  } catch (err) {
    console.error("Failed to fetch team members:", err);
    return NextResponse.json(
      { error: "Failed to fetch team members" },
      { status: 500 },
    );
  }
}
