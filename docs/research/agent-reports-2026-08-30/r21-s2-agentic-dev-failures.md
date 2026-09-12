Reconcile verified (9th): `~/.claude` HEAD `6e390828`, frontmatter HEAD `484f579`, unchanged; pre-existing dirt only, no commits from this run.

---

**One line: the rules files do not rot nearly as much as we assumed, and when they are fresh the agent still ignores them — the binding constraint is adherence and persistence, not authorship, and the market for the artefact we plan to sell is the single most crowded, least-rewarded category on Show HN.**

Four findings that cut against the thesis, first.

**1. A fresh, correct document does not govern the agent.** The HANDBOOK.md benchmark (arXiv 2607.25398, submitted 2026-07-28, rev v3 2026-08-03, COLM 2026 Workshop on Agent Behavior) is the exact experiment our product assumes: place an expert-written 20–124 page standing policy in context, give the agent MCP tools, grade 824 deterministic criteria across 65 tasks. Under strict grading **the strongest evaluated model passes 36.2% of trials, and most frontier models stay below 25%**. Named failure modes include agents that "lose rule details over long horizons" and "report compliance they did not achieve." [fetched] The document was perfect. It was authored by domain experts. It still governed nothing about two-thirds of the time. Our engine's byte-preservation guarantees the artefact is correct; it cannot make the artefact binding.

**2. The one empirical study of AGENTS.md files says they are roughly neutral, and AI-generated ones are net negative.** Quoted verbatim by a commenter in the HN thread on it (2026-06-08, item 48441589): *"We find that all context files consistently increase the number of steps required to complete tasks. LLM-generated context files have a marginal negative effect on task success rates, while developer-written ones provide a marginal performance gain… context files have only marginal effect on agent behavior, and are likely only desirable when manually written."* [fetched, HN comment] · [SS, the paper itself — arXiv and Semantic Scholar both returned 429 on three attempts]. Another commenter in the same thread: *"I've seen some AI-generated agents.md which were just plain wrong. No surprise agents perform worse after reading those."* A product that generates these artefacts is on the wrong side of that finding by construction.

**3. Person-to-person handoff is almost not a complaint.** Across 2,540 Reddit posts (2025-09 to 2026-08), **311 (12.2%) use explicit "handoff/handover" language — but 80% of those sit next to agent/session/context words and only 7% next to human/team words.** [measured] Posts about someone else picking up AI-written code: **18 / 2,540 (0.7%)**. In `anthropics/claude-code`, "handoff" or "handover" in the title: **81 issues out of 88,109 (0.09%)**; team-scoped CLAUDE.md requests: **11 of the 857 CLAUDE.md issues (1.3%)**. [measured] The felt pain is a solo developer handing off to *tomorrow's session*, not to a colleague.

**4. This category is a graveyard.** 373 Show HN launches since 2025-09-01 whose titles pair an agent/coding word with context, memory, AGENTS.md, handoff, session, spec, or docs. **Median 2 points. Median 0 comments. 85% got ≤5 points. 2% got ≥50.** [measured] "Show HN: Solokit – Session-Driven Development Framework for Claude Code" (2025-11-12): 1 point, 1 comment. "Show HN: ctx – Reusable context packs for coding agents" (2026-01-17): 1 point, 0 comments. "Show HN: devnexus – persistent context across repos, sessions, and engineers" (2026-04-18): 6 points, 0 comments. On GitHub, a search for handoff/session-context repos returns **24 results, top one at 4 stars, most at 0–2**. [fetched]

**Denominators**

| Corpus | n | Window | How |
|---|---|---|---|
| GitHub repos probed | 1,000 (stars >1000, pushed since 2026-07-01) | snapshot 2026-08-31 | search API + raw.githubusercontent |
| Rules files downloaded & parsed | 735 | same | 4 paths × 1,000 repos |
| Rules-file commit histories | 629 | to 2026-08-31 | GitHub commit atom feeds |
| Path citations existence-checked | 1,317 (729 strict) | same | raw fetch, HTTP status |
| `anthropics/claude-code` issues | 88,109 total; 857 with CLAUDE.md in title (all pulled) | repo lifetime | search API |
| HN comments literally naming a rules file | 1,827 (1,768 from 2026) | 2024-08 → 2026-08 | Algolia, 3,836 pulled, literal filter |
| HN comments on context/handoff mentioning a coding tool | 706 (from 2,193 pulled) | ≥2025-09-01 | Algolia |
| Reddit posts | 2,540 (ClaudeAI 1,008 · cursor 500 · vibecoding 460 · ExperiencedDevs 373 · ChatGPTCoding 188 · LocalLLaMA 11) | 2025-09 → 2026-08 | arctic-shift archive |

