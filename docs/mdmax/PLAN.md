---
title: MDMAX — the plan
status: for review
version: 1.0.0
date: 2026-08-01
authors: Sagnik Mitra, Amit (co-founder)
corpus_id: sha256:3a010b1649899795d79274fc528dbece97fdabf4ff0f81cc02ab619c048c51a4
supersedes: nothing — this is the consolidation. docs/engine/PLAN.md v0.6.0 remains the
            technical record and is now downstream of this document.
---

# MDMAX

> **frontmatter is Google Docs for markdown. MDMAX is what makes that more than a text box.**

---

## 0. How to read this

This is one document. It replaces the need to read six.

- **Amit, or anyone cold:** read §1, §2, §3, §10, §11. That is the product, the decisions, the MVP and the plan. Twenty minutes.
- **Anyone building:** add §4–§6 and §12.
- **Anyone challenging it:** §8 and §9. §9 is the list of things we got wrong, kept on purpose.

**Two conventions, and they are load-bearing.**

1. Every number cites a tier: `[measured]` we ran it, `[primary]` we read the source, `[secondary]` we read a summary, `[inference]` we reasoned, `[SIMULATED]` we replayed data through code rather than reading a live system.
2. Every corpus number cites `corpus_id` in the frontmatter above. That id is a hash over the sorted `(path, sha256)` list of 1,084 files / 25,548,765 bytes across `md`, `knowledge` and `frontmatter`. **If a number has no corpus id, it is not a measurement.** This rule exists because seven different file counts were reported across eighteen research areas and none of them reproduced. See §9.1.

---

## 1. What we are building

**frontmatter** is a browser-first markdown editor: your documents, editable anywhere, with the collaboration loop people actually use Google Docs for — comments anchored to text, suggestions, version history, sharing. The files are plain `.md`. There is no proprietary format.

**MDMAX** is the compiler underneath it. It is what lets the editor do things a text box cannot: know that *this paragraph* is still *this paragraph* after somebody else edited the document, write a change without disturbing a byte it was not asked to touch, and emit a version of a document that an AI can consume cheaply and correctly.

**Why the compiler is not optional.** Google Docs' real moat is not typing. It is the *review loop* — a comment that stays attached to the sentence it was about, a suggestion you can accept, a history you can diff. Every one of those needs a durable name for a piece of a document that keeps changing. Markdown has no such name. That is the gap, and closing it is the whole engineering thesis.

**Why the name.** `frontmatter` is the product. `MDMAX` is the capability layer — the format profile, the CLI, the library. Two slots, two names, neither fighting the other. Prior names MD3 and MDZ are dead (§7.2).

---

## 2. Three things and how they relate

| | what it is | business model | relationship |
|---|---|---|---|
| **frontmatter** | the product — editor + collaboration | freemium: Free / Pro / Max | the thing customers buy |
| **MDMAX** | the compiler — library + CLI + format profile | none stated yet — see §13.4 | frontmatter's backbone; also shippable standalone |
| **AIOS** | the agent-orchestration toolchain | not a product | **a beneficiary, not a component** |

**On AIOS, plainly.** AIOS is a separate and larger track — improving how Claude Code works. It is not part of frontmatter and frontmatter is not part of it. But MDMAX will benefit it, and we measured exactly where:

- `~/.sgnk` is **JSONL-dominant, not markdown**: `.jsonl` 16,396,902 bytes vs `.md` 2,057,158 bytes; of 31 gate scripts, exactly 2 reference `.md` at all. `[measured]` So the self-improving loops — traces, evals, calibration, the routing bandit — are untouched by MDMAX. Any claim otherwise is a story.
- **Where it does help, there are two places.** (a) 119 `SKILL.md` files carry **3,295,299 bytes of bodies against ~81,754 bytes of always-loaded descriptions — a 40.3× hand-maintained budgeted projection that drifts.** `[measured]` It has a known ground-truth defect already in writing: a description containing *"target restated 2026-07-28 from the stale 30-50% figure"* — a wrong number sat in every session's system prompt while the body disagreed. A drift check has a positive to fire on before it fires on anything else. (b) Learned Rule #68 documents a UTF-8 truncation bug in a markdown writer — `awk substr` splitting a multi-byte character, 3 of 880 artifacts — which is byte-for-byte the defect class MDMAX's splice writer exists to prevent. `[primary]`

**AIOS gets one section in this plan and no roadmap slot.** When MDMAX ships a splice writer and a projection, AIOS can adopt them. That is the whole relationship.

---

## 3. Decisions made

Decided by Sagnik and Amit. Recorded here so nobody re-opens them by accident.

