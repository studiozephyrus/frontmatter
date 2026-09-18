---
id: 19-ACCEPTANCE-CRITERIA
title: Acceptance criteria
mode: reference
tier: canonical
status: living
updated: 2026-09-18
owner: sagnik
verified_against: f237ece
covers: [acceptance-criteria, testable-assertions]
---

# 19. Acceptance criteria

One testable criterion per feature, in one form.

## 0. Read this before using any id below

**`10-FEATURE-REGISTER.md` is authoritative for feature ids.** Where a feature id here disagrees with
the register, **the register wins and this file is wrong**.

**It landed while this file was being written, and the two agree.** The register's section 0 reaches
the same finding as section 0.1 below, independently: `F001` to `F077` are the audit findings, and
**product features start at `F101`**, so no feature can ever be mistaken for a finding. Its section 7
is the crosswalk from this file's slugs to those numbers, and **it keeps the slug as the key rather
than rewriting this file**. Section 11 below is the other half of that join.

### 0.1 What the grep actually returned, and why this file could not use it

The instruction was to take feature ids from the plan. The command, run on 18 September 2026 at
commit `f237ece`:

```bash
grep -o 'F0[0-9][0-9]' docs/mvp0/PRODUCT-PLAN.md | sort -u | wc -l     # 70
grep -o 'F0[0-9][0-9]' docs/mvp0/PRODUCT-PLAN.md | sort -u | head -1   # F001
```

**Seventy unique tokens, `F001` to `F077` with gaps. Not one of them is a feature.** They are the
audit findings of 17 September. The first, at `docs/mvp0/PRODUCT-PLAN.md` section 0, reads:

> Pro's model cost was wrong by a factor of three (F001).

A finding is a correction to the plan. A feature is a thing the product does. **Using `F001` as a
feature id would collide with a live identifier**, and `65-CONVENTIONS.md` section 3 says an id is
never reused.

### 0.2 So this file uses a provisional namespace, and says so

- **Feature ids here are `F-` plus a slug**: `F-signin`, `F-splice`, `F-docmode`.
- **A slug is the join key, and it stays.** Section 11 gives one row per slug, and
  `10-FEATURE-REGISTER.md` section 7 gives the numeric features each slug reaches. **Neither file
  rewrites the other**, which is what lets both be edited without a merge.
- **A slug never collides with `F001`**, which is exactly why the shape was chosen.
- **Where a plan finding is the evidence behind a criterion, it is cited as `finding F0NN`**, in
  words, so nobody mistakes it for a feature.

## 0.3 The form

`id | feature | given | when | then | test | spec`

- **`id`** is `A` plus three digits, per `65-CONVENTIONS.md` section 3.
- **`feature`** is the provisional slug of section 0.2.
- **`given`** is the starting state, stated precisely enough to build.
- **`when`** is one action.
- **`then`** is **one assertion a machine can make**. Section 0.4 is the test of that.
- **`test`** is a real test path, or `T` plus three digits where it is proposed. **`T001` to `T082`
  mean the same tests as in `17-ERROR-AND-REFUSAL-CATALOGUE.md`**, and neither file may renumber
  one. Acceptance-only tests start at `T100`.
- **`spec`** is `specs/<path>` where one exists, or a pack file and section, or `none yet`.

## 0.4 What mechanically checkable means here

**If you cannot write the check, the criterion is wrong, not the check.**

A `then` may assert exactly these things.

Kind | Example
A byte comparison | The file's bytes before and after compare equal
A count | The document contains exactly one front matter block
An exit code | `npm run corpus` exits 0
An HTTP status | The route answers 401
A stored value | The ledger balance is unchanged
A DOM query | Exactly one element carries the primary style in that region
A timing, at a stated percentile | Keystroke echo under 100 ms at p95 over 100 samples
A string match | The rendered text equals the string at `K.s22.refuse.gdoc.sub`

**A `then` may never assert:** that something feels fast, is clear, is intuitive, is simple, looks
good, or that a person understands it. Section 10 lists the criteria that were written and thrown out
for exactly this.

---

## 1. The front door

