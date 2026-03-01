"use client";

import React from "react";
import { motion } from "framer-motion";
import { Linkedin, Github, Globe, ExternalLink } from "lucide-react";
import type { UserSerialized } from "@/types/user";

interface ProfileCardProps {
  user: UserSerialized;
}

export default function ProfileCard({ user }: ProfileCardProps) {
  const {
    name,
    email,
    profileUrl,
    branch,
    graduationYear,
    phoneNumber,
    socialMedia,
    resumeUrl,
  } = user;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-[#1E1E1E] border border-white rounded-xl p-3 sm:p-4 md:p-5 shadow-lg"
    >
      <div className="flex flex-col md:flex-row gap-4 md:gap-5">
        {/* Avatar — responsive sizing */}
        <div className="shrink-0 flex justify-center md:justify-start md:self-stretch">
          {profileUrl ? (
            <img
              src={profileUrl}
              alt={name}
              referrerPolicy="no-referrer"
              className="w-28 h-28 sm:w-36 sm:h-36 md:w-[220px] md:h-full md:min-h-[240px] lg:w-[260px] rounded-lg object-cover border border-gray-600"
            />
          ) : (
            <div className="w-28 h-28 sm:w-36 sm:h-36 md:w-[220px] md:h-full md:min-h-[240px] lg:w-[260px] rounded-lg bg-gray-700 flex items-center justify-center text-3xl sm:text-4xl md:text-5xl font-bold text-white border border-gray-600">
              {name?.charAt(0)?.toUpperCase() || "?"}
            </div>
          )}
        </div>

        {/* Info grid — responsive columns */}
        <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 lg:gap-x-8 gap-y-4 sm:gap-y-5 content-between p-1 sm:p-2">
          {/* Row 1: Name, Email */}
          <InfoBlock label="NAME" value={name || "—"} />
          <InfoBlock label="EMAIL" value={email || "—"} />
          <div className="hidden lg:block" />

          {/* Row 2: Branch, Phone, Graduation */}
          <InfoBlock label="BRANCH" value={branch || "—"} />
          <InfoBlock label="PHONE" value={phoneNumber || "—"} />
          <InfoBlock
            label="GRADUATION"
            value={graduationYear ? String(graduationYear) : "—"}
          />

          {/* Row 3: Socials + Resume */}
          <div>
            <p className="text-[#FFD427] text-sm font-semibold tracking-wider uppercase mb-1.5">
              Socials
            </p>
            <div className="flex items-center gap-3">
              <SocialIcon
                href={socialMedia?.linkedin}
                icon={<Linkedin size={16} />}
                label="LinkedIn"
              />
              <SocialIcon
                href={socialMedia?.github}
                icon={<Github size={16} />}
                label="GitHub"
              />
              <SocialIcon
                href={socialMedia?.twitter}
                icon={<Globe size={16} />}
                label="Website / X"
              />
            </div>
          </div>
          <div className="hidden sm:block" />
          <div className="flex items-end sm:justify-end">
            {resumeUrl ? (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#FFE7A5] text-black font-bold text-xs sm:text-sm px-4 sm:px-6 py-2 border-2 border-[#1E1E1E] shadow-[2px_2px_0px_0px_#F0F0F0,2px_2px_0px_1px_#1E1E1E] hover:bg-[#ffd96e] transition-all duration-200"
              >
                VIEW RESUME
                <ExternalLink size={14} />
              </a>
            ) : (
              <span className="inline-flex items-center gap-2 bg-[#FFE7A5] text-black font-bold text-xs sm:text-sm px-4 sm:px-6 py-2 border-2 border-[#1E1E1E] shadow-[2px_2px_0px_0px_#F0F0F0,2px_2px_0px_1px_#1E1E1E] cursor-not-allowed">
                VIEW RESUME
                <ExternalLink size={14} />
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Helpers ─────────────────────────────────────────────── */

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[#FFD427] text-sm font-semibold tracking-wider uppercase mb-1">
        {label}
      </p>
      <p className="text-white text-base break-words">{value}</p>
    </div>
  );
}

function SocialIcon({
  href,
  icon,
  label,
}: {
  href?: string;
  icon: React.ReactNode;
  label: string;
}) {
  if (!href) {
    return (
      <span
        title={`${label} (not set)`}
        className="w-8 h-8 rounded-full bg-[#FFE7A5] flex items-center justify-center text-black cursor-default"
      >
        {icon}
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={label}
      className="w-8 h-8 rounded-full bg-[#FFE7A5] flex items-center justify-center text-black hover:bg-[#ffd96e] transition-colors duration-200"
    >
      {icon}
    </a>
  );
}
