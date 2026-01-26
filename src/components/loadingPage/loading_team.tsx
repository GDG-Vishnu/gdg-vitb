"use client";

import React from "react";

interface LoadingTeamProps {
  variant?: "page" | "section";
  message?: string;
}

export default function LoadingTeam({
  variant = "section",
  message = "Loading team Data...",
}: LoadingTeamProps) {
  if (variant === "section") {
    return (
      <section className="w-full py-6">
        <div className="flex justify-center items-center h-[200px]">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      </section>
    );
  }

  return (
    <div className="flex items-center justify-center py-8">
      <div className="bg-white border-4 border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-yellow-400 mx-auto mb-3"></div>
        <p className="text-black font-bold font-productSans text-md">
          {message}
        </p>
      </div>
    </div>
  );
}
