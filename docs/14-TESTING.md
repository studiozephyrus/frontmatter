---
mode: reference
updated: 2026-09-09
verified_against: e318ab3
---

# TESTING

> **Method.** I ran `npm run test`, `npm run corpus`, `npm run spec` and `npm run arch` at
> `e318ab3` and report their real output. I red-proofed the corpus gate myself by appending one
> byte to a pinned file, running the gate, and restoring the file from a pre-op copy (SHA-256
> confirmed identical after restore). I read `vitest.config.ts`, `test/setup.ts`, both red-proof
> tests in `test/corpus/foreign/`, all four files under `specs/`, and `scripts/corpus-foreign.mjs`.
> I computed the covered/uncovered split with a script that walks every `import`, dynamic
> `import()` and `vi.mock()` specifier from all 100 test files and follows them transitively
> through `src/`.
> **What this pass did NOT do:** I did not run `npm run build`, `npm run typecheck` or
> `npm run lint`, so I cannot tell you whether `npm run verify` is green end to end. I did not
> measure line or branch coverage — the project has no coverage tooling installed, so no such
> number exists to report. I did not read the bodies of the 1,587 assertions; "covered" below
> means "reached by an import chain from a test", which is weaker than "tested". I did not
> re-verify the fork claim (41 of 43 editor/app-shell files byte-identical to sgnk-md) — that is
> `docs/PRODUCT-BRIEF.md` §9's number, carried, not re-derived.

## 1. What actually happens when you run the suite

```
$ npm run test           # vitest run

 Test Files  100 passed (100)
      Tests  1581 passed | 6 expected fail (1587)
   Start at  05:13:20
   Duration  10.28s (transform 11.50s, setup 22.43s, import 37.34s,
                     tests 20.36s, environment 29.58s)
```

Exit code 0. Nothing skipped, nothing `todo`. The six "expected fail" entries are deliberate and
are the most important thing in the suite; see §3.

The wall-clock figure and the phase figures disagree because vitest runs files in parallel —
`time` reported `10.973s total` against `55.31s user` on 651% CPU. Ten seconds is the number a
human waits.

### Suite size, counted

| What | Count | How I counted it |
|---|---|---|
| Test files collected | 100 | vitest's own summary line; `find test -name '*.test.ts*'` agrees |
| — of which `.test.ts` | 81 | `find test -name '*.test.ts' \| wc -l` |
| — of which `.test.tsx` | 19 | `find test -name '*.test.tsx' \| wc -l` |
| Assertions run | 1,587 | vitest's summary line |
| Statically written `it(`/`test(` calls | 945 | `grep -cE '^\s*(it\|test)(\.[a-z]+)?\('` across `test/` |
| Source files under `src/` | 226 | `find src -name '*.ts' -o -name '*.tsx' \| wc -l` |
| Source lines under `src/` | 25,407 | `cat` of that file list piped to `wc -l` |

The brief said 81 test files. That is exactly the `.test.ts` count; it misses the 19 `.tsx` files.
The real collected number is 100.

The gap between 945 written calls and 1,587 executed assertions is table-driven tests — roughly
640 cases are generated at run time from fixture arrays rather than written out one by one. That
is not padding, but it does mean the written-test count understates the suite and the executed
count overstates the amount of independent thought in it.

### Where the assertions live

Counted per directory with the same grep (written calls, not generated ones), so these are floors:

| Directory | Test files | Written cases | Module it exercises |
|---|---|---|---|
| `test/mdmax/` | 10 | 188 | `src/modules/mdmax` — the engine this product owns |
| `test/vault/` | 19 | 126 | `src/modules/vault` |
| `test/preview/` | 13 | 109 | `src/modules/preview` |
| `test/share/` | 11 | 107 | `src/modules/share` |
| `test/editor/` | 9 | 102 | `src/modules/editor` |
| `test/repository/` | 10 | 99 | `src/modules/repository` |
| `test/export/` | 4 | 40 | `src/modules/export` |
| `test/app-shell/` | 4 | 36 | `src/modules/app-shell` |
| `test/api/` | 4 | 28 | four of the 26 route handlers |
| `test/graph/` | 1 | 24 | `src/modules/graph` |
| `test/ai/` | 3 | 22 | `src/modules/ai` |
| `test/config/` | 2 | 17 | `src/config/env.ts` |
| `test/corpus/foreign/` | 2 | 12 | the splice writer's two known defects |
| `test/auth/` | 3 | 11 | `src/modules/auth` |
| `test/shared/` | 2 | 8 | `src/shared` |
| `test/proxy.test.ts` | 1 | 7 | `src/proxy.ts` |
| `test/ai-tools/` | 1 | 5 | `src/modules/ai-tools` |
| `test/drafts/` | 1 | 4 | `src/modules/drafts` |

Every one of the 13 modules under `src/modules/` has at least one test directory. There is no
module with zero tests. That is the good news and it is also the least useful thing on this page,
because module-level presence hides file-level absence — which §4 measures instead.

### Environment

`vitest.config.ts` sets `environment: "node"` globally. Twenty-four test files override it with a
docblock: 22 request `jsdom`, 2 request `node` explicitly. `test/setup.ts` does one thing —
`cleanup()` from `@testing-library/react` after each test.

The config also carries a scar worth reading:

```ts
// Two abandoned agent worktrees under .claude/ were being collected, inflating the
// suite by 66.4% with duplicate runs of a pre-work commit. See docs/mdmax/PLAN.md S0.
exclude: ["**/node_modules/**", "**/dist/**", "**/.claude/**"],
```

Those worktrees are still on disk. `find` over the repo without that exclusion returns 264 test
files rather than 100, because `.claude/worktrees/competent-bassi-5da9a1/` and
`.claude/worktrees/upbeat-euclid-60dbf4/` each hold an 82-file copy of a pre-work `test/` tree.
Any tool you point at this repo that does not honour the vitest exclude list will report inflated
and stale numbers.

## 2. Gates other than the unit suite

| Command | What it does | Ran it | Result |
|---|---|---|---|
| `npm run test` | vitest | yes | exit 0, 100 files, 1,587 assertions |
| `npm run corpus` | byte-pins 8,513 third-party files | yes | exit 0, `CORPUS CLEAN — 8513/8513 byte-identical` |
| `npm run spec` | contract gate over `specs/` | yes | exit 0, `4 scanned, 0 errors, 0 warnings` |
| `npm run arch` | layer + import-boundary report | yes | exit 0, `{"total": 0, "filesScanned": 208, "violations": []}` |
| `npm run budget` | nothing | no | it is literally `echo 'No bundle budget configured yet — skipping'` |
| `npm run verify` | typecheck → lint → test → build → arch → spec | no | **unverified** — I did not run `build`, `typecheck` or `lint` |

**There is no CI.** `ls .github` returns `No such file or directory`. Every gate above runs only
when a human types it, on a machine whose state nobody records. `docs/PRODUCT-BRIEF.md` §9 ranks
this third of eleven problems and describes four gates that "have reported green while blind";
this pass confirms the absence of the directory, not the blindness of the four.

### The corpus gate, red-proofed

`npm run corpus` verifies 8,513 markdown files from seven pinned third-party Obsidian vaults
against `test/corpus/foreign/MANIFEST.sha256` (8,513 lines, one SHA-256 per file). The content is
deliberately not vendored into git; `SOURCES.json` pins each vault to a commit SHA and a
`committed_at` date, and states that a hash mismatch "means upstream moved — that is a finding,
not a failure to paper over."

AGENTS.md rule 1 says a gate that has never been seen to fail is not evidence. So I made it fail:

```
$ cp <target> $TMPDIR/corpus-backup.bin        # pre-op copy
$ printf 'x' >> test/corpus/foreign/_vendor/kepano_kepano-obsidian/Readme.md
$ npm run corpus
pinned   8513
verified 8512
changed  1
CHANGED (first 10 of 1):
  kepano_kepano-obsidian/Readme.md
    want f37bd24b7f0e (625B)  got 569a3ff606ca (626B)
CORPUS DRIFTED — 8512/8513 byte-identical
exit 1

$ cp $TMPDIR/corpus-backup.bin <target>        # restored
$ shasum -a 256 <target>
f37bd24b7f0eeba016cd9420c6c819034e02aeb286d709080e5701fbe6ec4994   # identical to pre-op
$ npm run corpus
CORPUS CLEAN — 8513/8513 byte-identical
exit 0
```

One byte, in one file, out of 19,047,891 pinned bytes, and the gate goes red with the file named
and the byte count printed. The claim is real. Note what it is a gate *on*: file contents, not
program behaviour. It proves the fixture has not drifted. It does not by itself prove the splice
writer preserves bytes — the tests that use the corpus do that.

The seven pinned vaults:

| Vault | Commit | Files | Bytes |
|---|---|---|---|
| `community-archive/obsidian-hub` | `b11036f9` | 6,586 | 14,772,305 |
| `oldwinter/knowledge-garden` | `2ad252e3` | 961 | 2,578,432 |
| `quanru/obsidian-example-lifeos` | `80fb5649` | 540 | 1,215,109 |
| `s-blu/obsidian_dataview_example_vault` | `dfc8022f` | 264 | 383,365 |
| `kepano/kepano-obsidian` | `47369734` | 103 | 35,993 |
| `erazlogo/obsidian-history-vault` | `a3d22d0a` | 40 | 30,997 |
| `CyanVoxel/Obsidian-Vault-Template` | `9277193c` | 19 | 31,690 |

### The spec gate, and how little it currently governs

`npm run spec` scans four specs and passes. What it prints next is the more useful line:

```
specs scanned   4
errors          0
warnings        0
ungoverned      169 of 171 module files (INFO while bootstrapping)
states          draft=4
```

All four specs are `state: draft`. `specs/_schema/states.md` defines six states with mechanical
entry conditions, and says the harness alone may write `state:` forward — "a hand-written
`state: verified` is itself a drift finding." No spec has reached `ready`, let alone `verified`.

The two module files under governance are `src/modules/share/domain/splice-frontmatter.ts` (by
`specs/engine/splice-writer.md`) and `src/modules/preview/presentation/markdown/components.tsx`
(by `specs/render/carrier.md`). The other two specs govern test files, not source. So the
contract layer currently constrains **2 of 171 module files, 1.2%**, and constrains none of them
to a verified state. `npm run spec` exiting 0 today means the four drafts are well-formed. It does
not mean the code satisfies a contract.

## 3. The six expected failures are the strategy, not a defect

`test/corpus/foreign/nf-001-red-proof.test.ts` and `nf-003-red-proof.test.ts` hold three `it.fails`
cases each. Both files assert the **correct** behaviour and are marked `.fails`, so today they
pass *by failing*. When the writer is fixed they go red, and that red is the signal to delete the
marker.

This is AGENTS.md rule 1 made executable, and both files say so in their own headers. NF-3's is
the sharper statement of it:

> The pinned 8,513-file corpus contains ZERO bare-CR fences, zero CRLF and zero BOM — measured,
> and recorded in PRD §57. So the corpus cannot make this defect fail no matter how many times it
> is replayed, and a green corpus run is the EXPECTED result of running it rather than evidence of
> correctness. The fault has to be constructed.

NF-1 pairs a fixture with a corpus assertion for a stated reason: "The fixture proves the
mechanism deterministically and in one line. The corpus assertion proves the SCALE… Neither alone
is the proof." Its located defect is one predicate in `spliceFrontmatterValue` — a line counts as
top-level only if it contains a colon, so a sequence item written at column zero (`- alpha` under
`tags:`) falls through to the refuse branch. Blast radius as recorded in that file: 6,613 of 6,614
foreign refusals, 82.98% of the 7,969 frontmatter-bearing files in the corpus.

