/**
 * set-share.test.ts — application unit tests for the SetShare use-case.
 *
 * Pure ports + mocks. Covers:
 *  - happy path: writes slug, returns DTO with public URL
 *  - rejects bad slug formats via validateSlug
 *  - rejects reserved slugs
 *  - throws SlugConflictError when another note already claims the slug
 *  - allows updating the SAME note's slug to itself (no conflict with self)
 *  - publicUrl honors the configured publicBaseUrl (trailing slash trimmed)
 *  - writer.writeSlug receives the validated (trimmed) slug
 */
import { describe, it, expect, vi } from "vitest";
import { makeSetShare } from "@/modules/share/application/set-share";
import { InvalidSlugError, SlugConflictError } from "@/modules/share/domain/slug";
import type { ShareWriter, ShareSnapshotPort } from "@/modules/share/application/ports";

function makeDeps(opts: { existingShares?: Array<{ path: string; slug: string; title: string }> } = {}) {
  const writer: ShareWriter = {
    writeSlug: vi.fn(async () => ({ sha: "commit-abc" })),
  };
  const snapshot: ShareSnapshotPort = {
    listShares: vi.fn(async () => opts.existingShares ?? []),
  };
  return { writer, snapshot };
}

describe("makeSetShare — happy path", () => {
  it("validates slug, writes via writer, returns DTO with publicUrl", async () => {
    const { writer, snapshot } = makeDeps();
    const setShare = makeSetShare({ writer, snapshot, publicBaseUrl: "https://md.sgnk.ai" });
    const result = await setShare({ path: "A.md", slug: "my-note" });
    expect(result).toEqual({
      path: "A.md",
      slug: "my-note",
      publicUrl: "https://md.sgnk.ai/my-note",
      sha: "commit-abc",
    });
    expect(writer.writeSlug).toHaveBeenCalledWith("A.md", "my-note");
  });

  it("trims surrounding whitespace from slug", async () => {
    const { writer, snapshot } = makeDeps();
    const setShare = makeSetShare({ writer, snapshot, publicBaseUrl: "https://md.sgnk.ai" });
    const result = await setShare({ path: "A.md", slug: "  my-note  " });
    expect(result.slug).toBe("my-note");
    expect(writer.writeSlug).toHaveBeenCalledWith("A.md", "my-note");
  });

  it("strips trailing slash from publicBaseUrl", async () => {
    const { writer, snapshot } = makeDeps();
    const setShare = makeSetShare({ writer, snapshot, publicBaseUrl: "https://md.sgnk.ai/" });
    const result = await setShare({ path: "A.md", slug: "x" });
    expect(result.publicUrl).toBe("https://md.sgnk.ai/x");
  });
});

describe("makeSetShare — validation failures", () => {
  it("rejects empty slug", async () => {
    const { writer, snapshot } = makeDeps();
    const setShare = makeSetShare({ writer, snapshot, publicBaseUrl: "x" });
    await expect(setShare({ path: "A.md", slug: "" })).rejects.toThrow(InvalidSlugError);
    expect(writer.writeSlug).not.toHaveBeenCalled();
  });
  it("rejects uppercase", async () => {
    const { writer, snapshot } = makeDeps();
    const setShare = makeSetShare({ writer, snapshot, publicBaseUrl: "x" });
    await expect(setShare({ path: "A.md", slug: "Hello" })).rejects.toThrow(InvalidSlugError);
    expect(writer.writeSlug).not.toHaveBeenCalled();
  });
  it("rejects reserved slug 'api'", async () => {
    const { writer, snapshot } = makeDeps();
    const setShare = makeSetShare({ writer, snapshot, publicBaseUrl: "x" });
    await expect(setShare({ path: "A.md", slug: "api" })).rejects.toThrow(/reserved/i);
    expect(writer.writeSlug).not.toHaveBeenCalled();
  });
});

describe("makeSetShare — uniqueness", () => {
  it("throws SlugConflictError when another note claims the slug", async () => {
    const { writer, snapshot } = makeDeps({
      existingShares: [{ path: "B.md", slug: "my-note", title: "B" }],
    });
    const setShare = makeSetShare({ writer, snapshot, publicBaseUrl: "x" });
    await expect(setShare({ path: "A.md", slug: "my-note" })).rejects.toMatchObject({
      name: "SlugConflictError",
      conflictPath: "B.md",
    });
    expect(writer.writeSlug).not.toHaveBeenCalled();
  });

  it("allows the same note to retain its own slug (idempotent re-share)", async () => {
    const { writer, snapshot } = makeDeps({
      existingShares: [{ path: "A.md", slug: "my-note", title: "A" }],
    });
    const setShare = makeSetShare({ writer, snapshot, publicBaseUrl: "x" });
    const result = await setShare({ path: "A.md", slug: "my-note" });
    expect(result.slug).toBe("my-note");
    expect(writer.writeSlug).toHaveBeenCalledWith("A.md", "my-note");
  });

  it("uniqueness check uses the post-validation slug (trimmed)", async () => {
    const { writer, snapshot } = makeDeps({
      existingShares: [{ path: "B.md", slug: "my-note", title: "B" }],
    });
    const setShare = makeSetShare({ writer, snapshot, publicBaseUrl: "x" });
    await expect(setShare({ path: "A.md", slug: "  my-note  " })).rejects.toThrow(SlugConflictError);
  });
});
