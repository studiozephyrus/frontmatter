import { describe, it, expect, vi } from "vitest";
import { makeGetNoteHistory } from "@/modules/vault/application/get-history";
import { makeGetNoteVersion } from "@/modules/vault/application/get-version";
import type { VaultReader, VaultHistoryEntry } from "@/modules/vault/application/ports";

function makeReader(over: Partial<VaultReader> = {}): VaultReader {
  return {
    getHeadSha: async () => "head",
    getZipball: async () => new ArrayBuffer(0),
    getFile: async () => ({ content: "", sha: "" }),
    listHistory: async () => [],
    getFileAtSha: async () => null,
    ...over,
  };
}

describe("GetNoteHistory", () => {
  it("delegates to reader.listHistory with the path + default limit 50", async () => {
    const listHistory = vi.fn<VaultReader["listHistory"]>(async () => []);
    const getNoteHistory = makeGetNoteHistory({ reader: makeReader({ listHistory }) });
    await getNoteHistory({ path: "Notes/A.md" });
    expect(listHistory).toHaveBeenCalledWith("Notes/A.md", 50);
  });

  it("forwards an explicit limit", async () => {
    const listHistory = vi.fn<VaultReader["listHistory"]>(async () => []);
    const getNoteHistory = makeGetNoteHistory({ reader: makeReader({ listHistory }) });
    await getNoteHistory({ path: "A.md", limit: 5 });
    expect(listHistory).toHaveBeenCalledWith("A.md", 5);
  });

  it("returns the entries the reader produced, untouched", async () => {
    const entries: VaultHistoryEntry[] = [
      { sha: "abc1234", message: "init", author: "sagnik", date: "2026-01-01T00:00:00Z" },
      { sha: "def5678", message: "edit", author: "sagnik", date: null },
    ];
    const getNoteHistory = makeGetNoteHistory({ reader: makeReader({ listHistory: async () => entries }) });
    const out = await getNoteHistory({ path: "A.md" });
    expect(out).toEqual(entries);
  });

  it("propagates reader errors (no swallow)", async () => {
    const getNoteHistory = makeGetNoteHistory({
      reader: makeReader({
        listHistory: async () => {
          throw new Error("502 upstream");
        },
      }),
    });
    await expect(getNoteHistory({ path: "A.md" })).rejects.toThrow("502 upstream");
  });
});

describe("GetNoteVersion", () => {
  it("returns ok+content when the reader resolves a file at sha", async () => {
    const getNoteVersion = makeGetNoteVersion({
      reader: makeReader({ getFileAtSha: async () => "# Old\n\nbody" }),
    });
    const res = await getNoteVersion({ path: "A.md", sha: "abc" });
    expect(res).toEqual({ ok: true, content: "# Old\n\nbody" });
  });

  it("returns not_a_file when the reader returns null (dir/submodule/oversize)", async () => {
    const getNoteVersion = makeGetNoteVersion({
      reader: makeReader({ getFileAtSha: async () => null }),
    });
    const res = await getNoteVersion({ path: "A", sha: "abc" });
    expect(res).toEqual({ ok: false, reason: "not_a_file" });
  });

  it("passes path + sha straight through to the reader", async () => {
    const getFileAtSha = vi.fn<VaultReader["getFileAtSha"]>(async () => "x");
    const getNoteVersion = makeGetNoteVersion({ reader: makeReader({ getFileAtSha }) });
    await getNoteVersion({ path: "Deep/Path.md", sha: "deadbeef" });
    expect(getFileAtSha).toHaveBeenCalledWith("Deep/Path.md", "deadbeef");
  });

  it("treats empty string as valid content (ok), distinct from null", async () => {
    const getNoteVersion = makeGetNoteVersion({
      reader: makeReader({ getFileAtSha: async () => "" }),
    });
    const res = await getNoteVersion({ path: "Empty.md", sha: "abc" });
    expect(res).toEqual({ ok: true, content: "" });
  });
});
