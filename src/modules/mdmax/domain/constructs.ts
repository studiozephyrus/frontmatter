/**
 * LAYER 1 — THE CONSTRUCT CORPUS. (PLAN §3.3.5 Layer 1, §3.3.9)
 *
 * WHY MINIMAL PAIRS AND NOT WHOLE FILES
 * A 300-file whole-file correlation run reported "100% divergent" for every feature, because every
 * feature co-occurred with every other one. That number is information-free: it cannot attribute a
 * divergence to a cause. Attribution requires isolation, so every entry here is the smallest
 * document that exhibits exactly one construct.
 *
 * WHY `detect` MUST BE CONSERVATIVE
 * A `<!-- -->` inside a fenced code block is content, not a construct occurrence. Counting it
 * inflates the frequency histogram that PLAN §3.3.10 kill-condition 4 is decided on — the one that
 * asks whether >80% of BROKEN verdicts come from fewer than five constructs. Every detector here
 * therefore runs behind a skip mask covering fenced code, inline code spans, and front matter, and
 * drops any candidate that overlaps it at all.
 *
 * WHAT `detect` RETURNS
 * UTF-8 BYTE ranges, half-open `[start, end)`, sorted and non-overlapping — the unit `CertBlock`
 * uses. Scanning happens in UTF-16 code units (the canonical internal unit per `offsets.ts`) and
 * conversion happens in exactly one place, `OffsetMap`, as that file requires. Only 67 of 1,080
 * corpus files have `bytes == UTF-16 units`, so the two are never interchangeable.
 *
 * PROVENANCE HONESTY
 * §3.3.9 says to build Layer 1 on an existing suite's fixtures rather than a hand-written list,
 * because a hand-written list is exactly what missed the tilde case. This repo has NO local copy of
 * `spec.txt`, `karlcow/markdown-testsuite`, or `ArchieCur/MARKDOWN_FLAVORS` — I checked
 * `node_modules` for shipped spec fixtures and found none, and I did not download any. So no entry
 * below claims a suite it was copied from. What each `provenance` states instead is exactly what
 * was done: which spec DEFINES the syntax, and whether the fixture's behaviour was verified against
 * a locally installed engine. Several entries are honestly marked `invented`. Replacing them with
 * real suite fixtures is the single highest-value follow-up on this file.
 */

import type { Construct } from './cert-contract'
import { OffsetMap, unsafeU16 } from './offsets'

/** A half-open range. Meaning depends on position: U16 inside this file, BYTES on the way out. */
type Range = readonly [number, number]

// ---------------------------------------------------------------- document scan (cached)

interface Fence {
  /** U16 offset of the first character of the opening fence line. */
  readonly start: number
  /** U16 offset one past the last character of the closing fence line (newline excluded). */
  readonly end: number
  /** The info string, verbatim. Empty when the fence declares no language. */
  readonly info: string
}

interface DocScan {
  readonly text: string
  readonly map: OffsetMap
  /** U16 offset of the first character of each line. */
  readonly lineStarts: readonly number[]
  readonly fences: readonly Fence[]
  /** Front matter, or null. Never part of any other construct's territory. */
  readonly frontMatter: Range | null
  /** Regions where a construct-shaped string is content, not a construct. */
  readonly skip: readonly Range[]
  /** GFM tables, needed so a table's own `|` is not counted as a pipe in prose. */
  readonly tables: readonly Range[]
}

/**
 * Single-slot cache. A cert sweep asks all CONSTRUCTS.length detectors about the same document in
 * sequence, so one slot hits on every call after the first and turns 20 O(n) scans into one. This
 * is arithmetic, not a profile — I did not measure it.
 */
let cachedText: string | null = null
let cachedScan: DocScan | null = null

function analyse(text: string): DocScan {
  if (cachedText === text && cachedScan !== null) return cachedScan
  const scan = buildScan(text)
  cachedText = text
  cachedScan = scan
  return scan
}

function buildScan(text: string): DocScan {
  const lineStarts = computeLineStarts(text)
  const frontMatter = scanFrontMatter(text, lineStarts)
  const fences = scanFences(text, lineStarts, frontMatter)
  const codeSpans = scanCodeSpans(text, fences, frontMatter)
  const skip = merge([...fences.map((f): Range => [f.start, f.end]), ...codeSpans, ...(frontMatter ? [frontMatter] : [])])
  const tables = scanTables(text, lineStarts, skip)
  return { text, map: new OffsetMap(text), lineStarts, fences, frontMatter, skip, tables }
}

