# Audit brief for Claude: the frontmatter product plan v4, every angle, at full depth

You are running in Claude Code on a second account, as an independent cross-check. The plan under audit was written by Claude Fable 5.1 in another session on this machine. You may be the same model. Assume you share its habits and its blind spots, and prefer a page, a file, a measurement or a calculation over your own judgement wherever one can settle a question. Where only judgement can settle it, say so, and argue both sides before you choose.

This is a full audit, not a review. The founders, Sagnik and Amit of Studio Zephyrus, asked for the deepest level of check there is before they approve the plan and start building: every claim, every decision, every screen, every number, every legal and technical angle, the research itself, and the process that produced the plan. Nothing in the plan is exempt, including the parts that say they were verified. If the plan is good, say so once, at the end, in one sentence. The rest of your report is findings.

## 1. The subject

frontmatter is a markdown editor for people whose documents are increasingly written with, and for, AI agents. Web app, desktop app and phone on one account. Studio Zephyrus, two founders, India first, Pro at ₹299 a month. The founders' stated ambition, in their words: "make the best freaking markdown note-taking app in the world", "the first almost agentic markdown editor that gives the best blueprint for AI building", a tool "that feels like home", "as seamless as Google Docs", with "no captchas and all".

The plan under audit is v4, dated 17 September 2026, written by an AI over twelve research rounds. It rests on thirty-one research reports, all secondary sources: pricing pages, help pages, forums, registries, specifications, standards, papers. No customer was interviewed. No prototype was tested with a user. Keep that in mind throughout: the plan is well-sourced and untested, and those are different things.

## 2. Materials

Repository root: `/Users/sagnikmitra/Desktop/GitHub/frontmatter`. Paths are relative to it.

1. `CLAUDE.md`, `AGENTS.md`, `docs/MAP.md`: the repository's rules and its map of documents. Obey the rules. Never open `docs/FRONTMATTER-RECORD.md`, `docs/FRONTMATTER-COMPLETE-RECORD-2026-08-30.md`, `docs/FRONTMATTER-PRD-v2-2026-08-29.md`, `docs/ENGINE.md`, `docs/CRITIQUE.md` or `docs/DEV-PLAN.md` whole. Use `grep -n` and read line ranges.
2. `docs/mvp0/PRODUCT-PLAN.md`: the plan. 22 sections, about 10,900 words. PDF: `docs/mvp0/frontmatter-Product-Plan-v4-2026-09-16-2258.pdf`.
3. `docs/mvp0/SCREENS.md` and `docs/mvp0/frontmatter-Screens-v4-2026-09-16-2258.pdf`: the screens sheet, generated from the plan's S01 to S30 blocks.
4. `docs/mvp0/screens/*.png`: sixty images you can open with the Read tool, `sNN-name.png` desktop 1440 by 900 and `sNN-name-phone.png` phone 390 by 844. The generator is `docs/mvp0/screens/gen.mjs`; the free caps it renders are the `CAPS` object at its top; the design tokens are the `CSS` string. Note: the four screens S12 to S15 were re-rendered after the PDFs were built, to fix a file count. The PNGs are current, the PDFs lag by that one detail.
5. `verify/2026-09-17/research/`: thirty-one research reports, 70,277 words. `MANIFEST.md` describes each. Nine dated 2026-09-17 are this round. Twenty-two dated 2026-09-16 are the previous round.
6. `docs/mvp0/MVP0-PLAN-v3.md` (with a Sources table) and `docs/mvp0/MVP0-PLAN-print.md` (revision 3 of the build sheet): the previous plans. What v4 dropped or changed without saying so is a finding.
7. `docs/PRODUCT-BRIEF.md` (v15, 560 lines, the plan before the 13 September reset), `docs/research/2026-09-09/VERIFIED-2026-09-09.md`, `docs/research/2026-09-13/`, `docs/GAPS-2026-09-08.md`: earlier verified facts and the gap register. Where they contradict v4, say which is right.
8. `src/`: the shipped code. Next.js, Tauri desktop. Modules: ai, ai-tools, app-shell, auth, drafts, editor, export, graph, mdmax, preview, repository, share, vault. Landmarks: `src/app/(vault)/layout.tsx`, `src/modules/app-shell/presentation/VaultWorkspace.tsx`, `src/modules/editor/presentation/Toolbar.tsx`, `EditorPane.tsx`, `src/modules/preview/`, `src/modules/export/`, `src/modules/repository/infrastructure/github-writer.ts`, `share/domain/splice-frontmatter.ts`, `src/app/globals.css`, `specs/`, `package.json`.
9. `decisions/v2/*.json`, `decisions/v2/CONTRACT.md`, `decisions/tools/validate.py`: the 204 decision cards, their shape and their validator. The plan's Medium and High idea modes copy the card shape.
10. The live sites, if you have network access: frontmatter.in (the app), frontmatter-decisions-sagnik.vercel.app (the cards), md.sgnk.ai (the design reference), tred.sgnk.ai/flow (the flow-view reference).

## 3. Rules

