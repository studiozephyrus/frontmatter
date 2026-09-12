/**
 * GATE: Layer 1 attributes a divergence to ONE construct, and never counts content as a construct.
 * (PLAN §3.3.5 Layer 1, §3.3.9)
 *
 * Two failure modes this file exists to catch:
 *
 *  1. A minimal pair that its own detector cannot find. Then the pair and the detector disagree
 *     about what the construct is, and every frequency count downstream is measuring something
 *     nobody named.
 *  2. A detector that fires inside a fenced code block or an inline code span. A `<!-- -->` there
 *     is content. Counting it inflates the histogram that PLAN §3.3.10 kill-condition 4 turns on.
 */
import { describe, it, expect } from "vitest";
import { marked } from "marked";
import {
  CONSTRUCTS,
  CONSTRUCTS_BY_ID,
  inventory,
  skipRegions,
} from "@/modules/mdmax/domain/constructs";

/** Slice a document by the BYTE range a detector returned. Proves the unit, not just the count. */
function sliceBytes(doc: string, range: readonly [number, number]): string {
  return Buffer.from(doc, "utf8").subarray(range[0], range[1]).toString("utf8");
}

function detect(id: string, doc: string): readonly (readonly [number, number])[] {
  const c = CONSTRUCTS_BY_ID.get(id);
  if (!c?.detect) throw new Error(`no detector for ${id}`);
  return c.detect(doc);
}

function texts(id: string, doc: string): string[] {
  return detect(id, doc).map((r) => sliceBytes(doc, r));
}

describe("the corpus is well formed", () => {
  it("has every construct PLAN §3.3 measured as divergent", () => {
    const required = [
      "yaml-frontmatter",
      "html-comment",
      "heading-attribute",
      "link-ref-definition",
      "link-ref-idiom",
      "angle-bracket-text",
      "lone-tilde",
      "pipe-in-prose",
      "paren-ordered-list",
      "wikilink",
      "wikilink-embed",
      "unknown-fence-lang",
      "setext-heading",
      "table",
      "strikethrough",
      "autolink",
      "math",
      "footnote",
      "task-list",
    ];
    const missing = required.filter((id) => !CONSTRUCTS_BY_ID.has(id));
    expect(missing).toEqual([]);
  });

  it("has unique ids and no empty field", () => {
    const ids = CONSTRUCTS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const c of CONSTRUCTS) {
      expect(c.label.length, c.id).toBeGreaterThan(0);
      expect(c.source.length, c.id).toBeGreaterThan(0);
      expect(c.provenance.length, c.id).toBeGreaterThan(20);
      expect(typeof c.detect, c.id).toBe("function");
    }
  });

  it("keeps every pair MINIMAL — a whole file cannot attribute a cause", () => {
    // The 300-file whole-file run reported "100% divergent" for every feature because every
    // feature co-occurred. A "minimal pair" long enough to hold two constructs is that bug again.
    for (const c of CONSTRUCTS) {
      expect(c.source.length, `${c.id} is ${c.source.length} chars`).toBeLessThan(120);
      expect(c.source.split("\n").length, c.id).toBeLessThanOrEqual(6);
    }
  });

  it("never claims a source it did not use", () => {
    // §3.3.9 says build on an existing suite's fixtures. This repo has no local copy of one, so an
    // entry either cites the SPEC that defines the syntax or says `invented`. A provenance naming a
    // suite would be a claim nothing in this repo can back.
    for (const c of CONSTRUCTS) {
      const honest = /invented|CommonMark|GFM|GitHub Flavored|PLAN §|differential/.test(c.provenance);
      expect(honest, `${c.id}: ${c.provenance}`).toBe(true);
      expect(/karlcow|MARKDOWN_FLAVORS|markdown-testsuite/.test(c.provenance), c.id).toBe(false);
    }
  });

  it("finds its own minimal pair — the pair and the detector agree", () => {
    for (const c of CONSTRUCTS) {
      const found = c.detect?.(c.source) ?? [];
      expect(found.length, `${c.id} detector found nothing in its own source`).toBeGreaterThan(0);
    }
  });

  it("returns sorted, non-overlapping, in-bounds ranges for every pair", () => {
    for (const c of CONSTRUCTS) {
      const bytes = Buffer.byteLength(c.source, "utf8");
      let prevEnd = -1;
      for (const [s, e] of c.detect?.(c.source) ?? []) {
        expect(Number.isInteger(s) && Number.isInteger(e), c.id).toBe(true);
        expect(s, c.id).toBeGreaterThanOrEqual(prevEnd);
        expect(e, c.id).toBeGreaterThan(s);
        expect(e, c.id).toBeLessThanOrEqual(bytes);
        prevEnd = e;
      }
    }
  });
});

