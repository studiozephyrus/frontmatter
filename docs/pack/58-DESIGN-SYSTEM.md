---
id: 58-DESIGN-SYSTEM
title: Design system
mode: reference
tier: canonical
status: living
updated: 2026-09-18
owner: sagnik
verified_against: 0af3c90
covers: [tokens, typography, type-scale, components, icons, layout]
---

# 58. Design system

**What this file is.** Every token, the type scale, the contrast maths with the real ratios, the
component conventions, and the icon rule.

**Where the values come from.** `docs/mvp0/screens/gen.mjs`, which holds the complete CSS for all
38 screens and is the only place these values exist. **Every hexadecimal value, every size and
every ratio below was read from that file or computed from it in this session** `[O]`.

**The reference implementation this descends from is md.sgnk.ai.**

**A warning before the tokens.** The app's own `src/app/globals.css` is a sibling project's file,
recorded as a defect in `docs/mvp0/PRODUCT-PLAN.md` section 26 and due to be fixed in phase B.
**So the screens are the design system and the shipped stylesheet is not.**

---

## 1. Colour tokens

Defined on `:root` for light and on `.dark` for dark. Read from `gen.mjs` at the `CSS` template.

### 1.1 Light

Token | Value | What it is
`--bg` | `#fafafa` | The page
`--bg-subtle` | `#fafafa` | Rails and strips, same value in light
`--panel` | `#fafafa` | The top bar and cards
`--panel-2` | `rgba(10,10,10,.025)` | A surface one step up from the page
`--fg` | `#18181b` | Body text
`--fg-muted` | `#6b6b73` | Secondary text
`--muted` | `#73737b` | Tertiary text, labels, counts
`--border` | `rgba(10,10,10,.06)` | The hairline
`--border-strong` | `rgba(10,10,10,.10)` | A hairline that has to be seen
`--accent` | `#18181b` | **The accent is near-black, not a colour**
`--accent-hover` | `#0a0a0a` | |
`--accent-fg` | `#fafafa` | Text on the accent
`--accent-soft` | `rgba(10,10,10,.04)` | Callout and quote backgrounds
`--hover` | `rgba(10,10,10,.04)` | |
`--active` | `rgba(10,10,10,.05)` | |
`--selected` | `rgba(10,10,10,.09)` | A selected row
`--ring` | `rgba(91,33,182,.40)` | The focus ring
`--link` | `#0044cc` | |
`--link-hover` | `#0055ff` | |
`--danger` | `#aa5e5a` | |
`--success` | `#487d60` | |
`--ai` | `#0055ff` | **The one true colour in the system**

### 1.2 Dark

Token | Value
`--bg` | `#1a1a1a`
`--bg-subtle` | `#161616`
`--panel` | `#1a1a1a`
`--panel-2` | `rgba(255,255,255,.035)`
`--fg` | `#ededed`
`--fg-muted` | `rgba(237,237,237,.62)`
`--muted` | `rgba(237,237,237,.50)`
`--border` | `rgba(255,255,255,.09)`
`--border-strong` | `rgba(255,255,255,.14)`
`--accent` | `#ededed`
`--accent-hover` | `#fff`
`--accent-fg` | `#1a1a1a`
`--accent-soft` | `rgba(255,255,255,.05)`
`--selected` | `rgba(255,255,255,.12)`
`--link` | `#5b9eff`
`--link-hover` | `#80b6ff`
`--danger` | `#d49391`
`--success` | `#7fb09a`
`--ai` | `#5b9eff`

### 1.3 The accent, in both themes, and why it is what it is

**The accent inverts. The AI colour does not.**

Theme | `--accent` | `--accent-fg` | `--ai`
Light | `#18181b`, near black | `#fafafa` | `#0055ff`
Dark | `#ededed`, near white | `#1a1a1a` | `#5b9eff`

**What that buys.** The interface has **one** coloured thing in it, and that thing means AI. A
primary button is not blue. A selected tab is not blue. An active rail row is not blue. **So when
blue appears, it is the machine, every time.**

**The consequence for anybody adding a screen.** If you reach for `--ai` to make something stand
out, you are lying about what it is. Use `--accent`, `--selected` or weight instead.

### 1.4 The swatch map

`gen.mjs` defines a five-colour map used for tab dots and small markers, and nothing else:

```
SW = { blue: '#5b8cff', green: '#4f8b6b', red: '#b2625e', amber: '#b8791b', grey: '#9b9ba3' }
```

**These are identity markers, not status colours.** A tab dot says which project a file belongs
to. Status uses `--danger`, `--success` and the problems-panel dots below.

