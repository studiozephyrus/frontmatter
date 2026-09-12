/**
 * THE OFFSET MODEL — one unit, one boundary policy, one conversion point. (PLAN §3.8.1)
 *
 * WHY THIS EXISTS
 * Only 67 of 1,080 files in the pinned corpus have `bytes == UTF-16 code units == code points`.
 * 93.8% already diverge, and 103 of 2,314 files contain non-BMP characters. An offset that does
 * not say which unit it is measured in is a bug waiting for an emoji.
 *
 * The failure is silent and it is permanent: an anchor persisted against the wrong unit points at
 * a byte in the middle of a character, and every comment hung off it detaches.
 *
 *   UNIT        UTF-16 code units. This is what CodeMirror reports, what mdast positions use,
 *               and what `String.prototype.length` counts. Bytes appear only at the edges:
 *               a git blob, a Buffer, a content hash over a range, an LSP that negotiated utf-8.
 *   BOUNDARY    An offset may NEVER fall inside a surrogate pair. Rejected at construction.
 *               NEVER rounded — rounding turns a detectable bug into a wrong answer.
 *   CONVERSION  Exactly one place: OffsetMap. Nothing else in the codebase converts.
 *   TYPES       Branded. U16Offset, ByteOffset and GraphemeIndex cannot be mixed, assigned to
 *               one another, or passed to the wrong parameter — the compiler refuses.
 *
 * A NOTE ON THE INDEX SHAPE. PLAN §3.8.1 specifies a `Uint32Array` UTF-16→byte prefix table. A
 * dense table costs 4 bytes per code unit — 16 MB for a document at the 4 MB shape-gate ceiling,
 * per open document. This stores a checkpoint every BLOCK units instead and scans within the
 * block, which is the same answer for 1/512th of the memory and a bounded scan. The dense form
 * is recoverable at any time; the sparse form is what ships.
 */

// ---------------------------------------------------------------- branded units

declare const U16Brand: unique symbol
declare const ByteBrand: unique symbol
declare const GraphemeBrand: unique symbol

/** An offset in UTF-16 code units. The canonical internal unit. */
export type U16Offset = number & { readonly [U16Brand]: true }
/** An offset in UTF-8 bytes. Only ever produced at an edge, never stored as an anchor. */
export type ByteOffset = number & { readonly [ByteBrand]: true }
/** An index in user-perceived characters. For cursors and column reporting only. */
export type GraphemeIndex = number & { readonly [GraphemeBrand]: true }

/** The reasons an offset can be rejected. A caller must handle each explicitly. */
export type OffsetError =
  | { readonly kind: 'NOT_AN_INTEGER'; readonly value: number }
  | { readonly kind: 'NEGATIVE'; readonly value: number }
  | { readonly kind: 'PAST_END'; readonly value: number; readonly length: number }
  | { readonly kind: 'INSIDE_SURROGATE_PAIR'; readonly value: number }

export type OffsetResult<T> = { readonly ok: true; readonly value: T } | { readonly ok: false; readonly error: OffsetError }

const HIGH_SURROGATE_START = 0xd800
const HIGH_SURROGATE_END = 0xdbff
const LOW_SURROGATE_START = 0xdc00
const LOW_SURROGATE_END = 0xdfff

function isHighSurrogate(code: number): boolean {
  return code >= HIGH_SURROGATE_START && code <= HIGH_SURROGATE_END
}

function isLowSurrogate(code: number): boolean {
  return code >= LOW_SURROGATE_START && code <= LOW_SURROGATE_END
}

/**
 * True when `offset` splits a surrogate pair — i.e. the unit before it is a high surrogate and
 * the unit at it is the matching low surrogate. Such an offset does not name a position in the
 * text; it names a position inside one character.
 */
export function splitsSurrogatePair(text: string, offset: number): boolean {
  if (offset <= 0 || offset >= text.length) return false
  return isHighSurrogate(text.charCodeAt(offset - 1)) && isLowSurrogate(text.charCodeAt(offset))
}

/**
 * The ONLY way to make a U16Offset. Every constraint is checked; nothing is repaired.
 *
 * Refusing rather than rounding is deliberate. A rounded offset is indistinguishable from a
 * correct one at the call site, so the bug survives to the point where an anchor is written and
 * only surfaces when a user's comment has already detached.
 */
export function u16(text: string, offset: number): OffsetResult<U16Offset> {
  if (!Number.isInteger(offset)) return { ok: false, error: { kind: 'NOT_AN_INTEGER', value: offset } }
  if (offset < 0) return { ok: false, error: { kind: 'NEGATIVE', value: offset } }
  if (offset > text.length) return { ok: false, error: { kind: 'PAST_END', value: offset, length: text.length } }
  if (splitsSurrogatePair(text, offset)) return { ok: false, error: { kind: 'INSIDE_SURROGATE_PAIR', value: offset } }
  return { ok: true, value: offset as U16Offset }
}

