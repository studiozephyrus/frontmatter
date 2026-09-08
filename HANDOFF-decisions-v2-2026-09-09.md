# HANDOFF — frontmatter decisions site, v2 card rewrite and the 9-seam market research

**Written 2026-09-09, ~04:20 IST, at a session limit.** Supersedes nothing; sits alongside
`HANDOFF-mdmax-cert-and-audit-2026-08-03.md` and
`HANDOFF-graph-engineering-research-2026-07-30.md`, both of which cover different work and
are still valid on their own subjects.

---

## 0. Severity verdict — read this before anything else

**State: STABLE.** A wrong move here costs time, not work. Everything produced this session
is committed at `e6f6c8a` on `engine/plan-and-diagnostics`, the working tree is clean, and
the live site serves the committed bytes. Nothing is half-written to disk.

**Blast radius if you get it wrong.** Small and recoverable. The only live surface is a
static Vercel deployment at `https://frontmatter-decisions-sagnik.vercel.app`, which holds no
user data — answers live in each reader's `localStorage` and never reach a server. There is
no database, no auth, no billing. The product code (`src/`, `src-tauri/`) was **not touched
this session at all**.

**The single most dangerous misconception a skim would produce:** *"the decision set has been
rewritten."* It has not. **Five of fifteen areas are rewritten (82 of 300 cards). Ten areas
are still in the old paragraph shape.** The site renders both, deliberately, so it does not
look broken — which is exactly why a skim will get this wrong. See §4.

**Second most dangerous:** the research findings in `docs/research/2026-09-09/` are
substantially reliable *in substance* and **unreliable in their quotation marks**. Roughly a
third of the quotes are paraphrases wearing quotation marks. Never paste one onto a slide
without re-fetching the page. §3.4 is the calibration table.

---

## Read these first

The doc set for this project lives in `docs/` (27 markdown files, 1.24M words). It is large
and uneven. Open these four, in this order, before touching anything:

1. **`docs/PRODUCT-BRIEF.md`** — the current plan, v15, 560 lines. The one document that is
   short enough to read whole and current enough to trust. §14 lists the seven open founder
   decisions.
2. **`docs/research/2026-09-09/BRIEFING.md`** — 4,020 words. What changed on 2026-09-09 and
   what the fifteen rewrite agents were told. **Read before writing any decision card.**
3. **`docs/research/2026-09-09/VERIFIED-2026-09-09.md`** — what I personally opened and
   checked, including two claims I refuted. **This file overrides the research where they
   disagree.**
4. **`decisions/v2/CONTRACT.md`** — the card shape, voice rules, merge rules and the ten
   diagram primitives. **This is the spec the remaining ten areas migrate to.**

`docs/GAPS-2026-09-08.md` (21 KB) and `docs/DECIDE.md` (13 KB) are small and worth reading.
Everything else in `docs/` is 130 KB–3 MB; **grep them, never `Read` them.**

---

## 1. Chronological walk

### 1.1 The session opened mid-task, finishing the previous UI work

The prior context ended having applied a Mobbin reference pass to the decisions site. I
picked up by screenshotting and reading the result, and found the area route was dead: a deep
link to `#area-<name>` fell through to the overview because the boot handler only knew
questions, `import` and `overview`. Fixed with one shared `fromHash()` resolver used by both
boot and `hashchange`.

Then I drove the **live deployment** rather than the local file, which is what surfaced the
rest. Three real defects, all fixed:

- **The phone action bar was dead.** Every handler was wired in JS — position label, disabled
  states, prev/next, updated in all three views — and it never appeared. `.abar{display:none}`
  was declared *below* the `@media(max-width:900px)` block that set `display:grid`. Same
  specificity, so source order won and the override was dead code.
- **Area deep links** fell through, as above.
- **An imported question was unreachable.** The markdown import parsed, previewed and added a
  card, but set `view.cat` to the literal `"Imported"` while `renderNav` only expands the
  group whose `cat` matches. The card rendered with no way back to it.

A fourth apparent defect — a missing primary action — was **my selector reading an unanswered
question**. The behaviour is correct: *Skip for now* before a choice, *Next decision* after.
I said so rather than "fixing" it.

`scripts/css-cascade-check.py` generalises the first one: it walks a stylesheet and reports
any declaration inside a media query that a later base rule silently overrides. **It reports
the bug against the pre-fix file and comes back clean against the fixed one**, and finds
exactly one instance, so there are no siblings.

