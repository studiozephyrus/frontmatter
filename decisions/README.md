---
mode: reference
updated: 2026-09-09
verified_against: bda4387
---

# decisions — the decision site

Every open decision on frontmatter, with the evidence behind it, as a static page. Live at
**https://frontmatter-decisions-sagnik.vercel.app**, and a copy is served from
`public/decisions/` by the Next.js app.

**201 decisions across 15 areas, 56 critical, every one carrying a diagram, 422 evidence
exhibits, 197 of 201 linked to at least one other decision.**

No build step, no framework, no dependency. Six files, opened directly or served from any
directory. That constraint is deliberate: this page has to render on a plane, behind a strict
CSP, in a PDF, and in five years.

---

## The files

| File | Size | What it is |
|---|---|---|
| `index.html` | 5 KB | Shell, the SVG symbol sprite (12 Material icons), the pre-paint theme script |
| `app.css` | 33 KB | The whole design system and every component |
| `app.js` | 38 KB | One IIFE. Every view is a pure function of `window.QUESTIONS` and `state` |
| `diagram.js` | 24 KB | Ten SVG primitives — the diagram vocabulary |
| `questions.js` | 1.3 MB | **Generated.** Never hand-edit |
| `fonts.css` | 265 KB | Mosvita and Google Sans, base64-embedded so the page renders offline |

`v2/` holds the sources; `tools/` holds the build, validation and deploy scripts. Neither ships.

---

## Changing the content

`questions.js` is generated. Editing it is lost on the next build.

```bash
# 1. Edit the per-area sources
$EDITOR decisions/v2/features.json

# 2. Validate against the contract — must be 0 errors
python3 decisions/tools/validate.py decisions/v2

# 3. Rebuild. --links is REQUIRED: without it the 60 cross-area
#    duplicates that were removed silently come back.
python3 decisions/tools/build-v2.py decisions/v2 \
  --links decisions/v2/_links.json --out decisions/questions.js

# 4. Mirror into the app's public copy, then deploy
rsync -a --delete --exclude=README.md --exclude=v2 --exclude=tools \
  decisions/ public/decisions/
source /Users/sagnikmitra/.config/codex-env/tokens.zsh && node decisions/tools/deploy.mjs
```

`decisions/v2/CONTRACT.md` is the card spec — every field, the voice rules, the merge rules and
the diagram constraints. `decisions/v2/_links.json` carries the cross-area analysis: 43 duplicate
sets, 60 link edges, 7 orphans.

---

## Changing the interface

### The design system

One accent, hairline borders, square-ish corners, one elevation rule. Tokens live at the top of
`app.css` in three blocks that must stay in step: bare `:root` (light), a
`prefers-color-scheme:dark` block guarded with `:root:not([data-theme=light])`, and
`:root[data-theme=dark]` so an explicit toggle wins in both directions.

**Never give a colour its only definition inside a media or `[data-theme]` block.** A base rule
declared *after* a media query overrides it at equal specificity, which is how the phone action
bar shipped invisible with every handler working. `scripts/css-cascade-check.py` catches that
class:

```bash
python3 scripts/css-cascade-check.py decisions/app.css   # must print "clean"
```

Tones, and they are the only colour decision in the system: `neutral`, `sunk` (background
machinery), `accent` (what is being proposed), `good`, `warn`, `stop`.

**Icons are Google Material Symbols as inline SVG**, in the `index.html` sprite, referenced with
`<use href="#i-name">`. No emoji as UI. No icon web font — a font that fails to load renders the
ligature text or a tofu box, which is the failure this rule exists to prevent.

### Layout, and the three breakpoints

`app.css` is sectioned by comment: top bar, layout, nav, the decision card, options, pager,
right rail, overview, import, phone, then the two blocks added later (position line and area
index; the v2 card). Read the section comment before editing inside one.

| Width | Shape |
|---|---|
| ≥ 1720 | Wider nav and rail |
| default | nav · content · context rail |
| ≤ 1180 | The rail drops (`aside{display:none}`) |
| ≤ 900 | Nav becomes a drawer behind `#menuBtn`; a fixed bottom action bar carries prev/next within thumb reach |

