"use client";
import { Users } from "lucide-react";
import { SOCIAL_LINKS } from "@/constants";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

export function SocialLinks() {
  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-2xl p-6 text-white shadow-xl border border-gray-700 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-l from-blue-500/10 to-purple-500/10 rounded-full blur-2xl" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-5 h-5 text-blue-400" />
          <h3 className="font-bold text-lg text-white font-productSans">
            Follow Us
          </h3>
        </div>
        <p className="text-gray-300 text-sm mb-6 leading-relaxed font-productSans">
          Stay connected with us on social media for the latest updates, events,
          and tech discussions.
        </p>
      </div>

      {/* First Row - Instagram and LinkedIn */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Instagram */}
        <a
          href={SOCIAL_LINKS.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative p-4 hover:bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-105 flex flex-col items-center gap-2 border border-white/10"
          aria-label="Follow us on Instagram"
        >
          <div className="text-white group-hover:scale-110 transition-transform duration-200">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-white group-hover:text-white transition-colors font-productSans">
            Instagram
          </span>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
        </a>

        {/* LinkedIn */}
        <a
          href={SOCIAL_LINKS.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative p-4 hover:bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-105 flex flex-col items-center gap-2 border border-white/10"
          aria-label="Follow us on LinkedIn"
        >
          <div className="text-white group-hover:scale-110 transition-transform duration-200">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-white group-hover:text-white transition-colors font-productSans">
            LinkedIn
          </span>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
        </a>
      </div>

      {/* Second Row - Join Our Community */}
      <div className="relative">
        <a
          href={SOCIAL_LINKS.community}
          className="group relative p-6 hover:bg-gradient-to-br from-emerald-500 via-blue-600 to-purple-600 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]  flex flex-col items-center gap-3 border-2 border-white/20 overflow-hidden  w-full text-center"
          aria-label="Learn more about our community"
        >
          {/* Background pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent" />

          <div className="text-white group-hover:scale-110 transition-transform duration-200">
            <Users className="w-8 h-8" />
          </div>

          <div className="text-center relative z-10">
            <h3 className="text-xl font-bold text-white group-hover:text-yellow-200 transition-colors font-productSans">
              Join Our Community
            </h3>
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 hover:bg-gradient-to-br from-emerald-400 via-blue-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
        </a>
      </div>
    </div>
  );
}