Commits: `9e207ec`, `c824ada`.

### 1.2 The user's real ask arrived

Verbatim, the parts that shaped everything after:

> "go throughout the complete plan of frontmatter again everything is the project and the plan
> … and then add more questions which are not added"

> "every questions that is added, everything should be more screen diagram or flow daigram or
> visually and mockup created wise explained proeprly, and there syhouldn't be paragraphs
> rather more shorter and bulleted texts"

> "make the questions human and not ai jargon and ai patterns sh9ould be removed"

> "if questions can be clubbed or co-connected, then combined them"

> "why a certain option is recommened , in detailed"

> "before doing anything, if you think any segment of this document editing, markdown market
> and editing , note tak9ng market, you hadn't tapped, go aehad and reserach tyhat"

> "once the answer is done, then generate the complete product plan based on the answers …
> the complkete SRS and PRD BRD FRD"

**The SRS/PRD/BRD/FRD step is explicitly gated on the user answering the decisions first.**
It is not started and must not be started before that. See §7.

### 1.3 Finding the untapped seams, evidentially

Rather than guessing what was uncovered, I scanned the corpus. A 138-product list against
1.24M words of `docs/`: **104 mentioned, 34 never named**. Then a concept scan across 35
themes found **nine under twelve mentions**, four of them directly under the product's own
claim:

| Seam | Mentions in 1.24M words |
|---|---|
| prose diff / document comparison tools | 11 |
| diff granularity (word/char/semantic) | 4 |
| versioning UX (git for writers) | 2 |
| review fatigue / attention | 8 |
| note-taking market size / TAM | 1 |
| legal document review | 1 |
| SBOM-like doc manifest | 8 |
| templates / snippets market | 8 |
| voice / dictation | 4 |

### 1.4 The research run — and the cost mistake

I launched a ten-lens research workflow. **All ten lenses completed**: 310 findings, 308 from
opened primary sources, 63 candidate decisions. Raw output is at
`docs/research/2026-09-09/research-raw.txt` (278 KB).

**Then I made an expensive mistake.** The workflow's verify stage fanned out **one skeptic
agent per load-bearing claim** — roughly 150 agents at ~100k tokens each. The user saw the
wall of `verify:` rows and said:

> "Do we really need this many tests? Just check and update, because my tokens will be
> exhausted, man."

They were right. I killed it (`TaskStop` on `w02g73nks`). **The lesson to carry forward:
verify a handful of load-bearing claims yourself with `curl` — it costs almost nothing and it
is what actually caught the fabrication below. Do not fan out one agent per claim.**

### 1.5 What I verified myself, and what it changed

Recorded in full in `docs/research/2026-09-09/VERIFIED-2026-09-09.md`.

**A research agent fabricated documentation quotes.** It claimed
`code.visualstudio.com/docs/copilot/chat/review-code-edits` says *"The reviewed state clears
if you or the agent changes the file again"* and *"Markdown files follow the same feedback
flow."* I opened the live page (redirects to `/docs/agents/run/review-code-edits`, 9,516
characters, footer dated 9/2/2026). **Zero occurrences** of "as reviewed", "reviewed state",
"clears if", "markdown", "locked mode" or "attribution".

**But the GitHub evidence in the same report is real.** I checked all three via
`api.github.com`:

| Item | Title | Milestone | Dates |
|---|---|---|---|
| PR #324218 | "Agents - add review/unreview operation to the multi-file diff editor" | 1.128.0 | created + closed 2026-07-03 |
| #326539 | "Test: Markdown editor feedback in the Agents window" | 1.130.0 | 2026-07-19 → 20 |
| #326540 | "Test: View and edit Markdown in the Agents window" | 1.130.0 | 2026-07-19 → 20 |

So the honest statement is narrower than the report's: **Microsoft built review/unreview and
markdown agent feedback, gated behind
`workbench.editor.markdownDefaultEditorInAgentsWindow`, in an experimental Agents window, and
documented none of it.** That is a statement of intent, not a shipped free competitor.

