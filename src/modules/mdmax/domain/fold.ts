/**
 * THE EQUIVALENCE FOLD — a named, versioned, pure function. (PLAN §3.3.6)
 *
 * WHAT IT IS FOR
 * Two engines can emit different bytes for the same block and still have rendered the same thing.
 * `PASS` in a certificate means "semantically equivalent output **after the versioned fold**", so
 * the fold is the definition of PASS. It is the load-bearing component of the whole capability.
 *
 * The often-quoted "43.71% -> 4.28% divergence" is the RESEARCH PROTOTYPE's number, not this
 * function's: 705/1613 strict versus 69/1613 folded, over 40 files of `~/Desktop/GitHub/knowledge`
 * against 6 GFM-class engines (PLAN §3.3, D-record). Both rates re-derive, but that population
 * carries no `corpus_id`, and THIS implementation has never been run over it. Do not attach either
 * number to `mdmax/fold@1` until it has been re-measured against the pinned corpus.
 *
 * WHY IT IS DELIBERATELY UNDER-POWERED
 * Kill condition (1) in §3.3.10 is "the fold swallows everything": if semantic BROKEN verdicts
 * fall below ~1% of blocks the certificate is a curiosity, not a product. So the governing rule is
 * **everything the fold does is a documented, testable normalisation; everything it does NOT do is
 * a real finding.** When in doubt this function leaves the difference in place. Two consequences
 * a reader should know about before quoting a PASS:
 *
 *   - Attribute VALUES are never folded, only the `id` prefix. `href="a&amp;b"` and `href="a&b"`
 *     therefore stay a finding even though both parse to the same URL. Under-folding costs a false
 *     positive; over-folding costs the product.
 *   - Text inside `<pre>` and `<code>` is exempt from smart punctuation and (for `<pre>`) from
 *     whitespace collapse, because in verbatim context a substituted character is a `DESTROY`,
 *     not a typographic variant.
 *
 * WHY THE ENTITY RULE RE-ESCAPES
 * A naive full decode of the whole document collapses `<p>&lt;cat&gt;</p>` (a visible LEAK) into
 * `<p><cat></p>` (an invisible tag) — the exact difference the certificate exists to report. So
 * text-position entities are decoded with `entities.decodeHTML` and then re-escaped to canonical
 * spelling with `entities.escapeText`. Net effect: `&#60;`, `&lt;` and `&LT;` all become `&lt;`,
 * a bare `&` becomes `&amp;`, and markup stays distinguishable from text. That also makes the
 * function idempotent, which a naive decode is not (`&amp;lt;` -> `&lt;` -> `<`).
 *
 * The original bug this rule replaces was a hand-rolled five-entity replace; `&mdash;`, `&hellip;`
 * and every numeric reference fell straight through it.
 *
 * CHANGING ANY RULE HERE REQUIRES BUMPING `FOLD_VERSION`, because `Certificate.fold.version` is
 * how a reader tells which definition of "equivalent" produced a stored verdict.
 */
import { decodeHTML, escapeText } from 'entities'

export const FOLD_VERSION = 'mdmax/fold@1'

/**
 * The rules, in the order they are reported. A `PASS` carries this list so it can be audited
 * rather than trusted — a PASS that fired no rules is a byte-identical match; a PASS that fired
 * `id-prefix` and nothing else is a different and weaker claim.
 */
export const FOLD_RULES = [
  'entity-decode',
  'smart-punctuation',
  'void-element-spelling',
  'whitespace',
  'id-prefix',
  'heading-anchor-id',
] as const

export type FoldRule = (typeof FOLD_RULES)[number]

export interface FoldResult {
  text: string
  applied: string[]
}

/**
 * Elements that cannot have content, so a trailing `/` before `>` is ignored by every HTML parser.
 * `<hr>`, `<hr />` and `<hr/>` are the same element; folding the spelling cannot hide a semantic
 * difference. The full HTML void set is used rather than the four that markdown engines emit
 * directly, because raw HTML passthrough puts the rest into documents too.
 */
const VOID_ELEMENTS = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
])

/**
 * Tags across which collapsible whitespace carries no rendering.
 *
 * This is CSS's own white-space processing model, not a guess: a space at the start or end of a
 * line box is removed, so `</p>\n<p>` and `</p><p>` render identically. `br` is in the set for the
 * same reason — it ends a line, so the whitespace on either side of it is at a line edge.
 *
 * `img` is deliberately NOT here: it is inline, and the space in `<img> <img>` is real.
 */
const WHITESPACE_BOUNDARY_TAGS = new Set([
  'address',
  'article',
  'aside',
  'blockquote',
  'body',
  'br',
  'caption',
  'col',
  'colgroup',
  'dd',
  'details',
  'div',
  'dl',
  'dt',
  'fieldset',
  'figcaption',
  'figure',
  'footer',
  'form',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'head',
  'header',
  'hgroup',
  'hr',
  'html',
  'legend',
  'li',
  'main',
  'nav',
  'ol',
  'p',
  'pre',
  'section',
  'summary',
  'table',
  'tbody',
  'td',
  'tfoot',
  'th',
  'thead',
  'tr',
  'ul',
])

