"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href?: string;
  active?: boolean;
};

const navItems: NavItem[] = [
  { label: "Home", href: "/client", active: true },
  { label: "About", href: "#" },
  { label: "Team", href: "/teams" },
  { label: "Events", href: "/client/events" },
  { label: "Gallery", href: "#" },
  { label: "Contact Us", href: "/client/contactus" },
];

export default function Navbar({ className }: { className?: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setMobileOpen(false);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function renderDesktop() {
    return (
      <>
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-[300px] h-[60px] rounded-md bg-transparent object-cover">
            <img
              src="https://res.cloudinary.com/duvr3z2z0/image/upload/v1764661579/GDG_Insta_Post_1_1_pungg0.png"
              alt="GDG VITB"
              className="h-[60px]  w-[300px] object-contain"
            />
          </div>
        </div>

        <ul className="flex items-center gap-10 absolute left-1/2 transform -translate-x-1/2">
          {navItems.map((item) => {
            const active = item.href && pathname === item.href;
            return (
              <li key={item.label}>
                <Link
                  href={item.href ?? "#"}
                  className={cn(
                    "text-base md:text-lg font-medium",
                    active || item.active
                      ? "text-black font-bold"
                      : "text-gray-600 hover:text-black"
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

   
      </>
    );
  }

  function renderMobile() {
    return (
      <>
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-between w-[180px] h-[40px] rounded-md bg-transparent">
            <img
              src="https://res.cloudinary.com/duvr3z2z0/image/upload/v1760630856/GDG-Lockup-1Line-White_3_1_ed5gem.png"
              alt="GDG VITB"
              className="h-6 w-auto object-contain"
            />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            className="p-2 rounded-md border flex items-center justify-center"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <span className="flex flex-col justify-center items-center gap-1">
              <span
                className={cn(
                  "block w-6 h-0.5 bg-stone-950 transition-transform duration-300",
                  mobileOpen ? "translate-y-1 rotate-45" : ""
                )}
              />
              <span
                className={cn(
                  "block w-6 h-0.5 bg-stone-950 transition-opacity duration-200",
                  mobileOpen ? "opacity-0" : "opacity-100"
                )}
              />
              <span
                className={cn(
                  "block w-6 h-0.5 bg-stone-950 transition-transform duration-300",
                  mobileOpen ? "-translate-y-1 -rotate-45" : ""
                )}
              />
            </span>
          </button>
        </div>
      </>
    );
  }

  return (
    <header className={cn("w-full flex justify-center  py-6 px-4 ", className)}>
      <nav
        className="w-full bg-white rounded-[40px] border border-black shadow-md shadow-black/10 px-6 py-2 md:py-3.5  flex items-center justify-between mx-4 relative"
        style={{
          boxShadow: "0 8px 0 rgba(0,0,0,0.08), 0 4px 14px rgba(0,0,0,0.06)",
          fontFamily:
            '"Product Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
          fontWeight: 800,
          fontStyle: "normal",
          fontSize: "18px",
          lineHeight: "146%",
          letterSpacing: "0",
          textTransform: "capitalize",
        }}
      >
        {isMobile ? renderMobile() : renderDesktop()}

        {/* Mobile menu (kept outside flow so it overlays) */}
        {isMobile && (
          <div className="absolute left-0 right-0 top-full mt-2 z-30">
            <div
              className={cn(
                "mx-4 rounded-lg bg-white border shadow-lg overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out",
                mobileOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
              )}
            >
              <ul className="flex flex-col gap-0">
                {navItems.map((item) => (
                  <li key={item.label} className="border-b last:border-b-0">
                    <Link
                      href={item.href ?? "#"}
                      className="block px-4 py-3  text-stone-950 hover:bg-gray-50"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
