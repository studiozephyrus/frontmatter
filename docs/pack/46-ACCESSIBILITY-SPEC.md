---
id: 46-ACCESSIBILITY-SPEC
title: Accessibility specification
mode: reference
tier: canonical
status: living
verified_against: f237ece
updated: 2026-09-18
owner: sagnik
covers: [accessibility, contrast, assistive-technology]
---

# 46. Accessibility specification

The conformance target, the contrast arithmetic, what assistive technology must be told by each
component, and what is deliberately out of scope.

## 1. A boundary with `15-INTERACTION-AND-KEYBOARD.md`, stated rather than assumed

The brief for this file asks for the keyboard contract and the focus order.
`15-INTERACTION-AND-KEYBOARD.md` already declares `keyboard` and `focus-order` in its `covers` list,
and `65-CONVENTIONS.md` section 1 says one fact has one home. The two instructions disagree.

**Resolved this way, and it is a choice somebody may want to overturn.**

- **The keyboard map and the focus order live in `15-INTERACTION-AND-KEYBOARD.md`.** Its sections 2,
  3, 5 and 6 are the single home. Nothing here restates a chord or a tab position.
- **This file states the accessibility requirements that map has to satisfy**, in section 6. Those are
  different facts: a requirement on a map is not the map.

If the validator still reports two homes, the fix is to narrow this file's `covers` list, never to
delete a section from either file.

## 2. The target

Standard | Level | Why
WCAG 2.2 | **AA**, every screen | The plan's target, at `docs/mvp0/PRODUCT-PLAN.md:1390`
IS 17802 Part 1 of 2021, tested to Part 2 of 2022 | the standard named by the draft Indian rule | Also `docs/mvp0/PRODUCT-PLAN.md:1390`, and the reason is in the plan's legal section

**Why two standards and not one.** The plan's legal section records a draft amendment to the Rights of
Persons with Disabilities Rules, dated 23 July 2026, which would require IS 17802 for any website or
software offered to persons in India, with a published conformance report in both human-readable and
machine-readable form. It is a draft under consultation and not yet law. The plan's position is to
test to IS 17802 alongside WCAG from the first screen rather than wait, and that position is adopted
here.

**AAA is not the target and should not be attempted screen by screen.** Meeting AAA on one surface
and AA on the next is worse than AA everywhere, because it makes the product's behaviour
unpredictable. Where a token already clears AAA, say so and keep it.

## 3. Contrast

This is the section with the most measurable content in the file, and it is where the largest defect
is.

### 3.1 The thresholds

Element | Minimum ratio | WCAG reference
Body text, under 18 point or under 14 point bold | 4.5 to 1 | 1.4.3
Large text, 18 point or 14 point bold and above | 3 to 1 | 1.4.3
A control's own boundary, an icon that carries meaning, a focus indicator | 3 to 1 | 1.4.11
Text on a disabled control | no requirement | 1.4.3 exception

### 3.2 The assertion that exists

`docs/mvp0/screens/gen.mjs:615` computes the ratio at generation time and throws below the threshold.
Read verbatim:

```
// WCAG 2.x contrast, asserted at generation so a token change cannot ship below 4.5:1 (F030).
function lum(hex) {
  const c = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(v => v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
function contrast(a, b) { const [x, y] = [lum(a), lum(b)]; return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }
for (const [fg, bg] of [['#73737b', '#fafafa'], ['#aa5e5a', '#fafafa'], ['#487d60', '#fafafa'], ['#d49391', '#1a1a1a'], ['#7fb09a', '#1a1a1a']]) {
  if (contrast(fg, bg) < 4.5) throw new Error(`contrast ${fg} on ${bg} is ${contrast(fg, bg).toFixed(2)}, below 4.5`);
}
```

**The arithmetic is correct.** It is the standard relative-luminance formula with the standard
threshold, and the generator refuses to emit anything if a pair falls below it. **The list is the
problem.**

### 3.3 The values it checks are not the values that ship

Five pairs are checked. Three of the five foreground values do not appear in `src/app/globals.css`.

