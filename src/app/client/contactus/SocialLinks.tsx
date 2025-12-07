"use client";

import { motion } from "framer-motion";
import { ExternalLink, Users, Hash } from "lucide-react";

const socialPlatforms = [
  {
    name: "GitHub",
    href: "https://github.com/GDG-Vishnu",
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
    gradient: "from-gray-700 to-gray-900",
    hoverGradient: "from-gray-600 to-gray-800",
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/company/gdg-vishnu",
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    gradient: "from-blue-600 to-blue-800",
    hoverGradient: "from-blue-500 to-blue-700",
  },
  {
    name: "Instagram",
    href: "https://instagram.com/gdg.vishnu",
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
    gradient: "from-pink-500 to-purple-600",
    hoverGradient: "from-pink-400 to-purple-500",
  },
  {
    name: "Twitter",
    href: "https://twitter.com/gdg_vishnu",
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
      </svg>
    ),
    gradient: "from-sky-400 to-blue-500",
    hoverGradient: "from-sky-300 to-blue-400",
  },
];

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
    <div
      className="bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-2xl p-6 text-white shadow-xl border border-gray-700 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div
        className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-l from-blue-500/10 to-purple-500/10 rounded-full blur-2xl"
      />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-5 h-5 text-blue-400" />
          <h3 className="font-bold text-lg text-white">Follow Us</h3>
        </div>
        <p className="text-gray-300 text-sm mb-6 leading-relaxed">
          Stay connected with us on social media for the latest updates, events,
          and tech discussions.
        </p>
      </div>

      {/* First Row - Instagram and LinkedIn */}
      <div
        className="grid grid-cols-2 gap-4 mb-6"
      >
        {/* Instagram */}
        <a
          href="https://www.instagram.com/gdgvitb/"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative p-4 hover:bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-105 flex flex-col items-center gap-2 border border-white/10"
          aria-label="Follow us on Instagram"
        >
          <div
            className="text-white group-hover:scale-110 transition-transform duration-200"
          >
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-white group-hover:text-white transition-colors">
            Instagram
          </span>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
        </a>

        {/* LinkedIn */}
        <a
          href="https://www.linkedin.com/company/gdg-vitb/"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative p-4 hover:bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-105 flex flex-col items-center gap-2 border border-white/10"
          aria-label="Follow us on LinkedIn"
        >
          <div
            className="text-white group-hover:scale-110 transition-transform duration-200"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-white group-hover:text-white transition-colors">
            LinkedIn
          </span>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
        </a>
      </div>

      {/* Second Row - Join Our Community */}
      <div className="relative">
        <a
          href="https://gdg.community.dev/gdg-on-campus-vishnu-institute-of-technology-bhimavaram-india/"
          className="group relative p-6 hover:bg-gradient-to-br from-emerald-500 via-blue-600 to-purple-600 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] flex flex-col items-center gap-3 border-2 border-white/20 overflow-hidden block w-full text-center"
          aria-label="Learn more about our community"
        >
          {/* Background pattern */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent"
          />

          <div
            className="text-white group-hover:scale-110 transition-transform duration-200"
          >
            <Users className="w-8 h-8" />
          </div>

          <div className="text-center relative z-10">
            <h3 className="text-xl font-bold text-white group-hover:text-yellow-200 transition-colors">
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
