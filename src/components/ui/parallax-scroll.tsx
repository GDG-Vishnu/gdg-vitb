"use client";
import React from "react";

// ParallaxScroll removed — stub to avoid runtime errors if still imported.
export const ParallaxScroll = ({
  images,
  className,
}: {
  images: string[];
  className?: string;
}) => {
  if (typeof window !== "undefined") {
    // eslint-disable-next-line no-console
    console.warn(
      "ParallaxScroll component has been removed. Use a simple grid instead."
    );
  }
  return null;
};
