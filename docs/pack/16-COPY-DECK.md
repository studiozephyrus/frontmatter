---
id: 16-COPY-DECK
title: Copy deck
mode: reference
tier: canonical
status: living
updated: 2026-09-18
owner: sagnik
verified_against: f237ece
covers: [user-facing-strings, refusal-wording, error-wording, standing-promises]
---

# 16. Copy deck

**Every user-facing string in the product, with an id.** `65-CONVENTIONS.md` section 2 gives this
file one job: a string lives here and nowhere else. A screen file, a component, a test and an error
row all point at an id in this deck.

## How to read a row

`id | screen | string | tone | budget | notes`

- **`id`** is `K` plus a dotted path, lower case, per `65-CONVENTIONS.md` section 3.
- **`screen`** is the screen id, or `many` when several screens share the string.
- **`string`** is the exact text. Where it came from `docs/mvp0/screens/gen.mjs` it is verbatim, and
  the notes say so.
- **`tone`** is one of the eight in section 0.2.
- **`budget`** is a class and its character ceiling, from section 0.3.
- **`notes`** carry the source, the variables, and anything a translator or a builder must know.

**Where a string contains a number, the number is a variable.** It is written `{docs}`, `{edits}`
and so on in the notes column, and it is read from `limitsFor(account)`
(`docs/mvp0/PRODUCT-PLAN.md` section 30). **A number typed into a string is a defect**, because the
configuration panel of section 30 is the only home for a cap.

## 0.1 Provenance

Mark | Meaning
`[gen]` | Verbatim from `docs/mvp0/screens/gen.mjs`, read at commit `f237ece` on 18 September 2026
`[code]` | Verbatim from the shipped source under `src/`
`[plan]` | Taken from `docs/mvp0/PRODUCT-PLAN.md`, with the line cited
`[new]` | Written in this file, because the screen needs a string nobody has written yet

**Anything marked `[new]` has not been reviewed by the founders.**

## 0.2 Tone

Tone | What it means | Where it belongs
`promise` | A commitment the product can be held to | S01, S18, S32, S36, S37
`plain` | A flat statement of what a thing is | Most of the deck
`label` | A control's name. Two or three words, no full stop | Buttons, tabs, menu rows
`help` | One line under a control, saying what it does | Settings, connections
`refusal` | We will not do the thing, and here is why | S22, S31, S32, S36, and every row of `17`
`caution` | Something is wrong or about to be, and here is the exit | S10, S24, S31, S33
`cost` | What an action spends, said before the click | S06, S07, S12, S29
`legal` | A duty, and it is worded by counsel, not by us | S18 footer, Privacy, Terms

## 0.3 Budget

Class | Ceiling, characters | Why
`button` | 24 | Fits the 30 px control at the phone's 390 px width without wrapping
`label` | 28 | Fits a rail row and a tab
`title` | 48 | One line at 20 px on the phone
`lede` | 140 | Two lines under a title
`help` | 160 | The `em` line under a settings row
`body` | 320 | A card, a toast, a banner
`long` | 600 | A modal's whole explanation, and nothing else

**Over the ceiling is a defect in the copy, not in the layout.** Cut the string.

## 0.4 The rules every string obeys

1. **British spelling.** Colour, behaviour, recognise, licence as the noun.
2. **Plain hyphens. No em dashes and no en dashes**, anywhere.
3. **Second person, and no exclamation marks.** The product speaks to one person doing their work.
4. **Never a screen id, a feature id, a file path in `docs/`, or any internal shorthand.** Section
   14 lists four live breaches of this rule.
5. **Never a percentage of confidence from a model.** `[M]` PAIR, quoted at
   `docs/mvp0/PRODUCT-PLAN.md` section 16.
6. **A refusal says three things in order:** what will not happen, why, and what to do instead. Never
   an apology first.
7. **A cost is stated before the click, never after.**
8. **Nothing is called intelligent, smart, powerful or effortless.**

---

## 1. The standing promises

**These are the sentences the product can be held to.** They appear verbatim where they appear, and
a change to one of them is a change to the product, not to a string. Any screen that needs one of
these ideas uses the id rather than writing its own words.

id | screen | string | tone | budget | notes
`K.promise.nopassword` | S01 | No password, no puzzle, no tour. | `promise` | `label`, 34 | `[gen]` `docs/mvp0/screens/gen.mjs:811`. Three refusals in one line. `[L]` No captcha, ever (`docs/mvp0/PRODUCT-PLAN.md` section 5).
`K.promise.notraining` | S01 | We never train on your documents, and here are the providers that keep that true. | `promise` | `lede` | `[gen]` `docs/mvp0/screens/gen.mjs:811`. "here are the providers" is the link. **Only as true as the chain in S36**, which is why that screen disables a provider whose terms nobody opened.
`K.promise.nocharge` | S32 | Nothing is deducted for a failed call. | `promise` | `label`, 40 | `[gen]` `docs/mvp0/screens/gen.mjs:1613`. The credit-ledger contract, stated to the person.
`K.promise.untouched` | S32 | Your document is untouched and nothing was charged. | `promise` | `label` | `[gen]` `docs/mvp0/screens/gen.mjs:1610`. Said at the moment of failure, before any instruction.
`K.promise.readable` | S33 | Everything you have still opens, edits and exports. Nothing is deleted. | `promise` | `lede` | `[gen]` `docs/mvp0/screens/gen.mjs:1627`. The plan's form of the same promise is "Every document stays readable and exportable" (`docs/mvp0/PRODUCT-PLAN.md` section 13); the screen's wording is the one that ships, and the plan's is the internal statement of it.
`K.promise.nomerge` | many | Conflicts are never merged silently. Both versions are kept and you choose. | `promise` | `lede` | `[gen]` `docs/mvp0/screens/gen.mjs:1432`. Invariant 12 of the engine (`docs/mvp0/PRODUCT-PLAN.md` section 17), said in the person's words.
`K.promise.yourfiles` | S01 | Markdown that stays yours, in a Doc mode or a plain one. | `promise` | `lede` | `[gen]` `docs/mvp0/screens/gen.mjs:816`.
`K.promise.docsonly` | S23 | frontmatter only ever writes under docs/, and that rule is tested. | `promise` | `lede` | `[gen]` `docs/mvp0/screens/gen.mjs:1435`. Enforced server-side (`docs/mvp0/PRODUCT-PLAN.md` section 11).
`K.promise.drivescope` | S23 | Scope: only files this app created or you picked. We cannot see the rest of your Drive. | `promise` | `lede` | `[gen]` `docs/mvp0/screens/gen.mjs:1431`.
`K.promise.nogate` | S18 | No account needed to read. | `promise` | `label`, 26 | `[gen]` `docs/mvp0/screens/gen.mjs:1343`.
`K.promise.noindex` | many | Not indexed by search engines. | `promise` | `label`, 30 | `[gen]` `docs/mvp0/screens/gen.mjs:1308`. Whether this stays true is founder question 17 (`docs/mvp0/PRODUCT-PLAN.md` section 29).

**One promise has no string yet.** `[new]` `K.promise.nocrdt`, the sentence a person reads when they
ask what happens to their file in a live session. The plan has the engineering
(`docs/mvp0/PRODUCT-PLAN.md` section 15, no persisted CRDT state) and no copy. Nobody has written it, and
this file will not invent a promise.

---

## 2. Shared strings

id | screen | string | tone | budget | notes
`K.common.search` | many | Search | `label` | `label`, 10 | `[gen]` `docs/mvp0/screens/gen.mjs:641`.
`K.common.searchlong` | S02, S03 | Search documents, ideas and shared pages | `label` | `label`, 44 | `[gen]` `docs/mvp0/screens/gen.mjs:834`. Home only, where the field is wider.
`K.common.searchkbd` | many | ⌘K | `label` | `button`, 4 | `[gen]` `docs/mvp0/screens/gen.mjs:641`. On Windows and Linux it reads `Ctrl K`. See `15-INTERACTION-AND-KEYBOARD.md` section 2.
`K.common.accept` | S07, S20 | Accept | `label` | `button`, 10 | `[gen]` `docs/mvp0/screens/gen.mjs:919`. **Never abbreviated, never an icon alone.** Equal visual weight with Reject.
`K.common.reject` | S07, S20 | Reject | `label` | `button`, 10 | `[gen]` `docs/mvp0/screens/gen.mjs:919`.
`K.common.reply` | S05, S20 | Reply | `label` | `button`, 10 | `[gen]` `docs/mvp0/screens/gen.mjs:888`.
`K.common.saved` | many | Saved | `plain` | `label`, 10 | `[gen]` `docs/mvp0/screens/gen.mjs:866`.
`K.common.savedtodisk` | S25 | Saved to disk | `plain` | `label`, 16 | `[gen]` `docs/mvp0/screens/gen.mjs:1475`. Desktop only.
`K.common.synced` | many | Synced 2 min ago | `plain` | `label`, 22 | `[gen]` `docs/mvp0/screens/gen.mjs:865`. `{ago}` is a relative time.
`K.common.aiedit` | many | AI edit | `label` | `button`, 10 | `[gen]` `docs/mvp0/screens/gen.mjs:733`.
`K.common.editsleft` | many | {left} of {edits} edits left | `cost` | `label`, 28 | `[gen]` `docs/mvp0/screens/gen.mjs:734`. Both numbers from the ledger.
`K.common.outline` | many | Outline | `label` | `label`, 10 | `[gen]` `docs/mvp0/screens/gen.mjs:730`.
`K.common.backlinks` | many | Backlinks | `label` | `label`, 12 | `[gen]` `docs/mvp0/screens/gen.mjs:727`.
`K.common.tags` | many | Tags and bookmarks | `label` | `label`, 20 | `[gen]` `docs/mvp0/screens/gen.mjs:726`.
`K.common.comments` | many | Comments | `label` | `label`, 12 | `[gen]` `docs/mvp0/screens/gen.mjs:729`.
`K.common.history` | many | Document history | `label` | `label`, 18 | `[gen]` `docs/mvp0/screens/gen.mjs:728`.
`K.common.tree` | S04 | Tree | `label` | `label`, 8 | `[gen]` `docs/mvp0/screens/gen.mjs:662`.
`K.common.modes` | many | Edit · Live · Reading · Split | `label` | `label`, 28 | `[gen]` `docs/mvp0/screens/gen.mjs:679`. Four separate labels. The phone shortens Reading to Read (`docs/mvp0/screens/gen.mjs:765`).
`K.common.mdswitch` | many | MD · Doc | `label` | `button`, 8 | `[gen]` `docs/mvp0/screens/gen.mjs:685`. Only appears in Live.
`K.common.pro` | many | Pro | `label` | `button`, 4 | `[gen]` `docs/mvp0/screens/gen.mjs:1124`. The plan badge.
`K.common.free` | many | Free | `label` | `button`, 6 | `[gen]` `docs/mvp0/screens/gen.mjs:1123`.
`K.common.seepro` | S17 | See Pro | `label` | `button`, 10 | `[gen]` `docs/mvp0/screens/gen.mjs:1306`.
`K.common.getmore` | S06 | Get more | `label` | `button`, 10 | `[gen]` `docs/mvp0/screens/gen.mjs:905`.
`K.common.done` | many | Done | `label` | `button`, 8 | `[gen]` `docs/mvp0/screens/gen.mjs:1321`.
`K.common.tabs` | S02, S03 | Documents · Ideas · Shared with me | `label` | `label`, 34 | `[gen]` `docs/mvp0/screens/gen.mjs:838`. Three labels. The phone shortens the third to Shared (`docs/mvp0/screens/gen.mjs:842`).

---

## 3. S01 Sign in

id | string | tone | budget | notes
`K.s01.title` | Sign in to frontmatter | `plain` | `title`, 24 | `[gen]` `docs/mvp0/screens/gen.mjs:808`.
`K.s01.lede` | Your documents, your ideas and your agents' briefs, in one place. Same account on the web, the desktop app and your phone. | `plain` | `lede` | `[gen]` `docs/mvp0/screens/gen.mjs:809`.
`K.s01.google` | Continue with Google | `label` | `button`, 22 | `[gen]` `docs/mvp0/screens/gen.mjs:810`. The mark is Google's own four-colour G, not a Material Symbol (`docs/mvp0/screens/gen.mjs:598`).
`K.s01.github` | Continue with GitHub | `label` | `button`, 22 | `[gen]` `docs/mvp0/screens/gen.mjs:810`.
`K.s01.fine` | (uses `K.promise.nopassword` then `K.promise.notraining`) | `promise` | `lede` | `[gen]` `docs/mvp0/screens/gen.mjs:811`. One paragraph, two promise ids.
`K.s01.privacy` | Privacy | `legal` | `label`, 10 | `[gen]` `docs/mvp0/screens/gen.mjs:811`. **Serves without an account** (`docs/mvp0/PRODUCT-PLAN.md` section 5).
`K.s01.terms` | Terms | `legal` | `label`, 10 | `[gen]` `docs/mvp0/screens/gen.mjs:811`.
`K.s01.write` | Write | `label` | `label`, 8 | `[gen]` `docs/mvp0/screens/gen.mjs:816`.
`K.s01.writeline` | (uses `K.promise.yourfiles`) | `promise` | `lede` | `[gen]` `docs/mvp0/screens/gen.mjs:816`.
`K.s01.decide` | Decide | `label` | `label`, 8 | `[gen]` `docs/mvp0/screens/gen.mjs:816`.
`K.s01.decideline` | Turn an idea into a brief your agent can build from. | `plain` | `lede` | `[gen]` `docs/mvp0/screens/gen.mjs:816`.
`K.s01.ship` | Ship | `label` | `label`, 8 | `[gen]` `docs/mvp0/screens/gen.mjs:816`.
`K.s01.shipline` | Share, publish, or push to GitHub and Google Drive. | `plain` | `lede` | `[gen]` `docs/mvp0/screens/gen.mjs:816`.

**The provider link has no destination string yet.** `[new]` It needs a page listing every provider
in the chain with the sentence each one publishes about training. Until that page exists the link in
`K.promise.notraining` goes nowhere, which would make the promise unverifiable by the person it is
made to.

---

## 4. S02 Home, first time, and S03 Home

