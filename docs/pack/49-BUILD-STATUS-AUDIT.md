---
id: 49-BUILD-STATUS-AUDIT
title: Build status audit
mode: reference
tier: canonical
status: living
verified_against: f237ece
updated: 2026-09-18
owner: sagnik
covers: [build-status]
---

# 49. Build status audit

Every specified screen and every headline feature against what is actually wired at `f237ece`.

**Read section 1 before the tables.** The counting method decides what every row means, and a row read
without it will be read wrongly.

## 1. How each row was determined

### 1.1 Why the route count is not the screen count

Three counts, all taken in this session, and none of them is the answer on its own.

```bash
find src/app -name 'page.tsx' | wc -l     # 8
find src/app -name 'route.ts' | wc -l     # 26
grep -c '^### S' docs/mvp0/SCREENS.md     # 38
```

**Eight page routes. Thirty-eight specified screens.** Those numbers do not compare, because one route
hosts many screens.

`src/app/(vault)/page.tsx` is five lines. It renders `<AppShell />`, which renders
`<VaultWorkspace />`, which is a three-pane workspace holding a file tree, an editor with four modes,
a right pane with three modes, a graph overlay, a settings dialogue, an import dialogue, a history
dialogue, a trash dialogue, a share dialogue, a command palette, a conflict dialogue and a floating AI
panel. **Every one of those is a specified screen or part of one**, and all of them live behind one
url.

**So the built count is higher than 8 and lower than 38.** This file's answer is in section 4.

### 1.2 The four verdicts, and the evidence each one needs

Verdict | What it means | What has to be true
**built** | A person can reach it and use it | A route or a component reachable from `src/app/`, plus the code behind it
**partly** | Some of it works and a named part does not | The same, plus a specific missing piece named in the row
**server only** | An API route exists and no interface reaches it | A `route.ts` with no caller in `src/`
**not built** | No code | A grep over `src/` returning nothing but incidental matches

**Every "not built" rests on a grep, and the grep is in the row**, so a reader can re-run it rather
than trust it. An incidental match, a word inside a comment or a reserved-slug list, is counted as
nothing and said to be.

### 1.3 What a row does not say

A **built** row says the thing is reachable. It does not say it matches the screen, that it is
correct, that it is tested, or that it would survive a second user. The `Divergence` column carries
what was noticed; it is not a full comparison, and section 6 says so.

## 2. The eight page routes and the twenty-six API routes

Taken verbatim from `find`, and listed so nobody has to guess what exists.

Page route | File | Serves
`/login` | `src/app/(auth)/login/page.tsx` | S01
`/` | `src/app/(vault)/page.tsx` | S04 and most of the workspace screens, as internal states
`/[slug]` | `src/app/(public)/[slug]/page.tsx` | S18
`/p/[slug]` | `src/app/(public)/p/[slug]/page.tsx` | a permanent redirect, nothing else
`/pricing` | `src/app/(public)/pricing/page.tsx` | a placeholder
`/privacy` | `src/app/(public)/privacy/page.tsx` | a placeholder
`/refunds` | `src/app/(public)/refunds/page.tsx` | a placeholder
`/terms` | `src/app/(public)/terms/page.tsx` | a placeholder

**Twenty-six API routes**, grouped. Every one gates on `getActor()` except the auth endpoint itself,
and none has any check beyond that.

Group | Count | Routes
Auth | 1 | `/api/auth/[...nextauth]`
AI | 6 | `complete`, `generate-doc`, `link-doctor`, `refine`, `suggest-links`, `summarize`
Vault | 14 | `create`, `delete`, `file`, `folder`, `history`, `merge`, `raw/[...path]`, `rename`, `restore`, `search`, `snapshot`, `unlinked`, `upload`, `version`
Share | 3 | `share`, `share/conflicts`, and the commit endpoint `/api/commit`
Export | 2 | `export/pdf/[...path]`, `export/vault`

## 3. The thirty-eight screens

