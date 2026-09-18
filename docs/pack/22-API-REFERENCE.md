---
id: 22-API-REFERENCE
title: API reference
mode: reference
tier: derived
status: living
updated: 2026-09-18
owner: sagnik
generated_by: node docs/pack/tools/gen-api-reference.mjs > docs/pack/22-API-REFERENCE.md
verified_against: 6271499
covers: [api, api-routes, handlers]
---

# 22. API reference

**This file is generated. Do not edit it.** Every edit is lost the next time the command in
the `generated_by` key runs. To change a row, change the route handler it came from.

```
node docs/pack/tools/gen-api-reference.mjs > docs/pack/22-API-REFERENCE.md
node docs/pack/tools/gen-api-reference.mjs --check   # non-zero when this file is stale
```

Read out of `src/app` at commit `6271499` on 2026-09-18.
**26 route files, 29 handlers.**

**What the generator can and cannot tell you.** It reads the source text. A status code that
appears in an unreachable branch is still listed, and a side effect hidden behind an indirection
is not. The table is the contract the source claims. `npm run test` is the evidence it holds.

## 22.1 Every route, at a glance

Route | Methods | Auth | Runtime flags | Side effects
`/api/ai/complete` | POST | session, `getActor()` | `runtime = "nodejs"`, `dynamic = "force-dynamic"`, `maxDuration = 30` | `gatewayLlmClient.generate`.
`/api/ai/generate-doc` | POST | session, `getActor()` | `runtime = "nodejs"`, `dynamic = "force-dynamic"`, `maxDuration = 60` | `container.generateDocument`, `isDocKind()`.
`/api/ai/link-doctor` | POST | session, `getActor()` | `runtime = "nodejs"`, `dynamic = "force-dynamic"`, `maxDuration = 300` | `container.getSnapshot`, `container.linkDoctor`, `container.getFile`.
`/api/ai/refine` | POST | session, `getActor()` | `runtime = "nodejs"`, `dynamic = "force-dynamic"`, `maxDuration = 60` | `container.refineText`.
`/api/ai/suggest-links` | POST | session, `getActor()` | `runtime = "nodejs"`, `dynamic = "force-dynamic"`, `maxDuration = 60` | `container.suggestLinks`.
`/api/ai/summarize` | POST | session, `getActor()` | `runtime = "nodejs"`, `dynamic = "force-dynamic"`, `maxDuration = 60` | `container.summarize`.
`/api/auth/[...nextauth]` | GET, POST | Auth.js owns it | defaults | none detected.
`/api/commit` | POST | session, `getActor()` | `dynamic = "force-dynamic"` | `container.commitChanges`, `container.clearSnapshotCache`.
`/api/export/pdf/[...path]` | GET | session, `getActor()` | `runtime = "nodejs"`, `dynamic = "force-dynamic"`, `maxDuration = 60` | `container.getFile`.
`/api/export/vault` | GET | session, `getActor()` | `dynamic = "force-dynamic"` | `container.exportVaultZip`.
`/api/share` | GET, POST, DELETE | session, `getActor()` | `dynamic = "force-dynamic"` | `shareApi.listShares`, `shareApi.setShare`, `shareApi.removeShare`, `container.clearSnapshotCache`, `container.getSnapshot`, `revalidatePath`.
`/api/share/conflicts` | GET | session, `getActor()` | `dynamic = "force-dynamic"` | `shareApi.listConflicts`.
`/api/vault/create` | POST | session, `getActor()` | `dynamic = "force-dynamic"` | `container.validateNotePath`, `container.getBlobSha`, `container.createNote`, `container.clearSnapshotCache`, `defaultNoteContent()`.
`/api/vault/delete` | POST | session, `getActor()` | `dynamic = "force-dynamic"` | `container.commitChanges`, `container.getFile`, `container.getBlobSha`, `container.clearSnapshotCache`.
`/api/vault/file` | GET | session, `getActor()` | `dynamic = "force-dynamic"` | `container.getFile`.
`/api/vault/folder` | POST | session, `getActor()` | `dynamic = "force-dynamic"` | `container.getBlobSha`, `container.commitChanges`, `container.clearSnapshotCache`, `container.getSnapshot`, `container.getFile`.
`/api/vault/history` | GET | session, `getActor()` | `dynamic = "force-dynamic"` | `dependencyContainer.getNoteHistory`.
`/api/vault/merge` | POST | session, `getActor()` | `dynamic = "force-dynamic"` | `container.mergeNote`.
`/api/vault/raw/[...path]` | GET | session, `getActor()` | `dynamic = "force-dynamic"` | `container.getRawFile`.
`/api/vault/rename` | POST | session, `getActor()` | `dynamic = "force-dynamic"` | `container.getSnapshot`, `container.renameNote`, `container.clearSnapshotCache`.
`/api/vault/restore` | POST | session, `getActor()` | `dynamic = "force-dynamic"` | `container.getFile`, `container.commitChanges`, `container.clearSnapshotCache`.
`/api/vault/search` | GET | session, `getActor()` | `dynamic = "force-dynamic"` | `container.searchNotes`.
`/api/vault/snapshot` | GET | session, `getActor()` | `dynamic = "force-dynamic"` | `container.getSnapshot`.
`/api/vault/unlinked` | GET | session, `getActor()` | `dynamic = "force-dynamic"` | `container.findUnlinkedMentions`.
`/api/vault/upload` | POST | session, `getActor()` | `dynamic = "force-dynamic"` | `container.uploadAttachment`.
`/api/vault/version` | GET | session, `getActor()` | `dynamic = "force-dynamic"` | `dependencyContainer.getNoteVersion`.

