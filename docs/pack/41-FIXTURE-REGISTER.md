---
id: 41-FIXTURE-REGISTER
title: Fixture register
mode: reference
tier: canonical
status: living
verified_against: 6271499
updated: 2026-09-18
owner: sagnik
covers: [fixtures]
---

# 41. Fixture register

Every fixture a spec depends on, what it is, where it came from, what it proves, and which engine
refusal it reproduces.

**The gap this file closes.** The fixtures exist and the index does not. Before this page a reader
had to open four spec files and two test files to learn that the 8,513-file corpus contains zero
examples of the fault NF-3 describes, and that seven fixtures the render spec names have never been
written.

## 1. How to read a row

Column | Meaning
**Id** | This register's id. Stable, never reused.
**Kind** | `corpus` for third-party bytes, `synthetic` for a hand-built document, `golden` for a pinned input and output set
**Lives at** | The path. `inline` means it is a constant in the test file, at the line given
**Provenance** | Where the bytes came from. A URL and a commit for corpus rows
**Proves** | The invariant, by spec and number
**Refusal** | The engine refusal id it reproduces, or `none` when the fixture is a control
**State** | `present` or `missing`

**Refusal ids** follow `65-CONVENTIONS.md` section 3: `nf-` plus three digits plus a slug, homed in
`specs/engine/`. Four defect ids are named across the specs. Counted with
`grep -rno "NF-[0-9]" specs/ | sort | uniq -c`: NF-1 eleven times, NF-2 four, NF-3 fifteen, NF-4 five.
**Only NF-1 and NF-3 have a spec file, and only those two have a fixture.**

## 2. The foreign corpus

One fixture, seven sources. It is the standing gate for `engine/splice-writer` and
`engine/nf-001-zero-indent-sequence`, and it is the only cross-author fidelity evidence the product
has.

Property | Value
Id | `FX-001`
Kind | corpus
Lives at | `test/corpus/foreign/_vendor/`, reconstructed by `node scripts/corpus-foreign.mjs fetch`
Index | `test/corpus/foreign/SOURCES.json`
Hashes | `test/corpus/foreign/MANIFEST.sha256`, one sha256 and byte count per path
Pinned on | 2026-08-29
Files | 8,513 markdown files
Bytes | 19,047,891
In git | **No.** Third-party material under its own licences. `_vendor/` is gitignored
Verify | `npm run corpus`, exits 1 on one changed byte
State | present, verified clean 2026-09-18

### The seven vaults

Every row is read from `test/corpus/foreign/SOURCES.json`. The counts sum to 8,513, checked in this
session.

Name | Remote | Commit | Committed | Markdown files | Bytes
`CyanVoxel_Obsidian-Vault-Template` | `https://github.com/CyanVoxel/Obsidian-Vault-Template` | `9277193c6b5b` | 2024-04-13 | 19 | 31,690
`community-archive_obsidian-hub` | `https://github.com/community-archive/obsidian-hub` | `b11036f9a4db` | 2026-06-02 | 6,586 | 14,772,305
`erazlogo_obsidian-history-vault` | `https://github.com/erazlogo/obsidian-history-vault` | `a3d22d0a9ecf` | 2023-05-27 | 40 | 30,997
`kepano_kepano-obsidian` | `https://github.com/kepano/kepano-obsidian` | `473697347a0e` | 2026-01-08 | 103 | 35,993
`oldwinter__knowledge-garden` | `https://github.com/oldwinter/knowledge-garden` | `2ad252e3820b` | 2025-09-05 | 961 | 2,578,432
`quanru_obsidian-example-lifeos` | `https://github.com/quanru/obsidian-example-lifeos` | `80fb5649d608` | 2026-04-14 | 540 | 1,215,109
`s-blu_obsidian_dataview_example_vault` | `https://github.com/s-blu/obsidian_dataview_example_vault` | `dfc8022fcc99` | 2025-07-11 | 264 | 383,365

**One vault is 77 percent of the corpus.** 6,586 of 8,513 files come from `obsidian-hub`. Any
distribution this corpus reports is mostly that one community's house style, and a claim about
"foreign vaults" generally should say so.

### What the corpus contains, and what it does not

Measured over all 8,513 files and recorded at `specs/engine/nf-003-bare-cr-fence.md:98`:

