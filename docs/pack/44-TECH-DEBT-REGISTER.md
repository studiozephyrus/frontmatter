---
id: 44-TECH-DEBT-REGISTER
title: Technical debt register
mode: explanation
tier: canonical
status: living
verified_against: f237ece
updated: 2026-09-18
owner: sagnik
covers: [tech-debt]
---

# 44. Technical debt register

One entry per item. Each carries the evidence that proves it, an effort estimate, and a proposed
fix. **Every seed handed to this file was checked against the repository before it was written**, and
one of them turned out to be already fixed.

## 1. How to read an entry

- **The heading is a bare id.** `TD-007`, never a title, so a link never breaks when the title is
  reworded.
- **Effort** is `S` for under an hour, `M` for a day, `L` for more than a day. It is a guess, and it
  is marked one.
- **Status** is `open`, `fixed`, `wontfix` or `duplicate`, from `65-CONVENTIONS.md` section 6.
- **Evidence** is a command and its output, or a path and a line. Never a recollection.
- **An entry is never deleted.** When it is fixed the row stays and says so, with what fixed it.

## 2. The register at a glance

Id | Title | Effort | Status
`TD-001` | `npm run budget` is an echo | M | open
`TD-002` | `mdmax cert` has no npm script | S | open
`TD-003` | The certificate engine is unwired | L | open
`TD-004` | `GITHUB_REPO` defaulted to a sibling project's vault | S | **fixed**
`TD-005` | The plan says Postgres in one section and Firestore in another | S | open
`TD-006` | Two architecture reports exist and no script runs them | S | open
`TD-007` | `npm run corpus` is not inside `npm run verify` | S | open
`TD-008` | `restamp-prd.mjs` is documented and has no script | S | open
`TD-009` | `src/modules/mdmax/` has no barrel, and two files deep-import it | S | open
`TD-010` | Ten tests mock a module barrel against a written rule | M | open
`TD-011` | Seven test files a spec names do not exist | M | open
`TD-012` | Two engine defects are named everywhere and specified nowhere | M | open
`TD-013` | The sign-in screen carries a password form | S | open
`TD-014` | The allowlist permits exactly one account | L | open
`TD-015` | The commit author is one person's name and address, in the source | S | open
`TD-016` | The workspace header shows the previous product's mark | S | open
`TD-017` | The screen generator asserts contrast on a palette that does not ship | M | open
`TD-018` | Two icons have the wrong coordinate system and render invisible | S | open
`TD-019` | A multi-path brand mark loses every path but the first | S | open
`TD-020` | The published page prints the legacy url in its own header | S | open
`TD-021` | No coverage tool is configured | M | open
`TD-022` | The screens hold hand-written numbers beside a constants table | M | open
`TD-023` | There is no continuous integration, so no gate runs on a push | M | open

**Twenty-two open, one fixed.** Nine of the twenty-two are `S`, and eight of those nine are one line
each. Section 13 sequences them. **`TD-023` is the one to read first**, because it decides whether any
of the others can be held once fixed.

## TD-001

**`npm run budget` is an echo. Effort M. Status open.**

**Evidence.**

```bash
python3 -c "import json;print(json.load(open('package.json'))['scripts']['budget'])"
```

prints a single `echo` of a placeholder string, which always exits 0. **The string itself is not
reproduced here**, because it contains an em dash and `65-CONVENTIONS.md` section 8 forbids one
anywhere in this pack. Run the command to see it.

**Why it is debt and not a missing feature.** A script named `budget` that always exits 0 is a green
gate over an unmeasured thing. Anybody reading the script list sees a budget and concludes there is
one. `docs/mvp0/PRODUCT-PLAN.md` section 21 already names the target and calls the echo out by name.

**Fix.** `47-PERFORMANCE-BUDGET.md` section 4 specifies what it should do and what it should print.
It is `M` rather than `S` because a real budget needs a measurement step in continuous integration,
not just a threshold.

## TD-002