## 22.2 Routes that reach past the composition root

`AGENTS.md:96` says app routes never import infrastructure directly and go through
`src/container/dependency-container.ts`. These routes call something imported from a module or
the shared kernel instead. A pure helper is fine. A gateway or an adapter is a finding.

Route | What it calls directly
`/api/ai/complete` | `gatewayLlmClient.generate` from `@/modules/ai`.
`/api/ai/generate-doc` | `isDocKind()` from `@/modules/ai`.
`/api/vault/create` | `defaultNoteContent()` from `@/modules/repository/application/file-ops`.

## 22.3 Status codes across the surface

Status and code | Routes that return it
`200` | 25.
`304` | 1.
`400 bad_request` | 21.
`401 unauthorized` | 25.
`404 not_found` | 2.
`409 conflict` | 5.
`409 exists` | 1.
`409 slug_conflict` | 1.
`413 too_large` | 5.
`422 invalid_slug` | 1.
`422 not_a_file` | 1.
`502 ai_failed` | 6.
`502 commit_failed` | 1.
`502 create_failed` | 1.
`502 delete_failed` | 1.
`502 history_failed` | 1.
`502 merge_failed` | 1.
`502 pdf_render_failed` | 1.
`502 rename_failed` | 1.
`502 restore_failed` | 1.
`502 unlinked_failed` | 1.
`502 upload_failed` | 1.
`502 upstream_failure` | 8.
`502 version_failed` | 1.

## 22.4 Each route in full

### POST `/api/ai/complete`

`src/app/api/ai/complete/route.ts`, 62 lines.

Returns a short inline continuation of the note text (AI ghost-text).

Property | Value
Methods | POST.
Auth | session, `getActor()`.
Path segments | none.
Query parameters | none.
Reads a JSON body | yes.
Reads form data | no.
Runtime flags | `runtime = "nodejs"`, `dynamic = "force-dynamic"`, `maxDuration = 30`.
Side effects | `gatewayLlmClient.generate` from `@/modules/ai`.
Reaches past the container | `gatewayLlmClient.generate` from `@/modules/ai`.

**Body, as the handler validates it.**

```ts
await req.json() as { prefix?: string }
```

Status | Error code in the body
`200` | no error code, this is a success path.
`400` | `bad_request`.
`401` | `unauthorized`.
`413` | `too_large`.
`502` | `ai_failed`.

<details><summary>The handler's own comment, verbatim apart from dashes</summary>

```
POST /api/ai/complete  { prefix: string }

Returns a short inline continuation of the note text (AI ghost-text). The
client sends the text immediately before the cursor; we return only the
continuation. 401 if unauthenticated.
```

</details>

### POST `/api/ai/generate-doc`

`src/app/api/ai/generate-doc/route.ts`, 65 lines.

Property | Value
Methods | POST.
Auth | session, `getActor()`.
Path segments | none.
Query parameters | none.
Reads a JSON body | yes.
Reads form data | no.
Runtime flags | `runtime = "nodejs"`, `dynamic = "force-dynamic"`, `maxDuration = 60`.
Side effects | `container.generateDocument` from `@/container/dependency-container`, `isDocKind()` from `@/modules/ai`.
Reaches past the container | `isDocKind()` from `@/modules/ai`.

**Body, as the handler validates it.**

```ts
await req.json() as { kind?: unknown; idea?: unknown }
```

Status | Error code in the body
`200` | no error code, this is a success path.
`400` | `bad_request`.
`401` | `unauthorized`.
`413` | `too_large`.
`502` | `ai_failed`.