---

## 2. Contrast, with the real maths

### 2.1 The assertion that runs

`gen.mjs` carries a WCAG 2.x contrast function and **throws at generation time** below 4.5 to 1.
It is not a lint rule and it is not advisory: the screens do not build.

```
for (const [fg, bg] of [...]) {
  if (contrast(fg, bg) < 4.5) throw new Error(...)
}
```

The five pairs it asserts, from the audit finding that retuned the tokens:

Foreground | Background | What it is
`#73737b` | `#fafafa` | muted, light
`#aa5e5a` | `#fafafa` | danger, light
`#487d60` | `#fafafa` | success, light
`#d49391` | `#1a1a1a` | danger, dark
`#7fb09a` | `#1a1a1a` | success, dark

### 2.2 The measured ratios

Computed in this session `[O]` with the same relative-luminance formula the generator uses:

Pair | Ratio | Passes AA at 4.5
`#73737b` on `#fafafa`, muted light | **4.50** | **Exactly at the line**
`#aa5e5a` on `#fafafa`, danger light | **4.51** | Yes, by 0.01
`#487d60` on `#fafafa`, success light | **4.60** | Yes
`#d49391` on `#1a1a1a`, danger dark | **6.95** | Yes
`#7fb09a` on `#1a1a1a`, success dark | **7.11** | Yes
`#18181b` on `#fafafa`, body light | **16.97** | AAA
`#6b6b73` on `#fafafa`, fg-muted light | **5.06** | Yes
`#0044cc` on `#fafafa`, link light | **7.46** | AAA
`#0055ff` on `#fafafa`, AI light | **5.37** | Yes
`#ededed` on `#1a1a1a`, body dark | **14.87** | AAA
`#5b9eff` on `#1a1a1a`, AI dark | **6.45** | Yes
`#fafafa` on `#18181b`, accent button | **16.97** | AAA

**Three of these sit within 0.11 of the line**, and two of them are exactly on it. **So any change
to `--muted`, `--danger` or `--success` in light mode breaks the build**, which is the intended
behaviour and worth knowing before you try.

### 2.3 The relative-luminance formula, for anybody reimplementing it

```
channel c: c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ^ 2.4
L = 0.2126 R + 0.7152 G + 0.0722 B
ratio = (max(L1, L2) + 0.05) / (min(L1, L2) + 0.05)
```

**The target is WCAG 2.2 AA**, plus IS 17802 tested alongside it. See
`54-COMPLIANCE-AND-LEGAL.md` section 6 for why both, and **`46-ACCESSIBILITY-SPEC.md` for the
requirement itself.** This file owns the token values and the maths on them, never the standard.

---

## 3. Typography

### 3.1 The stacks

```
--font-sans: "Google Sans", "Roboto", ui-sans-serif, -apple-system,
             BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif
--font-mono: "Google Sans Code", "JetBrains Mono", ui-monospace,
             SFMono-Regular, Menlo, monospace
```

**Both are carried locally**, embedded in `docs/mvp0/screens/fonts.css`, 184,451 bytes, rather
than fetched from a font service. The licences are in `THIRD-PARTY-NOTICES.md` and one of them is
unverified. See `54-COMPLIANCE-AND-LEGAL.md` section 7.1.

### 3.2 The interface scale

The interface base is **13px** at **1.5** line height. Everything else is a deliberate step from
it, and the odd fractional sizes are real values from the file rather than rounding.

Use | Size | Weight | Where
Interface base | **13px** | 400 | `body`
Wordmark | 15.2px | 650 | `.wordmark`
User name | 13.6px | 450 | `.uname`
Tab label | 13px | 450 | `.tab`
Rail row | 13px | 400 | `.row`
Project row | 12.5px | 600 | `.projrow`
Side heading | 12px | 500 | `.sidehead`
Rail section heading | **11px**, uppercase, `.06em` tracking | 600 | `.rh`
Button | 13px | 500 | `.btn`
Small button | 12px | 500 | `.btn.sm`
Large button | 14px | 500 | `.btn.lg`
Chip | 12px | 400 | `.chip`
Footer and hints | 11.5px | 400 | `.sidefoot`, `.aibox .foot`
Badge, keyboard hint | 10px, mono | 400 | `.row .badge`, `.search kbd`
Mark, the `fm` square | 13px | 800, `-.04em` | `.mark`

### 3.3 The document scale

The document is a different scale from the interface, and it is set in **ems** so it moves as one.

