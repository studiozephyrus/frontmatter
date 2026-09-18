---
id: 10-FEATURE-REGISTER
title: Feature register
mode: reference
tier: canonical
status: living
updated: 2026-09-18
owner: sagnik
verified_against: 0af3c90
covers: [features, F101-F280, AF001-AF077]
---

# 10. Feature register

**This file is the one home for every feature id.** A screen carries feature ids. An acceptance
criterion tests a feature id. A copy string belongs to a screen, and the screen belongs to a
feature. Nothing else may define what `F1NN` means.

## 0. Read this before using any id

Four things, and the first one is a correction to what this file was commissioned to say.

1. **`F001` to `F077` in the plan and the guide are audit findings, not features.** They are the
   findings register of the 17 September audit. See section 4 for the evidence and section 5 for
   the crosswalk. **Product features in this pack start at `F101`.** No feature will ever carry a
   number below 101, so a `(F0NN)` anywhere in the corpus can never be mistaken for a feature.
2. **`status: shipped` means the code exists at commit `0af3c90`**, which is the prototype on a
   single GitHub repository. It does not mean the feature is finished against the plan. Most
   shipped rows are rebuilt on the new stack in phases A, B and D of `docs/mvp0/PRODUCT-PLAN.md` section 25.
3. **The acceptance column is joined to `19-ACCEPTANCE-CRITERIA.md`, and every row now has a
   criterion.** That file was written in parallel against provisional slugs such as `F-signin`, and
   its section 0.2 asked this register to swap in the numeric ids. Section 7 below is that swap. On
   18 September 43 cells still read `none yet`. They now point at `19` section 12a, where 21 were
   already covered, or at `19` section 12b, written for the other 22. `none yet` stays the marker for
   a hole, and a validator should count it.
4. **Some `spec file` cells point at a screen file that is not written yet.** `12-screens/` was
   filling while this register was being made, from none to thirty-five inside two hours, so no
   count here would survive the afternoon. Check with
   `for i in $(seq -w 1 38); do [ -f docs/pack/12-screens/S$i.md ] || echo S$i; done`. The path is
   the contract either way. Section 8 lists the three pack files this register needs and the pack
   does not have at all.

## 1. How a row is filled

Column | Rule
`id` | `F` plus three digits, from 101. Never reused, never renumbered. Insert with a suffix letter
`name` | Two to five words. The thing, not the screen
`one line` | What it does, in one sentence a contractor can build from
`plan` | `Free`, `Pro`, `Free+Pro` where a cap differs, `Founder` for the configuration panel, `Later` for an unpriced future tier
`screens` | Every screen id that carries it, from `11-SCREEN-INDEX.md`
`spec file` | Where the detail lives. `12-screens/SNN.md` for a surface, `specs/engine/` for an engine rule
`acceptance` | Ids into `19-ACCEPTANCE-CRITERIA.md`
`status` | `planned`, `building`, `shipped`, `withdrawn`

**Evidence for the `plan` column** is `docs/mvp0/PRODUCT-PLAN.md` section 3 for the rule and section 13 of
the same file for every cap.

**Evidence for `status: shipped`** is a file under `src/` named in section 6. Nothing is marked
shipped on memory.

## 2. The register

