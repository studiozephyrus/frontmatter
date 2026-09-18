---
id: screens-S27-S38
title: Resolution log for screens S27 to S38
mode: reference
tier: canonical
status: living
verified_against: e0f6f89
updated: 2026-09-18
owner: sagnik
---

# Resolution log for screens S27 to S38, 18 September 2026

**What this file is.** One row per open point closed in `docs/pack/12-screens/S27.md` to `S38.md`,
written under `docs/pack/tools/RESOLVE-BRIEF.md`. The founder reviews from here.

**How to read a row.** `resolved (proposed 18 Sep, founder review)` means decided on the evidence and
awaiting the founder. `needs founder` means a recommendation is written and only the founder can take
it. Nothing here is marked `[Z]`.

**Register rows needed** are named in the row and gathered again in section 2. This agent did not
edit any register.

## 1. The log

file | id or line | the open point | what you did | basis | needs founder (yes/no)
---|---|---|---|---|---
S27 | Keyboard and focus, `UNVERIFIED:` chord | Whether any chord is free for a theme shortcut | Checked, confirmed. File 15 section 2 assigns no theme chord and none is proposed, so the tag is replaced with `[O]` | `grep -in theme docs/pack/15-INTERACTION-AND-KEYBOARD.md`, empty | no
S27 | Desktop differences, `UNVERIFIED:` Tauri theme | Whether `src-tauri/` sets a window theme | Checked, confirmed none. Added that the window loads the web app, so the same pre-paint script runs | `grep -in theme` over `src-tauri/tauri.conf.json` and `src-tauri/src/*.rs`, empty; `src-tauri/tauri.conf.json:19` | no
S27 | `D53` | Is the theme preference per account or per device? | resolved (proposed 18 Sep, founder review). Per account, default match the system, which resolves per device. Rejected a per-device store | S28's every-device promise; `A658`; the match-system fallback at `src/app/globals.css:124` | no
S27 | `D54` | Does a published page follow the reader's system or the author's choice? | resolved (proposed 18 Sep, founder review). The reader's system. Rejected the author's choice. S18, owned by another writer, should say the same | The reader has no account (S27 unauthorised state); a forced theme overrides a reader's setting | no
S28 | Keyboard and focus, `UNVERIFIED:` shortcut | Whether a shortcut opens Settings | Checked, false. File 15 section 2 proposes `Cmd/Ctrl + ,`. The line now points at that row | `docs/pack/15-INTERACTION-AND-KEYBOARD.md` section 2, read 18 Sep | no
S28 | Desktop differences, `UNVERIFIED:` ten sections | Whether the desktop shows the same ten sections | Checked, claim corrected. The desktop loads the web app, so it shows what the web shows, which is the five-toggle modal at `e0f6f89` | `src-tauri/tauri.conf.json:19`; `src-tauri/src/lib.rs` adds a menu only; `SettingsModal.tsx` is 82 lines with five toggles | no
S28 | `D55` | Tab or modal? | resolved (proposed 18 Sep, founder review). A tab. Rejected the modal | Ten slugs and inbound deep links from S27 and S29 need a route | no
S28 | `D56` | Grievance officer's name in Account? | resolved (proposed 18 Sep, founder review). Public pages only. Rejected a second rendering in Settings | File 28 section 7.4; file 54 row `L02` | no
S28 | `D57` | Which preferences are per device? | resolved (proposed 18 Sep, founder review). Only the two desktop rows. Everything else per account; theme via match the system | S28 heading promise; `D53` | no
S29 | Keyboard and focus, `UNVERIFIED:` file 15 | No conflict could be checked against file 15 | Checked, confirmed. No chord claimed, none assigned, no S29 row in section 6.1 | `docs/pack/15-INTERACTION-AND-KEYBOARD.md` sections 2 and 6.1, read 18 Sep | no
S29 | Desktop differences, `UNVERIFIED:` Tauri external URL | Can the Tauri build open an external URL? | Checked, claim corrected. Not today: `shell:default` grants `allow-open`, but the capability has no `remote` key, the window loads a remote URL, and `package.json` has no shell plugin. Kept `UNVERIFIED:` for a running build, with needs | `src-tauri/capabilities/default.json`; `tauri-plugin-shell-2.3.5/permissions/default.toml`; `tauri-utils-2.9.2/src/acl/capability.rs`; `src-tauri/tauri.conf.json:19` | no
S29 | Open questions, the collaborator conflict paragraph | Said SCREENS.md and plan section 18 still say three | Checked, false now. Both say one. Paragraph rewritten as closed | `sed -n '25p;29p' docs/mvp0/SCREENS.md`; plan section 18 table | no
S29 | `D58` | Meters for live collaborators and history? | resolved (proposed 18 Sep, founder review). Four meters stay, the other seven quantities become a plain list. Corrected "six entitlements" to eleven. A copy row is needed for the list heading | `53` section 3.1, eleven quantity rows. Register row needed in `16-COPY-DECK.md` | no
S29 | `D59` | What the screen says between cancel and period end | resolved (proposed 18 Sep, founder review). Pro until the date, then Free, nothing deleted, and a Keep Pro control | `53` section 5.3. Register row needed in `16-COPY-DECK.md` | no
S29 | `D60` | Annual offered here? | needs founder. Recommend offering it as a choice. Flagged that annual loses 19.39 rupees a month per user at full caps (171.57 - 190.96), SIMULATED | `53` sections 4.2 and 4.3; `28` section 4.6 | yes
S30 | Keyboard and focus, `UNVERIFIED:` file 15 | No conflict could be checked | Checked, confirmed. No chord added and no S30 row in file 15 | `grep -n "S30" docs/pack/15-INTERACTION-AND-KEYBOARD.md`, empty | no
S30 | `D61` | Valid handle, and who arbitrates a dispute | Format resolved (proposed 18 Sep, founder review): reuse `validateSlug`. Dispute outcome needs founder, routed through the grievance process | `src/modules/share/domain/slug.ts:232`; `54` section 3.3 | yes
S30 | `D62` | How long a released handle is held | resolved (proposed 18 Sep, founder review). Never reassigned to another account. Rejected a timed hold | Removes the hijack without inventing an interval | no
S30 | `D63` | Which templates ship | resolved (proposed 18 Sep, founder review). Three: projects first, writing first, minimal. Rejected industry templates | The seven keys in `66-FORMAT-SPECIFICATIONS.md:347`; `[Z]` portfolio is secondary | no
S30 | `D64` | Portfolio indexed by default? | resolved (proposed 18 Sep, founder review). Follows `flag.publish.indexed`, no own flag. Named the plan-against-file-28 disagreement on the default and sent it to S37 | Plan section 10; `28` section 6 | no
S31 | Data contract, `UNVERIFIED:` S20 spans | Does S20 draw span-level decisions inside one item? | Checked, false. S20 has one span per row. Named the change S20's owner must make for `A681` | `docs/pack/12-screens/S20.md` data contract and Accept one rows | no
S31 | Data contract, `UNVERIFIED:` listConflicts | Does `list-conflicts.ts` carry this screen's shape? | Checked, false. It lists public slug collisions, not versions. Pointed at file 67 section 5.7 | `src/modules/share/application/list-conflicts.ts`, read at `e0f6f89` | no
S31 | States, three-way `UNVERIFIED:` | Not drawn and not specified | Specified from `D65`. Still not drawn | File 67 section 6 | no
S31 | Keyboard and focus, `UNVERIFIED:` file 15 | No conflict could be checked | Checked, confirmed | File 15 section 6.1 S31 row and section 2 | no
S31 | `D65` | Three or more diverged versions | resolved (proposed 18 Sep, founder review). Adopted file 67's one-side-at-a-time proposal. Rejected three panes | `67-SYNC-AND-CONFLICT.md` section 6 | no
S31 | `D66` | What Accept means | Already decided `[Z]` on 18 September. Marked, not changed | `docs/mvp0/REVIEW-COVERAGE-2026-09-18.md` section 7, rows 59 and 61 | no
S31 | `D67` | Owner or any editor resolves? | resolved (proposed 18 Sep, founder review). Anyone with Apply. Unauthorised state row rewritten to match. Rejected owner only | Plan section 19 table | no
S31 | `D68` | Names after Keep both | resolved (proposed 18 Sep, founder review). Head keeps its name; side is `<stem> (from <origin>).md`; `E550` on a clash. Copy row `K.s31.keepboth` already exists | `E550` in file 17 | no
S32 | Anatomy, the chain table | Named SambaNova in the edit chain and left OpenRouter out | Claim fixed. The table now follows file 27 section 3.1 and says it was corrected | `27-MODEL-ROUTING-SPEC.md` sections 2.1 and 3.1 | no
S32 | Keyboard and focus, `UNVERIFIED:` file 15 | No conflict could be checked | Checked, confirmed. Escape here is one layer in file 15's stack | File 15 sections 2 and 5 | no
S32 | Limits, `UNVERIFIED:` provider pages | No provider page was opened by this file's writer | Checked, confirmed. Four pages re-opened by curl; the codes, the reset and both quotes match. Tag replaced with `[M]` and the URLs | Cloudflare errors and pricing pages, Groq rate-limits page, Cerebras rate-limits page, opened 18 Sep 2026 | no
S32 | `D69` | A queue in front of the chain? | resolved (proposed 18 Sep, founder review). Yes, rung 3 of file 27's ladder. Rejected no queue | `27` section 7.1 | no
S32 | `D70` | SambaNova in the chain? | resolved (proposed 18 Sep, founder review). No, held out until it has a no-card free tier. Rejected the plan's row | `27` section 2.1 row 5, `[M]` plans page 18 Sep | no
S32 | `D71` | Failed blueprint: resume or restart? | resolved (proposed 18 Sep, founder review). Resume at the first unserved call, count once, deduct nothing for a failure. Rejected restart | `27` section 7 | no
S32 | `D72` | Chain list shown to everyone? | resolved (proposed 18 Sep, founder review). Everyone, as drawn. Rejected on request only | `27` section 7.1 rung 8 | no
S33 | States, error, `UNVERIFIED:` | The no-id error state should be unreachable | Checked what can be checked. Named it a defect state under `E652`; no enforcement path exists to test | `E652` in file 17; `ls src/modules/` at `e0f6f89`, no entitlements module | no
S33 | Keyboard and focus, `UNVERIFIED:` file 15 | No conflict could be checked | Checked, conflict found and fixed. File 15 section 6.1 puts arrival focus on dismiss; this file said the heading. Now follows file 15 | File 15 section 6.1, S33 row | no
S33 | States, AI-unavailable, and the never-do line | Said S32 wins when the chain is down and the person is over the cap | Contradiction fixed. S33 wins, because the cap is checked at admission | `28` section 10.2; `27` section 7.1 rung 7 | no
S33 | Entry table, per-file upload row | Sent a file over the per-file size to this screen | Fixed with `D75` | `E038` in file 17 | no
S33 | `D73` | A warning before the cap? | resolved (proposed 18 Sep, founder review). No separate notice; the footer count and meters are the warning. Rejected a threshold notice | No evidence for a threshold number; the founders' simple-UI rule | no
S33 | `D74` | Free-space sort | resolved (proposed 18 Sep, founder review). Follows the tripped cap: largest first for bytes, least recently edited for counts. Rejected one fixed sort | `53` section 3.1 units | no
S33 | `D75` | Per-file size: this screen or another? | resolved (proposed 18 Sep, founder review). `E038`, a validation refusal. Rejected this screen | `E038` in file 17 | no
S33 | `D76` | Does trash count against the document cap? | resolved (proposed 18 Sep, founder review). No; restore past the cap refused with `E070`. Rejected counting trash | `21-DATA-MODEL.md` index excludes trash; plan section 18 | no
S33 | Observed, not changed | The entry table sends a second live collaborator here, and file 17 gives `E076` the S19 toast copy | Logged only. The owner of S19 or file 17 should say which surface shows it | `E076` in file 17 | no
S34 | Entry and exit, the drawing conflict paragraph | Said S34 was still drawn as a separate tab | Checked, stale. Commit `5edacc0` redrew it in the tree. Paragraph rewritten | `docs/mvp0/screens/gen.mjs:1923`; `git log -1 5edacc0` | no
S34 | Keyboard and focus, `UNVERIFIED:` file 15 | No conflict could be checked | Checked, confirmed | File 15 section 6.1, S12 row | no
S34 | Desktop differences, `UNVERIFIED:` blueprint cap | Does the desktop's no-cap cover blueprints? | Checked, claim corrected. Plan section 12 lifts only the document limit, so the desktop shows the allowance. Named file 53's looser "uncapped" | Plan section 12; `53` section 3.2 `features.desktop` | no
S34 | `D77` | Tab or tree section? | resolved (proposed 18 Sep, founder review). Tree section; drawing already fixed | `[Z]` SCREEN-CHANGES section 10.1; `5edacc0` | no
S34 | `D78` | Drop-a-folder wording in the empty state | resolved (proposed 18 Sep, founder review). Yes, as drawn. Flagged that feeding the files to the question set raises its token budget in file 27 | `gen.mjs` IDEAS_EMPTY; `27` section 3 | no
S34 | `D79` | Which industry templates, how many | resolved (proposed 18 Sep, founder review). Already in plan section 9 `[Z]`: seven, named | Plan section 9 | no
S34 | `D80` | Which kit is the example | resolved (proposed 18 Sep, founder review). The salon booking kit, one for everyone, made from a studio idea. Rejected a rotating example | `gen.mjs` S34 chip text; `A700` | no
S34 | `D81` | Over the blueprint allowance: standard set or block? | needs founder. Recommend: questions allowed on the standard set, files wait for the reset or a top-up. Named the clash with `53` section 5.3 | `53` section 5.3; `K.s34.overcap`; SCREEN-CHANGES section 10.3 | yes
S35 | `D82` | Where the audit log lives | resolved (proposed 18 Sep, founder review). The fifth nav entry opens S38's audit block unfiltered; an account on S38 filters it. Rejected a fifth screen | `28` section 7.2; `CFG_NAV` in `gen.mjs` | no
S35 | `D83` | Where prices are edited | resolved (proposed 18 Sep, founder review). On S35, the four `price.*` rows. Generator needs a Prices group | `28` section 4.6 | no
S35 | `D84` | Grievance name and pilot thresholds | resolved (proposed 18 Sep, founder review). Pilot on S38, legal rows on S37. Named file 28's own disagreement between section 2 and section 7.4 | `28` sections 2, 7.3, 7.4 | no
S35 | `D85` | Is question 16 absorbed? | resolved (proposed 18 Sep, founder review). No; ten rows; question 16 stays a founder question. Register row needed: question 16 has no row in `56-OPEN-DECISIONS.md` | `28` section 2 | no
S35 | `D86` | Save granularity | resolved (proposed 18 Sep, founder review). All or nothing, other edits stay pending. Rejected partial save | `28` section 11; `A706` | no
S35 to S38 | `D86` to `D92` | The same id names two different questions: `D86` on S35 and S37, `D87` on S36 and S37, `D88` to `D90` on S36 and S38, `D91` and `D92` on S37 and S38 | Not renumbered, per the brief. Each resolution names its screen. The coordinator should give one of each pair a suffix letter, per `65-CONVENTIONS.md` section 1 rule 3 | The open-questions tables of S35 to S38, read 18 Sep | no
S36 | Anatomy, the drawn chain table | Showed SambaNova on and OpenRouter refused | Claim fixed to the redraw: 7 providers, 19 model rows. Named one stale generator string, SambaNova's lock line, for the generator's owner | `git log -1 2d6688f`; `CHAIN` at `docs/mvp0/screens/gen.mjs:1970`; `27` section 2.1 row 5 | no
S36 | Limits, `UNVERIFIED:` provider pages | No provider page opened by this file's writer | Checked, confirmed. SambaNova plans page re-opened and quoted; the other three as in S32 | `https://cloud.sambanova.ai/plans`, opened 18 Sep 2026 | no
S36 | `D87` | SambaNova in the chain? | resolved (proposed 18 Sep, founder review). No, same as S32 `D70` | `[M]` plans page 18 Sep | no
S36 | `D88` | Per-model switches? | resolved (proposed 18 Sep, founder review). Per model under a provider switch, as redrawn. Rejected provider only | `27` section 2.5; redraw `2d6688f` | no
S36 | `D89` | Who records a provider's terms? | resolved (proposed 18 Sep, founder review). Either founder, quote and URL required, audited; gate A is read only so a record cannot admit a trainer. Rejected a second-founder confirmation | `28` sections 5.2 and 8 | no
S36 | `D90` | Local model block here or S37? | resolved (proposed 18 Sep, founder review). Here, as provider 6; no flag. Also closes S37 `D87`. Rejected a fifth flag | Redraw; `28` section 5.4 | no
S37 | Anatomy, the flag defaults | Drawn defaults (live on, key on, index off) against file 28 section 6 (false, false, true) | Disagreement named in place. Recommended file 28's reasoned defaults for the first two; indexing sent to `D92` | `28` section 6; `FLAGS` in `docs/mvp0/screens/gen.mjs` | no
S37 | S37 `D91` | Work in progress when a flag goes off | resolved (proposed 18 Sep, founder review). New starts stop, running work finishes. Rejected cutting it | `28` section 10.2 | no
S37 | S37 `D92` | Indexing flag global or per page | needs founder on the default. Shape proposed: global default plus a per-page choice on S17. Recommend off; three sources disagree | Plan section 10; `28` section 6; drawing | yes
S37 | S37 `D86` | Does turning off bring-your-own key revoke stored keys? | needs founder. Recommend: stop using, keep stored, tell people, restore on re-enable. It moves calls onto our cost | `28` section 6 `flag.byok` note | yes
S37 | S37 `D87` | A fifth flag for the local model? | resolved (proposed 18 Sep, founder review). No, per S36 `D90`. Rejected the flag | S36 redraw, provider 6 | no
S38 | S38 `D88` | Fields of the grant dialogue | resolved (proposed 18 Sep, founder review). The five fields and bounds of file 28 section 7.1. Rejected free-text keys | `28` section 7.1; `53` section 5.4 | no
S38 | S38 `D89` | Where the audit log lives | resolved (proposed 18 Sep, founder review). As S35 `D82` | `28` section 7.2 | no
S38 | S38 `D90` | Exception ceiling | resolved (proposed 18 Sep, founder review). 365 days, already file 28's bound. Rejected no ceiling | `28` section 7.1 | no
S38 | S38 `D91` | Who may grant | resolved (proposed 18 Sep, founder review). Super admin only; a grant-only role waits for a support hire. Register row needed later in the plan's section 19 roles table | `28` section 12 | no
S38 | S38 `D92` | Money meter on Pro | resolved (proposed 18 Sep, founder review). Spend plus margin from the plan's net a month. Rejected margin alone | `53` sections 4.1 and 4.2 | no

