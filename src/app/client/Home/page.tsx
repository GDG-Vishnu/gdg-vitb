"use client";

import React from "react";
import { motion } from "framer-motion";
import Navbar from "./navbar";
import Events from "./events";
import FAQs from "./faqs";
import AboutSection from "./about";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button3D as MagneticButton } from "@/components/ui/3d-button";
import { LogOut, User, LogIn } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Footer from "@/components/footer/Footer";
import { url } from "inspector";
import ExtensionSection from "./extension_section";

const HomePage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const isLoggedIn = !!session;

  const handleLogout = async () => {
    try {
      await signOut({
        callbackUrl: "/",
        redirect: true,
      });
    } catch (error) {
      console.error("Logout error:", error);
      router.push("/");
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
            className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-2 font-productSans leading-tight relative z-10"
            style={{
              fontFamily:
                '"Product Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
              fontWeight: 400,

              // Use a responsive clamp so the heading can scale and stay on one line across viewports
              fontSize: "clamp(24px, 6vw, 80px)",
              lineHeight: "1.2",
              letterSpacing: "0",
              textTransform: "capitalize",
              // leading-trim is not a standard CSS property in browsers; omitted
            }}
          >
            <motion.span
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-black mr-3"
            >
              Google
            </motion.span>
            <motion.span
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="text-black relative mr-3"
            >
              Developer
              {/* Yellow highlight circle */}
            </motion.span>
            <motion.span
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="text-black"
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
              className="text-black text-center px-2 sm:px-4"
              style={{
                fontFamily:
                  '"Product Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
                fontWeight: 400,
                lineHeight: "1.3",
                fontSize: "clamp(16px, 4vw, 48px)",
                padding: "0.5rem 0.75rem",
                color: "#0b1220",
              }}
            >
              Vishnu Institute Of Technology
            </h3>
          </motion.div>
        </motion.div>
        <motion.img
          initial={{ y: 50, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1 }}
          whileHover={{ scale: 1.02 }}
          className="block mb-0  h-auto object-contain px-2 sm:px-4 lg:px-0"
          src="https://res.cloudinary.com/dlupkibvq/image/upload/v1760851689/Main_Gate_rlrbwg.png"
          alt="Main Gate"
        />
        {/* About section insertion */}
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
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
        className="w-full"
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
          className="my-6 sm:my-8 lg:my-12 flex justify-center items-center w-full px-4 relative"
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
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex justify-center items-center space-x-2 sm:space-x-4 lg:space-x-6 relative z-10"
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
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-stone-950 whitespace-nowrap"
              style={{
                fontFamily:
                  '"Product Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
                fontWeight: 400,
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
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full px-2 sm:px-4 lg:px-8 max-w-7xl mx-auto"
        >
          <Events />
        </motion.div>
        {/* Admin button n check if the user is logged in */}
        ``
      </motion.div>

      {/* FAQs section */}
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <FAQs />
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
    </motion.div>
  );
};
export default HomePage;
