---
mode: reference
updated: 2026-09-09
verified_against: e318ab3
---

# Product and domain

> **Method.** I read `AGENTS.md`, `package.json`, `src/modules/README.md`, and all 20 `domain/`
> files across the five modules that have a domain layer (auth 3, mdmax 11, repository 2,
> share 2, vault 2) — `cert-contract.ts` in full, the rest their file headers plus every
> exported signature. I also read every module barrel `index.ts`,
> `src/container/dependency-container.ts`, the application `ports.ts` of vault, repository and
> ai, and `docs/PRODUCT-BRIEF.md` §§1–9 (560 lines total). I ran the test suite, the
> architecture gate, the spec gate, the corpus gate, and `node scripts/mdmax-cert.mjs`. I
> re-derived the module count, the route count, the test count and the fork ratio myself with
> `find`, `cmp` and `git`, and they are reported below where they differ from what the task
> brief stated.
>
> **What this pass did NOT do.** It did not open `docs/FRONTMATTER-PRD-v2-2026-08-29.md`,
> `docs/FRONTMATTER-RECORD.md`, `docs/FRONTMATTER-COMPLETE-RECORD-2026-08-30.md`,
> `docs/ENGINE.md`, `docs/CRITIQUE.md` or `docs/DEV-PLAN.md` beyond single `grep -n` hits — so
> where those documents define a term differently from the code, this document follows the code.
> It did not read the presentation layer of any module line by line (it read barrels, file
> lists and file headers), did not read the 12 non-mdmax application use-cases in full, did not
> read `src-tauri/`, did not run `npm run build` or `npm run typecheck`, and did not open any
> `.env` file. It did not evaluate whether the product claim is correct — only whether the code
> matches the description.

---

## 1. What the product is

frontmatter is a markdown editor for repositories whose documents are increasingly written by
agents. The claim it is being built around is **review state**: the editor tints every span of a
document that changed since a person last read it, lets one key revert a span, and writes what
was reviewed into a sidecar file committed alongside the documents. The differentiator behind
the claim is that this works on a **working tree with no pull request** — the container that
GitHub, Google Docs and Reviewable all require, and that an agent writing into a local repo
never creates.

That claim is a hypothesis under test and **it failed an adversarial round on 2026-09-08**
(`docs/PRODUCT-BRIEF.md` §1). The brief keeps review state as a feature (F2) and narrows the
claim to: nobody persists review state across people and across tools on a working tree with no
pull request. Decision 1 in §14 of the brief is to confirm that narrower claim or demote it.
This document describes the domain the code reasons about; it does not take a position on the
claim.

The mechanism underneath every verb is **byte-exact editing**: a write is a replacement of a
byte range, never a re-emission of a parse tree. The brief's own vocabulary audit demotes
byte-exactness from headline to mechanism ("4 complaints in 12,556"), but it is the constraint
that every domain type in `src/modules/mdmax` and `src/modules/share/domain/splice-frontmatter.ts`
is written to satisfy.

## 2. Corrections to the counts

Four figures in the brief I was given differ from what the repository contains at `e318ab3`.
All four were re-derived here.

| Figure as given | Measured | Command |
|---|---|---|
| 14 modules | **13** | `ls -d src/modules/*/ \| wc -l` |
| 12 API route handlers | **26** | `find src/app/api -name route.ts \| wc -l` |
| 81 test files | **100** (1,587 tests: 1,581 pass, 6 expected-fail) | `npx vitest run` |
| 226 TypeScript files under `src/` | **226** — correct | `find src -name '*.ts' -o -name '*.tsx' \| wc -l` |

The test-file count is easy to inflate: `find` across the whole repo returns 264 because
`.claude/worktrees/` holds two full copies of the tree. The number above counts `./test` only.

The layer rule in the brief is correct and enforced. `node specs/harness/clean-architecture-report.mjs`
reports `total: 0` over 208 files scanned.

## 3. Who the users are

The brief names three populations and the code confirms which of them the app can currently
serve.

**The person who ran the agent.** Someone who typed a slash command in Claude Code, Cursor plan
mode, `github/spec-kit` or `obra/superpowers`, got a spec or a plan written into their repo as
markdown, and now has to read it. The brief sizes the spec-writer tools at 75–85k public repos
(superpowers) and 11,072 (spec-kit). This is the primary user and the whole product is shaped
around the moment after the agent stops writing.

