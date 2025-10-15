"use client";

import React, { useCallback, useState } from "react";
import Dropzone from "@/components/cloudinary/Dropzone";
import { toastNotifications, showCustomToast } from "@/components/toast";

type UploadResult = {
  public_id?: string;
  secure_url?: string;
  original_filename?: string;
};

export default function CloudinaryPage() {
  const [uploading, setUploading] = useState(false);
  // Default cloud name as requested
  const [cloudName] = useState<string>("GDG-TEST");
  // Prefer environment variable NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET for unsigned preset
  const [uploadPreset] = useState<string>(
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "GDG_UNSIGNED"
  );
  const [folder, setFolder] = useState("");
  const [results, setResults] = useState<UploadResult[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});

  const uploadToCloudinary = useCallback(
    (file: File, onProgress?: (p: number) => void): Promise<UploadResult> => {
      return new Promise((resolve, reject) => {
        if (!cloudName || !uploadPreset) {
          return reject(new Error("Cloud name or upload preset not provided"));
        }

        const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
        const form = new FormData();
        form.append("file", file);
        form.append("upload_preset", uploadPreset);
        if (folder) form.append("folder", folder);

        const xhr = new XMLHttpRequest();
        xhr.open("POST", url);

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable && onProgress) {
            const percent = Math.round((e.loaded / e.total) * 100);
            onProgress(percent);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const json = JSON.parse(xhr.responseText);
              resolve(json);
            } catch (err) {
              reject(err);
            }
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        };

        xhr.onerror = () => reject(new Error("Network error during upload"));

        xhr.send(form);
      });
    },
    [cloudName, uploadPreset, folder]
  );

  const handleUpload = useCallback(
    async (files: File[]) => {
      if (!cloudName || !uploadPreset) {
        showCustomToast(
          "error",
          "Missing Cloudinary settings",
          "Provide cloud name and upload preset first"
        );
        return;
      }
      setUploading(true);
      const uploaded: UploadResult[] = [];
      for (const file of files) {
        try {
          // update per-file progress during upload
          const res = await uploadToCloudinary(file, (p) => {
            setProgressMap((prev) => ({ ...prev, [file.name]: p }));
          });
          uploaded.push({
            public_id: res.public_id,
            secure_url: res.secure_url,
            original_filename: res.original_filename || file.name,
          });
          // mark complete
          setProgressMap((prev) => ({ ...prev, [file.name]: 100 }));
          showCustomToast(
            "success",
            "Uploaded",
            (res.original_filename || file.name) as string
          );
        } catch (err: any) {
          console.error("Upload error", err);
          showCustomToast(
            "error",
            "Upload failed",
            err?.message || "Upload failed"
          );
        }
      }
      setResults((prev) => [...uploaded, ...prev]);
      setUploading(false);
    },
    [cloudName, uploadPreset, uploadToCloudinary]
  );

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <div className="max-w-6xl mx-auto p-6">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Cloudinary Upload Portal</h1>
            <p className="text-sm text-muted-foreground">
              Drop images anywhere on this page to upload them to Cloudinary.
            </p>
          </div>
          <div className="flex gap-3 items-center">
            <div className="text-sm text-muted-foreground">
              Using unsigned uploads. Cloud name:{" "}
              <span className="font-medium">{cloudName}</span>, Upload preset:{" "}
              <span className="font-medium">{uploadPreset}</span>
            </div>
            <div className="ml-4 text-sm text-muted-foreground">
              {uploading ? "Uploading..." : "Ready"}
            </div>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            The upload preset is read from{" "}
            <code>NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET</code> if set, otherwise
            the built-in fallback preset <code>GDG_UNSIGNED</code> is used. For
            production, a signed upload flow is recommended.
          </div>
        </header>

        {/* Full-page dropzone */}
        <div className="h-[70vh]">
          <Dropzone onUpload={handleUpload} />
        </div>

        {/* Upload results */}
        <section className="mt-8">
          <h2 className="text-xl font-medium mb-4">Uploaded</h2>
          <div className="space-y-4">
            {results.length === 0 ? (
              <p className="text-muted-foreground">No uploads yet.</p>
            ) : null}

            {/* In-progress uploads from progressMap */}
            {Object.keys(progressMap).length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">Uploading</h3>
                <div className="space-y-2">
                  {Object.entries(progressMap).map(([name, p]) => (
                    <div
                      key={name}
                      className="p-2 border border-border rounded bg-card"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm truncate">{name}</div>
                        <div className="text-xs text-muted-foreground">
                          {p}%
                        </div>
                      </div>
                      <div className="w-full bg-muted h-2 rounded overflow-hidden">
                        <div
                          className="h-2 bg-primary"
                          style={{ width: `${p}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Completed uploads gallery */}
            {results.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">Uploaded</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {results.map((r, i) => (
                    <div
                      key={i}
                      className="border border-border rounded overflow-hidden bg-card"
                    >
                      {r.secure_url ? (
                        <img
                          src={r.secure_url}
                          alt={r.original_filename}
                          className="w-full h-40 object-cover"
                        />
                      ) : null}
                      <div className="p-2 text-sm">{r.original_filename}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
