"use client";

import React, { memo, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useResponsive } from "./useResponsive";
import { NavbarDesktop } from "./NavbarDesktop";
import { NavbarTablet } from "./NavbarTablet";
import { NavbarMobile } from "./NavbarMobile";

interface NavbarProps {
  className?: string;
}

function Navbar({ className }: NavbarProps) {
  const { isMobile, isTablet, mounted } = useResponsive();

  // Track whether this is the first mount — animate only once
  const hasAnimated = useRef(false);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <header
        className={cn(
          "w-full flex justify-center py-4 px-4 bg-transparent",
          className,
        )}
      >
        <nav
          className="w-full bg-white rounded-[40px] border border-black shadow-md px-4 py-2 md:py-3 flex items-center justify-between mx-4 relative font-productSans overflow-visible"
          style={{
            boxShadow: "0 8px 0 rgba(0,0,0,0.08), 0 4px 14px rgba(0,0,0,0.06)",
          }}
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex-shrink-0">
              <Link href="/">
                <img
                  src="https://res.cloudinary.com/dlupkibvq/image/upload/v1766919662/Logo_udgpps.png"
                  alt="GDG VITB"
                  width={180}
                  height={40}
                  className="h-6 w-auto object-contain"
                />
              </Link>
            </div>
          </div>
        </nav>
      </header>
    );
  }

  // Only play entrance animation on very first mount
  const shouldAnimate = !hasAnimated.current;
  if (mounted && !hasAnimated.current) {
    hasAnimated.current = true;
  }

  return (
    <motion.header
      initial={shouldAnimate ? { y: -100 } : false}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, type: "spring", stiffness: 120 }}
      className={cn(
        "w-full flex justify-center py-4 px-4 bg-transparent",
        className,
      )}
    >
      <motion.nav
        initial={shouldAnimate ? { scale: 0.95, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="w-full bg-white rounded-[40px] border border-black shadow-md px-4 py-2 md:py-3 flex items-center justify-between mx-4 relative font-productSans overflow-visible"
        style={{
          boxShadow: "0 8px 0 rgba(0,0,0,0.08), 0 4px 14px rgba(0,0,0,0.06)",
        }}
      >
        {isMobile ? (
          <NavbarMobile />
        ) : isTablet ? (
          <NavbarTablet />
        ) : (
          <NavbarDesktop />
        )}
      </motion.nav>
    </motion.header>
  );
}

export default memo(Navbar);
