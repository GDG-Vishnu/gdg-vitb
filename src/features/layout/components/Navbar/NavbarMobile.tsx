import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { navItems } from "./constants";
import { useActiveNav } from "./useActiveNav";

export const NavbarMobile = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isActive = useActiveNav();

  return (
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

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="absolute left-0 right-0 top-full mt-2 z-30 "
          >
            <div className="mx-4 rounded-lg bg-white border shadow-lg overflow-hidden">
              <motion.ul
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col gap-0 font-productSans"
              >
                <motion.li
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.05, duration: 0.3 }}
                  className="border-b"
                >
                  <Link
                    href="https://gen-ai-gdg-vitb.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileOpen(false)}
                  >
                    <div className="px-4 py-4 bg-gradient-to-r from-amber-50 to-yellow-50 flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 rounded-full">
                        <Trophy className="w-5 h-5 text-stone-900" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-stone-900">
                          Top 2 in India
                        </p>
                        <p className="text-[10px] text-stone-600 font-medium">
                          GDG On Campus VITB Achievement
                        </p>
                      </div>
                      <span className="px-2 py-1 bg-amber-500 text-stone-900 text-[10px] font-bold rounded-full">
                        🏆
                      </span>
                    </div>
                  </Link>
                </motion.li>
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
    </>
  );
};