id | feature | given | when | then | test | spec
`A001` | `F-signin` | A signed-out browser | The sign-in page loads | The page contains zero elements of type `password` and zero iframes from a captcha vendor | `T100` | `18` §2.
`A002` | `F-signin` | A signed-out browser | The sign-in page loads | `grep -ri "captcha\|recaptcha\|hcaptcha\|turnstile" src/ package.json` returns zero matches | `T101` | `18` §10.
`A003` | `F-signin` | A signed-out browser | The sign-in page loads | Exactly two sign-in controls are present, labelled `K.s01.google` and `K.s01.github` | `T102` | `16` §3.
`A004` | `F-signin` | A signed-out browser | `/privacy` is requested with `curl -sI` | The status is 200 and not a 307 to `/login` | `T103` | `18` §2.
`A005` | `F-signin` | A signed-out browser | `/terms`, `/pricing` and `/refunds` are each requested with `curl -sI` | All three answer 200, none redirects | `T104` | `18` §2.
`A006` | `F-signin` | Any commit | `grep -ri "shepherd\|driver.js\|intro.js\|joyride" package.json` | Zero matches | `T105` | `18` §10.
`A007` | `F-signin` | A first-time signed-in account | Home loads | No modal, overlay or coach mark is in the DOM | `T106` | `18` §2.
`A008` | `F-firstrun` | A new account on a mid-range Android over 4G | The stopwatch runs from first paint of sign-in to the first save | The median of three runs is under 60 s | `T107` | `18` §1.

---

## 2. The engine

**This is the half of the file where the checks already exist.** Every `then` below is a number a
command prints.

id | feature | given | when | then | test | spec
`A010` | `F-splice` | The pinned corpus of 8,513 files | `npm run corpus` runs | The command exits 0, and exits 1 on a single changed byte | `scripts/corpus-foreign.mjs` | `specs/engine/splice-writer`.
`A011` | `F-splice` | The 7,969 front-matter-bearing corpus files | The writer runs a `set` over each | `changed = 0` | `scripts/corpus-foreign.mjs` | `specs/engine/splice-writer`.
`A012` | `F-splice` | The same run | The same | `threw = 0`. **The writer never throws; it returns the input or a spliced result** | `scripts/corpus-foreign.mjs` | `specs/engine/splice-writer`.
`A013` | `F-splice` | The same run, after the R0 fixes | The same | `refused` is 2 or fewer | `scripts/corpus-foreign.mjs` | `specs/engine/splice-writer`.
`A014` | `F-splice` | A file whose target key cannot be addressed | A `set` is attempted | The returned bytes compare equal to the input bytes | `test/share/frontmatter-splice.test.ts` | `17` `E001`.
`A015` | `F-splice` | A file with a duplicate top-level key | A `set` on that key | The returned bytes compare equal to the input, and no key was appended | `T003` | `17` `E003`.
`A016` | `F-splice` | A file with a zero-indent block sequence | A `set` on the key above it | After the fix: the key's value changes and every other byte is identical. **Before the fix this test must fail** | `test/corpus/foreign/nf-001-red-proof.test.ts` | `specs/engine/nf-001-zero-indent-sequence`.
`A017` | `F-splice` | A synthetic fixture whose fence ends in a bare carriage return | A `set` alone, with no delete after it | The document contains exactly two `^---` lines, being one open and one close | `test/corpus/foreign/nf-003-red-proof.test.ts` | `specs/engine/nf-003-bare-cr-fence`.
`A018` | `F-splice` | A carriage-return-only file, and a carriage-return-and-line-feed file | Any write | The line-ending style of every untouched line is byte-identical | `T007` | `specs/engine/nf-003-bare-cr-fence`.
`A019` | `F-splice` | A file with a byte-order mark before the fence | Any write | The mark is preserved and the fence is still recognised | `T008` | `specs/engine/splice-writer`.
`A020` | `F-splice` | The repository at any commit | A search for a second key scanner | There is one splice implementation. **This is a proxy check and must be labelled one** | `T109` | `specs/engine/splice-writer`.
`A021` | `F-shapegate` | A document over the byte budget | The shape gate runs | It returns `ok: false` with `reason: 'BUDGET_BYTES'` and the limit | `test/mdmax/shape-gate.test.ts` | `17` `E016`.
`A022` | `F-shapegate` | A file that is not valid UTF-8 | The shape gate runs | It returns `reason: 'INVALID_UTF8'` with a line and column, and **repairs nothing** | `test/mdmax/shape-gate.test.ts` | `17` `E019`.
`A023` | `F-vaultwrite` | A write path containing `..` | A commit is attempted | The call throws before any write, and the repository is unchanged | `test/repository/commit-changes.test.ts` | `17` `E024`.
`A024` | `F-splice` | Any operation | An oracle is written for it | The oracle asserts on that operation alone, never on set-then-delete | `T110` | `specs/engine/nf-003-bare-cr-fence`.

---

## 3. The editor and its modes

