import { describe, it, expect } from "vitest";
import { isPublicSlugPath, isPublicPath } from "@/proxy";

describe("isPublicSlugPath — accepts genuine public slugs", () => {
  it.each(["/my-note", "/launch-2026", "/a", "/x1", "/some-long-public-slug"])(
    "treats %s as a public slug",
    (p) => expect(isPublicSlugPath(p)).toBe(true),
  );
});

describe("isPublicSlugPath — rejects reserved + structural paths", () => {
  it.each([
    "/login", // reserved
    "/api", // reserved
    "/settings", // reserved
    "/dashboard", // reserved
    "/p", // legacy prefix reserved
    "/admin",
  ])("rejects reserved %s", (p) => expect(isPublicSlugPath(p)).toBe(false));

  it.each([
    "/", // root
    "/a/b", // two segments — not a single slug
    "/p/foo", // legacy nested
    "/Note", // uppercase not allowed in slug shape
    "/-bad", // leading hyphen
    "/bad-", // trailing hyphen
    "/dou--ble", // double hyphen
    "/has_underscore",
    "/api/auth/callback",
    "/_next/static/x.js",
  ])("rejects non-slug shape %s", (p) => expect(isPublicSlugPath(p)).toBe(false));
});

describe("isPublicPath — the proxy auth gate", () => {
  it("lets the home + login pages through", () => {
    expect(isPublicPath("/")).toBe(true);
    expect(isPublicPath("/login")).toBe(true);
  });

  it("lets public slugs + legacy /p/ links through", () => {
    expect(isPublicPath("/my-note")).toBe(true);
    expect(isPublicPath("/p/legacy-slug")).toBe(true);
  });

  it("lets auth + framework asset routes through", () => {
    expect(isPublicPath("/api/auth/callback/github")).toBe(true);
    expect(isPublicPath("/_next/static/chunks/main.js")).toBe(true);
    expect(isPublicPath("/_next/image")).toBe(true);
  });

  it("lets top-level static assets through by extension", () => {
    expect(isPublicPath("/favicon.png")).toBe(true);
    expect(isPublicPath("/sitemap.xml")).toBe(true);
    expect(isPublicPath("/theme-init.js")).toBe(true);
    expect(isPublicPath("/sgnkai.png")).toBe(true);
  });

  it("lets opengraph metadata routes through", () => {
    expect(isPublicPath("/opengraph-image")).toBe(true);
    expect(isPublicPath("/opengraph-image.png")).toBe(true);
  });

  it("does NOT treat reserved internal routes as public", () => {
    // These would otherwise look like single-segment slugs — the reserved
    // list is what keeps them auth-gated. Regression guard: if someone
    // removes a word from RESERVED_SLUGS, this fails loudly.
    expect(isPublicPath("/settings")).toBe(false);
    expect(isPublicPath("/dashboard")).toBe(false);
    expect(isPublicPath("/admin")).toBe(false);
  });

  it("does NOT treat arbitrary API routes as public (they self-gate as JSON 401)", () => {
    expect(isPublicPath("/api/commit")).toBe(false);
    expect(isPublicPath("/api/vault/snapshot")).toBe(false);
  });
});
