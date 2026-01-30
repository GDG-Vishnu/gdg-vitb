import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { navItems } from "./constants";
import { useActiveNav } from "./useActiveNav";

export const NavbarTablet = () => {
  const isActive = useActiveNav();

  return (
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

      <div className="flex-1 flex justify-center">
        <motion.ul
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.12 }}
          className="flex items-center gap-1.5 lg:gap-2 w-full max-w-[900px] px-2 lg:px-3 font-productSans"
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
                        "inline-flex items-center gap-1 px-2.5 lg:px-3 py-1.5 rounded-full text-xs lg:text-sm font-semibold transition-all duration-200",
                        "bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-stone-900",
                        "shadow-md hover:shadow-lg",
                        active && "ring-1 ring-amber-300"
                      )}
                    >
                      <Sparkles className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                      {item.label}
                    </motion.span>
                  </Link>
                ) : (
                  <Link
                    href={item.href ?? "#"}
                    className={cn(
                      "inline-block text-xs lg:text-sm font-medium px-2.5 lg:px-3 py-1.5 rounded-lg transition-colors duration-200",
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
          href="https://gen-ai-gdg-vitb.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-3 lg:px-4 py-2 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-stone-900 text-xs lg:text-sm font-bold rounded-full shadow-md hover:shadow-lg transition-all duration-200 border border-amber-300"
          >
            <Trophy className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
            <span className="hidden sm:inline">Top 2 Study Jams</span>
            <span className="sm:hidden">#1</span>
          </motion.div>
        </Link>
      </motion.div>
    </div>
  );
};