NF-3 also records why the existing round-trip oracle never caught it: `set` prepends a second
block, `delete` then removes the whole block as its own only entry, so the round trip is
byte-identical while `set` alone is destructive. Every assertion in that file is on the post-`set`
state only.

**Carry this into every new test.** A test written in the same session as its fix inherits that
session's blind spot. If you cannot watch a test fail against the unfixed code, write down that
the test does not cover the bug. A rare fault — NF-3 fires on a byte pattern the entire 8,513-file
corpus does not contain — will give you a green run whether or not the defect is present, and that
green is the expected draw, not a result.

## 4. What is covered, and what is deliberately not

I resolved every `import`, `import()` and `vi.mock()` specifier in all 100 test files, then
followed those imports transitively through `src/`. Three tiers:

| Tier | Files | Share of 226 |
|---|---|---|
| Named directly in a test import | 110 | 48.7% |
| Reached only transitively (imported by something a test imports) | 71 | 31.4% |
| Not reachable from any test by any import chain | **45** | **19.9%** |

Being reachable is not being tested. A file pulled in only because a barrel re-exports it has no
assertion pointed at it — `src/modules/preview/presentation/markdown/html-policy.ts` is reachable
solely through `@/modules/preview`, and `test/preview/html-policy-xss.test.ts` does in fact
exercise it, but many others in that tier get no such attention. Treat 110 as the honest ceiling
and 45 as the honest floor.

### The 45 files no test reaches

Thirty of them are HTTP entry points and page components — the layer where a mistake is visible to
a user and invisible to `vitest`:

**API route handlers (22 of 26 have no test).** `src/app/api/` holds 26 `route.ts` files.
`test/api/` covers four (`share`, `share/conflicts`, `vault/folder`, and a share revalidate case).
The 22 with nothing pointed at them:

`ai/complete`, `ai/generate-doc`, `ai/link-doctor`, `ai/refine`, `ai/suggest-links`,
`ai/summarize`, `auth/[...nextauth]`, `commit`, `export/pdf/[...path]`, `export/vault`,
`vault/create`, `vault/delete`, `vault/file`, `vault/history`, `vault/merge`, `vault/raw/[...path]`,
`vault/rename`, `vault/restore`, `vault/search`, `vault/snapshot`, `vault/unlinked`, `vault/upload`,
`vault/version`.

Several of those handlers' *use cases* are well tested through the application layer —
`makeCreateNote`, `makeRenameNote`, `makeCommitChanges`, `makeGetSnapshot` all have their own
files. What is untested is the wiring: auth check, request parsing, error mapping, status codes.
`src/app/api/vault/folder/route.ts` is 145 lines and `src/app/api/commit/route.ts` is 115; that is
not thin glue.

**Pages and layouts (7).** `(auth)/layout`, `(auth)/login/page`, `(public)/layout`,
`(public)/[slug]/page`, `(public)/p/[slug]/page`, `(vault)/layout`, `(vault)/page`. The public
note page carries `revalidate = 60` and `dynamicParams = true`; nothing asserts that.

**App-level Next surfaces (9).** `error.tsx`, `global-error.tsx`, `layout.tsx`, `loading.tsx`,
`not-found.tsx`, `manifest.ts`, `opengraph-image.tsx`, `robots.ts`, `sitemap.ts`. AGENTS.md §1
warns that anything emitting a file at a `/<name>.<ext>` URL must be reachable through
`src/proxy.ts` or the auth redirect 307s it. `test/proxy.test.ts` tests the proxy's predicates
(7 cases); nothing tests that these five generators produce what the proxy allowlists.

**The rest (5).** `src/container/client-container.ts` (client composition root),
`src/instrumentation.ts` (Next startup hook and `onRequestError`),
`src/modules/auth/infrastructure/next-auth.d.ts` (types only — correctly untestable),
`src/modules/preview/presentation/markdown/editable-table.tsx` (165 lines; `test/preview/table-edit.test.ts`
covers the pure `setTableCell`/`findGfmTables` logic beneath it, not the component),
`src/modules/share/presentation/PublicNoteView.tsx`, `src/shared/presentation/Icon.tsx`.

