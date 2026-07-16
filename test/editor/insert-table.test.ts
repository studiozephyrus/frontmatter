import { describe, expect, it } from "vitest";
import { buildTableSnippet } from "@/modules/editor/presentation/toolbar-transforms";

describe("buildTableSnippet", () => {
  it("emits a valid GFM table with the requested shape", () => {
    const { snippet } = buildTableSnippet(3, 2);
    const lines = snippet.split("\n");
    // Leading blank, header, separator, two body rows, trailing blank.
    expect(lines[0]).toBe("");
    expect(lines[1]).toBe("| Col 1 | Col 2 | Col 3 |");
    expect(lines[2]).toBe("| ----- | ----- | ----- |");
    expect(lines[3]).toBe("|   |   |   |");
    expect(lines[4]).toBe("|   |   |   |");
    expect(lines[5]).toBe("");
  });

  it("firstCellOffset lands inside the first body cell of the snippet", () => {
    const { snippet, firstCellOffset } = buildTableSnippet(3, 2);
    // The character at the offset is the single space inside the first cell;
    // the character immediately before is the leading "|".
    expect(snippet[firstCellOffset - 1]).toBe("|");
    expect(snippet[firstCellOffset]).toBe(" ");
  });

  it("scales the column count", () => {
    const { snippet } = buildTableSnippet(5, 1);
    expect(snippet).toContain("| Col 1 | Col 2 | Col 3 | Col 4 | Col 5 |");
  });
});
