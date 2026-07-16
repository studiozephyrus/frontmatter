import { describe, it, expect } from "vitest";
import { makeMergeNote, type MergeReader } from "@/modules/repository/application/merge-note";

function reader(files: { base?: string; remote: string; remoteSha?: string }): MergeReader {
  return {
    async getFile() {
      return { content: files.remote, sha: files.remoteSha ?? "remote-sha" };
    },
    async getBlobContent() {
      return files.base ?? "";
    },
  };
}

describe("makeMergeNote", () => {
  it("clean-merges non-overlapping edits and returns the remote sha", async () => {
    const merge = makeMergeNote({
      reader: reader({ base: "a\nb\nc", remote: "a\nb\nC", remoteSha: "rsha" }),
    });
    const out = await merge({ path: "n.md", baseSha: "bsha", localContent: "A\nb\nc" });
    expect(out.clean).toBe(true);
    expect(out.text).toBe("A\nb\nC");
    expect(out.remoteSha).toBe("rsha");
    expect(out.conflicts).toBe(0);
  });

  it("returns conflict markers when both sides change the same line", async () => {
    const merge = makeMergeNote({
      reader: reader({ base: "a\nb\nc", remote: "a\nREMOTE\nc" }),
    });
    const out = await merge({ path: "n.md", baseSha: "bsha", localContent: "a\nLOCAL\nc" });
    expect(out.clean).toBe(false);
    expect(out.conflicts).toBe(1);
    expect(out.text).toContain("LOCAL");
    expect(out.text).toContain("REMOTE");
    expect(out.text).toContain("<<<<<<< local");
  });

  it("takes remote when only remote changed (local equals base)", async () => {
    const merge = makeMergeNote({
      reader: reader({ base: "x\ny", remote: "x\nY" }),
    });
    const out = await merge({ path: "n.md", baseSha: "bsha", localContent: "x\ny" });
    expect(out).toMatchObject({ clean: true, text: "x\nY" });
  });

  it("treats an empty baseSha as a 2-way add (no common ancestor)", async () => {
    const merge = makeMergeNote({
      reader: reader({ remote: "remote-line" }),
    });
    const out = await merge({ path: "n.md", baseSha: "", localContent: "local-line" });
    // Different content created on both sides with no base → conflict, not silent loss.
    expect(out.clean).toBe(false);
    expect(out.text).toContain("local-line");
    expect(out.text).toContain("remote-line");
  });
});