id | screen | string | tone | budget | notes
`K.s02.greeting` | S02, S03 | Good evening, {name} | `plain` | `title`, 36 | `[gen]` `docs/mvp0/screens/gen.mjs:837`. `{part}` of day. `UNVERIFIED:` nobody has specified the boundaries between morning, afternoon and evening, or the timezone they are read in.
`K.s02.start.blank` | S02, S03 | Blank document | `label` | `label`, 18 | `[gen]` `docs/mvp0/screens/gen.mjs:823`.
`K.s02.start.blank.sub` | S02, S03 | Markdown, saved as you type | `plain` | `help` | `[gen]` `docs/mvp0/screens/gen.mjs:823`.
`K.s02.start.idea` | S02, S03 | From an idea | `label` | `label`, 16 | `[gen]` `docs/mvp0/screens/gen.mjs:824`.
`K.s02.start.idea.sub` | S02, S03 | Describe it. Answer questions. Get a brief and a blueprint | `plain` | `help` | `[gen]` `docs/mvp0/screens/gen.mjs:824`.
`K.s02.start.import` | S02, S03 | Import | `label` | `label`, 10 | `[gen]` `docs/mvp0/screens/gen.mjs:825`.
`K.s02.start.import.sub` | S02, S03 | Drop files or a whole folder. Google Docs, Word, Notion, Obsidian | `plain` | `help` | `[gen]` `docs/mvp0/screens/gen.mjs:825`.
`K.s02.start.github` | S02, S03 | From GitHub | `label` | `label`, 16 | `[gen]` `docs/mvp0/screens/gen.mjs:826`.
`K.s02.start.github.sub` | S02, S03 | Open a repository's docs and write back to it | `plain` | `help` | `[gen]` `docs/mvp0/screens/gen.mjs:826`. The source uses a typographic apostrophe; the deck normalises to a plain one.
`K.s02.start.template` | S02, S03 | A template | `label` | `label`, 14 | `[gen]` `docs/mvp0/screens/gen.mjs:827`.
`K.s02.start.template.sub` | S02, S03 | Spec, meeting notes, decision record, README, 14 more | `plain` | `help` | `[gen]` `docs/mvp0/screens/gen.mjs:827`. `{more}` is a count, and 14 is drawn rather than derived.
`K.s02.empty` | S02 | Nothing yet. Start above, or drop a folder anywhere on this page. | `plain` | `lede` | `[gen]` `docs/mvp0/screens/gen.mjs:841`. `[M]` Nielsen on empty states, quoted at `docs/mvp0/PRODUCT-PLAN.md` section 5.
`K.s02.empty.phone` | S02 | Nothing yet. Start above. | `plain` | `label`, 26 | `[gen]` `docs/mvp0/screens/gen.mjs:844`.
`K.s02.caps` | S02 | Free: {docs} documents in the cloud, {pages} published pages, {collab} live collaborators. Unlimited on the desktop app. | `plain` | `body` | `[gen]` `docs/mvp0/screens/gen.mjs:841`. **Defect, see section 14, D1:** at `{collab}` of 1 the drawn string reads "1 live collaborators". The string needs a plural rule.
`K.s03.usedpill` | S03 | {used} of {docs} cloud documents used | `plain` | `label`, 34 | `[gen]` `docs/mvp0/screens/gen.mjs:852`.
`K.s03.ideascount` | S03 | Ideas · {n} | `label` | `label`, 14 | `[gen]` `docs/mvp0/screens/gen.mjs:853`.
`K.s03.sharedcount` | S03 | Shared with me · {n} | `label` | `label`, 22 | `[gen]` `docs/mvp0/screens/gen.mjs:853`.
`K.s03.col.recent` | S03 | Recent | `label` | `label`, 10 | `[gen]` `docs/mvp0/screens/gen.mjs:855`.
`K.s03.col.project` | S03 | Project | `label` | `label`, 10 | `[gen]` `docs/mvp0/screens/gen.mjs:855`.
`K.s03.col.opened` | S03 | Opened | `label` | `label`, 10 | `[gen]` `docs/mvp0/screens/gen.mjs:855`.
`K.s03.col.owner` | S03 | Owner | `label` | `label`, 10 | `[gen]` `docs/mvp0/screens/gen.mjs:855`.

---

## 5. S04 Workspace, and S27 dark

S27 is S04 on the dark tokens and introduces no string of its own (`docs/mvp0/screens/gen.mjs:1499`).

id | string | tone | budget | notes
`K.s04.addfile` | Add file | `label` | `button`, 12 | `[gen]` `docs/mvp0/screens/gen.mjs:656`. Opens a menu; see the four rows below.
`K.s04.addidea` | Add idea | `label` | `button`, 12 | `[gen]` `docs/mvp0/screens/gen.mjs:657`.
`K.s04.addfile.new` | New document | `label` | `button`, 16 | `[new]`, from `docs/mvp0/SCREEN-CHANGES-2026-09-18.md:232`. The menu is specified there and not drawn.
`K.s04.addfile.upload` | Upload files | `label` | `button`, 16 | `[new]`, same source.
`K.s04.addfile.folder` | Upload a folder | `label` | `button`, 18 | `[new]`, same source.
`K.s04.addfile.import` | Import from | `label` | `button`, 14 | `[new]`, same source.
`K.s04.drophint` | Drop files or a folder anywhere | `plain` | `label`, 34 | `[gen]` `docs/mvp0/screens/gen.mjs:665`. **Always visible**, not a hover state, because that is the moment a person looks for upload.
`K.s04.newproject` | project | `label` | `button`, 10 | `[gen]` `docs/mvp0/screens/gen.mjs:662`. Reads "add project" with its icon.
`K.s04.ideassection` | Ideas | `label` | `label`, 8 | `[gen]` `docs/mvp0/screens/gen.mjs:660`. Collapsed by default, at the foot of the tree.
`K.s04.newfile.tip` | New file | `help` | `label`, 12 | `[gen]` `docs/mvp0/screens/gen.mjs:670`, a title attribute.
`K.s04.newfolder.tip` | New folder | `help` | `label`, 14 | `[gen]` `docs/mvp0/screens/gen.mjs:670`.
`K.s04.more.tip` | Bookmark, find, history | `help` | `label`, 26 | `[gen]` `docs/mvp0/screens/gen.mjs:690`.
`K.s04.wordcount` | {words} words · {mins} min | `plain` | `label`, 22 | `[gen]` `docs/mvp0/screens/gen.mjs:674`. Hidden in Live, where the mode switch takes the room.

---

## 6. S05 Doc mode

id | string | tone | budget | notes
`K.s05.style` | Normal text | `label` | `button`, 14 | `[gen]` `docs/mvp0/screens/gen.mjs:701`.
`K.s05.font` | Google Sans | `label` | `button`, 14 | `[gen]` `docs/mvp0/screens/gen.mjs:702`.
`K.s05.font.tip` | Four faces only: Google Sans, a serif, a mono, and the system face | `help` | `help` | `[gen]` `docs/mvp0/screens/gen.mjs:702`. Answers the founders' "font editing is missing" of 18 September (`docs/mvp0/SCREEN-CHANGES-2026-09-18.md:52`).
`K.s05.more` | More | `label` | `button`, 8 | `[gen]` `docs/mvp0/screens/gen.mjs:707`.
`K.s05.more.tip` | Font, size, colour, highlight, alignment: render here, export to PDF, plain elsewhere | `help` | `help` | `[gen]` `docs/mvp0/screens/gen.mjs:707`. **This is a refusal in a tooltip.** `[M]` Google's own rule, quoted at `docs/mvp0/PRODUCT-PLAN.md` section 7.
`K.s05.suggesting` | Suggesting | `label` | `label`, 14 | `[gen]` `docs/mvp0/screens/gen.mjs:709`.
`K.s05.toast` | Doc mode is a view. The file is still {file}. Page setup lives in its front matter; colours and fonts render here and export to PDF only. | `plain` | `body` | `[gen]` `docs/mvp0/screens/gen.mjs:889`. **Shown once, ever.** Not a tour (`docs/mvp0/PRODUCT-PLAN.md` section 4).

---

## 7. S06 AI writing box

id | string | tone | budget | notes
`K.s06.target.new` | Writing a new document {file} | `plain` | `label`, 36 | `[gen]` `docs/mvp0/screens/gen.mjs:901`. **The box names its target on its own first line**, founder instruction of 18 September (`docs/mvp0/SCREEN-CHANGES-2026-09-18.md:274`).
`K.s06.target.edit` | Editing {file} | `plain` | `label`, 30 | `[new]`, specified at `docs/mvp0/SCREEN-CHANGES-2026-09-18.md:274`.
`K.s06.target.idea` | Idea: {name} | `plain` | `label`, 30 | `[new]`, same source. **Pinned, and does not scroll away**.
`K.s06.target.swap` | Change | `label` | `button`, 10 | `[gen]` `docs/mvp0/screens/gen.mjs:901`.
`K.s06.placeholder` | A booking page for small salons, deposits by UPI, reminders the day before | `plain` | `lede` | `[gen]` `docs/mvp0/screens/gen.mjs:902`. An example, and it must be replaced per template rather than shipped as the one placeholder every person sees.
`K.s06.chip.one` | One document | `label` | `button`, 16 | `[gen]` `docs/mvp0/screens/gen.mjs:903`.
`K.s06.chip.ideas` | Take it to Ideas: a brief and a blueprint | `label` | `label`, 44 | `[gen]` `docs/mvp0/screens/gen.mjs:903`. Phone shortens to "Take it to Ideas" (`docs/mvp0/screens/gen.mjs:912`).
`K.s06.chip.paste` | Clean up a paste | `label` | `button`, 20 | `[gen]` `docs/mvp0/screens/gen.mjs:903`.
`K.s06.chip.plan` | Plan from notes | `label` | `button`, 18 | `[gen]` `docs/mvp0/screens/gen.mjs:903`.
`K.s06.orstart` | Or start from | `label` | `label`, 16 | `[gen]` `docs/mvp0/screens/gen.mjs:904`.
`K.s06.chip.gh` | Open from GitHub | `label` | `button`, 20 | `[gen]` `docs/mvp0/screens/gen.mjs:904`.
`K.s06.chip.drop` | Drop a file or folder | `label` | `button`, 24 | `[gen]` `docs/mvp0/screens/gen.mjs:904`.
`K.s06.chip.template` | A template | `label` | `button`, 14 | `[gen]` `docs/mvp0/screens/gen.mjs:904`.
`K.s06.cost` | A document uses 1 edit credit. This month: {left} of {edits} edits left. | `cost` | `body` | `[gen]` `docs/mvp0/screens/gen.mjs:905`. **Before the click**, rule 7.
`K.s06.cost.phone` | 1 edit credit · {left} of {edits} left | `cost` | `label`, 30 | `[gen]` `docs/mvp0/screens/gen.mjs:913`.
`K.s06.railempty` | Nothing yet. | `plain` | `label`, 16 | `[gen]` `docs/mvp0/screens/gen.mjs:907`.

---

## 8. S07 AI edit

**Seven verbs. Each is a label and a one-line description.** The deck's wording is the screen's, and
section 14 D2 records that the shipped menu says something different.

id | string | tone | budget | notes
`K.s07.refine` | Refine selection | `label` | `button`, 20 | `[gen]` `docs/mvp0/screens/gen.mjs:921`.
`K.s07.refine.sub` | Polish prose, fix grammar | `help` | `help` | `[gen]` `docs/mvp0/screens/gen.mjs:921`.
`K.s07.expand` | Expand | `label` | `button`, 10 | `[gen]` `docs/mvp0/screens/gen.mjs:921`.
`K.s07.expand.sub` | Add detail and depth | `help` | `help` | `[gen]` `docs/mvp0/screens/gen.mjs:921`.
`K.s07.shorten` | Shorten | `label` | `button`, 10 | `[gen]` `docs/mvp0/screens/gen.mjs:921`.
`K.s07.shorten.sub` | More concise, same meaning | `help` | `help` | `[gen]` `docs/mvp0/screens/gen.mjs:921`.
`K.s07.tone` | Change tone | `label` | `button`, 16 | `[gen]` `docs/mvp0/screens/gen.mjs:921`.
`K.s07.tone.sub` | Professional or casual | `help` | `help` | `[gen]` `docs/mvp0/screens/gen.mjs:921`.
`K.s07.translate` | Translate | `label` | `button`, 12 | `[gen]` `docs/mvp0/screens/gen.mjs:921`.
`K.s07.translate.sub` | Keep the markdown intact | `help` | `help` | `[gen]` `docs/mvp0/screens/gen.mjs:921`.
`K.s07.summarise` | Summarise into a callout | `label` | `label`, 26 | `[gen]` `docs/mvp0/screens/gen.mjs:921`. British spelling. The code says Summarize; see D2.
`K.s07.summarise.sub` | Adds a summary block | `help` | `help` | `[gen]` `docs/mvp0/screens/gen.mjs:921`.
`K.s07.links` | Suggest links | `label` | `button`, 16 | `[gen]` `docs/mvp0/screens/gen.mjs:921`.
`K.s07.links.sub` | Wiki links to your notes | `help` | `help` | `[gen]` `docs/mvp0/screens/gen.mjs:921`.
`K.s07.cost` | 1 credit each · {left} left · runs on a free model this month | `cost` | `help` | `[gen]` `docs/mvp0/screens/gen.mjs:921`. On Pro the tail reads "runs on Claude".
`K.s07.sheet.title` | AI edit the selection | `label` | `title`, 24 | `[gen]` `docs/mvp0/screens/gen.mjs:932`. Phone only.

---

## 9. S08 Custom blocks

id | string | tone | budget | notes
`K.s08.elsewhere` | Elsewhere | `label` | `label`, 12 | `[gen]` `docs/mvp0/screens/gen.mjs:982`.
`K.s08.elsewhere.body` | (GitHub, Obsidian, VS Code): the table is still a table, and the chart block is a two-line code block under it. Mermaid renders on GitHub, GitLab and in Obsidian. The callout renders on GitHub as a note. Math renders on GitHub. | `plain` | `body` | `[gen]` `docs/mvp0/screens/gen.mjs:982`. **The degradation statement**, which `docs/mvp0/PRODUCT-PLAN.md` section 20 requires of every format we invent.
`K.s08.tablefolded` | Table folded. Click to show the three rows. | `plain` | `label`, 44 | `[gen]` `docs/mvp0/screens/gen.mjs:972`. `{n}` rows.

---

## 10. S09 Flow view

