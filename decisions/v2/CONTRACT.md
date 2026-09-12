# The decision-card contract

You are rewriting one area of the frontmatter decision set. Read this whole file before you
write anything. Every field is specified. Nothing here is a suggestion.

## What frontmatter is

A byte-exact markdown editor for repositories whose documents are increasingly written by AI
agents, built by Studio Zephyrus (Sagnik and Amit, a two-person studio in India).

Three things are load-bearing and true:

- **The projection law.** The file on disk is the only source of truth. Every view is a
  deterministic, stateless projection of it. Nothing is stored that the file does not already say.
- **Splice-only writing.** The engine locates a byte range and replaces exactly those bytes. It
  never rewrites a whole file. When the range is ambiguous it REFUSES rather than guess.
- **Review state.** A sidecar at `.frontmatter/review.jsonl` records which spans a person has
  read, keyed by content hash. The current headline claim, and it failed its own adversarial
  round on 8 September 2026 — see the exemplar.

The plan is honest about being unproven. Match that. A decision card that oversells is worse
than useless, because the whole point is to decide well.

## The shape

Return an array of objects. Every object has exactly these keys.

```js
{
  id:      "P2",                    // keep the existing id when the question survives; see MERGING
  cat:     "Product & definition",  // unchanged, exactly as given to you
  sub:     "Definition",            // short group name within the area
  weight:  "critical",              // critical | high | medium — see WEIGHT
  q:       "…?",                    // THE QUESTION. Ends in ?. See VOICE.
  lede:    "…",                     // ONE sentence, max 140 chars. Why this is being asked now.

  visual:  { kind: "...", ... },    // REQUIRED. See VISUALS.
  stakes:  "…",                     // ONE sentence: what breaks if this goes the wrong way.

  state:   ["…", "…"],              // 2–4 bullets. Where it stands TODAY, with file:line refs.
  path:    ["…", "…"],              // 2–4 bullets. How it got here.
  tension: ["…", "…"],              // 2–4 bullets. What actually forces a choice.

  evidence: [ … ],                  // keep the existing evidence blocks; see EVIDENCE.

  options: [{
    k:       "a",                   // a, b, c, d in order
    label:   "…",                   // the choice itself. Max 80 chars. No trailing full stop.
    what:    "…",                   // ONE sentence: what this literally means in the product.
    gains:   ["…", "…"],            // 2–3 bullets. Max 90 chars each.
    costs:   ["…", "…"],            // 2–3 bullets. Max 90 chars each.
    system:  "…",                   // ONE line: effect on engine, schema, or build. Or "No change."
    screens: "…",                   // ONE line: what screens this creates, changes or kills.
    money:   "…"                    // ONE line: cost or revenue effect. Or "None."
  }],

  rec:     "b",                     // the recommended key
  recCase: ["…", "…"],              // 2–4 bullets. Why that one.
  flip:    "…",                     // ONE sentence: the specific finding that would overturn it.

  linked:  ["P7", "E4"],            // ids of decisions that must be taken with this one. May be [].
  sources: ["docs/FILE.md:120"]     // keep and extend the existing citations
}
```

Bullets are strings. No nested objects inside bullets. No markdown headings anywhere. Inline
`` `code` `` and **bold** are fine and render.

## VOICE — this is the part most likely to go wrong

The reader is Sagnik. He wrote most of the source material. He will notice padding immediately.

**Write like this:**
- "Do we still lead with review state, narrow it, or lead with something else?"
- "Thirteen extensions already ship this exact sentence and total 1,217 installs."
- "Narrowing costs nothing today because nothing is built."

**Never write like this:**
- "It is important to note that…", "This raises the question of whether…"
- "leverage", "unlock", "seamless", "robust", "delve", "landscape", "ecosystem" (as a vague noun),
  "holistic", "streamline", "empower", "game-changing", "best-in-class"
- "Moreover", "Furthermore", "Additionally", "That said," as a sentence opener
- Triads for rhythm: "clear, concise, and compelling"
- "not just X, but Y" — the single most obvious tell
- Rhetorical questions inside a body field
- Any sentence that would survive unchanged in a different product's document

**Rules that are easy to check and so will be checked:**
- No em-dash-heavy prose. At most one em dash per field.
- No sentence longer than 28 words in any bullet.
- Every number carries its source in the same bullet or in `sources`.
- British spelling, matching the corpus: "behaviour", "licence" (noun), "recognise", "artefact".
- Say "we" for the studio, "you" for the reader, never "the user" when "you" fits.

## MERGING — the point of this pass

You will receive N questions for your area. Several will be the same decision asked twice, or a
decision and its own sub-clause. **Merge them.**

- When two or more questions collapse into one, keep the **lowest** id (P4 + P9 → P4) and list
  the absorbed ids in `sources` as `"merged: P9"`.
- Merge when the answers are the same set of choices, or when answering one forces the other.
- Do NOT merge when two questions genuinely have different option sets, even if adjacent.
- Do NOT merge across areas. Instead put the other area's id in `linked`.
- Expect to reduce your area by roughly 15–35%. If you merge nothing, you probably did not read
  carefully. If you merge more than half, you are destroying decisions.

