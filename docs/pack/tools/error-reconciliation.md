# Error id reconciliation, 18 September 2026

**Working file.** It records how 270 provisional `E` ids in `docs/pack/12-screens/S01.md` to
`S38.md` were collapsed and moved into `docs/pack/17-ERROR-AND-REFUSAL-CATALOGUE.md`, which is the
one home for every error and refusal id.

This file lives under `tools/`, so `validate-pack.py` does not read it and it carries no front
matter. It is kept because the mapping is the audit trail. Delete it and the next reader cannot
tell whether `E048` on a screen became `E026` by reasoning or by accident.

## 1. The defect this fixes

Two writers allocated `E` ids at the same time on two schemes.

- **The 38 screen specs allocated by screen.** S04 took `E040` to `E049`, S17 took `E170` to
  `E179`, and so on. **270 distinct ids.**
- **The catalogue allocated by category.** Engine `E001` to `E025`, validation `E030` to `E041`,
  permission `E050` to `E060`, quota `E070` to `E079`, model `E080` to `E087`, provider `E090` to
  `E097`, network `E100` to `E104`, conflict `E110` to `E117`. **87 ids.**
- **72 ids appeared in both and meant different things.** A reader who met `E041` on a screen and
  looked it up in the catalogue got the wrong error. That is worse than a missing id, because it
  looks right.

## 2. The rule that decided it

**One fact, one home**, `65-CONVENTIONS.md` section 1. `17-ERROR-AND-REFUSAL-CATALOGUE.md` is the
home for every error and refusal id. The screens cite it. Nothing else allocates an `E` id.

**Never renumber**, same section, rule 3. Every id already in the catalogue keeps exactly the
meaning it has. Not one of the 87 moved.

## 3. How the blocks were extended, and why they had to be

The eight category blocks had **32 free slots** between them and the deduplicated screen set needed
**82**. So each class keeps its first-tier block untouched, fills the free space inside it, then
continues in a second tier of its own. The second tier starts at `E500`, and the highest provisional
id anywhere in the screens was `E429`, so **no second-tier id can be confused with a provisional one**.

Class | First tier, unchanged | Free space filled | Second tier | New ids used
`engine` | `E001` to `E025` | `E026` to `E029` | `E500` to `E549` | 17
`validation` | `E030` to `E041` | `E042` to `E049` | `E550` to `E599` | 23
`permission` | `E050` to `E060` | `E061` to `E069` | `E600` to `E649` | 12
`quota` | `E070` to `E079` | none, the block was full | `E650` to `E699` | 4
`model` | `E080` to `E087` | `E088` to `E089` | `E700` to `E749` | 3
`provider` | `E090` to `E097` | `E098` to `E099` | `E750` to `E799` | 8
`network` | `E100` to `E104` | `E105` to `E109` | `E800` to `E849` | 11
`conflict` | `E110` to `E117` | `E118` to `E119` | `E850` to `E899` | 4

**Quota was the one full block.** `E070` to `E079` had no gap, so all four of its new rows sit in
the second tier.

New rows carry test ids from **`T300`**, because `19-ACCEPTANCE-CRITERIA.md` already holds `T001` to
`T205` and the two files share one `T` namespace. Re-derived at write time:

```
grep -rho '\bT[0-9]\{3\}\b' docs/pack --include='*.md' | sort -u | tail -1   ->  T205
```

## 4. What the counting was

Command | Result
`grep -rho '\bE[0-9]\{3\}\b' docs/pack --include='*.md' \| sort -u \| wc -l` before | 286
distinct ids inside the 38 screen bodies, notes excluded | 180
`(screen, id)` pairs inside those bodies | 243
ids in the catalogue before, re-counted by the resumed pass | 87
**new catalogue rows added** | **82**
ids in the catalogue after, re-counted by the resumed pass | 169

**243 screen mentions collapsed to 82 new errors**, because most screens describe the same few
underlying facts: a read failed, a write failed, a range could not be located, a cap was reached, the
model chain was exhausted, the named thing is not there.

## 5. The eighteen collapses that did most of the work

Provisional ids from many screens | Collapsed to | Why they are one fact
`E014` `E021` `E033` `E042` `E056` `E129` `E135` `E270` `E281` `E282` `E305` `E311` `E360` `E370` `E383` `E413` `E422` | `E106` | A write this product made failed. The control returns to its stored state and nothing is claimed
`E027` `E037` `E039` `E049` `E104` `E110` `E128` `E271` `E285` `E330` `E340` `E343` `E344` `E360` `E370` `E371` `E384` | `E105` | A read this screen depends on failed. The part it feeds says so and the rest still works
`E048` `E052` `E053` `E071` `E084` `E103` `E193` `E201` `E212` | `E026` | A splice range cannot be located unambiguously, so nothing is written
`E031` `E064` `E087` `E094` `E124` `E128` `E310` `E321` `E344` `E391` | `E042` | The named record no longer exists
`E015` `E020` `E030` `E040` `E065` `E280` `E312` | `E044` | An unknown route, settings slug or target
`E060` `E062` `E072` `E127` `E133` `E313` `E320` `E342` | `E080` | Every provider in the free chain refused or timed out
`E022` `E034` `E043` `E070` | `E070` | At the document cap
`E024` `E045` `E054` `E123` `E220` | `E038` | Past the per-file upload cap
`E026` `E047` `E036` `E380` | `E801` | The browser has no directory picker
`E311` `E324` `E335` | `E108` | The clipboard refused, so the string is shown to select
`E032` `E041` `E050` | `E066` | The record belongs to another account
`E080` `E081` `E088` | `E502` | A chart block cannot be built from what is above it
`E082` `E083` | `E501` | A custom block's source does not parse, so the source is shown
`E093` `E107` `E323` `E372` | `E504` | A build, a drawing or a check exceeded its budget
`E122` `E300` `E303` `E333` | `E650` | The plan does not include this feature
`E290` `E331` `E341` `E381` | `E651` | A limit or a ledger could not be read, so the safe direction is taken
`E352` `E365` `E372` | `E119` | A row or a flag changed underneath since it was read
`E139` `E321` `E333` | `E555` | No standard question set exists for this template

