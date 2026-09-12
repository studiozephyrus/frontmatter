Verified read-only — no mutations, no commits from this session.

**Finding in one line:** the pain is real, large, and *rising* — but the specific artefact this product plans to sell (a handover / context pack) has already been launched 89 times on Hacker News in 20 months, with a median of 2 points, and 88 of those 89 failed to reach 50 points. The pain is durable; the *shape of the answer* the founders have chosen is the single most crowded and least-rewarded shape in the category.

---

### The most inconvenient finding, first

[measured] I pulled every Show HN story on Hacker News from 2025-01-01 to 2026-08-31 whose title contains both an AI term and a memory/context term. **347 stories.** Narrowing to titles explicitly about cross-session memory, handover, or persistent context: **89 launches.**

| Traction of the 89 memory/handover Show HNs | n | % |
|---|---|---|
| ≥50 points | 1 | 1% |
| ≥20 points | 3 | 3% |
| ≥10 points | 8 | 9% |
| ≥5 points | 20 | 22% |
| **median points** | **2** | — |

Four of them are literally called *Handoff*:

| Date | Title | Pts | Comments |
|---|---|---|---|
| 2025-12-28 | Show HN: Handoff – Claude Code plugin to let any AI continue where you left off ([46414728](https://news.ycombinator.com/item?id=46414728)) | 4 | 1 |
| 2026-02-15 | Show HN: ContextLedger – CLI to track and handoff context b/w AI coding sessions ([47027105](https://news.ycombinator.com/item?id=47027105)) | 2 | 3 |
| 2026-02-27 | Show HN: Handoff-md – One command to generate portable AI context from any repo ([47183826](https://news.ycombinator.com/item?id=47183826)) | 1 | 0 |
| 2026-05-18 | Show HN: Handoff – preserve coding context when agents run out of tokens ([48186924](https://news.ycombinator.com/item?id=48186924)) | 3 | 0 |
| 2026-07-05 | Show HN: Handoff – a verified context bridge between Claude Code sessions ([48795956](https://news.ycombinator.com/item?id=48795956)) | 7 | 2 |
| 2026-06-24 | Show HN: Resume Claude Code from a handoff file auto-save, snapshots, PR sharing ([48657973](https://news.ycombinator.com/item?id=48657973)) | 3 | 0 |

[inference] This does not prove the market is unwinnable. It proves the *category has zero distribution defensibility from novelty* — nobody's attention is available for "we generate a context pack." Two of the strongest performers were framed differently: "Segue – Save context in one AI, load it in another by a short handle" (31 pts, [49082779](https://news.ycombinator.com/item?id=49082779)) and "Recall: Give Claude memory with Redis-backed persistent context" (171 pts). Framing carried more than substance.

---

### Method and denominators

[measured] I built the corpus by phrase-searching the HN Algolia API for named AI coding tools, time-sliced by month across 2025-01-01 → 2026-08-31 to defeat the 1,000-result relevance cap. **48,525 unique comments** fetched; **42,175 (86.9%)** contain a named AI coding tool or an explicit agentic-coding term. That 42,175 is **N** for every percentage below. Applying a frustration-lexicon gate yields a **pain corpus of 3,037 comments (7.2% of N)**.

[fetched] **Reddit was unreachable from this environment and I have zero Reddit data.** `www.reddit.com/*.json`, `api.reddit.com`, `oauth.reddit.com` → **HTTP 403**; `old.reddit.com` and `gateway.reddit.com` → bot interstitial; `api.pullpush.io` → **429** ("does not provide free scraping resources for agents"); `r.jina.ai` proxy → 403; `redlib.catsarch.com` → 403; `libreddit.privacydev.net` → 502; DuckDuckGo Lite and searx.be both served CAPTCHAs. Every r/ClaudeAI, r/cursor, r/LocalLLaMA and r/ExperiencedDevs figure the brief asked for is therefore **absent, not estimated**. Anything I said about Reddit would be [SS]. HN skews senior, English-speaking, and sceptical; treat the taxonomy as *what experienced developers complain about*, which is close to but not identical to the target buyer.

[measured] GitHub: `repo:anthropics/claude-code is:issue` = **88,108 issues** — the denominator for the GitHub column. Comparators: openai/codex 25,080; microsoft/vscode-copilot-release 13,716; cline/cline 4,465; Aider-AI/aider 4,387; RooCodeInc/Roo-Code 3,562.

---

### The ranked taxonomy of pain

Counts are complaint-gated regex matches. "Prec." is hand-labelled precision on a random sample I read individually (sample size in brackets) — the honest correction on each count.

| # | Pain | Mentions | Complaints | % of N | % of pain | Prec. | GitHub (claude-code, in:title) |
|---|---|---|---|---|---|---|---|
| 1 | Context window fills / compaction destroys the thread | 2,784 | **1,227** | 2.91% | 40.4% | ~31% [16] | `context` 4,150 (4.71%); `compact` 1,656 (1.88%) |
| 2 | Output quality / slop / unmaintainable code | 953 | **720** | 1.71% | 23.7% | not sampled | — |
| 3 | Hallucination (invented APIs, files, packages) | 545 | **315** | 0.75% | 10.4% | not sampled | `hallucinat` **0** |
| 4 | Cost, rate limits, quota exhaustion | 723 | **285** | 0.68% | 9.4% | not sampled | — |
| 5 | **Lost / destroyed / overwritten work** | 396 | **214** | 0.51% | 7.0% | 59% on-topic, 39% first-hand [51] | `lost` 522, `deleted` 293, `overwrite` 155, `data loss` 142 |
| 6 | **Re-establishing context in a new session (handover)** | 342 | **198** | 0.47% | 6.5% | ~31% [16] | `resume` 1,641 (1.86%) |
| 7 | Model loses the plot mid-session | 331 | **195** | 0.46% | 6.4% | not sampled | `forget` 48 |
| 8 | Non-determinism / not reproducible | 246 | **143** | 0.34% | 4.7% | not sampled | — |
| 9 | Gave up / churned / reverted to hand-coding | 220 | **113** | 0.27% | 3.7% | not sampled | — |
| 10 | Ignores explicit instructions / rules files | 113 | **67** | 0.16% | 2.2% | ~67% [12] | `ignores` 977 (1.11%) |
| 11 | Over-eager: touches unrelated / working code | 107 | **60** | 0.14% | 2.0% | not sampled | — |
| 12 | Edit/patch tool failures, loops | 71 | **49** | 0.12% | 1.6% | not sampled | `edit`+`fail` 120 |
| 13 | Verification burden exceeds writing it yourself | 48 | **28** | 0.07% | 0.9% | ~40% [10] | — |
| 14 | Wrong file / wrong directory | 31 | **20** | 0.05% | 0.7% | not sampled | `wrong file` 53 |

What the person was doing, what it cost, what they did instead — the three highest-value rows:

**#1 context window.** Doing: a multi-hour feature on an existing codebase. Went wrong: the session degrades past a threshold and starts redoing finished work. Cost: the session. Did instead: start a new one and re-feed. *"past a certain point the context window gets cluttered and it starts trying to redo tasks it has already"* — [49291170](https://news.ycombinator.com/item?id=49291170), 2026-08-13.

**#5 lost work.** Doing: routine agentic edits, or running a command the agent vouched for. Cost: hours to weeks. Did instead: churned, or installed a hard guard. *"I trusted that and ran it — and it wiped out weeks of my data"* — [49044975](https://news.ycombinator.com/item?id=49044975), 2026-07-25. *"It deleted all my code... I used Windsurf once and never opened it again"* — [43910788](https://news.ycombinator.com/item?id=43910788), 2025-05-06. *"Cursor just deleted my unit tests too many times in agent mode"* — [44035687](https://news.ycombinator.com/item?id=44035687), 2025-05-19.

**#6 handover.** Doing: opening tomorrow's session on yesterday's project. Cost: 10–40 minutes per session, every session. Did instead: built a tool. *"I got tired of re-explaining my codebase to Claude and Copilot every session... It's like talking to a goldfish"* — [45811385](https://news.ycombinator.com/item?id=45811385), 2025-11-04. *"copying context, losing thread, starting over"* — [45408245](https://news.ycombinator.com/item?id=45408245), 2025-09-28.

---

### MODEL versus WORKFLOW — the most important output

[measured] I did not classify this by opinion. I measured the **complaint rate per 1,000 tool-mentioning comments, per half-year**. If a pain is model-side, rising model capability should show up as a falling rate. If it is workflow-side, the rate stays flat or climbs as adoption deepens. Context windows grew roughly an order of magnitude across this window; hallucination benchmarks improved sharply.

| Pain | 2025H1 | 2025H2 | 2026H1 | 2026H2* | 25H1→26H1 | Verdict |
|---|---|---|---|---|---|---|
| Slop / unmaintainable output | 8.6‰ | 14.8‰ | 21.4‰ | 25.0‰ | **+149%** | WORKFLOW |
| Cost / rate limits | 4.0‰ | 6.2‰ | 8.3‰ | 8.2‰ | **+108%** | WORKFLOW (pricing) |
| Non-determinism | 2.7‰ | 3.1‰ | 4.0‰ | 3.1‰ | +49% | BOTH |
| **Lost / destroyed work** | 4.0‰ | 5.2‰ | 5.4‰ | 5.7‰ | **+43%** | WORKFLOW |
| Verification burden | 0.5‰ | 0.6‰ | 0.8‰ | 0.6‰ | +40% | WORKFLOW |
| Context window / compaction | 24.1‰ | 29.6‰ | 32.8‰ | 25.2‰ | **+36%** | WORKFLOW |
| Ignores instructions | 1.3‰ | 1.9‰ | 1.6‰ | 1.3‰ | +21% | BOTH |
| **Handover / re-explaining** | 4.9‰ | 4.8‰ | 4.9‰ | 3.4‰ | **±0%** | WORKFLOW (flat, durable) |
| Edit-tool failures | 1.1‰ | 1.4‰ | 1.1‰ | 1.0‰ | −1% | MODEL/harness |
| Gave up | 3.0‰ | 2.3‰ | 2.3‰ | 4.4‰ | −25% | — |
| Wrong file | 0.5‰ | 0.6‰ | 0.4‰ | 0.2‰ | −30% | MODEL |
| Loses the plot mid-session | 6.0‰ | 5.0‰ | 3.8‰ | 3.8‰ | **−36%** | MODEL |
| Over-eager edits | 1.7‰ | 1.8‰ | 1.0‰ | 1.3‰ | −42% | MODEL |
| **Hallucination** | 9.3‰ | 7.8‰ | 7.5‰ | 3.1‰ | **−19% (−67% to H2)** | **MODEL — already being fixed** |

*2026H2 covers only 2026-07-01 → 2026-08-31 (n=4,764) and may still be indexing; treat it as directional.

[derived] Deduplicated across the pain corpus of 3,037: **workflow-only 2,193 (72.2%), model-only 579 (19.1%), both 265 (8.7%).**

The clean result: **hallucination is the one archetypal model pain and it is measurably collapsing** — 9.3‰ → 3.1‰, and `hallucinat` appears in **0 of 88,108** claude-code issue titles. Mid-session incoherence, over-eagerness and wrong-file edits are also falling. Everything that requires a *human process* around the model — context budgeting, handover, review, guardrails, and above all the maintainability of what gets produced — is flat or climbing. Do not build for rows below the line. The labs are already eating them.

The uncomfortable corollary: the **fastest-growing complaint in the entire corpus is slop (+149%)**, and it is not one this product touches.

---

### How often is it lost work or corrupted files?

This is the product's existing answer, so the number matters most here.

[measured] 214 complaint-gated comments (7.0% of the pain corpus, 0.51% of N). I then hand-labelled all **51** comments matching a strict "agent destroyed something of mine" pattern: **20 genuine first-hand incidents (39%), 10 secondhand reports of a named incident (20%), 21 false positives (41%).** Precision-adjusted, first-hand destruction is roughly **0.05% of N** and **~2.7–4.1% of complaints**.

[measured] But frequency is the wrong axis. Salience is enormous: **101 HN stories** since 2025-01-01 carry AI + destruction in the title, totalling **5,023 points and 4,120 comments**. The top five:

| Pts | Comments | Date | Story |
|---|---|---|---|
| 860 | 1,032 | 2026-04-26 | An AI agent deleted our production database ([47911524](https://news.ycombinator.com/item?id=47911524)) |
| 255 | 216 | 2025-12-14 | Claude CLI deleted my home directory and wiped my Mac ([46268222](https://news.ycombinator.com/item?id=46268222)) |
| 179 | 160 | 2025-07-22 | Replit's CEO apologizes after its AI agent wiped a company's code base ([44646151](https://news.ycombinator.com/item?id=44646151)) |
| 145 | 158 | 2026-03-06 | Claude Code wiped our production database with a Terraform command ([47278720](https://news.ycombinator.com/item?id=47278720)) |
| 71 | 46 | 2025-07-21 | 'I destroyed months of your work in seconds' says AI coding tool after deletion ([44637457](https://news.ycombinator.com/item?id=44637457)) |

[inference] Rare, catastrophic, and category-defining — but note the two things the evidence keeps saying. First, **nearly every headline incident is filesystem or database destruction, not editor corruption of a markdown file.** A byte-preserving markdown engine does not prevent `rm -rf ~/`. Second, the highest-signal comment in the whole corpus on this topic: *"'soft' rules in an CLAUDE.md or AGENTS.md file cannot replace hard technical constraints"* — [46429901](https://news.ycombinator.com/item?id=46429901), 2025-12-30. The market has already concluded that documents do not prevent destruction; **hooks and permission guards** do.

The under-served variant is the quiet kind: *"the worst thing that happened wasnt a wipe... it created a /public/blog/ folder... My blog just 404'd and I spent like an hour debugging"* — [47550799](https://news.ycombinator.com/item?id=47550799), 2026-03-28. Small, silent, structural damage that no undo catches.

### How often is it the handover problem?

[measured] 198 complaint-gated comments (6.5% of pain, 0.47% of N), precision ~31% on a 16-comment read → roughly **60 genuine handover complaints in 42,175**. On GitHub, `resume in:title` = **1,641 of 88,108 claude-code issues (1.86%)** and `CLAUDE.md in:title` = **857 (0.97%)**.

The rate is **exactly flat across 20 months** (4.9‰ → 4.9‰). That is the strongest evidence in this report that handover is a durable, workflow-side problem the labs are not solving. It is also, per the Show HN table, the most attempted and least rewarded thing to build.

---

### What people actually do — the real competitor

| Workaround | n | % of N | Trend 25H1→26H1 |
|---|---|---|---|
| Sub-agents / git worktrees / parallel isolation | 1,130 | 2.68% | 4.6‰ → 24.8‰ (**+439%**) |
| Any rules file (CLAUDE.md / AGENTS.md / .cursorrules) | 701 | 1.66% | 7.5‰ → 14.6‰ (+95%) |
| — of which CLAUDE.md | 409 | 0.97% | 3.9‰ → 9.2‰ |
| — of which AGENTS.md | 239 | 0.57% | 0.5‰ → 7.5‰ (**+1400%**) |
| "I'll just write it myself / by hand" | 458 | 1.09% | — |
| Copy-paste rituals (repomix, gitingest, manual paste) | 381 | 0.90% | — |
| Git checkpointing as a safety net | 338 | 0.80% | — |
| Plan.md / spec.md / PRD as the context artefact | 248 | 0.59% | — |
| Restart ritual (`/clear`, `/compact`, new session) | 159 | 0.38% | 2.3‰ → 2.3‰ (flat) |
| MCP memory servers (mem0, Zep, Letta, Graphiti) | 82 | 0.19% | — |

[measured] Of the 701 rules-file mentions, **110 (16%)** simultaneously say the file fails, degrades, or is ignored. *"it's pretty easy for Claude Code at least to ignore the prompts, commands, Markdown files, README, architecture docs"* — [46355516](https://news.ycombinator.com/item?id=46355516), 2025-12-22. *"CLAUDE.md helps but tops out at ~150 lines and gets unreliable after context compaction"* — [47103683](https://news.ycombinator.com/item?id=47103683), 2026-02-21. The interoperability wound: *"CLAUDE.md works in Claude Code... .cursorrules works in Cursor. None of them talk to each other"* — [46785247](https://news.ycombinator.com/item?id=46785247), 2026-01-27. Even the maintenance burden is contested: *"the author of Claude Code just told everyone they should delete all their `CLAUDE.md`"* — [49307332](https://news.ycombinator.com/item?id=49307332), 2026-08-15.

[inference] The dominant workaround is **free, in-repo markdown that the vendor ships by default**, and its adoption is growing far faster than any paid tool. The real competitor is not another editor; it is `AGENTS.md` plus `git worktree` plus `/clear`. Beating "free and already in the repo" needs a reason that is not "we generate a better document."

---

## WHAT THIS MEANS FOR THE PRODUCT

- **Do not lead with "we generate handovers and context packs."** 89 launches, median 2 points, 1 in 89 above 50 points, four of them named *Handoff*. The artefact is not the wedge; it is table stakes that ships free with the agent. Reshape the pitch around the outcome the counts support — *sessions that don't lose the thread and edits that can't silently corrupt* — and treat the documents as the mechanism, not the headline.

- **Kill any roadmap item aimed at hallucination, mid-session incoherence, over-eagerness, or wrong-file edits.** Measured decline of 19–67% in 20 months, and 0 of 88,108 claude-code issue titles mention hallucination. The labs own these. Building here is building against a falling curve.

- **Keep the byte-preserving, refuse-don't-guess engine, but stop describing it as protection against lost work.** First-hand destruction is ~0.05% of comments, and the incidents that define the category are `rm -rf`, Terraform and production databases — outside a markdown editor's blast radius. Its real, defensible value is the *quiet* damage class ([47550799](https://news.ycombinator.com/item?id=47550799)): silent structural corruption of a document across many agent passes. That is a maintainability claim, not a disaster claim.

- **The biggest measured gap is one you are not addressing: slop, +149% and now 23.7% of all complaints.** If the artefacts (decision records, specs, flows) can be positioned as *the thing that makes AI output reviewable and maintainable*, the product lands on the fastest-growing pain instead of the most crowded one. That is a repositioning, not a rebuild.

- **Build for the multi-tool seam, not the single-tool session.** Two of the highest-signal complaints are cross-tool: format fragmentation ([46785247](https://news.ycombinator.com/item?id=46785247)) and agents clobbering each other in one repo ([47442244](https://news.ycombinator.com/item?id=47442244), 2026-03-19). "Connect your own provider keys" already points here; sub-agent/worktree talk grew **+439%**, the fastest-growing workaround in the corpus. Neutral, portable, multi-agent-safe is the one position free vendor defaults structurally cannot occupy.

- **Two evidence gaps I could not close, stated plainly.** Reddit was 100% unreachable (403/429/CAPTCHA across nine access routes), so the non-HN, less-senior, higher-volume user voice is missing entirely — and that is precisely the ₹299-tier buyer. And nothing here measures willingness to pay; a flat 4.9‰ complaint rate and 89 free open-source answers are consistent with a real pain that nobody pays for. Before building further, validate price on the handover problem specifically, because the workaround it competes with costs zero rupees and is already in the repository.
