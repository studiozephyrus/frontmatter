// @vitest-environment jsdom

/**
 * Regression tests for the HTML policy that runs after rehype-raw. Before
 * the fix landed, event handlers (`onerror`, `onload`, etc.) and dangerous
 * URL schemes (`javascript:`, `data:text/html`) on otherwise-allowed elements
 * passed through verbatim, giving any author of a publicly-shared note an
 * XSS primitive.
 */

import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Markdown } from "@/modules/preview";

describe("HTML policy attribute sanitization", () => {
  it("strips inline event handlers from allowed elements", () => {
    const { container } = render(
      <Markdown content={'<img src="x" onerror="alert(1)" alt="x">'} />,
    );
    const img = container.querySelector("img");
    expect(img).not.toBeNull();
    expect(img?.getAttribute("onerror")).toBeNull();
    // Surface attrs that aren't event handlers stay intact.
    expect(img?.getAttribute("alt")).toBe("x");
  });

  it("drops javascript: URLs in anchor href", () => {
    const { container } = render(
      <Markdown content={'<a href="javascript:alert(1)">click</a>'} />,
    );
    const a = container.querySelector("a");
    expect(a).not.toBeNull();
    // After sanitization the href is either absent or empty — never the
    // attacker-controlled `javascript:` URL.
    const href = a?.getAttribute("href") ?? "";
    expect(href.startsWith("javascript:")).toBe(false);
  });

  it("keeps https: anchor href intact", () => {
    const { container } = render(
      <Markdown content={'<a href="https://example.com">click</a>'} />,
    );
    const a = container.querySelector("a");
    expect(a?.getAttribute("href")).toBe("https://example.com");
  });

  it("drops onclick on details (the open/close shadow vector)", () => {
    const { container } = render(
      <Markdown content={'<details onclick="alert(1)"><summary>x</summary>y</details>'} />,
    );
    const det = container.querySelector("details");
    expect(det).not.toBeNull();
    expect(det?.getAttribute("onclick")).toBeNull();
  });

  it("drops data:text/html (HTML-smuggling URL) on an anchor", () => {
    const { container } = render(
      <Markdown content={'<a href="data:text/html,<script>alert(1)</script>">x</a>'} />,
    );
    const href = container.querySelector("a")?.getAttribute("href") ?? "";
    expect(href.startsWith("data:text/html")).toBe(false);
  });
});
