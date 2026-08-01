# HANDOFF — MDMAX / the frontmatter markdown engine

**Written** 2026-08-01 · **Repo** `/Users/sagnikmitra/Desktop/GitHub/frontmatter`
**Branch** `engine/plan-and-diagnostics` · **HEAD** `798ebbf`
**Supersedes** `HANDOFF-mdz-markdown-format-2026-07-29.md` and `HANDOFF-graph-engineering-research-2026-07-30.md`
(both still on disk, both still untracked — do **not** delete them, this doc cites them)

> **READ THIS IN FULL BEFORE TOUCHING ANYTHING.** This is a no-skim handoff. The short version
> is at §0 but the corrections in §6 and the open decisions in §11 are the parts that will
> waste your time if you skip them.

---

## §0 — Orientation in ten lines

1. This is **the markdown engine**, not the editor. The editor (`frontmatter`) is a separate track.
2. **Zero engine code exists.** 1,748 lines of plan, 789 lines of master plan, 0 lines of `core/`.
3. 16 commits ahead of `main`. All of them are **docs + two bug fixes**. `main` is untouched.
4. ~2.4M tokens of research across ~26 agents + one 25-agent workflow. Nearly all of it is recorded.
5. **Two load-bearing claims in the plan were refuted on 2026-08-01 and are NOT yet corrected in the files.** See §6. This is the single most important thing in this document.
6. The product concept is now called **MDMAX**. The name is free on npm and PyPI (verified §9).
7. Test suite is green: **65 test files**, 3,604 tests passing at last full run.
8. There are **3 uncommitted changes** and 2 of them need a decision. See §10.
9. Ten verified bugs in shipped editor code are documented and **none are fixed**. See §8.
10. The user's token budget on the originating account ran out. That is why this exists.

---

## §1 — What this project is

**The engine.** A markdown compiler whose unit is the **block**, not the file. Three inventions:

- **Content-derived re-anchoring** — a block keeps identity across the git boundary, where no op-stream exists. Measured **99.627% correct / 0.050% false / 0.323% refusal** over 41,642 block-versions from 294 real revision pairs, parameters chosen by a 384-configuration sweep. ~41 ms for a 446 KB document. **All 14 false matches hand-audited, not sampled** → genuine substantive errors: 10 in 28,170 = 0.036%.
- **Splice-only writing** — never regenerate from the AST. This is a theorem, not a preference (Foster et al., TOPLAS 2007, Lemma 3.9). Measured: **443 of 655 CommonMark spec examples are two distinct source strings with a byte-identical AST**; a zero-edit round trip of a real 206 KB doc rewrites 24.98% of lines and drops 18.94% of bytes; **0 of 51 files** in this repo survive `parse → stringify` byte-identically.
- **Diagnostics no HTML-level tool can see** — axe-core fires **7 of its 105 rules** on 2,286 rendered markdown files, and 98.5% of 11,695 violations trace to two causes in page chrome. Every content-level markdown defect scores zero, because `![](x)` compiles to `alt=""` which is *valid* — it asserts "decorative."

**The invariant that governs everything:** the file stays ordinary `.md`. Degradation is the feature.

**Canonical documents:**

| file | what it is |
|---|---|
| `docs/engine/PLAN.md` | 1,748 lines, v0.6.0, §0–§17. The technical design of record. Every measurement. |
| `docs/engine/README.md` | 789 lines. The readable master plan / front door. |
| `docs/engine/sgnk-markdown-engine-dossier.pdf` | 11pp A4, sgnk-design, Mosvita. The presentation artifact. |
| `docs/engine/dossier.html` | same content, web chassis |
| `docs/engine/build/` | regenerates the PDF + the overflow checker |
| `docs/FRONTMATTER-PRODUCT-PLAN.md` | demand-side research. **Governs the editor track.** |

---

## §2 — Chronological walk of the session

### 2.1 Resume from the mdz handoff
Session opened pointed at `HANDOFF-mdz-markdown-format-2026-07-29.md` (830 lines) with instructions to read it in full, re-verify every live number, and work its §7 in order. Confirmed read; stated a resume plan before changing anything.

### 2.2 The scope correction — user's exact words
> *"Front Matter we are building separately. This will be the backbone of frontmatter. Front Matter is just an editor. Check the MD project first. Front Matter will be just a clone of that. This is the markdown engine that we are gonna build, okay? The new markdown, basically... Before building anything, let us just have the plan sorted properly: what exactly we are gonna build."*

This is the founding constraint. Everything after it treats engine and editor as separate tracks.

