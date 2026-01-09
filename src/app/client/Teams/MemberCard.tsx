"use client";

import React from "react";
import { Mail, Linkedin } from "lucide-react";

export type MemberCardProps = {
  bgColor?: string | null;
  logo?: string | null;
  id: string;
  imageUrl?: string | null;
  name: string;
  designation?: string | null;
  position?: string | null;
  rank?: number | null;
  dept_rank?: number | null;
  dept_logo?: string | null;
  linkedinUrl?: string | null;
  mail?: string | null;
};

export default function MemberCard({
  id,
  imageUrl,
  name,
  designation,
  position,
  linkedinUrl,
  mail,
  logo,
  bgColor,
}: MemberCardProps) {
  return (
    <div className="w-[290px]  rounded-lg overflow-hidden border border-black shadow-sm bg-white mb-4">
      {/* Header: position label */}

      <div className="flex items-center justify-between px-4 py-2 border-b border-black">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-sky-200" />
          <div className="w-3 h-3 rounded-full bg-green-100" />
          <div className="w-3 h-3 rounded-full bg-yellow-100" />
        </div>

        {/*  {position && <div className="text-lg text-stone-950 font-medium">{position}</div>}*/}
      </div>

      {/* Image area */}
      <div
        style={{ backgroundColor: bgColor || "#e6fffa" }}
        className="flex items-center justify-center h-[272px] w-[287px]"
      >
        <img
          src={
            imageUrl ||
            "https://res.cloudinary.com/duvr3z2z0/image/upload/v1764391657/Screenshot_2025-11-29_095727_wptmhb.png"
          }
          alt={String(name)}
          className="object-cover h-full w-full"
        />
      </div>

      {/* Footer / details */}
      <div className="px-4 py-3 flex flex-col justify-between">
        <div>
          <h3 className="font-medium text-stone-800 w-full text-lg font-productSans">
            {name}
          </h3>
        </div>
        <div className="flex justify-between items-center ">
          <h1
            className="text-[20px] text-green-600 font-semibold mt-1 font-productSans text-wrap"
            style={{ color: bgColor || "#38a169" }}
          >
            {designation}
          </h1>

          <div className=" flex space-x-3 ">
            {mail && (
              <a
                href={`mailto:${mail}`}
                aria-label={`Email ${name}`}
                className="p-2 rounded-md border"
              >
                <Mail className="w-7 h-7 text-stone-950  " />
              </a>
            )}

            {linkedinUrl && (
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${name} on LinkedIn`}
                className="p-2 rounded-md border"
              >
                <Linkedin className="w-7 h-7 text-stone-950 " />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