describe("ranges are BYTES, not UTF-16 code units", () => {
  // Only 67 of 1,080 corpus files have bytes == UTF-16 units. A detector that returns the wrong
  // unit is right on 6.2% of the corpus and silently wrong on the rest.
  const doc = "日本語 emoji 🙂 then Array<string> here.\n";

  it("slices back to the exact construct text", () => {
    const found = detect("angle-bracket-text", doc);
    expect(found.length).toBe(1);
    expect(sliceBytes(doc, found[0]!)).toBe("<string>");
  });

  it("disagrees with the UTF-16 offset, which is the point", () => {
    const found = detect("angle-bracket-text", doc)[0]!;
    expect(found[0]).not.toBe(doc.indexOf("<string>"));
    expect(found[0]).toBe(Buffer.byteLength(doc.slice(0, doc.indexOf("<string>")), "utf8"));
  });
});

describe("the skip mask — content is not a construct", () => {
  const fenced = ["Before.", "", "```", "<!-- not a comment here -->", "```", "", "After."].join("\n");

  it("does not see an HTML comment inside a fenced code block", () => {
    expect(detect("html-comment", fenced)).toEqual([]);
  });

  it("sees the same bytes outside the fence", () => {
    const plain = "Before.\n\n<!-- not a comment here -->\n\nAfter.\n";
    expect(texts("html-comment", plain)).toEqual(["<!-- not a comment here -->"]);
  });

  it("does not see a construct inside an inline code span", () => {
    const doc = "Use `Array<string>` and `a | b` and `~x` in prose.\n";
    expect(detect("angle-bracket-text", doc)).toEqual([]);
    expect(detect("pipe-in-prose", doc)).toEqual([]);
    expect(detect("lone-tilde", doc)).toEqual([]);
  });

  it("closes a code span only on a backtick run of the SAME length", () => {
    // ``a ` b`` is one span; a naive scanner closes at the single backtick and unmasks the tail.
    const doc = "``a ` b`` then Array<string>.\n";
    expect(texts("angle-bracket-text", doc)).toEqual(["<string>"]);
  });

  it("masks an unclosed fence to the end of the document", () => {
    const doc = "Text.\n\n```\n<!-- swallowed -->\n";
    expect(detect("html-comment", doc)).toEqual([]);
  });

  it("does not let a ``` inside a ~~~ fence close it", () => {
    const doc = "~~~\n```\n<!-- still content -->\n```\n~~~\n\n<!-- real -->\n";
    expect(texts("html-comment", doc)).toEqual(["<!-- real -->"]);
  });

  it("reports the mask itself in bytes", () => {
    const doc = "日 `code` end\n";
    const [span] = skipRegions(doc);
    expect(span).toBeDefined();
    expect(sliceBytes(doc, span!)).toBe("`code`");
  });
});

describe("front matter", () => {
  it("detects it only at offset 0", () => {
    const doc = "---\ntitle: Note\n---\n\nBody.\n";
    expect(texts("yaml-frontmatter", doc)).toEqual(["---\ntitle: Note\n---"]);
  });

  it("is not a thematic break lower down", () => {
    const doc = "Body.\n\n---\n\nMore.\n";
    expect(detect("yaml-frontmatter", doc)).toEqual([]);
  });

  it("refuses an unterminated opener rather than swallowing the document", () => {
    expect(detect("yaml-frontmatter", "---\ntitle: Note\n\nBody.\n")).toEqual([]);
  });

  it("keeps other detectors out of the front matter block", () => {
    // `tags: a | b` inside front matter is YAML, not a pipe in prose. Attributing it to
    // pipe-in-prose double-counts one divergence as two.
    const doc = "---\ntags: a | b\nalias: [[Note]]\n---\n\nBody.\n";
    expect(detect("pipe-in-prose", doc)).toEqual([]);
    expect(detect("wikilink", doc)).toEqual([]);
    expect(detect("yaml-frontmatter", doc).length).toBe(1);
  });

  it("does not mistake the closing --- for a setext heading", () => {
    const doc = "---\ntitle: Note\n---\n\nBody.\n";
    expect(detect("setext-heading", doc)).toEqual([]);
  });
});

