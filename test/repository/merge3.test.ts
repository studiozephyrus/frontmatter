import { describe, it, expect } from "vitest";
import {
  merge3,
  CONFLICT_LOCAL,
  CONFLICT_SEP,
  CONFLICT_REMOTE,
} from "@/modules/repository/domain/merge3";

describe("merge3 — clean cases", () => {
  it("identical local and remote → clean (either)", () => {
    const r = merge3("a\nb\nc", "a\nX\nc", "a\nX\nc");
    expect(r).toEqual({ clean: true, text: "a\nX\nc" });
  });

  it("only local changed → take local", () => {
    const r = merge3("a\nb\nc", "a\nLOCAL\nc", "a\nb\nc");
    expect(r).toEqual({ clean: true, text: "a\nLOCAL\nc" });
  });

  it("only remote changed → take remote", () => {
    const r = merge3("a\nb\nc", "a\nb\nc", "a\nREMOTE\nc");
    expect(r).toEqual({ clean: true, text: "a\nREMOTE\nc" });
  });

  it("non-overlapping edits on different lines → auto-merge both", () => {
    const base = "one\ntwo\nthree\nfour\nfive";
    const local = "ONE\ntwo\nthree\nfour\nfive"; // changed line 1
    const remote = "one\ntwo\nthree\nfour\nFIVE"; // changed line 5
    const r = merge3(base, local, remote);
    expect(r.clean).toBe(true);
    expect(r.text).toBe("ONE\ntwo\nthree\nfour\nFIVE");
  });

  it("local inserts at top, remote inserts at bottom → merge both", () => {
    const base = "body";
    const local = "TOP\nbody";
    const remote = "body\nBOTTOM";
    const r = merge3(base, local, remote);
    expect(r.clean).toBe(true);
    expect(r.text).toBe("TOP\nbody\nBOTTOM");
  });

  it("local deletes a line, remote edits a different line → merge", () => {
    const base = "a\nb\nc\nd";
    const local = "a\nc\nd"; // deleted b
    const remote = "a\nb\nc\nD"; // changed d
    const r = merge3(base, local, remote);
    expect(r.clean).toBe(true);
    expect(r.text).toBe("a\nc\nD");
  });

  it("both insert identical content at the same point → one copy, clean", () => {
    const base = "x\ny";
    const local = "x\nNEW\ny";
    const remote = "x\nNEW\ny";
    const r = merge3(base, local, remote);
    expect(r).toEqual({ clean: true, text: "x\nNEW\ny" });
  });

  it("realistic note: local edits intro, remote edits conclusion → merge", () => {
    const base = "# Title\n\nIntro line.\n\nMiddle.\n\nConclusion line.";
    const local = "# Title\n\nIntro line EDITED.\n\nMiddle.\n\nConclusion line.";
    const remote = "# Title\n\nIntro line.\n\nMiddle.\n\nConclusion line EDITED.";
    const r = merge3(base, local, remote);
    expect(r.clean).toBe(true);
    expect(r.text).toBe(
      "# Title\n\nIntro line EDITED.\n\nMiddle.\n\nConclusion line EDITED.",
    );
  });
});

describe("merge3 — conflicts", () => {
  it("both change the same line differently → conflict with markers", () => {
    const r = merge3("a\nb\nc", "a\nLOCAL\nc", "a\nREMOTE\nc");
    expect(r.clean).toBe(false);
    if (r.clean) throw new Error("expected conflict");
    expect(r.conflicts).toBe(1);
    expect(r.text).toContain(CONFLICT_LOCAL);
    expect(r.text).toContain(CONFLICT_SEP);
    expect(r.text).toContain(CONFLICT_REMOTE);
    expect(r.text).toContain("LOCAL");
    expect(r.text).toContain("REMOTE");
    // Stable surrounding lines are preserved outside the conflict.
    expect(r.text.startsWith("a\n")).toBe(true);
    expect(r.text.endsWith("\nc")).toBe(true);
  });

  it("local deletes a line that remote edits → conflict", () => {
    const r = merge3("a\nb\nc", "a\nc", "a\nB-EDIT\nc");
    expect(r.clean).toBe(false);
    if (r.clean) throw new Error("expected conflict");
    expect(r.conflicts).toBe(1);
  });

  it("both insert different content at the same point → conflict", () => {
    const r = merge3("x\ny", "x\nFROM-LOCAL\ny", "x\nFROM-REMOTE\ny");
    expect(r.clean).toBe(false);
    if (r.clean) throw new Error("expected conflict");
    expect(r.text).toContain("FROM-LOCAL");
    expect(r.text).toContain("FROM-REMOTE");
  });

  it("merges one region and conflicts another in the same note", () => {
    const base = "h1\nh2\nh3\nh4\nh5";
    const local = "H1\nh2\nh3\nh4\nLOCAL5"; // line1 + line5
    const remote = "h1\nh2\nh3\nh4\nREMOTE5"; // line5 only (conflicts line5)
    const r = merge3(base, local, remote);
    expect(r.clean).toBe(false);
    if (r.clean) throw new Error("expected conflict");
    // line 1 merged cleanly (only local changed it)
    expect(r.text.startsWith("H1\n")).toBe(true);
    // line 5 is the conflict
    expect(r.text).toContain("LOCAL5");
    expect(r.text).toContain("REMOTE5");
    expect(r.conflicts).toBe(1);
  });
});

describe("merge3 — round-trip safety", () => {
  it("a clean merge of two disjoint single-line edits equals applying both", () => {
    const base = "1\n2\n3\n4\n5\n6\n7\n8";
    const local = "1\n2\nTHREE\n4\n5\n6\n7\n8";
    const remote = "1\n2\n3\n4\n5\nSIX\n7\n8";
    const r = merge3(base, local, remote);
    expect(r).toEqual({ clean: true, text: "1\n2\nTHREE\n4\n5\nSIX\n7\n8" });
  });

  it("preserves trailing newline structure", () => {
    const base = "a\nb\n";
    const local = "a\nb\n"; // unchanged
    const remote = "a\nB\n";
    const r = merge3(base, local, remote);
    expect(r).toEqual({ clean: true, text: "a\nB\n" });
  });
});