Shape | Files | Consequence for the register
Opening fence ended by a line feed | 7,969 | the only fence shape the corpus can exercise
Opening fence ended by carriage return plus line feed | 0 | no corpus row reproduces it
Opening fence ended by a bare carriage return | 0 | **NF-3 needs a synthetic fixture**
Files carrying a byte-order mark | 0 | the already-shipped byte-order-mark fix has no corpus guard

**And a number that has not been reconciled.** The same spec records that the corpus holds 7,969
files with a line-feed fence while the older product requirements document reports 7,959
frontmatter-bearing files. The spec calls the ten-file difference probably definitional, a leading
`---` that is a thematic break rather than frontmatter, and says to reconcile the definition before
either number is published. It has not been reconciled. **Do not publish either figure yet.**

## 3. Synthetic fixtures, NF-1

All four are inline constants in `test/corpus/foreign/nf-001-red-proof.test.ts`. The defect is that a
YAML block sequence written at column zero makes the writer refuse the whole file.

Id | Constant | Line | Bytes, as written | Proves | Refusal | State
`FX-010` | `ZERO_INDENT` | 38 | `"---\ntags:\n- alpha\n- beta\ntitle: Note\n---\nBody text.\n"` | invariants 1, 2 and 3 of the spec: a set must succeed, every other byte survives, an existing key updates in place | `nf-001-zero-indent-sequence` | present
`FX-011` | `INDENTED` | 41 | `"---\ntags:\n  - alpha\n  - beta\ntitle: Note\n---\nBody text.\n"` | the control. The same document with a two-space indent, which works today, so a failure on `FX-010` is the indent and nothing else | none | present
`FX-012` | `scalarDoc` | 82 | `"---\njust a bare scalar\n---\nBody.\n"` | refusal is still correct for a document that genuinely is not a map. The fix must narrow the refusal, not remove it | `nf-001-zero-indent-sequence`, the negative case | present
`FX-013` | `directive` | 85 | `"---\n%YAML 1.2\ntitle: Note\n---\nBody.\n"` | a YAML directive at top level is still refused | `nf-001-zero-indent-sequence`, the negative case | present

**Why a fixture and the corpus, not one or the other.** The test file says it at
`test/corpus/foreign/nf-001-red-proof.test.ts:26`: the fixture
proves the mechanism deterministically and in one line, the corpus assertion proves the scale, and
scale is the reason this defect is ranked first. Neither alone is the proof.

**The scale figure, and how to read it.** The red proof pins 6,613 refusals caused by NF-1 against
7,969 frontmatter-bearing files, and asserts the share falls between 0.82 and 0.84. That pin is a
guard against the spec and the requirements document drifting apart, **not** a behavioural assertion.
The live count comes from `scripts/corpus-foreign.mjs`.

## 4. Synthetic fixtures, NF-3

All three are inline constants in `test/corpus/foreign/nf-003-red-proof.test.ts`. The defect is that a
frontmatter fence ending in a bare carriage return is not recognised, so the writer prepends a second
frontmatter block and the document ends up with two.

Id | Constant | Line | Bytes, as written | Proves | Refusal | State
`FX-020` | `BARE_CR` | 33 | `"---\rtitle: Note\rtags: [alpha]\r---\rBody text.\r"` | invariants 2 and 4: a set produces exactly one frontmatter block, and a bare-carriage-return file stays bare carriage return | `nf-003-bare-cr-fence` | present
`FX-021` | `lf` | 75 | `"---\ntitle: Note\n---\nBody.\n"` | the line-feed fence is unaffected. The fix must not touch it | none | present
`FX-022` | `crlf` | 76 | `"---\r\ntitle: Note\r\n---\r\nBody.\r\n"` | the Windows fence is unaffected, and stays Windows | none | present

**`FX-020` is guarded by a guard.** The first test in the file asserts the fixture contains no line
feed and carries exactly two fence lines. Without it, a stray line feed introduced during an edit
would make every assertion below it prove nothing. Any new synthetic fixture should carry the same
shape of self-check.

**This fixture exists because the corpus cannot do the job.** The spec is explicit at
`specs/engine/nf-003-bare-cr-fence.md:111`:

```
- The red proof is a hand-built bare-CR fixture, not a corpus file.
```

## 5. The golden input set

