# HANDOFF — frontmatter: the decision set, the 9-seam research, and the documentation substrate

**Written 2026-09-09.** This is the **second and complete** version. It supersedes the first
draft of this same filename, which was written at a session limit with 5 of 15 areas finished
and over a **failing** documentation gate. Everything it said is either carried forward here or
corrected here. Do not go looking for the earlier text; git has it at `0788653` if you want it.

Sits alongside `HANDOFF-mdmax-cert-and-audit-2026-08-03.md` and
`HANDOFF-graph-engineering-research-2026-07-30.md`, which cover different subjects and remain
valid on their own.

---

## 0. Severity verdict — read before anything else

**State: STABLE.** Working tree clean, `npm run verify` green (typecheck, lint, 1,596 tests
passing with 6 expected failures, arch 0), documentation gate **PASS at exit 0**, and the live
site serves the committed bytes. Nothing is half-written.

**Blast radius if you get it wrong.** Contained. The only live surface is a static Vercel
deployment holding no user data — answers live in each reader's `localStorage` and never reach
a server. No database, no auth, no billing on that surface. The Next.js app was touched in
exactly one commit (`3f230d2`, a proxy fix), and that commit is covered by ten new tests.

**The single most dangerous misconception a skim would produce:** *"the product is nearly
built."* It is not. **Review state — the headline feature — does not exist in the code.** A grep
for `review.jsonl`, `reviewState` or `reviewedAt` across 226 source files returns **zero**. Two
files outside `src/modules/mdmax` import the engine and both are read paths, so **no write in
the product goes through the splice engine** that is its entire differentiation. See §5.1.

**Second most dangerous:** the research in `docs/research/2026-09-09/` is reliable *in
substance* and **unreliable in its quotation marks**. Roughly one quote in three is a paraphrase
wearing quotation marks, and one was fabricated outright. Never paste one anywhere without
re-fetching the page. §4.5 is the calibration table.

---

## Read these first

The documentation gate passes as of `9e4d5cf`, so the doc set is now trustworthy — that was not
true when the first draft of this handover was written.

1. **`docs/README.md`** — the index, with the provenance table and the honest "not done in this
   pass" list.
2. **`docs/00-EXECUTIVE-SUMMARY.md`** — what this is and what state it is really in.
3. **`docs/13-TECH-DEBT.md`** — what is owed, sequenced, every item re-verified at `e318ab3`
   with the command shown beside it. **Read this before believing any schedule.**
4. **`docs/PRODUCT-BRIEF.md`** — the plan, v15, 560 lines, safe to read whole. §14 lists the
   seven open founder decisions.
5. **`docs/research/2026-09-09/BRIEFING.md`** then **`VERIFIED-2026-09-09.md`** — the latter
   **overrides** the former wherever they disagree.
6. **`decisions/v2/CONTRACT.md`** — the decision-card spec.

**Never open with Read:** `FRONTMATTER-PRD-v2-2026-08-29.md` (760 KB),
`FRONTMATTER-RECORD.md` (2.1 MB), `FRONTMATTER-COMPLETE-RECORD-2026-08-30.md` (3.4 MB),
`ENGINE.md` / `CRITIQUE.md` / `DEV-PLAN.md` (~250 KB each). `grep -n` then `sed -n 'A,Bp'`.

---

## 1. Chronological walk

### 1.1 Finishing the previous UI work

Picked up mid-task on the decisions site. Screenshotted and read the result rather than assuming
it. Then drove the **live deployment** rather than the local file, which is what surfaced
everything. Three real defects:

- **The phone action bar was dead.** Every handler wired — position label, disabled states,
  prev/next, updated in all three views — and it never appeared. `.abar{display:none}` was
  declared *below* the `@media(max-width:900px)` block that set `display:grid`. Same
  specificity, so source order won and the override was dead code.
- **Area deep links** (`#area-<name>`) fell through to the overview; the boot handler only knew
  questions, `import` and `overview`. Fixed with one shared `fromHash()` resolver.
- **An imported question was unreachable.** The markdown import parsed, previewed and added a
  card, but set `view.cat` to the literal `"Imported"` while `renderNav` only expands the group
  whose `cat` matches. The card rendered with no way back to it.