id | string | tone | budget | notes
`K.s09.viewas` | View as: {view} | `label` | `button`, 22 | `[gen]` `docs/mvp0/screens/gen.mjs:1012`.
`K.s09.view.page` | Page | `label` | `button`, 8 | `[gen]` `docs/mvp0/screens/gen.mjs:1007`.
`K.s09.view.page.sub` | The document | `help` | `help` | `[gen]` `docs/mvp0/screens/gen.mjs:1007`.
`K.s09.view.flow` | Flow | `label` | `button`, 8 | `[gen]` `docs/mvp0/screens/gen.mjs:1007`.
`K.s09.view.flow.sub` | Headings as phases, items as steps | `help` | `help` | `[gen]` `docs/mvp0/screens/gen.mjs:1007`.
`K.s09.view.slides` | Slides | `label` | `button`, 10 | `[gen]` `docs/mvp0/screens/gen.mjs:1007`.
`K.s09.view.slides.sub` | One heading per slide | `help` | `help` | `[gen]` `docs/mvp0/screens/gen.mjs:1007`.
`K.s09.view.mindmap` | Mind map | `label` | `button`, 12 | `[gen]` `docs/mvp0/screens/gen.mjs:1007`.
`K.s09.view.mindmap.sub` | The outline, radial | `help` | `help` | `[gen]` `docs/mvp0/screens/gen.mjs:1007`.
`K.s09.view.kanban` | Kanban | `label` | `button`, 10 | `[gen]` `docs/mvp0/screens/gen.mjs:1007`.
`K.s09.view.kanban.sub` | Task lists as columns | `help` | `help` | `[gen]` `docs/mvp0/screens/gen.mjs:1007`.
`K.s09.view.outline` | Outline | `label` | `button`, 10 | `[gen]` `docs/mvp0/screens/gen.mjs:1007`.
`K.s09.view.outline.sub` | Headings only | `help` | `help` | `[gen]` `docs/mvp0/screens/gen.mjs:1007`.
`K.s09.legend` | Scroll sideways · arrow keys · a phase is an H2, a step is an H3, the tag is the first word in brackets | `help` | `body` | `[gen]` `docs/mvp0/screens/gen.mjs:1014`. **Teaches the convention in one line**, because Flow has no syntax of its own.
`K.s09.count` | {phases} phases · {steps} steps | `plain` | `label`, 26 | `[gen]` `docs/mvp0/screens/gen.mjs:1012`.

**S09 is deferred.** `[Z]` `docs/mvp0/SCREEN-CHANGES-2026-09-18.md:75`: noted, not built now. These
strings are kept so the deferral does not cost the wording.

---

## 11. S10 Problems

**The filter exists because a deterministic finding and a model's opinion must never sit in one
list.** `[Z]` `docs/mvp0/PRODUCT-PLAN.md` section 5.

id | string | tone | budget | notes
`K.s10.title` | Problems | `label` | `label`, 12 | `[gen]` `docs/mvp0/screens/gen.mjs:1040`.
`K.s10.filter.all` | All | `label` | `button`, 6 | `[gen]` `docs/mvp0/screens/gen.mjs:1021`, with a count.
`K.s10.filter.checks` | Checks | `label` | `button`, 10 | `[gen]` `docs/mvp0/screens/gen.mjs:1021`. Deterministic, on the device.
`K.s10.filter.writing` | Writing | `label` | `button`, 10 | `[gen]` `docs/mvp0/screens/gen.mjs:1021`. Advisory, from a model or a rule.
`K.s10.link` | Link goes nowhere | `caution` | `label`, 20 | `[gen]` `docs/mvp0/screens/gen.mjs:1021`.
`K.s10.link.sub` | {target} does not exist in this project | `caution` | `help` | `[gen]` `docs/mvp0/screens/gen.mjs:1021`.
`K.s10.heading` | Heading level skips | `caution` | `label`, 22 | `[gen]` `docs/mvp0/screens/gen.mjs:1022`.
`K.s10.heading.sub` | H1 to H3 with no H2 between them | `caution` | `help` | `[gen]` `docs/mvp0/screens/gen.mjs:1022`. `{from}` and `{to}`.
`K.s10.alt` | Image has no alt text | `caution` | `label`, 24 | `[gen]` `docs/mvp0/screens/gen.mjs:1023`.
`K.s10.alt.sub` | Screen readers and exports will show nothing | `caution` | `help` | `[gen]` `docs/mvp0/screens/gen.mjs:1023`.
`K.s10.table` | Table row has {cells} cells, header has {header} | `caution` | `label`, 46 | `[gen]` `docs/mvp0/screens/gen.mjs:1024`.
`K.s10.table.sub` | It will render wrong on GitHub | `caution` | `help` | `[gen]` `docs/mvp0/screens/gen.mjs:1024`.
`K.s10.sentence` | Sentence is {n} words | `plain` | `label`, 24 | `[gen]` `docs/mvp0/screens/gen.mjs:1025`.
`K.s10.sentence.sub` | Longer than anything else you have written. Split it, or add the "because" that earns it | `plain` | `help` | `[gen]` `docs/mvp0/screens/gen.mjs:1025`. The one advisory row. It never blocks.
`K.s10.never` | Structural checks run on this device and cost nothing. The writing note is advisory and never blocks. | `promise` | `body` | `[gen]` `docs/mvp0/screens/gen.mjs:1042`.
`K.s10.fixall` | Fix all safe | `label` | `button`, 16 | `[gen]` `docs/mvp0/screens/gen.mjs:1045`. **Safe means the fix is byte-determined.** Anything needing a judgement is not in this action.
`K.s10.rules` | Rules | `label` | `button`, 8 | `[gen]` `docs/mvp0/screens/gen.mjs:1045`.
`K.s10.count` | {n} problems | `plain` | `label`, 14 | `[gen]` `docs/mvp0/screens/gen.mjs:1037`.

---

## 12. S11 Instruction files

**Rewritten on 18 September.** It was a health panel on one AGENTS.md; the founders' answer 3
(`docs/mvp0/SCREEN-CHANGES-2026-09-18.md:303`) made it the whole instruction-file set.

id | string | tone | budget | notes
`K.s11.title` | Instruction files | `label` | `label`, 20 | `[gen]` `docs/mvp0/screens/gen.mjs:1071`.
`K.s11.count` | {ok} of {all} | `plain` | `label`, 10 | `[gen]` `docs/mvp0/screens/gen.mjs:1071`.
`K.s11.filter.all` | All | `label` | `button`, 6 | `[gen]` `docs/mvp0/screens/gen.mjs:1072`.
`K.s11.filter.linked` | Linked | `label` | `button`, 10 | `[gen]` `docs/mvp0/screens/gen.mjs:1072`.
`K.s11.filter.copies` | Copies | `label` | `button`, 10 | `[gen]` `docs/mvp0/screens/gen.mjs:1072`.
`K.s11.state.source` | the source | `plain` | `label`, 14 | `[gen]` `docs/mvp0/screens/gen.mjs:1065`.
`K.s11.state.import` | one-line import | `plain` | `label`, 18 | `[gen]` `docs/mvp0/screens/gen.mjs:1066`.
`K.s11.state.instep` | copy, in step | `plain` | `label`, 16 | `[gen]` `docs/mvp0/screens/gen.mjs:1067`.
`K.s11.state.drifted` | copy, drifted | `caution` | `label`, 16 | `[gen]` `docs/mvp0/screens/gen.mjs:1068`.
`K.s11.state.missing` | missing | `plain` | `label`, 10 | `[gen]` `docs/mvp0/screens/gen.mjs:1069`.
`K.s11.addimport` | Add {file} as an import | `label` | `label`, 28 | `[gen]` `docs/mvp0/screens/gen.mjs:1074`.
`K.s11.drift.title` | One copy has drifted | `caution` | `label`, 24 | `[gen]` `docs/mvp0/screens/gen.mjs:1076`. `{n}` copies.
`K.s11.drift.body` | {file} is {n} lines behind {source} | `caution` | `lede` | `[gen]` `docs/mvp0/screens/gen.mjs:1077`.
`K.s11.drift.why` | Cursor does not read a plain .md in that folder, so this one has to be a copy. Diff it, or replace it with a generated copy that cannot drift | `plain` | `body` | `[gen]` `docs/mvp0/screens/gen.mjs:1077`. Per-tool, so `{tool}` and the reason vary.
`K.s11.diff` | Diff | `label` | `button`, 8 | `[gen]` `docs/mvp0/screens/gen.mjs:1078`.
`K.s11.regen` | Regenerate | `label` | `button`, 14 | `[gen]` `docs/mvp0/screens/gen.mjs:1078`.
`K.s11.checks` | Checks | `label` | `label`, 10 | `[gen]` `docs/mvp0/screens/gen.mjs:1080`.
`K.s11.size` | Under every published size limit | `plain` | `label`, 34 | `[gen]` `docs/mvp0/screens/gen.mjs:1081`.
`K.s11.size.sub` | {words} words, {kb} KB. Codex caps this file at 32 KiB | `plain` | `help` | `[gen]` `docs/mvp0/screens/gen.mjs:1081`.
`K.s11.setup` | Setup commands present | `plain` | `label`, 26 | `[gen]` `docs/mvp0/screens/gen.mjs:1082`.
`K.s11.setup.sub` | Install, dev and verify all named | `plain` | `help` | `[gen]` `docs/mvp0/screens/gen.mjs:1082`.
`K.s11.stale` | {n} claims unverified since {date} | `caution` | `label`, 36 | `[gen]` `docs/mvp0/screens/gen.mjs:1083`.
`K.s11.stale.sub` | Line {a} and line {b} name commands nobody has run this week | `caution` | `help` | `[gen]` `docs/mvp0/screens/gen.mjs:1083`.
`K.s11.linted` | Rules a linter already enforces | `caution` | `label`, 34 | `[gen]` `docs/mvp0/screens/gen.mjs:1084`.
`K.s11.linted.sub` | Lines {a} to {b} restate what Prettier and ESLint check. They cost tokens in every session and change nothing | `plain` | `body` | `[gen]` `docs/mvp0/screens/gen.mjs:1084`.
`K.s11.honest` | These checks say the file is correct. They do not claim it makes an agent better at its job: two studies measured no gain in task success, and one measured over 20 per cent added cost. | `promise` | `long` | `[gen]` `docs/mvp0/screens/gen.mjs:1085`. **The most careful string in the deck.** `[O]` It exists because the research found the opposite of what the screen would otherwise imply (`docs/mvp0/SCREEN-CHANGES-2026-09-18.md:91`). Do not soften it, and do not cut the two studies.
`K.s11.tidy` | Tidy this file | `label` | `button`, 18 | `[gen]` `docs/mvp0/screens/gen.mjs:1095`. One credit.
`K.s11.treefoot` | {n} instruction files, {d} drifted | `plain` | `label`, 34 | `[gen]` `docs/mvp0/screens/gen.mjs:1090`.

---

## 13. S12 to S16, the ideas flow

### 13.1 S12 Ideas

id | string | tone | budget | notes
`K.s12.head` | What do you want to build? | `plain` | `title`, 30 | `[gen]` `docs/mvp0/screens/gen.mjs:1148`.
`K.s12.sub` | Describe it in your own words. Questions come next, and you can skip any of them. | `plain` | `lede` | `[gen]` `docs/mvp0/screens/gen.mjs:1148`.
`K.s12.sub.phone` | Questions come next. Skip any of them. | `plain` | `label`, 42 | `[gen]` `docs/mvp0/screens/gen.mjs:1156`.
`K.s12.depth.pill` | {depth} depth | `label` | `button`, 20 | `[gen]` `docs/mvp0/screens/gen.mjs:1120`. Reads like a model picker, `[Z]` `docs/mvp0/SCREEN-CHANGES-2026-09-18.md:103`.
`K.s12.depth.low` | Low | `label` | `button`, 6 | `[gen]` `docs/mvp0/screens/gen.mjs:1123`.
`K.s12.depth.low.sub` | 10 to 15 questions, each with a recommendation | `plain` | `help` | `[gen]` `docs/mvp0/screens/gen.mjs:1123`.
`K.s12.depth.medium` | Medium | `label` | `button`, 10 | `[gen]` `docs/mvp0/screens/gen.mjs:1124`.
`K.s12.depth.medium.sub` | 20 to 30 questions, and every option says where it stands | `plain` | `help` | `[gen]` `docs/mvp0/screens/gen.mjs:1124`.
`K.s12.depth.high` | High | `label` | `button`, 8 | `[gen]` `docs/mvp0/screens/gen.mjs:1125`.
`K.s12.depth.high.sub` | Medium, plus a research pass before the questions | `plain` | `help` | `[gen]` `docs/mvp0/screens/gen.mjs:1125`.
`K.s12.depth.high.badge` | Pro · 3 credits | `cost` | `button`, 18 | `[gen]` `docs/mvp0/screens/gen.mjs:1125`.
`K.s12.attach.image` | Attach a drawing or a screenshot | `help` | `help` | `[gen]` `docs/mvp0/screens/gen.mjs:1134`, a title attribute.
`K.s12.attach.doc` | Attach a document | `help` | `help` | `[gen]` `docs/mvp0/screens/gen.mjs:1135`.
`K.s12.attach.repo` | Point at a repository | `help` | `help` | `[gen]` `docs/mvp0/screens/gen.mjs:1136`.
`K.s12.attached` | Attached. The blueprint will describe these screens and name them in the frontend spec. | `plain` | `body` | `[gen]` `docs/mvp0/screens/gen.mjs:1151`.
`K.s12.startfrom` | Start from | `label` | `label`, 14 | `[gen]` `docs/mvp0/screens/gen.mjs:1152`.
`K.s12.template.own` | One for my industry | `label` | `button`, 24 | `[gen]` `docs/mvp0/screens/gen.mjs:1152`.
`K.s12.cost` | Low uses your blueprint credit for the month. Nothing is sent to a model until you press the arrow. | `cost` | `body` | `[gen]` `docs/mvp0/screens/gen.mjs:1153`. **Two promises in one line:** what it spends, and that nothing has left yet.
`K.s12.rail.title` | Ideas | `label` | `label`, 8 | `[gen]` `docs/mvp0/screens/gen.mjs:1113`.
`K.s12.rail.new` | new | `label` | `button`, 6 | `[gen]` `docs/mvp0/screens/gen.mjs:1113`.
`K.s12.rail.credit` | {n} blueprint credit left this month | `cost` | `label`, 40 | `[gen]` `docs/mvp0/screens/gen.mjs:1115`.

### 13.2 S13 Idea mode, Low

