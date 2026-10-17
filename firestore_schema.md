# Firestore Database Schema

This document outlines the complete NoSQL schema structure for the GDG Admin Portal in Firebase Firestore. Since Firestore is document-based and schemaless, this represents the expected shape of the documents in each collection.

> **Last updated:** March 4, 2026

---

## Collections Overview

| # | Collection Name | Purpose | Subcollections |
|---|-----------------|---------|----------------|
| 1 | `events` | Legacy GDG events, their status, details, and media. | `members`, `instructors`, `guests`, `judges`, `workshops`, `hackathons` |
| 2 | `managed_events` | New managed events with registration tracking. | `registrations` |
| 3 | `managed_gdg_team` | GDG chapter team members with approval workflow. | — |
| 4 | `team_members` | Legacy GDG team members, their roles, and social links. | — |
| 5 | `forms` | Custom dynamic forms created by admins. | — |
| 6 | `form_responses` | Submitted responses to dynamic forms (linked via `formId`). | — |
| 7 | `client_users` | Registered community users (public-facing). | — |
| 8 | `users` | Admin portal user accounts. | — |
| 9 | `gallery` | Uploaded images/media gallery. | — |

---

## Document Structures

### 1. `events` Collection (Legacy)

**Path:** `events/{docId}`
**Source:** `app/api/admin/events/route.ts`, `lib/normalize.ts`

> **⚠ Storage Quirk:** Several fields (`Theme`, `tags`, `keyHighlights`, `eventGallery`, `isDone`)
> are stored as **JSON-stringified strings** in Firestore, not as native arrays/booleans.
> The app normalizes these at read time via `lib/normalize.ts`.

```typescript
interface Event {
  id: string;              // Stored as a field (NOT the Firestore doc ID)
  title: string;
  description: string;
  Date: string;            // Capital "D" — date string e.g. "2025-10-18 00:00:00"
  Time: string;            // Time string e.g. "09:00 - 16:00"
  venue: string;
  organizer: string;
  coOrganizer: string;
  status: string;          // e.g. "Completed"
  isDone: string;          // ⚠ Stored as string "true"/"false", not boolean
  rank: number;
  MembersParticipated: number;
  keyHighlights: string;   // ⚠ JSON-stringified string[] — normalized by lib/normalize.ts
  tags: string;            // ⚠ JSON-stringified string[] — normalized by lib/normalize.ts
  Theme: string;           // ⚠ JSON-stringified string[] (5 hex colors) — normalized
  eventGallery: string;    // ⚠ JSON-stringified string[] (image URLs) — normalized
  imageUrl: string;        // Display image (Cloudinary URL)
  coverUrl: string;        // Cover banner image (Cloudinary URL)
}
```

**Subcollections** (batch-deleted with parent, not directly managed via API):
- `members`, `instructors`, `guests`, `judges`, `workshops`, `hackathons`

---

### 2. `managed_events` Collection

**Path:** `managed_events/{docId}`
**Source:** `app/api/admin/managed-events/route.ts`, `lib/types/managed-event.ts`

```typescript
interface ManagedEvent {
  eventId: string;                   // Document ID, added at read time
  title: string;                     // Required
  description: string;
  bannerImage: string;               // URL
  posterImage: string;               // URL
  startDate: string | null;
  endDate: string | null;
  venue: string;
  mode: "ONLINE" | "OFFLINE" | "HYBRID";
  status: "UPCOMING" | "ONGOING" | "COMPLETED";
  eventType: "WORKSHOP" | "HACKATHON";
  maxParticipants: number;
  registrationStart: string | null;
  registrationEnd: string | null;
  isRegistrationOpen: boolean;
  createdBy: string;                 // Admin email
  tags: string[];
  keyHighlights: string[];
  eligibilityCriteria: {
    yearOfGrad: boolean[];
    Dept: string[];
  };
  executiveBoard: {
    organiser: string;
    coOrganiser: string;
    facilitator: string;
  };
  eventOfficials: {
    role: "GUEST" | "SPEAKER" | "JURY";
    name: string;
    email: string;
    bio?: string;
    expertise?: string;
    profileUrl?: string;
    linkedinUrl?: string;
  }[];
  faqs: { question: string; answer: string }[];
  rules: { rule: string }[];
  createdAt: Timestamp;              // Firestore server timestamp
  updatedAt: Timestamp;              // Firestore server timestamp
}
```

#### Subcollection: `registrations`

**Path:** `managed_events/{eventId}/registrations/{regId}`
**Source:** `app/api/admin/managed-events/[id]/registrations/route.ts`

