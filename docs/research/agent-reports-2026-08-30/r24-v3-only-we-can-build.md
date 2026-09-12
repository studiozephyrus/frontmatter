Reconcile discharged — verified five times with an identical result. Pre-existing dirt only in `~/.claude` and `~/.sgnk`; `frontmatter` HEAD unchanged at `484f579`; this subagent performed zero writes, zero commits, and no mutating commands.

---

Cursor's own staff, on 2026-08-28 — three days ago — told a user that doubled blank lines and destroyed carriage returns are "a known issue we're tracking… when the agent does a **full-file rewrite** on files with CRLF line endings," and advised running a formatter to clean it up [fetched, forum.cursor.com/t/169771]; that is not a bug frontmatter fixes better, it is a bug frontmatter's writer cannot express, and it is the only honest frame for this entire round.

**Sources opened this session.** All `curl`; `WebFetch` never attempted. Read-only throughout.

| Source | Retrieved | Status |
|---|---|---|
| forum.cursor.com topics 169771, 161703, 161725, 167967, 158903 + 3 searches | Full post JSON incl. staff replies | [fetched] 200 |
| forum.obsidian.md `/search.json` ×6, topic JSON for 289, 25412, 37534 | Like counts, view counts, dates | [fetched] 200 (two 503s, retried) |
| `obsidianmd/obsidian-releases/community-plugin-stats.json` | **7,092 plugins**, per-version download counts | [fetched] 200 |
| help.obsidian.md `Internal links.md` (Publish API) | Rename semantics | [fetched] 200 |
| aider.chat `unified-diffs.html`, `more/edit-formats.html` | Edit-format benchmark, `whole` vs `diff` vs `udiff` | [fetched] 200 |
| HN Algolia ×13 queries | 2,220 comments | [fetched] 200 |
| GitHub Search API (vscode-copilot-release, obsidian-releases) | 2 and 0 hits | [fetched] 200 |
| reddit.com `/r/ObsidianMD/search.json` | — | **403 Blocked** — [SS] |
| Repo: `table-edit.ts` (190 lines), `splice-frontmatter.ts` (282), `src/modules/ai/**` (325 across 8 files) | Read | [measured] |
| `docs/FRONTMATTER-RECORD.md` §5, §7, §13, §73–77 | Read | [measured] |

---

**THE TEST.** A candidate earns "USP" only by passing all four. Failing Q1 means a regenerating editor ships it too, so it is roadmap, not differentiation. Failing Q2 means it is plumbing.

- **Q1** — does it require every untouched byte to stay identical?
- **Q2** — is the failure it prevents visible inside one session?
- **Q3** — does measurable demand exist, with a number?
- **Q4** — can two founders build it on what is already in the tree?

**The correction this round must carry.** "Reviewable AI edit" is not novel. Cursor ships Agent Review and its staff say plainly, 2026-04-26: *"You can reject individual hunks instead of rejecting everything"* [fetched, t/158903]. Per-hunk review is **table stakes in coding editors and absent in every note editor**. What is defensible is one layer down: **whose diff is it.** When the agent writes the whole file, the per-hunk diff is manufactured *after* the damage — the CRLF doubling in t/169771 and t/161703 survives review because it is spread across every hunk, so rejecting it means rejecting the edit. Aider's docs state the same problem cleanly: its `whole` format returns the entire file, `udiff` exists because GPT-4 Turbo *elided code* under `whole`, and the move to unified diffs took the laziness benchmark from **20% to 61%** with lazy comments dropping from 12 tasks to 4 across 89 refactoring tasks [fetched, aider.chat/docs/unified-diffs.html]. And the tell that everyone else has conceded the point: aider applies hunks with *flexible patching*, and reports **"a 9X increase in editing errors"** when it is disabled [fetched, same page]. Every competitor fuzzes because refusing is expensive. Refusing is the entire product here.

---

**THE CANDIDATE TABLE.**

