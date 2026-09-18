---
id: 13-SCREEN-STATE-MATRIX
title: Screen state matrix
mode: reference
tier: canonical
status: living
updated: 2026-09-18
owner: sagnik
verified_against: 0af3c90
covers: [screen-states]
---

# 13. Screen state matrix

**Thirty-eight screens against eleven states. 418 cells.** Every cell says whether that screen has
been told what to do in that state.

**The value of this file is the holes. There are 213 of them**, and not one screen is free of them.
Section 5 counts them and section 6 ranks the worst twenty-five.

## 1. What a cell means

Value | Meaning
`n/a` | The state cannot occur on this screen. Never a shrug. If it could occur, it is a hole
A screen id **matching the row** | The state is described inside that screen's own section of `docs/mvp0/SCREENS.md`
A screen id **different from the row** | The person is sent to that screen. `S24` offline, `S31` conflict, `S32` AI unavailable, `S33` over the cap, `S34` ideas empty
`SC10.3` | `docs/mvp0/SCREEN-CHANGES-2026-09-18.md`, section 10.3
`A+B` | Two sources together. The screen says something, and it also hands off
**HOLE** | Nobody has said what happens

**A hole is not a bug.** It is a question nobody has answered yet. Each one becomes a `States`
row in `12-screens/SNN.md`, which the screen template already requires.

## 2. The eleven states, defined

A cell is only checkable if the state is. These definitions are this file's, derived from the
`States` heading in `tools/SCREEN-TEMPLATE.md`, which names the same eleven.

- **first-run.** It is the first time this account has ever reached this screen.
- **empty.** The screen lists a kind of thing and there are none of them.
- **loading.** The screen has asked for something and it has not arrived.
- **partial.** Some of it arrived and some did not, or is still coming.
- **offline.** There is no network.
- **unauthorised.** Signed out, or signed in without the role or the plan this screen needs.
- **conflict.** Two versions of one thing disagree and neither has been chosen.
- **over-cap.** The account is at or past a plan limit that this screen's action would consume.
- **AI-unavailable.** Every provider in the chain has refused or timed out.
- **error.** The operation failed for a reason that is none of the above.
- **degraded.** The screen works, with something switched off, reduced or unavailable.

**The id column is bare in the two wide tables below**, without backticks, because twelve columns
of ticked text is unreadable. Every other file in the pack ticks its ids.

## 3. States a person meets on the way in

id | first-run | empty | loading | partial | offline | unauthorised
S01 | `S01` | n/a | **HOLE** | n/a | **HOLE** | n/a
S02 | `S02` | `S02` | **HOLE** | **HOLE** | **HOLE** | n/a
S03 | n/a | `S02` | **HOLE** | **HOLE** | **HOLE** | n/a
S04 | **HOLE** | **HOLE** | **HOLE** | **HOLE** | `S24` | **HOLE**
S05 | `S05` | **HOLE** | **HOLE** | **HOLE** | `S24` | **HOLE**
S06 | **HOLE** | `S06` | **HOLE** | **HOLE** | `S24` | n/a
S07 | **HOLE** | n/a | **HOLE** | **HOLE** | `S24` | n/a
S08 | n/a | **HOLE** | **HOLE** | n/a | **HOLE** | n/a
S09 | n/a | **HOLE** | **HOLE** | n/a | n/a | n/a
S10 | **HOLE** | **HOLE** | **HOLE** | **HOLE** | `S10` | n/a
S11 | **HOLE** | **HOLE** | **HOLE** | **HOLE** | `S24` | n/a
S12 | `S34` | `S34` | **HOLE** | **HOLE** | **HOLE** | n/a
S13 | **HOLE** | n/a | `S13` | `S13` | **HOLE** | n/a
S14 | **HOLE** | n/a | `S14` | **HOLE** | **HOLE** | **HOLE**
S15 | n/a | n/a | **HOLE** | **HOLE** | **HOLE** | **HOLE**
S16 | **HOLE** | **HOLE** | **HOLE** | n/a | n/a | n/a
S17 | **HOLE** | **HOLE** | **HOLE** | **HOLE** | **HOLE** | **HOLE**
S18 | n/a | **HOLE** | `S18` | n/a | **HOLE** | `S18`
S19 | **HOLE** | n/a | **HOLE** | **HOLE** | `S24` | **HOLE**
S20 | **HOLE** | **HOLE** | **HOLE** | **HOLE** | **HOLE** | **HOLE**
S21 | **HOLE** | **HOLE** | **HOLE** | **HOLE** | **HOLE** | **HOLE**
S22 | **HOLE** | **HOLE** | `S22` | `S22` | **HOLE** | **HOLE**
S23 | **HOLE** | **HOLE** | **HOLE** | **HOLE** | **HOLE** | **HOLE**
S24 | **HOLE** | n/a | **HOLE** | `S24` | `S24` | **HOLE**
S25 | `S25` | **HOLE** | **HOLE** | **HOLE** | `S25` | **HOLE**
S26 | `S26` | n/a | **HOLE** | n/a | **HOLE** | **HOLE**
S27 | **HOLE** | n/a | **HOLE** | n/a | n/a | n/a
S28 | **HOLE** | n/a | **HOLE** | **HOLE** | **HOLE** | **HOLE**
S29 | **HOLE** | n/a | **HOLE** | **HOLE** | **HOLE** | n/a
S30 | **HOLE** | **HOLE** | **HOLE** | **HOLE** | n/a | **HOLE**
S31 | n/a | n/a | **HOLE** | **HOLE** | **HOLE** | n/a
S32 | n/a | n/a | n/a | **HOLE** | `S24` | n/a
S33 | n/a | n/a | n/a | **HOLE** | **HOLE** | n/a
S34 | `S34` | `S34` | n/a | n/a | **HOLE** | n/a
S35 | **HOLE** | n/a | **HOLE** | **HOLE** | **HOLE** | **HOLE**
S36 | **HOLE** | n/a | **HOLE** | **HOLE** | **HOLE** | **HOLE**
S37 | **HOLE** | n/a | **HOLE** | n/a | **HOLE** | **HOLE**
S38 | **HOLE** | **HOLE** | **HOLE** | **HOLE** | **HOLE** | **HOLE**