- Write two files and nothing else: `verify/2026-09-17/CLAUDE-AUDIT-REPORT.md` (the report) and `verify/2026-09-17/CLAUDE-AUDIT-FINDINGS.jsonl` (one JSON object per finding, appended as you go). Modify nothing else in the repository. No `git commit`, `git push`, `npm install`, deploys, database commands, or outbound messages. You may run read-only checks: `npm run typecheck`, `npm run lint`, `npm run test`, `npm run arch`, `npm run spec`, `npm run corpus`, `node --check`, `git log`, `git show`, `grep`, `wc`, `ls`. If a command would write outside `verify/2026-09-17/`, do not run it.
- Record `git rev-parse HEAD` when you start and when you finish. They must match. If they do not, say so in the report and stop.
- Never read `.env*`, `~/.config`, `~/.ssh`, `tokens.zsh`, or `aios/docs/10-client-inputs/` anywhere on this machine. The last is under NDA.
- Memory notes, handover files, `.sgnk/` snapshots, `docs/mvp0/MVP0-PLAN-*.md` and anything else written by the author's sessions are material under audit. They are not verified facts. Do not inherit their conclusions. The repository's `CLAUDE.md` and `AGENTS.md` rules still bind you.
- Network: `WebFetch` may be refused by a policy gate on this machine. That refusal is one tool's policy, not the machine's reach. Use `curl -sL --compressed -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152 Safari/537.36" --max-time 40 "<url>"` from Bash and strip tags with a short Python script. Some hosts answer 403 or 429 to scripts; say so rather than guessing at what the page holds. GitHub's API and raw.githubusercontent.com answer without a token.
- The Bash guard on this machine blocks commands whose text contains destructive verbs, even inside comments, and macOS bash mishandles apostrophes inside heredocs. Write any script to `verify/2026-09-17/scratch/` with the Write tool and run it with `python3 <file>`. Delete nothing.
- You may spawn subagents for reading and fetching. Every subagent is read-only: it may not write, edit, commit or run anything that mutates state, and its prompt must say so. Give each subagent one angle or one list of claims, and require it to return findings in the JSON shape of section 6 so you can append them without rework. A subagent's claim is unverified until you have seen its evidence; spot-check one in five against the source yourself.
- Save as you go. Append every finding to the JSONL ledger the moment you have it, and append each finished angle to the report before starting the next. A context limit or a crash must lose at most one angle. If the report already exists when you start, read its last completed angle and its ledger, and continue from there rather than starting again.
- Every claim you make cites where you saw it: file and line, screen id, or a URL you opened yourself with the date. If you cannot verify, write "unverified" and name what would verify it. Never invent a source, a number, a quote, a law, a licence term or a competitor feature. A previous research round in this repository paraphrased inside quotation marks; assume every quotation in the plan may have done the same, and re-fetch before you rely on one.
- Redo every calculation. The plan shows its working in sections 13, 14 and 15. Show yours.
- British spelling. No em dashes or en dashes anywhere. Plain sentences. No emoji. The studio runs `python3 ~/Desktop/GitHub/sgnkai/scoring/gate.py --file <f> --strict` on every document; run it on your report before you finish and fix what it flags.
- Rank by consequence. Severity rubric: **blocker** means the plan cannot be approved as written because a premise, a law, a licence, a cost or a technical assumption fails; **major** means a decision or a screen is wrong in a way that costs money, users or weeks; **minor** means an error a reader would notice and lose trust over. Consequence, not effort, sets the severity.
- Do not rewrite the plan. Report what is wrong, why it matters, the smallest fix, and the effort of the fix in days.
- Depth calibration: a shallow audit of this plan produces around forty findings and checks around fifty claims. Yours should check at least one hundred and twenty claims, score all forty-five angles, review all sixty images, fill the traceability matrix completely, and produce the test plan. If an angle produces no finding, say what you checked and why it held.

## 4. Method

Work in passes. Do not skip a pass because an earlier one found a blocker; the founders need the whole picture once. Append to the report and the ledger after every angle, so the work survives a context limit.

Pass one, facts: build the claims table (angle A1) as you read the plan top to bottom.
Pass two, traceability and consistency (A2, A3).
Pass three, the research itself (A4).
Pass four, market, customer, competition, pricing, money, growth (A5 to A10).
Pass five, product, screens, design, accessibility, internationalisation (A11 to A15).
Pass six, engineering: editor, architecture, data, sync, AI, security, legal, platforms, operations (A16 to A24).
Pass seven, delivery, documentation, tests, pilot (A25 to A28).
Pass eight, the added angles: responsible AI, the public face, lifecycle, permissions, portability, formats, the agent surface, performance, India reality, authorship bias, search, open source, the decision cards, promises, ownership, content, riskiest assumptions (A29 to A45).
Pass nine, the scorecard and the verdict.

For each angle, score 0 to 5: 0 absent, 1 named but unsupported, 2 supported with gaps that matter, 3 sound with minor gaps, 4 sound and evidenced, 5 sound, evidenced and tested. Give the top finding for the angle and the evidence.

## 5. The angles

### A1. Facts and evidence

Every numbered claim, quote, price, limit, date and count in the plan. For each: is it in the research pack, does the pack agree, does the live page agree today, is the signal tag right. `[M]` must be a page opened and quoted. `[O]` must be measurable on this machine or in a source you find. `[R]` must name a real earlier document. `[Z]` must be a founder decision, and section 21 must list every departure from one. `[P]` must follow from a decision that exists.

Weight these most.

