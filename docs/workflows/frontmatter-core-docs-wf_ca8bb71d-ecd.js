// SPAWN-GATE: q1=y q2=y q3=y
export const meta = {
  name: 'frontmatter-core-docs',
  description: 'Generate the missing core product documentation set, grounded in reads of the actual code',
  phases: [{ title: 'Author', detail: 'nine agents, disjoint files, each reads before writing' }],
}

const REPO = '/Users/sagnikmitra/Desktop/GitHub/frontmatter'
const HEAD = 'e318ab3'

const COMMON = `You are documenting **frontmatter**, a byte-exact markdown editor for repositories
whose documents are increasingly written by AI agents. Studio Zephyrus, a two-person studio in India.
Repo root: ${REPO}. Current HEAD: ${HEAD}, branch engine/plan-and-diagnostics.

## Ground truth you must establish yourself

**Read the code before you write a word about it.** 226 TypeScript files under src/, 14 modules,
81 test files, 12 API route handlers. Hexagonal modular monolith; the layer rule is
domain <- application <- infrastructure, with presentation and container above, inward only.

Start with: \`cat ${REPO}/AGENTS.md\` (221 lines, the operating rules, already accurate) and
\`cat ${REPO}/package.json\`. Then read the actual files your document covers.

## Non-negotiable rules

1. **Never describe a capability the code does not have.** If something is designed but unbuilt,
   say so in those words and give the evidence (a grep that returns zero, a file that does not exist).
2. **Every quantitative claim comes from a command you ran**, never from recollection. Where you
   counted something, say what you counted and how.
3. **Never read or print a .env file or any secret value.** Environment variable NAMES only.
4. **Mark anything you could not verify as \`**unverified**\`.** An honest gap beats a plausible fiction.
5. **British spelling** — behaviour, licence (noun), recognise, artefact.
6. Plain prose. No marketing verbs (leverage, unlock, seamless, robust, empower, streamline), no
   "it is important to note", no "not just X but Y". The reader is the founder.

## Every file you write starts with this front matter

\`\`\`markdown
---
mode: reference
updated: 2026-09-09
verified_against: ${HEAD}
---

# <TITLE>

> **Method.** <what you read, what you ran, and explicitly what you did NOT do.>
\`\`\`

The Method line is not decoration. State the negative: what this pass did not check.

## Known context you should not contradict

- The plan is \`docs/PRODUCT-BRIEF.md\` (560 lines, safe to read whole). The headline claim
  (review state) is under test and failed an adversarial round on 2026-09-08.
- \`docs/PRODUCT-BRIEF.md\` §9 lists eleven known technical problems including: NF-1 (column-zero
  list item in frontmatter refuses 83% of real vaults), NF-3 (bare-CR fence), no CI, the engine
  being largely unwired, the byte budget being an \`echo\`, no bring-your-own key, and
  \`src-tauri\` still carrying the sibling app's identity (\`ai.sgnk.md\`).
- The editor shell is a **fork of a sibling product (sgnk-md)**: 41 of 43 files in
  src/modules/editor and src/modules/app-shell were byte-identical to it. \`src/modules/mdmax\`
  is the part this product owns.
- **Do NOT open these — they will blow your context:** docs/FRONTMATTER-PRD-v2-2026-08-29.md
  (760 KB), docs/FRONTMATTER-RECORD.md (2.1 MB), docs/FRONTMATTER-COMPLETE-RECORD-2026-08-30.md
  (3.4 MB), docs/ENGINE.md, docs/CRITIQUE.md, docs/DEV-PLAN.md (~250 KB each).
  \`grep -n\` then \`sed -n 'A,Bp'\`.

Write the files with the Write tool. Return only a short summary.`

const SUMMARY = {
  type: 'object', additionalProperties: false,
  required: ['files_written', 'what_i_read', 'verified_claims', 'unverified_or_missing', 'defects_found'],
  properties: {
    files_written: { type: 'array', items: { type: 'string' } },
    what_i_read: { type: 'string' },
    verified_claims: { type: 'array', items: { type: 'string' }, description: 'Facts established by a command, with the number.' },
    unverified_or_missing: { type: 'array', items: { type: 'string' } },
    defects_found: { type: 'array', items: { type: 'string' }, description: 'Actual defects, not documentation gaps.' },
  },
}