id | feature | given | when | then | test | spec
`A030` | `F-editor` | An open document | A character is typed | The buffer updates, and the echo is under 100 ms at p95 over 100 samples | `T111` | `docs/mvp0/PRODUCT-PLAN.md` section 21.
`A031` | `F-editor` | A 10 MB document | It is opened | It paints in under 3 s, and the keystroke echo target of `A030` still holds | `T112` | `docs/mvp0/PRODUCT-PLAN.md` section 21.
`A032` | `F-editor` | An open document with unsaved keystrokes | 500 ms passes on a 4G connection | The server holds the new version, and the pill reads `K.common.saved` | `T113` | `docs/mvp0/PRODUCT-PLAN.md` section 21.
`A033` | `F-editor` | An open document | The mode segment is set to each of Edit, Live, Reading and Split | The bytes on disk are identical in all four | `T114` | `15` §3.
`A034` | `F-editor` | Ghost text is showing | `Tab` is pressed | The suggestion is inserted, and `indentWithTab` did not run | `T115` | `15` §4 C3.
`A035` | `F-editor` | Ghost text is not showing | `Tab` is pressed | The line indents | `T115` | `15` §4 C3.
`A036` | `F-editor` | The editor has focus and the find panel is open | The find-next chord is pressed | The match advances and the graph view does not open | `T116` | `15` §4 C1.
`A037` | `F-editor` | Two tabs are open | Undo is pressed in one | Only that document's buffer changes | `T117` | `15` §8.
`A038` | `F-editor` | A panel edit lands while the editor has focus | Undo is pressed | The panel edit is not undone, because it was dispatched with `addToHistory.of(false)` | `T118` | `15` §8.1.
`A039` | `F-editor` | A file row is dragged onto a folder row | The drop completes | The file's path changes and its bytes compare equal | `T119` | `15` §9.
`A040` | `F-editor` | An image file is dropped into the editor | The drop completes | An image link is inserted at the drop offset, and no other byte changes | `T120` | `15` §9.
`A041` | `F-docmode` | A document opened in Doc mode | Every first-level toolbar control is used once | The resulting file parses as plain markdown in a stranger's parser | `T121` | `docs/mvp0/PRODUCT-PLAN.md` section 7.
`A042` | `F-docmode` | A document opened in Doc mode | Nothing is typed | The bytes on disk are unchanged. **Opening a view never writes** | `T122` | `docs/mvp0/PRODUCT-PLAN.md` section 17.
`A043` | `F-docmode` | Doc mode, first open on this account | The mode is entered | `K.s05.toast` appears exactly once, and never again on this account | `T123` | `16` §6.
`A044` | `F-views` | A document with H2 and H3 headings | Each of Page, Flow, Slides, Mind map, Kanban and Outline is selected | The bytes on disk are identical after all six | `T124` | `docs/mvp0/PRODUCT-PLAN.md` section 17.
`A045` | `F-blocks` | A document containing an `fm-chart` block | It is rendered by a plain markdown parser | The block renders as a fenced code block and the table above it as a table | `T125` | `docs/mvp0/PRODUCT-PLAN.md` section 20.
`A046` | `F-blocks` | Any `fm-` block | It is parsed, rendered and serialised | The serialised bytes compare equal to the input | `T126` | `docs/mvp0/PRODUCT-PLAN.md` section 20.

---

## 4. The AI layer

id | feature | given | when | then | test | spec
`A050` | `F-aibox` | An empty document and an account with credits | The AI box is focused | `K.s06.cost` is visible before any control is pressed | `T127` | `16` §7.
`A051` | `F-aibox` | An empty document | The box is open | Its first line names the target document by name | `T128` | `docs/mvp0/SCREEN-CHANGES-2026-09-18.md:274`.
`A052` | `F-aibox` | An idea is in progress | The box is scrolled | The target line stays on screen | `T129` | `docs/mvp0/SCREEN-CHANGES-2026-09-18.md:278`.
`A053` | `F-aiedit` | A selection and an AI verb | The verb runs and returns a suggestion | The document bytes are unchanged until Accept is pressed | `T130` | `docs/mvp0/PRODUCT-PLAN.md` section 16.
`A054` | `F-aiedit` | A suggestion is showing | Accept and Reject are measured | Both carry the same computed font size, weight and background role | `T131` | `16` §2.
`A055` | `F-aiedit` | A suggestion is showing | Reject is pressed | The bytes compare equal to the pre-suggestion bytes | `T132` | `17` `E084`.
`A056` | `F-aiedit` | A model proposal whose range cannot be spliced | Accept is pressed | The document is unchanged and the proposal is dropped | `T052` | `17` `E084`.
`A057` | `F-airouter` | Every provider in the chain refusing | An AI edit is requested | The ledger balance is identical before and after | `test/ai/provider-race.test.ts` | `17` `E080`.
`A058` | `F-airouter` | The first provider rate-limited | An AI edit is requested | The second provider serves it, and the person sees no error | `test/ai/provider-race.test.ts` | `17` `E081`.
`A059` | `F-airouter` | An AI request | It is sent | It is acknowledged in under 1 s and the first token arrives in under 3 s | `T133` | `docs/mvp0/PRODUCT-PLAN.md` section 21.
`A060` | `F-aisettings` | A fresh account | Settings is read | Ghost text is off | `T134` | `docs/mvp0/PRODUCT-PLAN.md` section 14.
`A061` | `F-aimark` | An accepted AI edit | The version record is read | It carries `author`, `source`, `model`, `ask`, `accepted_by` and `at` | `T135` | `docs/mvp0/PRODUCT-PLAN.md` section 20.
`A062` | `F-aimark` | Inline marking off, which is the default | An AI edit is accepted | The file contains no `<!-- ai:` comment | `T136` | `docs/mvp0/PRODUCT-PLAN.md` section 20.
`A063` | `F-aibudget` | An account at its per-account budget | A model call is attempted | The breaker opens and no provider is called | `T137` | `docs/mvp0/PRODUCT-PLAN.md` section 14.
`A064` | `F-aisafety` | Document text sent to a model | The request is inspected | The text sits inside a delimited data block | `T138` | `docs/mvp0/PRODUCT-PLAN.md` section 14.

