"use client";

import React, { useState } from "react";
import { X, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { serverTimestamp, doc, runTransaction } from "firebase/firestore";
import { db, auth } from "@/lib/firebase-client";
import { useAuth } from "@/contexts/AuthContext";

type Props = {
  visible: boolean;
  onClose: () => void;
  onRegistered?: () => void;
  eventId?: string;
  eventTitle?: string;
  hack2skillLink?: string;
  formLink?: string;
};

export default function RegistrationCard({
  visible,
  onClose,
  onRegistered,
  eventId,
  eventTitle,
  hack2skillLink = "https://vision.hack2skill.com/event/gdgoc-25-gdgvitb",
  formLink = "https://forms.gle/1yhQcDpzFVR9jQkd8",
}: Props) {
  const [saved, setSaved] = useState(false);
  // Phone number already fetched by AuthContext — no extra Firestore read needed
  const { userProfile } = useAuth();

  if (!visible) return null;

  async function handleStepClick() {
    // Save registration to Firestore on first external link click
    if (!saved && auth.currentUser && eventId) {
      try {
        const currentUser = auth.currentUser!;
        const regId = `${currentUser.uid}_${eventId}`;

        // Phone number is already in the AuthContext profile — no extra fetch needed
        const phoneNumber: string = userProfile?.phoneNumber ?? "";

        // Event's registrations subcollection
        const eventRegRef = doc(
          db,
          "managed_events",
          eventId,
          "registrations",
          regId,
        );
        // User's registrations subcollection
        const userRegRef = doc(
          db,
          "client_users",
          currentUser.uid,
          "registrations",
          eventId,
        );

        // Atomic transaction: check duplicate + write to both subcollections
        await runTransaction(db, async (tx) => {
          const userRegSnap = await tx.get(userRegRef);
          if (userRegSnap.exists()) {
            // Already registered — no-op
            return;
          }

          // Write to managed_events/{eventId}/registrations subcollection (event-centric)
          tx.set(eventRegRef, {
            userId: currentUser.uid,
            name: currentUser.displayName ?? "",
            email: currentUser.email ?? "",
            phone: phoneNumber,
            registrationType: "Individual",
            registeredAt: serverTimestamp(),
            isCheckedIn: false,
            checkedInAt: null,
          });

          // Write to client_users/{userId}/registrations subcollection
          tx.set(userRegRef, {
            event_id: eventId,
            event_name: eventTitle ?? "Unknown Event",
            event_data: new Date().toISOString(),
            isAttended: false,
            certificationLink: "",
          });
        });

        setSaved(true);
        onRegistered?.();
      } catch (err) {
        console.error("[RegistrationCard] save failed:", err);
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.15 }}
        className="relative w-full max-w-lg mx-4 bg-white rounded-xl shadow-2xl border p-6"
      >
        <button
          aria-label="Close"
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-900 hover:text-gray-900"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl text-stone-900 font-bold mb-2">
          How to Register
        </h3>
        <p className="text-sm text-gray-900 mb-4">
          Follow these two quick steps to complete your registration.
        </p>

        <div className="list-decimal list-inside space-y-4 text-gray-800">
          <>
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold">Register on Hack2Skill</div>
                <div className="text-sm text-gray-900">
                  register on the event portal.
                </div>
              </div>
              <a
                href={hack2skillLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleStepClick}
                className="ml-4 inline-flex items-center gap-2 px-3 py-2 bg-yellow-500 text-black rounded-full text-sm font-semibold"
              >
                Open
                <CheckCircle className="w-4 h-4" />
              </a>
            </div>
          </>

          <>
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold">Fill Google Form</div>
                <div className="text-sm text-gray-600">
                  Submit your data and interest in the form.
                </div>
              </div>
              <a
                href={formLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleStepClick}
                className="ml-4 inline-flex items-center gap-2 px-3 py-2 bg-sky-600 text-white rounded-full text-sm font-semibold"
              >
                Open Form
                <CheckCircle className="w-4 h-4" />
              </a>
            </div>
          </>
        </div>
        <div className="text-stone-900">
          For any queries , complaints contact us at{" "}
          <a
            href="mailto:gdg@vishnu.edu.in"
            className="text-blue-600 underline"
          >
            gdg@vishnu.edu.in
          </a>
          <p>Contact 1. 94931 23579 </p>
          <p>Contact 2. 89853 95957 </p>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border text-sm text-gray-700 hover:bg-gray-50"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
}
