/**
 * Unit tests for RenameNote use-case.
 *
 * The use-case now fetches ONLY the referencing notes (supplied by the caller
 * from the snapshot backlink index) via reader.getFile — no full-vault zipball.
 *
 * Verifies:
 *   1. createTree is called with a blob for newPath, a blob for each relinked
 *      referencing note, and a null-sha entry for oldPath.
 *   2. relinkedCount counts only notes whose links actually changed.
 *   3. Notes not in referencingPaths are never fetched/touched.
 *   4. A pure rename (no referencingPaths) writes only the renamed note.
 *   5. NoteExistsError when newPath already exists.
 *   6. A stale backlink (getFile throws) is skipped, not fatal.
 */

import { describe, it, expect, beforeEach } from "vitest";
import { makeRenameNote, type NoteContentReader } from "@/modules/repository/application/rename-note";
import { NoteExistsError } from "@/modules/repository/application/file-ops";
import type { RepositoryWriter, TreeItem } from "@/modules/repository/application/ports";
import type { CommitAuthor } from "@/modules/repository/domain/commit";

const AUTHOR: CommitAuthor = { name: "Test User", email: "test@example.com" };

const FILES: Record<string, string> = {
  "A.md": "# A\n",
  "Ref.md": "see [[A]]\n",
  "Unrelated.md": "# Unrelated\n\nNo links here.\n",
};

function makeMockReader(files: Record<string, string> = FILES): NoteContentReader {
  return {
    async getFile(path: string) {
      const content = files[path];
      if (content === undefined) throw new Error(`not found: ${path}`);
      return { content, sha: `sha-${path}` };
    },
  };
}

interface CallLog {
  method: string;
  args: unknown[];
}

interface MockWriter extends RepositoryWriter {
  calls: CallLog[];
  existingPaths: Map<string, string>;
}

function makeMockWriter(existingPaths?: Map<string, string>): MockWriter {
  const calls: CallLog[] = [];
  const paths = existingPaths ?? new Map<string, string>();
  let blobCounter = 0;

  return {
    calls,
    existingPaths: paths,
    async getHeadCommit() {
      calls.push({ method: "getHeadCommit", args: [] });
      return { commitSha: "head-commit", treeSha: "head-tree" };
    },
    async getBlobSha(path: string) {
      calls.push({ method: "getBlobSha", args: [path] });
      return paths.get(path) ?? null;
    },
    async createBinaryBlob(base64: string) {
      blobCounter++;
      calls.push({ method: "createBinaryBlob", args: [base64] });
      return `blob-${blobCounter}`;
    },
    async createBlob(content: string) {
      blobCounter++;
      calls.push({ method: "createBlob", args: [content] });
      return `blob-${blobCounter}`;
    },
    async createTree(baseTreeSha: string, items: TreeItem[]) {
      calls.push({ method: "createTree", args: [baseTreeSha, items] });
      return "new-tree";
    },
    async createCommit(message: string, treeSha: string, parentSha: string, author: CommitAuthor) {
      calls.push({ method: "createCommit", args: [message, treeSha, parentSha, author] });
      return "new-commit";
    },
    async updateRef(commitSha: string) {
      calls.push({ method: "updateRef", args: [commitSha] });
    },
  };
}

const treeItemsOf = (writer: MockWriter): TreeItem[] => {
  const treeCall = writer.calls.find((c) => c.method === "createTree");
  return (treeCall?.args[1] as TreeItem[]) ?? [];
};

