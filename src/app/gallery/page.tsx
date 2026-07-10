import React from "react";
import { Metadata } from "next";
import GalleryPage from "@/features/gallery/components/GalleryPage";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Explore the moments captured at GDG VITB events. See our workshops, hackathons, and community gatherings in action.",
};

export default function Page() {
  return <GalleryPage />;
}
