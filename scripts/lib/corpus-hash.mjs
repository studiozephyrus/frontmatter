/**
 * Shared corpus loader with real integrity verification. (PLAN §6.7 finding 4)
 *
 * Every gate that reads `corpus-manifest.json` used to print `corpus_id` as if it had been
 * checked, when the only actual integrity check anywhere was counting how many loaded files
 * started with `---`. That count is blind to the one thing that matters: two of the three
 * pinned roots (`md`, `knowledge`) are live vaults edited daily, so a body edit leaves the
 * file count at 907 while quietly changing the bytes every gate is supposed to be testing.
 *
 * This re-hashes every file against the manifest's own per-file `sha256` at load time and
 * reports which ones drifted, instead of trusting a stale byte count. Drifted files are still
 * included in the returned corpus — the writer has to work on whatever is really on disk, pin
 * or no pin — but the drift is now visible instead of silently absorbed into "907/907".
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export function sha256(text) {
  return crypto.createHash("sha256").update(text, "utf8").digest("hex");
}

/**
 * @param {string} manifestPath
 * @param {Record<string,string>} roots  root name -> local filesystem base path
 * @returns {{
 *   man: any,
 *   files: { path: string, src: string }[],
 *   drifted: { path: string, pinned: string, live: string }[],
 *   missing: string[],
 * }}
 */
export function loadVerifiedCorpus(manifestPath, roots) {
  if (!fs.existsSync(manifestPath)) {
    return { man: null, files: [], drifted: [], missing: [] };
  }
  const man = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const files = [];
  const drifted = [];
  const missing = [];

  for (const [root, info] of Object.entries(man.roots)) {
    const base = roots[root];
    if (!base || !fs.existsSync(base)) continue;
    for (const f of info.files) {
      let src;
      try {
        src = fs.readFileSync(path.join(base, f.path), "utf8");
      } catch {
        missing.push(`${root}/${f.path}`); // moved or deleted since the manifest was pinned
        continue;
      }
      const live = sha256(src);
      if (live !== f.sha256) {
        drifted.push({ path: `${root}/${f.path}`, pinned: f.sha256, live });
      }
      files.push({ path: `${root}/${f.path}`, src });
    }
  }
  return { man, files, drifted, missing };
}
