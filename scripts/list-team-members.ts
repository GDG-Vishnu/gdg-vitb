#!/usr/bin/env node
/**
 * List all team members from the Firestore "team" collection.
 * Run with:  npx tsx scripts/list-team-members.ts
 */
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import "dotenv/config";

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
  const snap = await db.collection("team").orderBy("name", "asc").get();

  if (snap.empty) {
    console.log("No team members found.");
    return;
  }

  console.log(`Found ${snap.size} team member(s):`);
  for (const doc of snap.docs) {
    console.log(`- ${doc.data().name}`);
  }
}

main().catch((err) => {
  console.error("Error querying team members:", err);
  process.exitCode = 1;
});