### Deliberately not covered, and why that is defensible

- **No coverage instrumentation.** `vitest.config.ts` has no `coverage` block and no
  `@vitest/coverage-*` package is installed (`grep -rn coverage vitest.config.ts package.json`
  returns nothing). There is therefore no line or branch percentage for this repo and anyone
  quoting one is quoting something else. Given how much of the codebase is a fork (see
  `docs/PRODUCT-BRIEF.md` §9 problem 0), a global percentage would mostly measure sgnk-md.
- **No end-to-end or browser tests.** No Playwright, no Cypress in `devDependencies`. The 22
  jsdom test files render components in isolation; nothing drives the real app.
- **No test against a live GitHub or Firebase.** Every repository and auth test drives a fake.
  That is correct — the alternative is a suite that fails on someone else's outage — but it means
  `src/shared/infrastructure/github/client.ts` is tested against an assumption about the GitHub
  API rather than against the API.
- **`src-tauri` is untested from here.** The vitest suite is TypeScript-only; no Rust test runs in
  `npm run test`.
- **`test/scratch/`** holds two `.mjs` probes (`carrier-probe.mjs`, `lossy-probe.mjs`) that vitest
  does not collect. They are investigation tools, not gates.

## 5. Testing strategy, stated so it can be argued with

1. **Red before green, always.** A test that has not been observed failing against the unfixed
   code has not been shown to cover anything. When you cannot construct the failure, write down
   that the test does not cover the bug and move on; do not report a pass. The two red-proof files
   are the reference implementation of this — copy their header format, including the paragraph
   explaining why the existing oracle missed the defect.
2. **The corpus is a fixture gate, not a behaviour gate.** It proves 8,513 third-party files have
   not moved under you. Behaviour proof needs a test that runs the writer over them. Do not let
   `CORPUS CLEAN` stand in for `the writer is correct`.
3. **Refusal is a passing outcome.** AGENTS.md rule 2: returning the input unchanged is correct
   when the document is ambiguous. NF-1 is a defect precisely because the document it refuses is
   *not* ambiguous. A test that asserts "something changed" is the wrong assertion for this
   product; assert what changed and that nothing else did.
4. **Prefer a pure function under test to a component under test.** The suite already leans this
   way — `table-edit.ts` is tested and `editable-table.tsx` is not; `graph-data.ts` is tested and
   `GraphView.tsx` is not. That is a reasonable allocation of 1,587 assertions, but it should be a
   stated choice rather than an accident, and the untested components should be listed rather than
   forgotten. They are, above.
5. **The next test to write is a route-handler contract test.** Twenty-two handlers with no
   assertion is the largest single gap, it is where the auth check lives, and the four existing
   route tests in `test/api/` already show the pattern (import `GET`/`POST` from the route module,
   mock the container, assert status and body).
6. **The gate that is missing is CI.** Six local gates that a human must remember to run are six
   gates that will be green on the machine that last ran them. `docs/PRODUCT-BRIEF.md` §14
   schedules "CI with a deliberate red run" in weeks 3–4; the deliberate red run is the part that
   matters, because a CI that has never been seen to fail is the same claim as a test that has
   never been seen to fail.

## 6. Reproducing this page

```bash
npm run test                       # 100 files, 1581 passed, 6 expected fail, ~10s
npm run corpus                     # 8513/8513, exit 0
npm run spec                       # 4 scanned, 0 errors, ungoverned 169 of 171
npm run arch                       # total 0, filesScanned 208
ls .github                         # No such file or directory — there is no CI

find src -name '*.ts' -o -name '*.tsx' | wc -l          # 226
find test -name '*.test.ts'  | wc -l                    # 81
find test -name '*.test.tsx' | wc -l                    # 19
find src/app/api -name 'route.ts' | wc -l               # 26
grep -rn coverage vitest.config.ts package.json         # nothing
```

The reachability split in §4 came from a throwaway script in `$TMPDIR`, not from a checked-in
tool. If that number is going to be quoted more than once, it should become one.
