---
mode: reference
updated: 2026-09-09
verified_against: 6331b1b
---

# Executive summary

> **Method.** I read `AGENTS.md`, `package.json`, `docs/PRODUCT-BRIEF.md` (all 560 lines) and
> `docs/GAPS-2026-09-08.md` (all 150 lines). I then re-derived every load-bearing number in this
> file from a command against the working tree at `e318ab3`: file and module counts by `find`,
> engine wiring by `grep`, the fork claim by `cmp` against the sibling checkout at
> `../md`, velocity by `git log`, and the gate status by running `npm run typecheck`,
> `npm run lint`, `npm run test`, `npm run arch`, `npm run spec` and `npm run corpus`.
> **What this pass did NOT do:** it did not run `npm run build` (so the Vercel-strict TypeScript
> settings named in `AGENTS.md` §5 are unchecked here); it did not start the dev server or open
> the app; it did not build or run the Tauri desktop bundle; it did not read
> `docs/FRONTMATTER-PRD-v2-2026-08-29.md`, `docs/ENGINE.md`, `docs/CRITIQUE.md`,
> `docs/DEV-PLAN.md`, `docs/BUSINESS.md` or the two multi-megabyte record files; it did not
> re-verify any market, install-count or legal figure in the brief — those are cited to the
> brief, not to me; and it read no `.env` file of any kind.

## 1. What this is

frontmatter is a markdown editor for repositories whose documents are increasingly written by
agents rather than by people. The claim it is built on is that when an agent edits a spec, a
plan or a README in a working tree, there is no container to review the change in — no pull
request, no suggestion mode, no document-level "who touched this" — and so the change lands
unread. frontmatter proposes to tint every span that has changed since a person last read it,
let one key revert any span, keep that review state in a plain-text sidecar committed beside
the files, and never write a byte outside the range being edited. It is a web app and a Tauri
desktop app from one build; document bytes stay in the user's repo and on the user's machine.
It is being built by Studio Zephyrus, in India.

## 2. The three load-bearing technical commitments

Everything else in the product is negotiable. These three are not, because the differentiation
collapses without them.

