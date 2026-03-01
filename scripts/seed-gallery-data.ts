/**
 * Seed script — writes the gallery images to the Firestore "gallery" collection
 * (or keeps them as a JSON reference if the gallery is client-side only).
 *
 * Currently the gallery page uses hardcoded data. This script stores it in
 * Firestore so it can be managed centrally and restored after any wipe.
 *
 * Run with:  npx tsx scripts/seed-gallery-data.ts
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

interface GalleryItem {
  id: number;
  imageUrl: string;
  uploadedAt: string;
}

const galleryItems: GalleryItem[] = [
  {
    id: 1,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1771301326/ctv8yn9y6xaczodyjo0c.jpg",
    uploadedAt: "2025-12-31",
  },
  {
    id: 2,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767086900/prompt%20engineering/tk3aakahjoxsimjvidgm.jpg",
    uploadedAt: "2025-12-31",
  },
  {
    id: 3,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1765644013/mggyknteqkhgkb2w3grz.jpg",
    uploadedAt: "2025-12-31",
  },
  {
    id: 4,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767165297/nnpeqla0vy1pm2ftqt7r.jpg",
    uploadedAt: "2025-12-31",
  },
  {
    id: 5,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1771301326/gzruxxa5nyohbu9e1s7i.jpg",
    uploadedAt: "2025-12-31",
  },
  {
    id: 6,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1771301325/bdkiturqrivu4rmzkmnl.jpg",
    uploadedAt: "2025-12-31",
  },
  {
    id: 7,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767170501/joat26rbj3rb0kdja0ue.jpg",
    uploadedAt: "2025-12-31",
  },
  {
    id: 8,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767170551/sghz2b8xtbolh90rj6ye.jpg",
    uploadedAt: "2025-12-31",
  },
  {
    id: 9,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1766732847/uumcqlo3robkw70z9rhk.jpg",
    uploadedAt: "2025-12-31",
  },
  {
    id: 10,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1766732840/igrrs1fp9ag45hqzz64r.jpg",
    uploadedAt: "2025-12-31",
  },
  {
    id: 11,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767175612/jxsg0t4bozchigoqodga.png",
    uploadedAt: "2025-12-31",
  },
  {
    id: 12,
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767175818/nrei8nrsar4iio30ukkh.jpg",
    uploadedAt: "2025-12-31",
  },
];

/**
 * Cover image used on the gallery page.
 */
const coverImageUrl =
  "https://res.cloudinary.com/dlupkibvq/image/upload/v1767175693/f7gerxglae9pomxppanb.png";

async function main() {
  const db = getAdminDb();
  const batch = db.batch();

  console.log("Seeding gallery collection...\n");

  // Store each gallery image as its own document
  for (const item of galleryItems) {
    const ref = db.collection("gallery").doc(String(item.id));
    batch.set(ref, {
      imageUrl: item.imageUrl,
      uploadedAt: item.uploadedAt,
      order: item.id,
      createdAt: FieldValue.serverTimestamp(),
    });
    console.log(`  Queued gallery image #${item.id}`);
  }

  // Store the cover image as a config document
  const coverRef = db.collection("gallery").doc("__cover__");
  batch.set(coverRef, {
    imageUrl: coverImageUrl,
    type: "cover",
    createdAt: FieldValue.serverTimestamp(),
  });
  console.log("  Queued cover image");

  await batch.commit();
  console.log(
    `\nAll ${galleryItems.length} gallery images + cover seeded successfully!`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
