"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, ChevronDown, Upload } from "lucide-react";
import type { UserSerialized } from "@/types/user";
import { parseRollNumber } from "@/lib/roll-number";

// ─── Constants ──────────────────────────────────────────────

const BRANCHES = [
  "CSE",
  "CSE (AI & ML)",
  "CSE (AI & DS)",
  "IT",
  "ECE",
  "EEE",
  "MECH",
  "CIVIL",
] as const;

const CURRENT_YEAR = new Date().getFullYear();
const MIN_YEAR = CURRENT_YEAR;
const MAX_YEAR = CURRENT_YEAR + 6;

const SOCIAL_PLATFORMS = ["GITHUB", "LINKEDIN", "PORTFOLIO", "OTHER"] as const;
type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];

// ─── Types ──────────────────────────────────────────────────

interface FormData {
  name: string;
  email: string;
  phoneNumber: string;
  graduationYear: number | "";
  branch: string;
  resumeUrl: string;
  socialLinks: Record<string, string>;
}

interface FormErrors {
  name?: string;
  branch?: string;
  graduationYear?: string;
  phoneNumber?: string;
  resumeUrl?: string;
  [key: string]: string | undefined; // dynamic social link errors
}

export interface EditProfileSubmitData {
  name: string;
  branch: string;
  graduationYear: number;
  phoneNumber: string;
  resumeUrl: string;
  profileUrl: string;
  socialMedia: Record<string, string>;
}

interface EditProfileFormProps {
  user: UserSerialized;
  isFirstSetup: boolean;
  submitting: boolean;
  onSubmit: (data: EditProfileSubmitData) => void;
  onCancel: () => void;
}

// ─── Validation ─────────────────────────────────────────────

function validatePhone(phone: string): boolean {
  return /^(\+91[\s-]?)?[6-9]\d{9}$/.test(phone.replace(/[\s-]/g, ""));
}

