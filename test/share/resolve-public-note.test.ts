/**
 * resolve-public-note.test.ts — application unit tests.
 *
 * Coverage:
 *  - unknown slug → null
 *  - duplicate slug (conflict) → null (route stays 404 until resolved)
 *  - single match → returns note with frontmatter stripped
 *  - leading H1 matching the title is stripped
 *  - leading H1 NOT matching the title is preserved
 *  - body with no H1 untouched
 *  - blank lines after stripped H1 collapsed
 */
import { describe, it, expect, vi } from "vitest";
import {
  makeResolvePublicNote,
  type PublicFileReader,
} from "@/modules/share/application/resolve-public-note";
import type { ShareSnapshotPort } from "@/modules/share/application/ports";

function setup(opts: {
  shares?: Array<{ path: string; slug: string; title: string }>;
  files?: Record<string, { content: string; sha: string }>;
}) {
  const snapshot: ShareSnapshotPort = {
    listShares: vi.fn(async () => opts.shares ?? []),
  };
  const reader: PublicFileReader = {
    getFile: vi.fn(async (p: string) => {
      const f = (opts.files ?? {})[p];
      if (!f) throw new Error("not found: " + p);
      return f;
    }),
  };
  return { snapshot, reader };
}

describe("makeResolvePublicNote — lookup", () => {
  it("returns null when slug is unknown", async () => {
    const { snapshot, reader } = setup({});
    const fn = makeResolvePublicNote({ snapshot, reader });
    expect(await fn("nope")).toBeNull();
  });

  it("returns null on duplicate slug (conflict)", async () => {
    const { snapshot, reader } = setup({
      shares: [
        { path: "A.md", slug: "x", title: "A" },
        { path: "B.md", slug: "x", title: "B" },
      ],
    });
    const fn = makeResolvePublicNote({ snapshot, reader });
    expect(await fn("x")).toBeNull();
  });

  it("returns the note when exactly one match", async () => {
    const { snapshot, reader } = setup({
      shares: [{ path: "A.md", slug: "x", title: "Apollo" }],
      files: { "A.md": { content: "hello body", sha: "s1" } },
    });
    const fn = makeResolvePublicNote({ snapshot, reader });
    const r = await fn("x");
    expect(r).toMatchObject({
      slug: "x",
      path: "A.md",
      title: "Apollo",
      sha: "s1",
    });
  });
});

describe("makeResolvePublicNote — content stripping", () => {
  async function resolve(content: string, title = "Apollo") {
    const { snapshot, reader } = setup({
      shares: [{ path: "A.md", slug: "x", title }],
      files: { "A.md": { content, sha: "s1" } },
    });
    const fn = makeResolvePublicNote({ snapshot, reader });
    return (await fn("x"))!.content;
  }

  it("strips YAML frontmatter", async () => {
    const r = await resolve(`---
title: Apollo
tags: []
---

body content here`);
    expect(r).toBe("body content here");
  });

  it("strips leading H1 matching the title", async () => {
    const r = await resolve(`# Apollo

actual content`);
    expect(r).toBe("actual content");
  });

  it("strips leading H1 case-insensitively", async () => {
    const r = await resolve(`# apollo

content`);
    expect(r).toBe("content");
  });

  it("preserves leading H1 when it does NOT match the title", async () => {
    const r = await resolve(`# Something Else

body`);
    expect(r).toBe("# Something Else\n\nbody");
  });

  it("strips frontmatter AND matching H1 together", async () => {
    const r = await resolve(`---
title: Apollo
---

# Apollo

body`);
    expect(r).toBe("body");
  });

  it("collapses blank lines following a stripped H1", async () => {
    const r = await resolve(`# Apollo



real content`);
    expect(r).toBe("real content");
  });

  it("returns empty string when the only content was the title H1", async () => {
    const r = await resolve(`---
title: Apollo
---

# Apollo`);
    expect(r).toBe("");
  });

  it("does not touch H2/H3 even if they match the title", async () => {
    const r = await resolve(`## Apollo

body`);
    expect(r).toBe("## Apollo\n\nbody");
  });

  it("leaves H1 inside body alone (only the LEADING one is stripped)", async () => {
    const r = await resolve(`intro paragraph

# Apollo

mid-body section`);
    expect(r).toContain("# Apollo");
    expect(r.startsWith("intro")).toBe(true);
  });
});
