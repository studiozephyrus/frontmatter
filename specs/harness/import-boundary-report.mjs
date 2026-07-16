/**
 * import-boundary-report.mjs — hard ban on legacy god-folder aliases.
 *
 * Fails (exit 1) if any source file still references `@/server`, `@/lib`, or
 * `@/components`. These are the three folders the migration deletes; once the
 * codebase is clean this must stay at zero forever. Keep this distinct from
 * clean-architecture-report.mjs (which owns layer direction) — this owns the
 * legacy-path ban only.
 *
 * Run: node specs/harness/import-boundary-report.mjs
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const roots = ["src", "test"];
const exts = new Set([".ts", ".tsx", ".mjs"]);

function statSafe(path) {
  try {
    return statSync(path);
  } catch {
    return null;
  }
}

function walk(dir, out = []) {
  if (!statSafe(dir)?.isDirectory()) return out;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSafe(full);
    if (!st) continue;
    if (st.isDirectory()) walk(full, out);
    else if (exts.has(extname(entry))) out.push(full);
  }
  return out;
}

const report = { serverImports: [], libImports: [], componentImports: [] };
const serverAlias = "@/" + "server";
const libAlias = "@/" + "lib";
const componentsAlias = "@/" + "components";

for (const file of roots.flatMap((root) => walk(root))) {
  const text = readFileSync(file, "utf8");
  if (text.includes(serverAlias)) report.serverImports.push(file);
  if (text.includes(libAlias)) report.libImports.push(file);
  if (text.includes(componentsAlias)) report.componentImports.push(file);
}

console.log(JSON.stringify(report, null, 2));
if (report.serverImports.length || report.libImports.length || report.componentImports.length) process.exit(1);