function computeLineStarts(text: string): number[] {
  const starts = [0]
  for (let i = 0; i < text.length; i++) if (text.charCodeAt(i) === 10) starts.push(i + 1)
  return starts
}

/** The line's content with the terminator removed. CRLF is not normalised — offsets must survive. */
function lineAt(text: string, lineStarts: readonly number[], i: number): string {
  const start = lineStarts[i]
  if (start === undefined) return ''
  const next = lineStarts[i + 1]
  const end = next === undefined ? text.length : next - 1
  const raw = text.slice(start, end)
  return raw.endsWith('\r') ? raw.slice(0, -1) : raw
}

function lineEnd(text: string, lineStarts: readonly number[], i: number): number {
  const next = lineStarts[i + 1]
  if (next === undefined) return text.length
  const end = next - 1
  return end > 0 && text.charCodeAt(end - 1) === 13 ? end - 1 : end
}

// ---------------------------------------------------------------- front matter, fences, code spans

const FM_CLOSE = /^(?:---|\.\.\.)[ \t]*$/

/**
 * Front matter only exists at offset 0. A `---` anywhere else is a thematic break or a setext
 * underline, and treating it as front matter would swallow the document.
 */
function scanFrontMatter(text: string, lineStarts: readonly number[]): Range | null {
  if (lineAt(text, lineStarts, 0) !== '---') return null
  for (let i = 1; i < lineStarts.length; i++) {
    if (FM_CLOSE.test(lineAt(text, lineStarts, i))) return [0, lineEnd(text, lineStarts, i)]
  }
  // An unterminated opener is a thematic break followed by prose, not front matter.
  return null
}

const FENCE_OPEN = /^ {0,3}(`{3,}|~{3,})[ \t]*(.*)$/

function scanFences(text: string, lineStarts: readonly number[], frontMatter: Range | null): Fence[] {
  const out: Fence[] = []
  const fmEndLine = frontMatter ? lineIndexOf(lineStarts, frontMatter[1]) : -1
  for (let i = fmEndLine + 1; i < lineStarts.length; i++) {
    const m = FENCE_OPEN.exec(lineAt(text, lineStarts, i))
    const marker = m?.[1]
    if (marker === undefined) continue
    const info = (m?.[2] ?? '').trim()
    // A backtick fence's info string may not contain a backtick — CommonMark forbids it so that
    // `` `foo` `` on its own line is a code span, not a fence.
    if (marker.startsWith('`') && info.includes('`')) continue
    const char = marker[0] ?? '`'
    const close = new RegExp(`^ {0,3}\\${char}{${marker.length},}[ \\t]*$`)
    let end = text.length
    let j = i + 1
    for (; j < lineStarts.length; j++) {
      if (close.test(lineAt(text, lineStarts, j))) {
        end = lineEnd(text, lineStarts, j)
        break
      }
    }
    // An unclosed fence runs to the end of the document. That is CommonMark's rule, and it is also
    // the conservative choice: everything after it is masked rather than mis-attributed.
    out.push({ start: lineStarts[i] ?? 0, end, info })
    i = j
  }
  return out
}

function lineIndexOf(lineStarts: readonly number[], offset: number): number {
  let lo = 0
  let hi = lineStarts.length - 1
  let ans = 0
  while (lo <= hi) {
    const mid = (lo + hi) >> 1
    if ((lineStarts[mid] ?? 0) <= offset) {
      ans = mid
      lo = mid + 1
    } else hi = mid - 1
  }
  return ans
}

/**
 * Inline code spans, CommonMark rule: a run of N backticks opens, and only a run of EXACTLY N
 * backticks closes. An unmatched run is literal text and is not masked.
 */
