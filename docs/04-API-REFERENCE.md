---
mode: reference
updated: 2026-09-09
verified_against: e318ab3
---

# API reference

> **Method.** I read all 26 `route.ts` files under `src/app/api/` in full, plus
> `src/proxy.ts` (141 lines), `src/auth.ts`, `src/modules/auth/infrastructure/auth-options.ts`,
> `src/modules/auth/presentation/session.ts`, `src/container/dependency-container.ts`,
> `src/modules/ai/infrastructure/gateway-client.ts`, `src/modules/vault/application/dto.ts`,
> `src/modules/vault/application/ports.ts`, `src/modules/vault/application/get-file.ts`,
> `src/modules/repository/application/merge-note.ts`, the share application use-cases, and
> `src/modules/share/domain/slug.ts`. Request and response shapes below are read from the
> handler and the use-case it calls, not inferred from the URL.
>
> **What this pass did NOT do.** I did not start a dev server, so no status code here was
> observed over the wire — every one is read from a `new Response(..., { status: N })` in the
> source. I did not run `npm run test`, `npm run typecheck` or `npm run build`. I did not read
> the GitHub infrastructure adapter (`src/shared/infrastructure/github/client`), so the exact
> upstream failure modes that surface as 502 are described by the handler's catch clause only.
> I did not read any `.env` file; environment variables appear by name only. I did not audit
> rate limiting, request logging, or CORS — I found no rate-limit code in any handler, but I did
> not grep the whole tree for it, so treat "no rate limiting" as **unverified**.

---

## 0. Correction to the brief: there are 26 route handlers, not 12

```
$ find src/app/api -name 'route.ts' | wc -l
26
```

Twelve is the count of `src/app/api/vault/*/route.ts` files, plus a couple — but the full API
surface is 26 handler files, of which one (`auth/[...nextauth]`) is three lines that re-export
Auth.js's own handlers. Total handler source is 1,874 lines including the one shared helper
module (`vault/raw/content-type.ts`, 24 lines), measured with
`find src/app/api -name '*.ts' | xargs wc -l`.

Counted by exported HTTP method rather than by file, the surface is 29 endpoints: 24 files
export exactly one method, `share/route.ts` exports three (`GET`, `POST`, `DELETE`), and
`auth/[...nextauth]/route.ts` exports two (`GET`, `POST`).

---

## 1. Conventions that hold across every handler

Read from the source, not assumed:

- **Auth is per-handler, not middleware-enforced.** Every handler except
  `auth/[...nextauth]` opens with `const actor = await getActor(); if (!actor) return 401`.
  The proxy (§4) deliberately does not redirect `/api/*` — the comment at `src/proxy.ts:89-91`
  says a redirect would hand a `fetch()` an HTML page instead of an error.
- **The 401 body is always** `{"error":"unauthorized"}` with
  `content-type: application/json`.
- **Errors are a flat JSON object** with an `error` string and usually a `detail` string.
  There is no shared error envelope type; each handler builds the object inline.
- **`export const dynamic = "force-dynamic"`** appears in all 25 non-Auth.js handlers.
  The six `ai/*` handlers additionally set `runtime = "nodejs"` and a `maxDuration`
  (30s for `complete`, 60s for `generate-doc`/`refine`/`suggest-links`/`summarize`,
  **300s** for `link-doctor`). `export/pdf` sets `runtime = "nodejs"` and `maxDuration = 60`.
- **Success is 200 everywhere.** No handler returns 201, 202 or 204. The one non-200 success
  is `GET /api/vault/snapshot` returning 304 on an ETag match.
- **Handlers call `container.*` only.** No handler imports a GitHub client directly; that is
  the layer rule from AGENTS.md §3 and it holds in all 26 files.

### Who counts as authenticated

`getActor()` (`src/modules/auth/presentation/session.ts:58`) returns an actor from one of
three paths:

1. **Dev bypass** — triple-gated on `NODE_ENV === "development"`, `DEV_BYPASS_AUTH === "1"`,
   and a loopback/RFC1918 request host. Returns a synthetic actor whose login is
   `ALLOWED_GH_LOGIN` (defaulting to the literal `"dev"`).
2. **GitHub OAuth** — scope `read:user` only, gated in the `signIn` callback by
   `isAllowed(profile.login, ALLOWED_GH_LOGIN)`. This is a single-login allowlist, not a
   multi-tenant model.
3. **Username/password credentials** — provider id `sgnk-password`, verified against a scrypt
   hash in `SGNK_AUTH_HASH` with the username in `SGNK_AUTH_USER`. Documented in the file as
   the fallback for environments where the OAuth callback is unreachable.

