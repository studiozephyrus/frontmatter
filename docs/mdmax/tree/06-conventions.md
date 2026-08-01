---
mdmax: 1
section: 6
title: "Our own conventions: the library model, custom definitions, reference pointers, and whether any of it ships"
slug: 06-conventions
lines: 1117
words: 11325
forward_links: [3, 4, 5, 11]
backlinks: [2, 12, 13, 14]
prev: 05-rendering
next: 07-product
---

[← Index](README.md) · [← §5 Rendering](05-rendering.md) · [§7 Product →](07-product.md)

## 6. Our own conventions: the library model, custom definitions, reference pointers, and whether any of it ships

This section answers one founder question in full: *should MDMAX let a document declare its own
vocabulary and import a library of definitions, the way a Python file imports from PyPI?*

It is the only idea in this plan that has been raised repeatedly across four sessions and cut every
time. It deserves the evidence, not a one-line dismissal. What follows is the complete case — the
idea as stated, every precedent that exists, the reference design if we ever build it, the rule that
would govern it, the experiment results that constrain its shape, the single measurement that
decides it, the verdict, and the question that sits upstream of all of it and is still open.

**Read the verdict box first, then decide how much of the rest you need.**

---

### 6.0 The verdict box

| | |
|---|---|
| **DECIDED** | No declared-vocabulary feature, no vocabulary registry, no library-import syntax, and no new carrier ships in the first twelve months. Nothing in `.md` gains the ability to name or carry a definition. |
| **DECIDED** | We ship the inverse instead: **recognition** of the vocabulary a corpus already uses, plus drift detection over it. Zero new syntax, zero new bytes in any user file. Specified in §6.10. |
| **RECOMMENDED** | If a declaration is ever built, build the design in §6.3 and §6.6 exactly — per-project sidecar, `$schema` key reused not invented, denotations only, hard cap, filesystem-only resolution, warn-and-degrade on absence. |
| **RECOMMENDED** | Amend D9 from *"a document NAMES a capability, never CARRIES one"* to *"a document may CARRY a denotation; it must only ever NAME a procedure; and it may lower its own capability, never raise it."* The amendment is evidence-driven (§6.4) and changes nothing operationally this cycle, because nothing declares anything this cycle. |
| **OPEN** | Does MDMAX become a programming language, or admit it is a thin shell over one? This is upstream of every syntax question and it is **unanswered**. §6.9 lays out both branches. It does not need answering in the next twelve months — but it must be answered before anyone writes a line of import syntax. |
| **OPEN** | Four named observations would reverse the no-ship decision. They are listed as kill conditions in §6.8. One of them — a single real user asking, unprompted, to name their own construct — outweighs every corpus number in this section. |

**The one number that decides it:** the observed user-invention rate across 5,245 markdown files in
five corpora is **0.31%**, and **all of it is tutorial content teaching the feature**. §6.7 derives
that number, states what it does and does not prove, and lists the two pieces of evidence that cut
against it.

---

### 6.1 The idea, in the founder's words

Verbatim, from `HANDOFF-mdmax-markdown-engine-2026-08-01.md:95`:

> *"if it is a library importing things and people are not jargon at all they can use features that
> they want to... in Python there are thousand libraries people might use hundreds only."*

`[primary]` — read from the file, not paraphrased.

The instinct behind it is correct and worth stating plainly, because the rest of this section is
going to argue against shipping it and that argument is worthless if it strawmans the idea.

**What the founder is actually asking for.** Markdown has a small fixed vocabulary. Every attempt to
grow that vocabulary — callouts, admonitions, directives, wikilinks, diagrams — has meant a fork, a
plugin, or a dialect. The Python analogy proposes a way out that does not require anyone to agree on
a spec: let the *document* say which vocabulary it uses, let a *library* hold the definitions, and
let each author pull only the parts they want. Nobody has to learn 1,000 things. They learn the ten
they use. The format stays small; the capability grows outside it.

**Concretely, that decomposes into four separable mechanisms.** They are usually discussed as one
thing, and they have completely different costs. Keeping them apart is the single most useful move in
this whole analysis:

| # | mechanism | what it is | can it exist alone? |
|---|---|---|---|
| M1 | **Declaration syntax** | a line in the document that names a vocabulary — `$schema:`, `filters:`, `#lang`, `@context`, `import` | yes |
| M2 | **Resolution** | turning that name into a definition on disk or over the network | yes, given M1 |
| M3 | **Distribution** | a registry: a place to publish, version, and fetch vocabularies from | needs M1+M2 |
| M4 | **Absence semantics** | what happens when the named thing is missing, wrong-versioned, or corrupt | needs M1+M2 |

The founder's sentence names M3 (*"a library importing things"*) and M1 (*"features that they
want"*). The evidence below is that M3 has succeeded exactly twice in the history of document
formats, that M1 is where all the security failures live, and that M4 is where LaTeX's famous pain
comes from. **M2 is the only one of the four with a cheap, safe, well-understood answer** — and M2 is
what Section 3's resolver already gives us, without any of M1, M3, or M4.

**Why the analogy does not transfer, in one line, before the evidence:** PyPI distributes
*behaviour*. A markdown vocabulary registry would distribute *names*. Nobody downloads names.

---

### 6.2 The prior art, complete

This is the entire history. It is short.

#### 6.2.1 The two that succeeded

Only **two document formats have ever acquired a real package ecosystem** — meaning: the document
declares the dependency, and a registry resolves it.

| format | packages | age | governance | version resolution |
|---|---|---|---|---|
| **LaTeX / CTAN** | **7,021 packages across 610 topics** | ~35 years | **five named volunteers**, no automated review | **none** — date comparison only, and a mismatch is a *warning* |
| **Typst** | **1,481 distinct packages / 4,425 name:version rows** | ~3 years | one git repo + a GitHub Action + a CDN | mandatory full pinning, no solver, no lockfile |

`[primary]` CTAN counts fetched live 2026-07-31T22:45Z from `https://ctan.org/json/2.0/packages`
(7,021 entries) and `https://ctan.org/json/2.0/topics` (610), and re-fetched independently
2026-08-01 → still **7,021** (final-gate area `custom-pointers`, finding 12). TeX Live's package
database `mirror.ctan.org/systems/texlive/tlnet/tlpkg/texlive.tlpdb.xz` (20.4 MB decompressed) has
8,079 `name` entries, 7,064 of `category Package`, 5,139 excluding binary/doc/src variants.

`[primary]` CTAN's governance, verbatim from its own uploader addendum: *"the following persons (in
alphabetical order) take care of CTAN: Erik Braun (upload management and system administration),
Vincent Goulet (upload management), Manfred Lotz (upload management, programming, system
administration), Gerd Neugebauer (web developer), Petra Rübe-Pugliese (upload management). All these
people are acting as volunteers in their spare time".* Thirty-five years, seven thousand packages,
five people, no automated review, no version solver.

`[primary]` Typst counts fetched live 2026-08-01 from `https://packages.typst.org/preview/index.json`
(2,060,620 bytes, 4,425 rows, 1,481 distinct `name`, newest `updatedAt` 1785509080 =
2026-07-31T14:44:40Z — the index is live, not stale).

**Both are Turing-complete programming languages whose surface syntax happens to be documents.**
That is not a coincidence and it is the load-bearing fact of this entire section. A package
distributes *behaviour*: a LaTeX package redefines typesetting; a Typst package computes layout. If
the host format cannot execute anything, a package has nothing to carry.

#### 6.2.2 Everything markdown-adjacent, and what each one refused

| system | declaration | resolution | registry | privilege of the extension |
|---|---|---|---|---|
| **Quarto** | **yes, per-document** — `filters: [fancy-header]` in `.qmd` frontmatter | filesystem only, from `_extensions/` vendored into the repo | none of its own; 250 extensions listed on quarto-web | Lua run inside Pandoc, or an arbitrary executable |
| **Sphinx** | project only — `extensions = [...]` in `conf.py`, a Python file | Python import | **borrows PyPI** (`Framework :: Sphinx :: Extension`) | full host Python |
| **MkDocs** | project only — `plugins:` in `mkdocs.yml` | setuptools `entry_points` | **borrows PyPI** | full host Python |
| **Pandoc** | **refused in-document on purpose** — filters are command-line only | CLI argument | **none** | arbitrary executable; `--sandbox` explicitly does *not* cover filters |
| **R Markdown** | `library()` inside a knitr chunk | R's own loader | **borrows CRAN** | full host R at render time |
| **MDX** | **real ESM `import`/`export` inside markdown** | delegated to the JS bundler | **built none at all** | full host JavaScript |
| **Obsidian** | **the `.md` file can declare nothing** | app settings, a user action | own catalogue: **6,222 plugins** | full Electron privileges |

`[primary]` all rows from `docs/engine/research/wf-findings-2026-08-01.md`, AREA *"Document-format
package ecosystems"*, each with a source read in that run.

