"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "./navbar";
import Events from "./events";
import FAQs from "./faqs";
import AboutSection from "./about";
// Auth removed: no session or signOut
import { useRouter } from "next/navigation";
import { Button3D as MagneticButton } from "@/components/ui/3d-button";
import { LogOut, User, LogIn } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Footer from "@/components/footer/Footer";
import { url } from "inspector";
import ExtensionSection from "./extension_section";
import CursorSpark from "../CursorSpark";

const HomePage = () => {
  const session = null as any;
  const router = useRouter();
  const isLoggedIn = false;

  // Email subscription state
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");


  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setMessage("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbzCY5rnwcp6QLt5rutfUtMY_UyEby9uBmchm4SxmhTYRsFJoItFlMOW6_H2InwQHv7t/exec", // Replace with NEW URL from step 1
        {
          method: "POST",
          headers: {
            "Content-Type": "text/plain", // Changed to avoid CORS preflight
          },
          body: JSON.stringify({
            email: email,
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        setMessage(
          "Successfully subscribed! Check your inbox for a confirmation email."
        );
        setEmail("");
      } else {
        setMessage(result.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setMessage("Something went wrong. Please try again later.");
      console.error("Subscription error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-white relative overflow-hidden flex flex-col "
      style={{
        backgroundColor: "white",
        backgroundImage: `linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)`,
        backgroundSize: "20px 20px",
      }}
    >
      {/* Enhanced floating background elements */}
      <motion.div
        className="absolute top-20 -left-20 w-96 h-96 bg-gradient-to-r from-blue-200/30 via-purple-200/20 to-indigo-200/30 rounded-full mix-blend-multiply filter blur-3xl"
        animate={{
          x: [0, 60, -20, 40, 0],
          y: [0, -40, 20, -30, 0],
          scale: [1, 1.2, 0.8, 1.1, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-60 -right-32 w-80 h-80 bg-gradient-to-l from-yellow-200/25 via-orange-200/20 to-red-200/30 rounded-full mix-blend-multiply filter blur-2xl"
        animate={{
          x: [0, -70, 30, -50, 0],
          y: [0, 50, -25, 40, 0],
          scale: [1, 0.9, 1.3, 1, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      <motion.div
        className="absolute bottom-40 left-1/4 w-72 h-72 bg-gradient-to-r from-green-200/20 via-emerald-200/25 to-teal-200/30 rounded-full mix-blend-multiply filter blur-2xl"
        animate={{
          x: [0, 40, -30, 20, 0],
          y: [0, -30, 25, -20, 0],
          scale: [1, 1.1, 0.9, 1.2, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
      <motion.div
        className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-r from-pink-200/20 via-rose-200/25 to-purple-200/20 rounded-full mix-blend-multiply filter blur-xl"
        animate={{
          x: [0, -25, 35, -15, 0],
          y: [0, 35, -20, 30, 0],
          scale: [1, 0.8, 1.1, 0.9, 1],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
      />

      {/* Geometric floating shapes */}
      <motion.div
        className="absolute top-32 left-1/3 w-8 h-8 bg-blue-400/20 rotate-45"
        animate={{
          rotate: [45, 135, 225, 315, 45],
          scale: [1, 1.2, 0.8, 1.1, 1],
          x: [0, 20, -10, 15, 0],
          y: [0, -15, 10, -5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-1/2 left-16 w-6 h-6 bg-red-400/25 rounded-full"
        animate={{
          scale: [1, 1.5, 0.5, 1.2, 1],
          x: [0, 25, -20, 30, 0],
          y: [0, -30, 15, -25, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />
      <motion.div
        className="absolute bottom-1/3 right-20 w-10 h-10 border-2 border-green-400/30 rounded-full"
        animate={{
          rotate: [0, 360],
          scale: [1, 0.7, 1.3, 1],
          x: [0, -30, 20, -15, 0],
          y: [0, 20, -25, 10, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "linear",
          delay: 1.5,
        }}
      />
      <motion.div
        className="absolute top-2/3 left-2/3 w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-yellow-400/30"
        animate={{
          rotate: [0, 120, 240, 360],
          scale: [1, 1.3, 0.8, 1],
          x: [0, -20, 25, -10, 0],
          y: [0, 15, -20, 25, 0],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      {/* Additional smaller decorative elements */}
      <motion.div
        className="absolute top-1/4 right-1/3 w-3 h-3 bg-purple-400/40 rounded-full"
        animate={{
          scale: [0.5, 1.2, 0.8, 1],
          opacity: [0.4, 0.8, 0.3, 0.6],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 left-1/2 w-4 h-4 bg-indigo-400/30 rotate-12"
        animate={{
          rotate: [12, 72, 132, 192, 12],
          x: [0, 10, -15, 5, 0],
          y: [0, -10, 8, -12, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      <motion.div
        className="absolute top-3/4 right-1/4 w-5 h-5 border border-orange-400/40 rotate-45"
        animate={{
          rotate: [45, 225, 405],
          scale: [1, 0.6, 1.1, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.8,
        }}
      />

      {/* Site navbar */}
      <Navbar />
      {/* Top right user info and logout button - responsive design 
      {session && (
        <div className="absolute top-4 right-4 md:top-6 md:right-6 z-20 flex flex-col sm:flex-row items-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          {/* User Avatar and Info 
          <div className="flex items-center space-x-2 border rounded-full p-1 shadow-xs min-w-0 max-w-48">
            <Avatar className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0">
              <AvatarImage
                src={session.user?.image || ""}
                alt={session.user?.name || "User"}
              />
              <AvatarFallback className="bg-blue-500 text-white text-xs sm:text-sm">
                {session.user?.name?.charAt(0)?.toUpperCase() || (
                  <User className="h-3 w-3 sm:h-4 sm:w-4" />
                )}
              </AvatarFallback>
            </Avatar>
            <div className="text-xs sm:text-sm flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">
                {session.user?.name || "User"}
              </p>
              {/* <p className="text-xs text-gray-500 hidden sm:block">
                {session.user?.role}
              </p> 
            </div>
          </div>
          {/* Logout Button 
          <MagneticButton
            variant="destructive"
            onClick={handleLogout}
            size="sm"
            className="shadow-lg hover:shadow-xl transition-shadow duration-200 text-white text-xs sm:text-sm px-2 sm:px-4"
          >
            <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
            {/* <span className="hidden xs:inline">Logout</span>
            <span>Log out</span>
          </MagneticButton>
        </div>
      )}

      {/* Top right login button when user is not logged in 
      {!session && (
        <div className="absolute top-4 right-4 md:top-6 md:right-6 z-20">
          <MagneticButton
            variant="default"
            onClick={() => router.push("/auth/login")}
            size="sm"
            className="shadow-lg hover:shadow-xl transition-shadow duration-200 text-white text-xs sm:text-sm px-3 sm:px-4"
          >
            <LogIn className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">Login</span>
            <span className="xs:hidden">Login</span>
          </MagneticButton>
        </div>
      )}
        */}

      {/* Main content */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 flex flex-col items-center justify-start pt-4 sm:pt-6 lg:pt-8 px-4 sm:px-6 lg:px-8"
      >
        {/* Main heading with Google colors */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mb-6 sm:mb-8 lg:mb-12 relative"
        >
          {/* Decorative elements around main heading */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="hidden lg:block absolute -top-4 -left-8 text-blue-400 opacity-30"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="w-6 h-6 border-2 border-current rounded-full"
            ></motion.div>
          </motion.div>
          <motion.div
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 45 }}
            transition={{ duration: 1, delay: 1 }}
            className="hidden lg:block absolute top-12 -right-12 text-red-400 opacity-25"
          >
            <motion.div
              animate={{ rotate: [45, 90, 45] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-8 h-8 border-2 border-current"
            ></motion.div>
          </motion.div>
          <motion.div
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 12 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="hidden lg:block absolute -bottom-8 left-20 text-yellow-400 opacity-30"
          >
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-5 h-5 bg-current"
            ></motion.div>
          </motion.div>
          <motion.div
            initial={{ scale: 0, x: 50 }}
            animate={{ scale: 1, x: 0 }}
            transition={{ duration: 1, delay: 1.4 }}
            className="hidden lg:block absolute -bottom-6 -right-16 text-green-400 opacity-25"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-0 h-0 border-l-3 border-r-3 border-b-6 border-l-transparent border-r-transparent border-b-current"
            ></motion.div>
          </motion.div>
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-2 font-productSans leading-tight relative z-10"
            style={{
              fontWeight: 400,
              fontSize: "clamp(24px, 6vw, 80px)",
              lineHeight: "1.2",
              letterSpacing: "0",
              textTransform: "capitalize",
            }}
          >
            <motion.span
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-black mr-3 "
            >
              Google
            </motion.span>
            <motion.span
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="text-black relative mr-3 font-productSans"
            >
              Developer
              {/* Yellow highlight circle */}
            </motion.span>
            <motion.span
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="text-black font-productSans"
            >
              Group
            </motion.span>
          </motion.h1>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex justify-center items-center w-full bg-no-repeat bg-center bg-contain px-2 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8 relative"
            style={{
              marginBottom: "-0.5rem",
              backgroundImage:
                'url("https://res.cloudinary.com/duvr3z2z0/image/upload/v1764834053/Group_4_q0p7ui.png")',
              backgroundSize: "contain",
            }}
          >
            {/* Floating elements around institute name */}
            <motion.div
              initial={{ scale: 0, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.4 }}
              className="hidden md:block absolute top-2 left-8 text-purple-400 opacity-20"
            >
              <motion.div
                animate={{ y: [-3, 3, -3] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-4 h-4 bg-current rounded-full"
              ></motion.div>
            </motion.div>
            <motion.div
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1, rotate: 45 }}
              transition={{ duration: 1, delay: 1.6 }}
              className="hidden md:block absolute bottom-4 right-12 text-indigo-400 opacity-25"
            >
              <motion.div
                animate={{ rotate: [45, 135, 45] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-6 h-6 border-2 border-current rounded-full"
              ></motion.div>
            </motion.div>
            <h3
              className="text-black text-center px-2 sm:px-4 font-productSans"
              style={{
                fontWeight: 400,
                lineHeight: "1.3",
                fontSize: "clamp(20px, 4vw, 48px)",
                padding: "0.5rem 0.75rem",
                color: "#0b1220",
              }}
            >
              Vishnu Institute Of Technology
            </h3>
          </motion.div>
        </motion.div>
        <motion.img
          className="block mb-0  h-auto object-contain px-2 sm:px-4 lg:px-0"
          src="https://res.cloudinary.com/dlupkibvq/image/upload/v1760851689/Main_Gate_rlrbwg.png"
          alt="Main Gate"
        />
        {/* About section insertion */}
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "" }}
          transition={{ duration: 0.8 }}
          className="-mt-16 mb-[30px]"
        >
          <AboutSection />
        </motion.div>
      </motion.div>
      {/* ExtensionSection with full-width background */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8 }}
        className="w-full flex "
        style={{ background: "#F8D8D8" }}
      >
        <ExtensionSection />
      </motion.div>
      {/* Resume main content container */}
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-col items-center justify-start px-4 sm:px-6 lg:px-8"
      >
        {/* Subtitle */}
        {/* <div className="text-center mb-12">
          <p className="text-xl md:text-2xl text-gray-500 font-medium font-mono tracking-wide">
            Converting Ideas Into Reality!
          </p>
        </div> */}
        {/* <img className=""
          src="https://res.cloudinary.com/duvr3z2z0/image/upload/v1760581715/Abous_Us_ajp4jn.png"
          alt=""
        /> */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="my-6 sm:my-8 lg:my-12 flex justify-center items-center w-full px-4 relative bg-pink-200 py-8 rounded-none border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200"
        >
          {/* Background decoration for Events section */}
          <div
            aria-hidden
            className="absolute inset-0 -inset-x-4"
            style={{
              backgroundImage: `radial-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), radial-gradient(rgba(239, 68, 68, 0.08) 1px, transparent 1px)`,
              backgroundSize: "30px 30px, 60px 60px",
              backgroundPosition: "0 0, 15px 15px",
              opacity: 0.5,
              pointerEvents: "none",
            }}
          />
          {/* Additional floating elements for Events section */}
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            whileInView={{ scale: 1, rotate: 12 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="hidden lg:block absolute top-4 left-4 text-orange-400 opacity-25"
          >
            <motion.div
              animate={{ rotate: [12, 25, 12] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-5 h-5 border-2 border-current"
            ></motion.div>
          </motion.div>
          <motion.div
            initial={{ scale: 0, y: -10 }}
            whileInView={{ scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4 }}
            className="hidden lg:block absolute -top-2 right-8 text-pink-400 opacity-20"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-4 h-4 bg-current rounded-full"
            ></motion.div>
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex justify-center items-center space-x-2 sm:space-x-4 lg:space-x-6 relative"
          >
            <motion.img
              initial={{ x: -20, opacity: 0, rotate: -10 }}
              whileInView={{ x: 0, opacity: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              src="https://res.cloudinary.com/dlupkibvq/image/upload/v1760852060/Frame_60_soyopr.png"
              alt="Decorative frame"
              className="hidden md:block w-8 sm:w-12 lg:w-16 h-auto"
            />
            <motion.img
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              whileHover={{ scale: 1.2, rotate: 15 }}
              animate={{ rotate: [0, 5, -5, 0] }}
              style={{
                animationDuration: "4s",
                animationIterationCount: "infinite",
              }}
              src="https://res.cloudinary.com/dlupkibvq/image/upload/v1760851996/Events_Star_eubbt3.png"
              alt="Star decoration"
              className="w-6 sm:w-8 lg:w-12 h-auto flex-shrink-0"
            />
            <motion.h2
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-black whitespace-nowrap font-productSans"
              style={{
                fontWeight: 900,
                fontStyle: "normal",
                fontSize: "clamp(24px, 5vw, 64px)",
                lineHeight: "1.2",
                letterSpacing: "0",
                textTransform: "capitalize",
              }}
            >
              Events
            </motion.h2>
            <motion.img
              initial={{ scale: 0, rotate: 180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              whileHover={{ scale: 1.2, rotate: -15 }}
              animate={{ rotate: [0, -5, 5, 0] }}
              style={{
                animationDuration: "4s",
                animationIterationCount: "infinite",
              }}
              src="https://res.cloudinary.com/dlupkibvq/image/upload/v1760851996/Events_Star_eubbt3.png"
              alt="Star decoration"
              className="w-6 sm:w-8 lg:w-12 h-auto flex-shrink-0"
            />
            <motion.img
              initial={{ x: 20, opacity: 0, rotate: 10 }}
              whileInView={{ x: 0, opacity: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              whileHover={{ scale: 1.1, rotate: -5 }}
              src="https://res.cloudinary.com/dlupkibvq/image/upload/v1760852060/Frame_60_soyopr.png"
              alt="Decorative frame"
              className="hidden md:block w-8 sm:w-12 lg:w-16 h-auto"
            />
          </motion.div>
        </motion.div>
        {/* Events carousel component insertion */}
        <Events />
        {/* Admin button n check if the user is logged in - removed stray characters above */}
      </motion.div>

      {/* FAQs section */}
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="mt-0"
      >
        <FAQs />
      </motion.div>

      {/* Newsletter Subscription Section */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8 }}
        className="my-16 sm:my-20 lg:my-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto"
      >
        <div className="bg-lime-200 rounded-none p-8 sm:p-12 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] border-4 border-black relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-l from-blue-100/30 to-green-100/20 rounded-full blur-3xl -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-r from-yellow-100/20 to-red-100/20 rounded-full blur-2xl translate-y-24 -translate-x-24" />

          <div className="relative z-10 text-center">
            {/* Heading */}
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 font-productSans"
            >
              Don&apos;t Miss One Event or Update
            </motion.h2>

            {/* Subtext */}
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-gray-600 text-lg sm:text-xl mb-8 max-w-2xl mx-auto leading-relaxed font-productSans"
            >
              Stay in the loop with our latest events, workshops, and tech
              updates. Join our community of developers and never miss out on
              exciting opportunities!
            </motion.p>

            {/* Email subscription form */}
            <motion.form
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
              onSubmit={handleEmailSubmit}
            >
              <motion.input
                type="email"
                name="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
                className="flex-1 px-6 py-4 rounded-none border-4 border-black focus:border-black focus:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all duration-200 text-black bg-white shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] disabled:opacity-50 font-productSans font-bold"
                whileFocus={{ scale: 1.02 }}
              />
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-4 bg-black text-white font-black rounded-none hover:bg-gray-800 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] transition-all duration-200 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] border-4 border-black disabled:opacity-50 disabled:cursor-not-allowed font-productSans"
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              >
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </motion.button>
            </motion.form>

            {/* Message display */}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 p-3 rounded-none text-sm font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-4 border-black ${
                  message.includes("Successfully")
                    ? "bg-green-300 text-black"
                    : "bg-red-300 text-black"
                }`}
              >
                {message}
              </motion.div>
            )}

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-6 text-sm text-gray-500 font-productSans"
            ></motion.div>
          </div>
        </div>
      </motion.div>

      {/* Floating elements - hidden on mobile for better UX */}
      <motion.div
        initial={{ scale: 0, rotate: 0 }}
        animate={{ scale: 1, rotate: 45 }}
        transition={{ duration: 2, delay: 2 }}
        className="hidden sm:block absolute top-1/4 left-4 sm:left-8 lg:left-12 text-blue-500 opacity-20 sm:opacity-30"
      >
        <motion.div
          animate={{ rotate: [45, 90, 45], scale: [1, 1.1, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-current"
        ></motion.div>
      </motion.div>

      <motion.div
        initial={{ scale: 0, x: 50 }}
        animate={{ scale: 1, x: 0 }}
        transition={{ duration: 2, delay: 2.2 }}
        className="hidden sm:block absolute top-1/3 right-4 sm:right-8 lg:right-12 text-red-500 opacity-20 sm:opacity-30"
      >
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-4 h-4 sm:w-6 sm:h-6 bg-current rounded-full"
        ></motion.div>
      </motion.div>

      <motion.div
        initial={{ scale: 0, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 2, delay: 2.4 }}
        className="hidden sm:block absolute bottom-1/3 left-8 sm:left-16 lg:left-20 text-green-500 opacity-20 sm:opacity-30"
      >
        <motion.div
          animate={{ rotate: [0, 15, -15, 0], y: [0, -5, 5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="w-0 h-0 border-l-3 border-r-3 border-b-6 sm:border-l-4 sm:border-r-4 sm:border-b-8 border-l-transparent border-r-transparent border-b-current"
        ></motion.div>
      </motion.div>
      {/* Site footer */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <Footer />
      </motion.div>

      {/* Cursor Sparkle Effect */}
      <CursorSpark />
    </motion.div>
  );
};
export default HomePage;
