// @vitest-environment node

/**
 * Regression: the previous mermaid extraction used a fixed string token
 * (`PDFMERMAIDPLACEHOLDER0`) which collided with any user content that
 * happened to contain that literal — content got swapped with the SVG.
 * After the fix, the token is per-call random, so user content with the
 * literal string can no longer be mistaken for a placeholder paragraph.
 */

import { describe, it, expect } from "vitest";
import { renderPdfHtmlDocument } from "@/modules/export/presentation/pdf-doc";

describe("PDF mermaid placeholder collision", () => {
  it("does not replace the literal PDFMERMAIDPLACEHOLDER0 in user content", () => {
    // User wrote a note that mentions the literal token (it could come from
    // a prior export of the docs themselves).
    const md = "# Title\n\nI mention `PDFMERMAIDPLACEHOLDER0` in a note.\n";
    const html = renderPdfHtmlDocument(md, "Test");
    // The literal string should remain rendered as-is (in <code>), NOT be
    // turned into a mermaid <pre>.
    expect(html).toContain("PDFMERMAIDPLACEHOLDER0");
    expect(html).not.toContain('<pre class="mermaid">PDFMERMAIDPLACEHOLDER0</pre>');
  });

  it("still substitutes real mermaid blocks", () => {
    const md = "```mermaid\nflowchart TD\n  A --> B\n```\n";
    const html = renderPdfHtmlDocument(md, "Test");
    expect(html).toMatch(/<pre class="mermaid">/);
    expect(html).toMatch(/flowchart TD/);
  });
});
