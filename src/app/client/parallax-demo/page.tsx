import React from "react";
import Navbar from "@/app/client/Home/navbar";
import Footer from "@/components/footer/Footer";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ParallaxScrollDemo from "@/components/ui/parallax-scroll-demo";

export default function ParallaxDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="py-8 px-4">
         <ParallaxScrollDemo />
      </main>

      <Footer />
    </div>
  );
}
