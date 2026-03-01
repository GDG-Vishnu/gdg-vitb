"use client";

import LoginCard from "@/components/auth/LoginCard";
import Footer from "@/components/footer/Footer";
import { GuestRoute } from "@/components/auth/RouteGuards";

export default function LoginPage() {
  return (
    <GuestRoute>
      <div className="flex items-center justify-center py-8 sm:py-12 px-3 sm:px-4">
        <LoginCard />
      </div>
      <Footer />
    </GuestRoute>
  );
}
