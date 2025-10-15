"use client";

import React from "react";
import { Loader2, Trash2 } from "lucide-react";
import { SparkleDoodle, CurvedDoodle } from "@/components/ui/doodles";

interface FormDeletionLoadingProps {
  formName?: string;
}

export function FormDeletionLoading({
  formName = "form",
}: FormDeletionLoadingProps) {
  return (
    <div className="fixed inset-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center">
      <div className="relative bg-white dark:bg-black rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 p-8 max-w-sm w-full mx-4 overflow-hidden">
        {/* Background Doodles */}

        {/* Content */}
        <div className="relative z-10 text-center space-y-6">
          {/* GDG Themed Icon */}
          <div className="flex justify-center">
            <div
              className="w-16 h-16 rounded-full p-0.5 flex items-center justify-center"
              style={{
                background: `conic-gradient(
                  #EA4335 0deg 90deg,
                  #4285F4 90deg 180deg,
                  #FBBC04 180deg 270deg,
                  #34A853 270deg 360deg
                )`,
              }}
            >
              <div className="w-full h-full rounded-full bg-white dark:bg-black flex items-center justify-center">
                <div className="relative">
                  <Trash2 className="h-6 w-6 text-red-500" />
                  <Loader2
                    className="absolute -top-1 -right-1 h-4 w-4 text-orange-500"
                    style={{ animation: "spin 0.8s linear infinite" }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Loading Text */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white animate-pulse">
              Deleting Form
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Removing{" "}
              <span className="font-medium text-red-600">{formName}</span>{" "}
              permanently...
            </p>
          </div>

          {/* Animated Progress Bar */}
          {/* <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(90deg, 
                  #EA4335 0%, 
                  #4285F4 25%, 
                  #FBBC04 50%, 
                  #34A853 75%, 
                  #EA4335 100%
                )`,
                width: "75%",
                animation: "form-deletion-progress 0.9s ease-in-out infinite",
              }}
            />
          </div> */}
        </div>

        {/* Custom Animation Styles */}
        <style jsx>{`
          @keyframes form-deletion-progress {
            0% {
              width: 20%;
            }
            25% {
              width: 60%;
            }
            50% {
              width: 85%;
            }
            75% {
              width: 70%;
            }
            100% {
              width: 40%;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