describe("constructs that look alike are kept apart", () => {
  it("separates the [//]: # idiom from a real link reference definition", () => {
    const doc = "[//]: # (a comment)\n\n[orphan]: https://example.com \"Title\"\n";
    expect(texts("link-ref-idiom", doc)).toEqual(["[//]: # (a comment)"]);
    expect(texts("link-ref-definition", doc)).toEqual(['[orphan]: https://example.com "Title"']);
  });

  it("does not read a footnote definition as a link reference definition", () => {
    const doc = "Claim.[^1]\n\n[^1]: the source\n";
    expect(detect("link-ref-definition", doc)).toEqual([]);
    // Document order, not scan order: the reference at byte 6 precedes the definition at byte 12.
    expect(texts("footnote", doc)).toEqual(["[^1]", "[^1]:"]);
  });

  it("separates the wikilink from the transclusion — one LEAKs, one is VOID", () => {
    const doc = "See [[Note]] and ![[Note]] here.\n";
    expect(texts("wikilink", doc)).toEqual(["[[Note]]"]);
    expect(texts("wikilink-embed", doc)).toEqual(["![[Note]]"]);
  });

  it("does not read strikethrough as two lone tildes", () => {
    const doc = "This is ~~gone~~ and ~5 remain.\n";
    expect(texts("strikethrough", doc)).toEqual(["~~gone~~"]);
    expect(texts("lone-tilde", doc)).toEqual(["~"]);
  });

  it("does not read an autolink as angle-bracketed prose", () => {
    const doc = "See <https://example.com> and Array<string>.\n";
    expect(texts("autolink", doc)).toEqual(["<https://example.com>"]);
    expect(texts("angle-bracket-text", doc)).toEqual(["<string>"]);
  });

  it("leaves real HTML elements to the HTML construct, not angle-bracket prose", () => {
    // `<div>` is intentional markup. `<cat>` and `<string>` are prose a sanitiser deletes — both
    // measured examples in PLAN §3.3 have non-element tag names.
    expect(texts("angle-bracket-text", "A <div> and a <cat> walk in.\n")).toEqual(["<cat>"]);
  });

  it("counts a table's own pipes as structure, never as pipes in prose", () => {
    const doc = "| a | b |\n| - | - |\n| 1 | 2 |\n\nUse a | b here.\n";
    expect(detect("table", doc).length).toBe(1);
    expect(texts("pipe-in-prose", doc)).toEqual(["|"]);
  });

  it("separates 1) from 1.", () => {
    expect(texts("paren-ordered-list", "1) first\n2) second\n")).toEqual(["1)", "2)"]);
    expect(detect("paren-ordered-list", "1. first\n2. second\n")).toEqual([]);
  });

  it("does not read a currency amount as inline math", () => {
    expect(detect("math", "It costs $5 and then $10.\n")).toEqual([]);
    expect(texts("math", "Energy is $E = mc^2$ exactly.\n")).toEqual(["$E = mc^2$"]);
  });

  it("reads display math as one range, not two inline ones", () => {
    expect(texts("math", "$$\nE = mc^2\n$$\n")).toEqual(["$$\nE = mc^2\n$$"]);
  });
});

describe("setext headings and thematic breaks", () => {
  it("finds the underline form", () => {
    expect(texts("setext-heading", "Title\n=====\n")).toEqual(["Title\n====="]);
    expect(texts("setext-heading", "Title\n-----\n")).toEqual(["Title\n-----"]);
  });

  it("does not read a thematic break after a blank line as a heading", () => {
    expect(detect("setext-heading", "Text.\n\n---\n\nMore.\n")).toEqual([]);
  });

  it("does not read a table delimiter row as a heading underline", () => {
    expect(detect("setext-heading", "| a | b |\n| - | - |\n")).toEqual([]);
  });

  it("does not read a list item followed by dashes as a heading", () => {
    expect(detect("setext-heading", "- item\n---\n")).toEqual([]);
  });
});

