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

describe("buildLinkIndex — case-insensitive (weak linking)", () => {
  it("counts a lowercase link as a backlink to the canonical-cased note", () => {
    const idx = buildLinkIndex([note("A.md", ["hq"]), note("HQ.md")]);
    expect(idx.get("HQ.md")?.backlinks).toEqual(["A.md"]);
  });

  it("counts an uppercase link as a backlink to a lowercase note", () => {
    const idx = buildLinkIndex([note("A.md", ["FOO"]), note("foo.md")]);
    expect(idx.get("foo.md")?.backlinks).toEqual(["A.md"]);
  });

  it("prefers an EXACT-case match over a case-insensitive one", () => {
    // Both HQ.md and hq.md exist; [[HQ]] must resolve to the exact HQ.md.
    const idx = buildLinkIndex([note("Ref.md", ["HQ"]), note("HQ.md"), note("sub/hq.md")]);
    expect(idx.get("HQ.md")?.backlinks).toEqual(["Ref.md"]);
    expect(idx.get("sub/hq.md")?.backlinks).toEqual([]);
  });

  it("case-insensitive collisions resolve deterministically (shallowest wins)", () => {
    // Two case-variant notes, neither an exact match for the lowercase link.
    const idx = buildLinkIndex([note("Ref.md", ["daily"]), note("Deep/Dir/Daily.md"), note("DAILY.md")]);
    // DAILY.md (depth 1) beats Deep/Dir/Daily.md (depth 3).
    expect(idx.get("DAILY.md")?.backlinks).toEqual(["Ref.md"]);
  });
});
