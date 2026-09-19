---
id: 17-ERROR-AND-REFUSAL-CATALOGUE
title: Error and refusal catalogue
mode: reference
tier: canonical
status: living
updated: 2026-09-19
owner: sagnik
verified_against: f237ece
covers: [refusals, errors, recovery, unchanged-input-guarantee]
---

# 17. Error and refusal catalogue

Every error and every refusal the product can show, in one register.

## 0. The rule that governs this whole file

**Returning the input unchanged is a correct outcome for this product. Guessing is not.**

`specs/engine/splice-writer.md` puts it in the engine's own words: when the range cannot be located
unambiguously, return the input unchanged and say why, and this is "the single guarantee the product
is sold on".

**So every row below says which it does.** The `unchanged` column is not optional and not a comment.
It is the column the product is sold on, and a row that cannot answer it is a row that has not been
designed.

Value | Meaning
`yes` | The person's bytes are exactly as they were. Nothing was written, nothing was queued
`queued` | Nothing was written to the server, and the change is held locally until it can be
`partial` | Some of a batch landed and some did not. **The row must name what landed**
`no` | The product wrote something. **Only three rows may say this, and each carries its justification**
`n/a` | No document was in play

## 0.1 The shape of a refusal

Four parts, in this order, from `specs/engine/splice-writer.md`: state what happened, state that the
file is unchanged, state why, give one next step.

**Never an apology first. Never a stack trace. Never an error code alone.**

The worked example is `K.s22.refuse.gdoc` in `16-COPY-DECK.md`: "Google exports up to 10 MB; this one
is 14 MB. Split it in Docs and try again."

## 0.2 The columns

- **`id`** is `E` plus three digits, per `65-CONVENTIONS.md` section 3. **Never reused, never
  renumbered.**
- **`class`** is one of the eight in section 0.3.
- **`trigger`** is the condition, named precisely enough to write a test from.
- **`string`** is an id into `16-COPY-DECK.md`, or `none yet` where the copy does not exist, or
  `internal` where the row never reaches a person.
- **`recovery`** is the one next step offered, or `none` where there genuinely is not one.
- **`unchanged`** is section 0's column.
- **`event`** is a dotted id whose home is `55-MEASUREMENT-AND-EVENTS.md`.
- **`test`** is the test that proves it: a real path where one exists, or `T` plus three digits where
  it is proposed.

**The `T` format is proposed here**, because `65-CONVENTIONS.md` section 3 does not define a test id.
`19-ACCEPTANCE-CRITERIA.md` uses the same scheme, and section 12 below maps every `T` id used in
either file.

## 0.3 The eight classes

Class | What it covers | Who owns the fix
`engine` | The splice writer and the shape gate refusing to write | The engine
`validation` | Input the product will not accept | The route or the form
`permission` | The person or the token may not do this | The permission matrix, `docs/mvp0/PRODUCT-PLAN.md` section 19
`quota` | A cap in `limitsFor(account)` has been reached | The entitlements layer
`model` | The model layer produced nothing usable | The AI router
`provider` | A third party refused, expired or ran out | The adapter
`network` | The connection, the browser or the device | The offline layer
`conflict` | Two versions of the same bytes | The change queue and S31

## 0.4 How the ids run, and the rows added on 18 September

The 38 screen specs first allocated `E` ids by screen, and those ids collided with this file's. They
were reconciled into this file on 18 September. The audit trail and the per-screen map are
`docs/pack/tools/error-reconciliation.md` and `docs/pack/tools/error-map.json`.

- **No existing row moved or changed meaning.** Each class kept its first block, filled its free
  space, then continued in a second block of its own.
- **Every row added that day is `specified, not built`.** Each came from a screen spec, not from
  shipped source, and each `T` id from `T300` on is a proposal.

Class | First block | Second block
`engine` | `E001` to `E029` | `E500` to `E549`
`validation` | `E030` to `E049` | `E550` to `E599`
`permission` | `E050` to `E069` | `E600` to `E649`
`quota` | `E070` to `E079` | `E650` to `E699`
`model` | `E080` to `E089` | `E700` to `E749`
`provider` | `E090` to `E099` | `E750` to `E799`
`network` | `E100` to `E109` | `E800` to `E849`
`conflict` | `E110` to `E119` | `E850` to `E899`

**Rows added on 19 September, 42 of them.** Sheets, boards, embeds, voice and PDF conversion, from
`68-SHEETS-SPEC.md` to `72-PDF-TO-MARKDOWN-SPEC.md` and screens S39 to S42. Each took the next free id
in its class's second block, so `E513` to `E531`, `E565` to `E570`, `E603`, `E654` to `E658`, `E701`
to `E704`, `E756`, `E806` to `E810` and `E852`. Every one is `specified, not built`, and its test is
`T848` to `T889`. The slug each replaced is in `tools/new-ids-allocation.md` section 5.

- **A microphone refusal is `network`, not `permission`**, because the browser is the device.
- **Two rows are notices, not refusals**: `E704`, where the vision pass falls back, and `E852`, where a
  PDF lands as a proposal instead. They sit here so the report and the event have an id.

**`E105` and `E106` stretch the `network` class.** They cover a failed read or write against our
own store, which is not the connection, the browser or the device. `E102` already sat here, so they
follow it. A ninth class would be cleaner and is the owner's call.

---

## 1. Engine refusals

**This is the half of the catalogue that is already real.** Every trigger below was read from
`src/modules/share/domain/splice-frontmatter.ts`, `src/modules/mdmax/domain/shape-gate.ts` or
`specs/engine/` at commit `f237ece`.

