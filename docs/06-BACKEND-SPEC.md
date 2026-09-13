---
mode: reference
updated: 2026-09-09
verified_against: 6331b1b
---

# Backend specification

> **Method.** I read `AGENTS.md`, `package.json`, `eslint.config.mjs`, `next.config.ts`,
> `src/proxy.ts`, `src/config/env.ts` (structure and variable names only), and in full:
> `src/container/dependency-container.ts`, `src/container/client-container.ts`,
> `src/instrumentation.ts`, `src/shared/infrastructure/github/client.ts`,
> `src/modules/vault/infrastructure/vault-reader.ts` and `snapshot-cache.ts`,
> `src/modules/repository/application/ports.ts` and the head of `commit-changes.ts`,
> `src/modules/repository/infrastructure/github-writer.ts` (symbol map + endpoint list),
> `src/modules/ai/application/ports.ts`, the head of `gateway-client.ts`,
> `src/modules/auth/domain/allowlist.ts`, `src/modules/auth/presentation/session.ts`,
> `src/modules/auth/infrastructure/auth-options.ts` (provider config only), the header of
> every file in `src/modules/mdmax`, and every module barrel. I ran the import graph, the
> layer census, the test suite, the architecture gate and the spec gate; each number below
> names the command that produced it. I also ran four adversarial probes: temporary files
> containing deliberate layer violations, linted and gated, then deleted
> (`git status --porcelain src/` empty after each). §4.1 reports what they found.
>
> **What this pass did NOT do.** I never read, opened, printed or referenced the contents of
> any `.env` file — environment variable NAMES only, taken from the zod schemas in
> `src/config/env.ts`. I did not make a single network call: no GitHub API request, no
> deployed endpoint, no Vercel or Cloudflare console. I did not run `next build`, `npm run
> tree`, `npm run doc`, or `npm run corpus`, so the 8,513-file corpus gate is unverified in
> this pass. I did not read the bodies of `certify.ts` (375 lines), `bench.ts` (538),
> `verdict.ts` (411), `fold.ts` (430) or `constructs.ts` (618) — I read each file's header
> block and its exported symbols. I did not read `src-tauri/`. I did not open
> `docs/FRONTMATTER-PRD-v2-2026-08-29.md`, `docs/ENGINE.md`, `docs/CRITIQUE.md`,
> `docs/DEV-PLAN.md` or either of the large record files.

---

## 1. The census

```
find src -name '*.ts' -o -name '*.tsx' | wc -l          →  226
ls -d src/modules/*/ | wc -l                            →  13
find src/app/api -name 'route.ts' | wc -l               →  26
find test \( -name '*.test.ts' -o -name '*.test.tsx' \) | wc -l   →  100
npx vitest run    →  100 files, 1581 passed, 6 expected-fail (1587), 11.76s
node specs/harness/clean-architecture-report.mjs   →  {"total": 0, "filesScanned": 208}
node specs/harness/spec-report.mjs   →  4 scanned, 0 errors, 169 of 171 module files ungoverned, states draft=4
```

Thirteen module directories, not fourteen: `ai`, `ai-tools`, `app-shell`, `auth`, `drafts`,
`editor`, `export`, `graph`, `mdmax`, `preview`, `repository`, `share`, `vault`. The
fourteenth entry in `src/modules/` is a `README.md`.

Above and beside the modules: `src/shared/` (a four-layer shared kernel), `src/config/`,
`src/container/`, plus three loose files — `src/auth.ts`, `src/proxy.ts`,
`src/instrumentation.ts`.

---

## 2. Module by module

Line counts are `find <module> -name '*.ts*' -exec cat {} + | wc -l`, run per layer.

