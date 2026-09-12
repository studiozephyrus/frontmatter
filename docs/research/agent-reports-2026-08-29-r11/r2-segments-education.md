### Evidence ledger — what was actually opened

| Source | Method | Read on |
|---|---|---|
| `api.github.com/repos/*` (13 repos) | curl, JSON | 2026-08-28/29 |
| `raw.githubusercontent.com/obsidianmd/obsidian-releases` — `community-plugins.json` (2,072,972 B), `community-plugin-stats.json` (2,096,248 B) | curl + python parse | 2026-08-29 |
| `overleaf.com/about`, `/for/universities`, `/user/subscription/plans` (India-geolocated) | curl, HTML | 2026-08-29 |
| `typst.app/pricing/` | curl, HTML | 2026-08-29 |
| `arxiv.org/stats/get_monthly_submissions` (422-row CSV) | curl + python | 2026-08-29 |
| `api.github.com/.../citation-style-language/styles/git/trees/master?recursive=1` | curl, `truncated:false` | 2026-08-29 |
| `api.npmjs.org/downloads/point/last-month/*` | curl | 2026-08-29 |
| `chromewebstore.google.com` — Zotero Connector, Mendeley Web Importer | curl | 2026-08-29 |
| PubMed E-utilities esearch/esummary/efetch (PMIDs 32395773, 41549369, +5) | curl | 2026-08-29 |
| `pib.gov.in` PRID=2282525 (AISHE 2022-23 & 2023-24 release), `aishe.gov.in` | curl | 2026-08-29 |
| **Not obtained** — dollar market-size for reference-management or academic-writing software | pypistats.org returned `429 RATE LIMIT EXCEEDED`; no analyst report opened | — |

### 1. Segment sizing

| Claim | Value | Tag | Confidence |
|---|---|---|---|
| Overleaf users (its own `/about`) | "over 20 million Overleafers"; "tens of millions" | [fetched] | High for the claim, unaudited as a number |
| Overleaf users (its own `/for/universities`) | "Over 25 million users" | [fetched] | **Source disagreement: same company, same day, 20M vs 25M. Not resolved.** |
| Zotero Connector, Chrome Web Store | 8,000,000 users | [fetched] | High — store-reported installs, not actives |
| Mendeley Web Importer, Chrome Web Store | 3,000,000 users | [fetched] | High, same caveat |
| arXiv submissions, 2025 | 284,486 | [measured] from arXiv CSV | High |
| arXiv submissions, 2026 Jan–Aug | 226,607 → 28,326/mo → 339,910 annualised (+19.5% vs 2025) | [derived] | Medium — 8-month run-rate extrapolation |
| arXiv CAGR 2019→2025 | (284,486/155,866)^(1/6) − 1 = **10.55%/yr** | [derived] | High |
| arXiv cumulative submissions, all time | 3,148,951 (sum of 422 monthly rows) | [measured] | High |
| CSL styles in the canonical repo | **10,860 `.csl` files** = 2,861 independent + 7,999 dependent | [measured], `truncated:false` | High |
| India higher-ed enrolment 2023-24 | **4.50 crore = 45,000,000**; GER 30.0; STEM 1.02 crore = 10,200,000; faculty 17.32 lakh = 1,732,000 | [fetched] PIB/AISHE | High — official statistic |

**GitHub star/activity snapshot** [fetched 2026-08-28/29]:

| Repo | Stars | Forks | Last push | Note |
|---|---|---|---|---|
| jgm/pandoc | 46,053 | 3,951 | 2026-08-28 | the actual substrate |
| typst/typst | 55,717 | 1,695 | 2026-08-28 | created 2019-09-24 |
| obsidianmd/obsidian-releases | 21,146 | — | 2026-08-28 | plugin registry |
| overleaf/overleaf | 18,078 | 2,049 | 2026-07-10 | |
| zotero/zotero | 15,094 | 1,095 | 2026-08-28 | |
| marp-team/marp | 12,420 | — | 2026-07-29 | |
| retorquere/zotero-better-bibtex | 7,066 | 388 | 2026-08-28 | the BibTeX bridge |
| quarto-dev/quarto-cli | 5,967 | 456 | 2026-08-28 | 1,888 open issues |
| JabRef/jabref | 4,657 | — | 2026-08-28 | |
| jupyter-book/jupyter-book | 4,273 | 730 | 2026-08-08 | |
| citation-style-language/styles | 3,885 | **4,142** | 2026-08-28 | forks > stars — a data repo |
| rstudio/rmarkdown | 3,054 | 991 | 2026-08-27 | |
| hans/obsidian-citation-plugin | 1,335 | 113 | **2024-06-13** | **stale 2+ yr** |
| typst/packages | 1,020 | — | 2026-08-28 | |
| executablebooks/MyST-Parser | 885 | — | 2026-08-24 | |
| plk/biblatex | 594 | — | 2026-08-17 | |
| **jupyter-book/mystmd** | **519** | 171 | 2026-08-27 | far smaller than its mindshare |
| jgm/citeproc | 182 | 22 | 2026-06-01 | the whole CSL engine, 182 stars |

