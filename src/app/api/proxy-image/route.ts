import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/proxy-image?url=<encoded-image-url>
 *
 * Fetches an external image server-side (bypassing browser CORS restrictions)
 * and streams it back to the client. Used by the profile-share download flow
 * so that html-to-image can embed external profile photos (e.g. Google OAuth
 * images) without hitting CORS errors.
 */
export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "Missing url parameter" },
      { status: 400 },
    );
  }

  // Basic sanity check — only allow http/https URLs
  if (!/^https?:\/\//i.test(url)) {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  try {
    const upstream = await fetch(url, {
      headers: { "User-Agent": "GDG-VITB/1.0" },
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { error: "Failed to fetch upstream image" },
        { status: 502 },
      );
    }

    const buffer = await upstream.arrayBuffer();
    const contentType = upstream.headers.get("content-type") || "image/jpeg";

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch {
    return NextResponse.json({ error: "Proxy fetch failed" }, { status: 500 });
  }
}