**`mdmax cert` has no npm script. Effort S. Status open.**

**Evidence.** The tool exists. `scripts/mdmax-cert.mjs:3` describes itself as the command-line
surface, with seven documented invocations including a gate mode that exits 1 on a broken result.
`package.json` has 26 scripts and none of them is `cert`.

**Why it matters.** `CLAUDE.md` lists this as a known gap. A tool with a gate mode that no script
runs is a gate nobody runs.

**Fix.** One line in `package.json`. Deciding whether it belongs inside `npm run verify` is the part
that needs a judgement, and it depends on `TD-003`.

## TD-003

**The certificate engine is unwired. Effort L. Status open.**

**Evidence.** Thirteen files under `src/modules/mdmax/`. Exactly one symbol is imported from outside
the module:

```
src/modules/vault/application/get-snapshot.ts:13
src/modules/vault/infrastructure/search-index.ts:16
```

Both import `decodeStrict` from `@/modules/mdmax/domain/shape-gate`. Nothing else in `src/` reaches
any other file in the module.

**It is not orphaned, which is the important distinction.** `test/mdmax/` carries ten test files
covering fold, constructs, the shape gate, certify, placement, offsets, the pure functions and the
bench. Two hundred golden cases are pinned, per `41-FIXTURE-REGISTER.md` section 5.

So this reads as a deliberately parked sub-project rather than as dead code. **It should be labelled
as one**, because the difference decides whether a future reader deletes it.

**Fix.** Decide, and write the decision down. Either wire it, at which point `TD-002` and `TD-009`
resolve with it, or mark the module parked in its own README with the date and the reason.

## TD-004

**`GITHUB_REPO` defaulted to a sibling project's vault. Effort S. Status fixed.**

**This entry was handed to this file as an open defect and it is not one.** `src/config/env.ts:87`
now carries a comment recording the old behaviour and why it was removed, and the schema at line 90
has no default:

```
  GITHUB_REPO: z.string().min(1).regex(/^[^/\s]+\/[^/\s]+$/, 'GITHUB_REPO must be "owner/repo"'),
```

A missing value now fails at boot rather than falling back.

**Kept in the register rather than deleted**, so that the next person who reads the old note in
`CLAUDE.md` finds the answer here instead of re-investigating. `CLAUDE.md` and any other document
repeating the claim should be corrected.

## TD-005

**The plan says Postgres in one section and Firestore in another. Effort S. Status open.**

**Evidence.** Counted at `f237ece` with `grep -c`:

Term | Occurrences in `docs/mvp0/PRODUCT-PLAN.md`
`Firestore` | 22
`Postgres` | 12

Section 15, the stack, opens with the question of Cloudflare R2 with a Firestore database. Section 18,
the data model, gives twelve entities a home and calls each one a Postgres row, beginning at
`docs/mvp0/PRODUCT-PLAN.md` section 18.

**And a third answer, which is the one that runs.** Neither is what the code does. There is no
Postgres client and no Firestore read or write in `src/`. Records live in a GitHub repository through
the contents API, and `firestore.rules` governs collections nothing writes. `42-SECURITY-REVIEW.md`
`SEC-012` has that half.

**Fix.** Rewrite section 18's `Lives in` column against whichever the founders decide, and say in the
section that the code does neither yet. Three answers in one plan is how a build team picks the wrong
one.

## TD-006

**Two architecture reports exist and no script runs them. Effort S. Status open.**

**Evidence.** `AGENTS.md:76` names three reports as always-green. `package.json` references two
harness scripts:

```bash
grep -o 'specs/harness/[a-z-]*\.mjs' package.json | sort -u
```

prints `clean-architecture-report.mjs` and `spec-report.mjs`. Run by hand in this session,
`specs/harness/import-boundary-report.mjs` prints three empty arrays and
`specs/harness/server-folder-blocklist.mjs` prints an empty `blocked` list.

**Fix.** Add both to `npm run arch`, and make each exit non-zero on a non-empty result. They pass
today, so this is free.