**Distribution proxies** [fetched 2026-08-29]:

- Typst releases: 30 releases, **2,589,359 total GitHub asset downloads**; v0.15.1 (2026-07-17) 193,570; v0.14.2 (2025-12-12) 753,890. Excludes typst.app web, Homebrew, cargo, distro packages — so this is a floor, not a total.
- Quarto CLI: v1.10.18 (2026-07-24) **424,681** asset downloads; v1.11.1 (2026-07-28) 118,012. Typst's newest release is 0.46× Quarto's newest LTS-line release [derived] — but the release dates differ by 11 days, so this ratio is weak.
- npm last-month: `@citation-js/core` 332,261 · `rehype-citation` 169,854 · `citation-js` 33,685 · **`mystmd` 13,668** · `myst-cli` 3,029. For scale: `markdown-it` 119,163,973. MyST's npm pull is 0.41× citation-js [derived].

**Obsidian, the closest analogue to frontmatter's surface** [measured from the plugin stats file]:

- 7,061 plugins listed; 142,701,824 total cumulative downloads.
- Academic cluster cumulative downloads: Zotero/citation 1,041,113 · Pandoc/export 995,130 · LaTeX/math 1,014,880 → **3,051,123 = 2.138% of all plugin downloads** [derived].
- **Caveat that changes the reading:** the `downloads` field is cumulative across *every version*, so it rewards release cadence, not installs. Zotero Integration has 131 versions; Citations has 15. Using peak-single-version as an install proxy: Zotero Integration 3.2.1 = **277,090**; Citations 0.4.5 = **165,583**; Pandoc Plugin 0.4.1 = 493,054; vs Dataview 0.5.68 = 2,114,034. Citation tooling therefore reaches **7.8%–20.9%** of the most-installed plugin's base [derived].

**Honest sizing verdict:** the academic markdown segment is real, growing at ~10.5%/yr on the arXiv proxy, and roughly **one-tenth to one-fifth the size of the general note-taking market inside the same tool**. I have **no defensible dollar figure** — no analyst report was opened, and I will not invent one.

### 2. Jobs-to-be-done, with evidence

| JTBD | What it actually means | Evidence that it is the job |
|---|---|---|
| **Citation insert** | type `[@smith2020]`, get it right, never retype | Tunisia survey n=121: "inserting citations" is the most-wanted RMS feature at **66.9%** [fetched, PMID 32395773] |
| **Bibliography formatting to a journal's style** | 2,861 independent CSL styles exist because every journal differs | 10,860 CSL files [measured] |
| **Reference *correctness*** | new, LLM-driven: fabricated references reaching manuscripts | *J Educ Eval Health Prof* 2026;23:2 names "inability to verify reference authenticity" as the critical RMS limitation [fetched, PMID 41549369] |
| **Cross-references + figure/table numbering** | `@fig:setup` resolving to "Figure 3", stable under insertion | pandoc-crossref / `obsidian-pandoc-reference-list` (peak version 64,131) exist solely for this [measured] |
| **Equations** | `$…$` / `$$…$$` rendering, and surviving the trip to the publisher | Obsidian LaTeX/math cluster = 1,014,880 cumulative downloads; Latex Suite peak version 161,328 [measured] |
| **Supervisor collaboration** | track changes, margin comments, "accept/reject" — asynchronous, over months | Overleaf's own university pitch leads on collaboration; Manchester case study claims "310% jump in new projects" [fetched — vendor-reported, unaudited] |
| **Journal submission format** | not "a PDF" — *the publisher's `.cls`*, or a Word file with named styles | Overleaf's entire moat; 20–25M users [fetched] |
| **Reproducible computation** | executable cells → figures that regenerate | Quarto 5,967 ★ + Jupyter Book 4,273 ★ + rmarkdown 3,054 ★ [fetched] |

### 3. Architecture fit — what frontmatter can and structurally cannot serve

