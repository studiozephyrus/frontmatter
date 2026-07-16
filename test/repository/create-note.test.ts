import { describe, it, expect } from "vitest";
import { makeCreateNote } from "@/modules/repository/application/create-note";
import { defaultNoteContent } from "@/modules/repository/application/file-ops";
import type { RepositoryWriter, TreeItem } from "@/modules/repository/application/ports";
import type { CommitAuthor } from "@/modules/repository/domain/commit";

const AUTHOR: CommitAuthor = { name: "T", email: "t@x.com" };

function writer(): RepositoryWriter & { lastBlob: string | null } {
  const w = {
    lastBlob: null as string | null,
    async getHeadCommit() {
      return { commitSha: "head", treeSha: "tree" };
    },
    async getBlobSha() {
      return null;
    },
    async createBlob(content: string) {
      w.lastBlob = content;
      return "blob-sha-123";
    },
    async createBinaryBlob() {
      return "bin";
    },
    async createTree(_base: string, _items: TreeItem[]) {
      return "new-tree";
    },
    async createCommit() {
      return "new-commit";
    },
    async updateRef() {},
  };
  return w;
}

describe("createNote", () => {
  it("returns the commit sha AND the created blob sha", async () => {
    const create = makeCreateNote({ writer: writer(), author: AUTHOR });
    const out = await create({ path: "Foo.md", content: "hi" });
    expect(out.commitSha).toBe("new-commit");
    expect(out.sha).toBe("blob-sha-123");
  });

  it("writes exactly the content it was given", async () => {
    const w = writer();
    const create = makeCreateNote({ writer: w, author: AUTHOR });
    await create({ path: "Foo.md", content: "the body" });
    expect(w.lastBlob).toBe("the body");
  });
});

describe("defaultNoteContent", () => {
  it("builds frontmatter + H1 from the basename", () => {
    expect(defaultNoteContent("MyNote.md")).toBe("---\ntitle: MyNote\ntags: []\n---\n\n# MyNote\n");
  });

  it("uses the last path segment for a nested note", () => {
    expect(defaultNoteContent("A/B/Deep.md")).toBe("---\ntitle: Deep\ntags: []\n---\n\n# Deep\n");
  });
});
