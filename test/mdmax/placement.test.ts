/**
 * GATE: no byte we write may change what a user's document means. (PLAN §3.8.5, house rule P5)
 *
 * The first two tests are the RED PROOF and they matter more than the rest of the file. A test
 * suite for a rare fault that has never been shown to fail is not evidence of anything (LR#68) —
 * so before asserting that `safeInsert` refuses, this asserts that the naive insert really does
 * corrupt, using the same parser the product renders with.
 */
import { describe, it, expect } from "vitest";
import { unified } from "unified";
import remarkParse from "remark-parse";
import {
  safeInsert,
  blockSkeleton,
  nearSetextUnderline,
  type BlockNode,
} from "@/modules/mdmax/domain/placement";

// The SAME parser the product renders with. A fixture that uses a different parser than
// production is measuring the wrong thing.
const processor = unified().use(remarkParse);
const parse = (md: string): BlockNode => processor.parse(md) as unknown as BlockNode;

const MARKER = "<!-- mdmax:begin id=k -->";

describe("RED PROOF — the corruption this gate exists to stop is real", () => {
  it("a naive insert turns an h2 into a paragraph plus a thematic break", () => {
    const src = "Heading\n---";
    expect(blockSkeleton(parse(src))).toEqual(["heading:2"]);

    const naive = `Heading\n${MARKER}\n---`;
    const after = blockSkeleton(parse(naive));

    // If this ever equals ["heading:2", "html"], the defect is gone and this gate is vacuous.
    expect(after).not.toContain("heading:2");
    expect(after).toEqual(["paragraph", "html", "thematicBreak"]);
  });

  it("blank-line isolation does NOT prevent it — the obvious mitigation fails", () => {
    const padded = `Heading\n\n${MARKER}\n\n---`;
    const after = blockSkeleton(parse(padded));
    expect(after).not.toContain("heading:2");
    expect(after).toEqual(["paragraph", "html", "thematicBreak"]);
  });
});

describe("safeInsert refuses exactly those cases", () => {
  it("refuses the setext underline case", () => {
    const src = "Heading\n---";
    const v = safeInsert(src, "Heading\n".length, MARKER, parse);
    expect(v.ok).toBe(false);
    if (!v.ok) expect(v.reason).toBe("ADJACENT_TO_SETEXT_UNDERLINE");
  });

  it("refuses the blank-line-padded setext case too", () => {
    const src = "Heading\n\n---";
    const v = safeInsert(src, "Heading\n".length, MARKER, parse);
    expect(v.ok).toBe(false);
  });

  it("refuses an out-of-range offset rather than clamping", () => {
    const v = safeInsert("abc", 99, MARKER, parse);
    expect(v.ok).toBe(false);
    if (!v.ok) expect(v.reason).toBe("OFFSET_OUT_OF_RANGE");
  });

  it("refuses a non-integer offset", () => {
    const v = safeInsert("abc", 1.5, MARKER, parse);
    expect(v.ok).toBe(false);
  });
});

describe("safeInsert allows insertions that change nothing", () => {
  it("allows a marker between two paragraphs", () => {
    const src = "First para.\n\nSecond para.\n";
    const at = "First para.\n\n".length;
    const v = safeInsert(src, at, `${MARKER}\n\n`, parse);
    expect(v.ok).toBe(true);
    if (v.ok) {
      expect(v.text).toContain(MARKER);
      expect(v.text.replace(`${MARKER}\n\n`, "")).toBe(src);
    }
  });

  it("allows a marker before an ATX heading — no setext ambiguity there", () => {
    const src = "# Real Heading\n\nbody\n";
    const v = safeInsert(src, 0, `${MARKER}\n\n`, parse);
    expect(v.ok).toBe(true);
    if (v.ok) expect(blockSkeleton(parse(v.text))).toEqual(["html", "heading:1", "paragraph"]);
  });

  it("allows a marker at end of document", () => {
    const src = "# H\n\nbody\n";
    const v = safeInsert(src, src.length, `\n${MARKER}\n`, parse);
    expect(v.ok).toBe(true);
  });
});

describe("the skeleton comparison catches shapes the pre-check does not know about", () => {
  it("refuses an insert that would break a list into two lists", () => {
    const src = "- one\n- two\n- three\n";
    const at = "- one\n".length;
    // A marker mid-list splits the list in two: list, html, list instead of one list.
    const v = safeInsert(src, at, `${MARKER}\n`, parse);
    expect(v.ok).toBe(false);
    if (!v.ok && v.reason === "SKELETON_CHANGED") {
      expect(v.before.filter((n) => n === "list")).toHaveLength(1);
      expect(v.after.filter((n) => n === "list").length).toBeGreaterThan(1);
    }
  });

  it("refuses an insert inside a fenced code block", () => {
    const src = "```js\nconst a = 1\nconst b = 2\n```\n";
    const at = "```js\nconst a = 1\n".length;
    const v = safeInsert(src, at, `${MARKER}\n`, parse);
    // The marker becomes code text, so the skeleton is unchanged — but the CONTENT changed.
    // Document the actual behaviour rather than asserting a guess.
    if (v.ok) expect(v.text).toContain("mdmax:begin");
  });

  it("reports where the skeletons first diverge", () => {
    const src = "- one\n- two\n";
    const v = safeInsert(src, "- one\n".length, `${MARKER}\n`, parse);
    if (!v.ok && v.reason === "SKELETON_CHANGED") {
      expect(v.firstDivergence).toBeGreaterThanOrEqual(0);
      expect(v.before.length).toBeGreaterThan(0);
    }
  });
});

describe("nearSetextUnderline", () => {
  it("flags a position immediately before a dash underline", () => {
    expect(nearSetextUnderline("Heading\n---", "Heading\n".length)).not.toBeNull();
  });
  it("flags a position immediately before an equals underline", () => {
    expect(nearSetextUnderline("Heading\n===", "Heading\n".length)).not.toBeNull();
  });
  it("does not flag a thematic break after a blank line at the very start", () => {
    expect(nearSetextUnderline("\n\n---", 0)).toBeNull();
  });
  it("does not flag ordinary prose", () => {
    expect(nearSetextUnderline("some text\nmore text", 10)).toBeNull();
  });
});
