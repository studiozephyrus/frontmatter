## 99. The artefact factory — the documents the product makes, and the prompt it hands you

### 99.1 The claim

A team doing product development with AI produces the same five documents over and over, writes four of them badly, skips the fifth entirely, and then pastes a two-line request into Claude and is disappointed. The disappointment is not a model failure. It is a **context failure that the user has no tool for fixing**, because fixing it by hand means reading a repo they already can't hold in their head and pasting a selection they have no principled way to make.

frontmatter's bet: **the artefacts are generatable from the vault, and the last artefact in the chain is a prompt.** The editor writes the handover, the decision record and the spec from work that already happened in the files, and then assembles a **kickoff pack** — a self-contained, cited, deterministic context bundle the user pastes into whatever model they pay for. We sell the pack. The editor is how the pack gets good.

This repository is the worked example, and it is also the evidence *against* the soft version of the claim. Look at what disciplined founders who believe in these documents actually produced:

| Artefact | Count here | Evidence tag |
|---|---|---|
| Research reports | **176 files, 647,637 words** | [measured] `find docs/research -name '*.md' \| wc -l` |
| Handovers | **4** (`HANDOFF-*.md`, 5,587–7,492 words each) | [measured] |
| Specs | **4** contracts + schema + harness | [measured] `specs/` |
| **Decision records (ADR)** | **1** | [measured] `docs/adr/` |
| Decisions actually made and recorded in prose | **PRD §57 alone is a twenty-item corrections ledger** | [measured] |

One ADR. The people who wrote 647,637 words of research and a gate that refuses hand-written `state: verified` still wrote **one** decision record. That is the product. The demand is real, the discipline is not, and the gap is exactly what software fills.

---

### 99.2 The artefact catalogue — five ship, four are cut

Feature discipline applies hardest here, so each row names the person and the cadence. If I could not name both, I cut it.

| Artefact | Who writes it today | Why it is bad | What we generate | FROM | Who uses it, how often |
|---|---|---|---|---|---|
| **The map** (`MAP.md`) | Nobody. This is the missing one | It doesn't exist, so every AI session re-discovers the repo and half of them open a superseded file | A routing index: tier table, task→artifact routing, one-fact-one-home table, and an explicit **superseded, do not read** list | Directory walk + frontmatter (`updated:`, `state:`, `supersedes:`) + git log recency | Every person, every session. This repo's is **10,375 bytes** and it is Tier 0 [measured] |
| **The decision record** | Nobody, or a Slack thread | Written after the fact if at all; loses the *falsifier* and the rejected options, which are the only parts that stop a re-litigation | One file per decision: verdict, rejected alternatives, cost accepted, **what would change our mind** | Diff + PR discussion + the paragraph in the doc where the verdict was argued | Whoever is about to reopen a settled question. Realistically **2–6 per month** for a two-founder team |
| **The kickoff pack** | The user, in a chat box, badly | Vague ask, no constraints, no settled list, model invents a plausible wrong architecture | §99.3 | Map + the specs the task touches + the decision records that constrain it + the gate commands | The builder, **every non-trivial task** — the highest-frequency artefact by an order of magnitude |
| **The handover** | The person leaving, at the worst possible moment | Written under time pressure, from the live screen, so it misses everything that scrolled out of context | Chronological session record with live-state numbers and verified/unverified tags | Session transcripts, git range, the gate outputs | The next operator or the next model. **Rare, ~monthly, and catastrophic when absent** |
| **The spec** | An engineer, sometimes | Prose with no executable check; "invariants" that are wishes | `rule → failure mode → executable check`, three columns or the row is deleted; `state:` writable only by the harness | The defect, its red proof, the PRD section it implements | The implementer, **once per contract**, then read on every touch |

**Cut, and why.** *Changelog* — generated from commits, not from the vault; `git-cliff` and release-please already own it and are free. *Runbook* — real, but it recurs per incident class, not per week, and with one person on call the runbook is the on-call person. *Meeting note* — Granola, Fathom and Otter own the capture surface; we would be a worse recorder with no audio. *Standalone flow diagram* — a flow is only trustworthy as a **projection of a spec**, so it ships as mermaid inside artefacts 2 and 5, never as a thing you draw. This repo's §13 state machine and §62.2 loop are both projections of tables; that is the only form we ship.

That is five artefacts, not nine. Four cut.

