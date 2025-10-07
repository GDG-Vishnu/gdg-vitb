"use client";

import React from "react";
import { Loader2, Trash2 } from "lucide-react";
import { SparkleDoodle, CurvedDoodle } from "@/components/ui/doodles";

interface DeleteComponentLoadingProps {
  componentName?: string;
}

export function DeleteComponentLoading({
  componentName = "form component",
}: DeleteComponentLoadingProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center">
      <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-2xl border p-8 max-w-sm w-full mx-4 overflow-hidden">
        {/* Background Doodles */}
    

        {/* Content */}
        <div className="relative z-10 text-center space-y-6">
          {/* GDG Themed Icon */}
          <div className="flex justify-center">
            <div
              className="w-16 h-16 rounded-full p-0.5 flex items-center justify-center"
              style={{
                background: `conic-gradient(
                  #4285F4 0deg 90deg,
                  #EA4335 90deg 180deg,
                  #FBBC04 180deg 270deg,
                  #34A853 270deg 360deg
                )`,
              }}
            >
              <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                <div className="relative">
                  <Trash2 className="h-6 w-6 text-red-500" />
                  <Loader2
                    className="absolute -top-1 -right-1 h-4 w-4 text-blue-500"
                    style={{ animation: "spin 1s linear infinite" }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Loading Text */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white animate-pulse">
              Deleting Component
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Removing{" "}
              <span className="font-medium text-red-600">{componentName}</span>{" "}
              from your form...
            </p>
          </div>

          {/* Animated Progress Bar */}
        
        </div>

        {/* Custom Animation Styles */}
        <style jsx>{`
          @keyframes loading-progress {
            0% {
              width: 30%;
            }
            25% {
              width: 60%;
            }
            50% {
              width: 90%;
            }
            75% {
              width: 70%;
            }
            100% {
              width: 50%;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
