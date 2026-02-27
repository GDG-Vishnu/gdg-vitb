import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

/**
 * Firebase Admin SDK — server-side only (API routes, server components).
 * Uses a service-account key delivered via environment variables.
 *
 * Both the public website and the admin dashboard should point to the
 * same Firebase project so that writes from the admin are readable here.
 *
 * Required env vars (keep them in .env.local, NEVER commit):
 *   FIREBASE_PROJECT_ID
 *   FIREBASE_CLIENT_EMAIL
 *   FIREBASE_PRIVATE_KEY   (the JSON-encoded PEM string including \n)
 */

function getAdminApp(): App {
  if (getApps().length) {
    return getApps()[0];
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Missing Firebase Admin env vars. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY."
    );
  }

  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
}

const adminApp: App = getAdminApp();
const adminDb: Firestore = getFirestore(adminApp);

export { adminApp, adminDb };
