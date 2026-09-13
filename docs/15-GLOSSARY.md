---
mode: reference
updated: 2026-09-09
verified_against: 6331b1b
---

# Glossary

> **Method.** Every entry below was written from the file it names — `cert-contract.ts` read in
> full, the other 12 files of `src/modules/mdmax` read as file header plus exported signatures
> plus every measured figure they cite. I also read
> `src/modules/share/domain/splice-frontmatter.ts` (roughly half, plus all exports), the domain layers of
> auth, repository and vault, `specs/_schema/states.md`, `specs/engine/nf-001-zero-indent-sequence.md`,
> `specs/render/carrier.md`, `AGENTS.md`, `package.json`, and `docs/PRODUCT-BRIEF.md` §§1–9. Where
> a term's definition is a number, I ran the command that produces it and say so.
>
> **What this pass did NOT do.** It did not open the six large documents `docs/MAP.md` routes
> away from (`FRONTMATTER-PRD-v2`, `FRONTMATTER-RECORD`, `FRONTMATTER-COMPLETE-RECORD`,
> `ENGINE.md`, `CRITIQUE.md`, `DEV-PLAN.md`) beyond single `grep -n` hits, so a term those
> documents define more precisely is defined here as the code uses it. It did not read
> `src-tauri/`, the presentation layer of any module line by line, or any `.env` file. It did
> not attempt to define terms that appear only in the market sections of the brief.

Terms specific to this codebase are marked **[repo]**. Terms from the wider markdown, git or
TypeScript world are given only where a newcomer would otherwise stall.

---

### anchor **[repo]**
A stored reference to a place in a document, hashed rather than positional, so it can be
relocated after the document changes. The hash input is fixed by `normalize/1`. No anchor is
persisted anywhere in `src/` yet — the machinery exists, the store does not.

### AGENTS.md
The repository's operating rules for any agent editing it (221 lines). Accurate at `e318ab3`.
Its four overriding rules are: red proof before green; refuse rather than guess; re-derive every
number at write time; agents propose, the founder merges.

### barrel **[repo]**
A module's `index.ts`, its only public surface. `AGENTS.md` §2 requires cross-module imports to
go through `@/modules/<name>` and never through a deep path. `src/modules/mdmax` has no barrel,
which is why its two call sites deep-import.

### bench, bench id **[repo]**
The set of pinned renderers a certificate is measured against
(`src/modules/mdmax/infrastructure/bench.ts`). The bench id is a SHA-256 over every engine's
**full** option set, not just its version. The reason is recorded in the file: `kramdown-parser-gfm`
defaults `hard_wrap` on where Jekyll sets it off, and on `Line one\nLine two` that is the
difference between `<p>Line one<br />\nLine two</p>` and `<p>Line one\nLine two</p>` — so a
certificate recording only "kramdown 2.5.2" would mark every soft line break in every document
as a false MUTATE.

### block skeleton **[repo]**
Every block-level node's type, with heading depth, depth-first, inline content excluded. The
comparison unit of the placement fixture. If inserting a marker changes the skeleton, the
insertion is refused.

### BOM
U+FEFF, the byte-order mark. Legal as the first character of a UTF-8 file and invisible in every
editor. `splice-frontmatter.ts` splits it off before matching the front-matter fence and
re-attaches it afterwards; without that the fence never matched at index 0 and the file's real
front matter was pushed into the body while a new block was prepended.

### budget — three different things **[repo]**
Ambiguous in this repo, so all three:

1. **`npm run budget`** — the bundle budget. It is currently `echo 'No bundle budget configured
   yet — skipping'`. Defect 5 in the brief's fix-first list.
2. **`BUDGET_MS`** in `shape-gate.ts` — time budgets in milliseconds: `keystroke: 250`,
   `coldOpen: 2_000`, `batch: 10_000`. Enforced by the caller via `worker.terminate()`, not by
   the gate itself.
3. **`budget:`** in a spec's front matter — a token budget for the spec **document**, 100–8000.
   `spec-report.mjs` warns `over-budget` when the prose exceeds it.

There is also the shape gate's size budget (`MAX_BYTES` = 4 MiB, `MAX_LINES` = 200,000,
`MAX_LIST_MARKER_LINES` = 20,000), whose failures are named `BUDGET_BYTES`, `BUDGET_LINES` and
`BUDGET_BLOCKS`.

