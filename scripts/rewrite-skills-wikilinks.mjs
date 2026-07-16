#!/usr/bin/env node
/**
 * After Skills/<name>/ → Skills/<Cat>/<name>/ categorization, any wikilink
 * written as `[[Skills/Foo]]` or `[[Skills/Foo/skill]]` now points at a path
 * that no longer exists. Basename-style `[[Foo]]` already resolves because
 * the resolver uses basename → path map.
 *
 * This pass scans every vault note and rewrites `[[Skills/<oldName>...]]`
 * (and the embed variant `![[Skills/...]]`) to its basename form so the
 * resolver picks up the new categorized location.
 *
 * Run while `npm run dev` is up (uses DEV_BYPASS_AUTH + localhost gate).
 *
 *   node scripts/rewrite-skills-wikilinks.mjs
 */
const BASE = process.env.SGNK_BASE || "http://localhost:3000";
const CHUNK = 120;
const CONCURRENCY = 8;

const RE = /(!?)\[\[Skills\/([^/\]|#]+)(\/[^\]|#]*)?([|#][^\]]*)?\]\]/g;

function rewrite(text) {
  let changed = false;
  const out = text.replace(RE, (_full, bang, name, _rest, suffix) => {
    changed = true;
    return `${bang || ""}[[${name}${suffix || ""}]]`;
  });
  return { text: out, changed };
}

async function main() {
  console.log(`[*] Fetching snapshot from ${BASE} …`);
  const snap = await fetch(`${BASE}/api/vault/snapshot`).then((r) => {
    if (!r.ok) throw new Error(`snapshot ${r.status}`);
    return r.json();
  });
  const allPaths = snap.notes.map((n) => n.path);
  console.log(`[*] Scanning ${allPaths.length} notes …`);

  const touched = [];
  let done = 0;
  const queue = [...allPaths];

  async function worker() {
    while (queue.length) {
      const p = queue.shift();
      const r = await fetch(`${BASE}/api/vault/file?path=${encodeURIComponent(p)}`);
      if (!r.ok) { done++; continue; }
      const j = await r.json();
      const { text, changed } = rewrite(j.content);
      if (changed) touched.push({ path: p, newContent: text, sha: j.sha });
      done++;
      if (done % 100 === 0) console.log(`    ${done}/${allPaths.length}`);
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  console.log(`[*] ${touched.length} notes need wikilink rewrites`);
  if (touched.length === 0) return;

  // Commit in chunks
  let commitNo = 0;
  const total = Math.ceil(touched.length / CHUNK);
  for (let i = 0; i < touched.length; i += CHUNK) {
    const batch = touched.slice(i, i + CHUNK);
    commitNo++;
    const body = {
      files: batch.map((t) => ({ path: t.path, content: t.newContent, baseSha: t.sha })),
      message: `chore(vault): rewrite [[Skills/...]] wikilinks to basename (${commitNo}/${total})`,
    };
    console.log(`[*] commit ${commitNo}/${total} — ${batch.length} files`);
    const res = await fetch(`${BASE}/api/commit`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const t = await res.text();
      throw new Error(`commit ${commitNo} failed ${res.status}: ${t.slice(0, 200)}`);
    }
    const j = await res.json();
    console.log(`    ✓ ${j.commitSha?.slice(0, 7) || "?"}`);
  }
  console.log(`[✓] ${touched.length} notes rewritten across ${total} commits`);
}

main().catch((e) => {
  console.error("[!]", e.message);
  process.exit(1);
});
