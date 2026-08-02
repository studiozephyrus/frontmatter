/**
 * GATE: an offset never falls inside a character, and never silently changes unit. (PLAN §3.8.1)
 *
 * Only 67 of 1,080 corpus files have bytes == UTF-16 units == code points. 93.8% already diverge,
 * so "it worked on my file" is not evidence of anything here.
 */
import { describe, it, expect } from "vitest";
import {
  OffsetMap,
  u16,
  u16OrThrow,
  unsafeU16,
  unsafeByte,
  splitsSurrogatePair,
  utf8Length,
} from "@/modules/mdmax/domain/offsets";

const EMOJI = "\u{1F600}"; // one code point, TWO UTF-16 units, FOUR UTF-8 bytes
const FAMILY = "\u{1F468}‍\u{1F469}‍\u{1F467}"; // ZWJ sequence: one grapheme, many units

describe("the boundary policy — refuse, never round", () => {
  it("rejects an offset that splits a surrogate pair", () => {
    const text = `a${EMOJI}b`;
    expect(splitsSurrogatePair(text, 2)).toBe(true);
    const r = u16(text, 2);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.kind).toBe("INSIDE_SURROGATE_PAIR");
  });

  it("accepts the offsets on either side of the pair", () => {
    const text = `a${EMOJI}b`;
    expect(u16(text, 1).ok).toBe(true);
    expect(u16(text, 3).ok).toBe(true);
  });

  it("rejects a non-integer, a negative, and a past-end offset by name", () => {
    const t = "abc";
    expect(u16(t, 1.5).ok).toBe(false);
    expect(u16(t, -1).ok).toBe(false);
    expect(u16(t, 4).ok).toBe(false);
    const past = u16(t, 4);
    if (!past.ok) expect(past.error.kind).toBe("PAST_END");
  });

  it("accepts exactly text.length — the end is a position", () => {
    expect(u16("abc", 3).ok).toBe(true);
  });

  it("u16OrThrow throws rather than returning something wrong", () => {
    expect(() => u16OrThrow(`a${EMOJI}`, 2)).toThrow(RangeError);
  });
});

describe("utf8Length — the byte count without a Buffer", () => {
  it.each([
    ["ascii", "hello", 5],
    ["2-byte", "café", 5],
    ["3-byte", "日本語", 9],
    ["4-byte astral", EMOJI, 4],
    ["mixed", `a${EMOJI}日`, 1 + 4 + 3],
    ["empty", "", 0],
  ])("%s", (_name, input, expected) => {
    expect(utf8Length(input)).toBe(expected);
  });

  it("agrees with Buffer.byteLength across a spread of inputs", () => {
    for (const s of ["", "a", "café", "日本語", EMOJI, FAMILY, `x${EMOJI}y日z`, "🇮🇳🚀"]) {
      expect(utf8Length(s), s).toBe(Buffer.byteLength(s, "utf8"));
    }
  });
});

describe("OffsetMap — the one conversion point", () => {
  const text = `Hello ${EMOJI} 日本語 ${FAMILY} end`;
  const map = new OffsetMap(text);

  it("reports both lengths, and they differ", () => {
    expect(map.lengthU16).toBe(text.length);
    expect(map.lengthBytes).toBe(Buffer.byteLength(text, "utf8"));
    expect(map.lengthU16).not.toBe(map.lengthBytes);
  });

  it("converts U16 to byte in agreement with Buffer for every valid offset", () => {
    for (let i = 0; i <= text.length; i++) {
      if (splitsSurrogatePair(text, i)) continue;
      const expected = Buffer.byteLength(text.slice(0, i), "utf8");
      expect(map.toByte(unsafeU16(i)), `at ${i}`).toBe(expected);
    }
  });

  it("round-trips byte to U16 and back", () => {
    for (let i = 0; i <= text.length; i++) {
      if (splitsSurrogatePair(text, i)) continue;
      const b = map.toByte(unsafeU16(i));
      const back = map.toU16(b);
      expect(back.ok, `byte ${b}`).toBe(true);
      if (back.ok) expect(back.value as number).toBe(i);
    }
  });

  it("refuses a byte offset interior to a multi-byte character", () => {
    const m = new OffsetMap(EMOJI);
    for (const interior of [1, 2, 3]) {
      const r = m.toU16(unsafeByte(interior));
      expect(r.ok, `byte ${interior} should be refused`).toBe(false);
    }
    expect(m.toU16(unsafeByte(0)).ok).toBe(true);
    expect(m.toU16(unsafeByte(4)).ok).toBe(true);
  });

  it("handles a document longer than one block without drifting", () => {
    // BLOCK is 512; cross several boundaries with multi-byte content so the checkpoints matter.
    const long = `${"日".repeat(600)}${EMOJI}${"a".repeat(600)}`;
    const m = new OffsetMap(long);
    expect(m.lengthBytes).toBe(Buffer.byteLength(long, "utf8"));
    for (const i of [0, 100, 511, 512, 513, 600, 601, 602, 1000, long.length]) {
      if (splitsSurrogatePair(long, i)) continue;
      expect(m.toByte(unsafeU16(i)), `at ${i}`).toBe(Buffer.byteLength(long.slice(0, i), "utf8"));
    }
  });

  it("treats an empty document as a valid degenerate case", () => {
    const m = new OffsetMap("");
    expect(m.lengthU16).toBe(0);
    expect(m.lengthBytes).toBe(0);
    expect(m.toByte(unsafeU16(0)) as number).toBe(0);
  });
});

describe("graphemes — user-perceived characters, lazily", () => {
  it("counts a ZWJ family as ONE grapheme, not five code points", () => {
    const m = new OffsetMap(FAMILY);
    expect(FAMILY.length).toBeGreaterThan(2);
    expect(m.graphemeCount).toBe(1);
  });

  it("knows the boundaries of a mixed string", () => {
    const t = `a${EMOJI}b`;
    const m = new OffsetMap(t);
    expect(m.isGraphemeBoundary(unsafeU16(0))).toBe(true);
    expect(m.isGraphemeBoundary(unsafeU16(1))).toBe(true);
    expect(m.isGraphemeBoundary(unsafeU16(2))).toBe(false); // inside the emoji
    expect(m.isGraphemeBoundary(unsafeU16(3))).toBe(true);
    expect(m.isGraphemeBoundary(unsafeU16(4))).toBe(true);
  });

  it("maps a U16 offset to a grapheme index", () => {
    const t = `a${EMOJI}b`;
    const m = new OffsetMap(t);
    expect(m.toGrapheme(unsafeU16(0)) as number).toBe(0);
    expect(m.toGrapheme(unsafeU16(1)) as number).toBe(1);
    expect(m.toGrapheme(unsafeU16(3)) as number).toBe(2);
  });
});
