/**
 * Block splitter for Live mode (preview-first, click-to-edit).
 *
 * Live mode renders the note as markdown, but clicking a block opens THAT
 * block's raw source in an inline editor. To do that we split the document
 * into top-level markdown blocks (headings, paragraphs, lists, fenced code,
 * blockquotes, tables, frontmatter, …) using the same remark stack the
 * preview renders with, so block boundaries line up with what the user sees.
 *
 * The document is tiled into a contiguous sequence of segments:
 *   - `block` — a renderable/editable top-level node (carries source offsets)
 *   - `gap`   — the raw whitespace between blocks (preserved, not rendered)
 *
 * Because every segment's `text` is sliced verbatim from the source and the
 * segments tile the whole document, reassembly is loss-less:
 *   reassemble(splitIntoSegments(src)) === src   (for every src)
 * Editing one block only swaps that segment's text, so the rest of the
 * document — including exact whitespace — is preserved byte-for-byte.
 */
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

export type Segment =
  | { kind: "block"; text: string; start: number; end: number }
  | { kind: "gap"; text: string; start: number; end: number };

type MdastNode = { position?: { start?: { offset?: number }; end?: { offset?: number } } };
type MdastRoot = { children?: MdastNode[] };

// Built once — the processor is stateless across parse() calls.
const processor = unified()
  .use(remarkParse)
  .use(remarkFrontmatter)
  .use(remarkGfm)
  .use(remarkMath);

/**
 * Split `source` into a contiguous, loss-less sequence of block/gap segments.
 * Top-level markdown nodes become `block` segments; everything between them
 * (blank lines, trailing newline) becomes `gap` segments.
 */
export function splitIntoSegments(source: string): Segment[] {
  if (source === "") return [];
  const tree = processor.parse(source) as MdastRoot;
  const children = tree.children ?? [];
  const segments: Segment[] = [];
  let cursor = 0;

  for (const child of children) {
    const start = child.position?.start?.offset;
    const end = child.position?.end?.offset;
    if (start === undefined || end === undefined || end <= start) continue;
    if (start > cursor) {
      segments.push({ kind: "gap", text: source.slice(cursor, start), start: cursor, end: start });
    }
    segments.push({ kind: "block", text: source.slice(start, end), start, end });
    cursor = end;
  }

  if (cursor < source.length) {
    segments.push({ kind: "gap", text: source.slice(cursor), start: cursor, end: source.length });
  }
  return segments;
}

/** Reassemble the full document from its segments (loss-less). */
export function reassemble(segments: readonly Segment[]): string {
  let out = "";
  for (const s of segments) out += s.text;
  return out;
}

/**
 * Reassemble the document with the segment at `index` replaced by `newText`.
 * Returns the original string unchanged if the index is out of range or does
 * not point at a block segment.
 */
export function replaceSegment(
  segments: readonly Segment[],
  index: number,
  newText: string,
): string {
  const target = segments[index];
  if (!target || target.kind !== "block") return reassemble(segments);
  let out = "";
  for (let i = 0; i < segments.length; i++) {
    out += i === index ? newText : segments[i]!.text;
  }
  return out;
}
