/**
 * list-conflicts.test.ts — application unit tests for ListConflicts.
 *
 * Conflict = a slug claimed by >1 note.
 */
import { describe, it, expect, vi } from "vitest";
import { makeListConflicts } from "@/modules/share/application/list-conflicts";
import type { ShareSnapshotPort } from "@/modules/share/application/ports";

function port(shares: Array<{ path: string; slug: string; title: string }>): ShareSnapshotPort {
  return { listShares: vi.fn(async () => shares) };
}

describe("makeListConflicts", () => {
  it("returns [] when no shares", async () => {
    const fn = makeListConflicts({ snapshot: port([]) });
    expect(await fn()).toEqual([]);
  });

  it("returns [] when every slug is unique", async () => {
    const fn = makeListConflicts({ snapshot: port([
      { path: "A.md", slug: "a", title: "A" },
      { path: "B.md", slug: "b", title: "B" },
    ]) });
    expect(await fn()).toEqual([]);
  });

  it("groups paths by duplicate slug", async () => {
    const fn = makeListConflicts({ snapshot: port([
      { path: "A.md", slug: "shared", title: "A" },
      { path: "B.md", slug: "shared", title: "B" },
      { path: "C.md", slug: "unique", title: "C" },
    ]) });
    const r = await fn();
    expect(r).toHaveLength(1);
    expect(r[0]?.slug).toBe("shared");
    expect(r[0]?.notes.map((n) => n.path).sort()).toEqual(["A.md", "B.md"]);
  });

  it("sorts conflicts alphabetically by slug", async () => {
    const fn = makeListConflicts({ snapshot: port([
      { path: "1.md", slug: "zeta", title: "1" },
      { path: "2.md", slug: "zeta", title: "2" },
      { path: "3.md", slug: "alpha", title: "3" },
      { path: "4.md", slug: "alpha", title: "4" },
    ]) });
    const r = await fn();
    expect(r.map((c) => c.slug)).toEqual(["alpha", "zeta"]);
  });

  it("preserves title in each conflict entry", async () => {
    const fn = makeListConflicts({ snapshot: port([
      { path: "A.md", slug: "x", title: "Alpha Title" },
      { path: "B.md", slug: "x", title: "Beta Title" },
    ]) });
    const r = await fn();
    expect(r[0]?.notes.find((n) => n.path === "A.md")?.title).toBe("Alpha Title");
    expect(r[0]?.notes.find((n) => n.path === "B.md")?.title).toBe("Beta Title");
  });

  it("handles three-way conflicts", async () => {
    const fn = makeListConflicts({ snapshot: port([
      { path: "A.md", slug: "trip", title: "A" },
      { path: "B.md", slug: "trip", title: "B" },
      { path: "C.md", slug: "trip", title: "C" },
    ]) });
    const r = await fn();
    expect(r).toHaveLength(1);
    expect(r[0]?.notes).toHaveLength(3);
  });
});