Token | Generator asserts | `src/app/globals.css` ships | Line
`--muted`, light | `#73737b` | **`#9b9ba3`** | 33
`--danger`, light | `#aa5e5a` | **`#b2625e`** | 55
`--success`, light | `#487d60` | **`#4f8b6b`** | 56
`--danger`, dark | `#d49391` | `#d49391` | 112
`--success`, dark | `#7fb09a` | `#7fb09a` | 113

**So the gate is green and the light palette is below the threshold.**

### 3.4 The shipped palette, measured

Computed in this session with the same formula the generator uses, against `--bg`.

**Light, against `#fafafa`:**

Token | Value | Ratio | 4.5 to 1
`--fg` | `#18181b` | 16.97 | pass, and AAA
`--fg-muted` | `#6b6b73` | 5.06 | pass
`--muted` | `#9b9ba3` | **2.64** | **fail, and below the 3 to 1 large-text floor too**
`--link` | `#0044cc` | 7.46 | pass, and AAA
`--link-hover` | `#0055ff` | 5.37 | pass
`--link-visited` | `#4c1d95` | 10.50 | pass, and AAA
`--danger` | `#b2625e` | **4.19** | **fail**
`--success` | `#4f8b6b` | **3.84** | **fail**
`--ring` | `rgba(91, 33, 182, 0.40)` over `--bg` | **2.14** | **fail against the 3 to 1 indicator threshold**

**Dark, against `#1a1a1a`:**

Token | Value | Ratio | 4.5 to 1
`--fg` | `#ededed` | 14.87 | pass, and AAA
`--fg-muted` | `rgba(237, 237, 237, 0.62)`, composited `#9d9d9d` | 6.42 | pass
`--muted` | `rgba(237, 237, 237, 0.40)`, composited `#6e6e6e` | **3.41** | **fail**
`--link` | `#5b9eff` | 6.45 | pass
`--danger` | `#d49391` | 6.95 | pass
`--success` | `#7fb09a` | 7.11 | pass
`--ring` | `rgba(196, 181, 253, 0.50)`, composited `#6f688c` | 3.34 | pass against the 3 to 1 indicator threshold

**Five failures, and the two that matter most are not the obvious ones.**

- **`--muted` at 2.64 to 1 is the worst.** It is below even the large-text floor, so there is no size
  at which it is compliant. It carries file names, timestamps, counts and the search placeholder.
- **`--ring` at 2.14 to 1 in light mode is the focus indicator.** A focus ring nobody can see is the
  same as no focus ring, and a keyboard-only person then cannot tell where they are. Section 5 has
  the second, separate problem with it.

**An alpha value is composited before it is measured.** `--fg-muted`, `--muted` and `--ring` are all
declared with transparency, so each is blended against `--bg` at its stated alpha and the result is
the value measured. Any future check has to do the same, or it will measure a colour the eye never
sees.

### 3.5 What the plan currently claims, and why it needs correcting

`docs/mvp0/PRODUCT-PLAN.md:1390` says the muted, danger and success tokens are retuned to 4.5 to 1 and
the generator asserts it. **The generator asserts it about a retuned palette that the application does
not ship.** The claim should be narrowed to name the file the tokens were retuned in, which is the
screen generator, until `src/app/globals.css` matches. This is recorded as `TD-017`.

### 3.6 The fix, and its shape

1. **Read the tokens, never restate them.** The check should parse `src/app/globals.css` and assert
   over every token it finds, so a divergence is impossible rather than merely unlikely.
2. **Composite alpha before measuring.**
3. **Assert the 3 to 1 indicator threshold too**, for `--ring`, `--border-strong` and any icon that
   carries meaning on its own. The current check only knows about text.
4. **Fail the build, not the generator.** A check that only runs when somebody rebuilds the screens
   misses a token change made in the application.

## 4. What the screens specify today

Counted across all 76 emitted files in `docs/mvp0/screens/`:

