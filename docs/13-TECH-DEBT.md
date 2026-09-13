---
mode: reference
updated: 2026-09-09
verified_against: 6331b1b
---

# 13. Tech-debt register

> **Method.** Every item below was re-checked against the working tree at `e318ab3` with the
> command shown beside it, on 2026-09-09. Items originate in `docs/PRODUCT-BRIEF.md` §9; the
> plan's own text is treated as a claim to verify, not as evidence. **Not done in this pass:**
> no test run, no build, no profiling, and no read of `src/modules/mdmax`'s internals. This is
> a register of what is owed, not an audit of how it is written.

## The two that decide whether anything else matters

### D-0 · The engine is not wired behind the product

**Still true.** Two files outside `src/modules/mdmax` import from it:

```bash
grep -rl "modules/mdmax" --include="*.ts" --include="*.tsx" src | grep -v "^src/modules/mdmax"
# src/modules/vault/application/get-snapshot.ts
# src/modules/vault/infrastructure/search-index.ts
```

Both are read paths. **No write path in the product goes through the splice engine.** The
product's whole differentiation is splice-only writing with refusal, and today the editor does
not use it. Until this changes, every claim about byte-exactness describes a library the
application does not call.

**Cost:** 8 days in the plan's estimate. **Sequence:** first. Nothing downstream is meaningful
without it.

### D-1 · Review state does not exist in the code

**Newly measured, and it is not in §9.**

```bash
grep -rlE "review\.jsonl|reviewState|reviewedAt" src | wc -l   # 0
```

Zero matches across 226 source files. The headline feature, the sidecar at
`.frontmatter/review.jsonl`, per-span hashes and the tint, is entirely unbuilt. This is not a
defect; it is the honest state, and it belongs in this register because every schedule, price
and demo in the plan assumes it exists.

**Cost:** 18 days in the plan (store 6, rendering 5, revert 3, panel 4). **Sequence:** after D-0.

## Correctness and safety gates that report nothing

### D-2 · No CI at all

```bash
find .github/workflows -name '*.yml' -o -name '*.yaml' | wc -l   # 0
```

Every gate in `AGENTS.md` §0.1 (`npm run spec`, `npm run corpus`, `npm run verify`) runs only
when a human remembers. Four gates have reported green while blind, per §9. **Cost: 1 day.**
This is the cheapest item in the register and it guards all the others.

### D-3 · The byte budget is an `echo`

```bash
node -p "require('./package.json').scripts.budget"
# echo 'No bundle budget configured yet, skipping'
```

It exits 0 and measures nothing. A gate that cannot fail trains you to ignore the suite.
**Cost: 2 days.**

### D-4 · `mdmax cert` is not a runnable command

No script in `package.json`'s 26 contains `cert`. The certificate is the product's proof of
correctness and there is no way to run it from the repo. **Cost: 1 day.**

### D-5 · `entities` is an undeclared dependency

```bash
node -p "Object.keys({...require('./package.json').dependencies, ...require('./package.json').devDependencies}).includes('entities')"
# false
```

One of the engine's two external imports resolves out of hoisted `node_modules`. Any claim that
the engine drops into another host unchanged fails here first, and a clean install in a
different package manager may not hoist it. **Cost: half a day.** Fix it with D-4.

## Engine defects that refuse real files

### D-6 · NF-1, a column-zero list item in frontmatter

Refuses 83% of real vaults, per `docs/PRODUCT-BRIEF.md` §9. **Not re-measured in this pass,
carried forward from the plan and marked `**unverified**` at this commit.** **Cost: 4 days.**

### D-7 · NF-3, a bare-CR frontmatter fence

Adds a second frontmatter block, which is set-destruction rather than a refusal. **Same
provenance and the same caveat: `**unverified**` here.** **Cost: 3 days.**

Both are the highest-value engine work in the plan because they are the difference between a
tool that opens a stranger's vault and one that does not.

## Identity and inheritance

### D-8 · The desktop build ships as the sibling product

