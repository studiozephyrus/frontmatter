// SPAWN-GATE: q1=y q2=y q3=y
export const meta = {
  name: 'frontmatter-r10-untouched-angles',
  description: 'Simplicity engineering, latency, search, collaboration models, longevity, AI interaction, and the remaining unexamined angles',
  phases: [
    { title: 'Surface', detail: 'simplicity, latency, affordance, mobile — the felt product' },
    { title: 'Depth', detail: 'search, collaboration, longevity, AI interaction — the engine underneath' },
    { title: 'Reach', detail: 'segments, migration, disclosure, naming, measurement' },
  ],
}

const FM = '/Users/sagnikmitra/Desktop/GitHub/frontmatter/'
const PRD = FM + 'docs/FRONTMATTER-PRD-2026-08-29.md'

const COMMON = [
  '',
  'OUTPUT RULES (strict):',
  '- Dense structured markdown ONLY: short H3 headings, tight bullets, tables. NO prose paragraphs. NO preamble. NO conclusion.',
  '- Evidence tags on EVERY claim: [fetched] = you opened the primary source, [measured] = you executed it here, [SS] = search summary nobody opened, [derived] = computed with arithmetic shown, [inference] = your reasoning.',
  '- Never invent a number. Preserve version numbers, dates, star and download counts WITH the date you read them. Record source disagreements rather than resolving them silently.',
  '- Keep every actionable recommendation AND every explicit anti-recommendation.',
  '- Target 2000-3000 words of pure density.',
  '',
  'TOOL NOTE: WebFetch is refused by a security gate here. curl is NOT blocked - test it before concluding a source is unreachable.',
  '',
  'PRODUCT CONTEXT: frontmatter is a markdown editor. The founder intent, stated directly, is a VERY SIMPLIFIED SURFACE with enormous depth underneath - not a feature-dense app. The file is the only source of truth; every view (board, calendar, decision card, site) is a deterministic reversible projection of it. The engine does byte-preserving splice edits and cross-engine degradation certification. Settled and not up for debate: no new markdown format, no tree-of-record, no plugin marketplace, no arbitrary client-side code execution, and NOT a Notion-style project-management tool. Judge everything against those constraints.',
  '',
  'HARD CONSTRAINTS (RULE 4): read-only. Do NOT edit, write or create files. Do NOT commit, push, or run any mutating command.',
  '',
  'A reconciliation hook may fire repeatedly asking you to confirm you mutated nothing. Answer it ONCE in one short line, then RE-STATE YOUR FULL DELIVERABLE as your final message. Your final message must BE the deliverable.',
  '',
  'Your entire final message IS the return value. Start directly with the first H3.',
].join('\n')

phase('Surface')