describe("RenameNote use-case", () => {
  describe("happy path: A.md → B.md, Ref.md references [[A]]", () => {
    let writer: MockWriter;
    let result: Awaited<ReturnType<ReturnType<typeof makeRenameNote>>>;

    beforeEach(async () => {
      writer = makeMockWriter(new Map([["A.md", "sha-a"]]));
      const renameNote = makeRenameNote({ reader: makeMockReader(), writer, author: AUTHOR });
      result = await renameNote({ oldPath: "A.md", newPath: "B.md", referencingPaths: ["Ref.md"] });
    });

    it("returns the new commit sha", () => {
      expect(result.commitSha).toBe("new-commit");
    });
    it("relinkedCount === 1 (only Ref.md changed)", () => {
      expect(result.relinkedCount).toBe(1);
    });
    it("writes a blob for B.md", () => {
      const item = treeItemsOf(writer).find((i) => i.path === "B.md");
      expect(item?.sha).not.toBeNull();
    });
    it("writes a relinked blob for Ref.md", () => {
      const item = treeItemsOf(writer).find((i) => i.path === "Ref.md");
      expect(item?.sha).not.toBeNull();
    });
    it("deletes A.md (null sha)", () => {
      const item = treeItemsOf(writer).find((i) => i.path === "A.md");
      expect(item).toBeDefined();
      expect(item?.sha).toBeNull();
    });
    it("calls updateRef with the new commit sha", () => {
      const refCall = writer.calls.find((c) => c.method === "updateRef");
      expect(refCall?.args[0]).toBe("new-commit");
    });
    it("createBlob is called exactly twice (B.md + Ref.md)", () => {
      expect(writer.calls.filter((c) => c.method === "createBlob")).toHaveLength(2);
    });
  });

  describe("pure rename (no referencingPaths)", () => {
    it("writes only the renamed note + deletion, relinkedCount 0", async () => {
      const writer = makeMockWriter(new Map([["A.md", "sha-a"]]));
      const renameNote = makeRenameNote({ reader: makeMockReader(), writer, author: AUTHOR });
      const res = await renameNote({ oldPath: "A.md", newPath: "B.md" });
      expect(res.relinkedCount).toBe(0);
      expect(writer.calls.filter((c) => c.method === "createBlob")).toHaveLength(1);
      const items = treeItemsOf(writer);
      expect(items.map((i) => i.path).sort()).toEqual(["A.md", "B.md"]);
    });
  });

  describe("referencing note that does not actually contain the link", () => {
    it("does not relink it (changed=false)", async () => {
      const writer = makeMockWriter(new Map([["A.md", "sha-a"]]));
      const renameNote = makeRenameNote({ reader: makeMockReader(), writer, author: AUTHOR });
      const res = await renameNote({ oldPath: "A.md", newPath: "B.md", referencingPaths: ["Unrelated.md"] });
      expect(res.relinkedCount).toBe(0);
      expect(treeItemsOf(writer).find((i) => i.path === "Unrelated.md")).toBeUndefined();
    });
  });

  describe("stale backlink (referenced note no longer exists)", () => {
    it("skips it without failing the rename", async () => {
      const writer = makeMockWriter(new Map([["A.md", "sha-a"]]));
      const renameNote = makeRenameNote({ reader: makeMockReader(), writer, author: AUTHOR });
      const res = await renameNote({ oldPath: "A.md", newPath: "B.md", referencingPaths: ["Ghost.md"] });
      expect(res.commitSha).toBe("new-commit");
      expect(res.relinkedCount).toBe(0);
    });
  });

  describe("NoteExistsError when newPath already exists", () => {
    it("throws and makes no commit", async () => {
      const writer = makeMockWriter(new Map([["A.md", "sha-a"], ["B.md", "sha-b"]]));
      const renameNote = makeRenameNote({ reader: makeMockReader(), writer, author: AUTHOR });
      await expect(
        renameNote({ oldPath: "A.md", newPath: "B.md", referencingPaths: ["Ref.md"] }),
      ).rejects.toThrow(NoteExistsError);
      expect(writer.calls.filter((c) => c.method === "createCommit")).toHaveLength(0);
    });
  });

  describe("commit message", () => {
    it("uses the 'Rename A → B' format", async () => {
      const writer = makeMockWriter(new Map([["A.md", "sha-a"]]));
      const renameNote = makeRenameNote({ reader: makeMockReader(), writer, author: AUTHOR });
      await renameNote({ oldPath: "A.md", newPath: "B.md" });
      const commitCall = writer.calls.find((c) => c.method === "createCommit");
      expect(commitCall?.args[0]).toBe("Rename A → B");
    });
  });
});
