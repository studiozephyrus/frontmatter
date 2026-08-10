/**
 * THE CERTIFICATE ENGINE — Layer 2 and Layer 3. (PLAN §3.3.5)
 *
 * Layer 1 (the per-construct capability table) is `domain/constructs.ts`, built offline from
 * minimal pairs. It is required because whole-file correlation cannot attribute cause: in a
 * 300-file run every feature co-occurred with every other and all showed "100% divergent", which
 * is information-free.
 *
 * Layer 2, here: inventory which Layer-1 constructs a file contains, and at which offsets.
 * Layer 3, here: actually RUN the file through each engine, because the table does not predict
 * everything — the lone-tilde case was found by the differential, not by any construct list
 * anyone thought to write.
 *
 * WHY ENGINES ARE INJECTED RATHER THAN IMPORTED
 * This is the application layer; the architecture gate forbids it importing infrastructure. That
 * constraint happens to be the right design anyway: `Engine` is a domain interface, so the
 * certifier is testable against fakes and the CLI is the only thing that knows a subprocess exists.
 */
import type {
  CellVerdict,
  CertBlock,
  Certificate,
  CertResult,
  CertSummary,
  Construct,
  Engine,
  Target,
} from '../domain/cert-contract'
import { OffsetMap, unsafeU16 } from '../domain/offsets'

export interface CertifyOptions {
  readonly path: string
  readonly source: string
  readonly sha256: string
  readonly engines: readonly Engine[]
  readonly targets: readonly Target[]
  readonly constructs: readonly Construct[]
  readonly benchId: string
  readonly foldVersion: string
  /** Injected so the certifier does not depend on a concrete fold implementation. */
  readonly classify: (args: {
    source: string
    rendered: string
    referenceRendered?: string
  }) => CellVerdict
  /**
   * Fold an HTML string to its equivalence-class text. Used to compute the bench CONSENSUS, which
   * is what MUTATE is judged against — see the note in `certify`.
   */
  readonly foldText: (html: string) => string
  /**
   * Retained for `--explain` and for reporting which engine is the spec's answer. It is NOT the
   * MUTATE reference; using it as one made every GFM table a MUTATE.
   */
  readonly oracleEngineId?: string
}

/**
 * Split a document into top-level blocks with UTF-16 offset ranges.
 *
 * Deliberately NOT an mdast walk. A certificate must report on bytes the user can find, and a
 * blank-line split is stable across every engine in the bench — whereas each engine's own block
 * segmentation is one of the things being MEASURED, so using any single engine's answer would
 * bake that engine's opinion into the question.
 *
 * Fenced code is kept whole: a `<!-- -->` inside a fence is content, not a construct occurrence,
 * and splitting mid-fence would make it look like one.
 */
export function splitBlocks(source: string): { start: number; end: number; text: string }[] {
  const blocks: { start: number; end: number; text: string }[] = []
  const lines = source.split(/(?<=\n)/)

  let offset = 0
  let bufStart = 0
  let buf: string[] = []
  let inFence = false
  let fenceMarker = ''

  const flush = (end: number): void => {
    const text = buf.join('')
    if (text.trim() !== '') blocks.push({ start: bufStart, end, text })
    buf = []
  }

  for (const raw of lines) {
    const line = raw.replace(/\r?\n$/, '')
    const fence = /^[ \t]*(`{3,}|~{3,})/.exec(line)

    if (fence !== null) {
      const marker = fence[1] ?? ''
      if (!inFence) {
        inFence = true
        fenceMarker = marker[0] ?? '`'
      } else if (marker[0] === fenceMarker) {
        inFence = false
      }
    }

    if (!inFence && line.trim() === '') {
      flush(offset)
      offset += raw.length
      bufStart = offset
      continue
    }

    if (buf.length === 0) bufStart = offset
    buf.push(raw)
    offset += raw.length
  }
  flush(offset)

  // A frontmatter block opens the document and is one block, not several.
  return mergeLeadingFrontmatter(source, blocks)
}

/** Front matter is a single unit; a blank line inside it must not split it in two. */
function mergeLeadingFrontmatter(
  source: string,
  blocks: { start: number; end: number; text: string }[],
): { start: number; end: number; text: string }[] {
  if (!/^---[ \t]*\r?\n/.test(source)) return blocks
  const close = /\r?\n(---|\.\.\.)[ \t]*(\r?\n|$)/.exec(source)
  if (close === null) return blocks
  const fmEnd = close.index + close[0].length
  const rest = blocks.filter((b) => b.start >= fmEnd)
  return [{ start: 0, end: fmEnd, text: source.slice(0, fmEnd) }, ...rest]
}

/** A stable short id for a block, derived from its content and position. */
function blockAnchor(text: string, start: number): string {
  let h = 0x811c9dc5
  const seed = `${start}:${text}`
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return `blk_${h.toString(16).padStart(8, '0').slice(0, 8)}`
}