---

### 99.3 The kickoff pack, in full

Real task, real repo, real files. This is what the user copies.

````text
# KICKOFF — auth lane: three identity paths to one, repo access onto a GitHub App
Generated by frontmatter from studiozephyrus/frontmatter @ 596cd42, 2026-08-31.
Pack = 6 sources, 25,308 bytes ≈ 6,327 tokens. Every line below is a byte range from a
file in this repo, cited by path. Nothing was summarised by a model.

## 1. Task
Collapse three live identity paths to one and move repo access from an OAuth App to a
GitHub App. Propose the change; do not commit it.

## 2. Read these, in this order. Read nothing else first.
| # | Path | Bytes | Why this one |
|---|---|---|---|
| 1 | AGENTS.md                       |  9,675 | The four rules that override everything, and the traps |
| 2 | docs/DEV-PLAN.md §6.1–6.11      | 12,873 | The auth lane itself: current state, stack, App, tokens, RLS |
| 3 | specs/SPECS.md                  |  2,760 | How a contract is written and who may write `state:` |
| 4 | docs/MAP.md → "Routing" row "auth" | (read the row) | Confirms §6 is the entry point |

## 3. Do not open. These will cost you the task.
| Path | Bytes | Why not |
|---|---|---|
| docs/FRONTMATTER-RECORD.md | 1,513,767 | ≈378k tokens. Superset of #2. Reading it to answer
|                            |           | an auth question is how a context window dies |
| docs/FRONTMATTER-PRD-2026-08-29.md | — | v1.1, SUPERSEDED by v2. It was true once |
| docs/FRONTMATTER-BUILD-PLAN-*.md, DECISIONS-*.md, MASTER-PLAN-*.md, PRODUCT-PLAN.md | — |
|                            |           | All superseded. MAP.md §Superseded is the list |

## 4. Settled. Do not reopen, do not offer alternatives, do not ask.
| # | Decision | Where it was decided | Cost we already accepted |
|---|---|---|---|
| 1 | GitHub App with installation tokens. NEVER the OAuth `repo` scope | DEV-PLAN §6.3 | The install screen converts worse than an OAuth consent, and org installs may need
|   |                                     |               | owner approval. One week of budgeted onboarding UX |
| 2 | next-auth v5 stays; upgrade `^5.0.0-beta.31` → `5.0.0-beta.32`   | DEV-PLAN §6.2 | Living on a beta. Escape hatch is WorkOS, a provider swap |
| 3 | Firebase Google auth is DELETED, all 8 sites listed in §6.1      | DEV-PLAN §6.1 | Any existing Firebase-only user must be migrated, not dropped |
| 4 | Credentials provider `sgnk-password` is DELETED before the first
|   | external user; replaced by a flag-gated magic-link break-glass   | DEV-PLAN §6.1 | Break-glass is off by default and needs an env var to arm |
| 5 | `request_oauth_on_install: false` — identity first, installation
|   | second, so a `user_id` always exists to attach the install to    | DEV-PLAN §6.3 | Two screens instead of one |
| 6 | Installation token TTL 1h (LRU, 50min); user token 8h, refresh
|   | on 401 or at 7h                                                  | DEV-PLAN §6.5 | A refresh path we must actually test |
| 7 | One Postgres control plane holding ZERO document bytes           | PRD, settled  | Search over content is harder |
| 8 | Documents live in the user's git repo and never move             | PRD §5        | We cannot "just query" a user's files |

## 5. Refuse rather than guess. These are terminal states, not errors.
- If a session-shape change would let a Firebase `uid` and a next-auth `sub` both satisfy
  "the principal", REFUSE and say so. Accepting their union is accepting three issuers.
- If you cannot determine whether a token is a user token or an installation token at a
  call site, REFUSE. Do not infer from the variable name.
- If a migration would orphan an existing identity, REFUSE and propose the migration
  separately. `AGENTS.md §8`: several persistence keys keep the legacy `sgnk-md` prefix ON
  PURPOSE; renaming any of them silently orphans a user's drafts.
- Returning "no change, here is why" is a correct outcome.

## 6. Done means these exit 0. Nothing else counts as done.
    npm run typecheck && npm run lint && npm run test && npm run build && npm run arch
    npm run spec           # contract gate — 0 errors
    node specs/harness/spec-report.mjs --id <new spec id>