| # | decision | date | consequence |
|---|---|---|---|
| D1 | frontmatter is **Google Docs for markdown** | 2026-08-01 | this is the north star; features are judged against it |
| D2 | **Comments and history live outside the file.** Export or copy yields clean markdown — latest content only | 2026-08-01 | **kills the in-file carrier debate for comments entirely.** No CriticMarkup, no HTML-comment sentinels. Sidecar + export guarantee is now *forced*, not chosen |
| D3 | **Reviewers must log in** (Google or GitHub); auth mechanism deferred | 2026-08-01 | comment identity keys to a frontmatter account, not a link. Tradeoff logged in §13.3 |
| D4 | **The durable artifact is plain markdown.** If frontmatter dies, we ship a full export and migration. Max tier gets offline access | 2026-08-01 | trust is delivered by an *export guarantee*, not by "your repo is the backend" |
| D5 | **AIOS is a separate track** | 2026-08-01 | no fusion chapter; §2 is the whole story |
| D6 | The file stays ordinary `.md`. **Degradation is the feature** | 2026-07-28 | no dialect requiring its own parser |
| D7 | **Splice-only writing.** Never regenerate from the AST | 2026-07-28 | a theorem, not a preference — see §8.1 |
| D8 | Extensibility lives in the **value of a field**, never the set of node types | 2026-07-31 | an unknown fence language round-trips perfectly; an unknown node type throws |
| D9 | A document **names** a capability, never **carries** one | 2026-08-01 | `fm:vocab: sgnk/v1`, not an inline definition. Every self-declaring format that carried its definition produced CVEs |
| D10 | Name is **MDMAX**. `markedmax` rejected | 2026-08-01 | `marked` is a 61,032,058 downloads/week parser and one of our four required ports; naming after it implies a fork |

**Deliberately deferred:** backend (Firestore vs anything else), auth mechanism, pricing numbers, mobile, real-time multiplayer.

---

## 4. What MDMAX is, concretely

Six capabilities. Each is independently useful; the first two are the spine.

### 4.1 Block identity that survives an edit

A durable name for a paragraph, so a comment thread, a suggestion, or a history entry still points at the right thing after the document changes.

```
resolve(block, new document) -> index | AMBIGUOUS | LOST

  gate  anchorable?  (not a rule, not punctuation-only, >= 3 tokens)
  S1    exact hash over normalize(text)          resolves 87.0%
  S2    several matches -> score by soft context, unique argmax, else AMBIGUOUS
  S3    no exact match -> 3-gram shingle candidates, jaccard >= 0.20,
        score = jaccard + context; margin <= 0.05 -> AMBIGUOUS
```

Measured `[measured, but see §9.4]` over 41,642 block-versions from 294 real revision pairs, parameters from a 384-configuration sweep:

| scheme | correct | **false** | safe refusal |
|---|---|---|---|
| byte offset | 36.93% | **62.12%** | 0.95% |
| block index | 44.43% | **55.50%** | 0.08% |
| content hash alone | 83.36% | 0.00% | 16.64% |
| rigid context fingerprint k=1/2/3 | 90.65 / 88.68 / 87.22% | 0.25% | 9–13% |
| **ours** | **99.627%** | **0.050%** | **0.323%** |

**Refusing is cheap. A silently wrong anchor is not.** Every position-based tiebreak made it dramatically worse — content-hash plus nearest-position goes 0.00% → 22.20% false.

**Its honest position in the product, corrected 2026-08-01.** In frontmatter, a previous version of the document essentially always exists — in-app edits give us the CodeMirror ChangeSet, and offline sync, AI Edit and external sync all give us before/after. **So content-derived re-anchoring is the fallback and the verifier, not the primary mechanism.** It catches the case the diff gets wrong: 43.3% of deleted lines are ≥0.80 similar to a line in the same hunk, i.e. light edits reported as delete-plus-insert. `[measured]` This is a smaller claim than the plan previously made, and a far more defensible one. See §9.3.

### 4.2 Splice-only writing

Never regenerate the document from the parse tree. Write only the bytes you were asked to change, and prove it.

This is a theorem, not a preference: Foster et al., TOPLAS 2007, Lemma 3.9 — a total well-behaved lens whose `put` ignores the original source requires `get` to be a bijection. Markdown's parse is nowhere near injective: **443 of 655 CommonMark spec examples are two distinct source strings with an identical parse tree.** `[primary]` A zero-edit round trip through the tree rewrites 24.98% of lines and drops 18.94% of bytes; **0 of 51 files in this repo survive it byte-identically.** `[measured]`

