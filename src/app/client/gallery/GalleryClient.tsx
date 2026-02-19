"use client";

import React, { useEffect, useState } from "react";
//Navbar removed
import Footer from "@/components/footer/Footer";
import {
  Camera,
  Image as ImageIcon,
  Sparkles,
  Users,
  Star,
} from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import NextJsImage from "@/components/NextJsImage";
import Image from "next/image";

export type GalleryItem = {
  id: number;
  imageUrl: string;
  uploadedAt: string;
};

interface GalleryProps {
  initialItems: GalleryItem[];
}

function Gallery({ initialItems = [] }: GalleryProps) {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(initialItems);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Cover image URL - replace this with your actual cover image URL
  const coverImageUrl =
    "https://res.cloudinary.com/dlupkibvq/image/upload/v1767175693/f7gerxglae9pomxppanb.png";
  return (
    <div
      className="min-h-screen bg-white"
      style={{
        backgroundColor: "white",
        backgroundImage: `linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)`,
        backgroundSize: "20px 20px",
      }}
    >
      {/* Navbar removed */}
      {/* Team Title Section */}

      <main className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
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
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {galleryItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="overflow-hidden rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => {
                      setLightboxIndex(index);
                      setLightboxOpen(true);
                    }}
                  >
                    <Image
                      src={item.imageUrl}
                      alt={`Gallery image ${item.id}`}
                      width={400}
                      height={300}
                      className="w-full h-60 object-cover"
                    />
                  </div>
                ))}
              </div>

              <Lightbox
                open={lightboxOpen}
                close={() => setLightboxOpen(false)}
                index={lightboxIndex}
                slides={galleryItems.map((item) => ({
                  src: item.imageUrl,
                  width: 1600,
                  height: 900,
                }))}
                plugins={[Thumbnails]}
                render={{ slide: NextJsImage }}
              />
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Gallery;