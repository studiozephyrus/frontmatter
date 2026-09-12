// SPAWN-GATE: q1=y q2=y q3=y
export const meta = {
  name: 'frontmatter-r12-build-blockers',
  description: 'Close the 13 gaps the audit found missing: DR, sync engine, refusal UX, a11y, API, observability, roles, abuse, desktop, perf/testing, data model, i18n, OSS/docs, billing ops',
  phases: [
    { title: 'Blockers', detail: 'the three highest build-risk gaps' },
    { title: 'Surfaces', detail: 'a11y, API, observability, roles, abuse, desktop' },
    { title: 'Foundations', detail: 'perf/testing, data model, i18n, OSS/docs/community, billing ops' },
  ],
}

const FM = '/Users/sagnikmitra/Desktop/GitHub/frontmatter/'
const PRD = FM + 'docs/FRONTMATTER-PRD-2026-08-29.md'

const COMMON = [
  '',
  'OUTPUT RULES (strict):',
  '- Dense structured markdown ONLY: short H3 headings, tight bullets, tables. NO prose paragraphs. NO preamble. NO conclusion.',
  '- Evidence tags on EVERY claim: [fetched] = you opened the primary source, [measured] = you executed it here, [SS] = search summary, [derived] = computed with arithmetic shown, [inference] = your reasoning.',
  '- Never invent a number. Preserve versions, dates, prices and counts WITH the date read. Record source disagreements rather than resolving them.',
  '- Every recommendation needs its anti-recommendation.',
  '- Target 2000-3000 words of pure density.',
  '',
  'TOOL NOTE: WebFetch is refused by a security gate here. curl is NOT blocked - test it before concluding a source is unreachable.',
  '',
  'PRODUCT CONTEXT: frontmatter is a markdown editor. Deliberately SIMPLE surface, deep engine. The file is the only source of truth; every view is a deterministic reversible projection of it. The engine does byte-preserving splice edits (locate the byte range, replace only those bytes, REFUSE rather than guess) plus cross-engine degradation certification. Solo founder, India, selling globally, storing user documents. Settled: no new markdown format, no tree-of-record, no plugin marketplace, no arbitrary client-side code execution, not a Notion-style PM tool. Stack: Next 16, React 19, CodeMirror 6, unified/remark/rehype, Cloudflare R2 + Workers, Tauri v2, next-auth v5, AI SDK v6.',
  '',
  'IMPORTANT - EMIT EARLY: produce your full deliverable as your FIRST substantial message, then refine. If a hook interrupts, answer in ONE line and RE-STATE THE FULL DELIVERABLE.',
  '',
  'HARD CONSTRAINTS (RULE 4): read-only. No file writes, no commits, no mutating commands.',
  '',
  'Your entire final message IS the return value. Start directly with the first H3.',
].join('\n')

phase('Blockers')

