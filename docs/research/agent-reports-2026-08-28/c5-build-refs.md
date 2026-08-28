## KEY FINDINGS
- CodeMirror's entire public GitHub org (55/57 repos) was ARCHIVED 2026-04-15/16, but npm is very much alive — @codemirror/view v6.43.9 published 2026-08-16, all MIT. Source is read-only-but-readable; you cannot file upstream issues/PRs, so budget vendoring risk. [fetched]
- OKF (Open Knowledge Format, GoogleCloudPlatform/knowledge-catalog, Apache-2.0, v0.2, 8947 stars) is the industry formalizing frontmatter's EXACT bet: a dir of markdown+YAML-frontmatter files where the file path is identity and the one required field is `type`. Must-read #2 — align to it or consciously diverge. [fetched]+[SS]
- diff-match-patch resolves cleanly: Apache-2.0 (permissive, safe), but Google's original repo is ARCHIVED/unpublished since 2020 — use the maintained @sanity/diff-match-patch v3.2.0 (2025) fork instead. [fetched]
- ACP: use the @agentclientprotocol/sdk namespace (v1.4.0, Apache-2.0, 2026-08-20); the old @zed-industries/agent-client-protocol v0.4.5 is deprecated. MCP SDK (@modelcontextprotocol/sdk v1.30.0) is mid-relicense MIT→Apache-2.0. [fetched]
- obsidian-dataview is MIT (not copyleft) — the closest prior art to 'a file becomes a board/dashboard' whose query parser you can actually TAKE, not just admire. TiddlyWiki filter engine is BSD-3-Clause, also linkable. [fetched]
- NEVER-LINK list: obsidian-kanban is GPL-3.0 AND abandoned (community-archive) — read the board file-format convention only. anthropics/skills has NO license file (all-rights-reserved) — mirror the SKILL.md convention, copy zero code. [fetched]
- Fidelity/anchoring stack verified permissive: Hypothesis match-quote.ts = BSD-2-Clause, approx-string-match = MIT (both by Robert Knight), W3C TextQuoteSelector = implement-freely spec. This is the 'AI target survives human edits' mechanism. [fetched]
- The 8 first reads: @lezer/markdown (span addressing), OKF SPEC, @codemirror/merge (review loop), match-quote+approx-string-match (anchoring), mdast-util-to-markdown (read the byte-losing serializer to sharpen the splice-writer value prop), @sanity/diff-match-patch, @modelcontextprotocol/sdk, obsidian-dataview. [inference]

---

## ANGLE 5 — THE BUILD-REFERENCE BIBLIOGRAPHY (frontmatter)

What to READ and what PATTERNS to take, license-flagged and liveness-verified. Every star/license/date is `[fetched]` from api.github.com / registry.npmjs.org / raw.githubusercontent.com on **2026-08-28→29** unless tagged `[SS]` (WebSearch) or `[inference]`. Read-effort: **S**=½-day skim, **M**=~1 day internalize+prototype, **L**=multi-day core dependency you live in.

---

### ⚠️ Cross-cutting finding you must not miss

**The entire public `codemirror` GitHub org was archived on 2026-04-15/16 (55 of 57 repos archived).** `[fetched]` This is NOT death: the npm packages are actively published — **`@codemirror/view` v6.43.9 was published 2026-08-16 (12 days before this report), `@codemirror/state` v6.7.1 (2026-07-05), `@codemirror/lang-markdown` v6.5.2 (2026-08-04), `@lezer/markdown` v1.7.2 (2026-07-15), all MIT.** `[fetched]` Practical consequence: the source is **read-only but fully readable** on the archived repos (perfect for a "read these" bibliography), npm is canonical and current, but you **cannot file issues/PRs upstream** — budget for vendoring/forking risk on any CM6 bug you hit. `[inference]`

---

### GROUP 1 — Editor substrate (CodeMirror 6 core)