Caveats I will not hide: HN's `nbHits` is fuzzy-OR and useless, so every HN number here is a literal-substring recount over a corpus I pulled. `reddit.com/*.json` returns 403 in this environment and PullPush 429s; arctic-shift served the corpus but dropped ~30% of requests, so the Reddit corpus is query-seeded, not exhaustive. GitHub code search requires auth and was unavailable, so the repo frame is "top-starred and actively pushed", which over-represents OSS libraries and under-represents private product teams — the exact population we would sell to. [measured, with stated bias]

**The multi-session and multi-person failure taxonomy**

I classified all 857 `anthropics/claude-code` issues with CLAUDE.md in the title. Categories overlap; 45.2% matched none.

| Failure mode | n / 857 | share |
|---|---|---|
| B. Loaded but not obeyed by the model | 292 | 34.1% |
| E. Hierarchy / @-imports / monorepo scoping | 67 | 7.8% |
| C. Breaks at compaction / mid-session / long session | 59 | 6.9% |
| A. File not loaded or silently dropped | 47 | 5.5% |
| D. Broken in subagents / worktrees / parallel runs | 37 | 4.3% |
| F. Token cost of the file itself | 31 | 3.6% |
| G. AGENTS.md / cross-tool interop | 12 | 1.4% |
| H. Team / shared / multi-person | 11 | 1.3% |
| *Delivery-or-adherence failure (A ∪ B)* | *333* | *38.9%* |
| *Multi-session or multi-context (C ∪ D)* | *93* | *10.9%* |

[measured] **Loaded-but-ignored outnumbers never-loaded 6.2 to 1.** The document arrives. It is read. It does not bind.

The multi-session mechanism is legible in the titles, which is what makes this the strongest part of the round:

- #89733, 2026-08-26 — *"CLAUDE.md and memory rules stop applying after compaction — 163 sessions of logged evidence"* [fetched]
- #80873 — *"Instruction adherence decays mid-session — CLAUDE.md rules 'fade' after 5–10 turns"*
- #86359 — *"Context-continuation sessions bypass CLAUDE.md instructions in favor of compaction summary"*
- #85544 — *"Long sessions: pre-existing CLAUDE.md rules lose to newly written ones, and the agent keeps adding more"*
- #88886, 2026-08-22 — *"Subagents receive a CLAUDE.md/memory snapshot from parent session start, not spawn"*
- #88813 — *"Unresolvable `@import` in CLAUDE.md fails completely silently — no warning"*
- #90572, 2026-08-29 — *"Built-in worktree feature silently disregards project CLAUDE.md instructions"*

@troupo on HN (49299380, 2026-08-14): *"As the context fills up the models will happily [forget] and ignore any number of any sections of your CLAUDE.md/AGENTS.md… I've had explicit instructions in CLAUDE.md, in Claude's project 'memory', in global 'memory', in 'skills': it couldn't care less where it was."* [fetched]

The taxonomy that falls out: **(i) attention decay within a session** — rules recitable but not applied late; **(ii) compaction amnesia** — the summary outranks the standing document; **(iii) fan-out drift** — subagents and worktrees get a stale or absent copy; **(iv) accretion** — the file grows, new rules outrank old ones, nobody prunes; **(v) fragmentation** — the same knowledge in N tool-specific files that diverge; **(vi) silent-failure** — a broken import or an unloaded path produces no warning at all. Note what is *not* in that list: "the document was badly written."

**What people actually put in these files**

Of 1,000 repos: **AGENTS.md 348 (34.8%) · CLAUDE.md 281 (28.1%) · .github/copilot-instructions.md 96 (9.6%) · .cursorrules 10 (1.0%)**. `.cursorrules` is dead. [measured]

| File | median words | p90 | max | median lines |
|---|---|---|---|---|
| AGENTS.md | 863 | 3,304 | 16,905 | 111 |
| copilot-instructions.md | 433 | 1,680 | 3,474 | 54 |
| CLAUDE.md | **23** | 1,848 | 8,575 | 6 |
| .cursorrules | 149 | 805 | 805 | 8 |

