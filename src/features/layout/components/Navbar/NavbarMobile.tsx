import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, LogOut, User, ClipboardList, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { navItems } from "./constants";
import { useActiveNav } from "./useActiveNav";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const NavbarMobile = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isActive = useActiveNav();
  const { firebaseUser, userProfile, loading, signOut } = useAuth();

  const isLoggedIn = !loading && !!firebaseUser;
  const displayName = userProfile?.name || firebaseUser?.displayName || "User";
  const photoURL = userProfile?.profileUrl || firebaseUser?.photoURL || "";
  const email = userProfile?.email || firebaseUser?.email || "";

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
              {/* ── Profile info header (logged in) ────── */}
              {isLoggedIn && (
                <div className="px-4 py-3 border-b bg-gray-50">
                  <div className="flex items-center gap-3">
                    {photoURL ? (
                      <img
                        src={photoURL}
                        alt={displayName}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full object-cover border-2 border-black"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">
                        {displayName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-black truncate font-productSans">
                        {displayName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{email}</p>
                    </div>
                  </div>
                </div>
              )}

              <motion.ul
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col gap-0 font-productSans"
              >
                {/* ── Nav items ─────────────────────────── */}
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

                {/* ── Profile items (logged in) ────────── */}
                {isLoggedIn && (
                  <>
                    <motion.li
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{
                        delay: navItems.length * 0.1,
                        duration: 0.3,
                      }}
                      className="border-t"
                    >
                      <Link
                        href={`/profile/${firebaseUser.uid}`}
                        prefetch={true}
                        className="flex items-center gap-3 px-4 py-3 text-stone-950 hover:bg-gray-50 font-productSans font-semibold transition-colors duration-300"
                        onClick={() => setMobileOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        My Profile
                      </Link>
                    </motion.li>
                    <motion.li
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{
                        delay: (navItems.length + 1) * 0.1,
                        duration: 0.3,
                      }}
                      className="border-t"
                    >
                      <Link
                        href={`/profile-share/${firebaseUser.uid}`}
                        prefetch={true}
                        className="flex items-center gap-3 px-4 py-3 text-stone-950 hover:bg-gray-50 font-productSans font-semibold transition-colors duration-300"
                        onClick={() => setMobileOpen(false)}
                      >
                        <Share2 className="w-4 h-4" />
                        Share Profile
                      </Link>
                    </motion.li>
                    {/* <motion.li
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: (navItems.length + 1) * 0.1, duration: 0.3 }}
                      className="border-t"
                    >
                      <Link
                        href="/registrations"
                        prefetch={true}
                        className="flex items-center gap-3 px-4 py-3 text-stone-950 hover:bg-gray-50 font-productSans font-semibold transition-colors duration-300"
                        onClick={() => setMobileOpen(false)}
                      >
                        <ClipboardList className="w-4 h-4" />
                        My Registrations
                      </Link>
                    </motion.li> */}
                    <motion.li
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{
                        delay: (navItems.length + 2) * 0.1,
                        duration: 0.3,
                      }}
                      className="border-t"
                    >
                      <button
                        onClick={async () => {
                          setMobileOpen(false);
                          await signOut();
                          toast.success("Signed out");
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 font-productSans font-semibold transition-colors duration-300 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </motion.li>
                  </>
                )}

                {/* ── Login button (logged out) ────────── */}
                {!isLoggedIn && !loading && (
                  <motion.li
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: navItems.length * 0.1, duration: 0.3 }}
                    className="border-t"
                  >
                    <Link
                      href="/auth/login"
                      prefetch={true}
                      className="block px-4 py-3 font-productSans font-semibold text-stone-950 hover:bg-gray-50 transition-colors duration-300"
                      onClick={() => setMobileOpen(false)}
                    >
                      Login
                    </Link>
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
