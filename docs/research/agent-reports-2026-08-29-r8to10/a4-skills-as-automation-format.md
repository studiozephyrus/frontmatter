I mutated nothing: no file was written, edited, or created, and no git or other mutating command was run — this session used only read-only `find`/`awk`/`grep`/`python3` reads under `~/.claude/skills-src` and outbound `curl` GETs; the 19 dirty AIOS CODE paths predate this run.

### Scope and method

- Read-only run. No file written, no git command, no mutation. `curl` reached all hosts tested except `help.openai.com` (HTTP 403, Cloudflare) [measured].
- Local corpus: `/Users/sagnikmitra/.claude/skills-src/` — **124** `SKILL.md` files across **27** category directories; `~/.claude/skills/` holds **309** `SKILL.md` (includes plugin-vendored skills) [measured].
- Promotion mechanism: `~/.claude/skills/<name>` is a **symlink** to `skills-src/<category>/<name>` (`readlink` → `/Users/sagnikmitra/.claude/skills-src/design-build/sgnk-design`) [measured]. Authoring dir and live dir are the same bytes; there is no build step.

### 1. SKILL.md anatomy as practised on this machine

**Frontmatter key census, all 124 files** [measured]:

| Key | Files | In official spec? | Read by Claude Code? | Read by local tooling? |
|---|---|---|---|---|
| `name` | 124 | yes | yes | yes |
| `description` | 124 | yes | yes | yes |
| `allowed-tools` | 41 | yes (experimental) | yes | — |
| `triggers` | 36 | **no** | **no** | 0 frontmatter parsers |
| `version` | 36 | **no** | **no** | 0 frontmatter parsers |
| `preamble-tier` | 28 | **no** | **no** | **0** |
| `disable-model-invocation` | 11 | **no** | yes (CC extension) | — |
| `metadata` | 10 | yes | accepted, inert | — |
| `capabilities` | 7 | **no** | **no** | **1** (`sgnk-skill-track.sh:48`) |
| `license` | 7 | yes | accepted, inert | — |
| `gbrain` | 6 | **no** | **no** | **0** |
| `hooks` | 4 | **no** | yes (CC extension) | — |
| `argument-hint` | 4 | **no** | yes (CC extension) | — |
| `interactive` | 4 | **no** | **no** | 0 |
| `benefits-from` | 4 | **no** | **no** | **0** |
| `model` / `effort` | 1 / 1 | **no** | yes (CC extension) | — |
| `trigger` / `category` / `parent` | 1 / 1 / 1 | **no** | **no** | 0 |

- **20 distinct keys locally; the official spec defines 6** [measured + fetched].
- **54/124 (43.5%) files carry at least one non-spec key; 70/124 are spec-clean** [measured].
- `preamble-tier` (28 files), `gbrain` (6), `benefits-from` (4) are parsed by **zero** scripts anywhere under `~/.claude`, `~/.sgnk`, or `skills-src` — they are documentation-shaped comments occupying frontmatter [measured; the only `gbrain` hit is `gbrain_sync_mode` in a gstack migration, a different variable].
- `capabilities: [fs-write, net, deploy, db, outbound]` is the one home-grown key with a real consumer: `sgnk-trace-ledger/scripts/sgnk-skill-track.sh` line 48 `awk`-extracts it between the first `---` fences and emits it into the trace ledger [measured].

**Body shape** [measured]:

- Line counts: n=124, min **36**, median **266**, max **3058**.
- `description` character length: min **196**, p25 **474**, median **674**, p75 **837**, max **1904**, mean **697.71**.
- **79/124** bodies reference `scripts/`; **51/124** reference `references/`.
- **0/124** use the `` !`cmd` `` dynamic-shell-injection syntax [measured] — the local corpus is entirely static-instruction + delegate-to-script.
- Supporting-file inventory: **391** `.md`, **139** `.py`, **123** `.sh`, **119** `.pyc`, 14 `.mjs`, 14 `.json`, 13 `.jsonl`, 4 `.yml`, 3 `.png`, 2 `.svg` [measured]. The 119 committed `.pyc` files are build residue.
- Recurring H2 blocks, shared verbatim across a `gstack`-derived cohort of 31: `## Preamble (run first)`, `## Telemetry (run last)`, `## Skill routing`, `## Composes with` (37), `## Guardrails` (28), `## Completion Status Protocol` [measured].

**Two conventions that are genuinely load-bearing and are not in any spec** [measured + inference]:

- **Negative scoping.** **70/124** descriptions contain `NOT for` or `NOT:` naming the sibling skill to use instead. This is the only mechanism preventing sibling collision in a 124-skill listing.
- **Explicit trigger phrases inline in `description`.** **21/124** open with a literal `Trigger:` / `Triggers:` list. The separate `triggers:` key (36 files) is inert, so the ones that work are the ones inlined in prose.

