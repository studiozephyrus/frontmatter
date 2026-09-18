---
id: 18-FIRST-RUN-AND-EMPTY
title: First run and empty states
mode: how-to
tier: canonical
status: living
updated: 2026-09-18
owner: sagnik
verified_against: f237ece
covers: [first-run, empty-states]
---

# 18. First run and empty states

## The rule this file opens with, and never leaves

**One tap with Google or GitHub. No password. No captcha. No puzzle. No tour. Ever.**

`[Z]` It is the founders' standing rule, and it is absolute. The plan states it three times over:
`docs/mvp0/PRODUCT-PLAN.md` section 1 ("No captchas, no puzzles, no tour"), `:254` ("No tour appears"), and
`:323` ("`[L]` No captcha, ever").

**Nothing in this file may be built in a way that breaks it.** If a first-run idea needs a step, a
walkthrough, a checklist of tasks to tick, a progress ring, a confetti moment or a "3 of 5 done"
badge, **it is the wrong idea and this file is the reason you do not build it**.

**One exception exists, and it is small on purpose.** `docs/mvp0/PRODUCT-PLAN.md` section 4: a tip appears
the first time a person hovers a control they have not used, once. Section 7 specifies it.

---

## 1. The first sixty seconds

**The target the plan measures is signed in to first save, under two minutes**
(`docs/mvp0/PRODUCT-PLAN.md` section 28). **This file designs for sixty seconds**, so that the measured
number has room in it.

The clock starts when the sign-in page paints.

Second | Screen | What the person sees | What they do | What must not happen
0 | S01 | A wordmark, one line, two buttons, one line of fine print | Reads the promise line | No cookie banner, no consent wall, no interstitial.
2 | S01 | The same page, with the editor shown once on the right half | Presses Continue with Google | No captcha. No password field. No second factor of ours.
4 | Provider | Google's or GitHub's own screen | Chooses an account | We add nothing to this screen. It is not ours.
8 | S02 | Home, first time. Five ways to start, three tabs, one empty row | Reads five cards | No tour, no modal, no highlight ring, no "welcome".
14 | S02 | The same | Presses Blank document | No naming dialogue. The document is `Untitled.md` and is renamed later.
16 | S04 | An empty document with the caret in it, and the AI box below | Types | No tips yet. Nothing pops.
22 | S04 | Text on the page, and the pill reading Saved | Keeps typing | No save button. No "unsaved changes" warning.
60 | S04 | A document that exists, is saved, and is theirs | Stops, or shares, or keeps going | Nothing asks them to upgrade, invite anybody, or rate us.

**Three of those rows are the whole design.** Second 0 has no gate in front of the gate. Second 8 has
no tour. Second 22 has no save button.

### 1.1 The three other first minutes

Not everybody lands on Blank document, and the other two paths carry the funnel.

Path | Second 14 | Second 60 | The screen that must be ready
Import | Presses Import, or drops a folder onto the page | A project exists, with the structure kept and the progress panel saying what was kept byte for byte | S22.
From an idea | Presses From an idea | The idea is typed and the first page of questions is on screen | S12, then S13.
A shared link | Arrives at a published page instead, having never signed in | Reads the whole document, with no account | S18.

**The third path is the one most people take first, and it has no sign-in in it at all.** A reader
who presses Edit meets sign-in; a reader who does not, does not
(`docs/mvp0/SCREEN-CHANGES-2026-09-18.md:330`).

### 1.2 What the first sixty seconds may cost

**Nothing.** No credit is spent by signing in, landing on Home, creating a document, typing, saving,
importing a folder, or reading a published page.

**The first thing that can cost anything is the AI box**, and it states the cost before the click:
`K.s06.cost` in `16-COPY-DECK.md`.

---

## 2. What never appears, at any point

- A captcha, a puzzle, a slider, a "prove you are human" of any kind.
- A password field of ours.
- A product tour, a coach mark chain, a spotlight overlay, or a "next" button that walks a person
  round the screen.
- A checklist of setup tasks, with or without a progress bar.
- A "welcome to frontmatter" modal.
- Confetti, a celebration, or any animation that rewards a first action.
- A request to rate, review, invite a colleague or join a community.
- A cookie or consent banner in front of the sign-in page. **The Privacy and Terms links on S01 are
  the disclosure, and they serve without an account** (`docs/mvp0/PRODUCT-PLAN.md` section 5).
