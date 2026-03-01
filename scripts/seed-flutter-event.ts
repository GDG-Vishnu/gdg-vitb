/**
 * Seed script — adds the Flutter Development Workshop event to Firestore.
 * Run with:  npx tsx scripts/seed-flutter-event.ts
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
  const db = getAdminDb();

  const event = {
    title: "Flutter Development Workshop",
    description:
      "A hands-on Flutter workshop designed to help students build beautiful cross-platform mobile applications using Dart and Flutter. Participants will learn UI building, state management, and deploy their first mobile app.",
    coverUrl:
      "https://res.cloudinary.com/dkxopbdbu/image/upload/v1772210024/fl_coverpage_oxqgbm.png",
    imageUrl:
      "https://res.cloudinary.com/dkxopbdbu/image/upload/v1772209920/flutter_mgelgr.png",
    Date: new Date(), // November 15, 2024, 9:00 AM
    Time: "9:00 AM - 12:00 PM",
    venue: "Seminar Hall - Block A",
    organizer: "GDG VIT",
    coOrganizer: "Tech Team",
    Theme: ["#4285F4", "#34A853", "#EA4335", "#FBBC04"],
    tags: ["Flutter", "Mobile Development", "Beginner Friendly"],
    keyHighlights: [
      "Introduction to Flutter & Dart",
      "Hands-on UI Development",
      "State Management Basics",
      "Build Your First App",
      "Certificate of Participation",
    ],
    eventGallery: [],
    MembersParticipated: 120,
    rank: 5,
    status: "Ongoing",
    isDone: false,
    registrationEnabled: true,
    teamSizeMin: 1,
    teamSizeMax: 1,
  };

  console.log("Inserting Flutter Development Workshop event...");

  const ref = await db.collection("events").add({
    ...event,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  console.log(`Created event: ${event.title} with ID: ${ref.id}`);
  console.log("Done!");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