---

## 5. Problems and instruction files

id | feature | given | when | then | test | spec
`A070` | `F-problems` | A document with a broken wikilink, a heading skip, a missing alt attribute and a malformed table row | The panel opens | Exactly four rows appear under the Checks filter | `T140` | `16` §11.
`A071` | `F-problems` | The same document | The panel opens | No network request is made by the structural checks | `T141` | `docs/mvp0/PRODUCT-PLAN.md` section 5.
`A072` | `F-problems` | A document with one long sentence | The panel opens | The row appears under Writing, never under Checks, and no control is disabled by it | `T142` | `16` §11.
`A073` | `F-problems` | Any document | Fix all safe runs | Every changed byte corresponds to a listed safe fix, and nothing else changed | `T143` | `16` §11.
`A074` | `F-instructions` | A project with five instruction files, one drifted | The panel opens | It reports 4 of 5 and names the drifted file and the line count | `T144` | `16` §12.
`A075` | `F-instructions` | The panel open | Its text is read | It contains `K.s11.honest` verbatim, including both studies | `T145` | `16` §12.

---

## 6. Ideas and the blueprint

id | feature | given | when | then | test | spec
`A080` | `F-ideas` | An idea and the Low depth | The arrow is pressed | Between 10 and 15 questions are generated, in one call | `T150` | `docs/mvp0/PRODUCT-PLAN.md` section 5.
`A081` | `F-ideas` | A generated question set | A page renders | It shows 4 questions or fewer | `T151` | `docs/mvp0/SCREEN-CHANGES-2026-09-18.md:112`.
`A082` | `F-ideas` | A question marked non-branching | It is answered | No later page is regenerated and no model call is made | `T152` | `docs/mvp0/PRODUCT-PLAN.md` section 5.
`A083` | `F-ideas` | A question marked branching | It is answered | The affected cards show the rewriting state, and `K.s13.rewriting` names the question | `T153` | `16` §13.2.
`A084` | `F-ideas` | A Free account and three rewrites already fired | A fourth branching answer | No rewrite runs, and the standard set stands | `T047` | `17` `E077`.
`A085` | `F-ideas` | Any depth | The first page renders | The controls are identical to Low's: the same progress line, pill, Skip, recommendation and Next | `T154` | `docs/mvp0/SCREEN-CHANGES-2026-09-18.md:104`.
`A086` | `F-ideas` | Page two or later | Skip all is pressed | A modal appears carrying `K.s14.skipall.body1` and `K.s14.skipall.body2` | `T155` | `16` §13.3.
`A087` | `F-ideas` | A question answered Not sure | The blueprint is written | `DECISIONS.md` records it as open, never as decided | `T156` | `docs/mvp0/PRODUCT-PLAN.md` section 5.
`A088` | `F-ideas` | A Low answer | The recommendation is shown | No percentage or confidence number appears anywhere on the card | `T157` | `docs/mvp0/PRODUCT-PLAN.md` section 9.
`A089` | `F-ideas` | A Medium answer | The evidence rows are read | Every row cites the person's own documents or the template, and each template row carries the date it was last checked | `T158` | `docs/mvp0/PRODUCT-PLAN.md` section 9.
`A090` | `F-blueprint` | A finished Low blueprint | The kit is listed | It contains exactly 15 files: 12 markdown and 3 data | `T159` | `docs/mvp0/PRODUCT-PLAN.md` section 9.
`A091` | `F-blueprint` | A finished blueprint | The consistency check runs | Every entity named in `specs/*.md` is defined in `02-DATA-AND-API.md` | `T160` | `16` §13.4.
`A092` | `F-blueprint` | A published kit | The page is read | The root hash is printed on the page, outside the tarball | `T161` | `docs/mvp0/PRODUCT-PLAN.md` section 5.
`A093` | `F-blueprint` | A published kit | The kickoff prompt is run | Step 1 stops when the computed hash differs from the printed one | `T162` | `docs/mvp0/PRODUCT-PLAN.md` section 14.
`A094` | `F-blueprint` | A Low blueprint | It is requested | Progress is shown past 10 s and the kit is complete in under three minutes | `T163` | `docs/mvp0/PRODUCT-PLAN.md` section 21.
`A095` | `F-map` | A project of 12 documents | A document is saved | The map is rebuilt from the files and no model call is made | `T164` | `16` §13.5.