- A trial countdown. Free is a plan, not a trial.
- An email verification step before the product works.

**The acceptance test for the whole of section 2** is the plan's own, at
`docs/mvp0/PRODUCT-PLAN.md` section 1: a person who knows Google Docs or Obsidian needs nothing explained.

---

## 3. The empty-state contract

Every empty state in this product obeys five rules.

1. **One primary action. Not two.** A second control may exist only as a quiet text link, and only
   where section 5 names it.
2. **Say what would be here**, not that there is nothing. `[M]` Nielsen, quoted at
   `docs/mvp0/PRODUCT-PLAN.md` section 16: "Do not default to totally empty states."
3. **Never an illustration with no action under it.**
4. **Never a cap or an upsell as the primary action.** Caps may be stated once, as a line.
5. **The words live in `16-COPY-DECK.md`**, and this file names the id rather than the string.

**Rule 1 is the one that gets broken.** Two equal buttons in an empty state is a choice a person has
no information to make.

---

## 4. Every empty state

The full register. **`string` is an id into `16-COPY-DECK.md`**, and `none yet` means the copy has to
be written before the state can be built.

id | Where | What is empty | What it says | The one primary action | Secondary, if any | string
`X01` | S02 | A new account, no documents | Five ways to start, then one line saying nothing is here yet and a folder can be dropped anywhere | Blank document, the highlighted card of the five | The other four cards, as peers, and the drop target | `K.s02.empty`, `K.s02.caps`.
`X02` | S04 | A project with no files | The tree head, the drop hint, and the two make buttons | Add file | Add idea, and the drop hint | `K.s04.drophint`.
`X03` | S04 | A workspace with no document open | The tree and the rail, and the editor area carrying one line | Open the most recent document | none yet | none yet.
`X04` | S06 | An open document with no text | A title placeholder and the AI box | Type. **The caret is the action** | The AI box below | `K.s06.placeholder`.
`X05` | S34 | The Ideas tab, no ideas | What a blueprint is in one line, the three depths in one line each, one box | Type the idea into the box | Open the example kit, as a chip | `K.s34.lede`, `K.s34.prompt`.
`X06` | S12 | The Ideas list rail, no ideas | One line saying ideas will be listed here with where each one stands | Covered by `X05`. **The rail offers nothing of its own** | none | `K.s34.railempty`.
`X07` | S23 | Connections, nothing connected | The two connection cards in an unconnected state, each saying what it would do and what it would ask for | Connect Google Drive | Connect GitHub, as a peer card | none yet.
`X08` | S21 | A document with one version | One line saying history starts at the first save, and how many days this plan keeps | None. **Reading is the action** | none | none yet.
`X09` | S04 rail | No comments | The row shows a zero and does not expand | None | none | `K.common.comments`.
`X10` | S20 | Nothing to review | One line saying what would appear here: a person's edit, an AI edit you asked for, or an agent's change on disk | None. **An empty queue is good news** | none | none yet.
`X11` | S10 | No problems | One line saying the document has no structural problems, and that the checks ran on this device | None | Rules, as a quiet control | none yet.
`X12` | S02 | Shared with me, nothing shared | One line saying documents other people share will appear here | None | none | none yet.
`X13` | S17 | No published pages yet | The publish toggle, off, with the count against the cap | Publish this document | none | `K.s17.publish.sub`.
`X14` | S04 rail | No outline, because the document has no headings | One line | None | none | `K.s06.railempty`.
`X15` | S04 rail | No backlinks, no tags, no bookmarks | The rows show zero and do not expand | None | none | `K.common.backlinks`.
`X16` | Search | A query with no matches | One line naming what was searched: documents, ideas and shared pages | Clear the query | none | none yet.
`X17` | S29 | A brand new account's usage meters | Four meters at full, and the reset date | None | Upgrade to Pro, as the plan card's own control | `K.s29.lede`.
`X18` | S24 | Offline with nothing waiting | The banner, and no pending count | None | none | `K.s24.banner`.
`X19` | S16 | A project with one document, so the map has one node | The single node, and one line saying the map grows as documents reference each other | None | none | none yet.
`X20` | S11 | A project with no instruction files | One line naming the files an agent would read, and that none are here | Create AGENTS.md | none | none yet.
`X21` | S25 | The desktop app with no local folder added | The cloud tree, and one row offering to add a folder from this machine | Add a folder from this Mac | none | none yet.
`X22` | S15 | An idea answered but no blueprint written yet | The fifteen file names, greyed, with what each will hold | Write the blueprint | none | `K.s15.skillfolder`.

