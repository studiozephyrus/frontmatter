// @vitest-environment node

import { describe, it, expect } from "vitest";
import { renderPdfHtmlDocument } from "@/modules/export/presentation/pdf-doc";

// ---------------------------------------------------------------------------
// renderPdfHtmlDocument — server-safe (sync) PDF HTML builder
// ---------------------------------------------------------------------------

describe("renderPdfHtmlDocument", () => {
  it("produces a valid HTML5 doctype", () => {
    const html = renderPdfHtmlDocument("# Hello\n\n- item", "My Note");
    expect(html).toContain("<!doctype html");
  });

  it("includes the escaped title in <title>", () => {
    const html = renderPdfHtmlDocument("# Hello", "My Note");
    expect(html).toContain("<title>My Note</title>");
  });

  it("HTML-escapes & in title", () => {
    const html = renderPdfHtmlDocument("x", "A & B");
    expect(html).toContain("A &amp; B");
    expect(html).not.toContain("<title>A & B</title>");
  });

  it("HTML-escapes < and > in title", () => {
    const html = renderPdfHtmlDocument("x", "a<b>c");
    expect(html).toContain("a&lt;b&gt;c");
  });

  it('HTML-escapes " in title', () => {
    const html = renderPdfHtmlDocument("x", 'say "hello"');
    expect(html).toContain("say &quot;hello&quot;");
  });

  it("includes a KaTeX CDN link in <head>", () => {
    const html = renderPdfHtmlDocument("# Hi", "Test");
    expect(html).toContain("katex.min.css");
    expect(html).toContain("cdn.jsdelivr.net/npm/katex");
  });

  it("includes a mermaid CDN script in <head>", () => {
    const html = renderPdfHtmlDocument("# Hi", "Test");
    expect(html).toContain("mermaid");
    expect(html).toContain("cdn.jsdelivr.net/npm/mermaid");
    expect(html).toContain('type="module"');
  });

  it("initializes mermaid with startOnLoad:true", () => {
    const html = renderPdfHtmlDocument("# Hi", "Test");
    expect(html).toContain("startOnLoad");
    expect(html).toContain("true");
  });

  it("wraps content in class=markdown-body on <body>", () => {
    const html = renderPdfHtmlDocument("# Hi", "Test");
    expect(html).toContain('class="markdown-body"');
  });

  it("emits mermaid block as <pre class=\"mermaid\"> (not inline SVG)", () => {
    const md = "# T\n\n```mermaid\nflowchart TD\n A-->B\n```\n";
    const html = renderPdfHtmlDocument(md, "Diagram Note");
    expect(html).toContain('<pre class="mermaid">');
    expect(html).toContain("flowchart TD");
    // Must NOT contain inline SVG — the browser renders it from the pre block
    expect(html).not.toContain("<svg");
  });

  it("HTML-escapes the mermaid code content inside <pre>", () => {
    const md = "```mermaid\ngraph TD\n A[\"<b>node</b>\"]-->B\n```\n";
    const html = renderPdfHtmlDocument(md, "Escape Test");
    expect(html).toContain("&lt;b&gt;node&lt;/b&gt;");
  });

  it("handles multiple mermaid blocks", () => {
    const md =
      "```mermaid\nflowchart TD\n A-->B\n```\n\nSome text\n\n```mermaid\nsequenceDiagram\n Alice->>Bob: Hi\n```\n";
    const html = renderPdfHtmlDocument(md, "Multi");
    const count = (html.match(/<pre class="mermaid">/g) ?? []).length;
    expect(count).toBe(2);
    expect(html).toContain("flowchart TD");
    expect(html).toContain("sequenceDiagram");
  });

  it("renders heading element for markdown headings", () => {
    const html = renderPdfHtmlDocument("# My Heading", "Test");
    expect(html).toContain("<h1");
    expect(html).toContain("My Heading");
  });

  it("does not contain PDFMERMAIDPLACEHOLDER tokens in output", () => {
    const md = "```mermaid\nflowchart TD\n A-->B\n```\n";
    const html = renderPdfHtmlDocument(md, "Test");
    expect(html).not.toContain("PDFMERMAIDPLACEHOLDER");
  });

  it("is synchronous (returns a string, not a Promise)", () => {
    const result = renderPdfHtmlDocument("hello", "title");
    expect(typeof result).toBe("string");
  });

  it("loads Google Sans and uses it as the body font (matches preview)", () => {
    const html = renderPdfHtmlDocument("hello", "title");
    expect(html).toContain("fonts.googleapis.com/css2?family=Google+Sans");
    expect(html).toContain('--font-sans: "Google Sans"');
    expect(html).toContain('--font-mono: "Google Sans Code"');
  });

  it("renders single newlines as <br> (parity with the live preview)", () => {
    const html = renderPdfHtmlDocument("Line one\nLine two", "title");
    expect(html).toContain("<br>");
  });
});
