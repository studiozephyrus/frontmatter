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

/** U+FEFF. Legal as the first character of a UTF-8 file and invisible in every editor. */
const BOM = '\uFEFF'

/**
 * The only key shapes this module can LOCATE — the same character class `topLevelKeyLine`
 * scans for, stated once so the two can never drift apart.
 *
 * Anything outside it is refused at the door. That is not squeamishness: a key the scanner
 * cannot find is reported as absent, and "absent" sends a `set` down the append path, so the
 * key is written a second time. Three edits to `título` produced three extra lines and a
 * document YAML then refuses to load (`Map keys must be unique`). The failure is unbounded and
 * silent, and it is reachable from the UI because `addProperty` does not validate the name.
 *
 * Supporting non-ASCII keys properly is a real piece of work, not a widened regex: `café`
 * typed NFC and NFD renders identically and keys separately, so the module would first have to
 * decide what key EQUALITY means. Until that decision is made, refusing is the honest answer.
 *
 * Exported so the UI can refuse the same shapes at the point of typing rather than letting the
 * user watch an add silently do nothing. One definition, two call sites, no drift.
 */
export const SAFE_KEY = /^[A-Za-z0-9_.$-]+$/

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

/**
 * Serialise a value, PRESERVING the shape the file already uses.
 *
 * 90.1% of the pinned corpus writes lists in flow form (`tags: [a, b]`) and 8.4% in block form
 * (`tags:\n  - a`). Converting one to the other is a rewrite of bytes the user authored, so the
 * caller passes the existing value text and we match it.
 */
export function emitValue(
  value: string | number | boolean | string[] | null,
  existingValueText = '',
): string {
  if (!Array.isArray(value)) return emitScalar(value)
  // Block form is signalled by the value CONTINUING on the next line. An empty string means
  // there is no existing value at all — a new key — which takes the dominant flow form.
  const isBlock = /^\r?\n/.test(existingValueText)
  if (isBlock) {
    // block sequence: keep the indent already in use, defaulting to two spaces
    const indent = /\n(\s+)-/.exec(existingValueText)?.[1] ?? '  '
    return '\n' + value.map((v) => `${indent}- ${emitScalar(v)}`).join('\n')
  }
  return `[${value.map((v) => emitScalar(v)).join(', ')}]`
}

