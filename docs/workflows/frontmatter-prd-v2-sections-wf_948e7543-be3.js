// SPAWN-GATE: q1=y q2=y q3=y
export const meta = {
  name: 'frontmatter-prd-v2-sections',
  description: 'Turn rounds 8-12 into finished PRD v2.0 section text, ready to assemble',
  phases: [
    { title: 'Substrate', detail: 'markdown format, rendering, spec-driven dev, AIOS fusion' },
    { title: 'Surface', detail: 'simplicity, search, AI interaction, features, onboarding' },
    { title: 'Platform', detail: 'sync, DR, quality, a11y, API, roles, abuse, ops, business' },
  ],
}

const R8 = '/Users/sagnikmitra/Desktop/GitHub/frontmatter/docs/research/agent-reports-2026-08-29-r8to10/'
const R11 = '/Users/sagnikmitra/Desktop/GitHub/frontmatter/docs/research/agent-reports-2026-08-29-r11/'
const R12 = '/Users/sagnikmitra/Desktop/GitHub/frontmatter/docs/research/agent-reports-2026-08-29-r12/'

const HOUSE = [
  '',
  'YOU ARE WRITING FINISHED SECTIONS OF A PRODUCT REQUIREMENTS DOCUMENT. Not a research summary, not a report about the research. The text you return will be pasted into the PRD with light editing only.',
  '',
  'HOUSE STYLE, follow exactly:',
  '- Start each section with a level-2 markdown heading using the EXACT numbers and titles you are given.',
  '- Table-first. Bullets second. Prose only where a mechanism genuinely needs explaining, and then at most 3 sentences.',
  '- NO preamble, NO "this section covers", NO conclusion, NO meta-commentary about the research process.',
  '- Every factual claim carries an evidence tag: [measured] executed on this machine, [fetched] primary source opened, [derived] computed with the arithmetic shown, [SS] search summary that may NOT be published as fact, [inference] reasoning.',
  '- Preserve exact numbers, versions, dates, prices, counts, package names, spec section numbers. Never round. Never invent.',
  '- Every recommendation states its anti-recommendation. Decisions state what would falsify them.',
  '- Where sources disagreed, say so in one line rather than silently picking.',
  '- Bold the load-bearing sentence in a section, at most one per section.',
  '- Write for a build team that will implement from this. Prefer "do X because Y" over "consider X".',
  '',
  'PRODUCT CONTEXT you must stay consistent with:',
  'frontmatter is a markdown editor with a deliberately SIMPLE surface and a deep engine. THE PROJECTION LAW: the file is the only source of truth; every view (board, calendar, decision card, published site, agent context) is a deterministic, reversible projection owning no state. The engine does byte-preserving splice edits — locate the byte range, replace only those bytes, REFUSE rather than guess — plus cross-engine degradation certification across 7 markdown engines. Solo founder, India, selling globally.',
  '',
  'SETTLED, do not re-litigate: no new markdown format (profiles over valid CommonMark that degrade to readable text); no tree-of-record; no plugin marketplace; no arbitrary client-side code execution (the eval lane); not a Notion-style project-management tool; sync is git-merge + splice journal + compare-and-swap, NEVER a CRDT; the render carrier is a blockquote callout for prose and a fenced code block for opaque data.',
  '',
  'HARD CONSTRAINTS (RULE 4): read-only. No file writes, no commits, no mutating commands.',
  '',
  'EMIT EARLY: produce the full section text as your FIRST substantial message, then refine. If a hook interrupts, answer in ONE line and RE-STATE THE FULL TEXT.',
  '',
  'Your entire final message IS the section text. Start with the first ## heading.',
].join('\n')

const job = (files, sections, extra) =>
  'Read these research reports IN FULL: ' + files.join(', ') + '\n\n'
  + 'Write these PRD sections, in this order, using these exact headings:\n' + sections + '\n\n'
  + (extra ? extra + '\n\n' : '')
  + 'Target 2500-4000 words total across your sections.' + HOUSE

phase('Substrate')

