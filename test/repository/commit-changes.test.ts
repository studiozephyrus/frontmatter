/**
 * TDD tests for CommitChanges use-case.
 *
 * Verifies:
 * 1. Happy path: 2 files, matching baseShas → creates blobs, tree, commit, updates ref.
 * 2. Conflict: one file has diverged sha → throws ConflictError, no writes.
 * 3. Deletion: deletion with matching baseSha → tree item has sha:null; happy commit.
 */
import { describe, it, expect, beforeEach } from "vitest";
import { makeCommitChanges } from "@/modules/repository/application/commit-changes";
import { ConflictError } from "@/modules/repository/domain/commit";
import type { RepositoryWriter, TreeItem } from "@/modules/repository/application/ports";
import type { CommitAuthor } from "@/modules/repository/domain/commit";

// ---------------------------------------------------------------------------
// Mock RepositoryWriter
// ---------------------------------------------------------------------------

interface CallLog {
  method: string;
  args: unknown[];
}

interface MockWriter extends RepositoryWriter {
  calls: CallLog[];
  blobShaBySha: Map<string, string | null>; // path → current sha in remote
  nextBlobSha: string;
  nextTreeSha: string;
  nextCommitSha: string;
}

function makeMockWriter(opts?: {
  headCommitSha?: string;
  headTreeSha?: string;
  nextBlobSha?: string;
  nextTreeSha?: string;
  nextCommitSha?: string;
}): MockWriter {
  const calls: CallLog[] = [];
  const blobShaBySha = new Map<string, string | null>();

  const writer: MockWriter = {
    calls,
    blobShaBySha,
    nextBlobSha: opts?.nextBlobSha ?? "blob-sha-new",
    nextTreeSha: opts?.nextTreeSha ?? "tree-sha-new",
    nextCommitSha: opts?.nextCommitSha ?? "commit-sha-new",

    async getHeadCommit() {
      calls.push({ method: "getHeadCommit", args: [] });
      return {
        commitSha: opts?.headCommitSha ?? "head-commit",
        treeSha: opts?.headTreeSha ?? "head-tree",
      };
    },

    async getBlobSha(path: string) {
      calls.push({ method: "getBlobSha", args: [path] });
      return blobShaBySha.get(path) ?? null;
    },

    async createBlob(content: string) {
      calls.push({ method: "createBlob", args: [content] });
      return writer.nextBlobSha;
    },

    async createBinaryBlob(base64: string) {
      calls.push({ method: "createBinaryBlob", args: [base64] });
      return writer.nextBlobSha;
    },

    async createTree(baseTreeSha: string, items: TreeItem[]) {
      calls.push({ method: "createTree", args: [baseTreeSha, items] });
      return writer.nextTreeSha;
    },

    async createCommit(
      message: string,
      treeSha: string,
      parentSha: string,
      author: CommitAuthor,
    ) {
      calls.push({ method: "createCommit", args: [message, treeSha, parentSha, author] });
      return writer.nextCommitSha;
    },

    async updateRef(commitSha: string) {
      calls.push({ method: "updateRef", args: [commitSha] });
    },
  };

  return writer;
}

// ---------------------------------------------------------------------------
// Shared author fixture
// ---------------------------------------------------------------------------

