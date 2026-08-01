---
mdmax: 1
section: 12
title: "Risks, the pre-mortem, and the incompatible wants"
slug: 12-risks
lines: 1095
words: 12051
forward_links: [1, 2, 3, 4, 5, 6, 7, 9, 10, 11]
backlinks: [2, 9, 14]
prev: 11-execution
next: 13-appendix
---

[← Index](README.md) · [← §11 Execution](11-execution.md) · [§13 Appendix →](13-appendix.md)

## 12. Risks, the pre-mortem, and the incompatible wants

This section is the one that earns the rest of the document. Everything before it argues a case.
This one states what is wrong with the case, what is unresolved inside it, what would kill it, and
what has already gone wrong on the way here.

Read it in four parts:

| part | what it is | who has to act |
|---|---|---|
| §12.1 | **Three incompatible wants.** Three pairs of things the founders have asked for that cannot both be true. Each needs a founder decision, not an engineering one | Sagnik, with Amit |
| §12.2 | **The pre-mortem.** Thirteen ways this is dead in 2027, each with the mechanism, the warning sign visible *today*, and the countermeasure | whoever owns the item |
| §12.3 | **The failure mechanism, named precisely.** Not "we might get distracted" — the specific reward function that produced the last thirty-five days | both founders |
| §12.4–§12.7 | What we got wrong, the open decisions, what has to be true for twelve months to be worth it, and what this section does **not** cover | reader |

**Three words are used strictly throughout.** **DECIDED** means it is settled and reopening it costs
the plan its coherence. **RECOMMENDED** means this document has a preference and states the evidence
for it, but the founder can overrule it without breaking anything else. **OPEN** means nobody has
decided and the plan currently answers it two ways or not at all.

**Evidence tiers,** as everywhere in this document: `[measured]` we ran it · `[primary]` we read the
source · `[secondary]` · `[inference]` · `[SIMULATED]` we replayed data through code rather than
reading a live system.

**One standing warning that applies to every number below.** The research corpus this section draws
on has a measured, one-directional optimism bias. In the eighteen-area capability run, 18 of 18
research headlines were refuted by their own adversarial verifier, always in the flattering
direction. In the sixteen-area final gate, the structural fixes brought that down to **5 CONFIRMED /
10 OVERSTATED / 1 REFUTED**. So: never quote a headline. Quote the verifier's verdict, or quote a
number that a second party reproduced. Where a figure below is a headline that its own verifier
killed, it is marked **KILLED** and the corrected value is given instead.

**And the verifiers are not oracles either.** Four independent kill-audit agents re-derived a sample
of the verifiers' own kills from primary sources and found false-kill rates of
`5/29 = 17.24%`, `1/29 = 3.4%`, `4/21 = 19.0%`, and `0/26 = 0.0%`
[`docs/engine/research/wf-final-gate-2026-08-01.result.json` → `kill_audit[]`]. Pooled naively that
is 10 of 105 = 9.52%, but the four samples are not verified disjoint, so **the honest working
assumption is a false-kill rate somewhere in 0–19%.** A kill is strong evidence. It is not proof.
Process rule P4 — sample and re-audit kills before deleting anything — exists for exactly this
reason, and it is why nothing below recommends deleting work on the strength of a single kill.

---

### 12.1 The three incompatible wants

These are not risks. They are contradictions already present in the record, each of which the
document currently answers in two different places with two different answers. Each needs one
founder decision. None of them can be resolved by measurement, because both sides are already
measured.

They come from the `founder-thesis` research area. **That area's headline was REFUTED** — its
central empirical claim, that the founder already hand-builds multi-document bundles across 37.2% of
his files, was killed by its own verifier and corrected to roughly 2.2% (§12.1.1 below). But its
`negatives` block is the most valuable single artifact in the entire research corpus, because it is
the only place where anybody wrote down the fact that the founder has asked for two mutually
exclusive things and nobody noticed.

---

#### 12.1.1 Want A — the export is specified twice, and the two specifications are opposites

**Status: OPEN. This is the one that most needs a founder in a room.**

**Specification one, from the settled decisions.** D2: *"Comments and history live OUTSIDE the file.
Export or copy yields clean markdown, latest content only. Nothing about comments is ever written
into the .md."* D4: *"The durable artifact is plain markdown; if frontmatter dies we ship a full
export and migration. Max tier gets offline access."*

**Specification two, from the founder, verbatim from the session transcript** — not paraphrased from
a handoff, and re-extracted independently by the verifier from the 58,919,587-byte session `jsonl`,
`role=user`:

> *"I was mentioning purely about the Markdown tree, Markdown zip file concept, basically folder
> concept. Markdown is referred to within a Markdown, like a codebase. It will be a Markdown base. I
> was thinking whether the user should download one zip file of all the Markdowns or one single
> mother Markdown, which will be very long. Whenever frontmatter or the AI reads that, I will know
> these are the breakpoints, which means different files, and it can split that Markdown
> automatically while parsing into different files"*

`[primary, verified — the verifier confirmed the passage verbatim and found 3 lines in the session
file containing "one single mother Markdown"]`

**These cannot both be the export.** "Clean markdown, latest content only" is 1,084 loose files. "One
single mother Markdown with breakpoints" is one file with a convention inside it. A convention inside
a file is precisely the thing D6 was written to forbid, and a folder of loose files is precisely the
thing the mother-markdown image was invented to replace.

**And the measurement is decisive, in a way that hurts both sides.** A clean-markdown export of the
founder's own corpus today produces:

```
1,084 files            25,548,765 bytes        corpus_id sha256:3a010b16…
10,798 dangling [[X]] occurrences over 6,175 distinct targets        [own-measurement]
   (independent re-extraction: 10,185 over 6,011 — roughly 6% drift between two
    implementations of the same rule; use the range, not either endpoint)
1,409 of those targets appear in >=2 different documents and account for
   5,834 occurrences = 54.0% of all dangling links   (verifier: 1,326 / 5,415 / 53.2%)
only 30 occurrences (0.28%) are mechanically recoverable by re-applying the vault's
   own filename sanitizer;  at most 1,320 (12.22%) are within 0.90 difflib similarity
   of any existing file stem — so ~88% are deliberate entity references, not typos
no map, no index, no manifest ships with the export
```

That is **a durable artifact and a useless one.** Everything that made the corpus navigable lived
outside the files by construction — in the vault application, in the resolver, in the graph view.
Hand a departing user 1,084 files and ten thousand references that resolve to nothing, and you have
honoured D4's letter and destroyed its purpose.

**The mother-markdown export does not rescue it either, and the reasons are measured:**

```
container (all 1,084 files packed)   25,548,765 B
one-line-per-doc index                  105,538 B        →  242x
a 200K-token window holds 2.82% of the container — and 682% of the index
even a 1M-token window holds 14.1% of the container
mean file 23,569 B → a 200K-token pack carries about thirty average files
```
`[measured, corpus_id sha256:3a010b16…]`

**Contradiction, stated because two sources disagree.** The `container-thesis` area reports the same
comparison as **110×** (25.8 MB container against a 234 KB index) with a 200K window holding
**2.79%**; §3.1 of this plan reports **242×** and **2.82%**. Both are real; they use different
definitions of "index" — one line per document with a description and a size, versus one bare line
per document. **§3.1's 242× governs for the export question**, because the export's index does not
need per-document descriptions. The discrepancy is the same defect the `against` verifier caught
elsewhere: this programme has used the word "index" for two different artifacts in one sentence, and
it produced a false kill once already. Any future document must name the unit.

**What else the record says about this want, and it is not encouraging:**

- The round trip is not unclaimed. `llm-code-format` already ships pack **and** unpack with zero
  dependencies, at **387 downloads/month against repomix's 327,543 — a ratio of 846:1.** `[primary]`
- The Obsidian forum thread asking to export a vault to a single file: **9,010 views, 1 like, 3 posts
  in 26 months.** `[primary]`
- repomix issue #71 ("Splitting code into several files") was opened **2024-09-08**, is **still open**
  as of 2026-08-01 with 12 comments and 8 reactions, and the last comment is 2025-09-08. `[primary,
  verified]`
- The founder's own corpus does not support the practice the image describes. The claim that 37.2% of
  files and 47.7% of bytes are already hand-built bundles was **KILLED** by its own verifier: 372 of
  those 403 files (92.3%) are files with exactly two H1s whose first H1 is a machine-generated YAML
  `title:` field, and 365 of 403 sit inside one machine-synced subtree (`md/Skills/**`, frontmatter
  `source: claude`, `last_synced: 2026-05-26`). **Corrected figure: ~2.2% of files, ~2.0% of bytes.**
  That reverses the area's own pre-registered falsifier, which it had declared "FAILED TO REFUTE, in
  the founder's favour."