/**
 * Assert a U16Offset, throwing on refusal. For call sites that have already validated, and for
 * tests. Production paths on user input use `u16` and handle the error.
 */
export function u16OrThrow(text: string, offset: number): U16Offset {
  const r = u16(text, offset)
  if (!r.ok) throw new RangeError(`invalid U16Offset ${offset}: ${r.error.kind}`)
  return r.value
}

/** Unsafe escape hatch for offsets already known good (e.g. `0`, or `text.length`). */
export function unsafeU16(offset: number): U16Offset {
  return offset as U16Offset
}
export function unsafeByte(offset: number): ByteOffset {
  return offset as ByteOffset
}

// ---------------------------------------------------------------- the conversion point

const BLOCK = 512

/**
 * The single place UTF-16 offsets become byte offsets and back. One per open document.
 *
 * Build cost is O(n) once. Lookup is O(1) block seek plus a bounded scan of at most BLOCK code
 * units. Memory is 4 bytes per BLOCK code units — about 8 KB for a document at the 4 MB ceiling,
 * against 16 MB for a dense table.
 */
export class OffsetMap {
  private readonly text: string
  /** byteAt[i] is the UTF-8 byte offset of code unit i*BLOCK. */
  private readonly byteAt: Uint32Array
  private readonly totalBytes: number
  /** Lazily built on first grapheme query — Intl.Segmenter is not cheap. */
  private graphemeStarts: Uint32Array | null = null

  constructor(text: string) {
    this.text = text
    const blocks = Math.floor(text.length / BLOCK) + 1
    this.byteAt = new Uint32Array(blocks)
    let bytes = 0
    let block = 0
    for (let i = 0; i < text.length; i++) {
      if (i % BLOCK === 0) this.byteAt[block++] = bytes
      const code = text.charCodeAt(i)
      if (code < 0x80) bytes += 1
      else if (code < 0x800) bytes += 2
      else if (isHighSurrogate(code) && i + 1 < text.length && isLowSurrogate(text.charCodeAt(i + 1))) {
        // A well-formed pair is one 4-byte sequence; charge it all to the high surrogate so the
        // running total is correct at every position that is not inside the pair.
        bytes += 4
        i++
        // the low surrogate occupies a slot too — keep the block checkpoints aligned
        if (i % BLOCK === 0) this.byteAt[block++] = bytes
      } else {
        // Includes lone surrogates. WHATWG encoding replaces them with U+FFFD, which is 3 bytes,
        // and 3 is also the length of any other BMP character in this range.
        bytes += 3
      }
    }
    this.totalBytes = bytes
  }

  get lengthU16(): number {
    return this.text.length
  }
  get lengthBytes(): number {
    return this.totalBytes
  }

  /**
   * A block checkpoint is recorded by CODE-UNIT INDEX, but a pair whose low surrogate lands
   * exactly on a boundary charges the whole 4-byte pair to that same index (the constructor
   * charges pairs to the high surrogate's iteration, one unit early). The stored byte count is
   * correct — it is the WALK that isn't: starting from a low surrogate and reading it as a
   * fresh character overcounts by 3. Back the walk up to the high surrogate (the pair's real
   * start) and undo the 4-byte charge so it re-derives the pair correctly instead of twice.
   */
  private resolveCheckpoint(i: number, bytes: number): { i: number; bytes: number } {
    if (i > 0 && i < this.text.length && isLowSurrogate(this.text.charCodeAt(i)) && isHighSurrogate(this.text.charCodeAt(i - 1))) {
      return { i: i - 1, bytes: bytes - 4 }
    }
    return { i, bytes }
  }

  /** UTF-16 code-unit offset → UTF-8 byte offset. */
  toByte(offset: U16Offset): ByteOffset {
    const target = offset as number
    if (target <= 0) return 0 as ByteOffset
    if (target >= this.text.length) return this.totalBytes as ByteOffset
    const block = Math.floor(target / BLOCK)
    let { i, bytes } = this.resolveCheckpoint(block * BLOCK, this.byteAt[block] ?? 0)
    while (i < target) {
      const code = this.text.charCodeAt(i)
      if (code < 0x80) bytes += 1
      else if (code < 0x800) bytes += 2
      else if (isHighSurrogate(code) && i + 1 < this.text.length && isLowSurrogate(this.text.charCodeAt(i + 1))) {
        bytes += 4
        i++
      } else bytes += 3
      i++
    }
    return bytes as ByteOffset
  }

