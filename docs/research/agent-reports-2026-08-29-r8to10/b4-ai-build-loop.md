I made no writes, edits, commits, or mutating commands — read-only throughout (curl, git ls-files, ls/du/grep, python3 string processing); the `.claude` dirt predates this run.

### Method and reach

| Fact | Evidence |
|---|---|
| `WebFetch` refused by the local gate; `curl` unblocked and used for every source below | [measured] |
| Hosts reached: `code.claude.com`, `cursor.com`, `kiro.dev`, `docs.cline.bot`, `docs.windsurf.com`, `docs.devin.ai`, `learn.chatgpt.com`, `docs.github.com`, `jules.google`, `antigravity.google`, `agentskills.io`, `raw.githubusercontent.com`, `api.github.com` | [measured] |
| Hosts that failed: `docs.roocode.com/llms.txt` (404, Docusaurus SPA — page HTML read instead); `docs.cursor.com/*.md` (serves HTML; canonical host is `cursor.com/docs`) | [measured] |
| GitHub code-search totals below are **bucketed estimates, not counts**: every one factors as odd×2ⁿ (774144=189·2¹², 858112=419·2¹¹, 380928=93·2¹², 186112=727·2⁸, 30592=239·2⁷, 2728=341·2³) | [derived] |

### Per-system map

| System | Phases it *names* | Persists to disk | Evaporates (chat/DB only) | File conventions |
|---|---|---|---|---|
| **Claude Code** | plan / acceptEdits / auto / dontAsk / bypass (permission modes, not lifecycle) | CLAUDE.md, `.claude/rules/`, `.claude/skills/*/SKILL.md`, auto-memory `~/.claude/projects/<p>/memory/MEMORY.md` + topic files, `.claude/settings*.json`, recorded `/run` + `/verify` skills | the plan itself; the reasoning; the verification transcript; checkpoints (deleted at 30d) | user/project/local/policy CLAUDE.md precedence; memory frontmatter `type: user\|feedback\|project\|reference`; MEMORY.md capped at first 200 lines / 25KB [fetched] |
| **Cursor** | Plan → Build; Ask/Agent/Plan/Debug/Design modes | `.cursor/rules/*.mdc` (frontmatter `description`, `globs`, `alwaysApply`), AGENTS.md | **the plan** — "Plans are saved by default in your home directory. Click 'Save to workspace'…" [fetched]; checkpoints "stored locally and are separate from git" [fetched] | `.md` inside `.cursor/rules` is *ignored* — extension-gated on `.mdc` [fetched] |
| **AWS Kiro** | Requirements → Design → Tasks (+ Bugfix, Quick Spec) | `.kiro/specs/<name>/requirements.md` (EARS) · `design.md` · `tasks.md`; `.kiro/steering/{product,tech,structure}.md`; `~/.kiro/steering/` global | task run state in the IDE pane; the dependency graph/waves; PBT results | inclusion modes `always \| fileMatch \| manual`; AGENTS.md supported [fetched] |
| **GitHub spec-kit** | constitution → specify → clarify → plan → tasks → analyze → implement → converge | `specs/NNN-feature/{spec,plan,research,data-model,quickstart,tasks}.md`, `contracts/`, `.specify/templates\|presets\|extensions` | nothing beyond the files — the fullest persistence in the set | 132,035★ / 11,865 forks / pushed 2026-08-28T20:46:15Z; 1,567 issues (142 open, 1,425 closed) [fetched] |
| **Copilot cloud agent** | research → plan → iterate → PR | repo/org/personal custom instructions, agent skills, hooks | **the plan** — docs describe review/iterate in-session with no artifact path; "Sessions do not create pull requests automatically" [fetched] | branch `copilot/BRANCH-NAME`; Copilot Memory is a managed service, not a file [fetched] |
| **Devin** | onboarding → session → PR | AGENTS.md; `.agents/skills/<name>/SKILL.md`; blueprints; CLI rules | **Knowledge** (org DB, trigger-description retrieval, `!macro`); **Playbooks** (org DB); session insights | Knowledge is a cloud record at `app.devin.ai/settings/knowledge` — not in the repo [fetched] |
| **Windsurf/Cascade** | Plan/Write/Chat modes | `.devin/rules/*.md` (pref) or `.windsurf/rules/*.md`, AGENTS.md, workflows, skills | **Memories** — auto-generated, `~/.codeium/windsurf/memories/`, machine-local, per-workspace, "not committed to your repository"; the new Devin Local agent "does not persist memories" at all [fetched] | global rules 6,000 chars; workspace rule 12,000 chars/file [fetched] |
| **Cline / Roo** | Plan ↔ Act; `/deep-planning`; Roo Orchestrator/Boomerang | `memory-bank/{projectbrief,productContext,activeContext,systemPatterns,techContext,progress}.md`; `.clinerules/` | the plan (mode state, not a file); Roo subtask context — "only this summary returns to the parent" [fetched] | Memory Bank is a *prompt convention*, not a product feature — the agent writes the files because a rule tells it to [fetched] |
| **OpenAI Codex** | (no named lifecycle) config → task → review | `AGENTS.md` / `AGENTS.override.md` chained global→root→cwd, 32 KiB cap (`project_doc_max_bytes`); `~/.codex/`; `config.toml` | plans, reasoning, cloud task state | at most one file per directory; later files override earlier [fetched] |
| **Google Jules** | prompt → **plan** → approve → code → review | AGENTS.md | the plan — reviewed in-session, and **auto-approved on a timer** if you navigate away [fetched] | — |
| **Google Antigravity** | Planning Mode vs Fast Mode; Artifacts | Rules, Skills, Workflows, Plugins, Hooks | **Implementation Plan**, **Walkthrough**, screenshots, browser recordings — reviewed in a sidebar/review pane, comment-on-artifact, "Proceed"; no documented on-disk path or repo commitment | Artifact Review Policy ∈ {Request Review, Always Proceed} [fetched] |

