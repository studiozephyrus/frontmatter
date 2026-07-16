import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { parseCalloutHeader, CALLOUT_REGEX } from "@/modules/preview/presentation/markdown/callout";

/** Build the children react-markdown passes to a blockquote: a list of <p> elements. */
function bq(...paragraphs: string[]) {
  return paragraphs.map((text, i) => createElement("p", { key: i }, text));
}

describe("parseCalloutHeader", () => {
  it("parses type + title", () => {
    const r = parseCalloutHeader(bq("[!warning] Heads up"));
    expect(r).not.toBeNull();
    expect(r!.type).toBe("warning");
    expect(r!.title).toBe("Heads up");
  });

  it("lowercases the type", () => {
    expect(parseCalloutHeader(bq("[!NOTE] x"))!.type).toBe("note");
  });

  it("unknown type still parses (falls back, not null)", () => {
    expect(parseCalloutHeader(bq("[!whatever] x"))!.type).toBe("whatever");
  });

  it("strips the +/- fold marker from the type", () => {
    expect(parseCalloutHeader(bq("[!note]- Collapsed"))!.type).toBe("note");
    expect(parseCalloutHeader(bq("[!note]+ Open"))!.title).toBe("Open");
  });

  it("no title → empty title", () => {
    expect(parseCalloutHeader(bq("[!info]"))!.title).toBe("");
  });

  it("splits same-paragraph body after a soft break (does NOT swallow into title)", () => {
    const r = parseCalloutHeader(bq("[!tip] Heading\nbody text"));
    expect(r!.title).toBe("Heading");
    expect(r!.body).not.toBeNull();
  });

  it("collects subsequent paragraphs as body", () => {
    const r = parseCalloutHeader(bq("[!note] T", "second para"));
    expect(r!.body).not.toBeNull();
  });

  it("returns null for a plain blockquote (no [!type] header)", () => {
    expect(parseCalloutHeader(bq("just a quote"))).toBeNull();
  });

  it("returns null for a non-element first child", () => {
    expect(parseCalloutHeader(["plain string"])).toBeNull();
  });

  it("CALLOUT_REGEX matches valid + rejects malformed", () => {
    expect(CALLOUT_REGEX.test("[!note] x")).toBe(true);
    expect(CALLOUT_REGEX.test("[!multi-word_type] x")).toBe(true);
    expect(CALLOUT_REGEX.test("[!] x")).toBe(false);
    expect(CALLOUT_REGEX.test("not a callout")).toBe(false);
  });
});
