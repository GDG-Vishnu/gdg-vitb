"use client";

import React from "react";

interface LoadingGlobalProps {
  variant?: "page" | "section";
  message?: string;
  name?: string;
}

export default function LoadingGlobal({
  variant = "page",
  message = "",
  name = "GDG Vishnu Institute of Technology",
}: LoadingGlobalProps) {
  if (variant === "section") {
    return (
      <section className="w-full py-10">
        <div className="flex flex-col justify-center items-center h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      </section>
    );
  }

  return (
    <div className="flex items-center justify-center py-20">
      <div className="bg-white border-4 border-black rounded-2xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-yellow-400 mx-auto mb-4"></div>
        <p className="text-black font-extrabold font-productSans text-xl">
          {name}
        </p>
        {message && (
          <p className="text-black font-bold font-productSans text-sm mt-2">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
