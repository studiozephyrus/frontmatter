/**
 * share-writer.test.ts — infrastructure tests for ShareWriter.
 *
 * Covers:
 *  - reads current file via the vault reader (so baseSha matches HEAD)
 *  - splices public_slug into existing YAML frontmatter
 *  - creates new frontmatter when the file has none
 *  - removes the key when slug is null
 *  - preserves the body verbatim
 *  - delegates to commitChanges with the right baseSha + message
 */
import { describe, it, expect, vi } from "vitest";
import matter from "gray-matter";
import { makeShareWriter } from "@/modules/share/infrastructure/share-writer";
import type { VaultReader } from "@/modules/vault/application/ports";
import type { CommitRequest, CommitResult } from "@/modules/repository/domain/commit";

function setup(initial: string, initialSha = "sha-base") {
  const reader: VaultReader = {
    getHeadSha: vi.fn(async () => "head"),
    getZipball: vi.fn(async () => new ArrayBuffer(0)),
    getFile: vi.fn(async () => ({ content: initial, sha: initialSha })),
    listHistory: async () => [],
    getFileAtSha: async () => null,
  };
  const commitChanges = vi.fn<(req: CommitRequest) => Promise<CommitResult>>(
    async () => ({ commitSha: "commit-new" }),
  );
  const writer = makeShareWriter({ reader, commitChanges });
  return { writer, reader, commitChanges };
}

describe("makeShareWriter — set slug", () => {
  it("adds public_slug into existing frontmatter; body untouched", async () => {
    const initial = `---
title: A
tags: []
---

# A

body line 1
body line 2`;
    const { writer, commitChanges } = setup(initial);
    await writer.writeSlug("A.md", "my-slug");
    const req = commitChanges.mock.calls[0]![0];
    expect(req.files).toHaveLength(1);
    const written = req.files[0]!;
    expect(written.path).toBe("A.md");
    expect(written.baseSha).toBe("sha-base");
    expect(req.message).toMatch(/my-slug/);
    const parsed = matter(written.content);
    expect(parsed.data["public_slug"]).toBe("my-slug");
    expect(parsed.data["title"]).toBe("A");
    expect(parsed.content.trim()).toContain("body line 1");
    expect(parsed.content.trim()).toContain("body line 2");
    expect(parsed.content.trim()).toContain("# A");
  });

  it("creates frontmatter when the file has none", async () => {
    const initial = `# A

just a body`;
    const { writer, commitChanges } = setup(initial);
    await writer.writeSlug("A.md", "my-slug");
    const written = commitChanges.mock.calls[0]![0].files[0]!;
    const parsed = matter(written.content);
    expect(parsed.data["public_slug"]).toBe("my-slug");
    expect(parsed.content.trim()).toContain("just a body");
  });

  it("replaces existing public_slug rather than appending", async () => {
    const initial = `---
public_slug: old-slug
title: A
---
body`;
    const { writer, commitChanges } = setup(initial);
    await writer.writeSlug("A.md", "new-slug");
    const written = commitChanges.mock.calls[0]![0].files[0]!;
    const parsed = matter(written.content);
    expect(parsed.data["public_slug"]).toBe("new-slug");
  });
});

describe("makeShareWriter — remove slug", () => {
  it("deletes the public_slug key when slug is null", async () => {
    const initial = `---
public_slug: gone
title: A
---
body`;
    const { writer, commitChanges } = setup(initial);
    await writer.writeSlug("A.md", null);
    const written = commitChanges.mock.calls[0]![0].files[0]!;
    const parsed = matter(written.content);
    expect(parsed.data["public_slug"]).toBeUndefined();
    expect(parsed.data["title"]).toBe("A");
    expect(parsed.content.trim()).toBe("body");
  });

  it("commit message indicates unpublish", async () => {
    const { writer, commitChanges } = setup(`---
public_slug: x
---
body`);
    await writer.writeSlug("A.md", null);
    const req = commitChanges.mock.calls[0]![0];
    expect(req.message).toMatch(/unpublish/);
  });
});

describe("makeShareWriter — propagation", () => {
  it("propagates baseSha from the read", async () => {
    const { writer, commitChanges } = setup("body", "specific-sha");
    await writer.writeSlug("A.md", "x");
    expect(commitChanges.mock.calls[0]?.[0].files[0]?.baseSha).toBe("specific-sha");
  });

  it("returns the new commit sha", async () => {
    const { writer } = setup("body");
    const r = await writer.writeSlug("A.md", "x");
    expect(r).toEqual({ sha: "commit-new" });
  });

  it("propagates commitChanges errors (no silent failure)", async () => {
    const reader = {
      getHeadSha: vi.fn(async () => "h"),
      getZipball: vi.fn(async () => new ArrayBuffer(0)),
      getFile: vi.fn(async () => ({ content: "body", sha: "s" })),
      listHistory: async () => [],
      getFileAtSha: async () => null,
    };
    const commitChanges = vi.fn(async () => { throw new Error("upstream-commit-error"); });
    const writer = makeShareWriter({ reader, commitChanges });
    await expect(writer.writeSlug("A.md", "x")).rejects.toThrow("upstream-commit-error");
  });

  it("propagates getFile errors (no silent failure)", async () => {
    const reader = {
      getHeadSha: vi.fn(async () => "h"),
      getZipball: vi.fn(async () => new ArrayBuffer(0)),
      getFile: vi.fn(async () => { throw new Error("file-not-found"); }),
      listHistory: async () => [],
      getFileAtSha: async () => null,
    };
    const commitChanges = vi.fn(async () => ({ commitSha: "c" }));
    const writer = makeShareWriter({ reader, commitChanges });
    await expect(writer.writeSlug("A.md", "x")).rejects.toThrow("file-not-found");
    expect(commitChanges).not.toHaveBeenCalled();
  });
});