const A = [
  ['w1-markdown-substrate',
   job([R8+'m1-markdown-spec-landscape.md', R8+'m2-directives-extension-mechanism.md', R8+'m3-extension-catalogue.md', R8+'m4-frontmatter-key-conventions.md', R8+'m5-typed-semantic-markdown.md'],
     '## 8. The markdown substrate\n### 8.1 The spec landscape and what the floor actually is\n### 8.2 The carrier decision — how an extension is written on disk\n### 8.3 The extension catalogue — what we support, what we refuse\n### 8.4 Frontmatter key conventions — being a good citizen\n### 8.5 Typed and queryable data in plain text',
     'CRITICAL for 8.2: the measured finding is that a blockquote callout has NO closing marker so an unclosed one is structurally impossible, while an unclosed fence swallows the rest of the document per CommonMark section 4.5. Present the full scorecard of carrier candidates. This CORRECTS an earlier PRD claim that the fenced-code info string was the single dispatch mechanism - say so explicitly. For 8.3 give the ranked list of extensions to support with their literal syntax in fenced blocks. For 8.4 give the master key table and name the keys where ecosystems conflict.')],

  ['w2-rendering-and-targets',
   job([R8+'m6-render-pipelines.md', R8+'m7-output-targets.md', R8+'m8-computational-markdown.md', R8+'m9-markdown-hard-edges.md', R8+'m10-render-possibility-space.md'],
     '## 9. The rendering system\n### 9.1 The parser layer and why byte-accurate positions decide everything\n### 9.2 The computation budget — four lanes, one refused\n### 9.3 The render possibility space — every surface a file could become\n### 9.4 Output targets and their fidelity limits\n### 9.5 The hard edges — what markdown genuinely cannot do',
     'For 9.1 the decisive criterion is which parsers expose byte-accurate source positions, since that determines what a splice editor can safely do. For 9.2 present the four lanes (client, client+library, REFUSED arbitrary client code, server, LLM) and pressure-test the refusal honestly - state what we genuinely lose and the strongest argument that the refusal is wrong, then the verdict. For 9.3 give the ranked shortlist for v1 and v2 with the frontmatter keys or fence that drives each, its lane, how it degrades, and whether write-back is possible. For 9.5 be blunt about tables, RTL, CJK and accessibility.')],

  ['w3-spec-driven-development',
   job([R8+'b1-spec-driven-development-market.md', R8+'b2-document-type-canon.md', R8+'b3-prompt-and-context-as-document.md', R8+'b4-ai-build-loop.md', R8+'b5-spec-conformance-verification.md'],
     '## 14. Documents that build things — the spec-driven lane\n### 14.1 The market as it stands\n### 14.2 The document canon we render, not invent\n### 14.3 Prompts, specs and skills — three artifacts or one?\n### 14.4 The AI build loop and where files beat chat\n### 14.5 What conformance we can honestly claim',
     'This is a lane the founder explicitly asked about: frontmatter as the place you write a spec, an AI reads it, and output is generated. For 14.1 give the competitor table with stars/downloads and dates, the shape of the category, and the honest verdict on whether a markdown editor is a credible home for this or whether the IDE owns it - including the strongest argument against entering. For 14.2 give the canonical section list and frontmatter keys per document type, and flag which types have NO canonical form so we would be inventing. For 14.4 the load-bearing finding is which artifacts PERSIST as files versus evaporate in chat.')],

  ['w4-aios-fusion',
   job([R8+'a1-aios-tool-inventory.md', R8+'a2-aios-loops-as-product.md', R8+'a3-aios-as-b2b-surface.md', R8+'a4-skills-as-automation-format.md', R8+'a5-markdown-processing-assets.md'],
     '## 15. The internal system, productised\n### 15.1 What already runs, measured\n### 15.2 Internal asset to product feature\n### 15.3 User-authorable automations as markdown documents\n### 15.4 What must stay internal, and why\n### 15.5 Is the orchestration layer itself sellable?',
     'The founder runs an AI orchestrator (AIOS) on this machine and asked specifically how it can serve B2B and D2C users through frontmatter. For 15.1 give the measured counts. For 15.2 the table is INTERNAL ASSET | WHAT IT DOES TODAY | PRODUCT FEATURE | LIFT | D2C or B2B or INTERNAL. For 15.4 be specific about why each item would be a trust burden shipped to users - the learned-rules ledger, the bandit learning claim, debate panels, raw traces carrying client paths. For 15.5 give the verdict against the observability market (LangSmith, Braintrust, Langfuse, Helicone, Portkey, Weave, Phoenix) with the strongest argument against your own verdict.')],
]
const sub = await parallel(A.map((x) => () => agent(x[1], { label: x[0], phase: 'Substrate' })))

phase('Surface')

