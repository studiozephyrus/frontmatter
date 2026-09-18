---
id: 45-UX-AUDIT
title: Screens audit
mode: explanation
tier: canonical
status: living
verified_against: f237ece
updated: 2026-09-18
owner: sagnik
covers: [ux-findings]
---

# 45. Screens audit

Findings from reading `docs/mvp0/screens/gen.mjs` and the rendered screens, as they are now. Each one
names a screen, an element, the line that causes it, and a fix.

**This audits the present state, not the founders' review.** `docs/mvp0/SCREEN-CHANGES-2026-09-18.md`
is the review of 18 September and most of it is applied. Nothing below repeats a note from it. Every
finding here is a mechanical defect in the generator or in what it produced.

## 1. What was audited, and how

Thing | Detail
Generator | `docs/mvp0/screens/gen.mjs`, 1,760 lines, 38 screens declared, 76 files emitted
Renderer | `docs/mvp0/screens/render.mjs`, 39 lines, headless Chrome
Output | 76 HTML files and 76 PNG files at 1440 by 900 and 390 by 844, rendered at twice the scale
Read in full | The generator, the renderer, all 88 icon files, and the emitted HTML for the sign-in screen
Images opened by hand | `s01-sign-in.png`, `s20-review.png`, `s33-over-cap.png`
Images opened by a second read-only pass | three more, listed in section 11

**No browser was driven and no geometry was measured**, so every clipping finding rests on a rule in
the stylesheet plus the rendered image. Section 11 says which findings that limits.

## 2. Findings, by impact

Id | Severity | Screen | One line | Section
`UX-001` | HIGH | S01 | The Google mark on the primary sign-in button renders as one blue wedge | 3
`UX-002` | HIGH | S20 | The diff a reviewer is asked to accept is cut off mid-word | 4
`UX-003` | HIGH | S33 | The blocking dialogue dims only the editor column, so a live-looking control sits bright beside it | 5
`UX-004` | HIGH | 9 screens | Every AI control loses its icon, because two icons render at a fiftieth of their size | 6
`UX-005` | HIGH | S13 | Every second option loses the sentence that explains it | 7
`UX-006` | MEDIUM | S20 | The fourth editing mode is severed at the column edge | 4
`UX-007` | MEDIUM | 9 phone screens | The bottom bar shows nothing selected, and one of its five items can never be selected | 8
`UX-008` | MEDIUM | every phone screen | The file tree drawer is built and then switched off | 8
`UX-009` | MEDIUM | 5 screens | A cap of one is printed as a plural | 9
`UX-010` | MEDIUM | S35 | A two-line value breaks out of its own border | 9
`UX-011` | MEDIUM | S38 | A meter is drawn for a number that has no maximum | 9
`UX-012` | MEDIUM | S29 | Four meters in one row, two showing what is left and two showing what is used | 9
`UX-013` | MEDIUM | S35 to S38 | The configuration menu has five items and four screens | 9
`UX-014` | LOW | S01, S13 | Underlined text that is not a link | 10
`UX-015` | LOW | S32 | A date written in the past tense about a future day | 10
`UX-016` | LOW | S01, S13, S20, S35 | Large empty regions where a column has more height than content | 10

## 3. UX-001, HIGH. The Google mark is broken on the front door

**Screen and element.** S01, the `Continue with Google` button, which is the primary action on the
product's first screen.

**What it looks like.** A single small blue wedge where the four-colour mark should be. Confirmed by
opening `docs/mvp0/screens/s01-sign-in.png`.

**The cause, at `docs/mvp0/screens/gen.mjs:604`:**

```
const paths = [...raw.matchAll(/<path[^>]*>/g)].map(m => m[0])
```

The pattern captures opening tags only. Every `</path>` is dropped, so the four paths are emitted
nested inside one another. An SVG `path` element ignores its children, so only the first one paints.
Read straight out of the emitted `s01-sign-in.html`:

```
<path d="M23 12.245c0-.905-..." fill="#4285F4"><path d="M12.225 23c3.03 0-..." fill="#34A853">
```

**Why the GitHub mark survives.** It is a single path, so there is nothing to nest.

**The blast radius is every future brand mark**, not just this one. A two-colour mark breaks the same
way and nobody would necessarily notice on a smaller control.

**Fix.** Emit self-closing tags, or strip `</path>` explicitly before joining. Recorded as `TD-019`.

**And a second question this raises.** On a black button the Google mark has to be Google's own
white-on-dark treatment or sit on a white chip. That is a brand-compliance question, not a rendering
one, and it needs answering before sign-in ships.

## 4. UX-002 and UX-006, the review screen loses the thing it is for

**Screen.** S20, document review. The change queue is one of the product's three load-bearing ideas.

### UX-002, HIGH. The diff is cut off

**What it looks like.** In `docs/mvp0/screens/s20-review.png` the second review item shows:

```
-Takes deposits by UPI, then forgets whc
+Takes deposits by UPI, then reconciles
```

Both lines stop mid-word. There is no ellipsis, no wrap and no scrollbar, so nothing signals that
text is missing.

**The cause.** Two stylesheet rules in the generator, at `docs/mvp0/screens/gen.mjs:363` and `:364`:
`.diff{...overflow:hidden}` and `.diff div{padding:0 12px;white-space:pre}`, inside a right rail 304
pixels wide.

**Why it is the worst finding on this screen.** The screen exists to let a person accept or reject a
change. It shows them part of the change and an Accept button. **A reviewer cannot read what they are
being asked to approve**, and the truncation is silent, so they will not know to ask.

**Fix.** Wrap the diff, or scroll it, or show a word-level diff that fits. Wrapping is the least bad:
a diff that is hard to scan beats a diff that is wrong. Whichever is chosen, the rail needs a
minimum width the diff can rely on.

### UX-006, MEDIUM. The fourth mode is severed

**What it looks like.** The mode segment on S20 reads `Edit  Live  Reading` and stops at the column
edge. `Split` is gone. On S33, which has the same segment, all four modes and the `MD` and `Doc`
toggle are visible, which is the control case.

**The cause.** `.modebar{...overflow:hidden}` at `docs/mvp0/screens/gen.mjs:145`, plus
`.modebar .right{...flex-shrink:0}` at `:156`. The right cluster on
S20 carries a word count, a `3 changes to review` pill, an overflow control and a four-item segment,
and it cannot shrink, so it is sliced.

**Fix.** Let the segment shrink, or drop the word count when a review pill is present, or move the
pill into the rail where its content already lives.

## 5. UX-003, HIGH. The over-cap dialogue dims the wrong thing

**Screen.** S33, over the cap.

**What it looks like.** In `docs/mvp0/screens/s33-over-cap.png` the scrim covers the editor column
only. The file tree, the tab strip, the top bar and the **whole right rail** are at full brightness
beside a dialogue that says the person cannot create a document. The rail carries a bright blue
`AI edit` button and a `7 of 10 edits left` meter.

**The cause.** `.dim{position:absolute;inset:0}` at `docs/mvp0/screens/gen.mjs:216` resolves against
the nearest positioned ancestor, and that is `.main{...position:relative}` at `:144`, not the window.

**Two consequences, and the second is the serious one.**

- The dialogue is centred on the editor column, so it sits visibly off-centre in the window.
- **A blocking dialogue with live controls beside it teaches a person that the dialogue is optional.**
  On a screen whose only job is to say what can and cannot be done, a bright call to action outside
  the scrim is the opposite of the message.

**Fix.** Attach the scrim to the app root rather than to `.main`, or give the overlay `position:fixed`.
One line. Then check the other two overlay screens, S07 and S17, which use the sheet rather than the
dim.

## 6. UX-004, HIGH. Two broken icons take out every AI control

