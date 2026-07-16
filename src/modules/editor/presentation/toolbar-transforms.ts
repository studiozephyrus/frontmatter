/**
 * Pure transform helpers for the authoring toolbar and keybindings.
 *
 * These functions accept a CodeMirror EditorView and dispatch a transaction
 * that wraps or prefixes text. They do NOT touch React state — all mutations
 * go through the CM transaction pipeline so undo history is preserved.
 *
 * The pure string helpers (`applyWrapSelection`, `applyPrefixLines`,
 * `toggleTaskAtLine`) are also exported so they can be unit-tested against
 * plain strings without needing a live EditorView.
 */

import type { EditorView } from "@codemirror/view";

// ---------------------------------------------------------------------------
// Pure string helpers (testable without a DOM / CM view)
// ---------------------------------------------------------------------------

/**
 * Given `doc` (the full document string), `selFrom`/`selTo` (0-based offsets),
 * `before`/`after` markers: wraps the selection.
 *
 * - If text is already wrapped, strips the markers (toggle off).
 * - If selection is collapsed, inserts `before + after` and returns the cursor
 *   position between them.
 *
 * Returns `{ newDoc, from, to }` where from/to describe the new selection.
 */
export function applyWrapSelection(
  doc: string,
  selFrom: number,
  selTo: number,
  before: string,
  after: string,
): { newDoc: string; from: number; to: number } {
  const selected = doc.slice(selFrom, selTo);

  // Toggle off: if already wrapped, strip markers
  if (selected.startsWith(before) && selected.endsWith(after)) {
    const inner = selected.slice(before.length, selected.length - after.length);
    const newDoc = doc.slice(0, selFrom) + inner + doc.slice(selTo);
    return { newDoc, from: selFrom, to: selFrom + inner.length };
  }

  // Collapsed cursor: insert paired markers and place cursor between them
  if (selFrom === selTo) {
    const newDoc = doc.slice(0, selFrom) + before + after + doc.slice(selFrom);
    const cursor = selFrom + before.length;
    return { newDoc, from: cursor, to: cursor };
  }

  // Wrap selection
  const newDoc = doc.slice(0, selFrom) + before + selected + after + doc.slice(selTo);
  return {
    newDoc,
    from: selFrom + before.length,
    to: selFrom + before.length + selected.length,
  };
}

/**
 * Prefix every line that overlaps the selection with `prefix`.
 * If ALL overlapping lines already start with `prefix`, strip it instead (toggle).
 * Returns `{ newDoc, from, to }` anchored to the original from/to lines.
 */
export function applyPrefixLines(
  doc: string,
  selFrom: number,
  selTo: number,
  prefix: string,
): { newDoc: string; from: number; to: number } {
  const lines = doc.split("\n");

  // Compute 1-based line numbers that overlap the selection
  let pos = 0;
  const lineRanges: Array<{ lineIdx: number; start: number; end: number }> = [];
  for (let i = 0; i < lines.length; i++) {
    const lineStr = lines[i] ?? "";
    const lineStart = pos;
    const lineEnd = pos + lineStr.length;
    // Line overlaps if its range intersects [selFrom, selTo]
    if (lineStart <= selTo && lineEnd >= selFrom) {
      lineRanges.push({ lineIdx: i, start: lineStart, end: lineEnd });
    }
    pos = lineEnd + 1; // +1 for '\n'
    if (pos > selTo && lineRanges.length > 0) break;
  }

  // Determine whether to toggle off
  const allPrefixed = lineRanges.every(({ lineIdx }) =>
    (lines[lineIdx] ?? "").startsWith(prefix),
  );

  const newLines = [...lines];
  for (const { lineIdx } of lineRanges) {
    const line = newLines[lineIdx] ?? "";
    newLines[lineIdx] = allPrefixed ? line.slice(prefix.length) : prefix + line;
  }

  const newDoc = newLines.join("\n");
  // Keep selection anchored — offset shifts by prefix length × lines touched
  const delta = allPrefixed ? -prefix.length : prefix.length;
  const newFrom = Math.max(0, selFrom + delta);
  const newTo = Math.max(newFrom, selTo + delta * lineRanges.length);
  return { newDoc, from: newFrom, to: newTo };
}

