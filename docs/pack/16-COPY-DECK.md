---
id: 16-COPY-DECK
title: Copy deck
mode: reference
tier: canonical
status: living
updated: 2026-09-19
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

**Anything marked `[new]` has not been reviewed by the founders.** A `[new]` row marked
`proposed, voice-checked 18 Sep` has been checked against its screen spec, the drawn screen, the
house voice, its budget and the standing promises, so the founders review final wording rather
than a draft. The changes are logged in `review/16-copy.md`.

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
`K.promise.readable` | S33 | Everything you have still opens, and nothing is deleted. | `promise` | `lede`, 56 | `[gen]` `docs/mvp0/screens/gen.mjs:1898`, **reworded 18 September for D08** `[Z]`. It was "Everything you have still opens, edits and exports. Nothing is deleted." That stopped being true in every state once an unpaid trial locks editing and export (`53-PRICING-AND-ENTITLEMENTS.md` section 5.5), so the promise now says only what holds everywhere. On S33 over the cap, editing and export are still open and `K.s33.still.open` says so.
`K.promise.readable.full` | S29 | Your documents always stay readable, and nothing is deleted. Editing, copying and export stay open on every plan, and pause only if a trial ends unpaid. | `promise` | `body`, 152 | `[new]` proposed 18 Sep, **not founder-reviewed**. The long form of the reworded promise, for S29, the pricing page and the trial emails. It replaces the plan's "Every document stays readable and exportable" (`docs/mvp0/PRODUCT-PLAN.md` section 13). `UNVERIFIED:` whether the export pause is lawful; needs: legal opinion, D08.
`K.promise.nomerge` | many | Conflicts are never merged silently. Both versions are kept and you choose. | `promise` | `lede` | `[gen]` `docs/mvp0/screens/gen.mjs:1432`. Invariant 12 of the engine (`docs/mvp0/PRODUCT-PLAN.md` section 17), said in the person's words.
`K.promise.yourfiles` | S01 | Markdown that stays yours, in a Doc mode or a plain one. | `promise` | `lede` | `[gen]` `docs/mvp0/screens/gen.mjs:816`.
`K.promise.docsonly` | S23 | frontmatter only ever writes under docs/, and that rule is tested. | `promise` | `lede` | `[gen]` `docs/mvp0/screens/gen.mjs:1435`. Enforced server-side (`docs/mvp0/PRODUCT-PLAN.md` section 11).
`K.promise.drivescope` | S23 | Scope: only files this app created or you picked. We cannot see the rest of your Drive. | `promise` | `lede` | `[gen]` `docs/mvp0/screens/gen.mjs:1431`.
`K.promise.nogate` | S18 | No account needed to read. | `promise` | `label`, 26 | `[gen]` `docs/mvp0/screens/gen.mjs:1343`.
`K.promise.noindex` | many | Not indexed by search engines. | `promise` | `label`, 30 | `[gen]` `docs/mvp0/screens/gen.mjs:1308`. Whether this stays true is founder question 17 (`docs/mvp0/PRODUCT-PLAN.md` section 29).

**The one promise D08 changed** `[Z]`. The founder chose, on 18 September, to lock editing, copy
and export when a trial ends unpaid, and was told it breaks "every document stays readable and
exportable". So `K.promise.readable` keeps only the part that is still true in every state, and
`K.promise.readable.full` says where the exception is. **Neither string may promise export
unconditionally again** until D08 is reversed or a legal opinion forces it.

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

**Ids cited by `12-screens/S01.md`, reconciled 18 September.**

id | screen | string | tone | budget | notes
`K.s01.heading` | S01 | (uses `K.s01.title`) | `plain` | `title` | Alias. The screen spec's name for the heading; the string lives in `K.s01.title`.
`K.s01.promise` | S01 | (uses `K.s01.lede`) | `plain` | `lede` | Alias. The screen spec calls the line under the heading the promise; the string lives in `K.s01.lede`.
`K.s01.fineprint` | S01 | (uses `K.s01.fine`) | `promise` | `lede` | Alias of `K.s01.fine`, which is itself `K.promise.nopassword` then `K.promise.notraining`.
`K.s01.providerlist` | S01 | here are the providers | `label` | `label`, 22 | `[gen]` `docs/mvp0/screens/gen.mjs:811`. The link text inside `K.promise.notraining`. Its destination page is not written; see the note just above this block.
`K.s01.value.write` | S01 | (uses `K.s01.write` then `K.s01.writeline`) | `plain` | `lede` | Alias. One value cell: the label, then its line.
`K.s01.value.decide` | S01 | (uses `K.s01.decide` then `K.s01.decideline`) | `plain` | `lede` | Alias. One value cell: the label, then its line.
`K.s01.value.ship` | S01 | (uses `K.s01.ship` then `K.s01.shipline`) | `plain` | `lede` | Alias. One value cell: the label, then its line.
`K.s01.busy` | S01 | Signing in | `plain` | `button`, 10 | `[new]` proposed, voice-checked 18 Sep. The accessible name of the spinner on the tapped button while the provider popup is open. Both buttons are disabled in this state.
`K.s01.cancelled` | S01 | (no string: a cancelled sign-in returns to the card and says nothing) | `plain` | `body` | `[new]`. The S01 spec is explicit that a cancelled sign-in is not an error and nothing is said beyond the card's own copy. The id exists so a builder does not add a message.

---

## 4. S02 Home, first time, and S03 Home

id | screen | string | tone | budget | notes
`K.s02.greeting` | S02, S03 | Good evening, {name} | `plain` | `title`, 36 | `[gen]` `docs/mvp0/screens/gen.mjs:837`. `{part}` of day. `[O]` Nobody has specified the boundaries between morning, afternoon and evening, or the timezone they are read in: `grep -n -i 'good evening\|good morning\|afternoon\|greeting'` over the plan, `SCREENS.md`, the 18 September changes, S02, S03 and gen.mjs finds only the drawn "Good evening" and S02's "time of day", and `src/` has no greeting. Still to be set by S02.
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

**Ids cited by `12-screens/S02.md`, reconciled 18 September.**

id | screen | string | tone | budget | notes
`K.s02.tab.documents` | S02 | (uses the first label of `K.common.tabs`) | `label` | `label` | Alias. Documents, `[gen]` `docs/mvp0/screens/gen.mjs:838`.
`K.s02.tab.ideas` | S02 | (uses the second label of `K.common.tabs`) | `label` | `label` | Alias. Ideas, `[gen]` `docs/mvp0/screens/gen.mjs:838`.
`K.s02.tab.shared` | S02 | (uses the third label of `K.common.tabs`) | `label` | `label` | Alias. Shared with me; the phone shortens it to Shared (`docs/mvp0/screens/gen.mjs:842`).
`K.s02.recent.head` | S02 | (uses `K.s03.col.recent`, `K.s03.col.project`, `K.s03.col.opened`, `K.s03.col.owner`) | `label` | `label` | Alias. The table head is drawn on S02 as well, `[gen]` `docs/mvp0/screens/gen.mjs:840`. Dropped on the phone.
`K.s02.search` | S02 | (uses `K.common.searchlong` with `K.common.searchkbd`) | `label` | `label` | Alias. The wide search field of the home header.
`K.s02.desktop.note` | S02 | Documents on this computer have no limit. | `plain` | `lede`, 41 | `[new]` proposed, voice-checked 18 Sep. The line the desktop build adds under `K.s02.empty`; the S02 spec asks for it and gen.mjs does not draw it. The web form of the same fact is the last sentence of `K.s02.caps`.

**Ids cited by `12-screens/S03.md`, reconciled 18 September.**

id | screen | string | tone | budget | notes
`K.s03.greeting` | S03 | (uses `K.s02.greeting`) | `plain` | `title` | Alias. The same greeting on the returning home.
`K.s03.usage` | S03 | (uses `K.s03.usedpill`) | `plain` | `label` | Alias. The usage pill on the right of the greeting row.
`K.s03.tab.documents` | S03 | (uses the first label of `K.common.tabs`) | `label` | `label` | Alias.
`K.s03.tab.ideas` | S03 | (uses `K.s03.ideascount`) | `label` | `label` | Alias. The count form of the Ideas tab.
`K.s03.tab.shared` | S03 | (uses `K.s03.sharedcount`) | `label` | `label` | Alias. The phone shortens it to Shared · {n} (`docs/mvp0/screens/gen.mjs:857`).
`K.s03.recent.head.name` | S03 | (uses `K.s03.col.recent`) | `label` | `label` | Alias. The name column is headed Recent.
`K.s03.recent.head.project` | S03 | (uses `K.s03.col.project`) | `label` | `label` | Alias.
`K.s03.recent.head.opened` | S03 | (uses `K.s03.col.opened`) | `label` | `label` | Alias.
`K.s03.recent.head.owner` | S03 | (uses `K.s03.col.owner`) | `label` | `label` | Alias.
`K.s03.row.rename` | S03 | Rename | `label` | `button`, 6 | `[new]` proposed, voice-checked 18 Sep. Row menu. gen.mjs draws the menu button only (`docs/mvp0/screens/gen.mjs:856`).
`K.s03.row.duplicate` | S03 | Duplicate | `label` | `button`, 9 | `[new]` proposed, voice-checked 18 Sep. Row menu.
`K.s03.row.export` | S03 | Export | `label` | `button`, 6 | `[new]` proposed, voice-checked 18 Sep. Row menu, a single-file export.
`K.s03.row.trash` | S03 | Move to trash | `label` | `button`, 13 | `[new]` proposed, voice-checked 18 Sep. Row menu. **Never Delete**: trash holds a document for 30 days (S03 spec, Actions).
`K.s03.empty.documents` | S03 | No documents yet. Start one above. | `plain` | `lede`, 34 | `[new]` proposed, voice-checked 18 Sep. A tab's own empty line, inside the table frame. Follows `K.s02.empty.phone`.
`K.s03.empty.shared` | S03 | Nothing has been shared with you yet. | `plain` | `lede`, 37 | `[new]` proposed, voice-checked 18 Sep. The Shared with me tab when it has no rows.
`K.s03.offline` | S03 | Offline. Showing the list saved on this device. | `caution` | `lede`, 47 | `[new]` proposed, voice-checked 18 Sep. The list comes from the device cache and is marked as such (S03 spec, States).
`K.s03.noproject` | S03 | - | `plain` | `button`, 1 | `[new]` proposed, voice-checked 18 Sep. A loose file shows its project as a hyphen, never as blank (S03 spec, Columns).

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

**Ids cited by `12-screens/S04.md`, reconciled 18 September.**

id | screen | string | tone | budget | notes
`K.s04.tree.head` | S04 | (uses `K.common.tree`) | `label` | `label` | Alias. The tree head, `[gen]` `docs/mvp0/screens/gen.mjs:662`.
`K.s04.tree.addproject` | S04 | (uses `K.s04.newproject`) | `label` | `button` | Alias. The add-project pill in the tree head.
`K.s04.addfile.uploadfiles` | S04 | (uses `K.s04.addfile.upload`) | `label` | `button` | Alias. Second row of the Add file menu.
`K.s04.addfile.uploadfolder` | S04 | (uses `K.s04.addfile.folder`) | `label` | `button` | Alias. Third row of the Add file menu.
`K.s04.addfile.importfrom` | S04 | (uses `K.s04.addfile.import`) | `label` | `button` | Alias. Fourth row of the Add file menu.
`K.s04.ideas` | S04 | (uses `K.s04.ideassection`) | `label` | `label` | Alias. The collapsed Ideas section at the foot of the tree.
`K.s04.sync` | S04 | (uses `K.common.synced`) | `plain` | `label` | Alias. The sync foot of the tree, `[gen]` `docs/mvp0/screens/gen.mjs:865`.
`K.s04.saved` | S04 | (uses `K.common.saved`) | `plain` | `label` | Alias. The saved pill in the mode bar, `[gen]` `docs/mvp0/screens/gen.mjs:866`.
`K.s04.rail.tags` | S04 | (uses `K.common.tags`) | `label` | `label` | Alias. Right rail, first collapsible row.
`K.s04.rail.backlinks` | S04 | (uses `K.common.backlinks`) | `label` | `label` | Alias. Right rail.
`K.s04.rail.history` | S04 | (uses `K.common.history`) | `label` | `label` | Alias. Right rail.
`K.s04.rail.comments` | S04 | (uses `K.common.comments`) | `label` | `label` | Alias. Right rail.
`K.s04.rail.outline` | S04 | (uses `K.common.outline`) | `label` | `label` | Alias. Right rail, the section that grows.
`K.s04.aiedit` | S04 | (uses `K.common.aiedit`) | `label` | `button` | Alias. Rail foot.
`K.s04.credits` | S04 | (uses `K.common.editsleft`) | `cost` | `label` | Alias. The credit meter in the rail foot. Both numbers come from the ledger.
`K.s04.newtab` | S04 | New tab | `label` | `button`, 7 | `[new]` proposed, voice-checked 18 Sep. The accessible name of the add control that ends the tab strip; gen.mjs draws the icon only (`docs/mvp0/screens/gen.mjs:631`).
`K.s04.closedirty` | S04 | {file} has changes that are not saved yet. Save them before you close it? | `caution` | `body`, 69 | `[new]` proposed, voice-checked 18 Sep. Asked when a dirty tab is closed (S04 spec, Actions). The two answers need their own ids: Save and close, and Close without saving. Neither is written yet.
`K.s04.offline` | S04 | (uses `K.s24.banner`, `K.s24.lastsync` and `K.s24.pending`) | `caution` | `body` | Alias. The S04 offline state is a banner, the last sync time and the queue depth, which is exactly what S24 draws.
`K.s04.share` | S04 | Share | `label` | `button`, 5 | `[gen]` `docs/mvp0/screens/gen.mjs:640`, the title attribute on the share icon. Also its accessible name. Not a visible label.

**Ids cited by `12-screens/S27.md`, reconciled 18 September.**

id | screen | string | tone | budget | notes
`K.s27.togglelight` | S27 | Switch to light theme | `label` | `button`, 21 | `[new]` proposed, voice-checked 18 Sep. Label and tooltip of the header theme button when pressing it would give the light theme. gen.mjs draws the icon with no title (`docs/mvp0/screens/gen.mjs:645`).
`K.s27.toggledark` | S27 | Switch to dark theme | `label` | `button`, 20 | `[new]` proposed, voice-checked 18 Sep. The same button when pressing it would give the dark theme.
`K.s27.appearance.heading` | S27 | (uses `K.s28.nav.appearance`) | `label` | `label` | Alias. The Appearance section heading on S28 is the same word as its nav row.
`K.s27.appearance.system` | S27 | Match this device | `label` | `button`, 17 | `[new]` proposed, voice-checked 18 Sep. First of three choices, the one that follows the operating system.
`K.s27.appearance.light` | S27 | Light | `label` | `button`, 5 | `[new]` proposed, voice-checked 18 Sep.
`K.s27.appearance.dark` | S27 | Dark | `label` | `button`, 4 | `[new]` proposed, voice-checked 18 Sep.
`K.s27.appearance.help` | S27 | Your choice is saved to your account, so every device you sign in on uses it. | `help` | `help`, 77 | `[new]` proposed, voice-checked 18 Sep. Echoes `K.s28.lede`, which says settings live on the account.

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

