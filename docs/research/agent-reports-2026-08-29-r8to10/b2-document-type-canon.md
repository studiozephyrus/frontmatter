I made no mutations: read-only curl and stdout only; no file writes, no git commands, no commits — the dirty AIOS CODE tree predates this task.

### Fetch log — what was actually opened

| Source | Method | HTTP | Bytes |
|---|---|---|---|
| `raw.githubusercontent.com/adr/madr/main/template/adr-template.md` | curl | 200 | 1422 |
| MADR `adr-template-minimal.md`, ADR-0008, ADR-0013 | curl | 200 | — |
| `keepachangelog.com/en/1.1.0/` | curl | 200 | 8394 |
| `rfc-editor.org/rfc/rfc7322.txt` (RFC Style Guide) | curl | 200 | 14934 |
| `rfc-editor.org/rfc/rfc2026.txt`, `rfc7991.txt`, `rfc9280.txt` | curl | 200 | — |
| `raw.githubusercontent.com/rust-lang/rfcs/master/0000-template.md` + `README.md` | curl | 200 | 2364 / — |
| `rfd.shared.oxide.computer/rfd/0001` | curl | 200 | 47089 |
| `cucumber.io/docs/gherkin/reference` + `cucumber/gherkin/gherkin-languages.json` | curl | 200 | 14599 / — |
| `sre.google/sre-book/postmortem-culture/`, `/example-postmortem/`, `sre.google/workbook/postmortem-culture/` | curl | 200 | 10019 / — |
| `industrialempathy.com/posts/design-docs-at-google/` | curl | 200 | — |
| `engineering.squarespace.com/blog/2019/the-power-of-yes-if` | curl | 200 | — |
| `blog.pragmaticengineer.com/scaling-engineering-teams-via-writing-things-down-rfcs/` (Uber) | curl | 200 | — |
| `raw.githubusercontent.com/OAI/OpenAPI-Specification/main/versions/3.1.1.md`, `3.2.0.md` | curl | 200 | — |
| `spec.openapis.org/oas/3.1/schema/2022-10-07` | curl | 200 | 3535 |
| `raw.githubusercontent.com/SkeltonThatcher/run-book-template/master/run-book-template.md` | curl | 200 | 4301 |
| `en.wikipedia.org/api/rest_v1/page/html/Software_test_documentation` (IEEE 829, **secondary**) | curl | 200 | — |
| `conventionalcommits.org/en/v1.0.0/` | curl | 200 | — |