id | class | trigger | string | recovery | unchanged | event | test
`E001` | engine | The key does not match `SAFE_KEY = /^[A-Za-z0-9_.$-]+$/`, so the writer cannot address it | none yet | Rename the key, or edit the front matter by hand | `yes` | `engine.refused` | `test/share/frontmatter-splice.test.ts`.
`E002` | engine | The front matter block is unterminated: no closing fence was found | none yet | Close the fence, then try again | `yes` | `engine.refused` | `test/share/frontmatter-splice.test.ts`.
`E003` | engine | A duplicate top-level key is present, so which one to write is ambiguous | none yet | Delete one of the two keys | `yes` | `engine.refused` | `T001`.
`E004` | engine | The target key is a block scalar or carries a YAML anchor at top level | none yet | Edit the front matter by hand | `yes` | `engine.refused` | `T002`.
`E005` | engine | The front matter block is not a plain map | none yet | Edit the front matter by hand | `yes` | `engine.refused` | `T003`.
`E006` | engine | A rename whose new key would need quoting | none yet | Choose a key that needs no quotes | `yes` | `engine.refused` | `T004`.
`E007` | engine | A rename whose target key already exists | none yet | Delete the target key first | `yes` | `engine.refused` | `T005`.
`E008` | engine | A rename where the new key appears more than once | none yet | Delete the duplicate first | `yes` | `engine.refused` | `T006`.
`E009` | engine | **NF-1.** A YAML block sequence at column zero, which is PyYAML's default output shape | none yet | None today. The write simply does not happen | `yes` | `engine.refused` | `test/corpus/foreign/nf-001-red-proof.test.ts`.
`E010` | engine | **NF-2.** A flow-sequence close bracket at column zero | none yet | Indent the block, or edit by hand | `yes` | `engine.refused` | `T007`.
`E011` | engine | **NF-3.** A front matter fence terminated by a bare carriage return | none yet | **None. This row does not refuse today, it corrupts.** See section 1.1 | `no` | `engine.corrupted` | `test/corpus/foreign/nf-003-red-proof.test.ts`.
`E012` | engine | **NF-4.** A key containing a space, such as `date created` | none yet | Rename the key | `yes` | `engine.refused` | `T008`.
`E013` | engine | The front matter does not parse strictly | none yet | Fix the YAML, then try again | `yes` | `engine.refused` | `T009`.
`E014` | engine | Two front matter blocks are already present in the input | none yet | Delete one block | `yes` | `engine.refused` | `T010`.
`E015` | engine | The fence delimiter cannot be resolved unambiguously | none yet | Edit by hand | `yes` | `engine.refused` | `T011`.
`E016` | engine | Shape gate `BUDGET_BYTES`: the document is over the byte limit | none yet | Split the document | `yes` | `engine.budget` | `test/mdmax/shape-gate.test.ts`.
`E017` | engine | Shape gate `BUDGET_LINES` | none yet | Split the document | `yes` | `engine.budget` | `test/mdmax/shape-gate.test.ts`.
`E018` | engine | Shape gate `BUDGET_BLOCKS`: too many list-marker lines | none yet | Split the document | `yes` | `engine.budget` | `test/mdmax/shape-gate.test.ts`.
`E019` | engine | Shape gate `INVALID_UTF8`, with the line and column | none yet | Re-save the file as UTF-8 | `yes` | `engine.refused` | `test/mdmax/shape-gate.test.ts`.
`E020` | engine | Shape gate `BUDGET_TIME`: the parse ran past its budget | none yet | Try again, or split the document | `yes` | `engine.budget` | `T012`.
`E021` | engine | Shape gate `PARSER_THREW` | none yet | Report it. The file is untouched | `yes` | `engine.threw` | `test/mdmax/shape-gate.test.ts`.
`E022` | engine | Shape gate `WORKER_DIED` | none yet | Try again | `yes` | `engine.threw` | `T013`.
`E023` | engine | The block skeleton moved, so a comment cannot be re-anchored | none yet | The comment is shown unanchored | `yes` | `comment.unanchored` | `test/mdmax/placement.test.ts`.
`E024` | engine | A write path contains `..` | `internal` | None. Server-side guard | `yes` | `write.blocked` | `test/repository/commit-changes.test.ts`.
`E025` | engine | A write path is a blocked prefix or a blocked file outside the vault | `internal` | None. Server-side guard | `yes` | `write.blocked` | `test/repository/commit-changes.test.ts`.

### 1.1 The three rows that say `no`, and why

**`E011` is the only row in the whole catalogue that writes when it should refuse.** A bare-CR fence
is not recognised, so the writer believes the file has no front matter and prepends a second block.
`specs/engine/nf-003-bare-cr-fence.md` calls it "set-destructive AND oracle-blind". Its fix moves
this row's `unchanged` column from `no` to `yes`, and **until then the catalogue records a known
corruption rather than hiding it**.

**Two more rows are allowed to write, and both are writes the person asked for**: `E111` re-reads and
retries under compare-and-swap, and `E115` writes conflict markers into a draft that only exists
locally. Neither touches a saved version.

### 1.2 What the corpus can and cannot prove

- `E009` is the largest refusal in the product by volume: `specs/engine/nf-001-zero-indent-sequence.md`
  records **6,613 of 6,614 foreign refusals, 83.10 per cent aggregate across 7,969 files**.
- `E011` has a corpus blast radius of **zero**. Measured over all 8,513 pinned files: zero bare-CR
  fences, zero CRLF fences, zero byte-order marks.
- **So a green corpus run is not evidence for `E011`.** It needs a synthetic fixture, and a test that
  fails against the unfixed writer before it is trusted. That is rule 1 of `AGENTS.md` section 0, and
  the reason this section exists rather than a single pass rate.

### 1.3 Every engine refusal needs words

**Twenty-two of the twenty-five rows above say `none yet`.** The engine refuses correctly and says
nothing a person can read. `specs/engine/splice-writer.md` names the gap itself: "See the refusal-UX
spec when it lands for the message template."

Two message shapes exist in the specs and should seed the copy:

- "Refused: could not locate `<key>` safely. File unchanged."
- "Cannot write to `<path>`: front matter did not parse. File unchanged."

**These belong in `16-COPY-DECK.md` under `K.err.*` and are not written there yet**, because this
file does not own copy.

### 1.4 Engine rows the screens need, specified and not built

**Section 1's opening sentence does not cover these rows.** They were not read from shipped source.
They come from the 38 screen specs in `docs/pack/12-screens/`, and each is `specified, not built`.
Section 0.4 says how their ids were chosen.

