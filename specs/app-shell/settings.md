---
spec: 1
id: app-shell/settings
title: Account settings, ten sections that follow the person across devices and never write a cap
type: surface
state: draft
prd_file: docs/mvp0/PRODUCT-PLAN.md
prd_sha256: "da29fced004ca1c5d85efc8f5911a2861debd5cae28e793b27eb9ed23cc79a6e"
prd_sections: ["5", "18", "30"]
governs:
  - src/modules/app-shell/presentation/SettingsModal.tsx
verify:
  - node specs/harness/spec-report.mjs --id app-shell/settings
  - npx vitest run test/app-shell
depends_on: [auth/session, entitlements/limits-for, data/storage-adapters, drafts/legacy-migration]
screens: [S28]
refusals: [E044, E106, E109]
red_proof: test/app-shell/settings/no-config-writes.test.ts
budget: 2800
owner: sagnik
updated: 2026-09-20
commit: 6c44319
x:
  batch: 2
  features: [F108]
  acceptance: [A663, A664, A665, A666, A667]
  governs_planned:
    - src/modules/app-shell/presentation/settings/**
    - test/app-shell/settings/**
  founder_dependencies:
    - "The synced preference record is not in 21-DATA-MODEL.md. A664 needs one; its path is a proposal until that file adopts it"
---

# Account settings

## Contract

`/settings/<slug>` holds ten sections, Account to Plan and usage, each reachable by its slug and by
its nav row (S28). A preference changed on one device is read by every device the person signs in
on. Controls move when clicked and the write follows; nothing needs a restart. **Settings reads
limits and never writes them**: caps come from `limitsFor(account)`, and the only writer is the
configuration panel. Local editor preferences keep their legacy `sgnk-md-editor-settings` key, which
moves only behind a real migration. Ghost text starts off.

## Invariants

| # | Rule | Failure mode | Executable check |
|---|---|---|---|
| 1 | All ten slugs answer 200 and every nav entry reaches its section; an unknown slug falls back to Account with `E044` | A deep link to a section 404s | `T663` (A663) |
| 2 | A toggle changed on device one is read by device one after reload and by device two after sign-in | Preferences that live only in one browser | `T664` (A664) |
| 3 | Offline, every local preference still changes; every network-bound row carries `aria-disabled="true"` with a reason | Settings freezes offline, or a network row pretends to save | `T665` (A665) |
| 4 | Every control used, zero writes reach the configuration store, counted at its adapter | A second writer of limits appears in the one surface a person can reach | `T666` (A666) |
| 5 | Delete account needs the exact typed text; the wrong text leaves the account in place | A mistyped confirmation deletes everything | `T667` (A667) |
| 6 | `aiGhostText` defaults to false and its row says what it sends | The one switch that sends text unasked is on by default | `test/app-shell/settings/ghost-text-off.test.ts` |
| 7 | The `sgnk-md-editor-settings` key name is unchanged | Every person's local settings are silently orphaned | `T642` (A642), owned by `drafts/legacy-migration` |

## Interface

- Today: `src/modules/app-shell/presentation/SettingsModal.tsx`, a modal, and
  `src/modules/editor/presentation/editor-settings.ts`, a Zustand store persisted under
  `name: "sgnk-md-editor-settings"` with five booleans.
- Ports named by S28, none built: `AccountReader.get()`, `AccountWriter.rename(name)`,
  `AccountPreferencesReader.all()`, `AccountPreferencesWriter.set(key, value)`,
  `LimitsReader.forAccount()`, `ConnectionReader.list()`, `ExportWriter.requestAccountExport()`.
- Synced preferences: `INFERENCE:` a small record under the account in Firestore, written one key at
  a time, debounced once a second, owner read and write only. Its path waits for
  `21-DATA-MODEL.md`.
- Account deletion: the server walk of `21-DATA-MODEL.md` section 21.10, connections revoked at the
  provider first. The client never deletes records itself.

## Refusals

- **Writing a limit, a plan or a flag from settings is refused.** A second writer is a defect.
- **Renaming a persistence key without a migration is refused.**
- **A client-side account delete is refused**; only the server walk deletes.
- **A setting that needs a reload is refused as a defect**, not documented as a caveat.

## Red proof

`test/app-shell/settings/no-config-writes.test.ts` (not yet written) drives every control with the
configuration adapter's write counter attached and asserts zero. It must **fail** against a Plan and
usage section that saves a changed value through the panel's writer. Invariant 5's test must fail
against a confirmation that compares case-insensitively or by prefix.

## Verification

- `npx vitest run test/app-shell` runs today; the settings tests join under
  `test/app-shell/settings/`.
- A664 needs two browsers signed in to one account; it runs against the deployment.

<!-- SPEC:DRIFT:START -->
generated: never
<!-- SPEC:DRIFT:END -->

## Decisions

- 2026-09-20: the modal becomes a routed page so each section has a slug that answers 200.

## Open

- Which sections render in batch 2 when their feature is later (Connections is batch 5, Sharing is
  batch 4). `INFERENCE:` they render with the explanation copy, as home's unbuilt start cards do.

## Next

    node specs/harness/spec-report.mjs --id app-shell/settings
    npx vitest run test/app-shell