## 6. The 82 new catalogue rows

### 6.1 Engine, 17 new

Id | What it is | Unchanged | Came from
`E026` | A splice range in the document body cannot be located unambiguously | `yes` | S04, S05, S06, S07, S08, S09, S10, S14, S19, S20, S21
`E027` | The document changed under a proposal, so its recorded range no longer matches | `yes` | S07, S09, S10, S20
`E028` | A fenced block in the body is unterminated, so its range cannot be closed | `yes` | S08
`E029` | A check, a parse or a graph build threw, so its result is absent and the failing part is named | `yes` | S10, S16
`E500` | A table row's cell count does not match its header, so the table editor refuses the edit | `yes` | S08
`E501` | A custom block's source does not parse, so the source is shown instead of a rendering | `yes` | S08
`E502` | A chart block has no table above it, no numeric column, or an unknown kind | `yes` | S08
`E503` | A callout names a kind we do not know, so it falls back to a plain blockquote | `yes` | S08
`E504` | A build, a drawing or a check exceeds its budget, so a narrower result is drawn and the limit is named | `yes` | S09, S10, S16, S21
`E505` | The document has no H2, so the flow projection has no column to make | `yes` | S09
`E506` | An H3 appears before any H2, so that step has no phase | `yes` | S09
`E507` | No fix in the set can be applied safely, so none is applied and the panel says so | `yes` | S10
`E508` | Two files have drifted too far for a clean diff | `yes` | S11
`E509` | A file in a set fails to parse, so it is named and the rest still process | `yes` | S16, S25
`E510` | Doc mode has no carrier for a feature in the file, so the toast names it | `yes` | S04, S05
`E511` | An export could not be produced, so nothing is downloaded and nothing is changed | `yes` | S03, S05
`E512` | A derived view is stale, so it is rebuilt before it is shown and says so | `yes` | S15

### 6.2 Validation, 23 new

Id | What it is | Unchanged | Came from
`E042` | A named document, version, idea, file, node or attachment no longer exists | `n/a` | S03, S06, S08, S09, S12, S15, S16, S18, S23
`E043` | A reference resolves to a file but not to the anchor inside it | `n/a` | S16
`E044` | A request names a route, a settings slug or a target the product does not know | `n/a` | S01, S02, S03, S04, S06, S15, S28
`E045` | A public slug is requested that is not published, so a plain not-found is served | `n/a` | S18
`E046` | A required field is empty, or below the minimum the flow needs | `n/a` | S06, S07, S12, S36, S38
`E047` | An input is longer than the flow accepts | `n/a` | S06, S07
`E048` | A submitted value is not valid for its field | `yes` | S05, S17, S30, S35
`E049` | A project rule file does not parse, or names a rule the checker does not have | `yes` | S10
`E550` | A name, handle or address the person chose is already in use | `n/a` | S17, S30, S31
`E551` | The thing the action would create already exists, so it is offered and never overwritten | `yes` | S30
`E552` | An instruction set's source file is missing, so its copies are orphans rather than up to date | `yes` | S11
`E553` | A third-party tool's published cap is unknown, so the row says unknown rather than ok | `n/a` | S11
`E554` | A tool has no import mechanism, so a copy is offered instead | `n/a` | S11
`E555` | No standard question set exists for this template | `n/a` | S13, S32, S33
`E556` | No desktop build exists for this platform | `n/a` | S33
`E557` | No local model is installed | `yes` | S32
`E558` | A search matched nothing, said plainly and without guessing at a near match | `n/a` | S38
`E559` | A drop carries no readable entries | `n/a` | S22
`E560` | A file's type is not one the product can open or convert | `n/a` | S02, S04, S12
`E561` | A conversion failed, so the original is kept as an attachment and said so | `yes` | S22
`E562` | The person cancelled at the provider, so they return to the card with nothing changed | `n/a` | S01
`E563` | No portfolio handle is claimed, so the page cannot publish | `n/a` | S30
`E564` | A generator returned a set that fails its own schema | `n/a` | S14

### 6.3 Permission, 12 new

Id | What it is | Unchanged | Came from
`E061` | A provider account the allowlist refuses | `n/a` | S01
`E062` | A control is reached that this screen does not own, so nothing happens and the attempt is audited | `n/a` | S36, S37, S38
`E063` | The last owner of a document would be demoted or removed | `n/a` | S17
`E064` | The operating system refused access to a folder | `n/a` | S25
`E065` | Access was withdrawn while the document was open | `yes` | S19
`E066` | The record belongs to another account | `n/a` | S03, S04, S14, S16
`E067` | A link password is wrong | `n/a` | S18
`E068` | A link has expired | `n/a` | S18
`E069` | A payment is in flight, so the account cannot be deleted until it settles | `n/a` | S28
`E600` | An update's signature does not verify, so the update is refused rather than installed | `n/a` | S25
`E601` | A revoked link returns a plain refusal, never a redirect to sign-in | `n/a` | S15
`E602` | A feature flag is off, so the control is not offered and the screens say why rather than 404 | `n/a` | S32, S37

