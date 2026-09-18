---
id: screens-S01-S13
title: Resolution log for screens S01 to S13
mode: reference
tier: canonical
status: living
verified_against: e0f6f89
updated: 2026-09-18
owner: sagnik
---

# Resolution log for screens S01 to S13, 18 September 2026

**What this file is.** One row per open point closed in `docs/pack/12-screens/S01.md` to `S13.md`,
written under `docs/pack/tools/RESOLVE-BRIEF.md`. The founder reviews from here.

**How to read a row.** `resolved (proposed 18 Sep, founder review)` means decided on the evidence and
awaiting the founder. `needs founder` means a recommendation is written and only the founder can take
it. Nothing here is marked `[Z]`.

**Register rows needed** are listed in the last column's note and again in section 2, for the
coordinator. This agent did not edit registers 14, 16, 17 or 19.

## 1. The log

file | id or line | the open point | what you did | basis | needs founder (yes/no)
S01 | D05 | Does GitHub sign-in ship in phase A? | resolved (proposed 18 Sep, founder review): both providers in batch 2; GitHub moves behind `AuthGateway` on Firebase Auth | ADR-0009, ADR-0012, ADR-0007, `F102` in `10-FEATURE-REGISTER.md` | no
S01 | D06 | Is the email magic link ever turned on? | resolved (proposed 18 Sep, founder review): off; switched on for everyone only while a provider's sign-in is suspended | `docs/mvp0/PRODUCT-PLAN.md` section 27, `28-CONFIGURATION-PANEL-SPEC.md:387` | no
S01 | Limits, `UNVERIFIED:` GitHub path elsewhere | Whether a GitHub path exists under `src/modules/auth/` | checked, false: fixed the claim. Auth.js GitHub provider at `auth-options.ts:28`, called at `LoginScreen.tsx:102` | `[O]` `grep -rn "GitHub" src/modules/auth` | no
S01 | Limits, found while checking | `LoginScreen.tsx:141` renders a password form | recorded in the file as a breach of A001 to remove at build. Defect register row needed (not mine to add) | `[O]` `sed -n 141p src/modules/auth/presentation/LoginScreen.tsx` | no
S02 | D07 | Free live-collaborator cap: one or three? | resolved (proposed 18 Sep, founder review): one. Noted that `SCREENS.md:29` now says 1, so the row's source is stale | ADR-0015; `[O]` `sed -n 29p docs/mvp0/SCREENS.md` | no
S02 | D08 | Which card does the phone leave out? | resolved (proposed 18 Sep, founder review): the template card, as drawn; rejected leaving out From GitHub | the fixed priority order in S02's start table; `gen.mjs:990` `STARTS.slice(0, 4)` | no
S02 | Limits, `UNVERIFIED:` iOS folder upload | Folder upload on iOS Safari at 390 px | checked in part: picker folder selection confirmed from iOS 18.4; dragging a folder still `UNVERIFIED:`, needs a device | `[M]` caniuse `input-file-directory.json`, opened 18 Sep 2026 | no
S03 | D09 | How many recent rows on desktop and phone? | resolved (proposed 18 Sep, founder review): six and five, one layout constant; the full set is the S04 tree and search | `[O]` `gen.mjs:994` (six rows), `gen.mjs:1006` `slice(0, 5)` | no
S03 | D10 | Does Recent span projects? | resolved (proposed 18 Sep, founder review): across every project the person can open, shared included | the row's own Project and Owner columns; `docs/mvp0/PRODUCT-PLAN.md` section 5 | no
S03 | Limits, `UNVERIFIED:` owner name in the record | A shared document always carries an owner name | checked, does not hold: `users.displayName` is optional and readable only by its owner; no per-person opened time exists. Data-model rows needed in `21-DATA-MODEL.md` (owner display name, per-person recent record) | `[O]` `sed -n 169,187p docs/pack/21-DATA-MODEL.md` and `:248-:262` | no
S04 | D01 | Where does the wordmark sit? | needs founder (brand). Recommendation: mark alone in the workspace and in-app headers; wordmark on the front door and published page only | `docs/mvp0/PRODUCT-PLAN.md` section 5 | yes
S01 | resolutions, wordmark note | The plan's S01 line puts the wordmark on the card; S01 and the generator draw the mark | recorded in S01 and carried with S04 D01 | `docs/mvp0/PRODUCT-PLAN.md` section 5; `gen.mjs:947` | yes
S04 | D11 | Which five collapsibles? | needs founder on "Commands" only. Recommendation: the four drawn rows plus Outline; Commands read as the existing Command K palette | `REVIEW-COVERAGE-2026-09-18.md` section 7 row 9 (unanswered); `[O]` `CommandPalette.tsx` exists | yes
S04 | D12 | Does the Ideas tree section replace the route? | resolved (proposed 18 Sep, founder review): replaces it; S12 stays as an id for the idea view in the main column | `SCREEN-CHANGES-2026-09-18.md:300`; `REVIEW-COVERAGE-2026-09-18.md` section 5 row 66 | no
S04 | Limits, `UNVERIFIED:` Shortcuts in `src/` | No Shortcuts affordance survives in the shipped code | checked, confirmed: only comments and a reserved slug word | `[O]` `grep -rniE "shortcut" src` | no
S04 | Anatomy, not an open point | S04 anatomy names an AI edit button in the rail foot; `docs/mvp0/PRODUCT-PLAN.md` section 5, S04, says the rail keeps only the credit meter | noted only, not changed, for the S04 owner of the next pass | `grep -n "rail keeps only" docs/mvp0/PRODUCT-PLAN.md` | no
S05 | D13 | Which serif and which mono? | resolved (proposed 18 Sep, founder review): Noto Serif and Google Sans Code; rejected Source Serif 4 (no Indic subset) | `58-DESIGN-SYSTEM.md:176`; `[M]` `google/fonts` `METADATA.pb` for notoserif, googlesanscode, sourceserif4, notoserifdevanagari, notoserifbengali, opened 18 Sep 2026 | no
S05 | D14 | Does the properties panel ship in phase A? | resolved (proposed 18 Sep, founder review): batch 3 with Doc mode; noted the row's premise is stale (panel drawn at `gen.mjs:1056`, partial panel in `src/`) | ADR-0011; `50-ROADMAP.md` section 3.3 | no
S05 | D15 | Doc mode by default from a front matter key? | resolved (proposed 18 Sep, founder review): no key; last mode per person and document as account view state. Entry table row changed to match | projection law; `66-FORMAT-SPECIFICATIONS.md` section 3.9 lists no mode key | no
S05 | Limits and Anatomy, `UNVERIFIED:` no properties panel in `src/` | That no properties panel exists in `src/` | checked, false: `PropertiesPanel.tsx` (235 lines) rendered at `EditorPane.tsx:647`, nested values read-only. Fixed both the limits line and the section's "not built" bullet | `[O]` `grep -rliE "PropertiesPanel" src`; `wc -l` | no
S06 | D16 | What does the target picker list? | resolved (proposed 18 Sep, founder review): open tabs, ideas in progress, a new document; anything else opened in a tab first. Register row needed: picker group-heading copy in `16-COPY-DECK.md` | `SCREEN-CHANGES-2026-09-18.md:47` (very simple) | no
S06 | D17 | Draft prompt per document or per account? | resolved (proposed 18 Sep, founder review): per document and per idea, device draft store | `SCREEN-CHANGES-2026-09-18.md:59`; S06 data contract | no
S06 | D18 | Three or four intent chips on the phone? | resolved (proposed 18 Sep, founder review): three as drawn; Plan from notes left out | `[O]` `gen.mjs:1105` | no
S06 | Limits, `UNVERIFIED:` range through `LlmClient` | Whether composing the range into the prompt is enough for a byte-exact splice | checked: the range stays client-side and is spliced on return, so the port needs no range. Two defect rows needed: stale-range splice with no re-check; whole-file rewrite when nothing is selected | `[O]` `AIMenu.tsx:69-71`, `:153`, `:169-170`; `src/modules/ai/application/ports.ts:6` | no
S07 | D19 | Do the four unbuilt verbs ship in phase A? | resolved (proposed 18 Sep, founder review): all seven together in batch 3, as one feature `F155` | ADR-0011; `50-ROADMAP.md` section 3.3; `SCREEN-CHANGES-2026-09-18.md:67` | no
S07 | D20 | Is ghost text ever on this menu? | resolved (proposed 18 Sep, founder review): never; it stays the S28 switch, `F157` | `docs/mvp0/PRODUCT-PLAN.md` section 14 | no
S07 | D21 | A live collaborator edits the proposal's span | resolved (proposed 18 Sep, founder review): the proposal goes stale, Accept disabled with existing `E027`, re-run offered; nothing enters the queue | `17-ERROR-AND-REFUSAL-CATALOGUE.md:180` (`E027`); S07's own capture-the-range rule | no
S07 | Limits, `UNVERIFIED:` route shapes spliceable | Whether the three routes return a shape the screen can splice | checked: `{text}`, `{summary}`, `{suggestions}`, no range; splice is possible client-side, but only Refine splices. Defect row needed: Summarise and Suggest links rewrite the whole file (`AIMenu.tsx:153`, called at `:194`, `:209`); summary placed after front matter, not beside the selection | `[O]` `grep -n` over `src/modules/ai/application/` and `AIMenu.tsx` | no
S08 | D22 | Which chart kinds ship? | resolved (proposed 18 Sep, founder review) where it already lives: `pie`, `bar`, `line` via Mermaid; S08 points at it | `66-FORMAT-SPECIFICATIONS.md` section 4.4 | no
S08 | D23 | Where does an `fm-draw` file live? | resolved (proposed 18 Sep, founder review) where it already lives: `.excalidraw` JSON inside the document's uploads; S08 points at it | `66-FORMAT-SPECIFICATIONS.md` section 4.5 | no
S08 | D24 | Does folding a table write to the file? | resolved (proposed 18 Sep, founder review): view state only, per person and document | projection law, ADR-0006 | no
S08 | Limits, `UNVERIFIED:` KaTeX and Mermaid licences | Licences of the rendering dependencies | checked, confirmed MIT: katex 0.17.0, mermaid 11.15.0, rehype-katex 7.0.1, remark-math 6.0.0; Excalidraw 0.18.1 MIT from the registry | `[O]` installed `package.json` files; `[M]` registry.npmjs.org, opened 18 Sep 2026 | no
S09 | D25 | Tag vocabulary and the legend's lanes | resolved (proposed 18 Sep, founder review): open vocabulary, colour fixed by the word, legend lists the tags present; binds only when S09 is scheduled | S09's reading rules; `A568`; `66-FORMAT-SPECIFICATIONS.md` section 4.6 (no new syntax) | no
S09 | D26 | Is the board writable by drag? | resolved (proposed 18 Sep, founder review): read-only | projection law, ADR-0006 | no
S09 | D27 | Which document opens in Flow by default? | resolved (proposed 18 Sep, founder review): no key; last view per person and document, as S05 D15. Entry table changed | S05 D15 | no
S09 | Limits, `UNVERIFIED:` founders' flow site | Whether the flow site uses the same four rules | still `UNVERIFIED:`, needs the site's address; no URL found anywhere in the repo's docs | `[O]` `grep -rhoiE` over `docs` and `decisions` | no
S10 | D28 | Writing segment: model-backed or rules-based? | resolved (proposed 18 Sep, founder review): rules-based, on the device, free; check table row updated. Noted `docs/mvp0/SCREENS.md:129` needs the same correction (not my file) | the drawn advisory is a document measure; `REVIEW-COVERAGE-2026-09-18.md` section 7 row 26 | no
S10 | D29 | Does Fix all safe include formatting? | resolved (proposed 18 Sep, founder review): no; the formatter is `F148`, a separate palette command. Fix-all table row changed | `10-FEATURE-REGISTER.md` `F148`; plan section 6 | no
S10 | D30a | Where does the per-project rule file live? | resolved (proposed 18 Sep, founder review): `.markdownlint.jsonc` at the project root. Format-spec row needed in `66-FORMAT-SPECIFICATIONS.md` for the project dictionary and the front matter schema | `[M]` markdownlint and markdownlint-cli2 READMEs on GitHub, opened 18 Sep 2026 (MD001, MD045, MD056) | no
S10 | Limits, `UNVERIFIED:` install counts | markdownlint and Prettier install counts | checked and re-derived: 12,192,430 and 71,662,765 at 2026-09-18 17:37 UTC; body updated, the plan's older figures noted | `[M]` VS Code Marketplace `extensionquery` API | no
S11 | D31a | Which tools are in the caps table, and where was each read? | resolved (proposed 18 Sep, founder review): one row per tool; a cap written only when read from the tool's own source, else unknown via `E553`. First row checked: Codex 32 KiB default | `[M]` `openai/codex` `codex-rs/config/src/config_toml.rs:75`, opened 18 Sep 2026 | no
S11 | D32a | Can a copy be marked deliberately divergent? | resolved (proposed 18 Sep, founder review): yes, stored on the project, lapses when the source changes. Register rows needed: relationship copy string in `16-COPY-DECK.md` and state in `14-COMPONENT-INVENTORY.md` (`C135`) | alarm-fatigue reasoning; never changing a file another tool reads | no
S11 | D33a | Include instruction files found in an imported vault? | resolved (proposed 18 Sep, founder review): yes, every file found; relationship detected; unmatched shows as drifted copy or `E552` orphan | `A074` | no
S11 | Limits, `UNVERIFIED:` the two studies | Whether the two studies say what the screen claims | checked, confirmed; added that a third paper (2601.20404) found efficiency gains, so the literature is split | `[M]` arXiv API for 2602.11988, 2607.27250, 2601.20404, opened 18 Sep 2026 | no
S11 | Limits, `UNVERIFIED:` 32 KiB cap | The cap and which tool publishes it | checked, confirmed with a correction: it is Codex's configurable default, not a hard limit | `[M]` `openai/codex` source, opened 18 Sep 2026 | no
S11 | Limits, `UNVERIFIED:` 6,644 reactions and 60,000 projects | The two counts | checked and re-derived: 6,651 reactions at 17:38 UTC; agents.md says over 60k. Body updated with dates | `[M]` GitHub API issue 6235; https://agents.md/, opened 18 Sep 2026 | no
S12 | D34a | Do all seven industry templates appear? | resolved (proposed 18 Sep, founder review): all seven reachable; four chips, a More chip for the other three, then One for my industry. Register row needed: More chip copy in `16-COPY-DECK.md` | `docs/mvp0/PRODUCT-PLAN.md` section 9 (`[Z]` seven ship) | no
S12 | D35a | Is a generated template kept for reuse? | resolved (proposed 18 Sep, founder review): kept on the person's account only, still marked generated. Data-model row needed in `21-DATA-MODEL.md` | cost of a repeated call; no unreviewed content to strangers | no
S12 | D36a | Idea mode on the web as well as desktop? | resolved (proposed 18 Sep, founder review): both; the founder has answered this `[Z]` | `REVIEW-COVERAGE-2026-09-18.md` section 7 row 56 | no
S12 | Anatomy, found while resolving | The anatomy still names a separate Ideas rail (`ideasTree()`), against S04 D12 | noted in the file for the next pass; not changed | S04 D12; `REVIEW-COVERAGE-2026-09-18.md` section 5 row 66 | no
S12 | Limits, `UNVERIFIED:` answers preserved across a depth change | Whether the record keeps answers when depth rises | checked: no idea or answer collection exists in the data model. Data-model row needed (idea record with answers by question id and depth) | `[O]` `grep -n -i "idea\|answer" docs/pack/21-DATA-MODEL.md` | no
S05 | line 35, `[X]` font and size conflict (not a `D` row) | Plan and `SCREENS.md` put font and size behind More | resolved (proposed 18 Sep, founder review): closed, both sources now agree with the review; table kept as the record | `[O]` `docs/mvp0/PRODUCT-PLAN.md` section 5, `docs/mvp0/SCREENS.md:95` | no
S04, S09, S12 | `[X]` notes at S04:122, S09:81, S12:94 (not `D` rows) | Collapsible names, badge vocabulary, seven templates | each already points at its `D` row, resolved above as D11, D25 and D34a | the `D` rows | see D11
S13 | D37a | Rewrite cap per blueprint, session or idea? | resolved (proposed 18 Sep, founder review): per blueprint run, `rewritesUsed` on the idea record; only a new run resets it. Matches S14 `D31` | `53-PRICING-AND-ENTITLEMENTS.md:77`; `28-CONFIGURATION-PANEL-SPEC.md:152` | no
S13 | D38a | What sets the question count, and is it visible? | resolved (proposed 18 Sep, founder review): the generating call, range-checked 10 to 15 by the server; out of range takes the existing `E086` fallback; visible through `K.s13.progress.count` | `SCREEN-CHANGES-2026-09-18.md:111`; `17-ERROR-AND-REFUSAL-CATALOGUE.md:313` | no
S13 | D39a | Can a person go back and change an answer? | resolved (proposed 18 Sep, founder review): yes; a changed branching answer rewrites only unanswered questions and counts once. Register rows needed: Back control in `C108` (`14`), its copy (`16`), an acceptance criterion (`19`) | S13's never-lose-an-answer and never-rewrite-answered rules | no
S13 | Limits, `UNVERIFIED:` costing table | The dynamic-question costing | checked in part: internally consistent (same implied baseline across rows). Still `UNVERIFIED:`, needs the model price used and a measured baseline | `[O]` `python3` over the three rows | no
S13 | Limits, `UNVERIFIED:` no Back control intended | Whether a Back control is intended | closed by D39a: Back is added; the generator drawing needs updating | D39a | no