id | name | one line | plan | screens | spec file | acceptance | status
`F101` | Sign in with Google | One tap through Firebase Auth, no password and no captcha, as the front door | Free | S01 | 12-screens/S01.md | A001-A007 | building
`F102` | Sign in with GitHub | The second provider on the same one-tap door, through Auth.js | Free | S01 | 12-screens/S01.md | A001-A007 | shipped
`F103` | The no-friction promise | No password, no puzzle, no tour, stated in the fine print and held everywhere | Free+Pro | S01 | 12-screens/S01.md | A001-A007 | building
`F104` | Public legal pages | Privacy, Terms, Pricing and Refunds serve without an account | Free+Pro | S01, S18 | 12-screens/S01.md | A001-A007, A205, A206 | building
`F105` | Home, first run | Five ways to start, the free caps named once, and a drop hint | Free | S02 | 12-screens/S02.md | A008, A200 | planned
`F106` | Home, returning | Recent documents with project, opened and owner, and a usage pill | Free+Pro | S03 | 12-screens/S03.md | A519-A522, A524, A525 | planned
`F107` | The three home tabs | Documents, Ideas and Shared with me, with a count on Ideas | Free+Pro | S02, S03 | 12-screens/S03.md | A522 | planned
`F108` | Account settings | Ten sections, stored on the account so every device agrees | Free+Pro | S28 | 12-screens/S28.md | A663-A667 | shipped
`F109` | Appearance and dark mode | One header toggle on the dark tokens in globals.css, remembered on the account | Free+Pro | S27, S28 | 12-screens/S27.md | A656-A662 | shipped
`F110` | Roles and permissions | The role matrix of plan section 19, applied to every shared document | Free+Pro | S17, S20 | 12-screens/S17.md | A729-A733 | planned
`F111` | Markdown mode | A CodeMirror surface over the byte-exact file, with vim keys available | Free | S04 | 12-screens/S04.md | A030-A040, A203, A204 | shipped
`F112` | Doc mode | A Google Docs shaped surface over the same file, with a paper surface and a ruler | Free | S05 | 12-screens/S05.md | A041-A043 | planned
`F113` | Four view modes | Edit, Live, Reading and Split, from one mode segment | Free | S04, S05 | 12-screens/S04.md | A030-A040 | shipped
`F114` | The first-level toolbar | Style, bold, italic, underline, strikethrough, lists, checklist, image, table, link, comment, page break | Free | S04, S05 | 12-screens/S05.md | A030-A040 | building
`F115` | Font controls in Doc mode | A small set of fonts with size, colour, highlight and alignment, all behind More | Free | S05 | 12-screens/S05.md | A041-A043 | planned
`F116` | Document tabs | Several open documents across the top, with a dirty mark | Free | S04 | 12-screens/S04.md | A030-A040 | shipped
`F117` | The file tree | Projects and folders on the left, with rename, move, delete and a context menu | Free | S04 | 12-screens/S04.md | A030-A040 | shipped
`F118` | Add file | One left-rail button opening New document, Upload files, Upload a folder and Import from | Free | S04, S22 | 12-screens/S04.md | A526, A527 | planned
`F119` | Add idea | The second left-rail button, and the only other one | Free | S04, S12 | 12-screens/S04.md | A526 | planned
`F120` | Ideas as a tree section | A collapsed section at the foot of the tree, Notes open and Ideas shut | Free | S04, S12 | 12-screens/S04.md | A529 | planned
`F121` | Drop anywhere | The whole workspace is a drop target for a file or a folder, with the hint always visible | Free | S04, S22 | 12-screens/S22.md | A120-A123 | building
`F122` | The right rail | Outline, tags, backlinks, bookmarks and comments, every collapsible closed and at the top | Free | S04 | 12-screens/S04.md | A030-A040 | shipped
`F123` | Outline | Headings of the open document, clickable, with the active heading marked | Free | S04 | 12-screens/S04.md | A030-A040 | shipped
`F124` | Backlinks | Every document that links to this one, listed with its context | Free | S04 | 12-screens/S04.md | A030-A040 | shipped
`F125` | Unlinked mentions | Documents that name this one without linking to it | Free | S04 | 12-screens/S04.md | A734, A735 | shipped
`F126` | Tags | Tags read from front matter and body, with rename and merge | Free | S04 | 12-screens/S04.md | A736-A738 | shipped
`F127` | Bookmarks | A per-account list of pinned documents | Free | S04 | 12-screens/S04.md | A739, A740 | shipped
`F128` | Properties panel | The front matter of the open document as an editable panel, nested YAML included | Free | S05 | 12-screens/S05.md | A041-A043 | shipped
`F129` | Wikilinks | `[[target]]` resolved against the project, with a rename that relinks | Free | S04 | 12-screens/S04.md | A030-A040 | shipped
`F130` | Transclusion | `![[target]]` renders the other document inline, with a depth guard | Free | S04 | 12-screens/S04.md | A030-A040 | shipped
`F131` | Editable tables | A rendered table whose cells edit in place and splice back into the file | Free | S04, S08 | 12-screens/S08.md | A045, A046 | shipped
`F132` | Slash commands | A menu at the caret for blocks, templates and the citation lookup | Free | S04 | 12-screens/S04.md | A030-A040 | shipped
`F133` | Command palette | Every command by name, from the keyboard | Free | S04 | 15-INTERACTION-AND-KEYBOARD.md | A030-A040 | shipped
`F134` | Ranked search | Full-text search across the project, ranked, with a preview | Free | S04 | 12-screens/S04.md | A030-A040 | shipped
`F135` | Templates | A template applied on creation, with variables substituted | Free | S02, S04 | 12-screens/S04.md | A741-A743 | shipped
`F136` | Daily notes and calendar | A month panel and a dated note created on demand | Free | S04 | 12-screens/S04.md | A744-A746 | shipped
`F137` | Tasks and checklists | Checkbox items that toggle from the rendered view and write back | Free | S04, S08 | 12-screens/S08.md | A045, A046 | shipped
`F138` | Trash | Deletes go to a trash with a 30-day window on both plans | Free+Pro | S04 | 12-screens/S04.md | A523 | shipped
`F139` | Image paste and resize | Paste an image, resize it, compress it, and store it beside the document | Free | S04 | 12-screens/S04.md | A747, A748 | building
`F140` | Browser spellcheck | The browser's own spellcheck, named as such in settings | Free | S10, S28 | 12-screens/S28.md | A749, A750 | planned
`F141` | Project dictionary | Words this project accepts, so spelling stops crying wolf | Free | S10 | 12-screens/S10.md | A070-A073 | planned
`F142` | Table of contents marker | A `[toc]` marker that renders the outline in place | Free | S04 | 66-FORMAT-SPECIFICATIONS.md | A751, A752 | planned
`F143` | Footnotes | Markdown footnotes rendered and exported | Free | S04 | 12-screens/S04.md | A753-A755 | building
`F144` | Emoji input | An emoji picker at the caret | Free | S04 | 12-screens/S04.md | A756, A757 | planned
`F145` | Link previews | A card for an external link, fetched once and cached | Free | S04 | 12-screens/S04.md | A758-A760 | planned
`F146` | OCR search | Text inside images and PDFs made searchable, on the device | Free | S04 | 12-screens/S04.md | A761, A762 | planned
`F147` | Citations | A DOI lookup in the slash menu that writes a formatted reference | Free | S04 | 12-screens/S04.md | A763-A765 | planned
`F148` | Formatter | One command that normalises the markdown without changing meaning | Free | S10 | specs/engine/splice-writer.md | A070-A073 | planned
`F149` | Quick capture | A global shortcut, and the phone share sheet, both landing in one inbox note | Free | S26 | 12-screens/S26.md | A647-A653, A655 | planned
`F150` | The AI writing box | One box on an empty document, with four chips and a second row of ways to start | Free+Pro | S06 | 12-screens/S06.md | A050-A052 | building
`F151` | The box names its target | The first line says whether it is writing, editing a named document, or working on a named idea | Free+Pro | S06 | 12-screens/S06.md | A050-A052 | planned
`F152` | The box follows the content | It anchors below the content when there is room and to the right when there is not | Free+Pro | S06 | 12-screens/S06.md | A050-A052 | planned
`F153` | Pinned idea context | While an idea is in progress its line is pinned and does not scroll away | Free+Pro | S06, S13 | 12-screens/S06.md | A050-A052 | planned
`F154` | Cost stated before the click | The credit price and the remaining balance are shown before anything is spent | Free+Pro | S06, S07, S29 | 12-screens/S06.md | A063 | planned
`F155` | AI edit on a selection | Seven verbs on a selection, the suggestion shown in place | Free+Pro | S07 | 12-screens/S07.md | A053-A056 | building
`F156` | Accept and reject in place | Equal weight, next to the suggestion, and nothing is written until accepted | Free+Pro | S07, S20 | 12-screens/S07.md | A053-A056 | shipped
`F157` | Ghost text | A completion as you type, off by default, switched on in settings | Free+Pro | S04, S28 | 12-screens/S28.md | A060 | shipped
`F158` | The provider is named | The AI menu says which provider the month runs on | Free+Pro | S07, S32 | 12-screens/S07.md | A057-A059 | planned
`F159` | The free provider chain | Groq, Cloudflare Workers AI, Cerebras while its trial lasts, then SambaNova, in fallback order | Free | S07, S32, S36 | 27-MODEL-ROUTING-SPEC.md | A057-A059, A064 | building
`F160` | Claude routing for Pro | Haiku 4.5 for edits and Sonnet 5 through the batch API for blueprints | Pro | S07, S36 | 27-MODEL-ROUTING-SPEC.md | A057-A059 | planned
`F161` | AI unavailable | The document untouched, nothing charged, and the status of every provider in the chain | Free+Pro | S32 | 12-screens/S32.md | A057-A059 | planned
`F162` | Mark AI text | Every AI edit recorded as a mark in the version record, never in the file | Free+Pro | S21, S28 | 12-screens/S21.md | A061, A062 | planned
`F163` | Local model on the desktop | Medium and High depth and AI edit run on the machine, with nothing leaving it | Free+Pro | S24, S25 | 12-screens/S25.md | A130-A132 | planned
`F164` | Bring your own key | A person supplies their own model key, behind a flag | Free+Pro | S28, S37 | 12-screens/S37.md | A766-A770 | planned
`F165` | The problems panel | Broken links, heading skips, missing alt text and table shape, each true of this document | Free | S10 | 12-screens/S10.md | A070-A073 | building
`F166` | Checks and writing split | A filter across the top so a deterministic finding and a model's opinion never share a list | Free | S10 | 12-screens/S10.md | A070-A073 | planned
`F167` | Front matter schema check | The document's front matter checked against the project's schema | Free | S10 | 66-FORMAT-SPECIFICATIONS.md | A070-A073 | planned
`F168` | Fix all safe | One action applying only the fixes that cannot change meaning | Free | S10 | 12-screens/S10.md | A070-A073 | planned
`F169` | Link doctor | Broken and ambiguous links found and offered a target | Free | S10 | 12-screens/S10.md | A070-A073 | shipped
`F170` | Accessibility check | The document checked on the device against level AA of WCAG 2.2, and against IS 17802 | Free | S10 | 46-ACCESSIBILITY-SPEC.md | A201, A202 | planned
`F171` | The instruction-file set | Every instruction file in the project, not one AGENTS.md, with a health panel each | Free | S11 | 12-screens/S11.md | A074, A075 | planned
`F172` | Instruction-file health | Imported not copied, size under the 32 KiB cap, setup commands present, claims dated | Free | S11 | 12-screens/S11.md | A074, A075 | planned
`F173` | Tidy this file | One credit rewrites an instruction file into the shape the health panel wants | Free+Pro | S11 | 12-screens/S11.md | A771-A775 | planned
`F174` | Mermaid diagrams | A fenced `mermaid` block rendered in every mode and on the published page | Free | S08 | 66-FORMAT-SPECIFICATIONS.md | A045, A046 | shipped
`F175` | KaTeX maths | Inline and block maths rendered in every mode | Free | S08 | 66-FORMAT-SPECIFICATIONS.md | A045, A046 | shipped
`F176` | Callouts | A `> [!kind]` callout rendered as a box, and the carrier for every render note | Free | S08 | 66-FORMAT-SPECIFICATIONS.md | A045, A046 | shipped
`F177` | Details block | A collapsible block, the carrier for Notion's toggle | Free | S08 | 66-FORMAT-SPECIFICATIONS.md | A045, A046 | shipped
`F178` | Code fences | Fenced code with language highlighting, and the carrier for opaque data | Free | S08 | 66-FORMAT-SPECIFICATIONS.md | A045, A046 | shipped
`F179` | Excalidraw block | A drawing saved beside the document as JSON Canvas 1.0 | Free | S08, S12 | 66-FORMAT-SPECIFICATIONS.md | A776-A778 | planned
`F180` | Chart from a table | An `fm-chart` block that points at the table above it | Later | S08 | 66-FORMAT-SPECIFICATIONS.md | A554, A555, A558, A559 | planned
`F181` | Flow view | An H2 is a phase, an H3 a step, a bracketed first word the tag, a trailing line the reference | Free | S09 | 66-FORMAT-SPECIFICATIONS.md | A044 | planned
`F182` | Slides view | Marp core, splitting on a horizontal rule, with no new syntax | Free | S09 | 66-FORMAT-SPECIFICATIONS.md | A044 | planned
`F183` | Mind map view | markmap over the outline, with no new syntax | Free | S09 | 66-FORMAT-SPECIFICATIONS.md | A044 | planned
`F184` | Kanban view | Headings as columns and task items as cards, the obsidian-kanban shape and none of its code | Later | S09 | 66-FORMAT-SPECIFICATIONS.md | A044 | planned
`F185` | Outline view | The document as headings only | Free | S09 | 12-screens/S09.md | A044 | building
`F186` | The project map | Documents, what each governs, the decisions behind them and the instruction file, as a graph | Free | S16 | 12-screens/S16.md | A095 | shipped
`F187` | The map is rebuilt on save | Derived from the files on every save, so it costs no credits | Free | S16 | 12-screens/S16.md | A095 | building
`F188` | The ideas tab | Ideas listed with their state: draft, decided so far, blueprint version | Free+Pro | S12, S34 | 12-screens/S12.md | A080-A089 | planned
`F189` | The depth selector | Low, Medium and High as one selector, the way a model selector reads, not three routes | Free+Pro | S12, S13, S14 | 12-screens/S12.md | A080-A089 | planned
`F190` | Generated question set | Ten to fifteen questions planned in one call from the idea, four to a page at most | Free+Pro | S13, S14 | 12-screens/S13.md | A080-A089 | planned
`F191` | Branching rewrite | Only an answer to a question flagged as branching rewrites the later pages | Free+Pro | S13 | 12-screens/S13.md | A080-A089 | planned
`F192` | The rewrite is shown | The affected card blurs and names the answer that caused it, and only when a rewrite fires | Free+Pro | S13 | 12-screens/S13.md | A080-A089 | planned
`F193` | Rewrite cap | Three rewrites a blueprint on Free, unbounded on Pro | Free+Pro | S13, S35 | 53-PRICING-AND-ENTITLEMENTS.md | A080-A089 | planned
`F194` | Standard question set | The fallback when the model layer is degraded or the person is over their cap | Free+Pro | S13, S32 | 12-screens/S13.md | A080-A089 | planned
`F195` | Skip and recommend | Skip and Choose the recommendation on every page, Skip all from page two behind a plain modal | Free+Pro | S13, S14 | 12-screens/S13.md | A080-A089 | planned
`F196` | Not sure stays open | The question is recorded open in DECISIONS.md and the recommendation is taken for now | Free+Pro | S13, S14 | 12-screens/S13.md | A080-A089 | planned
`F197` | Decision cards | Where it stands, what forces the choice, options with gains and costs, evidence rows, the recommendation | Pro | S14 | 12-screens/S14.md | A080-A089 | planned
`F198` | High-depth research pass | A background research pass before the questions, opening pages rather than citing a template | Pro | S14 | 12-screens/S14.md | A080-A089 | planned
`F199` | Industry templates | A template for the industry, or one generated for it | Free+Pro | S12 | 12-screens/S12.md | A779-A781 | planned
`F200` | Attach to an idea | A drawing, a document or a repository attached as input to the blueprint | Free+Pro | S12 | 12-screens/S12.md | A588 | planned
`F201` | The fifteen-file blueprint | SKILL.md first, AGENTS.md, the numbered documents including the frontend spec, specs, DECISIONS.md, MAP.md, graph.json, the manifest and checksums | Free+Pro | S15 | 12-screens/S15.md | A090-A094 | planned
`F202` | Consistency check | The kit checked against itself before the person sees it | Free+Pro | S15 | 12-screens/S15.md | A090-A094 | planned
`F203` | The unlisted link | The kit served at a link nobody can guess and nothing indexes | Free+Pro | S15 | 12-screens/S15.md | A090-A094 | planned
`F204` | Out-of-band hash | A SHA256 printed on the page, which the kickoff prompt checks before unpacking | Free+Pro | S15 | 12-screens/S15.md | A090-A094 | planned
`F205` | The kickoff prompt | A prompt for Claude Code, Cursor or Codex that verifies the tarball, then reads before it builds | Free+Pro | S15 | 12-screens/S15.md | A090-A094 | planned
`F206` | Blueprint versions | Edit the answers and publish v2, with the earlier version kept | Free+Pro | S15, S21 | 12-screens/S15.md | A600 | planned
`F207` | Ideas empty state | What a blueprint is, the three depths in a line each, and one hand-made kit to read first | Free | S34 | 12-screens/S34.md | A200 | planned
`F208` | People on a document | Added by their frontmatter email address, with a role | Free+Pro | S17 | 12-screens/S17.md | A100-A102 | planned
`F209` | Invite a non-user | The screen says the address is not an account and offers an invite | Free+Pro | S17 | 12-screens/S17.md | A100-A102 | planned
`F210` | Invite credits | Both sides get about five AI credits when the invited person first signs in | Free+Pro | S17 | 53-PRICING-AND-ENTITLEMENTS.md | A610 | planned
`F211` | Referral modal | The same modal reused for referrals once the invited person has an account | Free+Pro | S17 | 12-screens/S17.md | A611 | planned
`F212` | Read and edit links | A link that reads or edits, free on both plans | Free+Pro | S17 | 12-screens/S17.md | A100-A102 | shipped
`F213` | Expiring links | A seven-day default with no upper bound, free on both plans | Free+Pro | S17 | 12-screens/S17.md | A100-A102 | planned
`F214` | Password links | A hash stored, asked once per browser, on Pro | Pro | S17, S18 | 12-screens/S17.md | A100-A102 | planned
`F215` | Published page | A page at frontmatter.in/p/slug that renders with no gate, no redirect and no probe | Free+Pro | S18 | 12-screens/S18.md | A103-A107 | shipped
`F216` | The markdown twin | `page.md` beside every published page, never gated and never redirected | Free+Pro | S18 | 66-FORMAT-SPECIFICATIONS.md | A103-A107 | planned
`F217` | llms.txt | An agent-readable index, under the same absolute no-gate rule as `page.md` | Free+Pro | S18 | 66-FORMAT-SPECIFICATIONS.md | A103-A107 | planned
`F218` | The open-in bar | After first paint, a dismissible offer to open in the app, with dismissal remembered | Free+Pro | S18 | 12-screens/S18.md | A103-A107 | planned
`F219` | The branding line | A Made with frontmatter line on Free, removed on Pro | Free+Pro | S18, S29 | 53-PRICING-AND-ENTITLEMENTS.md | A103-A107 | planned
`F220` | The public footer | Report, Privacy, Terms and the `.md` twin on every published page | Free+Pro | S18 | 12-screens/S18.md | A103-A107 | building
`F221` | Live collaboration | Presence avatars, a named cursor, and the other person's text highlighted as it lands | Free+Pro | S19 | 12-screens/S19.md | A108, A109 | planned
`F222` | One collaborator on Free | One person per document on Free, several on Pro, decided on cost | Free+Pro | S19, S35 | 53-PRICING-AND-ENTITLEMENTS.md | A108, A109 | planned
`F223` | The change queue | Every change by a person, an AI edit or an agent waits to be accepted or rejected, one by one | Free+Pro | S20 | 12-screens/S20.md | A110-A113 | planned
`F224` | People and machines split | A filter across the top so human work and machine work are never one list | Free+Pro | S10, S20 | 12-screens/S20.md | A110-A113 | planned
`F225` | Accept all is bounded | Accept all applies only to a named person's edits and confirms the count first | Free+Pro | S20 | 12-screens/S20.md | A110-A113 | planned
`F226` | Changed spans highlighted | The waiting change is shown in the document, not only in the list | Free+Pro | S20 | 12-screens/S20.md | A110-A113 | planned
`F227` | Document history | Every version with its author, including the AI edit and the blueprint write | Free+Pro | S21 | 12-screens/S21.md | A114, A115 | shipped
`F228` | Diff and restore | A diff against the current version, then restore or copy as a new document | Free+Pro | S21 | 12-screens/S21.md | A114, A115 | shipped
`F229` | History window | Seven days on Free, ninety on Pro | Free+Pro | S21, S35 | 53-PRICING-AND-ENTITLEMENTS.md | A114, A115 | planned
`F230` | The portfolio | One `portfolio.md` served at frontmatter.in/@handle with no build step | Pro | S30 | 12-screens/S30.md | A673-A678 | planned
`F231` | Conflict screen | Two versions side by side with author, device and time, and nothing merged | Free+Pro | S31 | 12-screens/S31.md | A128, A129 | building
`F232` | Keep left, right or both | The three resolutions, with the other version always kept in history | Free+Pro | S31 | 12-screens/S31.md | A128, A129 | building
`F233` | Let AI decide | Offered beside the others, and its merge enters the change queue rather than the file | Free+Pro | S31 | 12-screens/S31.md | A128, A129 | planned
`F234` | Drop a folder | A folder keeps its structure and becomes a project | Free | S22 | 12-screens/S22.md | A120-A123 | building
`F235` | Import from Obsidian | A vault imported with its wikilinks and attachments intact | Free | S22 | 12-screens/S22.md | A120-A123 | planned
`F236` | Import from Notion | A Notion export imported, with the 27 covered block types carried | Free | S22 | 12-screens/S22.md | A120-A123 | planned
`F237` | Import from Google Docs | Exported as `text/markdown`, and refused above 10 MB with the reason | Free | S22 | 12-screens/S22.md | A120-A123 | planned
`F238` | Import from Word | A `.docx` converted to markdown, with what needs a look named | Free | S22 | 12-screens/S22.md | A120-A123 | planned
`F239` | Import progress panel | What was kept byte for byte, what was uploaded, and what needs a look | Free | S22 | 12-screens/S22.md | A120-A123 | planned
`F240` | Export | Markdown, HTML, Word and PDF from one menu | Free+Pro | S04, S28 | 12-screens/S04.md | A116 | shipped
`F241` | Export the whole project | Every document and attachment as one archive | Free+Pro | S28 | 12-screens/S28.md | A116 | shipped
`F242` | GitHub connection | A GitHub App with the Contents permission, writing only under `docs/`, enforced server-side | Free+Pro | S23 | 12-screens/S23.md | A124, A125, A023 | building
`F243` | GitHub push quota | Twenty pushes and one repository on Free, unlimited on Pro | Free+Pro | S23, S35 | 53-PRICING-AND-ENTITLEMENTS.md | A124, A125 | planned
`F244` | Google Drive sync | Two-way sync of the files the app created or you picked, on the `drive.file` scope, polled every five minutes | Free | S23 | 12-screens/S23.md | A126, A127 | planned
`F245` | Connections screen | Each connection with its scope, its conflict rule, and change, pause and disconnect | Free+Pro | S23 | 12-screens/S23.md | A635-A637 | planned
`F246` | The agents card | The MCP server and the API, named as Later on the connections screen | Later | S23 | 12-screens/S23.md | A638 | planned
`F247` | Offline in the browser | Every keystroke to IndexedDB or the origin private file system | Free+Pro | S24 | 12-screens/S24.md | A130-A132 | shipped
`F248` | The offline banner | Last synced time, changes waiting, and AI edit disabled with a one-line reason | Free+Pro | S24 | 12-screens/S24.md | A130-A132 | planned
`F249` | Never the only copy | Persist requested inside a user gesture, and the first connection pushes everything up | Free+Pro | S24 | 67-SYNC-AND-CONFLICT.md | A130-A132 | planned
`F250` | The desktop app | Tauri v2, files on disk, fully offline, no document cap, and the folder readable by agents | Free+Pro | S25 | 12-screens/S25.md | A133 | building
`F251` | The watched folder | An agent editing a file on disk feeds the change queue | Free+Pro | S20, S25 | 12-screens/S25.md | A782-A784 | planned
`F252` | Desktop signing | Signed on the Apple programme, Linux unsigned by choice, Windows shown as coming | Free+Pro | S25 | 35-RELEASE-AND-VERSIONING.md | A645, A646 | planned
`F253` | The phone layout | A 52 px bar, the editor full width, and the tree and right pane as drawers | Free+Pro | every screen | 12-screens/S04.md | A134, A135 | shipped
`F254` | The bottom bar | Home, Search, AI, Outline and More, five destinations at thumb height | Free+Pro | every screen | 15-INTERACTION-AND-KEYBOARD.md | A134, A135 | planned
`F255` | Progressive web app | Installable, with the share target on Android and its absence on iOS said plainly | Free+Pro | S22, S26 | 12-screens/S26.md | A654 | building
`F256` | Protocol handler | The desktop app registers a handler so the open-in bar can offer it | Free+Pro | S18, S25 | 12-screens/S18.md | A785-A787 | planned
`F257` | The entitlements layer | One place that answers what this account may do, read from the configuration panel | Free+Pro | S29, S33, S35 | 53-PRICING-AND-ENTITLEMENTS.md | A140-A143 | planned
`F258` | The usage ledger | Every credit spent, against which model, and what it cost us | Free+Pro | S29, S38 | 53-PRICING-AND-ENTITLEMENTS.md | A149, A150 | planned
`F259` | Usage meters | Four meters: edits, blueprints, cloud documents and published pages, with the reset date | Free+Pro | S29 | 12-screens/S29.md | A140-A143 | planned
`F260` | Over the cap | What happened, what still works, and what to do, with nothing deleted | Free+Pro | S33 | 12-screens/S33.md | A140-A143 | planned
`F261` | Downgrade is safe | Every document stays readable and exportable, and nothing new is created until under the cap | Free+Pro | S33 | 12-screens/S33.md | A140-A143 | planned
`F262` | Razorpay checkout | UPI and cards, GST inclusive, cancel any time | Pro | S29 | 53-PRICING-AND-ENTITLEMENTS.md | A670, A671 | planned
`F263` | The mandate ceiling | ₹15,000 a transaction, and one payment attempt on an Indian card | Pro | S29 | 53-PRICING-AND-ENTITLEMENTS.md | A672 | planned
`F264` | Top-ups | Fifty edits for ₹99 and three blueprints for ₹149 | Pro | S29 | 53-PRICING-AND-ENTITLEMENTS.md | A788-A792 | planned
`F265` | Plans side by side | Free and Pro on one screen, with Team and Enterprise named as coming | Free+Pro | S29 | 12-screens/S29.md | A793-A796 | planned
`F266` | Configuration, plans and limits | Every limit in one editable table, and the product reads that row rather than a constant | Founder | S35 | 12-screens/S35.md | A144-A148 | planned
`F267` | Over-cap impact before save | Saving says how many accounts the change moves over their cap, and names them | Founder | S35 | 12-screens/S35.md | A144-A148 | planned
`F268` | Per-row change history | Each row carries who changed it, from what, to what, and when | Founder | S35, S36, S37 | 12-screens/S35.md | A144-A148 | planned
`F269` | Configuration, models | The free chain in fallback order, each provider on or off, with today's pool beside it | Founder | S36 | 12-screens/S36.md | A144-A148 | planned
`F270` | Routing per call type | An edit, a document and a blueprint, each naming its model and the cost of one call | Founder | S36 | 27-MODEL-ROUTING-SPEC.md | A144-A148 | planned
`F271` | Unopened terms lock a provider | A provider whose terms nobody has opened cannot be switched on, and the row says why | Founder | S36 | 12-screens/S36.md | A144-A148 | planned
`F272` | Feature flags | Live editing, bring-your-own key, the email magic link, and default indexing of published pages | Founder | S37 | 12-screens/S37.md | A144-A148 | planned
`F273` | Locked promises | The training promise and the age floor shown, locked, with the reason on the row | Founder | S37 | 12-screens/S37.md | A144-A148 | planned
`F274` | Configuration, accounts | One account against every limit, with a time-boxed exception that does not move the plan | Founder | S38 | 12-screens/S38.md | A151 | planned
`F275` | The configuration audit log | Every setting change across the panel, newest first, read-only | Founder | S38 | 12-screens/S38.md | A144-A148 | planned
`F276` | Splice-only writing | The engine locates a byte range and replaces exactly those bytes, and refuses when the range is ambiguous | Free+Pro | every editing screen | specs/engine/splice-writer.md | A010-A020, A024 | shipped
`F277` | Zero-indent sequence refusal | A refusal rather than a guess on the front matter shape that breaks 83 per cent of foreign vaults | Free+Pro | S22 | specs/engine/nf-001-zero-indent-sequence.md | A021, A022 | shipped
`F278` | Bare carriage return refusal | A refusal rather than a guess where a lone carriage return inside a fence would destroy a set | Free+Pro | S22 | specs/engine/nf-003-bare-cr-fence.md | A021, A022 | shipped
`F279` | The projection law | The file on disk is the only source of truth, and every view is a stateless projection of it | Free+Pro | every screen | 20-ARCHITECTURE.md | A010-A020, A024 | shipped
`F280` | No silent merge | Nothing reaches the file without a person accepting it, in any flow including conflict resolution | Free+Pro | S20, S31 | 67-SYNC-AND-CONFLICT.md | A010-A020, A024 | planned

