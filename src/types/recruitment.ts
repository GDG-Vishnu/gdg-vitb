import { Timestamp } from "firebase/firestore";

// ── Field Types ──────────────────────────────────────────────

export type FieldType =
  | "text"
  | "email"
  | "tel"
  | "url"
  | "number"
  | "select"
  | "file"
  | "checkbox";

export type RoleStatus = "draft" | "open" | "closing-soon" | "coming-soon" | "closed" | "archived";

export type ApplicationStatus =
  | "submitted"
  | "under_review"
  | "shortlisted"
  | "interview_scheduled"
  | "interviewed"
  | "accepted"
  | "rejected"
  | "waitlisted"
  | "withdrawn";

// ── Role Section ─────────────────────────────────────────────

export interface RecruitmentRoleSection {
  number: number;
  title: string;
  description?: string;
  borderColor: string;
}

// ── Role Field (question definition) ─────────────────────────

export interface RecruitmentRoleField {
  name: string;           // unique key, also used in answers map
  label: string;          // displayed question text
  type: FieldType;
  section: number;        // matches a section number
  required: boolean;
  placeholder?: string;
  helpText?: string;
  options?: { label: string; value: string }[];  // select only
  accept?: string;        // file input accept string
  maxSizeMB?: number;     // file only; falls back to global settings
  allowedExtensions?: string[];  // file only, e.g. [".pdf",".doc"]
  checkboxLabel?: string; // checkbox only
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  patternMessage?: string;
  order: number;
}

// ── Role ─────────────────────────────────────────────────────