Session strategy is JWT. There is no per-endpoint authorisation beyond "is there an actor" —
every authenticated actor can call every endpoint.

---

## 2. Endpoints

### 2.1 Auth

#### `GET|POST /api/auth/[...nextauth]`

`src/app/api/auth/[...nextauth]/route.ts` — three lines, `export const { GET, POST } = handlers`
from `@/auth`. All behaviour (sign-in, callback, session, CSRF, sign-out) is Auth.js v5's.
This is the one path the proxy allowlists as public (`pathname.startsWith("/api/auth")`).

---

### 2.2 Vault reads

#### `GET /api/vault/snapshot`

Returns the whole vault index. Response is the `VaultSnapshot` DTO
(`src/modules/vault/application/dto.ts:60`):

```
{ sha, generatedAt, tree: TreeNode, notes: NoteMeta[] }
```

`NoteMeta` is `{ path, title, tags[], outbound[], backlinks[], excludeFromGraph, publicSlug? }`.

**Caching.** The handler sets `ETag: "<snapshot.sha>"` and
`Cache-Control: private, must-revalidate`, and returns **304 with a null body** when the request
carries a matching `if-none-match`. The comment explains the reasoning: the snapshot is fully
determined by the vault HEAD sha.

Errors: 401 unauthenticated; 502 `upstream_failure` on any throw.

#### `GET /api/vault/file?path=<relative-path>`

Returns `{ path, content, sha }` (`GetFileResult`).

The `path` query parameter is validated by a zod schema — non-empty, max 1,024 characters. The
comment gives the reason for the bound: stopping a client burning bandwidth with a 100 MB URL.

Errors: 401; 400 `bad_request` if `path` is missing/empty/over-long; 400 `not_found` **with a
400 status** when the underlying `InvalidPathError` fires (absolute path, or one containing
`..`); 404 `not_found` when `FileNotFoundError` fires; 502 `upstream_failure` otherwise.

Note the shape oddity, read from the source: the `InvalidPathError` branch returns
`{"error":"not_found"}` at status 400. The error string says not-found while the status says
bad-request.

#### `GET /api/vault/raw/[...path]`

Serves a raw binary vault file. The catch-all segments are joined with `/`, passed to
`container.getRawFile`, and the base64 response is decoded to bytes.

Response headers: `content-type` inferred from the extension by `inferContentType`
(`src/app/api/vault/raw/content-type.ts`), which maps only
`png jpg jpeg gif webp svg pdf` and falls back to `application/octet-stream`; plus
`cache-control: private, max-age=3600`.

**Path safety lives in the container, not the handler.** `container.getRawFile`
(`src/container/dependency-container.ts:86`) rejects any path with a `.` or `..` segment, and
any path beginning with one of `RAW_BLOCKED_PREFIXES` =
`src/ docs/ specs/ public/ .github/ .claude/ .vercel/ node_modules/`. Both rejections return
`null`, which the handler renders as **404**, not 400 — a traversal attempt and a genuinely
missing file are indistinguishable to the caller.

Errors: 401; 404 `not_found`; 502 `upstream_failure`.

#### `GET /api/vault/search?q=<query>`

MiniSearch full-text search. Returns `{ results: SearchResult[] }` where `SearchResult` is
`{ path, title, snippet }` (`src/modules/vault/infrastructure/search-index.ts:114`).

Errors: 401; 400 `bad_request` when `q` is absent or empty; 502 `upstream_failure`.

#### `GET /api/vault/history?path=<relative-path>`

Returns `{ commits: VaultHistoryEntry[] }`, each `{ sha, message, author, date }` where `date`
may be `null` (`src/modules/vault/application/ports.ts:12`). The use-case defaults the limit to
50 (`get-history.ts:19`); **the route does not expose a `limit` parameter**, so callers always
get at most 50.

Errors: 401; 400 `bad_request` if `path` is absent; 502 `history_failed`.

#### `GET /api/vault/version?path=<path>&sha=<commit-sha>`

Returns `{ content }` — the note as it existed at that commit.

Errors: 401; 400 `bad_request` if either parameter is absent; **422 `not_a_file`** when the
port returns `null` (the path at that revision is a directory, a submodule, or an oversize
blob); 502 `version_failed`.

#### `GET /api/vault/unlinked?title=<title>&path=<self-path>`

