"use client";

import React, { useCallback, useEffect, useState } from "react";
//Navbar removed
import Footer from "@/components/footer/Footer";
import { Camera, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";
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
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1771301326/ctv8yn9y6xaczodyjo0c.jpg",
    uploadedAt: "2025-12-31",
  },
  {
    id: 2,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767086900/prompt%20engineering/tk3aakahjoxsimjvidgm.jpg",

    uploadedAt: "2025-12-31",
  },

  {
    id: 3,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1765644013/mggyknteqkhgkb2w3grz.jpg",

    uploadedAt: "2025-12-31",
  },

  {
    id: 4,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767165297/nnpeqla0vy1pm2ftqt7r.jpg",
    uploadedAt: "2025-12-31",
  },

  {
    id: 5,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1771301326/gzruxxa5nyohbu9e1s7i.jpg",
    uploadedAt: "2025-12-31",
  },
  {
    id: 6,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1771301325/bdkiturqrivu4rmzkmnl.jpg",
    uploadedAt: "2025-12-31",
  },

  {
    id: 7,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767170501/joat26rbj3rb0kdja0ue.jpg",
    uploadedAt: "2025-12-31",
  },
  {
    id: 8,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767170551/sghz2b8xtbolh90rj6ye.jpg",
    uploadedAt: "2025-12-31",
  },

  {
    id: 9,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1766732847/uumcqlo3robkw70z9rhk.jpg",
    uploadedAt: "2025-12-31",
  },

  {
    id: 10,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1766732840/igrrs1fp9ag45hqzz64r.jpg",
    uploadedAt: "2025-12-31",
  },
  {
    id: 11,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767175612/jxsg0t4bozchigoqodga.png",
    uploadedAt: "2025-12-31",
  },
  {
    id: 12,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767175818/nrei8nrsar4iio30ukkh.jpg",
    uploadedAt: "2025-12-31",
  },
];

const PAGE_SIZE = 9;

function Gallery() {
  // Live data from GET /api/gallery/list (Firestore `gallery` collection,
  // public read). Falls back to bundled sample data if the API is unreachable
  // or the collection is unseeded.
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const loadGallery = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/gallery/list");
      if (!res.ok) throw new Error("Failed to fetch gallery");
      const data = await res.json();
      const list: GalleryItem[] = (Array.isArray(data) ? data : [])
        .filter((i) => i?.imageUrl)
        .map((i, idx) => ({
          id: typeof i.id === "number" ? i.id : idx + 1,
          imageUrl: String(i.imageUrl).trim(),
          uploadedAt: String(i.uploadedAt ?? ""),
        }))
        .filter((i) => i.imageUrl);
      const effective =
        list.length > 0
          ? list
          : sampleGalleryItems.map((item) => ({
              ...item,
              imageUrl: item.imageUrl.trim(),
            }));
      setGalleryItems(effective);
      setVisibleCount(PAGE_SIZE);
    } catch (err) {
      console.error(err);
      setGalleryItems(
        sampleGalleryItems.map((item) => ({
          ...item,
          imageUrl: item.imageUrl.trim(),
        })),
      );
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGallery();
  }, [loadGallery]);

  const visibleItems = galleryItems.slice(0, visibleCount);

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
          <motion.div
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center mb-12"
          >
            <div className="flex justify-center items-center gap-4 mb-4">
              <Camera className="w-12 h-12 text-blue-600" />
              <h1 className="text-4xl md:text-6xl font-bold text-stone-900 font-productSans">
                Gallery
              </h1>
            </div>
            <p className="text-stone-600 text-lg md:text-xl max-w-2xl mx-auto font-productSans">
              Explore our collection of memorable moments and experiences
            </p>
          </motion.div>

          {/* Gallery Images */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="bg-white border-4 border-black rounded-2xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-yellow-400 mx-auto mb-4" />
                <p className="text-black font-bold font-productSans text-lg">
                  Loading Gallery...
                </p>
              </div>
            </div>
          ) : galleryItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <ImageIcon className="w-24 h-24 text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg font-productSans">
                No images available in the gallery
              </p>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-2 border-black bg-yellow-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <p className="text-yellow-900 font-semibold text-sm font-productSans">
                    Live gallery unavailable ({error}), showing cached images.
                  </p>
                  <button
                    type="button"
                    onClick={() => loadGallery()}
                    className="px-4 py-2 bg-white text-black font-bold text-sm border-2 border-black font-productSans shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
                  >
                    Retry
                  </button>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {visibleItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    type="button"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.35,
                      delay: Math.min(index, 6) * 0.06,
                      ease: "easeOut",
                    }}
                    aria-label={`Open gallery image ${index + 1}`}
                    className="overflow-hidden rounded-lg cursor-pointer hover:opacity-90 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    onClick={() => {
                      setLightboxIndex(index);
                      setLightboxOpen(true);
                    }}
                  >
                    <Image
                      src={item.imageUrl}
                      alt={`GDG VITB event moment ${index + 1}`}
                      width={400}
                      height={300}
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="w-full h-60 object-cover"
                    />
                  </motion.button>
                ))}
              </div>

              {visibleCount < galleryItems.length ? (
                <div className="mt-8 text-center">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                    className="px-6 py-3 bg-white text-black font-bold border-2 border-black font-productSans shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
                  >
                    Show More ({galleryItems.length - visibleCount} more)
                  </button>
                </div>
              ) : (
                galleryItems.length > PAGE_SIZE && (
                  <div className="mt-8 text-center">
                    <button
                      type="button"
                      onClick={() => setVisibleCount(PAGE_SIZE)}
                      className="px-6 py-3 bg-white text-black font-bold border-2 border-black font-productSans shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
                    >
                      Show Less
                    </button>
                  </div>
                )
              )}

              <Lightbox
                open={lightboxOpen}
                close={() => setLightboxOpen(false)}
                index={lightboxIndex}
                slides={galleryItems.map((item) => ({
                  src: item.imageUrl,
                }))}
                plugins={[Thumbnails, Zoom]}
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
