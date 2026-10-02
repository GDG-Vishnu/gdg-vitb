"use client";

import React from "react";
import LoadingState from "./LoadingState";

interface LoadingEventsProps {
  variant?: "page" | "section";
  message?: string;
}

export default function LoadingEvents({
  variant = "page",
  message = "Loading Events...",
}: LoadingEventsProps) {
  if (variant === "section") {
    return (
      <section className="w-full py-10">
        <div className="flex justify-center items-center h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      </section>
    );
  }

  return <LoadingState message={message} />;
}
