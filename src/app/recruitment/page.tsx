"use client";

import Image from "next/image";

interface RecruitmentRole {
  id: string;
  title: string;
  description: string;
  color: string;
  icon: string;
  route: string;
  status: "open" | "closed" | "coming-soon";
}

const recruitmentRoles: RecruitmentRole[] = [
  {
    id: "web-dev",
    title: "Full Stack Web Development",
    description:
      "Join our web development team to build innovative web applications using modern technologies and frameworks.",
    color: "#4584F4",
    icon: "💻",
    route: "/recruitment/web-dev",
    status: "closed",
  },
  // Add more roles here as needed
];

export default function RecruitmentPage() {
  return (
    <div className="min-h-screen px-4 py-4 md:py-8">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-6 md:mb-10">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-4 md:mb-6">
            <Image
              src="/favicon.ico"
              alt="GDG Logo"
              width={96}
              height={96}
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full"
            />
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                <span className="text-blue-600">GDG VITB</span>
                <span className="text-gray-400"> - </span>
                <span className="text-red-500">Recruitment</span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 mt-1">
                Vishnu Institute of Technology
              </p>
            </div>
          </div>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4">
            Join Google Developer Groups at VITB and be part of an amazing
            community of developers, designers, and innovators.
          </p>
        </div>

        {/* Hirings Closed Banner */}
        <div className="bg-red-50 border-2 border-red-200 rounded-xl md:rounded-2xl p-8 sm:p-10 md:p-14 text-center">
          <div className="text-5xl sm:text-6xl mb-4">🚫</div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-600 mb-3">
            Hirings Closed
          </h2>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-xl mx-auto">
            Thank you for your interest! Recruitment for all positions is
            currently closed. Stay tuned for future openings.
          </p>
        </div>

        {/* Footer Note */}
      </div>
    </div>
  );
}
