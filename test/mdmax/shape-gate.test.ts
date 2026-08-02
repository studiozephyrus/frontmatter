/**
 * GATE: hostile documents are refused before any grammar runs. (PLAN §3.8.4)
 *
 * Two quadratics are already shipped in this repo and measured: WIKILINK_RE at k=1.98 (36,865 ms
 * on 320 KB of `[[`), and mdast-util-from-markdown at 12,429 ms vs micromark's 1,207 ms on flat
 * bullet lists. The gate is the only thing between a pasted file and a pegged CPU.
 */
import { describe, it, expect } from "vitest";
import {
  shapeGate,
  decodeStrict,
  explainFailure,
  MAX_BYTES,
  MAX_LINES,
  MAX_LIST_MARKER_LINES,
  BUDGET_MS,
  type ShapeFailure,
} from "@/modules/mdmax/domain/shape-gate";

describe("documents that pass", () => {
  it("accepts an ordinary document and reports its shape", () => {
    const r = shapeGate("# Title\n\nbody\n- one\n- two\n");
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.lines).toBe(6);
      expect(r.bytes).toBe(Buffer.byteLength("# Title\n\nbody\n- one\n- two\n"));
      expect(r.hadBom).toBe(false);
    }
  });

  it("accepts an empty document", () => {
    const r = shapeGate("");
    expect(r.ok).toBe(true);
  });

  it("counts UTF-8 bytes, not characters", () => {
    const r = shapeGate("日本語 \u{1F600}");
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.bytes).toBe(Buffer.byteLength("日本語 \u{1F600}", "utf8"));
  });

  it("strips a BOM and says it did", () => {
    const r = shapeGate("﻿# Title\n");
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.hadBom).toBe(true);
      expect(r.text.startsWith("#")).toBe(true);
    }
  });
});

describe("documents that are refused, each by name", () => {
  it("refuses over the byte ceiling", () => {
    const r = shapeGate("a".repeat(MAX_BYTES + 1));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe("BUDGET_BYTES");
  });

  it("refuses over the line ceiling", () => {
    const r = shapeGate("\n".repeat(MAX_LINES + 10));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe("BUDGET_LINES");
  });

  it("refuses over the list-marker ceiling — the measured quadratic", () => {
    const r = shapeGate("- x\n".repeat(MAX_LIST_MARKER_LINES + 10));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe("BUDGET_BLOCKS");
  });

  it("counts every list marker style", () => {
    for (const marker of ["- ", "* ", "+ ", "1. ", "1) "]) {
      const r = shapeGate(`${marker}x\n`.repeat(MAX_LIST_MARKER_LINES + 5));
      expect(r.ok, marker).toBe(false);
    }
  });

  it("refuses invalid UTF-8 rather than repairing it", () => {
    // 0xFF is never valid in UTF-8. Repairing would substitute U+FFFD and change every
    // downstream byte offset, making them correct for a document the user does not have.
    const bytes = new Uint8Array([0x61, 0x0a, 0x62, 0xff, 0x63]);
    const r = shapeGate(bytes);
    expect(r.ok).toBe(false);
    if (!r.ok && r.reason === "INVALID_UTF8") {
      expect(r.at.line).toBe(2);
    }
  });

  it("accepts valid UTF-8 bytes", () => {
    const r = shapeGate(new TextEncoder().encode("# 日本語\n\n\u{1F600}\n"));
    expect(r.ok).toBe(true);
  });
});

describe("decodeStrict locates the first bad byte without scanning quadratically", () => {
  it("reports line and column", () => {
    const bytes = new Uint8Array([...new TextEncoder().encode("ok\nok\n"), 0xc3, 0x28]);
    const r = decodeStrict(bytes);
    expect(r.ok).toBe(false);
    if (!r.ok && r.reason === "INVALID_UTF8") expect(r.at.line).toBe(3);
  });

  it("succeeds on a large valid input", () => {
    const r = decodeStrict(new TextEncoder().encode("日".repeat(100_000)));
    expect(r.ok).toBe(true);
  });
});

describe("failures are values with human explanations, never exceptions", () => {
  it.each<[ShapeFailure["reason"], ShapeFailure]>([
    ["BUDGET_BYTES", { ok: false, reason: "BUDGET_BYTES", bytes: 9e6, limit: MAX_BYTES }],
    ["BUDGET_LINES", { ok: false, reason: "BUDGET_LINES", lines: 9e5, limit: MAX_LINES }],
    ["BUDGET_BLOCKS", { ok: false, reason: "BUDGET_BLOCKS", listMarkerLines: 9e4, limit: MAX_LIST_MARKER_LINES }],
    ["INVALID_UTF8", { ok: false, reason: "INVALID_UTF8", at: { line: 3, col: 7 } }],
    ["BUDGET_TIME", { ok: false, reason: "BUDGET_TIME", elapsedMs: 300, limit: 250 }],
    ["PARSER_THREW", { ok: false, reason: "PARSER_THREW", message: "boom" }],
    ["WORKER_DIED", { ok: false, reason: "WORKER_DIED" }],
  ])("%s explains itself in one line, with no stack trace", (_r, f) => {
    const msg = explainFailure(f);
    expect(msg.length).toBeGreaterThan(0);
    expect(msg.length).toBeLessThan(200); // LR#19: compact NL hints, not stack traces
    expect(msg).not.toContain("    at ");
  });

  it("never throws on any input", () => {
    for (const junk of ["", "\0", "﻿", "a".repeat(1000), "\n".repeat(1000)]) {
      expect(() => shapeGate(junk)).not.toThrow();
    }
  });
});

describe("the time budgets are stated, not implied", () => {
  it("names a keystroke, cold-open and batch budget", () => {
    expect(BUDGET_MS.keystroke).toBe(250);
    expect(BUDGET_MS.coldOpen).toBe(2_000);
    expect(BUDGET_MS.batch).toBe(10_000);
  });
});
