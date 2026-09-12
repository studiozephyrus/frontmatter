/**
 * TDD tests for the vault search index.
 *
 * Verifies:
 * 1. searchNotes("headquarters") returns the HQ note with a snippet containing
 *    the query term.
 * 2. A second call with the same SHA does NOT call getZipball again (index
 *    is served from module-level cache).
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { zipSync } from "fflate";

// ---------------------------------------------------------------------------
// Mocks — must use vi.hoisted so the factory can reference the mocks
// ---------------------------------------------------------------------------

const { mockGetHeadSha, mockGetZipball } = vi.hoisted(() => ({
  mockGetHeadSha: vi.fn<() => Promise<string>>(),
  mockGetZipball: vi.fn<() => Promise<ArrayBuffer>>(),
}));

vi.mock("@/shared/infrastructure/github/client", () => ({
  getHeadSha: mockGetHeadSha,
  getZipball: mockGetZipball,
}));

// ---------------------------------------------------------------------------
// Import module under test AFTER mocks are registered
// ---------------------------------------------------------------------------

import { searchNotes, _resetSearchCache } from "@/modules/vault/infrastructure/search-index";

// ---------------------------------------------------------------------------
// Build an in-memory zip matching the GitHub zipball structure
// ---------------------------------------------------------------------------

function buildTestZip(): ArrayBuffer {
  const enc = new TextEncoder();
  const files: Record<string, Uint8Array> = {
    "repo-abc123/Projects/HQ/HQ.md": enc.encode(
      `---
title: HQ
tags: [active]
---

# HQ

This is our headquarters note. The headquarters is central.
`,
    ),
    "repo-abc123/Home.md": enc.encode(
      `---
title: Home
tags: [welcome]
---

# Home

Welcome to the vault.
`,
    ),
    // Content that lives ONLY inside code — fenced and inline. Regression
    // guard: extractBodyText deletes both before indexing, so without a
    // dedicated code field these terms are unfindable.
    "repo-abc123/Runbook.md": enc.encode(
      `---
title: Runbook
tags: [ops]
---

# Runbook

Restart the service.

\`\`\`bash
kubectl rollout restart deployment/zephyrus-api
\`\`\`

Then set \`FRONTMATTER_VAULT_ROOT\` and retry.
`,
    ),
    // Near-miss pair. MiniSearch computes maxDistance = min(6, round(len*0.2)),
    // so "snapshot" (8 chars) admitted edit distance 2 and matched "snapchat".
    // These two notes exist to prove fuzzy junk can no longer crowd an exact hit.
    "repo-abc123/Snapshot.md": enc.encode(
      `---
title: Snapshot tooling
---

# Snapshot tooling

The snapshot pipeline writes to disk.
`,
    ),
    "repo-abc123/Snapchat.md": enc.encode(
      `---
title: Snapchat marketing
---

# Snapchat marketing

Notes on snapchat ad formats.
`,
    ),
    // Two-term precision case: only Alpha contains BOTH "tauri" and "build".
    "repo-abc123/Alpha.md": enc.encode(
      `---
title: Alpha
---

# Alpha

We tauri build the desktop app here.
`,
    ),
    "repo-abc123/Beta.md": enc.encode(
      `---
title: Beta
---

# Beta

We build the web bundle here. No desktop shell.
`,
    ),
    // App artifacts that must NOT be indexed
    "repo-abc123/src/modules/README.md": enc.encode("# scaffold readme"),
    "repo-abc123/README.md": enc.encode("# repo readme"),
  };
  return zipSync(files).buffer as ArrayBuffer;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("searchNotes", () => {
  const testZip = buildTestZip();

  beforeEach(() => {
    mockGetHeadSha.mockReset();
    mockGetZipball.mockReset();
    _resetSearchCache();
  });

  it("returns the HQ note when searching for 'headquarters'", async () => {
    mockGetHeadSha.mockResolvedValue("sha-001");
    mockGetZipball.mockResolvedValue(testZip);

    const results = await searchNotes("headquarters");

    expect(results.length).toBeGreaterThanOrEqual(1);
    const hq = results.find((r) => r.path === "Projects/HQ/HQ.md");
    expect(hq).toBeDefined();
    expect(hq!.title).toBe("HQ");
  });

  it("includes a snippet containing the query term", async () => {
    mockGetHeadSha.mockResolvedValue("sha-001");
    mockGetZipball.mockResolvedValue(testZip);

    const results = await searchNotes("headquarters");
    const hq = results.find((r) => r.path === "Projects/HQ/HQ.md");
    expect(hq).toBeDefined();
    expect(hq!.snippet.toLowerCase()).toContain("headquarter");
  });

  it("finds a term that appears only inside a fenced code block", async () => {
    mockGetHeadSha.mockResolvedValue("sha-001");
    mockGetZipball.mockResolvedValue(testZip);

    const results = await searchNotes("kubectl");

    const runbook = results.find((r) => r.path === "Runbook.md");
    expect(runbook).toBeDefined();
    expect(runbook!.title).toBe("Runbook");
  });

  it("finds a term that appears only inside an inline code span", async () => {
    mockGetHeadSha.mockResolvedValue("sha-001");
    mockGetZipball.mockResolvedValue(testZip);

    const results = await searchNotes("FRONTMATTER_VAULT_ROOT");

    expect(results.some((r) => r.path === "Runbook.md")).toBe(true);
  });

  it("snippets a code-only hit from the code text, not unrelated prose", async () => {
    mockGetHeadSha.mockResolvedValue("sha-001");
    mockGetZipball.mockResolvedValue(testZip);

    const results = await searchNotes("kubectl");
    const runbook = results.find((r) => r.path === "Runbook.md");

    expect(runbook).toBeDefined();
    expect(runbook!.snippet).toContain("kubectl");
  });

  // -------------------------------------------------------------------------
  // Search-quality regressions.
  //
  // The old config was a single pass of `{ prefix: true, fuzzy: 0.2 }` over an
  // implicit OR. Measured against a relevance set built from the vault's own
  // wikilinks, a sentence lifted verbatim from a note ranked that note first
  // 0.33% of the time. These tests pin the three-pass behaviour that replaced
  // it: precision, then recall, then typo-tolerance.
  // -------------------------------------------------------------------------

  it("does not let a fuzzy near-miss crowd out an exact match", async () => {
    mockGetHeadSha.mockResolvedValue("sha-001");
    mockGetZipball.mockResolvedValue(testZip);

    const results = await searchNotes("snapshot");
    const paths = results.map((r) => r.path);

    expect(paths).toContain("Snapshot.md");
    // Old behaviour: "snapchat" is edit distance 2 from "snapshot" and came back too.
    expect(paths).not.toContain("Snapchat.md");
  });

  it("requires every term to match when a note contains all of them", async () => {
    mockGetHeadSha.mockResolvedValue("sha-001");
    mockGetZipball.mockResolvedValue(testZip);

    const results = await searchNotes("tauri build");
    const paths = results.map((r) => r.path);

    expect(paths).toContain("Alpha.md");
    // Beta has "build" but not "tauri". Under the old OR it matched anyway.
    expect(paths).not.toContain("Beta.md");
  });

  it("falls back to OR when no note contains every term", async () => {
    mockGetHeadSha.mockResolvedValue("sha-001");
    mockGetZipball.mockResolvedValue(testZip);

    // "tauri" and "headquarters" never co-occur; precision pass finds nothing.
    const results = await searchNotes("tauri headquarters");

    expect(results.length).toBeGreaterThan(0);
  });

  it("still tolerates a typo when nothing matches exactly", async () => {
    mockGetHeadSha.mockResolvedValue("sha-001");
    mockGetZipball.mockResolvedValue(testZip);

    // "headquartes" is a genuine typo — one deletion from "headquarters".
    const results = await searchNotes("headquartes");

    expect(results.some((r) => r.path === "Projects/HQ/HQ.md")).toBe(true);
  });

  it("does NOT call getZipball a second time when SHA is the same", async () => {
    mockGetHeadSha.mockResolvedValue("sha-001");
    mockGetZipball.mockResolvedValue(testZip);

    // First call — cache miss, must build index
    await searchNotes("headquarters");
    expect(mockGetZipball).toHaveBeenCalledTimes(1);

    // Second call — same SHA, must serve from cache
    await searchNotes("home");
    expect(mockGetZipball).toHaveBeenCalledTimes(1); // still 1
  });

  it("rebuilds the index when SHA changes", async () => {
    mockGetHeadSha.mockResolvedValue("sha-001");
    mockGetZipball.mockResolvedValue(testZip);
    await searchNotes("headquarters");
    expect(mockGetZipball).toHaveBeenCalledTimes(1);

    // New SHA → cache invalidated
    mockGetHeadSha.mockResolvedValue("sha-002");
    mockGetZipball.mockResolvedValue(testZip);
    await searchNotes("headquarters");

    expect(mockGetZipball).toHaveBeenCalledTimes(2);
  });

  it("does NOT index app directory files (src/README)", async () => {
    mockGetHeadSha.mockResolvedValue("sha-001");
    mockGetZipball.mockResolvedValue(testZip);

    // "scaffold" only appears in src/modules/README.md which should be excluded
    const results = await searchNotes("scaffold");
    expect(results).toHaveLength(0);
  });
});