---

## 7. Sharing, review and history

id | feature | given | when | then | test | spec
`A100` | `F-share` | A document and an email that is not an account | The person is added | An invite is offered, and no error state is shown | `T027` | `17` `E039`.
`A101` | `F-share` | A link with a password | The link is opened | A hash is stored server-side and the plaintext password appears in no record | `T170` | `16` §14a.
`A102` | `F-share` | A link with a 7-day expiry | The clock passes the expiry | The link answers as expired, and the document still opens for its owner | `T171` | `16` §14a.
`A103` | `F-publish` | A published page | `curl -sI` requests the HTML route | The status is 200, with no redirect in the chain | `test/proxy.test.ts` | `docs/mvp0/SCREEN-CHANGES-2026-09-18.md:324`.
`A104` | `F-publish` | A published page | `curl -sI` requests `page.md` and `llms.txt` | Both answer 200 with no redirect and no interstitial | `test/proxy.test.ts` | `docs/mvp0/SCREEN-CHANGES-2026-09-18.md:325`.
`A105` | `F-publish` | A published page on Free | The footer is read | It carries `K.s18.made`, `K.s18.report`, Privacy, Terms and the markdown twin link | `T172` | `16` §14b.
`A106` | `F-publish` | A published page | The open-in bar is measured | It is added to the DOM only after first contentful paint | `T173` | `docs/mvp0/SCREEN-CHANGES-2026-09-18.md:324`.
`A107` | `F-publish` | A published page | Third-party script tags are counted | The count is zero | `T174` | `docs/mvp0/PRODUCT-PLAN.md` section 14.
`A108` | `F-live` | Two people in one document on Free | A third attempts to join | The join is refused and `K.s19.toast` states the limit | `T046` | `17` `E076`.
`A109` | `F-live` | A live session | The last participant leaves | No shared-editing state is persisted to any store | `T175` | `docs/mvp0/PRODUCT-PLAN.md` section 15.
`A110` | `F-queue` | A queue with one person edit and two machine edits | The filter is set to People | Exactly one item is listed | `T176` | `16` §14d.
`A111` | `F-queue` | A queue with machine edits | Accept all is pressed | Only the named person's edits are applied, and a confirmation states the count first | `T082` | `17` `E117`.
`A112` | `F-queue` | An agent-written change | The queue is read | The row offers Show diff first and Reject, and no one-click Accept | `T177` | `16` §14d.
`A113` | `F-queue` | Any queue item | It is rejected | The document bytes compare equal to the pre-proposal bytes | `T178` | `17` §8.
`A114` | `F-history` | A Free account | A document is saved 12 times over 10 days | Versions older than the history window are pruned to the head, and the head is intact | `T179` | `docs/mvp0/PRODUCT-PLAN.md` section 18.
`A115` | `F-history` | Any version | Restore is pressed | A new version is written, and the restored-from version still exists | `T180` | `16` §14e.
`A116` | `F-export` | Any account | Export runs | Documents, uploads, versions, comments and queue items all leave as files a stranger's tool reads | `T181` | `docs/mvp0/PRODUCT-PLAN.md` section 18.

---

## 8. In, out and everywhere

