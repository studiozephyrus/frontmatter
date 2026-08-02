/**
 * The verdict classifier — one (block, target) cell. (PLAN §3.3.5)
 *
 * Pure. No IO, no engine, no filesystem. It is handed a block's source, one engine's HTML for it,
 * optionally the spec oracle's HTML for it, and the versioned equivalence fold, and it returns a
 * `CellVerdict` carrying `before` and `after`.
 *
 * WHAT THE MEASUREMENTS FORCED
 *
 * 1. FOUR VERDICTS. `![[Some Note]]` -> `<p>![[Some Note]]</p>` on marked 16.4.2 AND on
 *    commonmark 0.31.2 (both reproduced this session). The payload was by reference and the
 *    reference never resolved, so it was never in the file. A three-valued matrix has no cell for
 *    that. A ```mermaid fence is NOT the same thing: marked 16.4.2 emits
 *    `<pre><code class="language-mermaid">graph TD\n  A--&gt;B\n</code></pre>` — the payload survives.
 *
 * 2. PASS MUST PROVE A NEGATIVE; ORACLE AGREEMENT IS NECESSARY, NOT SUFFICIENT. Measured this
 *    session: `## Heading {#custom}` renders as `<h2>Heading {#custom}</h2>` on marked 16.4.2 and
 *    BYTE-IDENTICALLY on commonmark 0.31.2. Both leak the attribute as visible text. A classifier
 *    that returned PASS on "the outputs are equal" would certify the 21/24 `{#id}` leak as clean.
 *    So the LEAK/VOID/DESTROY signals are computed first and PASS is gated on their absence,
 *    even though PASS is reported first in the ladder.
 *
 * 3. THE DESTROY TEST IS ASYMMETRIC, ON PURPOSE. The source side is characters an author typed;
 *    the rendered side is what a browser will show. So on the SOURCE side a known HTML element's
 *    tag and attribute NAMES are syntax (the author meant markup) while an UNKNOWN element is
 *    payload (`<cat>` is the plan's example — a browser deletes the tag and shows nothing). On the
 *    RENDERED side every tag is gone, and what remains is the folded visible text plus attribute
 *    values plus HTML-comment bodies. Without that asymmetry, `<div class="c">hi</div>` passing
 *    through untouched would report DESTROY on `div`/`class`, and `a <cat> b` -> `<p>a <cat> b</p>`
 *    would report PASS while the reader sees `a  b`.
 *
 * 4. MARKDOWN SYNTAX CHARACTERS ARE NOT DESTROYED CHARACTERS. `#`, `*`, `_`, backtick, `|`, `-`,
 *    `>` are not letters or digits, and the test only counts runs of `\p{L}\p{N}`. The alphanumeric
 *    constructs that DO legitimately vanish are enumerated and removed from the payload before the
 *    count: front matter, link reference definitions (invisible in 24/24 — the STRIP exemplar),
 *    fence info strings, reference-link labels, and character entity references. Getting this wrong
 *    makes every `# Heading` a false DESTROY, which is the failure mode this file exists to avoid.
 *
 * WHAT IT CANNOT DO, STATED RATHER THAN HIDDEN
 *   - MUTATE requires the oracle. With no `referenceRendered` there is no second output to differ
 *     from, and inferring "this should have been an <ol>" from a hand-written construct list is
 *     exactly the move §3.3.5 records as information-free. Without an oracle a structural mutation
 *     whose text survives is reported PASS.
 *   - LEAK covers only the three MEASURED carriers: front matter (visible in 23/24), `{#id}`
 *     (leaks in 21/24), HTML comment (visible escaped text in 2/24 — markdown-it 15 default and
 *     react-markdown 10 default). A fourth carrier is a finding, not a patch.
 *   - Structure that differs while the folded text is identical is PASS, because the fold is the
 *     named, versioned equivalence relation (§3.3.6) and inventing a second, unversioned one here
 *     would put two definitions of "equivalent" in the artifact.
 */

import type { CellVerdict, Verdict, VerdictClass } from './cert-contract'
import { decodeHTML } from 'entities'

export const VERDICT_VERSION = 'mdmax/verdict@1'

/** What the equivalence fold returns. `applied` travels into the cell so a PASS can be audited. */
export interface FoldOutput {
  readonly text: string
  readonly applied: readonly string[]
}

export interface ClassifyArgs {
  /** The block's markdown source. */
  readonly source: string
  /** The engine's HTML output for it. */
  readonly rendered: string
  /** The spec oracle's HTML output for it, when available. */
  readonly referenceRendered?: string
  readonly foldFn: (html: string) => FoldOutput
}