**Count: 180 features, F101 to F280.** Re-derived at write time with
`grep -c '^`F[0-9]' docs/pack/10-FEATURE-REGISTER.md`.

## 3. Status counts

Status | Count | What it means here
`shipped` | 45 | A file under `src/` implements it at `0af3c90`. Most are rebuilt in phases A, B and D
`building` | 20 | Part of it exists in code and the rest is specified
`planned` | 115 | Specified in the plan, nothing in code
`withdrawn` | 0 | No feature has been withdrawn yet. See section 4 for what was withdrawn as a claim

Coverage | Count | Command
Has at least one acceptance criterion | **180** | `grep -cE '^`F[0-9]{3}` \|.*\| A[0-9]{3}[^|]*\| (planned\|building\|shipped)$' <this file>`
Has none | **0** | `grep -cE '^`F[0-9]{3}` \|.*\| none yet \| (planned\|building\|shipped)$' <this file>`

**These counts are derived, not carried.** Re-derive at write time with the command that produced
them, which matches only the eight-column register rows and not the prose that mentions an id:

```
grep -E '^`F[0-9]{3}` \| .* \| (planned|building|shipped|withdrawn)$' \
  docs/pack/10-FEATURE-REGISTER.md | sed 's/.*| //' | sort | uniq -c
```