| # | Candidate | Q1 byte-exact? | Q2 visible in 1 session? | Q3 demand, measured | Q4 cost | Verdict |
|---|---|---|---|---|---|---|
| 1 | **Table editor on the real pipes** | **Yes** | **Yes** | Advanced Tables: **3,153,561** downloads, **922,944** peak-version installs, 5th of **7,092** plugins [fetched/derived]; `table` = **714** issue titles across 43,656, more than `crash` (404) [report 2] | 2 d byte-exact core on top of the 5–8 d Zettlr-parity work [report 1] | **KEEP — rank 1** |
| 2 | **AI edit as writer-owned byte hunks** | **Yes** | Yes | Cursor t/169771 + t/161703 + t/168205, staff-confirmed open 2026-08-28; aider 20%→61% | 6–8 d (needs §76 `BodyAddress` + splice union return + §13 grammar) | **KEEP — rank 2** |
| 3 | **Cross-file heading rename → every wikilink** | **Yes** | **Yes, dramatically** | 3 Obsidian topics at **351 + 227 + 139 = 717 likes / 34,947 views**, ~29 distinct topics **2020-05-22 → 2026-04-03**, still open; Tag Wrangler **397,744** peak installs | 8–12 d (link index exists in `src/modules/graph`; multi-file review is new) | **KEEP — rank 3** |
| 4 | **Frontmatter as a real form** | **Yes** | Weakly | Obsidian's five YAML-rewriting threads total **4 likes** [report 2] — near-zero pull | 3 d (NF-4 unlocks **936 of 942** unaddressable files, §75) | **KEEP — rank 4, obligation not lever** |
| 5 | **Structural section move** | **Yes** | Yes | ATX ancestor path unique in **37,413/37,489 = 99.797%** of headings [§76.2]; Obsidian ships drag-reorder in Outline, so demand is validated | 4 d | **KEEP — rank 5** |
| 6 | **Verified import: "we opened 8,513 files and changed zero bytes"** | **Yes** | It *is* session one | `obsidian-importer` **182,215** peak installs; §74.6 names it the one proof the engine is worth money | 2 d (certify runs at **4.1 ms/file**) | **KEEP — rank 6** |
| 7 | **Degradation notice at paste / free web checker** | No — but only we can compute it | Yes | Paste-mangling threads across Obsidian 2020–2026; a 2026-08-06 Show HN sells exactly this [report 1] | 4 d web checker; 1 d paste line | **KEEP, trimmed — rank 7** |
| 8 | Refusal as a marketed interaction | Property, not feature | Yes, badly | **83%** foreign-vault refusal rate; 6,613/6,614 files refuse on zero-indent sequences [§74.3] | — | **CUT as pitch, KEEP as mechanism** |
| 9 | Byte-level time travel through the splice journal | Yes | **No** | Genuine file-mutation complaints: **4 of 12,556** HN comments = **0.032%** [report 2]; obsidian-git 178,416 peak | 6 d | **CUT from v1** |
| 10 | Two-way render, general case | Yes | Yes | The sharpest HN comment in the corpus says every WYSIWYG markdown tool *"falls apart there"* [report 2, 2026-06-25] | Unbounded | **CUT — replaced by three narrow write-backs** |
| 11 | Trustworthy rich paste | **No** | Yes | Real, and absent from our build | 2–3 d | **CUT from USP, KEEP on floor roadmap** |
| 12 | Format-preserving linter (anti-Linter) | Yes | No | Obsidian Linter **1,036,360** downloads / **112,409** peak | 5 d | **CUT to v2** |
| 13 | Public verdict dataset | n/a | No | Marketing artifact, §73.5 | — | **CUT** |
| 14 | Live certificate in the gutter | n/a | Yes, as noise | **94.25%** of real files carry a BROKEN block [§73.2] | — | **CUT — §73.8 already forbids it** |
| 15 | Badge / per-file score | n/a | — | — | — | **CUT — red-badge generator** |
| 16 | *New:* agent-safe write API (MCP) | Yes | No — developer surface | Cursor staff 2026-08-13: rules are *"guidance level… not a hard runtime block"*, fix is a `preToolUse` deny hook [fetched, t/167967] | 3 d | **KEEP, out of this round's scope** |