### POST `/api/ai/link-doctor`

`src/app/api/ai/link-doctor/route.ts`, 74 lines.

Property | Value
Methods | POST.
Auth | session, `getActor()`.
Path segments | none.
Query parameters | none.
Reads a JSON body | yes.
Reads form data | no.
Runtime flags | `runtime = "nodejs"`, `dynamic = "force-dynamic"`, `maxDuration = 300`.
Side effects | `container.getSnapshot` from `@/container/dependency-container`, `container.linkDoctor` from `@/container/dependency-container`, `container.getFile` from `@/container/dependency-container`.
Reaches past the container | no.

**Body, as the handler validates it.**

```ts
await req.json() as { paths?: string[] }
```

Status | Error code in the body
`200` | no error code, this is a success path.
`400` | `bad_request`.
`401` | `unauthorized`.
`502` | `ai_failed`.

### POST `/api/ai/refine`

`src/app/api/ai/refine/route.ts`, 56 lines.

Property | Value
Methods | POST.
Auth | session, `getActor()`.
Path segments | none.
Query parameters | none.
Reads a JSON body | yes.
Reads form data | no.
Runtime flags | `runtime = "nodejs"`, `dynamic = "force-dynamic"`, `maxDuration = 60`.
Side effects | `container.refineText` from `@/container/dependency-container`.
Reaches past the container | no.

**Body, as the handler validates it.**

```ts
await req.json() as { text?: string; instruction?: string }
```

Status | Error code in the body
`200` | no error code, this is a success path.
`400` | `bad_request`.
`401` | `unauthorized`.
`413` | `too_large`.
`502` | `ai_failed`.

### POST `/api/ai/suggest-links`

`src/app/api/ai/suggest-links/route.ts`, 61 lines.

Property | Value
Methods | POST.
Auth | session, `getActor()`.
Path segments | none.
Query parameters | none.
Reads a JSON body | yes.
Reads form data | no.
Runtime flags | `runtime = "nodejs"`, `dynamic = "force-dynamic"`, `maxDuration = 60`.
Side effects | `container.suggestLinks` from `@/container/dependency-container`.
Reaches past the container | no.

**Body, as the handler validates it.**

```ts
await req.json() as { text?: string; candidates?: string[] }
```

Status | Error code in the body
`200` | no error code, this is a success path.
`400` | `bad_request`.
`401` | `unauthorized`.
`413` | `too_large`.
`502` | `ai_failed`.

### POST `/api/ai/summarize`

`src/app/api/ai/summarize/route.ts`, 53 lines.

Property | Value
Methods | POST.
Auth | session, `getActor()`.
Path segments | none.
Query parameters | none.
Reads a JSON body | yes.
Reads form data | no.
Runtime flags | `runtime = "nodejs"`, `dynamic = "force-dynamic"`, `maxDuration = 60`.
Side effects | `container.summarize` from `@/container/dependency-container`.
Reaches past the container | no.

**Body, as the handler validates it.**

```ts
await req.json() as { text?: string }
```

Status | Error code in the body
`200` | no error code, this is a success path.
`400` | `bad_request`.
`401` | `unauthorized`.
`413` | `too_large`.
`502` | `ai_failed`.

### GET, POST `/api/auth/[...nextauth]`

`src/app/api/auth/[...nextauth]/route.ts`, 4 lines.

Property | Value
Methods | GET, POST.
Auth | Auth.js owns it.
Path segments | `...nextauth`.
Query parameters | none.
Reads a JSON body | no.
Reads form data | no.
Runtime flags | defaults.
Side effects | none detected.
Reaches past the container | no.

### POST `/api/commit`

`src/app/api/commit/route.ts`, 116 lines.

Commits file changes and/or deletions to the vault repository.

Property | Value
Methods | POST.
Auth | session, `getActor()`.
Path segments | none.
Query parameters | none.
Reads a JSON body | yes.
Reads form data | no.
Runtime flags | `dynamic = "force-dynamic"`.
Side effects | `container.commitChanges` from `@/container/dependency-container`, `container.clearSnapshotCache` from `@/container/dependency-container`.
Reaches past the container | no.

**Body, as the handler validates it.**

```ts
const commitBodySchema = z.object({ files: z.array(fileChangeSchema).max(MAX_FILES_PER_COMMIT), deletions: z.array(deletionSchema).max(MAX_FILES_PER_COMMIT).optional(), message: z.string().min(1).max(MAX_MESSAGE), });
```

Status | Error code in the body
`200` | no error code, this is a success path.
`400` | `bad_request`.
`401` | `unauthorized`.
`409` | `conflict`.
`502` | `commit_failed`.

