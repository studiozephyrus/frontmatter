/**
 * normalize/1 — the hash input for every stored anchor. (PLAN §3.8.2)
 *
 * WHY THIS IS VERSIONED AND FROZEN
 * The 99.627% re-anchoring figure was swept over 384 configurations under exactly this
 * definition: NFC, then collapse whitespace, then lowercase. If the hash input changes later,
 * **every stored anchor silently re-keys** while the published number goes on describing code
 * that no longer exists. Nothing announces it. Comments simply stop finding their blocks.
 *
 * So: this must land BEFORE the first anchor is persisted. Afterwards it is a migration, not an
 * edit. The VERSION string is stamped into every stored anchor and every certificate row, so a
 * reader can always tell which definition produced a given hash.
 *
 * CHANGING THIS FUNCTION REQUIRES BUMPING `NORMALIZE_VERSION`. The golden-file gate in
 * `test/mdmax/pure-functions.test.ts` hashes the output over 200 cases and fails if the digest
 * moves without the version moving with it.
 */

export const NORMALIZE_VERSION = 'mdmax/normalize@1'

/**
 * Every Unicode whitespace character that collapses to a single space.
 *
 * Deliberately explicit rather than `\s`: `\s` is engine- and version-dependent at the edges,
 * and this function's output is a persisted key. It must not move when a runtime updates.
 * U+00A0 NBSP and U+200B ZWSP are included because they arrive constantly from pasted content
 * and a user cannot see the difference.
 */
const WHITESPACE = new RegExp(
  '[' +
    '\\t\\n\\v\\f\\r' +   // ASCII controls
    '\\u0020' +                 // SPACE
    '\\u0085' +                 // NEXT LINE
    '\\u00A0' +                 // NO-BREAK SPACE - arrives constantly from pasted content
    '\\u1680' +                 // OGHAM SPACE MARK
    '\\u2000-\\u200A' +       // EN QUAD .. HAIR SPACE
    '\\u200B' +                 // ZERO WIDTH SPACE - invisible, and a silent key fork
    '\\u2028\\u2029' +        // LINE / PARAGRAPH SEPARATOR
    '\\u202F' +                 // NARROW NO-BREAK SPACE
    '\\u205F' +                 // MEDIUM MATHEMATICAL SPACE
    '\\u3000' +                 // IDEOGRAPHIC SPACE
    '\\uFEFF' +                 // ZERO WIDTH NO-BREAK SPACE / BOM
    ']+',
  'g',
)

/**
 * NFC → collapse whitespace → lowercase → NFC.
 *
 * The trailing re-normalisation is not redundant. `String.prototype.toLowerCase` is not
 * closed over NFC: a handful of characters lower-case into sequences that are not in composed
 * form. Without the second pass this function would not be idempotent, and a key that changes
 * when you re-derive it is not a key. Idempotence is asserted in the golden-file gate.
 */
export function normalize(input: string): string {
  return input.normalize('NFC').replace(WHITESPACE, ' ').trim().toLowerCase().normalize('NFC')
}

/** The stamp that travels with any hash derived from `normalize`. */
export function normalizeStamp(): string {
  return NORMALIZE_VERSION
}
