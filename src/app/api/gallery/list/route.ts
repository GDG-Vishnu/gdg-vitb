import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export const revalidate = 60;

const CACHE_TTL_MS = 5 * 60 * 1000;
let _cached: { id: number; imageUrl: string; uploadedAt: string }[] | null =
  null;
let _expiresAt = 0;
let _inflight: Promise<
  { id: number; imageUrl: string; uploadedAt: string }[]
> | null = null;

// Fallback mirrors the seeded gallery data so the page still renders when
// Firestore/Admin env is unavailable (e.g. local dev without credentials).
const FALLBACK = [
  { id: 1, imageUrl: "https://res.cloudinary.com/dlupkibvq/image/upload/v1771301326/ctv8yn9y6xaczodyjo0c.jpg", uploadedAt: "2025-12-31" },
  { id: 2, imageUrl: "https://res.cloudinary.com/dlupkibvq/image/upload/v1767086900/prompt%20engineering/tk3aakahjoxsimjvidgm.jpg", uploadedAt: "2025-12-31" },
  { id: 3, imageUrl: "https://res.cloudinary.com/dlupkibvq/image/upload/v1765644013/mggyknteqkhgkb2w3grz.jpg", uploadedAt: "2025-12-31" },
  { id: 4, imageUrl: "https://res.cloudinary.com/dlupkibvq/image/upload/v1767165297/nnpeqla0vy1pm2ftqt7r.jpg", uploadedAt: "2025-12-31" },
  { id: 5, imageUrl: "https://res.cloudinary.com/dlupkibvq/image/upload/v1771301326/gzruxxa5nyohbu9e1s7i.jpg", uploadedAt: "2025-12-31" },
  { id: 6, imageUrl: "https://res.cloudinary.com/dlupkibvq/image/upload/v1771301325/bdkiturqrivu4rmzkmnl.jpg", uploadedAt: "2025-12-31" },
  { id: 7, imageUrl: "https://res.cloudinary.com/dlupkibvq/image/upload/v1767170501/joat26rbj3rb0kdja0ue.jpg", uploadedAt: "2025-12-31" },
  { id: 8, imageUrl: "https://res.cloudinary.com/dlupkibvq/image/upload/v1767170551/sghz2b8xtbolh90rj6ye.jpg", uploadedAt: "2025-12-31" },
  { id: 9, imageUrl: "https://res.cloudinary.com/dlupkibvq/image/upload/v1766732847/uumcqlo3robkw70z9rhk.jpg", uploadedAt: "2025-12-31" },
  { id: 10, imageUrl: "https://res.cloudinary.com/dlupkibvq/image/upload/v1766732840/igrrs1fp9ag45hqzz64r.jpg", uploadedAt: "2025-12-31" },
  { id: 11, imageUrl: "https://res.cloudinary.com/dlupkibvq/image/upload/v1767175612/jxsg0t4bozchigoqodga.png", uploadedAt: "2025-12-31" },
  { id: 12, imageUrl: "https://res.cloudinary.com/dlupkibvq/image/upload/v1767175818/nrei8nrsar4iio30ukkh.jpg", uploadedAt: "2025-12-31" },
];

export async function GET() {
  if (_cached && Date.now() < _expiresAt) {
    return NextResponse.json(_cached, {
      headers: {
        "Cache-Control":
          "public, max-age=60, s-maxage=60, stale-while-revalidate=300",
        "X-Cache": "HIT",
      },
    });
  }

  try {
    if (!_inflight) {
      _inflight = (async () => {
        const snap = await adminDb
          .collection("gallery")
          .orderBy("order", "asc")
          .get();
        const items = snap.docs
          .filter((d) => d.id !== "__cover__" && d.data()?.imageUrl)
          .map((d, i) => {
            const data = d.data();
            const num = Number(d.id);
            return {
              id: Number.isNaN(num) ? i + 1 : num,
              imageUrl: String(data.imageUrl).trim(),
              uploadedAt: String(data.uploadedAt ?? ""),
            };
          });
        _cached = items;
        _expiresAt = Date.now() + CACHE_TTL_MS;
        return items;
      })().finally(() => {
        _inflight = null;
      });
    }
    const items = await _inflight;
    return NextResponse.json(items, {
      headers: {
        "Cache-Control":
          "public, max-age=60, s-maxage=60, stale-while-revalidate=300",
        "X-Cache": "MISS",
      },
    });
  } catch (err) {
    console.error("Failed to fetch gallery:", err);
    if (_cached) {
      return NextResponse.json(_cached, {
        headers: { "X-Cache": "STALE" },
      });
    }
    if (process.env.NODE_ENV === "development") {
      return NextResponse.json(FALLBACK, {
        headers: { "X-Cache": "DEV-FALLBACK" },
      });
    }
    return NextResponse.json(
      { error: "Failed to fetch gallery" },
      { status: 500 },
    );
  }
}
