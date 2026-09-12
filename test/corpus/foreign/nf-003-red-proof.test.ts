/**
 * RED PROOF for NF-3 — a bare-CR frontmatter fence must not prepend a second block.
 * Spec: specs/engine/nf-003-bare-cr-fence.md
 *
 * WHY A SYNTHETIC FIXTURE AND NOT THE CORPUS. The pinned 8,513-file corpus contains
 * ZERO bare-CR fences, zero CRLF and zero BOM — measured, and recorded in PRD §57. So
 * the corpus cannot make this defect fail no matter how many times it is replayed, and
 * a green corpus run is the EXPECTED result of running it rather than evidence of
 * correctness (LR#68). The fault has to be constructed.
 *
 * WHY THE ORACLE NEVER SAW IT. The round-trip oracle replays `set` then `delete` and
 * asserts byte-identity. Those two operations cancel here: `set` prepends a block,
 * `delete` finds its key as the block's only entry and removes the whole block. The
 * round trip is byte-identical while `set` ALONE is destructive. Every assertion below
 * is therefore on the post-`set` state only — invariant 3 of the spec.
 *
 * HOW TO READ `it.fails`. These tests assert the CORRECT behaviour and are marked
 * `.fails`, so today they pass BY FAILING — which is the proof the defect is real and
 * reproducible. When the writer is fixed they will start failing, and that failure is
 * the signal to delete the `.fails` marker. A red proof that cannot be seen to fail
 * against unfixed code does not cover the bug.
 */
import { describe, it, expect } from "vitest";
import { spliceFrontmatterValue } from "@/modules/share/domain/splice-frontmatter";

/** Count lines that are exactly a `---` fence, under ANY line-ending convention. */
const fenceLines = (s: string): number =>
  s
    .split(/\r\n|\r|\n/)
    .filter((l) => l.trim() === "---").length;

/** A classic-Mac document: every terminator is a bare CR. */
const BARE_CR = "---\rtitle: Note\rtags: [alpha]\r---\rBody text.\r";

describe("NF-3 — bare-CR frontmatter fence", () => {
  it("the fixture really is bare-CR, and really does carry one block", () => {
    // Guard the guard. If this fixture ever grows an \n the rest of the file proves nothing.
    expect(BARE_CR).not.toContain("\n");
    expect(fenceLines(BARE_CR)).toBe(2); // open + close
  });

  it.fails("invariant 2 — a set produces EXACTLY ONE frontmatter block", () => {
    const after = spliceFrontmatterValue(BARE_CR, "public_slug", "demo");
    // Today: FM_OPEN is /^---[ \t]*(\r?\n)/, which REQUIRES a line feed. A bare \r does
    // not match, `open === null`, and the no-frontmatter branch prepends a whole new
    // block — leaving four fence lines and two blocks in one document.
    expect(fenceLines(after)).toBe(2);
  });

  it.fails("invariant 4 — a bare-CR file stays bare-CR", () => {
    const after = spliceFrontmatterValue(BARE_CR, "public_slug", "demo");
    // The prepended block is emitted with `CRLF.test(src) ? '\r\n' : '\n'`. A pure-CR
    // file contains no \r\n, so the writer chooses \n and the document ends up with two
    // different line-ending conventions in it.
    expect(after).not.toContain("\n");
  });

  it.fails("the original frontmatter survives as frontmatter, not as body text", () => {
    const after = spliceFrontmatterValue(BARE_CR, "public_slug", "demo");
    // The author's own `title:` must still be inside the block. Today it is pushed below
    // the prepended block's closing fence and becomes body prose.
    const firstClose = after.indexOf("---", after.indexOf("---") + 3);
    expect(after.slice(0, firstClose)).toContain("title: Note");
  });

  it("a delete on an unrecognised block is a no-op, which is why the oracle was blind", () => {
    // This one PASSES today and is the point: it documents the cancellation that hid the
    // defect. Keep it — it is the regression guard on the oracle's own blind spot.
    const set = spliceFrontmatterValue(BARE_CR, "public_slug", "demo");
    const roundTripped = spliceFrontmatterValue(set, "public_slug", null);
    expect(roundTripped).toBe(BARE_CR); // byte-identical round trip over a destructive set
  });

  it("LF and CRLF fences are unaffected — the fix must not touch them", () => {
    const lf = "---\ntitle: Note\n---\nBody.\n";
    const crlf = "---\r\ntitle: Note\r\n---\r\nBody.\r\n";
    expect(fenceLines(spliceFrontmatterValue(lf, "public_slug", "demo"))).toBe(2);
    expect(fenceLines(spliceFrontmatterValue(crlf, "public_slug", "demo"))).toBe(2);
    // and CRLF stays CRLF
    expect(spliceFrontmatterValue(crlf, "public_slug", "demo")).toContain("\r\n");
  });
});
