/**
 * §6.5 — search-index.ts used the same non-fatal `new TextDecoder()` as
 * get-snapshot.ts. A file with invalid UTF-8 bytes still got indexed with
 * mojibake content instead of being refused.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { zipSync } from "fflate";

const { mockGetHeadSha, mockGetZipball } = vi.hoisted(() => ({
  mockGetHeadSha: vi.fn<() => Promise<string>>(),
  mockGetZipball: vi.fn<() => Promise<ArrayBuffer>>(),
}));

vi.mock("@/shared/infrastructure/github/client", () => ({
  getHeadSha: mockGetHeadSha,
  getZipball: mockGetZipball,
}));

import { searchNotes, _resetSearchCache } from "@/modules/vault/infrastructure/search-index";

/** Same shape as the handoff's own probe: "Caf" + invalid lead byte + ascii tail. */
function invalidUtf8Bytes(): Uint8Array {
  const enc = new TextEncoder();
  const prefix = enc.encode("Caf");
  const suffix = enc.encode(" notes about coffee\n");
  return new Uint8Array([...prefix, 0xe9, ...suffix]);
}

function buildTestZip(): ArrayBuffer {
  const enc = new TextEncoder();
  const files: Record<string, Uint8Array> = {
    "repo-abc123/Home.md": enc.encode("# Home\n\nA valid note.\n"),
    "repo-abc123/Broken.md": invalidUtf8Bytes(),
  };
  return zipSync(files).buffer as ArrayBuffer;
}

beforeEach(() => {
  _resetSearchCache();
  mockGetHeadSha.mockReset();
  mockGetZipball.mockReset();
  mockGetHeadSha.mockResolvedValue("abc123");
  mockGetZipball.mockResolvedValue(buildTestZip());
});

describe("search index refuses invalid UTF-8 instead of decoding it lossily", () => {
  it("does not index the invalid-UTF-8 file — a term unique to it is unfindable", async () => {
    const results = await searchNotes("coffee");
    expect(results).toHaveLength(0);
  });

  it("still indexes the valid file normally", async () => {
    const results = await searchNotes("valid");
    expect(results.map((r) => r.path)).toContain("Home.md");
  });
});