```bash
grep -o '<button' *.html | wc -l      # 0
grep -o '<a href' *.html | wc -l      # 0
grep -o 'role=' *.html | wc -l        # 0
grep -o 'tabindex' *.html | wc -l     # 0
grep -o 'aria-hidden' *.html | wc -l  # 2224
grep -o 'title="' *.html | wc -l      # 136
```

**There is not one semantic control in the entire specification.** Every control is a `span` or a
`div`. Every icon carries `aria-hidden="true"`, which is correct for a decorative icon and wrong for
one that is a control's only label. About 684 controls are icon-only with no visible text and no
`title`, which `45-UX-AUDIT.md` counts.

**This is a drawing, so that is not itself a defect.** It becomes one the moment somebody builds from
it, because a mockup is the most-copied artefact in any project. **The screens are therefore a
specification of layout and copy, and not of semantics**, and this file is where the semantics live.

## 5. What the application ships today

Counted across `src/`:

Attribute | Uses
`aria-label` | 49
`aria-hidden` | 18
`aria-pressed` | 11
`aria-modal` | 9
`aria-expanded` | 4
`aria-selected`, `aria-haspopup` | 3 each
`aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-orientation`, `aria-live`, `aria-invalid`, `aria-checked`, `aria-busy` | 1 each

Role | Uses
`dialog` | 10
`alert` | 8
`menu` | 4
`presentation`, `menuitem` | 3 each
`tab`, `option`, `listbox` | 2 each
`status`, `slider`, `separator`, `menuitemcheckbox`, `list` | 1 each

**This is better than the screens by a wide margin.** Dialogues are marked modal, a slider carries its
three value attributes, menus carry their items, and there is a live region.

**Two defects, both mechanical.**

**The focus indicator removes the outline and replaces it with a shadow.** Six rules do this, at
`src/app/globals.css:236`, `:291`, `:311`, `:398`, `:516` and `:698`, in the form:

```
  outline: none;
  box-shadow: 0 0 0 3px var(--ring);
```

A `box-shadow` is not painted under Windows High Contrast Mode, which replaces author colours through
`forced-colors`. So on the one configuration where a visible focus ring matters most, the indicator
disappears entirely, because the real outline was removed to make room for it. One of the six, the
markdown link rule at `:698`, uses a real `outline` and is correct.

**Nothing responds to a motion preference.** `grep -rn "prefers-reduced-motion" src/` returns nothing.

## 6. The requirements this product's keyboard map must satisfy

The map itself is `15-INTERACTION-AND-KEYBOARD.md`. These are the conditions on it, and each one names
the criterion it serves.

Id | Requirement | Criterion
`A11Y-K1` | Every action reachable by pointer is reachable by keyboard | 2.1.1
`A11Y-K2` | No sequence traps focus. Escape leaves every overlay, and the escape stack is the one in `15-INTERACTION-AND-KEYBOARD.md` section 5 | 2.1.2
`A11Y-K3` | A single-character shortcut can be turned off, remapped, or fires only while a control has focus | 2.1.4
`A11Y-K4` | Focus order follows the reading order of the screen | 2.4.3
`A11Y-K5` | The focus indicator is visible, at least 3 to 1 against what is behind it, and survives `forced-colors` | 2.4.7, 2.4.11, 2.4.13
`A11Y-K6` | Opening an overlay moves focus into it; closing returns focus to what opened it | 2.4.3
`A11Y-K7` | A skip link reaches the editor from the top of the page | 2.4.1
`A11Y-K8` | The editor is escapable. `Escape` then `Tab` leaves the text area rather than inserting a tab | 2.1.2

**`A11Y-K8` is the one most often missed in an editor**, and `15-INTERACTION-AND-KEYBOARD.md` section
4 already records `Tab` as a chord with two owners. That conflict is an accessibility question as well
as an interaction one.

**`A11Y-K7` has no home in the code today.** No skip link was found in `src/`.

## 7. What each component must tell assistive technology

The contract, per component. `14-COMPONENT-INVENTORY.md` owns the component ids; this table is keyed
by the component's plain name until those ids exist.