const B = [
  ['w5-simplicity-and-surface',
   job([R8+'s1-simplicity-engineering.md', R8+'s2-editor-latency-performance.md', R8+'s3-affordance-one-file-many-surfaces.md', R8+'s4-mobile-cross-device.md'],
     '## 18. Simplicity as an engineering discipline\n### 18.1 The mechanisms for hiding depth, and what each costs\n### 18.2 A measurable definition of simple\n### 18.3 The surface at rest — what is visible, what is one keystroke away\n### 18.4 Latency as the quality signal\n### 18.5 The affordance problem — discovering that a file is also a board\n### 18.6 Mobile and cross-device',
     'This is the founder single most important design concern: a very simple surface with enormous depth underneath. For 18.2 give countable metrics (visible controls at rest, clicks to first value, concepts to learn) and benchmark competitors where the data exists. IMPORTANT: the claim that most Obsidian downloaders never get past their first note is UNSOURCED - it traces to an unattributed pull-quote in a 2025 author blog post. Do not repeat it; say it is refuted. For 18.4 give the latency budget table with perceptual justification. For 18.5 ground the design in the mode-error literature.')],

  ['w6-search-collab-ai',
   job([R8+'d1-search-and-retrieval.md', R8+'d2-collaboration-models.md', R8+'d4-ai-document-interaction.md'],
     '## 33. Search and retrieval\n## 34. Collaboration model\n## 11. The AI layer — what AI-native actually means',
     'For section 33 give the engine comparison with real numbers, the architecture at 1k/10k/100k notes and where it breaks, and the CJK fix specifically (our MiniSearch CJK recall is a measured 18.1 percent). For 34 the sync decision is already settled as git-merge plus splice journal plus compare-and-swap, so write this as the COLLABORATION model that rides on it - async review versus real-time, what we lose without live cursors, and whether this category actually asks for them. For 11 the critical part is which AI capabilities people actually keep using versus which demo well and get abandoned - rank by evidence of real retention, and name the ones to refuse.')],

  ['w7-features-onboarding-migration',
   job([R11+'c3-feature-completeness.md', R11+'c4-onboarding-activation.md', R11+'r1-migration-fidelity.md', R11+'d3-longevity-shutdown-promise.md'],
     '## 16. Feature inventory and the honest v1\n### 16.1 The completeness matrix\n### 16.2 Missing entirely — what users expect and we had not listed\n### 16.3 What no competitor has — the real differentiators\n### 16.4 The honest v1 minimum\n### 16.5 Reconciling a full feature set with a simple surface\n## 17. First run, activation and retention\n## 20. Migration — what survives, what does not\n## 48. Longevity and the shutdown promise',
     'For 16.5 the constraint is that the surface must stay very simple, so state which features ship but stay hidden and by which mechanism. For 17 do NOT repeat the unsourced Obsidian first-note claim. For 20 give the per-source fidelity table construct by construct and what we must tell a user we CANNOT bring across before they start. For 48 give the exact wording of a public longevity commitment including what we explicitly do NOT promise.')],
]
const surf = await parallel(B.map((x) => () => agent(x[1], { label: x[0], phase: 'Surface' })))

phase('Platform')

