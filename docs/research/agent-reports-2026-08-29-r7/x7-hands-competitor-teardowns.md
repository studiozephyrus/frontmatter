### Scope and provenance of this batch

- Three executed write-path teardowns, all with live code execution: **hubble.md** and **Front Matter CMS** (source: `h3-hubble-fmcms-teardown.md`), **OpenKnowledge** (source: `h4-openknowledge-teardown.md`). A fourth surface, **Obsidian `processFrontMatter`**, appears only as a prior comparator [SS].
- h3 method: shallow source pulls via codeload tarballs (git clone blocked by sandbox object-store error; GitHub API rate-limited so metadata scraped from repo HTML), full read of write-path code, **live execution of both products' actual writer code**. Artifacts: `.../scratchpad/teardowns/{hubble.md-main/, vscode-front-matter-main/, probe/roundtrip.ts, probe/fixedpoint.ts, probe/fmcms.mjs}`.
- h4 method: npm registry JSON + 0.64.1 tarball, shallow clone of `github.com/inkeep/open-knowledge` at HEAD `2a043f58` (2026-08-28 05:36 UTC), live experiments against the shipped 0.64.1 server run locally (macOS, node v24.6.0, loopback, sandboxed fake HOME). Artifacts: `.../scratchpad/{ok-repo,ok-pkg,okvault,orig-backup}`.
- h4 lane 2 caveat [fetched]: "I did not drive a live browser client; this lane is source-verdict."

### Vital signs table

| | hubble.md (bholmesdev) | Front Matter CMS (estruyf/vscode-front-matter) | OpenKnowledge (inkeep/open-knowledge) |
|---|---|---|---|
| Stars | 1,441 [fetched — repo HTML `aria-label="1441 users starred"`] | 2,539 [fetched — repo HTML] | 3,673; 239 forks; 30 open issues [fetched, api.github.com] |
| License | MIT, © 2026 Ben Holmes [fetched — LICENSE] | MIT, © 2019 Elio Struyf [fetched] | GPL-3.0-or-later + Apache-ICLA-style CLA (`CLA.md`) granting Inkeep sublicense rights [fetched] |
| Version | desktop v0.1.28, Electron ^42.3.1 [fetched] | beta `vscode-front-matter-beta` v10.12.0; stable id `eliostruyf.vscode-front-matter`; `engines.vscode ^1.125.0` [fetched] | npm latest **0.64.1**, beta 0.65.0-beta.6; **1,201 total versions**; **exactly 100 published in trailing 7 days** (since 2026-08-21) [measured] |
| Repo age | — | 2019-era architecture [fetched] | created **2026-06-03** (<3 months), pushed 2026-08-28, PRs near #3976 [fetched] |
| Package size | — | — | `https://registry.npmjs.org/@inkeep/open-knowledge/-/open-knowledge-0.64.1.tgz`, **29,013,360 B** download, unpacked **60,798,953 B / 1,337 files**; bins `open-knowledge`, `ok` [measured] |
| Runtime | Electron desktop + www (React+Convex, "HEAVILY WIP") + web (Astro landing); 7 packages: editor, ui, runtime, sync, sync-backend, convex-client, cli [fetched] | VS Code only; all UI webviews; writes via `vscode.TextEditor.edit` / `workspace.fs`; no CLI, no standalone, no web [fetched] | Electron desktop (mac/win/linux) + web UI + CLI; loopback-only by default [fetched] |

### Teardown 1 — hubble.md body path: exact input → exact output

- Mechanism: Tiptap v3 / ProseMirror model regenerate. In: `remark-parse` + `remark-gfm` via `packages/editor/src/markdownToProsemirror.ts` (900 lines). Out: hand-written serializer `prosemirrorToMarkdown.ts` (479 lines). Frontmatter via `yaml` ^2.9.0 (`frontMatter.ts`) [fetched].
- Probe: `probe/roundtrip.ts` importing `packages/editor/src/*` verbatim, one gauntlet doc [measured].