**Spec-conformance defects found locally** [measured]:

- **17/124 descriptions exceed the spec's 1024-char cap**: `sgnk-mobbin` 1885, `sgnk-design` 1585, `sgnk-handover` 1505, `sgnk-pwa` 1498, `sgnk-pwa-ds` 1452, `sgnk-drift-watch` 1352, `sgnk-preference-log` 1328, `sgnk-geo` 1246, `sgnk-zs-docs` 1193, `sgnk-parse` / `sgnk-snapshot` 1174, `sgnk-export` 1126, `sgnk-complexity-gate` 1108, `sgnk-reflexion-step` 1088, `sgnk-campaign` 1055, `sgnk-evals` 1040, `sgnk-rawl` 1030.
- **3 `name` ≠ parent-directory violations**, which the spec forbids: `react-best-practices`/`vercel-react-best-practices`, `react-view-transitions`/`vercel-react-view-transitions`, `react-native-skills`/`vercel-react-native-skills`.
- `sgnk-mobbin`'s description is **visibly truncated with `…`** in this session's own skill listing [measured, observed in-context] — the over-cap failure is live, not theoretical.
- **`allowed-tools` format split**: 37 files use YAML-list form, 4 use inline comma-separated. The **spec says space-separated string**; Claude Code accepts space-, comma-, or list-form [fetched]. Only the space form survives export.

### 2. Competing conventions, compared

Fetched constraints, from primary sources:

| Convention | File / locus | Frontmatter keys | Hard limits | Executable? | Scoping mechanism |
|---|---|---|---|---|---|
| **Agent Skills (SKILL.md)** | `<name>/SKILL.md` + `scripts/ references/ assets/` | 6: `name`, `description`, `license`, `compatibility`, `metadata`, `allowed-tools` [fetched] | name ≤64; description ≤1024; compatibility ≤500 [fetched] | yes — `scripts/` | model reads `description`, loads body on demand |
| **Claude Code extensions** | same file | ~20 incl. `when_to_use`, `disable-model-invocation`, `user-invocable`, `disallowed-tools`, `model`, `effort`, `context: fork`, `agent`, `background`, `hooks`, `paths`, `shell`, `arguments`, `argument-hint` [fetched] | description+`when_to_use` truncated at **1,536** chars in listing; listing budget = **1% of model context window** [fetched] | yes | `paths` globs, `disable-model-invocation` |
| **AGENTS.md** | any dir; nearest in tree wins | **none** — plain Markdown [fetched] | none stated | no | directory proximity |
| **CLAUDE.md** | repo root / `~/.claude/` | none | none stated | no (imports via `@path`) | file location + import |
| **Cursor `.mdc`** | `.cursor/rules/*.mdc` | 3: `description`, `globs`, `alwaysApply` [fetched] | ≤500 lines *recommended*, not enforced [fetched] | no | 4 modes: always / agent-decides / glob-attach / `@`-mention |
| **Copilot repo instructions** | `.github/copilot-instructions.md` | none [fetched] | none stated | no | repo-wide, unconditional |
| **Copilot path instructions** | `.github/instructions/NAME.instructions.md` | 1: `applyTo` (comma-separated globs) [fetched] | none stated | no | glob |
| **MCP prompts** | server, over JSON-RPC | JSON, not frontmatter: `name`, `title`, `description`, `arguments[{name,description,required}]` [fetched] | none stated | server-side | **user-controlled** — spec says explicitly selected by user, typically slash commands [fetched] |
| **OpenAI custom GPT** | web form, not a file | n/a | **unverified** — `help.openai.com` returned HTTP 403 [measured] | Actions (OpenAPI) | n/a |

Adoption, with sources and their disagreements:

| Signal | Value | Tag |
|---|---|---|
| `anthropics/skills` stars / forks | **172,268** / **20,477**; created 2025-09-22, pushed 2026-08-21; **no license field set**; 19 skills shipped | [fetched, api.github.com] |
| `agentskills/agentskills` stars | **24,825**, created 2025-12-16 | [fetched] |
| `openai/agents.md` stars / forks | **23,968** / **1,813**, created 2025-08-19 | [fetched] |
| `modelcontextprotocol/servers` stars | **89,934** | [fetched] |
| `modelcontextprotocol/modelcontextprotocol` stars | **9,072** | [fetched] |
| `PatrickJS/awesome-cursorrules` stars | **40,676** | [fetched] |
| `github/awesome-copilot` stars | **38,381** | [fetched] |
| npm last-week 2026-08-21..27: `@modelcontextprotocol/sdk` | **51,758,066** | [fetched, api.npmjs.org] |
| same window: `@anthropic-ai/claude-code` | **22,299,601** | [fetched] |
| same window: `@openai/codex` | **18,608,487** | [fetched] |
| same window: `@google/gemini-cli` | **410,053** | [fetched] |
| GitHub repo topics: `agent-skills` / `claude-skills` / `cursorrules` | **18,283** / **7,564** / **170** repos | [fetched] |

