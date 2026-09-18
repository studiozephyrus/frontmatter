---
id: 26-ENGINE-REFUSAL-CATALOGUE
title: Engine refusal catalogue
mode: reference
tier: canonical
status: living
updated: 2026-09-18
owner: sagnik
verified_against: f237ece
covers: [engine-refusals, defects, engine-fixtures]
---

# 26. Engine refusal catalogue

**Refusing is the differentiation, so this register is a product document and not an error list.**

Every competitor teardown in this repository's record found the same failure: a tool that reads a
markdown file, does not fully understand it, writes it back anyway, and silently drops the
comments, anchors, spacing and reference links it did not model. frontmatter exists because
returning the input unchanged is the correct answer to that situation.

That makes a refusal a feature with a name, an owner, a fixture and a message. This file is where
those live. `AGENTS.md:13` states the rule for every agent in the repository, and
`specs/engine/splice-writer.md` states it for the code:

> When the range cannot be located unambiguously, **return the input unchanged** and say why.
> Refusal is a correct outcome; guessing is not.

Read the register with two questions in mind. **Is this refusal correct?** A correct refusal stays
forever and gets a better message. **Is this refusal a defect?** A defect refusal is availability
lost to a gap in the locator, and it gets fixed.

Both kinds are here. Mixing them up is how a real defect gets defended as a design.

## 26.1 How to read the register

Column | What it holds
`nf-id` | The identifier, `nf-` plus three digits plus a slug, per `65-CONVENTIONS.md` section 3. **An id exists only when a spec file exists.** An id is never reused and never renumbered.
Input class | The shape of document that triggers it. A class, not one file.
Fixture | The file that reproduces it. A path, or `none` when nothing reproduces it yet.
Message shown | What the person sees. **`(silent)` is a real and common answer today**, and it is a finding.
Spec | The file that governs it, under `specs/`.
Status | `correct` the refusal is right and stays, `defect` it should not refuse, `open` no decision yet.

**Two ids are reserved and must not be minted for anything else.** `NF-2` and `NF-4` are named
defects in `specs/engine/nf-001-zero-indent-sequence.md` and
`specs/engine/nf-003-bare-cr-fence.md` with no spec file of their own yet. When their specs are
written they take `nf-002` and `nf-004`. **The next free number for anything else is `nf-005`.**

## 26.2 The register

`[O]` Built at `f237ece` from `ls specs/engine/`, `grep -rn "refus" src/ specs/` and the refusal
branches in `src/modules/share/domain/splice-frontmatter.ts`.

### The splice writer, `src/modules/share/domain/splice-frontmatter.ts`

nf-id | Input class | Fixture | Message shown | Spec | Status
`nf-001-zero-indent-sequence` | A YAML block sequence at column zero under a `key:` line, which is spec-valid, is PyYAML's default output and is idiomatic in real vaults. | `test/corpus/foreign/nf-001-red-proof.test.ts` | `(silent)`. The write does not happen and nothing says so. | `specs/engine/nf-001-zero-indent-sequence.md` | **defect**, availability only. Nothing is written wrongly.
none yet, reserved `nf-002` | A flow-sequence close bracket at column zero, `tags:` then `- a` then `]`. | none | `(silent)` | none. Named in `specs/engine/nf-001-zero-indent-sequence.md:67`. | **open**. Still refused after the NF-1 fix, and that is deliberate for now.
`nf-003-bare-cr-fence` | A front matter fence ending in a bare carriage return, `---\r` with no line feed, which classic Mac exporters emit. | `test/corpus/foreign/nf-003-red-proof.test.ts` | `(silent)`, and worse: the write **appears to succeed** while prepending a second front matter block. | `specs/engine/nf-003-bare-cr-fence.md` | **defect**, set-destructive. Ranked ahead of NF-1 despite being rarer.
none yet, reserved `nf-004` | A key outside `SAFE_KEY = /^[A-Za-z0-9_.$-]+$/`. A space, as in `date created`, or any non-ASCII letter. | none. The design and its measurement are `docs/ENGINE.md` section 75. | `(silent)` from the writer. The properties panel pre-checks and keeps the field open with the person's text still in it. | none. Named in `specs/engine/splice-writer.md`. | **open**. Correct today, because key equality is undecided. 936 of 942 files unlock once it is.
none | An unterminated front matter block, no closing fence. | none | `(silent)` | `specs/engine/splice-writer.md` | **correct**. Guessing where the block ends is guessing the document.
none | A duplicate top-level key, so the target is ambiguous. | none | `(silent)` | `specs/engine/splice-writer.md` | **correct**. Two candidates and no rule to choose.
none | A `rename` whose target key already exists. | none | `(silent)` from the writer. The panel refuses first, because renaming onto an existing key would silently merge or drop a value. | `specs/engine/splice-writer.md` | **correct**.
none | A `rename` whose new key would need quoting. | none | `(silent)` | `specs/engine/splice-writer.md` | **correct**.
none | A `delete` of a key that is already absent. | none | `(silent)` | `specs/engine/splice-writer.md` | **correct**. Nothing to do is not an error.
none | Any operation on front matter the walker cannot classify, such as a scalar document or a `%` directive. | none | `(silent)` | `specs/engine/splice-writer.md` | **correct**. The block is not a plain map.

