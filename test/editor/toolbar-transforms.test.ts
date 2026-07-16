/**
 * toolbar-transforms.test.ts
 *
 * Unit tests for the pure string transform helpers:
 *   - applyWrapSelection
 *   - applyPrefixLines
 *   - toggleTaskAtLine
 *   - toggleTaskAtOccurrence
 *
 * These helpers operate on plain strings — no DOM, no CM view required.
 */

import { describe, it, expect } from "vitest";
import {
  applyWrapSelection,
  applyPrefixLines,
  toggleTaskAtLine,
  toggleTaskAtOccurrence,
} from "@/modules/editor/presentation/toolbar-transforms";

// ---------------------------------------------------------------------------
// applyWrapSelection
// ---------------------------------------------------------------------------

describe("applyWrapSelection", () => {
  it("wraps a selection with markers", () => {
    const doc = "hello world";
    const { newDoc, from, to } = applyWrapSelection(doc, 6, 11, "**", "**");
    expect(newDoc).toBe("hello **world**");
    expect(newDoc.slice(from, to)).toBe("world");
  });

  it("inserts paired markers at collapsed cursor and places cursor between them", () => {
    const doc = "hello ";
    const { newDoc, from, to } = applyWrapSelection(doc, 6, 6, "**", "**");
    expect(newDoc).toBe("hello ****");
    expect(from).toBe(8);
    expect(to).toBe(8);
  });

  it("toggles off (strips markers) when selection is already wrapped", () => {
    const doc = "hello **world**";
    const { newDoc, from, to } = applyWrapSelection(doc, 6, 15, "**", "**");
    expect(newDoc).toBe("hello world");
    expect(newDoc.slice(from, to)).toBe("world");
  });

  it("wraps with backticks for inline code", () => {
    const doc = "use foo here";
    const { newDoc } = applyWrapSelection(doc, 4, 7, "`", "`");
    expect(newDoc).toBe("use `foo` here");
  });

  it("wraps with single asterisks for italic", () => {
    const doc = "go fast";
    const { newDoc } = applyWrapSelection(doc, 3, 7, "*", "*");
    expect(newDoc).toBe("go *fast*");
  });

  it("wraps with double-tilde for strikethrough", () => {
    const doc = "wrong answer";
    const { newDoc } = applyWrapSelection(doc, 0, 5, "~~", "~~");
    expect(newDoc).toBe("~~wrong~~ answer");
  });
});

// ---------------------------------------------------------------------------
// applyPrefixLines
// ---------------------------------------------------------------------------

describe("applyPrefixLines", () => {
  it("prefixes a single line", () => {
    const doc = "hello\nworld";
    const { newDoc } = applyPrefixLines(doc, 0, 5, "# ");
    expect(newDoc).toBe("# hello\nworld");
  });

  it("prefixes multiple selected lines", () => {
    const doc = "line one\nline two\nline three";
    // Select across first two lines
    const { newDoc } = applyPrefixLines(doc, 0, 17, "- ");
    expect(newDoc).toBe("- line one\n- line two\nline three");
  });

  it("toggles off prefix when all selected lines already prefixed", () => {
    const doc = "# heading\nnormal";
    const { newDoc } = applyPrefixLines(doc, 0, 9, "# ");
    expect(newDoc).toBe("heading\nnormal");
  });

  it("prefixes with task marker", () => {
    const doc = "buy milk";
    const { newDoc } = applyPrefixLines(doc, 0, 8, "- [ ] ");
    expect(newDoc).toBe("- [ ] buy milk");
  });

  it("prefixes with blockquote marker", () => {
    const doc = "some quote";
    const { newDoc } = applyPrefixLines(doc, 0, 10, "> ");
    expect(newDoc).toBe("> some quote");
  });
});

// ---------------------------------------------------------------------------
// toggleTaskAtLine
// ---------------------------------------------------------------------------

describe("toggleTaskAtLine", () => {
  const content = [
    "# My tasks",
    "- [ ] task one",
    "- [x] task two",
    "- [ ] task three",
    "Some paragraph",
  ].join("\n");

  it("unchecked → checked on line 2", () => {
    const result = toggleTaskAtLine(content, 2);
    expect(result).toContain("- [x] task one");
    expect(result).toContain("- [x] task two"); // line 3 unchanged
    expect(result).toContain("- [ ] task three"); // line 4 unchanged
  });

  it("checked → unchecked on line 3", () => {
    const result = toggleTaskAtLine(content, 3);
    expect(result).toContain("- [ ] task two");
    expect(result).toContain("- [ ] task one"); // line 2 unchanged
  });

  it("no-op on a non-task line", () => {
    const result = toggleTaskAtLine(content, 1); // "# My tasks"
    expect(result).toBe(content);
  });

  it("no-op on a paragraph line", () => {
    const result = toggleTaskAtLine(content, 5); // "Some paragraph"
    expect(result).toBe(content);
  });

  it("no-op on out-of-range line (0)", () => {
    const result = toggleTaskAtLine(content, 0);
    expect(result).toBe(content);
  });

  it("no-op on out-of-range line (too large)", () => {
    const result = toggleTaskAtLine(content, 100);
    expect(result).toBe(content);
  });

  it("handles uppercase X in [X]", () => {
    const doc = "- [X] task";
    const result = toggleTaskAtLine(doc, 1);
    expect(result).toBe("- [ ] task");
  });
});

// ---------------------------------------------------------------------------
// toggleTaskAtOccurrence (fallback)
// ---------------------------------------------------------------------------

describe("toggleTaskAtOccurrence", () => {
  const content = "- [ ] first\n- [x] second\n- [ ] third";

  it("toggles the 0th occurrence (first checkbox) unchecked → checked", () => {
    const result = toggleTaskAtOccurrence(content, 0);
    expect(result).toBe("- [x] first\n- [x] second\n- [ ] third");
  });

  it("toggles the 1st occurrence (second checkbox) checked → unchecked", () => {
    const result = toggleTaskAtOccurrence(content, 1);
    expect(result).toBe("- [ ] first\n- [ ] second\n- [ ] third");
  });

  it("toggles the 2nd occurrence", () => {
    const result = toggleTaskAtOccurrence(content, 2);
    expect(result).toBe("- [ ] first\n- [x] second\n- [x] third");
  });

  it("no-op when occurrence index is out of range", () => {
    const result = toggleTaskAtOccurrence(content, 10);
    expect(result).toBe(content);
  });

  it("does NOT count or toggle a - [ ] inside a fenced code block", () => {
    // The occurrence index 0 should hit the real checkbox, not the fenced one
    const doc = [
      "```",
      "- [ ] this is inside a code fence",
      "```",
      "- [ ] real task one",
      "- [ ] real task two",
    ].join("\n");

    // Index 0 must map to "real task one", skipping the fenced line
    const result = toggleTaskAtOccurrence(doc, 0);
    // Fenced checkbox must be untouched
    expect(result).toContain("- [ ] this is inside a code fence");
    // Real task one must be toggled
    expect(result).toContain("- [x] real task one");
    // Real task two must be untouched
    expect(result).toContain("- [ ] real task two");
  });

  it("does NOT count a - [ ] inside a tilde fenced block", () => {
    const doc = [
      "~~~",
      "- [ ] fenced tilde checkbox",
      "~~~",
      "- [ ] actual task",
    ].join("\n");

    const result = toggleTaskAtOccurrence(doc, 0);
    expect(result).toContain("- [ ] fenced tilde checkbox");
    expect(result).toContain("- [x] actual task");
  });
});