CLAUDE.md's median of 23 words is the story: **157 of 281 (56%) are under 60 words**. 224 repos carry both files; in **148 of them (66%) CLAUDE.md is a sub-60-word pointer at AGENTS.md**, 11 (5%) are byte-identical, and **67 (30%) have two substantive files with different content** — the same repo telling two agents two different things. 42 repos carry three or more distinct rules files. [measured] This fragmentation is also the single most-discussed rules-file topic on HN: **177 of 1,827 comments (9.7%), spread over 119 distinct stories** — roughly four times the volume of staleness talk (45, 2.5%) and handoff talk (43, 2.4%). @superfrank, 2026-08-19: *"Having a CLAUDE.md that just says 'Read AGENTS.md' resulted in Claude randomly not following the rules."*

Section coverage across the 312 substantive AGENTS.md files (heading-level match):

| Theme | share |
|---|---|
| Architecture / structure / directory map | 61.5% |
| Build, test, lint commands | 55.4% |
| Git / PR / commit workflow | 46.5% |
| Code style | 44.2% |
| Testing policy | 26.9% |
| Explicit do-nots / constraints | 22.1% |
| Security | 14.7% |
| **Decisions / rationale / why / ADR** | **10.9%** |
| **Handoff / session state / current work** | **4.8%** |

[measured] These are operational manuals, not narrative records. The two things our product proposes to generate — decision records and handovers — are the two rarest things in the corpus, at 10.9% and 4.8%. That is either a gap or a revealed preference, and this round cannot distinguish them. [inference]

**Staleness, measured**

Days between the last commit touching the rules file and the last push to the repo, from GitHub commit atom feeds:

| | n | median | >30d | >90d | only ever 1 commit |
|---|---|---|---|---|---|
| AGENTS.md, all | 348 | 19d | 43% | 21% | 19% |
| CLAUDE.md, all | 281 | 90d | 74% | 49% | 36% |
| AGENTS.md, substantive (≥150w) | 298 | 16d | 38% | 15% | — |
| CLAUDE.md, substantive (≥150w) | 114 | 31d | 51% | 29% | — |

[measured] So: yes, they rot — but the raw CLAUDE.md figure is inflated by pointer files that correctly never change. The honest number is **a substantive AGENTS.md is 16 days behind the code at the median, and 15% are more than a quarter behind.**

