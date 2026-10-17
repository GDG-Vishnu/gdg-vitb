/**
 * Migrates the legacy flat "team_members" schema (position/designation/rank/
 * dept_rank duplicated per member) into a normalized schema:
 *
 *   departments/{deptId}      — { name, order, logo, bgColor }
 *   position_levels/{posId}   — { name, level, isDefault }
 *   team_members/{id}         — { ...member fields, deptId, positionId, order, history[] }
 *
 * Idempotent: skips departments/position_levels seeding if those collections
 * already have docs, and skips any team_members doc that already has a
 * `deptId` field (already migrated).
 *
 * MUST be run AFTER backup-team-data.ts.
 * Run with: npx tsx scripts/migrate-team-schema.ts
 */
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as dotenv from "dotenv";

dotenv.config();

function getAdminDb() {
  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID!,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
        privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
      }),
    });
  }
  return getFirestore();
}

function slugify(s: string): string {
  return (
    s
      .trim()
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "unspecified"
  );
}

// Canonical name for a legacy designation string, used to merge case/spacing
// variants (e.g. "Co Lead" / "Co-Lead") into the same default position level.
function canonicalDesignation(raw: string): { id: string; name: string } {
  const trimmed = raw.trim();
  const normalized = trimmed.toLowerCase().replace(/[\s-]+/g, "");
  if (normalized === "lead") return { id: "lead", name: "Lead" };
  if (normalized === "colead") return { id: "co-lead", name: "Co-Lead" };
  if (normalized === "associate") return { id: "associate", name: "Associate" };
  if (trimmed === "") return { id: "member", name: "Member" };
  return { id: slugify(trimmed), name: trimmed };
}

const DEFAULT_POSITION_LEVELS = [
  { id: "lead", name: "Lead", level: 1, isDefault: true },
  { id: "co-lead", name: "Co-Lead", level: 2, isDefault: true },
  { id: "associate", name: "Associate", level: 3, isDefault: true },
];

