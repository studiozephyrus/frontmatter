import { describe, it, expect } from "vitest";
import {
  splitIntoSegments,
  reassemble,
  replaceSegment,
  type Segment,
} from "@/modules/editor/presentation/live/block-split";

const SAMPLES: Record<string, string> = {
  empty: "",
  heading: "# Title\n",
  paragraph: "Just a paragraph of text.\n",
  twoParas: "First para.\n\nSecond para.\n",
  mixed: "# Title\n\nIntro paragraph.\n\n## Section\n\n- one\n- two\n\n```js\nconst x = 1;\n```\n\n> a quote\n",
  frontmatter: "---\ntitle: Note\ntags: [a, b]\n---\n\n# Body\n\nText here.\n",
  table: "| a | b |\n| - | - |\n| 1 | 2 |\n",
  trailingBlank: "# Title\n\n\n\n",
  noTrailingNewline: "# Title\n\nBody without trailing newline",
  windowsish: "Para one.\n\nPara two.\n",
};

const blocks = (segs: Segment[]) => segs.filter((s) => s.kind === "block");

describe("splitIntoSegments / reassemble — loss-less round trip", () => {
  for (const [name, src] of Object.entries(SAMPLES)) {
    it(`round-trips '${name}' exactly`, () => {
      expect(reassemble(splitIntoSegments(src))).toBe(src);
    });
  }
});

describe("splitIntoSegments — block extraction", () => {
  it("returns no segments for empty input", () => {
    expect(splitIntoSegments("")).toEqual([]);
  });

  it("extracts each top-level construct as its own block", () => {
    const segs = splitIntoSegments(SAMPLES.mixed!);
    const b = blocks(segs);
    // heading, paragraph, heading, list, code fence, blockquote = 6 blocks
    expect(b.length).toBe(6);
    expect(b[0]!.text.startsWith("# Title")).toBe(true);
    expect(b[3]!.text.includes("- one")).toBe(true);
    expect(b[4]!.text.includes("```js")).toBe(true);
  });

  it("keeps a fenced code block as a single block (not split on blank lines inside)", () => {
    const src = "```js\nconst a = 1;\n\nconst b = 2;\n```\n";
    const b = blocks(splitIntoSegments(src));
    expect(b.length).toBe(1);
    expect(b[0]!.text).toBe("```js\nconst a = 1;\n\nconst b = 2;\n```");
  });

  it("treats YAML frontmatter as one block", () => {
    const b = blocks(splitIntoSegments(SAMPLES.frontmatter!));
    expect(b[0]!.text).toBe("---\ntitle: Note\ntags: [a, b]\n---");
  });

  it("keeps a GFM table as a single block", () => {
    const b = blocks(splitIntoSegments(SAMPLES.table!));
    expect(b.length).toBe(1);
    expect(b[0]!.text.includes("| a | b |")).toBe(true);
  });

  it("preserves gap whitespace between blocks", () => {
    const segs = splitIntoSegments(SAMPLES.twoParas!);
    const gaps = segs.filter((s) => s.kind === "gap");
    expect(gaps.some((g) => g.text.includes("\n\n"))).toBe(true);
  });
});

describe("replaceSegment", () => {
  it("swaps one block and preserves everything else byte-for-byte", () => {
    const src = SAMPLES.mixed!;
    const segs = splitIntoSegments(src);
    const firstBlockIdx = segs.findIndex((s) => s.kind === "block");
    const edited = replaceSegment(segs, firstBlockIdx, "# Renamed");
    expect(edited.startsWith("# Renamed")).toBe(true);
    // Everything after the first block is unchanged.
    expect(edited.includes("## Section")).toBe(true);
    expect(edited.includes("```js")).toBe(true);
  });

  it("returns the original document when index is a gap or out of range", () => {
    const src = SAMPLES.twoParas!;
    const segs = splitIntoSegments(src);
    const gapIdx = segs.findIndex((s) => s.kind === "gap");
    expect(replaceSegment(segs, gapIdx, "x")).toBe(src);
    expect(replaceSegment(segs, 999, "x")).toBe(src);
  });

  it("round-trips when a block is replaced with itself", () => {
    const src = SAMPLES.mixed!;
    const segs = splitIntoSegments(src);
    const idx = segs.findIndex((s) => s.kind === "block");
    expect(replaceSegment(segs, idx, segs[idx]!.text)).toBe(src);
  });
});