### 6.4 Quota, 4 new, and the block was full

Id | What it is | Unchanged | Came from
`E650` | The plan does not include the feature that was chosen | `n/a` | S12, S14, S17, S30
`E651` | A limit or a ledger could not be read, so the action takes the safe direction | `n/a` | S29, S33, S34, S38
`E652` | A capped action was refused and S33 was shown, with the entitlement id in the log | `yes` | S33
`E653` | An impact preview could not be computed, so the save is blocked | `yes` | S35

### 6.5 Model, 3 new

Id | What it is | Unchanged | Came from
`E088` | A background research pass failed, so a shallower evidence level is offered and nothing is charged | `n/a` | S14
`E089` | A routing cell names a model that no enabled provider serves | `n/a` | S36
`E700` | The model returned the input unchanged, which is a correct outcome and not a failure | `yes` | S07

### 6.6 Provider, 8 new

Id | What it is | Unchanged | Came from
`E098` | Consent was refused at the provider's own screen, so nothing is stored | `n/a` | S23
`E099` | A revocation call to the provider failed | `n/a` | S23, S28
`E750` | A provider refused a connection attempt and named why | `n/a` | S28
`E751` | An integration source is unreachable, so it is named and the others stay | `n/a` | S12, S22
`E752` | A verb is not available on the provider the chain chose | `yes` | S07
`E753` | An email address is not deliverable | `n/a` | S25
`E754` | A call to the payment provider failed, so no charge was made and no plan changed | `n/a` | S29
`E755` | The payment webhook has not landed inside the wait | `n/a` | S29

### 6.7 Network and the device, 11 new

Id | What it is | Unchanged | Came from
`E105` | A read this screen depends on failed, so the part it feeds says so and the rest still works | `n/a` | S02, S03, S04, S10, S11, S12, S17, S20, S21, S27, S28, S34, S38
`E106` | A write this product made failed, so the control returns to its stored state | `yes` | S01, S02, S03, S04, S05, S12, S13, S25, S26, S27, S28, S30, S31, S36, S37, S38
`E107` | Browser storage refused the write, or is full, so the keystroke is not being kept | `yes` | S24
`E108` | The clipboard refused, so the string is shown to select | `n/a` | S15, S16, S17
`E109` | An action that needs the network was attempted offline and cannot be queued | `n/a` | S01
`E800` | The browser blocked a popup | `n/a` | S01
`E801` | The browser has no directory picker, so file selection is offered instead | `n/a` | S02, S03, S04, S22
`E802` | The browser's install prompt is unavailable, so its own menu route is named | `n/a` | S26
`E803` | A protocol handler did not answer in time, so the web option is used | `n/a` | S18
`E804` | A global shortcut is already claimed by another application | `n/a` | S26
`E805` | The viewport is too small for this surface, so it is not offered and the reason is named | `n/a` | S06, S09

### 6.8 Conflict, 4 new

Id | What it is | Unchanged | Came from
`E118` | A regenerate would overwrite hand edits, so it refuses | `yes` | S11
`E119` | A row or a flag changed underneath since it was read, so nothing is written and the row is named | `yes` | S35, S36, S37
`E850` | One side of a conflict cannot be read, so the readable side is shown and no keep control is offered | `yes` | S31
`E851` | An unresolved conflict blocks the edit | `yes` | S07

## 7. One defect found in the catalogue on the way

`17-ERROR-AND-REFUSAL-CATALOGUE.md` section 1.1 read: "`E100` re-reads and retries under
compare-and-swap, and `E106` writes conflict markers into a draft that only exists locally."

Both ids were wrong. Section 8 shows the compare-and-swap row is **`E111`** and the three-way merge
row is **`E115`**, and those are the two rows whose `unchanged` column says `no`. `E100` is the
offline save, which queues. `E106` did not exist at all.

It is corrected in place. It had to be, because `E106` is one of the ids this pass allocates, and a
stale pointer at a live id is the exact defect this whole pass exists to remove.

## 8. Judgement calls, written down so they can be argued with

1. **Our own read and write failures live in `network`.** The eight classes have no class for "our
   store or our route failed". `E102`, "A request to our own API times out", already sat in
   `network`, so `E105` and `E106` follow it. The class covers the connection, the browser and the
   device, and this stretches it. **A ninth class would be the cleaner answer and is left for the
   catalogue's owner to decide.**
2. **Body block rendering lives in `engine`.** A chart, a Mermaid diagram or a callout that cannot
   render is a projection failing, and the shape gate and the parser are already engine rows. They
   are kept out of catalogue section 1, whose opening sentence says every row in it was read from
   shipped source, and put in a separate section that says they are specified and not built.
3. **`E026` and `E084` are deliberately two rows.** `E084` is the model layer's own row, "the model
   returned a proposal whose range cannot be spliced", and catalogue section 5 makes it load-bearing.
   `E026` is the general case: any splice, from a keystroke, a toolbar mark, a restore or a queue
   item. A screen cites `E084` only where the proposal came from the model.
4. **`E070` absorbed the mid-import cap.** S22 refuses mid-run at the document cap. That is `E070`'s
   trigger, and "what already landed stays" is S22's behaviour rather than a second error.
5. **S03's two unlabelled ids were inferred.** `Drop a folder | begins an import | `E036`, `E035``
   named neither. S02 and S04 pair the same action with "folder upload unsupported by the browser"
   and "over the upload cap", so `E036` reads as `E801` and `E035` as `E074`. **INFERENCE:**, and
   the only pair in the 243 where the screen did not state what the error was.
6. **S05's `E052`, `E053` pair collapsed to one.** "Apply an inline mark" listed two ids with one
   description between them. Both are the ambiguous range, so the row now cites `E026` once.