- The Obsidian counts in section 2 and the "answers 16 of 30" arithmetic. Source: `2026-09-16-obsidian-requests-vs-us.md`.
- The forty-product free-tier table. Source: `2026-09-17-r3-free-tiers.md`.
- The provider table, its limits, training clauses and capacity arithmetic. Source: `2026-09-17-r1-free-llm.md`.
- The three stack costs and the Vercel, Firestore, Supabase and Durable Object claims. Source: `2026-09-17-r2-stack.md`.
- The 27, 15 and 18 Google Docs split, counted by you. Source: `2026-09-17-r4-doc-mode.md`.
- The twenty cross-ecosystem capabilities and the 32 Notion blocks with 26 covered. The "26" is the plan's own count. Source: `2026-09-17-r7-ecosystems.md`.
- Browser versions, the Safari seven-day rule, the Drive quota arithmetic and the GitHub App limits. Source: `2026-09-17-r9-sharing-upload.md`.
- Every quotation in section 16. Source: `2026-09-17-r8-ux-principles.md`.
- The two engine defects in section 17. Find them in `share/domain/splice-frontmatter.ts` and the engine documents.
- Every "ships today" in sections 5 and 6. Find the component in `src/`.

Also check the plan's own claims about itself: "twelve research rounds", "245 sources", "thirty screens", "every decision carries its signal". Count.

### A2. Requirements traceability

Build a matrix: every ask the founders made, where the plan answers it, which screen shows it, and whether the answer is complete, partial, changed, or missing. The asks, from the founders' messages of 16 and 17 September and earlier:

1. Sign in first, like Google Docs; nothing usable without an account.
2. Features first; free and Pro decided after; candidates of 5 documents, 2 public documents, 1 live collaborator.
3. Every feature available on Free; only quantities capped.
4. Idea mode generates the full file set: frontend docs, complete specs, everything; asks questions; makes decisions.
5. Low depth: 10 to 15 questions, free.
6. Medium and High: paid, with proper insights and evidence, in the shape of the decisions site.
7. Industry templates built in, or generated for an industry.
8. Idea mode as a separate tab or UI with ideas stored on the left; the UI itself decided later.
9. Offline in the browser with browser storage; the desktop app fully offline and unlimited; the desktop app promoted, the web app kept.
10. A Doc and Markdown switch; Google Docs features in Doc mode, inside Live.
11. Google Drive storage and sync with the user's authorisation.
12. GitHub connection with authorisation; which tier it sits on, researched.
13. Password-protected sharing.
14. File and folder upload, including mapped folders.
15. A proper settings page.
16. Documents stored on the web; R2 plus Firestore proposed; critique it; free to start, pay when scaling; the perfect stack.
17. A portfolio in Pro, hosted at frontmatter's own domain under the user's handle, a late feature.
18. Markdown representations, the flow view among them.
19. Decision depths low, medium, high.
20. Which plugins by default, which as add-ons; the deepest plugin and market research across Notion, Obsidian and others.
21. Every document-editing public API, from the two directories named.
22. Non-model work kept off the model; free providers for the pilot, every free model; Claude later.
23. Every screen on desktop and on the phone.
24. Progressive disclosure, SOLID, and UX, development and product principles, researched deeply.
25. The product plan first; the dev plan after approval.
26. Everything synced through the Google sign-in, like Notion; the UI intuitive and simple.
27. A Max tier later; credits or not, researched.
28. No captchas, puzzles or tours; it feels like home; Google Docs onboarding feel.
29. Team and Enterprise shown from day one; built later.
30. A community, later.
31. The kit as a skill-shaped folder; the instruction-file editor in MVP 0; advox and skills.sgnk.ai may be named; Hack4Bengal must not; all eleven earlier additions.
32. No student tier; Google Docs and Word import.
33. The design system is md.sgnk.ai; screens must match it.
34. Every source clickable; compact sgnk writing; a signal on every decision.
35. The best markdown note-taking app in the world; the second brain; an engine baseline that scales to future agents; every widely used plugin's capability built in.
36. Graphify as the example of the preprocessing layer an agent reads before it works, done better by the map and the kit.

For any ask the plan changed (for example the caps), confirm the plan says so plainly and gives the evidence, and judge whether the evidence justifies overriding the founders.

### A3. Internal consistency

Numbers that appear in more than one place must agree.

- The caps across S02, S03, S17, S19, S29 and sections 3 and 13.
- The blueprint's file count across S12, S15, S16 and section 9.
- The number of screens, sections and sources.
- Edit and blueprint credits across S06, S07, S11, S12 and S29.
- History days. The phase table against the risks table.
- The plan against `SCREENS.md`. The markdown against the PDFs. The screens against `gen.mjs`.
- Terminology: blueprint, kit, brief, skill folder, project, vault, document, page, note.
- Dates. British spelling throughout. Any sentence in the plan that contradicts another.

### A4. The research itself

For each of the thirty-one reports: what it set out to check, what it opened, what it could not open, what it concluded, and whether the plan used it faithfully. Then the audit of the research as a body of work:

- What was never researched. Candidates follow. No user interviews or surveys. No usability test of the shipped app. No pricing test. No legal review of India. No accessibility audit. No internationalisation. No support and operations planning. No SEO or distribution test. No security test. No performance measurement of the shipped editor. No analysis of the founders' own usage data from md.sgnk.ai. No competitor product trials beyond reading their pages.
- Contradictions between reports, and between reports and the plan.
- Selection effects: did the research look for evidence for the thesis, or against it? Name three places where a contrary finding was underweighted.
- Freshness: which numbers will be stale within a month (pricing, rate limits, plugin counts) and whether the plan says so.
- Source quality: which claims rest on a forum count, a marketing page, a README, versus a specification or a measured artefact.

### A5. Market and positioning