## TD-007

**`npm run corpus` is not inside `npm run verify`. Effort S. Status open.**

**Evidence.** `verify` expands to `typecheck && lint && test && build && arch && spec`. The
byte-pinned corpus, which is the base of the testing stack and the only cross-author fidelity
evidence the product has, is not among them. `AGENTS.md:25` lists it separately, under a different
heading, at a different moment in the day.

**Fix.** Add it. It takes seconds and it exits 1 on one changed byte.

## TD-008

**`restamp-prd.mjs` is documented and has no script. Effort S. Status open.**

**Evidence.** `AGENTS.md:35` tells the reader to run
`node specs/harness/restamp-prd.mjs --check`. `grep -c restamp package.json` returns 0.

**Fix.** Add a script, or remove the line from `AGENTS.md`. An instruction that names a path rather
than a script is one rename away from being wrong.

## TD-009

**`src/modules/mdmax/` has no barrel, and two files deep-import it. Effort S. Status open.**

**Evidence.** Twelve modules under `src/modules/` have an `index.ts`. `mdmax` does not. The two
imports in `TD-003` therefore go through a deep path, which `AGENTS.md:81` forbids:

```
Cross-module imports go through the **module barrel** (`@/modules/<name>`),
```

**`npm run arch` reports `"total": 0` over 214 files.** The rule is written, the breach is real and
the gate is silent.

**Fix.** Add a barrel exporting `decodeStrict`, change the two imports, and add the barrel rule to
the architecture report so the next one is caught.

## TD-010

**Ten tests mock a module barrel against a written rule. Effort M. Status open.**

**Evidence.** `AGENTS.md:113` states the rule and names the reason. Counted at `f237ece`:

```bash
grep -rho 'vi\.mock("[^"]*"' test/ | sed 's/vi.mock("//;s/"//' | sort | uniq -c | sort -rn
```

Barrel mocks: `@/modules/auth` four times, `@/modules/drafts` three, `@/modules/editor` twice,
`@/modules/preview` once. Ten in total. `@/container/dependency-container` is mocked four times and
is the composition root, so it is not a breach.

**Why it matters.** A barrel mock replaces every export of a module, so a refactor that moves a symbol
into the barrel silently widens the mock and the test keeps passing over code it no longer exercises.

**Fix.** Convert the ten, then add a lint rule so the eleventh cannot be written.

## TD-011

**Seven test files a spec names do not exist. Effort M. Status open.**

**Evidence.** `specs/render/carrier.md` names seven files under `test/render/carrier/` as the
executable checks for its eight invariants. `ls -d test/render` returns `No such file or directory`.
Each of the seven is listed in `41-FIXTURE-REGISTER.md` section 6.

**One of the seven is the spec's red proof**, `fence-atomic-splice.test.ts`. Per `AGENTS.md:10` the
lane cannot reach `verified` without it.

**`npm run spec` reports 0 errors and 0 warnings over that spec**, because the harness checks that
the file a spec `governs` exists and not that a named check exists.

**Fix.** Write the seven, red proof first. Then teach `spec-report.mjs` to fail when an invariant
names a path that is not on disk, which is the change that stops this recurring.

## TD-012

**Two engine defects are named everywhere and specified nowhere. Effort M. Status open.**

**Evidence.** `grep -rno "NF-[0-9]" specs/ | sort | uniq -c` counts NF-1 eleven times, NF-2 four
times, NF-3 fifteen and NF-4 five. `specs/engine/` holds two spec files, for NF-1 and NF-3. NF-2 and
NF-4 have none, and no fixture.

Defect | What it is | Where it is described
NF-2 | A flow-sequence close bracket at column zero is still refused after the NF-1 fix | a behaviour-table row inside the NF-1 spec
NF-4 | The safe-key pattern excludes a space, so a key such as `date created` cannot be addressed | an interface note inside the NF-1 spec, and an open question in the writer spec