7. **Two screens disagree about a failed revocation.** S23 removes the row and names the manual
   step. S28 keeps the row and says so. Both are `E099`. The disagreement is recorded rather than
   settled here, per the author brief.

8. **Resumed pass, 18 September: what changed from sections 5 and 6, and why.** The first pass
   was lost to a usage limit before section 12 existed. The resuming pass re-read every screen line
   that carries an `E` token and kept every section 6 row. It changed these mappings:
   - **S09 `E048` and S10 `E103` go to `E027`, not `E026`.** Section 5 put `E103` under `E026` while
     section 6 lists S09 and S10 as sources of `E027`. Both lines say "the range moved", which is
     `E027`'s meaning exactly, so the more precise row wins.
   - **S04 `E044` is `E074`.** It is unlabelled on four lines. Note 5 reads S02 and S04 as pairing
     "folder upload unsupported" with "over the upload cap", so it follows. **INFERENCE:**.
   - **Six screen ids map to existing rows the first pass did not name.** S05 `E055` and S20 `E361`
     to `E023` (an anchor that cannot be re-found). S05 `E057` to `E013` (front matter does not
     parse). S06 `E068` and S13 `E134` to `E082` (a pool is spent). S11 `E117` and S12 `E126` to
     `E083` (the call failed). S13 `E132` to `E086`, which is how S14 already uses `E086`.
   - **Three screens cited a catalogue id with the wrong meaning.** S25 `E097` means an address
     that cannot be delivered, so it becomes `E753`. S19 `E053` means access withdrawn, so it becomes
     `E065`. S14 and S16 `E050` mean another account's record, so they become `E066`.
9. **One id cannot always carry one meaning inside one screen.** S12 uses `E122`, `E124` and `E128`
   for two different facts each. A token map cannot split them, so section 12.2 lists three line
   fixes that must be applied by line, not by token.
10. **Section 7's fix had not been applied.** The first pass recorded it as done. The catalogue still
    named `E100` and `E106` in section 1.1 when this pass opened it. This pass applies it.

## 9. The mechanical proof

Run from the repository root after the catalogue edit of 18 September. It checks that every screen is
in the map, that the map covers every `E` token in every screen, and that every non-null target is a
catalogue row.

```python
import json, re, glob
cat = set(re.findall(r'^`(E\d{3})` \|', open("docs/pack/17-ERROR-AND-REFUSAL-CATALOGUE.md").read(), re.M))
m = json.load(open("docs/pack/tools/error-map.json"))
screens = sorted(p.split("/")[-1][:-3] for p in glob.glob("docs/pack/12-screens/S*.md"))
missing_screens = [s for s in screens if s not in m]
untotal = [(s, t) for s in screens
           for t in set(re.findall(r'\bE\d{3}\b', open(f"docs/pack/12-screens/{s}.md").read()))
           if t not in m.get(s, {})]
targets = [v for d in m.values() for v in d.values()]
nulls = sum(1 for v in targets if v is None)
dangling = sorted({v for v in targets if v is not None and v not in cat})
print("catalogue rows:", len(cat))
print("screens in map:", len(m), "of", len(screens), "| missing:", missing_screens)
print("tokens mapped:", len(targets), "| tokens not in map:", len(untotal))
print("null targets (note-only, no home):", nulls)
print("non-null targets missing from catalogue:", len(dangling), dangling)
```

Output, 18 September:

```
catalogue rows: 169
screens in map: 38 of 38 | missing: []
tokens mapped: 480 | tokens not in map: 0
null targets (note-only, no home): 14
non-null targets missing from catalogue: 0 []
```

**Red proof.** The same script with `E851` and `E105` removed from `cat` in memory prints
`non-null targets missing from catalogue: 2 ['E105', 'E851']`, so the check can fail.

**The 14 nulls** are the provisional block ends quoted only in a provenance note: S13 `E130`, S19
`E350`, and S27 to S38 `E279` to `E389`. Section 12.1 says to rewrite those notes, not map them.

**After the coordinator applies the map**, this must print nothing:

```
comm -23 <(grep -rho '\bE[0-9]\{3\}\b' docs/pack --include='*.md' | sort -u) \
         <(grep -o '\bE[0-9]\{3\}\b' docs/pack/17-ERROR-AND-REFUSAL-CATALOGUE.md | sort -u)
```

## 10. Limits of this file

- **What was not assessed.** Whether each new row's `recovery` is the right product answer. This
  pass moved ids and collapsed duplicates. It did not redesign a single error.
- **What could not be verified.** Every new row is `specified, not built`. None was triggered in a
  running browser, and none has a test. The `T300` ids are proposals.
- **What is not established.** The class of the sixteen rows in section 8 note 1 and note 2. They
  are placed on a stated argument, not on a rule the catalogue already had.
- **What would falsify it.** A ninth class for our own infrastructure, which would move `E105`,
  `E106` and `E107` out of `network`. Or a founders' decision on the S23 and S28 disagreement,
  which would split `E099` in two.

## 11. The per-screen mapping

The table below is the rewrite instruction. Every provisional id in every screen file, what the
screen said it was, and the catalogue id it became. Read `-> E0xx` as "this id was replaced by that
one in that file".

See section 12.

## 12. The per-screen mapping, human-readable

`docs/pack/tools/error-map.json` is the machine-readable copy of this section. The two must agree.
The JSON is total: every `E` token in every screen file has a key, including the provenance note.

### 12.1 How to apply it

