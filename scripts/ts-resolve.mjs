/**
 * A minimal module-resolution hook so plain `node` can run the TypeScript sources directly.
 *
 * WHY THIS EXISTS. Node ≥22.18 strips TypeScript types natively, so the source needs no build
 * step — but Node's ESM resolver still demands a full file extension and knows nothing about the
 * `@/*` path alias in tsconfig.json. vitest supplies both from its own resolver, which is exactly
 * why the test suite passed while `node scripts/mdmax-cert.mjs` could not resolve a single import.
 *
 * Registering a resolver is preferable to adding `tsx` or a build step: the CLI then executes the
 * SAME source files the tests do, with no artifact in between that could go stale (the failure
 * mode that had the round-trip oracle silently testing nothing for an unknown number of runs).
 */
import { registerHooks } from 'node:module'
import { existsSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const SRC = path.join(ROOT, 'src')

/** Candidate on-disk files for a specifier Node could not resolve on its own. */
function candidates(base) {
  return [
    `${base}.ts`,
    `${base}.tsx`,
    `${base}.mjs`,
    `${base}.js`,
    path.join(base, 'index.ts'),
    path.join(base, 'index.tsx'),
  ]
}

registerHooks({
  resolve(specifier, context, nextResolve) {
    // `@/x` → `<repo>/src/x`, matching the tsconfig paths entry.
    if (specifier.startsWith('@/')) {
      const base = path.join(SRC, specifier.slice(2))
      for (const c of candidates(base)) {
        if (existsSync(c)) return { url: pathToFileURL(c).href, shortCircuit: true }
      }
    }

    // A relative specifier with no extension — the common TypeScript style.
    if (specifier.startsWith('.') && !/\.[cm]?[jt]sx?$/.test(specifier)) {
      const parent = context.parentURL ? path.dirname(fileURLToPath(context.parentURL)) : ROOT
      const base = path.resolve(parent, specifier)
      for (const c of candidates(base)) {
        if (existsSync(c)) return { url: pathToFileURL(c).href, shortCircuit: true }
      }
    }

    return nextResolve(specifier, context)
  },
})
