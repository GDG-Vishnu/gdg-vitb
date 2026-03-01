import { NextRequest, NextResponse } from "next/server";

// ─── Cloudinary Upload API ──────────────────────────────────
// Accepts a multipart form with a single "file" field.
// Uploads it to Cloudinary under the "gdg-vitb/profiles" folder
// and returns the secure URL.

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME!;
const API_KEY = process.env.CLOUDINARY_API_KEY!;
const API_SECRET = process.env.CLOUDINARY_API_SECRET!;

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(req: NextRequest) {
  try {
    // ── Validate env ──────────────────────────────────────
    if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
      return NextResponse.json(
        { error: "Cloudinary is not configured on the server." },
        { status: 500 },
      );
    }

    // ── Parse multipart form ──────────────────────────────
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    // ── Validate file ─────────────────────────────────────
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, WebP, and GIF images are allowed." },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size must be under 5 MB." },
        { status: 400 },
      );
    }

    // ── Build Cloudinary upload request ───────────────────
    const timestamp = Math.floor(Date.now() / 1000);
    const paramsToSign = `folder=gdg-vitb/profiles&timestamp=${timestamp}`;

    // Generate SHA-1 signature
    const encoder = new TextEncoder();
    const data = encoder.encode(paramsToSign + API_SECRET);
    const hashBuffer = await crypto.subtle.digest("SHA-1", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const signature = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    const uploadForm = new FormData();
    uploadForm.append("file", file);
    uploadForm.append("api_key", API_KEY);
    uploadForm.append("timestamp", String(timestamp));
    uploadForm.append("signature", signature);
    uploadForm.append("folder", "gdg-vitb/profiles");

    // ── Upload to Cloudinary ──────────────────────────────
    const cloudinaryRes = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: "POST", body: uploadForm },
    );

    if (!cloudinaryRes.ok) {
      const err = await cloudinaryRes.json().catch(() => ({}));
      console.error("[Upload] Cloudinary error:", err);
      return NextResponse.json(
        { error: "Upload failed. Please try again." },
        { status: 502 },
      );
    }

    const result = await cloudinaryRes.json();

    return NextResponse.json({
      url: result.secure_url as string,
    });
  } catch (err) {
    console.error("[Upload] unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