export interface RecruitmentRole {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;               // hex #RRGGBB, default #4285F4
  status: RoleStatus;
  maxApplications: number | null;
  applicationStart: Timestamp | null;
  applicationEnd: Timestamp | null;
  sections: RecruitmentRoleSection[];
  fields: RecruitmentRoleField[];
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface RecruitmentRoleSerialized {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  status: RoleStatus;
  maxApplications: number | null;
  applicationStart: string | null;
  applicationEnd: string | null;
  sections: RecruitmentRoleSection[];
  fields: RecruitmentRoleField[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// ── Applicant Info (built-in fields) ────────────────────────

export interface RecruitmentApplicantInfo {
  fullName: string;
  email: string;
  phone: string;
  branch: string;
  yearOfStudy: string;
}

// ── Social Links ─────────────────────────────────────────────

export interface RecruitmentSocialLinks {
  linkedin?: string;
  github?: string;
  portfolio?: string;
  gitRepoLink?: string;
}

// ── File Meta ────────────────────────────────────────────────

export interface RecruitmentFileMeta {
  url: string;
  cloudinaryId: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
}

// ── Files ────────────────────────────────────────────────────

export interface RecruitmentFiles {
  resume: RecruitmentFileMeta;
  taskSubmission?: RecruitmentFileMeta;
}

// ── Application ──────────────────────────────────────────────

export interface RecruitmentApplication {
  id: string;
  roleId: string;
  userId: string | null;
  userEmail: string;
  applicant: RecruitmentApplicantInfo;
  socialLinks: RecruitmentSocialLinks;
  files: RecruitmentFiles;
  answers: Record<string, unknown>;   // dynamic field answers (NOT reserved names)
  status: ApplicationStatus;
  currentReviewer: string | null;
  shortlistedAt: Timestamp | null;
  reviewedAt: Timestamp | null;
  acceptedAt: Timestamp | null;
  rejectedAt: Timestamp | null;
  rejectedReason: string | null;
  dedupeKey: string;                  // "{roleId}_{email}"
  agreeToTerms: boolean;
  confirmInfo: boolean;
  isRead: boolean;
  isStarred: boolean;
  notes: string;
  submittedAt: Timestamp;
  updatedAt: Timestamp;
}

export interface RecruitmentApplicationSerialized {
  id: string;
  roleId: string;
  userId: string | null;
  userEmail: string;
  applicant: RecruitmentApplicantInfo;
  socialLinks: RecruitmentSocialLinks;
  files: RecruitmentFiles;
  answers: Record<string, unknown>;
  status: ApplicationStatus;
  currentReviewer: string | null;
  shortlistedAt: string | null;
  reviewedAt: string | null;
  acceptedAt: string | null;
  rejectedAt: string | null;
  rejectedReason: string | null;
  dedupeKey: string;
  agreeToTerms: boolean;
  confirmInfo: boolean;
  isRead: boolean;
  isStarred: boolean;
  notes: string;
  submittedAt: string;
  updatedAt: string;
}

// ── Review ───────────────────────────────────────────────────

export interface ApplicationReview {
  id: string;
  reviewerId: string;
  reviewerName: string;
  score: number | null;              // 0-10
  criteria: {
    technical: number | null;
    communication: number | null;
    portfolio: number | null;
    culturalFit: number | null;
  };
  verdict: "pending" | "shortlist" | "reject" | "waitlist";
  strengths: string;
  weaknesses: string;
  comments: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ── Status History ───────────────────────────────────────────

export interface StatusHistoryEntry {
  id: string;
  fromStatus: string;
  toStatus: string;
  changedBy: string;
  reason: string;
  createdAt: Timestamp;
}

// ── Settings ─────────────────────────────────────────────────

export interface RecruitmentSettings {
  id: string;
  isRecruitmentActive: boolean;
  globalMessage: string;
  allowedEmailDomain: string;
  maxResumeSizeMB: number;
  maxTaskFileSizeMB: number;
  allowedResumeTypes: string[];
  allowedTaskTypes: string[];
  notifyOnApplication: boolean;
  notificationEmails: string[];
  scriptUrl: string | null;
  updatedAt: Timestamp;
}

// ── Reserved field names (NOT in answers map) ────────────────

export const RESERVED_APPLICANT_FIELDS = [
  "fullName",
  "email",
  "phone",
  "branch",
  "yearOfStudy",
] as const;

export const RESERVED_FILE_FIELDS = ["resume", "taskSubmission"] as const;

export const ALL_RESERVED_FIELDS = [
  ...RESERVED_APPLICANT_FIELDS,
  ...RESERVED_FILE_FIELDS,
] as const;

// ── Status transition rules (enforced by backend) ────────────

export const STATUS_TRANSITIONS: Record<ApplicationStatus, ApplicationStatus[]> = {
  submitted: ["under_review", "rejected", "waitlisted"],
  under_review: ["shortlisted", "rejected", "waitlisted"],
  shortlisted: ["interview_scheduled", "rejected", "waitlisted", "accepted"],
  interview_scheduled: ["interviewed", "rejected", "waitlisted"],
  interviewed: ["accepted", "rejected", "waitlisted"],
  accepted: ["withdrawn", "waitlisted"],
  rejected: [],
  waitlisted: ["shortlisted", "accepted", "rejected"],
  withdrawn: [],
};

// ── Zod Schema Builder ──────────────────────────────────────

import { z } from "zod";

export function buildFormSchema(fields: RecruitmentRoleField[]) {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const field of fields) {
    // Skip reserved names — they go in applicant/files, not answers
    if ((ALL_RESERVED_FIELDS as readonly string[]).includes(field.name)) continue;

    switch (field.type) {
      case "text":
      case "tel":
      case "url":
      case "number": {
        let s = z.string();
        if (field.required) s = s.min(1, `${field.label} is required`);
        if (field.minLength) s = s.min(field.minLength);
        if (field.maxLength) s = s.max(field.maxLength);
        if (field.type === "url" && field.required) {
          s = s.url("Please enter a valid URL");
        }
        if (field.pattern) {
          s = s.regex(new RegExp(field.pattern), field.patternMessage ?? "Invalid format");
        }
        shape[field.name] = field.required ? s : s.optional().or(z.literal(""));
        break;
      }
      case "email": {
        let s = z.string().email("Invalid email address");
        if (field.required) s = s.min(1, `${field.label} is required`);
        shape[field.name] = field.required ? s : s.optional().or(z.literal(""));
        break;
      }
      case "select": {
        let s = z.string();
        if (field.required) s = s.min(1, `${field.label} is required`);
        shape[field.name] = field.required ? s : s.optional().or(z.literal(""));
        break;
      }
      case "file": {
        const maxBytes = (field.maxSizeMB ?? 10) * 1024 * 1024;
        const exts = field.allowedExtensions;
        shape[field.name] = z
          .any()
          .refine((files: FileList | undefined) => files && files.length > 0, `${field.label} is required`)
          .refine(
            (files: FileList | undefined) => !files?.[0] || files[0].size <= maxBytes,
            `File size must be less than ${field.maxSizeMB ?? 10}MB`,
          )
          .refine(
            (files: FileList | undefined) =>
              !files?.[0] || !exts || exts.some((ext) => files[0].name.toLowerCase().endsWith(ext.toLowerCase())),
            exts ? `Only ${exts.join(", ")} files are allowed` : "Invalid file type",
          );
        break;
      }
      case "checkbox": {
        shape[field.name] = z
          .boolean()
          .refine((val) => val === true, { message: field.label });
        break;
      }
    }
  }

  return z.object(shape);
}
