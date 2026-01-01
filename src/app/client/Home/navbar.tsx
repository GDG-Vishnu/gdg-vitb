"use client";
import React, { useState, useEffect, JSX } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Cloud, Sparkles } from "lucide-react";

type NavItem = {
  label: string;
  href?: string;
  active?: boolean;
  special?: boolean;
};

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Team", href: "/teams" },
  { label: "Events", href: "/events" },
  { label: "Gallery", href: "/gallery" },
  { label: "Hack-A-Tron", href: "/hack-a-tron-3.0", special: true },
  { label: "Contact Us", href: "/contactus" },
];

interface NavbarProps {
  className?: string;
}

export default function Navbar({ className }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isTablet, setIsTablet] = useState<boolean>(false);
  const pathname = usePathname();

  const isActive = (href?: string): boolean => {
    if (!href || !pathname) return false;
    const legacy = href === "/" ? "/client" : `/client${href}`;
    const legacyAlt = href === "/teams" ? "/client/Teams" : undefined;
    const nested = ["/events", "/teams", "/about", "/gallery", "/contactus"];
    const isNested = nested.includes(href);
    if (isNested)
      return (
        pathname.startsWith(href) ||
        pathname.startsWith(legacy) ||
        (legacyAlt ? pathname.startsWith(legacyAlt) : false)
      );
    if (href === "/") return pathname === "/" || pathname === legacy;
    return (
      pathname === href ||
      pathname === legacy ||
      (legacyAlt ? pathname === legacyAlt : false)
    );
  };

  useEffect(() => {
    function handleResize(): void {
      const w = window.innerWidth;
      setIsMobile(w < 768);
      setIsTablet(w >= 768 && w < 1024);
      if (w >= 768) setMobileOpen(false);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const renderTablet = (): JSX.Element => (
    <div className="flex items-center justify-between w-full gap-3 lg:gap-4">
      <motion.div
        initial={{ x: -30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.45 }}
        className="flex-shrink-0"
      >
        <Link href="/">
          <motion.img
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.08 }}
            whileHover={{ scale: 1.03 }}
            src="https://res.cloudinary.com/dlupkibvq/image/upload/v1766897167/kshzwc2xey0wu6ce5aci.png"
            alt="GDG VITB"
            width={140}
            height={45}
            className="h-11 lg:h-12 w-auto object-contain"
          />
        </Link>
      </motion.div>

      <div className="flex-1 flex justify-center overflow-x-auto no-scrollbar">
        <motion.ul
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.12 }}
          className="flex items-center gap-2 lg:gap-3 w-full max-w-[900px] px-3 lg:px-4 font-productSans"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {navItems.map((item, index) => {
            const active = isActive(item.href);
            return (
              <motion.li
                key={item.label}
                initial={{ y: -6, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.32, delay: 0.15 + index * 0.05 }}
                className="whitespace-nowrap"
              >
                {item.special ? (
                  <Link
                    href={item.href ?? "#"}
                    className="relative inline-block"
                  >
                    <motion.span
                      whileTap={{ scale: 0.96 }}
                      className={cn(
                        "inline-flex items-center gap-1.5 px-3 lg:px-4 py-2 rounded-full text-sm lg:text-base font-semibold transition-all duration-200",
                        "bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-stone-900",
                        "shadow-md hover:shadow-lg",
                        active && "ring-1 ring-amber-300"
                      )}
                    >
                      <Sparkles className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                      {item.label}
                    </motion.span>
                  </Link>
                ) : (
                  <Link
                    href={item.href ?? "#"}
                    className={cn(
                      "inline-block text-sm lg:text-base font-medium px-3 lg:px-4 py-2 rounded-lg transition-colors duration-200",
                      active || item.active
                        ? "text-white font-bold bg-black shadow-md"
                        : "text-gray-700 hover:text-black hover:bg-gray-100"
                    )}
                  >
                    <motion.span
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.96 }}
                    >
                      {item.label}
                    </motion.span>
                  </Link>
                )}
              </motion.li>
            );
          })}
        </motion.ul>
      </div>

      <motion.div
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.45, delay: 0.16 }}
        className="flex-shrink-0"
      >
        <Link
          href="https://study-jams-dashboard-ecru.vercel.app/achieved-tier-1"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 lg:px-4 py-2 bg-stone-900 text-white text-xs lg:text-sm font-bold rounded-full shadow-md hover:shadow-lg transition-all duration-200"
        >
          <span className="flex items-center gap-1.5">
            <Cloud className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
            TIER-1
          </span>
        </Link>
      </motion.div>
    </div>
  );

  const renderDesktop = (): JSX.Element => (
    <>
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-start flex-shrink-0"
      >
        <div className="flex items-center justify-center w-[250px] h-[60px]">
          <Link href="/">
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              src="https://res.cloudinary.com/dlupkibvq/image/upload/v1766903285/vqbqthkdildhpgbtocgp.png"
              alt="GDG VITB"
              width={300}
              height={60}
              className="h-[60px] w-[300px] object-contain"
            />
          </Link>
        </div>
      </motion.div>

      <motion.ul
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex items-center gap-6 ml-auto mr-auto font-productSans whitespace-nowrap"
      >
        {navItems.map((item, index) => {
          const active = isActive(item.href);
          return (
            <motion.li
              key={item.label}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
            >
              {item.special ? (
                <Link href={item.href ?? "#"} className="relative group">
                  <motion.span
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      "flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-sm transition-all duration-300",
                      "bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-stone-900",
                      "shadow-[0_0_15px_rgba(251,191,36,0.5)] hover:shadow-[0_0_25px_rgba(251,191,36,0.7)]",
                      "border-2 border-yellow-300",
                      active && "ring-2 ring-offset-2 ring-amber-400"
                    )}
                  >
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    {item.label}
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                  </motion.span>
                </Link>
              ) : (
                <Link
                  href={item.href ?? "#"}
                  className={cn(
                    "text-base font-medium font-productSans px-3 py-2 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105",
                    active || item.active
                      ? "text-white font-bold bg-black shadow-md"
                      : "text-gray-600 hover:text-black hover:bg-gray-100"
                  )}
                >
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="font-productSans"
                  >
                    {item.label}
                  </motion.span>
                </Link>
              )}
            </motion.li>
          );
        })}
      </motion.ul>
    </>
  );

  const renderMobile = (): JSX.Element => (
    <>
      <motion.div
        initial={{ x: -30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center space-x-4"
      >
        <div className="flex items-center justify-between w-[180px] h-[40px]">
          <Link href="/">
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ scale: 1.05 }}
              src="https://res.cloudinary.com/dlupkibvq/image/upload/v1766919662/Logo_udgpps.png"
              alt="GDG VITB"
              width={180}
              height={40}
              className="h-6 w-auto object-contain"
            />
          </Link>
        </div>
      </motion.div>

      <motion.div
        initial={{ x: 30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="ml-auto flex items-center gap-2"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-md border flex items-center justify-center transition-all duration-200 ease-in-out hover:bg-gray-50"
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
        </motion.button>
      </motion.div>
    </>
  );

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      className={cn("w-full flex justify-center py-4 px-4", className)}
    >
      <motion.nav
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        whileHover={{ y: -2 }}
        className="w-full bg-white rounded-[40px] border border-black shadow-md px-4 py-2 md:py-3 flex items-center justify-between mx-4 relative font-productSans"
        style={{
          boxShadow: "0 8px 0 rgba(0,0,0,0.08), 0 4px 14px rgba(0,0,0,0.06)",
        }}
      >
        {isMobile
          ? renderMobile()
          : isTablet
          ? renderTablet()
          : renderDesktop()}

        <AnimatePresence>
          {isMobile && mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="absolute left-0 right-0 top-full mt-2 z-30"
            >
              <div className="mx-4 rounded-lg bg-white border shadow-lg overflow-hidden">
                <motion.ul
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex flex-col gap-0 font-productSans"
                >
                  {navItems.map((item, index) => {
                    const active = isActive(item.href);
                    return (
                      <motion.li
                        key={item.label}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        className="border-b last:border-b-0"
                      >
                        <Link
                          href={item.href ?? "#"}
                          className={cn(
                            "block px-4 py-3 font-productSans transition-all duration-300 ease-in-out",
                            item.special
                              ? "bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-stone-900 font-bold"
                              : active || item.active
                              ? "text-white font-bold bg-black"
                              : "text-stone-950 hover:bg-gray-50"
                          )}
                          onClick={() => setMobileOpen(false)}
                        >
                          <motion.span
                            whileHover={{ x: 5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="flex items-center gap-2"
                          >
                            {item.special && <Sparkles className="w-4 h-4" />}
                            {item.label}
                            {item.special && (
                              <span className="ml-auto flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                              </span>
                            )}
                          </motion.span>
                        </Link>
                      </motion.li>
                    );
                  })}
                </motion.ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </motion.header>
  );
}
