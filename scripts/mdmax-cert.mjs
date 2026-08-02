#!/usr/bin/env node
/**
 * `mdmax cert` — the CLI surface. (PLAN §3.3.7)
 *
 *   node scripts/mdmax-cert.mjs <file>                   human table: block x target x verdict
 *   node scripts/mdmax-cert.mjs <file> --json            the artifact
 *   node scripts/mdmax-cert.mjs <glob> --fail-on=BROKEN  CI gate; exit 1 on any BROKEN
 *   node scripts/mdmax-cert.mjs --targets=a,b <file>     subset
 *   node scripts/mdmax-cert.mjs --bench-info             every engine + version + FULL option set
 *   node scripts/mdmax-cert.mjs --explain <construct>    the minimal pair and its per-config matrix
 *   node scripts/mdmax-cert.mjs --histogram <glob>       the BROKEN-class frequency histogram
 *
 * The histogram is the point of the two-day slice: it is the artifact that decides kill
 * conditions (1) "the fold swallows everything" and (4) "it is a lint rule, not a certificate".
 *
 * THE ARTIFACT IS A SIDECAR. Nothing here writes into a `.md`, ever. Per LR#11 the JSON is state
 * the agent must not rewrite, and per D7 the only thing permitted to touch a user's bytes is the
 * splice writer.
 */
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

const R = (p) => new URL(p, import.meta.url).pathname

const { loadBench } = await import(R('../src/modules/mdmax/infrastructure/bench.ts'))
const { certify, brokenHistogram } = await import(R('../src/modules/mdmax/application/certify.ts'))
const { TARGETS, LOCAL_TARGETS, uncertifiableShare } = await import(R('../src/modules/mdmax/domain/targets.ts'))
const { CONSTRUCTS } = await import(R('../src/modules/mdmax/domain/constructs.ts'))
const { fold, FOLD_VERSION } = await import(R('../src/modules/mdmax/domain/fold.ts'))
const { classify } = await import(R('../src/modules/mdmax/domain/verdict.ts'))

const argv = process.argv.slice(2)
const flag = (name) => {
  const hit = argv.find((a) => a === `--${name}` || a.startsWith(`--${name}=`))
  if (hit === undefined) return undefined
  return hit.includes('=') ? hit.slice(hit.indexOf('=') + 1) : true
}
const positional = argv.filter((a) => !a.startsWith('--'))

const C = {
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  blue: (s) => `\x1b[34m${s}\x1b[0m`,
}
const paint = (v) =>
  v === 'PASS' ? C.green(v) : v === 'STRIP' ? C.yellow(v) : v === 'VOID' ? C.blue(v) : C.red(v)

// ---------------------------------------------------------------- bench

const requested = flag('targets')
const selected = requested === undefined
  ? LOCAL_TARGETS
  : TARGETS.filter((t) => String(requested).split(',').includes(t.id))

const bench = await loadBench({ require: [...new Set(selected.map((t) => t.engineId))] })
if (!bench.ok) {
  // LR#67: a missing engine is a hard refusal, never a quietly smaller matrix reporting green.
  console.error(C.red(`REFUSING: ${bench.reason}`))
  console.error(`  ${bench.detail ?? ''}`)
  console.error('  A certificate from an incomplete bench is not a certificate.')
  process.exit(2)
}

if (flag('bench-info')) {
  console.log(`bench id   ${bench.benchId}`)
  console.log(`fold       ${FOLD_VERSION}\n`)
  for (const e of bench.engines) {
    console.log(`  ${C.bold(e.id.padEnd(20))} ${e.name} ${e.version}${e.sha ? ` @${e.sha}` : ''}`)
    // A certificate without the target's FULL option set is a lie -- so print all of it.
    for (const [k, v] of Object.entries(e.options)) console.log(`      ${k} = ${JSON.stringify(v)}`)
  }
  const u = uncertifiableShare()
  console.log(`\n  ${u.uncertifiable} of ${u.total} surfaces (${u.pct.toFixed(1)}%) cannot be probed locally.`)
  console.log(C.dim('  That is kill condition (2). Declared rows are dated, never silently mixed in.'))
  process.exit(0)
}

if (flag('explain')) {
  const id = positional[0]
  const c = CONSTRUCTS.find((x) => x.id === id)
  if (!c) {
    console.error(`unknown construct "${id}". known: ${CONSTRUCTS.map((x) => x.id).join(', ')}`)
    process.exit(2)
  }
  console.log(`${C.bold(c.id)} — ${c.label}`)
  console.log(`provenance: ${c.provenance}\n`)
  console.log(C.dim('minimal pair:'))
  console.log(c.source.split('\n').map((l) => `  ${l}`).join('\n'))
  console.log(`\n${C.dim('per-engine:')}`)
  for (const e of bench.engines) {
    let html
    try { html = await e.render(c.source) } catch (err) { html = `THREW: ${err.message}` }
    console.log(`  ${e.id.padEnd(20)} ${JSON.stringify(fold(html).text).slice(0, 100)}`)
  }
  process.exit(0)
}

// ---------------------------------------------------------------- collect files

function expand(pattern) {
  if (fs.existsSync(pattern) && fs.statSync(pattern).isFile()) return [pattern]
  if (fs.existsSync(pattern) && fs.statSync(pattern).isDirectory()) {
    const out = []
    const walk = (d) => {
      for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        if (e.name.startsWith('.') || e.name === 'node_modules') continue
        const full = path.join(d, e.name)
        if (e.isDirectory()) walk(full)
        else if (e.name.toLowerCase().endsWith('.md')) out.push(full)
      }
    }
    walk(pattern)
    return out
  }
  return []
}

