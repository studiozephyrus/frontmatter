/**
 * route-inventory.mjs — deterministic route list for before/after parity.
 *
 * Walks `src/app` and prints every route file with its computed URL path
 * (route groups in parentheses are stripped, since they don't affect the URL).
 * Capture this before a restructure and diff after — an empty diff proves no
 * public URL changed. Zero deps.
 *
 * Run: node specs/harness/route-inventory.mjs
 */
import { existsSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const root = "src/app";
const routeFiles = new Set([
  "page.tsx", "route.ts", "layout.tsx", "loading.tsx",
  "error.tsx", "global-error.tsx", "not-found.tsx", "default.tsx",
]);

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, out);
    else if (routeFiles.has(entry)) out.push(full);
  }
  return out;
}

function routePath(file) {
  const parts = relative(root, file).split(sep).slice(0, -1).filter((part) => !part.startsWith("("));
  const path = `/${parts.join("/")}`.replace(/\/+/g, "/");
  return path === "/" ? "/" : path.replace(/\/$/, "");
}

const inventory = walk(root)
  .map((file) => ({ file, route: routePath(file) }))
  .sort((a, b) => a.file.localeCompare(b.file));

console.log(JSON.stringify(inventory, null, 2));