function scanCodeSpans(text: string, fences: readonly Fence[], frontMatter: Range | null): Range[] {
  const blocked: Range[] = merge([...fences.map((f): Range => [f.start, f.end]), ...(frontMatter ? [frontMatter] : [])])
  const out: Range[] = []
  let i = 0
  // `b` is a cursor into the sorted blocked list, not a search. A `find` per character makes this
  // O(chars x fences), which at the 4 MB shape-gate ceiling is a hang rather than a slow scan.
  let b = 0
  while (i < text.length) {
    while (b < blocked.length && (blocked[b]?.[1] ?? 0) <= i) b++
    const current = blocked[b]
    if (current && i >= current[0]) {
      i = current[1]
      continue
    }
    if (text.charCodeAt(i) !== 96) {
      i++
      continue
    }
    let n = 0
    while (i + n < text.length && text.charCodeAt(i + n) === 96) n++
    let j = i + n
    let closed = -1
    while (j < text.length) {
      if (text.charCodeAt(j) !== 96) {
        j++
        continue
      }
      let k = 0
      while (j + k < text.length && text.charCodeAt(j + k) === 96) k++
      if (k === n) {
        closed = j + k
        break
      }
      j += k
    }
    if (closed < 0) {
      i += n
      continue
    }
    out.push([i, closed])
    i = closed
  }
  return out
}

// ---------------------------------------------------------------- tables

const TABLE_DELIM = /^ {0,3}\|?[ \t]*:?-+:?[ \t]*(?:\|[ \t]*:?-+:?[ \t]*)+\|?[ \t]*$/

function scanTables(text: string, lineStarts: readonly number[], skip: readonly Range[]): Range[] {
  const out: Range[] = []
  for (let i = 1; i < lineStarts.length; i++) {
    const start = lineStarts[i - 1] ?? 0
    if (overlapsAny([start, start + 1], skip)) continue
    if (!TABLE_DELIM.test(lineAt(text, lineStarts, i))) continue
    const header = lineAt(text, lineStarts, i - 1)
    if (header.trim() === '' || !header.includes('|')) continue
    let j = i
    while (j + 1 < lineStarts.length && lineAt(text, lineStarts, j + 1).trim() !== '') j++
    out.push([start, lineEnd(text, lineStarts, j)])
    i = j
  }
  return out
}

// ---------------------------------------------------------------- range algebra

function overlapsAny(r: Range, ranges: readonly Range[]): boolean {
  for (const [s, e] of ranges) if (r[0] < e && s < r[1]) return true
  return false
}

function merge(ranges: readonly Range[]): Range[] {
  const sorted = [...ranges].sort((a, b) => a[0] - b[0] || a[1] - b[1])
  const out: Range[] = []
  for (const r of sorted) {
    const last = out[out.length - 1]
    if (last && r[0] <= last[1]) out[out.length - 1] = [last[0], Math.max(last[1], r[1])]
    else out.push(r)
  }
  return out
}

/**
 * UTF-16 → UTF-8. `unsafeU16` is sound here because every pattern in this file anchors its match
 * boundaries on ASCII delimiters (`<`, `|`, `~`, `$`, `[`, backtick, line starts), so no range edge
 * can land inside a surrogate pair.
 */
function toBytes(map: OffsetMap, ranges: readonly Range[]): Range[] {
  return merge(ranges).map(([s, e]): Range => [map.toByte(unsafeU16(s)), map.toByte(unsafeU16(e))])
}

/** Wrap a U16 scanner into a detector: mask-filter, merge, convert. */
function detector(scan: (ctx: DocScan) => Range[]): (markdown: string) => readonly Range[] {
  return (markdown) => {
    const ctx = analyse(markdown)
    return toBytes(
      ctx.map,
      scan(ctx).filter((r) => r[1] > r[0] && !overlapsAny(r, ctx.skip)),
    )
  }
}

/** For constructs that ARE the masked region (front matter, fences) — the mask must not eat them. */
function rawDetector(scan: (ctx: DocScan) => Range[]): (markdown: string) => readonly Range[] {
  return (markdown) => {
    const ctx = analyse(markdown)
    return toBytes(
      ctx.map,
      scan(ctx).filter((r) => r[1] > r[0]),
    )
  }
}

function matches(text: string, re: RegExp, group = 0): Range[] {
  const out: Range[] = []
  const rx = new RegExp(re.source, re.flags.includes('g') ? re.flags : `${re.flags}g`)
  for (const m of text.matchAll(rx)) {
    if (m.index === undefined) continue
    const whole = m[0]
    if (group === 0) {
      out.push([m.index, m.index + whole.length])
      continue
    }
    const sub = m[group]
    if (sub === undefined) continue
    const at = whole.indexOf(sub)
    if (at < 0) continue
    out.push([m.index + at, m.index + at + sub.length])
  }
  return out
}

