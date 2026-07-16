// @vitest-environment jsdom

import { describe, it, expect, vi } from "vitest";
import { renderNoteHtmlDocument } from "@/modules/export/presentation/export-doc";

// ---------------------------------------------------------------------------
// Mock mermaid for all tests — we only exercise its SVG output in the
// dedicated mermaid test below; other tests have no mermaid blocks.
// ---------------------------------------------------------------------------
vi.mock("mermaid", () => ({
  default: {
    initialize: vi.fn(),
    render: vi.fn(async () => ({ svg: "<svg id=\"fake-mermaid\"></svg>" })),
  },
}));

describe("renderNoteHtmlDocument", () => {
  it("produces a valid HTML5 doctype", async () => {
    const html = await renderNoteHtmlDocument("# Hi\n\n- a\n- b", "My Note");
    expect(html).toContain("<!doctype html");
  });

  it("includes the escaped title in <title>", async () => {
    const html = await renderNoteHtmlDocument("# Hi\n\n- a\n- b", "My Note");
    expect(html).toContain("<title>My Note</title>");
  });

  it("wraps content in class=markdown-body", async () => {
    const html = await renderNoteHtmlDocument("# Hi\n\n- a\n- b", "My Note");
    expect(html).toContain('class="markdown-body"');
  });

  it("renders a heading element", async () => {
    const html = await renderNoteHtmlDocument("# Hi\n\n- a\n- b", "My Note");
    expect(html).toContain("<h1");
  });

  it("renders the heading text", async () => {
    const html = await renderNoteHtmlDocument("# Hi\n\n- a\n- b", "My Note");
    expect(html).toContain("Hi");
  });

  it("renders a list", async () => {
    const html = await renderNoteHtmlDocument("# Hi\n\n- a\n- b", "My Note");
    expect(html).toContain("<ul");
  });

  it("HTML-escapes & in title", async () => {
    const html = await renderNoteHtmlDocument("x", "A & B");
    expect(html).toContain("A &amp; B");
    expect(html).not.toContain("<title>A & B</title>");
  });

  it("HTML-escapes < and > in title", async () => {
    const html = await renderNoteHtmlDocument("x", "a<b>c");
    expect(html).toContain("a&lt;b&gt;c");
  });

  it('HTML-escapes " in title', async () => {
    const html = await renderNoteHtmlDocument("x", 'say "hello"');
    expect(html).toContain("say &quot;hello&quot;");
  });

  it("includes a katex.min.css link in <head>", async () => {
    const html = await renderNoteHtmlDocument("# Hi", "Test");
    expect(html).toContain("katex.min.css");
    expect(html).toContain("cdn.jsdelivr.net/npm/katex");
  });

  it("pre-renders mermaid block to inline SVG and removes placeholder token", async () => {
    const md = "# T\n\n```mermaid\nflowchart TD\n A-->B\n```\n";
    const html = await renderNoteHtmlDocument(md, "X");
    // SVG was injected
    expect(html).toContain("mermaid-export");
    expect(html).toContain("fake-mermaid");
    // Placeholder token must NOT appear literally in the output
    expect(html).not.toContain("MERMAIDPLACEHOLDER0");
  });
});
