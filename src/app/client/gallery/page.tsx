"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/app/client/Home/navbar";
import Footer from "@/components/footer/Footer";
import { Camera, ArrowLeft, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import NextJsImage from "@/components/NextJsImage";
import Image from "next/image";
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
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1766732214/hbudu4fnafntixujeozk.jpg",
    uploadedAt: "2025-12-26",
  },
  {
    id: 2,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1766732855/uqnjprkr73n57j1rsnmt.jpg",
    uploadedAt: "2025-12-26",
  },
  {
    id: 3,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1766121072/jalxke80kptiayk9lfot.jpg",
    uploadedAt: "2025-12-19",
  },
  {
    id: 4,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1766732877/pc9yoqajyv3o8of9oj7o.jpg",
    uploadedAt: "2025-12-26",
  },
  {
    id: 5,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1766732866/rkk466mczmupxfj3ct1t.jpg",
    uploadedAt: "2025-12-26",
  },
  {
    id: 6,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1766121072/hegcgmel1d7ionmjnpg1.jpg",
    uploadedAt: "2025-12-19",
  },
  {
    id: 7,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1766732852/hbrjwld85k359b4gu894.jpg",
    uploadedAt: "2025-12-26",
  },
  {
    id: 8,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1766732878/rspee4puxidyx1e2i8mw.jpg",
    uploadedAt: "2025-12-26",
  },
  {
    id: 9,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1766732591/pevnxi9hwhx7j3bzdssu.jpg",
    uploadedAt: "2025-12-26",
  },
  {
    id: 10,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1766732871/to3qfaitbefngk4zu7b8.jpg",
    uploadedAt: "2025-12-26",
  },
  {
    id: 11,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1766731850/jeix8tecdqhy1colnu5i.jpg",
    uploadedAt: "2025-12-26",
  },
  {
    id: 12,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1766732206/gayyldq0jxepnlgil36r.jpg",
    uploadedAt: "2025-12-26",
  },
  {
    id: 13,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1766121072/xrehxswonqbmlwn3cbg5.jpg",
    uploadedAt: "2025-12-19",
  },
  {
    id: 14,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1766732592/os5brwvk4vaxf98ezlss.jpg",
    uploadedAt: "2025-12-26",
  },
  {
    id: 15,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1766732877/ztu9zsmmtp0isug5uhk7.jpg",
    uploadedAt: "2025-12-26",
  },
  {
    id: 16,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1766121072/cdwplwcgzswuzt6dmvyh.jpg",
    uploadedAt: "2025-12-19",
  },
  {
    id: 17,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1766732856/j9zkfmsglel7pkhmr3vp.jpg",
    uploadedAt: "2025-12-26",
  },
  {
    id: 18,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1766732878/rspee4puxidyx1e2i8mw.jpg",
    uploadedAt: "2025-12-26",
  },
];

function Gallery() {
  const [galleryItems, setGalleryItems] =
    useState<GalleryItem[]>(sampleGalleryItems);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  return (
    <div
      className="min-h-screen bg-white"
      style={{
        backgroundColor: "white",
        backgroundImage: `linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)`,
        backgroundSize: "20px 20px",
      }}
    >
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
                plugins={[Thumbnails,]}
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
