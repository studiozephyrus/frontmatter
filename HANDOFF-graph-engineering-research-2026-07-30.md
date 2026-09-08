# HANDOFF — Graph-Engineering Research → `frontmatter` (2026-07-30)

> **One line.** The complete, no-skim record of the graph-engineering research thread that began
> with YouTube video `H7t3uUp3HVw` ("Anthropic Just Fixed Graph Engineering's Greatest Flaw", AI
> LABS) and ran through: a full video analysis, a terminology-collision correction, three
> verification searches, a ground-up "Markdown++ + front-matter + graph editor" design, three
> rounds of implementation-level code, four remaining subsystem sketches, and finally a
> **reconciliation against the existing `frontmatter` engine `docs/engine/PLAN.md` v0.2.0** — which
> turned out to already supersede most of the design produced here.
>
> **Purpose / north star.** We are **building a new markdown** — the `frontmatter` project (engine +
> editor). **This handover is a research CONTRIBUTION to that build**, not a competing plan. It feeds
> in: (a) the graph-engineering analysis and its verified corrections, (b) a full design/code
> exploration of a graph-native markdown editor, and (c) a reconciliation that maps every piece onto
> the canonical `docs/engine/PLAN.md` — so the genuinely-additive parts get folded in and the
> already-decided/measured parts are not rebuilt from scratch. Mine it for what's additive; keep
> `PLAN.md` as the canonical design of record.
>
> **This document is a payload.** It is written to be pasted verbatim into another chat / AI answer
> engine / the `frontmatter` project as input. It is exhaustive on purpose (sgnk-handover: fidelity
> over token economy).
>
> **THE ONE THING TO INTERNALIZE FIRST:** `docs/engine/PLAN.md` v0.2.0 (in this repo, ~14M research
> tokens behind it) is **CANONICAL and more advanced than the design in Part II of this document.**
> Part III is the reconciliation that proves it. Do **not** merge Part II's proposals into PLAN.md.
> Keep PLAN.md canonical; treat Part II as provenance + a few genuinely-additive angles (Part III.C).

---

## 0. How to read this document

- **Verified vs unverified is tagged inline.** `[VERIFIED]` = checked against a file/primary source
  this session. `[UNVERIFIED]` = asserted by a video/agent and not independently checked. Full
  ledger in Part VI.
- **Structure:** Part I = chronological narrative (what happened, in order). Part II = the complete
  technical corpus (every design + every line of code produced). Part III = reconciliation & dedup
  against the existing PLAN.md (the most important section for a builder). Part IV = research
  pointers & citations. Part V = live state at write time. Part VI = verified/unverified ledger.
  Part VII = ordered next actions + do-NOT-re-litigate.
- **Naming note:** the design in Part II called the format "Markdown++"; the repo's own name for the
  whole thing is **`frontmatter`** (engine + editor), and `docs/engine/PLAN.md` §0 says the product
  is a **markdown compiler over plain `.md`, NOT a new format**. Where this doc says "Markdown++",
  read it as "the naive proposal that PLAN.md's no-new-format decision supersedes."

---

# PART I — CHRONOLOGICAL RESEARCH NARRATIVE

### 1.1 The trigger — user's verbatim ask
User pasted `https://www.youtube.com/watch?v=H7t3uUp3HVw` with (verbatim):
> "check this detailed and end to end way and let me know the detailed summary of this. So dig deep
> inside this graph engineering because I am planning to build an upgraded version of Markdown and
> also build front matter, which will be a Markdown editor. I want to have all these concepts
> embedded, so just go ahead and start the activity."

Then, across four follow-ups: **"go even deeper"** → **"go deeper please"** → **"i guess we can go
deep on each aspect"** → **"go ahead and do that for the remaining pieces also, then let's have the
whole thing combined and pushed first."** Then, on discovering the existing repo, the final ask
(this document): **"I need everything in a document ... complete documentation, end to end ... every
single research avenue ... all the proposals ... reconciliation, dedup ... plus a prompt for the
other chat."**

### 1.2 Video fetch + identification `[VERIFIED]`
Pulled via `yt-dlp` (LR#3 — `WebFetch` is blocked on YouTube). Metadata:
- **Title:** "Anthropic Just Fixed Graph Engineering's Greatest Flaw"
- **Channel:** AI LABS · **Duration:** 847 s (14:07) · **Uploaded:** 2026-07-29 · **Views:** 2,249 at fetch
- **Sponsor:** SerpApi (250 free credits) · **Community:** AI Labs Pro; newsletter "The Roundup"
- Transcript: 3,159 words, read end-to-end (`fidelity: full`).

### 1.3 The terminology-collision finding `[VERIFIED]` — the pivot of the whole thread
The video's description states verbatim: **"Not the knowledge graph kind."** The video's "graph
engineering" = **multi-agent orchestration** (nodes = *AI agents*, edges = *data flow between
agents*). That is a **different graph** from the **knowledge/document graph** (nodes = *notes/blocks*,
edges = *links*) that an "upgraded Markdown + front-matter editor" actually needs. This distinction
was surfaced to the user before any design, because building on the conflation would have been wrong
(RULE 7). Everything downstream separates the two: agent-graph concepts → the editor's *AI features*;
knowledge-graph concepts → the *format/engine*.

### 1.4 The three verification searches `[VERIFIED]`
Because the video's central claim was "Anthropic just released a fix," RULE 1 required checking it:
1. **"Anthropic graph engineering article"** → **OVERSTATED.** "Graph engineering" is a **community/X
   term** that trended mid-July 2026, *not* a new Anthropic release. The verification patterns it
   describes (parallelization, orchestrator-workers, **evaluator-optimizer**) are from Anthropic's
   **"Building Effective Agents"** (Dec **2024**). LangChain publicly argued the concept is "nothing
   new." Sources in Part IV.
2. **"Verify / Simplify / Code Review skills built-in"** → **PARTIAL.** Simplify (code-simplifier,
   ~117k weekly installs) and Code Review are confirmed built-in; a distinct built-in **"Verify"**
   skill was **not** independently confirmed. `[UNVERIFIED]` for Verify.
3. **"Chrome Headless Shell"** → **CONFIRMED.** `chrome-headless-shell` is a real, separate, lighter
   binary (fewer deps — no X11/Wayland/D-Bus; faster for automation/screenshots).

### 1.5 Deliverable 1 — the detailed video summary (Parts 1–4)
Delivered: (1) end-to-end video breakdown with `@mm:ss`; (2) the agent-graph vs knowledge-graph
distinction table; (3A) knowledge-graph engineering for the format; (3B) agent-graph concepts as the
editor's AI features; (4) next steps. Full content preserved in **Part II.A–II.B**.

