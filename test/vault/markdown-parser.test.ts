import { describe, it, expect } from "vitest";
import { parseMarkdown } from "@/modules/vault/infrastructure/markdown-parser";
import { buildLinkIndex } from "@/modules/vault/domain/link-index";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const RAW_NOTE = `---
title: Foo
tags: [alpha, beta]
up: "[[HQ]]"
related: ["[[A]]", "[[B]]"]
---

Some body text with [[Wiki]] and [[Link#heading]] and [[Target|alias]].
Also an embed ![[Embedded]] and an inline #inlinetag tag.

\`\`\`typescript
const ghost = "[[GhostFenced]]";
\`\`\`

Inline code: \`[[GhostInline]]\` should be ignored too.
`;

// ---------------------------------------------------------------------------
// parseMarkdown
// ---------------------------------------------------------------------------

describe("parseMarkdown", () => {
  const note = parseMarkdown("Projects/HQ/Foo.md", RAW_NOTE);

  it("extracts title from frontmatter", () => {
    expect(note.title).toBe("Foo");
  });

  it("extracts explicit tags from frontmatter", () => {
    expect(note.tags).toContain("alpha");
    expect(note.tags).toContain("beta");
  });

  it("extracts inline #tags from body", () => {
    expect(note.tags).toContain("inlinetag");
  });

  it("does NOT include code-block content as tags", () => {
    // no spurious tags from fenced/inline code blocks
    const nonFrontmatterTags = note.tags.filter((t) => t !== "alpha" && t !== "beta" && t !== "inlinetag");
    expect(nonFrontmatterTags).toHaveLength(0);
  });

  it("includes frontmatter wikilinks (up, related) in outbound", () => {
    expect(note.outbound).toContain("HQ");
    expect(note.outbound).toContain("A");
    expect(note.outbound).toContain("B");
  });

  it("includes body wikilinks in outbound", () => {
    expect(note.outbound).toContain("Wiki");
  });

  it("strips #heading from wikilinks", () => {
    expect(note.outbound).toContain("Link");
    expect(note.outbound).not.toContain("Link#heading");
  });

  it("strips |alias from wikilinks", () => {
    expect(note.outbound).toContain("Target");
    expect(note.outbound).not.toContain("Target|alias");
  });

  it("includes embed targets in outbound", () => {
    expect(note.outbound).toContain("Embedded");
  });

  it("does NOT include fenced-code-block ghost wikilinks in outbound", () => {
    expect(note.outbound).not.toContain("GhostFenced");
  });

  it("does NOT include inline-code ghost wikilinks in outbound", () => {
    expect(note.outbound).not.toContain("GhostInline");
  });

  it("sets path correctly", () => {
    expect(note.path).toBe("Projects/HQ/Foo.md");
  });

  it("sets excludeFromGraph false for non-archive notes", () => {
    expect(note.excludeFromGraph).toBe(false);
  });
});

describe("parseMarkdown — title fallback", () => {
  it("falls back to basename when no frontmatter title", () => {
    const note = parseMarkdown("Projects/MyNote.md", "# heading\n\nsome body");
    expect(note.title).toBe("MyNote");
  });
});

describe("parseMarkdown — archive exclusion", () => {
  it("sets excludeFromGraph true when path starts with _Archive/", () => {
    const note = parseMarkdown("_Archive/OldNote.md", "---\ntitle: Old\n---\n");
    expect(note.excludeFromGraph).toBe(true);
  });

  it("sets excludeFromGraph false when _Archive appears in a non-prefix position", () => {
    const note = parseMarkdown("Projects/_Archive/Sub.md", "# Sub");
    // Only top-level _Archive/ should be excluded per spec
    expect(note.excludeFromGraph).toBe(false);
  });
});

describe("parseMarkdown — malformed frontmatter resilience", () => {
  it("does not throw on invalid YAML frontmatter; degrades to body-only", () => {
    // `**up:` is invalid YAML (js-yaml reads `*up` as an alias) — gray-matter throws.
    // One bad note must never crash the whole vault snapshot.
    const raw = `---\ntitle: X\ntags:\n  - a\n**up: "[[Y]]"\n**---\n\n# Heading\n\nSee [[Z]].`;
    expect(() => parseMarkdown("Courses/Bad.md", raw)).not.toThrow();
    const note = parseMarkdown("Courses/Bad.md", raw);
    expect(note.path).toBe("Courses/Bad.md");
    expect(note.title).toBe("Bad"); // basename fallback (frontmatter unparsed)
    expect(note.outbound).toContain("Z"); // body links still indexed
  });
});

// ---------------------------------------------------------------------------
// buildLinkIndex
// ---------------------------------------------------------------------------

describe("buildLinkIndex", () => {
  it("produces backlinks: note A links to B => B.backlinks contains A's path", () => {
    const a = parseMarkdown("A.md", "# A\n\n[[B]]");
    const b = parseMarkdown("B.md", "# B\n\nSome content.");
    const index = buildLinkIndex([a, b]);

    const bEntry = index.get("B.md");
    expect(bEntry).toBeDefined();
    expect(bEntry?.backlinks).toContain("A.md");
  });

  it("outbound list is preserved in the index", () => {
    const a = parseMarkdown("A.md", "# A\n\n[[B]] and [[C]]");
    const b = parseMarkdown("B.md", "# B");
    const c = parseMarkdown("C.md", "# C");
    const index = buildLinkIndex([a, b, c]);

    const aEntry = index.get("A.md");
    expect(aEntry?.outbound).toContain("B");
    expect(aEntry?.outbound).toContain("C");
  });

  it("marks _Archive/ notes as excludeFromGraph in index entries", () => {
    const archived = parseMarkdown("_Archive/Old.md", "# Old\n\n[[Target]]");
    const target = parseMarkdown("Target.md", "# Target");
    const index = buildLinkIndex([archived, target]);

    const archEntry = index.get("_Archive/Old.md");
    expect(archEntry?.excludeFromGraph).toBe(true);
  });

  it("handles notes with no matching targets gracefully", () => {
    const note = parseMarkdown("Lone.md", "# Lone\n\n[[NonExistent]]");
    const index = buildLinkIndex([note]);
    // no crash; the note's own entry exists
    expect(index.get("Lone.md")).toBeDefined();
  });
});