A fourth apparent defect — a missing primary action — was **my selector reading an unanswered
question**. Behaviour is correct: *Skip for now* before a choice, *Next decision* after. Said so
rather than "fixing" it.

`scripts/css-cascade-check.py` generalises the first: it walks a stylesheet and reports any
declaration inside a media query that a later base rule overrides. **It reports the bug against
the pre-fix file and comes back clean against the fixed one**, and finds exactly one instance.

Commits `9e207ec`, `c824ada`.

### 1.2 The ask

Verbatim, the parts that shaped everything:

> "go throughout the complete plan of frontmatter again … and then add more questions which are
> not added"

> "every questions that is added, everything should be more screen diagram or flow daigram or
> visually and mockup created wise explained proeprly, and there syhouldn't be paragraphs rather
> more shorter and bulleted texts"

> "make the questions human and not ai jargon"

> "if questions can be clubbed or co-connected, then combined them"

> "why a certain option is recommened , in detailed"

> "before doing anything, if you think any segment of this document editing, markdown market and
> editing , note tak9ng market, you hadn't tapped, go aehad and reserach tyhat"

> "once the answer is done, then generate the complete product plan based on the answers … the
> complkete SRS and PRD BRD FRD"

**The SRS/PRD/BRD/FRD step is gated on the founder answering the decisions. It is not started
and must not be started before that.** See §7.

### 1.3 Finding the untapped seams evidentially

Rather than guessing, scanned the corpus. A 138-product list against 1.24M words of `docs/`:
**104 mentioned, 34 never named**. Then 35 concepts scanned; **nine under twelve mentions**,
four of them directly under the product's own claim — prose diff (11), diff granularity (4),
git-for-writers UX (2), review fatigue (8), and market size (1).

### 1.4 The research, and a cost mistake

Ten lenses, all completed: **310 findings, 308 from opened primary sources, 63 candidate
decisions**. Raw at `docs/research/2026-09-09/research-raw.txt` (278 KB).

Then the verify stage fanned out **one skeptic agent per claim — about 150 at ~100k tokens
each**. The user stopped it:

> "Do we really need this many tests? Just check and update, because my tokens will be
> exhausted, man."

Correct, and it cost a session limit. Killed via `TaskStop`. **Carry this forward: verify a
handful of load-bearing claims yourself with `curl`. That is what found the fabrication, for
almost nothing.**

### 1.5 What I verified by hand

Full detail in `docs/research/2026-09-09/VERIFIED-2026-09-09.md`.

**A research agent fabricated documentation quotes.** It claimed VS Code's review docs say
*"The reviewed state clears if you or the agent changes the file again."* I opened the live page
(9,516 characters, footer 9/2/2026): **zero** occurrences of "as reviewed", "reviewed state",
"clears if", "markdown", "locked mode" or "attribution".

**The GitHub evidence in the same report is real** — I checked all three via `api.github.com`:

| Item | Title | Milestone | Dates |
|---|---|---|---|
| PR #324218 | "Agents - add review/unreview operation to the multi-file diff editor" | 1.128.0 | 2026-07-03 |
| #326539 | "Test: Markdown editor feedback in the Agents window" | 1.130.0 | 2026-07-19 → 20 |
| #326540 | "Test: View and edit Markdown in the Agents window" | 1.130.0 | 2026-07-19 → 20 |

**Honest statement:** Microsoft built review/unreview and markdown agent feedback, gated behind
`workbench.editor.markdownDefaultEditorInAgentsWindow`, in an experimental Agents window, and
documented none of it. Intent, not a shipped free competitor.

**Closed the researcher's own biggest flagged hole: Cursor.** It was blocked by Cloudflare; I
opened `cursor.com/learn/reviewing-testing` (11,414 chars). Cursor's review is **Agent Review**
plus **Bugbot** on PRs. Searched for "mark as reviewed", "viewed", "markdown", "attribution",
"per-span", "unreviewed" — **all zero**. Cursor's answer to too much agent output is *another
agent reviews it*: a different product, leaving the human-facing ledger unoccupied by the
most-cited comparison in the space. `cursor.com/review` is behind a sign-in wall; I did not sign
in.