Three of these deserve their exact words.

**Pandoc — the maintainer refused document-carried configuration explicitly.** John MacFarlane, on
`jgm/pandoc#4627`, verbatim: *"The whole point of pandoc is that you can convert a single document to
different formats, in different ways -- so including instructions about this in the document itself
seems wrong."* And on a default configuration file: *"I'd worry about the security implications of a
default defaults file."* Pandoc's `MANUAL.txt` on `--sandbox`, verbatim: *"Note that this option does
not limit IO operations by filters or in the production of PDF documents... Anyone using pandoc on
untrusted user input should use this option."* `[primary]`

**Quarto — the reason for vendoring is reproducibility, stated by Quarto.** From
`quarto.org/docs/extensions/managing.html`, verbatim: *"If you are using version control you should
check the `_extensions` directory in to your repo along with your other code. Extensions used by a
document or project are treated as source code to ensure very long term reproducibility—your project
doesn't need to rely on the availability of an external package manager (or the maintenance of older
extension versions) to successfully render now and far into the future."* Same docs, a boxed warning
titled *Extension Trust*: *"Quarto extensions may execute code when documents are rendered.
Therefore, if you do not trust the author of an extension, we recommend that you do not install or
use the extension."* `[primary]`

**Obsidian — the largest markdown-adjacent plugin ecosystem, and the document declares nothing.**
6,222 plugins (live fetch of `obsidianmd/obsidian-releases/master/community-plugins.json`). Obsidian's
own security document, verbatim: *"By default, Obsidian runs in Restricted Mode to prevent
third-party code execution."* And: *"Due to technical limitations, Obsidian cannot reliably restrict
plugins to specific permissions or access levels. This means that plugins will inherit Obsidian's
access levels... Community plugins can access files on your computer. Community plugins can connect
to internet. Community plugins can install additional programs."* Enablement is a user action in app
settings — **never a document-level directive**. `[primary]`

#### 6.2.3 A contradiction between two of our own documents — named, and resolved

Two documents in this repository disagree about Quarto, and the disagreement matters because Quarto
is the closest analogue to what the founder is proposing.

- **`HANDOFF-mdmax-markdown-engine-2026-08-01.md:256`** states: *"Everything markdown-adjacent —
  Quarto, Sphinx, MkDocs, Pandoc, R Markdown — deliberately **refused** document-declared registry
  resolution."*
- **The final-gate verification of area `custom-pointers`** marks the broader form of that claim
  **REFUTED**, quoting `quarto-web/docs/extensions/filters.qmd` verbatim: *"If you've developed a
  filter and want to use it within a document you need to add it to the list of `filters` for the
  document"*, with a worked example placing `filters:` / `  - fancy-header` in a **single document's
  frontmatter**, resolved against `_extensions/fancy-header/_extension.yml`, which contributes
  `fancy-header.lua` — **a procedure executed on the Pandoc AST**.

**Which governs: the verification.** It quotes primary source, and the final gate's own kill audit
measured that source-quoting kills are **16 of 16 correct** while number-substituting kills run a 38%
defect rate (`kill_audit.note`, sampled 29, overall false-kill rate **5/29 = 17.24%**). A kill backed
by a verbatim quotation is the strongest class of evidence in this entire corpus.

**The corrected statement, which is the one to use everywhere from now on:**

> Per-document declaration exists in the wild. Quarto ships it. What no markdown-adjacent system
> ships is document-declared **registry** resolution — a name in the file that causes a **fetch**.
> Quarto resolves locally, from a directory the repo owner committed, with no network.

This is not a threat to the design in §6.3–§6.6. **It is prior-art support for it**, and it should be
cited that way: Quarto is a shipping, widely-used system that instantiates almost exactly the rule
this section recommends — name a procedure, resolve from the filesystem, never fetch. MDMAX choosing
*per-project* over *per-file* is a further restriction we impose, not evidence that per-file is
unprecedented.

#### 6.2.4 Three more data points that shape the answer

- **MDX is the closest syntactic precedent and it built no registry.** Real `import`/`export`
  statements inside markdown; resolution delegated entirely to the JS bundler and npm. `[primary]`
  Separately and independently disqualifying for us: **MDX cannot write the document back out** —
  arbitrary JavaScript expressions do not losslessly re-serialize to source, so there is no
  `format()` equivalent (`docs/engine/PLAN.md` §15.5). For a product that edits and saves, that is
  fatal regardless of market share.
- **The in-band pragma was tried in JavaScript and abandoned.** `tc39/proposal-modules-pragma` is
  **archived at Stage 1** — `api.github.com/repos/tc39/proposal-modules-pragma`: `archived=true`,
  81 stars, last push **2022-01-24T18:58:28Z**. JavaScript put the declaration in `package.json`
  instead. `[primary]` *Caveat: the "boilerplate tax" rationale previously attributed to TC39 is a
  paraphrase and is not in the primary source; the archival is fact, the stated reason is not.*
- **The registry operating burden is now enormous and it is getting worse.** GitHub Changelog
  2025-12-09, verbatim: *"We've permanently revoked all existing npm classic tokens. They can no
  longer authenticate, be recreated, or be recovered."* `npm login` now issues a two-hour session
  token. This was forced by the September 2025 Shai-Hulud self-replicating worm. `[primary]`
  Ecosystem malware volume — **>454,600 new malicious packages in 2025, >1.233 million cumulative
  (+75% year on year), 120,612 attacks blocked in Q4 2025 alone, ">99% of all open source malware now
  targets npm"** — is `[secondary]` (search-summary tier), from Sonatype's 2026 report that **nobody
  on this team has read**. Treat those four figures as unverified.

---

### 6.3 The Typst blueprint, in full

If a registry is ever built, this is the design. It is included in full because it is genuinely cheap
and because the founders should be able to cost the idea accurately rather than from intuition.

Typst's own vendor blog (typst.app/blog/2023/package-manager, 2023-06-30, Laurenz Mädje), verbatim:
*"we took a step back and sketched out a design for a minimum viable package manager that a single
person could build in a week."* `[primary]` There is **no registry service**. There is a git repo, a
GitHub Action, and a CDN: *"The package repository has a GitHub action that builds a tar.gz archive
for each package and an index.json ... then uploads the packages and index to
https://packages.typst.org/preview, which is served through a CDN"*, and *"Won't get much simpler
than serving a bunch of tar.gz files through a CDN"*.

#### The six properties to copy

**1. Namespacing, with a user-owned escape hatch that takes precedence over the cache.**
`typst/packages` README, verbatim: *"A package that is stored in `packages/preview/{name}/{version}`
... will become available in Typst as `#import "@preview/{name}:{version}"`."* And the escape hatch:
*"You can create an arbitrary `{namespace}` ... Store a package in
`{data-dir}/typst/packages/local/mypkg/1.0.0` ... Import from it with `#import "@local/mypkg:1.0.0":
*`. Packages in the data directory have precedence over ones in the cache directory."* `[primary]`

This one property is what makes air-gapped use, enterprise use, and pre-publication development
possible **without vendor sign-off**. Ship it on day one or never.

**2. Mandatory full version pinning. No ranges, no floating, no lockfile, no solver.**
*"You must always specify the full package version."* The manifest requires only `name`, `version`
(full major-minor-patch SemVer triple), and `entrypoint`; `compiler` names a minimum compiler
version. Typst is honest about the cost: *"While this is a bit inconvenient, it means that we don't
need a manifest or lock file for reproducibility."* `[primary]`

**3. Post-publish immutability, as stated policy.** `typst/packages` docs, §*Fixing or removing a
package*, verbatim: *"Once submitted, a package will not be changed or removed without good reason to
prevent breakage for downstream consumers. By submitting a package, you agree that it is here to
stay."* `[primary]`

Properties 2 and 3 together **structurally neutralise the worst npm attack class at zero engineering
cost** `[inference]`. With `@preview/name:0.1.0` pinned and versions immutable, a compromised
maintainer cannot alter any version an existing document already imports; they can only publish a new
version nothing references. Contrast npm, where `^1.2.3` means a poisoned publish reaches every
consumer on the next install — which is precisely what made Shai-Hulud self-replicating.

**4. On-demand download plus a permanent cache, so the vendor being down never breaks a build.**
Verbatim: *"Importing a cached package does not result in network access."* `[primary]`

**5. Submission is a pull request.** A git repo, a CI job, a CDN. No accounts, no publish tokens —
**and therefore no token-theft attack surface**, which is the exact thing that just cost npm its
entire credential model.