### byte-exact **[repo]**
The property that a write changes only the bytes it was asked to change. Enforced by splicing
rather than by re-emitting a parse tree. The brief's vocabulary audit demotes it from headline
("4 complaints in 12,556") to mechanism; it remains the constraint every engine type is written
to satisfy.

### carrier **[repo]**
How a render profile is written on disk so that a renderer which has never heard of it still
produces something sensible. `specs/render/carrier.md` permits exactly two and refuses the rest:

- a **blockquote callout** `> [!kind]` for profiles whose payload is prose — chosen because it
  has **no closing marker**, so nothing can be dropped;
- a **fenced code block** with a structured info string for opaque data, spliced open-and-close
  atomically, because CommonMark §4.5 means an unclosed fence swallows every following line.

Refused carriers: generic `:::directive` (accepted on input, normalised on save, never the
on-disk form), HTML comments, front matter as a block carrier, link and footnote abuse. This
spec **corrects** PRD §9, which named the fenced info string as the sole mechanism.

### certificate **[repo]**
For one document, per block, per construct, per (product, surface) target: what a real renderer
actually does to it. Not a prediction — a differential run against pinned engines. Schema
`mdmax/cert@1`, defined in `src/modules/mdmax/domain/cert-contract.ts`. It is always a JSON
sidecar and is never written back into the `.md`.

**Never runnable.** `node scripts/mdmax-cert.mjs` exits with `ERR_MODULE_NOT_FOUND`, and `cert`
is not one of `package.json`'s 26 scripts.

### CellVerdict **[repo]**
One (block, target) cell of a certificate. `before` and `after` are **required** fields, not
optional: the stated rule is that the product must be able to say "bytes 1204–1251:
`Array<string>` renders as `Array`", never "this may not render everywhere".

### construct **[repo]**
A single markdown feature, isolated in the smallest document that exhibits it — a minimal pair.
19 are defined in `src/modules/mdmax/domain/constructs.ts` (`grep -c "^    id: '"`), including
`yaml-frontmatter`, `heading-attribute`, `lone-tilde`, `wikilink`, `setext-heading`,
`paren-ordered-list`. Whole-file correlation was tried first and abandoned: a 300-file run
reported "100% divergent" for every feature because every feature co-occurred with every other,
which cannot attribute a divergence to a cause.

### corpus, pinned corpus **[repo]**
`test/corpus/foreign` — **8,513** markdown files, 18.2 MB, across **7** vendored Obsidian
vaults, each pinned to a commit. `node scripts/corpus-foreign.mjs verify` exits 1 on a single
changed byte. Run at `e318ab3`: 8,513/8,513 byte-identical.

### decodeStrict **[repo]**
The one engine function wired into the running application. From `shape-gate.ts`, imported by
`vault/application/get-snapshot.ts` and `vault/infrastructure/search-index.ts`. It refuses
invalid UTF-8 rather than decoding it lossily, so a broken file is skipped from the snapshot and
the search index instead of appearing as mojibake.

### fold, equivalence fold **[repo]**
A named, versioned, pure function that normalises two engines' HTML before they are compared.
`PASS` in a certificate means "semantically equivalent **after the fold**", so the fold *is* the
definition of PASS. Version `mdmax/fold@1`. Its six rules, in report order: `entity-decode`,
`smart-punctuation`, `void-element-spelling`, `whitespace`, `id-prefix`, `heading-anchor-id`
(`FOLD_RULES` in `domain/fold.ts`).

Deliberately under-powered: "everything the fold does is a documented, testable normalisation;
everything it does not do is a real finding." Attribute values are never folded; text inside
`<pre>` and `<code>` is exempt. The file explicitly warns that the often-quoted "43.71% → 4.28%
divergence" belongs to a research prototype, not to this implementation, and must not be
attached to `mdmax/fold@1` until re-measured.

### fidelity **[repo]**
How faithfully a target can be certified, and part of the verdict rather than a footnote. Three
values, and at `e318ab3` the registry holds 7 / 7 / 1 of them across 15 targets:

- `local` — the engine runs here; the verdict is measured
- `declared` — cannot be probed at all (Obsidian, Notion, Typora, Bear, Slack, Discord); a dated
  declaration plus a canary, and it must **look** declared, never be mixed silently into a
  column of measured rows
- `requires-push` — `github-blob`, which needs content pushed before it can be read back