Component | Role | Name comes from | Must also announce
Icon-only control | `button` | `aria-label`, because there is no visible text | its pressed state with `aria-pressed` where it toggles
Labelled button | `button` | its own text | nothing more
Mode segment, Edit, Live, Reading, Split | `tablist` with `tab` children | each tab's text | which is selected, with `aria-selected`
Tab strip of open documents | `tablist` with `tab` children | the file name | unsaved state in the name, never by colour alone
Close control on a tab | `button` inside the tab | `aria-label` naming the file | nothing more
File tree | `tree` with `treeitem` | each item's name | expanded state, level, and position in its level
Editor text area | `textbox` with `aria-multiline` | a visible label or `aria-label` | the document name
Outline panel | `navigation` containing a `list` | heading text | the heading level
Right-rail collapsible | `button` with `aria-expanded` controlling a region | its own text | the count, in the accessible name, not only as a badge
Command palette | `combobox` with a `listbox` | its input's label | the active option, with `aria-activedescendant`, and the result count in a live region
Search panel | as the command palette | as the command palette | the result count, politely
Dialogue, including over-cap and conflict | `dialog` with `aria-modal` | its heading, through `aria-labelledby` | nothing more, and it traps focus until dismissed
Sheet on the phone | as a dialogue | its heading | nothing more
Toast | `status` | its own text | polite, never assertive, unless it reports a failure
Refusal message | `alert` | its own text | assertive, because a refusal is the product's most important output
Problems panel | a `list` of items, each naming its line | the problem text | severity in words, never by colour alone
Change-queue item | an `article` in a `list` | the author and the change | the source, person or AI or agent, in words
Diff | `region` with a label | the label | additions and removals marked in text, never by colour alone
Meter | `progressbar` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax` | its label | the units, and whether it counts what is used or what is left
Toggle | `switch` with `aria-checked` | its own text | nothing more
Ghost text suggestion | a `status` live region | nothing | that a suggestion is present and how to accept it
Publish confirmation | `dialog` | its heading | what will become public, in words, before the control that does it

**Two rules that cut across the table.**

- **Colour is never the only carrier.** 1.4.1. Every state in the list above has a text or shape
  equivalent. The diff and the problems panel are the two places this is most easily broken.
- **A count in a badge is not an accessible name.** A rail row reading `Comments` with a badge saying
  `2` announces as `Comments`. It has to announce as `Comments, 2 open`.

## 8. What is out of scope, and the gap that is not

### 8.1 Deliberately out of scope for the pilot

Item | Why | When it comes back
AAA conformance | See section 2 | never as a target; per-token where it is free
A screen-reader-specific mode | A separate mode is a second product and it rots | never
Braille display testing | No device, no tester | when there is a user who needs it
Voice control beyond what the keyboard map gives | The keyboard map is the prerequisite | after `A11Y-K1` to `A11Y-K8` are met
A published conformance report | The draft rule that would require one is not law | when the rule lands, per the plan's legal section
Captioned media | The product has no media | if it ever does

### 8.2 The gap, named as one

**Right-to-left layout, system text scaling and high contrast mode appear in no screen and in no
phase.** Verified by grep across `src/`, `docs/mvp0/screens/gen.mjs` and `docs/mvp0/PRODUCT-PLAN.md`:

Feature | Token searched | Occurrences, all three places
Right-to-left | `dir="rtl"`, `direction:rtl` | **0**
High contrast | `forced-colors`, `prefers-contrast` | **0**
Reduced motion | `prefers-reduced-motion` | **0**
Text scaling | `text-size-adjust` | **0**

**These are not the same kind of gap and should not be treated as one.**

- **High contrast is a conformance requirement, not a nice-to-have.** Section 5 shows the focus
  indicator already breaks under it. This is the one to fix first, and it is small.
- **Reduced motion is a conformance requirement.** 2.3.3. It is one media query and a handful of
  rules.
- **Text scaling is a conformance requirement.** 1.4.4 asks for 200 percent without loss of content.
  `src/app/globals.css` sizes text in pixels throughout, which does not respond to a browser's own
  text-size setting. **This is the largest of the four and the one nobody has costed.**
- **Right-to-left is a market decision, not a conformance one.** It is out of scope until the product
  serves a right-to-left language, and saying that is different from having overlooked it.

**Written down here so it is a decision rather than an omission.** Three of the four belong in a
phase. The fourth belongs in a note saying why it is not in one.

## 9. How to re-derive every number in this file

```bash
# the shipped tokens
grep -n '\--muted:\|--fg-muted:\|--danger:\|--success:\|--link:\|--ring:\|--fg:\|--bg:' src/app/globals.css

