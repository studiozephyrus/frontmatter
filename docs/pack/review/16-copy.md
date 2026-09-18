---
id: 16-copy
title: Resolution log for 16, the copy deck
mode: reference
tier: canonical
status: living
verified_against: e0f6f89
updated: 2026-09-18
owner: sagnik
covers: [review-16-copy]
---

# Resolution log for 16, the copy deck

Every row of `16-COPY-DECK.md` marked `[new]` proposed, and every `UNVERIFIED:` claim in it, and how
each was treated on 18 September 2026 under `docs/pack/tools/RESOLVE-BRIEF.md`. One row per item,
written as each item was finished. Line numbers are the file's lines at `e0f6f89`, before this pass.

**What each proposed row was checked against.**

- Its screen spec in `12-screens/`, and the drawn screen in `docs/mvp0/screens/gen.mjs` (grep only).
- The house voice: plain, calm, British spelling, no exclamation marks, no marketing verbs, no em or
  en dashes, and a refusal that says what happened and what the person can do, without blame.
- Its length budget, counted the deck's way: each variable as two characters.
- The standing promises, which keep their exact wording.

A row that passed kept its string and only gained the mark `proposed, voice-checked 18 Sep`. A row
that failed was fixed, marked the same way, and is logged below with the old and new wording.

## Changes, UNVERIFIED claims and findings