This is not theoretical. DesktopCommanderMCP issue #440 (2026): an AI tool added a rich-text model and began silently rewriting users' `.md` — YAML collapsed to single lines, `[x]` → `\[x]`, blank lines stripped — **and it fired on read-only operations.** `[primary]`

### 4.3 The degradation certificate

Per document, per target: does this construct survive?

*"Degrades harmlessly"* was our assumption and it is **false**. Frontmatter itself is the counterexample — to strict CommonMark, a `---` / `title: x` / `---` block is a thematic break plus a heading containing your YAML. GitHub renders a table, VS Code a code block, Obsidian a properties panel. There is no consensus behaviour. `[primary]`

Measured across 24 renderer configurations `[measured]`:

```
invisible in 24/24     link reference definition · the [//]: # idiom
VISIBLE in 23/24       frontmatter
8 distinct outputs     HTML comment — visible in 2, payload destroyed in 10,
                       including GitHub's blob renderer which deletes it outright
survives to HTML       unknown-language fence — the only carrier reaching both a
                       raw-file consumer and a sanitized-HTML consumer intact
```

**And "GitHub" is not one target. It is three renderers that disagree on identical bytes** — blob view, comment box, Pages. No tool anywhere models targets as `(product, surface)` pairs.

### 4.4 Budgeted projection

One source, three tiers: index, outline, full.

Measured on `PLAN.md` `[measured]`: 408 top-level nodes, 77 headings, index 4,171 bytes against 106,298 full — **25.5×**. Across five corpora the index tier is 61–152× smaller and the outline tier 15–35×. Corroborated independently: Anthropic publishes the same 174-document corpus as `llms.txt` (38,847 B) and `llms-full.txt` (6,556,407 B) — **168.8×**. `[primary]`

### 4.5 Declared provenance

Where did this span come from — which source, which page, which method, at what confidence.

Today this dies at the markdown boundary: docling, marker and unstructured all carry bounding boxes and page numbers in their JSON and lose every bit of it on export. A table recovered by a model at 0.71 confidence and a verbatim text-layer extraction are indistinguishable downstream. `[primary]` MCP (all six schema versions) and Google A2A contain **zero** fields for provenance, citation, confidence or lineage. `[measured]`

### 4.6 The near-miss reference checker

Broken links that are actually broken, distinguished from placeholders that are deliberate.

An unresolved `[[link]]` is a legitimate authoring primitive, which is why naive checking runs at 2–25% precision and gets switched off. Near-miss discrimination found **95 real, hand-verified broken links** that naive checking would have buried under 97% noise. `[primary]`

---

## 5. How MDMAX enhances markdown

Not by adding syntax. Markdown's extension points are exhausted — jgm, its spec author: *"two extensions may want to interpret the same character for two different purposes."* `[primary]` That is resource exhaustion, and it is live: `::` is contested between two top-50 Obsidian plugins today.

**The rule that replaces "add syntax":**

> **Extensibility lives in the VALUE of a field, never in the SET of node types.**

Verified against a real parser `[measured]`: an unknown fence language round-trips byte-perfectly. An unknown *node type* throws — `Cannot handle unknown node 'diagram'`. That one sentence is why mermaid needed no spec change, no RFC, and no coordination across thirty renderers.

**What markdown structurally cannot hold**, and what we do about each:

| missing | why | our answer |
|---|---|---|
| identity | a `.md` file is a tree over a closed 21-label alphabet with no stable node names | §4.1 — derive it, don't demand it |
| typed relations | it cannot carry any edge that is not parent-child | a resolver with more than one file in scope. Not syntax |
| spatial arrangement | same | out of scope. Obsidian shipped `.canvas` for this and was right |
| block-scoped metadata | no slot | frontmatter vocabulary + tail-placed records |
| a description list | no construct — which is why **48.3% of AI list items open with a bold run** vs 5.3% for humans | recognise the pattern, lift it in the tree, leave the bytes alone |

**And what we will not do.** We will not fight for the format slot. Google Cloud shipped Open Knowledge Format on 2026-06-13 — markdown plus YAML frontmatter, no runtime, reference implementations at both ends. Competing with that is djot's outcome: 693 downloads/week against remark-parse's 45,731,168, a gap of 65,990×. `[primary]` **OKF is a target in our certificate matrix, not a host for our roadmap.** See §13.5.

---

## 6. How AI communicates with MDMAX

**The honest claim, and it is narrower than the obvious pitch.**

Markdown is **not** optimal for AI comprehension. That claim is folklore with no primary source — traced to a README that says *"This suggests…"* and cites nothing. Meta's own Llama 3 paper states the opposite verbatim: *"We find markdown is harmful to the performance of a model that is primarily trained on web data compared to plain text, so we remove all markdown markers."* `[primary]`