Measured on the deployment at 375, 768 and 1440: no horizontal scroll at any width, rail hidden
below 1180, drawer opens on tap, action bar flush to the viewport bottom.

### The view layer

`app.js` is one IIFE with no framework. Every view is a pure function of `window.QUESTIONS` and
`state`, so adding a view means adding a render function and a route:

| Function | Renders |
|---|---|
| `renderNav` | The left rail: search, areas, question rows |
| `renderQ` | A decision card — the big one |
| `renderOverview` | KPIs, areas, the answers rail |
| `renderArea` | One area's index, grouped open and answered |
| `renderImport` | The markdown-to-decisions sidecar demo |
| `go(view)` / `fromHash()` | Routing. **Both must know any new route** |

Two traps, both of which have already bitten:

- **`fromHash()` and `go()` must agree.** Area deep links fell through to the overview because
  the boot resolver only knew questions, `import` and `overview`.
- **Click handling is delegated** through one `closest()` selector list near the bottom of
  `app.js`. Adding a button id and its `if (t.id === …)` branch is not enough — **the id must
  also go in that selector**, or the button does nothing. This cost a debugging round on the
  restore control.

### The diagram vocabulary

`diagram.js` renders ten primitives from structured data, so 201 cards carry real visuals
without 201 bespoke drawings.

| Kind | Use it when | In use |
|---|---|---|
| `compare` | 2–3 options held against each other | 76 |
| `flow` | a sequence or a fork | 31 |
| `ba` | before and after | 19 |
| `screen` | the decision is about what a surface shows | 16 |
| `arch` | which layer owns something | 14 |
| `timeline` | dates carry the argument | 12 |
| `file` | bytes, spans, markdown syntax | 11 |
| `funnel` | a count collapsing through stages | 10 |
| `state` | a lifecycle | 8 |
| `matrix` | positioning against the field | 4 |

Geometry is **computed from the text each box holds**, so a longer label resizes its box rather
than colliding with the next. Colours are CSS variables, so a diagram follows the page into dark
mode. Every primitive is inline SVG with no network dependency.

Adding a primitive: write the function, add it to the `KINDS` map, add its item-count cap to
`VIS_LIMITS` in `decisions/tools/validate.py`, and document it in `v2/CONTRACT.md`. Then render
it with real content at real length before trusting it — both geometry bugs found so far were
invisible until a real label was in the box.

### Answers

`localStorage` only, one key `fm-decisions-v1`, shaped `{picks: {id: "a"}, notes: {id: "text"}}`.
Per browser, per machine, never sent anywhere. Export from the overview as markdown (readable,
marks choices that go against the recommendation) or JSON (the file **Restore** reads back).
Restore merges rather than replaces and reports what it overwrote and what it skipped.

Keyboard: `j`/`k` move · `a`–`d` pick · `↵` advance · `/` search.

---

## Before you deploy a UI change

```bash
node -e "new Function(require('fs').readFileSync('decisions/app.js','utf8'))"  # parses
python3 scripts/css-cascade-check.py decisions/app.css                        # no dead rules
python3 decisions/tools/validate.py decisions/v2                              # 0 errors
node decisions/tools/screenshot.mjs                                           # look at it
```

**Verify against the deployment, not the local file.** Three real defects here were invisible
locally and only appeared when the live page was driven. Check a deployed URL with `curl -sI` —
never `curl -sL`, because a login page returns 200 after following a redirect.

`decisions/` is excluded from eslint (it is standalone browser and Node code, like `public/**`);
its gates are the four commands above.

---

## Where the design came from

`docs/DECISIONS-UI-REFERENCE-PASS-2026-09-09.md` records a pass over twenty shipped question and
review interfaces, each finding cited to its source. What that pass changed: the position stated
as text rather than only a bar, exactly one primary forward action, the keyboard hint sitting
with the action, the meter labelled with the current area, weight rather than glyphs in a dense
list, and clicking an area opening an index instead of jumping to its first question.