Id | Value
Id | `FX-030`
Kind | golden
Lives at | `test/mdmax/fixtures/pure-function-golden.json`
Size | 17,075 bytes
Generator | `scripts/gen-golden-cases.py`, which the file names in its own `generator` field
Read by | `test/mdmax/pure-functions.test.ts:30`
Governs | `normalize/1` and `slug/1` in `src/modules/mdmax/domain/`
Refusal | none. This is an output-stability pin, not a refusal fixture
State | present

**Rule: append-only.** The script says so in its own docstring at `scripts/gen-golden-cases.py:5`.
Removing or editing a case moves the digest and is indistinguishable from a regression in the
functions themselves.

**Contents, counted in this session with `json.load`:** 200 cases, and the `count` field says 200.

Category | Cases
`generated` | 58
`punctuation` | 28
`edge` | 27
`whitespace` | 20
`unicode` | 15
`non-bmp` | 11
`ascii` | 10
`scripts` | 10
`inline-md` | 10
`dedup` | 6
`combining` | 5

**Two digests are pinned**, read from `test/mdmax/pure-functions.test.ts`:

Function | Version constant | Digest
`normalize` | `mdmax/normalize@1` | `a95ba399c4ff3ffc3a7007ee888b71bdfd4396d69b01612bab2268e97c31f439`
`slug` | `mdmax/slug@1` | `9e186b68456415f2f9d0a7fc86554d0b2495d96f077e0fd682b20a057af4a794`

**Why the digest is a pin and not a convenience.** These two functions are the hash input for every
stored anchor. If their output moves, every anchor already on disk silently re-keys and every comment
hung off one detaches, with nothing to announce it. So the correct response to a failing digest is
never to update the digest. Bump the version constant, then update the digest, then treat every
persisted anchor as needing migration.

**The fixture guards itself**, which is the pattern worth copying. Two tests assert that the case
count has not shrunk below 200 and that six named categories are still covered, so a fixture edit
that removed the hard cases would fail before the digest did.

**Invisible characters are written as escapes, never as literals**, so the file stays reviewable in a
terminal and in a diff. That is the generator's own stated rule.

## 6. Fixtures a spec names that do not exist

`specs/render/carrier.md` names seven test files as the executable checks for its eight invariants.
**None of them exists.** `ls -d test/render` returns `No such file or directory`, and each path was
checked individually in this session.

Id | Path a spec names | Invariant it would prove | State
`FX-040` | `test/render/carrier/callout-has-no-closer.test.ts` | invariant 1: a prose profile uses the callout, which has no closing marker to lose | **missing**
`FX-041` | `test/render/carrier/fence-atomic-splice.test.ts` | invariant 2: an opaque profile's fence pair is spliced atomically. **This one is named as the spec's red proof** | **missing**
`FX-042` | `test/render/carrier/namespace.test.ts` | invariant 3: a non-standard callout kind is namespaced `fm-` | **missing**
`FX-043` | `test/render/carrier/degrade.test.ts` | invariant 4: an unknown payload degrades, never throws and never disappears | **missing**
`FX-044` | `test/render/carrier/title-survives.test.ts` | invariant 5: a title is a heading inside the container, never an attribute | **missing**
`FX-045` | `test/render/carrier/directive-normalise.test.ts` | invariant 6: a pasted directive is accepted on input and normalised on save | **missing**
`FX-046` | `test/render/carrier/tilde-fence.test.ts` | invariant 8: a payload that may contain backticks uses a tilde fence | **missing**

**Invariant 7** of that spec, no inline profile mechanism in v1, is checked by an absence check in
`spec-report.mjs` rather than by a fixture.

**`npm run spec` reports 0 errors and 0 warnings over this spec.** The harness checks that the file
it `governs` exists. It does not check that the files an invariant names as its executable check
exist. That is the single most useful thing to add to the harness, and it is recorded as a debt item
in `44-TECH-DEBT-REGISTER.md`.

**One of the seven is a red proof**, `FX-041`. Per `AGENTS.md:10` a lane is not done without one, so
the render carrier lane cannot reach `verified` until it is written, and it must be seen to fail
against a splice that treats the open fence independently of its closer.

## 7. Defect ids with no spec and no fixture

Both are named in `specs/engine/splice-writer.md` and in `specs/engine/nf-001-zero-indent-sequence.md`
as siblings that share a file and nothing else.

