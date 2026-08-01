# HANDOFF — frontmatter / MDZ "next-generation markdown" research + concept

**Written:** 2026-07-29 · **Repo:** `/Users/sagnikmitra/Desktop/GitHub/frontmatter`
**HEAD:** `8eb4de2` on `main` · **Nothing from this session is committed.**
**Supersedes:** nothing — this is the first handoff for this topic.
**Written by:** Claude Opus 5 (Claude Code), session `e98d6e0f-f1fc-42ab-b8fb-e4c972dbd687`.

> **READ THIS IN FULL BEFORE ACTING.** It is deliberately long. It is a no-skim,
> chronological record of a ~7.3M-subagent-token research effort across 39 completed
> research agents (plus 5 still in flight at write time). A "key points only" version
> would destroy the thing that makes it useful: the causal order, and the specific
> numbers that killed specific ideas.

---

## 0. Orientation — the ten things you must know before anything else

1. **The product is `frontmatter`** — a browser-first markdown editor (Next.js 16,
   CodeMirror 6, GitHub repo as the vault). It already exists and ships. This session was
   **not** about building it; it was about designing a *new capability* underneath it.
2. **Sagnik wants to invent a next-generation markdown.** Working names, in order of
   appearance: **MD3** → **MDZ** ("MD Zephyrus") → **markdown base / mdbase**. He has said
   explicitly that naming can be settled later.
3. **Nothing is committed.** `docs/mdmap/` (21 files, 16,906 words) is **untracked**. So is
   this file. HEAD is unchanged from session start.
4. **The headline research verdict: do NOT build a new markdown format.** Every format that
   added power lost. Evidence in §3.1. This is the single most important conclusion and it
   is well-supported.
5. **What IS unclaimed: the layer above the file** — a linker, diagnostics, a type checker
   for frontmatter, and durable block identity. That is a *compiler and an IDE*, not a format.
6. **A direct competitor was found:** `mdbase-dev/mdbase-spec`, shipped ~6 months ago, with
   a spec, CLI, LSP, Rust impl and Obsidian plugin. Details and the layering strategy in §3.4.
7. **The closest academic ancestor is 30 years old:** Software Reflexion Models (FSE 1995).
   It is *literally* this thesis. §3.7.
8. **5 research agents were still running when this was written.** Their results are NOT in
   this document. §6 lists them. Do not assume the research is complete.
9. **Two live bugs in the existing repo were found incidentally** and are NOT fixed. §5.2.
10. **`WebFetch` is blocked for the main loop** by a local taint gate that false-positived.
    §5.4. Route web research through read-only subagents.

---

## 1. Chronological walk

### 1.1 — Opening ask (session start)

Sagnik asked for a **"Markdown Map" / MD3** concept: one markdown file containing seven,
each containing ten or eleven, recursively; interconnected like Obsidian's graph; with
backlinks, a folder tree, and a visual/canvas surface that both a human and an AI could
read a whole project through. Verbatim framing he used: *"a map for the Markdowns, a work
area for the Markdowns, connected nets for the Markdowns, an intranet subnet for the
Markdowns."*

He also asked me to install and use **agent-reach** (`github.com/Panniantong/agent-reach`)
for internet research.

**Finding: agent-reach was already installed** — v1.5.0 at `/Users/sagnikmitra/.local/bin/agent-reach`,
skill at `~/.claude/skills/agent-reach/`. `doctor --json` showed reddit/twitter/bilibili/
xiaohongshu served by **OpenCLI** (browser session reuse), youtube by **yt-dlp**, github by
`gh` with status **warn (unauthenticated)**. Nothing needed installing. **[VERIFIED — ran the doctor]**

### 1.2 — Six research agents dispatched (round 1)

| agent | subagent tokens | tool uses | duration |
|---|---|---|---|
| graph-PKM prior art | 191,253 | 77 | 877,717 ms |
| markdown graph specs | 170,582 | 15 | 1,006,167 ms |
| AI/agent codebase maps | 214,326 | 74 | 917,883 ms |
| Reddit/HN pain sweep | 260,453 | 38 | 919,594 ms |
| canvas/whiteboard rendering | 201,732 | 95 | 1,021,984 ms |
| naming/trademark/domains | 126,496 | 53 | 703,140 ms |
| **total** | **1,164,842** | **352** | — |

**[VERIFIED — figures read from the task-notification usage blocks]**

### 1.3 — The measurement I ran myself, before the agents landed

Against Sagnik's own live system, `~/Desktop/GitHub/knowledge/graphify-out/GRAPH_REPORT.md`
(built from commit `464eb666`, 2026-07-23):

```
corpus     273 files · ~546,933 words
graph      3,848 nodes · 3,737 edges · 341 unique communities
of the 341:  329 are auto-named "Community 11" … "Community 339"
             12 human-named — 5 marked "(empty)", 1 a mangled heading-dump string
             → 6 usable labels out of 341 = 1.76%
artifacts  GRAPH_REPORT.md 141,837 B (~35k tok) · graph.json 3,414,569 B · graph.html 3,519,469 B
```

Reproduction commands are recorded in `docs/mdmap/02-evidence/graphify-hairball.md`.
**[VERIFIED — I ran the greps; the first estimate I published was wrong and was corrected by counting]**

This became the founding invariant: **a map must be smaller than the thing it maps.**

### 1.4 — Round-1 findings that shaped everything after

- **The intersection was empty and was vacated from both sides in 2026.** *Reflect Open*
  (MIT, 1.4k★, shipped 2026-07-14) — plain markdown source of truth, a CLI *"for scripts and
  agents"*, auto-installs an agent skill — **and ships no map view.** *IWE* (Apache-2.0,
  ~1.3k★) — a real markdown knowledge graph with LSP + CLI + MCP — **and zero visual surface.**
- **Obsidian's index ceiling is the type itself:** `resolvedLinks: Record<string, Record<string, number>>`
  — source path → target path → count. Headings and blocks are **not nodes**.
- Obsidian staff, verbatim: *"I don't think anything above 25K files is practical with a
  modern desktop computer."*
- **JSON Canvas frozen** — spec 1.0 dated 2024-03-11, zero spec changes in 28 months, 7 adopting apps.
- **Napkin.one switched off its desktop app 2026-06-30**, holding *"4.7 million ideas"* behind an email request.
- **Logseq made SQLite canonical.** The quote that reframed the whole project:
  > *"Not being able to use Claude or codex anymore to write or update pages is a real deal breaker for me."*
- **The demand-side kill-shot**, from r/ObsidianMD:
  > *"you make the links yourself, so the graph only ever shows you what you already know. it can't surprise you."*