Obsidian-style unlinked mentions: notes containing `title` as plain text without a
`[[wikilink]]`. Returns `{ mentions: UnlinkedMention[] }`, each `{ path, title, snippet }`.

`path` is optional and defaults to `""` (it identifies the note to exclude from its own
results). Titles shorter than three characters return an empty array from the use-case, not an
error — the comment says short titles produce noise.

Errors: 401; 400 `bad_request` if `title` is absent; 502 `unlinked_failed`.

---

### 2.3 Vault writes

All writes go through `container.commitChanges`, which is optimistic-concurrency-controlled by
a per-file `baseSha`. A `baseSha` of `""` is the create-new sentinel: it asserts the path is
currently absent.

#### `POST /api/commit`

The general-purpose write. Body validated by zod:

```
{ files: [{ path, content, baseSha }],
  deletions?: [{ path, baseSha }],
  message }
```

Bounds, with the source's own stated rationale ("well above any realistic vault note"):
path ≤ 1,024 chars; content ≤ 10 MB per file; ≤ 500 files per commit; ≤ 500 deletions;
message 1–5,120 chars. `deletions[].baseSha` must be non-empty (min 1); `files[].baseSha` may be
empty, because that is the create sentinel.

Response `{ commitSha }`. On success the handler calls `container.clearSnapshotCache()`.

Errors: 401; 400 `bad_request` with a `detail` that joins every zod issue as
`path.to.field: message`; **409 `conflict` with `{ paths: string[] }`** on `ConflictError`;
502 `commit_failed`.

This is the only handler that exports a body-size discipline as an explicit constant block.
Note that the 10 MB × 500 files bound means a single well-formed request may carry up to 5 GB of
JSON; the guard is per-field, not aggregate.

#### `POST /api/vault/create`

Body `{ path, content? }`. Validates the path via `container.validateNotePath`, then checks
`getBlobSha(path)` and refuses if the file exists.

When `content` is omitted the handler uses `defaultNoteContent(path)` — shared with the client
so the optimistic note matches.

Response `{ commitSha, sha, path }`. Clears the snapshot cache.

Errors: 401; 400 `bad_request` (invalid JSON, zod failure, or `InvalidPathError`);
**409 `exists` with `{ path }`** — note the error string is `exists`, not `conflict`;
502 `create_failed`.

#### `POST /api/vault/delete`

Body `{ path, baseSha }` — both required, `baseSha` non-empty.

Two behaviours, chosen by whether `path` already starts with `_Trash/`:

- **Not in trash → soft delete.** Reads the content, writes it to `_Trash/<original path>` and
  deletes the original, in one commit, message `Trash <basename>`. If a same-named note was
  trashed earlier and not purged, the handler reads that trash copy's sha and overwrites it
  rather than asserting absence — the comment says asserting absence would 409 confusingly.
- **Already in trash → purge.** Permanent delete, message `Purge <basename>`.

Response `{ commitSha, trashed: boolean }` where `trashed` is `true` for the soft-delete path.
Clears the snapshot cache.

Errors: 401; 400 `bad_request`; 409 `conflict` with `{ paths }`; 502 `delete_failed`.

#### `POST /api/vault/restore`

Body `{ path }`, where zod requires the path to start with `_Trash/`. Reads the trashed content,
recreates it at the original path (`baseSha: ""`) and deletes the trash copy, in one commit,
message `Restore <basename>`.

Response `{ commitSha, path }` — `path` is the *restored* path, not the input. Clears the
snapshot cache.

Errors: 401; 400 `bad_request` (includes a path not starting with `_Trash/`);
409 `conflict` with `{ paths }`; 502 `restore_failed`.

#### `POST /api/vault/rename`

Body `{ oldPath, newPath }`. Renames a note and rewrites inbound wikilinks.

The relink set comes from the snapshot's backlink index rather than a whole-vault scan — the
comment says this avoids downloading the vault zipball. If the snapshot is unavailable, the
handler swallows the error and proceeds with `referencingPaths = []`, so **the note still moves
but inbound links are silently left dangling**. That degradation is deliberate and commented,
but it is invisible to the caller: the response reports `relinkedCount: 0`, which is
indistinguishable from "there were no backlinks".

Response `{ commitSha, relinkedCount }`. Clears the snapshot cache.

Errors: 401; 400 `bad_request`; **409 `conflict`** for both `NoteExistsError` and
`InvalidPathError` — an invalid path is reported as a conflict, which is wrong but is what the
code does; 502 `rename_failed`.

#### `POST /api/vault/folder`

A discriminated union on `op`.

