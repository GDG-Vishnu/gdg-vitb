"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type TextareaProps = React.ComponentProps<"textarea"> & {
  style?: React.CSSProperties;
};

function Textarea({ className, style, ...props }: TextareaProps) {
  // Only apply style properties if provided. Do not force a default color here
  // so that utility classes like `text-white` can control the textarea text color.
  const mergedStyle: React.CSSProperties = {
    ...(style || {}),
  };

  return (
    <textarea
      data-slot="textarea"
      style={mergedStyle}
      className={cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm text-black dark:text-white",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