## 4. Disagreements

Five, and the first is the reason this file could not be written as commissioned.

### 4.1 `F001` to `F077` are audit findings, not features

**The brief for this file said** that `F001` to `F070` appear in both `docs/mvp0/PRODUCT-PLAN.md`
and `docs/mvp0/PRODUCT-GUIDE.md`, and that this is one fact with two homes.

**What the grep actually found.** The ids are references to the findings register of the audit of
17 September. The evidence, all of it checkable:

- `verify/2026-09-17/CLAUDE-AUDIT-FINDINGS.jsonl` exists, 86,652 bytes, one object per finding.
- `verify/2026-09-17/CLAUDE-AUDIT-BRIEF-v1-2026-09-17.md:394` reads "Every finding, numbered F001
  upward: severity, angle, location". Checked with `sed -n '394p'`.
- `verify/2026-09-17/CLAUDE-AUDIT-REPORT.md:83` is the heading `### F001 (A9). 100 edits and 5
  blueprints on Sonnet 5 cost about ₹120 of a ₹299 month at list price`.
- `verify/2026-09-17/CLAUDE-KICKOFF-v5-2026-09-17.md:33` names the response file as "one row per
  finding F001 to F077".

**So the two files do not disagree with each other about a feature.** They are the same prose,
carrying the same finding references, and the guide is a longer cut of the plan. The real problem
is a namespace collision with `docs/pack/65-CONVENTIONS.md:50`, which gives `F` plus three digits to features
and names this file as their home.