### 1.6 The card shape and the diagram vocabulary

Built **before** any generation, so fifteen agents could not invent fifteen shapes.

`decisions/diagram.js` — **ten primitives** as inline SVG: `screen`, `flow`, `state`, `compare`,
`ba`, `arch`, `timeline`, `matrix`, `file`, `funnel`. Geometry computed from the text each box
holds, so a longer label resizes rather than collides. Colours are CSS variables, so diagrams
follow the page into dark mode. Inline, because these pages must render with no network.

Two geometry bugs found by rendering all ten with real content: state transition labels drawn
into a 30px gap that needed ~60 (every one landed on the pill beside it), and a screen pane's
last row flush against the card edge.

Card shape: diagram first, one-line `stakes`, bulleted `state`/`path`/`tension` replacing three
paragraphs, per-option `gains`/`costs`/`system`/`screens`/`money`, `flip` (the finding that
would overturn the recommendation), and `linked` chips. Commit `ae40093`.

### 1.7 Generation — two runs

First run: **session limit killed 15 of 16 agents.** Five areas survived, rescued from scratch
before it was lost. Commit `e6f6c8a`.

**Important lesson: agents wrote their files before dying.** The workflow reported 1 success;
**five complete area files were on disk.** Always check the output directory before believing a
failure count.

Second run, after the limit reset: **11/11 agents, zero errors**, including the cross-area
linker that had died. 261 cards, all fifteen areas. Commit `e318ab3`.

### 1.8 Cross-area deduplication

The linker read all 261 cards and found **43 duplicate sets covering 103 cards**. Dropping 60
left **201**. The worst: *"does the splice engine ship free as an npm package"* was asked
**five separate times** across five areas. Market & competition lost 12 of 24 and Plan lost 8 of
14 — both were largely re-asking decisions owned elsewhere. Engine lost 1 of 28, which is what
you expect from an area that owns mechanisms rather than commentary.

### 1.9 The documentation gate — the part I got wrong first

The handover skill's STEP 0 gate returned **exit 1**. I proceeded under a named exception and
wrote the first handover anyway. The user corrected that:

> "we recently made changes to the handover skill to generated detailed skills and documentation
> … so yeahd check and verify and generate the detailed one if not already done"

They were right and the exception was the wrong call: **a handover written over a failing gate
reads as authoritative and the receiver has no way to tell.** So:

- **`CLAUDE.md` written.** This repo had none. Claude Code reads `CLAUDE.md` and **not**
  `AGENTS.md`, so every instruction in its 221-line `AGENTS.md` was invisible in every session
  until now. 124 lines, imports `AGENTS.md`.
- **Sixteen core documents generated** by nine agents on disjoint files, each required to read
  code before writing, plus `13-TECH-DEBT.md` and `docs/README.md` written by hand.
- **Gate now: PASS, exit 0, STATUS current.**

### 1.10 What the documentation pass found — real defects, three of them mine

The doc agents read `src/` rather than trusting it, and returned defects, not prose. The ones
that mattered:

- **`npm run verify` was RED at `e318ab3`** — 71 lint errors, **50 in files I had added** under
  `decisions/`. AGENTS.md §4 makes green lint a precondition of commit. I had broken a rule the
  repo states plainly.
- **Every asset under `/decisions/` and `/prototype/` 307'd to `/login`.** `PUBLIC_STATIC_RE`
  matches a single top-level segment with one of fourteen extensions; neither `.css` nor `.html`
  is in the list, and every asset there is a nested path. The bare `/decisions` passed only by
  accident, because it looks like a published note slug. **This is the exact recurring failure
  AGENTS.md §1 documents, committed by the change that added those directories.**
- **`decisions` and `prototype` were not in `RESERVED_SLUGS`**, so a user could publish a note
  at `/decisions` and shadow the directory.
- **`test/proxy.test.ts` tested only top-level assets**, never a nested one — which is why
  nothing caught it.

All fixed in `3f230d2`, with ten new tests **red-proofed** per AGENTS.md rule 1: stashed the
fix, ran them, watched all ten fail, restored.

---

## 2. Live numbers, gathered at write time

