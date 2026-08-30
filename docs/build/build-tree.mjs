// Build the markdown tree from the banked agent reports.
//
//   node docs/build/build-tree.mjs
//
// Re-runnable. Every Tier-1 file in `docs/MAP.md` is DERIVED from
// `docs/research/agent-reports-2026-08-30/` by this script, so a re-run after
// more agents land is the whole update procedure. Nothing is hand-edited into
// these files; if a section is wrong, the fix goes in the report and this runs
// again. That is the projection law applied to our own documentation.
//
// NUMBERING. The agents were given global section numbers. They are preserved
// verbatim, because every cross-reference an agent wrote points at them:
//
//     PRD             §0–66    product, market, why
//     ENGINE.md       §67–80   audit (r15) + design (r16)
//     BUSINESS.md     §81–88   the gaps round 14 found, plus the war-game
//     VERIFICATION.md §89      every load-bearing claim, opened
//     PRODUCT.md      §90–97   the founding-session substrate
//     DEV-PLAN.md  §1–13    LOCAL run — cite as `DEV-PLAN §5`
//     REFERENCES   §1–7     LOCAL run — cite as `REFERENCES §3`
//
// The two local-run files are renumbered onto the tail by assemble-tree.mjs.
// The three global-run files must renumber to themselves; that is asserted.
import fs from 'node:fs'