## 2. For the coordinator: rows this pass needs and did not add

Register | Row needed | From
`16-COPY-DECK.md` | group headings for the S06 target picker | S06 D16
`16-COPY-DECK.md` and `14-COMPONENT-INVENTORY.md` | a "divergent on purpose" relationship string and state on `C135` | S11 D32a
`16-COPY-DECK.md` | the More chip on the S12 template row | S12 D34a
`14`, `16` and `19` | a Back control in `C108`, its copy, and a criterion for the changed-answer rule | S13 D39a
Defect register | `LoginScreen.tsx:141` renders a password form, against `A001` | S01 limits
Defect register | `AIMenu.tsx` splices a kept range with no re-check, and rewrites the whole file for Summarise, Suggest links and an unselected Refine | S06 and S07 limits
`21-DATA-MODEL.md` | an owner display name a collaborator can read, and a per-person recent record | S03 limits
`21-DATA-MODEL.md` | an idea record with answers by question id and the depth; where a generated template lives | S12 D35a and limits
`66-FORMAT-SPECIFICATIONS.md` | homes for the project dictionary and the front matter schema beside `.markdownlint.jsonc` | S10 D30a
Other agents' files | `docs/mvp0/SCREENS.md:129` still calls the Writing segment a model's opinion | S10 D28

