import React from "react";
import { Metadata } from "next";
import AboutPage from "@/features/about/components/AboutPage";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn more about GDG VITB, our mission, vision, and how we empower developers at Vishnu Institute of Technology.",
};

export default function Page() {
  return <AboutPage />;
}
