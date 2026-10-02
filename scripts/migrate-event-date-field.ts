/**
 * Migration — rename `event_data` -> `event_date` in user registration docs.
 *
 * A previous client build wrote new Date().toISOString() to `event_data`
 * instead of `event_date` in client_users/{uid}/registrations/{eventId}.
 * This script copies the value to `event_date` (if missing) and removes the
 * legacy field.
 *
 * Dry run by default. Apply with:  npx tsx scripts/migrate-event-date-field.ts --write
 *
 * Requires FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY
 * in .env.local.
 */
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

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
  const write = process.argv.includes("--write");
  const db = getAdminDb();
  console.log(
    `Scanning client_users/*/registrations for legacy 'event_data' field (${write ? "WRITE" : "DRY-RUN"})...\n`,
  );

  const snap = await db.collectionGroup("registrations").get();
  let scanned = 0;
  let candidates = 0;
  let updated = 0;

  for (const doc of snap.docs) {
    scanned += 1;
    const data = doc.data() as Record<string, unknown>;
    if (data.event_data === undefined || data.event_data === null) continue;
    if (data.event_date !== undefined && data.event_date !== null) {
      // Both exist — just drop the legacy field.
      candidates += 1;
      console.log(`  ${doc.ref.path}: has both fields, will remove legacy field`);
      if (write) {
        await doc.ref.update({ event_data: FieldValue.delete() });
        updated += 1;
      }
      continue;
    }
    candidates += 1;
    console.log(
      `  ${doc.ref.path}: will copy event_data -> event_date (${String(data.event_data).slice(0, 32)})`,
    );
    if (write) {
      await doc.ref.update({
        event_date: data.event_data,
        event_data: FieldValue.delete(),
      });
      updated += 1;
    }
  }

  console.log(
    `\nScanned ${scanned} registration docs, ${candidates} with legacy field${write ? `, ${updated} updated` : " (dry-run, no writes)"}.`,
  );
  if (!write && candidates > 0) {
    console.log("Re-run with --write to apply.");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
