---
id: 40-TESTING-STRATEGY
title: Testing strategy
mode: explanation
tier: canonical
status: living
verified_against: 6271499
updated: 2026-09-18
owner: sagnik
covers: [testing-strategy]
---

# 40. Testing strategy

Five layers, in dependency order. Each carries a status block measured in the session that wrote
this file, with the command that produced it. Nothing below is carried forward from an earlier
document.

**Read section 1 before anything else.** It is the rule the other four layers exist to serve, and it
is the one this repository has already broken.

## 1. The rule that governs everything

> **A test on a rare fault proves nothing until it FAILS against the unfixed code.**
> `AGENTS.md:10`, rule 1 of the four that override everything else.

`sed -n '10p' AGENTS.md` prints:

```
1. **Red proof before green.** A test on a rare fault proves nothing until it FAILS against
```

### Why it is the hardest part

A suite that passes tells you two things at once and does not distinguish them.

- The code is correct.
- The test never exercised the fault.

For a common fault those are easy to tell apart. For a rare one they are not, because a green run is
the **expected** result of running the suite whether the bug is there or not.

This repository has the measurement. `specs/engine/nf-003-bare-cr-fence.md` records a count over all
8,513 pinned corpus files:

Fence termination | Files
Line feed alone, the Unix ending | 7,969
Carriage return plus line feed, the Windows ending | 0
A bare carriage return, the classic Mac ending | 0
Files with a byte-order mark | 0

So the corpus **cannot** exhibit NF-3. A green `npm run corpus` says nothing at all about that
defect, and the spec says so in its own words at `specs/engine/nf-003-bare-cr-fence.md:112`:

```
- `npm run corpus` passing says **nothing** about NF-3. Do not cite it as coverage.
```

### How the rule is mechanised

Vitest's `it.fails` marker. A red proof asserts the **correct** behaviour and is marked `.fails`, so
today it passes by failing. When the writer is fixed the test goes red, and that red is the signal to
delete the marker.

This is the only construct in the repository that makes "the bug is still here" a **passing** state,
which is what lets a red proof live in a green suite without anybody having to remember it.

**Six such tests exist.** Counted with:

```bash
grep -rn "it\.fails" test/ --include='*.ts' --include='*.tsx' | grep -v _vendor
```

File | Expected-fail tests | What each one asserts
`test/corpus/foreign/nf-001-red-proof.test.ts` | 3 | lines 54, 62, 71
`test/corpus/foreign/nf-003-red-proof.test.ts` | 3 | lines 42, 50, 58

That count matches the suite's own total exactly, which is the check that they are all still armed.

### The blindness this rule was written from

NF-3 was invisible for a reason worth repeating, because it is a property of oracles and not of this
one file. The round-trip oracle replayed `set` then `delete` and asserted byte identity. On a bare-CR
document `set` prepends a whole second frontmatter block, and `delete` then finds the key as that
block's only entry and removes the block. The round trip is byte-identical **while `set` alone is
destructive**.

So the standing instruction, from `specs/engine/nf-003-bare-cr-fence.md`, is: **assert on each
operation independently**. A round-trip assertion is blind to any defect the two operations share.

## 2. Layer one, the byte-pinned foreign corpus

The base of the stack, because every layer above it assumes the input bytes are what they were.

Property | Value
Command | `npm run corpus`, which runs `node scripts/corpus-foreign.mjs verify`
Files | 8,513 markdown files
Bytes | 19,047,891
Vaults | 7, each pinned to an upstream commit in `test/corpus/foreign/SOURCES.json`. `41-FIXTURE-REGISTER.md` lists them
Hash manifest | `test/corpus/foreign/MANIFEST.sha256`, one sha256 and byte count per path
In git | **No.** The content is third party under its own licences. `_vendor/` is gitignored and `node scripts/corpus-foreign.mjs fetch` reconstructs it
Exit code | 1 on a single changed byte

