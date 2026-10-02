"use client";

import React from "react";

interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({
  message = "Loading...",
}: LoadingStateProps) {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="bg-white border-4 border-black rounded-2xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-yellow-400 mx-auto mb-4" />
        <p className="text-black font-bold font-productSans text-lg">
          {message}
        </p>
      </div>
    </div>
  );
}
