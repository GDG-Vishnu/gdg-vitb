"use client";

import React, { useCallback, useRef, useState } from "react";
import { X } from "lucide-react";

type DropzoneProps = {
  onFilesAdded?: (files: File[]) => void;
  onUpload?: (files: File[]) => Promise<void>;
  accept?: string;
  multiple?: boolean;
};

export default function Dropzone({
  onFilesAdded,
  onUpload,
  accept = "image/*",
  multiple = true,
}: DropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const addFiles = useCallback(
    (incoming: FileList | null) => {
      if (!incoming) return;
      const list = Array.from(incoming);
      setFiles((prev) => {
        const next = multiple ? [...prev, ...list] : list.slice(0, 1);
        onFilesAdded?.(next);
        return next;
      });
    },
    [multiple, onFilesAdded]
  );

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      addFiles(e.dataTransfer.files);
      // auto upload if handler provided
      if (onUpload) {
        const fileArray = Array.from(e.dataTransfer.files);
        onUpload(fileArray).catch(() => {
          /* upload errors should be handled by caller */
        });
      }
    },
    [addFiles, onUpload]
  );

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const openFileDialog = () => inputRef.current?.click();

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(e.target.files);
    if (onUpload && e.target.files) {
      onUpload(Array.from(e.target.files)).catch(() => {});
    }
  };

  return (
    <div className="min-h-screen w-full bg-background flex flex-col">
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragEnter={onDragOver}
        onDragLeave={onDragLeave}
        onClick={openFileDialog}
        className={`flex-1 flex flex-col items-center justify-center border-2 rounded-md mx-6 my-6 p-6 transition-colors duration-150 cursor-pointer select-none 
          ${
            isDragging
              ? "border-dashed border-blue-400 bg-blue-50/20"
              : "border-dashed border-border bg-transparent"
          }`}
        role="button"
        aria-label="Drop files here"
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={handleInput}
          accept={accept}
          multiple={multiple}
        />

        <div className="text-center max-w-2xl">
          <h2 className="text-2xl font-semibold mb-2">
            Drop images here to upload
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Click or drop image files anywhere on this page to add them.
            Supported formats: JPG, PNG, GIF, WebP. Files will start uploading
            automatically if an upload handler is provided, or press the Upload
            button below.
          </p>

          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={openFileDialog}
              className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-primary-foreground"
            >
              Choose files
            </button>
          </div>
        </div>

        {/* Preview strip */}
        <div className="w-full mt-8">
          {files.length === 0 ? null : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {files.map((file, idx) => (
                <div
                  key={idx}
                  className="relative rounded-md overflow-hidden border border-border bg-card"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="object-cover w-full h-40"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(idx);
                    }}
                    className="absolute top-1 right-1 p-1 rounded-full bg-white/80 hover:bg-white"
                    aria-label="Remove file"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <div className="p-2 text-xs text-muted-foreground truncate">
                    {file.name}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upload action if consumer wants manual upload */}
        {onUpload && files.length > 0 && (
          <div className="mt-6">
            <button
              onClick={() => onUpload(files).catch(() => {})}
              className="px-5 py-2 rounded-md bg-accent text-accent-foreground"
            >
              Upload {files.length} file{files.length > 1 ? "s" : ""}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