| Repo / pkg | Verified | License | Read-effort | What to take |
|---|---|---|---|---|
| **`@lezer/markdown`** (lezer-parser/markdown, 147★) | v1.7.2, MIT `[fetched]` | MIT — **copy/link** | **L** | THE incremental markdown parse tree. `SyntaxNode` byte offsets = your span-addressing primitive (map a render region / AI target to exact `from,to`). `parser.configure({extensions})` is how you add profile syntax without forking. This is the single most load-bearing read for the splice writer + render mapping. |
| **`@codemirror/lang-markdown`** (131★) | v6.5.2, MIT `[fetched]` | MIT — **copy/link** | **M** | Nested-parser wiring: how YAML frontmatter + fenced code get sub-parsed inside one markdown buffer (`configureNesting`). Your editor's language layer starts here. |
| **`@codemirror/language`** (32★) | v6.12.4, MIT `[fetched]` | MIT — **copy/link** | **M** | Folding, `syntaxTree(state)`, indentation, `Language`/`LanguageSupport`. The bridge from lezer tree → editor behavior. |
| **`@codemirror/merge`** (105★) | v6.12.2, MIT `[fetched]` | MIT — **copy/link** | **M** | `unifiedMergeView`/`MergeView`, per-`Chunk` accept/reject gutter. This IS your human-reviews-AI-edits surface — the review loop as a shipped component. Highest reuse-per-hour in the list. |
| **`@codemirror/collab`** (49★) | v6.1.1 (2023, stable), MIT `[fetched]` | MIT — **copy/link** | **M** | `receiveUpdates`/`sendableUpdates`/`getSyncedVersion` — central-authority OT-lite collab. Simpler than CRDT when one server owns the file; the natural model for "AI + human edit the same file" with a referee. |
| **`@codemirror/lint`** (26★) | v6.9.7, MIT `[fetched]` | MIT — **copy/link** | **S** | `Diagnostic` + `linter()` underline/gutter. This is where the degradation-certificate + frontmatter/schema validation surface inline as squiggles. |
| **`y-codemirror.next`** (yjs, 206★) | v0.3.6 (2026-08-18), MIT `[fetched]` | MIT — **copy/link** | **M** | Yjs CRDT ↔ CM6 binding. Take this path INSTEAD of `@codemirror/collab` only if you want serverless local-first multiplayer; the two are alternatives, not both. |
| **Replit CM6 family**: `codemirror-indentation-markers` (89★, MIT), `codemirror-interact` (125★), `Codemirror-CSS-color-picker` (47★), `codemirror-vim` (468★, MIT, active 2026-07) `[fetched]` | mixed — vim/indentation-markers MIT; interact & color-picker **no SPDX detected** `[fetched]` | MIT / **verify-before-copy** | **S** each | Self-contained decoration/widget/`ViewPlugin` exemplars — the fastest way to learn the CM6 extension API by reading small real code. `interact` (alt-drag to scrub a number/color) is a great in-line-widget pattern for editable rendered values. **Flag: confirm the license file on interact + color-picker before copying — GitHub detected no SPDX.** |
| **`asadm/codemirror-copilot`** (162★) | v0.0.7, MIT, **last pub 2024-01-18** `[fetched]` | MIT — **pattern-only (stale)** | **S** | Inline ghost-text AI completion pattern for CM6. Stale (2 yrs) — copy the *pattern* (accept-on-Tab overlay), don't take the dep. |

---

### GROUP 2 — Markdown pipeline (AST + serialization + addressing)