Blocked hosts, named and abandoned: `iso.org` **403** (29148 + 29119-3 clause lists never opened); `iso.org/obp` **403**; `huddle.eurostarsoftwaretesting.com` **403** (the 29119-3 Test Plan Template Guide the standard's own site links to); `everyspec.com` **403** (DoD DI-IPSC-81433A SRS DID). `api.github.com` returned **rate limit exceeded** mid-run; substituted GitHub HTML tree listings. [measured]

---

### ADR — MADR form

- Canonical sections, full template, verbatim H2: Context and Problem Statement; Decision Drivers *(optional)*; Considered Options; Decision Outcome; Pros and Cons of the Options *(optional)*; More Information *(optional)*. H3 under Decision Outcome: Consequences *(optional)*, Confirmation *(optional)*. **6 H2 + 2 fixed H3** [derived: counted `## ` = 6, `### ` fixed = 2 in the 1422-byte file]
- Minimal template: **3 H2** (Context and Problem Statement, Considered Options, Decision Outcome) + 1 H3 (Consequences). No frontmatter block at all. [fetched]
- MADR ships **4 template variants**: `adr-template.md`, `adr-template-minimal.md`, `adr-template-bare.md`, `adr-template-bare-minimal.md`. [fetched, GitHub tree]
- Frontmatter keys, verbatim, all declared optional in-file: `status`, `date`, `decision-makers`, `consulted`, `informed` = **5 keys**. [fetched]
- Status value set, verbatim from the template: `{proposed | rejected | accepted | deprecated | … | superseded by ADR-0123}`. The `…` is literal — **the enum is deliberately open**. [fetched]
- Machine-readable standard: **NO.** `raw.githubusercontent.com/adr/madr/main/schema.json` → **404**; `docs/schema.json` → **404**. MADR's own ADR-0013 lists as a con of YAML frontmatter: it "pretends to be more accurate than it can be (e.g., possible status values)". [measured + fetched]
- Render profile: `decision`.

### ADR — Nygard form

- Canonical sections, from the 2011 article's own prose: **Title, Context, Decision, Status, Consequences** = **5**. [fetched]
- Order conflict, both recorded: Nygard's article presents them Title → Context → Decision → Status → Consequences; the widely-copied `joelparkerhenderson` rendering puts **Status second** (Title → Status → Context → Decision → Consequences). These disagree; do not silently pick one. [fetched, both]
- Status values, verbatim: "proposed", "accepted", "deprecated", "superseded" (with a reference to its replacement). [fetched]
- Storage convention, verbatim: `doc/arch/adr-NNN.md`, numbered "sequentially and monotonically. Numbers will not be reused." Superseded records are **kept, not deleted**. [fetched]
- Frontmatter: **none** — Nygard specifies plain Markdown headings only.
- Machine-readable standard: **NO**.
- Anti-recommendation, from the source itself: Nygard writes "Bullets are acceptable only for visual style, not as an excuse for writing sentence fragments." A renderer that bullet-izes Nygard ADRs violates the form. [fetched]

### RFC — IETF form (RFC 7322)

- Canonical structure, §4, **23 listed elements**; **10 marked `[Required]`**: First-page header, Title, Abstract, Status of This Memo, Copyright Notice, Table of Contents, Body of the Memo, Introduction, Security Considerations, Author's Address. Plus **1 conditional** (IANA Considerations `[Required in I-D]`) and **1 on-demand** (RFC Editor or Stream Note `[Upon request]`). [derived: counted the bracket markers in the §4 block]
- Ordering rule, verbatim: within the body the order is "strongly recommended"; **outside the body the order above is required**. [fetched]
- Frontmatter: not YAML. The first-page header carries author/editor, organization, date, Updates/Obsoletes. Machine-readable equivalent is the **xml2rfc v3 vocabulary, RFC 7991** (`<rfc>`, `<front>`, `<seriesInfo>`, `<author>`); RFC 9280 defines the RFC Series model. [fetched]
- Machine-readable standard: **YES, two of them** — RFC 7991 (XML grammar) and `rfc-editor.org/rfc-index.xml` (**2,324,273 bytes**, fetched). Note `rfc-editor.org/refs/ref.fmt` → **404**. [measured]
- State machine: RFC 2026 — Internet-Draft → Proposed Standard → Draft Standard → Internet Standard, plus Experimental / Informational / Historic / BCP. [fetched, §§2–5 headings]
- Render profile: `spec` + `proposal`. This is the **only** doc type here with a normative, versioned, machine-checkable serialization.

### RFC — Rust form

- Canonical sections, **9 H2**: Summary; Motivation; Guide-level explanation; Reference-level explanation; Drawbacks; Rationale and alternatives; Prior art; Unresolved questions; Future possibilities. [derived: counted `## ` in `0000-template.md`]
- Header block is a **4-item bullet list, not YAML**: `Feature Name`, `Start Date`, `RFC PR`, `Rust Issue`. [fetched]
- Each H2 carries a self-link anchor line (`[summary]: #summary`) — a rendering artifact a template must reproduce or the in-doc cross-links break. [fetched]
- State machine: pending → **FCP (final comment period)** with a *disposition* of merge / close / postpone → active. FCP "lasts ten calendar days, so that it is open for at least 5 business days." All subteam members must sign off *before* entering FCP. Closed RFCs may be labelled `postponed`. [fetched]
- Machine-readable standard: **NO** for the document; the *process* state is machine-tracked externally by rfcbot (`rfcbot.rs`), not by the file.
- Render profile: `proposal`.

### RFD — Oxide form

- Metadata: **AsciiDoc attributes**, not YAML frontmatter — `:authors:`, `:state:`, `:discussion:`, `:labels:` = **4 keys**. [fetched, verbatim]
- State machine: exactly **6 states** — `prediscussion`, `ideation`, `discussion`, `published`, `committed`, `abandoned`. [fetched, enumerated in RFD 1]
- Semantics that a state widget must encode: `ideation` ≠ `prediscussion` (no expectation of active revision); `published` is reachable *before* merge and does not freeze the doc; `committed` means fully implemented; `abandoned` means deliberately never implemented. [fetched]
- Canonical body sections: **none prescribed.** RFD 1 gives *content prompts* (viable options with benefits/drawbacks, reasoning with data and references, the determination, plus Economic / Customer outcomes / Performance / Security considerations) but no fixed heading list. [fetched]
- Machine-readable standard: **NO** heading schema; the 4-attribute header is parseable.
- Render profile: `decision` (state-machine-first) — not `proposal`.

### RFC — company-internal, Squarespace and Uber

- Squarespace header fields, verbatim from the post: Primary author(s), Collaborators, Created, Last updated, Status, Approvers *(name / yes-or-not-yet / date table)*, Other reviewer(s) = **7**. [fetched]
- Approval enum is **2 values, deliberately**: `yes` | `not yet`. Verbatim: "the template doesn't suggest 'no'." `Status` is explicitly **free text**, not an enum. [fetched]
- Squarespace added sections: Alternatives Considered/Prior Art, Dependencies, Operational work = **3**. [fetched]
- Uber backend template, **11 sections**: List of approvers; Abstract; Architecture changes; Service SLAs; Service dependencies; Load & performance testing; Multi data-center concerns; Security considerations; Testing & rollout; Metrics & monitoring; Customer support considerations. [derived: counted the list]
- Uber mobile/web template, **11 sections**: List of approvers; Abstract; UI & UX; Architecture changes; Network interactions detailed; Library dependencies; Security concerns; Testing & rollout; Analytics; Customer support considerations; Accessibility. [derived]
- Literal string overlap between the two Uber templates = **5** (List of approvers, Abstract, Architecture changes, Testing & rollout, Customer support considerations). Security appears in both but as different strings — `Security considerations` vs `Security concerns` — so it does not match literally. [derived, string comparison]
- The Squarespace PDF template itself (`/s/Squarespace-RFC-Template.pdf`) was **not opened** — only the blog's prose rendering of its header. [SS on the PDF's full section list]
- Machine-readable standard: **NO**, for both.
- Render profile: `proposal` with a first-class approvers widget.