Element | Size | Weight | Detail
Body | **15px**, line height **1.7** | 400 | `.md`, max width **65ch**
`h1` | 1.9em | 650 | `-.02em` tracking, hairline rule beneath
`h2` | 1.5em | 650 | `-.01em`, hairline rule beneath
`h3` | 1.25em | 650 | no rule
Inline code | 0.86em, mono | 400 | 8 per cent foreground tint, 5px radius
Code block | 0.85em, mono, line height 1.5 | 400 | `--panel-2`, 1px border, 8px radius
Table | 0.95em | header 650 | hairline cells, `--panel-2` header
Callout label | 0.72em, uppercase, `.06em` | 650 | |

**The 65ch measure is the one number here worth defending.** It is why Doc mode looks like a
document and not like a code editor, and `.md.docmode` removes it only because a page layout sets
its own width.

---

## 4. Shape, space and elevation

### 4.1 Radius

Token | Value | Used for
`--radius-sm` | **6px** | Buttons, rail rows, small controls
`--radius` | **8px** | Code blocks, segmented controls, panels
`--radius-lg` | **12px** | The AI box, cards
Full | `999px` | Chips only

**A pill is a chip and nothing else.** A pill-shaped button would read as a chip.

### 4.2 The fixed heights that make the frame

Element | Height
Top bar | **52px**
Tab strip | **38px**
Button | **30px**
Small button | 26 to 28px
Rail row | **26px**
Chip | 26px
Search field | 30px
Avatar | 28px, 26px when stacked
The `fm` mark | 26px, 44px large

### 4.3 The three-column body

```
.body        264px | 1fr | 304px
.body.noright 264px | 1fr
.body.noleft        1fr | 304px
.body.wide   264px | 1fr | 360px
```

**The left rail is always 264px and the right rail is 304px.** A screen that needs more takes
`.wide` at 360px rather than inventing a width.

### 4.4 Elevation

**There is one shadow in the whole system**, and it is 1px:

```
.fseg span.on { box-shadow: 0 1px 2px rgba(0,0,0,.06) }
```

**Everything else separates with a hairline border or a background step.** An active rail row uses
an inset 2px accent bar, not a shadow:

```
.row.on { background: var(--selected); box-shadow: inset 2px 0 0 var(--accent) }
```

---

## 5. Components

### 5.1 Buttons

Class | Background | Border | Text
`.btn` | `--panel-2` | `--border` | `--fg`
`.btn.primary` | `--accent` | transparent | `--accent-fg`
`.btn.ghost` | transparent | transparent | `--fg-muted`
`.btn.ai` | `--ai` | transparent | `#fff`

**`.btn.ai` is the only element in the system with a hardcoded white.** That is deliberate,
because `#fff` on `#0055ff` is a fixed pair that does not invert.

### 5.2 Segmented controls

Two of them, and they are not interchangeable.

Class | Shape | Used for
`.seg` | 8px outer, 6px inner, `--panel-2` ground | Mode switching: Edit, Live, Read; Markdown against Doc
`.fseg` | `--r` outer, `--bg-subtle` ground, a 1px shadow on the active tab | Filter toggles, including the human-against-AI split

**`.fseg` carries a count**, in `.fseg span i` at 11px with tabular numerals. That is the shape
the 18 September toggle instruction lands in: **wherever human and AI work sit together, split
them with a toggle rather than one flat list**, and show how many are in each.

### 5.3 Chips

26px tall, fully rounded, `--border`, `--fg-muted` on `--bg`. `.chip.on` takes `--ai` for both
border and text. **Chips appear in the AI box and nowhere else.**

### 5.4 The AI box

```
.aibox   margin 0 48px 22px, 1px --border, 12px radius, --panel-2 ground
.aibox .in   40px tall, 1px --border-strong, 10px radius, --bg, 14px text
.aibox .in .go   28px square, 7px radius, --ai ground, white glyph
```

**Four chips and one second row.** That is the progressive-disclosure limit from
`docs/mvp0/PRODUCT-PLAN.md` section 16, and the box is one of the three places it is enforced.

**The 18 September instruction adds one line to it.** The box names its target on its own first
line: **Editing: `<document>`**, or **Idea: `<name>`**, with the selected range shown when there
is one. **When an idea is in progress that line is pinned and does not scroll away.**

### 5.5 Document marks

The four ways a span can be marked, and all four live on `.md`:

Class | Appearance | Means
`.ai-sug` | 16 per cent `#0055ff` fill, 30 per cent inset ring, 3px radius | An AI suggestion, not yet accepted
`.ai-del` | Struck through, `--muted` | An AI deletion, not yet accepted
`.chg` | 14 per cent `#b8791b` fill | A change in the queue
`.cmt` | 22 per cent `#b8791b` fill, 2px `#b8791b` underline | A comment anchor

**Blue is the machine and amber is a person.** The two never swap, and this is the one place in
the interface where colour carries meaning that is not decorative.

### 5.6 The problems panel

`.prob` rows carry a 7px dot:

Class | Colour | Severity
`.prob .err` | `#dc2626` | error
`.prob .warn` | `#d97706` | warning
`.prob .info` | `--muted` | information

**Measured 18 September `[O]`**, WCAG relative luminance computed in `python3`:

Dot | On `--bg` light, `#fafafa` | On `--bg` dark, `#1a1a1a`
`#dc2626` | 4.63 to 1 | 3.6 to 1
`#d97706` | **3.05 to 1** | 5.46 to 1

Both clear the 3 to 1 that WCAG 2.2 success criterion 1.4.11 asks of a graphical object, and the
amber in light mode clears it by a hair. **They join the tokens as `--prob-err` and `--prob-warn`**,
`resolved (proposed 18 Sep, founder review)`, and `gen.mjs` asserts 3 to 1 on them. Rejected:
leaving them as literals, which is how an unchecked colour gets in. **The dot never carries the
severity alone**: the row's text names it, per criterion 1.4.1.

### 5.7 Cursors, for live editing

A 2px bar in `#b2625e`, with the person's name above it at 10.5px, 600 weight, white on the same
colour, 4px radius. **The colour comes from the swatch map's red**, so a second cursor takes the
next swatch rather than a new colour.

---

## 6. Icons

**The rule is absolute and it has no exceptions.**

- **Google Material Symbols, Rounded, weight 400, fill 0, 24px grid.**
- **Delivered as inline SVG.** The path data goes into the markup.
- **No emoji as an icon. No icon web font. No second icon library.**

### 6.1 How they get there

`docs/mvp0/screens/fetch-icons.mjs` reads every `ic('name')` call out of `gen.mjs`, fetches the
Rounded symbol from `google/material-design-icons`, and writes it into
`docs/mvp0/screens/icons/`. **Rounded first, outlined as a fallback.**

**They are committed to the repository on purpose.** The comment in the fetcher says why: the
cache used to live in a session scratchpad, which is wiped when a session resumes, and then the
generator threw "icon missing".

**Counted at write time** `[O]`: `ls docs/mvp0/screens/icons/*.svg | wc -l` returns **88**.

### 6.2 The `ic()` contract

```
<svg class="ic" width="N" height="N" viewBox="0 -960 960 960"
     fill="currentColor" aria-hidden="true"><path d="..."/></svg>
```

- **`viewBox="0 -960 960 960"`** is the Material Symbols coordinate space. Do not normalise it.
- **`fill="currentColor"`** means an icon takes the colour of its text and never sets its own.
- **`aria-hidden="true"`** because every icon in this system sits beside a label or inside a
  control with an accessible name.
- **`.ic { flex: none; vertical-align: -3px }`** is the alignment, and it is why icons sit on the
  text baseline rather than floating.
- **A missing icon throws.** `gen.mjs` raises `icon missing and could not be fetched` rather than
  rendering a gap.

### 6.3 Brand marks are not Material Symbols

They live at `docs/mvp0/screens/icons/brand-*.svg`, and there are **two**: `brand-google.svg` and
`brand-github.svg`.

- **Google's mark keeps its own colours.** The `brand()` helper sets no fill for it.
- **GitHub's mark takes `currentColor`**, because its mark is monochrome by design.
- **Both are stripped of `height`, `width`, `style` and `class` attributes** on the way in, so the
  call site controls the size.

**The 18 September instruction was that these must be the real brand marks and not placeholders.**
They are.

---

## 7. The phone

### 7.1 Dimensions

Surface | Size
Desktop screen | **1440 x 900**
Phone screen | **390 x 844**

Every screen is generated twice, at `sNN-name.html` and `sNN-name-phone.html`.

### 7.2 The phone shell

Part | Detail
Status bar | `.iosbar`, the time and a signal cluster
Header | `.top`, a menu button, the title, and either a mode segment or the avatar
Body | `.pbody`
**Bottom bar** | **Five destinations: Home, Search, AI, Outline, More**
Home indicator | `.homeind`

**Five is the top of Material's range**, which is three to five under 600dp. See
`docs/mvp0/PRODUCT-PLAN.md` section 16.

