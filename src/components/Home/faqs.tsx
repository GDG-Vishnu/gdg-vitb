"use client";

import React, { useState } from "react";

const keyboardImg =
  "https://res.cloudinary.com/duvr3z2z0/image/upload/v1760611622/Group_69_wyuwym.png";

const faqs = [
  "What Is GDG Vishnu Institute Of Technology?",
  "Who Can Join GDG Vishnu Institute Of Technology?",
  "What Specific Tech Areas Does GDG VITB Focus On?",
  "How Do I Stay Updated On Upcoming Events And Meetups?",
  "What Kind Of Impact Can I Make By Joining?",
];

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
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.
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
