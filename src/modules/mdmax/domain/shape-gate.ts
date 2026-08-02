/**
 * The shape gate — refuse hostile documents before any grammar runs. (PLAN §3.8.4)
 *
 * WHY, WITH THE NUMBERS
 * Two quadratics are already shipped in this repo and both were measured against its own
 * `node_modules`:
 *
 *   WIKILINK_RE                          k = 1.98 — 36,865 ms on 320 KB of `[[`
 *   mdast-util-from-markdown, flat lists  12,429 ms vs micromark's 1,207 ms on identical bytes
 *                                         — a 10.3x gap that widens with size
 *
 * CommonMark is linear in practice but quadratic under adversarial input, and has been patched
 * case by case for exactly this (cmark #373, #389, CVE-2023-22484). A compiler that accepts
 * documents from strangers will be fed hostile ones. The gate is cheap, runs first, and is the
 * only thing standing between a pasted file and a pegged CPU.
 *
 * THE CONTRACT
 * Failure is a value, never an exception. A route handler that can throw on a malformed document
 * is a route handler that 500s on a user's file. Every outcome here is a discriminated union the
 * caller must destructure.
 */

export const MAX_BYTES = 4 * 1024 * 1024
export const MAX_LINES = 200_000
export const MAX_LIST_MARKER_LINES = 20_000

/** Time budgets, enforced by the caller via `worker.terminate()`. Not enforced here. */
export const BUDGET_MS = {
  /** A keystroke in the editor. Anything slower is felt as lag. */
  keystroke: 250,
  /** Opening a document that is not yet warm. */
  coldOpen: 2_000,
  /** A batch job over a whole vault. */
  batch: 10_000,
} as const

export type ShapeFailure =
  | { readonly ok: false; readonly reason: 'BUDGET_BYTES'; readonly bytes: number; readonly limit: number }
  | { readonly ok: false; readonly reason: 'BUDGET_LINES'; readonly lines: number; readonly limit: number }
  | { readonly ok: false; readonly reason: 'BUDGET_BLOCKS'; readonly listMarkerLines: number; readonly limit: number }
  | { readonly ok: false; readonly reason: 'INVALID_UTF8'; readonly at: { line: number; col: number } }
  | { readonly ok: false; readonly reason: 'BUDGET_TIME'; readonly elapsedMs: number; readonly limit: number }
  | { readonly ok: false; readonly reason: 'PARSER_THREW'; readonly message: string }
  | { readonly ok: false; readonly reason: 'WORKER_DIED' }

export type ShapeResult =
  | { readonly ok: true; readonly text: string; readonly bytes: number; readonly lines: number; readonly hadBom: boolean }
  | ShapeFailure

/** A list marker at the start of a line: `-`, `*`, `+`, or `1.` / `1)`. */
const LIST_MARKER = /^[ \t]*(?:[-*+]|\d{1,9}[.)])[ \t]/

const BOM = '﻿'

/**
 * Decode bytes strictly and refuse on invalid UTF-8 — never repair.
 *
 * Repairing means substituting U+FFFD, which changes the byte length of the document. Every
 * offset computed afterwards would be correct for a document the user does not have. Refusing is
 * the only option that keeps offsets meaningful.
 */
export function decodeStrict(bytes: Uint8Array): { ok: true; text: string } | ShapeFailure {
  try {
    const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes)
    return { ok: true, text }
  } catch {
    // Locate the first invalid sequence so the message can point at it. Decoding a prefix that
    // grows one byte at a time is O(n^2); instead binary-search the longest valid prefix.
    let lo = 0
    let hi = bytes.length
    const decoder = new TextDecoder('utf-8', { fatal: true })
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1
      try {
        decoder.decode(bytes.subarray(0, mid))
        lo = mid
      } catch {
        hi = mid - 1
      }
    }
    const prefix = new TextDecoder('utf-8').decode(bytes.subarray(0, lo))
    const upto = prefix.split('\n')
    return {
      ok: false,
      reason: 'INVALID_UTF8',
      at: { line: upto.length, col: (upto[upto.length - 1] ?? '').length + 1 },
    }
  }
}

/**
 * The gate itself. Runs before any grammar, in O(n) with a single pass.
 *
 * A document that passes is not safe — it is merely not obviously hostile. The time budget and
 * the worker pool are what bound the rest.
 */
export function shapeGate(input: string | Uint8Array): ShapeResult {
  let text: string
  let bytes: number

  if (typeof input === 'string') {
    text = input
    // Count UTF-8 bytes without allocating; see offsets.utf8Length for the same routine.
    bytes = 0
    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i)
      if (code < 0x80) bytes += 1
      else if (code < 0x800) bytes += 2
      else if (code >= 0xd800 && code <= 0xdbff && i + 1 < text.length) {
        const next = text.charCodeAt(i + 1)
        if (next >= 0xdc00 && next <= 0xdfff) {
          bytes += 4
          i++
        } else bytes += 3
      } else bytes += 3
    }
  } else {
    const decoded = decodeStrict(input)
    if (!decoded.ok) return decoded
    text = decoded.text
    bytes = input.length
  }

  if (bytes > MAX_BYTES) return { ok: false, reason: 'BUDGET_BYTES', bytes, limit: MAX_BYTES }

  const hadBom = text.startsWith(BOM)
  if (hadBom) {
    text = text.slice(BOM.length)
    bytes -= 3
  }

  // One pass for both line count and list-marker count, with an early exit on each limit so a
  // hostile document costs O(limit) rather than O(n).
  let lines = 1
  let listMarkerLines = 0
  let lineStart = 0
  for (let i = 0; i <= text.length; i++) {
    if (i === text.length || text.charCodeAt(i) === 10 /* \n */) {
      const line = text.slice(lineStart, i)
      if (LIST_MARKER.test(line)) {
        listMarkerLines++
        if (listMarkerLines > MAX_LIST_MARKER_LINES)
          return { ok: false, reason: 'BUDGET_BLOCKS', listMarkerLines, limit: MAX_LIST_MARKER_LINES }
      }
      lineStart = i + 1
      if (i < text.length) {
        lines++
        if (lines > MAX_LINES) return { ok: false, reason: 'BUDGET_LINES', lines, limit: MAX_LINES }
      }
    }
  }

  return { ok: true, text, bytes, lines, hadBom }
}

/** A one-line, user-facing explanation. Never a stack trace (LR#19). */
export function explainFailure(f: ShapeFailure): string {
  switch (f.reason) {
    case 'BUDGET_BYTES':
      return `This file is ${(f.bytes / 1024 / 1024).toFixed(1)} MB. The limit is ${f.limit / 1024 / 1024} MB.`
    case 'BUDGET_LINES':
      return `This file has over ${f.limit.toLocaleString()} lines.`
    case 'BUDGET_BLOCKS':
      return `This file has over ${f.limit.toLocaleString()} list items, which parses quadratically.`
    case 'INVALID_UTF8':
      return `This file is not valid UTF-8 (line ${f.at.line}, column ${f.at.col}). It was not changed.`
    case 'BUDGET_TIME':
      return `Parsing took longer than ${f.limit} ms and was stopped.`
    case 'PARSER_THREW':
      return `This file could not be parsed: ${f.message.slice(0, 120)}`
    case 'WORKER_DIED':
      return 'The parser stopped unexpectedly. The file was not changed.'
  }
}
