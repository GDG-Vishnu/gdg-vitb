import React from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer/Footer";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
export default function ParallaxDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="py-8 px-4">
        <div className="py-24 text-center">
          <h1 className="text-3xl font-bold">Parallax demo removed</h1>
          <p className="mt-4 text-stone-600">
            This demo and its component have been removed from the project.
          </p>
          <div className="mt-6">
            <Link href="/" className="text-blue-600 underline">
              Back to Home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
