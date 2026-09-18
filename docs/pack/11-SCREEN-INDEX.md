---
id: 11-SCREEN-INDEX
title: Screen index
mode: reference
tier: canonical
status: living
updated: 2026-09-18
owner: sagnik
verified_against: 0af3c90
covers: [screens, S01-S38]
---

# 11. Screen index

**One row per screen, thirty-eight rows.** The detail for each lives in `12-screens/SNN.md`, built
from `tools/SCREEN-TEMPLATE.md`. This file is the index into those, and the place a reader finds out
that most of them do not exist yet.

## 0. Three things to know before reading the table

1. **Most screens have no route.** Two screens are reachable at a URL of their own. The rest are
   either unbuilt, or internal states of `/`. Section 4 counts it.
2. **No row says `built` or `verified`.** `docs/pack/65-CONVENTIONS.md:96` gives those two values to the
   harness, and says a hand edit is reverted by the next build. So every row here is `specified` or
   `building`, even where the code is plainly there. That is the convention working, not an error.
3. **Six screen files did not exist when this was written.** `12-screens/` was filling while this
   index was being made: it held none at the start and thirty-two an hour later. Re-check with
   `ls docs/pack/12-screens | wc -l` rather than trusting a count in prose. Every `spec file` cell
   names the file whether or not it is there yet, because the path is the contract.

## 1. How a row is filled

Column | Rule
`id` | `S` plus two digits, from `docs/mvp0/SCREENS.md`. Never renumbered
`name` | The heading in `docs/mvp0/SCREENS.md`, unchanged
`area` | The `##` heading it sits under in the same file. Nine areas, listed in section 3
`route` | The URL, found with `find src/app -name 'page.tsx'`. `none` where there is no route at all
`plan` | `Free`, `Pro`, `Free+Pro` where the screen serves both with different caps, `Founder` for the panel
`features` | Every id from `10-FEATURE-REGISTER.md` whose `screens` column names this screen
`spec file` | `12-screens/SNN.md`, none of which exist yet
`build status` | `specified` or `building` only. See point 2 above

**The features column is derived, not typed.** It is the transpose of the `screens` column in
`10-FEATURE-REGISTER.md`, produced in this session by reading that file and inverting the mapping.
If the two ever disagree, the register wins, because it is the home.

## 2. The index