id | string | tone | budget | notes
`K.s13.progress` | Page {p} of {total} | `plain` | `label`, 20 | `[gen]` `docs/mvp0/screens/gen.mjs:1191`.
`K.s13.progress.q` | {answered} of {questions} questions | `plain` | `label`, 28 | `[gen]` `docs/mvp0/screens/gen.mjs:1191`.
`K.s13.recommended` | recommended | `label` | `label`, 14 | `[gen]` `docs/mvp0/screens/gen.mjs:1169`. Lower case, a tag rather than a badge.
`K.s13.notsure` | Not sure, leave it open in DECISIONS.md | `label` | `label`, 42 | `[gen]` `docs/mvp0/screens/gen.mjs:1169`. **A quiet link, never a third option in every card** (`docs/mvp0/PRODUCT-PLAN.md` section 5).
`K.s13.rewriting` | Rewriting this and the next {n} pages from your answer to question {q} | `plain` | `body` | `[gen]` `docs/mvp0/screens/gen.mjs:1177`. **Shown only when a rewrite actually fires**, so it means something (`docs/mvp0/PRODUCT-PLAN.md` section 5).
`K.s13.skip` | Skip | `label` | `button`, 8 | `[gen]` `docs/mvp0/screens/gen.mjs:1180`.
`K.s13.choose` | Choose the recommendation | `label` | `button`, 28 | `[gen]` `docs/mvp0/screens/gen.mjs:1180`.
`K.s13.choose.phone` | Recommended | `label` | `button`, 14 | `[gen]` `docs/mvp0/screens/gen.mjs:1199`.
`K.s13.skipall` | Skip all remaining | `label` | `button`, 20 | `[gen]` `docs/mvp0/screens/gen.mjs:1181`. Page two onward only.
`K.s13.next` | Next | `label` | `button`, 8 | `[gen]` `docs/mvp0/screens/gen.mjs:1182`.
`K.s13.foot` | Anything you skip stays open in DECISIONS.md, and the blueprint says it is open rather than guessing. | `promise` | `body` | `[gen]` `docs/mvp0/screens/gen.mjs:1194`. **A refusal wearing plain clothes:** the product will not record a guess as a decision.

### 13.3 S14 Idea mode, Medium and High

id | string | tone | budget | notes
`K.s14.stands` | Where it stands | `label` | `label`, 18 | `[gen]` `docs/mvp0/screens/gen.mjs:1202`.
`K.s14.forces` | What forces the choice | `label` | `label`, 24 | `[gen]` `docs/mvp0/screens/gen.mjs:1203`.
`K.s14.options` | Options | `label` | `label`, 10 | `[gen]` `docs/mvp0/screens/gen.mjs:1204`.
`K.s14.gains` | Gains | `label` | `label`, 8 | `[gen]` `docs/mvp0/screens/gen.mjs:1205`.
`K.s14.costs` | Costs | `label` | `label`, 8 | `[gen]` `docs/mvp0/screens/gen.mjs:1205`.
`K.s14.evidence` | Evidence | `label` | `label`, 12 | `[gen]` `docs/mvp0/screens/gen.mjs:1207`.
`K.s14.src.template` | template source · last checked {date} | `plain` | `label`, 40 | `[gen]` `docs/mvp0/screens/gen.mjs:1209`. **Medium may only cite the template and the person's own documents** (`docs/mvp0/PRODUCT-PLAN.md` section 9). High cites pages it opened, with the date.
`K.s14.notsure.take` | Not sure, take the recommendation | `label` | `button`, 36 | `[gen]` `docs/mvp0/screens/gen.mjs:1211`.
`K.s14.recorded` | Recorded in DECISIONS.md with the evidence | `plain` | `label`, 44 | `[gen]` `docs/mvp0/screens/gen.mjs:1211`.
`K.s14.foot` | Medium and High ask more, and show where each option stands. Everything else works exactly as it does on Low. | `plain` | `body` | `[gen]` `docs/mvp0/screens/gen.mjs:1224`. `[Z]` Do not fork the route (`docs/mvp0/SCREEN-CHANGES-2026-09-18.md:104`).
`K.s14.skipall.title` | Skip the remaining {n} questions? | `caution` | `title`, 40 | `[gen]` `docs/mvp0/screens/gen.mjs:1226`.
`K.s14.skipall.body1` | Every one of them takes its recommended answer. You can see what was chosen, and change any of it, before the blueprint is written. | `caution` | `long` | `[gen]` `docs/mvp0/screens/gen.mjs:1227`.
`K.s14.skipall.body2` | The brief, the blueprint and the kickoff prompt are all generated from those defaults. | `caution` | `body` | `[gen]` `docs/mvp0/screens/gen.mjs:1228`. `[Z]` The modal must say this plainly (`docs/mvp0/SCREEN-CHANGES-2026-09-18.md:122`).
`K.s14.skipall.keep` | Keep answering | `label` | `button`, 18 | `[gen]` `docs/mvp0/screens/gen.mjs:1229`.
`K.s14.skipall.go` | Use the recommendations | `label` | `button`, 26 | `[gen]` `docs/mvp0/screens/gen.mjs:1229`.

### 13.4 S15 Blueprint ready

id | string | tone | budget | notes
`K.s15.title` | Blueprint | `label` | `label`, 12 | `[gen]` `docs/mvp0/screens/gen.mjs:1239`.
`K.s15.hint.skill` | Loaded first | `plain` | `label`, 16 | `[gen]` `docs/mvp0/screens/gen.mjs:1238`.
`K.s15.hint.agents` | Every agent reads it | `plain` | `label`, 24 | `[gen]` `docs/mvp0/screens/gen.mjs:1238`.
`K.s15.hint.frontend` | From the drawing | `plain` | `label`, 20 | `[gen]` `docs/mvp0/screens/gen.mjs:1238`.
`K.s15.hint.decisions` | {n} decisions, {open} open | `plain` | `label`, 26 | `[gen]` `docs/mvp0/screens/gen.mjs:1238`.
`K.s15.hint.graph` | For the agent | `plain` | `label`, 16 | `[gen]` `docs/mvp0/screens/gen.mjs:1238`.
`K.s15.skillfolder` | A skill folder, so any agent that follows the standard can install it. SKILL.md loads first; the rest only when the agent needs them. | `plain` | `body` | `[gen]` `docs/mvp0/screens/gen.mjs:1241`.
`K.s15.consistency` | Consistency check: every name in 02-DATA-AND-API appears in specs. {n} names were fixed before you saw them. | `plain` | `body` | `[gen]` `docs/mvp0/screens/gen.mjs:1242`.
`K.s15.link.title` | Link, unlisted | `label` | `label`, 16 | `[gen]` `docs/mvp0/screens/gen.mjs:1243`.
`K.s15.link.note` | Anyone with the link can read it. Not indexed. Revoke any time. The hash is printed here so an agent can check the kit before it unpacks it. | `promise` | `long` | `[gen]` `docs/mvp0/screens/gen.mjs:1245`. The out-of-band hash is the point (`docs/mvp0/PRODUCT-PLAN.md` section 5).
`K.s15.kickoff.title` | Kickoff prompt | `label` | `label`, 18 | `[gen]` `docs/mvp0/screens/gen.mjs:1246`.
`K.s15.kickoff.copy` | Copy the kickoff prompt | `label` | `button`, 26 | `[gen]` `docs/mvp0/screens/gen.mjs:1251`.
`K.s15.kickoff.body` | (the prompt itself) | `plain` | `long` | `[gen]` `docs/mvp0/screens/gen.mjs:1247` to `:1250`. **Not translatable and not editable copy.** It is three shell steps and one instruction, and step 1 says "stop unless it prints {hash}".
`K.s15.publishv2` | Edit, then publish v2 | `label` | `button`, 24 | `[gen]` `docs/mvp0/screens/gen.mjs:1259`.
`K.s15.agree` | Files agree | `plain` | `label`, 14 | `[gen]` `docs/mvp0/screens/gen.mjs:1256`.
`K.s15.treefoot` | Blueprint v{n} · {files} files | `plain` | `label`, 28 | `[gen]` `docs/mvp0/screens/gen.mjs:1255`.

### 13.5 S16 The map

id | string | tone | budget | notes
`K.s16.title` | The map | `label` | `label`, 10 | `[gen]` `docs/mvp0/screens/gen.mjs:1280`.
`K.s16.lede` | What an agent reads before it writes anything: the documents, what each one governs, and the decision behind it. | `plain` | `body` | `[gen]` `docs/mvp0/screens/gen.mjs:1281`.
`K.s16.docs` | {docs} documents, {data} data files | `plain` | `label`, 32 | `[gen]` `docs/mvp0/screens/gen.mjs:1282`.
`K.s16.docs.sub` | Every document reachable from 00-BRIEF; graph.json, MANIFEST.json and SHA256SUMS are not nodes | `plain` | `body` | `[gen]` `docs/mvp0/screens/gen.mjs:1282`.
`K.s16.links` | {links} links, {orphans} orphans | `plain` | `label`, 28 | `[gen]` `docs/mvp0/screens/gen.mjs:1283`.
`K.s16.links.sub` | Nothing in specs names an entity 02-DATA-AND-API does not define | `plain` | `help` | `[gen]` `docs/mvp0/screens/gen.mjs:1283`.
`K.s16.decisions` | {n} decisions carried through | `plain` | `label`, 32 | `[gen]` `docs/mvp0/screens/gen.mjs:1284`.
`K.s16.rebuilt` | Rebuilt on every save | `plain` | `label`, 24 | `[gen]` `docs/mvp0/screens/gen.mjs:1285`.
`K.s16.rebuilt.sub` | Structure is read from the files, so it costs no credits | `cost` | `help` | `[gen]` `docs/mvp0/screens/gen.mjs:1285`.
`K.s16.inkit` | In the kit | `label` | `label`, 12 | `[gen]` `docs/mvp0/screens/gen.mjs:1286`.
`K.s16.readable` | Readable | `plain` | `label`, 12 | `[gen]` `docs/mvp0/screens/gen.mjs:1287`.
`K.s16.inkit.note` | Both ship inside the blueprint, so the agent can ask "what governs payments" instead of reading all twelve documents. | `plain` | `body` | `[gen]` `docs/mvp0/screens/gen.mjs:1288`.
`K.s16.phone` | {docs} documents · {links} links · {orphans} orphans. Tap a node to open it. | `plain` | `body` | `[gen]` `docs/mvp0/screens/gen.mjs:1297`.

---

## 14a. S17 Share

id | string | tone | budget | notes
`K.s17.title` | Share {file} | `label` | `title`, 30 | `[gen]` `docs/mvp0/screens/gen.mjs:1320`.
`K.s17.lede` | People you add need a frontmatter account. Links and published pages need nothing. | `plain` | `lede` | `[gen]` `docs/mvp0/screens/gen.mjs:1320`.
`K.s17.people` | People | `label` | `label`, 10 | `[gen]` `docs/mvp0/screens/gen.mjs:1301`.
`K.s17.role.edit` | Can edit | `label` | `button`, 12 | `[gen]` `docs/mvp0/screens/gen.mjs:1302`.
`K.s17.role.read` | Can read | `label` | `button`, 12 | `[gen]` `docs/mvp0/screens/gen.mjs:1308`.
`K.s17.role.owner` | Owner | `label` | `label`, 8 | `[gen]` `docs/mvp0/screens/gen.mjs:1304`.
`K.s17.role.editlive` | Can edit · live | `label` | `label`, 18 | `[gen]` `docs/mvp0/screens/gen.mjs:1305`.
`K.s17.invite.title` | {email} is not on frontmatter yet | `plain` | `label`, 44 | `[gen]` `docs/mvp0/screens/gen.mjs:1303`. **Not an error.** It is an offer, `[Z]` `docs/mvp0/SCREEN-CHANGES-2026-09-18.md:137`.
`K.s17.invite.body` | Invite them and you both get {credits} AI credits when they sign in for the first time. | `plain` | `body` | `[gen]` `docs/mvp0/screens/gen.mjs:1303`, with one change: the drawn string says "Invite her", and the deck's row is gender-neutral. `{credits}` is 5, and "number not final" (`docs/mvp0/SCREEN-CHANGES-2026-09-18.md:138`).
`K.s17.invite.send` | Send invite | `label` | `button`, 14 | `[gen]` `docs/mvp0/screens/gen.mjs:1303`.
`K.s17.collab.limit` | Free includes {collab} live collaborators per document. Pro removes the limit. | `plain` | `body` | `[gen]` `docs/mvp0/screens/gen.mjs:1306`. **Defect, section 15 D1**, and a plain disagreement, section 15 D3.
`K.s17.link` | Link | `label` | `label`, 8 | `[gen]` `docs/mvp0/screens/gen.mjs:1307`.
`K.s17.link.anyone` | Anyone with the link | `label` | `label`, 24 | `[gen]` `docs/mvp0/screens/gen.mjs:1308`.
`K.s17.link.anyone.sub` | (uses `K.promise.noindex`, preceded by "Can read.") | `plain` | `help` | `[gen]` `docs/mvp0/screens/gen.mjs:1308`.
`K.s17.password` | Password | `label` | `label`, 12 | `[gen]` `docs/mvp0/screens/gen.mjs:1309`. Pro.
`K.s17.password.sub` | Asked once per browser. You choose it; we store only a hash. | `promise` | `help` | `[gen]` `docs/mvp0/screens/gen.mjs:1309`.
`K.s17.expires` | Expires | `label` | `label`, 10 | `[gen]` `docs/mvp0/screens/gen.mjs:1310`.
`K.s17.expires.sub` | The link stops working after this. The document stays. | `plain` | `help` | `[gen]` `docs/mvp0/screens/gen.mjs:1310`.
`K.s17.expires.default` | In 7 days | `label` | `button`, 12 | `[gen]` `docs/mvp0/screens/gen.mjs:1310`. `[M]` Bitwarden's default (`docs/mvp0/PRODUCT-PLAN.md` section 10).
`K.s17.publish` | Publish | `label` | `label`, 10 | `[gen]` `docs/mvp0/screens/gen.mjs:1312`.
`K.s17.publish.page` | Published page | `label` | `label`, 18 | `[gen]` `docs/mvp0/screens/gen.mjs:1313`.
`K.s17.publish.sub` | {url} · {used} of {pages} free published pages used | `plain` | `help` | `[gen]` `docs/mvp0/screens/gen.mjs:1313`.

---

## 14b. S18 Published page

**The screen with the most load-bearing copy in the product**, because it is the top of the funnel
and the only surface a stranger meets.