### The shape gate, `src/modules/mdmax/domain/shape-gate.ts`

These are the only refusals in the engine with a **written message**, and the messages are in code,
in `explainFailure`. Quoted from source at `f237ece`.

nf-id | Input class | Fixture | Message shown | Spec | Status
none | A file over `MAX_BYTES`, 4 MiB. | none | "This file is N MB. The limit is 4 MB." | none | **correct**. A budget, stated.
none | A file over `MAX_LINES`, 200,000. | none | "This file has over 200,000 lines." | none | **correct**.
none | A file over `MAX_LIST_MARKER_LINES`, 20,000. | none | "This file has over 20,000 list items, which parses quadratically." | none | **correct**. The message names the reason.
none | Invalid UTF-8. | none | "This file is not valid UTF-8 (line L, column C). It was not changed." | none | **correct**, and the reasoning is the model for the rest. See 26.4.
none | Parsing over the time budget. | none | "Parsing took longer than N ms and was stopped." | none | **correct**.
none | The parser threw. | none | "This file could not be parsed: <first 120 characters>." | none | **correct**.
none | The parse worker died. | none | "The parser stopped unexpectedly. The file was not changed." | none | **correct**. It names the outcome the person cares about.

### The front matter pre-pass, `src/modules/mdmax/domain/frontmatter-prepass.ts`

nf-id | Input class | Fixture | Message shown | Spec | Status
none | A flow sequence whose first element is a wikilink, `[[[A]], [[B]]]`. | none | The verdict `REFUSED_AMBIGUOUS` carries a `reason` string and a `line`. No surface renders it yet. | none | **correct**. It parses successfully into nested arrays and destroys the link text, so a repair would be a guess about the intended nesting.

### The offset model, `src/modules/mdmax/domain/offsets.ts`

These refuse at the boundary rather than at the document, and they are how a bad offset is stopped
before it reaches a splice.

nf-id | Input class | Fixture | Message shown | Spec | Status
none | An offset that is not an integer. | none | `OffsetError` of kind `NOT_AN_INTEGER`, handled by the caller. | none | **correct**.
none | A negative offset. | none | `NEGATIVE` | none | **correct**.
none | An offset past the end of the text. | none | `PAST_END`, carrying the length. | none | **correct**.
none | An offset that lands inside a surrogate pair. | none | `INSIDE_SURROGATE_PAIR` | none | **correct**. Refusing rather than rounding is deliberate: a rounded offset is indistinguishable from a correct one.

### The certificate engine, `src/modules/mdmax/`

nf-id | Input class | Fixture | Message shown | Spec | Status
none | A bench engine that failed to load. | none | `CertFailure` with `reason: 'SHAPE_REFUSED'` and a detail string. | none | **correct**. A missing engine is a hard refusal, never a quietly smaller matrix reporting green.

### The vault snapshot, `src/modules/vault/application/get-snapshot.ts`

nf-id | Input class | Fixture | Message shown | Spec | Status
none | A `.md` file in the vault zipball that is not valid UTF-8. | none | `(silent to the person)`. A `console.error` names the path, the line and the column, and the file is skipped. | none | **correct** on the decode, **incomplete** on the surface. See 26.6.