Id | What it is | Severity given | Spec | Fixture
NF-2 | A flow-sequence close bracket at column zero, `tags:\n- a\n]`, is still refused after the NF-1 fix | availability | **none** | **none**
NF-4 | `SAFE_KEY = /^[A-Za-z0-9_.$-]+$/` excludes a space, so a key like `date created` is unaddressable | availability, and it blocks the writer's third seam | **none** | **none**

**NF-4 carries an open question that blocks work, not just a missing test.** From
`specs/engine/splice-writer.md`, the question is whether an accented word in one Unicode
normalisation form should address the same key as the same word in another form. Both answers are
defensible, and the source file's own comment flags it. A fixture cannot be written before the
question is answered, because the fixture would encode the answer.

**Proposed answer**, `resolved (proposed 18 Sep, founder review)`: **keys are equal only when their
bytes are equal.** `café` in NFC and `café` in NFD are two keys. A lookup that matches no key by
bytes but matches one after NFC normalisation is **refused, with the near-match named**, and nothing
is written. Reason: splice-only writing replaces exact bytes, and a normalised match is a guess
about which bytes were meant. Rejected: NFC equality, which is friendlier and would let a write land
on a key the caller did not spell. With this answer, the NF-4 fixture can be written: one file
holding both forms, one lookup per form, and one lookup that must refuse.

## 8. How to add a fixture

The rules below are taken from the two red proofs and from `AGENTS.md:10`, not invented here.

1. **Write the fixture and the assertion before the fix.** Assert the correct behaviour and mark it
   `it.fails`, so it passes today by failing.
2. **Make it fail against the unfixed code, and say that you saw it fail.** If you cannot, the test
   does not cover the bug. Record that rather than reporting a pass.
3. **Guard the fixture.** One test that asserts the fixture still has the property it is built
   around. `FX-020` and `FX-030` both do this.
4. **Assert on each operation independently.** Never only on a round trip. Two operations that share
   a defect cancel it out, which is exactly how NF-3 stayed invisible.
5. **Assert a floor and a hard zero, never an equality.** Adding coverage must never read as a
   regression. The specs state this twice.
6. **Add a row here**, with a new id. Ids are never reused and never renumbered.
7. **If the fixture is third-party bytes**, pin the upstream commit in `SOURCES.json` and the bytes in
   `MANIFEST.sha256`. A corpus you cannot re-derive byte for byte is not evidence.

## 9. Limits of this file

**What was not assessed.**

- **Fixture-like constants in the other 98 test files.** Many tests declare inline sample documents.
  They are test data, not fixtures a spec depends on, and they are out of this register's scope.
  `test/preview/html-policy-xss.test.ts` is the one worth promoting, because it is the only evidence
  for a security control, and no spec claims it.
- **Whether each fixture's bytes are correct.** A fixture that encodes a wrong expectation passes
  forever. Nothing here re-derives what the correct output should be.
- **The corpus contents.** 8,513 files were hashed, not read. What is in them beyond the four fence
  shapes counted in section 2 is unknown to this file.
- **Licence compatibility of the seven vaults.** The corpus script says the content is third party
  under its own licences and is deliberately not committed. No licence was read in this session.

**What could not be verified.**

- **That `FX-010` and `FX-020` still fail against the unfixed writer.** The suite reports six expected
  failures, which is consistent with all six being armed. It is not proof that each one would fail on
  the assertion it names. Per section 8 rule 2, the honest statement is that the count matches.
- **That the seven missing carrier fixtures were ever written and deleted, rather than never
  written.** Only their absence at `6271499` was checked.
- **The 6,613 and 6,614 refusal counts.** They are pinned in the red proof and quoted from the spec.
  The writer was not run over the corpus in this session, so they are not re-derived here.
- **The 7,969 against 7,959 discrepancy.** Recorded, not resolved.

**What would falsify this file.**

- A `SOURCES.json` whose vault counts no longer sum to 8,513.
- A `test/render/` directory appearing, which would move seven rows from missing to present.
- A golden fixture whose case count is below 200, or whose `count` field disagrees with its `cases`
  length.
- A digest in `test/mdmax/pure-functions.test.ts` changing without its version constant changing.
- A fifth defect id appearing in `specs/` without a row in section 7.