**`{ op: "create", path }`** — writes `<path>/.gitkeep` with empty content. Idempotent: if the
`.gitkeep` already exists it returns `{ ok: true, path, created: false }` without committing.
Otherwise `{ ok: true, path, created: true }`.

**`{ op: "rename", oldPath, newPath }`** — moves every file under `oldPath/` to `newPath/` in one
commit. Returns `{ ok: true, moved: <n> }`; returns `{ ok: true, moved: 0 }` without work when
`oldPath === newPath`. Documented explicitly: **inbound wikilinks are NOT rewritten for folder
renames** (basenames do not change, and Obsidian behaves the same way).

**`{ op: "delete", path }`** — deletes every file under `path/` in one commit,
`{ ok: true, deleted: <n> }`. When the folder holds no notes it falls back to removing the
`.gitkeep` alone and still reports `deleted: 0`.

**Path guard.** `validateFolderPath` rejects `..`, a leading `/`, a trailing `/`, and any
doubled slash; then rejects any path whose first segment is in
`BLOCKED_FOLDER_PREFIXES` = `src docs specs public .github .claude .vercel node_modules _Trash`.
Both rejections `throw new Error(...)`, which the catch clause renders as **502
`upstream_failure`**, not 400 — a client sending `{op:"create",path:"src"}` gets a 502 saying
"folder is outside the vault".

Errors: 401; 400 `bad_request` on zod failure; 404 `not_found` on a rename of an empty/absent
folder; 409 `conflict` on `ConflictError`; 502 `upstream_failure`. The trailing
`return 400 bad_request` after the three branches is unreachable after a successful
discriminated-union parse; it is a defensive fallback.

#### `POST /api/vault/merge`

Non-destructive conflict resolution. Body `{ path, baseSha, localContent }`. Fetches the blob at
`baseSha` as the common ancestor and the current remote content, runs a conservative 3-way merge,
and returns:

```
{ clean: boolean, text: string, remoteSha: string, conflicts: number }
```

`text` carries git-style conflict markers when `clean === false`; `conflicts` is forced to `0`
when clean. An empty `baseSha` is allowed and treated as "no common ancestor" — base becomes the
empty string and every line is an addition. The client is expected to adopt `remoteSha` as its
new `baseSha`.

This route does **not** clear the snapshot cache, correctly — it writes nothing.

Errors: 401; 400 `bad_request`; 502 `merge_failed`.

#### `POST /api/vault/upload`

Body `{ filename, dataBase64 }`. Commits a binary attachment under `_attachments/`.

Filename sanitisation is two-stage: strip `/` and `\`, trim, then require the whole basename to
match `/^[\w.-]+$/`, then require the extension to be in a 14-entry allowlist —
`png jpg jpeg gif webp svg pdf txt csv json mp4 mov mp3 wav`. Filename ≤ 200 chars.

Response `{ path }` — the vault-relative path of the committed attachment. This handler does
**not** call `clearSnapshotCache()`, unlike every other write route; whether that matters
depends on whether attachments appear in the snapshot, which I did not check
(**unverified**).

There is no explicit size bound on `dataBase64` beyond zod's `min(1)`. The 10 MB per-file
ceiling in `/api/commit` does not apply here, because this route reaches
`container.uploadAttachment` rather than the commit schema.

Errors: 401; 400 `bad_request` (invalid JSON, zod failure, or a filename/extension the
sanitiser rejects); 502 `upload_failed`.

---

### 2.4 Sharing

#### `GET /api/share`

Returns `{ shares: [{ path, slug, title }] }` — every note currently exposing a `public_slug`
in its frontmatter. Errors: 401. There is no catch clause; an upstream throw surfaces as an
unhandled 500.

#### `POST /api/share`

Body `{ path, slug }` — slug 1–60 chars. Assigns the slug by writing `public_slug:` into the
note's frontmatter. Returns `{ path, slug, publicUrl, sha }`, where `publicUrl` is built from
`NEXT_PUBLIC_SITE_URL` (defaulting to `https://frontmatter.in`).

Errors: 401; 400 `bad_request`; **409 `slug_conflict`** with
`{ slug, conflictPath, detail }` — the header comment states the UI *must* surface this body so
the user can pick another slug; **422 `invalid_slug`** with `{ detail }` on `InvalidSlugError`;
502 `upstream_failure`. Clears the snapshot cache on success.

#### `DELETE /api/share`

Body `{ path }`. Unpublishes by removing `public_slug` from frontmatter. Returns
`{ path, sha }`.