**The decision that has to be made, in one sentence: what does the Max tier's download button
produce?**

Three candidate answers, with what each costs:

| answer | what ships | cost | what it violates |
|---|---|---|---|
| **A1** a zip of clean `.md` files, plus a generated `INDEX.md` and a `VOCABULARY.md` listing every repeated dangling target with its document set | one afternoon on top of an existing zip | nothing. D2 and D4 are satisfied; the map ships beside the files rather than inside them | nothing |
| **A2** one mother-markdown with breakpoints | a real packer with a stringifier-stable path carrier, per-entry sha256, byte counts and a trailing-newline flag, plus pack-time refusals | days, not hours — and it is the same splice-and-identity discipline the rest of the engine needs | arguably D6, because it puts a convention in the file |
| **A3** both, user picks | A1 plus A2 | A1 + A2 | the roadmap, by adding a surface nobody asked for twice |

**RECOMMENDED: A1.** It is the answer that the demand evidence, the scale measurement and D4's stated
purpose all point at, and the `VOCABULARY.md` is the piece that makes it *better* than what the
founder described rather than a smaller version of it — it turns 10,798 "errors" into a 1,409-term
index of his own writing, which is the only diagnostic in this programme that would tell him
something about his corpus he does not already know.

**What would change the recommendation.** One conversation. Ask the founder the `founder-thesis`
area's own kill condition K-D, verbatim: *"was the export you meant always a zip of clean .md files?"*
If the answer is no — if he means one artifact, specifically — then A2 is the answer and the plan
should say so, because four sessions of that image recurring is either a thesis or four sessions of
the room hearing what it wanted, and only he can say which. **Cost: ten minutes. It has never been
asked.**

---

#### 12.1.2 Want B — "no new format" versus "features unseen in the industry"

**Status: OPEN, and the boundary has never been drawn.**

Two founder statements, both on the record, both load-bearing:

1. *"we can not invent a new markdown, we can not invent a new format"* — which became D6.
2. *"our editor on the max plan should give features that is unseen in the industry"* — which,
   together with D9 (*a document NAMES a capability, never CARRIES one*), is the whole differentiation
   story.

**These bound each other, and the boundary is measurable.** It was measured, and nobody drew it.

**Additive capabilities are free.** An unknown fence language round-trips byte-perfectly, and its
payload survives into rendered HTML:

```
```mermaid          →  <pre><code class="language-mermaid">graph TD; A--&gt;B;</code></pre>
```fm-capability     →  <pre><code class="language-fm-capability">payload: secret</code></pre>
```
`[measured against marked 16.4.2 at node_modules/marked; reproduced byte-for-byte by an independent
verifier, including the HTML-entity escaping of `-->`]`

**Reference-carried capabilities cannot degrade at all. They vanish.**

```
![[Some Note]]           →  <p>![[Some Note]]</p>
![[Some Note#Section]]   →  <p>![[Some Note#Section]]</p>
```
`[measured, same run, CONFIRMED by the verifier]`

The entire referenced document is absent and the residue looks like a typo. **This is not degradation.
It is a different failure class, and the plan's PASS / STRIP / CORRUPT certificate has no cell for
it.** The research proposed a fourth verdict — call it **VOID**, "the content was by reference and the
reference did not resolve" — and it is the verdict that decides which capabilities D6 permits.

**Therefore, and this is the sentence nobody has written down until now:**

> **The set of "features unseen in the industry" that satisfy D6 is exactly the set that puts nothing
> in the file which a plain reader must resolve elsewhere.**

That set is much smaller than the roadmap assumes. It silently **excludes**:

| excluded capability | why |
|---|---|
| **transclusion** (`![[X]]`, `{{include}}`, any embed) | payload is by reference; measured VOID |
| **cross-file reactive state** (a value in document A that updates when B changes) | the payload is a promise, not bytes |
| **block-scoped metadata resolved from a sidecar** | the file carries a key; a plain reader gets the key, not the meaning |
| **anything depending on a declared vocabulary** (`fm:vocab: sgnk/v1`) | meaning is by reference to a registry the reader does not have |
| **any capability whose value is a resolution step** | same shape, one hop |

And it **includes**, at zero D6 cost: unknown fence languages carrying self-contained payloads;
frontmatter fields whose *value* is extensible (D8, already decided); anything that renders as
readable prose when nothing resolves it; and every diagnostic that writes no bytes at all.

**Corroborating measurements, for anyone who wants to reopen this:**

- The measured **user-invention rate for new markdown constructs is 0.31% across 5,245 files** in five
  corpora, and all fourteen of the exceptions inside Docusaurus's 4,538 directives are the three
  tutorial strings that teach the feature. 847 independently-authored npm docs use exactly GitHub's
  five built-in callout types with **zero** inventions. `[measured]`
- The best available new carrier on every objective axis — the orphan link reference definition, which
  wins on capacity, wins invisibility in 6 of 6 renderer configurations, and is byte-identical through
  both remark and prettier — has **ZERO uses in 1,084 files and 25.5 MB.** `[measured]`
- The market's verdict on inventing a carrier: `markdown-it-decorate` achieved perfect silent
  invisibility and has **1,094 downloads/week, unshipped since 2017.** `[primary, re-verified live]`
- Where a spec *forced* declaration, it produced drift rather than vocabulary: four real OKF bundles
  produced **29 `type` values across four incompatible naming conventions with ~42% mutual
  collisions.** `[measured]`

**The decision that has to be made:** does D6 have an exception, and if so, written down where?

**RECOMMENDED: no exception. Write the VOID rule into the certificate and into D6 itself**, as:
*"a capability whose payload is by reference is out of scope; if we ever want one, it is a change to
D6 and it gets its own decision record."* Then the "unseen in the industry" promise has to be paid for
somewhere other than syntax — and §4/§7 already say where: the review loop over files people own, an
intersection four competitor sweeps found empty.

**What would change the recommendation.** A user, unprompted, asking to reference one document from
inside another and expecting it to render — the `custom-pointers` area's kill condition K-V3 says one
such observation would outweigh every corpus number in that area, and it is right. Nobody has asked
anybody. **W3 (user conversations) stands at zero.**