| JTBD | Fit | Why |
|---|---|---|
| Citekey autocomplete from a declared `bibliography:` | **CAN** | Read a local `.bib`/CSL-JSON, splice-insert `[@key]`. No format invention, no plugin, no code execution. |
| Rendered reference list | **CAN** | A reference list is a pure function of (file, `.bib`, `.csl`) → exactly the "deterministic reversible projection" contract. The view renders; the file keeps `[@key]`. |
| Figure/table/equation numbering + cross-refs | **CAN, best fit of all** | Labels live in the file; numbers live in the projection. Insert a figure, every number in the view moves, zero bytes rewritten. This is the strongest single argument frontmatter has in this segment. |
| Math rendering | **CAN** | KaTeX is a renderer, not user code. |
| **Degradation certificate for `$…$`, `[@key]`, `{#fig:x}` across GitHub / CommonMark / Pandoc / Obsidian / Quarto** | **CAN, and nobody else does** | These are precisely the constructs that silently die between engines. |
| Reference *acquisition* (browser capture, PDF library, dedup, metadata) | **SHOULD NOT** | Zotero Connector = 8,000,000 Chrome users, free [fetched]. |
| Track changes / suggestion mode / real-time co-editing | **STRUCTURALLY CANNOT** | Requires either a CRDT/OT layer (a second source of truth) or a comment sidecar (a tree-of-record by another name). Byte-preserving splice is compatible with git, not with multi-cursor. This is the segment's #1 job and the architecture's flat refusal. |
| Typesetting to a publisher's `.cls` / journal Word template | **STRUCTURALLY CANNOT own** | Unbounded compatibility surface; requires a TeX toolchain. Delegable to Pandoc/Quarto, never ownable. |
| Executable code cells | **STRUCTURALLY CANNOT** | "No arbitrary client-side code execution" is settled. Quarto and Jupyter Book own it at $0. |
| Shipping all 10,860 CSL styles | **CAN but SHOULD NOT** | Data, not code — allowed by the architecture, but it is a maintenance tail with no revenue attached. |

**The structural summary:** of the eight jobs, frontmatter can serve five *well* and refuses the three that decide the purchase (supervisor markup, journal format, reproducible cells).

### 4. Verdict — **SERVE INCIDENTALLY. Do not target.**

Grounds:

- **The buying trigger is owned by incumbents.** A thesis is bought by "my supervisor comments on it and the journal accepts it". Overleaf sells exactly that to 20–25M users [fetched]; frontmatter cannot build either half without breaking a settled decision.
- **Everything frontmatter *can* do here is already free.** Pandoc (46,053★), Zotero (15,094★ + 8M connector installs), citeproc (182★), Quarto, Typst — all $0. There is no unmet paid need in the citation/cross-ref/math layer.
- **The India-student angle is the weakest, not the strongest, monetisation surface.** Overleaf's own India-geolocated page prices **Student at ₹201.75/mo billed annually = ₹2,419/yr** (₹241 month-to-month); Standard ₹421.75/mo = ₹5,059/yr; Professional ₹880/mo = ₹10,559/yr [fetched 2026-08-29; ×12 arithmetic checks to within ₹2 rounding — [derived]]. That ₹2,419/yr is a *ceiling* set by a firm amortising over 20–25M global users. A solo founder cannot undercut it and survive. The Tunisia survey is the sharpest warning available: among 121 researchers and PhD students in a low-income country, **only 26.5% used any RMS at all, 81% preferred free/open-source, and 50.4% did not know Zotero was free** [fetched]. Low awareness plus a hard free-preference is the worst combination for paid conversion.
- **45,000,000 Indian enrolled students is a vanity denominator** [fetched AISHE 2023-24]. At an implausibly good 0.1% paid conversion that is 45,000 users [derived] — and nothing in the evidence supports 0.1%.
- **Incidental service is nearly free.** Five features (§5) serve the segment without one architectural concession, and every one of them is *also* useful to frontmatter's existing non-academic user.

### 4b. The strongest argument against my own verdict

**Academia is the only market on earth where "the file is the only source of truth" is a compliance requirement rather than a taste, and it is the only market where degradation certification has a named buyer.**

- Funder data-management plans, institutional-repository deposit, and long-horizon retention all make a plain, self-describing, engine-independent file a *mandate*. Every other segment treats that as ideology.
- Degradation certification — the genuinely differentiated thing in the engine — has no obvious commercial buyer in product, marketing, or engineering. It has an obvious one here: a university library or graduate school that must guarantee a deposited thesis still renders in fifteen years, and can point at a certificate saying which constructs survive which renderer. Certificates are *already a procurement line item* in academia; they are not one anywhere else.
- The CSL evidence supports this: 10,860 style files and a repo with **more forks than stars** is a field that has already accepted "declarative data, deterministic renderer" as its architecture. That is frontmatter's model, arrived at independently, by 2,861 journals.
- And the AI-fabricated-reference problem [fetched, 2026 review] is a *verification* problem — the exact shape of a certificate.