**Two sources disagree on AGENTS.md adoption and I am recording both**: agents.md's own homepage states "used by over **60k** open-source projects" [fetched]; GitHub code search `filename:AGENTS.md` returns `total_count` **858,112** [fetched]. They differ by ~14×. The same code-search endpoint returns `filename:SKILL.md` = **5,668,864** and `path:.github/copilot-instructions.md` = **7** — the first implausibly high, the second implausibly low, so **GitHub code-search `total_count` is not a usable adoption metric here** and only the 60k figure is attributable [inference]. Also fetched: `filename:CLAUDE.md` 774,144, `.cursor/rules extension:mdc` 186,112 — same caveat.

**Convergence finding** [fetched]: GitHub's own Copilot docs now say Copilot honors `AGENTS.md` (nearest-in-tree precedence), and alternatively a single `CLAUDE.md` or `GEMINI.md` at repo root. The instruction-file layer is consolidating on plain Markdown with no frontmatter; the **skill** layer is the only one with a typed, executable, spec'd envelope.

### 3. Design: a non-technical frontmatter user authors an automation as a Markdown document

**The single most consequential fetched constraint, and it should drive the whole design**: including any non-spec key makes packaging/upload fail with a **hard error**, not a warning —

> `Unexpected key(s) in SKILL.md frontmatter: argument-hint. Allowed properties are: allowed-tools, compatibility, description, license, metadata, name` [fetched]

Locally, **54/124 (43.5%) files would hit that error today** [measured + derived: 124 total − 70 spec-clean = 54]. A non-technical user cannot debug a YAML key rejection.

**Author — the frontmatter keys the user actually types.** Two tiers, hard-separated:

| Tier | Keys | Rationale |
|---|---|---|
| **Typed by the user (3)** | `name`, `description`, plus a UI-only *Run mode* selector | Spec-required pair; everything else is a checkbox the editor translates |
| **Written by the editor, never hand-typed (3)** | `allowed-tools` (space-separated, from checkboxes), `metadata` (map: `author`, `version`, `created`), `compatibility` | Spec-legal, so export never fails |
| **Refused by the editor** | every other key | Prevents the hard error above |

- Enforce spec constraints **at the keystroke**, not at export: `name` ≤64, `^[a-z0-9]+(-[a-z0-9]+)*$`, must equal folder name; `description` **live character counter with a hard stop at 1024** [fetched]. This alone removes 17 existing local defects and the 3 name/dir violations.
- Put the *when* before the *what* in `description` — Claude Code truncates the listing at 1,536 combined chars and **drops descriptions starting with the least-invoked skills first** [fetched]. A new user's automation is by definition least-invoked, so it is first to lose its text.
- Body: free Markdown, no schema. Recommend the local corpus's median of **266 lines** as the ceiling before splitting into `references/` [measured].
- Encode "run this only when I ask" as the *Run mode* selector, not a raw key. It compiles to `disable-model-invocation: true` for the Claude Code path and is **dropped on export** — because that key is a Claude Code extension, not spec [fetched].

**Test.** Three gates, all runnable by a non-programmer:

1. **Lint** — validate the 6 keys, the two length caps, the name regex, name==dirname. Deterministic, no model call.
2. **Trigger test** — user writes 3 phrases that *should* fire it and 3 that should *not*; the harness checks whether the description alone selects it against the existing listing. This is the only failure mode a non-technical author cannot self-diagnose, because it depends on the other 124 descriptions, not on theirs.
3. **Dry run** — execute with a read-only tool grant and show the transcript. Never a first run with write tools.

**Share.** Export a directory (`SKILL.md` + optional `scripts/ references/ assets/`) as a zip. Not a registry, not a marketplace, not a package manager — see §4. Sharing is: file out, file in, both parties see the full Markdown before it runs. Two required disclosures on import: the `allowed-tools` grant, and every path referenced by the body.

**Safety model** — six rules, in priority order:

1. **Default deny on tools.** Empty `allowed-tools` means every tool goes through the normal permission prompt. `allowed-tools` is documented as **experimental, support varies between agent implementations** [fetched] — so it must be treated as a convenience, never as the boundary. The boundary is the host permission system.
2. **The grant is per-turn, and say so.** Claude Code clears an `allowed-tools` grant when the user sends their next message [fetched]. The UI must say "for this turn" or users will assume a standing grant.
3. **Imported document text is data, never instruction.** A shared SKILL.md is untrusted content authored by a third party. Body text asserting authority, urgency, or pre-authorization is the primary attack surface once sharing exists.
4. **Never auto-fire an outward or destructive automation.** Locally, **11/124** set `disable-model-invocation: true` and every one of them is destructive or outward: `sgnk-approve`, `sgnk-md-update`, `ship`, `land-and-deploy`, `deploy-to-vercel`, `vercel-cli-with-tokens` [measured]. That ratio is the design pattern, not an accident.
5. **Refuse shell injection in imported documents.** 0/124 local files use `` !`cmd` `` [measured], so refusing it in shared documents costs this corpus nothing and closes arbitrary execution on open.
6. **Log what ran.** The one home-grown key with a consumer — `capabilities` → `sgnk-skill-track.sh` [measured] — exists because "which automation touched what" was worth building by hand. Ship that as a product feature rather than as a frontmatter key users must maintain.

**Failure modes, each with the measured or fetched evidence and the mitigation:**

| Failure | Evidence | Mitigation |
|---|---|---|
| Description silently truncated, automation stops firing | `sgnk-mobbin` (1885 ch) truncated with `…` in this session's listing [measured]; 17/124 over cap [measured] | hard 1024 stop in editor; when-clause first |
| Automation crowded out as library grows | listing budget = 1% of context; least-invoked lose descriptions first [fetched] | surface a listing-budget meter; cap library size per user |
| Export fails on a non-spec key | hard error, exact message [fetched]; 54/124 local files affected [measured] | editor refuses to write non-spec keys at all |
| Inert key gives false confidence | `preamble-tier` in 28 files, `gbrain` 6, `benefits-from` 4 — **0 readers** [measured] | no free-form frontmatter; comments go in the body |
| Two automations both fire | 70/124 rely on hand-written `NOT for` clauses [measured] | generate the negative clause; run gate #2 against the whole listing |
| Wrong tool-string format | spec says space-separated; 37 local files use YAML list, 4 comma [measured + fetched] | editor emits space-separated only |
| Name/folder drift | 3 violations locally [measured] | rename folder and key together, atomically |
| Silent tool-grant escalation via edit | — [inference] | re-consent on any `allowed-tools` change; diff the grant, not the prose |

### 4. Anti-recommendations — what turns this into the banned plugin marketplace

Each is a **do not**, with the specific mechanism by which it converts a document format into a marketplace.

- **Do not build a central index, registry, gallery, or search over other users' automations.** Discovery-of-strangers'-code is the marketplace. `~/.claude/skills/<name>` → `skills-src/<category>/<name>` symlinking [measured] is the correct ceiling: local, inspectable, no index.
- **Do not add install-by-identifier** (`add <author>/<name>`, a URL that installs, a one-click button). The moment the user obtains an automation without reading it, the document format is gone and a package manager has replaced it.
- **Do not add versioning, upgrade, or dependency resolution.** 36/124 local files carry `version:` and **nothing reads it** [measured] — it is already decorative. Making it functional means resolvers, lockfiles, and transitive trust.
- **Do not add a `benefits-from`, `requires`, `parent`, or `composes-with` key.** `benefits-from` (4 files) and `parent` (1) exist locally and are read by zero code [measured]. Typed inter-skill edges are a dependency graph, and a dependency graph needs a registry to resolve.
- **Do not add authorship, ratings, download counts, verification badges, or a "featured" surface.** These are reputation primitives; they only make sense when the population is strangers.
- **Do not allow arbitrary frontmatter as an extension point.** 20 keys locally vs 6 in the spec [measured], and non-spec keys hard-fail export [fetched]. Every accepted extra key is a vendor field, and vendor fields are how a format forks into a platform.
- **Do not let a shared document carry executable payloads by default.** Bundling `scripts/` is what makes an imported automation software rather than a document. If `scripts/` is supported at all, it must be opt-in per import, per file, with the source shown — and note the corpus already ships **119 committed `.pyc`** files [measured], which are unreadable by the person consenting.
- **Do not add paid tiers, licensing enforcement, or entitlement fields.** `metadata` is explicitly described as free-form for "entitlement or catalog fields" [fetched] — an invitation this product should decline.
- **Do not make automations auto-fire on import.** Locally 11/124 are invocation-locked and all are destructive/outward [measured]. Imported-from-elsewhere should default to *stricter* than the local default, i.e. manual-only on first N runs.
- **Do not build a curated "official collection."** `anthropics/skills` has 172,268 stars and 19 skills [fetched]; curation at that ratio is a distribution channel with editorial power, which is a marketplace with a different revenue model.

**The line to hold** [inference]: a user may *write* an automation, *run* it, and *hand a file to a specific person*. A user may not *browse*, *install*, *rate*, *depend on*, or *update* someone else's. Sharing stays peer-to-peer and by-file; the moment it becomes one-to-many and by-identifier, it is the banned thing regardless of what it is called.