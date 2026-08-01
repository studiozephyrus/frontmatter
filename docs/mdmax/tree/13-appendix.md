---
mdmax: 1
section: 13
title: "Appendix — the evidence base, the corpus, and where everything lives"
slug: 13-appendix
lines: 1164
words: 12924
forward_links: [1, 2, 3, 4, 5, 6, 7, 9, 10, 11]
backlinks: [2, 14]
prev: 12-risks
next: 14-verification
---

[← Index](README.md) · [← §12 Risks](12-risks.md) · [§14 Verification →](14-verification.md)

## 13. Appendix — the evidence base, the corpus, and where everything lives

This appendix exists so that a person who has never seen this project can pick up any number
in this plan, find where it came from, and re-derive it. It is a reference section, not an
argument. Nothing here is new analysis; everything here is a pointer, a recipe, a verdict
table, or a warning label.

**Read this appendix if you are about to:**

- quote a number from this plan in a pitch, a blog post, a README or a funding conversation;
- decide whether a research finding is strong enough to build on;
- re-run a measurement because you suspect it drifted;
- onboard someone who was not in the room.

**Three conventions used throughout the plan and this appendix.**

1. **Every claim carries a tier.** `[measured]` we ran it in this programme · `[primary]` we
   read the source document or the source code · `[secondary]` we read somebody else's report
   of it · `[inference]` we reasoned from something measured · `[SIMULATED]` we replayed data
   through code rather than reading it out of a live system.
2. **Every number about our own files cites a corpus id.** The id is
   `sha256:3a010b1649899795d79274fc528dbece97fdabf4ff0f81cc02ab619c048c51a4`, abbreviated
   throughout as `sha256:3a010b16…`. A number about local files with no corpus id is not a
   measurement; treat it as an anecdote.
3. **A verdict is not a fact.** The research corpus was adversarially verified, and the
   verifiers were themselves audited. Both layers have measured error rates. §13.3 gives them.

---

### 13.1 The pinned corpus

#### 13.1.1 What it is, and why it exists

The pinned corpus is a frozen inventory of 1,084 markdown files across three git repositories,
recorded with a per-file SHA-256 digest, so that any measurement over "our own markdown" can be
re-run later against exactly the same bytes.

It exists because of a failure. Before it was created, the programme published **seven
irreproducible file counts**, and at least one area flipped its own exclusion rules *within* a
single report — different sections of the same document counting different file sets and
presenting the results as comparable. `docs/mdmax/PLAN.md` v2.0.0 §9 item 2 records this as
defect #2 of ten. The manifest is the fix.

```
file      docs/engine/research/corpus-manifest.json
bytes     198,580
tracked   yes, since commit 1bd4dad
schema    { policy: {...}, roots: { <name>: { head, file_count, total_bytes,
                                              files: [ {path, sha256, bytes}, ... ] } },
            corpus_id, total_files, total_bytes }
```

`[measured]` Totals, quoted exactly as the manifest states them:

| field | value |
|---|---|
| `corpus_id` | `sha256:3a010b1649899795d79274fc528dbece97fdabf4ff0f81cc02ab619c048c51a4` |
| `total_files` | `1084` |
| `total_bytes` | `25548765` |

#### 13.1.2 The exclusion policy, verbatim

This is copied character-for-character out of `corpus-manifest.json` → `policy`. Do not
paraphrase it; the whole point of the manifest is that the rule is quotable.

```json
{
  "exclude_dirs": [
    ".git",
    ".next",
    ".obsidian",
    ".trash",
    ".venv",
    "__pycache__",
    "build",
    "dist",
    "node_modules"
  ],
  "exclude_toplevel": [
    "Mirrors",
    "Paste"
  ],
  "rule": "all *.md, case-insensitive; skip listed dirs at any depth; skip any dot-directory; skip listed top-level dirs per root"
}
```

**Three consequences a reader will trip over if nobody warns them.**

1. `build` is excluded *at any depth*. `docs/engine/build/README.md` exists on disk today and is
   **not** in the corpus. If you enumerate `docs/**/*.md` yourself you will get a different
   number than the manifest, and you will be wrong, not the manifest. `[measured]`
2. `Mirrors` and `Paste` are excluded only at the **top level of a root**. In the `md` vault
   `Mirrors/` holds read-only copies of 53 sibling repositories, and `Paste/` is the knowledge
   base's ingest inbox. Including either would have made the corpus mostly duplicates.
   One kill audit explicitly used this rule to dismiss five apparent wikilink resolutions:
   *"the 5 apparent hits all land in `md/node_modules/next/dist/docs/**`, which corpus policy
   excludes."* `[primary]`
3. The policy does **not** exclude machine-generated markdown, and this is the single largest
   known bias in the corpus. See §13.1.6.

#### 13.1.3 Per-root counts and git HEADs

`[measured]` Quoted exactly from the manifest, with the live re-check I ran while writing this
appendix on 2026-08-01:

| root | git HEAD at pin time | files | bytes | share of bytes | HEAD today |
|---|---|---:|---:|---:|---|
| `md` | `02c22ec47a3a73fb25a14b11be233ad3d00a8b48` | 756 | 21,068,853 | 82.46% | **unchanged** |
| `knowledge` | `464eb666946c8cb4ccf42c68f4464613e5fc4999` | 272 | 3,570,923 | 13.98% | **unchanged** |
| `frontmatter` | `798ebbf3250a5b2a53785859d79ae15f55ebebeb` | 56 | 908,989 | 3.56% | moved to `1bd4dad` |
| **total** | — | **1,084** | **25,548,765** | 100% | — |

Root name → filesystem path. **This mapping is not in the manifest**, which is a defect: the
manifest records root *names* only, so on any machine other than this one it is unresolvable
without out-of-band knowledge.

```
md          -> /Users/sagnikmitra/Desktop/GitHub/md            (github.com/sagnikmitra, private vault)
knowledge   -> /Users/sagnikmitra/Desktop/GitHub/knowledge     (github.com/sagnikmitra/knowledge)
frontmatter -> /Users/sagnikmitra/Desktop/GitHub/frontmatter   (this repo)
```