// ---------------------------------------------------------------- html element names

/**
 * The HTML element names, used only to decide whether a tag in the SOURCE is markup or payload.
 *
 * A name in this set means the author wrote markup, so its tag and attribute names are syntax and
 * only its attribute values and text are payload. A name outside it means the author typed
 * characters a browser will silently delete — `<cat>` in `a <cat> b` — and those characters are
 * payload whose disappearance is DESTROY.
 */
const KNOWN_HTML_ELEMENTS = new Set(
  (
    'a abbr address area article aside audio b base bdi bdo blockquote body br button canvas ' +
    'caption cite code col colgroup data datalist dd del details dfn dialog div dl dt em embed ' +
    'fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 head header hgroup hr html i iframe ' +
    'img input ins kbd label legend li link main map mark menu meta meter nav noscript object ol ' +
    'optgroup option output p param picture pre progress q rp rt ruby s samp script search section ' +
    'select slot small source span strong style sub summary sup table tbody td template textarea ' +
    'tfoot th thead time title tr track u ul var video wbr'
  ).split(' '),
)

/** A start or end tag with its attribute chunk captured. Quoted values may contain `>`. */
const TAG = /<\/?([a-zA-Z][a-zA-Z0-9-]*)((?:"[^"]*"|'[^']*'|[^>"'])*)\/?>/g
/** A quoted attribute value. */
const ATTR_VALUE = /=\s*(?:"([^"]*)"|'([^']*)')/g
const HTML_COMMENT = /<!--([\s\S]*?)-->/g

// ---------------------------------------------------------------- tokens

/**
 * A run of Unicode letters or digits. Deliberately NOT `\w`: `_` is markdown emphasis syntax and
 * must never count as a lost character.
 */
const TOKEN = /[\p{L}\p{N}]+/gu

/**
 * Put a raw-source string and folded rendered HTML into the SAME alphabet before comparing them.
 *
 * The fold escapes entities, substitutes smart punctuation and collapses whitespace, so a needle
 * taken verbatim from the source can never match a haystack that has been folded. Applying the
 * same normalisation to both is the only way `includes` means what it looks like it means.
 */
function comparable(text: string): string {
  return decodeHTML(text)
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\u2014/g, '--')
    .replace(/\u2013/g, '-')
    .replace(/\u2026/g, '...')
    .replace(/[ \t\n\r\f]+/g, ' ')
    .trim()
}

function tokenCounts(text: string): Map<string, number> {
  const counts = new Map<string, number>()
  for (const match of text.matchAll(TOKEN)) {
    const token = match[0]
    counts.set(token, (counts.get(token) ?? 0) + 1)
  }
  return counts
}

// ---------------------------------------------------------------- source side

/**
 * Remove the constructs whose alphanumeric characters vanish on EVERY engine by design. Their
 * disappearance is the specified behaviour, not corruption, and leaving them in would make the
 * STRIP exemplar — a tail-placed orphan link reference definition, 0 bytes of HTML in 24/24 —
 * report DESTROY on `orphan`, `example`, `com` and `Title`.
 */