- **And the reframe that saved it:**
  > *"The graph view isn't useful to show me what I **already did**, instead, it shows me what **I haven't done yet**."*
- **LLMs cannot traverse serialized graphs**: 5–20 node graphs, zero-shot — node count
  18.8–23.0%, edge count 10.2–15.0% (Talk like a Graph, arXiv 2310.04560).
- **BM25 97.8 Recall@2 vs SoTA embedders under 20 Recall@100** on identifier lookup (LIMIT, arXiv 2508.21038).
- **Lost-in-the-Middle**: 75.8% first / 53.8% middle / 63.2% last, closed-book baseline 56.1%.
- **Anthropic's CLAUDE.md exclude-list** names *"File-by-file descriptions of the codebase"*
  and *"Anything Claude can figure out by reading code."*
- **llms.txt measured failure**: Ahrefs, 137,210 domains — 28% publish one, **97% of those got zero requests**.

**[VERIFIED by the agents against primary sources; NOT independently re-checked by me except where noted]**

### 1.5 — Deliverable 1: `docs/mdmap/`

I wrote a 21-file, 16,906-word concept tree that **dogfoods its own format** — a root
`MAP.md` → 7 region maps → leaves. 81 nodes declared, 20 exist, 61 ghosts.

**A real event worth preserving:** the first version of the gap table in the root `MAP.md`
said "61 declared / 37 existing" from estimation. Counting gave **81 / 20**. The gap report
caught its own author on day one, and that correction is recorded in the file itself.

### 1.6 — Deliverable 2: the interactive artifact

Published: **https://claude.ai/code/artifact/3d22ae8a-2293-462a-b800-85d5f53a2309**
(**[VERIFIED at write time — HTTP 200]**). Source at
`<scratchpad>/mdmap-concept.html`. Three projections (tree/graph/canvas) over the real
`src/modules` tree, ghosts from the repo's own deferred list, a DOI focus slider, semantic
zoom, and a gap report. Survey-sheet visual treatment; orange is used **only** for missing things.

### 1.7 — Sagnik reframes: "take markdown itself to the next level"

He pivoted from *mapping* markdown to *extending* it. Framing: **MD1 = markdown, MD2 = MDX,
MD3 = ours.** He asked whether to buy **md3.in** ($20 / 3 years) and asked for research on
what markdown *is*, granularly.

Notable, and he was right to flag it himself: *"I know it shouldn't be the case but… I feel
always tends to a much creative concepts around the names."*

I verified **md3.in was AVAILABLE** via the authoritative RDAP bootstrap. **[VERIFIED]**
Note: a first RDAP attempt returned `000` (connection failure) and I re-ran it rather than
reporting the failure as an answer.

### 1.8 — Workflow 1 (`w3f3hmo9k`) — 17 agents

**Stats [VERIFIED from the completion notification]:** 17 agents, **3,155,872 subagent
tokens**, 954 tool uses, 3,042,489 ms (~51 min), 0 errors.

Journal: `~/.claude/projects/-Users-sagnikmitra-Desktop-GitHub-frontmatter/e98d6e0f-.../subagents/workflows/wf_b8d494a7-c15/journal.jsonl` (34 lines, 592 KB).
Full raw result: `<tasks>/w3f3hmo9k.output` (671,137 bytes).

**Its decisive findings — see §3 for the tables.**

### 1.9 — My own token measurement (independent of the agents)

Using tiktoken `o200k_base` in a venv at `/tmp/claude-501/md3venv/bin/python`, against real
images in the repo:

| asset | bytes | base64 tokens | tok/byte | gzip+b64 | base85 |
|---|---|---|---|---|---|
| `public/mdx-dark.png` | 12,844 | **9,031** | 0.70 | 7,029 | 10,362 |
| `public/favicon.png` | 4,601 | 3,822 | 0.83 | 2,884 | 4,181 |
| `public/markdown-bitmap.svg` | 21,944 | 19,002 | 0.87 | **1,313** | 21,171 |

Raw SVG as text: 21,944 B → **9,419 tokens** (0.429 tok/byte) — readable and editable by a
model. **[VERIFIED — I ran this; script at `<scratchpad>/md3tok.py`]**

Three agents independently landed at **0.90 tok/byte** for base64 across PNG, JPEG, random
bytes and brotli output. Five measurements, two tokenizer families, same answer — an
**entropy floor**, not an encoding choice.

### 1.10 — Sagnik's third brief: MDZ + the full technical wishlist

He named **MDZ** (MD Zephyrus) and listed: global component mapping, markdown-as-database,
frontmatter + Zod as an ORM, AST mastery (remark/rehype/Shiki/rehype-slug), Sandpack live
playgrounds, scrollytelling, Runme-style stateful shell sessions, WebContainers zero-build
web OS, **cross-file reactive state** (`config.md` defines `theme_color`, `dashboard.md`
uses it), a markdown **graph vector DB**, a local **agentic loop**, design tokens in
frontmatter, and **semantic self-healing**.

He also set the hard constraint: **everything must still render as plain markdown.**

### 1.11 — Workflow 2 (`w24o7rxuc`) — 14 agents

First launch **failed to parse** — a backtick inside a template literal. I rewrote the
script to a file, syntax-checked it, and relaunched via `scriptPath`. Script preserved at
`<scratchpad>/mdbase-wf.js` (44,797 bytes).

**Stats [VERIFIED]:** 14 agents, **2,693,995 subagent tokens**, 873 tool uses,
4,893,367 ms (~82 min), 0 errors.
Journal: `.../wf_9cc55917-109/journal.jsonl` (28 lines, 480 KB).
Raw result: `<tasks>/w24o7rxuc.output` (538,934 bytes).
Digest I built: `/tmp/claude-501/wf2-digest.txt` (250 lines).

### 1.12 — Sagnik shares three wireframes

1. **Landing page** — Google-Docs-style: search, blank-document + template row, existing-docs grid.
2. **Editor** — left tree (Proj → Folder → File, with `f+`/`F+`); centre editor with
   Live/Edit/Split/Read + formatting + download; bottom AI writing section (Gemini-style,
   on load only); right rail: **Document Outline, Tags & Bookmarks, Document HS (backlinks),
   Comments, Add F, KB Sh, AI Edit**; top: fm logo, menu icons, coloured tabs, share, search, profile.
3. **Pricing/stack** — Free/Pro/Max; stack card says **NextJS 14** (repo is on **16** — worth reconciling), GitHub/Frontmatter, Vercel, Firestore, G Auth & GH Auth.