## 2. Register rows needed, for the coordinator

Row | Register | Why
Copy for the plain list of the other seven quantities on S29, `D58` | `16-COPY-DECK.md` | A new `K.s29.*` string. Not minted here
Copy for the cancelling state on S29, `D59` | `16-COPY-DECK.md` | A new `K.s29.*` string. Not minted here
Question 16, "which earlier positions stand", `D85` | `56-OPEN-DECISIONS.md` | It leaves the panel and has no row as a founder question
A grant-only role, S38 `D91` | `docs/mvp0/PRODUCT-PLAN.md` section 19 | Only when a support person is hired
Suffix letters for the colliding ids `D86` to `D92` | S35 to S38 | Per `65-CONVENTIONS.md` section 1 rule 3. This agent renumbered nothing

**For other owners, not registers.** S20 needs spans inside one queue item for `A681` (S31). S18
should state that a published page follows the reader's theme (`D54`). The generator's SambaNova
lock line is stale (S36). File 27's question-set token figure needs re-costing if dropped files feed
it (`D78`). File 53 section 5.3 and `K.s34.overcap` disagree on starting a blueprint over the
allowance (`D81`). File 28 places the legal rows under both S37 and S38 (`D84`).

## 3. Counts

Kind | Count | How counted
Open-question rows across S27 to S38 | 47 | The tables hold 47 rows for 40 ids, because 7 ids appear twice
Already decided `[Z]`, left as it was | 1 | `D66`
Resolved (proposed 18 Sep, founder review) | 41 | Rows marked so, with `D61`'s format half counted under needs founder
Needs founder | 5 | `D60`, `D61` disputes, `D81`, S37 `D92`, S37 `D86`
`UNVERIFIED:` tags checked | 18 | 9 confirmed, 9 found false or incomplete and fixed
Still `UNVERIFIED:` | 1 | S29, the checkout link on a running desktop build, with needs
Other claims found stale and fixed in passing | 7 | S29 collaborator paragraph, S32 chain table, S33 AI-unavailable rule, S33 per-file entry, S34 drawing paragraph, S36 chain table, S37 flag defaults named

## 4. Limits of this log

- Nothing was run against a live product, because none of these screens is built. Every check is
  against the source at `e0f6f89`, the pack files, the installed Tauri crates, or a page opened by
  `curl` on 18 September.
- The resolutions are proposals. None is a founder's decision, and none is marked `[Z]`.
- The annual margin figure in `D60` is SIMULATED from caps and list prices in file 53.
- What would falsify the largest group of resolutions: a change to `28-CONFIGURATION-PANEL-SPEC.md`
  or `27-MODEL-ROUTING-SPEC.md`, which most of the S32 to S38 answers adopt.
