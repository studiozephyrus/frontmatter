Reconcile clean, seventh check, unchanged — `~/.claude` HEAD `6e3908282f61b33734b6d4eba4e49149d6043d0f`, 18 pre-existing `skills-src`/`settings.json` entries, frontmatter HEAD `344597d8b1b70e9e8707bb9d07627eb8e40c7991` moved by another agent; this task issued only `Read`, `wc`, `git status`, `git rev-parse` and wrote nothing.

## 22. The academic and research segment

### 22.1 Sizing, with the confidence stated

| Measure | Value | Tag | Confidence |
|---|---|---|---|
| arXiv submissions, 2025 | 284,486 | [measured] from arXiv `get_monthly_submissions` CSV, 422 rows, read 2026-08-29 | High |
| arXiv CAGR 2019→2025 | (284,486 / 155,866)^(1/6) − 1 = **10.55%/yr** | [derived] | High |
| arXiv 2026 Jan–Aug | 226,607 → 28,326/mo → 339,910 annualised, +19.5% vs 2025 | [derived] | Medium — an 8-month run-rate extrapolation |
| arXiv cumulative, all time | 3,148,951 | [measured] | High |
| CSL styles in the canonical repo | **10,860 `.csl` files** = 2,861 independent + 7,999 dependent | [measured], API `truncated:false` | High |
| Zotero Connector, Chrome Web Store | 8,000,000 users | [fetched 2026-08-29] | Medium — store installs, rounded to 1M, not actives |
| Mendeley Web Importer, Chrome Web Store | 3,000,000 users | [fetched 2026-08-29] | Medium, same caveat |
| Overleaf users | "over 20 million" (`/about`) vs "Over 25 million" (`/for/universities`) | [fetched 2026-08-29] | **Low as a number. Same company, same day, two figures. Recorded, not resolved.** |
| India higher-ed enrolment 2023-24 | 4.50 crore = 45,000,000; GER 30.0; STEM 10,200,000; faculty 1,732,000 | [fetched] PIB PRID=2282525 / AISHE | High as a statistic, worthless as a denominator (§22.4) |
| Dollar market size for reference-management or academic-writing software | **None obtained** | [measured] — no analyst report opened; pypistats returned `429 RATE LIMIT EXCEEDED` | **Do not quote a figure. There is not one.** |

Relative size, using Obsidian as the closest analogue surface [measured from `community-plugin-stats.json`, 2,096,248 B, read 2026-08-29]: 7,061 plugins, 142,701,824 cumulative downloads; the academic cluster (Zotero/citation 1,041,113 + Pandoc/export 995,130 + LaTeX/math 1,014,880) = 3,051,123 = **2.138%** of all plugin downloads [derived]. That field is cumulative across every version, so it rewards release cadence, not installs. On a peak-single-version proxy against Dataview 0.5.68 = 2,114,034: Citations 0.4.5 = 165,583 → 7.8% [derived]; Zotero Integration 3.2.1 = 277,090 → 13.1% [derived]; Pandoc Plugin 0.4.1 = 493,054 → 23.3% [derived]. The source report states this bracket as 7.8%–20.9%; the 20.9% upper bound is not reproducible from its own three published peaks, so treat the honest range as **7.8%–23.3%** and see §55.

### 22.2 Jobs to be done

| JTBD | What it actually means | Evidence it is the job |
|---|---|---|
| Citation insert | Type `[@smith2020]`, get it right, never retype | Most-wanted RMS feature at **66.9%**, n=121 [fetched, PMID 32395773] |
| Bibliography to a journal's style | 2,861 independent styles exist because every journal differs | 10,860 CSL files [measured] |
| Reference *correctness* | Fabricated references reaching manuscripts | *J Educ Eval Health Prof* 2026;23:2 names "inability to verify reference authenticity" as the critical RMS limitation [fetched, PMID 41549369] |
| Cross-references and numbering | `@fig:setup` → "Figure 3", stable under insertion | `obsidian-pandoc-reference-list` peak version 64,131 [measured] |
| Equations | `$…$` / `$$…$$` rendering that survives the trip to the publisher | LaTeX/math cluster 1,014,880 cumulative; Latex Suite peak version 161,328 [measured] |
| Supervisor collaboration | Track changes, margin comments, accept/reject, asynchronous over months | Overleaf's university pitch leads on it; Manchester case study claims "310% jump in new projects" [fetched — vendor-reported, unaudited] |
| Journal submission format | Not "a PDF" — the publisher's `.cls`, or Word with named styles | Overleaf's moat; 20–25M users [fetched] |
| Reproducible computation | Executable cells → figures that regenerate | Quarto 5,967★ + Jupyter Book 4,273★ + rmarkdown 3,054★ [fetched 2026-08-28/29] |

### 22.3 Architecture fit

