/**
 * outline.ts — pure ATX-heading extractor.
 *
 * Rules:
 *   - Parses `#`..`######` headings (ATX style).
 *   - Headings inside fenced code blocks (``` or ~~~) are ignored.
 *   - Slugs produced by github-slugger to match rehype-slug's output exactly.
 */

import GithubSlugger from "github-slugger";

export interface HeadingEntry {
  depth: number;
  text: string;
  slug: string;
}

/**
 * Reduce a raw heading line to the text the renderer actually displays, so the
 * slug matches rehype-slug (which slugs rendered text). Strips wikilink syntax
 * to its display form, markdown links to their label, and inline emphasis/code
 * markers.
 */
function toDisplayText(raw: string): string {
  // Resolve only wikilink + markdown-link syntax to the text the renderer
  // shows. Emphasis/code markers (* _ ` ~) are intentionally NOT stripped —
  // github-slugger removes the same punctuation the renderer drops, so leaving
  // them in keeps intraword underscores (foo_bar) intact and still matches.
  return raw
    .replace(/!?\[\[([^\]]+)\]\]/g, (_m, inner: string) => {
      const pipe = inner.indexOf("|");
      const shown = pipe !== -1 ? inner.slice(pipe + 1) : (inner.split("#")[0] ?? inner);
      return shown.trim();
    })
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .trim();
}

/**
 * Extract ATX headings from markdown, ignoring any inside fenced code blocks.
 * A fresh GithubSlugger is created per call to mirror per-document slugging
 * (duplicate headings get -1, -2 suffixes, matching rehype-slug behaviour).
 */
export function extractOutline(markdown: string): HeadingEntry[] {
  const slugger = new GithubSlugger();
  const lines = markdown.split("\n");
  const result: HeadingEntry[] = [];
  let inFence = false;
  // Track the opening fence token so we close on the matching delimiter
  let fenceToken = "";

  for (const line of lines) {
    // Detect fence open/close (``` or ~~~, 3+ chars)
    const fenceMatch = /^(`{3,}|~{3,})/.exec(line);
    if (fenceMatch) {
      if (!inFence) {
        inFence = true;
        fenceToken = (fenceMatch[1] ?? "").charAt(0); // ` or ~
      } else if (line.trimEnd().startsWith(fenceToken.repeat(3))) {
        inFence = false;
        fenceToken = "";
      }
      continue;
    }

    if (inFence) continue;

    // Match ATX heading: optional leading spaces (up to 3), then #'s
    const headingMatch = /^#{1,6}(?:\s|$)/.exec(line);
    if (!headingMatch) continue;

    const hashCount = headingMatch[0].trimEnd().length;
    const depth = hashCount;
    // Text is everything after the hashes + space
    const rawText = line.slice(hashCount).trim();
    // Strip trailing `#` sequences (e.g. `## Heading ##`)
    const trimmed = rawText.replace(/\s+#+\s*$/, "").trim();
    // Display + slug from the rendered text form (matches rehype-slug).
    const text = toDisplayText(trimmed);

    if (text === "") continue;

    result.push({ depth, text, slug: slugger.slug(text) });
  }

  return result;
}
