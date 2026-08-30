> **SUPERSEDED — do not build from this file.** It is kept for provenance only.
> The current record is `docs/FRONTMATTER-PRD-v2-2026-08-29.md`. See `docs/MAP.md`.

# frontmatter — Product Plan from End-to-End Pain-Point Research

**Date:** 2026-07-12 · **Starting codebase:** this repo (`md`, branch `stabilize/md-uplift`, deployed at md.sgnk.ai)
**Pitch:** a markdown note app with an Obsidian-grade vault, GitHub + Supabase sync, and Google-Docs-grade simplicity and collaboration — multi-editor, browser-first.

**Research method:** 11 parallel research agents swept Reddit (r/ObsidianMD, r/Notion, r/Evernote, r/OneNote, r/PKMS, r/NoteTaking, r/productivity, r/selfhosted), Hacker News (Algolia API, 3,220+ comments keyword-scored), Product Hunt, Kickstarter/Indiegogo/indie launches, review sites (Trustpilot, G2, Capterra, app stores), GitHub issue trackers of every git-sync tool (obsidian-git, GitJournal, SilverBullet), Google-Docs collaboration threads, and 20 competitors' official pricing pages — plus one agent that mapped this repo's current state. Yield: **92 sourced pain points, 89 feature requests, 20-app competitor matrix**, every claim carrying a verbatim quote + URL.

**Full evidence appendices (read these):**
- [Pain-point taxonomy — 14 ranked themes with quotes](research/frontmatter-pain-taxonomy.md)
- [Competitor gap map — table, whitespace, wedges, head-start inventory](research/frontmatter-competitor-gapmap.md)
- [Raw corpus JSON — all 92 pains / 89 requests with URLs](research/frontmatter-raw-corpus.json)

**Round 2 (2026-07-13, 18 agents: 8 segments + 6 deep drills + 2 market):**
- [Segment strategy — scorecards, beachhead ranking, GTM plays, market numbers, messaging bank](research/frontmatter-segment-strategy.md)
- [Pain playbook — 6 deep drills, 87 acceptance-grade requirements, prior-art autopsies, 8 architecture tension resolutions](research/frontmatter-pain-playbook.md)
- [Round-2 raw corpus JSON](research/frontmatter-r2-raw-corpus.json)

---

## 1. What the market is actually asking for

Not another PKM philosophy. The corpus converges on one boring, unshipped intersection:

> **Files I own + sync I can trust + a browser I already have + collaboration my non-technical collaborators can use + a price that won't betray me.**

The 14 pain themes, ranked by severity × frequency (full detail + quotes in the taxonomy appendix):

| # | Theme | Severity | One-line summary |
|---|-------|----------|------------------|
| 1 | Sync silently destroys data | Kills adoption | Highest-frequency theme everywhere; one silent overwrite ends trust forever (Obsidian Sync, iCloud, OneNote, Simplenote all have loss stories) |
| 2 | Trust collapse / shutdown fear | Kills adoption | Plain-file ownership is now a purchase criterion; Stashpad, Napkin, Dropbox Paper died and users remember |
| 3 | Price backlash / subscription fatigue | Churns at exodus scale | Evernote Trustpilot ~1.3/5 on hikes; Obsidian Sync "$96/yr is nutty"; Notion AI-metering rage |
| 4 | Slow at scale (mobile startup, Electron) | Kills adoption | Obsidian mobile: 1–5 min vault loads = explicit quit threads |
| 5 | Lock-in / lossy export | Kills adoption | Notion export "a nightmare"; 479-pt HN "Notion is withholding my data" |
| 6 | Real-time collab impossible in markdown-land | Kills adoption (teams) | The one thing switchers concede to Google Docs; asked for years, nobody ships it |
| 7 | Offline failures in cloud-first apps | Kills adoption | Notion's 2025 offline excludes the browser entirely; #1 switch driver to Obsidian |
| 8 | Too complex for normal people | Kills mainstream adoption | "Only some developers like markdown, the rest of the world just expect things to work like Word" |
| 9 | No browser access / platform gaps | Kills at evaluation | Obsidian has NO web app; a 63-comment thread begs for exactly what frontmatter is |
| 10 | Git-as-sync fails non-engineers | Churns (severe, niche) | obsidian-git silently overwrites on mobile; conflicts need a terminal; issues open 3+ years |
| 11 | Capture easy, retrieval impossible | Churns | Systems collapse past ~2,000 notes; "unreadable hairball" |
| 12 | Capture friction | Churns | "Not one app lets me open and start writing in less than 500ms" |
| 13 | Markdown/frontmatter mangling | Churns the purist early adopters | Obsidian's properties UI destroys YAML comments/order; plugin exists just to undo it |
| 14 | Publishing/sharing friction | Annoys | Obsidian Publish $8/site/mo called overpriced; free alternatives janky |