| JTBD | Fit | Why |
|---|---|---|
| Citekey autocomplete from a declared `bibliography:` | **CAN** | Read a local `.bib`/CSL-JSON, splice-insert `[@key]`. No format invention, no plugin, no code execution |
| Rendered reference list | **CAN** | A pure function of (file, `.bib`, `.csl`) → the projection contract exactly. The view renders; the file keeps `[@key]` |
| Figure/table/equation numbering and cross-refs | **CAN — best fit in the segment** | Labels live in the file, numbers live in the projection. Insert a figure, every number in the view moves, zero bytes rewritten |
| KaTeX math rendering | **CAN** | A renderer, not user code |
| Degradation certificate for `$…$`, `[@key]`, `{#fig:x}` across 7 engines | **CAN, and no competitor ships it** | These are precisely the constructs that die silently between engines |
| Reference acquisition (browser capture, PDF library, dedup) | **SHOULD NOT** | Zotero Connector = 8,000,000 installs, free [fetched] |
| Track changes / suggestion mode / real-time co-editing | **STRUCTURALLY CANNOT** | Needs a CRDT/OT layer (a second source of truth) or a comment sidecar (a tree-of-record renamed). Both are settled against |
| Publisher `.cls` / journal Word template | **CANNOT OWN** | Unbounded compatibility surface plus a TeX toolchain. Delegable to Pandoc, never ownable |
| Executable code cells | **STRUCTURALLY CANNOT** | The eval lane is settled closed; Quarto and Jupyter Book own it at $0 |
| Shipping all 10,860 CSL styles | **CAN but SHOULD NOT** | Data, not code — architecturally legal, a maintenance tail with no revenue attached |

**Of the eight jobs, frontmatter can serve five well and refuses the three that decide the purchase: supervisor markup, journal format, and reproducible cells.**

### 22.4 Verdict — serve incidentally, do not target

| Ground | Evidence |
|---|---|
| The buying trigger is owned. A thesis is bought by "my supervisor comments and the journal accepts". Overleaf sells exactly that half | [fetched] 20–25M users |
| Everything we *can* do here is already free | Pandoc 46,053★, Zotero 15,094★, `jgm/citeproc` 182★, Quarto, Typst — all $0 [fetched] |
| The India-student angle is the weakest monetisation surface on the board, not the strongest | Overleaf India-geolocated: Student ₹201.75/mo billed annually = **₹2,419/yr** (₹241 month-to-month); Standard ₹421.75/mo = ₹5,059/yr; Professional ₹880/mo = ₹10,559/yr [fetched 2026-08-29; ×12 checks to within ₹2 rounding, [derived]]. That ceiling is set by a firm amortising over 20–25M users |
| Revealed preference is hostile to paid conversion | n=121 Tunisia: only **26.5%** used any RMS, **81%** preferred free/OSS, **50.4%** did not know Zotero was free [fetched, PMID 32395773]. Fieldwork 2016 — **low generalisability to India; do not extend without a second source** |
| 45,000,000 enrolled students is a vanity denominator | At an implausibly good 0.1% paid conversion = 45,000 users [derived], and nothing in the evidence supports 0.1% |

**The strongest argument against this verdict.** Academia is the only market where "the file is the only source of truth" is a compliance requirement rather than a taste, and the only one where degradation certification has a named buyer: a university library or graduate school that must guarantee a deposited thesis still renders in fifteen years. The CSL repo having **more forks (4,142) than stars (3,885)** [fetched] is a field that already accepted "declarative data, deterministic renderer" as its architecture, and the AI-fabricated-reference problem is a *verification* problem — the exact shape of a certificate. It is answered on go-to-market, not on value: library and graduate-school procurement runs 9–18 months and gates on SSO, accessibility conformance, and security review, none of which a solo founder can service while also selling globally to individuals — so it justifies **keeping the door open**, not walking through it.

**Falsifier.** If one paying institutional customer names cross-engine degradation certification as a procurement line item without us marketing to universities, re-open this verdict in full.

### 22.5 The incidental feature set — build these five, in this order

1. **`bibliography:` / `csl:` / `title:` / `author:` frontmatter awareness.** A file authored in frontmatter becomes valid Pandoc *and* Quarto input with zero edits. The export story is *hand it to pandoc*, never *we typeset*.
2. **Citekey autocomplete from the declared `.bib`/CSL-JSON.** Read-only sidecar, splice-inserts `[@key]`. Serves the 66.9% job without becoming a reference manager.
3. **Cross-reference and numbering projection** (pandoc-crossref syntax `{#fig:x}` / `@fig:x`), numbers computed in the view, never written to the file.
4. **KaTeX rendering** for `$…$` and `$$…$$`.
5. **A degradation-certificate row set for academic constructs** — `$…$`, `$$…$$`, `[@key]`, `{#fig:x}`, `@fig:x`, footnotes, definition lists — across GitHub, CommonMark, Pandoc, Obsidian, Quarto.

### 22.6 Anti-recommendations

