Verified read-only: I mutated nothing — `~/.claude` HEAD is unmoved at `6e390828` (2026-08-27 23:38 IST, authored by Sagnik) and every dirty path is pre-existing (`.bak-20260810`, sgnk-pwa/sgnk-yt/sgnk-framer-clone work), with no commit from this session.

### Sources opened (all via `curl`, read 2026-08-28/29; WebFetch was refused, curl was not — LR#70)

| Source | What it is | Tag |
|---|---|---|
| postgresql.org/docs/current/error-style-guide.html (PG 18) | Primary/Detail/Hint split, tense rules, no-function-names rule | [fetched] |
| rustc-dev-guide.rust-lang.org/diagnostics.html | Diagnostic structure, output style guide, lint-vs-fixed | [fetched] |
| blog.rust-lang.org/2016/08/10/Shape-of-errors-to-come (Turner, 2016-08-10) | Primary/secondary labels, `--explain` two-tier | [fetched] |
| raw.githubusercontent.com/git/git/master/{advice.adoc, advice.c, unpack-trees.c, builtin/merge.c} | 43 `advice.*` toggles; real refusal strings | [fetched][measured] |
| api.github.com search, microsoft/TypeScript | 146 issues under `Domain: Error Messages`; #29759 (open, 2019-02-05, 29 👍) | [fetched] |
| eslint.org/docs/latest/{extend/custom-rules, use/core-concepts} | `messageId`, fixes vs suggestions | [fetched] |
| nngroup.com/articles/error-message-guidelines (2023-05-14) + /progressive-disclosure (2006-12-03) | Visibility/Communication/Efficiency guidelines | [fetched] |
| rfc-editor.org/rfc/rfc9457.txt, rfc9110.txt §15.5.1/4/21 | `type/title/detail/instance`; 400 vs 403 vs 422 | [fetched] |
| model-spec.openai.com/2025-04-11 | "Refuse neutrally and succinctly" | [fetched] |
| arXiv 2409.18661 (2024-09-27), arXiv 1509.07238 (2015-09-24) | n=106 LLM-message study; Zipf–Mandelbrot error frequency | [fetched] |
| This repo: `src/modules/share/domain/splice-frontmatter.ts`, `src/modules/preview/presentation/PropertiesPanel.tsx`, `src/modules/mdmax/domain/*` | Live refusal surface | [measured] |

### Live baseline in this repo (measure before designing)

- `spliceFrontmatterValue(src, key, value): string` and `spliceFrontmatterKey(src, oldKey, newKey): string` return a **bare string**. There are **20 `return src` sites** across the two functions. [measured]
- Consequence: a refusal is byte-identical to a successful no-op. There is no reason code, no discriminated union, nothing for a UI to read. [derived from the signatures above]
- `PropertiesPanel.tsx` `emit()` is literally `if (!onEdit || next === content) return;` — refusals are dropped. The file's own comment already names the gap: a refusal "is dropped silently, which is right for the writer and wrong for a person who just typed a name." [measured]
- Current mitigation is a **duplicated `SAFE_KEY` pre-check in the UI** so the field stays open. Two definitions of one rule, exactly the producer/consumer divergence class of LR#59. [measured]
- By contrast `mdmax` already emits **32 distinct uppercase symbols**; 13 are verdict classes (`PASS LEAK VOID DESTROY MUTATE STRIP CORRUPT COLLAPSED UNCLASSED SKELETON_CHANGED CLEAN REPAIRED CANONICAL`), leaving **32 − 13 = 19 typed failure codes** (`BUDGET_BYTES/LINES/BLOCKS/TIME, INVALID_UTF8, PARSER_THREW, WORKER_DIED, ENGINE_MISSING, ENGINE_THREW, SHAPE_REFUSED, NO_TARGETS, NOT_AN_INTEGER, NEGATIVE, PAST_END, INSIDE_SURROGATE_PAIR, REFUSED_AMBIGUOUS, ADJACENT_TO_SETEXT_UNDERLINE, OFFSET_OUT_OF_RANGE, UNRESOLVED`). [measured][derived: 32−13=19]
- **The founding principle is implemented in one half of the product and not the other.** The work is not "write nicer copy"; it is to give splice the return shape mdmax already has. [inference]