# the generator's assertion
sed -n '614,623p' docs/mvp0/screens/gen.mjs

# what the screens specify
cd docs/mvp0/screens && for t in '<button' '<a href' 'role=' 'tabindex' 'aria-hidden' 'title="'; do
  printf '%-14s %s\n' "$t" "$(grep -o -- "$t" *.html | wc -l)"; done

# what the application ships
grep -rno 'aria-[a-z]*' src/ | sed 's/.*:\(aria-[a-z]*\)/\1/' | sort | uniq -c | sort -rn
grep -rno 'role="[a-z]*"' src/ | sed 's/.*\(role="[a-z]*"\)/\1/' | sort | uniq -c | sort -rn

# the four gaps
for t in 'dir="rtl"' 'direction:rtl' 'forced-colors' 'prefers-contrast' 'prefers-reduced-motion' 'text-size-adjust'; do
  printf '%-24s %s\n' "$t" "$(grep -rl -- "$t" src/ docs/mvp0/ 2>/dev/null | wc -l)"; done
```

The contrast ratios are computed with the formula quoted in section 3.2, compositing any alpha value
against `--bg` first.

## 10. Limits of this file

**What was not assessed.**

- **Any assistive technology.** No screen reader was run, no keyboard walk was performed, no magnifier
  and no voice control. Every statement in sections 6 and 7 is a **requirement**, not an observation.
  Nothing here says whether the shipped application meets any of them.
- **Automated checking.** No axe run, no Lighthouse pass, no linter. Those catch a different and
  larger set of defects than reading does, cheaply, and none was run.
- **IS 17802.** The standard is named as a target in the plan and **its text was not opened**. So this
  file cannot say where it differs from WCAG 2.2 AA, and it certainly does differ. Anybody relying on
  the two-standard claim should read it.
- **Reading order in the code.** Section 6 requires focus to follow reading order. Whether it does was
  not checked, in any component.
- **The `title` attribute as a label.** 136 uses in the screens. `title` is not announced reliably and
  is unavailable on touch, so it is treated here as no label at all. That reading was not tested
  against a specific screen reader.
- **The Tauri build.** A desktop shell has its own accessibility surface and `src-tauri/` was not
  opened.
- **Colour blindness.** Contrast is not the same question. No simulation was run over the palette.

**What could not be verified.**

- **That `--muted` at 2.64 to 1 is used for text a person must read.** The ratio is measured; which
  strings carry the token was sampled, not enumerated. If it turns out to be decorative everywhere,
  the finding softens. Nothing in `src/app/globals.css` suggests that.
- **That the focus indicator actually disappears under high contrast.** The mechanism is documented
  behaviour of `forced-colors` and the rules were read. It was not observed on Windows.
- **Whether the 684 unlabelled controls in the screens correspond to unlabelled controls in the code.**
  They are different artefacts, and section 5 shows the code is better.

**What would falsify this file.**

- A token in `src/app/globals.css` changing, which moves every ratio in section 3.4. Re-run section 9.
- A generator check that reads the tokens rather than restating them, which retires `TD-017` and most
  of section 3.
- A `prefers-reduced-motion` or `forced-colors` block appearing anywhere, which retires a row in
  section 8.2.
- A screen-reader walk finding a component that behaves differently from section 7, which makes the
  table the thing that is wrong rather than the code.
- `14-COMPONENT-INVENTORY.md` arriving with component ids, at which point section 7 should be keyed by
  id and this note deleted.