## 4. States a person meets when something goes wrong

id | conflict | over-cap | AI-unavailable | error | degraded
S01 | n/a | n/a | n/a | **HOLE** | **HOLE**
S02 | n/a | n/a | n/a | **HOLE** | **HOLE**
S03 | n/a | `S33` | n/a | **HOLE** | **HOLE**
S04 | `S31` | `S33` | `S32` | **HOLE** | **HOLE**
S05 | `S31` | n/a | n/a | **HOLE** | **HOLE**
S06 | n/a | `S06+S33` | `S32` | **HOLE** | **HOLE**
S07 | **HOLE** | `S33` | `S32` | **HOLE** | `S07`
S08 | n/a | n/a | n/a | **HOLE** | **HOLE**
S09 | n/a | n/a | n/a | **HOLE** | n/a
S10 | n/a | **HOLE** | **HOLE** | **HOLE** | `S10`
S11 | n/a | `S33` | `S32` | **HOLE** | **HOLE**
S12 | n/a | `S33` | `S32` | **HOLE** | **HOLE**
S13 | n/a | `SC10.3+S33` | `SC10.3` | **HOLE** | `SC10.3`
S14 | n/a | `S33` | `S32` | **HOLE** | `S14`
S15 | **HOLE** | `S33` | `S32` | **HOLE** | **HOLE**
S16 | n/a | `S16` | n/a | **HOLE** | **HOLE**
S17 | **HOLE** | `S17+S33` | n/a | **HOLE** | `S17`
S18 | **HOLE** | **HOLE** | n/a | **HOLE** | `S18`
S19 | `S31` | `S19+S33` | n/a | **HOLE** | **HOLE**
S20 | `S31` | n/a | n/a | **HOLE** | `S20`
S21 | n/a | `S21+S33` | n/a | **HOLE** | `S21`
S22 | **HOLE** | **HOLE** | n/a | `S22` | `S22`
S23 | `S23` | `S23` | n/a | **HOLE** | **HOLE**
S24 | `S31` | **HOLE** | `S24` | **HOLE** | `S24`
S25 | `S31` | `S25` | `S24` | **HOLE** | `S25`
S26 | n/a | **HOLE** | n/a | **HOLE** | `S26`
S27 | **HOLE** | n/a | n/a | n/a | n/a
S28 | **HOLE** | n/a | n/a | **HOLE** | `S28`
S29 | n/a | `S29+S33` | n/a | **HOLE** | **HOLE**
S30 | **HOLE** | n/a | n/a | **HOLE** | **HOLE**
S31 | `S31` | **HOLE** | **HOLE** | **HOLE** | **HOLE**
S32 | n/a | **HOLE** | `S32` | `S32` | `S32`
S33 | n/a | `S33` | **HOLE** | **HOLE** | `S33`
S34 | n/a | n/a | **HOLE** | n/a | n/a
S35 | **HOLE** | n/a | n/a | **HOLE** | `S35`
S36 | **HOLE** | `S36` | `S36` | **HOLE** | `S36`
S37 | **HOLE** | n/a | n/a | **HOLE** | `S37`
S38 | **HOLE** | `S38` | n/a | **HOLE** | **HOLE**