The thesis, "nobody sells the writing surface" and "the vault is the agent's memory". Is that a market, a feature, or a sentence? Size it with the evidence available (Obsidian's user counts if any page states them, Octoverse's India developer growth, the plugin download counts) and say plainly what cannot be sized. Who could occupy the position in twelve months: Obsidian (web version, agent panel), Notion, Craft, Tolaria, Anthropic, Google, Microsoft, Cursor. What would make the founders wrong, and how soon would they know.

### A6. Customer and job to be done

The plan names three groups: founders who brief agents, writers who want Google Docs comfort with markdown files, Obsidian and Notion people. Are these one market or three, and which one pays ₹299? For each: the job, the trigger to switch, the current tool, the switching cost, the reason to stay. Use `2026-09-16-switching-signals.md`, `2026-09-16-competitor-loyalty.md`, `2026-09-16-mobile-ratings.md`, `2026-09-16-note-methods.md` and `2026-09-16-note-research.md`. Is there a job Google Docs plus a markdown export does not already do? India versus the rest of the world: does the plan know which it is building for first, and does the evidence come from that market?

### A7. Competitive teardown, screen by screen

For each of the thirty screens, name the equivalent in Google Docs, Notion, Obsidian, HackMD and Craft, and for S12 to S16 also CodeGuide, ChatPRD, Kiro and Spec Kit. Where is frontmatter weaker on the same screen, where stronger, where merely equal. Use `2026-09-16-agent1-hackmd.md`, `2026-09-16-agent2-competitors.md`, `2026-09-16-agent6-agent-platforms.md`, `2026-09-16-obsidian-profile.md`, `2026-09-17-r7-ecosystems.md`. Then the feature table in section 6: does "built in by default" hold against what each competitor ships today, and what did the plan miss that at least two competitors have.

### A8. Pricing and packaging

Free caps: 50 documents, 1 GB, 5 pages, 3 collaborators, 7-day history, 1 repository with 20 pushes, 1 Low blueprint and 10 edits, against the founders' 5, 2 and 1. Argue both sides with the forty-product table. What is the conversion trigger for a person who never hits 50 documents? Is "every feature free" a moat or a leak? Pro at ₹299 and ₹2,499: what it includes, whether the annual discount is right, top-up prices, what a Max tier would be. Taxes and fees: 18 percent GST on the price, Razorpay's 2 percent plus GST, settlement timing, refunds, the ₹15,000 mandate cap, one attempt on Indian cards, international cards. Team and Enterprise as promised on S29: what a Team seat would cost to serve and to sell. Compare against the first-paid-tier cluster in the research and against Indian anchors (Zoho, Google Workspace India).

### A9. Financial model

Build it. Per user per month on Free and Pro: storage, versions, live sessions, model calls at the caps, email, support. Fixed: Vercel seats, Supabase or Firestore, domains, signing certificates, tools. Revenue at 1, 2 and 5 percent conversion at 1,000, 10,000 and 100,000 signed-in users. Break-even users. Sensitivity to model price, to conversion, to the free caps. The founders' time at any rate you state. Whether ₹299 covers Claude at the stated Pro caps, and what happens when a Pro user runs five High blueprints a month. State every assumption and cite the price you used.

### A10. Growth and distribution

Earlier research in this repository found that distribution, not margin, is the problem (₹20 lakh a month needs about 1.26 million visitors; find that finding in `docs/research/` or the PRD and check it). The plan's funnel is published pages, unlisted kits and kickoff prompts. Published pages are "not indexed" on S17 and S18: that removes search as a channel. Is that a mistake? The kickoff prompt is pasted into Claude Code, Cursor or Codex: is that a growth loop or a one-off? Community later, Team later. What does the plan assume about how anyone hears of it, and is the assumption stated anywhere. Propose the three cheapest channels the evidence supports and the metric for each.

### A11. Product design and interaction

Nielsen's ten heuristics and progressive disclosure across the whole product, not per screen.

- Information architecture: Home, Documents, Ideas, Shared, Settings, the tree, tabs, the rail. Navigation depth. Where a third disclosure level hides.
- Modality, undo, feedback, error prevention and recovery.
- Empty states. First run without a tour. Keyboard paths. The phone's bottom bar.
- Notifications and email. Settings scope.
- What happens at every cap, on every failure, on every revoked connection.
- The copy: any word a Google Docs user would not know. Any internal term that leaked: splice, sidecar, kit, blueprint, CAS, byte-exact, projection.

### A12. Screens, one by one

Sixty images. For each screen, desktop and phone, write at most six lines.

- Does it match its plan section. Are copy, numbers and caps consistent.
- Heuristics.
- Missing states: empty, loading, error, offline, over-cap, unpaid, first run, revoked connection, failed sync, conflict, deleted document, expired link, wrong password.
- Touch targets and reachability on the phone. Whether the drawers block the task.
- Contrast and focus. Jargon.

Then list the screens the product needs and does not have. Candidates follow.

- The empty review queue. Conflict resolution. The over-cap wall.
- Payment success, failure and mandate approval.
- A revoked GitHub App. A Drive folder that disappeared.
- The desktop app's first launch and folder pick. The phone's tree drawer.
- A template picker. The tasks panel and calendar panel promised in section 6. The tags panel. Search results. The command palette. Notifications.
- Team invitations. Account deletion and data export.
- The published page's 404 and expired-link pages. The password gate on desktop. The kit's public page. The MCP token setup.
- Onboarding for someone who arrives from a published page.

### A13. Design system and visual