**Ids cited by `12-screens/S05.md`, reconciled 18 September.**

id | screen | string | tone | budget | notes
`K.s05.face.googlesans` | S05 | (uses `K.s05.font`) | `label` | `button` | Alias. Google Sans, the first of the four faces, `[gen]` `docs/mvp0/screens/gen.mjs:702`.
`K.s05.face.serif` | S05 | Serif | `label` | `button`, 5 | `[new]` proposed, voice-checked 18 Sep. The second face named in `K.s05.font.tip`. Which serif is not specified, so the menu names the class rather than a family.
`K.s05.face.mono` | S05 | Mono | `label` | `button`, 4 | `[new]` proposed, voice-checked 18 Sep. The third face named in `K.s05.font.tip`.
`K.s05.face.system` | S05 | System | `label` | `button`, 6 | `[new]` proposed, voice-checked 18 Sep. The fourth face named in `K.s05.font.tip`: the device's own face.
`K.s05.size` | S05 | Font size | `label` | `button`, 9 | `[new]` proposed, voice-checked 18 Sep. Accessible name of the size stepper. gen.mjs draws a minus, the number and a plus with no label (`docs/mvp0/screens/gen.mjs:703`); the number is `{size}`, not a string.
`K.s05.comment.reply` | S05 | (uses `K.common.reply`) | `label` | `button` | Alias. The Reply on a margin comment, `[gen]` `docs/mvp0/screens/gen.mjs:888`.
`K.s05.properties.head` | S05 | Properties | `label` | `label`, 10 | `[new]` proposed, voice-checked 18 Sep. Heading of the front matter panel, which is specified, not built (S05 spec, open decision D14).
`K.s05.properties.invalid` | S05 | This is not valid YAML, so it was not saved. The front matter you had before is unchanged. Fix the line shown and try again. | `refusal` | `body`, 124 | `[new]` proposed, voice-checked 18 Sep. **A refusal.** What will not happen, why, what to do, in that order (rule 6). The S05 spec: refuse invalid YAML and leave the old block.
`K.s05.readonly` | S05 | You can comment on this document but not edit it. | `plain` | `lede`, 49 | `[new]` proposed, voice-checked 18 Sep. Shown when the role is Commenter or Viewer; the page is read-only and the margin stays live. A Viewer who cannot comment needs a second string, and none is written.
`K.s05.nocarrier` | S05 | Doc mode cannot show {feature}, so it appears as plain text here. The file is unchanged. Switch to MD to see it as written. | `refusal` | `body`, 116 | `[new]` proposed, voice-checked 18 Sep. **A refusal**, shown once in the toast when a feature in the file has no carrier in Doc mode (S05 spec, degraded state). `{feature}` names it in plain words.

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

**Ids cited by `12-screens/S06.md`, reconciled 18 September.**

id | screen | string | tone | budget | notes
`K.s06.target.writing` | S06 | (uses `K.s06.target.new`) | `plain` | `label` | Alias. The Writing form of the target line.
`K.s06.target.editing` | S06 | (uses `K.s06.target.edit`) | `plain` | `label` | Alias. The Editing form of the target line.
`K.s06.target.range` | S06 | Selected: {count} {unit} | `plain` | `label`, 15 | `[new]` proposed, voice-checked 18 Sep. Appended to `K.s06.target.edit` when there is a selection, so a person sees what they selected before they spend a credit (S06 spec). `{unit}` is paragraphs, lines or words, pluralised by rule.
`K.s06.change` | S06 | (uses `K.s06.target.swap`) | `label` | `button` | Alias. Change, on the target line.
`K.s06.send` | S06 | Send | `label` | `button`, 4 | `[new]` proposed, voice-checked 18 Sep. Accessible name of the arrow control at the end of the prompt field; gen.mjs draws the icon only (`docs/mvp0/screens/gen.mjs:902`). Command Enter does the same.
`K.s06.chip.onedoc` | S06 | (uses `K.s06.chip.one`) | `label` | `button` | Alias.
`K.s06.chip.toideas` | S06 | (uses `K.s06.chip.ideas`) | `label` | `label` | Alias.
`K.s06.chip.cleanpaste` | S06 | (uses `K.s06.chip.paste`) | `label` | `button` | Alias.
`K.s06.chip.plannotes` | S06 | (uses `K.s06.chip.plan`) | `label` | `button` | Alias.
`K.s06.startfrom.label` | S06 | (uses `K.s06.orstart`) | `label` | `label` | Alias.
`K.s06.startfrom.github` | S06 | (uses `K.s06.chip.gh`) | `label` | `button` | Alias.
`K.s06.startfrom.drop` | S06 | (uses `K.s06.chip.drop`) | `label` | `button` | Alias.
`K.s06.startfrom.template` | S06 | (uses `K.s06.chip.template`) | `label` | `button` | Alias.
`K.s06.getmore` | S06 | (uses `K.common.getmore`) | `label` | `button` | Alias. The link at the end of `K.s06.cost`.
`K.s06.accept` | S06 | (uses `K.common.accept`) | `label` | `button` | Alias. Equal weight with Reject.
`K.s06.reject` | S06 | (uses `K.common.reject`) | `label` | `button` | Alias.
`K.s06.untouched` | S06 | (uses `K.promise.untouched`) | `promise` | `label` | Alias. Every failure state of the box, and S07 and S32, say this sentence and no other version of it (S06 spec, States).
`K.s06.firstrun` | S06 | Each answer uses 1 edit credit, even if you reject it. Nothing is deducted for a failed call. | `cost` | `body`, 93 | `[new]` proposed, voice-checked 18 Sep. The one line shown the first time the box opens on an account, saying what a credit is. A credit is spent when the call returns, not on Accept (S06 spec, Data contract), so the line says a rejected answer still costs one. The second sentence is `K.promise.nocharge` verbatim. The 1 is the per-document price from `K.s06.cost`; if the price becomes configurable it becomes `{cost}`.
`K.s06.provider` | S06 | Running on {provider} | `plain` | `label`, 13 | `[new]` proposed, voice-checked 18 Sep. The foot names the provider when the chain is on a fallback (S06 spec, degraded state): slower, not worse. Never a model's confidence (rule 5).

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

**Ids cited by `12-screens/S07.md`, reconciled 18 September.**

id | screen | string | tone | budget | notes
`K.s07.verb.refine` | S07 | (uses `K.s07.refine`) | `label` | `button` | Alias. The screen spec added `verb.` to the deck's ids.
`K.s07.verb.refine.sub` | S07 | (uses `K.s07.refine.sub`) | `help` | `help` | Alias.
`K.s07.verb.expand` | S07 | (uses `K.s07.expand`) | `label` | `button` | Alias.
`K.s07.verb.expand.sub` | S07 | (uses `K.s07.expand.sub`) | `help` | `help` | Alias.
`K.s07.verb.shorten` | S07 | (uses `K.s07.shorten`) | `label` | `button` | Alias.
`K.s07.verb.shorten.sub` | S07 | (uses `K.s07.shorten.sub`) | `help` | `help` | Alias.
`K.s07.verb.tone` | S07 | (uses `K.s07.tone`) | `label` | `button` | Alias.
`K.s07.verb.tone.sub` | S07 | (uses `K.s07.tone.sub`) | `help` | `help` | Alias.
`K.s07.verb.translate` | S07 | (uses `K.s07.translate`) | `label` | `button` | Alias.
`K.s07.verb.translate.sub` | S07 | (uses `K.s07.translate.sub`) | `help` | `help` | Alias.
`K.s07.verb.callout` | S07 | (uses `K.s07.summarise`) | `label` | `label` | Alias. The screen calls this verb callout; the deck's id is summarise.
`K.s07.verb.callout.sub` | S07 | (uses `K.s07.summarise.sub`) | `help` | `help` | Alias.
`K.s07.verb.links` | S07 | (uses `K.s07.links`) | `label` | `button` | Alias.
`K.s07.verb.links.sub` | S07 | (uses `K.s07.links.sub`) | `help` | `help` | Alias.
`K.s07.foot` | S07 | (uses `K.s07.cost`) | `cost` | `help` | Alias. The menu foot: one credit each, how many are left, which provider this month.
`K.s07.accept` | S07 | (uses `K.common.accept`) | `label` | `button` | Alias.
`K.s07.reject` | S07 | (uses `K.common.reject`) | `label` | `button` | Alias.
`K.s07.suggesting` | S07 | (uses `K.s05.suggesting`) | `label` | `label` | Alias. The toolbar pill while a proposal is live, `[gen]` `docs/mvp0/screens/gen.mjs:926`.
`K.s07.unchanged` | S07 | The model found nothing to change, so your text is as it was. | `plain` | `lede`, 61 | `[new]` proposed, voice-checked 18 Sep. Returning the input unchanged is a correct outcome and is not apologised for (S07 spec, Actions). Whether a credit is spent on it is not settled in the spec, so the string says nothing about cost.
`K.s07.refused` | S07 | This text changed while the suggestion was being made, so nothing was written. Select it and ask again. | `refusal` | `body`, 103 | `[new]` proposed, voice-checked 18 Sep. **A refusal**, shown in place of Accept and Reject, never as a toast. The engine refuses rather than guess a moved range (S07 spec, States). What, why, what to do.

---

## 9. S08 Custom blocks

id | string | tone | budget | notes
`K.s08.elsewhere` | Elsewhere | `label` | `label`, 12 | `[gen]` `docs/mvp0/screens/gen.mjs:982`.
`K.s08.elsewhere.body` | (GitHub, Obsidian, VS Code): the table is still a table, and the chart block is a two-line code block under it. Mermaid renders on GitHub, GitLab and in Obsidian. The callout renders on GitHub as a note. Math renders on GitHub. | `plain` | `body` | `[gen]` `docs/mvp0/screens/gen.mjs:982`. **The degradation statement**, which `docs/mvp0/PRODUCT-PLAN.md` section 20 requires of every format we invent.
`K.s08.tablefolded` | Table folded. Click to show the three rows. | `plain` | `label`, 44 | `[gen]` `docs/mvp0/screens/gen.mjs:972`. `{n}` rows.

**Ids cited by `12-screens/S08.md`, reconciled 18 September.**

id | screen | string | tone | budget | notes
`K.s08.table.folded` | S08 | (uses `K.s08.tablefolded`) | `plain` | `label` | Alias. The screen spec added a dot to the deck's id.
`K.s08.chart.notable` | S08 | This chart has no table above it to read from, so it is shown as its source. Put the table directly above the chart block. | `refusal` | `body`, 122 | `[new]` proposed, voice-checked 18 Sep. **A block that cannot render shows its source, never an empty space** (S08 spec, Actions). Shown beside the fenced text.
`K.s08.chart.nonumbers` | S08 | The table above has no column of numbers, so there is nothing to chart. The block is shown as its source. Add a column of plain numbers to draw it. | `refusal` | `body`, 147 | `[new]` proposed, voice-checked 18 Sep. Same rule: the source in place, the reason beside it. "Plain numbers" because a cell such as 1,200 or 12% is not read as a number (`66-FORMAT-SPECIFICATIONS.md` section 4.4).
`K.s08.chart.kind` | S08 | This block names no chart kind this version can draw, so it is shown as its source. Check the kind line in the block. | `refusal` | `body`, 117 | `[new]` proposed, voice-checked 18 Sep. Covers both cases `66-FORMAT-SPECIFICATIONS.md` section 4.4 routes here: `kind` missing, and a kind this version does not draw. The old `{kind}` variable was dropped because it is empty in the first case. `[O]` The plan lists no chart kinds: `grep -n -i chart docs/mvp0/PRODUCT-PLAN.md` names only the `fm-chart` block and the table-to-chart pattern, and 66 section 4.4 holds the list `open:` as S08's D22, with `pie` the only drawn kind. The string is written so it needs no list; if D22 settles on a list, a help link can name it.
`K.s08.mermaid.failed` | S08 | This diagram could not be drawn: {reason}. Its text is shown instead, and nothing in the file changed. Fix the text and it draws again. | `refusal` | `body`, 129 | `[new]` proposed, voice-checked 18 Sep. `{reason}` is the parser's line and column in plain words, never a raw stack.
`K.s08.maths.failed` | S08 | This maths could not be drawn: {reason}. Its text is shown instead, and nothing in the file changed. Fix the text and it draws again. | `refusal` | `body`, 127 | `[new]` proposed, voice-checked 18 Sep. Same shape as `K.s08.mermaid.failed`.
`K.s08.callout.unknown` | S08 | {kind} is not a callout kind we know, so it is shown as a plain quote. | `plain` | `lede`, 66 | `[new]` proposed, voice-checked 18 Sep. An unknown callout kind falls back to a plain blockquote (S08 spec, Actions).
`K.s08.fence.unclosed` | S08 | This block has no closing fence, so it runs to the end of the document. Add the closing line to end it. | `caution` | `body`, 103 | `[new]` proposed, voice-checked 18 Sep. An unclosed fence swallows the document, which is why the render carrier for prose is a callout (CLAUDE.md, settled).
`K.s08.drawing.missing` | S08 | The drawing file for this block could not be found, so nothing is drawn here. The block in your document is unchanged. | `caution` | `body`, 118 | `[new]` proposed, voice-checked 18 Sep. Also shown offline when the drawing is not cached on this device.
`K.s08.table.shape` | S08 | Row {row} has {cells} cells and the header has {cols}. Nothing was written. Match the header, then try again. | `refusal` | `body`, 97 | `[new]` proposed, voice-checked 18 Sep. **A refusal**: the edit is not spliced while the row width does not match the header (S08 spec, Actions).
`K.s08.gutter` | S08 | Drag to resize the two panes | `help` | `label`, 28 | `[new]` proposed, voice-checked 18 Sep. Accessible name and tooltip of the gutter between the source and the render. The position is remembered.

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

**Ids cited by `12-screens/S09.md`, reconciled 18 September.**

id | screen | string | tone | budget | notes
`K.s09.convention` | S09 | (uses `K.s09.legend`) | `help` | `body` | Alias. The screen spec names the convention sentence separately; in the drawn screen it is the tail of the legend: a phase is an H2, a step is an H3, the tag is the first word in brackets.
`K.s09.counts` | S09 | (uses `K.s09.count`) | `plain` | `label` | Alias.
`K.s09.nophases` | S09 | This document has no H2 headings, so there are no phases to draw. Add one, or read it in Page view. | `refusal` | `body`, 99 | `[new]` proposed, voice-checked 18 Sep. The empty state offers Page view (S09 spec, States). Deferred screen; kept so the wording survives.
`K.s09.orphanstep` | S09 | This step has no phase above it, so it is shown in a column of its own. Give it an H2 above to place it. | `caution` | `body`, 104 | `[new]` proposed, voice-checked 18 Sep. The step sits in a leading column with the reason beside it.
`K.s09.toolarge` | S09 | Showing the first {shown} phases. The rest draw as you scroll, or switch to Outline. | `plain` | `lede`, 79 | `[new]` proposed, voice-checked 18 Sep. `{shown}` is a render limit and is read from configuration, never typed here.
`K.s09.badref` | S09 | This reference points to nothing in this project. | `caution` | `lede`, 49 | `[new]` proposed, voice-checked 18 Sep. Beside a reference that resolves to nothing. Same finding as `K.s10.link.sub`, worded for a card.
`K.s09.notatthiswidth` | S09 | This view needs a wider screen. Try Outline or Page on a phone. | `refusal` | `lede`, 63 | `[new]` proposed, voice-checked 18 Sep. **A refusal**: some views are unavailable at phone width (S09 spec, Actions).

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

