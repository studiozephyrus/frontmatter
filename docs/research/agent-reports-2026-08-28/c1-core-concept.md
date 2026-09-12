## KEY FINDINGS
- THE LAW: across all six prior-art clusters, the survivors (org-mode, TiddlyWiki, Dataview/Bases, Potluck) keep the file as source-of-truth and the view as a disposable deterministic function of it; the lock-in tools (Notion/Coda, Jupyter/Observable) fuse data+logic+view into a proprietary runtime store you can't cleanly leave.
- RECOMMENDED FOUNDATIONAL CONCEPT: 'the projection' — the plain .md is the ONLY source of truth, and every app-like behavior (board/calendar/decision-card/dashboard/site + every AI edit) is a deterministic, reversible projection OF the file that owns no state. Self-describing-type (input) + deterministic-view (output) are two halves of one law; malleability and trust fall out of it.
- MARKET-VALIDATED: Obsidian shipped 'Bases' as a NATIVE core plugin in 2025 [SS] on top of Dataview (created 2021, 9,300 stars [fetched]) — proving 'deterministic view over frontmatter' is real, current, growing demand. Bases' own pitch is the degradation story: data stays in frontmatter, the .base saves only view config, 'delete the base and you lose nothing but the view, no lock-in/export/proprietary format.'
- NEAREST PRIOR ART IS AN UNMAINTAINED PROTOTYPE: Ink&Switch's Potluck (LIVE 2022) is the near-exact bet — 'gradual enrichment from docs to apps,' live searches+formulas shown as annotations with 'clear separation between text and annotations, original text freely editable' [fetched README] — but it is explicitly 'not a polished product or actively maintained' [fetched]. The productization slot is open.
- THE MOAT IS ALREADY DUG: the separation law is only credible if the write-back is provably reversible and the view always strips to portable Markdown — which is exactly what frontmatter's already-built byte-preserving splice writer and degradation certificate enforce. The recommendation NAMES an existing asset, it doesn't add a new bet.
- TIMELESS PRIMITIVES TO COPY (org-mode, created 2003, Carsten Dominik [SS]): TODO-state-on-the-headline (the state IS the machine-readable line), the agenda as a COMPUTED view generated from date tags and stored NOWHERE, TBLFM tables-as-spreadsheet. All survive because plain-text: strip Emacs and the .org file is still readable.
- ANTI-PATTERN 1 (proprietary store): Notion formulas are single-row-only and cannot aggregate across rows; Coda CSV export 'strips canvas properties, button actions, cross-document formulas, leaving raw disconnected strings' [SS]. The view is the data → leaving = data loss. Refuse this.
- ANTI-PATTERN 2 (hidden runtime): a Jupyter notebook's meaning lives in invisible out-of-order kernel state — one large-scale study (Pimentel et al. 2019) reported under 4% of GitHub notebooks reproduce identical results [SS]. 'App-like WITHOUT a runtime' is this anti-pattern stated negatively. (Jupyter repo 2015, 13,327 stars; Quarto 2020, 5,965; Observable Framework 2023, 3,606 — all [fetched].)
- ANTI-PATTERN 3 (invented syntax): TiddlyWiki (repo 2011, 8,632 stars, 78,456 npm downloads last month [fetched]; classic 2004 [SS]) proved single-file-logic works but stayed niche due to custom wikitext learning curve + browser-save friction + a frozen Classic architecture [SS]. Lesson: never invent markup the plain file can't survive being read without — which matches frontmatter's settled 'no new format' posture.
- CATEGORY ONE-LINER: 'Notion made the app the source of truth and trapped your data inside it; frontmatter makes the FILE the source of truth and lets every app be a disposable lens over it — provably, byte-for-byte, reversibly.' That inversion defines a category ('files that behave like apps' vs 'apps that imprison files'), not a feature.
- FOUR CANDIDATE PRIMITIVES delivered (A: deterministic view over frontmatter; B: doc-grows-into-app-by-annotation / Potluck; C: typed self-describing document; D: reversible append-only decision record) — with A+C as the recommended core law and B+D as what it makes possible.