**My structural observation, which he has not yet responded to:** the right rail *is* the
compiler's output — outline = symbol table, tags = tag index, backlinks = reverse-reference
index, comments = annotation overlay. **The missing panel is a Problems panel**, and without
it every diagnostic the format layer produces has nowhere to appear.

### 1.13 — Sagnik's current, unanswered ask

Verbatim, he asked for: *what kind of tool we can build — compiler or a tool around a
markdown parser*, *what the new format can be*, and specifically five things:

1. what he should do at this moment
2. what the next step should be
3. what the findings are
4. what the definite possible level of taking markdown to the next level is
5. what all things we can pass through markdown

**And he asked me to research the research papers first, before answering.**

### 1.14 — Six academic-literature agents dispatched

Ultracode was OFF by this point, so I used the Agent tool rather than a Workflow.

| agent | topic | status |
|---|---|---|
| `a3822aff54512c4cb` | document engineering, lens/BX theory, incremental computation | **returned EMPTY** — fanned out to sub-agents and returned a status note. 129,126 tok wasted. **Re-dispatched** as `a85861df032299832` with an explicit no-further-fan-out instruction. |
| `ae6c2adf6e707a101` | traceability & documentation drift | **DELIVERED** — 189,754 tok, 57 tools. See §3.7. |
| `a5e9afd27533ea899` | hypertext, Dexter, "Formality Considered Harmful" | **DELIVERED** — §3.14 |
| `ac5406e31b706148c` | ACM DocEng, 993-paper corpus | **DELIVERED** — §3.15 |
| `a44236913ed8316b8` | incremental computation, build systems | **DELIVERED** — §3.16 |
| `a53606060147b5261` | Formality Considered Harmful, full text | **DELIVERED** — §3.14 |
| `a4d8eb40d8ce5cecd` | FOHM, Trigg, gIBIS typed links | **DELIVERED** — §3.14 |
| `aa5f54dd83e062c49` | Dexter model, Halasz seven issues | **DELIVERED** — §3.14 |
| `a7c9d985624ab0386` | end-user programming, attention investment, notebooks | **STILL RUNNING** |
| `a6934717fa9769bee` | LLM document representation 2025-26, prompt-injection trust | **STILL RUNNING** |
| `afaf2a3a55a66d46b` | type theory, gradual typing, CUE lattices | **STILL RUNNING** |

**THREE AGENTS WERE STILL IN FLIGHT WHEN THIS WAS WRITTEN.** Their findings are not here.
Note the fan-out: several of these agents spawned their own sub-agents, which is why more
results arrived than were dispatched from the main loop.

---

## 2. Every scoring / measurement table produced this session

### 2.1 Format adoption vs power — the table that kills the "new format" idea

| format | backing | reach |
|---|---|---|
| **MDX** | Vercel, Next.js-native, 9,426,793 npm/wk | **3.07% of `.md` volume** (1 file in 33) |
| **Markdoc** | Stripe | **0.136%** (1 in 736) |
| **Obsidian `.base`** | Obsidian, 4.3M users | **0.028%** |
| **djot** | *by CommonMark's own author*, technically superior | **848 downloads/week** vs remark-parse's 44,612,912 = **52,610×** |
| **AGENTS.md** | *no schema at all* | **175,424 files on GitHub** |
| **SKILL.md** | two frontmatter fields | 44 cross-vendor clients; **Cursor ships `/migrate-to-skills` to deprecate its own format into it** |

### 2.2 Base64-in-markdown — five independent measurements

| source | measured tok/byte |
|---|---|
| my own (3 real repo images, o200k_base) | 0.70 – 0.87 |
| workflow-1 agent (PNG/JPEG/random/brotli) | 0.8966 – 0.9198 |
| workflow-1 second agent | 0.9101 |
| workflow-1 third agent | 0.920 |
| adversarial re-computation (600 B / 50 KB / 1 MiB) | 0.9033 – 0.9104 |

Consequences: a **200 KB JPEG = 93.1% of a 200K window**; **1 MB = ~944,000 tokens**.
A real Jupyter notebook (`jakevdp` line-plots tutorial) is **98.3% base64 by tokens —
227,352 tokens, 114% of a 200K window**.

### 2.3 Token efficiency — the "40% fewer than HTML" claim, six passes

| denominator | measured saving |
|---|---|
| markdown source → its own rendered HTML (apples-to-apples) | **9.1% aggregate** (4.9–23.7% per doc) |
| vs "semantically minimal" HTML | 17.0% / 19.1% / 20.4% (three agents) |
| vs raw served production HTML | **78.5% – 97.2%** |
| Cloudflare's own edge headers | 90.5% and 97.0% — **but its blog prose says 80% on the same URL** (8× denominator discrepancy) |

**A hostile fact-check found one agent's "41.8% — safe to publish" verdict WRONG** — its
baseline was 52–81% div soup. **The 40% claim should be dropped.** **[VERIFIED by re-computation]**

### 2.4 Video → markdown (Karpathy talk, 2,371 s, 13 chapters, 8,255 words)

| representation | tokens | ratio to cleaned transcript |
|---|---|---|
| raw auto-caption VTT | 173,762 | **18.38×** |
| **cleaned transcript** | **9,454** | 1.00× |
| + timestamps every 60 s | 9,485 | 1.003× |
| + chapter headings | 9,690 | 1.025× |
| naive per-pause diarization | 17,924 | 1.90× |
| LLM summary | 958 | 0.10× |
| **recommended (chapters + timestamps + keyframe OCR/caption)** | **18,814 – 20,547** | **1.99 – 2.17×** |
| native video to Gemini (~300 tok/s) | **711,300** | **75.24×** ($2.85/read) |

Keyframe as image = **1,196 visual tokens** vs **106.5** for its caption = **11.2×**.
OCR: tesseract at 0.18 s/frame, free; **94/158 frames (59%) yielded ≥5 real words.**

### 2.5 Graph / vector index, measured on frontmatter's own 78 files

- 2,602 nodes; **747 (28.7%) are headings, averaging 8.0 tokens**
- 1,172 nodes (45.0%) are under 20 tokens
- breadcrumb metadata costs **529% of content on heading nodes**, 23% on code, 10% on tables
- **85.0% of headings collide** with another heading in the vault (`self-review` ×22)
- embedding 1,855 leaf nodes with all-MiniLM-L6-v2 q8: **37.0 s** vs **75 ms** for MiniSearch = **493×**
- code + table nodes = **9.2% of nodes but 29.8% of content tokens** — and currently **invisible to search**

### 2.6 Drift detection — the academic ceiling (§3.7)

