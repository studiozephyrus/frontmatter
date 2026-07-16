import { describe, it, expect } from "vitest";
import {
  parseFrontmatter,
  stringifyFrontmatter,
  stringifyFrontmatterDoc,
  isSimpleValue,
} from "@/modules/preview/presentation/frontmatter";

describe("frontmatter round-trip (no data loss)", () => {
  function roundTrip(content: string) {
    const parsed = parseFrontmatter(content);
    expect(parsed).not.toBeNull();
    return stringifyFrontmatter(parsed!.data, parsed!.body);
  }

  it("preserves nested maps (previously dropped → total frontmatter loss)", () => {
    const src = `---\nauthor:\n  name: Jane\n  age: 30\n---\n\nBody`;
    const parsed = parseFrontmatter(src)!;
    expect(parsed.data["author"]).toEqual({ name: "Jane", age: 30 });
    // Re-parsing the stringified output keeps the nested map intact.
    const reparsed = parseFrontmatter(roundTrip(src))!;
    expect(reparsed.data["author"]).toEqual({ name: "Jane", age: 30 });
  });

  it("keeps a quoted scalar containing a colon quoted", () => {
    const parsed = parseFrontmatter(`---\nname: "a: b"\n---\nBody`)!;
    expect(parsed.data["name"]).toBe("a: b");
    const reparsed = parseFrontmatter(stringifyFrontmatter(parsed.data, parsed.body))!;
    expect(reparsed.data["name"]).toBe("a: b");
  });

  it("round-trips an inline array with a quoted comma item", () => {
    const parsed = parseFrontmatter(`---\ntags: ["a, b", c]\n---\nBody`)!;
    expect(parsed.data["tags"]).toEqual(["a, b", "c"]);
  });

  it("preserves block scalars", () => {
    const parsed = parseFrontmatter(`---\ndesc: |\n  line1\n  line2\n---\nBody`)!;
    expect(String(parsed.data["desc"]).trim()).toBe("line1\nline2");
  });

  it("does NOT mangle numeric-looking ids (leading zero, version)", () => {
    const parsed = parseFrontmatter(`---\nphone: "007"\nzip: 90210\n---\nBody`)!;
    expect(parsed.data["phone"]).toBe("007"); // quoted string stays a string
    expect(parsed.data["zip"]).toBe(90210);
  });

  it("preserves the body verbatim (minus the leading separator)", () => {
    const parsed = parseFrontmatter(`---\na: 1\n---\n\nHello **world**\n`)!;
    expect(parsed.body).toContain("Hello **world**");
  });

  it("returns null on malformed YAML (never rewrites)", () => {
    // unbalanced bracket
    expect(parseFrontmatter(`---\ntags: [a, b\nfoo: : :\n---\nBody`)).toBeNull();
  });

  it("returns null for a non-map (scalar) block so it is never rewritten/erased", () => {
    // Regression: a scalar frontmatter block must not be editable-as-properties
    // (a prior version dropped the whole block on edit).
    expect(parseFrontmatter(`---\njust a string\n---\nBody`)).toBeNull();
  });

  it("preserves YAML comments when re-emitting via the Document", () => {
    const parsed = parseFrontmatter(`---\ntitle: Hi # greeting\ntags: [a, b]\n---\nBody`)!;
    parsed.doc.set("title", "Bye");
    const out = stringifyFrontmatterDoc(parsed.doc, parsed.body);
    expect(out).toContain("# greeting"); // comment survived the edit
    expect(out).toContain("title: Bye");
  });

  it("classifies simple vs complex values", () => {
    expect(isSimpleValue("x")).toBe(true);
    expect(isSimpleValue(42)).toBe(true);
    expect(isSimpleValue(["a", "b"])).toBe(true);
    expect(isSimpleValue({ a: 1 })).toBe(false);
    expect(isSimpleValue([{ a: 1 }])).toBe(false);
  });
});
