// SPAWN-GATE: q1=y q2=y q3=y
export const meta = {
  name: 'frontmatter-r15-mdmax-engine',
  description: 'Deep audit of the MDMAX engine: what is built, what is wrong, how to enhance it, how the product uses it',
  phases: [
    { title: 'Audit', detail: 'read every line, assess what is actually there' },
    { title: 'Enhance', detail: 'the roadmap, the wiring, the product surface' },
  ],
}

const FM = '/Users/sagnikmitra/Desktop/GitHub/frontmatter/'
const MD = FM + 'src/modules/mdmax/'
const PRD = FM + 'docs/FRONTMATTER-PRD-v2-2026-08-29.md'

const HOUSE = [
  '',
  'YOU ARE WRITING A FINISHED SECTION of an engineering document a founder will print and build from, with Claude as the implementer.',
  '',
  'STYLE: exact H2 heading given; H3 subsections; table-first; real file paths, real function names, real line-level detail, real numbers. NO preamble, NO conclusion, NO process commentary. Evidence tags on every claim: [measured] you executed or read it here, [fetched] primary source opened, [SS] search summary which may NOT be published as fact, [derived] arithmetic shown, [inference] reasoning. Cite a path plus a verbatim symbol or pattern, NEVER a line number alone — line numbers rot within a week. Every recommendation carries its anti-recommendation. At most one bolded sentence per section. Mermaid diagram only where it earns its place, under 12 nodes.',
  '',
  'WHAT MDMAX IS: the markdown engine inside a product whose entire differentiation rests on it. 13 files, 3,614 lines under ' + MD + ' plus the splice writer at ' + FM + 'src/modules/share/domain/splice-frontmatter.ts and the CLI at ' + FM + 'scripts/mdmax-cert.mjs. Tests at ' + FM + 'test/mdmax/.',
  '',
  'THE CONTRACT IT ENFORCES: locate the target byte range, replace exactly those bytes, leave every other byte bit-identical. Never regenerate from a parse tree. If the range cannot be located unambiguously, REFUSE and return the input unchanged. Plus a degradation certificate measuring how a file renders across 7 real markdown engines.',
  '',
  'MEASURED STATE, do not re-derive but DO verify if you can: 8,513 third-party files across 7 vaults produce 0 corruption and 0 throws; but 83 percent publish-refusals from one YAML defect (a block sequence at column zero). Twelve of the thirteen files have ZERO product importers — only decodeStrict from shape-gate is used, by get-snapshot.ts and search-index.ts. There is no CI. mdmax/fold@1 has never been run over the pinned corpus.',
  '',
  'SETTLED, do not re-litigate: no new markdown format; profiles over valid CommonMark that degrade in a dumb renderer; never a tree-of-record; the render carrier is a blockquote callout for prose and a fenced code block for opaque data; no arbitrary client-side code execution.',
  '',
  'Use curl freely for library and spec checks — WebFetch is gate-refused here, curl is not.',
  '',
  'HARD CONSTRAINTS (RULE 4): read-only. No file writes, no commits, no mutating commands. You MAY run node/python to measure, and read any file.',
  'EMIT EARLY: full section text as your FIRST substantial message. If a hook interrupts, answer in ONE line then RE-STATE THE FULL TEXT.',
  'Target 2200-3200 words. Your entire final message IS the section text.',
].join('\n')

phase('Audit')