**Projection law — the file on disk is the only truth.** The editor's rendered view, the review
sidecar and the search index are all projections of the bytes; none of them is an authority the
bytes must be reconciled against. This is why the review anchor is a byte range plus a content
hash and not a journal entry: git, another editor, and the user's own agent all write to the
file without going through us, and any design that treats our record as the anchor is wrong on
first contact with an out-of-band write. The brief states this in §4 ("the journal is not the
anchor"), and `docs/GAPS-2026-09-08.md` correctly lists "whether the review anchor survives an
out-of-band write" as still open — which is uncomfortable, because that is the only scenario
the product exists for.

**Splice-only writing, with refusal as a correct outcome.** Every write is a byte-range
replacement. When the engine cannot determine the exact range — an ambiguous construct, a
frontmatter shape it does not model, a case where identical bytes mean different things because
of bytes elsewhere in the file — it must return the input unchanged rather than guess.
`AGENTS.md` rule 2 states this as an operating rule: *"Returning the input unchanged is a
correct outcome for this product. Guessing is not."* The evidence that the splice half works is
real and I reproduced it: `npm run corpus` reports **8,513 of 8,513 files byte-identical**, and
it exits 1 on a single changed byte. The evidence that the refusal half is *declared* is
missing — the brief's §20 item 5 says of the non-locality cases, "none is currently declared".

**Review state in a sidecar, in the repo, in plain text.** `.frontmatter/review.jsonl`, one JSON
line per span, readable without frontmatter, committed with the files so it crosses people and
tools. This is the only thing the product adds that is not already in the markdown. It is also,
today, entirely unbuilt (§4).

## 3. Honest maturity — what runs, measured at `e318ab3`

The repository is a real, working, well-gated Next.js application that does not yet contain the
product. Both halves of that sentence matter.

**What runs.** 226 TypeScript and TSX files under `src/`, in 14 modules
(`find src -name '*.ts' -o -name '*.tsx' | wc -l`; `ls src/modules`). 26 API route handlers, of
which 6 are AI endpoints (`find src/app/api -name route.ts`). 100 test files outside
`.claude/worktrees`, and `npm run test` reports **1,596 passing, 6 expected-fail, 4.86s**. The
architecture gate is clean: `npm run arch` returns `total: 0` over 208 files scanned. `npm run
typecheck` exits silent. `npx eslint src --max-warnings=0` exits 0. The byte-pinned corpus is
clean, as above. Editing, tabs, tree, preview, search, git commit, share, export and six AI
routes all exist as code.

**What is designed and unbuilt.** The headline feature does not exist:

- `grep -rn "review\.jsonl" src/ scripts/ specs/` returns **0**.
- `grep -rn "\.frontmatter/" src/` returns **0**.
- `grep -rni "reviewState\|reviewedAt\|reviewed_at" src/` returns **0**.

There is no review store, no tint, no revert, no panel. F2 in the brief is a specification, not
a component.

**The engine is not wired.** `src/modules/mdmax` is 13 files and 3,614 lines and is the only
part of `src/` this product owns. Product code reaches into it in exactly two places, and both
import the same one symbol from the same one of those thirteen files:

```
src/modules/vault/application/get-snapshot.ts:13:  import { decodeStrict } from "@/modules/mdmax/domain/shape-gate";
src/modules/vault/infrastructure/search-index.ts:16: import { decodeStrict } from "@/modules/mdmax/domain/shape-gate";
```

The editor does not write through the splice engine. The byte-exactness the corpus gate proves
is a property of a library the application barely calls.

**The certificate CLI cannot start.** `node scripts/mdmax-cert.mjs` fails immediately with
`ERR_MODULE_NOT_FOUND: Cannot find module .../src/modules/mdmax/domain/offsets`. `cert` is not
one of the scripts in `package.json`.

**The engine has an undeclared dependency.** `entities` is imported by
`src/modules/mdmax/domain/verdict.ts:53` and `src/modules/mdmax/domain/fold.ts:43` and appears
nowhere in `package.json` (`grep -n '"entities"' package.json` exits 1). It resolves out of
hoisted `node_modules` today. Any claim that the engine drops into another host unchanged fails
here first.

**There is no CI.** `ls .github` returns *No such file or directory*. Every gate quoted in this
document is a gate someone has to remember to run.

**The byte budget is a print statement.** `"budget": "echo 'No bundle budget configured yet — skipping'"`.

**`npm run verify` is red at HEAD.** `npm run lint` reports **71 errors, 0 warnings**. All 71
are outside `src/` — in `decisions/*.js`, `docs/build/*.mjs` and `test/scratch/*.mjs`, mostly
`no-undef` on `process` and `console` — and `src/` alone lints clean. It is still red, and
`AGENTS.md` §4 makes a green lint a precondition of commit.

**There is no bring-your-own key.** `grep -rni "bring your own\|byok\|userApiKey"` over `src/`
returns 0. Every provider key in `src/modules/ai/infrastructure/gateway-client.ts` is read from
server environment — `GROQ_API_KEY`, `CEREBRAS_API_KEY`, `MISTRAL_API_KEY`,
`OPENROUTER_API_KEY`, with a Vercel AI Gateway fallback. Every AI request a stranger makes
would bill the operator. The plan puts a stranger's key in front of a stranger's repo in week 5;
nothing supports that yet.

**The AI port has no structured output.** `LlmClient.generate` in
`src/modules/ai/application/ports.ts:11` returns `Promise<string>`. F5, F6 and F7 all need
typed output.

**The desktop app still ships as the sibling product.** `src-tauri/tauri.conf.json` line 3 is
`"productName": "sgnk-md"` and line 5 is `"identifier": "ai.sgnk.md"`.

**The known defects are still live, and honestly marked.** `test/corpus/foreign/nf-001-red-proof.test.ts`
and `nf-003-red-proof.test.ts` assert the correct behaviour under `it.fails`, so they pass today
*by failing*. Those are the 6 expected-fail results in the run above. That is the right way to
carry a known bug, and it means NF-1 (zero-indent YAML block sequence refused) and NF-3
(bare-CR frontmatter fence duplicating the block) are both unfixed at `e318ab3`. The "83% of
real vaults refused" figure attached to NF-1 comes from the brief; I did not reproduce it.

**The document-holding contradiction is unresolved but currently harmless.** `firestore.rules`
is committed (17,304 bytes) and designs note bodies with public reads. In `src/` there are
**zero Firestore document writes** — `grep -rn "setDoc\|addDoc\|updateDoc\|writeBatch" src/`
returns three hits, all of which are `setDoctorOpen` in `KnowledgeUI.tsx`. Firebase appears in
four files and all four are auth. The design exists on paper; nothing writes documents.

**The editor shell is a fork, and the fork is measurable.** Comparing `src/` byte-for-byte
against the sibling checkout at `../md` (its HEAD is `02c22ec4`, 2026-07-17):

| Scope | Identical to sibling | Diverged | Only in frontmatter |
|---|---|---|---|
| `src/` overall (228 files) | 183 | 25 | 20 |
| `src/modules/editor` (22) | 21 | 1 | 0 |
| `src/modules/app-shell` (21) | 20 | 1 | 0 |
| `src/modules/mdmax` (13) | 0 | 0 | 13 |

41 of 43 editor and shell files are byte-identical and none is unique. `mdmax` is what this
product owns. The comparison is against whatever `../md` currently holds, which is a moving
target, so treat the exact split as of this date rather than as a constant.

**Two numbers in the brief I could not reproduce.** The brief's F13 row says single-document
export is "945 lines across 8 files"; I count 646 lines across 5 files in `src/modules/export`,
plus 229 lines across the two `src/app/api/export` routes, for 875 across 7. The wiring claim is
exact — `ExportMenu` is imported at `EditorPane.tsx:22` and rendered at `EditorPane.tsx:907`.
The brief also asserts "one symbol from one of thirteen files reaches product code", which I
confirm, and separately "202 of 228 files identical" for sgnk-md, where I measure 183 of 228 —
the difference is presumably drift in `../md` since that count was taken. **Re-derive both
before quoting them.**

## 4. The measured engineering rate, and what it does to any schedule

`git log --format='%ad' --date=short -- src src-tauri test | sort -u` over the repository's
entire life (first commit 2026-07-13, HEAD 2026-09-09) returns **11 distinct dates**. The window
is 59 calendar days = 8.429 weeks, so:

- 11 code-touching days / 8.429 weeks = **1.31 engineering days per calendar week**.
- The most recent of those eleven (`dea3781`, 2026-09-09) added only three scratch probe files
  under `test/scratch`. On product code the count is 10, which is **1.19 per week** — the brief's
  1.21 figure, reproduced.
- In the last 30 calendar days there are **four** such dates (2026-08-10, 08-29, 08-31, 09-09),
  and only three of those touched product code.

The brief puts MVP-0 at about 70 engineering days. At 1.21/week that is 58 calendar weeks; at
the sibling repository's best-ever 1.91/week it is 37. **The "ten weeks" schedule is
arithmetically impossible and the brief has already withdrawn it** — 70 days in 10 weeks is 7.0
engineering days per calendar week, which is seven days a week with no days off, and is shorter
than the same 70 days at ordinary five-day full-time.

The resourcing fact underneath it: `git log --format='%an' | sort | uniq -c` returns **92 of 92
commits by a single author** on this repository, and 416 of 416 on the sibling. The plan has
been written in places for two people. Every rate above is a one-person rate and is not
additive. If a second person is real, name them and re-derive before anyone quotes a date.

The practical consequence for a newcomer: do not accept any dated commitment in this repository
that is not accompanied by an assumed days-per-week figure and a weekly report of days actually
achieved against it. That is the only way the schedule is falsifiable on day 7 rather than at
week 10.

## 5. The five things to worry about

**1. The headline failed its adversarial round and has not been replaced.** On 2026-09-08 a
23-agent round attacked "review state is the product" and came back negative: the 266-reaction
issue behind it asks for a per-session accept/reject panel and 0 of 36 texts ask for anything to
persist; thirteen purpose-built markdown-review VS Code extensions sum to 1,217 installs with a
ceiling of 400, one of which — *mddiff*, published 2026-06-03 — is this product's sentence
already shipped, at 74 installs; and in the Obsidian forum the nearest existing request has 0
likes over three years while the rendering bug the plan treats as a *channel* has 501. What
survives is narrower: nobody persists review state *across people and across tools on a working
tree with no pull request*. Decision 1 in the brief is to confirm that narrowed claim or demote
the feature. Until it is taken, page one of the plan is a hypothesis whose only test went
against it. (All figures in this paragraph are the brief's; I did not re-fetch them.)

**2. Nobody has been asked anything.** Zero user interviews across the whole programme. Every
demand claim is inferred from public complaint counts, and the record already contains three
withdrawn numbers where a complaint count was mistaken for demand. The two-week test programme
that would fix this is written and not started.

**3. The product is a specification sitting on someone else's editor.** The review store is 0
lines, the engine reaches product code through one symbol, and 41 of 43 shell files are the
sibling's. The distance from "a fork of sgnk-md with a clean architecture gate" to "the thing
described in §1 of the brief" is the whole product, and the fork tax is paid either way — merge,
vendor, or fork-and-own is an open decision (§9 item 0).

**4. The gates are good and nothing enforces them.** There is no CI, the byte budget is an
`echo`, `npm run verify` is red at HEAD, and the certificate CLI has not started for over a
month. This repository's culture — red proof before green, refuse rather than guess, re-derive
every number — is unusually disciplined and it is entirely dependent on one person remembering
to run six commands. One day of work buys the enforcement.

**5. Every commercial claim is unpriced and three legal questions hang off one unmade
decision.** The team tier at $4–5 is anchored to comparables and has no offer behind it that
GitHub does not already bundle at $4. Whether anyone pays for review state in any shell is still
open after eleven gaps of desk research that measured installs and attention but never payment.
And whether the Firebase document-holding design ships determines every operating rule in §22 —
`firestore.rules` says one thing, the PRD says another, this brief says the opposite. It is
unbuilt today, which means the cheapest resolution available is to delete the design before it
acquires a fact pattern.

## 6. What a newcomer should read next

`docs/MAP.md` routes to the right artefact and names the five superseded ones. `AGENTS.md` is
221 lines and is accurate. `docs/PRODUCT-BRIEF.md` is the plan; `docs/GAPS-2026-09-08.md` is the
plan's own list of what is thin in it, and is the more useful of the two on a first read. Do not
open `docs/FRONTMATTER-PRD-v2-2026-08-29.md`, `docs/FRONTMATTER-RECORD.md`,
`docs/FRONTMATTER-COMPLETE-RECORD-2026-08-30.md`, `docs/ENGINE.md`, `docs/CRITIQUE.md` or
`docs/DEV-PLAN.md` whole; `grep -n` them and read the range.

Before writing anything that quotes a number from any of those: re-derive it. `AGENTS.md` rule 3
exists because twenty of them went stale, and this document found two more.