Three other answers given in the same turn: drift handling = *"Both, gated by confidence"*; competitors (mdbase, Obsidian) = *"Route around both"*; naming = *"No separate name — it's just frontmatter"* (later revised to MDMAX, §9).

### 2.3 Commits: plan + two real bug fixes
- `5ff90a4` markdown-map concept tree + engine plan v0.2
- `58322f7` **fix(vault,graph)** — index code content; report unresolved links. Two real bugs: code/table content was deleted before indexing (`extractBodyText` stripped fences and spans), and `graph-data.ts` silently dropped unresolved links (`if (targetPath === undefined) continue`).
- `33d1b3c`, `57411a1`, `ae81971` — §12 token corrections, §11a block-as-identity, §1.1a the anchor algorithm.

### 2.4 The graph-engineering fold-in
Second handoff folded in as §14. Key correction kept: *"graph engineering"* is a **community coinage that trended mid-July 2026, not an Anthropic release** — the patterns are from *Building Effective Agents* (Dec 2024). Verified the flagged `[UNVERIFIED]` item (an editor-side AI-review orchestrator) is genuinely absent from the code. Flagged a **live architecture conflict**: `PRODUCT-PLAN §4b` says "No peer CRDT," `PLAN.md §8` specifies Eg-walker/Braid. **Still unresolved.** Commits `575768e`, `c847f62`.

### 2.5 The search fix
`6ef83a9` — three-pass search (precision → recall → typo tolerance). The old single pass was `{prefix: true, fuzzy: 0.2}` over an implicit OR; measured against a relevance set built from the vault's own wikilinks, a sentence lifted verbatim from a note ranked that note first **0.33% of the time**. My own first fix was broken and my own test caught it: length-gated fuzzy gave long terms no tolerance. Fixed by reading MiniSearch source — `fuzzy: 1` is an *absolute* edit distance.

### 2.6 The extensibility challenge — user pushed back and was right
> *"I'm unable to understand one thing. If Markdown is just the pre-processor of the representation... why can't we find more such representations?"*

then, decisively:

> *"we are still doing way less research than we should be... research more deeply, and research more openly. Don't just form an opinion just because you have to. I am absolutely fine with being proven wrong that we can't do, but at least let's push and improve how we pass Markdown."*

**This turn changed the project.** Five agents were briefed to argue *for* extension against the prior. Result: §15, which overturned §10's "no new extension mechanism." Commit `f60eac0`.

