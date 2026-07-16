import { describe, it, expect } from "vitest";
import { rewriteWikilinks } from "@/modules/repository/application/file-ops";

/**
 * Regression: the old mask/restore implementation corrupted content (stray NUL
 * bytes, code spliced into the wrong place) whenever a rename changed the
 * basename length AND a code region appeared after a rewritten link.
 */
describe("rewriteWikilinks — code regions stay byte-identical", () => {
  it("does not corrupt inline code after a longer-name rewrite", () => {
    const src = "See [[Foo]] and then `inline code here` end.";
    const { content, changed } = rewriteWikilinks(src, "Foo", "FooBarBazLongerName");
    expect(changed).toBe(true);
    expect(content).toContain("`inline code here`");
    expect(content).not.toContain("\x00");
    expect(content).toBe("See [[FooBarBazLongerName]] and then `inline code here` end.");
  });

  it("handles a fenced code block after the link", () => {
    const src = "[[Foo]]\n\n```js\nconst x = [[Foo]]; // not a wikilink\n```\n";
    const { content } = rewriteWikilinks(src, "Foo", "Bar");
    // The link outside the fence is rewritten…
    expect(content.startsWith("[[Bar]]")).toBe(true);
    // …but the fenced block is preserved verbatim (its [[Foo]] is NOT touched).
    expect(content).toContain("const x = [[Foo]]; // not a wikilink");
    expect(content).not.toContain("\x00");
  });

  it("rewrites alias + heading forms but not partial names", () => {
    const src = "[[Foo|alias]] [[Foo#section]] [[Foobar]]";
    const { content } = rewriteWikilinks(src, "Foo", "Baz");
    expect(content).toBe("[[Baz|alias]] [[Baz#section]] [[Foobar]]");
  });

  it("is a no-op (changed=false) when the name is absent", () => {
    const { changed } = rewriteWikilinks("no links here", "Foo", "Bar");
    expect(changed).toBe(false);
  });
});
