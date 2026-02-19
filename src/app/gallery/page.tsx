import React from "react";
import { Metadata } from "next";
import GalleryPage from "@/app/client/gallery/GalleryClient";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Explore the moments captured at GDG VITB events. See our workshops, hackathons, and community gatherings in action.",
};

export default async function Page() {
  const images = await prisma.gallery.findMany({
    orderBy: { uploadedAt: "desc" },
  });

  const serializedImages = images.map((img) => ({
    ...img,
    uploadedAt: img.uploadedAt.toISOString().split("T")[0],
  }));

  return <GalleryPage initialItems={serializedImages} />;
}