**Nine of the twenty-two rows above have no copy at all.** They are the work this file creates for
`16-COPY-DECK.md`, and each needs a `K` id there before it can be built.

---

## 5. The four empty states that carry a secondary control

**Rule 1 of section 3 allows a secondary control in four places, and nowhere else.** Each is listed
with the reason, because a reason is what stops the number growing to twelve.

Row | Secondary | Why it is allowed
`X01` | The other four start cards | They are five peers with one highlighted, not one primary and four secondaries. `[M]` Hick's law, five choices with one emphasised (`docs/mvp0/PRODUCT-PLAN.md` section 5).
`X02` | Add idea, and the always-visible drop hint | `[Z]` The founders put both buttons in the left rail on 18 September, and the drop hint answers "upload must be obvious" (`docs/mvp0/SCREEN-CHANGES-2026-09-18.md:229`).
`X05` | Open the example kit | **It is the cheapest way to see what a blueprint is** without spending the month's credit (`docs/mvp0/PRODUCT-PLAN.md` section 5).
`X07` | The second connection card | Drive and GitHub are peers. Choosing for the person would be wrong.

---

## 6. Four states that are empty and must offer nothing

**An empty state with an action in it is not always right.** These four are better left alone, and a
later session that adds a button to one of them has made the product worse.

State | Why nothing is offered
`X09` no comments | A comment comes from a person. There is nobody to ask
`X10` nothing to review | **An empty change queue is the product working.** Putting an action here rewards a state that needs no attention
`X11` no problems | The same. The document is fine
`X18` offline, nothing waiting | There is nothing to do but keep writing

---

## 7. The first-hover tip, which is the only teaching in the product

`docs/mvp0/PRODUCT-PLAN.md` section 4: a tip appears only the first time a person hovers a control they
have not used. `[M]` Apple, quoted at `:1370`: "Consider providing a collection of context-specific
tips instead of a single onboarding flow."

**The rules that keep it a tip and not a tour.**

1. **On hover, never on load.** A tip a person did not reach for is an interruption.
2. **Once per control, for ever.** Stored on the account, so the desktop and the phone agree
   (`K.s28.lede`).
3. **No chaining.** Dismissing one tip never shows the next.
4. **No numbering.** Never "1 of 6".
5. **No dismiss control needed.** Moving the pointer away dismisses it.
6. **At most one tip on screen.**
7. **Not on the phone.** There is no hover. **The phone gets no tips at all**, and that is the
   correct answer rather than a gap.

**Tips exist for these controls and no others.** Keeping this list short is the point.

Control | Screen | Why it needs one
The MD and Doc switch | S04, S05 | Doc mode is a view over the same file, and that is not guessable.
Add file | S04 | Upload and Import live inside it (`docs/mvp0/SCREEN-CHANGES-2026-09-18.md:232`).
The depth pill | S12 | It reads like a model picker and a person may not know it is a price.
More, in the Doc toolbar | S05 | It holds the five features that render here and export to PDF only.
Let AI decide | S31 | Its proposal enters the queue rather than writing the file.
Fix all safe | S10 | Safe has a precise meaning.

**One toast is not a tip and is exempt.** `K.s05.toast` on S05 appears once when Doc mode is first
opened, because that screen changes what a person believes about their file.

---

## 8. First run on the phone

The bottom bar carries five actions: Home, Search, AI, Outline, More
(`docs/mvp0/screens/gen.mjs:744`).

Second | What happens
0 | S01 on the phone, with the same theme treatment as the desktop `[Z]` (`docs/mvp0/SCREEN-CHANGES-2026-09-18.md:19`)
4 | The provider's own sign-in
8 | Home, with four start cards rather than five and the tabs shortened
14 | Blank document, the editor full width
60 | A saved document

**Three differences, and each is stated rather than hidden.**

- **No tips** (section 7, rule 7).
- **The install card appears once**, and only on the quick-capture path (`K.s26.install.title`).
- **Sharing from another app works on Android after install, and not at all on iOS**
  (`K.s22.phone.share`). The copy says so rather than showing a control that does nothing.

