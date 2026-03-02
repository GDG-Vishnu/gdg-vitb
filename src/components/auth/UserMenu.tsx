"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, User, ClipboardList, ChevronDown, Share2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

// ─── Sizes ──────────────────────────────────────────────────

type Size = "sm" | "md";

const sizeClasses: Record<Size, { btn: string; avatar: string; text: string }> =
  {
    sm: {
      btn: "px-3 py-1.5 text-xs gap-1.5",
      avatar: "w-7 h-7",
      text: "text-xs",
    },
    md: {
      btn: "px-5 py-2.5 text-sm gap-2",
      avatar: "w-9 h-9",
      text: "text-sm",
    },
  };

// ─── Dropdown menu items ────────────────────────────────────

interface MenuItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const menuItems: (uid: string) => MenuItem[] = (uid) => [
  { label: "My Profile", href: `/profile/${uid}`, icon: User },
  { label: "Share Profile", href: `/profile-share/${uid}`, icon: Share2 },
  // { label: "My Registrations", href: "/registrations", icon: ClipboardList },
];

// ─── Component ──────────────────────────────────────────────

interface UserMenuProps {
  size?: Size;
  className?: string;
}

export default function UserMenu({
  size = "md",
  className = "",
}: UserMenuProps) {
  const { firebaseUser, userProfile, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const s = sizeClasses[size];

  // Determine which auth button to show based on current page
  const isOnLoginPage = pathname === "/auth/login";
  const authButtonLabel = isOnLoginPage ? "Sign Up" : "Login";
  const authButtonHref = isOnLoginPage ? "/auth/signup" : "/auth/login";

  // Redirect to profile page when profileCompleted is false
  useEffect(() => {
    if (
      !loading &&
      firebaseUser &&
      userProfile &&
      !userProfile.profileCompleted
    ) {
      router.push(`/profile/${firebaseUser.uid}`);
    }
  }, [loading, firebaseUser, userProfile, router]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close on Escape key
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  // ── Loading — reserve space to prevent layout shift ───

  if (loading) {
    return (
      <div className={`min-w-[80px] flex justify-center ${className}`}>
        <div className={`${s.avatar} rounded-full bg-gray-200 animate-pulse`} />
      </div>
    );
  }

  // ── Logged-out: Login button ────────────────────────────

  if (!firebaseUser) {
    return (
      <div className={`min-w-[80px] flex justify-center ${className}`}>
        <Link href={authButtonHref} prefetch={true}>
          <motion.span
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.97 }}
            className={`flex items-center ${s.btn} bg-white text-black font-bold rounded-full shadow-md hover:shadow-lg transition-all duration-200 border border-black font-productSans cursor-pointer ${className}`}
          >
            {authButtonLabel}
          </motion.span>
        </Link>
      </div>
    );
  }

  // ── Logged-in: Profile image + dropdown ─────────────────

  const displayName = userProfile?.name || firebaseUser.displayName || "User";
  const photoURL = userProfile?.profileUrl || firebaseUser.photoURL || "";
  const email = userProfile?.email || firebaseUser.email || "";

  return (
    <div ref={menuRef} className={`relative ${className}`}>
      {/* Avatar trigger */}
      <button
        onClick={() => setMenuOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full border-2 border-black bg-white pl-1 pr-3 py-1 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-1px] active:scale-[0.97] transition-all duration-200"
        aria-label="User menu"
        aria-expanded={menuOpen}
        aria-haspopup="true"
      >
        {photoURL ? (
          <img
            src={photoURL}
            alt={displayName}
            referrerPolicy="no-referrer"
            className={`${s.avatar} rounded-full object-cover border-2 border-black`}
          />
        ) : (
          <div
            className={`${s.avatar} rounded-full bg-black text-white flex items-center justify-center font-bold ${s.text}`}
          >
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
        <ChevronDown
          className={`w-3.5 h-3.5 text-black transition-transform duration-300 ease-out ${menuOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown — wrapper div acts as invisible bridge (pt-2) to prevent dead-zone gap */}
      <AnimatePresence>
        {menuOpen && (
          <div className="absolute right-0 top-full pt-2 w-64 z-50">
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="bg-white rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
            >
              {/* Profile info header */}
              <div className="px-4 py-3 border-b-2 border-black bg-gray-50">
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

              {/* Navigation items */}
              <div className="py-1">
                {menuItems(firebaseUser.uid).map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * (index + 1) }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-black hover:bg-gray-100 transition-colors duration-150 font-productSans font-medium"
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Logout */}
              <div className="border-t-2 border-black py-1">
                <motion.button
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                  onClick={async () => {
                    setMenuOpen(false);
                    await signOut();
                    toast.success("Signed out");
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150 font-productSans font-medium cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
