"use client";

import React, { useState } from "react";

const keyboardImg =
  "https://res.cloudinary.com/dlupkibvq/image/upload/v1760852227/Group_69_smmnyr.png";

const faqs = [
  "What Is GDG Vishnu Institute Of Technology?",
  "Who Can Join GDG Vishnu Institute Of Technology?",
  "What Specific Tech Areas Does GDG VITB Focus On?",
  "How Do I Stay Updated On Upcoming Events And Meetups?",
  "What Kind Of Impact Can I Make By Joining?",
];

const answers = [
  "GDG on Campus – Vishnu Institute of Technology, Bhimavaram is a student community that creates opportunities for aspiring developers to learn, practice, and grow with technology. We organize workshops, hackathons, and tech sessions that provide hands-on experience and help students build essential skills for a strong career in tech. Being part of this community also connects our students to the larger global GDG network.",
  "GDG Vishnu Institute of Technology welcomes all students who are eager to learn, grow, and contribute. Our community includes a wide range of technical and non-technical domains, allowing every member to find their space — whether in building technology or supporting creative and organizational efforts.",
  "Our focus areas include Web Development, Android, Cloud Computing, Artificial Intelligence, and Design. GDG VITB provides a platform for students to explore these technologies, gain practical skills, and collaborate on creative projects.",
  "Stay connected with us through our official GDG VITB Instagram page and GDG VITB LinkedIn page for the latest updates on events, workshops, and meetups. Follow us regularly to stay informed about exciting opportunities and community activities!",
  "By joining GDG Vishnu Institute of Technology, you become part of a community that learns, grows, and builds together. You’ll gain real-world experience, work with a passionate team, and drive projects that make a meaningful impact in the community.",
];

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="w-full py-12 px-4">
      <div className="max-w-[1500px] mx-auto flex items-center gap-8 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-none p-6 md:p-12 bg-pink-200">
        {/* Left keyboard image */}
        <div className="flex-shrink-0 w-1.5/3 hidden md:flex items-center justify-center">
          <img
            src={keyboardImg}
            alt="FAQ keyboard"
            className="max-w-full h-auto"
          />
        </div>

        {/* Right FAQs */}
        <div className="flex-1">
          <div className="space-y-4">
            <h2 className="text-stone-950 font-productSans text-3xl mb-4">
              FAQ'S
            </h2>

            {faqs.map((q, i) => {
              const open = openIndex === i;

              return (
                <div
                  key={i}
                  onClick={() => setOpenIndex(open ? null : i)}
                  className={`cursor-pointer rounded-none p-4 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-stone-950 border-3 border-black transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ${
                    open ? "bg-yellow-200 border-4" : "bg-white border-3"
                  }`}
                >
                  {/* Question Row */}
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-medium font-productSans">
                      {`${i + 1}. ${q}`}
                    </div>

                    {/* Animated Arrow */}
                    <div
                      className={cn(
                        "text-2xl font-black font-productSans transform transition-transform duration-200 bg-black text-white w-8 h-8 flex items-center justify-center border-2 border-black",
                        open ? "rotate-90" : "rotate-0"
                      )}
                    >
                      ▾
                    </div>
                  </div>

                  {/* Answer with animation */}
                  <div
                    className={cn(
                      "grid transition-all duration-300 overflow-hidden text-sm text-gray-600 font-productSans",
                      open
                        ? "grid-rows-[1fr] opacity-100 mt-3"
                        : "grid-rows-[0fr] opacity-0 mt-0"
                    )}
                  >
                    <div className="overflow-hidden">{answers[i]}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// Utility used above (copy this or import from your utils)
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
