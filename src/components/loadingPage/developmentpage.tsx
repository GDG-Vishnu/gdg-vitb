"use client";
import React from "react";
export default function DevelopmentPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-white to-rose-50 p-6">
      <main className="max-w-4xl w-full mx-auto rounded-2xl bg-white/80 backdrop-blur-md shadow-xl border border-gray-200 overflow-hidden transition-transform transform hover:scale-[1.01]">
        <div className="px-6 py-12 md:py-20 lg:py-28 text-center">
          <div className="mx-auto w-40 h-40 md:w-48 md:h-48 rounded-full bg-gradient-to-tr from-emerald-400 to-sky-500 flex items-center justify-center shadow-lg mb-6 animate-float">
            {/* Simple rocket SVG with subtle bounce */}
            <svg
              className="w-24 h-24 text-white drop-shadow-lg animate-bounce-slow"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2c1.1 0 2 .9 2 2v3l3 3-3 3v6c0 1.1-.9 2-2 2s-2-.9-2-2v-6l-3-3 3-3V4c0-1.1.9-2 2-2z"
                fill="currentColor"
              />
            </svg>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-stone-900 mb-3 opacity-0 animate-fade-in-up">
            Under Development
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-stone-600 max-w-2xl mx-auto mb-6 opacity-0 animate-fade-in-up delay-100">
            We are working hard to bring you something amazing. 
          </p>

          <div className="flex items-center justify-center gap-4 mt-4 opacity-0 animate-fade-in-up delay-200">
            <button className="px-5 py-2 rounded-full bg-emerald-600 text-white font-medium shadow hover:bg-emerald-700 transition-colors">
              Notify Me
            </button>
            <button className="px-5 py-2 rounded-full bg-transparent border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors">
              Explore Docs
            </button>
          </div>

          {/* subtle decorative dots */}
          <div className="mt-10 flex items-center justify-center gap-3">
            <span className="w-3 h-3 bg-amber-400 rounded-full animate-pulse delay-200" />
            <span className="w-3 h-3 bg-sky-400 rounded-full animate-pulse delay-300" />
            <span className="w-3 h-3 bg-rose-400 rounded-full animate-pulse delay-400" />
          </div>
        </div>
      </main>

      <style jsx>{`
        .animate-fade-in-up {
          animation: fadeInUp 700ms ease forwards;
        }
        .delay-100 {
          animation-delay: 120ms;
        }
        .delay-200 {
          animation-delay: 240ms;
        }
        .animate-bounce-slow {
          animation: bounce 1.6s infinite;
        }
        .animate-float {
          animation: floaty 6s ease-in-out infinite;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes floaty {
          0% {
            transform: translateY(0) rotate(-2deg);
          }
          50% {
            transform: translateY(-6px) rotate(2deg);
          }
          100% {
            transform: translateY(0) rotate(-2deg);
          }
        }
        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
      `}</style>
    </div>
  );
}
