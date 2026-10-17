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
        // Departments/positions are small, rarely-changing lookup tables —
        // joined here server-side so the public contract below (flat
        // position/designation/rank/dept_rank/dept_logo/bgColor fields)
        // never has to change even though the source schema is normalized.
        const [memberSnap, deptSnap, posSnap] = await Promise.all([
          adminDb.collection("team_members").orderBy("name", "asc").get(),
          adminDb.collection("departments").get(),
          adminDb.collection("position_levels").get(),
        ]);

        const depts = new Map(deptSnap.docs.map((d) => [d.id, d.data()]));
        const positions = new Map(posSnap.docs.map((d) => [d.id, d.data()]));

        const members = memberSnap.docs.map((doc) => {
          const data = doc.data();
          const dept = depts.get(data.deptId);
          const position = positions.get(data.positionId);
          return {
            id: doc.id,
            imageUrl: data.imageUrl,
            logo: data.logo ?? null,
            name: data.name,
            designation: position?.name ?? null,
            position: dept?.name ?? null,
            linkedinUrl: data.linkedinUrl ?? null,
            mail: data.mail ?? null,
            dept_logo: dept?.logo ?? null,
            bgColor: dept?.bgColor ?? null,
            rank: data.order ?? 0,
            dept_rank: dept?.order ?? 0,
            isAlumni: data.isAlumni ?? false,
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
