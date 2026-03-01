"use client";

import SignupCard from "@/components/auth/SignupCard";
import Footer from "@/components/footer/Footer";
import { GuestRoute } from "@/components/auth/RouteGuards";

export default function SignupPage() {
  return (
    <GuestRoute>
      <div className="flex items-center justify-center py-8 sm:py-12 px-3 sm:px-4">
        <SignupCard />
      </div>
      <Footer />
    </GuestRoute>
  );
}
