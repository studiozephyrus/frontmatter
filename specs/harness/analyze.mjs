/**
 * analyze.mjs — one-shot Next.js repo analyzer for sgnk-next.
 *
 * Read-only. Walks the repo and prints a JSON scorecard across structure,
 * clean-architecture violations, code quality, Next.js correctness, production
 * readiness, and deployment readiness — then recommends an entry phase. Run it
 * FIRST on any project to decide what work is needed. Zero dependencies.
 *
 * Run from the repo root: node <skill>/scripts/analyze.mjs
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, basename } from "node:path";

const SRC = "src";
const exts = new Set([".ts", ".tsx"]);

function statSafe(p) { try { return statSync(p); } catch { return null; } }
function exists(p) { return existsSync(p); }
function read(p) { try { return readFileSync(p, "utf8"); } catch { return ""; } }
function walk(dir, out = []) {
  if (!statSafe(dir)?.isDirectory()) return out;
  for (const e of readdirSync(dir)) {
    const full = join(dir, e);
    const st = statSafe(full);
    if (!st) continue;
    if (st.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}
function count(re, text) { let n = 0; for (const _ of text.matchAll(re)) n++; return n; }

const allFiles = walk(SRC);
const sourceFiles = allFiles.filter((f) => exts.has(extname(f)));

function layerOf(file) {
  if (file.startsWith("src/app/")) return "app";
  const p = file.split("/");
  if (p[1] === "modules" && ["domain", "application", "infrastructure", "presentation"].includes(p[3])) return p[3];
  if (p[1] === "shared" && ["domain", "application", "infrastructure", "presentation"].includes(p[2])) return p[2];
  return null;
}
function importSpecs(text) {
  const out = [];
  for (const m of text.matchAll(/\b(?:import|export)\s+(?:type\s+)?(?:[\s\S]*?\s+from\s+)?["']([^"']+)["']/g)) out.push(m[1]);
  return out;
}

// ── Structure ────────────────────────────────────────────────────────────
const godFolders = {
  "src/server": walk("src/server").length,
  "src/lib": walk("src/lib").length,
  "src/components": walk("src/components").length,
};
const structure = {
  hasModules: exists("src/modules"),
  hasSharedLayers: ["domain", "application", "infrastructure", "presentation"].every((l) => exists(`src/shared/${l}`)),
  hasCompositionRoot: exists("src/container/dependency-container.ts"),
  hasTypedEnv: exists("src/config/env.ts"),
  hasMiddleware: exists("src/proxy.ts") || exists("src/middleware.ts"),
};

// ── Legacy aliases + layer violations + env ──────────────────────────────
let legacyAliasRefs = 0;
const layerViolations = [];
const processEnvByLayer = {};
const deepCrossModuleImports = [];

for (const file of sourceFiles) {
  const text = read(file);
  legacyAliasRefs += count(/@\/(server|lib|components)\//g, text);
  const layer = layerOf(file);
  const moduleName = file.startsWith("src/modules/") ? file.split("/")[2] : null;

  for (const spec of importSpecs(text)) {
    if (["app", "presentation", "application"].includes(layer)) {
      const infra = spec.includes("/infrastructure/") || spec.startsWith("@/shared/infrastructure") || spec.startsWith("@/container/");
      if (infra && spec !== "@/container/dependency-container") layerViolations.push({ file, spec });
    }
    // deep cross-module import (reaching past another module's public API)
    const m = spec.match(/^@\/modules\/([^/]+)\/(domain|application|infrastructure|presentation)\//);
    if (m && m[1] !== moduleName) deepCrossModuleImports.push({ file, spec });
  }
  if (["domain", "application", "presentation"].includes(layer)) {
    const n = count(/\bprocess\.env\b/g, text);
    if (n) processEnvByLayer[layer] = (processEnvByLayer[layer] ?? 0) + n;
  }
}

// ── Modules health ───────────────────────────────────────────────────────
const moduleDirs = exists("src/modules") ? readdirSync("src/modules").filter((d) => statSafe(`src/modules/${d}`)?.isDirectory()) : [];
const barrels = moduleDirs.filter((d) => exists(`src/modules/${d}/index.ts`)).length;

// ── Tests ────────────────────────────────────────────────────────────────
const testFiles = [...walk("src"), ...walk("test")].filter((f) => /\.(test|spec)\.(ts|tsx)$/.test(f));

// ── TS strictness + tooling ──────────────────────────────────────────────
const tsconfig = read("tsconfig.json");
const ts = {
  strict: /"strict"\s*:\s*true/.test(tsconfig),
  noUncheckedIndexedAccess: /"noUncheckedIndexedAccess"\s*:\s*true/.test(tsconfig),
  exactOptionalPropertyTypes: /"exactOptionalPropertyTypes"\s*:\s*true/.test(tsconfig),
};
const pkg = read("package.json");
const tooling = {
  hasTypecheckScript: /"typecheck"\s*:/.test(pkg),
  hasPrettier: exists(".prettierrc") || exists(".prettierrc.json") || exists(".prettierrc.mjs") || exists("prettier.config.js") || exists("prettier.config.mjs") || /"prettier"\s*:/.test(pkg) || /"@biomejs\/biome"/.test(pkg),
  hasNodePin: exists(".nvmrc") || /"engines"\s*:/.test(pkg),
  hasEslintBoundaries: /"eslint-plugin-boundaries"/.test(pkg),
  hasCI: exists(".github/workflows"),
  ciRunsHarness: walk(".github/workflows").some((f) => /harness|clean-architecture-report/.test(read(f))),
};

// ── Next.js correctness ──────────────────────────────────────────────────
let useClient = 0, anyUsage = 0, tsIgnore = 0, suspense = 0, revalidateExports = 0, invalidation = 0;
for (const file of sourceFiles) {
  const text = read(file);
  if (/^["']use client["']/m.test(text)) useClient++;
  anyUsage += count(/:\s*any\b|as any\b/g, text);
  tsIgnore += count(/@ts-(ignore|expect-error)/g, text);
  suspense += count(/\bSuspense\b/g, text);
  revalidateExports += count(/export const revalidate\b/g, text);
  invalidation += count(/revalidateTag|updateTag|['"]use cache['"]/g, text);
}
const appFiles = (n) => walk("src/app").filter((f) => basename(f) === n).length;
const next = {
  useClientFiles: useClient,
  errorBoundaries: appFiles("error.tsx"),
  loadingFiles: appFiles("loading.tsx"),
  notFound: appFiles("not-found.tsx") + appFiles("global-not-found.tsx"),
  globalError: appFiles("global-error.tsx"),
  metadataRoutes: walk("src/app").filter((f) => /export const metadata|generateMetadata/.test(read(f))).length,
  suspenseUsages: suspense,
  isrRevalidateExports: revalidateExports,
  cacheInvalidationSites: invalidation,
  cacheComponentsOn: /cacheComponents\s*:\s*true/.test(read("next.config.ts") + read("next.config.mjs") + read("next.config.js")),
};

// ── SEO / observability / god files ──────────────────────────────────────
const seo = {
  sitemap: appFiles("sitemap.ts"), robots: appFiles("robots.ts"),
  ogImage: walk("src/app").filter((f) => /opengraph-image|twitter-image/.test(basename(f))).length,
  manifest: appFiles("manifest.ts"),
};
const observability = { instrumentation: exists("src/instrumentation.ts") || exists("instrumentation.ts"), otel: sourceFiles.some((f) => /otel|opentelemetry/i.test(read(f))) };
const godFiles = sourceFiles.map((f) => ({ f, lines: read(f).split("\n").length })).filter((x) => x.lines > 500).sort((a, b) => b.lines - a.lines).slice(0, 10);

// ── SaaS commercialization signals ───────────────────────────────────────
const grep = (re) => sourceFiles.some((f) => re.test(read(f)));
const hasModule = (m) => exists(`src/modules/${m}`);
const migrationFiles = [...walk("supabase"), ...walk("prisma"), ...walk("db"), ...walk("migrations")].filter((f) => f.endsWith(".sql"));
const saas = {
  multiTenancy: grep(/TenantContext|tenant-context/) || exists("src/shared/infrastructure/database/scoped-db.ts"),
  rlsPolicies: migrationFiles.some((f) => /row level security|create policy/i.test(read(f))),
  billing: hasModule("billing") || grep(/stripe/i),
  entitlementsOrQuota: grep(/entitlement|checkQuota|\bquota\b/i),
  publicApiWithKeys: hasModule("public-api") || grep(/authenticateApiKey|api_keys/),
  dataRightsGdpr: grep(/exportTenantData|deleteTenantData|data-rights/),
  featureFlags: hasModule("flags") || grep(/featureFlag|isEnabled\s*\(/),
  auditLog: exists("src/shared/infrastructure/audit/audit-writer.ts") || grep(/auditWriter|\baudit\s*\(/),
  webhooks: hasModule("webhooks"),
};
const saasScore = Object.values(saas).filter(Boolean).length;

// ── Recommend entry phase ────────────────────────────────────────────────
let phase;
const godFolderFiles = godFolders["src/server"] + godFolders["src/lib"] + godFolders["src/components"];
if (godFolderFiles > 0 || legacyAliasRefs > 0) phase = "Phase 1 — No-Server Migration";
else if (layerViolations.length > 0 || !structure.hasCompositionRoot || (processEnvByLayer.application ?? 0) > 0) phase = "Phase 2 — Conclusive Clean Architecture Pass";
else phase = "Phase 3 — Scalability + Production + Deployment hardening";

const report = {
  recommendedEntryPhase: phase,
  structure: { godFolders, ...structure },
  cleanArchitecture: {
    legacyAliasRefs,
    layerViolations: layerViolations.length,
    layerViolationSamples: layerViolations.slice(0, 10),
    processEnvByLayer,
  },
  modules: { count: moduleDirs.length, barrels, deepCrossModuleImports: deepCrossModuleImports.length },
  tests: { files: testFiles.length },
  typescript: ts,
  tooling,
  nextjs: next,
  seo,
  observability,
  saasReadiness: { score: `${saasScore}/9`, ...saas },
  godFilesOver500: godFiles,
  codeSmells: { anyUsage, tsIgnore },
};

console.log(JSON.stringify(report, null, 2));