**The resolution taken here, and it is a decision the founder can reverse only now.** Features start
at `F101`. `F001` to `F100` are reserved and will never name a feature. Section 5 is the crosswalk.
The alternative, renumbering the findings to `AF0NN` in the plan and the guide, would edit two files
this writer does not own, and would leave every archived PDF pointing at the old form.

### 4.2 Two ids differ between the plan and the guide

The reconciliation the brief asked for, done with `grep -o 'F[0-9]\{3\}' <file> | sort -u` on both.

id | In the plan | In the guide | Reading
`F021` | absent | `docs/mvp0/PRODUCT-GUIDE.md` section 21 | The guide keeps a finding about folding bookmark, search and history into More at 1,440 px. The plan's S04 text dropped it when the right cluster was rewritten on 18 September
`F076` | `docs/mvp0/PRODUCT-PLAN.md` section 5 | absent | The plan carries the absolute no-gate rule for `page.md` and `llms.txt`. The guide predates the 18 September decision recorded in `SCREEN-CHANGES-2026-09-18.md` section 10.2

**Everything else matches.** The plan cites 70 ids, the guide cites 70, they share 69, and the union
is 71. Six numbers in the range are cited by neither: `F010`, `F014`, `F032`, `F046`, `F057` and
`F066`. They exist in the findings register and were not named in the narrative. Section 5 carries
all 71, and the counts come from
`comm -12 <(grep -o 'F[0-9]\{3\}' <plan> | sort -u) <(grep -o 'F[0-9]\{3\}' <guide> | sort -u)`.