- **Do not build a reference manager.** Read a `.bib`; never own the library.
- **Do not build track changes or co-editing** to chase the supervisor relationship. It is the segment's most-demanded feature and the most direct contradiction of byte-preserving splice. Losing it is correct.
- **Do not build LaTeX/PDF typesetting or `.cls` support.** Publisher class files are an unbounded tail with the same shape as the 10,860-file CSL tail.
- **Do not bundle more than ~20 CSL styles.** Accept a user-supplied `csl:` path.
- **Do not chase Typst** (55,717★). It is a new *format* competing with LaTeX; "no new markdown format" is settled, so Typst is orthogonal — not a competitor, partner, or threat.
- **Do not price against India-student economics**, and **do not put "45 million Indian students" in any deck.**

---

## 42. AI disclosure and content provenance obligations

### 42.1 LAW — binding, dated, with the sanction

| Instrument | Status | Text in scope? | Dates | Sanction |
|---|---|---|---|---|
| **Reg. (EU) 2024/1689 (AI Act) Art. 50** | Directly applicable regulation | **Yes, explicitly** | Signed Brussels 13 Jun 2024; Art. 113 → applies **2 Aug 2026** | Art. 99(4)(g): ≤ **EUR 15,000,000 or 3%** worldwide annual turnover, whichever higher; Art. 99(6) gives SMEs/start-ups the **lower** of the two |
| **PRC《人工智能生成合成内容标识办法》** (CAC/MIIT/MPS/NRTA) | Binding departmental rules | **Yes** — Art. 3 lists 文本 first | Signed 7 Mar 2025, published 14 Mar 2025, **in force 1 Sep 2025** (Art. 14) | Art. 13, by reference to the Cybersecurity Law |
| **California SB-942 (Ch. 291, 2024)** | Enacted statute | **No — text excluded** from every operative duty (§22757.2(a)(1), §22757.3(a), §22757.3(b) all read "image, video, or audio"), although §22757.1(c) defines a GenAI system to include text | Approved 19 Sep 2024; **operative 1 Jan 2026** (§22757.6) | §22757.4: **$5,000 per violation**, each day discrete |

All three rows [fetched] — EUR-Lex CELEX 32024R1689 (1,263,937 bytes), CAC 国信办通字〔2025〕2号, SB-942 chaptered text, opened 2026-08-29.

Operative detail that changes the build [fetched]:

- **Art. 50(2)** binds *providers* of systems generating synthetic "audio, image, video **or text**" to mark output machine-readably, qualified by "as far as this is technically feasible", with a carve-out for systems performing "an assistive function for standard editing" or not substantially altering the input "**or the semantics thereof**".
- **Art. 50(4) ¶2** binds *deployers* publishing AI text "informing the public on matters of public interest" to disclose — **unless** the content "has undergone a process of human review or editorial control and where a natural or legal person holds editorial responsibility".
- **Art. 50(5)**: disclosure "clear and distinguishable … at the latest at the time of the first interaction or exposure", meeting accessibility requirements. **Art. 50(7)**: technical detail deferred to codes of practice and possible implementing acts — it is not settled. **Recital 133** lists permitted techniques: watermarks, metadata identifications, cryptographic provenance methods, logging methods, fingerprints.
- **PRC Art. 4 final ¶**: where download, copy, or **export** is offered, the *file itself* must carry a conforming explicit label — a statutory export-time attestation. **Art. 5**: the implicit label goes in file **header** metadata; watermarking is 鼓励 (encouraged), not mandated. **Art. 9**: a user may request unlabelled output after the duty is contractually shifted, logs retained ≥ **6 months**. **Art. 10**: nobody may maliciously delete, alter, forge, or conceal a label, **nor provide tools or services for others to do so**. **Art. 11** incorporates a 强制性国家标准 by reference — **not opened, see §55**.

**Source disagreement, recorded not resolved:** Art. 113(c) gives high-risk Art. 6(1) obligations **2 August 2027** [fetched, EUR-Lex]; the Commission's own regulatory-framework page says **2 December 2027** [fetched]. The August-2026 transparency date is doubly sourced; the 2027 date is not, and the Digital Omnibus page returned a 404.

### 42.2 POLICY — private, enforced by exclusion

| Body | Rule | Date/tag |
|---|---|---|
| Springer Nature / Nature Portfolio | Risk-tiered. **Green** (language polish, structure, translation, data cleaning) permitted, disclosure "enhances trust". **Amber** (drafting summaries, extensive copy-editing, suggesting analyses) permitted with oversight + disclosure. **Red** (undisclosed core reasoning, conclusions presented as human-derived, delegated peer review, fabricated citations) not permitted. "Human accountability is non-transferable" | [fetched 2026-08-29] |
| ICMJE | Disclose **at submission**, in **both** the cover letter and the work; writing assistance → Acknowledgments; data/analysis/figure generation → Methods; chatbots cannot be authors | [fetched 2026-08-29] |
| Elsevier | Fixed sentence: *"During the preparation of this work, the author(s) used [NAME OF TOOL / SERVICE] in order to [REASON]. After using this tool/service, the author(s) reviewed and edited the content as needed and take(s) full responsibility for the content of the published article."* AI figures only for explanatory diagrams | [fetched 2026-08-29] |
| ACM | Reported to require acknowledgement-section disclosure and bar AI authorship — **page returned HTTP 403, not opened** | [SS] — do not cite as verified |

