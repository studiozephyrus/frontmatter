#!/usr/bin/env python3
"""Build the sgnk-format research dossier as a paginated A4 HTML document."""
import base64, pathlib, subprocess, sys

S = pathlib.Path("/private/tmp/claude-501/-Users-sagnikmitra-Desktop-GitHub-frontmatter/2e90ab3b-4a90-4362-bce4-042a842a2af5/scratchpad")
REPO = pathlib.Path("/Users/sagnikmitra/Desktop/GitHub/frontmatter")

FONTS = (S / "fonts.css").read_text()
CSS = (S / "doc.css").read_text()
DARK, LIGHT = (S / "logos.txt").read_text().split("\n@@@\n")

DOC_TITLE = "THE MARKDOWN ENGINE"
REV = "REV 1.0"
ORG = "SGNK · SAGNIK MITRA"


def lock(light=False):
    return '<div class="lock"><div class="wm">sgnk</div></div>'


def header():
    return (f'<div class="hd">{lock()}'
            f'<div class="hd-r"><div class="l1">{DOC_TITLE}</div>'
            f'<div class="l2">RESEARCH DOSSIER <span>· {REV}</span></div></div></div>')


def footer(n):
    return (f'<div class="ft"><span>{ORG}</span>'
            f'<span class="c">INTERNAL · ENGINEERING RECORD</span>'
            f'<span class="p">PAGE <b>{n:02d}</b></span></div>')


def sec(num, title):
    return f'<div class="sec"><span class="n">{num}</span><h2>{title}</h2><span class="r"></span></div>'


def page(n, num, title, body):
    return f"""<section class="page">
<div class="pad">{header()}{sec(num, title)}
<div class="body">{body}</div>
{footer(n)}</div></section>"""


# ─────────────────────────── PAGE 02 ───────────────────────────
TOC = [
    ("01", "The problem, and why it is not a format problem", "02"),
    ("02", "What we researched", "03"),
    ("03", "How markdown actually works", "04"),
    ("04", "How the industry does it", "05"),
    ("05", "What we found", "06"),
    ("06", "Taking markdown to the next level", "07"),
    ("07", "Defining our own representations", "08"),
    ("08", "frontmatter as the first renderer", "09"),
    ("09", "Fusing into the AI OS", "10"),
    ("10", "The plan, the benchmarks, the open questions", "11"),
]

STATS = [
    ("RESEARCH SCALE", "~14M", "subagent tokens · ~90 agents · 20 experiments"),
    ("ANCHOR ACCURACY", "99.63%", "correct, at 0.050% false match"),
    ("CORPORA", "4,400+", "real markdown files, three vaults"),
    ("NEW FORMAT", "None", "the file stays ordinary .md"),
]

stats_html = "".join(
    f'<div class="stat"><div class="k">{k}</div><div class="v">{v}</div><div class="d">{d}</div></div>'
    for k, v, d in STATS)
toc_html = "".join(
    f'<li><span class="n">{n}</span><span class="t">{t}</span><span class="pg">{p}</span></li>'
    for n, t, p in TOC)

P02_BODY = f"""<p>Markdown does not need a new syntax. It needs a <strong>compiler</strong> — something that
can point at a paragraph today and still find that paragraph after an editor, an agent, a formatter and
a colleague's <span class="mono">git pull</span> have each rewritten the file.</p>
<p>That is the whole thesis, and every number in this document was measured rather than assumed. Where
the research overturned our own earlier position, the correction is recorded in place.</p>
<div class="stats">{stats_html}</div>
<div class="toc-h">Contents</div>
<ul class="toc">{toc_html}</ul>"""