## 5. The count

Kind | Cells | Share
Total | **418** | 38 screens times 11 states
`HOLE` | **213** | 51 per cent
`n/a` | **116** | 28 per cent
Specified somewhere | **89** | 21 per cent

**These were counted by a script, not by eye.** The matrix above was written once as data, and the
tables, the totals and both rankings below were all emitted from it. The script is reproduced in
section 9 so the numbers can be re-derived rather than trusted.

### Holes by state, worst first

State | Holes | Out of | Reading
error | **34** | 38 | Nothing anywhere says what a failure looks like. No screen was drawn for it.
loading | **31** | 38 | Only S13, S14, S18 and S22 say what waiting looks like.
partial | **26** | 38 | The half-arrived case, which is the one that corrupts a document.
offline | **24** | 38 | S24 exists, and most screens do not name it as their answer.
first-run | **23** | 38 | S02 covers Home. Nothing covers the first time in the workspace.
unauthorised | **19** | 38 | Includes every Pro screen a Free account can reach.
degraded | **17** | 38 | The toggle, the fallback, the reduced mode.
empty | **16** | 38 | S34 covers ideas. Nothing covers an empty project, panel or list.
conflict | **12** | 38 | S31 exists and closes most of it.
over-cap | **7** | 38 | S33 exists and closes most of it.
AI-unavailable | **4** | 38 | S32 exists and closes almost all of it.

**The finding, and it is the argument for drawing more state screens.** The three columns with a
whole screen of their own are the three best columns. `AI-unavailable` has four holes because S32
exists. `over-cap` has seven because S33 exists. `conflict` has twelve because S31 exists. The three
worst columns, `error` at 34, `loading` at 31 and `partial` at 26, have no screen at all. **Drawing
the state as a screen is what closed the column.** An error screen and a waiting state would do more
for this matrix than any amount of per-screen prose.

### Holes by screen, worst first

Screens | Holes each
`S38` | 9
`S17`, `S23`, `S30` | 8
`S04`, `S10`, `S15`, `S20`, `S21`, `S28`, `S31`, `S35`, `S36` | 7
`S05`, `S11`, `S19`, `S22`, `S29`, `S37` | 6
`S02`, `S03`, `S06`, `S07`, `S08`, `S12`, `S14`, `S16`, `S18`, `S24`, `S25`, `S26` | 5
`S01`, `S33` | 4
`S09`, `S13`, `S27` | 3
`S32`, `S34` | 2

**No screen has zero holes.** Not one, including the four drawn as states.

## 6. The twenty-five holes most likely to be hit

**Ranked by how likely a person is to meet the state, not by how bad it is.** The ranking is a
judgement and is marked as one. The state itself, and whether it is specified, are facts from the
matrix.

### Tier one. Met on the first day, by almost everybody

Rank | Hole | Why a person lands there
1 | `S10` empty | A document with nothing wrong with it. That is the normal document, so this is the normal panel
2 | `S20` empty | No changes waiting. That is the resting state of the change queue
3 | `S27` loading | The moment before the stored theme resolves. Every cold load on a dark account
4 | `S04` first-run | The first time in the workspace, no project and no document. S02 covers Home, not this
5 | `S04` empty | A project with no documents in it, which is every project for its first minute
6 | `S08` error | A Mermaid block that does not parse. Anybody who types a diagram meets this before they finish typing
7 | `S23` empty | Nothing connected. That is the default state of Connections for every new account
8 | `S17` empty | Nobody shared with yet. The default state of Share
9 | `S21` empty | A document with one version, which is every document until the second save
10 | `S06` loading | The model is thinking. Every AI call passes through this and nothing describes it

### Tier two. Met in the first week

Rank | Hole | Why a person lands there
11 | `S22` over-cap | `docs/mvp0/PRODUCT-PLAN.md:1099` says an imported vault is hundreds of files against a Free cap of 50. A Free import crossing the cap part way is the expected case, not an edge
12 | `S14` unauthorised | A Free account opening Medium or High. The depth selector is deliberately one control, so reaching a Pro depth from Free is one click
13 | `S30` unauthorised | A Free account opening the portfolio, which is Pro
14 | `S04` error | A save that fails. The one state where the projection law is at stake
15 | `S29` error | A payment that fails, and `docs/mvp0/PRODUCT-PLAN.md:641` says an Indian card gets one attempt
16 | `S23` unauthorised | A revoked GitHub or Drive token, which happens without the person doing anything
17 | `S11` empty | A project with no instruction file, which is most projects
18 | `S16` empty | A project with one document, so the map is a single dot
19 | `S18` error | A link that expired, was revoked, or points at nothing. Sent to somebody who is not a user
20 | `S31` AI-unavailable | Let AI decide, with no provider answering. The one repair offered on the conflict screen

