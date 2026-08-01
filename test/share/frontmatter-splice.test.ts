/**
 * GATE: the frontmatter splice writer must never change a byte it was not asked to change.
 *
 * The corpus test is the real gate. It replays a publish → unpublish cycle over every
 * frontmatter-bearing file in the pinned corpus and asserts byte-identity. The two shipped
 * write paths are measured alongside it so the assertion is demonstrably capable of failing —
 * a green suite on a rare fault proves nothing unless the fault reproduces (LR#68).
 *
 * corpus_id sha256:3a010b1649899795d79274fc528dbece97fdabf4ff0f81cc02ab619c048c51a4
 */
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import matter from "gray-matter";
import { parseDocument, isMap } from "yaml";
import { spliceFrontmatterValue, emitScalar } from "@/modules/share/domain/splice-frontmatter";

const KEY = "public_slug";
const VAL = "audit-test-slug";

// ---------------------------------------------------------------- unit behaviour

describe("spliceFrontmatterValue — bytes outside the key are never touched", () => {
  it("preserves comments, quoting, key order and blank lines", () => {
    const src = [
      "---",
      "# a comment the old writer deleted",
      'title: "Quoted On Purpose"',
      "tags: [a, b]      # trailing comment",
      "",
      "author: sagnik",
      "---",
      "",
      "# Body",
      "",
      "text",
    ].join("\n");
    const pub = spliceFrontmatterValue(src, KEY, "my-slug");
    expect(pub).toContain("# a comment the old writer deleted");
    expect(pub).toContain('title: "Quoted On Purpose"');
    expect(pub).toContain("tags: [a, b]      # trailing comment");
    expect(pub).toContain(`${KEY}: my-slug`);
    // and the inverse restores the original byte for byte
    expect(spliceFrontmatterValue(pub, KEY, null)).toBe(src);
  });

  it("replaces an existing value without moving the key", () => {
    const src = "---\na: 1\npublic_slug: old\nz: 2\n---\n\nbody\n";
    const out = spliceFrontmatterValue(src, KEY, "new");
    expect(out).toBe("---\na: 1\npublic_slug: new\nz: 2\n---\n\nbody\n");
  });

  it("preserves CRLF line endings", () => {
    const src = "---\r\na: 1\r\n---\r\n\r\nbody\r\n";
    const out = spliceFrontmatterValue(src, KEY, "x");
    expect(out).toContain("\r\n");
    expect(out).toBe("---\r\na: 1\r\npublic_slug: x\r\n---\r\n\r\nbody\r\n");
  });

  it("REFUSES rather than guessing on a duplicate key", () => {
    const src = "---\npublic_slug: a\npublic_slug: b\n---\n\nbody\n";
    expect(spliceFrontmatterValue(src, KEY, "c")).toBe(src);
  });

  it("REFUSES on a block scalar under the target key", () => {
    const src = "---\npublic_slug: |\n  multi\n  line\n---\n\nbody\n";
    expect(spliceFrontmatterValue(src, KEY, "x")).toBe(src);
  });

  it("REFUSES on an unterminated block", () => {
    const src = "---\na: 1\nno closing fence\n";
    expect(spliceFrontmatterValue(src, KEY, "x")).toBe(src);
  });

  it("REFUSES on a sequence document rather than rewriting it", () => {
    const src = "---\n- one\n- two\n---\n\nbody\n";
    expect(spliceFrontmatterValue(src, KEY, "x")).toBe(src);
  });

  it("does not corrupt a body that itself opens with a --- block", () => {
    // this is the exact gray-matter failure: it re-parses the body and eats the block
    const src = "---\na: 1\n---\n\n---\nnot: frontmatter\n---\n\nreal body\n";
    const out = spliceFrontmatterValue(src, KEY, "x");
    expect(out).toContain("not: frontmatter");
    expect(spliceFrontmatterValue(out, KEY, null)).toBe(src);
  });

  it("quotes only when YAML requires it", () => {
    expect(emitScalar("plain-slug")).toBe("plain-slug");
    expect(emitScalar("has: colon")).toBe('"has: colon"');
    expect(emitScalar("true")).toBe('"true"');
    expect(emitScalar("123")).toBe('"123"');
    expect(emitScalar("")).toBe('""');
  });
});

// ---------------------------------------------------------------- the corpus gate

const MANIFEST = "docs/engine/research/corpus-manifest.json";
const ROOTS: Record<string, string> = {
  md: path.join(os.homedir(), "Desktop/GitHub/md"),
  knowledge: path.join(os.homedir(), "Desktop/GitHub/knowledge"),
  frontmatter: process.cwd(),
};

