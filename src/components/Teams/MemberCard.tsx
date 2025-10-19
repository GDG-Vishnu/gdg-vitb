"use client";

import React from "react";
import { Mail, Linkedin } from "lucide-react";

export type MemberCardProps = {
  id: string | number;
  imageUrl: string;
  name: string;
  designation: string; // e.g., "LEAD"
  position?: string; // e.g., "Android"
  linkedinUrl?: string;
  mail?: string;
  bgColor?: string; // e.g., "#FF5733"
};

export default function MemberCard({
  id,
  imageUrl,
  name,
  designation,
  position,
  linkedinUrl,
  mail,
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
        {position && <div className="text-lg font-medium">{position}</div>}
      </div>

      {/* Image area */}
      <div
        style={{ backgroundColor: bgColor || "#e6fffa" }}
        className="flex items-center justify-center h-[272px] w-[287px]"
      >
        <img
          src={imageUrl}
          alt={String(name)}
          className="object-cover h-full w-full"
        />
      </div>

      {/* Footer / details */}
      <div className="px-4 py-3 flex justify-between">
        <div>
          <h3 className="text-2xl font-medium">{name}</h3>
          <h1 className="text-sm text-green-600 font-semibold mt-1">
            {designation}
          </h1>
        </div>
        <div className="mt-4 flex items-center justify-end gap-3">
          {mail && (
            <a
              href={`mailto:${mail}`}
              aria-label={`Email ${name}`}
              className="p-2 rounded-md border"
            >
              <Mail className="w-5 h-5" />
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
              <Linkedin className="w-5 h-5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
