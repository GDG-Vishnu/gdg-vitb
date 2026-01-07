"use client";

import React from "react";
import { Spinner, SpinnerProps } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

interface LoadingProps extends SpinnerProps {
  /**
   * Whether to show as a full page overlay
   * @default false
   */
  overlay?: boolean;
  /**
   * Custom loading text
   * @default "Loading..."
   */
  text?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Whether to use a black overlay instead of a blurred background
   * @default false
   */
  blackOverlay?: boolean;
}

export function Loading({
  overlay = false,
  text = "",
  className,
  size = "md",
  messagePlacement = "bottom",
  blackOverlay = false,
  ...props
}: LoadingProps) {
  if (overlay) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm"
        style={{
          backgroundImage: `linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      >
        <Spinner
          message={text}
          size={size}
          messagePlacement={messagePlacement}
          className={className}
          {...props}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center w-full h-full",
        blackOverlay && "bg-black/10",
        className
      )}
    >
      <Spinner
        message={text}
        size={size}
        messagePlacement={messagePlacement}
        {...props}
      />
    </div>
  );
}

// Inline spinner for buttons and small spaces
export function InlineSpinner({
  size = "sm",
  className,
  ...props
}: Omit<SpinnerProps, "message" | "messagePlacement"> & {
  className?: string;
}) {
  return (
    <Spinner size={size} className={cn("inline-flex", className)} {...props} />
  );
}