**Screens.** S04, S06, S07, S10, S11, S20, S21, S31, S32, plus the configuration menu on S35 to S38.

**What it looks like.** The `AI edit` button on S20 and S33 shows text with no icon and a gap where
one should be. On S35 the `Models and providers` menu row has an empty gutter and its label is
indented as though an icon were there.

**The cause, measured across all 88 icon files.** `docs/mvp0/screens/gen.mjs:45` emits every icon with
`viewBox="0 -960 960 960"`, the Material Symbols coordinate space. Two files carry no `viewBox` of
their own and use a 24 by 24 space:

```bash
for f in icons/*.svg; do grep -q 'viewBox' "$f" || echo "NO VIEWBOX: $f"; done
```

prints `icons/auto_awesome.svg` and `icons/insights.svg`, and nothing else. Their path data starts at
`M19 8.3`, which lands in the top-left corner of a 960-unit box and draws at roughly two percent of
the intended size.

**`auto_awesome` is the sparkle used on every AI control**, which is why two files produce a
product-wide symptom. `insights` is used on the analytics rows.

**One case is worse than a missing icon.** On S21 the icon is the entire content of a history avatar,
so the avatar renders as a blank coloured dot.

**Fix.** Re-fetch both from the Material source, or have `ic()` read each file's own `viewBox` instead
of assuming one. The second is the durable fix, because it makes the next mismatched icon impossible.
Recorded as `TD-018`.

## 7. UX-005, HIGH. Half the options on the question flow lose their explanation

**Screen.** S13, idea mode at Low depth. Three question cards, two options each, plus a skip.

**What it looks like.** Option a carries a `recommended` tag and a sentence under it. Option b carries
the label and nothing else.

**The cause, at `docs/mvp0/screens/gen.mjs:1169`**, inside the option template:

```
${o[3] ? `<span class="rec-tag">recommended</span>` : ''}${o[3] ? `<small>${o[2]}</small>` : ''}
```

Position 2 of each option is its rationale and position 3 is the recommended flag. **The rationale is
gated on the flag**, so an option that is not recommended never shows the sentence that explains it.

**The copy exists and is never seen.** Four rationales sit in the question data and render nowhere,
including two that are the most useful sentences on the screen: one says a bigger ticket is slower to
sell, another says the deposit is the point.

**Why this is HIGH and not MEDIUM.** The screen's whole argument is that a person can answer well
without being an expert. It offers a recommendation with a reason and an alternative **with no
reason**, which does not present a choice so much as decorate one. It also makes the recommendation
look better than the evidence behind it, which is the opposite of what this product says about
refusing to guess.

**Fix.** Change the second gate to always render position 2 when it exists. One character.

## 8. UX-007 and UX-008, the phone shell

### UX-007, MEDIUM. Nine phone screens show nothing selected

**The cause.** `docs/mvp0/screens/gen.mjs:742`:

```
function phone({ title, body, bottom = 'doc', ... }) {
```

and `docs/mvp0/screens/gen.mjs:744`:

```
  const items = [['home', 'Home'], ['search', 'Search'], ['auto_awesome', 'AI'], ['format_list_bulleted', 'Outline'], ['more_horiz', 'More']];
```

`'doc'` matches no item, so the default selects nothing.

**Measured from the emitted files**, not from the source:

```bash
for f in *-phone.html; do if grep -q 'class="bottombar"' "$f" && ! grep -q 'class="bi on"' "$f"; then echo "$f"; fi; done | wc -l
```

**9 of the 34 phone screens that have a bottom bar have no item selected.**

**And one item can never be selected.** Counted across the generator, `bottom` is passed as
`auto_awesome` seven times, `home` four and `more_horiz` fourteen. `search` and
`format_list_bulleted` are never passed, so `Outline` is a permanent dead tab in a five-item bar.

