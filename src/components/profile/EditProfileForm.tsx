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

const SOCIAL_PLATFORMS = ["GITHUB", "LINKEDIN", "PORTFOLIO"] as const;
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
  socialMedia: {
    linkedin: string;
    github: string;
    twitter: string;
  };
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

  if (!values.name.trim()) errors.name = "Name is required.";
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

  // Close branch dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (branchRef.current && !branchRef.current.contains(e.target as Node)) {
        setBranchOpen(false);
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

  const addSocialLink = () => {
    // Find a platform not yet added
    const existing = Object.keys(formData.socialLinks);
    const available = SOCIAL_PLATFORMS.filter((p) => !existing.includes(p));
    if (available.length === 0) return;
    updateField("socialLinks", {
      ...formData.socialLinks,
      [available[0]]: "",
    });
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

    onSubmit({
      name: formData.name.trim(),
      branch: formData.branch,
      graduationYear: Number(formData.graduationYear),
      phoneNumber: formData.phoneNumber.trim(),
      resumeUrl: formData.resumeUrl.trim(),
      socialMedia: {
        linkedin: (formData.socialLinks["LINKEDIN"] || "").trim(),
        github: (formData.socialLinks["GITHUB"] || "").trim(),
        twitter: (formData.socialLinks["PORTFOLIO"] || "").trim(),
      },
    });
  };

  // ── Available platforms for adding ──────────────────────

  const canAddMore =
    Object.keys(formData.socialLinks).length < SOCIAL_PLATFORMS.length;

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
      <div className="max-w-4xl mx-auto">
        {/* ── Outer wrapper card ─────────────────────────── */}
        <div className="bg-[#111111] border border-gray-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl">
          {/* ── Header ───────────────────────────────────── */}
          <div className="relative flex items-center justify-between mb-4 sm:mb-6">
            <h1 className="text-gray-200 text-xl sm:text-2xl font-bold tracking-widest uppercase">
              {isFirstSetup ? "Complete Your Profile" : "Edit Profile"}
            </h1>
            {isFirstSetup && (
              <p className="text-gray-500 text-sm mt-1">
                Fill in the required details to get started with GDG on Campus
                VITB.
              </p>
            )}

            {!isFirstSetup && (
              <motion.button
                type="button"
                onClick={onCancel}
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="bg-[#BFDCE5] text-black px-4 py-2 border-2 border-[#1E1E1E] shadow-[2px_2px_0px_0px_#F0F0F0,2px_2px_0px_1px_#1E1E1E] font-bold text-sm uppercase tracking-wide hover:bg-[#a8cdd8] transition-all duration-200"
              >
                Cancel
              </motion.button>
            )}
          </div>

          {/* ── Form Card ────────────────────────────────── */}
          <motion.form
            onSubmit={handleFormSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-[#1E1E1E] border border-gray-600 rounded-xl p-4 sm:p-6 md:p-8 shadow-lg"
          >
            {/* ── Profile Image ──────────────────────────────── */}
            <div className="mb-8">
              <label className="block text-xs font-semibold text-[#78C6E7] mb-3 uppercase tracking-wider">
                Profile Image
              </label>
              <div className="flex items-center gap-4">
                {user.profileUrl ? (
                  <img
                    src={user.profileUrl}
                    alt={user.name}
                    referrerPolicy="no-referrer"
                    className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] rounded-md object-cover border border-gray-600"
                  />
                ) : (
                  <div className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] rounded-md bg-gray-700 flex items-center justify-center text-3xl sm:text-4xl font-bold text-white border border-gray-600">
                    {formData.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                )}
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 bg-[#BFDCE5] text-black px-4 py-2 border-2 border-[#1E1E1E] shadow-[2px_2px_0px_0px_#F0F0F0,2px_2px_0px_1px_#1E1E1E] font-semibold text-sm hover:bg-[#a8cdd8] transition-all duration-200"
                >
                  <Upload size={14} />
                  Upload
                </motion.button>
              </div>
            </div>

            {/* ── Fields Grid ────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
              {/* Name */}
              <FieldBlock label="Name" required error={errors.name}>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="Your full name"
                  className={inputClass(errors.name)}
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
                  <p className="mt-1 text-xs text-gray-500">
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
                    <p className="mt-1 text-xs text-gray-500">
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
                                className={`w-full text-left px-4 py-2.5 text-sm transition-colors duration-100 ${
                                  formData.branch === b
                                    ? "bg-[#78C6E7]/20 text-[#78C6E7] font-semibold"
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
                <label className="text-xs font-semibold text-[#78C6E7] uppercase tracking-wider">
                  Social Media Links
                </label>
                {canAddMore && (
                  <motion.button
                    type="button"
                    onClick={addSocialLink}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-1 bg-[#BFDCE5] text-black px-3 py-1.5 border-2 border-[#1E1E1E] shadow-[2px_2px_0px_0px_#F0F0F0,2px_2px_0px_1px_#1E1E1E] font-semibold text-xs uppercase tracking-wide hover:bg-[#a8cdd8] transition-all duration-200"
                  >
                    <Plus size={12} />
                    Add
                  </motion.button>
                )}
              </div>

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
                            <span className="text-white text-xs font-bold uppercase tracking-wide">
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
                            className="flex-1 px-3 sm:px-4 py-2.5 border-y border-gray-500 bg-transparent text-white text-sm outline-none focus:border-[#78C6E7] transition-colors duration-200 min-w-0"
                          />

                          {/* Delete button */}
                          <motion.button
                            type="button"
                            onClick={() => removeSocialLink(platform)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center justify-center w-10 border-2 border-[#1E1E1E] bg-[#121212] text-gray-400 shadow-[2px_2px_0px_0px_#F0F0F0,2px_2px_0px_1px_#1E1E1E] hover:bg-red-600 hover:text-white transition-colors duration-200"
                          >
                            <X size={14} />
                          </motion.button>
                        </div>

                        {errors[`social_${platform}`] && (
                          <p className="mt-1 text-xs text-red-400">
                            {errors[`social_${platform}`]}
                          </p>
                        )}
                      </motion.div>
                    ),
                  )}
                </AnimatePresence>

                {Object.keys(formData.socialLinks).length === 0 && (
                  <p className="text-gray-500 text-sm py-2">
                    No social links added yet. Click &quot;+ Add&quot; to add
                    one.
                  </p>
                )}
              </div>
            </div>

            {/* ── Save Button ────────────────────────────────── */}
            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={submitting ? {} : { y: -2 }}
              whileTap={submitting ? {} : { scale: 0.98 }}
              className="w-full mt-8 py-3 px-6 bg-[#C3ECF6] text-black font-bold text-sm border-2 border-[#1E1E1E] shadow-[2px_2px_0px_0px_#F0F0F0,2px_2px_0px_1px_#1E1E1E] hover:bg-[#a8cdd8] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed uppercase tracking-wider"
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
      <label className="block text-xs font-semibold text-[#78C6E7] mb-1.5 uppercase tracking-wider">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

// ─── Input Class ────────────────────────────────────────────

function inputClass(error?: string) {
  return `w-full px-4 py-2.5 rounded-md border text-sm text-white bg-transparent outline-none transition-all duration-200 ${
    error
      ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-400/30"
      : "border-gray-500 focus:border-[#78C6E7] focus:ring-1 focus:ring-[#78C6E7]/30"
  }`;
}