- **Apply the map only below the first `## ` heading of each screen.** The provenance blockquote
  above it quotes the old catalogue ranges (`E001` to `E025` and so on) and the screen's own
  provisional block (`E040` to `E049`). The same token can mean the range boundary there and a
  screen error in the body, as S02 `E025`, S03 `E030`, S04 `E041` and S11 `E117` do.
- **Rewrite the provenance blockquote by hand instead.** Its allocation sentence describes the scheme
  this pass retires, so no token map can make it true.
- **`identity`** means the screen already meant the catalogue's meaning. The token stays.
- **`note only`** means the token appears only in the provenance blockquote. It maps to itself where
  the catalogue holds that id, and to `null` where it does not. A `null` is never written into a file.

### 12.2 Three fixes that must be applied by line, not by token

S12 uses three ids for two facts each. The JSON carries the first meaning; these lines take the second.

Screen | Line text today | Becomes | Why
S12 | `no credit `E122`` in the Send row | `E072` | No blueprint credit is `E072`. `E122` elsewhere is the Pro depth, `E650`
S12 | `the document was removed `E124`` in Attach a document | `E042` | A removed record is `E042`. `E124` elsewhere is an unsupported file, `E560`
S12 | `the template failed to load `E128`` in Choose a template | `E105` | A failed read is `E105`. `E128` elsewhere is a deleted idea, `E042`

One body sentence also reads oddly after the map. S08 says "`E080` through `E084` all", which the map turns
into "`E502` through `E503`". It should read "`E501`, `E502` and `E503` all".

### 12.3 The map