Before removal the handler reads the snapshot to capture the slug, and after removal calls
`revalidatePath("/" + slug)`. The comment gives the reason and the correction: the real public
page lives at `/<slug>` with `revalidate = 60`, while `/p/<slug>` is only a permanent-redirect
stub — without the purge an unpublished note stays readable for up to 60 seconds. The snapshot
read is wrapped in a best-effort `try`; if it fails, the share is still removed but the ISR cache
is not purged.

Errors: 401; 400 `bad_request`; 502 `upstream_failure`.

#### `GET /api/share/conflicts`

Returns `{ conflicts: SlugConflict[] }`, each `{ slug, notes: [{ path, title }] }` — slugs
claimed by more than one note, which happens when Obsidian or a git sync writes frontmatter
directly and bypasses the UI's uniqueness check.

**This handler never fails.** Its catch clause returns `{ conflicts: [] }` at status 200, with a
comment explaining that duplicate detection is a background nicety and a transient GitHub error
should not make the shell noisy. A caller cannot distinguish "no conflicts" from "the check did
not run".

Errors: 401 only.

---

### 2.5 Export

#### `GET /api/export/vault`

Zips every vault `.md` file. Returns the bytes with `content-type: application/zip` and
`content-disposition: attachment; filename="frontmatter-vault.zip"`. No parameters.

Errors: 401; 502 `upstream_failure`.

#### `GET /api/export/pdf/[...path]`

The heaviest handler in the tree (190 lines). Renders one vault note to PDF with headless
Chromium.

Flow, read from the source: auth → join `[...path]` → `container.getFile` → dynamically import
`@/modules/export/presentation/pdf-doc` and `print-css` → build a server-safe HTML document →
launch Chromium → `setContent(html, { waitUntil: "load" })` → await `document.fonts.ready` →
**a hard 2,000 ms sleep** to let the mermaid CDN module render → `page.pdf({ format: "A4",
printBackground: true, margin: PRINT_PAGE_MARGIN on all four sides })`.

Every heavy dependency is imported dynamically *inside* the handler. The header comment gives
the reason: a static import would pull `react-dom/server` (used by `pdf-doc.ts`) into the client
bundle graph, and `chromium`/`puppeteer-core` would be bundled at all. This matches the trap
listed in AGENTS.md §9.

Browser selection branches on `process.platform === "linux"`, not on a Vercel env flag — the
comment states that a local `.env.local` may define `VERCEL` for unrelated reasons, so the
platform is the reliable signal. On Linux it uses the `@sparticuz/chromium` binary, with
`CHROMIUM_PACK_URL` as an optional remote-brotli-pack escape hatch. Off Linux it launches the
developer's installed Chrome via `channel: "chrome"`, overridable with `LOCAL_CHROME_PATH`, and
passes `--no-sandbox --disable-setuid-sandbox`.

Response: PDF bytes, `content-type: application/pdf`,
`content-disposition: attachment; filename="<title>.pdf"` where the title has every character
outside `[\w\-. ]` replaced with `_`.

