"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/app/client/Home/navbar";
import Footer from "@/components/footer/Footer";
import { Camera, ArrowLeft, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
// LightGallery integration
import LightGallery from "lightgallery/react";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/css/lg-zoom.css";
type GalleryItem = {
  id: number;
  imageUrl: string;
  uploadedAt: string;
};
// Sample gallery items with curated images
const sampleGalleryItems: GalleryItem[] = [
  {
    id: 1,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1766121072/cdwplwcgzswuzt6dmvyh.jpg",
    uploadedAt: "2025-12-19",
  },
  {
    id: 2,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1766121072/jalxke80kptiayk9lfot.jpg",
    uploadedAt: "2025-12-19",
  },
  {
    id: 3,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1766121072/hegcgmel1d7ionmjnpg1.jpg",
    uploadedAt: "2025-12-19",
  },
  {
    id: 4,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1766121072/xrehxswonqbmlwn3cbg5.jpg",
    uploadedAt: "2025-12-19",
  },
];

function Gallery() {
  const [galleryItems, setGalleryItems] =
    useState<GalleryItem[]>(sampleGalleryItems);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-100 hover:text-gray-200 transition mb-6 bg-stone-900 p-2 rounded-4xl"
          >
            <ArrowLeft className="w-6 h-6 text-stone-950 rounded-full hover:rotate-2 bg-blue-500 " />
            <p className="hidden lg:block font-productSans">Back to Home</p>
          </Link>

          {/* Gallery Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center items-center gap-4 mb-4">
              <Camera className="w-12 h-12 text-blue-600" />
              <h1 className="text-4xl md:text-6xl font-bold text-stone-900 font-productSans">
                Gallery
              </h1>
            </div>
            <p className="text-stone-600 text-lg md:text-xl max-w-2xl mx-auto font-productSans">
              Explore our collection of memorable moments and experiences
            </p>
          </div>

          {/* Gallery Images */}
          {galleryItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <ImageIcon className="w-24 h-24 text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg font-productSans">
                No images available in the gallery
              </p>
            </div>
          ) : (
            <div className="hide-scrollbar">
              <LightGallery speed={500} plugins={[lgThumbnail, lgZoom]}>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {galleryItems.map((item) => (
                    <a
                      href={item.imageUrl}
                      key={item.id}
                      className="overflow-hidden rounded-lg block lg-trigger"
                      data-src={item.imageUrl}
                      data-lg-size="1600-900"
                      data-sub-html={`<h4>Uploaded: ${item.uploadedAt}</h4>`}
                    >
                      <img
                        src={item.imageUrl}
                        alt={`Gallery image ${item.id}`}
                        className="w-full h-60 object-cover"
                      />
                    </a>
                  ))}
                </div>
              </LightGallery>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Gallery;
