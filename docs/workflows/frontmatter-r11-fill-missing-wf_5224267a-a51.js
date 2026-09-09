// SPAWN-GATE: q1=y q2=y q3=y
export const meta = {
  name: 'frontmatter-r11-fill-missing',
  description: 'Re-run the 11 agents lost to the usage limit: gap audit, architecture, features, onboarding, longevity, migration, education, disclosure, naming, measurement, support',
  phases: [
    { title: 'Audit', detail: 'gap audit, architecture decisions, feature completeness, onboarding' },
    { title: 'Reach', detail: 'longevity, migration, segments, disclosure, naming, measurement, support' },
  ],
}

const FM = '/Users/sagnikmitra/Desktop/GitHub/frontmatter/'
const R6 = FM + 'docs/research/agent-reports-2026-08-28/'
const R7 = FM + 'docs/research/agent-reports-2026-08-29-r7/'
const PRD = FM + 'docs/FRONTMATTER-PRD-2026-08-29.md'

const COMMON = [
  '',
  'OUTPUT RULES (strict):',
  '- Dense structured markdown ONLY: short H3 headings, tight bullets, tables. NO prose paragraphs. NO preamble. NO conclusion.',
  '- Evidence tags on EVERY claim: [fetched] = you opened the primary source, [measured] = you executed it here, [SS] = search summary nobody opened, [derived] = computed with arithmetic shown, [inference] = your reasoning.',
  '- Never invent a number. Preserve versions, dates, star and download counts WITH the date read. Record source disagreements rather than resolving them silently.',
  '- Keep every actionable recommendation AND every explicit anti-recommendation.',
  '- Target 2000-3000 words of pure density.',
  '',
  'TOOL NOTE: WebFetch is refused by a security gate here. curl is NOT blocked - test it before concluding a source is unreachable.',
  '',
  'PRODUCT CONTEXT: frontmatter is a markdown editor with a deliberately SIMPLE surface and deep engine. The file is the only source of truth; every view (board, calendar, decision card, site) is a deterministic reversible projection of it. The engine does byte-preserving splice edits and cross-engine degradation certification. Settled, not up for debate: no new markdown format, no tree-of-record, no plugin marketplace, no arbitrary client-side code execution, not a Notion-style project-management tool. Solo founder, India, selling globally.',
  '',
  'IMPORTANT - EMIT EARLY: produce your full deliverable as your FIRST substantial message, then refine. Do not save it for the end. If a hook interrupts you, answer it in ONE short line and then RE-STATE THE FULL DELIVERABLE.',
  '',
  'HARD CONSTRAINTS (RULE 4): read-only. Do NOT edit, write or create files. Do NOT commit, push, or run any mutating command.',
  '',
  'Your entire final message IS the return value. Start directly with the first H3.',
].join('\n')

phase('Audit')