// ---------------------------------------------------------------- name tables

/**
 * Element names excluded from `angle-bracket-text`. `<div>` in a document is intentional HTML and
 * belongs to a different construct; `<string>` and `<cat>` are prose that a sanitising renderer
 * deletes. Both measured examples in PLAN §3.3 (`Array<string>` -> `Array`, `<cat>` deleted) have
 * non-element tag names, so excluding real elements keeps the two cases and drops the noise.
 */
const HTML_ELEMENTS = new Set(
  (
    'a abbr address area article aside audio b base bdi bdo big blockquote body br button canvas ' +
    'caption center cite code col colgroup data datalist dd del details dfn dialog dir div dl dt ' +
    'em embed fieldset figcaption figure font footer form frame frameset h1 h2 h3 h4 h5 h6 head ' +
    'header hgroup hr html i iframe img input ins kbd label legend li link main map mark menu meta ' +
    'meter nav noscript object ol optgroup option output p param picture pre progress q rp rt ruby ' +
    's samp script section select slot small source span strike strong style sub summary sup table ' +
    'tbody td template textarea tfoot th thead time title tr track tt u ul var video wbr'
  ).split(' '),
)

/**
 * Languages a renderer is expected to recognise. Anything else is `unknown-fence-lang` — the
 * ADDITIVE case: measured on `marked` 16.4.2, a ```mermaid fence renders as
 * `<pre><code class="language-mermaid">graph TD;\n  A--&gt;B;\n</code></pre>` — the payload is
 * intact in the output, which is precisely why it is not VOID.
 */
const KNOWN_FENCE_LANGS = new Set(
  (
    'bash c cjs clojure cmake cofee console cpp cs csharp css csv dart diff dockerfile elixir elm ' +
    'erlang fish go graphql groovy haskell hcl html http ini java javascript jsx json json5 julia ' +
    'kotlin latex less lisp lua make makefile markdown md mjs nginx nix objc ocaml perl php plain ' +
    'plaintext powershell prisma prolog proto protobuf ps1 python py r rb regex rs ruby rust sass ' +
    'scala scheme scss sh shell sql svelte swift terraform tex text toml ts tsx typescript vim vue ' +
    'xml yaml yml zig zsh'
  ).split(' '),
)

// ---------------------------------------------------------------- the corpus

/**
 * Every entry is a minimal pair. `source` is the smallest document that exhibits the construct;
 * `detect` finds it in a real one. The invariant the test suite enforces: every construct's own
 * `detect` must find its own `source`, or the pair and the detector disagree about what the
 * construct is.
 */