**NF-4 carries an unanswered design question, not just a missing test.** The writer spec asks whether
an accented word in one Unicode normalisation form should address the same key as the same word in
another. A fixture written before that is answered would encode the answer by accident.

**Fix.** Answer NF-4's question first and record it as a decision record. Then write both specs.

## TD-013

**The sign-in screen carries a password form. Effort S. Status open.**

**Evidence.** `src/modules/auth/presentation/LoginScreen.tsx:141` renders `<PasswordLoginForm />`.
`src/modules/auth/infrastructure/auth-options.ts` registers a credentials provider with id
`sgnk-password` alongside GitHub.

**What the product says.** The plan's sign-in screen offers Google and GitHub in one tap, and its fine
print says there is no password. The founder's standing rule, recorded in this workspace, is a
sign-in like a shared document with no captcha and no puzzle.

**And it has a security cost**, in `42-SECURITY-REVIEW.md` `SEC-003`: the provider runs a deliberately
expensive key derivation for an anonymous caller, with no rate limit.

**Fix.** Remove the provider and the form, or gate both behind a development-only flag the way the
auth bypass is gated. Keep GitHub until Firebase sign-in is wired, which is `TD-014`.

## TD-014

**The allowlist permits exactly one account. Effort L. Status open.**

**Evidence.** `src/modules/auth/domain/allowlist.ts` is five lines and its comparison is:

```
  return login.trim().toLowerCase() === allowed.trim().toLowerCase();
```

One login against one configured value. `src/config/env.ts` defaults `ALLOWED_GH_LOGIN` to a single
name.

**So the product is single-tenant today.** Everything downstream assumes it: no route checks
ownership, the vault is one repository named by one environment variable, and the Firebase sign-in
path is built and never called. `src/container/client-container.ts` composes an auth gateway and
nothing in `src/` invokes it, which means the Google sign-in the plan specifies exists as an adapter
and not as a route.

**Fix.** This is the multi-tenancy work and it is `L` for a reason. It is listed here so that nobody
reads "sign-in works" and concludes the product has accounts.

## TD-015

**The commit author is one person's name and address, in the source. Effort S. Status open.**

**Evidence.** `src/container/dependency-container.ts:42` declares a constant `AUTHOR` holding a
personal name and email address, and every write use case is constructed with it.

**Why it is debt.** Two reasons, and the second is the one that bites. Every commit the product makes
on anybody's behalf will carry one person's identity, which is wrong the moment there is a second
account. And a personal email address in a source file is a piece of personal data in a repository,
which the plan's own legal section would not accept from anybody else.

**Fix.** Take the author from the signed-in actor. `AGENTS.md:173` explains why that constant matches
the OAuth identity today, so the change and that note move together.

## TD-016

**The workspace header shows the previous product's mark. Effort S. Status open.**

**Evidence.** `src/app/(vault)/layout.tsx:52` renders the two letters `sg` inside the header's mark,
beside the wordmark `frontmatter`. The screen generator renders `fm` in the same position, at
`docs/mvp0/screens/gen.mjs:636` and `:814`.

**The shipped application and its own specification disagree about the brand mark**, on the surface a
person looks at all day.

**Fix.** One string. Then check the favicon and the icons folder for the same fault, which this entry
did not.

## TD-017

**The screen generator asserts contrast on a palette that does not ship. Effort M. Status open.**

**Evidence.** `docs/mvp0/screens/gen.mjs:615` computes a WCAG contrast ratio and throws below 4.5 to
1. It checks five hard-coded pairs. Three of the five foreground values are **not** the values in
`src/app/globals.css`.

Token | Generator | Shipped | Ratio of the shipped value on `#fafafa`
`--muted` | `#73737b` | `#9b9ba3` | **2.64 to 1**
`--danger` | `#aa5e5a` | `#b2625e` | **4.19 to 1**
`--success` | `#487d60` | `#4f8b6b` | **3.84 to 1**