**Which file wins.** The plan, revision 6, dated 18 September in its own section 0. The guide's
front matter and section numbering are one revision behind: the plan's section 15 is the guide's
section 25, and the plan's section 23 is the guide's section 33.

### 4.3 `F003` was narrowed, and the old form is still readable in three places

**The narrow form is the current one.** `docs/mvp0/PRODUCT-PLAN.md` section 3 reads "Every editing
feature is free", with four named exceptions: sharing controls, idea depth, identity and branding
removal. `docs/mvp0/PRODUCT-PLAN.md` section 29 records the change from the founders' original wording.

**Anything that reads "every feature free" without the word editing is stale.** The `plan` column
of section 2 is built on the narrow form. The four exceptions appear as `F214` password links,
`F189` with `F197` and `F198` for depth, `F230` the portfolio, and `F219` branding removal.

### 4.4 The shipped sign-in contradicts the front-door promise

`docs/mvp0/PRODUCT-PLAN.md` section 5 onward specifies Google and GitHub, one tap, no password. The code
at `0af3c90` ships GitHub OAuth plus a credentials provider with a password, in
`src/modules/auth/infrastructure/auth-options.ts:32`, behind a login allowlist. The Google gateway
exists at `src/modules/auth/infrastructure/firebase-auth-gateway.ts:31` but the login screen does
not offer it.

**INFERENCE:** the password provider is prototype scaffolding for a single-user vault, not a product
decision. It is recorded here because `F103` cannot be called shipped while it is reachable.

### 4.5 The plan's stack is not the shipped stack

The plan names Cloudflare R2 for bytes and Firestore for records. The composition root at
`src/container/dependency-container.ts:9` reads and writes one GitHub repository through
`githubVaultReader` and `githubWriter`, and `grep -rln 'R2_' src/` returns nothing. Every
`shipped` row in section 2 is therefore shipped against GitHub storage, not against the plan's
storage. Phase A is where that changes.

## 5. Crosswalk: the audit findings cited in the plan

**This is not a feature table.** It exists so that a reader who meets `(F0NN)` in the plan or the
guide can tell what it is without opening the audit. Ordered as the findings register orders them.