id | class | trigger | string | recovery | unchanged | event | test
`E026` | engine | A splice in the document body, from a keystroke, a toolbar mark, a restore or a queue item, cannot locate its range unambiguously | none yet | None. The edit is refused and the document stays as it was | `yes` | `engine.refused` | `T300`.
`E027` | engine | The document changed after a proposal or a fix recorded its range, so the range no longer matches | none yet | Re-open the item against the current bytes | `yes` | `engine.range_stale` | `T301`.
`E028` | engine | A fenced block in the body has no closing fence, so its range cannot be closed | none yet | Close the fence, then try again | `yes` | `engine.refused` | `T302`.
`E029` | engine | A check, a parse or a graph build threw, so its result is absent | none yet | The failing part is named and the other checks still run. Retry | `yes` | `engine.threw` | `T303`.
`E500` | engine | A table row's cell count does not match its header, so the table editor refuses the edit | none yet | Fix the row in the source pane | `yes` | `engine.refused` | `T304`.
`E501` | engine | A custom block's source, such as Mermaid or maths, does not parse | none yet | The source is shown in place of a rendering. Fix the source | `yes` | `block.render_failed` | `T305`.
`E502` | engine | A chart block has no table above it, no numeric column, or names a kind we do not draw | none yet | The source is shown. Add a table, or change the kind | `yes` | `block.render_failed` | `T306`.
`E503` | engine | A callout names a kind we do not know | none yet | It renders as a plain blockquote | `yes` | `block.render_fallback` | `T307`.
`E504` | engine | A build, a drawing or a check exceeds its budget | none yet | A narrower result is drawn and the limit is named. Narrow the range, or switch view | `yes` | `engine.budget` | `T308`.
`E505` | engine | The document has no H2, so the flow projection has no column to make | none yet | Switch to Page view, or add a heading | `yes` | `view.unavailable` | `T309`.
`E506` | engine | An H3 appears before any H2, so that step has no phase | none yet | The step renders in a leading column. Fix the heading levels | `yes` | `view.step_unplaced` | `T310`.
`E507` | engine | No fix in the set can be applied safely | none yet | None is applied, and the panel says so rather than doing nothing silently | `yes` | `problems.none_safe` | `T311`.
`E508` | engine | Two files have drifted too far apart for a clean diff | none yet | Open both files side by side | `yes` | `instructions.diff_refused` | `T312`.
`E509` | engine | A file in a set fails to parse, or cannot be read as a file | none yet | It is named and the rest still process | `yes` | `engine.refused` | `T313`.
`E510` | engine | Doc mode has no carrier for a feature in the file | none yet | A toast names the feature. Edit it in Edit mode | `yes` | `doc.mode_unsupported` | `T314`.
`E511` | engine | An export could not be produced | none yet | Nothing is downloaded. Try again | `yes` | `export.failed` | `T315`.
`E512` | engine | A derived view, such as a kit map, is stale | none yet | It is rebuilt before it is shown, and says so | `yes` | `view.rebuilt` | `T316`.
`E513` | engine | A value typed into a pipe-table cell contains a line break. GFM cells are single-line, and stripping the break would be a guess | none yet | The cell keeps its old value. Type the value on one line | `yes` | `sheet.edit.refused` | `T848`.
`E514` | engine | A sheet formula refers to itself, directly or through another column | none yet | That column is not computed. Change the formula in the block under the table | `yes` | `sheet.edit.refused` | `T849`.
`E515` | engine | A sheet formula meets a cell that is not a number, such as `1,200` | none yet | That row shows the error. Write the number without separators | `yes` | `sheet.edit.refused` | `T850`.
`E516` | engine | A summary function such as `sum` appears inside a `col.` row formula | none yet | That column is not computed. Move the summary to a `foot.` line | `yes` | `sheet.edit.refused` | `T851`.
`E517` | engine | A sheet formula names a function outside the set of `68-SHEETS-SPEC.md` section 4.3 | none yet | That column is not computed. Use a function from the set | `yes` | `sheet.edit.refused` | `T852`.
`E518` | engine | A division gives a quotient that does not terminate and the formula has no `round` | none yet | That row shows the error. Wrap the formula in `round` | `yes` | `sheet.edit.refused` | `T853`.
`E519` | engine | A `.csv` has mixed line endings, a delimiter other than comma, a `.tsv` a delimiter other than tab, or a record holds a quoted line break | none yet | The file opens read-only with the reason | `yes` | `sheet.edit.refused` | `T854`.
`E520` | engine | An edit to a `.csv` record whose field count differs from the header's | none yet | The edit is refused. Fix the record in the plain text | `yes` | `sheet.edit.refused` | `T855`.
`E521` | engine | A board file's `limits` and `columns` differ in length | none yet | The board shows no limits and the problems panel names the key. Fix the board file | `yes` | `engine.refusal.raised` | `T856`.
`E522` | engine | Two columns in a board file share a name | none yet | The board renders its source with the reason. Rename one column | `yes` | `engine.refusal.raised` | `T857`.
`E523` | engine | A board file's `board` key is missing its value, or names a major version this client does not know | none yet | The board file opens as a note with the reason | `yes` | `engine.refusal.raised` | `T858`.
`E524` | engine | A board file's `cards` names a folder that does not exist | none yet | The board shows no cards and names the path. Create the folder or fix the path | `yes` | `engine.refusal.raised` | `T859`.
`E525` | engine | One `.md` file carries two reserved profile keys, such as `board` and `slides` | none yet | The file opens as a note and the problems panel names both keys. The product never picks one | `yes` | `engine.refusal.raised` | `T860`.
`E526` | engine | An `fm-embed@1` fence names a `src` path that does not exist | none yet | The embed shows the reference and the reason. Fix the path | `yes` | `engine.refusal.raised` | `T861`.
`E527` | engine | An `fm-embed@1` anchor resolves to more than one place in the source | none yet | The embed shows the reference and the reason. Make the anchor unique | `yes` | `engine.refusal.raised` | `T862`.
`E528` | engine | An embed reaches a file already visited on its own chain | none yet | The embed refuses at the second visit and names the cycle | `yes` | `engine.refusal.raised` | `T863`.
`E529` | engine | A voice command's target sits in a code fence, a table or front matter | `K.s41.err.protected` | None is applied. Select prose, or edit that part by hand | `yes` | `voice.turn.refused` | `T864`.
`E530` | engine | A PDF is damaged or cannot be read by pdf.js | none yet | Nothing is converted, and pdf.js's reason is given in plain words | `yes` | `pdf.convert.refused` | `T865`.
`E531` | engine | No page of a PDF reached the confidence floor, so every page was left out | none yet | Nothing is converted. Try a clearer scan | `yes` | `pdf.convert.refused` | `T866`.

---

## 2. Validation