Compare `gen.mjs` tokens and components against `src/app/globals.css` and the shipped components: colours, radii, borders, spacing, type sizes, the 52 px header, the 38 px tab strip, the 264 and 304 px panes, the toolbar. Fonts: the app uses "Google Sans" and "Google Sans Code". Check the licence of each for use in a third-party product; if Google Sans is not licensed for this use, that is a legal finding, not a design one. The PDF uses Mosvita; check its licence too. Icons: Material Symbols as inline SVG only, no emoji as UI, no other icon set; check the images and the code. Dark mode: contrast of every token pair. Density and line length. Print and export themes. The `.md` twin and published page styling.

### A14. Accessibility

WCAG 2.2 AA on every screen.

- Contrast of grey text on the off-white ground and on hairline borders. Focus visibility. Target size on the phone.
- Keyboard operability of the editor: CodeMirror in Edit mode, the Live mode, Doc mode.
- Screen-reader order of the three-pane layout. Live-region announcements for AI suggestions and sync state.
- Motion. Error identification. Labels on icon-only buttons. The toggle switches. The modals and sheets.
- Indian accessibility law and the Rights of Persons with Disabilities Act 2016 obligations for a private SaaS, verified from a primary source or marked unverified.

### A15. Internationalisation

The first market is India. Bengali, Hindi and other Indic scripts in the editor: fonts, IME input, line breaking, search normalisation. Right-to-left. Date, time and currency formats. Whether the UI is English only and whether that is stated. Markdown itself is ASCII-centric in its syntax; what breaks with Indic text in headings, links, tables, front matter keys. The export path (PDF, Word) with Indic fonts.

### A16. Editor and engine

The twelve invariants in section 17 against the code. Find each in `src/` or `share/` or say it does not exist yet. The splice engine: read `share/domain/splice-frontmatter.ts` and the tests; confirm or refute the two defects and their sizes. The corpus gate: `npm run corpus` against 8,513 files; run it if it runs read-only, report the result. Doc mode: how the shipped editor round-trips markdown today, whether a Doc surface can be byte-exact on top of it, what Tiptap's own markdown limits imply, and where the 27 and 15 features would break the round trip. The block system against SOLID as the plan describes it. Performance: a 10 MB document, a 2,000-file vault, a 500-row table, an image-heavy note; measure what you can in the shipped app.

### A17. Architecture and stack

Firestore or Supabase: take the founders' side first. What do they already have (a Firebase project, Auth.js with GitHub OAuth, Firestore code in `src/`), what does each migration cost, and is the plan's $22 a month gap the whole story. R2 key layout with no object versioning: how versions, deletes and disaster recovery work. Durable Objects: where they run relative to India, latency, the hibernation requirement, the 28-sessions-a-day free-plan cliff. Vercel: functions, regions, the Hobby rule, Fluid Compute, function duration for a blueprint. Caching. Observability. The port boundaries in the code against the plan's claim that adapters swap cleanly. The Cloudflare-only option the plan sets aside: is it dismissed too fast.

### A18. Data model and storage

The plan has no data model section. Derive the entities the features imply: account, workspace, project, document, version, share link, published page, collaborator, comment, review item, idea, decision, blueprint, template, connection, agent token, ledger entry, plan, invoice, upload. For each: where it lives, its size limits, retention, deletion, export, and who can read it. Flag every place the plan's features need a record the stack cannot hold (the 1 MiB Firestore limit, R2 with no listing by prefix cost, and so on). Backups and restores. Account deletion and data export under Indian law.

### A19. Sync, offline and conflicts

The settled position is git-merge plus a splice journal and compare-and-swap, never a CRDT. Check that the plan's live editing on Durable Objects, Drive sync by polling, GitHub pushes with the blob sha, browser offline storage and the desktop app all obey it, and describe the conflict a person sees in each case. Safari's seven-day eviction against "never let the browser be the only copy". Two devices offline at once. A Drive edit and a web edit in the same minute. The desktop app editing a file that GitHub also changed. State the expected behaviour for each and whether the plan defines it.

### A20. The AI system

Providers and terms: does each free tier permit a commercial pilot, what it trains on, what it logs, what it rate-limits per organisation rather than per user, and what happens to every user when one user drains the pool. Routing and fallback quality: latency, refusals, model changes, output differences between providers, and whether a free user gets a visibly worse product. Prompt design, caching, breakers, budgets, attribution. Idea mode: the question banks, the seven templates, the consistency checker, the evidence rules for Low, Medium and High, the honesty of "sources opened, dated and quoted" when a model does the opening, the legality of automated fetching for High. The blueprint formats: SKILL.md against the skills guide, AGENTS.md against agents.md, MANIFEST and checksums, the tar.gz delivery. The kickoff prompt tells an agent to `curl | tar` from a URL and then build: assess that as a security practice and as a support burden. Evaluation: is there any harness that measures whether a blueprint is good, and what "good" would mean.

### A21. Security and privacy

A threat model per surface.

- The editor rendering imported and shared markdown: raw HTML in CommonMark, scripts, images that beacon, links.
- Published pages: XSS, CSP, embedding, phishing on a trusted domain.
- Share links: entropy, enumeration, password hashing, rate limits, expiry enforcement.
- OAuth tokens for Google and GitHub: storage, refresh, revocation, scope creep.
- Agent tokens that may propose but never apply: where is that enforced.
- The review queue as the only gate between an agent and a file.
- Prompt injection through an imported vault, a shared document, a template, a Drive file changed by someone else, and the kickoff prompt.
- The desktop app: file access, the updater, the local model. The phone: share sheet content.
- Supply chain: npm dependencies and the embedded renderers. Secrets.
- Abuse of free tiers without a captcha. Account takeover.
- Data residency: records in Mumbai, R2 with only an APAC hint. Deletion. Logging of document text at providers.