type Impl = (src: string, key: string, value: string | null) => string;

const graymatter: Impl = (src, key, value) => {
  const p = matter(src);
  const data: Record<string, unknown> = { ...(p.data as Record<string, unknown>) };
  if (value === null) delete data[key];
  else data[key] = value;
  return matter.stringify(p.content, data);
};

const FM_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;
const yamldoc: Impl = (src, key, value) => {
  const m = FM_RE.exec(src);
  if (m === null) return src;
  const doc = parseDocument(m[1] ?? "");
  if (doc.errors.length > 0 || !isMap(doc.contents)) return src;
  if (value === null) doc.delete(key);
  else doc.set(key, value);
  const body = src.slice(m[0].length);
  const y = doc.toString().replace(/\n$/, "");
  if (y.trim() === "" || y.trim() === "{}") return body.replace(/^\n+/, "");
  return `---\n${y}\n---\n\n${body.replace(/^\n+/, "")}`;
};

function loadCorpus(): { path: string; src: string }[] {
  if (!fs.existsSync(MANIFEST)) return [];
  const man = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
  const out: { path: string; src: string }[] = [];
  for (const [root, info] of Object.entries(man.roots as Record<string, { files: { path: string }[] }>)) {
    const base = ROOTS[root];
    if (!base || !fs.existsSync(base)) continue;
    for (const f of info.files) {
      try {
        const src = fs.readFileSync(path.join(base, f.path), "utf8");
        if (/^---\r?\n/.test(src)) out.push({ path: `${root}/${f.path}`, src });
      } catch { /* file moved since the manifest was pinned */ }
    }
  }
  return out;
}

/** publish, then invert. If the key pre-existed, the inverse is restore — not delete. */
function roundTrip(impl: Impl, src: string): string {
  const block = /^---\r?\n([\s\S]*?)\r?\n---/.exec(src)?.[1] ?? "";
  const had = /^public_slug[ \t]*:[ \t]*(.*)$/m.exec(block);
  const published = impl(src, KEY, VAL);
  return had
    ? impl(published, KEY, (had[1] ?? "").trim().replace(/^["']|["']$/g, ""))
    : impl(published, KEY, null);
}

function score(impl: Impl, corpus: { path: string; src: string }[]) {
  let identical = 0, changed = 0, threw = 0;
  const bad: string[] = [];
  for (const f of corpus) {
    try {
      if (roundTrip(impl, f.src) === f.src) identical++;
      else { changed++; if (bad.length < 5) bad.push(f.path); }
    } catch { threw++; if (bad.length < 5) bad.push(`${f.path} (threw)`); }
  }
  return { identical, changed, threw, bad, total: corpus.length };
}

describe("corpus gate — publish then unpublish is byte-identical", () => {
  const corpus = loadCorpus();
  const EXPECTED = 907;

  // A gate that shrinks its own population is a gate that always passes. Without the private
  // vaults this saw 23 of 907 files and printed 100%. Assert the denominator (LR#65).
  it.skipIf(corpus.length === 0)("sees the WHOLE pinned corpus, not a subset", () => {
    expect(corpus.length, `corpus is ${corpus.length}/${EXPECTED} — mount the vaults or re-pin`).toBe(EXPECTED);
  });

  it.skipIf(corpus.length === 0)(
    "the assertion is capable of failing: the shipped writers DO alter files",
    () => {
      const gm = score(graymatter, corpus);
      const yd = score(yamldoc, corpus);
      // This is the RED proof required by LR#68 — if these ever pass, the gate is vacuous.
      expect(gm.changed + gm.threw).toBeGreaterThan(0);
      expect(yd.changed).toBeGreaterThan(0);
      console.log(
        `\n  gray-matter (shipped): ${gm.identical}/${gm.total} identical ` +
        `(${((gm.identical / gm.total) * 100).toFixed(2)}%), ${gm.changed} changed, ${gm.threw} threw` +
        `\n  yaml Document:         ${yd.identical}/${yd.total} identical ` +
        `(${((yd.identical / yd.total) * 100).toFixed(2)}%), ${yd.changed} changed`,
      );
    },
  );

  it.skipIf(corpus.length === 0)("splice writer alters ZERO files", () => {
    const s = score(spliceFrontmatterValue as Impl, corpus);
    console.log(
      `\n  splice:                ${s.identical}/${s.total} identical ` +
      `(${((s.identical / s.total) * 100).toFixed(2)}%)`,
    );
    if (s.bad.length) console.log(`  first divergences: ${s.bad.join(", ")}`);
    expect(s.changed).toBe(0);
    expect(s.threw).toBe(0);
    expect(s.identical).toBe(s.total);
  });
});