| Module | Files | Lines | domain | application | infrastructure | presentation | Barrel |
|---|---:|---:|---:|---:|---:|---:|---|
| `vault` | 30 | 3,164 | 2 / 156 | 7 / 543 | 4 / 596 | 16 / 1,846 | 23 lines |
| `editor` | 22 | 3,954 | — | — | — | 21 / 3,942 | 12 lines |
| `app-shell` | 21 | 2,687 | — | — | — | 20 / 2,671 | 16 lines |
| `preview` | 21 | 2,306 | — | — | — | 20 / 2,298 | 8 lines |
| `share` | 15 | 1,215 | 2 / 540 | 5 / 177 | 2 / 56 | 5 / 434 | 8 lines |
| `auth` | 14 | 884 | 3 / 41 | 1 / 33 | 4 / 302 | 5 / 499 | 9 lines |
| `mdmax` | 13 | 3,614 | 11 / 2,701 | 1 / 375 | 1 / 538 | — | **none** |
| `repository` | 12 | 1,399 | 2 / 224 | 7 / 595 | 1 / 188 | 1 / 353 | 39 lines |
| `ai` | 11 | 549 | — | 8 / 325 | 2 / 200 | — | 24 lines |
| `export` | 5 | 646 | — | — | — | 4 / 637 | 9 lines |
| `graph` | 3 | 685 | — | — | — | 2 / 678 | 7 lines |
| `ai-tools` | 2 | 590 | — | — | — | 1 / 589 | 1 line |
| `drafts` | 2 | 176 | — | — | 1 / 163 | — | 13 lines |

Read that table as three groups.

### 2.1 Modules that carry real logic

**`mdmax` — 13 files, 3,614 lines, 75% of it domain.** The only module this product owns
outright (§6). Eleven pure-domain files: `cert-contract.ts` (168), `constructs.ts` (618),
`fold.ts` (430), `frontmatter-prepass.ts` (121), `normalize.ts` (62), `offsets.ts` (315),
`placement.ts` (154), `shape-gate.ts` (174), `slug.ts` (115), `targets.ts` (133),
`verdict.ts` (411); one application file `certify.ts` (375); one infrastructure file
`bench.ts` (538). Highest domain-to-total ratio in the repo by a wide margin. Its layering
is correct — `certify.ts` takes `Engine` as an injected domain interface and never imports
`bench.ts`, and the file says why: "the architecture gate forbids it importing
infrastructure. That constraint happens to be the right design anyway."

**`vault` — 30 files, 3,164 lines, the widest module.** Real logic in all four layers.
`domain/link-index.ts` (126) builds the wikilink graph; `application/get-snapshot.ts` (248)
unzips a GitHub zipball, decodes every `.md` strictly, parses it, builds the tree and the
link index, and caches the result; `infrastructure/search-index.ts` (345) is a MiniSearch
index plus unlinked-mention detection; `infrastructure/markdown-parser.ts` (186) is the
note parser. Presentation is 1,846 lines across 16 files, mostly the file tree.

**`repository` — 12 files, 1,399 lines.** The write path. `domain/merge3.ts` (183) is a real
three-way merge with conflict markers (`CONFLICT_LOCAL`/`SEP`/`REMOTE`).
`application/commit-changes.ts` (102) does optimistic-concurrency conflict detection before
any write and holds a write-path denylist. `application/file-ops.ts` (175) validates note
paths and rewrites wikilinks on rename. `infrastructure/github-writer.ts` (188) is the only
implementation of `RepositoryWriter`.

**`share` — 15 files, 1,215 lines, and 540 of them are domain.** `domain/slug.ts` (258) —
validation, suggestion, `RESERVED_SLUGS`, `publicHref`. `domain/splice-frontmatter.ts` (282)
— the byte-exact frontmatter writer. That second file is the product's differentiator and
it lives here, not in `mdmax` (§7).

**`auth` — 14 files, 884 lines, split across two identity systems**, one live and one
unreachable (§6.2).

### 2.2 Modules that are thin wrappers

**`drafts` — 2 files, 176 lines, one of which is a 13-line barrel.** `draft-store.ts` (163)
wraps `idb-keyval` for IndexedDB writes plus a `localStorage` dirty index under the key
`sgnk-md:dirty`. It has an `infrastructure/` layer and nothing else. No domain, no port, no
application use-case. Correct for what it is.

**`ai-tools` — 2 files, 590 lines, and the barrel is one line long.** A single component,
`SgnkAiButton.tsx` (589), rendered once from `VaultWorkspace.tsx:225`. It is a module in
name; structurally it is one file with a directory around it. It also deep-imports
`@/modules/editor/presentation/active-view`, so it is coupled to another module's internals.

**`export` — 5 files, 646 lines, all presentation.** `export-doc.ts` (153, client-facing
HTML export), `pdf-doc.ts` (141, server-only unified pipeline), `print-css.ts` (156, shared
CSS), `ExportMenu.tsx` (187). No domain, no port. The PDF work happens in a route handler
that dynamically imports `pdf-doc.ts`; the module itself holds no server logic.