```
HEAD            3f230d2  fix: every asset under /decisions and /prototype was redirecting…
branch          engine/plan-and-diagnostics    8 commits ahead of origin, UNPUSHED
working tree    clean
stashes         none
worktrees       2 under .claude/worktrees/, both 0 unique commits vs the branch
docs gate       PASS (exit 0), STATUS current
npm run verify  typecheck OK · lint OK · 1,596 passed + 6 expected fail · arch 0
```

| Measure | Value |
|---|---|
| Decision cards | **201** (from 319: merged within areas, then 60 cross-area duplicates dropped) |
| Cards with a diagram | **201 — all of them** |
| Cards linked to at least one other | 197 of 201 |
| Critical / high / medium | 56 / 104 / 41 |
| Evidence exhibits | 422 |
| Diagram kinds in use | compare 76, flow 31, ba 19, screen 16, arch 14, timeline 12, file 11, funnel 10, state 8, matrix 4 |
| Core documents | 16, all pinned to `e318ab3` |
| Research | 304 KB, committed |

Cards by area: Engine 27 · Features 21 · Design/UI 17 · Legal 16 · Pricing 16 · Go-to-market 16
· Access 12 · Market 12 · Form factor 11 · Flow 11 · Business 10 · Product & definition 9 ·
Name 8 · Research & evidence 8 · Plan 7.

**Live: https://frontmatter-decisions-sagnik.vercel.app** — verified by driving it, not by
assuming: 201 cards, all v2 shape, diagram renders, stakes band, bulleted context, gains/costs,
option meta, flip line, linked chips, `scrollWidth == innerWidth`.

---

## 3. Phase status — do not round up

| Phase | Status | Evidence |
|---|---|---|
| Fix the decisions UI end to end | **DONE, verified live** | 3 defects fixed; 23/24 live checks pass, the 1 fail was my own selector |
| Research the untapped seams | **DONE** | 10/10 lenses, 310 findings, 308 opened |
| Verify the research | **PARTIAL — 6 claims by hand** | Found 1 fabrication; the 150-agent fan-out was killed on cost |
| Card shape + diagram vocabulary | **DONE** | 10 primitives, all rendered with real content |
| Contract, validator, assembler | **DONE** | `decisions/v2/CONTRACT.md`, `decisions/tools/` |
| Rewrite all 15 areas | **DONE** | 201 cards, every one with a diagram, validator 0 errors |
| Cross-area dedup and linking | **DONE** | 43 duplicate sets, 60 dropped, 197/201 linked |
| Add the 63 research-derived questions | **PARTIAL** | Areas added their own; the briefing's list was never reconciled 1:1. §7 item 1 |
| Documentation substrate | **DONE, gate green** | 16 docs + CLAUDE.md, exit 0 |
| Answer the decisions | **NOT STARTED — the founder does this** | |
| SRS / PRD / BRD / FRD | **NOT STARTED — gated on answers** | |

---

## 4. Research findings that change the plan

Tagged as the raw file tags them. `[opened]` = a page was actually fetched.

### 4.1 Almanac — the corpse behind the headline
Shipped frontmatter's entire feature sentence — **Read Receipts** ("Ensure your team actually
reads important knowledge"), Version Control Mode, Layers, Approvals, Doc History diffing,
scheduled deprecation reviews — still on `get.almanac.io` `[opened]`. **$9M seed + $34M Series A
led by Tiger Global, Sept 2021. 7-figure ARR. 50+ staff. Shut down 2025-01-31.** `[opened]`
Not out-competed: the same team's AI content product grew to "tens of thousands of users in a
matter of months" and they chose it. **The corpus never named Almanac once in 1.24M words.**

### 4.2 The attention literature is hostile to the design
Cisco/SmartBear: no review above 250 lines beat 37 defects/kLOC `[opened]`. Google: 3.2 h/week
review budget, 24-line median change `[opened]`. Clinical alerting: **override rates 55–98%
across 34 studies** `[opened]`; 86.6% override of 14,612 alerts with 88.3% of justifications
meaningless `[opened]`. The one system that achieved acceptance fired **31 rules in 0.19% of
500,274 sessions** for 57.5% `[opened]`. **Forces suppression, not enumeration. A
percentage-of-repo unreviewed badge is the worst-evidenced element in the plan.**

