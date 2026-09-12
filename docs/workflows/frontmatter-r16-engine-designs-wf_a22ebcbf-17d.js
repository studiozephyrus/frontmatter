// SPAWN-GATE: q1=y q2=y q3=y
export const meta = {
  name: 'frontmatter-r16-engine-designs',
  description: 'Design-level resolution of the engine problems that block every downstream feature',
  phases: [{ title: 'Design', detail: 'six blocking engine designs, resolved' }],
}

const FM = '/Users/sagnikmitra/Desktop/GitHub/frontmatter/'
const MD = FM + 'src/modules/mdmax/'
const SPLICE = FM + 'src/modules/share/domain/splice-frontmatter.ts'

const HOUSE = [
  '',
  'YOU ARE WRITING A DESIGN SECTION an AI implementer will build from. It must end with a decision, not a survey.',
  '',
  'STYLE: exact H2 heading given; H3 subsections; table-first; real signatures, real pseudocode or TypeScript where a design needs it, real file paths, verbatim patterns instead of line numbers (lines rot). NO preamble, NO conclusion, NO process commentary. Evidence tags: [measured] you ran or read it, [fetched] source opened, [SS] search summary which may NOT be published as fact, [derived] arithmetic shown, [inference] reasoning. Every design states: the decision, the rejected alternative, why, the cost of being wrong, and what would falsify it. At most one bolded sentence. Mermaid only where it earns its place, under 12 nodes.',
  '',
  'THE ENGINE: MDMAX, 13 files / 3,614 lines under ' + MD + ', plus the frontmatter splice writer at ' + SPLICE + '. The contract: locate the target byte range, replace exactly those bytes, leave every other byte bit-identical, never regenerate from a parse tree, and REFUSE rather than guess when the range cannot be located unambiguously. Plus a degradation certificate across 7 markdown engines.',
  '',
  'MEASURED STATE: 8,513 third-party files, 0 corruption, 0 throws, but 83 percent publish-refusals from ONE defect — a YAML block sequence at column zero. SAFE_KEY is /^[A-Za-z0-9_.$-]+$/ so a key containing a space such as "date created" is unaddressable; that key appears in 812 of 957 files in one real vault. OffsetMap brands U16Offset, ByteOffset and GraphemeIndex separately because only 67 of 1,080 corpus files have bytes equal to UTF-16 units and 103 of 2,314 contain non-BMP characters. Content-derived anchors resolve at 99.627 percent with 0.050 percent false positives over 41,642 block-versions. A pinned, byte-verified corpus of 8,513 files sits at ' + FM + 'test/corpus/foreign/_vendor/ with a manifest, runnable via npm run corpus.',
  '',
  'SETTLED: no new markdown format; never a tree-of-record; the render carrier is a blockquote callout for prose and a fenced code block for opaque data; sync is git-merge plus splice journal plus compare-and-swap, never a CRDT for document bytes; no arbitrary client-side code execution.',
  '',
  'Use curl for spec and library checks — WebFetch is gate-refused, curl is not. You MAY run node or python to measure against the pinned corpus, and you should where it settles a question. Report exactly what you ran.',
  '',
  'HARD CONSTRAINTS (RULE 4): read-only. No file writes, no commits, no mutating commands.',
  'EMIT EARLY: full section text as your FIRST substantial message. If a hook interrupts, answer in ONE line then RE-STATE THE FULL TEXT.',
  'Target 2200-3200 words. Your entire final message IS the section text.',
].join('\n')

phase('Design')