Judge the six controls in section 14 and list what is missing.

### A22. Legal, compliance and policy

India.

- The Digital Personal Data Protection Act 2023 and its rules as in force: consent, notice, data principal rights, breach notification, cross-border transfer.
- The Information Technology Rules 2021 for an intermediary that hosts user-published pages, including the grievance officer and takedown duties.
- GST on SaaS for Indian and foreign customers. Invoice requirements.
- RBI rules for recurring payments and mandates.
- The Consumer Protection (E-Commerce) Rules, if they apply.

Platforms.

- Google's OAuth verification and the API Services User Data Policy, including Limited Use, for `drive.file` and Google Docs export.
- GitHub App terms.
- Vercel, Cloudflare, Supabase and Firebase terms for the stated use.
- Each model provider's terms for a commercial pilot on a free tier. Anthropic's usage policy.

Licences.

- Every embedded library named in the plan: Excalidraw, Marp, markmap, Mermaid, KaTeX, mammoth, Tesseract.js, pdf.js, pdf-lib, Paged.js, Pandoc, Tiptap if used, CodeMirror.
- Every font.
- The two Obsidian plugins whose shape the plan copies: obsidian-kanban is GPL and obsidian-charts is AGPL. The shape is fine to copy. The code is not. Trademark: "frontmatter" against Front Matter CMS and any registry you can reach; the domain. Terms of service and privacy policy pages: do they exist, and do they say what the plan promises (no training on documents). Age limits. Export controls, if any. Mark every legal point you cannot verify from a primary source as unverified; do not guess at law.

### A23. Platforms

Desktop: Tauri v2, macOS notarisation and its yearly cost, Windows signing when Microsoft's service excludes India, Linux builds needing CI, auto-update, the file watcher, local model integration, offline auth token lifetime, what the desktop can do that the web cannot and whether the plan sells that. Phone: a PWA on iOS has no share target, limited push, and storage eviction; on Android the share target needs an install; is a PWA enough for "the phone" or does the plan need a native app, and when. Browser matrix: which browsers the plan supports and which features degrade where, from `2026-09-17-r9-sharing-upload.md`.

### A24. Operations and support

Two founders. Backups and restore drills for R2 and the database; disaster recovery without object versioning; monitoring, alerting and cost alerts; on-call; a status page; support channels and response times; moderation and abuse reports for published pages; rate limiting; incident response; key rotation; dependency updates; the model providers' outages; what an outage looks like to a user offline in the browser. What the plan says about any of this, and what it must add before a stranger pays.

### A25. Delivery and process

Section 18: eight phases, 24 weeks at full time, against the founders' measured pace of about 1.2 days a week. Is the appetite honest? Dependencies and the critical path: what must exist before Ideas can ship, before Pro can charge, before the desktop app can sync. Definition of done: the specs harness (`specs/`, `npm run spec`), the verify gates, the red-proof rule in `AGENTS.md`. What the plan proposes to cut if the pace holds, and what you would cut. The smallest sellable thing. Hiring or contracting, if the ambition in section 1 is real. Risk of the two-founder bus factor.

### A26. Documentation and plan quality

Is the plan readable by the founders in one sitting and by a contractor cold? Structure, redundancy, missing sections (data model, security architecture, legal, operations, metrics definitions, glossary). Contradictions with `docs/PRODUCT-BRIEF.md` v15 and with the decision cards, which the memory notes say were never re-sorted against the plan. The plan's own claims about what was verified. The sources section: dead links, links that resolve to a different page than the claim, links to a root domain instead of the page.

### A27. Test plan

Write the tests the dev plan must carry, in "given, when, then" form:

1. Acceptance tests per screen, one to three each, including every missing state you named in A12.
2. Byte-exact import fixtures: an Obsidian vault with front matter, nested fences, tabs, CRLF endings, a column-zero list in front matter, a trailing comment, a 10 MB file, Indic text, a file that is not UTF-8. Expected: byte-identical or a visible refusal.
3. Doc mode round trips for every feature in the 27 and 15 lists; visible refusal for the 18.
4. Sync and conflict cases from A19, with the expected outcome and never a silent merge.
5. Offline per browser with the eviction rules.
6. AI cases: each provider returning 429; a document containing an instruction to the model; an imported vault carrying one; a kickoff prompt with a hostile URL; a Medium answer citing a document that does not exist; a High answer citing a page that does not say what it claims.
7. Money: the ₹15,000 mandate, a failed Indian card, a top-up during an outage, a refund, a downgrade over the cap, GST on an invoice, a foreign card.
8. Load and cost: 200 live sessions a day with and without hibernation; 1,000 free users at the caps against the pools; Drive quota at 30 saves a day; a 2,000-file import.
9. Security: XSS through markdown, CSP on published pages, share-link enumeration, password brute force, token revocation, an agent token attempting to apply.
10. Accessibility: keyboard-only completion of the first five minutes; screen reader through S01 to S06.

### A28. Pilot design and metrics

