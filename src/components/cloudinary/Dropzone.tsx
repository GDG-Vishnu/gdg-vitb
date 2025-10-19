"use client";

import React, { useCallback, useRef, useState, useEffect } from "react";
import { X, Check, AlertCircle } from "lucide-react";

type CloudinaryDropzoneProps = {
  cloudName?: string;
  uploadPreset: string;
  onUploadComplete?: (urls: string[]) => void;
  accept?: string;
  multiple?: boolean;
};

type FileStatus = {
  file: File;
  status: "pending" | "uploading" | "success" | "error";
  url?: string;
  error?: string;
  progress?: number;
};

export default function CloudinaryDropzone({
  cloudName = "dlupkibvq",
  uploadPreset = "GDG_DEV",
  onUploadComplete,
  accept = "image/*",
  multiple = true,
}: CloudinaryDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileStatuses, setFileStatuses] = useState<FileStatus[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const objectUrlsRef = useRef<string[]>([]);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  const uploadToCloudinary = async (file: File, index: number) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      setFileStatuses(prev => {
        const updated = [...prev];
        updated[index] = { ...updated[index], status: "uploading", progress: 0 };
        return updated;
      });

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      const imageUrl = data.secure_url;

      setFileStatuses(prev => {
        const updated = [...prev];
        updated[index] = { 
          ...updated[index], 
          status: "success", 
          url: imageUrl,
          progress: 100 
        };
        return updated;
      });

      return imageUrl;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Upload failed";
      setFileStatuses(prev => {
        const updated = [...prev];
        updated[index] = { 
          ...updated[index], 
          status: "error", 
          error: errorMessage 
        };
        return updated;
      });
      throw error;
    }
  };

  const addFiles = useCallback(
    async (incoming: FileList | null) => {
      if (!incoming) return;
      const list = Array.from(incoming);
      
      const newStatuses: FileStatus[] = list.map(file => ({
        file,
        status: "pending",
      }));

      setFileStatuses(prev => 
        multiple ? [...prev, ...newStatuses] : newStatuses
      );

      // Auto-upload files
      const startIndex = multiple ? fileStatuses.length : 0;
      const uploadPromises = list.map((file, idx) => 
        uploadToCloudinary(file, startIndex + idx)
      );

      try {
        const urls = await Promise.all(uploadPromises);
        onUploadComplete?.(urls.filter(Boolean));
      } catch (error) {
        console.error("Some uploads failed:", error);
      }
    },
    [multiple, fileStatuses.length, cloudName, uploadPreset, onUploadComplete]
  );

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const openFileDialog = () => inputRef.current?.click();

  const removeFile = (index: number) => {
    setFileStatuses(prev => {
      if (objectUrlsRef.current[index]) {
        URL.revokeObjectURL(objectUrlsRef.current[index]);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(e.target.files);
  };

  const createObjectUrl = (file: File, index: number) => {
    const url = URL.createObjectURL(file);
    objectUrlsRef.current[index] = url;
    return url;
  };

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const copyUrl = (url: string, index: number) => {
    navigator.clipboard.writeText(url);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getSuccessfulUrls = () => {
    return fileStatuses
      .filter(fs => fs.status === "success" && fs.url)
      .map(fs => fs.url!);
  };

  const copyAllUrls = () => {
    const urls = getSuccessfulUrls();
    navigator.clipboard.writeText(urls.join('\n'));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen flex flex-col p-6">
      <div className="max-w-4xl mx-auto w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Cloudinary Image Uploader
          </h1>
          <p className="text-gray-600">
            Upload images directly to Cloudinary • Cloud: <span className="font-mono text-sm bg-gray-200 px-2 py-1 rounded">duvr3z2z0</span>
          </p>
        </div>

        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragEnter={onDragOver}
          onDragLeave={onDragLeave}
          className={`flex flex-col items-center justify-center border-2 rounded-lg p-12 transition-all duration-150 select-none mb-6
            ${
              isDragging
                ? "border-dashed border-blue-500 bg-blue-50"
                : "border-dashed border-gray-300 bg-white hover:border-gray-400"
            }`}
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={handleInput}
            accept={accept}
            multiple={multiple}
          />

          <div className="text-center">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-gray-900">
              Drop images here to upload
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Drag and drop or click to select files • Uploads automatically to Cloudinary
            </p>

            <button
              type="button"
              onClick={openFileDialog}
              className="inline-flex items-center px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium"
            >
              Choose Files
            </button>
          </div>
        </div>

        {/* File List with Status */}
        {fileStatuses.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Uploads ({fileStatuses.filter(f => f.status === "success").length}/{fileStatuses.length})
            </h3>
            
            {fileStatuses.map((fileStatus, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-4"
              >
                <div className="flex-shrink-0">
                  <img
                    src={createObjectUrl(fileStatus.file, idx)}
                    alt={fileStatus.file.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {fileStatus.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(fileStatus.file.size / 1024).toFixed(1)} KB
                  </p>

                  {fileStatus.status === "success" && fileStatus.url && (
                    <div className="mt-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={fileStatus.url}
                          readOnly
                          className="text-xs bg-gray-50 border border-gray-200 rounded px-2 py-1 flex-1 font-mono"
                          onClick={(e) => e.currentTarget.select()}
                        />
                        <button
                          onClick={() => copyUrl(fileStatus.url!, idx)}
                          className={`text-xs px-3 py-1 rounded transition-colors ${
                            copiedIndex === idx
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 hover:bg-gray-200"
                          }`}
                        >
                          {copiedIndex === idx ? (
                            <span className="flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              Copied
                            </span>
                          ) : (
                            "Copy"
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {fileStatus.status === "error" && (
                    <p className="text-xs text-red-600 mt-1">
                      {fileStatus.error}
                    </p>
                  )}
                </div>

                <div className="flex-shrink-0">
                  {fileStatus.status === "pending" && (
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    </div>
                  )}
                  {fileStatus.status === "uploading" && (
                    <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></div>
                  )}
                  {fileStatus.status === "success" && (
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="w-5 h-5 text-green-600" />
                    </div>
                  )}
                  {fileStatus.status === "error" && (
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    </div>
                  )}
                </div>

                <button
                  onClick={() => removeFile(idx)}
                  className="flex-shrink-0 p-1 rounded hover:bg-gray-100 transition-colors"
                  aria-label="Remove file"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            ))}

            {getSuccessfulUrls().length > 0 && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-600" />
                    <p className="text-sm font-medium text-green-900">
                      {getSuccessfulUrls().length} file(s) uploaded successfully
                    </p>
                  </div>
                  <button
                    onClick={copyAllUrls}
                    className={`text-sm px-4 py-2 rounded font-medium transition-colors ${
                      copiedAll
                        ? "bg-green-600 text-white"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                  >
                    {copiedAll ? (
                      <span className="flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        Copied All URLs!
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy All URLs
                      </span>
                    )}
                  </button>
                </div>
                
                <div className="bg-white border border-green-200 rounded p-3">
                  <p className="text-xs text-gray-600 mb-2 font-medium">All Uploaded URLs:</p>
                  <textarea
                    value={getSuccessfulUrls().join('\n')}
                    readOnly
                    onClick={(e) => e.currentTarget.select()}
                    className="w-full text-xs font-mono bg-gray-50 border border-gray-200 rounded p-2 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows={Math.min(getSuccessfulUrls().length, 5)}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}