id | string | tone | budget | notes
`K.s18.published` | Published {date} | `plain` | `label`, 20 | `[gen]` `docs/mvp0/screens/gen.mjs:1329`.
`K.s18.download` | Download .md | `label` | `button`, 16 | `[gen]` `docs/mvp0/screens/gen.mjs:1330`.
`K.s18.open` | Open in frontmatter | `label` | `button`, 22 | `[gen]` `docs/mvp0/screens/gen.mjs:1330`.
`K.s18.openbar` | You have the frontmatter desktop app. Open this there? | `plain` | `lede` | `[gen]` `docs/mvp0/screens/gen.mjs:1331`. **After first paint, never before** (`docs/mvp0/SCREEN-CHANGES-2026-09-18.md:324`).
`K.s18.openbar.app` | Open in the app | `label` | `button`, 18 | `[gen]` `docs/mvp0/screens/gen.mjs:1332`.
`K.s18.openbar.web` | Open on the web | `label` | `button`, 18 | `[gen]` `docs/mvp0/screens/gen.mjs:1332`.
`K.s18.openbar.stay` | Stay here | `label` | `button`, 12 | `[gen]` `docs/mvp0/screens/gen.mjs:1332`. Dismissal is remembered.
`K.s18.kickoff.title` | The kickoff prompt | `label` | `label`, 20 | `[gen]` `docs/mvp0/screens/gen.mjs:1334`.
`K.s18.kickoff.lede` | Copy this into Claude Code, Cursor or Codex and it builds from these documents. | `plain` | `lede` | `[gen]` `docs/mvp0/screens/gen.mjs:1334`.
`K.s18.card.title` | Read this properly in frontmatter | `plain` | `title`, 36 | `[gen]` `docs/mvp0/screens/gen.mjs:1337`.
`K.s18.card.body` | Outline, dark mode, comments and a copy you can edit. Free, no card. | `plain` | `lede` | `[gen]` `docs/mvp0/screens/gen.mjs:1337`. "no card" means no payment card.
`K.s18.card.google` | Sign in with Google | `label` | `button`, 22 | `[gen]` `docs/mvp0/screens/gen.mjs:1337`.
`K.s18.card.notnow` | Not now | `label` | `button`, 10 | `[gen]` `docs/mvp0/screens/gen.mjs:1337`.
`K.s18.made` | Made with frontmatter | `plain` | `label`, 24 | `[gen]` `docs/mvp0/screens/gen.mjs:1338`. Free only. Pro removes it.
`K.s18.report` | Report this page | `legal` | `label`, 20 | `[gen]` `docs/mvp0/screens/gen.mjs:1338`. **Required before the first stranger publishes** (`docs/mvp0/PRODUCT-PLAN.md` section 23).
`K.s18.alsoat` | also at {url}.md | `plain` | `label`, 30 | `[gen]` `docs/mvp0/screens/gen.mjs:1338`. The markdown twin.
`K.s18.pw.title` | This link needs a password | `plain` | `title`, 30 | `[gen]` `docs/mvp0/screens/gen.mjs:1341`.
`K.s18.pw.body` | {owner} shared {file} with a password. Ask them for it. | `plain` | `lede` | `[gen]` `docs/mvp0/screens/gen.mjs:1341`. **Never says whether the password was wrong or the link expired**, so the page is not an oracle.
`K.s18.pw.field` | Password | `label` | `label`, 12 | `[gen]` `docs/mvp0/screens/gen.mjs:1342`.
`K.s18.pw.open` | Open | `label` | `button`, 8 | `[gen]` `docs/mvp0/screens/gen.mjs:1342`.
`K.s18.pw.expiry` | Link expires in {n} days. (then `K.promise.nogate`) | `plain` | `help` | `[gen]` `docs/mvp0/screens/gen.mjs:1343`.

**Two routes carry no copy at all, and that is the specification.** `page.md` and `llms.txt` are
never gated, never redirected and never given an interstitial
(`docs/mvp0/SCREEN-CHANGES-2026-09-18.md:325`). **A string added to either is a defect.**

---

## 14c. S19 Live collaboration

id | string | tone | budget | notes
`K.s19.live` | Live | `plain` | `label`, 8 | `[gen]` `docs/mvp0/screens/gen.mjs:1356`.
`K.s19.editing` | {name} is editing this document | `plain` | `label`, 34 | `[gen]` `docs/mvp0/screens/gen.mjs:1355`.
`K.s19.toast` | Free includes {collab} live collaborators per document. | `plain` | `body` | `[gen]` `docs/mvp0/screens/gen.mjs:1359`. **Once**, not on every join. Same defect and disagreement as `K.s17.collab.limit`.
`K.s19.invitemore` | Invite more with Pro | `label` | `button`, 24 | `[gen]` `docs/mvp0/screens/gen.mjs:1359`.

---

## 14d. S20 Document review

**The change queue. Human work and machine work are never one undifferentiated list.** `[Z]`
`docs/mvp0/PRODUCT-PLAN.md` section 5.

id | string | tone | budget | notes
`K.s20.title` | Review | `label` | `label`, 10 | `[gen]` `docs/mvp0/screens/gen.mjs:1384`.
`K.s20.waiting` | {n} waiting | `plain` | `label`, 14 | `[gen]` `docs/mvp0/screens/gen.mjs:1384`.
`K.s20.count` | {n} changes to review | `plain` | `label`, 24 | `[gen]` `docs/mvp0/screens/gen.mjs:1381`.
`K.s20.filter.all` | All | `label` | `button`, 6 | `[gen]` `docs/mvp0/screens/gen.mjs:1372`.
`K.s20.filter.people` | People | `label` | `button`, 10 | `[gen]` `docs/mvp0/screens/gen.mjs:1372`.
`K.s20.filter.ai` | AI and agents | `label` | `button`, 16 | `[gen]` `docs/mvp0/screens/gen.mjs:1372`.
`K.s20.who.person` | {name} · {ago} | `plain` | `label`, 24 | `[gen]` `docs/mvp0/screens/gen.mjs:1373`.
`K.s20.who.ai` | AI edit · you asked to {ask} · {ago} | `plain` | `label`, 44 | `[gen]` `docs/mvp0/screens/gen.mjs:1374`. **Names the ask**, so the person knows what they requested.
`K.s20.who.agent` | {agent} · edited the file on disk · {ago} | `plain` | `label`, 44 | `[gen]` `docs/mvp0/screens/gen.mjs:1375`.
`K.s20.showdiff` | Show diff first | `label` | `button`, 18 | `[gen]` `docs/mvp0/screens/gen.mjs:1375`. **The agent row has no one-click Accept.** That is deliberate, not an omission.
`K.s20.acceptall` | Accept {name}'s {n} change | `label` | `button`, 28 | `[gen]` `docs/mvp0/screens/gen.mjs:1376`. Plural on `{n}`. **Only ever a named person's edits**.
`K.s20.acceptall.note` | Asks you to confirm the count. AI and agent items are accepted one at a time. | `promise` | `body` | `[gen]` `docs/mvp0/screens/gen.mjs:1376`. `[M]` The over-acceptance literature, cited at `docs/mvp0/PRODUCT-PLAN.md` section 5.
`K.s20.comments.open` | {n} open | `plain` | `label`, 12 | `[gen]` `docs/mvp0/screens/gen.mjs:1385`.

---

## 14e. S21 Document history

id | string | tone | budget | notes
`K.s21.title` | Document history | `label` | `label`, 20 | `[gen]` `docs/mvp0/screens/gen.mjs:1402`.
`K.s21.plan` | Pro · 90 days | `plain` | `label`, 16 | `[gen]` `docs/mvp0/screens/gen.mjs:1402`. On Free it reads "{history} days".
`K.s21.viewing` | Viewing {time} version | `plain` | `label`, 26 | `[gen]` `docs/mvp0/screens/gen.mjs:1398`.
`K.s21.restore` | Restore this version | `label` | `button`, 24 | `[gen]` `docs/mvp0/screens/gen.mjs:1400`.
`K.s21.copyasnew` | Copy as new document | `label` | `button`, 24 | `[gen]` `docs/mvp0/screens/gen.mjs:1400`.
`K.s21.exportzip` | Export history as .zip | `label` | `button`, 26 | `[gen]` `docs/mvp0/screens/gen.mjs:1403`.
`K.s21.author.ai` | AI edit, accepted by you | `plain` | `label`, 26 | `[gen]` `docs/mvp0/screens/gen.mjs:1393`. **Attribution survives here**, which is what replaced review state (`docs/mvp0/PRODUCT-PLAN.md` section 17).
`K.s21.author.blueprint` | Blueprint v{n} written | `plain` | `label`, 26 | `[gen]` `docs/mvp0/screens/gen.mjs:1393`.
`K.s21.author.created` | Created | `plain` | `label`, 10 | `[gen]` `docs/mvp0/screens/gen.mjs:1393`.

---

## 14f. S22 Import

id | string | tone | budget | notes
`K.s22.title` | Bring your documents in | `plain` | `title`, 28 | `[gen]` `docs/mvp0/screens/gen.mjs:1423`.
`K.s22.lede` | Nothing is converted unless it has to be. Markdown stays markdown, byte for byte. | `promise` | `lede` | `[gen]` `docs/mvp0/screens/gen.mjs:1423`.
`K.s22.drop` | Drop files or a folder here | `plain` | `title`, 30 | `[gen]` `docs/mvp0/screens/gen.mjs:1410`.
`K.s22.drop.sub` | Markdown, text, images, PDF, Word. A folder keeps its structure and becomes a project. | `plain` | `body` | `[gen]` `docs/mvp0/screens/gen.mjs:1410`.
`K.s22.src.folder` | A folder | `label` | `label`, 12 | `[gen]` `docs/mvp0/screens/gen.mjs:1409`.
`K.s22.src.folder.sub` | Keeps the structure. Obsidian vaults work as they are | `plain` | `help` | `[gen]` `docs/mvp0/screens/gen.mjs:1409`.
`K.s22.src.github` | GitHub | `label` | `label`, 10 | `[gen]` `docs/mvp0/screens/gen.mjs:1409`.
`K.s22.src.github.sub` | A repository's docs, with write-back | `plain` | `help` | `[gen]` `docs/mvp0/screens/gen.mjs:1409`.
`K.s22.src.drive` | Google Drive | `label` | `label`, 16 | `[gen]` `docs/mvp0/screens/gen.mjs:1409`.
`K.s22.src.drive.sub` | Pick a folder; it stays in sync | `plain` | `help` | `[gen]` `docs/mvp0/screens/gen.mjs:1409`.
`K.s22.src.gdocs` | Google Docs | `label` | `label`, 16 | `[gen]` `docs/mvp0/screens/gen.mjs:1409`.
`K.s22.src.gdocs.sub` | Converted to markdown on import | `plain` | `help` | `[gen]` `docs/mvp0/screens/gen.mjs:1409`.
`K.s22.src.word` | Word (.docx) | `label` | `label`, 16 | `[gen]` `docs/mvp0/screens/gen.mjs:1409`.
`K.s22.src.word.sub` | Converted in your browser, nothing uploaded | `promise` | `help` | `[gen]` `docs/mvp0/screens/gen.mjs:1409`.
`K.s22.src.notion` | Notion export | `label` | `label`, 18 | `[gen]` `docs/mvp0/screens/gen.mjs:1409`.
`K.s22.src.notion.sub` | The .zip Notion gives you | `plain` | `help` | `[gen]` `docs/mvp0/screens/gen.mjs:1409`.
`K.s22.progress` | Importing {path} | `plain` | `label`, 28 | `[gen]` `docs/mvp0/screens/gen.mjs:1412`.
`K.s22.progress.count` | {done} of {total} | `plain` | `label`, 14 | `[gen]` `docs/mvp0/screens/gen.mjs:1412`.
`K.s22.ok.md` | {n} markdown files | `plain` | `label`, 22 | `[gen]` `docs/mvp0/screens/gen.mjs:1414`.
`K.s22.ok.md.sub` | Front matter kept byte for byte | `promise` | `help` | `[gen]` `docs/mvp0/screens/gen.mjs:1414`.
`K.s22.ok.media` | {img} images, {pdf} PDFs | `plain` | `label`, 26 | `[gen]` `docs/mvp0/screens/gen.mjs:1415`.
`K.s22.ok.media.sub` | Uploaded to the project's attachments | `plain` | `help` | `[gen]` `docs/mvp0/screens/gen.mjs:1415`.
`K.s22.warn` | {n} files need a look | `caution` | `label`, 24 | `[gen]` `docs/mvp0/screens/gen.mjs:1416`.
`K.s22.warn.sub` | Two wikilinks point at notes that are not in the folder; one file is not UTF-8 | `caution` | `body` | `[gen]` `docs/mvp0/screens/gen.mjs:1416`. Each reason is its own row in `17`.
`K.s22.refuse.gdoc` | {n} Google Doc refused | `refusal` | `label`, 26 | `[gen]` `docs/mvp0/screens/gen.mjs:1417`.
`K.s22.refuse.gdoc.sub` | Google exports up to 10 MB; this one is {size}. Split it in Docs and try again | `refusal` | `body` | `[gen]` `docs/mvp0/screens/gen.mjs:1417`. **The model refusal row of the deck.** Three parts in order: what will not happen, why, what to do. `[M]` The 10 MB limit is Google's, quoted at `docs/mvp0/PRODUCT-PLAN.md` section 11.
`K.s22.obsidian` | Obsidian settings found | `plain` | `label`, 26 | `[gen]` `docs/mvp0/screens/gen.mjs:1418`.
`K.s22.obsidian.sub` | Daily-note path and templates folder read from .obsidian, nothing else touched | `promise` | `body` | `[gen]` `docs/mvp0/screens/gen.mjs:1418`.
`K.s22.openproject` | Open the project | `label` | `button`, 20 | `[gen]` `docs/mvp0/screens/gen.mjs:1424`.
`K.s22.phone.drop` | Choose files or a folder | `label` | `button`, 28 | `[gen]` `docs/mvp0/screens/gen.mjs:1426`.
`K.s22.phone.share` | On Android, after you add frontmatter to your home screen, you can also share from any app. iOS has no share sheet for web apps. | `plain` | `long` | `[gen]` `docs/mvp0/screens/gen.mjs:1426`. **Names the platform that cannot do it**, rather than hiding the control.

---

## 14g. S23 Connections