**What this recommendation does not settle:** whether a capability may be *named* in the file and
resolved by frontmatter only (D9's shape). Under the VOID rule, naming is permitted only if the file
still reads correctly when the name resolves to nothing — which is a testable property and should be
a fixture, not a principle.

---

#### 12.1.3 Want C — the library/import model versus "no runtime"

**Status: OPEN, upstream of syntax, and currently answered by deletion rather than by decision.**

The founder's analogy, on the record: *"in Python there are thousand libraries people might use
hundreds only."* The image is a package ecosystem for documents — a library of notations, capabilities
or components that a document imports.

**Against it stands §5's settled position and D6: no runtime.** The document does not execute
anything. A markdown file is inert.

**The research area that hit this stated the conclusion and it was recorded without being acted on:**

> *"acquiring a package ecosystem means becoming a programming language, or admitting you are a thin
> shell over one. Decide which, explicitly, before designing syntax."*

**The supporting fact:** the only two document formats that ever acquired a package ecosystem are
**LaTeX (7,021 CTAN packages)** and **Typst (1,481)**, and both are Turing-complete languages.
`[secondary — a search-only count, not independently re-derived by the kill audit; treat the exact
integers as indicative and the structural claim as solid]`

**Why this is upstream, not downstream.** Every syntax question — what an import looks like, whether
there is a registry, what a version pin means, what happens on a missing package — is a *consequence*
of this answer. Designing the syntax first and asking the question later is how a document format
becomes a programming language by accident, one convenience at a time.

**What v2.0.0 did.** It cut the notation library, the vocabulary registry and the declared-vocabulary
syntax (§3.3), on the strength of the 0.31% invention rate. **That is an answer by deletion.** It is
almost certainly the right answer, and it was reached without ever putting the question to the person
who raised it. That matters, because a want that is deleted rather than declined comes back — this is
the fourth document in which the container image has reappeared after being cut.

**RECOMMENDED: answer it explicitly as "no runtime, no package ecosystem, and the extensibility point
is D8 — the VALUE of a field, never the SET of node types."** Write it as a decision (D11) with the
founder's assent, not as a line in a cut list.

**What would change it.** Two things, in order of cost: (a) the founder saying the Python analogy was
about *discoverability* rather than *importing*, in which case the answer is a catalogue and not a
runtime and everybody agrees; (b) evidence that users declare structure when a tool suggests it — the
`founder-thesis` area found the strongest counter-example available, since the founder himself
authored a **1,409-term controlled vocabulary unprompted** in the form of repeated dangling wikilinks,
which every artifact in this programme currently classifies as an error. That is a real finding and it
does *not* imply a package ecosystem; it implies a `mdmax vocab` recogniser that writes no bytes.

---

#### 12.1.4 The three decisions, on one line each

| # | decision | current state | RECOMMENDED | who decides | by when |
|---|---|---|---|---|---|
| **W-A** | What does the Max-tier download button produce? | plan answers it two ways (D2/D4 vs the mother-markdown image) | zip of clean `.md` + generated `INDEX.md` + `VOCABULARY.md` | Sagnik | before item 3 ships (Wedge A) |
| **W-B** | Does D6 have an exception for reference-carried payloads? | never drawn; roadmap silently assumes yes | **no** — add the VOID verdict, write the rule into D6 | Sagnik + Amit | before any capability design |
| **W-C** | Library/import model, or no runtime? | answered by deletion in §3.3, never asked | **no runtime**; extensibility is D8 only. Record as D11 | Sagnik | this week — it is upstream of everything |

---

### 12.2 The pre-mortem — it is 2027 and this failed

Thirteen narratives. Each has **the mechanism**, **the earliest warning sign already visible today**,
and **the countermeasure**. They are ranked at the end by probability × severity.

The rule for this section: a warning sign only counts if it is observable in the repository or in a
public source *right now*. "We might lose focus" is not a warning sign. "Thirteen of twenty-one
commits are docs and `grep -ril mdmax src test scripts` returns nothing" is.

---

#### N1 — The research never became code

**Mechanism.** The reward function pays for sentences. Every research pass produces a document that is
immediately more valuable than the last one, so the marginal hour always goes to prose. The engine
never gets a first line, because there is always one more reconciliation to do first.

**Earliest warning sign, verified live in this session (2026-08-01):**

```
git log --oneline | wc -l                      →  21 commits
git log --format='%s' | grep -c '^docs'        →  13 of 21
grep -ril mdmax src test scripts               →  0 files
find src -name '*.ts*' | xargs wc -l | tail -1 →  21,415 lines  (all inherited from the md app clone)
docs/engine/PLAN.md                            →  v0.6.0, supersedes v0.5.0, 1,748 lines, 106,298 B
docs/engine/dossier.html                       →  408,550 B
docs/engine/sgnk-markdown-engine-dossier.pdf   →  449,691 B
```
`[measured, verified live in this session]`

Three of the last four commits before the consolidation were cosmetic fixes to a PDF — page overflow,
cover page, logo mark. **The plan names this failure in §9.7 — which is the point. Naming it did not
stop it, because §9.7 is itself another sentence.**

**Countermeasure.** The standing rule in §11 P10 is correct and must not be softened: the unit of
progress is **item 1's test going green** — not "a test", *that* test. A rule that says "one assertion
red to green against engine code" can be satisfied by writing a compiler. An assertion naming a second
human cannot.

---

#### N2 — The editor floor never shipped, so no collaboration feature was ever reachable

**Mechanism.** The tenancy work is described in the plan's own words as work that *"will keep losing
priority to compiler work precisely because it is uninteresting."* It is owned by the only person who
can also do the interesting work. It never starts.

**Earliest warning sign — and it is worse than "not started". The inherited base is architecturally
single-tenant and has to be replaced, not extended.** All four sites verified live in this session:

```
src/modules/auth/domain/allowlist.ts
    return login.trim().toLowerCase() === allowed.trim().toLowerCase();
src/config/env.ts:47
    ALLOWED_GH_LOGIN: z.string().min(1).default("sagnikmitra"),
src/config/env.ts:86
    GITHUB_REPO: z.string().min(1).default("sagnikmitra/md"),
src/container/dependency-container.ts:42
    const AUTHOR = { name: "Sagnik Mitra", email: "sagnikmitra123@gmail.com" } as const;
        …threaded into four use-cases at lines 66, 70, 75, 80
src/app/(workspace)/                     →  contains one file: .gitkeep
grep -c -i 'comment' firestore.rules     →  0
```
`[measured, verified live in this session]`

`firestore.rules` declares the entire multi-tenant model — `vaults/{vaultId}` with `memberUids`,
`roles[uid]`, `ownerUid`, helpers `isVaultMember`/`canEditVault`/`isVaultOwner`, plus
`notes/{noteId}`, immutable parent-linked `revisions/{revId}` with `allow update: if false`,
`shares/{slug}`, `billing/{uid}`, `usage/{uid}/months/{month}` — and **exactly one source file
touches Firestore, only to construct the singleton.** The schema exists. Zero lines implement it.

**Kill gate K7 is not a risk. It is the current state.**

**The honest counterweight, stated because it changes the estimate downward.** The `against` area
found it and reported it against its own case: the rules file is 17,304 bytes, committed 2026-07-25 in
the largest commit in the repo, *before* the engine programme started, and there is a 619-line share
module in `src/modules/share`. So the floor is not zero and the "he finds it boring" story is
contradicted by the fact that he built it first. This makes item 1 **cheaper**, not less urgent.

**Countermeasure.** Item 1, committed RED today: a second GitHub login who is not `sagnikmitra` opens
a document they do not own, writes one character, and the persisted commit carries **their** name and
email; plus a 403 for a role they do not hold. That single test invalidates the allowlist, the single
server token and the `AUTHOR` constant simultaneously, and it is the only assertion whose passing
makes any part of the Google-Docs story reachable.

---

#### N3 — The anchor did not hold up when it was re-derived, or did not transfer to ranges

**Mechanism, and it is not the obvious one.** The risk is not that 99.627% falls. It is that it *does
not fall*, everybody is reassured, and the number was measured on a distribution that does not
resemble the product. Re-deriving a statistic on the corpus that produced it reproduces that corpus's
bias with perfect fidelity.

**Earliest warning signs, visible today — three of them, and they are independent:**

1. **Nobody has re-derived it.** Not one of the areas that quoted it. There is no derivation script
   anywhere in the repository: a grep for `99.627`, `41,642` and `41642` returns hits only in prose —
   six documents and the research JSONs, where one agent records it verbatim as *"[own-measurement,
   PLAN §1.1a, **not re-run by me**]"*. Under the plan's own rule P2, **the flagship number does not
   currently qualify as a measurement.** `[measured]`
2. **The source section is internally inconsistent, and nobody noticed until the final gate.**
   `docs/engine/PLAN.md` §1.1a reports 12.9% of block-versions presenting more than one candidate and
   scoring 94.94% correct / 2.66% false on that stratum. But 12.9% of 32,919 surviving block-versions
   is 4,247, and 2.66% of that is **~113 false matches** — while the same section states 0.050% false
   on 28,170 anchorable blocks and *"All 14 false matches on anchorable blocks were hand-audited, not
   sampled."* **113 versus 14. One of those numbers is wrong and the document does not say which.**
   `[primary]`
3. **It is a BLOCK figure and comments anchor RANGES.** The one replication of the range case gives
   **3.44×, not 30×**, with refusal roughly doubling. And **~1 heading in 4 cannot carry an anchor at
   all** (18.3% / 25.4% / 24.7% under three tokens across three corpora) — headings being what
   everything points at. `[measured]`

**Two claims in this narrative were themselves killed and must not be repeated.** The pre-mortem
agent argued that the corpus is 86.6% append-dominated and that this "agrees to 0.4 percentage points"
with S1's 87.0% exact-hash resolution rate. Its verifier **REFUTED both**: under the pinned corpus's
own exclusion policy the zero-deletion rate is 67.2%, and on *genuine* consecutive revision pairs
(excluding 642 file creations that have no predecessor) it is **6.1%**, with 53.0% being pure
deletions. The two quantities were never comparable — one is a per-block-version resolution rate, the
other a per-file-revision edit shape. **N3 may still be right; it is not right for that reason.**

**Countermeasure.** Make the re-derivation a gate and specify it by **edit shape**, not by authorship.
Before any number is published, report correct / false / refusal in four strata — pairs deleting 0
lines, 1–2 lines, more than 2 lines, and pairs containing a detected paragraph reflow — with `n`
stated per stratum, plus a `diff3`-assisted baseline arm. **This requires a corpus this team did not
write, selected by edit shape**, and that is a real acquisition task: none of the three pinned roots
qualifies against a 25%-of-pairs-delete-more-than-two-lines bar (`md` 0.9%, `knowledge` 9.9%,
`frontmatter` 8.3%). If the >2-deleted-lines stratum yields fewer than ~200 block-versions on every
available corpus, **the honest finding is that the number has never been tested on the case it exists
for**, and it must be restated as *"exact-hash resolution over an append-dominated corpus"* — true,
defensible, and much smaller.

---

#### N4 — Users rejected the refusal model; orphaned comments felt like a bug

**Mechanism.** "Refusing is cheap" is true for the engine and false for the user. An orphaned thread is
indistinguishable from data loss in a product whose #1 competitive pain theme is that sync silently
destroys things. Users file it as a bug, support explains it is by design, and **the explanation is
worse than the bug.**

