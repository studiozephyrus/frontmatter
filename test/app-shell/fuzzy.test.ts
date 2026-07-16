/**
 * fuzzy.test.ts — unit tests for the fuzzyFilter utility.
 */

import { describe, it, expect } from "vitest";
import { fuzzyFilter } from "@/modules/app-shell/presentation/fuzzy";

interface Item {
  n: string;
}

const items: Item[] = [
  { n: "Home" },
  { n: "HQ PRD" },
  { n: "Stock Top 10" },
];

describe("fuzzyFilter", () => {
  it("returns 'HQ PRD' first when query is 'hq'", () => {
    const results = fuzzyFilter(items, "hq", (x) => x.n);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]?.n).toBe("HQ PRD");
  });

  it("excludes non-matching items", () => {
    const results = fuzzyFilter(items, "hq", (x) => x.n);
    const names = results.map((r) => r.n);
    // 'Stock Top 10' has no h or q in sequence matching hq
    expect(names).not.toContain("Stock Top 10");
  });

  it("empty query returns all items unchanged", () => {
    const results = fuzzyFilter(items, "", (x) => x.n);
    expect(results).toEqual(items);
  });

  it("query with no matches returns empty array", () => {
    const results = fuzzyFilter(items, "zzz", (x) => x.n);
    expect(results).toHaveLength(0);
  });

  it("is case-insensitive", () => {
    const results = fuzzyFilter(items, "HQ", (x) => x.n);
    expect(results[0]?.n).toBe("HQ PRD");
  });

  it("subsequence match works (non-contiguous)", () => {
    // 'Home' contains h and e but not contiguously with h at 0
    const r = fuzzyFilter(items, "he", (x) => x.n);
    expect(r.map((x) => x.n)).toContain("Home");
  });

  it("whitespace-only query returns all items", () => {
    const results = fuzzyFilter(items, "   ", (x) => x.n);
    expect(results).toEqual(items);
  });
});
