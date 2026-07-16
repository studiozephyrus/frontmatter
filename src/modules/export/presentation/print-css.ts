/**
 * Shared print stylesheet + <head> font links for BOTH export paths:
 *   - export-doc.ts   → client-side Print / Save-as-PDF (window.print of a blob)
 *   - pdf-doc.ts      → server-side headless-Chromium PDF
 *
 * Keeping a single source here is deliberate: the two paths previously held
 * separate copies that drifted (one stayed on -apple-system + 2cm margins +
 * 15px while the other was updated), so the printed output didn't match the
 * preview. Import from here in both; never re-inline.
 *
 * No React / react-dom / unified imports — safe to pull into either a client
 * component tree or a server route handler.
 *
 * The app is dark-first and themed via CSS variables; a print page is always
 * light, so the `.light` token values from globals.css are baked in here as
 * literal colours. Typography is Google Sans (body) + Google Sans Code (code),
 * the same family as the app, loaded from the Google Fonts CDN.
 */

/** Page margin used by `@page` (client print) and `page.pdf({ margin })`
 *  (server). Kept here so both stay in sync. */
export const PRINT_PAGE_MARGIN = "1.6cm";

/** Preconnect + stylesheet links to drop into the export document <head>
 *  so Google Sans is available before the page renders. */
export const PRINT_HEAD_FONT_LINKS = `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Google+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Google+Sans+Code:wght@400;500&display=swap">
`.trim();

export const PRINT_CSS = `
:root {
  --fg: #18181b;
  --fg-muted: #6b6b73;
  --muted: #9b9ba3;
  --border: rgba(10, 10, 10, 0.10);
  --panel-2: rgba(10, 10, 10, 0.025);
  --accent: #18181b;
  --accent-soft: rgba(10, 10, 10, 0.04);
  --link: #0044cc;
  --link-visited: #4c1d95;
  --radius: 8px;
  --radius-sm: 6px;
  --font-sans: "Google Sans", "Roboto", ui-sans-serif, system-ui, -apple-system, sans-serif;
  --font-mono: "Google Sans Code", ui-monospace, SFMono-Regular, Menlo, monospace;
}
@page { margin: ${PRINT_PAGE_MARGIN} }
* { box-sizing: border-box; }
body {
  font-family: var(--font-sans);
  margin: 0 auto;
  padding: 0;
  color: var(--fg);
  background: #ffffff;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
.markdown-body {
  color: var(--fg);
  line-height: 1.55;
  /* Print base is smaller than the 15px screen preview — 15px renders
     oversized on A4. Everything else is em-relative, so this single value
     scales the whole document down proportionally. */
  font-size: 12px;
  max-width: 100%;
  margin: 0 auto;
  word-wrap: break-word;
}
.markdown-body > :first-child { margin-top: 0; }
.markdown-body h1,
.markdown-body h2,
.markdown-body h3,
.markdown-body h4,
.markdown-body h5,
.markdown-body h6 {
  font-weight: 650;
  line-height: 1.3;
  letter-spacing: -0.01em;
  margin: 1.6em 0 0.6em;
}
.markdown-body h1 { font-size: 1.9em; letter-spacing: -0.02em; border-bottom: 1px solid var(--border); padding-bottom: 0.3em; }
.markdown-body h2 { font-size: 1.5em; border-bottom: 1px solid var(--border); padding-bottom: 0.25em; }
.markdown-body h3 { font-size: 1.25em; }
.markdown-body h4 { font-size: 1.05em; }
.markdown-body h5 { font-size: 0.95em; color: var(--muted); }
.markdown-body h6 { font-size: 0.9em; color: var(--muted); }
.markdown-body p { margin: 1em 0; }
.markdown-body strong { font-weight: 700; }
.markdown-body em { font-style: italic; }
.markdown-body del { text-decoration: line-through; }
.markdown-body mark { background: rgba(255, 220, 0, 0.35); color: inherit; padding: 0 0.15em; border-radius: 3px; }
.markdown-body a { color: var(--link); font-weight: 500; text-decoration: none; }
.markdown-body a:visited { color: var(--link-visited); }
.markdown-body ul { list-style: disc; padding-left: 1.6em; margin: 0.6em 0; }
.markdown-body ol { list-style: decimal; padding-left: 1.6em; margin: 0.6em 0; }
.markdown-body li { margin: 0.25em 0; }
.markdown-body li.task-list-item { list-style: none; margin-left: -1.4em; }
.markdown-body li.task-list-item .task-list-checkbox { margin-right: 0.5em; vertical-align: middle; }
.markdown-body input[type="checkbox"] { margin-right: 0.4em; }
.markdown-body blockquote,
.markdown-body .markdown-blockquote {
  margin: 0.9em 0;
  padding: 0.3em 1.1em;
  border-left: 3px solid var(--accent);
  background: var(--accent-soft);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  color: var(--fg-muted);
}
.markdown-body code {
  font-family: var(--font-mono);
  font-size: 0.86em;
  background: rgba(10, 10, 10, 0.06);
  padding: 0.12em 0.38em;
  border-radius: 5px;
}
.markdown-body pre {
  background: var(--panel-2);
  padding: 1em 1.1em;
  border-radius: var(--radius);
  overflow-x: auto;
  margin: 0.9em 0;
  border: 1px solid var(--border);
}
.markdown-body pre code { background: none; padding: 0; font-size: 0.85em; }
.markdown-body table {
  border-collapse: collapse;
  margin: 0.9em 0;
  /* Full-width tables in print: every table spans the page measure
     (like the KPI table) instead of shrinking to its content. */
  width: 100%;
  table-layout: auto;
  border-radius: var(--radius-sm);
}
.markdown-body th,
.markdown-body td { border: 1px solid var(--border); padding: 0.45em 0.8em; text-align: left; }
.markdown-body th { background: var(--panel-2); font-weight: 650; }
.markdown-body tr:nth-child(even) td { background: rgba(10, 10, 10, 0.025); }
.markdown-body hr { border: none; border-top: 1px solid var(--border); margin: 2em 0; }
.markdown-body img { max-width: 100%; border-radius: var(--radius); border: 1px solid var(--border); }
.markdown-body .callout {
  margin: 1em 0;
  padding: 0.8em 1.1em;
  border: 1px solid var(--border);
  border-left: 3px solid var(--accent);
  border-radius: var(--radius);
  background: var(--accent-soft);
}
.markdown-body .callout__header { display: flex; gap: 0.5em; align-items: baseline; font-weight: 650; margin-bottom: 0.3em; }
.markdown-body .callout__type { font-size: 0.72em; letter-spacing: 0.06em; text-transform: uppercase; }
.markdown-body .callout__title { font-weight: 650; color: var(--fg); }
.markdown-body .callout__body > :first-child { margin-top: 0; }
.markdown-body .callout__body > :last-child { margin-bottom: 0; }
.mermaid, .mermaid-export { text-align: center; margin: 1rem 0; }
.mermaid svg, .mermaid-export svg { max-width: 100%; height: auto; }
`.trim();
