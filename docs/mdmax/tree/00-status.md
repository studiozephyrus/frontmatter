---
mdmax: 1
section: 0
title: "Status — read this before acting on any instruction below"
slug: 00-status
lines: 86
words: 1001
forward_links: [1, 3, 8, 9, 10, 11, 12]
backlinks: [1, 2, 3, 4, 7, 8, 9, 11, 12, 13, 14]
prev: null
next: 01-orientation
---

[← Index](README.md) · [§1 Orientation →](01-orientation.md)

## 0. Status — read this before acting on any instruction below

**As of 2026-08-02, HEAD `dc92aaf`.** Sections 1–14 were written on 2026-08-01 and describe the
codebase as it was then. Work has landed since. **Where this section and a later section disagree,
this section governs.** It exists because an end-to-end verification found 32 blocking defects,
and most of them were instructions that would send a builder to redo finished work.

### 0.1 What has shipped since the plan was written

| | state on 2026-08-01 | state now | evidence |
|---|---|---|---|
| **Splice writer** | did not exist | **shipped** — `src/modules/share/domain/splice-frontmatter.ts` | commit `4f97129` |
| **Violation 1** (`share-writer.ts` calls `matter.stringify`) | live data-loss bug | **FIXED** — the call no longer exists | `grep -c matter.stringify src/modules/share/infrastructure/share-writer.ts` → 0 |
| **Violation 2** (`PropertiesPanel` re-emits the whole block) | live data-loss bug | **STILL LIVE** — `PropertiesPanel.tsx:79` → `EditorPane.tsx:498` → `saveDraft` | measured 114/907 byte-identical |
| **The corpus gate** | did not exist | **shipped** — `test/share/frontmatter-splice.test.ts`, 12 tests | `4f97129`, `dc92aaf` |
| **The independent oracle** | did not exist | **shipped and runnable** — `scripts/fm-roundtrip-audit.mjs` | `dc92aaf` |
| **vitest worktree exclude** | 247 files / 3,484 collected, 66.4% duplicates | **FIXED** — 84 files / 1,258 tests | `vitest.config.ts` |
| **`npm run typecheck`** | 5 errors | **0 errors** | `@types/jsdom@^28.0.3` added |
| **`npm run lint`** | 930 errors, linting nothing | **0 errors** | `.claude/**` + `.scratch-*` ignored |
| **`npm run verify`** | died at step 1 | **GREEN end to end** | typecheck · lint · 84/1258 · build · arch `"violations": []` |

### 0.2 Numbers that changed, and one that was wrong

The round-trip measurement over `corpus_id sha256:3a010b16…` (907 files carrying frontmatter):

| implementation | byte-identical | changed | threw | **silently refused** |
|---|---|---|---|---|
| `gray-matter` — what shipped before `4f97129` | 33 (3.64%) | 703 | 171 | 0 |
| `yaml` Document — **what `PropertiesPanel` still uses** | **114 (12.57%)** | 623 | 0 | **170 (18.74%)** |
| byte-range splice — shipped | **907 (100%)** | 0 | 0 | **0** |

> **A correction.** An earlier run of this measurement reported the `yaml` path at **284/907
> (31.31%)**. That was wrong. The oracle's refusal branch was unreachable — it tested
> `published === src && back === src` *after* `back === src` had already matched — so **170 files
> where the write never happened at all were counted as successful round trips.** The honest figure
> is 114 genuine round trips and 170 silent refusals. Fixed in `dc92aaf`. The splice writer's
> 907/907 was re-verified after the fix and is unaffected: every one of the 907 genuinely published
> before being restored, with zero refusals.

### 0.3 Instructions in this document that are now WRONG — do not follow them

1. **§3.1.4 "Violation 1"** — tells a builder to remove a `matter.stringify` call. It is already
   gone, and the header comment it calls a lie is now accurate.
2. **§11.4 (step 2)** — the whole step shipped in `4f97129`, to `share/domain`, not `mdmax/domain`.
3. **§11.16 Monday 09:30 and Tuesday 09:00** — both schedule completed work.
4. **§11.4.2's `node.range` instruction** — it tells the builder to locate the splice range using
   `yaml`, **the library that fails on the exact 170 files the step exists to make writable.** It
   contradicts §10.6.5 and caps the result at 737/907. The shipped writer does not parse at all,
   which is why it reaches 907/907. **Ignore this instruction; it would replace a working writer
   with a worse one.**
5. **§11.2.1's step-0 gate** — an equality pin on a file count, which §9.11 (LR#66) forbids by
   name. The count is 84, not 83. **Assert a floor and a hard zero on worktree files, never an
   equality.**

### 0.4 Still open, and still blocking

- **Violation 2 is not fixed.** `PropertiesPanel.tsx:79` calls `stringifyFrontmatterDoc`, whose
  output flows to `handleEdit` → `setContent` + `saveDraft` → the next commit. **Editing one
  property rewrites the whole block, at 12.57% byte-identical.** This is the next task.
- **§10 is entirely unscheduled in §11**, while §10.10.2 says the offset model and the freezing of
  `normalize()` and the slugger must land **before** the splice writer's second caller. Insert them
  ahead of any further engine work — retrofitting branded types across call sites is a refactor,
  and changing `normalize()` after an anchor is persisted silently detaches every comment.
- **`gate.mjs` is used on Tuesday and ported on Thursday** in §11.16. Re-sequence.
- **There is no CI.** `.github/` does not exist, yet §10.8 has three "build fails" rows and §8
  makes continuous byte-fidelity CI the one asset a competitor cannot copy. Either build it or
  strike the word "blocking" everywhere it appears.
- **The export contract is DECIDED in §1.5 and OPEN in §12.1.1 and §11.14.** A builder reading §1
  will treat the format as settled. **This needs a founder decision, not an edit.**
- **OAuth requests scope `read:user`** (`auth-options.ts:29`), which grants no repository access,
  so §11 task 1d cannot be implemented as written. Decide `repo` versus a GitHub App — the latter
  carries external lead time that appears in no estimate.

### 0.5 The gate discipline that was missing, and now is not

Two defects in the gate itself were found by verification and fixed in `dc92aaf`:

- **The oracle could not run.** It imported a `.mjs` path for a file that is `.ts`. The 907/907
  figure had no executable derivation — a violation of this plan's own rule P2.
- **The gate passed without seeing the corpus.** Without the two private vaults it silently ran on
  23 in-repo files and printed `23/23 identical (100.00%)`. On CI, a fresh clone, or a second
  developer's machine it was theatre. It now asserts a denominator of 907 and fails loudly.

> **A gate that shrinks its own population is a gate that always passes.** That belongs in §11's
> working practices, and it is now rule P12.

---

---

### Links

**This section references:** [§1 Orientation](01-orientation.md) · [§3 Capabilities](03-capabilities.md) · [§8 Market](08-market.md) · [§9 AIOS](09-aios.md) · [§10 Engine spec](10-engine-spec.md) · [§11 Execution](11-execution.md) · [§12 Risks](12-risks.md)

**Referenced by:** [§1 Orientation](01-orientation.md) · [§2 Chronology](02-chronology.md) · [§3 Capabilities](03-capabilities.md) · [§4 Representation](04-representation.md) · [§7 Product](07-product.md) · [§8 Market](08-market.md) · [§9 AIOS](09-aios.md) · [§11 Execution](11-execution.md) · [§12 Risks](12-risks.md) · [§13 Appendix](13-appendix.md) · [§14 Verification](14-verification.md)

[← Index](README.md)
