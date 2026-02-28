"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import {
  FaLinkedinIn,
  FaInstagram,
  FaEnvelope,
  FaWhatsapp,
} from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Footer() {
  const [showContact, setShowContact] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("email", formData.email);
      fd.append("subject", formData.subject);
      fd.append("message", formData.message);
      const res = await fetch(
        "https://script.google.com/macros/s/AKfycbyuwiXZV8fcoO8M2qdH3-Rt7ik9BgTjsix9LMEbjop0rFAhYX1MvukmrPMHapY7ry3geg/exec",
        { method: "POST", body: fd },
      );
      if (res.ok) {
        toast.success("Message sent successfully!");
        setFormData({ name: "", email: "", subject: "", message: "" });
        setShowContact(false);
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-[#111214] text-gray-300 w-full pt-4 md:pt-8">
      <div className="w-full mx-auto px-3 sm:px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-4 md:gap-6">
          {/* Left: Logo */}
          <div className="flex items-center gap-4 w-full md:w-auto justify-center md:justify-start mb-4 md:mb-0">
            <img
              src="https://res.cloudinary.com/duvr3z2z0/image/upload/v1760613865/Logo_lc1hhc.png"
              alt="GDG VITB Logo"
              className="h-10 sm:h-12 md:h-16 w-auto"
            />
          </div>

          {/* Center: boxed sections */}
          <div className="flex-1 flex items-center justify-center w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 w-full max-w-[924px] px-0 sm:px-2 md:px-[56px] py-2 md:py-4">
              <div className="border p-4 sm:p-5 md:p-4 flex flex-col items-center justify-center border-[#C3ECF6] rounded-lg md:rounded-none">
                <h2 className="text-[#C3ECF6] text-xl sm:text-2xl md:text-2xl font-medium font-productSans text-center leading-tight">
                  © 2026 GDG VITB.
                </h2>
                <h2 className="text-[#C3ECF6] text-base sm:text-lg md:text-xl font-productSans text-center mt-1 leading-tight">
                  All Rights are reserved
                </h2>
              </div>

              <div className="border p-4 sm:p-5 md:p-4 border-[#CCF6C5] rounded-lg md:rounded-none">
                <div className="font-semibold text-[#CCF6C5] text-lg sm:text-xl font-productSans mb-3 text-center md:text-left">
                  Quick Links
                </div>
                <div className="flex flex-col md:flex-row md:flex-wrap gap-2 md:gap-3 text-[#CCF6C5] text-base sm:text-lg md:text-base">
                  <a
                    href="/"
                    className="hover:underline font-productSans text-center md:text-left py-1"
                  >
                    Home
                  </a>
                  <a
                    href="/gallery"
                    className="hover:underline font-productSans text-center md:text-left py-1"
                  >
                    Gallery
                  </a>
                  <a
                    href="/teams"
                    className="hover:underline font-productSans text-center md:text-left py-1"
                  >
                    Team
                  </a>
                  <button
                    onClick={() => setShowContact(true)}
                    className="hover:underline font-productSans text-center md:text-left py-1 bg-transparent border-none cursor-pointer text-[#CCF6C5] text-base sm:text-lg md:text-base"
                  >
                    Contact us
                  </button>
                  <a
                    href="/events"
                    className="hover:underline font-productSans text-center md:text-left py-1"
                  >
                    Events
                  </a>
                </div>
              </div>

              <div className="border w-full border-[#FFE7A5] p-4 sm:p-5 md:p-4 rounded-lg md:rounded-none">
                <div className="font-semibold text-[#FFE7A5] text-lg sm:text-xl font-productSans mb-3 text-center md:text-left">
                  Connect
                </div>
                <div className="mt-2 flex items-center justify-center md:justify-start gap-3 sm:gap-4">
                  <a
                    href="https://www.linkedin.com/company/gdg-vitb/"
                    aria-label="LinkedIn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 sm:w-11 sm:h-11 md:w-10 md:h-10 rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                    style={{ backgroundColor: "#FFE7A5" }}
                  >
                    <FaLinkedinIn className="text-black w-5 h-5 sm:w-6 sm:h-6 md:w-5 md:h-5" />
                  </a>
                  <a
                    href="https://www.instagram.com/gdgvitb/"
                    aria-label="Instagram"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 sm:w-11 sm:h-11 md:w-10 md:h-10 rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                    style={{ backgroundColor: "#FFE7A5" }}
                  >
                    <FaInstagram className="text-black w-5 h-5 sm:w-6 sm:h-6 md:w-5 md:h-5" />
                  </a>
                  <a
                    href="mailto:gdg@vishnu.edu.in"
                    aria-label="Email"
                    className="w-10 h-10 sm:w-11 sm:h-11 md:w-10 md:h-10 rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                    style={{ backgroundColor: "#FFE7A5" }}
                  >
                    <FaEnvelope className="text-black w-5 h-5 sm:w-6 sm:h-6 md:w-5 md:h-5" />
                  </a>
                </div>
                <h2 className="text-[#FFE7A5] mt-3 text-sm sm:text-base md:text-base font-productSans text-center md:text-left leading-snug">
                  Email us at{" "}
                  <a
                    href="mailto:gdg@vishnu.edu.in"
                    className="hover:underline break-all"
                  >
                    gdg@vishnu.edu.in
                  </a>
                </h2>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-6 sm:mt-8 md:mt-[50px] text-xs sm:text-sm md:text-base text-gray-400 font-productSans px-2">
          Designed With <span className="text-red-500">♥</span> By GDG VITB
          Team.
        </div>

        {/* Footer art full width */}
        <div className="mt-4 sm:mt-5 md:mt-6 w-full">
          <img
            src="https://res.cloudinary.com/duvr3z2z0/image/upload/v1760613984/Footer_Art_yhife5.png"
            alt="Footer decorative art"
            className="w-full h-auto object-cover block"
          />
        </div>
      </div>
      {/* Contact Form Modal */}
      <AnimatePresence>
        {showContact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowContact(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 30 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="w-full max-w-lg bg-[#111111] rounded-2xl border-2 border-white/10 shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <h2 className="text-xl font-bold text-white font-productSans">
                  Contact Us
                </h2>
                <button
                  onClick={() => setShowContact(false)}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Modal body */}
              <div className="px-6 py-5">
                <p className="text-sm text-stone-400 font-productSans mb-5">
                  Have a question or want to collaborate? Drop us a message and
                  we&apos;ll get back to you.
                </p>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <Input
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="bg-white/10 border-white/20 text-white placeholder:text-stone-400 font-productSans text-sm"
                    required
                  />
                  <Input
                    name="email"
                    type="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-white/10 border-white/20 text-white placeholder:text-stone-400 font-productSans text-sm"
                    required
                  />
                  <Input
                    name="subject"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="bg-white/10 border-white/20 text-white placeholder:text-stone-400 font-productSans text-sm"
                    required
                  />
                  <Textarea
                    name="message"
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="bg-white/10 border-white/20 text-white placeholder:text-stone-400 font-productSans min-h-[100px] text-sm"
                    required
                  />
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-white text-black hover:bg-stone-200 font-productSans font-medium text-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}