const S = [
  ['s1-simplicity-engineering',
   'This is the founder single most important design question, so treat it as the flagship. Research SIMPLICITY AS AN ENGINEERING DISCIPLINE: how do products present a very simple surface while carrying enormous depth?\n\n'
   + 'Research with curl and from documented sources: progressive disclosure as an HCI principle and its actual research basis (Nielsen Norman Group, and the original sources); the specific mechanisms - sensible defaults, staged disclosure, expert modes, command palettes as the depth valve, opinionated single-path design, feature gating by usage, hidden-until-relevant UI; and the case studies both ways. Study products that succeeded at this (Bear, Things 3, Linear, Craft, iA Writer, Raycast, Arc) and products that failed by accreting complexity (Notion complexity backlash, Evernote decline, Obsidian own admission that most downloaders never get past the first note - find a REAL source for that claim or downgrade it).\n\n'
   + 'Produce: (1) a mechanism table - every technique for hiding depth, with what it costs and when it breaks; (2) the measurable definition of simple for a document editor - what to count (visible controls at rest, clicks to first value, settings exposed by default, concepts a user must learn); (3) benchmark the competitors on those counts where you can; (4) a CONCRETE specification of the frontmatter surface at rest - what is visible, what is one keystroke away, what is buried - designed against the evidence; (5) the anti-patterns that specifically kill simple markdown editors.'],

  ['s2-editor-latency-and-performance',
   'Research what makes a text editor FEEL fast, with numbers. This is the single strongest quality signal in an editor and our corpus has zero research on it.\n\n'
   + 'Cover with curl and published sources: input latency research and the perceptual thresholds (find the real studies - Jonathan Blow and Pavel Fatin latency work, the typing-latency measurements of popular editors, the 1ms/16ms/100ms perceptual bands and their sources); how CodeMirror 6 and Monaco handle large documents; virtual scrolling and viewport rendering; incremental parsing (lezer) versus full reparse; the cost of syntax highlighting; React re-render cost in editors; debounce strategies; web worker offloading; IndexedDB and persistence latency; and published benchmarks comparing editors.\n\n'
   + 'Also measure what you can locally READ-ONLY: inspect ' + FM + 'src/modules/editor/ and ' + FM + 'src/modules/preview/ and identify the specific code paths that would cause latency (re-render triggers, debounce values, synchronous parsing, whole-document operations). Our engine already has measured quadratics - a WIKILINK regex at k=1.98 taking 36,865 ms on 320 KB of open brackets, and mdast-util-from-markdown at 12,429 ms versus micromark at 1,207 ms.\n\n'
   + 'Produce: (1) the latency budget table - each operation and its target in ms, with the perceptual justification and source; (2) the specific architectural choices that hit or miss those budgets; (3) an audit of our current code against them, naming files; (4) the benchmark suite we should build and what it should assert.'],

  ['s3-affordance-one-file-many-surfaces',
   'Research the AFFORDANCE problem that is unique to our core concept: how does a user discover and understand that one markdown file can also be a board, a calendar, or a decision card - without the product becoming complicated?\n\n'
   + 'This is a genuine design risk. Research analogous solved and unsolved problems: view switching in Notion databases and Airtable, Obsidian Bases view creation, Excel table-to-chart, Figma component instances, the Mac Finder view switcher, Google Sheets/Docs mode switching, Craft view options, Gmail label vs folder confusion, and any documented research on mode confusion and mode errors in interfaces (find the real HCI literature on mode errors).\n\n'
   + 'Produce: (1) a table of view-switching mechanisms in real products - the control, its placement, its discoverability, and its documented confusion problems; (2) the mode-error literature and what it says about reversibility and visibility of state; (3) a CONCRETE design for frontmatter: where the render-profile control lives, how a user learns a file can be a board, what happens to a board file opened in a dumb editor, and how we avoid mode confusion; (4) the specific failure modes to test for; (5) anti-recommendations - the discoverability tactics that would violate the simple-surface rule.'],

  ['s4-mobile-and-cross-device',
   'Research the mobile and cross-device story for a markdown document product - an area our corpus does not cover at all.\n\n'
   + 'Cover with curl: Obsidian Mobile and its documented complaints, Bear, Craft, iA Writer iOS, Ulysses iOS, Notion mobile, Apple Notes, Google Docs mobile, Working Copy (git on iOS), Textastic; the mobile markdown editing problem specifically (keyboard, selection, markup entry, the accessory-row pattern); PWA capabilities and limits on iOS in 2026 (file system access, background sync, install prompts, storage limits, push); Capacitor and Tauri v2 mobile; and offline sync on mobile.\n\n'
   + 'Also inspect READ-ONLY what we already have: ' + FM + 'src/app/manifest.ts, the PWA registration in src/modules/app-shell/, and the Tauri config, and state what our current mobile posture actually is.\n\n'
   + 'Produce: (1) what mobile users of this category actually do - capture, read, light edit, or full authoring - with evidence; (2) the PWA-versus-native decision with the specific iOS limitations that force it either way, each cited; (3) a minimum credible mobile scope for v1 and what to explicitly defer; (4) the accessory-keyboard and markup-entry design; (5) anti-recommendations.'],
]

const surf = await parallel(S.map((x) => () => agent(x[1] + '\n' + COMMON, { label: x[0], phase: 'Surface' })))

phase('Depth')