**Earliest warning signs, visible today:**

- The `collab-primitives` area wrote both the threshold and the failure mode before anyone built
  anything: *"If, in the pilot, orphaned threads exceed ~10% of all threads per week of normal
  editing, the honest-refusal design is correct and unshippable at the same time — users will read
  every orphan as a bug."* **Nobody publishes an orphan rate. That threshold was invented by this
  research and no competitor discloses one.** `[primary]`
- The only production system of this design orphans roughly a fifth of its anchors. arXiv 1512.06195,
  read directly: **20,953 highlighted-text annotations; ~22% can no longer be attached to their live
  pages; of those, only ~12% are recoverable from web archives, leaving 88% orphaned; and 53% of those
  still attached are in danger.** `[primary]` (Note: this programme carried these figures wrong in
  every digit — as 20,953 / 27% / 61% / 3.5% — from a search-result summary. See §12.4.)
- The demand evidence points the same way. Combined installs of **every** markdown comment plugin in
  the largest markdown ecosystem = **24,569**, against Dataview's **4,659,822 — a 190× gap.**
  `[measured]` An independent re-measurement of the same registry puts it at **98.6×** against the best
  single plugin, or **24.9×** against all 40 summed, and flags that cumulative download counts reward
  age. **Use the range 25×–190×, not the headline.**
- **D3 removes the exact property the research names as the competitive wedge**: *"range-anchored
  comments with anonymous no-account share links"* (HedgeDoc has a working CriticMarkup + CM6 comments
  proof-of-concept with a live demo, 2026-04-04; Relay has 175,904 installs).

**Countermeasure, two parts.** (a) Ship the orphan rate as a **visible product metric from the first
comment written**, and instrument the refusal path before the resolve path. (b) Reopen D3 as a tier
split rather than a global rule — anonymous read-and-comment on a share link, login required to
resolve or to edit. That preserves the wedge and the account model at once, and owner seats still bill
while commenters do not. This is open decision 10.2 and it is the single cheapest de-risking edit in
the plan.

**Honest caveat on the anonymity argument.** The final-gate verifier rated the anonymity inference
**UNSUPPORTED**: the 190× gap is attributed inside the same artifact to real-time collaboration
presence — *"the wanted half is the COLLABORATOR, not the annotation"* — not to login friction. No
measurement anywhere attributes adoption to anonymous access. So the tier split is recommended on
funnel logic and on the pre-registered prediction that four of five reviewers stall at a login wall,
**not** on the 190× number. Do not cite the 190× as evidence for anonymity.

---

#### N5 — A big company shipped it: OKF already exists

**Mechanism.** Not that Google out-features MDMAX. That Google's format becomes the thing agents
already speak, and MDMAX's distinctive decisions arrive as second implementations of a published spec.

**Earliest warning signs, visible today, from a spec nobody in this programme had read until the final
gate:**

```
okf/SPEC.md v0.2      37,544 bytes
sha256 5a3311d270bebb16d558010e75064f5b75323f284992641732b1c8097511f948
GoogleCloudPlatform/knowledge-catalog   8,134 stars, created 2026-05-04, pushed 2026-07-29
scaccogatto/okf-skills 206*   OWOX/models 85*   0dust/OKFy 62*
openknowledge-sh/openknowledge 33*   xSAVIKx/okf-skills 29*   jkroepke/okf-crossplane-v2 24*
   — all pushed within three weeks of 2026-08-01
```
`[primary, every particular independently verified]`

- **D9 is already OKF §10.2, in one sentence:** *"What sits behind a `resource` (a Skill, a script, a
  container) is a packaging choice; OKF fixes the interface, not the packaging."*
- **MDMAX's anchoring rationale is already OKF §5.1:** *"Labels are keyed rather than positional
  (`sources[0]`) because agents constantly rewrite these documents: a positional index misattributes
  silently the moment the list is reordered, whereas a stable `id` survives reordering."* — and its
  carrier is a plain markdown footnote `[^ga4-schema]`, an in-file, renderer-**visible** carrier,
  chosen by Google Cloud despite everything this programme believes about degradation.
- **The runtime is coming:** §12 of the spec defers *"the receipt and verdict wire formats, and the
  attestation lifecycle around a run. The attester ABI, portability, and sandboxing."*

**The honest counterweights, which are real:**

- OKF does **not** solve block identity. Its identity is the file path (§4, §6), and per-claim
  attribution is a footnote label joined to `sources[].id` — that addresses source lists, not spans of
  prose. A case-insensitive grep for `span`, `character offset`, `byte range`, `per-paragraph`,
  `inline annotation` across all 37,544 bytes returns **0**, and the spec **explicitly refuses**
  confidence scores: *"a score is subjective, unportable across consumers, and goes stale."* **The
  specific gap MDMAX names is genuinely unfilled by Google.** `[primary]`
- `knowledge-catalog`'s README states *"This repository and its contents are not an official Google
  product."*
- OKF §11's conformance bar is deliberately near-zero (parseable frontmatter with a non-empty `type`),
  which is a weak standard to be captured by — **and it is also the opening**: a normative instruction
  that consumers be permissive is unenforceable across thirty uncoordinated renderers, and the tool
  that tells an author which of them actually complied is exactly `mdmax cert`.

**Countermeasure.** Open decision 10.5 is right and must be executed rather than deferred: **OKF is a
target, not a host.** Ship it as the first column of `mdmax cert`, emit its §5 provenance fields
(`sources`, `generated`, `verified`, `status`, `stale_after`) rather than inventing a vocabulary, and
ship the one thing the OKF ecosystem provably lacks — a **producer-side** checker that runs on
arbitrary markdown rather than on an already-conformant bundle. `mdmax cert <file> --targets okf/v0.2`
answering *"what would break if this became an OKF concept"* is a column nobody has, and it converts
the competitor into a distribution channel.

---

#### N6 — The container was built and nobody used it

**Mechanism.** Not "nobody wanted it". It has been tried, and **the effectiveness check failed.**

**Earliest warning signs, visible today:**

- **repomix issue #71**, opened 2024-09-08, still open at 2026-08-01 — 22.8 months. The maintainer
  designed the feature in his first reply; a contributor shipped PR #113 on 2024-10-09; the maintainer
  gated it on evidence: *"I haven't fully grasped the essence of file splitting effects yet, so I would
  appreciate it if you could verify the effectiveness of this approach."* The contributor reported back
  the next day: *"Well not quite what I hoped regarding getting it to read all the split files."* Last
  comment, 2025-09-08: *"Did we see resolution of this?"* `[primary, every quote and timestamp
  verified]`
- **The only live-model measurement of a projection bundle that exists anywhere** (okf-skills,
  2026-07-27, twelve fresh agents, blind grading, six questions) found the bundle arm spent
  **257,602 tokens against 244,805 without — "the bundle arm cost more, not less. 5.2% more tokens
  over six questions, and it opened more files, not fewer."** Correctness 22/26 (85%) vs 20/26 (77%).
  **Their own authors say n=1 per cell is not quotable as a headline**; quote the *direction*, not the
  magnitude. `[primary]`
- **Revealed demand is 846:1 against** (`llm-code-format` 387 downloads/month vs repomix 327,543).
- **The prior art for the unpack half already ships with more stars than repomix.** Aider (47,848
  stars) specifies the consumed bundle format verbatim in `wholefile_prompts.py` and parses it back to
  disk in `wholefile_coder.py::get_edits()`, already stripping `*`, `:`, backticks and leading `#`
  from the locator; `base_coder.py::choose_fence()` already computes a collision-proof delimiter by
  scanning all member content. gpt-engineer (55,173 stars) is the same category. **The "27,551-to-0
  asymmetry" claim was REFUTED** — the searches looked for repos *named* "unpack" rather than for the
  capability under its industry name.
- **The engineering is fine and the product is not.** `container-thesis` proved 1084/1084
  byte-identical at +0.892% overhead and 120× cheaper git storage per edit than a zip — and then killed
  its own product in the same report: **the pack must never be the write surface, because on the
  realistic merge-across case boundary repair is 119 of 120 WRONG**, returning a confident position
  that does not contain the true split.

**Countermeasure.** Do not build the container. If it is ever revisited, it is gated on running the
live-model experiment on a corpus the model cannot read whole, and on a positive result. Until then,
**§4.4's 25–168× and §3.1's 242× must be stated as artifact-size ratios and must never imply a token
saving in an agent loop** — the only measurement of that quantity points the other way.

---

#### N7 — The team optimised for a document rather than a product

**Mechanism.** Honesty converts into inertia. Each correction makes the document more valuable and
harder to abandon. **And the corrective machinery itself became a source of sentences.**

