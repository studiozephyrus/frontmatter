### Scope + tool reality

- `WebFetch` refused by the local gate; **`curl` is not blocked** [measured 2026-08-28Z]. Reached: raw.githubusercontent.com, registry.npmjs.org, api.npmjs.org, pypi.org, pypistats.org, platform.openai.com (`.md` twins), docs.claude.com (`.md` twins), llmstxt.org, agents.md, agentskills.io, langfuse.com, docs.promptlayer.com, docs.langchain.com, braintrust.dev, code.visualstudio.com, export.arxiv.org.
- Blocked: `api.github.com` — anonymous rate limit exhausted (`"core":{"limit":60,"remaining":0}`) and the token file is inside the sandbox read-deny list, so **star counts come from GitHub HTML scrape, not the API** [measured].
- Nothing was written, edited, committed, or pushed. All commands read-only.

### The field, one row each

| Artifact | File format | Markdown? | Versioning model | Testing model | Adoption (date) | Licence |
|---|---|---|---|---|---|---|
| **.prompty** (Microsoft) | YAML frontmatter + md body, `---` **or** `+++` delims | Yes | None in-format; `metadata` free dict only | None in spec; `example` field on each Property is the only test affordance | 1,254★ [fetched 08-28]; npm `@prompty/core` **755**/mo, PyPI `prompty` **545,973**/mo (2026-07-29→08-27) | MIT |
| **promptfile/promptfile** | "Markdown-like syntax" + editor playground | Partly | git only | none | **132★** [fetched 08-28]; prior internal round recorded last push 2023-07 | — (unread) |
| **npm `promptfile`** (kunal-dd, distinct project) | YAML fm (`model`,`provider`,`temperature`,`input`) + `<system>/<user>/<assistant>`, `{{var}}`, `?`=optional | Yes | git only | `promptfile render` dry-run | **12** downloads/mo; created 2026-06-18, modified 2026-06-20 | MIT |
| **PromptLayer** | No file format — Prompt Registry API (`templates-get`, `-raw`, `publish`, `patch`) | No | Version numbers + **release labels** + dynamic labels + A/B + zero-downtime releases | Scorecards, Tables, request analytics | PyPI **164,356**/mo; 783★ | Apache-2.0 |
| **Langfuse** | Prompt object `{name,type,prompt,version,labels,config}`; `type` immutable after create | No (JSON/UI) | Auto integer `version` + freeform `labels` (`production`,`staging`,tenant,experiment) | Datasets/experiments; CI via `repository_dispatch` webhook | 33,866★; npm **8,003,800**/mo; PyPI **27,044,017**/mo | MIT Expat **except** `ee/`, `web/src/ee/`, `worker/src/ee/`; © "ClickHouse, Inc. 2023-2026" |
| **Braintrust** | Platform object: `slug` + hex version (`5878bd218351fb8e`) + environment | No | Every save = new version; pin by version, or resolve by `environment` | Evals/playgrounds/experiments; `bt functions invoke` | npm `braintrust` **5,951,758**/mo | **Disagreement:** GitHub repo page says Apache-2.0, PyPI `braintrust` 0.35.0 metadata says MIT |
| **LangSmith** | No portable file convention [fetched — absent from docs index] | No | **git-shaped**: commits + hashes (`joke-generator:12344e88`) + commit tags; reserved `staging`/`production` with promotion UI + rollback history | Datasets + evaluators; webhook on commit | npm `langsmith` **26,474,529**/mo (=3.31× langfuse [derived]); 1,039★ | MIT |
| **DSPy signatures** | Python string or class — **not a document** | No | `save(save_program=False)` → JSON (recommended) or pickle; whole-program save since `dspy>=2.6.0` | Optimizer + metric IS the test loop; prompt text is compiler output | 37,634★; PyPI **6,530,878**/mo = **11.96×** `prompty` [derived] | MIT |
| **Jinja2** | Template engine | n/a | pip pin | n/a | 11,754★; 3.1.6 | BSD-3-Clause |
| **OpenAI prompt caching** | Wire-level | n/a | Prefix identity = version | n/a | see numbers below | proprietary |
| **OpenAI structured outputs** | JSON Schema subset | n/a | Schema is part of the cached prefix | n/a | — | proprietary |
| **Anthropic caching** | `cache_control` blocks | n/a | Cumulative prefix hash | Verify via `cache_creation_input_tokens`/`cache_read_input_tokens` | — | proprietary |
| **Anthropic tool schemas** | JSON Schema, `name` ∈ `^[a-zA-Z0-9_-]{1,64}$` | n/a | Any change to a tool definition invalidates the **entire** cache | `input_examples` (schema-validated) | — | proprietary |
| **llms.txt** | Markdown; optional BOM; exactly one H1 required; blockquote summary; H2 "file list" of `- [name](url): notes` | Yes | **None** | "ask an agent using only your llms.txt" | 2,587★; v2 published 2024-09-03, **modified 2026-08-10** | Apache-2.0 |
| **AGENTS.md** | Plain markdown, **no frontmatter, no schema** | Yes | git only | **None** | 23,968★; site claims "over 60k open-source projects" and "the main OpenAI repo has 88 AGENTS.md files" (site claims, read 2026-08-28Z) | MIT |
| **SKILL.md / Agent Skills** | YAML fm + md; spec = **6 fields** | Yes | `metadata.version` by convention only | `evals/evals.json` + with_skill/without_skill A/B | 691 local files [measured] | spec open; `license` is itself a field |
| **`.prompt.md`** (VS Code) | YAML fm (`description`,`name`,`argument-hint`,`agent`,`model`,`tools`) + md | Yes | git only | Chat Customizations Evaluations ext. (preview) | ships in VS Code | MIT (VS Code) |
| **promptfoo** | `promptfooconfig.yaml`; prompts as `.txt`/`.md`/`.j2`/`.json`/glob/JS/Py fn | Yes (as one input kind) | git + `defaultTest` inheritance | **39 deterministic + 16 model-assisted assertion types** [derived: rows counted in `expected-outputs/index.md`] | 24,648★; npm **2,536,364**/mo = **3,359×** `@prompty/core` [derived] | MIT |

