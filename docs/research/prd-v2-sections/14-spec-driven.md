I made no writes, commits, or mutating commands — read-only throughout (five `Read` calls plus one `wc -l`); the `~/.claude` dirt predates this run.

## 14. Documents that build things — the spec-driven lane

The founder's question for this lane: can frontmatter be the place you write a spec, an AI reads it, and output is generated? The answer this section defends is *yes for the document half, no for the execution half* — and the entry is narrow, cheap, and gated on one measurement we can take ourselves.

| Half of the lane | Who owns it today | frontmatter's position |
|---|---|---|
| Authoring, review, rendering, drift display, requirement identity | **Nobody.** Not one tool surveyed ships a way to read or edit a spec other than a plain text editor [fetched, 14 tools] | Enter here |
| Execution, test generation, approval gates, agent dispatch | AWS Kiro (IDE-only), spec-kit `/implement`, the coding agent's own loop [fetched] | Do not enter |

---

### 14.1 The market as it stands

**Census — GitHub, 2026-08-28 UTC** [measured, api.github.com]

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
| agentsmd/agents.md | 23,968 | 1,813 | MIT | 2025-08-19 | 2026-08-25 | live |
| open-gsd/gsd-core | 8,849 | — | MIT | — | — | live successor |
| buildermethods/agent-os | 5,343 | 831 | MIT | 2025-07-16 | 2026-05-05 | quiet 3.8 mo |
| kirodotdev/Kiro | 4,231 | 310 | none (proprietary AWS) | 2025-06-17 | 2026-08-27 | issue tracker |
| gemini-cli-extensions/conductor | 3,713 | — | Apache-2.0 | 2025-12-17 | 2026-08-11 | live |
| gotalab/cc-sdd | 3,644 | — | MIT | 2025-07-17 | 2026-05-20 | live |
| Priivacy-ai/spec-kitty | 1,572 | — | MIT | 2025-10-09 | 2026-08-28 | live |
| tesslio/cli | 71 | — | — | — | — | live |

Disagreement recorded: the repos endpoint returns OpenSpec at 66,571; the search endpoint, same minute, returns 66,570 [measured]. Both stand.

**Distribution** [measured, api.npmjs.org + pypi.org, week 2026-08-21→27]

| Package | Last week | Last month (2026-07-29→08-27) | Latest | Licence field |
|---|---|---|---|---|
| `@fission-ai/openspec` | **464,621** | 1,645,308 | 1.11.0 | MIT |
| `bmad-method` | 16,941 | 81,735 | 6.11.0 | MIT |
| `@tessl/cli` | 6,034 | 19,794 | 0.102.0 | `SEE LICENSE.md` |
| `specify-cli` (PyPI) | n/a | n/a | 1.0.1, 56 releases | `null` |

- [derived] OpenSpec ÷ BMAD weekly = 464,621 ÷ 16,941 = **27.43×**; OpenSpec ÷ Tessl weekly = 464,621 ÷ 6,034 = **77.00×**; OpenSpec stars ÷ tesslio/cli stars = 66,571 ÷ 71 = **937.6×**.
- VS Code marketplace installs [measured, gallery API]: GitHub.copilot 74,459,915 · cline 5,131,205 · roo-cline 1,961,704 (`lastUpdated` 2026-05-15, identical to its GitHub archive date) · Kilo-Code 1,473,000.

**Convention adoption** [measured, GitHub code search 2026-08-28 — approximate bucketed totals over a subset of public repos, every value factoring as odd×2ⁿ]

| Convention | Indexed files |
|---|---|
| `CLAUDE.md` | 774,144 |
| `AGENTS.md` | 460,800 (repo root) / ≈858,112 (unrestricted) |
| `.claude/skills/**/SKILL.md` | ≈380,928 |
| `.cursor/rules/**.mdc` | 186,112 |
| `.github/copilot-instructions.md` | 146,944 |
| `openspec/specs/**/spec.md` | 117,504 |
| `GEMINI.md` | 65,152 |
| `.kiro/specs/**/requirements.md` | 33,728 |
| `.kiro/specs/**/tasks.md` | ≈30,592 |
| `.specify/memory/constitution.md` | 11,264 |
| `memory-bank/activeContext.md` | 2,728 |

Disagreement recorded: two research passes returned 460,800 and ≈858,112 for `AGENTS.md` on the same day — the first restricted to repo root, the second not; `CLAUDE.md` matched exactly at 774,144 across both. Quote the root-restricted figure when comparing like for like. A third, independent number exists: agents.md the site claims "over 60k open-source projects" [fetched] — different unit, different index, also stands.

**Independent census — SPECMINE, arXiv 2608.25202, 2026-08-25** [fetched]: 470,795 `spec.md`/`specs.md` files across **73,030 repositories**, attributed to **17 named tools**; a separate Kiro census of 98,574 files across 12,910 repositories; 2,421,323 typed references indexed. [derived] 470,795 ÷ 73,030 = **6.45 spec files/repo**. Its PR sweep found spec-and-implementation co-changing in one PR in **581 repositories** — [derived] 581 ÷ 73,030 = **0.80%**, a **lower bound only** because the sweep covered 11 tools' ≥10-star repos, not the census. Do not quote it as a co-change rate.