**Fix.** Give the writing screens a real value, and either wire `Outline` or remove it. A five-item
bar with a tab that never lights is a promise the product does not keep.

### UX-008, MEDIUM. The phone has no file tree

**The cause.** `docs/mvp0/screens/gen.mjs:790` declares the tree drawer with a comment saying it is
used by the drawer screens below. The next line but one switches it off:

```
void PHONE_TREE;
```

`docs/mvp0/screens/gen.mjs:792` is `void PHONE_TREE;`. The three drawers that do render are all on
the right, on S10, S11 and S20. **No phone screen shows
the file tree at all.**

**Why it matters.** The phone header has a menu control at the top left, which is where a person
expects the tree. It opens nothing.

**Fix.** Either render the left drawer, which is written and one call away, or remove the menu
control so the screen does not promise something it has not specified.

**A related detail found in the same place.** Both drawer helpers are passed inside the phone body, so
the scrim never covers the phone's own header or bottom bar. That is the same class as `UX-003`.

## 9. UX-009 to UX-013, the numbers and the panels

### UX-009, MEDIUM. A cap of one is printed as a plural

`docs/mvp0/screens/gen.mjs:16` sets `collab: 1`, and five sites interpolate it into the phrase
`live collaborators`: lines 841, 844, 1306, 1359 and 1545. Every one of them reads
`1 live collaborators`.

**Fix.** A plural helper on the caps object, used everywhere a cap goes into a sentence. This is the
mechanism, and it is worth fixing as a mechanism because `TD-022` records that at least twelve other
numbers are written by hand beside the same table.

### UX-010, MEDIUM. A two-line value breaks out of its border

**Screen.** S35, the uploads row of the plans table. `.cfgv{...height:28px...}` at
`docs/mvp0/screens/gen.mjs:271` is a fixed height, and both
values on that row wrap to two lines. The second line falls outside the rounded border and sits on the
row background.

**Fix.** Use a minimum height rather than a fixed one, or write the value so it fits.

### UX-011, MEDIUM. A meter with no maximum

**Screen.** S38, accounts and usage. Three meters show a count against a cap. The fourth shows an
amount spent, drawn as a meter at a fraction of a bar, **with no maximum anywhere on the screen**.

**Why it is a defect and not a style choice.** A progress bar means "this far along, out of that". A
bar with no denominator invites a reader to infer one. On a screen whose purpose is to decide whether
one account is costing too much, an invented denominator is worse than a plain number.

**Fix.** Show the amount as a figure, or give it a stated budget so the bar means something.

### UX-012, MEDIUM. Four meters, two directions, one row

**Screen.** S29, plan and usage. The first two meters encode what is **left**, at 70 and 100 percent
full. The second two encode what is **used**, at 24 and 60 percent. They sit in one row and are
distinguished only by bar colour.

**So a full bar means "plenty" in the first half of the row and "nearly out" in the second.**

**Fix.** Pick one direction for every meter in the product and state it in the component
specification. Used, with the cap in the label, is the more common reading.

### UX-013, MEDIUM. A menu with five items and four screens

`docs/mvp0/screens/gen.mjs:1662` lists five configuration sections. Four screens exist:

```
screen('s35-config-plans'   screen('s36-config-models'
screen('s37-config-flags'   screen('s38-config-accounts'
```

`Audit log` is in the menu and has no screen, on the same day `42-SECURITY-REVIEW.md` `SEC-006`
records that no model call is logged at all.

**Fix.** Specify the screen, or take the row out of the menu until it is specified. A menu row with
nothing behind it is the kind of thing that ships.

## 10. UX-014 to UX-016, smaller things

**UX-014, LOW. Underlined text that is not a link.** Counted across all 76 emitted files:

```bash
grep -o '<a href' *.html | wc -l
```