### 42.3 NORM — standards and empirical limits, not obligations

| Item | Content | Date/tag |
|---|---|---|
| Convergent demand shape across the three opened policies | A **free-text natural-language declaration naming tool + purpose + human-responsibility affirmation, in a named document section**. Not a score, not a percentage, not a detector result | [derived], 3 of 3 fetched texts |
| **C2PA 2.3 §5.3.1 / Appendix A.8** | Manifests in *unstructured* text via `C2PATextManifestWrapper`, magic `0x4332504154585400` ("C2PATXT\0"), JUMBF store encoded as Unicode variation selectors (U+FE00–FE0F, U+E0100–U+E01EF), U+FEFF-prefixed | December 2025 [fetched] |
| **C2PA 2.4 §5.3.1 / Appendix A.9** | "Embedding Manifests into Structured Text" — explicitly names **Markdown**, AsciiDoc, LaTeX, YAML, TOML, INI. Plus the `c2pa.ai-disclosure` assertion: `ai-model-disclosure-map` with mandatory `modelType`, optional `modelName`, `modelIdentifier`, `scientificDomain` (arXiv taxonomy, e.g. `cs.AI`), and `contentProfile.humanOversightLevel` ∈ `fully_autonomous \| prompt_guided \| human_validated` | April 2026 [fetched] |
| SynthID-Text | Nature, **2024-10-23**, DOI `s41586-024-08025-4`; production sampling-level watermark, live over "nearly **20 million** Gemini responses" | [fetched] |
| "Watermarks in the Sand" | arXiv **2311.04378**, 2023-11-07; strong watermarking provably impossible under stated natural assumptions, including private-key, with only a quality oracle and a perturbation oracle | [fetched, abstract] |
| Weber-Wulff et al. | arXiv **2306.15666**, 2023-06-21; 12 public tools + Turnitin + PlagiarismCheck — "neither accurate nor reliable", biased toward classifying output as human-written | [fetched, abstract] |
| Liang et al. | arXiv **2304.02819**, 2023-04-06; detectors "consistently misclassify non-native English writing samples as AI-generated" | [fetched, abstract] |

**Platform norms (YouTube, Meta, TikTok, LinkedIn), Spain's draft labelling penalties, the Utah AI Policy Act, the Colorado AI Act, and Korea's AI Framework Act were not researched at all** [measured]. Report them as absent, never as zero.

A.9 is line-for-line a byte-splice contract [fetched]: fixed delimiters `-----BEGIN C2PA MANIFEST-----` / `-----END C2PA MANIFEST-----` modelled on RFC 4880 §6.2; a Markdown single-line HTML-comment form and a **front-matter form** where the block sits inside the `---` fences and the fences are *not* part of the exclusion range; `c2pa.hash.data` carrying **a single exclusion range** with start and length in **bytes**; "Files shall be read in **binary mode** to preserve the exact byte representation of line terminators"; "A claim generator shall **not** alter the line ending convention of the file content outside the manifest block"; **bare CR (0x0D) unsupported**, such files "shall be converted"; at most one block per file; named failure codes `manifest.structuredText.multipleReferences`, `…noManifest`, `…emptyReference`.

### 42.4 Where byte-anchored provenance maps, and where it does not

| Obligation | Maps? | Mechanism or reason |
|---|---|---|
| AI Act **50(2)** machine-readable marking | **No, and cannot** | Binds the *provider* of the generating system. We are not one, and we sit inside the "assistive function for standard editing" carve-out [fetched + inference] |
| AI Act **50(4)¶2** deployer disclosure | **No — the user is the deployer** | But we can *emit* the disclosure the deployer owes |
| AI Act **50(4)¶2 exemption** (human review / editorial control / named responsibility) | **Yes — this is the fit** | A byte-anchored ledger of which ranges were human-authored, which machine-inserted, when, by whom, is the evidence the exemption is phrased around [inference] |
| AI Act **50(5)** clear, distinguishable, accessible, at first exposure | **Partially** | A front-matter key is machine-readable but not *exposed*; the published-site projection must surface it — cheap under the projection law |
| PRC **Art. 4 final ¶** export carries the label | **Yes, mechanically** | Export-time splice of a visible line plus an A.9 block with a byte exclusion range |
| PRC **Art. 5** implicit label in header metadata | **Yes** | YAML front matter *is* the header; A.9's front-matter form lands there by spec |
| PRC **Art. 10** no concealment tooling | **Risk, not fit** | See anti-recommendations |
| CA SB-942 | **N/A** | Text excluded from all operative duties [fetched] |
| Nature / ICMJE / Elsevier | **Yes — the near-term surface** | All three want a named-section prose declaration; Elsevier's exact sentence is a deterministic template fill |