**Status, measured 2026-09-18 by `npm run corpus`:**

```
pinned   8513
verified 8513
changed  0
missing  0
extra    0
```

Exit code 0.

**Why the pinning matters, in the repository's own words.** From `scripts/corpus-foreign.mjs:7`:

```
// Why this exists: the 8,513-file corpus that backs our only cross-author fidelity
```

The reason given there is that the corpus once lived in a session temp directory that gets reaped,
and a re-clone had already drifted by two files. A corpus you cannot re-derive byte for byte is not
evidence.

**What this layer proves.** That a foreign author's bytes survive whatever the engine does to them.
It is the only cross-author fidelity claim the product has.

**What it does not prove.** Anything about a fault shape the corpus does not contain. Section 1 has
the worked example.

## 3. Layer two, the spec harness

Property | Value
Command | `npm run spec`, which runs `node specs/harness/spec-report.mjs`
Spec files | `specs/engine/*.md`, `specs/render/*.md`
Schema | `specs/_schema/spec.schema.json`
State vocabulary | `specs/_schema/states.md`

**Status, measured 2026-09-18 by `npm run spec`:**

```
specs scanned   4
errors          0
warnings        0
ungoverned      169 of 171 module files (INFO while bootstrapping)
states          draft=4
```

Exit code 0.

**Read the third line carefully.** Four specs govern two files. One hundred and sixty nine of the
171 module files under `src/modules/` are ungoverned, and the harness reports that as information
rather than as an error because the repository is still bootstrapping.

The four specs are:

Spec | Governs | State
`specs/engine/splice-writer.md` | the writer contract | draft
`specs/engine/nf-001-zero-indent-sequence.md` | `test/corpus/foreign/nf-001-red-proof.test.ts` | draft
`specs/engine/nf-003-bare-cr-fence.md` | `test/corpus/foreign/nf-003-red-proof.test.ts` | draft
`specs/render/carrier.md` | the render carrier | draft

**No spec is at `state: verified`.** Per `AGENTS.md`, a lane is done when its spec reaches
`verified`, which only the harness writes, and only after every `verify:` command exits 0 and a red
proof exists. Four of four are `draft`, so by the repository's own definition no lane is done.

**What this layer proves.** That every spec parses, that its ids are unique, and that the files it
claims to govern exist.

**What it does not prove.** That the specs are true, or that the 169 ungoverned files behave.

**And it does not check that a named executable check exists.** `specs/render/carrier.md` names seven
test files under `test/render/carrier/` as the checks for its eight invariants. **None of the seven
exists, and `test/render/` is not a directory.** Checked with `ls -d test/render`, which returns
`No such file or directory`. `npm run spec` reports 0 errors and 0 warnings over that spec.
`41-FIXTURE-REGISTER.md` lists all seven.

## 4. Layer three, vitest

The bulk of the suite. It runs in Node by default and switches to jsdom per file.

Property | Value
Command | `npm run test`, which runs `vitest run`
Config | `vitest.config.ts`
Default environment | `node`
Alias | `@` to `./src`
Setup file | `test/setup.ts`, which calls Testing Library's `cleanup` after each test
Excluded | `**/node_modules/**`, `**/dist/**`, `**/.claude/**`

**The `.claude/` exclusion is load-bearing.** Two abandoned agent worktrees were being collected and
inflated the suite by 66.4 percent with duplicate runs of a pre-work commit. The reason is recorded
in `vitest.config.ts:7`.

**Status, measured 2026-09-18.** `npm run test 2>&1 | tail -20` prints, verbatim:

```
> frontmatter@0.1.0 test
> vitest run


 RUN  v4.1.7 /Users/sagnikmitra/Desktop/GitHub/frontmatter


 Test Files  100 passed (100)
      Tests  1598 passed | 6 expected fail (1604)
   Start at  06:55:41
   Duration  5.00s (transform 4.83s, setup 10.20s, import 17.20s, tests 9.44s, environment 14.47s)
```