**The shape of the category — what all of them do the same way**

- **Markdown is unanimous.** Every artifact in every tool surveyed is a `.md` file. Zero use a formal or binary spec language [measured across 14 tools].
- **Three-artifact skeleton**, reached independently by Kiro, spec-kit, OpenSpec, agent-os and BMAD: `requirements/spec → design/plan → tasks` [fetched].
- **A hidden dot-directory keyed to one vendor** — `.specify/`, `.kiro/`, `openspec/`, `agent-os/`, `.cursor/`, `.claude/`, `memory-bank/`. The convention *is* the lock-in; the response is an install matrix (spec-kit 37 agents, OpenSpec 36 tools [measured]), not a shared location.
- **Given/When/Then plus RFC-2119 is the shared dialect**: OpenSpec `### Requirement:`/`#### Scenario:` with SHALL/MUST, Kiro EARS, spec-kit `**Given**/**When**/**Then**` [fetched].
- **Human approval is the gate, not a machine** — Kiro three-phase approvals, Factory `ExitSpecMode`, Claude Code plan-mode approval [fetched].
- **Nothing is machine-verified against code except one product.** Kiro extracts properties from EARS requirements, generates property-based tests, runs them and links failures back to the requirement — and its own docs limit the claim to "evidence of correctness, not a proof… not formal verification", IDE-only per its own capability matrix [fetched]. `openspec validate --archived` exits non-zero on an unticked `tasks.md` checkbox — a genuine CI gate, on the markdown [fetched]. Everything else is an LLM pass that does not block.