### 1. What separates a tolerated refusal from an infuriating one

| Property | Tolerated | Infuriating | Evidence |
|---|---|---|---|
| **Names the exact object** | git: `Your local changes to the following files would be overwritten by checkout:` + the file list | TS 2322 prints a 178-char reconstructed type before the one useful clause | [fetched] git `unpack-trees.c`; [fetched] TS #29759; [measured] 178 chars |
| **States what was NOT done** | git prints `Aborting` and leaves the worktree untouched | Silent no-op — our splice today | [fetched]; [measured] |
| **Carries its own escape hatch** | git `checkout` refusal ends "Please commit your changes or stash them before you switch branches." | `fatal: refusing to merge unrelated histories` — 44 chars, and **does not name `--allow-unrelated-histories`** | [fetched] `builtin/merge.c:1644`; [measured] 44 chars |
| **Most-relevant-first** | rustc primary label at the caret, 74-char headline | TS puts the actionable "Did you mean to write 'environment'?" **last**, after five nesting levels | [measured]; [fetched] TS #29759 |
| **Two tiers, not one wall** | Postgres Primary / Detail / Hint; rustc `--explain E0499` | One undifferentiated blob | [fetched] both |
| **Silenceable once understood** | git's 43 `advice.*` toggles + `GIT_ADVICE=0`; ESLint `messageId` + suppressions | Unsilenceable repeat nagging | [fetched]; [measured] 43 |
| **Refuses at the door, not mid-write** | ESLint *suggestions* "may change application logic and so cannot be automatically applied" and are not exposed via CLI | Auto-fix that guesses | [fetched] |
| **Blame-free** | NN/g: avoid `invalid`, `illegal`, `incorrect`; rustc: "The word 'illegal' is illegal" | "Invalid key" | [fetched] both |

- The single strongest predictor across all seven tools: **the refusal names a next action in the same breath as the refusal.** git's two refusals differ on nothing else and are respectively cited as helpful and as the canonical git complaint. [inference from the two fetched strings]
- Prioritise by frequency, not by taxonomy completeness: programming-error-message frequencies "empirically resemble Zipf–Mandelbrot distributions" — a handful of messages absorb most encounters. Hand-write the top 3–5; template the tail. [fetched arXiv 1509.07238]
  - **Anti-recommendation:** frequency ranking is measured on *novice* Python/Java corpora, not on markdown editors. Do not assume our head is our head until telemetry says so; ship all 7 at template quality, then promote by observed counts. [inference]

### 2. The refusal message template

**Four obligatory slots, fixed order.** Adapted from Postgres Primary/Detail/Hint [fetched] and RFC 9457 `title`/`detail`/`instance` [fetched], with an extra slot no external source has because no external source has our guarantee.

| Slot | Content | Budget | Rationale |
|---|---|---|---|
| **1. OUTCOME** | "Nothing changed." — the guarantee, stated first | ≤ 20 chars | Postgres: keep the primary short enough to "fit on one line" [fetched]. This is our differentiator; it leads |
| **2. OBJECT + CAUSE** | the exact key/line/byte range, and why it was unaddressable | ≤ 120 chars | Postgres "state the reason why"; rustc "name the kind of object" [fetched] |
| **3. AFFORDANCE** | one imperative the user can perform now | ≤ 90 chars | NN/g "offer constructive advice" [fetched]; git checkout hint [fetched] |
| **4. DISCLOSURE** | `Why?` → code + byte offsets + the exact bytes untouched | unbounded, collapsed | Nielsen progressive disclosure [fetched]; rustc `--explain` [fetched] |

