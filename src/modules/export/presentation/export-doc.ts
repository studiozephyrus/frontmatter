import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { Markdown } from "@/modules/preview";
import { PRINT_CSS, PRINT_HEAD_FONT_LINKS } from "./print-css";

// ---------------------------------------------------------------------------
// Title escaping
// ---------------------------------------------------------------------------

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ---------------------------------------------------------------------------
// Public helpers
// ---------------------------------------------------------------------------

const KATEX_VERSION = "0.17.0";

/**
 * Render the given markdown string to a complete standalone HTML5 document
 * suitable for printing or downloading.
 *
 * Mermaid fenced code blocks are pre-rendered to inline SVG.
 * KaTeX math is rendered by rehype-katex (markup present at static-render
 * time); a KaTeX CSS link is injected into the <head> so symbols display
 * correctly in the exported file.
 */
export async function renderNoteHtmlDocument(
  markdown: string,
  title: string,
): Promise<string> {
  // -------------------------------------------------------------------------
  // 1. Extract mermaid blocks and replace with placeholder tokens. The token
  // mixes in a high-entropy run-id so a note that happens to contain the
  // literal string `MERMAIDPLACEHOLDER0` doesn't get its content swapped with
  // an SVG at step 3.
  // -------------------------------------------------------------------------
  const mermaidBlocks: string[] = [];
  const FENCE_RE = /```mermaid\s*\n([\s\S]*?)```/g;
  let runToken = "";
  for (let k = 0; k < 4; k++) runToken += Math.random().toString(36).slice(2, 10);
  const markdownWithPlaceholders = markdown.replace(FENCE_RE, (_match, code: string) => {
    const i = mermaidBlocks.length;
    mermaidBlocks.push((code as string).trim());
    return `MERMAIDPLACEHOLDER_${runToken}_${i}`;
  });

  // -------------------------------------------------------------------------
  // 2. Static-render with placeholders (math rendered by rehype-katex)
  // -------------------------------------------------------------------------
  let rendered = renderToStaticMarkup(
    createElement(Markdown, { content: markdownWithPlaceholders }),
  );

  // -------------------------------------------------------------------------
  // 3. Replace each placeholder with the mermaid SVG (or fallback <pre>)
  // -------------------------------------------------------------------------
  if (mermaidBlocks.length > 0) {
    const mermaidModule = await import("mermaid");
    const mermaid = mermaidModule.default;
    mermaid.initialize({ startOnLoad: false, theme: "default" });

    for (let i = 0; i < mermaidBlocks.length; i++) {
      const code = mermaidBlocks[i]!;
      const placeholder = `<p>MERMAIDPLACEHOLDER_${runToken}_${i}</p>`;
      let replacement: string;
      try {
        const { svg } = await mermaid.render(
          `export-mermaid-${i}-${Date.now()}`,
          code,
        );
        replacement = `<div class="mermaid-export">${svg}</div>`;
      } catch {
        // One bad diagram shouldn't abort the whole export
        replacement = `<pre class="mermaid-export">${escapeHtml(code)}</pre>`;
      }
      rendered = rendered.replace(placeholder, replacement);
    }
  }

  // -------------------------------------------------------------------------
  // 4. Wrap in standalone HTML document
  // -------------------------------------------------------------------------
  const escapedTitle = escapeHtml(title);

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapedTitle}</title>
${PRINT_HEAD_FONT_LINKS}
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@${KATEX_VERSION}/dist/katex.min.css" crossorigin="anonymous">
<style>${PRINT_CSS}</style>
</head>
<body class="markdown-body">${rendered}</body>
</html>`;
}

/**
 * Trigger a file download in the browser.
 * No-op when called outside a browser context.
 */
export function triggerDownload(
  filename: string,
  content: string,
  mime: string,
): void {
  if (typeof document === "undefined") return;
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/**
 * Open the rendered HTML document in a new browser tab and invoke `window.print()`.
 * No-op when called outside a browser context.
 */
export function openPrintView(htmlDocument: string): void {
  if (typeof window === "undefined") return;
  const blob = new Blob([htmlDocument], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const w = window.open(url, "_blank");
  if (!w) {
    URL.revokeObjectURL(url);
    return;
  }
  // Primary: wait for the page to load then print
  w.addEventListener("load", () => {
    w.print();
  });
  // Fallback: in case load already fired before we attached the listener
  setTimeout(() => {
    try {
      w.print();
    } catch {
      // ignore — window may already have handled it
    }
  }, 1000);
  // Revoke the blob URL after a generous delay
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