**`graph` — 3 files, 685 lines, all presentation.** `GraphView.tsx` (481) and
`graph-data.ts` (197). Builds a force-directed graph client-side from the vault snapshot.
Deep-imports `@/modules/vault/domain/link-index`.

**`preview` — 21 files, 2,306 lines, all presentation.** A large module with no domain,
because rendering markdown to React is what it does. Its riskiest file is
`markdown/html-policy.ts` (215), which is the sanitiser standing between `rehype-raw` and
the DOM. `PropertiesPanel.tsx` (235) reaches across into `share/domain/splice-frontmatter`
to write frontmatter.

**`app-shell` and `editor`** are presentation-only by construction, and are the forked
shell (§6.1).

### 2.3 The one module with no barrel

`src/modules/mdmax` has no `index.ts`. Every other module has one. Its two consumers
therefore *must* deep-import, which they do:

```
src/modules/vault/application/get-snapshot.ts:13    import { decodeStrict } from "@/modules/mdmax/domain/shape-gate"
src/modules/vault/infrastructure/search-index.ts:16 import { decodeStrict } from "@/modules/mdmax/domain/shape-gate"
```

That is the entirety of the engine's reach into the product (§7).

---

## 3. The composition root

`src/container/dependency-container.ts` — 144 lines, the only file in `src/` that wires
infrastructure to application. It exports two frozen objects.

**`container`** (24 members) resolves:

| Group | Members | Wired from |
|---|---|---|
| Vault reads | `getSnapshot`, `getFile`, `getNoteHistory`, `getNoteVersion`, `exportVaultZip` | `githubVaultReader` + `snapshotCache` + `parseMarkdown` |
| Repository writes | `commitChanges`, `createNote`, `renameNote`, `mergeNote`, `uploadAttachment` | `githubWriter` (+ `githubMergeReader` for merges) |
| Direct passthroughs | `validateNotePath`, `getBlobSha`, `clearSnapshotCache`, `searchNotes`, `findUnlinkedMentions` | — |
| Raw file | `getRawFile(path)` — implemented inline, 20 lines | `githubFetch` |
| AI use-cases | `refineText`, `summarize`, `suggestLinks`, `linkDoctor`, `generateDocument` | `gatewayLlmClient` |

**`shareApi`** (5 members: `setShare`, `removeShare`, `listConflicts`, `resolvePublicNote`,
`listShares`) is built second because it depends on `container.commitChanges` and
`container.getSnapshot` — a deliberate two-phase construction annotated in the file.

Three things about this file are worth naming.

**It contains logic, not just wiring.** `getRawFile` is a 20-line inline implementation with
its own path-traversal rejection and a `RAW_BLOCKED_PREFIXES` denylist
(`src/`, `docs/`, `specs/`, `public/`, `.github/`, `.claude/`, `.vercel/`, `node_modules/`).
That denylist is a near-duplicate of `BLOCKED_WRITE_PREFIXES` in
`repository/application/commit-changes.ts` — the same eight prefixes, maintained twice, in
two layers, with a comment in the container saying it "mirrors the snapshot's
NON_VAULT_PREFIXES", which is a third copy. A path added to one is not added to the others.

**The commit author is a compile-time constant.**

```ts
const AUTHOR = { name: "Sagnik Mitra", email: "sagnikmitra123@gmail.com" } as const;
```

Every `createNote`, `renameNote`, `commitChanges` and `uploadAttachment` is constructed with
that author. The signed-in actor's identity is used for the auth gate and for the header
avatar, and never reaches a commit. `AGENTS.md` §7 states this is intentional.

**It is eagerly constructed at import time.** `container` is a module-level `const` with all
factories invoked. `snapshotCache` is a module-level `Map` capped at three entries. In a
serverless deployment that makes the cache per-instance and unshared; there is no external
cache. I did not measure hit rate. **unverified**.

`src/container/client-container.ts` (22 lines) is the browser-side counterpart. It is
imported by nothing — see §6.2.

---

## 4. Layer boundaries: what is enforced and what is not

### 4.1 What is enforced

`eslint.config.mjs` configures `eslint-plugin-boundaries` v6 with `default: "disallow"` and
eight element types. The permitted edges:

```
domain          →  domain, shared-domain
application     →  domain, application, shared-*, config
presentation    →  domain, application, presentation, shared-*
infrastructure  →  domain, application, infrastructure, shared-*, config
container       →  everything except presentation and app
app             →  domain, application, presentation, shared-*, container, config, app
middleware      →  application, infrastructure, shared-application, shared-infrastructure, config
config          →  config
```

Plus `no-restricted-imports` on `@/server/*`, `@/lib/*`, `@/components/*` — the permanent ban
on the deleted god folders. `specs/harness/clean-architecture-report.mjs` scans 208 files and
returns `total: 0`.

The layer direction — domain ← application ← infrastructure, presentation and container
above, inward only — holds everywhere I checked in the shipped tree. But only one of the two
gates would notice if it stopped holding, and it has a hole. I proved both by writing probe
files, running the gates, and deleting the probes (`git status --porcelain src/` empty
afterwards, checked each time).

**Probe 1 — `application → infrastructure`,** the textbook violation, written into
`src/modules/vault/application/__probe_app_infra.ts`:

```
node specs/harness/clean-architecture-report.mjs
  {"total": 1, "filesScanned": 209,
   "summary": {"layer-imports-infrastructure-or-container": 1}, ...}     ← CAUGHT
npx eslint src/modules/vault/application/__probe_app_infra.ts
  (no output)                                                            ← MISSED
```

**Probe 2 — `domain → infrastructure`,** the most fundamental violation available, written
both as an `@/` alias and as a relative `../infrastructure/…` specifier:

```
node specs/harness/clean-architecture-report.mjs
  {"total": 0, "filesScanned": 210, "violations": []}                    ← MISSED (both forms)
npx eslint <both files>
  (no output)                                                            ← MISSED (both forms)
```

Two conclusions, each proven rather than inferred.

**The `boundaries/dependencies` rule produces no diagnostics at all.** In a single probe file
containing both an `@/lib/*` import and an `application → infrastructure` import, eslint
reported the first and stayed silent on the second:

```
npx eslint src/modules/vault/application/__probe_lint.ts
  1:1  error  '@/lib/thing' import is restricted from being used by a pattern  no-restricted-imports
  ✖ 1 problem (1 error, 0 warnings)          exit 1
```

So eslint is running, the flat config is loaded, and `no-restricted-imports` fires — while the
eight-rule boundaries block beneath it does not. The likely mechanism is that
`eslint.config.mjs` sets no `import/resolver`, so `eslint-plugin-boundaries` cannot map an
`@/…` specifier to a file and treats the dependency as unclassified; but the probe imports
were missed in *relative* form too, so resolution alone may not be the whole story.
**The mechanism is unverified; the silence is verified.** `AGENTS.md` and the header comment
in `eslint.config.mjs` both state that "cross-layer imports fail the build". As shipped at
`e318ab3`, they do not.

**The harness gate does not check `domain`.** Its own header lists what it fails on: "app /
presentation / application import from any infrastructure folder". `domain` is absent from
that set — verified by reading `clean-architecture-report.mjs` and by probe 2. Everything the
gate does catch, it catches well; the file even carries a written postmortem of a previous
blindness bug and a `MIN_SCANNED_FILES` floor added to prevent it. This is the same class of
hole, one layer over.

### 4.2 What is not enforced

Three rules in `AGENTS.md` have no gate behind them.

**Cross-module barrel discipline (`AGENTS.md` §2).** The boundaries plugin is keyed on layer
*type*, not module *name*, so `presentation → presentation` across two different modules is
permitted by the config. Counting imports of `@/modules/<X>/<layer>/...` from files outside
`src/modules/<X>/`:

```
38 total, of which 25 are composition roots
  22  src/container/dependency-container.ts
   2  src/container/client-container.ts
   1  src/auth.ts
```

Leaving **13** non-composition deep imports. Two of those (`get-snapshot.ts`,
`search-index.ts` → `mdmax`) are unavoidable because `mdmax` has no barrel. The other
eleven:

| From | To |
|---|---|
| `src/app/api/vault/create/route.ts` | `@/modules/repository/application/file-ops` |
| `src/app/api/vault/rename/route.ts` | `@/modules/repository/application/file-ops` |
| `src/app/api/vault/file/route.ts` | `@/modules/vault/application/get-file` |
| `src/app/api/export/pdf/[...path]/route.ts` | `@/modules/vault/application/get-file` |
| `src/app/api/share/route.ts` | `@/modules/share/domain/slug` |
| `src/app/(public)/[slug]/page.tsx` | `@/modules/share/presentation/PublicNoteView` |
| `src/proxy.ts` | `@/modules/share/domain/slug` |
| `src/modules/preview/presentation/PropertiesPanel.tsx` | `@/modules/share/domain/splice-frontmatter` |
| `src/modules/ai-tools/presentation/SgnkAiButton.tsx` | `@/modules/editor/presentation/active-view` |
| `src/modules/editor/presentation/EditorPane.tsx` | `@/modules/vault/domain/link-index` |
| `src/modules/graph/presentation/graph-data.ts` | `@/modules/vault/domain/link-index` |

The `src/proxy.ts` line is the interesting one. The eslint `middleware` rule permits
`application`, `infrastructure`, `shared-application`, `shared-infrastructure` and `config` —
**not `domain`** — and `proxy.ts` imports `RESERVED_SLUGS` from a `domain` file. That should
be a lint error under the config as written. `npx eslint src/proxy.ts` reports nothing, which
§4.1's probes explain: the boundaries rule is not producing diagnostics for anything.

**`process.env` confinement (`AGENTS.md` §6).** The rule is that `process.env` is read only
in `src/config/` and `*/infrastructure/`. Eight reads sit outside both:

```
src/app/layout.tsx:21                        NEXT_PUBLIC_SITE_URL
src/app/sitemap.ts:3                         NEXT_PUBLIC_SITE_URL
src/app/robots.ts:3                          NEXT_PUBLIC_SITE_URL
src/proxy.ts:31,32                           NODE_ENV, DEV_BYPASS_AUTH
src/app/api/export/pdf/[...path]/route.ts:116,128   CHROMIUM_PACK_URL, LOCAL_CHROME_PATH
src/container/dependency-container.ts:134    NEXT_PUBLIC_SITE_URL
```

None is a secret; all are configuration. But `NEXT_PUBLIC_SITE_URL` is read in four separate
places with the same `?? "https://frontmatter.in"` fallback inlined at each, so the default
is maintained four times.

**Continuous integration.** `ls .github` → *No such file or directory*. There is no workflow,
no push gate, no PR check. `npm run verify` exists and is correct; nothing runs it but a
human. `npm run budget` is `echo 'No bundle budget configured yet — skipping'` and exits 0,
so a caller that treats exit code as truth records a pass.

---

## 5. Delivery: the API surface

26 `route.ts` files under `src/app/api/`. Exported handlers: 11 `GET`, 15 `POST`, 1 `DELETE`
as explicit functions, plus `export const { GET, POST } = handlers` in the NextAuth
catch-all — 29 endpoints in total.

| Group | Routes |
|---|---|
| Vault reads | `snapshot`, `file`, `history`, `version`, `search`, `unlinked`, `raw/[...path]` |
| Vault writes | `create`, `delete`, `rename`, `folder`, `restore`, `upload`, `merge` |
| Commit | `commit` |
| Export | `export/vault` (zip), `export/pdf/[...path]` |
| Share | `share` (GET/POST/DELETE), `share/conflicts` |
| AI | `ai/complete`, `ai/refine`, `ai/summarize`, `ai/suggest-links`, `ai/link-doctor`, `ai/generate-doc` |
| Auth | `auth/[...nextauth]` |

**Every route except the NextAuth catch-all calls `getActor()` as its first act.** I checked
by grep across all 26 files; the catch-all is the only one without it, which is correct.
Routes self-gate and return JSON 401 rather than redirecting, and `src/proxy.ts` explicitly
skips `/api/` for that reason (a redirect would hand a `fetch()` an HTML body instead of an
error).

Input validation is `zod` in 11 of the routes; the rest take no body or only query params.

`grep -rl 'dependency-container' src/app/api --include=route.ts` returns **24 of 26** route
files; two of those reach `shareApi` rather than `container` (`share/route.ts` reaches both).
The two that do not import the composition root are `auth/[...nextauth]` (correctly — it
re-exports the Auth.js handlers) and `ai/complete`, which imports `gatewayLlmClient` straight
from the `@/modules/ai` barrel. That second one is legal under the boundaries config (a barrel
import, `app → module`) but inconsistent with the other five AI routes, which all go through
`container`.

---

## 6. The fork, and what is dead

### 6.1 How much of the backend is this product's

Comparing every `.ts`/`.tsx` file under `src/` byte-for-byte against the sibling repository
at `/Users/sagnikmitra/Desktop/GitHub/md`:

```
identical = 181   differs = 25   only_in_frontmatter = 20   total = 226
```

The 20 files that exist only here:

- **13** — the whole of `src/modules/mdmax`
- **5** — the unreachable Firebase auth path (`client-container.ts`, `auth/application/ports.ts`,
  `auth/domain/auth-user.ts`, `auth/infrastructure/firebase-auth-gateway.ts`,
  `auth/presentation/GoogleSignInButton.tsx`)
- **1** — `shared/infrastructure/firebase/client.ts`, reachable only from that path
- **1** — `share/domain/splice-frontmatter.ts`

So of 20 unique files, **14 are the product** (mdmax plus the splice writer, 3,896 lines) and
**6 are an unwired identity system** (260 lines).

The sibling's HEAD is `02c22ec4`, dated 2026-07-17 — the same day as this repo's fork commit
`0c1b427` ("feat: clone md app into frontmatter (product base)", 2026-07-17 00:40 +0530) —
and its working tree is dirty. So this is a comparison against a fixed snapshot; it does not
describe today's upstream. `git rev-list --count HEAD` gives 92 commits here, all by one
author.

### 6.2 The unwired identity system

`src/container/client-container.ts` is a complete browser composition root that lazily
constructs a Firebase `AuthGateway`. Its own docstring says "Client components under
`src/app` import from here."

```
grep -rn "client-container" src test specs scripts   →  (no matches outside the file itself)
```

Nothing imports it. Following the chain outward, none of these is reachable from a running
code path:

| File | Lines | Reachable from |
|---|---|---|
| `src/container/client-container.ts` | 22 | nothing |
| `src/shared/infrastructure/firebase/client.ts` | 40 | `firebase-auth-gateway.ts` only |
| `src/modules/auth/infrastructure/firebase-auth-gateway.ts` | 61 | `client-container.ts` + one test |
| `src/modules/auth/application/ports.ts` | 33 | the barrel, `client-container.ts`, `GoogleSignInButton` |
| `src/modules/auth/domain/auth-user.ts` | 21 | the `auth` barrel only |
| `src/modules/auth/presentation/GoogleSignInButton.tsx` | 105 | the `auth` barrel only, 0 render sites |

The `auth` barrel labels these "the identity system that replaces Auth.js". The live system
is Auth.js: `src/auth.ts` → `auth-options.ts`, with two providers, GitHub OAuth and a
credentials provider `sgnk-password` backed by `infrastructure/password.ts` (99 lines).
`LoginScreen.tsx` renders `PasswordLoginForm` and a GitHub `signIn` button, and nothing else.

**The replacement is written and unwired.** `firebase` 12.16.0 sits in `dependencies` and is
reachable only from code nothing imports.

Also never imported anywhere: `src/shared/presentation/Icon.tsx` (77 lines) and
`src/modules/preview/presentation/markdown/editable-table.tsx` (165). Total dead surface
across the repo: **640 lines in 10 files**.

---

## 7. The engine's reach into the product

```
grep -rn "mdmax" src --include='*.ts' --include='*.tsx' | grep -vc '^src/modules/mdmax/'   →  2
```

Two imports, both of `decodeStrict`, both from `domain/shape-gate.ts`, both in the `vault`
module. That is one symbol out of one of thirteen files. `docs/PRODUCT-BRIEF.md` §9 row 4
states this and it re-derives exactly.

Everything else in `mdmax` — the certificate contract, the construct corpus, the equivalence
fold, the verdict classifier, the target registry, the offset model, the placement fixture,
the slug algorithm, the normalise function, the front-matter pre-pass — is reachable only
from `test/mdmax/*` (7 test files) and from `scripts/mdmax-cert.mjs`.

### 7.1 The CLI does not run

```
node scripts/mdmax-cert.mjs --bench-info
  Error [ERR_MODULE_NOT_FOUND]: Cannot find module
  '.../src/modules/mdmax/domain/offsets' imported from
  '.../src/modules/mdmax/application/certify.ts'
```

Reproduced at `e318ab3`. The cause is extensionless relative specifiers: `certify.ts`
imports `'../domain/offsets'` and Node's ESM resolver requires the extension. `cert` is not
among `package.json`'s 26 scripts, so there is no supported entry point either. This is
`PRODUCT-BRIEF` §9 row 10, confirmed.