---

ap# ANGLE 1 — THE FOUNDATIONAL CORE CONCEPT

## The one law that separates 20-year survivors from lock-in

Reading the six prior-art clusters against each other, a single line divides the tools that *endured as conventions* from the tools that *became proprietary traps*:

**In every enduring system, the file is the source of truth and the view is a disposable, deterministic function of it. In every lock-in system, the view IS the data — logic, state and rendering are fused into a runtime store you cannot cleanly leave.**

- org-mode's agenda is *computed on the fly from date tags and TODO keywords in plain files and stored nowhere* [SS]; Obsidian Bases' `.base` file *"only saves the configuration of how you want to look at those notes… delete the base tomorrow and you lose nothing but the view"* [SS]; Potluck keeps *"a clear separation between text and annotations… the original text freely editable"* [fetched, potluck README].
- By contrast Coda export to CSV *"strips away canvas properties, button actions, and cross-document formulas, leaving raw, disconnected strings"* [SS]; a Jupyter notebook's meaning lives in *hidden, out-of-order kernel state* — one large-scale study (Pimentel et al. 2019) reported **under 4% of GitHub notebooks reproduce identical results** [SS].

This law is *exactly* what frontmatter's two already-built assets enforce: the byte-preserving splice writer guarantees the only write-back is reversible, and the degradation certificate guarantees the view can always be stripped to portable CommonMark. Frontmatter is not chasing this primitive — it has already built the two hardest pieces of it.

---

## Prior-art evidence (per cluster → the primitive it contributes)

| Cluster | Evidence | Primitive it proves | Degradation posture |
|---|---|---|---|
| **TiddlyWiki** | Repo `TiddlyWiki/TiddlyWiki5` created 2011-11-22, 8,632★, still pushed 2026-08-25 [fetched]; npm `tiddlywiki` created 2012-07-13, latest 5.4.1, **78,456 downloads last month** [fetched]; classic original Sept 2004, Jeremy Ruston [SS] | Self-contained logic-in-ONE-file (tiddlers = atomic typed units, transclusion, filters as a query language) [SS] | Single file, but *custom wikitext* + browser-save friction + frozen Classic architecture kept it niche [SS] — the warning: **don't invent a syntax the file can't survive without** |
| **org-mode** | Created **2003, Carsten Dominik** [SS]; GitHub mirror `bzg/org-mode` 2012, 359★ (mirror only) [fetched]; agenda *"automatically generated from date tags"* [SS] | TODO-state-on-the-headline (machine-readable state IS the line); **agenda = a COMPUTED view, never stored**; TBLFM = spreadsheet-in-a-table; babel = literate compute [SS] | Timeless *because* plain-text: strip Emacs and the `.org` file is still a readable outline. These are the primitives to copy |
| **Notion / Coda / Airtable** | Notion formulas *single-row only, cannot aggregate across rows* [SS]; Coda CSV export loses formulas/buttons/canvas [SS] | Spreadsheet-logic-in-a-doc — powerful, but **fused into a proprietary block store** | **The anti-pattern to avoid**: the view is the data; leaving = data loss. This is lock-in bloat, not a convention |
| **Observable / Quarto / Jupyter** | Jupyter repo 2015, 13,327★ [fetched]; Quarto 2020, 5,965★ [fetched]; Observable Framework 2023, 3,606★ [fetched]; Grus "I Don't Like Notebooks" 2018 — hidden state, out-of-order exec; <4% reproducible [SS] | Reactive/executable document | **The heavy anti-pattern**: meaning depends on invisible *runtime* state → not deterministic, not portable, not degradable. Frontmatter must be "app-like WITHOUT a runtime" precisely to dodge this |
| **Dataview / Datacore / Bases** | Dataview 2021, **9,300★** [fetched], *"treat your vault as a database you can query from,"* query renders inline as `table`/`list` [fetched]; Datacore 2022, 2,230★, "WIP successor, focus on UX and speed" [fetched]; **Obsidian Bases** native core plugin, 2025 — *"data lives in the frontmatter… the `.base` only saves the view config… no lock-in, no export step, no proprietary format"* [SS] | **Query-over-frontmatter as a computed, disposable view** — and Obsidian shipped it *natively* in 2025, validating demand | Best-in-class degradation: the view is provably disposable. This is frontmatter's thesis, already market-proven |
| **Ink & Switch living-document line** | local-first term coined 2019 paper [SS]; Peritext = CRDT for rich text w/ inspectable history [SS]; **Potluck** (LIVE 2022) *"gradual enrichment from docs to apps… live searches extract structured info from freeform text, formulas compute, results shown as dynamic annotations… original text freely editable"* [fetched] but *"not a polished product or actively maintained"* [fetched] | The document that **grows into an app by annotation, not by runtime** | Potluck's annotations are a visually distinct layer over untouched text — the research-grade proof of frontmatter's exact bet. Nobody has PRODUCTIZED it |

