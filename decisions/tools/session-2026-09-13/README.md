# Session tools, 12 to 13 September 2026

Helpers written during the decisions de-jargon pass, the exhibits pass, the merge-note fix and the
MVP plan. Copied here from the session scratchpad so the next account has them. They are working
tools, not polished ones.

**Before reusing any of them:** each script names the scratchpad path in a constant `S` at the top
(`/private/tmp/claude-501/.../scratchpad`). That folder is temporary. Point `S` at a folder of your
own, and recreate what the script expects there (listed below).

## The exhibits pass (per-entry editing with rollback)

These made the 14-file exhibits rewrite safe after the first 16-agent run died at the usage limit
with nothing written. The lesson is Learned Rule 80 in `~/.claude/CLAUDE.md`.

| File | What it does | Needs in `S` |
|---|---|---|
| `ev-verify.py` | Checks an area file's `evidence` against a pinned copy: nothing outside evidence changed, same shape, every citation kept (including extension-less refs like `r17-h7:104`), every quoted span and code span kept, no figure lost, no em-dash outside quotes or code. Spans are taken per string, so a quote mark in one table cell never pairs with the next. | `ev/<area>.json`, the pinned originals |
| `ev-todo.py` | Lists only the exhibit strings that still need work, with a path per string. `--json out.json` writes a skeleton `{path: {old, new: null}}` so an agent never retypes the old text. | `ev-verify.py`, `ev/` |
| `ev-apply.py` | Applies a filled skeleton one entry at a time. Refuses an entry whose `old` no longer matches; rolls back an entry that adds a hard violation; saves after every accepted entry. | `ev-verify.py`, `ev/` |

The pinned originals were the area files at commit `31603d1`. Recreate them with
`git show 31603d1:decisions/v2/<area>.json > $S/ev/<area>.json`.

Red proofs run on 2026-09-13: planted a lost citation, a lost figure, an em-dash, an edit outside
evidence, a shape change, a paraphrased quote, a stale `old`, and a spaced en-dash. Each was caught,
and each file restored byte-identical to HEAD afterwards.

## The merge notes

| File | What it does |
|---|---|
| `links-todo.py` | Prints every cross-area duplicate with the kept card's options, each dropped card's options and the old note. |
| `links-apply.py` | Applies `{index: {keep, why, map, agree}}`; refuses card ids in the note, em-dashes, more than 55 words, a map that does not cover exactly the dropped cards, or an `agree` that contradicts the map. |
| `links-verify.py` | Checks the whole `_links.json` against the pinned copy; `--dump` prints every mapping side by side for a person to read. |

Needs `S/ev/_links.json` (pinned, from `git show 31603d1:decisions/v2/_links.json`) and
`S/card-index.json` (every card id with area, question, rec and option labels, built from the 15
area files).

## Triage (built, not yet used on the new plan)

| File | What it does |
|---|---|
| `triage-digest.py` | Prints a compact digest of the served cards per area: question, stakes, options with the recommendation starred, links, merged areas. |
| `triage-apply.py` | Writes `when`, `whenWhy` and `dependsOn` into the area files; refuses unknown ids, dropped cards, a bad `when`, a reason over 25 words, an em-dash, or a card id inside the reason. `--check` validates only. |

The `when` values in the uncommitted app changes are `spec`, `pilot`, `evidence`, `launch`, `task`.
The MVP plan changes what those should mean: see `docs/MVP-PLAN-2026-09-13.md` section 14.

## Checks

| File | What it does |
|---|---|
| `verify-labels.py` | After the label and diagram pass: rec, option order, prose, evidence, sources and diagram shape unchanged; prints every changed label for a person to read. |
| `invariants.py` | Pins per-card invariants before a parallel run. |
| `finalcheck.sh` | Rebuild, validator, citation survival (2,654 checked), and the voice gate on card text, exhibits and merge notes separately. |
| `voice-suite.sh` | Every sgnk writing check on one markdown file: `test_gate.py`, `gate.py` and `--strict`, `bands_lint.py`, `rhythm_lint.py`, `slop_scan.py`, `style_score.py`. |
| `verify-plan-claims.sh` | Re-checks the code, corpus and live figures the MVP plan relies on. |
| `render-check.sh` | Renders the local decisions page in headless Chrome over `file://` and reads the merge box and exhibits from the DOM. Needs to run outside the OS sandbox (Chrome needs its process ports). |
| `build-plan-page.mjs` | Renders `docs/MVP-PLAN-2026-09-13.md` into the self-contained page published as an artifact. Uses the repo's `marked` and `decisions/fonts.css`. |