## 26.3 The message, and the gap

**The template**, from `specs/engine/splice-writer.md`, holding until the refusal-UX spec lands:

1. **State what happened.**
2. **State that the file is unchanged.**
3. **State why.**
4. **Give one next step.**

**Every refusal names what was not changed.** That ordering is deliberate. A person told that an
operation failed will try again. A person told their file is untouched will read the reason.

**Now the gap, and it is the largest single finding in this file.** Of the 24 refusals in the register
above, **seven have a written message** and they are all in the shape gate. Every splice-writer
refusal is silent: the function returns the input unchanged, and the caller cannot tell a refusal
from a no-op, because both are the same string.

The consequence is recorded in the product code, at
`src/modules/preview/presentation/PropertiesPanel.tsx:125`, and it is worth reading in full because
it is an honest statement of the problem:

> A refusal reaches `emit` as an unchanged string and is dropped silently, which is right for the
> writer and wrong for a person who just typed a name.

The panel's workaround is to pre-check `SAFE_KEY` itself and keep the input field **open with the
person's text still in it**, so the add visibly did not happen rather than the field clearing and
closing as though it had. That is a good interaction and it is a patch over a missing return type.

**The fix is structural, not cosmetic.** The writer's signature is `(string) => string`, so a
refusal has nowhere to live. It becomes visible when the writer returns a result type carrying the
reason, which is exactly the shape `shape-gate.ts`, `frontmatter-prepass.ts` and `offsets.ts`
already use. All three return a discriminated union with a `reason` or `kind`. The splice writer is
the odd one out.

Two things must not be done while that is outstanding:

- **Do not make the writer throw** to signal a refusal. Invariant 2 of the splice contract forbids
  it, because a throw in a write path becomes data loss at a call site whose error handling was
  written for a network failure.
- **Do not let a caller infer a refusal from an unchanged string.** A `set` that writes the value
  already present also returns an unchanged string, and it is not a refusal.

## 26.4 The refusal that explains the rest

`decodeStrict` refuses invalid UTF-8 rather than repairing it, and the comment at
`src/modules/mdmax/domain/shape-gate.ts:56` gives the reasoning that generalises to every other row
in this register:

Repairing means substituting the replacement character, which **changes the byte length of the
document**. Every offset computed afterwards would then be correct for a document the person does
not have. Refusing is the only option that keeps offsets meaningful.

`src/modules/vault/application/get-snapshot.ts:170` states the same thing from the product end. A
non-fatal decoder turns an invalid byte into a replacement character, and that mojibake is what
gets committed back to git on the note's next save, permanently, without the person ever knowing a
byte changed.

**Generalise it.** A repair is a write the person did not ask for. A refusal is the absence of one.
When the two are close, the refusal is correct, because an unasked write cannot be undone by
someone who never knew it happened.

## 26.5 The four named defects, ranked

Rank | Defect | Class | Blast radius | Why here
1 | `nf-003-bare-cr-fence` | **set-destructive** | Rare. Measured zero occurrences across all 8,513 corpus files. | One `set` leaves the document with two front matter blocks. Correctness sequences ahead of availability even when rarer, recorded in `specs/engine/splice-writer.md` on 2026-08-29.
2 | `nf-001-zero-indent-sequence` | **availability** | 6,613 of 6,614 foreign refusals. 6,613 of 7,969 frontmatter-bearing files, **82.984 percent**. | Nothing is written wrongly. It is simply not written at all. About four days of work.
3 | NF-4, key addressability | **availability** | 942 unaddressable files, of which the design unlocks 936. | Blocked on a decision, not on work: what does key equality mean under Unicode normalisation.
4 | NF-2, flow close at column zero | **availability** | Not measured. | Still refused after the NF-1 fix, deliberately.

`docs/mvp0/PRODUCT-PLAN.md` section 17 gates any public claim on the first two being fixed.

**The corpus cannot see NF-3, and that is the point.** Measured on 2026-08-29 across all 8,513
files: zero bare-CR fences, zero CRLF fences, zero byte-order marks. A green corpus run says
nothing about them. A defect in one of those shapes needs a synthetic fixture, which is why both
red proofs carry a fixture **and** a corpus assertion.

## 26.6 Refusals that are not in this register