- **Visible budget: 280 characters, headline ≤ 80.** Derived: git's full checkout refusal = 175 chars / 4 lines; the Postgres primary+detail+hint exemplar = 256 chars / 3 lines; mean = (175+256)/2 = 215.5; ceiling set above both. rustc's primary line = 74 chars, so 80 holds a real headline. [measured][derived]
- **Machine shape:** `{ ok: false, reason: 'UNSAFE_KEY', at: {line, col, byteStart, byteEnd}, detail, hint }` — mirrors mdmax's existing discriminated union and RFC 9457's `type`/`detail`/`instance` triple. The `reason` is the stable identity; the prose is localisable and may change. RFC 9457: consumers "SHOULD NOT parse the `detail` member". [fetched][measured]
- **Anti-recommendation:** do **not** put the reason code in the visible headline. NN/g: "Hide or minimize the use of obscure error codes… show them for technical diagnostic purposes only." Code lives in the disclosure and the clipboard, not the sentence. [fetched]
- **Anti-recommendation:** do not exceed 280 by adding a second hint. Postgres hints exist precisely because the suggestion "might not always be applicable"; a stacked hint is a guess, and guessing is the thing the engine refuses to do. [fetched]
- **Tone divergence, recorded:** Postgres mandates lowercase primaries with no terminal period [fetched]; rustc the same [fetched]. frontmatter is a consumer editor, not a CLI, so use sentence case with periods. This is a deliberate departure and should be written down as one, not drifted into. [inference]

### 3. Taxonomy — every refusal the product can emit

Codes marked ✅ exist in source today [measured]; ⭕ must be added.

| # | Refusal | Code | Exact wording (visible) | Chars | Affordance | HTTP analogue |
|---|---|---|---|---|---|---|
| 1 | Splice cannot locate the byte range | ⭕`UNLOCATABLE` | "Nothing changed. The engine could not find a single unambiguous place for `public_slug` in this file's front matter, so it left every byte where it was." | 152 | `Show me` scrolls to and selects the front-matter block | 403 — "understood the request but refuses to fulfill it" [fetched] |
| 2 | Ambiguous / duplicate target | ✅`REFUSED_AMBIGUOUS` | "Nothing changed. `author` appears twice here, so this edit had two possible targets. Delete one, then try again." | 111 | `Show both` → two carets in the editor | 409 [inference] |
| 3 | YAML will not parse | ⭕`FRONTMATTER_UNPARSEABLE` | "Nothing changed. The front matter stops being readable at line 7, so properties are read-only until that line is fixed. Your text is untouched." | 143 | `Jump to line 7`; panel goes read-only, never blank | 422 — "syntax… correct, but unable to process" ≈ well-formed file, unprocessable block [fetched] |
| 4 | Unsupported key shape | ⭕`UNSAFE_KEY` | "Not added. `título` uses characters this editor cannot address safely. Names can use letters A–Z, digits, and `. _ $ -`." | 121 | Field **stays open with the typed text intact** (NN/g "preserve the user's input" [fetched]) | 400 [fetched] |
| 5 | Corpus drift (targets stale) | ✅`stale` → ⭕`CORPUS_DRIFT` | "This certificate was measured against an older version of this note. It is shown greyed out until you re-run it." | 112 | `Re-certify` (one click) | 409/428 [inference] |
| 6 | Certificate BROKEN | ✅`BROKEN` | "Certified BROKEN: 3 of 24 engines lose content from this note. The note itself is unchanged and safe." | 101 | `See the 3` → per-engine verdict rows | 200 + body [inference] |
| 7 | Shape gate / budget | ✅`BUDGET_BYTES` etc. | "Not certified. This note is 4.2 MB, past the 2 MB limit for a run that must finish. Nothing was written." | 104 | `Certify the first section instead` | 413 [inference] |
| 8 | Engine missing / threw | ✅`ENGINE_MISSING`/`ENGINE_THREW` | "marked 16.4.2 could not be loaded, so it is reported as unmeasured rather than as passing." | 90 | `Retry` + `Exclude this engine` | 502/504 [inference] |
| 9 | Publish revoked | ⭕`SHARE_REVOKED` | "This link no longer works. The note was unpublished on 12 Aug, and the copy on the server was deleted." | 102 | Owner: `Publish again`. Visitor: **nothing** — no owner, no title, no path | 404, deliberately over 403 — RFC 9110 allows hiding existence via 404 [fetched] |
| 10 | AI declined | ⭕`AI_DECLINED` | "The assistant didn't produce an edit here. Your document is unchanged." | 70 | `Try a different instruction`; the diff pane stays empty rather than showing a partial | — |
| 11 | Offset invalid (internal) | ✅`PAST_END`/`INSIDE_SURROGATE_PAIR`/`NOT_AN_INTEGER`/`NEGATIVE` | never user-visible | — | logged with byte offset; surfaces as #1 | 500 [inference] |