PAGES = [
    ("00", "At a glance", P02_BODY),

    # ── 01 ──
    ("01", "The problem, and why it is not a format problem", """
<p>A markdown file is a <strong>string</strong>. Every tool that touches it hands back a
<em>different string</em> with no record of what changed. So nothing in the file can be referred to
twice: a comment thread, a backlink, an outline entry, a cross-file link to a heading — each is a
pointer into text that will move, and nothing can say where it went.</p>
<p>Every serious document system solved this. Each solved it using a property we do not have.</p>
<table class="tw-22">
<thead><tr><th>System</th><th>Anchor</th><th>Survives outside edit</th><th>Why it works for them</th></tr></thead>
<tbody>
<tr><td>Word</td><td>zero-width sentinel pairs</td><td class="blue"><strong>yes</strong></td><td>the artifact is XML; an invisible marker is free</td></tr>
<tr><td>Notion</td><td>a UUID on the block</td><td class="blue"><strong>yes</strong></td><td>the artifact is a database</td></tr>
<tr><td>Overleaf</td><td>offsets in an OT sidecar</td><td><strong>no</strong></td><td>they own <em>every</em> write to the file</td></tr>
<tr><td>ProseMirror / CM6</td><td>offsets through a change map</td><td><strong>no</strong></td><td>the remap needs the op that caused the change</td></tr>
</tbody></table>
<p>Overleaf is the only published system with our exact constraint — the artifact must stay a plain
text file another tool can read — and it survives only by owning every mutation. <strong>We cannot.</strong>
A <span class="mono">git pull</span> yields a new string with no op stream. A <span class="mono">vim</span>
edit yields no op at all.</p>
<p class="pull">So the thing to invent was never a syntax. It is an anchor that survives the git boundary.</p>
<div class="call"><b>The starting point.</b> This began as <span class="mono">mdz</span> — a brief for a
next-generation markdown. Measurement moved the conclusion twice. The final position is narrower, and
far more defensible: the format is fine, the tooling is missing.</div>"""),

    # ── 02 ──
    ("02", "What we researched", """
<p>Roughly <strong>14M subagent tokens across ~90 research agents</strong>, ~20 local experiments and a
six-area utilization sweep, against three real corpora: <span class="mono">md</span> (4,117–4,244 files),
<span class="mono">knowledge</span> (272–410) and the product repo (52).</p>
<p><strong>Every headline number was re-derived in the main loop before being written down.</strong>
Several agent claims failed that check and were corrected rather than quietly fixed — including two of
our own.</p>
<table class="tw-22">
<thead><tr><th>Area</th><th>Question</th><th>Method</th></tr></thead>
<tbody>
<tr><td><strong>Anchoring</strong></td><td>can a block keep identity across edits?</td><td>384-config sweep, 41,642 block-versions, 294 real revision pairs, every error hand-audited</td></tr>
<tr><td>Round-tripping</td><td>can source be regenerated from an AST?</td><td>CommonMark spec analysis + full-corpus round trip</td></tr>
<tr><td>Carrier</td><td>where does an anchor physically live?</td><td>1,765 blocks × 6 carrier designs</td></tr>
<tr><td>Container</td><td>can many files live inside one <span class="mono">.md</span>?</td><td>7 delimiter designs × round-trip survival</td></tr>
<tr><td><strong>Extensibility</strong></td><td>can markdown absorb new constructs?</td><td>5 agents briefed to argue <em>for</em> extension, against our own prior</td></tr>
<tr><td><strong>Notation</strong></td><td>can a model read a declared syntax?</td><td>4 notation arms × read / write / edit-under-load, 1,200 judgments</td></tr>
<tr><td>Demand</td><td>what do people actually want?</td><td>6,047-plugin catalogue, 132.8M downloads, forum + VS Code cross-checks</td></tr>
<tr><td>Constructs</td><td>what is markdown actually made of?</td><td>frequency census over 42,643 files</td></tr>
<tr><td>Security</td><td>what breaks on hostile input?</td><td>76 payloads × 9 renderers = 684 DOM-verified runs</td></tr>
<tr><td>Accessibility</td><td>what can an automated checker see?</td><td>axe-core over 2,286 rendered files</td></tr>
<tr><td>i18n</td><td>what breaks outside English?</td><td>4 engines × CJK, Bengali, Arabic, Hebrew, Thai, Khmer</td></tr>
</tbody></table>
<div class="call"><b>Method note.</b> Five findings overturned positions this project had already written
down as settled — including "no new extension mechanism", "rigid context fingerprints", and "markdown
merges worse than code". A plan that never contradicts itself was never tested.</div>"""),

    # ── 03 ──
    ("03", "How markdown actually works", """
<p>The pipeline is what makes the design decisions obvious rather than arbitrary.</p>
<div class="flow">
<div class="fl"><span class="k">source</span><span class="v">.md text</span></div><span class="fa">→</span>
<div class="fl"><span class="k">block pass</span><span class="v">paragraphs, lists, fences</span></div><span class="fa">→</span>
<div class="fl"><span class="k">inline pass</span><span class="v">emphasis, links, code</span></div><span class="fa">→</span>
<div class="fl b"><span class="k">AST</span><span class="v">mdast — the tree</span></div><span class="fa">→</span>
<div class="fl"><span class="k">transform</span><span class="v">hast — HTML tree</span></div><span class="fa">→</span>
<div class="fl"><span class="k">render</span><span class="v">HTML string</span></div>
</div>
<p>Markdown parses in <strong>two passes</strong> — block structure first, then inline markup inside each
block. That is why <span class="mono">**bold**</span> cannot span a paragraph break, and why a fence's
contents are invisible to every inline rule. <strong>The arrow into the AST is one-way.</strong>
Everything after it is a projection.</p>
<h3>The AST is lossy, and it is provable</h3>
<p>Foster et al. (TOPLAS 2007, Lemma 3.9) prove a total well-behaved lens whose <span class="mono">put</span>
ignores the original source requires <span class="mono">get</span> to be a bijection. "Regenerate from the
AST" is definitionally such a lens. What that costs, measured:</p>
<table class="tw-40">
<thead><tr><th>Measurement</th><th>Result</th></tr></thead>
<tbody>
<tr><td>CommonMark spec examples that are two <em>distinct sources</em> with an identical AST</td><td class="num">443 of 655</td></tr>
<tr><td>Lines rewritten by a zero-edit round trip of a real 206 KB document</td><td class="num">24.98%</td></tr>
<tr><td>Bytes dropped by that same round trip</td><td class="num">18.94%</td></tr>
<tr><td>Files surviving <span class="mono">parse → stringify</span> byte-identically</td><td class="num">0 of 51</td></tr>
</tbody></table>
<p><span class="mono">mdast-util-to-markdown</span>'s own documentation says it plainly:
<em>"complete roundtripping is impossible."</em> Hence the first invariant — <strong>splice, never
regenerate.</strong></p>
<div class="call dark"><b>And the tree is closed.</b> A <span class="mono">.md</span> file carries a finite
ordered tree over a <strong>closed 21-label alphabet</strong> with string leaves. It cannot carry types,
identity, null, or <strong>any edge that is not parent–child</strong>. That is the tree/graph boundary —
not a syntax gap a dialect could close.</div>"""),

    # ── 04 ──
    ("04", "How the industry does it", """
<table class="tw-22">
<thead><tr><th>Approach</th><th>Who</th><th>Mechanism</th><th>Outcome</th></tr></thead>
<tbody>
<tr><td>Superset <em>with</em> a runtime</td><td>MDX</td><td>JSX inside markdown, compiles to JS</td><td>3.07% of <span class="mono">.md</span> volume. <strong>Cannot write the document back out.</strong></td></tr>
<tr><td>Superset, no runtime</td><td>Markdoc (Stripe)</td><td><span class="mono">{% tag %}</span></td><td>0.136%. Byte-identical <span class="mono">format()</span>.</td></tr>
<tr><td>Clean-slate redesign</td><td>djot (jgm)</td><td>a new grammar fixing markdown's ambiguities</td><td>693/wk vs remark's 45.7M — a <strong>65,990×</strong> gap</td></tr>
<tr><td>Directive plugin</td><td>remark-directive</td><td><span class="mono">:::name</span> generic blocks</td><td>6.95% of remark — the only extension at scale</td></tr>
<tr class="hi"><td><strong>Fence dispatch</strong></td><td>mermaid, and ~everyone</td><td>match the info string, replace the node</td><td><strong>30 platforms, zero coordination</strong></td></tr>
<tr><td>Sidecar file</td><td>Obsidian</td><td><span class="mono">.canvas</span> / <span class="mono">.base</span></td><td>shipped twice, for the two hardest gaps</td></tr>
<tr><td>Compile to a lock file</td><td>GitHub Agentic Workflows</td><td><span class="mono">workflow.md → .lock.yml</span></td><td>in production, 2026</td></tr>
</tbody></table>
<h3>Three lessons, pointing the same way</h3>
<p><strong>New dialects do not win.</strong> djot has CommonMark's own author and is invisible. The
reason is not quality — markdown's value <em>is</em> its universality, and a dialect forfeits exactly that.</p>
<p><strong>Fence dispatch wins because it costs nothing.</strong> CommonMark, verbatim: <em>"Although this
spec doesn't mandate any particular treatment of the info string, the first word is typically used to
specify the language."</em> That refusal to define semantics <em>is</em> the extension point. A renderer
matches one string and replaces the node; every non-participating tool degrades to a code block.</p>
<div class="call dark"><b>And the sobering one.</b> Faced with its own largest format gap — Dataview, 4.65M
downloads — Obsidian did not extend markdown. It shipped <span class="mono">.base</span> (YAML) and
<span class="mono">.canvas</span> (JSON, whose <span class="mono">edges</span> are directed, labelled and
typed). The two things markdown provably cannot express each got a non-markdown sidecar. The
best-resourced actor in the ecosystem concluded markdown was the wrong place. Section 08 answers that.</div>"""),

    # ── 05 ──
    ("05", "What we found", """
<h3>The anchor works</h3>
<table class="tw-40">
<thead><tr><th>Scheme</th><th>Correct</th><th>False match</th><th>Safe refusal</th></tr></thead>
<tbody>
<tr><td>byte offset</td><td class="num">36.93%</td><td class="num">62.12%</td><td class="num">0.95%</td></tr>
<tr><td>block index</td><td class="num">44.43%</td><td class="num">55.50%</td><td class="num">0.08%</td></tr>
<tr><td>content hash alone</td><td class="num">83.36%</td><td class="num">0.00%</td><td class="num">16.64%</td></tr>
<tr><td>rigid context fingerprint (k=1/2/3)</td><td class="num">90.7 / 88.7 / 87.2%</td><td class="num">0.25%</td><td class="num">9–13%</td></tr>
<tr class="hi"><td><strong>ours — anchorable blocks only</strong></td><td class="num"><strong>99.627%</strong></td><td class="num"><strong>0.050%</strong></td><td class="num"><strong>0.323%</strong></td></tr>
</tbody></table>
<p>~41 ms for a 446 KB, 2,225-block document. All 14 false matches were <strong>hand-audited, not
sampled</strong>: 4 oracle artifacts, 6 a bulk migration, 3 list drift, 1 a table rewrite. Genuine
substantive errors: <strong>10 in 28,170 = 0.036%</strong>. Three results overturned our earlier design —
rigid fingerprints get <em>worse</em> as the window grows, chunking is the wrong granularity, and
<strong>every position-based tiebreak made things dramatically worse</strong> (0.00% → 22.20% false).</p>
<p class="pull">Refusing is cheap. A silently wrong anchor is not.</p>
<h3>What the demand data says</h3>
<p>6,047 Obsidian plugins, 132,834,339 downloads. Classifying the top 300 — 83.9% of all demand — by
<em>what kind of gap</em> each fills: <strong>FORMAT 40.1%</strong>, app 31.0%, external 19.5%,
render/ergonomics 9.4%. Two-fifths of revealed demand is markdown failing to express something, and the
app column is <em>smaller</em> — the opposite of "markdown is fine, the apps are limited." It replicates
on three populations sharing no mechanism: plugins 40.1%, forum requests 39.0%, VS Code 35.4%.</p>
<div class="call"><b>The causal proof is Logseq.</b> Its format natively has block IDs, properties and a
query language. Obsidian has <b>70 spaced-repetition plugins; Logseq has 2</b>, and both are merely Anki
bridges. Query 46 vs 20. Tasks 149 vs 30. Kanban — which neither format helps — 63 vs 6. Logseq is a
<em>worse app</em>, yet every cluster matching a native format feature is <b>10–35× smaller</b>. When the
format absorbs a capability, the plugin ecosystem for it collapses.</div>
<div class="call dark"><b>The wedge.</b> Obsidian's <span class="mono">processFrontMatter</span> strips
quoting, <b>deletes YAML comments outright</b> and destroys type tags. Their own type declaration is
<span class="mono">{ [key: string]: any }</span> — every property in every note, in the market leader, is
<span class="mono">any</span>. Demand ratio 2,300×. They have publicly declined to fix it.</div>"""),

    # ── 06 ──
    ("06", "Taking markdown to the next level", """
<p>The answer to <em>"why can't we have folder trees, self-including files, new representations?"</em> is
<strong>we can — through dispatch, never through new syntax.</strong> There are exactly four channels.</p>
<table class="tw-22">
<thead><tr><th>Tier</th><th>Channel</th><th>A dumb viewer sees</th><th>Proven by</th></tr></thead>
<tbody>
<tr><td>1</td><td><strong>frontmatter</strong></td><td>nothing</td><td>universal — TOML is 0 of 42,643 files; YAML is the only vocabulary</td></tr>
<tr><td>2</td><td><strong>fence info string</strong></td><td>a normal code block</td><td>30 uncoordinated platforms render mermaid</td></tr>
<tr><td>3</td><td><strong>HTML comment</strong></td><td>nothing</td><td>nodejs/node ships 4,310 <span class="mono">&lt;!-- YAML</span> instances</td></tr>
<tr><td>4</td><td><strong>derived, never stored</strong></td><td>—</td><td>graphs, outlines, site maps</td></tr>
</tbody></table>
<h3>What must never happen: spending a sigil</h3>
<p>Markdown has ~32 punctuation extension points. From jgm: <em>"Guaranteeing that any extension is
compatible with any other one is not feasible, as two extensions may want to interpret the same character
for two different purposes."</em> That is <strong>character-namespace exhaustion</strong> — resource
exhaustion, not governance. And it is live today: Spaced Repetition's card separator is
<span class="mono">::</span>; Dataview's inline field is <span class="mono">key:: value</span>. Two top-50
plugins, same two characters, colliding right now.</p>
<h3>What should fuse, ranked by measured demand</h3>
<table class="tw-40">
<thead><tr><th>Primitive</th><th>Install weight</th><th>Our channel</th></tr></thead>
<tbody>
<tr><td>embedded freehand graphics</td><td class="num">8.79M</td><td>fence + opaque payload</td></tr>
<tr><td>task semantics beyond a checkbox</td><td class="num">8.54M</td><td>frontmatter vocabulary</td></tr>
<tr><td>a queryable relation over documents</td><td class="num">7.22M</td><td><strong>resolver</strong>, not syntax</td></tr>
<tr><td>templating / computed content</td><td class="num">7.16M</td><td><strong>out of scope — that is a runtime</strong></td></tr>
<tr class="hi"><td><strong>typed links</strong></td><td class="num">820 likes · #1</td><td>resolver + manifest</td></tr>
<tr class="hi"><td><strong>multi-file composition</strong></td><td class="num">449 + 174 · unbuilt</td><td>container + transclusion</td></tr>
</tbody></table>
<p>The last two matter most because they are <strong>supply-starved</strong> — enormous demand, near-zero
supply. That is the signature of a gap a plugin <em>cannot</em> close. A board can be faked by overloading
headings; a typed link needs <em>the link itself</em> to carry the relation.</p>
<div class="call"><b>The MDX lesson is a warning, not a template.</b> MDX <b>cannot write the document back
out</b> — arbitrary JavaScript does not losslessly re-serialize. For a product that edits and saves that is
disqualifying, independent of market share. Take MDX's ambition; refuse MDX's mechanism.</div>"""),

    # ── 07 ──
    ("07", "Defining our own representations", """
<p>The proposal was a paired marker — something like <span class="mono">``X`` … ``X``</span> — meaning
"this is an image", or a table, with only the frontmatter knowing what it means.
<strong>The instinct is right. One detail decides whether it works.</strong></p>
<div class="two">
<div class="cd"><div class="h">What fails</div><p><strong>Inventing a new delimiter in prose.</strong>
It spends a non-renewable resource, collides with the ~8 incompatible dialects already in the wild, and —
critically — <strong>fails silently</strong>. The model writes <span class="mono">~ doing</span> instead of
<span class="mono">~doing</span>, the renderer does not match, and the field vanishes. The document still
looks like a document. Nothing throws.</p></div>
<div class="cd b"><div class="h">What works</div><p><strong>Declaring a vocabulary inside a construct that
is already opaque.</strong> A fence and a code span are <em>inert everywhere</em> — every markdown tool on
earth already renders them literally and refuses to interpret their contents. Put the notation there and
degradation is guaranteed by the spec, not by luck.</p></div>
</div>
<pre>---
fm:vocab:
  due:                                    # carried by an inline code span
    examples: ["`due:2026-08-01`", "`due:friday`"]
  figure:                                 # carried by a fence
    examples: ["```fm:figure\\nsrc: a.png\\ncap: Fig 1\\n```"]
---

Ship the migration `due:2026-08-01` before review.</pre>
<p>Open that file anywhere else and you see inline code and a code block — nothing breaks, nothing is
lost, no tool errors. Open it in frontmatter and the compiler binds <span class="mono">due</span> to a date
type, checks it, indexes it, and projects it into the graph.</p>
<h3>Three rules govern this, all measured</h3>
<table class="tw-30">
<thead><tr><th>Rule</th><th>Evidence</th></tr></thead>
<tbody>
<tr><td><strong>1 · Declare by EXAMPLE, never by rule</strong></td><td>Aycock et al. ablated MTOB: <em>"almost all improvements stem from the book's parallel examples rather than its grammatical explanations"</em> — and flatly, <em>"no evidence that long-context LLMs can make effective use of grammatical explanations."</em></td></tr>
<tr><td><strong>2 · Cap the vocabulary in single digits</strong></td><td>IFScale, 20 models: <em>"even the best frontier models only achieve 68% accuracy at the max density of 500 instructions."</em> Plus primacy bias — the declaration sits where compliance is highest, the constructs fire where it is lowest.</td></tr>
<tr><td><strong>3 · The renderer is the write gate</strong></td><td>Constrained decoding coverage on complex schemas: Guidance 41%, llama.cpp 39%, XGrammar 28%, Outlines 3%. Validate-and-repair gets the same guarantee at no distribution cost.</td></tr>
</tbody></table>
<div class="call dark"><b>The measurement that decides the operating point has not been made.</b> Every
number above is Opus-class, five constructs, declaration in immediate context. The model that will actually
write into a user's file is smaller and faster, and every published curve says that is precisely where
format adherence collapses. <b>This establishes a ceiling, not an operating point.</b></div>"""),

    # ── 08 ──
    ("08", "frontmatter as the first renderer", """
<p>The honest answer is better than lock-in: <strong>exclusivity comes from capability, not
captivity.</strong> The files stay portable on purpose — that is what makes them safe to adopt, and
safety is the acquisition mechanism.</p>
<div class="two">
<div class="cd"><div class="h">The same bytes, in any other tool</div><p>Renders as ordinary markdown. The
notation is inert text. Nothing breaks, nothing is lost, no tool errors.</p></div>
<div class="cd b"><div class="h">The same bytes, in frontmatter</div><p>The compiler reads the declaration,
binds and type-checks the constructs, keeps block identity across every edit, and projects graph, outline
and site.</p></div>
</div>
<h3>Why the capability gap is durable</h3>
<table class="tw-30">
<thead><tr><th>Property</th><th>Why nobody else has it</th></tr></thead>
<tbody>
<tr><td><strong>Identity is the moat</strong></td><td>A sidecar can add expressiveness — Obsidian proved it twice. A sidecar <strong>cannot</strong> give identity across an out-of-band edit. That needs the compiler.</td></tr>
<tr><td><strong>The editor sees the save</strong></td><td>Drift detection without a diff is near-unsolved — a trivial heuristic scores F1 68, beating every post-hoc neural model at 66–67. Handed the edit, neural reaches 77–81.</td></tr>
<tr><td><strong>The wedge is publicly refused</strong></td><td>Competitors do not accidentally close a gap they have declared they do not want to close.</td></tr>
<tr><td><strong>Markdown-aware diagnostics</strong></td><td>axe-core fires 7 of 105 rules on markdown; 98.5% of violations are page chrome. We found <span class="mono">remark-math</span> swallowing prose between two <span class="mono">$</span> signs in 20 of 272 files — <strong>zero</strong> axe violations.</td></tr>
</tbody></table>
<h3>The acquisition strategy — the mermaid playbook</h3>
<p>You cannot force adoption of a portable format, and trying is what kills formats. What you <em>can</em>
own is being <strong>the reference implementation of something everyone wants</strong>. Mermaid is the
proof: the syntax was free, nobody was forced, GitHub adopted it, and 30 platforms followed. The
<em>spec</em> was the giveaway; the <em>tooling</em> was the product.</p>
<div class="flow">
<div class="fl"><span class="k">1 · publish</span><span class="v">a page the engine rendered — rich, correct</span></div><span class="fa">→</span>
<div class="fl"><span class="k">2 · curiosity</span><span class="v">"the source is plain markdown — how?"</span></div><span class="fa">→</span>
<div class="fl"><span class="k">3 · zero-risk trial</span><span class="v">their vault still opens everywhere</span></div><span class="fa">→</span>
<div class="fl b"><span class="k">4 · the CLI</span><span class="v">check in their CI — value with no editor</span></div><span class="fa">→</span>
<div class="fl b"><span class="k">5 · the editor</span><span class="v">the only place identity and drift exist</span></div>
</div>
<div class="call"><b>How to read it.</b> Steps 1–3 are <b>free and open</b> — the format degrades, so trying
costs nothing and leaving costs nothing. That is what makes people willing to start. Steps 4–5 are where
the compiler is <em>required</em>, because identity-across-edits and save-time drift cannot be
reimplemented by someone merely reading the file. Publishing benchmark B1 is the accelerant.</div>"""),

    # ── 09 ──
    ("09", "Fusing into the AI OS", """
<p>This is the part with the least friction, because <strong>the AI OS is already markdown-native</strong>
— and currently runs on <em>unchecked</em> markdown.</p>
<table class="tw-30">
<thead><tr><th>AIOS surface</th><th>Today</th><th>With the engine</th></tr></thead>
<tbody>
<tr><td><span class="mono">SKILL.md</span> × ~200 skills</td><td>YAML frontmatter, no schema, no validation</td><td>pass 3 types it; <span class="mono">frontmatter check</span> gates skill authoring</td></tr>
<tr><td><span class="mono">CLAUDE.md</span> + Learned Rules</td><td>append-only prose, rules cited by number</td><td>block identity — a rule keeps its anchor when the file is edited</td></tr>
<tr><td>memory <span class="mono">*.md</span> + index</td><td><span class="mono">[[wikilinks]]</span> resolved by convention</td><td>pass 4 resolves them; a dangling link is a diagnostic, not a silent drop</td></tr>
<tr><td>knowledge base, 4,200+ notes</td><td>graphify rebuilds a graph out-of-band</td><td>pass 5 <em>is</em> the graph builder — incremental, at save time</td></tr>
<tr><td>trace ledger <span class="mono">*.jsonl</span></td><td>JSONL rows</td><td>engine diagnostics emit as trace rows — the loop gets format signal</td></tr>
<tr><td>snapshot / recall cards</td><td>hand-written <span class="mono">.md</span></td><td>splice-safe writes; the UTF-8 truncation class disappears</td></tr>
</tbody></table>
<h3>The sharpest fit is a bug class already on the record</h3>
<p><strong>Learned Rule #59</strong> records three instances of a producer writing one field name and a
consumer reading another — <span class="mono">tokens_in</span> vs <span class="mono">input_tokens</span>,
<span class="mono">pass</span> vs <span class="mono">assertion_pass</span> — each silently publishing a
wrong number for weeks, because a missing key coerces to a falsy default that is indistinguishable from a
real negative. <strong>That is exactly what a typed interface pass catches at author time.</strong></p>
<p class="pull">The engine enters at the data layer. Never at the routing layer.</p>
<p>Sequencing is already prescribed by the system's own rules. <strong>Rule #43</strong> — build in
hierarchy order, so the engine lands on traces and validated skill frontmatter before anything touches
routing. <strong>Rule #38</strong> — nothing goes dev→live: offline eval, then shadow, then promote.
<strong>Rule #20</strong> — parallel work must operate on disjoint artifacts, which the per-file compiler
model satisfies by construction.</p>
<div class="call"><b>What it buys the loop.</b> Today the orchestrator's own substrate — skills, memory,
rules, knowledge — is the one part of the system with no type checking, no link resolution and no
identity. Every other layer has gates. Applying the compiler to <span class="mono">.md</span> closes the
last unchecked surface, and it does so with a CLI that needs no editor and no product decision.</div>"""),

    # ── 10 ──
    ("10", "The plan, the benchmarks, the open questions", """
<pre>1  parse       .md → AST + byte positions       incremental
2  identify    mint / recover block anchors     ← the invention
3  interface   frontmatter → module signature   schema INFERRED, never demanded
4  resolve     bind every cross-reference       unresolved = diagnostic, never a silent drop
5  index       symbol table + reverse index     → outline, tags, backlinks
6  check       schema · links · drift           → the confidence ladder
7  project     outline · graph · site · tokens  never stored</pre>
<table class="tw-22">
<thead><tr><th>Phase</th><th>Ships</th><th>Kill-gate</th></tr></thead>
<tbody>
<tr><td><strong>1 · core/</strong></td><td>splice writer, anchors, <strong>the YAML wedge</strong></td><td>100% byte-fidelity on untouched regions, 50 files, verified by an <strong>independent oracle</strong></td></tr>
<tr><td><strong>2 · resolve/check/</strong></td><td>linker, symbol table, <span class="mono">frontmatter check</span></td><td>per-class precision across 4,117 files</td></tr>
<tr><td><strong>3 · schema/</strong></td><td>infer → propose → accept</td><td>false-positive rate on a corpus <em>verified human-authored</em>; above ~0.4 users disable it permanently</td></tr>
<tr><td><strong>4 · pack/unpack</strong></td><td>container + edit-mapping back to source</td><td>byte-identical unpack, per-file digests</td></tr>
<tr><td><strong>5 · reconciler</strong></td><td>prose ↔ code drift</td><td>tier I only at first</td></tr>
</tbody></table>
<h3>Benchmarks — pass what exists, publish what does not</h3>
<table class="tw-30">
<thead><tr><th>Layer</th><th>Target</th></tr></thead>
<tbody>
<tr><td>CommonMark 0.31.2 + GFM suites</td><td>100%, non-negotiable</td></tr>
<tr><td>Differential fuzz vs <span class="mono">cmark-gfm</span></td><td>zero unexplained divergences</td></tr>
<tr><td>DoS corpus — <span class="mono">remark-parse</span> is quadratic and <strong>crashes on 20 KB of nesting</strong>; markdown-it does it in 12 ms</td><td>depth cap + wall-clock budget, in a worker</td></tr>
<tr class="hi"><td><strong>B1 · anchor durability</strong> — six baselines already measured</td><td><strong>the moat play. Publish with a runner and a leaderboard.</strong></td></tr>
<tr class="hi"><td><strong>B2 · splice fidelity</strong></td><td>100%, permanent CI gate</td></tr>
<tr class="hi"><td><strong>B6 · renderer security</strong> — already built and live</td><td>55 payloads, DOM-verified, fails 28/55 against an unprotected pipeline</td></tr>
</tbody></table>
<div class="call"><b>The rule governing every benchmark.</b> A benchmark whose subject is a rare fault
proves nothing until it reproduces the fault. A green suite is the expected result of running it, not
evidence of correctness. Every gate must be shown to <em>fail</em> against the unfixed implementation
before its pass is reported.</div>
<h3>Open — and honest</h3>
<p>The notation result is <strong>Opus-class only</strong>; the production-model measurement is unmade.
The schema-inference corpus was <strong>voided</strong> by its own verifier (27.2% vendored, 24.4% LLM
output). Multi-block moves are <strong>simulated</strong>; the merge path is <strong>untested</strong>.
Three decisions are open: the CRDT architecture conflict, whether the notation ships at all, and ten
verified bugs in shipped editor code.</p>
<div class="call dark"><b>The risk, recorded rather than buried.</b> Obsidian, holding every advantage,
looked at these same gaps and shipped sidecar files twice. Our differentiator is <b>identity across
edits</b> — which a sidecar cannot provide — not expressiveness, which a sidecar provides perfectly well.
If we ever compete on expressiveness we have lost, because <span class="mono">.canvas</span> already won
that fight.</div>"""),
]