### Design doc — Google form

- Canonical sections, **5 top-level**: Context and scope; Goals and non-goals; The actual design; Alternatives considered; Cross-cutting concerns. Sub-topics named inside "The actual design": System-context-diagram, APIs, Data storage, Code and pseudo-code, Degree of constraint. [fetched]
- Explicit non-structure, verbatim: "Rule #1 is: Write them in whatever form makes the most sense for the particular project." There is **no canonical heading list** — only "a certain structure has established itself as really useful." [fetched]
- Length guidance, verbatim numbers: "around 10-20ish pages" for a larger project; "1-3 page 'mini design doc'". [fetched]
- Lifecycle, **4 phases**: Creation and rapid iteration → Review → Implementation and iteration → Maintenance and learning. This is a lifecycle, **not** a status enum — no state values are defined. [fetched]
- Frontmatter: **none defined**. Machine-readable standard: **NO**.
- Anti-recommendation, sourced: "A clear indicator that a doc might not be necessary are design docs that are really implementation manuals." Do not ship a template that rewards implementation-manual writing. [fetched]
- Render profile: `proposal`.

### Test plan — IEEE 829

- **IEEE 829-2008 is superseded by ISO/IEC/IEEE 29119-3:2013.** Building a template labelled "IEEE 829" ships a withdrawn standard. [fetched — Wikipedia, **secondary**; the IEEE page at `standards.ieee.org/ieee/829/3787/` returned 200 but rendered site chrome only, no abstract]
- IEEE 829 defines **10 document types**, not one: Master Test Plan (MTP), Level Test Plan (LTP), Level Test Design (LTD), Level Test Case (LTC), Level Test Procedure (LTPr), Level Test Log (LTL), Anomaly Report (AR), Level Interim Test Status Report (LITSR), Level Test Report (LTR), Master Test Report (MTR). [derived: counted the enumerated list]
- LTP required content, verbatim: "scope, approach, resources, and schedule … items being tested, features to be tested, testing tasks, personnel responsible for each task, and the associated risk(s)". [fetched, secondary]
- The standard "specified the format of these documents, but did not stipulate whether they must all be produced, nor did it include any criteria regarding adequate content." [fetched, secondary]
- **The 29119-3 clause list was never opened** — ISO 403, and the standard's own linked Test Plan Template Guide 403. Any section list we ship for 29119-3 is currently [SS]. Do not publish it as canonical.
- Machine-readable standard: **NO**. Frontmatter: none standardized; a real template needs `test_level`, `test_items`, `pass_criteria`, `risks`, `owner` — **our invention** [inference].
- Render profile: `test`.