const AUTHOR: CommitAuthor = { name: "Test User", email: "test@example.com" };

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("CommitChanges use-case", () => {
  describe("happy path: 2 files, no conflict", () => {
    let writer: MockWriter;

    beforeEach(async () => {
      writer = makeMockWriter({ nextCommitSha: "abc123" });
      // Both files exist at their expected baseSha
      writer.blobShaBySha.set("notes/foo.md", "sha-foo");
      writer.blobShaBySha.set("notes/bar.md", "sha-bar");

      const commitChanges = makeCommitChanges({ writer, author: AUTHOR });
      await commitChanges({
        message: "update two files",
        files: [
          { path: "notes/foo.md", content: "# Foo new", baseSha: "sha-foo" },
          { path: "notes/bar.md", content: "# Bar new", baseSha: "sha-bar" },
        ],
      });
    });

    it("calls getHeadCommit once", () => {
      const headCalls = writer.calls.filter((c) => c.method === "getHeadCommit");
      expect(headCalls).toHaveLength(1);
    });

    it("calls getBlobSha for each file", () => {
      const blobShaCalls = writer.calls.filter((c) => c.method === "getBlobSha");
      expect(blobShaCalls).toHaveLength(2);
      const paths = blobShaCalls.map((c) => c.args[0]);
      expect(paths).toContain("notes/foo.md");
      expect(paths).toContain("notes/bar.md");
    });

    it("calls createBlob for each file", () => {
      const blobCalls = writer.calls.filter((c) => c.method === "createBlob");
      expect(blobCalls).toHaveLength(2);
      const contents = blobCalls.map((c) => c.args[0]);
      expect(contents).toContain("# Foo new");
      expect(contents).toContain("# Bar new");
    });

    it("calls createTree once with 2 items", () => {
      const treeCalls = writer.calls.filter((c) => c.method === "createTree");
      expect(treeCalls).toHaveLength(1);
      const items = treeCalls[0]?.args[1] as TreeItem[];
      expect(items).toHaveLength(2);
      expect(items.every((i) => i.sha !== null)).toBe(true);
    });

    it("calls createCommit with correct message and shas", () => {
      const commitCalls = writer.calls.filter((c) => c.method === "createCommit");
      expect(commitCalls).toHaveLength(1);
      expect(commitCalls[0]?.args[0]).toBe("update two files");
      expect(commitCalls[0]?.args[1]).toBe("tree-sha-new");
      expect(commitCalls[0]?.args[2]).toBe("head-commit");
    });

    it("calls updateRef once with the new commit sha", () => {
      const refCalls = writer.calls.filter((c) => c.method === "updateRef");
      expect(refCalls).toHaveLength(1);
      expect(refCalls[0]?.args[0]).toBe("abc123");
    });

    it("returns the commit sha", async () => {
      const writer2 = makeMockWriter({ nextCommitSha: "xyz789" });
      writer2.blobShaBySha.set("notes/foo.md", "sha-foo");

      const result = await makeCommitChanges({ writer: writer2, author: AUTHOR })({
        message: "single file",
        files: [{ path: "notes/foo.md", content: "new content", baseSha: "sha-foo" }],
      });

      expect(result.commitSha).toBe("xyz789");
    });
  });

  describe("conflict detection", () => {
    it("throws ConflictError when a file's current sha differs from baseSha", async () => {
      const writer = makeMockWriter();
      // foo is at sha-foo-updated (different from baseSha expected by caller)
      writer.blobShaBySha.set("notes/foo.md", "sha-foo-updated");
      writer.blobShaBySha.set("notes/bar.md", "sha-bar");

      const commitChanges = makeCommitChanges({ writer, author: AUTHOR });
      await expect(
        commitChanges({
          message: "conflicting update",
          files: [
            { path: "notes/foo.md", content: "# Foo", baseSha: "sha-foo" }, // conflict
            { path: "notes/bar.md", content: "# Bar", baseSha: "sha-bar" }, // ok
          ],
        }),
      ).rejects.toThrow(ConflictError);
    });

    it("includes the conflicting path in ConflictError.paths", async () => {
      const writer = makeMockWriter();
      writer.blobShaBySha.set("notes/foo.md", "sha-foo-changed");
      writer.blobShaBySha.set("notes/bar.md", "sha-bar");

      const commitChanges = makeCommitChanges({ writer, author: AUTHOR });
      try {
        await commitChanges({
          message: "conflict test",
          files: [
            { path: "notes/foo.md", content: "x", baseSha: "sha-foo" },
            { path: "notes/bar.md", content: "y", baseSha: "sha-bar" },
          ],
        });
        expect.fail("should have thrown");
      } catch (err) {
        expect(err).toBeInstanceOf(ConflictError);
        const ce = err as ConflictError;
        expect(ce.paths).toEqual(["notes/foo.md"]);
      }
    });

    it("does NOT call createBlob or createCommit on conflict", async () => {
      const writer = makeMockWriter();
      writer.blobShaBySha.set("notes/foo.md", "different-sha");

      const commitChanges = makeCommitChanges({ writer, author: AUTHOR });
      await expect(
        commitChanges({
          message: "should not commit",
          files: [{ path: "notes/foo.md", content: "x", baseSha: "sha-foo" }],
        }),
      ).rejects.toThrow(ConflictError);

      const noBlob = writer.calls.every((c) => c.method !== "createBlob");
      const noCommit = writer.calls.every((c) => c.method !== "createCommit");
      expect(noBlob).toBe(true);
      expect(noCommit).toBe(true);
    });

    it("collects ALL conflicting paths (not just the first)", async () => {
      const writer = makeMockWriter();
      writer.blobShaBySha.set("notes/a.md", "sha-a-changed");
      writer.blobShaBySha.set("notes/b.md", "sha-b-changed");
      writer.blobShaBySha.set("notes/c.md", "sha-c"); // ok

      const commitChanges = makeCommitChanges({ writer, author: AUTHOR });
      try {
        await commitChanges({
          message: "multi conflict",
          files: [
            { path: "notes/a.md", content: "a", baseSha: "sha-a" },
            { path: "notes/b.md", content: "b", baseSha: "sha-b" },
            { path: "notes/c.md", content: "c", baseSha: "sha-c" },
          ],
        });
        expect.fail("should throw");
      } catch (err) {
        expect(err).toBeInstanceOf(ConflictError);
        const ce = err as ConflictError;
        expect(ce.paths).toContain("notes/a.md");
        expect(ce.paths).toContain("notes/b.md");
        expect(ce.paths).not.toContain("notes/c.md");
        expect(ce.paths).toHaveLength(2);
      }
    });
  });

  describe("deletion: happy path", () => {
    it("passes sha:null tree item for deletions and commits successfully", async () => {
      const writer = makeMockWriter({ nextCommitSha: "del-commit" });
      // deletion target exists at expected sha
      writer.blobShaBySha.set("notes/old.md", "sha-old");

      const commitChanges = makeCommitChanges({ writer, author: AUTHOR });
      const result = await commitChanges({
        message: "delete old note",
        files: [],
        deletions: [{ path: "notes/old.md", baseSha: "sha-old" }],
      });

      // tree items should include sha:null for the deletion
      const treeCalls = writer.calls.filter((c) => c.method === "createTree");
      expect(treeCalls).toHaveLength(1);
      const items = treeCalls[0]?.args[1] as TreeItem[];
      expect(items).toHaveLength(1);
      expect(items[0]).toEqual({ path: "notes/old.md", sha: null });

      expect(result.commitSha).toBe("del-commit");
    });

    it("throws ConflictError if deletion baseSha doesn't match current sha", async () => {
      const writer = makeMockWriter();
      writer.blobShaBySha.set("notes/old.md", "sha-updated-by-someone-else");

      const commitChanges = makeCommitChanges({ writer, author: AUTHOR });
      await expect(
        commitChanges({
          message: "conflict on deletion",
          files: [],
          deletions: [{ path: "notes/old.md", baseSha: "sha-old" }],
        }),
      ).rejects.toThrow(ConflictError);
    });

    it("does not call createBlob for deletions", async () => {
      const writer = makeMockWriter({ nextCommitSha: "del-commit-2" });
      writer.blobShaBySha.set("notes/old.md", "sha-old");

      const commitChanges = makeCommitChanges({ writer, author: AUTHOR });
      await commitChanges({
        message: "delete only",
        files: [],
        deletions: [{ path: "notes/old.md", baseSha: "sha-old" }],
      });

      const blobCalls = writer.calls.filter((c) => c.method === "createBlob");
      expect(blobCalls).toHaveLength(0);
    });
  });
});
