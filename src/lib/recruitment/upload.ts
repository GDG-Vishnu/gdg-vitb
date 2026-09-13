const PORTAL_ORIGIN = process.env.NEXT_PUBLIC_PORTAL_ORIGIN ?? "";

export interface UploadResult {
  success: true;
  url: string;
  driveFileId: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
}

export async function uploadFile(
  file: File,
  roleId: string,
  fieldName: string,
): Promise<UploadResult> {
  if (!PORTAL_ORIGIN) {
    throw new Error("NEXT_PUBLIC_PORTAL_ORIGIN is not configured");
  }

  const fd = new FormData();
  fd.append("file", file);
  fd.append("roleId", roleId);
  fd.append("fieldName", fieldName);

  const res = await fetch(`${PORTAL_ORIGIN}/api/recruitment/upload`, {
    method: "POST",
    body: fd,
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error ?? "Upload failed");
  return data as UploadResult;
}
