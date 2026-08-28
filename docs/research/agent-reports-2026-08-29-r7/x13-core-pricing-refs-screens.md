### FX correction — load-bearing, corrects the brief
| Item | Value | Tag |
|---|---|---|
| Working rate | ₹95.4 per US$1 (Aug 2026); search range ₹95.14–95.9 (Bloomberg USDINR + Fed H.10) | [SS] |
| Brief's stated rate | ~₹83 — **wrong**; INR depreciated ~13% vs the brief's assumption | [SS] |
| ₹299/mo | Brief said ~$3.6 → **actual $3.13** | [measured on SS rate] |
| ₹699/mo | Brief said ~$8.4 → **actual $7.33** | [measured on SS rate] |
| Instruction | Re-confirm the live rate before publishing any number | [SS] |

**Currency reference @95.4:** ₹99=$1.04 · ₹149=$1.56 · ₹199=$2.09 · ₹249=$2.61 · ₹299=$3.13 · ₹399=$4.18 · ₹499=$5.23 · ₹599=$6.28 · ₹649=$6.80 · ₹699=$7.33 · ₹999=$10.47 | $4=₹382 · $5=₹477 · $8=₹763 · $10=₹954. [measured]

### Revealed India AI-productivity WTP (the correct anchor, not PPP-off-USD)
- ChatGPT Go: **₹399/mo** India-exclusive tier, launched Aug 2025; given away **FREE** to Indian signups Nov 2025. [SS]
- Google Gemini AI Plus: **₹199/mo intro (6 mo) → ₹399/mo**, explicitly a "sub-$5 AI plan for India." [SS]
- Perplexity Pro: FREE via Airtel, worth ₹17,000/yr, to ~400M users. [SS]
- Netflix India (mass-media habit anchor): Mobile ₹149 · Basic ₹199 · Standard ₹499 · **Premium ₹649**. [SS]
- Indian micro-SaaS starter band: **₹299–₹499** starter (freelancers/micro-biz); ₹999–₹1,999 growth (teams). [SS]
- JetBrains India (flagship dev tool that DOES INR-price): IntelliJ Ultimate ~₹1,043/mo (~₹4,499/yr). [SS]
- Notion: **no real INR tier** — bills USD, ~₹670 Plus / ₹1,250 Business; drives grey-market resale at "$30/yr". [SS]

### Verdict on ₹299 (entry) — KEEP
- Below ChatGPT Go ₹399; inside Gemini ₹199–399; at floor of micro-SaaS starter band; strong psychological point; **undercuts Notion-India ₹670 by ~55%**. [SS]/[inference]
- **Contradiction kept:** ₹299 is only ~22–37% below USD entry ($4–5 = ₹382–477), i.e. *below* the 40–60% PPP band the prior round (e3) cited — the report resolves this by asserting revealed WTP, not PPP-off-USD, is the correct anchor for an AI tool. [inference]
- Funnel alternative **₹249**: hits the 40–60% PPP band (48% off $5), undercuts ₹399 anchors more decisively. **Recommend A/B ₹299 vs ₹249; both defensible.** [inference]

### Verdict on ₹699 (top) — the weakest number in the draft, CHANGE IT
- ₹699 ≈ $7.33: (a) above *every* India AI anchor (ChatGPT Go ₹399, Gemini ₹399) and above Netflix Premium ₹649; (b) only ~19–27% below the $9–10 world power tier = **near global parity, not an India price**; (c) a steep **2.34× jump** from ₹299. [inference]
- **Recommend ₹599/mo** (below the ₹649 ceiling, clean 2× step, ~30% off the $9 world tier), OR make the top SKU a **flat commercial-use license ~₹3,999/yr** (Obsidian Commercial model) instead of a monthly power tier. "₹699/mo monthly is the one number I'd push back on hardest."

### Billing cadence — annual is a fee-survival requirement, not an upsell
- Lead annual in India: **₹2,499/yr entry ≈ ₹208/mo**; **₹4,999/yr power ≈ ₹417/mo**; monthly as the convenience option. [inference]
- **UPI Autopay is frictionless:** RBI Digital Payments E-Mandate Framework 2026 allows no-OTP auto-debit up to **₹15,000/txn** after one-time mandate; both tiers far under the cap. [SS]

### AI unit economics — the arithmetic
Net revenue per ₹299 monthly subscriber ≈ **₹246–249 ≈ $2.58–2.61** [inference on SS inputs]:
| Path | Arithmetic | Net |
|---|---|---|
| Razorpay (domestic, UPI-native) | ₹299 GST-inclusive → net of 18% GST = ₹253; less ~2% + 18% GST on fee (₹7). UPI carries **0% MDR** but ~2% Razorpay platform fee | **₹246 ≈ $2.58** |
| Dodo MoR (monthly) | fee 4% + $0.40 flat = **₹50 = 16.8% of ₹299** (the flat $0.40 alone = **12.7%**) | **≈ ₹249** |
| Dodo MoR (annual ₹2,499) | same fee ≈ **5.5%** | — |

Inference budget for a healthy **70–80% gross margin**: COGS ≤ **$0.52–0.78/user/mo**; allocate ~**$0.15 hosting** + ~**$0.40–0.60 inference**. [inference]

**What ~$0.50/mo of metered inference buys** (one assist ≈ 3K in + 700 out tokens) [inference on SS API prices]:
| Model (in/out per M tok) | Cost/assist | Assists / $0.50 |
|---|---|---|
| Gemini 2.5 Flash $0.15/$0.60 · DeepSeek V4-Flash $0.22/$0.66 [SS] | ~$0.0011 | **~450** |
| Claude Haiku 4.5 $1/$5 [SS] | ~$0.0065 | **~77** |
| Frontier (Sonnet-class ~$3/$15) on 25K-ctx doc (25K in + 2K out) [inference] | ~$0.105 | **~5** |

**Margin survives by ARCHITECTURE, never by price.** No consumer INR price absorbs unlimited frontier inference (~5 heavy assists exhausts the whole budget). Settled model:
- **Free = BYO-key, unmetered, ZERO hosted credits** → $0 COGS for the heaviest users. [→ed4 rule]
- **Pro ₹299 = dollar-metered, model-tiered AI with a visible meter** — small hosted allowance defaulted to a cheap model (Flash/Haiku/DeepSeek-class, ~450 assists per $0.50); frontier + heavy usage is BYO-key ($0 COGS) or metered pass-through at cost-plus (COGS ≤ revenue by construction). [→ed4]
- **On-device small model** for ghost-text/checks/autocomplete (Craft precedent) = "one cheap surface unlimited" at ~zero marginal cost. [→master §11]
- **Anti-recommendation:** never bundle unlimited AI. **Cannot win India's subsidized-AI price war** — ₹199–399 is set by loss-leaders (ChatGPT Go free, Gemini ₹199 subsidized, Perplexity free via Airtel); a bootstrapped studio must not try. [SS]/[inference]

