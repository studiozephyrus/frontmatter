/**
 * THE CERTIFICATE CONTRACT — the interfaces every part of `mdmax cert` codes against.
 * (PLAN §3.3)
 *
 * WHAT A CERTIFICATE IS
 * For one document, per block, per construct, per (product, surface) target: what a REAL renderer
 * does to it. Not a prediction — a differential run against pinned engines.
 *
 * THE FIVE RULES THIS FILE EXISTS TO ENFORCE, each of which came from a measured failure:
 *
 *  1. FOUR VERDICTS, NOT THREE. v2.0.0 specified PASS/STRIP/CORRUPT. The founder-thesis area then
 *     measured a fourth the three-valued matrix has no cell for: VOID, where the content was
 *     by reference and the reference never resolved, so the payload was never in the file at all.
 *     `![[Some Note]]` -> `<p>![[Some Note]]</p>` is VOID; a ```mermaid fence is not, because its
 *     payload survives inside the <pre>. VOID is what decides which capabilities D6 permits.
 *
 *  2. A VERDICT WITH NO BEFORE/AFTER PAIR IS NOT A VERDICT. `before` and `after` are required
 *     fields, not optional ones. The product must be able to say "bytes 1204-1251: `Array<string>`
 *     renders as `Array`", never "this may not render everywhere".
 *
 *  3. A CERTIFICATE WITHOUT THE TARGET'S FULL OPTION SET IS A LIE. Measured: kramdown-parser-gfm
 *     defaults `hard_wrap` ON where Jekyll sets it OFF, and on `Line one\nLine two` that is
 *     `<p>Line one<br />\nLine two</p>` versus `<p>Line one\nLine two</p>` -- every soft line break
 *     in every document would be a false MUTATE. Recording the engine VERSION is not enough.
 *     `options` is therefore required and is hashed into the bench id.
 *
 *  4. A MISSING ENGINE IS A HARD REFUSAL. Never a silently smaller matrix reporting green
 *     (LR#67, and the same disease as the corpus gate that shrank to 23 files and printed 100%).
 *
 *  5. THE ARTIFACT IS A JSON SIDECAR, NEVER WRITTEN BACK INTO THE `.md`. Per LR#11, JSON is for
 *     state the agent must not rewrite. Nothing in cert is permitted to touch the source document.
 */

// ---------------------------------------------------------------- verdicts

/** The four verdicts. Adding a fifth is a schema change, not a patch. */
export type Verdict =
  /** Semantically equivalent output after the versioned fold. */
  | 'PASS'
  /** Output differs, payload invisible, NO source character lost. Also written DEGRADED. */
  | 'STRIP'
  /** Output differs and something was lost or changed. See VerdictClass. Also written BROKEN. */
  | 'CORRUPT'
  /** The payload was by reference and the reference did not resolve. It was never in the file. */
  | 'VOID'

/** How a CORRUPT verdict is corrupt. Required whenever verdict === 'CORRUPT'. */
export type VerdictClass =
  /** The payload became visible text. Front matter LEAKs in 23 of 24 bench configurations. */
  | 'LEAK'
  /** A source character was deleted or substituted. `<cat>` is deleted; `Array<string>` -> `Array`. */
  | 'DESTROY'
  /** Same characters, different structure. `1)` renders as a paragraph on kramdown, an <ol> elsewhere. */
  | 'MUTATE'

/**
 * One (block, target) cell.
 *
 * `before` and `after` are REQUIRED. A cell that cannot produce both is not a verdict and must be
 * reported as an engine failure instead.
 */
export interface CellVerdict {
  readonly verdict: Verdict
  readonly class?: VerdictClass
  /** The source text of the block, or the salient fragment of it. */
  readonly before: string
  /** What the renderer produced for it, after the fold. */
  readonly after: string
  /** Which fold rules fired, so a PASS can be audited rather than trusted. */
  readonly foldApplied?: readonly string[]
}

// ---------------------------------------------------------------- engines and targets

/**
 * A pinned renderer. `options` is the FULL option set, not a summary — see rule 3.
 */
export interface Engine {
  readonly id: string
  readonly name: string
  readonly version: string
  /** Upstream commit where one is pinned (cmark-gfm). Empty for npm/gem-resolved engines. */
  readonly sha?: string
  /** Every option that affects output. Hashed into the bench id. */
  readonly options: Readonly<Record<string, unknown>>
  /** Render markdown to HTML. Throws only if the engine itself is broken. */
  readonly render: (markdown: string) => string | Promise<string>
}

/**
 * A (product, surface) pair. "GitHub" is not one target — it is three renderers that disagree on
 * identical bytes, which is the finding that forced this shape.
 */
export interface Target {
  readonly id: string
  readonly product: string
  readonly surface: string
  /** The engine that stands in for this surface. */
  readonly engineId: string
  /**
   * How faithfully this target can be certified.
   *   'local'          the engine runs here; the verdict is measured
   *   'declared'       cannot be probed (Obsidian, Notion, Slack); a dated declaration + canary
   *   'requires-push'  github-blob needs the content pushed before it can be read back
   */
  readonly fidelity: 'local' | 'declared' | 'requires-push'
  /** For declared targets: when the declaration was last verified. A stale cert must look stale. */
  readonly lastVerified?: string
  /** Transformations applied before the engine sees the source (Jekyll strips front matter). */
  readonly prePipeline?: readonly string[]
}

// ---------------------------------------------------------------- the artifact

export interface CertBlock {
  readonly anchor: string
  readonly type: string
  readonly byteRange: readonly [number, number]
  /** Layer-1 construct ids detected in this block. */
  readonly constructs: readonly string[]
  readonly verdicts: Readonly<Record<string, CellVerdict>>
}

export interface CertSummary {
  readonly pass: number
  readonly strip: number
  readonly corrupt: number
  readonly void: number
}

export interface Certificate {
  readonly schema: 'mdmax/cert@1'
  readonly bench: {
    readonly id: string
    readonly engines: readonly Omit<Engine, 'render'>[]
  }
  readonly fold: { readonly version: string }
  readonly file: { readonly path: string; readonly sha256: string; readonly bytes: number }
  readonly targets: readonly string[]
  readonly summary: CertSummary
  readonly blocks: readonly CertBlock[]
}

// ---------------------------------------------------------------- failure

/**
 * Everything that can go wrong, as a value. A route handler that throws on a user's document is a
 * route handler that 500s on a user's document.
 */
export type CertFailure =
  | { readonly ok: false; readonly reason: 'ENGINE_MISSING'; readonly engineId: string; readonly detail: string }
  | { readonly ok: false; readonly reason: 'ENGINE_THREW'; readonly engineId: string; readonly detail: string }
  | { readonly ok: false; readonly reason: 'SHAPE_REFUSED'; readonly detail: string }
  | { readonly ok: false; readonly reason: 'NO_TARGETS'; readonly detail: string }

export type CertResult = { readonly ok: true; readonly certificate: Certificate } | CertFailure

/** A Layer-1 minimal pair: the smallest document that isolates one construct. */
export interface Construct {
  readonly id: string
  readonly label: string
  /** The minimal source that exhibits it. */
  readonly source: string
  /** Where the fixture came from — an existing suite where possible, per §3.3.9. */
  readonly provenance: string
  /** Detect this construct in a document, returning byte ranges. */
  readonly detect?: (markdown: string) => readonly (readonly [number, number])[]
}
