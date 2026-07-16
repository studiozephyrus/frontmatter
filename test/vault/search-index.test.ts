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
