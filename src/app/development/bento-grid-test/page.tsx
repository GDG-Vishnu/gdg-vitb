"use client";

import React from "react";
// import Navbar from "@/components/navbar";
import Footer from "@/components/footer/Footer";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";

const images: string[] = [
  "https://res.cloudinary.com/dlupkibvq/image/upload/v1766121072/cdwplwcgzswuzt6dmvyh.jpg",
  "https://res.cloudinary.com/dlupkibvq/image/upload/v1766121072/jalxke80kptiayk9lfot.jpg",
  "https://res.cloudinary.com/dlupkibvq/image/upload/v1766121072/hegcgmel1d7ionmjnpg1.jpg",
  "https://res.cloudinary.com/dlupkibvq/image/upload/v1766121072/xrehxswonqbmlwn3cbg5.jpg",
  // Additional images from existing assets for testing layout variety
  "https://res.cloudinary.com/dlupkibvq/image/upload/v1760851689/Main_Gate_rlrbwg.png",
  "https://res.cloudinary.com/duvr3z2z0/image/upload/v1760581715/Abous_Us_ajp4jn.png",
  "https://res.cloudinary.com/dlupkibvq/image/upload/v1760852060/Frame_60_soyopr.png",
  "https://res.cloudinary.com/duvr3z2z0/image/upload/v1764655440/Group_6_mczuk3.png",
];

function ImageHeader({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative h-48 w-full overflow-hidden rounded-lg border border-black/10">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover transition-transform duration-300 group-hover/bento:scale-[1.03]"
      />
    </div>
  );
}

export default function BentoGridTestPage() {
  const items = images.map((url, idx) => ({
    title: `Image ${idx + 1}`,
    description: "Bento Grid test item",
    header: <ImageHeader src={url} alt={`Bento item ${idx + 1}`} />,
    // Create a visually interesting layout with a few spans
    className:
      idx % 7 === 0
        ? "md:col-span-2"
        : idx % 5 === 0
        ? "row-span-2"
        : undefined,
  }));

  return (
    <div
      className="min-h-screen bg-white"
      style={{
        backgroundColor: "white",
        backgroundImage:
          "linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      {/* <Navbar /> */}

      <main className="relative z-10 py-10 px-4">
        <div className="max-w-6xl mx-auto mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold font-productSans text-stone-900">
            Bento Grid Test
          </h1>
          <p className="mt-2 text-stone-600 font-productSans">
            8 images from the Gallery and existing assets
          </p>
        </div>

        <BentoGrid className="max-w-6xl mx-auto md:auto-rows-[18rem]">
          {items.map((item, i) => (
            <BentoGridItem
              key={i}
              title={item.title}
              description={item.description}
              header={item.header}
              className={item.className}
            />
          ))}
        </BentoGrid>
      </main>

      <Footer />
    </div>
  );
}