```bash
grep -o '"identifier"[^,]*' src-tauri/tauri.conf.json
# "identifier": "ai.sgnk.md"
```

**Still true.** A signed, notarised build made today installs as `sgnk-md`. Note the deliberate
counterpart in `AGENTS.md` §8: several persistence keys keep the `sgnk-md` prefix **on purpose**,
because renaming them orphans a user's local drafts. The bundle identifier is not one of those:
it is simply unchanged. **Cost: 1 day.** Do it before any public build, never after.

### D-9 · The editor shell is a fork, not an asset

`docs/PRODUCT-BRIEF.md` §9 records that 41 of 43 files in `src/modules/editor` and
`src/modules/app-shell` were byte-identical to the sibling repo, with 181 of 226 identical
across `src/` and 25 already diverged.

**Verified 2026-09-13** against `~/Desktop/GitHub/md`, which is checked out on this machine:

```bash
diff -rq src ../md/src
# editor + app-shell: 43 files, 41 byte-identical, 2 differ
# whole src tree:    228 files, 193 identical, 27 differ, 8 only ours
```

**The 41 of 43 figure is confirmed.** The whole-tree numbers have drifted from the plan's
"181 of 226 identical, 25 diverged" to 193 of 228 identical and 27 diverged, which is the
same picture with three more weeks of work on it.

`src/app/globals.css` is **byte-identical** to the sibling's, so the stylesheet the product
ships is md.sgnk.ai's, not a separate studio design system. Under the MVP plan that is not a
defect, because the MVP is meant to wear that look. It does mean the decision this implies,
merge, vendor, or fork-and-own, is now a live answer-now card rather than a note.

## Product surfaces that contradict the plan

### D-10 · No bring-your-own-key surface exists

```bash
grep -rl "apiKey" --include="*.tsx" src | wc -l   # 0
```

Every AI request bills the operator. The plan requires BYO key before AI can be exposed to a
stranger, and the pilot's premise is ten strangers. **Cost: 3 days.**

### D-11 · One Firestore write exists, in a UI component

```bash
grep -rlE "setDoc|addDoc|updateDoc|writeBatch" src
# src/modules/app-shell/presentation/KnowledgeUI.tsx
```

§9 records "zero Firestore writes across 226 source files". **That is now wrong: there is one.**
It also sits in `presentation`, which the layer rule in `AGENTS.md` §3 forbids, because infrastructure
concerns do not belong there. Whether this is a real product path or leftover scaffolding
decides whether the document-holding design in `firestore.rules` is live, and that answer gates
every legal rule in the plan. See `docs/12-SECURITY-REVIEW.md`.

**Cost:** half a day to determine, then it becomes either a deletion or an architecture decision.

### D-12 · The LLM port returns a bare string

JSON is sliced between brackets rather than parsed from a structured response, so there is no
structured output for the generation features. **Carried from §9, `**unverified**` here.**
**Cost: 2 days.**

## Sequenced

| Order | Item | Days | Why here |
|---|---|---|---|
| 1 | D-2 CI | 1 | Guards everything after it |
| 2 | D-5 `entities` + D-4 `cert` | 1.5 | One commit, unblocks any external claim |
| 3 | D-3 byte budget | 2 | Makes the correctness gate able to fail |
| 4 | D-6 NF-1, D-7 NF-3 | 7 | Without these the tool refuses most real vaults |
| 5 | D-0 wire the engine | 8 | The product starts using its own differentiator |
| 6 | D-10 BYO key | 3 | Precondition for showing anyone the AI features |
| 7 | D-1 review state | 18 | The headline, and it does not exist yet |
| 8 | D-8 Tauri identity | 1 | Before any public build |
| n/a | D-9 fork, D-11 Firestore | decision | Not days, answers the founder owes |

About **41.5 days** of enumerated work before the headline feature is built, against a measured
rate of **1.21 engineering days per calendar week** (`docs/PRODUCT-BRIEF.md` §9). Read those two
numbers together before quoting any schedule.
