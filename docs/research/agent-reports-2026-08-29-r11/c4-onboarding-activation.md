### Method + evidence ledger

- `curl` reachable here; `WebFetch` gated. 26 URLs attempted, 17 returned usable bodies. [measured 2026-08-28T23:38Z]
- Obsidian Help renders client-side; raw source recovered via its Publish backing store `publish-01.obsidian.md/access/f786db9fac45774fa4f0d8112e232d67/<path>.md` — this returns the authors' own Markdown, not a rendering. [measured]
- Failed to open, recorded rather than guessed: `help.figma.com` (404 on 2 paths), `notion.com/help/guides/get-started-with-notion` (404), `amplitude.com/blog/product-benchmarks-report` (200 but 1 char of text after script-strip — JS-only), `mixpanel.com/blog/product-benchmarks` (404), `userpilot.com` (404×2), `appcues.com/blog/user-onboarding-benchmarks` (404), `openviewpartners.com` activation post (redirects to firm homepage; OpenView's blog corpus appears gone). [measured] Consequence: **only one quantitative activation benchmark was opened.** No second source to triangulate against. Do not present the numbers below as consensus.

### 1. Benchmarks — signup → activation

Single opened source: Lenny Rachitsky + Yuriy Timen, "What is a good activation rate", 2022-10-25, n=500+ self-reported products. [fetched]

| Metric | Value | Tag |
|---|---|---|
| Definition used | `activated / users who completed signup flow` | [fetched] |
| All products, mean | 34% | [fetched] |
| All products, median | 25% | [fetched] |
| SaaS only (excl. marketplace/ecom/DTC), mean | 36% | [fetched] |
| SaaS only, median | 30% | [fetched] |
| "GOOD" | 60th percentile | [fetched] |
| "GREAT" | 80th percentile | [fetched] |
| Products with a time-bounded milestone | ~6%; median window 10 days, mode 7 days | [fetched] |
| Products with a two-part milestone | ~10% | [fetched] |

- Per-product-type breakdown (incl. "B2B prosumer SaaS", the row nearest frontmatter) was published as an **image**; text extraction returned none. I do not have that number and will not estimate it. [measured]
- Method limitation the source does not hide: self-reported by respondents, not instrumented; respondents chose their own milestones, so the denominators are heterogeneous. [fetched + inference]
- Ranked tactics that moved activation, by response frequency: (1) simpler onboarding UI/UX, (2) reducing onboarding friction, (3) email/follow-up comms, (4) optimizing copy, (5) smarter top-of-funnel targeting, (6) sales outreach, (7) incentives, (8) showing value earlier. [fetched]
- Verbatims directly transferable here: *"Templates and pushing users to start a design with the right template"*; *"Metric spiked after introducing templates to choose from in the onboarding flow"*; *"Removing login gate from initial app interactions"*; *"Making our best-known feature not require configuration to try"*; *"Driving all attention into one seeded task for guided completion"*. [fetched]

### 1b. Activation → retention

- Stated threshold for a valid milestone: activated users must retain **at least 2× better** than non-activated. Below 2×, the milestone is not predictive and should be re-picked. [fetched]
- Named failure modes: too early (= completing signup), too late (= multiple purchases), not predictive, not actionable, too complicated (multi-stage + time bound where a single action gets most of the predictive power). [fetched]
- Causality: initial milestone is correlative only; causality is established by running experiments that lift activation and watching whether downstream retention moves. [fetched]

### 1c. The denominator problem — this benchmark does not apply to frontmatter unmodified

- frontmatter has **no signup**, so the benchmark's denominator (`completed signup flow`) does not exist. [inference]
- Substituting "first launch" for "signup" makes the denominator strictly larger — it retains everyone who would have bounced at a signup wall. [derived: signup-completers ⊆ first-launchers, therefore `activated/first-launchers ≤ activated/signup-completers`]
- **Anti-recommendation:** never publish or target "30% activation" for frontmatter. Report `first-run completion rate` and `day-7 return rate` under those names. Comparing them to 30% is a category error.

### 1d. The refuted Obsidian claim — status after direct check

- obsidian.md homepage and obsidian.md/about, read 2026-08-28: **no download count, no user count, no install count published anywhere on either page.** [fetched] The About page states only "100% supported by our users, not investors" and lists 8 named staff + 1 office cat. [fetched]
- Obsidian Help (full page index, 466KB cache manifest enumerated) contains no usage-statistics page. [measured]
- Therefore: Obsidian publishes no denominator. A rate of the form "of 1M+ downloaders, X% never…" cannot be derived from any Obsidian source, because the numerator and denominator are both unpublished. Treat as refuted; I found no real source. [derived]

### 2. Documented first-run flows — what these seven actually ship

| Product | Ordering of the documented first run | Notable | Tag |
|---|---|---|---|
| Obsidian | 1 Download/install → 2 Create a vault → 3 Create your first note → 4 Link notes → **5 Import notes** → 6 Sync across devices | Import is step **5 of 6**, after the scripted note and link exercises | [fetched] |
| Obsidian (vault step) | Two choices only: "Create new vault" (empty) or "Open folder as vault" (existing folder) | Existing-folder path is co-equal, not buried | [fetched] |
| Obsidian (first note) | Fully scripted: `Cmd+N` → name it "Obsidian" → **paste supplied sentence** → paste supplied `# Sharpen your thinking.` → `Cmd+B` | The doc hands the user the content; user supplies zero ideas | [fetched] |
| Obsidian (link step) | Two named notes ("Three laws of motion" / "Law of Inertia"), `[[`, link-to-nonexistent-note, backlinks pane, local graph | Teaches the mechanic on throwaway content, not the user's | [fetched] |
| Notion | Import via `Settings → Import` **or** typing `/` on any page | Direct types: .txt .md .markdown .docx .csv .html .pdf .zip; app importers incl. Confluence, Asana, Evernote, Trello; multi-file allowed for PDF/HTML/MD/DOCX/TXT but **not** CSV/ZIP; not available on mobile | [fetched] |
| Linear | **Demo first, workspace second.** "Intro to Linear" video + "Demo Linear" workspace precede "Create a workspace" | Demo is explicitly disposable: "Changes are local to your browser and reset on refresh. The demo does not include settings" | [fetched] |
| Linear | Then role-split (Admins / Team members) and size-split (small teams / startups & mid-size / large & scaling) | Segmentation is by *situation*, asked implicitly via which link you click — no form | [fetched] |
| Vercel | 3 steps: install CLI → add agent support → deploy. Prereqs: account + Node 18+ | Ships a copy-pasteable **"Agent Prompt"** so an AI coding agent performs the onboarding | [fetched] |
| Supabase | No linear flow. Getting Started is a matrix: ~22 framework quickstarts + web demos + mobile tutorials | Onboarding is *routing*, not a sequence | [fetched] |
| Raycast | Manual root exposes exactly two "Start Here" entries: Quickstart, Chat with Raycast AI | Basics = Quickstart, Search Bar, Action Panel, Aliases & Hotkeys, Keyboard Shortcuts, Import & Export Settings | [fetched] |
| Figma | Not opened (404×2) | — | [measured] |

- Pattern across the four that most resemble frontmatter (Obsidian, Linear, Raycast, Vercel): **first run teaches one input mechanic on content the product supplies, and defers the user's own corpus.** Only Notion and Obsidian put import in the documented path at all, and Obsidian puts it fifth. [derived from the table]

### 3. Empty states — what the evidence says

Kate Kaplan, NN/g, "Designing Empty States in Complex Applications: 3 Guidelines", 2021-09-19. [fetched]

- Three jobs of an empty state: **communicate system status**, **provide learning cues**, **provide direct pathways for key tasks**. [fetched]
- Leaving a container genuinely blank "creates confusion and decreases user confidence" and misses learnability + discoverability. [fetched]
- The single most damaging pattern named: showing a definitive "No records" *while still loading*, then replacing it with content. Best case the user distrusts the app; worst case "trigger-happy users (that is, most users) never see the relevant content and cannot complete their work." [fetched]
- Empty states are the canonical home of **pull revelations** — help that appears because the user touched that element, never pushed. [fetched]

Kate Kaplan / NN/g, "Onboarding Tutorials" article. [fetched]

- Headline finding: tutorials "interrupt users, don't necessarily improve task performance, and are quickly forgotten." [fetched]
- Push revelations (first-launch walkthroughs, "What's New" modals) are "dramatically overused" and "users frequently skip them." [fetched]
- Stated exception: walkthroughs did test useful for a genuinely **novel interaction paradigm** (their AR research). [fetched]
- The praised counter-example (ArcGIS) has two properties: it **required the user to perform the task** rather than watch, and it was **not auto-activated** — parked in the sidebar, revisitable after the user inevitably forgot. [fetched]

### 4. Sample and demo content — convergent evidence

- Obsidian **Sandbox vault**: a separate, disposable vault "to explore various functionalities without affecting your existing data", also used for debugging (isolating plugin/theme/app faults). Opened deliberately — sidebar Help icon → Open, or command palette "Open sandbox vault". **Not shown automatically at first run.** Not on mobile; a copy is downloadable from the obsidian-help GitHub repo. [fetched]
- Linear **demo workspace**: local-only, resets on refresh, explicitly excludes settings and SLAs. [fetched]
- These two independently satisfy NN/g's ArcGIS criteria (do-it-yourself, on-demand, revisitable, no auto-launch). Three unrelated sources converging on the same shape is the strongest structural signal in this whole corpus. [derived]
- Recommendation: ship a sandbox that is a **real folder of real .md files on disk**, disposable, opened on demand from a persistent affordance — not a modal, not a first-launch takeover.

### 5. Import as an activation lever

- Obsidian's Importer is an **official community plugin**, not core: the user must first enable Community plugins, then install Importer. That is a two-gate detour before any migration. [fetched]
- Coverage: 16 first-party sources (Notion, Airtable, OneNote, Evernote, Apple Notes, Apple Journal, Google Keep, Bear, Craft, Roam, Logseq, Tomboy/Gnote, HTML, CSV, Markdown, Textbundle) + 9 community-contributed migration guides (Day One, Diaro, Remnote, Samsung Notes, TiddlyWiki, TheBrain, Ulysses, Zim, zkn3). Importer supports **templates** that rewrite title, properties, and content on the way in. [fetched]
- Notion's importer is core, reachable two ways (`Settings → Import` and `/`), and multi-file for most types. [fetched]
- frontmatter's structural advantage: it has **no importer problem**. The corpus is already .md on disk. "Import" collapses to "point at a folder", which is Obsidian's *second* vault option and Notion's whole feature. [inference]
- **Recommendation:** make "open an existing folder" the *first* option, not the second. Obsidian orders it second ("Create new vault" then "Open folder as vault") because it must; frontmatter has no such constraint.
- **Anti-recommendation:** do not build source-app importers (Notion/Evernote/Roam). That is Obsidian's 16-format maintenance burden, and it is not where frontmatter's engine advantage lives. Convert nothing; read what exists.

### 6. What causes abandonment in note-taking apps

Ferreira, Segura, Souza, Brasil (IBM Research Brazil + PUC Minas), "How People Manage Knowledge in their 'Second Brains' — A Case Study with Industry Researchers Using Obsidian", arXiv:2509.20187v1, submitted 2025-09-24. Case study, **n=7** CS researchers, one-hour interviews plus observation tasks on their own live vaults, Portuguese, quotes translated. [fetched]

- **Sample caveat, load-bearing:** all seven were already Obsidian users. This is a survivor sample. It documents *friction*, not *abandonment rates*, and cannot supply either. [inference]
- Documented first-run/ongoing friction, observed not reported: clicking a folder then "new note" creates the note **in the vault root, not the selected folder**; the folder-scoped path requires right-click → New note. [fetched]
- Design implication stated verbatim by the authors: *"Provide a basic knowledge organization structure — participants reported wanting to create their own organization structure, but starting from a 'blank page' might be overwhelming for some users."* [fetched]
- Second implication: *"Connect creation/organization strategy with retrieval strategy from the start — provide examples or templates of organization strategies associated with retrieval strategies."* [fetched]
- Central finding: **intended retrieval strategy determines creation and organization behaviour.** Users who retrieve by search organize differently from users who retrieve by folder from users who retrieve by tag. [fetched]
- Scaling failure named by a participant: P6, having split into three vaults — *"Now, with 3 vaults, it's confusing"*, with folder indexes that worked at one vault ceasing to work at three. [fetched]
- Organizational satisfaction is affective, not functional: P4 describes moving a note between folders as *"the closest thing to checking an item in a paper list… There! It is done!"* [fetched]
- Honest gap: I found **no** published quantitative abandonment or churn study for note-taking apps. arXiv queries for `personal information management + abandonment` and `empty state` in cs.HC returned zero hits. [measured] Anyone quoting a note-app abandonment percentage is, on this evidence, quoting nothing.

### 7. frontmatter's activation definition

**Activation = the first projection-mediated write to a Markdown file that frontmatter did not create.**

One event. Not two-part. Not time-bounded in the definition; measured against a 7-day window because 7 is the mode of time-bounded milestones in the only benchmark opened. [derived from fetched mode=7]

Why this one:

- **It is the product's entire thesis in a single act.** The claim is "the file is the source of truth; every view is a deterministic reversible projection." A user who edited *through a board/calendar/decision card* and watched their own file change correctly has personally verified the claim. Nothing else does. [inference]
- **It structurally entails the retention substrate.** A file frontmatter did not create implies the user pointed at their own corpus. Corpus presence is the thing that makes session 2 happen; a sample file cannot cause session 2. [inference]
- **It is actionable in the Lenny sense** — a solo founder can move it with first-run copy, folder-picker ordering, and empty-state wording, all of which are single-handed edits. [inference]
- **It is early enough.** It can happen inside the first minute. Milestones that take three sessions are unmovable by design changes. [fetched: "too late" failure mode]
- **It has a falsifiable 2× test.** If day-7 return among users who hit it is not ≥2× the non-hitters, the definition is wrong and must be re-picked. [fetched]

Explicitly rejected candidates:

| Candidate | Rejected because | Tag |
|---|---|---|
| App launched / vault opened | "Too early" — the named canonical mistake | [fetched] |
| First note created in frontmatter | Measures the sample, not the user's corpus; Obsidian's own doc shows this step can be completed by pasting supplied text | [fetched+inference] |
| Ran a degradation certification | Proves engine quality, not personal value; a user can pass it while caring about nothing | [inference] |
| Published a site from a projection | "Too late" — a downstream outcome, not a leading indicator | [fetched+inference] |
| N files edited across M sessions | "Too complicated"; also unmovable | [fetched] |

### 8. First-run flow, designed against the evidence (no email field, no OAuth wall)

1. **Launch lands on a folder picker with two options, "Open an existing folder" first and visually primary; "Start a sandbox" second.** Inverts Obsidian's ordering, which was constrained by its vault model. Directly implements the top-two ranked activation tactics: simpler UI, and "removing login gate from initial app interactions". [fetched tactics + inference]
2. **No walkthrough, no modal, no tour, no "What's New".** Push revelations are skipped, unmemorable, and do not improve task performance. [fetched]
3. **On folder open, frontmatter scans and shows what it found, as a status line, not a wizard**: file count, which projections are available for this corpus, and which are not and why. This is NN/g guideline 1 (communicate system status) applied to a corpus instead of a table. Never show a definitive empty/"nothing here" while the scan is running. [fetched]
4. **The empty state of every projection carries its own pull revelation**: the board view on a corpus with no status keys says what key it looks for, shows the exact line it would add, and offers one button that adds it to one file. Guideline 2 + guideline 3 in one control. [fetched]
5. **The activating act is a one-line, in-place edit through a projection, on a file the user already owns** — e.g. drag one card between columns, which writes one key. The write is a splice; the diff is shown; undo restores byte-identity. This is the ArcGIS property NN/g praised: the user *performs* the task. [fetched]
6. **Show the byte-level diff of the very first write, once, inline.** The single most differentiated thing frontmatter can prove in the first minute is that it did not reformat the rest of the file. Prove it visually, then never show it again unprompted. [inference]
7. **Sandbox is on-demand and permanent**, reachable from a persistent Help affordance, disposable, a real folder on disk. Copies both Obsidian's Sandbox vault and Linear's reset-on-refresh demo. [fetched]
8. **Segment implicitly, by which door they opened**, as Linear does with its admin/member and team-size splits — no role question, no "what will you use this for" form. Corpus shape is the segmentation signal: dated files → calendar first; status-keyed files → board first; neither → reader. [fetched + inference]
9. **Ship an agent prompt.** Vercel's getting-started is three steps, one of which is a copy-pasteable prompt that makes an AI coding agent perform the setup. For a CLI-adjacent developer tool in 2026 this is a documented, shipped pattern, and it costs one Markdown block. [fetched]
10. **Never block on anything.** No account, no key, no network call required to reach step 5.

### 9. Retention mechanics — honest ones (streaks and badges banned)

- **Correctness is the retention mechanic.** For a file-of-record tool, one silent corruption ends the relationship permanently; nothing in the funnel outranks never losing a byte. Obsidian's own manifesto makes durability one of five principles, and the paper's participants organize entirely around future retrieval. [fetched]
- **Reversibility receipts on demand.** The degradation certificate is a trust artifact — surface it when the user is about to do something risky (first write to a foreign vault, first cross-engine round-trip), never on a schedule.
- **Near-zero re-entry cost.** Reopen exactly where the file was. No login, no sync spinner, no "reconnecting". Every second of re-entry friction is charged at every session, not once.
- **Let the content carry the cadence.** A calendar projection over dated files pulls the user back on *their* deadlines. A board pulls on *their* work. This is recurring pull that the product does not manufacture — the opposite of a streak, which manufactures a cadence the content does not have.
- **Serve the retrieval strategy, since it drives everything upstream.** The paper's central finding is that retrieval intent determines creation and organization behaviour; a tool that makes retrieval good gets organization behaviour for free. Search must be instant and exact-match-first. [fetched]
- **Templates as organization starters, not decoration.** Both the paper ("blank page might be overwhelming"; "provide examples or templates of organization strategies associated with retrieval strategies") and the benchmark survey ("metric spiked after introducing templates") independently point here. Two unrelated sources; the strongest supported recommendation in this report. [fetched ×2]
- **Publish a changelog and a roadmap.** Obsidian ships both as top-level nav items. It is retention communication that requires no email address and no notification permission. [fetched]
- **Import is a lever you can pull more than once.** The second migration (a colleague's folder, an old repo's docs) is a second activation event for an already-retained user.

**Anti-recommendations, explicit:** no streaks; no badges; no XP or levels; no "you haven't opened X in N days"; no red-dot unread counts; no weekly digest (there is no email field, and adding one to enable a digest would be the single worst trade in this document); no note-count or graph-node-count vanity displays; no first-launch tour; no "What's New" modal on update [fetched: NN/g names this exact pattern as harmful]; no artificial trial countdown; no referral loop.

### 10. Instrumentation under implicit-telemetry-only

Rule read as: **no identifiers, no behavioural event stream, no phone-home per action.** What remains is genuinely enough to run the loop.

| Signal | How obtained | Answers | Cannot answer |
|---|---|---|---|
| Version-check requests, counted per day per version | The update check the app already needs to make | Install base trend; day-N return rate as `checks on day N+1..N+7 / checks on day N` | Anything per-user; anything about what they did |
| Local usage file, plain-text, in the user's own folder, never transmitted | `.frontmatter/state.json` — human-readable, user-deletable, documented | Everything, *for that user*, and it becomes evidence only when they paste it into a bug report | Any aggregate |
| Degradation certificates submitted with bug reports | User-initiated | Real corpus shapes in the wild: which foreign vaults break, which projections were reached | Frequency, because reporters self-select |
| Generator marker in published site output | Deterministic projection already writes the file | Count of installs that reached the furthest downstream act, observable publicly | Who, or how many tried |
| Docs page-hit ratios between consecutive pages | Server logs of the docs site | Funnel *shape*: where the documented flow leaks | Whether app users or tyre-kickers |
| Support/forum/issue volume, normalized per version | Public trackers | Regression detection at release boundaries | Silent churn |
| Paid-tier refunds and non-renewals | Billing | The only hard churn number available | Cause |

- **The honest headline metric is `day-7 return rate`, not `activation rate`.** [derived: without a signup denominator, the benchmark's ratio is undefined; return-rate is computable from version checks alone with no identity.]
- **To test the 2× requirement without per-user telemetry**, run it as a *release* experiment, not a *user* experiment: change one first-run element, hold everything else, compare day-7 return between the two version cohorts. That is the same structured-experimentation route the benchmark source prescribes for proving causality, executed at version granularity. [fetched + inference]
- **Anti-recommendation:** do not add an anonymous opt-in analytics prompt at first run to "just get the numbers". It is a consent modal in the exact slot NN/g says a push revelation destroys, it fails the implicit-only rule, and the version-check denominator already gives the one ratio that matters.

### Open, unresolved, flagged

- No second quantitative activation benchmark was opened; the 34/25/36/30 figures rest on one self-reported 2022 survey. Do not harden them. [measured]
- The "B2B prosumer SaaS" per-type activation number exists in that source as an image and remains unread. [measured]
- No published quantitative abandonment study for note-taking apps was found. [measured]
- Figma's documented onboarding was not opened. [measured]
- The Obsidian friction findings come from n=7 existing users in one Brazilian lab. Directionally useful, statistically nothing. [fetched + inference]