**The six expected failures are the two red proofs.** Three from NF-1 and three from NF-3. If that
number ever falls without a spec moving to `verified`, a red proof has been disarmed.

### The environment split

Measure | Value | Command
Test files | 100 | `find test -name '*.test.ts' -o -name '*.test.tsx' \| grep -v _vendor \| wc -l`
Files carrying `// @vitest-environment jsdom` | 24 | `grep -rln "vitest-environment" test/ \| grep -v _vendor \| wc -l`
`.test.tsx` files | 19 | `find test -name '*.test.tsx' \| grep -v _vendor \| wc -l`

A component test that forgets the pragma fails on a missing `document` rather than on its assertion,
which is a confusing first failure. There is no gate that checks the pragma is present.

### The deep-path mocking rule, and where it is not followed

`AGENTS.md:113` states the rule:

```
The local test suite uses vitest. Tests mock at the **deep** path
```

The named example is `@/modules/vault/presentation/use-snapshot`, and the reason is that a barrel
mock replaces every export of a module, so a refactor that moves a symbol into the barrel silently
widens the mock.

**Counted at `6271499`** with
`grep -rho 'vi\.mock("[^"]*"' test/ | sed 's/vi.mock("//;s/"//' | sort | uniq -c | sort -rn`:

Mock target | Times | Deep or barrel
`@/modules/vault/presentation/use-snapshot` | 5 | deep, the documented case
`@/modules/auth` | 4 | **barrel**
`@/container/dependency-container` | 4 | composition root, by design
`@/shared/infrastructure/github/client` | 3 | deep
`@/modules/drafts` | 3 | **barrel**
`@/modules/editor` | 2 | **barrel**
`@/modules/preview` | 1 | **barrel**

**So the rule is written and partly followed.** Ten mocks go through a barrel. Nothing enforces the
rule, and a test that mocks a barrel passes exactly as loudly as one that does not. This is recorded
as a debt item in `44-TECH-DEBT-REGISTER.md`.

**What this layer proves.** Unit and component behaviour of the modules that have tests.

**What it does not prove.** Anything about a module with no test, and anything about a real browser.
There is no end-to-end suite in this repository.

## 5. Layer four, the architecture gate

Property | Value
Command | `npm run arch`, which runs `node specs/harness/clean-architecture-report.mjs`
Output | JSON with `total`, `filesScanned`, `summary` and `violations`
Contract | `AGENTS.md` sections 2 and 3, the layer dependency direction

**Status, measured 2026-09-18 by `npm run arch`:**

```
{
  "total": 0,
  "filesScanned": 214,
  "summary": {},
  "violations": []
}
```

### Two sibling reports exist and no script runs them

`AGENTS.md:76` names three reports as always-green, not one:

```
Hexagonal modular monolith. Always-green: `clean-architecture-report` total 0,
```

The other two are `specs/harness/import-boundary-report.mjs` and
`specs/harness/server-folder-blocklist.mjs`. Neither appears in any of the 26 npm scripts. Checked
with `grep -o 'specs/harness/[a-z-]*\.mjs' package.json | sort -u`, which prints only
`clean-architecture-report.mjs` and `spec-report.mjs`.

Run by hand in this session, both are clean:

```
{ "serverImports": [], "libImports": [], "componentImports": [] }
{ "blocked": [] }
```

**They pass today and nothing stops them regressing.** A report nobody runs is a report, not a gate.

### What the gate does not catch

`src/modules/mdmax/` has **no `index.ts` barrel**, and two files outside it deep-import from it:

```
src/modules/vault/application/get-snapshot.ts:13
src/modules/vault/infrastructure/search-index.ts:16
```

Both import `decodeStrict` from `@/modules/mdmax/domain/shape-gate`. That is a cross-module deep
import, which `AGENTS.md:81` forbids, and `npm run arch` reports `total: 0`. The rule is real, the
breach is real, and the gate is silent on it.

