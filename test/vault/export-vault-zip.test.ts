/**
 * TDD tests for ExportVaultZip use-case.
 *
 * Verifies:
 * 1. Vault .md files are included in the output zip with vault-relative paths
 *    (GitHub zipball top-level dir is stripped).
 * 2. App-directory files (src/, docs/, specs/, public/, .github/, .claude/,
 *    .vercel/, node_modules/) are excluded from the output zip.
 * 3. The repo README.md is excluded.
 * 4. File content is preserved byte-for-byte in the output zip.
 */

import { describe, it, expect } from "vitest";
import { zipSync, unzipSync } from "fflate";
import { makeExportVaultZip } from "@/modules/vault/application/export-vault-zip";
import type { VaultReader } from "@/modules/vault/application/ports";

// ---------------------------------------------------------------------------
// Build an in-memory zip that mimics a GitHub zipball (top-level dir prefix)
// ---------------------------------------------------------------------------

function buildTestZipball(): ArrayBuffer {
  const enc = new TextEncoder();
  const files: Record<string, Uint8Array> = {
    // Vault notes — should be included
    "repo-abc123/Home.md": enc.encode("# Home\n\nWelcome."),
    "repo-abc123/Projects/HQ/HQ.md": enc.encode("# HQ\n\nHeadquarters."),
    "repo-abc123/Daily/2026-05-25.md": enc.encode("# 2026-05-25\n\nToday."),

    // App artifacts — must be excluded
    "repo-abc123/src/modules/README.md": enc.encode("# scaffold readme"),
    "repo-abc123/docs/superpowers/plan.md": enc.encode("# a plan"),
    "repo-abc123/specs/harness/README.md": enc.encode("# harness"),
    "repo-abc123/public/favicon.ico": enc.encode("binary"),
    "repo-abc123/.github/workflows/ci.yml": enc.encode("name: CI"),
    "repo-abc123/.claude/settings.json": enc.encode("{}"),
    "repo-abc123/.vercel/project.json": enc.encode("{}"),
    "repo-abc123/node_modules/fflate/index.js": enc.encode("module.exports={}"),

    // Repo README — must be excluded
    "repo-abc123/README.md": enc.encode("# repo readme"),

    // Non-.md vault file — must be excluded (we only export .md)
    "repo-abc123/Assets/image.png": new Uint8Array([0x89, 0x50, 0x4e, 0x47]),
  };
  return zipSync(files).buffer as ArrayBuffer;
}

// ---------------------------------------------------------------------------
// Mock VaultReader
// ---------------------------------------------------------------------------

function makeMockReaderTracked(zipball: ArrayBuffer): {
  reader: VaultReader;
  calls: { getZipball: number };
} {
  const calls = { getZipball: 0 };
  const reader: VaultReader = {
    getHeadSha: async () => "abc123sha",
    getZipball: async () => {
      calls.getZipball++;
      return zipball;
    },
    getFile: async (_path: string) => ({ content: "", sha: "" }),
    listHistory: async () => [],
    getFileAtSha: async () => null,
  };
  return { reader, calls };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Extract names of all entries in a zip Uint8Array. */
function zipEntryNames(bytes: Uint8Array): string[] {
  return Object.keys(unzipSync(bytes));
}

/** Read a single entry from a zip Uint8Array. Returns undefined if not found. */
function zipEntryContent(bytes: Uint8Array, name: string): string | undefined {
  const entries = unzipSync(bytes);
  const entry = entries[name];
  if (!entry) return undefined;
  return new TextDecoder().decode(entry);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("makeExportVaultZip", () => {
  it("includes vault .md files with vault-relative paths (top-level dir stripped)", async () => {
    const zipball = buildTestZipball();
    const { reader } = makeMockReaderTracked(zipball);
    const exportVaultZip = makeExportVaultZip({ reader });

    const result = await exportVaultZip();
    const names = zipEntryNames(result);

    expect(names).toContain("Home.md");
    expect(names).toContain("Projects/HQ/HQ.md");
    expect(names).toContain("Daily/2026-05-25.md");
  });

  it("excludes src/, docs/, specs/, public/, .github/, .claude/, .vercel/, node_modules/", async () => {
    const zipball = buildTestZipball();
    const { reader } = makeMockReaderTracked(zipball);
    const exportVaultZip = makeExportVaultZip({ reader });

    const result = await exportVaultZip();
    const names = zipEntryNames(result);

    expect(names).not.toContain("src/modules/README.md");
    expect(names).not.toContain("docs/superpowers/plan.md");
    expect(names).not.toContain("specs/harness/README.md");
    expect(names).not.toContain("public/favicon.ico");
    expect(names).not.toContain(".github/workflows/ci.yml");
    expect(names).not.toContain(".claude/settings.json");
    expect(names).not.toContain(".vercel/project.json");
    expect(names).not.toContain("node_modules/fflate/index.js");
  });

  it("excludes repo README.md", async () => {
    const zipball = buildTestZipball();
    const { reader } = makeMockReaderTracked(zipball);
    const exportVaultZip = makeExportVaultZip({ reader });

    const result = await exportVaultZip();
    const names = zipEntryNames(result);

    expect(names).not.toContain("README.md");
  });

  it("excludes non-.md files (images etc)", async () => {
    const zipball = buildTestZipball();
    const { reader } = makeMockReaderTracked(zipball);
    const exportVaultZip = makeExportVaultZip({ reader });

    const result = await exportVaultZip();
    const names = zipEntryNames(result);

    expect(names).not.toContain("Assets/image.png");
  });

  it("preserves file content byte-for-byte", async () => {
    const zipball = buildTestZipball();
    const { reader } = makeMockReaderTracked(zipball);
    const exportVaultZip = makeExportVaultZip({ reader });

    const result = await exportVaultZip();

    expect(zipEntryContent(result, "Home.md")).toBe("# Home\n\nWelcome.");
    expect(zipEntryContent(result, "Projects/HQ/HQ.md")).toBe("# HQ\n\nHeadquarters.");
    expect(zipEntryContent(result, "Daily/2026-05-25.md")).toBe("# 2026-05-25\n\nToday.");
  });

  it("calls getZipball exactly once", async () => {
    const zipball = buildTestZipball();
    const { reader, calls } = makeMockReaderTracked(zipball);
    const exportVaultZip = makeExportVaultZip({ reader });

    await exportVaultZip();

    expect(calls.getZipball).toBe(1);
  });

  it("returns a Uint8Array", async () => {
    const zipball = buildTestZipball();
    const { reader } = makeMockReaderTracked(zipball);
    const exportVaultZip = makeExportVaultZip({ reader });

    const result = await exportVaultZip();

    expect(result).toBeInstanceOf(Uint8Array);
  });
});