<details><summary>The handler's own comment, verbatim apart from dashes</summary>

```
POST /api/commit

Commits file changes and/or deletions to the vault repository.
Requires an authenticated session, returns 401 if not authenticated.
Returns 409 on OCC conflict (ConflictError), 502 on GitHub upstream failure.
```

</details>

### GET `/api/export/pdf/[...path]`

`src/app/api/export/pdf/[...path]/route.ts`, 191 lines.

Renders the requested vault note to PDF using headless Chromium (@sparticuz/chromium + puppeteer-core).

Property | Value
Methods | GET.
Auth | session, `getActor()`.
Path segments | `...path`.
Query parameters | none.
Reads a JSON body | no.
Reads form data | no.
Runtime flags | `runtime = "nodejs"`, `dynamic = "force-dynamic"`, `maxDuration = 60`.
Side effects | `container.getFile` from `@/container/dependency-container`.
Reaches past the container | no.

Status | Error code in the body
`200` | no error code, this is a success path.
`400` | `bad_request`.
`401` | `unauthorized`.
`502` | `upstream_failure`.
`502` | `pdf_render_failed`.

<details><summary>The handler's own comment, verbatim apart from dashes</summary>

```
GET /api/export/pdf/<vault-path>

Renders the requested vault note to PDF using headless Chromium
(@sparticuz/chromium + puppeteer-core).

- Requires an authenticated session → 401 if not.
- Joins the [...path] segments to obtain the vault file path.
- Renders the markdown to a server-safe HTML document (mermaid via CDN,
  KaTeX via CDN + rehype-katex pre-rendered markup).
- Launches a headless browser, loads the HTML, waits for mermaid to render,
  then snapshots a PDF.
- Returns the PDF bytes with appropriate headers.

ALL heavy deps (pdf-doc, chromium, puppeteer-core) are dynamically imported
inside the handler so the Next.js/Turbopack bundler never statically analyzes
or includes react-dom/server (used in pdf-doc.ts) in any client bundle, and
chromium/puppeteer-core are never bundled at all.
```

</details>

### GET `/api/export/vault`

`src/app/api/export/vault/route.ts`, 40 lines.

Exports all vault .md files as a zip archive.

Property | Value
Methods | GET.
Auth | session, `getActor()`.
Path segments | none.
Query parameters | none.
Reads a JSON body | no.
Reads form data | no.
Runtime flags | `dynamic = "force-dynamic"`.
Side effects | `container.exportVaultZip` from `@/container/dependency-container`.
Reaches past the container | no.

Status | Error code in the body
`200` | no error code, this is a success path.
`401` | `unauthorized`.
`502` | `upstream_failure`.

<details><summary>The handler's own comment, verbatim apart from dashes</summary>

```
GET /api/export/vault

Exports all vault .md files as a zip archive.
Requires an authenticated session, returns 401 if not authenticated.
Returns 502 if the GitHub upstream call fails.
```

</details>

### GET, POST, DELETE `/api/share`

`src/app/api/share/route.ts`, 84 lines.

Slug validation + uniqueness happens server-side.

Property | Value
Methods | GET, POST, DELETE.
Auth | session, `getActor()`.
Path segments | none.
Query parameters | none.
Reads a JSON body | yes.
Reads form data | no.
Runtime flags | `dynamic = "force-dynamic"`.
Side effects | `shareApi.listShares` from `@/container/dependency-container`, `shareApi.setShare` from `@/container/dependency-container`, `shareApi.removeShare` from `@/container/dependency-container`, `container.clearSnapshotCache` from `@/container/dependency-container`, `container.getSnapshot` from `@/container/dependency-container`, `revalidatePath`.
Reaches past the container | no.

**Body, as the handler validates it.**

```ts
const postSchema = z.object({ path: z.string().min(1), slug: z.string().min(1).max(60) });
const deleteSchema = z.object({ path: z.string().min(1) });
```

Status | Error code in the body
`200` | no error code, this is a success path.
`400` | `bad_request`.
`401` | `unauthorized`.
`409` | `slug_conflict`.
`422` | `invalid_slug`.
`502` | `upstream_failure`.

<details><summary>The handler's own comment, verbatim apart from dashes</summary>

```
POST   /api/share        body: { path, slug }, assign slug (auth)
DELETE /api/share        body: { path }, unpublish (auth)
GET    /api/share        list current shares    (auth)

Slug validation + uniqueness happens server-side. UI MUST surface the
`slug_conflict` body so the user can pick a different slug.
```

</details>

### GET `/api/share/conflicts`

`src/app/api/share/conflicts/route.ts`, 29 lines.