### Payment rails comparison
| Processor | Fee | UPI? | GST/tax handled? | Best for |
|---|---|---|---|---|
| **Razorpay** (domestic PSP) | ~2% + 18% GST on fee (UPI 0% MDR + ~2% platform fee) | **Yes, native** | **No** — founder is seller of record, owns GST filing | India-only sales, lowest fee |
| **Dodo Payments** (MoR, India-built) | **4% + $0.40** | **Yes** | **Yes** — MoR remits GST + global tax | Global + India in one stack; annual plans |
| Paddle (MoR) | 5% + $0.50, +3% non-domestic FX | **No UPI** | Yes | Global; abandons Indian UPI buyers |
| LemonSqueezy (MoR) | ~5% + $0.50 | **No UPI** | Yes | Global, no UPI |
| Creem (MoR) | 3.9% + $0.40 | limited | Yes | Cheap global alt |

- International gateways lose **30–40% of Indian checkouts** without UPI/domestic cards [SS, vendor-biased] → **UPI availability > the discount** (confirms e3).
- **GST reality [SS]:** SaaS = **18% GST (SAC 9983, no exemption)**; registration mandatory at ₹20L turnover **BUT from the first transaction for inter-state/export supply**. An MoR (Dodo) removes the compliance burden entirely.
- Cost-optimal split: **Razorpay for India + a MoR (Dodo/Paddle) for the world**; simplest: single UPI-capable MoR (Dodo does both). Geo-pricing is a **processor toggle** on the individual tier — near-zero engineering, reversible → **defer PPP builds, ship the toggle**. [SS]/[inference]

### World tiers (USD) — confirmed current
Obsidian: Sync **$4/mo annual, $5 monthly**; Publish **$8/$10**; Commercial **$50/user/yr** [fetched→f1]. HackMD Prime **$5/seat** [fetched→f1]; Bear Pro **$2.99**; Ulysses **$5.99**; Craft Plus **$8**; iA Writer **$49.99 one-time** [SS/fetched].
| Tier | Monthly | Annual | ~₹/mo | Anchor |
|---|---|---|---|---|
| Free | $0 | $0 | ₹0 | Obsidian free-forever; full editor + BYO-key unmetered + zero hosted credits |
| **Pro (entry)** | **$5** | **$48 ($4/mo)** | ₹477 | Obsidian Sync $4/$5, HackMD $5, Bear $3, Ulysses $6 — the $4–6 core-paid cluster; +metered AI, publish extras, linter |
| **Power** | **$10** | **$90 ($7.50/mo)** | ₹954 | Obsidian Publish $8/$10, Craft Plus $8; multi-site + higher AI meter + frontier metered |
| **Work** | — | **$50/yr flat** | — | Obsidian Commercial parity — commercial-use/compliance SKU, NOT more features |

Not underselling: entry at **$5 (not $3)** holds the Obsidian-Sync line; the differentiator (splice + degradation certificate + provenance + review loop — "an editor that provably never loses a keystroke") is a purchasable premium over GitBook's reliability churn [→e3].

### Recommended INDIA table (₹, @95.4)
| Tier | Monthly | Annual (pushed default) | ~$/mo | Contents | Justification |
|---|---|---|---|---|---|
| **Free** | ₹0 | ₹0 | $0 | Full editor, unlimited docs on your repo, offline, splice, **BYO-key AI unmetered**, fair-use publish, on-device ghost/checks, **zero hosted credits** | Top-of-funnel for 21.9M devs; $0 COGS by BYO-key |
| **Pro** | **₹299** *(A/B ₹249)* | **₹2,499** (~₹208/mo) | $3.13 | Publish extras, live editing, hosted convenience, small metered AI allowance on cheap model (visible $ meter), AEO linter | Below ChatGPT Go ₹399; inside Gemini ₹199–399; −55% vs Notion-India ₹670; net ~$2.6 margin-safe via metering |
| **Power** *(or fold into Work)* | **₹599** *(not ₹699)* | **₹4,999** (~₹417/mo) | $6.28 | Multi-site publish, higher meter incl. metered frontier, priority, early features | Below Netflix Premium ₹649; clean 2× step; ~30% off $9 world |
| **Work** (optional) | — | **₹3,999/yr flat** | — | Commercial-use license (support/compliance), not more features | Obsidian-Commercial model |

Geo-relationship: **₹299 vs $5 = 37% off; ₹599 vs $10 = 37% off** — coherent, revealed-WTP-anchored, lands on India psychological points without mechanical PPP. [measured]

