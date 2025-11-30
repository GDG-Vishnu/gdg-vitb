"use client";

import React, { useRef } from "react";
import Link from "next/link";

type EventItem = {
  id: string;
  title: string;
  image?: string;
  ctacolor?: string;
};

const sampleEvents: EventItem[] = [
  {
    id: "e1",
    title: "Hackatron",
    image:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1760852134/Frame_56_z0oyf0.png",
    ctacolor: "pink",
  },
  {
    id: "e2",
    title: "Kode Kuru Kshetra",

    image:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1760852185/Frame_56_1_cjtstq.png",
    ctacolor: "yellow",
  },

  {
    id: "e3",
    title: "GENISIS",
    image:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1760852218/Frame_56_2_yuagvz.png",
    ctacolor: "black",
  },
];

export default function EventsCarousel() {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
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
      <div
        ref={scrollerRef}
        className="no-scrollbar flex overflow-x-auto px-4 py-3 snap-x snap-mandatory"
        style={{ scrollPadding: "1.5rem", gap: "14px" }}
      >
        {sampleEvents.map((ev) => (
          <EventCard key={ev.id} event={ev} />
        ))}
      </div>
    );
  }

  function renderMobile() {
    return (
      <div
        ref={scrollerRef}
        className="no-scrollbar flex overflow-x-auto px-4 snap-x snap-mandatory"
        style={{ scrollPadding: "1rem", gap: "12px" }}
      >
        {sampleEvents.map((ev) => (
          <EventCardMobile key={ev.id} event={ev} />
        ))}
      </div>
    );
  }

  return (
    <section className="w-full py-10">
      {isMobile ? renderMobile() : renderDesktop()}
    </section>
  );
}

function EventCard({ event }: { event: EventItem }) {
  return (
    <article
      className="bg-transparent shadow-md snap-start overflow-hidden"
      style={{
        width: 500,
        height: 472,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "#000",
        borderRadius: 50,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "transparent",
      }}
    >
      {event.image && (
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "transparent",
            overflow: "hidden",
          }}
        >
          <img
            src={event.image}
            alt={event.title}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        </div>
      )}

      <div style={{ padding: 30 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div>
            <h3 className="text-2xl font-semibold text-stone-950">
              {event.title}
            </h3>
          </div>

          <div>
            {(() => {
              const color = event.ctacolor || "pink";
              let bgClass = "bg-pink-500 hover:bg-pink-600 text-white";
              if (color === "yellow")
                bgClass = "bg-yellow-400 hover:bg-yellow-500 text-black";
              if (color === "black")
                bgClass = "bg-black hover:bg-gray-800 text-white";

              return (
                <Link
                  href={`/events/${event.id}`}
                  aria-label={`Open ${event.title}`}
                  className={`${bgClass} rounded-full flex items-center justify-center shadow-lg`}
                  style={{
                    width: 56,
                    height: 56,
                    fontSize: 18,
                    display: "inline-flex",
                  }}
                >
                  <img
                    src="https://res.cloudinary.com/duvr3z2z0/image/upload/v1760609469/Arrow_left_3x_dte4bu.png"
                    alt=""
                  />
                </Link>
              );
            })()}
          </div>
        </div>
      </div>
    </article>
  );
}

function EventCardMobile({ event }: { event: EventItem }) {
  return (
    <article
      className="bg-transparent shadow-md overflow-hidden rounded-2xl flex-shrink-0 snap-start"
      style={{
        width: 280,
        minWidth: 280,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "#000",
        borderRadius: 28,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "transparent",
      }}
    >
      {event.image && (
        <div
          style={{
            height: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "transparent",
            overflow: "hidden",
          }}
        >
          <img
            src={event.image}
            alt={event.title}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        </div>
      )}

      <div style={{ padding: 20 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div>
            <h3 className="text-lg font-semibold text-stone-950">
              {event.title}
            </h3>
          </div>

          <div>
            {(() => {
              const color = event.ctacolor || "pink";
              let bgClass = "bg-pink-500 hover:bg-pink-600 text-white";
              if (color === "yellow")
                bgClass = "bg-yellow-400 hover:bg-yellow-500 text-black";
              if (color === "black")
                bgClass = "bg-black hover:bg-gray-800 text-white";

              return (
                <Link
                  href={`/events/${event.id}`}
                  aria-label={`Open ${event.title}`}
                  className={`${bgClass} rounded-full flex items-center justify-center shadow-lg`}
                  style={{
                    width: 48,
                    height: 48,
                    fontSize: 16,
                    display: "inline-flex",
                  }}
                >
                  <img
                    src="https://res.cloudinary.com/duvr3z2z0/image/upload/v1760609469/Arrow_left_3x_dte4bu.png"
                    alt=""
                  />
                </Link>
              );
            })()}
          </div>
        </div>
      </div>
    </article>
  );
}