/**
 * Only the five collapsible characters from the HTML white-space processing model.
 *
 * `\s` is wrong here and the difference is load-bearing: `&nbsp;` decodes to U+00A0, which browsers
 * do NOT collapse. Folding it would erase the difference between a non-breaking space and a plain
 * one, which is a visible change to the document.
 */
const COLLAPSIBLE = /[ \t\n\r\f]+/g

/** GitHub prefixes every heading anchor. `(?:…)+` rather than `(?:…)` so the rule is idempotent. */
const USER_CONTENT_ID = /(\sid\s*=\s*["'])(?:user-content-)+/gi

/** Heading elements carry renderer-generated anchor ids; see the note at the fold site. */
const HEADING_ELEMENTS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])
const HEADING_ID_ATTR = /\sid\s*=\s*(?:"[^"]*"|'[^']*')/gi

type Segment =
  | {
      readonly kind: 'text'
      readonly value: string
      /** Inside `<pre>`: whitespace is significant. */
      readonly preserveSpace: boolean
      /** Inside `<pre>` or `<code>`: a substituted character is a DESTROY, not typography. */
      readonly verbatim: boolean
    }
  | {
      readonly kind: 'tag'
      readonly value: string
      readonly name: string
      readonly closing: boolean
      /** `value` with a trailing self-closing slash and its whitespace removed. */
      readonly voidCanonical: string
    }
  /** Comments, doctypes and processing instructions. Never touched, never a whitespace boundary. */
  | { readonly kind: 'opaque'; readonly value: string }

/**
 * Split HTML into text / tag / opaque runs.
 *
 * Not an HTML parser and does not need to be — it only needs to know where markup stops and text
 * starts, so that a rule aimed at text cannot reach into an attribute value and vice versa. It is
 * single-pass and index-based rather than slice-based because a `slice(i)` inside the loop makes
 * the whole fold quadratic, and rendered vault documents run to hundreds of kilobytes.
 */
function scan(html: string): Segment[] {
  const segments: Segment[] = []
  const tagStart = /(\/?)([a-zA-Z][^\s/>]*)/y
  let preDepth = 0
  let codeDepth = 0
  let textStart = 0
  let i = 0

  const flushText = (end: number): void => {
    if (end > textStart) {
      segments.push({
        kind: 'text',
        value: html.slice(textStart, end),
        preserveSpace: preDepth > 0,
        verbatim: preDepth > 0 || codeDepth > 0,
      })
    }
  }

  while (i < html.length) {
    if (html.charCodeAt(i) !== 0x3c /* < */) {
      i++
      continue
    }

    if (html.startsWith('<!--', i)) {
      const end = html.indexOf('-->', i + 4)
      const stop = end === -1 ? html.length : end + 3
      flushText(i)
      segments.push({ kind: 'opaque', value: html.slice(i, stop) })
      i = stop
      textStart = i
      continue
    }

    if (html.startsWith('<!', i) || html.startsWith('<?', i)) {
      const end = html.indexOf('>', i)
      const stop = end === -1 ? html.length : end + 1
      flushText(i)
      segments.push({ kind: 'opaque', value: html.slice(i, stop) })
      i = stop
      textStart = i
      continue
    }

    tagStart.lastIndex = i + 1
    const matched = tagStart.exec(html)
    if (matched === null) {
      i++
      continue
    }

    const closing = matched[1] === '/'
    const name = (matched[2] ?? '').toLowerCase()

    // Walk to the closing `>`, tracking quotes so that a `>` inside an attribute value does not
    // end the tag, and tracking where the significant body ends so a trailing `/` can be dropped.
    let j = tagStart.lastIndex
    let quote: string | null = null
    let keepEnd = j
    let slashAllowed = true
    let closed = false
    while (j < html.length) {
      const ch = html[j]
      if (quote !== null) {
        if (ch === quote) {
          quote = null
          slashAllowed = true
        }
        keepEnd = j + 1
      } else if (ch === '"' || ch === "'") {
        quote = ch
        keepEnd = j + 1
        slashAllowed = false
      } else if (ch === '>') {
        closed = true
        break
      } else if (ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r' || ch === '\f') {
        slashAllowed = true
      } else if (ch === '/' && slashAllowed) {
        // A candidate self-closing slash: deliberately does not advance keepEnd. `slashAllowed`
        // is false straight after an unquoted attribute character because HTML's unquoted
        // attribute value state consumes `/` — in `<img src=a/>` the value really is `a/`.
      } else {
        keepEnd = j + 1
        slashAllowed = false
      }
      j++
    }

    // An unterminated `<` is text, not markup. Leave it in the text run.
    //
    // `j` reached `html.length` without ever seeing `>` — which proves no `>` exists anywhere
    // in the rest of the document, so NOTHING from here to the end can be a closed tag either.
    // Jumping straight to the end (rather than `i++` and letting the outer loop retry at the
    // very next `<`) is what makes this O(n): without it, a run of N tag-looking-but-unclosed
    // `<...` sequences re-runs this same O(remaining-length) inner walk from each one, which is
    // O(n^2) (measured k=1.94, §6.11). flushText(html.length) below still emits everything from
    // textStart onward as one text segment — nothing is lost, only the redundant re-scanning is.
    if (!closed) {
      i = html.length
      continue
    }

    flushText(i)
    segments.push({
      kind: 'tag',
      value: html.slice(i, j + 1),
      name,
      closing,
      voidCanonical: html.slice(i, keepEnd) + '>',
    })

    if (!VOID_ELEMENTS.has(name)) {
      if (name === 'pre') preDepth = closing ? Math.max(0, preDepth - 1) : preDepth + 1
      else if (name === 'code') codeDepth = closing ? Math.max(0, codeDepth - 1) : codeDepth + 1
    }

    i = j + 1
    textStart = i
  }

  flushText(html.length)
  return segments
}