### front matter (two words) vs frontmatter (one)
**Front matter** is the YAML block between the opening and closing `---` fences of a markdown
file. **frontmatter** is this product. The collision is unavoidable and worth stating once.

### gray-matter
An npm package that parses front matter by producing an object and re-emitting it. Named in
`splice-frontmatter.ts` as one of the two write paths it replaces, because `matter.stringify`
rewrites bytes it was never asked to change — comments, quoting, key order, blank lines, and any
body that itself opens with `---`.

### hexagonal, modular monolith
The architecture. One folder per bounded context, each with `domain/`, `application/`,
`infrastructure/`, `presentation/`. Dependencies point inward only: `domain ← application ←
infrastructure`, with presentation and container above. Application never imports infrastructure;
it declares a **port** and the container injects an adapter. `node specs/harness/clean-architecture-report.mjs`
reports 0 violations over 208 files.

### it.fails, red proof **[repo]**
`AGENTS.md` rule 1: "A test on a rare fault proves nothing until it FAILS against the unfixed
code." A red proof is a test asserting the **correct** behaviour, marked `it.fails`, so today it
passes *by failing* — which is the evidence the defect is real. When the fix lands the test goes
red, and that is the signal to delete the `.fails` marker. Six exist at `e318ab3`: three for
NF-1 and three for NF-3. `npx vitest run` reports them as "6 expected fail".

### LEAK, DESTROY, MUTATE **[repo]**
The three `VerdictClass` values, required whenever a verdict is `CORRUPT`.

- **LEAK** — the payload became visible text. Front matter leaks in 23 of 24 bench
  configurations; `{#id}` in 21 of 24; HTML comments in 2 of 24.
- **DESTROY** — a source character was deleted or substituted. `<cat>` is deleted;
  `Array<string>` becomes `Array`.
- **MUTATE** — same characters, different structure. `1)` renders as a paragraph on kramdown and
  as an `<ol>` elsewhere. MUTATE **requires an oracle**: with no second output to differ from, a
  structural mutation whose text survives is reported PASS.

### MCP
Model Context Protocol. The mechanism by which a user's agent would write through frontmatter so
that writes carry the prompt (feature F11, MVP-1). No implementation exists in `src/`.

### MDMAX **[repo]**
The engine, and the only substantial part of this repository the product authored rather than
inherited. `src/modules/mdmax`, 13 files, 3,614 lines. It contains the offset model, the shape
gate, the placement fixture, the equivalence fold, the verdict classifier, the certificate
contract, the target registry, the construct corpus, `normalize/1`, `slug/1`, the front-matter
pre-pass and the engine bench. Written in capitals in the documents; lowercase as a directory
name and in `mdmax/…@1` version strings.

**Largely unwired**: exactly one of its symbols (`decodeStrict`) reaches product code.

### merge3 **[repo]**
`src/modules/repository/domain/merge3.ts`, 183 lines. A conservative line-based three-way merge
derived from an LCS. It auto-merges non-overlapping edits and emits git-style conflict markers
(`<<<<<<< local`, `=======`, `>>>>>>> remote`) where both sides touched the same base lines. It
never silently combines overlapping edits. Replaced a destructive "override remote" flow.

### NF-1 **[repo]**
The largest open availability defect. A YAML block sequence written at **column zero** —
spec-valid, PyYAML's default output shape, idiomatic in real vaults — causes the splice writer
to refuse the file entirely.

```yaml
tags:
- alpha
- beta
```

Blast radius per `specs/engine/nf-001-zero-indent-sequence.md`: 6,613 of 6,614 foreign refusals,
83.10% aggregate across 7,969 files. (That population figure differs from the corpus gate's
8,513 and I did not reconcile them — **unverified**.) It is an availability fix, not a
corruption fix: nothing is written wrongly, it is simply not written at all. Estimated 4 days.

### NF-3 **[repo]**
A correctness defect. A front-matter fence terminated by a **bare CR** (`\r`, not `\r\n`) is not
matched by `FM_OPEN = /^---[ \t]*(\r?\n)/`, so a `set` prepends a **second** front-matter block
instead of editing the existing one. Sequenced ahead of NF-1 even though it is rarer, because
correctness defects precede availability defects. Estimated 3 days.

The spec records why the corpus never caught it: the oracle replayed set-then-delete, and the
two operations cancelled each other out. Hence invariant 5 of `specs/engine/splice-writer.md` —
every operation must be asserted independently.