Computed in this session with the same formula the generator uses, in `python3`. The generator's own
five pairs all pass, between 4.50 and 4.65 to 1.

**So the gate is green and the product is below the threshold.** `46-ACCESSIBILITY-SPEC.md` section 5
carries the full table and the dark-mode figures.

**Fix.** Read the tokens from `src/app/globals.css` rather than restating them, so a divergence is
impossible by construction. Then fix whichever palette is wrong, which is a design decision and not
this file's to take.

## TD-018

**Two icons have the wrong coordinate system and render invisible. Effort S. Status open.**

**Evidence.** `docs/mvp0/screens/gen.mjs:45` emits every icon with `viewBox="0 -960 960 960"`, the
Material Symbols coordinate space. `docs/mvp0/screens/icons/auto_awesome.svg` and
`docs/mvp0/screens/icons/insights.svg` carry no `viewBox` of their own and use a 24 by 24 coordinate
space, so they draw at roughly a fiftieth of their intended size. They are the only two of 88 icon
files with this fault.

**The blast radius is every AI control in the screens**, because `auto_awesome` is the sparkle used on
them. `45-UX-AUDIT.md` has the per-screen list.

**Fix.** Re-fetch both icons from the Material source, or scale them in `ic()` by reading each file's
own `viewBox` rather than hard-coding one.

## TD-019

**A multi-path brand mark loses every path but the first. Effort S. Status open.**

**Evidence.** `docs/mvp0/screens/gen.mjs:604` collects brand-mark paths with

```
const paths = [...raw.matchAll(/<path[^>]*>/g)].map(m => m[0])
```

which captures opening tags only and drops every closing tag, so the emitted paths nest inside one
another. An SVG `path` element ignores its children, so only the first one paints.

**The visible result is the Google mark on the sign-in screen**, which renders as a single blue wedge
instead of four colours. The GitHub mark is one path and survives.

**Fix.** Emit self-closing tags, or strip the closing tags explicitly. Any future multi-path mark
breaks the same way, so this is worth fixing before the next one is added.

## TD-020

**The published page prints the legacy url in its own header. Effort S. Status open.**

**Evidence.** `src/modules/share/presentation/PublicNoteView.tsx` renders `/p/{slug}` in the page's
eyebrow. The page serves at `/<slug>`, and `/p/<slug>` is a permanent redirect.

**So the page tells a reader an address that immediately redirects away from itself.** A reader who
copies it gets a working link, and a reader who types it gets a redirect, and neither is what the
product means to show.

**Fix.** One string. It is in this register rather than only in `45-UX-AUDIT.md` because the same
url-prefix move is what broke `42-SECURITY-REVIEW.md` `SEC-001`, and a single change that fixed both
would be the right shape.

## TD-021

**No coverage tool is configured. Effort M. Status open.**

**Evidence.** `vitest.config.ts` has no `coverage` block, and no coverage command is among the 26
scripts. The suite reports 1,598 passing tests and nothing reports what they reach.

**Why it matters more here than in most repositories.** The product's differentiation is a refusal
path, and a refusal path is exactly the branch a test suite forgets. Without coverage nobody can say
whether the branch that refuses is exercised.

**Fix.** Turn on the coverage reporter, record the number without a threshold for a month, then set a
floor. Setting a floor first produces a number somebody games.

## TD-022

**The screens hold hand-written numbers beside a constants table. Effort M. Status open.**

**Evidence.** `docs/mvp0/screens/gen.mjs:16` declares a `CAPS` object as the single source for the
free-tier limits, and around twenty sites read from it. At least twelve other sites restate the same
numbers as literals, and `docs/mvp0/PRODUCT-PLAN.md` restates them again.

**One of the literals is already a bug.** The cap for live collaborators is 1, and two sites read it
into the phrase "1 live collaborators".

**Fix.** Two steps. Move every literal onto `CAPS`, and give `CAPS` a plural-aware helper so a cap of
one reads correctly. Then decide whether `CAPS` or the plan is the source, because right now the
generator has a copy and `65-CONVENTIONS.md` section 1 says one fact has one home.