**Ids cited by `12-screens/S10.md`, reconciled 18 September.**

id | screen | string | tone | budget | notes
`K.s10.costnote` | S10 | (uses `K.s10.never`) | `promise` | `body` | Alias. The sales line: checks on the device cost nothing, the writing note is advisory and never blocks.
`K.s10.fixallsafe` | S10 | (uses `K.s10.fixall`) | `label` | `button` | Alias.
`K.s10.fixallsafe.count` | S10 | Fix {n} problems that each have one exact fix? You can undo this in one step. | `cost` | `lede`, 76 | `[new]` proposed, voice-checked 18 Sep. The count is stated before the batch splice (S10 spec, Actions), per rule 7. Needs a plural rule for one problem.
`K.s10.fixallsafe.none` | S10 | None of these has a fix that is certain, so nothing was changed. Fix them one at a time. | `refusal` | `lede`, 88 | `[new]` proposed, voice-checked 18 Sep. **A refusal**: safe means byte-determined, and anything needing a judgement is not in this action.
`K.s10.clean` | S10 | No problems found in this document. | `plain` | `lede`, 35 | `[new]` proposed, voice-checked 18 Sep. The empty state, with the filter still visible.
`K.s10.check.brokenlink` | S10 | (uses `K.s10.link` then `K.s10.link.sub`) | `caution` | `label` | Alias.
`K.s10.check.headingskip` | S10 | (uses `K.s10.heading` then `K.s10.heading.sub`) | `caution` | `label` | Alias.
`K.s10.check.noalt` | S10 | (uses `K.s10.alt` then `K.s10.alt.sub`) | `caution` | `label` | Alias.
`K.s10.check.tableshape` | S10 | (uses `K.s10.table` then `K.s10.table.sub`) | `caution` | `label` | Alias.
`K.s10.check.spelling` | S10 | Possible misspelling: {word} | `caution` | `label`, 24 | `[new]` proposed, voice-checked 18 Sep. A spelling row. Its action is `K.s10.adddictionary`.
`K.s10.check.frontmatter` | S10 | Front matter key {key} does not match this project's schema | `caution` | `help`, 56 | `[new]` proposed, voice-checked 18 Sep. When the schema file is missing the check is skipped and says so, rather than flooding the list.
`K.s10.writing.longsentence` | S10 | (uses `K.s10.sentence` then `K.s10.sentence.sub`) | `plain` | `label` | Alias. The one advisory row.
`K.s10.adddictionary` | S10 | Add to dictionary | `label` | `button`, 17 | `[new]` proposed, voice-checked 18 Sep. Appends the word to the project dictionary.
`K.s10.offline.writing` | S10 | Writing notes need a connection. Checks still work on this device. | `plain` | `lede`, 66 | `[new]` proposed, voice-checked 18 Sep. Offline, everything in Checks works and Writing says it is unavailable (S10 spec, States).
`K.s10.check.failed` | S10 | The {check} check could not run, so its findings are missing. The other checks ran as usual. | `caution` | `lede`, 87 | `[new]` proposed, voice-checked 18 Sep. **A failed check never removes the other checks' findings.**

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

**Ids cited by `12-screens/S11.md`, reconciled 18 September.**

id | screen | string | tone | budget | notes
`K.s11.head` | S11 | (uses `K.s11.title` then `K.s11.count`) | `label` | `label` | Alias. The panel head: the title, then the in-step count.
`K.s11.rel.source` | S11 | (uses `K.s11.state.source`) | `plain` | `label` | Alias. The screen spec calls the relation `rel`; the deck calls it `state`.
`K.s11.rel.import` | S11 | (uses `K.s11.state.import`) | `plain` | `label` | Alias.
`K.s11.rel.copy` | S11 | (uses `K.s11.state.instep`) | `plain` | `label` | Alias. A copy that is in step with the source.
`K.s11.rel.copydrifted` | S11 | (uses `K.s11.state.drifted`) | `caution` | `label` | Alias.
`K.s11.rel.missing` | S11 | (uses `K.s11.state.missing`) | `plain` | `label` | Alias.
`K.s11.drift.head` | S11 | (uses `K.s11.drift.title`) | `caution` | `label` | Alias.
`K.s11.regenerate` | S11 | (uses `K.s11.regen`) | `label` | `button` | Alias.
`K.s11.regenerate.confirm` | S11 | Replace {file} with a fresh copy of {source}? {file} has no edits of its own, so nothing is lost. | `caution` | `body`, 83 | `[new]` proposed, voice-checked 18 Sep. Asked before a copy is regenerated, and only when the copy has no hand edits: with hand edits the action refuses instead (`E118`), and that refusal has no string yet: it needs its own id.
`K.s11.check.size` | S11 | (uses `K.s11.size` then `K.s11.size.sub`) | `plain` | `label` | Alias.
`K.s11.check.setup` | S11 | (uses `K.s11.setup` then `K.s11.setup.sub`) | `plain` | `label` | Alias.
`K.s11.check.unverified` | S11 | (uses `K.s11.stale` then `K.s11.stale.sub`) | `caution` | `label` | Alias.
`K.s11.check.lintduplicate` | S11 | (uses `K.s11.linted` then `K.s11.linted.sub`) | `caution` | `label` | Alias.
`K.s11.honesty` | S11 | (uses `K.s11.honest`) | `promise` | `body` | Alias. **Cannot be cut for space** (S11 spec, Copy).
`K.s11.tidy.cost` | S11 | Uses 1 edit credit. The result arrives in your change queue for you to accept or reject. | `cost` | `lede`, 88 | `[new]` proposed, voice-checked 18 Sep. Stated before the click (rule 7). Nothing is written until accepted, per the change queue.
`K.s11.capunknown` | S11 | Size limit unknown for {tool} | `caution` | `label`, 25 | `[new]` proposed, voice-checked 18 Sep. **Never marked ok when the cap is unknown** (S11 spec, Actions). When the caps table is old the row also needs a line giving the table's date, which is not written. Length counted with each variable as two characters.
`K.s11.orphan` | S11 | Copy of a missing source | `caution` | `label`, 24 | `[new]` proposed, voice-checked 18 Sep. The source is missing and copies exist, so they are listed as orphans rather than as ok. Offer: promote one to the source, or create it.

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

**Ids cited by `12-screens/S12.md`, reconciled 18 September.**

id | screen | string | tone | budget | notes
`K.s12.head.sub` | S12 | (uses `K.s12.sub`) | `plain` | `lede` | Alias. The phone form is `K.s12.sub.phone`.
`K.s12.placeholder` | S12 | A booking page for small salons that take appointments on WhatsApp today. One link for the Instagram bio, a calendar of open slots, a deposit, and a reminder the day before. | `plain` | `body`, 173 | `[gen]` `docs/mvp0/screens/gen.mjs:1127`, the drawn example idea. Like `K.s06.placeholder` it is an example and should vary by template rather than ship as the one text every person sees.
`K.s12.depth.suffix` | S12 | depth | `label` | `button`, 5 | `[gen]` `docs/mvp0/screens/gen.mjs:1120`. The muted word after the depth name in the pill. `K.s12.depth.pill` is the whole.
`K.s12.attach.drawing` | S12 | (uses `K.s12.attach.image`) | `help` | `help` | Alias.
`K.s12.attach.document` | S12 | (uses `K.s12.attach.doc`) | `help` | `help` | Alias.
`K.s12.attach.used` | S12 | (uses `K.s12.attached`) | `plain` | `body` | Alias. The attachment chip says what the attachment will be used for, in the kit's own words.
`K.s12.templates.label` | S12 | (uses `K.s12.startfrom`) | `label` | `label` | Alias.
`K.s12.template.localservice` | S12 | Local service business | `label` | `button`, 22 | `[gen]` `docs/mvp0/screens/gen.mjs:1152`. The phone shortens it to Local service (`docs/mvp0/screens/gen.mjs:1158`).
`K.s12.template.saas` | S12 | SaaS | `label` | `button`, 4 | `[gen]` `docs/mvp0/screens/gen.mjs:1152`.
`K.s12.template.marketplace` | S12 | Marketplace | `label` | `button`, 11 | `[gen]` `docs/mvp0/screens/gen.mjs:1152`.
`K.s12.template.internal` | S12 | Internal tool | `label` | `button`, 13 | `[gen]` `docs/mvp0/screens/gen.mjs:1152`. The plan lists seven templates and the screen draws four; the other three have no strings (S12 spec, D34a).
`K.s12.template.generate` | S12 | (uses `K.s12.template.own`) | `label` | `button` | Alias. One for my industry.
`K.s12.credits` | S12 | (uses `K.s12.rail.credit`) | `cost` | `label` | Alias. The rail foot.
`K.s12.state.draft` | S12 | Draft | `plain` | `label`, 5 | `[gen]` `docs/mvp0/screens/gen.mjs:1110`. An idea typed and never sent.
`K.s12.state.answered` | S12 | {answered} of {questions} answered | `plain` | `label`, 17 | `[gen]` `docs/mvp0/screens/gen.mjs:1109`, drawn as 9 of 12 answered. Length counted with each variable as two characters.
`K.s12.state.blueprint` | S12 | Blueprint v{version} · {files} files | `plain` | `label`, 24 | `[gen]` `docs/mvp0/screens/gen.mjs:1108`, drawn as Blueprint v1 · 15 files. Length counted with each variable as two characters.
`K.s12.send` | S12 | (uses `K.s06.send`) | `label` | `button` | Alias. The arrow at the end of the idea input has the same accessible name as the writing box's.

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

**Ids cited by `12-screens/S13.md`, reconciled 18 September.**

id | screen | string | tone | budget | notes
`K.s13.progress.page` | S13 | (uses `K.s13.progress`) | `plain` | `label` | Alias. Page {p} of {total}.
`K.s13.progress.count` | S13 | (uses `K.s13.progress.q`) | `plain` | `label` | Alias.
`K.s13.recommendation` | S13 | (uses `K.s13.choose`) | `label` | `button` | Alias. The navigation control; the phone form is `K.s13.choose.phone`.
`K.s13.rec.tag` | S13 | (uses `K.s13.recommended`) | `label` | `label` | Alias. The lower-case tag on the recommended option.
`K.s13.rewrite.cause` | S13 | (uses `K.s13.rewriting`) | `plain` | `body` | Alias. **A template with the answer substituted, never a generic sentence** (S13 spec, Copy).
`K.s13.rewrite.working` | S13 | Updating this question | `plain` | `label`, 22 | `[new]` proposed, voice-checked 18 Sep. The status on each blurred card while a rewrite runs. Only the affected cards carry it, and only when a rewrite actually fires.
`K.s13.rewrite.capped` | S13 | This blueprint has used its {rewrites} question rewrites on Free, so the later questions stay as planned. Your answer is recorded. | `refusal` | `body`, 122 | `[new]` proposed, voice-checked 18 Sep. **A refusal**: at the cap no rewrite fires (S13 spec, The rewrite). `{rewrites}` is the Free cap, read from the configuration panel and drawn nowhere as a typed number.
`K.s13.rewrite.failed` | S13 | The later questions could not be rewritten, so they stay as planned. Your answer is recorded. Nothing is deducted for a failed call. | `caution` | `body`, 132 | `[new]` proposed, voice-checked 18 Sep. The last sentence is `K.promise.nocharge` verbatim. **No failure on this screen loses an answer.**
`K.s13.skipall.line1` | S13 | (uses `K.s14.skipall.title` then `K.s14.skipall.body1`) | `caution` | `long` | Alias. The skip-all modal is one component on S13 and S14, and gen.mjs draws it once (`docs/mvp0/screens/gen.mjs:1226` to `:1229`). Its first sentence says every remaining question takes its recommended answer, which is the founders' first point (`docs/mvp0/SCREEN-CHANGES-2026-09-18.md:122`).
`K.s13.skipall.line2` | S13 | (uses `K.s14.skipall.body2`) | `caution` | `body` | Alias. Says the brief, the blueprint and the kickoff prompt come from those defaults, which covers the founders' second and third points in one sentence.
`K.s13.skipall.line3` | S13 | (uses `K.s14.skipall.body2`) | `caution` | `body` | Alias. **Disagreement recorded:** the S13 spec wants three sentences and the drawn modal has two, because `K.s14.skipall.body2` names the plan and the kickoff prompt together. The drawn wording is kept; the founders' three points are all present.
`K.s13.skipall.confirm` | S13 | (uses `K.s14.skipall.go`) | `label` | `button` | Alias. The other control is `K.s14.skipall.keep`.
`K.s13.standardset` | S13 | Use a standard question set | `label` | `label`, 27 | `[plan]` `[Z]` `docs/mvp0/SCREEN-CHANGES-2026-09-18.md:359`, the toggle's words. **Dynamic is the default**; this is the fallback, not a paywall.
`K.s13.standardset.why` | S13 | A fixed set of questions for this template. It needs no model, so it works when AI is unavailable or your allowance is used up. | `help` | `help`, 127 | `[new]` proposed, voice-checked 18 Sep. Says why the toggle exists: the graceful-degradation path S32 offers instead of an apology.
`K.s13.files.head` | S13 | The {files} files in your blueprint | `plain` | `title`, 30 | `[new]` proposed, voice-checked 18 Sep. Heading of the file list shown before any credit is spent. `{files}` is the template's count, drawn as fifteen.
`K.s13.files.beforecredit` | S13 | Nothing has been spent yet. Your blueprint credit is used only when you continue from this list. | `cost` | `lede`, 96 | `[new]` proposed, voice-checked 18 Sep. **Never spend a blueprint credit before the files have been listed** (S13 spec). Rule 7, the cost before the click.

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

**Ids cited by `12-screens/S14.md`, reconciled 18 September.**

id | screen | string | tone | budget | notes
`K.s14.src.opened` | S14 | opened {date} · {source} | `plain` | `label`, 14 | `[new]` proposed, voice-checked 18 Sep. Attribution on a High row: the page opened by the research pass and the date it was opened. Follows the shape of `K.s14.src.template`. `{source}` is the page's title or domain, never a guess.
`K.s14.researchdone` | S14 | The research for {idea} is finished. Your questions are ready. | `plain` | `lede`, 58 | `[new]` proposed, voice-checked 18 Sep. The notice when a background High research pass finishes.

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

**Ids cited by `12-screens/S15.md`, reconciled 18 September.**