What is true:

- **Markdown is what models emit.** Measured over 68,798 messages: AI uses 7.74 effective constructs against a human 10.87; nine constructs cover 95% of its output. It is a narrow, measurable dialect. `[measured]`
- **Markdown is the best carrier for code edits.** Aider's benchmark: markdown wins 4 of 4 models, pooled 60.5 vs JSON 55.6. And the nuance is the point — JSON-strict cut syntax errors to *fewer* than markdown's and the pass rate **still** fell. The model reasons worse when it must emit JSON at all. `[measured from source data]`
- **Markdown is the ecosystem's substrate.** That is a fact about the world, not about cognition.

> **So the compiler's job is translation, identity and cost — never format advocacy.**

**The four things MDMAX can honestly promise an AI consumer:**

1. **Fewer tokens** — 25–168× via the index tier, measured on three independent corpora.
2. **One parse strategy** — a declared header naming the exact parser contract, so a consumer never guesses.
3. **Declared provenance** — per-span source, method, confidence.
4. **Detectable staleness** — an anchor that refuses rather than silently mis-points.

**What it must NOT promise: better comprehension.** No experiment in this program measured it. Zero live model calls were made across eighteen research areas. Every comprehension claim we have is a pre-registered prediction, and it will be labelled as one until somebody runs it (§11, W3).

**One live warning for the AI surface.** Whatever the model sees must be inspectable by the author. Divergence between a human view and a machine view is only stable while exactly one of them is ever displayed — every unwatched channel decays to absent, a filename, or a lie. PDF: 9.5% fully accessible, and among *tagged* files 85% are defective. WebAIM Million 2026: pages *using* ARIA average more errors than pages without. `[primary]` A one-keystroke "show me what the model sees" is the mitigation, and no competitor has it.

---

## 7. The old plan, and how we got here

### 7.1 Chronology

| when | what |
|---|---|
| 2026-07-12/13 | Demand research. 11 then 18 agents. 92 sourced pain points, 89 feature requests, 20-app competitor matrix → `FRONTMATTER-PRODUCT-PLAN.md` |
| 2026-07-13 | First repo commits. Sixteen days of cloning and rebranding the `md` app |
| 2026-07-29 | **First engine document.** `5ff90a4` `[measured]` — the engine program starts here |
| 2026-07-29 | mdz research handoff: "build a compiler and IDE, not a format" |
| 2026-07-30 | Graph-engineering research folded in; the CRDT conflict flagged |
| 2026-07-30 | Sagnik pushes back on extensibility → five agents briefed to argue *for* → §10 overturned |
| 2026-07-30/31 | Six-area utilization sweep: constructs, plugins, security, a11y, i18n, conventions |
| 2026-07-31 | Dossier PDF; MDMAX concept named |
| 2026-08-01 | 25-agent foundations workflow |
| 2026-08-01 | **18-area capability workflow, adversarially verified** — 39 agents, 7.86M tokens |
| 2026-08-01 | Thinking agent; corpus pinned; product decisions D1–D5; **this document** |

**The engine program is three working days old.** That matters: the problem is not that we over-researched for a month. It is that we produced 2.4M+ research tokens and 1.09 MB of documents in three days and metabolised none of it. Different disease, different cure — one reconciliation pass and one artifact, not a moratorium.

### 7.2 What we tried and abandoned, with the reason

| idea | why it died |
|---|---|
| **MD3** as a name | Material Design 3 — 142/142 npm packages, 5,611 repos, and it collides with our own icon standard |
| **MDZ** as a name | `.mdz` is already the extension for compressed markdown packages, four live projects. Clean as a word, occupied as a format |
| **markedmax** | `marked` is a 61M/week parser and one of our four required ports |
| **Base64 binary in markdown** | 0.912 tokens per source byte. A 200 KB JPEG is 93% of a 200K window |
| **Polyglot ZIP tail** | UTF-8 round trip produces 82,957 replacement characters, +81% bytes; our own editor mangles it |
| **A new dialect** | MDX has Vercel and reaches 3.07% of `.md` volume; Markdoc has Stripe and reaches 0.136% |
| **MDX as the base** | It provably cannot write the document back out. Verified: its writer emits `{1 + 1}` from a program whose parsed body is empty |
| **A runtime** | The moment the engine needs an interpreter to read a file, it is MDX |
| **Changing CommonMark** | Zero net new conformance examples 2021→2024; no governance file; its own author built a rival language instead |

---

## 8. What the research established

Sorted by how much weight it can bear.

### 8.1 Load-bearing and verified

