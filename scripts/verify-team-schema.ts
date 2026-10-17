/**
 * Read-only sanity check after migrate-team-schema.ts: confirms every
 * team_members doc points at a real department and position level, and
 * prints the resulting department/order structure.
 *
 * Run with: npx tsx scripts/verify-team-schema.ts
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

async function main() {
  const db = getAdminDb();

  const [deptSnap, posSnap, memberSnap] = await Promise.all([
    db.collection("departments").orderBy("order").get(),
    db.collection("position_levels").orderBy("level").get(),
    db.collection("team_members").get(),
  ]);

  const depts = new Map(deptSnap.docs.map((d) => [d.id, d.data()]));
  const positions = new Map(posSnap.docs.map((d) => [d.id, d.data()]));
  // `id` placed last so a stray `id` field inside a doc's own data can never
  // shadow its real Firestore document id.
  const members = memberSnap.docs.map((d) => ({ ...d.data(), id: d.id } as any));

  let errors = 0;
  for (const m of members) {
    if (!m.deptId || !depts.has(m.deptId)) {
      console.error(`BROKEN REF: member ${m.id} (${m.name}) has invalid deptId "${m.deptId}"`);
      errors++;
    }
    if (!m.positionId || !positions.has(m.positionId)) {
      console.error(`BROKEN REF: member ${m.id} (${m.name}) has invalid positionId "${m.positionId}"`);
      errors++;
    }
    if (!Array.isArray(m.history) || m.history.length === 0) {
      console.error(`MISSING HISTORY: member ${m.id} (${m.name})`);
      errors++;
    }
    for (const stale of ["position", "designation", "rank", "dept_rank", "dept_logo", "bgColor", "roles"]) {
      if (stale in m) {
        console.error(`STALE FIELD: member ${m.id} (${m.name}) still has "${stale}"`);
        errors++;
      }
    }
  }

  console.log(`\n${depts.size} departments, ${positions.size} position levels, ${members.length} members.\n`);

  for (const [id, dept] of [...depts.entries()].sort((a, b) => a[1].order - b[1].order)) {
    const deptMembers = members
      .filter((m) => m.deptId === id)
      .sort((a, b) => a.order - b.order);
    console.log(`[${dept.order}] ${dept.name} (${id}) — bgColor=${dept.bgColor}`);
    deptMembers.forEach((m) => {
      const pos = positions.get(m.positionId);
      console.log(`    order=${m.order}  ${m.name}  —  ${pos?.name ?? "???"} (level ${pos?.level})`);
    });
  }

  console.log(errors === 0 ? "\nNo errors found." : `\n${errors} error(s) found.`);
}

main().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
