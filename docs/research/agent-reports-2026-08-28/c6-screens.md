## KEY FINDINGS
- COMPLETE INVENTORY DELIVERED: 12 screen-sections (onboarding, HOME.md-home, four-mode editor, 4 custom renders [kanban/decision/calendar/site], review-loop, AI-panel+diff, publish/share, version+local history, doc-health, settings, pricing modal, team dashboard) + a global interaction-grammar summary, each screen in the required 6-part shape (purpose/above-fold/primary-interaction/empty-state/AI-affordance/copy-one+avoid-one).
- TWO FOUNDER-MOCKUP RECONCILIATIONS FLAGGED: (1) editor is FOUR modes not three — Live(default)/Edit(=source)/Split(scroll-synced)/Read; Split is the founder's worthwhile addition over Obsidian's three. (2) The mockup's docked 'AI writing section at the bottom' of the right rail CONTRADICTS the settled convention — the AI PROMPT must summon at the cursor; keep the rail's AI-Edit TAB only as the pending-hunk REVIEW surface.
- DECISION-VIEW FIELD SET IS PRIMARY-CONFIRMED [fetched]: the canonical MADR ADR template stores status/date/decision-makers/consulted/informed in YAML FRONTMATTER (the namesake doing real work); body renders Context->Drivers->Options(cards)->Outcome->Consequences(Good/Bad)->Confirmation. The decision card is a lens over valid CommonMark+YAML — render it, do not dialect it.
- ONE REVIEW GRAMMAR is the unifying interaction law: human suggestions, AI edits, AND sync conflicts all arrive as hunks in the SAME accept/reject surface (Suggest mode dial, gutter bars, per-hunk->per-suggestion->all-under-filter ladder, split before/after a la GitBook Changes tab). Frontmatter's beats-incumbents move: agents can AUTHOR suggestions (Google's API cannot) and provenance survives accept.
- AI PROVENANCE is the owned gap, and two shipped half-measures show the path: Granola renders AI text GRAY vs user BLACK [SS] (legible but not persistent); Cursor/Grammarly keep provenance only in a cloud report. Frontmatter's 'Show AI ink' toggle = byte-anchored, document-portable, reader-visible provenance — the scoped LR#72-checked first.
- VALUE-BEFORE-AUTH is architectural, not a growth hack: frontmatter is local-first, so first-run = Obsidian's zero-account folder-picker ('privacy is the default, not a setting'); auth (Google/GitHub) defers to the first feature that needs it (sync/publish). Avoid the pre-signup personalization carousel for a document tool.
- CROSS-SCREEN EMPTY-STATE DOCTRINE: every empty state is the NEXT ACTION promoted, never an illustration — empty home=templates row, empty board=seeded columns, empty history='starts now', empty diagnostics=GREEN all-clear, empty team='create a teamspace'. The blank page is the documented abandonment killer.
- KEYBOARD/AI GRAMMAR: Cmd+K universal command palette (features that never warranted a button) with #/@/: goto operators; Cmd+E cycles modes; Space summons AI at cursor; Tab accepts/Esc rejects a hunk; shortcuts shown in-palette for discoverability. AI everywhere = at-cursor + propose-first + Accept/Discard/Try-again + killable + BYO-key + metered; ambient buttons never.
- DOC-HEALTH copies VS Code's 4-surface Problems model (status count->filterable panel->inline marks->F8 cycle+quick-fix) and explicitly does NOT copy Grammarly's opaque document SCORE (RULE-4 binary gates only); unreviewed AI edits are themselves a diagnostic category. Version/local-history copies VS Code Timeline (merged saves+commits, compare/restore, section-level) and rejects JetBrains' silent 5-day expiry.
- TEAM DASHBOARD = Notion teamspaces (shared/private sections) + GitBook's Agent-auto-added-as-reviewer + Linear's deliberately LEAN role model (Admin/Member/Guest, no custom roles). Avoid document freezes (use branch-protection review-required) and avoid gating basic dashboards to a top tier the way Notion put Dashboards on Business+.
- VERIFICATION CEILING: Mobbin MCP was gate-blocked again (taint-gate is session-scoped, inherited yesterday's taint; security control untouched). All shipped-app claims are [SS] WebSearch summaries except the [fetched] MADR template; no claim is Mobbin-image-verified. Recovery = re-run in a fresh (untainted) session — the single verification-debt item on this angle.

---

# ANGLE 6 — The Complete Screen / Page / Interaction Inventory (frontmatter)

**Method + evidence tags.** Mobbin MCP was gate-blocked again this session (the `sgnk-taint-gate` is session-scoped and inherited yesterday's taint; I did not touch the security control). Fallback per the task: WebSearch `[SS]` + curl to allowlisted hosts `[fetched]`. Tags: `[fetched]` = primary opened by me this session (curl); `[fetched→report]` = a primary-grade number from a prior report in this repo, attributed not re-fetched; `[SS]` = WebSearch summary this session (page not opened); `[inference]` = my synthesis. Every screen is specified in the required six-part shape: **Purpose · Above the fold · Primary interaction · Empty state · AI affordance · Copy-one / Avoid-one.** This builds on `h1-design-patterns.md` (home/editor/AI/kanban/publish/pricing already grounded) and `e2-home-surface.md` (HOME.md architecture) — it does NOT re-litigate them; it completes the surfaces they left open and reconciles two founder-mockup deltas (below).

**Two reconciliations the founder mockups force (flagged up front):**
1. **Editor modes: four, not three.** The founder toolbar shows **Live / Edit / Split / Read**; h1 recommended a three-state Source/Live/Reading. Four is a superset — Split = source+preview side-by-side. Ship four, default **Live**, `Edit`=raw source. Detailed in §3. `[inference]`
2. **The right rail's "AI writing section at the bottom" contradicts the settled convention.** The founder rail carries Outline/Tags/History/Comment/AI-Edit tabs *plus a docked AI writing box at the bottom*. Every shipped-app convention (Notion, Cursor, the ed4 corpus) puts the AI prompt **at the cursor**, and a rail-docked prompt "reads as bolted-on" `[SS→h1]`. Keep the rail's AI-Edit **tab** (it reviews AI hunks — a review surface, correct), but the *prompt* summons at the selection, not the rail. Detailed in §3 and §6. `[inference]`

---

## SCREEN 1 — Onboarding / First-Run (value-before-auth)

**Purpose.** Get a first-time user editing a real markdown file and *seeing a custom render* before any account exists — because frontmatter is local-first, "value before auth" is not a growth-hack, it is the architecture.

**Above the fold.** A single choice, Obsidian-shaped: **"Create a new vault"** (name + folder picker) or **"Open a folder as vault."** No email field, no OAuth wall. Obsidian's own first-run is exactly this and its help text is the north star: *"No account required. You can use Obsidian for years without ever creating one. Files live on your disk. Privacy is the default, not a setting."* `[SS]` A third tile — **"Try a sample vault"** — drops the user into a seeded HOME.md + one board + one decision doc so the render magic is visible in <10s.

**Primary interaction.** Pick/create a folder → land directly in the editor on a seeded `welcome.md` (which is itself a live-rendered file, not a modal). The "first task is the user's actual job" onboarding law `[SS]`: the welcome file is editable markdown, and editing it *is* the tutorial.

**Empty state.** This screen *is* the empty state of the whole product; do not gate it behind a carousel. Value-before-signup flows "deliver value before signup, use AI to pre-build the workspace, and make the first task the user's actual job" `[SS]`. Auth (GitHub App / Google sign-in per the founder stack) is deferred until the user wants sync/publish — the first moment auth buys something.

**AI affordance.** One optional "seed my vault" prompt on the sample tile: describe what you're working on → AI writes a starter HOME.md + 2-3 typed docs (decision/plan/board) using BYO-key or a bundled on-device small model, so even the AI intro costs zero credits. Keep it skippable; local-first audiences are the most auth-averse and AI-suggestion-averse segment there is `[inference→e2]`.

**Copy-one:** Obsidian's zero-account, folder-as-vault first run — auth deferred to the first feature that needs it `[SS]`. **Avoid-one:** the multi-slide "personalization questionnaire before you can type" pattern; for a document tool it delays the one thing (a blinking cursor in a real file) that proves the product.

---

## SCREEN 2 — Dashboard / Home (HOME.md-as-home)

**Purpose.** Answer exactly two jobs — *resume the last thing* and *start a new thing* — from a surface that is itself a real markdown file (`HOME.md`) rendered with custom-render blocks, so the home doubles as the agent's entry-point document. (Full teardown in `e2-home-surface.md`; this is the screen spec.)

**Above the fold.** Band 1: a **search/command bar** + a **Blank-first create row** (Blank tile first, ghost-styled and visually distinct, then template thumbnails, then "Template gallery" overflow — the Google Docs convention exactly `[SS→h1]`). Band 2: a **recents grid** with real content previews. "Landed today" + a **needs-review lane** sit at the head of recents (the capture-loop discovery surface `[fetched→master plan §6]`).

**Primary interaction.** Click a recent to resume; click Blank/template to create. Sections are **independently hideable and reorderable from v1** — Notion's settled Home pattern, and retrofitting section plumbing later is expensive `[SS→h1]`.

**Empty state.** The templates row *promoted* — no illustration. For a brand-new/empty vault, HOME.md is seeded from a starter template whose content *is* the recents+templates layout, so an empty home is never a bare page (the minute-one abandonment killer) `[inference→e2]`.

**AI affordance.** A single "what do you want to work on?" input that either opens a typed new doc or retrieves an existing one (citation-gated vault answer). AI-*suggested* content on home is strictly opt-in — the local-first audience is feed-averse; Notion's "unremovable Recents/AI suggestions" is the named complaint magnet `[SS→e2]`.

**Copy-one:** Notion Home's reorderable/hideable sections `[SS→h1]`. **Avoid-one:** **displacing work state** — home must never steal the startup slot from "my last file, my cursor position." VS Code's forced Welcome tab produced years of "make it stop" issues `[SS→e2]`; home-on-startup is a setting with an explicit old-tab policy, default = restore-last-session.

---

## SCREEN 3 — The Editor (all four modes: Live / Edit / Split / Read)

**Purpose.** The core surface — a CodeMirror-class markdown editor with a **left project tree**, **tabs**, a **four-state mode toggle upper-right**, and a **right rail** (Properties/Outline/Tags/History/Comment/AI-Edit). One file, four ways to look at it.

**Above the fold.** The text column, centered and dominant. Upper-right: the **Live / Edit / Split / Read** segmented toggle (cycle with `Cmd+E`). Left: collapsible file tree + open tabs. Right: collapsible rail. **No persistent formatting ribbon** — formatting appears as a selection bubble; block insertion via `/` slash menu `[SS→h1]`.

**The four modes, specified `[SS]`/`[inference]`:**
- **Live** (default) — WYSIWYM: formatting renders in place while editing, markup reveals only when the caret enters a span (the Typora→Obsidian Live Preview model). This is the premium default; a binary edit/preview toggle ships 2020's pattern `[SS→h1]`.
- **Edit** (= Source) — raw markdown + syntax highlight, for precision/power users and byte-level work.
- **Split** — source left, rendered right, **scroll-synced by cursor position** (VS Code `Cmd+K V`, IntelliJ, MDHero all sync by default `[SS]`). This is the founder's addition beyond Obsidian's three and is worth it for authors who trust neither pure-source nor pure-live.
- **Read** — fully rendered, no caret, for consumption; custom-render profiles (board/decision/calendar/site) activate here and in Live.

**Primary interaction.** Type. Chrome (tree, tabs, rail) **auto-fades on typing** and returns on mouse-to-edge (iA/Ulysses convention — this is how a busy 3-pane frame stays premium) `[SS→h1]`. `Cmd+E` cycles modes; caret + scroll position are **preserved across every mode switch** (OffsetMap already owns this primitive `[fetched→master plan L0]`).

**Empty state.** A new file shows the filename + a dim "Start writing, or press / for blocks, Space for AI" hint line — not a template wall (templates live on Home). If the file has frontmatter, the rail's **Properties** tab is pre-focused (the namesake).

**AI affordance.** Two triggers, both **at the cursor**: (a) selection bubble → "Edit with AI"; (b) `Space` on an empty block → inline prompt. Output arrives as ghost text (insertions) or inline diff (edits) — never auto-applied. The rail's **AI-Edit tab** is the *review* of pending AI hunks, not where you type the prompt (see reconciliation #2). Detailed in §6.

**Copy-one:** Live Preview as default + `Cmd+E` three/four-state cycle upper-right `[SS→h1]`. **Avoid-one:** a docked rail prompt box as the primary AI entry — it reads bolted-on and competes with the cursor-native flow `[SS→h1]`. Also avoid JetBrains' silent local-history expiry (see §8).

**Right rail tab order (reconciled with the founder mockup):** **Properties** (typed frontmatter editor — default tab, the namesake) → **Outline** → **Comments** → **History** → **Tags** → **AI-Edit** (pending-hunk review). Backlinks is a later tab, not v1 `[inference→h1]`.

---

## SCREEN 4 — Custom-Render Views (one file, many surfaces)

The render is a *lens over the same `.md` file*; switching a view never rewrites bytes it didn't touch. Each view is its own screen-state within the editor's Live/Read modes, activated by a frontmatter key.

### 4a — Kanban / Board
**Purpose.** Render a file (or a folder of files) as a board where **columns are the values of one frontmatter field** (`status: draft → review → published`).
**Above the fold.** Column headers = field values; cards = files, showing title + one status-adjacent field + date (2-3 properties max) `[SS→h1]`.
**Primary interaction.** **Drag a card between columns → rewrites that file's frontmatter field**, byte-identically (one splice move on lezer spans — a thing no ProseMirror/TipTap board can promise) `[fetched→master plan L1]`.
**Empty state.** The three seeded columns (Draft/Review/Published) with one ghost "＋ New card" per column; a one-line "columns are the values of your `status:` field — rename them by editing the field."
**AI affordance.** "Move stale cards" / "summarize this column" as board-level actions; each proposed move lands as a reviewable frontmatter-change chip, not a silent write.
**Copy-one:** Notion's board = grouped DB view, drag rewrites the property `[SS→h1]`. **Avoid-one:** storing card order as hidden block-IDs in the file — spatial/order state that would pollute the text belongs in a JSON sidecar that degrades gracefully `[inference→master plan §8]`.

### 4b — Decision (ADR) view
**Purpose.** Render a decision doc as a scannable **decision card** — the ADR profile — because decisions are the highest-value capture type (`type: decision`).
**Above the fold `[fetched]` (MADR template, `raw.githubusercontent.com/adr/madr`):** a **status chip** driven by frontmatter `status: proposed | accepted | rejected | deprecated | superseded-by`, `date`, and `decision-makers / consulted / informed` — all stored **in YAML frontmatter** (the namesake doing real work). Body renders as **Context/Problem → Decision Drivers → Considered Options (as option cards) → Decision Outcome → Consequences (Good/Bad two-column) → Confirmation.** `[fetched]`
**Primary interaction.** Flip the status chip (proposed→accepted) → rewrites the frontmatter `status` key; superseding a decision writes `superseded-by:` and links the successor.
**Empty state.** A pre-filled ADR skeleton with the six MADR sections as ghost prompts.
**AI affordance.** "Draft the consequences" / "what did we not consider?" — AI fills option cards and Good/Bad columns as suggestions; a decision is exactly the artifact the capture loop promotes `draft→active→source-of-truth→superseded` `[fetched→master plan §6]`.
**Copy-one:** MADR's frontmatter-carried status/decision-makers `[fetched]`. **Avoid-one:** inventing a decision *sigil* — it's valid CommonMark + YAML; render it, don't dialect it `[inference→master plan §7]`.

### 4c — Calendar view
**Purpose.** Render a folder of dated files (`date:` / `publish_on:` frontmatter) on a month/week grid — the content-pipeline surface.
**Above the fold.** Month grid; each file is a card on its date cell showing title + status; a "show calendar by →" picker if multiple date fields exist (Notion's exact affordance) `[SS]`.
**Primary interaction.** **Drag a card to another day → rewrites its `date:` frontmatter**; drag the card edge to span days → writes a date range (Notion calendar drag semantics, frontmatter-native) `[SS]`.
**Empty state.** The current month with a dim "＋" on today and "files with a `date:` field appear here."
**AI affordance.** "Schedule this backlog across next week" → proposes date writes as reviewable chips; ties into scheduled-publish (RULE-2: never unattended) `[inference→master plan L4]`.
**Copy-one:** Notion's drag-to-reschedule + edge-drag-to-span, both writing the date property `[SS]`. **Avoid-one:** a calendar that stores events anywhere but the files' own frontmatter — it breaks the portability/agent-legibility story.

### 4d — Site view (publish render)
**Purpose.** Render the vault (or a subtree) as a browsable **published site** — the "one file → a site" surface.
**Above the fold `[SS]` (Obsidian Publish):** a **left nav of published pages/folders** (current page highlighted), the rendered document, an **auto-generated table of contents from headings**, **hover-preview popovers** on internal links, light/dark toggle, readable-vs-full width toggle.
**Primary interaction.** Toggle which files are published (per-file, visibly), then browse the reader experience; readers navigate the nav tree and hover-preview links.
**Empty state.** "Nothing published yet — publish a file to start your site," with the publish toggle inline.
**AI affordance.** "Generate the site nav / a landing page from these files"; AEO/content-quality coaching (honestly framed, editor-only marks) before publish `[inference→master plan L4]`.
**Copy-one:** Obsidian Publish's nav + auto-TOC + hover previews `[SS]`. **Avoid-one:** search-engine indexing ON by default — indexing defaults OFF, an explicit opt-in (Notion Sites convention) `[SS→h1]`.

---

## SCREEN 5 — Review-Loop / Suggestion Surface

**Purpose.** The place where every proposed change — human suggestion *or* AI edit — is adjudicated on files you own. This is the N5 spec (master plan §5) rendered as a screen. **One grammar for human suggestions, AI edits, and sync conflicts** — they all arrive as hunks here.

**Above the fold.** A **mode dial (Edit / Suggest / View)** — suggesting is a *mode*, not a special AI thing (Google Docs lineage) `[SS]`. In Suggest/review state: the document with **Simple-Markup gutter bars** marking changed regions, and a right-side **suggestions list** — each card carries an **operation sentence + author (human or named agent) + timestamp + a reply thread** `[SS→master plan §5]`. A **before/after split view** is available per the GitBook Changes-tab model (left = before, right = after) `[SS]`.

**Primary interaction.** The **adjudication ladder**: accept/reject **per hunk → per suggestion → all-shown-under-filter** (filter by author, *including AI agents*), with **accept-and-advance** traversal and **preview-before-bulk** `[SS→master plan §5]`. Accept = splice against `baseSha` with a `Co-authored-by` trailer; **resolution is an authored thread event** (`resolve`/`reopen`), never a silent boolean `[fetched→master plan §5]`.

**Empty state.** "No pending suggestions. AI edits and teammate suggestions will land here." plus a filter dropdown that's currently empty.

**AI affordance.** **AI edits are suggestions in this exact surface** — one mental model, one accept/reject UI, one provenance record. Frontmatter's beats-the-incumbents move: **programmatic/agent suggestion authorship** (Google's public API *cannot create* suggestions — ours is a plain sidecar schema any CI or agent files into) `[fetched→master plan §5]`.

**Copy-one:** GitBook's split before/after Changes tab + "Agent auto-added as a reviewer" `[SS]`, and Google Docs' green-mark + right-pane accept(✓)/reject(✗) `[SS]`. **Avoid-one:** Word's **silent orphan-deletion** of a suggestion whose anchor text moved — instead badge the orphan, preserve the quoted anchor, and offer re-anchor `[SS→master plan §5]`; and never let "markup/final/original" be anything but pure render projections (the OnlyOffice save-in-preview-deleted-changes bug is the negative spec) `[fetched→master plan §5]`.

---

## SCREEN 6 — AI Panel + Inline Diff

**Purpose.** The in-editor AI interaction: summon at the cursor, preview as diff, adjudicate per hunk. Two shapes — **inline** (edits/insertions in the document) and an optional **docked chat** (Q&A/retrieval that can *propose* a landed doc).

**Above the fold.** Nothing persistent — the AI surface is summoned. On summon: a **prompt input at the selection** (Cursor `Cmd+K`, Notion inline). On response: **ghost (dimmed) text for pure insertions**; **tinted inline diff for edits** — additions green, removals struck/red, **per-hunk accept/reject** `[SS]`. The three-verb footer is fixed: **Accept / Discard / Try again**, same order, same position, **no auto-apply ever** (Notion AI hard convention) `[SS→h1]`.

**Primary interaction.** Type intent → preview diff → **accept per hunk** (`Tab`/`Cmd+Y`) or reject (`Esc`). The per-hunk control is repeatedly cited as the single highest-impact AI-editor UX feature `[SS]`. **Unified inline diff** for the in-editor edit (compact, additions-heavy) `[SS]`; the dedicated review surface (§5) offers **split before/after** for refactor-shaped changes `[SS]`.

**Empty state.** Before first use: the summon hint ("Space for AI") in the editor; the docked chat (if open) shows "Ask about this vault — answers cite the files they come from."

**AI affordance (this IS the AI screen).** Named **propose-first default (Explore vs Execute)**; a loud, marketed **global AI kill switch**; per-folder AI exclusions; **checkpoint-per-AI-op with three-way rewind** `[fetched→master plan L2]`. The AI-surface ranking from the complaint corpus: *deliberate inline edit > review-moded agent > on-demand chat > ghost text > ambient buttons (never)* `[fetched→master plan L2]`.

**Provenance — the open gap frontmatter owns.** Persistent AI provenance exists *nowhere* today: authorship is legible only pre-acceptance, then AI text becomes indistinguishable `[SS→h1]`. Two shipped half-measures to copy the *legibility* of, then beat on *persistence*: **Granola renders AI text in gray vs user text in black** `[SS]`; **Cursor/Grammarly show provenance only in a cloud report**. Frontmatter's move: on every Keep, splice records the byte range + `{contributor, model, promptDigest, sessionRef}`, and a **"Show AI ink" toggle tints AI-originated spans for any reader** — byte-anchored, document-portable, reader-visible (the scoped, LR#72-checked "first") `[fetched→master plan §9]`.

**Copy-one:** Cursor's `Cmd+K` inline diff with per-hunk accept/reject + Granola's gray-AI/black-human color provenance `[SS]`. **Avoid-one:** ambient AI buttons scattered in the chrome (users deploy ad-blockers against AI buttons; the four-Notion-buttons anti-pattern) `[fetched→master plan §10]`.

---

## SCREEN 7 — Publish / Share Flow

**Purpose.** Turn a file into a URL, and share a file with people — two jobs, one popover.

**Above the fold.** A **two-tab share popover: Invite | Publish** (Notion Sites split people-sharing from web-publishing) `[SS→h1]`. Publish tab: **one primary toggle → public URL**, with a "Show link options" disclosure (allow editing, expiry, **search indexing OFF by default**, duplicate-as-template) `[SS→h1]`.

**Primary interaction.** Flip the toggle → URL appears with a **Copy** affordance immediately. Post-publish is a first-class state: **URL field + Copy + View + Unpublish** all in the same popover `[inference→h1]`.

**Empty state.** Pre-publish: the toggle + "Publish this file to the web" + slug/domain field (dim).

**AI affordance.** "Write the SEO title/description / an og-summary for this page" as an inline option on the Publish tab; the AEO linter's content-quality marks surface before publish, editor-only.

**Copy-one:** Notion's one-toggle publish + progressive disclosure of options `[SS→h1]`. **Avoid-one:** promising more than the revocation machinery enforces — **Unpublish must revoke immediately** and the UI should say exactly that (the repo already carries unpublish-revocation semantics, commit `d50a6b2`) `[fetched→h1]`.

---

## SCREEN 8 — Version History / Local History

**Purpose.** Two timelines, one merged surface: **named versions** (git-grade, shared) and **local history** (per-save, private, the IDE trust feature) — so no keystroke is ever unrecoverably lost.

**Above the fold.** A right-side **chronological list of versions**, each with **timestamp + author + (for AI) the model**, and a **preview-before-restore** pane (Notion's exact restore workflow) `[SS]`. A **"changed since you last opened" banner** at the top (per-user `lastSeenSha`) `[fetched→master plan L0]`. The merged timeline (git + local saves + AI edits) is **filterable by ACTOR/provider**, each entry labeled by who made it `[fetched→master plan L0]`.

**Primary interaction.** Click a version → preview → **Restore** (never restore without preview — Notion's guard against restoring the wrong version) `[SS]`. **Section-level restore**, not just whole-file (VS Code Timeline's right-click Compare-with-Previous / Restore Contents is the interaction model) `[SS]`. Name a version to promote it from the auto-stream.

**Empty state.** "This file's history starts now — every save is captured." (default-on per-save revisions, 10s merge window).

**AI affordance.** AI edits appear as first-class, actor-labeled entries in the same timeline (filter to "AI only" to audit every agent change); "summarize what changed between these two versions" as a per-diff action.

**Copy-one:** VS Code Timeline's merged local-saves + commits in one list with compare/restore `[SS]`, and Notion's preview-before-restore `[SS]`. **Avoid-one:** **silent expiry** — JetBrains' Local History wipes after ~5 days and it is the named anti-pattern; frontmatter's local history has no silent expiry `[fetched→master plan L0]`. Also avoid VS Code's limitation (only tracks edits made *in* the app) — frontmatter watches the file, so external edits are captured too.

---

## SCREEN 9 — Doc-Health / Diagnostics

**Purpose.** A four-surface diagnostics system over the document and vault: broken links/anchors, duplicate headings, staleness, cert warnings, unreviewed AI edits — the VS Code Problems-panel discipline applied to markdown.

**Above the fold `[SS]` (VS Code Problems panel model):** (1) a **status-bar count** (e.g., "3 issues") → (2) a **Problems panel** listing each issue with description + file path + line, **filterable by severity and by source** (link-checker / cert / AI-review) → (3) **inline marks** (colored underlines) at the offending span → (4) **F8-style cycling** through issues with **quick-fix actions** (lightbulb/Code Action) `[SS]`.

**Primary interaction.** Click an issue → jump to the span; invoke the **quick fix** (re-anchor a broken link, dedupe a heading, re-verify a stale claim). Vault-scoped checks ON by default; publish-dependent checks OFF until the file is published `[fetched→master plan L0]`.

**Empty state.** A green "No issues — links resolve, headings unique, nothing stale." — a *positive* zero-state, not a blank panel.

**AI affordance.** Quick fixes can be AI-proposed (re-anchor suggestion, "re-verify this claim" running its `re_verify_cmd`), each landing as a reviewable hunk; **unreviewed AI edits are themselves a diagnostic category** (a health issue you can jump to and adjudicate) `[inference→master plan L0]`.

**Copy-one:** VS Code's severity/source-filtered Problems panel + inline marks + F8 cycling with quick fixes `[SS]`. **Avoid-one:** Grammarly-style **Likert/opaque document *scores*** as the headline — frontmatter uses **binary quality gates** and named issues, never a "your writing is 82/100" number (RULE-4 / master plan §10) `[fetched→master plan §10]`. (Grammarly's four-criteria score sidebar is the thing *not* to copy; its *inline-mark* mechanic is fine `[SS]`.)

---

## SCREEN 10 — Settings

**Purpose.** Configure the app, the AI, sync/publish accounts, and per-vault rules — with settings themselves stored as **versioned files in the vault** where possible (settings-as-markdown, the namesake thesis).

**Above the fold.** A **left settings nav** (tabbed/sectioned) with a **search box** at top (settings search is table stakes at scale) `[SS]`. Sections: **General · Editor · AI · Accounts (sync/publish/auth) · Appearance · Vault rules · Keyboard · About/Plan.**

**Primary interaction.** Navigate section → change a setting → applied live. The **AI section is BYO-key**: provider dropdown (Anthropic / OpenAI / Google), **key input with a Validate button**, and the keys feed the **model picker** — the settled BYOK pattern across Raycast, Cursor, Warp, Dyad `[SS]`. **Never store keys in committed files** (env/keychain only) `[inference]`.

**Empty state.** First-open: AI section shows "Add a key to enable AI (or use the on-device model for free checks)"; Accounts shows "Not signed in — sign in to sync or publish" (Google/GitHub per the founder stack).

**AI affordance.** The **global AI kill switch** lives here (and is surfaced in-editor); per-folder AI exclusions; the **rules/voice/memory file family** (`.frontmatter/rules/*.md` with `apply: always|auto|glob|manual` frontmatter) open as **plain markdown**, not a special .mdc UI (Cursor's `.mdc`-special-UI resentment is the anti-pattern) `[fetched→master plan L2]`.

**Copy-one:** Raycast/Cursor's provider-dropdown + Validate + model-picker BYOK settings `[SS]`, and a searchable tabbed settings nav `[SS]`. **Avoid-one:** a bespoke settings *database* — settings that can be plain versioned files (rules, voice, keyboard map) should be, so they diff, travel, and are agent-legible `[inference→master plan L3]`.

---

## SCREEN 11 — Pricing Modal (Free / Pro / Max)

**Purpose.** Convert at the *exact moment* a user hits a gated action, not from a generic grid.

**Above the fold.** A **contextual top line naming the blocked action** ("Publishing needs Pro" / "Live editing is a Pro feature"), with the **unlocking plan pre-highlighted** `[SS→h1]`. **Two plans max in the modal** (the current tier + the one that unlocks); benefit-worded rows ("Publish unlimited sites," "Dollar-metered AI with a visible meter") not feature-nouns `[SS→h1]`.

**Primary interaction.** One primary CTA on the highlighted plan → checkout. A footer link ("Compare all plans") goes to the full pricing page — the three-tier Free/Pro/Max comparison does **not** get crammed into the modal `[SS→h1]`.

**Empty state.** N/A (transient modal) — but the *non-blocked* path matters: if the action is available on the current plan, no modal ever appears.

**AI affordance.** When the gate is an AI limit, the modal shows the **visible usage meter** and the honest framing — "you've used your hosted AI convenience; add a BYO key to keep going free, or upgrade for hosted." BYO-key-at-every-tier is the editor-category pricing law `[fetched→master plan §11]`.

**Copy-one:** the contextual, action-naming, single-highlighted-plan trigger `[SS→h1]`. **Avoid-one:** **opaque credit repricing / bundling** (Cursor's apology, Notion's 20-lifetime-responses anger, M365's +43% Copilot bundling drew a CMA probe) — the modal must never move the goalposts on credits `[fetched→master plan §2/§10]`.

---

## SCREEN 12 — B2B / Team Dashboard

**Purpose.** A team's shared home: which vaults/spaces exist, who's in them, what's in review, and admin (members/roles/SSO/billing). This is where the review loop and provenance become a *procurement* story.

**Above the fold.** A **teamspace-style sidebar** — "a workspace within a workspace" — with **Shared / Private / Teamspace** sections (Notion's settled model; arrangement is shared but individuals can collapse without affecting others) `[SS]`. Main area: **a review queue** (change requests / pending suggestions across the team's files, the GitBook Changes model) + activity. Admin lives in **Settings → Members**: a filterable member list (role, status: active/pending/suspended) `[SS]`.

**Primary interaction.** Open a teamspace → see its files/board; open a change request → the split before/after review surface (§5). Admins manage members/roles from a **lean role model — Admin / Member / Guest (+ Owner on enterprise)**, explicitly *no custom roles* (Linear's deliberate choice; copy the restraint) `[SS]`.

**Empty state.** "Create your first teamspace" + "Invite your team" — seeded with one shared vault and a sample change request so the review loop is visible before real work exists.

**AI affordance.** **The team agent as a standing reviewer** — GitBook auto-adds its Agent as a reviewer on every change request, checking against existing content and the team's style guide `[SS]`. Frontmatter's version: every agent edit lands as a suggestion with **byte-anchored provenance**, so the team dashboard answers "what did which agent change, and why" — the OzBrain founder's literal sales pitch, and a gap Google/Cursor/Word leave open `[fetched→master plan §2/§5]`.

**Copy-one:** Notion teamspaces (shared/private sections) + GitBook's per-change-request Agent reviewer + Linear's intentionally lean role model `[SS]`. **Avoid-one:** **document freezes / heavy locking** for governance — use branch-protection semantics (review-required) instead; and don't gate *basic* dashboards behind the top tier the way Notion put Dashboards on Business+ (leave "a good team home by default" open at the prosumer/team-of-few tier) `[SS→e2]`.

---

# GLOBAL INTERACTION GRAMMAR

The rule that makes 12 screens feel like one product: **the file is the unit, the render is a lens, and every mutation — human, AI, or sync — flows through one review grammar.**

### Navigation
- **Three-zone frame everywhere:** left = project tree / teamspace sidebar (collapsible, section-based, reorderable); center = the file (in one of four modes, or a custom render); right = contextual rail (Properties/Outline/Comments/History/AI-Edit). Chrome auto-fades on typing. `[SS→h1]`
- **Tabs** for open files; **the file tree is the same object** a board/calendar/site view re-projects — you never "leave" your files to get a board.
- **HOME.md is a destination, not app chrome** — it's a file you can open, edit, and point an agent at.

### Keyboard (the command grammar)
- **`Cmd+K` = command palette** — the universal action surface (Linear/Superhuman/VS Code convention; the "features that could never warrant a button" home) `[SS]`. Goto-anything with composable operators: `#` headings vault-wide, `@` in-doc, `:` line `[fetched→master plan L0]`.
- **`Cmd+E`** cycles editor modes (Edit/Live/Split/Read).
- **`Space` on an empty block** = summon AI at the cursor; **`Tab`** accepts a hunk/ghost, **`Esc`** rejects.
- **`Cmd+Shift+M`-style** opens Doc Health; **`F8`** cycles diagnostics with quick fixes `[SS]`.
- Shortcuts are shown *next to their commands in the palette* so the keyboard is discoverable, not memorized `[SS]`. Keyboard map is a versioned file in the vault.

### How AI is summoned everywhere (one consistent contract)
1. **At the cursor, always** — selection bubble "Edit with AI" or `Space` on an empty block; **never a rail-docked prompt box** as the primary entry (reconciliation #2). `[SS→h1]`
2. **Propose-first** — output is a preview (ghost text or inline diff), **three verbs Accept/Discard/Try-again**, no auto-apply, ever. `[SS→h1]`
3. **Everything AI writes is a suggestion in the one review grammar** — the same accept/reject UI as human suggestions and sync conflicts (§5). One mental model across editor, review surface, board, calendar, and team dashboard.
4. **Provenance persists through accept** — byte-anchored `{contributor, model, promptDigest, sessionRef}`, reader-visible via a "Show AI ink" toggle (Granola's gray-text legibility, made durable and portable). `[SS]`/`[fetched→master plan §9]`
5. **Always killable, always metered, always BYO-key** — a loud global kill switch (Settings + in-editor), per-folder exclusions, a visible usage meter, and BYO-key at every tier. `[fetched→master plan L2/§11]`
6. **Chat is the exception, not the spine** — a docked chat exists for vault Q&A (citation-gated) and can *propose* a landed doc, but the default AI motion is inline, at the cursor, reviewed. Ambient AI buttons: never. `[fetched→master plan §10]`

### The empty-state doctrine (cross-screen)
Every empty state is **the next action promoted, never an illustration**: empty home = the templates row; empty board = the seeded columns; empty history = "your history starts now"; empty diagnostics = a *green* "all clear"; empty team = "create a teamspace." The product is never a blank page with a caption — because the blank page is the documented abandonment killer `[SS→e2]`.

---

## Sources
Primary `[fetched]` this session: MADR ADR template — `raw.githubusercontent.com/adr/madr/main/template/adr-template.md`. `[SS]` (WebSearch, pages not opened): Obsidian Help (Create a vault, Publish), Notion Help (calendars, boards, teamspaces, page history, sharing), Linear Docs (members-roles, workspaces), Cursor Docs (BYOK, inline diff), GitBook Docs (change requests, Agent reviewer), VS Code docs (Timeline, Problems panel), Granola Docs (transcript/gray-text), Grammarly support (score sidebar), Superhuman/Retool/Medium (command palette), matklad/DevUtils (unified-vs-split diff), Raycast/Warp/Dyad (BYOK settings), Appcues/Eleken (onboarding value-before-signup). `[fetched→report]` numbers attributed to prior repo reports `e2-home-surface.md`, `h1-design-patterns.md`, and `docs/FRONTMATTER-MASTER-PLAN-2026-08-28.md` (§5/§6/§9/§10/§11, L0/L1/L2/L3). Mobbin image-verification remains outstanding (gate-blocked both sessions) — the one verification-debt item on this angle.