### 1.6 "go even deeper" → grounding + the Markdown++ design `[VERIFIED grounding]`
Read graphify's actual output on the `knowledge` repo (`graph.json`, `GRAPH_REPORT.md`): **3,848
nodes · 3,737 edges · 340 communities · 100% deterministic · 0 tokens**. Used the real node/edge
JSON schema as the reference model, then wrote the full design (Part II.C–II.D): reference model +
Markdown++ format + engine + editor architecture + AI layer + graph algorithms + prior art + build
sequence + open decisions.

### 1.7 "go deeper please" → implementation-level code
Read graphify's real relation vocabulary (`contains`/`references`/`calls`/`conceptually_related_to`/
`semantically_similar_to`/`rationale_for`) and node types (`document`/`rationale`/`code`). Produced
the parser (micromark + visitor), the SQLite schema + incremental reindex, the query set, and the
edge-suggestion AI pipeline. Full code in **Part II.E**.

### 1.8 "go deep on each aspect" → aspects (a)/(b)/(c)
Produced full code for: (a) the wikilink tokenizer + mdast→edge visitor; (b) the review-orchestrator
skill (fan-in-at-barrier); (c) CodeMirror 6 decorations (chips, backlink hover, autocomplete). Full
code in **Part II.E**.

### 1.9 "remaining pieces + combine + push" → the reconciliation discovery `[VERIFIED]`
On moving to create/push a `DESIGN.md`, discovered `~/Desktop/GitHub/frontmatter` **already exists**
as a substantial, active project: CodeMirror 6, `gray-matter`, Tauri (`src-tauri/`), Next.js, the AI
SDK with multiple providers, Firebase, a hexagonal `src/modules/{graph,editor,vault,ai,...}` layout,
`docs/{engine/PLAN.md, mdmap/MAP.md, FRONTMATTER-PRODUCT-PLAN.md, FEATURE-GAP-REPORT.md, research/}`,
and an untracked `HANDOFF-mdz-markdown-format-2026-07-29.md`. Remote `origin` =
`studiozephyrus/frontmatter` (shared org); branch `engine/plan-and-diagnostics`; HEAD `ae81971`.
**Did NOT write or push** — surfaced the finding instead (the premise "push a fresh design" had
collapsed).