### 1. The common phase model

Six phases; every system implements a contiguous subset, none implements all six durably. [inference]

| # | Phase | Named by | Universal artifact |
|---|---|---|---|
| 0 | **Constitution** — standing rules that outlive the task | Kiro (steering), spec-kit (constitution), Cursor/Codex/Devin/Windsurf (rules), Claude (CLAUDE.md) | ✅ file, everywhere [fetched] |
| 1 | **Prompt** — the raw ask | nobody names it | ❌ nowhere |
| 2 | **Spec** — what + why, testable | Kiro `requirements.md` (EARS), spec-kit `spec.md` | file in 2 of 11 |
| 3 | **Plan** — how, reviewable before edits | Cursor, Cline, Copilot, Jules, Antigravity, Claude, Kiro `design.md`, spec-kit `plan.md` | **named by 8 of 11, filed by 2** [derived] |
| 4 | **Tasks** — decomposition with state | Kiro `tasks.md`, spec-kit `tasks.md`, Roo boomerang | file in 2 |
| 5 | **Verify** — evidence the thing does what §2 said | Kiro `correctness`/PBT, spec-kit `analyze`+`checklist`, Antigravity Walkthrough | **file in 1 (spec-kit); zero systems produce a signed pass/fail record** [derived] |
| 6 | **Memory** — what to carry forward | Claude auto-memory, Devin Knowledge, Windsurf Memories, Cline memory-bank | file in 2 of 4; DB in 2 |

- The single strongest structural fact: **the industry converged on phase names and diverged on persistence.** [inference]
- Two independent gates recur: a *review gate* between plan and implement (Kiro checkpoints, Antigravity Artifact Review, Jules approve-plan, Cursor build-button), and a *consistency gate* between artifacts (`/speckit.analyze`, Kiro Analyze Requirements). Only spec-kit files the output of the second. [fetched]
- Kiro admits the direction is one-way: "Can I switch workflows after starting a spec? **No** … create a new Feature Spec" [fetched] — a state machine with no back-edge, implemented as a UI mode rather than a document field.

### 2. What persists vs what evaporates — the opening

**Measured on this machine, one repo (`~/Desktop/GitHub/frontmatter`):**

| Quantity | Value | Evidence |
|---|---|---|
| Session transcripts | 267 `.jsonl` | [measured] |
| Transcript bytes | 427,336 KB total dir − 20 KB memory dir = **427,316 KB** | [derived] |
| Durable auto-memory | **20 KB** (MEMORY.md + 2 topic files) | [measured] |
| Ratio ephemeral:durable | 427,316 ÷ 20 = **21,365.8 : 1** | [derived] |
| `ExitPlanMode` *invocations* across all 267 transcripts | **0** — 542 of 562 raw string hits are subagent tool-exclusion lists, the rest ToolSearch listings | [measured] |
| Human-authored `.md` tracked in the repo | 128 | [measured] |

**Adoption of the four persistence conventions (GitHub code search, bucketed estimates):** AGENTS.md ≈858,112 · CLAUDE.md ≈774,144 · `.claude/skills/**/SKILL.md` ≈380,928 · `.cursor/rules/*.mdc` ≈186,112 · `.kiro/specs/**/tasks.md` ≈30,592 · `memory-bank/activeContext.md` ≈2,728. [fetched]