### Runbook

- **No canonical form. No standard body owns this.** No ISO/IEEE/IETF document defines a runbook. [inference, after finding no standards source]
- Best available community reference opened: Skelton Thatcher `run-book-template` — **65 headings**, **10 H2**: Service or system overview; System characteristics; Required resources; Security and access control; System configuration; System backup and restore; Monitoring and alerting; Operational tasks; Maintenance tasks; Failover and Recovery procedures. [measured: `grep -cE '^#{1,4} '` = 65]
- Google SRE uses the word **"playbook"**, not runbook; the SRE postmortem example's first action item is "Update playbook with instructions for responding to cascading failure." Terminology is not shared. [fetched]
- Frontmatter, our invention: `service`, `owner`, `oncall_rotation`, `sla`, `severity_scope`, `last_verified` [inference].
- Render profile: `ops`. **Recommendation:** make every command block copy-runnable and every procedure a checkbox list; a runbook read as prose fails at 03:00.
- **Anti-recommendation:** do not ship the 65-heading template as a default. It is a system-operation manual, not an incident procedure. Default to the ~10 H2 skeleton, offer the full 65 as an "expand" variant.

### Incident postmortem — Google SRE form

Two Google templates exist and **they disagree**. Record both.

- **SRE Book, Appendix D** (2016) fields: Date; Authors; Status; Summary; Impact; Root Causes; Trigger; Resolution; Detection; Action Items; Lessons Learned {What went well, What went wrong, Where we got lucky}; Timeline. = **12 top-level + 3 sub**. `Status` value observed: "Complete, action items in progress". Action-item table columns: Action Item, Type, Owner, Bug, state — types observed: `mitigate`, `prevent`, `process`, `other`. [derived: counted the rendered appendix]
- I looked for a "Supporting Information" section in Appendix D and **did not find it** — do not include it on my authority. [measured: string search returned NOT FOUND]
- **SRE Workbook, Ch. 10** template (2018): metadata Owner, Shared with, Status, Incident date, Published; body Executive Summary; Problem Summary; Background *(optional)*; Impact; Root Causes and Trigger; Recovery Efforts; Lessons Learned {Things that went well, Things that went poorly, Where we got lucky}; Action Items; Glossary = **9 body sections**. Action-item columns gain **Priority**. `Status` value observed: "Final". [derived]
- The two forms disagree on: Summary vs Executive Summary + Problem Summary; presence of Timeline (book) vs Recovery Efforts + Glossary (workbook); sub-heading wording ("What went well" vs "Things that went well"); presence of Priority.
- Postmortem triggers, verbatim, **5**: user-visible downtime/degradation beyond a threshold; data loss of any kind; on-call engineer intervention; resolution time above a threshold; monitoring failure. [derived: counted]
- Machine-readable standard: **NO** — Google's own tooling (Requiem) "parses out metadata from individual postmortems", i.e. an internal, unpublished parser.
- Render profile: `incident`. **Recommendation:** timeline as a first-class typed structure (UTC timestamps + event), action items as a typed table with `type` ∈ {mitigate, prevent, process, other} and an owner FK — those are the two things Google automates against.
- **Anti-recommendation:** do not ship a "blameless" lint that flags names. Google's own bad-postmortem example is blameful *by containing judgement* ("due to careless ignorance"), not by containing usernames — usernames appear throughout the good one.

