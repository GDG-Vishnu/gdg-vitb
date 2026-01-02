"use client";

import { Link } from "lucide-react";
import React from "react";
import {
  FaLinkedinIn,
  FaInstagram,
  FaEnvelope,
  FaWhatsapp,
} from "react-icons/fa";
import { SOCIAL_LINKS, FOOTER_QUICK_LINKS, GDG_INFO } from "@/constants";

export default function Footer() {
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
                  {GDG_INFO.copyright.split(".")[0]}.
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
                  {FOOTER_QUICK_LINKS.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="hover:underline font-productSans text-center md:text-left py-1"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>

              <div className="border w-full border-[#FFE7A5] p-4 sm:p-5 md:p-4 rounded-lg md:rounded-none">
                <div className="font-semibold text-[#FFE7A5] text-lg sm:text-xl font-productSans mb-3 text-center md:text-left">
                  Connect
                </div>
                <div className="mt-2 flex items-center justify-center md:justify-start gap-3 sm:gap-4">
                  <a
                    href={SOCIAL_LINKS.linkedin}
                    aria-label="LinkedIn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 sm:w-11 sm:h-11 md:w-10 md:h-10 rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                    style={{ backgroundColor: "#FFE7A5" }}
                  >
                    <FaLinkedinIn className="text-black w-5 h-5 sm:w-6 sm:h-6 md:w-5 md:h-5" />
                  </a>
                  <a
                    href={SOCIAL_LINKS.instagram}
                    aria-label="Instagram"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 sm:w-11 sm:h-11 md:w-10 md:h-10 rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                    style={{ backgroundColor: "#FFE7A5" }}
                  >
                    <FaInstagram className="text-black w-5 h-5 sm:w-6 sm:h-6 md:w-5 md:h-5" />
                  </a>
                  <a
                    href={`mailto:${SOCIAL_LINKS.email}`}
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
                    href={`mailto:${SOCIAL_LINKS.email}`}
                    className="hover:underline break-all"
                  >
                    {SOCIAL_LINKS.email}
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
    </footer>
  );
}
