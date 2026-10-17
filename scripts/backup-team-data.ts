/**
 * Backs up the current "team_members" collection to a timestamped JSON file
 * before any schema migration. Run BEFORE migrate-team-schema.ts.
 *
 * Run with: npx tsx scripts/backup-team-data.ts
 */
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

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
  // `id` placed last so a stray `id` field inside a doc's own data can never
  // shadow its real Firestore document id.
  const docs = snap.docs.map((d) => ({ ...d.data(), id: d.id }));

  const dir = path.join(__dirname, "..", "backups");
  fs.mkdirSync(dir, { recursive: true });

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const file = path.join(dir, `team_members_${stamp}.json`);
  fs.writeFileSync(file, JSON.stringify(docs, null, 2), "utf-8");

  console.log(`Backed up ${docs.length} team_members docs to ${file}`);
}

main().catch((err) => {
  console.error("Backup failed:", err);
  process.exit(1);
});