Two hard incompatibilities [fetched + inference]: **A.8 is hostile to the thesis** — it injects invisible variation selectors and hashes after NFC normalization and UTF-8 re-encoding, so two byte-different files hash identically and the act of crediting a file mutates it. And **A.9's bare-CR refusal collides with a real corpus** the engine already has queued as work; A.9 says convert, we have committed not to silently mutate bytes, so the honest behaviour is refuse and cite the reason.

### 42.5 Features: honest vs pseudo-precision

**Build (honest).**

1. **Disclosure block** — a reserved front-matter key holding tool identifier, purpose, `humanOversightLevel` (reuse the C2PA enum verbatim; do not invent one), timestamp, responsible person. One record, four deterministic projections: Elsevier's verbatim sentence, an ICMJE Acknowledgments/Methods paragraph, a PRC Art. 4(1) 文字提示 line, a `c2pa.ai-disclosure` assertion.
2. **Export-time attestation** — splice one A.9 manifest block (front-matter form) referencing an external `.c2pa` store; compute `c2pa.hash.data` with the byte exclusion range, binary mode. Removing the block returns the original bytes exactly.
3. **Provenance degradation certificate** — extend cross-engine certification to answer whether a target renderer, CMS, or round-trip preserves the manifest block, the front-matter key, and the line endings. Report PRESERVED / STRIPPED / MANGLED per target.
4. **Refusal surface** — bare-CR files, multiple blocks, non-`text/*` inputs: refuse citing the specific C2PA failure code.
5. **Editorial-responsibility record** — who reviewed which byte ranges, when. Sized to 50(4)¶2 and independently useful to journals.

**Do not build (pseudo-precision).**

- **A "percentage AI" report.** Unsound at four independent levels: no ground truth exists for the denominator; inferential detectors are "neither accurate nor reliable" and biased against non-native writers [fetched ×2]; a keystroke-derived percentage measures *bytes* while every regime above regulates *intellectual contribution*, so a human retyping a model's dictation scores 100% human and is lying; a paste of unknown origin is unattributable. If a number is demanded, ship a three-bucket ledger with an explicit `unattributed` bucket **that is never redistributed** — never a scalar.
- **A confidence score on a disclosure.** The event was recorded or it was not.
- **A "verified human-written" badge.** A.9's hard binding proves *bytes unchanged since signing*, never *bytes typed by a person*.

### 42.6 Anti-recommendations

- **Never claim AI Act Art. 50 compliance.** Say exactly: *"produces evidence for the Art. 50(4) editorial-control exemption; does not discharge Art. 50(2)."* The customer carries the EUR 15,000,000 / 3% exposure, not us.
- **Never ship a "strip invisible / zero-width characters" cleanup.** Under 2.3 A.8 those characters *are* the credential, and PRC Art. 10 forbids providing tools for 隐匿. If ever added: opt-in, per-invocation, with an explicit destroys-a-Content-Credential warning.
- **Never NFC-normalize on save or export.** It is the single line that would silently falsify byte-preservation.
- **Never build, bundle, or surface an AI-text detector.** Selling globally from India to non-native-English writers while importing a documented demographic bias is reputational risk exceeding any revenue [fetched: 2304.02819].
- **Never present a watermark as tamper-evident protection** [fetched: 2311.04378].
- **Implement A.9 only. Do not implement A.8. Do not pursue C2PA membership or conformance** until a paying customer names it — the spec is public and implementable without either.
- **Do not build a compliance-advice surface.** Emit records and citations; let the customer's counsel do the mapping.
- **Do not let the disclosure block become a second source of truth.** The moment it lives in a sidecar database, the central claim is broken.
- **Do not treat the SB-942 text exclusion as stable.** Parameterise the export path by jurisdiction; do not shape it around California.

---

## 52. The name

### 52.1 The incumbent, measured

| Fact | Value | Tag |
|---|---|---|
| Front Matter CMS, VS Code installs | **80,605** (read 2026-08-29) | [fetched] marketplace extensionquery API |
| Prior round's figure / delta | 80,527 / **+78** | [derived] |
| Marketplace `updateCount` / `downloadCount` / rating | 280,650 / 2,661 / 5.0 avg over 20 ratings, weighted 4.817 | [fetched] — `install` and `downloadCount` do not reconcile and Microsoft's field definitions were not opened |
| `estruyf/vscode-front-matter` | **2,539 stars**, 106 forks, MIT, last push 2026-08-21 | [fetched] |
| GitHub org `frontmatter` | **Taken** — "Front Matter CMS", created 2021-09-21, 7 public repos; most-starred org repo is `web-documentation-nextjs` at 29 stars | [measured] |
| npm `frontmatter` | **200, but a corpse** — 4 versions, latest `0.0.3`, last published **2022-06-18**, description "Parsing YAML frontmatter from a string", 11,212 dl/mo of transitive-dependency noise. **Not Front Matter CMS** | [measured] |

