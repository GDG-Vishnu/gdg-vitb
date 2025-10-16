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
    <footer className="bg-[#111214] text-gray-300 py-12">
      <div className="w-full mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-0">
          {/* Left: Logo */}
          <div className="flex items-center gap-4">
            <img
              src="https://res.cloudinary.com/duvr3z2z0/image/upload/v1760613865/Logo_lc1hhc.png"
              alt=""
            />
          </div>

          {/* Center: boxed sections */}
          <div className="flex-1 flex items-center justify-center">
            <div className="grid grid-cols-3 gap-4 w-full max-w-[924px] h-[156px] px-[56px] py-[17px] text-sm text-gray-300 ">
              <div
                className="border p-4 flex flex-col items-center justify-center border-[#C3ECF6] ;
              "
              >
                <h2
                  style={{
                    fontFamily:
                      '"Product Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
                    fontWeight: 400,
                    fontStyle: "normal",
                    fontSize: 16,
                    lineHeight: "146%",
                    letterSpacing: "0%",
                    textTransform: "capitalize",
                    width: 142,
                    height: 46,
                    opacity: 1,
                  }}
                  className="text-[#C3ECF6] text-xl"
                >
                  © 2025 GDG VITB.
                </h2>
                <h2 className="  text-[#C3ECF6] text-lg">
                  All Rights are reserved
                </h2>
              </div>

              <div className="border p-4 border-[#CCF6C5]">
                <div className="font-semibold text-[#CCF6C5]  text-lg">
                  Quick Links
                </div>
                <div className="mt-2 flex  gap-4 text-[#CCF6C5] p-1 text-lg ">
                  <a href="#" className="hover:underline">
                    Home
                  </a>
                  <a href="#" className="hover:underline">
                    Domain
                  </a>
                </div>
                <div className=" mt-2 flex  gap-2 text-[#CCF6C5] p-1  text-lg">
                  <a href="#" className="hover:underline">
                    Team
                  </a>
                  <a href="#" className="hover:underline">
                    Contact us
                  </a>
                </div>
              </div>

              <div className="border w-[450px] border-[#FFE7A5] p-4 ">
                <a className="font-semibold text-[#FFE7A5] text-lg">Connect</a>
                <div className="mt-2 flex items-center gap-3">
                  <a
                    href="#"
                    aria-label="LinkedIn"
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "#FFE7A5" }}
                  >
                    <FaLinkedinIn className="text-black w-6 h-6" />
                  </a>
                  <a
                    href="#"
                    aria-label="Instagram"
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "#FFE7A5" }}
                  >
                    <FaInstagram className="text-black w-6 h-6" />
                  </a>
                  <a
                    href="mailto:info@example.com"
                    aria-label="Email"
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "#FFE7A5" }}
                  >
                    <FaEnvelope className="text-black w-6 h-6" />
                  </a>
                  <a
                    href="#"
                    aria-label="WhatsApp"
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "#FFE7A5" }}
                  >
                    <FaWhatsapp className="text-black w-6 h-6" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right: small locale */}
        </div>

        <div className="text-center mt-6 text-sm text-gray-400">
          Designed With <span className="text-red-500">♥</span> By GDG VITB
          Team.
        </div>

        {/* Footer art full width */}
        <div className="mt-6 w-full">
          <img
            src="https://res.cloudinary.com/duvr3z2z0/image/upload/v1760613984/Footer_Art_yhife5.png"
            alt="Footer art"
            className="w-full h-auto object-cover"
          />
        </div>
      </div>
    </footer>
  );
}