## 3. Counts

Counted from the rows in section 1.

Kind | Count
`D` rows in S01 to S13 | 36
Resolved, proposed for founder review | 34
Marked needs founder | 2, S04 D01 (brand) and S04 D11 (the word "Commands")
Non-`D` open points closed | 3: the S05 font conflict; the three `[X]` notes, pointed at their `D` rows; the S01 wordmark note, carried with D01 and needing the founder
Found while resolving, logged only | 2: the S04 rail-foot button, and the S12 Ideas rail
`UNVERIFIED:` claims checked | 16
Confirmed as written | 3: S04 Shortcuts, S08 licences, S11 studies
False or corrected | 9: S01, S03, S05, S06, S07, S10 counts, S11 cap, S11 counts, S12
Still `UNVERIFIED:`, with a named need | 3: S02 folder drag, S09 flow site, S13 costing
Closed by a decision instead | 1: S13 Back control, by D39a

## 4. Limits of this log

- **Front matter `verified_against` was left at `0af3c90`** on all thirteen screens. Only the lines
  named above were re-checked, at `e0f6f89`, and moving the key would claim the rest was too.
- **Nothing was run beyond reading.** No screen was regenerated, and `npm run verify` was not run.
- **Resolutions are proposals.** None is `[Z]`. The founder's answers quoted in S12 D36a and S02 D07
  are his, recorded elsewhere, and are cited rather than restated as new decisions.
- **What would falsify it:** a founder answer that reverses any `resolved` row, which then changes
  that screen's resolution line, not this log alone.
