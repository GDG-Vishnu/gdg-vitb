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
"GDG on Campus – Vishnu Institute of Technology, Bhimavaram is a student community that creates opportunities for aspiring developers to learn, practice, and grow with technology. We organize workshops, hackathons, and tech sessions that provide hands-on experience and help students build essential skills for a strong career in tech. Being part of this community also connects our students to the larger global GDG network. ",
"GDG Vishnu Institute of Technology welcomes all students who are eager to learn, grow, and contribute. Our community includes a wide range of technical and non-technical domains, allowing every member to find their space — whether in building technology or supporting creative and organizational efforts.",
" Our focus areas include Web Development, Android, Cloud Computing, Artificial Intelligence, and Design. GDG VITB provides a platform for students to explore these technologies, gain practical skills, and collaborate on creative projects.",
"Stay connected with us through our official GDG VITB Instagram page and GDG VITB LinkedIn page for the latest updates on events, workshops, and meetups. Follow us regularly to stay informed about exciting opportunities and community activities!",
"By joining GDG Vishnu Institute of Technology, you become part of a community that learns, grows, and builds together. You’ll gain real-world experience, work with a passionate team, and drive projects that make a meaningful impact in the community."
]
export default function FAQs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="w-full py-12 px-4 ">
      <div className="max-w-[1500px] mx-auto flex items-center gap-8 border-2 border-gray-900 rounded-3xl p-6 md:p-12 bg-gray-50 rounded-[58px]">
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
            <h2 className="text-stone-950 sm:block">FAQ'S</h2>
            {faqs.map((q, i) => (
              <div
                key={i}
                className="border rounded-xl p-4 bg-white shadow-sm text-stone-950  border-2 border-stone-950 "
                role="button"
                aria-expanded={openIndex === i}
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <div className="flex items-center justify-between ">
                  <div className="text-lg font-medium">{`${i + 1}. ${q}`}</div>
                  <div className="text-xl">{openIndex === i ? "▴" : "▾"}</div>
                </div>

                {openIndex === i && (
                  <div className="mt-3 text-sm text-gray-600">
                    {answers[i]}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}