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
    "id": 1,
    "imageUrl": "https://res.cloudinary.com/dlupkibvq/image/upload/v1767165297/nnpeqla0vy1pm2ftqt7r.jpg",
    "uploadedAt": "2025-12-31"
  },
  {
    "id": 2,
    "imageUrl": "https://res.cloudinary.com/dlupkibvq/image/upload/v1767165369/cg2qaevdj9juoxes015s.jpg",
    "uploadedAt": "2025-12-31"
  },
  {
    "id": 3,
    "imageUrl": "https://res.cloudinary.com/dlupkibvq/image/upload/v1767165428/zffvckhjitt9hqudyxrs.jpg",
    "uploadedAt": "2025-12-31"
  },
  {
    "id": 4,
    "imageUrl": "https://res.cloudinary.com/dlupkibvq/image/upload/v1767165472/y5anut1yhwcekgd25m21.jpg",
    "uploadedAt": "2025-12-31"
  },
  {
    "id": 5,
    "imageUrl": "https://res.cloudinary.com/dlupkibvq/image/upload/v1767165592/nikdkhhnvvszxicl427o.jpg",
    "uploadedAt": "2025-12-31"
  },
  {
    "id": 6,
    "imageUrl": "https://res.cloudinary.com/dlupkibvq/image/upload/v1767165620/ofzu1a2lxxpftwgynmtg.jpg",
    "uploadedAt": "2025-12-31"
  },
  {
    "id": 7,
    "imageUrl": "https://res.cloudinary.com/dlupkibvq/image/upload/v1767165671/s6bp1di12zvdghmr1w0w.jpg",
    "uploadedAt": "2025-12-31"
  },
  {
    "id": 8,
    "imageUrl": "https://res.cloudinary.com/dlupkibvq/image/upload/v1767165713/uzhlycorvyzrwfwf3okb.jpg",
    "uploadedAt": "2025-12-31"
  },
  {
    "id": 9,
    "imageUrl": "https://res.cloudinary.com/dlupkibvq/image/upload/v1767165807/kpjvewqs1s3lw4nmmdfj.jpg",
    "uploadedAt": "2025-12-31"
  },
  {
    "id": 10,
    "imageUrl": "https://res.cloudinary.com/dlupkibvq/image/upload/v1767170078/gji3tk1hm1qd7k7wvknb.jpg",
    "uploadedAt": "2025-12-31"
  },
  {
    "id": 11,
    "imageUrl": "https://res.cloudinary.com/dlupkibvq/image/upload/v1767170128/i3d8b8qtgb7kbfamuxy3.jpg",
    "uploadedAt": "2025-12-31"
  },
  {
    "id": 12,
    "imageUrl": "https://res.cloudinary.com/dlupkibvq/image/upload/v1767170171/ppgkbul5ng3iuanjm1fw.jpg",
    "uploadedAt": "2025-12-31"
  },
  {
    "id": 13,
    "imageUrl": "https://res.cloudinary.com/dlupkibvq/image/upload/v1767170250/zzb9ndsaftyp2ejztxb5.jpg",
    "uploadedAt": "2025-12-31"
  },
  {
    "id": 14,
    "imageUrl": "https://res.cloudinary.com/dlupkibvq/image/upload/v1767170356/pisuxpm8ixsrlksyb32b.jpg",
    "uploadedAt": "2025-12-31"
  },
  {
    "id": 15,
    "imageUrl": "https://res.cloudinary.com/dlupkibvq/image/upload/v1767170427/ctyuvukbhwlnamqv0fhi.jpg",
    "uploadedAt": "2025-12-31"
  },
  {
    "id": 16,
    "imageUrl": "https://res.cloudinary.com/dlupkibvq/image/upload/v1767170501/joat26rbj3rb0kdja0ue.jpg",
    "uploadedAt": "2025-12-31"
  },
  {
    "id": 17,
    "imageUrl": "https://res.cloudinary.com/dlupkibvq/image/upload/v1767170551/sghz2b8xtbolh90rj6ye.jpg",
    "uploadedAt": "2025-12-31"
  },
  {
    "id": 18,
    "imageUrl": "https://res.cloudinary.com/dlupkibvq/image/upload/v1767175376/hxmbw2efjqqlnv5rqaju.jpg",
    "uploadedAt": "2025-12-31"
  },
  {
    "id": 19,
    "imageUrl": "https://res.cloudinary.com/dlupkibvq/image/upload/v1767175409/atnhxkbbmmfdlndva2yl.jpg",
    "uploadedAt": "2025-12-31"
  },
  {
    "id": 20,
    "imageUrl": "https://res.cloudinary.com/dlupkibvq/image/upload/v1767175448/cowcmznegnsmmxfgfx0g.jpg",
    "uploadedAt": "2025-12-31"
  },
  {
    "id": 21,
    "imageUrl": "https://res.cloudinary.com/dlupkibvq/image/upload/v1767175476/ykn4vverhmegtgb7cxob.jpg",
    "uploadedAt": "2025-12-31"
  },
  {
    "id": 22,
    "imageUrl": "https://res.cloudinary.com/dlupkibvq/image/upload/v1767175586/qszi90pqw0gbhxdruxbn.png",
    "uploadedAt": "2025-12-31"
  },
  {
    "id": 23,
    "imageUrl": "https://res.cloudinary.com/dlupkibvq/image/upload/v1767175612/jxsg0t4bozchigoqodga.png",
    "uploadedAt": "2025-12-31"
  },
  {
    "id": 24,
    "imageUrl": "https://res.cloudinary.com/dlupkibvq/image/upload/v1767175693/f7gerxglae9pomxppanb.png",
    "uploadedAt": "2025-12-31"
  },
  {
    "id": 25,
    "imageUrl": "https://res.cloudinary.com/dlupkibvq/image/upload/v1767175729/aiokkm8bvl3olshgxbjq.png",
    "uploadedAt": "2025-12-31"
  },
  {
    "id": 26,
    "imageUrl": "https://res.cloudinary.com/dlupkibvq/image/upload/v1767175768/zchh9p44afv0ed0wlxoh.jpg",
    "uploadedAt": "2025-12-31"
  },
  {
    "id": 27,
    "imageUrl": "https://res.cloudinary.com/dlupkibvq/image/upload/v1767175818/nrei8nrsar4iio30ukkh.jpg",
    "uploadedAt": "2025-12-31"
  }
]


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
