/**
 * Firebase client-SDK singletons.
 *
 * Everything here is lazy. Nothing touches `process.env` or contacts Firebase
 * at module-import time, so importing this file during a build, a test, or a
 * server render is free — matching the discipline the rest of `src/config`
 * follows for env access.
 *
 * `getApps()` is checked before `initializeApp()` because Next.js Fast Refresh
 * re-evaluates modules; a second `initializeApp` with the same name throws.
 */
import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { parseFirebaseConfig } from "@/config/env";

const APP_NAME = "frontmatter";

export function firebaseApp(): FirebaseApp {
  const existing = getApps().find((a) => a.name === APP_NAME);
  if (existing !== undefined) return existing;
  const { measurementId, ...required } = parseFirebaseConfig();
  // Under `exactOptionalPropertyTypes`, FirebaseOptions rejects an explicit
  // `measurementId: undefined` — the key has to be absent, not undefined.
  const options = measurementId === undefined ? required : { ...required, measurementId };
  try {
    return initializeApp(options, APP_NAME);
  } catch {
    // Lost a race with a concurrent initialise (Fast Refresh, double render).
    return getApp(APP_NAME);
  }
}

export function firebaseAuth(): Auth {
  return getAuth(firebaseApp());
}

export function firestore(): Firestore {
  return getFirestore(firebaseApp());
}