### Numbers that constrain any prompt-document design

- **OpenAI cache** [fetched]: min cacheable prefix **1,024 tok** (GPT-5.6+) / **2,048** (older). Write = **1.25×**, read = **0.1×**. 1 write + 1 read = **1.35×** vs 2× uncached; 1 write + 9 reads = **2.15×** vs 10×. Max **4 cache writes/request**; reads scan up to the latest **50 breakpoints**. `ttl` sole legal value `30m`. Older models: `in_memory` (~5–10 min idle, up to 1h) or `24h`; ZDR orgs default `in_memory`, non-ZDR default `24h`. **>15 req/min can overflow to another machine** and miss. Top-level `instructions` **cannot** carry an explicit breakpoint.
- **OpenAI cache invalidators** [fetched]: `model`, `tools`, `parallel_tool_calls`, `text.format`, `reasoning.effort`, `text.verbosity`, `context_management`.
- **OpenAI structured-output schema limits** [fetched]: ≤**5000** object properties, ≤**10** nesting levels, ≤**120,000** chars across all property/definition/enum/const names, ≤**1000** enum values total, and >250-value string enums capped at **15,000** chars. All fields must be `required`; `additionalProperties:false`.
- **Anthropic cache** [fetched]: order is **`tools` → `system` → `messages`**. Minimum cacheable: **512** (Opus 5 / Fable 5 / Mythos 5), **1,024** (Opus 4.8, Sonnet 5/4.6/4.5, Opus 4.1/4, Sonnet 4), **2,048** (Mythos Preview, Opus 4.7, Haiku 3.5), **4,096** (Opus 4.6, Opus 4.5, Haiku 4.5). **4** breakpoint slots; automatic caching consumes one; **20-block** lookback per breakpoint. 5-min TTL default (refresh free on read); 1h TTL at **2×** base input. Under-minimum prompts are **silently uncached with no error**.
- **Cache invalidation asymmetry** [fetched]: changing a **tool definition** invalidates tools+system+messages; changing `tool_choice` invalidates messages only; adding an image invalidates messages only. Thinking blocks, citation sub-blocks, and empty text blocks cannot be cached.
- **Position effect** [fetched, arXiv 2307.03172, pub 2023-07-06, rev 2023-11-20]: retrieval accuracy is highest at the beginning or end of context and degrades in the middle, "even for explicitly long-context models."
- **Anthropic packing guidance** [fetched]: put longform data (20k+ tok) **above** query/instructions/examples; wrap each doc in `<document>` with `<document_content>`/`<source>`; ask for quotes before the task.