The shell calls this on load to detect duplicates introduced by Obsidian / git sync (which bypasses the UI uniqueness check).

Property | Value
Methods | GET.
Auth | session, `getActor()`.
Path segments | none.
Query parameters | none.
Reads a JSON body | no.
Reads form data | no.
Runtime flags | `dynamic = "force-dynamic"`.
Side effects | `shareApi.listConflicts` from `@/container/dependency-container`.
Reaches past the container | no.

Status | Error code in the body
`200` | no error code, this is a success path.
`401` | `unauthorized`.

<details><summary>The handler's own comment, verbatim apart from dashes</summary>

```
GET /api/share/conflicts, returns slugs claimed by >1 note.

The shell calls this on load to detect duplicates introduced by Obsidian /
git sync (which bypasses the UI uniqueness check). Auth-required.
```

</details>

### POST `/api/vault/create`

`src/app/api/vault/create/route.ts`, 98 lines.

Creates a new vault note.

Property | Value
Methods | POST.
Auth | session, `getActor()`.
Path segments | none.
Query parameters | none.
Reads a JSON body | yes.
Reads form data | no.
Runtime flags | `dynamic = "force-dynamic"`.
Side effects | `container.validateNotePath` from `@/container/dependency-container`, `container.getBlobSha` from `@/container/dependency-container`, `container.createNote` from `@/container/dependency-container`, `container.clearSnapshotCache` from `@/container/dependency-container`, `defaultNoteContent()` from `@/modules/repository/application/file-ops`.
Reaches past the container | `defaultNoteContent()` from `@/modules/repository/application/file-ops`.

**Body, as the handler validates it.**

```ts
const createBodySchema = z.object({ path: z.string().min(1), content: z.string().optional(), });
```

Status | Error code in the body
`200` | no error code, this is a success path.
`400` | `bad_request`.
`401` | `unauthorized`.
`409` | `exists`.
`502` | `create_failed`.

<details><summary>The handler's own comment, verbatim apart from dashes</summary>

```
POST /api/vault/create

Creates a new vault note. Returns 409 if the file already exists.
Requires an authenticated session, returns 401 if not authenticated.
```

</details>

### POST `/api/vault/delete`

`src/app/api/vault/delete/route.ts`, 102 lines.

Deletes a vault note.

Property | Value
Methods | POST.
Auth | session, `getActor()`.
Path segments | none.
Query parameters | none.
Reads a JSON body | yes.
Reads form data | no.
Runtime flags | `dynamic = "force-dynamic"`.
Side effects | `container.commitChanges` from `@/container/dependency-container`, `container.getFile` from `@/container/dependency-container`, `container.getBlobSha` from `@/container/dependency-container`, `container.clearSnapshotCache` from `@/container/dependency-container`.
Reaches past the container | no.

**Body, as the handler validates it.**

```ts
const deleteBodySchema = z.object({ path: z.string().min(1), baseSha: z.string().min(1), });
```

Status | Error code in the body
`200` | no error code, this is a success path.
`400` | `bad_request`.
`401` | `unauthorized`.
`409` | `conflict`.
`502` | `delete_failed`.

<details><summary>The handler's own comment, verbatim apart from dashes</summary>

```
POST /api/vault/delete

Deletes a vault note. Uses OCC baseSha to detect concurrent modifications.
Returns 409 on conflict; 401 if not authenticated.
```

</details>

### GET `/api/vault/file`

`src/app/api/vault/file/route.ts`, 67 lines.

Returns the raw content and blob SHA of a single vault file.

Property | Value
Methods | GET.
Auth | session, `getActor()`.
Path segments | none.
Query parameters | `path`.
Reads a JSON body | no.
Reads form data | no.
Runtime flags | `dynamic = "force-dynamic"`.
Side effects | `container.getFile` from `@/container/dependency-container`.
Reaches past the container | no.

**Body, as the handler validates it.**

```ts
const pathSchema = z .string() .min(1, "path must not be empty") .max(1024, "path is too long");
```

Status | Error code in the body
`200` | no error code, this is a success path.
`400` | `bad_request`.
`401` | `unauthorized`.
`502` | `upstream_failure`.

<details><summary>The handler's own comment, verbatim apart from dashes</summary>

```
GET /api/vault/file?path=<relative-path>

Returns the raw content and blob SHA of a single vault file.
Requires an authenticated session, returns 401 if not authenticated.
Returns 400 for a missing/invalid path parameter.
Returns 404 if the file does not exist in the vault.
Returns 502 if any other upstream call fails.
```

</details>

### POST `/api/vault/folder`

