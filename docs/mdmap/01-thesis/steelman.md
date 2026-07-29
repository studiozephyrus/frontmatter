---
mdmap-node: 1
title: The steelman — the strongest case against building this
parent: MAP.md
status: written
---

# The steelman

Written to be persuasive, not to be knocked down. Each objection is followed by the
honest answer, and two of them are conceded.

## 1. "A long markdown file with headings beats every map you will build."

This is not a strawman. It is a paying Milanote customer explaining why they cancelled:
they concluded that *"a long markdown file with proper headings (and an outline on the
side)"* beat the board view for their actual work. An Obsidian user, unprompted: *"I'm
absolutely non-visual and have also disabled the graph view."*

**Answer:** partially conceded. For a *single* document, the outline wins and always will.
The map's claim is only about the **project** level — the relationships between hundreds of
documents, which an outline cannot express because an outline has exactly one axis. And
notably, `mdmap`'s primary artifact *is* a long markdown file with proper headings. The
picture is a projection of it, not a replacement for it. If the pictures were deleted
tomorrow, `MAP.md` and `mdmap check` would still be the useful half.

## 2. "The state of the art is ranked text, not pictures."

Aider's repo map — tree-sitter plus PageRank rendered as ranked text in a 1k-token budget —
is the 2026 answer to "show me this codebase." GitHub Next's circle-pack repo visualization
is **still labelled a prototype five years on**, and its connection layer was never built.
**Sourcetrail**, the most serious commercial attempt at interactive code-structure
visualization, was discontinued in September 2021. **CodeSee** was acquired and sunset.

**Answer:** conceded, and it reorders the roadmap. The text artifact ships first and is
what the agent consumes; the visual is a human affordance layered on top. The reason to
build the canvas is that **authoring** spatially is valuable — not that **viewing** a graph
is. Any plan that leads with pixels is wrong.

## 3. "Nobody will pay for this."

The demand corpus is blunt. PKM hobbyists are hostile to paying for graph features —
*"Organizing them into some (in case of roam, PAID!) system that you will probably not even
come back to? Procrastination."* And the graph carries active reputational cost:
*"productivity porn"*, *"low-effort posts for easy karma."*

**Answer:** correct for PKM, wrong for the actual buyer. The willingness-to-pay signal in
the corpus is entirely on the **developer / docs** side, and it comes with conditions
attached: *"I'm ready to pay for it"* … *"Ideally this would be a standalone app … that I
could run locally"* … *"I definitely want a sturdy legal agreement in place before I ship IP
off to someone's systems."* Those are requirements, not objections, and `mdmap` satisfies
them by construction: the map is a file in your repo, and nothing leaves your machine.
There is also one retained paying user of a shipping product in this exact category:
*"Codemaps especially — been using them for weeks and they're excellent."*

## 4. "You will not survive contact with a real vault."

Verified ceilings: Obsidian Canvas degrades at ~140 nodes on an M1 Max. Cytoscape gets 3
FPS at 3,200 nodes / 68,000 edges on Canvas2D, **10 FPS on WebGL**. Obsidian staff put the
graph's practical limit at 25,000 files, and a user on an RTX 4090 reports it freezing at
local-graph depth 1.

**Answer:** this is why the map is bounded and recursive rather than global. You never
render 4,000 nodes because no map ever contains 4,000 nodes. The 40-node canvas failure has
a known cause — mount/unmount churn at the viewport boundary — and a known fix
(`display:none` culling plus overscan). The scale problem is real for *global graph views*
and does not apply to an artifact designed to never be global.

## 5. "Auto-generated maps are worse than hand-drawn ones."

> "Personally I find automated diagrams are not that useful. You generally need to have some
> understanding of what's happening to know what to hide and collapse to tame the spaghetti."

> "No one, and I don't mean that in bad faith, wants to look at these diagrams."

**Answer:** agreed, and this is precisely the derived-only failure that
[[../02-evidence/graphify-hairball]] measures at 1.76%. `mdmap` does not auto-generate the
meaning. It auto-generates the *reality* — the file tree, the resolved link graph, the
ranking, the gaps — and asks a human to author the meaning on top. The reconciler is the
mechanism that lets those two layers coexist without one rotting.

## 6. "Publishing a spec is a fantasy."

`llms.txt` is well-designed, and Ahrefs measured **28% of 137,210 domains publishing a valid
one, with 97% of those receiving zero requests**. Google's John Mueller: *"it's comparable to
the keywords meta tag."* **JSON Canvas** — from Obsidian, MIT, genuinely good — has **two
apps with full support and five with partial, 28 months after 1.0**, with zero spec changes
in that time. `jsonresume/resume-cli` is archived.

**Answer:** the honest read is that a spec with no consuming implementation is a blog post.
So the order is inverted: ship the tool and the product first, publish the format only once
something real reads and writes it. And design for the failure case — a `MAP.md` that no
tool understands is still a readable markdown document with a nested list of links, which is
more than can be said for a `.canvas` file.

## 7. "Someone is already doing this."

`elvezjp/md2map` — *"converts markdown files into a semantic map (index + fragments) for AI
analysis/review"* — exists, pushed a week ago. **markmap** has 13,006 stars and 258,454 VS
Code installs. **Chorographia** is prototyping embeddings→UMAP→named semantic zones inside
Obsidian right now, and the reception is the most positive signal in the entire demand
corpus: *"Wow, this is exactly what I've been wanting!"*

**Answer:** md2map is at 6 stars and is index-only, no visual, no gaps. markmap is
single-document scoped — it renders one file's heading tree. Chorographia is the real one to
watch, and it is *derived-only* semantic clustering — the same category as graphify, which
means the same 1.76% risk. None of the three do the reconciler, and the reconciler is the
product.

## What would actually kill this

Stated plainly, so it can be checked later:

1. **A measured result showing a flat repo dump beats a structured map on real tasks.**
   Nobody has published a task-success delta in this category at all — not Aider, not
   Anthropic. That absence cuts both ways, and it is the largest hole in the case.
2. **Obsidian shipping typed edges + a gap report in core.** They already have the graph,
   the canvas, Bases, and the user base. This is a one-release move for them.
3. **Model context windows and retrieval getting good enough that the map is pure
   overhead.** Anthropic already says out loud: under ~200k tokens, skip the apparatus.
   That threshold moving up is a direct existential risk.
4. **Nobody authoring the semantic layer.** If in practice users only ever run the
   generator and never write an invariant, this collapses back into graphify.

Item 4 is the one to watch first, because it can be tested in a week with a single repo and
one honest look at whether anyone edited the file.