- **Ratio of instruction-file adoption to spec-file adoption ≈ 858,112 : 30,592 = 28.05 : 1.** [derived] The industry has agreed on *how to instruct* an agent and has not agreed on *how to record what it did*.
- **Persists today:** constitution/rules (every system), skills (open Agent Skills spec: YAML frontmatter, `name` ≤64 chars, `description` ≤1024, plus `license`, `compatibility`, `metadata`, `allowed-tools`) [fetched], spec+plan+tasks in exactly Kiro and spec-kit, memory in Claude Code and Cline.
- **Evaporates today:** (a) the **prompt** — no system files it; (b) the **plan** in 8 of 11 systems, including the highest-volume ones; (c) **verification** everywhere — Antigravity's Walkthrough is explicitly a *reminder* artifact ("a concise summary … to remind the user of what has happened in the active conversation") [fetched], not a record; (d) **provenance of the accept decision**; (e) **cross-tool continuity** — Windsurf memories are machine-local and workspace-scoped [fetched], Devin Knowledge is a vendor DB, Copilot Memory is a managed service.
- **The three sharpest single quotes for positioning:** Cursor — plans default to *your home directory*, not the repo [fetched]. Jules — an unattended plan is **auto-approved on a timer** [fetched]. Roo — "only this summary returns to the parent" [fetched].
- Even spec-kit, the most file-native system, encodes lifecycle state as **prose bold-keys, not machine-readable frontmatter**: `spec-template.md`, `plan-template.md`, `constitution-template.md`, `checklist-template.md` all begin with `# …` and carry `**Status**: Draft` as body text; only `tasks-template.md` opens with `---`. [measured, 5 templates fetched and first-line-tested] **This is the literal frontmatter opening: the state machine exists and is unaddressable.**

### 3. frontmatter as the durable home of the loop

**Design principle:** do not invent a lifecycle. Adopt the six-phase model above, give each phase a *document*, give each document *frontmatter keys*, and make the transitions splice-enforced. The product's existing guarantee (byte-preserving splice, 0 corruption across 8,866 foreign files [measured, master plan §1]) is exactly the property a state machine written into other people's files needs.

**Document family** (`.frontmatter/loop/<id>/`, one directory per unit of work):

| File | Phase | Corresponds to |
|---|---|---|
| `prompt.md` | 1 | *nothing in any system* — the differentiator |
| `spec.md` | 2 | Kiro `requirements.md`, spec-kit `spec.md` |
| `plan.md` | 3 | Cursor plan, Antigravity Implementation Plan, Kiro `design.md` |
| `tasks.md` | 4 | Kiro/spec-kit `tasks.md` |
| `verify.md` | 5 | *nothing durable in any system* — the second differentiator |
| `constitution.md` (vault root) | 0 | steering / rules / CLAUDE.md |

**Shared frontmatter keys (every loop document):**

```
id, kind: prompt|spec|plan|tasks|verify
state: draft|proposed|approved|superseded|abandoned
loop: <loop-id>                    # ties the family together
derives_from: [<doc-id>@<sha>]     # upstream doc + the exact version consumed
base_sha: <sha>                    # what the agent read; enforces read-before-patch
supersedes / superseded_by
actor: {human|agent, tool, model, session_ref, prompt_digest}
approved: {by, at, mode: explicit|timer|policy}
verified: {by, on, until, method, result: pass|fail|partial}
stale_after: <date>
```

**State machine (documents, not UI modes):**

- `prompt(draft) → spec(proposed)` — spec carries `derives_from: prompt@sha`.
- `spec(proposed) → spec(approved)` requires a human `approved.by`, or records `approved.mode: timer` honestly (the Jules failure, named rather than hidden). [inference]
- `spec(approved) → plan(proposed) → plan(approved) → tasks`. Any edit to an upstream document flips every downstream doc to `state: stale` and appends the diff to its `derives_from` ledger — this is Kiro's manual "Sync Files" button [fetched] made automatic and auditable.
- `tasks → verify(pass|fail)`. **`verify.md` is the artifact nobody ships.** Its body is a table of `spec` requirement IDs × evidence, each row `{claim, command, exit_code, output_digest, at}`. Kiro's PBT and spec-kit's `/analyze` produce this information and discard it into a pane. [fetched]
- Terminal states are `superseded` (new file + `LATEST` pointer, per master plan §L3) and `abandoned`. Nothing is deleted — `superseded_by` is the back-edge Kiro says it does not have. [fetched/inference]

**Interop, all already-fetched conventions, zero new format:**
- Read `.kiro/specs/*/`, `specs/NNN-*/` (spec-kit), `memory-bank/`, `.cursor/rules/*.mdc`, `AGENTS.md`, `.agents/skills/*/SKILL.md` and project them into the key set. Every one is markdown-on-disk today. [fetched]
- Emit AGENTS.md (858K adoption) and SKILL.md (open spec, `name`/`description`/`metadata`) so the loop is legible to Claude Code, Codex, Devin, Jules, Cursor, Windsurf without adapters. [fetched]
- The `land()` verb in master plan §6 is already the correct write path; add `kind` and `loop` to its payload so a chat-side capture lands *into a phase*, not into a folder. [inference]