const AUDIT = [
  ['e1-code-audit',
   'Write "## 67. MDMAX as built — a line-level audit".\n\nRead EVERY file under ' + MD + ' in full: domain/cert-contract.ts, constructs.ts, fold.ts, frontmatter-prepass.ts, normalize.ts, offsets.ts, placement.ts, shape-gate.ts, slug.ts, targets.ts, verdict.ts, application/certify.ts, infrastructure/bench.ts. Also read ' + FM + 'src/modules/share/domain/splice-frontmatter.ts and ' + FM + 'scripts/mdmax-cert.mjs.\n\nProduce: (1) A per-file table: FILE | LINES | WHAT IT ACTUALLY DOES | PUBLIC EXPORTS | QUALITY (A-D) | CONCERNS. Judge quality on: does it do what its name says, are the invariants enforced or merely commented, does it refuse correctly, is it pure. (2) The defect list — real bugs, dead code, unreachable branches, TODOs, silent coercions, unhandled cases — each with the path and verbatim pattern. (3) Where the code contradicts its own comments or the PRD. (4) Dead or vestigial code that should be deleted, with the case for deleting it. (5) The three files most in need of work, ranked, with why. Be adversarial: this engine is the moat and nobody has audited it as code.'],

  ['e2-capability-vs-claim',
   'Write "## 68. What the engine can actually do, versus what we claim".\n\nRead the same files as the audit, plus ' + FM + 'test/mdmax/ in full, and ' + PRD + ' sections 7.1 and 58.\n\nFor every capability the PRD or marketing asserts, find the code that implements it and the test that proves it, then classify: PROVEN (code plus a test that would fail without it), IMPLEMENTED (code, no real test), PARTIAL, ASPIRATIONAL (claimed, not built).\n\nProduce: (1) The claim-to-code-to-test matrix. (2) Claims we make that the code does not support — the dangerous list. (3) Capabilities the code HAS that we do not claim or use — the hidden-asset list. (4) Test coverage assessment: what the 10 test files actually assert, and the biggest untested surface. (5) The specific tests that must exist before any fidelity number is published, given the 83 percent refusal rate makes current numbers false. (6) Whether the certificate can be independently reproduced by a third party from what we ship, since a certificate nobody can check has no defensibility.'],

  ['e3-engine-competition',
   'Write "## 69. The engine landscape — what other markdown engines do that we do not".\n\nResearch with curl: remark and micromark and their utils, mdast-util-to-markdown, markdown-it, cmark and cmark-gfm, comrak, goldmark, pulldown-cmark, markdown-rs, tree-sitter-markdown, lezer-markdown, Pandoc readers and writers, prettier markdown formatter, dprint, mdformat, remark-stringify, and any engine claiming round-trip or source-preservation.\n\nThe question that matters: WHO ELSE PRESERVES SOURCE? Find every project that attempts byte-preserving or source-position-faithful markdown editing and assess how far they got. Check tree-sitter and lezer for incremental parsing with byte offsets, and any Rust or Go engine exposing spans.\n\nProduce: (1) The engine comparison on the axes that matter to us: byte-accurate positions, incremental reparse, source preservation on write, extension API, CommonMark conformance, licence, current version and date. (2) Who is closest to our contract and how close. (3) Techniques from other engines we should adopt, named specifically. (4) What we do that nobody else does, stated carefully — this is a defensibility claim and must survive scrutiny. (5) The build-vs-adopt question: is there an engine we should be building ON instead of beside.'],

  ['e4-performance',
   'Write "## 70. Engine performance and correctness under load".\n\nRead ' + MD + 'domain/shape-gate.ts and infrastructure/bench.ts. The known measured facts: a wikilink regex at k=1.98 taking 36,865 ms on 320 KB of open brackets; mdast-util-from-markdown at 12,429 ms versus micromark at 1,207 ms, a 10.3x gap; MAX_BYTES 4MB and MAX_LINES 200,000 limits; only 67 of 1,080 corpus files have bytes equal to UTF-16 units.\n\nIf you can, MEASURE: run node against the pinned corpus at ' + FM + 'test/corpus/foreign/_vendor/ (8,513 files) or a sample, and time the engine paths. Report what you actually ran.\n\nProduce: (1) The performance budget per engine operation with a target and the justification. (2) The known quadratics and pathological inputs, each with the guard that catches it and whether that guard is tested. (3) The correctness risks under scale: very large files, deeply nested structures, adversarial input, multi-byte boundaries. (4) A benchmark suite design: what to measure, on what corpus, asserted how, run when. (5) Where the engine will be too slow for a live editor, and the mitigation. (6) Anti-recommendations: optimisations that would compromise the byte contract.'],
]

const audit = await parallel(AUDIT.map((x) => () => agent(x[1] + HOUSE, { label: x[0], phase: 'Audit' })))

phase('Enhance')