const A = [
  ['c1-research-gap-audit',
   'Audit the ENTIRE research corpus for gaps, as the last check before development starts.\n\n'
   + 'Read the PRD at ' + PRD + ' in full. Then list the report files in ' + R6 + ' and ' + R7 + ' and read enough of each to know what it covers - the headings are usually enough, do not read all 196k words.\n\n'
   + 'Produce: (1) a COVERAGE TABLE - every topic area a product of this kind needs researched, marked COVERED (naming the report), PARTIAL, or MISSING; (2) the MISSING list ranked by build risk, with what specifically to research and why it matters; (3) topics researched but where the evidence is weak (mostly [SS], stale, or single-source); (4) claims in the PRD that are load-bearing but rest on [SS] - the ones that could embarrass us publicly; (5) anything in the PRD that is internally contradictory.\n\n'
   + 'Check coverage on at least: onboarding and activation, accessibility, performance and scale, offline and sync, data model and migrations, API design, mobile, search, real-time collaboration, observability, testing strategy, i18n and CJK, error handling, backup and disaster recovery, SEO for published pages, email and notifications, analytics and privacy, support tooling, documentation, open-source strategy, community, and anything else you judge necessary.\n\n'
   + 'NOTE: rounds 8, 9 and 10 have since covered AIOS productisation, spec-driven development, the markdown format and extension surface, render pipelines and targets, computational markdown, markdown hard edges, the render possibility space, simplicity engineering, editor latency, affordance design, mobile, search, and collaboration models. Treat those as COVERED and focus your gap-hunting elsewhere.'],

  ['c2-architecture-decisions',
   'Enumerate every ARCHITECTURE decision still unmade or under-specified for frontmatter, and give a reasoned recommendation on each.\n\n'
   + 'Read ' + PRD + ' sections 7, 8, 24, 28, 30, and inspect READ-ONLY: ' + FM + 'src/modules/ (14 modules), ' + FM + 'src/app/ (30 routes), ' + FM + 'package.json, ' + FM + 'specs/harness/.\n\n'
   + 'Cover at minimum: offline-first and sync (server-authoritative vs CRDT vs git-as-sync - the PRD has an unresolved contradiction, resolve it with reasoning), the data model and where state lives, multi-tenancy, storage (git repo vs object store vs both), search architecture at scale, real-time collaboration, the API surface and its versioning, background jobs, caching, the desktop/Tauri story, mobile, migrations, and the boundary between the MDMAX engine and the app (MDMAX is currently imported by ZERO product files - specify how it gets wired in).\n\n'
   + 'For each: the options, the tradeoffs, a recommendation, the cost of changing it later, and what evidence would change the recommendation. Use curl to check any library or service claim.'],

  ['c3-feature-completeness',
   'Build a FEATURE COMPLETENESS matrix for frontmatter and find what is missing entirely.\n\n'
   + 'Read ' + PRD + ' sections 13 (feature inventory) and 14 (screens). Then enumerate the full feature space of a markdown document product, using curl research on Obsidian, Notion, Craft, Bear, Ulysses, iA Writer, Typora, HackMD, GitBook, Outline, AppFlowy, AFFiNE, SiYuan, Logseq and Docmost.\n\n'
   + 'Produce a table: FEATURE | IN OUR PRD? | COMPETITOR PARITY (who has it) | USER DEMAND EVIDENCE | EFFORT S/M/L | PRIORITY v1 / v2 / never.\n\n'
   + 'Cover the unglamorous features people actually churn over: search quality, keyboard shortcuts, undo/redo, find-and-replace across the vault, bulk operations, templates, snippets, table editing, image handling and paste, attachments, PDF export fidelity, print, mobile editing, offline, backlinks, tags, saved searches, sorting, file management, trash and restore, duplicate detection, encryption, sharing permissions, word count and writing stats, spell check, autosave, window management, tabs and panes, and anything else.\n\n'
   + 'Then: (1) the MISSING-ENTIRELY list - features absent from our PRD that a user would expect; (2) features in our PRD that no competitor has - our real differentiators; (3) the honest v1 minimum feature set to not embarrass ourselves; (4) explicitly reconcile this against the founder constraint that the SURFACE must stay very simple - which features ship but stay hidden.'],

  ['c4-onboarding-activation',
   'Research ONBOARDING, ACTIVATION and RETENTION for developer and prosumer document tools.\n\n'
   + 'Research with curl: published activation-rate and time-to-value benchmarks for developer tools and PLG SaaS; the documented onboarding flows of Obsidian, Notion, Linear, Figma, Vercel, Supabase, Raycast; empty-state design; sample and demo content strategies; import as an activation lever; and what causes abandonment in note-taking apps.\n\n'
   + 'IMPORTANT: a prior round established that the widely-repeated claim "most of Obsidian 1M+ downloaders never get past their first note" traces only to an unattributed pull-quote in a 2025 author blog post, with no Obsidian source, no methodology and no denominator. Do NOT repeat it as fact. If you find a real source, say so; otherwise treat it as refuted and find genuine evidence instead.\n\n'
   + 'Produce: (1) benchmark numbers with sources for signup-to-activation and activation-to-retention in this category; (2) a concrete activation definition for frontmatter - the single action that best predicts retention - with reasoning; (3) the first-run flow designed against the evidence, consistent with no email field and no OAuth wall; (4) honest retention mechanics (streaks and badges are banned); (5) what to instrument, consistent with our implicit-telemetry-only rule.'],
]

