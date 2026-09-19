---
spec: 1
id: app-shell/home
title: Home, first run and returning, five ways to start and a list that never reads bytes
type: surface
state: draft
prd_file: docs/mvp0/PRODUCT-PLAN.md
prd_sha256: "da29fced004ca1c5d85efc8f5911a2861debd5cae28e793b27eb9ed23cc79a6e"
prd_sections: ["4", "5", "16"]
governs:
  - src/app/(vault)/page.tsx
verify:
  - node specs/harness/spec-report.mjs --id app-shell/home
  - npx vitest run test/app-shell
depends_on: [auth/session, entitlements/limits-for, data/storage-adapters]
screens: [S02, S03]
refusals: [E044, E106]
red_proof: test/app-shell/home/no-bytes-read.test.ts
budget: 3000
owner: sagnik
updated: 2026-09-20
commit: 6c44319
x:
  batch: 2
  features: [F105, F106, F107]
  acceptance: [A007, A513, A514, A515, A516, A517, A518, A519, A520, A521, A522, A523, A524, A525]
  governs_planned:
    - src/modules/app-shell/presentation/home/**
    - test/app-shell/home/**
  screen_spec_pointers: "S02 names app-shell/home-first-run and S03 names app-shell/home; both are folded into this lane, because the only switch between them is the document count"
  founder_dependencies:
    - "S02 D07, resolved as proposed on 18 Sep: one live collaborator in the caps line"
    - "S02 D08, resolved as proposed: the phone drops the template card"
    - "S03 D09, resolved as proposed: six recent rows on desktop, five on the phone"
    - "S03 D10, resolved as proposed: recent spans every project the person can open"
---

# Home

## Contract

`/` for a signed-in person is home. **The document count is the only switch**: zero documents
renders S02, the first run, and one or more renders S03, the returning view. S02 offers five ways to
start: blank document, from an idea, import, from GitHub and a template. It states the free caps
once, from `limitsFor(account)`. It also says plainly that a folder can be dropped anywhere on the
page. S03 puts the most recently opened document first. It shows three tabs with counts, and a usage
pill that links to S29. Home reads metadata only, never a document's bytes, and it never waits for any one
count before the rest of the page works. There is no tour, no coach mark and no step before the
start cards are usable.

## Invariants

| # | Rule | Failure mode | Executable check |
|---|---|---|---|
| 1 | Zero documents renders S02 and not S03; the first document switches to S03 on the next load | A person with documents is shown an empty state, or the reverse | `T513` (A513), `T519` (A519) |
| 2 | No modal, overlay or coach mark on a first-time account's home | A welcome modal is how a tour arrives | `T106` (A007) |
| 3 | Exactly five start cards at 1,440 px, one carrying the accent; four at 390 px, the template card dropped, no horizontal scroll | The phone scrolls sideways, or a card disappears by list slicing rather than decision | `T514` (A514), `T515` (A515) |
| 4 | Focus lands on the first start card | A keyboard user starts on the page body | `T518` (A518) |
| 5 | The caps line reads `limitsFor(account)`; on the seeded Free row the collaborator figure is 1 | A number typed into a copy string that the panel can never move | `T517` (A517) |
| 6 | The recent list is ordered by opened time and its first row is the last document opened | Sorted by modified time and labelled Opened | `T520` (A520) |
| 7 | A slow count never blocks the list: with the ideas count delayed 10 s, the first recent row is clickable | One slow read freezes home | `T522` (A522) |
| 8 | No row action removes a document from both the store and the trash; the only removing action moves it to trash | A one-click permanent delete from a list row | `T523` (A523) |
| 9 | With 200 documents, zero object reads for document bytes are made, counted at the storage adapter's log | Home gets slower as the vault grows | `T525` (A525) |
| 10 | The usage pill is absent on Pro and on the desktop build | A cap shown where none applies | `T521` (A521) |
| 11 | At 390 px project and owner sit in the row's subline with no horizontal scroll | The phone list overflows | `T524` (A524) |
| 12 | A folder dropped anywhere on S02 starts an import job and opens the import panel | The drop words promise something the page ignores | `T516` (A516); not checkable until the import lane exists |

## Interface

- Route: `src/app/(vault)/page.tsx`, which today renders `<AppShell />`, the GitHub-backed editor.
  Home replaces it at `/`; the editor moves to its own route with batch 3.
- Guard: `(vault)/layout.tsx` calls `getActor()` from `auth/session`.
- Ports named by S02 and S03, none built: `WorkspaceReader.countDocuments()`,
  `WorkspaceReader.listRecent(limit)`, `EntitlementsReader.forAccount()`, `IdeaReader.count()`,
  `ShareReader.countSharedWithMe()`, `DocumentWriter.create()`, `ImportService.beginImport()`,
  `TemplateReader.list()`.
- Recent rows come from Firestore document records through `data/storage-adapters`, never from R2.
- Icons on the cards: Material Symbols as inline SVG. Greeting time comes from the device clock
  (`18-FIRST-RUN-AND-EMPTY.md` section 12, resolved as proposed).

## Refusals

- **A start card whose destination is not built yet is refused as a half flow.** `INFERENCE:` the
  card still renders, so the five-card layout holds. It answers with the explanation copy, never a
  404 and never a fake screen, which is the rule the flag gate follows (A717). Blank document needs
  S04 (batch 3). From an idea needs batch 6; import and from GitHub need batch 5.
- **Reading document bytes to render any part of home is refused.**
- **A permanent delete from a row is refused.** Trash, 30 days, nothing faster.
- **A cap figure from any source but `limitsFor` is refused**, and the desktop build shows no cap.

## Red proof

`test/app-shell/home/no-bytes-read.test.ts` (not yet written) renders S03 over 200 seeded document
records with the storage adapter's request log attached and asserts zero byte reads. It must
**fail** against a list that fetches each document to derive its title. Invariant 7's test must fail
against a home that awaits all three counts with one `Promise.all`.

## Verification

- `npx vitest run test/app-shell` runs today over the existing app-shell tests; the home tests are
  added under `test/app-shell/home/`.
- Layout checks at 390 px and 1,440 px run in a real browser against the deployment.

<!-- SPEC:DRIFT:START -->
generated: never
<!-- SPEC:DRIFT:END -->

## Decisions

- 2026-09-20: S02 and S03 are one lane. They share one route, one switch and one data contract.

## Open

- Whether the cards whose destinations are unbuilt should render at all in batch 2 is a founder call
  on how the batch looks in the use window. The lane is written to render them with an explanation.

## Next

    node specs/harness/spec-report.mjs --id app-shell/home
    npx vitest run test/app-shell