file | id or line | the open point | what you did | basis | needs founder (yes/no)
--- | --- | --- | --- | --- | ---
16 | `K.s02.desktop.note`, line 214 | proposed wording. | Old: "Documents on this computer have no cap." New: "Documents on this computer have no limit." Why: "cap" is our internal word; the person-facing words are "Unlimited" (`K.s02.caps`) and "limit" (S33). | S02 spec line 160; `K.s02.caps`. | no.
16 | `K.s06.firstrun`, line 361 | proposed wording. | Old: "Each answer the box gives uses 1 edit credit, and only when it succeeds. Nothing is deducted for a failed call." New: "Each answer uses 1 edit credit, even if you reject it. Nothing is deducted for a failed call." Why: the ledger entry is written when the call returns, not on Accept, so the old line hid that a rejected answer is charged; rule 7 wants the cost said before the click. "the box" is our name for the screen. The promise sentence is kept verbatim. | `12-screens/S06.md` Data contract: "A ledger entry is written when a call returns, not when Accept is pressed". | no.
16 | `K.s07.refused`, line 411 | proposed wording. | Old ending: "Select it again and ask again." New ending: "Select it and ask again." Why: "again" twice in six words. | voice. | no.
16 | `K.s08.chart.nonumbers`, line 427 | proposed wording. | Added a third sentence: "Add a column of plain numbers to draw it." Why: a refusal says what to do, and the old row stopped at why. "Plain" because 1,200 and 12% are refused as numbers. | deck rule 6; `66-FORMAT-SPECIFICATIONS.md` section 4.4, reading the table. | no.
16 | `K.s08.chart.kind`, line 428 | proposed wording, and `UNVERIFIED:` the list of supported kinds is not written in the plan. | Claim confirmed, tag replaced with `[O]`. Old string: "This version cannot draw a {kind} chart, so the block is shown as its source." New: "This block names no chart kind this version can draw, so it is shown as its source. Check the kind line in the block." Why: 66 section 4.4 sends a missing `kind` here too, where `{kind}` would print empty; and a refusal needs what to do. | `[O]` `grep -n -i chart docs/mvp0/PRODUCT-PLAN.md` (lines 251, 273, 438, 955, 1608: no kinds); `66-FORMAT-SPECIFICATIONS.md` lines 541 and 548; `12-screens/S08.md` line 205, D22. | no; D22 itself is Sagnik's, owned by S08 and 66.
16 | `K.s08.mermaid.failed`, line 429 | proposed wording. | Added: "Fix the text and it draws again." and a comma before "and nothing". Why: a refusal says what to do; the old row stopped at what happened. | deck rule 6. | no.
16 | `K.s08.maths.failed`, line 430 | proposed wording. | The same change as `K.s08.mermaid.failed`, so the two stay one shape. | deck rule 6. | no.
16 | `K.s09.nophases`, line 466 | proposed wording. | Old: "Add a heading, or read it in Page view." New: "Add one, or read it in Page view." Why: any heading is not enough; only an H2 makes a phase, and "one" points back at "H2 headings". | `12-screens/S09.md` line 123, empty state. | no.
16 | `K.s11.regenerate.confirm`, line 566 | proposed wording. | Old: "Replace {file} with a fresh copy of {source}? Anything written only in {file} will be lost." New: "Replace {file} with a fresh copy of {source}? {file} has no edits of its own, so nothing is lost." Why: the spec refuses regeneration whenever the copy has hand edits, so this confirmation only appears when nothing would be lost; the old line warned of a loss that cannot happen. | `12-screens/S11.md` lines 142 and 228, `E118`. | no.
16 | `K.s20.readonly`, line 858 | proposed wording. | Old: "Your role on this document can read and reply, but not accept changes." New: "Your role lets you read and reply here, but not accept changes." Why: a role does not read; the person does. | voice. | no.
16 | `K.s24.storage.full`, line 999 | proposed wording. | Old ending: "Sync, or free up space, before you type more." New ending: "Free up space, or reconnect so your edits sync, before you type more." Why: S24 is the offline screen, so "Sync" named an action the person cannot take there; freeing space is the one they can take now. | `12-screens/S24.md` line 100 and Out row (sync happens on reconnection). | no.
16 | `K.s25.update.refused`, line 1009 | proposed wording. | Old: "...its signature did not check out..." New: "...its signature could not be verified..." Why: "did not check out" is an idiom; "could not be verified" is plainer and does not accuse the file. | voice. | no.
16 | `K.s28.account.delete`, line 1079 | proposed wording. | Added: ", so export anything you want to keep first." Why: a caution names the exit, and export is on the same Settings page; it keeps the "readable and exportable" promise in view at the one moment it matters most. | `12-screens/S28.md` lines 128 and 138 (export is a Settings row). | no.
16 | `K.s28.degraded`, line 1081 | proposed wording. | Old: "Keep working, nothing is lost on this device." New: "Keep working. Nothing is lost on this device." Why: a comma joined two sentences; the spec's own wording is two sentences. | `12-screens/S28.md` line 144. | no.
16 | `K.s19.unshared`, line 828 | proposed wording. | Old ending: "stays readable and can be exported." New ending: "stays readable and exportable." Why: the standing promise is "Every document stays readable and exportable"; the row now uses its exact words. | brief, standing promises; `K.promise.readable` notes. | no.
16 | `K.s31.aidown`, line 1202 | proposed wording. | Old ending: "nothing was spent." New ending: "nothing was charged." Why: the standing promise at the moment of failure says "nothing was charged" (`K.promise.untouched`); one word for one fact. | brief, standing promises. | no.
16 | `K.s32.offline`, line 1246 | proposed wording. | Old: "You are offline, so AI cannot be reached. The providers did not refuse. Reconnect, or use the local model on the desktop app." New: "You are offline, so AI cannot be reached. Reconnect, or use the local model in the desktop app." Why: "The providers did not refuse" explains our internal distinction, not anything the person can act on; the first sentence already says the cause. | `12-screens/S32.md` line 183; `K.s24.aioff`. | no.
16 | `K.s33.exit.wait`, line 1273 | budget class. | String unchanged. Class moved from `label` (28) to `lede`, like its sibling exits `K.s33.exit.desktop` and `K.s33.exit.pro`. Why: with a real date such as "30 September" the line reaches 34 characters, over the `label` ceiling. | deck section 0.3; sibling rows at lines 1271 and 1272. | no.
16 | `K.s34.overcap`, line 1312 | proposed wording. | Old: "...is used. If you start now, the standard question set is used, or you can wait for the reset on {date}..." New: "...is used up. You can start now with the standard question set, or wait for the reset on {date}..." Why: "used" twice in two clauses, and the passive hid who does what; "used up" matches `K.s13.standardset.why`. | voice; `12-screens/S34.md` line 149. | no.
16 | `K.s35.confirm.lower`, line 1386 | proposed wording. | Old: "Nothing of theirs is removed, and they cannot..." New: "Everything they have stays readable and exportable, and they cannot..." Why: the over-cap consequence is the standing promise, and plan section 30 states it in those words. | `docs/mvp0/PRODUCT-PLAN.md` section 30, "A limit that falls is a downgrade". | no.
16 | `K.s38.search.nomatch`, line 1430 | budget class. | String unchanged. Class moved from `label` (28) to `lede`. Why: `{query}` is an email address, so a real value passes 28 at once ("No account matches priya.sharma@example.com." is 44); the spec calls it a line, not a label. | `12-screens/S38.md` line 140. | no.
16 | `K.s30.handle.claim`, line 1160 | `UNVERIFIED:` the shape a handle accepts is not written in the plan or the S30 spec beyond being case-folded. | Claim confirmed, tag replaced with `[O]`. String unchanged: it passed the voice check. | `[O]` `grep -n -i handle docs/mvp0/PRODUCT-PLAN.md` (lines 274, 698, 699, 956, 1020, 1045: no shape); `12-screens/S30.md` line 95; `17-ERROR-AND-REFUSAL-CATALOGUE.md` line 220; `66-FORMAT-SPECIFICATIONS.md` line 347; `grep -rli 'portfolio\|HandleRegistry' src specs` returns 0 files. | no; the shape itself is S30's open point.
16 | `K.s02.greeting`, line 184 | `UNVERIFIED:` nobody has specified the morning, afternoon and evening boundaries, or their timezone. | Claim confirmed, tag replaced with `[O]` in the notes. The row is `[gen]`, not proposed, so its string and status were not touched; only the tag the user named was resolved. | `[O]` `grep -n -i 'good evening\|good morning\|afternoon\|greeting'` over `docs/mvp0/PRODUCT-PLAN.md`, `docs/mvp0/SCREENS.md`, `docs/mvp0/SCREEN-CHANGES-2026-09-18.md`, `12-screens/S02.md`, `12-screens/S03.md` and `docs/mvp0/screens/gen.mjs`: only gen.mjs lines 984 and 999 and S02 line 51; `grep -rn -i greeting src` returns nothing. | no; the boundaries are S02's to set.
16 | `K.s10.check.spelling` (line 511) and `K.s11.capunknown` (line 573) | budget with a real value. | Strings unchanged; finding recorded. By the deck's count (a variable as two characters) both fit `label` 28. With real values they do not: "Possible misspelling: dependency" is 32 and "Size limit unknown for Claude Code" is 34. Their drawn sibling titles are already over 28 in `[gen]` rows (`K.s10.table` 46, `K.s11.size` 34), so the check-row title is drawn wider than the `label` class allows. Not fixed here because the fix is a new budget class for check-row titles, which touches approved rows. | `[O]` lengths by `python3 len()`; deck lines 490 and 543. | no; it is a layout rule, but it changes approved rows, so it is left for the deck owner.

