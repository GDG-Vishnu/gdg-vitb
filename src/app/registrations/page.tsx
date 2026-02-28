"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase-client";
import { useAuth } from "@/contexts/AuthContext";
import Footer from "@/components/footer/Footer";
import { CalendarDays, MapPin, ArrowLeft, Loader2 } from "lucide-react";

// ─── Types ──────────────────────────────────────────────────

interface Registration {
  id: string;
  eventId: string;
  eventTitle: string;
  registeredAt: string;
  status: string;
}

// ─── Page ───────────────────────────────────────────────────

export default function MyRegistrationsPage() {
  const { firebaseUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Auth guard
  useEffect(() => {
    if (!authLoading && !firebaseUser) {
      router.replace("/");
    }
  }, [authLoading, firebaseUser, router]);

  // Fetch registrations
  useEffect(() => {
    if (!firebaseUser) return;

    let mounted = true;

    (async () => {
      try {
        const q = query(
          collection(db, "registrations"),
          where("userId", "==", firebaseUser.uid),
        );
        const snap = await getDocs(q);

        if (!mounted) return;

        const regs: Registration[] = snap.docs.map((doc) => {
          const d = doc.data();
          return {
            id: doc.id,
            eventId: d.eventId ?? "",
            eventTitle: d.eventTitle ?? "Unknown Event",
            registeredAt:
              d.registeredAt?.toDate?.().toISOString() ??
              d.createdAt?.toDate?.().toISOString() ??
              new Date().toISOString(),
            status: d.status ?? "registered",
          };
        });

        // Sort by most recent first
        regs.sort(
          (a, b) =>
            new Date(b.registeredAt).getTime() -
            new Date(a.registeredAt).getTime(),
        );

        setRegistrations(regs);
      } catch (err) {
        console.error("[Registrations] fetch failed:", err);
        if (mounted) setError("Failed to load registrations.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [firebaseUser]);

  // ── Loading / auth guard ──────────────────────────────────

  if (authLoading || !firebaseUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────

  return (
    <div
      className="min-h-screen bg-white relative overflow-hidden"
      style={{
        backgroundColor: "white",
        backgroundImage:
          "linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      <main className="relative z-10 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black mb-8 font-productSans transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          {/* Header */}
          <div className="text-center mb-12">
            <div className="relative inline-block mb-4">
              <div className="absolute -inset-4 bg-blue-200 border-4 border-black rounded-3xl transform rotate-1 opacity-80 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" />
              <h1 className="relative text-3xl md:text-4xl font-bold text-black font-productSans px-6 py-3">
                My Registrations
              </h1>
            </div>
            <p className="text-gray-600 font-productSans mt-6">
              Events you&apos;ve registered for
            </p>
          </div>

          {/* Content */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          )}

          {!loading && error && (
            <div className="text-center py-20">
              <div className="bg-red-100 border-4 border-red-500 rounded-2xl p-8 shadow-[8px_8px_0px_0px_rgba(239,68,68,1)] max-w-md mx-auto">
                <p className="text-red-800 font-bold text-lg font-productSans">
                  {error}
                </p>
              </div>
            </div>
          )}

          {!loading && !error && registrations.length === 0 && (
            <div className="text-center py-20">
              <div className="bg-yellow-100 border-4 border-yellow-500 rounded-3xl p-12 shadow-[12px_12px_0px_0px_rgba(234,179,8,1)] max-w-lg mx-auto">
                <div className="text-6xl mb-6">📋</div>
                <p className="text-yellow-800 font-bold text-xl font-productSans mb-2">
                  No registrations yet
                </p>
                <p className="text-yellow-700 font-productSans text-base mb-6">
                  Browse our events and register for one!
                </p>
                <Link
                  href="/events"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-bold rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200 font-productSans"
                >
                  <CalendarDays className="w-4 h-4" />
                  Browse Events
                </Link>
              </div>
            </div>
          )}

          {!loading && !error && registrations.length > 0 && (
            <div className="space-y-4">
              {registrations.map((reg) => (
                <Link
                  key={reg.id}
                  href={`/events/${reg.eventId}`}
                  className="block bg-white border-2 border-black rounded-2xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-bold text-black font-productSans truncate">
                        {reg.eventTitle}
                      </h3>
                      <p className="text-sm text-gray-500 font-productSans mt-1">
                        Registered on{" "}
                        {new Date(reg.registeredAt).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </p>
                    </div>
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-bold rounded-full border-2 border-black font-productSans ${
                        reg.status === "confirmed"
                          ? "bg-green-200 text-green-800"
                          : reg.status === "cancelled"
                            ? "bg-red-200 text-red-800"
                            : "bg-blue-200 text-blue-800"
                      }`}
                    >
                      {reg.status.charAt(0).toUpperCase() + reg.status.slice(1)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