`src/app/api/vault/folder/route.ts`, 146 lines.

Body: { op: "create", path: "Foo/Bar" } → creates Foo/Bar/.gitkeep (so folder is visible in git + tree).

Property | Value
Methods | POST.
Auth | session, `getActor()`.
Path segments | none.
Query parameters | none.
Reads a JSON body | yes.
Reads form data | no.
Runtime flags | `dynamic = "force-dynamic"`.
Side effects | `container.getBlobSha` from `@/container/dependency-container`, `container.commitChanges` from `@/container/dependency-container`, `container.clearSnapshotCache` from `@/container/dependency-container`, `container.getSnapshot` from `@/container/dependency-container`, `container.getFile` from `@/container/dependency-container`.
Reaches past the container | no.

**Body, as the handler validates it.**

```ts
const schema = z.discriminatedUnion("op", [ z.object({ op: z.literal("create"), path: z.string().min(1) }), z.object({ op: z.literal("rename"), oldPath: z.string().min(1), newPath: z.string().min(1) }), z.object({ op: z.literal("delete"), path: z.string().min(1) }), ]);
```

Status | Error code in the body
`200` | no error code, this is a success path.
`400` | `bad_request`.
`401` | `unauthorized`.
`404` | `not_found`.
`409` | `conflict`.
`502` | `upstream_failure`.

<details><summary>The handler's own comment, verbatim apart from dashes</summary>

```
POST /api/vault/folder

Body:
  { op: "create", path: "Foo/Bar" }
    → creates Foo/Bar/.gitkeep (so folder is visible in git + tree).

  { op: "rename", oldPath: "Foo", newPath: "Baz" }
    → renames every file under Foo/* to Baz/*, in ONE commit (atomic).
    → inbound wikilinks are NOT rewritten (Obsidian doesn't either for
      folder moves, only file renames). Files keep their basenames.

  { op: "delete", path: "Foo" }
    → deletes every file in Foo/ recursively, in ONE commit.

Folder ops use commitChanges so they're conflict-detected (baseSha per file).
Auth-gated.
```

</details>

### GET `/api/vault/history`

`src/app/api/vault/history/route.ts`, 44 lines.

Returns the commit history for a single note.

Property | Value
Methods | GET.
Auth | session, `getActor()`.
Path segments | none.
Query parameters | `path`.
Reads a JSON body | no.
Reads form data | no.
Runtime flags | `dynamic = "force-dynamic"`.
Side effects | `dependencyContainer.getNoteHistory` from `@/container/dependency-container`.
Reaches past the container | no.

Status | Error code in the body
`200` | no error code, this is a success path.
`400` | `bad_request`.
`401` | `unauthorized`.
`502` | `history_failed`.

<details><summary>The handler's own comment, verbatim apart from dashes</summary>

```
GET /api/vault/history?path=<relative-path>

Returns the commit history for a single note. 401 if unauthenticated.

Architecture: routes only call `dependencyContainer.*` use-cases.
The GitHub specifics live in `@/shared/infrastructure/github/client`
behind the `VaultReader.listHistory` port.
```

</details>

### POST `/api/vault/merge`

`src/app/api/vault/merge/route.ts`, 67 lines.

Non-destructive conflict resolution.

Property | Value
Methods | POST.
Auth | session, `getActor()`.
Path segments | none.
Query parameters | none.
Reads a JSON body | yes.
Reads form data | no.
Runtime flags | `dynamic = "force-dynamic"`.
Side effects | `container.mergeNote` from `@/container/dependency-container`.
Reaches past the container | no.

**Body, as the handler validates it.**

```ts
const bodySchema = z.object({ path: z.string().min(1), baseSha: z.string(), localContent: z.string(), });
```

Status | Error code in the body
`200` | no error code, this is a success path.
`400` | `bad_request`.
`401` | `unauthorized`.
`502` | `merge_failed`.

<details><summary>The handler's own comment, verbatim apart from dashes</summary>

```
POST /api/vault/merge

Non-destructive conflict resolution. Given { path, baseSha, localContent },
fetches the common-ancestor base (blob at baseSha) and the current remote
content, runs the conservative 3-way merge, and returns:
  { clean, text, remoteSha, conflicts }
The client adopts `remoteSha` as the new baseSha and `text` as the draft
(which carries git-style conflict markers when clean === false).
```

</details>

### GET `/api/vault/raw/[...path]`

`src/app/api/vault/raw/[...path]/route.ts`, 61 lines.

Serves a raw binary file from the vault via the GitHub Contents API.