id | screen | string | tone | budget | notes
`K.s15.checknotrun` | S15 | Check did not run | `caution` | `label`, 17 | `[new]` proposed, voice-checked 18 Sep. **The third state of the files-agree pill.** A check that did not run is never drawn as one that passed (S15 spec, States). The other two states are `K.s15.agree` and findings remaining.
`K.s15.revoked` | S15 | This link was turned off by its owner. Ask them for a new one. | `refusal` | `lede`, 62 | `[new]` proposed, voice-checked 18 Sep. What a reader meets on a revoked kit link. Says nothing about the kit's contents.
`K.s15.kickoff.copied` | S15 | Copied. Paste it into your agent. | `plain` | `lede`, 33 | `[new]` proposed, voice-checked 18 Sep. Confirmation after `K.s15.kickoff.copy`.

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

**Ids cited by `12-screens/S16.md`, reconciled 18 September.**

id | screen | string | tone | budget | notes
`K.s16.node.kind` | S16 | Document · Spec · Decision · Agent file | `label` | `label`, 10 | `[new]` proposed, voice-checked 18 Sep. Four separate labels, one per node kind (`doc`, `spec`, `why`, `agent` in `KCOL`, `docs/mvp0/screens/gen.mjs:1274`). Used in each node's accessible name, because colour is never the only signal. The budget is per label; the longest, Agent file, is 10.
`K.s16.stale` | S16 | Showing the map from before the last change. It could not be rebuilt. | `caution` | `lede`, 69 | `[new]` proposed, voice-checked 18 Sep. The marker on a graph kept from before a failed rebuild. The files themselves are unaffected.

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

**Ids cited by `12-screens/S17.md`, reconciled 18 September.**

id | screen | string | tone | budget | notes
`K.s17.invite.sent` | S17 | Invite sent to {email}. You both get the credits when they first sign in. | `plain` | `lede`, 68 | `[new]` proposed, voice-checked 18 Sep. The credits land at the invited person's first sign-in, not when the invite is sent (S17 spec). `{credits}` is not repeated here because `K.s17.invite.body` already stated it.
`K.s17.referral.title` | S17 | Invite someone to frontmatter | `plain` | `title`, 29 | `[new]` proposed, voice-checked 18 Sep. Heading when the same invite block is opened as a referral. Same terms as `K.s17.invite.body`.
`K.s17.lookup.failed` | S17 | We could not check whether {email} has an account. You can send an invite anyway. | `caution` | `lede`, 76 | `[new]` proposed, voice-checked 18 Sep. The directory lookup failed, and the invite is offered regardless (S17 spec, Actions).

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

**Ids cited by `12-screens/S18.md`, reconciled 18 September.**

id | screen | string | tone | budget | notes
`K.s18.notfound` | S18 | Nothing is published at this address. | `plain` | `title`, 37 | `[new]` proposed, voice-checked 18 Sep. The page, and the plain-text answer on the other routes, for an unpublished or unknown slug. **Never says whether it once existed**, the same rule as `K.s18.pw.body`.
`K.s18.empty` | S18 | This page has no content yet. | `plain` | `lede`, 29 | `[new]` proposed, voice-checked 18 Sep. A published document with no body.

---

## 14c. S19 Live collaboration

id | string | tone | budget | notes
`K.s19.live` | Live | `plain` | `label`, 8 | `[gen]` `docs/mvp0/screens/gen.mjs:1356`.
`K.s19.editing` | {name} is editing this document | `plain` | `label`, 34 | `[gen]` `docs/mvp0/screens/gen.mjs:1355`.
`K.s19.toast` | Free includes {collab} live collaborators per document. | `plain` | `body` | `[gen]` `docs/mvp0/screens/gen.mjs:1359`. **Once**, not on every join. Same defect and disagreement as `K.s17.collab.limit`.
`K.s19.invitemore` | Invite more with Pro | `label` | `button`, 24 | `[gen]` `docs/mvp0/screens/gen.mjs:1359`.

**Ids cited by `12-screens/S19.md`, reconciled 18 September.**

id | screen | string | tone | budget | notes
`K.s19.slow` | S19 | Slow | `caution` | `label`, 4 | `[new]` proposed, voice-checked 18 Sep. The marker on the live pill when the round trip is long enough to feel. Editing stays local-first and does not wait.
`K.s19.highlight` | S19 | Text another person types is highlighted as it arrives, then fades. Nothing is added to the file. | `help` | `lede`, 97 | `[new]` proposed, voice-checked 18 Sep. Shown once, on the first live session. **Presence is chrome, never content** (S19 spec).
`K.s19.dropped` | S19 | The live session stopped. You are editing on your own now, and nothing is lost. | `caution` | `lede`, 79 | `[new]` proposed, voice-checked 18 Sep. The editor falls back to a normal single-person edit with a local queue.
`K.s19.queued` | S19 | Offline. Your changes are saved on this device and sync when you are back. | `plain` | `lede`, 74 | `[new]` proposed, voice-checked 18 Sep. Worded to match `K.s24.banner.phone` and `K.s24.banner`.
`K.s19.unshared` | S19 | You no longer have access to this document. Your copy on this device stays readable and exportable. | `refusal` | `body`, 99 | `[new]` proposed, voice-checked 18 Sep. **A refusal**: access was removed under an open session. The local copy stays readable, in line with `K.promise.readable`.

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

**Ids cited by `12-screens/S20.md`, reconciled 18 September.**

id | screen | string | tone | budget | notes
`K.s20.firstrun` | S20 | Nothing here is applied to the file until you accept it. | `promise` | `lede`, 56 | `[new]` proposed, voice-checked 18 Sep. Shown once, the first time a change is queued on the account. The change queue's one rule, said to the person.
`K.s20.stale` | S20 | Could not be placed. The text around it changed, so the original is kept here. | `caution` | `lede`, 78 | `[new]` proposed, voice-checked 18 Sep. The marker on an item whose span can no longer be placed. **The original text of a stale item is never lost.**
`K.s20.confirm.bulk` | S20 | Accept all {n} changes from {name}? You can undo this in one step. | `caution` | `lede`, 61 | `[new]` proposed, voice-checked 18 Sep. **Names the person and the exact count**, and applies only to a named person's edits (see `K.s20.acceptall.note`). Plural rule on `{n}`.
`K.s20.readonly` | S20 | Your role lets you read and reply here, but not accept changes. | `refusal` | `lede`, 63 | `[new]` proposed, voice-checked 18 Sep. Why Accept is absent for this role; Reply stays.

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

**Ids cited by `12-screens/S21.md`, reconciled 18 September.**

id | screen | string | tone | budget | notes
`K.s21.window.end` | S21 | Your plan keeps {history} days of versions. Older versions are outside that window. | `plain` | `lede`, 76 | `[new]` proposed, voice-checked 18 Sep. The line at the end of the list. `{history}` comes from `limits.history.days`.
`K.s21.outofwindow` | S21 | Outside your plan's {history}-day window. Not deleted yet. | `caution` | `lede`, 51 | `[new]` proposed, voice-checked 18 Sep. **Named as out of window, never as deleted**, until pruning runs (S21 spec, over-cap state). Pro keeps longer.
`K.s21.restored` | S21 | Restored. The version from {time} is now the latest, and nothing before it was removed. | `plain` | `lede`, 83 | `[new]` proposed, voice-checked 18 Sep. The old bytes are written forward as a new version, attributed to you.
`K.s21.redrawn` | S21 | The document changed while you were looking, so this comparison was redrawn against the latest version. | `caution` | `body`, 103 | `[new]` proposed, voice-checked 18 Sep. The conflict state of history.

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

**Ids cited by `12-screens/S22.md`, reconciled 18 September.**

id | screen | string | tone | budget | notes
`K.s22.nofolderinput` | S22 | This browser cannot open a whole folder. Choose the files instead, or drop the folder onto this page. | `refusal` | `lede`, 101 | `[new]` proposed, voice-checked 18 Sep. **A refusal with the way round it**: file selection is offered instead (S22 spec, Actions).
`K.s22.collision` | S22 | {path} already existed, so both were kept. The new one is {newpath}. | `plain` | `lede`, 57 | `[new]` proposed, voice-checked 18 Sep. **An import never overwrites.** The newcomer is the one suffixed, and the string names it.
`K.s22.cancelled` | S22 | Import stopped. The {done} files already brought in are kept. | `plain` | `lede`, 57 | `[new]` proposed, voice-checked 18 Sep. Cancel keeps whatever already landed. Plural rule on `{done}`.

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

**Ids cited by `12-screens/S23.md`, reconciled 18 September.**

id | screen | string | tone | budget | notes
`K.s23.drive.connect` | S23 | Connect Google Drive | `label` | `button`, 20 | `[new]` proposed, voice-checked 18 Sep. Opens the provider's consent screen, then the folder picker. The card's claims are visible before it is pressed.
`K.s23.drive.paused` | S23 | Paused. Nothing syncs until you resume, and nothing is deleted at either end. | `plain` | `lede`, 77 | `[new]` proposed, voice-checked 18 Sep. The pill on a paused connection and what paused means (S23 spec, Actions).
`K.s23.gh.revoked` | S23 | frontmatter was removed from this repository on GitHub, so nothing can be pushed. Reinstall the app on GitHub to reconnect. | `refusal` | `body`, 123 | `[new]` proposed, voice-checked 18 Sep. **A refusal**: says where it was revoked and how to reinstall. Nothing already in the workspace is touched.
`K.s23.lastknown` | S23 | Last known state. You are offline, so these cannot be changed right now. | `caution` | `lede`, 72 | `[new]` proposed, voice-checked 18 Sep. Every control is disabled offline with this one reason.

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

**Ids cited by `12-screens/S24.md`, reconciled 18 September.**

id | screen | string | tone | budget | notes
`K.s24.storage.full` | S24 | This device is out of space, so what you type now is not being kept. Free up space, or reconnect so your edits sync, before you type more. | `caution` | `body`, 138 | `[new]` proposed, voice-checked 18 Sep. **The one interruption allowed on the offline screen.** New keystrokes still render, and the person is told plainly they are not being kept (S24 spec, Actions).
`K.s24.storage.low` | S24 | {free} left on this device for offline edits | `plain` | `lede`, 40 | `[new]` proposed, voice-checked 18 Sep. A quiet line in the banner. `{free}` is a size with its unit.
`K.s24.persist.refused` | S24 | This browser may clear offline edits if it runs low on space. | `caution` | `lede`, 61 | `[new]` proposed, voice-checked 18 Sep. The browser refused to promise to keep this site's storage. Said once, in one line, and never nagged.

**Ids cited by `12-screens/S25.md`, reconciled 18 September.**

id | screen | string | tone | budget | notes
`K.s25.addfolder` | S25 | Add a folder from this computer to write in it here. | `plain` | `lede`, 52 | `[new]` proposed, voice-checked 18 Sep. The one line on a first launch, beside the add control.
`K.s25.group.cloud` | S25 | Cloud · {project} | `label` | `label`, 10 | `[gen]` `docs/mvp0/screens/gen.mjs:1467`, drawn as Cloud · Zephyrus booking.
`K.s25.group.local` | S25 | On this Mac · {path} | `label` | `label`, 16 | `[gen]` `docs/mvp0/screens/gen.mjs:1467`, drawn as On this Mac · ~/Documents/notes. On Windows and Linux the words need their own form; none is written.
`K.s25.update.refused` | S25 | An update was found, but its signature could not be verified, so it was not installed. You are still on version {version}. | `refusal` | `body`, 115 | `[new]` proposed, voice-checked 18 Sep. **Refuses rather than warns**: never offered with a warning (S25 spec, Actions).

**Ids cited by `12-screens/S26.md`, reconciled 18 September.**

id | screen | string | tone | budget | notes
`K.s26.source` | S26 | From {app} · {time} | `plain` | `label`, 12 | `[new]` proposed, voice-checked 18 Sep. Where the shared text came from, and when, kept on the phone sheet.
`K.s26.queued` | S26 | Saved on this device. It is added to {file} when you are back online. | `plain` | `lede`, 65 | `[new]` proposed, voice-checked 18 Sep. The box still closes; the queued count appears in the workspace (S24).
`K.s26.shortcut.taken` | S26 | {chord} is already used by another app, so quick capture has no shortcut. Choose another in Settings. | `caution` | `lede`, 96 | `[new]` proposed, voice-checked 18 Sep. Shown at launch, naming the chord. The default chord is drawn as ⌘⇧Space (`docs/mvp0/screens/gen.mjs:1486`).
`K.s26.ios.absent` | S26 | iOS does not let web apps receive shared text. Open frontmatter and paste instead. | `refusal` | `lede`, 82 | `[new]` proposed, voice-checked 18 Sep. Named as absent, with no control that would fail. Consistent with the last sentence of `K.s22.phone.share`.
`K.s26.append.failed` | S26 | This could not be added to {file}. Your text is still here. Try again, or copy it. | `caution` | `lede`, 78 | `[new]` proposed, voice-checked 18 Sep. **The text stays in the box rather than being lost** (S26 spec, States).

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

**Ids cited by `12-screens/S28.md`, reconciled 18 September.**

id | screen | string | tone | budget | notes
`K.s28.sub` | S28 | (uses `K.s28.lede`) | `promise` | `long` | Alias.
`K.s28.editor.defaultmode` | S28 | (uses `K.s28.defaultmode` then `K.s28.defaultmode.sub`) | `label` | `label` | Alias. Label, then help.
`K.s28.editor.docdefault` | S28 | (uses `K.s28.docdefault` then `K.s28.docdefault.sub`) | `label` | `label` | Alias.
`K.s28.editor.linewidth` | S28 | (uses `K.s28.linewidth` then `K.s28.linewidth.sub`) | `label` | `label` | Alias.
`K.s28.editor.spellcheck` | S28 | (uses `K.s28.spellcheck` then `K.s28.spellcheck.sub`) | `label` | `label` | Alias. The help says whose spellchecker it is and where the text goes.
`K.s28.editor.vim` | S28 | (uses `K.s28.vim` then `K.s28.vim.sub`) | `label` | `label` | Alias.
`K.s28.writing.structural` | S28 | (uses `K.s28.checks` then `K.s28.checks.sub`) | `label` | `label` | Alias.
`K.s28.writing.plain` | S28 | (uses `K.s28.plain` then `K.s28.plain.sub`) | `label` | `label` | Alias. The help says the notes never block.
`K.s28.ai.model` | S28 | (uses `K.s28.model` then `K.s28.model.sub`) | `label` | `label` | Alias. The help says what Automatic means on each plan.
`K.s28.ai.selection` | S28 | (uses `K.s28.aiselection` then `K.s28.aiselection.sub`) | `label` | `label` | Alias.
`K.s28.ai.ghost` | S28 | (uses `K.s28.ghost` then `K.s28.ghost.sub`) | `label` | `label` | Alias. Off by default.
`K.s28.ai.mark` | S28 | (uses `K.s28.markai` then `K.s28.markai.sub`) | `label` | `label` | Alias.
`K.s28.account.signedin` | S28 | (uses `K.s28.signedin`) | `plain` | `label` | Alias. The phone footer.
`K.s28.account.signout` | S28 | (uses `K.s28.signout`) | `label` | `button` | Alias.
`K.s28.account.delete` | S28 | Delete account. Everything is removed 30 days after you confirm, so export anything you want to keep first. | `caution` | `lede`, 107 | `[new]` proposed, voice-checked 18 Sep. The visible control reads the first two words; the sentence sits beside it. **Never deletes on one click**: a typed confirmation comes first, and the 30-day window follows (S28 spec, Actions). Whether 30 is a configurable number is not settled; if it is, it becomes a variable.
`K.s28.offline` | S28 | Needs a connection. Your other settings still work. | `plain` | `lede`, 51 | `[new]` proposed, voice-checked 18 Sep. On a row that needs the network. First sentence matches `K.s24.aioff`.
`K.s28.degraded` | S28 | Settings are not saving right now. Keep working. Nothing is lost on this device. | `caution` | `lede`, 80 | `[new]` proposed, voice-checked 18 Sep. **One persistent line in the page heading, not one per row** (S28 spec, States).

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

