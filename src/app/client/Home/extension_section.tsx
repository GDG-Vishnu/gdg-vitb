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
      className="flex flex-col justify-center items-center my-20 mx-4 md:mx-20 lg:mx-40 space-y-10"
      style={{ background: "#F8D8D8" }}
    >
      <h1 className="text-center text-stone-950 text-4xl font-semibold">
        Why Join GDG VITB?
      </h1>

      <div className="flex flex-col md:flex-row justify-center items-center space-y-10 md:space-y-0 md:space-x-10 w-full">
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
      className={`flex flex-col justify-around items-center space-y-4 border-2 border-black shadow-2xl rounded-2xl p-6 w-[313px] h-[414px] md:w-1/3 bg-white 
        transform transition-all duration-700 ease-out
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
        hover:scale-105 hover:shadow-2xl`}
      style={{ willChange: "transform, opacity", borderBottomRightRadius: 30 }}
    >
      <div className="w-40 h-40 flex items-center justify-center overflow-hidden ">
        <img
          src={imgUrl}
          alt={title}
          className="w-full h-full object-contain transform transition-transform duration-500 ease-out hover:scale-110"
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold text-stone-950 text-center font-productSans    ">
          {title}
        </h2>
        <p className="text-center text-stone-950 font-productSans">{description}</p>
      </div>
    </div>
  );
}

export default ExtensionSection;