```typescript
interface RegisteredMember {
  regId: string;                     // Document ID, added at read time
  userId: string;
  name: string;                      // Required
  email: string;                     // Required
  phone: string;
  registrationType: "Individual" | "Team";
  registeredAt: Timestamp;           // Firestore server timestamp
  isCheckedIn: boolean;
  checkedInAt: Timestamp | null;     // Server timestamp when checked in
}
```

---

### 3. `managed_gdg_team` Collection

**Path:** `managed_gdg_team/{docId}`
**Source:** `app/api/admin/gdg-team/route.ts`, `lib/types/gdg-team.ts`

Used for GDG chapter team member management with an approval workflow.
When a member logs in from the mobile app, a document is created with `authorizationStatus: "pending"`.
An admin then approves/rejects and assigns a position and designation.

```typescript
interface GDGTeamMember {
  id: string;                        // Document ID, added at read time
  userId: string;                    // Firebase Auth UID
  name: string;                      // Required
  email: string;                     // Required
  profilePicture: string;            // URL

  accessLevel: "member" | "admin";
  authorizationStatus: "pending" | "approved" | "rejected" | "revoked";

  position: string;                  // e.g. "Lead Organizer", "Core Team"
  designation: string;               // e.g. "Google Developer Expert", "Android"

  approvedAt: string | null;         // ISO string
  approvedBy: string | null;         // Admin UID who approved

  revokedAt: string | null;          // ISO string
  revokedBy: string | null;          // Admin UID who revoked
  revokedReason: string | null;

  createdAt: string | null;          // ISO string
  updatedAt: string | null;          // ISO string
}
```

---

### 4. `team_members` Collection (Normalized — migrated 2026-10-17)

**Path:** `team_members/{docId}`
**Source:** `gdg-admin/app/api/admin/members/`, consumed by `src/app/api/teams/list/route.ts`

> Previously stored `position`/`designation`/`rank`/`dept_rank`/`bgColor`/`dept_logo` as
> flat, duplicated-per-member strings. Migrated via `scripts/migrate-team-schema.ts`
> into references against the new `departments` and `position_levels` collections below.
> `scripts/backup-team-data.ts` snapshots are kept under `backups/` for rollback.

```typescript
interface MemberHistoryEntry {
  deptId: string;
  deptName: string;       // snapshot for display without an extra join
  positionId: string;
  positionName: string;   // snapshot
  order: number;
  action: "assigned" | "promoted" | "transferred";
  effectiveDate: string;  // ISO date, admin-entered (e.g. date of promotion)
  recordedAt: string;     // ISO timestamp, when this entry was recorded
  recordedBy?: string;    // admin email/uid, or "migration"
}

interface TeamMember {
  id: string;              // Firestore document ID, added at read time
  name: string;            // Required
  imageUrl: string;        // Cloudinary URL
  logo: string;            // Team logo/icon URL
  linkedinUrl: string;     // Full LinkedIn profile URL
  mail: string;            // Email address
  isAlumni: boolean;
  deptId: string;          // -> departments/{deptId}
  positionId: string;      // -> position_levels/{positionId}
  order: number;           // Order within the department (was `rank`)
  history: MemberHistoryEntry[]; // Full assignment/promotion/transfer history
  createdAt: string;       // ISO string
  updatedAt: string;       // ISO string
}
```

---

### 4a. `departments` Collection

**Path:** `departments/{deptId}` (slugified name, e.g. `web-dev`)
**Source:** `gdg-admin/app/api/admin/departments/`

```typescript
interface Department {
  id: string;        // Document ID (slug)
  name: string;       // e.g. "Web Dev"
  order: number;      // Display order relative to other departments
  logo: string;        // Department icon URL
  bgColor: string;     // Hex color e.g. "#C3ECF6"
  isActive: boolean;
  createdAt: string;  // ISO string
  updatedAt: string;  // ISO string
}
```

---

### 4b. `position_levels` Collection

**Path:** `position_levels/{positionId}` (slugified name, e.g. `co-lead`)
**Source:** `gdg-admin/app/api/admin/positions/`

Admin-configurable hierarchy used for promotions. `Lead` (1), `Co-Lead` (2), and
`Associate` (3) are seeded as defaults (`isDefault: true`); admins can add more.
Lower `level` = higher rank — promoting a member requires moving to a strictly
lower `level` within the same department.

