I did not mutate or commit anything in `~/.claude`, `~/.sgnk`, or this repo — read-only throughout; the only artifact I created was one transient temp file, `$TMPDIR/devin.md`, disclosed in the method section below.

### Method + reachability

- `WebFetch` refused by the local gate; `curl` unblocked. Probed 11 vendor hosts, all HTTP 200 — kiro.dev, docs.cursor.com, agents.md, docs.devin.ai, docs.factory.ai, docs.cline.bot, docs.roocode.com, tessl.io, docs.tessl.io, docs.claude.com, code.visualstudio.com `[measured]`.
- Unauthenticated api.github.com hit 403 rate-limit (60/hr, 0 remaining); `gh` CLI failed TLS (`x509: OSStatus -26276`); `source ~/.config/codex-env/tokens.zsh` refused by sandbox — but `$GH_TOKEN` was already in the shell env, giving 5000/hr `[measured]`.
- Blocked/degraded: docs.cursor.com serves a client-rendered SPA; `/llms.txt` returns the same 45,106-byte HTML shell, and `.md` twins return chrome. Cursor rule *mechanics* below are therefore `[SS]`/`[measured]` from code-search, not from an opened Cursor doc page. docs.roocode.com `/llms.txt` = 404.
- Read-only honoured: no repo file touched, no git command run, no install executed. One transient artifact written — `$TMPDIR/devin.md` (31,059 B, the Devin docs index) — disclosed rather than hidden.
- **Untrusted content flag:** fetched vendor docs contain executable install lines (e.g. Tessl's `curl … | sh`). Not executed, not acted on. An injection-scan hook fired 7× this session on fetched page bodies; all instances are documentation text, none were followed.
- Kiro/Cursor/Devin/Factory doc pages are marketing-adjacent primary sources; treated as vendor claims, tagged `[fetched]` (opened), never `[measured]`.

### Census — GitHub, 2026-08-28 UTC

| Repo | Stars | Forks | Licence | Created | Last push | State |
|---|---|---|---|---|---|---|
| anthropics/claude-code | 143,296 | 22,918 | none declared | 2025-02-22 | 2026-08-28 | live |
| github/spec-kit | 132,035 | 11,865 | MIT | 2025-08-21 | 2026-08-28 | live |
| cline/cline | 67,077 | 7,241 | Apache-2.0 | 2024-07-06 | 2026-08-28 | live |
| Fission-AI/OpenSpec | 66,571 | 4,583 | MIT | 2025-08-05 | 2026-08-28 | live |
| gsd-build/get-shit-done | 64,629 | — | MIT | 2025-12-14 | 2026-05-31 | **dead redirect** |
| bmad-code-org/BMAD-METHOD | 52,419 | 5,964 | NOASSERTION (npm says MIT) | 2025-04-13 | 2026-08-28 | live |
| continuedev/continue | 35,666 | 5,295 | Apache-2.0 | 2023-05-24 | 2026-08-28 | live |
| cursor/cursor | 33,190 | 2,287 | none | 2023-03-12 | 2026-05-12 | issue tracker |
| Kilo-Org/kilocode | 27,054 | 3,096 | MIT | 2025-03-10 | 2026-08-28 | live |
| RooCodeInc/Roo-Code | 24,322 | 3,415 | Apache-2.0 | 2024-10-31 | 2026-05-15 | **ARCHIVED** |
| agentsmd/agents.md | 23,968 | 1,813 | MIT | 2025-08-19 | 2026-08-25 | live (moved off `openai/`) |
| open-gsd/gsd-core | 8,849 | — | MIT | — | — | live successor |
| buildermethods/agent-os | 5,343 | 831 | MIT | 2025-07-16 | 2026-05-05 | quiet 3.8 mo |
| kirodotdev/Kiro | 4,231 | 310 | **none** (proprietary AWS) | 2025-06-17 | 2026-08-27 | issue tracker |
| gemini-cli-extensions/conductor | 3,713 | — | Apache-2.0 | 2025-12-17 | 2026-08-11 | live |
| gotalab/cc-sdd | 3,644 | — | MIT | 2025-07-17 | 2026-05-20 | live |
| Priivacy-ai/spec-kitty | 1,572 | — | MIT | 2025-10-09 | 2026-08-28 | live |
| tesslio/cli | 71 | — | — | — | — | live |
| tesslio/spec-driven-development-tile | 53 | — | — | — | — | live |

All `[measured]` via api.github.com. **Disagreement recorded:** repos endpoint gives OpenSpec 66,571; the search endpoint, same minute, gives 66,570. Off by 1; both recorded.

### Distribution — npm / PyPI / marketplace

| Package | Last week (2026-08-21→27) | Last month (2026-07-29→08-27) | Latest | Licence field |
|---|---|---|---|---|
| `@fission-ai/openspec` | **464,621** | 1,645,308 | 1.11.0 | MIT |
| `bmad-method` | 16,941 | 81,735 | 6.11.0 | MIT |
| `@tessl/cli` | 6,034 | 19,794 | 0.102.0 | `SEE LICENSE.md` (not OSS-declared) |
| `specify-cli` (PyPI) | n/a | n/a | 1.0.1, 56 releases | `null` |

`[measured]`, api.npmjs.org + pypi.org. `openspec` on npm is a 2019 squat at `0.0.0` — not this project.

- `[derived]` OpenSpec ÷ BMAD weekly = 464,621 ÷ 16,941 = **27.43×**.
- `[derived]` OpenSpec ÷ Tessl weekly = 464,621 ÷ 6,034 = **77.00×**.
- `[derived]` OpenSpec stars ÷ tesslio/cli stars = 66,571 ÷ 71 = **937.6×**.
- VS Code installs `[measured]`, gallery API: GitHub.copilot 74,459,915 · cline 5,131,205 · roo-cline 1,961,704 (`lastUpdated` 2026-05-15 — identical to its GitHub archive date) · Kilo-Code 1,473,000.

### Convention adoption — GitHub code search, 2026-08-28

| Convention | Indexed files |
|---|---|
| `CLAUDE.md` | 774,144 |
| `AGENTS.md` (repo root) | 460,800 |
| `.cursor/rules/**.mdc` | 186,112 |
| `.github/copilot-instructions.md` | 146,944 |
| `openspec/specs/**/spec.md` | 117,504 |
| `GEMINI.md` | 65,152 |
| `.kiro/specs/**/requirements.md` | 33,728 |
| `.specify/memory/constitution.md` | 11,264 |
| `memory-bank/activeContext.md` | 2,728 |

`[measured]`, caveat: code search indexes a subset of public repos and reports approximate totals. A ninth query (`filename:spec.md`, 991,232) was discarded as contaminated by unrelated `*.spec.md` test files.

- **Disagreement recorded:** agents.md the site claims "over 60k open-source projects" `[fetched]`; code search returns 460,800 root `AGENTS.md` files `[measured]`. Different units (projects vs files) and different indexes; both stand.
- `[derived]` spec-kit constitutions ÷ spec-kit stars = 11,264 ÷ 132,035 = **8.53%**. A proxy, not a conversion rate — stars ≠ users, one constitution per repo, partial index.
- `[derived]` Kiro requirements files ÷ spec-kit constitutions = 33,728 ÷ 11,264 = **2.994×**. Kiro's convention is per-feature, spec-kit's is per-repo, so this compares artifact densities, not user counts.

### Independent census — SPECMINE (arXiv 2608.25202, 2026-08-25) `[fetched]`

- 470,795 `spec.md`/`specs.md` files across **73,030 repositories**, attributed to **17 named tools**.
- Separate Kiro census: 98,574 files across 12,910 repositories.
- PR sweep over 11 tools' ≥10-star repos: **5,992 PRs across 581 repositories** where a spec and its implementation change in one PR.
- 2,421,323 typed references indexed: 1.28M → code files, 863k → sibling documents, 152k → PRs, 62k refs, 43k branches, 22k issues.
- `[derived]` 470,795 ÷ 73,030 = **6.45 spec files/repo**; 98,574 ÷ 12,910 = **7.64 Kiro files/repo**.
- `[derived]` 581 ÷ 73,030 = **0.80%** — a **lower bound only**, because the PR sweep was restricted to 11 tools' ≥10-star repos, not the full census. Do not quote it as a co-change rate.

### Per-tool: artifact, location, verification

| Tool | Artifact produced | Location convention | Markdown? | Machine-verified vs code? |
|---|---|---|---|---|
| **GitHub Spec Kit** | `spec.md` → `plan.md` → `tasks.md`, plus `constitution.md`; 37 agent integrations `[measured]` | `.specify/memory/constitution.md`, `templates/*-template.md` | Yes, with a `Given/When/Then` + P1/P2/P3 priority scaffold `[fetched]` | **No.** `/analyze` = LLM cross-artifact consistency over spec↔plan↔tasks↔constitution, six detection passes, severities up to CRITICAL. `/converge` reads the codebase and *appends missing work as tasks*. Neither executes the code `[fetched]` |
| **AWS Kiro** | `requirements.md` (EARS) / `bugfix.md`, `design.md`, `tasks.md` | `.kiro/specs/<feature>/`, steering at `.kiro/steering/` + `~/.kiro/steering/`, MDM-pushable for teams | Yes | **Partially — the only real one.** Kiro extracts properties from EARS requirements, generates property-based tests, runs them against the implementation, and links a failure back to the originating requirement and task. Vendor's own limits: "evidence of correctness, not a proof… not formal verification." IDE-only per its own capability matrix (CLI/Web/Mobile: —) `[fetched]` |
| **Tessl** | **No longer a spec product.** Now registry + package manager for skills/plugins, Snyk-scored governance, RBAC, evals, code review | `.tessl-plugin/plugin.json`, `SKILL.md` | Yes (skills) | **N/A.** `tessl` CLI reference contains no spec/build/compile command `[fetched]`. The residual `tessl-labs/spec-driven-development` tile writes `.spec.md` into `specs/`; its `spec-verification` is an LLM prompt `[fetched]` |
| **OpenSpec** | `proposal.md`, `design.md`, `tasks.md`, delta specs; merged into durable `specs/<domain>/spec.md`; 36 tool integrations `[measured]` | `openspec/specs/` (truth) + `openspec/changes/` (proposals); `.openspec.yaml` | Yes — `## Requirements` / `### Requirement:` / `#### Scenario:` with RFC-2119 keywords | **No against code.** `openspec validate [--strict] [--all --json]` checks *document* structure + delta-vs-main coherence; `--archived` exits non-zero if any archived `tasks.md` checkbox is unticked — a genuine CI gate, on the markdown. `/opsx:verify` (completeness/correctness/coherence) is LLM-judged and **explicitly does not block archive** `[fetched]` |
| **BMAD-METHOD** | Briefs, PRD, architecture, stories via agent personas; `npx bmad-method install` | installer-written per-tool dirs; `.claude-plugin/marketplace.json` present | Yes | **No** `[fetched]` |
| **agent-os** | `plan.md`, `shape.md`, `standards.md`, `references.md` | `agent-os/specs/{YYYY-MM-DD-HHMM-feature-slug}/`; standards at `agent-os/standards/index.yml`; product at `agent-os/product/` | Yes | **No** `[fetched]` |
| **Cursor rules** | Instruction files, not specs | `.cursor/rules/*.mdc` (186,112 indexed) | Markdown + frontmatter | **No** `[measured]` count; mechanics `[SS]` — docs unreadable via curl |
| **AGENTS.md** | Instruction file — setup, test, style, PR conventions | repo root (+ subfolders, experimental in VS Code) | Yes | **No.** It is a README for agents, not a behaviour contract `[fetched]` |
| **Claude Code** | **No persisted spec artifact.** `plan` is a *permission mode* in the `Shift+Tab` cycle; picking Plan applies to the current session only. Durable context = `CLAUDE.md`, `.claude/rules/*.md` with `paths:` glob frontmatter, auto memory, `.claude/agent-memory/` | repo root `CLAUDE.md` or `.claude/CLAUDE.md` | Yes | **No.** Vendor states memory is "context, not enforced configuration"; enforcement is hooks/permissions `[fetched]` |
| **Devin** | `AGENTS.md` + org-level Knowledge + Playbooks + DeepWiki | repo root; Knowledge in the web app, not the repo | Yes | **No** `[fetched]` |
| **Factory** | Spec Mode = read-only investigation then `ExitSpecMode` approval gate; Normal/Spec/Mission modes × Off/Low/Medium/High autonomy | ephemeral session state; `--use-spec`, `Shift+Tab` | Plan text | **No** `[fetched]` |
| **Cline Memory Bank** | 6 files: `projectbrief`, `productContext`, `activeContext`, `systemPatterns`, `techContext`, `progress` | `memory-bank/` (2,728 indexed), bootstrapped from `.clinerules/memory-bank.md` | Yes | **No** — a prompt methodology with no CLI `[fetched]` |
| **Roo Code** | Modes + memory bank, fork lineage of Cline | `.roo/` | Yes | **No.** Repo **archived**, last push 2026-05-15, marketplace `lastUpdated` the same day, on 1,961,704 installs `[measured]` |
| **GitHub Copilot / VS Code** | Always-on `.github/copilot-instructions.md`, `AGENTS.md`, `CLAUDE.md`; file-scoped `*.instructions.md` with globs; org-level instructions | workspace + user profile | Yes | **No** `[fetched]` |

### (1) The shape of the category — what all of them do the same way

- **Markdown is unanimous.** Every artifact in every tool above is a `.md` file. Zero use a formal or binary spec language `[measured across 14 tools]`.
- **Three-artifact skeleton.** `requirements/spec → design/plan → tasks`. Kiro, spec-kit, OpenSpec, agent-os, BMAD all land on it independently `[fetched]`.
- **A hidden dot-directory keyed to one vendor.** `.specify/`, `.kiro/`, `openspec/`, `agent-os/`, `.cursor/`, `.claude/`, `memory-bank/`. The convention *is* the lock-in; the fan-out response is an install matrix (spec-kit 37 agents, OpenSpec 36 tools `[measured]`) rather than a shared location.
- **Given/When/Then + RFC-2119 as the shared dialect.** OpenSpec `### Requirement:`/`#### Scenario:` with SHALL/MUST; Kiro EARS; spec-kit `**Given**/**When**/**Then**` `[fetched]`.
- **Human approval is the gate, not a machine.** Kiro three-phase approvals, Factory `ExitSpecMode`, Tessl tile "wait for your approval", Claude Code plan-mode approval `[fetched]`.
- **Checkbox `tasks.md` is the universal progress ledger** — and the only thing anyone machine-checks (`openspec validate --archived`) `[fetched]`.
- **Two shipping shapes only:** a CLI that scaffolds prompt files into N agents' directories (spec-kit, OpenSpec, BMAD, agent-os, Tessl tile), or an IDE/agent mode (Kiro, Factory, Claude Code, Cursor).
- **Zero editing surface.** Not one tool ships a way to *read or edit* the spec other than a plain text editor.

### (2) What NONE of them do — the gap

- **No stable identity for a requirement.** No tool assigns a durable ID that survives editing the markdown. spec-kit's `/analyze` maps tasks to requirements by "inference by keyword / explicit reference patterns" `[fetched]` — i.e. by grep, because there is nothing better.
- **No machine binding from a requirement to a code range.** SPECMINE had to *reconstruct* the link from 2.42M typed references and 5,992 co-change PRs because the artifacts do not carry it `[fetched]`.
- **The cost of that gap is measured.** arXiv 2606.30689 `[fetched]`: only the per-line-citation condition (`traceSDD`, hierarchical `REQ-XXX.Y.Z` IDs) enables automated hallucination detection — **TDR 86.4% (Claude Sonnet 4.6) / 88.0% (GLM-5-turbo), vs 0% for Spec Kit, OpenSpec, and the uncited baseline, FPR 0% in both studies**. The same paper measures the price: citation *reduces* output determinism (Claude d=−0.76, p=0.003; GLM d=−0.72, p<0.001).
- **No drift detection.** Nothing tells you a spec went stale when code changed. `/opsx:verify` and `/converge` re-derive the answer with an LLM on demand, non-blocking, no exit code `[fetched]`.
- **No verification that survives the editor.** Kiro's PBT loop is the sole exception and is IDE-exclusive by its own matrix.
- **No cross-tool spec portability.** 17 named tools in SPECMINE, no shared schema. `openspec schema` is per-project custom, not an interchange format `[fetched]`.
- **No review surface.** No suggestion mode, no per-requirement comment thread, no provenance for which agent wrote which requirement.
- **No visible rendering.** Requirement→scenario→task→code is a graph shipped as flat text.

### (3) Is a markdown editor a credible home?

**Arguments it is** `[inference` on `measured` inputs`]`:
- The artifact is 100% markdown in 100% of tools. Whoever owns markdown editing already owns the file type.
- The IDE has *conceded* the artifact: Claude Code makes plan a session mode with no file; Factory Spec Mode is ephemeral; Cursor ships rules, not specs. The persisted artifact is deliberately left to a CLI that writes text and walks away.
- Nobody occupies the middle. Every tool writes markdown and none reads it back as anything but a prompt.
- 3 of 14 conventions are already legible to any editor without integration: `AGENTS.md` 460,800, `openspec/**/spec.md` 117,504, `.kiro/specs/**/requirements.md` 33,728 `[measured]`.

**Arguments the IDE owns it**:
- Verification lives where the code and the test runner live. Kiro's PBT loop needs to *run tests*; that is an IDE/CLI capability, and it is the only differentiated capability in the category.
- Approval gates are conversational and belong in the agent loop, not a document.
- Spec-kit's install matrix (37 agents) shows distribution flows through the coding agent, not the editor.

**Verdict:** the editor is credible for **authoring, review, rendering, and drift display**; the IDE/CLI owns **execution and verification**. The category currently has no owner for the first half and one weak owner (Kiro, IDE-only) for the second. `[inference]`

### (4) Should frontmatter enter — honest verdict

**Enter as a viewer/reviewer/renderer of specs that already exist. Do not enter as tool #18.**

Do:
- **Read the conventions, invent none.** Ship first-class rendering for `openspec/specs/**/spec.md`, `.kiro/specs/*/{requirements,design,tasks}.md`, `.specify/`, `AGENTS.md`, `agent-os/specs/`. `[derived]` 460,800 + 117,504 = 578,304; + 33,728 = 612,032; + 11,264 = **623,296** indexed files across those four conventions alone.
- **Ship requirement-level anchors as the wedge.** frontmatter's existing content-derived anchors (99.627% resolve / 0.050% false over 41,642 block-versions, internal `[measured]`) are exactly the missing `REQ-XXX.Y.Z`-with-durability that arXiv 2606.30689 shows is worth 86.4–88.0% TDR versus 0%. Anchor a `#### Scenario:` to a code range; the anchor survives edits that break a line-number citation.
- **Render the graph:** requirement → scenario → task checkbox → code reference → PR. SPECMINE proves the reference data exists (2.42M typed refs) and that no tool surfaces it.
- **Show drift, do not judge it.** Anchor resolution failure = a deterministic staleness signal, no LLM, no false-confidence.
- **Ship review on the spec.** Per-requirement comments that commit to the file. That is frontmatter's stated unclaimed position and the category's stated absence, and they are the same absence.
- **Sell to the OpenSpec/Kiro user, not against them.** OpenSpec at 464,621 weekly npm downloads is the distribution channel, not the competitor.

Do NOT:
- **Do not define a new spec format or a new directory.** Master-plan verdict already settled: no new format. A `.frontmatter/specs/` would be convention #18 in a field that has 17 and no interchange standard.
- **Do not build an approval workflow.** Kiro, Factory, Claude Code and the Tessl tile all own the approval gate inside the agent loop; an editor cannot intercept it.
- **Do not run or generate tests.** Kiro's PBT loop needs the IDE, the runner, and AWS's model budget. Losing to it is guaranteed.
- **Do not quote spec-kit's 132,035 stars as market size.** 11,264 indexed constitutions = 8.53% `[derived]`; and 64,629 of the category's stars belong to `get-shit-done`, whose README is now a redirect stub `[measured]`.
- **Do not treat a 2,728-file convention (`memory-bank/`) as a target.** Ship it as a renderer freebie, not a roadmap item.
- **Do not build spec↔code semantic verification.** The evidence says LLM verification is what everyone already has and none of it blocks. Ship the *binding*; leave the *judgement* to the agent.

**The strongest argument against entering at all:**

The category has no retention evidence, and three of its biggest names have already left. Tessl — the best-funded pure-play, the company that coined the spec-as-source-of-truth pitch — has pivoted its entire CLI to a skills registry with governance and evals; its current CLI reference contains **no spec command at all**, and its GitHub CLI repo sits at **71 stars against OpenSpec's 66,571, a 937.6× gap** `[measured]`. Roo Code is **archived** on 1,961,704 installs `[measured]`. `get-shit-done` accumulated 64,629 stars and became a redirect `[measured]`. SPECMINE, the only independent census, observes spec-and-code co-changing in one PR in just **581 repositories** — against a 73,030-repo census `[fetched]` — which is consistent with specs being generated once and abandoned. Every artifact frontmatter would render is written by a CLI that costs nothing, is MIT-licensed, and installs into 36–37 agents in one command; willingness-to-pay is unproven precisely because the incumbent price is zero. And frontmatter's actual moat — byte-exact splice over 8,866 foreign multi-author files, the degradation certificate, the machine-view differ — is a *fidelity* moat, and nothing in this category has ever been observed to churn over fidelity. The honest counter-case is that spec-driven development is a 12-month prompt-scaffolding fashion whose artifacts are write-once, and that building a renderer for write-once files is building a museum. `[inference` on `measured`/`fetched` inputs`]`

**Resolution:** enter narrowly and cheaply — as rendering + anchors + review on files other tools already write — and gate any further investment on one measurement frontmatter can take itself: on a real corpus of `openspec/` and `.kiro/specs/` repos, what fraction of specs are edited more than once after creation. If that number is low, the museum argument wins and the correct move is to ship the renderer as a feature of frontmatter and never as a product.