**I also closed the researcher's own biggest flagged hole: Cursor.** It could not get past
Cloudflare. I opened `cursor.com/learn/reviewing-testing` (11,414 chars). Cursor's review is
**Agent Review** ("click Review then Find Issues") plus **Bugbot** on PRs. Searched for "mark
as reviewed", "viewed", "markdown", "attribution", "per-span", "unreviewed" — **all zero**.
Cursor's answer to too much agent output is *another agent reviews it*, which is a different
product and leaves the human-facing ledger unoccupied by the most-cited comparison in the
space. `cursor.com/review` is behind a sign-in wall; I did not sign in.

### 1.6 The v2 card shape and the diagram vocabulary

Built before any content generation, so fifteen agents could not invent fifteen shapes.

`decisions/diagram.js` (453 lines) — **ten primitives** rendered as inline SVG: `screen`,
`flow`, `state`, `compare`, `ba`, `arch`, `timeline`, `matrix`, `file`, `funnel`. Structured
data in, drawing out. Geometry is computed from the text each box holds, so a longer label
resizes its box instead of colliding. Colours are CSS variables, so diagrams follow the page
into dark mode. Inline because these pages must render with no network.

Two geometry bugs found by rendering all ten with real content: state transition labels were
drawn into a 30px gap while needing ~60 (every one landed on the pill beside it), and a
screen pane's last row sat flush against the card edge. Both fixed.

The card gained: diagram at top, a one-line `stakes`, bulleted `state`/`path`/`tension`
replacing three paragraphs, and per-option `gains`, `costs`, `system`, `screens`, `money`.
The recommendation carries `flip` — the specific finding that would overturn it — and
`linked` chips to decisions that must be taken alongside.

**v1 cards still render.** Paragraph context and single-string option `impact` both fall
back, so the corpus migrates one area at a time. Commit `ae40093`.

### 1.7 Generation, and the session limit

Fifteen area agents plus one cross-area linker. **The session limit killed 15 of 16.**

Five areas completed and were rescued from the scratch directory before it was lost.

---

## 2. Live numbers, gathered at write time

```
HEAD            e6f6c8a  feat(decisions): nine untapped market seams researched…
branch          engine/plan-and-diagnostics   4 commits ahead of origin, UNPUSHED
working tree    clean
stashes         none
worktrees       2, both with 0 unique commits vs the branch (see §5.2)
```

| Measure | Value |
|---|---|
| Cards on the live site | **300** (was 319) |
| Cards in the v2 shape | **82** |
| Cards still in v1 shape | **218** |
| Cards with a diagram | **82** |
| Critical | 81 |
| Areas | 15 |
| Evidence exhibits | 551 |
| `questions.js` | 1,502 KB |
| Validator result on the v2 set | **79 cards, 0 errors, 86 warnings** |

v2 coverage by area: Product & definition 18 · Form factor & surfaces 11 · Access/offline/
install 15 · Pricing & tiers 16 · Legal/privacy/data 19 · Design/UI/attention **3 of 22**.

Live and verified by driving the deployment: diagram renders (44 SVG elements on P2), stakes
band present, 3 bulleted context columns, 4 gains/costs blocks, 4 option meta rows, flip line,
4 linked chips, `scrollWidth == innerWidth`.

**URL: https://frontmatter-decisions-sagnik.vercel.app**

---

## 3. The research findings that change the plan

All tagged as the raw file tags them. `[opened]` means a page was actually fetched.

### 3.1 Almanac — the corpse behind the headline

Shipped frontmatter's entire feature sentence — **Read Receipts** ("Ensure your team actually
reads important knowledge"), Version Control Mode, Layers, Approvals, Doc History diffing,
scheduled deprecation reviews — all still on `get.almanac.io` `[opened]`. **$9M seed + $34M
Series A led by Tiger Global, September 2021. 7-figure ARR. 50+ staff. Shut down
2025-01-31.** `[opened]`

The stated cause is the useful part and it is not the obvious one: **not out-competed**. The
same team's AI content product (Blaze) grew to "tens of thousands of users in a matter of
months" and they chose it. **The corpus never named Almanac once in 1.24M words.**

### 3.2 The attention literature is hostile to the current design

- Cisco/SmartBear: no review above 250 lines beat 37 defects/kLOC; above 450 LOC/hour, defect
  density below average in 87% of cases `[opened]`
- Google: 3.2 h/week per-developer review budget, 24-line median change `[opened]`
- Clinical alerting, the mature version: drug-interaction **override rates 55–98% across 34
  studies** `[opened]`; 86.6% override of 14,612 alerts with 88.3% of typed justifications
  meaningless `[opened]`
