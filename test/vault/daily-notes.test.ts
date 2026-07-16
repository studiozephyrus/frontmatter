/**
 * daily-notes.test.ts — unit tests for the pure daily note helpers.
 */

import { describe, it, expect } from "vitest";
import {
  dailyNotePath,
  dailyNoteTemplate,
} from "@/modules/vault/presentation/daily-notes";

describe("dailyNotePath", () => {
  it("returns the correct path for a known date", () => {
    // 2026-05-25 — single-digit month/day would be 05/25, already two digits here
    const d = new Date(2026, 4, 25); // month 4 = May (0-indexed)
    expect(dailyNotePath(d)).toBe("Daily/2026-05-25.md");
  });

  it("zero-pads single-digit month", () => {
    const d = new Date(2026, 0, 15); // January 15
    expect(dailyNotePath(d)).toBe("Daily/2026-01-15.md");
  });

  it("zero-pads single-digit day", () => {
    const d = new Date(2026, 11, 5); // December 5
    expect(dailyNotePath(d)).toBe("Daily/2026-12-05.md");
  });

  it("zero-pads both month and day when single-digit", () => {
    const d = new Date(2025, 2, 3); // March 3
    expect(dailyNotePath(d)).toBe("Daily/2025-03-03.md");
  });
});

describe("dailyNoteTemplate", () => {
  it("contains frontmatter with the date as title", () => {
    const tmpl = dailyNoteTemplate("2026-05-25");
    expect(tmpl).toContain("title: 2026-05-25");
    expect(tmpl).toContain("tags: [daily]");
  });

  it("contains a markdown heading with the date", () => {
    const tmpl = dailyNoteTemplate("2026-05-25");
    expect(tmpl).toContain("# 2026-05-25");
  });

  it("contains a Notes section", () => {
    const tmpl = dailyNoteTemplate("2026-05-25");
    expect(tmpl).toContain("## Notes");
  });
});