**Earliest warning signs, visible today.** All of §12.3 is this narrative's evidence; the compressed
version:

```
21 commits, 13 docs-prefixed, 1 author                        [verified live]
858,241 bytes of presentation material (dossier.html + PDF)
   for an engine with zero lines of code                       [verified live]
docs/engine/PLAN.md carries version: 0.6.0 and supersedes: v0.5.0
   — a changelog and a supersession chain                      [verified live]
0 live model calls and 0 user conversations across 34 research areas
```

**And the sharpest sign is inside the corrective machinery itself.** The pre-mortem agent attacked
§9.1's "18 of 18 headlines refuted" statistic — the number that selected the entire MVP — and reported
it was really 12 of 18. **Its verifier REFUTED that**: the 12/18 was an artifact of matching
`/headline/i` against one JSON field; extended to the `reason` and `correction` fields the report
itself quotes from, **it is 18 of 18 adjudicated, 18 of 18 negative**, and two of the five areas
declared "never adjudicated" are the exact two whose examples §9.1 cites. **Self-flagellation is also
sentences.**

**Countermeasure.** Rule P2 must bind the *plan*, not only the research: every number in this document
gets a committed script under `scripts/derive/` plus its captured output, or it is deleted from the
document. Start with §9.1 and with 99.627%, because those are the two numbers that picked the MVP and
the engine.

---

#### N8 — The evidence base evaporated

**Mechanism.** Not a wrong decision — a total, silent, recoverable-by-nobody loss. At the time this
narrative was written, the entire engine programme existed on one laptop, on one branch, most of it
not even committed to that branch: 14 untracked files totalling 4,965,476 bytes, including
`docs/mdmax/PLAN.md` itself and `docs/engine/research/corpus-manifest.json` — the artifact created
specifically to fix the seven-irreproducible-counts problem. None was gitignored; they were simply
never added. `origin/main` had not moved since 2026-07-25 and `git branch -r --contains` returned
nothing.

**Live state, verified in this session (2026-08-01), and this is the one narrative that has been
largely retired:**

```
git rev-list --left-right --count origin/main...HEAD   →   0    17
git branch -r --contains HEAD                          →   origin/engine/plan-and-diagnostics
git ls-files docs/engine/research/                     →   8 files, including corpus-manifest.json
wc -c package.json                                     →   3,076   (restored from 17 bytes)
HEAD = 1bd4dad "docs(mdmax): consolidate the plan, pin the corpus, commit the research base"
```
`[measured, verified live in this session]`

**The branch is pushed. The research base is tracked. The remaining exposure is smaller and specific:**

- `origin/main` is still 17 commits behind; the work lives on one remote branch, which is fine, but
  the merge has not happened and no one has reviewed it.
- Agent litter remains untracked in the repo root: `.scratch-carrier.mjs`, `.scratch-lossy.mjs`,
  `arx.xml`, `cx.html`, `polyg.yml`, `docs/engine/build/__pycache__/`. That is open decision 10.6.
- **Learned Rule #48 records that subagents in this workspace have committed against an explicit
  prohibition**, so the working tree is still not a safe place to keep the only copy of anything.

**One claim in this narrative was REFUTED and the correction is operationally useful.** The pre-mortem
reported that `corpus_id` *"DOES NOT REPRODUCE"* under any of 64 serializations and that this was a
compounding failure. **It reproduces.** I re-derived it in this session:

```
recipe:  for every root, build "<root>/<path>", pair with the file's sha256 as "<root>/<path>:<sha256>",
         sort the list, join with "\n", NO trailing newline, sha256 the UTF-8 bytes
result:  3a010b1649899795d79274fc528dbece97fdabf4ff0f81cc02ab619c048c51a4   over n = 1,084
         == the declared corpus_id.   total_files 1084, total_bytes 25,548,765 also reproduce.
```
`[measured, verified live in this session]`

**But the sub-claim stands and is unfixed:** there is still **no derivation script committed**, so
rule P2 is genuinely unmet for the artifact created to enforce P2. Ten lines. Commit them beside the
manifest and add a `derivation` field naming the exact serialization, so no future reader has to
rediscover it — one already failed to, and published the failure as a finding.

**Countermeasure.** Commit the ten-line derivation script. Merge or PR the branch to `main`. Clear the
litter. Total cost: under an hour.

---

#### N9 — The certificate was perishable and its valuable columns were unprobeable

**Mechanism.** `mdmax cert` was selected by the rule *"choose the deliverable whose output shape cannot
be a headline."* True. But its output also cannot stay true, and cannot cover the targets people
actually care about. A conformance matrix is a perishable good with no maintenance budget in the plan,
and the surfaces users publish to are closed SaaS you cannot vendor, version-pin, or probe.

**Earliest warning signs, visible today — and they are in the certificate's own research area:**

- Its kill condition (2), verbatim: *"THE UNCERTIFIABLE SURFACE IS THE ONLY ONE ANYONE CARES ABOUT.
  github-blob cannot be probed without pushing content, and Obsidian, Notion, Typora, Bear, Slack,
  Discord and the chat renderers cannot be probed at all — that is **7 of the ~12 surfaces** on the
  brief's list."*
- Its `unverified` block opens: *"TARGETS I NEVER RAN — this is the biggest gap and it is more than
  half the brief's list… I have **NO empirical Obsidian data at all**."*
- Its kill condition (1) sets the floor: *"the honest figure was **4.28%**, not the 43.71% the naive
  diff reported, and 4.28% is not a large number. If a neutral corpus halves it again, stop."* A 4×
  margin on a self-authored, AI-assisted corpus is thin.
- The pinnable engines move: **markdown-it 15.0.0 published 2026-07-30, marked 18.0.7 published
  2026-07-21** (npm registry `time` field). `[primary]` **Caveat, and it is the weakest link in this
  narrative:** a version bump is not a behavioural change, and nobody established that these releases
  changed rendering behaviour. "The certificate is perishable" is `[inference]` from release cadence.
- **K5 currently states no threshold at all**, so it can never fire.

**The counterweight, and it is strong.** This is the only capability that four independent adversarial
prior-art searches could not find shipped: one returned `total_count 0/0/1`; another enumerated
markdownguide.org's 28 construct ids and found **zero** of frontmatter, wikilink, callout or mermaid
while measuring those constructs at 56–91% prevalence; a third inspected the top ten of 4,218
repositories and found only parsers; a fourth ran four npm searches for 32 results and zero relevant.
And it finds real disagreement: **GitHub's own API renderer and blob renderer were measured
disagreeing on mermaid, on identical bytes, live.** `[measured]`

**Countermeasure, three parts.** (a) **Give K5 the number the research already produced**: kill if
semantic BROKEN falls below 1% of blocks on a corpus this team did not write. (b) **Split the matrix
into a PROBED tier** (offline, vendored, version-stamped) **and a DECLARED tier** (contract plus
canary for closed SaaS), labelled in the output, so the certificate never manufactures confidence
about Obsidian or Notion. (c) Run the 60-day decay test: recapture the closed rows at 60 days; if zero
cells moved, the dataset does not decay, a single copy is permanently level with yours, and **the
certificate is a lead, not a moat.** Also: check the licence of every renderer the bench proposes to
vendor. Nobody has.

---

#### N10 — Two decisions deleted the wedge the demand research identified

**Mechanism.** D3 and D4 were made on architectural grounds against research findings that were about
demand, and the two bodies of evidence were never put side by side.

**Earliest warning signs, visible today:**

- **D3 vs the collaborator half.** The `collab-primitives` area names the competitive threat as
  *"range-anchored comments with anonymous no-account share links"* and diagnoses the plugin-adoption
  gap as *"a plugin cannot deliver the collaborator half"* — and login-required removes exactly the
  half in question at the top of the funnel. Logged in the plan as "a tradeoff"; the demand side was
  never quoted against it. (See N4's caveat: the anonymity link is UNSUPPORTED as a *measured* claim.
  The funnel argument stands on its own.)
- **D4 vs the price wedge, and this one is not logged anywhere.**
  `docs/FRONTMATTER-PRODUCT-PLAN.md:171`, verbatim: *"**Free git-backed sync forever** (user's own repo
  = backend; marginal cost ~0) — undercuts every $4–10/mo sync add-on"*, filed against pain theme T3
  (price backlash), **ranked #3 of 14**. D4 explicitly overturns *"your git repo is the backend"*.
  `[primary, verified at exactly that line]`

**Countermeasure.** The reconciliation pass must include a **decisions-versus-demand diff**, not only
an audit-versus-critic diff. Any decision that deletes a property the demand research ranked in its
top five gets a written replacement wedge or gets reopened. For D4 specifically, §4.3 already carries
the replacement — *"Free sync. It's just git."* at £0 with marginal cost ~0 — so the wedge survives in
the pricing table even though the architecture changed. **Write that reconciliation down**, because
right now the plan reads as if D4 deleted the #3-ranked pain's answer and nobody noticed.