A red proof must exist and must FAIL against the unfixed code before it may certify
anything (AGENTS.md §0.1). You may not hand-write `state: verified`; only the harness
writes it (specs/_schema/states.md).

## 7. Traps here, measured, that you will otherwise hit
- Vercel typechecks stricter than local: `exactOptionalPropertyTypes` is on in production
  tsconfig. Declare `?: T | undefined`, not bare `?: T`. (AGENTS.md §5)
- `process.env` may be read ONLY in `src/config/` and `*/infrastructure/`. Never in
  domain, application or presentation. (AGENTS.md §6)
- Cross-module imports go through `@/modules/<name>`, never a deep path, even for types.
  `@/server/*`, `@/lib/*`, `@/components/*` are eslint-banned. (AGENTS.md §2)
- `/api/auth/**` is never intercepted by the proxy. (DEV-PLAN §API)

## 8. Output shape
A proposal: a diff, the new spec file, and the red proof. Do NOT commit. The founder
merges. If you commit anyway, say so in your final message — `git rev-parse HEAD` is
captured before and after this run and the delta is reconciled. (AGENTS.md §0 rule 4)

## 9. If a settled item genuinely blocks the task
Stop. Name the item by its row number in §4, state what it blocks, and return. Do not
route around it.
````

---

### 99.4 Anatomy — why each part is there

| Part | What it buys | Grounding |
|---|---|---|
| §2 read-order with byte counts | The model spends its attention budget where the answer is | Liu et al. 2023 [fetched] |
| **§3 do-not-open** | The single most valuable section, and the one no human writes. Five superseded files here will each give a confidently wrong answer | Shi et al. 2023 [fetched] |
| §4 settled table with **cost accepted** | Kills re-litigation. A model told "use a GitHub App" argues; a model told "and here is the week of conversion loss we already accepted" does not | This repo's §57 ledger |
| §5 refusal list | Converts the engine's law into the prompt's law: locate, replace, refuse | PRD §5 |
| §6 gate commands | A rules-based verifier, the cheapest one that applies | Learned Rule #25 |
| §7 traps | Each line is a bug that has already been paid for once | AGENTS.md §5, §6, §9 |
| §8 output shape | Agents propose, the founder merges | AGENTS.md §0 rule 4 |
| Provenance header | Commit-pinned, so a stale pack is detectable on sight | LR#69 |

The pack is **6,327 tokens** against **439,658 tokens** for a naive "here's the docs folder" paste — a **69.5×** reduction [derived: (244,864 + 1,513,767) ÷ 4 = 439,658; 25,308 ÷ 4 = 6,327; 439,658 ÷ 6,327 = 69.5]. The naive paste also does not fit in a 200k window, so it is not merely expensive, it is impossible.

---

### 99.5 Why a generated pack beats a human paste

Six primary sources, opened here today.

| Finding | Number | Source |
|---|---|---|
| Accuracy depends on **where** in the context the answer sits; highest at the ends, degrading in the middle, "even for explicitly long-context models" | — | Liu et al., *Lost in the Middle*, arXiv **2307.03172v3**, TACL [fetched] |
| Irrelevant context in the prompt "dramatically" decreases accuracy — on grade-school arithmetic, where the model plainly has the capability | — | Shi et al., *LLMs Can Be Easily Distracted by Irrelevant Context*, arXiv **2302.00093v3**, ICML 2023 [fetched] |
| At 32K tokens, **11 of 13** models claiming ≥128K drop below **50%** of their own short-context baseline. GPT-4o: **99.3% → 69.7%** | 11/13 | Modarressi et al., *NoLiMa*, arXiv **2502.05167v3**, ICML 2025 [fetched] |
| Across 17 leading models, "the effective context limit is significantly shorter than the supported context length" | 17 models | Roberts et al., *Needle Threading*, arXiv **2411.05000v2**, ICLR 2025 [fetched] |
| Long-context models show a **bias toward material presented later** in the sequence | — | Li et al., *LongICLBench*, arXiv **2404.02060v3** [fetched] |
| **Multi-turn conversation costs an average 39% drop** across six generation tasks vs the same task fully specified in one turn. "When LLMs take a wrong turn in a conversation, they get lost and do not recover" | −39%, 200,000+ simulated conversations | Laban et al., arXiv **2505.06120v1** [fetched] |
| Vendor's own guidance: keep CLAUDE.md **under 200 lines**; "longer files consume more context and reduce adherence" | 200 lines | docs.claude.com/en/docs/claude-code/memory [fetched 2026-08-31] |