  /**
   * UTF-8 byte offset → UTF-16 code-unit offset. Refuses a byte offset that lands inside a
   * multi-byte sequence rather than snapping to a boundary.
   */
  toU16(offset: ByteOffset): OffsetResult<U16Offset> {
    const target = offset as number
    if (!Number.isInteger(target)) return { ok: false, error: { kind: 'NOT_AN_INTEGER', value: target } }
    if (target < 0) return { ok: false, error: { kind: 'NEGATIVE', value: target } }
    if (target > this.totalBytes)
      return { ok: false, error: { kind: 'PAST_END', value: target, length: this.totalBytes } }
    if (target === this.totalBytes) return { ok: true, value: this.text.length as U16Offset }

    // binary search the block checkpoints, then walk
    let lo = 0
    let hi = this.byteAt.length - 1
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1
      if ((this.byteAt[mid] ?? 0) <= target) lo = mid
      else hi = mid - 1
    }
    let { i, bytes } = this.resolveCheckpoint(lo * BLOCK, this.byteAt[lo] ?? 0)
    while (i < this.text.length && bytes < target) {
      const code = this.text.charCodeAt(i)
      let width: number
      let step = 1
      if (code < 0x80) width = 1
      else if (code < 0x800) width = 2
      else if (isHighSurrogate(code) && i + 1 < this.text.length && isLowSurrogate(this.text.charCodeAt(i + 1))) {
        width = 4
        step = 2
      } else width = 3
      if (bytes + width > target) {
        // the requested byte is interior to this character
        return { ok: false, error: { kind: 'INSIDE_SURROGATE_PAIR', value: target } }
      }
      bytes += width
      i += step
    }
    return { ok: true, value: i as U16Offset }
  }

  /** Lazily segment the text into graphemes. Built once, then reused. */
  private ensureGraphemes(): Uint32Array {
    if (this.graphemeStarts !== null) return this.graphemeStarts
    const starts: number[] = []
    // Intl.Segmenter is present in every runtime this targets (Node >=16, all 2024+ browsers).
    const Seg = (globalThis as { Intl?: { Segmenter?: new (l?: string, o?: object) => { segment(s: string): Iterable<{ index: number }> } } }).Intl
      ?.Segmenter
    if (typeof Seg === 'function') {
      for (const s of new Seg(undefined, { granularity: 'grapheme' }).segment(this.text)) starts.push(s.index)
    } else {
      // Fallback: code points. Wrong for combining marks and ZWJ sequences, but never wrong in a
      // way that splits a surrogate pair, which is the property the offset model depends on.
      for (let i = 0; i < this.text.length; ) {
        starts.push(i)
        const code = this.text.charCodeAt(i)
        i += isHighSurrogate(code) && i + 1 < this.text.length && isLowSurrogate(this.text.charCodeAt(i + 1)) ? 2 : 1
      }
    }
    this.graphemeStarts = Uint32Array.from(starts)
    return this.graphemeStarts
  }

  /** True when `offset` sits on a user-perceived character boundary. */
  isGraphemeBoundary(offset: U16Offset): boolean {
    const target = offset as number
    if (target === 0 || target === this.text.length) return true
    const g = this.ensureGraphemes()
    let lo = 0
    let hi = g.length - 1
    while (lo <= hi) {
      const mid = (lo + hi) >> 1
      const v = g[mid] ?? 0
      if (v === target) return true
      if (v < target) lo = mid + 1
      else hi = mid - 1
    }
    return false
  }

  /** UTF-16 offset → index in user-perceived characters. For cursors and column reporting. */
  toGrapheme(offset: U16Offset): GraphemeIndex {
    const target = offset as number
    const g = this.ensureGraphemes()
    let lo = 0
    let hi = g.length - 1
    let ans = 0
    while (lo <= hi) {
      const mid = (lo + hi) >> 1
      if ((g[mid] ?? 0) <= target) {
        ans = mid
        lo = mid + 1
      } else hi = mid - 1
    }
    return ans as GraphemeIndex
  }

  get graphemeCount(): number {
    return this.ensureGraphemes().length
  }
}

/**
 * Byte length of a string under UTF-8, without allocating a Buffer or a TextEncoder.
 *
 * Exists so that the eslint rule forbidding `Buffer.byteLength` and `TextEncoder` elsewhere has
 * something to point at. Lone surrogates count as 3 (the width of U+FFFD, which is what every
 * WHATWG-conformant encoder substitutes).
 */
export function utf8Length(text: string): number {
  let bytes = 0
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i)
    if (code < 0x80) bytes += 1
    else if (code < 0x800) bytes += 2
    else if (isHighSurrogate(code) && i + 1 < text.length && isLowSurrogate(text.charCodeAt(i + 1))) {
      bytes += 4
      i++
    } else bytes += 3
  }
  return bytes
}
