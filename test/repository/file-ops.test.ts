/**
 * Unit tests for file-ops pure helpers.
 *
 * Covers:
 *   - validateNotePath
 *   - basenameNoExt
 *   - rewriteWikilinks (all forms + code-block exclusion + full-match-only)
 */

import { describe, it, expect } from "vitest";
import {
  validateNotePath,
  basenameNoExt,
  rewriteWikilinks,
  InvalidPathError,
} from "@/modules/repository/application/file-ops";

// ---------------------------------------------------------------------------
// validateNotePath
// ---------------------------------------------------------------------------

describe("validateNotePath", () => {
  it("accepts a simple root-level path", () => {
    expect(() => validateNotePath("Foo.md")).not.toThrow();
  });

  it("accepts a nested path", () => {
    expect(() => validateNotePath("Projects/HQ/HQ.md")).not.toThrow();
  });

  it("throws on empty string", () => {
    expect(() => validateNotePath("")).toThrow(InvalidPathError);
  });

  it("throws on leading slash", () => {
    expect(() => validateNotePath("/Foo.md")).toThrow(InvalidPathError);
  });

  it("throws on path traversal segment", () => {
    expect(() => validateNotePath("../Foo.md")).toThrow(InvalidPathError);
    expect(() => validateNotePath("Projects/../HQ.md")).toThrow(InvalidPathError);
  });

  it("throws when path does not end with .md", () => {
    expect(() => validateNotePath("Foo.txt")).toThrow(InvalidPathError);
    expect(() => validateNotePath("Foo")).toThrow(InvalidPathError);
  });
});

// ---------------------------------------------------------------------------
// basenameNoExt
// ---------------------------------------------------------------------------

describe("basenameNoExt", () => {
  it("strips .md from a root file", () => {
    expect(basenameNoExt("Foo.md")).toBe("Foo");
  });

  it("strips .md from a nested path", () => {
    expect(basenameNoExt("Projects/HQ/HQ.md")).toBe("HQ");
  });

  it("leaves non-.md paths unchanged", () => {
    expect(basenameNoExt("Foo.txt")).toBe("Foo.txt");
  });
});

// ---------------------------------------------------------------------------
// rewriteWikilinks
// ---------------------------------------------------------------------------

describe("rewriteWikilinks", () => {
  // Basic [[A]] → [[B]]
  it("rewrites a simple [[A]] link", () => {
    const { content, changed } = rewriteWikilinks("See [[A]].", "A", "B");
    expect(content).toBe("See [[B]].");
    expect(changed).toBe(true);
  });

  // Alias [[A|alias]] → [[B|alias]]
  it("rewrites [[A|alias]] preserving the alias", () => {
    const { content, changed } = rewriteWikilinks("See [[A|the link]].", "A", "B");
    expect(content).toBe("See [[B|the link]].");
    expect(changed).toBe(true);
  });

  // Heading [[A#section]] → [[B#section]]
  it("rewrites [[A#heading]] preserving the heading", () => {
    const { content, changed } = rewriteWikilinks("Go to [[A#Introduction]].", "A", "B");
    expect(content).toBe("Go to [[B#Introduction]].");
    expect(changed).toBe(true);
  });

  // Embed ![[A]] → ![[B]]
  it("rewrites embeds ![[A]]", () => {
    const { content, changed } = rewriteWikilinks("Embed: ![[A]]", "A", "B");
    expect(content).toBe("Embed: ![[B]]");
    expect(changed).toBe(true);
  });

  // Full-target only — [[Apple]] must NOT change when renaming A → B
  it("does NOT rewrite [[Apple]] when renaming 'A'", () => {
    const { content, changed } = rewriteWikilinks("See [[Apple]].", "A", "B");
    expect(content).toBe("See [[Apple]].");
    expect(changed).toBe(false);
  });

  // Case-insensitive matching
  it("rewrites case-insensitively", () => {
    const { content, changed } = rewriteWikilinks("[[a]]", "A", "B");
    expect(content).toBe("[[B]]");
    expect(changed).toBe(true);
  });

  // No match → changed: false
  it("returns changed:false when nothing matches", () => {
    const { content, changed } = rewriteWikilinks("# No links here", "A", "B");
    expect(content).toBe("# No links here");
    expect(changed).toBe(false);
  });

  // Inside fenced code block — must NOT be changed
  it("does NOT rewrite [[A]] inside a fenced code block", () => {
    const input = "Before\n```\n[[A]]\n```\nAfter [[A]]";
    const { content, changed } = rewriteWikilinks(input, "A", "B");
    // The one inside the fence stays as [[A]], the one after changes
    expect(content).toContain("```\n[[A]]\n```");
    expect(content).toContain("After [[B]]");
    expect(changed).toBe(true);
  });

  // Inside inline code — must NOT be changed
  it("does NOT rewrite [[A]] inside inline code", () => {
    const input = "Text `[[A]]` and [[A]] here";
    const { content } = rewriteWikilinks(input, "A", "B");
    expect(content).toContain("`[[A]]`");
    expect(content).toContain("and [[B]] here");
  });

  // Multiple occurrences
  it("rewrites multiple occurrences in the same document", () => {
    const { content, changed } = rewriteWikilinks(
      "See [[A]] and also [[A|renamed]] and ![[A]]",
      "A",
      "B",
    );
    expect(content).toBe("See [[B]] and also [[B|renamed]] and ![[B]]");
    expect(changed).toBe(true);
  });

  // Frontmatter with wikilink values
  it("rewrites wikilinks in frontmatter up:/related: fields", () => {
    const input = `---\nup: "[[A]]"\nrelated: ["[[A]]"]\n---\n\n# Body`;
    const { content, changed } = rewriteWikilinks(input, "A", "B");
    expect(content).toContain('"[[B]]"');
    expect(changed).toBe(true);
  });
});