### normalize/1 **[repo]**
The hash input for every stored anchor: NFC → collapse whitespace → lowercase → NFC.
`NORMALIZE_VERSION = 'mdmax/normalize@1'`. The trailing re-normalisation is not redundant —
`toLowerCase` is not closed over NFC, so without it the function would not be idempotent, and a
key that changes when you re-derive it is not a key.

Frozen because the 99.627% re-anchoring figure was swept under exactly this definition. Changing
it silently re-keys every stored anchor while the published number goes on describing code that
no longer exists. Must land before the first anchor is persisted; afterwards it is a migration.

### offset, offset map, branded offset **[repo]**
An offset that does not say which unit it is measured in is a bug waiting for an emoji. The
canonical internal unit is the **UTF-16 code unit** (what CodeMirror reports, what mdast
positions use, what `String.length` counts). Bytes appear only at edges. Only 67 of 1,080 corpus
files have `bytes == UTF-16 units == code points`; 103 of 2,314 contain non-BMP characters.

An offset may **never** fall inside a surrogate pair — rejected at construction, never rounded,
because rounding turns a detectable bug into a wrong answer. `U16Offset`, `ByteOffset` and
`GraphemeIndex` are branded types the compiler refuses to mix. `OffsetMap` is the single
conversion point in the codebase; it stores a checkpoint every `BLOCK` units rather than a dense
`Uint32Array` (which would cost 16 MB per open document at the 4 MiB ceiling).

### placement fixture **[repo]**
The rule that every byte written into a user's file passes first. Never reason about whether an
insertion is safe: insert it, parse both versions, compare the **block skeleton**, and refuse if
it moved. Do not pad and retry.

The measured defect that forced it — blank-line isolation does **not** help:

```
"Heading\n---"                                -> heading(depth=2)
"Heading\n<!-- mdmax:begin id=k -->\n---"     -> paragraph, html, thematicBreak
"Heading\n\n<!-- mdmax:begin id=k -->\n\n---" -> paragraph, html, thematicBreak   (same)
```

An `h2` silently becomes a paragraph plus a horizontal rule. "A refusal costs a user one
un-anchored comment; a wrong answer costs them a heading, permanently, in a file that is also a
git commit."

### port, adapter, composition root
A **port** is an interface declared in the application layer (`VaultReader`, `RepositoryWriter`,
`LlmClient`, `SnapshotCache`). An **adapter** implements it in infrastructure
(`githubVaultReader`, `githubWriter`, `gatewayLlmClient`). The **composition root** is
`src/container/dependency-container.ts`, the only wiring module app routes may import.

### prepass, lenient front-matter pre-pass **[repo]**
`src/modules/mdmax/domain/frontmatter-prepass.ts`. Makes an invalid front-matter block readable
**without changing what it means**, for a reader only — it never writes. 170 of 907 front-matter
blocks in the founders' own vault (18.74%) are not valid YAML, because Obsidian's wikilink
syntax puts markdown's grammar inside YAML's.

Three verdicts. `CLEAN`; `REPAIRED` (bare wikilinks quoted so a parser can read the block); and
`REFUSED_AMBIGUOUS` for the silent-corruption shape `related: [[[A]], [[B]]]`, which parses
**successfully** into `[[["A"]], [["B"]]]` and destroys the links. A silent successful parse that
loses data is the most dangerous outcome available, so it is refused rather than repaired.

**A front-matter parse failure may never fail a user action.** Nothing here throws; the caller
degrades to "properties unavailable" and the document still opens, edits and saves.

### projection, projection law **[repo]**
The rule that the file's own bytes are the only source of truth. Stated in the PRD as: *the file
is the database; there is no index of record. Any cache we build is a projection — derivable
from the bytes, discardable, rebuilt without asking the user. If a cache and a file disagree,
the file wins and the cache is wrong.* Its practical form (`docs/ENGINE.md`) is that a render
profile is a view whose edits write back to the bytes that produced it. Consequences named in
`docs/THESIS.md`: no tree-of-record, no dashboards with no file behind them, no OPFS vault copy.

The phrase does not appear anywhere in `src/` — it is a documented design law, not a code
construct.

### refusal **[repo]**
Returning the input unchanged, or a typed failure value, rather than guessing. Product policy,
not an error path: `AGENTS.md` rule 2 says "Returning the input unchanged is a correct outcome
for this product. Guessing is not. This is the whole differentiation." Modelled as a discriminated
union everywhere in the engine and never as an exception, on the stated grounds that a route
handler which throws on a user's document is a route handler that 500s on a user's document.