Screen | Provisional id | Catalogue id | Kind
S01 | `E001` | `E001` | note only
S01 | `E010` | `E061` | remapped
S01 | `E011` | `E800` | remapped
S01 | `E012` | `E562` | remapped
S01 | `E013` | `E109` | remapped
S01 | `E014` | `E106` | remapped
S01 | `E015` | `E044` | remapped
S01 | `E019` | `E019` | note only
S01 | `E025` | `E025` | note only
S01 | `E030` | `E030` | note only
S01 | `E041` | `E041` | note only
S01 | `E050` | `E050` | note only
S01 | `E060` | `E060` | note only
S01 | `E070` | `E070` | note only
S01 | `E079` | `E079` | note only
S01 | `E080` | `E080` | note only
S01 | `E087` | `E087` | note only
S01 | `E090` | `E090` | note only
S01 | `E097` | `E097` | note only
S01 | `E100` | `E100` | note only
S01 | `E104` | `E104` | note only
S01 | `E110` | `E110` | note only
S01 | `E117` | `E117` | note only
S02 | `E001` | `E001` | note only
S02 | `E020` | `E044` | remapped
S02 | `E021` | `E106` | remapped
S02 | `E022` | `E070` | remapped
S02 | `E023` | `E074` | remapped
S02 | `E024` | `E038` | remapped
S02 | `E025` | `E560` | remapped
S02 | `E026` | `E801` | remapped
S02 | `E027` | `E105` | remapped
S02 | `E029` | `E029` | note only
S02 | `E030` | `E030` | note only
S02 | `E041` | `E041` | note only
S02 | `E050` | `E050` | note only
S02 | `E060` | `E060` | note only
S02 | `E070` | `E070` | note only
S02 | `E079` | `E079` | note only
S02 | `E080` | `E080` | note only
S02 | `E087` | `E087` | note only
S02 | `E090` | `E090` | note only
S02 | `E097` | `E097` | note only
S02 | `E100` | `E100` | note only
S02 | `E104` | `E104` | note only
S02 | `E110` | `E110` | note only
S02 | `E117` | `E117` | note only
S03 | `E001` | `E001` | note only
S03 | `E025` | `E025` | note only
S03 | `E030` | `E044` | remapped
S03 | `E031` | `E042` | remapped
S03 | `E032` | `E066` | remapped
S03 | `E033` | `E106` | remapped
S03 | `E034` | `E070` | remapped
S03 | `E035` | `E074` | remapped
S03 | `E036` | `E801` | remapped
S03 | `E037` | `E105` | remapped
S03 | `E038` | `E511` | remapped
S03 | `E039` | `E105` | remapped
S03 | `E041` | `E041` | note only
S03 | `E050` | `E050` | note only
S03 | `E060` | `E060` | note only
S03 | `E070` | `E070` | note only
S03 | `E079` | `E079` | note only
S03 | `E080` | `E080` | note only
S03 | `E087` | `E087` | note only
S03 | `E090` | `E090` | note only
S03 | `E097` | `E097` | note only
S03 | `E100` | `E100` | note only
S03 | `E104` | `E104` | note only
S03 | `E110` | `E110` | note only
S03 | `E117` | `E117` | note only
S04 | `E001` | `E001` | note only
S04 | `E025` | `E025` | note only
S04 | `E030` | `E030` | note only
S04 | `E040` | `E044` | remapped
S04 | `E041` | `E066` | remapped
S04 | `E042` | `E106` | remapped
S04 | `E043` | `E070` | remapped
S04 | `E044` | `E074` | remapped
S04 | `E045` | `E038` | remapped
S04 | `E046` | `E560` | remapped
S04 | `E047` | `E801` | remapped
S04 | `E048` | `E026` | remapped
S04 | `E049` | `E105` | remapped
S04 | `E050` | `E510` | remapped
S04 | `E060` | `E080` | remapped
S04 | `E061` | `E071` | remapped
S04 | `E070` | `E070` | note only
S04 | `E079` | `E079` | note only
S04 | `E080` | `E080` | note only
S04 | `E087` | `E087` | note only
S04 | `E090` | `E090` | note only
S04 | `E097` | `E097` | note only
S04 | `E100` | `E100` | note only
S04 | `E104` | `E104` | note only
S04 | `E110` | `E110` | note only
S04 | `E117` | `E117` | note only
S05 | `E001` | `E001` | note only
S05 | `E025` | `E025` | note only
S05 | `E030` | `E030` | note only
S05 | `E041` | `E041` | note only
S05 | `E050` | `E510` | remapped
S05 | `E051` | `E048` | remapped
S05 | `E052` | `E026` | remapped
S05 | `E053` | `E026` | remapped
S05 | `E054` | `E038` | remapped
S05 | `E055` | `E023` | remapped
S05 | `E056` | `E106` | remapped
S05 | `E057` | `E013` | remapped
S05 | `E058` | `E511` | remapped
S05 | `E059` | `E059` | note only
S05 | `E060` | `E060` | note only
S05 | `E070` | `E070` | note only
S05 | `E079` | `E079` | note only
S05 | `E080` | `E080` | note only
S05 | `E087` | `E087` | note only
S05 | `E090` | `E090` | note only
S05 | `E097` | `E097` | note only
S05 | `E100` | `E100` | note only
S05 | `E104` | `E104` | note only
S05 | `E110` | `E110` | note only
S05 | `E117` | `E117` | note only
S06 | `E001` | `E001` | note only
S06 | `E025` | `E025` | note only
S06 | `E030` | `E030` | note only
S06 | `E041` | `E041` | note only
S06 | `E048` | `E026` | remapped
S06 | `E050` | `E050` | note only
S06 | `E060` | `E080` | remapped
S06 | `E061` | `E071` | remapped
S06 | `E062` | `E080` | remapped
S06 | `E063` | `E085` | remapped
S06 | `E064` | `E042` | remapped
S06 | `E065` | `E044` | remapped
S06 | `E066` | `E046` | remapped
S06 | `E067` | `E047` | remapped
S06 | `E068` | `E082` | remapped
S06 | `E069` | `E805` | remapped
S06 | `E070` | `E070` | note only
S06 | `E079` | `E079` | note only
S06 | `E080` | `E080` | note only
S06 | `E087` | `E087` | note only
S06 | `E090` | `E090` | note only
S06 | `E097` | `E097` | note only
S06 | `E100` | `E100` | note only
S06 | `E104` | `E104` | note only
S06 | `E110` | `E110` | note only
S06 | `E117` | `E117` | note only
S07 | `E001` | `E001` | note only
S07 | `E025` | `E025` | note only
S07 | `E030` | `E030` | note only
S07 | `E041` | `E041` | note only
S07 | `E050` | `E050` | note only
S07 | `E060` | `E060` | note only
S07 | `E070` | `E046` | remapped
S07 | `E071` | `E026` | remapped
S07 | `E072` | `E080` | remapped
S07 | `E073` | `E071` | remapped
S07 | `E074` | `E700` | remapped
S07 | `E075` | `E027` | remapped
S07 | `E076` | `E047` | remapped
S07 | `E077` | `E053` | remapped
S07 | `E078` | `E752` | remapped
S07 | `E079` | `E851` | remapped
S07 | `E080` | `E080` | note only
S07 | `E087` | `E087` | note only
S07 | `E090` | `E090` | note only
S07 | `E097` | `E097` | note only
S07 | `E100` | `E100` | note only
S07 | `E104` | `E104` | note only
S07 | `E110` | `E110` | note only
S07 | `E117` | `E117` | note only
S08 | `E001` | `E001` | note only
S08 | `E025` | `E025` | note only
S08 | `E030` | `E030` | note only
S08 | `E041` | `E041` | note only
S08 | `E048` | `E026` | remapped
S08 | `E050` | `E050` | note only
S08 | `E060` | `E060` | note only
S08 | `E070` | `E070` | note only
S08 | `E079` | `E079` | note only
S08 | `E080` | `E502` | remapped
S08 | `E081` | `E502` | remapped
S08 | `E082` | `E501` | remapped
S08 | `E083` | `E501` | remapped
S08 | `E084` | `E503` | remapped
S08 | `E085` | `E028` | remapped
S08 | `E086` | `E500` | remapped
S08 | `E087` | `E042` | remapped
S08 | `E088` | `E502` | remapped
S08 | `E089` | `E089` | note only
S08 | `E090` | `E090` | note only
S08 | `E097` | `E097` | note only
S08 | `E100` | `E100` | note only
S08 | `E104` | `E104` | note only
S08 | `E110` | `E110` | note only
S08 | `E117` | `E117` | note only
S09 | `E001` | `E001` | note only
S09 | `E025` | `E025` | note only
S09 | `E030` | `E030` | note only
S09 | `E041` | `E041` | note only
S09 | `E048` | `E027` | remapped
S09 | `E050` | `E050` | note only
S09 | `E060` | `E060` | note only
S09 | `E070` | `E070` | note only
S09 | `E079` | `E079` | note only
S09 | `E080` | `E080` | note only
S09 | `E087` | `E087` | note only
S09 | `E090` | `E505` | remapped
S09 | `E091` | `E506` | remapped
S09 | `E093` | `E504` | remapped
S09 | `E094` | `E042` | remapped
S09 | `E095` | `E805` | remapped
S09 | `E097` | `E097` | note only
S09 | `E099` | `E099` | note only
S09 | `E100` | `E100` | note only
S09 | `E104` | `E104` | note only
S09 | `E110` | `E110` | note only
S09 | `E117` | `E117` | note only
S10 | `E001` | `E001` | note only
S10 | `E025` | `E025` | note only
S10 | `E030` | `E030` | note only
S10 | `E041` | `E041` | note only
S10 | `E050` | `E050` | note only
S10 | `E060` | `E060` | note only
S10 | `E070` | `E070` | note only
S10 | `E079` | `E079` | note only
S10 | `E080` | `E080` | note only
S10 | `E087` | `E087` | note only
S10 | `E090` | `E090` | note only
S10 | `E097` | `E097` | note only
S10 | `E100` | `E029` | remapped
S10 | `E101` | `E049` | remapped
S10 | `E102` | `E507` | remapped
S10 | `E103` | `E027` | remapped
S10 | `E104` | `E105` | remapped
S10 | `E107` | `E504` | remapped
S10 | `E108` | `E049` | remapped
S10 | `E109` | `E109` | note only
S10 | `E110` | `E110` | note only
S10 | `E117` | `E117` | note only
S11 | `E001` | `E001` | note only
S11 | `E025` | `E025` | note only
S11 | `E030` | `E030` | note only
S11 | `E041` | `E041` | note only
S11 | `E050` | `E050` | note only
S11 | `E060` | `E080` | remapped
S11 | `E061` | `E071` | remapped
S11 | `E070` | `E070` | note only
S11 | `E079` | `E079` | note only
S11 | `E080` | `E080` | note only
S11 | `E087` | `E087` | note only
S11 | `E090` | `E090` | note only
S11 | `E097` | `E097` | note only
S11 | `E100` | `E100` | note only
S11 | `E104` | `E104` | note only
S11 | `E110` | `E105` | remapped
S11 | `E111` | `E508` | remapped
S11 | `E113` | `E554` | remapped
S11 | `E115` | `E118` | remapped
S11 | `E116` | `E553` | remapped
S11 | `E117` | `E083` | remapped
S11 | `E118` | `E552` | remapped
S11 | `E119` | `E119` | note only
S12 | `E001` | `E001` | note only
S12 | `E025` | `E025` | note only
S12 | `E030` | `E030` | note only
S12 | `E041` | `E041` | note only
S12 | `E050` | `E050` | note only
S12 | `E060` | `E060` | note only
S12 | `E070` | `E070` | note only
S12 | `E079` | `E079` | note only
S12 | `E080` | `E080` | note only
S12 | `E087` | `E087` | note only
S12 | `E090` | `E090` | note only
S12 | `E097` | `E097` | note only
S12 | `E100` | `E100` | note only
S12 | `E104` | `E104` | note only
S12 | `E110` | `E110` | note only
S12 | `E117` | `E117` | note only
S12 | `E120` | `E046` | remapped
S12 | `E121` | `E046` | remapped
S12 | `E122` | `E650` | remapped
S12 | `E123` | `E038` | remapped
S12 | `E124` | `E560` | remapped
S12 | `E125` | `E751` | remapped
S12 | `E126` | `E083` | remapped
S12 | `E127` | `E080` | remapped
S12 | `E128` | `E042` | remapped
S12 | `E129` | `E106` | remapped
S13 | `E001` | `E001` | note only
S13 | `E025` | `E025` | note only
S13 | `E030` | `E030` | note only
S13 | `E041` | `E041` | note only
S13 | `E050` | `E050` | note only
S13 | `E060` | `E060` | note only
S13 | `E070` | `E070` | note only
S13 | `E079` | `E079` | note only
S13 | `E080` | `E080` | note only
S13 | `E087` | `E087` | note only
S13 | `E090` | `E090` | note only
S13 | `E097` | `E097` | note only
S13 | `E100` | `E100` | note only
S13 | `E104` | `E104` | note only
S13 | `E110` | `E110` | note only
S13 | `E117` | `E117` | note only
S13 | `E130` | `null` | note only
S13 | `E131` | `E077` | remapped
S13 | `E132` | `E086` | remapped
S13 | `E133` | `E080` | remapped
S13 | `E134` | `E082` | remapped
S13 | `E135` | `E106` | remapped
S13 | `E136` | `E072` | remapped
S13 | `E139` | `E555` | remapped
S14 | `E050` | `E066` | remapped
S14 | `E072` | `E072` | identity
S14 | `E077` | `E077` | identity
S14 | `E084` | `E026` | remapped
S14 | `E086` | `E086` | identity
S14 | `E087` | `E087` | identity
S14 | `E117` | `E117` | note only
S14 | `E300` | `E650` | remapped
S14 | `E301` | `E088` | remapped
S14 | `E302` | `E564` | remapped
S15 | `E072` | `E072` | identity
S15 | `E117` | `E117` | note only
S15 | `E310` | `E042` | remapped
S15 | `E311` | `E108` | remapped
S15 | `E312` | `E044` | remapped
S15 | `E313` | `E512` | remapped
S15 | `E314` | `E601` | remapped
S16 | `E050` | `E066` | remapped
S16 | `E117` | `E117` | note only
S16 | `E320` | `E509` | remapped
S16 | `E321` | `E042` | remapped
S16 | `E322` | `E043` | remapped
S16 | `E323` | `E504` | remapped
S16 | `E324` | `E108` | remapped
S16 | `E325` | `E029` | remapped
S17 | `E073` | `E073` | identity
S17 | `E076` | `E076` | identity
S17 | `E117` | `E117` | note only
S17 | `E330` | `E105` | remapped
S17 | `E331` | `E550` | remapped
S17 | `E332` | `E063` | remapped
S17 | `E333` | `E650` | remapped
S17 | `E334` | `E048` | remapped
S17 | `E335` | `E108` | remapped
S18 | `E117` | `E117` | note only
S18 | `E340` | `E045` | remapped
S18 | `E341` | `E803` | remapped
S18 | `E342` | `E067` | remapped
S18 | `E343` | `E068` | remapped
S18 | `E344` | `E042` | remapped
S19 | `E053` | `E065` | remapped
S19 | `E076` | `E076` | identity
S19 | `E084` | `E026` | remapped
S19 | `E102` | `E102` | identity
S19 | `E103` | `E103` | identity
S19 | `E117` | `E117` | note only
S19 | `E350` | `null` | note only
S20 | `E084` | `E026` | remapped
S20 | `E117` | `E117` | note only
S20 | `E360` | `E105` | remapped
S20 | `E361` | `E023` | remapped
S20 | `E362` | `E027` | remapped
S21 | `E070` | `E070` | identity
S21 | `E084` | `E026` | remapped
S21 | `E117` | `E117` | note only
S21 | `E370` | `E105` | remapped
S21 | `E371` | `E105` | remapped
S21 | `E372` | `E504` | remapped
S22 | `E035` | `E035` | identity
S22 | `E038` | `E038` | identity
S22 | `E070` | `E070` | identity
S22 | `E117` | `E117` | note only
S22 | `E380` | `E801` | remapped
S22 | `E381` | `E559` | remapped
S22 | `E382` | `E751` | remapped
S22 | `E383` | `E561` | remapped
S23 | `E058` | `E058` | identity
S23 | `E075` | `E075` | identity
S23 | `E117` | `E117` | note only
S23 | `E390` | `E098` | remapped
S23 | `E391` | `E042` | remapped
S23 | `E392` | `E099` | remapped
S24 | `E104` | `E104` | identity
S24 | `E117` | `E117` | note only
S24 | `E400` | `E107` | remapped
S25 | `E097` | `E753` | remapped
S25 | `E102` | `E102` | identity
S25 | `E117` | `E117` | note only
S25 | `E410` | `E064` | remapped
S25 | `E411` | `E509` | remapped
S25 | `E412` | `E600` | remapped
S25 | `E413` | `E106` | remapped
S26 | `E117` | `E117` | note only
S26 | `E420` | `E804` | remapped
S26 | `E421` | `E802` | remapped
S26 | `E422` | `E106` | remapped
S27 | `E117` | `E117` | note only
S27 | `E270` | `E106` | remapped
S27 | `E271` | `E105` | remapped
S27 | `E279` | `null` | note only
S28 | `E117` | `E117` | note only
S28 | `E280` | `E044` | remapped
S28 | `E281` | `E106` | remapped
S28 | `E282` | `E106` | remapped
S28 | `E283` | `E750` | remapped
S28 | `E284` | `E099` | remapped
S28 | `E285` | `E105` | remapped
S28 | `E286` | `E069` | remapped
S28 | `E289` | `null` | note only
S29 | `E117` | `E117` | note only
S29 | `E290` | `E651` | remapped
S29 | `E291` | `E754` | remapped
S29 | `E292` | `E755` | remapped
S29 | `E293` | `E754` | remapped
S29 | `E299` | `null` | note only
S30 | `E117` | `E117` | note only
S30 | `E300` | `E563` | remapped
S30 | `E301` | `E550` | remapped
S30 | `E302` | `E048` | remapped
S30 | `E303` | `E650` | remapped
S30 | `E304` | `E551` | remapped
S30 | `E305` | `E106` | remapped
S30 | `E309` | `null` | note only
S31 | `E117` | `E117` | note only
S31 | `E310` | `E850` | remapped
S31 | `E311` | `E106` | remapped
S31 | `E312` | `E550` | remapped
S31 | `E313` | `E080` | remapped
S31 | `E319` | `null` | note only
S32 | `E117` | `E117` | note only
S32 | `E320` | `E080` | remapped
S32 | `E321` | `E555` | remapped
S32 | `E322` | `E557` | remapped
S32 | `E323` | `E602` | remapped
S32 | `E329` | `null` | note only
S33 | `E117` | `E117` | note only
S33 | `E330` | `E652` | remapped
S33 | `E331` | `E651` | remapped
S33 | `E332` | `E556` | remapped
S33 | `E333` | `E555` | remapped
S33 | `E339` | `null` | note only
S34 | `E117` | `E117` | note only
S34 | `E340` | `E105` | remapped
S34 | `E341` | `E651` | remapped
S34 | `E342` | `E080` | remapped
S34 | `E343` | `E105` | remapped
S34 | `E344` | `E105` | remapped
S34 | `E349` | `null` | note only
S35 | `E117` | `E117` | note only
S35 | `E350` | `E048` | remapped
S35 | `E351` | `E653` | remapped
S35 | `E352` | `E119` | remapped
S35 | `E359` | `null` | note only
S36 | `E117` | `E117` | note only
S36 | `E360` | `E106` | remapped
S36 | `E361` | `E090` | remapped
S36 | `E362` | `E062` | remapped
S36 | `E363` | `E046` | remapped
S36 | `E364` | `E089` | remapped
S36 | `E365` | `E119` | remapped
S36 | `E369` | `null` | note only
S37 | `E117` | `E117` | note only
S37 | `E370` | `E106` | remapped
S37 | `E371` | `E062` | remapped
S37 | `E372` | `E119` | remapped
S37 | `E373` | `E062` | remapped
S37 | `E379` | `null` | note only
S38 | `E117` | `E117` | note only
S38 | `E380` | `E558` | remapped
S38 | `E381` | `E651` | remapped
S38 | `E382` | `E046` | remapped
S38 | `E383` | `E106` | remapped
S38 | `E384` | `E105` | remapped
S38 | `E385` | `E062` | remapped
S38 | `E389` | `null` | note only