### 4.3 Zed Delta, and the CRDT problem
Private beta 2026-08-12, DeltaDB, comments anchored to spans that survive edits. 679 HN points
on launch `[opened]`. The 2026-09-01 post commits to attribution "down to the span" and stakes
it on **CRDTs** `[opened]`. The corpus treats "never a CRDT" as settled; it may still be right
for prose, but it **can no longer be stated as settled without a written rebuttal naming Zed**.
The Engine area added card E35 for exactly this.

### 4.4 Other findings worth knowing
- **Draftable** sells prose diff alone — no editor, no collaboration — at **$129 and
  $261/user/year into 1,300 law firms**, still Windows-only `[opened]`.
- **The graveyard.** Editorially (2014, *"Even if all of our users paid up, it wouldn't be
  enough"*), Poetica (→ Condé Nast 2016, software bought, users explicitly not), Penflip (silent
  death, SEO spam), Draft (503 since April 2023, zero HN comments). **Two of eight died with
  nobody noticing.** Absorption is the modal outcome: four of eight bought as teams by
  organisations that already owned a publishing pipeline.
- **`petergyang/human-review`**: 0 → **1,241 stars in six weeks**, free, runs inside Claude Code
  `[opened]`. **501 GitHub repos** match "agent diff review" created since 2026-05-01 `[opened]`.
- **Bike** documents publicly that `.txt` cannot hold stable item ids and row links break on
  close-and-reopen — **our SAFE_KEY problem, in production, admitted by a developer who then
  chose HTML** `[opened]`.
- **The one claim still unoccupied:** attribution of *which spans an agent wrote*. No platform
  shipped it; the only implementation anywhere is a VS Code extension with **88 installs**. The
  corpus demoted this on the iA Writer comparison — **that demotion is reopened**, and Features
  promoted F3 back to critical.

### 4.5 Calibration — trust the substance, not the quotation marks

| Quote | Source | Result |
|---|---|---|
| "diff panel that opens beside the conversation" | Claude Code CHANGELOG | **found verbatim** |
| "comments attach to snapshots" | zed.dev/blog/introducing-delta | **found verbatim** |
| "Agent Edits" / "Uncommitted" | antigravity.google | **found**, both |
| "Every edit and conversation is captured between your commits" | zed.dev | **not on the page** |
| "…your UI gets out of sync with your working directory" | antigravity.google | **not on the page** |
| "The reviewed state clears if you or the agent changes the file again" | VS Code docs | **not on the page, capability undocumented there** |

---

## 5. The sweep

### 5.1 Defects found this session that are NOT documentation gaps

These came out of the doc pass reading real code. **Unfixed unless marked.** Full list in the
workflow output; these are the ones that change decisions:

| Defect | Evidence |
|---|---|
| **Review state does not exist** | `grep -rlE "review\.jsonl\|reviewState\|reviewedAt" src` → **0** of 226 files |
| **The engine is unwired** | Only 2 files outside `src/modules/mdmax` import it, both read paths — no product write uses the splice engine |
| **§9 says zero Firestore writes; there is one** | `src/modules/app-shell/presentation/KnowledgeUI.tsx`, and it sits in `presentation`, which the layer rule forbids |
| **`GITHUB_REPO` defaults to `sagnikmitra/md`** | `src/config/env.ts:86` — the *sibling* product's vault. A deployment omitting the variable reads and writes the wrong repo |
| **No CI at all** | `.github/workflows` does not exist; six gates run only when a human remembers |
| **`npm run budget` is an echo** | Exits 0, measures nothing |
| **`mdmax cert` has never run** | `ERR_MODULE_NOT_FOUND` on an extensionless ESM import; `cert` is in none of the 26 scripts |
| **`entities` undeclared** | Imported at `src/modules/mdmax/domain/{fold,verdict}.ts`, absent from `package.json`, resolves only from hoisted `node_modules` |
| **Tauri still ships as the sibling** | `src-tauri/tauri.conf.json` → `identifier: "ai.sgnk.md"` |
| **No BYO-key surface** | `grep -rl "apiKey" --include="*.tsx" src` → 0 |
| **No migration for any `sgnk-md-` key** | Renaming the IndexedDB store orphans every uncommitted draft with no recovery path |
| **`firestore.rules` calls itself a PROTOTYPE** | Lines 7–9: "not yet exercised against the emulator or a live client. Harden before taking paid signups." Designs unauthenticated GET on `shares/{slug}` with a 900 KB snapshot |
| **Two PRODUCT-BRIEF figures do not reproduce** | F13 export "945 lines across 8 files" measures 875 across 7; §19 "202 of 228 identical" measures 183 identical, 25 diverged, 20 unique |
| **FIXED** — `/decisions/*` and `/prototype/*` 307'd to `/login` | `3f230d2`, red-proofed with 10 tests |
| **FIXED** — `npm run verify` red, 71 lint errors | `3f230d2` |

