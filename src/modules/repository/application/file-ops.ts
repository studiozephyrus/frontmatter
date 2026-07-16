/**
 * Pure helpers for file-path validation and wikilink rewriting.
 *
 * No framework, no infrastructure, no env access.
 */

// ---------------------------------------------------------------------------
// Errors
// ---------------------------------------------------------------------------

export class InvalidPathError extends Error {
  constructor(reason: string) {
    super(`Invalid note path: ${reason}`);
    this.name = "InvalidPathError";
  }
}

export class NoteExistsError extends Error {
  readonly path: string;

  constructor(path: string) {
    super(`Note already exists: ${path}`);
    this.name = "NoteExistsError";
    this.path = path;
  }
}

// ---------------------------------------------------------------------------
// Path helpers
// ---------------------------------------------------------------------------

/**
 * Throws InvalidPathError if the path is not a valid vault-relative note path.
 * Rules:
 *   - Must not be empty
 *   - Must not start with "/"
 *   - Must not contain ".." segments
 *   - Must end with ".md"
 */
export function validateNotePath(path: string): void {
  if (path === "") {
    throw new InvalidPathError("path is empty");
  }
  if (path.startsWith("/")) {
    throw new InvalidPathError(`path must not start with "/" — got "${path}"`);
  }
  if (path.split("/").some((seg) => seg === "..")) {
    throw new InvalidPathError(`path must not contain ".." — got "${path}"`);
  }
  if (!path.endsWith(".md")) {
    throw new InvalidPathError(`path must end with ".md" — got "${path}"`);
  }
}

/**
 * Returns the basename without the ".md" extension.
 * e.g. "Projects/HQ/HQ.md" → "HQ"
 */
export function basenameNoExt(path: string): string {
  const seg = path.split("/").pop() ?? path;
  return seg.endsWith(".md") ? seg.slice(0, -3) : seg;
}

/**
 * The default content a brand-new note is created with — YAML frontmatter
 * (title + empty tags) plus an H1. Shared by the create route (server) and the
 * file-tree create handler (client) so the note the editor shows optimistically
 * is byte-identical to what the server commits — no "not found" flash, no
 * template mismatch on refresh.
 */
export function defaultNoteContent(path: string): string {
  const base = basenameNoExt(path);
  return `---\ntitle: ${base}\ntags: []\n---\n\n# ${base}\n`;
}

// ---------------------------------------------------------------------------
// Wikilink rewriting
// ---------------------------------------------------------------------------

/**
 * Rewrites all Obsidian-style wikilinks that reference `oldBasename` to use
 * `newBasename`, in the following forms:
 *   - [[oldBasename]]
 *   - [[oldBasename|alias]]
 *   - [[oldBasename#heading]]
 *   - ![[oldBasename]]  (embeds)
 *   - frontmatter "up:" and "related:" list values
 *
 * Matching is case-insensitive on `oldBasename` but only when it is the FULL
 * link target before any "#" or "|" suffix (no partial-name matching).
 *
 * Occurrences inside fenced code blocks (``` or ~~~) and inline code (` `)
 * are skipped.
 *
 * Returns `{ content, changed }`.
 */
export function rewriteWikilinks(
  content: string,
  oldBasename: string,
  newBasename: string,
): { content: string; changed: boolean } {
  // -------------------------------------------------------------------------
  // Step 1: locate code regions (fenced + inline) on the ORIGINAL content so
  // their spans stay valid, then rewrite wikilinks ONLY in the prose segments
  // between them. This tokenize-and-rejoin approach avoids the offset math
  // that the previous mask/restore version got wrong: a length-changing
  // rewrite (old vs new basename differ) shifted every later mask, splicing
  // code into the wrong place and leaving stray NUL bytes.
  // -------------------------------------------------------------------------
  type Span = { start: number; end: number };
  const codeSpans: Span[] = [];

  // Fenced code blocks, tracked LINE-BY-LINE so indented fences, fences with a
  // trailing close token (``` js), and unclosed fences (run to EOF) are all
  // protected — a single monolithic regex missed those.
  {
    let offset = 0;
    let openTok: string | null = null; // "```" or "~~~"
    let blockStart = 0;
    const lines = content.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i] ?? "";
      const lineLen = line.length + 1; // include the "\n"
      const fence = /^\s*(```+|~~~+)/.exec(line);
      if (openTok === null) {
        if (fence) {
          openTok = (fence[1] ?? "").slice(0, 3);
          blockStart = offset;
        }
      } else if (fence && (fence[1] ?? "").startsWith(openTok)) {
        codeSpans.push({ start: blockStart, end: offset + lineLen });
        openTok = null;
      }
      offset += lineLen;
    }
    // Unclosed fence → protect to EOF.
    if (openTok !== null) codeSpans.push({ start: blockStart, end: content.length });
  }

  // Inline code: `...` (single backtick, no newline) — skip if inside a fence.
  const inlineRe = /`[^`\n]+`/g;
  for (let m = inlineRe.exec(content); m !== null; m = inlineRe.exec(content)) {
    const s = m.index;
    const e = m.index + m[0].length;
    if (codeSpans.some((p) => s >= p.start && e <= p.end)) continue;
    codeSpans.push({ start: s, end: e });
  }
  codeSpans.sort((a, b) => a.start - b.start);

  const escapedOld = oldBasename.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // optional !, [[, exact oldBasename, optional #heading, optional |alias, ]]
  const wikilinkRe = new RegExp(
    `(!?\\[\\[)(${escapedOld})((?:#[^\\]|]*)?)((?:\\|[^\\]]*)?)\\]\\]`,
    "gi",
  );

  let changed = false;
  const rewriteProse = (segment: string): string =>
    segment.replace(wikilinkRe, (_match, prefix: string, _name: string, heading: string, alias: string) => {
      changed = true;
      return `${prefix}${newBasename}${heading}${alias}]]`;
    });

  // Rewrite prose gaps; copy code spans verbatim (byte-identical).
  let result = "";
  let cursor = 0;
  for (const span of codeSpans) {
    result += rewriteProse(content.slice(cursor, span.start));
    result += content.slice(span.start, span.end);
    cursor = span.end;
  }
  result += rewriteProse(content.slice(cursor));

  return { content: result, changed };
}
