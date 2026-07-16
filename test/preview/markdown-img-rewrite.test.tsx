// @vitest-environment jsdom

/**
 * Tests for the Markdown img src rewriting logic.
 *
 * Verifies:
 * 1. rewriteVaultImageSrc rewrites vault-relative paths to /api/vault/raw/<path>.
 * 2. http/https/data URIs are passed through unchanged.
 * 3. The Markdown component renders an <img> with the rewritten src for vault images.
 */
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { Markdown } from "@/modules/preview/presentation/Markdown";
import { rewriteVaultImageSrc } from "@/modules/preview/presentation/Markdown";

describe("rewriteVaultImageSrc", () => {
  it("rewrites a vault-relative path", () => {
    expect(rewriteVaultImageSrc("_attachments/foo.png")).toBe(
      "/api/vault/raw/_attachments/foo.png",
    );
  });

  it("strips leading slash before rewriting", () => {
    expect(rewriteVaultImageSrc("/_attachments/bar.jpg")).toBe(
      "/api/vault/raw/_attachments/bar.jpg",
    );
  });

  it("passes through http URLs unchanged", () => {
    expect(rewriteVaultImageSrc("http://example.com/img.png")).toBe(
      "http://example.com/img.png",
    );
  });

  it("passes through https URLs unchanged", () => {
    expect(rewriteVaultImageSrc("https://cdn.example.com/photo.jpg")).toBe(
      "https://cdn.example.com/photo.jpg",
    );
  });

  it("passes through data URIs unchanged", () => {
    const dataUri = "data:image/png;base64,abc123";
    expect(rewriteVaultImageSrc(dataUri)).toBe(dataUri);
  });
});

describe("Markdown img component override", () => {
  it("renders an <img> with rewritten src for vault-relative image", () => {
    const content = "![a photo](_attachments/x.png)";
    const { container } = render(<Markdown content={content} />);
    const img = container.querySelector("img");
    expect(img).not.toBeNull();
    expect(img?.getAttribute("src")).toBe("/api/vault/raw/_attachments/x.png");
    expect(img?.getAttribute("alt")).toBe("a photo");
  });

  it("passes http src through unchanged", () => {
    const content = "![external](https://example.com/img.png)";
    const { container } = render(<Markdown content={content} />);
    const img = container.querySelector("img");
    expect(img?.getAttribute("src")).toBe("https://example.com/img.png");
  });

  it("applies max-width:100% style", () => {
    const content = "![a](_attachments/y.jpg)";
    const { container } = render(<Markdown content={content} />);
    const img = container.querySelector("img");
    expect(img?.style.maxWidth).toBe("100%");
  });
});