const C = [
  ['w8-sync-and-dr',
   job([R12+'k2-sync-engine.md', R12+'k1-backup-restore-dr.md'],
     '## 31. Sync architecture\n### 31.1 The decision and its three disqualifications\n### 31.2 The design\n### 31.3 The convergence oracle — proving zero loss, not observing it\n### 31.4 Failure modes to test\n## 32. Backup, restore and disaster recovery\n### 32.1 The finding that reorders this — R2 has no object versioning\n### 32.2 RPO and RTO by data class\n### 32.3 The layered architecture and what each layer does NOT cover\n### 32.4 The restore drill',
     'For 31.1 the three disqualifications of a CRDT are: it cannot own the file bytes; CRDTs interleave concurrent insertions into corrupted text per arXiv 2305.00583 so convergence buys byte-identical garbage; and a CRDT cannot refuse. Include the measured diff-match-patch results and the measured git merge behaviour including the mode that must be banned. Include the honest counter-argument that conservative merging produces conflicts users hate. For 32 lead with the R2 versioning finding because it invalidates the standard recipe.')],

  ['w9-quality-data-refusal',
   job([R12+'k10-performance-testing.md', R12+'k11-data-model-migrations.md', R12+'k3-error-refusal-ux.md'],
     '## 29. Performance budgets and the testing strategy\n### 29.1 The performance budget\n### 29.2 The test strategy and its pyramid\n### 29.3 Property-based testing for a byte-preserving writer\n## 30. Data model, schemas and migration\n### 30.1 Everything that needs a version\n### 30.2 The compatibility contract\n### 30.3 Migrating data we do not hold\n## 40. Error and refusal experience',
     'For 29.3 write out the concrete properties for the splice writer - these are the tests that would have caught the defects already shipped. For 30.3 the hard case is that user documents live in the user own repository, so we cannot run a migration over files we do not hold; state the read-old-write-new rule and when we may EVER rewrite a user file. For 40 refusal is a founding principle with no research behind how it should feel: give the message template with a character budget, and the full taxonomy of every refusal the product can emit with its exact wording and recovery affordance.')],

  ['w10-platform-surfaces',
   job([R12+'k4-accessibility.md', R12+'k5-api-design.md', R12+'k6-observability-incidents.md', R12+'k9-desktop-distribution.md'],
     '## 35. Accessibility\n## 36. API design\n## 38. Observability and incident response\n## 39. Desktop distribution',
     'For 35 state what is legally required by jurisdiction with dates, the WCAG criteria a markdown editor most commonly fails, the CodeMirror 6 posture and its limits, and note the measured fact that a shipped design token fails AA contrast. Give a CI-gateable checklist. For 36 give the resource model and the exact v1 endpoint list, versioning policy, rate limits tied to the cost model, and how the API relates to the MCP server. For 38 the binding constraint is that we hold user documents so logs must never capture document content - be specific about the mechanisms. For 39 give the full cost table with current prices and say whether the thin-shell Tauri approach is a legitimate v1 or a trap.')],

  ['w11-roles-abuse-i18n',
   job([R12+'k7-roles-permissions-sharing.md', R12+'k8-abuse-takedown-publishing.md', R12+'k12-i18n-rtl-ime.md'],
     '## 37. Roles, permissions and sharing\n## 44. Trust, safety and abuse\n## 43. Internationalisation',
     'For 37 the hard question is that our data lives in the user git repository which already has its own permission model - state the layering rule (defer, duplicate, or intersect) and give a deliberately lean role model. For 44 state what is legally required the day a stranger publishes a page, per jurisdiction, dated; give the minimum viable trust-and-safety apparatus and the honest cost in founder-hours; and give the recommendation on whether publishing ships in v1 WITH the strongest counter-argument, which concerns a permanent 24-hour acknowledgement duty. For 43 cover IME composition hazards for a React plus CodeMirror editor with debounced saves, RTL scope, and the measured CJK defects.')],

  ['w12-business-ops',
   job([R12+'k14-billing-ops-india.md', R12+'k13-oss-docs-community.md', R11+'r5-measurement-plan.md', R11+'r6-support-deflection.md'],
     '## 45. Billing operations\n## 46. Support and deflection\n## 47. Measurement\n## 49. Open source, documentation and community',
     'For 45 the decision-relevant part is the RBI recurring-mandate framework and its effect on a monthly INR subscription - be precise and cite, including the per-transaction ceiling, the single-attempt rule for Indian cards, the billing delay, and the cross-border regime with its date. For 46 our own cost model says support is the wall at 46.4 founder-hours per month at 10,000 users - give benchmark ticket rates, our projected mix, the deflection plan per category, and the arithmetic for when a support hire is cheaper than founder time. For 47 we allow implicit telemetry only - the internal evidence is an explicit feedback field filled 7 times in 694 opportunities while machine channels filled themselves. For 49 give a licence recommendation per artifact: the app, the engine, the CLI, the published format spec, the certificate dataset.')],

  ['w13-segments-disclosure-naming',
   job([R11+'r2-segments-education.md', R11+'r3-ai-disclosure-credentials.md', R11+'r4-naming-candidates.md', R11+'c1-research-gap-audit.md'],
     '## 22. The academic and research segment\n## 42. AI disclosure and content provenance obligations\n## 52. The name\n## 55. Verification debt',
     'For 22 give sizing with honest confidence, the jobs to be done, which our architecture can and structurally cannot serve, and the verdict (target, serve incidentally, or ignore) with the strongest argument against it. For 42 separate what is LAW from policy from norm, each dated, and state how byte-anchored provenance maps onto each obligation and where it does not; name which product features would be honest and which would be pseudo-precision. For 52 give the shortlist with availability evidence, the recommendation, and the explicit case for keeping the current name with a qualifier - including the anti-recommendation about shipping a bare name while holding qualified handles. For 55 list every claim that remains unverified and everything that still needs a human or a professional.')],
]
const plat = await parallel(C.map((x) => () => agent(x[1], { label: x[0], phase: 'Platform' })))

return {
  substrate: A.map((x, i) => ({ label: x[0], text: sub[i] })),
  surface: B.map((x, i) => ({ label: x[0], text: surf[i] })),
  platform: C.map((x, i) => ({ label: x[0], text: plat[i] })),
}