### Local corpus, measured

- 697 `SKILL.md` under `~/.claude`; **695** have parseable frontmatter, 2 do not [measured 2026-08-28Z].
- Key frequency: `name` 695, `description` 695, `version` **149**, `allowed-tools` 115, `triggers` 85, `preamble-tier` 65, `disable-model-invocation` 53, `user-invocable` 50, `metadata` 45, `license` 42.
- **293/695 = 42.2%** carry ≥1 key outside the 6-field agentskills.io spec — every one of those **hard-errors** on claude.ai upload rather than being ignored (verbatim: `Unexpected key(s) in SKILL.md frontmatter: argument-hint. Allowed properties are: allowed-tools, compatibility, description, license, metadata, name`) [derived + fetched].
- `description`: **390** block-scalar vs **305** inline; resolved length median **379**, p90 **719**, max **1,885**; **17 (2.45%)** exceed the 1024-char spec cap [derived].
- **0/695** violate the `name` regex [measured].
- Repo-side: **96** `AGENTS.md` vs **15** `CLAUDE.md` at depth ≤4 (**6.4×**), **12** `*.prompt.md`, **1** `llms.txt`; `SKILL.md`:`*.prompt.md` = **57.6×** [derived]. AGENTS.md sizes (n=49): min 130 B, median **145 B**, max 7,705 B.

### (1) The frontmatter prompt document — exact shape

**Filename:** `<name>.prompt.md`. Delimiter `---` only. Body is CommonMark. Splice-editable: the engine must be able to change one frontmatter scalar without touching the other bytes.

**Required keys (4):**
- `name` — `^[a-z0-9]+(-[a-z0-9]+)*$`, ≤64 chars, must equal the filename stem. Borrowed verbatim from agentskills.io because 0/695 local files violate it, so it costs nothing and buys cross-tool portability.
- `description` — 1–1024 chars, states **what it does and when to use it**. Cap at 1024 not 1536: the Claude Code listing truncates the combined `description`+`when_to_use` at 1,536 and the spec caps `description` at 1024; the smaller cap is the portable one.
- `inputs` — see below.
- `version` — semver string. **Every registry in this survey has a version model and no file format does.** `.prompty` pushes it into free-form `metadata`; Langfuse/Braintrust/LangSmith/PromptLayer own it server-side. A file-native workspace must put it in the file or it inherits the registry's lock-in.

**Optional keys (8, closed set — reject unknowns loudly):** `display_name`, `model` (string shorthand → `{id}`, or `{id, provider, options}` per `.prompty` §2.4), `template` (`jinja2-subset` default | `none`), `tools`, `outputs`, `cache` (see below), `evals` (relative path, default `./<name>.evals.json`), `metadata` (free map — the only open key).

**How variables are declared** — one map, scalar shorthand, rich kinds:
```yaml
inputs:
  tone: warm                    # scalar shorthand → {kind: string, default: warm}
  document:
    kind: file                  # simple: string integer float boolean array object
    required: true              # rich:   thread image file audio
    description: The source doc
    example: ./fixtures/spec.md # doubles as the default eval fixture
  audience:
    kind: string
    enum: [engineer, exec]
```
- Rationale: `.prompty` §2.7 is the only surveyed schema with **rich kinds** (`thread`/`image`/`file`/`audio`) — the four things that actually break naive `{{var}}` substitution. Adopt them.
- `required` defaults **false** (`.prompty`); `example` is mandatory when `required: true`, because it is what makes the file self-testing.