### 1.10 Reading PLAN.md v0.2.0 → the supersession finding `[VERIFIED]`
Read `docs/engine/PLAN.md` (866 lines) in full. It is a **markdown-compiler** design (7 passes on
`@lezer/markdown` with Volar's virtual-file model), backed by ~14M research tokens, and it has a
**§10 "Settled — do not re-litigate"** and a **§12 "Token-cost claims, corrected."** Most of Part
II's design is a naive rediscovery of, or is superseded by, decisions PLAN.md already made and
measured. Full supersession table in **Part III.B**.

### 1.11 This handover
Authored via `sgnk-handover`. While writing, re-verified the two bugs in PLAN.md §13 and found them
**already fixed** (commit `58322f7`) — §13's text is stale (Part III.D).

---

# PART II — THE COMPLETE TECHNICAL CORPUS

## II.A — Video 3, full analysis

**Thesis:** "loop engineering" → "graph engineering" is the current upgrade for agentic work.
- **Loop engineering:** hand an agent a goal; it self-adjusts. Problem = *shape*: work → verify →
  next, in a straight line; every step waits on the prior even when independent.
- **Graph engineering:** split the task into parts, one agent per part. Wins: speed (concurrency) +
  per-node model choice. Honest cost caveat stated in the video: **a graph burns far more total
  tokens; not viable on $20 plans.** `[VERIFIED — matches the video]`
- **Anatomy:** node = one isolated-context agent; edge = wiring routing one node's output to the
  next. Claude Code **dynamic workflows** are a graph.
- **Shapes:** **diamond** (fan out → narrow back to one synthesizer); **fan-in at a barrier** (same
  problem to N agents each with a different lens; nothing proceeds until all report).
- **The "greatest flaw":** one wrong small node silently corrupts the whole output and is hard to
  trace (you only see the finished result).
- **Verification (most of the video):**
  - Built-ins: **Verify** skill `[UNVERIFIED]`, **tool chaining** (agent runs tests/tools, self-fixes;
    put commands in `CLAUDE.md`), **Code Review** skill `[VERIFIED built-in]`, **GitHub Actions** hooks.
  - Best is **build-your-own** via the **Skill Creator** plugin (user vs project scope).
  - **The judge-model lesson (the video's #1 point):** a **Haiku** reviewer returned a long list of
    issues that were mostly *intentional*; **Opus** flagged fewer, all real. Verbatim: **"The node
    that does the judging is the one place where saving tokens costs you everything."**
  - **Three kinds:** *standalone* (manual deep pass on finished work — e.g. Cursor "thermonuclear
    code review"); *embedded* (fires automatically in-workflow); *chained + orchestrated*.
  - **Second Opinion skill:** "the agent that built it is the worst to review it"; launches a **fresh
    Claude session via the `-p` flag** (no shared context); run it on **Opus**.
  - **Visual verify:** default full Chrome/Puppeteer/Playwright is heavy → use **Chrome Headless
    Shell** `[VERIFIED]`.
  - **Anthropic's own 4-direction chain:** **Code Review + Simplify + Verify + a Design skill** (the
    Design skill checks the UI against a **`design.md`**). `[UNVERIFIED — asserted by the video]`
  - **Orchestrator skill:** one skill above the rest that spins an agent per review skill (parallel,
    isolated contexts) and pulls all findings into one report.

**Accuracy corrections `[VERIFIED]`:** "Anthropic just released a fix" is **marketing** — the patterns
are from *Building Effective Agents* (2024); "graph engineering" is a community coinage. "Verify"
built-in unconfirmed. Chrome Headless Shell accurate.

## II.B — The distinction (agent-graph vs knowledge-graph)

| | Agent-orchestration graph (this video) | Knowledge / document graph (what the editor needs) |
|---|---|---|
| **Node** | an AI agent (isolated context) | a note / block / document |
| **Edge** | data flow between agents | a link / reference / typed relationship |
| **Goal** | run one task across many agents, verify | traverse meaning without re-reading |
| **Tool** | Claude Code dynamic workflows / subagents | Obsidian, Roam, **graphify** |

**Consequence:** agent-graph ideas → the editor's *AI features* (Part II.E review-orchestrator).
Knowledge-graph ideas → the *format/engine* (Part II.C/D). **PLAN.md §2.1 formalizes exactly this as
the "tree/graph boundary": a single `.md` file is a tree over a closed 21-label alphabet and cannot
carry any edge that is not parent-child — so cross-file relations live in a *resolver/linker*, not in
syntax.** (This is the rigorous version of the distinction; see Part III.)

## II.C — The graphify reference model (the real, measured baseline) `[VERIFIED]`

graphify on the `knowledge` repo produced, **deterministically, at 0 token cost**:
```
273 files · ~546,933 words → 3,848 nodes · 3,737 edges · 340 communities
Extraction: 100% EXTRACTED · 0% INFERRED · 15 inferred edges (avg confidence 0.68)
Token cost: 0 input · 0 output   ·   built_at_commit: 464eb666
```
Real node & edge JSON schema (`graphify-out/graph.json`):
```jsonc
// NODE
{ "id":"scripts_fm_py", "label":"_fm.py", "norm_label":"_fm.py",
  "file_type":"code", "source_file":"scripts/_fm.py", "source_location":"L1", "community":125 }
// EDGE ("link")
{ "source":"scripts_fm_py", "target":"scripts_fm_coerce", "relation":"contains",
  "confidence":"EXTRACTED", "confidence_score":1.0,
  "source_file":"scripts/_fm.py", "source_location":"L9", "weight":1.0 }
// graph-level: directed:false, multigraph:false, hyperedges:[]  (hyperedges reserved), built_at_commit
```
Real relation vocabulary (counts on the corpus): `contains` 3516 · `references` 150 · `calls` 30 ·
`conceptually_related_to` 18 · `semantically_similar_to` 15 · `rationale_for` 8. Node `file_type`:
`document` 3764 · `rationale` 46 · `code` 38.

**Five design laws extracted from this schema:** (1) every edge is provenanced (`source_file` +
`source_location`); (2) `EXTRACTED` vs `INFERRED` + `confidence_score` keeps facts and guesses
separate; (3) `relation` is typed; (4) `community` is a first-class node property (→ auto-MOCs);
(5) `hyperedges` reserved (edges binding >2 nodes). **The headline principle:** the graph is a
*derived, zero-cost, deterministic* artifact; the LLM touches only the ~0.4% inferred edges.

> **Reconciliation flag:** PLAN.md **§10** rejects "content-hash-only identity" (Θ(n) rebuild per
> O(1) edit, Hammer OOPSLA 2015 — "names, not hashes"), and **§7** demotes provenance to an *explicit
> bet* ("the demand sweep found zero threads requesting it"). So laws (1) and the hash-centric parts
> are **superseded** by PLAN's anchor model (§III.B).

## II.D — The "Markdown++" design (§0–§8 as delivered) — *superseded framing, kept for provenance*

> **Read Part III first.** PLAN.md's no-new-format decision supersedes the premise of this whole
> subsection. Retained verbatim because the user asked for *every* proposal.

- **§1 Format (Markdown++):** a superset that degrades to valid Markdown. Additions: (a) typed,
  schema-validated front matter; (b) **typed links** — `[[id]]`, inline `[[id | rel]]`, and a
  front-matter `relationships:` block; (c) block IDs + transclusion (`^id`, `![[note#^id]]`); (d)
  note-level nodes (default) + optional block sub-nodes; (e) mandatory per-edge provenance; (f)
  hyperedges. **← The typed-link sigil is the single idea PLAN.md most decisively rejects (§III.B).**
- **§2 Engine:** `remark`/`mdast` (or `tree-sitter-markdown`) + a micromark `[[ ]]` extension →
  single visitor → deterministic edges with `source_location`; LLM tier only for the ~0.4% inferred
  edges (quarantined). **Biggest leverage move proposed: wrap graphify rather than rebuild.**
- **§3 Editor:** local-first, file-is-source-of-truth (Obsidian model); **Tauri** shell; **CodeMirror
  6**; `mdast→HTML` with wikilink/transclusion plugins; **WebGL** graph view (3,848 nodes kills SVG);
  schema-driven front-matter form; panels (backlinks/orphans/local-graph/tags).
- **§4 AI layer:** deterministic-first (never AI for link integrity/schema/backlinks); the three
  verification features (embedded on-save / standalone deep / orchestrated multi-lens); the
  judge-model rule; **★ AI edge-suggestion** (propose typed edges, INFERRED + confidence, human
  confirms → promotes to EXTRACTED and writes into front matter).
- **§5 Algorithms:** typed traversal (prerequisite chains via `builds-on`; tension maps via
  `contradicts`), Louvain communities → auto-MOCs, centrality (hubs), path queries, orphan/dead-link/
  contradiction-cycle detection, k-hop neighborhoods.
- **§6 Prior art:** Obsidian (untyped, no provenance), Roam/Logseq (block-refs), Foam/Dendron,
  graphify (deterministic, communities). Proposed differentiator: typed + provenanced +
  schema-validated + deterministic-first, AI only at the edges.
- **§7 Build sequence:** MVP (parser + SQLite + CM6 + backlinks + link-integrity, no AI) → v0.2 typed
  rels + schema form + WebGL graph → v0.3 transclusion + communities → v0.4 AI layer.
- **§8 Open decisions:** node granularity; typed-link syntax; Tauri vs web; CodeMirror vs
  ProseMirror; wrap graphify vs build. **← PLAN.md has since decided most of these (§III.B).**

## II.E — Implementation-level code (every line produced)

> All code below was authored as a proposal. Alignment/supersession per PLAN.md is flagged after each
> block. Kept complete because the user asked for "all the codes and everything."

### E.1 — Edge-type vocabulary (three tiers, one confidence axis)
| Tier | Relations | Author | `confidence` | `source_location` |
|---|---|---|---|---|
| Structural (auto) | `contains`,`references`,`embeds`,`calls`,`tagged` | parser | `EXTRACTED` 1.0 | `L{n}` |
| Semantic (authored) | `builds-on`,`extends`,`contradicts`,`supports`,`applies`,`prerequisite-of`,`part-of`,`related` | human | `EXTRACTED` 1.0 | `frontmatter`/`L{n}` |
| Inferred (AI) | any semantic, *pending* | model | `INFERRED` <1.0 | `ai:{model}@{date}` |
Invariant: `INFERRED` never silently becomes `EXTRACTED`; promotion is a human action that writes the
edge into front matter. **PLAN alignment:** matches **§4 the confidence ladder (E/W/I)** *conceptually*
but PLAN caps the typed vocabulary — **"nine is the measured ceiling (gIBIS, TOIS 6(4) 1988)"** (§10).

### E.2 — Format grammar (EBNF) — *superseded by "no new sigil" (§III.B)*
```ebnf
typed_link   ::= "[[" target ("#^" block_id)? ("|" relation (":" note)?)? "]]"
transclusion ::= "!" typed_link
block_anchor ::= text "^" block_id
relation     ::= "builds-on" | "contradicts" | "supports" | "extends"
               | "prerequisite-of" | "part-of" | "applies" | "references" | "related"
```
Rule that saves a bug class: typed links inside `` `code` ``/fences are **not** edges — free because
you parse via AST, not regex (LR#64 phantom-edge family). **PLAN §3.3 measured this precisely:** a
naive inline trailing anchor destroys **100% of fenced code blocks, 150/150 thematic breaks, 74/74
tables**; a carrier that is inline for prose but **blank-line-isolated for code/tables/rules/HTML**
corrupts **0 of 1,765**.

### E.3 — Parser (wikilink base + typed-slot parse + visitor)
```ts
import { fromMarkdown } from 'mdast-util-from-markdown'
import { syntax } from 'micromark-extension-wiki-link'
import * as wl from 'mdast-util-wiki-link'
export function parse(md: string) {
  return fromMarkdown(md, { extensions:[syntax({ aliasDivider:'|' })], mdastExtensions:[wl.fromMarkdown()] })
}
const REL = new Set(['builds-on','extends','contradicts','supports','applies',
                     'prerequisite-of','part-of','references','related','embeds'])
export function parseWikiValue(node:any){
  let raw=String(node.value); const alias=node.data?.alias as string|undefined; let block:string|undefined
  const h=raw.indexOf('#^'); if(h>=0){ block=raw.slice(h+2); raw=raw.slice(0,h) }
  let relation='references', note:string|undefined
  if(alias){ const c=alias.indexOf(':'); const relTok=(c>=0?alias.slice(0,c):alias).trim()
    if(REL.has(relTok)){ relation=relTok; note=c>=0?alias.slice(c+1).trim():undefined } else note=alias.trim() }
  return { target:raw.trim(), block, relation, note, line:node.position?.start.line }
}
```
```ts
import { visit } from 'unist-util-visit'
export function extract(file:string, tree:any, fm:any, hash:string){
  const noteId = fm.id ?? slug(file)
  const nodes=[{ id:noteId, label:fm.title??noteId, node_type:'document',
                 source_file:file, source_location:'L1', content_hash:hash, frontmatter:fm }]
  const edges:any[]=[]
  const E=(t:string,rel:string,loc:string,note?:string)=>edges.push({ source:noteId, target:resolve(t),
    relation:rel, confidence:'EXTRACTED', confidence_score:1.0, source_file:file, source_location:loc, note, pending:0 })
  for(const r of fm.relationships??[]) E(unwrap(r.target), r.type, 'frontmatter', r.note)
  visit(tree,'wikiLink',(n:any,_i,parent:any)=>{ const {target,relation,note,line}=parseWikiValue(n)
    E(target, parent?.type==='transclusion'||n.data?.embed?'embeds':relation, `L${line}`, note) })
  return { nodes, edges }
}
```
Gotchas: (1) AST visit never enters `inlineCode`/`code` (kills phantom edges); (2) transclusion needs
a hook (E.7 below); (3) unresolved targets are still edges — surfaced by the dead-link query, never
dropped. **PLAN alignment:** PLAN chooses **`@lezer/markdown`** for the incremental path (§3.2) since
CodeMirror already holds the Lezer tree in memory; remark is fine for a batch CLI, Lezer for the live
editor.

### E.4 — SQLite graph store + incremental reindex
```sql
CREATE TABLE nodes ( id TEXT PRIMARY KEY, label TEXT NOT NULL, node_type TEXT NOT NULL,
  source_file TEXT NOT NULL, source_location TEXT, content_hash TEXT, community INTEGER,
  frontmatter TEXT, updated_at TEXT );
CREATE TABLE edges ( id INTEGER PRIMARY KEY, source TEXT NOT NULL, target TEXT NOT NULL,
  relation TEXT NOT NULL, confidence TEXT NOT NULL DEFAULT 'EXTRACTED', confidence_score REAL NOT NULL DEFAULT 1.0,
  source_file TEXT NOT NULL, source_location TEXT NOT NULL, note TEXT, pending INTEGER NOT NULL DEFAULT 0 );
CREATE INDEX idx_e_src ON edges(source);  CREATE INDEX idx_e_tgt ON edges(target);
CREATE INDEX idx_e_rel ON edges(relation); CREATE INDEX idx_e_file ON edges(source_file);
CREATE VIRTUAL TABLE fts USING fts5(id UNINDEXED, label, body);
```
```
on change(f):
  h=sha256(f); if h==nodes.content_hash(f): return
  BEGIN
    DELETE FROM edges WHERE source_file=f;  DELETE FROM nodes WHERE source_file=f;
    (nodes,edges)=extract(f); INSERT…; UPDATE fts;
  COMMIT
  emit graphDelta({added,removed})
```
Delete-by-`source_file` then re-insert = idempotent. **PLAN alignment / supersession:** PLAN's
identity is **not** a `content_hash` column — it is **content-derived re-anchoring** (§1.1a), measured
at **99.627% correct / 0.050% false** over 41,642 block-versions, with an `anchorable()` gate that is
"the highest-leverage single line in the design." A `content_hash` alone scored 83.36% correct / 16.64%
refusal in PLAN's own sweep. **Use PLAN's anchor, not this hash column.**

### E.5 — Queries (real SQL the typed graph unlocks)
```sql
-- backlinks
SELECT source, relation, source_file, source_location FROM edges WHERE target = :id;
-- prerequisite chain (typed, cycle-guarded)
WITH RECURSIVE chain(id,depth,path) AS (
  SELECT :id,0,:id UNION
  SELECT e.target,c.depth+1,c.path||'>'||e.target FROM edges e JOIN chain c ON e.source=c.id
  WHERE e.relation IN ('builds-on','prerequisite-of') AND instr(c.path,e.target)=0)
SELECT * FROM chain WHERE depth>0 ORDER BY depth;
-- shortest explicit path A→B (≤6 hops, cite-able)
WITH RECURSIVE bfs(id,path,depth) AS (
  SELECT :a,:a,0 UNION
  SELECT nxt,bfs.path||'>'||nxt,bfs.depth+1 FROM (
    SELECT CASE WHEN e.source=bfs.id THEN e.target ELSE e.source END nxt, bfs.* FROM edges e JOIN bfs ON (e.source=bfs.id OR e.target=bfs.id))
  WHERE depth<6 AND instr(path,nxt)=0)
SELECT path,depth FROM bfs WHERE id=:b ORDER BY depth LIMIT 1;
-- dead links / orphans / mutual contradictions / degree centrality
SELECT e.source,e.target,e.source_location FROM edges e LEFT JOIN nodes n ON n.id=e.target WHERE n.id IS NULL;
SELECT id FROM nodes n WHERE NOT EXISTS (SELECT 1 FROM edges e WHERE e.source=n.id OR e.target=n.id);
SELECT a.source,a.target FROM edges a JOIN edges b ON a.source=b.target AND a.target=b.source
  WHERE a.relation='contradicts' AND b.relation='contradicts' AND a.source<a.target;
SELECT id,(SELECT count(*) FROM edges WHERE source=id OR target=id) deg FROM nodes ORDER BY deg DESC LIMIT 20;
```
**PLAN alignment:** PLAN **§3.7** — "the agent never sees an edge list ... Rank offline, ship flat"
(LLMs score 18.8–23.0% counting nodes, 10.2–15.0% counting edges). So these queries feed **projections
(tier 4, never stored, §2.3)** and offline ranking, not agent-facing edge dumps.

### E.6 — Edge-suggestion AI (the killer feature, quarantined)
```
suggestEdges(noteId):
  note=load(noteId)
  candidates=fts_bm25(note.key_terms,30) ∪ kHop(noteId,2); candidates-=existingTargets(noteId)
  out=agent(model=STRONG, schema=SUGGEST, prompt=SUGGEST_PROMPT(note,candidates))   # STRONG judge (Haiku→Opus lesson)
  for s in out.suggestions:
    insert edge{ source:noteId, target:s.target, relation:s.relation, confidence:'INFERRED',
                 confidence_score:s.confidence, source_location:`ai:${STRONG}@${date}`, note:s.evidence, pending:1 }
```
```jsonc
{ "suggestions":[ {"target_id":"string","relation":"builds-on|contradicts|supports|extends|prerequisite-of|related",
                   "confidence":0.0,"evidence":"one line quoting BOTH notes"} ] }
```
Prompt rules: propose a typed edge only with quotable evidence from both notes; conservative
confidence; never `related` as a lazy default. Promotion is human-gated → `confidence='EXTRACTED'` +
write into front matter; optional **second-opinion** (fresh `-p` session) before promoting.
**PLAN alignment:** matches **§1.3 "inferred schema — proposed, never demanded"** + **§4** (inferred
starts at W, human acceptance promotes to E; "nothing at 0.62 precision may ever gate CI").

### E.7 — Transclusion micromark hook (`![[…]]`) — *remaining piece #1*
```ts
import { codes } from 'micromark-util-symbol'; import { markdownLineEnding } from 'micromark-util-character'
export const transclusion = { text: { [codes.exclamationMark]: { name:'transclusion', tokenize } } }
function tokenize(effects:any, ok:any, nok:any){
  return start
  function start(c:number){ effects.enter('transclusion'); effects.consume(c); return b1 }        // '!'
  function b1(c:number){ if(c!==codes.leftSquareBracket) return nok(c); effects.consume(c); return b2 }
  function b2(c:number){ if(c!==codes.leftSquareBracket) return nok(c); effects.consume(c); effects.enter('transclusionTarget'); return inside }
  function inside(c:number){ if(c===codes.rightSquareBracket){ effects.exit('transclusionTarget'); effects.consume(c); return c1 }
    if(c===codes.eof||markdownLineEnding(c)) return nok(c); effects.consume(c); return inside }
  function c1(c:number){ if(c!==codes.rightSquareBracket) return nok(c); effects.consume(c); effects.exit('transclusion'); return ok }
}
// mdast-util sets node.data.embed=true; the E.3 visitor emits an `embeds` edge.
```
**PLAN alignment (strong):** PLAN **§3.5** — adopt AsciiDoc's transclusion **semantics** not its
mechanism: **named regions `tags=name`, never positional `lines=1..10`** (Rönnau, DocEng 2008, proves
positional breaks); **resolve at link time into the AST, never as a preprocessor**; **cycle detection
mandatory** (XInclude: fatal error keyed on the inclusion chain). This hook is only the *syntax*;
resolution belongs in Pass 4 (resolve).

### E.8 — Louvain community pass + auto-MOC — *remaining piece #2*
```ts
import Graph from 'graphology'; import louvain from 'graphology-communities-louvain'
export function communities(nodes:any[], edges:any[]){
  const g=new Graph({ type:'undirected' })
  for(const n of nodes) g.mergeNode(n.id)
  for(const e of edges) g.mergeEdge(e.source, e.target)
  const comm=louvain(g,{ resolution:1.0 })                       // { nodeId: communityInt }
  const byComm=new Map<number,string[]>()
  for(const [id,c] of Object.entries(comm)){ (byComm.get(c as any)??byComm.set(c as any,[]).get(c as any)!).push(id) }
  return { comm, mocs:[...byComm].map(([c,ids])=>({ community:c, hubs:ids.sort((a,b)=>g.degree(b)-g.degree(a)).slice(0,8) })) }
}
```
graphify already computes 340 communities on the corpus. **PLAN alignment:** communities/centrality
are **projections — tier 4, never stored (§2.3, §2.4 "projections are never stored")**; §3.7 endorses
offline ranking (HippoRAG 2 PageRank worth +12.5 where the LLM's contribution is 0.7 of 87.1). So run
this as a derived, rebuildable pass; never persist it as source.

### E.9 — Tauri ↔ SQLite bridge (Rust) — *remaining piece #3*
```rust
use rusqlite::Connection; use std::sync::Mutex; use tauri::State;
struct Db(Mutex<Connection>);
#[tauri::command]
fn reindex_file(path:String, db:State<Db>) -> Result<usize,String> {
  let c = db.0.lock().unwrap();
  c.execute("DELETE FROM edges WHERE source_file=?1",[&path]).map_err(|e|e.to_string())?;
  c.execute("DELETE FROM nodes WHERE source_file=?1",[&path]).map_err(|e|e.to_string())?;
  Ok(0) // parse in JS or shell to the engine CLI; Rust persists the returned rows
}
#[tauri::command] fn backlinks(id:String, db:State<Db>) -> Result<Vec<String>,String> { /* SELECT ... WHERE target=?1 */ Ok(vec![]) }
fn main(){ tauri::Builder::default()
  .manage(Db(Mutex::new(Connection::open("graph.db").unwrap())))
  .invoke_handler(tauri::generate_handler![reindex_file, backlinks])
  .run(tauri::generate_context!()).unwrap(); }
// + a notify-crate watcher → debounce → invoke reindex → emit event to the webview.
```
**PLAN alignment / correction:** PLAN **§0** — the **engine ships as a standalone library + CLI,
useful with no editor at all** ("if it is not useful as a CLI in someone else's CI, it is not a
compiler, it is a feature"). So the Rust side should **shell to / link the engine as the authority**,
not re-implement graph logic. The bridge is *editor-track*; the engine is the source of truth.

### E.10 — Front-matter form UI from the schema contract — *remaining piece #4*
```tsx
type Field = { key:string; type:'string'|'enum'|'date'|'relationships'; required?:boolean; enum?:string[] }
function FrontmatterForm({ fm, schema, onChange, graph }:{ fm:any; schema:Field[]; onChange:(fm:any)=>void; graph:any }){
  return <>{schema.map(f=>{
    switch(f.type){
      case 'enum': return <select key={f.key} value={fm[f.key]??''} onChange={e=>onChange({...fm,[f.key]:e.target.value})}>{f.enum!.map(o=><option key={o}>{o}</option>)}</select>
      case 'relationships': return <RelEditor key={f.key} value={fm.relationships??[]} vocab={REL} search={graph.searchIds} onChange={rs=>onChange({...fm,relationships:rs})}/>
      default: return <input key={f.key} value={fm[f.key]??''} onChange={e=>onChange({...fm,[f.key]:e.target.value})}/>
    }})}</>
}
// RelEditor = repeatable rows { type:<select vocab>, target:<FTS-backed picker> }
```
**PLAN alignment (this is a KEY win, and PLAN sharpens it):** PLAN **§1.5 "the wedge"** — Obsidian's
`processFrontMatter` **destroys YAML** (strips quoting, deletes comments, destroys `!!timestamp` tags,
converts inline arrays to block). Obsidian's own type is `interface FrontMatterCache { [key:string]:
any }`. **Therefore the form MUST splice YAML in place — preserve comments, quoting, tags, inline-flow
form — NEVER `js-yaml` round-trip.** That in-place YAML splicer is a **Phase-1 differentiator the
incumbent has publicly refused to build** (§9). Do not ship a form that regenerates YAML.

### E.11 — CodeMirror 6 decorations (aspect c) — chips, hover, autocomplete
```ts
import { ViewPlugin, Decoration, MatchDecorator, EditorView, WidgetType, hoverTooltip } from '@codemirror/view'
import { autocompletion, CompletionContext } from '@codemirror/autocomplete'
const WIKILINK = /\[\[([^\]|#]+)(#\^[^\]|]+)?(?:\|([^\]]+))?\]\]/g
class ChipWidget extends WidgetType {
  constructor(readonly target:string, readonly rel:string, readonly resolved:boolean){ super() }
  eq(o:ChipWidget){ return o.target===this.target&&o.rel===this.rel&&o.resolved===this.resolved }
  toDOM(){ const el=document.createElement('span'); el.className=`mdpp-chip rel-${this.rel} ${this.resolved?'':'unresolved'}`; el.textContent=this.target; el.dataset.target=this.target; return el }
}
function chipDeco(graph:any){
  const m=new MatchDecorator({ regexp:WIKILINK, decoration:(mm)=>{ const[,t,,alias]=mm
    return Decoration.replace({ widget:new ChipWidget(t.trim(), parseRel(alias)??'references', graph.has(t.trim())) }) }})
  return ViewPlugin.fromClass(class{ decorations:any; constructor(v:EditorView){ this.decorations=m.createDeco(v) } update(u:any){ this.decorations=m.updateDeco(u,this.decorations) } },
    { decorations:v=>v.decorations, provide:p=>EditorView.atomicRanges.of(v=>v.plugin(p)?.decorations??Decoration.none) })
}
const backlinkHover=(graph:any)=>hoverTooltip((view,pos)=>{ const mm=matchAt(view.state,pos,WIKILINK); if(!mm) return null
  return { pos:mm.from, end:mm.to, above:true, create(){ const dom=document.createElement('div')
    const back=graph.backlinks(mm.groups.target)
    dom.innerHTML=`<b>${mm.groups.target}</b> ${graph.has(mm.groups.target)?'':'· <i>unresolved</i>'}<div>← ${back.length} backlinks</div>`
    return { dom } } } })
const wikiComplete=(graph:any)=>autocompletion({ override:[(cx:CompletionContext)=>{ const b=cx.matchBefore(/\[\[([^\]|#]*)$/); if(!b) return null
  return { from:b.from+2, options:graph.searchIds(b.text.slice(2),12).map((n:any)=>({ label:n.id, detail:n.title, apply:`${n.id}]]`, type:'variable' })) } }] })
```
**PLAN alignment (PLAN is MORE precise — §3.8):** "Decorations that significantly change vertical
layout must be provided directly" ⇒ **inline syntax → ViewPlugin; block height → StateField.**
Obsidian ships `editorLivePreviewField: StateField<boolean>` + `livePreviewState: ViewPlugin` — Live
Preview is **one boolean on the same instance, not a second editor**; track mid-click as first-class
state; hide markers with `max-width:0; opacity:0` (not `display:none`); feed the same `RangeSet` to
`atomicRanges`; key `WidgetType.eq()` on the **source slice**. **Adopt PLAN §3.8's exact guidance.**

### E.12 — Review-orchestrator skill (aspect b, fan-in-at-barrier) — the agent-graph → editor bridge
```ts
type Finding={ lens:string; severity:'error'|'warn'|'nit'; msg:string; loc?:string; fix?:string }
async function review(noteId:string, db:any){
  const note=db.note(noteId)
  const det:Finding[]=[ ...lensSchema(note), ...lensLinks(note,db), ...lensStructure(note) ]   // TIER 1: deterministic, free, fail-fast
  if(det.some(f=>f.severity==='error')) return rank(det)
  const modelLenses=[ {lens:'style',model:'strong'}, {lens:'factual',model:'strong'} ]          // TIER 2: parallel, STRONG judge (Haiku→Opus)
  const results=await Promise.all(modelLenses.map(l=>runLensAgent(l,note,{schema:FINDINGS_SCHEMA}))) // ← BARRIER
  return rank([...det, ...results.flat()])
}
```
Judge-model routing: schema/links/structure = **no model** (0 tokens, 0 false positives); style/voice
& factual = **strong** model; optional second-opinion = **strong, fresh context (`-p`)**. Lenses must
be **disjoint** (LR#20). **This is the one genuinely-additive angle from the video** — but it is
**editor-track**, and the repo already has `src/modules/{ai,ai-tools}` + a `FRONTMATTER-PRODUCT-PLAN`
I have **not** read, so *whether it is actually new is UNVERIFIED* (Part III.C).

---

# PART III — RECONCILIATION & DEDUP (read this before building)

## III.A — The discovery `[VERIFIED]`
`~/Desktop/GitHub/frontmatter` is an existing, active, hexagonal-architecture project that **already
is** the Markdown editor + engine. It has `docs/engine/PLAN.md` **v0.2.0** (866 lines, dated
2026-07-29, "evidence: ~14M subagent tokens across 78 research agents + 12 local experiments"),
`docs/mdmap/MAP.md`, `docs/FRONTMATTER-PRODUCT-PLAN.md`, `docs/FEATURE-GAP-REPORT.md`,
`docs/research/*`, and `src/modules/{repository,auth,drafts,graph,ai-tools,ai,preview,app-shell,
export,editor,vault,share}`.

## III.B — Supersession table: Part II design → PLAN.md's already-settled position `[VERIFIED]`

| Part II proposal | PLAN.md decision that supersedes it |
|---|---|
| "Upgraded Markdown" = a **new format** (Part II.D §1) | **§10 "No new format or extension"** (MDX 3.07%, Markdoc 0.136%, djot 65,990× behind) + **§2.1 tree/graph boundary** + **§11 steelman**: "we are not asking anyone to adopt a format — we're asking them to run a tool over files they already have." → **It's a compiler over plain `.md`.** |
| **Typed link sigil `[[x \| rel]]`** (Part II.E.2) — my central idea | **§10 "No new sigil"** (character-namespace exhaustion, jgm) + **§2.2** (extension in the resolver, not syntax) + **§10 "large typed-link vocabularies — nine is the measured ceiling"** (gIBIS). **Rejected.** |
| **SQLite `content_hash` identity + line provenance** (II.E.4) | **§1.1a content-derived re-anchoring** (99.627% correct / 0.050% false, 41,642 block-versions) + **§10 "content-hash-only identity" rejected** (Θ(n) rebuild; names not hashes) + **§7 provenance = an explicit bet** (zero demand). |
| **remark + visitor** (II.E.3) | **§3 7-pass compiler** on **`@lezer/markdown`** (§3.2, Lezer tree already in memory) + **Volar virtual-file model** (§3.1). |
| **"0 tokens / markdown token-advantage"** framing (II.C) | **§12** re-measures & corrects: "entropy floor" refuted (§12.1); "~91% of markdown's apparent token win is not markdown" (§12.2). |
| **CodeMirror decorations** (II.E.11) | **§3.8** already specifies it more precisely (ViewPlugin vs StateField; `atomicRanges`; `WidgetType.eq()` on source slice; `max-width:0;opacity:0`). |
| **Edge-suggestion AI** (II.E.6) | **§1.3 "proposed, never demanded"** + **§4 confidence ladder**. Same spirit, more rigor. |
| **Transclusion by syntax** (II.E.7) | **§3.5** — named regions not positional; resolve at link-time into AST; mandatory cycle detection (XInclude). |
| **Front-matter form** (II.E.10) | **§1.5 "the wedge"** — MUST splice YAML in place (preserve comments/quoting/tags); never regenerate. This is a Phase-1 differentiator. |
| **Communities/centrality stored** (II.E.8) | **§2.3/§2.4** — projections (tier 4) are **never stored**; **§3.7** rank offline, ship flat, agent never sees an edge list. |

## III.C — What is genuinely NOT already in PLAN.md (candidate-additive, each flagged)
1. **Editor-side AI-review orchestrator (fan-in-at-barrier + judge-model routing)** — II.E.12.
   **`[VERIFIED ADDITIVE — 2026-08-04]`.** Checked against `docs/FRONTMATTER-PRODUCT-PLAN.md`,
   `docs/FEATURE-GAP-REPORT.md`, `docs/mdmap/MAP.md`, the `HANDOFF-mdz-markdown-format-2026-07-29.md`
   section map, and the **built** `src/modules/ai*` code. The AI that exists or is planned is
   **authoring + retrieval only**: built = `suggest-links`, `link-doctor`, `refine-text`, `summarize`,
   `generate-document`, ghost-text (`SgnkAiButton`), and a multi-provider **latency race**
   (`infrastructure/provider-race.ts` — the only thing called "orchestrator" in code, and it is NOT a
   review); planned (product plan Pillar 6 / Phase 4) = RAG chat over the vault, pgvector semantic
   search, resurfacing/dedup, BYO-AI + MCP. **A multi-lens, judge-consolidated note review exists
   nowhere.** So the orchestrator IS additive. **CAVEAT — it may be off-grain:** the project is
   deliberately deterministic-first and token-frugal (PLAN **§4** "nothing at 0.62 precision may ever
   gate CI"; **§3.7** "the agent never sees an edge list — rank offline, ship flat"; mdmap invariant 3
   "the agent never traverses edges"). A heavy fan-out multi-agent review runs against that ethos and
   against the video's own cost caveat. **The *aligned* slice is smaller and should be built first:**
   (a) the **judge-model discipline** — if any LLM review runs in the editor, run it on a STRONG model
   (the Haiku→Opus lesson); (b) the **"how would a human review this?" verifier-design heuristic** —
   both slot into PLAN **§4's I-tier (advisory, never gates)** without a full orchestrator. Ship the
   full fan-in-at-barrier orchestrator only as a premium/optional feature, if at all.
2. **The three ingested video notes** (Part IV) — real, in the `knowledge` repo, independent of this
   repo.
3. Nothing else in Part II is safely assumed novel versus PLAN.md.

> **Cross-doc note (found while verifying, 2026-08-04):** the "unfixed bug" claims now span THREE docs
> — PLAN.md §13, mdmap `MAP.md` invariant 6, and `HANDOFF-mdz-markdown-format` §5.2 — and all reference
> `graph-data.ts:132` / `search-index.ts` behaviour that commit `58322f7` already fixed (verified
> III.D). One consolidated doc-staleness cleanup clears all three. Also confirmed: the mdz handoff §3.1
> records **"Do not build a new markdown format — SETTLED"** and §3.4 flags a **direct competitor —
> Front Matter CMS (`frontmatter.codes`), a VS Code extension** — both worth carrying into any
> "new markdown" framing.

## III.D — Re-verification finding: PLAN.md §13 is stale `[VERIFIED this session]`
PLAN.md §13 lists "two confirmed bugs in the editor, unfixed":
- `src/modules/vault/infrastructure/search-index.ts:59` — "strips code before indexing." **Now
  fixed:** current code has `extractBodyText` (prose-only, for unlinked-mention scanning) **plus**
  `extractCodeText` (code indexed separately). Commit `58322f7` "fix(vault,graph): index code
  content; report unresolved links."
- `src/modules/graph/presentation/graph-data.ts:132` — "unresolved links silently dropped." **Now
  fixed:** current code builds `allBasenameToPath` to distinguish "note does not exist" from "note
  opted out of the graph," reporting unresolved links as a diagnosis.
- **Action:** update PLAN.md §13 to reflect that both are addressed in `58322f7` (or delete the
  section). This is a doc-staleness fix, not new engineering.

---

# PART IV — RESEARCH AVENUES, POINTERS & CITATIONS

**This session's web verifications (Part I.4):**
- Anthropic graph-engineering framing → community term; patterns from *Building Effective Agents*
  (2024): `https://www.anthropic.com/engineering` · Louis Bouchard "Graph Engineering Explained"
  `https://www.louisbouchard.ai/graph-engineering-explained/` · TrueFoundry
  `https://www.truefoundry.com/blog/graph-engineering-enterprise-guide` · "LangChain says it's nothing
  new" (Medium) · aibuilderclub "Subagents as an Agent Graph".
- Claude Code skills (Simplify/Code Review built-in; Verify unconfirmed): firecrawl.dev/blog,
  claudeskills.info, dev.to guides.
- Chrome Headless Shell: `https://developer.chrome.com/blog/chrome-headless-shell`.

**graphify (this session's ground truth):** `~/Desktop/GitHub/knowledge/graphify-out/{graph.json,
GRAPH_REPORT.md, .graphify_labels.json, manifest.json}` — numbers in Part II.C.

**The three video knowledge-notes produced this session (in `~/Desktop/GitHub/knowledge`, HEAD
`464eb66`, not yet committed):**
- `categories/ai/video/video-nextnewthing-underrated-opensource-ai-repos.md` (14 open-source AI repos).
- `categories/ai/video/video-nateherk-ai-will-replace-millions-prepare.md` (AI-jobs; 6-agent
  fact-check refuted 2 headline stats — BCG "reshape" not replace; Challenger tens-of-thousands).
- Video 3 (this graph-engineering video) has **no** separate knowledge-note — it lives in this
  handover instead.

**PLAN.md's own load-bearing citations (for the receiving agent — do NOT re-derive; read PLAN):**
Foster et al. TOPLAS 2007 (lens/bijection, §1.2) · Shipman & Marshall CSCW 1999 (formality, §1.3) ·
Murphy/Notkin/Sullivan FSE 1995 (reflexion, §1.4) · Volar virtual-file model (§3.1) · Wagner & Graham
TOPLAS 1998 + Dubroy & Warth SLE 2017 (incremental reparse, §3.2) · iA Writer Markdown Annotations
v0.2 (validating SHA over range, §3.3) · Cambria PaPoC 2021 (read-time lens, §8) · Eg-walker EuroSys
'25 (§8) · gIBIS TOIS 6(4) 1988 (nine-relation ceiling, §10) · Zouhar et al. ACL Findings 2023 (BPE,
§12.1).

---

# PART V — LIVE STATE (fresh, at write time 2026-07-30)

**`frontmatter` repo:** branch `engine/plan-and-diagnostics` · HEAD `ae81971` · no upstream tracking.
Recent: `ae81971` §1.1a re-anchoring · `57411a1` §11a block-identity · `33d1b3c` §12 token-cost · `58322f7`
fix(vault,graph) index code + report unresolved · `5ff90a4` markdown-map + engine plan v0.2 · `8eb4de2`
Firebase + Tauri + rebrand. **Remotes:** `origin studiozephyrus/frontmatter`, `sagnik-old
sagnikmitra/frontmatter`. **Untracked (NOT mine — do not bundle):** `HANDOFF-mdz-markdown-format-2026-07-29.md`,
`arx.xml`, `cx.html`. **This handover file itself is untracked and unpushed.**

**`knowledge` repo:** HEAD `464eb66`; the two committed-pending video notes above present; video-3
note intentionally absent (captured here).

**graphify baseline:** 3,848 nodes · 3,737 edges · 340 communities · 0 tokens · built_at_commit
`464eb666`.

**§13 bug status:** both **FIXED** in `58322f7` (Part III.D); PLAN.md §13 text stale.

---

# PART VI — VERIFIED vs UNVERIFIED LEDGER

**VERIFIED (checked against a file / primary source this session):** video metadata & transcript;
the agent-graph vs knowledge-graph distinction (video description); "graph engineering = community
term, patterns from Building Effective Agents 2024" (web); Chrome Headless Shell; Simplify + Code
Review built-in; graphify's node/edge schema, relation vocabulary, and counts; the `frontmatter` repo
existence, structure, remotes, HEAD, and PLAN.md contents; the §13-bugs-fixed finding.

**UNVERIFIED (asserted, not independently checked — check before acting):** a distinct built-in
"Verify" skill; Anthropic's own "Code Review + Simplify + Verify + Design" 4-way chain (video claim);
whether the editor-side AI-review orchestrator (II.E.12) is genuinely absent from
`FRONTMATTER-PRODUCT-PLAN.md`/`src/modules/ai*` (NOT read); any performance number quoted from the
video; the `@lezer/markdown` "9.06× faster" figure (PLAN itself marks it "unreplicated — indicative").

---

# PART VII — WHAT TO DO NEXT (ordered) + DO NOT RE-LITIGATE

**Do next (in order):**
1. **Read the canonical docs you have NOT read** before any build: `docs/FRONTMATTER-PRODUCT-PLAN.md`,
   `docs/FEATURE-GAP-REPORT.md`, `docs/mdmap/MAP.md`, `HANDOFF-mdz-markdown-format-2026-07-29.md`, and
   `src/modules/ai*`. This is the only way to confirm what in Part II.E.12 is actually additive.
2. **Fix the doc staleness:** update PLAN.md §13 to record both bugs fixed in `58322f7` (Part III.D).
3. **If pursuing the editor's AI-review UX:** implement II.E.12 as an *editor-track* feature, keyed to
   the confidence ladder (§4), judge on a strong model, lenses disjoint (LR#20) — only after step 1
   confirms it isn't already planned.
4. **For the engine:** follow **PLAN.md's own Phase 1** — the splice writer + blank-line-isolated
   carrier + re-anchor-on-every-write + the **in-place YAML splicer wedge (§1.5)** — verified by an
   **independent oracle** (PLAN §9 warns the current 100% byte-fidelity was produced by a check using
   the writer's own code path).
5. **Optional:** commit the two `knowledge` video notes; and decide whether to write a video-3
   knowledge-note or leave it captured here.

**DO NOT re-litigate (settled in PLAN.md §10 / measured in §12):** a new format; a new sigil; a large
typed-link vocabulary (nine is the ceiling); content-hash-only identity; base64 binary; polyglot ZIP;
"entropy floor"; "markdown is ~40% fewer tokens than HTML" (apples-to-apples 9.1%); rigid context
fingerprints (§1.1a — score context softly, never hash it); regenerating from the AST (TOPLAS 2007).
**Keep `docs/engine/PLAN.md` canonical. This handover does not supersede it — it complements it.**

---

*Authored via `sgnk-handover` (maximum-fidelity, no-skim). Nothing in this session was committed or
pushed. This file is untracked at the repo root; move/rename/push only on explicit instruction.*