const audit = await parallel(A.map((x) => () => agent(x[1] + '\n' + COMMON, { label: x[0], phase: 'Audit' })))

phase('Reach')

const R = [
  ['d3-longevity-and-shutdown-promise',
   'Research DATA LONGEVITY, PORTABILITY and ARCHIVAL - the trust dimension our product implicitly sells and has never examined.\n\n'
   + 'Cover with curl: digital preservation standards (OAIS reference model, PREMIS, and the Library of Congress Recommended Formats Statement - find where plain text and markdown actually sit in it); format obsolescence evidence; the longevity argument for plain text; real cases of notes apps shutting down and what happened to user data; escrow and open-sourcing-on-shutdown commitments companies have actually made and honoured; source-available and fair-source licences (FSL, BUSL, Elastic) as a shutdown hedge; and data-portability regulation (GDPR Art. 20, and the EU Data Act if applicable).\n\n'
   + 'Produce: (1) where markdown plus YAML sits in preservation guidance, cited; (2) the promises a product can credibly make about longevity and the mechanism backing each (plain files, published format spec, open-source client, escrow, export guarantee, no proprietary sidecars); (3) a proposed PUBLIC COMMITMENT for frontmatter - the exact wording of what we promise and, crucially, what we do NOT promise; (4) which competitors make such a promise and which conspicuously do not; (5) anti-recommendations - promises that would be unenforceable or regretted.'],

  ['r1-migration-fidelity',
   'Research MIGRATION FIDELITY from each realistic source system in specific detail. Our PRD says the verification report is the product, but never specifies what actually breaks per source.\n\n'
   + 'For each of Notion, Obsidian, Apple Notes, Evernote, Roam Research, Logseq, Craft, Bear, Google Docs, Word, Confluence and OneNote: the export formats offered, what is lossy in that export BEFORE any converter touches it, the known converter tools and their open issues, and the specific constructs that break - databases, block references, embeds, comments, attachments, nested pages, tables, formatting, tags, backlinks.\n\n'
   + 'Use curl on the converter repos and issue trackers: obsidian-importer, notion-to-md, yarle, and the Obsidian import bounty threads.\n\n'
   + 'Produce: (1) a per-source fidelity table - construct by construct, what survives, degrades, or is lost; (2) the ranked list of sources by user volume times conversion feasibility, to decide which importers to build first; (3) for the top 3 sources, the specific verification-report rows that must appear; (4) what we must tell a user we CANNOT bring across, before they start.'],

  ['r2-segments-education-research',
   'Research the ACADEMIC, RESEARCH and STUDENT segment for markdown tools - a large adjacent market our corpus has never sized.\n\n'
   + 'Cover with curl: Zotero and its markdown integrations, Obsidian citation workflows, Pandoc citeproc and CSL, Overleaf and the LaTeX incumbency, Typst adoption, Quarto and MyST in academia, Jupyter Book, thesis-writing workflows, reference-manager market share, university adoption evidence, and the India-specific student angle given our pricing strategy.\n\n'
   + 'Produce: (1) segment sizing evidence with sources and honest confidence; (2) the specific jobs-to-be-done - citations, figure numbering, cross-references, equations, supervisor collaboration, journal submission formats; (3) which our architecture can serve and which it structurally cannot; (4) the verdict - target, serve incidentally, or ignore - with the strongest argument against your own verdict; (5) if worth serving, the minimum feature set.'],

  ['r3-ai-disclosure-and-credentials',
   'Research the REGULATORY and SOCIAL layer around AI-generated content disclosure, adjacent to our provenance feature and completely unexamined.\n\n'
   + 'Cover with curl: the EU AI Act transparency obligations for generated content and their dates of application; C2PA and Content Credentials (the spec, adopters, and whether TEXT is in scope at all); text watermarking (SynthID-Text and the published research on robustness); publisher and journal policies on AI-assisted writing (Nature, Elsevier, ICMJE, ACM); academic integrity tooling and the documented false-positive problem with AI-text detectors; platform disclosure norms; and any jurisdiction with a disclosure mandate.\n\n'
   + 'Produce: (1) what is actually LAW versus policy versus norm, each dated and cited; (2) whether text-level content credentials exist as a standard we could implement or whether we would be first; (3) how our byte-anchored provenance maps onto each obligation - where it satisfies one and where it does not; (4) the product features this implies (a disclosure block, an export-time attestation, a percentage-AI report) and which are honest versus pseudo-precision; (5) anti-recommendations, especially around implying a guarantee we cannot make.'],

  ['r4-naming-candidates',
   'Our naming decision is open and blocked on options rather than analysis. Front Matter CMS has 80,527 installs in the same market; shipping as bare "Frontmatter" is assessed high risk; a prior round found the npm package name "frontmatter" is TAKEN (registry returns 200) while "mdmax" is free (404).\n\n'
   + 'Generate 30-40 candidate names across several strategies: coined words, compound words, metaphor, latin/greek roots, short verbs, file-and-document metaphors. Then for the best 15, CHECK AVAILABILITY with curl: npm (registry.npmjs.org/NAME - 404 means free), GitHub org/user via api.github.com/users/NAME, and search for existing developer-tool products with that name. You cannot check domain registrars reliably - mark domains UNCHECKED rather than guessing.\n\n'
   + 'Produce: (1) the full candidate list with the strategy behind each; (2) an availability table for the top 15 - npm, github, product collision, pronounceability, spelling risk, what it signals; (3) a top-5 shortlist with a reasoned recommendation; (4) the case for KEEPING frontmatter with a qualifier, since that is a live option; (5) an explicit note that trademark clearance requires counsel and nothing here substitutes for it.'],

  ['r5-measurement-plan',
   'Design the MEASUREMENT PLAN for frontmatter, consistent with our implicit-telemetry-only rule. The internal evidence: an explicit feedback field was filled 7 times in 694 opportunities, and the numerator has stayed frozen at 7 across three separate measurements, while machine-written channels filled themselves with tens of thousands of rows.\n\n'
   + 'Research with curl: north-star metric frameworks and their critiques; activation metric definitions for developer tools with real examples; privacy-preserving analytics options (PostHog self-hosted, Plausible, Fathom, OpenPanel, or logging to your own store) with current pricing; the legality of product analytics under GDPR and DPDP for a product holding user documents; and what the privacy-focused competitors actually collect - open the Obsidian, Bear and iA Writer privacy policies with curl.\n\n'
   + 'Produce: (1) a proposed north-star metric with reasoning and the strongest argument against it; (2) activation and retention definitions and the event that proves each; (3) the full event schema - every event, its properties, and the decision it would change (anything that would change no decision gets cut); (4) what we must NOT collect given we hold user documents; (5) the stack recommendation with cost; (6) how AI-edit accept/edit/revert telemetry is derived from the document rather than a rating UI.'],

  ['r6-support-and-deflection',
   'Research SUPPORT and SELF-SERVICE for a solo-founder product. Our own cost model says support is the wall: 46.4 founder-hours per month at 10,000 users, before any engineering.\n\n'
   + 'Cover with curl: published ticket-rate benchmarks per user for SaaS and developer tools; deflection rates for docs, in-app help and AI assistants with real numbers; tooling options and current prices (Plain, Pylon, Intercom, Crisp, HelpScout, Discord, GitHub Discussions); community-support models that work for small teams; and the ticket categories that dominate in editor products - sync problems, data loss, billing, how-do-I.\n\n'
   + 'Also derive from our own product: which planned features are ticket GENERATORS (BYO API keys, git auth, sync, import, publishing) and which are DEFLECTORS.\n\n'
   + 'Produce: (1) benchmark ticket rates with sources; (2) our projected ticket mix by category with reasoning; (3) the deflection plan - for each top category, the specific product change or content that removes it; (4) tooling recommendation with cost at our scale; (5) the trigger point at which a support hire is cheaper than founder time, with the arithmetic shown.'],
]

const reach = await parallel(R.map((x) => () => agent(x[1] + '\n' + COMMON, { label: x[0], phase: 'Reach' })))

return {
  audit: A.map((x, i) => ({ label: x[0], text: audit[i] })),
  reach: R.map((x, i) => ({ label: x[0], text: reach[i] })),
}