Also: **drop anything that is not a decision.** Some entries are research tasks in disguise
("find out whether X"). A decision has options a person could choose between today. If it is a
task, drop it and note the id in your `dropped` list with a one-line reason.

## VISUALS — every question gets one

Pick the primitive that actually explains the decision. A wrong-but-pretty diagram is worse than
none. Ten kinds are available:

| kind | use it when | shape |
|---|---|---|
| `screen` | the decision is about what a surface shows | `{kind:'screen', title, panes:[{label,w,rows:[{label,meta,mark,tone}]}], note, caption}` |
| `flow` | it is a sequence, or a fork in one | `{kind:'flow', nodes:[{label,note,tone,edge,dashed}], perRow, note, caption}` |
| `state` | it is a lifecycle | `{kind:'state', states:[{label,meta,via,tone,current}], note, caption}` |
| `compare` | there are 2–3 options to hold against each other | `{kind:'compare', labelWidth, cols:[{title,tone}], rows:[{label,cells:[]}], note, caption}` |
| `ba` | something changes from one state to another | `{kind:'ba', before:{title,lines:[{t,mark}]}, after:{…}, via, note, caption}` |
| `arch` | it is about which layer owns something | `{kind:'arch', layers:[{label,items:[],side,tone}], note, caption}` — order bottom-up |
| `timeline` | dates carry the argument | `{kind:'timeline', items:[{when,label,note,tone}], note, caption}` |
| `matrix` | it is about positioning against the field | `{kind:'matrix', x:[lo,hi], y:[lo,hi], points:[{label,x,y,us}], note, caption}` — x/y are 0–1 |
| `file` | it is about bytes, spans, or markdown syntax | `{kind:'file', name, lines:[{t,mark,note}], note, caption}` |
| `funnel` | a count collapses through stages | `{kind:'funnel', steps:[{label,n,unit,tone}], note, caption}` |

`tone` is one of: `neutral`, `sunk`, `accent`, `good`, `warn`, `stop`. Use `accent` for the thing
being proposed, `stop` for a hard failure, `warn` for a risk, `sunk` for background machinery.

Constraints, because the renderer computes geometry from these:
- `screen`: at most 3 panes, at most 5 rows per pane, row labels under 60 chars.
- `flow`: at most 8 nodes, labels under 40 chars, notes under 50.
- `state`: at most 4 states, labels under 18 chars, `via` under 12 chars.
- `compare`: at most 3 columns, at most 6 rows, cells under 70 chars.
- `matrix`: at most 7 points, exactly one with `us:true`.
- `file`: at most 12 lines, each under 52 chars.
- `funnel`: at most 6 steps, `n` must be a real number from the corpus.
- Every visual carries a `caption` — one line, under 70 chars, saying what it shows.
- **Never invent a number for a diagram.** If the corpus has no number, use a `flow`, `compare`,
  `screen` or `ba`, which need none.

## EVIDENCE

Keep the evidence blocks that already exist on the questions you keep. They are `stat`, `table`
and `bars` types and they are already correct — do not rewrite them, do not invent new ones, do
not fabricate figures. When you merge two questions, concatenate their evidence arrays and drop
exact duplicates. You may drop an evidence block only if it belonged to a dropped question.

## WEIGHT

- `critical` — blocks other work, or is expensive to reverse after week 2.
- `high` — shapes a surface or a price, reversible but costly.
- `medium` — everything else.

Keep the existing weight unless merging changes it. Do not inflate: an area where everything is
critical tells the reader nothing.

## What you return

A single JSON object:

```json
{
  "cat": "<your area, exactly as given>",
  "questions": [ … ],
  "merged":  [{"kept":"P4","absorbed":["P9","P17"],"why":"same option set"}],
  "dropped": [{"id":"P21","why":"a research task, not a decision"}],
  "added":   ["P23"],
  "notes":   "anything the coordinator needs to know"
}
```

`added` lists ids of genuinely new decisions you created because the source material implies a
choice nobody wrote down. New ids continue your area's existing prefix and numbering.

## Read before you write — and mind the budget

Token budget is real on this run. Read these three in full and nothing else in full:

1. This contract.
2. The research briefing named in your prompt.
3. Your area's current questions (the JSON file named in your prompt).

`docs/PRODUCT-BRIEF.md` is the current plan and is only 560 lines — read it in full too.

**Everything else in `docs/` is enormous** (`FRONTMATTER-PRD-v2-2026-08-29.md` is 760 KB,
`ENGINE.md` 258 KB, `CRITIQUE.md` 246 KB, `DEV-PLAN.md` 244 KB, and two RECORD files are
2–3 MB). **Never open one of those with Read.** Use `grep -n` for the term you need and then
`sed -n 'START,ENDp'` for the twenty lines around a hit. `docs/GAPS-2026-09-08.md` (21 KB) and
`docs/DECIDE.md` (13 KB) are small and may be read whole.

Every `file:line` citation you write must be real. Check it with `sed -n 'Np' <file>` before you
cite it — that is one cheap command, not a file read. A fabricated citation is the worst failure
available to you here and it is checked mechanically afterwards. When in doubt, cite the file
with no line number.

Do not re-verify the research. It is done. Take the briefing's numbers as given, and use only
those it marks usable.