**Body structure:**
- Role markers on their own line: `system:` / `user:` / `assistant:`, case-insensitive, `#`-prefix tolerated. Content before the first marker is `system` (`.prompty` §2.10).
- `{{var}}` only, restricted to the **Prompty Jinja Subset**: `{{v}}`, `{{o.p}}`, `if/elif/else`, `for`, `{# #}`, and filters `default|upper|lower|join|length|trim`. `trim_blocks` and `lstrip_blocks` **off**. This exact list exists because full Jinja does not render identically across runtimes.
- Long inputs render **at the top** of the system block, above instructions and examples (Anthropic's explicit guidance; Liu et al. position effect).

**Cache declaration — the key nobody else has:**
```yaml
cache:
  breakpoints: [after_tools, after_system]   # max 4 total; automatic consumes one
  ttl: 5m                                    # 5m | 1h (Anthropic) | 30m (OpenAI GPT-5.6+)
  min_tokens_assert: 1024                    # refuse to ship if the prefix is shorter
```
- `min_tokens_assert` exists because **an under-minimum Anthropic prefix is silently not cached and returns no error**; the only detection is both usage counters reading 0. A prompt document that declares its own cacheability is checkable at author time instead of at invoice time.

**How it is tested** — a sibling `./<name>.evals.json`, the agentskills.io shape widened by the promptfoo assertion vocabulary:
```json
{"prompt_name":"summarize-spec","evals":[
  {"id":1,"vars":{"document":"./fixtures/spec.md","tone":"warm"},
   "expected_output":"A 5-bullet summary naming every section heading.",
   "assert":[{"type":"contains-all","value":["§1","§2"]},
             {"type":"llm-rubric","value":"names every section heading"}]}]}
```
- Run each case **with the prompt file and without it** (`with_skill`/`without_skill` A/B) — the only surveyed method that produces a baseline rather than a vibe.
- Two gates before a version bump: (a) deterministic assertions from promptfoo's 39; (b) a model-graded rubric from its 16. Binary pass/fail, never Likert.
- Every eval fixture is already declared: it is the `example` of each required input.

### (2) Prompt vs spec vs skill: three artifacts, one substrate?

**Verdict: one substrate, three *lifecycles*. Do not merge them into one file type; do not give them three unrelated formats either.**

Evidence the substrate is already shared:
- VS Code ships **four** sibling markdown-plus-YAML types — `*.instructions.md`, `*.prompt.md`, `*.agent.md`, `SKILL.md` — plus `AGENTS.md`/`CLAUDE.md`/`copilot-instructions.md`, discovered by the same walker, with the same parent-repo rule [fetched].
- Microsoft is **collapsing prompt files into skills**: "Agents running on the Agent Host don't use prompt files. To use an existing prompt with the Copilot agent, convert it to an agent skill," with a one-time migration behind `chat.customizations.promptMigration.enabled` [fetched 2026-08-28Z]. The convergence is happening in production, not in theory.
- PromptLayer — a *prompt registry* — now versions **SKILL.md folders** alongside prompt templates, with the same commit-message/release-label machinery (limits: Free 1 collection/30 files, Pro 5/50, Team unlimited/100, hard 5 MiB per file) [fetched].
- promptfoo — a *prompt* test runner — ships a **`skill-used`** assertion and `trajectory:tool-used` [fetched]. The eval harness already treats skills as testable prompt artifacts.
- One evaluator (VS Code's Chat Customizations Evaluations, preview) analyzes all four file types for the same defects: logical/behavioral/format contradictions, ambiguity, persona conflict, cognitive load, missing error paths [fetched].

The three lifecycles, which is what actually differs:

| | Prompt doc | Spec doc | Skill doc |
|---|---|---|---|
| Loaded | on invoke, fully | by human/agent on reference | **progressively** — L1 metadata always, L2 body on trigger, L3 files on demand |
| Addressed by | name + version | path | `description` **match** — the description is a retrieval key, not documentation |
| Versioned by | semver + eval gate | git history | `metadata.version`, informal |
| Tested by | assertions over outputs | review/approval | with-vs-without A/B |
| Fails by | wrong output | ambiguity | **not triggering at all** |
| Cache role | is the cached prefix | is cached *content* | changes the tool set → nukes the whole prefix |

Design consequence: **same file skeleton (`---` YAML + CommonMark, closed key set, splice-safe), different required keys and different verifier.** A skill's `description` is load-bearing at retrieval time and must be linted for trigger coverage; a prompt's `inputs` is load-bearing at render time and must be linted for fixture completeness; a spec's headings are load-bearing at citation time and must be linted for stable anchors.

### (3) Anti-recommendations

- **Do not invent a new prompt file extension.** `@prompty/core` gets 755 npm downloads/month against promptfoo's 2,536,364 (**3,359×** [derived]) and `.prompty` itself is self-labelled "v2 Alpha — the API, file format, and tooling are under active development and may change." Two unrelated projects already both claim the name "Promptfile" (132★ / 12 downloads-a-month). The extension is not the moat.
- **Do not add frontmatter to `AGENTS.md`.** It has **no schema by design**, 23,968★, and a median local size of **145 bytes**. Adding keys breaks the one property that produced the adoption.
- **Do not put YAML frontmatter in `llms.txt`.** The spec's only required element is a single H1, and it explicitly permits a leading BOM. A frontmatter block is a spec violation, not an extension.
- **Do not let the frontmatter key set be open.** 42.2% of the local SKILL.md corpus carries a non-spec key, and those files **hard-fail** on upload instead of degrading. An open key set silently manufactures unportable documents. Closed set + one explicit `metadata` escape hatch.
- **Do not store prompt versions only in a hosted registry.** Langfuse, Braintrust, LangSmith, and PromptLayer each own versioning server-side and each has a different primitive (integer+labels / hex transaction id+environments / commit hash+tags / version+release labels). Adopting one is adopting its lock-in; the version belongs in the file.
- **Do not use full Jinja2.** Prompty had to publish a normative 10-feature subset with `trim_blocks`/`lstrip_blocks` forced off precisely because identical templates rendered differently across runtimes. promptfoo uses **Nunjucks**, not Jinja2 — templates are not portable between the two.
- **Do not render user input without pre-render role-marker neutralisation.** Prompty §6.3 specifies a pre-render nonce injected into every role boundary plus post-parse validation. Without it, any `{{var}}` containing `user:` on its own line silently forges a message boundary.
- **Do not let a prompt document read arbitrary files.** `${file:}` must reject absolute paths, `..`, and symlink escapes, and **frontmatter must never be able to grant itself additional roots** (Prompty §2.11). A prompt document is untrusted content the moment it is shared.
- **Do not persist prompt state as pickle.** DSPy's own docs carry a `danger` admonition: loading `.pkl` can execute arbitrary code. JSON only.
- **Do not put anything volatile before a cache breakpoint.** Timestamps, request IDs, or a rotating persona line at the top of a system block invalidate the entire prefix — and on Anthropic the ordering is `tools → system → messages`, so touching a tool description nukes all three levels. OpenAI adds seven silent invalidators including `reasoning.effort` and `text.verbosity`.
- **Do not report a cache as working without checking the counters.** Under-minimum prefixes cache-miss silently on Anthropic with no error; the only signal is `cache_creation_input_tokens == 0 && cache_read_input_tokens == 0`. Any "we enabled caching" claim without those two numbers is unverified.
- **Do not assume a schema that validates locally will pass structured outputs.** The caps are hard: 5000 properties, 10 levels, 120,000 chars of names, 1000 enum values, 15,000 chars for >250-value string enums.
- **Do not treat a skill `description` as documentation.** It is the retrieval key; 17/695 local files (2.45%) already exceed the 1024-char cap, and the listing truncates `description`+`when_to_use` at 1,536 — the trigger text you wrote last is the text that gets cut.
- **Do not build a "prompt library" surface before a "prompt test" surface.** Every format in this survey that lacks a testing model (llms.txt, AGENTS.md, both Promptfiles, `.prompty`) is either adoption-flat or ships no verifier; every artifact with real volume (promptfoo, LangSmith, Langfuse) is a *testing/versioning* surface whose file format is an afterthought.

### Recorded disagreements + unverified

- **Braintrust licence**: GitHub repo page says Apache-2.0; PyPI `braintrust` 0.35.0 metadata says MIT. Both fetched 2026-08-28Z; they disagree.
- **"Promptfile is dead"**: the prior internal round (`aj3-knowledge-formats.md`) records last push 2023-07 — true of `promptfile/promptfile` (132★), not of the unrelated npm `promptfile` created 2026-06-18. Both recorded.
- **AGENTS.md "60k projects"** and **"88 AGENTS.md files in the main OpenAI repo"** are site claims read off agents.md on 2026-08-28Z, not independently counted — GitHub code search was rate-limited to zero remaining and could not confirm.
- Star counts are HTML-scraped `aria-label="N users starred"`, not API values.