1. **Splice-only is a theorem.** §4.2. Do not propose regenerating from the tree.
2. **Refusal beats guessing.** Every position-based tiebreak made anchoring dramatically worse.
3. **Extensibility in the value, never the node type.** §5.
4. **A document names a capability, never carries one.** Every self-declaring format that carried its definition produced CVEs — XML's internal DTD subset gave us XXE; vim modelines have five CVEs across 24 years, the most recent four months ago. `[primary]`
5. **Clean degradation is necessary and insufficient.** `markdown-it-decorate` achieved perfect silent invisibility and has 1,094 downloads/week, unshipped since 2017. `markdown-it-attrs` degrades to *visible junk* and has 280,897. **The consumer supplies adoption, not the design.**
6. **In-band instruction/data separation does not work.** A fence around untrusted data moved attack success 51% → 50%; the sandwich defence made it *worse* at 55%. Architectural tool filtering got 6.8%.
7. **Normalize for comparison, never for storage.** Bengali RRA/YYA/RHA are on Unicode's Composition Exclusion Table, so NFC *decomposes* them — running it on one real poem file changes 77 of 437 lines while the rendered text is byte-identical. `[measured]`

### 8.2 True, and smaller than we said

- **Fence dispatch works permissionlessly** — thirty uncoordinated platforms render mermaid — **but the rate is 0.89%, not the absolute count.** The mechanism is validated; the penetration is not.
- **Markdown merges no worse than code.** Excluding blank lines, markdown is 84.8% unique lines against TypeScript's 78.1%. Blank lines were the entire deficit.
- **Token savings are real and mostly not markdown's.** ~91% of markdown's apparent advantage over JSON is JSON's indentation plus per-row key repetition. Hold the data model fixed and markdown saves 9.7%. Against CSV it loses.

### 8.3 Refuted — do not repeat these

- **"Markdown is optimal for AI because models were pretrained on it."** No source. Meta measured the opposite and stripped it.
- **"Deleting near-miss content is worth up to 65%."** Refuted for frontier models by a March-2026 replication — only 12.4% of distractors survived a relevance audit and the audited drop was 0–2pp. Survives in RAG only.
- **"Every plugin cluster matching a native format feature is 10–35× smaller."** The denominator was never reported. Baseline is 10.25×; two of three clusters *invert*.
- **"Content-derived re-anchoring has no precedent."** 25 years of prior art — Brush & Bargeron MSR-TR-2001-107, a granted Microsoft patent, the W3C Web Annotation Data Model's `TextQuoteSelector`, Hypothes.is in production.
- **"Deduplication is a major lever."** Byte share on hand-authored content is 0.33–1.33%, and the median duplicate block is `---`.

---

## 9. What we got wrong

Kept deliberately. A plan that only argues its own case is marketing.

### 9.1 Eighteen of eighteen research headlines were refuted by their own verifier

Always in the flattering direction. `0.155% → 0.0204%` · `51,620 → 17,065` · `30× → 3.44×` · `"zero implementations" → two shipping packages found in one query`. **193 claims killed, 188 method defects found.** Random error is symmetric; a 100% one-directional defect rate is a reward function, not noise.

### 9.2 There was no pinned corpus

Seven file counts reported across eighteen areas — 4,312, 4,317, 4,710, 4,823, 5,981, 5,986, 2,586 — **and none reproduces under any stated exclusion policy.** `[measured]` Exclusions were flipped *within a single area* to suit the conclusion. My own earlier "4,312" was wrong too; the clean answer under that policy is 4,293, because a `prune` only pruned top-level `node_modules`.

**Fixed.** `docs/engine/research/corpus-manifest.json`, `corpus_id` in this document's frontmatter, every file carrying a sha256.

### 9.3 The flagship justification was too narrow

We justified block identity with *"a git pull yields no op stream."* A git pull yields two blobs and a merge base, and a diff **is** an op stream. Worse, **the 294-revision-pair corpus was built from git history — the diff was in hand for all 41,642 block-versions and was never used as a baseline.** Corrected in §4.1; `diff3-assisted` becomes arm 7 of the benchmark before anything is published.

### 9.4 The number everything rests on has been re-derived by nobody

99.627% / 0.050% / 0.323% is cited by eight research areas. One admits in writing it was *"quoted from the task brief, not re-measured here."* It has not been recomputed since it was first produced. **§11, W2.**

### 9.5 The flagship number does not transfer to the flagship feature

99.627% is a **block** figure. Comments and suggestions anchor **ranges**. The one adversarial replication of the range case gives 3.44×, not 30×, with refusal roughly *doubling*, and there is no hand-audited range false-match number at all.