Screen | Verdict | Evidence | Divergence from the screen as specified
S01 Sign in | **built** | `src/app/(auth)/login/page.tsx`, and `src/app/(vault)/layout.tsx` renders `LoginScreen` when there is no actor | **Google sign-in is not wired.** `GoogleSignInButton` is exported from the auth barrel and called nowhere. The providers are GitHub and a **username and password form**, at `src/modules/auth/presentation/LoginScreen.tsx:141`, which the screen's own fine print says does not exist
S02 Home, first time | **not built** | No home route. `/` renders the workspace | The whole screen. Five ways to start, three tabs and the empty state have no code
S03 Home | **not built** | as S02 | The whole screen
S04 Workspace | **built** | `VaultWorkspace` renders a file tree, an editor pane and a right pane | The header mark reads `sg`, at `src/app/(vault)/layout.tsx:52`, where the screen specifies `fm`. There is no Ideas section in the tree and no Add idea control
S05 Doc mode | **not built** | `grep -rniE 'docMode|doc-mode|DocMode' src/` returns 0 | The whole mode, and the `MD` and `Doc` toggle the screens draw
S06 AI writing box | **partly** | `src/modules/ai-tools/presentation/SgnkAiButton.tsx`, a floating panel with a scope picker, five presets and a free-form prompt | It is a floating panel, not a box on an empty document. The screen's chips and the credit line have no code, because there are no credits
S07 AI edit | **partly** | `src/modules/editor/presentation/AIMenu.tsx`, plus `ai-suggestion.ts` and `test/editor/ai-suggestion.test.ts` | **Three verbs, not seven.** `AIMenu.tsx:25` declares `"refine" \| "summarize" \| "suggest-links"`. The screen specifies seven. The menu does not name the provider
S08 Custom blocks | **partly** | Mermaid is wired, 79 matches across `src/`. KaTeX is wired through `rehypeKatex` | **No chart block, no drawing block.** `grep -rniE 'fm-chart|excalidraw' src/` returns 0 for both
S09 Flow view | **not built** | `grep -rniE 'flowView|flow-view' src/` returns 0 | The whole view
S10 Problems | **not built** | `grep -rniE 'ProblemsPanel' src/` returns 0 | The whole panel, the five checks and the formatter
S11 Instruction files | **not built** | `grep -rniE 'HealthPanel' src/` returns 0 | The whole panel
S12 Ideas | **not built** | No ideas tab, no ideas list | The whole screen
S13 Idea mode, Low | **server only** | `/api/ai/generate-doc` and `src/modules/ai/application/doc-prompts.ts`, which holds five document kinds | **No interface calls it.** No question flow, no depth, no progress, no decisions file. The route takes an idea and returns a document in one step
S14 Idea mode, Medium and High | **not built** | as S13, and there are no depths | The whole screen
S15 Blueprint ready | **not built** | `grep -rniE 'blueprint' src/` returns 0 | The whole screen, the fifteen-file kit, the hash and the kickoff prompt
S16 The map | **built** | `GraphButton`, `KnowledgeUI`, `src/modules/graph/`, and a force-directed graph dependency | Not compared in detail
S17 Share | **partly** | `src/modules/share/presentation/ShareModal.tsx` and `ShareMenu.tsx`, plus `/api/share` | **No password on a link**, `grep -rniE 'linkPassword' src/` returns 0. **No expiry**, `grep -rniE 'expiry\|expiresAt' src/` returns 0. No roles, because there is one account
S18 Published page | **built** | `src/app/(public)/[slug]/page.tsx` and `PublicNoteView` | Its own header prints `/p/{slug}`, the legacy url, which now redirects. No markdown twin. And it runs under no enforced content policy, per `42-SECURITY-REVIEW.md` `SEC-001`
S19 Live collaboration | **not built** | `grep -rniE 'presence\|yjs\|liveblocks\|websocket' src/` returns 0 | The whole screen
S20 Document review | **not built** | `grep -rni "change.queue\|changeQueue" src/` returns 0 | **The whole screen, and it is one of the product's three load-bearing ideas**
S21 Document history | **built** | `src/modules/editor/presentation/HistoryModal.tsx`, `/api/vault/history`, `/api/vault/version` | The seven-day and ninety-day retention has no code, because there are no plans
S22 Import | **partly** | `src/modules/app-shell/presentation/ImportModal.tsx`, which posts files to `/api/vault/create` | **No named importers.** Obsidian, Notion, Google Docs and Word appear nowhere in the modal
S23 Connections | **not built** | `grep -rniE 'installation\|connections' src/` matches only a reserved-slug list and an auth comment | The whole screen. No GitHub App, no Drive sync
S24 Offline | **partly** | `PWARegister` registers `public/sw.js`. `src/modules/drafts/infrastructure/draft-store.ts` keeps drafts in browser storage | **There is no web app manifest.** `public/sw.js:83` special-cases `/manifest.webmanifest` and no such file exists at the application's root. So it cannot be installed
S25 Desktop app | **partly** | `TauriBridge`, `src-tauri/`, and six `tauri:*` scripts | **Not assessed.** `src-tauri/` was not opened in this session
S26 Quick capture | **not built** | `grep -rniE 'quickCapture\|quick-capture' src/` returns 0 | The whole screen
S27 Dark mode | **built** | `ThemeToggle`, `public/theme-init.js`, and a full `.dark` token set in `src/app/globals.css` | Five tokens fail their contrast threshold, per `46-ACCESSIBILITY-SPEC.md` section 3.4
S28 Settings | **built** | `src/modules/app-shell/presentation/SettingsModal.tsx` | Editor settings only. No account, no plan, no data controls
S29 Plan and usage | **not built** | `grep -rniE 'entitlement\|quota' src/` matches two storage comments | The whole screen. **No cap exists anywhere in the code**
S30 Portfolio | **not built** | `grep -rniE 'portfolio' src/` returns 0 | The whole screen
S31 Conflict | **partly** | `DuplicateConflictModal` handles a **slug** collision. A separate three-way merge exists: `merge-note.ts`, `merge3.ts` and `/api/vault/merge` | **The screen's conflict is not the built one.** S31 is two versions of a document changed while one was offline. The modal is two documents claiming one public slug. The merge path has no screen
S32 AI unavailable | **partly** | Every AI route returns `ai_failed` with 502, and `ghost-text.ts:141` cools down for 60 seconds on a rate limit | No screen. No provider list, no chips, no statement that nothing was charged, because nothing is charged
S33 Over the cap | **not built** | There are no caps | The whole screen
S34 Ideas, empty | **not built** | as S12 | The whole screen
S35 Configuration, plans and limits | **not built** | No configuration surface of any kind | The whole screen
S36 Configuration, models and providers | **not built** | The provider chain is assembled from environment variables at `src/modules/ai/infrastructure/gateway-client.ts:31` | The whole screen. **And the screen's central promise is false today**: it says a provider whose terms nobody opened cannot be switched on, and the code switches on whichever key is present
S37 Configuration, features and flags | **not built** | No flag system | The whole screen
S38 Configuration, accounts and usage | **not built** | One account, no usage record | The whole screen

