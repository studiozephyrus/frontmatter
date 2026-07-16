/**
 * share-snapshot-port.test.ts — infra adapter unit tests.
 */
import { describe, it, expect, vi } from "vitest";
import { makeShareSnapshotPort } from "@/modules/share/infrastructure/share-snapshot-port";
import type { VaultSnapshot, NoteMeta } from "@/modules/vault/application/dto";

function snap(notes: NoteMeta[]): VaultSnapshot {
  return {
    sha: "test",
    generatedAt: "2026-01-01",
    tree: { name: "", path: "", type: "folder", children: [] },
    notes,
  };
}

describe("makeShareSnapshotPort", () => {
  it("returns only notes that have a publicSlug", async () => {
    const port = makeShareSnapshotPort({
      getSnapshot: vi.fn(async () => snap([
        { path: "A.md", title: "A", tags: [], outbound: [], backlinks: [], excludeFromGraph: false, publicSlug: "a" },
        { path: "B.md", title: "B", tags: [], outbound: [], backlinks: [], excludeFromGraph: false },
        { path: "C.md", title: "C", tags: [], outbound: [], backlinks: [], excludeFromGraph: false, publicSlug: "" },
        { path: "D.md", title: "D", tags: [], outbound: [], backlinks: [], excludeFromGraph: false, publicSlug: "d" },
      ])),
    });
    const r = await port.listShares();
    expect(r).toHaveLength(2);
    expect(r.map((x) => x.path).sort()).toEqual(["A.md", "D.md"]);
  });

  it("returns [] on an empty snapshot", async () => {
    const port = makeShareSnapshotPort({ getSnapshot: vi.fn(async () => snap([])) });
    expect(await port.listShares()).toEqual([]);
  });

  it("forwards title from the snapshot", async () => {
    const port = makeShareSnapshotPort({
      getSnapshot: vi.fn(async () => snap([
        { path: "X.md", title: "My Title", tags: [], outbound: [], backlinks: [], excludeFromGraph: false, publicSlug: "x" },
      ])),
    });
    const r = await port.listShares();
    expect(r[0]?.title).toBe("My Title");
  });
});