A trap worth recording: `git log -S"setDoc" -- src/` hits the fork commit, but it is a **false
positive** — the match is `setDoctorOpen`, and `setDoc` is a substring of it. Only `grep -w`
gives the correct answer of 0. Same substring-versus-boundary class this codebase has been
bitten by before.

### 5.2 Project memory
`~/.claude/projects/-Users-sagnikmitra-Desktop-GitHub-frontmatter/memory/`. Read `MEMORY.md`
and all files. Three matter: **pilot reshape** (product direction), **MDMAX cert + audit**
(names `docs/FRONTMATTER-PRD-v2-2026-08-29.md` as the one governing doc, lists unpushed fix
commits), and **MDZ format verdict** — *"build a compiler and an IDE, not a format"* — which
**must not be re-litigated**.

### 5.3 Git state
**8 unpushed commits** on `engine/plan-and-diagnostics`. **`git fetch` fails with the general
`GH_TOKEN`** — `studiozephyrus/frontmatter` needs `GH_TOKEN_ZEPHYRUS`. Two worktrees under
`.claude/worktrees/`, both **0 unique commits**; one has 2 dirty files. Neither holds work worth
rescuing.

### 5.4 Security
Scanned `docs/research/2026-09-09/`, `decisions/v2/`, `decisions/tools/` and **this document**
for token-shaped strings and private-key headers: **clean**. No credential fragment appears here.

**Open, inherited, and only the founder can close it: two GitHub PATs were pasted into an
earlier chat window and remain UNROTATED.** Flagged again because it survives account switches.

See `docs/12-SECURITY-REVIEW.md` for the full findings, including the `firestore.rules`
self-assessment.

### 5.5 Run basics
```bash
cd ~/Desktop/GitHub/frontmatter
npm run verify                                        # the whole gate — green at HEAD
~/.sgnk/bin/sgnk-docs-gate.sh .                       # must stay exit 0
python3 decisions/tools/validate.py decisions/v2      # 0 errors
python3 decisions/tools/build-v2.py decisions/v2 --links <links.json> --dry
python3 scripts/css-cascade-check.py decisions/app.css
```

**Two Vercel homes, not interchangeable** (`AGENTS.md` §6b): the app is project `frontmatter` on
team `zsco` with `VERCEL_TOKEN_ZEPHYRUS` and `--scope zsco`; the decisions site is project
`frontmatter-decisions` on team `team_CDEATPKml1m8SIZSJ0DKdEjG` with the bare `VERCEL_TOKEN`.

**The deploy script for the decisions site did not survive the session** — it lived in scratch.
Rewrite it as a static `POST /v13/deployments` shipping `index.html app.css app.js diagram.js
questions.js fonts.css`, and **verify with `curl -sI`, never `curl -sL`** (a login page returns
200 after a redirect). Tokens: `source /Users/sagnikmitra/.config/codex-env/tokens.zsh`; never
print them.

### 5.6 What has no second copy
`docs/research/2026-09-09/` (304 KB) is the **only** copy of the research; workflow transcripts
age out. It is committed, so it is safe — but do not delete it as scratch. It cost roughly 3.2M
subagent tokens. `decisions/v2/*.json` are likewise the only source for the cards;
`questions.js` is generated from them.

### 5.7 Meta-observations that change how you should work
- **Do not fan out one verify agent per claim.** That burned a session limit. Six `curl` checks
  by hand found the one real fabrication.