The registry collision and the market collision are two different problems and were previously counted as one.

### 52.2 Shortlist with availability evidence

Probed by `curl` from this machine, **2026-08-29 00:09 UTC**. npm 404 = free, GitHub `api.github.com/users/NAME` 404 = free; discriminator validated against three nonsense handles that all returned 404 [measured]. **Domains: UNCHECKED on every row — no registrar or RDAP host is reachable through this sandbox's allowlist.**

| Rank | Name | npm | GitHub | Repos named | Product collision | For | Against |
|---|---|---|---|---|---|---|---|
| **1** | **stetfile** | FREE (404) | FREE (404) | **0** | None found | *Stet* = "let it stand", the one English word meaning preserve the original exactly — the engine's contract as a name | Two morphemes; "file" is dull; less punchy than bare `stet` |
| 2 | **mdmax** | FREE (404) | TAKEN — "Maksim Golitsinskiy", 2 repos, joined 2012-11-28 | 18, none a product | None found | Already validated, zero adjacent-market collision | `md` reads as *Doctor of Medicine* to non-devs; "max" is a spec-bump word; reads as a library, not a product you charge for |
| 3 | **grainfile** | FREE (404) | FREE (404) | **0** | None found | "With the grain" is the most accurate available metaphor for reversible projections over the author's own file | Needs one sentence of explanation; nobody guesses it cold |
| 4 | **bytewright** | FREE (404) | TAKEN — "Bytewright", 28 repos, joined 2015-01-28 | 25 | None found | `-wright` (shipwright, playwright) = made by hand, precisely | Active squatter on the handle; `-wright/-write/-right` is a live spelling hazard for a name said aloud in support |
| 5 | **truefile** | FREE (404) | TAKEN — "Vyacheslav", **1 repo**, joined 2020-09-01 | 17 | None found | Literally the product thesis; the likeliest handle to negotiate | Generic, SEO-hostile, reads as a file-recovery utility |
| — | **stet** (bare) | FREE (404) | TAKEN — 65 repos | **2,089** | `elberacasa/stet` shipped npm **`stetmark` on 2026-08-05**, **5,753 dl/mo**, tagline "stet — let it stand" [measured]; plus *Stet* public-commenting software and Cowlishaw's 1977 STET editor [SS] | Perfect one syllable | A live claim on the word, three weeks old, same metaphor, agent-oriented |

**Recommendation: `stetfile`, with `stet` as the spoken shorthand and the CLI verb** (`stet <file>`). It is the only candidate clean on all four measured axes — npm 404, GitHub 404, zero named repos, no product found. Naming from the guarantee is defensible for a decade; naming from the file format (`md*`) ages with the format. **Anti-recommendation attached: re-check `stetmark`'s trajectory before any spend, because bare-`stet` branding collides with it even though `stetfile` does not.**