function validateUrl(url: string): boolean {
  if (!url) return true;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function validate(values: FormData): FormErrors {
  const errors: FormErrors = {};

  if (!values.branch) errors.branch = "Please select your branch.";

  const gradYear = Number(values.graduationYear);
  if (!gradYear || gradYear < MIN_YEAR || gradYear > MAX_YEAR) {
    errors.graduationYear = `Enter a year between ${MIN_YEAR} and ${MAX_YEAR}.`;
  }

  if (!values.phoneNumber.trim()) {
    errors.phoneNumber = "Phone number is required.";
  } else if (!validatePhone(values.phoneNumber)) {
    errors.phoneNumber = "Enter a valid Indian mobile number.";
  }

  if (values.resumeUrl && !validateUrl(values.resumeUrl)) {
    errors.resumeUrl = "Enter a valid URL.";
  }

  // Validate social link URLs
  Object.entries(values.socialLinks).forEach(([platform, url]) => {
    if (url && !validateUrl(url)) {
      errors[`social_${platform}`] = "Enter a valid URL.";
    }
  });

  return errors;
}

// ─── Component ──────────────────────────────────────────────

export default function EditProfileForm({
  user,
  isFirstSetup,
  submitting,
  onSubmit,
  onCancel,
}: EditProfileFormProps) {
  // Build initial social links from user data
  const buildInitialSocialLinks = (): Record<string, string> => {
    const links: Record<string, string> = {};
    if (user.socialMedia?.github) links["GITHUB"] = user.socialMedia.github;
    if (user.socialMedia?.linkedin)
      links["LINKEDIN"] = user.socialMedia.linkedin;
    if (user.socialMedia?.twitter)
      links["PORTFOLIO"] = user.socialMedia.twitter;
    // Add any custom platforms
    Object.entries(user.socialMedia || {}).forEach(([key, value]) => {
      if (
        key !== "github" &&
        key !== "linkedin" &&
        key !== "twitter" &&
        value
      ) {
        links[key.toUpperCase()] = value;
      }
    });
    return links;
  };

  // Check if branch & year were auto-derived from roll number
  const rollInfo = parseRollNumber(user.email || "");
  const branchAutoFilled = !!rollInfo;

  const [formData, setFormData] = useState<FormData>({
    name: user.name || "",
    email: user.email || "",
    phoneNumber: user.phoneNumber || "",
    graduationYear: user.graduationYear || rollInfo?.graduationYear || "",
    branch: user.branch || rollInfo?.branch || "",
    resumeUrl: user.resumeUrl || "",
    socialLinks: buildInitialSocialLinks(),
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [branchOpen, setBranchOpen] = useState(false);
  const branchRef = useRef<HTMLDivElement>(null);

  // Social platform selection dropdown state
  const [platformDropdownOpen, setPlatformDropdownOpen] = useState(false);
  const platformDropdownRef = useRef<HTMLDivElement>(null);
  const [customPlatformName, setCustomPlatformName] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  // ── Profile image upload state ─────────────────────────
  const [profileUrl, setProfileUrl] = useState(user.profileUrl || "");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Upload failed");

      setProfileUrl(data.url);
    } catch (err) {
      console.error("[Upload] failed:", err);
      alert(err instanceof Error ? err.message : "Image upload failed.");
    } finally {
      setUploading(false);
      // Reset the input so the same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (branchRef.current && !branchRef.current.contains(e.target as Node)) {
        setBranchOpen(false);
      }
      if (
        platformDropdownRef.current &&
        !platformDropdownRef.current.contains(e.target as Node)
      ) {
        setPlatformDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // ── Field updaters ──────────────────────────────────────

  const updateField = <K extends keyof FormData>(
    key: K,
    value: FormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    // Clear error on change
    if (errors[key as string]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key as string];
        return next;
      });
    }
  };

  // ── Social links management ─────────────────────────────

  const addSocialLink = (platform: SocialPlatform) => {
    if (platform === "OTHER") {
      setShowCustomInput(true);
      setPlatformDropdownOpen(false);
    } else {
      updateField("socialLinks", {
        ...formData.socialLinks,
        [platform]: "",
      });
      setPlatformDropdownOpen(false);
    }
  };

  const addCustomPlatform = () => {
    const trimmed = customPlatformName.trim().toUpperCase();
    if (!trimmed) return;
    if (formData.socialLinks[trimmed]) {
      alert("This platform already exists!");
      return;
    }
    updateField("socialLinks", {
      ...formData.socialLinks,
      [trimmed]: "",
    });
    setCustomPlatformName("");
    setShowCustomInput(false);
  };

  const removeSocialLink = (platform: string) => {
    const next = { ...formData.socialLinks };
    delete next[platform];
    updateField("socialLinks", next);
    // Clear error too
    if (errors[`social_${platform}`]) {
      setErrors((prev) => {
        const n = { ...prev };
        delete n[`social_${platform}`];
        return n;
      });
    }
  };

  const updateSocialLink = (platform: string, url: string) => {
    updateField("socialLinks", {
      ...formData.socialLinks,
      [platform]: url,
    });
    if (errors[`social_${platform}`]) {
      setErrors((prev) => {
        const n = { ...prev };
        delete n[`social_${platform}`];
        return n;
      });
    }
  };

  // ── Submit ──────────────────────────────────────────────

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    // Build socialMedia object from all social links
    const socialMedia: Record<string, string> = {};
    Object.entries(formData.socialLinks).forEach(([platform, url]) => {
      const trimmedUrl = url.trim();
      if (trimmedUrl) {
        // Map platform names to DB keys
        if (platform === "GITHUB") socialMedia.github = trimmedUrl;
        else if (platform === "LINKEDIN") socialMedia.linkedin = trimmedUrl;
        else if (platform === "PORTFOLIO") socialMedia.twitter = trimmedUrl;
        else socialMedia[platform.toLowerCase()] = trimmedUrl; // Custom platforms
      }
    });

    onSubmit({
      name: formData.name.trim(),
      branch: formData.branch,
      graduationYear: Number(formData.graduationYear),
      phoneNumber: formData.phoneNumber.trim(),
      resumeUrl: formData.resumeUrl.trim(),
      profileUrl,
      socialMedia,
    });
  };

  // ── Available platforms for adding ──────────────────────

  const availablePlatforms = SOCIAL_PLATFORMS.filter((p) => {
    // "OTHER" is always available for adding custom platforms
    if (p === "OTHER") return true;
    return !Object.keys(formData.socialLinks).includes(p);
  });
  const canAddMore = availablePlatforms.length > 0;

  // ── Render ──────────────────────────────────────────────

  return (
    <div
      className="min-h-screen py-6 sm:py-8 md:py-12 px-3 sm:px-4"
      style={{
        backgroundColor: "white",
        backgroundImage:
          "linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      <div className="flex justify-center">
        {/* ── Outer wrapper card ─────────────────────────── */}
        <div className="bg-[#111111] border border-gray-700 rounded-[14px] sm:rounded-[20px] md:rounded-[28px] min-[1440px]:rounded-[38px] p-4 sm:p-6 md:p-8 shadow-xl w-full max-w-[1388px]">
          {/* ── Header ───────────────────────────────────── */}
          <div className="w-full min-[1440px]:w-[1264px] mx-auto mb-4 sm:mb-6">
            <div className="relative flex items-center justify-between">
              <h1 className="text-gray-200 text-[22px] sm:text-[24px] md:text-[26px] min-[1440px]:text-[30px] font-[900] leading-[146%] tracking-[0.11em] uppercase">
                {isFirstSetup ? "Complete Your Profile" : "Edit Profile"}
              </h1>
              {isFirstSetup && (
                <p className="text-gray-500 text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] min-[1440px]:text-[16px] mt-1">
                  Fill in the required details to get started with GDG on Campus
                  VITB.
                </p>
              )}

              {!isFirstSetup && (
                <motion.button
                  type="button"
                  onClick={onCancel}
                  whileTap={{ scale: 0.97 }}
                  className="bg-[#BFDCE5] text-black px-4 py-2 border-2 border-[#1E1E1E] shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] font-[900] text-[14px] sm:text-[16px] md:text-[18px] uppercase tracking-wide hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-200"
                >
                  Cancel
                </motion.button>
              )}
            </div>
          </div>

          {/* ── Form Card ────────────────────────────────── */}
          <motion.form
            onSubmit={handleFormSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-[#1E1E1E] border border-gray-600 rounded-[14px] p-4 sm:p-6 md:p-8 shadow-lg w-full min-[1440px]:w-[1264px] mx-auto"
          >
            {/* ── Profile Image ──────────────────────────────── */}
            <div className="mb-8">
              <label className="block text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] min-[1440px]:text-[24px] font-[500] text-[#57CAFF] mb-3 uppercase tracking-[0.11em] leading-[146%]">
                Profile Image
              </label>
              <div className="flex items-center gap-4">
                {profileUrl ? (
                  <img
                    src={profileUrl}
                    alt={formData.name}
                    referrerPolicy="no-referrer"
                    className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] rounded-md object-cover border border-gray-600"
                  />
                ) : (
                  <div className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] rounded-md bg-gray-700 flex items-center justify-center text-3xl sm:text-4xl font-[700] text-white border border-gray-600">
                    {formData.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                )}

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={handleImageUpload}
                />

                <motion.button
                  type="button"
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                  whileTap={uploading ? {} : { scale: 0.97 }}
                  className="flex items-center gap-2 bg-[#BFDCE5] text-black px-4 py-2 border-2 border-[#1E1E1E] shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] font-[700] text-[14px] sm:text-[15px] md:text-[16px] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      Uploading…
                    </>
                  ) : (
                    <>
                      <Upload size={14} />
                      Upload
                    </>
                  )}
                </motion.button>
              </div>
            </div>

            {/* ── Fields Grid ────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
              {/* Name (read-only — from Google account) */}
              <FieldBlock label="Name">
                <input
                  type="text"
                  value={formData.name}
                  readOnly
                  className={`${inputClass()} bg-[#2a2a2a] cursor-not-allowed opacity-60`}
                />
              </FieldBlock>

              {/* Email (readonly) */}
              <FieldBlock label="Email">
                <input
                  type="email"
                  value={formData.email}
                  readOnly
                  className={`${inputClass()} bg-[#2a2a2a] cursor-not-allowed opacity-60`}
                />
              </FieldBlock>

              {/* Phone Number */}
              <FieldBlock
                label="Phone Number"
                required
                error={errors.phoneNumber}
              >
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => updateField("phoneNumber", e.target.value)}
                  placeholder="+91 9876543210"
                  className={inputClass(errors.phoneNumber)}
                />
              </FieldBlock>

              {/* Graduation Year */}
              <FieldBlock
                label="Graduation Year"
                required
                error={errors.graduationYear}
              >
                <input
                  type="number"
                  value={formData.graduationYear}
                  onChange={(e) =>
                    !branchAutoFilled &&
                    updateField(
                      "graduationYear",
                      e.target.value ? Number(e.target.value) : "",
                    )
                  }
                  readOnly={branchAutoFilled}
                  min={MIN_YEAR}
                  max={MAX_YEAR}
                  placeholder={`e.g. ${CURRENT_YEAR + 2}`}
                  className={`${inputClass(errors.graduationYear)}${branchAutoFilled ? " bg-[#2a2a2a] cursor-not-allowed opacity-60" : ""}`}
                />
                {branchAutoFilled && (
                  <p className="mt-1 text-[11px] sm:text-[12px] md:text-[13px] text-gray-500">
                    Auto-detected from your roll number
                  </p>
                )}
              </FieldBlock>

              {/* Branch (custom dropdown — read-only when auto-detected) */}
              <FieldBlock label="Branch" required error={errors.branch}>
                {branchAutoFilled ? (
                  <>
                    <input
                      type="text"
                      value={formData.branch}
                      readOnly
                      className={`${inputClass()} bg-[#2a2a2a] cursor-not-allowed opacity-60`}
                    />
                    <p className="mt-1 text-[11px] sm:text-[12px] md:text-[13px] text-gray-500">
                      Auto-detected from your roll number
                    </p>
                  </>
                ) : (
                  <div ref={branchRef} className="relative">
                    <button
                      type="button"
                      onClick={() => setBranchOpen((prev) => !prev)}
                      className={`${inputClass(errors.branch)} flex items-center justify-between text-left`}
                    >
                      <span
                        className={
                          formData.branch ? "text-white" : "text-gray-500"
                        }
                      >
                        {formData.branch || "Select your branch"}
                      </span>
                      <ChevronDown
                        size={16}
                        className={`text-gray-400 transition-transform duration-200 ${branchOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    <AnimatePresence>
                      {branchOpen && (
                        <motion.ul
                          initial={{ opacity: 0, y: -6, scaleY: 0.95 }}
                          animate={{ opacity: 1, y: 0, scaleY: 1 }}
                          exit={{ opacity: 0, y: -6, scaleY: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute z-20 left-0 right-0 mt-1 bg-[#1a1a1a] border border-gray-600 rounded-md shadow-xl max-h-52 overflow-y-auto origin-top"
                        >
                          {BRANCHES.map((b) => (
                            <li key={b}>
                              <button
                                type="button"
                                onClick={() => {
                                  updateField("branch", b);
                                  setBranchOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2.5 text-[13px] sm:text-[15px] md:text-[17px] lg:text-[18px] min-[1440px]:text-[20px] transition-colors duration-100 ${
                                  formData.branch === b
                                    ? "bg-[#78C6E7]/20 text-[#78C6E7] font-[500]"
                                    : "text-white hover:bg-gray-700"
                                }`}
                              >
                                {b}
                              </button>
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </FieldBlock>

              {/* Resume Link */}
              <FieldBlock label="Resume Link" error={errors.resumeUrl}>
                <input
                  type="url"
                  value={formData.resumeUrl}
                  onChange={(e) => updateField("resumeUrl", e.target.value)}
                  placeholder="https://drive.google.com/..."
                  className={inputClass(errors.resumeUrl)}
                />
              </FieldBlock>
            </div>

            {/* ── Divider ────────────────────────────────────── */}
            <div className="relative py-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-dashed border-gray-600" />
              </div>
            </div>

            {/* ── Social Media Links ─────────────────────────── */}
            <div className="mb-2">
              <div className="flex items-center justify-between mb-4">
                <label className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] min-[1440px]:text-[24px] font-[500] text-[#57CAFF] uppercase tracking-[0.11em] leading-[146%]">
                  Social Media Links
                </label>
                {canAddMore && (
                  <div className="relative" ref={platformDropdownRef}>
                    <motion.button
                      type="button"
                      onClick={() =>
                        setPlatformDropdownOpen(!platformDropdownOpen)
                      }
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-1 bg-[#BFDCE5] text-black px-3 py-1.5 border-2 border-[#1E1E1E] shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] font-[700] text-[13px] sm:text-[14px] md:text-[15px] uppercase tracking-wide hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-200"
                    >
                      Add
                      <ChevronDown
                        size={12}
                        className={`transition-transform duration-200 ${platformDropdownOpen ? "rotate-180" : ""}`}
                      />
                    </motion.button>
                    <AnimatePresence>
                      {platformDropdownOpen && (
                        <motion.ul
                          initial={{ opacity: 0, y: -6, scaleY: 0.95 }}
                          animate={{ opacity: 1, y: 0, scaleY: 1 }}
                          exit={{ opacity: 0, y: -6, scaleY: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute z-20 right-0 mt-1 bg-[#1a1a1a] border border-gray-600 rounded-md shadow-xl min-w-[140px] origin-top"
                        >
                          {availablePlatforms.map((platform) => (
                            <li key={platform}>
                              <button
                                type="button"
                                onClick={() => addSocialLink(platform)}
                                className="w-full text-left px-4 py-2.5 text-[13px] sm:text-[14px] md:text-[15px] text-white hover:bg-gray-700 transition-colors duration-100"
                              >
                                {platform === "OTHER"
                                  ? "Other (Custom)"
                                  : platform}
                              </button>
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Custom Platform Input */}
              <AnimatePresence>
                {showCustomInput && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 overflow-hidden"
                  >
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customPlatformName}
                        onChange={(e) => setCustomPlatformName(e.target.value)}
                        placeholder="Enter platform name (e.g., Instagram, YouTube)"
                        className="flex-1 px-4 py-2.5 rounded-md border border-gray-500 bg-transparent text-white text-[13px] sm:text-[15px] md:text-[17px] outline-none focus:border-[#78C6E7] transition-colors duration-200"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addCustomPlatform();
                          }
                        }}
                      />
                      <motion.button
                        type="button"
                        onClick={addCustomPlatform}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2.5 bg-[#BFDCE5] text-black border-2 border-[#1E1E1E] shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] font-[700] text-[13px] sm:text-[14px] uppercase hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-200"
                      >
                        Add
                      </motion.button>
                      <motion.button
                        type="button"
                        onClick={() => {
                          setShowCustomInput(false);
                          setCustomPlatformName("");
                        }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2.5 bg-gray-700 text-white border-2 border-gray-600 font-[700] text-[13px] sm:text-[14px] uppercase hover:bg-gray-600 transition-all duration-200"
                      >
                        Cancel
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {Object.entries(formData.socialLinks).map(
                    ([platform, url]) => (
                      <motion.div
                        key={platform}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="flex items-stretch gap-0">
                          {/* Platform label */}
                          <div className="flex items-center px-3 sm:px-4 py-2.5 border border-gray-500 rounded-l-md bg-[#121212] min-w-[90px] sm:min-w-[110px]">
                            <span className="text-white text-[12px] sm:text-[13px] md:text-[14px] font-[700] uppercase tracking-wide">
                              {platform}
                            </span>
                          </div>

                          {/* URL input */}
                          <input
                            type="url"
                            value={url}
                            onChange={(e) =>
                              updateSocialLink(platform, e.target.value)
                            }
                            placeholder={`https://${platform.toLowerCase()}.com/...`}
                            className="flex-1 px-3 sm:px-4 py-2.5 border-y border-gray-500 bg-transparent text-white text-[13px] sm:text-[15px] md:text-[17px] outline-none focus:border-[#78C6E7] transition-colors duration-200 min-w-0"
                          />

                          {/* Delete button */}
                          <motion.button
                            type="button"
                            onClick={() => removeSocialLink(platform)}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center justify-center w-10 border-2 border-[#1E1E1E] bg-[#121212] text-gray-400 shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none hover:bg-red-600 hover:text-white transition-all duration-200"
                          >
                            <X size={14} />
                          </motion.button>
                        </div>

                        {errors[`social_${platform}`] && (
                          <p className="mt-1 text-[11px] sm:text-[12px] md:text-[13px] text-red-400">
                            {errors[`social_${platform}`]}
                          </p>
                        )}
                      </motion.div>
                    ),
                  )}
                </AnimatePresence>

                {Object.keys(formData.socialLinks).length === 0 && (
                  <p className="text-gray-500 text-[13px] sm:text-[14px] md:text-[15px] py-2">
                    No social links added yet. Click &quot;Add&quot; to add one.
                  </p>
                )}
              </div>
            </div>

            {/* ── Save Button ────────────────────────────────── */}
            <motion.button
              type="submit"
              disabled={submitting}
              whileTap={submitting ? {} : { scale: 0.98 }}
              className="w-full mt-8 py-3 px-6 bg-[#C3ECF6] text-black font-[900] text-[16px] sm:text-[18px] md:text-[20px] border-2 border-[#1E1E1E] shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed uppercase tracking-wider"
            >
              {submitting
                ? "Saving…"
                : isFirstSetup
                  ? "Complete Profile"
                  : "Save Changes"}
            </motion.button>
          </motion.form>
        </div>
      </div>
    </div>
  );
}

// ─── FieldBlock ─────────────────────────────────────────────

function FieldBlock({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] min-[1440px]:text-[24px] font-[500] text-[#57CAFF] mb-1.5 uppercase tracking-[0.11em] leading-[146%]">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-[11px] sm:text-[12px] md:text-[13px] text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Input Class ────────────────────────────────────────────

function inputClass(error?: string) {
  return `w-full px-4 py-2.5 rounded-md border text-[13px] sm:text-[15px] md:text-[17px] lg:text-[18px] min-[1440px]:text-[20px] font-[400] text-white bg-transparent outline-none transition-all duration-200 ${
    error
      ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-400/30"
      : "border-gray-500 focus:border-[#78C6E7] focus:ring-1 focus:ring-[#78C6E7]/30"
  }`;
}
