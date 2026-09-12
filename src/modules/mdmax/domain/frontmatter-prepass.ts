/**
 * The lenient front-matter pre-pass. (PLAN §3.8.3)
 *
 * THE PROBLEM, MEASURED IN THE FOUNDERS' OWN VAULT
 * **170 of 907 front-matter blocks are not valid YAML** — 18.74% — because Obsidian's wikilink
 * syntax puts markdown's grammar inside YAML's:
 *
 *     related: [[a]], [[b]]        <- YAML error: a flow sequence that never closes properly
 *
 * And the quiet variant is worse, because it does not error at all:
 *
 *     related: [[[A]], [[B]]]      <- parses cleanly into [[["A"]], [["B"]]] and DESTROYS the links
 *
 * A silent successful parse that loses data is the single most dangerous outcome available here,
 * so the two cases get opposite treatment: the first is repaired for reading, the second is
 * REFUSED. Guessing which nesting the author meant would mean writing a guess into their file.
 *
 * TWO HARD RULES
 *  1. This pre-pass NEVER writes. It produces a corrected string for a READER. Bytes on disk are
 *     only ever changed by the splice writer (D7), which does not parse YAML at all — which is
 *     exactly why the splice path already handles all 170 of these files at 100%.
 *  2. **A front-matter parse failure may NEVER fail a user action.** Every function here returns
 *     a verdict; none throws. The caller degrades to "properties unavailable" and the document
 *     still opens, still edits, still saves.
 */

/** A `[[…]]` run appearing in a value position, not already inside quotes. */
const WIKILINK = /\[\[([^\]]*)\]\]/

/**
 * The silent-corruption shape: a flow sequence whose FIRST element is itself a wikilink, i.e.
 * `[[[A]], [[B]]]`. YAML reads the outer `[` as a sequence and `[[A]]` as a nested sequence, so
 * it succeeds and the link text becomes an array. Detected structurally, not by guessing.
 */
const TRIPLE_OPEN = /:\s*\[\s*\[\[/

export type PrepassVerdict =
  /** The block is already valid YAML; nothing was changed. */
  | { readonly kind: 'CLEAN'; readonly yaml: string }
  /** Bare wikilinks were quoted so a parser can read the block. Read-only. */
  | { readonly kind: 'REPAIRED'; readonly yaml: string; readonly repairedKeys: readonly string[] }
  /**
   * The block parses successfully but does so by destroying data. Refused rather than repaired:
   * any repair here is a guess about what the author meant, and the cost of guessing wrong is a
   * silently rewritten link.
   */
  | { readonly kind: 'REFUSED_AMBIGUOUS'; readonly reason: string; readonly line: number }

/** A top-level `key:` line with its value, inside a front-matter block. */
const KEY_LINE = /^([A-Za-z0-9_.$-]+)([ \t]*:[ \t]*)(.*)$/

/**
 * Make a front-matter block readable without changing what it means.
 *
 * Only bare `[[…]]` runs in a top-level value position are touched. Anything already quoted,
 * anything nested, and anything this function does not fully understand is left exactly as it is.
 */
export function prepassFrontmatter(block: string): PrepassVerdict {
  const lines = block.split(/\r?\n/)
  const repairedKeys: string[] = []
  const out: string[] = []
  let changed = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? ''

    if (TRIPLE_OPEN.test(line)) {
      return {
        kind: 'REFUSED_AMBIGUOUS',
        reason:
          'a flow sequence whose first element is a wikilink (`[[[A]], [[B]]]`) parses ' +
          'successfully into nested arrays and destroys the link text; repairing it would ' +
          'require guessing the intended nesting',
        line: i + 1,
      }
    }

    const m = KEY_LINE.exec(line)
    if (m === null) {
      out.push(line)
      continue
    }
    const [, key, sep, rawValue] = m as unknown as [string, string, string, string]

    // Already quoted, or no wikilink at all: leave it alone.
    if (!WIKILINK.test(rawValue) || /^["']/.test(rawValue.trim())) {
      out.push(line)
      continue
    }

    // A bare wikilink run in a value position. Quote the whole value so YAML reads it as one
    // scalar, preserving the exact characters the author typed.
    const trailingComment = /(\s+#.*)$/.exec(rawValue)
    const comment = trailingComment ? trailingComment[1] : ''
    const value = comment ? rawValue.slice(0, rawValue.length - comment.length) : rawValue
    const quoted = `"${value.trim().replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`
    out.push(`${key}${sep}${quoted}${comment}`)
    repairedKeys.push(key)
    changed = true
  }

  if (!changed) return { kind: 'CLEAN', yaml: block }
  return { kind: 'REPAIRED', yaml: out.join('\n'), repairedKeys }
}

/**
 * Extract the wikilink targets from a value, for the reference checker (§3.4).
 *
 * Deliberately independent of YAML: this reads the raw value text, so it works on all 170 blocks
 * a parser refuses. `[[Note|alias]]` yields `Note`; `[[Note#heading]]` yields `Note`.
 */
export function extractWikilinks(rawValue: string): string[] {
  const out: string[] = []
  const re = /\[\[([^\]]+)\]\]/g
  let m: RegExpExecArray | null
  while ((m = re.exec(rawValue)) !== null) {
    const inner = (m[1] ?? '').split('|')[0]?.split('#')[0]?.trim()
    if (inner) out.push(inner)
  }
  return out
}