**6. The WASM plugin contract, if plugins ever exist: non-WASI, byte-buffers only, no ambient
authority, purity required.** From typst.app/docs/reference/foundations/plugin, verbatim: *"For
security reasons, plugins run in isolation from your system. This means that printing, reading files,
or similar things are not supported."* And on the ABI: *"Many compilers will use the WASI ABI by
default or as their only option (e.g. emscripten), which allows printing, reading files, etc. This
ABI will not directly work with Typst. You will either need to compile to a different target or stub
all functions."* The protocol is byte buffers: an exported function takes n 32-bit length arguments,
calls `wasm_minimal_protocol_write_args_to_buffer(buf.ptr)`, calls
`wasm_minimal_protocol_send_result_to_host`, returns 0 for success or 1 with a UTF-8 error message.
Purity is required by contract — and Typst's own docs are honest that it is **not enforced**: *"Typst
does not enforce plugin function purity (for efficiency reasons)."* Isolation is enforced; purity is
a promise. `[primary]`

#### The two things to fix rather than copy

**Fix 1 — Typst ships no integrity verification, and its own source says so.** From
`typst/typst`, `crates/typst-kit/src/packages.rs` (main, 18,229 bytes, lines ~268–272), verbatim
source comment: *"This means that we do not check the integrity of an existing moved package, just
like we don't check the integrity if the package directory already existed in the first place. If
situations with broken packages still occur even with the rename safeguard, we might consider more
complex solutions like file locking or checksums."* `[primary]`

Independently confirmed from the index side rather than the source side: the live `index.json` entry
keys are exactly `['authors','compiler','description','entrypoint','exclude','keywords','license','name','repository','updatedAt','version']`
— **no hash, digest, or sha field exists**
`[own-measurement, final-gate custom-pointers finding 12]`. CTAN's 7,021-package JSON carries
`key`/`name`/`caption` only. Trust in both systems is TLS-to-CDN plus policy.

The fix is `@vendor/name:1.0.0#sha256-…` with the digest recorded in the index. It is a few lines of
code, and it is what makes a third-party mirror **provably** equivalent to ours. This is a genuinely
unoccupied design slot — and it is worth nothing on its own, which is why it is a footnote and not a
product.

**Fix 2 — LaTeX's absence asymmetry is backwards, and the symmetric level is warn-and-degrade.**

| condition | LaTeX behaviour | evidence |
|---|---|---|
| **missing** package | **fatal** — interactive prompt; in batchmode the TeX run ends | `latex3/latex2e/base/ltfiles.dtx`: `\gdef\@missingfileerror#1#2{\typeout{^^J! LaTeX Error: File `#1.#2' not found....}}` `[primary]` |
| **wrong version** | **warning only** | `latex3/latex2e/base/ltclass.dtx` (develop, 154,501 bytes) line ~2475: `\@ifl@ter` date comparison then `\@latex@warning@no@line{You have requested,\on@line, version `#3'...}` — a warning macro, **not** `\@latex@error` `[primary]` |
| **bad rollback date** | **downgraded to a warning** | same file, line 3825: *"Make suspicious rollback a warning not error: github issue 43"* `[primary]` |

That asymmetry — missing is fatal, wrong is a shrug — is the precise mechanical root of LaTeX's
reproducibility reputation. **The fix is symmetry, and the symmetric level is warn-and-degrade, not
fatal**, because D6 says degradation is the feature. Missing vocabulary, wrong version, and digest
mismatch should all produce: the construct falls back to its base markdown form, the document still
renders, one diagnostic per distinct cause, and a non-zero exit code only under an explicit
`--fail-on` flag. A digest mismatch additionally refuses to use the cached copy.

#### What the blueprint costs, and why we still do not build it

One person, one week, for the registry itself `[primary, vendor's own claim]`. The compiler-side cost
of a single new construct is measured at **139 lines** (85 micromark syntax extension + 34 mdast
handlers + 20 unified/rehype glue, 13/13 round-trip cases stable) plus **14 lines** for
`@lezer/markdown` on the CodeMirror side = **153 lines total across both parsers**
(`docs/engine/PLAN.md` §15.3) `[measured]`.

So the objection is *not* cost. The objection is demand (§6.7), and the operating burden a registry
acquires the moment anyone attacks it (§6.2.4).

---

### 6.4 The rule that governs any declaration — and the correction the evidence forces

#### D9 as it stands

> **D9. A document NAMES a capability, never CARRIES one.**

Every self-declaring mechanism that survived contact with the real world fits the *name* half:

| mechanism | what the document contains | why it is safe |
|---|---|---|
| **JSON-LD `@context`** | an IRI, or a term→IRI map | the vocabulary is defined elsewhere |
| **shebang `#!`** | an absolute path to an interpreter | the path must already exist on the machine |
| **Racket `#lang`** | a collection name under a deliberately crippled grammar | the language must already be installed |

Racket is the best-designed of the three and its grammar restriction is the transferable lesson.
Racket Guide §17.3.1, verbatim: *"the syntax of language is far more restricted than a module path,
because only a-z, A-Z, 0-9, / (not at the start or end), _, -, and + are allowed in a language name.
These restrictions keep the syntax of #lang as simple as possible. Keeping the syntax of #lang simple,
in turn, is important because the syntax is inherently inflexible and non-extensible."* `[primary]`
**That grammar cannot express a URL.** Resolution: *"the language must be installed in a collection"*
— no auto-fetch, ever.

And every failure fits the *carry* half:

| failure | what the document carried | outcome |
|---|---|---|
| **XML internal DTD subset** | an entity definition that can dereference (`SYSTEM "file:///…"`) and recurse | **XXE** and the billion-laughs class |
| **vim modelines** | settable options, historically including expressions (`modelineexpr`) | a repeated hardening programme, most recently **2026-05-18** |
| **Emacs file-local variables** | variables evaluated on open | a permanent prompt-the-user mitigation |
| **Hugo inline shortcodes** | a template — i.e. a procedure | **ships disabled**, under SECURITY (§6.5) |

*Unverified, and flagged as such:* the frequently-repeated figure that vim modelines produced **five
CVEs across 24 years, the most recent four months ago** is **inherited from an earlier brief and has
not been checked against the National Vulnerability Database (NVD) by anyone on this team** — the
research sandbox could not reach NVD. Do not publish it. What *was* verified is stronger and
independent: see below.

#### Correction 1 — the real axis is denotation vs procedure, not name vs carry

D9 as written forbids something the standard it cites explicitly permits.

W3C JSON-LD 1.1 syntax spec, read in full during the research session
(`raw.githubusercontent.com/w3c/json-ld-syntax/main/index.html`, 578,006 bytes, fetched 2026-08-01),
verbatim: *"The value of @context MUST be null, an IRI reference, a context definition, or an array
composed of any of these."* And: *"Contexts can either be directly embedded into the document (an
embedded context) or be referenced using a URL."* `[primary]`

**An embedded `@context` is a carried definition, and it is the first form the spec teaches.**

That lines up exactly with the experimental result in `docs/engine/PLAN.md` §15.2: redefining a
**denotation** holds (**140/140** on generation, 120/120 on parsing, with a negative control catching
10/10 injected faults, so the harness demonstrably works), while redefining a **procedure** collapses
(GPT-4 two-digit addition **98.2% in base 10 → 38.6% in base 9**, with the base stated in the prompt
and the comprehension check still passing — Wu et al., *Reasoning or Reciting?*). `[measured]` /
`[secondary]`

> **The corrected rule, RECOMMENDED as an amendment to D9:**
> A document (or project) MAY carry a **denotation**. It MUST only ever **name** a **procedure**.

Every entry in both tables above fits this rule, and D9 as written does not.

#### Correction 2 — the correction's own safety argument is wrong, and this one matters

The research claimed an embedded JSON-LD context is safe because it is *"a closed term→IRI map — no
execution, no dereference, no recursion."* **The verifier refuted this from the same document.**
JSON-LD 1.1 defines `@import`: *"A context definition MUST be a map whose keys MUST be either terms,
compact IRIs, IRIs, or one of the keywords @base, @direction, @import, ..."*, and *"By using the
@import keyword in a context, another remote context, referred to as an imported context, can be
loaded and modified prior to processing"*, and *"If the context definition contains the @import
keyword, its value MUST be an IRI reference."* `[primary]`

**So an embedded context can dereference a remote IRI at processing time.** "Closed" is false. "No
dereference" is false. Recursion is bounded only by an explicit rule (an imported context may not
itself contain `@import`) — bounded at depth 1, not structurally absent.

**What this changes:** do not cite JSON-LD as evidence that embedded denotations are safe. They are
safe *in our design* because of a rule **we** impose — **no URL is ever fetched at parse time** —
not because the JSON-LD precedent supplies that guarantee. It does not.

#### Correction 3 — the asymmetry, from vim, verified four months ago

The most transplantable rule in the entire corpus is not "name, never carry". It is an asymmetry, and
vim converged on it in production this year.

`raw.githubusercontent.com/vim/vim/master/runtime/doc/options.txt`, verbatim `[primary]`:

- `'modelinestrict' 'mlst' boolean (default: on)` — *"When on, only a safe subset of options can be
  set from a |modeline|"*, followed by an allowlist, then *"Any other option set from a modeline will
  be silently ignored. This option cannot be set from a |modeline| or in the |sandbox|, for security
  reasons."*
- The asymmetry itself: *"As an exception, `set nomodeline` is honored from within a modeline even
  when 'modelinestrict' is on. Other forms (`set modeline=0`, `set modeline!`, `set invmodeline`) are
  still silently ignored. **This lets a file disable further modeline processing for itself.**"*
- And the threat model in vim's own words: *"No other commands than \"set\" are supported, for
  security reasons (somebody might create a Trojan horse text file with modelines)"*, plus *"disable
  modelines before editing untrusted text"*.

Recency, verified through `api.github.com/search/commits?q=repo:vim/vim+modelinestrict`: commit
`4c2879471`, **2026-04-14**, *"patch 9.2.0350: Enabling modelines poses a risk"*; commit
`439722711`, **2026-05-18**, *"patch 9.2.0499: modeline: allow to disable modelines with
modelinestrict"*. SHAs, dates and subjects all confirmed exactly by an independent verifier.

> **The rule: a file-embedded directive may LOWER its own capability and may never RAISE it.**
> Everything outside a small inert allowlist is **silently ignored** — not an error, ignored.

**Two corrections to how this has been reported internally, both from the verifier and both
accepted:**

1. **The allowlist is 21 options, not 24.** It was stated as 24 twice. The verifier extracted and
   enumerated all of them: `autoindent, cindent, commentstring, expandtab, filetype, foldcolumn,
   foldenable, foldmarker, foldmethod, modifiable, readonly, rightleft, shiftwidth, smartindent,
   softtabstop, spell, spelllang, tabstop, textwidth, varsofttabstop, vartabstop`. **Use 21.**
2. **They are not "all presentation-only".** `filetype` fires FileType autocommands, which load
   ftplugins; `modifiable` and `readonly` are buffer state. The allowlist is *inert with respect to
   arbitrary execution*, which is the property that matters — but the looser claim is false.

*Confidence note on those two corrections:* the first substitutes a number, which is the class the
kill audit measured at a 38% defect rate — however, the verifier enumerated the list item by item, so
it is checkable in ten seconds against the primary source and should be re-checked by whoever next
touches this. The second quotes semantics and is safe.

---

### 6.5 The decisive precedent: Hugo built exactly this idea and ships it disabled

This is the single most direct precedent that exists, because Hugo implemented the *inline definition*
form of the founder's idea — a document that carries its own construct definition — and then turned it
off.

From `raw.githubusercontent.com/gohugoio/hugo/master/docs/content/en/content-management/shortcodes.md`,
verbatim `[primary]`:

> *"Hugo's security model is based on the premise that **template and configuration authors are
> trusted, but content authors are not**. This model enables generation of HTML output safe against
> code injection. To conform with this security model, creating _shortcode_ templates within content
> is **disabled by default**."*

And from `raw.githubusercontent.com/gohugoio/hugo/master/docs/content/en/configuration/security.md`,
where the setting lives **on the security configuration page**, listed alongside `exec.allow` and
`allowContent`:

> *"`enableInlineShortcodes` (`bool`) Whether to enable [inline shortcodes]. Default is `false`."*

**Why this transfers to frontmatter with no adjustment.** In frontmatter, the content author is
untrusted *by construction*. A reviewer with a login (D3) is a content author. A shared document is
authored by whoever you shared it with. A `.md` file is routinely a drive-by pull request to a docs
repo, a CMS field, a paste, or model output — whereas a `package.json` is written by the repo owner.
That is the decisive difference from npm's threat model, and it runs in the wrong direction for us
`[inference]`.

Every serious system in this space drew the same line: Pandoc (filters are CLI-only), Quarto
(extensions must be vendored by someone with commit access), Racket (the language must be installed
in a collection), Obsidian (Restricted Mode by default), Hugo (inline shortcodes off by default).
**Typst is the only system that permits document-declared auto-fetch, and it can only do so because
the fetched artifact cannot reach the filesystem, the network, or the shell.**

---

### 6.6 If a declaration is ever built: the rules from experiment

These are not opinions. Each has a measurement behind it. They are recorded here so that a future
version of this team does not re-derive them, and so that if the kill conditions in §6.8 fire, the
design is already written.

#### Rule 1 — declare by EXAMPLE, not by rule

Aycock et al. (arXiv 2409.19151) ablated MTOB — the benchmark where a model learns a language from a
grammar book in context — and found, verbatim: *"almost all improvements stem from the book's
parallel examples rather than its grammatical explanations"*, and flatly: *"we find no evidence that
long-context LLMs can make effective use of grammatical explanations."* Replicated across Kalamang,
Nepali and Guarani. `[secondary]` — *inherited from `docs/engine/PLAN.md` §15.8; nobody on this team
has read the paper directly.*

**Design consequence:** a vocabulary entry must carry **two or three annotated worked instances** of
each construct, never a sentence describing it. This is nearly free and it targets the exact
mechanism the whole design depends on.

#### Rule 2 — cap the vocabulary, and enforce the cap as an error

IFScale (arXiv 2507.11538, 20 models across seven providers), verbatim: *"even the best frontier
models only achieve 68% accuracy at the max density of 500 instructions."* Reasoning models hold near
perfect through ~100–150 then threshold-decay; mid-size models decay linearly; small models
exponentially. There is also **primacy bias** — early instructions are honoured more reliably than
late ones. `[secondary]` — *also inherited; not read directly.*

The geometry is unfavourable in exactly the way that matters: the declaration sits at the top of the
file where compliance is highest, and the constructs must fire in the fortieth note, where it is
lowest.

**But the cap number does not come from the paper.** It comes from measurement of what real teams
actually declare:

| corpus | declared vocabulary size |
|---|---|
| four real OKF bundles (`type` field) | **5 / 0 / 5 / 21** |
| Docusaurus admonition defaults | **9** |
| GitHub built-in alerts | **5** |
| MyST roles (vendor-supplied, not user-declared) | 46 |

The only bundle above 12 is **42.9% self-colliding** (§6.7). **Hard cap: 12 terms. Error, not
warning, at 13.** Twelve is where a vocabulary stops being a vocabulary and starts being drift.

*The one honest counter-example, recorded because the researcher recorded it against their own
interest:* MyST proves a **46-term** vocabulary is comfortably usable in practice — which contradicts
a naive reading of a single-digit cap. Every one of those 46 is **vendor-supplied**, not
user-declared. The cap constrains what a *user* may declare, not what a *vendor* may ship. *(Figures
do not reproduce precisely between researcher and verifier — 46 roles in 25.75% of 431 files versus
66 roles in 28.24% of 432 files — because the two used different role regexes and the branch drifted
same-day. The qualitative conclusion is identical in both.)*

#### Rule 3 — the renderer is already a parser; make it the write gate. Do NOT use constrained decoding

Grammar-constrained decoding fails exactly where a user-declared notation lives. Empirical coverage
on complex ("GitHub Hard") schemas: **Guidance 41%, llama.cpp 39%, XGrammar 28%, Outlines 3%**. And
Grammar-Aligned Decoding (NeurIPS 2024) shows naive masking *"distorts the output distribution"* —
you get strings that are grammatical and low-likelihood, i.e. valid and bad. `[secondary]`

Validate-and-repair gets the same guarantee at no distribution cost and is the cheapest applicable
verifier. Every AI write passes through the parser before touching disk; a parse failure or a
round-trip mismatch triggers repair, never a silent save.

**The failure mode this prevents, stated precisely.** JSON fails *loudly* — a parser throws, a retry
fires. A private prose notation fails *quietly*: the model writes `~ doing` instead of `~doing`, or
falls back to `**doing**` under load, the renderer does not match, and **the field silently
vanishes**. The document still looks like a document. Nothing throws. The next agent to read the file
sees a note with no status and treats the absence as information.

#### Rule 4 — where the declaration lives, and what key it uses

**Per-project, never per-file.** A sidecar at the repo or vault root — `.mdmax/vocab/<name>.yaml` —
checked into version control. The precedent chain is uniform: TC39 archived the in-band pragma and
JavaScript chose `package.json`; Docusaurus puts admonition keywords in a **build-config array**, and
its own source comment says why — `packages/docusaurus-mdx-loader/src/remark/admonitions/index.ts`,
verbatim: *"// By default it makes more sense to append keywords to the default ones / // Adding
custom keywords is more common than disabling existing ones"* — with **no per-document form anywhere
in the loader** `[primary]`; Quarto vendors `_extensions/`; every LLM convention (`llms.txt`,
`AGENTS.md`, `.cursor/rules`) is a glob-scoped sidecar.

