/**
 * THE TARGET REGISTRY — (product, surface) pairs. (PLAN §3.3.3, §3.3.11)
 *
 * THE FINDING THAT FORCED THIS SHAPE: **"GitHub" is not one target. It is three renderers that
 * disagree on identical bytes.** A certificate keyed on products rather than on (product, surface)
 * would report one verdict where three different things happen.
 *
 * FIDELITY IS PART OF THE VERDICT, NOT A FOOTNOTE. Kill condition (2) is that the uncertifiable
 * surface is the only one anyone cares about — `github-blob` cannot be probed without pushing
 * content, and Obsidian, Notion, Typora, Bear, Slack and Discord cannot be probed at all. That is
 * **7 of ~12 surfaces**. The capability survives only if declared-contract-plus-canary is accepted
 * as honest, which means a declared row must be visibly declared and visibly dated — never mixed
 * silently into a column of measured ones.
 *
 * Slack and Discord are not CommonMark and are modelled as **lossy sinks**, not renderers. Do not
 * attempt UI automation to certify them; the plan rules it out by name.
 */
import type { Target } from './cert-contract'

/**
 * When the declared rows were last checked against reality. A stale certificate must LOOK stale —
 * that decay is the reason this is the one dataset a competitor cannot simply copy once.
 */
export const DECLARED_LAST_VERIFIED = '2026-08-01'

export const TARGETS: readonly Target[] = [
  // ---------------------------------------------------------------- measured locally
  {
    id: 'frontmatter-app',
    product: 'frontmatter',
    surface: 'preview',
    engineId: 'remark-app',
    fidelity: 'local',
  },
  {
    id: 'commonmark-spec',
    product: 'CommonMark',
    surface: 'reference implementation',
    engineId: 'commonmark',
    fidelity: 'local',
  },
  {
    id: 'github-pages',
    product: 'GitHub',
    surface: 'Pages (Jekyll + kramdown)',
    engineId: 'kramdown-jekyll',
    fidelity: 'local',
    // Measured: Jekyll strips front matter BEFORE kramdown runs. Modelling this matters — one of
    // the five claims the plan's own verifier killed was "only frontmatter's own app hides front
    // matter"; Hugo, Docusaurus, Astro, Eleventy, Jekyll and GitHub's blob viewer all do.
    prePipeline: ['strip-frontmatter'],
  },
  {
    id: 'markdown-it-safe',
    product: 'markdown-it',
    surface: 'default (html: false)',
    engineId: 'markdown-it',
    fidelity: 'local',
  },
  {
    id: 'markdown-it-html',
    product: 'markdown-it',
    surface: 'html: true',
    engineId: 'markdown-it-html-true',
    fidelity: 'local',
  },
  {
    id: 'marked',
    product: 'marked',
    surface: 'default',
    engineId: 'marked',
    fidelity: 'local',
  },
  {
    id: 'react-markdown',
    product: 'react-markdown',
    surface: 'default (no rehype-raw)',
    engineId: 'react-markdown',
    fidelity: 'local',
  },

  // ---------------------------------------------------------------- cannot be probed locally
  {
    id: 'github-blob',
    product: 'GitHub',
    surface: 'blob viewer',
    // Stood in for by the app pipeline for STRUCTURE only. Its documented deltas — HTML comments
    // deleted outright (nodejs/node README: 5 standalone `<!--` lines in source, 0 in the
    // 91,223-byte rendered blob), front matter rendered as an HTML table, id="x" prefixed to
    // id="user-content-x", class/style/data-* stripped — are declared, not measured here, because
    // reading it back REQUIRES the content to already be pushed.
    engineId: 'remark-app',
    fidelity: 'requires-push',
    lastVerified: DECLARED_LAST_VERIFIED,
  },
  {
    id: 'github-comment',
    product: 'GitHub',
    surface: 'comment box',
    engineId: 'remark-app',
    // CONTESTED in the source research: `POST /markdown` with mode=gfm emitted no heading anchor,
    // while mode=markdown emitted the full anchor structure that rendered comments visibly have.
    // The plan says treat as declare-and-date, NOT as locally runnable. Doing otherwise would
    // publish a verdict from a proxy that disagrees with the surface it stands for.
    fidelity: 'declared',
    lastVerified: DECLARED_LAST_VERIFIED,
  },
  { id: 'obsidian', product: 'Obsidian', surface: 'reading view', engineId: 'remark-app', fidelity: 'declared', lastVerified: DECLARED_LAST_VERIFIED },
  { id: 'notion', product: 'Notion', surface: 'import', engineId: 'remark-app', fidelity: 'declared', lastVerified: DECLARED_LAST_VERIFIED },
  { id: 'typora', product: 'Typora', surface: 'editor', engineId: 'remark-app', fidelity: 'declared', lastVerified: DECLARED_LAST_VERIFIED },
  { id: 'bear', product: 'Bear', surface: 'editor', engineId: 'remark-app', fidelity: 'declared', lastVerified: DECLARED_LAST_VERIFIED },
  // Lossy sinks, not renderers. Kept in the registry so a report can say "this will not survive",
  // never so a verdict can be computed from an engine standing in for them.
  { id: 'slack', product: 'Slack', surface: 'message', engineId: 'remark-app', fidelity: 'declared', lastVerified: DECLARED_LAST_VERIFIED },
  { id: 'discord', product: 'Discord', surface: 'message', engineId: 'remark-app', fidelity: 'declared', lastVerified: DECLARED_LAST_VERIFIED },
]

/** The targets whose verdicts are actually measured here. Everything else is a declaration. */
export const LOCAL_TARGETS: readonly Target[] = TARGETS.filter((t) => t.fidelity === 'local')

/**
 * The share of surfaces that cannot be probed — kill condition (2) reduced to one number, so it
 * can be reported rather than remembered.
 */
export function uncertifiableShare(): { uncertifiable: number; total: number; pct: number } {
  const total = TARGETS.length
  const uncertifiable = TARGETS.filter((t) => t.fidelity !== 'local').length
  return { uncertifiable, total, pct: (uncertifiable / total) * 100 }
}

export function targetById(id: string): Target | undefined {
  return TARGETS.find((t) => t.id === id)
}