A twenty-user pilot: who they are (from A6), how they are recruited, what they are asked to do in the first five minutes and the first week, what is instrumented, the numbers that would tell the founders to stop, and the numbers that would justify the next phase. Check section 20's metrics for definitions: what counts as an active user, a finished blueprint, a conversion, an accepted proposal. Add what is missing.


### A29. Responsible AI, content policy and automation bias

What the product does when a model writes something harmful, defamatory, biased or simply wrong into a brief, a blueprint or an edit. Whether AI-written text is marked in the file and shown to the reader, as the settings screen promises. Whether the interface counters over-acceptance: the research in `2026-09-16-note-research.md` cites studies where people accept AI suggestions they should not. Check the Accept and Reject affordances on S07 and S20 against that literature. A content policy for published pages under Indian law and for the studio's own standards. What the High research pass may and may not fetch. Whether "Not sure takes the recommendation" on S13 is a convenience or a way to launder the model's choice as the founder's.

### A30. The public face

Sign-in first makes S01 the landing page. Where is the marketing site, the public pricing page, the help centre, the keyboard shortcuts page, the changelog, the status page, the blog, the documentation of the kit format for agent authors, and the page a stranger reads before deciding to sign in? None has a screen. Judge whether S01's right half is enough, what a first visitor needs to see, and what the brand says: the name, the mark, the wordmark, the one-line promise, the "Made with frontmatter" line, the tone of every sentence a stranger meets.

### A31. Lifecycle: activation, retention, churn

The journey after sign-in over ninety days. Activation: what counts and how it is measured. Emails: welcome, the 24-hour mandate notice, cap warnings, digest, re-engagement, receipts. Retention hooks the plan relies on. Churn: cancellation flow, downgrade over the cap, data after cancellation, win-back. Check every flow for dark patterns: nagging at caps, hard-to-find cancellation, pre-ticked options, the branding line as a tax. Consent for analytics under Indian law without a banner the founders would call a puzzle.

### A32. Permissions and roles

The plan has "People with a role" and no matrix. Build it: owner, editor, commenter, viewer, agent token, published-page reader, link reader with password, collaborator on Free sharing with a Pro owner. For each: read, edit, propose, apply, publish, share, delete, export, see history, see comments, invite. Sharing a document against sharing a project. Transfer of ownership. What a revoked collaborator keeps. Then check the screens and the data model against the matrix.

### A33. Portability, exit and existing users

The promise is that the files stay the person's own. Test it: export everything (documents, attachments, versions, comments, review state, ideas, decisions, blueprints, settings) as files a stranger's tool can read, and import it back into Obsidian. Where does the review sidecar `.frontmatter/review.jsonl` go. What is lost. Then the users the shipped app already has: md.sgnk.ai today keeps local drafts and settings under the persistence keys named in `AGENTS.md` section 8, with no account. Sign-in first locks them out of their own drafts unless a migration exists. Find the migration in the plan or report that it is missing.

### A34. Invented formats and their specifications

The plan invents or adopts: `fm-chart`, `fm-flow`, `fm-draw` and any other `fm-` block; Doc mode's front-matter keys; the flow view's heading conventions; MANIFEST.json; SHA256SUMS; DECISIONS.md; MAP.md; graph.json; the kit tarball layout; the review sidecar; the portfolio's front matter. For each: is there a written specification, a version field, a rule for unknown fields, a stated degradation in a plain markdown reader, and a test. Check SKILL.md against the skills guide's size limits and AGENTS.md against agents.md. Ask what happens when the specification changes after a thousand kits exist.

### A35. The agent and API surface

Section 17 promises a capability surface: open, read, search, propose, apply, publish, export. Section 18 puts the MCP server and API in Later. Reconcile the two. How does Claude Code, Cursor or Codex consume a kit today: the unlisted URL, `curl`, `tar`, and reading files. How does an agent read a live project before the MCP server exists: the desktop folder only. Design questions the plan must answer before Ideas ships: authentication for agents, rate limits, what a refusal looks like to an agent, what an agent can never do, how proposals from agents enter the review queue, idempotency of applies, versioning of the API.

### A36. Performance and reliability targets

The plan states web thresholds and response-time limits from Nielsen and web.dev but no targets of its own. Set them and check the shipped app against them where you can: first load on a mid-range Android over 4G, keystroke latency at 10 MB, save latency, sync latency, first token from each provider, blueprint generation time, PDF export time, Durable Object round trip from Kolkata, cold starts on Vercel. `npm run budget` is an echo with no real bundle budget, as `CLAUDE.md` admits; say what the budget should be. Error budgets and what "up" means for two founders.

### A37. India device and network reality

The first market writes on mid-range and low-end Android phones over variable 4G with data caps, shares through WhatsApp, and pays by UPI. Check the plan and the screens against that: bundle size, image handling, offline recovery after a dropped connection mid-save, the share sheet from WhatsApp into the inbox, UPI mandates, Indic fonts on the phone, storage on a 64 GB phone, the desktop app's relevance when the primary device is a phone.

### A38. Plan authorship bias

An AI wrote the plan for founders who gave it strong opinions. Audit the plan for agreement without evidence. List every place the plan echoes a founder ask without a source, every place it disagrees, and whether the disagreements are the right ones and the agreements the dangerous ones. Look for assumptions never stated: that people want AI in a note app at all when the research counted unwanted AI as a top complaint; that a blueprint is worth paying for; that markdown is a selling point outside developers; that the founders' own workflow is the customer's.

### A39. Search and retrieval