---

#### N11 — Bus factor one met a plan with no calendar

**Mechanism.** The sequence is costed at roughly two weeks of work and names no owner and no dates. The
only owner also runs a client studio with annual-maintenance-contract obligations. The gates are all
serial on one person, and item 1 — the one that matters — is the one he finds boring.

**Earliest warning sign, verified live:** `git log --format='%an' | sort | uniq -c` returns
**`21 Sagnik Mitra`**. All 416 commits in the source `md` repo are the same author. **Amit is named as
co-author in this document's frontmatter and as co-decider on D1–D5, and has committed nothing**; §1
addresses him as a reader.

**Honest boundary on this claim.** This is a statement about the **code**, not about the partnership.
Design conversations, decisions and review are not in version control and are invisible to any
measurement available here.

**Countermeasure.** Kill gate K2 already encodes it: if Amit has not committed code by **2026-08-31**
(a Monday, thirty days from 2026-08-01), the working assumption is wrong and the plan is a one-person
plan that has to be re-costed as one. The three live options are: Amit owns item 1 end to end with his
own commits; item 1 is contracted out; or K7 is triggered now and MDMAX is repositioned as a standalone
library. **Pick one this week. The plan cannot survive "we will see."**

---

#### N12 — D9's escape hatch reintroduced the vulnerability class D9 exists to prevent

**Mechanism.** D9's rationale is that self-declaring formats which **carry** their definition produce
security vulnerabilities — XML's internal DTD subset produces XXE; vim modelines produced five CVEs in
twenty-four years. The proposed fix is to **name** the capability instead. But naming an executable
resource that a consumer then runs is the same attack surface with one extra hop, and it arrives with
a false sense of safety because the file itself looks inert.

**Earliest warning sign, visible today.** OKF v0.2 §10.2 already ships exactly this shape —
`executor: {resource, receipt}` and `attester: {resource}` naming code the consumer executes, with
`okf/bundles/acme_retail/attesters/sql_equality.py` in Google's own reference bundle, and §10.5 step 5
reading *"**Attest**: the consumer runs the attester over the receipt."* **And §12 defers "The attester
ABI, portability, and sandboxing" to a future revision — i.e. the sandbox story does not exist yet.**
`[primary, verified line by line]` If MDMAX adopts OKF as a certificate target (recommended, 10.5) it
inherits this surface, and any `fm:vocab:`-style resolution step has the same shape.

**Second warning sign, from the compiler side rather than the format side.** The research instruments
themselves hit three pathologies in a single run: a linear region scan took **45.5 seconds on a 1.49 MB
file**; two full runs hung on catastrophic regular-expression backtracking; and a traversal bug
silently inflated numbers **8.5×**. **Nobody has asked what a hostile `.md` does to the re-anchor
algorithm or the shingle index — in a product whose whole premise is ingesting files other people
wrote.**

**Countermeasure.** Write D9's threat model down *before* any capability work, not after. Concretely: a
named capability resolves only from a pinned allowlist shipped with the engine, **never from a path or
URL inside the document**, and `mdmax cert` flags any document naming an unresolvable or
non-allowlisted capability as CORRUPT rather than DEGRADED. Plus a ReDoS and adversarial-input fixture
set for the anchor path, and `eslint-plugin-redos` in CI. The repository already carries two live
quadratics to prove the point: `WIKILINK_RE` at k≈2.00 (**36,865 ms on 320 KB of `[[`**) and
`mdast-util-from-markdown` at **12,429 ms against micromark's 1,207 ms** on identical bytes.

---

#### N13 — The kill gates fell due and were quietly extended

**Mechanism.** This is the meta-failure that makes every other narrative survivable-looking. K1 and K2
fall due on 2026-08-31. On 2026-09-01, if nothing has shipped, the cheapest available action is not to
honour them — it is to observe that the reasons were good, that progress was real, and to move the
date. Nothing in the plan prevents that. A kill gate with no owner, no calendar entry and no external
witness is a preference, not a gate.

**Earliest warning sign, visible today.** This programme has already extended one implicit gate four
times: the mother-markdown container has been cut and reappeared across four documents. And the
standing rule *"no further research fan-out until one committed assertion has gone red to green"* was
written before the final gate — and the final gate was another research fan-out, of 40 agents over 16
areas. **The rule was in force and the fan-out happened anyway.**

**Countermeasure.** Three mechanical things, all cheap: (a) put **2026-08-31** in a shared calendar
with both founders on it, titled "K1/K2 verdict"; (b) write the verdict as a commit to this file on
that date — pass or fail, in the document, dated; (c) name the external witness. A gate whose failure
must be *written down in public* is a different instrument from one that is merely stated.

---

#### 12.2.1 Ranking, by probability × severity

Probability is over the next twelve months. Severity is what it costs if it happens. The ranking below
applies the kill-audit corrections — N3 has been demoted from the pre-mortem's original position
because the measurement that elevated it did not survive, and N8 has been demoted because the fix
landed and I verified it live.

| rank | narrative | probability | severity | note |
|---|---|---|---|---|
| 1 | **N2 the editor floor never shipped** | HIGH | **TOTAL** | not a forecast — the measured current state. K7 is the base case |
| 2 | **N1 the research never became code** | HIGH | **TOTAL** | distinct from N2: N1 is "nothing ships", N2 is "the wrong thing ships" |
| 3 | **N13 the kill gates were quietly extended** | HIGH | HIGH | the multiplier on everything else; costs one calendar entry to defuse |
| 4 | **N11 bus factor one** | HIGH | MEDIUM | a multiplier on N1/N2 rather than an independent failure |
| 5 | **N5 OKF outruns us** | MEDIUM-HIGH | MEDIUM-HIGH | survivable if OKF becomes a column; fatal if it becomes the format |
| 6 | **N7 document-as-product** | MEDIUM-HIGH | MEDIUM | slow bleed; partial immunity because the team named the disease |
| 7 | **N3 the anchor does not transfer** | MEDIUM | HIGH | credibility kill, not market kill. Its flagship supporting measurement was killed; the block-vs-range gap is the real reason |
| 8 | **N9 certificate perishable / unprobeable** | MEDIUM | MEDIUM-HIGH | capped at two days, so severity is bounded by the cap |
| 9 | **N4 refusal model rejected** | MEDIUM | HIGH but LATE | only bites after the review loop ships |
| 10 | **N10 decisions deleted the wedge** | MEDIUM | MEDIUM | recoverable by reopening D3 as a tier split |
| 11 | **N8 evidence base evaporates** | LOW | TOTAL, IRREVERSIBLE | largely retired 2026-08-01; residual is the un-merged branch and the missing derivation script |
| 12 | **N12 D9 threat model** | LOW | HIGH IF IT HAPPENS | a security incident in a collaboration product is existential for trust |
| 13 | **N6 container built and unused** | LOW | LOW | explicitly out of scope; the risk is that it comes back, not that it fails |

**The single cheapest intervention that reduces the most risk:** item 1's test, committed RED today.
It retires N1 and N2 simultaneously — the top two, both severity TOTAL — because it cannot be satisfied
by prose and cannot pass without replacing the allowlist, the single server token and the `AUTHOR`
constant. It also defuses N7 and N11, because the unit of progress becomes a test only one kind of work
turns green. **It does not touch N3, N5 or N9** — those need the stratified re-derivation, the OKF
column, and the certificate's threshold respectively — and no single cheap action does.

---

### 12.3 The mechanism by which this fails, named precisely

Everything in §12.2 is a symptom. This is the disease, and it is worth naming precisely rather than as
a platitude, because the platitude version ("stay focused") has already been tried and did not work.

**Step 1 — the reward function pays for sentences, and nothing charges for wrong ones.**

Every research pass produced a document. Every document was immediately more legible, more complete
and more impressive than the last one. Nothing in the loop imposed a cost for a sentence that was
wrong: **18 of 18 headlines in the capability run were refuted by their own verifier, always in the
flattering direction**, and the cost of that was zero at the time it happened. The final gate's
structural fixes — mandatory negatives, pre-registered falsifiers, mandatory corpus id, a kill audit —
brought it to **5 CONFIRMED / 10 OVERSTATED / 1 REFUTED**. That is a genuine and rare improvement, and
it is also more sentences.

**Step 2 — the cheapest way to satisfy the reward function is another research area.**

A research area costs tokens and produces a document. Code costs judgement, debugging, and the risk of
a red test. When the measured output of a day is "how much did we learn", research always wins. The
observable consequence, verified live in this session:

```
21 commits                    13 of them docs-prefixed        1 author
0 files in src/ test/ scripts/ contain the string "mdmax"
21,415 lines of TypeScript in src/ — every one inherited from the md-app clone of 2026-07-17
858,241 bytes of dossier + PDF for an engine with no code
0 live model calls and 0 user conversations across 34 research areas
```

**Step 3 — the corpus becomes the artifact under maintenance.**

This is the step that turns a bad month into a bad year. `docs/engine/PLAN.md` carries
`version: 0.6.0` and `supersedes: PLAN.md v0.5.0 (same path)` in its own frontmatter, plus in-body
supersession notes ("*This supersedes the k=2 fingerprint recommendation in v0.2*"; "*superseded by
§10, §1.1a, §2.3/§2.4 and §3.2 respectively*"). `[measured, verified live in this session]`

**That is version-controlled software with releases and deprecations.** It has a version number, a
changelog, a supersession chain, a build pipeline (`docs/engine/build/`), two rendered distributions
(an HTML dossier and a PDF) and a maintenance burden — three of the last four commits before the
consolidation were page-break and cover-page fixes to the PDF. The programme did not fail to ship a
product. **It shipped a different product, on time, with releases.**

**Step 4 — and this is the trap — every correction increases the sunk cost.**

The corrections are real. The negatives are real. The kill audit is real, and a team that over-reports
its own failure rate is rarer and more valuable than one that under-reports it. But each correction
makes the document more *right*, and a document that is more right is harder to abandon. The
self-criticism is load-bearing structural material for the thing it criticises.

> **Honesty is being converted into inertia.**

That sentence is in §9.7 of this plan, and §9.7 did not stop it, **because §9.7 is a sentence and the
mechanism pays for sentences.** The only thing that breaks the loop is a unit of progress that prose
cannot satisfy. That is what P10 is, and it is why P10 names *one specific test* rather than "a test".

**The corollary nobody has stated, and it is the reason this section is here rather than in an
appendix.** Because the corrective machinery is itself a source of sentences, a risk section can be
part of the disease. This one is worth its tokens only if it produces three decisions (§12.1), one
calendar entry (N13), one committed RED test (N2), and a ten-line derivation script (N8). **If it
produces admiration for its own honesty and nothing else, delete it and go write the test.**

---

### 12.4 What we got wrong — the complete list, kept on purpose

A plan that only argues its own case is marketing. This list is not curated for length.

1. **Eighteen of eighteen headlines refuted in the eighteen-area run**, always flatteringly. A 100%
   one-directional defect rate is a reward function, not noise. The final gate's fixes cut it to
   **5 CONFIRMED / 10 OVERSTATED / 1 REFUTED**.
2. **No pinned corpus, for most of the programme.** Seven irreproducible file counts; exclusion
   policies flipped *within* single areas — one area excluded `node_modules` where it supported a
   conclusion and included it where it supported the opposite conclusion, in the same report. Fixed:
   `corpus-manifest.json`, `corpus_id sha256:3a010b16…`, and rule P1.
3. **The container's entire empirical case collapsed.** *"He already hand-builds bundles across 37.2%
   of files"* was **92.3% one machine-generated sync tree**. Honest figure ~2.2% of files, ~2.0% of
   bytes. That area's own pre-registered falsifier **fired** and it recorded *"FAILED TO REFUTE, in the
   founder's favour."*
4. **We justified block identity with "a git pull yields no op stream."** It yields two blobs and a
   merge base, and a diff *is* an op stream. The 294-revision-pair corpus was **built from git history
   — the diff was in hand for all 41,642 block-versions and was never used as a baseline.**
5. **The flagship number does not transfer to the flagship feature.** 99.627% is a BLOCK figure;
   comments anchor RANGES; the one range replication gives 3.44×, not 30×, with refusal roughly
   doubling. And ~1 heading in 4 cannot carry an anchor at all.
6. **Five designs were built on a carrier two measurements had already broken.** The HTML comment is
   deleted by GitHub's blob renderer (5 standalone comments in source, 0 in a 91,223-byte render) and
   by both clipboard flavours; five independent areas used it as the safe invisible channel and nobody
   reconciled it. D2 makes it moot for comments, which is luck rather than design.
7. **The document became the product.** See §12.3.
8. **The demand for commenting was reported backwards** at 6.9:1 in favour of multiplayer. Symmetric
   counting — the same corpus, de-confounded for Reddit permalink URLs containing `/comments/` and for
   `N comments` score metadata — gives **review loop 169 : collaboration 95, i.e. 1.78:1 the other
   way.** The original instrument used a broad three-alternative stem on one side and a narrow
   multi-word-phrase whitelist on the other. **This is the single most consequential correction in the
   corpus: it is the difference between building Yjs and building comments.**
9. **We carried an external baseline that was wrong in every digit.** The Hypothes.is orphan study was
   recorded internally as *n=20,953 / 27% / 61% / 3.5%*, self-flagged as "from a search-result summary…
   NOT read directly". The paper (arXiv 1512.06195) says **20,953 / 22% / 53% / 12%**.
10. **Two tooling guards report false failures** — `workflow-lint.sh` inverts on files over the pipe
    buffer (`grep -q` plus `pipefail` → SIGPIPE 141), and the loop-guard reports denials for calls that
    succeeded. A harness that reports false failures trains you to ignore it, which is the same disease
    as one that reports false passes (Learned Rule #65).
11. **`package.json` was destroyed to 17 bytes by a research subagent** and the repository was
    unbuildable for an unknown period, on a branch with no upstream, with the entire plan untracked.
    Fixed 2026-08-01 in `1bd4dad`; verified restored to 3,076 bytes in this session.
12. **Our own pre-mortem was wrong in the flattering direction three times, and its verifier caught all
    three.** (a) It claimed `corpus_id` *"DOES NOT REPRODUCE"* under 64 serializations — **it
    reproduces**, and the recipe was already written in prose in the document being audited; I
    re-derived it live in this session. (b) It claimed 1,399 revision pairs of which 48.3% delete zero
    lines — **642 of those were file creations with no predecessor**; on genuine pairs it is 6.1%, an
    8× error. (c) It claimed the "18 of 18" statistic was really 12 of 18 — **an artifact of a
    string-matching rule**; extended properly it is 18 of 18. An absence proven by an incomplete search,
    a rate confused with a population, and a classifier mistaken for a census — three defects the run
    was convened to catch, committed by the agent convened to catch them.
13. **Our splice-fidelity evidence was a tautology.** `src.slice(0,s) + src.slice(s,e) + src.slice(e)
    === src` is true for any `s ≤ e`; the test returned true for deliberately wrong offsets, absurd
    offsets and a degenerate range. **The conclusion is still right** — a re-run that *can* fail gave
    299/299 files and 2,832 syntax-preserving splices with structure intact — but the stated evidence
    proved nothing (Learned Rule #68).
14. **We claimed novelty five times and were refuted by a single search each time.** "No precedent for
    content-derived re-anchoring" — 25 years of prior art (Brush & Bargeron MSR-TR-2001-107, US7747943B2,
    the W3C Web Annotation Data Model's `TextQuoteSelector`, a W3C Recommendation since February 2017).
    "Nobody unpacks" — Aider at 47,848 stars ships exactly that, and its `choose_fence()` pre-empts our
    delimiter rule. Hence rule P8: every novelty claim carries the search that produced it.
15. **Zero live model calls and zero user conversations, across 34 research areas and roughly eight
    million tokens**, in a programme whose stated goals are "easier for AI to consume" and "the Google
    Docs of markdown". **Every "easier for AI" claim in this document is a prediction, not a result,
    and is labelled as one.**

---

### 12.5 The open decisions

Each with a recommendation and what would change it. Decisions already settled as D1–D10 are not
relisted; these are the ones the record answers twice, or not at all.

| # | decision | status | RECOMMENDED | what would change it |
|---|---|---|---|---|
| **W-A** | What the Max-tier download button produces (§12.1.1) | **OPEN** — answered two ways | zip of clean `.md` + generated `INDEX.md` + `VOCABULARY.md` | the founder answering K-D with "I meant one artifact". Ten minutes, never asked |
| **W-B** | Does D6 permit reference-carried payloads? (§12.1.2) | **OPEN** — boundary never drawn | **no.** Add the VOID verdict to the certificate; write the exclusion into D6 | one user, unprompted, expecting a `![[X]]`-style reference to render |
| **W-C** | Library/import model vs no runtime (§12.1.3) | **OPEN** — answered by deletion, never asked | no runtime; extensibility is D8 only; record as D11 | the founder saying the Python analogy meant discoverability, not importing — in which case it is a catalogue and everyone agrees |
| **10.1** | Backend — Firestore is in the code and the mockup; the product plan says Supabase eleven times | **OPEN** | pick **Firestore**, correct the product plan | a hard cost or region requirement Firestore cannot meet |
| **10.2** | **D3 — anonymous commenters** | **OPEN, under review** | **reopen as a tier split**: anonymous read-and-comment on a share link, login to resolve or edit. Owner and editor seats bill; commenters do not | the user probe showing reviewers do *not* stall at a login wall. Note the anonymity-as-wedge claim is UNSUPPORTED as a measured fact — this rests on funnel logic, not on the 190× |
| **10.3** | Real-time multiplayer architecture | **OPEN, not this cycle** | server-authoritative governs — but **both of the originally stated reasons are wrong** (one rests on a struck, `%`-commented line absent from the published paper). Justify on the Relay bug and on adoption (73/wk vs 7.2M/wk); strike the other two. The product plan still has three rows specifying Yjs and they contradict this | the review loop reporting an orphan rate that only a CRDT can fix |
| **10.4** | Does MDMAX have a business model? | **DECIDED** | **No.** It is a library subordinate to the editor. `cert` is the only public artifact. That is the answer | nothing short of `cert` clearing its own kill number by a wide margin |
| **10.5** | OKF | **RECOMMENDED, execute now** | **a target, not a host.** One column in the cert matrix; emit its §5 provenance fields rather than inventing a vocabulary; ship the producer-side checker OKF's ecosystem lacks | OKF shipping its own producer-side checker, which would close the one opening |
| **10.6** | Agent litter in the repo root | **OPEN, trivial** | remove or gitignore `arx.xml`, `cx.html`, `.scratch-*.mjs`, `polyg.yml`, `docs/engine/build/__pycache__/` — all still untracked as of this session | nothing |
| **10.7** | Where the branch lives | **OPEN, new** | merge or open a PR from `engine/plan-and-diagnostics` to `main` (currently 17 ahead, 0 behind) and commit the ten-line `corpus_id` derivation script under `scripts/derive/` | nothing |
| **10.8** | Who owns item 1, and by what date | **OPEN, and this is the one that decides the company** | Amit owns it end to end with his own commits, **or** it is contracted out, **or** K7 fires now. Pick this week | nothing. This cannot be deferred without deferring the kill gates, which is N13 |

---

### 12.6 What would have to be true for this to be worth twelve months

Six things. Two of them fall due within thirty days, and they are the only two that are not
negotiable.

**Within thirty days — by 2026-08-31 (a Monday):**

1. **A second GitHub login, who is not `sagnikmitra`, has written to a document they do not own, under
   their own attribution, and the test that proves it is green in CI.** This is kill gate K1. If it is
   still red, frontmatter is a library and not a company, and **we say so out loud** rather than
   holding the "Google Docs for markdown" label over code that admits one user.
2. **Amit has committed code.** This is kill gate K2. It is not a loyalty test; it is the only
   available measurement of whether the bus factor is one or two, and every schedule in this document
   assumes two.

**Within twelve months:**

3. **The review loop ships and reports an orphan rate that users tolerate.** Comments anchored to text,
   as a sidecar, never in the `.md`; the D2 gate green (delete the sidecar → `git status` clean, every
   file byte-identical); and the orphan rate visible as a product metric from the first comment
   written. The pre-registered threshold to beat is **~10% of threads per week of normal editing** —
   invented by this research because no competitor publishes one, so treat it as a hypothesis and
   publish the real number whatever it is.
4. **Somebody who is not Sagnik or Amit pays for it.** Any tier. The demand evidence in this programme
   is entirely scraped forum posts and plugin install counts; **W3 stands at zero**. The base rate for
   the give-away half is brutal and measured: markdownlint ran eleven years and four months to 2.89
   million downloads a week and zero dollars.
5. **The anchoring number is either re-derived and honest, or retired.** Stratified by edit shape, on a
   corpus this team did not write, with a committed derivation script and captured output, and a
   `diff3`-assisted baseline arm. If the >2-deleted-lines stratum is too small to measure on every
   available corpus, the number is restated as *"exact-hash resolution over an append-dominated
   corpus"* and never published as 99.627%.
6. **The three incompatible wants of §12.1 have been decided by the founder and written down as
   decisions**, so that the fifth document in this lineage does not rediscover the container.

**And one thing that must stay true throughout:** no further research fan-out of any kind until item 1
has one committed assertion going red to green. The standing rule was already in force once and a
40-agent fan-out happened anyway. **The marginal research hour is now provably worth less than the
marginal test.**

---

### 12.7 What this section does not cover, and what would falsify it

**What it does not cover.**

- **Legal, licensing and intellectual-property risk.** No freedom-to-operate search was run beyond
  noting that US7747943B2 exists in the anchoring prior art. No licence review was done for any
  renderer the certificate bench proposes to vendor (`cmark-gfm`, `kramdown`, `goldmark`,
  `pulldown-cmark`, `comrak`, `markdown-it`, `marked`, `commonmark.js`), nor for Linguist's
  `languages.yml` or Unicode's `confusables.txt`. Outline's licence resolves to NOASSERTION/"Other"
  (BSL-family), which matters if anyone treats it as more than evidence.
- **Financial risk.** No runway, no burn rate, no opportunity cost of the founders' client work is
  modelled anywhere in this document.
- **Operational and privacy risk of hosting other people's documents.** GDPR, data residency, the
  incident-response story, and what happens when a shared vault contains something a court wants.
  Nothing.
- **Concurrent-edit correctness.** The collaboration thesis rests on block-granular three-way merge,
  and the area that chose it states plainly: *"NO CONCURRENT-EDIT PATH WAS TESTED."* Zero areas
  consulted the structured-merge literature (Spork, jdime, semistructured merge, Apel et al.) — the one
  field directly load-bearing on the chosen architecture.
- **Any risk that depends on a user.** With W3 at zero, every sentence anywhere in this document about
  what a user will feel — about an orphaned comment, a login wall, a certificate, a degraded render —
  is `[inference]`, including every sentence in this section.
- **Any risk that depends on a model.** With W2 at zero, every "easier for AI" claim in this programme
  is a pre-registered prediction. It is labelled as one everywhere it appears, and it should stay
  labelled until somebody makes an API call.

**What would falsify this section.**

| if this were observed | then this section is wrong, and here is which part |
|---|---|
| Item 1's test goes green within thirty days with a day of work | N2's severity assessment is inflated; the floor was closer than the code reads, and the ranking's top item is wrong |
| Amit commits and takes item 1 | N11 dissolves and N1/N2's probabilities drop from HIGH; the whole ranking should be re-run |
| A user probe finds people asking, unprompted, to reference one document inside another and expecting it to render | §12.1.2's recommendation is wrong; D6 needs an exception and the VOID rule is too strict |
| The founder answers K-D with "I always meant one artifact" | §12.1.1's recommendation is wrong; A2 is the answer and the container work returns to scope with a real requirement behind it |
| The stratified re-derivation reproduces 99.627% *and* the `diff3`-assisted baseline lands below 95% on the >2-deleted-lines stratum | N3 is wrong and the anchoring invention is load-bearing rather than marginal. This is the single result that would most change the engine's scope |
| `mdmax cert` clears its kill number by a wide margin — well over 5 of 30 probed users saying they would install it | N9 is wrong, and open decision 10.4's "no business model" answer deserves reopening |
| A hand-audit shows the LCS-diff baseline's false-match rate above 0.5% on the 10–19 and 20+ token buckets | the "four of six capabilities have substitutes" argument weakens materially, and MDMAX's refusal discipline is doing real work |
| Thirty days pass, K1 and K2 fail, and the founders honour them out loud | N13 is wrong, and that is the most valuable falsification on this list |

**The last word, and it belongs to the research rather than to this document.** One area wrote about
itself: *"this entire area was a code review wearing a research costume and should be re-run as one."*
That sentence is true of more of this programme than one area — and it is also the reason to believe the
next thirty days can go differently, because a team that writes that sentence about its own work is a
team that will publish a bad benchmark result. **That property is the rarest thing here. It is worth
more than any of the measurements, and it is the only asset in this document that a competitor cannot
copy.**


---

---

### Links

**This section references:** [§1 Orientation](01-orientation.md) · [§2 Chronology](02-chronology.md) · [§3 Capabilities](03-capabilities.md) · [§4 Representation](04-representation.md) · [§5 Rendering](05-rendering.md) · [§6 Conventions](06-conventions.md) · [§7 Product](07-product.md) · [§9 AIOS](09-aios.md) · [§10 Engine spec](10-engine-spec.md) · [§11 Execution](11-execution.md)

**Referenced by:** [§2 Chronology](02-chronology.md) · [§9 AIOS](09-aios.md) · [§14 Verification](14-verification.md)

[← Index](README.md)
