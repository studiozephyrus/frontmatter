// The spec gate. Reports drift between specs/, the PRD, and the code.
//
//   node specs/harness/spec-report.mjs              # all specs
//   node specs/harness/spec-report.mjs --id render/fence-dispatch
//   node specs/harness/spec-report.mjs --json
//
// Exit 0 = no findings. Exit 1 = findings. Exit 2 = the harness itself could not run.
//
// Design rules, each taken from a defect this repo has actually shipped:
//   - EXECUTE, never grep. A check that greps source is a proxy and must print PROXY.
//   - FLOORS, not equalities. Adding a spec must never read as a regression.
//   - A missing key is UNKNOWN and skipped, never coerced to a falsy default.
//   - The harness never writes `state:` forward on a spec it could not verify.
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { parse as parseYaml } from 'yaml'

const SPECS = path.resolve('specs')
const args = process.argv.slice(2)
const onlyId = args.includes('--id') ? args[args.indexOf('--id') + 1] : null
const asJson = args.includes('--json')

const sha256 = (buf) => crypto.createHash('sha256').update(buf).digest('hex')

// Approximate token count. Deliberately NOT presented as exact: a real tokenizer is
// not a dependency here, and Claude's tokenizer runs ~30% above cl100k on the same
// text. Budgets are set with that headroom already applied.
const approxTokens = (s) => Math.ceil(s.length / 3.6)

const walkSpecs = (dir) => {
  const out = []
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) {
      // Underscore-prefixed DIRECTORIES are plumbing (_schema, _drift). The skip must
      // never apply to files: an earlier version skipped `_anything.md` too, which meant
      // a spec could be hidden from its own gate by renaming it. A gate with a rename
      // bypass is a gate that reports green while blind.
      if (e.name.startsWith('_') || e.name === 'harness') continue
      out.push(...walkSpecs(p))
    } else if (e.name.endsWith('.md') && e.name !== 'SPECS.md' && e.name !== 'README.md') {
      out.push(p)
    }
  }
  return out
}

const readSpec = (file) => {
  const raw = fs.readFileSync(file, 'utf8')
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw)
  if (!m) return { file, raw, fm: null, body: raw, error: 'no frontmatter block' }
  let fm
  try { fm = parseYaml(m[1]) } catch (e) { return { file, raw, fm: null, body: raw, error: `frontmatter did not parse: ${e.message}` } }
  return { file, raw, fm: fm || {}, body: raw.slice(m[0].length) }
}

if (!fs.existsSync(SPECS)) {
  console.error('no specs/ directory')
  process.exit(2)
}

const files = walkSpecs(SPECS).sort()
const findings = []
const add = (severity, code, id, detail) => findings.push({ severity, code, id, detail })

// A frontmatter value is whatever YAML decided it was, which is not always what the
// author meant: an all-digit sha256 parses as a Number, `state: no` parses as false.
// So every read is type-checked at the point of use. A wrong-typed key is a FINDING,
// never a crash and never coerced to a falsy default.
const str = (v) => (typeof v === 'string' ? v : undefined)
const arr = (v) => (Array.isArray(v) ? v : undefined)

const specs = []
for (const file of files) {
  const s = readSpec(file)
  const rel = path.relative(SPECS, file).replace(/\\/g, '/')
  const derivedId = rel.replace(/\.md$/, '')
  if (s.error) { add('error', 'unparseable', derivedId, s.error); continue }
  s.derivedId = derivedId
  specs.push(s)
}

if (onlyId) {
  const kept = specs.filter((s) => s.derivedId === onlyId)
  if (!kept.length) { console.error(`no spec with id ${onlyId}`); process.exit(2) }
  specs.length = 0
  specs.push(...kept)
}

// --- per-spec checks -------------------------------------------------------
const claimed = new Map() // governs path -> [ids]