id | class | trigger | string | recovery | unchanged | event | test
`E030` | validation | A generate-document request names a kind the route does not know | `internal` | None. Client bug | `n/a` | `api.bad_request` | `T020`.
`E031` | validation | A generate-document request with no idea text | none yet | Type something first | `n/a` | `api.bad_request` | `T021`.
`E032` | validation | The idea is over 20,000 characters | none yet | Shorten it, or attach it as a document | `n/a` | `api.too_large` | `T022`.
`E033` | validation | A commit request whose body is not valid JSON | `internal` | None. Client bug | `yes` | `api.bad_request` | `test/repository/commit-changes.test.ts`.
`E034` | validation | A link-doctor request with no paths | `internal` | None. Client bug | `n/a` | `api.bad_request` | `T023`.
`E035` | validation | A Google Doc export over 10 MB | `K.s22.refuse.gdoc.sub` | Split it in Docs and try again | `yes` | `import.refused` | `T024`.
`E036` | validation | An imported file is not valid UTF-8 | `K.s22.warn.sub` | Re-save as UTF-8, or import it as an attachment | `yes` | `import.needs_look` | `T025`.
`E037` | validation | An imported wikilink points at a note outside the folder | `K.s22.warn.sub` | Import the target too, or fix the link | `yes` | `import.needs_look` | `T026`.
`E038` | validation | An upload is over the per-file cap, 5 MB on Free and 25 MB on Pro | none yet | Compress it, or move to Pro | `n/a` | `upload.refused` | `test/repository/upload-attachment.test.ts`.
`E039` | validation | A share is addressed to an email that is not a frontmatter account | `K.s17.invite.title` | Send an invite. **This is an offer, not an error** | `n/a` | `share.invite_offered` | `T027`.
`E040` | validation | A property key typed in the panel is outside the writer's address space | `internal` | The field refuses at typing time, before a write is attempted | `yes` | `properties.refused` | `T028`.
`E041` | validation | A published-page slug is already taken | none yet | Choose another slug | `n/a` | `share.slug_taken` | `test/share/slug.test.ts`.
`E042` | validation | A named document, version, idea, file, node or attachment no longer exists | none yet | Go back, or rebuild the list that named it | `n/a` | `record.not_found` | `T317`.
`E043` | validation | A reference resolves to a file but not to the heading or anchor inside it | none yet | The file opens at its top, and says why | `n/a` | `reference.anchor_missing` | `T318`.
`E044` | validation | A request names a route, a settings slug or a target the product does not know | none yet | The default is used, such as the first target or the Account section, and it says so | `n/a` | `route.unknown` | `T319`.
`E045` | validation | A public slug is requested that is not published | none yet | None. A plain not-found is served, never a redirect to sign-in | `n/a` | `pub.not_found` | `T320`.
`E046` | validation | A required field is empty, or below the minimum the flow needs | none yet | Fill the field | `n/a` | `input.missing` | `T321`.
`E047` | validation | An input, a prompt or a selection is longer than the flow accepts | none yet | Shorten it | `n/a` | `input.too_long` | `T322`.
`E048` | validation | A submitted value is not valid for its field | none yet | Correct the value. Nothing is written until it is | `yes` | `input.invalid` | `T323`.
`E049` | validation | A project rule file does not parse, or names a rule the checker does not have | none yet | Fix the rule file. The other rules still run | `yes` | `problems.rules_invalid` | `T324`.
`E550` | validation | A name, handle or address the person chose is already in use | none yet | Choose another. It asks rather than renaming silently | `n/a` | `input.taken` | `T325`.
`E551` | validation | The thing the action would create already exists | none yet | The existing one is offered and never overwritten | `yes` | `create.exists` | `T326`.
`E552` | validation | An instruction set's source file is missing | none yet | The copies are listed as orphans. Promote one to the source, or create it | `yes` | `instructions.source_missing` | `T327`.
`E553` | validation | A third-party tool's published size cap is unknown | none yet | None. The row says unknown rather than ok | `n/a` | `instructions.cap_unknown` | `T328`.
`E554` | validation | A tool has no import mechanism | none yet | A copy is offered instead | `n/a` | `instructions.import_unsupported` | `T329`.
`E555` | validation | No standard question set exists for this template | none yet | The template is named. Retry the model, or answer without the set | `n/a` | `ideas.no_standard_set` | `T330`.
`E556` | validation | No desktop build exists for this platform | none yet | None. The control says so before it is pressed | `n/a` | `desktop.unavailable` | `T331`.
`E557` | validation | No local model is installed | none yet | None. The chip says so before it is pressed | `yes` | `ai.local_missing` | `T332`.
`E558` | validation | A search matched nothing | none yet | None. It is said plainly, without guessing at a near match | `n/a` | `search.empty` | `T333`.
`E559` | validation | A drop carries no readable entries | none yet | Use the picker instead | `n/a` | `import.drop_empty` | `T334`.
`E560` | validation | A file's type is not one the product can open or convert | none yet | None. The file is named and the rest continue | `n/a` | `upload.unsupported` | `T335`.
`E561` | validation | A conversion, such as a Word file to markdown, failed | none yet | The original is kept as an attachment, and it says so | `yes` | `import.convert_failed` | `T336`.
`E562` | validation | The person cancelled at the sign-in provider | none yet | They return to the card with nothing changed. **Not an error to apologise for** | `n/a` | `auth.signin.cancelled` | `T337`.
`E563` | validation | A portfolio publish is attempted with no handle claimed | none yet | Claim a handle first | `n/a` | `portfolio.no_handle` | `T338`.
`E564` | validation | A generator returned a set that fails its own schema | none yet | The run holds at the last good page. Retry, or drop to the standard set | `yes` | `ideas.schema_failed` | `T339`.
`E565` | validation | A `.csv` is not UTF-8 | none yet | The first bad byte is named, and conversion to UTF-8 is offered as a proposal | `yes` | `sheet.edit.refused` | `T867`.
`E566` | validation | A column name contains a comma, or would need quoting in a YAML flow list | none yet | The column change is refused. Choose a name without a comma | `yes` | `engine.refusal.raised` | `T868`.
`E567` | validation | Under 0.5 s of speech is left after trimming silence | `K.s41.err.nothing` | Nothing is sent to a provider. Hold the key and speak | `yes` | `voice.turn.refused` | `T869`.
`E568` | validation | A voice command has no selection and no recent insertion to act on | `K.s41.err.notarget` | Select the text first | `yes` | `voice.turn.refused` | `T870`.
`E569` | validation | A voice command's selection is over `voice.command.maxSelectionWords` words | `K.s41.err.toolong` | None is applied, and the limit is named. Select less | `yes` | `voice.turn.refused` | `T871`.
`E570` | validation | A PDF is password protected | `K.s42.err.password` | Remove the password in the app that made it, then try again | `yes` | `pdf.convert.refused` | `T872`.

**`E040` is the pattern the rest should copy.** `src/modules/preview/presentation/PropertiesPanel.tsx`
refuses the same shapes the writer refuses, at the point of typing. Its own comment records why:
before it refused, a key the writer could not find was appended again on every attempt.

---

## 3. Permission