```typescript
interface PositionLevel {
  id: string;         // Document ID (slug)
  name: string;        // e.g. "Lead"
  level: number;       // 1 = highest rank
  isDefault: boolean;  // true for Lead/Co-Lead/Associate — protected from deletion
  createdAt: string;   // ISO string
  updatedAt: string;   // ISO string
}
```

---

### 5. `forms` Collection

**Path:** `forms/{docId}`
**Source:** `app/api/forms/route.ts`

Dynamic forms builder — stores the form configuration/schema.

```typescript
interface Form {
  id: string;              // Document ID, added at read time
  title: string;           // Required
  description: string;
  fields: FormField[];     // Array of input field definitions
  steps?: FormStep[];      // Multi-step form configuration (optional)
  isActive: boolean;       // Whether form accepts responses (default: true)
  createdAt: Timestamp;    // Firestore server timestamp
  updatedAt: Timestamp;    // Firestore server timestamp
}
```

---

### 6. `form_responses` Collection

**Path:** `form_responses/{docId}`
**Source:** `app/api/forms/[id]/responses/route.ts`

> **Note:** This is a **top-level collection**, NOT a subcollection of `forms`.
> Linked to forms via the `formId` field.

```typescript
interface FormResponse {
  id: string;                       // Document ID, added at read time
  formId: string;                   // References the parent form's doc ID
  data: Record<string, any>;       // Submission payload keyed by field ID
  submittedAt: Timestamp;           // Firestore server timestamp
}
```

**Cascade delete:** When a form is deleted, all matching `form_responses` with that `formId` are batch-deleted via `app/api/forms/[id]/route.ts`.

---

### 7. `client_users` Collection

**Path:** `client_users/{docId}`
**Source:** `app/api/admin/users/route.ts`

Community users registered from the public-facing mobile/web app.

```typescript
interface ClientUser {
  id: string;                        // Document ID, added at read time
  name: string;
  email: string;
  profileUrl: string;                // Google profile photo URL
  resumeUrl: string;                 // Link to uploaded resume
  phoneNumber: string;
  branch: string;                    // e.g. "CSE", "ECE"
  graduationYear: number | null;
  role: string;                      // Default: "user"
  isBlocked: boolean;                // Toggleable via PATCH
  profileCompleted: boolean;
  participations: string[];          // Array of event/form IDs the user joined
  socialMedia: {                     // Dynamic key-value map
    linkedin?: string;
    github?: string;
    twitter?: string;
  };
  createdAt: Timestamp;              // Firestore server timestamp
  updatedAt: Timestamp;              // Firestore server timestamp
}
```

---

### 8. `users` Collection (Admin Portal)

**Path:** `users/{docId}`
**Source:** `scripts/seed-user.ts`

Internal admin portal user accounts. Seeded via the `addAdmin` script.

```typescript
interface AdminUser {
  email: string;
  name: string;
  password: string;        // SHA-256 hex hash
  isAdmin: boolean;
  createdAt: string;       // ISO string
  updatedAt: string;       // ISO string
}
```

---

### 9. `gallery` Collection

**Path:** `gallery/{docId}`
**Source:** Legacy — managed via admin portal

```typescript
interface GalleryImage {
  id: number;              // ⚠ Numeric ID (not the Firestore doc ID)
  imageUrl: string;        // Cloudinary URL
  uploadedAt: string;      // Date string e.g. "2025-12-31 00:00:00" (not a Timestamp)
}
```

---

## Architecture Notes

### Timestamp Conventions
| Collection | Timestamp Strategy |
|---|---|
| `managed_events`, `forms`, `form_responses`, `client_users` | `FieldValue.serverTimestamp()` (Firestore Timestamp) |
| `managed_gdg_team` | `new Date().toISOString()` (ISO string) |
| `users` (admin) | `new Date().toISOString()` (ISO string) |
| `events` (legacy) | Mixed — date strings like `"2025-10-18 00:00:00"` |
| `gallery` | Date strings |

### Relationships
- **`form_responses.formId`** → soft reference to `forms/{docId}` (cascade delete enforced in app logic)
- **`managed_events/{id}/registrations`** → subcollection (true parent-child)
- **`events/{id}/{subcollection}`** → 6 subcollections (batch-deleted with parent)

### Schema Enforcement
Firestore does not strictly enforce schemas at the database layer:
- **Validation** is done at the application level (API route handlers) and via TypeScript types.
- **No foreign keys** — all references are soft (application-enforced).

### Schema Analysis Script
Run `npx tsx scripts/analyzeSchema.ts` to re-analyze live Firestore data and compare against this document.