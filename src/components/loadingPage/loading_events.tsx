"use client";

import React from "react";

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

  return (
    <div className="flex items-center justify-center py-20">
      <div className="bg-white border-4 border-black rounded-2xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-yellow-400 mx-auto mb-4"></div>
        <p className="text-black font-bold font-productSans text-lg">
          {message}
        </p>
      </div>
    </div>
  );
}