### User story + acceptance criteria — Gherkin

- Primary keywords, verbatim: `Feature`, `Rule` (Gherkin 6+), `Example` (or `Scenario`), `Given`/`When`/`Then`/`And`/`But` (or `*`), `Background`, `Scenario Outline` (or `Scenario Template`), `Examples` (or `Scenarios`). Secondary keywords: **4** — `"""` DocStrings, `|` DataTables, `@` Tags, `#` Comments. [fetched]
- Machine-readable standard: **YES** — `gherkin-languages.json` is the normative keyword table: **80 languages**, English entry has **11 keyword keys** + `name` + `native` = **13 keys**. [measured: `len(d)` = 80; counted the `en` object]
- Hard syntactic rules a renderer must honour: some keywords take a trailing colon and some **must not** — "If you add a colon after a keyword that should not be followed by one, your test(s) will be ignored." Indentation may be spaces or tabs, 2 spaces recommended. Block comments **are not supported**. Free-form description text is permitted only under `Example`/`Scenario`, `Background`, `Scenario Outline`, `Rule`. [fetched]
- Frontmatter: **none** — Gherkin has no frontmatter concept. Tags (`@`) are the metadata channel and they are positional, above the element they annotate.
- Status/state machine: **none in the document.** State is the test run result, held outside the file.
- Render profile: `behavior`. **Anti-recommendation:** never let a frontmatter block precede `Feature:` — a `---` fence at line 1 makes the file unparseable by every Gherkin implementation. If we need metadata, it must be tags or a sidecar.
- The "user story" wrapper (As a / I want / So that) has **no canonical source** — it is Connextra-format folklore. Gherkin covers only the acceptance criteria. [inference]

### OpenAPI as a spec artifact

- Latest published version: **3.2.0**. Repo `versions/` holds **9** spec files: 3.0.0–3.0.4, 3.1.0–3.1.2, 3.2.0. Git tags confirm 3.1.1, 3.1.2, 3.2.0. [measured]
- Root object fixed fields, **3.2.0 = 11**: `openapi` **(REQUIRED)**, `$self`, `info` **(REQUIRED)**, `jsonSchemaDialect`, `servers`, `paths`, `webhooks`, `components`, `security`, `tags`, `externalDocs`. **3.1.1 = 10** — identical minus `$self`. Delta = **11 − 10 = 1 field added**. [derived: counted `<a name="oas-` rows in each file]
- Machine-readable standard: **YES, strongest in this set.** `spec.openapis.org/oas/3.1/schema/2022-10-07` → **200, 3535 bytes**; `oas/3.1/dialect/base` → **200, 345 bytes**. Note `oas/3.1/schema/latest` and `oas/3.2/schema/latest` both → **404** — pin the dated URI, do not use `latest`. [measured]
- Frontmatter: the document **is** the frontmatter. `info` carries title/version/description/contact/license.
- Status/state machine: **none.** OpenAPI has no draft/approved state. Any lifecycle we render is our own overlay.
- Render profile: `api`. **Anti-recommendation, sourced from the Google design-doc guidance:** do not inline a full OpenAPI document inside a design doc — "one should withstand the temptation to copy-paste formal interface or data definitions into the doc as these are often verbose … and quickly get out of date." Link it; render it separately.

### Changelog — Keep a Changelog 1.1.0

- Canonical structure: `# Changelog` → intro line → `## [Unreleased]` → `## [version] - YYYY-MM-DD` (reverse chronological) → `### <type>` → bullets. [fetched]
- Change types, exactly **6**, verbatim glosses: **Added** for new features; **Changed** for changes in existing functionality; **Deprecated** for soon-to-be removed features; **Removed** for now removed features; **Fixed** for any bug fixes; **Security** in case of vulnerabilities. [derived: counted]
- Guiding principles, exactly **7**: for humans not machines; an entry for every single version; same types of changes grouped; versions and sections linkable; latest version first; release date displayed; mention whether you follow SemVer. [derived: counted]
- Machine-readable standard: **NO.** Principle #1 is literally "Changelogs are **for humans**, not machines." Dates are ISO 8601, versions are SemVer, link references are Markdown reference links — all parseable in practice, none normative. Adjacent machine-readable convention: **Conventional Commits 1.0.0** (`<type>[scope]: <description>`, `fix`/`feat`/`BREAKING CHANGE`, plus 8 recommended extras: build, chore, ci, docs, style, refactor, perf, test). [fetched]
- Frontmatter: **none.** Adding YAML frontmatter to `CHANGELOG.md` breaks convention and most parsers.
- Status/state machine: `Unreleased` → versioned release. "Yanked" releases are a documented concept. [fetched]
- Render profile: `release`. **Recommendation:** render `## [Unreleased]` as a persistent pinned block and auto-generate compare links from the version anchors — that is the only mechanically derivable part.