Property | Value
Methods | GET.
Auth | session, `getActor()`.
Path segments | `...path`.
Query parameters | none.
Reads a JSON body | no.
Reads form data | no.
Runtime flags | `dynamic = "force-dynamic"`.
Side effects | `container.getRawFile` from `@/container/dependency-container`.
Reaches past the container | no.

Status | Error code in the body
`200` | no error code, this is a success path.
`401` | `unauthorized`.
`404` | `not_found`.
`502` | `upstream_failure`.

<details><summary>The handler's own comment, verbatim apart from dashes</summary>

```
GET /api/vault/raw/[...path]

Serves a raw binary file from the vault via the GitHub Contents API.
Requires an authenticated session.

The [...path] catch-all segments are joined to form the vault-relative path.
Content-Type is inferred from the file extension.
```

</details>

### POST `/api/vault/rename`

`src/app/api/vault/rename/route.ts`, 91 lines.

Renames a vault note and auto-relinks all inbound wikilinks.

Property | Value
Methods | POST.
Auth | session, `getActor()`.
Path segments | none.
Query parameters | none.
Reads a JSON body | yes.
Reads form data | no.
Runtime flags | `dynamic = "force-dynamic"`.
Side effects | `container.getSnapshot` from `@/container/dependency-container`, `container.renameNote` from `@/container/dependency-container`, `container.clearSnapshotCache` from `@/container/dependency-container`.
Reaches past the container | no.

**Body, as the handler validates it.**

```ts
const renameBodySchema = z.object({ oldPath: z.string().min(1), newPath: z.string().min(1), });
```

Status | Error code in the body
`200` | no error code, this is a success path.
`400` | `bad_request`.
`401` | `unauthorized`.
`409` | `conflict`.
`502` | `rename_failed`.

<details><summary>The handler's own comment, verbatim apart from dashes</summary>

```
POST /api/vault/rename

Renames a vault note and auto-relinks all inbound wikilinks.
Returns 409 if newPath already exists; 401 if not authenticated.
```

</details>

### POST `/api/vault/restore`

`src/app/api/vault/restore/route.ts`, 70 lines.

Restores a note from `_Trash/` back to its original path.

Property | Value
Methods | POST.
Auth | session, `getActor()`.
Path segments | none.
Query parameters | none.
Reads a JSON body | yes.
Reads form data | no.
Runtime flags | `dynamic = "force-dynamic"`.
Side effects | `container.getFile` from `@/container/dependency-container`, `container.commitChanges` from `@/container/dependency-container`, `container.clearSnapshotCache` from `@/container/dependency-container`.
Reaches past the container | no.

**Body, as the handler validates it.**

```ts
const bodySchema = z.object({ path: z.string().min(1).startsWith(TRASH) });
```

Status | Error code in the body
`200` | no error code, this is a success path.
`400` | `bad_request`.
`401` | `unauthorized`.
`409` | `conflict`.
`502` | `restore_failed`.

<details><summary>The handler's own comment, verbatim apart from dashes</summary>

```
POST /api/vault/restore

Restores a note from `_Trash/` back to its original path. Body: { path }
where `path` is the trashed path (starts with `_Trash/`). Reads the trashed
content, recreates the note at its original location, and deletes the trash
copy, one atomic commit. 401 if unauthenticated, 409 on conflict.
```

</details>

### GET `/api/vault/search`

`src/app/api/vault/search/route.ts`, 53 lines.

Full-text search over vault notes using MiniSearch.

Property | Value
Methods | GET.
Auth | session, `getActor()`.
Path segments | none.
Query parameters | `q`.
Reads a JSON body | no.
Reads form data | no.
Runtime flags | `dynamic = "force-dynamic"`.
Side effects | `container.searchNotes` from `@/container/dependency-container`.
Reaches past the container | no.

**Body, as the handler validates it.**

```ts
const querySchema = z.object({ q: z.string().min(1), });
```

Status | Error code in the body
`200` | no error code, this is a success path.
`400` | `bad_request`.
`401` | `unauthorized`.
`502` | `upstream_failure`.

<details><summary>The handler's own comment, verbatim apart from dashes</summary>

```
GET /api/vault/search?q=<query>

Full-text search over vault notes using MiniSearch.
Requires an authenticated session, returns 401 if not authenticated.
Returns 400 for missing/empty query. Returns 502 on upstream failure.
```

</details>

### GET `/api/vault/snapshot`

`src/app/api/vault/snapshot/route.ts`, 48 lines.

Returns the full vault snapshot as JSON.

Property | Value
Methods | GET.
Auth | session, `getActor()`.
Path segments | none.
Query parameters | none.
Reads a JSON body | no.
Reads form data | no.
Runtime flags | `dynamic = "force-dynamic"`.
Side effects | `container.getSnapshot` from `@/container/dependency-container`.
Reaches past the container | no.

