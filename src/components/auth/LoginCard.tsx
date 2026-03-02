"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  isAllowedDomain,
  ensureFirestoreUserDoc,
  getAuthErrorMessage,
} from "@/lib/auth-helpers";

export default function LoginCard() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ hd: "vishnu.edu.in" });
      const result = await signInWithPopup(auth, provider);
      const userEmail = result.user.email;

      if (!userEmail || !isAllowedDomain(userEmail)) {
        toast.error("Please use your college email (@vishnu.edu.in)");
        await auth.signOut();
        return;
      }

      // Ensure Firestore user document exists (won't duplicate)
      await ensureFirestoreUserDoc(db, result.user.uid, {
        name: result.user.displayName ?? "",
        email: userEmail,
        profileUrl: result.user.photoURL ?? "",
      });

      toast.success("Signed in successfully!");
      router.replace("/");
    } catch (err) {
      const msg = getAuthErrorMessage(err);
      if (!msg.includes("popup was closed")) {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAllowedDomain(email)) {
      toast.error("Email must end with @vishnu.edu.in");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);

      // Ensure Firestore doc exists (handles case where user was created
      // via Google and later linked email/password — doc already exists)
      await ensureFirestoreUserDoc(db, result.user.uid, {
        name: result.user.displayName ?? "",
        email: result.user.email ?? email,
        profileUrl: result.user.photoURL ?? "",
      });

      toast.success("Signed in successfully!");
      router.replace("/");
    } catch (err) {
      toast.error(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        type: "spring",
        stiffness: 300,
        damping: 25,
      }}
      className="w-full max-w-lg bg-[#CCF6C5] border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] p-5 sm:p-8"
    >
      <h1 className="text-2xl font-bold text-center mb-1 font-productSans text-black">
        Welcome Back
      </h1>
      <p className="text-center text-sm text-black/70 mb-6 font-productSans">
        Login to your GDG VITB account
      </p>

      {/* Google Button */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 bg-[#1E1E1E] text-white py-3 border-2 border-[#1E1E1E] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-200 font-productSans font-medium disabled:opacity-60 cursor-pointer"
      >
        <Image
          src="/chrome.png"
          alt="Google"
          width={20}
          height={20}
          className="w-[20px] h-[20px] object-contain"
        />
        Continue with Google
      </motion.button>

      {/* Divider */}
      <div className="flex items-center my-5">
        <div className="flex-1 h-px bg-black/30" />
        <span className="px-3 text-xs text-black/60 font-productSans font-medium">
          OR
        </span>
        <div className="flex-1 h-px bg-black/30" />
      </div>

      {/* Email / Password form */}
      <form onSubmit={handleEmailLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-black font-productSans mb-1">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/50" />
            <input
              type="email"
              placeholder="Email (@vishnu.edu.in)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border-2 border-black bg-transparent text-black placeholder:text-black/40 font-productSans text-sm focus:outline-none focus:ring-2 focus:ring-black/30"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-black font-productSans mb-1">
            Password
          </label>
          <div className="relative">
            <Image
              src="/key.png"
              alt="Password"
              width={16}
              height={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50"
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 border-2 border-black bg-transparent text-black placeholder:text-black/40 font-productSans text-sm focus:outline-none focus:ring-2 focus:ring-black/30"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity"
            >
              <Image
                src="/eye.png"
                alt="Toggle password visibility"
                width={16}
                height={16}
                className="w-4 h-4"
              />
            </button>
          </div>
        </div>
        <motion.button
          type="submit"
          whileTap={{ scale: 0.98 }}
          disabled={loading}
          className="w-full py-3 bg-[#1E1E1E] text-white border-2 border-[#1E1E1E] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-200 font-productSans font-bold disabled:opacity-60 cursor-pointer"
        >
          {loading ? "Signing in…" : "Login"}
        </motion.button>
      </form>

      <p className="text-sm text-center text-black/70 mt-5 font-productSans">
        Don&apos;t have an account?{" "}
        <Link
          href="/auth/signup"
          prefetch={true}
          className="font-bold text-black hover:underline"
        >
          Sign Up
        </Link>
      </p>
    </motion.div>
  );
}