const files = positional.flatMap(expand)
if (files.length === 0) {
  console.error('no markdown files matched. pass a file or a directory.')
  process.exit(2)
}

// ---------------------------------------------------------------- run

const certs = []
let failed = false
for (const f of files) {
  const source = fs.readFileSync(f, 'utf8')
  const res = await certify({
    path: f,
    source,
    sha256: createHash('sha256').update(source).digest('hex'),
    engines: bench.engines,
    targets: selected,
    constructs: CONSTRUCTS,
    benchId: bench.benchId,
    foldVersion: FOLD_VERSION,
    classify: (a) => classify({ ...a, foldFn: fold }),
    foldText: (html) => fold(html).text,
  })
  if (!res.ok) {
    console.error(C.red(`REFUSING on ${f}: ${res.reason} — ${res.detail ?? ''}`))
    process.exit(2)
  }
  certs.push(res.certificate)
  if (res.certificate.summary.corrupt > 0) failed = true
}

if (flag('json')) {
  console.log(JSON.stringify(certs.length === 1 ? certs[0] : certs, null, 2))
} else if (flag('histogram')) {
  const h = brokenHistogram(certs)
  console.log(`${C.bold('BROKEN-class histogram')}   bench ${bench.benchId.slice(0, 12)}  fold ${FOLD_VERSION}\n`)
  console.log(`  files                ${h.totalFiles}`)
  console.log(`  blocks               ${h.totalBlocks}`)
  console.log(`  blocks with BROKEN   ${h.brokenBlocks}  ${pct(h.brokenBlocks, h.totalBlocks)}`)
  console.log(`  files with BROKEN    ${h.filesWithBroken}  ${pct(h.filesWithBroken, h.totalFiles)}\n`)
  console.log(`  ${C.dim('by class')}`)
  for (const r of h.byClass) console.log(`    ${r.class.padEnd(16)} ${String(r.count).padStart(7)}`)
  console.log(`\n  ${C.dim('by construct')}`)
  for (const r of h.byConstruct) console.log(`    ${r.construct.padEnd(24)} ${String(r.count).padStart(7)}`)

  // The two kill conditions this histogram exists to decide, evaluated rather than described.
  console.log(`\n  ${C.bold('KILL CONDITIONS')}`)
  const blockRate = h.totalBlocks ? (h.brokenBlocks / h.totalBlocks) * 100 : 0
  const fileRate = h.totalFiles ? (h.filesWithBroken / h.totalFiles) * 100 : 0
  const k1 = blockRate < 1 && fileRate < 15
  console.log(`    (1) fold swallows everything: BROKEN ${blockRate.toFixed(2)}% of blocks, ${fileRate.toFixed(2)}% of files`)
  console.log(`        ${k1 ? C.red('FIRES — below ~1% of blocks AND ~15% of files') : C.green('does not fire')}`)
  const top5 = h.byConstruct.slice(0, 5).reduce((a, r) => a + r.count, 0)
  const allC = h.byConstruct.reduce((a, r) => a + r.count, 0)
  const share = allC ? (top5 / allC) * 100 : 0
  const k4 = share > 80
  console.log(`    (4) it is a lint rule: top-5 constructs are ${share.toFixed(1)}% of BROKEN attributions`)
  console.log(`        ${k4 ? C.red('FIRES — >80%, the apparatus reduces to a static rule set') : C.green('does not fire')}`)
} else {
  for (const c of certs) {
    console.log(`\n${C.bold(c.file.path)}  ${C.dim(`${c.blocks.length} blocks · bench ${c.bench.id.slice(0, 12)}`)}`)
    const cols = c.targets
    console.log(`  ${'block'.padEnd(12)}${'type'.padEnd(14)}${cols.map((t) => t.slice(0, 16).padEnd(18)).join('')}`)
    for (const b of c.blocks) {
      const interesting = Object.values(b.verdicts).some((v) => v.verdict !== 'PASS')
      if (!interesting && !flag('all')) continue
      console.log(
        `  ${b.anchor.padEnd(12)}${b.type.padEnd(14)}` +
          cols.map((t) => {
            const v = b.verdicts[t]
            if (!v) return ''.padEnd(18)
            const s = v.verdict === 'CORRUPT' ? `${v.verdict}/${v.class ?? '?'}` : v.verdict
            return paint(s.padEnd(18))
          }).join(''),
      )
      // "A verdict with no before/after pair is not a verdict." Show the pair for every non-PASS.
      for (const t of cols) {
        const v = b.verdicts[t]
        if (!v || v.verdict === 'PASS') continue
        console.log(
          C.dim(
            `      ${t}: bytes ${b.byteRange[0]}-${b.byteRange[1]}  ` +
              `${JSON.stringify(v.before.slice(0, 60))} -> ${JSON.stringify(v.after.slice(0, 60))}`,
          ),
        )
      }
    }
    const s = c.summary
    console.log(`  ${C.dim(`PASS ${s.pass} · STRIP ${s.strip} · CORRUPT ${s.corrupt} · VOID ${s.void}`)}`)
  }
}

function pct(n, d) {
  return d ? `${((n / d) * 100).toFixed(2)}%` : '—'
}

const failOn = flag('fail-on')
if (failOn === 'BROKEN' && failed) {
  console.error(C.red('\nFAIL — at least one block is BROKEN on at least one target'))
  process.exit(1)
}
