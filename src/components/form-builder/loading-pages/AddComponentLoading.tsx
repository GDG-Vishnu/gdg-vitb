"use client";

import React from "react";
import { Loader2, Plus } from "lucide-react";
import { SparkleDoodle, CurvedDoodle } from "@/components/ui/doodles";

interface AddComponentLoadingProps {
  componentName?: string;
}

export function AddComponentLoading({
  componentName = "form component",
}: AddComponentLoadingProps) {
  return (
    <div className="fixed inset-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center">
      <div className="relative bg-white dark:bg-black rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 p-8 max-w-sm w-full mx-4 overflow-hidden">
        {/* Background Doodles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <SparkleDoodle
            color="#34A853"
            className="absolute w-8 h-8 top-4 right-4 opacity-20"
          />
          <CurvedDoodle
            color="#4285F4"
            className="absolute w-12 h-6 bottom-4 left-4 opacity-15"
          />
          <SparkleDoodle
            color="#FBBC04"
            className="absolute w-6 h-6 top-8 left-8 opacity-25"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center space-y-6">
          {/* GDG Themed Icon */}
          <div className="flex justify-center">
            <div
              className="w-16 h-16 rounded-full p-0.5 flex items-center justify-center"
              style={{
                background: `conic-gradient(
                  #34A853 0deg 90deg,
                  #4285F4 90deg 180deg,
                  #FBBC04 180deg 270deg,
                  #EA4335 270deg 360deg
                )`,
              }}
            >
              <div className="w-full h-full rounded-full bg-white dark:bg-black flex items-center justify-center">
                <div className="relative">
                  <Plus className="h-6 w-6 text-green-500" />
                  <Loader2
                    className="absolute -top-1 -right-1 h-4 w-4 text-blue-500"
                    style={{ animation: "spin 0.8s linear infinite" }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Loading Text */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white animate-pulse">
              Adding Component
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Adding{" "}
              <span className="font-medium text-green-600">
                {componentName}
              </span>{" "}
              to your form...
            </p>
          </div>

          {/* Animated Progress Bar */}
          {/* <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(90deg, 
                  #34A853 0%, 
                  #4285F4 25%, 
                  #FBBC04 50%, 
                  #EA4335 75%, 
                  #34A853 100%
                )`,
                width: "75%",
                animation: "add-progress 0.6s ease-in-out infinite",
              }}
            />
          </div> */}
        </div>

        {/* Custom Animation Styles */}
        <style jsx>{`
          @keyframes add-progress {
            0% {
              width: 40%;
            }
            25% {
              width: 70%;
            }
            50% {
              width: 90%;
            }
            75% {
              width: 80%;
            }
            100% {
              width: 60%;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
