/**
 * Tests for the UploadAttachment use-case.
 *
 * Verifies:
 * 1. createBinaryBlob is called with the provided base64 data.
 * 2. The returned path is under _attachments/ with a timestamp-prefixed filename.
 * 3. createCommit and updateRef are called.
 */
import { describe, it, expect } from "vitest";
import { makeUploadAttachment, formatTimestamp } from "@/modules/repository/application/upload-attachment";
import type { RepositoryWriter, TreeItem } from "@/modules/repository/application/ports";
import type { CommitAuthor } from "@/modules/repository/domain/commit";

// ---------------------------------------------------------------------------
// Mock RepositoryWriter
// ---------------------------------------------------------------------------

interface MockWriter extends RepositoryWriter {
  calls: { method: string; args: unknown[] }[];
  nextBlobSha: string;
  nextTreeSha: string;
  nextCommitSha: string;
}

function makeMockWriter(): MockWriter {
  const calls: { method: string; args: unknown[] }[] = [];
  const writer: MockWriter = {
    calls,
    nextBlobSha: "bin-blob-sha",
    nextTreeSha: "tree-sha",
    nextCommitSha: "commit-sha",

    async getHeadCommit() {
      calls.push({ method: "getHeadCommit", args: [] });
      return { commitSha: "head-sha", treeSha: "head-tree-sha" };
    },

    async getBlobSha(path: string) {
      calls.push({ method: "getBlobSha", args: [path] });
      return null;
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

    async createCommit(message: string, treeSha: string, parentSha: string, author: CommitAuthor) {
      calls.push({ method: "createCommit", args: [message, treeSha, parentSha, author] });
      return writer.nextCommitSha;
    },

    async updateRef(commitSha: string) {
      calls.push({ method: "updateRef", args: [commitSha] });
    },
  };
  return writer;
}

const AUTHOR: CommitAuthor = { name: "Test User", email: "test@example.com" };

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("UploadAttachment use-case", () => {
  it("calls createBinaryBlob with the provided base64", async () => {
    const writer = makeMockWriter();
    const uploadAttachment = makeUploadAttachment({ writer, author: AUTHOR });

    await uploadAttachment({ filename: "photo.png", dataBase64: "abc123==" });

    const binaryBlobCalls = writer.calls.filter((c) => c.method === "createBinaryBlob");
    expect(binaryBlobCalls).toHaveLength(1);
    expect(binaryBlobCalls[0]?.args[0]).toBe("abc123==");
  });

  it("does NOT call text createBlob", async () => {
    const writer = makeMockWriter();
    const uploadAttachment = makeUploadAttachment({ writer, author: AUTHOR });

    await uploadAttachment({ filename: "photo.png", dataBase64: "abc123==" });

    const textBlobCalls = writer.calls.filter((c) => c.method === "createBlob");
    expect(textBlobCalls).toHaveLength(0);
  });

  it("returns a path under _attachments/ with the filename", async () => {
    const writer = makeMockWriter();
    const uploadAttachment = makeUploadAttachment({ writer, author: AUTHOR });

    const result = await uploadAttachment({ filename: "image.jpg", dataBase64: "data==" });

    expect(result.path).toMatch(/^_attachments\/\d{8}-\d{6}-image\.jpg$/);
  });

  it("returns the commit sha from updateRef sequence", async () => {
    const writer = makeMockWriter();
    const uploadAttachment = makeUploadAttachment({ writer, author: AUTHOR });

    const result = await uploadAttachment({ filename: "x.png", dataBase64: "Y==" });
    expect(result.commitSha).toBe("commit-sha");
  });

  it("calls createCommit and updateRef", async () => {
    const writer = makeMockWriter();
    const uploadAttachment = makeUploadAttachment({ writer, author: AUTHOR });

    await uploadAttachment({ filename: "x.png", dataBase64: "Y==" });

    expect(writer.calls.some((c) => c.method === "createCommit")).toBe(true);
    expect(writer.calls.some((c) => c.method === "updateRef")).toBe(true);
  });
});

describe("formatTimestamp", () => {
  it("formats a UTC date as YYYYMMDD-HHMMSS", () => {
    // 2024-03-15 09:07:05 UTC
    const d = new Date(Date.UTC(2024, 2, 15, 9, 7, 5));
    expect(formatTimestamp(d)).toBe("20240315-090705");
  });

  it("zero-pads single-digit month, day, hour, minute, second", () => {
    const d = new Date(Date.UTC(2025, 0, 1, 1, 2, 3));
    expect(formatTimestamp(d)).toBe("20250101-010203");
  });
});
