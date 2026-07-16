/**
 * server-folder-blocklist.mjs — the folders that must not exist.
 *
 * Fails (exit 1) if any file remains under `src/server`, `src/lib`, or
 * `src/components`. The migration moves every file out of these into the
 * hexagonal layers; this is the final proof the god-folders are gone.
 *
 * Run: node specs/harness/server-folder-blocklist.mjs
 */
import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

function files(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) files(full, out);
    else out.push(full);
  }
  return out;
}

const blocked = files("src/server").concat(files("src/lib"), files("src/components"));
if (blocked.length) {
  console.error(JSON.stringify({ blocked }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ blocked: [] }, null, 2));
