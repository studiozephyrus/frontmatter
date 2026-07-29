---
mdmap-node: 1
title: Why now — and why the window is narrow
parent: MAP.md
status: written
---

# Why now

Four things became true in the last twelve months. None of them were true when Obsidian
shipped its graph view, and together they are the entire case for timing.

## 1. Agent-writable plain files became a purchase criterion

Logseq made SQLite canonical and demoted markdown to a one-way read-only mirror. The
reaction from its own users is the most commercially load-bearing sentence in the research:

> "**Not being able to use Claude or codex anymore to write or update pages is a real deal
> breaker for me.**"

> "Yep not moving to DB version, whole point of using this is the org-mode files also work
> in emacs. If its locked in a DB its no use."

Two years ago "plain files" was an ideological preference. It is now a functional
requirement, because the files are how your agent reaches your work. That reframes the
whole plain-text argument from purity to capability.

## 2. Both halves shipped separately, in the same quarter

- **Reflect Open** — 2026-07-14, MIT, 1.4k★: plain markdown as source of truth, a CLI
  *"for scripts and agents"*, and an auto-installed agent skill at
  `~/.agents/skills/reflect-<graph>/SKILL.md`. **No map view of any kind.**
- **IWE** — Apache-2.0, ~1.3k★: a real markdown knowledge graph with LSP, CLI, and MCP,
  claiming *"retrieval by structure, not similarity guessing."* **No visual surface at
  all.**

Two capable teams each built one half and neither built the other. That is what an empty
intersection looks like from the inside, and it will not stay empty.

## 3. The incumbents vacated

In roughly nine months: Logseq demoted its markdown build to maintenance-only. **Dendron**
— which had the best structural model in the category, dot-notation hierarchy validated by
a `schema.yml` — put *"active development has ceased"* in its README. **Napkin.one**
switched off its desktop app on 2026-06-30 and holds *"4.7 million ideas"* behind an email
request. **Tana** repriced around AI meetings and 308-redirects its knowledge-graph page to
a legacy subdomain. **TiddlyMap** declared itself unmaintained. **Juggl** has been dormant
since 2023. **JSON Canvas** has gone 28 months without a spec change.

Meanwhile the demand did not go anywhere: Craft doesn't ship a graph, so it awarded its
hackathon **Grand Prize** to a third party who built one. Notion doesn't ship one, so it
sustains a five-repo cottage industry of API scrapers plus a paid Gumroad product.

## 4. The economics of the expensive approach got settled — against it

Anyone building this in 2024 would have reached for GraphRAG. The numbers are now in and
they are decisive: **$389.12 to index HotPotQA versus $0.75 for hybrid search**;
**331,375 tokens per global query** versus vanilla RAG's ~879; and on questions with
checkable answers it *loses*, HotpotQA F1 **45.16 against 60.04**. Microsoft's own
LazyGraphRAG then shipped at *"0.1% of the costs of full GraphRAG."*

The cheap path is now the known-good path: tree-sitter or a markdown parser, PageRank,
`git log`, and a token budget. All free, all offline, all deterministic. That was an open
question eighteen months ago.

## Why the window is narrow

**Obsidian can close it in one release.** They have the graph, the Canvas format, Bases,
and the users. They already ship three non-interoperating structure surfaces; unifying them
with typed edges and a gap report is an obvious move for them and a fatal one for anyone
else.

**Chorographia** is prototyping the semantic half inside Obsidian today, and its reception
is the strongest positive signal in the corpus: *"Wow, this is exactly what I've been
wanting!"*

**And the substrate keeps improving underneath.** Anthropic already says plainly that under
~200,000 tokens you should skip retrieval entirely and put the whole corpus in the prompt.
Every increase in that threshold shrinks the set of projects for which a map is worth
building.

The honest read: this is an 18-month window, the differentiator is the reconciler rather
than the picture, and the thing to ship first is the cheap text artifact — not the canvas.
