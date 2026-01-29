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
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767165297/nnpeqla0vy1pm2ftqt7r.jpg",
    uploadedAt: "2025-12-31",
  },
  {
    id: 2,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767165369/cg2qaevdj9juoxes015s.jpg",
    uploadedAt: "2025-12-31",
  },
  {
    id: 3,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767165428/zffvckhjitt9hqudyxrs.jpg",
    uploadedAt: "2025-12-31",
  },
  {
    id: 4,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767165472/y5anut1yhwcekgd25m21.jpg",
    uploadedAt: "2025-12-31",
  },
  {
    id: 5,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767165592/nikdkhhnvvszxicl427o.jpg",
    uploadedAt: "2025-12-31",
  },
  {
    id: 6,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767165620/ofzu1a2lxxpftwgynmtg.jpg",
    uploadedAt: "2025-12-31",
  },
  {
    id: 7,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767165671/s6bp1di12zvdghmr1w0w.jpg",
    uploadedAt: "2025-12-31",
  },
  {
    id: 8,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767165713/uzhlycorvyzrwfwf3okb.jpg",
    uploadedAt: "2025-12-31",
  },
  {
    id: 9,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767165807/kpjvewqs1s3lw4nmmdfj.jpg",
    uploadedAt: "2025-12-31",
  },
  {
    id: 10,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767170078/gji3tk1hm1qd7k7wvknb.jpg",
    uploadedAt: "2025-12-31",
  },
  {
    id: 11,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767170128/i3d8b8qtgb7kbfamuxy3.jpg",
    uploadedAt: "2025-12-31",
  },
  {
    id: 12,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767170171/ppgkbul5ng3iuanjm1fw.jpg",
    uploadedAt: "2025-12-31",
  },
  {
    id: 13,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767170250/zzb9ndsaftyp2ejztxb5.jpg",
    uploadedAt: "2025-12-31",
  },
  {
    id: 14,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767170356/pisuxpm8ixsrlksyb32b.jpg",
    uploadedAt: "2025-12-31",
  },
  {
    id: 15,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767170427/ctyuvukbhwlnamqv0fhi.jpg",
    uploadedAt: "2025-12-31",
  },
  {
    id: 16,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767170501/joat26rbj3rb0kdja0ue.jpg",
    uploadedAt: "2025-12-31",
  },
  {
    id: 17,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767170551/sghz2b8xtbolh90rj6ye.jpg",
    uploadedAt: "2025-12-31",
  },
  {
    id: 18,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767175376/hxmbw2efjqqlnv5rqaju.jpg",
    uploadedAt: "2025-12-31",
  },
  {
    id: 19,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767175409/atnhxkbbmmfdlndva2yl.jpg",
    uploadedAt: "2025-12-31",
  },
  {
    id: 20,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767175448/cowcmznegnsmmxfgfx0g.jpg",
    uploadedAt: "2025-12-31",
  },
  {
    id: 21,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767175476/ykn4vverhmegtgb7cxob.jpg",
    uploadedAt: "2025-12-31",
  },
  {
    id: 22,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767175586/qszi90pqw0gbhxdruxbn.png",
    uploadedAt: "2025-12-31",
  },
  {
    id: 23,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767175612/jxsg0t4bozchigoqodga.png",
    uploadedAt: "2025-12-31",
  },
  {
    id: 24,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767175693/f7gerxglae9pomxppanb.png",
    uploadedAt: "2025-12-31",
  },
  {
    id: 25,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767175729/aiokkm8bvl3olshgxbjq.png",
    uploadedAt: "2025-12-31",
  },
  {
    id: 26,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767175768/zchh9p44afv0ed0wlxoh.jpg",
    uploadedAt: "2025-12-31",
  },
  {
    id: 27,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767175818/nrei8nrsar4iio30ukkh.jpg",
    uploadedAt: "2025-12-31",
  },
];

function Gallery() {
  const [galleryItems, setGalleryItems] =
    useState<GalleryItem[]>(sampleGalleryItems);
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

      {/* Decorative Background Elements */}
      {/* <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute top-40 right-20 w-32 h-32 bg-green-500/10 rounded-full blur-3xl"></div>
      <div className="absolute top-60 left-1/4 w-24 h-24 bg-yellow-500/10 rounded-full blur-3xl"></div>
      <div className="absolute top-80 right-1/3 w-28 h-28 bg-red-500/10 rounded-full blur-3xl"></div>

      <div className="relative"> */}
        {/* Title Section with Decorative Elements */}
        {/* <div className="text-center py-12 px-4 relative"> */}
          {/* Decorative Stars */}
          {/* <Star
            className="absolute top-8 left-1/4 w-6 h-6 text-yellow-400 animate-pulse"
            fill="currentColor"
          />
          <Star
            className="absolute top-12 right-1/4 w-8 h-8 text-blue-400 animate-pulse"
            fill="currentColor"
            style={{ animationDelay: "0.5s" }}
          />
          <Sparkles
            className="absolute top-16 left-1/3 w-7 h-7 text-green-400 animate-pulse"
            style={{ animationDelay: "1s" }}
          />
          <Sparkles
            className="absolute top-20 right-1/3 w-6 h-6 text-red-400 animate-pulse"
            style={{ animationDelay: "1.5s" }}
          /> */}

          {/* Main Title */}

          {/* <h1 className="text-5xl md:text-7xl lg:text-6xl font-bold text-stone-900 font-productSans mb-4 relative mr-2">
            <Users className="inline-block w-12 h-12 md:w-16 md:h-16 text-blue-600 mb-4" />
            GDG TEAM
            <span className="absolute -top-2 -right-8 w-4 h-4 bg-blue-500 rounded-full"></span>
            <span className="absolute -bottom-2 -left-8 w-3 h-3 bg-green-500 rounded-full"></span>
          </h1>
          <p className="text-3xl md:text-4xl lg:text-5xl font-semibold text-stone-700 font-productSans">
            (2025-26)
          </p> */}

          {/* Decorative Line */}
          {/* <div className="flex items-center justify-center gap-2 mt-6">
            <div className="w-16 h-1 bg-gradient-to-r from-transparent via-blue-500 to-blue-500 rounded-full"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="w-24 h-1 bg-blue-500 rounded-full"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="w-16 h-1 bg-gradient-to-l from-transparent via-green-500 to-green-500 rounded-full"></div>
          </div>
        </div> */}

        {/* Cover Section with Decorative Border */}
        {/* <div className="max-w-7xl mx-auto px-4 mb-12 relative"> */}
          {/* Decorative Corner Elements */}
          {/* <div className="absolute -top-4 -left-4 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-lg z-10"></div>
          <div className="absolute -top-4 -right-4 w-8 h-8 border-t-4 border-r-4 border-green-500 rounded-tr-lg z-10"></div>
          <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-4 border-l-4 border-yellow-500 rounded-bl-lg z-10"></div>
          <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-4 border-r-4 border-red-500 rounded-br-lg z-10"></div>

          <div className="relative w-full h-[55vh] md:h-[60vh] overflow-hidden rounded-3xl shadow-2xl border-4 border-white">
            <Image
              src={coverImageUrl}
              alt="GDG Team 2025-26 Cover"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div> */}

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