Staleness in days is not wrongness, so I tested wrongness directly: extract backticked path tokens from each AGENTS.md and check whether they resolve at HEAD. Loose measure: **230 of 1,317 citations dead (17.5%), 45% of 243 repos with ≥1 dead path** — but spot-checking showed false positives from monorepo-relative and illustrative paths (`./foo.ts` in Storybook's file). Strict measure, repo-rooted prefixes only: **79 of 729 dead (10.8%), 50 of 212 repos (24%) carrying at least one dead path.** [measured] Roughly one in nine file references in a live AGENTS.md points at nothing. @EMM_386, HN, 2026-07-12: *"subsystem-specific AGENTS.md/CLAUDE.md files are still superior and accomplish the same thing. The problem with those is they can become stale."*

**Assembly versus quality**

Within 706 HN comments (≥2025-09-01) that mention a coding agent and discuss context: **assembly 80 (11.3%) · quality 79 (11.2%)**. A ratio of 1.01 : 1. [measured] The levels are inflated by my query seeding; the ratio is the defensible number. On Reddit the assembly-shaped complaint runs 198 / 2,540 (7.8%). Both are dwarfed by **multi-session decay: 210 / 706 (29.7%) on HN, 375 / 2,540 (14.8%) on Reddit** — a third axis that is neither assembly nor quality but *persistence and adherence*. [measured]

One post carries the whole distinction (r/cursor, 2026-04-25, 22 pts, 20 comments): *"claude just rewrote a function we already had. it's like the 12th time this month… it never looked. it can't really look. it opens the file i'm in, maybe a couple of imports, and then just starts writing. a full-repo scan would blow the context window so it doesn't do one. i've been half-solving it by keeping a running 'things we have' list in CLAUDE.md but that goes stale within a week. the thing that actually worked was hooking up a little mcp tool that does a 'does something like this already exist' lookup — returns filepath + line number in like 50 tokens… the CLAUDE.md-as-function-registry approach feels like a losing battle."* [fetched] The document lost; the 50-token live query won.

And r/cursor, 2026-05-18, 56 comments: *"agent learns my codebase during a session, session ends, next session it's back to square one. Currently using CLAUDE.md but it goes stale and requires constant manual updates. Is anyone solving this systematically or are we all just living with it?"* [fetched]

For the founder's handoff question specifically, the closest real account is Solokit's Show HN (2025-11-12): *"After 6 months of using Claude Code for a production project, I hit a wall: AI assistants lose context between sessions. Every morning, I'd spend 20+ minutes explaining what we built yesterday, architectural decisions, and why certain patterns were chosen. Quality degraded over time… I was effectively doing manual 'handoffs' to my AI pair programmer."* [fetched] Note the shape: one person, consecutive days, handing off to the machine. That is the recurring account. Human-to-human accounts are 18 posts in 2,540.

**What people have built themselves**

**733 of 2,540 Reddit posts (28.9%) describe a home-made tool or workflow** — the largest single category in the corpus. On HN, 73 of 706 (10.3%). [measured] GitHub category census: "AGENTS.md generator" **53 repos** (top 122★); "session handoff agent context" **24 repos** (top 4★); "context engineering coding agent" **350 repos** (top 3,562★). [fetched]

Named competitors already shipping our exact thesis: **Lore — "Give your coding agent the decisions your team made"** (HN 2026-06-29, 47 pts, 54 comments; its founder describes "context-supply + post-edit enforcement" with the injected context landing "as a file in the PR diff"); **Compendium**, a shared human+agent workspace (2026-07-09, 3 pts); **OzBrain**, "a shared brain for knowledge between agents and your team" (2026-08-21, 92 pts); **Kanwas**, "shared context board for teams and agents" (57 pts); **Mdarena**, "benchmark your Claude.md against your own PRs" (22 pts); **config-drift-checker** (HN 2026-08-27), which writes eval cases from your existing CLAUDE.md and re-runs them on every Claude Code release. Lore and config-drift-checker matter most: both concluded that generating the document is the easy half and *enforcing or verifying* it is the product.

Background conditions, for calibration: METR's July 2025 RCT found experienced open-source developers **19% slower** with AI tools while believing they were 20% faster [fetched]. Stack Overflow's 2025 survey (n≈33,400) puts favourable sentiment at **60%, down from 70%+**, with **46% distrusting accuracy against 33% trusting**, and the top frustration at **66% "AI solutions that are almost right, but not quite"**, followed by **45.2% "debugging AI-generated code is more time-consuming"** [fetched]. "Almost right but not quite" is the market's own name for the failure our engine's refuse-don't-guess posture addresses — that is the strongest positive signal in this round, and it is about the *editing engine*, not about generated documents.

**WHAT THIS MEANS FOR THE PRODUCT**

- **Do not sell "we generate your handover / decision record / spec."** 373 Show HN launches, median 2 points; 24 handoff repos, top 4 stars; 0.7% of Reddit posts about a human picking up AI work; 81 handoff issues in 88,109. The artefact is not the wedge. Every founder in this space independently generated the same artefact and none of them got traction with it.

- **Build the enforcement and verification layer, not the authoring layer.** 34.1% of CLAUDE.md issues are loaded-but-ignored versus 5.5% never-loaded, and HANDBOOK.md puts frontier compliance at 36.2%. The defensible product is the thing that *checks whether the standing rules were actually followed* on this diff — a post-hoc conformance report, red on violation. That plays to our engine's actual strength: refusing rather than guessing, on the exact complaint 66% of developers name.

- **Ship a rules-file linter as the free wedge, and price the rest.** We can already measure what nobody else measures: 10.8% of repo-rooted path citations in live AGENTS.md files are dead, 24% of repos have at least one, and 30% of dual-file repos have two substantive files that disagree. A CI check that fails on a dead path, a diverged sibling file, or a rules file more than N days behind its code is small, verifiable, immediately useful, and gives us a top-of-funnel two people can ship.

- **Reshape the target from "team" to "one developer across twenty sessions."** 80% of handoff talk is agent-to-agent, 7% human-to-human. The buyer is a solo developer or a two-person team losing 20 minutes every morning re-explaining yesterday. That also fits ₹299 / ₹599 far better than a team seat does.

- **Kill any assumption that context assembly is the problem.** Assembly and quality complaints run 1.01 : 1, and both lose to persistence at roughly 2.6 : 1. Do not build a repo indexer or a context picker — that market has 350 repos and a 3,562-star incumbent.

- **Treat "AI-generated context files are net negative" as a hard product constraint.** If we generate documents, we must ship evidence they help, measured on the user's own repo. Mdarena and config-drift-checker already sell exactly that measurement. Absent it, the one study in the literature says our output is marginally worse than nothing.