const R = 'docs/research/agent-reports-2026-08-30'
// Agents sometimes emit a line of process commentary before their heading despite
// being told not to. Anything before the first heading is not the section, so it goes.
const read = (f) => {
  const raw = fs.readFileSync(`${R}/${f}`, 'utf8').trimEnd()
  const i = raw.search(/^#{1,3}\s/m)
  return i > 0 ? raw.slice(i) : raw
}
const has = (f) => fs.existsSync(`${R}/${f}`)

const stamp = '2026-08-30'
const missing = []
const built = []

// Take a report file, or record it missing and return null.
const part = (f) => {
  if (!has(f)) { missing.push(f); return null }
  return read(f)
}

// Renumber a block's FIRST `## N.` heading to `to`, preserving the title.
// Anchored with /m and replaced once — a bare `^` without the flag silently
// no-ops on any block that does not start exactly at the heading, which is how
// REFERENCES §23 escaped renumbering on the first run.
const renumber = (block, to) => {
  const out = block.replace(/^##\s+\d+\.\s*/m, `## ${to}. `)
  if (out === block) throw new Error(`renumber found no '## N.' heading for §${to}`)
  return out
}

const head = (title, sub, lines) =>
  ['---', `updated: ${stamp}`, 'generated_by: docs/build/build-tree.mjs', '---', '',
    `# ${title}`, '', sub, '', ...lines, '', '---', ''].join('\n')

// ---------------------------------------------------------------- PRD §61–66
// r13's six sections continue the PRD's own run. They are appended, not merged,
// so the PRD's first 61 sections stay byte-identical to what was committed.
{
  const PRD = 'docs/FRONTMATTER-PRD-v2-2026-08-29.md'
  const files = [
    'r13-s1-unified-system.md', 'r13-s2-aios-deep-integration.md',
    'r13-s3-personas-jtbd.md', 'r13-s4-positioning-messaging.md',
    'r13-s5-markdown-thesis.md', 'r13-s6-remaining-unknowns.md',
  ]
  const blocks = files.map(part).filter(Boolean)
  if (blocks.length === files.length) {
    let prd = fs.readFileSync(PRD, 'utf8')
    const highest = Math.max(...[...prd.matchAll(/^##\s+(\d+)\./gm)].map((m) => Number(m[1])))
    if (highest < 61) {
      prd = prd.trimEnd() + '\n\n---\n\n' + blocks.join('\n\n---\n\n') + '\n'
      fs.writeFileSync(PRD, prd)
      built.push(`PRD §61–66 appended (was §0–${highest})`)
    } else {
      built.push(`PRD already carries §61+ — left alone`)
    }
  }
}

// -------------------------------------------------------------- ENGINE §67–80
{
  const audit = ['e1-code-audit', 'e2-capability-vs-claim', 'e3-engine-competition',
    'e4-performance', 'e5-wiring', 'e6-enhancement-roadmap',
    'e7-certificate-as-product', 'e8-engine-experience'].map((s) => part(`r15-${s}.md`))
  const design = ['f1-key-addressability', 'f2-body-span-splice', 'f3-anchor-system',
    'f4-property-testing', 'f5-incremental-parsing',
    'f6-engine-api-versioning'].map((s) => part(`r16-${s}.md`))
  const blocks = [...audit, ...design].filter(Boolean)
  if (blocks.length) {
    fs.writeFileSync('docs/ENGINE.md', head(
      'ENGINE — MDMAX, audited and designed',
      '**Tier 1. Read the section, never the file.** The engine is the differentiation; ' +
      'everything else in the product is buyable. §67–74 is what exists and what is wrong with it. ' +
      '§75–80 is the design for what it must become.',
      ['> **Before you change engine code:** `specs/engine/splice-writer.md` owns the byte contract, ' +
       'and each defect spec owns its own red proof. This file explains; the spec governs.',
       '',
       `> ${blocks.length} of 14 sections present.` +
       (blocks.length < 14 ? ' The rest are still being written.' : '')],
    ) + blocks.join('\n\n---\n\n') + '\n')
    built.push(`ENGINE.md — ${blocks.length}/14 sections`)
  }
}

// ------------------------------------------------------------ BUSINESS §81–87
{
  const blocks = ['h1-comms-channel', 'h2-churn-and-retention-economics',
    'h3-pricing-experiments', 'h4-refunds-lifecycle', 'h5-business-operations',
    'h6-plugin-tension', 'h7-content-seo-distribution']
    .map((s) => part(`r17-${s}.md`)).filter(Boolean)
  // §88 is two agents' output merged: the scenarios and the kill-shots. The second was
  // told to number its H3s 88.9 onward and carries a placeholder `## 88b.` heading, which
  // is stripped here — one section, two authors.
  const war = part('r18-w1-competitor-response.md')
  const kill = part('r18-w2-kill-shots.md')
  if (war) blocks.push(kill ? war + '\n\n' + kill.replace(/^##\s+88b\..*\n+/m, '') : war)

  if (blocks.length) {
    fs.writeFileSync('docs/BUSINESS.md', head(
      'BUSINESS — the parts nobody adds up',
      '**Tier 1.** Round 14 swept the record for what thirteen rounds had never asked, and these ' +
      'seven came back, and §88 adds the war-game that thirteen rounds never ran. They are not ' +
      'softer than the engineering; a product with no route to tell a user about a breaking change ' +
      'has an operational defect, not a marketing gap.',
      ['> Every number here obeys PRD §57: re-derive at write time. Every public claim obeys PRD §58.'],
    ) + blocks.join('\n\n---\n\n') + '\n')
    built.push(`BUSINESS.md — ${blocks.length}/8 sections`)
  }
}

// ------------------------------------------------------------ VERIFICATION §89
{
  const b = part('r18-ledger-synthesis.md')
  if (b) {
    fs.writeFileSync('docs/VERIFICATION.md', head(
      'VERIFICATION — every load-bearing claim, opened',
      '**Tier 1.** Twenty-one claims the record leans on were carrying no primary source. This is ' +
      'what happened when someone opened one for each. Read it before quoting any number at all.',
      ['> A REVISED verdict is worth more than a CONFIRMED one: it means the record said something ' +
       'nearly right, and nearly right is what ships wrong.'],
    ) + b + '\n')
    built.push('VERIFICATION.md — §89')
  }
}

// -------------------------------------------------------------- PRODUCT §90–97
{
  const blocks = ['p1-ai-economics', 'p2-offline-or-online', 'p3-dogfooding',
    'p4-credits-and-limits', 'p5-feature-inventory', 'p6-mvp-staging',
    'p7-critique-frames', 'session-pack']
    .map((s) => part(`r19-${s}.md`)).filter(Boolean)
  if (blocks.length) {
    fs.writeFileSync('docs/PRODUCT.md', head(
      'PRODUCT — the founding-session substrate',
      '**Tier 1, and the one to open first when the question is "what are we building".** Everything ' +
      'else in the tree is evidence. This is the decision surface: what the AI actually costs, whether ' +
      'the app is offline or online, every feature that has ever been proposed, where the MVP line ' +
      'falls, and how to attack all of it.',
      ['> **§97 is the operating manual.** It carries the decision queue in dependency order and a ' +
       'copy-pasteable brief for handing this whole record to a fresh AI assistant.',
       '',
       `> ${blocks.length} of 8 sections present.` +
       (blocks.length < 8 ? ' The rest are still being written.' : '')],
    ) + blocks.join('\n\n---\n\n') + '\n')
    built.push(`PRODUCT.md — ${blocks.length}/8 sections`)
  }
}

// ---------------------------------------------------------- DEV-PLAN §1–13
{
  const layers = ['d1-frontend', 'd2-api', 'd3-database', 'd4-auth-permissions',
    'd5-live-editing', 'd6-hosting-deployment', 'd7-cicd', 'd8-security',
    'd9-caching-cdn', 'd10-scaling', 'd11-observability-dr']
    .map((s) => part(`devplan-${s}.md`)).filter(Boolean)

  const intro = `## 1. How to build from this

This plan is executed through \`specs/\`, not through this document. A layer is not done
because it feels done; it is done when its spec reaches \`state: verified\`, which the
harness writes only after every \`verify:\` command exits 0 **and** a red proof exists that
fails against the unfixed code.

\`\`\`bash
npm run spec      # the contract gate — 0 errors required
npm run corpus    # 8,513 foreign files, byte-pinned, exits 1 on one changed byte
npm run verify    # typecheck → lint → test → build → arch → spec
\`\`\`

| Rule | Why it is a rule and not a preference |
|---|---|
| **Red proof before green** | A test on a rare fault proves nothing until it fails against unfixed code. If you cannot make it fail, say the test does not cover the bug. |
| **Refuse rather than guess** | Returning the input unchanged is a correct outcome. \`diff-match-patch\` returns \`true\` after corrupting a document; that is the failure mode this product exists to not have. |
| **Re-derive every number at write time** | PRD §57 is the list of what happened when we did not. |
| **Agents propose, the founder merges** | \`git rev-parse HEAD\` before and after every agent run, reconciled. The instruction not to commit is advisory; the reconciliation is the gate. |

**Citing this file.** Its sections are a local run. Write \`DEV-PLAN §5\`, never a bare \`§5\` —
the PRD, \`ENGINE.md\` and \`BUSINESS.md\` share one global run §0–87 and a bare number
resolves there.

## 2. The architecture this plan builds on

Settled. Do not re-litigate any row; each was closed on measured or fetched evidence, and
the evidence is in the PRD section named.

| # | Decision | Where the evidence is |
|---|---|---|
| Truth | **Documents live in the user's git repo and never move.** The file is the only source of truth; every view is a deterministic, reversible projection owning no state | PRD §5 |
| Sync | **Git three-way merge + an append-only splice journal + compare-and-swap.** Never a CRDT for document bytes — a CRDT cannot own the bytes, CRDTs interleave concurrent insertions, and a CRDT cannot refuse | PRD §31.1 |
| Control plane | **One Postgres holding zero document bytes**: identity, tenancy, entitlements, billing, publish-slug uniqueness, audit, jobs | DEV-PLAN §5 |
| Blobs | **Cloudflare R2** for attachments over 1 MB and derived artifacts. Free egress is load-bearing, and R2 has no object versioning — so disaster recovery must be built into the key layout | DEV-PLAN §13 |
| Tenancy | **\`workspace_id\` on every row, pooled RLS, from day one.** The GitHub App installation is the *connector*, never the tenant identity. Retrofitting this after launch is the highest-cost change on the board | DEV-PLAN §6 |
| Search | Stop shipping whole-vault snapshots. Postgres full-text + trigram server-side, MiniSearch client-side only | DEV-PLAN §5 |
| Execution | **No arbitrary client-side code execution, ever.** That lane is refused, and refusing it is what makes the plugin question hard — see BUSINESS §86 | PRD §18 |
| Engine | MDMAX wires in as **four ordered seams**: ingress gate (live) → write gate → splice engine → certificate. Do not wire the write gate before NF-1/NF-3 — at the measured refusal rate it would reject 83% of foreign publishes | ENGINE §71 |

**What is already in the repo**, as of ${stamp}: Next 16.2.6, React 19.2.6, CodeMirror 6,
unified/remark/rehype, next-auth v5, AI SDK v6 across five providers, Tauri v2 — 226 TypeScript
files, 25,407 lines, 98 test files, 1,575 tests, and no CI at all.

**The constraints that shape every answer below.** One founder. India-based, selling globally.
Cost must be near-zero at 100 users and predictable at 10,000. Boring, managed and swappable
beats clever. Every component has to be operable by one person on call — which is a design
constraint, not a wish.`

  if (layers.length) {
    fs.writeFileSync('docs/DEV-PLAN.md', head(
      'DEV-PLAN — the engineering plan',
      '**Tier 1. Read the section, never the file.** Every layer of the stack: what we pick, the ' +
      'alternative rejected, why, what it costs, and what would make us change our mind.',
      [`> ${layers.length} of 11 layers present.` +
       (layers.length < 11 ? ' The rest are still being written.' : '')],
    ) + intro + '\n\n---\n\n' + layers.join('\n\n---\n\n') + '\n')
    built.push(`DEV-PLAN.md — ${layers.length}/11 layers + §1–2`)
  }
}

// ---------------------------------------------------------- REFERENCES §1–7
{
  const src = ['g1-final-gap-sweep', 'g2-reference-implementations', 'g3-design-references',
    'g4-build-vs-buy', 'g5-competitive-engineering', 'g6-market-audience-remaining',
    'g7-build-sequence'].map((s) => part(`r14-${s}.md`)).filter(Boolean)
  if (src.length) {
    const blocks = src.map((b, i) => renumber(b, i + 1))
    fs.writeFileSync('docs/REFERENCES.md', head(
      'REFERENCES — what to read, what to copy, what to buy',
      '**Tier 1.** The output of the round-14 sweep: the codebases worth reading, the design work ' +
      'worth stealing from, the components we should buy rather than build, and what the sweep ' +
      'found we had never researched at all.',
      ['> Sections here are a **local** run. Cite as `REFERENCES §3`, never a bare `§3`.'],
    ) + blocks.join('\n\n---\n\n') + '\n')
    built.push(`REFERENCES.md — ${blocks.length}/7 sections`)
  }
}

// ------------------------------------------------------------------- report
console.log('built:')
for (const b of built) console.log(`  ${b}`)
if (missing.length) {
  console.log(`\nnot yet written (${missing.length}):`)
  for (const m of missing) console.log(`  ${m}`)
}
console.log(`\n${missing.length === 0 ? 'TREE COMPLETE' : `TREE PARTIAL — ${missing.length} reports pending`}`)