id | string | tone | budget | notes
`K.s23.title` | Connections | `label` | `title`, 16 | `[gen]` `docs/mvp0/screens/gen.mjs:1447`.
`K.s23.lede` | Each connection asks for the least it can. Every one can be removed here or at the other end. | `promise` | `lede` | `[gen]` `docs/mvp0/screens/gen.mjs:1447`.
`K.s23.drive.status` | Connected · {account} | `plain` | `label`, 28 | `[gen]` `docs/mvp0/screens/gen.mjs:1429`.
`K.s23.drive.folder` | Folder: {folder}. Every save writes the .md there; a change made in Drive shows up here within a few minutes. | `plain` | `body` | `[gen]` `docs/mvp0/screens/gen.mjs:1430`. **"within a few minutes" is the honest form of the five-minute poll** (`docs/mvp0/PRODUCT-PLAN.md` section 11). Never promise seconds.
`K.s23.drive.scope` | (uses `K.promise.drivescope`) | `promise` | `lede` | `[gen]` `docs/mvp0/screens/gen.mjs:1431`.
`K.s23.drive.conflict` | (uses `K.promise.nomerge`) | `promise` | `lede` | `[gen]` `docs/mvp0/screens/gen.mjs:1432`.
`K.s23.drive.change` | Change folder | `label` | `button`, 16 | `[gen]` `docs/mvp0/screens/gen.mjs:1433`.
`K.s23.drive.pause` | Pause sync | `label` | `button`, 14 | `[gen]` `docs/mvp0/screens/gen.mjs:1433`.
`K.s23.drive.disconnect` | Disconnect | `label` | `button`, 14 | `[gen]` `docs/mvp0/screens/gen.mjs:1433`.
`K.s23.gh.status` | Installed on {n} repository | `plain` | `label`, 30 | `[gen]` `docs/mvp0/screens/gen.mjs:1434`. Plural on `{n}`.
`K.s23.gh.scope` | {repo}. GitHub grants this app the whole repository; (then `K.promise.docsonly`) Commits are made as you, with the message you type. | `plain` | `long` | `[gen]` `docs/mvp0/screens/gen.mjs:1435`. **Says the uncomfortable thing first.** GitHub's grant is repository-wide; our restraint is ours (`docs/mvp0/PRODUCT-PLAN.md` section 11).
`K.s23.gh.quota` | {pushes} pushes a month on Free, {used} used. Pull is unlimited. | `cost` | `body` | `[gen]` `docs/mvp0/screens/gen.mjs:1436`.
`K.s23.gh.app` | A GitHub App, not a personal token: you chose the repositories, and you can revoke it on GitHub at any time. | `promise` | `long` | `[gen]` `docs/mvp0/screens/gen.mjs:1437`.
`K.s23.gh.add` | Add a repository | `label` | `button`, 20 | `[gen]` `docs/mvp0/screens/gen.mjs:1438`.
`K.s23.gh.manage` | Manage on GitHub | `label` | `button`, 20 | `[gen]` `docs/mvp0/screens/gen.mjs:1438`.
`K.s23.agents.title` | Your agents | `label` | `label`, 14 | `[gen]` `docs/mvp0/screens/gen.mjs:1439`.
`K.s23.agents.later` | Later · with the MCP server | `plain` | `label`, 30 | `[gen]` `docs/mvp0/screens/gen.mjs:1439`.
`K.s23.agents.row` | {name} · may read and propose · never applies or publishes · last used {ago} | `promise` | `long` | `[gen]` `docs/mvp0/screens/gen.mjs:1440`. **"never applies or publishes" is the permission matrix said aloud** (`docs/mvp0/PRODUCT-PLAN.md` section 19).
`K.s23.agents.new` | New token | `label` | `button`, 12 | `[gen]` `docs/mvp0/screens/gen.mjs:1442`.
`K.s23.agents.setup` | Show the MCP setup | `label` | `button`, 22 | `[gen]` `docs/mvp0/screens/gen.mjs:1442`.

---

## 14h. S24 Offline, S25 Desktop, S26 Quick capture

id | screen | string | tone | budget | notes
`K.s24.banner` | S24 | You are offline. Everything you type is saved on this device and syncs when you are back. | `caution` | `body` | `[gen]` `docs/mvp0/screens/gen.mjs:1457`.
`K.s24.banner.phone` | S24 | Offline. Saved on this phone, syncs when you are back. | `caution` | `body` | `[gen]` `docs/mvp0/screens/gen.mjs:1464`.
`K.s24.lastsync` | S24 | Last synced {time} | `plain` | `label`, 22 | `[gen]` `docs/mvp0/screens/gen.mjs:1457`.
`K.s24.pending` | S24 | Offline · {n} changes waiting to sync | `plain` | `label`, 38 | `[gen]` `docs/mvp0/screens/gen.mjs:1456`.
`K.s24.aioff` | S24 | Needs a connection. The desktop app has a local model. | `refusal` | `body` | `[gen]` `docs/mvp0/screens/gen.mjs:1462`. **A disabled control with its reason beside it**, never a control that fails on click.
`K.s24.mac.title` | S24 | frontmatter for Mac | `label` | `title`, 24 | `[gen]` `docs/mvp0/screens/gen.mjs:1460`.
`K.s24.mac.body` | S24 | Keeps every document as a file on disk, works fully offline with a local model for edits, no document limit. Same account, same documents. | `plain` | `long` | `[gen]` `docs/mvp0/screens/gen.mjs:1460`.
`K.s24.mac.download` | S24 | Download for Mac | `label` | `button`, 20 | `[gen]` `docs/mvp0/screens/gen.mjs:1460`.
`K.s24.mac.later` | S24 | Remind me later | `label` | `button`, 18 | `[gen]` `docs/mvp0/screens/gen.mjs:1460`.
`K.s25.treefoot` | S25 | Synced {ago} · files on disk · no document limit | `plain` | `body` | `[gen]` `docs/mvp0/screens/gen.mjs:1474`.
`K.s25.get.title` | S25 | Get the desktop app | `plain` | `title`, 24 | `[gen]` `docs/mvp0/screens/gen.mjs:1479`.
`K.s25.get.lede` | S25 | Every document as a file on disk. Fully offline. No document limit. Your agents can read the folder directly. | `plain` | `long` | `[gen]` `docs/mvp0/screens/gen.mjs:1479`.
`K.s25.mac` | S25 | Mac | `label` | `label`, 6 | `[gen]` `docs/mvp0/screens/gen.mjs:1480`.
`K.s25.mac.sub` | S25 | Apple silicon and Intel · notarised | `plain` | `help` | `[gen]` `docs/mvp0/screens/gen.mjs:1480`.
`K.s25.win` | S25 | Windows | `label` | `label`, 10 | `[gen]` `docs/mvp0/screens/gen.mjs:1481`.
`K.s25.win.sub` | S25 | Coming. A signing certificate an Indian company can buy is being priced | `refusal` | `body` | `[gen]` `docs/mvp0/screens/gen.mjs:1481`. **Says why, not just "coming"** (`docs/mvp0/PRODUCT-PLAN.md` section 12).
`K.s25.linux` | S25 | Linux | `label` | `label`, 8 | `[gen]` `docs/mvp0/screens/gen.mjs:1482`.
`K.s25.linux.sub` | S25 | AppImage and .deb | `plain` | `help` | `[gen]` `docs/mvp0/screens/gen.mjs:1482`. Unsigned by choice.
`K.s25.emailme` | S25 | Email me the link | `label` | `button`, 20 | `[gen]` `docs/mvp0/screens/gen.mjs:1483`.
`K.s25.sync` | S25 | The web app and this phone stay in sync with it. Same account. | `plain` | `body` | `[gen]` `docs/mvp0/screens/gen.mjs:1483`.
`K.s26.title` | S26 | Quick capture | `label` | `title`, 16 | `[gen]` `docs/mvp0/screens/gen.mjs:1486`.
`K.s26.dest` | S26 | Into {path} | `plain` | `label`, 24 | `[gen]` `docs/mvp0/screens/gen.mjs:1486`.
`K.s26.foot` | S26 | Enter to save · Esc to close · no credits used | `cost` | `body` | `[gen]` `docs/mvp0/screens/gen.mjs:1488`.
`K.s26.phone.title` | S26 | Save to frontmatter | `label` | `title`, 24 | `[gen]` `docs/mvp0/screens/gen.mjs:1491`.
`K.s26.phone.instead` | S26 | Into {file} instead | `label` | `button`, 26 | `[gen]` `docs/mvp0/screens/gen.mjs:1493`.
`K.s26.save` | S26 | Save | `label` | `button`, 8 | `[gen]` `docs/mvp0/screens/gen.mjs:1494`.
`K.s26.install.title` | S26 | Add frontmatter to your home screen | `plain` | `title`, 38 | `[gen]` `docs/mvp0/screens/gen.mjs:1495`.
`K.s26.install.body` | S26 | Opens like an app and keeps working offline. | `plain` | `lede` | `[gen]` `docs/mvp0/screens/gen.mjs:1495`.
`K.s26.install.go` | S26 | Install | `label` | `button`, 10 | `[gen]` `docs/mvp0/screens/gen.mjs:1495`.

---

## 14i. S28 Settings

id | string | tone | budget | notes
`K.s28.title` | Settings | `label` | `title`, 12 | `[gen]` `docs/mvp0/screens/gen.mjs:1535`.
`K.s28.lede` | Settings live on your account, so the web app, the desktop app and your phone agree. Nothing here needs a restart. | `promise` | `long` | `[gen]` `docs/mvp0/screens/gen.mjs:1535`.
`K.s28.nav.account` | Account | `label` | `label`, 10 | `[gen]` `docs/mvp0/screens/gen.mjs:1512`.
`K.s28.nav.appearance` | Appearance | `label` | `label`, 14 | `[gen]` `docs/mvp0/screens/gen.mjs:1512`.
`K.s28.nav.editor` | Editor | `label` | `label`, 10 | `[gen]` `docs/mvp0/screens/gen.mjs:1512`.
`K.s28.nav.writing` | Writing | `label` | `label`, 10 | `[gen]` `docs/mvp0/screens/gen.mjs:1512`.
`K.s28.nav.ai` | AI | `label` | `label`, 6 | `[gen]` `docs/mvp0/screens/gen.mjs:1512`.
`K.s28.nav.connections` | Connections | `label` | `label`, 14 | `[gen]` `docs/mvp0/screens/gen.mjs:1512`.
`K.s28.nav.sharing` | Sharing | `label` | `label`, 10 | `[gen]` `docs/mvp0/screens/gen.mjs:1512`.
`K.s28.nav.data` | Data and export | `label` | `label`, 18 | `[gen]` `docs/mvp0/screens/gen.mjs:1512`.
`K.s28.nav.shortcuts` | Shortcuts | `label` | `label`, 12 | `[gen]` `docs/mvp0/screens/gen.mjs:1512`. The settings section survives; the workspace panel does not (`docs/mvp0/PRODUCT-PLAN.md` section 5).
`K.s28.nav.plan` | Plan and usage | `label` | `label`, 18 | `[gen]` `docs/mvp0/screens/gen.mjs:1512`.
`K.s28.defaultmode` | Default mode | `label` | `label`, 16 | `[gen]` `docs/mvp0/screens/gen.mjs:1518`.
`K.s28.defaultmode.sub` | How a document opens | `help` | `help` | `[gen]` `docs/mvp0/screens/gen.mjs:1518`.
`K.s28.docdefault` | Doc mode by default in Live | `label` | `label`, 30 | `[gen]` `docs/mvp0/screens/gen.mjs:1519`.
`K.s28.docdefault.sub` | Off shows plain markdown; on shows the Doc surface | `help` | `help` | `[gen]` `docs/mvp0/screens/gen.mjs:1519`.
`K.s28.linewidth` | Line width | `label` | `label`, 14 | `[gen]` `docs/mvp0/screens/gen.mjs:1520`.
`K.s28.linewidth.sub` | Characters per line in the writing area | `help` | `help` | `[gen]` `docs/mvp0/screens/gen.mjs:1520`.
`K.s28.spellcheck` | Spellcheck | `label` | `label`, 14 | `[gen]` `docs/mvp0/screens/gen.mjs:1521`.
`K.s28.spellcheck.sub` | Your browser's own. Where your browser sends text to its vendor, that is your browser's setting | `promise` | `body` | `[gen]` `docs/mvp0/screens/gen.mjs:1521`. **Refuses to take credit or blame for something we do not control**.
`K.s28.vim` | Vim keys | `label` | `label`, 12 | `[gen]` `docs/mvp0/screens/gen.mjs:1522`.
`K.s28.vim.sub` | Modal editing in Edit mode | `help` | `help` | `[gen]` `docs/mvp0/screens/gen.mjs:1522`.
`K.s28.checks` | Structural problems | `label` | `label`, 22 | `[gen]` `docs/mvp0/screens/gen.mjs:1524`.
`K.s28.checks.sub` | Broken links, heading skips, table shape, missing alt text | `help` | `help` | `[gen]` `docs/mvp0/screens/gen.mjs:1524`.
`K.s28.plain` | Plain-language notes | `label` | `label`, 24 | `[gen]` `docs/mvp0/screens/gen.mjs:1525`.
`K.s28.plain.sub` | Long sentences and ornamental words. Advisory, never blocks | `promise` | `help` | `[gen]` `docs/mvp0/screens/gen.mjs:1525`.
`K.s28.model` | Model for edits | `label` | `label`, 18 | `[gen]` `docs/mvp0/screens/gen.mjs:1527`.
`K.s28.model.sub` | Free uses a free provider this month; Pro uses Claude | `plain` | `help` | `[gen]` `docs/mvp0/screens/gen.mjs:1527`.
`K.s28.aiselection` | AI on a selection and in the box | `label` | `label`, 34 | `[gen]` `docs/mvp0/screens/gen.mjs:1528`.
`K.s28.aiselection.sub` | Sends only the text you select or type into the box, when you ask | `promise` | `body` | `[gen]` `docs/mvp0/screens/gen.mjs:1528`.
`K.s28.ghost` | Ghost text as I type | `label` | `label`, 24 | `[gen]` `docs/mvp0/screens/gen.mjs:1529`.
`K.s28.ghost.sub` | Sends what you are typing to the model as you go. Off by default | `promise` | `body` | `[gen]` `docs/mvp0/screens/gen.mjs:1529`. **Says what it sends before it says it is optional**.
`K.s28.markai` | Mark AI text | `label` | `label`, 16 | `[gen]` `docs/mvp0/screens/gen.mjs:1530`.
`K.s28.markai.sub` | Every accepted AI edit is recorded in the version record with the model and the ask. Inline marks in the file are off by default | `promise` | `long` | `[gen]` `docs/mvp0/screens/gen.mjs:1530`.
`K.s28.signedin` | Signed in as {account} | `plain` | `label`, 28 | `[gen]` `docs/mvp0/screens/gen.mjs:1537`.
`K.s28.signout` | Sign out | `label` | `button`, 12 | `[gen]` `docs/mvp0/screens/gen.mjs:1537`.

---

## 14j. S29 Plan and usage

