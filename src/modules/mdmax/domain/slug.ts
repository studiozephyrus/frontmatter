/**
 * slug/1 — the heading anchor algorithm, and the resolver that reads it. (PLAN §3.8.2)
 *
 * THE DECISION, AND THE MEASUREMENT BEHIND IT
 * The plan calls this "the single highest-leverage decision in the linker". It was re-measured
 * rather than taken on faith (`scripts/slug-decision-audit.mjs`), over the 393 intra-document
 * anchors in `corpus_id sha256:3a010b16…`:
 *
 *   github-slugger (what GitHub and rehype-slug emit)     86 / 393   21.88%
 *   dash-collapsing                                      375 / 393   95.42%
 *   accept EITHER form                                   388 / 393   98.73%
 *
 * The two single algorithms are not competing theories of one population — they describe two
 * different kinds of author. `#2-personas--use-cases` fails dash-collapsing precisely BECAUSE
 * its double dash is github-slugger's own output for `&`, copied faithfully off a rendered page.
 * `#claude` fails github-slugger because a human typed it by hand. Choosing one algorithm throws
 * away one population for no reason.
 *
 * So the decision is a split, not a pick:
 *
 *   WRITE    exactly one canonical form — `slug/1`, which is github-slugger's algorithm, because
 *            that is what GitHub and every rehype-slug renderer will produce for the same
 *            heading. An anchor we emit must work on GitHub, not only inside frontmatter.
 *   RESOLVE  tolerantly — `resolveAnchor` accepts the canonical form OR the dash-collapsed form.
 *            Reading generously costs nothing; writing generously would fork the format.
 *
 * CAVEAT THAT TRAVELS WITH THOSE NUMBERS. 85.2% of the 393 anchors come from a single file
 * (`md/Zephyrus/ecosystem.md`), across only 6 files total. This is a handful of authoring habits,
 * not a population. It is strong enough to break a tie and far too thin to call a law.
 *
 * CHANGING THIS FUNCTION REQUIRES BUMPING `SLUG_VERSION` — see the golden-file gate.
 */
import GithubSlugger from 'github-slugger'

export const SLUG_VERSION = 'mdmax/slug@1'

/**
 * The canonical form. One heading, one slug, matching what GitHub renders.
 *
 * `github-slugger` is a dependency rather than a vendored copy, which would normally be a risk
 * for a function whose output is a persisted key. The golden-file gate is what makes it safe: it
 * pins a digest over 200 cases, so a dependency bump that changes even one slug fails CI loudly
 * instead of silently re-keying stored anchors.
 */
export function slug(heading: string): string {
  return new GithubSlugger().slug(heading)
}

/**
 * The canonical form with runs of `-` collapsed and edges trimmed — what a human types when
 * writing an anchor by hand. Never written by us; accepted when reading.
 */
export function collapsedSlug(heading: string): string {
  return slug(heading)
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Slug a document's headings in order, de-duplicating the way GitHub does — the second
 * occurrence of a repeated heading gets `-1`, the third `-2`.
 *
 * One slugger instance per document, never shared: GitHub de-duplicates within a page, and a
 * shared instance would make a heading's slug depend on every document processed before it.
 */
export function slugDocument(headings: readonly string[]): string[] {
  const slugger = new GithubSlugger()
  return headings.map((h) => slugger.slug(h))
}

/** How an anchor matched, so a caller can report and a linter can warn on the tolerant path. */
export type AnchorMatch =
  | { readonly kind: 'CANONICAL'; readonly heading: string; readonly slug: string }
  | { readonly kind: 'COLLAPSED'; readonly heading: string; readonly slug: string }
  | { readonly kind: 'UNRESOLVED' }

/**
 * Resolve `#anchor` against a document's headings, canonical first.
 *
 * Returning HOW it matched matters: a `COLLAPSED` match is a link that works here and would break
 * on GitHub, which is exactly what the near-miss checker (§3.4) should surface — a warning, not
 * an error, and never a failed user action.
 */
export function resolveAnchor(anchor: string, headings: readonly string[]): AnchorMatch {
  const target = decodeAnchor(anchor)
  const slugs = slugDocument(headings)

  for (let i = 0; i < slugs.length; i++) {
    if (slugs[i] === target) return { kind: 'CANONICAL', heading: headings[i] ?? '', slug: slugs[i] ?? '' }
  }
  for (let i = 0; i < slugs.length; i++) {
    const collapsed = (slugs[i] ?? '').replace(/-{2,}/g, '-').replace(/^-+|-+$/g, '')
    if (collapsed === target) return { kind: 'COLLAPSED', heading: headings[i] ?? '', slug: slugs[i] ?? '' }
  }
  return { kind: 'UNRESOLVED' }
}

/**
 * Normalise an anchor as written in a link: strip a leading `#`, percent-decode, lowercase.
 * Percent-decoding is wrapped because a malformed escape throws, and a bad link in a user's
 * document must never fail a user action (§3.8.3).
 */
export function decodeAnchor(anchor: string): string {
  const bare = anchor.startsWith('#') ? anchor.slice(1) : anchor
  try {
    return decodeURIComponent(bare).toLowerCase()
  } catch {
    return bare.toLowerCase()
  }
}

/** The stamp that travels with any anchor derived from `slug`. */
export function slugStamp(): string {
  return SLUG_VERSION
}