Finding | Where it is cited | What it made the plan do | Feature it touches
`AF001` | plan:49, plan:1215 | Pro's model cost re-derived, and routing moved to Haiku for edits with Sonnet through the batch API | `F160`
`AF002` | plan:56, plan:807 | Doc mode's split restated as 20 lossless, 15 extensions and 29 refused of 64 | `F112`
`AF003` | plan:239, plan:1808 | "Every feature free" narrowed to "every editing feature free" | the `plan` column
`AF004` | plan:61, plan:1120 | Craft, Docmost and the cheaper note apps added to the pricing ladder | `F265`
`AF005` | plan:50, plan:1168 | Cerebras named as the 30-day trial it is | `F159`
`AF006` | plan:50, plan:248, plan:1170 | OpenRouter's free endpoints removed from the chain until their providers' terms are opened | `F159`
`AF007` | plan:50, plan:1186 | The three free pools stated as one shared budget each | `F159`
`AF008` | plan:51, plan:254 | The legal floor restored as plan section 23, with an owner and a date per row | `F104`
`AF009` | plan:83, plan:1642 | Phase 0 and the twenty hand-made kits restored | `F201`
`AF011` | plan:57, plan:787 | Notion's block inventory stated as 27 covered of 32 | `F236`
`AF012` | plan:58 | The Obsidian plugin arithmetic corrected | `F235`
`AF013` | plan:59 | The research rounds listed by date, 244 unique pages | none
`AF015` | plan:1097 | The large-target number attributed to Material, not to Fitts | `F254`
`AF016` | plan:247, plan:1286 | The stack decision recorded as the founders' | `F279`
`AF017` | plan:66, plan:927, plan:1161 | The blueprint's token cost re-derived for fifteen files and marked assumed | `F201`
`AF018` | plan:354 | The history row reads "7 days" on Free | `F229`
`AF019` | plan:354, plan:433 | The tree shows all fifteen blueprint files | `F201`
`AF020` | plan:243, plan:363 | Font, size, colour, highlight and alignment placed behind More | `F114`, `F115`
`AF021` | guide:1019 only | Bookmark, search and history folded into More at 1,440 px | `F122`
`AF022` | plan:377, plan:421 | The rail counts are zero on an empty document, and the problems shown are true of it | `F154`, `F165`
`AF023` | plan:87, plan:256, plan:1147 | Max and the community named as Later | `F246`
`AF024` | plan:569, plan:1032 | The 10 MB Google Docs export limit stated at the point of refusal | `F237`
`AF025` | plan:66, plan:443, plan:925 | The frontend spec added to the blueprint | `F201`
`AF026` | plan:1108 | Upload caps set at 1 GB and 5 MB on Free, 10 GB and 25 MB on Pro | `F257`
`AF027` | plan:60, plan:246, plan:578, plan:1008 | The Drive quota re-derived with polling included | `F244`
`AF028` | plan:485, plan:1266 | The kickoff prompt verifies the tarball against a hash before unpacking | `F204`, `F205`
`AF029` | plan:545 | Accept all bounded to a named person's edits | `F225`
`AF030` | plan:324, plan:1378 | The muted, danger and success tokens retuned to 4.5:1 | `F170`
`AF031` | plan:1308 | What the code runs today separated from what phase A keeps | section 4.5
`AF033` | plan:524 | The published footer carries Report, Privacy, Terms and the `.md` twin | `F220`
`AF034` | plan:245, plan:579, plan:1025 | GitHub grants the whole repository, so writing only under `docs/` is our own rule | `F242`
`AF035` | plan:580 | The agents card marked Later with the MCP server | `F246`
`AF036` | plan:570 | The Android share target offered after install, and its absence on iOS said plainly | `F255`
`AF037` | plan:474 | Medium labels the template's sources with a date; only High opens pages | `F197`, `F198`
`AF038` | plan:498 | The map counts twelve markdown documents and excludes the three data files | `F186`
`AF039` | plan:589 | AI edit disabled offline with a one-line reason, local model on the desktop | `F163`, `F248`
`AF040` | plan:1282 | The Mumbai storage price recorded as irreproducible, with both readings kept | none
`AF041` | plan:1335 | Where the objects live, stated | `F279`
`AF042` | plan:67, plan:1639 | Two shortened quotations restored in full after a fabrication | none
`AF043` | plan:1377 | Material's navigation-bar rule confirmed in a rendered browser | `F254`
`AF044` | plan:309 | The `--ai` token and the code face named as missing from globals.css | `F109`
`AF045` | plan:36, plan:1322, plan:1647 | The proposal to delete `firestore.rules` withdrawn | none
`AF047` | plan:600 | The desktop download page states Mac now, Linux unsigned, Windows coming | `F252`
`AF048` | plan:628 | Spellcheck named as the browser's own | `F140`
`AF049` | plan:628 | Two AI switches, with ghost text off by default | `F157`
`AF050` | plan:1480 | Every format the plan invents or adopts carries four things | `F142`, `F216`
`AF051` | plan:638 | The price marked GST inclusive | `F262`
`AF052` | plan:647 | The portfolio's front matter keys fixed to one list | `F230`
`AF053` | plan:637 | The four meters carry a reset date | `F259`
`AF054` | plan:51, plan:317 | Privacy and Terms link to pages that serve without an account | `F104`
`AF055` | plan:85, plan:1324 | The Yjs exception restored beside the rule against conflict-free replicated data types | `F221`
`AF056` | plan:1644 | Bring-your-own key sent to the founders as question 10 | `F164`
`AF058` | plan:84, plan:249, plan:1406 | Review state declared dropped in favour of the change queue | `F223`
`AF059` | plan:61, plan:1120 | The first paid tier across peers corrected | `F265`
`AF060` | plan:86 | Obsidian Multiplayer and Obsidian for Work given risk rows | none
`AF061` | plan:62, plan:894 | The slides signal attributed to slides-from-markdown, not to Marp | `F182`
`AF062` | plan:63, plan:1063, plan:1064 | The Semantic Scholar clause withdrawn and four API conditions added | `F147`
`AF063` | plan:251, plan:404, plan:910 | The kanban and chart blocks copy the shape and none of the code | `F180`, `F184`
`AF064` | plan:64 | The Model Context Protocol described as "a Series of LF Projects, LLC" | `F246`
`AF065` | plan:65 | The decision cards counted at 210 | none
`AF067` | plan:1698 | Definitions written so two people counting cannot disagree | none
`AF068` | plan:51 | Part of the legal floor | `F104`
`AF069` | plan:51, plan:1267, plan:1353 | An append-only security log for 180 days in Indian jurisdiction | `F275`
`AF070` | plan:1617 | Third-party notices, with the OFL texts opened | none
`AF071` | plan:602, plan:1090 | Windows shown as coming until a commercial certificate is priced | `F252`
`AF072` | plan:1083 | Each target builds on its own CI runner | `F252`
`AF073` | plan:351, plan:1617 | No third button competing with Add file and Add idea | `F118`, `F119`
`AF074` | plan:373, plan:641 | The AI box names its target, and the RBI mandate ceiling | `F151`, `F263`
`AF075` | plan:457, plan:1378, plan:1615 | The rewrite blur, and the Rights of Persons with Disabilities rule 15 question | `F192`, `F170`
`AF076` | plan:522 only | `page.md` and `llms.txt` never gated, never redirected, never given an interstitial | `F216`, `F217`
`AF077` | plan:51 | Part of the legal floor | `F104`

**UNVERIFIED:** the "What it made the plan do" column summarises the cited line, not the finding's
own text in `CLAUDE-AUDIT-FINDINGS.jsonl`. A reader who needs the finding as written should open
that file. The line citations were all produced by
`grep -n 'F[0-9]\{3\}' docs/mvp0/PRODUCT-PLAN.md` in this session.

## 6. What `shipped` was checked against

Every `shipped` row above was checked by finding the file. The commands were
`find src/modules/*/presentation -name '*.tsx'`, `find src/app -name 'route.ts'`, and
`grep -rn` for the named library. The mapping, in short:

Feature block | Evidence
`F111`, `F113`, `F116` | `src/modules/editor/presentation/CodeMirrorEditor.tsx`, `src/modules/editor/presentation/editor-store.ts:21` defines the four modes
`F117`, `F138` | `src/modules/vault/presentation/FileTree.tsx`, `TrashModal.tsx`
`F122` to `F127` | `src/modules/preview/presentation/RightPane.tsx` composes Backlinks, Outline, TagsPanel, BookmarksPanel and UnlinkedMentions
`F128`, `F131` | `PropertiesPanel.tsx`, `markdown/editable-table.tsx`
`F129`, `F130` | `markdown/wikilinks.tsx`, `EmbeddedNote.tsx`
`F132` to `F137` | `slash-commands.ts`, `CommandPalette.tsx`, `SearchPanel.tsx` with `minisearch`, `template-vars.ts`, `daily-notes.ts`
`F156`, `F157`, `F169` | `ai-suggestion.ts`, `ghost-text.ts`, `LinkDoctorModal.tsx` with `/api/ai/link-doctor`
`F174` to `F178` | `mermaid-block.tsx`, `rehype-katex` in `src/modules/preview/presentation/Markdown.tsx:57`, `markdown/callout.tsx`
`F186` | `src/modules/graph/presentation/GraphView.tsx`
`F212`, `F215` | `src/app/(public)/p/[slug]/page.tsx`, `src/modules/share/presentation/ShareModal.tsx`
`F227`, `F228` | `/api/vault/history`, `/api/vault/version`, `/api/vault/restore`, `HistoryModal.tsx`
`F240`, `F241` | `ExportMenu.tsx` offers five actions, `/api/export/vault`
`F276` to `F279` | `specs/engine/splice-writer.md`, `nf-001-zero-indent-sequence.md`, `nf-003-bare-cr-fence.md`

**Not found, so not shipped:** Excalidraw, Marp and markmap return nothing from
`grep -rni 'excalidraw\|markmap\|marp' src/`. There is no R2 adapter.

## 7. The acceptance-slug swap that `19-ACCEPTANCE-CRITERIA.md` asked for