**The person maintaining a repository's documentation.** The docs-scan feature (F7) is aimed at
them: stale sections, broken links, missing `AGENTS.md` or `CHANGELOG`. The brief classes this
as founder direction, not public evidence.

**A team of reviewers.** F10 (shared review state, comments across people) and the $4–5 team
tier. The brief marks this **untested** and notes that the only live paid precedent is Google
gating span-level authorship behind Workspace Business Standard.

The code today serves a fourth, narrower user that the brief does not foreground: **a single
person editing one GitHub repository configured at build time**. `src/config/env.ts` exposes
`GITHUB_REPO`, `GITHUB_BRANCH`, `GITHUB_REPO_TOKEN` and `ALLOWED_GH_LOGIN` (names only — I did
not read any value), and `src/modules/auth/domain/allowlist.ts` is a ten-line function that
compares one login against one configured string:

```ts
export function isAllowed(login: string | undefined, allowed: string): boolean
```

There is no multi-tenant model in the domain layer. `src/modules/auth/domain/auth-user.ts` adds
a Firebase `uid`-keyed identity intended for per-user documents, and its own comment calls the
GitHub-login path "legacy", so the migration is under way — but at `e318ab3` the vault is one
repo and the allowlist is one login.

## 4. The core loop, and how much of it exists

The brief's loop (§1) is: agent writes markdown → frontmatter opens the file and hashes each
span → spans changed since last review are tinted → the person reads, accepts or reverts → the
review state is written to a sidecar in the repo → repeat.

The loop as implemented at `e318ab3` is a different and shorter one:

1. The vault is read from GitHub as a zipball (`githubVaultReader.getZipball`), unpacked, and
   every `.md` file parsed into a `ParsedNote` (`src/modules/vault/domain/note.ts`).
2. `buildLinkIndex` derives outbound wikilinks and backlinks
   (`src/modules/vault/domain/link-index.ts`).
3. The result is a `VaultSnapshot`, cached, and served to the client
   (`makeGetSnapshot`, `snapshot-cache.ts`).
4. The person edits in CodeMirror; unsaved content lands in IndexedDB
   (`src/modules/drafts/infrastructure/draft-store.ts`).
5. Saving creates a git blob, tree, commit and ref update through `RepositoryWriter`
   (`src/modules/repository/application/ports.ts`), i.e. **every save is a commit**.
6. If the remote moved, `merge3` performs a conservative line-based three-way merge and emits
   git-style conflict markers rather than guessing
   (`src/modules/repository/domain/merge3.ts`).

**Steps 2, 3 and 5 of the brief's loop — the span hash, the tint, and the sidecar — do not
exist in the code.** Evidence: `grep -rn "review\.jsonl\|reviewState\|review-state\|\.frontmatter/" src`
returns nothing, and `grep -rln "sidecar" src` returns nothing. Review state exists in
`docs/PRODUCT-BRIEF.md` and in the `specs/` directory; it has no representation in `src/`.

## 5. The entities

### Document

A markdown file, addressed by a vault-relative path such as `Projects/HQ/Foo.md`. Two distinct
representations exist and the split matters.

**Bytes.** What every write path is required to preserve. The unit of an offset into a document
is fixed by `src/modules/mdmax/domain/offsets.ts` as the **UTF-16 code unit**, not the byte and
not the code point, because that is what CodeMirror reports and what mdast positions use. Bytes
appear only at edges (a git blob, a content hash). The file records the measurement that forced
the decision: only 67 of 1,080 files in the pinned corpus have
`bytes == UTF-16 code units == code points`. Conversion happens in exactly one place, `OffsetMap`,
and offsets are branded types (`U16Offset`, `ByteOffset`, `GraphemeIndex`) so the compiler
refuses to mix them.

**Parsed.** `ParsedNote` — path, title, tags, outbound wikilinks, embeds, raw front-matter
key-values, and an `excludeFromGraph` flag for anything under `_Archive/`. This is a derived
view used for search, the graph and backlinks. It is never a source of truth: the projection
rule the product is built on is that a cache disagreeing with a file means the cache is wrong.

A document also has a **front matter block** — the YAML between the opening and closing `---`
fences. Note the collision: the product is called frontmatter and the block is called front
matter. Where it matters below I write the block as two words.

### Span

A contiguous region of a document that review state, attribution and comments would all be
anchored to. **The span is the product's central entity and it does not exist as a type in
`src/`.** What exists is the machinery a span would be built from:

- `readonly byteRange: readonly [number, number]` on `CertBlock`
  (`src/modules/mdmax/domain/cert-contract.ts`) — the closest thing in the code to a span,
  but scoped to the certificate artefact, not to review.
- `normalize()` (`src/modules/mdmax/domain/normalize.ts`) — NFC, collapse whitespace,
  lowercase, NFC again. This is documented as "the hash input for every stored anchor", and it
  is versioned (`mdmax/normalize@1`) precisely because changing it would silently re-key every
  anchor already persisted.
- `OffsetMap` — the one place a span's offsets could be converted between units.

The brief's design is byte start, byte end and a content hash per span, relocated by the splice
locator when the file changes. None of that is written.

### Review state

Who has read which span, and when. The brief specifies it as one JSON line per span in
`.frontmatter/review.jsonl`, committed beside the documents in the user's own repo, holding
file path, byte start, byte end, content hash, reviewed-by, reviewed-at, and optionally author,
model and prompt.

**Not implemented.** Zero occurrences in `src/`. This is the product's headline capability and
it is unbuilt.

The nearest shipped thing in the codebase is version history: `getNoteHistory` and
`getNoteVersion` (`src/modules/vault/application/`) list commits that touched a path and read
the file at a given SHA. That is per-commit and per-file, not per-span and not per-person.

### Sidecar

A file that carries metadata about documents without being inside them. The design constraint
that produces it is stated in the brief F10: every in-file comment syntax renders as visible
garbage on GitHub, so review state and comments must live outside the `.md`.

The same rule appears independently in the engine. `cert-contract.ts` rule 5:

> THE ARTIFACT IS A JSON SIDECAR, NEVER WRITTEN BACK INTO THE `.md`.

So the codebase has the *principle* in two places and the *file* in none. **No sidecar is
written by any code path in `src/`.**

### Splice

The write primitive. A splice locates the bytes that represent one thing and replaces only those
bytes, leaving every other byte in the file untouched. It is defined against the alternative it
replaces — regenerating the file from a parse tree — which rewrites comments, quoting style, key
order, blank lines and explicit type tags that the author never asked to change.

The one shipped implementation is `src/modules/share/domain/splice-frontmatter.ts` (282 lines),
which splices a single top-level front-matter key. It reads as a catalogue of the ways a naive
implementation loses data:

- It never parses YAML. It scans the block line-wise for a top-level key.
- It preserves the list shape already in the file — 90.1% of the pinned corpus writes flow form
  (`tags: [a, b]`), 8.4% block form — because converting one to the other rewrites authored bytes.
- It quotes a scalar only when the plain form would not read back as the same string, and only
  treats YAML indicators as special **in first position**. The over-broad earlier rule quoted
  435 of 907 corpus files unnecessarily.
- It splits a leading BOM off before matching the opening fence, because `FM_OPEN` is anchored
  at index 0 and without this the file's real block was pushed into the body while a new one was
  prepended. The comment records why the corpus never caught it: the oracle replayed
  set-then-delete and the two operations cancelled.

`spliceFrontmatterValue` and `spliceFrontmatterKey` are the two exported verbs.

### Refusal

Returning the input unchanged, or returning a typed failure, rather than guessing. `AGENTS.md`
rule 2 states it as product policy: "Returning the input unchanged is a correct outcome for
this product. Guessing is not. This is the whole differentiation."

Refusal is modelled as a value everywhere in the engine, never as an exception. The reason is
stated in three separate files in near-identical words: a route handler that throws on a user's
document is a route handler that 500s on a user's document. The typed refusals are:

| Where | Refusals |
|---|---|
| `shape-gate.ts` | `BUDGET_BYTES`, `BUDGET_LINES`, `BUDGET_BLOCKS`, `INVALID_UTF8`, `BUDGET_TIME`, `PARSER_THREW`, `WORKER_DIED` |
| `offsets.ts` | `NOT_AN_INTEGER`, `NEGATIVE`, `PAST_END`, `INSIDE_SURROGATE_PAIR` |
| `placement.ts` | `SKELETON_CHANGED`, `ADJACENT_TO_SETEXT_UNDERLINE`, `OFFSET_OUT_OF_RANGE`, `PARSER_THREW` |
| `cert-contract.ts` | `ENGINE_MISSING`, `ENGINE_THREW`, `SHAPE_REFUSED`, `NO_TARGETS` |
| `frontmatter-prepass.ts` | `REFUSED_AMBIGUOUS` |
| `splice-frontmatter.ts` | untyped: returns `src` unchanged |