**Top 3 whitespace combinations nobody ships** (from the gap map):
1. Real-time collab + plain markdown files + git history (HackMD has collab but no vault/offline; Obsidian has files but zero multiplayer).
2. Obsidian-compatible vault fully editable in the browser, zero self-hosting (SilverBullet needs a server; Obsidian has no web client).
3. Git sync a non-git-user can trust: visible status + in-app conflict UI + never-lose-data merges (obsidian-git issue #803 is literally the spec, unbuilt).

**Positioning wedges, ranked by demand × head start: A > C > B**
- **Wedge A — "Your markdown vault, in any browser."** Nearly sellable from the existing codebase once multi-tenancy lands.
- **Wedge C — "Sync you can see, history you can't lose."** Merge engine done; the visible trust surface is not.
- **Wedge B — "Google Docs for markdown you own."** Biggest long-term moat, biggest remaining build.

---

## 2. Where the repo stands today (head-start inventory)

**Already shipped** (verified by the repo-state agent):
- Next 16 web editor at md.sgnk.ai; CodeMirror 6 with edit / reading / split + Live mode v1 (click-to-edit preview)
- Full Obsidian dialect: wikilinks + alias/#heading, transclusion, callouts, tags, KaTeX, Mermaid, GFM tables, task toggles
- Vault ops: virtualized tree, rename with auto-relink, daily notes, templates, attachments
- MiniSearch + Cmd+K / Cmd+P; force-graph, backlinks, outline
- GitHub repo IS the vault: snapshot zipball + sha cache, atomic Git Data commits, baseSha 409 optimistic concurrency
- Conservative 3-way merge engine (`repository/domain/merge3.ts`, 14 conflict-matrix tests) + non-destructive Merge button
- Git version history/restore endpoints (`/api/vault/history|version|restore`)
- Publish-to-public-URL via `public_slug`; export .md/HTML/PDF/ZIP; IndexedDB draft autosave
- AI: multi-provider gateway, AI race, suggest-links; ~1,168 vitest tests + architecture gates
- PWA manifest + Tauri macOS app

**Missing / half-done (the build list):** background auto-sync engine (B8 second half deferred), any Supabase layer (zero references in src/), multi-tenant signup (single-login allowlist today), multiplayer/CRDT (B4 deferred), comments (C10 deferred), share roles beyond public publish, mobile layout, offline-first behavior, importers, sync-status/conflict UI, browser verification of B15/B16.

---

## 3. Complete product feature list

Legend: ✅ have · 🟡 partial · ⬜ missing. Each feature cites the pain theme (T#) it answers.

### Pillar 1 — The Vault (files you own)

| Status | Feature | Pain |
|---|---|---|
| ✅ | GitHub repo as the vault — plain .md, zero proprietary format, works in Obsidian if frontmatter dies tomorrow | T2, T5 |
| ✅ | Full-vault ZIP export, per-note .md/HTML/PDF export | T5 |
| ✅ | Obsidian dialect parity (wikilinks, transclusion, callouts, tags, KaTeX, Mermaid) | T9 |
| ✅ | Folder tree, rename with auto-relink, daily notes, templates, attachments | — |
| ⬜ | **Round-trip-sacred frontmatter**: property-UI edits never reorder keys, strip YAML comments, or requote untouched values; clean minimal diffs (the app is NAMED frontmatter — this is the credibility signal) | T13 |
| ⬜ | Properties/metadata UI panel (typed fields: date, list, number, link) on top of the sacred round-trip layer | T13 |
| ⬜ | One-click importers: Evernote ENEX (tags+attachments), Notion ZIP (fix UUID filenames + broken links), OneNote, Apple Notes, Google Keep | T5 |
| ⬜ | Multi-vault / repo picker (any repo, any branch, subfolder-as-vault) | T9 |
| ⬜ | Attachment hygiene: paste-image upload, textbundle-style note+assets portability, orphan cleanup | T13 |

### Pillar 2 — Multi-Editor (modes, not compromise)

| Status | Feature | Pain |
|---|---|---|
| ✅ | Source mode (CodeMirror 6), reading mode, split view | T8 |
| 🟡 | Live mode v1 (click-to-edit preview) → harden to true Obsidian-style live preview (current block shows source, rest renders) | T8 |
| ⬜ | **WYSIWYG-by-default mode with markdown fully hidden** — the "my non-technical client can edit without knowing markdown" bar; toolbar, slash menu, markdown as storage only | T8 |
| ✅ | Editable tables in preview | T8 |
| ⬜ | Per-user + per-note editor-mode memory (power users live in source; normals never see it) | T8 |
| ⬜ | Vim keybindings (top dev ask on every Show HN editor launch) | corpus |
| ⬜ | Paste-from-anywhere fidelity: rich text → clean markdown; copy-out preserves markdown | T5 |
| ⬜ | Guided onboarding, sane defaults, zero plugin hunt for a good first-run | T8 |

### Pillar 3 — Sync Engine (the trust product)

| Status | Feature | Pain |
|---|---|---|
| ✅ | Atomic multi-file commits, baseSha 409 detection, 3-way merge engine | T1 |
| 🟡 | Background auto-sync: auto-pull-before-edit, debounced auto-commit/push (B8 second half — currently manual buttons + cron script) | T1, T10 |
| ⬜ | **Always-visible sync-status indicator** — per-file synced/pending/conflicted, last-sync time; the corpus's most concrete trust ask | T1 |
| ⬜ | **In-app conflict UI**: list of conflicting files, per-file mine/theirs/merge, side-by-side merge view — the obsidian-git #803 spec, never a terminal | T10 |
| ⬜ | **Never-lose-data guarantee**: unresolvable conflict → keep BOTH as conflict copies + one-click merge; loud failure states, never silent read-only | T1 |
| ⬜ | Supabase live layer: session state, presence, draft mirror, edit-queue — git stays the durable source of truth | pitch |
| ⬜ | CRDT merge (Yjs/Loro) layered over git commits so two-device offline edits auto-merge at character level | T1, T7 |
| ⬜ | Invisible auth: GitHub App / OAuth device flow — never hand-pasted PATs; clear error surface when a push fails | T10 |
| ⬜ | Commit hygiene: app/plugin state kept out of the sync path; notes-tuned commit messages | T10 |
| ✅→⬜ | Version history: endpoints exist → ship the UI: per-note timeline, who-edited, diff view, one-click restore, **no 30-day cliff** (git = infinite history free) | T1, T5 |

### Pillar 4 — Offline & Performance (the browser moat)

| Status | Feature | Pain |
|---|---|---|
| 🟡 | PWA (manifest + sw.js) → **true offline-first**: full read/write offline, queued sync on reconnect | T7 |
| ⬜ | **Visible cache state** — user can SEE what's available before the flight (Notion's exact failure) | T7 |
| ⬜ | Sub-second cold start on a 10k-note vault (server-side index, lazy loading, sha cache) — treat as a headline metric vs Obsidian mobile's 1–5 min | T4 |
| ⬜ | Mobile-optimized layout (today: desktop three-pane only); Android via browser/PWA first, native later | T9, T4 |
| ✅ | Tauri macOS desktop app | T9 |
| ⬜ | Search that stays fast at 10k notes (move past MiniSearch-in-memory if needed) | T11 |

### Pillar 5 — Collaboration (the Google-Docs parity checklist)

| Status | Feature | Pain |
|---|---|---|
| 🟡 | Public publish via `public_slug` → **share links with roles**: Viewer / Commenter / Editor, "anyone with link" vs restricted, revocable, optional password/expiry | T14, T6 |
| ⬜ | Anonymous no-login access for viewers/commenters (Google's "anonymous animals" pattern) — login walls kill the share-with-a-client flow | T6 |
| ⬜ | **Threaded comments anchored to text ranges**, @mentions, resolve — the single most-cited thing markdown lacks | T6 |
| ⬜ | **Suggest mode (track changes)**: accept/reject proposals; force a collaborator into suggest-only | T6 |
| ⬜ | Real-time presence: live cursors with names/colors, who's-here avatars | T6 |
| ⬜ | **Multiplayer editing (CRDT, Yjs + Supabase Realtime)** on plain .md — git stays source of truth; the unclaimed combination | T6 |
| ⬜ | Who-edited attribution in history (git author mapping per collaborator) | T6 |

### Pillar 6 — Capture & Retrieval

| Status | Feature | Pain |
|---|---|---|
| ⬜ | Zero-decision quick capture: one default inbox note, sub-500ms open, PWA shortcut + share-sheet target, global hotkey on desktop | T12 |
| ⬜ | Web clipper (extension) + email-to-note | T12 |
| ✅ | Cmd+K/Cmd+P, backlinks, graph, outline | T11 |
| ⬜ | AI resurfacing: "you saved this idea 4× — merge?", related-notes panel, dedup — automatic, not manual linking | T11 |
| ⬜ | Server-side embeddings (Supabase pgvector) → semantic search at scale | T11 |
| ✅ | AI gateway (multi-provider) + AI race + suggest-links | T11 |
| ⬜ | **BYO-AI**: user's own Claude/OpenAI key or subscription; MCP server over the vault — with NO enterprise paywall (Notion's exact sin) | T3 |
| ⬜ | Tasks: checkbox aggregation view across vault; recurring tasks later | corpus |

### Pillar 7 — Publishing

| Status | Feature | Pain |
|---|---|---|
| ✅ | One-click note → public URL (public_slug, conflict handling) | T14 |
| ⬜ | Folder/site publish (Obsidian-Publish killer at free/cheap vs their $8/site/mo) | T14 |
| ⬜ | Revocable links, password, expiry, custom slug/domain | T14 |
| ⬜ | Note-to-blog polish: SEO meta, RSS per folder, theme | T14 |

### Pillar 8 — Trust & Business Model

| Status | Feature | Pain |
|---|---|---|
| ⬜ | Multi-tenant signup (GitHub OAuth), user table, repo-picker onboarding — the gate on everything | all |
| ⬜ | **Free git-backed sync forever** (user's own repo = backend; marginal cost ~0) — undercuts every $4–10/mo sync add-on | T3 |
| ⬜ | Paid tier = genuinely costly things only: collab/hosting/AI-server features; simple stable pricing, PPP regional tiers, no rug-pulls | T3 |
| ⬜ | "Your repo is the product; we're just the editor" positioning page + exit-plan doc (structural answer to shutdown fear) | T2 |
| ⬜ | Optional E2EE for Supabase-side data (git side stays user-controlled) — later, don't let it slow sync (Notesnook's sin) | corpus |

---

## 4. Phase-wise plan

Ordering logic: **A > C > B** wedge ranking, but Wedge C's trust surface is cheap and prerequisite to selling A (a browser vault that loses data is worse than none). Phases are sequential shippable products, not sprints.

### Phase 0 — Stabilize + Trust Surface (finish what's started) — *"Sync you can see"*
*Wedge C. Small. All engine work exists; this is UI + wiring.*
1. Browser-verify B15/B16 (Idea-mode + Merge UI) — known deferred verification debt.
2. B8 second half: background auto-pull/auto-push engine (auto-pull-before-edit, debounced auto-commit).
3. Always-visible sync-status indicator (per-file state + last-sync).
4. In-app conflict UI (mine/theirs/merge, side-by-side) on top of merge3.ts.
5. Version-history UI (timeline, diff, restore) over existing endpoints.
6. Frontmatter round-trip sanctity: YAML-preserving property edits + regression tests.
**Exit criteria:** two devices editing the same note offline converge with zero data loss and the user *watched it happen* in the status UI.

### Phase 1 — Multi-tenant launch — *"Your markdown vault, in any browser"* (Wedge A)
*The go-public phase. Biggest single unlock: anyone can sign up.*
1. Supabase foundation: users, vaults, sessions, share-links tables (the missing half of the "GitHub + Supabase" pitch).
2. Signup with GitHub OAuth → GitHub App install (invisible auth, no PATs) → repo picker (create-new or connect-existing; branch + subfolder support).
3. Multi-vault switching.
4. Mobile-responsive layout (single-pane nav, bottom bar) — PWA installable on Android/iOS.
5. Cold-start performance pass: sub-second open on large vaults (headline metric).
6. Guided onboarding + sane defaults; landing page with the ownership positioning.
7. Quick capture v1: inbox note + PWA shortcut + hotkey.
**Exit criteria:** a stranger signs up, connects a repo, edits on phone + laptop, and their Obsidian desktop app sees the same files.

### Phase 2 — Offline + Migration — *"Works on a plane, welcomes refugees"*
1. Offline-first PWA: full read/write offline, queued commits, reconnect sync via merge engine.
2. Visible cache state ("available offline" badges, pin-a-folder).
3. Importers: Notion ZIP (fix links/filenames), Evernote ENEX, OneNote, Google Keep, Apple Notes.
4. Search-at-scale + attachment paste/upload polish.
5. WYSIWYG mode v1 (markdown hidden, toolbar, slash menu) + per-user mode memory.
**Exit criteria:** edit for an hour in airplane mode, land, sync cleanly; a Notion refugee imports 2k pages with working links.

### Phase 3 — Collaboration — *"Google Docs for markdown you own"* (Wedge B)
*The moat. Sequence: sharing → comments → suggest → live multiplayer.*
1. Share links with Viewer/Commenter/Editor roles, revocable, password/expiry; anonymous-animal viewer access.
2. Threaded comments anchored to text ranges (+ @mentions, resolve) — stored Supabase-side, notes stay clean .md.
3. Suggest mode (accept/reject; suggest-only collaborators).
4. Presence (avatars, live cursors) via Supabase Realtime.
5. CRDT multiplayer editing (Yjs) with git checkpointing — collaborators don't need GitHub accounts; owner's repo stays source of truth; who-edited attribution.
6. Publish upgrades: folder/site publish, RSS, custom domain.
**Exit criteria:** a writer shares a link, a non-technical editor suggests changes anonymously from a phone, both type simultaneously, and the git history shows clean attributed commits.

### Phase 4 — Intelligence & Capture — *"Retrieval finally works"*
1. Server-side embeddings (pgvector) → semantic search + related-notes panel.
2. AI resurfacing/dedup ("saved this 4× — merge?"), auto-suggested links.
3. BYO-AI: user keys or subscription; MCP server over the vault; no enterprise paywall.
4. Web clipper extension + email-to-note.
5. Task aggregation view; daily-note calendar view.
**Exit criteria:** a 5k-note vault answers "what did I decide about X?" and the resurfacing panel is retention-positive.

### Phase 5 — Ecosystem & Scale
1. Paid tier launch (collab + hosting + AI-server features; free personal sync forever; PPP pricing).
2. Teams/workspaces (shared vaults, roles, audit).
3. Optional E2EE for Supabase-side data.
4. Plugin/extension API; canvas, Dataview-style queries, Bases-style databases (the deferred XL items — only after demand signals).
5. Native mobile wrappers if PWA hits platform ceilings.

---

## 4b. Round-2 findings that refine the phases (2026-07-13)

**Beachhead ranking (see segment-strategy doc for full scorecards):**
1. **Obsidian power users** — "Obsidian for web" is the forum's most-viewed suggestion (246,568 views / 6 years unanswered); 414,917 Docker pulls of a VNC-streaming workaround; reachable for ~free (thread t/2049, Discord #content-update 193k members, Show HN). Gate feature: **Obsidian round-trip fidelity at 5–20k-note scale** — they judge in the first minute on their own vault; one mangled file = rejection.
2. **Content creators / git-blog publishers** (Hugo/Jekyll/Quartz) — "I'm tired of the git workflow. I yearn for a CMS for my Jekyll" (HN). Gate feature: **mobile-browser draft→publish incl. image paste→compress→commit pipeline**. Distribution: Quartz Discord, Hugo discourse mobile-publish threads, forum Share & showcase.
3. Wave 2 = **developers/docs teams** (the per-seat revenue: HackMD $5/seat, GitBook $113/mo anchors; "would gladly purchase a team sync account for that feature") and **Notion/Evernote refugees** (need WYSIWYG + browser importer with "536 in, 536 out" verification report first). **Writers/editors** wait for suggest mode; **non-tech normals** ignore indefinitely; **students** = free growth loop post-collab. Dendron's PMF failure = the cautionary: solo-dev git-notes don't monetize — teams do.

**Distribution insight:** ship a minimal **"Open in frontmatter" companion Obsidian plugin** — Relay (commercial) distributed exactly this way, 172,544 downloads; framing must be "integrates with your vault", never "Obsidian competitor" (Code of Conduct).

**Pricing refinement:** free = browser vault + git sync ("Free sync. It's just git"); individual paid **$4/mo** (inside the stated $2–4 acceptable band, matches Obsidian Sync Standard); creator convenience tier $3–5/mo **visibly under Obsidian Publish's $8/mo** + a ~$29–39 lifetime option; team seats at HackMD-anchored $5/seat when collab ships.

**Architecture decisions locked by the 8 cross-drill tension resolutions (pain-playbook §Tensions):**
- **No peer CRDT.** Server-authoritative sequencing over the existing merge3 + baseSha engine; session-batched commits with `Co-authored-by`; live layer ephemeral, file remains the document.
- **Single CodeMirror 6 engine** for WYSIWYG (visibility levels + block widgets), NOT a second ProseMirror engine — byte-identical no-edit round-trip (R-FIDELITY) becomes a permanent CI gate.
- **PWA eviction is normal, make it survivable:** repo = durability layer, origin storage = rebuildable cache, unsynced work bounded to an aggressively-flushed outbox; never depend on iOS background execution.
- **Conflicts:** auto-merge non-overlapping hunks silently; on true overlap keep local visible + journal the losing version + non-modal "both versions kept" notice; blocking hunk-picker is opt-in Power mode.
- **Capture = pure append** to an inbox stream (local queue first, merge3 append-append concatenation) — the one write path with guaranteed no-conflict UX.
- **Comments/suggestions live in Supabase sidecar** but with guaranteed materialization (JSON export + optional CriticMarkup into repo); deleting the Supabase layer must leave a valid markdown repo.
- **AI tiered by data class:** vault-content inference local/BYO-key by default; servers do transport/anchoring only.
- **Value-before-auth onboarding:** local-only vault works instantly ("not yet backed up" visible), GitHub connect migrates it as first commits into the USER'S account.

**Phase deltas:** Phase 1 exit criteria gains the fidelity gate (Obsidian desktop sees zero mangled files / noisy diffs after a week of frontmatter edits); Phase 1.5 inserted = creator publish polish (mobile draft→publish + image pipeline) before Phase 2 importers; the 87 numbered requirements in the pain playbook are the batch-plan backlog, each tagged S/M/L + repo module.

## 5. Pricing sketch (anchored to T3 evidence)

- **Free forever:** full editor, unlimited vaults on your own GitHub, sync, version history, export, publish (fair-use), single-user. *Costs us ~nothing; it's their repo.*
- **Pro (~$5/mo, PPP-adjusted):** collaboration (roles/comments/suggest/multiplayer), site publishing with custom domain, server-side AI features, priority sync.
- **Never:** metered AI credits on your own keys, export paywalls, retention cliffs, per-workspace multiplication, surprise migrations.

## 6. Verification notes (RULE 1/5)

- Competitor prices in the gap map marked **verified** were read from official pricing pages by the research agents this session; entries marked ⚠ were JS-blocked or third-party-sourced — re-verify before publishing any comparison page.
- Quote URLs are as returned by the agents; spot-check before external marketing use.
- Frequency claims (upvote/comment counts) are as-scraped 2026-07-12.