Status | Error code in the body
`200` | no error code, this is a success path.
`304` | no error code, this is a success path.
`401` | `unauthorized`.
`502` | `upstream_failure`.

<details><summary>The handler's own comment, verbatim apart from dashes</summary>

```
GET /api/vault/snapshot

Returns the full vault snapshot as JSON.
Requires an authenticated session, returns 401 if not authenticated.
Returns 502 if the GitHub upstream call fails.
```

</details>

### GET `/api/vault/unlinked`

`src/app/api/vault/unlinked/route.ts`, 42 lines.

Returns notes that mention `title` as plain text without a `[[wikilink]]` (Obsidian-style "unlinked mentions").

Property | Value
Methods | GET.
Auth | session, `getActor()`.
Path segments | none.
Query parameters | `title`, `path`.
Reads a JSON body | no.
Reads form data | no.
Runtime flags | `dynamic = "force-dynamic"`.
Side effects | `container.findUnlinkedMentions` from `@/container/dependency-container`.
Reaches past the container | no.

Status | Error code in the body
`200` | no error code, this is a success path.
`400` | `bad_request`.
`401` | `unauthorized`.
`502` | `unlinked_failed`.

<details><summary>The handler's own comment, verbatim apart from dashes</summary>

```
GET /api/vault/unlinked?title=<title>&path=<self-path>

Returns notes that mention `title` as plain text without a `[[wikilink]]`
(Obsidian-style "unlinked mentions"). 401 if unauthenticated.
```

</details>

### POST `/api/vault/upload`

`src/app/api/vault/upload/route.ts`, 100 lines.

Accepts a binary file encoded as base64 and commits it to _attachments/.

Property | Value
Methods | POST.
Auth | session, `getActor()`.
Path segments | none.
Query parameters | none.
Reads a JSON body | yes.
Reads form data | no.
Runtime flags | `dynamic = "force-dynamic"`.
Side effects | `container.uploadAttachment` from `@/container/dependency-container`.
Reaches past the container | no.

**Body, as the handler validates it.**

```ts
const bodySchema = z.object({ filename: z.string().min(1).max(200), dataBase64: z.string().min(1), });
```

Status | Error code in the body
`200` | no error code, this is a success path.
`400` | `bad_request`.
`401` | `unauthorized`.
`502` | `upload_failed`.

<details><summary>The handler's own comment, verbatim apart from dashes</summary>

```
POST /api/vault/upload

Accepts a binary file encoded as base64 and commits it to _attachments/.
Returns the vault-relative path of the committed attachment.

Request body: { filename: string, dataBase64: string }
Response:     { path: string }
```

</details>

### GET `/api/vault/version`

`src/app/api/vault/version/route.ts`, 52 lines.

Returns the content of a note as it existed at a specific commit.

Property | Value
Methods | GET.
Auth | session, `getActor()`.
Path segments | none.
Query parameters | `path`, `sha`.
Reads a JSON body | no.
Reads form data | no.
Runtime flags | `dynamic = "force-dynamic"`.
Side effects | `dependencyContainer.getNoteVersion` from `@/container/dependency-container`.
Reaches past the container | no.

Status | Error code in the body
`200` | no error code, this is a success path.
`400` | `bad_request`.
`401` | `unauthorized`.
`422` | `not_a_file`.
`502` | `version_failed`.

<details><summary>The handler's own comment, verbatim apart from dashes</summary>

```
GET /api/vault/version?path=<relative-path>&sha=<commit-sha>

Returns the content of a note as it existed at a specific commit.
Used by the version-history viewer. 401 if unauthenticated.

Architecture: routes only call `dependencyContainer.*` use-cases.
The GitHub specifics live in `@/shared/infrastructure/github/client`
behind the `VaultReader.getFileAtSha` port.
```

</details>

## 22.5 Limits of this file

- **What was not assessed.** Behaviour. Nothing here was executed. Every field is a read of the
  source text, which makes each one a proxy for the thing it describes.
- **What could not be verified.** Whether a listed status is reachable, and whether a route
  enforces the auth it appears to. The proxy in `src/proxy.ts` does not gate `/api/*`, by design,
  so each handler gates itself. A route whose Auth column says none found is a finding.
- **What is not established.** Rate limits, quotas and entitlement checks. None is in the handlers
  at this commit.
- **What would falsify this file.** `node docs/pack/tools/gen-api-reference.mjs --check` exiting
  non-zero, which means the source moved and this file did not.