**Ids cited by `12-screens/S29.md`, reconciled 18 September.**

id | screen | string | tone | budget | notes
`K.s29.sub` | S29 | (uses `K.s29.lede`) | `plain` | `lede` | Alias. Plan, account name, and the date allowances reset.
`K.s29.meter.blueprints` | S29 | (uses `K.s29.meter.kits` then `K.s29.meter.kits.val`) | `cost` | `label` | Alias. The value carries the depth the allowance is limited to.
`K.s29.plan.free.name` | S29 | (uses `K.common.free`) | `label` | `label` | Alias.
`K.s29.plan.free.includes` | S29 | (uses `K.s29.free.everything`, `K.s29.free.caps`, `K.s29.free.ai`, `K.s29.free.collab`, `K.s29.free.history`) | `plain` | `long` | Alias. The five list rows of the Free card, in that order.
`K.s29.plan.free.excludes` | S29 | (uses `K.s29.free.not`) | `plain` | `body` | Alias. The one line naming what Free does not have.
`K.s29.plan.free.current` | S29 | (uses `K.s29.current`) | `label` | `button` | Alias. A state, not an action.
`K.s29.plan.pro.name` | S29 | (uses `K.common.pro`) | `label` | `label` | Alias.
`K.s29.plan.pro.price` | S29 | (uses `K.s29.pro.price` then `K.s29.pro.price.sub`) | `cost` | `label` | Alias. **Carries the GST-inclusive wording on the price itself.**
`K.s29.plan.pro.includes` | S29 | (uses `K.s29.pro.unlimited`, `K.s29.pro.ai`, `K.s29.pro.history`, `K.s29.pro.links`, `K.s29.pro.portfolio`) | `plain` | `long` | Alias. The five list rows of the Pro card.
`K.s29.plan.pro.cta` | S29 | (uses `K.s29.upgrade`) | `label` | `button` | Alias.
`K.s29.payment.methods` | S29 | (uses the first sentence of `K.s29.payment`) | `cost` | `label` | Alias. UPI, cards.
`K.s29.payment.cancel` | S29 | (uses the second sentence of `K.s29.payment`) | `plain` | `label` | Alias. Cancel any time.
`K.s29.payment.topups` | S29 | (uses the third sentence of `K.s29.payment`) | `cost` | `body` | Alias. The two top-up offers. **The prices in the drawn sentence are typed numbers**, which section 0 calls a defect: they belong in the configuration panel.
`K.s29.soon.team` | S29 | (uses `K.s29.team`) | `plain` | `body` | Alias. Named, not purchasable.
`K.s29.soon.enterprise` | S29 | (uses `K.s29.enterprise`) | `plain` | `body` | Alias.
`K.s29.reset` | S29 | Your allowances reset on {date}. | `plain` | `lede`, 28 | `[new]` proposed, voice-checked 18 Sep. The standalone form of the reset date in `K.s29.lede`, for places where the heading is not in view. **The date is stated, never left to be guessed.**
`K.s29.pastdue` | S29 | Your payment on {date} did not go through. Nothing has been removed or locked. Pay again to keep Pro. | `caution` | `body`, 97 | `[new]` proposed, voice-checked 18 Sep. A failed mandate: one control to pay again (S29 spec, States). Related to, and not the same as, the gap noted under the S29 table: that one is a failed first payment attempt, which still has no string.
`K.s29.pending` | S29 | Confirming your payment, started at {time}. There is nothing more to do here. | `plain` | `lede`, 73 | `[new]` proposed, voice-checked 18 Sep. **Says the payment is being confirmed rather than claiming it failed** when the webhook is late (S29 spec, Actions).


**The trial and its lock, added 18 September for D08** `[Z]`. Specified in
`53-PRICING-AND-ENTITLEMENTS.md` sections 5.1 and 5.5. Every row is `[new]`, proposed, and **not
founder-reviewed**. The numbers are variables: `{days}` comes from `trial.reminders.days` and
`{date}` from `trial.ends_at`, never typed.

id | screen | string | tone | budget | notes
`K.trial.countdown` | S29 | Pro trial, ends on {date} | `plain` | `label`, 25 | `[new]` proposed 18 Sep. Replaces `K.s29.current` on the Pro card while `trial.state` is `active`.
`K.trial.reminder.subject` | email | Your Pro trial ends in {days} days | `caution` | `title`, 34 | `[new]` proposed 18 Sep. **Plural rule:** when `{days}` is 1 it reads "1 day", the same rule D1 below asks for.
`K.trial.reminder` | email, S29 | Your Pro trial ends on {date}, in {days} days. If it is not paid by then, you can still read every document, but editing, copying and export pause until you pay. | `caution` | `body`, 161 | `[new]` proposed 18 Sep. **One string for every day in the schedule**, so changing `trial.reminders.days` needs no new copy. Says the consequence on the first reminder, not only the last.
`K.trial.reminder.mirror` | email | Your copy in {mirror} is yours and is not affected. | `plain` | `help`, 51 | `[new]` proposed 18 Sep. `{mirror}` is "your GitHub repository" or "your Google Drive". **Omitted, not guessed**, when there is no mirror.
`K.trial.banner` | many | Pro trial: {days} days left. Pay by {date} to keep editing. | `caution` | `body`, 59 | `[new]` proposed 18 Sep. In the app from the third-last reminder day onward, per `53` section 5.1.2.
`K.trial.pay` | S29, S33 | Pay for Pro | `label` | `button`, 11 | `[new]` proposed 18 Sep. The one action on every trial string. Opens the same Razorpay path as `K.s29.upgrade`.
`K.trial.locked.title` | S33 | Your Pro trial has ended | `caution` | `title`, 24 | `[new]` proposed 18 Sep.
`K.trial.locked.banner` | many | Your trial ended on {date}. You can read every document. Editing, copying and export are paused until you pay for Pro. | `caution` | `body`, 118 | `[new]` proposed 18 Sep. Says what still works first, then what stopped, then the way out. No apology, per rule 6.
`K.trial.locked.mirror` | S33 | Your copy in {mirror} is untouched, and nothing here has been deleted. | `promise` | `lede`, 70 | `[new]` proposed 18 Sep. **The in-app lock does not remove the mirror**, and the person is told so plainly. Omitted when there is no mirror.
`K.trial.locked.edit` | many | Editing is paused because your trial ended. Pay for Pro to edit again. | `refusal` | `body`, 70 | `[new]` proposed 18 Sep. On any keystroke or accept in a locked document. Once per session, then the banner carries it.
`K.trial.locked.copy` | many | Copying is paused because your trial ended. Pay for Pro to copy again. | `refusal` | `body`, 70 | `[new]` proposed 18 Sep. On the copy command.
`K.trial.locked.export` | S28, many | Export is paused because your trial ended. Pay for Pro to export again. | `refusal` | `body`, 71 | `[new]` proposed 18 Sep. On every export control. `UNVERIFIED:` whether this refusal is lawful; needs: legal opinion.
`K.trial.unlocked` | S29 | Payment received. Pro is on, and editing, copying and export are open again. | `plain` | `lede`, 76 | `[new]` proposed 18 Sep. Shown once, after `trial.unlocked`.

---

## 14k. S30 Portfolio

id | string | tone | budget | notes
`K.s30.published` | Published · {url} | `plain` | `label`, 34 | `[gen]` `docs/mvp0/screens/gen.mjs:1565`.
`K.s30.live` | Live at {url} | `plain` | `label`, 30 | `[gen]` `docs/mvp0/screens/gen.mjs:1564`.
`K.s30.onefile` | One file. | `plain` | `label`, 12 | `[gen]` `docs/mvp0/screens/gen.mjs:1585`.
`K.s30.onefile.body` | The front matter is the profile, the folder is the writing. Nothing here is a second format: the same file renders as a page in any markdown tool. | `promise` | `long` | `[gen]` `docs/mvp0/screens/gen.mjs:1585`.
`K.s30.projects` | Projects | `label` | `label`, 12 | `[gen]` `docs/mvp0/screens/gen.mjs:1559`.
`K.s30.writing` | Writing | `label` | `label`, 10 | `[gen]` `docs/mvp0/screens/gen.mjs:1560`.

**Ids cited by `12-screens/S30.md`, reconciled 18 September.**

id | screen | string | tone | budget | notes
`K.s30.explainer` | S30 | (uses `K.s30.onefile` then the first sentence of `K.s30.onefile.body`) | `promise` | `body` | Alias. The front matter is the profile, the folder is the writing.
`K.s30.portable` | S30 | (uses the second sentence of `K.s30.onefile.body`) | `promise` | `body` | Alias. The same file renders as a page in any markdown tool.
`K.s30.handle.claim` | S30 | Your handle, as in frontmatter.in/@you | `label` | `lede`, 38 | `[new]` proposed, voice-checked 18 Sep. The field's label. `[O]` No handle shape is written anywhere: the plan's handle lines give only frontmatter.in/@handle, S30 says one handle per account, case-folded (line 95), `E048` is the generic invalid-value row, `66-FORMAT-SPECIFICATIONS.md` types `handle` as a string, and `src/` and `specs/` hold no portfolio code. So the string states no shape. When S30 decides one, add it here as a help line.
`K.s30.handle.taken` | S30 | @{handle} is already taken. Try another. | `refusal` | `lede`, 34 | `[new]` proposed, voice-checked 18 Sep. **Nothing is written** when the handle is held (S30 spec, Actions).
`K.s30.publish` | S30 | Publish portfolio | `label` | `button`, 17 | `[new]` proposed, voice-checked 18 Sep. The publish control.
`K.s30.unpublish` | S30 | Unpublish. The page goes offline and @{handle} stays reserved for you for {days} days. | `caution` | `lede`, 76 | `[new]` proposed, voice-checked 18 Sep. The control and its consequence. `{days}` is the stated interval, which the spec requires and does not give; it belongs in the configuration panel.
`K.s30.templates.heading` | S30 | Start from a template | `label` | `label`, 21 | `[new]` proposed, voice-checked 18 Sep. The heading over the few starting files. A template **never overwrites** an existing `portfolio.md`.
`K.s30.madewith` | S30 | (uses `K.s18.made`) | `plain` | `label` | Alias. Free footer only; Pro removes it.
`K.s30.proonly` | S30 | Your portfolio is part of Pro. | `plain` | `lede`, 30 | `[new]` proposed, voice-checked 18 Sep. Stated plainly on Free; the same fact appears on the Free card as `K.s29.free.not`.
`K.s30.writing.empty` | S30 | Nothing in your writing folder yet. Whatever you add there appears here. | `plain` | `lede`, 72 | `[new]` proposed, voice-checked 18 Sep.

---

## 14l. S31 Conflict

**The screen the plan's central promise exists for.**

id | string | tone | budget | notes
`K.s31.banner` | Two versions of {file} changed the same paragraph while one of them was offline. Nothing was merged. Choose one, or keep both. | `caution` | `long` | `[gen]` `docs/mvp0/screens/gen.mjs:1599`. **"Nothing was merged" comes before the instruction**, because that is the fear to answer first.
`K.s31.banner.phone` | Two versions changed the same paragraph. Nothing was merged. | `caution` | `body` | `[gen]` `docs/mvp0/screens/gen.mjs:1604`.
`K.s31.side` | {source} · {who} · {time} | `plain` | `label`, 34 | `[gen]` `docs/mvp0/screens/gen.mjs:1600`. `{source}` is "This browser", "This phone", "Google Drive", the desktop or GitHub.
`K.s31.keep` | Accept this version | `label` | `button`, 19 | `[gen]` `docs/mvp0/screens/gen.mjs:1870`. `[Z]` renamed from Keep this one on 18 September 2026 (S31, `D66`). The id is kept so nothing that points at it breaks.
`K.s31.keepboth` | Keep both as two files | `label` | `button`, 26 | `[gen]` `docs/mvp0/screens/gen.mjs:1602`.
`K.s31.letai` | Let AI decide | `label` | `button`, 16 | `[gen]` `docs/mvp0/screens/gen.mjs:1602`. **Offered, not hidden** `[Z]` (`docs/mvp0/SCREEN-CHANGES-2026-09-18.md:202`). Its proposal enters the change queue; it never writes to the file.
`K.s31.note` | Whichever you choose, the other version stays in history. The same screen appears for a desktop edit against a GitHub change. | `promise` | `long` | `[gen]` `docs/mvp0/screens/gen.mjs:1602`.
`K.s31.count` | {n} conflict to resolve | `caution` | `label`, 26 | `[gen]` `docs/mvp0/screens/gen.mjs:1598`. Plural on `{n}`.
`K.s31.preview` | AI suggestion · a preview, nothing is written yet · one change in your queue | `promise` | `label`, 76 | `[gen]` `docs/mvp0/screens/gen.mjs:1872`. `[Z]` 18 September. Over the merged result once Let AI decide has answered. **"Nothing is written yet" is the promise**, so it is never cut for space.
`K.s31.acceptai` | Accept AI suggestion | `label` | `button`, 20 | `[gen]` `docs/mvp0/screens/gen.mjs:1873`. `[Z]` 18 September. Accepts the one previewed proposal and writes exactly its bytes. Pressed by a person, never automatic.
`K.s31.acceptai.off` | Accept AI suggestion opens once Let AI decide has shown you its merge. | `plain` | `body`, 70 | `[gen]` `docs/mvp0/screens/gen.mjs:1878`. Under the disabled control, before a preview exists, while it is being made, and when a merge arrived only in part.
`K.s31.reviewspans` | Review span by span | `label` | `button`, 19 | `[gen]` `docs/mvp0/screens/gen.mjs:1873`. Opens S20 on the same proposal.

**`K.s31.letai` needs a second string that does not exist.** `[new]` When the proposal arrives in the
queue it needs a row that says it came from a merge attempt and is a proposal, not a result. Without
it the screen's promise and the queue's behaviour are only connected in a document.

**Ids cited by `12-screens/S31.md`, reconciled 18 September.**