### 7.3 The three phone overlays

Helper | What it is
`pdrawer(inner, side)` | A dimmer plus a drawer from the left or right. The tree lives here
`psheet(inner)` | A dimmer plus a bottom sheet with a grab handle
`pmodeseg(mode)` | The Edit, Live, Read segment, in the header rather than the toolbar

### 7.4 The instruction that is still open against this section

**`[Z]` 18 September: the phone view is bland and needs the same theme treatment as the desktop
view.** Recorded at `docs/mvp0/SCREEN-CHANGES-2026-09-18.md` section 1, S01.

**It is a theming instruction, not a layout one, and it applies to more than S01.** Every phone
panel in the set is in scope, and `50-ROADMAP.md` section 2.1 costs it at two days.

**What "the same theme treatment" means**, `resolved (proposed 18 Sep, founder review)`, **needs
founder** because it is his taste to confirm. The screens' own phone shell already uses the desktop
tokens, so the instruction is read as three concrete changes:

1. **Surface.** Phone panels layer `--panel` and `--panel-2` with hairline `--border` exactly as the
   desktop panes do, instead of one flat background.
2. **Hierarchy.** The same heading and label steps as the desktop, not a smaller uniform size.
3. **Density.** Desktop row padding, not a looser phone-only spacing.

Rejected: a separate phone palette, which would put a second set of values into section 1.

---

## 8. Rules for adding to this system

1. **Read `gen.mjs` first.** If a value exists there, use it. Do not introduce a second value that
   is close to it.
2. **Never add a colour.** The tokens, the five swatches and the two problem dots are the whole
   palette. A new colour needs a reason in this file.
3. **Never use `--ai` for emphasis.** It means the machine. Section 1.3.
4. **Never add a shadow.** Section 4.4. Use a hairline or a background step.
5. **A new icon is a Material Symbol.** Add the `ic('name')` call and run `fetch-icons.mjs`. If
   the symbol does not exist, the design is wrong, not the icon set.
6. **Two disclosure levels, at most.** Twelve toolbar buttons and one More. Four chips and one
   second row. Ten settings sections and no sub-sections.
7. **Assert the contrast.** If a token changes, the five-pair assertion in section 2.1 must still
   throw on a breach, and the new pair joins it.
8. **Where human and AI work sit together, split them with a toggle**, and put the count on the
   toggle. Section 5.2.

---

## 9. Limits of this file

**What was not assessed.**

- **Motion.** There is no transition, no duration and no easing anywhere in `gen.mjs`, because the
  screens are static. **The system has no motion language and one has to be written.**
- **Focus.** `--ring` is defined at `rgba(91,33,182,.40)` and **`[O]` no rule in `gen.mjs` uses
  it**. The focus style is undefined, which is an accessibility gap rather than an omission.
- Forms. There is no input, select, checkbox or radio specification, because the screens draw
  their fields rather than using controls.
- Loading, skeleton and empty-state visual conventions beyond what individual screens draw.
- The shipped `src/app/globals.css`, which is a sibling project's file and is not this system.

**What could not be verified.**

- The two problem-dot colours were measured on 18 September and proposed as tokens, section 5.6.
- The "Google Sans" family licence was found on 18 September: OFL 1.1, `54-COMPLIANCE-AND-LEGAL.md`
  section 7.1.
- **Corrected 18 September: the tokens are in the application already, and four differ** `[O]`.
  Of the 22 names in section 1, 21 are defined in `src/app/globals.css` and used by `var()` in
  `src/`, and 18 carry the same light value as `gen.mjs`. The four that differ: `--ai` is missing,
  `--danger` is `#b2625e` against `#aa5e5a`, `--success` is `#4f8b6b` against `#487d60`, and
  **`--muted` is `#9b9ba3` against `#73737b`**. The application's `--muted` on `#fafafa` is **2.64
  to 1**, under the 4.5 to 1 that `gen.mjs` enforces, and it is used 93 times. Checked with a
  `python3` diff of the two files' custom properties and `grep -rn -- "var(--muted)" src`.
- `INFERENCE:` section 1.3's reading of why the accent is near-black. The code shows the values,
  and the reasoning is mine.

**What would falsify it.**

- Building any screen in React and finding a token missing would show this file specifies a
  picture rather than a product.
- A contrast test on the built application failing where `gen.mjs` passes would mean the
  assertion covers the wrong pairs.
- If the phone theming instruction in section 7.4 turns out to need different tokens rather than
  different density, section 1 is incomplete rather than wrong.