id | name | area | route | plan | features it carries | spec file | build status
`S01` | Sign in | Getting in | `/login`, and `/` when signed out | Free+Pro | F101, F102, F103, F104 | 12-screens/S01.md | building
`S02` | Home, first time | Getting in | none | Free+Pro | F105, F107, F135 | 12-screens/S02.md | specified
`S03` | Home | Getting in | none | Free+Pro | F106, F107 | 12-screens/S03.md | specified
`S04` | Workspace | Writing | `/` | Free+Pro | F111, F113, F114, F116, F117, F118, F119, F120, F121, F122, F123, F124, F125, F126, F127, F129, F130, F131, F132, F133, F134, F135, F136, F137, F138, F139, F142, F143, F144, F145, F146, F147, F157, F240 | 12-screens/S04.md | building
`S05` | Doc mode | Writing | `/`, a mode of S04 | Free+Pro | F112, F113, F114, F115, F128 | 12-screens/S05.md | specified
`S06` | AI writing box | Writing | `/`, an overlay on S04 | Free+Pro | F150, F151, F152, F153, F154 | 12-screens/S06.md | building
`S07` | AI edit | Writing | `/`, a menu on S04 | Free+Pro | F154, F155, F156, F158, F159, F160 | 12-screens/S07.md | building
`S08` | Custom blocks | Writing | `/`, content inside S04 | Free+Pro | F131, F137, F174, F175, F176, F177, F178, F179, F180 | 12-screens/S08.md | building
`S09` | Flow view | Writing | none | Free+Pro | F181, F182, F183, F184, F185 | 12-screens/S09.md | specified
`S10` | Problems | Writing | none | Free+Pro | F140, F141, F148, F165, F166, F167, F168, F169, F170, F224 | 12-screens/S10.md | specified
`S11` | Instruction files | Writing | none | Free+Pro | F171, F172, F173 | 12-screens/S11.md | specified
`S12` | Ideas | Ideas | none | Free+Pro | F119, F120, F179, F188, F189, F199, F200 | 12-screens/S12.md | specified
`S13` | Idea mode, Low | Ideas | none | Free | F153, F189, F190, F191, F192, F193, F194, F195, F196 | 12-screens/S13.md | specified
`S14` | Idea mode, Medium and High | Ideas | none | Pro | F189, F190, F195, F196, F197, F198 | 12-screens/S14.md | specified
`S15` | Blueprint ready | Ideas | none | Free+Pro | F201, F202, F203, F204, F205, F206 | 12-screens/S15.md | specified
`S16` | The map | Ideas | `/`, a modal on S04 | Free+Pro | F186, F187 | 12-screens/S16.md | building
`S17` | Share | Sharing | `/`, a modal on S04 | Free+Pro | F110, F208, F209, F210, F211, F212, F213, F214 | 12-screens/S17.md | building
`S18` | Published page | Sharing | `/[slug]`, and `/p/[slug]` which redirects to it | Free+Pro | F104, F214, F215, F216, F217, F218, F219, F220, F256 | 12-screens/S18.md | building
`S19` | Live collaboration | Sharing | none | Free+Pro | F221, F222 | 12-screens/S19.md | specified
`S20` | Document review | Sharing | none | Free+Pro | F110, F156, F223, F224, F225, F226, F251, F280 | 12-screens/S20.md | specified
`S21` | Document history | Sharing | `/`, a modal on S04 | Free+Pro | F162, F206, F227, F228, F229 | 12-screens/S21.md | building
`S22` | Import | In and out | `/`, a modal on S04 | Free+Pro | F118, F121, F234, F235, F236, F237, F238, F239, F255, F277, F278 | 12-screens/S22.md | building
`S23` | Connections | In and out | none | Free+Pro | F242, F243, F244, F245, F246 | 12-screens/S23.md | specified
`S24` | Offline | Everywhere | none | Free+Pro | F163, F247, F248, F249 | 12-screens/S24.md | specified
`S25` | Desktop app | Everywhere | none on the web; the Tauri shell loads `/` | Free+Pro | F163, F250, F251, F252, F256 | 12-screens/S25.md | building
`S26` | Quick capture | Everywhere | none | Free+Pro | F149, F255 | 12-screens/S26.md | specified
`S27` | Dark mode | Everywhere | `/`, a toggle on S04 | Free+Pro | F109 | 12-screens/S27.md | building
`S28` | Settings | Account | `/`, a modal on S04 | Free+Pro | F108, F109, F140, F157, F162, F164, F240, F241 | 12-screens/S28.md | building
`S29` | Plan and usage | Account | none in the app. `/pricing` is a public placeholder, not this screen | Free+Pro | F154, F219, F257, F258, F259, F262, F263, F264, F265 | 12-screens/S29.md | specified
`S30` | Portfolio | Account | none | Pro | F230 | 12-screens/S30.md | specified
`S31` | Conflict | The states | `/`, a modal on S04, for slug conflicts only | Free+Pro | F231, F232, F233, F280 | 12-screens/S31.md | building
`S32` | AI unavailable | The states | none | Free+Pro | F158, F159, F161, F194 | 12-screens/S32.md | specified
`S33` | Over the cap | The states | none | Free+Pro | F257, F260, F261 | 12-screens/S33.md | specified
`S34` | Ideas, empty | The states | none | Free | F188, F207 | 12-screens/S34.md | specified
`S35` | Configuration, plans and limits | Configuration | none | Founder | F193, F222, F229, F243, F257, F266, F267, F268 | 12-screens/S35.md | specified
`S36` | Configuration, models and providers | Configuration | none | Founder | F159, F160, F268, F269, F270, F271 | 12-screens/S36.md | specified
`S37` | Configuration, features and flags | Configuration | none | Founder | F164, F268, F272, F273 | 12-screens/S37.md | specified
`S38` | Configuration, accounts and usage | Configuration | none | Founder | F258, F274, F275 | 12-screens/S38.md | specified

**Four features belong to no single screen** and so appear in no row above: `F253` the phone layout
and `F254` the bottom bar, which are every screen; `F279` the projection law, which is every screen;
and `F276` splice-only writing, which is every editing screen. They are checked in
`19-ACCEPTANCE-CRITERIA.md` per screen, not once.

**Every screen carries at least one feature.** Checked by inverting the register's `screens` column
and looking for an empty list. There were none. That is the one consistency property this file
guarantees, and a validator should assert it.

## 3. The nine areas

Area | Screens | Heading in `docs/mvp0/SCREENS.md`
Getting in | S01, S02, S03 | `## 3. Getting in`
Writing | S04 to S11 | `## 4. Writing`
Ideas | S12 to S16 | `## 5. Ideas`
Sharing | S17 to S21 | `## 6. Sharing`
In and out | S22, S23 | `## 7. Bringing things in and out`
Everywhere | S24 to S27 | `## 8. Everywhere`
Account | S28, S29, S30 | `## 9. Account`
The states | S31 to S34 | `## 10. The states nobody wants, drawn anyway`
Configuration | S35 to S38 | `## 11. The configuration panel, which only a founder sees`

**The area names above are shortened** from the headings, which is the only place this file departs
from the source. The heading is given in full in the third column so the mapping is checkable.

## 4. The count, which is the point of this file

Kind | Count | Which
A route of its own | **2** | S01 at `/login`, S18 at `/[slug]`
Reachable only as a state of `/` | **12** | S04, S05, S06, S07, S08, S16, S17, S21, S22, S27, S28, S31
No route at all | **24** | S02, S03, S09, S10, S11, S12, S13, S14, S15, S19, S20, S23, S24, S25, S26, S29, S30, S32, S33, S34, S35, S36, S37, S38

**So thirty-six of thirty-eight screens have no URL.** Twelve of those are reachable inside the
workspace. Twenty-four cannot be reached at all at `0af3c90`.

**The routes, in full**, from `find src/app -name 'page.tsx'`:

```
src/app/(auth)/login/page.tsx        -> /login
src/app/(public)/[slug]/page.tsx     -> /<slug>
src/app/(public)/p/[slug]/page.tsx   -> /p/<slug>, redirects to /<slug>
src/app/(public)/pricing/page.tsx    -> /pricing
src/app/(public)/privacy/page.tsx    -> /privacy
src/app/(public)/refunds/page.tsx    -> /refunds
src/app/(public)/terms/page.tsx      -> /terms
src/app/(vault)/page.tsx             -> /
```

**Eight page routes, and twenty-six API routes** from `find src/app -name 'route.ts'`. The four
legal and commercial pages all render `src/app/(public)/pending-legal-page.tsx`, a placeholder that
names the text it will hold and a due date of 15 October 2026. They are not screens in the
thirty-eight, and they carry `F104`.

## 5. What `/` actually hosts, and what this file cannot settle

`src/app/(vault)/page.tsx` is five lines. It renders `AppShell`, which renders `VaultWorkspace`,
which composes the tree, the editor, the right pane and a set of modals.

**INFERENCE: at least nine of the thirty-eight screens are internal states of that one route.** The
count comes from matching a mounted component to a screen:

Screen | Component that hosts it | Where it is mounted
`S04` | `VaultWorkspace` with `FileTree`, `EditorPane`, `RightPane` | `src/modules/app-shell/presentation/VaultWorkspace.tsx`
`S07` | `AIMenu` | `EditorPane`
`S16` | `GraphView` | `KnowledgeUI`
`S17` | `ShareMenu`, `ShareModal` | `EditorPane`
`S21` | `HistoryModal` | `EditorPane`
`S22` | `ImportModal` | `KnowledgeUI`
`S27` | `ThemeToggle` | the header
`S28` | `SettingsModal` | `KnowledgeUI`
`S31` | `DuplicateConflictModal` | `VaultWorkspace`

**Why this is a lower bound and not an answer.** Three reasons, and none of them is resolvable from
the route list:

- `KnowledgeUI` also mounts `Spotlight`, `CommandPalette`, `SearchPanel`, `LinkDoctorModal` and
  `TrashModal`. Search, the palette and the trash appear in no numbered screen at all. They may be
  parts of S04, or they may be screens the plan never drew.
- S06 and S08 are partly present without a surface of their own. `SgnkAiButton` and
  `/api/ai/generate-doc` do some of S06's work; Mermaid, KaTeX, callouts and the editable table do
  some of S08's, inside the document rather than on a screen.
- S31 is drawn as a document conflict with two versions side by side. The shipped
  `DuplicateConflictModal` resolves a **public slug** claimed by two notes, which is a different
  conflict. `merge3` and `/api/vault/merge` exist and handle content conflicts with no screen.

**Where this gets resolved, and nothing in the pack does it yet.** Settling the count needs somebody
to drive the running app and record what a person can actually reach, which the source tree cannot
answer. The nearest file is `01-EXECUTIVE-SUMMARY.md`, whose `covers` list names `state-of-build`,
but it reads the tree as this file does. **Nothing in this index should be read as a claim about
what works.**

## 6. Two places the sources disagree

### 6.1 The plan and the screens file group S27 differently

`docs/mvp0/SCREENS.md` puts S27 Dark mode under `## 8. Everywhere`. That is what this index follows,
because the brief says the areas come from that file's headings. `docs/mvp0/PRODUCT-PLAN.md` section 5
lists S27 in the same run of screens but the plan has no area headings at all, only `## 5. The
screens`, so there is nothing to conflict with. **Recorded so nobody 'fixes' it later.**

### 6.2 The configuration panel is both deferred and shipping

`docs/mvp0/SCREEN-CHANGES-2026-09-18.md` section 7 carries the founder instruction "Later. Build the
product first." Section 10.1 item 5 of the same file, later the same day, reverses it: "The
configuration panel ships, with hardcoded defaults." **The later answer wins**, and S35 to S38 are
indexed as live specified screens rather than as Later. The plan agrees, at
`docs/mvp0/PRODUCT-PLAN.md` section 25, where phase A carries "the configuration panel of section 30".

## 7. The limits of this index

- **Not assessed:** whether thirty-eight is the right number of screens, or whether any two should
  merge. S06 and S07 are two rows for one AI surface, and S13 and S14 are two rows for one flow that
  the founders explicitly told us not to fork.
- **Could not be verified:** the twelve screens listed as states of `/`. That mapping is a reading of
  the component tree, not of a running app. It is marked `INFERENCE` in section 5 for that reason.
- **Not established:** whether search, the command palette, the spotlight and the trash are screens.
  They are in the code and in no screen list. Section 5 names them rather than quietly assigning them.
- **What would falsify a `building` row:** opening the app and finding the surface absent. Fourteen
  rows say `building` on the strength of a component existing, which is a proxy for a working screen
  and is labelled one.
- **What would falsify the route counts:** a route added under `src/app` after `0af3c90`. Re-derive
  with `find src/app -name 'page.tsx' | sort` rather than trusting section 4.