const B = [
  ['k1-backup-restore-dr',
   'The gap audit ranked this the #1 missing area by build risk. Research BACKUP, RESTORE and DISASTER RECOVERY for a product that stores customer documents.\n\n'
   + 'Cover with curl: Cloudflare R2 object versioning, lifecycle rules and their pricing; point-in-time restore options for object stores; git as a backup substrate and where it fails (large binaries, force-push, history rewrite); RPO and RTO definitions and typical SaaS targets by tier; published post-mortems of SaaS data-loss incidents and what the recovery actually looked like; backup verification practice (a backup you have never restored is not a backup); and 3-2-1 as applied to a single-founder product.\n\n'
   + 'Context that raises the stakes: we would hold user documents under India DPDP, whose failure-to-safeguard ceiling is 250 crore rupees. And this studio has its own precedent - a trailing conditional under set -e silently disabled its nightly database backups for weeks without anyone noticing.\n\n'
   + 'Produce: (1) RPO/RTO targets per data class (documents, metadata, published pages, billing records) with reasoning; (2) the backup architecture given git + R2, with what each layer protects against and what it does NOT; (3) the restore runbook and the drill schedule - how often, what is proven, who confirms; (4) how backup interacts with the promise that the user already has their own copy (does it reduce our obligation or not); (5) the specific silent-failure modes to instrument against, given that a backup system that reports success while storing nothing is the failure mode we have already lived; (6) cost at 100 / 1,000 / 10,000 users.'],

  ['k2-sync-engine',
   'Ranked #2 by build risk: the LARGEST build in the plan with the THINNEST evidence base. Research the SYNC ENGINE properly.\n\n'
   + 'The exit condition we have committed to is: two devices, both offline, both edit the same file, both reconnect, byte-for-byte convergence with zero loss, watched by a human. Sync silently destroying data is the single most-cited pain in our whole demand corpus.\n\n'
   + 'Research with curl: how Obsidian Sync, iCloud Drive, Dropbox, Syncthing, Resilio and git-based sync each handle concurrent edits and what their documented failure modes are; published post-mortems or forum evidence of silent sync corruption (there are recent Obsidian forum threads about files showing fully-synced while missing characters); three-way merge for text; git as a sync engine (Working Copy, Obsidian Git, Mobile git constraints); operation logs vs CRDT vs last-writer-wins; Yjs, Automerge and Loro current state, bundle sizes and persistence stories; clock skew and ordering without a server clock; partial-write and torn-write recovery; and service-worker / background-sync limits in browsers, especially iOS.\n\n'
   + 'Produce: (1) a decision matrix across git-only, git + operation log, server-authoritative OT, and CRDT - scored on convergence guarantees, offline, byte fidelity, conflict visibility, implementation cost for one founder, and fit with a splice writer that refuses rather than guesses; (2) a RECOMMENDATION with the strongest counter-argument; (3) the convergence ORACLE - how you mechanically prove zero loss, not merely observe it; (4) the specific failure modes to build tests for; (5) what to do about mobile and iOS background limits; (6) anti-recommendations.'],

  ['k3-error-and-refusal-ux',
   'Ranked #3: refusal is one of our founding principles and there is ZERO research behind how it should feel. Research ERROR and REFUSAL user experience.\n\n'
   + 'Our engine refuses rather than guessing: if it cannot locate a byte range safely it returns the input unchanged. That is correct engineering and potentially terrible product if the user just sees "refused".\n\n'
   + 'Research with curl and from documented practice: error-message design in tools users tolerate being strict with them - Rust compiler diagnostics (widely praised, find why), TypeScript errors (widely criticised, find why), ESLint, git (notoriously bad, and the specific complaints), Postgres, HTTP status semantics; Nielsen Norman guidance on error messages; the research on actionable errors; progressive error disclosure; and how AI tools word refusals.\n\n'
   + 'Produce: (1) what separates a tolerated refusal from an infuriating one, with cited examples of each; (2) a refusal MESSAGE TEMPLATE for our engine - what it must always contain (what happened, what was NOT changed, why, what the user can do) with a character budget; (3) a taxonomy of every refusal our product can emit (splice cannot locate, YAML will not parse, unsupported key shape, corpus drift, cert BROKEN, publish revoked, AI declined) each with its exact wording and recovery affordance; (4) how a refusal appears in the UI without breaking the simple-surface rule; (5) the anti-patterns - what makes refusal read as a bug rather than a guarantee.'],
]

const blockers = await parallel(B.map((x) => () => agent(x[1] + '\n' + COMMON, { label: x[0], phase: 'Blockers' })))

phase('Surfaces')