Nine of sixteen cut, each with the reason recorded.

---

**RANK 1 — THE TABLE EDITOR THAT EDITS THE PIPES.**

*What it is.* Click a cell, type, and the write is `[byteStart, byteEnd)` of that cell's text and nothing else — column padding, alignment colons, the trailing pipe, the row's line ending, and every other row untouched.

*Why a regenerator cannot.* It parses the table into a model and serialises it back. Ours does exactly that today: `table-edit.ts` builds `rows: string[][]` of **trimmed** cell text with pipes stripped, then re-emits each row through `serializePipeRow`. Report 1 measured the consequence — one cell edit rewrote **3 of 4 lines** and destroyed **3 of 4 carriage returns** on a CRLF file [measured]. A hand-aligned table cannot survive a round trip through a `string[][]`, because the alignment is exactly the information the model discards.

*Who and how often.* Advanced Tables is the **5th most-downloaded of 7,092** community plugins and its peak single version carries **922,944 installs** — **2.68×** every Obsidian AI plugin's peak combined (Copilot 230,154 + Smart Connections 114,022 = 344,176) [derived, community-plugin-stats.json, 2026-08-31]. Tables are also the corpus's silent-defect champion: **714** issue titles versus **404** for `crash`, while drawing only 1 hate-marked HN comment in 279 [report 2]. Nobody complains and everybody breaks them.

*Classification.* Editing a table at all is TABLE STAKES. Editing it **byte-exactly** is DIFFERENTIATOR. The alignment surviving is DELIGHT — the thing a writer notices on day 40 and cannot get back elsewhere.

**RANK 2 — THE AI EDIT AS A WRITER-OWNED BYTE HUNK.**

*What it is.* The model proposes; the proposal is materialised as a `BodyAddress` (§76: `kind` + heading `path` + `ordinal` + `digest` + `contextDigest` + `docVersion`) resolving to one byte range; the UI shows that range; accept splices it; refuse leaves the file bit-identical. Every other range is unreachable by construction — the writer has no API that can touch them.

*Why a regenerator cannot.* Two mechanisms, both evidenced this week. The write path: Cursor's agent uses a `Write` tool that replaces whole files, so a Java refactor stripped JavaDoc the user never asked to remove *and* doubled every line, with Cursor's own reply confirming the class as open [fetched, t/169771, 2026-08-28]. The guard path: Cursor staff, 2026-08-13, on whether rules can protect a file — *"They get injected into the model context as a strong hint, but they are not a hard runtime block. The model can ignore them, so you can't reliably prevent editing via rules"* [fetched, t/167967]. The recommended fix is a deny hook. **A constraint expressed in a prompt is not a constraint.** Ours is in the writer.

*The honest limits.* Per-hunk accept already exists in coding editors, so this is a *reason to switch note editors*, not a novel primitive. And §76.2's own measurement is the ceiling: a task-list line's trimmed text is unique within its file only **67.436%** of the time (2,278/3,378), rising to **75.607%** with one line of context. One AI edit in four aimed at a checkbox will land on `REFUSE AMBIGUOUS`. That is correct behaviour and it is also the honest cost.

*Precedent that this ships and is tolerated.* This harness's own `Edit` tool refuses when the target string is not unique [measured, tool contract, 2026-08-31]. Refusal-on-ambiguity is a solved interaction in coding agents. It has never been offered in a note editor.

**RANK 3 — RENAME A HEADING, FIX EVERY LINK, PROVE NOTHING ELSE MOVED.**

The largest measured demand in the round. `forum.obsidian.md/t/25412` — *"Automatic/inline update of links to headings and blocks when they are modified"* — carries **351 likes, 11,998 views, 80 posts**, tagged `valuable`, opened 2021-10-09. `t/289`, the same ask from 2020-05-22, carries **227 likes / 15,819 views** and its thread ends *"I believe this is still broken."* `t/37534` adds **139 likes**. Roughly **29 distinct topics** span **2020-05-22 → 2026-04-03**, including 2025-06 and 2025-08 bug reports that nested and transclusion links still break. For calibration, report 2 put the most-liked bug in forum history at **501 likes** — this cluster is **717** across three threads. Obsidian's help states only that it updates links *"when you rename a file"* [fetched, Internal links.md, 2026-08-31].