The sharpest case is `frontmatter-prepass.ts`. `related: [[a]], [[b]]` is invalid YAML and is
repaired for reading; `related: [[[A]], [[B]]]` parses **cleanly** into `[[["A"]], [["B"]]]` and
destroys the links, so it is refused rather than repaired — the file's comment says any repair
there is a guess about intent and the cost of guessing wrong is a silently rewritten link.

Refusal has a measured cost, and it is the largest open defect in the product. NF-1: a YAML
block sequence written at column zero — PyYAML's own default output shape — causes the splice
writer to refuse the whole file. The spec puts the blast radius at 6,613 of 6,614 foreign
refusals, 83.10% aggregate. `src/modules/share/domain/splice-frontmatter.ts` also refuses any
key outside `SAFE_KEY` (`/^[A-Za-z0-9_.$-]+$/`), which excludes every non-ASCII key; the file
explains that this is honest rather than squeamish, because supporting `café` first requires
deciding what key equality means under NFC versus NFD.

### Attribution

Who or what wrote a span: author, model, timestamp, prompt. The design is to **read** it from
whatever the write already carried — an MCP write, a commit trailer, a git-ai note, signed
provenance metadata — and to say so explicitly when none exists.

The certificate contract has a field for the shape of a verdict's provenance, and the
`Certificate` records `file.sha256`, but **there is no attribution reader in `src/`**. The only
authorship in the codebase is a single hardcoded constant in the composition root:

```ts
const AUTHOR = { name: "Sagnik Mitra", email: "sagnikmitra123@gmail.com" } as const
```

Every commit the app makes on behalf of the user is authored as that person
(`src/container/dependency-container.ts`). That is a correct single-user arrangement and an
obstruction to F3 and F10.

### Vault

A tree of markdown files with wikilink semantics — Obsidian's model. `VaultSnapshot` is the
in-memory whole-vault view: notes, tree nodes, and the link index.

Two vault behaviours are worth stating because they are decisions, not defaults:

- **Wikilink resolution is deterministic by construction.** When two notes share a basename, the
  shortest path wins, then lexicographic order. The comment in `link-index.ts` gives the reason:
  otherwise the chosen target flips with vault iteration order, so `[[Daily]]` resolves
  differently across refreshes.
- **Case-insensitive fallback.** `[[hq]]` counts as a backlink to `HQ.md`, matching Obsidian.

`RAW_BLOCKED_PREFIXES` in the composition root (`src/`, `docs/`, `specs/`, `public/`,
`.github/`, `.claude/`, `.vercel/`, `node_modules/`) keeps raw file access scoped to the vault
rather than to the repository that contains it — which is the line between the two entities.

### Repository

The git repository the vault lives in, and the write target. Modelled as a port,
`RepositoryWriter`, whose eight methods are all git plumbing: `getHeadCommit`, `getBlobSha`,
`createBlob`, `createBinaryBlob`, `createTree`, `createCommit`, `updateRef`. The single adapter
is `github-writer.ts`.

The domain types are `FileChange` (path, content, **baseSha**), `Deletion`, `CommitRequest`,
`CommitResult`, and `ConflictError` carrying the conflicting paths. `baseSha` on every change is
what makes a commit optimistically concurrent: if the blob moved underneath, the write conflicts
rather than overwriting.

The consequence for the product is that **the repository, not a database, is the persistence
layer**. The brief's architecture diagram says the control plane holds identity, team membership,
entitlements and billing, and no document bytes.

## 6. The thirteen modules

One folder per bounded context, each with some subset of `domain/`, `application/`,
`infrastructure/`, `presentation/` and a barrel `index.ts`. Five modules have a domain layer;
eight do not. A module with no domain layer owns no domain concept, and saying so is more useful
than inventing one — so the right-hand column below distinguishes the two cases.