**The one per-file form permitted is the vim asymmetry:** a file MAY carry `mdmax-vocab: none` to
switch the feature **off for itself**. A file MAY NOT carry anything that switches something **on** or
adds a term.

**Reuse `$schema`. Do not invent `fm-vocab`.** The key already ships in
`remark-lint-frontmatter-schema` at **36,745 downloads/week** (api.npmjs.org, window 2026-07-24 →
2026-07-30, verified twice), with the precedence question already decided. From its README, verbatim:
*"Schema association can be done directly **inside** the **frontmatter** of the **Markdown** file,
relative to project root, thanks to the `'$schema'` key"*, with the example `'$schema':
content/creative-work.schema.yaml`, and the rule: *"Locally defined `'$schema'` takes precedence over
global settings below."* `[primary]` Adopting it makes MDMAX a consumer of an existing convention
rather than the 47th dialect, and it parses correctly under gray-matter (verified in-session).

Value shape if we ever ship it: `'$schema': .mdmax/vocab/sgnk-v1.yaml@1.0.0#sha256-…` — a
project-relative path, a full version triple, and a digest.

#### Rule 5 — what it may name, and what it may never name

**MAY name — denotations only.** Each term is `{term, display-label, value-type, cardinality,
docs-url}`.

**MAY NEVER name:** an executable, filter, plugin, or WASM module; a URL fetched at parse time, ever;
a new **node type** (D8 holds — an unknown fence language round-trips byte-identically, an unknown
node type throws); a redefinition of an existing construct's meaning (*never redefine a symbol
CommonMark already defines*, `docs/engine/PLAN.md` §15.7).

#### Rule 6 — the carrier, ranked by measured round-trip × render × occupancy

This ranking is `[measured]` against the repository's own `node_modules`
(`mdast-util-from-markdown` + `mdast-util-to-markdown` + `mdast-util-gfm`, full GFM enabled).