### 2.7 The six-area utilization sweep
Construct frequency · plugin ecosystems · security · accessibility · i18n · domain conventions. Produced §16 (`c565be9`) and §17 (`525ad98`), plus `eadbf6f` — a DOM-verified XSS regression corpus, 55 payloads, **proven to fail 28/55 against a neutered policy** (LR#68 discipline: make the test fail against unfixed code before trusting a pass).

### 2.8 The master plan and the dossier
`9055884` README.md master plan. `8c0a426` the 12-page PDF in sgnk-design with Mosvita. `88a92f4` removed cover + logo on request (12pp → 11pp). `798ebbf` fixed page overflow, measured not eyeballed — a puppeteer script reports per-page clearance; found **page 11 at −258px and page 7 at −33px**, split the overflowing section rather than deleting the benchmarks table.

### 2.9 The MDMAX concept
User reframed the product:
> *"we generally share PDF or markdowns or PPT... AI need to process those PDFs. So why can we have this custom rendered markdowns... one single file for everything... this is markdown maxing... MDMAX."*

And the library idea:
> *"if it is a library importing things and people are not jargon at all they can use features that they want to... in Python there are thousand libraries people might use hundreds only."*

### 2.10 Second research wave (7 agents)
Token economics · multi-document packing · dual-view · AI-emitted markdown · prompt-cache layout · chunking/retrieval · agent-harness formats · semantic density · formatting bias · instruction-data separation · folklore origin trace.

### 2.11 The MDMAX foundations workflow — 2026-08-01
**Workflow `wf_3b9ab146-77b`. 25 agents · 3,059,467 subagent tokens · 736 tool uses · 1,872,350 ms · 0 errors.**
Six areas: package/import model · format governance · transitive doc graphs · editor frontier · AI-to-AI · adversarial gap audit.
Journal: `~/.claude/projects/-Users-sagnikmitra-Desktop-GitHub-frontmatter/2e90ab3b-4a90-4362-bce4-042a842a2af5/subagents/workflows/wf_3b9ab146-77b/journal.jsonl`
Extracted findings: `/tmp/claude-501/wf-findings.md` (127,865 chars — **copy this somewhere durable, `/tmp` is volatile**).

> ⚠️ The workflow's synthesis agent returned a status note (*"Reconciliation clean. No mutations or commits by this subagent. Deliverable delivered."*) instead of its synthesis. The real content is in the journal. This is a known failure mode of free-text agent returns; schema-forced agents did not exhibit it.

---

## §3 — Measurements table (VERIFIED — all re-derived in the main loop)

| # | measurement | value | where |
|---|---|---|---|
| 1 | anchor: correct / false / refusal | **99.627% / 0.050% / 0.323%** | PLAN §1.1a |
| 2 | byte offset baseline | 36.93% correct, **62.12% FALSE** | PLAN §1.1a |
| 3 | CommonMark examples with ambiguous source | **443 of 655** | PLAN §1.2 |
| 4 | files surviving AST round trip | **0 of 51** | PLAN §1.2 |
| 5 | Obsidian catalogue | 6,047 matched / **6,222 listed** | verified live |
| 6 | plugin demand that is a FORMAT gap | **40.1%** of 132,834,339 downloads | PLAN §16.1 |
| 7 | axe rules firing on markdown | **7 of 105** | PLAN §17.7 |
| 8 | Bengali NFC phantom diff | **77 of 437 lines** | PLAN §17.1 |
| 9 | container overhead | **+0.99%**, 6/6 byte-identical | PLAN §5 |
| 10 | markdown vs TS line uniqueness (non-blank) | **84.8% vs 78.1%** | PLAN §8 |
| 11 | merging N docs into one file | **+0.61%** (saves nothing) | agent, verified |
| 12 | re-representation saving | **−28.7%** | agent, verified |
| 13 | prompt-cache read multiplier, all 3 vendors | **0.10×** | verified |
| 14 | cache vs re-representation, asymptotic | **86.0% vs 28.7%** (~3×) | recomputed |
| 15 | cache + re-representation combined | **92.9%** | recomputed |
| 16 | cache eviction threshold | **p\* = 0.783 × f** | derived |
| 17 | AI markdown effective constructs | **7.74 vs human 10.87** | measured, 68,798 msgs |
| 18 | AI list items starting with bold | **48.3% vs human 5.3%** | measured (I got 50.0% vs 2.2% on a 7-doc spot check) |
| 19 | AI docs with list lacking blank line | **51%** | measured |
| 20 | Aider markdown vs JSON for code | **60.5 vs 55.6**, errors 7 vs 37 | verified from source YAML |
| 21 | GitHub strips class/style/data-* | confirmed live | verified |
| 22 | `> [!NOTE]` vs `> [!SPOILER]` | native callout vs graceful blockquote | verified live |
| 23 | Quarto `#\|` inside plain fence | full R highlighting | verified live |
| 24 | compact vs spaced markdown table | **0 vs 3 terms retrievable** | verified |
| 25 | CTAN packages | **7,021** | verified live |
| 26 | Typst packages | **1,481** distinct / 4,425 rows | verified live |
| 27 | Anthropic index vs inlined container | 38,847 B vs **6,556,407 B (168.8×)** | agent, primary-read |
| 28 | CommonMark net new conformance examples 2021→2024 | **ZERO** | agent, primary-read |

---

## §4 — Grading / ranking tables (own section per skill step 3)

### 4.1 Anchor scheme comparison (PLAN §1.1a)
| scheme | correct | false | refusal |
|---|---|---|---|
| byte offset | 36.93% | **62.12%** | 0.95% |
| block index | 44.43% | **55.50%** | 0.08% |
| content hash alone | 83.36% | 0.00% | 16.64% |
| rigid fingerprint k=1/2/3 | 90.65/88.68/87.22% | 0.25% | 9–13% |
| **ours** | **99.627%** | **0.050%** | **0.323%** |

### 4.2 Plugin demand by gap class (PLAN §16.1)
FORMAT **40.1%** · APP 31.0% · EXTERNAL 19.5% · RENDER/ERGONOMICS 9.4%
Replicates: plugins 40.1% · forum 39.0% · VS Code 35.4%

### 4.3 Format ranking as INPUT (2026-08-01 survey)
| study | markdown's place | winner |
|---|---|---|
| Microsoft, 28 cells | #2 of 4 (mean rank 2.29) | **JSON** (1.96) |
| Document workflows, 48k runs | tied #1–2 (−0.30pp) | TXT ≈ MD |
| HtmlRAG, 6 datasets | **#3 of 4** (loses to plain text 9/10) | cleaned HTML |
| Algorithm spec | **#7 of 7 — LAST** | LaTeX pseudocode |
| Table-to-text in RAG | #1–2 | Markdown |
| **Output constraint** | **#1 of 4** (−2.91pp, least tax) | **Markdown** |

**No study ranks markdown first as an input format on a broad multi-task benchmark.**

### 4.4 Editor feature frontier — top 10 unbuilt (workflow, 2026-08-01)
| # | feature | demand evidence | compiler need |
|---|---|---|---|
| 1 | **Safe rename / reference-integral refactor** | #25412 **340 likes, OPEN 4.8 yrs**, 2 siblings archived | extreme |
| 2 | Impact preview ("what breaks if I change this") | zero direct requests — users can't imagine it | extreme, **zero prior art** |
| 3 | Typed links with validation | #6994 **820 likes**, 49,514 views, OPEN 5.8 yrs — highest measured | high |
| 4 | Durable block identity across files | #18159 archived, still breaking users 2026 | extreme |
| 5 | Frontmatter type checking across vault | #63806 430 likes | high |
| 6 | Extract/inline/move section w/ ref rewriting | note-refactor 637★ explicitly does NOT update refs | extreme |
| 7 | Reference counts inline (CodeLens for prose) | #37708 194 likes | medium — **Marksman proves it ships** |
| 8 | True transclusion as components | #27093 **553 likes**, active 2026-07-24 | high |
| 9 | Semantic diff | CLI tools exist, zero editors | high |
| 10 | Verified AI refactor | — | extreme |

---

## §5 — Settled, do not re-litigate

1. Splice-only. Theorem. Do not propose AST regeneration.
2. The file stays `.md`. No new dialect requiring its own parser.
3. No runtime. The moment the engine needs an interpreter, it is MDX — which **cannot write the document back out** (verified: the MDX writer emits `{1 + 1}` from a program whose parsed body is empty; it follows the raw string and ignores the AST).
4. Extension goes through **dispatch** (fence info string, frontmatter vocabulary), never a new sigil. Character-namespace exhaustion is real: `::` is contested between two top-50 Obsidian plugins today.
5. Never redefine a symbol CommonMark defines. Declaring a **denotation** is safe (140/140); redefining a **procedure** is not (98.2% → 38.6%).
6. Projections are never stored.
7. Rigid context fingerprints get *worse* as k grows. Score context softly.
8. Every position-based tiebreak made anchoring dramatically worse (0.00% → 22.20% false).
9. Typographic steganography is dead — one `remark-stringify` pass normalizes list markers, emphasis delimiters, setext headings.
10. In-band instruction/data separation does not work. A ``` fence around untrusted data moved ASR **51% → 50%**; the sandwich defense made it **worse (55%)**. Tool filtering (architectural) got 6.8%.
11. **The markdown-in-training-data claim is folklore.** Traced to origin; MarkItDown's README says *"This suggests..."* and cites nothing, added 2025-03-06 — nine months **after** the claim was already circulating. And Llama 3's paper states the opposite verbatim: *"We find markdown is harmful to the performance of a model that is primarily trained on web data compared to plain text, so we remove all markdown markers."*

---

## §6 — ⚠️ CORRECTIONS NOT YET APPLIED TO THE FILES ⚠️

**This is the most important section. Two load-bearing claims were refuted on 2026-08-01. `PLAN.md` and `README.md` still contain the wrong versions.**

### 6.1 §16.2's Logseq "causal proof" is over-generalized — REFUTED, VERIFIED
`PLAN.md:1298-1318` and `README.md:220` claim *"every cluster corresponding to a native format feature is 10–35× smaller."* **The plan never reports the denominator.**

Recomputed live 2026-08-01: Obsidian 6,222 plugins, Logseq 607 packages → **baseline ratio 10.25×**.

| cluster | raw | ÷ baseline | verdict |
|---|---|---|---|
| spaced repetition | 35.00× | **3.41×** | REAL effect (Logseq native) |
| query/database | 2.30× | **0.22×** | **INVERTS** (Logseq native) |
| task management | 4.97× | **0.48×** | **INVERTS** (Logseq native) |
| kanban | 10.50× | 1.02× | no effect (native in neither) |
| tables | 10.67× | 1.04× | no effect (native in neither) |

Only **1 of 3** native-feature clusters shows an effect. Two go the *wrong way*. The two controls land at 1.02× and 1.04× — so the method is sound, the conclusion was over-generalized from the one case that worked.

**Action:** retract the "10–35×" sentence; keep the spaced-repetition finding (3.41× is real, and both Logseq entries are merely Anki bridges); state the denominator; note §16.2 was the only *causal* leg under a *correlational* 40.1%.

### 6.2 §1.1's novelty claim is FALSE — REFUTED, VERIFIED
`PLAN.md:75-76` / `README.md:57-58` say content-derived re-anchoring *"is used by no system above, and is therefore the one with no precedent to lean on."*

There is 25 years of prior art:
- **Brush & Bargeron, "Robustly Anchoring Annotations Using Keywords", MSR-TR-2001-107** — title verified live at microsoft.com/en-us/research. Anchor = anchor text + start/end context + lowest-document-frequency keywords. That is our design. Its user study concluded low-confidence matches should be orphaned with a best guess — **that is our AMBIGUOUS/DELTA rule.**
- **US7747943B2** (Bargeron/Brush/Gupta, Microsoft, filed 2001, granted 2010, expired 2024-03-26)
- **W3C Web Annotation Data Model** — a Recommendation, with `TextQuoteSelector`
- **Hypothes.is** in production, with published failure data: **~27% of 6,281 annotations can no longer attach** *(secondary — arXiv 1512.06195, NOT read directly; verify before citing)*

Grep of both docs: `Brush` 0 · `Bargeron` 0 · `Web Annotation` 0 · `TextQuote` 0 · `Hypothes` 0 · `diff-match-patch` 0 · `robust anchor` 0.

**And the process failure is worse than the error:** the 2026-07-29 research run **physically downloaded** `w3c-anno.html` (284,185 bytes, `<title>Web Annotation Data Model</title>`) into `/tmp/claude-501` and none of it reached the plan. **Retrieval-to-synthesis loss, not a search failure. The source was in hand.**

**Action:** rewrite as *"the fourth strategy has 25 years of prior art we are extending."* Then convert it into an asset — implement `TextQuoteSelector` and Keyword Anchoring as **two more baselines in benchmark B1**. Beating a W3C Recommendation and a Microsoft patent on a published corpus is a far stronger claim than "nobody tried this," and it is the only version that survives peer review.

### 6.3 Pandoc `attributes` already ships per-block identity — NOT ENGAGED
`PLAN.md:1373` lists "an extension mechanism with a namespace" among four absences "no plugin can implement." But Pandoc's MANUAL.txt says verbatim: *"Extension: `attributes` — Allows attributes to be attached to any inline or block-level element when parsing `commonmark`."* Plus `header_attributes` (`# H {#foo}`, PHP Markdown Extra, i.e. 2004). Adoption is not marginal: markdown-it-attrs 280,897/wk; kramdown 246M total gem downloads and it is Jekyll's default, hence GitHub Pages.

**Action:** run the §3.3 carrier experiment with `{#id}` as a sixth arm. **The honest question the plan has never asked: what fraction of the anchoring problem remains once authors can just write an ID, and is the residual worth a compiler?** If the answer is "most of it, because users won't write IDs" — measure that and say so.

### 6.4 Other corrections made during the session (already applied, listed for the record)
- The mermaid penetration claim was overstated. 330,496 is a real absolute count but the **rate is 0.89%** (0.26% excluding mermaid's own docs). §15.1 carries the correction.
- I stated "JSON output cost LLaMA 3 **42 points** on GSM8K." Wrong — cross-contaminated model and task. Actual: 74.73 → 65.38 (−9.35) JSON mode, → 48.90 (−25.83) with schema. The real −42s are LLaMA-3 on Last Letter Concat and Gemini-1.5-Flash on GSM8K.
- I wrote a false comment in `search-index.ts` (commit `58322f7`) claiming `extractCodeText` makes table content findable. It does not. **Corrected in the working tree, uncommitted.**

---

## §7 — What the 2026-08-01 workflow established (all agent-sourced, tiers as marked)

### 7.1 The library/import model — **VIABLE, with a named blueprint**
Only **two** document formats ever acquired a package ecosystem: **LaTeX** (7,021 CTAN packages, 35 years, five volunteers, no solver) and **Typst** (1,481 packages in ~3 years). *Both are Turing-complete languages whose surface syntax happens to be documents.* Everything markdown-adjacent — Quarto, Sphinx, MkDocs, Pandoc, R Markdown — deliberately **refused** document-declared registry resolution; all borrowed an existing registry rather than building one. MDX has real `import` statements and built **no registry at all**.

> **The implication, stated by the agent:** acquiring a package ecosystem means becoming a programming language, or admitting you are a thin shell over one. **Decide which, explicitly, before designing syntax.**

**Typst is the reference design and is cheap** — vendor blog, verbatim: *"a minimum viable package manager that a single person could build in a week."* No registry service: a git repo, a GitHub Action, a CDN. Six properties to copy:
1. Namespaced with a **user-owned escape hatch from day one** — `@vendor/name:1.0.0` plus `@local/name:1.0.0` resolving from disk **with precedence over cache**. This is what makes air-gapped and pre-publication use possible without vendor sign-off.
2. **Mandatory full version pinning.** No ranges, no floating, no lockfile, no solver.
3. **Post-publish immutability** as stated policy.
4. On-demand download + **permanent cache** — *"importing a cached package does not result in network access."* The vendor being down must never break a build.
5. Submission = a pull request.
6. WASM plugin contract: **non-WASI, byte-buffers only, no ambient authority, purity required.**

**Two things to fix rather than copy:** Typst ships **no checksums** (their own source comment admits it); and LaTeX's asymmetry is backwards — **missing package = fatal interactive error, wrong version = mere warning.**

**Your import idea is structurally correct** and it fixes a flaw in the earlier §15.8 design. Every self-declaring document that succeeded (JSON-LD `@context`, shebang, Racket `#lang`) **names a vocabulary and never carries the definition.** An `import` is a name. The library is the definition, living outside the file.

### 7.2 CommonMark is frozen — **do not spend a week on it**
- **Zero net new conformance examples** between 0.30 (2021-06-20) and 0.31.2 (2024-01-28); the entire 0.31 changelog is typos and link fixes.
- 81 of 1,848 commits since 2020, **44% of those by one person**. No `CONTRIBUTING` or `GOVERNANCE` file. Bus factor 1.
- The 1.0 blocker list opened 2015 still says "[6 remaining]", last edited 2019.
- The two extension threads MDMAX needs have run **316 posts over a decade**, still open.
- Two IETF principals offered to formalize the spec — **no maintainer reply in four years**.
- Its own author built **djot** in 2022 to get attributes rather than amend CommonMark.

**The playbook that HAS worked, with preconditions:**
- **P0 (non-negotiable):** the construct must be **already-valid CommonMark** that degrades to readable prose. Mermaid = fence info string. Alerts = a blockquote whose first line is literal text.
- **P1:** reference implementation + executable conformance suite, shipped *before* advocacy.
- **P2:** **corpus-years before advocacy.** Alerts: 8.0 years inside Microsoft Learn. Mermaid: 7.2 years on npm. Frontmatter: 17.8 years since Jekyll.

### 7.3 The doc-graph answer — **INDEX, not container**
Anthropic ships both from one corpus: index **38,847 B / 174 links**; inlined container **6,556,407 B** — **168.8×**, ~1.64M tokens, larger than any context window. Index + 3 selectively-read docs ≈ 17K tokens, a **96× saving**.

- **LLMs do not traverse passively.** 97% of published `llms.txt` files got **zero requests**; AI retrieval bots were 1%; **coding agents (tools with Read/Fetch) were 10% — the largest AI slice.** Anthropic prepends an imperative to every doc page rather than relying on a bare link, and for `CLAUDE.md` **gave up on traversal entirely and eagerly inlines imports at launch**.
- **Depth: design for 2–3 useful levels, hard-cap at 4.** Sitemaps = 2 (Google rejects a 3rd); CLAUDE.md = 4-hop cap; Sphinx canonical example = `:maxdepth: 2`.
- **Breadth: ~150–200 described entries per node is proven; shard past ~250.**
- **Ship both from one declaration** — Sphinx settled this with one `toctree` rendering as links or inlined content. Recommend `mdmax build --index` (default), `--inline`, and `--budget <bytes>` that inlines greedily until the budget is hit.
- Emit an explicit `## How to read this file` block with the fetch/grep protocol.

### 7.4 AI-to-AI — **do NOT build a new format**
"Markdown" appears **zero times** in all six MCP schema versions and in A2A. Every protocol uses a typed JSON/protobuf envelope wrapping an **opaque** text blob. They solved transport and typing; they carry **zero** provenance, confidence, attribution or lineage.

**But:** the one place markdown *is* explicitly named and privileged is **C2PA §A.9.3.2**, which says claim generators SHOULD PREFER **YAML front matter in a Markdown file** for a signed manifest. And **C2PA §A.8** was drafted for *"content intended for copy-paste operations across different systems"* and is still marked "under review" — unfinished, and open.

**Recommendation:** build a **provenance profile over Markdown + YAML frontmatter**, aligned to C2PA — a profile of an existing standard rather than format #15. Target the **human-paste hop**, which no protocol reaches. **Ship a verifier before a spec**: a *lossy-handoff detector* that flags what would not survive a hop — unsourced claims, tool results referenced but not included, assumptions stated as facts, numbers with no derivation. Needs zero adoption from the other side.

### 7.5 Preservation — an institutional counter-authority never engaged
**Library of Congress Recommended Formats Statement 2025-2026** (read directly, p.8): markdown is **not named at any level**. Preferred = XML with DTD/schema (EPUB3, TEI, DocBook), PDF/UA, PDF/A. Acceptable list ends *"6. Other formats: a. RTF, b. Plain text..."* — markdown's best home is **"Plain text," second-from-last.** Since 2024 the RFS also scores a format's **capacity for accessibility features** — which markdown provably lacks, and which is the institutional buyer for the §17.7 a11y wedge.

---

## §8 — Ten verified bugs in shipped editor code — **NONE FIXED**

| # | severity | location | defect |
|---|---|---|---|
| 1 | critical | `preview/.../components.tsx:86` | task checkbox has no label — 5,308 nodes / 382 files |
| 2 | serious | `share/.../PublicNoteView.tsx:15` | no `<main>` landmark — 2,128 files (93%) |
| 3 | serious | `editor/.../live/LivePreview.tsx:63` | `<div onClick>`, no `role`/`tabIndex`/key handler. **Editing is mouse-only** — WCAG 2.1.1 (A) |
| 4 | serious | `editor/.../CodeMirrorEditor.tsx:214` | `role="textbox"` with no accessible name. One line to fix |
| 5 | serious | `markdown/html-policy.ts` | `data:image/svg+xml` allowed in `<a href>` — executes on navigation in Firefox/Safari/WKWebView. **Masked today only by react-markdown; goes live on server render** |
| 6 | serious | `preview/Markdown.tsx:67` | `remark-math` swallows prose between `$`…`$` — 36 captures in 20 of 272 files; KaTeX then `aria-hidden`s it; **axe reports zero** |
| 7 | **high** | render pipeline | **Trojan Source: RLO survives into fenced code blocks** (U+202E/U+202C verified in 4 positions). Zero bidi handling in `src/` |
| 8 | medium | `html-policy.ts` | `style` attribute uninspected → full-viewport phishing overlay, CSS beacon |
| 9 | medium | `app/layout.tsx:67` | `lang="en"` hardcoded; frontmatter `language:` discarded — 19 Bengali notes fail WCAG 3.1.1 |
| 10 | medium | — | `.sr-only` emitted by remark-gfm but **defined nowhere** in `src/` or `public/` → stray visible "Footnotes" heading |

Plus: **zero normalization anywhere in `src/`** — Bengali search returns 1 hit for the in-file form and **0 for the NFC form**, rendering identically. And **CJK search returns 0 results** under the default tokenizer (0/7 queries).

---

## §9 — Naming: MDMAX (VERIFIED live 2026-08-01)

```
npm     mdmax · md-max · markdown-max · mdx-max   →  ALL FREE
PyPI    mdmax · markdown-max                      →  FREE
GitHub  repos named mdmax: 13, all 0-star noise
        github.com/mdmax → taken (dormant personal account)
```
No meaningful collision. Only footnote: "MD" means molecular dynamics in chemistry, so `MDmax` appears in one unrelated physics repo.

---

## §10 — Live state (freshly run at write time)

```
branch  engine/plan-and-diagnostics
HEAD    798ebbf  fix(docs): eliminate page overflow in the dossier
ahead of main: 16 commits (all docs + 2 bug-fix commits; main untouched)
tests   65 test files · 3,604 passing at last full run
docs/engine/  PLAN.md 103.8 KB (1,748 lines, 19 sections)
              README.md 45.7 KB (789 lines)
              dossier.html 399 KB · dossier PDF 439 KB · build/
```

**Uncommitted — 3 items, 2 need a decision:**

| file | state | what to do |
|---|---|---|
| `package.json` | **+1 line: `"@anthropic-ai/tokenizer": "*"`** | **UNWANTED.** A research subagent ran `npm install` from the repo root instead of `$TMPDIR`. User was asked to approve `git checkout -- package.json` and never answered. **Revert it.** |
| `src/modules/vault/infrastructure/search-index.ts` | +15/−3 | **WANTED.** Corrects a false comment I wrote in `58322f7`. Commit it. |
| `.env.example` | shows as 33 deletions | **NOT REAL.** Sandbox artifact — the sandbox blocks reading `.env.*`, so git reports it missing. Do not act on it. |

**Untracked (leave alone):** `HANDOFF-mdz-markdown-format-2026-07-29.md`, `HANDOFF-graph-engineering-research-2026-07-30.md`, `arx.xml`, `cx.html`.

**Session hygiene notes:**
- The **prompt-injection taint gate fired twice** (20:45:43Z, 20:47:06Z) and blocked `WebFetch` for **all subagents for the rest of the session** — it is session-scoped, so its own advertised remedy ("use a read-only subagent") does not work. Likely trigger: one research topic *was* prompt injection, so fetched pages legitimately contained "IGNORE ALL PREVIOUS INSTRUCTIONS." Worth tuning.
- The **bash guard** blocked a `git commit` because the commit *message* contained the word "drop" (matched its `DROP TABLE` rule). It scans heredoc prose as if it were a command.
- The **spawn gate** warned that the workflow script lacked its `// SPAWN-GATE:` decision-record header. Warn-only; add it next time.

---

## §11 — Open decisions (user has NOT ruled on any of these)

1. **The CRDT conflict.** `PRODUCT-PLAN §4b` says "No peer CRDT — server-authoritative." `PLAN.md §8` specifies Eg-walker/Braid. Different architectures. **Anyone building from §8 alone would build the wrong thing.** Open since 2026-07-30.
2. **Does the notation/library feature ship at all?** Legitimate to defer entirely and ship Phases 1–2 without it.
3. **Language or shell?** Per §7.1 — does MDMAX become a programming language, or admit it is a thin shell over one? This decides the whole import design.
4. **Merge `engine/plan-and-diagnostics` into `main`?**
5. **Commit the two untracked HANDOFF files and delete `arx.xml` / `cx.html`?**
6. **Does the doc tree replace or wrap `PLAN.md`?** My recommendation: **wraps** — PLAN.md stays the technical record, the tree is the navigable front door.

---

## §12 — Phase status

| phase | status | evidence |
|---|---|---|
| Research | **done, over-done** | ~2.4M tokens, 26+ agents, one 25-agent workflow |
| Plan documents | **done** | PLAN.md v0.6.0 §0–§17, README.md, dossier PDF |
| **Corrections to plan** | **NOT STARTED** | §6.1–6.3 refuted 2026-08-01, files still wrong |
| **Doc tree (`docs/mdmax/`)** | **NOT STARTED** | user asked for it; blocked on §6 |
| Phase 1 `core/` splice + anchor | **NOT STARTED** | zero engine code exists |
| Phase 2 `resolve/` + `check/` | not started | |
| Phase 3 `schema/` | not started | gate corpus was voided |
| Phase 4 `pack`/`unpack` | not started | |
| Phase 5 reconciler | not started | |
| Editor bug fixes | **NOT STARTED** | 10 verified, 0 fixed |

---

## §13 — What to do next, in order

1. **Revert `package.json`** — `git checkout -- package.json`. Unwanted subagent artifact.
2. **Commit the `search-index.ts` comment fix.** Already correct in the tree.
3. **Apply §6.1** — retract §16.2's "10–35×", state the denominator, keep the SRS finding.
4. **Apply §6.2** — rewrite §1.1 and README I.2 as *"25 years of prior art we are extending."* Cite Brush & Bargeron, Phelps & Wilensky, W3C `TextQuoteSelector`, US7747943B2. **Then add `TextQuoteSelector` and Keyword Anchoring as baselines to B1.**
5. **Apply §6.3** — run the §3.3 carrier experiment with `{#id}` as a sixth arm and answer: *what fraction of the anchoring problem survives once authors can write an ID?*
6. **Then** build `docs/mdmax/` — the tree, on a corrected plan. Structure the user asked for: `README.md` root → `00-origin/` (this handoff's §2), `10-research/`, `20-findings/`, `30-design/`, `40-plan/`, `50-product/`, `60-benchmarks/`, `70-open/`. Per §7.3: **index by default, `--inline` available, explicit "how to read this" block, depth ≤ 3.**
7. **Then** open Phase 1. The kill-gate requires an **independent oracle** — the current 100% byte-fidelity was produced by a check using the writer's own code path and is structurally incapable of catching an offset bug. **Building that oracle is itself the research.**
8. Separately, at any time: the ten editor bugs (§8). Six are one-liners; #7 (Trojan Source) is the highest severity.

**Do NOT re-litigate:** anything in §5. Do NOT try to change CommonMark (§7.2). Do NOT propose AST regeneration. Do NOT claim markdown is optimal for AI comprehension — that is refuted folklore (§5.11).

**Unverified, check before acting:** the Hypothes.is 27% figure (secondary, arXiv 1512.06195, not read directly); the `x/fm:` react-markdown sanitizer bypass (never tested); any workflow claim tagged `search-only` or `inference` in `/tmp/claude-501/wf-findings.md`.

---

## §14 — The user's own framing, verbatim, so intent is not lost

> *"AI is representing a response in Markdown. That's why the whole research is around Markdown."*

> *"we need a Google Doc for Markdown."*

> *"our editor on the max plan should give features that is unseen in the industry."*

> *"I am absolutely fine with being proven wrong."*

That last one is why this document leads with §6.