const S = [
  ['k4-accessibility',
   'Research ACCESSIBILITY as a product and legal requirement. Our PRD has zero mentions of accessibility, WCAG, or screen readers, and we intend to PUBLISH rendered pages, which carries obligations.\n\n'
   + 'Cover with curl: WCAG 2.2 (current AA success criteria that actually bite for a text editor and for published documents), the European Accessibility Act and its application dates for private-sector digital products, EN 301 549, ADA Title III web application case law status, and the India RPwD Act if it reaches private digital services; screen-reader behaviour with contenteditable and with CodeMirror 6 specifically (CodeMirror publishes accessibility notes - open them); accessible rich text editing patterns; keyboard-only operation; focus management in modals and panels; and accessible markdown output (heading order, alt text, table headers, link text, math).\n\n'
   + 'Note a measured fact: our design system defines a body-faint colour at 2.14:1 contrast, which FAILS WCAG AA, and it is in the shipped token set.\n\n'
   + 'Produce: (1) what is legally required of us and by when, per jurisdiction, dated; (2) the WCAG criteria that a markdown editor most commonly fails, with the fix for each; (3) CodeMirror 6 specific accessibility posture and its known limits; (4) accessibility requirements for the PUBLISHED page output, which is where the legal exposure concentrates; (5) a testable a11y checklist we can gate in CI, with the tooling; (6) anti-recommendations - accessibility theatre that does not help.'],

  ['k5-api-design',
   'Research PUBLIC API DESIGN for frontmatter. Our corpus covers MCP but has zero research on a conventional API, rate limiting, or versioning.\n\n'
   + 'Cover with curl: REST vs RPC vs GraphQL for a document product; API versioning strategies and what the big document APIs actually did (Notion, Google Docs, Dropbox, GitHub, Contentful, Sanity - open their versioning docs); pagination and cursor conventions; idempotency keys; webhooks vs polling; rate limiting algorithms and published limits from comparable products; authentication for third-party apps (PATs vs OAuth vs scoped app tokens); error-format conventions (RFC 9457 problem details); and API deprecation policy.\n\n'
   + 'Then design ours specifically: our unit is a FILE in a git repo, our engine refuses rather than guessing, and our MCP server already exposes land / search-vault / read-slice / splice-edit / cert-check.\n\n'
   + 'Produce: (1) the recommended API shape with reasoning; (2) the resource model and the exact endpoint list for v1; (3) versioning and deprecation policy; (4) rate limits by tier with the arithmetic tying them to our cost model; (5) how the API and the MCP server relate - one surface or two, and why; (6) what NOT to expose, and why; (7) anti-recommendations.'],

  ['k6-observability-incidents',
   'Research OBSERVABILITY and INCIDENT RESPONSE for a solo-founder product that holds user documents.\n\n'
   + 'Cover with curl: error tracking options and current pricing (Sentry, Bugsnag, Rollbar, GlitchTip self-hosted); uptime monitoring (Better Stack, Checkly, Uptime Robot, Cronitor) with prices; structured logging and log retention costs; OpenTelemetry and the gen_ai semantic conventions; status-page options and their prices; alerting and on-call for a team of one (what actually wakes you, and what must not); SLO definition for a small product; and incident post-mortem practice.\n\n'
   + 'Critical constraint: we hold user documents, so logs and error reports MUST NOT capture document content. Research the specific mechanisms for that - PII scrubbing, beforeSend hooks, source-map handling, breadcrumb filtering - and the retention limits DPDP and GDPR imply.\n\n'
   + 'Produce: (1) the recommended stack with cost at our scale; (2) exactly what to instrument and what is forbidden to capture, given the document-privacy constraint; (3) SLOs a solo founder can honestly commit to, and what to publish; (4) the alerting rules that are worth a 3am wake-up and the ones that are not; (5) log retention policy reconciled with DPDP/GDPR; (6) an incident runbook skeleton; (7) anti-recommendations.'],

  ['k7-roles-permissions-sharing',
   'Research ROLES, PERMISSIONS, SHARING and INVITES. Our PRD names a team dashboard and a suggester role but has no permission model at all.\n\n'
   + 'Cover with curl: the permission models of Notion, Google Docs, GitHub, Linear, Figma, Slite, Outline, GitBook, Confluence - the actual role sets, what each role can do, and where users complain the model is confusing; per-folder vs per-document vs workspace-level permissions; link sharing modes and their security failure modes; guest and external-collaborator models and their billing treatment; invite flows and their conversion impact; and the specific problem of permissions over a GIT REPO, where the underlying store already has its own access model.\n\n'
   + 'The hard question for us: our data lives in the user git repo. GitHub already decides who can read and write it. Research how products layered on git handle the two overlapping permission systems, and whether ours should defer entirely, duplicate, or intersect.\n\n'
   + 'Produce: (1) a comparison of real role models with their documented confusion points; (2) a RECOMMENDED role model for frontmatter, deliberately lean, with justification for each role; (3) how it reconciles with git-provider permissions - the layering rule; (4) link-sharing modes and their revocation semantics, given we already fixed an unpublish-revocation defect; (5) the invite flow; (6) what billing treatment guests and commenters get, noting our published rule that commenters never bill; (7) anti-recommendations.'],

  ['k8-abuse-takedown-publishing',
   'Research TRUST AND SAFETY for user-published pages. Our PRD names the obligation and never researches it. This gates the decision on whether publishing ships in v1.\n\n'
   + 'Cover with curl: intermediary liability in India (IT Rules 2021, the due-diligence obligations, grievance officer requirements and timelines, and the safe-harbour conditions under Section 79); the EU DSA obligations that apply to a small hosting provider (notice-and-action, statement of reasons, and which obligations exempt micro and small enterprises); DMCA safe harbour and the agent-registration requirement plus its fee; CSAM reporting obligations; the practical abuse vectors for a free publishing surface (phishing pages, malware distribution, SEO spam, doxxing); what comparable small publishing products do (Bear Blog, Mataroa, Write.as, Telegraph, GitHub Pages) - open their terms and abuse policies; and hosting-provider terms that would make us liable.\n\n'
   + 'Produce: (1) what is legally required of us the day we let a stranger publish a page, per jurisdiction, dated and cited; (2) the minimum viable trust-and-safety apparatus - report path, takedown SLA, appeals, logging, grievance officer if required; (3) the abuse vectors ranked by likelihood for our specific product and the control for each; (4) the honest cost in founder-hours and money; (5) a recommendation on whether publishing ships in v1 or v2 given all of the above, with the strongest argument each way.'],

  ['k9-desktop-distribution',
   'Research DESKTOP DISTRIBUTION for the Tauri v2 app. Zero corpus coverage, and we already ship a Tauri config.\n\n'
   + 'Cover with curl: Apple code signing and notarisation for a Tauri app (the Developer Program cost, the notarytool flow, hardened runtime, entitlements, what happens without notarisation on current macOS); Windows code signing (the move to hardware-backed certificates, OV vs EV, current prices from named CAs, SmartScreen reputation); Linux packaging (AppImage, Flatpak, deb, snap) and which actually reach users; Tauri v2 updater plugin and its signing model; auto-update strategies and rollback; app-store distribution vs direct download (Mac App Store sandbox restrictions and whether a file-system-heavy editor can live there); and the build matrix cost in CI.\n\n'
   + 'Note our current state: the Tauri config points frontendDist at a hosted URL, so the desktop app is a thin shell over the web app, and signingIdentity is null.\n\n'
   + 'Produce: (1) the full cost table - certificates, developer programs, annual fees, CI minutes - with current prices and dates; (2) the signing and notarisation runbook per platform; (3) the auto-update design including rollback and the signing key custody problem for a solo founder; (4) whether the thin-shell approach is a legitimate v1 or a trap, with reasoning; (5) which platforms to ship in v1; (6) anti-recommendations.'],
]

