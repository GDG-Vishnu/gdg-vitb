export interface UploadResult {
  success: true;
  url: string;
  driveFileId: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      // dataUrl format: "data:mime/type;base64,ACTUAL_BASE64"
      const base64 = dataUrl.split(",")[1];
      resolve(base64);
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export async function uploadFile(
  file: File,
  _scriptUrl: string, // Kept for compatibility, but ignored
  _folderId: string, // Kept for compatibility, but ignored
): Promise<UploadResult> {
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzot4ExlbsGRNwJWrag0RzS_YEG5EtcKnusAIp65x7w0PPKFzkz-xT592SLsk11XcwwSw/exec";
  const FOLDER_ID = "1aDm5XSzrbnLRnwOxTEn2F23R6IIkzppr";

  const base64 = await fileToBase64(file);

  const payload = {
    action: "upload",
    fileName: file.name,
    mimeType: file.type || "application/octet-stream",
    base64,
    folderId: FOLDER_ID,
  };

  console.log("[Upload] Starting upload for", file.name, "to folder", FOLDER_ID);

  const res = await fetch(SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
  });

  const text = await res.text().catch(() => null);
  console.log("[Upload] Raw response text:", text);
  console.log("[Upload] Response status:", res.status, res.statusText);

  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    console.error("[Upload] Failed to parse response as JSON:", e);
  }

  if (!res.ok || !data?.ok) {
    console.error("[Upload] Upload failed:", data?.error || `HTTP ${res.status}`);
    throw new Error(data?.error ?? `Upload failed (HTTP ${res.status})`);
  }

  console.log("[Upload] Upload successful:", data);

  return {
    success: true,
    url: data.fileUrl,
    driveFileId: data.fileId,
    originalName: data.fileName,
    mimeType: data.mimeType,
    sizeBytes: data.size,
  };
}