| Repo / pkg | Verified | License | Read-effort | What to take |
|---|---|---|---|---|
| **`micromark`** (2216★) | MIT, active `[fetched]` | MIT — **copy/link** | **M** | The CommonMark-compliant tokenizer under remark. Read to know exactly where the spec boundary is (frontmatter's "profiles over valid CommonMark" must stay inside it). |
| **`mdast-util-from-markdown` / `-to-markdown`** (289★ / 140★) | MIT, active `[fetched]` | MIT — **copy/link** | **M** | `to-markdown` is the serializer that **normalizes** (re-wraps, re-quotes, reorders). Read it to pin the *exact* points where a remark round-trip LOSES bytes — that failure set is precisely what your byte-preserving splice writer's value prop is measured against. Read the enemy. |
| **`remark` / `unified`** (8987★ / 5024★) | MIT, active `[fetched]` | MIT — **copy/link** | **S** | Plugin pipeline architecture. Use for *read-side* transforms (render), never as the *write-side* serializer (that's your splice writer). |
| **`remark-directive`** (420★) | MIT `[fetched]` | MIT — **copy/link** | **S** | The `:::name{key=val}` generic directive grammar = the CommonMark-legal mechanism for your board/card/calendar profiles that degrade to plain text. This is the concrete syntax answer to "extensions as profiles, no new format." |
| **`github-slugger`** (Flet, 411★) | ISC `[fetched]` | ISC — **copy/link** | **S** | Exact GitHub-compatible heading→anchor slug algorithm. Needed for stable heading IDs and durable span anchors. |
| (also: `@lezer/markdown` — see Group 1, the addressing tree) | — | — | — | — |

---

### GROUP 3 — Render precedents (file → board / slides / dashboard)

| Repo / pkg | Verified | License | Read-effort | What to take |
|---|---|---|---|---|
| **`blacksmithgu/obsidian-dataview`** (9300★) | **MIT**, active `[fetched]` | **MIT — copy/link** | **M** | The closest prior art to frontmatter's whole rendering bet: `TABLE/LIST/TASK … FROM … WHERE …` query over frontmatter fields → a rendered view. **MIT means you can actually take the query parser, not just admire it.** Highest-value render read. |
| **`Milkdown` / `@milkdown/crepe`** (11864★) | v7.22.1 (2026-08-12), MIT `[fetched]` | MIT — **copy/link** | **M** | ProseMirror-based WYSIWYG-over-markdown, render-in-place. The best "same buffer, rich render, still markdown" precedent (even though you're CM6-based). Crepe = batteries-included; read its plugin/slice architecture for the render-region model. |
| **`mermaid`** (89974★) | v11.17.2 (2026-08-25), MIT `[fetched]` | MIT — **copy/link** | **S** | Read the **kanban** and **timeline** diagram grammars specifically — text→board and text→timeline parsers you can mirror for the calendar/board renderers. |
| **`marp-core` / `marpit`** (1148★) | v4.4.0 / v3.2.2, MIT `[fetched]` | MIT — **copy/link** | **S** | Directive-driven markdown→slides. The canonical "one .md renders as an entirely different artifact via frontmatter/directives" precedent. |
| **`TiddlyWiki5`** (TiddlyWiki/, 8632★) | **BSD-3-Clause** (verified via LICENSE — GitHub mislabels NOASSERTION), active 2026-08-25 `[fetched]` | **BSD-3-Clause — copy/link (attribution)** | **M** | The filter DSL (pipe-chained selectors over a set of documents) is decades-deep prior art for "query a folder of .md into a view." Permissively licensed — you may actually port it. |
| **`obsidian-kanban`** (now `community-archive/obsidian-kanban`, 4483★) | **GPL-3.0**, moved to community-archive (original author abandoned) `[fetched]` | 🚫 **GPL-3.0 — PATTERN-ONLY, never link** | **S** | Read *only* the file-format parser: the `## Lane` + `- [ ] card` fenced-board convention that a huge install base already recognizes. Copy the *convention*, write your own parser. Do not import a line. |

---

### GROUP 4 — Protocol SDKs (the AI-protocol layer)

| Repo / pkg | Verified | License | Read-effort | What to take |
|---|---|---|---|---|
| **`@modelcontextprotocol/sdk`** (typescript-sdk, 13266★) | v1.30.0 (2026-07-27); **MIT→Apache-2.0 transition in progress** (LICENSE confirms) `[fetched]` | MIT/Apache-2.0 — **copy/link** | **M** | Tool/resource/prompt server the AI uses to read + splice the file. The transport + tool-definition substrate. Note the live relicensing: new contributions are Apache-2.0. |
| **`@agentclientprotocol/sdk`** (agentclientprotocol/agent-client-protocol, 4095★) | **v1.4.0 (2026-08-20), Apache-2.0** `[fetched]` | Apache-2.0 — **copy/link** | **M** | Zed's editor↔agent protocol — drive an external coding agent *inside* your editor. **Use the `@agentclientprotocol/sdk` namespace; the old `@zed-industries/agent-client-protocol` v0.4.5 (2025-10) is the deprecated name.** `[fetched]` |
| **`modelcontextprotocol/modelcontextprotocol`** (spec, 9072★) | NOASSERTION = mixed MIT/Apache/CC-BY, active `[fetched]` | mixed permissive — **implement freely** | **S** | The spec (vs the SDK). Read for the resource/subscription model that lets an agent watch a file. |
| **"Agent Trace spec"** → `open-telemetry/semantic-conventions` (639★, Apache-2.0) + **MCP SEP-414** (W3C `traceparent`/`tracestate`/`baggage` over MCP) `[fetched]`+`[SS]` | Apache-2.0 / W3C — **implement freely** | **S** | There is no single "Agent Trace" repo; the standards-track answer is **W3C Trace-Context + OTel `gen_ai.*` semantic conventions + MCP's tracing SEP**. Align your record/replay-what-the-AI-did audit trail to these attribute names rather than inventing your own. `[SS]` Oracle's "Open Agent Spec Tracing" is a secondary reference. |

---

### GROUP 5 — Fidelity / anchoring prior art (re-find the AI's target after edits)

| Repo / pkg | Verified | License | Read-effort | What to take |
|---|---|---|---|---|
| **`hypothesis/client`** → `match-quote.ts` (725★) | **BSD-2-Clause** (LICENSE verified: "Redistribution and use…") `[fetched]` | **BSD-2 — copy/link (attribution)** | **M** | The reference implementation of prefix/exact/suffix quote re-anchoring against a mutated document. This is the mechanism behind "the AI's target survives human edits." Read `match-quote.ts` + its selector serialization. |
| **`approx-string-match`** (robertknight, 55★) | v2.0.0, **MIT** `[fetched]` | MIT — **copy/link** | **S** | Bitap fuzzy matcher by the same author, the fuzzy core `match-quote` sits on. Small, focused, take it directly. |
| **`@sanity/diff-match-patch`** (fork) | v3.2.0 (2025-01), **Apache-2.0** `[fetched]` | Apache-2.0 — **copy/link** | **S** | The diff/patch/match primitive under the splice writer + merge view. **Use the Sanity fork — Google's original `diff-match-patch` v1.0.5 is Apache-2.0 too but the repo is ARCHIVED and unpublished since 2020.** `[fetched]` The "(license!)" flag resolves to: Apache-2.0, permissive, safe — just take the maintained fork. |
| **`w3c/web-annotation`** (TextQuoteSelector, 156★) | W3C Document License `[fetched]` | W3C doc — **implement freely (don't republish text)** | **S** | The standard `TextQuoteSelector`/`TextPositionSelector` data model to serialize an anchor INTO frontmatter. Specs are meant to be implemented; just don't copy the prose. |

---

### GROUP 6 — Local-first / conventions references

| Repo / spec | Verified | License | Read-effort | What to take |
|---|---|---|---|---|
| **OKF — Open Knowledge Format** (`GoogleCloudPlatform/knowledge-catalog` → `okf/SPEC.md`, 8947★) | **v0.2, Apache-2.0**, active 2026-08-28 `[fetched]`; announced by Google Cloud June 2026 `[SS]` | Apache-2.0 — **implement freely** | **M** | 🎯 **The industry just formalized frontmatter's exact bet.** "A directory of markdown files with YAML frontmatter; the file path is its identity; exactly one required field: `type`; if you can `cat` it you can read it." `[fetched]` Read cover-to-cover: it either validates your thesis or shows where a standards body drew the line differently. Align to it or consciously diverge. |
| **`team-reflect/reflect-open`** (1441★) | **MIT**, active 2026-08-26 `[fetched]` | MIT — **copy/link** | **S** | Reflect's open local-first note core. Reference for the local-first sync/store shape. |
| **`letta-ai/letta`** (MemFS / memory blocks, 24479★) | **Apache-2.0**, active `[fetched]` | Apache-2.0 — **copy/link** | **M** | The agent-memory-as-filesystem / editable memory-block pattern — directly relevant to "the AI works in the same file and remembers." Read the memory-block + filesystem abstraction. |
| **`AnswerDotAI/llms-txt`** (2587★) | Apache-2.0, active 2026-08-26 `[fetched]` | Apache-2.0 — **implement freely** | **S** | The `/llms.txt` convention for exposing a repo/site to agents. ("v2" per the founder = the current evolving spec; the repo is the source of truth.) `[fetched]`/`[inference]` |
| **`anthropics/skills`** (SKILL.md convention, 172254★) | **NO LICENSE FILE** — all-rights-reserved by default `[fetched]` | 🚫 **no grant — SPEC/PATTERN ONLY, do not copy code** | **S** | The `SKILL.md` = YAML-frontmatter-fronted instruction-file convention (frontmatter-shaped skills). Read to mirror the convention; you get **no license to copy code** — reimplement. |
| **"obsidian-second-brain AI-first note conventions"** | no single dominant repo found (candidates 1–3★) `[fetched]` | pattern-only | **S** | Could not verify a canonical repo — the concept (PARA/Zettelkasten + AI-frontmatter) matters more than any specific low-star repo. **Substitute the license-clean, higher-authority references above: OKF (Apache-2.0) and Reflect Open (MIT) cover the same ground cleanly.** `[inference]` |

---

## ★ READ THESE 8 FIRST (highest leverage for frontmatter's specific bets)

1. **`@lezer/markdown`** (MIT, L) — span addressing via `SyntaxNode` byte offsets; the foundation of the splice writer + render mapping.
2. **OKF `SPEC.md`** (Apache-2.0, M) — the industry's formalization of frontmatter's own thesis; read to align or consciously diverge.
3. **`@codemirror/merge`** (MIT, M) — the human-reviews-AI-edits surface as a shipped component (your review loop).
4. **`hypothesis/client` `match-quote.ts`** + **`approx-string-match`** (BSD-2 / MIT, M) — re-anchor the AI's target after human edits.
5. **`mdast-util-to-markdown`** (MIT, M) — read the serializer that *loses* bytes, to make the byte-preserving splice writer's value prop precise.
6. **`@sanity/diff-match-patch`** (Apache-2.0, S) — the maintained diff/patch primitive (NOT Google's archived original).
7. **`@modelcontextprotocol/sdk`** (MIT→Apache-2.0, M) — the protocol the AI speaks to touch the file.
8. **`blacksmithgu/obsidian-dataview`** (MIT, M) — the closest MIT-licensed prior art for "a file/folder becomes a board/dashboard" (a query parser you can actually take).

*Next-4 if time allows:* `@codemirror/lang-markdown` (nesting), `remark-directive` (profile syntax), `@agentclientprotocol/sdk` (editor↔agent), `letta-ai/letta` (AI-in-file memory).

---

## 🚫 LICENSES TO NEVER LINK (copyleft or no-grant — read for patterns, ship nothing)

- **`community-archive/obsidian-kanban` — GPL-3.0** `[fetched]`. Copyleft: linking/deriving forces frontmatter itself to GPL. Also abandoned (moved to community-archive). Read the board file-format convention only; write your own parser.
- **`anthropics/skills` — NO LICENSE (all rights reserved)** `[fetched]`. Not copyleft, but no copy grant exists. Mirror the SKILL.md convention; reimplement, copy zero code.
- **General standing rule** `[inference]`: never link **any GPL / AGPL / SSPL** repo into frontmatter's distributable. AGPL is the sharpest trap in this space (network-use triggers source disclosure) — none appeared in this set, but audit every new editor/Obsidian-plugin dependency for it before adding, since that ecosystem skews copyleft.
- **Not a risk (clarifications):** `w3c/web-annotation` (W3C doc license) and the `modelcontextprotocol` spec (NOASSERTION = mixed MIT/Apache/CC-BY) are **specs meant to be implemented** — safe to build from, just don't republish the prose. `diff-match-patch` and `TiddlyWiki5` scared off some builders as "NOASSERTION/unclear" but verify to **Apache-2.0** and **BSD-3-Clause** respectively — both permissive and safe. `[fetched]`

---

### Method / caveats
All liveness, star, license, and publish-date values are `[fetched]` from api.github.com, registry.npmjs.org, and raw.githubusercontent.com LICENSE files on 2026-08-28/29. OKF's provenance/announcement details and the Agent-Trace landscape are `[SS]` (WebSearch, not primary-opened). Shortlist ranking, license *postures* (copy/pattern/avoid), and the CM6-archive risk assessment are `[inference]`. NOASSERTION licenses were resolved by reading the raw LICENSE file where it mattered (Hypothesis=BSD-2, TiddlyWiki=BSD-3, MCP=MIT→Apache transition). WebFetch was not needed; no gate refusals hit.