| Input bytes | Output bytes |
|---|---|
| setext heading | `# ATX` |
| `_italic_` / `__bold__` | `*italic*` / `**bold**` |
| `*` bullet, `+` bullet | `-` |
| `1)` | `1.` |
| list numbered `3.`, `1.` | `3.`, `4.` (renumbered) |
| `\|:---\|:---:\|` | `\|---\|---\|` (alignment lost) |
| indented code block | backtick fence |
| `~~~js` | ` ```js ` |
| backslash hard break | two-space break |
| any block separator | exactly `\n\n` |
| `A [reference link][ref]` + `[ref]: url` | `A  and...` — **link text destroyed with the link** |

- Reference-link mechanism: remark emits `linkReference` / `definition` nodes the converter does not model; `blockToMarkdown`'s `default: return ""` silently drops unknowns — `prosemirrorToMarkdown.ts:131` [measured].
- **Round-trip is not a fixed point** [measured — `probe/fixedpoint.ts`]: pass 2 merged the adjacent lists and renumbered the `3.`-start list into items 2–3 of the previous list; stable only from pass 3.
- Mitigations they DID build: `rawMarkdownAddEmptyMarkers` empty-paragraph marker pass (`markdownToProsemirror.ts:822`) — 3 blank lines survived [measured]; raw HTML falls back to a text paragraph "to avoid data loss" — an HTML comment survived byte-exact [measured]; source-mode `MarkdownSourceEditor` (whole file as one code block) as a byte-faithful escape hatch (`apps/desktop/src/App.tsx:831-847`) [fetched].
- Their `MarkdownRoundtrip.test.ts` is a seeded property test of doc→md→doc — **pins editor-model fidelity, never source-byte fidelity** [fetched].

### Teardown 1b — hubble.md frontmatter: split verdict

- **Good half** [fetched — `EditorView.tsx:122-131, 207-216`; `htmlAppFileApi.ts:50`]: on body-only edits the raw YAML string from parse is re-attached verbatim (`partsRef.frontMatter` + `combineMarkdownFrontMatter(raw, body)`), modulo trim + `---` re-wrap. Better than Obsidian [SS].
- **Bad half**: ANY File Properties panel edit calls `serializeFrontMatter(allProperties)` (`FilePropertiesPanel.tsx:780`), regenerating the block from a typed model `{text|number|checkbox|date|tags|unsupported}`. Measured by executing `frontMatter.ts` [measured]:

| Input | Output |
|---|---|
| YAML comment line | deleted |
| `title: My Post` | `title: "My Post"` (text hard-coded to `QUOTE_DOUBLE`, `frontMatter.ts:84-86`) |
| `count: 007` | `count: 7` |
| `quote: 'single'` | `quote: "single"` |
| nested maps | survive only as re-stringified values (comments/format inside lost at parse) |
| `og:image: /img.png` | **deleted from file** |
| `weird key: hello` | **deleted from file** |

- Key-deletion mechanism: `if (!isSimplePropertyKey(property.key)) continue;` — `frontMatter.ts:77`; gate is `/^[a-zA-Z0-9_-]+$/`. Unsupported rows render read-only in the panel, but editing any OTHER property emits all → same drop (`FilePropertiesPanel.tsx:291-301, 765-780`). The HTML App File API property-patch path routes through the same serializer (`htmlAppFileApi.ts:61`), so agent-facing app writes inherit the hole [measured/fetched].

### Teardown 1c — hubble.md non-fidelity architecture worth copying

- Storage: Workspace = any folder with `.hubble/config.json`; desktop reads/writes the filesystem directly as "the working source of truth"; Plain Folder (no config) = viewer/editor with nothing synced. Assets at `<md-stem>.assets/<hash>.<ext>` beside the file [fetched — CONTEXT.md].
- Dual-surface consistency: chokidar workspace watcher (`apps/desktop/electron/main.ts` + `workspaceWatcher`) feeds `classifyFileChange({editorContent, baseline, diskContent}) -> none|reload|match|conflict` (`apps/desktop/src/externalFileChange.ts`, 19 lines) — agent edits hot-reload when the editor is clean, dirty-vs-disk divergence surfaces as a conflict state instead of silent clobber; echo suppression via `rememberSelfSave` (`store/actions.ts`); whole-file writes debounced at 120 ms (`EditorView.tsx DEFAULT_SAVE_DEBOUNCE_MS = 120`); external reload uses `setContent(..., emitUpdate: false)` so reloads don't re-save (`EditorView.tsx:275`) [fetched].
- Agent story = **no MCP anywhere** [measured — grep; only mentions are repo-dev SKILL.md for their own Warp-factory CI agents]. Instead: files on disk + live reload; Claude-convention skills probed at `~/.claude/skills`, `~/.agents/skills`, `<ws>/.claude/skills`, `<ws>/.agents/skills` (`electron/main.ts:635-668`) for `bholmesdev/hubble-skills` (`create-html-app`, `embed-html-app`, `review-markdown-comments`), installed via `npx skills add bholmesdev/hubble-skills`; embedded node-pty terminal (`electron/terminal.ts`) whose `AgentLogos.tsx` contains **exactly Claude and Codex** [measured]; CriticMarkup review threads serialized INLINE in the md as `{==...==}{>>...<<}{#id}` (`prosemirrorToMarkdown.ts:238-254`) so human comment threads are plain text an agent can read and answer; HTML Apps in a sandboxed iframe with a capability-scoped broker File API — patch-like updates where omitted keys are preserved and `null` deletes (`apps/desktop/src/editor/htmlAppFileApi.ts`).
- Sync: Convex, whole-file `content` strings + `contentHash` + `updatedAt` + `deviceId` per path — document-level, **no CRDT/OT**; conflicts materialize as a conflict-named copy file (`sync/src/sync.ts:132-133`), Dropbox-style. `hubble` CLI syncs a folder (chokidar + convex-client). Web workspace is Convex-only, no local files. Cloud Sync currently requires a Convex deployment even to mint a workspace id (their own CONTEXT.md flags this) [fetched].

### Teardown 2 — Front Matter CMS: the code that contradicts its own comment

- Write path [fetched]: panel change → `CommandToCode.updateMetadata` → `ArticleHelper.update` → `generateUpdate`, which builds a `vscode.Range` over the **ENTIRE document** and replaces it with `stringifyFrontMatter(body, data, originalText)` (`src/listeners/panel/DataListener.ts:84-85, 797-799`; `src/helpers/ArticleHelper.ts:368-419`).
- `stringifyFrontMatter` → `FrontMatterParser.toFile` → `matter.stringify` with a custom YAML engine (`ParserEngines.ts`). The engine's own comment says **`// Do our own parsing to keep the comments`**, re-parses the ORIGINAL frontmatter with comment-retaining `yaml.parseDocument`, applies `set`/`delete` — **and then throws the Document away**: `const updatedValue = docYaml.toJSON(); return yaml.stringify(updatedValue, {...})` (lineWidth 5000/50000, PLAIN strings by default since `taxonomy.quoteStringValues` defaults false, indent 2/tabSize). **The Document round-trip contributes exactly one thing: key ORDER** [fetched].
- Live probe `probe/fmcms.mjs` — their engine code verbatim, pinned `gray-matter@4.0.3` / `yaml@2.2.1`, default settings, editing ONE field (`title`) [measured]:

| Input | Output |
|---|---|
| `# Site metadata comment` | **deleted** |
| folded block scalar `>-` | collapsed to one line |
| flow seq `[a, b]` | exploded to block `- a` / `- b` |
| anchor/alias `&al` / `*al` | **resolved and duplicated** (mirror became a copy) |
| `weight: 007` | `weight: 7` |
| `empty:` | `empty: null` |
| key order | preserved |
| `og:image`, `"quoted key"` | **kept** (no key policing) |
| date string | untouched |
| body incl. reference link + trailing definition | **byte-identical** |

- **Same input, different output depending on internal state** [measured]: the comment branch fires only when the one-shot global `FrontMatterParser.currentContent` is warm (set by the last `fromFile`, consumed on first stringify). A second stringify of identical data fell to plain `yaml.stringify(obj)` and emitted `aliases: &a1 ... mirror: *a1` (auto-anchor) where the warm path had emitted duplicated arrays. Cross-file interleaving can leave the wrong file's content in the global (affects ordering only, since keys are force-set/deleted).
- `yawn-yaml` — a formatting-preserving YAML editor — is **declared in package.json and used nowhere in src** [measured — grep]. Preservation was attempted and abandoned, not rejected.
- Post-processing is string surgery: the `removeQuotes` setting does literal `newMarkdown.replace("'value'", value)` on the whole file — first occurrence anywhere, **body included** (`ArticleHelper.ts:398-415`) [fetched].
- Fidelity is settings-whack-a-mole over a lossy stringify: `quoteStringValues`, `noPropertyValueQuotes`, `removeQuotes`, `commaSeparatedFields`, `indentArray` [fetched].
- Other stack facts: data model is a repo-root `frontmatter.json` (JSON-schema'd at frontmatter.codes) holding `frontMatter.*` settings — `content.pageFolders`, `taxonomy.contentTypes` (typed field definitions per content type), snippets with typed placeholder fields, media/public folder config (`src/helpers/ContentType.ts`); FrameworkDetector + ssg-scripts integrate Hugo/Jekyll/Next/Astro (e.g. `ssg-scripts/astro.collections.mjs` reads Astro content collections); parsing = gray-matter 4.0.3 with custom engines, YAML via `yaml` 2.2.1, TOML via `@iarna/toml` (`+++`), JSON front matter, language sniffed from the file's opening delimiter (`src/parsers/FrontMatterParser.ts` + `ParserEngines.ts`); body editing is VS Code itself, remark/rehype appear only in `WysiwygField.tsx` for individual frontmatter FIELD values [measured — grep remark-stringify/rehype-remark]; **no MCP, no agent-facing surface** — AI is a `Copilot` service consuming `vscode.lm` LanguageModelChat to suggest titles/descriptions/taxonomy INTO the human panel, plus a hosted SponsorAI (`src/services/Copilot.ts`) [measured/fetched].

### Teardown 3 — OpenKnowledge: three fidelity lanes, not one

- Stated contract [fetched — `packages/server/src/bridge-intake.ts` header]: "**Y.Text is the source-of-truth for user-intended source bytes.** Bytes that enter via these primitives land verbatim, modulo only the equivalence classes enumerated in `normalizeBridge` — and even those are TOLERATED at compare time, never WRITTEN at apply time." Unlike the other two, **this claim survives execution on the lane it covers.**
- **Lane 1 — agent/API body edits: SPLICE, byte-perfect** [measured live on 0.64.1]. `POST /api/agent-patch` does find/replace against `ytext.toString()`; `api-agent-patch-ytext-truth.test.ts`: "the search surface IS the user's source bytes" (the pre-contract flow that searched *serialized* text is called out as the fixed bug). Adversarial fixture: YAML comment, deliberate key order, `"double"`/`'single'` quoting, flow seq, setext heading, `_underscore_` emphasis, `+` bullets, list starting at 7, indented code, `~~~` fence, trailing spaces, wiki link, entity. Results: edit→revert round-trip **sha256 byte-identical** (`c2e6cb3e…`, fidelity.md); CRLF file byte-identical; missing-final-newline file byte-identical (still no final newline); non-reverted single edit diff = **exactly the one edited line**; external disk overwrite while server live → **no bounce-back rewrite**, file stays at written hash.
- **Lane 2 — WYSIWYG: regenerate + block-aligned minimal splice** [fetched]. `packages/server/src/map-driven-splice.ts`: serialize new PM JSON → canonical body, parse both, longest common prefix/suffix of top-level mdast blocks under structural equality (positions ignored), emit ONE contiguous splice. Docblock: "Untouched prefix + suffix blocks stay in Y.Text byte-identical… a block whose authored bytes differ from what the serializer would emit… is treated as equal — the OLD bytes survive." Per-node fidelity hints recorded at parse (`sourceFenceChar/Length/Padded`, `sourceRaw` + structural-freshness for JSX components), so `*`/`_`/`**`/`__` emphasis, setext headings, `+` bullets, multi-blank runs, unpadded tables survive **as authored**. But **the edited block's new bytes are the serializer's canonical output**. `packages/core/src/bridge/normalize.ts` enumerates the **16 admitted canonicalization classes**: bom, crlf, commonmark-escape, emphasis-around-code, leading-newline, doc-start-thematic, block-separator-collapse, table-align-row-spacing, row-no-trailing-pipe, list-indent-canonical, ordered-list-marker-number, paragraph-continuation-indent, jsx-container-boundary-blank, trailing-whitespace, blank-line-collapse, trailing-newline. Fallback paths (incremental line diff; three-way merge) run when the splice can't, guarded by loss detectors, duplication gates, split-brain rederive watchdogs, shadow-repo checkpoints, tolerance-fire telemetry.
- **Lane 3 — frontmatter: WHOLE-REGION RE-STRINGIFY, not byte-preserving** [measured live]. `frontmatter-region.ts` → `finalizeFenced`, `yaml-codec.ts STRINGIFY_OPTIONS`: eemeli/yaml `parseDocument` then `doc.toString({defaultKeyType:'PLAIN', defaultStringType:'PLAIN', lineWidth:0})`.

| Input | Output (adding one key) |
|---|---|
| `# comment` line | **preserved** |
| key order | preserved |
| `"…"` / `'…'` quote styles | preserved |
| `&anchor` / `*alias` pairs | **preserved** |
| `tags: [alpha, beta]` | `tags: [ alpha, beta ]` — and deleting the added key **never returns the file to its original hash** |

  Gates: `MAX_FM_REGION_BYTES` 64 KB region cap; zod `FrontmatterMapSchema` (string\|number\|boolean\|array\|record only) — fm that fails it **refuses ALL fm edits** (`parse_failed`).
- Their fidelity test culture [fetched]: `assertByteStable` (round trip == source bytes) AND weaker `assertRoundTripIdempotent`; `test:conversion`; `tier3 = STRESS_FIDELITY=1`; `measure:fuzz/stress/sweep`; `agent-patch-crdt-convergence`; advisory warnings surfaced to agents inline (`content-divergence`, `disk-edit-reconciled`, `mermaid-parse-error`).
- Self-documented cost ceiling [fetched, their docblock]: per-drain full serialize+parse is "~87% of Observer A's per-keystroke drain cost" on a **231 KB** doc, "hundreds of ms per drain" at **675 KB**, "unbounded by doc size," and shrinking it "needs a real incremental parser" they don't have.

### OpenKnowledge — agent, comment, vault, render surfaces

- **OK as MCP server** (`ok mcp` stdio + HTTP `/mcp`) tools: write, edit (body find/replace + fm merge-patch), move, delete, search (Orama + embeddings w/ eval dir), history, checkpoint, restore-version, conflicts, resolve-conflict, links, lint, audit, palette (component schemas), config, import, install, skills, skill-target, share-link, get-preview-url, and **exec — which is NOT a real shell**: `just-bash` JS emulator, command allowlist, virtual fs, pre/post mtime snapshots that **abort on any mutation** (read-only bash for agents). Doc-mutating tools **require the Hocuspocus server running** (`HOCUSPOCUS_NOT_RUNNING_ERROR`). Every write carries agent identity → per-writer attribution in the shadow repo; patch responses return live lint/dead-link/divergence warnings inline [fetched].
- **OK as ACP host**: launches Claude Code (`claude-acp`), Codex, Cursor, Pi *inside* OK threads (`@agentclientprotocol/sdk` in core+server; `server/src/acp/` = launch, terminals, managed-runtime, staged-install, MCP injection, thread persistence machine-local). Hand-maintained **permission-posture table** (asks / self-managed / autonomous / unknown) because "ACP has no handshake field for this," with permissive-mode demotion logic [fetched]. Skills system: SKILL.md bundles, catalog, editor installs, `repair-skills` sweeps writing into user-global editor dirs on `ok start`.
- **Comments** (`packages/server/src/comments/anchor.ts`) [fetched + measured lineage]: the 261-line version IS initial commit `88cab6e6` "Comments feature (#2944)" 2026-07-30 (exactly 261 lines at that SHA); `d82e7ea2` "comment on remaining non text content (#3219)" 2026-08-05 → 238 lines, `CommentTarget` gains **frontmatter property targets "located by key name rather than words"**; `175ed7cc` "comments v2 (#3416)" 2026-08-13 → current **307 lines**. Diff 238→307 added, with unchanged function surface: **context-evidence floor** (a lone quote hit is no longer accepted without context evidence — closes silent wrong re-anchor onto a duplicated phrase), **deletion probe** (stored prefix+suffix found TOUCHING = positive evidence the passage was deleted → orphan, outranking any twin elsewhere), `refindBetweenBrackets` recovery (quote changed but context brackets survive → re-anchor with `rewritten` flag), markdown-syntax-elastic context scoring (fixes a documented bug where rendered-text context scored zero against markdown bodies). Design: content-addressed ("remember the words, not the position"), Hypothesis-style exact quote + widened-to-unique context, position only a hint, ordered refind ladder, "fails SAFE (flags orphaned) rather than ever guessing," **no fuzzy matching**.
- **Comment storage** [fetched — `thread-store.ts`]: `<localDir>/comments/<threadId>.meta.json` — "**machine-local and never committed** (thread text can quote document content; same trust envelope as the ACP thread store)… a thread's identity… exists only here and cannot be reconstructed from anything else." **Comments do not travel with the repo.**
- **Vault model** [measured + fetched]: `ok init` scaffolds `.ok/` (config.yml, .gitignore) and **auto-runs `git init`** (measured `didGitInit: true`) — git is mandatory substrate. Folders + wiki links + backlink index + graph viewer; `content.dir` scoping; single-file open mode; templates; folder frontmatter. **Shadow attribution repo at `.git/ok/`** (measured: created on boot): worktree-aware bare-ish repo holding per-writer WIP refs (human vs agent vs system writer classification) and checkpoint kinds, isolated from user staging/history. **SyncEngine** (`sync-engine.ts`, **5,043 lines**): background GitHub fetch/merge/push state machine, squash-before-push, backoff, conflict store + resolve UI + MCP tools, gh-token integration — **off by default** (measured boot log: "sync not enabled"). Comments + ACP threads deliberately machine-local; server loopback-only, external exposure requires explicit consent flags.
- **Rendering** [fetched]: remark-parse + remark-frontmatter + remark-gfm + remark-math (+ single-`$` promoter) + remark-github-alerts + custom **micromark wiki-link extension** + "MDX-agnostic" layer + ~20 promoter/guard plugins (mermaid, `==` highlight, underline, callouts, details accordions, div-align, comments, images, indented-code, empty-task-items, tags, void-br, backslash-escape/entity-ref/autolink-void-HTML guards) → `@handlewithcare/remark-prosemirror` → TipTap. HTML preview via mdast→hast handlers + rehype plugins; mermaid bundled server-side; Excalidraw in-app. `parseWithFallback` recursively block-splits a failing doc (fence-aware, ref-def hoisting, **500 ms wall-clock + 1000-call budget**, per-block isolation, metrics for block vs whole-doc fallbacks); broken MDX renders as a `rawMdxFallback` block that clicks through to source mode (`packages/app/src/components/EditorPane.tsx`); markdownlint-based lint engine with custom `okf-*` rule packs runs server-side and streams violations to agents.

### Recorded contradiction between the two source documents

- **h3 joint verdict** [measured+inference]: "every structured-editing surface in this space **regenerates rather than preserves** — the failure is not 'they use a bad YAML lib' but that their write path serializes a lossy in-memory model," and it explicitly folds in "the OpenKnowledge card from the parallel teardown (per the orchestrator; **not re-verified here [SS]**)" as completing the set.
- **h4 disagrees on OpenKnowledge Lane 1** [measured live]: OK's agent body write path is a byte splice against user source bytes, sha256-identical on edit→revert, including CRLF and missing-final-newline files. h4 §10 states plainly: "Body-path agent fidelity is **genuinely byte-perfect today** (measured) — do not claim otherwise."
- Resolution for the PRD: the "everyone regenerates" generalization is **true for hubble.md (body), Front Matter CMS (frontmatter), and OpenKnowledge (frontmatter + edited WYSIWYG block)** and **false for OpenKnowledge's agent body lane**. Both readings are preserved; h3's [SS] on OK is superseded by h4's [measured].
- Secondary disagreement on key policing: hubble.md **deletes** keys failing `/^[a-zA-Z0-9_-]+$/` [measured]; Front Matter CMS **keeps** `og:image` and `"quoted key"` [measured]. Same defect family, opposite behavior.

### Cross-product damage matrix (all [measured] unless noted)

| Construct | hubble.md body | hubble.md fm panel | FM CMS fm | OK fm | OK WYSIWYG edited block [fetched] |
|---|---|---|---|---|---|
| YAML comment | n/a (raw-preserved on body edit) | deleted | deleted | **preserved** | n/a |
| Quote style | n/a | forced `"…"` | forced PLAIN | **preserved** | n/a |
| Anchors/aliases | n/a | lost at parse | resolved+duplicated (warm) / re-anchored `&a1` (cold) | **preserved** | n/a |
| Leading zeros `007` | n/a | `7` | `7` | not reported | n/a |
| Flow seq `[a, b]` | n/a | not reported | exploded to block seq | `[ alpha, beta ]`, irreversible | n/a |
| Folded scalar `>-` | n/a | not reported | collapsed to one line | not reported | n/a |
| Non-simple keys | n/a | **deleted** | kept | kept (subject to zod gate) | n/a |
| Reference links | **deleted with text** | n/a | body untouched | n/a | canonicalized |
| Table alignment | stripped | n/a | body untouched | n/a | `table-align-row-spacing` tolerance |
| List numbering | renumbered; lists merge on pass 2 | n/a | body untouched | n/a | `ordered-list-marker-number` tolerance |
| Body bytes overall | regenerated | untouched | **byte-identical** | untouched | untouched outside the block |

### Durable vs erodible advantage

**Durable (architectural; requires a rewrite on their side)**
- Byte-exact frontmatter editing. All three re-stringify some or all of the YAML region. OK's `yaml@2` `Document.toString()` is the codec at *every* fm surface (region patcher, form binding, config patches) — replacing it means replacing the codec with a splice engine [fetched].
- **Fidelity without a daemon.** OK's byte-fidelity contract exists only inside a running CRDT server — agent doc-mutating tools literally error (`HOCUSPOCUS_NOT_RUNNING_ERROR`) — held together by observers/sync/watchdog/loss-detector machinery, shadow-repo checkpoints, and telemetry for when it slips. A stateless splice engine gives the same-or-better guarantee on plain files, in CI, in a git hook, offline, with nothing running — the story their `content-divergence` / `disk-edit-reconciled` warning taxonomy concedes needs guarding in theirs [fetched+inference].
- **O(edit), not O(document).** Their own in-source measured numbers: 231 KB → ~87% of drain cost; 675 KB → hundreds of ms; "unbounded by doc size"; fix requires an incremental parser they don't have [fetched].
- Byte preservation *inside* an edited WYSIWYG block — new bytes for a changed region can only come from their serializer; the 16 tolerance classes are the admitted, telemetered canonicalization set [fetched].
- **Comments that commit.** OK threads are machine-local sidecars, never committed, identity unreconstructable — anchored quotes survive edits, the conversation does not survive a clone [fetched].
- FM CMS is structurally locked to VS Code and to humans: no CLI, no standalone runtime, no web, no headless drive, no agent surface [fetched].
- A **verifiable round-trip / degradation certificate** — none of the three even attempts one [inference].

**Erodible (discipline + machinery, not insight)**
- hubble.md **already** raw-preserves untouched frontmatter and ships a source-mode escape hatch; the missing piece there is discipline plus machinery, not insight — h3 calls the moat "real but narrow and **time-boxed**" [inference].
- OK's release velocity is real: 100 versions in 7 days [measured]; 3.7k stars in <3 months; they already ship WYSIWYG+source dual mode, real-time collab, agent-thread hosting (ACP), skills, GitHub team sync, comments v2 with content-addressed anchoring, and a desktop app [fetched]. The codebase shows fidelity fuzzers, tolerance telemetry, invariant watchdogs, an internal numbered "precedent" system, eval'd embeddings.
- FM CMS's preservation *intent* is already in the code and the capable dep (`yawn-yaml`) is already installed — a competent maintainer could wire it [measured].

### Explicit anti-recommendations (do NOT build / do NOT claim)

- Do **not** claim OpenKnowledge "corrupts files." Body-path agent fidelity is byte-perfect today [measured]. Differentiation is fm bytes, statelessness, scaling, edited-block canonicalization — nothing else.
- Do **not** claim Front Matter CMS "destroys your content." It never touches the body and never polices keys. Scope claims to comments/styles/anchors/leading-zeros + output statefulness + missing agent surface [measured].
- Do **not** build the pitch on the *observation* that today's writers are lossy — build it on the machinery (span-preserving writer + verifiable round-trip/degradation certificate) [inference].
- Do **not** bolt preservation onto a stringify pipeline. FM CMS's broken "keep the comments" branch and dead `yawn-yaml` dependency are direct evidence this fails in practice [measured].
- Do **not** copy OpenKnowledge code, comments, identifiers, or file structure; do **not** link or bundle any of their packages into proprietary code — GPL-3.0-or-later would reach it, and their CLA lets *Inkeep* dual-license but not us [fetched]. Safe: ideas, architecture, algorithms, protocols, test *strategies* via clean-room reimplementation (tolerance-class taxonomy concept, content-addressed anchor ladder concept, ytext-truth contract idea); interop over MCP/HTTP to a user's running OK server, and vault migration, are arms-length process-boundary use, not derivation. Practical hygiene: never paste their source into our repo; describe patterns in our own words; keep the teardown as the reference instead of their files.
- Do **not** rely on a doc→md→doc property test as a fidelity gate — hubble's `MarkdownRoundtrip.test.ts` passes while source bytes are destroyed [fetched].

### Demo ammunition (each reproducible in <1s or ~10s)

- hubble.md: reference link deleted with its text; `3.`-start list absorbed and renumbered on round-trip pass 2; `og:image` deleted by the properties panel; table alignment stripped — `probe/roundtrip.ts`, `probe/fixedpoint.ts` [measured].
- Front Matter CMS: a **30-line reproduction** in which one `title` edit deletes the YAML comment, collapses `>-`, explodes `[a, b]`, and duplicates `&al`/`*al` — `probe/fmcms.mjs` [measured].
- OpenKnowledge: **10-second demo diff against their live product** — `tags: [alpha, beta]` → `tags: [ alpha, beta ]`, permanently (revert never restores the hash), plus the 64 KB cap and the zod gate refusing all fm edits on non-conforming frontmatter [measured].

### Read-only compliance and one flag for the orchestrator

- The LR#48 reconcile check was run once, read-only, and is reported below; it is not re-run on each hook fire. This agent made three tool calls total: two `Read` calls and one read-only `git status` / `git rev-parse`. No file was edited, written, or created; no `git commit`, `git push`, or other mutating command was run. No destructive operation is needed for this task.
- **Flag, not a claim of wrongdoing** [measured]: `frontmatter` HEAD is `57d0cfad30d26483edbead94707dc3bbb53ad124`, whereas this session's start snapshot recorded `9e84628`; `docs/FRONTMATTER-MASTER-PLAN-2026-08-28.md` and `docs/research/agent-reports-2026-08-28/` no longer appear as untracked. That commit was not made by this agent. Per LR#48 the parent should reconcile the HEAD delta before trusting the fan-out.
- Also [measured], dirty but untouched by this agent: `~/.claude` shows 10 modified + 8 untracked paths under `skills-src` / `settings.json`; `~/.sgnk` shows 15 modified plus untracked `baselines/` files. `frontmatter` `.env.example` returned "Operation not permitted" to `git status` — a sandbox read-deny, not repo state.