id | feature | given | when | then | test | spec
`A120` | `F-import` | A folder of 2,000 markdown files | It is imported | Every file's bytes compare equal, and the whole import finishes in under two minutes | `T182` | `docs/mvp0/PRODUCT-PLAN.md` section 21.
`A121` | `F-import` | An Obsidian vault | It is imported | Only the daily-note path and the templates folder are read from `.obsidian` | `T183` | `docs/mvp0/PRODUCT-PLAN.md` section 11.
`A122` | `F-import` | A Google Doc over 10 MB | Import is attempted | Nothing is created, and the text shown equals `K.s22.refuse.gdoc.sub` | `T024` | `17` `E035`.
`A123` | `F-import` | A `.docx` file | It is imported | No request carries the file's bytes off the machine | `T184` | `16` §14f.
`A124` | `F-github` | A connected repository | A write is attempted outside `docs/` | The write is refused server-side | `test/repository/github-writer.test.ts` | `17` `E056`.
`A125` | `F-github` | A file whose blob sha has moved | A push is attempted | The 409 is treated as a re-read, and no content is overwritten blind | `test/repository/github-writer.test.ts` | `17` `E111`.
`A126` | `F-drive` | A connected folder | A change is made in Drive | It appears in frontmatter within five minutes | `T185` | `docs/mvp0/PRODUCT-PLAN.md` section 21.
`A127` | `F-drive` | A Drive edit and a web edit on the same paragraph | Both are synced | Both versions are kept, neither is merged, and the conflict screen is shown | `test/share/list-conflicts.test.ts` | `17` `E112`.
`A128` | `F-conflict` | A conflict on screen | Nothing is pressed | No merged version exists in the version store | `T186` | `docs/mvp0/PRODUCT-PLAN.md` section 17.
`A129` | `F-conflict` | A conflict on screen | Let AI decide is pressed | A proposal enters the change queue, and the file is unchanged until an item is accepted | `T081` | `17` `E114`.
`A130` | `F-offline` | The browser goes offline | Typing continues | Every keystroke reaches local storage, and the pending count rises | `test/drafts/draft-store.test.ts` | `17` `E100`.
`A131` | `F-offline` | The browser is offline | An AI edit is attempted | The control is disabled with `K.s24.aioff` beside it, and no request is made | `T055` | `17` `E087`.
`A132` | `F-offline` | A first connection after offline work | Sync runs | Every local draft reaches the server before any local copy is evicted | `T187` | `docs/mvp0/PRODUCT-PLAN.md` section 12.
`A133` | `F-desktop` | The desktop build | Documents are created past the cloud cap | No cap is enforced, and every document is a file on disk | `T188` | `docs/mvp0/PRODUCT-PLAN.md` section 12.
`A134` | `F-phone` | A viewport under 600 dp | Any screen loads | The bottom bar carries exactly five destinations | `T189` | `docs/mvp0/PRODUCT-PLAN.md` section 12.
`A135` | `F-phone` | A viewport under 600 dp | Any screen loads | No hover tip is registered | `T190` | `18` §7.

---

## 9. Entitlements, caps and the panel

id | feature | given | when | then | test | spec
`A140` | `F-limits` | The repository at any commit | The architecture gate runs | No cap literal is read outside the entitlements layer. **`limitsFor(account)` is the one read path** | `T191` | `docs/mvp0/PRODUCT-PLAN.md` section 30.
`A141` | `F-limits` | An account at the document cap | A new cloud document is attempted | Nothing is created, every existing document still opens and exports, and none is deleted | `T040` | `17` `E070`.
`A142` | `F-limits` | An account downgraded below what it holds | It signs in | Nothing is deleted, and creation is blocked until it is under the cap | `T048` | `17` `E078`.
`A143` | `F-limits` | A Free collaborator on a Pro owner's document | An action is taken | The owner's limits apply | `T034` | `docs/mvp0/PRODUCT-PLAN.md` section 19.
`A144` | `F-config` | A founder lowering a limit | Save is pressed | The count of accounts the change puts over the cap is shown, with their names, before the write | `T049` | `docs/mvp0/PRODUCT-PLAN.md` section 30.
`A145` | `F-config` | Any configuration write | It is submitted | The super-admin flag is checked server-side, never in the browser | `T037` | `docs/mvp0/PRODUCT-PLAN.md` section 30.
`A146` | `F-config` | Any configuration write | It succeeds | An audit row records who, which setting, from what, to what, when, and how many accounts moved | `T192` | `docs/mvp0/PRODUCT-PLAN.md` section 30.
`A147` | `F-config` | A provider whose terms have not been opened | Its switch is pressed | It does not enable, and the row states why | `T060` | `17` `E090`.
`A148` | `F-config` | The training promise row and the age floor row | Either is pressed | Neither changes. Both are locked, with the reason on the row | `T193` | `docs/mvp0/PRODUCT-PLAN.md` section 30.
`A149` | `F-ledger` | Any model call | It completes or fails | Exactly one ledger entry exists, carrying the account, kind, delta, model and cost | `T194` | `docs/mvp0/PRODUCT-PLAN.md` section 18.
`A150` | `F-ledger` | A failed model call | The ledger is read | The delta is zero | `T051` | `16` §1.
`A151` | `F-exception` | A time-boxed exception on one account | Its expiry passes | The account returns to its plan limits on the next read | `T195` | `docs/mvp0/PRODUCT-PLAN.md` section 30.