describe("unknown fence languages are additive, not VOID", () => {
  it("flags mermaid and leaves ts alone", () => {
    const doc = "```mermaid\ngraph TD;\n  A-->B;\n```\n\n```ts\nconst x = 1;\n```\n";
    expect(texts("unknown-fence-lang", doc)).toEqual(["```mermaid\ngraph TD;\n  A-->B;\n```"]);
  });

  it("does not flag a fence with no info string", () => {
    expect(detect("unknown-fence-lang", "```\nplain\n```\n")).toEqual([]);
  });

  it("MEASURED: the mermaid payload survives but the transclusion payload never existed", () => {
    // This is the measurement the two provenance strings claim, run here so the claim is
    // falsifiable rather than quoted. marked 16.4.2, the pinned engine.
    const embed = marked.parse("![[Some Note]]\n");
    expect(embed).toBe("<p>![[Some Note]]</p>\n");
    // VOID: the output contains the reference, and nothing of what it pointed at.
    expect(String(embed)).not.toContain("Some Note</");

    const fence = String(marked.parse("```mermaid\ngraph TD;\n  A-->B;\n```\n"));
    expect(fence).toContain('<pre><code class="language-mermaid">');
    // Additive, not VOID: every byte of the payload is present in the output.
    expect(fence).toContain("graph TD;");
    expect(fence).toContain("A--&gt;B;");
  });
});

describe("line endings and degenerate documents", () => {
  it("handles CRLF without shifting a range onto the carriage return", () => {
    const doc = "---\r\ntitle: Note\r\n---\r\n\r\n# Title {#custom-id}\r\n";
    expect(texts("yaml-frontmatter", doc)).toEqual(["---\r\ntitle: Note\r\n---"]);
    expect(texts("heading-attribute", doc)).toEqual(["{#custom-id}"]);
  });

  it("returns nothing for an empty document and does not throw", () => {
    for (const c of CONSTRUCTS) {
      expect(c.detect?.(""), c.id).toEqual([]);
      expect(() => c.detect?.("\n\n\n")).not.toThrow();
    }
  });

  it("survives pathological input without throwing", () => {
    const hostile = ["`".repeat(500), "~".repeat(500), "[[".repeat(500), "<".repeat(500)].join("\n");
    for (const c of CONSTRUCTS) expect(() => c.detect?.(hostile), c.id).not.toThrow();
  });
});

describe("inventory — the Layer 2 join", () => {
  const doc = [
    "---",
    "title: Everything",
    "---",
    "",
    "<!-- a note -->",
    "",
    "# Heading {#anchor}",
    "",
    "See [[Note]] and ![[Embed]] and Array<string> and a | b and ~5.",
    "",
    "```mermaid",
    "graph TD;",
    "```",
    "",
    "[orphan]: https://example.com",
    "",
  ].join("\n");

  it("reports every construct present, once, with byte ranges that slice back", () => {
    const found = inventory(doc);
    for (const id of [
      "yaml-frontmatter",
      "html-comment",
      "heading-attribute",
      "wikilink",
      "wikilink-embed",
      "angle-bracket-text",
      "pipe-in-prose",
      "lone-tilde",
      "unknown-fence-lang",
      "link-ref-definition",
    ]) {
      expect(found.has(id), `missing ${id}`).toBe(true);
    }
    expect(sliceBytes(doc, found.get("wikilink-embed")![0]!)).toBe("![[Embed]]");
    expect(sliceBytes(doc, found.get("angle-bracket-text")![0]!)).toBe("<string>");
  });

  it("omits constructs with no occurrence rather than reporting an empty list", () => {
    const found = inventory(doc);
    expect(found.has("task-list")).toBe(false);
    expect(found.has("footnote")).toBe(false);
  });

  it("is stable across repeated calls — the document cache never leaks state", () => {
    const a = inventory(doc);
    const other = inventory("Just prose.\n");
    const b = inventory(doc);
    expect(other.size).toBe(0);
    expect([...b.keys()].sort()).toEqual([...a.keys()].sort());
  });
});
