/**
 * TDD test for GetFile use-case.
 *
 * Verifies:
 * 1. Returns { path, content, sha } on success.
 * 2. Throws on empty path.
 * 3. Throws on traversal path (e.g. "../escape").
 * 4. Throws on leading "/" paths.
 */
import { describe, it, expect } from "vitest";
import { makeGetFile } from "@/modules/vault/application/get-file";
import type { VaultReader } from "@/modules/vault/application/ports";

// ---------------------------------------------------------------------------
// Mock VaultReader — only getFile matters here
// ---------------------------------------------------------------------------

function makeMockReader(
  result: { content: string; sha: string } = { content: "# Hi", sha: "abc" },
): VaultReader {
  return {
    getHeadSha: async () => "irrelevant",
    getZipball: async () => new ArrayBuffer(0),
    getFile: async (_path: string) => result,
    listHistory: async () => [],
    getFileAtSha: async () => null,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("makeGetFile", () => {
  it("returns path, content, and sha on a valid path", async () => {
    const getFile = makeGetFile({ reader: makeMockReader() });
    const result = await getFile("Projects/HQ/HQ.md");
    expect(result).toEqual({ path: "Projects/HQ/HQ.md", content: "# Hi", sha: "abc" });
  });

  it("throws on an empty path", async () => {
    const getFile = makeGetFile({ reader: makeMockReader() });
    await expect(getFile("")).rejects.toThrow();
  });

  it("throws on a path with leading slash", async () => {
    const getFile = makeGetFile({ reader: makeMockReader() });
    await expect(getFile("/etc/passwd")).rejects.toThrow();
  });

  it("throws on a traversal path containing ..", async () => {
    const getFile = makeGetFile({ reader: makeMockReader() });
    await expect(getFile("../escape")).rejects.toThrow();
  });

  it("throws on a path with .. segment in the middle", async () => {
    const getFile = makeGetFile({ reader: makeMockReader() });
    await expect(getFile("Projects/../../../etc/passwd")).rejects.toThrow();
  });
});
