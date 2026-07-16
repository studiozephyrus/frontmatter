import { describe, it, expect } from "vitest";
import { buildLinkIndex } from "@/modules/vault/domain/link-index";
import type { ParsedNote } from "@/modules/vault/domain/note";

function note(path: string, outbound: string[] = []): ParsedNote {
  return {
    path,
    title: path.replace(/\.md$/, "").split("/").pop() ?? path,
    tags: [],
    outbound,
    embeds: [],
    frontmatter: {},
    excludeFromGraph: false,
  };
}

describe("buildLinkIndex", () => {
  it("records a single backlink", () => {
    const idx = buildLinkIndex([note("A.md", ["B"]), note("B.md")]);
    expect(idx.get("B.md")?.backlinks).toEqual(["A.md"]);
    expect(idx.get("A.md")?.backlinks).toEqual([]);
  });

  it("records multiple inbound links", () => {
    const idx = buildLinkIndex([note("A.md", ["B"]), note("C.md", ["B"]), note("B.md")]);
    expect(idx.get("B.md")?.backlinks).toEqual(["A.md", "C.md"]);
  });

  it("duplicate outbound to same target appears twice (documents current behavior)", () => {
    const idx = buildLinkIndex([note("A.md", ["B", "B"]), note("B.md")]);
    expect(idx.get("B.md")?.backlinks).toEqual(["A.md", "A.md"]);
  });

  it("self-link puts the note in its own backlinks", () => {
    const idx = buildLinkIndex([note("A.md", ["A"])]);
    expect(idx.get("A.md")?.backlinks).toEqual(["A.md"]);
  });

  it("resolves a basename target to a nested path", () => {
    const idx = buildLinkIndex([note("Top.md", ["Foo"]), note("Nested/Foo.md")]);
    expect(idx.get("Nested/Foo.md")?.backlinks).toEqual(["Top.md"]);
  });

  it("duplicate basenames resolve deterministically (shallowest path, then lexicographic)", () => {
    // Two notes share basename "Foo". The resolver MUST pick the same one
    // every run regardless of iteration order — otherwise wikilinks flip
    // targets between refreshes. Tie-break rule:
    //   shallowest path wins; if equal depth, lexicographic.
    const idx1 = buildLinkIndex([
      note("X.md", ["Foo"]),
      note("Drafts/Foo.md"),
      note("Archive/Foo.md"),
    ]);
    // Both candidates are depth=2, so lexicographic: "Archive/Foo.md" wins.
    expect(idx1.get("Archive/Foo.md")?.backlinks).toEqual(["X.md"]);
    expect(idx1.get("Drafts/Foo.md")?.backlinks).toEqual([]);

    // Reversed insertion order MUST produce the same resolution.
    const idx2 = buildLinkIndex([
      note("X.md", ["Foo"]),
      note("Archive/Foo.md"),
      note("Drafts/Foo.md"),
    ]);
    expect(idx2.get("Archive/Foo.md")?.backlinks).toEqual(["X.md"]);
    expect(idx2.get("Drafts/Foo.md")?.backlinks).toEqual([]);

    // Top-level note beats nested even when alphabetically later.
    const idx3 = buildLinkIndex([
      note("X.md", ["Foo"]),
      note("Drafts/Foo.md"),
      note("Foo.md"),
    ]);
    expect(idx3.get("Foo.md")?.backlinks).toEqual(["X.md"]);
    expect(idx3.get("Drafts/Foo.md")?.backlinks).toEqual([]);
  });

  it("unresolved target does not crash and produces no backlink", () => {
    const idx = buildLinkIndex([note("A.md", ["Ghost"])]);
    expect(idx.size).toBe(1);
    expect(idx.get("A.md")?.backlinks).toEqual([]);
  });

  it("empty input → empty index", () => {
    expect(buildLinkIndex([]).size).toBe(0);
  });
});