---

## 10. Criteria that were written and thrown out

**Nine were drafted and cut, because no machine can check them.** They are kept here so nobody
re-drafts them, and so the rule in section 0.4 has teeth.

Rejected `then` | Why it fails | What replaced it
The sign-in page feels fast | No assertion | `A008`, a stopwatch median
A person who knows Google Docs needs nothing explained | Needs a person, and a population | `A001` to `A007`, which check the absence of the things that would explain
The editor is pleasant to type in | No assertion | `A030`, keystroke echo at p95
Doc mode looks like Google Docs | Comparative and subjective | `A041`, the file still parses as plain markdown
The refusal message is clear | No assertion | `A122`, the string equals the copy id
Empty states are helpful | No assertion | `A200` below, one primary control
The blueprint is good | No assertion | `A090` and `A091`, file count and consistency
The map helps an agent | Needs an agent and a task | `A095`, rebuilt from files with no model call
AI edits are trustworthy | Needs a person's judgement | `A053` and `A055`, bytes unchanged until accepted

**The pattern in all nine:** the rejected form describes the intended effect, and the replacement
describes an observable consequence of it. **The effect is still the goal; it is just not the test.**

---

## 11. Feature slug map

One row per slug used above, saying what the slug is and where the plan defines it.

**The other half of the join is `10-FEATURE-REGISTER.md` section 7**, which lists the numeric
features each slug reaches. Read the two side by side: this table says what a slug means, that one
says which features it tests. **Forty-two slugs, and the register records that they reach 137 of its
180 features**, leaving 43 with no criterion at all. That gap is a hole in this file, not in the
register, and money is the largest part of it.

Slug | What it is | Where the plan defines it | Criteria
`F-signin` | Sign in with Google or GitHub, one tap | §3 front door, `docs/mvp0/PRODUCT-PLAN.md` section 3 | `A001` to `A007`.
`F-firstrun` | The first sixty seconds | `18` §1 | `A008`.
`F-splice` | The splice writer | §17 invariant 2, `docs/mvp0/PRODUCT-PLAN.md` section 17 | `A010` to `A020`, `A024`.
`F-shapegate` | The shape gate | `src/modules/mdmax/domain/shape-gate.ts` | `A021`, `A022`.
`F-vaultwrite` | The vault write guard | `src/modules/repository/application/commit-changes.ts` | `A023`.
`F-editor` | The editor, four modes | §4, `docs/mvp0/PRODUCT-PLAN.md` section 4 | `A030` to `A040`.
`F-docmode` | Doc mode | §7 | `A041` to `A043`.
`F-views` | View as Flow, Slides, Mind map, Kanban, Outline | §8 | `A044`.
`F-blocks` | The `fm-` blocks | §20, `docs/mvp0/PRODUCT-PLAN.md` section 20 | `A045`, `A046`.
`F-aibox` | The AI box on an empty document | S06 | `A050` to `A052`.
`F-aiedit` | Seven verbs on a selection | S07 | `A053` to `A056`.
`F-airouter` | The provider chain | §14 | `A057` to `A059`.
`F-aisettings` | The two AI switches | S28 | `A060`.
`F-aimark` | The AI mark in the version record | §20, `docs/mvp0/PRODUCT-PLAN.md` section 20 | `A061`, `A062`.
`F-aibudget` | Per-account budget and breaker | §14 control 3 | `A063`.
`F-aisafety` | The delimited data block | §14 control 7 | `A064`.
`F-problems` | The problems panel | S10 | `A070` to `A073`.
`F-instructions` | The instruction-file set | S11 | `A074`, `A075`.
`F-ideas` | Idea mode, three depths | §9 | `A080` to `A089`.
`F-blueprint` | The fifteen-file kit | §9, `docs/mvp0/PRODUCT-PLAN.md` section 9 | `A090` to `A094`.
`F-map` | The project map | S16 | `A095`.
`F-share` | People and links | §10 | `A100` to `A102`.
`F-publish` | Published pages | §10, S18 | `A103` to `A107`.
`F-live` | Live editing | §15, `docs/mvp0/PRODUCT-PLAN.md` section 15 | `A108`, `A109`.
`F-queue` | The change queue | S20, §17 | `A110` to `A113`.
`F-history` | Document history | S21 | `A114`, `A115`.
`F-export` | Export | §18, `docs/mvp0/PRODUCT-PLAN.md` section 18 | `A116`.
`F-import` | Folder, Obsidian, Notion, Docs and Word import | §11 | `A120` to `A123`.
`F-github` | The GitHub App | §11 | `A124`, `A125`.
`F-drive` | Google Drive sync | §11 | `A126`, `A127`.
`F-conflict` | The conflict screen | S31 | `A128`, `A129`.
`F-offline` | Offline in the browser | §12 | `A130` to `A132`.
`F-desktop` | The desktop app | §12 | `A133`.
`F-phone` | The phone layouts | §12 | `A134`, `A135`.
`F-limits` | The entitlements layer | §30 | `A140` to `A143`.
`F-config` | The configuration panel | §30 | `A144` to `A148`.
`F-ledger` | The usage ledger | §18 | `A149`, `A150`.
`F-exception` | A time-boxed exception | §30 | `A151`.
`F-empty` | Empty states | `18` §4 | `A200`.
`F-a11y` | Accessibility | §16 | `A201`, `A202`.
`F-perf` | Performance budgets | §21 | `A203`, `A204`.
`F-legal` | The legal floor | §23 | `A205`, `A206`.

