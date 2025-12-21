import React, { useEffect, useRef, useState } from "react";

function ExtensionSection() {
  const data = [
    {
      title: "Hands-On Workshops",
      description:
        " Practical Web, Android, Cloud, and AI/ML workshops guided by mentors.",
      imgUrl:
        "https://res.cloudinary.com/duvr3z2z0/image/upload/v1764836601/Group_226_nsnnro.png",
    },
    {
      title: "Collaborate & Connect",
      description:
        "  Connect with students, seniors, and professionals to support your tech journey.",
      imgUrl:
        "https://res.cloudinary.com/duvr3z2z0/image/upload/v1764835077/Group_232_q5bjxk.png",
    },
    {
      title: "Skill Development",
      description:
        " Participate in tech sessions that enhance your skills and problem-solving.",
      imgUrl:
        "https://res.cloudinary.com/duvr3z2z0/image/upload/v1764836603/Group_227_mgrozh.png",
    },
    {
      title: "Tech Competitions",
      description:
        "Participate in hackathons, coding challenges, and design jams that enhance your skills.",
      imgUrl:
        "https://res.cloudinary.com/duvr3z2z0/image/upload/v1764835076/Group_231_ap452q.png",
    },
  ];

  return (
    <div
      className="flex flex-col justify-around items-around w-full my-20 mx-4 md:mx-20 lg:mx-40 space-y-10 relative"
      style={{ background: "#F8D8D8" }}
    >
      {/* Background decoration */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(rgba(0,0,0,0.08) 1px, transparent 1px), radial-gradient(rgba(0,0,0,0.04) 1px, transparent 1px)`,
          backgroundSize: "25px 25px, 50px 50px",
          backgroundPosition: "0 0, 12px 12px",
          opacity: 0.6,
          pointerEvents: "none",
        }}
      />

      {/* Floating decorative elements */}
      <div className="hidden md:block absolute top-10 left-10 text-blue-500 opacity-20">
        <div className="w-8 h-8 border-2 border-current transform rotate-12"></div>
      </div>
      <div className="hidden md:block absolute top-20 right-20 text-red-400 opacity-25">
        <div className="w-6 h-6 bg-current rounded-full"></div>
      </div>
      <div className="hidden md:block absolute bottom-16 left-16 text-green-400 opacity-20">
        <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-current transform -rotate-12"></div>
      </div>
      <div className="hidden md:block absolute bottom-10 right-12 text-yellow-400 opacity-25">
        <div className="w-7 h-7 border-2 border-current rounded-full transform rotate-45"></div>
      </div>

      <h1 className="text-center text-stone-950 text-4xl font-semibold relative z-10 font-productSans">
        Why Join GDG VITB?
      </h1>

      <div className="grid grid-cols-2 gap-4 md:flex md:flex-row md:justify-center md:items-center md:space-y-0 md:space-x-10 w-full relative z-10">
        {data.map((item, index) => (
          <Card
            key={index}
            title={item.title}
            description={item.description}
            imgUrl={item.imgUrl}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Card:
 * - fades in and slides up when it enters the viewport
 * - scales slightly on hover
 */
function Card({
  title,
  description,
  imgUrl,
}: {
  title: string;
  description: string;
  imgUrl: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            // unobserve after visible to avoid repeated triggers
            if (el) obs.unobserve(el);
          }
        });
      },
      { threshold: 0.18 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`flex flex-col justify-between items-center border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-2xl p-3 md:p-6 w-full md:max-w-[313px] h-[200px] md:h-[414px] bg-white 
        transform transition-all duration-300 ease-out
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
        hover:-translate-x-2 hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]`}
      style={{ willChange: "transform, opacity" }}
    >
      <div className="w-16 h-16 md:w-40 md:h-40 flex-shrink-0 flex items-center justify-center overflow-hidden ">
        <img
          src={imgUrl}
          alt={title}
          className="w-full h-full object-contain transform transition-transform duration-200 ease-out hover:scale-105 filter contrast-125"
        />
      </div>

      <div className="flex flex-col items-center justify-center space-y-1 md:space-y-2 flex-grow">
        <h2 className="text-lg md:text-xl font-semibold text-stone-950 text-center font-productSans leading-tight px-2">
          {title}
        </h2>
        <p className="text-xs md:text-base text-center text-stone-950 font-productSans hidden md:block leading-relaxed px-2">
          {description}
        </p>
      </div>
    </div>
  );
}

export default ExtensionSection;