### review state **[repo]**
Who has read which span, and when. Feature F2 and the product's headline claim. Designed as one
JSON line per span in `.frontmatter/review.jsonl`, committed beside the documents in the user's
own repo: path, byte start, byte end, content hash, reviewed-by, reviewed-at, and where known
author, model and prompt.

**No implementation exists.** `grep -rn "review\.jsonl\|reviewState\|review-state\|\.frontmatter/" src`
returns zero hits at `e318ab3`.

### SAFE_KEY **[repo]**
`/^[A-Za-z0-9_.$-]+$/` — the only front-matter key shapes the splice writer can locate, exported
from `splice-frontmatter.ts` so the UI can refuse the same shapes at the point of typing. One
definition, two call sites, no drift.

Why the door is this narrow: a key the scanner cannot find is reported as **absent**, and absent
sends a `set` down the append path, so the key is written a second time. Three edits to `título`
produced three extra lines and a document YAML then refuses to load (`Map keys must be unique`) —
unbounded, silent, and reachable from the UI. Supporting non-ASCII keys is not a widened regex:
`café` typed NFC and NFD renders identically and keys separately, so the module must first decide
what key **equality** means.

### shape gate **[repo]**
Refuses hostile documents before any grammar runs. Cheap, first, and the only thing between a
pasted file and a pegged CPU. Two quadratics already shipped in this repo were measured against
its own `node_modules`: `WIKILINK_RE` at k = 1.98 took 36,865 ms on 320 KB of `[[`, and
`mdast-util-from-markdown` took 12,429 ms on flat lists where micromark took 1,207 ms on
identical bytes.

### sidecar **[repo]**
A file carrying metadata about documents without being inside them. Required because every
in-file comment syntax renders as visible garbage on GitHub. Two rules state it independently:
certificates are always a JSON sidecar and never written back into the `.md`; review state and
comments live in `.frontmatter/`, never in the file. **No sidecar is written by any code path in
`src/`.**

### slug/1, collapsed slug **[repo]**
Two algorithms, deliberately, because they describe two kinds of author. Re-measured over the
393 intra-document anchors of one corpus: github-slugger 86/393 (21.88%), dash-collapsing
375/393 (95.42%), accepting **either** 388/393 (98.73%).

- **Write** exactly one canonical form — `slug/1`, which is github-slugger's algorithm, so an
  anchor we emit works on GitHub and not only inside frontmatter.
- **Resolve** tolerantly — accept the canonical form *or* the dash-collapsed form. Reading
  generously costs nothing; writing generously would fork the format.

The file carries its own caveat: 85.2% of those 393 anchors come from a single file across only
6 files total, which is a handful of authoring habits, not a population — strong enough to break
a tie, far too thin to call a law.

### slug (share) **[repo]**
A different thing with the same word: the user-chosen identifier in a public share URL,
`frontmatter.in/<slug>`. 1–60 characters, lowercase letters, digits and hyphens, no leading,
trailing or consecutive hyphens, and not in `RESERVED_SLUGS`. The reserved list is deliberately
generous because slugs sit at the URL root, so any future top-level route would shadow a
conflicting slug: rejection is fixable in five seconds, a collision is a bug shipped to users.

### span **[repo]**
A contiguous region of a document that review state, attribution and comments would all anchor
to. The product's central entity. **Not a type in `src/`.** The nearest thing is
`CertBlock.byteRange`, which is scoped to the certificate artefact.

### spec, spec state **[repo]**
A governed contract document in `specs/`, with machine-checked front matter (`governs`, `verify`,
`red_proof`, `prd_sha256`, `budget`). Six states: `draft → ready → in-progress → implemented →
verified`, plus `superseded`. Every forward transition has an entry condition that is **executed,
not asserted**, and only `specs/harness/spec-report.mjs` writes `state:` forward — a hand-written
`state: verified` is itself a drift finding.

Two non-negotiable rules: **`verified` is the only state that may be cited publicly**, and a red
proof is required to reach it. Demotion is automatic when a governed file's hash changes; a human
cannot re-assert. Deleting a spec file is forbidden.

At `e318ab3`: 4 specs, all `draft`, 169 of 171 module files ungoverned.