const JOBS = [
  ['f1-key-addressability',
   'Write "## 75. Key addressability — the NF-4 design".\n\nTHE BLOCKED DECISION. SAFE_KEY excludes spaces and non-ASCII, so real vault keys are unaddressable. The module comment itself flags that this is a design question, not a regex widening. It is the one engine unit an AI agent cannot start without a human decision.\n\nResolve it. Cover: what key equality MEANS for addressing — does cafe in NFC equal cafe in NFD, and what breaks under each answer; YAML key rules per the 1.2 spec including quoting, escapes, and duplicate-key semantics; how the splice writer must locate a quoted key whose on-disk form differs from the requested form; Unicode normalisation policy at the boundary and why normalising the FILE is forbidden; case sensitivity; keys with colons, dots, or leading dashes; and the refusal cases that remain after the fix.\n\nMEASURE against the pinned corpus: how many distinct key shapes exist, how many are currently unaddressable, and what a widened rule would unlock. Report the counts.\n\nEnd with: the decided rule as a precise specification, the exact refusal cases, the migration for keys already written, and the test set that proves it.'],

  ['f2-body-span-splice',
   'Write "## 76. Body-span splicing — extending the contract past frontmatter".\n\nTHE BIGGEST ENGINE GAP. The splice writer addresses frontmatter keys only. Every render profile write-back needs BODY spans: a kanban drag rewriting a status, a checkbox toggle, a calendar drag, an accepted AI hunk, a section-level restore. Without this, the projection law has no write path for anything but frontmatter.\n\nDesign it. Cover: the addressing model for a body range — by lezer SyntaxNode, by content-derived anchor, by line-and-offset, or a hybrid — with the tradeoffs; how a span survives a concurrent edit; the atomicity rule for fenced constructs, where a dropped closing fence swallows the rest of the document per CommonMark 4.5; list-item and task-list mutation specifically, since that is the most common write; heading-section boundaries for section restore; the interaction with the OffsetMap branded types; and the refusal cases.\n\nGive the API: exact signatures for locate, splice, and verify over body ranges. Give the invariant set as rule, failure mode, executable check. Give the red proof that must fail against today code before any of it is trusted.'],

  ['f3-anchor-system',
   'Write "## 77. The anchor system — targets that survive editing".\n\nAn AI proposes an edit; the human edits elsewhere; the anchor must still resolve or honestly fail. Measured today: 99.627 percent resolve, 0.050 percent false positive over 41,642 block-versions, using normalise then hash.\n\nDesign the full system. Cover: the anchor format and what it stores; the resolve algorithm and its fallback ladder; the false-positive problem, which matters more than misses because a false positive edits the WRONG text; fuzzy matching and why approximate-string-match plus quote-context is the right shape (Hypothesis solves the same problem for web annotation — read match-quote and approx-string-match); anchor invalidation and orphan surfacing; anchors across a file rename; and how anchors relate to the splice journal used by sync.\n\nMEASURE if you can against the pinned corpus: mutate files and test resolve rates. Report what you ran.\n\nEnd with: the specification, the failure modes and what the user sees for each, and the test design proving the false-positive rate.'],

  ['f4-property-testing',
   'Write "## 78. Property-based testing for a byte-preserving writer".\n\nThe engine has 10 test files. A byte contract is exactly the kind of invariant property testing was invented for, and example-based tests will never find the pathological input that breaks it.\n\nDesign the suite. Cover: fast-check versus alternatives with current versions; the generators needed — arbitrary valid markdown, arbitrary YAML frontmatter, multi-byte and non-BMP text, CRLF and bare-CR and no-final-newline files, deeply nested lists, adversarial fences, files already containing conflict markers; the PROPERTIES themselves, written out precisely (round-trip identity, splice locality meaning every byte outside the range is unchanged, refusal safety meaning a refusal returns the input byte-identically, idempotence, commutativity where it should hold, offset-map consistency across the three branded types); shrinking so a failure is reportable; seed pinning so a failure is reproducible; and the corpus-plus-properties combination.\n\nCritically: state how each property would have caught a defect we ACTUALLY shipped — the BOM bug, the bare-CR fence, the zero-indent sequence, the OffsetMap off-by-three. A property that would not have caught a real bug is a weak property.\n\nEnd with the suite specification and its CI budget in seconds.'],

  ['f5-incremental-parsing',
   'Write "## 79. Incremental parsing — the lezer decision".\n\nThe editor already runs @lezer/markdown inside CodeMirror. The engine uses unified/remark separately. Two parse trees of the same document, with different position models, is a correctness hazard and a performance cost.\n\nResolve it. Cover: what @lezer/markdown gives that remark does not — incremental reparse, byte-accurate SyntaxNode positions, and a tree the editor already maintains; what remark gives that lezer does not; whether the engine should adopt lezer as its parse layer, keep both with a defined boundary, or keep remark only; the measured cost today, where mdast-util-from-markdown is 12,429 ms against micromark at 1,207 ms, a 10.3x gap; the CommonMark conformance of each; and the risk that the CodeMirror org was archived on 2026-04-15 with 55 of 57 repos, though npm remains alive.\n\nResearch with curl: @lezer/markdown and @codemirror/language current versions, downloads, and how the tree exposes positions; how other editors solve the dual-parser problem.\n\nEnd with a decision, the migration path if it changes anything, and what would falsify it.'],

  ['f6-engine-api-versioning',
   'Write "## 80. The engine public API, versioning and distribution".\n\nMDMAX must be consumable by the app, by a CLI, by CI, by an MCP server, and possibly by third parties verifying our certificates. Today it is an internal folder with no API design.\n\nDesign it. Cover: the public surface — every exported function with its signature, grouped by capability, with everything else made internal; the purity rule that MDMAX imports nothing from src/modules and how it is enforced mechanically; error and refusal types as a discriminated union rather than thrown exceptions; the versioning scheme for the engine AND for its artifacts, since normalize@1, slug@1, fold@1 and the certificate are versioned artifacts other tools may consume; the compatibility promise across versions; whether to publish to npm, and under what licence, given the name mdmax is unregistered on npm; the package boundary (single package or a small monorepo of engine, cli, mcp); and the size and dependency budget, since this may run in a browser.\n\nEnd with the API as a real .d.ts sketch, the versioning policy as rules, and the distribution decision with its anti-recommendation.'],
]

const out = await parallel(JOBS.map((j) => () => agent(j[1] + HOUSE, { label: j[0], phase: 'Design' })))
return JOBS.map((j, i) => ({ label: j[0], text: out[i] }))