- **Research agents fabricate quotations at roughly 1 in 3** while getting substance right.
- **Agents write their files before dying.** A workflow reporting 15 failures had 5 complete
  files on disk. **Check the output directory before believing a failure count.**
- **An auditor over-flagging correct vocabulary is a bug in the auditor.** My slop list fired on
  "highest-leverage defensive act" — ordinary strategy language — and my first fix rewrote it to
  "highest-use", which was worse than the thing it fixed. Restored the phrase, narrowed the
  pattern to exempt hyphenated forms.
- **zsh aborts on an unmatched glob** where bash passes it through. `find`, not `docs/0*.md`.

### 5.8 What was NOT investigated
- The eleven §9 items were verified where a command could settle them; **NF-1, NF-3 and the
  41-of-43 fork figure are carried from the plan and marked `**unverified**`** — they need a
  corpus run and the sibling repo checked out.
- The 63 research-derived candidate decisions were never reconciled 1:1 against the 201.
- `src/modules/mdmax` internals were not read.
- Whether VS Code's reviewed state persists outside the editor. **This is the differentiation
  axis and it is unanswered.**

### 5.9 Completeness statement

| Avenue | Returned |
|---|---|
| Session walk, turn by turn | §1 |
| Raw workflow output recovered from disk | 310 findings; 5 area files a workflow reported as failed |
| Live git, stashes, worktrees | §5.3 — clean, 8 unpushed, 0 unique worktree commits |
| Secret scan incl. this document | clean; one inherited open item named |
| Project memory | §5.2 — three entries, one "do not re-litigate" |
| Live site driven and asserted | §2 |
| Validator + full test gate | 0 errors; 1,596 passing, 6 expected fail |
| Documentation gate | **PASS, exit 0** — the exception in the earlier draft is closed |

**Exceptions that still hold state:** the two unrotated PATs; the `**unverified**` items in
§5.8; and the unfixed defects in §5.1, which are recorded but not repaired.

I walked the session, the workflow transcripts, git state, memory, the live deployment and the
produced artifacts, and ran the full gate. **I did not read `src/modules/mdmax` internals and
did not re-run the corpus.** That is where a surprise could still come from.

---

## 6. Do NOT re-litigate

- **The markdown format verdict:** build a compiler and an IDE, not a format.
- **The render carrier:** `> [!kind]` callout for prose, fence for opaque data.
- **Sync is git-merge + splice journal + CAS, never a CRDT** — *but* §4.3 means it now needs a
  written rebuttal naming Zed. Card E35 exists for that.
- **The four UI defects in §1.1 and the two in §1.10 are fixed and verified.**
- **The VS Code doc quotes are fabricated.** Do not reinstate them. The GitHub PRs are real.

---

## 6b. Answering the 201 — read this before you start, it is the receiving account's job

The founder has said he will answer the decisions **on the receiving account**. That makes the
mechanics below load-bearing rather than incidental.

### Where the answers live, and how they get lost

Answers are written to **`localStorage` on `frontmatter-decisions-sagnik.vercel.app`**, under the
single key `fm-decisions-v1`, shaped `{picks: {id: "a"}, notes: {id: "text"}}`. Verified live.

That has three consequences, and the third is the one that will hurt:

- They are **per browser and per machine**. Switching Claude accounts does not move them;
  switching *computers* or *browsers* does lose them.
- They never reach a server. There is no account, no sync, no backup.
- **Clearing site data, using a private window, or a browser set to clear on exit destroys every
  answer with no recovery path.** 201 decisions is several sittings, so this is a real risk, not
  a theoretical one.

**Therefore: export after every sitting.** It takes one click and it is the only durable copy.

### How to answer

Open the site. Within each area the cards are ordered **critical first**, so stopping early
still leaves the important ones answered.

- `a`–`d` picks an option · `↵` advances · `j`/`k` move · `/` searches
- Clicking an area in the left nav opens an **area index** — every question in it, grouped open
  and answered — so one area per sitting is a workable rhythm. Deep-linkable as
  `#area-<Area%20name>`.
- Each card carries a **recommendation** and a `flip` line naming the specific finding that
  would overturn it. Disagreeing with a recommendation is a normal outcome; the export records
  it explicitly.
