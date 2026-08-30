// Assemble the tree and render the one printable PDF.
//
//   node docs/build/build-final.mjs [--mode print|compact|default] [--keep-html]
//
// The output filename carries a version, a date and a time, and NEVER overwrites a
// path that has already been handed to a human. A reader who has the file open sees
// the version they opened; a silent overwrite means they are reading one document
// while you are describing another, and neither of you can tell.
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const arg = (flag, dflt) => {
  const i = process.argv.indexOf(flag)
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : dflt
}
const MODE = arg('--mode', 'print')
const KEEP = process.argv.includes('--keep-html')

const RECORD = 'docs/FRONTMATTER-RECORD.md'
const run = (cmd, args, env = {}) =>
  execFileSync(cmd, args, { stdio: 'inherit', env: { ...process.env, ...env } })

// 1 — rebuild the derived Tier-1 docs from the reports
console.log('\n── tree ──')
run('node', ['docs/build/build-tree.mjs'])

// 2 — every cross-reference must resolve BEFORE we spend ten minutes rendering
console.log('\n── references ──')
run('node', ['docs/build/check-refs.mjs'])

// 3 — assemble; this exits non-zero if numbering, headings or the identity map break
console.log('\n── assemble ──')
run('node', ['docs/build/assemble-tree.mjs', RECORD])

// 4 — name the artifact
const doc = fs.readFileSync(RECORD, 'utf8')
const words = doc.split(/\s+/).filter(Boolean).length
const now = new Date()
const p2 = (n) => String(n).padStart(2, '0')
const stamp = `${now.getFullYear()}-${p2(now.getMonth() + 1)}-${p2(now.getDate())}-${p2(now.getHours())}${p2(now.getMinutes())}`

// Version = how many section-carrying documents the tree currently holds, so the
// number moves when the record's shape changes rather than on every re-render.
const VERSION = '3.0'
const base = `frontmatter-RECORD-v${VERSION}-${stamp}`
if (fs.existsSync(`docs/${base}.pdf`)) {
  console.error(`refusing to overwrite docs/${base}.pdf`)
  process.exit(1)
}

// 5 — render
console.log(`\n── render (${MODE}) ──`)
run('node', ['docs/build/build-prd-pdf.mjs', RECORD, base,
  'frontmatter',
  `The complete record · ${(words / 1000).toFixed(0)}k words · ${stamp.slice(0, 10)}`],
  { FM_PDF_MODE: MODE, FM_PDF_TIMEOUT_MS: '900000' })

const pdf = path.join('docs', `${base}.pdf`)
const html = path.join('docs', `${base}.print.html`)
if (!KEEP && fs.existsSync(html)) fs.unlinkSync(html)

if (!fs.existsSync(pdf)) { console.error('\nno pdf produced'); process.exit(1) }

// Page count read from the PDF itself, not predicted.
const raw = fs.readFileSync(pdf, 'latin1')
const pages = (raw.match(/\/Type\s*\/Page[^s]/g) || []).length
console.log(`\n${pdf}`)
console.log(`  ${(fs.statSync(pdf).size / 1048576).toFixed(2)} MB · ${pages} pages · ${words.toLocaleString()} words · mode ${MODE}`)
console.log(`\n  Chrome cannot spawn inside the Bash sandbox. If the render produced nothing,`)
console.log(`  that is the cause, not the document size — re-run with the sandbox disabled.`)