### 7.2 `entities` is an undeclared dependency

```
node -e 'const p=require("./package.json");console.log(p.dependencies.entities, p.devDependencies.entities)'
  →  undefined undefined
```

`src/modules/mdmax/domain/fold.ts:43` imports `decodeHTML, escapeText` from `'entities'` and
`domain/verdict.ts:53` imports `decodeHTML` from it. The engine's only two non-Node,
non-relative imports are `entities` and `github-slugger`; the second is declared, the first
is not. It resolves today out of hoisted `node_modules` (it is a transitive dependency of
the remark/rehype stack). Any claim that the engine drops into another host unchanged fails
here first. `PRODUCT-BRIEF` §9 row 11, confirmed.

### 7.3 The byte-exact writer is not in the engine

The file the product's core promise depends on is
`src/modules/share/domain/splice-frontmatter.ts` (282 lines), in the `share` module. It
exports `SAFE_KEY`, `emitValue`, `emitScalar`, `spliceFrontmatterValue`,
`spliceFrontmatterKey`. It is called from exactly two places:
`share/infrastructure/share-writer.ts` (to write `public_slug`) and
`preview/presentation/PropertiesPanel.tsx` (to edit properties in the UI).

The two open engine defects are defects in that file:

- **NF-1** — a YAML block sequence item at column zero (`- alpha` under `tags:`) has no
  colon, is not indented and is not a comment, so `spliceFrontmatterValue` classifies it as
  "not a plain map" and returns the source unchanged. The red proof
  (`test/corpus/foreign/nf-001-red-proof.test.ts`) records the measured blast radius as
  6,613 of 6,614 foreign refusals, 82.98% of the corpus's 7,969 frontmatter-bearing files.
  I did not re-run the corpus sweep, so that percentage is quoted from the test file, not
  re-derived here. **unverified in this pass.**
- **NF-3** — a bare-CR frontmatter fence causes a second frontmatter block to be written.

Both have proper red proofs, and all six `it.fails` assertions in the suite come from those
two files. `it.fails` inverts the result, so today they "pass" by failing; when the writer is
fixed they go red, which is the signal to remove the marker. That is the right shape and it
matches `AGENTS.md` rule 1.

---

## 8. Tenancy: what the code actually is

This is the largest single fact in the backend and it is not stated in the plan in these
words.

**One repository.** `src/shared/infrastructure/github/client.ts` sends every request with
`Authorization: Bearer ${repoEnv.GITHUB_REPO_TOKEN}` against `repoEnv.GITHUB_REPO` on
`repoEnv.GITHUB_BRANCH`. Three environment variables, no per-request repository parameter.

**One token, and it is not the user's.**

```
grep -rn "accessToken\|access_token" src --include='*.ts' --include='*.tsx'   →  (no matches)
```

The GitHub OAuth session is never used to reach the GitHub API. All reads and writes use the
one server-side token.

**One user.** `src/modules/auth/domain/allowlist.ts`:

```ts
export function isAllowed(login: string | undefined, allowed: string): boolean {
  if (login === undefined || login.trim() === "") return false;
  return login.trim().toLowerCase() === allowed.trim().toLowerCase();
}
```

`allowed` is a single string (`ALLOWED_GH_LOGIN`), not a list. The GitHub sign-in callback
gates on it. The credentials provider is gated to "only the configured `SGNK_AUTH_USER`" by
its own comment. So the deployed application admits exactly one identity.

**One author.** Commits are attributed to the hardcoded `AUTHOR` constant regardless.

The write-path denylist in `commit-changes.ts` is consistent with this and says so: it blocks
`src/`, `docs/`, `.github/` and the build config "from being clobbered by any path that
reaches a commit (defense-in-depth; **the sole authorized actor** can still edit these via git
directly)".

None of this is a defect. It is what a single-tenant personal deployment looks like, and it
is coherent. It matters because the product plan describes ten pilot users bringing their own
repositories and their own agents, and **not one line of the code supports a second
repository, a second token, or a second user.** That is a build, not a configuration change:
`repoEnv` would become request-scoped, `githubFetch` would take a token, `snapshotCache` keyed
by repo, `isAllowed` a set membership test, `AUTHOR` derived from the actor.

---

## 9. AI: server-billed, string-typed

`src/modules/ai/application/ports.ts` is the whole contract:

```ts
export interface LlmClient {
  generate(input: { prompt: string; system?: string; speedFirst?: boolean }): Promise<string>;
}
```

A bare string. There is no structured-output path, no schema, no tool call. Where JSON is
needed, it is recovered by slicing between brackets —
`ai/application/suggest-links.ts:37-42` does `s.indexOf("[")`, `s.lastIndexOf("]")`,
`JSON.parse(slice)`. `PRODUCT-BRIEF` §9 row 7, confirmed.

`infrastructure/gateway-client.ts` (104) builds a provider chain from whichever server-side
keys are present — `GOOGLE_GENERATIVE_AI_API_KEY`, `GROQ_API_KEY`, `CEREBRAS_API_KEY`,
`MISTRAL_API_KEY`, `OPENROUTER_API_KEY` — with task-aware ordering (speed-first for
ghost-text, quality-first otherwise) and falls back to the Vercel AI Gateway string when
none is set. `provider-race.ts` (96) implements the fallback race.

```
grep -rn "apiKey\|api_key\|byok\|userKey" src --include='*.ts' --include='*.tsx'
```

Three matches, all server-side configuration: the Firebase zod schema, the Firebase config
reader, and `createOpenRouter({ apiKey: env["OPENROUTER_API_KEY"] })`. **No route accepts a
user-supplied key, and no store holds one.** Every AI request on every deployment bills the
operator. `PRODUCT-BRIEF` §9 row 6, confirmed. With §8's single-user allowlist this is
consistent today; it is the blocker the moment a stranger signs in.

---

## 10. Observability

`src/instrumentation.ts` (42 lines). `register()` is an empty function with a comment
reserving it for OpenTelemetry or Sentry. `onRequestError` logs to `console.error` with a
structured object and a comment saying to swap the call for `Sentry.captureException` once
`SENTRY_DSN` is set.

There is no metrics export, no trace, no error reporter, and no request log beyond stdout.
The log tag is `"[sgnk-md] request-error"` — the sibling product's name, in the one place a
production error surfaces.

---

## 11. Specs and the derived-document harness

```
node specs/harness/spec-report.mjs
  specs scanned   4
  errors          0
  ungoverned      169 of 171 module files (INFO while bootstrapping)
  states          draft=4
```

Four specs exist: `specs/engine/nf-001-zero-indent-sequence.md`,
`specs/engine/nf-003-bare-cr-fence.md`, `specs/engine/splice-writer.md`, plus the schema
under `specs/_schema`. All four are `state: draft`. `AGENTS.md` §0.1 defines `verified` as a
state only the harness may write, and only after every `verify:` command exits 0 and a red
proof exists. **No spec in this repository has reached `verified`.** 169 of 171 module files
are ungoverned by any spec.

The document build chain (`npm run tree`, `npm run doc`, `npm run pdf`, `npm run refs`,
`npm run record`, `npm run decide`) is declared in `package.json` and lives under
`docs/build/`. I did not run any of it in this pass.

---

## 12. Summary for a reader deciding what to do next

The architecture is genuinely good. The layer rule holds, the gates that exist are honest and
green, ports are real ports, the composition root is a composition root, and the engine's
domain layer is the most carefully reasoned code in the repository — every file opens with
the measurement that forced its shape.

What the reading changes about the picture:

1. **The application is single-tenant, single-repository, single-user, single-author** (§8).
   Not by configuration — by construction, in five separate places. Multi-user is a build.
2. **The engine is a library with no caller.** One symbol, two call sites (§7). Its CLI does
   not execute (§7.1), one of its two external dependencies is undeclared (§7.2), and the
   byte-exact writer everything rests on lives in a different module and carries both open
   defects (§7.3).
3. **The eslint architecture gate is silent, and the harness gate does not check `domain`**
   (§4.1) — both proven with probe files. A `domain → infrastructure` import passes
   `npm run verify` today. Nothing runs any gate on push in any case: there is no `.github/`
   (§4.2), and `npm run budget` is an `echo` that exits 0. Three further `AGENTS.md` rules —
   barrel discipline, `process.env` confinement, and the `middleware → domain` prohibition —
   are violated in the shipped tree and reported by nothing.
4. **The same eight-prefix denylist is maintained in three places** (§3), across two layers,
   with no test tying them together.
5. **640 lines of the backend and shared kernel are unreachable** (§6.2), including a
   complete second identity system that keeps `firebase` in the production dependency tree.