/** Serialise a scalar the way YAML wants it, quoting only when it must. */
export function emitScalar(value: string | number | boolean | null): string {
  if (value === null || value === undefined) return ''
  if (typeof value === 'boolean' || typeof value === 'number') return String(value)
  const s = String(value)
  if (s === '') return '""'
  // Quote only when the PLAIN form would not read back as this exact string.
  //
  // The common mistake — and the one this replaced — is treating YAML indicator characters as
  // special anywhere in a value. They are special only in FIRST position. `Marketing & QA` and
  // `JD | DRM | CC` are perfectly good plain scalars; quoting them rewrites bytes the user
  // authored. Measured on the pinned corpus, the over-broad rule quoted 435 of 907 files
  // unnecessarily.
  const needsQuote =
    /^\s|\s$/.test(s) ||                              // leading/trailing space is not preserved plain
    /^[-?:,[\]{}#&*!|>'"%@`]/.test(s) ||              // indicator in FIRST position only
    /:\s/.test(s) || /\s#/.test(s) ||                 // `: ` ends a key, ` #` starts a comment
    NEWLINE.test(s) ||
    // would be read as something other than a string
    /^(true|false|null|yes|no|on|off|~)$/i.test(s) ||
    /^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/.test(s) ||   // a complete number
    /^\d{4}-\d{2}-\d{2}([Tt ].*)?$/.test(s) ||             // a date or timestamp
    /^0[xob]/i.test(s)                                     // hex / octal / binary
  if (!needsQuote) return s
  return `"${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`
}

export function spliceFrontmatterValue(
  src: string,
  key: string,
  value: string | number | boolean | string[] | null,
): string {
  if (typeof src !== 'string' || src.length === 0) return src
  if (!SAFE_KEY.test(key)) return src       // cannot address this key — refuse, never append

  // A BOM sits BEFORE the document, it is not part of it. `FM_OPEN` is anchored at index 0,
  // so without this the fence never matches, the no-frontmatter branch runs, and the file's
  // real block is pushed into the body while a new one is prepended.
  //
  // Splitting it off and re-attaching it keeps the byte exactly where the author put it and
  // lets every offset below stay relative to the document proper.
  //
  // Why the corpus never caught this: the oracle replays set-then-delete, and those two
  // operations cancel — set prepends a block, delete finds it as the only key and removes the
  // whole block — so the round trip was byte-identical even while `set` alone was destructive.
  if (src.charCodeAt(0) === 0xfeff) return BOM + spliceFrontmatterValue(src.slice(1), key, value)

  const open = FM_OPEN.exec(src)
  if (open === null) {
    // No frontmatter block. Only a set can proceed; a delete is a no-op.
    if (value === null) return src
    const eol = CRLF.test(src) ? '\r\n' : '\n'
    return `---${eol}${key}: ${emitValue(value)}${eol}---${eol}${eol}${src.replace(/^\r?\n+/, '')}`
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
  if (keyStart !== -1) {
    // Read the value bytes currently in place so a list keeps its flow/block form.
    const existing = src.slice(keyStart, keyEnd)
    const afterColon = existing.slice(existing.indexOf(':') + 1).replace(/\r?\n$/, '')
    const rendered = emitValue(value, afterColon)
    // Replace exactly the key's existing bytes. Everything else is untouched.
    return src.slice(0, keyStart) + `${key}:${rendered.startsWith('\n') ? '' : ' '}${rendered}${eol}` + src.slice(keyEnd)
  }

  const emitted = `${key}: ${emitValue(value)}${eol}`

  // Append after the last top-level entry, immediately before the closing fence.
  return src.slice(0, closeIdx) + emitted + src.slice(closeIdx)
}

/**
 * Rename a top-level key, touching ONLY the key's own bytes. The value, its quoting, any
 * trailing comment and the key's position in the block are all preserved.
 *
 * Refuses when the old key is absent, the new key already exists (renaming onto it would
 * silently merge two values), or the block is not a plain map.
 */
export function spliceFrontmatterKey(src: string, oldKey: string, newKey: string): string {
  if (oldKey === newKey || newKey.trim() === '') return src
  if (!SAFE_KEY.test(newKey)) return src        // would need quoting: refuse
  if (!SAFE_KEY.test(oldKey)) return src        // unlocatable: would rename the wrong bytes
  if (src.charCodeAt(0) === 0xfeff) return BOM + spliceFrontmatterKey(src.slice(1), oldKey, newKey)
  const open = FM_OPEN.exec(src)
  if (open === null) return src
  const blockStart = open[0].length
  let closeIdx = -1
  {
    let i = blockStart
    while (i < src.length) {
      const nl = src.indexOf('\n', i)
      const lineEnd = nl === -1 ? src.length : nl
      const line = src.slice(i, lineEnd).replace(/\r$/, '')
      if (line === '---' || line === '...') { closeIdx = i; break }
      if (nl === -1) break
      i = nl + 1
    }
  }
  if (closeIdx === -1) return src
  const block = src.slice(blockStart, closeIdx)
  const lines = block.split(/(?<=\n)/)
  let off = blockStart, hit = -1
  for (const rawLine of lines) {
    const raw = rawLine ?? ''
    const text = raw.replace(/\r?\n$/, '')
    if (text !== '' && !/^[ \t]/.test(text) && !/^#/.test(text)) {
      if (topLevelKeyLine(text, newKey)) return src         // target exists: refuse
      if (topLevelKeyLine(text, oldKey)) {
        if (hit !== -1) return src                          // duplicate: refuse
        hit = off
      }
    }
    off += raw.length
  }
  if (hit === -1) return src
  return src.slice(0, hit) + newKey + src.slice(hit + oldKey.length)
}

export default spliceFrontmatterValue