A note app lives or dies on search, and search has no screen. What is indexed, where, how ranked, what is excluded, how fast, whether it works offline and on the desktop, whether Drive and GitHub content is indexed, whether the index holds document text at a third party, accent and Indic normalisation, search and replace across files (Obsidian's 650-heart request), backlinks and unlinked mentions, the map, and the "related notes by meaning" promised for MVP 1.

### A40. Open source and standards strategy

Open source is a switching driver with 17 mentions in the research, and Tolaria is free forever. The plan says nothing about what, if anything, is open: the engine, the formats, the MCP server, the templates, the kit specification. Argue what should be open for adoption and trust, what must stay closed to sell, which licence, and what it costs to maintain. Whether the studio should propose its formats to the standards it already follows rather than invent parallel ones.

### A41. Decision-card reconciliation

The decisions site holds 204 cards, 23 of them the meeting questions, and the repository's own notes say they were never re-sorted against the plan. Do it: for each of the 23, and then for every card whose area the plan touches, state whether the plan answers it, contradicts it, or ignores it, with the card id and the plan location. Read `decisions/v2/*.json` and `CONTRACT.md` for the shape.

### A42. Promises audit

Every sentence the product says to a user is a promise. Collect them from the sixty images and the plan: "No password, no puzzle, no tour", "We never train on your documents", "Converted in your browser, nothing uploaded", "Scope: only files this app created or you picked. We cannot see the rest of your Drive", "Conflicts are never merged silently", "Structural checks run on this device and cost nothing", "Same account, same documents", "Not indexed", "Anyone with the link can read it. Revoke any time", and every other. For each, can the stack and the providers keep it, on Free and on Pro, today and after a provider change? A promise the stack cannot keep is a blocker.

### A43. Ownership, accounts and intellectual property

`AGENTS.md` section 6b records that the GitHub repository is under studiozephyrus, the app under a Vercel team, Firebase under a studio Gmail account, and the Cloudflare zone for frontmatter.in under a founder's personal account by deliberate choice. Before money is taken: which accounts must be owned by the company, what the domain and the brand belong to, what agreement exists between the two founders on IP and equity, whether the model providers and payment accounts are opened in the company's name, and what a dispute or a departure would do to the product. Mark unverified what you cannot see; do not read secrets.

### A44. Content assets

The product ships content, not only code: seven industry templates with question banks and sources, the consistency checks, the kickoff prompts for three agents, the sample project used on every screen, help text, empty-state copy, the plain-language rules. Judge each for existence, quality and ownership. Ask whether a salon booking page is the right demonstration for the customer in A6. Estimate the writing effort the plan has not costed.

### A45. Riskiest assumptions and the tests before code

List the ten assumptions the plan cannot survive being wrong. For each, the cheapest test that does not require building the product: customer interviews, a landing page with a waiting list, a click-through of these screens with ten people, ten blueprints written by hand for real founders and sold or given away, a price test. The plan of 13 September gated everything on twenty hand-made kits. Find where v4 dropped that gate and say whether it should return.

## 6. The report

Write `verify/2026-09-17/CLAUDE-AUDIT-REPORT.md`, structured exactly like this. Alongside it, keep `verify/2026-09-17/CLAUDE-AUDIT-FINDINGS.jsonl`, one object per finding, appended as each is found, with these keys: `id` (F001 upward), `severity` (blocker, major, minor), `angle` (A1 to A45), `location` (file and line, screen id, or section), `claim`, `evidence`, `impact`, `fix`, `effort_days`, `verified` (true, false), `source` (URL or path), `checked_on` (date).

1. **Verdict.** Three sentences. Approve, approve with changes, or do not approve, and the one reason that decides it.
2. **Scorecard.** A table of the forty-five angles: angle, score 0 to 5, top finding in one line, evidence location.
3. **Blockers.** Every blocker, in full: where, what the plan says, what the evidence says, why it matters, the smallest fix, effort in days.
4. **The findings register.** Every finding, numbered F001 upward: severity, angle, location (file and line, screen id, or section), claim, evidence, impact, fix, effort. Majors before minors. Expect well over one hundred rows.
5. **Fact check.** Every claim checked: claim, plan location, source, status (confirmed, mismatch, stale, unverifiable), note. At least one hundred and twenty rows. Mismatches first.
6. **Traceability matrix.** The thirty-six asks: ask, plan location, screen, status (complete, partial, changed with reason, changed without reason, missing), note.
7. **Research audit.** The thirty-one reports in a table, then the gaps, contradictions, selection effects and freshness in prose.
8. **Angle by angle.** A5 to A26 and A29 to A45, each with your reasoning and evidence, numbered as above.
9. **Screen by screen.** Thirty entries, then the missing screens.
10. **Financial model.** The tables and assumptions from A9.
11. **Test plan.** The ten parts of A27.
12. **Pilot.** A28.
13. **What to cut, what to add, what to reorder.** Three lists.
14. **Questions the founders must answer before building.** Numbered.
15. **What you could not verify, and why.** Complete.
16. A final fenced JSON block: `{"verdict": "...", "blockers": n, "majors": n, "minors": n, "claims_checked": n, "mismatches": n, "stale": n, "unverifiable": n, "asks_traced": 36, "asks_missing": n, "screens_reviewed": 30, "missing_screens": n, "angles_scored": 45, "mean_score": x.x}`.

Length: as long as the evidence needs. A finding without evidence is a sentence wasted. When you finish, run the writing gate on the report, confirm HEAD is unchanged, and print the report path, the ledger path and the JSON block.
