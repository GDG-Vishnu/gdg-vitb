"use client";

import SignupCard from "@/components/auth/SignupCard";
import Footer from "@/components/footer/Footer";

export default function SignupPage() {
  return (
    <>
      <div className="flex items-center justify-center py-12 px-4">
        <SignupCard />
      </div>
      <Footer />
    </>
  );
}
