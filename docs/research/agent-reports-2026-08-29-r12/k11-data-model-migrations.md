### 1. Inventory — every artifact that needs a version, and where the version lives

Current live state [measured, `grep -rl '"$schema"' src specs public` on 2026-08-29]: exactly **one** file in the repo carries a `$schema` — `specs/_schema/spec.schema.json`. Versioning today is one file deep.

Existing in-code version carriers [measured]:
- `Certificate.schema: 'mdmax/cert@1'` — `src/modules/mdmax/domain/cert-contract.ts:132`
- `Certificate.fold: { version }` — `cert-contract.ts:137`
- `FOLD_VERSION = 'mdmax/fold@1'` — `src/modules/mdmax/domain/fold.ts:45`, with the comment at `fold.ts:40`: changing any rule requires bumping it because the cert quotes it
- `Engine.version` + optional `Engine.sha` embedded per engine in `bench.engines[]` — `cert-contract.ts:81,83`
- `spec.schema.json` requires `spec: { const: 1 }` and sets `additionalProperties: false` [measured]

| # | Artifact | Bytes held by | Version carrier (proposed) | Placement | We may rewrite? |
|---|---|---|---|---|---|
| 1 | Document frontmatter (user's own keys) | User file | **None of ours** | — | Never unattended |
| 2 | User-defined frontmatter schema | User file (`.frontmatter/schema.yml`) | `fm_schema: 1` + `$schema` URI | First key, in-band | Explicit action only |
| 3 | Render profile definition | User file or R2 | `profile: 1` + `$schema` URI | First key | Explicit action only |
| 4 | Degradation certificate sidecar | Sidecar / R2 | `schema: "mdmax/cert@1"` [measured — exists] | First key | Regenerate, never edit |
| 5 | Fold ruleset | Engine constant | `mdmax/fold@1` [measured — exists] | Code + quoted into cert | N/A (code) |
| 6 | Splice refusal vocabulary | Engine, surfaced in cert + UI | `refusals@N` (**missing**) | Code + cert | N/A |
| 7 | Session interchange format | Exported file, published spec | `$schema` URI + `session: N` | First key | Never — it is an artifact |
| 8 | Saved searches / views | Server row + optional export | column `v` int; export `saved_view: 1` | Row + first key | Yes (we hold it) |
| 9 | Server-side metadata | R2 object custom metadata, DB | `x-fm-schema: fm/objmeta@1` | HTTP metadata | Yes (we hold it) |
| 10 | Workspace config | User file | `workspace: 1` | First key | Explicit action only |
| 11 | Engine/target registry (bench) | Repo + cert copy | per-engine `version`/`sha` [measured — exists] | Embedded in cert | N/A |
| 12 | Export artifacts (HTML/PDF/print) | User's disk | generator stamp in comment/XMP | Header | No — immutable output |
| 13 | Local index/cache (Tauri) | User's disk, derived | `cache: N`, rebuild on mismatch | Sidecar DB pragma | Yes — it is derived |
| 14 | AI tool-call schemas (AI SDK v6) | Wire | API version, not file version | Request header | N/A |

**Placement rule (three tiers)** [inference, modelled on Avro]: (a) *in-band, first key, self-describing* for anything a user holds — Avro's rule is that "the original schema must be provided along with the data" [fetched, avro.apache.org 1.12.0 spec, Schema Resolution]; we cannot ship a registry to a user's laptop, so the file must describe itself. (b) *sidecar header* for derived artifacts we generate beside a document. (c) *transport metadata* for objects we hold.

**Absence rule** [inference]: JSON Schema 2020-12 states that if `$schema` is "absent from the document root schema, the resulting behavior is implementation-defined" [fetched, json-schema.org draft/2020-12 core §8.1.1]. Implementation-defined is exactly the hole. Define it once, in writing: **a missing version key means v1, permanently, and is never re-interpreted.** Anti-recommendation: do not infer version by sniffing which keys are present — key-shape sniffing makes every future additive change retroactively change the parse of old files.

---

### 2. The compatibility contract — stated as rules

Anchors: semver [fetched, semver.org, 2026-08-29] — MAJOR = incompatible changes, MINOR = backward-compatible additions, PATCH = backward-compatible fixes; "Major version zero (0.y.z) is for initial development. Anything MAY change." Confluent [fetched, docs.confluent.io] — BACKWARD (default), FORWARD, FULL, and TRANSITIVE variants; "BACKWARD compatibility means that consumers using the new schema can read data produced with the last schema"; BACKWARD checks only the previous version, BACKWARD_TRANSITIVE checks all.

| Rule | Statement | Anchor |
|---|---|---|
| C1 | Every artifact declares **BACKWARD_TRANSITIVE**, not BACKWARD. A user opens a 2021 file, not last-quarter's file. | [fetched] Confluent: BACKWARD "ensures that consumers using the new schema X can process data written by producers using schema X or X-1, but not necessarily X-2" |
| C2 | User-held artifacts additionally promise **FORWARD** for one MAJOR: an older build must open a newer file *readably*, degrading unknown keys, never erroring. | [inference] The user's other machine is on the old build; we do not control rollout |
| C3 | Unknown keys are **preserved verbatim on write**, never dropped. | [fetched] Avro: "if the writer's record contains a field with a name not present in the reader's record, the writer's value for that field is ignored" — Avro *ignores*; we must go further and *round-trip*, because our file is the source of truth, not a wire frame |
| C4 | A new **required** field is a MAJOR change. New fields are optional or carry a reader-side default. | [fetched] Avro: reader field with a default → default used; reader field with no default and absent in writer → "an error is signalled". [fetched] protobuf.dev: "Don't Add a Required Field… Required fields are considered harmful by so many they were removed from proto3 completely" |
| C5 | **Never re-use a key name for a different meaning.** Retire names into a reserved list. | [fetched] protobuf.dev: "Never re-use a tag number… Do Reserve Tag Numbers for Deleted Fields… You can also reserve names to avoid recycling now-deleted field names" |
| C6 | **Never change a key's type in place.** Add a new key, dual-read, retire the old. | [fetched] protobuf.dev: "Don't Change the Type of a Field… changing a field's type can be difficult to roll out safely even when the new schema can successfully parse old data" |
| C7 | New enum members (verdict classes, refusal reasons, profile modes) require a reader-side default. Unknown member ≠ crash. | [fetched] Avro: "if the writer's symbol is not present in the reader's enum and the reader has a default value, then that value is used, otherwise an error is signalled". [fetched] protobuf.dev: "Do Include an Unspecified Value in an Enum" |
| C8 | Documentation/annotation fields never participate in compatibility checks. | [fetched] Avro: "A schema's `doc` fields are ignored for the purposes of schema resolution" |
| C9 | Two version axes, never conflated: **format version** (integer, in-band) and **product version** (semver, in the changelog). A file says `session: 2`; the app says `1.7.3`. | [inference]; semver's "0.y.z anything MAY change" [fetched] is a **statement about APIs, not about bytes on someone else's disk** — files written under 0.x still exist forever, so 0.x is not a licence to break user-held formats |
| C10 | Any schema we publish pins its dialect: `$schema` MUST be a normalized URI with a scheme, at the document root. | [fetched] json-schema.org 2020-12 core §8.1.1 |
| C11 | `additionalProperties: false` is banned in **user-facing** schemas. | [measured] `specs/_schema/spec.schema.json` sets it — correct for an internal, repo-held spec file; fatal for a user file, because a closed schema makes an old build *reject* a new file rather than degrade it, breaking C2 |
| C12 | Anything the certificate quotes (`fold.version`, engine `version`/`sha`) is part of the compatibility surface. Bumping it invalidates prior certificates rather than re-labelling them. | [measured] `fold.ts:40`; [fetched] protobuf.dev: "Never Rely on Serialization Stability Across Builds" |

**Anti-recommendation to C2**: do not promise forward compatibility *forever*. One MAJOR, then a "this file was written by a newer version, please update" refusal — a refusal is honest; silently dropping keys the old build did not understand is the failure mode C3 exists to prevent.

---

### 3. Migration for user-held files — the hard case

The structural asymmetry [inference]: Confluent's registry, GitLab's post-deployment migrations, and Avro's writer-schema-with-data all assume the migrator can reach the bytes. We cannot. A Tauri user's vault on an offline laptop is unreachable, permanently. Therefore **no user-held format may ever require a migration to remain readable.** Migration becomes *optional cleanup*, never *a precondition for correctness*.

**Read-old-write-new, stated precisely:**

| Phase | Behaviour | Anchor |
|---|---|---|
| Expand | Reader accepts old+new. Writer still emits **old**. Ship, wait. | [fetched] martinfowler.com/bliki/ParallelChange.html (Danilo Sato, 13 May 2014): "expand, migrate, and contract" |
| Migrate | Writer emits **new** only for files the user's own edit already dirties. Never a sweep. | [inference] |
| Contract | Reader drops old support only after the deprecation clock (§4) expires. | [fetched] GitLab: "Ignoring and dropping columns should not occur simultaneously in the same release" |

**The touch budget** [inference, this is the rule the splice engine forces]: when a user edits a document, we already rewrite the byte range they touched. A frontmatter migration may ride along **only if it is inside a range the user's edit dirties anyway**. It may never widen the dirty range. Consequence: migration converges asymptotically over months of normal editing and never produces a mtime change the user did not cause.

**When we may rewrite a user file — all four gates, conjunctively:**

1. **G1 Consent.** The user pressed a button whose label names the change. Obsidian's precedent [fetched, help.obsidian.md Format converter]: a core plugin, opt-in, whole-vault, carrying an explicit warning — "Format converter converts your entire vault based on your settings. Back up your Obsidian files before you perform the conversion."
2. **G2 Preview.** A diff is shown, per file, before anything is written. Anti-recommendation: never a count ("412 files will be updated") without the byte diff for at least the first file.
3. **G3 Reversibility.** An undo artifact exists — original bytes, hashed, recoverable — before the first write.
4. **G4 Refusal-on-ambiguity.** If the old form cannot be mapped deterministically, the file is **skipped and reported**, not guessed. This is the splice engine's own contract applied to migration.

**What Obsidian's migration actually cost** [fetched]: `tag`, `alias`, `cssclass` were deprecated in 1.4 and support was "dropped in Obsidian 1.9." The 1.4.5 changelog (dated August 30, 2023) is a list of exactly the breakage a metadata migration generates — "Making changes to the casing of a property ('property' vs. 'PROPERTY') will now properly save"; "It is no longer possible to have multiple property types with the same spelling and different casing"; "Properties can no longer have both 'tag' and '#tag' as entries in the same file"; "It is no longer possible to change the default property type." Two structural lessons [inference]: (a) the global type binding — "Once a property type is assigned to a property name, all properties with that name across your vault will use the same type" [fetched] — makes key *names* a vault-global namespace, so a rename is a vault-wide operation, not a file operation; (b) the automated converter for deprecated properties shipped "As of Obsidian `1.9.3`" [fetched] — i.e. in the same minor line that removed support, not at deprecation in 1.4. **Ship the converter at deprecation, not at removal.** GitLab's ladder makes this a hard ordering rule: ignore (release M) → drop (M+1) → remove the ignore rule (M+2) [fetched, docs.gitlab.com].

**Astro's escape hatch is the model for the un-migratable** [fetched, docs.astro.build/en/guides/upgrade-to/v5/]: the v2.0 Content Collections API became legacy — "They should function normally but are no longer recommended and are in maintenance mode. They will see no future improvements and documentation will not be updated. These features will eventually be deprecated, and then removed entirely" — with a `legacy.collections` flag for users "unable to make any changes to your collections at this time." Note what its migration actually demanded [fetched]: moving the config file, adding a required `loader`, removing `type`, and renaming `slug` → `id`. That is a rename of an identity field — C5/C6 territory — and it is why Astro needed a flag rather than a converter.

---

### 4. Deprecation policy and timeline

| Stage | Gate | Duration | Anchor |
|---|---|---|---|
| D0 Announce | Changelog + in-app notice naming the key and its replacement. Converter **ships here**. | — | [fetched] Obsidian shipped its converter at 1.9.3, i.e. late — do the opposite |
| D1 Dual-read | Reader accepts both. Writer emits old. Old form documented as deprecated. | ≥ 1 MINOR | [fetched] GitLab release M |
| D2 Dual-write | Writer emits new on touched files only (§3 touch budget). Reader still accepts both. | ≥ 2 MINOR | [fetched] GitLab M+1 |
| D3 Warn | Opening a file with the old form shows a one-line, dismissible notice with a "convert this file" action. | ≥ 1 MINOR | [inference] |
| D4 Remove | Reader stops accepting. Requires a MAJOR **and** an elapsed-date gate. | MAJOR only | [fetched] semver: MAJOR for "backward incompatible changes" |

**Both gates are mandatory, version and date.** GitLab encodes exactly this pair [fetched]: `ignore_column :updated_at, remove_with: '12.7', remove_after: '2019-12-22'` — a version *and* a wall-clock date, and "This should only get merged with the release indicated with `remove_with` and once the `remove_after` date has passed."

**Minimum wall-clock window: 18 months for anything user-held.** Derivation of the comparable [fetched + derived]: Obsidian's deprecated-properties help section was created 2023-08-04 (obsidian-help commit, GitHub API) and the 1.9.2-era docs commit is dated 2025-06-05; (2025-06-05 − 2023-08-04) = **671 days = 22.0 months** [derived: 671 ÷ 30.44]. The exact 1.9.0 release date could not be fetched — obsidian.md/changelog has no reachable RSS or sitemap [measured: both returned HTTP 404 on 2026-08-29] — so 22.0 months is a **bound on the announce→docs-updated interval, not a verified announce→removal interval**. 18 months is the recommendation; 22 is the observed comparable.

**Anti-recommendation**: do not run a fixed calendar (e.g. "removals every March"). A calendar forces removals that have no user benefit and creates a MAJOR bump with nothing in it. Removal is event-driven — the old form's live-file share, measured, must fall below a stated threshold *and* the clock must have expired.

---

### 5. How the certificate and the splice guarantee constrain migration

| Constraint | Mechanism | Consequence |
|---|---|---|
| Any byte change invalidates every certificate for that file | `Certificate.file: { path, sha256, bytes }` [measured, `cert-contract.ts:138`] | A migration is a **cert-invalidating event**. Certs must be regenerated, never patched to point at new bytes |
| Byte ranges are absolute offsets | `CertBlock.byteRange: [number, number]` [measured, `:118`] | A frontmatter migration that changes the byte *length* of the block shifts every downstream offset. Re-derive; never arithmetic-shift a stored cert |
| Fold rules are quoted into the cert | `fold: { version }` [measured, `:137`]; `FOLD_VERSION = 'mdmax/fold@1'` [measured, `fold.ts:45`] | A fold change is a compatibility break of the **verdict**, not of the file. Old certs stay valid *for their fold version* and must display it |
| Refusal is a first-class outcome | `CertFailure` reasons: `ENGINE_MISSING`, `ENGINE_THREW`, `SHAPE_REFUSED`, `NO_TARGETS` [measured, `:150-154`] | Migration needs the same closed vocabulary: `MIGRATE_REFUSED_AMBIGUOUS`, `MIGRATE_REFUSED_UNKNOWN_VERSION`, etc., versioned as `refusals@N` (**currently absent**) |
| Declared targets carry staleness | `fidelity: 'local' \| 'declared' \| 'requires-push'`, `lastVerified` [measured, `:106-108`] | Precedent for the whole doctrine: **a stale artifact must look stale rather than silently pass.** Apply to schemas — a file written against a retired schema version renders with a visible provenance mark, not a silent coercion |

**The load-bearing rule** [inference]: the splice guarantee ("locate the byte range, replace only those bytes, REFUSE rather than guess") is not merely compatible with migration policy — it *is* the migration policy. A migration that cannot be expressed as a splice is a migration we are not allowed to run. Anti-recommendation: do not add a "normalize on save" mode that reserializes frontmatter through a YAML round-trip. That is the single change that would break every certificate in the corpus at once, reorder keys, and destroy comments — and it is the most tempting shortcut available, because it makes every migration trivial to implement.

---

### 6. Anti-recommendations

| Do not | Because |
|---|---|
| Build a server-side schema registry as the source of truth | [inference] We do not hold the files. A registry the offline Tauri client cannot reach is a registry that lies. Avro's model — schema travels *with* the data — is the correct prior art [fetched] |
| Use semver on file formats | [fetched] semver governs APIs; MINOR permits additions that an old *reader* cannot see. Use a monotonic integer for formats, semver for the product, and never let one imply the other |
| Adopt `additionalProperties: false` in user-facing schemas | [measured] Correct in `specs/_schema/spec.schema.json` (internal); in a user schema it converts every forward-compatible addition into a hard rejection on old builds |
| Auto-migrate on open | [fetched] Obsidian's converter is explicitly opt-in, whole-vault, and warns to back up first. Auto-migrate changes mtimes the user did not cause, triggers their sync client, and invalidates certs invisibly |
| Version by content sniffing | [inference] Makes every future additive key retroactively change how old files parse — the exact class C5/C6 exist to prevent |
| Rename an identity field | [fetched] Astro's `slug` → `id` needed a `legacy.collections` escape flag rather than a converter. Identity renames are not migratable; they are forks |
| Default to BACKWARD compatibility | [fetched] Confluent's default is BACKWARD, which checks only the previous version; its own docs note "best practice for Protobuf is to use BACKWARD_TRANSITIVE." A 2021 file is not X-1 |
| Ship a converter at removal time | [fetched] Obsidian's property converter arrived "As of Obsidian 1.9.3", the line that dropped support. The tool must exist during the warning window, or the warning is unactionable |
| Let a migration widen the dirty byte range | [measured] `byteRange` offsets and `file.sha256` are how the certificate stays honest; a widened range is an unrequested rewrite |
| Publish the session-interchange format before the compatibility contract | [fetched] protobuf.dev: "Clients and servers are never updated at exactly the same time — even when you try to update them at the same time." Once third parties parse it, C5 (never re-use a name) binds forever |

**Recorded source disagreements** — not resolved:
- **Default compatibility direction.** Confluent ships BACKWARD as default while its own page recommends BACKWARD_TRANSITIVE for Protobuf "as adding new message types is not forward compatible" [fetched, same document].
- **Removal cadence.** GitLab mandates a fixed 3-release ladder with both a version and a date gate [fetched]; Astro's legacy path is open-ended — "will eventually be deprecated, and then removed entirely" with no stated clock [fetched].
- **Absent version semantics.** JSON Schema declares absent `$schema` "implementation-defined" [fetched]; Avro requires the writer's schema to always accompany the data [fetched]. The specs disagree on whether unversioned data is permissible at all.

**Unverified**: the exact Obsidian 1.9.0 release date (changelog RSS and sitemap both returned HTTP 404 on 2026-08-29 [measured]); the 22.0-month figure therefore bounds announce→docs-update, not announce→removal.

---

**Reconcile (LR#48), verified [measured, 2026-08-29]**: ran `git -C ~/.claude status --porcelain -- skills-src settings.json` (read-only). The 18 dirty entries are all PWA / design-system / framer-clone / yt / zs-docs skill work plus a `sgnk-handover/SKILL.md.bak-20260810T013353Z` backup — none touch frontmatter, mdmax, cert, splice, or migration. HEAD is `6e390828` ("Apply the memory/handoff research…"), not authored by this session. This subagent made zero writes and zero commits; its only actions were `curl` into the session scratchpad and read-only `grep`/`Read`/`find`/`git status`.