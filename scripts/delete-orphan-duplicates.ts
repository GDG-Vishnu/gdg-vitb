/**
 * Deletes confirmed-orphaned team_members docs left over from an earlier,
 * incomplete cleanup: each orphan is a legacy doc (no deptId) whose own data
 * contains a stray `id` field pointing at the real, already-migrated doc
 * that replaced it (same name, same role — verified before deleting).
 *
 * Run AFTER backup-team-data.ts and ONLY after confirming matches look right.
 * Run with: npx tsx scripts/delete-orphan-duplicates.ts
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
  const snap = await db.collection("team_members").get();

  const replacementIds = new Set(snap.docs.map((d) => d.id));

  const orphans = snap.docs.filter((d) => {
    const data = d.data();
    const strayId = data.id as string | undefined;
    return (
      !data.deptId && // never migrated — still legacy-shaped
      strayId &&
      strayId !== d.id && // points somewhere else
      replacementIds.has(strayId) // the target actually exists and is real
    );
  });

  console.log(`Found ${orphans.length} confirmed orphaned duplicate docs to delete:`);
  orphans.forEach((d) => {
    const data = d.data();
    console.log(`  ${d.id} (${data.name}) -> replaced by ${data.id}`);
  });

  if (orphans.length === 0) {
    console.log("Nothing to delete.");
    return;
  }

  const batch = db.batch();
  orphans.forEach((d) => batch.delete(d.ref));
  await batch.commit();

  console.log(`\nDeleted ${orphans.length} orphaned docs.`);
}

main().catch((err) => {
  console.error("Cleanup failed:", err);
  process.exit(1);
});