- The one system that achieved acceptance fired **31 rules in 0.19% of 500,274 sessions** and
  got 57.5% `[opened]`

**Forces suppression, not enumeration. A percentage-of-repo unreviewed badge is the
worst-evidenced element in the plan.**

### 3.3 Zed Delta, and the CRDT problem

Private beta 2026-08-12, built on DeltaDB, comments anchored to spans that survive edits. 679
HN points on launch, 529 on the DeltaDB post, 319 on "Software Is Made Between Commits"
`[opened]`. The 2026-09-01 post commits publicly to attribution "down to the span" and stakes
it on **CRDTs** `[opened]`.

**The corpus treats "never a CRDT" as settled.** That position may still be right for prose —
Zed is solving it for code — but it can no longer be *stated* as settled without a written
rebuttal that names Zed, because a team with ten years of CRDT work reached the opposite
conclusion in public.

### 3.4 Calibration — trust the substance, not the quotation marks

I spot-checked five quotes by fetching the page and grepping the exact string:

| Quote | Source | Result |
|---|---|---|
| "diff panel that opens beside the conversation" | Claude Code CHANGELOG | **found verbatim**; `2.1.260` also in file |
| "comments attach to snapshots" | zed.dev/blog/introducing-delta | **found verbatim** |
| "Agent Edits" / "Uncommitted" | antigravity.google/blog/vcs-and-terminal | **found**, both |
| "Every edit and conversation is captured between your commits" | zed.dev | **not on the page** |
| "…your UI gets out of sync with your working directory" | antigravity.google | **not on the page** |
| "The reviewed state clears if you or the agent changes the file again" | VS Code docs | **not on the page, capability undocumented there** |

**The capabilities are real. About a third of the quotation marks are not.**

### 3.5 Other findings worth knowing

- **Draftable** sells prose diff alone — no editor, no collaboration — at **$129 and
  $261/user/year into 1,300 law firms**, still Windows-only `[opened]`. Diff quality is a
  product and professionals pay for it.
- **The git-for-writers graveyard.** Editorially (shut 2014, *"Even if all of our users paid
  up, it wouldn't be enough"*), Poetica (→ Condé Nast 2016, software bought, users
  explicitly not), Penflip (silent death, SEO spam), Draft (503 since April 2023, zero HN
  comments). **Two of eight died with nobody noticing. Organic discovery is not a plan.**
- **Absorption is the modal outcome**, not the failure case: four of eight were bought as
  teams by organisations that already owned a publishing pipeline.
- **`petergyang/human-review`**: 0 → **1,241 stars, 98 forks in six weeks** from 2026-07-27,
  free, runs inside Claude Code or Codex `[opened]`. **501 GitHub repos** match "agent diff
  review" created since 2026-05-01 `[opened]`.
- **Bike** (outliner) publicly documents that `.txt` cannot hold stable item ids and row links
  break on close-and-reopen — **frontmatter's SAFE_KEY addressability problem, in production,
  admitted by a developer who then chose HTML** `[opened]`.
- **The one claim still unoccupied:** attribution of *which spans an agent wrote*. No platform
  shipped it. The only implementation found anywhere is a VS Code extension with **88
  installs**. The corpus demoted this after the iA Writer 7 finding — **that demotion should
  be reopened.**

---

## 4. Phase status — do not round up

| Phase | Status | Evidence |
|---|---|---|
| Fix the decisions UI end to end | **DONE, verified live** | 3 defects fixed, 23/24 live checks pass; the 1 fail was my own selector |
| Research the untapped seams | **DONE** | 10/10 lenses, 310 findings, 308 opened; `research-raw.txt` |
| Verify the research | **PARTIAL — 6 claims by hand** | `VERIFIED-2026-09-09.md`; the 150-agent fan-out was killed on cost |
| Build the v2 card shape + diagrams | **DONE** | `diagram.js`, all 10 primitives rendered with real content |
| Contract + validator + assembler | **DONE** | `decisions/v2/CONTRACT.md`, `decisions/tools/` |
| Rewrite the 15 areas | **5 of 15 (+1 partial)** | 82 of 300 cards; session limit killed 15 of 16 agents |
| Cross-area dedup and linking | **NOT STARTED** | the `cross-area-connect` agent died with the rest |
| Add the 63 research-derived questions | **NOT STARTED** | they are listed in `BRIEFING.md` §6 |
| Answer the decisions | **NOT STARTED — the user does this** | |
| SRS / PRD / BRD / FRD | **NOT STARTED — gated on answers** | |