---

## 9. First run on the desktop app

The desktop app is reached by a person who already has an account, so its first run is shorter.

1. Sign in, once, with the same two buttons.
2. The tree shows two roots: the cloud projects, and folders on this machine
   (`docs/mvp0/screens/gen.mjs:1467`).
3. **The empty state is `X21`**: no local folder yet, and one action to add one.
4. **No document cap**, and the tree foot says so (`K.s25.treefoot`).

**No tour here either**, and no "what is new" panel on an update.

---

## 10. How to check this file

Every claim in sections 1, 2 and 7 is checkable by driving the product. Five checks, and each one
fails loudly rather than quietly.

Check | Method | Pass
No captcha exists anywhere | `grep -ri "captcha\|recaptcha\|hcaptcha\|turnstile" src/ package.json` returns nothing | Zero hits.
No tour library is installed | `grep -ri "shepherd\|driver.js\|intro.js\|joyride\|onboarding" package.json` returns nothing | Zero hits.
Sign-in is two buttons and no field | Read S01. Count the inputs | Zero text inputs.
Sixty seconds holds | A stopwatch, on a mid-range Android over 4G, three runs | Median under 60 s.
Every empty state has one primary | Walk section 4 and count emphasised controls per state | Exactly one, or zero where section 6 says so.

**The first two were run on 18 September 2026 at commit `f237ece` and both returned zero hits.** The
command is in the table; re-run it rather than trusting this sentence.

---

## 11. What this file must never do

- **Never introduce a step between the sign-in button and the product.**
- **Never add a second primary action to an empty state.**
- **Never put an upsell where the primary action belongs.** The over-cap screen already places Move
  to Pro third of three (`K.s33.do.pro`), and an empty state is a weaker moment than that one.
- **Never let an empty state lie about why it is empty.** A document with no history says history
  starts at the first save; it does not say "no history" as though something failed.
- **Never gate a published page on the first run of anything.** `page.md` and `llms.txt` are never
  gated, never redirected and never given an interstitial
  (`docs/mvp0/SCREEN-CHANGES-2026-09-18.md:325`).

---

## 12. Open questions

Question | Why this file cannot answer it
Is there a third sign-in route, and does it change second 2? | Founder question 18, an email magic link, is a flag on S37 and not yet on
What does second 0 look like to a person in the European Union? | EU sign-ups are blocked until a representative is engaged (`docs/mvp0/PRODUCT-PLAN.md` section 23), and nobody has written what that person sees
Does the age floor appear in the first sixty seconds? | The floor is in the terms, and whether it needs a statement at sign-up is a counsel question (`docs/mvp0/PRODUCT-PLAN.md` section 23)
What is the greeting's timezone? | `K.s02.greeting` says "Good evening" and nobody has defined evening

Each belongs in `56-OPEN-DECISIONS.md` with a `D` number.

---

## 13. Limits of this document

- **What was not assessed.** The sixty-second walk in section 1 has never been timed. It is a design
  target derived from the plan's two-minute measure, not an observation.
- **What could not be verified.** Twelve of the twenty-two empty states in section 4 do not exist in
  the shipped app, and several do not exist on a screen either. **They were derived from the
  screens, not seen.**
- **What is not established.** Sections 4, 5 and 6 are a specification. No person has met any of
  these states.
- **What would falsify it.** Any of the five checks in section 10 failing. The two that were run
  returned zero hits at commit `f237ece`; a later commit can change that in one `npm install`.
- **One word this file gave up, on purpose.** Its front matter covered `onboarding`, and so does
  `31-LOCAL-SETUP.md`, which the pack validator caught. The two mean different things: a person
  meeting the product, and a developer setting up a machine. **This file dropped the word and kept
  `first-run`**, so `31` keeps `onboarding` without anybody editing another owner's file. If the
  register would rather split it the other way, say `product-onboarding` and `developer-onboarding`
  and change both.
- **One thing this file deliberately does not do.** It does not measure whether sign-in first costs
  sign-ups. **That is the plan's largest named risk** (`docs/mvp0/PRODUCT-PLAN.md` section 27), its
  mitigation is a measurement rather than a design change, and no amount of empty-state care answers
  it.