const surfaces = await parallel(S.map((x) => () => agent(x[1] + '\n' + COMMON, { label: x[0], phase: 'Surfaces' })))

phase('Foundations')

const F = [
  ['k10-performance-targets-and-testing',
   'Research PERFORMANCE TARGETS at vault scale and the TESTING STRATEGY. Both are partial in our corpus: we have latency research but no scale targets, and strong testing standards but no strategy, no e2e, and no CI.\n\n'
   + 'Part A - scale targets. Research and derive: index build time and memory at 1k / 10k / 100k notes; cold-start budget for a web editor; time to first keystroke; search query latency targets; what Obsidian, Logseq and VS Code actually achieve at scale and what users report breaking; browser memory limits; and the measured facts from our own engine - a wikilink regex at k=1.98 taking 36,865 ms on 320 KB of open brackets, mdast-util-from-markdown at 12,429 ms vs micromark at 1,207 ms.\n\n'
   + 'Part B - testing strategy. Research: the test pyramid for a product like this; Playwright vs Cypress current state and cost; visual regression tooling and its flakiness reputation; property-based testing for a byte-preserving writer specifically (this is the highest-value idea - research fast-check and how to state the properties); mutation testing; contract testing; and CI cost.\n\n'
   + 'Produce: (1) a performance budget table - operation, target, measurement method, and the gate that enforces it; (2) the scale ceiling we will publish honestly; (3) the test strategy with the pyramid proportions and what each layer owns; (4) the PROPERTY-BASED test properties for the splice writer, written out concretely - these are the tests that would have caught the defects we shipped; (5) the CI design and its cost; (6) anti-recommendations.'],

  ['k11-data-model-and-migrations',
   'Research the DATA MODEL and MIGRATION strategy. Our corpus has frontmatter key conventions but no versioning or compatibility contract for anything.\n\n'
   + 'Things that will need to evolve and currently have no contract: user-defined frontmatter schemas, render profile definitions, the degradation certificate JSON sidecar, sidecar files generally, the session-interchange format we intend to publish, saved searches and views, and any server-side metadata.\n\n'
   + 'Research with curl: schema versioning practice (semver for data, additive-only evolution, expand-contract migration); JSON Schema versioning and $schema pinning; how Obsidian handled its properties migration and what broke; Astro content-collection schema evolution; protobuf and avro compatibility rules as the rigorous prior art; database migration practice for multi-tenant SaaS; and how to migrate data that lives in the USER files rather than our database, which is the hard case - we cannot run a migration over files we do not hold.\n\n'
   + 'Produce: (1) the full inventory of every artifact that needs a version, and where the version lives; (2) the compatibility contract - what we promise across versions, stated as rules; (3) the migration strategy for user-held files specifically, including the read-old-write-new pattern and when we may ever rewrite a user file; (4) the deprecation policy and its timeline; (5) how the certificate and the splice guarantee constrain migration - we cannot silently rewrite bytes; (6) anti-recommendations.'],

  ['k12-i18n-rtl-ime',
   'Research INTERNATIONALISATION beyond the CJK defects we already know about. Our corpus has 2 hits for i18n, zero for RTL and localization, and IME appears zero times in the PRD.\n\n'
   + 'Cover with curl: Unicode bidirectional algorithm (UAX 9) and what RTL requires of a text editor; RTL in contenteditable and in CodeMirror 6 specifically; IME composition events and the classic bugs (composition interrupted by re-render, autocomplete firing mid-composition, undo granularity) - this is a real hazard for a React editor with debounced state; Unicode text segmentation (UAX 29) for word and grapheme boundaries; UAX 14 line breaking; Intl.Segmenter browser support and coverage; locale-aware sorting and collation; date and number formatting; and UI string externalisation approaches for a small product.\n\n'
   + 'Note our measured facts: countWords undercounts Chinese by 1.7 to 2 times, MiniSearch CJK recall is 18.1 percent, and our OffsetMap already brands U16Offset, ByteOffset and GraphemeIndex separately because only 67 of 1,080 corpus files have bytes equal to UTF-16 units.\n\n'
   + 'Produce: (1) the i18n work itemised by what actually breaks, with the standard to implement against for each; (2) the IME hazard list specific to a React plus CodeMirror editor with debounced saves, and the test for each; (3) RTL support scope - full, partial or explicitly out, with reasoning; (4) Intl.Segmenter viability with current browser support data; (5) UI localisation approach and whether it is worth doing at all for v1; (6) anti-recommendations.'],

  ['k13-oss-docs-community',
   'Research three linked gaps: our OWN open-source posture, our OWN documentation, and community building.\n\n'
   + 'Part A - licensing. We intend to publish a session-interchange format and a degradation-certificate dataset, and to distribute a certificate CLI. Research: source-available licences (BUSL, FSL, Elastic, PolyForm, SSPL) with their actual terms and adoption; open-core patterns that worked and failed; the strategic argument for open-sourcing an engine while keeping the app closed; licence choice for a published FORMAT SPEC as distinct from code (CC0, CC-BY, OWFa, W3C); and what licence a spec needs for others to implement it freely.\n\n'
   + 'Part B - documentation. Research: documentation as a purchase input for developer tools (our beachhead ICP is dev-tool startups); the Diataxis framework; what good docs cost to maintain; docs-as-code; and what competitors ship.\n\n'
   + 'Part C - community. Research: community platforms and their tradeoffs (Discord, Discourse, GitHub Discussions, Reddit); moderation load for a solo founder; the evidence on when community becomes a moat; and the specific dynamics of the Obsidian and markdown communities we intend to enter.\n\n'
   + 'Produce: (1) a licence recommendation for each artifact - the app, the engine, the CLI, the format spec, the certificate dataset - with reasoning; (2) the docs plan with structure and maintenance cost; (3) the community plan sized to one founder, with the moderation reality; (4) how these three reinforce each other or compete for the same hours; (5) anti-recommendations.'],

  ['k14-billing-ops-india',
   'Research BILLING OPERATIONS for an India-based company selling globally. Our pricing research covers rates and rails but not the operational machinery.\n\n'
   + 'Cover with curl: Indian GST invoice requirements for B2B (GSTIN on invoice, place of supply, HSN/SAC codes, invoice numbering rules) and for B2C; the e-invoicing mandate and its current turnover threshold; RBI rules on recurring card mandates and the e-mandate framework including the additional-factor-authentication requirement and the limits, since this directly affects whether monthly subscriptions even work on Indian cards; UPI Autopay for recurring payments and its limits; what a merchant of record does and does not handle for Indian tax specifically; dunning and involuntary churn benchmarks; refund policy norms and chargeback handling; proration and plan-change mechanics; and revenue recognition basics for subscriptions.\n\n'
   + 'This is the operational layer beneath our pricing decision, and the RBI e-mandate rules in particular could invalidate the monthly-subscription assumption for Indian customers.\n\n'
   + 'Produce: (1) exactly what must appear on an invoice for an Indian B2B customer, and what changes for B2C and for export; (2) the RBI recurring-mandate rules and their concrete effect on a monthly INR subscription - this is potentially decision-changing, so be precise and cite; (3) the dunning and involuntary-churn plan with benchmark rates; (4) what the MoR handles versus what we still operate; (5) refunds, chargebacks and proration policy; (6) the founder-hours per month this costs at 100 / 1,000 / 10,000 customers; (7) anti-recommendations. Flag clearly anything that needs a chartered accountant rather than an agent.'],
]

const foundations = await parallel(F.map((x) => () => agent(x[1] + '\n' + COMMON, { label: x[0], phase: 'Foundations' })))

return {
  blockers: B.map((x, i) => ({ label: x[0], text: blockers[i] })),
  surfaces: S.map((x, i) => ({ label: x[0], text: surfaces[i] })),
  foundations: F.map((x, i) => ({ label: x[0], text: foundations[i] })),
}
