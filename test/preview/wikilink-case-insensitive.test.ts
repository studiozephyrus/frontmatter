import { describe, it, expect } from "vitest";
import { resolveWikilink } from "@/modules/preview/presentation/wikilink";

const map = new Map<string, string>([
  ["HQ", "HQ.md"],
  ["Foo", "Projects/Foo.md"],
]);

describe("resolveWikilink — case-insensitive fallback", () => {
  it("resolves an exact-case basename", () => {
    expect(resolveWikilink("HQ", map)).toBe("HQ.md");
  });

  it("resolves a lowercase target to the canonical-cased note", () => {
    expect(resolveWikilink("hq", map)).toBe("HQ.md");
  });

  it("resolves a mixed-case target", () => {
    expect(resolveWikilink("fOo", map)).toBe("Projects/Foo.md");
  });

  it("still strips heading/alias before the case-insensitive match", () => {
    expect(resolveWikilink("hq#section|Home", map)).toBe("HQ.md");
  });

  it("returns null for a genuinely unknown target", () => {
    expect(resolveWikilink("nope", map)).toBeNull();
  });

  it("prefers an exact-case match when both exist", () => {
    const m = new Map<string, string>([
      ["HQ", "HQ.md"],
      ["hq", "other/hq.md"],
    ]);
    expect(resolveWikilink("HQ", m)).toBe("HQ.md");
    expect(resolveWikilink("hq", m)).toBe("other/hq.md");
  });
});
