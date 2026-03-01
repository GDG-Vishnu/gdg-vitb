import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, User, ClipboardList, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { navItems } from "./constants";
import { useActiveNav } from "./useActiveNav";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const NavbarMobile = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isActive = useActiveNav();
  const { firebaseUser, signOut } = useAuth();
  const router = useRouter();

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
                mobileOpen ? "translate-y-1 rotate-45" : "",
              )}
            />
            <span
              className={cn(
                "block w-6 h-0.5 bg-stone-950 transition-opacity duration-200",
                mobileOpen ? "opacity-0" : "opacity-100",
              )}
            />
            <span
              className={cn(
                "block w-6 h-0.5 bg-stone-950 transition-transform duration-300",
                mobileOpen ? "-translate-y-1 -rotate-45" : "",
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
                {navItems.map((item, index) => {
                  const active = isActive(item.href);
                  return (
                    <motion.li
                      key={item.label}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      className="border-b"
                    >
                      <Link
                        href={item.href ?? "#"}
                        prefetch={true}
                        className={cn(
                          "block px-4 py-3 font-productSans font-semibold transition-colors duration-300 ease-in-out",
                          item.special
                            ? "bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-stone-900"
                            : active || item.active
                              ? "text-white bg-black"
                              : "text-stone-950 hover:bg-gray-50",
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

                {/* Auth Menu Items */}
                {firebaseUser ? (
                  // Logged in - show profile items
                  <>
                    <motion.li
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{
                        delay: navItems.length * 0.1,
                        duration: 0.3,
                      }}
                      className="border-b"
                    >
                      <Link
                        href="/profile-setup"
                        className={cn(
                          "block px-4 py-3 font-productSans transition-all duration-300 ease-in-out",
                          isActive("/profile-setup")
                            ? "text-white font-bold bg-black"
                            : "text-stone-950 hover:bg-gray-50",
                        )}
                        onClick={() => setMobileOpen(false)}
                      >
                        <motion.span
                          whileHover={{ x: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          className="flex items-center gap-2"
                        >
                          <User className="w-4 h-4" />
                          My Profile
                        </motion.span>
                      </Link>
                    </motion.li>

                    <motion.li
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{
                        delay: (navItems.length + 1) * 0.1,
                        duration: 0.3,
                      }}
                      className="border-b"
                    >
                      <Link
                        href="/registrations"
                        className={cn(
                          "block px-4 py-3 font-productSans transition-all duration-300 ease-in-out",
                          isActive("/registrations")
                            ? "text-white font-bold bg-black"
                            : "text-stone-950 hover:bg-gray-50",
                        )}
                        onClick={() => setMobileOpen(false)}
                      >
                        <motion.span
                          whileHover={{ x: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          className="flex items-center gap-2"
                        >
                          <ClipboardList className="w-4 h-4" />
                          My Registrations
                        </motion.span>
                      </Link>
                    </motion.li>

                    <motion.li
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{
                        delay: (navItems.length + 2) * 0.1,
                        duration: 0.3,
                      }}
                    >
                      <button
                        className="w-full block px-4 py-3 font-productSans transition-all duration-300 ease-in-out text-red-600 hover:bg-red-50 text-left"
                        onClick={async () => {
                          setMobileOpen(false);
                          await signOut();
                          toast.success("Signed out");
                        }}
                      >
                        <motion.span
                          whileHover={{ x: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          className="flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </motion.span>
                      </button>
                    </motion.li>
                  </>
                ) : (
                  // Not logged in - show signup button
                  <motion.li
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: navItems.length * 0.1, duration: 0.3 }}
                  >
                    <button
                      className="w-full block px-4 py-3 font-productSans transition-all duration-300 ease-in-out text-stone-950 hover:bg-gray-50 text-left font-bold"
                      onClick={() => {
                        setMobileOpen(false);
                        router.push("/auth/signup");
                      }}
                    >
                      <motion.span
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="flex items-center gap-2"
                      >
                        Sign Up
                      </motion.span>
                    </button>
                  </motion.li>
                )}
              </motion.ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