### 9.6 Roughly one heading in four cannot carry an anchor

Under-3-token ATX headings: 18.3% / 25.4% / 24.7% across three corpora. `[measured]` Headings are what comments, `#heading` links and transclusions point at. **The number a user experiences is over blocks they wanted to point at, and we have never reported it.**

### 9.7 Five designs were built on a carrier two measurements had already broken

Five research areas made the HTML comment their primitive while two measured that GitHub's blob renderer deletes it outright. Nobody reconciled it. **D2 makes this moot for comments** and §11 S1 makes it impossible to repeat.

### 9.8 The document became the product

`PLAN.md` reached v0.6.0 with a changelog, a supersession chain and corrections-in-place. Three of the last four commits were cosmetic fixes to a 439 KB PDF about an engine with zero lines of code. **Honesty was being converted into inertia** — every correction made the document more valuable and harder to abandon.

### 9.9 Two tooling guards were reporting false failures

`workflow-lint.sh` uses `printf | grep -q` under `set -o pipefail`; `grep -q` exits on first match, `printf` takes SIGPIPE, and the pipeline reports **141** — so a successful match reads as a failed check on any file over the pipe buffer. Three sessions of spurious warnings. `[measured]` One-line fix in §11 S0.

---

## 10. The MVP

**One release, two artifacts, zero shared dependencies.**

### 10.1 The rule that picked them

> **Choose the deliverable whose output shape cannot be a headline.**

Eighteen refuted headlines is a reward function that pays for sentences. A conformance matrix is N constructs × M consumers of PASS / STRIP / CORRUPT. It cannot flatter anybody. It can only tell you things you did not write.

### 10.2 Artifact 1 — `mdmax cert`

```
mdmax cert <file> --targets <product,surface>... --fail-on BROKEN
```

Per document, per target, per construct: **PASS · STRIP · CORRUPT**. Targets modelled as `(product, surface)` pairs, because github-blob, github-comment and github-pages measurably disagree on identical bytes.

- **Proves the thesis.** "Degradation is the feature" is our settled invariant and nobody has ever measured degradation.
- **Useful to a stranger.** Everyone who has written a README and wondered whether the callout renders on Pages.
- **Undismissable.** babelmark3 differs spec examples; nobody ships a per-document, offline, version-pinned, target-scoped matrix.
- **Zero dependencies.** No anchor, no normalize, no splice.
- **It makes OKF a column instead of a host.**

### 10.3 Artifact 2 — `mdmax edit`

```
mdmax edit <file> --old <text> --new <text>   →  splice + receipt + post-write re-anchor assertion
```

The splice writer, the receipt, and the assertion that the thing you pointed at is still the thing you pointed at. This is what makes it a compiler rather than a linter.

### 10.4 What is deliberately NOT in the MVP

Comments, suggestions, presence, real-time, the container, the doc tree, provenance records, the AI view. Every one is downstream of §10.3 or of multi-tenancy, and multi-tenancy has zero engine content.

---

## 11. Execution plan

Each step names its gate. **A step without a falsifiable gate is a wish.**

### S0 — Hygiene · half a day · unblocks trust in every future number

| task | why |
|---|---|
| `git checkout -- package.json` | reverts an unwanted `@anthropic-ai/tokenizer` added by a research subagent. **RULE 2 — needs an explicit yes** |
| commit the `search-index.ts` comment fix | already correct in the tree; corrects a false comment we wrote |
| add `.claude/worktrees` to the vitest `exclude` | **66.4% of the "green" suite is two abandoned worktrees pinned at a pre-work commit.** Until this lands, no test result means anything |
| fix `workflow-lint.sh:29` → `has() { grep -qE "$1" "$F"; }` | §9.9 |
| `PLAN.md` §13 says a defect "remains open, deliberately" that was fixed five commits earlier | stale record |
| `docs/mdmap/MAP.md` declares `stale: 0` while sitting 16 commits behind | the reconciler's own failure case, in the reconciler's own concept doc |

> **Gate:** `vitest list --run --filesOnly` returns only files under `test/`, and the linter passes on a file over 64 KB.

### S1 — Reconcile, do not extend · one day · all reading

| task | why |
|---|---|
| `CORRECTIONS.md` — one line per defect, one status column | **The corrections do NOT go into `PLAN.md`.** That is how a document becomes a product (§9.8). `PLAN.md` gets one commit adding a banner pointing here |
| Diff the 2026-07-30 audit against the 2026-08-01 critic | they overlap on ~2 items of 20+. Quarto, XLIFF/ITS, the LoC statement, patents, the uncited numbers, §16's missing inter-rater kappa are in the first and absent from the second. **Two independent audits, never put side by side** |
| Read OKF `SPEC.md` v0.2 — 37,544 bytes | we have decided against it **twice, unread**. Its §5.1 already ships keyed identity with our own rationale, and v0.2 is acquiring a runtime |
| Sample 20 of the 193 verifier kills and re-verify | a verifier rewarded for finding defects will find defects that are not there. We are proposing to delete twelve design sections on unaudited kills |

