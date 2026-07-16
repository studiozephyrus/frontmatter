/**
 * snapshot-public-slug.test.ts — NoteMeta.publicSlug derivation + .gitkeep folders.
 *
 * Covers:
 *  - publicSlug populated when frontmatter has public_slug
 *  - publicSlug omitted when absent / empty / whitespace
 *  - .gitkeep markers surface empty folders in the tree
 */
import { describe, it, expect } from "vitest";
import { zipSync } from "fflate";
import { makeGetSnapshot, type SnapshotCache } from "@/modules/vault/application/get-snapshot";
import { parseMarkdown } from "@/modules/vault/infrastructure/markdown-parser";
import type { VaultReader } from "@/modules/vault/application/ports";
import type { VaultSnapshot, TreeNode } from "@/modules/vault/application/dto";

function buildZip(files: Record<string, string>): ArrayBuffer {
  const enc = new TextEncoder();
  const entries: Record<string, Uint8Array> = {};
  for (const [k, v] of Object.entries(files)) entries[`repo/${k}`] = enc.encode(v);
  return zipSync(entries).buffer as ArrayBuffer;
}

function reader(buf: ArrayBuffer): VaultReader {
  return {
    getHeadSha: async () => "head",
    getZipball: async () => buf,
    getFile: async () => ({ content: "", sha: "" }),
    listHistory: async () => [],
    getFileAtSha: async () => null,
  };
}

function noCache(): SnapshotCache {
  return { get: () => null, set: () => {} };
}

function findFolder(node: TreeNode, name: string): TreeNode | null {
  if (node.name === name && node.type === "folder") return node;
  for (const c of node.children ?? []) {
    const f = findFolder(c, name);
    if (f) return f;
  }
  return null;
}

describe("publicSlug derivation", () => {
  it("populates publicSlug when frontmatter has public_slug", async () => {
    const buf = buildZip({
      "Shared.md": `---
title: Shared
public_slug: my-slug
---
body`,
      "Plain.md": "# Plain\n\nbody",
    });
    const fn = makeGetSnapshot({ reader: reader(buf), cache: noCache(), parseNote: parseMarkdown });
    const snap: VaultSnapshot = await fn();
    const shared = snap.notes.find((n) => n.path === "Shared.md");
    const plain = snap.notes.find((n) => n.path === "Plain.md");
    expect(shared?.publicSlug).toBe("my-slug");
    expect(plain?.publicSlug).toBeUndefined();
  });

  it("omits publicSlug when value is empty or whitespace", async () => {
    const buf = buildZip({
      "A.md": `---
public_slug: ""
---
body`,
      "B.md": `---
public_slug: "   "
---
body`,
    });
    const fn = makeGetSnapshot({ reader: reader(buf), cache: noCache(), parseNote: parseMarkdown });
    const snap = await fn();
    expect(snap.notes.find((n) => n.path === "A.md")?.publicSlug).toBeUndefined();
    expect(snap.notes.find((n) => n.path === "B.md")?.publicSlug).toBeUndefined();
  });

  it("trims surrounding whitespace from publicSlug", async () => {
    const buf = buildZip({
      "A.md": `---
public_slug: "  my-slug  "
---
body`,
    });
    const fn = makeGetSnapshot({ reader: reader(buf), cache: noCache(), parseNote: parseMarkdown });
    const snap = await fn();
    expect(snap.notes.find((n) => n.path === "A.md")?.publicSlug).toBe("my-slug");
  });
});

describe(".gitkeep folder surfacing", () => {
  it("includes empty folders that have only a .gitkeep", async () => {
    const buf = buildZip({
      "Empty/.gitkeep": "",
      "Other.md": "# Other",
    });
    const fn = makeGetSnapshot({ reader: reader(buf), cache: noCache(), parseNote: parseMarkdown });
    const snap = await fn();
    expect(findFolder(snap.tree, "Empty")).not.toBeNull();
  });

  it("supports nested .gitkeep folders", async () => {
    const buf = buildZip({
      "Outer/Inner/.gitkeep": "",
      "Root.md": "# Root",
    });
    const fn = makeGetSnapshot({ reader: reader(buf), cache: noCache(), parseNote: parseMarkdown });
    const snap = await fn();
    const outer = findFolder(snap.tree, "Outer");
    expect(outer).not.toBeNull();
    const inner = findFolder(outer!, "Inner");
    expect(inner).not.toBeNull();
  });

  it(".gitkeep is NOT itself listed as a note", async () => {
    const buf = buildZip({
      "Empty/.gitkeep": "",
      "Real.md": "# Real",
    });
    const fn = makeGetSnapshot({ reader: reader(buf), cache: noCache(), parseNote: parseMarkdown });
    const snap = await fn();
    expect(snap.notes.find((n) => n.path.includes(".gitkeep"))).toBeUndefined();
    expect(snap.notes.map((n) => n.path)).toEqual(["Real.md"]);
  });
});