const ENHANCE = [
  ['e5-wiring',
   'Write "## 71. Wiring MDMAX into the product".\n\nTwelve of thirteen files have zero product importers. This section is the integration plan, concrete enough to implement from.\n\nRead ' + MD + ' fully, plus ' + FM + 'src/modules/repository/, src/modules/share/, src/modules/vault/, src/modules/preview/, and ' + PRD + ' section 7.3.\n\nThe four seams are: ingress gate (live), write gate, splice engine, certificate. For EACH seam produce: the exact call site with file path, the function signature at the boundary, what it asserts, what it does on refusal, the error surfaced to the user, the test that proves it, and the ordering constraint. Note the hard rule that the write gate must not land before the zero-indent-sequence defect is fixed or it rejects 83 percent of foreign vault publishes.\n\nAlso: (1) The module boundary rule — MDMAX exports pure functions over bytes and imports nothing from src/modules. How is that enforced today and is the enforcement real. (2) The API MDMAX should expose to the app, designed rather than accreted. (3) What has to change INSIDE mdmax to be usable by the app. (4) A mermaid diagram of the seams. (5) The order of work with a verification gate per step.'],

  ['e6-enhancement-roadmap',
   'Write "## 72. Enhancing the engine — the roadmap".\n\nGiven the audit, what should MDMAX become over the next year.\n\nCover, at minimum: fixing the four known YAML defects and what is structurally needed beyond patches; incremental parsing and whether lezer should replace or complement the current path; extending the splice contract from frontmatter to body spans, which is what every render profile write-back needs; the anchor system for AI edits that survive human edits; the certificate becoming continuously verifiable rather than a one-shot; construct detection completeness; the fold and equivalence model that has never been run over the pinned corpus; multi-file and vault-level operations; and streaming for large documents.\n\nFor each: what it unlocks in the PRODUCT, the effort in founder-weeks, the risk, and the dependency order. Then: (1) The ranked roadmap with a rationale for the ordering. (2) The three enhancements with the highest product leverage per week of work. (3) What we should NOT build into the engine, and why the boundary sits there. (4) The engine version and compatibility policy, since profiles and certificates will be versioned artifacts other tools may consume.'],

  ['e7-certificate-as-product',
   'Write "## 73. The degradation certificate as a product surface".\n\nThe certificate is the most unusual thing we have and it is currently a CLI nobody runs. Design it as a product.\n\nRead ' + MD + 'domain/cert-contract.ts, verdict.ts, targets.ts, infrastructure/bench.ts, application/certify.ts, and ' + FM + 'scripts/mdmax-cert.mjs.\n\nProduce: (1) What the certificate proves today, precisely, and what it does not. (2) The distribution surfaces and what each is for: npx CLI, a GitHub Action, an MCP tool, an in-editor panel, a public web checker, a badge. Rank by effort against value. (3) The in-product experience — where a user meets the certificate without having asked for it, and how it stays out of the way otherwise. (4) The public dataset question: publishing cross-engine degradation data as an open artifact, what it costs, what it buys, and the risk of handing competitors the map. (5) Third-party reproducibility, since an unverifiable certificate has no defensibility. (6) Whether this is a wedge, a feature, or a moat — with the strongest argument against your answer. (7) Anti-recommendations.'],

  ['e8-engine-experience',
   'Write "## 74. How the engine changes the product experience".\n\nThe engine is invisible infrastructure. This section makes the case for where the user should FEEL it, and where they never should.\n\nRead ' + PRD + ' sections 5, 9, 11, 13, 40 and the engine files.\n\nProduce: (1) The moments where the engine is visible to a user: a refusal, a certificate warning, a provenance mark, a conflict, a degradation notice at paste, an import report. For each: what the user sees, in what words, and why that beats the alternative of silently doing something. (2) The moments where the engine must be completely invisible, and what invisibility costs to build. (3) The refusal-into-trust conversion: how does a product that says no more often than competitors become the one people trust more, and where is the evidence that this works in other categories. (4) The demo — the single 30-second interaction that makes the engine legible to someone who does not care about markdown internals. (5) What would make a user ANGRY at the engine, and the mitigation for each. (6) The honest risk that all of this is invisible plumbing nobody pays for, and what would prove that wrong.'],
]

const enhance = await parallel(ENHANCE.map((x) => () => agent(x[1] + HOUSE, { label: x[0], phase: 'Enhance' })))

return {
  audit: AUDIT.map((x, i) => ({ label: x[0], text: audit[i] })),
  enhance: ENHANCE.map((x, i) => ({ label: x[0], text: enhance[i] })),
}
