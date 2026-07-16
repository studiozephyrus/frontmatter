/**
 * clean-architecture-report.mjs — layer-direction gate (the conclusive gate).
 *
 * Fails (exit 1) when:
 *   - app / presentation / application import from any infrastructure folder,
 *     `@/shared/infrastructure`, or a specific container service
 *     (the ONLY allowed container import is `@/container/dependency-container`).
 *   - domain / application import a framework or DB client (next, react,
 *     @supabase, postgrest, scoped-db).
 *   - domain / application / presentation reference `process.env`
 *     (env belongs in src/config and infrastructure folders only).
 *   - domain / application construct a raw DB client.
 *
 * Generic across any repo that follows the sgnk-next target structure
 * (src/app, src/modules/<m>/{domain,application,infrastructure,presentation},
 * src/shared/{domain,application,infrastructure,presentation}). Zero deps.
 *
 * Run: node specs/harness/clean-architecture-report.mjs
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join } from "node:path";

const roots = ["src"];
const sourceExtensions = new Set([".ts", ".tsx"]);
const violations = [];

function statSafe(path) {
  try {
    return statSync(path);
  } catch {
    return null;
  }
}

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSafe(full);
    if (!st) continue;
    if (st.isDirectory()) walk(full, out);
    else if (sourceExtensions.has(extname(entry))) out.push(full);
  }
  return out;
}

function layerOf(file) {
  if (file.startsWith("src/app/")) return "app";

  const parts = file.split("/");
  const moduleLayer = parts[3];
  if (parts[0] === "src" && parts[1] === "modules" && ["domain", "application", "infrastructure", "presentation"].includes(moduleLayer)) {
    return moduleLayer;
  }

  const sharedLayer = parts[2];
  if (parts[0] === "src" && parts[1] === "shared" && ["domain", "application", "infrastructure", "presentation"].includes(sharedLayer)) {
    return sharedLayer;
  }

  return null;
}

function lineNumber(text, index) {
  return text.slice(0, index).split("\n").length;
}

function add(kind, file, line, detail) {
  violations.push({ kind, file, line, detail });
}

function importSpecifiers(text) {
  const specs = [];
  const pattern = /\b(?:import|export)\s+(?:type\s+)?(?:[\s\S]*?\s+from\s+)?["']([^"']+)["']/g;
  for (const match of text.matchAll(pattern)) {
    specs.push({ specifier: match[1], index: match.index });
  }
  return specs;
}

function isInfrastructureImport(specifier) {
  return (
    specifier.includes("/infrastructure/") ||
    specifier.startsWith("@/shared/infrastructure") ||
    specifier.startsWith("@/container/")
  );
}

function isAllowedLayerImport(layer, specifier) {
  if (!["app", "presentation", "application"].includes(layer)) return true;
  // The composition root is the ONE container module app/presentation may import.
  if (specifier === "@/container/dependency-container") return true;
  return !isInfrastructureImport(specifier);
}

function isFrameworkOrDbImport(specifier) {
  return (
    specifier === "next" ||
    specifier.startsWith("next/") ||
    specifier === "react" ||
    specifier.startsWith("react/") ||
    specifier.startsWith("@supabase") ||
    specifier.includes("postgrest") ||
    specifier.includes("postgrest-client") ||
    specifier.includes("scoped-db")
  );
}

function scanProcessEnv(text, file, layer) {
  if (!["domain", "application", "presentation"].includes(layer)) return;
  for (const match of text.matchAll(/\bprocess\.env\b/g)) {
    add("process-env-outside-config-or-infrastructure", file, lineNumber(text, match.index), "process.env");
  }
}

function scanDbClient(text, file, layer) {
  if (!["domain", "application"].includes(layer)) return;
  for (const match of text.matchAll(/\bcreateClient\s*\(/g)) {
    add("db-client-in-domain-or-application", file, lineNumber(text, match.index), "createClient(");
  }
}

for (const file of roots.flatMap((root) => walk(root))) {
  const layer = layerOf(file);
  if (!layer) continue;

  const text = readFileSync(file, "utf8");
  for (const { specifier, index } of importSpecifiers(text)) {
    if (!isAllowedLayerImport(layer, specifier)) {
      add("layer-imports-infrastructure-or-container", file, lineNumber(text, index), specifier);
    }

    if (["domain", "application"].includes(layer) && isFrameworkOrDbImport(specifier)) {
      add("framework-or-db-import-in-domain-or-application", file, lineNumber(text, index), specifier);
    }
  }

  scanProcessEnv(text, file, layer);
  scanDbClient(text, file, layer);
}

const summary = violations.reduce((acc, violation) => {
  acc[violation.kind] = (acc[violation.kind] ?? 0) + 1;
  return acc;
}, {});

console.log(JSON.stringify({ total: violations.length, summary, violations }, null, 2));
if (violations.length) process.exit(1);
