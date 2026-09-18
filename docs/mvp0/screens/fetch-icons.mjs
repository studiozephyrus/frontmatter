#!/usr/bin/env node
// Fetch every Material Symbol that gen.mjs uses into ./icons, once, and keep them
// in the repository. The cache used to live in a session scratchpad, which gets
// wiped when a session resumes, and then gen.mjs throws "icon missing".
//
//   node docs/mvp0/screens/fetch-icons.mjs [--force]
//
// Rounded weight 400, fill 0, 24px, from google/material-design-icons.
// Brand marks (Google, GitHub) are NOT Material Symbols and live in brand.mjs.

import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const HERE = path.dirname(new URL(import.meta.url).pathname)
const OUT = path.join(HERE, 'icons')
const FORCE = process.argv.includes('--force')

const src = fs.readFileSync(path.join(HERE, 'gen.mjs'), 'utf8')
const names = [...new Set([...src.matchAll(/\bic\('([a-z0-9_]+)'/g)].map(m => m[1]))].sort()

fs.mkdirSync(OUT, { recursive: true })

const url = (n, style) =>
  `https://raw.githubusercontent.com/google/material-design-icons/master/symbols/web/${n}/${style}/${n}_24px.svg`

const STYLES = ['materialsymbolsrounded', 'materialsymbolsoutlined']

let ok = 0
const missing = []

for (const n of names) {
  const dest = path.join(OUT, n + '.svg')
  if (!FORCE && fs.existsSync(dest) && fs.statSync(dest).size > 0) { ok++; continue }
  // curl, not fetch: node's fetch is blocked by the OS sandbox this repo builds under
  let got = false
  for (const style of STYLES) {
    try {
      const body = execFileSync('curl', ['-sfL', '-m', '25', url(n, style)], { encoding: 'utf8' })
      if (!/<path[^>]*\sd="/.test(body)) continue
      fs.writeFileSync(dest, body)
      got = true
      break
    } catch { /* try the next style */ }
  }
  if (got) ok++; else missing.push(n)
}

console.log(`icons: ${ok} of ${names.length} present in ${path.relative(process.cwd(), OUT)}`)
if (missing.length) {
  console.log('MISSING (gen.mjs will throw on these):', missing.join(' '))
  process.exit(1)
}