Read together they say something narrower and more useful than "context is limited". They say: **a long single-turn, fully-specified, curated prompt beats both a big dump and a conversation.** Laban is the load-bearing one — it is not about length at all, it is about the user discovering their constraints turn by turn while the model has already committed to a wrong assumption. The kickoff pack exists to make the first turn the fully-specified turn.

And the strongest argument is the one no paper covers: **§4 of the pack is information the model cannot derive from any amount of context.** "We rejected the OAuth `repo` scope and accepted a week of conversion loss" is not in the code. It is not in the diff. It happened in a conversation. No context window solves that; only a record does.

---

### 99.6 The conventions we must interoperate with, not compete with

All four opened 2026-08-31.

| Convention | State, as read today | What we do | What we never do |
|---|---|---|---|
| **AGENTS.md** | "used by over 60k open-source projects"; stewarded by the **Agentic AI Foundation under the Linux Foundation**; supported by Codex, Cursor, Jules, Devin, Copilot coding agent, Gemini CLI, Zed, Aider, Amp, Windsurf and more; nested files, **closest wins**, "explicit user chat prompts override everything"; plain markdown, no required fields [fetched, agents.md, HTTP 200] | **Write here.** This is the root file the factory maintains | Invent a `frontmatter.md` |
| **CLAUDE.md** | Load order managed-policy → `~/.claude/CLAUDE.md` → `./CLAUDE.md` → `./CLAUDE.local.md`; `@path` imports, max 4 hops; `.claude/rules/` for path-scoped rules; auto memory loads the **first 200 lines or 25KB**; "target under 200 lines" [fetched] | Emit a ≤200-line CLAUDE.md as a **projection** of AGENTS.md, with `@` imports to the specs | Duplicate content between the two — that violates our own one-fact-one-home law |
| **Cursor rules** | `.cursor/rules/*.mdc` with frontmatter `description` / `globs` / `alwaysApply`; a plain `.md` in that folder is **ignored** ("If you prefer plain markdown, use AGENTS.md instead"); cap 500 lines; four apply-modes [fetched, cursor.com/docs/context/rules]. I grepped the live page for `.cursorrules` and got **zero hits** [measured] — the single-file form is no longer documented; do not emit it | Emit `.mdc` files with correct frontmatter, `globs` derived from the spec's `governs:` field | Emit `.cursorrules` |
| **MCP** | Spec revision **2026-07-28**; JSON-RPC 2.0; hosts / clients / servers; servers expose **resources, tools and prompts** [fetched, modelcontextprotocol.io/specification/latest] | Ship a small MCP server: pack files as **resources**, the kickoff pack as a **prompt**. That is the standard slot for exactly this object | Build a proprietary plugin per editor |

**The rule that falls out: frontmatter introduces zero new file formats.** Its output is AGENTS.md (the one with 60k projects behind it), projections of it into CLAUDE.md and `.mdc`, and an MCP prompt. The `governs:` glob in a spec is already the `globs:` field in an `.mdc` — the mapping is mechanical.

---

### 99.7 The measurable claim, and the experiment that could refute it

Without this the section is marketing.

**H1.** For a task drawn from a real repo, a pack-primed single-turn prompt produces a diff that passes the repo's own gates more often than the user's own hand-written prompt, same model, same task.
**H2.** The pack arm re-litigates settled decisions less often. *This is the differentiating claim*, because H1 could in principle be won by any prompt-shortening trick.

