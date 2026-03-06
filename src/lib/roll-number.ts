// ─── Roll Number Parser ─────────────────────────────────────
//
// VIT B roll-number format (also the email prefix):
//   YY PA X A BB RR
//   │     │   │  │
//   │     │   │  └─ Student roll within branch (2 alphanumeric chars)
//   │     │   └──── Branch code (2 digits)
//   │     └──────── 1 = Regular, 5 = Lateral Entry
//   └───────────── Admission year (first 2 digits, e.g. 24 → 2024)
//
// Example: 24PA1A0501 → 2024, Regular, CSE (05), roll 01
// Example: 25PA5A0412 → 2025, Lateral,  ECE (04), roll 12
// Example: 24PA1A05M6 → 2024, Regular, CSE (05), roll M6
//
// Graduation year:
//   Regular (1A) → admissionYear + 4
//   Lateral (5A) → admissionYear + 3

// ─── Branch Code Map ───────────────────────────────────────

const BRANCH_CODE_MAP: Record<string, string> = {
  "01": "CIVIL",
  "02": "EEE",
  "03": "MECH",
  "04": "ECE",
  "05": "CSE",
  "12": "IT",
  "42": "CSE (AI & ML)",
  "45": "CSE (AI & DS)",
};

// ─── Types ──────────────────────────────────────────────────

export interface RollNumberInfo {
  admissionYear: number;
  graduationYear: number;
  branch: string;
  branchCode: string;
  isLateralEntry: boolean;
  rollNumber: string; // full roll number
}

// ─── Regex ──────────────────────────────────────────────────

// Matches: YY P A (1|5) A BB RR (where RR is 2 alphanumeric chars)
// e.g. 24PA1A0501  or  25pa5a0412  or  24pa1a05m6
const ROLL_NUMBER_REGEX = /^(\d{2})pa([15])a(\d{2})([a-z0-9]{2})$/i;

// ─── Parser ─────────────────────────────────────────────────

/**
 * Extracts branch, graduation year, and admission info from a
 * VIT Bhopal email address (or just the roll-number prefix).
 *
 * @param email — full email (e.g. "24pa1a0501@vishnu.edu.in" or "24pa1a05m6@vishnu.edu.in") or just the roll number
 * @returns parsed info, or `null` if the format doesn't match
 */
export function parseRollNumber(email: string): RollNumberInfo | null {
  // Strip domain if present
  const localPart = email.split("@")[0].trim();

  const match = localPart.match(ROLL_NUMBER_REGEX);
  if (!match) return null;

  const [, yearStr, typeChar, branchCode, _studentNum] = match;

  const admissionYear = 2000 + parseInt(yearStr, 10);
  const isLateralEntry = typeChar === "5";
  const graduationYear = admissionYear + (isLateralEntry ? 3 : 4);

  const branch = BRANCH_CODE_MAP[branchCode];
  if (!branch) return null; // Unknown branch code

  return {
    admissionYear,
    graduationYear,
    branch,
    branchCode,
    isLateralEntry,
    rollNumber: localPart.toUpperCase(),
  };
}

/**
 * Computes current year of study (1–4) based on admission year and
 * lateral-entry status.
 *
 * Indian academic year starts around June:
 *   - If today is June or later  → academic year = calendar year
 *   - If today is before June    → academic year = calendar year − 1
 *
 * Regular  → year 1 in admission year
 * Lateral  → year 2 in admission year (they skip 1st year)
 */
export function getCurrentYearOfStudy(
  admissionYear: number,
  isLateralEntry: boolean,
): number {
  const now = new Date();
  const academicYear =
    now.getMonth() >= 5 ? now.getFullYear() : now.getFullYear() - 1;

  const year = academicYear - admissionYear + 1 + (isLateralEntry ? 1 : 0);

  // Clamp between 1 and 4
  return Math.max(1, Math.min(year, 4));
}

/**
 * Convenience: extract branch name from email, or empty string if unrecognised.
 */
export function getBranchFromEmail(email: string): string {
  return parseRollNumber(email)?.branch ?? "";
}

/**
 * Convenience: extract graduation year from email, or 0 if unrecognised.
 */
export function getGraduationYearFromEmail(email: string): number {
  return parseRollNumber(email)?.graduationYear ?? 0;
}