**The user's own bar, verbatim:** *"run this end to end, before evertything is reaserach and
reasoned andanalyed poprely,. don't give me anything"* — and then *"once the answer is done,
then generate the complete product plan based on the answers."* **The decision set is not
finished. Do not declare it done at 5 of 15.**

---

## 5. The sweep

### 5.1 Project memory
`~/.claude/projects/-Users-sagnikmitra-Desktop-GitHub-frontmatter/memory/` — read
`MEMORY.md` and all files. Three entries matter: the **pilot reshape** (product direction),
the **MDMAX cert + audit** entry (names `docs/FRONTMATTER-PRD-v2-2026-08-29.md` as the ONE
governing doc and lists unpushed fix commits), and the **MDZ format verdict** ("build a
compiler and an IDE, not a format") which **must not be re-litigated**.

### 5.2 Git state
4 unpushed commits on `engine/plan-and-diagnostics`. **`git fetch` fails with the general
`GH_TOKEN`** — `studiozephyrus/frontmatter` needs `GH_TOKEN_ZEPHYRUS`. Two worktrees under
`.claude/worktrees/`, **both 0 unique commits** vs the branch; `competent-bassi-5da9a1` has 2
dirty files. Neither holds work worth rescuing.

### 5.3 Security
Scanned `docs/research/2026-09-09/`, `decisions/v2/`, `decisions/tools/` for token-shaped
strings and private-key headers: **clean**. This document contains no credential fragment.

**Open, inherited, and only the user can close it: two GitHub PATs were pasted into an
earlier chat window and remain UNROTATED.** Not mine to rotate. Flagged again here because it
survives account switches.

### 5.4 Run basics
```bash
cd ~/Desktop/GitHub/frontmatter
python3 decisions/tools/validate.py decisions/v2          # 0 errors expected
python3 decisions/tools/build-v2.py decisions/v2 --dry     # see the assembly plan
node -e "new Function(require('fs').readFileSync('decisions/app.js','utf8'))"  # parse check
python3 scripts/css-cascade-check.py decisions/app.css     # dead media-query rules
```
Deploy is a static `POST /v13/deployments` to the Vercel project `frontmatter-decisions`
(team `team_CDEATPKml1m8SIZSJ0DKdEjG`). **The deploy script did not survive the session** —
it lived in scratch. Rewrite it, ship `index.html app.css app.js diagram.js questions.js
fonts.css`, and **verify with `curl -sI`, never `curl -sL`** (a login page returns 200 after a
redirect). Tokens: `source /Users/sagnikmitra/.config/codex-env/tokens.zsh`; never print them.

### 5.5 What has no second copy
`docs/research/2026-09-09/` (304 KB) is the **only** copy of the research. The workflow
transcripts under `~/.claude/projects/.../subagents/workflows/` will age out. It is committed,
so it is safe — but do not delete it as "scratch"; it cost 3.2M subagent tokens.

### 5.6 Meta-observations that change how you should work
- **Do not fan out one verify agent per claim.** That is what burned the session. Six `curl`
  checks by hand found the one real fabrication.
- **Research agents fabricate quotations at roughly 1 in 3** while getting the substance
  right. Budget for hand-checking quotes, not findings.
- **Agents wrote their output files before dying.** Five complete area files survived a
  workflow that reported 1 success. **Always check the output directory before believing a
  workflow's failure count.**
- The `sgnk-docs-gate.sh` FAILs on this repo (missing BACKEND/DEPLOY/SECURITY/TESTING docs).
  **Pre-existing, not caused by this session.** Named as an accepted exception in §6.

### 5.7 What was NOT investigated
- `src/`, `src-tauri/`, `test/` — **not opened this session**. The 11 engine fixes in
  `PRODUCT-BRIEF.md` §9 are unverified against current code.
- The 63 research-derived candidate decisions were never deduplicated against the existing 300.
- The `mdmax cert` and `entities` defects from the August audit — not re-checked.
- Whether VS Code's reviewed state persists outside the editor. **This is the differentiation
  axis and it is unanswered.**

---

## 6. Completeness statement

| Avenue | Returned |
|---|---|
| Session walk, turn by turn | §1 |
| Raw workflow output recovered from disk | 310 findings, 5 area files a workflow reported as failed |
| Live git, stashes, worktrees | §2, §5.2 — clean, 4 unpushed, 0 unique worktree commits |
| Secret scan of new artifacts + this document | clean; one inherited open item named |
| Project memory | §5.1 — three entries, one "do not re-litigate" |
| Live site driven and asserted | 23/24 checks; §2 |
| Validator run against the produced cards | 79 cards, 0 errors |
| Docs gate | **FAIL — accepted exception, see below** |

**Exceptions that still hold state:**
1. **`sgnk-docs-gate.sh` returns FAIL** on this repo for missing product docs (BACKEND,
   DEPLOY, SECURITY, TESTING, GLOSSARY and others). This is pre-existing and was not caused
   or worsened by this session; fixing it would have taken hours the session did not have.
   **Proceeding under an explicitly named exception, as the skill permits.** It should be
   fixed with `sgnk-spec` before the next handover.
2. Ten of fifteen decision areas are unrewritten and hold their content only in
   `decisions/questions.js` in the old shape.
3. The two unrotated PATs.

I checked the session, the workflow transcripts, git state, memory, the live deployment and
the produced artifacts. **I did not read `src/`, and I did not re-verify the August engine
audit.** That is where a surprise could still come from.

---

## 7. What to do next, in order

**1. Re-run the ten failed areas.** The workflow is saved and cached — completed agents replay
free:
```
Workflow({scriptPath: 'decisions/tools/gen-workflow.js', resumeFromRunId: 'wf_62612956-a7c', args: {...}})
```
The `args` blob is in the task notification in this session's transcript, or rebuild it from
`decisions/v2/_source-index.json`. **The five finished areas will replay from cache; only the
ten failures re-run.** Point `scratch` at a fresh directory and copy the finished five in
first, or they will be regenerated needlessly.
> **CONTINGENCY:** if the resume cache has expired (it is same-session only — and this *is* a
> new session, so **assume it has**), do not fight it. Run a fresh workflow over only the ten
> missing areas. Per-area source JSON is regenerated by splitting `decisions/questions.js` on
> `cat`; the one-liner that did it is in §1.7's approach — read a card's `cat`, group, write
> one file per area.

**2. Run the cross-area linker.** It never ran. Without it there is no cross-area dedup and
the "Decide alongside" chips only carry within-area links.
> **CONTINGENCY:** if it proposes aggressive merges, do not apply them blind. `build-v2.py`
> takes `--links` and drops duplicates; run it with `--dry` first and read the card count
> before writing.

**3. Add the 63 research-derived decisions.** They are in `BRIEFING.md` §6, grouped by area,
already deduplicated once. Several are research tasks rather than decisions — **the briefing
marks which** — and those must not become cards.
> **CONTINGENCY:** the count will not be 63 after dedup against the existing 300. Expect
> 30–45. If you get near 63, you are not deduplicating.

**Then:** rebuild with `build-v2.py`, validate, deploy, and only then hand it to the user to
answer. The SRS/PRD/BRD/FRD is **after** the answers, not before.

### Do NOT re-litigate
- **The markdown format verdict:** "build a compiler and an IDE, not a format." Settled.
- **Sync is git-merge + splice journal + CAS, never a CRDT** — *but* §3.3 means this now needs
  a written rebuttal naming Zed, not silent reassertion.
- **The `>[!kind]` callout carrier for prose, fence for opaque data.** Settled.
- **The four defects in §1.1 are fixed and verified live.** Do not re-fix them.
- **The VS Code doc quotes are fabricated.** Do not reinstate them. The GitHub PRs are real.

### Traps that will mislead you if you skip them
1. **The site looks finished. It is 5/15 rewritten.** v1 and v2 cards render side by side by
   design.
2. **`git fetch` fails without `GH_TOKEN_ZEPHYRUS`.** The general token has no access to
   `studiozephyrus/frontmatter`. Four commits are unpushed.
3. **The deploy script is gone** (scratch-only). Rewrite before deploying; verify with
   `curl -sI`.
4. **Never `Read` the big docs.** `FRONTMATTER-PRD-v2` is 760 KB, two RECORD files are 2–3 MB.
   `grep -n` then `sed -n`.
5. **A workflow reporting 15 failures may still have written 5 good files.** Check the output
   directory first.
