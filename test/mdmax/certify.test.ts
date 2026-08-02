/**
 * GATE: the certifier refuses rather than reporting a smaller matrix, and never touches source.
 * (PLAN §3.3)
 *
 * Uses FAKE engines throughout. The real bench is tested separately; what is under test here is
 * the certifier's own contract — refusal, block segmentation, sidecar-only output, and the
 * histogram that decides two of the four kill conditions.
 */
import { describe, it, expect } from "vitest";
import {
  certify,
  splitBlocks,
  brokenHistogram,
} from "@/modules/mdmax/application/certify";
import type {
  CellVerdict,
  Certificate,
  Engine,
  Target,
} from "@/modules/mdmax/domain/cert-contract";
import { TARGETS, LOCAL_TARGETS, uncertifiableShare } from "@/modules/mdmax/domain/targets";

const fakeEngine = (id: string, render: (s: string) => string): Engine => ({
  id,
  name: id,
  version: "0.0.0-test",
  options: { test: true },
  render,
});

const passthrough = fakeEngine("e1", (s) => `<p>${s}</p>`);
const deleter = fakeEngine("e2", () => "");

const target = (id: string, engineId: string, extra: Partial<Target> = {}): Target => ({
  id,
  product: "test",
  surface: "test",
  engineId,
  fidelity: "local",
  ...extra,
});

const alwaysPass: CellVerdict = { verdict: "PASS", before: "x", after: "x" };
const alwaysBroken: CellVerdict = {
  verdict: "CORRUPT",
  class: "DESTROY",
  before: "Array<string>",
  after: "Array",
};

describe("splitBlocks", () => {
  it("splits on blank lines and reports offsets that slice back to the block", () => {
    const src = "# Title\n\nFirst para.\n\nSecond para.\n";
    const blocks = splitBlocks(src);
    expect(blocks).toHaveLength(3);
    for (const b of blocks) {
      expect(src.slice(b.start, b.end)).toBe(b.text);
    }
  });

  it("keeps a fenced code block whole even when it contains blank lines", () => {
    const src = "para\n\n```js\nconst a = 1\n\nconst b = 2\n```\n\nafter\n";
    const blocks = splitBlocks(src);
    const fence = blocks.find((b) => b.text.startsWith("```"));
    expect(fence).toBeDefined();
    expect(fence?.text).toContain("const b = 2");
    expect(fence?.text).toContain("```");
  });

  it("keeps front matter as ONE block even though it contains blank lines", () => {
    const src = "---\ntitle: x\n\ntags: [a]\n---\n\nbody\n";
    const blocks = splitBlocks(src);
    expect(blocks[0]?.text.startsWith("---")).toBe(true);
    expect(blocks[0]?.text).toContain("tags: [a]");
  });

  it("handles a document with no blank lines at all", () => {
    expect(splitBlocks("just one line")).toHaveLength(1);
  });

  it("returns nothing for an empty or whitespace-only document", () => {
    expect(splitBlocks("")).toHaveLength(0);
    expect(splitBlocks("\n\n  \n")).toHaveLength(0);
  });

  it("does not lose bytes: concatenated block ranges cover all non-blank content", () => {
    const src = "a\n\nb\n\nc\n";
    const blocks = splitBlocks(src);
    const covered = blocks.map((b) => src.slice(b.start, b.end)).join("");
    for (const ch of ["a", "b", "c"]) expect(covered).toContain(ch);
  });
});