| system | measured |
|---|---|
| LSI on issue–commit tracing | **F1 0.003** |
| LDA | F1 0.005 |
| VSM | F1 0.219 |
| best BERT | **F1 0.612** (MAP 0.837) |
| JIT comment inconsistency, best neural | F1 80.9 — **on a deliberately 50/50-balanced dataset** |
| trivial `OVERLAP(C, deleted)` heuristic | **F1 68.0 — beats every post-hoc neural model (66.3–67.2)** |
| **DocPrism naive LLM** | **98% flag rate at 14% accuracy** |
| DocPrism engineered | flag rate 15%, **precision 0.62** (1,615 benchmarks) |

---

## 3. Findings, by decision they settle

### 3.1 Do not build a new markdown format — SETTLED
See §2.1. Every format that added power lost; the winners had no schema. **VERIFIED, multiple independent agents.**

### 3.2 "Markdown as a ZIP" is arithmetically dead as bytes — SETTLED
See §2.2. Also **CommonMark's reference implementation silently empties `data:` URIs to
`src=""`**, and line-wrapping base64 destroys the image syntax outright. The design that
survives is a **manifest + semantic sidecar + content-addressed blob**, not a container.

### 3.3 "MDX but polyglot" is not novel — SETTLED
**Org-babel**, *Journal of Statistical Software* 46(3), 2012, DOI 10.18637/jss.v046.i03.
An agent executed it live: **40 language backends in stock Emacs**, cross-block dataflow,
tangle-to-disk. Quarto is *not* polyglot within a document — it binds one kernel per file.

### 3.4 A direct competitor exists — ACT ON THIS
**`mdbase-dev/mdbase-spec`** — "Typed Markdown Collections Specification", **v0.3.0, 88
stars, 17 spec chapters**, org created 2026-01-30, **pushed 2026-07-28**. Ships a CLI, a
TypeScript impl, an **LSP**, a Rust impl, an Obsidian plugin, an agent skill, and
**mdbase.dev**. Its feature list is Sagnik's thesis nearly verbatim, **including the
plain-markdown constraint**.

**Their gap:** identity is **record-level** — one ULID in one file's frontmatter, digests
over resolved JSON Schema values. **No concept of a block.**
**Recommended strategy: layer, don't compete.** mdbase = record layer; frontmatter = node
layer above it. Ship as an mdbase-conformant editor and inherit their CLI/LSP/Rust/Obsidian
bridge. **This was found by accident** while checking domains — a weekly competitive sweep
should be a cron job.