id | screen | string | tone | budget | notes
`K.s31.origin.browser` | S31 | This browser · {who} · {time} | `plain` | `label`, 22 | `[gen]` `docs/mvp0/screens/gen.mjs:1600`, drawn as This browser · you · today 14:02. An instance of `K.s31.side`. The phone reads This phone (`docs/mvp0/screens/gen.mjs:1605`).
`K.s31.origin.drive` | S31 | Google Drive · {who} · {time} | `plain` | `label`, 22 | `[gen]` `docs/mvp0/screens/gen.mjs:1601`, drawn as Google Drive · Amit · today 14:05.
`K.s31.origin.desktop` | S31 | Desktop app · {who} · {time} | `plain` | `label`, 21 | `[new]` proposed, voice-checked 18 Sep. The same shape. Not drawn; the S31 spec names the desktop as an origin.
`K.s31.origin.github` | S31 | GitHub · {who} · {time} | `plain` | `label`, 16 | `[new]` proposed, voice-checked 18 Sep. The same shape. Not drawn.
`K.s31.letai.explain` | S31 | AI proposes a merge. Nothing is written to the file: each change goes to your change queue for you to accept or reject. | `promise` | `body`, 119 | `[new]` proposed, voice-checked 18 Sep. **It proposes and never writes**, reviewed span by span (S31 spec, Actions). Partly fills the gap noted just above this block.
`K.s31.consequence` | S31 | (uses the first sentence of `K.s31.note`) | `promise` | `lede` | Alias. Whichever you choose, the other version stays in history.
`K.s31.aidown` | S31 | No AI provider is answering, so this is unavailable. The other choices still work and nothing was charged. | `refusal` | `lede`, 106 | `[new]` proposed, voice-checked 18 Sep. On the disabled Let AI decide control. The four other resolutions stay available (S31 spec, Actions).
`K.s31.readonly` | S31 | You can see this conflict but not resolve it. The document's owner or an editor can choose. | `refusal` | `lede`, 91 | `[new]` proposed, voice-checked 18 Sep. For a role that may read the conflict and may not resolve it.

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

**Ids cited by `12-screens/S32.md`, reconciled 18 September.**

id | screen | string | tone | budget | notes
`K.s32.chain.heading` | S32 | Providers tried | `label` | `label`, 15 | `[new]` proposed, voice-checked 18 Sep. The label over the provider list. **The list is shown on purpose**, so a person can see the fault is not their document.
`K.s32.reason.exhausted` | S32 | free allowance used | `plain` | `label`, 19 | `[new]` proposed, voice-checked 18 Sep. For a provider whose pool is finished and which states no reset, such as Cerebras, whose quota refills continuously (S32 spec, the provider table). Where a reset is stated, the row uses `K.s32.reason.pool` instead. **Never a reset the provider did not give.**
`K.s32.reason.transient` | S32 | busy right now | `plain` | `label`, 14 | `[new]` proposed, voice-checked 18 Sep. A provider that was busy and gave no wait. Where it gives the seconds, the row uses `K.s32.reason.rate` instead. **Never the same words as exhausted**: a Cloudflare 3036 and a 3040 must read differently (S32 spec, Acceptance).
`K.s32.reason.trialended` | S32 | (uses `K.s32.reason.trial`) | `plain` | `label` | Alias.
`K.s32.reason.unknown` | S32 | declined, and gave no reason | `plain` | `label`, 28 | `[new]` proposed, voice-checked 18 Sep. Said as such, rather than guessed.
`K.s32.chip.retry` | S32 | (uses `K.s32.try`) | `label` | `button` | Alias.
`K.s32.chip.local` | S32 | (uses `K.s32.local`) | `label` | `label` | Alias.
`K.s32.chip.byok` | S32 | (uses `K.s32.ownkey`) | `label` | `button` | Alias. Not shown at all when the bring-your-own-key flag is off in S37.
`K.s32.chip.standardset` | S32 | (uses `K.s13.standardset` then `K.s13.standardset.why`) | `label` | `label` | Alias. In idea mode only. This, with `K.s13.standardset.why`, answers the gap the note under this section's table records.
`K.s32.rail` | S32 | (uses `K.s32.aioff`) | `refusal` | `body` | Alias. The line on the disabled AI control in the right rail, `[gen]` `docs/mvp0/screens/gen.mjs:1622`.
`K.s32.offline` | S32 | You are offline, so AI cannot be reached. Reconnect, or use the local model in the desktop app. | `caution` | `body`, 95 | `[new]` proposed, voice-checked 18 Sep. **A different line from the refusal**, because being offline is the person's to fix and a provider refusal is not (S32 spec, States). Your document is untouched either way.

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

**Ids cited by `12-screens/S33.md`, reconciled 18 September.**

id | screen | string | tone | budget | notes
`K.s33.exit.free` | S33 | (uses `K.s33.do.delete`) | `label` | `label` | Alias. First way out.
`K.s33.exit.desktop` | S33 | (uses `K.s33.do.desktop`) | `label` | `lede` | Alias. Second way out. Shown for the document cap, which the desktop app does not have.
`K.s33.exit.pro` | S33 | (uses `K.s33.do.pro`) | `label` | `lede` | Alias. **GST inclusive on the price.** The drawn string types the price, where rule 0 of this deck wants a variable from the configuration panel.
`K.s33.exit.wait` | S33 | Wait for the reset on {date} | `label` | `lede`, 24 | `[new]` proposed, voice-checked 18 Sep. Shown only for a monthly allowance, and **omitted, not guessed**, when the reset date could not be read (S33 spec, partial state).
`K.s33.lowered` | S33 | This limit was lowered on {date}. Your usage did not change, and nothing you have was removed. | `plain` | `lede`, 90 | `[new]` proposed, voice-checked 18 Sep. The limit changed on the plan, not the person's usage (S33 spec, degraded state).
`K.s33.exception.lapsed` | S33 | The extra allowance on your account ended on {date}, so your plan's usual limit applies again. | `plain` | `lede`, 90 | `[new]` proposed, voice-checked 18 Sep. A time-boxed exception from S38 has expired.
`K.s33.offline` | S33 | This needs a connection. You are offline, not over your limit. You can keep writing on this device. | `refusal` | `lede`, 99 | `[new]` proposed, voice-checked 18 Sep. **The offline reason, not the cap reason** (S33 spec, offline state).

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

**Ids cited by `12-screens/S34.md`, reconciled 18 September.**

id | screen | string | tone | budget | notes
`K.s34.standing` | S34 | (uses `K.s34.railempty`) | `plain` | `body` | Alias.
`K.s34.what` | S34 | (uses `K.s34.lede`) | `plain` | `long` | Alias. What a blueprint is and what comes out of it.
`K.s34.depth.low` | S34 | (uses `K.s34.low`) | `plain` | `body` | Alias.
`K.s34.depth.medium` | S34 | (uses `K.s34.medium`) | `plain` | `body` | Alias.
`K.s34.depth.high` | S34 | (uses `K.s34.high`) | `plain` | `body` | Alias.
`K.s34.box.prompt` | S34 | (uses `K.s34.prompt`) | `plain` | `title` | Alias.
`K.s34.chip.example` | S34 | (uses `K.s34.example`) | `label` | `label` | Alias.
`K.s34.chip.template` | S34 | (uses `K.s34.template`) | `label` | `button` | Alias.
`K.s34.credits` | S34 | (uses `K.s34.credit`) | `cost` | `label` | Alias.
`K.s34.steps` | S34 | (uses `K.s34.step1`, `K.s34.step2`, `K.s34.step3`, `K.s34.step4`) | `label` | `label` | Alias. The four step names.
`K.s34.offline` | S34 | An idea needs a connection to write its questions. What you type here is kept until you are back. | `plain` | `lede`, 97 | `[new]` proposed, voice-checked 18 Sep. The static half of the screen still renders from the cache.
`K.s34.overcap` | S34 | Your blueprint allowance for this month is used up. You can start now with the standard question set, or wait for the reset on {date}. The example is always free to read. | `cost` | `body`, 166 | `[new]` proposed, voice-checked 18 Sep. **Says what happens if you start anyway** (S34 spec, over-cap state).

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

**Ids cited by `12-screens/S35.md`, reconciled 18 September.**

id | screen | string | tone | budget | notes
`K.s35.col.free` | S35 | (uses `K.common.free`) | `label` | `label` | Alias. The Free column heading, `[gen]` `docs/mvp0/screens/gen.mjs:1679`.
`K.s35.col.pro` | S35 | (uses `K.common.pro`) | `label` | `label` | Alias. The Pro column heading.
`K.s35.invariant` | S35 | (uses the second sentence of `K.s35.lede`) | `promise` | `long` | Alias. The product reads this table and nothing else; there is no second copy of these numbers in the source.
`K.s35.lastchange` | S35 | {who} · {to} from {from} · {date} | `plain` | `label`, 20 | `[gen]` `docs/mvp0/screens/gen.mjs:1669`, drawn as Sagnik · 50 from 25 · 14 Sep. The new value comes first.
`K.s35.pending.count` | S35 | (uses `K.s35.bar.change`) | `plain` | `label` | Alias.
`K.s35.pending.impact` | S35 | (uses `K.s35.bar.warn`) | `caution` | `label` | Alias. Said before the save, with the count.
`K.s35.pending.seewho` | S35 | (uses `K.s35.bar.seewho`) | `label` | `button` | Alias.
`K.s35.pending.discard` | S35 | (uses `K.s35.bar.discard`) | `label` | `button` | Alias.
`K.s35.pending.save` | S35 | (uses `K.s35.bar.save`) | `label` | `button` | Alias. Never a bare Save.
`K.s35.confirm.lower` | S35 | This lowers {limit} on {plan} from {from} to {to}. {n} accounts will be over their cap. Everything they have stays readable and exportable, and they cannot create more until they are under it. | `caution` | `body`, 176 | `[new]` proposed, voice-checked 18 Sep. **Names the count before the save.** The consequence is the over-cap rule of S33: everything stays readable, nothing new is created.
`K.s35.impact.unknown` | S35 | The number of accounts this would affect could not be worked out, so it cannot be saved yet. Try again in a moment. | `refusal` | `body`, 115 | `[new]` proposed, voice-checked 18 Sep. **A refusal**: the save is blocked rather than made blind (S35 spec).
`K.s35.phone.readonly` | S35 | (uses `K.s35.phone.note`) | `refusal` | `body` | Alias.

**Ids cited by `12-screens/S36.md`, reconciled 18 September.**

id | screen | string | tone | budget | notes
`K.s36.sub` | S36 | (uses `K.s36.lede`) | `plain` | `lede` | Alias.
`K.s36.sec.chain` | S36 | (uses `K.s36.chain`) | `label` | `label` | Alias.
`K.s36.sec.routing` | S36 | (uses `K.s36.routing`) | `label` | `label` | Alias.
`K.s36.sec.local` | S36 | Desktop models | `label` | `label`, 14 | `[new]` proposed, voice-checked 18 Sep. The label over the block of local models the desktop app runs. Not drawn.
`K.s36.terms.missing` | S36 | (uses `K.s36.note.unopened` then `K.s36.cannotenable`) | `refusal` | `label` | Alias. The reason, then the disabled switch's state.
`K.s36.terms.record` | S36 | Record the terms: the page, the date you opened it, and what it says about training | `help` | `help`, 83 | `[new]` proposed, voice-checked 18 Sep. The control and its fields. Opening the page is what lets the provider be switched on, which keeps `K.promise.notraining` true.
`K.s36.pool.known` | S36 | {left} left today | `plain` | `label`, 13 | `[new]` proposed, voice-checked 18 Sep. Only where our own ledger can state it. **Never learned by a probe call** (S36 spec, Data contract).
`K.s36.pool.unknown` | S36 | Not known until it runs out | `plain` | `label`, 27 | `[new]` proposed, voice-checked 18 Sep. For a provider whose remaining pool cannot be known before spending it. Said as such, never estimated.
`K.s36.trial.ends` | S36 | (uses `K.s36.note.trial`) | `plain` | `label` | Alias.
`K.s36.cost.percall` | S36 | (uses `K.s36.col.cost`) | `label` | `label` | Alias. **The figure in the cell is computed from the price table, never typed** (S36 spec).
`K.s36.phone.readonly` | S36 | (uses `K.s35.phone.note`) | `refusal` | `body` | Alias. The same line as S35.

**Ids cited by `12-screens/S37.md`, reconciled 18 September.**

id | screen | string | tone | budget | notes
`K.s37.sub` | S37 | (uses `K.s37.lede`) | `plain` | `lede` | Alias.
`K.s37.sec.flags` | S37 | (uses `K.s37.flags`) | `label` | `label` | Alias.
`K.s37.sec.locked` | S37 | (uses `K.s37.locked`) | `label` | `label` | Alias.
`K.s37.flag.live.title` | S37 | (uses `K.s37.flag.live`) | `label` | `label` | Alias.
`K.s37.flag.live.desc` | S37 | Two people in one document at once. Turns on live collaboration. Free up to {collab}, unlimited on Pro. | `help` | `help`, 97 | `[gen]` `docs/mvp0/screens/gen.mjs:1716`, with one change: the drawn string names a screen id, which rule 4 of this deck forbids, so it reads live collaboration here.
`K.s37.flag.byok.title` | S37 | (uses `K.s37.flag.byok`) | `label` | `label` | Alias.
`K.s37.flag.byok.desc` | S37 | A key field in Settings AI. A person's own calls run on their key. Both plans. | `help` | `help`, 78 | `[gen]` `docs/mvp0/screens/gen.mjs:1717`.
`K.s37.flag.magiclink.title` | S37 | (uses `K.s37.flag.magic`) | `label` | `label` | Alias.
`K.s37.flag.magiclink.desc` | S37 | A third way in, beside Google and GitHub. Changes the sign-in page. | `help` | `help`, 67 | `[gen]` `docs/mvp0/screens/gen.mjs:1718`, with the screen id replaced by its name under rule 4.
`K.s37.flag.indexing.title` | S37 | (uses `K.s37.flag.index`) | `label` | `label` | Alias.
`K.s37.flag.indexing.desc` | S37 | Off means every published page stays out of search. Changes robots and the share dialog. | `help` | `help`, 88 | `[gen]` `docs/mvp0/screens/gen.mjs:1719`, with the screen id replaced by its name under rule 4. Whether this stays off is an open founders' question; see `K.promise.noindex`.
`K.s37.locked.training.title` | S37 | (uses `K.s37.lock.training`) | `promise` | `label` | Alias. The same words as the sign-in page.
`K.s37.locked.training.reason` | S37 | (uses `K.s37.lock.training.sub`) | `promise` | `long` | Alias.
`K.s37.locked.agefloor.title` | S37 | (uses `K.s37.lock.age`) | `legal` | `label` | Alias.
`K.s37.locked.agefloor.reason` | S37 | (uses `K.s37.lock.age.sub`) | `legal` | `long` | Alias.
`K.s37.off.explains` | S37 | This is not available yet. Nothing is wrong with your account or your documents. | `plain` | `lede`, 80 | `[new]` proposed, voice-checked 18 Sep. What a screen shows when its flag is off, **rather than a not-found page** (S37 spec).

**Ids cited by `12-screens/S38.md`, reconciled 18 September.**