id | class | trigger | string | recovery | unchanged | event | test
`E050` | permission | Any API route reached without a session | `internal` | Sign in | `n/a` | `auth.unauthorized` | `test/auth/allowlist.test.ts`.
`E051` | permission | An agent token attempts to apply a change | none yet | The change enters the queue instead | `yes` | `agent.apply_refused` | `T030`.
`E052` | permission | An agent token attempts to publish | none yet | None. **Never permitted** | `yes` | `agent.publish_refused` | `T031`.
`E053` | permission | A Viewer attempts to edit | none yet | Ask the owner, or take an own copy | `yes` | `role.refused` | `T032`.
`E054` | permission | A Commenter attempts to edit | none yet | Comment instead | `yes` | `role.refused` | `T033`.
`E055` | permission | A Free collaborator opens a Pro owner's document | `internal` | None. **The owner's limits apply, not theirs** | `n/a` | `entitlement.inherited` | `T034`.
`E056` | permission | A GitHub write is attempted outside `docs/` | `internal` | None. Server-side guard, and the rule is tested | `yes` | `github.blocked` | `test/repository/github-writer.test.ts`.
`E057` | permission | A Drive operation touches a file outside the `drive.file` scope | `internal` | None. Google refuses it | `yes` | `drive.out_of_scope` | `T035`.
`E058` | permission | The Google OAuth app or the GitHub App is suspended | none yet | Sign in by email magic link, if that flag is on. **Exports never need a connection** | `yes` | `provider.suspended` | `T036`.
`E059` | permission | A configuration write arrives without the super-admin flag | `internal` | None. Checked server-side on every write, never in the browser | `n/a` | `config.refused` | `T037`.
`E060` | permission | Ownership transfer requested by an agent | none yet | None. **Transfers go to another account on request, never by an agent** | `yes` | `owner.transfer_refused` | `T038`.
`E061` | permission | A sign-in provider account the allowlist refuses | none yet | The reason is shown on the card. Try the other provider | `n/a` | `auth.refused` | `T340`.
`E062` | permission | A control this screen does not own is reached, or a locked row is touched | none yet | None. Nothing happens, the attempt is audited, and the row already says why | `n/a` | `config.blocked` | `T341`.
`E063` | permission | The last owner of a document would be demoted or removed | none yet | Add another owner first | `n/a` | `share.last_owner` | `T342`.
`E064` | permission | The operating system refused access to a folder | none yet | The folder and the setting are named. Grant access, then retry | `n/a` | `desktop.folder_refused` | `T343`.
`E065` | permission | Access was withdrawn while the document was open | none yet | The session drops and the local copy stays readable. Export, or ask the owner | `yes` | `share.access_withdrawn` | `T344`.
`E066` | permission | The record belongs to another account | none yet | None. Go back | `n/a` | `record.foreign` | `T345`.
`E067` | permission | A link password is wrong | none yet | Try again | `n/a` | `pub.link.password_wrong` | `T346`.
`E068` | permission | A link has expired | none yet | Ask the owner for a new link | `n/a` | `pub.link.expired` | `T347`.
`E069` | permission | Account deletion is requested while a payment is in flight | none yet | Wait for the payment to settle, then delete | `n/a` | `account.delete_blocked` | `T348`.
`E600` | permission | A desktop update's signature does not verify | none yet | None. The update is refused rather than installed | `n/a` | `desktop.update_refused` | `T349`.
`E601` | permission | A revoked kit or share link is fetched | none yet | None. A plain refusal, never a redirect to sign-in | `n/a` | `kit.link_revoked` | `T350`.
`E602` | permission | A feature flag is off | none yet | None. The control is not offered, and the screens it governs say why rather than 404 | `n/a` | `flag.off` | `T351`.
`E603` | permission | A viewer cannot read the source of an embed, or a published page embeds an unpublished source | none yet | A placeholder is drawn in place of the content, and the publish screen lists the source | `yes` | `engine.refusal.raised` | `T873`.

**`E051`, `E052` and `E060` are the permission matrix said in code.** `docs/mvp0/PRODUCT-PLAN.md` section 19
gives the agent-token row as never for apply and never for publish, and section 19 gives the ownership
rule. **These three are the rows an attacker tries first**, so each needs a test before phase D.

---

## 4. Quota

**Every row here reads a number from `limitsFor(account)` and never from a constant.** A hard-coded
cap anywhere else is a defect the architecture gate should fail on
(`docs/mvp0/PRODUCT-PLAN.md` section 30).

id | class | trigger | string | recovery | unchanged | event | test
`E070` | quota | Creating a cloud document at the document cap | `K.s33.title` | Delete or export something, use the desktop app, or move to Pro | `n/a` | `cap.documents` | `T040`.
`E071` | quota | An AI edit with no credits left this month | none yet | Wait for the reset, top up, or move to Pro | `yes` | `cap.edits` | `T041`.
`E072` | quota | A blueprint with no blueprint credit left | none yet | Wait for the reset, or top up | `n/a` | `cap.blueprints` | `T042`.
`E073` | quota | Publishing at the published-page cap | none yet | Unpublish one, or move to Pro | `yes` | `cap.pages` | `T043`.
`E074` | quota | An upload that would exceed the account's total storage | none yet | Delete an upload, or move to Pro | `n/a` | `cap.uploads` | `T044`.
`E075` | quota | A GitHub push with the monthly quota spent | none yet | Wait for the reset, or move to Pro. **Pull stays unlimited** | `yes` | `cap.pushes` | `T045`.
`E076` | quota | A second live collaborator joining on Free | `K.s19.toast` | Move to Pro | `n/a` | `cap.collaborators` | `T046`.
`E077` | quota | A fourth question-set rewrite on Free | none yet | Answer the remaining questions, or move to Pro | `n/a` | `cap.rewrites` | `T047`.
`E078` | quota | A downgrade leaves the account over a cap | `K.s33.downgrade` | Delete or export until under the cap | `yes` | `cap.downgrade` | `T048`.
`E079` | quota | A founder lowers a limit below what accounts already hold | `K.s35.bar.warn` | See who, then discard or save | `n/a` | `config.overcap_warned` | `T049`.
`E650` | quota | The plan does not include the feature that was chosen | none yet | The plan page is offered | `n/a` | `cap.plan_feature` | `T352`.
`E651` | quota | A limit or a ledger could not be read | none yet | The action takes the safe direction: it is refused, or only the lowest option is offered, and the meter says the count is unavailable | `n/a` | `cap.unreadable` | `T353`.
`E652` | quota | A capped action was refused and S33 was shown | `internal` | None. The entitlement id is written to the log. The person sees S33, not the code | `yes` | `cap.tripped` | `T354`.
`E653` | quota | The impact of a limit change could not be computed | none yet | None. The save is blocked, because an unknown blast radius is not a small one | `yes` | `config.impact_unknown` | `T355`.
`E654` | quota | A voice turn reaches `limits.voice.turn.seconds` | `K.s41.err.turnlimit` | The recording stops and what was said so far is transcribed. Hold the key again to go on | `yes` | `voice.turn.refused` | `T874`.
`E655` | quota | The account's `limits.voice.minutes` bucket is empty | `K.s41.err.cap` | Nothing is sent. Wait for the daily refill, or on Free see the upgrade path | `yes` | `voice.turn.refused` | `T875`.
`E656` | quota | A PDF has more pages than `limits.pdf.pages` | none yet | Both numbers are named and a page-range picker is offered | `yes` | `pdf.convert.refused` | `T876`.
`E657` | quota | A PDF is larger than `limits.pdf.bytes` | none yet | Both numbers are named. Split the PDF | `yes` | `pdf.convert.refused` | `T877`.
`E658` | quota | A PDF has more scanned pages than `limits.pdf.scannedPages` for browser OCR | none yet | Both numbers are named, a page-range picker is offered, and the desktop app is named | `yes` | `pdf.convert.refused` | `T878`.