The `frontmatter` root moved after the pin. Commit `798ebbf` was HEAD when the corpus was
frozen; HEAD today is `1bd4dad` ("docs(mdmax): consolidate the plan, pin the corpus, commit the
research base"). One known file was created after the pin and is therefore **absent from the
corpus**: `docs/mdmax/PLAN.md`. Kill-audit A recorded this independently — *"My enumeration
reproduces the manifest to the byte (md 756/21,068,853; knowledge 272/3,570,923) with one known
addition, docs/mdmax/PLAN.md, created after the pin."* `[primary]` So **this plan is not in its
own corpus.** Any measurement that needs to include it must say so and state the new denominator.

#### 13.1.4 The recipe to re-derive the corpus id — write this down

This is the most operationally important paragraph in the appendix, because **four independent
agents failed to reconstruct this hash and published a null result about it.** The recipe was
sitting in prose one line above the number they were auditing.

The failure record, quoted exactly:

| who | what they reported |
|---|---|
| `premortem` (research) | *"corpus_id sha256:3a010b16… DOES NOT REPRODUCE under any of 64 serializations of the manifest's own (path, sha256) list"* |
| `moat` (unverified §5) | *"I could NOT reproduce the declared hash 3a010b16… from the (path, sha256) list; my guessed serialization produced a55879ba…"* |
| `agentic-docs` (unverified §7) | *"could NOT reproduce the id string; no derivation script exists in the repo"* |
| `custom-pointers` (unverified §4) | *"The `corpus_id` non-reproducibility is a NEGATIVE result over 30 serializations I chose"* |
| a verifier (`markdown-base` line) | two tab-separated constructions gave `sha256:0cbbdbd4…` and `sha256:2284b06e…`, neither matching |

Against that, two agents reproduced it. The `premortem` verifier REFUTED the null result:
*"It reproduces exactly on the first try under a natural serialization the researcher's
64-variant sweep evidently never combined… My sweep of 208 variants found it under two labels."*
And the premortem-integrator synthesis re-derived it independently and ruled:
**"IT REPRODUCES, AND I RE-DERIVED IT THIS SESSION."** `[primary]`

**I re-derived it a third time while writing this appendix. It matches exactly.** `[measured,
2026-08-01]`

**THE RECIPE, stated as an algorithm.**

1. For every root in `roots`, and every file entry in that root's `files` array, build the
   string `"<root>/<path>:<sha256>"`. The root name is joined to the path with a forward slash;
   the sha256 is joined to that with a single colon. No spaces, no tabs, no quoting.
2. Collect all such strings into one flat list across all roots. Do not group by root.
3. **Sort the list** with a plain byte/codepoint sort (Python's `sorted()`, `LC_ALL=C sort`).
   Not by root, not by insertion order.
4. Join with a single `\n`. **No trailing newline.**
5. SHA-256 the UTF-8 bytes of that string. Prefix the hex digest with `sha256:`.

**The ten lines that do it.** Commit this as `scripts/derive/corpus-id.py` — the plan's own rule
P2 ("no headline without a committed derivation script and its output") demands it, and
committing it retires this entire class of false alarm permanently.

```python
#!/usr/bin/env python3
"""Re-derive corpus_id from docs/engine/research/corpus-manifest.json. Exit 1 on mismatch."""
import hashlib, json, sys

m = json.load(open("docs/engine/research/corpus-manifest.json"))
lines = sorted(f"{root}/{f['path']}:{f['sha256']}"
               for root, r in m["roots"].items() for f in r["files"])
digest = "sha256:" + hashlib.sha256("\n".join(lines).encode()).hexdigest()
print(f"lines={len(lines)} blob_bytes={len('\n'.join(lines).encode())}")
print(f"computed={digest}\ndeclared={m['corpus_id']}")
sys.exit(0 if digest == m["corpus_id"] else 1)
```

**Expected output** `[measured, 2026-08-01]`:

```
lines=1084 blob_bytes=131186
computed=sha256:3a010b1649899795d79274fc528dbece97fdabf4ff0f81cc02ab619c048c51a4
declared=sha256:3a010b1649899795d79274fc528dbece97fdabf4ff0f81cc02ab619c048c51a4
```

The first and last lines of the sorted blob, for anyone debugging a near-miss:

```
first  frontmatter/AGENTS.md:bfc925c20452436a57cc6139191930365967bf7ab86511e2ac3dc70de1f30962
last   md/trade.md:8cb2304d8a0c3e9c287c54d4e54badfa0fedd10a1bf3e9a24d7bae75adda63e0
```

The manifest's own totals also reproduce from its per-root lists: summing every entry's `bytes`
gives exactly `25548765`, and counting entries gives exactly `1084`. `[measured]`

**The four common failure modes**, each of which produced one of the published null results:
using a tab instead of a colon; appending a trailing newline; sorting within each root and
concatenating rather than sorting the union; omitting the root prefix so paths collide across
roots.

#### 13.1.5 Verifying the corpus has not drifted

Separate from re-deriving the id, you should periodically confirm the *files on disk still
match* the pin. Three agents ran this check independently and all three got zero drift; I ran
it a fourth time while writing this. `[measured, 2026-08-01]`

```python
#!/usr/bin/env python3
"""Re-resolve every manifest path against the live working trees."""
import hashlib, json, os
ROOTS = {"md":          os.path.expanduser("~/Desktop/GitHub/md"),
         "knowledge":   os.path.expanduser("~/Desktop/GitHub/knowledge"),
         "frontmatter": os.path.expanduser("~/Desktop/GitHub/frontmatter")}
m = json.load(open("docs/engine/research/corpus-manifest.json"))
ok = missing = mismatch = 0
for root, r in m["roots"].items():
    for f in r["files"]:
        p = os.path.join(ROOTS[root], f["path"])
        if not os.path.exists(p):
            missing += 1; continue
        if hashlib.sha256(open(p, "rb").read()).hexdigest() == f["sha256"]: ok += 1
        else: mismatch += 1
print(f"total={ok+missing+mismatch} ok={ok} missing={missing} mismatch={mismatch}")
```

```
total=1084 ok=1084 missing=0 mismatch=0
```

Independent confirmations on the record, quoted: kill-audit B — *"all 1,084 files resolved, 0
missing, 0 sha256 mismatches, so the vaults have not drifted since pinning"*; kill-audit C —
*"0 missing, 0 sha256 mismatches, 25,548,765 bytes total. The corpus is fully reproducible today
and is the one asset in this program I would trust without re-derivation"*; a verifier —
*"`files_seen 1084 missing 0 bytes 25548765 hash_ok 1084 hash_bad 0`"*. `[primary]`

#### 13.1.6 What the corpus is NOT — the biases, stated

The corpus is the strongest asset in this programme and it is still a narrow, self-authored
sample. Every one of the following was raised by a research area against its own findings.

| bias | evidence | who raised it |
|---|---|---|
| **One operator.** All 1,084 files were authored by two people and an AI. | 82.46% of bytes are one personal vault. | `product-gap` unverified §2; `hold-more` |
| **Machine-generated bulk is included and unlabelled.** | The container thesis' empirical case — *"he already hand-builds bundles across 37.2% of files"* — was **92.3% one machine-generated sync tree**: 340 of 340 `source: claude` files inside `md/Skills/**`. Honest figure ~2.2%. | `founder-thesis` verifier; recorded in PLAN v2.0.0 §9 item 3 |
| **One workflow's signature.** | *"The 0-definitions result, the 13,028 wikilinks, the 73.9% bash fence share and the 3.4% real-HTML share are all plausibly signatures of one Obsidian-based workflow."* | `hold-more` unverified |
| **Append-dominated git history.** | In `md`, 4,948 of 5,715 `.md` file-revision pairs (86.6%) delete zero lines. An anchoring statistic re-derived on this corpus inherits that shape. | `premortem` |
| **`docs/mdmax/PLAN.md` is absent** (created after the pin). | See §13.1.3. | kill-audit A |

**The falsification test for the corpus itself.** `docs/engine/PLAN.md` §11 W1 proposes a second
corpus (`~/.claude/skills-src`, 474 `*.md` files / 5,013,124 bytes, path-list sha256
`72b867b02163ece7346e50cbae5cc71a`) precisely to break the single-author bias. `market-and-gift`
used it and then flagged the obvious problem against its own case: *"it is still a corpus on this
operator's machine, and W1's real requirement (a corpus somebody else wrote) is still unmet."*
`[primary]` **A corpus authored by a stranger is the single highest-value missing artifact in the
evidence base**, and it is the gate on publishing the anchor number (§13.4, row A1).

---

### 13.2 Every research artifact

#### 13.2.1 Inventory

All paths are relative to the repository root
`/Users/sagnikmitra/Desktop/GitHub/frontmatter`. All are tracked in git as of commit `1bd4dad`.
`[measured]`

| path | bytes | what it is | how to read it |
|---|---:|---|---|
| `docs/engine/research/corpus-manifest.json` | 198,580 | The pinned corpus. §13.1. | `json.load` |
| `docs/engine/research/wf-final-gate-2026-08-01.result.json` | 1,364,043 | **Run 3, the final gate.** 16 areas, adversarial verification, a kill audit, 4 synthesis lenses. The governing research artifact. | `json.load`; see §13.2.2 |
| `docs/engine/research/wf-final-gate-2026-08-01.raw.json` | 1,436,963 | The workflow envelope for run 3: `summary`, `agentCount`, `logs`, `result`, `workflowProgress`, `totalTokens`, `totalToolCalls`. | `json.load` |
| `docs/engine/research/wf-final-gate-2026-08-01.journal.jsonl` | 1,333,281 | 80 newline-delimited records for run 3 — 40 `started`, 40 `result`, keyed by `agentId`. | one `json.loads` per line |
| `docs/engine/research/wf-mdmax-capability-2026-08-01.result.json` | 1,420,260 | **Run 2, the capability sweep.** 18 areas, adversarial verification, 3 synthesis lenses. No kill audit. | `json.load` |
| `docs/engine/research/wf-mdmax-capability-2026-08-01.raw.json` | 1,487,390 | Envelope for run 2. | `json.load` |
| `docs/engine/research/wf-mdmax-capability-2026-08-01.journal.jsonl` | 1,382,194 | 78 records for run 2 — 39 `started`, 39 `result`. | one `json.loads` per line |
| `docs/engine/research/wf-findings-2026-08-01.md` | 128,449 | **Run 1, the foundations run.** 6 areas, markdown prose, per-finding tiered evidence. **No verification layer, no kill audit.** | read; sections start `## AREA:` |

**Run statistics**, read from the `raw.json` envelopes `[measured]`:

| run | agents | topology | total tokens | tool calls |
|---|---:|---|---:|---:|
| Run 2 — capability | 39 | 18 research + 18 verify + 3 synthesize | 7,864,147 | 2,159 |
| Run 3 — final gate | 40 | 16 research + 16 verify + 4 audit + 4 synthesize | 7,858,804 | 2,173 |

Run 1's agent count is not recorded in a machine-readable envelope; it is described in the
handoff record as a 25-agent run over 6 areas. Treat "25 agents" as `[secondary]`.

#### 13.2.2 How to parse the workflow result JSONs

Both result files share a shape. Do **not** grep them — the payloads contain escaped newlines,
Unicode em-dashes and nested quotes, and a naive grep will match across record boundaries.

```python
import json
d = json.load(open("docs/engine/research/wf-final-gate-2026-08-01.result.json"))

d["areas_total"]        # 16   (run 2: 18)
d["areas_completed"]    # 16   (run 2: 18)
d["headline_verdicts"]  # run 3 ONLY: [{area, verdict}, ...]
d["kill_audit"]         # run 3 ONLY: 4 auditor reports
d["per_area"]           # 16 (run 2: 18) area records
d["synthesis"]          # 4 (run 2: 3) cross-cutting lenses
```

**`per_area[i]` fields.** Run 3 carries `area, title, headline, falsifier, findings, negatives,
unclaimed, design, measurement, kill_condition, effort, unverified, verification`. Run 2 carries
the same minus `falsifier` and `negatives` — **the two fields that were added specifically to fix
run 2's defect rate.**

**`per_area[i].verification` fields.** Run 3: `intent, area, headline_verdict, verdicts,
survived, killed, new_defects`. Run 2: the same **minus `headline_verdict`** — which is why run
2's per-area verdicts must be recovered from the `verdicts` array by finding the entry whose
`claim` string begins with `HEADLINE`.

```python
# recover run-2 headline verdicts
d2 = json.load(open("docs/engine/research/wf-mdmax-capability-2026-08-01.result.json"))
for a in d2["per_area"]:
    hits = [v for v in a["verification"]["verdicts"] if v["claim"].upper().startswith("HEADLINE")]
    print(a["area"], hits[0]["verdict"] if hits else "n/a")
```

**Each entry in `verdicts` is `{claim, verdict, reason}`**, sometimes with a `correction`. The
`verdict` vocabulary is `CONFIRMED · OVERSTATED · REFUTED · UNSUPPORTED`.

> **THE SINGLE MOST IMPORTANT RULE FOR USING THESE FILES.** `per_area[i].headline` is what the
> researcher *claimed*. `per_area[i].verification` is what survived. **Read the verification.
> Never quote a headline.** Run 2's headlines had a measured 100% defect rate, always in the
> flattering direction. Run 3's headlines were corrected in 11 of 16 areas.

A structural wrinkle worth knowing: the string a verifier labels `HEADLINE:` inside `verdicts`
is not always the same sentence as the area's `headline` field. `model-view` is the clearest
case — its `headline` is about invisible characters and a +14.991% token surcharge, while its
`HEADLINE:`-labelled verdict is about this repo's `AGENTS.md` never being loaded. When the two
diverge, the `verdicts` entry is what was actually checked.

#### 13.2.3 Run 3 — the final gate: full headline verdicts

`[primary]` The complete `headline_verdicts` array, quoted exactly, in file order.

| # | area key | title | **verdict** | claim-level breakdown |
|---:|---|---|---|---|
| 1 | `the-era` | Is there actually a new era of markdown, or is that a story we are telling ourselves | **OVERSTATED** | 14 claims: 7 CONFIRMED, 3 OVERSTATED, 4 REFUTED |
| 2 | `founder-thesis` | Reconstruct and steelman the founder thesis from the record, then find its blind spot | **REFUTED** | 10 claims: 4 CONFIRMED, 3 OVERSTATED, 3 REFUTED |
| 3 | `container-thesis` | The mother markdown: one file containing many, with breakpoints, split on read | **OVERSTATED** | 18 claims: 10 CONFIRMED, 6 OVERSTATED, 1 REFUTED, 1 UNSUPPORTED |
| 4 | `markdown-base` | Markdown as a codebase — what a compiler over a FOLDER enables that per-file tools cannot | **OVERSTATED** | 11 claims: 7 CONFIRMED, 2 OVERSTATED, 1 REFUTED, 1 UNSUPPORTED |
| 5 | `custom-pointers` | Custom reference pointers, custom definitions, and the library-import model | **CONFIRMED** | 12 claims: 8 CONFIRMED, 3 OVERSTATED, 1 REFUTED |
| 6 | `hold-more` | How to make a markdown file hold more, convey more, and mean more | **CONFIRMED** | 14 claims: 11 CONFIRMED, 1 OVERSTATED, 2 REFUTED |
| 7 | `rendering-frontier` | Rendering — what frontmatter can render that nobody does, and what it must refuse | **CONFIRMED** | 12 claims: 11 CONFIRMED, 1 OVERSTATED |
| 8 | `parsing-robustness` | Technical foolproofing — what makes a markdown compiler unbreakable | **OVERSTATED** | 11 claims: 4 CONFIRMED, 4 OVERSTATED, 2 REFUTED, 1 UNSUPPORTED |
| 9 | `product-gap` | What frontmatter currently misses, against every product it must beat | **CONFIRMED** | 13 claims: 10 CONFIRMED, 3 OVERSTATED |
| 10 | `moat` | First-mover advantage — what is actually defensible and what gets cloned in a weekend | **OVERSTATED** | 14 claims: 5 CONFIRMED, 4 OVERSTATED, 2 REFUTED, 3 UNSUPPORTED |
| 11 | `market-and-gift` | Marketability, and the 50% that is given away | **OVERSTATED** | 16 claims: 10 CONFIRMED, 2 OVERSTATED, 3 REFUTED, 1 UNSUPPORTED |
| 12 | `aios-transfer` | What 35 days of AIOS actually transfers to building MDMAX | **OVERSTATED** | 10 claims: 4 CONFIRMED, 3 OVERSTATED, 3 REFUTED |
| 13 | `agentic-docs` | The agent-native document — what changes when the primary author is a machine | **OVERSTATED** | 12 claims: 6 CONFIRMED, 5 OVERSTATED, 1 REFUTED |
| 14 | `competitive-live` | Live competitive sweep — what shipped in the last 120 days | **CONFIRMED** | 14 claims: 10 CONFIRMED, 3 OVERSTATED, 1 UNSUPPORTED |
| 15 | `against` | The strongest case that MDMAX should not be built | **OVERSTATED** | 11 claims: 3 CONFIRMED, 6 OVERSTATED, 2 REFUTED |
| 16 | `premortem` | Pre-mortem — it is 2027 and this failed. What happened? | **OVERSTATED** | 14 claims: 7 CONFIRMED, 2 OVERSTATED, 4 REFUTED, 1 UNSUPPORTED |

**Totals.** `CONFIRMED 5 · OVERSTATED 10 · REFUTED 1`. Across all 16 areas, 206 individual claims
were adjudicated: **117 CONFIRMED, 45 OVERSTATED, 25 REFUTED, 9 UNSUPPORTED.** `[measured]`

The four synthesis lenses in run 3, quoted from `synthesis[i].lens`:

| lens | scope |
|---|---|
| **era-and-vision** | Is there a new era, what is MDMAX the answer to, do the container and markdown-as-codebase theses survive the founder's own corpus |
| **product-market** | What ships, in what order, to whom, at what price, what is given away |
| **technical** | Engine specification: passes, offset model, parse-robustness regime, carriers, container contract, module system, incremental architecture |
| **premortem-integrator** | Integrating the opposition case and the pre-mortem against all 16 areas, for two founders who start building immediately |

Each lens carries `thesis`, `ranked`, `dependencies`, `contradictions`, `what_to_cut` and (run 3
only) `one_sentence`. The `contradictions` arrays are where cross-area disagreements were
adjudicated; §13.6 lifts the ones that still matter.

#### 13.2.4 Run 2 — the capability sweep: verdicts and the 100% defect rate

Run 2 has **no `headline_verdicts` array and no kill audit.** Verdicts must be recovered per area.

`[measured]` Recovered from `per_area[i].verification`:

| # | area key | title | headline verdict | claims | survived | killed | new defects |
|---:|---|---|---|---:|---:|---:|---:|
| 1 | `edit-format` | Own the LLM edit format and the region primitive | **REFUTED** | 15 | 11 | 10 | 8 |
| 2 | `cache-layout` | Cache-aware document layout as a compiler pass | **REFUTED** | 12 | 12 | 13 | 11 |
| 3 | `ai-dialect` | Recognize and lift the AI markdown dialect | not separately labelled | 11 | 9 | 15 | 13 |
| 4 | `token-cost-tier` | Token cost as a first-class diagnostic tier | not separately labelled | 8 | 8 | 9 | 8 |
| 5 | `retrieval-shape` | Retrieval-shape diagnostics — which parts of a document are invisible | not separately labelled | 12 | 8 | 9 | 12 |
| 6 | `degradation-certificate` | The degradation certificate — a per-document conformance matrix | not separately labelled | 8 | 12 | 10 | 12 |
| 7 | `multi-format-ingest` | Multi-format ingestion and representation choice, judged by downstream accuracy | **REFUTED** | 11 | 10 | 10 | 11 |
| 8 | `provenance-boundary` | Provenance that survives the markdown boundary | not separately labelled | 14 | 13 | 12 | 12 |
| 9 | `collab-primitives` | Google Docs of markdown — collaboration primitives on plain .md | **REFUTED** | 10 | 9 | 12 | 14 |
| 10 | `impact-preview` | Impact preview and semantic diff — the compiler-only editor features | not separately labelled | 10 | 8 | 11 | 12 |
| 11 | `model-view` | Show me what the model sees — a debugger for context | **CONFIRMED** (of a sub-claim) | 20 | 11 | 13 | 8 |
| 12 | `integrity` | Invisible-content integrity — what a file says vs what it looks like it says | **REFUTED** | 10 | 14 | 7 | 10 |
| 13 | `normalization-i18n` | Normalization and non-Latin capability as a differentiator | not separately labelled | 10 | 9 | 8 | 9 |
| 14 | `unit-of-exchange` | The unit of exchange — message-level MDMAX and the human-paste hop | not separately labelled | 8 | 8 | 10 | 12 |
| 15 | `missing-constructs` | The constructs markdown is missing, derived from strain rather than from demand | not separately labelled | 13 | 12 | 15 | 8 |
| 16 | `adjacent-transplant` | Adjacent-field transplant — capabilities documents have never had | not separately labelled | 8 | 8 | 8 | 7 |
| 17 | `budget-knapsack` | What to inline first — the context budget as a measured problem | **REFUTED** | 11 | 10 | 12 | 12 |
| 18 | `governance-and-moat` | How MDMAX actually gets adopted, and what makes the moat durable | **UNSUPPORTED** | 12 | 7 | 9 | 9 |

**The claim this run is famous for, and its honest form.** Run 2's own critic synthesis states:
*"18 of 18 area headlines were materially refuted by their own adversarial verifier. Not
qualified — refuted. The sentence a reader would remember from every area was wrong, and it was
wrong in the flattering direction every time."* It then lists the corrections:
`0.155%→0.0204%`, `51,620→17,065`, `12/12→11/12`, `30×→3.44×`, `8,603:1→1,067:1`,
*"zero implementations"→two shipping packages found in one query*, *"the surface does not
exist"→15.1× larger once the excluded construct is counted*. `[primary]`

**That paragraph is substantively right and literally unreproducible.** Only 8 of 18 areas carry
a verdict entry explicitly labelled `HEADLINE`; of those, 6 are REFUTED, 1 is UNSUPPORTED, and 1
(`model-view`) is CONFIRMED — but the CONFIRMED one is a different sentence from the area's
`headline` field. **Governing statement for this plan:** *every area's headline was materially
corrected by its own verifier, always in the flattering direction; six were explicitly REFUTED
and one UNSUPPORTED.* Do not write "18 of 18 refuted" without that footnote.

Run 2's three synthesis lenses: **google-docs** (which collaboration capabilities, in what order,
make a plain-`.md` editor competitive), **ai-native** (a markdown representation easier for AI to
consume and produce, with zero adoption required on the receiving side), and **critic** (what all
18 areas missed, and the case that the programme is over-researched and under-built).

#### 13.2.5 Run 1 — the foundations run

`docs/engine/research/wf-findings-2026-08-01.md`, 128,449 bytes, six areas, markdown prose:

1. Markdown editor feature frontier — what does not exist anywhere, and what requires a compiler
2. Document-format package ecosystems: precedent, registry design, absence semantics, security surface, vendor hosting
3. AI-to-AI document/context exchange: protocol payload formats, handoff loss, whether markdown is the right carrier
4. Prior art, failure modes, and design for a single root markdown file that transitively references a large corpus
5. Adversarial audit of the MDMAX / frontmatter-engine research programme
6. How formats/languages actually evolve, and whether CommonMark can be changed — governance mechanics

Each area is `## AREA: <title>`, then `**HEADLINE:**`, then `**FINDINGS:**` as a bullet list where
every bullet carries a tier tag (`[primary-read]`, `[own-measurement]`, `[search-only]`) and an
`EVIDENCE:` line with URLs, IDs and verbatim quotations.

> **Warning label.** Run 1 has **no verification layer and no kill audit.** Its findings sit at
> exactly the tier that run 2's headlines occupied before verification — the tier measured at a
> 100% one-directional defect rate. Its per-finding evidence is unusually rich (forum thread IDs,
> like counts, verbatim user quotes, plugin download JSON) and is the best source in the corpus
> for *demand* evidence. **But no number in §13.4's measurement index is drawn from run 1**, and
> none should be until it gets an adversarial pass.

---

### 13.3 The kill audit — how much to trust the verifiers

Run 3 added a layer nobody else in this programme had: **an audit of the verifiers themselves.**
Four independent auditors were each handed a set of "kills" (a verifier's claim that a
researcher's finding is wrong) and asked to re-derive each one from primary sources.

`[measured]` Quoted exactly from `kill_audit[i]`:

| auditor | handed | audited | upheld | overturned | published false-kill rate |
|---|---:|---:|---:|---:|---|
| A | 29 | 29 | 24 | 5 | **`5/29 = 17.24%`** |
| B | 29 | 29 | 28 | 1 | **`1/29 = 3.4%`** |
| C | 29 | 21 | 17 | 4 | **`4/21 = 19.0% (19.048%)`** |
| D | 28 | 26 | 26 | 0 | **`0/26 = 0.0%`** |
| **pooled** | **115** | **105** | **95** | **10** | **10/105 = 9.524%** |

**How to read these numbers.**

- **The pooled false-kill rate is 9.524%, i.e. the verification layer is ~90.5% reliable at the
  verdict level.** `docs/mdmax/PLAN.md` v2.0.0 §0 says "roughly **88%** reliable"; the unweighted
  mean of the four published rates is 90.07% and the pooled figure is 90.476%. **Neither
  arithmetic yields 88%**, so treat 88% as a conservative round-down of unknown provenance and
  quote 90% with the derivation, or quote the four rates individually.
- **Ten of the 115 kills handed out were never audited** and are excluded from the denominator
  rather than guessed. Auditor C left 8 unaudited (`moat`'s three moat claims, `market-and-gift`'s
  two, `aios-transfer`'s three) because they turn on original claim text or a transcript-mining
  selection rule that is not on disk. Auditor D left 2 (`aios-transfer :: Claim 10`, which needs
  a 1,944-file scratch artifact that does not exist in the repo; and `competitive-live :: DESIGN
  item 2 strip_references`, which had no toggle to replicate against).
- **Auditor A's rate is a floor, not a ceiling.** It states: *"One kill — the-era Claim 6,
  'adoption is already FLATTENING' — rests on a sample definition… that is not recoverable from
  anything on disk… If the true verdict there is OVERTURNED, the false-kill rate is 6/29 = 20.7%.
  The published 17.24% is therefore a floor-to-central estimate, not a ceiling."* Under that worst
  case the pooled rate is 11/105 = 10.476%, i.e. 89.5% reliable.

**The one rule that would have caught every false kill.** Auditor A found the pattern and stated
it as an operating procedure. Adopt it verbatim:

> *"Kills that QUOTE A PRIMARY SOURCE (a line of code, an API field, a star count, an issue
> state, a passage in a plan doc): **16 of 16 correct. Not one error.** … Kills that RE-DERIVE A
> NUMBER and substitute their own: **5 of 13 wrong**, i.e. a 38% defect rate in the half of the
> work that requires the verifier to do its own measurement. All five failures are the same shape
> — the verifier picked a different operational definition from the researcher's, did not disclose
> the switch, and scored the mismatch as the researcher's defect.
> RECOMMENDATION: **accept a kill that cites a source; independently re-derive any kill that
> substitutes a number.** That single rule would have caught all five false kills and cost
> nothing on the other 24."*

**The second-order finding: verdicts are far more reliable than the numbers inside them.**
Auditor B: *"verdict reliability is ~97% while number reliability is ~83%. Do not paste a
verifier's replacement figure into the PLAN without re-deriving it."* Auditor D reached the same
place from zero overturns: *"Trust the verdicts: 26/26. Do not copy individual figures out of a
kill without re-deriving them: 5 of 26 kills carry a supporting number that is wrong,
unreproducible, or internally inconsistent."*

**The failure signature has a direction, and it is the mirror image of the researchers'.**
Auditor C: *"All four overturns are the same species: a verifier constructing a denominator or a
definition, finding it does not match, and reporting a defect instead of reporting that it could
not reproduce the researcher's definition… Note the asymmetry: the researchers' defects ran
flattering; the verifiers' defects run damning. Both are reward functions."*

**A structural gap in the verification layer, found by auditor A and still unfixed:**

> *"TWO VERIFIERS DISAGREED WITH EACH OTHER ON THE SAME MEASUREMENT, AND NOBODY NOTICED. The
> container-thesis verifier used the LINE-INITIAL backtick rule to compute the spec's fence width
> (correct…). The founder-thesis verifier used ANY-POSITION on the same corpus and killed a claim
> with it (incorrect). Same 1,084 files, same afternoon, opposite definitions, no reconciliation.
> Whatever ran these verifiers has no cross-area consistency check. That is a structural gap, not
> a one-off."*

**The governance consequence, and it is now rule P4 in this plan.** Auditor C: *"nothing should
be DELETED on a kill alone. On this sample, executing all 21 kills unaudited would have destroyed
four correct findings, including a corpus denominator that reproduces to within 0.003%."*

**Where the kills were right, they were devastating**, and those must be actioned rather than
softened. Auditor A's list: 91% of `founder-thesis` C2's headline is one machine sync tree; only
86 of 393 intra-document anchors resolve under the canonical slugger against a claimed 348; all 4
unclosed fences are one generator's output in one directory.

**The auditors audited themselves too**, which is the reason to trust them at all. Auditor A:
*"I nearly produced a false overturn myself: my first, uncontrolled test of the 47x diff claim
varied manifest layout while an offset-bearing manifest masked the effect, showing a 0.7% swing
and pointing at OVERTURN. A properly controlled second experiment with an offset-free manifest
showed a 291x swing (1,077 B vs 313,870 B) and upheld the kill."*

---

### 13.4 The measurement index

Every load-bearing number in this plan, with its source, its tier, and — the column that matters
— whether anyone other than its author has reproduced it.

**Legend for "reproduced":** **YES** = re-derived by a second, independent party. **PARTIAL** =
reproduced by the same run's verifier or on a different selection. **NO** = single source, never
re-derived. **N/A** = external point-in-time read, not reproducible by construction.

#### A — The anchor (the flagship claim)

| id | value, quoted exactly | what it measures | source | tier | reproduced |
|---|---|---|---|---|---|
| A1 | **99.627% correct / 0.050% false / 0.323% safe refusal** | content-derived re-anchoring, anchorable blocks only | `docs/engine/PLAN.md:116` | `[measured]` | **NO** |
| A2 | 41,642 block-versions, 294 consecutive real revision pairs, denominator 32,919 surviving block-versions, 384-configuration parameter sweep | A1's population | `docs/engine/PLAN.md:80`, §1.1a | `[measured]` | **NO** — no selection script exists in the repo |
| A3 | byte offset 36.93% / **62.12% false** / 0.95%; block index 44.43% / 55.50%; content hash alone 83.36% / 0.00% / 16.64%; hash + nearest-position 77.80% / **22.20%**; rigid k=1/2/3 90.65 / 88.68 / 87.22% | the baselines A1 beats | `docs/engine/PLAN.md` §1.1a table | `[measured]` | **NO** |
| A4 | `~41 ms` for a 446 KB / 2,225-block document | resolve cost | `docs/engine/PLAN.md` §1.1a | `[measured]` | **NO** |
| A5 | 14.2% of blocks are identity-free; **88.9% of raw false matches are `---` horizontal rules**; the `anchorable()` gate moves false from 0.349% → 0.050% | the gate | `docs/engine/PLAN.md` §1.1a | `[measured]` | **NO** |
| A6 | LCS 30-line diff baseline **86.658%** (77.297% / 9.361% split, 394 pairs); verifier's independent run **85.036%** (76.346% / 8.690%, 494 pairs, 31,149 anchorable block-versions); hash-alone-unique 76.352% | the adversarial baseline that nearly matches A1 | `against` + its verifier | `[measured]` | **PARTIAL** — two runs, two selections, same result |
| A7 | independent S1 replication **87.03%** (77.304% unique + 9.727% duplicate) against the plan's *"S1 exact hash resolves 87.0%"* | closest thing to corroboration of any part of A1 | `against` unverified §4 | `[measured, different selection]` | **PARTIAL** |
| A8 | the range case gives **3.44×**, not 30×, with refusal roughly doubling | whether A1 transfers to comment anchors | `docs/mdmax/PLAN.md` v2.0.0 §5.2 | `[measured, one replication]` | **NO** |
| A9 | ~1 heading in 4 cannot carry an anchor — **18.3% / 25.4% / 24.7%** under 3 tokens | headings are what everything points at | `docs/mdmax/PLAN.md` v2.0.0 §5.2 | `[measured]` | **NO** |
| A10 | Hypothes.is: 20,953 annotations, **~22% no longer attachable** | the only production datum on long-lived anchors | `against`, arXiv abstract only | `[secondary]` | **NO** |

> ### The 99.627% warning, in full
>
> **Nobody has re-derived this number. Not one person, not one agent, not one area.** The
> following areas quoted it and each stated in writing that they did not re-derive it:
> `founder-thesis` (*"I did not re-derive the 99.627% anchor figure"*), `markdown-base`
> (*"[not re-derived]"*), `custom-pointers` (*"INHERITED from the plan and NOT re-derived here"*),
> `product-gap` (*"I did NOT re-derive the 99.627% re-anchoring figure"*), `competitive-live`
> (*"I did NOT re-derive them… Tier: secondary"*), `against` (*"THE 99.627% IS STILL UNVERIFIED
> BY ME… I verified only that no derivation script exists anywhere in the repository"*),
> `premortem` (*"Nobody has since it was first produced… SECONDARY at best"*).
>
> Four independent things are wrong with quoting it today:
> 1. **No derivation script exists.** Verified by search, twice, independently.
> 2. **No selection script exists** for the 294 revision pairs, so nobody can check whether the
>    sample inherits the corpus's 86.6% append-dominance. `premortem`: *"If the pairs were
>    hand-picked for substantive edits, finding 5 weakens sharply."*
> 3. **A 30-line adversarial baseline reaches 86.658%** on the same class of problem (A6). The
>    marginal value of the whole mechanism over a diff is ~13 points, not ~22 as against
>    hash-alone.
> 4. **It is a BLOCK figure and comments anchor RANGES** (A8).
>
> **DECIDED:** do not publish it. **RECOMMENDED:** re-derive it under kill gate K3, on a corpus
> this team did not write, with `diff3-assisted` as an arm, and with the derivation script
> committed. **OPEN:** whether the tuned 384-configuration parameter set beats
> `dom-anchor-text-quote`'s 182-line defaults — `moat` calls this *"the single most important
> open question"* and nobody has run it.

#### B — The corpus and the writer

| id | value | source | tier | reproduced |
|---|---|---|---|---|
| B1 | 1,084 files / 25,548,765 bytes / 3 roots | `corpus-manifest.json` | `[measured]` | **YES** — 4 independent re-resolutions, 0 drift |
| B2 | `corpus_id sha256:3a010b16…` | §13.1.4 | `[measured]` | **YES** — reproduced 3×; 4 published failures, all serialization errors |
| B3 | **107,287** top-level blocks spliced byte-identically across **1,080 files**, **0 failures**, using stock `mdast` `position.offset` | run 3 technical synthesis | `[measured]` | **NO** — single run, but the strongest positive in the corpus |
| B4 | **0 of 120** files byte-identical through `mdast-util-from-markdown` → `mdast-util-to-markdown` (stratified sample, all 3 roots, seed 20260801, GFM) — confirms D7 | `container-thesis` verifier | `[measured]` | **PARTIAL** — corroborates `docs/mdmax/PLAN.md` §4.2's "0 of 51" |
| B5 | **907** files carry YAML frontmatter; **171 throw** under the editor's writer; **33** survive byte-identical; 624 remainder. Stable across 4 script revisions | `product-gap` | `[measured]` | **YES** — capability run reproduced 907/119/13.12%/618/170/18.74% "to the last digit" |
| B6 | the `yaml` library round-trips **119 of 907** byte-identically; **170 files do not parse at all** (18.74%) | `docs/mdmax/PLAN.md` v2.0.0 §5.1 | `[measured]` | **YES** |
| B7 | a no-op round trip through `parseFrontmatter → stringifyFrontmatterDoc` changes **623 of 737** files with an editable frontmatter map (**84.5%**), total \|byte delta\| **46,732**; 421 respaced / 197 reflowed / 5 separator-only; moves line numbers in 26.7% | `product-gap` C2, verdict CONFIRMED | `[measured]` | **PARTIAL** |
| B8 | only **67 of 1,080** files have bytes == UTF-16 units == code points; **93.8% already diverge** | `docs/mdmax/PLAN.md` v2.0.0 §5.5 | `[measured]` | **NO** |
| B9 | AST histogram over all 1,084 files (remark-parse 11.0.0 + remark-gfm 4.0.1 + remark-frontmatter 5.0.0), 21 distinct node types: `text=334081 paragraph=142802 listItem=88434 inlineCode=76118 strong=44893 heading=28221 tableCell=25813 list=15160 emphasis=12741 tableRow=9374 code=7738 html=7720 link=5453 thematicBreak=2754 blockquote=2742 table=1150 root=1084 yaml=907 break=613 delete=444 image=16`; `definition` **absent** | `hold-more` | `[measured]` | **PARTIAL** — 3 independent cross-checks matched exactly (link=1838 CommonMark-only, image=16, yaml=907) |
| B10 | **0 link reference definitions in 25,548,765 bytes** — so the linkref carrier has zero collision risk | `markdown-base` | `[measured]` | **YES** — falls out of B9's absent `definition` node |
| B11 | **288 files (26.57%)** lack a trailing newline; **7 (0.65%)** have unterminated fences; 4 are zero bytes; 1 uses CRLF; **598 (55.2%)** paths contain a space; 18 path characters are em-dashes; max path length 134 | `container-thesis` C7 + verifier | `[measured]` | **YES** — 4 of 6 reproduced exactly by the verifier |
| B12 | line-initial backtick runs: **15,435, all exactly 3** → a 4-backtick fence is provably sufficient. Any-position histogram: `1×157,494 / 2×42 / 3×15,506 / 4×4` (all four inline, in `docs/engine/PLAN.md` lines 652 and 1042) | two verifiers | `[measured]` | **YES** — and this definitional split caused one false kill; see §13.6 |

#### C — Links, the graph, and provenance

| id | value | source | tier | reproduced |
|---|---|---|---|---|
| C1 | `[text](path.md)` resolves **546/637 = 85.71%**; `[[Name]]` resolves **2,754/9,962 = 27.65%** — a 58-point gap on identical files | `docs/mdmax/PLAN.md` v2.0.0 §3.2 / §5.3 | `[measured]` | **YES** — *"I replicated it a third time"* (run 3 synthesis) |
| C2 | median out-degree **ZERO**, mean 2.27, p90 5; **597 files (55.1%)** zero outbound resolved edges; **502 (46.3%) fully isolated**; **511 connected components**, largest holds 40.1% | `docs/mdmax/PLAN.md` v2.0.0 §3.2 | `[measured]` | **YES** — four independent agents plus the synthesizer agree |
| C3 | transclusion `![[…]]` occurs **45 times in 25.5 MB — all 45 are syntax documentation**; genuine content transclusion is **ZERO** | ibid. | `[measured]` | **YES** |
| C4 | only **86 of 393** intra-document anchors resolve under the canonical slugger, against a claimed 348 | kill-audit A (upheld kill) | `[measured]` | **PARTIAL** |
| C5 | anchor health swings **77 percentage points** on the choice of heading slugger | `agentic-docs` | `[measured]`, own re-implementation | **NO** — *"must be re-run against the real `github-slugger`"* |
| C6 | **240 of 365** provenance `original:` keys fail directory-relative resolution (225 excluding 15 template placeholders); **365 of 365** fail root-relative. The widely-quoted **"273 of 365" reproduces under nothing** | kill-audit D | `[measured]` | **YES** — *"If the team writes down 'provenance never resolves' they will be wrong; a third of it does"* |
| C7 | 1,838 inline links against 142,802 paragraphs and 88,434 list items — so an inline-attribute carrier cannot reach most of a document | `container-thesis` | `[measured]` | **PARTIAL** |
| C8 | **330 HTML comments across 160 files**; GitHub **deletes** them in both API modes | `hold-more` | `[measured]` | **NO** — independently re-derives D2 from the carrier side |

#### D — The container

| id | value | source | tier | reproduced |
|---|---|---|---|---|
| D1 | container **25,548,765 B** vs a one-line-per-document index at **105,538 B** → **242×** | run 3 synthesis | `[measured]` | **NO** |
| D2 | a 200K-token window holds **2.82%** of the container and **682%** of the index; a 1M window holds **14.1%**; mean file **23,569 B**, so a 200K pack carries about thirty average files | ibid. | **`[inference]`** — see the warning below | **NO** |
| D3 | `llm-code-format` **387 downloads/month** against repomix's **327,543** → **846:1**. repomix **27,551 stars**. repomix issue #226 (unpack): **0 reactions after 19 months** | `founder-thesis`, `container-thesis` | `[primary]` | **N/A** — point-in-time |
| D4 | Obsidian forum thread asking to export a vault to a single file: **9,010 views, 1 like, 3 posts in 26 months** | `docs/mdmax/PLAN.md` v2.0.0 §3.1 | `[primary]` | **N/A** |
| D5 | reference pack round trip: **1084/1084 byte-identical at +0.892% overhead**; 4 files (0.369%) end inside an unclosed fence | `container-thesis` verifier | `[measured]` | **PARTIAL** — `docs/engine/PLAN.md` §5 has a 6-file / +0.99% version |
| D6 | *"he already hand-builds bundles across 37.2% of files"* — **403 of 1,084 (37.2%), 12,193,061 of 25,548,765 bytes (47.7%)** with ≥2 real top-level H1 — **then killed: 92.3% is one machine sync tree (340 of 340 `source: claude` in `md/Skills/**`); honest figure ~2.2%** | `founder-thesis` + verifier | `[measured]`, **refuted** | **YES** |

> **TIER CORRECTION, and it must be made in the plan body.** `docs/mdmax/PLAN.md` v2.0.0 §3.1 tags
> D2 as `[measured, corpus_id sha256:3a010b16…]`. The `container-thesis` area's own `unverified`
> field says the opposite, in capitals: *"TOKEN COUNTS ARE INFERENCE, NOT MEASUREMENT. No
> tokenizer was installed and I would not npm install one under the RULE 4 guard, so every token
> figure… rests on an assumed 3.6 bytes/token for English markdown. The conclusions are robust
> across 3.0-4.0 B/tok but the exact percentages are not measured."* **The area's own disclosure
> governs.** The byte ratio (D1) is measured; every percentage-of-a-context-window derived from it
> is `[inference]`.

#### E — The era

| id | value | source | tier | reproduced |
|---|---|---|---|---|
| E1 | CommonMark released examples: **649 at 0.29 (2019-04-06) → 652 at 0.30 (2021-06-19) → 652 at 0.31.2 (2024-01-28)**; master HEAD still reads 0.31.2 but carries **655**, i.e. +3 unreleased for 2.5 years. Spec commits/yr **48/15/14/15/13/11/7/6** from 2019 to 2026 | `the-era` falsifier F3 | `[primary]` | **YES** — verifier calls it *"the single most decisive fact in the area"* |
| E2 | `cmark-gfm` last release **0.29.0.gfm.13, 2023-07-21**, still pinned to CommonMark 0.29 (2019) | ibid. | `[primary]` | **YES** |
| E3 | markdown is the **#1 file type an agent reads (23.51%)**, ahead of `.tsx` and `.ts`; **#2 written** | `the-era` | `[measured]` | **YES** — *"replicated on an independent scan"* |
| E4 | **94.1–94.3%** of a June-2026 corpus and **91–92.4%** of July-2026 files were created inside an agent session | ibid. | `[measured]` | **YES** — *"replicated to within one file of 991"* |
| E5 | AGENTS.md **0% → 30.67%** of the 300 most-starred GitHub repos in 15 months (92/300); **32.09%** on the top 215 by star rank (69/215). The researcher's own figure was 57/215 = **26.51%** and the verifier called it **CONSERVATIVE**. Companions: CLAUDE.md 76 = 25.33%; `.claude` 45 = 15.00%; README.md 278 = 92.67%. Earliest AGENTS.md creation month **2025-05** | `the-era` + verifier | `[measured]` | **YES** — the only correction in run 3 that ran in the flattering direction |
| E6 | convention births mostly die: in 215 top-starred repos, `llms.txt` **0.47%**, `.cursorrules` **0.93%**, `AGENT.md` **0.00%**, `.windsurfrules` **0.00%**, `GEMINI.md` **2.33%**. AGENTS.md's own add rate **halved**: +7/month (Feb–Mar 2026) → **+3.0/month** (Apr–Jul 2026) | ibid. | `[measured]` | **PARTIAL** — verifier got 0.33% / 0.67% on the larger sample |
| E7 | react-markdown **11,786,121 → 103,114,261/mo**; streamdown **0 → 14,477,148/mo** since 2025-08-14; remend **0 → 16,192,091/mo** since 2025-12-03. **But `streamdown@2.5.0` pins `remend@1.3.0` as a direct dependency**, so the combined number double-counts one install base | `the-era` + verifier | `[primary]` | **YES** |
| E8 | generic markdown parsers grew only **1.44×** faster than the whole npm registry (median ×4.05 vs a 14-package control median ×2.81) | `the-era` falsifier F2 | `[measured]` | **NO** — **JavaScript only**; PyPI download trends were not measurable |
| E9 | markdown's share of repository file trees **fell 12.68% → 10.41%** (2024-08 → 2026-06, 12 unnamed repos) **versus** kill-audit A's named 8-repo test showing it **rose 1.142% → 1.460%, up in 7 of 8** | `the-era` vs kill-audit A | `[measured]`, contradictory | **REFUTED IN BOTH DIRECTIONS** — do not state it |

#### F — Product, market and demand

| id | value | source | tier | reproduced |
|---|---|---|---|---|
| F1 | **review loop 169 : collaboration 95 = 1.78:1** in favour of commenting, reversing an earlier 6.9:1 the other way | `docs/mdmax/PLAN.md` v2.0.0 §4.1 | `[measured]` | **NO** — own regexes over own selection (`frontmatter-raw-corpus.json` + `frontmatter-r2-raw-corpus.json`, 550,131 bytes, 3,804 string leaves). **Does not cite `corpus_id`.** |
| F2 | 92 sourced pain points, 89 feature requests, a 20-app competitor matrix, every claim carrying a verbatim quote + URL | `docs/FRONTMATTER-PRODUCT-PLAN.md` | `[primary]` | **N/A** |
| F3 | `mdmax cert` targets pains ranked **13th and 14th of 14** | `docs/mdmax/PLAN.md` v2.0.0 §5.4 | `[measured]` | **PARTIAL** |
| F4 | Obsidian demand, verbatim thread stats: typed links #6994 **820 likes / 213 posts / 49,514 views**, open since 2020-07-03; rename propagation #25412 **340 / 80 / 11,899**; block embeds #27093 **553 likes**; block identity #674 **845 / 197 / 58,338** | run 1, area 1 | `[primary]` | **N/A** — run 1 is unverified |
| F5 | plugin installs: dataview **4,659,822**; excalidraw **6,900,710**; templater **5,043,982**; strange-new-worlds **132,197**; 6,138 plugins listed | run 1, `official obsidianmd/obsidian-releases community-plugin-stats.json` | `[primary]` | **N/A** — cumulative and age-biased; `docs/engine/PLAN.md` §16.1 declares this metric unreliable |
| F6 | `inkeep/OpenKnowledge` shipped **2026-07-30**, **3,239★**, GPL-3.0, shipped content-derived anchoring and **explicitly declined the teammate model** | `competitive-live` | `[primary]` | **N/A** — beta published 02:38:33Z, six minutes before the researcher's first tool call |
| F7 | OKF `SPEC.md` v0.2, **37,544 bytes**, inside `GoogleCloudPlatform/knowledge-catalog` (**8,134** stars). Its benchmark: **+5.2% tokens**, 22/26 vs 20/26, **n=1 per cell** | `against`, `agentic-docs` | `[primary]` | **PARTIAL** — the authors themselves say *"not a result anyone should quote as a headline"* |
| F8 | markdownlint ran **11 years 4 months to 2.89M downloads/week and zero dollars** | `market-and-gift` | `[primary]` | **N/A** |
| F9 | pricing anchors: Obsidian Sync **$4/mo annual**, Obsidian Commercial **$50/user/year**, HackMD Prime **$5**, Notion Business **$20** | `docs/research/frontmatter-competitor-gapmap.md`, re-verified live | `[primary]` | **N/A** |

#### G — Hazards, defects and repo state

| id | value | source | tier | reproduced |
|---|---|---|---|---|
| G1 | `WIKILINK_RE` at **k=1.98 — 36,865 ms on 320 KB of `[[`** | `parsing-robustness` | `[measured]` | **NO** |
| G2 | `mdast-util-from-markdown` **12,429 ms vs micromark's 1,207 ms** on identical bytes — a **10.3× gap that widens** | ibid. | `[measured]` | **NO** |
| G3 | micromark **39,611 ms** on 2.56 MB of indented lists | ibid. | `[measured]` | **NO** |
| G4 | `JSON.stringify` **12,076 ms** freeze / `RangeError: Invalid string length` (Node v24.6.0) | ibid. | `[measured, Node]`, `[inference, browser]` | **NO** |
| G5 | a marked blockquote depth boundary moves **1902 → >1907** the moment `--stack-size` changes | kill-audit B — **the one overturned kill** | `[measured]` | **YES** — and it is the textbook case of an equality-pinned assertion on an environment-dependent quantity |
| G6 | 20 commits, **all by Sagnik Mitra `<sagnikmitra123@gmail.com>`** | `premortem`, verified | `[measured]` | **YES** |
| G7 | `package.json` was **destroyed to 17 bytes** by a research subagent; live today with **47 dependencies + 18 devDependencies** | `against` unverified §10; live check | `[measured, 2026-08-01]` | **YES** |
| G8 | *"Fourteen untracked files, 4,965,476 bytes… the 16 commits that DO exist are on no remote"* | `premortem` | `[measured, then true]` | **STALE** — see below |
| G9 | the **"55 payloads"** figure cited in `docs/engine/PLAN.md` §15, `docs/engine/README.md` lines 664 and 787 and the dossier **does not reproduce**: the file has 327 lines, 15 `it()` blocks, arrays of 39 and 6 (=45); a broader sweep gives 71 | `market-and-gift` unverified §7 | `[measured]` | **NO** — live stale number in three published artifacts |
| G10 | `firestore.rules` contains `"comments"` **zero times**; `firestore()` has **zero callers**; no signup/register/onboard route exists | `docs/mdmax/PLAN.md` v2.0.0 §6 | `[measured, verified live]` | **YES** |
| G11 | `~/.sgnk/bin/sgnk-regression-gate.sh:70` — `grep -c .` on an empty gates file prints `0` **and** exits 1, so `\|\| echo 0` also fires, yielding the two-line string `0\n0`, and the write-landed guard errors out inoperative | kill-audit C, "bonus defect outside the kill set" | `[measured]` | **NO** — a live bug in a tool the AIOS transfer plan depends on |

> **G8 is now corrected by live state.** `[measured, 2026-08-01]` Commit `1bd4dad` tracked
> `docs/mdmax/PLAN.md`, `corpus-manifest.json`, all six workflow artifacts, `wf-findings` and all
> three HANDOFF files. `git branch -r --contains HEAD` returns `origin/engine/plan-and-diagnostics`
> — the branch **is** pushed. `origin/main` remains at `8eb4de2`. The residual untracked set today
> is **221,055 bytes of agent litter**: `.scratch-carrier.mjs`, `.scratch-lossy.mjs`, `arx.xml`,
> `cx.html`, `polyg.yml`, `docs/engine/build/__pycache__/`. That is `docs/mdmax/PLAN.md` §10.6's
> open item, and it is all that is left of what the pre-mortem correctly called an
> existential-risk-by-`git clean`.

---

### 13.5 The unverified list — everything a reader might mistake for a measurement

This list is assembled from the `unverified` field of all 16 areas in run 3. **Every item here
was volunteered by the agent that produced the surrounding findings.** That is the strongest
signal in the corpus that the tier discipline was actually running.

**Grouped by failure class rather than by area, because the classes are what repeat.**

#### 13.5.1 Not measured at all

- **Zero live model calls were made, in any run, in any of the 34 areas.** `custom-pointers`:
  *"I made ZERO live model calls. Every claim about what a model does with a declared notation is
  a pre-registered prediction, labelled as one."* `agentic-docs`: *"Every claim about what helps
  or hurts an agent's comprehension remains a PREDICTION."* `rendering-frontier`: *"No model was
  called. Every statement about what an AI consumer would prefer to see rendered is absent from
  this report on purpose."* **Consequence: every "easier for AI", "fewer tokens for a model",
  "a model will understand this" sentence anywhere in this plan is a prediction.**
- **Zero users, zero interviews, zero willingness-to-pay probes.** `premortem`: *"There are still
  zero users, zero interviews and zero willingness-to-pay probes in this entire program… Every
  sentence anyone writes about what users will feel about an orphaned comment, including mine, is
  INFERENCE."*
- **Google Docs round-trip fidelity.** `moat`: *"I did NOT run a round trip through Google Docs
  and measure byte loss… Do not put a number on Google Docs' markdown loss without running it."*
- **The app was never run.** `product-gap`: *"I did not run the app at all. Every claim about
  `src/` is a source read."* Specifically unverified by execution: that Publish 502s on the 171
  unparseable files. `premortem`: *"I did NOT run the test suite, the build, or the app."*
- **Closed-source editors.** `rendering-frontier`: *"Typora, Bear, Craft and Notion-import are
  CLOSED SOURCE. I fetched nothing primary for them and I am reporting nothing about them…
  treat their row in any survey as EMPTY, not as 'renders the basics'."* `moat` declined Roam and
  Typora on the same grounds.
- **Clipboard behaviour was never observed.** `hold-more`: *"CLIPBOARD IS INFERENCE, NOT
  MEASUREMENT. No browser was driven."*
- **Four of six comparison formats.** `hold-more`: DocBook, JATS, DITA and OOXML *"WERE NOT
  READ"*; only TEI and HTML5 were done.
- **arXiv and Product Hunt.** `competitive-live`: arXiv refused three times (429/429/503) →
  *"I have ZERO arXiv coverage"*; Product Hunt *"NOT ATTEMPTED"*.
- **Hugging Face dataset cards, PyPI download trends.** `the-era`: both blocked by the sandbox
  allowlist. *"the entire Python side of the parser story is missing."*

#### 13.5.2 Search-only (absence of evidence, not evidence of absence)

- **Every "nobody has built X" claim.** `rendering-frontier`: *"'Nobody has built X' in the
  unclaimed list rests on `registry.npmjs.org` keyword search, whose `total` field is the size of
  the registry rather than a match count — so it is search-only evidence of ABSENCE, the weakest
  kind."* `competitive-live`: GitHub **code** search returned `total_count 0` even for queries
  known to match — *"Treat every unclaimed item as 'not found by repo/registry search', not
  'proven absent'."*
- **`mdmax cert`'s niche emptiness** is established **on npm only** (four searches, 32 results).
  PyPI, crates.io, Go modules, Homebrew and RubyGems were not searched. `premortem`.
- **GitHub code-search counts are severe undercounts.** `market-and-gift`: llms.txt 9,640,
  `.editorconfig` 82,848, `commitlint.config.js` 10,896 — *"should be read as ordinal only."*
  `agentic-docs`: `filename:AGENTS.md` total_count 179,552 — *"treat as an order of magnitude,
  never as a count."*
- **The llms.txt headline.** `the-era`: *"The llms.txt figure in the brief — '28% of 137,000
  domains published one and 97% received ZERO requests' — is SEARCH-ONLY to me. I could not reach
  the source and did not re-derive it. Do not treat the 28%/97% pair as verified by this run."*
- **"Nobody ships a document-tree lock file"** rests on five npm queries. `markdown-base`.

#### 13.5.3 Inference presented at measurement's confidence

- **Container token arithmetic** (D2 above) — assumed 3.6 bytes/token, no tokenizer installed.
- **Stratified-symbol early-cutoff.** `markdown-base`: *"[inference, not measured] The claim that
  stratifying `symbols` into four durability-graded keys raises the early-cutoff rate from 19.7%
  to ~93.4%… I did not build the stratified engine and measure it. It is arithmetic on a
  measurement, not the measurement."*
- **The 37.6% machine-authored share.** `founder-thesis`: *"an INFERENCE — a two-component
  mixture over one construct… the mixture is not a classifier and must never be reported as one."*
- **Boundary-destruction scenarios.** `container-thesis`: *"clean_delete, merge_across,
  truncate_tail, elide_unchanged and reorder are my constructions, not observed model outputs…
  their relative FREQUENCY in real model returns is unknown, and the frequency is what decides
  whether refuse-and-localise is a rare annoyance or a constant one."*
- **Clone-time estimates.** `moat`: *"nobody should quote 'a weekend' as if it were measured."*
- **Certificate perishability.** `premortem`: *"'The certificate is perishable' is INFERENCE from
  release cadence, not measurement of behavioural drift."*
- **Mermaid CDN drift.** `rendering-frontier`: jsdelivr is not on the allowlist, so *"the PDF path
  serves 11.16.0 today"* is inference from npm semver resolution.

#### 13.5.4 Synthetic, replayed, or upper-bounded — the `[SIMULATED]` family

- **The 500 MB scale test.** `container-thesis`: *"THE 500 MB SCALE TEST IS SYNTHETIC. It is the
  pinned corpus replicated 20 times, so it has 20× the cross-file redundancy of a real 500 MB
  vault. Pack THROUGHPUT (270 MB/s) and boundary-scan time are unaffected by redundancy and stand;
  any compression ratio derived from it does not."*
- **The 75.8% exact-recovery figure** *"should be read as an upper bound on the uncorrelated case,
  not as a forecast"* — the edit model is hand-written mutations with an arbitrary p(edited)=0.5.
- **The 12.22% near-miss figure** is an **upper bound**; *"the true rate is likely far closer to
  the exact-recovery 0.28%."* `founder-thesis`.
- **The 60.0% / 47.3–78.3% copy-drops-context figures** are an **upper bound** on "only in tool
  context" because exact substring containment over-counts. `agentic-docs`.
- **The "2 of 15 disagree" certificate figure** is a **lower bound** on disagreement — and the
  area kept it because *"it happens to cut against my own argument."* `market-and-gift`.

#### 13.5.5 Single-implementation, single-run, or environment-bound

- **`markdown-base`**: *"Every parse-behaviour number… comes from marked 16… I did not cross-check
  against cmark-gfm, micromark, comrak or commonmark.js… Treat every parse-derived figure as
  one-parser-measured."* And: *"one run of one script over one commit window with one definition
  of 'exported interface' that I chose. Per LR#63, one run is an anecdote."*
- **`parsing-robustness`**: cmark-gfm and pandoc are not installed; markdown-it JS is not
  installed and its Python port was used as a proxy — *"the timings are Python-vs-JS and NOT
  comparable as absolute numbers."* `resourceLimits` behaviour is *"measured on ONE configuration…
  mechanism unexplained."* And one sub-experiment is self-disqualified: *"my shingle hostile-case
  B was BADLY DESIGNED — I generated tokens with a modulo-97 vocabulary, so it produced only 97
  distinct shingles and proved nothing."*
- **`rendering-frontier`**: the alt-text decay measurement has **n=21 markdown images and n=11 raw
  `<img>`** — *"The 100% figure is real for this corpus and it is a tiny sample. Do not publish it
  as a rate."*
- **`aios-transfer`**: agent-behaviour numbers come from *"a MOVING selection: 1,944 transcript
  files with no pinned manifest, measured once… it needs a corpus id before it is quoted."*
- **`hold-more`**: *"MY OWN HARNESS PRODUCED ONE FALSE RESULT I CAUGHT MID-RUN… I report this
  because a single-pass harness result in this report should be assumed to carry others of the
  same kind that I did not catch."*
- **`markdown-base`, disclosed self-error**: *"My first setext measurement reported 908 traps and
  was wrong by 904 because it counted YAML frontmatter closers… the only thing that caught it was
  noticing that 908 was suspiciously close to 907 files-with-frontmatter."*

#### 13.5.6 Point-in-time reads that are already stale

Every star count, download count, view count, price and publish date in this plan was read on
**2026-08-01** and is moving. `container-thesis`: *"STAR AND DOWNLOAD COUNTS ARE POINT-IN-TIME."*
`competitive-live`: *"Star counts, download counts and dates are all point-in-time reads on
2026-08-01T02:44Z–03:40Z. The OpenKnowledge beta was published at 02:38:33Z, six minutes before
my first tool call — this field is moving faster than the document that reports it."*

#### 13.5.7 Sandbox and rate-limit gaps that shaped the evidence

Worth recording because they are re-runnable, not intrinsic:

- `api.github.com` ran **unauthenticated at 60 requests/hour** in several areas because
  `/Users/sagnikmitra/.config/codex-env/tokens.zsh` is denied by the sandbox. Kill-audit A:
  *"that capped my repo-tree test at 8 usable repos and forced me to drop `rust-lang/rust`… and
  `facebook/react`."* **Making that token readable would materially widen several samples.**
- The network allowlist blocked `agents.md`, `llmstxt.org`, `huggingface.co`, `pypistats.org`,
  `cdn.jsdelivr.net`, `codeberg.org` and NVD.
- One benign false positive is on the record and should not be re-litigated: kill-audit A's
  injection-scan hook fired on *"Forget all"*, which is the JSDoc line *"Reset - Forget all
  previous slugs"* inside the official `github-slugger@2.0.0` tarball. No action was taken.

---

### 13.6 Contradictions inside the evidence base, and which one governs

Every entry names both sources and states the ruling. These are the ones a reader will otherwise
hit and have no way to resolve.

| # | the disagreement | ruling |
|---|---|---|
| 1 | **corpus_id reproducibility.** `premortem` (64 variants, "MATCH: NONE"), `moat` (`a55879ba…`), `agentic-docs`, `custom-pointers` (30 variants) all failed. The `premortem` verifier and the premortem-integrator synthesis both reproduced it. | **IT REPRODUCES.** Three successful derivations including mine (§13.1.4). Four published nulls were serialization errors. **Commit the ten-line script.** |
| 2 | **AGENTS.md denominator.** `the-era` headline says "26.51% of the 300 most-starred repos"; its evidence says 215 of 300 were measured; its verifier re-ran all 300 and got 30.67%, and 32.09% on the top 215 by rank. | **The verifier governs: 30.67% of 300, 32.09% of the top 215.** The researcher's headline misstated its own denominator. `docs/mdmax/PLAN.md` v2.0.0 §2 already quotes 30.67% and is correct. |
| 3 | **Backtick maximum.** Line-initial max = 3 (15,435 runs). Any-position max = 4 (four inline occurrences). Two verifiers used opposite rules on the same corpus the same afternoon; one produced a false kill. | **Line-initial governs fence-sufficiency** (4 backticks are provably sufficient). Any-position governs only the pack format's stated `max+1` formula — **which computes 5 on this corpus and therefore contradicts its own justification.** Fix the formula's wording, not the fence width. |
| 4 | **Fenced-file count.** `container-thesis` C7: 463 of 1,084 (42.71%). `founder-thesis` verifier: 496 of 1,084 (45.76%). | **Neither governs.** Neither states its fence-detection rule. Do not quote either until one commits a derivation script. |
| 5 | **repomix downloads.** 327,543 (used for the 846:1 ratio) vs 327,053 for 2026-07. | **Neither.** Quote as *"roughly 327,000/month, read 2026-08-01"* and the ratio as *"roughly 850:1"*. |
| 6 | **Link counts.** AST `link=5453` with GFM autolink literals; `link=1838` CommonMark-only; 13,028 wikilinks (`hold-more`) vs 9,962 `[[Name]]` (`docs/mdmax/PLAN.md`). | **All four are correct under their own definitions.** State the parser configuration with every link number or do not state the number. |
| 7 | **"18 of 18 headlines refuted."** The critic synthesis and `docs/mdmax/PLAN.md` §9 say 18/18; the machine-readable field yields 6 REFUTED + 1 UNSUPPORTED + 1 CONFIRMED explicitly labelled, 10 unlabelled. | **The substance governs, the literal count does not.** Say: *every area's headline was materially corrected, always flatteringly; six explicitly REFUTED and one UNSUPPORTED.* |
| 8 | **Early-cutoff rate.** `markdown-base` measured 19.71%; the prior record says 69.1%. | `markdown-base`'s reconciliation — *"theirs is dominated by bulk machine commits (12 commits >60 files contributing 5,751 revisions)"* — is **well-evidenced inference, not confirmed**; the divergence is established, the cause is not. **Neither number should be published.** |
| 9 | **Markdown's share of repository trees.** Fell 12.68%→10.41% (12 unnamed repos) vs rose 1.142%→1.460% in 7 of 8 named repos. | **UNPROVEN IN BOTH DIRECTIONS.** `docs/mdmax/PLAN.md` v2.0.0 §2 already says *"Don't say it."* Correct. |
| 10 | **Container sequencing.** `container-thesis` says ship `pack` beside `cert` in the MVP; `founder-thesis` says promote it; the plan says the container is deliberately not in the MVP; `against` argues it out entirely. | **The plan governs** (`docs/mdmax/PLAN.md` v2.0.0 §3.1): a bounded read-only machine-facing pack is a legitimate later feature, not the product and not the MVP. |
| 11 | **`premortem`'s untracked-research risk.** | **STALE.** Corrected by live state at `1bd4dad`; see G8. |

---

### 13.7 Glossary

Alphabetical. Every term a cold reader needs before reading any other section of this plan.

**anchor** — a durable identifier for a piece of a document that survives an *out-of-band* edit,
i.e. one made by a tool that never told us it happened (`git pull`, `vim`, an agent writing the
file). The anchor is the invention this project rests on. See `docs/engine/PLAN.md` §1.1.

**anchorable** — the gate that decides whether a block can carry an anchor at all. Defined as
*"not a rule, not punctuation-only, ≥ 3 tokens."* **14.2% of blocks in the corpus fail the gate**
and must be positionally interpolated between anchorable neighbours, never anchored. The gate
moves the false-match rate from 0.349% to 0.050% and is described in the record as *"the
highest-leverage single line in the design."*

**block** — the unit MDMAX operates on: a top-level markdown node (paragraph, heading, list,
fence, table). **The block is the unit of identity, not of meaning** — `docs/engine/PLAN.md` §11a
measured a heading as almost exactly as good a topic boundary as a blank line (AUC 0.508). Median
block in the corpus is 84 bytes.

**block-version** — one block as it appeared in one revision of one file. The anchoring
measurement's population is 41,642 block-versions drawn from 294 consecutive revision pairs.

**carrier** — the syntactic slot used to smuggle machine-readable data through a markdown file
without a human seeing it. Candidates measured in `docs/engine/PLAN.md` §5: HTML comment
(`<!-- fm:file … -->`), link reference definition (`[fm:file]: a/b.md "…"`), code-fence info
string, `:::` container, heading, bracketed span. **GitHub deletes the HTML comment in both API
modes**, which is the carrier-side re-derivation of D2.

**cert** — `mdmax cert`, the capped give-away artifact: per document, per target, per construct,
emit **PASS · STRIP · CORRUPT**. Targets are `(product, surface)` pairs, because GitHub's API
renderer and blob renderer were measured disagreeing on mermaid on identical bytes.

**confidence ladder** — the three-tier diagnostic scheme in `docs/engine/PLAN.md` §4. **E —
Enforce**: mechanically decidable, zero interpretation, *and* human-accepted; errors; fails the
build. **W — Warn**: mechanically decidable but plausibly deliberate; never fails. **I — Inform**:
semantic, requires judgment, carries a confidence score and a reason; advisory. *"A diagnostic may
only reach tier E if a human accepted the constraint that produced it."*

**corpus id** — `sha256:3a010b16…`. The label that makes a number about our own files
reproducible. Recipe in §13.1.4. **A number about local files with no corpus id is not a
measurement.**

**degradation** — what happens to a construct when it reaches a renderer that does not know it.
**This is the feature, not the bug** (decision D6): an unknown *fence language* round-trips
byte-perfectly; an unknown *node type* throws. Every extension MDMAX ships must degrade to
something harmless.

**degradation certificate** — the per-document conformance matrix `cert` produces. See **cert**.

**false kill** — a verifier's kill that an auditor overturned. Measured across four audits at
17.24% / 3.4% / 19.0% / 0%, pooling to 9.524%. §13.3.

**falsifier (pre-registered)** — a condition an area writes down *before* concluding, which would
prove its own conclusion wrong. Added in run 3 and absent from run 2. `the-era` ran four (F1–F4)
and none fired. `founder-thesis` ran one that fired **in the founder's favour** and recorded that
fact, which is the single clearest evidence the discipline was real.

**headline verdict** — the adjudication of an area's top-line sentence by its adversarial
verifier. Vocabulary: `CONFIRMED · OVERSTATED · REFUTED · UNSUPPORTED`. **Always read this before
quoting a headline.**

**kill** — a verifier's finding that a specific researcher claim is wrong. **kill audit** — the
fourth-layer check that re-derives a sample of kills from primary sources. Run 3 only.

**mother markdown** — the founder's image of one markdown file containing many, split on read.
**Abandoned** (`docs/mdmax/PLAN.md` §3.1): at 25,548,765 bytes it is 242× a one-line-per-document
index, and it is impossible at this vault's own scale. What survives is a bounded, read-only,
machine-facing `pack`.

**normalize()** — the text canonicalization applied before hashing a block: NFC + collapse
whitespace + lowercase. **It is unversioned, and its first change silently re-keys every stored
anchor.** Rule P7 exists solely to force it to be frozen and versioned before a single anchor is
persisted.

**orphan** — a comment whose anchor no longer resolves to any range in the document. **Orphaning
visibly is the design; guessing is forbidden.** The **orphan rate** ships as a visible product
metric from the first comment written.

**pack / unpack** — `frontmatter pack` serialises a folder into one human-readable, dumb-viewer-
renderable markdown container; `unpack` reverses it. The folder stays canonical.

**projection** — a derived, budgeted *view* of a document emitted as an ordinary `.md` file
(index tier, outline tier, full). Not a new format: the output is plain markdown a model or human
can read with no tooling. Byte ratios measured at 61–152× (index) and 15–35× (outline); **these
are artifact-size ratios, not task-token savings** — the only live measurement of task tokens went
the wrong way at +5.2%.

**recogniser** — a read-only pass that *detects* a pattern in an existing document without
changing it (for example, recognising the AI markdown dialect: thematic breaks used as decoration,
emoji table cells used as status). Pure mdast traversal plus position arithmetic; no new node
types, no persistence, no migration. Contrast with a **writer**, which mutates bytes.

**resolver** — the function that takes a stored anchor and a new document and returns an index, or
`AMBIGUOUS`, or `LOST`. Its algorithm is the S1/S2/S3 ladder in `docs/engine/PLAN.md` §1.1a:
exact hash → context-scored disambiguation → shingle-based fuzzy match. Parameters: `K=3` (context
radius), `TAU=0.20` (Jaccard floor), `W=1.0` (context weight), `DELTA=0.05` (tie margin, below
which it refuses).

**sidecar** — data stored *outside* the `.md` file (comments, threads, history), keyed back to
the file. Decision D2: nothing about comments is ever written into the markdown, and removing the
sidecar must leave `git status` clean and every file byte-identical.

**softctx** — distance-weighted (`1/d`) agreement of the K neighbouring blocks on each side. Used
to *score* context, never to hash it. Rigid context fingerprints get **worse** as k grows
(90.65 → 88.68 → 87.22 for k=1/2/3) because a ±k window straddles a moved section's boundary.

**splice** — replace only the bytes of the region being edited, computed from `mdast`
`position.offset`; never regenerate the file from the AST. Decision D7, grounded in Foster et al.,
TOPLAS 2007, Lemma 3.9. Measured: **107,287 blocks spliced byte-identically across 1,080 files, 0
failures**, versus **0 of 120 files** surviving a stringify round trip.

**TextQuoteSelector** — a W3C Recommendation (February 2017) for anchoring an annotation to a text
range by `{exact, prefix, suffix}`. **Not an invention of this project**; it is what comments
should use.

**tier tags** — `[measured]` / `[primary]` / `[secondary]` / `[inference]` / `[SIMULATED]`. See the
head of this appendix.

**wikilink** — `[[Name]]`. Resolves at **27.65%** in this corpus, against **85.71%** for
`[text](path.md)`. **An unresolved wikilink is a legitimate authoring primitive; an unresolved
path link is a mistake.** Treating them identically is why naive link checking runs at 2–25%
precision and gets switched off.

#### The ten settled decisions, restated

These are fixed. If you want to reopen one, §10 of this plan is where the two currently under
review live (D3 and, indirectly, D4).

| id | decision |
|---|---|
| **D1** | frontmatter = Google Docs for markdown. |
| **D2** | Comments and history live **outside** the file. Export or copy yields clean markdown, latest content only. Nothing about comments is ever written into the `.md`. |
| **D3** | Reviewers must log in (Google or GitHub). Mechanism deferred. **UNDER REVIEW as a tier split** — anonymous read-and-comment on a share link, login required to resolve or edit. |
| **D4** | The durable artifact is plain markdown; if frontmatter dies we ship a full export and migration. Max tier gets offline access. **Not** "your git repo is the backend". |
| **D5** | AIOS is a separate track. |
| **D6** | The file stays ordinary `.md`. Degradation is the feature. No dialect needing its own parser. |
| **D7** | Splice-only writing. Never regenerate from the AST. |
| **D8** | Extensibility lives in the **value** of a field, never the **set** of node types. |
| **D9** | A document **names** a capability, never **carries** one. |
| **D10** | The name is MDMAX. |

---

### 13.8 Where everything lives

All paths relative to `/Users/sagnikmitra/Desktop/GitHub/frontmatter`. Sizes are bytes, measured
2026-08-01. Everything listed is tracked in git at commit `1bd4dad` unless marked.

#### The plans and the record

```
docs/mdmax/PLAN.md                        27,454   502 ln   THIS DOCUMENT (v2.0.0 → v2.1.0). The build plan.
docs/engine/PLAN.md                      106,298 1,748 ln   Technical design of record, v0.6.0. Every engine
                                                            measurement lives here. §1.1a = the anchor.
                                                            §4 = the confidence ladder. §5 = the container.
docs/engine/README.md                     46,837   789 ln   The master plan / front door, v1.0.0. Where it
                                                            differs from PLAN.md, PLAN.md governs.
docs/engine/dossier.html                 408,550             Web version of the research dossier.
docs/engine/sgnk-markdown-engine-dossier.pdf 449,691         12-page PDF version.
docs/engine/build/                                          Dossier build scripts. EXCLUDED FROM THE CORPUS
                                                            (policy excludes `build` at any depth).
```

#### The research artifacts

```
docs/engine/research/corpus-manifest.json                 198,580   THE PIN. §13.1.
docs/engine/research/wf-final-gate-2026-08-01.result.json 1,364,043 Run 3. 16 areas + kill audit + 4 lenses.
docs/engine/research/wf-final-gate-2026-08-01.raw.json    1,436,963 Run 3 envelope.
docs/engine/research/wf-final-gate-2026-08-01.journal.jsonl 1,333,281 Run 3, 80 records.
docs/engine/research/wf-mdmax-capability-*.result.json    1,420,260 Run 2. 18 areas + 3 lenses. No kill audit.
docs/engine/research/wf-mdmax-capability-*.raw.json       1,487,390 Run 2 envelope.
docs/engine/research/wf-mdmax-capability-*.journal.jsonl  1,382,194 Run 2, 78 records.
docs/engine/research/wf-findings-2026-08-01.md              128,449 Run 1. 6 areas, markdown, UNVERIFIED.
```

#### Demand research (predates the engine programme; 2026-07-12/13)

```
docs/FRONTMATTER-PRODUCT-PLAN.md              23,538   271 ln  92 pain points, 89 feature requests,
                                                               20-app matrix. Ranks the wedges A > C > B.
docs/research/frontmatter-pain-taxonomy.md    27,229   290 ln  T1..Tn severity taxonomy (KILLS ADOPTION >
                                                               CHURNS USERS > ANNOYS).
docs/research/frontmatter-pain-playbook.md    93,259   539 ln  6 evidence drills, verbatim quotes, effort
                                                               marks S/M/L, module keys.
docs/research/frontmatter-competitor-gapmap.md 14,339    77 ln  20-app competitor table with prices.
docs/research/frontmatter-segment-strategy.md  25,283   191 ln  8 segment studies + 2 market studies.
                                                               MARKET-SIZE ROW IS SELF-TAGGED UNVERIFIED
                                                               (10× divergence across four firms).
docs/research/frontmatter-raw-corpus.json     210,828           Round-1 scraped corpus. NOT under corpus_id.
docs/research/frontmatter-r2-raw-corpus.json  339,303           Round-2 scraped corpus. NOT under corpus_id.
                                                               F1 (169:95) is measured over these two.
docs/FEATURE-GAP-REPORT.md                      9,048   155 ln  Implementation status of the editor, 2026-06-03.
```

#### The earlier concept tree (`docs/mdmap/`, 21 files, generated 2026-07-29 at commit 8eb4de2)

```
docs/mdmap/MAP.md                       05-agent/MAP.md
docs/mdmap/01-thesis/{MAP,pitch,steelman,recursion,why-now,three-projections,
                     the-gap-is-the-product,not-a-graph-view}.md
docs/mdmap/02-evidence/{MAP,graphify-hairball}.md
docs/mdmap/03-spec/{MAP,format,gaps}.md
docs/mdmap/04-views/{MAP,rendering,semantic-zoom,doi-focus}.md
docs/mdmap/06-product/MAP.md            07-open/MAP.md
```

Historical. `01-thesis/not-a-graph-view.md` is the file that anticipated §3.2's conclusion.
Read it for provenance of the thinking, not for current decisions.

#### The three handoffs (all tracked, all cited by later documents — do not delete)

```
HANDOFF-mdmax-markdown-engine-2026-08-01.md   35,751  420 ln  Supersedes the other two. Written at HEAD
                                                              798ebbf. §6 = corrections, §11 = open decisions.
HANDOFF-mdz-markdown-format-2026-07-29.md     51,087  829 ln  The "next-generation markdown" research thread.
                                                              ~7.3M subagent tokens, 39 agents. Written at
                                                              8eb4de2 with nothing committed.
HANDOFF-graph-engineering-research-2026-07-30.md 47,094 675 ln The graph-engineering thread, reconciled
                                                              against docs/engine/PLAN.md v0.2.0.
```

#### The code

```
package.json          frontmatter 0.1.0 · 47 dependencies · 18 devDependencies
AGENTS.md             7,705 B, 181 ln — operational rules for any agent editing this repo.
                      NOTE: Claude Code reads CLAUDE.md, not AGENTS.md, and no CLAUDE.md exists
                      here — so this file has never been loaded by the agent it addresses.
src/app/              Next.js App Router: (auth)/login, (public)/[slug], (public)/p, (vault),
                      (workspace), api/{ai,auth,commit,export,share,vault}
src/modules/          ai · ai-tools · app-shell · auth · drafts · editor · export · graph ·
                      preview · repository · share · vault  (hexagonal: application / domain /
                      infrastructure / presentation per module — see docs/adr/0001)
src/container/        dependency-container.ts:42 — the hardcoded AUTHOR constant (§6)
src/shared/           application/ports, domain, infrastructure, presentation
test/                 ai · ai-tools · api · app-shell · auth · config · drafts · editor · export · …
docs/adr/0001-adopt-hexagonal-architecture.md   2,667 B — the only ADR.
docs/superpowers/     13 historical build plans + 1 spec from 2026-05-25 (the `sgnk-md` era).
```

#### The named files a reader will be sent to

| file:line | why it matters |
|---|---|
| `src/modules/share/infrastructure/share-writer.ts:26` | calls `matter.stringify` **while its own header says "splicing"** — silent data loss on every Publish |
| `src/modules/preview/presentation/frontmatter.ts:47` | calls `doc.toString()` — 170 of 907 frontmatter blocks throw |
| `src/modules/auth/domain/allowlist.ts:9` | the single-user allowlist |
| `src/container/dependency-container.ts:42` | the hardcoded `AUTHOR` constant, fed to four use-cases at lines 66, 70, 75, 80 |
| `firestore.rules` | declares vaults, memberUids, roles, shares, billing, usage — and contains `"comments"` zero times |
| `test/preview/html-policy-xss.test.ts` | the source of the unreproducible "55 payloads" figure (G9) |
| `docs/engine/PLAN.md:116` | the 99.627% row |
| `docs/engine/PLAN.md:80` | *"294 consecutive real revision pairs"* — the sentence with no script behind it |

#### Outside this repository

```
~/Desktop/GitHub/md          the primary vault. 756 corpus files, 21,068,853 B, 82.46% of the corpus.
~/Desktop/GitHub/knowledge   the L99 knowledge base. 272 corpus files, 3,570,923 B.
~/.claude/skills-src         474 *.md / 5,013,124 B — the W1 second corpus (path-list sha256
                             72b867b02163ece7346e50cbae5cc71a). Still same-operator.
~/.sgnk/{gates,traces,baselines,state}   AIOS runtime state. A SEPARATE TRACK (D5).
```

---

### 13.9 What this appendix does not cover, and how to falsify it

**It does not cover.**

- **The original researcher texts.** Only the post-verification results are on disk. If a
  verifier misquoted the claim it killed, nobody can detect it from these files. Kill-audit B
  named this *"THE ONE LIMITATION THAT MATTERS."*
- **Run 1's six areas.** They are inventoried but no number in §13.4 is drawn from them, because
  they have no adversarial pass.
- **The AIOS evidence base.** `~/.claude/CLAUDE.md`'s Learned Rules, the ~30 AIOS docs and the 119
  skill definitions inform *how* this programme was run — several of the failures catalogued here
  are instances of named Learned Rules (#60 an auditor inheriting its subject's blind spots, #62
  labelling replayed numbers SIMULATED, #63 equality-pinned assertions on stochastic quantities,
  #65 environment-dependent harness results). **They are not evidence for the product** and are
  deliberately out of scope here (D5).
- **Anything about the future.** Every effort estimate in the research corpus is an estimate.

**How to falsify this appendix.** Each of these is a concrete, cheap experiment. If any comes back
differently, this appendix is wrong and must be corrected in the same commit.

1. Run the script in §13.1.4. If it does not print
   `sha256:3a010b1649899795d79274fc528dbece97fdabf4ff0f81cc02ab619c048c51a4`, the recipe is wrong.
2. Run the script in §13.1.5. If `missing` or `mismatch` is non-zero, the corpus has drifted and
   **every corpus-tagged number in this plan is suspect until re-run**.
3. Re-parse `headline_verdicts` from run 3. If the counts are not `CONFIRMED 5 · OVERSTATED 10 ·
   REFUTED 1`, §13.2.3 is wrong.
4. Sum `sampled` and count `overturned` across `kill_audit`. If it is not 105 and 10, §13.3 is
   wrong.
5. Check `git branch -r --contains HEAD`. If it is empty, G8's correction is wrong and the
   pre-mortem's existential-risk finding is live again.
6. Grep the repository for a script that produces 99.627%. **If you find one, row A1's "reproduced:
   NO" is wrong and the number can be published.** Two independent searches came back empty; a
   third would be welcome.

**The one sentence to carry out of this appendix.** *Every number in this plan is either
reproducible from a file in this repository, or it is labelled as not reproducible — and the
labelling is the product of a four-layer chain (research → adversarial verification → kill audit →
this index) whose measured error rate is roughly 10% at each layer above the first, and 100% at
the first.* Read the labels.


---

---

### Links

**This section references:** [§1 Orientation](01-orientation.md) · [§2 Chronology](02-chronology.md) · [§3 Capabilities](03-capabilities.md) · [§4 Representation](04-representation.md) · [§5 Rendering](05-rendering.md) · [§6 Conventions](06-conventions.md) · [§7 Product](07-product.md) · [§9 AIOS](09-aios.md) · [§10 Engine spec](10-engine-spec.md) · [§11 Execution](11-execution.md)

**Referenced by:** [§2 Chronology](02-chronology.md) · [§14 Verification](14-verification.md)

[← Index](README.md)
