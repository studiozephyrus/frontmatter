import { describe, it, expect } from "vitest";
import { extractOutline } from "@/modules/preview/presentation/outline-utils";

describe("extractOutline", () => {
  it("extracts h1, h2, h3 with correct depth and text", () => {
    const md = `# Title\n\n## Section\n\n### Subsection\n\nsome text`;
    const outline = extractOutline(md);
    expect(outline).toHaveLength(3);
    const [h1, h2, h3] = outline;
    expect(h1).toEqual({ depth: 1, text: "Title", slug: "title" });
    expect(h2).toEqual({ depth: 2, text: "Section", slug: "section" });
    expect(h3).toEqual({ depth: 3, text: "Subsection", slug: "subsection" });
  });

  it("ignores a # inside a fenced code block", () => {
    const md = `# Real Heading\n\n\`\`\`\n# Not a heading\n\`\`\`\n\n## Another Real`;
    const outline = extractOutline(md);
    expect(outline).toHaveLength(2);
    const [first, second] = outline;
    expect(first?.text).toBe("Real Heading");
    expect(second?.text).toBe("Another Real");
  });

  it("produces github-slugger slugs: lowercase + spaces to dashes + strip punctuation", () => {
    const md = `# Hello World!\n## C++ Tips & Tricks\n### foo_bar baz`;
    const outline = extractOutline(md);
    const [h1, h2, h3] = outline;
    // github-slugger: "Hello World!" → "hello-world"
    expect(h1?.slug).toBe("hello-world");
    // github-slugger: "C++ Tips & Tricks" → "c-tips--tricks"
    expect(h2?.slug).toBe("c-tips--tricks");
    // github-slugger: "foo_bar baz" → "foo_bar-baz"
    expect(h3?.slug).toBe("foo_bar-baz");
  });

  it("slug for 'Session format and context' matches rehype-slug output", () => {
    const md = `## Session format and context`;
    const [entry] = extractOutline(md);
    expect(entry?.slug).toBe("session-format-and-context");
  });

  it("duplicate headings get numbered suffixes (-1, -2)", () => {
    const md = `# Intro\n## Intro\n### Intro`;
    const outline = extractOutline(md);
    expect(outline[0]?.slug).toBe("intro");
    expect(outline[1]?.slug).toBe("intro-1");
    expect(outline[2]?.slug).toBe("intro-2");
  });

  it("ignores headings inside tilde-fenced blocks", () => {
    const md = `# Before\n\n~~~\n# Inside\n~~~\n\n# After`;
    const outline = extractOutline(md);
    expect(outline).toHaveLength(2);
    const [first, second] = outline;
    expect(first?.text).toBe("Before");
    expect(second?.text).toBe("After");
  });

  it("returns empty array for content with no headings", () => {
    const md = `Just some plain text\nno headings here`;
    expect(extractOutline(md)).toHaveLength(0);
  });

  it("handles all heading depths 1-6", () => {
    const md = `# H1\n## H2\n### H3\n#### H4\n##### H5\n###### H6`;
    const outline = extractOutline(md);
    expect(outline.map((h) => h.depth)).toEqual([1, 2, 3, 4, 5, 6]);
  });
});
