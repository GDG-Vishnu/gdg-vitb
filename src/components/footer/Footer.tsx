"use client";

import React from "react";
import {
  FaLinkedinIn,
  FaInstagram,
  FaEnvelope,
  FaWhatsapp,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#111214] text-gray-300 py-8 md:py-12 w-full">
      <div className="w-full mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-0">
          {/* Left: Logo */}
          <div className="flex items-center gap-4 mx-auto md:mx-0">
            <img
              src="https://res.cloudinary.com/duvr3z2z0/image/upload/v1760613865/Logo_lc1hhc.png"
              alt="GDG VITB Logo"
              className="h-12 md:h-auto w-auto"
            />
          </div>

          {/* Center: boxed sections */}
          <div className="flex-1 flex items-center justify-center w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 w-full max-w-[924px] md:h-[156px] px-2 md:px-[56px] py-4 text-sm text-gray-300">
              <div className="border p-3 md:p-4 flex flex-col items-center justify-center border-[#C3ECF6] rounded-lg md:rounded-none">
                <h2 className="text-[#C3ECF6] text-base md:text-2xl font-medium font-productSans text-center">
                  © 2025 GDG VITB.
                </h2>
                <h2 className="text-[#C3ECF6] text-sm md:text-xl font-productSans text-center">
                  All Rights are reserved
                </h2>
              </div>

              <div className="border p-3 md:p-4 border-[#CCF6C5] rounded-lg md:rounded-none">
                <div className="font-semibold text-[#CCF6C5] text-base md:text-xl font-productSans mb-2 text-center md:text-left">
                  Quick Links
                </div>
                <div className="flex flex-col md:flex-row md:flex-wrap gap-2 md:gap-4 text-[#CCF6C5] text-sm md:text-lg">
                  <a
                    href="/"
                    className="hover:underline font-productSans text-center md:text-left"
                  >
                    Home
                  </a>
                  <a
                    href="/client/gallery"
                    className="hover:underline font-productSans text-center md:text-left"
                  >
                    Gallery
                  </a>
                  <a
                    href="/client/Teams"
                    className="hover:underline font-productSans text-center md:text-left"
                  >
                    Team
                  </a>
                  <a
                    href="/client/contactus"
                    className="hover:underline font-productSans text-center md:text-left"
                  >
                    Contact us
                  </a>
                </div>
              </div>

              <div className="border w-full border-[#FFE7A5] p-3 md:p-4 rounded-lg md:rounded-none">
                <div className="font-semibold text-[#FFE7A5] text-base md:text-xl font-productSans mb-2 text-center md:text-left">
                  Connect
                </div>
                <div className="mt-2 flex items-center justify-center md:justify-start gap-3 md:gap-3">
                  <a
                    href="https://www.linkedin.com/company/gdg-vitb/"
                    aria-label="LinkedIn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                    style={{ backgroundColor: "#FFE7A5" }}
                  >
                    <FaLinkedinIn className="text-black w-4 h-4 md:w-6 md:h-6" />
                  </a>
                  <a
                    href="https://www.instagram.com/gdgvitb/"
                    aria-label="Instagram"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                    style={{ backgroundColor: "#FFE7A5" }}
                  >
                    <FaInstagram className="text-black w-4 h-4 md:w-6 md:h-6" />
                  </a>
                  <a
                    href="mailto:gdg@vishnu.edu.in"
                    aria-label="Email"
                    className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                    style={{ backgroundColor: "#FFE7A5" }}
                  >
                    <FaEnvelope className="text-black w-4 h-4 md:w-6 md:h-6" />
                  </a>
                </div>
                <h2 className="text-[#FFE7A5] mt-3 text-sm md:text-lg font-productSans text-center md:text-left">
                  Email us at{" "}
                  <a
                    href="mailto:gdg@vishnu.edu.in"
                    className="hover:underline"
                  >
                    gdg@vishnu.edu.in
                  </a>
                </h2>
              </div>
            </div>
          </div>

          {/* Right: small locale */}
        </div>

        <div className="text-center mt-4 md:mt-6 text-sm md:text-base text-gray-400 font-productSans px-2">
          Designed With <span className="text-red-500">♥</span> By GDG VITB
          Team.
        </div>

        {/* Footer art full width */}
        <div className="mt-4 md:mt-6 w-full -mx-4 md:-mx-6">
          <img
            src="https://res.cloudinary.com/duvr3z2z0/image/upload/v1760613984/Footer_Art_yhife5.png"
            alt="Footer decorative art"
            className="w-full h-auto object-cover"
          />
        </div>
      </div>
    </footer>
  );
}
