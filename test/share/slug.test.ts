/**
 * slug.test.ts — domain unit tests for public-share slug validation.
 *
 * Coverage:
 *  - validateSlug accepts good shapes
 *  - validateSlug rejects: empty, too long, bad chars, leading/trailing/double hyphens
 *  - reserved slugs rejected
 *  - suggestSlug produces a valid slug from arbitrary titles
 *  - errors are typed (InvalidSlugError, SlugConflictError)
 */
import { describe, it, expect } from "vitest";
import {
  validateSlug,
  suggestSlug,
  publicHref,
  InvalidSlugError,
  SlugConflictError,
  RESERVED_SLUGS,
  SLUG_MAX_LEN,
} from "@/modules/share/domain/slug";

describe("publicHref", () => {
  it("builds a root-level path (no /p/ prefix)", () => {
    expect(publicHref("my-note")).toBe("/my-note");
  });
  it("does not double-slash", () => {
    expect(publicHref("x")).toBe("/x");
    expect(publicHref("x").startsWith("//")).toBe(false);
  });
  it("reserved words are NOT used as slugs but publicHref is purely mechanical", () => {
    // publicHref doesn't validate — validation is validateSlug's job.
    expect(publicHref("anything")).toBe("/anything");
  });
});

describe("validateSlug — accepts", () => {
  it.each([
    "x",
    "abc",
    "a1",
    "hello-world",
    "my-public-note",
    "v1-launch-2026",
    "a".repeat(SLUG_MAX_LEN),
  ])("accepts %s", (s) => {
    expect(validateSlug(s)).toBe(s);
  });

  it("trims surrounding whitespace before validating", () => {
    expect(validateSlug("  hello  ")).toBe("hello");
  });
});

describe("validateSlug — rejects", () => {
  it("rejects empty string", () => {
    expect(() => validateSlug("")).toThrow(InvalidSlugError);
  });
  it("rejects whitespace-only", () => {
    expect(() => validateSlug("   ")).toThrow(InvalidSlugError);
  });
  it("rejects > SLUG_MAX_LEN", () => {
    expect(() => validateSlug("a".repeat(SLUG_MAX_LEN + 1))).toThrow(/max/);
  });
  it.each([
    "Hello",          // uppercase
    "hello world",    // space
    "hello_world",    // underscore
    "hello.world",    // dot
    "héllo",          // accent
    "hello/",         // slash
    "/hello",
    "-hello",         // leading hyphen
    "hello-",         // trailing hyphen
    "he--llo",        // double hyphen
    "🙂",             // emoji
  ])("rejects %s", (s) => {
    expect(() => validateSlug(s)).toThrow(InvalidSlugError);
  });
});

describe("RESERVED_SLUGS", () => {
  // Format check runs first; if a reserved word happens to also fail format
  // (e.g. `_next`), it's still rejected — just with the format message.
  // The contract is "rejected", not "rejected with the reserved message".
  it.each([...RESERVED_SLUGS])("rejects reserved slug %s", (slug) => {
    expect(() => validateSlug(slug)).toThrow(InvalidSlugError);
  });
});

describe("suggestSlug", () => {
  it.each([
    ["Hello World", "hello-world"],
    ["My — Note", "my-note"],
    ["Multiple   Spaces", "multiple-spaces"],
    ["UPPER", "upper"],
    ["a.b/c", "a-b-c"],
    ["  trimmed  ", "trimmed"],
    ["123", "123"],
    // Empty / symbol-only / reserved → safe "note" fallback (always a valid slug).
    ["", "note"],
    ["日本語", "note"],
    ["!!!", "note"],
    ["api", "note"],
  ])("%s → %s", (input, expected) => {
    expect(suggestSlug(input)).toBe(expected);
  });
  it("never produces a trailing hyphen at the length boundary", () => {
    const title = `${"a".repeat(SLUG_MAX_LEN - 1)} word`;
    const slug = suggestSlug(title);
    expect(slug.endsWith("-")).toBe(false);
    expect(slug.length).toBeLessThanOrEqual(SLUG_MAX_LEN);
  });
  it("clamps to SLUG_MAX_LEN", () => {
    const big = "x".repeat(SLUG_MAX_LEN * 2);
    expect(suggestSlug(big).length).toBe(SLUG_MAX_LEN);
  });
});

describe("SlugConflictError", () => {
  it("preserves conflictPath", () => {
    const e = new SlugConflictError("foo", "Projects/Bar.md");
    expect(e).toBeInstanceOf(Error);
    expect(e.name).toBe("SlugConflictError");
    expect(e.conflictPath).toBe("Projects/Bar.md");
    expect(e.message).toMatch(/foo/);
    expect(e.message).toMatch(/Projects\/Bar\.md/);
  });
});