- **#10 follows the Model Spec deliberately: brief, no meta-commentary, no "unfortunately", no preachiness.** [fetched] **Anti-recommendation:** copy the Model Spec's *brevity* but **not** its *opacity*. Safety refusals withhold the reason on purpose; an engine refusal that withholds the reason is just a bug with better manners. This is a direct conflict between the Model Spec and NN/g's "offer constructive advice" — record it, and resolve it per-category rather than globally. [fetched both]
- **Anti-recommendation on #9:** do not give visitors the affordance. Naming the owner or the former title of a revoked note leaks exactly what unpublishing was for.

### 4. How a refusal appears without breaking the simple surface

- **Anchor at the source.** NN/g: "Display the error message close to the error's source… proximity helps users associate the error message content with the interface elements needing attention." A refused property edit belongs on that property row; a refused certification belongs on the cert chip. [fetched]
- **Severity ladder, three rungs only** (NN/g "design errors based on their impact" [fetched]):
  1. **Inline, non-modal** — refusals the user caused and can undo by retyping (#2, #4). The row stays in edit state.
  2. **Persistent strip on the affected panel** — refusals that change what the surface can do (#3 read-only properties; #5 greyed cert).
  3. **Nothing at all** — internal codes (#11), and any refusal already visible as "the thing you asked for did not happen."
  - **Modal: never.** A modal is for irreversible loss; a refusal is the proof that nothing was lost. **Anti-recommendation:** the one exception is a refusal during an operation the user believes completed and has left the app (background publish); that needs a durable, not transient, surface.
- **Progressive disclosure, two tiers, exactly as Nielsen frames it:** show the few important things first, "offer a larger set of specialized options upon request." Tier 1 = the 280-char sentence. Tier 2 = a `Why?` inline expander carrying `reason`, byte range, and `Copy diagnostic`. Nielsen's stated benefit — improving learnability, efficiency *and error rate* — is the argument that this does not violate the simple-surface rule; the surface is unchanged until asked. [fetched]
  - **Anti-recommendation:** never stage-gate the disclosure across a navigation. Nielsen distinguishes progressive from *staged* disclosure; a refusal must be fully explainable without leaving the document.
- **The refusal indicator is the guarantee, not the failure.** Show the diff-count "0 bytes changed" as the visible artifact. **Anti-recommendation:** don't over-celebrate it — a badge on every refusal becomes chrome, and NN/g reserves novelty for rare total failure. [fetched]
- **Icons:** Google Material Symbols as inline SVG only (`block`, `warning`, `help`) — never emoji, never the Google-Fonts ligature span.

### 5. Anti-patterns — what makes a refusal read as a bug rather than a guarantee

| Anti-pattern | Why it reads as a bug | Evidence |
|---|---|---|
| **Silent no-op** — return the input, say nothing | The user's model is "I typed, it did nothing, it's broken." NN/g: "The very worst error messages are those that don't exist… no feedback… creates a cascade of misunderstanding." **This is our current splice behaviour at 20 sites.** | [fetched][measured] |
| **Refusal with no named escape** | `fatal: refusing to merge unrelated histories`, 44 chars, flag unnamed — the archetype of the git complaint | [fetched][measured] |
| **Most-relevant-last** | TS #29759: the useful "Did you mean 'environment'?" arrives after five nesting levels; open since 2019-02-05, 29 👍, in a label with 146 issues | [fetched] |
| **Implementation nouns in the headline** | Postgres: don't name the reporting routine or syscall — `pg_strtoint32: error in "z"` → `invalid input syntax for type integer: "z"`. Ours: never surface `spliceFrontmatterValue` or `SAFE_KEY` in tier 1 | [fetched] |
| **Blame vocabulary** | NN/g bans `invalid`/`illegal`/`incorrect`; rustc: "The word 'illegal' is illegal. Prefer 'invalid'." The two sources **disagree on `invalid` itself** — record it; take NN/g's stricter line for user-facing copy, rustc's for internal codes | [fetched] both |
| **Duplicated rule in UI and engine** | Two `SAFE_KEY` checks means two places to drift; the producer/consumer field-mismatch class already cost this workspace three wrong published numbers (LR#59). Engine returns the reason; UI renders it | [measured] |
| **Auto-repair on refusal** | ESLint separates *fixes* (safe, auto-applied) from *suggestions* ("may change application logic and so cannot be automatically applied", CLI-inaccessible). A byte-preserving engine may only ever offer the suggestion tier | [fetched] |
| **LLM-generated explanation as the default** | n=106 within-subjects, six buggy C programs: GPT-4 explanations beat stock compiler messages in **only 1 of 6 tasks** by time-to-fix; **handwritten explanations still won** on objective *and* subjective measures | [fetched arXiv 2409.18661] |
| **Humour / novelty on a refusal** | NN/g reserves novelty for total, no-recourse failure and warns humour goes stale on repeat; a refusal is repeatable by construction | [fetched] |
| **Unsilenceable repetition** | git ships 43 `advice.*` toggles plus `GIT_ADVICE=0` for tooling; the toggle *is* part of the design | [fetched][measured] |
| **A refusal that cannot be reproduced from its text** | Without `reason` + byte range, a support report is unactionable. RFC 9457's `instance` exists for exactly this ("The time Joe didn't have enough credit last Thursday") | [fetched] |

### Recorded source disagreements (unresolved on purpose)

- **Brevity vs. advice:** OpenAI Model Spec — refusals "typically kept to a sentence… brief apology and a brief statement of inability", never explanatory [fetched]. NN/g — "Merely stating the problem is also not enough; offer some potential remedies" [fetched]. Both correct for their domain; frontmatter emits both kinds (#10 vs #1–#9) and must not unify them.
- **`invalid`:** rustc explicitly *prefers* it [fetched]; NN/g explicitly *bans* it [fetched].
- **Succinct vs. contextual:** rustc dev guide — "Error messages should be succinct… more verbose descriptions can be viewed with `--explain`" [fetched]; the 2016 Rust blog argues the opposite emphasis, "putting your source code front and center" with multi-line labelled spans [fetched]. Rust resolved it with the two-tier split; that is the resolution we copy.
- **Novelty:** NN/g endorses whimsy in dire failure [fetched]; every compiler-side source forbids tonal flourish [fetched ×2].

### Unverified / not established here

- No telemetry exists for which of the 11 refusals users actually hit, so frequency-first prioritisation is [inference], not [measured]; the Zipf result is from novice CS corpora, not markdown editors.
- Becker et al. (ITiCSE-WGR 2019) and Denny et al. (CHI 2021), the two most-cited works on whether enhanced error messages help, were **not opened** — `dl.acm.org/doi/10.1145/3344429.3372508` returned **HTTP 403** [measured]. Their findings are deliberately excluded rather than paraphrased from memory.
- Character budgets derive from four exemplar messages, not from reading tests on frontmatter's own users.
- Codes marked ⭕ are proposals; only the ✅ codes exist in the tree at commit `9e84628`.