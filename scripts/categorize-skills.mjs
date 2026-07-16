#!/usr/bin/env node
/**
 * One-shot: categorize ./Skills/<name>/** into ./Skills/<Category>/<name>/**
 * and delete the duplicate ./Projects/HQ/Skills/** tree. Issues a single
 * atomic commit via /api/commit so the GitHub history stays clean.
 *
 * Auth: relies on the dev server's DEV_BYPASS_AUTH=1 + localhost gate.
 * Run while `npm run dev` is up.
 *
 *   node scripts/categorize-skills.mjs
 *
 * Idempotent: if a path already lives under Skills/<cat>/..., it is skipped.
 */
const BASE = process.env.SGNK_BASE || "http://localhost:3000";
const CONCURRENCY = 8;

function categoryFor(name) {
  const n = name.toLowerCase().replace(/_/g, "-").replace(/ /g, "-");
  if (n.startsWith("pp-") || n.startsWith("printing-press")) return "Printing Press";
  if (n.startsWith("gstack") || n === "gstack") return "GStack";
  if (n.startsWith("vercel")) return "Integrations";
  if (n.startsWith("cloudflare") || n.includes("cloudflare")) return "Integrations";
  if (n.startsWith("sentry")) return "Integrations";
  if (n.startsWith("supabase")) return "Integrations";
  if (n.startsWith("firecrawl")) return "Integrations";
  if (n.startsWith("figma")) return "Integrations";
  if (n.startsWith("anthropic")) return "Anthropic Skills";
  if (n.startsWith("claude-mem")) return "Claude Mem";
  if (n.startsWith("claude-code") || ["init","review","verify","run","schedule","loop","code-review","security-review","fewer-permission-prompts","update-config","keybindings-help","claude-api"].includes(n)) return "Claude Code";
  if (n.startsWith("caveman")) return "Caveman";
  if (n.startsWith("codspeed")) return "CodSpeed";
  if (n.startsWith("chrome-devtools")) return "Chrome DevTools";
  if (n.startsWith("coderabbit")) return "CodeRabbit";
  if (n.startsWith("superpowers")) return "Superpowers";
  if (n.startsWith("plan-") || n === "autoplan" || n === "retro") return "Planning";
  if (n.startsWith("design") || n === "ux-revamp") return "Design";
  if (["cso","devex-review","document-release","qa","qa-only","web-design-guidelines","pr-review-toolkit","skill-creator","claude-md-management"].includes(n)) return "Review";
  if (["sgnk-next","sgnk-react","nextjs-monorepo","react-best-practices","react-native-skills","react-view-transitions","composition-patterns","supabase-postgres-best-practices"].includes(n)) return "Frameworks";
  if (["deploy-to-vercel","land-and-deploy","setup-deploy","ship","vercel-cli-with-tokens","gvc"].includes(n)) return "Deploy";
  if (["browse","canary","benchmark","connect-chrome","open-gstack-browser","pair-agent","setup-browser-cookies"].includes(n)) return "Browser";
  if (["graphify","find-docs","market-researcher","context7-cli","context7-mcp","travel-planner","sgnk-md-update"].includes(n)) return "Knowledge";
  if (["codex","gstack-upgrade","learn","guard","careful","freeze","unfreeze","investigate","health","office-hours","setup-cowork","migrate-to-codex"].includes(n)) return "Ops";
  // System / utility skills
  if (["checkpoint","find-skills","pdf","playwright","system-imagegen","system-plugin-creator","system-skill-creator","system-skill-installer"].includes(n)) return "System";
  return "System";
}

