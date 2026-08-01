/**
 * Byte-range splice of a single YAML frontmatter key.
 *
 * WHY THIS EXISTS
 * The two shipped write paths regenerate the frontmatter block from a parsed object
 * (`matter.stringify`) or re-emit it from a YAML Document (`doc.toString()`). Both rewrite
 * bytes they were never asked to change: comments, quoting style, key order, blank-line
 * placement, explicit type tags, and — for gray-matter — any body that itself opens with a
 * `---` block. On a product where every save is a commit, that is silent data loss.
 *
 * THE RULE (PLAN.md D7, from Foster et al., TOPLAS 2007, Lemma 3.9):
 * never regenerate from a parse tree. Locate the bytes that represent the key, replace only
 * those bytes, and leave every other byte in the file untouched.
 *
 * WHAT THIS DOES NOT DO — deliberately
 *  - It does not parse YAML. It scans the frontmatter block line-wise for a top-level key.
 *    That is sufficient because it only ever handles ONE key, whose value is a simple scalar
 *    the application controls (a slug), and it refuses anything it does not fully understand.
 *  - It does not touch nested keys, sequence items, flow mappings, or multi-line scalars.
 *  - It does not reformat, reorder, requote or renormalise anything.
 *
 * REFUSAL IS A FIRST-CLASS OUTCOME. When the shape is not one this function can splice
 * safely, it returns the input unchanged rather than guessing. A refusal is visible to the
 * caller (the key simply is not there afterwards) and is infinitely cheaper than a silent
 * rewrite. This mirrors the anchor resolver's AMBIGUOUS verdict.
 *
 */

const CRLF = /\r\n/
const FM_OPEN = /^---[ \t]*(\r?\n)/
const NEWLINE = /\r?\n/

/** A top-level `key:` line inside a frontmatter block. Not indented, not a list item. */
function topLevelKeyLine(line: string, key: string): boolean {
  // key at column 0, optional spaces before the colon, then EOL or a space + value
  const m = /^([A-Za-z0-9_.$-]+)[ \t]*:(?:[ \t]|$)/.exec(line)
  return m !== null && m[1] === key
}

/** True when this line begins a construct we must not splice into. */
function isUnsafeContinuation(line: string): boolean {
  // block scalar indicators, anchors, aliases, tags, explicit keys, merge keys
  return /^[A-Za-z0-9_.$-]+[ \t]*:[ \t]*[|>&*!]/.test(line) || /^\?[ \t]/.test(line)
}

/** Serialise a scalar the way YAML wants it, quoting only when it must. */
export function emitScalar(value: string | number | boolean | null): string {
  if (value === null || value === undefined) return ''
  if (typeof value === 'boolean' || typeof value === 'number') return String(value)
  const s = String(value)
  if (s === '') return '""'
  // Quote when the value could be mis-read as something other than a plain string.
  const needsQuote =
    /^[\s]|[\s]$/.test(s) ||                       // leading/trailing space
    /[:#{}[\],&*!|>'"%@`]/.test(s) ||              // YAML indicators
    /^[-?]/.test(s) ||                             // could start a list or complex key
    /^(true|false|null|yes|no|on|off|~)$/i.test(s) || // implicit typing
    /^[+-]?(\d|\.\d)/.test(s) ||                   // could be read as a number/date
    NEWLINE.test(s)
  if (!needsQuote) return s
  return `"${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`
}

export function spliceFrontmatterValue(
  src: string,
  key: string,
  value: string | number | boolean | null,
): string {
  if (typeof src !== 'string' || src.length === 0) return src

  const open = FM_OPEN.exec(src)
  if (open === null) {
    // No frontmatter block. Only a set can proceed; a delete is a no-op.
    if (value === null) return src
    const eol = CRLF.test(src) ? '\r\n' : '\n'
    return `---${eol}${key}: ${emitScalar(value)}${eol}---${eol}${eol}${src.replace(/^\r?\n+/, '')}`
  }

  const eol = open[1]                       // preserve the file's own line ending
  const blockStart = open[0].length         // first byte after the opening `---\n`

  // Find the closing fence: a line that is exactly `---` or `...`
  const closeRe = /^(---|\.\.\.)[ \t]*(\r?\n|$)/m
  closeRe.lastIndex = 0
  let closeIdx = -1, closeLen = 0
  {
    let i = blockStart
    while (i < src.length) {
      const nl = src.indexOf('\n', i)
      const lineEnd = nl === -1 ? src.length : nl
      const line = src.slice(i, lineEnd).replace(/\r$/, '')
      if (line === '---' || line === '...') { closeIdx = i; closeLen = lineEnd - i + (nl === -1 ? 0 : 1); break }
      if (nl === -1) break
      i = nl + 1
    }
  }
  if (closeIdx === -1) return src           // unterminated block — refuse

  const block = src.slice(blockStart, closeIdx)

  // Walk the block's top-level lines, tracking the byte offsets of the target key.
  const lines = block.split(/(?<=\n)/)      // keep line terminators attached
  let off = blockStart
  let keyStart = -1, keyEnd = -1

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i] ?? ''
    const text = raw.replace(/\r?\n$/, '')
    const indented = /^[ \t]/.test(text)
    const isTop = text !== '' && !indented && !/^#/.test(text) && /:/.test(text)

    if (isTop) {
      if (isUnsafeContinuation(text)) {
        // A block scalar or anchor at top level. If it IS our key, refuse entirely.
        if (topLevelKeyLine(text, key)) return src
      }
      if (topLevelKeyLine(text, key)) {
        if (keyStart !== -1) return src     // duplicate key — ambiguous, refuse
        keyStart = off
        // the key's span includes any indented continuation lines that follow
        let end = off + raw.length
        for (let j = i + 1; j < lines.length; j++) {
          const nxt = lines[j] ?? ''
          const ntext = nxt.replace(/\r?\n$/, '')
          if (ntext === '' || /^[ \t]/.test(ntext)) { end += nxt.length; continue }
          break
        }
        keyEnd = end
      }
    } else if (text !== '' && !indented && !/^#/.test(text)) {
      // A bare non-key line at top level (a sequence item, a scalar document, `%` directive).
      // The block is not a plain map — refuse rather than guess.
      return src
    }
    off += raw.length
  }

  // ---- delete -------------------------------------------------------------------
  if (value === null) {
    if (keyStart === -1) return src         // already absent — nothing to do
    const remaining = block.length - (keyEnd - keyStart)
    if (remaining === 0) {
      // Removing the only key empties the block. Remove the whole block, and the single
      // blank line that conventionally follows it, and nothing else.
      const afterClose = closeIdx + closeLen
      const rest = src.slice(afterClose)
      return rest.replace(/^\r?\n/, '')
    }
    return src.slice(0, keyStart) + src.slice(keyEnd)
  }

  // ---- set ----------------------------------------------------------------------
  const emitted = `${key}: ${emitScalar(value)}${eol}`

  if (keyStart !== -1) {
    // Replace exactly the key's existing bytes. Everything else is untouched.
    return src.slice(0, keyStart) + emitted + src.slice(keyEnd)
  }

  // Append after the last top-level entry, immediately before the closing fence.
  return src.slice(0, closeIdx) + emitted + src.slice(closeIdx)
}

export default spliceFrontmatterValue
