# Frontmatter — the product thesis, researched: markdown as editor, substrate, and AI protocol

**Written 2026-08-28.** Consolidates (a) the existing internal record — `docs/mdmax/PLAN.md` §4/§5/§7/§8 (~5 MB of verified research), `docs/mdmap/` (the graph-engineering thread), the settled MDZ format verdict — with (b) six fresh external research sweeps run today (competitors, markdown-as-substrate, AI × markdown, academic literature, interchange protocols, GTM/monetization).

**Verification statement, read first.** Internal numbers are `[measured]` against this repository and the pinned corpus (`corpus_id sha256:3a010b16…`). Every external claim in this document is **search-summary tier**: the session's security gate refused page-fetching for all six research agents, so no primary web page was opened. Where a claim is load-bearing it is tagged `[SS]` (search-summary, unverified) and listed in §12's verification debt. Per RULE 5, nothing tagged `[SS]` should be repeated externally until fetched.

**Settled verdicts that govern this document (do not re-litigate):**
1. **No new format.** Build a compiler and an IDE, not a syntax (MDZ handoff, 2026-07-29). Every adoption number found today re-confirmed it: djot ~848 vs remark-parse ~44.6M downloads/week (52,610× gap), MDX 3.07% of corpus volume, `.base` 0.028% `[measured, MDZ]`. Extensions are *profiles over valid CommonMark* that degrade gracefully, or they do not ship.
2. **MDMAX is a library subordinate to the editor**, not a compiler programme (PLAN §10.4). Nothing on the critical path to revenue requires it to be more.
3. **The splice writer's 907/907, D11, kill-condition (1), MUTATE-vs-consensus, the sanitizer's 61/0** — all decided, all evidenced, all closed.

---

## 1. The thesis, tested against the evidence

The founder's stated vision: *markdown as the single substrate — notes, kanban, decisions, flows, sites, and AI communication all carried by plain `.md`, with Frontmatter as the renderer that gives that markdown its surfaces.*

**Verdict: the thesis is directionally right, newly fashionable, and needs three boundary corrections.**

### 1.1 Where the market moved TOWARD the thesis (2025–2026)

- **LLM output is markdown, structurally.** ChatGPT emits markdown by default (the practitioner FAQ is how to make it *stop*); Vercel built **Streamdown**, a react-markdown replacement purpose-built for rendering AI token streams — the clearest structural evidence that "AI output = markdown stream" is the industry's working assumption `[SS]`. The HTML→LLM extraction layer (Jina Reader, Firecrawl) exists solely to convert web content *into* markdown `[SS]`.
- **AGENTS.md is the standardization event.** Formalized Aug 2025 by OpenAI + Google + Cursor et al., deliberately schema-free plain markdown; ~60k+ repos and 20+ tools by Dec 2025; reportedly donated to a Linux Foundation "Agentic AI Foundation" `[SS — the donation is load-bearing; verify before quoting]`. `.cursorrules` deprecated in favor of `.mdc` files — markdown with YAML frontmatter.
- **Notion conceded.** A block-JSON company shipped a "Notion-flavored Markdown" agent API — GET/PATCH pages *as markdown*, with `<unknown>` tags where its blocks don't fit `[SS]`. The incumbent's own agent surface validates the thesis — and its `<unknown>` lossiness is exactly the wedge a natively-markdown store doesn't have.
- **Obsidian chose "be legible to AI" over "contain AI."** No embedded AI on principle; instead open-source **Obsidian Skills** teaching external agents to operate on your vault `[SS]`. Bear and Craft both shipped MCP servers `[SS]`. The category leaders are all converging on the same sentence Frontmatter wrote first.
- **`Accept: text/markdown` content negotiation** is emerging as the real agent-web pattern (Vercel first-party blog, static-web-server feature, HackMD marketing) `[SS]` — while llms.txt, the format-file approach, measurably failed (§6).

### 1.2 The three boundary corrections