returns **0**. Every underlined string in the screens, including `Privacy`, `Terms`,
`here are the providers` on S01 and `Not sure, leave it open in DECISIONS.md` on S13, is a `<u>`
element. In a static mockup that is a drawing decision. It becomes a defect the moment somebody builds
from these screens and copies the markup, and `46-ACCESSIBILITY-SPEC.md` section 3 treats it as one.

**UX-015, LOW. A date in the wrong tense.** S32 says a provider trial `ended 12 Oct` while the
configuration screen says it `ends 12 Oct`. Both screens are dated 18 September, so the past tense is
about a future day. **Fix.** One word, and a rule that a date in copy comes from one place.

**UX-016, LOW. Large empty regions.** On S01 the bottom third of the page is empty and the two halves
are not vertically balanced. On S20 the rail has a substantial gap between the fine print and the
Comments row. On S13 the left sidebar is mostly empty. On S35 there is a large gap below the table.

**This is a specification for a real product, not a poster**, so a screenshot with a third of it empty
will be read as the intended layout. **Fix.** Decide per screen whether the empty region is deliberate
breathing room or an unfinished area, and if it is deliberate, say so in the screen's own page.

## 11. Limits of this file

**What could not be verified without a running application.** This is the largest limit and it applies
to most of section 2.

- **Every clipping finding.** `UX-002`, `UX-006` and `UX-010` rest on a stylesheet rule plus a rendered
  image. No element was measured. The images are consistent with the rules, which is strong, and it is
  not the same as a measurement.
- **Everything about behaviour.** These are static mockups. Nothing here says whether a control
  responds, whether focus moves correctly, whether a transition is smooth, whether a long document
  scrolls well, or whether any of it works with a keyboard. **`46-ACCESSIBILITY-SPEC.md` specifies the
  keyboard contract; nothing in this repository tests it.**
- **Real content.** Every screen carries one invented example. How the layout behaves with a
  2,000-word document, a 60-character file name, a 40-file tree or an empty vault is unknown.
- **Text that is not English.** No screen was checked at a longer translation, and
  `46-ACCESSIBILITY-SPEC.md` section 8 records that right-to-left and system text scaling are in no
  screen and no phase.
- **The rendered PNGs, mostly.** Three were opened by hand for this file and three more by a
  read-only pass. **70 of 76 are undescribed**, including every phone variant. Given that two broken
  icons account for 95 invisible glyphs and three separate silent-clipping mechanisms were found in
  six images, more of the same should be expected rather than hoped against.

**What the renderer does not check, which is why the defects above survived.**
`docs/mvp0/screens/render.mjs` asserts three things and they are all about the file: it exists, it is
larger than 20,000 bytes, and its last twelve bytes contain the PNG trailer. **Nothing checks
dimensions, pixels, blank regions, clipping or a missing glyph. A completely white render would
pass.** Waiting on the artefact rather than the process is the right pattern and the header comment
says so; the gap is that the artefact is never looked at.

The only content assertion anywhere in the pipeline is the contrast check at
`docs/mvp0/screens/gen.mjs:615`, and `46-ACCESSIBILITY-SPEC.md` section 5 shows it is checking a
palette that does not ship.

**What was not assessed.**

- **The founders' review**, deliberately. This file audits present state.
- **Copy quality, voice and reading level.** Not this file's job.
- **Whether the screens match the plan.** `49-BUILD-STATUS-AUDIT.md` does that against the code, and
  nobody has done it against the plan.
- **Information architecture.** No argument here about whether 38 screens is the right set, or whether
  the order serves a person's day. The screens sheet claims it does and that claim was not tested.
- **The desktop application's own screens.** S25 is one mockup of it.

**What would falsify this file.**

- A browser measurement showing the S20 diff is not clipped, which would retire `UX-002`.
- An icon file gaining a `viewBox`, which retires `UX-004`.
- A bottom bar where `grep 'class="bi on"'` matches in all 34 phone files, which retires `UX-007`.
- Any count in section 8 or 9 coming back different, which means the generator moved and every number
  in this file should be re-run.
