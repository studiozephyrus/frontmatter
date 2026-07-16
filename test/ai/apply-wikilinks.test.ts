import { describe, it, expect } from "vitest";
import { applyWikilinkSuggestion } from "@/modules/ai/application/apply-wikilinks";

const s = (phrase: string, basename: string) => ({ phrase, basename });

describe("applyWikilinkSuggestion", () => {
  it("links the first occurrence with an alias when phrase != basename", () => {
    expect(applyWikilinkSuggestion("see the harness here", s("harness", "Harness Notes"))).toBe(
      "see the [[Harness Notes|harness]] here",
    );
  });

  it("collapses to [[basename]] when phrase equals basename (case-insensitive)", () => {
    expect(applyWikilinkSuggestion("about HQ today", s("HQ", "HQ"))).toBe("about [[HQ]] today");
  });

  it("preserves the original casing of the matched phrase in the alias", () => {
    expect(applyWikilinkSuggestion("the Vault is great", s("vault", "Vault System"))).toBe(
      "the [[Vault System|Vault]] is great",
    );
  });

  it("only replaces the FIRST occurrence", () => {
    expect(applyWikilinkSuggestion("foo and foo", s("foo", "Foo"))).toBe("[[Foo]] and foo");
  });

  it("skips occurrences inside a fenced code block", () => {
    const input = "```\nfoo\n```\nfoo";
    expect(applyWikilinkSuggestion(input, s("foo", "Foo"))).toBe("```\nfoo\n```\n[[Foo]]");
  });

  it("skips occurrences inside an existing wikilink", () => {
    expect(applyWikilinkSuggestion("[[foo]] then foo", s("foo", "Foo"))).toBe("[[foo]] then [[Foo]]");
  });

  it("is a no-op when the phrase is not present", () => {
    expect(applyWikilinkSuggestion("nothing here", s("absent", "Absent"))).toBe("nothing here");
  });

  it("is a no-op for an empty phrase", () => {
    expect(applyWikilinkSuggestion("anything", s("", "X"))).toBe("anything");
  });
});