*Why byte-exactness is load-bearing.* A rename touches **N files the user did not open**. A regenerating editor rewrites each of those N files whole, so renaming one heading reformats N documents — the damage is proportional to how well the feature works. Ours writes only the link-text bytes in each file and refuses the files where the target is ambiguous, and the multi-file review reuses §13's hunk grammar unchanged. **Tag Wrangler, whose only job is renaming a tag vault-wide, holds 397,744 peak-version installs** — the appetite for a vault-wide refactor is already priced.

**RANKS 4–7, briefly.** *Frontmatter as a form* is an obligation, not a lever: NF-4 unlocks **936 of 942** unaddressable files (§75) and we cannot ship a product called frontmatter that mangles frontmatter — but Obsidian's five YAML-rewriting threads total **4 likes**, so nobody will switch for it. *Section move* is cheap and safe at **99.797%** path uniqueness. *Verified import* is the sales artifact §74.6 already identified; it needs NF-1 and NF-3 first, because at today's **83%** refusal rate the report reads as a rejection letter. *Degradation notice* stays as a one-line paste hint plus a no-account web checker; §73 has already argued down everything larger.

---

**THE ONES THAT ARE LOVELY AND IRRELEVANT.** Byte-level time travel is the most beautiful thing on the list and the most commercially inert: the journal knows the byte range *and the intent* of every write, so "undo the AI's third edit from Tuesday and keep the four I accepted" is a query git cannot express — and the measured demand is **4 comments in 12,556 (0.032%)**. Build the journal because `baseDigest` needs it; do not build the scrubber. General two-way WYSIWYG is where every competitor dies and where our guarantee would be most impressive; it is also unbounded, and three narrow write-backs (table cell, checkbox — a **one-code-unit** splice at `TaskMarker.from + 1`, §76.3 — and kanban drag) deliver the visible 90% for a tenth of the work. The public dataset, the badge and the live gutter certificate are marketing dressed as engineering, and §73.8 already refuses them.

**REFUSAL — BOTH SIDES, SETTLED.** *For:* it is the only surface on which byte-preservation is observable at all (§74.1); Cursor's staff independently arrived at the same architecture; the interaction already ships in coding agents. *Against:* it fires at **83%** on foreign vaults, meaning a prospect who points us at ten folders meets it in **8.3** of them; a refusal has no bypass by construction, so at that frequency it is not a warning, it is an outage. **Verdict: refusal is the mechanism and never the pitch.** It appears in the demo exactly once, as a two-second aside, and only after the audience has already seen the thing work.

---

**THE ONE FEATURE IN THE FIRST DEMO: the table cell.**

Open a note with a hand-aligned GFM table, CRLF endings, columns padded to width. Change one cell. Show `git diff --word-diff`: **one line, six bytes**. Do the identical edit in the incumbent beside it: four lines changed, padding collapsed, carriage returns gone. Then one sentence — *"same writer, and it is the only writer; when the model proposes an edit it gets this path and no other"* — and toggle a checkbox to show the one-byte splice.

It wins on all three demo criteria. The audience **already owns the failure** — 922,944 peak installs of Advanced Tables and 714 issue titles say the room has hit it. It takes **under ten seconds** and fits on one screen, which heading-rename (eleven files) and the import report (minutes) do not. And the contrast is visible **without any explanation of markdown internals**: a diff pane that goes from four red lines to one is self-evident to anyone who has reviewed a pull request.

It has one property no other candidate has: **it is currently a shipped defect in our own tree.** `/Users/sagnikmitra/Desktop/GitHub/frontmatter/src/modules/preview/presentation/table-edit.ts` regenerates. Building the demo and fixing the product are the same two days of work, and until they are done, the sentence "we never regenerate" is false in the file a visitor is most likely to touch.