describe("refusal — a missing engine is never a smaller matrix", () => {
  it("refuses when a local target's engine did not load", async () => {
    const r = await certify({
      path: "x.md",
      source: "hello\n",
      sha256: "abc",
      engines: [passthrough],
      targets: [target("t1", "e1"), target("t2", "MISSING")],
      constructs: [],
      benchId: "bench1",
      foldVersion: "mdmax/fold@1",
      classify: () => alwaysPass,
      foldText: (h) => h,
    });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.reason).toBe("ENGINE_MISSING");
      if (r.reason === "ENGINE_MISSING") expect(r.engineId).toBe("MISSING");
    }
  });

  it("refuses when there are no targets at all", async () => {
    const r = await certify({
      path: "x.md",
      source: "hello\n",
      sha256: "abc",
      engines: [passthrough],
      targets: [],
      constructs: [],
      benchId: "b",
      foldVersion: "f",
      classify: () => alwaysPass,
      foldText: (h) => h,
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe("NO_TARGETS");
  });

  it("returns ENGINE_THREW as a value rather than throwing", async () => {
    const thrower = fakeEngine("boom", () => {
      throw new Error("engine exploded");
    });
    const r = await certify({
      path: "x.md",
      source: "hello\n",
      sha256: "abc",
      engines: [thrower],
      targets: [target("t", "boom")],
      constructs: [],
      benchId: "b",
      foldVersion: "f",
      classify: () => alwaysPass,
      foldText: (h) => h,
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe("ENGINE_THREW");
  });

  it("does not refuse for a DECLARED target whose engine is absent — declared is not measured", async () => {
    const r = await certify({
      path: "x.md",
      source: "hello\n",
      sha256: "abc",
      engines: [passthrough],
      targets: [target("t1", "e1"), target("declared", "NOT_LOADED", { fidelity: "declared" })],
      constructs: [],
      benchId: "b",
      foldVersion: "f",
      classify: () => alwaysPass,
      foldText: (h) => h,
    });
    expect(r.ok).toBe(true);
  });
});

describe("the artifact", () => {
  it("carries the schema, bench id, fold version and file hash", async () => {
    const r = await certify({
      path: "doc.md",
      source: "hello\n",
      sha256: "deadbeef",
      engines: [passthrough],
      targets: [target("t", "e1")],
      constructs: [],
      benchId: "bench-xyz",
      foldVersion: "mdmax/fold@1",
      classify: () => alwaysPass,
      foldText: (h) => h,
    });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const c = r.certificate;
    expect(c.schema).toBe("mdmax/cert@1");
    expect(c.bench.id).toBe("bench-xyz");
    expect(c.fold.version).toBe("mdmax/fold@1");
    expect(c.file.sha256).toBe("deadbeef");
  });

  it("never serialises the render function into the artifact", async () => {
    const r = await certify({
      path: "doc.md",
      source: "hello\n",
      sha256: "d",
      engines: [passthrough],
      targets: [target("t", "e1")],
      constructs: [],
      benchId: "b",
      foldVersion: "f",
      classify: () => alwaysPass,
      foldText: (h) => h,
    });
    if (!r.ok) return;
    expect(JSON.stringify(r.certificate)).not.toContain("render");
    for (const e of r.certificate.bench.engines) {
      expect((e as unknown as Record<string, unknown>).render).toBeUndefined();
    }
  });

  it("records the FULL option set for every engine — a cert without it is a lie", async () => {
    const r = await certify({
      path: "doc.md",
      source: "hello\n",
      sha256: "d",
      engines: [passthrough],
      targets: [target("t", "e1")],
      constructs: [],
      benchId: "b",
      foldVersion: "f",
      classify: () => alwaysPass,
      foldText: (h) => h,
    });
    if (!r.ok) return;
    expect(r.certificate.bench.engines[0]?.options).toEqual({ test: true });
  });

  it("summary counts add up to blocks x targets", async () => {
    const r = await certify({
      path: "doc.md",
      source: "a\n\nb\n\nc\n",
      sha256: "d",
      engines: [passthrough, deleter],
      targets: [target("t1", "e1"), target("t2", "e2")],
      constructs: [],
      benchId: "b",
      foldVersion: "f",
      classify: () => alwaysPass,
      foldText: (h) => h,
    });
    if (!r.ok) return;
    const s = r.certificate.summary;
    expect(s.pass + s.strip + s.corrupt + s.void).toBe(r.certificate.blocks.length * 2);
  });

  it("byte ranges slice back to the block text", async () => {
    const src = "# One\n\nTwo two two.\n\n- a\n- b\n";
    const r = await certify({
      path: "doc.md",
      source: src,
      sha256: "d",
      engines: [passthrough],
      targets: [target("t", "e1")],
      constructs: [],
      benchId: "b",
      foldVersion: "f",
      classify: () => alwaysPass,
      foldText: (h) => h,
    });
    if (!r.ok) return;
    for (const b of r.certificate.blocks) {
      expect(src.slice(b.byteRange[0], b.byteRange[1]).trim().length).toBeGreaterThan(0);
    }
  });

  it("applies a target's pre-pipeline — Jekyll strips front matter before kramdown runs", async () => {
    const seen: string[] = [];
    const spy = fakeEngine("spy", (s) => {
      seen.push(s);
      return `<p>${s}</p>`;
    });
    await certify({
      path: "doc.md",
      source: "---\ntitle: x\n---\n\nbody\n",
      sha256: "d",
      engines: [spy],
      targets: [target("jekyll", "spy", { prePipeline: ["strip-frontmatter"] })],
      constructs: [],
      benchId: "b",
      foldVersion: "f",
      classify: () => alwaysPass,
      foldText: (h) => h,
    });
    // the frontmatter block, after the pre-pipeline, must not still contain `title:`
    expect(seen.some((s) => s.includes("title: x"))).toBe(false);
  });
});

describe("brokenHistogram — the artifact that decides kill conditions 1 and 4", () => {
  const cert = (blocks: Certificate["blocks"]): Certificate => ({
    schema: "mdmax/cert@1",
    bench: { id: "b", engines: [] },
    fold: { version: "f" },
    file: { path: "x.md", sha256: "d", bytes: 10 },
    targets: ["t"],
    summary: { pass: 0, strip: 0, corrupt: 0, void: 0 },
    blocks,
  });

  it("counts broken blocks and files", () => {
    const h = brokenHistogram([
      cert([
        { anchor: "a", type: "paragraph", byteRange: [0, 5], constructs: ["angle-bracket-text"], verdicts: { t: alwaysBroken } },
        { anchor: "b", type: "paragraph", byteRange: [5, 10], constructs: [], verdicts: { t: alwaysPass } },
      ]),
      cert([{ anchor: "c", type: "paragraph", byteRange: [0, 5], constructs: [], verdicts: { t: alwaysPass } }]),
    ]);
    expect(h.totalFiles).toBe(2);
    expect(h.totalBlocks).toBe(3);
    expect(h.brokenBlocks).toBe(1);
    expect(h.filesWithBroken).toBe(1);
  });

  it("attributes a broken block with no detected construct to __unattributed__ rather than dropping it", () => {
    // Silently discarding the blocks we cannot explain is exactly how a histogram comes to say
    // six constructs explain everything, which is kill condition (4) reached by accounting error.
    const h = brokenHistogram([
      cert([{ anchor: "a", type: "paragraph", byteRange: [0, 5], constructs: [], verdicts: { t: alwaysBroken } }]),
    ]);
    expect(h.byConstruct.find((r) => r.construct === "__unattributed__")?.count).toBe(1);
  });

  it("counts by CORRUPT class", () => {
    const h = brokenHistogram([
      cert([{ anchor: "a", type: "p", byteRange: [0, 1], constructs: [], verdicts: { t: alwaysBroken } }]),
    ]);
    expect(h.byClass.find((r) => r.class === "DESTROY")?.count).toBe(1);
  });

  it("returns zeroes rather than NaN on an empty input", () => {
    const h = brokenHistogram([]);
    expect(h.totalBlocks).toBe(0);
    expect(h.byConstruct).toEqual([]);
  });
});

describe("the target registry", () => {
  it("models GitHub as THREE surfaces, not one product", () => {
    const gh = TARGETS.filter((t) => t.product === "GitHub");
    expect(gh.length).toBeGreaterThanOrEqual(3);
    expect(new Set(gh.map((t) => t.surface)).size).toBeGreaterThanOrEqual(3);
  });

  it("marks github-blob as requires-push — it cannot be probed without pushing content", () => {
    expect(TARGETS.find((t) => t.id === "github-blob")?.fidelity).toBe("requires-push");
  });

  it("keeps github-comment declared, not local — the proxy disagrees with the surface", () => {
    expect(TARGETS.find((t) => t.id === "github-comment")?.fidelity).toBe("declared");
  });

  it("dates every declared row, so a stale certificate looks stale", () => {
    for (const t of TARGETS) {
      if (t.fidelity === "local") continue;
      expect(t.lastVerified, `${t.id} has no lastVerified`).toBeTruthy();
    }
  });

  it("strips front matter before kramdown for github-pages", () => {
    expect(TARGETS.find((t) => t.id === "github-pages")?.prePipeline).toContain("strip-frontmatter");
  });

  it("reports the uncertifiable share — kill condition (2) as a number", () => {
    const u = uncertifiableShare();
    expect(u.total).toBe(TARGETS.length);
    expect(u.uncertifiable).toBeGreaterThan(0);
    expect(u.pct).toBeGreaterThan(0);
  });

  it("LOCAL_TARGETS contains only locally measurable surfaces", () => {
    for (const t of LOCAL_TARGETS) expect(t.fidelity).toBe("local");
  });
});