- The note box under each card is free text and is exported alongside the choice. Use it for
  "yes, but" — the reasoning is worth more later than the letter.

### Getting the answers back into the repo

From the **Overview**, two exports, both verified working:

| Export | Shape | Use |
|---|---|---|
| **Markdown** | Grouped by area: question, the chosen option's full label, `(against the recommendation of X)` where it differs, then the note | Reading, and for the meeting |
| **JSON** | `{"picks": {"P1": "a", …}, "notes": {"P1": "…"}}` | The machine-readable artifact everything downstream reads |

**Commit the JSON into the repo** as `decisions/answers-<YYYY-MM-DD>.json`. That is what makes
the answers durable and what the SRS/PRD/BRD/FRD must be generated *from* — not from a
conversation, and not from memory of what was decided.

A worked example of the markdown output, captured live:

```markdown
# frontmatter — decisions

Answered 2 of 201.

## Product & definition

### P1 — Does the one-sentence definition still call frontmatter a markdown editor, …?
**Decision:** Keep "markdown editor" and budget the fork tax as a line item
(against the recommendation of B)

test note for export
```

### What answering unlocks, and in what order

Several decisions gate others. The `linked` chips on each card carry those edges (197 of 201
have at least one), and three groups are worth taking together in one sitting because the answer
to one sets the others:

1. **The headline** — whether review state stays, narrows to per-span-in-the-repo, or steps
   aside for authorship marking. Every channel, price, screen and exit test hangs off it.
2. **Form factor** — standalone editor, VS Code extension, or one portable core behind both.
3. **Whether the Firebase document-holding design ships** — `firestore.rules` calls itself a
   prototype in its own comments, and **every legal rule in the plan is a function of this one
   answer**.

## 7. What to do next, in order

**1. Reconcile the 63 research-derived decisions against the 201.** The briefing's §6 lists them
grouped by area, deduplicated once. Areas added their own during the rewrite, so many are
already covered.
> **CONTINGENCY:** expect 15–30 genuinely new after dedup, not 63. If you are near 63 you are
> not deduplicating. Several in that list are research tasks rather than decisions — the
> briefing marks which — and must not become cards.

**2. Answer the 201. The founder is doing this on your account — see §6b for the mechanics.**
That is the gate on everything downstream. Your job during it is to keep the answers safe: after
every sitting, export the JSON and commit it as `decisions/answers-<YYYY-MM-DD>.json`.
> **CONTINGENCY:** the answers live only in `localStorage` on one browser on one machine. If they
> vanish — cleared site data, a private window, a different computer — they are gone with no
> recovery path unless a JSON export was committed. Export early, export often, and never assume
> a sitting will be resumed on the same machine. If the set feels too large, the ordering already
> helps (critical first within each area, one area per sitting via `#area-<name>`); do not
> "helpfully" cut it, because the merging pass already cut 319 → 201 on evidence.

**3. Only then, generate the SRS / PRD / BRD / FRD** from the answers, with features mapped to
subscription tiers and screens.
> **CONTINGENCY:** the plan's tier table (`PRODUCT-BRIEF.md` §8) and pricing (§11) contain a
> known contradiction the plan names itself — retention sits in the Max column in one exhibit
> and under Pro in another, and **no feature row builds retention at all**. Resolve that before
> writing a tier into an SRS.

**Separately, and not gated on the founder:** the §5.1 defects. `GITHUB_REPO` defaulting to the
sibling's vault and the single Firestore write in `presentation` are the two that could bite
without warning.

---

## 8. Traps that will mislead a cold reader

1. **The product looks further along than it is.** Review state does not exist in code; the
   engine is unwired. The decision set is finished; the product is not.
2. **`git fetch` fails without `GH_TOKEN_ZEPHYRUS`.** 8 commits are unpushed.
3. **The decisions-site deploy script is gone** (scratch-only). Rewrite before deploying, and
   verify with `curl -sI`.
4. **Never `Read` the big docs.** `grep -n` then `sed -n`.
5. **`questions.js` is generated.** Edit `decisions/v2/*.json` and rebuild; a hand edit is lost
   on the next build.
6. **A workflow reporting failures may still have written good files.** Check the directory.
