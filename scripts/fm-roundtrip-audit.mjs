#!/usr/bin/env node
/**
 * Frontmatter round-trip audit — the INDEPENDENT ORACLE for the splice writer.
 *
 * Shares no code with the writer under test. It reads the pinned corpus, performs a
 * publish-then-unpublish cycle through a named implementation, and asserts the result is
 * byte-identical to the original. Byte comparison only: no parsing, no normalisation.
 *
 *   node scripts/fm-roundtrip-audit.mjs graymatter   # the CURRENT shipped path
 *   node scripts/fm-roundtrip-audit.mjs yamldoc      # the yaml Document path
 *   node scripts/fm-roundtrip-audit.mjs splice       # the new splice writer
 *
 * Corpus: docs/engine/research/corpus-manifest.json
 *   corpus_id sha256:3a010b1649899795d79274fc528dbece97fdabf4ff0f81cc02ab619c048c51a4
 */
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { pathToFileURL } from 'node:url'
import matter from 'gray-matter'
import { parseDocument, isMap } from 'yaml'
// Load the TS source without a build step. Node 24 strips types; we read and eval so the
// oracle has NO build dependency and cannot silently test a stale artifact.
const _tsSrc = fs.readFileSync(new URL('../src/modules/share/domain/splice-frontmatter.ts', import.meta.url), 'utf8')
  .replace(/:\s*string\s*\|\s*number\s*\|\s*boolean\s*\|\s*null/g, '').replace(/:\s*string/g, '')
  .replace(/:\s*boolean/g, '').replace(/\(\s*src,\s*key,\s*value,\s*\)/, '(src, key, value)')
const _tmp = path.join(os.tmpdir(), `mdmax-splice-${process.pid}.mjs`)
fs.writeFileSync(_tmp, _tsSrc)
const { spliceFrontmatterValue } = await import(pathToFileURL(_tmp).href)
fs.unlinkSync(_tmp)

const MANIFEST = 'docs/engine/research/corpus-manifest.json'
const ROOTS = {
  md: path.join(process.env.HOME, 'Desktop/GitHub/md'),
  knowledge: path.join(process.env.HOME, 'Desktop/GitHub/knowledge'),
  frontmatter: process.cwd(),
}
const KEY = 'public_slug'
const VAL = 'audit-test-slug'

// ---- implementations under test -------------------------------------------------

/** What share-writer.ts ships today. Regenerates the whole block from a plain object. */
function graymatter(src, key, value) {
  const p = matter(src)
  const data = { ...p.data }
  if (value === null) delete data[key]
  else data[key] = value
  return matter.stringify(p.content, data)
}

/** What preview/frontmatter.ts does. Re-emits via the yaml Document (comments survive). */
const FM_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/
function yamldoc(src, key, value) {
  const m = FM_RE.exec(src)
  if (m === null) return src
  const doc = parseDocument(m[1] ?? '')
  if (doc.errors.length > 0) return src
  if (!isMap(doc.contents)) return src
  if (value === null) doc.delete(key)
  else doc.set(key, value)
  const body = src.slice(m[0].length)
  const yaml = doc.toString().replace(/\n$/, '')
  if (yaml.trim() === '' || yaml.trim() === '{}') return body.replace(/^\n+/, '')
  return `---\n${yaml}\n---\n\n${body.replace(/^\n+/, '')}`
}

/** The new one: byte-range splice. Touches only the bytes of the key being changed. */
function splice(src, key, value) {
  return spliceFrontmatterValue(src, key, value)
}

const IMPLS = { graymatter, yamldoc, splice }

// ---- run -------------------------------------------------------------------------

const which = process.argv[2] ?? 'splice'
const impl = IMPLS[which]
if (!impl) {
  console.error(`unknown impl "${which}". one of: ${Object.keys(IMPLS).join(', ')}`)
  process.exit(2)
}

const man = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'))
let scanned = 0, withFm = 0, identical = 0, changed = 0, threw = 0, refused = 0
const examples = []

for (const [root, info] of Object.entries(man.roots)) {
  const base = ROOTS[root]
  if (!base) continue
  for (const f of info.files) {
    let src
    try { src = fs.readFileSync(path.join(base, f.path), 'utf8') } catch { continue }
    scanned++
    if (!/^---\r?\n/.test(src)) continue
    withFm++
    try {
      // If the file ALREADY carries the key, the inverse of "publish" is "restore the old
      // value", not "delete". Asserting byte-identity after a delete would be asserting that
      // deleting a line leaves the line — which is a bug in the test, not in the writer.
      const had = /^public_slug[ \t]*:[ \t]*(.*)$/m.exec(
        (/^---\r?\n([\s\S]*?)\r?\n---/.exec(src)?.[1]) ?? '')
      const published = impl(src, KEY, VAL)
      if (published === src) { refused++; continue }   // publish was a NO-OP: a refusal, not a pass
      const back = had
        ? impl(published, KEY, had[1].trim().replace(/^["']|["']$/g, ''))
        : impl(published, KEY, null)
      if (Buffer.compare(Buffer.from(back, 'utf8'), Buffer.from(src, 'utf8')) === 0) {
        identical++
      } else {
        changed++
        if (examples.length < 4) {
          // first differing line, for a human
          const a = src.split('\n'), b = back.split('\n')
          let i = 0; while (i < a.length && a[i] === b[i]) i++
          examples.push({ p: `${root}/${f.path}`, line: i + 1, was: a[i] ?? '<eof>', now: b[i] ?? '<eof>' })
        }
      }
    } catch (e) {
      threw++
      if (examples.length < 4) examples.push({ p: `${root}/${f.path}`, line: 0, was: 'THREW', now: String(e.message).slice(0, 70) })
    }
  }
}

const pct = (n) => withFm ? `${(n / withFm * 100).toFixed(2)}%` : '—'
console.log(`corpus_id  ${man.corpus_id}`)
console.log(`impl       ${which}`)
console.log(`operation  set ${KEY}=${VAL}, then delete ${KEY}`)
console.log(`assertion  result is BYTE-IDENTICAL to the original\n`)
console.log(`  files scanned          ${scanned}`)
console.log(`  with YAML frontmatter  ${withFm}`)
console.log(`  ------------------------------------------------`)
console.log(`  BYTE-IDENTICAL         ${identical}  ${pct(identical)}`)
console.log(`  CHANGED (data loss)    ${changed}  ${pct(changed)}`)
console.log(`  THREW                  ${threw}  ${pct(threw)}`)
console.log(`  refused (left as-is)   ${refused}  ${pct(refused)}`)
if (examples.length) {
  console.log(`\n  first divergences:`)
  for (const e of examples) {
    console.log(`    ${e.p}${e.line ? ` line ${e.line}` : ''}`)
    console.log(`      was: ${JSON.stringify(e.was).slice(0, 96)}`)
    console.log(`      now: ${JSON.stringify(e.now).slice(0, 96)}`)
  }
}
const EXPECTED = 907
if (withFm !== EXPECTED) {
  console.log(`\n  REFUSING: corpus is incomplete — saw ${withFm} frontmatter files, expected ${EXPECTED}.`)
  console.log('  This oracle is meaningless on a partial corpus. Mount the vaults or re-pin the manifest.')
  process.exit(2)
}
const failed = changed + threw
console.log(`\n  VERDICT: ${failed === 0 ? 'PASS — 0 files altered' : `FAIL — ${failed} of ${withFm} files altered by a no-op round trip`}`)
process.exit(failed === 0 ? 0 : 1)
