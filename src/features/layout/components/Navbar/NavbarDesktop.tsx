import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useActiveNav } from "./useActiveNav";
import UserMenu from "@/components/auth/UserMenu";
import { NavItem } from "./types";

interface NavbarDesktopProps {
  navItems: NavItem[];
}

export const NavbarDesktop = ({ navItems }: NavbarDesktopProps) => {
  const isActive = useActiveNav();

  return (
    <>
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-start flex-shrink-0 bg-white "
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
                      active && "ring-2 ring-offset-2 ring-amber-400",
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
                  prefetch={true}
                  className={cn(
                    "text-base font-semibold font-productSans px-3 py-2 rounded-lg transition-colors duration-300 ease-in-out",
                    active || item.active
                      ? "text-white bg-black shadow-md"
                      : "text-gray-600 hover:text-black hover:bg-gray-100",
                  )}
                >
                  <span className="font-productSans">{item.label}</span>
                </Link>
              )}
            </motion.li>
          );
        })}
      </motion.ul>

      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex items-center flex-shrink-0 w-[250px] justify-end gap-3"
      >
        <UserMenu size="md" />
      </motion.div>
    </>
  );
};