---

## 12. Six criteria that cut across every feature

id | feature | given | when | then | test | spec
`A200` | `F-empty` | Each of the 22 empty states in `18` §4 | It is rendered | Exactly one control carries the primary style, or zero where `18` §6 says so | `T200` | `18` §3.
`A201` | `F-a11y` | Any screen | Contrast is computed for every text and background pair | Every pair is at or above 4.5:1 | `docs/mvp0/screens/gen.mjs:620` | `docs/mvp0/PRODUCT-PLAN.md` section 16.
`A202` | `F-a11y` | Any screen | It is walked by keyboard alone | Every action in `16-COPY-DECK.md` marked `label` is reachable | `T201` | `15` §13.
`A203` | `F-perf` | The editor's first load | The bundle is measured in continuous integration | The JavaScript is at or under 250 KB | `T202` | `docs/mvp0/PRODUCT-PLAN.md` section 21.
`A204` | `F-perf` | A mid-range Android over 4G | The first load is measured | Largest contentful paint under 2.5 s at p75, interaction to next paint under 200 ms, cumulative layout shift under 0.1 | `T203` | `docs/mvp0/PRODUCT-PLAN.md` section 21.
`A205` | `F-legal` | Any published page | It is rendered | A report route is present and resolves | `T204` | `docs/mvp0/PRODUCT-PLAN.md` section 23.
`A206` | `F-legal` | Any price shown to a person | It is read | It states that it is inclusive of tax | `T205` | `docs/mvp0/PRODUCT-PLAN.md` section 23.

---

## 13. Counts

Counted from the tables above on 18 September 2026, with these three commands:

```bash
# criteria
grep -oE '^`A[0-9]{3}`' docs/pack/19-ACCEPTANCE-CRITERIA.md | sort -u | wc -l
# distinct real test paths cited
grep -oE '`(test/[^`]+|scripts/[^`]+|docs/mvp0/screens/gen\.mjs:[0-9]+)`' \
  docs/pack/19-ACCEPTANCE-CRITERIA.md | sort -u | wc -l
# criteria whose test column is a real path rather than a T id
grep -E '^`A[0-9]{3}` \|' docs/pack/19-ACCEPTANCE-CRITERIA.md \
  | grep -cE '\| `(test/|scripts/|docs/mvp0/screens/gen)'
```

- **129 criteria.**
- **12 distinct real test paths.**
- **19 criteria carry one.** The remaining 110 carry a `T` id and do not exist.

**That ratio is the honest state of the product.** The engine has tests; almost nothing else does.

---

## 14. Limits of this document

- **What was not assessed.** No criterion here was executed. The commands in sections 0.1 and 13 were
  run; the criteria themselves were not.
- **What could not be verified.** Every `T` id. Every `spec` cell reading `none yet` or naming a pack
  section that another owner is writing.
- **What is not established.** The coverage. `10-FEATURE-REGISTER.md` section 7 records that these
  42 slugs reach 137 of its 180 features, so **43 features have no criterion here at all**. Its
  largest untested groups are money and the portfolio, and this file did not write for either.
- **What would falsify it.** The register changing which features a slug reaches, which is its call
  and not this file's. Or the NF-1 and NF-3 fixes landing, which change `A013`, `A016` and `A017` on
  the day they do.
- **One thing a reader must not conclude.** A criterion here is not a passing test. **129 criteria,
  19 of them covered by a real test** is the number that matters, and section 13 gives the commands
  that re-derive it rather than asking anyone to trust this sentence.
- **The rule this file exists to enforce, restated.** If a criterion cannot be checked by a machine,
  the criterion is wrong. Section 10 holds nine that were cut for that reason, and the next person to
  add one should expect the same treatment.
