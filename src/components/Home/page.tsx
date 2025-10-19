"use client";

import React from "react";
import Navbar from "./navbar";
import Events from "./events";
import FAQs from "./faqs";
import AboutSection from "./about";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button3D as MagneticButton } from "@/components/ui/3d-button";
import { LogOut, User, LogIn } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Footer from "@/app/client/footer/Footer";

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
    <div
      className="min-h-screen bg-white relative overflow-hidden "
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
      <div className="relative z-10 flex flex-col items-center justify-start pt-6 px-4">
        {/* Main heading with Google colors */}
        <div className="text-center mb-8">
          <h1
            className="text-4xl md:text-9xl sm:text-2xl font-bold mb-4 font-mono leading-tight whitespace-nowrap"
            style={{
              fontFamily:
                '"Product Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
              fontWeight: 400,
              fontStyle: "normal",
              // Use a responsive clamp so the heading can scale and stay on one line across viewports
              fontSize: "clamp(28px, 8vw, 80px)",
              lineHeight: "146%",
              letterSpacing: "0",
              textTransform: "capitalize",
              // leading-trim is not a standard CSS property in browsers; omitted
            }}
          >
            <span className="text-black mr-3">Google</span>
            <span className="text-black relative mr-3">
              Developer
              {/* Yellow highlight circle */}
            </span>
            <span className="text-black">Group</span>
          </h1>

          <h3
            className="text-black"
            style={{
              fontFamily:
                '"Product Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
              fontWeight: 400,
              fontStyle: "normal",
            
              lineHeight: "146%",
              letterSpacing: "0",
              textTransform: "capitalize",
              // Heading background image
                   fontSize: "clamp(28px, 8vw, 80px)",
              padding: "0.75rem 1.25rem",

              color: "#0b1220",
            }}
          >
            Vishnu Institute Of Technology
          </h3>
        </div>
        <img
          className=""
          src="https://res.cloudinary.com/dlupkibvq/image/upload/v1760851689/Main_Gate_rlrbwg.png"
          alt=""
        />
        {/* About section insertion */}
        <AboutSection />
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
        <div className="my-8 flex  items-center w-full ">
          <div className="md:w-[180px] sm:w-[200px]"></div>
          <div className="flex *:flex-1 justify-center items-center space-x-4">
            <img
              src="https://res.cloudinary.com/dlupkibvq/image/upload/v1760852060/Frame_60_soyopr.png"
              alt="" className="hidden md:block"
            />
            <img
              src="https://res.cloudinary.com/dlupkibvq/image/upload/v1760851996/Events_Star_eubbt3.png"
              alt=""
            />
            <h2
              className="text-6xl font-semibold text-stone-950"
              style={{
                fontFamily:
                  '"Product Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
                fontWeight: 400,
                fontStyle: "normal",
                // Use a responsive clamp so the heading can scale and stay on one line across viewports

                lineHeight: "146%",
                letterSpacing: "0",
                textTransform: "capitalize",
                // leading-trim is not a standard CSS property in browsers; omitted
              }}
            >
              Events{" "}
            </h2>
            <img
              src="https://res.cloudinary.com/dlupkibvq/image/upload/v1760851996/Events_Star_eubbt3.png"
              alt=""
            />
            <img
              src="https://res.cloudinary.com/dlupkibvq/image/upload/v1760852060/Frame_60_soyopr.png"
              alt=""
              className="hidden md:block"
            />
          </div>
        </div>
        {/* Events carousel component insertion */}
        <div className="w-full px-4">
          <Events />
        </div>
        {/* Admin button n check if the user is logged in */}
        ``
      </div>

      {/* FAQs section */}
      <FAQs />

      {/* Floating elements */}
      <div className="absolute top-1/4 left-8 text-blue-500 opacity-30">
        <div className="w-8 h-8 border-2 border-current transform rotate-45"></div>
      </div>

      <div className="absolute top-1/3 right-8 text-red-500 opacity-30">
        <div className="w-6 h-6 bg-current rounded-full"></div>
      </div>

      <div className="absolute bottom-1/3 left-16 text-green-500 opacity-30">
        <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-current"></div>
      </div>
      {/* Site footer */}
      <Footer />
    </div>
  );
};
export default HomePage;
