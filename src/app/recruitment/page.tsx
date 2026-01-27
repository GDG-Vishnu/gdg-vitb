"use client";

import Image from "next/image";
import Link from "next/link";

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
    status: "open",
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
            community of developers, designers, and innovators. Choose your
            domain below to apply.
          </p>
        </div>

        {/* Recruitment Cards */}
        <div className="space-y-4 md:space-y-6">
          {recruitmentRoles.map((role) => (
            <Link
              key={role.id}
              href={role.status === "open" ? role.route : "#"}
              className={`group block ${
                role.status === "open"
                  ? "cursor-pointer"
                  : "cursor-not-allowed opacity-60"
              }`}
            >
              <div
                className={`relative bg-white rounded-xl md:rounded-2xl shadow-sm border-2 p-4 sm:p-6 md:p-8 transition-all duration-300 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 ${
                  role.status === "open"
                    ? "hover:shadow-xl hover:-translate-y-1"
                    : "border-opacity-10"
                }`}
                style={{
                  borderColor: role.color,
                }}
              >
                {/* Status Badge */}
                {role.status !== "open" && (
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                    <span className="px-2 py-1 sm:px-3 bg-gray-200 text-gray-600 text-xs font-semibold rounded-full">
                      {role.status === "closed" ? "Closed" : "Coming Soon"}
                    </span>
                  </div>
                )}

                {/* Icon */}

                {/* Content */}
                <div className="flex-1 text-center sm:text-left w-full sm:w-auto">
                  {/* Title */}
                  <h3
                    className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2"
                    style={{ color: role.color }}
                  >
                    {role.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed">
                    {role.description}
                  </p>
                </div>

                {/* Apply Button */}
                {role.status === "open" && (
                  <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto justify-center sm:justify-start mt-2 sm:mt-0">
                    <span
                      className="text-sm md:text-base font-semibold"
                      style={{ color: role.color }}
                    >
                      Apply Now
                    </span>
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 transition-transform duration-300 group-hover:translate-x-2"
                      fill="none"
                      stroke={role.color}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Footer Note */}
      </div>
    </div>
  );
}
