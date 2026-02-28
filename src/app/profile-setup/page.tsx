"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase-client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import Footer from "@/components/footer/Footer";

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
];

const CURRENT_YEAR = new Date().getFullYear();
const MIN_YEAR = CURRENT_YEAR;
const MAX_YEAR = CURRENT_YEAR + 6;

// ─── Validation ─────────────────────────────────────────────

interface FormErrors {
  name?: string;
  branch?: string;
  graduationYear?: string;
  phoneNumber?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  resumeUrl?: string;
}

function validatePhone(phone: string): boolean {
  // Indian mobile: 10 digits, optionally prefixed with +91 or 0
  return /^(\+91[\s-]?)?[6-9]\d{9}$/.test(phone.replace(/[\s-]/g, ""));
}

function validateUrl(url: string): boolean {
  if (!url) return true; // optional
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function validate(values: {
  name: string;
  branch: string;
  graduationYear: number;
  phoneNumber: string;
  linkedin: string;
  github: string;
  twitter: string;
  resumeUrl: string;
}): FormErrors {
  const errors: FormErrors = {};

  if (!values.name.trim()) errors.name = "Name is required.";
  if (!values.branch) errors.branch = "Please select your branch.";

  if (
    !values.graduationYear ||
    values.graduationYear < MIN_YEAR ||
    values.graduationYear > MAX_YEAR
  ) {
    errors.graduationYear = `Enter a year between ${MIN_YEAR} and ${MAX_YEAR}.`;
  }

  if (!values.phoneNumber.trim()) {
    errors.phoneNumber = "Phone number is required.";
  } else if (!validatePhone(values.phoneNumber)) {
    errors.phoneNumber = "Enter a valid Indian mobile number.";
  }

  if (values.linkedin && !validateUrl(values.linkedin))
    errors.linkedin = "Enter a valid URL.";
  if (values.github && !validateUrl(values.github))
    errors.github = "Enter a valid URL.";
  if (values.twitter && !validateUrl(values.twitter))
    errors.twitter = "Enter a valid URL.";
  if (values.resumeUrl && !validateUrl(values.resumeUrl))
    errors.resumeUrl = "Enter a valid URL.";

  return errors;
}

// ─── Page ───────────────────────────────────────────────────

export default function ProfileSetupPage() {
  const { firebaseUser, userProfile, loading, refreshProfile } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");

  // Form state
  const [name, setName] = useState("");
  const [branch, setBranch] = useState("");
  const [graduationYear, setGraduationYear] = useState<number | "">("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [twitter, setTwitter] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  // Pre-fill from profile
  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name || "");
      setBranch(userProfile.branch || "");
      setGraduationYear(userProfile.graduationYear || "");
      setPhoneNumber(userProfile.phoneNumber || "");
      setLinkedin(userProfile.socialMedia?.linkedin || "");
      setGithub(userProfile.socialMedia?.github || "");
      setTwitter(userProfile.socialMedia?.twitter || "");
      setResumeUrl(userProfile.resumeUrl || "");
    }
  }, [userProfile]);

  // Auth guard — redirect away if not logged in
  useEffect(() => {
    if (loading) return;
    if (!firebaseUser) {
      router.replace("/");
    }
  }, [loading, firebaseUser, router]);

  // ── Submit ──────────────────────────────────────────────

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const values = {
      name,
      branch,
      graduationYear: Number(graduationYear),
      phoneNumber,
      linkedin,
      github,
      twitter,
      resumeUrl,
    };

    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    if (!firebaseUser) {
      toast.error("You must be signed in.");
      return;
    }

    setSubmitting(true);

    try {
      const ref = doc(db, "client_users", firebaseUser.uid);
      await updateDoc(ref, {
        name: values.name.trim(),
        branch: values.branch,
        graduationYear: values.graduationYear,
        phoneNumber: values.phoneNumber.trim(),
        socialMedia: {
          linkedin: values.linkedin.trim() || "",
          github: values.github.trim() || "",
          twitter: values.twitter.trim() || "",
        },
        resumeUrl: values.resumeUrl.trim() || "",
        profileCompleted: true,
        updatedAt: serverTimestamp(),
      });

      await refreshProfile();
      toast.success("Profile setup complete!");
      router.replace(redirectTo || "/");
    } catch (err) {
      console.error("[ProfileSetup] update failed:", err);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Loading / guard states ──────────────────────────────

  if (loading || !firebaseUser || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  const email = userProfile.email;
  const profileUrl = userProfile.profileUrl;
  const isEditing = userProfile.profileCompleted;

  // ── Render ──────────────────────────────────────────────

  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundColor: "white",
        backgroundImage:
          "linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      <main className="relative z-10 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="relative inline-block mb-4">
              <div className="absolute -inset-4 bg-yellow-300 border-4 border-black rounded-3xl transform rotate-1 opacity-80 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" />
              <h1 className="relative text-3xl md:text-4xl font-bold text-black font-productSans px-6 py-3">
                {isEditing ? "Edit Profile" : "Complete Your Profile"}
              </h1>
            </div>
            <p className="text-gray-600 font-productSans mt-6">
              {isEditing
                ? "Update your profile information."
                : "Fill in the required details to get started with GDG on Campus VITB."}
            </p>
          </div>

          {/* Profile photo + email (read-only header) */}
          <div className="flex items-center gap-4 mb-8 p-4 bg-gray-50 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            {profileUrl ? (
              <img
                src={profileUrl}
                alt={name}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-full border-2 border-black object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center text-xl font-bold border-2 border-black">
                {name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-black font-productSans truncate">
                {name}
              </p>
              <p className="text-sm text-gray-500 truncate">{email}</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ── Name ── */}
            <Field label="Full Name" required error={errors.name}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className={inputClass(errors.name)}
              />
            </Field>

            {/* ── Email (readonly) ── */}
            <Field label="Email">
              <input
                type="email"
                value={email}
                readOnly
                className={`${inputClass()} bg-gray-100 cursor-not-allowed opacity-70`}
              />
            </Field>

            {/* ── Branch ── */}
            <Field label="Branch" required error={errors.branch}>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className={inputClass(errors.branch)}
              >
                <option value="">Select your branch</option>
                {BRANCHES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </Field>

            {/* ── Graduation Year ── */}
            <Field
              label="Graduation Year"
              required
              error={errors.graduationYear}
            >
              <input
                type="number"
                value={graduationYear}
                onChange={(e) =>
                  setGraduationYear(
                    e.target.value ? Number(e.target.value) : "",
                  )
                }
                min={MIN_YEAR}
                max={MAX_YEAR}
                placeholder={`e.g. ${CURRENT_YEAR + 2}`}
                className={inputClass(errors.graduationYear)}
              />
            </Field>

            {/* ── Phone Number ── */}
            <Field label="Phone Number" required error={errors.phoneNumber}>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+91 9876543210"
                className={inputClass(errors.phoneNumber)}
              />
            </Field>

            {/* ── Divider ── */}
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-dashed border-gray-300" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-sm text-gray-400 font-productSans">
                  Optional Details
                </span>
              </div>
            </div>

            {/* ── LinkedIn ── */}
            <Field label="LinkedIn" error={errors.linkedin}>
              <input
                type="url"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/your-profile"
                className={inputClass(errors.linkedin)}
              />
            </Field>

            {/* ── GitHub ── */}
            <Field label="GitHub" error={errors.github}>
              <input
                type="url"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="https://github.com/username"
                className={inputClass(errors.github)}
              />
            </Field>

            {/* ── Twitter / X ── */}
            <Field label="Twitter / X" error={errors.twitter}>
              <input
                type="url"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                placeholder="https://x.com/username"
                className={inputClass(errors.twitter)}
              />
            </Field>

            {/* ── Resume URL ── */}
            <Field label="Resume URL" error={errors.resumeUrl}>
              <input
                type="url"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                placeholder="https://drive.google.com/..."
                className={inputClass(errors.resumeUrl)}
              />
            </Field>

            {/* ── Submit ── */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-6 bg-black text-white font-bold text-base rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed font-productSans"
            >
              {submitting
                ? "Saving…"
                : isEditing
                  ? "Save Changes"
                  : "Complete Profile"}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// ─── Reusable Field Wrapper ─────────────────────────────────

function Field({
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
      <label className="block text-sm font-semibold text-black mb-1.5 font-productSans">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-xs text-red-600 font-productSans">{error}</p>
      )}
    </div>
  );
}

// ─── Shared Input Class ─────────────────────────────────────

function inputClass(error?: string) {
  return `w-full px-4 py-2.5 rounded-xl border-2 text-sm font-productSans text-black bg-white outline-none transition-all duration-200 ${
    error
      ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
      : "border-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
  }`;
}