### 3.5 Naming — MDZ is dead; the tool name is already right
- **MD3**: 142 of 142 npm packages = Material Design 3; 5,611 GitHub repos; `.md3` is the
  Quake III model extension; **and it collides with Sagnik's own Learned Rule #52**, which
  mandates Material Symbols (Material Design 3's icon set).
- **MDZ**: 1,610 GitHub repos, but 54% are personal initials — *scattered noise, not a brand*.
  **The killer is different**: `.mdz` is **already the established extension for a compressed
  markdown package**, with four live projects in exactly that slot (`wflixu/mdz` "Markdown
  Zip", `mdz-format/mdz`, `mdzip-project/mdzip-spec`, npm `@mdzip/editor` at 582/wk).
  **Clean as a word, polluted as a format — precisely backwards.**
- **Availability I verified myself:** npm `mdz` = HTTP 200 but **zero versions, no
  description** (an unpublished placeholder, modified 2026-05-18). `mdzephyrus`, `md-z`,
  `mdbase`, `markdownbase` all FREE on npm. PyPI `mdz` FREE, `mdbase` TAKEN. **All four
  `mdz.` TLDs TAKEN** (.dev/.in/.ai/.org). **`mdbase.in` FREE. `zephyrus.md` FREE.**
- **Recommendation: keep `frontmatter` as the tool name** — it is literally the name of the
  primitive the thesis rests on. `frontmatter.dev/.sh/.app/.tools` all free. **Ship no new
  extension; use a marker file** (`frontmatter.yaml`) like `package.json`/`Cargo.toml`.
- **Known collision, judged survivable:** Front Matter CMS (frontmatter.codes), a VS Code
  extension, 2,528★, pushed 2026-07-25.

### 3.6 The compiler thesis — SUPPORTED, with the primitive renamed
- **Front end is done and world-class.** On this repo's own 50 files: **0 of 18,260 mdast
  nodes lacked a position**; all **1,622 top-level blocks re-parse to the same node type**
  when sliced by their own offsets (100%).
- **What's missing is a LINKER and a persisted IR.** `unified-engine` is **854,059 weekly
  downloads against unified's 47,917,554 = 1.78%** → **98.2% of the ecosystem runs markdown
  as a single-file, no-build-system compiler.**
- **The primitive is misnamed.** Markdown *has* exact node identity — the byte offset,
  perfect on read. **It dies on write.**
- **Compilation unit = the FILE** (Sphinx `docname`, Marksman `Scope`, unified `vfile`, LSP
  `TextDocument`, git blob all converged independently).
- **Symbol = the heading, keyed `docId#slug`, scope-qualified** — 70 of 453 headings (15.5%)
  have a globally non-unique slug; **0 collided within a file**.
- **Marksman is NOT 60-70% of a language server.** Measured from source: 13 LSP handlers,
  **3 renameable element kinds**, 3 diagnostic kinds, 1 code action, no inlay hints, no
  folding, no formatting, no `willRenameFiles`, **zero frontmatter awareness**
  (`Cst.fs:410 | YML _ -> None`). **~35% of a navigation layer, ~10% of an IDE.**
- **IWE is the real baseline** — 1,338★, Rust, **v0.17.0 cut 2026-07-29**, with inlay hints,
  formatting, folding, extract/inline refactors, rename-with-link-update, CLI, MCP server,
  FS watcher (added 2026-07-26). **Its one hole: zero diagnostics.**
- **`@lezer/markdown` is 9.06× faster cold than remark** (45.34 ms vs 410.6 ms on 800 KB) and
  **423× faster on a single-keystroke edit** — and frontmatter already ships CodeMirror 6.

**THE UNCLAIMED FEATURE, precisely:** *nobody will tell you that `status: activ` is not in
your enum.* Frontmatter-as-typed-data at the language-server layer is empty — marksman drops
YAML, IWE has no diagnostics, VS Code's LS is CommonMark-scoped, mdbase is record-level only.

### 3.7 The academic ancestor — Software Reflexion Models (FSE 1995)
Murphy, Notkin & Sullivan; TSE 27(4) 2001; SIGSOFT Retrospective Impact Award 2011.

**Method:** a hand-authored high-level model + a source model extracted from code + an
**ordered, first-match-wins map** + a structure description. Partial maps are legal.

**Three arc types, no fourth:** **Convergence** (in both) · **Divergence** (in code, not in
the model) · **Absence** (in the model, not in the code).

**The Excel case study (IEEE Computer 30(8) 1997):**

| | |
|---|---|
| system | Microsoft Excel, **~1.2M lines of C**, ~400 files, ~15,000 functions |
| initial source model | **77,746 calls** |
| initial map | **170 lines**, written in a few hours |
| first model computed in | **20 minutes** |
| **first result** | **15 convergences, 83 divergences, 4 absences** — 61% of calls |
| final | model 16 entities / 114 interactions; map **1,425 entries**; 99.7% summarized |
| counterfactual | engineer estimated **up to two years** by other means; took four weeks |

**Four transferable lessons:** divergences outran convergences **5.5:1 on the first run**;
**61% coverage was still useful**; effort goes into the *map* (170 → 1,425, **8.4×**) not the
model; and TSE 2001's framing — the technique *"exploits, rather than removes, the drift
between design and implementation."* **A drift dashboard and a drift enforcer are different
products. Pick one.**

**Naming hazard:** the knowledge base already holds `paper-shinn-reflexion.md` (Shinn's LLM
self-reflection agent) — an unrelated concept that will collide if "reflexion" is used.

### 3.8 Drift detection — the false-positive problem IS the product
See §2.6. **Post-hoc detection without a diff is close to unsolved** — a trivial heuristic
beats every post-hoc neural model. Neural only wins when handed the **edit** (F1 77–81).
**Design implication: watch saves, not repos at rest.**
Also: **every benchmark in the field is balanced 50/50 by construction.** No
realistic-prevalence evaluation exists — a genuine open contribution.
And: **the "stale docs cause defects" correlation was never established.** Do not assert it.

### 3.9 What developers actually need from docs
- **Sillito et al., FSE 2006** — 44 question kinds in 4 groups. Q1 is *"Which type represents
  this domain concept?"*; Q4 *"Is there a precedent or exemplar for this?"*
- **Ko et al., ICSE 2007** — 17 devs, 21 information needs; **most-deferred = design and
  program behaviour — *why* code was written a particular way**, because the only source was
  an unavailable coworker.
- **Maalej & Robillard, TSE 2013** — 11,148 documentation units, 12 knowledge types;
  **"Purpose and Rationale"** is the type code cannot supply.
- **Aghajani et al., ICSE 2020** — 146 practitioners; **Information Content = 55%** of issues,
  split Correctness / Completeness / Up-to-dateness.

This maps exactly onto `docs/mdmap` invariant 8: *never restate what the code says.*

### 3.10 Execution layer — WebContainers is vetoed
`@webcontainer/api@1.6.4` is genuinely MIT **but is a 176.5 KB postMessage client that boots
an iframe at `https://stackblitz.com/headless`**. StackBlitz ToS caps paid plans at **500
WebContainer sessions/month**. **The real veto is COOP/COEP**: it requires
`Cross-Origin-Embedder-Policy: require-corp` on the *whole page*, which breaks GitHub
avatars and OAuth popups. **Sandpack is dead** (last commit 2025-02-14) and its
`@codesandbox/nodebox@0.1.8` dependency ships the **non-commercial Sustainable Use License**
that scanners miss (npm records it as `SEE LICENSE IN ./LICENSE`).

### 3.11 Self-healing — rung 3 already exists
**`deno check --doc README.md` type-checks a code block in a standalone markdown file**
against real TypeScript declarations (TS2561 with declaration site). **77.5% of the top 200
Rust crates ship compiled doctests** (155/200, 8,341 blocks). **Sybil** shares one namespace
across every fenced block in a `.md` — a schema break cascades to downstream blocks today,
in under 10 ms. **Build drift severity, not repair** — CCISolver detection F1 89.54% vs fix
success 65.33%.

### 3.12 Cross-file reactive state — take the linking, refuse the reactivity
It **has** shipped: Quarto does `import { x } from "./other.qmd"` today. But **Observable
Framework — built by the team that invented reactive notebooks — removed it**: only pages
declare reactive variables; cross-page sharing is plain non-reactive ES modules. marimo
allows only top-level functions/classes. Pluto has none.
**Excel is the counter-precedent**: cross-workbook links are its most notorious failure.
Panko: human inspection catches only ~**60%** of spreadsheet errors.
**Recommendation: build-time resolution (linking), not runtime reactivity.**

### 3.13 Content-as-data — the reference implementation is dead
**Contentlayer is dead**: README carries *"no longer maintained due to lack of funding"*,
last release v0.3.4 on 2023-06-29, last commit 2024-11-07 (a README edit). Cause documented
in issue #429 — Stackbit sponsored it, Netlify acquired Stackbit, sponsorship paused.
**The fork `contentlayer2` is also dead** (zero commits in 12 months) yet **out-downloads the
original 33,910 vs 18,978/wk** — ~52,888 weekly installs on 15-month-old code.
**Fumadocs won**: `fumadocs-mdx` at 999,697/wk = **82.6%** of the successor category. **All
three live successors are bus-factor 1.**
**The missing primitive, confirmed four times:** no schema library can tell a validator
*which file* it is validating. Velite **forked Zod wholesale** after PR colinhacks/zod#3023
was closed unmerged.

### 3.14 Hypertext — the field settled this in 1992, and the answer is uncomfortable

**Aquanet (Marshall, Halasz, Rogers, Janssen, Hypertext '91)** shipped *typed objects with typed
relations and user-defined schemas* — exactly the design being proposed here. **"Two Years before
the Mist" (Marshall & Rogers, ECHT '92)** is the postmortem on a 2-year, ~2,000-node project.
Verbatim from the primary text:

> *"we observed far less use of relations than we had anticipated… Instead of articulating how
> different types of objects were related, users conveyed implicit relational structures through
> the use of spatial layout."*

> *"the tool coerced us into prematurely schematizing our domain and committing ill-formed
> information and ideas to structure."*

**"Formality Considered Harmful" (Shipman & Marshall, CSCW 8(4) 1999)** generalises it. Thesis,
verbatim from the 1993/94 tech-report precursor: *"the cause of a number of unexpected difficulties
in human-computer interaction is users' unwillingness to make structure, content, or procedures
explicit."* **Four reasons, verified as exactly four section headings:** cognitive overhead · tacit
knowledge · premature structure · situational structure. **[VERIFIED — the agent diffed two copies
of the source and confirmed the published CSCW 1999 full text is NOT openly available; what was
read is the earlier tech report. A commonly-cited fifth reason, "cost/benefit asymmetry", is NOT a
heading in the text obtained — treat as unverified.]**

**The constructive answer, from the same author, with reported success:** *incremental
formalization* — **Shipman & McCall, TOIS 17(3) 1999**. Verbatim: *"users express information
informally and then the system aids them in formalizing it."* Requires the system to integrate
formal and informal representations and to **suggest** formalizations. Deployed across network
design, archaeological site analysis, and neuroscience education. **VIKI (ECHT '94)** is the
architectural expression: objects *"may evolve into types"*, with a **spatial parser** driving the
evolution.

**The counterweight, and it matters:** **Suthers (HICSS 1999)**, verbatim — *"by manipulating the
concepts used by a toolkit, it is possible to manipulate the distinctions attended to by learners."*
**Types are not neutral labels; they direct attention.** So types are worth *having* — just never
worth *demanding*.

**A hard measured ceiling on vocabulary size.** gIBIS (Conklin & Begeman, TOIS 6(4) 1988), from a
deployed 32-user / 2,091-node field trial, verbatim: *"In our application there are nine link
types, and the feeling is that we are near the limit of people's ability to reliably perform the
[color] mapping."* **Nine is the empirical ceiling for unaided type discrimination.** Trigg's 1983
dissertation has ~78 types; its genuinely useful contribution is the **top-level split: Normal links
relate substance, Commentary links relate a comment to what it comments on.**

**Dexter (Halasz & Schwartz, CACM 37(2) 1994)** gives the right anchoring abstraction and it is
directly applicable: an anchor is **(AnchorID — a stable handle the storage layer treats as opaque)
+ (AnchorValue — interpreted *only* by the within-component layer)**. That split is how a link
database points into content whose internals it does not understand. And Grønbæk & Trigg named the
exact failure mode this product will hit — their **"case 4"**: *"the anchor value is still legal but
out of date, as a result of 'unauthorized' editing of the surrounding text"*, and it is
**undetectable** by Dexter's own operations. That is block-reference breakage, described in 1992.

**Bernstein, "Patterns of Hypertext" (HT '98)**, verbatim: *"The apparent unruliness of contemporary
hypertexts arises, in part, from our lack of a vocabulary to describe hypertext structures."* Named
patterns: **Cycle, Counterpoint, Mirrorworld, Tangle, Sieve, Montage, Split/Join, Missing Link,
Feint.** A graph view that *detects and names a Tangle or a Missing Link* is doing what the field
asked for in 1998; a force-directed hairball is not.

### 3.15 ACM DocEng — the field that should own this stopped working on it

Corpus enumerated: **993 papers** (Semantic Scholar), cross-checked against DBLP's 984.

- **The structural core collapsed.** XML/schema/markup/transformation share of titles:
  **21.7% (2001–08) → 6.8% (2009–16) → 3.6% (2017–25).** NLP/ML rose 6.2% → 24.9%.
  The useful structured-document literature is **almost entirely 2001–2013**, and it *stopped*
  rather than concluded.
- **"markdown" appears in exactly ONE of 993 papers.** "asciidoc", "wikitext", "frontmatter",
  "YAML" appear **zero** times. *(Caveat: only 31% of records carry abstracts, so this is a lower
  bound.)*
- **Renear, Dubin, Sperberg-McQueen & Huitfeldt, "Towards a semantics for XML markup" (DocEng 2002,
  73 cites)** — unrefuted after 24 years, and the most important result here: DTDs specify **syntax**;
  there is **no mechanism for specifying the semantics of a vocabulary**. **A schema constrains
  shape, never meaning.** Typed frontmatter buys validity, not semantics.
- **Rönnau, Pauli & Borghoff (DocEng 2008)** — *"any insert or delete operations performed on the
  document are likely to affect all subsequent paths."* **Positional addressing of blocks provably
  breaks.** Their fix is context-aware fingerprints — the reference design for recovering identity.
- **Di Iorio, Peroni, Poggi & Vitali (DocEng 2012)** — across DocBook, TEI and bespoke publisher
  vocabularies the same **eleven structural patterns** recur (block, container, inline…), because
  requirements of use converge. **Empirical support for a small fixed block vocabulary; evidence
  against per-project schemas.**
- **Forward & Lethbridge (DocEng 2002, 311 cites — the #2 most-cited paper at a documents
  conference)** — documentation maintenance **rarely occurs**; practitioners want **automation of
  maintenance** and tools that derive knowledge from source, tests, and changes to both.
  **That is an argument for a compiler, made in 2002.**
- **Oliveira, Genevès & Layaïda (DocEng 2012)** — a schema-change severity taxonomy separating hard
  errors from **semantic changes that merely need surfacing**. **Design migration around three
  outcomes, not two.**
- **Thao & Munson (DocEng 2011)** — *version-aware documents*: versioning data **inside the file**,
  not in a sidecar. A real alternative for a git-backed product.
- **Piotrowski, "A Vision for User-Defined Semantic Markup" (DocEng 2019) — the only paper naming
  Markdown, with ZERO citations.** He argues lightweight languages *"only define very limited sets
  of generic elements"* and sketches user-defined semantics. **Nobody built it. The space is
  genuinely open** — the most encouraging single finding in this handoff.
- **Cautionary:** the "document product line" / feature-model variability line (Penadés 2010, Karol
  2010, Díaz 2009) has **~35 total citations and no surviving tooling.** If typed frontmatter grows
  conditional content, that *is* this work — understand why it didn't take before repeating it.
- **Lumley et al. (DDF, DocEng 2005) + Macdonald et al. (2007)** — the hard-won negative result:
  **layout interdependencies destroy most invariant blocks, and automatic discovery of invariants
  was never solved.** Assume incremental recompilation of a *document* is harder than of code.

### 3.16 Incremental computation — the theory that decides the architecture

**This section changes the engineering plan and should be read before any compiler work.**

- **"Build Systems à la Carte" (Mokhov, Mitchell, Peyton Jones, ICFP 2018)** gives the design space
  as **scheduler × rebuilder**: 12 cells, **8 inhabited** (Make, Excel, Ninja, Shake, CloudBuild,
  Bazel, Buck, Nix). **Pick a cell deliberately.**
  - **Recommended: suspending scheduler + verifying traces** — Shake's cell. It is the **minimum
    retained state that buys all three of {dynamic dependencies, minimality, early cutoff}**:
    per key, `(hash of each dependency, hash of result)`.
  - **Make's cell provably cannot do early cutoff.** Early cutoff is exactly what you want when
    someone fixes a typo and 400 files reference that document.
  - **Applicative tasks let you extract dependencies without running them; monadic tasks provably
    do not** (`Const` has no `Monad` instance). Cross-file reference resolution that decides what to
    read based on what it just read **is monadic** — which rules out a topological scheduler.
- **THE PROOF THAT BLOCK IDENTITY IS LOAD-BEARING.** *Incremental Computation with Names*
  (Hammer et al., OOPSLA 2015), verbatim: **structural (hash-consed) matching means Adapton
  *"recomputes and reallocates a linear number of output elements for each O(1) input change"*;
  nominal (named) matching *"need not rebuild the prefix."*** So: **content-hash identity ⇒ Θ(n)
  per edit; stable names ⇒ O(1)/O(log n).** Identity is an **asymptotic** requirement, not a nicety.
  This retires the "just content-address the blocks" idea that appeared repeatedly in earlier rounds.
- **Wagner & Graham (TOPLAS 1998)** — *"The central requirement for actual incremental behavior —
  balancing of lengthy sequences — has been ignored in all previous approaches."* A flat block
  sequence gives **O(n) for edits at the beginning or end** no matter how good the engine.
  **Unbounded sequences must be stored as balanced trees.**
  **And the escape hatch that breaks it applies directly to Markdown:** the guarantee fails when
  *"the interpretation of the yield of a sequence depends on its context"* — which is exactly setext
  headings, lazy continuation, link reference definitions, and fence state. **This is the single
  most concerning theoretical result for a markdown compiler.**
- **Incremental packrat parsing (Dubroy & Warth, SLE 2017)** — invalidation must key on what a rule
  **examined**, not what it **consumed** (`examinedLength`). **A naive "invalidate overlapping
  ranges" rule is silently wrong** for a language with unbounded lookahead. Markdown is such a
  language. Measured: reparse after a keystroke **mean 6.2 ms**, ~12% memory overhead.
- **Ramalingam & Reps (TCS 158, 1996)** — a proven hierarchy separating **polynomially bounded,
  inherently exponentially bounded, and unbounded** problems. **Some problems cannot be made cheap
  per-edit no matter how much state you retain.**
- **The cost of incrementality, measured:** self-adjusting computation is **4–10× slower on the cold
  build** to be **~1000× faster on update**. Adapton is **1.5–3.5× slower** than traditional IC when
  *all* output is demanded. You are always trading cold-build time for warm-edit time.
- **Reps (POPL 1982)** — the target to aim at: attribute-grammar update **cost proportional to the
  set of affected attributes, which is not known a priori.**

**One-line synthesis from this literature:** minimum viable retained state is
*(per block key) → (stable name, hash of each dependency, hash of result)*, over a
**partially-ordered** demanded-computation graph, with unbounded sequences stored as **balanced
named trees**. Every one of those four components has a paper proving that dropping it costs an
**asymptotic** factor, not a constant.

---

## 4. Live numbers — gathered fresh at write time

```
branch            main
HEAD              8eb4de2  feat: Firebase backend foundation, product docs, Tauri shell, frontmatter rebrand
git status        ?? arx.xml
                  ?? cx.html
                  ?? docs/mdmap/
                  (.env.example: Operation not permitted — sandbox, not a repo issue)

docs/mdmap/       21 files · 16,906 words · UNTRACKED
  01-thesis       declares 11, exists 7,  ghosts 4
  02-evidence     declares 11, exists 1,  ghosts 10
  03-spec         declares 11, exists 2,  ghosts 9
  04-views        declares 11, exists 3,  ghosts 8
  05-agent        declares 10, exists 0,  ghosts 10
  06-product      declares 11, exists 0,  ghosts 11
  07-open         declares  9, exists 0,  ghosts 9
  TOTAL           81 declared · 20 exist · 61 ghosts · coverage 0.247

node              v24.6.0   (.nvmrc says 24)
next              ^16.2.6   (NOTE: the pricing wireframe's stack card says "NextJS 14")
artifact          https://claude.ai/code/artifact/3d22ae8a-2293-462a-b800-85d5f53a2309 → HTTP 200

research spend    45 completed agents · ~8,472,445 subagent tokens
  round 1         6 agents  · 1,164,842 tok ·  352 tools
  workflow w3f3hmo9k  17 agents · 3,155,872 tok · 954 tools · ~51 min
  workflow w24o7rxuc  14 agents · 2,693,995 tok · 873 tools · ~82 min
  academic (8 done)          · 1,457,736 tok · 421 tools
    (of which one, a3822aff, returned EMPTY — 129,126 tok wasted on a fan-out
     that reported status instead of findings; it was re-dispatched)
  3 MORE AGENTS STILL RUNNING at write time
```

---

## 5. Things found that are NOT fixed

### 5.1 `docs/mdmap/` is untracked and unreferenced
Nothing tracked links to it. It will be invisible to anyone who clones. **[VERIFIED — grep found no references]**

### 5.2 Two live bugs in the existing repo, both found incidentally, both UNFIXED
- **`src/modules/vault/infrastructure/search-index.ts:59` deletes every fenced code block
  before indexing**, and keys the index on file path. Code + table nodes are 9.2% of nodes
  but **29.8% of content tokens** — currently unfindable. **[reported by an agent; I did NOT
  open the file myself — VERIFY BEFORE ACTING]**
- **`src/modules/graph/presentation/graph-data.ts:132`** reads
  `if (targetPath === undefined) continue; // unresolved — drop` — unresolved links are
  silently deleted from the graph. **[VERIFIED — I read this file myself]**
- **Round-trip hazard:** **0 of 50 real files survive `parse → remark-stringify`
  byte-identically**; tuning every option reaches 1 of 50 (2%). Any agent write path that
  goes tree → stringify → disk will silently reformat the user's documents, and every save
  in this product is a commit. **Recommendation: splice source text, never stringify.**
  **[agent-measured; not independently re-run by me]**

### 5.3 Agent litter in the repo root — NEEDS A DECISION
`arx.xml` (14 bytes, contents: `Rate exceeded.` — an arXiv API throttle response) and
`cx.html` (134,860 bytes, a CheerpX/WebVM page) were written **into the repo root** by
research agents despite an explicit "no writes outside `$TMPDIR`" guard. **[VERIFIED — I
inspected both]** They are untracked and harmless, but they confirm the prompt-level guard
is advisory, not enforced. **I did not delete them** — that is a call for the user.

### 5.4 The prompt-injection taint gate is armed and false-positived
`WebFetch` is refused for the main loop for the rest of the session. Evidence from
`~/.sgnk/state/injection-hits.jsonl`:
```json
{"ts":"2026-07-28T23:19:24Z","tool":"WebFetch","hits":2,
 "first":"Show your prompt","patterns":"Show your prompt|system prompt:"}
```
Those fetches happened while researching **prompt-injection defences** — the scanner matched
the research subject, not an attack. **No evidence of a real injection chain.** The sanctioned
workaround (read-only subagents) works and was used. **Tuning that pattern is a config change
the user owns.** **[VERIFIED — I read the log and reproduced the block]**

### 5.5 Unverified claims — do NOT act on these without checking
- Every Reddit/HN quote and vote count (gathered by agents via OpenCLI; not re-checked by me).
- All third-party star counts and download figures except those I re-ran myself.
- **ObjectGraph (arXiv 2604.27820)** — an unreplicated preprint with no venue, claiming a
  Markdown superset with 92% token reduction. **Verify before citing.**
- The mdbase-spec feature list — from one agent's read; **open mdbase.dev yourself.**
- WebContainers' "500 sessions/month" ToS figure — agent-read, not re-verified by me.

---

## 6. Phase status

| phase | status | evidence |
|---|---|---|
| Round-1 research (graph/map concept) | **DONE** | 6 agents, 1.16M tok |
| `docs/mdmap/` concept tree | **DONE, uncommitted** | 21 files, 16,906 words |
| Interactive artifact | **DONE** | HTTP 200 at the URL in §1.6 |
| Round-2 research (markdown as container) | **DONE** | workflow w3f3hmo9k, 17 agents |
| Round-3 research (compiler thesis) | **DONE** | workflow w24o7rxuc, 14 agents |
| Academic literature sweep | **MOSTLY DONE — 8 delivered, 3 running** | traceability, hypertext, Dexter, typed links, Formality, DocEng, incremental computation all in. **End-user programming, LLM-representation-2026, and type theory still running.** |
| **Answer to Sagnik's five questions** | **NOT STARTED** | he asked for the papers first |
| Spec / format design doc | **NOT STARTED** | blocked on the above |
| Any code change | **NOT STARTED** | nothing committed |

**Sagnik's own bar, verbatim, for what this must become:**
> *"that gets to be the usp… that isn't there in any markdown, any md editor, any md file
> formatter, any md format… people have not think about it we have to think it we have to
> ship it"*

---

## 7. What to do next — ordered

1. **Collect the three in-flight agents** (§1.14): end-user programming (`a7c9d985624ab0386`),
   LLM-representation-2026 (`a6934717fa9769bee`), type theory (`afaf2a3a55a66d46b`).
   The first could still change the recommendation — if Blackwell's attention-investment model
   says what §3.14 predicts, the type layer must be **inferred and proposed, never declared.**
2. **Answer Sagnik's five questions** (§1.13). He is waiting on exactly this. Do not start
   with a spec — he asked for the strategic answer first.
3. **Do NOT re-litigate these — they are settled with evidence:**
   - a new markdown format / new file extension (§3.1)
   - base64 binary inside markdown (§3.2)
   - "MDX but polyglot" as a novel idea (§3.3)
   - MD3 and MDZ as names (§3.5)
   - WebContainers as the execution layer (§3.10)
   - runtime cross-file reactivity (§3.12)
   - **content-hash-only block identity** — §3.16 proves it is Θ(n) per edit; you need *names*
   - **demanding that users declare schemas or typed links up front** — §3.14, settled in 1992
   - **a large typed-link vocabulary** — nine is the measured ceiling (§3.14)
4. **Open `mdbase.dev` and read the spec yourself** before any format work. §3.4.
5. **Decide the fork Murphy names:** drift **dashboard** vs drift **enforcer**. §3.7.
6. **Verify the two repo bugs in §5.2** and fix if confirmed. These are free wins independent
   of the whole format question.
7. **Decide whether to commit `docs/mdmap/`.** It is 16,906 words of work that currently
   exists only in an untracked directory on one machine.
8. **Clean or keep `arx.xml` / `cx.html`** (§5.3) — user's call.
9. **Consider tuning the taint-gate pattern** (§5.4) so `system prompt:` doesn't nuke
   WebFetch on every security paper.
10. **Set up a weekly competitive sweep** — mdbase was found by accident. A GitHub search over
    `markdown` + (`spec`|`typed`|`collection`|`frontmatter schema`) run weekly would have
    caught it six months earlier.

---

## 8. Open questions Sagnik has NOT answered

1. **Dialect or project convention?** New capabilities in the file (erasing to plain
   markdown), or plain `.md` + a marker file + a build tool? *My recommendation: the latter.*
2. **Compiler as a library, or a standalone CLI?** *My recommendation: library first, IDE as
   its first consumer, CLI a month later.*
3. **Reach out to IWE and mdbase, or route around them?** IWE has everything except
   diagnostics; frontmatter has diagnostics and an editor.
4. **Is `frontmatter` the final tool name**, dropping MDZ entirely?
5. **Drift dashboard or drift enforcer?** (§3.7)

---

## 9. Where the raw material is

```
Session scratchpad (huge — ~200 files of raw research, PDFs, HTML, measurement scripts):
  /private/tmp/claude-501/-Users-sagnikmitra-Desktop-GitHub-frontmatter/e98d6e0f-f1fc-42ab-b8fb-e4c972dbd687/scratchpad/
    mdmap-concept.html     the published artifact source
    mdbase-wf.js           workflow-2 script (44,797 B)
    own-findings.md        my own round-1 measurements
    md3tok.py              the base64 token measurement
    pdfs/ (26)  txt/ (22)  academic PDFs harvested by the traceability agent

Full un-truncated workflow results:
  <session>/tasks/w3f3hmo9k.output   671,137 B   (workflow 1, 17 agents)
  <session>/tasks/w24o7rxuc.output   538,934 B   (workflow 2, 14 agents)
  /tmp/claude-501/wf2-digest.txt     250 lines   (my digest of workflow 2)

Workflow journals (one JSON result line per agent):
  ~/.claude/projects/-Users-sagnikmitra-Desktop-GitHub-frontmatter/e98d6e0f-.../subagents/workflows/
    wf_b8d494a7-c15/journal.jsonl   34 lines, 592 KB
    wf_9cc55917-109/journal.jsonl   28 lines, 480 KB

Concept tree (untracked):
  /Users/sagnikmitra/Desktop/GitHub/frontmatter/docs/mdmap/
```

**Note:** `/private/tmp/` and `/tmp/claude-501/` are session-scoped and may be cleaned by the
OS. If the raw research matters, copy the scratchpad somewhere durable before it disappears.

---

*End of handoff. Written 2026-07-29 against HEAD `8eb4de2`. Five research agents were still
running when this was written; their findings are not included.*