/** The five substitutions named in §3.3.6. Every output character is a fixed point. */
function foldSmartPunctuation(value: string): string {
  return value
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/—/g, '--')
    .replace(/–/g, '-')
    .replace(/…/g, '...')
}

/** `undefined` means the edge of the document, which is a boundary for the same reason `</p>` is. */
function isWhitespaceBoundary(segment: Segment | undefined): boolean {
  if (segment === undefined) return true
  return segment.kind === 'tag' && WHITESPACE_BOUNDARY_TAGS.has(segment.name)
}

/**
 * Fold one engine's HTML to its equivalence-class representative, and report which rules fired.
 *
 * Pure, total, and idempotent: `fold(fold(x).text).text === fold(x).text`, asserted over the whole
 * test corpus. Idempotence is not a nicety — the folded text is what a certificate stores, and a
 * representative that moves when you re-derive it is not a representative.
 */
export function fold(html: string): FoldResult {
  const segments = scan(html)
  const fired = new Set<FoldRule>()
  const out: string[] = new Array<string>(segments.length)

  for (let k = 0; k < segments.length; k++) {
    const segment = segments[k]
    if (segment === undefined) continue

    if (segment.kind === 'opaque') {
      out[k] = segment.value
      continue
    }

    if (segment.kind === 'tag') {
      let value = segment.value
      if (!segment.closing && VOID_ELEMENTS.has(segment.name) && segment.voidCanonical !== value) {
        value = segment.voidCanonical
        fired.add('void-element-spelling')
      }
      const unprefixed = value.replace(USER_CONTENT_ID, '$1')
      if (unprefixed !== value) {
        fired.add('id-prefix')
        value = unprefixed
      }
      // An auto-generated heading anchor is navigation chrome, not the user's content. kramdown
      // emits `<h1 id="a-heading">` where commonmark.js and marked emit `<h1>`; without this,
      // EVERY heading in every document is a MUTATE on github-pages. Measured on `# A Heading`.
      //
      // This does NOT hide the `{#id}` finding, which is why it is safe against kill condition (1):
      // when a user writes `{#custom}`, the engines that do not consume it LEAK it as visible TEXT,
      // and the leak is in the text stream, not in this attribute. Verified in the fold tests.
      if (!segment.closing && HEADING_ELEMENTS.has(segment.name)) {
        const deanchored = value.replace(HEADING_ID_ATTR, '')
        if (deanchored !== value) {
          fired.add('heading-anchor-id')
          value = deanchored
        }
      }
      out[k] = value
      continue
    }

    let value = escapeText(decodeHTML(segment.value))
    if (value !== segment.value) fired.add('entity-decode')
    if (!segment.verbatim) {
      const smart = foldSmartPunctuation(value)
      if (smart !== value) {
        fired.add('smart-punctuation')
        value = smart
      }
    }
    out[k] = value
  }

  // Whitespace runs last because entity decoding CREATES collapsible whitespace: `&#32;` is a
  // space and `&NewLine;` is a newline, and both arrive from real documents.
  for (let k = 0; k < segments.length; k++) {
    const segment = segments[k]
    if (segment === undefined || segment.kind !== 'text' || segment.preserveSpace) continue
    const before = out[k] ?? ''
    let value = before.replace(COLLAPSIBLE, ' ')
    if (isWhitespaceBoundary(segments[k - 1])) value = value.replace(/^ /, '')
    if (isWhitespaceBoundary(segments[k + 1])) value = value.replace(/ $/, '')
    if (value !== before) fired.add('whitespace')
    out[k] = value
  }

  return {
    text: out.join(''),
    applied: FOLD_RULES.filter((rule) => fired.has(rule)),
  }
}

/**
 * Do two engines' outputs land in the same equivalence class?
 *
 * This is the whole of the `PASS` test. Everything it returns `false` for is a real finding that
 * the certificate must classify as STRIP, CORRUPT or VOID.
 */
export function foldEqual(a: string, b: string): boolean {
  return fold(a).text === fold(b).text
}

/** The stamp that travels with any verdict derived from `fold`. */
export function foldStamp(): string {
  return FOLD_VERSION
}