| Element | Design |
|---|---|
| Design | Paired, within-task. **Arm A**: the user's own prompt, captured before they see the pack. **Arm B**: the pack. Same model, same temperature, **3 runs per cell** (one run is an anecdote — LR#63) |
| Tasks | 52 per arm, drawn from closed issues in 4 repos of different sizes, each with an existing test that the fix must turn green |
| **Primary outcome (binary)** | Does the produced diff make the task's red proof pass **and** `npm run verify` exit 0? Binary pass/fail with a critique field. **Never Likert** (LR#4). Rules-based verifier, no judge (LR#25) |
| **Secondary (the real one)** | **Settled-decision violation count**: a pre-registered per-repo list (here: CRDT for document bytes, OAuth `repo` scope, client-side code execution, hand-written `state: verified`, renaming a `sgnk-md` key). Grep-countable, no model in the loop |
| Tertiary | Turns to done, input tokens to done, USD to done |
| Pre-registration | The violation list and the pass criteria are frozen and committed **before** the first run. Otherwise we will discover the metric we won |
| Cost | Arm A 156 runs × 40k in / 8k out; Arm B 156 × 12k / 8k. Sonnet 5 at **$2 / $10 per MTok** [fetched, docs.claude.com/pricing, 2026-08-31]. A = 6.24M×$2 + 1.248M×$10 = **$24.96**; B = 1.872M×$2 + 1.248M×$10 = **$16.22**. **Total ≈ $41.18** [derived] |
| **Falsifier** | If pack-arm pass rate is not **≥15 points** above paste-arm (n=52/arm gives 80% power to detect 0.55→0.80 at α=0.05 [derived: n = (1.96+0.84)²(0.55·0.45+0.80·0.20)/0.25² = 51.1 → 52]), **or** if settled-violations are not lower, then the factory is a writing tool, not an AI tool. Price it as one and stop claiming the second thing |

Every number in this experiment is currently a **prediction**, not a result. Nothing has been run.

---

### 99.8 The economics, and the part that makes this affordable

The load-bearing fact: **assembling a kickoff pack is a build step, not an inference step.** This repo's `npm run tree`, `npm run doc` and `npm run record` are node scripts with zero model calls [measured]. The map, the read-order, the do-not-open list, the settled table, the gate commands and the traps are all *selections over files*, and selection is deterministic.

| Operation | Model calls | Cost |
|---|---|---|
| Kickoff pack assembly | **0** | **$0** — free tier gets it unlimited |
| Decision record draft from a diff | 1, Haiku 4.5 ($1/$2 per MTok [fetched]) | ~12k in + 1.5k out = **$0.015** [derived] |
| Handover from a session | 1, Sonnet 5 | ~60k in + 6k out = $0.12 + $0.06 = **$0.18** [derived] |
| Spec draft from a defect | 1, Sonnet 5 | ~20k in + 3k out = **$0.07** [derived] |

At 100 users × 4 drafted artefacts/month: 400 × ~$0.09 avg = **$36/month** [derived]. At 10,000 users, **$3,600/month** — which is why the paid tiers meter *drafting* and never meter *packs*. With prompt caching (cache read $0.20/MTok for Sonnet 5 [fetched]) the repeated-pack case drops another order of magnitude, but that only matters for the team lane where we hold the key.

---

### 99.9 Recommendation, and the case against it

**Recommendation: make the artefact factory the product, and ship exactly three artefacts in v1 — the map, the decision record, and the kickoff pack. Make the pack deterministic and free. Write only into AGENTS.md and project it into the others. Ship the MCP prompt. Run the §99.7 experiment before writing a single line of marketing copy.**

Handover and spec are v1.1 — they are real, but the map and the decision record are what make the pack good, and the pack is what the user pays for.

**Anti-recommendations, explicitly:** no prompt library, no template gallery, no "AI writes your docs" button, and no settings page listing artefact types. Every one of those is a second source of truth, which the projection law forbids.

**The strongest argument against.** The pack's quality is a function of what is already in the vault, and a new user's vault is empty. Arm B of the experiment will be run on *this* repo — a repo with 176 research reports, a superseded list, and a settled-decisions table that took twelve rounds to produce. A user on day one has none of that, so their first pack degrades to a file listing plus `npm test`, which is worth roughly nothing, and they churn before the vault is worth packing. **The value is back-loaded past the churn point.** That is a real structural problem and the honest mitigation is narrow: the map and the do-not-open list are derivable from a *cold* repo on day one (directory walk, frontmatter dates, git recency — no history required), and they are already most of the token saving. The settled table, which is the part no context window can substitute for, is the part that has to be earned.

The second argument against is that we may be selling a workaround for a temporary defect: every model release claims better long-context handling. The rebuttal is dated — NoLiMa (ICML 2025) and Laban et al. (2025) both post-date the 128K–1M context claims and both measure the degradation persisting — but it is a rebuttal with a shelf life, and we should re-run the §99.7 experiment on every major model release rather than cite a 2023 paper in 2027.