## 6. Layer five, the composite gate

```bash
npm run verify
```

expands to, verbatim from `package.json`:

```
npm run typecheck && npm run lint && npm run test && npm run build && npm run arch && npm run spec
```

Six steps. **`npm run corpus` is not among them.** The byte-pinned corpus, which is the base of this
stack and the only cross-author fidelity claim the product has, is not in the gate a person is told
to run before a commit. `AGENTS.md:25` lists it separately, as one of three commands to run before
writing code, which is a different moment and a different habit.

Step | Command | What it catches
`typecheck` | `tsc --noEmit` | types, at the local tsconfig's strictness
`lint` | `eslint . --max-warnings=0` | the import bans, unused code
`test` | `vitest run` | sections 4 above
`build` | `next build` | the stricter production tsconfig, which `AGENTS.md:120` warns is stricter than local
`arch` | the clean-architecture report | section 5
`spec` | the spec harness | section 3

**`npm run verify` was not run in the session that wrote this file.** Its five constituent gates were
run individually and are reported above, except `typecheck`, `lint` and `build`, which were not run.
See the limits below.

## 7. What to add next, in order

Each row says what it would catch that nothing catches today.

Order | Add | Catches
1 | `npm run corpus` inside `npm run verify` | a corpus drift that reaches a commit
2 | `import-boundary-report` and `server-folder-blocklist` inside `npm run arch` | a regression in two contracts `AGENTS.md` already calls always-green
3 | A barrel for `src/modules/mdmax/` and a gate on barrel-less cross-module imports | the breach section 5 names
4 | A lint rule banning `vi.mock` on a module barrel | the ten barrel mocks in section 4
5 | A gate asserting the expected-fail count is exactly 6 until a spec reaches `verified` | a silently disarmed red proof
6 | An end-to-end suite against a running app | every claim in `45-UX-AUDIT.md` marked unverifiable
7 | A gate on the `// @vitest-environment jsdom` pragma for `.test.tsx` | a component test failing on the wrong thing

## 8. Limits of this file

**What was not assessed.**

- **Coverage.** No coverage tool is configured and none was run. The 1,598 passing tests are a count
  of assertions that ran, not a measure of what they reach. Nothing here says which of the 214
  scanned source files have a test.
- **Test quality.** No test was read for whether its assertion is meaningful, except the two red
  proofs, which were read in full.
- **The 169 ungoverned module files.** Named by the spec harness, not examined here.
- **`npm run typecheck`, `npm run lint` and `npm run build`.** Not run in this session. Their status
  is unknown to this file. `AGENTS.md:120` records that `build` is stricter than `typecheck`, so a
  green `typecheck` would not settle it either.
- **The Tauri build.** `npm run tauri:build` has no test layer described here and none was found.
- **CI.** No continuous-integration configuration was inspected, so whether any of these gates runs
  on a push is unknown to this file.

**What could not be verified.**

- **That the six expected failures are the only disarmed-red-proof risk.** The count matching is
  necessary, not sufficient. A red proof could be weakened in place without changing the count.
- **That `npm run corpus` would catch a real upstream drift.** The clean result is the expected
  result of running it against an unchanged `_vendor/`. Per section 1, that is not evidence. The
  drift path was not exercised.
- **The 66.4 percent figure** for the worktree inflation. It is quoted from `vitest.config.ts:7` and
  was not re-derived.

**What would falsify this file.**

- A `npm run test` run whose expected-fail count is not 6 while all four specs are still `draft`.
- A `npm run corpus` run reporting a non-zero `changed`, `missing` or `extra`.
- A spec reaching `state: verified` without a red proof that has been seen to fail.
- A coverage run showing that the modules the product's differentiation rests on, the splice writer
  and the change queue, are untested. The change queue does not exist in code at all, which
  `49-BUILD-STATUS-AUDIT.md` records, so its coverage is necessarily zero.