id | string | tone | budget | notes
`K.s29.title` | Plan and usage | `label` | `title`, 18 | `[gen]` `docs/mvp0/screens/gen.mjs:1554`.
`K.s29.lede` | {plan} plan · {name} · Allowances reset {date} | `plain` | `lede` | `[gen]` `docs/mvp0/screens/gen.mjs:1554`. **The reset date is stated**, not left to be guessed.
`K.s29.meter.edits` | AI edits | `label` | `label`, 12 | `[gen]` `docs/mvp0/screens/gen.mjs:1540`.
`K.s29.meter.edits.val` | {left} of {edits} left | `cost` | `label`, 22 | `[gen]` `docs/mvp0/screens/gen.mjs:1540`.
`K.s29.meter.kits` | Blueprints | `label` | `label`, 14 | `[gen]` `docs/mvp0/screens/gen.mjs:1541`.
`K.s29.meter.kits.val` | {left} of {kits} left · {depth} | `cost` | `label`, 28 | `[gen]` `docs/mvp0/screens/gen.mjs:1541`.
`K.s29.meter.docs` | Documents in the cloud | `label` | `label`, 26 | `[gen]` `docs/mvp0/screens/gen.mjs:1542`.
`K.s29.meter.pages` | Published pages | `label` | `label`, 18 | `[gen]` `docs/mvp0/screens/gen.mjs:1543`.
`K.s29.free.price` | ₹0 | `cost` | `label`, 6 | `[gen]` `docs/mvp0/screens/gen.mjs:1544`.
`K.s29.free.everything` | Every feature: the editor, Doc mode, offline in the browser, every export, every view | `promise` | `body` | `[gen]` `docs/mvp0/screens/gen.mjs:1545`. The founders' rule, narrowed and recorded at `docs/mvp0/PRODUCT-PLAN.md` section 29.
`K.s29.free.caps` | {docs} documents in the cloud, {pages} published pages, {uploads} of uploads | `plain` | `body` | `[gen]` `docs/mvp0/screens/gen.mjs:1545`.
`K.s29.free.ai` | {kits} blueprint at Low and {edits} AI edits a month | `cost` | `body` | `[gen]` `docs/mvp0/screens/gen.mjs:1545`.
`K.s29.free.collab` | {collab} live collaborators per document · {repos} GitHub repository, {pushes} pushes a month · Google Drive sync | `plain` | `long` | `[gen]` `docs/mvp0/screens/gen.mjs:1545`. Plural defect again, section 15 D1.
`K.s29.free.history` | Document history, {history} days · expiring links · the desktop app with unlimited documents on disk | `plain` | `long` | `[gen]` `docs/mvp0/screens/gen.mjs:1545`.
`K.s29.free.not` | Password on links · Medium and High ideas · portfolio | `plain` | `body` | `[gen]` `docs/mvp0/screens/gen.mjs:1545`. **The four Pro exceptions, named plainly on the Free card.** Nothing else is withheld.
`K.s29.current` | Current plan | `label` | `button`, 16 | `[gen]` `docs/mvp0/screens/gen.mjs:1545`.
`K.s29.pro.price` | ₹299 | `cost` | `label`, 8 | `[gen]` `docs/mvp0/screens/gen.mjs:1546`.
`K.s29.pro.price.sub` | a month incl. GST, or ₹2,499 a year | `cost` | `help` | `[gen]` `docs/mvp0/screens/gen.mjs:1546`. **GST inclusive is stated on the price**, not in a footnote.
`K.s29.pro.unlimited` | Unlimited documents, published pages and collaborators | `plain` | `body` | `[gen]` `docs/mvp0/screens/gen.mjs:1547`.
`K.s29.pro.ai` | 5 blueprints at any depth and 100 AI edits a month, on Claude | `cost` | `body` | `[gen]` `docs/mvp0/screens/gen.mjs:1547`.
`K.s29.pro.history` | Document history, 90 days · unlimited repositories and pushes | `plain` | `body` | `[gen]` `docs/mvp0/screens/gen.mjs:1547`.
`K.s29.pro.links` | Password and expiry on every link · no "made with" line | `plain` | `body` | `[gen]` `docs/mvp0/screens/gen.mjs:1547`.
`K.s29.pro.portfolio` | Your portfolio at frontmatter.in/@you | `plain` | `body` | `[gen]` `docs/mvp0/screens/gen.mjs:1547`.
`K.s29.upgrade` | Upgrade to Pro | `label` | `button`, 18 | `[gen]` `docs/mvp0/screens/gen.mjs:1547`.
`K.s29.payment` | UPI, cards. Cancel any time. Top-up: 50 edits for ₹99, 3 blueprints for ₹149. | `cost` | `body` | `[gen]` `docs/mvp0/screens/gen.mjs:1548`.
`K.s29.team` | Team · seats, shared workspaces, one bill · after Pro | `plain` | `body` | `[gen]` `docs/mvp0/screens/gen.mjs:1549`.
`K.s29.enterprise` | Enterprise · later · talk to us | `plain` | `body` | `[gen]` `docs/mvp0/screens/gen.mjs:1549`.

**One string this screen needs and does not have.** `[new]` An Indian card gets one payment attempt,
and a mandate is capped at ₹15,000 (`docs/mvp0/PRODUCT-PLAN.md` section 5). **A failed first attempt needs
a string that says so**, or the person will assume the card is bad. It is `E`-numbered in `17` and
has no words yet.

---

## 14k. S30 Portfolio

id | string | tone | budget | notes
`K.s30.published` | Published · {url} | `plain` | `label`, 34 | `[gen]` `docs/mvp0/screens/gen.mjs:1565`.
`K.s30.live` | Live at {url} | `plain` | `label`, 30 | `[gen]` `docs/mvp0/screens/gen.mjs:1564`.
`K.s30.onefile` | One file. | `plain` | `label`, 12 | `[gen]` `docs/mvp0/screens/gen.mjs:1585`.
`K.s30.onefile.body` | The front matter is the profile, the folder is the writing. Nothing here is a second format: the same file renders as a page in any markdown tool. | `promise` | `long` | `[gen]` `docs/mvp0/screens/gen.mjs:1585`.
`K.s30.projects` | Projects | `label` | `label`, 12 | `[gen]` `docs/mvp0/screens/gen.mjs:1559`.
`K.s30.writing` | Writing | `label` | `label`, 10 | `[gen]` `docs/mvp0/screens/gen.mjs:1560`.

---

## 14l. S31 Conflict

**The screen the plan's central promise exists for.**

id | string | tone | budget | notes
`K.s31.banner` | Two versions of {file} changed the same paragraph while one of them was offline. Nothing was merged. Choose one, or keep both. | `caution` | `long` | `[gen]` `docs/mvp0/screens/gen.mjs:1599`. **"Nothing was merged" comes before the instruction**, because that is the fear to answer first.
`K.s31.banner.phone` | Two versions changed the same paragraph. Nothing was merged. | `caution` | `body` | `[gen]` `docs/mvp0/screens/gen.mjs:1604`.
`K.s31.side` | {source} · {who} · {time} | `plain` | `label`, 34 | `[gen]` `docs/mvp0/screens/gen.mjs:1600`. `{source}` is "This browser", "This phone", "Google Drive", the desktop or GitHub.
`K.s31.keep` | Keep this one | `label` | `button`, 16 | `[gen]` `docs/mvp0/screens/gen.mjs:1600`.
`K.s31.keepboth` | Keep both as two files | `label` | `button`, 26 | `[gen]` `docs/mvp0/screens/gen.mjs:1602`.
`K.s31.letai` | Let AI decide | `label` | `button`, 16 | `[gen]` `docs/mvp0/screens/gen.mjs:1602`. **Offered, not hidden** `[Z]` (`docs/mvp0/SCREEN-CHANGES-2026-09-18.md:202`). Its proposal enters the change queue; it never writes to the file.
`K.s31.note` | Whichever you choose, the other version stays in history. The same screen appears for a desktop edit against a GitHub change. | `promise` | `long` | `[gen]` `docs/mvp0/screens/gen.mjs:1602`.
`K.s31.count` | {n} conflict to resolve | `caution` | `label`, 26 | `[gen]` `docs/mvp0/screens/gen.mjs:1598`. Plural on `{n}`.

**`K.s31.letai` needs a second string that does not exist.** `[new]` When the proposal arrives in the
queue it needs a row that says it came from a merge attempt and is a proposal, not a result. Without
it the screen's promise and the queue's behaviour are only connected in a document.

---

## 14m. S32 AI unavailable

**Every string here is a refusal, and this screen is the deck's reference for how one reads.**

id | string | tone | budget | notes
`K.s32.headline` | (uses `K.promise.untouched`, preceded by "AI is unavailable right now.") | `refusal` | `body` | `[gen]` `docs/mvp0/screens/gen.mjs:1610`. **Order matters.** The state, then the two things the person is afraid of, then what to do. No apology.
`K.s32.provider.row` | {provider} · {reason} | `plain` | `label`, 44 | `[gen]` `docs/mvp0/screens/gen.mjs:1611`.
`K.s32.reason.rate` | rate limit, resets in {n} s | `plain` | `label`, 28 | `[gen]` `docs/mvp0/screens/gen.mjs:1611`.
`K.s32.reason.pool` | daily pool used, resets {time} | `plain` | `label`, 32 | `[gen]` `docs/mvp0/screens/gen.mjs:1611`.
`K.s32.reason.trial` | trial ended {date} | `plain` | `label`, 22 | `[gen]` `docs/mvp0/screens/gen.mjs:1611`.
`K.s32.reason.timeout` | timed out | `plain` | `label`, 12 | `[gen]` `docs/mvp0/screens/gen.mjs:1611`.
`K.s32.try` | Try again in a minute | `label` | `button`, 24 | `[gen]` `docs/mvp0/screens/gen.mjs:1612`.
`K.s32.local` | Use the local model on the desktop app | `label` | `label`, 42 | `[gen]` `docs/mvp0/screens/gen.mjs:1612`.
`K.s32.ownkey` | Use my own key | `label` | `button`, 18 | `[gen]` `docs/mvp0/screens/gen.mjs:1612`. Only when the bring-your-own-key flag is on (S37).
`K.s32.credits` | Your {left} remaining edits are still yours. (then `K.promise.nocharge`) | `promise` | `body` | `[gen]` `docs/mvp0/screens/gen.mjs:1613`.
`K.s32.aioff` | Every provider is down. Try again in a minute. | `refusal` | `body` | `[gen]` `docs/mvp0/screens/gen.mjs:1622`.

**The provider list is shown on purpose.** `[P]` The chain has four links and the plan says what
happens when the fourth fails (`docs/mvp0/PRODUCT-PLAN.md` section 5). A person who can see that four
services refused knows the fault is not their document.

**The graceful path, and it is the one that matters commercially.** When the model layer is degraded
the idea flow falls back to a standard question set rather than an apology
(`docs/mvp0/PRODUCT-PLAN.md` section 14). `[new]` That string does not exist yet: something in the register
of "Use a standard question set", plus one line saying the questions will be good and not tailored.

---

## 14n. S33 Over the cap

id | string | tone | budget | notes
`K.s33.title` | That is your {n}th cloud document | `caution` | `title`, 40 | `[gen]` `docs/mvp0/screens/gen.mjs:1627`. Also fires for the {edits}th edit and the {pages}th page, with its own ordinal.
`K.s33.body` | Free keeps {docs} documents in the cloud. (then `K.promise.readable`) | `promise` | `body` | `[gen]` `docs/mvp0/screens/gen.mjs:1627`.
`K.s33.still.open` | Open, edit and export every document | `promise` | `body` | `[gen]` `docs/mvp0/screens/gen.mjs:1628`.
`K.s33.still.share` | Share and publish what you have | `promise` | `body` | `[gen]` `docs/mvp0/screens/gen.mjs:1628`.
`K.s33.not.create` | Create a new cloud document until you are under {docs} | `refusal` | `body` | `[gen]` `docs/mvp0/screens/gen.mjs:1628`. The only thing that stops.
`K.s33.do.delete` | Delete or export something | `label` | `label`, 28 | `[gen]` `docs/mvp0/screens/gen.mjs:1629`.
`K.s33.do.desktop` | Use the desktop app, which has no cap | `label` | `label`, 40 | `[gen]` `docs/mvp0/screens/gen.mjs:1629`.
`K.s33.do.pro` | Move to Pro, ₹299 a month incl. GST | `label` | `label`, 38 | `[gen]` `docs/mvp0/screens/gen.mjs:1629`. **Third of three**, and not the focused control (`15-INTERACTION-AND-KEYBOARD.md` section 6.1).
`K.s33.downgrade` | A downgraded account meets this same screen: nothing is removed, nothing new is created until it is under the cap. | `promise` | `long` | `[gen]` `docs/mvp0/screens/gen.mjs:1630`.
`K.s33.treefoot` | {used} of {docs} cloud documents | `caution` | `label`, 30 | `[gen]` `docs/mvp0/screens/gen.mjs:1634`.

**`K.s33.title` needs an ordinal rule.** "50th" is drawn; 1st, 2nd, 3rd, 11th, 21st and 101st all
differ. **A naive suffix is a defect.**

---

## 14o. S34 Ideas, empty

id | string | tone | budget | notes
`K.s34.lede` | Describe an idea. Answer a few questions. Get a brief and a blueprint of fifteen files that an agent can build from, checked for consistency, at a link you can hand to Claude Code, Cursor or Codex. | `plain` | `long` | `[gen]` `docs/mvp0/screens/gen.mjs:1645`.
`K.s34.low` | Low, free: 10 to 15 questions with a recommendation each | `plain` | `body` | `[gen]` `docs/mvp0/screens/gen.mjs:1646`.
`K.s34.medium` | Medium, Pro: 20 to 30 questions, each with where it stands and what forces the choice | `plain` | `body` | `[gen]` `docs/mvp0/screens/gen.mjs:1646`.
`K.s34.high` | High, Pro: Medium plus a research pass with sources opened and dated | `plain` | `body` | `[gen]` `docs/mvp0/screens/gen.mjs:1646`.
`K.s34.prompt` | What are you building, and for whom? | `plain` | `title`, 40 | `[gen]` `docs/mvp0/screens/gen.mjs:1647`.
`K.s34.example` | Open the example: a booking page for salons | `label` | `label`, 46 | `[gen]` `docs/mvp0/screens/gen.mjs:1648`.
`K.s34.template` | Pick an industry template | `label` | `button`, 28 | `[gen]` `docs/mvp0/screens/gen.mjs:1648`.
`K.s34.example.note` | The example is a real kit, made by hand, so you can read all fifteen files before spending your blueprint credit. | `plain` | `long` | `[gen]` `docs/mvp0/screens/gen.mjs:1649`. `[M]` Nielsen: do not default to totally empty states (`docs/mvp0/PRODUCT-PLAN.md` section 5).
`K.s34.railempty` | Your ideas will be listed here with where each one stands. | `plain` | `body` | `[gen]` `docs/mvp0/screens/gen.mjs:1653`.
`K.s34.credit` | {n} blueprint credit this month | `cost` | `label`, 34 | `[gen]` `docs/mvp0/screens/gen.mjs:1653`.
`K.s34.step1` | 1 Describe | `label` | `label`, 14 | `[gen]` `docs/mvp0/screens/gen.mjs:1654`.
`K.s34.step2` | 2 Decide | `label` | `label`, 12 | `[gen]` `docs/mvp0/screens/gen.mjs:1654`.
`K.s34.step3` | 3 Write | `label` | `label`, 10 | `[gen]` `docs/mvp0/screens/gen.mjs:1654`.
`K.s34.step4` | 4 Hand off | `label` | `label`, 14 | `[gen]` `docs/mvp0/screens/gen.mjs:1654`.