async function main() {
  console.log(`[*] Fetching snapshot from ${BASE} …`);
  const snap = await fetch(`${BASE}/api/vault/snapshot`).then((r) => {
    if (!r.ok) throw new Error(`snapshot ${r.status}`);
    return r.json();
  });

  const allPaths = snap.notes.map((n) => n.path);

  // 1) Paths to RENAME: Skills/<name>/<rest> (skip already-categorized paths)
  const renames = [];
  const NESTED_RE = /^Skills\/([^/]+)\/(.+)$/;
  for (const p of allPaths) {
    if (!p.startsWith("Skills/")) continue;
    if (p.startsWith("Projects/")) continue;
    const m = NESTED_RE.exec(p);
    if (!m) continue;
    const [, first, rest] = m;
    // already categorized if `first` is one of our cat names (capitalized w/ spaces)
    // Heuristic: a cat name starts with uppercase and there's still ≥1 more segment containing /
    // Simpler: skip if rest contains a "/" AND first looks like a category (Title Case w/ space allowed).
    // Even simpler: skip if first has any space OR starts with uppercase AND the rest still has a "/" (i.e. <cat>/<skill>/<file>).
    if (/^[A-Z]/.test(first) && rest.includes("/")) continue; // already Skills/Cat/Skill/file
    const cat = categoryFor(first);
    const newPath = `Skills/${cat}/${first}/${rest}`;
    if (newPath === p) continue;
    renames.push({ oldPath: p, newPath });
  }

  // 2) Paths to DELETE: everything under Projects/HQ/Skills/
  const deletesHQ = allPaths.filter((p) => p.startsWith("Projects/HQ/Skills/"));

  console.log(`[*] ${renames.length} files to rename, ${deletesHQ.length} HQ duplicates to delete`);
  if (renames.length === 0 && deletesHQ.length === 0) {
    console.log("[*] Nothing to do. Exiting.");
    return;
  }

  // 3) Fetch content + sha for every file we need to write (renames) and delete
  const need = new Set([
    ...renames.map((r) => r.oldPath),
    ...deletesHQ,
  ]);
  console.log(`[*] Fetching ${need.size} file contents (concurrency ${CONCURRENCY}) …`);

  const cache = new Map();
  const queue = [...need];
  let done = 0;
  async function worker() {
    while (queue.length) {
      const p = queue.shift();
      const r = await fetch(`${BASE}/api/vault/file?path=${encodeURIComponent(p)}`);
      if (!r.ok) throw new Error(`fetch ${p}: ${r.status}`);
      const j = await r.json();
      cache.set(p, { content: j.content, sha: j.sha });
      done++;
      if (done % 50 === 0) console.log(`    ${done}/${need.size}`);
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  console.log(`    ${done}/${need.size} fetched`);

  // 4) Batch into commits of CHUNK ops each (route caps JSON body around 1MB).
  //    Renames go first (writes+deletes paired), then HQ deletions alone.
  const CHUNK = 120;
  const renameOps = renames.map(({ oldPath, newPath }) => ({
    // baseSha:"" = create-new sentinel (commit-changes asserts new path absent).
    write: { path: newPath, content: cache.get(oldPath).content, baseSha: "" },
    del:   { path: oldPath, baseSha: cache.get(oldPath).sha },
  }));
  const hqDelOps = deletesHQ.map((p) => ({ path: p, baseSha: cache.get(p).sha }));

  const cats = new Set(renames.map((r) => r.newPath.split("/")[1])).size;
  let commitNo = 0;
  const total = Math.ceil(renameOps.length / CHUNK) + Math.ceil(hqDelOps.length / CHUNK);

  async function post(files, deletions, msg) {
    commitNo++;
    console.log(`[*] commit ${commitNo}/${total} — ${files.length} writes, ${deletions.length} deletes`);
    const res = await fetch(`${BASE}/api/commit`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ files, deletions, message: msg }),
    });
    if (!res.ok) {
      const t = await res.text();
      throw new Error(`commit ${commitNo} failed ${res.status}: ${t.slice(0, 300)}`);
    }
    const j = await res.json();
    console.log(`    ✓ ${j.commitSha?.slice(0, 7) || "?"}`);
  }

  // Renames in batches.
  for (let i = 0; i < renameOps.length; i += CHUNK) {
    const batch = renameOps.slice(i, i + CHUNK);
    const files = batch.map((o) => o.write);
    const deletions = batch.map((o) => o.del);
    const part = `${i / CHUNK + 1}/${Math.ceil(renameOps.length / CHUNK)}`;
    await post(files, deletions, `chore(vault): categorize Skills/ → ${cats} cats (${part})`);
  }

  // HQ duplicate deletions in batches.
  for (let i = 0; i < hqDelOps.length; i += CHUNK) {
    const deletions = hqDelOps.slice(i, i + CHUNK);
    const part = `${i / CHUNK + 1}/${Math.ceil(hqDelOps.length / CHUNK)}`;
    await post([], deletions, `chore(vault): drop duplicate Projects/HQ/Skills/ (${part})`);
  }

  console.log(`[✓] done — ${cats} categories, ${renames.length} renames, ${deletesHQ.length} HQ deletes`);
}

main().catch((e) => {
  console.error("[!]", e.message);
  process.exit(1);
});
