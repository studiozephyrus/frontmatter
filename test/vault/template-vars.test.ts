import { describe, it, expect } from "vitest";
import { substituteTemplateVars } from "@/modules/vault/presentation/template-vars";

const now = new Date(2026, 0, 7, 9, 5, 3); // 2026-01-07 09:05:03 (local)

describe("substituteTemplateVars", () => {
  it("substitutes date/time/datetime/title", () => {
    const out = substituteTemplateVars(
      "{{date}} {{time}} {{datetime}} {{title}}",
      { now, title: "My Note" },
    );
    expect(out).toBe("2026-01-07 09:05 2026-01-07 09:05 My Note");
  });

  it("custom date format replaces tokens and preserves separators", () => {
    expect(substituteTemplateVars("{{date:YYYY/MM/DD}}", { now, title: "" })).toBe("2026/01/07");
    expect(substituteTemplateVars("{{date:YYYY-MM-DD HH:mm:ss}}", { now, title: "" })).toBe("2026-01-07 09:05:03");
    // Regression: the old sequential-replace corrupted multi-letter runs like
    // MMM→"01M". Single-pass tokenizing replaces each token exactly once.
    expect(substituteTemplateVars("{{date:MM}}", { now, title: "" })).toBe("01");
  });

  it("treats $ sequences in the title literally (no replace-pattern injection)", () => {
    expect(substituteTemplateVars("{{title}}", { now, title: "$& and $1" })).toBe("$& and $1");
  });

  it("leaves unknown tokens untouched", () => {
    expect(substituteTemplateVars("{{unknown}}", { now, title: "x" })).toBe("{{unknown}}");
  });
});
