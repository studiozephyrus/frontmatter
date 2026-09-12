/**
 * RED PROOF for NF-1 — a zero-indent YAML block sequence must not refuse the write.
 * Spec: specs/engine/nf-001-zero-indent-sequence.md
 *
 * THE DEFECT, located. `spliceFrontmatterValue` walks the block's top-level lines and
 * classifies each one. A line is "top level" only when it contains a colon:
 *
 *     const isTop = text !== '' && !indented && !/^#/.test(text) && /:/.test(text)
 *
 * A sequence item written at column zero — `- alpha` under `tags:` — has no colon, is
 * not indented and is not a comment, so it falls through to:
 *
 *     } else if (text !== '' && !indented && !/^#/.test(text)) {
 *       return src        // "not a plain map — refuse rather than guess"
 *     }
 *
 * That refusal is correct in spirit and wrong in fact: a dash item at column zero IS a
 * continuation of the preceding key, and it is spec-valid YAML, PyYAML's default output,
 * and idiomatic in several of the vaults in the pinned corpus.
 *
 * THE BLAST RADIUS, measured: 6,613 of 6,614 foreign refusals, 82.98% of the 7,969
 * frontmatter-bearing files in the corpus. This is the single largest availability
 * defect in the engine and it blocks wiring MDMAX seam 2 (the write gate) — at today's
 * rate that gate would reject 83% of foreign publishes.
 *
 * WHY BOTH A FIXTURE AND THE CORPUS. The fixture proves the mechanism deterministically
 * and in one line. The corpus assertion proves the SCALE, and scale is the reason this
 * defect is ranked first. Neither alone is the proof.
 *
 * HOW TO READ `it.fails`: these assert the CORRECT behaviour, so today they pass by
 * failing. When the writer is fixed they go red — that is the signal to delete the
 * marker, not a regression.
 */
import { describe, it, expect } from "vitest";
import { spliceFrontmatterValue } from "@/modules/share/domain/splice-frontmatter";

/** `tags:` followed by items at column zero. Spec-valid YAML; PyYAML emits exactly this. */
const ZERO_INDENT = "---\ntags:\n- alpha\n- beta\ntitle: Note\n---\nBody text.\n";

/** The same document with the conventional two-space indent. This one works today. */
const INDENTED = "---\ntags:\n  - alpha\n  - beta\ntitle: Note\n---\nBody text.\n";

describe("NF-1 — zero-indent block sequence", () => {
  it("the control case works, so a failure below is the indent and nothing else", () => {
    const after = spliceFrontmatterValue(INDENTED, "public_slug", "demo");
    expect(after).not.toBe(INDENTED); // the write landed
    expect(after).toContain("public_slug: demo");
    // and every byte we did not ask about is still there
    expect(after).toContain("  - alpha");
    expect(after).toContain("title: Note");
    expect(after).toContain("Body text.");
  });

  it.fails("invariant 1 — a set on a zero-indent sequence must SUCCEED", () => {
    const after = spliceFrontmatterValue(ZERO_INDENT, "public_slug", "demo");
    // Today the writer hits the bare-non-key-line branch and returns the input unchanged.
    // Returning the input IS the correct response to an ambiguous document — the whole
    // product rests on refuse-rather-than-guess — but this document is not ambiguous.
    expect(after).not.toBe(ZERO_INDENT);
  });

  it.fails("invariant 2 — the new key is written and every other byte is preserved", () => {
    const after = spliceFrontmatterValue(ZERO_INDENT, "public_slug", "demo");
    expect(after).toContain("public_slug: demo");
    expect(after).toContain("\n- alpha\n"); // the author's zero indent, untouched
    expect(after).toContain("\n- beta\n");
    expect(after).toContain("title: Note");
    expect(after).toContain("Body text.");
  });

  it.fails("invariant 3 — an EXISTING key in such a file can be updated in place", () => {
    const after = spliceFrontmatterValue(ZERO_INDENT, "title", "Renamed");
    expect(after).toContain("title: Renamed");
    expect(after).not.toContain("title: Note");
    expect(after).toContain("\n- alpha\n");
  });

  it("refusal is still correct for a document that genuinely is not a map", () => {
    // The fix must narrow the refusal, not remove it. A top-level scalar document has no
    // key to address, and guessing one would be the failure mode this engine exists to
    // not have.
    const scalarDoc = "---\njust a bare scalar\n---\nBody.\n";
    expect(spliceFrontmatterValue(scalarDoc, "public_slug", "demo")).toBe(scalarDoc);
    // A `%` directive at top level, likewise.
    const directive = "---\n%YAML 1.2\ntitle: Note\n---\nBody.\n";
    expect(spliceFrontmatterValue(directive, "public_slug", "demo")).toBe(directive);
  });

  it("documents the measured scale this defect has in the pinned corpus", () => {
    // Not a behavioural assertion — a pin on the number the spec's exit condition is
    // written against, so that if PRD §28.1 is ever edited the two cannot drift apart
    // silently. The live corpus count is asserted by scripts/corpus-foreign.mjs.
    const FRONTMATTER_BEARING_FILES = 7969; // PRD §57, resolved 2026-08-31, counted four ways
    const REFUSALS_CAUSED_BY_NF1 = 6613;
    const share = REFUSALS_CAUSED_BY_NF1 / FRONTMATTER_BEARING_FILES;
    expect(share).toBeGreaterThan(0.82);
    expect(share).toBeLessThan(0.84);
  });
});