### Types with NO canonical form — we would be inventing

| Type | Canonical source? | What actually exists |
|---|---|---|
| **PRD** | **NONE.** No standards body, no reference template opened, none exists. | Vendor blog templates only. Every "PRD standard" claim is [SS] at best. |
| **FRD** | **NONE.** Not a standardized artifact; the term is defence/enterprise-consulting folklore. | Overlaps SRS "Specific requirements" clause. |
| **TRD** | **NONE.** No standard. | Closest standardized neighbour is SRS. |
| **SRS** | **Partial, paywalled.** ISO/IEC/IEEE 29148:2018 exists; **`iso.org` 403 — clause list never opened.** IEEE 830-1998 is withdrawn. | The section list circulating (Purpose / Definitions / Background / System overview / Overall description / Specific requirements / …) is [SS] via a secondary encyclopedia page citing SWEBOK, **not** the standard. |
| **Runbook** | **NONE.** | Skelton Thatcher template [fetched], Google's "playbook" [fetched]. |
| **User story wrapper** | **NONE.** | Gherkin covers criteria only [fetched]. |
| **Design doc** | **NONE, by design.** | Google's article explicitly refuses to prescribe [fetched]. |
| **Company-internal RFC** | **NONE.** | Squarespace and Uber shapes are two data points that share 5 literal strings [derived]. |

### Render-profile map

| Profile | Types | Load-bearing widget |
|---|---|---|
| `decision` | MADR, Nygard, Oxide RFD | status chip + supersession edge + decision-log index |
| `proposal` | IETF RFC, Rust RFC, Squarespace/Uber RFC, Google design doc | approvers block, discussion link, FCP countdown |
| `spec` | SRS, TRD, FRD, IETF RFC | requirement-ID table + traceability |
| `behavior` | Gherkin | keyword-aware syntax render, tag filter |
| `api` | OpenAPI | operation explorer + schema tree, validated against the dated JSON Schema |
| `ops` | Runbook | checkbox steps, copy-run command blocks |
| `incident` | SRE postmortem | UTC timeline + typed action-item table |
| `test` | Test plan | test-item / pass-criteria tables |
| `release` | Keep a Changelog | pinned Unreleased, version anchors, compare links |

Profile names and assignments are **[inference]** — ours, not sourced.

### Recommendations, ranked

Ship in this order: (1) **OpenAPI** and (2) **Gherkin** first — both have a fetched, versioned, machine-readable normative artifact, so the template can be *validated*, not merely rendered. (3) **MADR** and (4) **Keep a Changelog** next — no schema, but a fully specified section list and enum from a single primary source. (5) **IETF RFC** — fully specified but heavy; only worth it if someone actually writes Internet-Drafts. (6) **Google SRE postmortem** — ship the **Workbook** variant, not the Book variant, and label the version, because the two disagree.

### Anti-recommendations, all four load-bearing

1. Do **not** label anything "IEEE 829" — it is superseded and it defines 10 documents, not a test plan.
2. Do **not** publish a 29119-3 or 29148 clause list until someone opens the paywalled text. Both are currently [SS]; both hosts returned 403 here.
3. Do **not** attach YAML frontmatter to `CHANGELOG.md` or to `.feature` files. Both break their format.
4. Do **not** present PRD / FRD / TRD / runbook / user-story templates as "canonical." Label them **house convention**. Four of the fourteen requested types have no canonical form at all, and a fifth (SRS) has one nobody in this session could open.