That file's section 0.2 says its feature ids are provisional slugs and that this register should swap
in the numeric ids in a single pass. This is that table. **The slug is the key, not the id**, so the
swap can be applied there without reading this whole file.

Slug | Criteria | Features it tests
`F-signin` | A001-A007 | F101, F102, F103, F104
`F-firstrun` | A008 | F105
`F-splice` | A010-A020, A024 | F276, F279, F280
`F-shapegate` | A021, A022 | F277, F278
`F-vaultwrite` | A023 | F242
`F-editor` | A030-A040 | F111, F113, F114, F116, F117, F122, F123, F124, F129, F130, F132, F133, F134
`F-docmode` | A041-A043 | F112, F115, F128
`F-views` | A044 | F181, F182, F183, F184, F185
`F-blocks` | A045, A046 | F131, F137, F174, F175, F176, F177, F178
`F-aibox` | A050-A052 | F150, F151, F152, F153
`F-aiedit` | A053-A056 | F155, F156
`F-airouter` | A057-A059 | F158, F159, F160, F161
`F-aisettings` | A060 | F157
`F-aimark` | A061, A062 | F162
`F-aibudget` | A063 | F154
`F-aisafety` | A064 | F159
`F-problems` | A070-A073 | F141, F148, F165, F166, F167, F168, F169
`F-instructions` | A074, A075 | F171, F172
`F-ideas` | A080-A089 | F188 to F198
`F-blueprint` | A090-A094 | F201, F202, F203, F204, F205
`F-map` | A095 | F186, F187
`F-share` | A100-A102 | F208, F209, F212, F213, F214
`F-publish` | A103-A107 | F215, F216, F217, F218, F219, F220
`F-live` | A108, A109 | F221, F222
`F-queue` | A110-A113 | F223, F224, F225, F226
`F-history` | A114, A115 | F227, F228, F229
`F-export` | A116 | F240, F241
`F-import` | A120-A123 | F121, F234, F235, F236, F237, F238, F239
`F-github` | A124, A125 | F242, F243
`F-drive` | A126, A127 | F244
`F-conflict` | A128, A129 | F231, F232, F233
`F-offline` | A130-A132 | F163, F247, F248, F249
`F-desktop` | A133 | F250
`F-phone` | A134, A135 | F253, F254
`F-limits` | A140-A143 | F257, F259, F260, F261
`F-config` | A144-A148 | F266 to F273, F275
`F-ledger` | A149, A150 | F258
`F-exception` | A151 | F274
`F-empty` | A200 | F105, F207
`F-a11y` | A201, A202 | F170
`F-perf` | A203, A204 | F111
`F-legal` | A205, A206 | F104

**Forty-two slugs, 129 criteria, and they reach 137 of the 180 features.** The counts come from
`grep -oE '^`A[0-9]{3}` \| `F-[a-z0-9-]+`' docs/pack/19-ACCEPTANCE-CRITERIA.md` and from the two
greps in section 3.

**The 43 features the slugs did not reach now have criteria.** Section 12a of `19` already covered
21 of them by register id, and section 12b of `19` (`A729` to `A796`) covers the other 22, including
top-ups (F264) and the plan comparison (F265). The per-feature list is
`tools/feature-criteria-gap.md`. Five of the new criteria are marked `Not yet checkable`, each naming
the decision or number it waits on.

## 8. Three pack files this register needed, and where they now are

Seven `spec file` cells pointed at a pack file that was never written. Four were redirected to a
file that does exist. The other three read `none yet` until 18 September, and now point at the file
written for each subject. **No `spec file` cell reads `none yet` any more**: 18 cells were
repointed: 15 at the format file, two at the sync file (F249 and F280) and one at accessibility
(F170).

Was pointed at | Now | Why
`51-AI-ROUTING.md` | `27-MODEL-ROUTING-SPEC.md` | The same subject, under the pack's number
`61-RELEASE-AND-SIGNING.md` | `35-RELEASE-AND-VERSIONING.md` | Covers desktop-build and signing
`40-ARCHITECTURE.md` | `20-ARCHITECTURE.md` | The pack numbers architecture at 20
`54-BILLING.md` | `53-PRICING-AND-ENTITLEMENTS.md` | Its `covers` list already names billing
`20-FORMAT-SPECIFICATIONS.md` | `66-FORMAT-SPECIFICATIONS.md` | Numbered 66 because 20 is architecture. Being written on 18 September; it existed, with `covers: [formats, ...]`, when this row was changed
`44-SYNC-AND-CONFLICT.md` | `67-SYNC-AND-CONFLICT.md` | Numbered 67 because 44 is the tech-debt register. Being written on 18 September and **not yet present** when this row was changed
`59-ACCESSIBILITY.md` | `46-ACCESSIBILITY-SPEC.md` | Exists, with `covers: [accessibility, contrast, assistive-technology]`

**Checked with** this command, which reads every `covers:` line in the pack and is the test to re-run
rather than trusting the three rows above:

```bash
grep -h '^covers:' docs/pack/*.md | tr -d '[]' | sed 's/covers: //' \
  | tr ',' '\n' | sed 's/^ *//' | sort -u
```

**At the time of writing it returned 203 covered ids and none of them was `formats`, `sync` or
`accessibility`.** Re-run on 18 September when the three rows above were changed, it returned 237,
with `formats` from `66-FORMAT-SPECIFICATIONS.md` and `accessibility` from `46-ACCESSIBILITY-SPEC.md`,
and still no `sync`, because `67-SYNC-AND-CONFLICT.md` was not yet written. The near misses of the
first run, and why each one did not close the gap:

- `25-ENGINE-SPEC.md` covers `splice`, `anchors` and `projection-law`. Those are how bytes are
  written, not what a Mermaid block, an `fm-chart` block or a `page.md` twin must contain.
- `58-DESIGN-SYSTEM.md` covers `contrast`, and `19-ACCEPTANCE-CRITERIA.md` carries A201 and A202.
  Two criteria and a contrast table are not a conformance target, and the plan commits to IS 17802
  as well as to WCAG.
- `21-DATA-MODEL.md` covers `firestore`, `r2` and `indexeddb`. None of those is the splice journal,
  the compare-and-swap save or the conflict rule.

**The pack is growing while this is read.** It went from 47 files to 56 in the two hours this
register took, so re-run the command before acting on any row above.

## 9. The limits of this register

- **Not assessed:** whether each feature is worth building. This file records what the plan says,
  not whether it is right.
- **Could not be verified:** the audit findings' own text. Section 5 reads the citing line in the
  plan, not `CLAUDE-AUDIT-FINDINGS.jsonl`, which is 86,652 bytes and was not opened line by line.
- **Not established:** the boundary between one feature and two. `F190` to `F196` could be one row
  or nine. They are split where an acceptance criterion would differ.
- **What would falsify the F101 decision:** the founder saying the audit ids will be renamed to
  `AF0NN` in the plan and the guide. If that happens, `F001` to `F100` become free, and this file
  keeps its numbering anyway, because convention 3 forbids renumbering once an id is cited.
- **What would falsify a `shipped` row:** running the app and finding the feature absent. Every
  check in section 6 is a file check, which proves the code exists and not that it works. That is a
  proxy, and it is labelled one.