const JOBS = [
  { k: 'exec', f: 'docs/00-EXECUTIVE-SUMMARY.md',
    p: `Write **docs/00-EXECUTIVE-SUMMARY.md**. What frontmatter is, what state it is actually in, and
what a newcomer should worry about. Read docs/PRODUCT-BRIEF.md in full (560 lines) and
docs/GAPS-2026-09-08.md (21 KB). Cover: the one-paragraph definition; the three load-bearing
technical commitments (projection law, splice-only writing with refusal, review state in a
sidecar); honest maturity — what runs, what is designed and unbuilt; the measured engineering
rate (1.21 days per calendar week) and what it means for any schedule; and the top five risks.
Be blunt. The plan's own headline failed its adversarial round and the summary must say so.` },

  { k: 'domain', f: 'docs/01-PRODUCT-AND-DOMAIN.md + docs/15-GLOSSARY.md',
    p: `Write **docs/01-PRODUCT-AND-DOMAIN.md** and **docs/15-GLOSSARY.md**.
The domain document: the entities this product reasons about (document, span, review state,
sidecar, splice, refusal, attribution, vault, repository), who the users are, and the core loop.
Ground it in src/modules/ — list the 14 modules and say what domain concept each owns; read each
module's domain layer to do that, not its name.
The glossary: every term a newcomer would not know, including the ones specific to this codebase
(MDMAX, SAFE_KEY, NF-1, splice, carrier, projection law, byte budget, certificate). Short entries.` },

  { k: 'data', f: 'docs/03-DATA-MODEL.md',
    p: `Write **docs/03-DATA-MODEL.md**. Read the actual schema and types: look for prisma/,
firestore.rules, any *.sql, src/modules/*/domain/ type definitions, and the IndexedDB / local
storage keys. AGENTS.md §8 names several persistence keys that deliberately keep a legacy
\`sgnk-md\` prefix — document every one and say plainly that renaming them orphans a user's local
drafts.
Cover: every persisted shape, where it lives (browser IndexedDB, localStorage, the repo sidecar,
Firestore if any), and its lifecycle. \`firestore.rules\` is committed and designs document
holding — check with a grep whether ANY Firestore write actually exists in src/ and report the
count. If it is zero, say the design is committed and unbuilt.` },

  { k: 'api', f: 'docs/04-API-REFERENCE.md',
    p: `Write **docs/04-API-REFERENCE.md**. Read every route handler under src/app/api/ — there are
12. For each: method, path, what it does, auth requirement, request shape, response shape, and
error behaviour. Read the file; do not infer from the path.
Also document src/proxy.ts, because AGENTS.md §1 says any new file in public/ must be
allowlisted by \`PUBLIC_STATIC_RE\` there and that this has broken things three or more times.
State the current allowed extension list, read from the file.` },

  { k: 'fe-be', f: 'docs/05-FRONTEND-SPEC.md + docs/06-BACKEND-SPEC.md',
    p: `Write **docs/05-FRONTEND-SPEC.md** and **docs/06-BACKEND-SPEC.md**.
Frontend: the route groups under src/app/ ((auth), (public), (vault), (workspace)), the editor
module, state management (AGENTS.md §9 warns about Zustand selector stability and an editor tab
race — document both as live constraints), and any dead or unreachable code you can evidence.
Backend: module by module through src/modules/, the container/composition root at
src/container/dependency-container.ts, and the layer boundaries. Say which modules are thin
wrappers and which carry real logic — evidence it with file counts and line counts.` },

  { k: 'integ-env', f: 'docs/07-INTEGRATIONS.md + docs/09-ENVIRONMENT.md',
    p: `Write **docs/07-INTEGRATIONS.md** and **docs/09-ENVIRONMENT.md**.
Integrations: every third party and what breaks without it — GitHub (OAuth and the REST API),
the AI providers, Vercel, Firebase, Cloudflare, and the PDF/chromium path. For each: what it is
used for, where the code touches it, and the failure mode when it is unavailable.
Environment: every variable **by name only** — never a value. Grep for process.env across src/
and list every name found, where it is read, and whether it is required or optional. AGENTS.md
§6 says process.env may be read ONLY in src/config/ and */infrastructure/ — verify that with a
grep and report any violation as a defect.` },

  { k: 'setup-deploy', f: 'docs/10-LOCAL-SETUP.md + docs/11-DEPLOYMENT.md + docs/29-RUNBOOK.md',
    p: `Write **docs/10-LOCAL-SETUP.md**, **docs/11-DEPLOYMENT.md** and **docs/29-RUNBOOK.md**.
Local setup: clone, install, env, run — the literal commands, in order, with the traps. Read
package.json (26 scripts) and AGENTS.md §6. Note that \`npm run budget\` is an \`echo\` and that
\`mdmax cert\` is not among the scripts.
Deployment: how the Next.js app ships (Vercel, team \`zsco\`, project \`frontmatter\`, per
AGENTS.md §6b), and separately how the static decisions site ships (a different Vercel project,
\`frontmatter-decisions\`, deployed by POST to /v13/deployments). Include the rollback path.
Runbook: symptom to cause. Seed it from AGENTS.md §9's recurring traps and §1's proxy failure
(a new public asset 307-redirecting to /login), plus: verifying a deployed URL with
\`curl -sI\` and never \`curl -sL\`, because a login page returns 200 after a redirect.` },

  { k: 'sec-debt', f: 'docs/12-SECURITY-REVIEW.md + docs/13-TECH-DEBT.md',
    p: `Write **docs/12-SECURITY-REVIEW.md** and **docs/13-TECH-DEBT.md**.
Security: findings with severity. Read src/proxy.ts and the auth module; check what
\`isPublicPath()\` admits. Read firestore.rules and report exactly what it permits — it is
believed to design unauthenticated public reads of content snapshots, so verify that against the
file and quote the rule. Scan the repo history for secret-shaped strings and report the result
honestly, naming false positives rather than just counting hits. Record as an open item, marked
so, that two GitHub personal access tokens were pasted into a chat window and remain unrotated —
this is inherited and only the founder can close it.
Tech debt: sequenced, with cost. Ground it in docs/PRODUCT-BRIEF.md §9's eleven items — verify
each against the code and mark which are still true at ${HEAD}. Add the fork problem: check how
many files under src/ are byte-identical to the sibling repo if you can find it, and if you
cannot, say so rather than repeating the 41-of-43 figure unverified.` },

  { k: 'test-map', f: 'docs/14-TESTING.md + docs/17-CODEMAP.md',
    p: `Write **docs/14-TESTING.md** and **docs/17-CODEMAP.md**.
Testing: run \`npm run test\` and report what actually happens — pass and fail counts, duration,
and any skipped or todo tests. Then say what is covered and, more usefully, what is deliberately
NOT. There are 81 test files against 226 source files; identify the modules with no test at all
by listing both sets and diffing them. AGENTS.md rule 1 says a test on a rare fault proves
nothing until it fails against the unfixed code — carry that into the strategy section.
Also note \`npm run corpus\` (8,513 byte-pinned files, exits 1 on one changed byte) and
\`npm run spec\`, and report whether each actually runs.
Codemap: every directory under src/ and every file, one line each, generated from a real listing.
Group by module. Keep each line to one sentence.` },
]

phase('Author')
const out = (await parallel(JOBS.map((j) => () =>
  agent(`${COMMON}\n\n---\n\n## YOUR FILES (nobody else touches these)\n\n${j.f}\n\n${j.p}`,
    { label: `doc:${j.k}`, phase: 'Author', schema: SUMMARY, effort: 'high' })
))).filter(Boolean)

log(`${out.length}/${JOBS.length} doc jobs done · ${out.reduce((s, o) => s + o.files_written.length, 0)} files · ${out.reduce((s, o) => s + o.defects_found.length, 0)} defects found`)

return {
  jobs: out.length,
  files: out.flatMap((o) => o.files_written),
  defects: out.flatMap((o) => o.defects_found),
  unverified: out.flatMap((o) => o.unverified_or_missing),
  detail: out,
}