**`E078` and `E079` are the same event from two sides**, and the product's answer to both is the same
screen. **Nothing is deleted.** `K.promise.readable` is the sentence.

---

## 5. The model layer

id | class | trigger | string | recovery | unchanged | event | test
`E080` | model | Every provider in the free chain refused or timed out | `K.s32.headline` | Try again in a minute, use the local model on the desktop, or use your own key | `yes` | `ai.chain_exhausted` | `test/ai/provider-race.test.ts`.
`E081` | model | One provider is rate-limited, and the next is tried | `internal` | None. **Not shown to the person.** It appears on S32 only when the whole chain has failed | `yes` | `ai.provider_fell_through` | `test/ai/provider-race.test.ts`.
`E082` | model | One provider's daily pool is spent | `K.s32.reason.pool` | None. The chain falls through | `yes` | `ai.provider_fell_through` | `T050`.
`E083` | model | A route returns `ai_failed` with a 502 | none yet | Try again | `yes` | `ai.failed` | `T051`.
`E084` | model | The model returned a proposal whose range cannot be spliced | none yet | The proposal is dropped and the document is untouched | `yes` | `ai.proposal_refused` | `T052`.
`E085` | model | The model returned nothing, or only whitespace | none yet | Try again. **No credit is spent** | `yes` | `ai.empty` | `T053`.
`E086` | model | The model layer is degraded during an idea flow | none yet | Fall back to a standard question set, not an apology | `n/a` | `ideas.fallback_static` | `T054`.
`E087` | model | An AI edit is attempted while offline in the browser | `K.s24.aioff` | Use the desktop app's local model | `yes` | `ai.offline` | `T055`.
`E088` | model | A background research pass failed | none yet | A shallower evidence level is offered. **Nothing is charged** | `n/a` | `ideas.research_failed` | `T356`.
`E089` | model | A routing cell names a model that no enabled provider serves | none yet | Choose a served model, or enable its provider | `n/a` | `config.route_unserved` | `T357`.
`E700` | model | The model returned the input unchanged | none yet | None needed. **This is a correct outcome, not a failure** | `yes` | `ai.unchanged` | `T358`.
`E701` | model | Restructuring a voice turn passes `voice.timeout.restructureMs` | `K.s41.err.slow` | The call is cancelled and the raw transcript stays as the pending block | `yes` | `voice.restructure.fellback` | `T879`.
`E702` | model | Restructured voice text fails a check of `71-VOICE-SPEC.md` section 5.5 | `K.s41.err.changed` | The raw transcript is shown instead | `yes` | `voice.restructure.fellback` | `T880`.
`E703` | model | Speech in a language other than English. `UNVERIFIED:` Whisper with `language: en` forced on other speech was not tested | none yet | Whatever the recogniser returns goes through the checks as any turn does | `yes` | `voice.turn.transcribed` | `T881`.
`E704` | model | The Pro vision pass is out of pages, switched off or failing. A notice, not a refusal | none yet | Tesseract reads the page and the report says so | `yes` | `pdf.vision.fellback` | `T882`.

**Three promises are load-bearing here, and each needs its own test.**

1. **Nothing is deducted for a failed call** (`K.promise.nocharge`). `E080` through `E085` must each
   leave the ledger balance where it was.
2. **The document is untouched** (`K.promise.untouched`). Every row above says `yes`.
3. **`E084` is the row that connects the model layer to the engine.** A model can propose anything;
   the splice writer decides whether it can land. **Guessing a range to make a model's output fit is
   the exact failure the product exists to refuse.**

---

## 6. Providers

id | class | trigger | string | recovery | unchanged | event | test
`E090` | provider | A provider's terms have never been opened, so it cannot be enabled | `K.s36.cannotenable` | Open the terms, quote them, then enable | `n/a` | `config.provider_blocked` | `T060`.
`E091` | provider | The Cerebras trial has ended | `K.s32.reason.trial` | None. The link leaves the chain | `n/a` | `provider.trial_ended` | `T061`.
`E092` | provider | A GitHub installation token has expired, after one hour | `internal` | None. The adapter refreshes it | `yes` | `github.token_refreshed` | `T062`.
`E093` | provider | GitHub's rate limit of 5,000 requests an hour is reached | none yet | Wait, and the time is stated | `yes` | `github.rate_limited` | `T063`.
`E094` | provider | Google Drive's project quota is reached | none yet | Sync resumes shortly. **Never merge to get past it** | `yes` | `drive.quota` | `T064`.
`E095` | provider | A Razorpay mandate over ₹15,000 is attempted | none yet | Pay per period instead | `n/a` | `pay.mandate_refused` | `T065`.
`E096` | provider | An Indian card is declined, and there is only one attempt | none yet | Use UPI, or another card | `n/a` | `pay.declined` | `T066`.
`E097` | provider | The email allowance is spent | `internal` | None. The notice is queued | `n/a` | `email.quota` | `T067`.
`E098` | provider | Consent was refused at the provider's own screen | none yet | Nothing is stored. Connect again | `n/a` | `conn.consent_refused` | `T359`.
`E099` | provider | A revocation call to the provider failed | none yet | The manual step at the provider is named. **S23 removes the row and S28 keeps it, and that is not yet settled** | `n/a` | `conn.revoke_failed` | `T360`.
`E750` | provider | A provider refused a connection attempt | none yet | The provider and its reason are named. Try again | `n/a` | `conn.refused` | `T361`.
`E751` | provider | An integration source or a connected repository is unreachable | none yet | It is named and the others stay | `n/a` | `conn.unreachable` | `T362`.
`E752` | provider | A verb is not available on the provider the chain chose | none yet | Choose another verb, or try again later | `yes` | `ai.verb_unavailable` | `T363`.
`E753` | provider | An email address is not deliverable | none yet | Check the address | `n/a` | `email.undeliverable` | `T364`.
`E754` | provider | A call to the payment provider failed | none yet | The reason is named. No charge was made and no plan changed. Try again | `n/a` | `pay.call_failed` | `T365`.
`E755` | provider | The payment webhook has not landed inside the wait | none yet | The page says the payment is being confirmed, rather than claiming failure | `n/a` | `pay.webhook_pending` | `T366`.
`E756` | provider | Every link in the speech chain refused or failed for one voice turn | `K.s41.err.busy` | The turn is discarded and nothing is kept to retry. Try again in a minute | `yes` | `voice.turn.refused` | `T883`.