### Tier three. Rare, and expensive when it happens

Rank | Hole | Why it matters more than its frequency
21 | `S20` error | Accepting a change whose anchor moved. This is the splice refusal, and it is the product's whole differentiation showing up as an error message nobody has written
22 | `S35` unauthorised | A non-founder reaching the configuration panel, which sets every limit for every account
23 | `S31` over-cap | Keep both creates a document, and the account may be at 50. A conflict repair that is refused is a conflict that stays
24 | `S15` error | The tarball hash does not match the one printed on the page. The kickoff prompt's only safety check, with no screen behind it
25 | `S28` conflict | Two devices changing one setting. Settings live on the account, so this is a real race with no rule

## 7. How to close a hole

A hole is closed by writing one row, not by building anything. The steps, in order:

1. Open `12-screens/SNN.md` for the screen, and find its `States` heading.
2. Write a row: the state, when it happens, what is shown, and what the person can do next.
3. If the answer is a message, do not write the message here. Give it a copy id and put the words in
   `16-COPY-DECK.md`, which is their one home.
4. If the answer is a refusal, give it an error id from `17-ERROR-AND-REFUSAL-CATALOGUE.md`. A
   refusal is a correct outcome for this product, so it deserves a number and a sentence.
5. If the answer is another screen, name that screen and say what the person sees on the way.
6. Change the cell in this file from **HOLE** to the place you wrote it, and re-run section 9.

**A hole may also close by turning out to be `n/a`.** That is a real answer, and it is cheaper than
a screen. Write the reason on the screen's `States` row rather than deleting the question.

## 8. What this matrix does not settle

- **Not assessed:** severity. A hole is counted the same whether it loses a document or shows a
  blank box. `17-ERROR-AND-REFUSAL-CATALOGUE.md` carries severity.
- **Could not be verified:** what the shipped code does in these states. Every cell is read from
  `docs/mvp0/SCREENS.md`, `docs/mvp0/PRODUCT-PLAN.md` and
  `docs/mvp0/SCREEN-CHANGES-2026-09-18.md`. A screen may already handle a state in code without
  anybody having written it down, and this file would still call it a hole. That is deliberate: the
  pack is the specification, and an undocumented behaviour is not a specification.
- **Not established:** the `n/a` column. 116 cells say a state cannot occur. Each is a judgement
  made once, in this session, and a reviewer should attack that column first, because a wrong `n/a`
  hides a hole where a wrong `HOLE` only makes work.
- **Contested:** whether `first-run` is a state or a screen. S02 is a screen for the first run of
  Home. Nothing equivalent exists for the workspace, and rank 4 above is the result.
- **What would falsify the count:** editing the matrix without re-running the script. Anybody who
  changes a cell must re-emit section 5 from section 9, because a hand-adjusted total is exactly the
  failure `AGENTS.md` rule 3 exists to stop.

## 9. How to re-derive every number here

The matrix was held as one Python dictionary of 38 rows by 11 columns, and everything in sections 3
to 6 was printed from it. To re-derive, rebuild the dictionary from the tables in sections 3 and 4
and run:

```python
COLS = ["first-run","empty","loading","partial","offline","unauthorised",
        "conflict","over-cap","AI-unavailable","error","degraded"]
H = "HOLE"
M = { ... }                      # 38 rows, 11 values each, from sections 3 and 4
assert len(M) == 38
for k, v in M.items():
    assert len(v) == 11, k
holes = [(s, COLS[i]) for s, row in M.items() for i, c in enumerate(row) if c == H]
print("cells", 38 * 11,
      "holes", len(holes),
      "n/a", sum(1 for r in M.values() for c in r if c == "n/a"),
      "specified", sum(1 for r in M.values() for c in r if c not in (H, "n/a")))
import collections
print(collections.Counter(c for _, c in holes))       # holes by state
print(collections.Counter(s for s, _ in holes))       # holes by screen
```

**It printed** `cells 418 holes 213 n/a 116 specified 89` on 18 September 2026. The two counters
produced the two rankings in section 5 exactly as they are printed there.