## 4. The count

Verdict | Screens | Which
**built** | **9** | S01, S04, S16, S18, S21, S27, S28, and S07 and S17 are counted as partly below
**partly** | **9** | S06, S07, S08, S17, S22, S24, S25, S31, S32
**server only** | **1** | S13
**not built** | **19** | S02, S03, S05, S09, S10, S11, S12, S14, S15, S19, S20, S23, S26, S29, S30, S33, S34, S35, S36, S37, S38

**Corrected count, because the three lines above do not add to 38.** Recounted directly from section 3:

Verdict | Screens
built | 7. S01, S04, S16, S18, S21, S27, S28
partly | 9. S06, S07, S08, S17, S22, S24, S25, S31, S32
server only | 1. S13
not built | 21. S02, S03, S05, S09, S10, S11, S12, S14, S15, S19, S20, S23, S26, S29, S30, S33, S34, S35, S36, S37, S38

**7 plus 9 plus 1 plus 21 is 38.** The first table was wrong and is left above with the correction
beneath it, because the arithmetic error is exactly the kind this pack is supposed to catch and
hiding it would teach nobody anything.

**So: seven screens of thirty-eight work. Nine more partly work.** The built count is higher than the
eight page routes, as section 1.1 predicted, and a long way below 38.

## 5. The headline features

Straight from `docs/mvp0/SCREENS.md` section 1, which lists what is in the product by area.

Feature | Verdict | Evidence
Markdown editing, four modes | **built** | `EditorPane.tsx:163` declares Edit, Live, Reading and Split. Split is dropped at narrow widths, line 187
The twelve-button toolbar | **built** | `Toolbar.tsx`, with `toolbar-transforms.ts` and its test
Tabs | **built** | `editor-store.ts`, and `test/editor/editor-store.test.ts`
The rail: outline, tags, backlinks | **built** | `RightPane.tsx`, `Outline.tsx`, `Backlinks.tsx`, `UnlinkedMentions.tsx`
Comments in the rail | **not built** | Every `comment` match in `src/` is a code comment or a markdown parser term
Dark mode | **built** | S27 above
Wikilinks and the graph | **built** | `wikilink.ts`, `link-index.ts`, `src/modules/graph/`
Search | **built** | `SearchPanel`, `Spotlight`, `CommandPalette`, `search-index.ts`, `/api/vault/search`
Daily notes and templates | **built** | `daily-notes.ts`, `template-vars.ts`, and both have tests
Trash | **built** | `TrashModal.tsx`, `/api/vault/restore`, and a `_Trash/` prefix check
Export to PDF | **built** | `/api/export/pdf/[...path]`, headless Chromium, `pdf-doc.ts`, `print-css.ts`
Export the vault | **built** | `/api/export/vault`, `export-vault-zip.ts`, and its test
Publish a page | **built** | S18 above
Commit to GitHub | **built** | `/api/commit`, `github-writer.ts`, `CommitBar.tsx`
**The splice writer** | **built, and it refuses most foreign files** | `splice-frontmatter.ts`. `specs/engine/nf-001-zero-indent-sequence.md` measures the refusal rate at about 83 percent of the corpus
**The change queue** | **not built** | S20 above
**Agent tokens** | **not built** | `grep -rni "agent.token\|agentToken" src/` returns 0
**The certificate engine** | **built and unwired** | Thirteen files in `src/modules/mdmax/`, one symbol imported from outside. `44-TECH-DEBT-REGISTER.md` `TD-003`
Free and Pro, caps, billing | **not built** | No cap, no plan, no payment code
Live editing with three people | **not built** | S19 above
Ideas, blueprints, the kit | **not built** | S12 to S15 above
Doc mode, flow, slides, mind map, kanban | **not built** | S05 and S09 above; `grep -rniE 'slides\|kanban\|mindmap' src/` returns 0

