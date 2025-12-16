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
    imageUrl: "https://res.cloudinary.com/dlupkibvq/image/upload/v1765644843/tiina4na7p09shhclzgl.jpg",
    uploadedAt: new Date(2024, 0, 1, 10, 0, 0).toISOString()
  },
  {
    id: 2,
    imageUrl: "https://res.cloudinary.com/dlupkibvq/image/upload/v1765644848/abwizyefk9rzir2pobbf.jpg",
    uploadedAt: new Date(2024, 0, 2, 11, 0, 0).toISOString()
  },
  {
    id: 3,
    imageUrl: "https://res.cloudinary.com/dlupkibvq/image/upload/v1765644856/yg4p8a6xhfm92rwoxdqa.jpg",
    uploadedAt: new Date(2024, 0, 3, 12, 0, 0).toISOString()
  },
  {
    id: 4,
    imageUrl: "https://res.cloudinary.com/dlupkibvq/image/upload/v1765644890/bdiewilbgzee4odot1fk.jpg",
    uploadedAt: new Date(2024, 0, 4, 13, 0, 0).toISOString()
  },
  {
    id: 5,
    imageUrl: "https://res.cloudinary.com/dlupkibvq/image/upload/v1765644897/evcruet79ibseuz7nwah.jpg",
    uploadedAt: new Date(2024, 0, 5, 14, 0, 0).toISOString()
  },
  {
    id: 6,
    imageUrl: "https://res.cloudinary.com/dlupkibvq/image/upload/v1765644911/sv8r7than899likaob4d.jpg",
    uploadedAt: new Date(2024, 0, 6, 15, 0, 0).toISOString()
  },
  {
    id: 7,
    imageUrl: "https://res.cloudinary.com/dlupkibvq/image/upload/v1765644924/oykhw6xytohke2in6j96.jpg",
    uploadedAt: new Date(2024, 0, 7, 16, 0, 0).toISOString()
  },
  {
    id: 8,
    imageUrl: "https://res.cloudinary.com/dlupkibvq/image/upload/v1765644926/f3nvhejvprgqocfh3w2i.jpg",
    uploadedAt: new Date(2024, 0, 8, 17, 0, 0).toISOString()
  },
  {
    id: 9,
    imageUrl: "https://res.cloudinary.com/dlupkibvq/image/upload/v1765644920/zgucxpwzajjx9itwsons.jpg",
    uploadedAt: new Date(2024, 0, 9, 18, 0, 0).toISOString()
  },
  {
    id: 10,
    imageUrl: "https://res.cloudinary.com/dlupkibvq/image/upload/v1765884378/r3z8gswnm71c7j4az9jd.jpg",
    uploadedAt: new Date(2024, 0, 10, 10, 0, 0).toISOString()
  },
  {
    id: 11,
    imageUrl: "https://res.cloudinary.com/dlupkibvq/image/upload/v1765884378/rj5cygcm9ibcfjov83dr.jpg",
    uploadedAt: new Date(2024, 0, 11, 11, 0, 0).toISOString()
  },
  {
    id: 12,
    imageUrl: "https://res.cloudinary.com/dlupkibvq/image/upload/v1765884378/zwka8pdngbkqcxtmzega.jpg",
    uploadedAt: new Date(2024, 0, 12, 12, 0, 0).toISOString()
  },
  {
    id: 13,
    imageUrl: "https://res.cloudinary.com/dlupkibvq/image/upload/v1765884643/fwpxk1hoyqeimzjepbpu.jpg",
    uploadedAt: new Date(2024, 0, 13, 13, 0, 0).toISOString()
  },
  {
    id: 14,
    imageUrl: "https://res.cloudinary.com/dlupkibvq/image/upload/v1765884643/erhimwqvyuc7hr2w1jfs.jpg",
    uploadedAt: new Date(2024, 0, 14, 14, 0, 0).toISOString()
  },
  {
    id: 15,
    imageUrl: "https://res.cloudinary.com/dlupkibvq/image/upload/v1765885175/pkahrrz6o2foywtdkzvc.jpg",
    uploadedAt: new Date(2024, 0, 15, 15, 0, 0).toISOString()
  },
  {
    id: 16,
    imageUrl: "https://res.cloudinary.com/dlupkibvq/image/upload/v1765885219/lttvpt2caqx16yhzhrot.jpg",
    uploadedAt: new Date(2024, 0, 16, 16, 0, 0).toISOString()
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