| carrier | round-trip | visible? | occupancy (pinned / npm docs / Docusaurus) | verdict |
|---|---|---|---|---|
| **fence META string** — ` ```md fm:vocab=sgnk/v1 ` | **identical** | no (absent from `marked`'s HTML) | **0.00%** (0 of 7,714 fences) / 0.02% (1 of 5,007) / **48.01%** (6,201 of 12,916) | **best block-scoped carrier** — but namespace it, because `title="…"` already owns the channel in Docusaurus-shaped corpora |
| **link reference definition** — `[fm:vocab]: sgnk/v1@1.0.0` | **identical** | renders to nothing | **0.00%** (0 files, fence-aware) / **23.38%** (5,079 in 198 of 847) / — | acceptable **only** with an `fm:` prefix; a bogus definition becomes a live link target |
| **frontmatter** | required anyway | **visible in 23 of 24 renderers** | present in **84.73%** of the pinned corpus | acceptable for a single document-level scalar; **unacceptable for anything a human types freely** — the value slot is YAML and **18.91%** of the pinned corpus's own blocks already fail it (§6.7) |
| **`> [!TYPE]` callout** | **CORRUPTS** | native on GitHub | — | **DISQUALIFIED** |
| **`[//]: #` comment idiom** | **CORRUPTS** | invisible | — | **DISQUALIFIED** |

The two disqualifications, verbatim from the runs:

```
input   "> [!NOTE]\n> Useful information.\n"
output  "> \[!NOTE]\n> Useful information.\n"      ← a backslash inserted into the user's file
```

That is byte-for-byte the `DesktopCommanderMCP` #440 corruption class (`[x]` → `\[x]`) this program
already cites as its nightmare, and it happens to **GitHub's own alert syntax** through a writer at
**44,940,019 downloads/week** (`mdast-util-to-markdown`; `remark-stringify` is 33,387,232/wk;
`remark-parse`, the *parser*, is 45,820,243/wk — the "45.8M writer" phrasing used elsewhere attaches
the number to the wrong package, immaterial to the conclusion but worth fixing).

```
input   "[//]: # (fm:vocab sgnk/v1)"
output  "[//]: # \"fm:vocab sgnk/v1\""              ← parens become quotes
```

This one matters beyond carrier choice: `[//]: #` was previously reported as one of only two carriers
invisible in 24 of 24 renderers. **It does not survive a write.** The 24-renderer matrix measured
*visibility* and never measured *occupancy* at all — and occupancy varies by **~2,400×** across
corpora (fence-meta 48.008% Docusaurus vs 0.01997% npm docs = 2,404×; the verifier's independent
re-derivation gives 46.80%/0.02017% = 2,320×, same order). **No carrier decision should ever be made
on fewer than five corpora.**

*One caveat the verifier added and it is worth keeping:* `:::tip` round-trips identically because,
with no directive extension loaded, remark parses it as an **inert paragraph** — inertness is the
survival mechanism. The test does not show that a directive-aware pipeline preserves it. Note also
that `docs/engine/PLAN.md` §15.3 reports the `[` → `\[` corruption occurring *only* when an extension
is registered on parse but not on stringify; that finding concerns **remark-directive**, whereas the
result above concerns **GFM alerts with `mdast-util-gfm` registered on both halves**. Both are true.
They are different extensions. Do not merge them into one claim.

---

### 6.7 The measurement that decides it: 0.31%

Everything above is design. This is the decision.

> **The observed user-invention rate across five corpora totalling 5,245 markdown files is 0.31%,
> and every instance of it is tutorial content teaching the extension feature.**

#### Where the number comes from

**Corpus D — facebook/docusaurus**, fetched 2026-08-01 via
`codeload.github.com/facebook/docusaurus/tar.gz/refs/heads/main`, all `*.md`/`*.mdx` excluding
`node_modules` and `.git` = **1,617 files / 10,760,035 bytes**, `selection_sha256=259faf56855af151…`.
`:::`-directive occurrences = **4,538 in 980 files (60.61% of files)**, **12 distinct names**:

```
tip 1701 · warning 1151 · info 723 · note 660 · danger 257 · caution 22
important 8 · secondary 1 · success 1
my-custom-admonition 12 · unusedDirective 1 · NotAContainerDirective 1
```

The vendor's default keyword set, read from primary source
`packages/docusaurus-mdx-loader/src/remark/admonitions/index.ts` lines 15–19, verbatim:

```ts
export const DefaultAdmonitionOptions: AdmonitionOptions = {
  keywords: ['secondary','info','success','danger','note','tip','warning','important','caution'],
  extendDefaults: true,
};
```

**4,524 of 4,538 = 99.69%** are in that 9-keyword set. The remaining **14 = 0.31%** are three strings
— `my-custom-admonition`, `unusedDirective`, `NotAContainerDirective` — and `grep` confirms **all 14
sit in `markdown-features-admonitions.mdx` and its versioned copies**, i.e. the page that teaches
people how to extend the vocabulary. `[own-measurement]`

**Corpus B — 847 third-party npm documentation files** under this repository's `node_modules`,
**7,733,433 bytes**, `selection_sha256=21ace73c42f864df…`. GitHub-alert callouts outside fences: **74
occurrences in 18 files (2.13%)**, **5 distinct types**, exactly `[note 45, warning 11, important 10,
tip 4, caution 4]` — GitHub's complete built-in set, **zero inventions**. Same corpus: `:::`
directives = 1; Hugo shortcodes = 0; MyST ` ```{} ` = 0; `^block-id` = 0; `{#id}` = 6 occurrences in
1 file of 847. `[own-measurement]`

**The pinned corpus** — `corpus_id sha256:3a010b1649899795d79274fc528dbece97fdabf4ff0f81cc02ab619c048c51a4`,
1,084 files / 25,548,765 bytes, all re-read and re-hashed in-session (**1,084 present, 0 missing, 0
hash mismatches**), and independently re-verified by the verifier: **0 callouts, 0 `:::` directives, 0
Hugo shortcodes, 0 MyST directives, 0 `^block-id`, 0 `[//]: #`, 6 `{#id}` in 3 files.** This is a
power user's own vault. He invented nothing either. `[own-measurement]`

**Every figure in this subsection was independently reproduced by a second agent**, in most cases to
four significant figures and in several cases exactly — including the byte totals, the file counts,
the histogram item-for-item, and the location of all 14 exceptions.

#### The three corrections that must travel with the number

The measurements reproduced. Some of the *inferences* drawn from them did not.

1. **"~850 independent third-party authors invented exactly zero types" is wrong by roughly 47×.**
   Corpus B's 847 is a **file** count presented as an **author** count. Resolved to owning packages,
   the corpus spans **663 distinct packages**, and **only 18 of them used the syntax at all**. The
   inferential base is **18 authors / 74 uses**. Statistically: with n=74 uses the 95% upper bound on
   the invention rate is **3.97%** (which still clears the pre-registered ~5% falsifier, narrowly);
   with n=18 authors it is **15.33%**, and **P(0 inventions | 18 authors, true rate 5%) = 0.397** — a
   null result is unsurprising even if invention were common. **Correct statement:** *"Of 663
   packages, 18 used GitHub alert syntax at all; across their 74 uses, zero types outside GitHub's
   built-in 5 appeared; 95% upper bound on the invention rate is 3.97% per use."*
2. **A vendor's own monorepo cannot establish market demand.** Docusaurus's repository is
   structurally the least likely place on earth to find third-party vocabulary invention, since its
   own docs would naturally use its own defaults. **Correct statement:** *"In Docusaurus's own
   repository, 99.69% of directive uses are vendor keywords and every exception is the extension
   tutorial"* — a fact about the vendor's authoring practice. Third-party demand is **not measured by
   this corpus**. (It is separately measured by Corpus B, at 18 authors.)
3. **"Where a spec forced declaration, it produced drift" is a category slide.** The Open Knowledge
   Format (OKF) forces a per-document `type` **assignment**; it provides no vocabulary
   **declaration** mechanism at all and explicitly declines to police the field. So the measured
   drift is what you get in the **absence** of a declaration mechanism, which is equally consistent
   with *"declare a vocabulary to prevent drift"* as with *"detect drift after the fact"*. **The
   recommendation to ship detection first survives on cost grounds (~2 days, zero new bytes in user
   files), not on this evidence.** Say it that way.

#### What happened where a `type` field WAS required

Four real OKF bundles, fetched 2026-08-01 as `codeload` tarballs of `refs/heads/main` —
`OWOX/models` (186 md), `aws-samples/sample-okf-llm-wiki` (29),
`coleam00/cole-medin-knowledge-base` (902), `jkroepke/okf-crossplane-v2` (149) = **1,266 markdown
files**. `[own-measurement, independently reproduced exactly]`

| measurement | value |
|---|---|
| distinct `type` values per bundle | **5 / 0 / 5 / 21** |
| union across all four | **29 distinct values** in **four incompatible naming conventions** |
| self-collisions in the 21-value bundle | **9 of 21 = 42.9%** — `reference`/`Reference`; `function`/`Crossplane Function`/`functioninput`/`Crossplane Function Input`; `guide`/`developmentguide`/`Crossplane Development Guide` |
| frontmatter keys in one 149-file bundle | **58 distinct**, including leaked Claude-Code agent keys `systemPromptMode`, `inheritSkills`, `defaultContext`, `tools` |
| bundles declaring `okf_version: "0.2"` | **0 of 4** — absent in 2, `"0.1"` in 2 — one week after v0.2 shipped |

*Note the direction of the error:* the researcher reported "≥8 of 21" and "~38%"; the true figure is
**9 of 21 = 42.9%**. They **understated against their own interest**. That is a good sign about the
measurement, and it is the opposite of the failure mode that dominated the earlier 18-area run.

#### And our own corpus shows the same field breaking its own parser

`[own-measurement, corpus_id sha256:3a010b16…, reproduced exactly by the verifier on the first
attempt]`

```
1,084 files            → 23 reserved (index.md / log.md) → 1,061 non-reserved
899 of 1,061 (84.73%)  carry frontmatter delimiters
729 of 1,061 (68.71%)  parse to a YAML mapping under js-yaml
170 of 899  (18.91%)   THROW
```

The failing line, verbatim from `md/Research/Knowledge Base/AI/18 Claude Code Token Hacks in 18
Minutes.md`:

```yaml
entities: [[[Claude Code]], [[Anthropic]], [[Opus]], [[Sonnet]], [[Haiku]], [[Codex]], [[MCP]], [[Google Workspace CLI]]]
```

`gray-matter` (**7,492,225 downloads/week**) throws on it with the exact string *"YAMLException:
missed comma between flow collection entries at line 24, column 73"*.

**The quiet variant is worse than the loud one.** `entities: [[[A]], [[B]]]` **parses**, silently, to
`{"entities":[[["A"]],[["B"]]]}` — the wikilinks are destroyed into a nested array **with no error at
all**.

This is D8's own mechanism — extensibility living in the *value* of a field — failing in production,
at scale, today, because markdown's wikilink grammar sits inside YAML's flow-collection grammar. **A
declaration mechanism does not produce a vocabulary. It produces an unvalidated free-text field with
a grammar collision in it.**

Related, and it changes how any conformance number should be quoted: a regex census of the same
corpus (`^type:\s*\S`) reports **798 files = 75.21%**, while a true parse requiring OKF §11.1
(parseable YAML block) **and** §11.2 (non-empty string `type`) gives **628 = 59.19%**. The 16-point
gap is **exactly** the 170 throwing files (798 − 628 = 170). Both methods find **10** distinct `type`
values, not 12 — the regex distorts **counts** (`synthesis` 195 → 365), not the distinct-value count.
And OKF §11 defines conformance as a property of a **bundle** (*"A bundle is conformant with OKF v0.2
if: 1. EVERY non-reserved `.md` file..."*), so say **"59.19% of non-reserved files satisfy §11.1 +
§11.2"** — **not** "the corpus is 59.19% conformant". As a bundle it is 0% conformant.

#### The two pieces of evidence that cut the other way

A section that only argues its own case is marketing. Here is the counter-evidence, stated at full
strength.

**Counter-1 — the mechanism already ships, at 36,745 downloads/week.**
`remark-lint-frontmatter-schema` already offers document-declared `'$schema':` with the
local-overrides-global precedence rule decided. The researcher went looking for authored instances
across **3,197 files in three independent corpora** (pinned 1,084 + npm 847 + OKF 1,266) and found
**zero** `$schema`/`@`/`x-`/`fm`-prefixed frontmatter keys. `[own-measurement]`

**But the verifier weakened this null and it must be reported weakened:** of those 3,197 files only
**2,081 contain a frontmatter block at all**, and **Corpus B contributes just 3 frontmatter blocks
despite supplying 847 files to the total**. The npm third of that search was near-vacuous as evidence
about frontmatter keys. The null reproduces (0 hits), but it is a **search-limited null over corpora
we chose** — not proof of absence. The researcher named this as the weakest link in their own case
before anyone else did.

**Counter-2 — MyST demonstrates a 46-term vocabulary is usable.** `jupyter-book/mystmd`, 431 files,
`selection_sha256=9d9f8dbc…`: **46 distinct roles in 25.75% of files** (`ref` 622, `term` 41,
`numref`, `abbr`, `eq`, `kbd`). This contradicts a naive reading of the single-digit cap. Every one of
the 46 is Sphinx/MyST **built-in**. The demand curve it reveals is for a **large built-in vocabulary
that renders** — not for a mechanism to declare your own.

#### What 0.31% does NOT prove

Say this out loud, because it is the honest boundary of the whole argument:

**All of this evidence measures what people DID with the tools that already exist. None of it
measures what they WOULD do with a better one.** Every corpus here is a record of behaviour under
mechanisms that are awkward, undiscoverable, or vendor-locked. A person who never invented an
admonition type in Docusaurus may simply never have read the page that says you can.

That is precisely why kill condition **K-V3** in §6.8 is weighted above every number in this section.

---

### 6.8 The verdict, and the four things that would reverse it

> **DECIDED: ship no declared-vocabulary feature, no vocabulary registry, no library-import syntax,
> and no new carrier in the first twelve months.**

This is the settled answer, not a deferral. It was reached independently by five research areas
attacking from five directions and it is recorded in all four synthesis lenses of the final gate. The
verdict lens states it as an explicit never-build item:

> *"NEVER BUILD: new syntax, new carriers, a declaration mechanism, a vocabulary registry, a folder
> compiler's incremental engine, per-span confidence, or a competing provenance vocabulary."*

**Two independent grounds, either sufficient on its own:**

1. **Demand.** 0.31%, all tutorial. Nobody downloads names.
2. **Trust boundary.** In frontmatter the content author is untrusted by construction (D3 puts a
   logged-in reviewer inside the document). Hugo drew this exact line and disabled the feature.

**The four kill conditions.** Any one of these observed means the no-ship decision is wrong and this
section must be re-opened:

| id | observation that reverses the verdict |
|---|---|
| **K-V1** | A census over the **287 GitHub repositories** matching *"open knowledge format"* (counted via `api.github.com` search in-session) shows **median per-bundle `type` vocabulary above 12 terms with intra-bundle collision below 10%**. That would mean teams do build real vocabularies at scale and the n=4 sample was unrepresentative. |
| **K-V2** | The experiment in §6.9's measurement box returns **PRESERVE ≥ 95% at 12 terms on the cheapest model tier**. The cap is then not a real constraint and the feature costs far less than argued here. |
| **K-V3** | **One real user, in the first user conversation, asks unprompted to name their own construct.** Zero users have been interviewed across this entire program. A single genuine request outweighs every corpus number in this section, because all of that evidence measures behaviour under existing tools. **This is the highest-signal kill condition and it is also the cheapest to check.** |
| **K-V4** | `mdmax vocab` ships and real users dismiss its drift output as noise. That kills the replacement, at which point the honest position is that this whole area produces nothing and it should be **closed** rather than deferred. |

**And a fifth, which kills the design rather than the decision:** if fence-meta occupancy exceeds
~10% in a fifth and sixth corpus, the meta channel is not a carrier at all and only the frontmatter
scalar survives §6.6's ranking.

---

### 6.9 The open question, upstream of all syntax: language, or thin shell?

This is unresolved. It is listed as open decision #3 in
`HANDOFF-mdmax-markdown-engine-2026-08-01.md:369` and no one has ruled on it. **It does not need
answering in the next twelve months — the no-ship decision makes it moot for that period — but it
must be answered before anyone writes a single line of import syntax, because it determines the whole
design and cannot be retrofitted.**

The question exists because of the §6.2.1 fact: **no format that is not also a Turing-complete
programming language has ever acquired a package ecosystem in which the document declares the
dependency and a registry resolves it.** A package distributes behaviour. If the host cannot execute,
the package has nothing to carry.

#### Branch A — MDMAX becomes a programming language

**What it means:** MDMAX acquires an evaluator. Something a document names gets *executed* —
a filter, a macro, a layout function, a WASM module. This is the LaTeX and Typst path, and it is the
only path on which a package ecosystem has ever worked.

**What it commits us to, in full:**

- **A sandbox, permanently.** Typst's non-WASI, byte-buffers-only, no-ambient-authority contract is
  the minimum bar, and even Typst admits purity is a contract it does not enforce.
- **Obsidian's threat model**, which its own vendor describes as unsolvable: *"Obsidian cannot
  reliably restrict plugins to specific permissions or access levels."*
- **A threat model strictly worse than npm's**, because a `package.json` is written by the repo owner
  whereas a `.md` is routinely a drive-by pull request, a CMS field, a logged-in reviewer's paste
  (D3), or model output `[inference]`.
- **npm's operational burden**, on a two-person team: token revocation programmes, malware scanning,
  incident response. npm needed multiple quarters of security work under Microsoft's ownership.
- **Losing the compiler property.** MDMAX today is a total function from bytes to bytes with a proof
  obligation on the untouched region (D7, splice-only). An evaluator breaks that.
- **MDX's fate on write-back**: once a document contains expressions, it cannot be losslessly
  re-serialized, and a product that edits and saves cannot live with that.
- **It contradicts D6** (the file stays ordinary `.md`, degradation is the feature) and **D7**
  (splice-only). Branch A is not a feature addition. It is a different product.

**What it buys:** the only architecture on which the founder's Python analogy has ever actually
worked.

#### Branch B — MDMAX admits it is a thin shell over a language, and never evaluates

**What it means:** MDMAX stays a **compiler** in the strict sense — bytes to bytes, splice-only,
never evaluating anything a document names. Extension, if any, happens in the **host application**
(the editor, the CLI), configured by someone with commit access, exactly as Quarto, Sphinx, MkDocs,
Pandoc and Obsidian all do.

**What it commits us to:**

- **No package ecosystem, ever.** Accept it explicitly rather than deferring it.
- **A larger built-in vocabulary is the only growth path** — which is what the MyST datapoint says
  demand actually looks like (46 vendor-supplied roles, densely used).
- **Every capability that needs execution must be a host feature**, shipped by us, reviewed by us,
  versioned with the product.
- **D6, D7, D8 and D9 all hold unchanged.**

**What it buys:** the compiler property, the trust boundary, the degradation guarantee, a
two-person-sustainable operating burden, and a product that can be finished.

#### The third door, which is what the research actually recommends

The research's own position is that **the dichotomy is a trap that costs the product**: it is only
forced on someone who wants a package ecosystem, and the correct move is to **refuse the ecosystem
and therefore never face the choice**. That is Branch B with the deferral removed.

**Record it as a recommendation, not a decision**, because Branch A vs Branch B has real strategic
content — it is the difference between "a markdown editor with a strong engine" and "the LaTeX of the
2020s" — and that is a founders' call, not a researcher's.

#### The measurement that would settle the operating point

Every result quoted in §6.6 is frontier-class, five constructs, one task at a time, with the
declaration in immediate context. **The editor's inline-AI path will run the cheap model, and the
cheap model is the one that decides.** The experiment is fully specified so it can be run on demand:

```
ITEMS   real paragraphs from corpus_id sha256:3a010b16…, stratified by token count
        (short blocks are a known confound). Vocabulary terms drawn from real ones:
        the 29 OKF `type` values + the 10 valid-YAML `type` values in the pinned corpus.
        NO synthetic vocabulary — a synthetic one measures the experimenter.

FACTORS F1 model tier   ×4  frontier / mid / small hosted / ~1-3B local
        F2 vocab size   ×4  3, 6, 12, 24 terms   (12 = proposed cap, 24 = measured drift zone)
        F3 declaration  ×3  rule-only / example-only (3 worked examples) / rule+examples
        F4 distance     ×3  adjacent / document head ~8k tokens away / sidecar ~40k earlier
        F5 task         ×3  RECOGNISE / EMIT / PRESERVE

DESIGN  main sweep    4 tiers × 4 sizes × 3 tasks × n=40      = 1,920 calls
        ablation      F3 × F4 × F2∈{6,24} = 12 cells × n=40   =   480 calls
        TOTAL 2,400 calls ≈ 6.0M tokens — 76% of ONE of the two research
        workflows already run (7.86M). The measurement that decides this
        costs less than the research that failed to decide it.

VERIFY  deterministic, ZERO LLM judges.
        RECOGNISE = exact set match against a hand-built key
        EMIT      = parses to the declared shape AND round-trips byte-identically
        PRESERVE  = byte diff over the untouched region, computed by an INDEPENDENT
                    oracle sharing no code with the writer
```

Pre-registered predictions, to be published either way: **P1** PRESERVE degrades with tier faster
than RECOGNISE (smallest tier: PRESERVE <80% while RECOGNISE >95%). **P2** every tier ≥95% on
RECOGNISE at 3 and 6 terms; small tier below 90% at 12 and below 75% at 24. **P3** examples beat rules
at every tier and the gap widens as tier falls. **P4** distance costs less than size (<5pp for
adjacent→40k versus >15pp for 6→24 terms at the small tier). **P5** if the small tier is ≥95% on all
three tasks at 12 terms, the cap is wrong and the feature is materially cheaper than argued — this is
K-V2.

**Two cheaper measurements should run first. Both are zero model calls and about half a day each:**

- **M-A — vocabulary drift census at scale.** Run the `mdmax vocab` logic over the **287 GitHub
  repositories** matching *"open knowledge format"* and report the distribution of per-bundle `type`
  vocabulary size and intra-bundle collision rate. Our n=4 gives 5/0/5/21. If the true distribution is
  fat-tailed above 12, the cap is wrong **and drift detection is worth more, not less**. This single
  measurement can refute or confirm both of the section's negatives.
- **M-B — carrier occupancy across ≥8 corpora**, each with a stated selection hash. Fence-meta
  occupancy measured 0.00% / 0.02% / 48.01% on three corpora; link-refdef 0.00% / 23.38% on two. **No
  carrier decision should be made on fewer than five.**

---

### 6.10 What we ship instead — the inverse, and it gives the founder what he asked for

The founder's actual want is that *people use only the features they want* without learning a
vocabulary. **The inverse of a declaration mechanism delivers that with zero new syntax:** instead of
asking users to declare a vocabulary, *infer the one they are already using* and tell them where it
is breaking.

#### `mdmax vocab` — the recogniser (Section 4)

Read-only. Zero new bytes in any user file. Compatible with D2, D4, D6 and D7 **by construction**.

```
mdmax vocab <dir> [--field type,status,category] [--fail-on drift]
```

It emits the vocabulary a corpus is **already** using, plus three defect classes — each of which has a
live positive in the corpora measured above, so the tool cannot ship and find nothing:

| # | defect class | live positive found in this research |
|---|---|---|
| 1 | **case / morphology drift** | `reference` vs `Reference`; `guide` / `developmentguide` / `Crossplane Development Guide` — 9 of 21 values in one real bundle |
| 2 | **prose in an enum slot** | a `status` field whose value is a 130-character sentence |
| 3 | **unparseable value slot** | **170 of 899** pinned-corpus frontmatter blocks (18.91%) that js-yaml and gray-matter both reject — plus the silent variant where `[[[A]], [[B]]]` parses to a nested array and destroys the links with **no error** |

Output is a table of `(field, value, count, files, suspected-collision-with)`. **It cannot flatter
anybody** — the same property that selected `mdmax cert`. Effort: **~2 days**.

**Nothing like it exists.** Four npm registry searches (*markdown vocabulary*, *markdown schema
frontmatter*, *markdown directive*, *remark custom syntax*) return one relevant hit,
`remark-lint-frontmatter-schema`, which validates against a schema **you** write and is silent when
the schema is absent — and which **structurally cannot** report defect class 3, because the YAML must
parse before it can validate. A GitHub search for *"open knowledge format"* returns 287 repositories,
whose only conformance tool (`Sudhakaran88/okf-conformance`, 16 stars) checks structural conformance,
not value drift. **Nothing infers the vocabulary from the corpus.** `[own-measurement, search run
in-session]`

**And it is exactly the differentiated position against OKF.** OKF v0.2 creates the open `type` field
and *explicitly declines to police it* — §4.1, verbatim: *"Type values are **not** registered
centrally. Producers SHOULD pick values that are descriptive and self-explanatory; consumers MUST
tolerate unknown types gracefully."* That is the hole the drift detector fills, on a specification
Google is pushing and 287 repositories already use.

#### The two-tier link resolver (Section 3)

This is M2 from §6.1 — resolution — delivered without M1, M3 or M4. `[text](path.md)` resolves at
**85.71%**; `[[Name]]` resolves at **27.65%** — a 58-point gap on identical files, and no tool
implements the semantics that gap demands. A path link that does not resolve is a **mistake**; a
wikilink that does not resolve is a **legitimate authoring primitive**. Near-miss discrimination found
**95 real, hand-verified broken links** that naive checking would have buried.

#### `mdmax cert` — the conformance certificate

Per document, per target, per construct: **PASS · STRIP · CORRUPT**, with targets modelled as
`(product, surface)` pairs. This is what "will my file survive over there?" looks like as a product,
and it is the *only* capability in this program that survived adversarial search with **no incumbent
found**. Two days, hard capped, never the spearhead.

#### Why this is the honest answer to the founder's question

The Python analogy asks for **capability without vocabulary**. A declared vocabulary delivers the
opposite: it demands that every author, every reviewer, every downstream tool and every model learn a
set of terms that exists in one vault. The three tools above deliver capability with **no vocabulary
at all** — they read what is already there. And they ship in about a week, together, against a
declaration mechanism whose *cheapest honest measurement* costs 6.0 million tokens before the first
line of product code.

---

### 6.11 What this section does not cover, and what would falsify it

**Not covered here.** Comment and suggestion anchoring (Section 5). The container/`pack` question.
Provenance field semantics beyond the `type` field. Real-time collaboration. Anything about pricing or
tiers. This section is *only* about whether a document may declare or import a vocabulary.

**Unverified items carried into this section, each flagged in place above:**

1. **Zero live model calls were made in any research run.** Every claim about what a model does with a
   declared notation — the cap, the primacy geometry, the declare-by-example rule — is a **prediction**,
   not a result. `[SIMULATED / prediction]`
2. **IFScale (arXiv 2507.11538) and Aycock et al. (arXiv 2409.19151) were not read by anyone on this
   team.** They are inherited from `docs/engine/PLAN.md` §15.8. The cap and the by-example rule rest on
   **our own corpus measurements** (5/0/5/21, Docusaurus 9, GitHub 5); the papers are corroboration we
   have not personally verified.
3. **The vim modeline CVE count (five across 24 years) is inherited and unchecked.** Do not publish it.
   The `modelinestrict` hardening commits, the allowlist, and the "Trojan horse text file" language are
   all verified and are stronger evidence anyway.
4. **The Docusaurus directive census counts `:::`-prefixed lines by regex, not by parsing with
   remark-directive.** The 99.69%/0.31% split is robust (the numerator is a small integer set inspected
   by name) but the absolute 4,538 is a regex figure.
5. **The Docusaurus 9-keyword default set was read from `main` at fetch time.** If corpus files were
   authored against an older, smaller default set, the vendor-shipped share is if anything understated.
6. **Sonatype's malware figures are search-summary tier** and nobody read the report.
7. **`remark-directive`'s weekly downloads differ between two of our own measurements** — 3,176,157
   (`docs/engine/PLAN.md` §15.3, measured ~2026-07-30) and **3,153,286** (final gate, measured
   2026-08-01). Different weeks; **quote the later figure with its date**. Both are dwarfed by the
   authoring signal: `:::` occurs **0 times** in the pinned corpus and **1 time** in 847 npm docs. The
   mechanism is in three million installs and two documents. Download-weighted adoption and
   typed-into-a-file adoption disagree by orders of magnitude and **only the second one is real**.
8. **The pinned corpus's own `corpus_id` is not re-derivable from its manifest.** Thirty serializations
   of the documented recipe were attempted and none reproduces
   `sha256:3a010b1649899795d79274fc528dbece97fdabf4ff0f81cc02ab619c048c51a4`. The manifest **is** now
   tracked — committed in `1bd4dad` — but `git ls-files` shows **no derivation script anywhere in the
   repository** `[measured, this session]`. The **file list itself is sound**: all 1,084 files re-read
   and re-hashed, 0 missing, 0 mismatches. **Fix: commit the ~15-line derivation script and its
   captured output next to the manifest.** Until then, the corpus id is a label, not a checksum.
9. **The verification layer has a measured false-kill rate of 5/29 = 17.24%.** Its own audit found the
   pattern: kills that **quote a primary source** were **16 of 16 correct**; kills that **substitute a
   re-derived number** were wrong **5 of 13 (38%)**. Applied to this section: the Quarto refutation, the
   JSON-LD `@import` correction and the download-label correction all quote sources and should be
   **accepted**; the 21-vs-24 allowlist, the 663-packages/18-authors recalculation, the 10-vs-12
   distinct values and the 0.00%-vs-0.83% link-refdef occupancy all substitute numbers and should be
   **independently re-derived** by whoever next depends on them.

**What would falsify this section, restated as a checklist:**

- [ ] K-V1 — median per-bundle vocabulary > 12 terms with < 10% collision across 287 OKF repositories
- [ ] K-V2 — PRESERVE ≥ 95% at 12 terms on the cheapest model tier
- [ ] **K-V3 — one real user asks, unprompted, to name their own construct**
- [ ] K-V4 — `mdmax vocab` ships and its drift output is dismissed as noise
- [ ] design-only — fence-meta occupancy > ~10% in a fifth and sixth corpus

**One security observation from the research session, recorded because it bears directly on the trust
boundary and not because it is a finding.** While fetching the `openknowledge-sh/openknowledge` README
to locate the canonical OKF specification URL, the retrieved content contained
`curl -fsSL https://openknowledge.sh/install | bash` **together with an agent-directed prompt block
instructing an agent to install and run that script**. The researcher did not execute it and did not
act on it. It is flagged here because the OKF ecosystem's own onboarding path is *"paste this prompt
into your agent"* — which is exactly the untrusted-content-directs-an-agent shape this program has
already ruled against, and exactly the shape a document-declared import mechanism would make routine.

---

### 6.12 The one-paragraph version

The founder's library idea is structurally sound and has a named, cheap reference design (Typst: one
person, one week, a git repo plus a CDN, with checksums added and LaTeX's missing-versus-wrong-version
asymmetry fixed to symmetric warn-and-degrade). We are not building it, for two independent reasons
either of which would be sufficient. First, demand: across 5,245 markdown files in five corpora the
user-invention rate is **0.31%** and every instance is the tutorial page teaching the feature; where a
specification forced a declaration it produced **drift** (29 values, four naming conventions, 42.9%
self-collision in the largest bundle) rather than a vocabulary; and the mechanism already ships
elsewhere at 36,745 downloads a week with zero authored instances found in 3,197 files. Second, trust:
in frontmatter the content author is untrusted by construction, which is the exact line Hugo drew when
it built this feature and shipped it **disabled, under SECURITY**, with the sentence *"template and
configuration authors are trusted, but content authors are not."* We ship the inverse instead — a
recogniser that infers the vocabulary a corpus already uses and reports its drift, its prose-in-enum
slots, and the 18.91% of frontmatter blocks that no YAML parser can read — about two days of work,
zero new bytes in anyone's file, and no incumbent. The question that sits upstream of all of it, and
which remains open, is whether MDMAX ever becomes a programming language or admits it is a thin shell
over one; it does not need answering this year, but it must be answered before anyone writes a line of
import syntax. And the cheapest thing that could overturn everything above is one user asking,
unprompted, to name their own construct — because every number in this section measures what people
did with the tools that already exist, not what they would do with a better one.


---

---

### Links

**This section references:** [§3 Capabilities](03-capabilities.md) · [§4 Representation](04-representation.md) · [§5 Rendering](05-rendering.md) · [§11 Execution](11-execution.md)

**Referenced by:** [§2 Chronology](02-chronology.md) · [§12 Risks](12-risks.md) · [§13 Appendix](13-appendix.md) · [§14 Verification](14-verification.md)

[← Index](README.md)
