/**
 * TDD test for GetSnapshot use-case.
 *
 * Verifies:
 * 1. First call builds a snapshot with 2 notes, correct paths (top-level dir stripped),
 *    correct titles, and a nested tree structure.
 * 2. Second call (same SHA) returns from cache WITHOUT calling getZipball again.
 */
import { describe, it, expect, beforeEach } from "vitest";
import { zipSync } from "fflate";
import { makeGetSnapshot } from "@/modules/vault/application/get-snapshot";
import type { VaultReader } from "@/modules/vault/application/ports";
import type { VaultSnapshot } from "@/modules/vault/application/dto";
import { parseMarkdown } from "@/modules/vault/infrastructure/markdown-parser";

// ---------------------------------------------------------------------------
// Build an in-memory zip with a GitHub-style top-level prefix
// ---------------------------------------------------------------------------

function buildTestZip(): ArrayBuffer {
  const enc = new TextEncoder();
  const files: Record<string, Uint8Array> = {
    // Home note with an outbound link to HQ
    "repo-abc123/Home.md": enc.encode(
      `---
title: Home
tags: [welcome]
---

# Home

Welcome. See also [[HQ|HQ Note]].
`,
    ),
    // HQ note with a tag
    "repo-abc123/Projects/HQ/HQ.md": enc.encode(
      `---
title: HQ
tags: [hq, active]
---

# HQ

This is headquarters.
`,
    ),
    // App artifacts that must NOT appear in the vault tree
    "repo-abc123/src/modules/README.md": enc.encode("# scaffold readme"),
    "repo-abc123/docs/superpowers/plan.md": enc.encode("# a plan"),
    "repo-abc123/specs/harness/README.md": enc.encode("# harness"),
    "repo-abc123/README.md": enc.encode("# repo readme"),
  };
  return zipSync(files).buffer as ArrayBuffer;
}

// ---------------------------------------------------------------------------
// Mock VaultReader
// ---------------------------------------------------------------------------

function makeMockReader(): { reader: VaultReader; callCount: number } {
  let callCount = 0;
  const zip = buildTestZip();

  const reader: VaultReader = {
    getHeadSha: async () => "abc123",
    getZipball: async () => {
      callCount++;
      return zip;
    },
    getFile: async (_path: string) => ({ content: "", sha: "" }),
    listHistory: async () => [],
    getFileAtSha: async () => null,
  };

  return { reader, get callCount() { return callCount; } };
}

// ---------------------------------------------------------------------------
// In-memory cache (fresh per test)
// ---------------------------------------------------------------------------

function makeFreshCache() {
  const store = new Map<string, VaultSnapshot>();
  return {
    get: (sha: string) => store.get(sha) ?? null,
    set: (sha: string, snap: VaultSnapshot) => { store.set(sha, snap); },
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("makeGetSnapshot", () => {
  let mock: ReturnType<typeof makeMockReader>;
  let getSnapshot: () => Promise<VaultSnapshot>;

  beforeEach(() => {
    mock = makeMockReader();
    getSnapshot = makeGetSnapshot({
      reader: mock.reader,
      cache: makeFreshCache(),
      parseNote: parseMarkdown,
    });
  });

  it("returns a snapshot with 2 notes", async () => {
    const snap = await getSnapshot();
    expect(snap.notes).toHaveLength(2);
  });

  it("strips the top-level GitHub prefix from paths", async () => {
    const snap = await getSnapshot();
    const paths = snap.notes.map((n) => n.path).sort();
    expect(paths).toContain("Home.md");
    expect(paths).toContain("Projects/HQ/HQ.md");
    // Must NOT contain the repo-sha prefix
    for (const p of paths) {
      expect(p).not.toMatch(/^repo-abc123\//);
    }
  });

  it("extracts correct titles", async () => {
    const snap = await getSnapshot();
    const home = snap.notes.find((n) => n.path === "Home.md");
    const hq = snap.notes.find((n) => n.path === "Projects/HQ/HQ.md");
    expect(home?.title).toBe("Home");
    expect(hq?.title).toBe("HQ");
  });

  it("stores the sha and generatedAt", async () => {
    const snap = await getSnapshot();
    expect(snap.sha).toBe("abc123");
    expect(typeof snap.generatedAt).toBe("string");
    // Should be a valid ISO 8601 timestamp
    expect(new Date(snap.generatedAt).getTime()).not.toBeNaN();
  });

  it("builds a nested tree containing root and a Projects folder", async () => {
    const snap = await getSnapshot();
    expect(snap.tree.type).toBe("folder");
    // Root has children
    expect(snap.tree.children).toBeDefined();
    const children = snap.tree.children!;
    // Home.md is a file at root
    const homeNode = children.find((c) => c.name === "Home.md");
    expect(homeNode?.type).toBe("file");
    expect(homeNode?.path).toBe("Home.md");
    // Projects is a folder
    const projectsNode = children.find((c) => c.name === "Projects");
    expect(projectsNode?.type).toBe("folder");
    expect(projectsNode?.children).toBeDefined();
  });

  it("includes outbound link from Home to HQ", async () => {
    const snap = await getSnapshot();
    const home = snap.notes.find((n) => n.path === "Home.md");
    expect(home?.outbound).toContain("HQ");
  });

  it("second call (same SHA) hits cache — getZipball NOT called again", async () => {
    // Use a shared cache so the second call can find the first snapshot
    const cache = makeFreshCache();
    const gs1 = makeGetSnapshot({ reader: mock.reader, cache, parseNote: parseMarkdown });
    const gs2 = makeGetSnapshot({ reader: mock.reader, cache, parseNote: parseMarkdown });

    await gs1();
    expect(mock.callCount).toBe(1);

    await gs2();
    // Still only 1 call — served from cache
    expect(mock.callCount).toBe(1);
  });

  it("de-dupes concurrent cold-cache calls into a SINGLE zipball build", async () => {
    // Two callers race on a cold cache (the real mount scenario:
    // /api/vault/snapshot + /api/share/conflicts firing together). Without
    // in-flight dedup each would download + parse the whole repo zipball.
    const [a, b] = await Promise.all([getSnapshot(), getSnapshot()]);
    expect(mock.callCount).toBe(1); // one build, shared
    expect(a).toBe(b); // same snapshot object
  });

  it("rebuilds after an in-flight build settles (no permanent in-flight leak)", async () => {
    await getSnapshot(); // build #1 → cached
    // The in-flight entry must be cleared on settle, so a fresh getSnapshot
    // with a DIFFERENT cache (forcing a miss) builds again.
    const gs2 = makeGetSnapshot({ reader: mock.reader, cache: makeFreshCache(), parseNote: parseMarkdown });
    await gs2();
    expect(mock.callCount).toBe(2);
  });

  it("excludes app dirs (src/docs/specs) and the repo README from the vault", async () => {
    const snap = await getSnapshot();
    const paths = snap.notes.map((n) => n.path);
    expect(snap.notes).toHaveLength(2); // only the two real notes
    expect(paths).not.toContain("README.md");
    for (const p of paths) {
      expect(p.startsWith("src/")).toBe(false);
      expect(p.startsWith("docs/")).toBe(false);
      expect(p.startsWith("specs/")).toBe(false);
    }
  });

  it("tags are included in NoteMeta", async () => {
    const snap = await getSnapshot();
    const hq = snap.notes.find((n) => n.path === "Projects/HQ/HQ.md");
    expect(hq?.tags).toContain("hq");
    expect(hq?.tags).toContain("active");
  });
});
