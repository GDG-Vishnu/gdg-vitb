"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Github, Link2 } from "lucide-react";
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

  // Filter social media to only show platforms with URLs
  const socialLinks: Array<[string, string]> = Object.entries(
    socialMedia || {},
  ).filter((entry): entry is [string, string] => {
    const [_, url] = entry;
    return Boolean(url && url.trim() !== "");
  });
  const hasSocialLinks = socialLinks.length > 0;

  // Helper to get icon for platform
  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "github":
        return <Github className="w-[20px] h-[20px] sm:w-[22px] sm:h-[22px]" />;
      case "linkedin":
        return (
          <Image
            src="/linkedin.png"
            alt="LinkedIn"
            width={28}
            height={28}
            className="w-[22px] h-[22px] sm:w-[26px] sm:h-[26px] object-contain"
          />
        );
      case "twitter":
        return (
          <Image
            src="/web.png"
            alt="Website / Portfolio"
            width={28}
            height={28}
            className="w-[22px] h-[22px] sm:w-[26px] sm:h-[26px] object-contain"
          />
        );
      default:
        return <Link2 className="w-[20px] h-[20px] sm:w-[22px] sm:h-[22px]" />;
    }
  };

  // Helper to get label for platform
  const getSocialLabel = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "github":
        return "GitHub";
      case "linkedin":
        return "LinkedIn";
      case "twitter":
        return "Website / Portfolio";
      default:
        return (
          platform.charAt(0).toUpperCase() + platform.slice(1).toLowerCase()
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-[#1E1E1E] border border-white rounded-[14px] w-full min-[1440px]:w-[1264px] flex flex-col lg:flex-row items-center lg:items-stretch gap-[20px] lg:gap-[28px] min-[1440px]:gap-[32px] p-[16px] sm:p-[20px] md:p-[24px] lg:p-[20px] min-[1440px]:p-[14px]"
    >
      {/* ── PROFILE IMAGE ──────────────────────────────── */}
      <div className="shrink-0 flex justify-center lg:justify-start">
        {profileUrl ? (
          <img
            src={profileUrl}
            alt={name}
            referrerPolicy="no-referrer"
            className="w-[140px] h-[140px] sm:w-[180px] sm:h-[180px] md:w-[220px] md:h-[220px] lg:w-[300px] lg:h-[300px] min-[1440px]:w-[386px] min-[1440px]:h-[386px] rounded-[12px] object-cover"
          />
        ) : (
          <div className="w-[140px] h-[140px] sm:w-[180px] sm:h-[180px] md:w-[220px] md:h-[220px] lg:w-[300px] lg:h-[300px] min-[1440px]:w-[386px] min-[1440px]:h-[386px] rounded-[12px] bg-gray-700 flex items-center justify-center text-[36px] sm:text-[42px] md:text-[48px] font-[700] text-white">
            {name?.charAt(0)?.toUpperCase() || "?"}
          </div>
        )}
      </div>

      {/* ── RIGHT CONTENT ──────────────────────────────── */}
      <div className="flex-1 min-w-0 w-full lg:w-auto flex flex-col items-center lg:items-start justify-center gap-[16px] sm:gap-[20px] lg:gap-[24px] min-[1440px]:w-[736px] min-[1440px]:gap-[47px]">
        {/* ROW 1 — Name + Branch */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-x-[20px] gap-y-[12px] min-[1440px]:flex min-[1440px]:gap-[260px] min-[1440px]:items-start min-[1440px]:w-[736px]">
          <div className="min-[1440px]:w-[399px] min-[1440px]:flex min-[1440px]:flex-col min-[1440px]:gap-[5px]">
            <FieldBlock label="Name" value={name || "—"} />
          </div>
          <div className="min-[1440px]:w-[193px] min-[1440px]:flex min-[1440px]:flex-col min-[1440px]:gap-[5px] min-[1440px]:text-right">
            <FieldBlock label="Branch" value={branch || "—"} />
          </div>
        </div>

        {/* ROW 2 — Email / Phone / Graduation */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[20px] gap-y-[12px] min-[1440px]:flex min-[1440px]:w-[736px] min-[1440px]:gap-[52px] min-[1440px]:items-start">
          <div className="min-[1440px]:w-[320px] min-[1440px]:shrink-0 min-[1440px]:flex min-[1440px]:flex-col min-[1440px]:gap-[5px]">
            <FieldBlock label="Email" value={email || "—"} breakAll />
          </div>
          <div className="min-[1440px]:w-[160px] min-[1440px]:flex min-[1440px]:flex-col min-[1440px]:gap-[5px]">
            <FieldBlock label="Phone" value={phoneNumber || "—"} />
          </div>
          <div className="min-[1440px]:w-[160px] min-[1440px]:flex min-[1440px]:flex-col min-[1440px]:gap-[5px]">
            <FieldBlock
              label="Graduation"
              value={graduationYear ? String(graduationYear) : "—"}
            />
          </div>
        </div>

        {/* ROW 3 — Socials + Resume */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-x-[24px] min-[1440px]:gap-x-0 gap-y-[12px] items-end min-[1440px]:flex min-[1440px]:w-[736px] min-[1440px]:justify-between min-[1440px]:items-center">
          {/* Socials - Only show if there are social links */}
          {hasSocialLinks && (
            <div className="flex flex-col items-center sm:items-start gap-[8px] min-[1440px]:w-[195px] min-[1440px]:gap-[12px]">
              <span className="text-[#FFD427] text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] min-[1440px]:text-[24px] font-[500] leading-[146%] tracking-[0.11em] uppercase">
                Socials
              </span>
              <div className="flex items-center justify-center sm:justify-start gap-[12px] min-[1440px]:gap-[14.88px] flex-wrap min-[1440px]:flex-nowrap">
                {socialLinks.map(([platform, url]) => (
                  <SocialIcon
                    key={platform}
                    href={url}
                    icon={getSocialIcon(platform)}
                    label={getSocialLabel(platform)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Resume */}
          {resumeUrl && (
            <div className="flex items-center justify-center">
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-[#FFD427] text-[14px] sm:text-[16px] md:text-[18px] min-[1440px]:text-[20px] font-[500] leading-[146%] tracking-[0.04em] underline underline-offset-[4px] hover:text-[#ffd96e] transition-colors duration-200"
              >
                View Resume
              </a>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Reusable field block ────────────────────────────────── */

function FieldBlock({
  label,
  value,
  breakAll,
}: {
  label: string;
  value: string;
  breakAll?: boolean;
}) {
  return (
    <div className="min-w-0 flex flex-col items-center sm:items-start gap-[4px]">
      <p className="text-[#FFD427] text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] min-[1440px]:text-[24px] font-[500] leading-[146%] tracking-[0.11em] uppercase">
        {label}
      </p>
      <p
        className={`text-white text-[13px] sm:text-[15px] md:text-[17px] lg:text-[18px] min-[1440px]:text-[20px] font-[400] leading-[146%] tracking-[0.04em] ${breakAll ? "break-all" : ""}`}
      >
        {value}
      </p>
    </div>
  );
}

function SocialIcon({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  const baseClasses =
    "w-[36px] h-[36px] sm:w-[40px] sm:h-[40px] rounded-full bg-[#FFE7A5] flex items-center justify-center text-black";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={label}
      className={`${baseClasses} hover:bg-[#ffd96e] transition-colors duration-200`}
    >
      {icon}
    </a>
  );
}
