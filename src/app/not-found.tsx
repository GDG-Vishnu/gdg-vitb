"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Home as HomeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div
      className="relative min-h-screen overflow-hidden bg-white text-black"
      style={{
        backgroundImage:
          "linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      {/* softly animated blobs to mirror the home aesthetic */}
      <motion.div
        className="absolute top-10 -left-24 h-96 w-96 rounded-full bg-gradient-to-r from-blue-200/30 via-indigo-200/25 to-purple-200/30 blur-3xl"
        animate={{
          x: [0, 60, -20, 30, 0],
          y: [0, -30, 20, -25, 0],
          scale: [1, 1.1, 0.9, 1.15, 1],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-16 left-12 h-72 w-72 rounded-full bg-gradient-to-l from-yellow-200/25 via-orange-200/25 to-red-200/25 blur-2xl"
        animate={{
          x: [0, 30, -40, 20, 0],
          y: [0, -10, 15, -5, 0],
          scale: [1, 0.95, 1.15, 1.05, 1],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      <motion.div
        className="absolute top-1/3 right-0 h-80 w-80 rounded-full bg-gradient-to-br from-green-200/30 via-emerald-200/25 to-teal-200/30 blur-2xl"
        animate={{
          x: [0, -50, 20, -30, 0],
          y: [0, 25, -20, 30, 0],
          scale: [1, 1.2, 0.85, 1.1, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      <main className="relative z-10 mx-auto flex max-w-6xl flex-col items-center gap-10 px-6 pb-20 pt-16 lg:flex-row lg:gap-16 lg:pb-28 lg:pt-24">
        <div className="w-full max-w-xl space-y-6 text-center lg:text-left">
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-4 py-2 text-sm font-semibold"
          >
            <ArrowLeft className="h-4 w-4" />
            Lost in the grid
          </motion.p>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-productSans text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl"
          >
            <span className="text-black">404</span>{" "}
            <span className="text-transparent bg-gradient-to-r from-blue-500 via-red-500 via-yellow-500 to-green-500 bg-clip-text">
              Not found
            </span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-lg text-gray-700"
          >
            The page you are looking for drifted away. Let&apos;s get you back
            to a familiar place.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-col items-center gap-3 sm:flex-row sm:justify-start"
          >
            <Button
              asChild
              size="lg"
              className="shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]"
            >
              <Link href="/" className="inline-flex items-center gap-2">
                <HomeIcon className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative flex h-72 w-full max-w-lg items-center justify-center"
        >
          <div className="absolute inset-6 rounded-3xl border-2 border-black bg-white/80 backdrop-blur">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-100 via-yellow-50 to-green-100 opacity-60" />
            <div className="absolute inset-6 rounded-2xl border-2 border-dashed border-black/40" />
          </div>
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10 text-center"
          >
            <p className="text-8xl font-bold tracking-tight text-black">404</p>
            <p className="mt-2 text-sm uppercase tracking-[0.35em] text-gray-600">
              Not found
            </p>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
