"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/app/client/Home/navbar";
import Footer from "@/components/footer/Footer";
import { Camera, ArrowLeft, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { ParallaxScroll } from "@/components/ui/parallax-scroll";

type GalleryItem = {
  id: number;
  imageUrl: string;
  uploadedAt: string;
};

// Sample gallery items with curated images
const sampleGalleryItems: GalleryItem[] = [
  {
    id: 1,
    imageUrl: "https://res.cloudinary.com/dlupkibvq/image/upload/ikjbkdsqwcgf4bwbqv3m",
    uploadedAt: "2024-01-15T10:30:00Z"
  },
  {
    id: 2,
    imageUrl: "https://res.cloudinary.com/dlupkibvq/image/upload/mqtjtemmd5xrnimqb053",
    uploadedAt: "2024-01-16T14:45:00Z"
  },
  {
    id: 3,
    imageUrl: "https://res.cloudinary.com/dlupkibvq/image/upload/zveegnqhtdzwcr1xpoyz",
    uploadedAt: "2024-01-17T09:15:00Z"
  },
  {
    id: 4,
    imageUrl: "https://res.cloudinary.com/dlupkibvq/image/upload/f3nvhejvprgqocfh3w2i",
    uploadedAt: "2024-01-18T16:20:00Z"
  },
  {
    id: 5,
    imageUrl: "https://res.cloudinary.com/dlupkibvq/image/upload/oykhw6xytohke2in6j96",
    uploadedAt: "2024-01-19T11:30:00Z"
  },
  {
    id: 6,
    imageUrl: "https://res.cloudinary.com/dlupkibvq/image/upload/ooyji7eajkyjvjkiuy6k",
    uploadedAt: "2024-01-20T08:45:00Z"
  },
  {
    id: 7,
    imageUrl: "https://res.cloudinary.com/dlupkibvq/image/upload/omaqtjgvhiyuiu0jxnxp",
    uploadedAt: "2024-01-21T13:10:00Z"
  },
  {
    id: 8,
    imageUrl: "https://res.cloudinary.com/dlupkibvq/image/upload/zgucxpwzajjx9itwsons",
    uploadedAt: "2024-01-22T15:25:00Z"
  },
  {
    id: 9,
    imageUrl: "https://res.cloudinary.com/dlupkibvq/image/upload/knpv42zoexevpfgl7vcp",
    uploadedAt: "2024-01-23T12:40:00Z"
  },
  {
    id: 10,
    imageUrl: "https://res.cloudinary.com/dlupkibvq/image/upload/v0grrxy5ahd8kyb2kxzv",
    uploadedAt: "2024-01-24T17:55:00Z"
  },
  {
    id: 11,
    imageUrl: "https://res.cloudinary.com/dlupkibvq/image/upload/uynaqaqygb5pned9otsp",
    uploadedAt: "2024-01-25T10:20:00Z"
  },
  {
    id: 12,
    imageUrl: "https://res.cloudinary.com/dlupkibvq/image/upload/v1765644911/sv8r7than899likaob4d.jpg",
    uploadedAt: "2024-01-26T14:35:00Z"
  },
  {
    id: 13,
    imageUrl: "https://res.cloudinary.com/dlupkibvq/image/upload/v1765644894/omjmymgm0ilfjof32h8g.jpg",
    uploadedAt: "2024-01-27T09:50:00Z"
  },
  {
    id: 14,
    imageUrl: "https://res.cloudinary.com/dlupkibvq/image/upload/v1765644891/bglnju9ouvgwuyjyoxuh.jpg",
    uploadedAt: "2024-01-28T16:05:00Z"
  },
  {
    id: 15,
    imageUrl: "https://res.cloudinary.com/dlupkibvq/image/upload/v1765644890/bdiewilbgzee4odot1fk.jpg",
    uploadedAt: "2024-01-29T11:20:00Z"
  },
  {
    id: 16,
    imageUrl: "https://res.cloudinary.com/dlupkibvq/image/upload/v1765644887/qfpitj6fxngwmk2bcvgi.jpg",
    uploadedAt: "2024-01-30T08:35:00Z"
  },
  {
    id: 17,
    imageUrl: "https://res.cloudinary.com/dlupkibvq/image/upload/v1765644886/zrdhk0lmbf2zpqwwriwm.jpg",
    uploadedAt: "2024-02-01T13:50:00Z"
  },
  {
    id: 18,
    imageUrl: "https://res.cloudinary.com/dlupkibvq/image/upload/v1765644878/qurgwgqfjhvujays1uhh.jpg",
    uploadedAt: "2024-02-02T15:05:00Z"
  },
  {
    id: 19,
    imageUrl: "https://res.cloudinary.com/dlupkibvq/image/upload/v1765644876/ziv04siuykktlwldxnhq.jpg",
    uploadedAt: "2024-02-03T12:20:00Z"
  },
  {
    id: 20,
    imageUrl: "https://res.cloudinary.com/dlupkibvq/image/upload/v1765644872/r9xqol14s4rtgtugai7x.jpg",
    uploadedAt: "2024-02-04T17:35:00Z"
  },
  {
    id: 21,
    imageUrl: "https://res.cloudinary.com/dlupkibvq/image/upload/v1765644869/wzmpmfypcpd0mn5ggzhg.jpg",
    uploadedAt: "2024-02-05T10:50:00Z"
  },
  {
    id: 22,
    imageUrl: "https://res.cloudinary.com/dlupkibvq/image/upload/v1765644864/d8sz7fn2m8r4r8cyuad9.jpg",
    uploadedAt: "2024-02-06T14:05:00Z"
  }
];

function Gallery() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(sampleGalleryItems);


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
            <ArrowLeft className="w-6 h-6 text-stone-950 rounded-full hover:rotate-2 bg-blue-500" />
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
            // Parallax scroll layout for all images
            <ParallaxScroll
              images={galleryItems.map((item) => item.imageUrl)}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Gallery;
