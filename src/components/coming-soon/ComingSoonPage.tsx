"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button3D as MagneticButton } from "@/components/ui/3d-button";
import { LogOut, User, LogIn } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ComingSoonPage = () => {
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
        backgroundImage: `linear-gradient(rgba(229,231,235,0.9) 1px, transparent 1px), linear-gradient(90deg, rgba(229,231,235,0.9) 1px, transparent 1px)`,
        backgroundSize: "28px 28px",
      }}
    >
      {/* Top right user info and logout button - responsive design */}
      {session && (
        <div className="absolute top-4 right-4 md:top-6 md:right-6 z-20 flex flex-col sm:flex-row items-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          {/* User Avatar and Info */}
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
              <p className="font-medium text-gray-900 truncate font-productSans">
                {session.user?.name || "User"}
              </p>
              {/* <p className="text-xs text-gray-500 hidden sm:block">
                {session.user?.role}
              </p> */}
            </div>
          </div>
          {/* Logout Button */}
          <MagneticButton
            variant="destructive"
            onClick={handleLogout}
            size="sm"
            className="shadow-lg hover:shadow-xl transition-shadow duration-200 text-white text-xs sm:text-sm px-2 sm:px-4"
          >
            <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
            {/* <span className="hidden xs:inline">Logout</span> */}
            <span>Log out</span>
          </MagneticButton>
        </div>
      )}

      {/* Top right login button when user is not logged in */}
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
      {/* Background decorative elements */}
      <div className="absolute inset-0 z-0">
        {/* Code brackets */}
        <div className="absolute top-20 left-10 text-yellow-400 text-6xl font-mono opacity-20">
          {"{ }"}
        </div>

        {/* Binary numbers */}
        <div className="absolute top-32 right-20 text-purple-300 text-sm font-mono opacity-30 rotate-12">
          <div>01001</div>
          <div>11010</div>
        </div>

        {/* Function symbol */}
        <div className="absolute bottom-32 left-20 text-green-400 text-3xl font-mono opacity-20">
          ()
        </div>

        {/* @ symbol */}
        <div className="absolute bottom-20 right-32 text-blue-400 text-4xl opacity-20">
          @
        </div>

        {/* More binary */}
        <div className="absolute bottom-40 right-10 text-yellow-300 text-xs font-mono opacity-25">
          <div>1010</div>
          <div>0110</div>
        </div>

        {/* Code tags */}
        <div className="absolute top-40 right-40 text-purple-400 text-2xl opacity-20">
          {"</>"}
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Header */}

        {/* Main heading with Google colors */}
        <div className="text-center mb-8">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 font-mono leading-tight font-productSans">
            <div className="mb-2">
              <span className="text-black">Google </span>
              <span className="text-black relative">
                Developer
                {/* Yellow highlight circle */}
                <div className="absolute -inset-2 border-4 border-yellow-400 rounded-full opacity-60 transform rotate-3"></div>
              </span>
            </div>
            <div className="text-black">Groups</div>
            <div className="text-2xl md:text-3xl font-semibold text-gray-600 font-mono tracking-wider mt-2 font-productSans">
              On Campus
            </div>
          </h1>

          <div className="mx-auto mt-4">
            <img
              src="https://res.cloudinary.com/duvr3z2z0/image/upload/v1760548602/Hero_About_Us_sjhgvi.png"
              alt="Hero"
              className="mx-auto w-full max-w-lg opacity-80 filter grayscale object-contain"
            />
          </div>
        </div>

        {/* Subtitle */}
        {/* <div className="text-center mb-12">
          <p className="text-xl md:text-2xl text-gray-500 font-medium font-mono tracking-wide">
            Converting Ideas Into Reality!
          </p>
        </div> */}

        {/* Coming soon message */}
        <div className="text-center mb-8">
          <MagneticButton className="px-12">Coming Soon</MagneticButton>
        </div>

        {/* Admin button n check if the user is logged in */}
        {isLoggedIn && (
          <div className="text-center mb-8">
            <MagneticButton
              onClick={() => router.push("/admin")}
              variant="default"
              className="px-12 bg-blue-600 hover:bg-blue-700"
            >
              Admin
            </MagneticButton>
          </div>
        )}

        {/* Google-colored decorative elements */}
        <div className="flex items-center space-x-4">
          <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
          <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
        </div>
      </div>

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
    </div>
  );
};
export default ComingSoonPage;