async function main() {
  const db = getAdminDb();
  const now = new Date().toISOString();

  const membersSnap = await db.collection("team_members").get();
  const allMembers = membersSnap.docs.map((d) => ({ id: d.id, ...d.data() } as any));

  const alreadyMigrated = allMembers.filter((m) => m.deptId);
  const legacyMembers = allMembers.filter((m) => !m.deptId);

  console.log(
    `Found ${allMembers.length} team_members docs (${alreadyMigrated.length} already migrated, ${legacyMembers.length} legacy to migrate).`,
  );

  // ---- 1. Derive departments from legacy `position` field ----
  type DeptAgg = {
    name: string;
    minDeptRank: number;
    bgColorCounts: Record<string, number>;
    logoCounts: Record<string, number>;
  };
  const deptAgg = new Map<string, DeptAgg>();

  for (const m of legacyMembers) {
    const name = String(m.position ?? "").trim() || "Unspecified";
    const id = slugify(name);
    const existing = deptAgg.get(id);
    const deptRank = typeof m.dept_rank === "number" ? m.dept_rank : 0;
    const bgColor = String(m.bgColor ?? "");
    const logo = String(m.dept_logo ?? "");

    if (!existing) {
      deptAgg.set(id, {
        name,
        minDeptRank: deptRank,
        bgColorCounts: bgColor ? { [bgColor]: 1 } : {},
        logoCounts: logo ? { [logo]: 1 } : {},
      });
    } else {
      existing.minDeptRank = Math.min(existing.minDeptRank, deptRank);
      if (bgColor) existing.bgColorCounts[bgColor] = (existing.bgColorCounts[bgColor] ?? 0) + 1;
      if (logo) existing.logoCounts[logo] = (existing.logoCounts[logo] ?? 0) + 1;
    }
  }

  function mostCommon(counts: Record<string, number>): string {
    let best = "";
    let bestCount = -1;
    for (const [k, c] of Object.entries(counts)) {
      if (c > bestCount) {
        best = k;
        bestCount = c;
      }
    }
    return best;
  }

  const deptEntries = [...deptAgg.entries()].sort(
    (a, b) => a[1].minDeptRank - b[1].minDeptRank,
  );

  const deptsCollection = db.collection("departments");
  const existingDepts = await deptsCollection.limit(1).get();
  const deptIdByName = new Map<string, string>(); // slug id -> slug id (self), kept for clarity

  if (existingDepts.empty) {
    const batch = db.batch();
    deptEntries.forEach(([id, agg], index) => {
      deptIdByName.set(id, id);
      batch.set(deptsCollection.doc(id), {
        name: agg.name,
        order: index,
        logo: mostCommon(agg.logoCounts),
        bgColor: mostCommon(agg.bgColorCounts),
        isActive: true,
        createdAt: now,
        updatedAt: now,
      });
    });
    await batch.commit();
    console.log(`Created ${deptEntries.length} departments.`);
  } else {
    deptEntries.forEach(([id]) => deptIdByName.set(id, id));
    console.log("departments collection already has data — skipping dept seeding.");
  }

  // ---- 2. Derive position levels from legacy `designation` field ----
  const positionsCollection = db.collection("position_levels");
  const existingPositions = await positionsCollection.limit(1).get();

  const customPositions = new Map<string, { name: string; firstSeenIndex: number }>();
  let idx = 0;
  for (const m of legacyMembers) {
    const { id, name } = canonicalDesignation(String(m.designation ?? ""));
    const isDefault = DEFAULT_POSITION_LEVELS.some((p) => p.id === id);
    if (!isDefault && !customPositions.has(id)) {
      customPositions.set(id, { name, firstSeenIndex: idx++ });
    }
  }

  if (existingPositions.empty) {
    const batch = db.batch();
    DEFAULT_POSITION_LEVELS.forEach((p) => {
      batch.set(positionsCollection.doc(p.id), {
        name: p.name,
        level: p.level,
        isDefault: true,
        createdAt: now,
        updatedAt: now,
      });
    });
    let level = DEFAULT_POSITION_LEVELS.length + 1;
    const sortedCustom = [...customPositions.entries()].sort(
      (a, b) => a[1].firstSeenIndex - b[1].firstSeenIndex,
    );
    sortedCustom.forEach(([id, info]) => {
      batch.set(positionsCollection.doc(id), {
        name: info.name,
        level: level++,
        isDefault: false,
        createdAt: now,
        updatedAt: now,
      });
    });
    await batch.commit();
    console.log(
      `Created ${DEFAULT_POSITION_LEVELS.length} default + ${sortedCustom.length} custom position levels.`,
    );
  } else {
    console.log("position_levels collection already has data — skipping position seeding.");
  }

  // ---- 3. Rewrite team_members into the normalized shape ----
  if (legacyMembers.length === 0) {
    console.log("No legacy members to migrate. Done.");
    return;
  }

  const batch = db.batch();
  for (const m of legacyMembers) {
    const deptName = String(m.position ?? "").trim() || "Unspecified";
    const deptId = slugify(deptName);
    const { id: positionId, name: positionName } = canonicalDesignation(
      String(m.designation ?? ""),
    );
    const order = typeof m.rank === "number" ? m.rank : 0;

    const newData = {
      name: m.name ?? "",
      imageUrl: m.imageUrl ?? "",
      logo: m.logo ?? "",
      linkedinUrl: m.linkedinUrl ?? "",
      mail: m.mail ?? "",
      isAlumni: Boolean(m.isAlumni),
      deptId,
      positionId,
      order,
      history: [
        {
          deptId,
          deptName,
          positionId,
          positionName,
          order,
          action: "assigned" as const,
          effectiveDate: now.slice(0, 10),
          recordedAt: now,
          recordedBy: "migration",
        },
      ],
      createdAt: now,
      updatedAt: now,
    };

    const ref = db.collection("team_members").doc(m.id);
    // Legacy fields explicitly removed so no stale duplicate data remains.
    batch.set(ref, newData, { merge: false });
  }

  await batch.commit();
  console.log(`Migrated ${legacyMembers.length} team_members docs to the new schema.`);
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