const D = [
  ['d1-search-and-retrieval',
   'Research SEARCH and RETRIEVAL over a personal markdown vault in engineering depth. Our current implementation is MiniSearch with a measured CJK recall of 18.1 percent, and we have no research behind it.\n\n'
   + 'Cover with curl and npm: MiniSearch, Lunr, FlexSearch, Orama, Fuse.js, Tantivy and its wasm builds, SQLite FTS5 and its wasm builds, DuckDB-wasm, and Ripgrep for the local case - with index size, build time, query latency and language support for each; BM25 versus embeddings versus hybrid retrieval and the published evidence on which wins for personal corpora; client-side embedding models that are actually small enough (gte-small, all-MiniLM, EmbeddingGemma, and their sizes and quality); vector storage in the browser; incremental indexing; and CJK and Indic tokenisation (ICU segmentation, UAX 29, kuromoji, jieba, and what is available in wasm).\n\n'
   + 'Also research what users complain about in note-app search specifically - Obsidian, Notion and Evernote search complaints.\n\n'
   + 'Produce: (1) the comparison table with real numbers and dates; (2) a recommended architecture for search at 1k / 10k / 100k notes, stating where it breaks; (3) the CJK fix specifically, with the exact library and the expected recall improvement; (4) whether local RAG over your own vault is worth building or is a distraction, with the strongest argument each way; (5) anti-recommendations.'],

  ['d2-collaboration-models',
   'Research COLLABORATION MODELS for documents beyond the real-time-CRDT assumption. Our PRD has an unresolved contradiction between server-authoritative and peer CRDT, and it never examined the third option.\n\n'
   + 'Cover with curl: operational transformation versus CRDT (the real tradeoffs, and the Yjs, Automerge and Loro projects with their current state, sizes and benchmarks); git-native document collaboration (branches, PRs and review for prose - and who has tried it: Prose.io, Netlify CMS/Decap, Front Matter CMS, GitBook git sync, Obsidian Git); patch-based and email-based collaboration (git send-email, Radicle, Pijul, Sourcehut) and why it persists; async review versus real-time presence - the evidence on which teams actually want for documents; Google Docs suggesting mode as the incumbent model; and local-first software principles (the Ink and Switch essay) and what it actually claims.\n\n'
   + 'Produce: (1) the model comparison - real-time CRDT, server-authoritative OT, git-branch-and-review, patch exchange - scored on conflict handling, offline, byte fidelity, auditability, implementation cost, and fit with our splice guarantee; (2) a clear RECOMMENDATION resolving the PRD contradiction, with reasoning and the strongest counter-argument; (3) what we lose by not having real-time cursors, and whether users of THIS category actually ask for it; (4) the migration path if we start with one and need the other.'],

  ['d3-longevity-and-the-shutdown-promise',
   'Research DATA LONGEVITY, PORTABILITY and ARCHIVAL - the trust dimension our product implicitly sells and has never examined.\n\n'
   + 'Cover with curl: digital preservation standards (OAIS reference model, PREMIS, the Library of Congress recommended format specifications and where plain text and markdown sit in them); format obsolescence evidence; the actual longevity argument for plain text; what happens to users when a notes app shuts down (find real cases and their outcomes); escrow and open-sourcing-on-shutdown commitments that companies have actually made and honoured; source-available and fair-source licences (FSL, BUSL, Elastic licence) as a shutdown hedge; and data-portability regulation (GDPR Art. 20 right to data portability, and the EU Data Act if applicable).\n\n'
   + 'Produce: (1) where markdown-plus-YAML actually sits in preservation guidance, cited; (2) the specific promises a product can credibly make about longevity, and the mechanisms that back each one (plain files, published format spec, open-source client, escrow, export guarantee, no proprietary sidecars); (3) a proposed PUBLIC COMMITMENT for frontmatter - the exact wording of what we promise and, crucially, what we do NOT promise; (4) the competitive angle: which competitors make such a promise and which conspicuously do not; (5) anti-recommendations - promises that would be unenforceable or that we would regret.'],

  ['d4-ai-document-interaction',
   'Research what an AI-NATIVE DOCUMENT actually means beyond inline editing - the interaction paradigms, not the plumbing.\n\n'
   + 'Cover with curl and product docs: document question-answering (NotebookLM, ChatPDF, Notion Q and A, Mem, Dust); multi-document reasoning and synthesis; transformation verbs (summarise, expand, restructure, translate, change register, extract entities, convert to a table); AI-assisted structure (outline generation, heading repair, tagging, linking); ambient understanding (backlink suggestion, related notes, duplicate detection); agentic document work (research, fill-in, verify); and voice and capture. For each, find who ships it and what users say about it.\n\n'
   + 'Then the critical part: research WHICH of these people actually use and keep using, versus which demo well and get abandoned. Look for retention or usage evidence, not marketing claims.\n\n'
   + 'Produce: (1) an interaction taxonomy with a shipped example and evidence of real usage for each; (2) the ranked list of AI capabilities for frontmatter by (evidence of real demand x fit with our file-native constraint x cost to run); (3) the ones to explicitly refuse and why; (4) how each maps onto our rules - implicit telemetry only, propose-first, prompt at the cursor, and every edit through the splice writer; (5) the honest answer to "what does AI-native mean here" in one paragraph a user would understand.'],
]