**Concrete recommendations**
1. Ship `verify.md` first, not `spec.md`. Spec and plan have two credible incumbents; verification has **zero** durable implementations across 11 systems. [derived]
2. Ship `prompt.md` second. The prompt is the only artifact literally no system persists, and it is the cheapest to capture. [derived]
3. Make `derives_from: <id>@<sha>` mandatory and refuse the write without it. This is the structural fix for the staleness class that Kiro papers over with a "Sync Files" button and Cline papers over with "update memory bank". [fetched/inference]
4. Render, don't relocate: keep `.kiro/specs/` and `specs/NNN-*/` where they are and project frontmatter over them. Migration is the reason spec tools die.
5. Record `approved.mode` including `timer` and `policy` (Antigravity's "Always Proceed"), so a rubber-stamped plan is visibly rubber-stamped. [fetched]
6. Publish the key vocabulary as a spec before the editor. spec-kit reached 132,035★ as a *template repo*; the schelling-point slot is the schema, not the UI. [fetched/inference]

**Explicit anti-recommendations**
- **Do not build plan mode.** Eight systems have it; it is table stakes and it lives in the IDE's input loop, which you do not own. [derived]
- **Do not build a rules/instructions file.** AGENTS.md ≈858K and CLAUDE.md ≈774K — that fight is over. [fetched]
- **Do not invent a new markdown dialect or `.mdc`-style extension gate.** Cursor's own docs concede plain `.md` is silently ignored in `.cursor/rules` [fetched]; that friction is a documented resentment, not a moat.
- **Do not store lifecycle state as prose bold-keys** the way spec-kit does — that is precisely the defect being exploited. [measured]
- **Do not model verification as a Likert score or a summary paragraph.** Antigravity's Walkthrough is a summary; it is not evidence. Binary pass/fail plus command + exit code. [fetched]
- **Do not replicate memory-bank's six-file taxonomy.** ≈2,728 adoption vs ≈858,112 for AGENTS.md; the shape did not win. [derived]
- **Do not require a running daemon** for the state machine — statelessness is already the differentiator against the CRDT competitor. [master plan §3]

### 4. Competes with the IDE, or complements it — and the absorption risk

**Complements, structurally:**
- Every system already externalizes phase 0 to files it does not own (AGENTS.md, `.cursor/rules`, `.kiro/steering`) and expects a *third party* to author them. [fetched]
- Kiro, spec-kit and Antigravity all put a **human review gate** between plan and implement. A review gate needs a document, a comment thread and an audit trail — none of which an IDE chat pane retains after the session. [fetched]
- Cross-tool is the honest wedge: Windsurf memories are machine-local [fetched], Devin Knowledge is a vendor DB, Copilot Memory is a service. A team using Claude Code + Copilot cloud agent + Devin today has **three incompatible memory stores and zero shared verification record**. [derived]

**Competes, narrowly and dangerously:** with spec-kit (files, free, 132,035★, GitHub-backed) and with Kiro's `.kiro/specs/` (bundled with the IDE, ≈30,592 repos). Both are better-distributed than any new tool can be at launch. [fetched]

**The absorption risk, stated honestly:**

| Vector | Probability signal | Mitigation that actually holds |
|---|---|---|
| IDE ships spec+plan+verify as files | **Already happening** — Kiro ships three; spec-kit ships six + `analyze` + `checklist`; pushed 2026-08-28 (yesterday) [fetched] | Do not compete on *producing* the documents; own the *schema and the render* across all of them |
| IDE ships durable plans | Cursor is one config flag away — "Save to workspace" already exists [fetched] | Assume it lands within 12 months; do not build the business on plan capture |
| IDE ships provenance-through-accept | No system does; Copilot/Cursor treat it as admin telemetry [master plan §3] | Byte-anchored provenance survives absorption because it requires splice, which requires the engine |
| Vendor keeps memory in their DB | Devin, Copilot, Windsurf all chose DB over repo [fetched] | This is *permanent* — a vendor has commercial reason not to make memory portable. The neutral, file-native, cross-vendor loop record is the position that cannot be absorbed by any single IDE without giving up lock-in |

**Honest verdict:** the loop *documents* will be absorbed — Kiro and spec-kit have already absorbed four of six phases. What cannot be absorbed by any one IDE is (a) the **cross-vendor** projection (no vendor will make its memory readable by a competitor), (b) the **byte-exact write guarantee** on files the vendor also edits, and (c) the **verification record**, because a vendor certifying its own agent's output is the LR#60 problem in commercial form. Build on those three; treat spec.md and plan.md as commodity surfaces you render, not products you sell. [inference]