## TD-023

**There is no continuous integration, so no gate runs on a push. Effort M. Status open.**

**Evidence.** `ls -a .github` exits non-zero: the directory does not exist. There is no workflow file
anywhere in the repository. The only automated step on a push is
`scripts/vercel-ignore-build.sh`, and its own header says what it does: it decides whether the
deployment platform rebuilds, by diffing the commit range against a list of watched paths. **It runs
none of the gates.**

**So every gate named in this pack is a checklist.** `npm run verify`, `npm run corpus`,
`npm run spec`, `npm run arch`, the writing gate and the pack validator all run when a person
remembers. A commit that breaks any of them reaches the default branch, which is auto-deployed,
unchallenged.

**Why this entry outranks most of the others.** Fixing `TD-006`, `TD-007` and `TD-011` adds checks to
commands nothing runs. Each of those is still worth doing, and none of them holds until this one is
done.

**Fix.** One workflow on push and on pull request, running `npm run verify` and `npm run corpus`. Add
the pack validator and the writing gate once they are stable. Start with the gates that are green
today, so the first run passes and the workflow is trusted rather than muted.

## 13. The order to work through them

Not by severity. By what unblocks what, and by what is nearly free.

Order | Ids | Why together
0 | `TD-023` | Nothing below can be held without it
1 | `TD-006`, `TD-007`, `TD-008`, `TD-009` | Four gate and wiring fixes, all one line or close to it, all of them making a later regression visible
2 | `TD-016`, `TD-018`, `TD-019`, `TD-020` | Four visible defects, each a small change, each currently on a surface somebody looks at
3 | `TD-017`, `TD-022` | Both are the same shape: a number restated instead of read. Fix the mechanism once
4 | `TD-013` | Removes a security cost and matches the specified screen
5 | `TD-001`, `TD-021` | Two measurements the project has opinions about and no numbers for
6 | `TD-011`, `TD-012` | The specification debt. Red proofs first
7 | `TD-002`, `TD-003` | Decide the engine's status, then wire or park it
8 | `TD-005` | Needs a founder decision, so it waits on people rather than on work
9 | `TD-014`, `TD-015` | Multi-tenancy, and the constant that has to move with it

## 14. Limits of this file

**What was not assessed.**

- **Dependency debt.** No outdated-package check, no lockfile review, no deprecation scan. For a
  repository with this many build-time tools that is a real category with nothing in it.
- **`src-tauri/`.** Not opened. The desktop build has its own debt and none of it is here.
- **Performance debt.** No profile was taken. `47-PERFORMANCE-BUDGET.md` sets targets; nothing here
  says which of them the code currently misses.
- **Duplication.** No similarity analysis was run, so a repeated implementation would not appear.
- **The `decisions/` site.** It has its own tools and its own generated file, and it was out of scope.
- **Everything in `docs/` other than the plan and the screens.** The large records were deliberately
  not opened, per the brief.
- **Comment and documentation rot beyond the four cases named above.** No systematic pass.

**What could not be verified.**

- **Every effort estimate.** They are guesses by somebody who did not write the code, and `TD-003`,
  `TD-014` and `TD-021` are the ones most likely wrong.
- **That `TD-018` and `TD-019` render as described.** The generator source and the icon files were
  read and the mechanism is clear from both. The rendered images were read by a second pass rather
  than measured in a browser, which `45-UX-AUDIT.md` records as its own limit.
- **Whether `TD-003` is parked or forgotten.** The evidence supports parked. Only the founders know.

**What would falsify this file.**

- A `test/render/` directory, which closes `TD-011`.
- A barrel at `src/modules/mdmax/index.ts`, which closes `TD-009`.
- A second account signing in, which makes `TD-014` and `TD-015` urgent rather than open.
- Any `grep -c` in an evidence block returning a different number, which means the file has drifted
  and every count in it should be re-run.