| Module | Layers present | Files | What it owns |
|---|---|---|---|
| **mdmax** | domain, application, infrastructure | 13 | **The engine, and the only part of the product this repo authored.** Domain: the offset model, the shape gate, the equivalence fold, the verdict classifier, the certificate contract, the target registry, the construct corpus, the placement fixture, `normalize/1`, `slug/1`, and the lenient front-matter pre-pass. No barrel — see §7. |
| **share** | domain, application, infrastructure, presentation | 16 | Public-share slugs, and **the splice writer**. `domain/slug.ts` owns slug validity and the reserved-word set (slugs sit at the URL root, so any future top-level route would shadow one). `domain/splice-frontmatter.ts` owns byte-exact front-matter writes. |
| **vault** | domain, application, infrastructure, presentation | 30 | The vault: `ParsedNote`, `LinkRef`, and the bidirectional link index with its deterministic basename resolution. Largest module by file count. |
| **repository** | domain, application, infrastructure, presentation | 12 | Git as a domain: commit request/result, conflict, and the conservative line-based three-way merge (`merge3.ts`, 183 lines, LCS-derived, conflicts rather than combines). |
| **auth** | domain, application, infrastructure, presentation | 14 | Identity. Two shapes side by side: `ActorContext` (GitHub login, called legacy in its own comment) and `AuthUser` (Firebase `uid`, the key Firestore rules match on). Both deliberately hold **no token** — the comment states access tokens stay server-side and ID tokens are fetched on demand through the port. |
| **ai** | application, infrastructure | 11 | No domain layer. Owns the `LlmClient` port and six use-cases: refine, summarise, suggest links, link doctor, generate document, apply wikilink suggestion. The port's `generate` returns `Promise<string>` — a bare string, which is defect 7 in the brief's fix-first list. |
| **preview** | presentation only | 21 | No domain layer. Renders markdown: wikilinks, embeds, callouts, editable tables, mermaid, KaTeX, the outline, backlinks, unlinked mentions, the properties panel. Carries one policy that reads as domain — `DISALLOWED_RAW_HTML_ELEMENTS`, a 13-element blocklist including `script`, `iframe`, `form` and `style`. |
| **editor** | presentation only | 22 | No domain layer. The CodeMirror 6 shell: four modes (live, edit, split, read), tabs, toolbar, slash commands, ghost text, completions, split-scroll sync, bookmarks, and the live-preview block splitter. |
| **app-shell** | presentation only | 21 | No domain layer. Frame and navigation: command palette, spotlight, search panel, settings and import modals, theme toggle, PWA registration, Tauri bridge. |
| **export** | presentation only | 5 | No domain layer. One document to HTML or PDF, plus print CSS. Its barrel deliberately does **not** export `renderPdfHtmlDocument`, because that path uses `react-dom/server` and must stay server-side. |
| **graph** | presentation only | 3 | No domain layer. The force-directed vault graph. Reads `NoteMeta` from vault and reuses `setBasenameEntry` from the vault domain rather than re-deriving resolution. |
| **drafts** | infrastructure only | 2 | No domain layer. Unsaved content in IndexedDB plus a `localStorage` dirty index. Note the persistence keys still carry the `sgnk-md` prefix (`sgnk-md:dirty`) — `AGENTS.md` §8 says renaming them orphans a user's local drafts and they must change only behind a migration. |
| **ai-tools** | presentation only | 2 | No domain layer. A single button component. |

## 7. What is owned, and what is forked

The editor shell is a fork of a sibling product, `md` (the app formerly and still internally
called `sgnk-md`). I verified the brief's figures against
`/Users/sagnikmitra/Desktop/GitHub/md` with `cmp` rather than taking them on trust, and both
reproduce exactly:

```
src/modules/editor + src/modules/app-shell:  identical 41, diverged 2, unique 0   (43 files)
src/ (all .ts/.tsx):                         identical 181, diverged 25, unique 20 (226 files)
```

The twenty files that exist here and not in the sibling are the whole of what this product owns:

- **13 files** — all of `src/modules/mdmax`
- **1 file** — `src/modules/share/domain/splice-frontmatter.ts`
- **6 files** — the Firebase auth path (`auth/application/ports.ts`, `auth/domain/auth-user.ts`,
  `auth/infrastructure/firebase-auth-gateway.ts`, `auth/presentation/GoogleSignInButton.tsx`,
  `shared/infrastructure/firebase/client.ts`, `container/client-container.ts`)

So the engine is fourteen files: thirteen in mdmax plus the splice writer. Everything else in
`src/` is either inherited or diverged from inherited.

**mdmax is largely unwired.** Exactly one symbol from one of its thirteen files reaches product
code:

