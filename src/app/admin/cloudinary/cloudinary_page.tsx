"use client";

import React, { useEffect, useState } from "react";

const cloudName = "GDG_DEV_TEAM";
const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export default function CloudinaryPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setResult(null);
      setError(null);
      setProgress(0);
    }
  };

  const upload = async () => {
    if (!file) return;
    if (!cloudName || !uploadPreset) {
      setError(
        "Missing Cloudinary configuration. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET."
      );
      return;
    }

    setUploading(true);
    setProgress(0);
    setError(null);
    setResult(null);

    try {
      const form = new FormData();
      form.append("file", file);
      form.append("upload_preset", uploadPreset);

      const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;

      const res = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", url);

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            setProgress(Math.round((e.loaded / e.total) * 100));
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              resolve(JSON.parse(xhr.responseText));
            } catch (err) {
              resolve(xhr.responseText);
            }
          } else {
            reject(new Error(xhr.statusText || "Upload failed"));
          }
        };

        xhr.onerror = () => reject(new Error("Network error during upload"));
        xhr.send(form);
      });

      setResult(res);
    } catch (err: any) {
      setError(err?.message ?? String(err));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-6">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900/60 rounded-lg shadow p-6">
        <h1 className="text-2xl font-semibold mb-4">Cloudinary Image Upload</h1>

        {!cloudName || !uploadPreset ? (
          <div className="mb-4 rounded border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-800">
            Cloudinary is not configured. Set
            `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` and
            `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` in your environment to enable
            uploads.
          </div>
        ) : null}

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
            Select Image
          </label>
          <input type="file" accept="image/*" onChange={onFileChange} />
        </div>

        {preview ? (
          <div className="mb-4">
            <div className="text-sm text-slate-600 mb-2">Preview</div>
            <img src={preview} alt="preview" className="max-h-60 rounded" />
          </div>
        ) : null}

        <div className="flex items-center gap-3">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
            onClick={upload}
            disabled={!file || uploading}
          >
            {uploading ? `Uploading (${progress}%)` : "Upload to Cloudinary"}
          </button>

          <button
            className="px-4 py-2 border rounded"
            onClick={() => {
              setFile(null);
              setPreview(null);
              setResult(null);
              setError(null);
              setProgress(0);
            }}
          >
            Reset
          </button>
        </div>

        {uploading ? (
          <div className="w-full bg-slate-100 rounded mt-4 h-3 overflow-hidden">
            <div
              className="bg-blue-500 h-3"
              style={{ width: `${progress}%` }}
            />
          </div>
        ) : null}

        {error ? (
          <div className="mt-4 text-sm text-red-700 bg-red-50 p-3 rounded">
            {error}
          </div>
        ) : null}

        {result ? (
          <div className="mt-4 p-3 rounded border bg-slate-50">
            <div className="text-sm text-slate-700 mb-2">Upload Result</div>
            <div className="flex items-center gap-4">
              {result.secure_url ? (
                <img
                  src={result.secure_url}
                  alt="uploaded"
                  className="w-28 h-28 object-cover rounded"
                />
              ) : null}
              <div className="text-sm break-all">
                <div>
                  <strong>public_id:</strong> {String(result.public_id ?? "-")}
                </div>
                <div className="mt-1">
                  <strong>url:</strong>{" "}
                  <a
                    className="text-blue-600 underline"
                    href={result.secure_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {result.secure_url}
                  </a>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