id | screen | string | tone | budget | notes
`K.s38.sub` | S38 | (uses `K.s38.lede`) | `plain` | `lede` | Alias.
`K.s38.search.placeholder` | S38 | Find an account by email | `label` | `label`, 24 | `[new]` proposed, voice-checked 18 Sep. The field's prompt. There is no account list on this screen, on purpose.
`K.s38.search.nomatch` | S38 | No account matches {query}. | `plain` | `lede`, 22 | `[new]` proposed, voice-checked 18 Sep. **No near matches and no suggestions**, because a wrong account is worse than none (S38 spec, States).
`K.s38.meter.spend` | S38 | (uses `K.s38.spent`, then this month) | `label` | `label` | Alias. The period is drawn as this month (`docs/mvp0/screens/gen.mjs:1739`); those two words have no id of their own yet.
`K.s38.grant.limit` | S38 | Limit to lift | `label` | `label`, 13 | `[new]` proposed, voice-checked 18 Sep. Field label.
`K.s38.grant.value` | S38 | New value | `label` | `label`, 9 | `[new]` proposed, voice-checked 18 Sep. Field label.
`K.s38.grant.expiry` | S38 | Expires (required) | `label` | `label`, 18 | `[new]` proposed, voice-checked 18 Sep. **An exception always carries an expiry.**
`K.s38.grant.reason` | S38 | Why (kept in the audit log) | `label` | `label`, 27 | `[new]` proposed, voice-checked 18 Sep. The reason is written into the audit row.
`K.s38.exception.note` | S38 | (uses `K.s38.expiry`) | `plain` | `long` | Alias.
`K.s38.exception.held` | S38 | {who} granted an exception on {date}: {reason}. It expires {expiry}. | `plain` | `lede`, 49 | `[new]` proposed, voice-checked 18 Sep. On an account that already holds one.
`K.s38.exception.lapsed` | S38 | The exception ended on {date}. This account is back on its plan's limits. | `plain` | `lede`, 69 | `[new]` proposed, voice-checked 18 Sep. The account-side form of `K.s33.exception.lapsed`.
`K.s38.ledger.heading` | S38 | (uses `K.s38.ledger`) | `label` | `label` | Alias.
`K.s38.audit.heading` | S38 | Audit log | `label` | `label`, 9 | `[gen]` `docs/mvp0/screens/gen.mjs:1662`, the fifth entry of the configuration panel's navigation.
`K.s38.audit.row` | S38 | {who} · {setting} · {from} to {to} · {when} · {n} accounts moved | `plain` | `body`, 43 | `[new]` proposed, voice-checked 18 Sep. One audit line.

---

## 14q. Namespaces and families the screens cite

**These tokens are not strings and never get one.** A screen writes `K.s04.*` to mean every row in
its namespace, or `K.s28.nav.<slug>` to mean one row per slug. The validator reads each as an id,
so this section is where each is recorded as what it is. Reconciled on 18 September; the working
file is `docs/pack/tools/copy-reconciliation.md`.

**Twenty-nine screen namespaces and the trial namespace**, then seven templates and the error namespace. None is a string.

family | kind | what it stands for | members in this deck
`K.s01` | namespace, `K.s01.*` | every row for S01 | section 3
`K.s02` | namespace, `K.s02.*` | every row for S02 | section 4
`K.s03` | namespace, `K.s03.*` | every row for S03 | section 4
`K.s04` | namespace, `K.s04.*` | every row for S04 | section 5
`K.s05` | namespace, `K.s05.*` | every row for S05 | section 6
`K.s06` | namespace, `K.s06.*` | every row for S06 | section 7
`K.s07` | namespace, `K.s07.*` | every row for S07 | section 8
`K.s08` | namespace, `K.s08.*` | every row for S08 | section 9
`K.s09` | namespace, `K.s09.*` | every row for S09 | section 10
`K.s10` | namespace, `K.s10.*` | every row for S10 | section 11
`K.s11` | namespace, `K.s11.*` | every row for S11 | section 12
`K.s12` | namespace, `K.s12.*` | every row for S12 | section 13.1
`K.s13` | namespace, `K.s13.*` | every row for S13 | section 13.2
`K.s27` | namespace, `K.s27.*` | every row for S27 | section 5
`K.s28` | namespace, `K.s28.*` | every row for S28 | section 14i
`K.s29` | namespace, `K.s29.*` | every row for S29 | section 14j
`K.s30` | namespace, `K.s30.*` | every row for S30 | section 14k
`K.s31` | namespace, `K.s31.*` | every row for S31 | section 14l
`K.s32` | namespace, `K.s32.*` | every row for S32 | section 14m
`K.s33` | namespace, `K.s33.*` | every row for S33 | section 14n
`K.trial` | namespace, `K.trial.*` | every trial and trial-lock row, S29, S33 and the reminder emails | section 14j, added 18 September
`K.s34` | namespace, `K.s34.*` | every row for S34 | section 14o
`K.s35` | namespace, `K.s35.*` | every row for S35 | section 14p
`K.s36` | namespace, `K.s36.*` | every row for S36 | section 14p
`K.s37` | namespace, `K.s37.*` | every row for S37 | section 14p
`K.s38` | namespace, `K.s38.*` | every row for S38 | section 14p
`K.s39` | namespace, `K.s39.*` | every row for S39 | section 14r, added 19 September
`K.s40` | namespace, `K.s40.*` | every row for S40 | section 14r
`K.s41` | namespace, `K.s41.*` | every row for S41, including its refusals under `K.s41.err` | section 14r
`K.s42` | namespace, `K.s42.*` | every row for S42 | section 14r
`K.s41.err` | namespace, `K.s41.err.*` | the S41 refusal strings, one per voice error of `17-ERROR-AND-REFUSAL-CATALOGUE.md` | section 14r
`K.s28.nav` | template, `K.s28.nav.<slug>` | one label per settings section | all ten, `K.s28.nav.account` to `K.s28.nav.plan`, matching the slugs in the S28 spec
`K.s30.templates` | template, `K.s30.templates.<slug>` | one name and one line per portfolio template | **none written.** The templates themselves are not chosen
`K.s33.heading` | template, `K.s33.heading.<entitlement>` | one heading per cap, naming the limit and the number | only the documents cap, as `K.s33.title`. The other caps have no heading yet
`K.s33.blocked` | template, `K.s33.blocked.<entitlement>` | the one not-allowed row, per cap | only the documents cap, as `K.s33.not.create`
`K.s35.row` | template, `K.s35.row.<entitlement>` | one label per limit row | all nine, `K.s35.row.docs` to `K.s35.row.pushes`
`K.s36.routing.col` | template, `K.s36.routing.col.<plan>` | one heading per plan column | the two plans, as `K.common.free` and `K.common.pro`
`K.s38.meter` | template, `K.s38.meter.<entitlement>` | one label per usage meter | only `K.s38.meter.spend`. gen.mjs draws Documents, AI edits this month and Blueprints (`docs/mvp0/screens/gen.mjs:1736` to `:1738`) with no ids yet
`K.err` | namespace, `K.err.*` | the words for every row of `17-ERROR-AND-REFUSAL-CATALOGUE.md` | **none written.** Named at `17-ERROR-AND-REFUSAL-CATALOGUE.md` lines 144 and 389, and owned there

## 14r. S39 to S42, sheets, boards, voice and PDF

**Added 19 September 2026**, for screens S39 to S42 and specs `68-SHEETS-SPEC.md` to
`72-PDF-TO-MARKDOWN-SPEC.md`. The slug each id replaced is in `tools/new-ids-allocation.md` section 9.

- **`[gen]` rows are verbatim** from `docs/mvp0/screens/gen.mjs` at `1335518`, read by line number.
  Where the drawing holds a number, the row holds a variable, and the note gives the drawn value.
- **`[new]` rows are proposed and not voice-checked.** The first-run lines, the Other column, three
  refusals and the download notice were never drawn. The founders review the wording.
- **The voice refusals take their wording from `71-VOICE-SPEC.md` section 11**, which calls them
  proposals. They are `[new]` for the same reason.
- **Five rows are marked Review** in their notes, where a drawn string may break a rule of section 0.4
  or disagree with its spec.

