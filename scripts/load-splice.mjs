/**
 * Shared loader for the splice writer, used by both round-trip oracles.
 *
 * WHY THIS EXISTS. Both oracles previously read the TypeScript source and stripped type
 * annotations with a hand-written list of regexes. That list went stale the moment `emitValue`
 * introduced a multi-line union (`string | number | boolean | string[] | null` broken across
 * lines), and the oracle began dying with `SyntaxError: Unexpected token '|'` on import —
 * BEFORE printing a single line. Piped through a grep for the verdict, a crash and a pass look
 * identical: both print nothing. The audit had been dead for an unknown number of runs.
 *
 * Node >=22.18 strips TypeScript types natively, so the regexes were never necessary. This
 * imports the source directly and then ASSERTS the exports are present and callable. A loader
 * that cannot load must say so loudly (LR#67: a tool must verify its own effect landed).
 */
import { pathToFileURL } from 'node:url'
import path from 'node:path'

const SRC = path.resolve(
  import.meta.dirname,
  '../src/modules/share/domain/splice-frontmatter.ts',
)

const REQUIRED = ['spliceFrontmatterValue', 'spliceFrontmatterKey', 'emitValue', 'emitScalar']

let mod
try {
  mod = await import(pathToFileURL(SRC).href)
} catch (e) {
  console.error(`FATAL: cannot load the splice writer from ${SRC}`)
  console.error(`  ${e.message}`)
  console.error('  This oracle proves nothing without it. Refusing to report a verdict.')
  process.exit(2)
}

const missing = REQUIRED.filter((k) => typeof mod[k] !== 'function')
if (missing.length > 0) {
  console.error(`FATAL: the splice writer loaded but is missing: ${missing.join(', ')}`)
  console.error('  An oracle that silently tests a subset of the writer is a false green.')
  process.exit(2)
}

export const { spliceFrontmatterValue, spliceFrontmatterKey, emitValue, emitScalar } = mod
export default mod