> **Gate:** one defect list with a status per row, and a written OKF position citing the spec rather than a blog post.

### S2 — `mdmax cert` · two days

Build it. Vendor and version-pin the reference implementations. Ship the fixture.

> **Gate, and it must go RED first:** the assertion "an HTML comment survives to a GitHub blob view" must **fail** against the current design before the matrix is trusted. A test whose subject is a rare fault proves nothing until it reproduces the fault.

### S3 — Freeze `normalize()` · one day · **do this before any anchor is persisted**

The 99.627% was swept over 384 configurations under `NFC + collapse whitespace + lowercase`. If the hash input changes later, every stored anchor silently re-keys while the published number keeps describing code that no longer exists.

> **Gate:** `normalize()` is a frozen, versioned function with a fixture. Any change bumps a version and re-runs the sweep.

### S4 — `mdmax edit` + re-run the sweep on the pinned corpus · one week

Splice writer, receipt, post-write re-anchor assertion. Then re-derive the flagship number on `corpus_id sha256:3a010b16…` and **publish whatever comes out, including if it is worse.**

Add to the benchmark: **arm 7 `diff3-assisted`** (§9.3), **arm 8 `{#id}`** declared attributes, **arm 9 `TextQuoteSelector`**, **arm 10 Keyword Anchoring**. Report correct/false/refusal **stratified by token count**, and report the rate over *blocks a user would want to point at* alongside the rate over anchorable blocks (§9.6).

> **Gate:** 100% byte fidelity on untouched regions across 50 real files, verified by an **independent oracle** — not by a check that recomputes the span using the writer's own code path.

### S5 — The editor floor · parallel, no engine dependency

Multi-tenancy, accounts, share links with enforced roles. **This has zero engine content and will keep losing priority to compiler work precisely because it is uninteresting** — and nothing in the Google-Docs story is reachable without it.

### S6 — Comments · after S4 and S5

Sidecar threads, block-scoped anchors, orphaned-not-silently-placed on refusal, JSON export from day one.

> **Gate:** deleting the entire sidecar leaves `git status` clean and every file byte-identical. This is D4's promise as a CI assertion.

### W — Three things running alongside

- **W1** — pin a **second corpus** that somebody else wrote. Everything we have measured comes from one operator's vault. `~/.claude/skills-src` is a candidate: 474 files, 5,013,124 bytes, git-tracked, 71.7% fence-bearing, with a documented ground-truth defect.
- **W2** — **one live model experiment.** The spec exists in four separate plans and has been run zero times. Until it runs, every "easier for AI" sentence is a prediction.
- **W3** — **one conversation with one person who is not us.** Zero users, zero interviews, zero willingness-to-pay probes across a million bytes of design for a collaboration product.

### The one standing rule

> **No further research fan-out until one committed assertion in this repository has gone from red to green against engine code.**

---

## 12. Kill gates

Each of these should stop us.

| # | if this is true | then |
|---|---|---|
| K1 | `diff3-assisted` matches or beats content-derived re-anchoring on consecutive pairs | the invention's value is the arbitrary-interval case only. Re-scope the claim and the benchmark |
| K2 | the re-derived anchor number is materially below 99.627% on the pinned corpus | publish it, and reconsider whether comments can anchor at all |
| K3 | the range resolver's false-match rate is above ~0.5% hand-audited | comments cannot use it. Fall back to quote-plus-digest with visible orphaning |
| K4 | `{#id}` declared attributes solve most of the anchoring problem in practice | say so. It becomes the strongest argument in the document, not a threat to it |
| K5 | the certificate finds no target disagreement anyone cares about | degradation is not a differentiator. Cut it |
| K6 | multi-tenancy does not ship | there is no Google-Docs story. The engine is then a standalone library and should be positioned as one |

---

## 13. Open decisions

Yours and Amit's. Each is one sentence to answer.

**13.1 Backend.** Firestore is in the code (7 files, `firebase ^12.16.0`) and in the mockup. `FRONTMATTER-PRODUCT-PLAN.md` says Supabase eleven times and Firebase zero. Not a contradiction — an undecided thing described twice. Pick one and correct the other document.

