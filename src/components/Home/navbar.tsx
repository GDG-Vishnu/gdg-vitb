"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href?: string;
  active?: boolean;
};

const navItems: NavItem[] = [
  { label: "Home", href: "#", active: true },
  { label: "About", href: "#" },
  { label: "Team", href: "#" },
  { label: "Events", href: "#" },
  { label: "Domain", href: "#" },
  { label: "Contact Us", href: "#" },
];

export default function Navbar({ className }: { className?: string }) {
  return (
    <header className={cn("w-full flex justify-center  py-6 px-4", className)}>
      <nav
        className="w-full bg-white rounded-[40px] border border-black shadow-md shadow-black/10 px-10 py-3.5  flex items-center justify-between mx-6 relative"
        style={{
          boxShadow: "0 8px 0 rgba(0,0,0,0.08), 0 4px 14px rgba(0,0,0,0.06)",
          fontFamily:
            '"Product Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
          fontWeight: 800,
          fontStyle: "normal",
          fontSize: "20px",
          // leading-trim is not a standard CSS property in browsers; omitted
          lineHeight: "146%",
          letterSpacing: "0",
          textTransform: "capitalize",
        }}
      >
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-[150px] h-[60px] rounded-md bg-transparent">
            {/* Placeholder logo: swap with real Image if available */}
            <img
              src="https://res.cloudinary.com/duvr3z2z0/image/upload/v1760546851/Logo_cnbwsr.png"
              alt="GDG VITB"
              className="h-12 w-auto object-contain"
            />
          </div>
          <span className="font-semibold text-base md:text-lg">GDG VITB</span>
        </div>

        {/* Centered nav links */}
        <ul className="hidden md:flex items-center gap-10 absolute left-1/2 transform -translate-x-1/2">
          {navItems.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className={cn(
                  "text-base md:text-lg font-medium",
                  item.active ? "text-black" : "text-gray-600 hover:text-black"
                )}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
          
       
        <div className="ml-auto  flex items-center gap-4">
             <button className="px-6 py-3 rounded-full border border-black bg-black text-white text-base md:text-lg font-medium hover:bg-gray-500">
            Get Started
          </button>
          <button className="px-6 py-3 rounded-full border border-black bg-white text-black text-base md:text-lg font-medium hover:bg-gray-50">
            Sign Up
          </button>
        </div>
        
      </nav>
    </header>
  );
}