const depth = await parallel(D.map((x) => () => agent(x[1] + '\n' + COMMON, { label: x[0], phase: 'Depth' })))

phase('Reach')

const RE = [
  ['r1-migration-fidelity',
   'Research MIGRATION FIDELITY from each realistic source system in specific detail. Our PRD says the verification report is the product, but never specifies what actually breaks per source.\n\n'
   + 'For each of Notion, Obsidian, Apple Notes, Evernote, Roam Research, Logseq, Craft, Bear, Google Docs, Word, Confluence and OneNote: the export format(s) they offer, what is lossy in that export BEFORE any converter touches it, the known converter tools and their open issues, and the specific constructs that break (databases, block references, embeds, comments, attachments, nested pages, tables, formatting, tags, backlinks).\n\n'
   + 'Use curl on the converter repos and their issue trackers - obsidian-importer, notion-to-md, yarle, and the Obsidian import bounty threads.\n\n'
   + 'Produce: (1) a per-source fidelity table - construct by construct, what survives, what degrades, what is lost; (2) the ranked list of sources by (user volume x conversion feasibility) to decide which importers to build first; (3) for the top 3 sources, the specific verification-report rows that must appear; (4) what we should tell a user we CANNOT bring across, before they start.'],

  ['r2-segments-education-research',
   'Research the ACADEMIC, RESEARCH and STUDENT segment for markdown tools - a large adjacent market our corpus has never sized.\n\n'
   + 'Cover with curl: Zotero and its markdown integrations, Obsidian citation workflows, Pandoc citeproc and CSL, Overleaf and the LaTeX incumbency, Typst adoption, Quarto and MyST in academia, Jupyter Book, thesis-writing workflows, reference-manager market share, and university adoption evidence. Also the student note-taking market and the India-specific angle given our pricing strategy.\n\n'
   + 'Produce: (1) segment sizing evidence with sources and honest confidence; (2) the specific jobs-to-be-done - citations, figure numbering, cross-references, equations, collaboration with a supervisor, journal submission formats; (3) which of those our architecture can serve and which it structurally cannot; (4) the verdict: is this a segment to target, to serve incidentally, or to ignore - with the strongest argument against your verdict; (5) if worth serving, the minimum feature set (citations and cross-references being the obvious candidates).'],

  ['r3-ai-disclosure-and-credentials',
   'Research the REGULATORY and SOCIAL layer around AI-generated content disclosure - adjacent to our provenance feature and completely unexamined.\n\n'
   + 'Cover with curl: the EU AI Act transparency obligations for generated content and their dates of application; C2PA and Content Credentials (the spec, adopters, and whether text is in scope at all); watermarking approaches for text (SynthID-Text and the published research on text watermarking robustness); publisher and journal policies on AI-assisted writing (Nature, Elsevier, ICMJE, ACM); academic integrity tooling and the documented false-positive problem with AI-text detectors; platform disclosure norms (LinkedIn, Medium, YouTube); and any jurisdiction with a disclosure mandate.\n\n'
   + 'Produce: (1) what is actually LAW versus policy versus norm, each dated and cited; (2) whether text-level content credentials exist as a standard we could implement, or whether we would be first; (3) how our byte-anchored provenance maps onto each obligation - where it satisfies one, where it does not; (4) the product features this implies (a disclosure block, an export-time attestation, a percentage-AI report) and which of those are honest versus which would be pseudo-precision; (5) anti-recommendations, specifically around implying a guarantee we cannot make.'],

  ['r4-naming-candidates',
   'Our naming decision is open and blocked on options rather than analysis. Front Matter CMS has 80,527 installs in the same market, and shipping as bare "Frontmatter" is assessed as high risk. MDMAX is collision-clean. Generate and CHECK real candidate names.\n\n'
   + 'Method: generate 30-40 candidate names across several strategies (coined words, compound words, metaphor, latin/greek roots, short verbs, file-metaphor names). Then for the best 15, CHECK AVAILABILITY with curl: npm registry (registry.npmjs.org/NAME returns 404 if free), GitHub org/user availability via api.github.com, and note whether a .com or .ai domain is plausibly available (you cannot check registrars reliably - mark domain as unchecked rather than guessing). Also search for existing products with that name in the developer-tools space.\n\n'
   + 'Produce: (1) the full candidate list with the strategy behind each; (2) an availability table for the top 15 - npm, github, existing product collision, pronounceability, spelling risk, and what it signals; (3) a top-5 shortlist with a reasoned recommendation; (4) the case for KEEPING frontmatter as the product name with a qualifier, since that is a live option; (5) an explicit note that trademark clearance requires counsel and that nothing here substitutes for it.'],

  ['r5-measurement-plan',
   'Design the MEASUREMENT PLAN for frontmatter, consistent with our implicit-telemetry-only rule (no rating buttons; the internal evidence is that an explicit feedback field was filled 7 times in 691 opportunities while machine channels filled themselves).\n\n'
   + 'Research with curl: north-star metric frameworks and their critiques; activation metric definitions for developer tools with real examples; privacy-preserving analytics options (PostHog self-hosted, Plausible, Fathom, OpenPanel, and simply logging to your own store) with pricing; the ethics and legality of product analytics under GDPR and DPDP for a document product where the content is sensitive; and what the local-first and privacy-focused competitors (Obsidian, Bear, iA) actually collect - check their privacy policies with curl.\n\n'
   + 'Produce: (1) a proposed north-star metric with the reasoning and the strongest argument against it; (2) the activation and retention definitions, and what event proves each; (3) the full event schema - every event, its properties, and WHY it is needed (anything without a decision it would change gets cut); (4) what we must NOT collect, given we hold user documents; (5) the analytics stack recommendation with cost; (6) how AI-edit accept/edit/revert telemetry is captured from the document rather than from a rating UI.'],

  ['r6-support-and-deflection',
   'Research SUPPORT and SELF-SERVICE for a solo-founder product, since our own cost model says support is the wall - 46.4 founder-hours per month at 10,000 users, before any engineering.\n\n'
   + 'Cover with curl: published ticket-rate benchmarks per user for SaaS and developer tools; deflection rates for docs, in-app help and AI assistants with real numbers; the tooling options and their prices (Plain, Pylon, Intercom, Crisp, HelpScout, Discord and forum-based support, GitHub Discussions); community-support models that actually work for small teams; and the specific ticket categories that dominate in editor products - sync problems, data loss, billing, and how-do-I.\n\n'
   + 'Also derive from our own product: which of our planned features are ticket GENERATORS (BYO API keys, git auth, sync, import) and which are ticket DEFLECTORS.\n\n'
   + 'Produce: (1) benchmark ticket rates with sources; (2) our projected ticket mix by category with reasoning; (3) the deflection plan - for each top category, the specific product change or content that removes it; (4) the tooling recommendation with cost at our scale; (5) the trigger point at which a support hire becomes cheaper than the founder time, with the arithmetic shown.'],
]

const reach = await parallel(RE.map((x) => () => agent(x[1] + '\n' + COMMON, { label: x[0], phase: 'Reach' })))

return {
  surface: S.map((x, i) => ({ label: x[0], text: surf[i] })),
  depth: D.map((x, i) => ({ label: x[0], text: depth[i] })),
  reach: RE.map((x, i) => ({ label: x[0], text: reach[i] })),
}
