/**
 * Password verification for the username/password login fallback.
 *
 * Hash format (PHC-ish, single line, no whitespace):
 *   scrypt$N=<n>,r=<r>,p=<p>$<salt_hex>$<hash_hex>
 *
 * Verification:
 *   - Re-derive scrypt over (password, salt) with the encoded params.
 *   - Compare to stored hash via `timingSafeEqual` (constant-time).
 *
 * Generation (one-off, in a Node REPL — never in app code):
 *   const c = require("crypto");
 *   const s = c.randomBytes(16);
 *   c.scrypt("<password>", s, 64, { N: 16384, r: 8, p: 1 }, (_, h) => {
 *     console.log(`scrypt$N=16384,r=8,p=1$${s.toString("hex")}$${h.toString("hex")}`);
 *   });
 *
 * Stored in `SGNK_AUTH_HASH` env var. Plain password is NEVER persisted.
 */
import { scrypt, timingSafeEqual } from "node:crypto";

type ScryptParams = { N: number; r: number; p: number };

function parseHash(encoded: string): { params: ScryptParams; salt: Buffer; hash: Buffer } | null {
  // scrypt$N=16384,r=8,p=1$<salt_hex>$<hash_hex>
  const parts = encoded.split("$");
  if (parts.length !== 4) return null;
  const [algo, paramStr, saltHex, hashHex] = parts;
  if (algo !== "scrypt" || !paramStr || !saltHex || !hashHex) return null;

  const params: Partial<ScryptParams> = {};
  for (const kv of paramStr.split(",")) {
    const [k, v] = kv.split("=");
    if (!k || !v) return null;
    const n = Number(v);
    if (!Number.isFinite(n) || n <= 0) return null;
    if (k === "N") params.N = n;
    else if (k === "r") params.r = n;
    else if (k === "p") params.p = n;
  }
  if (!params.N || !params.r || !params.p) return null;

  let salt: Buffer;
  let hash: Buffer;
  try {
    salt = Buffer.from(saltHex, "hex");
    hash = Buffer.from(hashHex, "hex");
  } catch {
    return null;
  }
  if (salt.length === 0 || hash.length === 0) return null;

  return { params: params as ScryptParams, salt, hash };
}

function derive(password: string, salt: Buffer, params: ScryptParams, dkLen: number): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(
      password,
      salt,
      dkLen,
      { N: params.N, r: params.r, p: params.p, maxmem: 128 * 1024 * 1024 },
      (err, derived) => (err ? reject(err) : resolve(derived)),
    );
  });
}

/**
 * Constant-time password verification.
 * Returns true iff `password` re-derives to the stored hash.
 *
 * Always runs the scrypt KDF (even on malformed hash) so timing does not
 * leak whether the env var was configured. Returns false on any error.
 */
export async function verifyPassword(password: string, encoded: string | undefined): Promise<boolean> {
  // Always derive against a dummy hash if the env is missing/malformed, so
  // request timing doesn't reveal config state.
  const dummySalt = Buffer.alloc(16, 0);
  const dummyParams: ScryptParams = { N: 16384, r: 8, p: 1 };

  if (!encoded) {
    await derive(password, dummySalt, dummyParams, 64).catch(() => null);
    return false;
  }

  const parsed = parseHash(encoded);
  if (!parsed) {
    await derive(password, dummySalt, dummyParams, 64).catch(() => null);
    return false;
  }

  try {
    const derived = await derive(password, parsed.salt, parsed.params, parsed.hash.length);
    if (derived.length !== parsed.hash.length) return false;
    return timingSafeEqual(derived, parsed.hash);
  } catch {
    return false;
  }
}