export const CONSTRUCTS: readonly Construct[] = [
  {
    id: 'yaml-frontmatter',
    label: 'YAML front matter',
    source: '---\ntitle: Note\n---\n\nBody.\n',
    provenance:
      'invented — front matter is in no markdown spec; the delimiter shape is Jekyll/Hugo convention. ' +
      'PLAN §3.3 records it VISIBLE in 23 of 24 bench configurations (LEAK).',
    detect: rawDetector((ctx) => (ctx.frontMatter ? [ctx.frontMatter] : [])),
  },
  {
    id: 'html-comment',
    label: 'HTML comment',
    source: '<!-- a comment -->\n',
    provenance:
      'syntax per CommonMark 0.31.2 HTML-block condition 2; fixture written here, not copied — this ' +
      'repo ships no spec.txt. Measured locally: marked 16.4.2 and commonmark 0.31.2 both emit it ' +
      'verbatim as raw HTML. PLAN §3.3: visible escaped text in 2 of 24, DELETED by GitHub blob.',
    detect: detector((ctx) => matches(ctx.text, /<!--[\s\S]*?-->/g)),
  },
  {
    id: 'heading-attribute',
    label: 'kramdown/Pandoc heading id attribute',
    source: '# Title {#custom-id}\n',
    provenance:
      'invented — syntax is kramdown 2.5.2 inline attribute lists, also Pandoc heading identifiers. ' +
      'Measured locally: marked 16.4.2 and commonmark 0.31.2 both render `<h1>Title {#custom-id}</h1>` ' +
      '— the attribute LEAKS as literal text, matching PLAN §3.3 (21 of 24).',
    // Not restricted to heading lines: kramdown's IAL attaches to any block, and restricting the
    // detector to `#` lines would under-count the same leak wherever else it appears.
    detect: detector((ctx) => matches(ctx.text, /\{#[A-Za-z][A-Za-z0-9_:.-]*\}(?=[ \t]*$)/gm)),
  },
  {
    id: 'link-ref-definition',
    label: 'orphan link reference definition',
    source: '[orphan]: https://example.com "Title"\n',
    provenance:
      'syntax per CommonMark 0.31.2 link reference definitions; fixture written here. Measured ' +
      'locally: marked 16.4.2 and commonmark 0.31.2 both emit "" — 0 bytes of HTML, the STRIP case ' +
      'PLAN §3.3.5 records as invisible in 24/24.',
    detect: detector((ctx) =>
      matches(ctx.text, /^ {0,3}\[([^\]\n]+)\]:[ \t]*[^\s\n]+[^\n\r]*$/gm).filter(([s, e]) => {
        const line = ctx.text.slice(s, e)
        const label = /^ {0,3}\[([^\]\n]+)\]:/.exec(line)?.[1] ?? ''
        // `[//]:` is the comment idiom and `[^x]:` is a footnote definition. Both are separate
        // constructs with different verdicts; folding them in here would hide two of the three.
        return label !== '//' && !label.startsWith('^')
      }),
    ),
  },
  {
    id: 'link-ref-idiom',
    label: 'the [//]: # comment idiom',
    source: '[//]: # (this is a comment)\n',
    provenance:
      'invented — a community idiom for "a markdown comment", not in any spec. Measured locally: ' +
      'marked 16.4.2 and commonmark 0.31.2 both emit "". PLAN §3.3: invisible in 24/24, but it does ' +
      'NOT survive a write, which is why it is a separate id from link-ref-definition.',
    detect: detector((ctx) => matches(ctx.text, /^ {0,3}\[\/\/\]:[ \t]*[^\n\r]*$/gm)),
  },
  {
    id: 'angle-bracket-text',
    label: 'angle-bracketed prose token',
    source: 'A value of Array<string> here.\n',
    provenance:
      "from this project's own measured histogram — PLAN §3.3.10 names angle brackets as one of the " +
      'six constructs accounting for most BROKEN verdicts. Measured locally: marked 16.4.2 and ' +
      'commonmark 0.31.2 both pass `<string>` through RAW, so the DESTROY (`Array<string>` -> ' +
      '`Array`) is the downstream sanitiser on github-blob, not the parser. I did not probe that.',
    detect: detector((ctx) =>
      matches(ctx.text, /(?<!\\)<([A-Za-z][A-Za-z0-9]*(?:[._-][A-Za-z0-9]+)*)>/g).filter(([s, e]) => {
        const name = ctx.text.slice(s + 1, e - 1).toLowerCase()
        return !HTML_ELEMENTS.has(name)
      }),
    ),
  },
  {
    id: 'lone-tilde',
    label: 'single tilde in prose',
    source: 'Roughly ~5 files and ~10 more.\n',
    provenance:
      'found by the Layer-3 differential run, NOT by any hand-written construct list — PLAN §3.3.5. ' +
      'It is in this corpus because it was missed by a list exactly like this one.',
    detect: detector((ctx) => matches(ctx.text, /(?<![~\\])~(?!~)/g)),
  },
  {
    id: 'pipe-in-prose',
    label: 'pipe character outside a table',
    source: 'Use a | b for alternation.\n',
    provenance:
      "from this project's own measured histogram — PLAN §3.3.10 lists pipe-in-prose among the six " +
      'constructs accounting for most BROKEN verdicts.',
    detect: detector((ctx) =>
      // A table's own pipes are structure, not prose. Counting them would make pipe-in-prose the
      // most frequent construct in any document containing one table, which is a measurement bug.
      matches(ctx.text, /(?<!\\)\|/g).filter((r) => !overlapsAny(r, ctx.tables)),
    ),
  },
  {
    id: 'paren-ordered-list',
    label: 'ordered list with a paren delimiter',
    source: '1) first\n2) second\n',
    provenance:
      'syntax per CommonMark 0.31.2 list items (both `.` and `)` are ordered-list delimiters); ' +
      'fixture written here. Measured locally: marked 16.4.2 and commonmark 0.31.2 both produce ' +
      '`<ol><li>first</li>…`. PLAN §3.3.5 records kramdown MUTATing it to a paragraph; I did not ' +
      'run kramdown, so that half is quoted, not verified.',
    detect: detector((ctx) => matches(ctx.text, /^ {0,3}\d{1,9}\)(?=[ \t])/gm)),
  },
  {
    id: 'wikilink',
    label: 'wiki-style link',
    source: '[[Some Note]]\n',
    provenance:
      'invented — Obsidian/Roam syntax, in no markdown spec. Measured locally: marked 16.4.2 and ' +
      'commonmark 0.31.2 both render `<p>[[Some Note]]</p>` — the brackets LEAK as literal text.',
    detect: detector((ctx) => matches(ctx.text, /(?<![!\\])\[\[[^[\]\n]+\]\]/g)),
  },
  {
    id: 'wikilink-embed',
    label: 'wiki-style transclusion (the VOID case)',
    source: '![[Some Note]]\n',
    provenance:
      'invented — Obsidian transclusion syntax. Measured locally and this is the load-bearing one: ' +
      'marked 16.4.2 renders `![[Some Note]]` as `<p>![[Some Note]]</p>`, byte-for-byte the PLAN ' +
      '§3.3.5 VOID example. The payload was BY REFERENCE and never entered the file, so no fold and ' +
      'no renderer can recover it. Contrast unknown-fence-lang, whose payload is present.',
    detect: detector((ctx) => matches(ctx.text, /(?<!\\)!\[\[[^[\]\n]+\]\]/g)),
  },
  {
    id: 'unknown-fence-lang',
    label: 'fenced block with an unrecognised language',
    source: '```mermaid\ngraph TD;\n  A-->B;\n```\n',
    provenance:
      'syntax per CommonMark 0.31.2 fenced code blocks + info string; fixture written here. Measured ' +
      'locally on marked 16.4.2: `<pre><code class="language-mermaid">graph TD;\\n  A--&gt;B;\\n' +
      '</code></pre>` — the payload SURVIVES, so this is additive and NOT VOID. That distinction is ' +
      'what PLAN §3.3.5 says decides which D6 capabilities are permitted.',
    detect: rawDetector((ctx) =>
      ctx.fences
        .filter((f) => {
          const lang = (f.info.split(/[\s,{]/)[0] ?? '').toLowerCase()
          return lang !== '' && !KNOWN_FENCE_LANGS.has(lang)
        })
        .map((f): Range => [f.start, f.end]),
    ),
  },
  {
    id: 'setext-heading',
    label: 'setext heading',
    source: 'Title\n=====\n',
    provenance:
      'syntax per CommonMark 0.31.2 setext headings; fixture written here. Measured locally: marked ' +
      '16.4.2 and commonmark 0.31.2 both render `<h1>Title</h1>`.',
    detect: detector((ctx) => {
      const out: Range[] = []
      for (let i = 1; i < ctx.lineStarts.length; i++) {
        if (!/^ {0,3}(?:=+|-+)[ \t]*$/.test(lineAt(ctx.text, ctx.lineStarts, i))) continue
        const prev = lineAt(ctx.text, ctx.lineStarts, i - 1)
        if (prev.trim() === '') continue
        // An ATX heading, a fence, a block quote or a list marker on the line above means the
        // dashes are a thematic break or a list, not an underline.
        if (/^ {0,3}(?:#{1,6}(?:[ \t]|$)|>|[-*+][ \t]|\d{1,9}[.)][ \t]|`{3,}|~{3,})/.test(prev)) continue
        if (/^ {0,3}(?:=+|-+)[ \t]*$/.test(prev)) continue
        out.push([ctx.lineStarts[i - 1] ?? 0, lineEnd(ctx.text, ctx.lineStarts, i)])
      }
      return out
    }),
  },
  {
    id: 'table',
    label: 'GFM table',
    source: '| a | b |\n| - | - |\n| 1 | 2 |\n',
    provenance:
      'syntax per GFM (GitHub Flavored Markdown spec, tables extension); fixture written here. Not ' +
      'copied from a suite — no local fixture file exists in this repo.',
    detect: detector((ctx) => [...ctx.tables]),
  },
  {
    id: 'strikethrough',
    label: 'strikethrough',
    source: 'This is ~~gone~~ now.\n',
    provenance:
      'syntax per GFM strikethrough extension; fixture written here. Kept distinct from lone-tilde ' +
      'because it was the tilde CASE SPLIT that the hand-written list got wrong (PLAN §3.3.9).',
    detect: detector((ctx) => matches(ctx.text, /~~[^\s~](?:[^\n~]*[^\s~])?~~/g)),
  },
  {
    id: 'autolink',
    label: 'autolink',
    source: 'See <https://example.com> for more.\n',
    provenance:
      'syntax per CommonMark 0.31.2 autolinks (absolute URI and email forms); fixture written here.',
    detect: detector((ctx) => [
      ...matches(ctx.text, /<[A-Za-z][A-Za-z0-9+.-]{1,31}:[^<>\s]*>/g),
      ...matches(ctx.text, /<[^\s<>@]+@[^\s<>@.]+(?:\.[^\s<>@.]+)+>/g),
    ]),
  },
  {
    id: 'math',
    label: 'TeX math, inline and display',
    source: 'Energy is $E = mc^2$ exactly.\n',
    provenance:
      'invented — `$…$` math is in no markdown spec; the delimiter rules follow remark-math/Pandoc ' +
      '(opener not followed by whitespace, closer not preceded by it), which is what keeps `$5 and ' +
      '$10` from matching. katex 0.17.0 is a dependency of this repo, so the surface is real.',
    detect: detector((ctx) => {
      const display = matches(ctx.text, /\$\$[\s\S]*?\$\$/g)
      const inline = matches(ctx.text, /\$(?![\s$])(?:[^$\n\\]|\\.)*(?<![\s\\])\$/g).filter(
        (r) => !overlapsAny(r, display),
      )
      return [...display, ...inline]
    }),
  },
  {
    id: 'footnote',
    label: 'footnote reference and definition',
    source: 'Claim.[^1]\n\n[^1]: the source\n',
    provenance:
      'syntax per GFM footnotes (also Pandoc); fixture written here. Not copied from a suite.',
    detect: detector((ctx) => {
      const defs = matches(ctx.text, /^ {0,3}\[\^[^\]\s]+\]:/gm)
      const refs = matches(ctx.text, /(?<!\\)\[\^[^\]\s]+\]/g).filter((r) => !overlapsAny(r, defs))
      return [...defs, ...refs]
    }),
  },
  {
    id: 'task-list',
    label: 'task list item',
    source: '- [ ] not done\n- [x] done\n',
    provenance:
      'syntax per GFM task list items; fixture written here. Not copied from a suite.',
    detect: detector((ctx) => matches(ctx.text, /^ {0,3}(?:[-*+]|\d{1,9}[.)])[ \t]+\[[ xX]\](?=[ \t])/gm)),
  },
]

/** Lookup by id. Built once; `CONSTRUCTS` is frozen by convention, not by `Object.freeze`. */
export const CONSTRUCTS_BY_ID: ReadonlyMap<string, Construct> = new Map(CONSTRUCTS.map((c) => [c.id, c]))

/**
 * Every construct found in a document, with its byte ranges. The join Layer 2 needs.
 *
 * Returns only constructs with at least one occurrence, so an empty result means "nothing in this
 * corpus fires here" — never "the scan failed". A construct with no `detect` is skipped rather than
 * silently reported as absent, because absent and unmeasurable are different answers.
 */
export function inventory(markdown: string): ReadonlyMap<string, readonly Range[]> {
  const out = new Map<string, readonly Range[]>()
  for (const c of CONSTRUCTS) {
    if (!c.detect) continue
    const found = c.detect(markdown)
    if (found.length > 0) out.set(c.id, found)
  }
  return out
}

/** Exposed for the mask tests — the regions where a construct-shaped string is content. */
export function skipRegions(markdown: string): readonly Range[] {
  const ctx = analyse(markdown)
  return toBytes(ctx.map, ctx.skip)
}