---

## 3–5 candidate core concepts

### A — The deterministic view over frontmatter *(the disposable projection)*
**Primitive (one line):** A file's frontmatter + body is the only store; every rendering — board, calendar, decision card, dashboard, site — is a *pure, deterministic projection* of that file that persists nothing and owns nothing.
**Prior art:** org-mode agenda computed from tags, never stored [SS]; Dataview query→inline table [fetched]; **Obsidian Bases native 2025** — `.base` saves only view config, data stays in frontmatter [SS]; Datacore [fetched].
**Degradation:** strip the view → the `.md` is still complete, valid CommonMark+YAML. Disposability is structural, not a promise. (This is literally Bases' own pitch.)
**Category, not feature:** it **inverts the database** — in Notion the view imprisons the data; here the `.md` IS the database and every app is a lens. A feature is "we have a board view"; the category is "no tool can ever hold your data hostage, because views are never canonical."

### B — The document that grows into an app by annotation *(malleable, no runtime)*
**Primitive:** You start with a plain doc and progressively attach typed, computed annotations (searches, formulas, rendered widgets) that *layer over* the text without becoming it — the doc becomes software while staying a doc.
**Prior art:** **Potluck** [fetched] is the near-exact prototype — *"gradual enrichment from docs to apps," "clear separation between text and annotations, original text freely editable"*; TiddlyWiki logic-in-a-file [fetched]; Ink&Switch malleable-software / end-user-programming line [SS].
**Degradation:** annotations render in a distinct layer (Potluck's "blue ink"); remove them → original text untouched. Potluck deliberately *avoids circular feedback loops* by keeping annotations non-source.
**Category, not feature:** this is the **malleable-software** category — software you reshape at the point of use, in the document, with no build step and no runtime. A feature is "AI can edit your doc"; the category is "the doc IS the program and the program IS the doc, reversibly." Note: Potluck itself is *"not actively maintained"* [fetched] — the productization slot is open.

### C — The typed, self-describing document *(the file declares what it is)*
**Primitive:** Frontmatter is a lightweight *type declaration* (`type: decision`, `status: shipped`) so a file announces what it is — and therefore how it renders and what operations are valid — with no external schema registry.
**Prior art:** org-mode's TODO-keyword-on-the-headline (the state IS the line) [SS]; the Jekyll/Hugo/Obsidian frontmatter convention; Obsidian "properties" read by Bases as typed columns [SS]; Airtable/Notion field-types — but fused to a proprietary store, the anti-pattern [SS].
**Degradation:** a tool that doesn't understand `type: decision` still sees valid YAML + a valid Markdown body → it degrades to "just a note." The type is an *additive, optional contract*, never required to read the file.
**Category, not feature:** it makes the **FILE** the unit of typing, not the app — so any new tool (or AI) learns the whole vault's semantics by reading conventions, with zero migration. A feature is "we support templates"; the category is "documents carry their own type, so any agent knows what to do with them."

### D — The reversible, append-only decision record *(the file as its own audit log)*
**Primitive:** Because the byte-preserving splice writer + degradation certificate exist, the file can be a *reversible, append-only* record where every AI/human change is a traceable, undoable event in the same file — the document is its own version history and audit log.
**Prior art:** Ink&Switch local-first + Peritext (*inspectable change history; "realtime version control combining Git/GitHub and Google Docs"*) [SS]; org-mode logbook/state-change logging into the entry [SS]; git-over-plaintext as the base case.
**Degradation:** the record is plain text — strip the tooling and a human-readable log of what happened remains; reversibility is guaranteed by the already-built splice writer.
**Category, not feature:** this is the **"AI works in your file without you losing trust"** category — the safety property that makes human+AI-in-one-file viable. A feature is "undo"; the category is "provable non-corruption + full provenance in the substrate itself," which is a moat frontmatter has already half-built.

---

## THE ONE RECOMMENDATION

**Frontmatter's single foundational concept is *the projection*: the plain `.md` file is the only source of truth, and every app-like behavior — board, calendar, decision card, dashboard, site, and every AI edit — is a deterministic, reversible projection *of* that file, owning no state of its own.**

C and A are the two halves of this one law: the file *self-describes its type* (C, the input) so a *deterministic view can be computed* from it (A, the output). B (grow-into-an-app) and D (reversible record) are what the law makes *possible* — malleability and trust fall out of it, they are not separate bets. So the foundational concept is the **law itself**, not any one of its four expressions.

**Why this is the right single bet:**
1. **It is the through-line every survivor already proves** — org-mode's computed agenda, Dataview's query-view, Bases' disposable `.base`, Potluck's non-source annotations are all the same law rediscovered. Frontmatter would be the first to make it the *explicit product primitive* rather than a side effect.
2. **It is the market-validated one** — Obsidian shipping **Bases as a native core plugin in 2025** [SS], on top of Dataview's 9,300★ [fetched], is proof that "deterministic view over frontmatter" is a real, current, growing demand — not a research toy.
3. **The two hardest enforcement pieces already exist.** The separation law is only credible if (a) the write-back is provably reversible and (b) the view can always be stripped to portable Markdown. Those are *precisely* the byte-preserving splice writer and the degradation certificate frontmatter already built. The moat is dug; this concept names it.
4. **It is the clean opposite of every anti-pattern** — no proprietary block store (vs Notion/Coda), no hidden runtime state (vs Jupyter/Observable), no invented syntax the file can't survive (vs TiddlyWiki wikitext). "App-like WITHOUT a runtime" is not a slogan; it is this law stated negatively.

**The category one-liner:**
> *Notion made the app the source of truth and trapped your data inside it. Frontmatter makes the FILE the source of truth and lets every app be a disposable lens over it — provably, byte-for-byte, reversibly.*
That inversion is not a feature you add to an editor; it is the definition of a new category: **files that behave like apps**, versus **apps that imprison files**.

**What to build first to instantiate it (all conventions, zero new syntax):**
- A `type:` (+ optional `view:`) frontmatter convention (C) that any file opts into and any tool can ignore → self-describing files.
- A deterministic renderer that projects a typed file/folder into a board / calendar / decision-card / dashboard (A), with a visible "this is a view, your file is here" affordance (Bases' and Potluck's move).
- Both wired through the existing splice writer + degradation certificate so every AI action is a reversible projection back into the file (D), and every view provably strips to CommonMark.
- Leave B (annotate-a-doc-into-an-app, the Potluck experience) as the *expansion* built on the same law once A+C+D ship.

**What to explicitly refuse** (each is a prior-art tombstone): a proprietary store where the view holds the data (Notion/Coda); any behavior that depends on hidden runtime/kernel state (Jupyter/Observable); and any bespoke markup the plain file can't survive being read without (TiddlyWiki Classic's frozen wikitext).