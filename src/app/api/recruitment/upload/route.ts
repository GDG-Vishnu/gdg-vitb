import { NextRequest, NextResponse } from "next/server";

const APPS_SCRIPT_UPLOAD_URL = "https://script.google.com/macros/s/AKfycbwlUwNM7XWO2gaK7uXTzmfVvpPsR1zS99Ukh2Ixg7a372SYZfZZfdCiZJkJwBwlqD2p6w/exec";
const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4 MB
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folderId = formData.get("folderId") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    if (!folderId) {
      return NextResponse.json({ error: "No folderId provided." }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file format. Only PDF and Word documents are allowed." },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size must be under 4 MB." },
        { status: 400 },
      );
    }

    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");

    // Forward to Google Apps Script
    const response = await fetch(APPS_SCRIPT_UPLOAD_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "upload",
        fileName: file.name,
        mimeType: file.type,
        base64,
        folderId,
      }),
      redirect: "follow",
    });

    const data = await response.json();

    if (data.error) {
      return NextResponse.json({ error: data.error }, { status: 400 });
    }

    return NextResponse.json({
      fileUrl: data.fileUrl,
      fileId: data.fileId,
      fileName: data.fileName,
    });
  } catch (err) {
    console.error("[Recruitment Upload] error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