Errors: 401; 400 `bad_request` when the catch-all is empty; **400 `not_found`** on
`InvalidPathError` (same status/string mismatch as `/api/vault/file`); 404 `not_found` on
`FileNotFoundError`; 502 `upstream_failure` on any other fetch failure; **502
`pdf_render_failed`** with a `hint` field naming the likely cause ("Local dev may not have the
binary — use Print / PDF instead"). The browser is closed in a `finally`, with close errors
swallowed.

The 2-second sleep is unconditional. A note with no mermaid diagram still pays it.

---

### 2.6 AI

Six handlers, all `POST`, all auth-gated, all returning 502 `ai_failed` with the thrown
message as `detail` on any provider error.

| Path | Body | Response | Size limit | maxDuration |
|---|---|---|---|---|
| `/api/ai/complete` | `{ prefix }` | `{ text }` | 200,000 chars | 30s |
| `/api/ai/summarize` | `{ text }` | `{ summary }` | 200,000 chars | 60s |
| `/api/ai/refine` | `{ text, instruction? }` | `{ text }` | 200,000 chars | 60s |
| `/api/ai/suggest-links` | `{ text, candidates[] }` | `{ suggestions: [{ phrase, basename }] }` | 200,000 chars | 60s |
| `/api/ai/generate-doc` | `{ kind, idea }` | `{ document }` | 20,000 chars | 60s |
| `/api/ai/link-doctor` | `{ paths[] }` | `{ results[], errors[] }` | 50 paths | 300s |

Over-limit input returns **413 `too_large`**, which is the only place in the API that uses 413.

Specifics worth knowing:

- **`/api/ai/complete`** is the only handler that does not go through the container — it calls
  `gatewayLlmClient.generate` directly, with `speedFirst: true`. It sends only the **last 1,500
  characters** of the prefix, returns `{ text: "" }` at 200 when the trimmed prefix is under 3
  characters, unwraps a fenced reply only when both fences are present, and truncates the
  result to 280 characters.
- **`/api/ai/generate-doc`** validates `kind` against `DOC_KINDS` =
  `prd frd brd product-note spec` (`src/modules/ai/application/doc-prompts.ts:12`). An unknown
  kind is 400 `bad_request` with `detail: "invalid kind"`.
- **`/api/ai/link-doctor`** filters the submitted `paths` to those ending `.md` and slices to
  the first 50. If nothing survives the filter it returns `{ results: [], errors: [] }` at
  **200**, not 400 — a caller that sends 50 non-markdown paths gets a silent empty success. It
  builds the candidate basename list from the snapshot itself, then processes notes 3 at a time
  (`CONCURRENCY = 3` in the use-case). `results` entries are
  `{ path, content, sha, suggestions }` — it returns the full note content, so a 50-path call
  returns 50 whole notes. `errors` entries are `{ path, error }`; per-note failures are reported
  in the body at 200 rather than failing the request.

#### Provider chain and keys

`src/modules/ai/infrastructure/gateway-client.ts` builds the provider list at request time from
whichever of these environment variables is set: `GOOGLE_GENERATIVE_AI_API_KEY`, `GROQ_API_KEY`,
`CEREBRAS_API_KEY`, `MISTRAL_API_KEY`, `OPENROUTER_API_KEY`. Per-provider model overrides are
`AI_GOOGLE_MODEL`, `AI_GROQ_MODEL`, `AI_CEREBRAS_MODEL`, `AI_MISTRAL_MODEL`,
`AI_OPENROUTER_MODEL`, with `AI_MODEL` as a back-compat override for Google.

Two orderings: quality-first `google → groq → cerebras → mistral → openrouter`, and
speed-first `groq → cerebras → google → mistral → openrouter` (used only by
`/api/ai/complete`).

If **no** direct key is set, it falls through to the Vercel AI Gateway with the model string
`process.env.AI_MODEL ?? "google/gemini-3.5-flash"`. The source's own comment on that branch
says the gateway is credit-gated and "502s on free tier".

**These keys are server-side and operator-owned.** There is no request field, header, or route
by which a caller supplies their own key — that is what "no bring-your-own key" in
`docs/PRODUCT-BRIEF.md` §9 means at the API layer.

---

## 3. Status codes actually used

Collected from the handler source, not from a live run:

| Code | Where |
|---|---|
| 200 | every success |
| 304 | `GET /api/vault/snapshot` only, on ETag match |
| 400 | `bad_request`; also `not_found` on `InvalidPathError` in `vault/file` and `export/pdf` |
| 401 | every handler except `auth/[...nextauth]` |
| 404 | `vault/file`, `vault/raw`, `export/pdf`, `vault/folder` (rename of an absent folder) |
| 409 | `commit`, `vault/delete`, `vault/restore`, `vault/folder`, `vault/rename`, `vault/create` (`exists`), `share` POST (`slug_conflict`) |
| 413 | the six `ai/*` handlers only |
| 422 | `vault/version` (`not_a_file`), `share` POST (`invalid_slug`) |
| 502 | every upstream/provider failure |

No handler returns 403, 429, or 500 deliberately. A 500 can still occur — `GET /api/share` has
no catch clause, and `vault/create` re-throws any non-`InvalidPathError` from
`validateNotePath`.

---

## 4. `src/proxy.ts`

141 lines. Under Next 16 (`"next": "^16.2.6"` in `package.json`) this file replaces
`middleware.ts`; there is no `middleware.ts` or `src/middleware.ts` in the repo.

It does three things: an optimistic auth redirect for page navigations, a Report-Only CSP
header, and a matcher that keeps the middleware off static assets entirely.

### 4.1 The allowlist AGENTS.md §1 is about

```ts
const PUBLIC_STATIC_RE = /^\/[a-z0-9._-]+\.(svg|png|jpg|jpeg|gif|ico|webp|avif|webmanifest|xml|txt|json|js|map)$/i;
```

**Current allowed extensions, read from line 15 of the file:**

`svg`, `png`, `jpg`, `jpeg`, `gif`, `ico`, `webp`, `avif`, `webmanifest`, `xml`, `txt`, `json`,
`js`, `map` — fourteen, case-insensitive.

The same fourteen are repeated in the `config.matcher` negative lookahead at line 139. AGENTS.md
§1 says to edit both in the same commit, and at `e318ab3` they do match.

Two constraints the regex imposes that are easy to miss:

1. **Top level only.** The pattern is `^\/[a-z0-9._-]+\.<ext>$` — one segment. A file at
   `public/foo/bar.png` is served at `/foo/bar.png`, which does not match, and is therefore
   auth-gated.
2. **No `css`, no `html`, no `woff2`, no `mp4`.** `css` in particular is absent, which is the
   likeliest next instance of the recurring failure.

The comment block calls this pattern "THE SOURCE OF TRUTH" and says you should never have to add
explicit names again. That is true only for top-level files with one of the fourteen extensions.

### 4.2 A live instance of the §1 failure mode, in the repo right now

`public/` contains two directories of assets:

```
public/decisions/{index.html, app.css, app.js, diagram.js, fonts.css, questions.js}
public/prototype/index.html
```

I re-implemented `isPublicPath`, `PUBLIC_STATIC_RE`, `SLUG_PATTERN` and the matcher regex
verbatim in node, sourced `RESERVED_SLUGS` from `src/modules/share/domain/slug.ts`, and ran the
real public asset paths through them:

```
/decisions               middlewareRuns=true  isPublicPath=true
/decisions/index.html    middlewareRuns=true  isPublicPath=false
/decisions/app.css       middlewareRuns=true  isPublicPath=false
/decisions/app.js        middlewareRuns=true  isPublicPath=false
/decisions/diagram.js    middlewareRuns=true  isPublicPath=false
/decisions/fonts.css     middlewareRuns=true  isPublicPath=false
/decisions/questions.js  middlewareRuns=true  isPublicPath=false
/prototype               middlewareRuns=true  isPublicPath=true
/prototype/index.html    middlewareRuns=true  isPublicPath=false
/favicon.ico             middlewareRuns=false isPublicPath=true
/sw.js                   middlewareRuns=false isPublicPath=true
```

The bare `/decisions` and `/prototype` pass only because they look like public share slugs —
one lowercase segment, and neither word is in `RESERVED_SLUGS` (423 entries; I checked both).
Every asset *inside* those directories is subject to a 307 to `/login` for an unauthenticated
visitor, which is exactly the "broken image / failed manifest" symptom AGENTS.md §1 describes.

This is static analysis of the regexes, not a live `curl`. AGENTS.md §1 gives the verification
command, and it should be run before anyone acts on this:

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/decisions/app.css
# 200 = fine. 307 = the analysis above is right.
```

Two further consequences of `/decisions` and `/prototype` resolving as slugs: a user cannot
publish a note at either slug without shadowing the static directory, and `RESERVED_SLUGS`
does not protect them. AGENTS.md's own instruction is to add to that list *before* adding the
matching route; these two directories were added without it.

### 4.3 The other public paths

`isPublicPath()` (line 59) returns true for:

- `/` — because `(vault)/layout.tsx` renders `<LoginScreen />` for an unauthenticated visitor
  rather than redirecting, so the proxy must not get there first;
- `/login`;
- any single-segment slug not in `RESERVED_SLUGS` (`isPublicSlugPath`, line 51) — the modern
  public-note URL;
- anything under `/p/` — the legacy public-note URL, kept public so its 301 redirect does not
  itself bounce through `/login`;
- `/api/auth*`, `/_next/static*`, `/_next/image*`;
- anything matching `PUBLIC_STATIC_RE`;
- `/opengraph-image` and `/opengraph-image.*` — Next metadata routes that need to be public but
  do not end in a static extension.

`RESERVED_SLUGS` holds 423 strings (counted by extracting the `Set` literal and counting quoted
tokens). The domain file's comment explains the trade-off: generous is chosen because a
rejected slug costs the user five seconds while a slug that shadows a future route is a bug
shipped to users.

### 4.4 The redirect, and why `/api/*` is excluded

```ts
if (!hasSessionCookie(req) && !isPublicPath(pathname)
    && !pathname.startsWith("/api/") && !isLocalDevBypass(req)) {
  return NextResponse.redirect(new URL("/login", req.url));
}
```

`hasSessionCookie` only checks for the *presence* of `authjs.session-token` or
`__Secure-authjs.session-token`. It does not validate the token. The comment is explicit that
this is optimistic and that the real guard is `(vault)/layout.tsx` — a forged or expired cookie
gets past the proxy and is stopped by the layout and by each API handler's `getActor()`.

`isLocalDevBypass` mirrors `maybeDevBypass()` in the auth module with the same triple gate
(`NODE_ENV === "development"`, `DEV_BYPASS_AUTH === "1"`, loopback/RFC1918 host). The two
implementations are duplicated, not shared; they are consistent at `e318ab3` but nothing enforces
that.

### 4.5 CSP

The proxy sets **`Content-Security-Policy-Report-Only`** — reporting, not enforcing — on every
dynamic route it runs on. Directives: `default-src 'self'`; `img-src` adds `data:`, `blob:` and
`https://avatars.githubusercontent.com`; `script-src 'self' 'unsafe-inline' 'unsafe-eval'`;
`style-src 'self' 'unsafe-inline'`; `font-src 'self' data:`; `connect-src` adds
`https://api.github.com` and `https://ai-gateway.vercel.sh`; `media-src 'self' blob: https:`;
`frame-src` adds `https://www.youtube-nocookie.com` and `https://player.vimeo.com`;
`worker-src 'self' blob:`; `frame-ancestors 'none'`; `base-uri 'self'`;
`form-action 'self' https://github.com`; `object-src 'none'`.

`'unsafe-inline'` and `'unsafe-eval'` are both present in `script-src`. The comment gives the
reason (Tailwind injects, mermaid sets style attributes) and calls the audience "a single
trusted tenant".

The *enforced* CSP is elsewhere: `next.config.ts` sets a tight `Content-Security-Policy` on
`/p/:slug*` only, plus a base header set (`X-Content-Type-Options: nosniff` and others) on
`/:path*`. Note the mismatch worth flagging: §4.3 says the modern public-note URL is `/<slug>`
and `/p/<slug>` is a legacy redirect stub — but the enforced public CSP in `next.config.ts` is
scoped to `/p/:slug*`. Whether `/<slug>` gets the tight CSP is **unverified**; I read the two
`source:` entries in `next.config.ts` but did not trace how the `/<slug>` page is served.

Two more comments in the proxy have drifted from each other: line 108-109 says mermaid and KaTeX
come from a CDN, and line 116 four lines later says "mermaid + KaTeX are bundled (not CDN)".
The `connect-src`/`script-src` list is consistent with the bundled claim, and
`export/pdf/[...path]` is consistent with the CDN claim for that route specifically. Harmless,
but the first comment should go.

---

## 5. What has no test

```
$ find test -name '*.test.ts' | wc -l
81
$ ls test/api/
folder-route.test.ts
share-conflicts-route.test.ts
share-route-revalidate.test.ts
share-route.test.ts
```

Four of the 26 handler files have a test under `test/api/`, all of them for `share` or `folder`.
`test/proxy.test.ts` covers `isPublicPath` and `isPublicSlugPath` — it asserts that top-level
static assets pass by extension and that arbitrary `/api/*` paths do not, but it does not test a
nested asset path, which is why the `/decisions/*` case in §4.2 went unnoticed.
`test/vault/raw-content-type.test.ts` covers `inferContentType`.

Nothing tests `/api/commit`, `/api/vault/create|delete|rename|restore|merge|upload|file|search|
history|version|unlinked|snapshot|raw`, `/api/export/*`, or any `/api/ai/*` handler.
`vitest.config.ts` excludes `**/.claude/**`, with a comment explaining that two abandoned agent
worktrees were inflating the suite by 66.4% with duplicate runs of a pre-work commit.

## 6. What the API does not do

Stated plainly because the absence is the point:

- **No mdmax engine on any route.** `grep -rn "modules/mdmax" src` outside the module itself
  returns exactly two hits, both `decodeStrict` from `shape-gate` in
  `vault/application/get-snapshot.ts` and `vault/infrastructure/search-index.ts`. No API handler
  imports it. The byte-exactness engine is not reachable over HTTP at `e318ab3`.
- **No bring-your-own-key.** No handler reads a caller-supplied provider key; see §2.6.
- **No pagination anywhere.** `/api/vault/snapshot` returns the whole tree, `/api/vault/search`
  every match, `/api/vault/history` a fixed 50 with no cursor.
- **No rate limiting found** in any handler. **Unverified** as an absolute claim — I read all 26
  handlers and saw none, but did not grep the whole tree or check for a platform-level limit.
- **No per-endpoint authorisation.** One allowlisted login; any authenticated actor can call
  everything.