**`E095` and `E096` are architectural constants, not our choices.** ₹15,000 per transaction is the
RBI cap and an Indian card gets one payment attempt
(`docs/mvp0/PRODUCT-PLAN.md` section 5). **`E096` has no string and needs one**, or a person will read a
single decline as a broken card. It is the missing string recorded at the foot of section 14j of
`16-COPY-DECK.md`.

---

## 7. Network and the device

id | class | trigger | string | recovery | unchanged | event | test
`E100` | network | The browser is offline and a save is attempted | `K.s24.banner` | None needed. It syncs when the connection returns | `queued` | `sync.queued` | `test/drafts/draft-store.test.ts`.
`E101` | network | Safari has evicted script-writable storage after seven days without a visit | none yet | Install the app to the home screen. **The server copy is the one that survives** | `yes` | `storage.evicted` | `T070`.
`E102` | network | A request to our own API times out | none yet | Try again. The draft is held locally | `queued` | `api.timeout` | `T071`.
`E103` | network | A live session's Durable Object is unreachable | none yet | Keep writing. The session ends and the document saves normally | `queued` | `live.session_lost` | `T072`.
`E104` | network | Persistent storage was requested and refused by the browser | none yet | None shown. **The first connection pushes everything to the server** | `n/a` | `storage.not_persisted` | `T073`.
`E105` | network | A read this screen depends on failed, including a read from our own store | none yet | The part it feeds says so and the rest still works. Retry | `n/a` | `read.failed` | `T367`.
`E106` | network | A write this product made failed, including a write to our own store | none yet | The control returns to its stored state and nothing is claimed. Retry | `yes` | `write.failed` | `T368`.
`E107` | network | Browser storage refused the write, or is full, so the keystroke is not being kept | none yet | Free space, or use the desktop app. **The one interruption allowed while offline** | `yes` | `offline.storage_full` | `T369`.
`E108` | network | The clipboard refused a copy | none yet | The string is shown to select by hand | `n/a` | `clipboard.refused` | `T370`.
`E109` | network | An action that needs the network was attempted offline and cannot be queued | none yet | Retry when back online. Nothing is queued | `n/a` | `offline.refused` | `T371`.
`E800` | network | The browser blocked a popup | none yet | Allow popups for this site, then retry | `n/a` | `browser.popup_blocked` | `T372`.
`E801` | network | The browser has no directory picker | none yet | File selection is offered instead | `n/a` | `browser.no_directory` | `T373`.
`E802` | network | The browser's install prompt is unavailable | none yet | The browser's own menu route is named | `n/a` | `browser.install_unavailable` | `T374`.
`E803` | network | A protocol handler did not answer in time | none yet | The web option is used | `n/a` | `pub.openin_fallback` | `T375`.
`E804` | network | A global shortcut is already claimed by another application | none yet | The chord is named at launch. Choose another | `n/a` | `capture.shortcut_taken` | `T376`.
`E805` | network | The viewport is too small for this surface | none yet | It is not offered, and the reason is named. Widen the window, or switch view | `n/a` | `view.too_narrow` | `T377`.
`E806` | network | The browser's microphone permission is denied, `getUserMedia` rejecting with `NotAllowedError` | `K.s41.err.micdenied` | Nothing is recorded. Turn the microphone on in the browser's site settings | `yes` | `voice.turn.refused` | `T884`.
`E807` | network | No audio input device is present | `K.s41.err.nomic` | Nothing is recorded. Connect a microphone | `yes` | `voice.turn.refused` | `T885`.
`E808` | network | The microphone track ends in the middle of a voice turn | `K.s41.err.miclost` | What was recorded so far is transcribed as a pending block | `yes` | `voice.turn.refused` | `T886`.
`E809` | network | A voice turn on the web with no connection, or its upload fails | `K.s41.err.offline` | The audio is dropped from memory, never queued to disk. Type, or use the desktop app | `yes` | `voice.turn.refused` | `T887`.
`E810` | network | Browser OCR is needed and its files are not yet cached, with no connection | none yet | Text pages still convert. Connect once, or use the desktop app | `yes` | `pdf.convert.refused` | `T888`.

**`E104` is the row behind the plan's one rule for offline**: never let the browser be the only copy
(`docs/mvp0/PRODUCT-PLAN.md` section 12). It is silent on purpose, and the recovery is architectural rather
than a message.

---

## 8. Conflict

**Twelve invariants govern the engine and the twelfth is "No silent merge, ever"**
(`docs/mvp0/PRODUCT-PLAN.md` section 17). Every row here is that invariant meeting a real case.

id | class | trigger | string | recovery | unchanged | event | test
`E110` | conflict | A commit whose base sha no longer matches the remote | `internal` | Re-read and retry. The paths are named | `yes` | `commit.conflict` | `test/api/share-conflicts-route.test.ts`.
`E111` | conflict | GitHub answers 409 on a blob sha | `internal` | Re-read, then write again. **This is compare-and-swap in GitHub's words** | `no`, and this is the write the person asked for | `github.cas_retry` | `test/repository/github-writer.test.ts`.
`E112` | conflict | A Drive edit and a web edit changed the same paragraph | `K.s31.banner` | Keep left, keep right, keep both, or let AI propose a merge | `yes` | `conflict.shown` | `test/share/list-conflicts.test.ts`.
`E113` | conflict | A desktop edit and a GitHub change collide | `K.s31.banner` | The same four choices. **The same screen serves both** | `yes` | `conflict.shown` | `T080`.
`E114` | conflict | Let AI decide is chosen on S31 | none yet | The proposal enters the change queue and is accepted span by span | `yes` | `conflict.ai_proposed` | `T081`.
`E115` | conflict | A local draft and the remote both moved | `internal` | A three-way merge runs; genuine conflicts come back with markers | `no`, in the local draft only | `draft.merged` | `test/repository/merge3.test.ts`.
`E116` | conflict | Two share records claim the same slug | none yet | Choose another slug | `n/a` | `share.duplicate` | `test/share/duplicate-conflict-modal.test.tsx`.
`E117` | conflict | Accept all is pressed on the change queue | `K.s20.acceptall.note` | Confirm the count first. **Only a named person's edits** | `n/a` | `queue.accept_all` | `T082`.
`E118` | conflict | A regenerate would overwrite hand edits in a copy | none yet | It refuses. Diff the copy, then merge by hand | `yes` | `instructions.regen_refused` | `T378`.
`E119` | conflict | A configuration row or flag changed underneath since it was read | none yet | Nothing is written and the row is named. Reload, then save again | `yes` | `config.stale` | `T379`.
`E850` | conflict | One side of a conflict cannot be read | none yet | The readable side is shown and no keep control is offered. Retry, or open read-only | `yes` | `conflict.side_unreadable` | `T380`.
`E851` | conflict | An AI edit is attempted on a document with an unresolved conflict | none yet | Resolve the conflict on S31 first | `yes` | `ai.conflict_blocked` | `T381`.
`E852` | conflict | A PDF accepted into an empty document finds the document no longer empty. A notice, not a refusal | none yet | The write is refused and the preview offers Add as a proposal, which lands it at the end as one queue item | `yes` | `pdf.convert.refused` | `T889`.

