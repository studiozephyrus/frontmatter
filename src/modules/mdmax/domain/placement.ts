/**
 * The placement fixture — every byte written into a user's file passes this first. (PLAN §3.8.5)
 *
 * THE MEASURED DEFECT, FOUND BY THIS RESEARCH'S OWN VERIFIER
 * Inserting a marker next to a setext heading silently changes what the document MEANS, and the
 * obvious mitigation does not work. Verified against this repo's own parser:
 *
 *   "Heading\n---"                                 -> heading(depth=2)
 *   "Heading\n<!-- mdmax:begin id=k -->\n---"      -> paragraph, html, thematicBreak
 *   "Heading\n\n<!-- mdmax:begin id=k -->\n\n---"  -> paragraph, html, thematicBreak   <- SAME
 *
 * An `h2` becomes a paragraph plus a horizontal rule. **Blank-line isolation does not prevent
 * it** — which is the whole reason this file exists rather than a comment saying "pad with
 * newlines". Any verb specified purely on byte ranges is exposed to this.
 *
 * THE RULE (house rule P5)
 * Never reason about whether an insertion is safe. Insert it, parse both versions, and compare
 * the block skeleton. If the skeleton moved, refuse — do not attempt to repair, do not pad and
 * retry silently. A refusal costs a user one un-anchored comment; a wrong answer costs them a
 * heading, permanently, in a file that is also a git commit.
 *
 * The parser is injected so this stays in the domain layer with no framework dependency, and so
 * the SAME parser the product renders with is the one that judges safety. A fixture that uses a
 * different parser than production is measuring the wrong thing.
 */

/** The minimum shape this needs from an mdast-like tree. */
export interface BlockNode {
  readonly type: string
  readonly depth?: number
  readonly children?: readonly BlockNode[]
}

/** Any parser producing an mdast-like root. `mdast-util-from-markdown` satisfies this. */
export type ParseFn = (markdown: string) => BlockNode

export type PlacementVerdict =
  | { readonly ok: true; readonly text: string }
  | {
      readonly ok: false
      readonly reason: 'SKELETON_CHANGED'
      /** The block skeleton before and after, so a human can see what moved. */
      readonly before: readonly string[]
      readonly after: readonly string[]
      readonly firstDivergence: number
    }
  | { readonly ok: false; readonly reason: 'ADJACENT_TO_SETEXT_UNDERLINE'; readonly line: number }
  | { readonly ok: false; readonly reason: 'OFFSET_OUT_OF_RANGE'; readonly offset: number; readonly length: number }
  | { readonly ok: false; readonly reason: 'PARSER_THREW'; readonly message: string }

/**
 * The block skeleton: every block-level node's type, with heading depth, depth-first.
 *
 * Inline content is deliberately excluded. Inserting an HTML comment can legitimately change a
 * paragraph's inline children without changing what the document means; it must never change
 * which blocks exist or what they are.
 */
export function blockSkeleton(root: BlockNode): string[] {
  const out: string[] = []
  const INLINE = new Set(['text', 'emphasis', 'strong', 'inlineCode', 'link', 'image', 'break', 'delete'])
  const walk = (n: BlockNode): void => {
    if (INLINE.has(n.type)) return
    out.push(n.type === 'heading' ? `heading:${n.depth ?? '?'}` : n.type)
    for (const c of n.children ?? []) walk(c)
  }
  for (const c of root.children ?? []) walk(c)
  return out
}

/** A line that is a setext underline: only `=` or only `-`, at most three leading spaces. */
const SETEXT_UNDERLINE = /^ {0,3}(?:=+|-+)[ \t]*$/

/**
 * Cheap syntactic pre-check for the known-dangerous neighbourhood.
 *
 * This is an optimisation and a better error message, NOT the gate. The parse-and-compare below
 * is the gate — a pre-check can only catch shapes someone thought of in advance, and the whole
 * lesson of this defect is that the dangerous shape was not the one anyone expected.
 */
export function nearSetextUnderline(text: string, offset: number): number | null {
  const before = text.slice(0, offset)
  const after = text.slice(offset)
  const lineNo = before.split('\n').length
  const nextLine = after.split('\n')[0] ?? ''
  const restLines = after.split('\n')

  // The insertion point sits immediately before a line that is a setext underline...
  if (SETEXT_UNDERLINE.test(nextLine.trim() === '' ? (restLines[1] ?? '') : nextLine)) {
    // ...and the line before it is non-blank, which is what makes the underline load-bearing.
    const prevLine = before.split('\n')[lineNo - 1] ?? ''
    const prevPrev = before.split('\n')[lineNo - 2] ?? ''
    if (prevLine.trim() !== '' || prevPrev.trim() !== '') return lineNo
  }
  return null
}

/**
 * Insert `marker` at `offset` and return the new text ONLY if the document still parses to the
 * same block skeleton.
 *
 * Both a fast syntactic refusal and the authoritative parse-and-compare. Callers write bytes only
 * on `ok: true`; there is no partial success.
 */
export function safeInsert(text: string, offset: number, marker: string, parse: ParseFn): PlacementVerdict {
  if (!Number.isInteger(offset) || offset < 0 || offset > text.length)
    return { ok: false, reason: 'OFFSET_OUT_OF_RANGE', offset, length: text.length }

  const setextLine = nearSetextUnderline(text, offset)
  if (setextLine !== null) return { ok: false, reason: 'ADJACENT_TO_SETEXT_UNDERLINE', line: setextLine }

  const next = text.slice(0, offset) + marker + text.slice(offset)

  let before: string[]
  let after: string[]
  try {
    before = blockSkeleton(parse(text))
    after = blockSkeleton(parse(next))
  } catch (e) {
    return { ok: false, reason: 'PARSER_THREW', message: e instanceof Error ? e.message : String(e) }
  }

  // The marker itself legitimately adds exactly one `html` node. Remove the first `html` that
  // appears in `after` but not in `before` at that position, then require an exact match.
  const stripped = removeFirstInsertedHtml(before, after)
  if (stripped.length !== before.length || stripped.some((v, i) => v !== before[i])) {
    let i = 0
    while (i < before.length && i < stripped.length && before[i] === stripped[i]) i++
    return { ok: false, reason: 'SKELETON_CHANGED', before, after, firstDivergence: i }
  }
  return { ok: true, text: next }
}

/**
 * Drop the single `html` node the marker is expected to contribute.
 *
 * Walks both skeletons in step and removes the first `after` entry that is `html` and does not
 * correspond to a `before` entry. Anything else that differs survives into the comparison, which
 * is the point: only the marker's own node is forgiven.
 */
function removeFirstInsertedHtml(before: readonly string[], after: readonly string[]): string[] {
  const out: string[] = []
  let i = 0
  let removed = false
  for (let j = 0; j < after.length; j++) {
    const a = after[j] as string
    if (!removed && a === 'html' && before[i] !== 'html') {
      removed = true
      continue
    }
    out.push(a)
    i++
  }
  return out
}
