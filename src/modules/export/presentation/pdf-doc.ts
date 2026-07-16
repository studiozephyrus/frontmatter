/**
 * Server-safe PDF HTML builder.
 *
 * Uses the unified/remark/rehype pipeline with processSync — no
 * react-dom/server, no "use client" imports — so Turbopack can safely
 * include this file in an App Route bundle.
 *
 * Import this file ONLY from server-side route handlers (not via
 * modules/export/index.ts which is consumed by client component trees).
 */

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import remarkMath from "remark-math";
import remarkFrontmatter from "remark-frontmatter";
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";
import { PRINT_CSS, PRINT_HEAD_FONT_LINKS } from "./print-css";

const KATEX_VERSION = "0.17.0";
const MERMAID_VERSION = "11";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const FENCE_RE = /```mermaid\s*\n([\s\S]*?)```/g;

/** Build a placeholder token that can't collide with user content. A fixed
 *  string like `PDFMERMAIDPLACEHOLDER0` is replaceable verbatim if a note
 *  happens to mention it; mixing in a high-entropy run-token makes the
 *  collision probability astronomical. */
function mermaidPlaceholderRunToken(): string {
  let token = "";
  for (let i = 0; i < 4; i++) {
    token += Math.random().toString(36).slice(2, 10);
  }
  return token;
}

/**
 * Extract mermaid fenced code blocks and replace each with a paragraph
 * containing a unique placeholder token.  Returns the blocks, the run
 * token (needed for swap-back), and the modified markdown.
 */
function extractMermaidBlocks(markdown: string): {
  markdownWithPlaceholders: string;
  mermaidBlocks: string[];
  runToken: string;
} {
  const mermaidBlocks: string[] = [];
  const runToken = mermaidPlaceholderRunToken();
  const markdownWithPlaceholders = markdown.replace(
    FENCE_RE,
    (_match, code: string) => {
      const i = mermaidBlocks.length;
      mermaidBlocks.push((code as string).trim());
      return `\nPDFMERMAIDPLACEHOLDER_${runToken}_${i}\n`;
    },
  );
  return { markdownWithPlaceholders, mermaidBlocks, runToken };
}

// ---------------------------------------------------------------------------
// Markdown → HTML pipeline (no React, no react-dom/server)
// ---------------------------------------------------------------------------

const processor = unified()
  .use(remarkParse)
  .use(remarkFrontmatter)
  .use(remarkGfm)
  .use(remarkBreaks)
  .use(remarkMath)
  .use(remarkRehype)
  .use(rehypeKatex)
  .use(rehypeStringify);

// ---------------------------------------------------------------------------
// Public: synchronous, server-safe PDF HTML builder
// ---------------------------------------------------------------------------

/**
 * Build a complete standalone HTML5 document for headless-browser PDF export.
 *
 * - SYNC — safe to call on the server (Node.js route handler).
 * - No react-dom/server, no "use client" component imports.
 * - Mermaid fences become `<pre class="mermaid">` blocks; the mermaid CDN
 *   `<script type="module">` in `<head>` lets the headless browser render
 *   diagrams before we snapshot the PDF.
 * - KaTeX is rendered at parse time by rehype-katex; the CDN CSS link is
 *   injected for correct glyph rendering in the headless browser.
 */
export function renderPdfHtmlDocument(markdown: string, title: string): string {
  // 1. Pull mermaid fences out, replace with placeholder paragraphs
  const { markdownWithPlaceholders, mermaidBlocks, runToken } =
    extractMermaidBlocks(markdown);

  // 2. Process markdown → HTML via unified pipeline (synchronous)
  let rendered = String(processor.processSync(markdownWithPlaceholders));

  // 3. Replace placeholder paragraphs with <pre class="mermaid"> blocks
  for (let i = 0; i < mermaidBlocks.length; i++) {
    const placeholder = `<p>PDFMERMAIDPLACEHOLDER_${runToken}_${i}</p>`;
    const code = mermaidBlocks[i]!;
    rendered = rendered.replace(
      placeholder,
      `<pre class="mermaid">${escapeHtml(code)}</pre>`,
    );
  }

  // 4. Assemble standalone HTML document
  const escapedTitle = escapeHtml(title);

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapedTitle}</title>
${PRINT_HEAD_FONT_LINKS}
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@${KATEX_VERSION}/dist/katex.min.css" crossorigin="anonymous">
<script type="module">
import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@${MERMAID_VERSION}/dist/mermaid.esm.min.mjs";
mermaid.initialize({ startOnLoad: true, securityLevel: "strict" });
</script>
<style>${PRINT_CSS}</style>
</head>
<body class="markdown-body">${rendered}</body>
</html>`;
}