### 8.1 The measure that must be zero

`docs/mvp0/PRODUCT-PLAN.md` section 28 lists, among the pilot's measures, "Sync conflicts shown against
merges attempted, which must be zero".

**Read the two halves carefully, because they are easy to swap.** Conflicts shown is expected to be
above zero and is a sign the product is working. **Merges attempted without the person choosing is
the number that must be zero**, and `E112` through `E115` are the rows that would move it.

`E115` is the one that needs watching. A three-way merge on a local draft is not a silent merge of a
saved version, and the distinction is the whole defence. **If that code ever writes a merged result
to a version rather than to a draft, the invariant is broken.**

---

## 9. What is deliberately not an error

**Naming these stops a later session turning a working behaviour into an error state.**

Behaviour | Why it is not an error
A person invited who has no frontmatter account | An offer, `E039`
A provider falling through to the next in the chain | The chain working, `E081`
A key the writer cannot address | A refusal, and a correct outcome, `E001`
Ghost text producing nothing | It is off by default and produces nothing often
An import that keeps a file byte for byte | The promise, not an absence of work
A published page that is not indexed | A setting, `K.promise.noindex`
A blank outline on an empty document | An empty state, `K.s06.railempty`
A document over its history window | The versions were pruned to the head by design
Escape closing a panel | Not a cancel, `15-INTERACTION-AND-KEYBOARD.md` section 5

---

## 10. Severity

Per `65-CONVENTIONS.md` section 7. **Severity is about the person, not about the code.**

Level | Rows | Note
`CRITICAL` | `E011` | The only row that writes when it should refuse
`HIGH` | `E009`, `E080`, `E100`, `E110` to `E115` | A person cannot complete a core job, or a conflict is in play
`MEDIUM` | `E001` to `E008`, `E012` to `E025`, `E070` to `E079` | The job completes, badly, or a cap stops it
`LOW` | everything else | Cosmetic or internal

---

## 11. The gaps this file found

1. **Twenty-two engine rows have no words** (section 1.3). The engine's correctness is invisible to
   the person it protects.
2. **`E096` has no words**, and a declined Indian card with one attempt reads as a broken product.
3. **`E114` has no words**, so the merge proposal from S31 arrives in the queue unlabelled.
4. **`E086` has no words**, so the graceful path the plan designed cannot be taken.
5. **Of 169 rows, 144 carry a `T` id rather than a test, and 25 carry a real test path.** Counted from
   the tables above on 18 September 2026 with this command, which anyone can re-run:

   ```bash
   python3 - <<'PY'
   import re
   rows = [l for l in open("docs/pack/17-ERROR-AND-REFUSAL-CATALOGUE.md").read().split("\n")
           if re.match(r"^`E\d{3}` \|", l)]
   t = sum(1 for r in rows if re.search(r"`T\d{3}`\.$", r))
   p = sum(1 for r in rows if re.search(r"`test/[^`]+`\.$", r))
   print(len(rows), t, p)
   PY
   ```
6. **No event id in this file exists yet.** `55-MEASUREMENT-AND-EVENTS.md` has not been written, and
   every `event` cell is a proposal until it is.

---

## 12. Test id map

Real tests, cited above by path:

`test/corpus/foreign/nf-001-red-proof.test.ts`, `test/corpus/foreign/nf-003-red-proof.test.ts`,
`test/share/frontmatter-splice.test.ts`, `test/share/list-conflicts.test.ts`,
`test/share/duplicate-conflict-modal.test.tsx`, `test/share/slug.test.ts`,
`test/mdmax/shape-gate.test.ts`, `test/mdmax/placement.test.ts`,
`test/repository/commit-changes.test.ts`, `test/repository/github-writer.test.ts`,
`test/repository/merge3.test.ts`, `test/repository/upload-attachment.test.ts`,
`test/api/share-conflicts-route.test.ts`, `test/ai/provider-race.test.ts`,
`test/auth/allowlist.test.ts`, `test/drafts/draft-store.test.ts`.

**`T001` to `T082`, `T300` to `T381`, and `T848` to `T889`, are proposed and do not exist.** `19-ACCEPTANCE-CRITERIA.md` uses the same
numbers, so a `T` id means the same test in both files. **Neither file may renumber one.**

**A red proof comes first for every `T` id in section 1.** `AGENTS.md` section 0 rule 1: a test on a
rare fault proves nothing until it fails against the unfixed code.

---

## 13. Limits of this document

- **What was not assessed.** No error was triggered in a running browser. Every trigger was read from
  source, from a spec, or from the plan.
- **What could not be verified.** The `event` column in its entirety, because
  `55-MEASUREMENT-AND-EVENTS.md` does not exist. The severity in section 10 is a judgement, not a
  measurement.
- **What is not established.** Every `none yet` string, every `T` id, and the whole of sections 4
  through 7, which describe a product that is mostly not built.
- **Not assessed for the 82 rows added on 18 September:** their severity. Section 10 files them
  under `LOW` by default, and `E026` and `E106` in particular may deserve more. Nor was any of
  them triggered; each is `specified, not built`.
- **What would falsify it.** The NF-1 and NF-3 fixes land in phase B
  (`docs/mvp0/PRODUCT-PLAN.md` section 26), and `E009` and `E011` change on that day. A `16-COPY-DECK.md`
  that gains `K.err.*` ids would fill twenty-two `none yet` cells at once.
- **One thing a reader should not conclude.** A refusal rate is not a defect rate. `E009` refuses
  83.10 per cent of foreign vaults and every one of those files is intact. **The number to watch is
  `changed`, and its exit condition is zero** (`specs/engine/splice-writer.md`).
