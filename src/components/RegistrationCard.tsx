"use client";

import React from "react";
import { X, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

type Props = {
  visible: boolean;
  onClose: () => void;
  onRegister?: () => void;
  hack2skillLink?: string;
  formLink?: string;
};

export default function RegistrationCard({
  visible,
  onClose,
  onRegister,
  hack2skillLink = "https://vision.hack2skill.com/event/gdgoc-25-gdgvitb",
  formLink = "https://forms.gle/1yhQcDpzFVR9jQkd8",
}: Props) {
  if (!visible) return null;

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

        <h3 className="text-xl text-stone-900 font-bold mb-2">How to Register</h3>
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
                onClick={onRegister}
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
                onClick={onRegister}
                className="ml-4 inline-flex items-center gap-2 px-3 py-2 bg-sky-600 text-white rounded-full text-sm font-semibold"
              >
                Open Form
                <CheckCircle className="w-4 h-4" />
              </a>
            </div>
          </>
        </div>
        <div className="text-stone-900">For any queries , complaints contact us at <a href="mailto:gdg@vishnu.edu.in" className="text-blue-600 underline">gdg@vishnu.edu.in</a>
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