```
$ grep -rn "modules/mdmax" src | grep -v "^src/modules/mdmax"
src/modules/vault/application/get-snapshot.ts:13:import { decodeStrict } from "@/modules/mdmax/domain/shape-gate";
src/modules/vault/infrastructure/search-index.ts:16:import { decodeStrict } from "@/modules/mdmax/domain/shape-gate";
```

No certificate, verdict, fold, offset map, placement fixture, construct corpus, `normalize/1`,
`slug/1` or front-matter pre-pass is called from anywhere in the running application. The module
also has **no `index.ts` barrel**, which is why both call sites deep-import in violation of
`AGENTS.md` §2 — the barrel rule has no barrel to route through.

Two related facts, both verified here:

- `node scripts/mdmax-cert.mjs` exits with `ERR_MODULE_NOT_FOUND` on
  `src/modules/mdmax/domain/offsets` imported from `application/certify.ts`. `cert` is not one
  of the 26 scripts in `package.json`. The certificate capability has never been runnable from
  a command.
- `entities` is imported directly by `domain/fold.ts` and `domain/verdict.ts` and is **not in
  `package.json`**. It resolves out of hoisted `node_modules` at version 8.0.0. Any claim that
  the engine drops into another host unchanged fails at that import.

## 8. What the domain does not have

Stated plainly, with the evidence, because the alternative is a document that reads as though
the product is finished.

| Concept | Status | Evidence |
|---|---|---|
| Review state | **Does not exist in code** | `grep -rn "review\.jsonl\|reviewState\|review-state\|\.frontmatter/" src` → 0 hits |
| Sidecar file | **Does not exist in code** | `grep -rln "sidecar" src` → 0 hits |
| Span as a type | **Does not exist**; `CertBlock.byteRange` is the nearest thing, and it is scoped to certificates | read `cert-contract.ts` in full |
| Attribution reader | **Does not exist**; a single hardcoded `AUTHOR` constant instead | `dependency-container.ts` |
| MCP server | **Does not exist** | no `src-tauri` MCP path; brief lists it as MVP-1 |
| Continuous integration | **Does not exist** | `.github/workflows` — no such directory |
| Bundle/byte budget | **Is an `echo`** | `package.json`: `"budget": "echo 'No bundle budget configured yet — skipping'"` |
| Bring-your-own AI key | **Does not exist**; provider keys are operator-side env names | `src/config/env.ts` exposes `AI_PROVIDER_KEYS`, `GROQ_API_KEY`, `MISTRAL_API_KEY`, `OPENROUTER_API_KEY`, `CEREBRAS_API_KEY`, `GOOGLE_GENERATIVE_AI_API_KEY` |
| Structured LLM output | **Does not exist**; the port returns `Promise<string>` | `src/modules/ai/application/ports.ts` |
| A verified spec | **None**. All 4 specs are `state: draft`; 169 of 171 module files are ungoverned | `node specs/harness/spec-report.mjs` |
| NF-1, NF-3 fixes | **Open**, and honestly marked. 6 `it.fails` red proofs assert the correct behaviour and pass by failing | `npx vitest run` → "1581 passed, 6 expected fail" |
| `src-tauri` identity | **Still the sibling app's** (`ai.sgnk.md`) | brief §9 row 9; not re-verified in this pass — **unverified** |

What *is* green, and was run here rather than recalled:

```
npx vitest run                                  100 files, 1,581 pass, 6 expected fail
node specs/harness/clean-architecture-report.mjs  total 0, 208 files scanned
node specs/harness/spec-report.mjs                4 scanned, 0 errors, 0 warnings
node scripts/corpus-foreign.mjs verify            8,513 / 8,513 byte-identical, 0 changed
```

The corpus is 8,513 markdown files across 7 vendored Obsidian vaults, 18.2 MB, each pinned to a
commit. Note that `specs/engine/nf-001-zero-indent-sequence.md` states its blast radius over
**7,969 files** while the corpus gate counts **8,513**. I did not reconcile the two populations
— **unverified** which subset the 7,969 refers to.

---

## Where to go next

- `docs/15-GLOSSARY.md` — every term above, defined once.
- `docs/PRODUCT-BRIEF.md` — the plan, 560 lines, safe to read whole. §9 is the defect list.
- `AGENTS.md` — the operating rules, and accurate.
- `specs/_schema/states.md` — why no spec is `verified` and why a human cannot write that word.
