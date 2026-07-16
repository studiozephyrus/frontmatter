/**
 * wikilink.test.ts — unit tests for resolveWikilink and stripWikilinkDecorations.
 * Pure logic; no DOM needed.
 */

import { describe, it, expect } from "vitest";
import {
  resolveWikilink,
  stripWikilinkDecorations,
} from "@/modules/preview/presentation/wikilink";

// ---------------------------------------------------------------------------
// Sample map: basename → full path
// ---------------------------------------------------------------------------

const MAP = new Map<string, string>([
  ["HQ", "Projects/HQ/HQ.md"],
  ["Paper", "Research/Paper.md"],
  ["Home", "Home.md"],
]);

// ---------------------------------------------------------------------------
// stripWikilinkDecorations
// ---------------------------------------------------------------------------

describe("stripWikilinkDecorations", () => {
  it("returns a plain target unchanged", () => {
    expect(stripWikilinkDecorations("HQ")).toBe("HQ");
  });

  it("strips a heading fragment", () => {
    expect(stripWikilinkDecorations("HQ#section")).toBe("HQ");
  });

  it("strips an alias", () => {
    expect(stripWikilinkDecorations("HQ|my alias")).toBe("HQ");
  });

  it("strips both heading and alias", () => {
    expect(stripWikilinkDecorations("HQ#section|alias")).toBe("HQ");
  });

  it("trims surrounding whitespace", () => {
    expect(stripWikilinkDecorations(" HQ ")).toBe("HQ");
  });
});

// ---------------------------------------------------------------------------
// resolveWikilink
// ---------------------------------------------------------------------------

describe("resolveWikilink", () => {
  it("resolves a plain basename", () => {
    expect(resolveWikilink("HQ", MAP)).toBe("Projects/HQ/HQ.md");
  });

  it("resolves [[HQ|alias]] (alias stripped before lookup)", () => {
    expect(resolveWikilink("HQ|alias", MAP)).toBe("Projects/HQ/HQ.md");
  });

  it("resolves [[HQ#sec]] (fragment stripped before lookup)", () => {
    expect(resolveWikilink("HQ#sec", MAP)).toBe("Projects/HQ/HQ.md");
  });

  it("resolves [[HQ#sec|alias]] (both stripped)", () => {
    expect(resolveWikilink("HQ#sec|alias", MAP)).toBe("Projects/HQ/HQ.md");
  });

  it("returns null for unknown targets", () => {
    expect(resolveWikilink("Nonexistent", MAP)).toBeNull();
  });

  it("returns null for empty string", () => {
    expect(resolveWikilink("", MAP)).toBeNull();
  });

  it("resolves when target includes the last segment path component", () => {
    // "Projects/HQ/HQ" → basename is "HQ" → still resolves
    expect(resolveWikilink("Projects/HQ/HQ", MAP)).toBe("Projects/HQ/HQ.md");
  });

  it("resolves Home.md root note", () => {
    expect(resolveWikilink("Home", MAP)).toBe("Home.md");
  });
});