id | screen | string | tone | budget | notes
`K.s39.rows` | S39 | {rows} rows · {cols} columns | `plain` | `label`, 28 | `[gen]` `docs/mvp0/screens/gen.mjs:2255`. `{rows}` and `{cols}` are counts of the table, drawn as 6 and 6
`K.s39.sort` | S39 | {column}, high to low | `label` | `label`, 21 | `[gen]` `docs/mvp0/screens/gen.mjs:2256`. Drawn as Total, high to low. The other direction, low to high, is `[new]` proposed
`K.s39.filter` | S39 | Filter | `label` | `button`, 6 | `[gen]` `docs/mvp0/screens/gen.mjs:2256`.
`K.s39.viewnote` | S39 | Sort and filter are yours. The file keeps its order. | `promise` | `help`, 52 | `[gen]` `docs/mvp0/screens/gen.mjs:2257`.
`K.s39.grid` | S39 | Grid | `label` | `button`, 4 | `[gen]` `docs/mvp0/screens/gen.mjs:2257`.
`K.s39.md` | S39 | MD | `label` | `button`, 2 | `[gen]` `docs/mvp0/screens/gen.mjs:2257`.
`K.s39.fxref` | S39 | {column}, {row} | `label` | `label`, 15 | `[gen]` `docs/mvp0/screens/gen.mjs:2258`. Drawn as Total, Design hours: the column, then the row's first cell. Never an address such as B2
`K.s39.fxhint` | S39 | A row formula. Each result is written into its own cell, one cell at a time. | `help` | `help`, 76 | `[gen]` `docs/mvp0/screens/gen.mjs:2258`.
`K.s39.summary` | S39 | Summary | `label` | `label`, 7 | `[gen]` `docs/mvp0/screens/gen.mjs:2238`.
`K.s39.addrow` | S39 | Add row | `label` | `button`, 7 | `[gen]` `docs/mvp0/screens/gen.mjs:2239`.
`K.s39.addcol` | S39 | Add column | `label` | `button`, 10 | `[gen]` `docs/mvp0/screens/gen.mjs:2240`. The accessible name of the plus at the end of the header
`K.s39.viewonly` | S39 | Row numbers, widths and the frozen header are yours too. Only a cell you type into changes the file. | `promise` | `help`, 100 | `[gen]` `docs/mvp0/screens/gen.mjs:2265`.
`K.s39.formulas` | S39 | Formulas in this file | `label` | `label`, 21 | `[gen]` `docs/mvp0/screens/gen.mjs:2267`.
`K.s39.formulas.note` | S39 | Under the table, where an agent reads them. The sum is drawn, never written. | `plain` | `help`, 76 | `[gen]` `docs/mvp0/screens/gen.mjs:2267`.
`K.s39.open.full` | S39 | Open as a sheet | `label` | `button`, 15 | `[gen]` `docs/mvp0/screens/gen.mjs:2283`.
`K.s39.embed.foot` | S39 | fm-sheet@1 under this table holds {n} formulas. Switch to MD to see them as text. | `plain` | `help`, 81 | `[gen]` `docs/mvp0/screens/gen.mjs:2285`. Drawn with 2 formulas. **Review:** it names a format, which section 0.4 rule 4 may count as internal shorthand
`K.s39.swipe` | S39 | {columns} are a swipe away. {first} stays pinned. | `plain` | `help`, 49 | `[gen]` `docs/mvp0/screens/gen.mjs:2270`. Drawn as Qty, Paid and Due are a swipe away. Item stays pinned
`K.s39.cell.save` | S39 | Saving changes this cell and the {column} beside it. Nothing else in the file moves. | `promise` | `help`, 84 | `[gen]` `docs/mvp0/screens/gen.mjs:2275`. Drawn with Total as the dependent column
`K.s39.firstrun` | S39 | Sorting and filtering change only your view. Typing into a cell changes the file. | `plain` | `help`, 81 | `[new]` proposed, not drawn. The first-run line of S39's States.
`K.s40.count` | S40 | {n} cards in {folder} | `plain` | `label`, 21 | `[gen]` `docs/mvp0/screens/gen.mjs:2340`. Drawn as 15 cards in tasks/
`K.s40.groupedby` | S40 | columns from {key} | `plain` | `label`, 18 | `[gen]` `docs/mvp0/screens/gen.mjs:2340`. Drawn with the key `status` in code type
`K.s40.pending` | S40 | {n} proposed move | `label` | `label`, 17 | `[gen]` `docs/mvp0/screens/gen.mjs:2356`. Needs the plural rule of section 15 D1: {n} proposed moves
`K.s40.limit` | S40 | Limit {limit}. Past it the count turns red; nothing is blocked. | `plain` | `help`, 63 | `[gen]` `docs/mvp0/screens/gen.mjs:2334`. The tooltip on the count, which reads {n} / {limit}. **Review:** red names a colour, and `69-BOARDS-SPEC.md` section 4.1 says the warning colour
`K.s40.newcard` | S40 | New card | `label` | `button`, 8 | `[gen]` `docs/mvp0/screens/gen.mjs:2337`.
`K.s40.newcard.in` | S40 | New card in {column} | `label` | `button`, 20 | `[gen]` `docs/mvp0/screens/gen.mjs:2363`. On the phone
`K.s40.mine` | S40 | Mine | `label` | `button`, 4 | `[gen]` `docs/mvp0/screens/gen.mjs:2341`.
`K.s40.duesoon` | S40 | Due this week | `label` | `button`, 13 | `[gen]` `docs/mvp0/screens/gen.mjs:2341`.
`K.s40.label` | S40 | Label | `label` | `button`, 5 | `[gen]` `docs/mvp0/screens/gen.mjs:2341`.
`K.s40.find` | S40 | Filter cards | `label` | `label`, 12 | `[gen]` `docs/mvp0/screens/gen.mjs:2341`. The search field's placeholder
`K.s40.filternote` | S40 | Filters are yours. The board file never changes. | `promise` | `help`, 48 | `[gen]` `docs/mvp0/screens/gen.mjs:2342`.
`K.s40.swimlanes` | S40 | Swimlanes | `label` | `label`, 9 | `[gen]` `docs/mvp0/screens/gen.mjs:2342`. Drawn off and disabled; not in v1
`K.s40.proposedby` | S40 | Proposed by {agent} | `plain` | `label`, 19 | `[gen]` `docs/mvp0/screens/gen.mjs:2326`. `{agent}` is the name the person gave the agent
`K.s40.showdiff` | S40 | Show diff | `label` | `button`, 9 | `[gen]` `docs/mvp0/screens/gen.mjs:2326`. `K.s20.showdiff` may serve instead, if its owner agrees
`K.s40.moves` | S40 | Moves this card from {from} to {to}. One line in one file. | `plain` | `help`, 58 | `[gen]` `docs/mvp0/screens/gen.mjs:2382`.
`K.s40.onlyaccept` | S40 | Nothing moves until a person accepts. Agent changes are accepted one at a time. | `promise` | `help`, 79 | `[gen]` `docs/mvp0/screens/gen.mjs:2385`.
`K.s40.overdue` | S40 | {date}, overdue | `caution` | `label`, 15 | `[gen]` `docs/mvp0/screens/gen.mjs:2379`.
`K.s40.opendoc` | S40 | Open as a document | `label` | `button`, 18 | `[gen]` `docs/mvp0/screens/gen.mjs:2388`.
`K.s40.swipe` | S40 | Swipe for {column} | `plain` | `label`, 18 | `[gen]` `docs/mvp0/screens/gen.mjs:2361`.
`K.s40.other` | S40 | Other | `label` | `label`, 5 | `[new]` proposed, not drawn. The column for cards whose key holds no known value, `69-BOARDS-SPEC.md` section 2.3.
`K.s40.firstrun` | S40 | Each card is a file. Moving a card changes one line in it. | `plain` | `help`, 58 | `[new]` proposed, not drawn. The first-run line of S40's States.
`K.s41.listening` | S41 | Listening | `label` | `label`, 9 | `[gen]` `docs/mvp0/screens/gen.mjs:2511`. Also the phone sheet's heading, line 2518
`K.s41.level` | S41 | {level} | `label` | `label`, 7 | `[gen]` `docs/mvp0/screens/gen.mjs:2497`. One of Low, Medium, High, the names at line 2558
`K.s41.tone.note` | S41 | {tone} tone at High only | `help` | `label`, 24 | `[gen]` `docs/mvp0/screens/gen.mjs:2497`. Drawn greyed as neutral tone at High only
`K.s41.held` | S41 | {key} held · release to finish | `help` | `help`, 30 | `[gen]` `docs/mvp0/screens/gen.mjs:2498`. `{key}` is the voice key, drawn as the Mac chord
`K.s41.pending` | S41 | Voice, {level} · pending | `plain` | `label`, 24 | `[gen]` `docs/mvp0/screens/gen.mjs:2502`.
`K.s41.accept` | S41 | accept | `label` | `label`, 6 | `[gen]` `docs/mvp0/screens/gen.mjs:2503`. Follows the Tab key. The phone draws a button, Accept, at line 2502
`K.s41.raw` | S41 | raw words | `label` | `label`, 9 | `[gen]` `docs/mvp0/screens/gen.mjs:2503`. Follows the Esc key. The phone draws a button, Raw, at line 2502
`K.s41.raw.show` | S41 | Show raw | `label` | `button`, 8 | `[gen]` `docs/mvp0/screens/gen.mjs:2503`.
`K.s41.append` | S41 | Speak again to add to this block | `help` | `help`, 32 | `[gen]` `docs/mvp0/screens/gen.mjs:2503`.
`K.s41.proposed` | S41 | Proposed, not written | `plain` | `label`, 21 | `[gen]` `docs/mvp0/screens/gen.mjs:2533`.
`K.s41.command` | S41 | Voice command | `label` | `label`, 13 | `[gen]` `docs/mvp0/screens/gen.mjs:2537`.
`K.s41.command.target` | S41 | {command}, on your selection | `plain` | `label`, 28 | `[gen]` `docs/mvp0/screens/gen.mjs:2537`. Drawn as Make a bullet list, on your selection. The command's name, never the spoken words
`K.s41.command.what` | S41 | One paragraph becomes three bullets, one per thing the owner does. | `plain` | `help`, 66 | `[gen]` `docs/mvp0/screens/gen.mjs:2538`. **A drawn example, not a template.** `INFERENCE:` each command of `71-VOICE-SPEC.md` section 7.4 needs its own line; none is written
`K.s41.command.fine` | S41 | Nothing changes until you accept. It waits in Review with your other changes. | `promise` | `help`, 77 | `[gen]` `docs/mvp0/screens/gen.mjs:2540`.
`K.s41.stop` | S41 | Tap to stop. Your words land as a pending block you accept. Audio is never stored. | `promise` | `help`, 82 | `[gen]` `docs/mvp0/screens/gen.mjs:2522`.
`K.s41.command.chip` | S41 | Command | `label` | `button`, 7 | `[gen]` `docs/mvp0/screens/gen.mjs:2520`.
`K.s41.set.cleanup` | S41 | Clean up what I say | `label` | `label`, 19 | `[gen]` `docs/mvp0/screens/gen.mjs:2560`.
`K.s41.set.cleanup.help` | S41 | Off gives the raw words, exactly as heard, and sends nothing to a text model | `help` | `help`, 76 | `[gen]` `docs/mvp0/screens/gen.mjs:2560`. The phone shortens it to Off gives the raw words, line 2575
`K.s41.set.levels` | S41 | How much to clean up | `label` | `label`, 20 | `[gen]` `docs/mvp0/screens/gen.mjs:2561`.
`K.s41.set.levels.help` | S41 | Every level keeps your facts. You can see the raw words on any block before you accept it | `help` | `help`, 89 | `[gen]` `docs/mvp0/screens/gen.mjs:2561`.
`K.s41.set.level.low` | S41 | Takes out ums, false starts and self-corrections. Every other word stays, in order. | `help` | `help`, 83 | `[gen]` `docs/mvp0/screens/gen.mjs:2558`. Under the card named Low
`K.s41.set.level.medium` | S41 | Also splits sentences, groups paragraphs, and makes a list where you spoke one. | `help` | `help`, 79 | `[gen]` `docs/mvp0/screens/gen.mjs:2558`. Under the card named Medium, marked default
`K.s41.set.level.high` | S41 | Rewrites into clear prose in your tone. Every fact, name and number stays. | `help` | `help`, 74 | `[gen]` `docs/mvp0/screens/gen.mjs:2558`. Under the card named High
`K.s41.set.key` | S41 | Push-to-talk key | `label` | `label`, 16 | `[gen]` `docs/mvp0/screens/gen.mjs:2564`.
`K.s41.set.key.help` | S41 | Hold to speak, release to finish. Hold Option as well to give a command | `help` | `help`, 71 | `[gen]` `docs/mvp0/screens/gen.mjs:2564`. Option is the Mac name. Windows and Linux need Alt in its place
`K.s41.set.language` | S41 | English only for now | `help` | `help`, 20 | `[gen]` `docs/mvp0/screens/gen.mjs:2565`.
`K.s41.set.more` | S41 | Commands, spelling, your own words, live preview while speaking | `help` | `help`, 63 | `[gen]` `docs/mvp0/screens/gen.mjs:2566`.
`K.s41.privacy` | S41 | Audio is never stored. It is held in memory, sent to be transcribed, and dropped when the words come back. It is never kept to retry, never logged, and never used for training. | `promise` | `body`, 176 | `[gen]` `docs/mvp0/screens/gen.mjs:2567`. The phone keeps the first sentence, line 2579
`K.s41.firstuse` | S41 | Your voice is sent to be turned into text, then dropped. It is never stored. | `promise` | `help`, 76 | `[new]` proposed, not drawn. The one-line sheet before the browser's own prompt, `71-VOICE-SPEC.md` section 13.2.
`K.s41.insert.text` | S41 | Insert as text instead | `label` | `button`, 22 | `[gen]` `docs/mvp0/screens/gen.mjs:2539`.
`K.s41.err.micdenied` | S41 | Microphone access is off. Turn it on in the browser's site settings to use voice. | `refusal` | `body`, 81 | `[new]` proposed, wording from `71-VOICE-SPEC.md` section 11. `E806`. With a link to how.
`K.s41.err.nomic` | S41 | No microphone found. | `refusal` | `body`, 20 | `[new]` proposed, wording from `71-VOICE-SPEC.md` section 11. `E807`.
`K.s41.err.miclost` | S41 | The microphone stopped. What you said so far is below. | `caution` | `body`, 54 | `[new]` proposed, wording from `71-VOICE-SPEC.md` section 11. `E808`.
`K.s41.err.nothing` | S41 | Didn't catch anything. Hold the key and speak. | `refusal` | `body`, 46 | `[new]` proposed, wording from `71-VOICE-SPEC.md` section 11. `E567`.
`K.s41.err.turnlimit` | S41 | That's the limit for one turn. Your words so far are below; hold the key again to go on. | `caution` | `body`, 88 | `[new]` proposed, wording from `71-VOICE-SPEC.md` section 11. `E654`.
`K.s41.err.offline` | S41 | Voice needs a connection on the web. On the desktop app it works offline. | `refusal` | `body`, 73 | `[new]` proposed, wording from `71-VOICE-SPEC.md` section 11. `E809`.
`K.s41.err.busy` | S41 | Voice is busy right now. Try again in a minute. | `refusal` | `body`, 47 | `[new]` proposed, wording from `71-VOICE-SPEC.md` section 11. `E756`.
`K.s41.err.slow` | S41 | Showing the raw text; cleanup took too long. | `caution` | `body`, 44 | `[new]` proposed, wording from `71-VOICE-SPEC.md` section 11. `E701`.
`K.s41.err.changed` | S41 | Cleanup changed words, so the raw text is shown. | `caution` | `body`, 48 | `[new]` proposed, wording from `71-VOICE-SPEC.md` section 11. `E702`.
`K.s41.err.cap` | S41 | You've used this month's voice minutes. They refill daily. | `refusal` | `body`, 58 | `[new]` proposed, wording from `71-VOICE-SPEC.md` section 11. `E655`. **Review:** `71` section 11 names the clash between this month and refill daily.
`K.s41.err.notarget` | S41 | Select the text first | `refusal` | `body`, 21 | `[new]` proposed, wording from `71-VOICE-SPEC.md` section 11. `E568`.
`K.s41.err.protected` | S41 | Voice commands change prose only. This is inside {where}, so nothing was changed. Select prose and try again. | `refusal` | `body`, 109 | `[new]` proposed, not drawn. `E529`. `{where}` is a code block, a table or the front matter.
`K.s41.err.toolong` | S41 | That selection is {words} words, and a voice command takes up to {max}. Nothing was changed. Select less and try again. | `refusal` | `body`, 119 | `[new]` proposed, not drawn. `E569`. `{max}` is `voice.command.maxSelectionWords`.
`K.s42.start` | S42 | Start from a PDF | `label` | `button`, 16 | `[gen]` `docs/mvp0/screens/gen.mjs:2587`. The label is open, D25
`K.s42.start.sub` | S42 | Converted in your browser | `help` | `label`, 25 | `[gen]` `docs/mvp0/screens/gen.mjs:2594`.
`K.s42.start.note` | S42 | A PDF becomes this document's first version. It is read in your browser and not kept. | `promise` | `help`, 85 | `[gen]` `docs/mvp0/screens/gen.mjs:2595`. The phone reads A PDF is read on this phone and not kept, line 2601
`K.s42.converting` | S42 | Converting · {done} of {total} pages | `plain` | `help`, 36 | `[gen]` `docs/mvp0/screens/gen.mjs:2610`. Drawn as 9 of 12
`K.s42.converting.where` | S42 | in your browser | `plain` | `label`, 15 | `[gen]` `docs/mvp0/screens/gen.mjs:2610`.
`K.s42.legend.text` | S42 | Text, {n} | `label` | `label`, 9 | `[gen]` `docs/mvp0/screens/gen.mjs:2612`.
`K.s42.legend.scanned` | S42 | Scanned, read by OCR, {n} | `label` | `label`, 25 | `[gen]` `docs/mvp0/screens/gen.mjs:2612`.
`K.s42.legend.waiting` | S42 | Waiting, {n} | `label` | `label`, 12 | `[gen]` `docs/mvp0/screens/gen.mjs:2612`.
`K.s42.label.not.written` | S42 | page {n}, scanned: this label is not written | `plain` | `help`, 44 | `[gen]` `docs/mvp0/screens/gen.mjs:2614`. A preview annotation. It never reaches the file
`K.s42.flag.low` | S42 | {n} words read with low confidence, marked. None is changed for you | `caution` | `help`, 67 | `[gen]` `docs/mvp0/screens/gen.mjs:2616`. Drawn with 4
`K.s42.flag.heading` | S42 | {n} headings guessed from font size, because the PDF has no tags | `caution` | `help`, 64 | `[gen]` `docs/mvp0/screens/gen.mjs:2617`. Drawn with 2
`K.s42.lands` | S42 | Lands as one change for you to accept. | `plain` | `help`, 38 | `[gen]` `docs/mvp0/screens/gen.mjs:2618`.
`K.s42.dropped` | S42 | The PDF is dropped when this panel closes. | `promise` | `help`, 42 | `[gen]` `docs/mvp0/screens/gen.mjs:2618`.
`K.s42.tool.title` | S42 | Convert a PDF to Markdown | `label` | `title`, 25 | `[gen]` `docs/mvp0/screens/gen.mjs:2666`.
`K.s42.tool.sub` | S42 | One PDF in, one note out. Read in your browser, so the file never leaves this computer. | `promise` | `lede`, 87 | `[gen]` `docs/mvp0/screens/gen.mjs:2666`.
`K.s42.file.into` | S42 | File into | `label` | `label`, 9 | `[gen]` `docs/mvp0/screens/gen.mjs:2657`.
`K.s42.file.as` | S42 | As | `label` | `label`, 2 | `[gen]` `docs/mvp0/screens/gen.mjs:2658`.
`K.s42.file.button` | S42 | File into Notes | `label` | `button`, 15 | `[gen]` `docs/mvp0/screens/gen.mjs:2660`.
`K.s42.keep.images` | S42 | Keep images | `label` | `label`, 11 | `[gen]` `docs/mvp0/screens/gen.mjs:2659`.
`K.s42.keep.images.help` | S42 | Uploads them next to the note | `help` | `help`, 29 | `[gen]` `docs/mvp0/screens/gen.mjs:2659`.
`K.s42.not.kept` | S42 | The PDF is not kept after conversion. It was read in this tab and is dropped when you file or discard. | `promise` | `body`, 102 | `[gen]` `docs/mvp0/screens/gen.mjs:2661`. The phone keeps the first sentence, line 2675
`K.s42.err.password` | S42 | This PDF is locked with a password, so nothing was converted. Remove the password in the app that made it, then try again. | `refusal` | `body`, 122 | `[new]` proposed, not drawn. `E570`. The last sentence is `72-PDF-TO-MARKDOWN-SPEC.md` section 8's.
`K.s18.sheet.download` | S18 | Cells that began with a formula character now begin with an apostrophe, so a spreadsheet reads them as text. This page is unchanged. | `promise` | `body`, 132 | `[new]` proposed, not drawn. The notice on a neutralised CSV download, `68-SHEETS-SPEC.md` section 6.3.

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
`docs/mvp0/PRODUCT-PLAN.md` section 5 and `docs/mvp0/screens/gen.mjs:16` follow it.
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
- **The count, re-derived at write time rather than estimated.** This deck carries **996 ids, each
  on exactly one row**, counted on 18 September 2026 after the D08 rows were added, with:

  ```bash
  grep -cE '^`K\.[a-z0-9.]+` \|' docs/pack/16-COPY-DECK.md               # 996 rows
  grep -oE '^`K\.[a-z0-9.]+` \|' docs/pack/16-COPY-DECK.md \
    | sed 's/ |$//' | sort -u | wc -l                                     # 996 distinct
  ```

  **The two numbers agreeing is the check**, because a repeated id would break the one-fact-one-home
  rule this deck exists to keep.
- **What that count does not cover.** `docs/mvp0/screens/gen.mjs` is 1,760 lines and holds further
  literal text inside sample documents, which section 16 excludes by rule. **So 996 is the size of
  the deck, not the size of the generator.** The figure printed here before was 574; the same
  command returned 981 at commit `31d3644`, before the D08 rows, so 574 was already stale.