### First-market decision: DISTRIBUTION India-first, REVENUE global-first
**India for distribution [SS]:** 21.9M GitHub contributors (+5.2M in 2025, overtaking the US; projected **57.5M by 2030**); India consumer app spend **$345M in Q2 2026, +35% YoY, non-gaming 68%**, productivity/AI-led; studio is India-based (UPI/Razorpay/GST native, founder-led community, low home-market CAC). Feed all of it into the free tier.
**Global for revenue [SS/inference]:** (1) **zero category-specific WTP evidence** for markdown/note tools in India (e3's honest negative); proven WTP skews US/EU (docs-as-code teams, prosumer writers at $4–8); (2) India AI price driven to zero by loss-leaders; (3) low-ticket INR monthly economics punishing — same feature at $5 nets ~**$4.2** vs ₹299 netting ~**$2.6**; (4) **Notion refuses to INR-price and still grows in India** — India can be an audience without being the revenue center.

### Three changes to the founder pricing draft (+ one thing to keep exactly)
1. Fix exchange assumption to **₹95.4** ($3.13/$7.33, not $3.6/$8.4).
2. Top tier **₹699 → ₹599** or a flat **₹3,999/yr** commercial license.
3. **Lead with annual billing in India** to survive per-transaction flat fees.
**Keep exactly:** the **metered/BYO-key AI architecture** — the only posture that survives India's subsidized-AI price war.

---

### Build bibliography — cross-cutting risk
**The entire public `codemirror` GitHub org was archived 2026-04-15/16 (55 of 57 repos).** [fetched] Not death: **`@codemirror/view` v6.43.9 published 2026-08-16**, `@codemirror/state` **v6.7.1 (2026-07-05)**, `@codemirror/lang-markdown` **v6.5.2 (2026-08-04)**, `@lezer/markdown` **v1.7.2 (2026-07-15)** — all MIT. [fetched] Source is **read-only but readable**; npm is canonical/current; **you cannot file issues/PRs upstream — budget vendoring/forking risk** on any CM6 bug. [inference] Read-effort key: **S**=½-day skim, **M**=~1 day internalize+prototype, **L**=multi-day core dependency.

### Group 1 — Editor substrate (CodeMirror 6)
| Pkg (stars) | Verified | Licence | Effort | Take |
|---|---|---|---|---|
| `@lezer/markdown` (lezer-parser/markdown, 147★) | v1.7.2, MIT [fetched] | MIT — copy/link | **L** | Incremental markdown parse tree; `SyntaxNode` byte offsets = span-addressing primitive (map render region / AI target to exact `from,to`); `parser.configure({extensions})` adds profile syntax without forking. Most load-bearing read for splice writer + render mapping |
| `@codemirror/lang-markdown` (131★) | v6.5.2, MIT [fetched] | MIT | **M** | Nested-parser wiring (`configureNesting`) — YAML frontmatter + fenced code sub-parsed in one buffer |
| `@codemirror/language` (32★) | v6.12.4, MIT [fetched] | MIT | **M** | Folding, `syntaxTree(state)`, indentation, `Language`/`LanguageSupport` |
| `@codemirror/merge` (105★) | v6.12.2, MIT [fetched] | MIT | **M** | `unifiedMergeView`/`MergeView`, per-`Chunk` accept/reject gutter = the human-reviews-AI-edits surface. **Highest reuse-per-hour in the list** |
| `@codemirror/collab` (49★) | v6.1.1 (2023, stable), MIT [fetched] | MIT | **M** | `receiveUpdates`/`sendableUpdates`/`getSyncedVersion` — central-authority OT-lite; simpler than CRDT when one server owns the file |
| `@codemirror/lint` (26★) | v6.9.7, MIT [fetched] | MIT | **S** | `Diagnostic` + `linter()` — where degradation-certificate + schema validation surface as squiggles |
| `y-codemirror.next` (yjs, 206★) | v0.3.6 (2026-08-18), MIT [fetched] | MIT | **M** | Yjs CRDT ↔ CM6. **Alternative to `@codemirror/collab`, not both** — take only for serverless local-first multiplayer |
| Replit family: `codemirror-indentation-markers` (89★, MIT), `codemirror-interact` (125★), `Codemirror-CSS-color-picker` (47★), `codemirror-vim` (468★, MIT, active 2026-07) | [fetched] | vim + indentation-markers MIT; **interact & color-picker: NO SPDX detected — verify-before-copy** | **S** each | Small decoration/widget/`ViewPlugin` exemplars; `interact` (alt-drag to scrub a number/color) = in-line-widget pattern for editable rendered values |
| `asadm/codemirror-copilot` (162★) | v0.0.7, MIT, **last publish 2024-01-18** [fetched] | MIT — **pattern-only (stale, 2 yrs)** | **S** | Inline ghost-text completion; copy the accept-on-Tab overlay pattern, **do not take the dep** |

### Group 2 — Markdown pipeline (AST + serialization + addressing)
| Pkg (stars) | Verified | Licence | Effort | Take |
|---|---|---|---|---|
| `micromark` (2216★) | MIT, active [fetched] | MIT | **M** | CommonMark-compliant tokenizer under remark; read to know exactly where the spec boundary is ("profiles over valid CommonMark" must stay inside it) |
| `mdast-util-from-markdown` / `-to-markdown` (289★ / 140★) | MIT, active [fetched] | MIT | **M** | `to-markdown` **normalizes** (re-wraps, re-quotes, reorders) — read it to pin the exact points a remark round-trip **loses bytes**; that failure set is what the byte-preserving splice writer is measured against. "Read the enemy" |
| `remark` / `unified` (8987★ / 5024★) | MIT, active [fetched] | MIT | **S** | Plugin pipeline for **read-side transforms only** — never as the write-side serializer |
| `remark-directive` (420★) | MIT [fetched] | MIT | **S** | `:::name{key=val}` generic directive grammar = the CommonMark-legal mechanism for board/card/calendar profiles that degrade to plain text |
| `github-slugger` (Flet, 411★) | **ISC** [fetched] | ISC | **S** | Exact GitHub-compatible heading→anchor slug algorithm; needed for stable heading IDs + durable span anchors |

### Group 3 — Render precedents (file → board / slides / dashboard)
| Repo (stars) | Verified | Licence | Effort | Take |
|---|---|---|---|---|
| `blacksmithgu/obsidian-dataview` (9300★) | **MIT**, active [fetched] | MIT — copy/link | **M** | Closest prior art to the whole rendering bet: `TABLE/LIST/TASK … FROM … WHERE …` over frontmatter fields → rendered view. **MIT means you can take the query parser, not just admire it** |
| `Milkdown` / `@milkdown/crepe` (11864★) | v7.22.1 (2026-08-12), MIT [fetched] | MIT | **M** | ProseMirror WYSIWYG-over-markdown; best "same buffer, rich render, still markdown" precedent; read Crepe's plugin/slice architecture for the render-region model |
| `mermaid` (89974★) | v11.17.2 (2026-08-25), MIT [fetched] | MIT | **S** | Read the **kanban** and **timeline** grammars specifically — text→board / text→timeline parsers to mirror |
| `marp-core` / `marpit` (1148★) | v4.4.0 / v3.2.2, MIT [fetched] | MIT | **S** | Directive-driven markdown→slides; canonical "one .md renders as a different artifact via frontmatter/directives" |
| `TiddlyWiki5` (8632★) | **BSD-3-Clause** (verified via LICENSE — **GitHub mislabels NOASSERTION**), active 2026-08-25 [fetched] | BSD-3 — copy/link with attribution | **M** | Filter DSL (pipe-chained selectors over a document set); decades-deep prior art for "query a folder of .md into a view" — **you may actually port it** |
| `obsidian-kanban` (now `community-archive/obsidian-kanban`, 4483★) | **GPL-3.0**, moved to community-archive, author abandoned [fetched] | **GPL-3.0 — PATTERN ONLY, NEVER LINK** | **S** | Read only the file-format parser: `## Lane` + `- [ ] card` fenced-board convention a huge install base recognizes. **Do not import a line — write your own parser** |

### Group 4 — Protocol SDKs
| Repo (stars) | Verified | Licence | Effort | Take |
|---|---|---|---|---|
| `@modelcontextprotocol/sdk` (typescript-sdk, 13266★) | v1.30.0 (2026-07-27); **MIT→Apache-2.0 transition in progress** (LICENSE confirms) [fetched] | MIT/Apache-2.0 | **M** | Tool/resource/prompt server the AI uses to read + splice the file; new contributions are Apache-2.0 |
| `@agentclientprotocol/sdk` (agentclientprotocol/agent-client-protocol, 4095★) | **v1.4.0 (2026-08-20), Apache-2.0** [fetched] | Apache-2.0 | **M** | Zed's editor↔agent protocol. **Use this namespace — `@zed-industries/agent-client-protocol` v0.4.5 (2025-10) is the DEPRECATED name** |
| `modelcontextprotocol/modelcontextprotocol` (spec, 9072★) | NOASSERTION = mixed MIT/Apache/CC-BY, active [fetched] | mixed permissive — implement freely | **S** | Resource/subscription model that lets an agent watch a file |
| "Agent Trace spec" → `open-telemetry/semantic-conventions` (639★, Apache-2.0) + **MCP SEP-414** (W3C `traceparent`/`tracestate`/`baggage` over MCP) | [fetched]+[SS] | Apache-2.0 / W3C — implement freely | **S** | **There is no single "Agent Trace" repo** — the standards-track answer is W3C Trace-Context + OTel `gen_ai.*` conventions + MCP's tracing SEP. Align the record/replay audit trail to these attribute names, don't invent your own. Oracle's "Open Agent Spec Tracing" = secondary reference [SS] |

### Group 5 — Fidelity / anchoring (re-find the AI's target after edits)
| Repo (stars) | Verified | Licence | Effort | Take |
|---|---|---|---|---|
| `hypothesis/client` → `match-quote.ts` (725★) | **BSD-2-Clause** (LICENSE verified) [fetched] | BSD-2 — copy/link with attribution | **M** | Reference implementation of prefix/exact/suffix quote re-anchoring against a mutated document = the mechanism behind "the AI's target survives human edits" |
| `approx-string-match` (robertknight, 55★) | v2.0.0, **MIT** [fetched] | MIT | **S** | Bitap fuzzy matcher by the same author; the fuzzy core `match-quote` sits on. Take directly |
| `@sanity/diff-match-patch` (fork) | v3.2.0 (2025-01), **Apache-2.0** [fetched] | Apache-2.0 | **S** | Diff/patch/match primitive under splice writer + merge view. **Use the Sanity fork — Google's original `diff-match-patch` v1.0.5 is also Apache-2.0 but the repo is ARCHIVED and unpublished since 2020.** The "(license!)" flag resolves to permissive/safe |
| `w3c/web-annotation` (TextQuoteSelector, 156★) | W3C Document License [fetched] | implement freely, don't republish prose | **S** | `TextQuoteSelector`/`TextPositionSelector` data model to serialize an anchor INTO frontmatter |

### Group 6 — Local-first / conventions
| Repo (stars) | Verified | Licence | Effort | Take |
|---|---|---|---|---|
| **OKF — Open Knowledge Format** (`GoogleCloudPlatform/knowledge-catalog` → `okf/SPEC.md`, **8947★**) | **v0.2, Apache-2.0**, active 2026-08-28 [fetched]; announced by Google Cloud June 2026 [SS] | Apache-2.0 — implement freely | **M** | **The industry just formalized frontmatter's exact bet:** "a directory of markdown files with YAML frontmatter; the file path is its identity; exactly one required field: `type`; if you can `cat` it you can read it." Read cover-to-cover — **align to it or consciously diverge** |
| `team-reflect/reflect-open` (1441★) | **MIT**, active 2026-08-26 [fetched] | MIT | **S** | Reflect's open local-first note core; local-first sync/store shape |
| `letta-ai/letta` (MemFS / memory blocks, 24479★) | **Apache-2.0**, active [fetched] | Apache-2.0 | **M** | Agent-memory-as-filesystem / editable memory-block pattern — "the AI works in the same file and remembers" |
| `AnswerDotAI/llms-txt` (2587★) | Apache-2.0, active 2026-08-26 [fetched] | Apache-2.0 — implement freely | **S** | `/llms.txt` convention for exposing a repo/site to agents ("v2" per the founder = the current evolving spec; the repo is source of truth) [fetched]/[inference] |
| `anthropics/skills` (SKILL.md convention, **172254★**) | **NO LICENSE FILE — all-rights-reserved by default** [fetched] | **NO GRANT — spec/pattern only, copy zero code** | **S** | Mirror the `SKILL.md` YAML-frontmatter-fronted instruction-file convention; **reimplement** |
| "obsidian-second-brain AI-first note conventions" | **no canonical repo found** (candidates 1–3★) [fetched] | pattern-only | **S** | Could not verify. **Substitute the licence-clean, higher-authority refs: OKF (Apache-2.0) + Reflect Open (MIT)** cover the same ground [inference] |

### READ THESE 8 FIRST
1. `@lezer/markdown` (MIT, L) — span addressing via `SyntaxNode` byte offsets. 2. **OKF `SPEC.md`** (Apache-2.0, M) — align or consciously diverge. 3. `@codemirror/merge` (MIT, M) — the review loop as a shipped component. 4. `hypothesis/client` `match-quote.ts` + `approx-string-match` (BSD-2 / MIT, M) — re-anchor after human edits. 5. `mdast-util-to-markdown` (MIT, M) — read the serializer that *loses* bytes. 6. `@sanity/diff-match-patch` (Apache-2.0, S) — NOT Google's archived original. 7. `@modelcontextprotocol/sdk` (MIT→Apache-2.0, M). 8. `blacksmithgu/obsidian-dataview` (MIT, M) — a query parser you can actually take.
*Next-4:* `@codemirror/lang-markdown` (nesting), `remark-directive` (profile syntax), `@agentclientprotocol/sdk` (editor↔agent), `letta-ai/letta` (AI-in-file memory).

### Licence landmines / NEVER-LINK
- **`community-archive/obsidian-kanban` — GPL-3.0** [fetched]: linking/deriving **forces frontmatter itself to GPL**; also abandoned. Convention only.
- **`anthropics/skills` — NO LICENSE (all rights reserved)** [fetched]: not copyleft but **no copy grant exists**.
- **Standing rule [inference]:** never link **any GPL / AGPL / SSPL** into frontmatter's distributable. **AGPL is the sharpest trap** (network use triggers source disclosure); none appeared in this set, but audit every new editor/Obsidian-plugin dep — that ecosystem skews copyleft.
- **`codemirror-interact` + `Codemirror-CSS-color-picker`: no SPDX detected — confirm the LICENSE file before copying.**
- **Not a risk (clarifications):** `w3c/web-annotation` (W3C doc licence) and the MCP spec (NOASSERTION = mixed MIT/Apache/CC-BY) are specs meant to be implemented — safe, just don't republish prose. `diff-match-patch` and `TiddlyWiki5` scared off builders as "NOASSERTION/unclear" but verify to **Apache-2.0** and **BSD-3-Clause** — both permissive. [fetched]
- **Method:** all liveness/star/licence/publish-date values [fetched] from api.github.com, registry.npmjs.org, raw.githubusercontent.com LICENSE files on **2026-08-28/29**. OKF provenance + Agent-Trace landscape are [SS]. Shortlist ranking, licence *postures*, CM6-archive risk assessment are [inference]. NOASSERTION resolved by reading raw LICENSE where it mattered. **No gate refusals hit; WebFetch not needed** — contrast with c4 and c6, where WebFetch/Mobbin were gate-refused.

---

### 12-screen inventory — two founder-mockup reconciliations (flagged up front)
1. **Editor is FOUR modes, not three.** Founder toolbar shows **Live / Edit / Split / Read**; prior report h1 recommended a three-state Source/Live/Reading. **Four is a superset** — Split = source+preview side-by-side, the founder's worthwhile addition over Obsidian's three. Ship four, default **Live**, `Edit` = raw source. [inference]
2. **The mockup's docked "AI writing section at the bottom" of the right rail CONTRADICTS the settled convention.** Founder rail carries Outline/Tags/History/Comment/AI-Edit tabs *plus a docked AI writing box*. Every shipped convention (Notion, Cursor, ed4 corpus) puts the AI prompt **at the cursor**; a rail-docked prompt "reads as bolted-on" [SS→h1]. **Keep the rail's AI-Edit TAB as the pending-hunk REVIEW surface only; the prompt summons at the selection.** [inference]

### Screen 1 — Onboarding / First-Run (value-before-auth)
- **Purpose:** first-timer editing a real markdown file and *seeing a custom render* before any account exists — local-first makes value-before-auth **architectural, not a growth hack**.
- **Above fold:** one Obsidian-shaped choice — **"Create a new vault"** (name + folder picker) or **"Open a folder as vault."** No email field, no OAuth wall. North-star help text [SS]: *"No account required… Privacy is the default, not a setting."* Third tile **"Try a sample vault"** → seeded HOME.md + one board + one decision doc, render magic visible **<10s**.
- **Primary interaction:** pick/create folder → land in the editor on a seeded `welcome.md` (a live-rendered file, not a modal); **editing it IS the tutorial** ("first task is the user's actual job" onboarding law [SS]).
- **Empty state:** this screen *is* the product's empty state; do not gate behind a carousel. Auth (GitHub App / Google per founder stack) deferred to sync/publish.
- **AI:** one optional "seed my vault" prompt on the sample tile → AI writes a starter HOME.md + 2–3 typed docs (decision/plan/board) via BYO-key or bundled on-device small model — **zero credits**. Keep skippable; local-first audiences are the most auth-averse and AI-suggestion-averse segment [inference→e2].
- **Copy-one:** Obsidian's zero-account folder-as-vault first run [SS]. **Avoid-one:** the multi-slide **personalization questionnaire before you can type**.

### Screen 2 — Dashboard / Home (HOME.md-as-home)
- **Purpose:** two jobs only — *resume the last thing*, *start a new thing* — from a surface that is itself a real markdown file (`HOME.md`) with custom-render blocks, doubling as the agent's entry-point document.
- **Above fold:** Band 1 = search/command bar + **Blank-first create row** (Blank tile first, ghost-styled, then template thumbnails, then "Template gallery" overflow — the Google Docs convention exactly [SS→h1]). Band 2 = recents grid with real content previews; **"Landed today" + a needs-review lane** at the head of recents [fetched→master plan §6].
- **Primary interaction:** click a recent to resume; Blank/template to create. Sections **independently hideable and reorderable from v1** — retrofitting section plumbing later is expensive [SS→h1].
- **Empty state:** the **templates row promoted**, no illustration. A brand-new vault seeds HOME.md from a starter template whose content *is* the recents+templates layout [inference→e2].
- **AI:** single "what do you want to work on?" input → opens a typed new doc or retrieves an existing one (citation-gated vault answer). AI-*suggested* content on home is **strictly opt-in** — Notion's "unremovable Recents/AI suggestions" is the named complaint magnet [SS→e2].
- **Copy-one:** Notion Home's reorderable/hideable sections [SS→h1]. **Avoid-one:** **displacing work state** — VS Code's forced Welcome tab produced years of "make it stop" issues [SS→e2]; home-on-startup is a setting, **default = restore-last-session**.

### Screen 3 — The Editor (Live / Edit / Split / Read)
- **Purpose:** CodeMirror-class markdown editor with left project tree, tabs, four-state mode toggle upper-right, right rail. One file, four ways to look at it.
- **Above fold:** centered dominant text column; segmented **Live/Edit/Split/Read** toggle upper-right (`Cmd+E` cycles); left collapsible file tree + tabs; right collapsible rail. **No persistent formatting ribbon** — selection bubble for formatting, `/` slash menu for block insertion [SS→h1].
- **Four modes [SS]/[inference]:** **Live** (default) WYSIWYM, markup reveals only when caret enters a span (Typora→Obsidian Live Preview); a binary edit/preview toggle ships 2020's pattern. **Edit** (=Source) raw markdown + syntax highlight for byte-level work. **Split** source left / rendered right, **scroll-synced by cursor position** (VS Code `Cmd+K V`, IntelliJ, MDHero all sync by default [SS]) — the founder's addition beyond Obsidian's three. **Read** fully rendered, no caret; custom-render profiles (board/decision/calendar/site) activate here and in Live.
- **Primary interaction:** type. Chrome (tree/tabs/rail) **auto-fades on typing**, returns on mouse-to-edge (iA/Ulysses) [SS→h1]. **Caret + scroll preserved across every mode switch** — OffsetMap already owns this primitive [fetched→master plan L0].
- **Empty state:** filename + dim "Start writing, or press / for blocks, Space for AI" — not a template wall. If the file has frontmatter, the rail's **Properties** tab is pre-focused (the namesake).
- **AI:** two triggers, both **at the cursor** — (a) selection bubble → "Edit with AI"; (b) `Space` on an empty block → inline prompt. Ghost text for insertions, inline diff for edits; **never auto-applied**. Rail's AI-Edit tab = *review* of pending hunks.
- **Rail tab order (reconciled):** **Properties** (typed frontmatter editor, default tab) → Outline → Comments → History → Tags → **AI-Edit**. Backlinks is a later tab, not v1 [inference→h1].
- **Copy-one:** Live Preview default + `Cmd+E` cycle upper-right [SS→h1]. **Avoid-one:** a docked rail prompt box as primary AI entry; also JetBrains' silent local-history expiry.

### Screen 4 — Custom-Render Views (one file, many surfaces)
Render = a *lens over the same `.md`*; switching a view never rewrites bytes it didn't touch. Each is a screen-state within Live/Read, activated by a frontmatter key.

**4a Kanban/Board** — Purpose: render a file (or folder) as a board where **columns are the values of one frontmatter field** (`status: draft → review → published`). Above fold: column headers = field values; cards = files showing title + one status-adjacent field + date (**2–3 properties max** [SS→h1]). Interaction: **drag a card between columns → rewrites that file's frontmatter field byte-identically** (one splice move on lezer spans — a thing no ProseMirror/TipTap board can promise) [fetched→master plan L1]. Empty: three seeded columns (Draft/Review/Published) + one ghost "＋ New card" per column + "columns are the values of your `status:` field — rename them by editing the field." AI: "Move stale cards" / "summarize this column" as board-level actions; each proposed move = a reviewable frontmatter-change chip, never a silent write. **Copy-one:** Notion's board = grouped DB view, drag rewrites the property [SS→h1]. **Avoid-one:** storing **card order as hidden block-IDs in the file** — spatial/order state belongs in a JSON sidecar that degrades gracefully [inference→master plan §8].

**4b Decision (ADR) view** — Purpose: render a decision doc as a scannable **decision card** (`type: decision`), the highest-value capture type. Above fold **[fetched]** (MADR template, `raw.githubusercontent.com/adr/madr/main/template/adr-template.md`): **status chip** driven by frontmatter `status: proposed | accepted | rejected | deprecated | superseded-by`, plus `date` and `decision-makers / consulted / informed` — **all stored in YAML frontmatter (the namesake doing real work)**. Body renders **Context/Problem → Decision Drivers → Considered Options (option cards) → Decision Outcome → Consequences (Good/Bad two-column) → Confirmation** [fetched]. Interaction: flip the status chip (proposed→accepted) → rewrites frontmatter `status`; superseding writes `superseded-by:` + links the successor. Empty: pre-filled ADR skeleton, six MADR sections as ghost prompts. AI: "Draft the consequences" / "what did we not consider?" fills option cards and Good/Bad columns as suggestions; a decision is exactly the artifact the capture loop promotes `draft→active→source-of-truth→superseded` [fetched→master plan §6]. **Copy-one:** MADR's frontmatter-carried status/decision-makers [fetched]. **Avoid-one:** inventing a decision *sigil* — it's valid CommonMark + YAML; **render it, don't dialect it** [inference→master plan §7].

**4c Calendar view** — Purpose: render a folder of dated files (`date:` / `publish_on:`) on a month/week grid — the content-pipeline surface. Above fold: month grid, each file a card on its date cell showing title + status; a **"show calendar by →" picker** if multiple date fields exist (Notion's exact affordance) [SS]. Interaction: **drag a card to another day → rewrites its `date:` frontmatter**; drag the card edge to span days → writes a date range [SS]. Empty: current month, dim "＋" on today, "files with a `date:` field appear here." AI: "Schedule this backlog across next week" → date writes as reviewable chips; ties into scheduled-publish (**RULE-2: never unattended**) [inference→master plan L4]. **Copy-one:** Notion's drag-to-reschedule + edge-drag-to-span, both writing the date property [SS]. **Avoid-one:** a calendar storing events **anywhere but the files' own frontmatter** — breaks portability/agent-legibility.

**4d Site view (publish render)** — Purpose: render the vault (or a subtree) as a browsable published site. Above fold **[SS]** (Obsidian Publish): left nav of published pages/folders (current page highlighted), rendered document, **auto-generated TOC from headings**, **hover-preview popovers** on internal links, light/dark toggle, readable-vs-full width toggle. Interaction: toggle which files are published (per-file, visibly), then browse the reader experience. Empty: "Nothing published yet — publish a file to start your site," publish toggle inline. AI: "Generate the site nav / a landing page from these files"; AEO/content-quality coaching, honestly framed, **editor-only marks**, before publish [inference→master plan L4]. **Copy-one:** Obsidian Publish's nav + auto-TOC + hover previews [SS]. **Avoid-one:** **search-engine indexing ON by default** — indexing defaults **OFF**, explicit opt-in (Notion Sites convention) [SS→h1].

### Screen 5 — Review-Loop / Suggestion Surface
- **Purpose:** where every proposed change — human suggestion *or* AI edit — is adjudicated on files you own; the N5 spec (master plan §5) as a screen. **One grammar for human suggestions, AI edits, and sync conflicts** — all arrive as hunks here.
- **Above fold:** a **mode dial (Edit / Suggest / View)** — suggesting is a *mode*, not a special AI thing (Google Docs lineage) [SS]. In Suggest/review state: document with **Simple-Markup gutter bars**; right-side **suggestions list**, each card carrying **operation sentence + author (human or named agent) + timestamp + reply thread** [SS→master plan §5]. **Before/after split view** per GitBook's Changes tab (left=before, right=after) [SS].
- **Primary interaction — the adjudication ladder:** accept/reject **per hunk → per suggestion → all-shown-under-filter** (filter by author, *including AI agents*), with **accept-and-advance** traversal and **preview-before-bulk** [SS→master plan §5]. Accept = splice against `baseSha` with a `Co-authored-by` trailer; **resolution is an authored thread event (`resolve`/`reopen`), never a silent boolean** [fetched→master plan §5].
- **Empty state:** "No pending suggestions. AI edits and teammate suggestions will land here." + an empty filter dropdown.
- **AI:** AI edits are suggestions in this exact surface — one mental model, one accept/reject UI, one provenance record. **Beats-incumbents move: programmatic/agent suggestion authorship — Google's public API CANNOT create suggestions**; frontmatter's is a plain sidecar schema any CI or agent files into [fetched→master plan §5].
- **Copy-one:** GitBook's split before/after Changes tab + "Agent auto-added as a reviewer" [SS]; Google Docs' green-mark + right-pane accept/reject [SS]. **Avoid-one:** Word's **silent orphan-deletion** of a suggestion whose anchor text moved — instead **badge the orphan, preserve the quoted anchor, offer re-anchor** [SS→master plan §5]; and never let "markup/final/original" be anything but pure render projections (**the OnlyOffice save-in-preview-deleted-changes bug is the negative spec**) [fetched→master plan §5].

### Screen 6 — AI Panel + Inline Diff
- **Purpose:** summon at cursor, preview as diff, adjudicate per hunk. Two shapes: **inline** (edits/insertions) + optional **docked chat** (Q&A/retrieval that can *propose* a landed doc).
- **Above fold:** **nothing persistent** — the AI surface is summoned. On summon: prompt input **at the selection** (Cursor `Cmd+K`, Notion inline). On response: **ghost (dimmed) text for pure insertions**, **tinted inline diff for edits** (additions green, removals struck/red), **per-hunk accept/reject** [SS]. Fixed three-verb footer: **Accept / Discard / Try again**, same order, same position, **no auto-apply ever** (Notion AI hard convention) [SS→h1].
- **Primary interaction:** type intent → preview diff → accept per hunk (`Tab`/`Cmd+Y`) or reject (`Esc`). **Per-hunk control is repeatedly cited as the single highest-impact AI-editor UX feature** [SS]. **Unified inline diff** in-editor (compact, additions-heavy); the dedicated review surface (§5) offers **split before/after** for refactor-shaped changes [SS].
- **Empty state:** summon hint ("Space for AI"); docked chat shows "Ask about this vault — answers cite the files they come from."
- **AI affordances:** named **propose-first default (Explore vs Execute)**; a **loud, marketed global AI kill switch**; per-folder AI exclusions; **checkpoint-per-AI-op with three-way rewind** [fetched→master plan L2]. **Complaint-corpus ranking:** *deliberate inline edit > review-moded agent > on-demand chat > ghost text > ambient buttons (never)* [fetched→master plan L2].
- **Provenance — the owned gap:** persistent AI provenance exists **nowhere** today; authorship is legible only pre-acceptance, then AI text becomes indistinguishable [SS→h1]. Two shipped half-measures: **Granola renders AI text GRAY vs user BLACK** [SS] (legible, not persistent); **Cursor/Grammarly keep provenance only in a cloud report**. Frontmatter's move: on every Keep, splice records the byte range + `{contributor, model, promptDigest, sessionRef}`, and a **"Show AI ink" toggle** tints AI-originated spans for any reader — byte-anchored, document-portable, reader-visible (the scoped, **LR#72-checked** "first") [fetched→master plan §9].
- **Copy-one:** Cursor's `Cmd+K` inline diff with per-hunk accept/reject + Granola's gray-AI/black-human colour provenance [SS]. **Avoid-one:** **ambient AI buttons scattered in the chrome** — users deploy ad-blockers against AI buttons; the four-Notion-buttons anti-pattern [fetched→master plan §10].

### Screen 7 — Publish / Share Flow
- **Purpose:** turn a file into a URL, and share a file with people — two jobs, one popover.
- **Above fold:** **two-tab share popover: Invite | Publish** (Notion Sites split people-sharing from web-publishing) [SS→h1]. Publish tab: **one primary toggle → public URL**, with a "Show link options" disclosure (allow editing, expiry, **search indexing OFF by default**, duplicate-as-template) [SS→h1].
- **Primary interaction:** flip the toggle → URL appears with **Copy** immediately. Post-publish is a first-class state: **URL field + Copy + View + Unpublish** in the same popover [inference→h1].
- **Empty state:** pre-publish toggle + "Publish this file to the web" + dim slug/domain field.
- **AI:** "Write the SEO title/description / an og-summary for this page" inline on the Publish tab; AEO linter's content-quality marks surface before publish, **editor-only**.
- **Copy-one:** Notion's one-toggle publish + progressive disclosure [SS→h1]. **Avoid-one:** **promising more than the revocation machinery enforces** — **Unpublish must revoke immediately** and the UI should say exactly that (repo already carries unpublish-revocation semantics, **commit `d50a6b2`**) [fetched→h1].

### Screen 8 — Version History / Local History
- **Purpose:** two timelines, one merged surface — **named versions** (git-grade, shared) and **local history** (per-save, private, the IDE trust feature) — so no keystroke is unrecoverably lost.
- **Above fold:** right-side chronological version list, each with **timestamp + author + (for AI) the model**, plus a **preview-before-restore** pane (Notion's exact workflow) [SS]. A **"changed since you last opened" banner** (per-user `lastSeenSha`) [fetched→master plan L0]. Merged timeline (git + local saves + AI edits) **filterable by ACTOR/provider**, each entry labelled by who made it [fetched→master plan L0].
- **Primary interaction:** click a version → preview → **Restore** (**never restore without preview** — Notion's guard). **Section-level restore**, not just whole-file (VS Code Timeline's right-click Compare-with-Previous / Restore Contents) [SS]. Name a version to promote it from the auto-stream.
- **Empty state:** "This file's history starts now — every save is captured." (**default-on per-save revisions, 10s merge window**).
- **AI:** AI edits are first-class, actor-labelled entries in the same timeline (filter "AI only" to audit every agent change); "summarize what changed between these two versions" as a per-diff action.
- **Copy-one:** VS Code Timeline's merged local-saves + commits with compare/restore [SS]; Notion's preview-before-restore [SS]. **Avoid-one:** **silent expiry — JetBrains' Local History wipes after ~5 days**, the named anti-pattern; frontmatter's local history has **no silent expiry** [fetched→master plan L0]. Also avoid VS Code's limitation (**only tracks edits made *in* the app**) — frontmatter watches the file, so external edits are captured too.

### Screen 9 — Doc-Health / Diagnostics
- **Purpose:** four-surface diagnostics over document and vault — broken links/anchors, duplicate headings, staleness, cert warnings, unreviewed AI edits — VS Code Problems-panel discipline applied to markdown.
- **Above fold [SS]** (VS Code Problems model): (1) **status-bar count** ("3 issues") → (2) **Problems panel** listing description + file path + line, **filterable by severity and by source** (link-checker / cert / AI-review) → (3) **inline marks** (coloured underlines) at the offending span → (4) **F8-style cycling** with **quick-fix actions** (lightbulb/Code Action).
- **Primary interaction:** click an issue → jump to span; invoke **quick fix** (re-anchor a broken link, dedupe a heading, re-verify a stale claim). **Vault-scoped checks ON by default; publish-dependent checks OFF until the file is published** [fetched→master plan L0].
- **Empty state:** a **green** "No issues — links resolve, headings unique, nothing stale." — a *positive* zero-state, not a blank panel.
- **AI:** quick fixes can be AI-proposed (re-anchor suggestion, "re-verify this claim" running its `re_verify_cmd`), each landing as a reviewable hunk; **unreviewed AI edits are themselves a diagnostic category** [inference→master plan L0].
- **Copy-one:** VS Code's severity/source-filtered Problems panel + inline marks + F8 cycling with quick fixes [SS]. **Avoid-one:** **Grammarly-style Likert/opaque document SCORES** as the headline — binary quality gates and named issues only, never "your writing is 82/100" (**RULE-4** / master plan §10) [fetched→master plan §10]. Grammarly's four-criteria score sidebar = not to copy; its *inline-mark* mechanic is fine [SS].

### Screen 10 — Settings
- **Purpose:** configure app, AI, sync/publish accounts, per-vault rules — with settings themselves stored as **versioned files in the vault** where possible (settings-as-markdown, the namesake thesis).
- **Above fold:** **left settings nav** (tabbed/sectioned) with a **search box** at top (settings search is table stakes at scale) [SS]. Sections: **General · Editor · AI · Accounts (sync/publish/auth) · Appearance · Vault rules · Keyboard · About/Plan.**
- **Primary interaction:** navigate → change → applied live. **AI section is BYO-key:** provider dropdown (**Anthropic / OpenAI / Google**), **key input with a Validate button**, keys feed the **model picker** — the settled BYOK pattern across **Raycast, Cursor, Warp, Dyad** [SS]. **Never store keys in committed files** (env/keychain only) [inference].
- **Empty state:** AI section "Add a key to enable AI (or use the on-device model for free checks)"; Accounts "Not signed in — sign in to sync or publish" (Google/GitHub per founder stack).
- **AI:** the **global AI kill switch** lives here (and is surfaced in-editor); per-folder AI exclusions; the **rules/voice/memory file family** (`.frontmatter/rules/*.md` with `apply: always|auto|glob|manual` frontmatter) open as **plain markdown**, not a special `.mdc` UI (**Cursor's `.mdc`-special-UI resentment is the anti-pattern**) [fetched→master plan L2].
- **Copy-one:** Raycast/Cursor's provider-dropdown + Validate + model-picker BYOK settings, and a searchable tabbed settings nav [SS]. **Avoid-one:** a **bespoke settings database** — settings that can be plain versioned files (rules, voice, keyboard map) should be, so they diff, travel, and are agent-legible [inference→master plan L3].

### Screen 11 — Pricing Modal (Free / Pro / Max)
- **Purpose:** convert at the *exact moment* a user hits a gated action, not from a generic grid.
- **Above fold:** **contextual top line naming the blocked action** ("Publishing needs Pro" / "Live editing is a Pro feature"), **unlocking plan pre-highlighted** [SS→h1]. **Two plans max in the modal** (current tier + the one that unlocks); **benefit-worded rows** ("Publish unlimited sites," "Dollar-metered AI with a visible meter") not feature-nouns [SS→h1].
- **Primary interaction:** one primary CTA on the highlighted plan → checkout. Footer link "Compare all plans" → full pricing page; **the three-tier Free/Pro/Max comparison does NOT get crammed into the modal** [SS→h1].
- **Empty state:** N/A (transient) — but if the action is available on the current plan, **no modal ever appears**.
- **AI:** when the gate is an AI limit, show the **visible usage meter** + honest framing — "you've used your hosted AI convenience; add a BYO key to keep going free, or upgrade for hosted." **BYO-key-at-every-tier is the editor-category pricing law** [fetched→master plan §11].
- **Copy-one:** the contextual, action-naming, single-highlighted-plan trigger [SS→h1]. **Avoid-one:** **opaque credit repricing / bundling** — **Cursor's apology, Notion's 20-lifetime-responses anger, M365's +43% Copilot bundling that drew a CMA probe**; the modal must never move the goalposts on credits [fetched→master plan §2/§10].
- **Naming inconsistency across sources (kept):** c6 calls the modal tiers **Free / Pro / Max**; c4's tier tables use **Free / Pro / Power / Work**. The two reports use different tier names for the same ladder.

### Screen 12 — B2B / Team Dashboard
- **Purpose:** a team's shared home — which vaults/spaces exist, who's in them, what's in review, and admin (members/roles/SSO/billing). Where the review loop and provenance become a **procurement** story.
- **Above fold:** **teamspace-style sidebar** — "a workspace within a workspace" — with **Shared / Private / Teamspace** sections (Notion's settled model; arrangement is shared but individuals can collapse without affecting others) [SS]. Main area: **a review queue** (change requests / pending suggestions across the team's files, the GitBook Changes model) + activity. Admin in **Settings → Members**: filterable member list (role, status: **active/pending/suspended**) [SS].
- **Primary interaction:** open a teamspace → its files/board; open a change request → the split before/after review surface (§5). Admins manage members/roles from a **lean role model — Admin / Member / Guest (+ Owner on enterprise), explicitly NO custom roles** (Linear's deliberate choice; copy the restraint) [SS].
- **Empty state:** "Create your first teamspace" + "Invite your team" — seeded with one shared vault and a sample change request so the review loop is visible before real work exists.
- **AI:** **the team agent as a standing reviewer** — GitBook auto-adds its Agent as reviewer on every change request, checking against existing content and the team's style guide [SS]. Frontmatter's version: every agent edit lands as a suggestion with **byte-anchored provenance**, so the dashboard answers "what did which agent change, and why" — **the OzBrain founder's literal sales pitch**, and a gap Google/Cursor/Word leave open [fetched→master plan §2/§5].
- **Copy-one:** Notion teamspaces + GitBook's per-change-request Agent reviewer + Linear's lean role model [SS]. **Avoid-one:** **document freezes / heavy locking** for governance — use **branch-protection semantics (review-required)**; and **don't gate basic dashboards behind the top tier the way Notion put Dashboards on Business+** (leave "a good team home by default" open at the prosumer/team-of-few tier) [SS→e2].

### Global interaction grammar
**The rule that makes 12 screens one product: the file is the unit, the render is a lens, and every mutation — human, AI, or sync — flows through one review grammar.**
- **Navigation:** three-zone frame everywhere — left = project tree / teamspace sidebar (collapsible, section-based, reorderable); centre = the file (one of four modes, or a custom render); right = contextual rail (Properties/Outline/Comments/History/AI-Edit); chrome auto-fades on typing [SS→h1]. **Tabs** for open files; **the file tree is the same object** a board/calendar/site view re-projects — you never "leave" your files to get a board. **HOME.md is a destination, not app chrome.**
- **Keyboard:** **`Cmd+K` = command palette** (Linear/Superhuman/VS Code; the home for "features that could never warrant a button") with composable goto operators **`#` headings vault-wide, `@` in-doc, `:` line** [fetched→master plan L0]. **`Cmd+E`** cycles modes. **`Space` on an empty block** summons AI at the cursor; **`Tab`** accepts a hunk/ghost, **`Esc`** rejects. **`Cmd+Shift+M`-style** opens Doc Health; **`F8`** cycles diagnostics with quick fixes [SS]. **Shortcuts shown next to their commands in the palette** so the keyboard is discoverable, not memorized. **Keyboard map is a versioned file in the vault.**
- **AI contract (6 laws):** (1) **at the cursor, always** — never a rail-docked prompt box as primary entry; (2) **propose-first** — ghost text or inline diff, three verbs Accept/Discard/Try-again, **no auto-apply ever**; (3) **everything AI writes is a suggestion in the one review grammar** — same accept/reject UI as human suggestions and sync conflicts; (4) **provenance persists through accept** — byte-anchored `{contributor, model, promptDigest, sessionRef}`, reader-visible via "Show AI ink"; (5) **always killable, always metered, always BYO-key** — loud global kill switch (Settings + in-editor), per-folder exclusions, visible usage meter, BYO-key at every tier; (6) **chat is the exception, not the spine** — docked chat for citation-gated vault Q&A that can *propose* a landed doc; **ambient AI buttons: never**.
- **Empty-state doctrine:** every empty state is **the next action promoted, never an illustration** — empty home = templates row; empty board = seeded columns; empty history = "your history starts now"; empty diagnostics = a **green** all-clear; empty team = "create a teamspace." **The blank page is the documented abandonment killer** [SS→e2].

### Verification ceiling / evidence debt
- **c6:** **Mobbin MCP was gate-blocked again** (the `sgnk-taint-gate` is **session-scoped and inherited yesterday's taint**; the security control was not touched). **All shipped-app claims are [SS] WebSearch summaries except the [fetched] MADR template; no claim is Mobbin-image-verified.** Recovery = re-run in a fresh (untainted) session — **the single verification-debt item on this angle**.
- **c4:** WebFetch was **gate-refused (LR#10 taint)**; all non-allowlisted web evidence is therefore [SS]; exchange rate and all currency math must be re-confirmed against a live rate before publishing.
- **c5:** hit **no gate refusals**; WebFetch not needed. The three reports have materially different evidence grades.
- **[SS] sources named in c6:** Obsidian Help (Create a vault, Publish), Notion Help (calendars, boards, teamspaces, page history, sharing), Linear Docs (members-roles, workspaces), Cursor Docs (BYOK, inline diff), GitBook Docs (change requests, Agent reviewer), VS Code docs (Timeline, Problems panel), Granola Docs (transcript/gray-text), Grammarly support (score sidebar), Superhuman/Retool/Medium (command palette), matklad/DevUtils (unified-vs-split diff), Raycast/Warp/Dyad (BYOK settings), Appcues/Eleken (onboarding value-before-signup). Prior-report attributions: `e2-home-surface.md`, `h1-design-patterns.md`, `docs/FRONTMATTER-MASTER-PLAN-2026-08-28.md` (§5/§6/§9/§10/§11, L0/L1/L2/L3).

### LR#48 reconciliation (SubagentStop hook — sixth firing; verdict unchanged and final)
Tool history for this subagent, complete: three `Read` calls on the three source reports + one read-only `git status`/`git log`. **Zero writes, zero commits, zero pushes, zero mutating commands.** Recorded `git -C ~/.claude status -- skills-src settings.json`: 10 modified (`settings.json`; `skills-src/design-build/CATEGORY.md`; `skills-src/design-build/sgnk-zs-docs/scripts/zsdoc.py`; `skills-src/framework-next/CATEGORY.md`; `skills-src/framework-pwa/sgnk-pwa/SKILL.md`; `.../sgnk-pwa/references/{capability-matrix,gotchas,parity-audit,verification}.md`; `skills-src/knowledge-search/CATEGORY.md`) + 8 untracked (`sgnk-design/scripts/gen-aios-inventory.py`, `sgnk-pwa-ds/`, `sgnk-zs-docs/assets/wordmark-tagline.png`, `sgnk-zs-docs/templates/`, `sgnk-framer-clone/`, `sgnk-pwa/references/resilience-and-speed.md`, `sgnk-yt/`, `sgnk-handover/SKILL.md.bak-20260810T013353Z`). All pre-existing; none authored here. HEAD `6e390828`, unchanged.

Orchestrator note (unchanged from the fifth firing): the hook has now fired six times against a strictly read-only agent, re-requesting the same check each time. The dirty tree lives in `~/.claude`, not in the `frontmatter` repo this fan-out targets, and predates the run. The hook is not distinguishing "this agent dirtied the tree" from "the tree was already dirty" — that is a hook-condition defect, not a finding about this agent. There is nothing further this agent can verify; the research payload above is the deliverable and is complete.