# ─────────────────────────── ASSEMBLE ───────────────────────────
pages_html = []
for i, (num, title, body) in enumerate(PAGES):
    pages_html.append(page(i + 1, num, title, body))

html = f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>sgnk — the markdown engine · research dossier</title>
<style>
{FONTS}
{CSS}
</style></head><body>
{"".join(pages_html)}
</body></html>"""

out_html = S / "dossier-print.html"
out_html.write_text(html)
print(f"html: {out_html}  {len(html)/1024:.0f} KB  pages: {len(pages_html)}")

# ─────────────────────────── RENDER ───────────────────────────
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
out_pdf = REPO / "docs/engine/sgnk-markdown-engine-dossier.pdf"
prof = S / "chrome-profile"
cmd = [CHROME, "--headless", "--disable-gpu", "--no-sandbox",
       f"--user-data-dir={prof}",
       "--no-pdf-header-footer", "--print-to-pdf-no-header",
       f"--print-to-pdf={out_pdf}", f"file://{out_html}"]
r = subprocess.run(cmd, capture_output=True, text=True, timeout=180)
if out_pdf.exists():
    print(f"pdf:  {out_pdf}  {out_pdf.stat().st_size/1024:.0f} KB")
else:
    print("RENDER FAILED", r.returncode); print(r.stderr[-2000:]); sys.exit(1)