**What none of them do** — no durable identity for a requirement (spec-kit's `/analyze` maps tasks to requirements "by inference by keyword / explicit reference patterns", i.e. by grep, because nothing better exists [fetched]); no machine binding from requirement to code range (SPECMINE had to *reconstruct* it from 2.42M typed references); no deterministic drift detection; no review surface; no cross-tool portability across 17 named tools.

The cost of the identity gap is measured. arXiv 2606.30689 [fetched]: only the per-line-citation condition (`traceSDD`, hierarchical `REQ-XXX.Y.Z` IDs) enables automated hallucination detection — **TDR 86.4% (Claude Sonnet 4.6) / 88.0% (GLM-5-turbo), against 0% for Spec Kit, OpenSpec and the uncited baseline, FPR 0% in both**. The same paper prices it: citation *reduces* output determinism (Claude d=−0.76, p=0.003; GLM d=−0.72, p<0.001).

**Verdict on whether a markdown editor is a credible home**

| For the editor | For the IDE |
|---|---|
| The artifact is 100% markdown in 100% of tools; whoever owns markdown editing owns the file type [measured] | Verification lives where the code and the test runner live — Kiro's PBT loop must *run tests*, and that is the only differentiated capability in the category [fetched] |
| The IDE has *conceded* the artifact: Claude Code makes plan a session permission mode with no file; Factory Spec Mode is ephemeral; Cursor ships rules, not specs [fetched] | Approval gates are conversational and belong in the agent loop [fetched] |
| Four conventions are legible to any editor with zero integration — [derived] 460,800 + 117,504 + 33,728 + 11,264 = **623,296** indexed files [measured] | Distribution flows through the coding agent: spec-kit installs into 37 agents in one command [measured] |

**Decision: enter as a viewer, reviewer, renderer and anchor-provider for specs other tools already write; do not become tool #18.** Do not define a new spec format or a `.frontmatter/specs/` directory — that is convention #18 in a field with 17 and no interchange standard. Do not build an approval workflow, do not run or generate tests, do not build spec↔code semantic verification. Sell *to* the OpenSpec and Kiro user: 464,621 weekly npm downloads is a distribution channel, not a competitor.

**The strongest argument against entering at all.** The category has no retention evidence and three of its biggest names have already left. Tessl — the best-funded pure-play, the company that coined the spec-as-source-of-truth pitch — pivoted its CLI to a skills registry; its current CLI reference contains **no spec command at all**, and its CLI repo sits at **71 stars against OpenSpec's 66,571, a 937.6× gap** [measured]. Roo Code is **archived** on 1,961,704 installs [measured]. `get-shit-done` accumulated 64,629 stars and became a redirect stub [measured]. SPECMINE observes spec-and-code co-change in **581 repositories** against a 73,030-repo census [fetched] — consistent with specs being generated once and abandoned. Every artifact we would render is written by an MIT-licensed CLI that costs nothing; willingness-to-pay is unproven precisely because the incumbent price is zero. And our actual moat is *fidelity* — byte-exact splice, the degradation certificate, the machine-view differ — and nothing in this category has been observed to churn over fidelity. The honest counter-case is that spec-driven development is a 12-month prompt-scaffolding fashion whose artifacts are write-once, and that building a renderer for write-once files is building a museum. [inference on measured/fetched inputs]

**What would falsify the decision to enter:** on a corpus of real `openspec/` and `.kiro/specs/` repositories, measure the fraction of spec files edited more than once after creation. If that fraction is low, the museum argument wins and the correct move is to ship the renderer as a feature and never as a product. Take this measurement before any further investment; it is one we can take ourselves.

---

### 14.2 The document canon we render, not invent

| Type | Canonical source | Sections | Frontmatter keys | Machine-readable schema | Render profile |
|---|---|---|---|---|---|
| **ADR — MADR** | `adr/madr` template, 1422 B [fetched] | 6 H2 (Context and Problem Statement; Decision Drivers*; Considered Options; Decision Outcome; Pros and Cons*; More Information*) + 2 fixed H3 (Consequences*, Confirmation*); minimal variant = 3 H2 + 1 H3; **4 template variants** ship | 5, all optional in-file: `status`, `date`, `decision-makers`, `consulted`, `informed` | **NO** — `schema.json` → 404 at both paths [measured] | `decision` |
| **ADR — Nygard** | 2011 article [fetched] | 5: Title, Context, Decision, Status, Consequences | **none** — plain headings | NO | `decision` |
| **RFC — IETF** | RFC 7322 §4 [fetched] | **23 listed elements, 10 marked `[Required]`** + 1 conditional (IANA) + 1 on-demand | first-page header, not YAML | **YES, two** — RFC 7991 XML vocabulary; `rfc-index.xml` (2,324,273 bytes) [measured] | `spec` + `proposal` |
| **RFC — Rust** | `rust-lang/rfcs/0000-template.md` [fetched] | **9 H2**: Summary; Motivation; Guide-level explanation; Reference-level explanation; Drawbacks; Rationale and alternatives; Prior art; Unresolved questions; Future possibilities | 4-item **bullet list**, not YAML: Feature Name, Start Date, RFC PR, Rust Issue | NO (process state tracked externally by rfcbot) | `proposal` |
| **RFD — Oxide** | RFD 1, 47,089 B [fetched] | **none prescribed** — content prompts only | 4 **AsciiDoc attributes**: `:authors:`, `:state:`, `:discussion:`, `:labels:` | NO heading schema; header parseable | `decision` |
| **RFC — company-internal** | Squarespace + Uber posts [fetched] | Uber backend 11, Uber mobile/web 11, literal-string overlap **5** [derived]; Squarespace adds 3 | Squarespace 7 header fields; approval enum is **2 values by design**: `yes` \| `not yet` | NO | `proposal` |
| **Design doc — Google** | industrialempathy.com [fetched] | 5 top-level; explicitly refuses to prescribe — "Rule #1 is: Write them in whatever form makes the most sense"; 10-20ish pages, or a 1-3 page mini | none | NO | `proposal` |
| **Gherkin** | cucumber.io reference + `gherkin-languages.json` [fetched/measured] | Primary keywords: `Feature`, `Rule`, `Example`/`Scenario`, `Given`/`When`/`Then`/`And`/`But`/`*`, `Background`, `Scenario Outline`, `Examples`; 4 secondary (`"""`, `\|`, `@`, `#`) | **none** — tags are the metadata channel | **YES** — `gherkin-languages.json`, **80 languages**, English entry 11 keyword keys + `name` + `native` = 13 [measured] | `behavior` |
| **OpenAPI** | OAI repo, `versions/` [measured] | Root fixed fields: **3.2.0 = 11**, **3.1.1 = 10**, delta = 1 (`$self`); 9 spec files in `versions/` | the document *is* the frontmatter (`info`) | **YES, strongest** — `spec.openapis.org/oas/3.1/schema/2022-10-07` → 200, 3535 B; `oas/3.1/dialect/base` → 200, 345 B. `…/schema/latest` → **404** for both 3.1 and 3.2 — pin the dated URI [measured] | `api` |
| **Changelog** | Keep a Changelog 1.1.0, 8394 B [fetched] | `# Changelog` → `## [Unreleased]` → `## [version] - YYYY-MM-DD` → `### <type>`; **exactly 6 types** (Added, Changed, Deprecated, Removed, Fixed, Security); **exactly 7 principles** | **none** | **NO** — principle #1 is literally "Changelogs are for humans, not machines" | `release` |
| **Postmortem — Google SRE** | SRE Book App. D (2016) + SRE Workbook Ch. 10 (2018) [fetched] | **The two disagree.** Book: 12 top-level + 3 sub, incl. Timeline. Workbook: 9 body sections, adds Recovery Efforts + Glossary, action items gain `Priority` | Workbook metadata: Owner, Shared with, Status, Incident date, Published | NO — Google's own parser (Requiem) is internal | `incident` |
| **Runbook** | **no standards body** [inference] | Skelton Thatcher template: **65 headings, 10 H2** [measured, `grep -cE '^#{1,4} '`] | our invention | NO | `ops` |
| **Test plan** | IEEE 829-2008 **superseded** by ISO/IEC/IEEE 29119-3:2013 | IEEE 829 defines **10 document types**, not one | none standardized | NO | `test` |

**Types with no canonical form — we would be inventing**

| Type | Canonical source? | What actually exists |
|---|---|---|
| **PRD** | **NONE** | Vendor blog templates only; every "PRD standard" claim is [SS] at best |
| **FRD** | **NONE** | Defence/consulting folklore; overlaps SRS "Specific requirements" |
| **TRD** | **NONE** | Closest standardized neighbour is SRS |
| **SRS** | **Partial, paywalled** — ISO/IEC/IEEE 29148:2018 exists, `iso.org` returned **403**, clause list never opened; IEEE 830-1998 withdrawn | The circulating section list is [SS] from a secondary encyclopedia page citing SWEBOK |
| **Runbook** | **NONE** | Skelton Thatcher template; Google says "playbook", not runbook — the terminology is not shared |
| **User-story wrapper** (As a / I want / So that) | **NONE** — Connextra-format folklore | Gherkin covers acceptance criteria only |
| **Design doc** | **NONE, by design** | Google's article explicitly refuses to prescribe |
| **Company-internal RFC** | **NONE** | Squarespace and Uber are two data points sharing 5 literal strings |

**Four of the fourteen requested document types have no canonical form at all, and a fifth (SRS) has one nobody could open — so every template we ship for those must carry the label "house convention", never "canonical".**

**Ship order, because it is the order in which a template can be validated rather than merely rendered:** (1) OpenAPI and (2) Gherkin first — both have a fetched, versioned, machine-readable normative artifact. (3) MADR and (4) Keep a Changelog next — no schema, but a fully specified section list and enum from a single primary source. (5) IETF RFC — fully specified but heavy. (6) Google SRE postmortem — ship the **Workbook** variant and label the version, because the two Google templates disagree.

**Anti-recommendations, all load-bearing:**
- Do **not** label anything "IEEE 829" — superseded, and it defines 10 documents.
- Do **not** publish a 29119-3 or 29148 clause list until someone opens the paywalled text; both are [SS] and both hosts returned 403.
- Do **not** attach YAML frontmatter to `CHANGELOG.md` or to `.feature` files. A `---` fence at line 1 makes a `.feature` file unparseable by every Gherkin implementation; if metadata is needed it must be tags or a sidecar.
- Do **not** silently pick an ordering where sources conflict: Nygard's article orders Title → Context → Decision → Status → Consequences, the widely-copied `joelparkerhenderson` rendering puts Status second [fetched, both]. Render what the file says.
- Do **not** default the runbook template to 65 headings — that is a system-operation manual, not an incident procedure. Default to the 10 H2 skeleton, offer the full set as an expand variant.
- Do **not** bullet-ize a Nygard ADR: the source states bullets are "acceptable only for visual style, not as an excuse for writing sentence fragments" [fetched].
- Do **not** ship a "blameless" lint that flags usernames. Google's own bad-postmortem example is blameful by containing judgement, not by containing names — names appear throughout the good one.
- Do **not** inline a full OpenAPI document inside a design doc; the Google guidance warns such definitions "quickly get out of date". Link it; render it separately.

---

### 14.3 Prompts, specs and skills — three artifacts or one?

**Decision: one substrate, three lifecycles. Same file skeleton (`---` YAML + CommonMark, closed key set, splice-safe), different required keys, different verifier.** Do not merge them into one file type; do not give them three unrelated formats.

Evidence the substrate is already shared [fetched 2026-08-28]:
- VS Code ships **four** sibling markdown-plus-YAML types — `*.instructions.md`, `*.prompt.md`, `*.agent.md`, `SKILL.md` — discovered by the same walker with the same parent-repo rule.
- Microsoft is collapsing prompt files into skills in production: "Agents running on the Agent Host don't use prompt files. To use an existing prompt with the Copilot agent, convert it to an agent skill", behind `chat.customizations.promptMigration.enabled`.
- PromptLayer, a *prompt registry*, now versions **SKILL.md folders** alongside prompt templates (Free 1 collection/30 files, Pro 5/50, Team unlimited/100, hard 5 MiB per file).
- promptfoo, a *prompt* test runner, ships a `skill-used` assertion and `trajectory:tool-used`.

| | Prompt doc | Spec doc | Skill doc |
|---|---|---|---|
| Loaded | on invoke, fully | by human/agent on reference | **progressively** — L1 metadata always, L2 body on trigger, L3 files on demand |
| Addressed by | name + version | path | `description` **match** — a retrieval key, not documentation |
| Versioned by | semver + eval gate | git history | `metadata.version`, informal |
| Tested by | assertions over outputs | review/approval | with-vs-without A/B |
| Fails by | wrong output | ambiguity | **not triggering at all** |
| Cache role | *is* the cached prefix | is cached *content* | changes the tool set → invalidates the whole prefix |

Design consequences the build team implements directly:
- A skill's `description` is linted for **trigger coverage**; a prompt's `inputs` for **fixture completeness**; a spec's headings for **stable anchors**. Three linters, one parser.
- **Closed key set with one `metadata` escape hatch.** [measured, local corpus of 697 `SKILL.md`, 695 parseable] **293/695 = 42.2%** carry at least one key outside the 6-field agentskills.io spec, and every one **hard-errors** on upload rather than degrading: `Unexpected key(s) in SKILL.md frontmatter: argument-hint. Allowed properties are: allowed-tools, compatibility, description, license, metadata, name`. An open key set silently manufactures unportable documents.
- Cap `description` at **1024** chars, not 1536: the spec caps it at 1024 while the listing truncates `description`+`when_to_use` at 1,536 — the smaller cap is the portable one. [measured] 17/695 = 2.45% of local files already exceed 1024; resolved length median 379, p90 719, max 1,885.
- Adopt `.prompty` §2.7 **rich input kinds** (`thread`, `image`, `file`, `audio`) — the four things that break naive `{{var}}` substitution — and make `example` mandatory when `required: true`, because that is what makes a prompt file self-testing.
- Put `version` **in the file**. Every registry surveyed has a version model and no file format does; Langfuse (integer + labels), Braintrust (hex + environments), LangSmith (commit hash + tags) and PromptLayer (version + release labels) each own it server-side with a different primitive. Adopting one is adopting its lock-in.
- Declare cacheability in the document (`breakpoints`, `ttl`, `min_tokens_assert`), because an under-minimum Anthropic prefix is **silently uncached with no error** — the only signal is `cache_creation_input_tokens == 0 && cache_read_input_tokens == 0`. Minimum cacheable prefixes differ per model: 512 (Opus 5 / Fable 5 / Mythos 5), 1,024 (Opus 4.8, Sonnet 5/4.6/4.5, Opus 4.1/4, Sonnet 4), 2,048 (Mythos Preview, Opus 4.7, Haiku 3.5), 4,096 (Opus 4.6, Opus 4.5, Haiku 4.5); 4 breakpoint slots, 20-block lookback, order `tools → system → messages`. OpenAI: min 1,024 tok (GPT-5.6+) / 2,048 (older), write 1.25× / read 0.1×, max 4 cache writes per request, `ttl` sole legal value `30m`. [all fetched]

**Anti-recommendations:**
- **Do not invent a new prompt file extension.** `@prompty/core` gets 755 npm downloads/month against promptfoo's 2,536,364 — [derived] **3,359×** — and `.prompty` self-labels as "v2 Alpha… may change". Two unrelated projects already both claim the name "Promptfile" (132★ / 12 downloads a month). The extension is not the moat.
- **Do not add frontmatter to `AGENTS.md`.** It has no schema by design, 23,968★, median local size **145 bytes** across n=49 [measured]. The absence of keys is the property that produced the adoption.
- **Do not put YAML frontmatter in `llms.txt`.** The spec's only required element is a single H1 and it explicitly permits a leading BOM; a `---` block is a violation, not an extension.
- **Do not use full Jinja2.** Prompty published a normative 10-feature subset with `trim_blocks`/`lstrip_blocks` forced off precisely because identical templates rendered differently across runtimes; promptfoo uses **Nunjucks**, not Jinja2, so templates are not portable between the two.
- **Do not render user input without pre-render role-marker neutralisation** (Prompty §6.3: a nonce injected at every role boundary plus post-parse validation). Without it, any `{{var}}` containing `user:` on its own line silently forges a message boundary.
- **Do not let a prompt document read arbitrary files.** `${file:}` must reject absolute paths, `..` and symlink escapes, and frontmatter must never grant itself additional roots. A prompt document is untrusted content the moment it is shared.
- **Do not build a prompt *library* surface before a prompt *test* surface.** Every format surveyed that lacks a testing model (llms.txt, AGENTS.md, both Promptfiles, `.prompty`) is adoption-flat or ships no verifier; every artifact with real volume (promptfoo 2,536,364/mo, LangSmith 26,474,529/mo, Langfuse 27,044,017/mo PyPI) is a testing or versioning surface whose file format is an afterthought.

---

### 14.4 The AI build loop and where files beat chat

**The six-phase model — named by everyone, persisted by almost no one** [derived across 11 systems]

| # | Phase | Named by | Persisted as a file |
|---|---|---|---|
| 0 | **Constitution** — standing rules that outlive the task | Kiro steering, spec-kit constitution, Cursor/Codex/Devin/Windsurf rules, CLAUDE.md | ✅ **everywhere** |
| 1 | **Prompt** — the raw ask | nobody names it | ❌ **nowhere** |
| 2 | **Spec** — what + why, testable | Kiro `requirements.md` (EARS), spec-kit `spec.md` | 2 of 11 |
| 3 | **Plan** — how, reviewable before edits | Cursor, Cline, Copilot, Jules, Antigravity, Claude, Kiro `design.md`, spec-kit `plan.md` | **named by 8 of 11, filed by 2** |
| 4 | **Tasks** — decomposition with state | Kiro, spec-kit, Roo boomerang | 2 of 11 |
| 5 | **Verify** — evidence the thing does what §2 said | Kiro PBT, spec-kit `analyze`, Antigravity Walkthrough | **1 of 11; zero systems produce a signed pass/fail record** |
| 6 | **Memory** — what to carry forward | Claude auto-memory, Devin Knowledge, Windsurf Memories, Cline memory-bank | file in 2 of 4; vendor DB in 2 |

**The industry converged on phase names and diverged on persistence — and the phases that evaporate are the prompt, the plan, and the verification, which are exactly the three a team needs six months later.**

**What evaporates, with the vendor's own words** [fetched 2026-08-28]

| Artifact | Where it goes |
|---|---|
| Cursor plans | "Plans are saved by default in your home directory. Click 'Save to workspace'…" — not the repo. Checkpoints "stored locally and are separate from git" |
| Jules plans | reviewed in-session and **auto-approved on a timer** if you navigate away |
| Roo subtask context | "only this summary returns to the parent" |
| Antigravity Implementation Plan / Walkthrough | sidebar review pane; the Walkthrough is explicitly "a concise summary… to remind the user of what has happened" — a reminder, not a record; no documented on-disk path |
| Windsurf Memories | auto-generated, `~/.codeium/windsurf/memories/`, machine-local, per-workspace, "not committed to your repository"; the Devin Local agent "does not persist memories" at all |
| Devin Knowledge / Copilot Memory | vendor DB and managed service respectively — not in the repo |
| Claude Code plan | a *permission mode* in the `Shift+Tab` cycle, session-scoped, no file. Checkpoints deleted at 30d |

**Measured on this machine, one repo (`~/Desktop/GitHub/frontmatter`)** [measured/derived]

| Quantity | Value |
|---|---|
| Session transcripts | 267 `.jsonl` |
| Transcript bytes | 427,336 KB total − 20 KB memory dir = **427,316 KB** |
| Durable auto-memory | **20 KB** |
| Ratio ephemeral : durable | 427,316 ÷ 20 = **21,365.8 : 1** |
| `ExitPlanMode` invocations across all 267 transcripts | **0** (542 of 562 raw string hits are subagent tool-exclusion lists) |
| Human-authored `.md` tracked in the repo | 128 |

[derived] Instruction-file adoption ÷ spec-file adoption ≈ 858,112 : 30,592 = **28.05 : 1**. The industry has agreed on *how to instruct* an agent and has not agreed on *how to record what it did*.

**The literal opening.** Even spec-kit, the most file-native system in the set, encodes lifecycle state as **prose bold-keys, not frontmatter**: `spec-template.md`, `plan-template.md`, `constitution-template.md` and `checklist-template.md` all begin with `# …` and carry `**Status**: Draft` as body text; only `tasks-template.md` opens with `---` [measured, 5 templates fetched and first-line-tested]. The state machine exists and is unaddressable.

**What we build.** A loop document family under `.frontmatter/loop/<id>/` — `prompt.md`, `spec.md`, `plan.md`, `tasks.md`, `verify.md`, plus `constitution.md` at vault root — sharing one frontmatter key set: `id`, `kind`, `state ∈ {draft, proposed, approved, superseded, abandoned}`, `loop`, `derives_from: [<doc-id>@<sha>]`, `base_sha`, `supersedes`/`superseded_by`, `actor {human|agent, tool, model, session_ref, prompt_digest}`, `approved {by, at, mode: explicit|timer|policy}`, `verified {by, on, until, method, result: pass|fail|partial}`, `stale_after`. Transitions are splice-enforced: any edit to an upstream document flips every downstream document to stale and appends the diff to its `derives_from` ledger — Kiro's manual "Sync Files" button made automatic and auditable. Terminal states are `superseded` (new file plus LATEST pointer) and `abandoned`; nothing is deleted, which supplies the back-edge Kiro states it does not have ("Can I switch workflows after starting a spec? **No** … create a new Feature Spec" [fetched]).

**Build order, and why:**
1. **`verify.md` first, not `spec.md`.** Spec and plan have two credible incumbents; verification has **zero durable implementations across 11 systems** [derived]. Its body is a table of requirement IDs × evidence, each row `{claim, command, exit_code, output_digest, at}` — information Kiro's PBT and spec-kit's `/analyze` already produce and discard into a pane.
2. **`prompt.md` second.** The prompt is the only artifact literally no system persists, and it is the cheapest to capture.
3. **Make `derives_from: <id>@<sha>` mandatory and refuse the write without it.** This is the structural fix for the staleness class Kiro papers over with a Sync button and Cline papers over with "update memory bank".
4. **Render, don't relocate.** Keep `.kiro/specs/` and `specs/NNN-*/` where they are and project frontmatter over them. Migration is the reason spec tools die.
5. **Record `approved.mode` including `timer` and `policy`,** so a rubber-stamped plan is visibly rubber-stamped.
6. **Emit `AGENTS.md` and `SKILL.md`** so the loop is legible to Claude Code, Codex, Devin, Jules, Cursor and Windsurf with no adapter.

**Anti-recommendations:**
- **Do not build plan mode.** Eight of 11 systems have it; it is table stakes and it lives in the IDE's input loop, which we do not own.
- **Do not build a rules/instructions file.** AGENTS.md ≈858K and CLAUDE.md 774,144 — that fight is over.
- **Do not invent an extension gate.** Cursor's own docs concede plain `.md` is silently ignored inside `.cursor/rules`; that friction is a documented resentment, not a moat.
- **Do not store lifecycle state as prose bold-keys.** That is precisely the defect being exploited.
- **Do not replicate memory-bank's six-file taxonomy** — 2,728 adoption against ≈858,112 for AGENTS.md. The shape did not win.
- **Do not require a running daemon.** Statelessness is the differentiator against the CRDT competitor.

**Absorption risk, stated honestly.** The loop *documents* will be absorbed — Kiro ships three and spec-kit six, and spec-kit was pushed 2026-08-28. Cursor is one config flag from durable plans; assume it lands within 12 months and do not build the business on plan capture. What no single IDE can absorb: (a) the **cross-vendor projection**, because no vendor will make its memory readable by a competitor — Windsurf memories are machine-local, Devin Knowledge is a vendor DB, Copilot Memory is a managed service, and a team on all three today has three incompatible stores and zero shared verification record; (b) the **byte-exact write guarantee** on files the vendor also edits; (c) the **verification record**, because a vendor certifying its own agent's output is the second-opinion-from-the-first-opinion problem in commercial form. Build on those three; treat `spec.md` and `plan.md` as commodity surfaces we render, not products we sell.

---

### 14.5 What conformance we can honestly claim

| Mechanism | Proves | Cannot prove |
|---|---|---|
| Schema validation (JSON Schema / ajv) | Structural + per-field constraint conformance of an instance | Cross-field arithmetic, temporal or business invariants. [measured] ajv 6.15.0, schema `{total≥0, discount≥0}`, 3 payloads → 3 schema-valid, **1 of 3 valid while violating the English sentence "a discount must never exceed the order total"** |
| Property-based testing (Hypothesis 8,918★, fast-check 5,121★) | Falsification — a minimised counterexample to a stated invariant | Absence of counterexamples ≠ proof; the property itself is unverified against the English spec |
| OpenAPI conformance fuzzing (Schemathesis 3,565★) | Responses deviate from the schema; 5xx on generated inputs. 8 fuzzers × 16 services: "the only one to handle more than two-thirds of our target services without a fatal internal error", 1.4×–4.5× more unique defects than second-best [fetched arXiv 2112.10328v1] | That the schema *is* the spec |
| Consumer-driven contracts (Pact) | Provider responses satisfy each identified consumer's recorded expectation | Verbatim scope limits: "Pact is about checking the contents and format of requests and responses"; "Pact does not test the side effects of a request"; explicit not-good-for list includes public APIs and load testing [fetched] |
| Mutation testing (Stryker 3,060★, PIT 1,856★) | Your test suite detects seeded faults | **Spec conformance at all** — it grades tests, not code-vs-spec; equivalent mutants: "the only solution is by finding these by hand" [fetched] |
| Model checking (TLA+ 3,019★, Alloy 863★) | A *design* satisfies stated invariants in a bounded state space | Newcombe et al., AWS, verbatim: "How do we know that the executable code correctly implements the verified design?" — **"The answer is that we don't."** [fetched PDF] |
| Tag-based traceability (OpenFastTrace 163★) | Every normative item has a marker of the required artifact type; stale links detected (`Orphaned`/`Outdated`/`Predated`/`Covered-*`) | That the marked code *implements* the item |
| LLM-as-judge | A cheap, correlated, **non-deterministic** opinion | A verdict stable under reordering, prompt length, or rerun |

**Nothing measured in this survey takes a natural-language requirement plus a codebase and returns a sound verdict; every deployed system reduces the problem to a human having written a test, a formal property, or a tag — the human is always the oracle.**

Supporting numbers, and one recorded disagreement:
- LLM judges, sources disagree: MT-Bench reports strong judges reach "over 80% agreement, the same level of agreement between humans" [fetched arXiv 2306.05685v4]; Judging the Judges (13 judges × 9 exam-takers) finds them "still quite far behind inter-human agreement", off by "up to 5 points", with leniency bias [fetched arXiv 2406.12624v6]. Both stand. Code-specific evidence is worse: 8 LLMs over **1,405 Java methods and 1,281 Python functions** — "even the best-performing LLM frequently misjudges the correctness of the code" [fetched arXiv 2507.16587v1]; CodeJudgeBench, **26 judge models** — "all models still exhibit significant randomness", and "simply changing the order in which responses are presented can substantially impact accuracy" [fetched arXiv 2507.10535v2].
- The test oracle itself is weak: SWE-Bench+ found **32.67%** of successful patches involved solution leakage and **31.08%** passed on weak tests; filtering both dropped SWE-Agent+GPT-4 from **12.47% → 3.97%** [fetched arXiv 2410.06992v2], [derived] **8.50 absolute points**, a **3.14×** reduction. A second study found **7.8%** of patches counted correct while failing the developer-written suite and net **6.2 absolute points** of inflation [fetched arXiv 2503.15223v2].
- Formal methods lite is a *design* verifier: [derived] AWS's six published TLA+/PlusCal specifications total **3,031 lines** (804 + 645 + 939 + 102 + 223 + 318) and found roughly ten design bugs, with the code-to-design link stated as unproven by the authors.
- Automated link recovery is not gate-grade: SpecMap reaches "up to **73.3%** file mapping accuracy" [fetched arXiv 2601.11688v1]; NL-PL traceability gains over SOTA are **+3.68%** (HGT) and **+8.84%** (Gemini 2.5 Pro) F1 across 12 projects [fetched arXiv 2509.05585v1].
- The market has let this category die twice [fetched]: **Optic** (spec-vs-runtime drift) `archived=true`, last push 2026-01-08, "Optic Labs is now part of Atlassian" — [derived] 233 days stale; **Dredd** (OpenAPI-to-implementation conformance) `archived=true`, last push 2024-05-11 — [derived] 840 days stale. [derived] 2 of 18 repos queried are archived = **11.11%**, and both are in the spec-conformance category specifically, while every property-testing, schema-validation, mutation-testing and traceability repo queried was pushed within 79 days. [derived] npm last-week: ajv 378,773,799 ÷ fast-check 37,512,910 = **10.10×**; fast-check ÷ @stryker-mutator/core 2,320,443 = **16.17×**; ajv ÷ @pact-foundation/pact 600,095 = **631.19×**. The world buys shape validation, sparingly buys falsification, and has twice refused to buy conformance.

**What frontmatter ships — all document-side, all provable from the file alone:**

| Capability | Mechanism | Honest label |
|---|---|---|
| Revision-pinned requirement identity | Adopt OpenFastTrace `id~revision` semantics: editing an item's normative text bumps the revision and **voids every outstanding coverage claim**. OFT's guide calls this "one of the most useful safeguards in OFT" [fetched] | **requirement identity** |
| Content-derived anchors as the durable ID | Our existing anchors resolve at 99.627% with 0.050% false over 41,642 block-versions [measured, internal] — the durable `REQ-XXX.Y.Z` that arXiv 2606.30689 shows is worth 86.4–88.0% TDR against 0% | **stable anchor** |
| Normative-vs-informative segmentation | We own the AST; classify and **count** normative items deterministically instead of an LLM inferring them by keyword the way spec-kit `analyze` does | **normative item count** |
| Coverage matrix | Emit "N of M normative items have ≥1 declared covering artifact; K links are Outdated; J are Orphaned" | **link coverage — never conformance** |
| Drift display | Anchor resolution failure is a deterministic staleness signal. No LLM, no false confidence | **stale link** |
| EARS-shaped criteria linting | `While <pre-condition>, when <trigger>, the <system name> shall <system response>` — first published 2009, users named include Airbus, Bosch, Dyson, Honeywell, Intel, NASA, Rolls-Royce, Siemens [fetched] | **syntax lint** |
| Change-impact broadcast | On a revision bump, emit the closure of dependent items, tests and previously-linked artifacts | **impact set** |
| Machine-checkable extraction | Where a requirement contains a schema, table, enum or numeric bound, extract it into a JSON Schema or test fixture the code side runs | **generated gate** |

The division is: **documents generate gates; gates decide.** The local precedent is already in this repo — `specs/harness/` holds 5 `.mjs` gates that exit non-zero, e.g. `import-boundary-report.mjs` "Fails (exit 1) if any source file still references `@/server`, `@/lib`, or `@/components`" [measured].

**Anti-recommendations — what would be over-claiming:**
- **Do not claim "verifies that code matches the spec."** AWS, with 3,031 lines of formal spec and a model checker, states outright it does not know that. A markdown tool claiming it is claiming more than TLA+.
- **Do not ship an LLM conformance verdict as a gate.** If a judge ships at all, it ships its own kappa and precision against a human gold set, and it is labelled triage.
- **Do not present link coverage as conformance.** "100% of requirements are linked" is compatible with 0% of them being implemented. Say so in the UI copy, not the footnotes.
- **Do not build automated spec→code link *inference* as a truth source.** 73.3% file-level accuracy means roughly one file in four is mis-assigned; as a suggestion with human confirmation it is useful, as a matrix cell it is a fabricated audit trail.
- **Do not market to DO-178C / IEC 62304 / ISO 26262 compliance.** Those clause texts are paywalled and were not opened [SS]; the cited FDA baseline — "General Principles of Software Validation", January 2002, Docket FDA-1997-D-0029, status Final [fetched] — is [derived] **24 years** old; and tool qualification in a regulated toolchain is a formal evidenced process. This is the highest-liability over-claim available to us.
- **Do not build a test runner, mutation engine, or coverage tool.** Those categories are saturated and healthy. The two archived repos are exactly the conformance category — that is a warning, not a vacancy.
- **Do not equate a green LLM convergence report with verification.** spec-kit's `converge` loops an LLM to a fixpoint and reports "✅ Converged"; its stopping condition is the judge's own opinion [fetched].
- **Do not claim novelty for the traceability matrix.** It is 2002-era regulated practice with live OSS implementations (OpenFastTrace 163★ GPL-3.0, StrictDoc 370★, Sphinx-Needs 299★, Doorstop — all pushed 2026-08-28). The credible claim is *ergonomics and freshness in Markdown*, not invention.

**What would falsify the conformance position:** if a published, reproducible method takes an English requirement plus a codebase and returns a verdict whose agreement with human review is measured above inter-human agreement and is stable under response reordering, then the document-side-only boundary is too conservative and we should revisit. Until then, we ship identity, coverage, freshness and extraction — and we let a gate that exits non-zero make every decision.