Naming the boundary keeps the register honest.

What | Where | Why it is out
Path traversal, and writing outside the vault | `src/modules/repository/application/commit-changes.ts:28` and `:30` | These **throw**. They are authorisation checks in the repository module, not engine refusals, and a throw is correct there because the caller must not proceed.
Refusing to open the same note in both editor panes | `src/modules/editor/presentation/editor-store.ts:153` | A user-interface constraint.
The properties panel's pre-checks | `src/modules/preview/presentation/PropertiesPanel.tsx` | These mirror engine refusals at the point of typing. They are the surface, not the rule. When the engine's rule changes, the mirror must change with it, and nothing enforces that pair.
The vault snapshot's skip on invalid UTF-8 | `src/modules/vault/application/get-snapshot.ts` | It **is** an engine refusal, and it is in the register above. It is listed here too because its surface is a `console.error` and a skipped file. **A person opening a vault sees a note missing and no reason given.** That needs a real surface.

## 26.7 How to add a refusal

In order. Skipping step 1 is how an id gets minted twice.

1. **Check the register.** If the shape is already refused, add the fixture rather than a new row.
2. **Decide the class.** `correct` means it stays and gets a better message. `defect` means the
   locator has a gap. Write down which, and why, before writing code.
3. **Write the fixture first, and make it fail.** `AGENTS.md:10` is the rule: a test on a rare fault
   proves nothing until it fails against the unfixed code. If you cannot make it fail, say the test
   does not cover the bug rather than reporting a pass.
4. **Mint the id only when you write the spec.** `nf-005` is next. Add the spec to `specs/engine/`,
   with `governs:` naming the fixture, `depends_on: [engine/splice-writer]`, and a `verify:` block.
5. **Write the message** against the four-part template in 26.3.
6. **Add the row here**, with every column filled. `none` is an acceptable value. A blank is not.
7. **Run the gates.** `npm run corpus`, `npm run spec`, then the fixture.

**One file, one owner.** `specs/engine/splice-writer.md` owns the writer source. A defect spec owns
its red proof and depends on the writer spec. Two specs claiming the same path is refused by the
gate, and the reason is that otherwise two specs go stale, each believing the other is current.

## 26.8 How to check any claim in this file

Claim | Command
Which specs exist | `ls specs/engine/`
Which fixtures exist | `ls test/corpus/foreign/*.test.ts`
The fixtures are in their expected state | `npx vitest run test/corpus/foreign/`
The shape-gate messages, verbatim | `sed -n '/export function explainFailure/,/^}/p' src/modules/mdmax/domain/shape-gate.ts`
Every refusal branch in the writer | `grep -n "return src" src/modules/share/domain/splice-frontmatter.ts`
Every refusal in the source | `grep -rn "refus\|Refus\|REFUS" src/ --include='*.ts' --include='*.tsx'`
The defect ids in use | `grep -rno "nf-[0-9][0-9][0-9][a-z-]*" specs/ src/ test/ \| grep -o 'nf-[0-9]*' \| sort -u`
The corpus is intact | `npm run corpus`

## 26.9 Limits of this file

- **What was not assessed.** Whether each refusal classed `correct` is the best behaviour for the
  person, as opposed to the safest for the file. Those are different questions and only the first
  needs a design decision.
- **What could not be verified.** The blast radius of NF-2 and NF-4 beyond the counts already in
  `docs/ENGINE.md` and the specs. Neither has a runnable measurement in this repository.
- **What is missing.** Fixtures. Of the rows above, **two have one**, both for the defects that
  already have specs. Every `correct` refusal is unfixtured, which means nothing would notice if one
  of them silently stopped refusing.
- **What is not established.** That this register is complete. It was built by grepping for the word
  refuse and by reading the writer's branches. A refusal that neither uses the word nor returns the
  input at a branch this file read is not here.
- **What would falsify this file.** A refusal reaching a person as a thrown error, an id minted
  outside `specs/engine/`, an `nf-002` or `nf-004` used for anything other than NF-2 and NF-4, or a
  `correct` row that turns out to drop bytes.
- **Freshness.** Pinned to `f237ece`. The register is a living document and the counts in 26.5 come
  from measurements dated 2026-08-29. Re-derive before quoting.