**Why I still hold the verdict:** the argument is right about the value and wrong about the go-to-market. Library and graduate-school procurement runs 9–18 months and gates on SSO, accessibility conformance, and security review — none of which a solo founder can service while also selling globally to individuals. The argument justifies **keeping the door open** (a certificate that already covers academic constructs), not **walking through it**.

### 5. Minimum feature set, if serving incidentally

Ordered by (value to academics) × (value to existing users) ÷ (architectural cost). All five are pure projections or splices.

1. **`bibliography:` / `csl:` / `title:` / `author:` frontmatter awareness.** A file authored in frontmatter is a valid Pandoc *and* Quarto input with zero edits. This is the whole export story: *hand it to pandoc*, never *we typeset*. Lowest cost, highest leverage.
2. **Citekey autocomplete from the declared `.bib` / CSL-JSON.** Read-only sidecar; splice-inserts `[@key]`. Serves the 66.9% most-wanted RMS feature [fetched] without becoming a reference manager.
3. **Cross-reference + numbering projection.** pandoc-crossref syntax (`{#fig:x}` / `@fig:x`); numbers computed in the view, never written to the file. This is the single feature where the projection architecture is *better* than the incumbents rather than merely adequate.
4. **KaTeX math rendering** for `$…$` and `$$…$$`.
5. **A degradation-certificate row set for academic constructs** — `$…$`, `$$…$$`, `[@key]`, `{#fig:x}`, `@fig:x`, footnotes, definition lists — certified across GitHub, CommonMark, Pandoc, Obsidian, Quarto. This is the only item on the list that no competitor ships, and the only one that survives the §4b argument if the verdict is ever revisited.

**Explicitly out of the minimum set:** bundled CSL styles beyond ~20 common ones (accept a user-supplied `csl:` path); PDF output; `.docx` output.

### 6. Anti-recommendations (each is a "do not", not a "deprioritise")

- **Do not build a reference manager.** 8,000,000 Zotero Connector installs and 3,000,000 Mendeley installs, both free [fetched]. Integrate by reading a `.bib`; never own the library.
- **Do not build track changes, suggestion mode, or real-time co-editing** to chase the supervisor relationship. It is the segment's most-demanded feature and the most direct contradiction of byte-preserving splice plus file-as-truth. Losing on this is correct.
- **Do not build LaTeX/PDF typesetting or journal `.cls` support.** Overleaf, Typst, Quarto and TeX Live cover it; publisher class files are an unbounded tail with the same shape as the 10,860-file CSL tail.
- **Do not support executable cells,** even "just for figures". Settled architecture, and Quarto + Jupyter Book own it at $0.
- **Do not chase Typst.** 55,717 stars is real, but Typst is *a new format* competing with LaTeX. "No new markdown format" is settled, so Typst is not a competitor, a partner, or a threat — it is orthogonal. Ignore it.
- **Do not bundle all 10,860 CSL styles.** Ship ~20; accept a path.
- **Do not price against India-student economics.** Overleaf's India student tier is ₹2,419/yr [fetched] and Zotero is free; the segment's revealed preference (81% prefer free/OSS, 50.4% unaware Zotero is free [fetched]) makes it a marketing-cost sink, not a market.
- **Do not market to universities or libraries as a solo founder,** despite §4b. Procurement cycles and conformance requirements exceed one person's capacity.
- **Do not use "45 million Indian students" in any deck.** It is a denominator with no evidenced conversion path attached.

### 7. Confidence and unresolved disagreements

| Item | Confidence | Reason |
|---|---|---|
| Segment exists and grows ~10.5%/yr | High | arXiv CSV, [measured] |
| Segment is ~8–21% the size of general note-taking in a comparable tool | Medium | Obsidian peak-version proxy; version cadence distorts it |
| Overleaf user count | **Low as a number** | Its own two pages say 20M and 25M on the same day [fetched] |
| Chrome Web Store user counts | Medium | Installs ≠ actives; store rounds to 1M |
| India student pricing ceiling | High | Overleaf's own India-geolocated page [fetched] |
| RMS adoption in low/middle-income settings | **Low generalisability** | Single survey, n=121, Tunisia, fieldwork 2016 [fetched] — I would not extend it to India without a second source |
| Dollar market size | **None** | No analyst source opened; pypistats rate-limited. Do not quote a figure |
| `obsidian-citation-plugin` last pushed 2024-06-13 while `obsidian-zotero-desktop-connector` pushed 2026-08 | [inference] | The Obsidian citation workflow has consolidated onto one plugin; a second entrant would be entering a settled niche |