for (const s of specs) {
  const { fm, derivedId } = s
  const id = str(fm.id) ?? derivedId

  // One malformed spec must never take down the gate for every other spec — that would
  // turn a single authoring slip into a blind gate.
  try {

  if (fm.spec !== 1) add('error', 'bad-version', id, `spec: expected 1, got ${JSON.stringify(fm.spec)}`)
  if (fm.id !== undefined && str(fm.id) === undefined) {
    add('error', 'bad-type', id, `id must be a string, got ${typeof fm.id}`)
  } else if (fm.id !== undefined && fm.id !== derivedId) {
    add('error', 'id-path-mismatch', id, `id "${fm.id}" != path-derived "${derivedId}". id must equal the path.`)
  }

  const state = str(fm.state) ?? 'draft'
  if (fm.state !== undefined && str(fm.state) === undefined) {
    add('error', 'bad-type', id, `state must be a string, got ${typeof fm.state} (${JSON.stringify(fm.state)})`)
  }
  const budget = typeof fm.budget === 'number' ? fm.budget : undefined
  if (budget !== undefined) {
    const tok = approxTokens(s.raw)
    if (tok > budget) add('warn', 'over-budget', id, `~${tok} tok > budget ${budget}`)
  }

  // PRD binding
  const prdFile = str(fm.prd_file)
  if (fm.prd_file !== undefined && prdFile === undefined) {
    add('error', 'bad-type', id, `prd_file must be a string, got ${typeof fm.prd_file}`)
  } else if (prdFile !== undefined) {
    if (!fs.existsSync(prdFile)) {
      add('error', 'prd-missing', id, `prd_file not found: ${prdFile}`)
    } else if (fm.prd_sha256 !== undefined) {
      const recorded = str(fm.prd_sha256)
      if (recorded === undefined) {
        // An all-digit hash parses as a Number in YAML. Quote it.
        add('error', 'bad-type', id, `prd_sha256 must be a quoted string, got ${typeof fm.prd_sha256}`)
      } else {
        const live = sha256(fs.readFileSync(prdFile))
        if (live !== recorded) {
          add('warn', 'stale-prd', id, `PRD changed since authoring. recorded ${recorded.slice(0, 12)}, live ${live.slice(0, 12)}`)
        }
      }
    }
  }

  // governs
  const governs = (arr(fm.governs) ?? []).filter((g) => typeof g === 'string')
  let matchedAny = false
  for (const glob of governs) {
    let hits = []
    try { hits = [...fs.globSync(glob)] } catch { hits = [] }
    if (!hits.length) add('warn', 'ghost', id, `governs glob matches 0 files: ${glob}`)
    else matchedAny = true
    for (const h of hits) {
      const norm = h.replace(/\\/g, '/')
      if (!claimed.has(norm)) claimed.set(norm, [])
      claimed.get(norm).push(id)
    }
  }

  // state entry conditions — checked, not trusted
  if (['ready', 'in-progress', 'implemented', 'verified'].includes(state)) {
    if (!governs.length) add('error', 'state-unsupported', id, `state: ${state} requires a non-empty governs`)
    if (!(arr(fm.verify) ?? []).length) add('error', 'state-unsupported', id, `state: ${state} requires a non-empty verify`)
  }
  if (['in-progress', 'implemented', 'verified'].includes(state) && governs.length && !matchedAny) {
    add('error', 'state-unsupported', id, `state: ${state} but no governs glob matches any file`)
  }
  if (state === 'verified') {
    const rp = str(fm.red_proof)
    if (!rp) add('error', 'unproven', id, 'state: verified requires red_proof (a test that fails against the unfixed code)')
    else if (!fs.existsSync(rp)) add('error', 'unproven', id, `red_proof not found: ${rp}`)
    // The harness does not execute verify: here — that is npm run verify's job. What it
    // asserts is that the claim is *supportable*, and it refuses a verified state whose
    // evidence is missing.
  }
  if (state === 'superseded' && !fm.superseded_by) {
    add('error', 'state-unsupported', id, 'state: superseded requires superseded_by')
  }

  // depends_on resolution
  for (const dep of (arr(fm.depends_on) ?? [])) {
    if (!specs.some((o) => (str(o.fm.id) ?? o.derivedId) === dep) && !onlyId) {
      add('warn', 'broken-dep', id, `depends_on names an unknown spec: ${dep}`)
    }
  }

  // body sections
  const heads = [...s.body.matchAll(/^##\s+(.+)$/gm)].map((m) => m[1].trim())
  for (const need of ['Contract', 'Invariants', 'Verification']) {
    if (!heads.includes(need)) add('warn', 'missing-section', id, `body has no "## ${need}"`)
  }
  // Invariants must be executable, not a wish.
  const inv = /## Invariants[\s\S]*?(?=\n## |$)/.exec(s.body)?.[0] ?? ''
  const invRows = [...inv.matchAll(/^\|(?!\s*[-:]+\s*\|)(?!\s*#\s*\|).+\|$/gm)]
  if (heads.includes('Invariants') && invRows.length === 0) {
    add('warn', 'prose-invariants', id, 'Invariants has no table rows — an invariant with no executable check is a wish')
  }

  } catch (e) {
    add('error', 'harness-error', id, `the gate threw while checking this spec: ${e.message}`)
  }
}

// --- cross-spec checks -----------------------------------------------------
for (const [p, ids] of claimed) {
  const uniq = [...new Set(ids)]
  if (uniq.length > 1) add('error', 'overlap', uniq.join(' + '), `both claim ${p} — two owners is no owner`)
}

// ungoverned: product modules matched by no spec. Reported as INFO while the spec
// system is being bootstrapped; it becomes a warn once coverage is meaningful.
let moduleFiles = []
try { moduleFiles = [...fs.globSync('src/modules/**/*.ts')].concat([...fs.globSync('src/modules/**/*.tsx')]) } catch { /* none */ }
const governedSet = new Set(claimed.keys())
const ungoverned = moduleFiles.map((f) => f.replace(/\\/g, '/')).filter((f) => !governedSet.has(f))

// --- report ----------------------------------------------------------------
const errors = findings.filter((f) => f.severity === 'error')
const warns = findings.filter((f) => f.severity === 'warn')

if (asJson) {
  console.log(JSON.stringify({
    specs_scanned: specs.length,
    findings,
    ungoverned_count: ungoverned.length,
    module_files: moduleFiles.length,
  }, null, 2))
} else {
  console.log(`specs scanned   ${specs.length}`)
  console.log(`errors          ${errors.length}`)
  console.log(`warnings        ${warns.length}`)
  console.log(`ungoverned      ${ungoverned.length} of ${moduleFiles.length} module files (INFO while bootstrapping)`)
  const byState = {}
  for (const s of specs) { const st = s.fm.state ?? 'draft'; byState[st] = (byState[st] || 0) + 1 }
  console.log(`states          ${Object.entries(byState).map(([k, v]) => `${k}=${v}`).join(' ') || '(none)'}`)
  if (findings.length) {
    console.log('')
    for (const f of [...errors, ...warns]) {
      console.log(`  ${f.severity === 'error' ? 'ERROR' : 'warn '}  ${f.code.padEnd(18)} ${f.id}`)
      console.log(`         ${f.detail}`)
    }
  }
}

// A floor, not an equality: adding a spec must never read as a regression.
const MIN_SPECS = 1
if (specs.length < MIN_SPECS) {
  console.error(`\nspecs_scanned ${specs.length} < floor ${MIN_SPECS} — the gate is blind, refusing to report green`)
  process.exit(2)
}
if (!asJson) console.log(`\n${errors.length === 0 ? 'SPECS OK' : 'SPECS FAILED'} — ${specs.length} scanned, ${errors.length} errors, ${warns.length} warnings`)
process.exit(errors.length === 0 ? 0 : 1)
