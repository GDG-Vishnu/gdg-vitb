"use client";

import React from "react";

export default function AboutSection() {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function renderDesktop() {
    return (
      <div className="max-w-7xl mx-auto rounded-[32px] overflow-hidden bg-[#111111] px-6 md:px-12 lg:px-20 py-8 md:py-14">
        <div className="relative rounded-[32px]">
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)`,
              backgroundSize: "20px 20px, 40px 40px",
              backgroundPosition: "0 0, 10px 10px",
              opacity: 1,
              pointerEvents: "none",
              borderRadius: 28,
            }}
          />

          <div className="relative z-10 flex items-center gap-6">
            <div className="flex-shrink-0" style={{ width: 96 }}>
              <img
                src="https://res.cloudinary.com/dlupkibvq/image/upload/v1760852197/Group_88_inuttu.png"
                alt="decorative"
                className="w-20 h-20 md:w-32 md:h-32 object-contain"
                style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.5))" }}
              />
            </div>

            <div className="flex-1 text-center">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-6">
                About GDG-VITB
              </h2>
              <p className="text-base md:text-lg text-stone-300 md:max-w-4xl max-w-3xl mx-auto">
                GDG On Campus – Vishnu Institute Of Technology, Bhimavaram Is A
                Student Community That Creates Opportunities For Aspiring
                Developers To Learn, Practice, And Grow With Technology. We
                Organize Workshops, Hackathons, And Tech Sessions That Provide
                Hands-On Experience And Help Students Build Essential Skills For
                A Strong Career In Tech. Being Part Of This Community Also
                Connects Our Students To The Larger Global GDG Network.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderMobile() {
    return (
      <div className="max-w-3xl mx-auto rounded-[20px] overflow-hidden bg-[#111111] px-4 py-6">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)`,
            backgroundSize: "20px 20px, 40px 40px",
            backgroundPosition: "0 0, 10px 10px",
            opacity: 1,
            pointerEvents: "none",
            borderRadius: 20,
          }}
        />

        <div className="relative z-10 flex flex-col items-center gap-4 text-center">
          <img
            src="https://res.cloudinary.com/duvr3z2z0/image/upload/v1760665020/Group_88_p5bl7h.png"
            alt="decorative"
            className="w-20 h-20 object-contain"
            style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.5))" }}
          />
          <h2 className="text-2xl font-semibold text-white">About GDG-VITB</h2>
          <p className="text-sm text-stone-300">
            GDG On Campus – Vishnu Institute Of Technology, Bhimavaram Is A
            Student Community That Creates Opportunities For Aspiring Developers
            To Learn, Practice, And Grow With Technology. We Organize Workshops,
            Hackathons, And Tech Sessions That Provide Hands-On Experience And
            Help Students Build Essential Skills For A Strong Career In Tech.
            Being Part Of This Community Also Connects Our Students To The
            Larger Global GDG Network.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full px-4 py-10">
      {isMobile ? renderMobile() : renderDesktop()}
    </section>
  );
}