**13.2 Real-time multiplayer.** `PRODUCT-PLAN` §4b says no peer CRDT, server-authoritative. `PLAN.md` §8 says Eg-walker/Braid. **Both of §8's stated reasons are wrong** — one rests on a struck, `%`-commented line absent from the published paper. §4b is still the right answer; justify it on the Relay bug (a CRDT beside the filesystem shows a false conflict on every external write) and on adoption (73 downloads/week vs 7.2M), then strike the other two. Also: `PRODUCT-PLAN` still has three rows specifying Yjs. Anyone reading them builds the wrong thing.

**13.3 No-account reviewers.** Decided: login required (D3). Logged tradeoff: the research says Docs' review loop works *because* the reviewer never signs up, and recommends charging owner seats only. Revisit at auth.

**13.4 Does MDMAX have a business model?** Nothing written down. The implicit strategy is engine-as-free-public-good funding a paid editor — legitimate, and it inverts the build order. **If the engine is marketing, publish the benchmark and the certificate first. If the engine is product, build the compiler first and publish nothing.** We have been sequencing as if it is product while justifying it as if it is marketing.

**13.5 OKF.** Recommendation: **make it a target, not a host.** One more column in the certificate matrix — captures the interop, avoids the format war, and does not hand our roadmap to a spec that is acquiring a runtime. Confirm after S1's read.

**13.6 The notation/library feature.** Legitimate to defer entirely and ship S0–S6 without it. The measurement that decides it — does a smaller production model hold a declared notation — has never been made.

---

## 14. How we work now

Every rule below is derived from a failure in this record, not from generic advice.

| # | rule | the failure it prevents |
|---|---|---|
| P1 | Every reported figure names a `corpus_id`, or it is not reported | seven irreproducible counts; exclusions flipped inside one area |
| P2 | No headline without a committed derivation script and its captured output | a `101.1×` ratio propagated across two areas with no script anywhere |
| P3 | Parallel work only over disjoint artifacts, through one reconciliation gate | five designs on a carrier two areas had measured broken |
| P4 | A verifier's kills get sampled and re-verified before anything is deleted | twelve sections proposed for deletion on unaudited kills |
| P5 | Every byte written into a user's file passes a placement fixture first | a marker adjacent to a setext heading silently turns a heading into a paragraph plus a rule — and blank-line isolation does **not** prevent it |
| P6 | A design rule may only be derived from an operation the engine actually performs | a normative rule derived from a stringify round trip, in a splice-only engine that never stringifies |
| P7 | Freeze `normalize()` before persisting a single anchor | appears in no effort estimate anywhere |
| P8 | Every novelty claim carries the search that produced it | "no precedent" claimed five times; one of them was refuted by three sources this program had **already downloaded and dropped** |
| P9 | A number produced by replaying data through code says **SIMULATED** in the same sentence | multi-block moves; the Python-Markdown damage figure; every comprehension claim |
| P10 | The unit of progress is a test that can go red, not a section that can be written | 12 of 20 commits are docs; three of the last four are PDF page-break fixes |

---

## 15. Where everything lives

| artifact | path |
|---|---|
| **this plan** | `docs/mdmax/PLAN.md` |
| technical record | `docs/engine/PLAN.md` v0.6.0 — now downstream of this document |
| readable master plan | `docs/engine/README.md` |
| demand research | `docs/FRONTMATTER-PRODUCT-PLAN.md` + `docs/research/` |
| **pinned corpus** | `docs/engine/research/corpus-manifest.json` |
| 18-area verified research | `docs/engine/research/wf-mdmax-capability-2026-08-01.result.json` |
| 25-agent foundations research | `docs/engine/research/wf-findings-2026-08-01.md` |
| origin handoffs | `HANDOFF-mdz-…`, `HANDOFF-graph-engineering-…`, `HANDOFF-mdmax-…` (untracked) |
| security corpus, live | `test/preview/html-policy-xss.test.ts` — 55 payloads, DOM-verified |

---

## 16. The one-paragraph version

frontmatter is Google Docs for markdown. What makes that possible rather than aspirational is a compiler that can name a piece of a document durably and change a file without disturbing it — because a comment that stays attached, a suggestion you can accept, and a history you can diff all need a name markdown does not have. We have measured that anchoring problem more carefully than anyone has published, and we have also found that we overstated it: a previous version of the document almost always exists, so content-derived re-anchoring is the verifier and the fallback, not the primary mechanism. The research phase is over. What remains is two commands, a frozen normalizer, a re-derived benchmark, and the unglamorous multi-tenancy work without which none of the collaboration story is reachable. The first thing we ship is a conformance matrix, chosen deliberately because it is the one artifact whose output cannot flatter us.
