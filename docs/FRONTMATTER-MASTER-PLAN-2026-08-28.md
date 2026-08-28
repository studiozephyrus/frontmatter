# FRONTMATTER — THE MASTER PLAN (v2.0, integration complete)

**Written 2026-08-28, final integration ~19:00 IST.** Five research rounds, 29 agents, ~5.5M research tokens, synthesized with the prior internal record (mdmax PLAN §4/5/7/8, engine PLAN, mdmap, the July demand corpus, AIOS). Every claim carries a tag: `[measured]` = executed here against live code/corpora · `[fetched]` = primary source opened · `[SS]` = search-summary, unverified · `[inference]` = reasoning. Full evidence: **`docs/research/agent-reports-2026-08-28/`** (29 reports, referenced as `→ i1..i7, e1..e8, h1..h4, ed1..ed5, aj1..aj4, f1`).

**Citation convention:** *mdmax PLAN* = `docs/mdmax/PLAN.md`; *engine PLAN* = `docs/engine/PLAN.md`. Never cite a bare "PLAN §N".

**Governing settled verdicts (do not re-litigate):** no new format — profiles over valid CommonMark (MDZ 07-29, re-confirmed: a formally-specified markdown successor launched Aug 2026 sits at 2★ `[fetched]`); MDMAX is a library subordinate to the editor; splice 907/907; D11 slugs; MUTATE-vs-consensus; the sanitizer 61/0.

---

## 1. THE PRODUCT IDEA

**frontmatter is the durable home for a person's entire AI journey — the markdown-native workspace where humans and AI agents work on the same files.** You prompt any LLM anywhere; the outputs that matter — project ideas, product plans, decision flows, research, Q&A — land in frontmatter as structured, rendered, agent-legible markdown in files you own, instead of evaporating in chat scroll. One file is simultaneously: a document a human edits, a surface that renders (board / decision card / calendar / site), and a contract an agent reads and writes — **provably without corrupting a byte**.

Why this composes from what already exists:
- **The substrate is proven in-house** — this machine already runs a markdown-native operating system: 124 SKILL.md automations, an 871-line self-amending markdown constitution, frontmattered memories, budget-bounded maps, append-only ledgers, snapshot card sets `[measured → i5]`. frontmatter productizes a working private practice.
- **The engine is the moat** — byte-preserving splice (0 corruption across **8,866 foreign multi-author files** `[measured → h2]`), the degradation certificate, content-derived anchors (99.627% / 0.050% false over 41,642 block-versions `[measured, engine PLAN §1.1a]`), the machine-view differ.
- **The market walked into the thesis** — LLM output is a markdown stream (Vercel Streamdown: **6.55M npm downloads/week** `[fetched]`); AGENTS.md standardized (23,964★, transferred to a neutral org `[fetched]`); Obsidian ships agent Skills (47,418★ `[fetched]`) instead of embedded AI; Notion shipped a markdown agent API `[SS]`; `Accept: text/markdown` hit 175 points on HN two days ago `[fetched]`.
- **The category's unowned middle** `[inference → aj4]`: memory infra atomizes journeys into facts for agents (mem0, claude-mem-92k★-but-SQLite); consumer apps keep sources for reading (NotebookLM: 30M users, **no bulk export, no chat API** `[SS]`); exporters dump stale transcripts (400K+ installs prove the funnel `[SS/fetched]`). **Nobody treats the finished AI output — the plan, the decision, the research answer — as a first-class, rendered, evolving document in files you own.** That is the category frontmatter names.

One sentence, founder's own + the 2026 addendum: **"Google Docs for markdown — where the AI works in the same file you do, provably without wrecking it."**

---

## 2. THE PROBLEMS WE SOLVE (ranked, evidence-carried)