Ruled out and recorded so nobody re-litigates [measured + inference]: `quire` (Getty's Quire is a plain-text multiformat publishing framework — the closest adjacent market on the list — and quire.io is a kanban PM tool, the exact settled anti-position); `colophon` (best conceptual fit for degradation certification, but a live Obsidian long-form plugin holds it in this market, npm and GitHub both taken); `palimpsest` (the metaphor is inverted — scraped off and overwritten); `marginalia`, `folio` (13,893 dl/mo), `splice` (the music platform), `vellum`, `quarto`, `bedrock`, `scribe` (4,233 dl/mo), `fathom`. **Do not pick from the npm-404/GitHub-200 bench** (`quoin`, `trueline`, `kerf`, `truefold`, `bytefold`…) — a squatted org forces a permanent handle mismatch you pay for in every README, badge, and install line. **Do not ship a name whose npm 404 you have not re-run on the day you register it**; these were 404 at one instant and nothing reserves them.

### 52.3 The explicit case for keeping "frontmatter" with a qualifier

**For.** The word is the thesis in one token — the file's frontmatter *is* the state every projection reads, so the target buyer needs no teaching. The collision is narrower than 80,605 suggests: Front Matter CMS is a **VS Code extension** [fetched], a plugin inside another editor, whose most-starred org repo is a docs site at 29 stars — a different artifact, install path, and price point [inference]. Bare npm `frontmatter` being 200 costs almost nothing, since it is a dead 2022 `0.0.3` YAML parser [measured].

**Against.** 80,605 installs and 2,539 stars in the same keyword space is real search and word-of-mouth interference for years [fetched]; npm `getfrontmatter` is **already 200**, so the qualified space is being nibbled [measured]; a qualifier is a permanent tax — "Frontmatter, the app, not the VS Code one" in every conversation, forever [inference]; and trademark exposure is highest here because the mark is near-identical in an overlapping class.

Qualified handles measured free 2026-08-29 [measured]: npm `frontmatter-app`, `frontmatterapp`, `usefrontmatter`, `frontmatterhq`, `frontmattr`, `frontmatter-studio`, `frontmatter-editor` — all 404. GitHub `frontmatterapp`, `getfrontmatter`, `usefrontmatter`, `frontmatterhq`, `frontmattr`, `frontmatterstudio` — all 404.

| Rank | Form | Verdict |
|---|---|---|
| 1 | **`frontmatterapp`** | Product name stays "Frontmatter"; the handle carries the qualifier. Least brand tax |
| 2 | **"Frontmatter Studio"** (npm `frontmatter-studio`, GitHub `frontmatterstudio`) | A qualifier in the *spoken* name is what actually separates you from the incumbent |
| 3 | **`frontmattr`** | **Anti-recommend.** Vowel-drop is a 2012 tic and generates permanent misspelling tickets |

**Do not use "Frontmatter" bare as the product name while quietly holding qualified handles — that is the highest-risk option with extra steps, taking full trademark and SEO exposure and buying nothing back. Either qualify the spoken name or leave the word.**

**Falsifier.** If a trademark attorney's knock-out search returns clean on the incumbent's class overlap, "Frontmatter Studio" beats `stetfile`, because a taught name costs more than a qualifier.

### 52.4 Trademark — required disclaimer

Nothing above is a trademark clearance. What was checked is **package-registry and code-host handle availability plus informal product collision**, a different question in kind. **UNCHECKED and not checkable here:** USPTO TESS, EUIPO, IP India/TMR, WIPO Madrid, unregistered common-law rights, Nice-class overlap, use-in-commerce priority, and every domain. A name can be free on npm and GitHub and still infringe; a taken handle implies nothing about mark rights. **Get a knock-out search from a trademark attorney on the final two names before any spend on domains, logo, or launch copy — and specifically before choosing between "keep frontmatter with a qualifier" and a clean coinage, because that is the decision where legal risk, not availability, dominates.**

---

## 55. Verification debt

**No claim tagged `[SS]` in this document may be published, quoted in marketing, cited to an investor, or repeated to a customer until it has been re-fetched with the date read.** The PRD's own evidence-tag census stands at `[fetched]` 86 · `[SS]` **52** · `[measured]` 50 · `[derived]` 9 · `[inference]` 1 [measured].

### 55.1 Sources refused or unreachable — retry with backoff before publication

| Source | Failure | Blocks |
|---|---|---|
| ACM publications policy | HTTP 403 | §42.2 fourth row stays `[SS]` |
| OpenAI classifier withdrawal post | HTTP 403, JS wall | Any claim about detector retirement |
| arXiv 2303.11156 (Sadasivan et al.) | HTTP 429 | The detection-limits argument rests on three papers, not four |
| C2PA member roster | JS-rendered, headers only | Any adoption count for C2PA |
| GitHub API in the r3 session | 403 unauthenticated | **No star or download count from that session exists.** Counts in §22 come from the separate r2 session and carry their own read dates |
| PRC Art. 11 强制性国家标准 | Not opened | The exact mandated text-label syntax is unknown |
| Digital Omnibus amending act | URL returned a 404 page | The 2 Aug vs 2 Dec 2027 disagreement (§42.1) is unresolved |
| YouTube disclosure help page | 1,420,253 bytes of navigation chrome, no policy body | All platform disclosure norms |
| pypistats.org | `429 RATE LIMIT EXCEEDED` | Any Python-side distribution proxy for §22 |
| Every registrar / RDAP host | Not in the sandbox allowlist | **Every domain in §52 is UNCHECKED** |

### 55.2 Claims that remain unverified, ranked by public embarrassment

| # | Claim | Why it is dangerous |
|---|---|---|
| 1 | Princeton GEO "25–40% visibility lift from quotes, statistics and citations" `[SS]` | Sits in the same sentence as a boast that a rival claim "is measurably refuted and will never appear in our marketing". An unopened figure next to a refutation boast is the highest-embarrassment pairing in the document |
| 2 | "under 4% of GitHub notebooks reproduce" (Pimentel 2019) `[SS]`, never opened | A specific figure from a specific paper with a specific reproducibility definition |
| 3 | "No organised India Obsidian meetup or Discord found" `[SS]`, single source | An **absence claim** about a community that can refute it with one reply |
| 4 | "OpenAI removed Canvas May 2026" `[SS]` | A falsifiable claim about a named company on which an entire structural hedge rests |
| 5 | "Notion cut free AI to 20 responses for life"; "Microsoft +43% Copilot bundling drew a CMA probe" `[SS]` | Names a regulator and two competitors' pricing from unopened sources, inside a section arguing that *they* misstate things |
| 6 | Support deflection "18% median, 40–60% with AI, $25–35/ticket" `[SS]`, single source | Goes into B2B collateral against Intercom, Zendesk, and Document360, who publish their own numbers |
| 7 | "Median solo B2B founder revenue >4× B2C by month 24" `[SS]`, no named study | Shapes the entire two-motion strategy |
| 8 | Vanta/Drata "$7,000–$30,000/yr" `[SS]` | Two named vendors' prices |
| 9 | "Perplexity Pro free via Airtel to ~400M subscribers, worth ₹17,000/yr" `[SS]` | Three checkable numbers about a named telco |
| 10 | "21.9M India GitHub contributors, +5.2M in a year" `[SS]` | Octoverse is one click away |
| 11 | Dataview ceiling "~30s past 3,000 notes" `[SS]` | We promise to publish ceilings honestly; publishing an **unopened** ceiling is self-defeating |
| 12 | r/ObsidianMD ~344,000 / Discord ~195,000 — **untagged in the PRD** | Untagged numbers read as measured |
| 13 | §21.1 support model (0.02 / 0.10 tickets per user-month, 12 min each) → **46.4 founder-hours/month** | Labelled an assumption in prose, then quoted as a conclusion twice |
| 14 | Overleaf's total user count | Its own two pages said 20M and 25M on the same day [fetched]. **Never state one figure** |
| 15 | Tunisia RMS survey generalised to India | n=121, single study, fieldwork 2016 [fetched]. Cite it as a warning about a *low-income research population*, never as an India number |
| 16 | The 7.8%–**20.9%** academic-plugin bracket | The 20.9% upper bound is not reproducible from the three published peak-version numbers; **23.3%** is what the arithmetic gives (§22.1). Re-derive before use |
| 17 | "obsidian agent-skills 47,418★" | Correct magnitude, **wrong repo name** and a citation URL that cannot produce a single repo's stars. Fix to `kepano/obsidian-skills`, **47,444★, 3,410 forks, pushed 2026-06-08** [fetched 2026-08-28T23:36Z] |
| 18 | "inkeep/open-knowledge 3,239 → 3,673 in 27 days" | Restate as **3,239 → 3,679 in 28 days** [fetched 2026-08-28T23:33Z] |
| 19 | Docs-as-code pricing (GitBook, Mintlify, Outline, Confluence) | **Tag collision**: one report says all `[SS]`, pricing pages could not be opened; another and §20.7 present the same products as `[fetched 2026-08-29]`. GitBook Premium $65 and Statuspage Business $399 carry both tags in different sections. Resolve to one tag before the wedge number ships |
| 20 | `mdmax/fold@1` 43.71% → 4.28% | Self-flagged as prototype-only, never run over the pinned corpus. **Keep the flag; do not quietly promote it** |
| 21 | "Tests passing 1,575/1,575" | Sits three rows above "CI: None, `.github/` does not exist" [measured]. Tag it as a **single local run** until a gate exists that can fail |

### 55.3 Never researched — report as absent, never as zero

Accessibility (WCAG 2.2 AA plan, screen-reader model, VPAT/ACR cost); error and refusal UX; backup, restore, and DR (RPO/RTO, point-in-time restore, restore drill); the sync-engine choice, whose exit condition is two-device offline convergence with zero loss and whose corpus contains **0 hits for `service worker`** [measured]; public API design, versioning, and rate limiting (`rate limit`, 0 hits in the PRD); trust and safety, takedown, and India IT Rules 2021 intermediary duties; product analytics and consent basis; email deliverability and notifications; open-source licence posture; i18n, IME, and RTL; roles, permissions, and invites; desktop signing, notarisation, and auto-update; SEO for published pages; schema-migration contracts. Also, from §42: platform disclosure norms, Spain's draft labelling penalties, the Utah AI Policy Act, the Colorado AI Act, and Korea's AI Framework Act.

### 55.4 What needs a human or a professional

| Need | Professional | Gate — do not proceed past this without them |
|---|---|---|
| Trademark clearance on the final two names | Trademark attorney, India + US + EU, relevant software class | **Before** any spend on domains, logo, or launch copy, and before choosing between a qualified "frontmatter" and a clean coinage (§52.4) |
| What discharges an EU AI Act obligation for a given customer | The customer's own counsel | We emit records and citations only. **A solo founder in India must never be the party asserting EU compliance** (§42.6) |
| PRC labelling conformance | A PRC-qualified adviser who can read the incorporated 强制性国家标准 | Before any China-facing export claim |
| Intermediary liability, grievance officer, takedown timelines under India IT Rules 2021; DMCA agent for the US | Indian counsel + a US agent of record | Before one-toggle publish goes live to the public internet |
| GST treatment, GSTIN on invoice, e-invoicing, and the s.8(5) exposure on customer documents | Chartered accountant / company secretary | Before the first paid invoice |
| WCAG 2.2 AA conformance and an ACR/VPAT | Accessibility auditor | Before any B2B procurement conversation; the current `body-faint #b8b8b8` at **2.14:1** already fails AA [measured] |
| Independent adversarial review of the engine's own verifiers | A reviewer who did not write them | Per LR#60 — a verifier written beside its subject inherits its blind spots |
| Domain availability for every §52 candidate | Anyone with unrestricted network access | Re-run npm and GitHub 404s **on the day of registration**; nothing reserves them |