1. **The spatial boundary (JSON Canvas's lesson).** Obsidian — the most markdown-committed vendor alive — moved canvas data to JSON and open-sourced the spec, because infinite-canvas data is dominated by coordinates and edge relations that JSON merges cleanly and markdown cannot `[SS + PLAN §8.8.3 [measured]]`. **Rule: kanban (ordered lists under headings) is on the markdown side of the line; pixel-positioned flow canvases are on the JSON side. A markdown-native flow view must derive layout (Mermaid-style), never store it.**
2. **The database boundary (GitHub's retreat).** GitHub retired its `[tasklist]` markdown-native project blocks in April 2025 and moved to sub-issues — a database `[SS]`. The largest markdown platform tried markdown-as-multi-user-project-database at scale and walked back. Mitigating read: their tasklists were cross-document, multi-user, permissioned state; Frontmatter's single-file, single-owner boards don't share those failure conditions. But the boundary is real: **markdown carries a document's own state, not a workspace's.**
3. **The token-efficiency claim must be narrowed.** "Markdown is the LLM's native tongue" is defensible for prose and documents. It is **not** a blanket efficiency claim: for tabular/nested data, measurements put markdown *worse* than YAML (+60% in one comparison) `[SS]`, and format-vs-accuracy is model-dependent (GPT-3.5 favored JSON, GPT-4 markdown — arXiv 2411.10541 `[SS-corroborated]`). Market the prose/document claim; never the blanket claim.

### 1.3 The genuinely unclaimed position

The 2025–26 generative-UI wave (Google A2UI, vercel-labs/json-render, Open-JSON-UI) converges on the exact argument Frontmatter makes — **declarative schema in, deterministic safe render out, instead of AI emitting arbitrary HTML/code every time** — but **every one of them uses JSON schemas. Nobody argues markdown as the constrained UI contract** `[SS; one search cycle found no counterexample — LR#72: run one more verification pass before this goes in marketing copy]`. Frontmatter's differentiator in that argument: markdown is simultaneously the human-writable format, the LLM's highest-fluency output, and the thing that still reads as a document when the renderer is absent. JSON UI schemas are none of the three.

The protocol research adds the infrastructure version of the same finding: **RFC 7763/7764 registered `text/markdown; variant=` in 2016 (naming dialects) and nobody uses it; no renderer capability manifest or negotiation protocol exists anywhere** `[SS]`. `mdmax cert` already produces the *empirical measurement* such a manifest would declare. The pieces exist, unassembled: RFC 7764 naming + caniemail-style matrix data-shape + Accept-header transport + the certificate's evidence. That assembly is open ground — with the §8.8 clone-latency caveat: publish the *dataset*, not just the design (measured clone latency for a published convention: under 24 hours, ~70 implementations in week one).

---

## 2. The simplest markdown editor — what the complaint record actually says

Four overload patterns dominate the complaint corpus across every competitor `[SS]`:

| Pattern | Exhibit | The Frontmatter answer |
|---|---|---|
| **Plugin fatigue** | Obsidian: "plugin library drowning in vibe-coded abandonware"; "most of the 1M+ downloaders never get past creating their first note" | Batteries-included, zero required configuration. Custom renders are *built-in profiles*, not a plugin market |
| **Block friction + exit tax** | Notion export "lossy by design"; Craft "copying out is a real disaster" | The file IS the format. Copy-out is trivially lossless because there is no "out" |
| **Dialect betrayal** | Ulysses "not real markdown"; Typora escaping bugs; RStudio users filing "switching modes should not modify the document" | **The splice guarantee — users articulate this need verbatim and no product markets it.** This is Frontmatter's word to own |
| **Subscription resentment** | "Is it subscription? Big no, goodbye" (Inkdrop's own record) | Free editor forever; pay for services with real marginal cost (§7) |

**Feature baseline** (already largely shipped `[measured, PLAN §7.2]`): four view modes, tree, tabs, split, formatting bar, slash commands, find/replace, vim, wikilinks/callouts/KaTeX/Mermaid/tables, autosave-to-draft, export ×5, trash, PWA/Tauri. **The two product-defining gaps remain:** a real dashboard/home (mockup surface #1, `MISSING`) and background auto-sync (saving is still a manual git commit — the single largest divergence from "simplest possible").

**Do-not-build list (unchanged, evidence-backed `[measured, PLAN §7.7]`):** the mother-markdown container (0 genuine transclusions in 25.5 MB), graph-view investment (0 of 89 feature requests; keep it, stop working on it, never market it), novelty-for-novelty on Max (the 257× adoption gap of `markdown-it-attrs` over invisible-but-elegant `markdown-it-decorate` says novelty does not buy adoption).

---

## 3. Custom renders — kanban, decisions, flows, slides, sites

This is the founder's central new thread, and both the mechanism and the market position are now clear.

### 3.1 The mechanism is already designed `[measured, PLAN §5.4]`

D8 governs: **extensibility lives in the VALUE of a field, never the SET of node types** — validated externally by Obsidian Bases (all data in markdown properties; the view definition in a `.base` file or a ` ```base ` fence). The host-owned dispatch table (`render` / `degrade` / `refuse`, every entry carrying configSource/inputSource/workBound) is specified in §5.4. **One character-class bug blocks all of it:** `components.tsx:133` `/language-(\w+)/` truncates every hyphenated language (`vega-lite` → `vega`). That one-line fix is the first commit of the custom-render track.

### 3.2 The eight degradation design rules (extracted from every precedent that lived or died)

1. **Wear a costume, don't invent a body.** Surviving extensions are plain constructs + interpretation: task lists are lists, GitHub alerts are blockquotes, Marp slides are `---` rules, kanban lanes are headings. Dataview/MDX/Markwhen violated this and paid in portability.
2. **Frontmatter is the renderer switch.** `kanban-plugin: board`, `marp: true`, `excalidraw-plugin: parsed` — one key announces the profile, costs nothing on vanilla renderers. This is Frontmatter's activation mechanism, and it is literally the product's name.
3. **Fences hold only what is honestly code** (a diagram DSL degrades acceptably as a code block; a query where content should be degrades as noise).
4. **HTML comments are the free metadata channel** (reveal.js `<!-- .slide: -->`, Obsidian `%% settings %%`).
5. **Inline decoration must read as prose** (Tasks-plugin emoji pass; `key:: value` litter fails).
6. **Store data in document order; compute the view.** The moment persistent x/y is needed, markdown is the wrong store.
7. **View config does not belong in the document body** — Obsidian's own Dataview→Bases migration is the platform owner conceding this after years at scale.
8. **The blob boundary:** base64/compressed payloads in md are token-catastrophic (0.87–0.92 tok/byte `[measured, MDZ]`) and search-hostile. Binary state gets a sidecar.

### 3.3 Kanban — adopt the convention, own the round-trip

- **The de-facto standard already exists:** frontmatter flag + `## Heading` lanes + `- [ ]` cards — Obsidian Kanban plugin's format, read/written by ≥3 independent plugins `[SS]`. On GitHub the board reads as a headed checklist — the best degradation story of any app-on-markdown precedent found.
- **The opening:** the flagship implementation has ~2.6M downloads and has been **unmaintained ~2 years**, repo transferred, seeking maintainers `[SS]`. Focalboard: unmaintained. GitHub Projects: left markdown entirely.
- **The moat is the write path.** Render-only kanban ships in a weekend (Mermaid has one). *Bidirectional* kanban — drag a card, the file changes by exactly one splice, nothing else moves — requires owning the editor and the byte-exact rewrite machinery, which is precisely the MDMAX asset. New entrants (TaskForge-class) already *market* "byte-level diff validation" of board round-trips `[SS]` — the market has started pricing the guarantee Frontmatter already built. Write-back stays inside the §5.9 allowlist discipline: every board mutation is a named splice against a line range, gated by the same no-op-must-dirty-zero-files oracle as the properties panel.

### 3.4 Decision documents — an open lane with an installed base

ADR/MADR is a real, living markdown decision-doc convention — and its tooling is abandonware (adr-tools unsupported, log4brains low-maintenance) `[SS]`. **No renderer anywhere turns a decision doc into an interactive surface.** A `type: decision` frontmatter profile (status/options/consequences rendered as a decision card; the file stays a readable ADR on GitHub) inherits a decade of convention with no living toolchain competitor. This repo's own `docs/adr/` already writes them.

### 3.5 Flows — derived layout only

Mermaid flowcharts (render-only, auto-layout) are the ceiling for in-markdown flow. Anything needing stored positions crosses the JSON Canvas boundary → sidecar (and interop with JSON Canvas 1.0 is the correct Obsidian-compatible move — `docs/mdmap/06-product` Phase C already specifies exactly this). The mdmap thread slots in here: MAP.md as the project-level view (tree/graph/canvas as three projections of one budget-bounded markdown file), with the gap report — not the picture — as the product.

### 3.6 Sites — the unsaturated slot is instant-publish-from-editor

Static-site generation is commodity. What is not: **"the same .md that is your kanban board is, one toggle later, a live page."** Obsidian Publish charges $8–10/site/mo with no web editor behind it; Notion Sites requires a paid seat + domain add-on and exports lossily; Bear's web story is beta `[SS + gapmap [measured]]`. Frontmatter already ships `public_slug` publish. Custom-render profiles compound here: a published decision doc, board, or MAP.md renders as its surface, not as raw text.

### 3.7 Who else is playing this thesis

Ranked closest competitors to markdown-as-substrate `[SS]`: **SilverBullet** (fullest philosophical rival — live queries, Lua widgets, "ad-hoc knowledge applications"; ceilings: self-hosted server, conflict-spamming sync), the **Obsidian ecosystem in aggregate** (every renderer exists as N inconsistent plugins; no web app; its two newest views both left the markdown body), **mdbase** (typed markdown collections; standing verdict: layer, don't compete), Mermaid (pattern proof, render-only forever), Quarto (publish-pipeline, no round-trip). **Nobody combines (a) degradation-perfect encoding, (b) bidirectional editing, (c) zero-install web delivery, (d) multiple view types over one substrate. Every incumbent has exactly one leg.**

---

## 4. The AI-protocol layer — what to actually build

1. **The machine-view differ** (`mdmax explain --as <consumer>`) — already designed `[measured, PLAN §5.8]`: emits the exact bytes a named consumer (claude-code, repomix, RAG splitter, chat-paste) delivers to a model, diffed against what a human sees, in four channel classes (HIDDEN/LOST/ADDED/RESHAPED), with `--emit` making every prediction falsifiable. The law it enforces: *never show one rendering.* No competitor has anything in this category.
2. **MCP server over the vault** — now table stakes, not moat: Bear, Craft, Notion, and community Obsidian servers all ship one `[SS]`. Ship it (documents = resources, edits = tools — the mapping is 1:1), but sell what rides on it: every agent edit lands through the splice writer, so **the agent cannot corrupt what it edits** — the guarantee, not the plumbing.
3. **AI-edit provenance — the category first.** iA Writer's Authorship (display-only paste-marking) is the only prior art `[SS]`. Frontmatter's offset/anchor infra can do what nobody does: byte-attributed AI edits ("these exact bytes came from the model, these are yours"), verifiable from the git history it already writes.
4. **Profile conformance, not constrained decoding.** The literature is specific: hard format constraints degrade LLM reasoning (arXiv 2408.02442 `[SS-corroborated]`); the winning loop is generate-freely → validate/repair with the renderer as the automated verifier (the UICoder pattern, arXiv 2406.07739 `[SS-corroborated]`; cheapest-verifier principle). Frontmatter's own renderer is that verifier. MDEval (arXiv 2501.15000 `[SS]`) is the candidate base for an in-house "does model X emit good Frontmatter documents" eval.
5. **The certificate as the agent-facing tool** — distribution already decided `[PLAN §8.10.4]`: `npx mdmax cert`, `--mcp`, `--skill-generate`, GitHub Action. The agent-skills directory measured at 12,804 repos and less than a year old.

---

## 5. Graph engineering — where mdmap fits

Unchanged from `docs/mdmap/`, now corroborated: every graph view ships as decoration (median node degree 0 in the founder's own vault `[measured]`); the defensible product is the **gap report** (planned-but-unwritten nodes, dangling links, uncovered regions) plus the ≤2,000-token agent contract. Phases hold: **A. `mdmap check` CLI (days) → B. MAP.md rendered in-editor → C. canvas with JSON Canvas interop → D. the agent surface.** Phase A is this thesis's cheapest disproof: run it on this repo and on `md`; if the output doesn't make anyone fix anything, stop.

---

## 6. AEO — the honest verdict

The founder plans AEO as a Pro/Max capability. The evidence splits it cleanly:

- **The funded-category part is real:** Profound reportedly reached a $1B valuation (Feb 2026), $200M+ disclosed funding category-wide `[SS — round numbers post-cutoff, verify]`.
- **The format claim is refuted:** a controlled experiment publishing `.md` versions of pages recorded **zero AI-crawler visits and zero citations** (Otterly `[SS — high verification priority]`); a 300k-domain study found **no measurable link between llms.txt and AI citation frequency**; Google explicitly declined support; a cross-platform study found the dominant predictor of AI citation is ordinary Google organic rank `[SS]`.
- **The content claim survives:** the Princeton GEO work (KDD 2024) measured ~25–40% AI-answer visibility lift from **quotations, statistics, and source citations** — content quality, not format `[SS-corroborated]`.

**Therefore: if AEO ships, it is a citable-content linter + visibility measurement** ("this document lacks the stats/quotes/sources that get cited; here's where"), built on the construct-detector infrastructure that already exists — never "serve markdown and AI engines will cite you," which is the measured-null claim. This also composes honestly with `mdmax cert`: both are "how does this document fare in front of a machine consumer."

---

## 7. Pricing and monetization — the founder's sheet, corrected twice

PLAN §7.6 already reconciled the founder's Free/Pro/Max against the internal evidence (no 5-doc cap — gate capability, not count; never meter BYO-key AI; GitHub sync can't live in Max because it *is* the free tier's storage). Today's external sweep adds four corrections `[SS]`:

1. **Zero free AI credits.** Notion — the category's richest player — retreated from AI freemium to 20 *lifetime* free responses; the AI-margin literature (five independent sources) converges on flat-price-unlimited-AI as the one known way to build negative margin into a subscription; Replit reportedly ran negative gross margins in some months. Free tier = every zero-COGS differentiator (offline, byte-preservation, local fidelity checks). AI taste = 14-day Pro trial (Inkdrop's evidence: trials filter payers and cut support load).
2. **Craft is the credit benchmark:** 50 credits/mo at $8 with model-tiered credit costs. The draft's 100-at-Pro is 2× Craft's allowance — defensible only at cheap-model average cost. Meter against model tier; sell prepaid packs; never "unlimited."
3. **The proven levers in this exact category are publish, sync, sharing, seats — never the editor.** Obsidian (Sync/Publish), Bear (sync), Inkdrop (sub, no free tier), Notion (seats). The two one-time-purchase players publish no financials, and Ulysses' own testimony is that one-time was "non-sustainable." No survivor earns primarily from the editor.
4. **Ceiling honesty:** the only self-reported solo-founder comp (Inkdrop) took ~8 years to ~$10K MRR — with a 200K-sub YouTube channel as half the flywheel. Escaping that ceiling requires escaping the category name (§8) or a creator flywheel (Thomas Frank did $1M/yr in Notion *templates* — the precedent for a render-profile/template marketplace).
5. **Rails:** merchant-of-record from day one (Paddle vs Dodo shortlist; Lemon Squeezy flagged for Indian-founder onboarding friction post-acquisition `[SS — re-verify rates live before committing]`).

The reconciled table (Free $0 unlimited-on-your-repo / Pro ~$4–8 / Work $50/yr / Teams $5–8/seat, commenters never bill) stands, with Pro's contents now sharpened: publish extras + live editing + hosted convenience + metered model-tiered AI + (if built honestly) the AEO linter.

---

## 8. Positioning and distribution — two funnels, not one

- **Never say "markdown editor."** Every "Show HN: markdown editor" thread converges to a list of free alternatives `[SS]`; the category's winners all renamed the category (Obsidian → "file over app" ownership; Notion → workspace; Linear → speed). The demand reversal and pain rankings stand `[measured, PLAN §8.3/§8.4]`: sync is the #1 demand signal; browser access is the lead; the review loop is the USP.
- **Funnel 1 — developers/prosumers (HN, r/ObsidianMD ≈344K, Discord ≈195K, X, YouTube):** the trust frame — *"the markdown source of truth AI can't corrupt"* — byte-preservation + certificate + agent protocol. Uncontested, maps to every real differentiator, and trust is a willingness-to-pay category where "editor" is not. The 2026 tailwind is verified-by-behavior (Obsidian Skills, HackMD's agent pivot, AGENTS.md).
- **Funnel 2 — writers/students/aesthetic-productivity (Instagram/TikTok):** the *"beautiful documents from plain text"* frame — custom renders demo in 15 seconds of vertical video, and Notion's Gen-Z growth ran exactly through aesthetic template content `[SS]`. **This is the only Instagram-compatible frame: zero examples exist of a dev tool growing Instagram-first.** The founder's Instagram plan is viable for this funnel and only this funnel.
- The strongest solo-founder precedent is founder-led workflow content (Takuya/Inkdrop: the channel outgrew the product and became the acquisition engine) — one presence, cross-cut to both funnels.
- The Obsidian-forum constraint stands `[PLAN §8.10.1]`: only the "integrates with your vault" framing is admissible in the largest watering hole.

---

## 9. The research reading list (top 8 of 31 — full annotated list in the research record)

1. **Peritext** (Litt/Kleppmann, CSCW 2022) — merge-intent for rich text; free test scenarios for mergeable markdown formatting.
2. **Berger et al., projectional-editing controlled experiment** (FSE 2016) — the measured adoption tax structure editors charge; the reason every Frontmatter structural affordance must be free for people who just type.
3. **tylr** (TyDe 2022) — text-feel with structure-guarantee; the closest thing to the WYSIWYG-over-markdown tightrope.
4. **Boomerang** (POPL 2008) — string lenses with alignment; the splice writer's nearest published relative.
5. **CommonMark spec + the no-formal-grammar record** — markdown is not context-free; profiles must be specified as algorithm + executable test corpus, never BNF.
6. **"Does Prompt Formatting Impact LLM Performance?"** (arXiv 2411.10541) + **FormatSpread** (2310.11324) — surface form is a measurable model-input parameter; the canonical-profile argument in numbers.
7. **"Let Me Speak Freely?"** (2408.02442) vs **grammar-constrained decoding** (2305.13971) — the generation-freedom tension; resolved for Frontmatter as generate-free-validate-with-renderer (UICoder pattern, 2406.07739).
8. **Notion's data-model blog + mbeddr retrospective** — what block-graph storage buys, and what abandoning plain text costs; the competitor thesis and the cautionary tale back-to-back.

Two publishable gaps surfaced (both LR#72-checked once, one more search owed before claiming novelty): no peer-reviewed markdown usability study exists; no academic markdown formalization exists.

---

## 10. What to build, in order

The revenue-critical path is **unchanged** by any of today's research `[PLAN §7.5]`: **N11 → N1 identity/tenancy (the gate) → N2 auth/GitHub App → N3 share roles → N4 comments**. The engine work already landed (splice both write paths, cert, offsets fixed, gates hardened — commits `f47555f`…`9e84628`). What today's research re-orders is everything AROUND that path:

| Track | Items, in order | Why this order |
|---|---|---|
| **Custom renders** (funnel 2's engine) | 1. the `components.tsx:133` regex fix (one character class — prerequisite to everything) → 2. delete `editable-table.tsx` dead code → 3. kanban profile, read-only render of the Obsidian convention → 4. bidirectional drag via splice, gated by a no-op-dirties-zero oracle → 5. `type: decision` ADR profile → 6. slides (Marp-compatible) → 7. flow (derived layout only) | Each step demos; the write-back moat lands only after the read path proves the profile |
| **AI protocol** (funnel 1's engine) | 1. MCP server over the vault (table stakes now) → 2. `mdmax explain --as` (the differ nobody has) → 3. byte-attributed AI-edit provenance → 4. cert distribution (npx/MCP/skill/Action) | 1 is expected, 2–3 are unclaimed, 4 compounds the dataset moat |
| **mdmap** | Phase A `mdmap check` against this repo + `md`; kill or continue on its own output | Cheapest disproof of the graph thread |
| **AEO** | Only as the citable-content linter (§6), only after the construct detectors are fixed (§6.9 of the audit — six known defects) | Shipping it before the detectors are honest repeats the format-snake-oil the evidence just refuted |
| **Simplest-editor debt** | Dashboard/home surface; background auto-sync + the always-visible sync indicator (the #1 feature request verbatim) | First-impression and #1-demand items predate every new thread |

**Still open, founder-level (unchanged):** the export contract; OAuth scope (`read:user` blocks the GitHub-App path as written); when the second-user workstream starts (it gates all revenue); the Max tier's contents (evidence: depth on named needs — offline that works on a plane, 10k-note performance, unmetered BYO-AI — not novelty). Two PATs from an earlier session remain unrotated.

---

## 11. Kill conditions for the new threads

1. **Kanban profile:** if the bidirectional splice cannot pass a no-op-round-trip-dirties-zero-files oracle on real boards, the drag surface ships read-only or not at all (the properties-panel precedent).
2. **mdmap:** Phase A output fails to make anyone fix anything → stop (its own doc's rule).
3. **AEO linter:** if hand-audited lint suggestions fail to correlate with any measurable visibility signal on the founder's own published corpus, it is a writing aid, not an AEO product — rename or drop.
4. **Markdown-as-UI-contract marketing:** one more search round (LR#72) before any "first/only" claim ships; if a counterexample exists, the claim narrows to "the only one with a fidelity certificate behind it."

## 12. Verification debt (highest-priority fetches before anything here is quoted externally)

All `[SS]` items, ranked: (1) AGENTS.md → Linux Foundation donation; (2) Notion-flavored Markdown API docs; (3) the Otterly `.md`-zero-citations experiment; (4) Obsidian Kanban file grammar from the plugin source; (5) live pricing pages — Obsidian, Craft (credit counts), Notion AI tiers, Typora, Bear, Joplin, HackMD, iA (price conflict), Inkdrop (price conflict); (6) GitHub `[tasklist]` retirement changelog; (7) Google A2UI announcement; (8) npm download numbers re-derived from npmjs.com; (9) the four paper IDs with uncorroborated author lists (2411.10541, 2501.15000, the POPL lens DOIs, PEG DOI); (10) merchant-of-record rates from a non-Dodo source.

---

*Method: 6 read-only research agents (WebSearch-only; fetch refused by the session gate), ~570k subagent tokens, cross-checked against the internal record. Full agent reports preserved in the session scratchpad; internal grounding: PLAN.md §4/§5/§7/§8, docs/mdmap/, HANDOFF-mdz-2026-07-29, docs/research/frontmatter-competitor-gapmap.md.*