## 6. Where invented data is shown

The application shows no invented data. **The screens do, throughout, and that is what a mockup is
for.** The risk is that a screen is read as a report, so the two most misleading cases are named here.

Case | Where | Why it is worth naming
**The provider telemetry on S32 and S36** | token counts, neuron counts, a reset time, a trial end date | These read exactly like a live readout. No such readout exists, and `42-SECURITY-REVIEW.md` `SEC-006` records that nothing measures any of it
**Every cost figure on S36 and S38** | per-call rupee amounts, a monthly spend, three ledger rows | There is no ledger. The numbers come from the plan's simulation, and the plan marks that simulation `SIMULATED`. The screen does not

**Two smaller ones**, recorded so a builder does not copy them into a fixture and forget:

- **Named people.** A collaborator and an invitee appear on S17, S19, S20, S29, S31 and S38 with a
  real-looking address. Any of them going into a seed fixture is a piece of personal data in a
  repository.
- **The kit hash and its unlisted link on S15.** The screen shows a truncated hash and instructs an
  agent to stop unless it prints that hash. Nothing produces either.

**One in the application, not the screens.** `src/container/dependency-container.ts:42` hard-codes a
personal name and email as the author of every commit the product makes. That is not invented data; it
is one person's real data standing in for whoever is signed in. `44-TECH-DEBT-REGISTER.md` `TD-015`.

## 7. What to read next

Question | File
Why do the gates not hold | `40-TESTING-STRATEGY.md` section 6, and `44-TECH-DEBT-REGISTER.md` `TD-023`
What is unsafe today | `42-SECURITY-REVIEW.md` sections 3a and 3
What is wrong with the screens themselves | `45-UX-AUDIT.md`
What each small fix is | `44-TECH-DEBT-REGISTER.md` section 13
How far from a paying product | `48-PRODUCT-MATURITY.md`

## 8. Limits of this file

**What was not assessed.**

- **The desktop build.** `src-tauri/` was not opened, so S25 is `partly` on the strength of a bridge
  component and six scripts. It could be better or worse than that.
- **Whether any built screen matches its specification.** The `Divergence` column carries what was
  noticed while reading for existence. **It is not a comparison.** A screen-by-screen diff against
  `docs/mvp0/SCREENS.md` is a separate pass and nobody has done it.
- **Whether any built screen works.** Nothing was run. No page was driven, no interaction was
  performed, no deployment was inspected. Every `built` means reachable in the source.
- **Quality of the built parts.** A row says a thing exists. `48-PRODUCT-MATURITY.md` is where the
  question of whether it is good enough is asked.
- **The `decisions/` site**, which has its own deployment and its own tooling.
- **Test coverage per screen.** Some built screens have tests and some do not, and this file does not
  say which.

**What could not be verified.**

- **Every `not built` verdict rests on a grep over `src/`.** A feature implemented under a name nobody
  guessed would be missed. The greps are in the rows so they can be re-run and argued with, and that
  is the whole defence.
- **S31.** The distinction between the slug conflict that is built and the merge conflict the screen
  specifies is a reading of both, not a test of either.
- **S24.** The service worker exists and the manifest does not. Whether the application is installable
  by some other route was not checked.

**What would falsify this file.**

- Any grep in section 3 returning a real match, which moves a row.
- A new `page.tsx`, which changes section 2 and probably section 4.
- `docs/mvp0/SCREENS.md` gaining or losing a screen, which changes the denominator. **Re-run
  `grep -c '^### S' docs/mvp0/SCREENS.md` before quoting 38.**
- Anybody driving the deployed application and finding a screen this file calls built that does not
  work. That is the most likely way this file is wrong, and it is the check nobody has run.
