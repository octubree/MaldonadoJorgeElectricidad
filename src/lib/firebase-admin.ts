import { initializeApp, cert, getApp, type App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

/**
 * Firebase Admin SDK singleton.
 *
 * Reads the service account from `FIREBASE_SERVICE_ACCOUNT_KEY`
 * (a base64-encoded JSON string). If the env var is missing or
 * invalid, the singleton resolves to `null` and the rest of the
 * app falls back to "demo mode" (sample photos, no admin writes).
 *
 * The app is cached on `globalThis` to avoid re-initializing on
 * every hot reload / serverless invocation.
 */
const globalForFirebase = globalThis as unknown as {
  firebaseAdmin?: App;
};

function initFirebase(): App | null {
  const key = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!key) return null; // graceful: not configured

  if (globalForFirebase.firebaseAdmin) return globalForFirebase.firebaseAdmin;

  try {
    const serviceAccount = JSON.parse(
      Buffer.from(key, "base64").toString("utf8")
    );

    // Avoid the "already exists" error if a default app was initialized elsewhere.
    let app: App;
    try {
      app = getApp("jorge-admin");
    } catch {
      app = initializeApp(
        { credential: cert(serviceAccount) },
        "jorge-admin"
      );
    }

    globalForFirebase.firebaseAdmin = app;
    return app;
  } catch (e) {
    console.error("Firebase init error:", e);
    return null;
  }
}

export const firebaseApp = initFirebase();
export const firestore = firebaseApp ? getFirestore(firebaseApp) : null;
export const isFirebaseConfigured = Boolean(firebaseApp);

/**
 * Lazy accessor for the Firestore collection reference.
 * Returns `null` when Firebase isn't configured so callers
 * can branch cleanly.
 */
export function portfolioCollection() {
  if (!firestore) return null;
  return firestore.collection("portfolioItems");
}