1. **AI outputs evaporate.** Chat scroll is where thinking goes to die: ChatGPT's only escape hatch is an all-or-nothing account ZIP by email with a 24h link `[SS]`; NotebookLM chats were ephemeral until Jan 2026 `[SS]`; a 400K-install exporter economy exists and 100% of it terminates in stale one-shot dumps `[fetched/SS → aj4]`. → the capture loop (§6).
2. **Sync silently destroys data** (T1, the #1 pain: 561/3,220 HN comments; fresh instances six weeks old — "fully synced" files missing final characters `[fetched → e7]`). → trust surface: visible sync, conflict inbox, journal-before-overwrite, never-lose-data.
3. **Editors rewrite what you didn't touch (dialect betrayal).** Now proven across every structured-editing surface in the space `[measured → h3/h4]`: Front Matter CMS deletes YAML comments/anchors on a one-field edit (its own code says "keep the comments" and then discards the Document); Hubble deletes reference links and `og:image` keys; OpenKnowledge permanently drifts flow-seq spacing on its namesake surface; ProseMirror/TipTap/Milkdown/BlockNote regenerate by architecture (`blocksToMarkdownLossy()` is a real API name `[SS]`). → the splice guarantee, the word we own.
4. **Trust collapse / shutdown fear** (T2): plain files in your repo, no export step to lose fidelity in — the storage format IS the export format (Reflect rewrote itself to exactly this model, 1,441★ in 11 weeks `[fetched]`).
5. **No browser access** (T9: the 254,435-view, six-year Obsidian thread, last post Aug 14 `[fetched]`).
6. **The review loop doesn't exist on files you own** (rank-6 pain; independently validated twice in four weeks: Markleft, OzBrain — whose founder literally sells "audit log of what was changed, by what agent and why" `[fetched → e7]`).
7. **Agent edits are unauditable everywhere.** Provenance evaporates at accept in Word/Docs/Cursor/Lex — no editor renders authorship at read time, nothing travels with the file, nothing is byte-anchored `[SS/fetched → ed4 §5]`.
8. **Price betrayal** (T3): Notion's 20-lifetime-AI-responses + ~20% raise anger `[SS]`; M365's +43% Copilot bundling drew a CMA probe `[SS]`. → the never-list as marketing copy.
9. **Complexity fatigue** (T8): Obsidian's own community — "most of the 1M+ downloaders never get past their first note" `[SS]`. → simplest-editor bar + zero-config profiles.
10. **Import is a lie.** The #1 importer breakage class is **lying import reports** ("47 succeeded, 0 failed" with 4 notes missing); Obsidian posted $500 + $5,000 bounties on exactly this gap `[fetched → e5]`. → the verification-report importer.

---

## 3. WHAT THE MARKET CANNOT CURRENTLY SOLVE (the gap map, each with its window)

| Unclaimed position | Evidence of absence | Window |
|---|---|---|
| **Byte-exact structured editing (both halves of the file)** | All three teardowns regenerate; the two strongest each solved fidelity only on the half their editor doesn't model `[measured → h3/h4]`. OK's fm drift is provable in a 10-second live demo | Narrow but real — OK ships ~100 releases/week; the fm-splice claim is durable (architectural rewrite for them), the general claim erodes |
| **Stateless fidelity** | OK's byte-contract requires a running CRDT daemon (agent edits literally error without it) `[measured → h4]` | Durable — architectural |
| **O(edit) cost** | OK's own docblock: per-edit full serialize+parse, "unbounded by doc size," fix "needs a real incremental parser" `[fetched → h4]` | Durable |
| **Render-fidelity certification** | No product certifies cross-engine degradation; email-testing (Litmus $500/mo) proves the testing layer monetizes while data stays free `[SS → e8]` | 6–12 mo; publish the dataset before the design (clone latency <24h `[measured]`) |
| **The review loop on files you own** | Google's API cannot even create suggestions `[fetched → ed5]`; Lex's track-changes is "in development" `[SS]`; comments that commit are structurally off OK's table (machine-local, "never committed") `[fetched → h4]` | 6–12 mo |
| **Byte-anchored, document-portable, reader-visible AI provenance** | Absence check passed with precision: Cursor = admin telemetry, Grammarly = cloud report, Agent Trace = repo sidecar; the writing editors have nothing `[SS → ed4 §5]` | Open; claim wording fixed (§9) |
| **The rendered, evolving AI-output document layer** | Memory tools store facts; consumer apps store sources; exporters store dumps `[→ aj4]` | Open — the category to name |
| **Session interchange** | No standard exists; OpenAI and Claude exports are mutually unreadable proprietary shapes; every parser is reverse-engineered `[fetched → aj1]` | Open — whoever documents the open markdown-native session format becomes the schelling point |
| **A file-native home** | Obsidian Homepage plugin: 1,294,057 downloads ("home = a markdown note you own" beat bespoke dashboards ~20×) `[fetched → e2-home]`; no product ships it natively | Open |
| **Claim-level method+confidence** | Across OKF/SKILL.md/llms.txt/MyST/.prompty: no spec claims it; OKF argues against stored scores — signals-not-scores derivation at render time is unproductized `[fetched → aj3]` | Open — a renderer, not a format, is positioned to do it |
| **Already commodity — do not position on:** "agent reads/writes my markdown over MCP" (Bear/Craft/Notion/MDflow/GitBook/obsidian-skills + a 9.3M-downloads/week skills CLI `[fetched → e4]`) | | 0 mo |

---

## 4. THE FEATURE MAP — five layers

Full per-feature extraction (100+ features, each with source, why, and its frontmatter form) lives in `ed1..ed5` + `aj1..aj4`. This is the decision layer.

### L0 — The simplest trustworthy editor
Shipped base (sgnk-md clone: modes, tree, tabs, toolbar, slash, vim, wikilinks/KaTeX/Mermaid, exports, PWA/Tauri) plus, from the editor sweep:
- **Trust surface (Phase 0, restored):** visible sync chip → conflict inbox (mine/theirs/keep-both; conflicts render as suggestion hunks — one grammar for every delta) → version-history UI with **named versions** + **"changed since you last opened" banner** (per-user lastSeenSha; trivial on git where Docs needed bespoke infra `[SS → ed5]`) → background auto-sync.
- **Local history** (the IDE trust feature): default-on per-save revisions, 10s merge window, merged timeline (git + local + AI edits) filtered by provider, each entry labeled by ACTOR; **section-level restore**; no silent expiry (JetBrains' 5-day wipe is the anti-pattern) `[→ ed2]`.
- **Command palette as the universal action surface** + goto-anything with composable operators (`#` headings vault-wide, `@` in-doc, `:` line); **zen/composition mode** (one: chrome-fades-on-typing + typewriter scroll + optional sentence focus — iA/Ulysses convention `[SS → h1]`); folding; multi-cursor; settings-as-versioned-file-in-vault.
- **WYSIWYG spec from Typora's own tracker** `[fetched → ed1]`: markup reveal keystroke-gated never click-gated (#443); caret maps to rendered geometry, backspace eats text never delimiters (#2271); ONE explicit reveal-policy toggle (#1317); caret+scroll preserved across every view switch — **OffsetMap already owns this primitive**, a cheap differentiator.
- **Doc Health**: four-surface diagnostics (status count → panel → inline mark → F8 cycling with quick fixes) over broken links/anchors, duplicate headings, staleness, cert warnings, unreviewed AI edits; vault-scoped checks ON, publish-dependent OFF `[→ ed2]`.
- **Importers with the verification report** (§2.10): the seven-panel spec from real issue mining — reconciliation table summing to a census counted from the OUTPUT filesystem, per-item failure ledger, rename ledger, link audit, attachment table with HTTP statuses, construct-downgrade declarations, metadata matrix `[fetched → e5]`. Count parity is provably insufficient (content loss hides inside "successful" conversions).
- **Home = HOME.md** (§12): a real markdown file with custom-render blocks — recents grid + templates row + "landed today" + needs-review lane; default-ON for empty vaults, never displaces resume-last-session `[→ e2-home]`.
- **Merge-formatting paste** (paste-as-markdown always + a one-line degradation note: "dropped 3 font tags" — the cert philosophy at the paste boundary; Word took 20 years to make this default `[SS → ed5]`).

### L1 — Custom renders: one file, many surfaces
Mechanism: mdmax PLAN §5.4 dispatch (render/degrade/refuse), D8, frontmatter-key activation, the 8 degradation rules. Profiles: **kanban** (Obsidian convention `## Lane` + `- [ ]`; flagship plugin dead at 2.6M downloads — release 26.9 months old, org literally named community-archive `[fetched]`; bidirectional drag = one splice move on lezer spans, byte-identical, a thing no PM editor can promise `[→ ed3]`) · **decision** (ADR profile; tooling abandonware) · **calendar** (Markex schema) · **corkboard/outliner** (Scrivener's views as renders over `synopsis:`/`label:`/`status:` keys `[→ ed1]`) · **slides** (Marp-compatible) · **declarative figures** (campaign 5-generator pattern) · **brand book** (guideline-forge) · **project map** (mdmap) · **live site** (publish + profiles) · **flow** (derived-layout only; JSON Canvas sidecar for stored positions).
Compile, de-complexified `[→ ed1]`: Scrivener's three-layer architecture (type→layout→format) with the abstraction cost killed — 3 zero-config profiles, live-preview picker, per-profile front/back matter; **iA Content Blocks transclusion** (published open spec) as the plain-text binder; `role: material` exclusion (Ulysses' honest-stats lesson); block-editor verbs without the block noun: drag-reorder/turn-into/toggles-as-folding/table widgets — every one a splice on syntax-tree spans `[→ ed3]`.
Prerequisites still open: [components.tsx:133](src/modules/preview/presentation/markdown/components.tsx:133) regex fix; delete dead `editable-table.tsx`.

### L2 — The AI protocol
- **Vault MCP server, tools-first** (the 2026-07-28 MCP revision went stateless and deprecated Roots/Sampling/Logging — tools are the lowest common denominator `[fetched → aj1]`): few consolidated verbs (`land`, `search-vault`, `read-slice`, `splice-edit`, `cert-check`), hard-capped under 20, verdict-first responses, actionable refusals. Table stakes as plumbing; **the guarantee is the pitch** — every agent edit lands through splice.
- **The review loop (N5) as the office-suite canon** — §5 below.
- **Byte-anchored provenance** — §9's scoped claim: on every Keep, splice records byte range + `{contributor, model, promptDigest, sessionRef}`; "Show AI ink" toggle renders authorship to ANY reader; three-class map typed/pasted/AI (Grammarly's classes, editor-native `[→ ed4]`); Agent Trace interop (import/export their JSONL); revision-color rendering (Highland's shipped precedent `[→ ed1]`).
- **Implicit telemetry**: accept/reject/partial/edit-distance-after-accept per surface, local-first — mandatory shape because AIOS proved explicit feedback starves (7/688 `[live-verified → i4]`) and rejection is the majority event (~30% acceptance rates `[SS]`).
- **AI surface ranking** (from the complaint corpus `[→ ed4]`): deliberate inline edit > review-moded agent > on-demand chat > ghost text (subtle-mode default: render only while modifier held — Zed's best-in-category pattern) > ambient buttons (never). Propose-first named default (Explore vs Execute); global AI kill switch loudly marketed; per-folder AI exclusions; snooze; checkpoint-per-AI-op with three-way rewind.
- **Citation-gated vault answers** (Advox's fail-closed verifier) · **session continuity** (snapshot/recall) · **routing gate** (23,778 live decisions, 90% floor `[live-verified]` — COGS) · **cert distribution** (npx/MCP/`--skill-generate`/Action) · **mdmax explain --as** (the context-integrity diagnostic no one occupies) · **ACP client, sequenced**: implement when a local surface exists — 40 registered agents incl. Anthropic-coauthored claude-acp; obsidian-agent-client (2,377★) pre-validates "agents inside a markdown knowledge app"; the only shipped multi-vendor session-continuity semantics anywhere `[fetched → aj1]`. A2A: ignore. AG-UI: watch.
- **The rules/voice/memory file family as first-class documents**: `.frontmatter/rules/*.md` with `apply: always|auto|glob|manual` frontmatter (Cursor's modes, minus the .mdc special-UI resentment — rules open as plain markdown `[SS → ed4]`); voice.md + typed entity cards (Jasper/Sudowrite's moat, expressed as files); AI-authored memories only via a visible, editable panel.

### L3 — Markdown-OS features (the AIOS pattern language, productized `[→ i5]`)
Schema profiles (user-definable frontmatter schemas with enums/required/typed-link vocabularies — `knowledge/meta/schema.md` is the prototype; the "portable frontmatter schema" slot the protocol research found open) · append-only blocks · auto-index pages · machine-write zones (fenced regions AI may rewrite, splice-enforced) · token-budget meter ("agent cost" on agent-facing files) · **provenance chips + evidence-tier fields** (`{value, source, tier, re_verify_cmd}` — practiced and gated in production by the campaign system `[measured → i1]`; **no competing editor has an evidence layer**) · doc staleness (drift-watch on the vault, deterministic) · document CI with gate-honesty discipline · user-authorable automations as SKILL.md-anatomy documents (Phase 5; the format IS the product's format; 24,807★ spec `[fetched]`) · sidecar data model · stable §-anchors · version-by-new-file + LATEST pointer · cache-stable rendering.

### L4 — Publishing + GTM-integrated
Post-as-document (one .md → LinkedIn PDF + IG carousel + article + thread + status card; the campaign pipeline is the proof `[measured → i1]`) · scheduled publish draft-and-queue (Markex backend; RULE 2: never unattended) · **AEO linter, honestly framed** (content-quality coaching per Princeton GEO — quotes/stats/citations; the format-serving claim is refuted; linter commandments from the Grammarly/LanguageTool/Vale synthesis: editor-only marks, correctness-tier default + picky opt-in, inline-first never batch, frontmatter keys are the Goals dialog, config-in-repo same-engine-in-CI, auto-quiet rejected categories, batch-accept mechanical `[→ ed1 §5]`) · document quality GATES never Likert scores · verified/freshness keys (`verified: {by, on, until}` — Slite's loop on our rails `[SS → ed5]`).

---

## 5. THE REVIEW LOOP — the N5 spec (40 years of office software, absorbed)

The single deepest extraction of the editor sweep (`ed5`, sourced to the Google Docs API discovery doc + pandoc's docx reader `[fetched]`): suggesting is a **mode** (Edit/Suggest/View dial; suggester role has no byte-writing code path); hunks coalesce at word grain (git's line grain is the wrong resolution for prose); **markup/final/original as pure render projections** (the OnlyOffice save-in-preview-deleted-changes bug is the negative spec) + Simple-Markup gutter bars; role picks the default view (`DEFAULT_FOR_CURRENT_ACCESS` semantics); the adjudication ladder — per hunk / per suggestion / **all-shown-under-filter** (filter by author *including AI agents*) — with accept-and-advance traversal and preview-before-bulk; suggestion cards carry operation sentence + author + time + a reply thread; **resolution is an authored thread event** (`replies.action ∈ {resolve, reopen}`), never a boolean; quote-preserving anchors with **visible orphaning** (Word silently deletes, Docs orphans opaquely — we badge + preserve quote + offer re-anchor); @-mentions + assignment as two fields; frontmatter-key hunks render as property-change chips; accept = splice against baseSha with `Co-authored-by` trailer; staleness marks, never guesses; review-required governance via branch-protection semantics, no document freezes. **The two beats-the-incumbents moves:** programmatic/AI suggestion authorship (Google's public API cannot create suggestions `[fetched]` — ours is a plain sidecar schema any CI or agent can file into) and durable provenance through accept (theirs evaporates). Export/interchange: CriticMarkup + pandoc `--track-changes` spans, both ways.

---

## 6. THE CAPTURE LOOP — chat-to-artifact, specified (`aj2`)

Twelve cross-tool laws (G1–G12) distilled from Claude Artifacts, Canvas/Sites, NotebookLM, Perplexity Pages, v0/Bolt/Lovable (two system prompts read as primary `[fetched]`), Granola/Fireflies. The spec:
- **One verb: `land()`** — `{path?, type, title, body_md, source:{tool,model,conversation_url,session_id}, base_version?, mode: create|patch|rewrite}` → verdict-first `{LANDED|VERSIONED|REFUSED_CONFLICT|NEEDS_TARGET, path, version, url, bytes_written, cert}` with counts re-derived from disk (LR#67 — the anti-lying-report rule).
- **Identity = the path**, explicit in every call (G2: phrasing-inferred identity is claude.ai's #1 documented failure). **Two edit sizes** as protocol modes, not prompt etiquette (G3). **Read-before-patch enforced** via base_version → kills the drift bug structurally (G4: "the file is the memory; the model's memory is a cache to invalidate" — Bolt/v0's own rule `[fetched]`).
- **Creation policy** (G1): explicit "land this" by default (button-grade systems generate zero trigger-confusion literature); agent PROPOSES when Claude's substantial/self-contained/reusable threshold crosses; auto-land only into an inbox lane (Granola's zero-trigger lesson, contained).
- **Typed at capture** (Granola's commercial proof — $1.5B valuation on template-typed capture + per-line provenance `[SS]`): `type: decision|plan|research|meeting|qa|idea|board` picks schema + render + home grouping. Users see the nouns, never "artifact" (G12 — Bolt literally forbids the word `[fetched]`).
- **Provenance block** on every landed doc (source tool/model/deep-link/captured_at) + the doc URL returned INTO the chat so the conversation references the durable thing (v0's Version Box, generalized).
- **HOME.md's "landed today" + needs-review lane** = the discovery surface both giants retrofitted a year late (500M artifacts before Anthropic built the gallery `[SS]`) — file-native from day one.
- **The promotion loop** (G8): landed docs are immediately retrievable, citation-gated context — `draft → active → source-of-truth → superseded` — capture → render → retrieve → the next session starts smarter. This is what makes it a home, not a filing cabinet.
- **The chat-side skill** for MCP-less surfaces: "land this" → typed fenced block → one-paste inbox; retro-capture parses a whole conversation export into *several* typed docs (decisions/plans/Q&A), not one blob.
- **Session interchange:** per-tool import adapters (ChatGPT zip, Claude zip, Claude Code JSONL, ACP streams) landing in **an open, documented, markdown-native session format frontmatter defines and publishes** — no standard exists; the absence is the opening `[fetched → aj1]`.

---

## 7. FORMATS & PROTOCOLS — the posture table

**READ** `[→ aj3]`: OKF bundles (v0.2, now in its own Google repo, 356 adopter repos +24%/27d `[fetched]` — zero parser cost, recognize `sources/generated/verified/status/stale_after`, derive trust tiers) · SKILL.md folders · textbundle (import, low priority) · MyST keys (tolerate).
**EMIT**: **llms.txt v2 + markdown twins + `rel="alternate" type="text/markdown"` link relations** (v2 blessed path-scoping — perfect for multi-tenant; Chrome Lighthouse now audits for it `[fetched]`) · **OKF export** (five keys we already track — mountable by every OKF consumer) · **Skill export** (a curated collection → SKILL.md folder consumable by 41+ agents: "the journey becomes a reusable capability" — the strongest interop story found).
**IGNORE**: Promptfile (dead), langchain-hub (archived), A2A/server-cards as document formats. **WATCH**: .prompty (active, input-side), AG-UI.
**Protocols**: MCP server now (tools-first, official SDK) · ACP client when local surface ships · A2A ignore · **session-interchange format: build and publish ours**.
**The open format territory**: claim/span-level method+confidence — taken by nobody, argued-against-as-scores by OKF; the compatible design is **signals-not-scores, derived at render time** — a renderer's game, ours.

---

## 8. HOW MARKDOWN IS MAXIMIZED (the utilization map)

One substrate, six escalating roles — each already evidenced: (1) **document** (the editor); (2) **rendered surface** (profiles: boards/decisions/calendars/sites — the same file, many views); (3) **schema carrier** (frontmatter-as-API: the product's name is the mechanism — L1 disclosure, renderer switch, lint calibration, goal math, publish instruction); (4) **agent contract** (self-describing files: rules/skills/memories/AGENTS.md-class; budget-bounded always-on context; the differ showing what a file does to a model's context window); (5) **ledger** (append-only blocks, journals, provenance, evidence tiers — history as monotone markdown); (6) **operating system** (the AIOS existence proof: automations, indexes, maps, snapshots — "one file legible to a human eye and an agent's context window at the same time"). The boundaries stand: spatial data → JSON Canvas sidecar; workspace-scale multi-user state → database; tables/nested data to LLMs → not markdown's win `[measured/SS]`. Maximal markdown ≠ markdown for everything; it means **markdown owns the document, the view definition rides in frontmatter, and everything that would pollute the text lives in a sidecar that degrades gracefully when absent.**

---

## 9. ENGINEERING TRUTH — where the fidelity moat stands after hands-on rounds

- **Byte-safety holds on foreign data**: 0 changed / 0 threw across 7,959 foreign frontmatter files (5 vaults, 5 author entities) + 274 skills-src + the 907 home baseline `[measured → h2]`.
- **Coverage does NOT transfer — new engineering, queued as R0**: zero-indent block sequences (`tags:\n- item` — spec-valid, PyYAML's default shape, idiomatic CJK) drive 6,613/6,614 foreign refusals (83% aggregate; 4.7–19.5% on real personal vaults). Recognizing `-` continuations recovers 99.98%. Plus: NF-2 flow-seq closing `]` at column 0; **NF-3 bare-CR fence is set-destructive and oracle-blind** (the shipped BOM bug's sibling — fix + oracle upgrade per LR#68); NF-4 SAFE_KEY too narrow for the wild (`date created` in 812/957 files of one real vault; CJK keys in 905) — addressability needs quoting support, a design task not a regex.
- **Competitor fidelity, measured** `[→ h3/h4]`: OpenKnowledge — agent body-path byte-perfect (respect it), frontmatter permanently drifts, daemon-required, O(document)/edit by their own docblock, comments never committed, GPL+CLA dual-licensing. Hubble — body fully regenerated on any edit (reference links DELETED with their text; round-trip not even a fixed point), properties panel silently deletes valid keys. Front Matter CMS — one title edit deletes comments/anchors/leading-zeros; output differs warm-vs-cold (a one-shot global); the comment-preserving dep sits unused in package.json. **The joint verdict: the failure is architectural (lossy in-memory models), not library choice — bolting preservation on after the fact was tried and shipped broken. The moat is the span-preserving writer + the certificate that proves it.**
- **Provenance claim, scoped for marketing (LR#72-checked)**: NOT "first AI attribution" (Cursor/Grammarly/Agent Trace exist). The defensible first: **byte-anchored, document-portable, reader-visible provenance in a markdown editor**, with Agent Trace interop.

---

## 10. WHAT NOT TO BUILD (consolidated, all evidence-carried)

No new format/sigil/dialect · no plugin marketplace (VS Code's own wiki: extensions = the #1 slowdown; Typora's 251-vote plugin ask vs its loved plugin-free identity — answer demand in-core) · no peer CRDT this cycle (F2) · no tree-of-record ever, even for one feature (`blocksToMarkdownLossy` is the market's confession) · no block IDs in files, no columns-in-markdown, no synced-block bytes · no Likert writing scores · no ambient AI (four-Notion-buttons anti-pattern; users deploy ad-blockers against AI buttons) · no un-disableable AI · no silent auto-land into the curated vault · no heuristic silent artifact creation · no streaks/badges (streak-backfire research; pace-vs-deadline only) · no soundscapes/themes · no format-on-save default · no opaque credit repricing (Cursor's apology, Windsurf's churn, Notion's bundling — each produced documented backlash) · no bespoke canvas as center of gravity · no learning-loop claims before a decision demonstrably bends on real data (Rule #32) · none of the AIOS internal machinery as consumer UI (learned-rules ledger, debate panels, shadow-promote, fable-compiler) · the mother-markdown container, graph-view investment, novelty-for-novelty Max.

---

## 11. PMF — segments, funnels, pricing (now fetch-confirmed)

**Funnels:** (1) **Trust** — devs/prosumers (r/ObsidianMD ≈344K, HN, X): "the markdown source of truth AI can't corrupt" — splice + cert + provenance + review loop; the fresh window validated it twice (Markleft/OzBrain) and the guardrail-demanding minority IS this funnel `[fetched → e7]`. (2) **Beautiful documents** — writers/students (Instagram/TikTok): custom renders in 15-second vertical video; the only Instagram-compatible frame; smaller budget until it earns more. Two funnels, one founder-led workflow channel (the Inkdrop precedent).

**Pricing (primary-confirmed anchors `[fetched → f1]`):** Obsidian Sync $4/$5, Publish $8/$10, Commercial $50/yr, Catalyst $25; iA $49.99/$29.99/$49.99 one-time (conflict resolved); HackMD Prime $5/seat; Craft 15 free / **50 credits/mo paid** (the AI benchmark); Mintlify's free Starter includes the MCP server (AI-legibility given away in-seat — primary confirmation of the no-protocol-buyer verdict). Team band $5–8/seat HOLDS (Confluence $5.42–Slite $8–20 bracket `[SS → e3]`); GitBook's reliability churn = our purchasable differentiator.
**The model:** Free = full editor + unlimited docs on your own repo + offline + splice + BYO-key AI unmetered + fair-use publish + **zero hosted credits**. Pro ~$4–8 = publish extras + live editing + hosted convenience + dollar-metered model-tiered AI **with a visible meter** + AEO linter. Work $50/yr. Teams $5–8/seat later (commenters never bill). Editor-category pricing law from the AI-editor sweep `[→ ed4]`: free-forever editor, dollars-not-credits, BYO-key at every tier, one cheap surface unlimited (on-device small model for checks/ghost — Craft's precedent), never auto-migrate plans. **India:** defer PPP builds; processor-level geo-pricing on the individual tier (~40–60%) + **UPI via the MoR** (availability matters more than the discount) `[SS → e3]`. The protocol buyer doesn't exist yet (`e8`): markdown QA clears at $0; earliest sellable wrapper = a render/agent-compat **CI gate on the Chromatic motion** ($29–99/repo/mo, free for OSS), sold through docs platforms/AEO agencies; never sell the protocol.

---

## 12. DESIGN SYSTEM (the convention layer, `h1` + `e2-home`)

Home: blank+templates row (Docs convention exactly — Blank first, ghost-styled, row hideable) + recents grid, sections reorderable/hideable from v1 (Notion's settled pattern); empty state = the templates row promoted. Editor: three-state Source/Live/Reading toggle upper-right, Cmd+E, default Live; chrome auto-fades on typing; selection bubble + slash menu, no persistent ribbon; right rail default tab = **typed Properties editor (the namesake) + Outline**. AI: Accept/Discard/Try-again tri-action; prompt at the cursor, never the rail; inline diff per hunk (the twice-regressed, twice-demanded grammar — treat the review surface as a breaking-API contract `[→ ed4]`). Kanban: columns ARE frontmatter field values; ship one Draft/Review/Published template board wired to publish state. Publish: two-tab popover (Invite | Publish), one toggle → URL, indexing OFF by default, Unpublish promises exactly what the revocation machinery enforces. Pricing modal: contextual trigger naming the blocked action, two plans max. (Mobbin visual pass: gate-blocked this session, session-scoped — re-run in a fresh session with the ready query set.)

---

## 13. THE ROADMAP — tracks

**R0 — Engine truth (new, from h2; precedes marketing any number):** NF-1 zero-indent sequence support (recovers 99.98% of foreign refusals) → NF-3 bare-CR guard + set-only oracle assertion → NF-2 → NF-4 addressability design (quoted keys) → re-run the foreign-corpus suite as a standing gate. Plus mdmax Tier 3/4 debt (construct detectors gate the AEO linter AND kill-condition 4), CI (`.github/` absent — document CI can't be sold by a repo without any), the suggest-links tier gap, CJK (`countWords` 1.7–2× under; MiniSearch CJK recall 18.1%).
**T0 Trust surface** (Phase 0 restored): sync chip → conflict inbox → named-versions history + since-you-opened banner → auto-sync → local history. Exit: the two-device convergence demo, watched.
**T1 Tenancy + launch**: N1 identity (HQ's pooled-RLS spine + CareerOS entitlements = the lift) → GitHub App → multi-vault → mobile pass → HOME.md → quick capture → beachhead-1 via the "Open in frontmatter" Obsidian plugin.
**T2 Renders**: regex fix + dead-code delete → kanban read-only → kanban bidirectional (zero-dirty oracle) → decision → calendar → corkboard/outliner → compile profiles + Content Blocks binder → publish-with-profiles → mdmap Phase A CLI.
**T3 AI protocol**: MCP server + `land()` → N5 review loop (AI edits arrive as suggestions — one grammar for humans and agents) → provenance + implicit telemetry → differ → cert distribution → citation-gated answers → session continuity → ACP client (with desktop) → session-interchange format published.
**T4 Capture funnel**: chat-side skill + paste-inbox → ChatGPT/Claude ZIP importers (the verification report IS the demo) → promotion loop → retro-capture.
**T5 Content/GTM**: land Markex's tree (RULE-2/3 gated) → LinkedIn probe → post-as-document → the launch calendar run inside frontmatter (3/wk trust + 2/wk IG, floor-tier discipline, MIN_N ≥ 10).
**T6 Scale**: offline-first + WYSIWYG → share roles/comments/suggest (N3/N4) → teams (SSO is the procurement unlock).

**Sequencing law from the window assessment `[→ e4]`:** the generic agent-markdown layer is commodity now; the editor-with-agent-harness category crowds in ~3–6 months at OpenKnowledge's velocity; **cert/fidelity, the review loop, and the git-blog/Obsidian-collab lanes stay open ~6–12 months. The differentiation tracks (R0, T2, T3) must land inside that window.** And the OpenAI structural hedge: if delegate-don't-edit wins, the durable core is the verification/protocol layer (MDMAX) — the roadmap's weight distribution already reflects this.

---

## 14. FOUNDER DECISIONS — open, named, yours

**F1 sgnk-md consolidation** (recommended: frontmatter is the sole codebase; md repo stays as vault data + first customer; ecosystem.md gets the missing frontmatter card). **F2 CRDT contradiction** (recommended: §4b governs — server-authoritative; edit the stale Pillar rows). **F3 Naming — sharpened by primary data:** Front Matter CMS has **80,527 installs** `[fetched]`, same-market senior user since 2019, author openly soliciting collaboration (detente opening); **MDMAX is collision-clean** (npm unregistered `[fetched]`). Options: A (qualifier + distinctive domain + house mark) / **B (flip: MDMAX-class coined mark is the brand, "frontmatter" stays the feature word — legally cleanest)** / C (tripwires: counsel knockout TESS/eSearch/BOIP, detente answered, listings accepted, namespace secured). Evidence argues against the bare unqualified name. **F4** Max contents (depth, never novelty) · export contract · OAuth scope. **F5** the two unrotated PATs. **F6 (new)** the detente email to Elio Struyf. **F7 (new)** two 30-second human clicks: the AGENTS.md/Linux-Foundation announcement; the Otterly experiment (both bot-gated to the end `[→ f1]`).

## 15. KILL CONDITIONS

Kanban write-back fails its zero-dirty oracle → ships read-only. NF-1 support fails the foreign-corpus gate → publish stays refusal-honest, never guess. mdmap Phase A moves nobody → stop. AEO linter uncorrelated with anything measurable on our own corpus → writing aid, rename or drop. Funnel 2 silent after MIN_N ≥ 10 → fold to funnel 1. Review-surface changes → treated as breaking-API changes, always. Any "first/only" claim → one more search round first (LR#72). Explicit-feedback features → never; implicit only.

## 16. THE RESEARCH RECORD

Rounds: internal sweep (7 agents, 1.24M tok) · external gaps (8, 1.06M) · hands-on (4, 646K — foreign vaults executed, competitor writers executed live) · editor landscape (5, 736K) · AI-journey formats (4, 600K) · elevated fetch sweep (main loop; 10 claims → primary). **Remaining verification debt:** the two F7 clicks; Mobbin visual pass (fresh session); Reddit beyond r/ObsidianMD (rate-limited; RSS path proven); Mintlify Pro exact figure (JS-rendered); marksman-vs-us rename benchmark (build-time); the OK WYSIWYG lane live-browser test (source-verdict only today). Everything else load-bearing is `[measured]` or `[fetched]` with its path/URL in the report files.

---

*The through-line, unchanged and now evidenced five ways: every system this studio built already speaks markdown with frontmatter as its API — and every gap the market leaves open (fidelity, review, provenance, capture, the rendered journey) is a gap frontmatter's existing engine was built to close. The product is the place where the private practice becomes everyone's tool.*