## Rows that passed unchanged, per screen

These kept their string, tone and budget, and gained only the mark `proposed, voice-checked 18 Sep`.
Counts are from a script over the deck after the changes above, not by hand.

screen | rows passed unchanged
--- | ---
S01 | 1
S03 | 8
S04 | 2
S05 | 8
S06 | 3
S07 | 1
S08 | 6
S09 | 4
S10 | 8
S11 | 3
S13 | 6
S14 | 2
S15 | 3
S16 | 2
S17 | 3
S18 | 2
S19 | 4
S20 | 3
S21 | 4
S22 | 3
S23 | 4
S24 | 2
S25 | 1
S26 | 5
S27 | 6
S28 | 1
S29 | 3
S30 | 6
S31 | 4
S32 | 4
S33 | 3
S34 | 1
S35 | 1
S36 | 4
S37 | 1
S38 | 8
**total** | **130**

## Totals

- **Proposed rows checked: 152.** Wording changed on 19, budget class changed on 2
  (`K.s33.exit.wait`, `K.s38.search.nomatch`), `UNVERIFIED:` tag resolved on 1 with the string
  kept (`K.s30.handle.claim`), and 130 passed unchanged. 19 + 2 + 1 + 130 = 152.
- **UNVERIFIED claims checked: 3.** All three held and now carry `[O]` evidence:
  `K.s08.chart.kind`, `K.s30.handle.claim` and `K.s02.greeting`. None was false, none is still
  unverified.
- **Decisions resolved: 0.** The deck's `open:` style points are not rows and were not in scope.
- **Needs founder: 0.** Every row still needs the founders' review of final wording, which is what
  the new mark asks for.

## Limits of this log

- **Not checked on a device.** Budgets are character counts, not measured widths at 390 px.
- **Not checked against a translator.** Plural rules on `{n}`, `{done}` and `{files}` are noted in
  the deck and not written.
- **The voice check is one reader's.** It follows the deck's section 0.4 and the brief, and was not
  run past the founders or a second reviewer.
- **What would falsify a change here:** a spec line showing the old wording was required, for
  example a regenerate confirmation that can appear over hand edits.