---

## 14p. S35 to S38, the configuration panel

**Founders only.** The same rules apply, because a founder reading a vague string at two in the
morning makes the same mistake anyone else would.

id | screen | string | tone | budget | notes
`K.s35.title` | S35 | Plans and limits | `label` | `title`, 20 | `[gen]` `docs/mvp0/screens/gen.mjs:1686`.
`K.s35.lede` | S35 | What each plan allows. The product reads this table and nothing else; there is no copy of these numbers in the source. | `promise` | `long` | `[gen]` `docs/mvp0/screens/gen.mjs:1686`. The one-read-path rule (`docs/mvp0/PRODUCT-PLAN.md` section 30).
`K.s35.col.limit` | S35 | Limit | `label` | `label`, 8 | `[gen]` `docs/mvp0/screens/gen.mjs:1679`.
`K.s35.col.lastchange` | S35 | Last change | `label` | `label`, 14 | `[gen]` `docs/mvp0/screens/gen.mjs:1679`.
`K.s35.row.docs` | S35 | Documents in the cloud | `label` | `label`, 26 | `[gen]` `docs/mvp0/screens/gen.mjs:1669`.
`K.s35.row.pages` | S35 | Published pages | `label` | `label`, 18 | `[gen]` `docs/mvp0/screens/gen.mjs:1670`.
`K.s35.row.collab` | S35 | Live collaborators | `label` | `label`, 22 | `[gen]` `docs/mvp0/screens/gen.mjs:1671`.
`K.s35.row.history` | S35 | Document history | `label` | `label`, 20 | `[gen]` `docs/mvp0/screens/gen.mjs:1672`.
`K.s35.row.uploads` | S35 | Uploads | `label` | `label`, 10 | `[gen]` `docs/mvp0/screens/gen.mjs:1673`.
`K.s35.row.edits` | S35 | AI edits a month | `label` | `label`, 20 | `[gen]` `docs/mvp0/screens/gen.mjs:1674`.
`K.s35.row.kits` | S35 | Blueprints a month | `label` | `label`, 22 | `[gen]` `docs/mvp0/screens/gen.mjs:1675`.
`K.s35.row.repos` | S35 | GitHub repositories | `label` | `label`, 22 | `[gen]` `docs/mvp0/screens/gen.mjs:1676`.
`K.s35.row.pushes` | S35 | GitHub pushes a month | `label` | `label`, 24 | `[gen]` `docs/mvp0/screens/gen.mjs:1677`.
`K.s35.bar.change` | S35 | {n} change · {what} | `plain` | `label`, 38 | `[gen]` `docs/mvp0/screens/gen.mjs:1687`.
`K.s35.bar.warn` | S35 | {n} accounts go over their cap | `caution` | `label`, 34 | `[gen]` `docs/mvp0/screens/gen.mjs:1687`. **Said before the save, with the count** (`docs/mvp0/PRODUCT-PLAN.md` section 30).
`K.s35.bar.seewho` | S35 | See who | `label` | `button`, 10 | `[gen]` `docs/mvp0/screens/gen.mjs:1687`.
`K.s35.bar.discard` | S35 | Discard | `label` | `button`, 10 | `[gen]` `docs/mvp0/screens/gen.mjs:1687`.
`K.s35.bar.save` | S35 | Review and save | `label` | `button`, 18 | `[gen]` `docs/mvp0/screens/gen.mjs:1687`. Never a bare Save.
`K.s35.phone.note` | S35 | Editing is on the desktop. The phone shows what is set. | `refusal` | `body` | `[gen]` `docs/mvp0/screens/gen.mjs:1689`.
`K.s36.title` | S36 | Models and providers | `label` | `title`, 24 | `[gen]` `docs/mvp0/screens/gen.mjs:1707`.
`K.s36.lede` | S36 | The free chain in fallback order, and which model serves which call on each plan. | `plain` | `lede` | `[gen]` `docs/mvp0/screens/gen.mjs:1707`.
`K.s36.chain` | S36 | The free chain, in order | `label` | `label`, 26 | `[gen]` `docs/mvp0/screens/gen.mjs:1708`.
`K.s36.note.notraining` | S36 | {model} · no training stated | `plain` | `label`, 34 | `[gen]` `docs/mvp0/screens/gen.mjs:1692`. **"stated" is doing the work.** It is their claim, read from their page, not our audit.
`K.s36.note.trial` | S36 | trial ends {date} | `plain` | `label`, 22 | `[gen]` `docs/mvp0/screens/gen.mjs:1694`.
`K.s36.note.unopened` | S36 | terms never opened | `refusal` | `label`, 22 | `[gen]` `docs/mvp0/screens/gen.mjs:1696`.
`K.s36.cannotenable` | S36 | cannot enable | `refusal` | `label`, 16 | `[gen]` `docs/mvp0/screens/gen.mjs:1696`. The control is disabled, and the row says why.
`K.s36.promise` | S36 | A provider whose terms nobody has opened cannot be switched on. The sign-in page promises we never train on documents, and that promise is only as true as this list. | `promise` | `long` | `[gen]` `docs/mvp0/screens/gen.mjs:1710`. **The sentence that connects a screen only two people see to a promise every person reads**.
`K.s36.routing` | S36 | Routing, per call and per plan | `label` | `label`, 32 | `[gen]` `docs/mvp0/screens/gen.mjs:1711`.
`K.s36.call.edit` | S36 | An edit | `label` | `label`, 10 | `[gen]` `docs/mvp0/screens/gen.mjs:1699`.
`K.s36.call.doc` | S36 | A document | `label` | `label`, 14 | `[gen]` `docs/mvp0/screens/gen.mjs:1700`.
`K.s36.call.kit` | S36 | A blueprint | `label` | `label`, 14 | `[gen]` `docs/mvp0/screens/gen.mjs:1701`.
`K.s36.col.cost` | S36 | One call costs | `label` | `label`, 18 | `[gen]` `docs/mvp0/screens/gen.mjs:1698`.
`K.s37.title` | S37 | Features and flags | `label` | `title`, 22 | `[gen]` `docs/mvp0/screens/gen.mjs:1727`.
`K.s37.lede` | S37 | Four switches, and two rows that look like switches and are not. | `plain` | `lede` | `[gen]` `docs/mvp0/screens/gen.mjs:1727`.
`K.s37.flags` | S37 | Flags | `label` | `label`, 8 | `[gen]` `docs/mvp0/screens/gen.mjs:1728`.
`K.s37.locked` | S37 | Locked, and why | `label` | `label`, 18 | `[gen]` `docs/mvp0/screens/gen.mjs:1730`.
`K.s37.flag.live` | S37 | Live editing | `label` | `label`, 16 | `[gen]` `docs/mvp0/screens/gen.mjs:1716`.
`K.s37.flag.byok` | S37 | Bring your own key | `label` | `label`, 22 | `[gen]` `docs/mvp0/screens/gen.mjs:1717`.
`K.s37.flag.magic` | S37 | Email magic link | `label` | `label`, 20 | `[gen]` `docs/mvp0/screens/gen.mjs:1718`.
`K.s37.flag.index` | S37 | Index published pages | `label` | `label`, 24 | `[gen]` `docs/mvp0/screens/gen.mjs:1719`.
`K.s37.lock.training` | S37 | We never train on your documents | `promise` | `label`, 36 | `[gen]` `docs/mvp0/screens/gen.mjs:1720`.
`K.s37.lock.training.sub` | S37 | A promise on the sign-in page, not a setting. It changes only when the provider list does. | `promise` | `long` | `[gen]` `docs/mvp0/screens/gen.mjs:1720`.
`K.s37.lock.age` | S37 | Age floor, eighteen | `legal` | `label`, 22 | `[gen]` `docs/mvp0/screens/gen.mjs:1721`.
`K.s37.lock.age.sub` | S37 | In the terms people already accepted. Changing it needs new consent, not a switch. | `legal` | `long` | `[gen]` `docs/mvp0/screens/gen.mjs:1721`.
`K.s38.title` | S38 | Accounts and usage | `label` | `title`, 22 | `[gen]` `docs/mvp0/screens/gen.mjs:1749`.
`K.s38.lede` | S38 | One account against every limit. An exception here moves one person, never the plan. | `plain` | `lede` | `[gen]` `docs/mvp0/screens/gen.mjs:1749`.
`K.s38.grant` | S38 | Grant an exception | `label` | `button`, 22 | `[gen]` `docs/mvp0/screens/gen.mjs:1750`.
`K.s38.joined` | S38 | joined {date} · {n} documents | `plain` | `label`, 32 | `[gen]` `docs/mvp0/screens/gen.mjs:1750`.
`K.s38.spent` | S38 | Spent on us | `label` | `label`, 14 | `[gen]` `docs/mvp0/screens/gen.mjs:1739`.
`K.s38.expiry` | S38 | An exception carries an expiry. When it lapses the account returns to its plan, and if it is over the cap it meets the over-cap screen: everything readable, nothing new created. | `plain` | `long` | `[gen]` `docs/mvp0/screens/gen.mjs:1752`, with the screen id replaced; see section 15 D4.
`K.s38.ledger` | S38 | This account's ledger | `label` | `label`, 24 | `[gen]` `docs/mvp0/screens/gen.mjs:1753`.

---

## 15. Defects and disagreements this deck found

**D1. A plural bug in four places.** `{collab}` is 1 (`docs/mvp0/screens/gen.mjs:16`), and four strings interpolate it
into "live collaborators": `K.s02.caps`, `K.s17.collab.limit`, `K.s19.toast`, `K.s29.free.collab`.
**Every one renders "1 live collaborators" today.** The fix is a plural rule on every counted noun in
the deck, not an edit to four strings. `HIGH`, because it is on the sign-up path and on the share
modal.

**D2. The screens and the code disagree about three AI verb labels.** The deck follows the screens.

Deck | Shipped code | Source
Refine selection | Refine selection / note | `src/modules/editor/presentation/AIMenu.tsx:248`
Summarise into a callout | Summarize note | `src/modules/editor/presentation/AIMenu.tsx:254`
Suggest links | Suggest wikilinks | `src/modules/editor/presentation/AIMenu.tsx:255`

The code's spelling of Summarize is American, against the house rule. `MEDIUM`.

**D3. The live-collaborator number is 1 in three sources and 3 in two.** One is correct: the
founders answered on 18 September (`docs/mvp0/SCREEN-CHANGES-2026-09-18.md:305`), and
`docs/mvp0/PRODUCT-PLAN.md` section 5 and section 5 and `docs/mvp0/screens/gen.mjs:16` follow it.
**`docs/mvp0/PRODUCT-PLAN.md` section 3 and `docs/mvp0/SCREENS.md:29` still say 3** and are stale. This
deck is written to 1. Recorded here rather than fixed, because both files belong to other owners.

**D4. Screen ids leak into user-facing copy on the configuration panel.** `docs/mvp0/screens/gen.mjs:1716` reads "Turns
S19 on", `:1718` "Changes S01", `:1719` "Changes robots and S17", `:1752` "it meets S33". **A founder
is a user.** `K.s38.expiry` above is written without the id; the other three need the same treatment
and are recorded here, not silently rewritten. `LOW`.

**D5. Three screens still need strings that nobody has written.** They are `[new]` rows above, and
each is a hole in a promise rather than a missing label: the provider list behind
`K.promise.notraining`, the change-queue row for a merge proposal from `K.s31.letai`, and the
one-attempt payment failure on S29.

---

## 16. What is not in this deck

- **Sample document content.** The booking brief, the salon, Amit, priya@studio.in and the trade
  system are illustrations inside the screen files. They are not product strings and they must never
  be translated or shipped.
- **File names.** `00-BRIEF.md`, `AGENTS.md`, `SKILL.md`, `DECISIONS.md` and the rest are names, not
  copy. They do not change in any language.
- **The kickoff prompt's body**, beyond the row above. It is a shell script that an agent reads.
- **Legal page text.** Privacy, Terms, refunds and the grievance notice are written by counsel, are
  due by 15 October 2026, and carry an owner per row at `docs/mvp0/PRODUCT-PLAN.md` section 23.
- **Error and refusal rows.** Their catalogue is `17-ERROR-AND-REFUSAL-CATALOGUE.md`. **Every row
  there points at an id in this deck**, and where a row has no id yet, that file says so.

---

## 17. Limits of this document

- **What was not assessed.** Nothing was read with a screen reader, and no string was tested with a
  person. No translation was attempted, and section 0.3's budgets are derived from the drawn layout
  rather than measured in a browser.
- **What could not be verified.** Every `[gen]` row is verbatim from the generator at commit
  `f237ece`. **The generator is not the running product**, so a string could differ in the shipped
  app; the shipped app has 24 of these 38 screens at most.
- **What is not established.** Every `[new]` row. The founders have not seen them.
- **What would falsify it.** A change to `gen.mjs`, which is the source of most of this deck, or the
  arrival of `10-FEATURE-REGISTER.md` and `17-ERROR-AND-REFUSAL-CATALOGUE.md` with ids that
  contradict the ones used here.
- **The count, re-derived at write time rather than estimated.** This deck carries **574 ids, each
  on exactly one row**, counted on 18 September 2026 with:

  ```bash
  grep -cE '^`K\.[a-z0-9.]+` \|' docs/pack/16-COPY-DECK.md               # 574 rows
  grep -oE '^`K\.[a-z0-9.]+` \|' docs/pack/16-COPY-DECK.md \
    | sed 's/ |$//' | sort -u | wc -l                                     # 574 distinct
  ```

  **The two numbers agreeing is the check**, because a repeated id would break the one-fact-one-home
  rule this deck exists to keep.
- **What that count does not cover.** `docs/mvp0/screens/gen.mjs` is 1,760 lines and holds further
  literal text inside sample documents, which section 16 excludes by rule. **So 574 is the size of
  the deck, not the size of the generator.**