function stripByDesignConstructs(source: string): string {
  return (
    source
      // YAML front matter. Consumed upstream of the engine by Hugo, Docusaurus, Astro, Eleventy
      // and Jekyll; when it is NOT consumed it LEAKs, which is a separate branch below.
      .replace(/^---[ \t]*\r?\n[\s\S]*?\r?\n---[ \t]*(?:\r?\n|$)/, '')
      // Link reference definitions: invisible in 24/24.
      .replace(/^[ \t]{0,3}\[[^\]\n]+\]:[^\n]*$/gm, '')
      // Fence info strings. Most engines re-emit them as `class="language-x"`, but an engine that
      // drops the class is dropping a hint, not the author's content.
      .replace(/^([ \t]{0,3}(?:`{3,}|~{3,}))[^\n]*$/gm, '$1')
      // Reference-link labels: `[text][label]` -> `[text]`. The label names a definition; only the
      // resolved destination reaches the output.
      .replace(/\]\[[^\]\n]*\]/g, ']')
      // Character entity references. `&nbsp;` may arrive as `&nbsp;` or as U+00A0 depending on the
      // engine, and `nbsp` is not a word the author wrote.
      .replace(/&(?:#\d+|#[xX][0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]*);/g, ' ')
      // ORDERED-LIST MARKERS. `1.` and `2)` become the <ol>'s implicit numbering, so their digits
      // are SUPPOSED to disappear from the text. Without this, `1. one\n2. two` reports
      // CORRUPT/DESTROY with missing tokens ["1","2"] on every target — and on a 40-file corpus
      // sweep, 66 of 66 missing tokens across every DESTROY cell were pure digits. The entire
      // DESTROY class was false positives. The header note warns that getting this wrong makes
      // every heading a false DESTROY; headings were handled and ordered lists were not.
      .replace(/^([ \t]*)\d{1,9}[.)]([ \t])/gm, '$1$2')
      // Task-list checkboxes: GFM turns `[x]` into `<input checked>`, so the `x` is an attribute,
      // not text. `- [x] done` was reporting DESTROY with missing token ["x"].
      .replace(/^([ \t]*[-*+][ \t]+)\[[ xX]\]/gm, '$1')
  )
}

/**
 * Reduce known-element markup in the SOURCE to its attribute values, leaving unknown-element tags
 * verbatim. See header note 3 for why this side is not symmetric with the rendered side.
 */
function reduceSourceMarkup(source: string): string {
  return source.replace(TAG, (whole, name: string, attrs: string) => {
    if (!KNOWN_HTML_ELEMENTS.has(name.toLowerCase())) return whole
    const values: string[] = []
    for (const m of attrs.matchAll(ATTR_VALUE)) values.push(m[1] ?? m[2] ?? '')
    return ` ${values.join(' ')} `
  })
}

/** The characters of the block that an author would expect to still be able to read. */
export function extractPayload(source: string): string {
  return reduceSourceMarkup(stripByDesignConstructs(source))
}

/**
 * The source with fenced blocks and code spans removed. Every leak and by-reference test runs
 * against this: a `{#id}` or a `<!-- -->` inside a code span is SUPPOSED to be visible, and
 * reporting it as a leak would be a false CORRUPT on every document that documents markdown.
 */
function outsideCode(source: string): string {
  return (
    source
      .replace(/^[ \t]{0,3}(`{3,}|~{3,})[^\n]*\n[\s\S]*?^[ \t]{0,3}\1[^\n]*$/gm, '')
      // INDENTED CODE BLOCKS. Indented code is code by the same CommonMark rule that makes a fence
      // code, and it was missing here. Measured: `Example:\n\n    ![[Some Note]]\n` reported VOID,
      // and `    ## Heading {#custom}` reported CORRUPT/LEAK, on documents whose only crime is
      // showing markdown as an example — which every README and every doc in this repo does. The
      // fenced equivalents correctly returned PASS, so the two halves of the grammar disagreed.
      .replace(/^(?: {4}|\t)[^\n]*$/gm, '')
      .replace(/(`+)[\s\S]*?\1/g, ' ')
  )
}

// ---------------------------------------------------------------- rendered side

/** HTML comments removed, so "is this string visible?" cannot be answered by a comment. */
function withoutComments(html: string): string {
  return html.replace(HTML_COMMENT, '')
}

/**
 * Everything on the rendered side that still carries the author's characters: the folded visible
 * text, plus attribute values (an `href` or an `id` is not visible but the characters did survive),
 * plus HTML-comment bodies (a preserved comment is invisible BY DESIGN — that is STRIP; a DELETED
 * comment is the github-blob behaviour, 5 standalone `<!--` lines in the nodejs/node README and 0
 * in the 91,223-byte rendered blob, and that is DESTROY).
 */
export function renderedHaystack(rendered: string, foldedText: string): string {
  // TAGS MUST BE STRIPPED, and this was wrong first. `foldedText` is folded HTML, markup included,
  // so `<p>Array<string></p>` still contained the token `string` — supplied by the `<string>` TAG
  // the browser silently drops. The plan's own DESTROY exemplar therefore reported PASS, and on a
  // 40-file sweep 10 of 15 blocks containing an unknown element did too. It survived review because
  // the unit tests inject a fold that strips tags while production does not: a producer/consumer
  // mismatch (LR#59), and the reason a test double must match what actually ships.
  //
  // Attribute values and comment bodies are re-added SEPARATELY below, because there the author's
  // characters genuinely did survive somewhere a reader or a tool can reach them.
  const parts: string[] = [foldedText.replace(TAG_ANY, ' ')]
  for (const m of rendered.matchAll(ATTR_VALUE)) parts.push(m[1] ?? m[2] ?? '')
  for (const m of rendered.matchAll(HTML_COMMENT)) parts.push(m[1] ?? '')
  return parts.join(' ')
}

/** Any tag, well-formed or not. Used only to reduce rendered HTML to its visible text. */
const TAG_ANY = /<\/?[a-zA-Z][^>]*>/g

/** Tokens the author wrote that no longer exist anywhere the reader or a tool can reach them. */
export function missingPayloadTokens(payload: string, haystack: string): string[] {
  const have = tokenCounts(haystack)
  const missing: string[] = []
  for (const [token, wanted] of tokenCounts(payload)) {
    if ((have.get(token) ?? 0) < wanted) missing.push(token)
  }
  return missing
}

/**
 * The block produced no HTML at all. Not the same as "the folded text is empty": an image or an
 * `<hr>` produces no text and is still output, and calling that STRIP would be a false degradation
 * on every figure in every document.
 */
export function producesNoOutput(rendered: string): boolean {
  return withoutComments(rendered).replace(/\s+/g, '') === ''
}

// ---------------------------------------------------------------- signals

/**
 * By-reference payloads whose reference did not resolve, as the literal syntax the reader is left
 * looking at. Restricted to wiki embeds/links and the EXPLICIT two-bracket reference form. The
 * shortcut form `[label]` is deliberately excluded: `[TODO] finish this` is ordinary prose in every
 * corpus, and treating it as an unresolved reference would VOID it.
 */
function unresolvedReferences(source: string): string[] {
  const clean = outsideCode(source)
  const out: string[] = []
  for (const m of clean.matchAll(/!?\[\[[^\]\n]+\]\]/g)) out.push(m[0])
  for (const m of clean.matchAll(/!?\[[^\][\n]*\]\[([^\]\n]*)\]/g)) {
    const label = (m[1] ?? '').trim()
    const defined = new RegExp(
      `^[ \\t]{0,3}\\[${label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\]:`,
      'mi',
    ).test(source)
    if (!defined) out.push(m[0])
  }
  return out
}

/**
 * The three MEASURED leak carriers, each with its bench frequency. A leak is only a leak if the
 * string is visible in the folded text AND survives in the rendered HTML outside any comment —
 * the second half is there so that a fold which turns a real `<!-- -->` into text cannot make this
 * function report a leak that no reader would ever see.
 */
function leakedCarrier(source: string, rendered: string, foldedText: string): string | undefined {
  // THE NEEDLE AND THE HAYSTACK MUST BE NORMALISED THE SAME WAY, and this was wrong first. The
  // needle is raw source; the haystack has been through the fold, which escapes `& < > " '`,
  // substitutes smart punctuation and collapses whitespace. So a plain `includes` matched
  // `title: Plain` and missed `title: "Getting Started"` — the single most idiomatic YAML front
  // matter form there is. Measured: that, `title: Tom & Jerry`, `title: A < B`, `title: a—b` and
  // `title: a  b` ALL reported PASS while sitting in plain sight on the rendered page. It silently
  // zeroed the highest-frequency finding in the plan (front matter, visible in 23 of 24).
  const visibleHtml = comparable(withoutComments(rendered))
  const haystack = comparable(foldedText)
  const isVisible = (raw: string): boolean => {
    const needle = comparable(raw)
    return needle.length > 0 && haystack.includes(needle) && visibleHtml.includes(needle)
  }

  // Front matter: VISIBLE in 23 of 24 bench configurations. Measured this session on marked 16.4.2:
  // `---\ntitle: Hello\n---\n` -> `<hr>\n<h2>title: Hello</h2>\n`.
  const fm = /^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/.exec(source)
  if (fm) {
    for (const line of (fm[1] ?? '').split('\n')) {
      const trimmed = line.trim()
      // Three characters is the floor at which a front-matter line stops being able to collide
      // with an incidental fragment of prose.
      if (trimmed.length >= 3 && isVisible(trimmed)) return trimmed
    }
  }

  const clean = outsideCode(source)

  // `{#id}` heading attributes: LEAK as literal text in 21 of 24. Only kramdown x2 and
  // pulldown-cmark with ENABLE_HEADING_ATTRIBUTES consume them. Measured this session:
  // `## Heading {#custom}` -> `<h2>Heading {#custom}</h2>` on marked 16.4.2 AND on
  // commonmark 0.31.2, versus `<h2 id="custom">Heading</h2>` on kramdown 2.5.2 + GFM 1.1.0.
  for (const m of clean.matchAll(/\{#[^}\s]+\}/g)) if (isVisible(m[0])) return m[0]

  // HTML comments: visible escaped text in 2 of 24. Measured this session on markdown-it 15.0.0 at
  // its default `html:false`: `<!-- note -->` -> `<p>&lt;!-- note --&gt;</p>`.
  for (const m of clean.matchAll(HTML_COMMENT)) {
    const body = (m[1] ?? '').trim()
    if (isVisible(body)) return body
  }

  return undefined
}

// ---------------------------------------------------------------- the ladder

function cell(
  verdict: Verdict,
  before: string,
  after: string,
  applied: readonly string[],
  cls?: VerdictClass,
): CellVerdict {
  return cls === undefined
    ? { verdict, before, after, foldApplied: applied }
    : { verdict, class: cls, before, after, foldApplied: applied }
}

/**
 * Classify one (block, target) cell.
 *
 * `foldFn` is NOT wrapped in a try/catch. A fold that throws is a bench defect, not a user
 * document, and returning a verdict derived from a fold that did not run would put a measurement
 * in the artifact that was never measured. The runner owns that refusal: `CertFailure` has
 * `ENGINE_THREW` for it, and `CellVerdict` has no cell for "unknown" by design (contract rule 2).
 */
export function classify(args: ClassifyArgs): CellVerdict {
  const { source, rendered, referenceRendered, foldFn } = args

  const folded = foldFn(rendered)
  const applied = folded.applied
  const before = source
  const after = folded.text

  const payload = extractPayload(source)
  const missing = missingPayloadTokens(payload, renderedHaystack(rendered, folded.text))
  const voids = unresolvedReferences(source).filter((literal) => folded.text.includes(literal))
  const leak = leakedCarrier(source, rendered, folded.text)
  const vanished = source.trim() !== '' && producesNoOutput(rendered)
  // Folded once, not once per branch: the fold is the expensive part of a cell and calling it
  // twice on the same HTML would double the cost of every certified block.
  const referenceText = referenceRendered === undefined ? undefined : foldFn(referenceRendered).text

  // 1. PASS. With an oracle this is agreement after the fold; without one it is only "every
  //    character the author wrote is still reachable", which is strictly weaker and cannot see a
  //    structural mutation. Either way it is gated on the three signals below, because measured
  //    this session both marked 16.4.2 and the commonmark 0.31.2 spec oracle leak `{#custom}`
  //    identically — equality alone would certify that leak as clean.
  if (voids.length === 0 && leak === undefined && missing.length === 0 && !vanished) {
    const equivalent = referenceText === undefined ? true : folded.text === referenceText
    if (equivalent) return cell('PASS', before, after, applied)
  }

  // 2. VOID. The payload was by reference, the reference did not resolve, and the reader is left
  //    looking at the reference syntax. Measured: `![[Some Note]]` -> `<p>![[Some Note]]</p>` on
  //    marked 16.4.2. Contrast a ```mermaid fence, whose payload is present inside the <pre> and
  //    which therefore never reaches this branch.
  if (voids.length > 0) return cell('VOID', before, after, applied)

  // 3. LEAK. Metadata the author never intended a reader to see became visible text.
  if (leak !== undefined) return cell('CORRUPT', before, after, applied, 'LEAK')

  // 4. DESTROY. A character the author typed is reachable nowhere in the output — not in the
  //    visible text, not in an attribute value, not in a preserved comment.
  if (missing.length > 0) return cell('CORRUPT', before, after, applied, 'DESTROY')

  // 5. MUTATE. Every character survived and the block still produced output, but it is not the
  //    structure the oracle produced. Measured: `1) first\n2) second` -> `<p>1) first\n2) second</p>`
  //    on kramdown 2.5.2 + kramdown-parser-gfm 1.1.0 at Jekyll's `hard_wrap: false`, against
  //    `<ol>\n<li>first</li>\n<li>second</li>\n</ol>` on commonmark 0.31.2, marked 16.4.2 and
  //    markdown-it 15.0.0. Requires output to exist: a block that produced nothing has no structure
  //    to differ, and is STRIP or DESTROY, never MUTATE.
  if (referenceText !== undefined && !vanished && folded.text !== referenceText)
    return cell('CORRUPT', before, after, applied, 'MUTATE')

  // 6. STRIP. Output differs, the payload is invisible, and no source character was lost. The
  //    exemplar is a tail-placed orphan link reference definition: 0 bytes of HTML in 24/24.
  return cell('STRIP', before, after, applied)
}
