import { z } from "zod";

const schema = z.object({
  APP_URL: z.string().url(),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

export type Env = z.infer<typeof schema>;

/** Pure parser — tested in isolation. Throws (fails loud) on invalid env. */
export function parseEnv(raw: Record<string, string | undefined>): Env {
  const result = schema.safeParse(raw);
  if (!result.success) {
    throw new Error(
      `Invalid environment: ${result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")}`,
    );
  }
  return result.data;
}

/**
 * The validated env singleton for the running server.
 * Lazily initialised on first access so that test modules importing only
 * `parseEnv` are not affected by a missing APP_URL in the test process.
 */
let _cached: Env | undefined;
export const env = new Proxy({} as Env, {
  get(_target, prop) {
    if (_cached === undefined) {
      _cached = parseEnv(process.env);
    }
    return (_cached as Record<string | symbol, unknown>)[prop];
  },
  set(_t, prop) {
    throw new Error(`env is read-only: ${String(prop)}`);
  },
});

// ---------------------------------------------------------------------------
// Auth env
// ---------------------------------------------------------------------------

const authSchema = z.object({
  AUTH_GITHUB_ID: z.string().min(1),
  AUTH_GITHUB_SECRET: z.string().min(1),
  AUTH_SECRET: z.string().min(1),
  ALLOWED_GH_LOGIN: z.string().min(1).default("sagnikmitra"),
});

export type AuthEnv = z.infer<typeof authSchema>;

/** Pure parser for auth secrets — tested in isolation. Throws on invalid env. */
export function parseAuthEnv(raw: Record<string, string | undefined>): AuthEnv {
  const result = authSchema.safeParse(raw);
  if (!result.success) {
    throw new Error(
      `Invalid auth environment: ${result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")}`,
    );
  }
  return result.data;
}

/**
 * Lazily validated auth env singleton.
 * Never read from process.env at import/build time — only on first property access.
 */
let _authCached: AuthEnv | undefined;
export const authEnv = new Proxy({} as AuthEnv, {
  get(_target, prop) {
    if (_authCached === undefined) {
      _authCached = parseAuthEnv(process.env);
    }
    return (_authCached as Record<string | symbol, unknown>)[prop];
  },
  set(_t, prop) {
    throw new Error(`authEnv is read-only: ${String(prop)}`);
  },
});

// ---------------------------------------------------------------------------
// Repo env (GitHub read access)
// ---------------------------------------------------------------------------

const repoSchema = z.object({
  GITHUB_REPO_TOKEN: z.string().min(1),
  GITHUB_REPO: z.string().min(1).default("sagnikmitra/md"),
  GITHUB_BRANCH: z.string().min(1).default("main"),
});

export type RepoEnv = z.infer<typeof repoSchema>;

/** Pure parser for repo secrets — tested in isolation. Throws on invalid env. */
export function parseRepoEnv(raw: Record<string, string | undefined>): RepoEnv {
  const result = repoSchema.safeParse(raw);
  if (!result.success) {
    throw new Error(
      `Invalid repo environment: ${result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")}`,
    );
  }
  return result.data;
}

/**
 * Lazily validated repo env singleton.
 * Never read from process.env at import/build time — only on first property access.
 */
let _repoCached: RepoEnv | undefined;
export const repoEnv = new Proxy({} as RepoEnv, {
  get(_target, prop) {
    if (_repoCached === undefined) {
      _repoCached = parseRepoEnv(process.env);
    }
    return (_repoCached as Record<string | symbol, unknown>)[prop];
  },
  set(_t, prop) {
    throw new Error(`repoEnv is read-only: ${String(prop)}`);
  },
});

// ---------------------------------------------------------------------------
// AI provider env (all optional — each provider is opt-in by key)
// ---------------------------------------------------------------------------

const aiSchema = z.object({
  GOOGLE_GENERATIVE_AI_API_KEY: z.string().min(1).optional(),
  GROQ_API_KEY: z.string().min(1).optional(),
  CEREBRAS_API_KEY: z.string().min(1).optional(),
  MISTRAL_API_KEY: z.string().min(1).optional(),
  OPENROUTER_API_KEY: z.string().min(1).optional(),
  AI_MODEL: z.string().min(1).optional(),
  AI_GOOGLE_MODEL: z.string().min(1).optional(),
  AI_GROQ_MODEL: z.string().min(1).optional(),
  AI_CEREBRAS_MODEL: z.string().min(1).optional(),
  AI_MISTRAL_MODEL: z.string().min(1).optional(),
  AI_OPENROUTER_MODEL: z.string().min(1).optional(),
});

export type AiEnv = z.infer<typeof aiSchema>;

/**
 * Parse AI provider env. All fields are optional — a provider joins the
 * fallback chain only when its key is set. On a malformed value it strips the
 * offending keys rather than throwing, since AI is a non-essential enhancement
 * and must never break boot.
 */
export function parseAiEnv(raw: Record<string, string | undefined>): AiEnv {
  const result = aiSchema.safeParse(raw);
  return result.success ? result.data : {};
}

const AI_PROVIDER_KEYS = [
  "GOOGLE_GENERATIVE_AI_API_KEY",
  "GROQ_API_KEY",
  "CEREBRAS_API_KEY",
  "MISTRAL_API_KEY",
  "OPENROUTER_API_KEY",
] as const;

/** Provider key env-var names that are currently set (non-empty). */
export function configuredAiProviders(
  raw: Record<string, string | undefined> = process.env,
): string[] {
  return AI_PROVIDER_KEYS.filter((k) => {
    const v = raw[k];
    return typeof v === "string" && v.trim().length > 0;
  });
}

/**
 * True when at least one direct AI provider key is configured. Without one the
 * app falls back to the credit-gated Vercel AI Gateway (which 502s on the free
 * tier) — surfaces let operators warn on this.
 */
export function hasAnyAiProvider(raw?: Record<string, string | undefined>): boolean {
  return configuredAiProviders(raw).length > 0;
}

// ---------------------------------------------------------------------------
// Firebase web client config
// ---------------------------------------------------------------------------

const firebaseSchema = z.object({
  apiKey: z.string().min(1),
  authDomain: z.string().min(1),
  projectId: z.string().min(1),
  storageBucket: z.string().min(1),
  messagingSenderId: z.string().min(1),
  appId: z.string().min(1),
  measurementId: z.string().min(1).optional(),
});

export type FirebaseConfig = z.infer<typeof firebaseSchema>;

/**
 * Reads the Firebase web-app config from `NEXT_PUBLIC_*` env vars.
 *
 * These are NOT secrets — Firebase web config ships inside the client bundle
 * by design, and access is governed by Firestore security rules, not by
 * hiding the API key. They live in env vars anyway so a staging project can
 * be swapped in without a code change.
 *
 * CRITICAL: every var is read as a **literal** `process.env.NEXT_PUBLIC_X`
 * expression. Next.js inlines client-side env vars by static text
 * substitution at build time — a dynamic lookup (`process.env[key]`, or the
 * Proxy pattern used elsewhere in this file) resolves to `undefined` in the
 * browser. Do not refactor these into a loop.
 */
export function parseFirebaseConfig(): FirebaseConfig {
  const result = firebaseSchema.safeParse({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  });
  if (!result.success) {
    throw new Error(
      `Invalid Firebase config: ${result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")}`,
    );
  }
  return result.data;
}

// ---------------------------------------------------------------------------
// Dev-only bypass flags
// ---------------------------------------------------------------------------

/**
 * Snapshot of dev-bypass settings. Read once per call; never cached as
 * a singleton because `DEV_BYPASS_AUTH` is operator-flipped between
 * runs and we want the next `getActor()` to see the new value without
 * a server restart.
 *
 * `enabled` is the only field most callers should consult — it already
 * AND-s NODE_ENV === "development" with DEV_BYPASS_AUTH === "1". The
 * loopback-host check stays in presentation (it needs the request
 * headers), which is correct: this is config, not request-scoped state.
 */
export interface DevBypassFlags {
  enabled: boolean;
  allowedLogin: string;
}

export function readDevBypassFlags(): DevBypassFlags {
  // Direct env access lives only in src/config and src/**/infrastructure
  // per the clean-architecture gate. Presentation imports this helper.
  const nodeEnv = process.env["NODE_ENV"];
  const flag = process.env["DEV_BYPASS_AUTH"];
  const enabled = nodeEnv === "development" && flag === "1";
  const allowedLogin = process.env["ALLOWED_GH_LOGIN"] ?? "dev";
  return { enabled, allowedLogin };
}