/** A coarse block type, for the human table. The engines disagree on this, so it is advisory. */
function blockType(text: string): string {
  const t = text.trimStart()
  if (/^---[ \t]*\r?\n/.test(text)) return 'frontmatter'
  if (/^#{1,6}[ \t]/.test(t)) return 'heading'
  if (/^(`{3,}|~{3,})/.test(t)) return 'code'
  if (/^>/.test(t)) return 'blockquote'
  if (/^([-*+]|\d{1,9}[.)])[ \t]/.test(t)) return 'list'
  if (/^\|/.test(t)) return 'table'
  if (/^<!--/.test(t)) return 'html'
  if (/^\[[^\]]+\]:/.test(t)) return 'definition'
  if (/^ {0,3}(?:\*{3,}|-{3,}|_{3,})[ \t]*$/.test(t)) return 'thematicBreak'
  return 'paragraph'
}

/**
 * Certify one document.
 *
 * Never throws. Every failure is a value, because this runs behind a route handler and a user's
 * malformed document must not 500.
 */
export async function certify(opts: CertifyOptions): Promise<CertResult> {
  if (opts.targets.length === 0)
    return { ok: false, reason: 'NO_TARGETS', detail: 'no targets selected; nothing to certify' }

  const engineById = new Map(opts.engines.map((e) => [e.id, e]))
  for (const t of opts.targets) {
    if (!engineById.has(t.engineId) && t.fidelity === 'local') {
      // LR#67: a missing engine is a hard refusal, never a quietly smaller matrix reporting green.
      return {
        ok: false,
        reason: 'ENGINE_MISSING',
        engineId: t.engineId,
        detail: `target ${t.id} needs engine ${t.engineId}, which the bench did not load`,
      }
    }
  }

  const blocks = splitBlocks(opts.source)
  // splitBlocks (and file.length) report UTF-16 code-unit offsets — what JS strings are indexed
  // in. A certificate reports on bytes a user can find with `wc -c` / their editor's byte count,
  // so every offset that leaves this function goes through the one conversion point. block.start
  // and block.end are always immediately after a whole line (split on `(?<=\n)`), so they can
  // never land inside a surrogate pair — `unsafeU16` is the documented escape hatch for offsets
  // already known good. See PLAN.md §6.10.
  const offsetMap = new OffsetMap(opts.source)
  const oracleId = opts.oracleEngineId ?? 'commonmark'
  const oracle = engineById.get(oracleId)

  const out: CertBlock[] = []
  const summary: { pass: number; strip: number; corrupt: number; void: number } = {
    pass: 0,
    strip: 0,
    corrupt: 0,
    void: 0,
  }

  for (const b of blocks) {
    const constructs = opts.constructs
      .filter((c) => {
        if (!c.detect) return false
        try {
          return c.detect(b.text).length > 0
        } catch {
          return false
        }
      })
      .map((c) => c.id)

    // Render every target FIRST, so MUTATE can be judged against the bench consensus.
    const renderedByTarget = new Map<string, string>()
    for (const t of opts.targets) {
      const engine = engineById.get(t.engineId)
      if (!engine) continue
      try {
        renderedByTarget.set(t.id, await engine.render(applyPrePipeline(b.text, t)))
      } catch (e) {
        return {
          ok: false,
          reason: 'ENGINE_THREW',
          engineId: engine.id,
          detail: `${e instanceof Error ? e.message : String(e)}`.slice(0, 180),
        }
      }
    }

    /**
     * THE REFERENCE FOR MUTATE IS THE CONSENSUS, NOT THE SPEC ORACLE.
     *
     * This was measured wrong first, which is why it is written down. Using `commonmark 0.31.2` as
     * the reference made EVERY GFM table a MUTATE on every engine — because commonmark.js is the
     * pure-spec oracle and the spec has no tables, so the one engine that "disagreed" was the
     * reference itself. 356 MUTATEs on a five-file sample, nearly all false.
     *
     * The plan's own MUTATE example is the shape of the right answer: `1) first` renders as a
     * paragraph on kramdown where **all fifteen other engines** produce an `<ol>`. That is a
     * minority-against-consensus finding. So the reference is the modal folded output across the
     * bench, and an engine MUTATEs when it is in the minority.
     *
     * Ties do not produce a reference at all. With no majority there is no consensus to diverge
     * from, and inventing one would manufacture verdicts out of a two-engine disagreement.
     */
    const tally = new Map<string, { count: number; raw: string }>()
    for (const html of renderedByTarget.values()) {
      const key = opts.foldText(html)
      const cur = tally.get(key)
      // Keep one RAW representative per group: `classify` folds what it is handed, and handing it
      // pre-folded text would apply the fold twice and quietly change what "equivalent" means.
      if (cur) cur.count++
      else tally.set(key, { count: 1, raw: html })
    }
    let reference: string | undefined
    if (tally.size > 0) {
      const ranked = [...tally.entries()].sort((a, b) => b[1].count - a[1].count)
      const [, top] = ranked[0] as [string, { count: number; raw: string }]
      const tied = ranked.filter(([, v]) => v.count === top.count).length > 1
      const majority = top.count > renderedByTarget.size / 2
      if (!tied && majority) reference = top.raw
    }
    void oracle

    const verdicts: Record<string, CellVerdict> = {}
    for (const t of opts.targets) {
      const engine = engineById.get(t.engineId)
      if (!engine) continue
      const rendered = renderedByTarget.get(t.id)
      if (rendered === undefined) continue

      // `exactOptionalPropertyTypes` is on, so an explicit `undefined` is not the same as an
      // absent key. Omit the property rather than passing undefined.
      const v = opts.classify(
        reference === undefined
          ? { source: b.text, rendered }
          : { source: b.text, rendered, referenceRendered: reference },
      )
      verdicts[t.id] = v
      if (v.verdict === 'PASS') summary.pass++
      else if (v.verdict === 'STRIP') summary.strip++
      else if (v.verdict === 'CORRUPT') summary.corrupt++
      else summary.void++
    }

    out.push({
      anchor: blockAnchor(b.text, b.start),
      type: blockType(b.text),
      byteRange: [offsetMap.toByte(unsafeU16(b.start)), offsetMap.toByte(unsafeU16(b.end))],
      constructs,
      verdicts,
    })
  }

  const certificate: Certificate = {
    schema: 'mdmax/cert@1',
    bench: {
      id: opts.benchId,
      engines: opts.engines.map(({ render: _render, ...rest }) => rest),
    },
    fold: { version: opts.foldVersion },
    file: { path: opts.path, sha256: opts.sha256, bytes: offsetMap.lengthBytes },
    targets: opts.targets.map((t) => t.id),
    summary: summary as CertSummary,
    blocks: out,
  }
  return { ok: true, certificate }
}

/**
 * Transformations a target applies BEFORE its engine sees the source.
 *
 * Measured: Jekyll strips front matter before kramdown runs, and GitHub's blob viewer renders it
 * as an HTML table instead. Modelling this is not optional — claim 4 of the five the plan's own
 * verifier killed was "only frontmatter's own app hides front matter"; Hugo, Docusaurus, Astro,
 * Eleventy, Jekyll and GitHub's blob viewer all consume it upstream of the engine.
 */
function applyPrePipeline(text: string, target: Target): string {
  let out = text
  for (const step of target.prePipeline ?? []) {
    if (step === 'strip-frontmatter') {
      out = out.replace(/^---[ \t]*\r?\n[\s\S]*?\r?\n(---|\.\.\.)[ \t]*(\r?\n|$)/, '')
    }
  }
  return out
}

/** The BROKEN-class histogram — the artifact that decides kill conditions 1 and 4. */
export function brokenHistogram(certs: readonly Certificate[]): {
  totalBlocks: number
  totalFiles: number
  brokenBlocks: number
  filesWithBroken: number
  byConstruct: { construct: string; count: number }[]
  byClass: { class: string; count: number }[]
} {
  let totalBlocks = 0
  let brokenBlocks = 0
  let filesWithBroken = 0
  const byConstruct = new Map<string, number>()
  const byClass = new Map<string, number>()

  for (const c of certs) {
    let fileHasBroken = false
    for (const b of c.blocks) {
      totalBlocks++
      let blockBroken = false
      for (const v of Object.values(b.verdicts)) {
        if (v.verdict !== 'CORRUPT') continue
        blockBroken = true
        byClass.set(v.class ?? 'UNCLASSED', (byClass.get(v.class ?? 'UNCLASSED') ?? 0) + 1)
      }
      if (blockBroken) {
        brokenBlocks++
        fileHasBroken = true
        // Attribute to constructs present in the block. A block with no detected construct is
        // attributed to `__unattributed__` rather than dropped: silently discarding the ones we
        // cannot explain is how a histogram comes to say six constructs explain everything.
        if (b.constructs.length === 0) {
          byConstruct.set('__unattributed__', (byConstruct.get('__unattributed__') ?? 0) + 1)
        } else {
          for (const k of b.constructs) byConstruct.set(k, (byConstruct.get(k) ?? 0) + 1)
        }
      }
    }
    if (fileHasBroken) filesWithBroken++
  }

  return {
    totalBlocks,
    totalFiles: certs.length,
    brokenBlocks,
    filesWithBroken,
    byConstruct: [...byConstruct.entries()]
      .map(([construct, count]) => ({ construct, count }))
      .sort((a, b) => b.count - a.count),
    byClass: [...byClass.entries()].map(([cls, count]) => ({ class: cls, count })).sort((a, b) => b.count - a.count),
  }
}
