"use client";

import React, { useState } from "react";
import Navbar from "../Home/navbar";
import Footer from "@/components/footer/Footer";

// Sample gallery images - replace with actual Cloudinary URLs
const galleryImages = [
  {
    id: 1,
    src: "https://res.cloudinary.com/duvr3z2z0/image/upload/v1764914753/20250918_163601_1_gcbdyj.png",
    alt: "GDG Team Photo",
    title: "GDG Team",
  },
  {
    id: 2,
    src: "",
    alt: "GDG Event 2",
    title: "Workshop Session",
  },
  {
    id: 3,
    src: "",
    alt: "GDG Event 3",
    title: "Tech Talk",
  },
  {
    id: 4,
    src: "",
    alt: "GDG Event 4",
    title: "Hackathon",
  },
  {
    id: 5,
    src: "",
    alt: "GDG Event 5",
    title: "Coding Session",
  },
  {
    id: 6,
    src: "",
    alt: "GDG Event 6",
    title: "Community Meetup",
  },
  {
    id: 7,
    src: "",
    alt: "GDG Event 7",
    title: "Team Collaboration",
  },
  {
    id: 8,
    src: "",
    alt: "GDG Event 8",
    title: "Event Highlights",
  },
  {
    id: 9,
    src: "",
    alt: "GDG Event 9",
    title: "Workshop Day",
  },
];

function Gallery() {
  const [selectedImage, setSelectedImage] = useState<
    (typeof galleryImages)[0] | null
  >(null);

  return (
    <div
      className="min-h-screen bg-white relative overflow-hidden flex flex-col"
      style={{
        backgroundColor: "white",
        backgroundImage: `linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)`,
        backgroundSize: "20px 20px",
      }}
    >
      <Navbar />

      {/* Header Section */}
      <div className="my-8 flex  justify-center items-center w-full ">
        <div className="flex *:flex-1 justify-center items-center space-x-4">
          <img
            src="https://res.cloudinary.com/dlupkibvq/image/upload/v1760852060/Frame_60_soyopr.png"
            alt=""
            className="hidden md:block"
          />
          <img
            src="https://res.cloudinary.com/dlupkibvq/image/upload/v1760851996/Events_Star_eubbt3.png"
            alt=""
          />
          <h2
            className="text-6xl font-semibold text-stone-950"
            style={{
              fontFamily:
                '"Product Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
              fontWeight: 400,
              fontStyle: "normal",
              // Use a responsive clamp so the heading can scale and stay on one line across viewports

              lineHeight: "146%",
              letterSpacing: "0",
              textTransform: "capitalize",
              // leading-trim is not a standard CSS property in browsers; omitted
            }}
          >
            Events{" "}
          </h2>
          <img
            src="https://res.cloudinary.com/dlupkibvq/image/upload/v1760851996/Events_Star_eubbt3.png"
            alt=""
          />
          <img
            src="https://res.cloudinary.com/dlupkibvq/image/upload/v1760852060/Frame_60_soyopr.png"
            alt=""
            className="hidden md:block"
          />
        </div>
      </div>

      <p className="text-center text-stone-600 text-lg max-w-2xl mx-auto">
        Explore moments from our events, workshops, and community gatherings
      </p>

      {/* Bento Grid Gallery */}
      <div className="flex-1 px-4 md:px-8 lg:px-16 pb-20">
        <div className="w-full mx-auto flex flex-col gap-4 ">
          {/* Row 1: Full width large image */}

          <div
            className="relative group cursor-pointer overflow-hidden rounded-3xl bg-gray-200 
             h-[450px] md:h-[280px] w-full max-w-[1400px] mx-auto px-4"
            onClick={() =>
              galleryImages[0].src && setSelectedImage(galleryImages[0])
            }
          >
            {galleryImages[0].src ? (
              <>
                <div className="w-full h-full flex text-center">
                  <img
                    src={galleryImages[0].src}
                    alt={galleryImages[0].alt}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 
                      transition-opacity duration-300 flex items-end p-6"
                >
                  <h3 className="text-white font-semibold text-xl">
                    {galleryImages[0].title}
                  </h3>
                </div>
              </>
            ) : null}
          </div>

          {/* Row 2: 3 equal columns */}
          <div className="grid grid-cols-3 gap-4">
            {galleryImages.slice(1, 4).map((image) => (
              <div
                key={image.id}
                className="relative group cursor-pointer overflow-hidden rounded-3xl bg-gray-200 h-[160px] md:h-[200px]"
                onClick={() => image.src && setSelectedImage(image)}
              >
                {image.src ? (
                  <>
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <h3 className="text-white font-semibold text-lg">
                        {image.title}
                      </h3>
                    </div>
                  </>
                ) : null}
              </div>
            ))}
          </div>

          {/* Row 3: 3 equal columns */}
          <div className="grid grid-cols-3 gap-4">
            {galleryImages.slice(4, 7).map((image) => (
              <div
                key={image.id}
                className="relative group cursor-pointer overflow-hidden rounded-3xl bg-gray-200 h-[160px] md:h-[200px]"
                onClick={() => image.src && setSelectedImage(image)}
              >
                {image.src ? (
                  <>
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <h3 className="text-white font-semibold text-lg">
                        {image.title}
                      </h3>
                    </div>
                  </>
                ) : null}
              </div>
            ))}
          </div>

          {/* Row 4: 2 equal columns */}
          <div className="grid grid-cols-2 gap-4">
            {galleryImages.slice(7, 9).map((image) => (
              <div
                key={image.id}
                className="relative group cursor-pointer overflow-hidden rounded-3xl bg-gray-200 h-[160px] md:h-[200px]"
                onClick={() => image.src && setSelectedImage(image)}
              >
                {image.src ? (
                  <>
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <h3 className="text-white font-semibold text-lg">
                        {image.title}
                      </h3>
                    </div>
                  </>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white text-4xl hover:text-gray-300 transition-colors"
            >
              ×
            </button>
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="w-full h-full object-contain rounded-lg"
            />
            <h3 className="text-white text-center mt-4 text-xl font-semibold">
              {selectedImage.title}
            </h3>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Gallery;