/**
 * Flip `- [ ]` ↔ `- [x]` on a specific 1-based line of `content`.
 * Returns the updated content string (or original if no checkbox found on that line).
 */
export function toggleTaskAtLine(content: string, line: number): string {
  const lines = content.split("\n");
  const idx = line - 1;
  if (idx < 0 || idx >= lines.length) return content;

  const original = lines[idx] ?? "";
  let updated: string;
  // Use global replace so a line with multiple checkboxes (rare but possible
  // in compressed task lines) toggles every box together instead of just the
  // first one.
  if (/- \[ \]/.test(original)) {
    updated = original.replace(/- \[ \]/g, "- [x]");
  } else if (/- \[x\]/i.test(original)) {
    updated = original.replace(/- \[x\]/gi, "- [ ]");
  } else {
    // Fallback: no checkbox found on this line — no-op
    return content;
  }

  const result = [...lines];
  result[idx] = updated;
  return result.join("\n");
}

/**
 * Return a version of `content` where all characters inside fenced code blocks
 * (``` or ~~~) are replaced with spaces, so task-list patterns inside fences
 * are invisible to the occurrence counter.
 *
 * The replacement preserves string length so offsets into the original content
 * are not needed — we only use it to COUNT occurrences, not to derive positions.
 */
function maskFencedCodeBlocks(content: string): string {
  // Replace everything between opening and closing fences (inclusive) with spaces
  return content.replace(/(`{3,}|~{3,})[^\n]*\n[\s\S]*?\n\1[^\n]*/g, (match) =>
    " ".repeat(match.length),
  );
}

/**
 * Fallback: toggle the Nth checkbox occurrence (0-indexed) in `content`.
 * Used when position data from react-markdown isn't available.
 *
 * Only real task-list checkboxes OUTSIDE fenced code blocks are counted,
 * so a `- [ ]` inside a ``` fence cannot be accidentally targeted.
 */
export function toggleTaskAtOccurrence(content: string, occurrenceIndex: number): string {
  const masked = maskFencedCodeBlocks(content);

  // Build an ordered list of real (non-fenced) checkbox positions in `content`
  const positions: number[] = [];
  const re = /- \[[ xX]\]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(masked)) !== null) {
    positions.push(m.index);
  }

  const pos = positions[occurrenceIndex];
  if (pos === undefined) return content;

  // Toggle the checkbox at the identified position in the ORIGINAL content
  const original = content.slice(pos, pos + 6); // "- [ ]" or "- [x]" — 5-6 chars
  // Find match length from the real content at that position (may be "- [X]")
  const matchAtPos = /- \[[ xX]\]/.exec(content.slice(pos));
  if (!matchAtPos) return content;

  const toggled =
    matchAtPos[0].toLowerCase() === "- [x]" ? "- [ ]" : "- [x]";
  void original; // suppress unused warning
  return content.slice(0, pos) + toggled + content.slice(pos + matchAtPos[0].length);
}

// ---------------------------------------------------------------------------
// CodeMirror view dispatch helpers
// ---------------------------------------------------------------------------

/** Wrap the current selection (or cursor) with `before`/`after`. Returns true (key consumed). */
export function wrapSelection(view: EditorView, before: string, after: string): boolean {
  const sel = view.state.selection.main;
  const doc = view.state.doc.toString();
  const { newDoc, from, to } = applyWrapSelection(doc, sel.from, sel.to, before, after);
  view.dispatch({
    changes: { from: 0, to: doc.length, insert: newDoc },
    selection: { anchor: from, head: to },
    scrollIntoView: true,
    userEvent: "input",
  });
  return true;
}

/** Prefix the selected line(s) with `prefix`. Returns true (key consumed). */
export function prefixLine(view: EditorView, prefix: string): boolean {
  const sel = view.state.selection.main;
  const doc = view.state.doc.toString();
  const { newDoc, from, to } = applyPrefixLines(doc, sel.from, sel.to, prefix);
  view.dispatch({
    changes: { from: 0, to: doc.length, insert: newDoc },
    selection: { anchor: from, head: to },
    scrollIntoView: true,
    userEvent: "input",
  });
  return true;
}

/** Wrap in a fenced code block. */
export function insertCodeBlock(view: EditorView): boolean {
  const sel = view.state.selection.main;
  const doc = view.state.doc.toString();
  const selected = doc.slice(sel.from, sel.to);
  const fenced = "```\n" + (selected || "") + "\n```";
  const newDoc = doc.slice(0, sel.from) + fenced + doc.slice(sel.to);
  const cursorPos = sel.from + 4; // after "```\n"
  view.dispatch({
    changes: { from: 0, to: doc.length, insert: newDoc },
    selection: { anchor: cursorPos, head: cursorPos + (selected || "").length },
    scrollIntoView: true,
    userEvent: "input",
  });
  return true;
}

/** Insert a `[text](url)` link skeleton. */
export function insertLink(view: EditorView): boolean {
  const sel = view.state.selection.main;
  const doc = view.state.doc.toString();
  const selected = doc.slice(sel.from, sel.to);
  const snippet = `[${selected || "link text"}](url)`;
  const newDoc = doc.slice(0, sel.from) + snippet + doc.slice(sel.to);
  // Place cursor on "url"
  const urlStart = sel.from + 1 + (selected || "link text").length + 2;
  view.dispatch({
    changes: { from: 0, to: doc.length, insert: newDoc },
    selection: { anchor: urlStart, head: urlStart + 3 },
    scrollIntoView: true,
    userEvent: "input",
  });
  return true;
}

/**
 * Build a GFM table snippet with `cols` columns and `bodyRows` empty rows,
 * leading-padded with a blank line so it never collides with surrounding
 * prose. Returns the snippet and the offset of the first body cell so the
 * caller can place the cursor there.
 */
export function buildTableSnippet(
  cols: number,
  bodyRows: number,
): { snippet: string; firstCellOffset: number } {
  const headers = Array.from({ length: cols }, (_, i) => ` Col ${i + 1} `).join("|");
  const separator = Array.from({ length: cols }, () => " ----- ").join("|");
  // 3-space cells give a click target wide enough to land in visually and
  // match the column width of the separator row.
  const blankRow = Array.from({ length: cols }, () => "   ").join("|");
  const headerLine = `|${headers}|\n`;
  const separatorLine = `|${separator}|\n`;
  const bodyLine = `|${blankRow}|\n`;
  const snippet = `\n${headerLine}${separatorLine}${bodyLine.repeat(bodyRows)}\n`;
  // First body cell starts at: leading "\n" + header line + separator line
  // + leading "|" of the body row. Lands on the first space of the cell.
  const firstCellOffset = 1 + headerLine.length + separatorLine.length + 1;
  return { snippet, firstCellOffset };
}

/** Insert a 3-column × 2-row GFM table at the cursor and park the caret
 *  inside the first body cell. */
export function insertTable(view: EditorView): boolean {
  const sel = view.state.selection.main;
  const doc = view.state.doc.toString();
  const { snippet, firstCellOffset } = buildTableSnippet(3, 2);
  const newDoc = doc.slice(0, sel.from) + snippet + doc.slice(sel.to);
  const cursor = sel.from + firstCellOffset;
  view.dispatch({
    changes: { from: 0, to: doc.length, insert: newDoc },
    selection: { anchor: cursor, head: cursor },
    scrollIntoView: true,
    userEvent: "input",
  });
  return true;
}
