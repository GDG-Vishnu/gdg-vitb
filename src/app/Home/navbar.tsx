"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Cloud } from "lucide-react";

type NavItem = {
  label: string;
  href?: string;
  active?: boolean;
};

const navItems: NavItem[] = [
  { label: "Home", href: "/client" },
  { label: "About", href: "/client/about" },
  { label: "Team", href: "/client/Teams" },
  { label: "Events", href: "/client/events" },
  { label: "Gallery", href: "/client/gallery" },
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
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex items-center space-x-4"
        >
          <div className="flex items-center justify-center w-[250px] h-[60px]">
            <Link href="/client">
              <motion.img
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
                src="https://res.cloudinary.com/duvr3z2z0/image/upload/v1764661579/GDG_Insta_Post_1_1_pungg0.png"
                alt="GDG VITB"
                className="h-[60px] w-[300px] object-contain"
              />
            </Link>
          </div>
        </motion.div>

        <motion.ul
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center gap-6 absolute left-1/2 transform -translate-x-1/2 font-productSans whitespace-nowrap"
        >
          {navItems.map((item, index) => {
            const active = item.href && pathname === item.href;
            return (
              <motion.li
                key={item.label}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
              >
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
              </motion.li>
            );
          })}
        </motion.ul>

        {/* TIER-1 Study Jams Badge */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex items-center"
        >
          <Link
            href="https://study-jams-dashboard-ecru.vercel.app/achieved-tier-1"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-stone-900 text-white font-bold text-sm rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-productSans"
          >
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 font-productSans"
            >
               TIER-1 IN Study Jams <Cloud className="w-4 h-4" />
            </motion.span>
          </Link>
        </motion.div>
      </>
    );
  }

  function renderMobile() {
    return (
      <>
        <motion.div
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center space-x-4"
        >
          <div className="flex items-center justify-between w-[180px] h-[40px]">
            <Link href="/client">
              <motion.img
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ scale: 1.05 }}
                src="https://res.cloudinary.com/duvr3z2z0/image/upload/v1760630856/GDG-Lockup-1Line-White_3_1_ed5gem.png"
                alt="GDG VITB"
                className="h-6 w-auto object-contain"
              />
            </Link>
          </div>
        </motion.div>{" "}
        {/* Added proper closing tag here */}
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
  }
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      className={cn("w-full flex justify-center py-6 px-4", className)}
    >
      <motion.nav
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        whileHover={{ y: -2 }}
        className="w-full bg-white rounded-[40px] border border-black shadow-md px-6 py-2 md:py-3.5 flex items-center justify-between mx-4 relative font-productSans"
        style={{
          boxShadow: "0 8px 0 rgba(0,0,0,0.08), 0 4px 14px rgba(0,0,0,0.06)",
        }}
      >
        {isMobile ? renderMobile() : renderDesktop()}

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
                    const active = item.href && pathname === item.href;
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
                            active || item.active
                              ? "text-white font-bold bg-black"
                              : "text-stone-950 hover:bg-gray-50"
                          )}
                          onClick={() => setMobileOpen(false)}
                        >
                          <motion.span
                            whileHover={{ x: 5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            {item.label}
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