### splice, splice writer, splice locator **[repo]**
A **splice** locates the bytes representing one thing and replaces only those bytes. The rule,
attributed in the source to Foster et al., TOPLAS 2007, Lemma 3.9: never regenerate from a parse
tree.

The **splice writer** is `src/modules/share/domain/splice-frontmatter.ts` — the shipped one,
scoped to a single top-level front-matter key. It does not parse YAML; it scans line-wise. It
preserves the list shape already in the file (90.1% of the corpus writes flow form `tags: [a, b]`,
8.4% block form), and quotes a scalar only when the plain form would not read back identically,
treating YAML indicators as special **only in first position** — the over-broad earlier rule
quoted 435 of 907 files unnecessarily.

The **splice locator** is the brief's name for the component that would relocate review spans
after a file changes. It does not exist.

### STRIP / PASS / CORRUPT / VOID **[repo]**
The four verdicts. Adding a fifth is a schema change, not a patch.

- **PASS** — semantically equivalent output after the versioned fold. Gated on the absence of
  LEAK, VOID and DESTROY signals, because oracle agreement alone is not sufficient:
  `## Heading {#custom}` renders as `<h2>Heading {#custom}</h2>` **byte-identically** on marked
  16.4.2 and commonmark 0.31.2, and both leak.
- **STRIP** (also written DEGRADED) — output differs, payload invisible, no source character
  lost. Link reference definitions are the exemplar: invisible in 24 of 24.
- **CORRUPT** (also written BROKEN) — output differs and something was lost or changed. Carries
  a `VerdictClass`.
- **VOID** — the payload was by reference and the reference never resolved, so it was never in
  the file at all. `![[Some Note]]` → `<p>![[Some Note]]</p>`. A ```` ```mermaid ```` fence is
  *not* VOID, because its payload survives inside the `<pre>`. VOID was the fourth verdict a
  three-valued matrix had no cell for, and it decides which capabilities are permitted.

### target **[repo]**
A **(product, surface)** pair, not a product. The finding that forced the shape: *"GitHub" is not
one target — it is three renderers that disagree on identical bytes* (`github-pages`,
`github-blob`, `github-comment`). 15 targets are registered at `e318ab3`. Slack and Discord are
not CommonMark and are modelled as lossy sinks rather than renderers; UI automation to certify
them is ruled out by name.

### Tauri
The desktop shell (v2). It reuses the operating system's webview instead of bundling a browser.
`src-tauri` at `e318ab3` still carries the sibling app's identity, bundle id `ai.sgnk.md` — which
`AGENTS.md` §8 records as deliberate for persistence keys and the brief §9 row 9 records as a
defect for the product name. Not re-verified in this pass — **unverified**.

### vault
A tree of markdown files with wikilink semantics, i.e. Obsidian's model. `VaultSnapshot` is the
whole-vault in-memory view. Distinguished from the **repository** that contains it by
`RAW_BLOCKED_PREFIXES` in the composition root (`src/`, `docs/`, `specs/`, `public/`, `.github/`,
`.claude/`, `.vercel/`, `node_modules/`), which keeps raw file access inside the vault.

### verdict **[repo]**
See STRIP / PASS / CORRUPT / VOID, and LEAK / DESTROY / MUTATE. Produced by
`src/modules/mdmax/domain/verdict.ts`, `VERDICT_VERSION = 'mdmax/verdict@1'`. Pure: no IO, no
engine, no filesystem.

### wikilink
`[[Target]]`, Obsidian's link syntax; `![[Target]]` is an embed. Resolution here is by basename,
deterministic by construction — shortest path wins, then lexicographic — because otherwise the
chosen target flips with vault iteration order. A case-insensitive fallback matches Obsidian's
weak linking, so `[[hq]]` backlinks to `HQ.md`.

Wikilinks inside YAML are the reason the front-matter pre-pass exists: `related: [[a]], [[b]]`
puts markdown's grammar inside YAML's.

---

## Terms deliberately not defined here

`sgnk-md` — the sibling product this repository's editor shell is forked from. Its persistence
key prefixes survive on purpose (`sgnk-md:dirty`, the IndexedDB store, the bookmarks and editor
settings keys); renaming any of them orphans a user's local drafts, so they change only behind a
migration. See `AGENTS.md` §8.

Market vocabulary from `docs/PRODUCT-BRIEF.md` Part II (evidence class, kill condition, exit
test, MVP-0/1/2) is defined in that document and is not repeated here.
