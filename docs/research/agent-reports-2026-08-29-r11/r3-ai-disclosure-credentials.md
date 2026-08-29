### Method & evidence ledger

- **Hook answer (LR#48 reconcile), re-verified twice and unchanged**: I mutated nothing. `git -C ~/.claude status --porcelain -- skills-src settings.json` = **18 entries, identical across both checks**; `~/.claude` HEAD is `6e3908282f61b33734b6d4eba4e49149d6043d0f` dated **Thu Aug 27 23:38:14 2026 +0530**, i.e. before this session began. In `frontmatter`, HEAD is `d714fb5f0305ea1e5f8612b43e271d3b4e95fe54` ("specs: the contract layer, with a gate that is proven able to fail"), moved from the session-start snapshot `9e84628` by **another agent, not me**. My only writes were 77 `curl` response files under `/tmp/claude-501`, outside both repos. No `git add`, `commit`, `push`, or repo-path write was issued in this session. [measured]
- `curl` reachable; `WebFetch` unused. Primary sources opened: EUR-Lex CELEX 32024R1689 (1,263,937 bytes), C2PA specs 2.1 / 2.2 / 2.3 / 2.4, CAC 国信办通字〔2025〕2号, CA SB-942 chaptered text, Nature Portfolio AI policy, ICMJE, Elsevier, Nature s41586-024-08025-4, arXiv API. [measured]
- Refused/unreachable, therefore **not** cited as fetched: ACM publications policy (HTTP 403), OpenAI classifier post (403, JS wall), GitHub API (403, unauthenticated rate limit — **no star or download counts obtained**), arXiv 2303.11156 (HTTP 429), C2PA member roster (JS-rendered; only section headers returned), YouTube disclosure help page (1,420,253 bytes of navigation chrome, no policy body). [measured]

### Layer 1 — What is LAW

| Instrument | Status | Text in scope? | Dates | Sanction |
|---|---|---|---|---|
| **Reg. (EU) 2024/1689 (AI Act) Art. 50** | Binding regulation, directly applicable | **Yes, explicitly** | Signed Brussels 13 Jun 2024; Art. 113: applies **2 Aug 2026** (Ch. IV is not in the carve-out list) | Art. 99(4)(g): ≤ **EUR 15,000,000 or 3%** worldwide annual turnover, whichever higher; SMEs/start-ups get the **lower** of the two (Art. 99(6)) |
| **PRC《人工智能生成合成内容标识办法》** | Binding departmental rules (CAC / MIIT / MPS / NRTA) | **Yes** — Art. 3 lists 文本 (text) first | Signed 7 Mar 2025, published 14 Mar 2025, **in force 1 Sep 2025** (Art. 14) | Art. 13 — enforcement by reference to the Cybersecurity Law and subordinate regulation |
| **California SB-942 (Ch. 291, 2024)** | Enacted statute | **No — text excluded** from every operative duty | Approved 19 Sep 2024; **operative 1 Jan 2026** (§22757.6) | §22757.4: **$5,000 per violation**, each day a discrete violation; AG / city attorney / county counsel |

**AI Act Art. 50 verbatim structure** [fetched]:
- **50(2)** binds *providers* of systems "generating synthetic audio, image, video **or text**" to mark outputs "in a machine-readable format and detectable as artificially generated or manipulated," qualified by "effective, interoperable, robust and reliable **as far as this is technically feasible** … the costs of implementation and the generally acknowledged state of the art." Carve-out: systems performing "an assistive function for standard editing" or not substantially altering input data "**or the semantics thereof**."
- **50(4) ¶2** binds *deployers* publishing AI text "with the purpose of informing the public on matters of public interest" to disclose — **unless** "the AI-generated content has undergone a process of human review or editorial control and where a natural or legal person holds editorial responsibility for the publication."
- **50(5)**: disclosure "in a clear and distinguishable manner at the latest at the time of the first interaction or exposure," conforming to accessibility requirements.
- **50(7)**: the AI Office facilitates codes of practice on detection and labelling; the Commission may impose common rules by implementing act. **The technical detail is deferred, not settled.**
- **Recital 133** enumerates permitted techniques: "watermarks, metadata identifications, cryptographic methods for proving provenance and authenticity of content, logging methods, fingerprints."

**Source disagreement, recorded not resolved**: Art. 113(c) says Art. 6(1) high-risk obligations apply **2 August 2027** [fetched, EUR-Lex]; the Commission's `digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai` page says **2 December 2027** [fetched]. The same page states transparency rules "will come into effect in August 2026," corroborating Art. 113. The Digital Omnibus could not be opened (its `/policies/digital-omnibus` URL returned a 404 page). **The Aug-2026 transparency date is doubly sourced; the Dec-2027 high-risk date is single-sourced and unexplained.**

**China's operative details that matter to an editor** [fetched]:
- Art. 4(1): explicit text label = "文字提示或者通用符号提示" at the **start, end, or an appropriate middle position**, or a prominent marker in the surrounding UI.
- Art. 4 final ¶: **"提供生成合成内容下载、复制、导出等功能时，应当确保文件中含有满足要求的显式标识"** — where download / copy / **export** is offered, the *file itself* must carry a conforming explicit label. A statutory export-time attestation.
- Art. 5: the *implicit* label goes in **file metadata**, defined as descriptive information embedded in the file **header**; digital watermarking is 鼓励 (encouraged), **not mandated**.
- Art. 6: distribution platforms must verify metadata and apply three tiers — confirmed / user-declared ("可能") / detected-but-undeclared ("疑似").
- Art. 9: a user may request unlabelled output; the provider may supply it after contractually shifting the labelling duty, and must retain logs **≥ 6 months**.
- Art. 10: no person may "恶意删除、篡改、伪造、隐匿" a label, **nor provide tools or services for others to do so**.
- Art. 11: compliance must also meet "强制性国家标准" — a mandatory national standard incorporated by reference, which I did not open.

### Layer 2 — What is POLICY (private, enforced by exclusion)

| Body | Rule | Evidence |
|---|---|---|
| Springer Nature / Nature Portfolio | Risk-tiered, not blanket. **Green** (language polish, structure, translation, data cleaning): permitted, disclosure "enhances trust." **Amber** (drafting summaries, extensive copy-editing, suggesting analyses): permitted with oversight + disclosure. **Red** (conclusions presented as human-derived, undisclosed core reasoning, delegating peer review, fabricated citations): **not permitted**. "Human accountability is non-transferable." Same framework applies to authors, reviewers and editors. | [fetched] |
| ICMJE | Disclosure **at submission**, in **both the cover letter and the work**; writing assistance → Acknowledgments; data / analysis / figure generation → Methods. Chatbots "should not be listed as authors because they cannot be responsible for the accuracy, integrity, and originality of the work." | [fetched] |
| Elsevier | Fixed sentence: *"During the preparation of this work, the author(s) used [NAME OF TOOL / SERVICE] in order to [REASON]. After using this tool/service, the author(s) reviewed and edited the content as needed and take(s) full responsibility for the content of the published article."* No AI authorship; AI figures permitted only for explanatory diagrams (flow charts, decision trees, timelines, workflow diagrams). | [fetched] |
| ACM | Reported to require acknowledgement-section disclosure and bar AI authorship — **not opened (403)**. Do not cite as verified. | [SS] |

**Convergent shape across all three opened policies** [derived, 3 of 3 fetched texts]: the demanded artifact is a **free-text natural-language declaration naming tool + purpose + human-responsibility affirmation, placed in a named document section**. Not a score. Not a percentage. Not a detector result.

### Layer 3 — Detection and watermarking: the empirical floor

- **SynthID-Text**, Nature, published **2024-10-23**, DOI `s41586-024-08025-4`: production text watermark modifying only the sampling procedure, integrated with speculative sampling; live experiment over "nearly **20 million** Gemini responses" confirming quality preservation. [fetched]
- **"Watermarks in the Sand"**, arXiv 2311.04378, submitted **2023-11-07**: proves under stated natural assumptions that **strong watermarking is impossible**, including in the private-key setting; the generic attack needs only a quality oracle and a perturbation oracle, with no knowledge of the key or even which scheme is in use. [fetched, abstract]
- **Weber-Wulff et al., "Testing of Detection Tools for AI-Generated Text"**, arXiv 2306.15666, **2023-06-21**: 12 public tools + 2 commercial systems (Turnitin, PlagiarismCheck); conclusion — "neither accurate nor reliable," with "a main bias towards classifying the output as human-written." [fetched, abstract]
- **Liang et al., "GPT detectors are biased against non-native English writers"**, arXiv 2304.02819, **2023-04-06**: detectors "consistently misclassify non-native English writing samples as AI-generated," while native samples are classified correctly; simple prompting both mitigates the bias and bypasses detection. [fetched, abstract]
- Sadasivan et al. (2303.11156): **not opened**, arXiv API returned 429. [measured]
- **Numbers deliberately absent**: no false-positive rate, no vendor accuracy figure, and no repository star or download count was obtained this session. [measured]

**Consequence** [inference]: the law asks providers to mark; the literature says marks are removable, and inferential detection is unreliable *and* demographically biased. A tool sitting *downstream of generation* cannot close that gap with statistics. It can only close it with **records of what actually happened in the editor**.

### Layer 4 — Do text-level content credentials exist? Yes, since April 2026.

- **C2PA 2.3 — December 2025** [fetched, §5.3.1] added "comprehensive support for embedding C2PA manifests in unstructured text files": Appendix A.8 `C2PATextManifestWrapper`, magic `0x4332504154585400` ("C2PATXT\0"), version 1, a JUMBF manifest store encoded as **Unicode variation selectors** (U+FE00–FE0F, U+E0100–U+E01EF), U+FEFF-prefixed, placed at the end of visible text as a single contiguous block.
- **C2PA 2.4 — April 2026** [fetched, §5.3.1] added:
  - **Appendix A.9 "Embedding Manifests into Structured Text"** — explicitly "source code, configuration files (YAML, TOML, INI), markup (**Markdown**, AsciiDoc, LaTeX)."
  - **`c2pa.ai-disclosure` assertion** — "machine-readable AI transparency info"; CDDL `ai-model-disclosure-map` with mandatory `modelType`, optional `modelName`, `modelIdentifier`, `scientificDomain` (arXiv taxonomy, e.g. `cs.AI`), and `contentProfile.humanOversightLevel` ∈ `fully_autonomous | prompt_guided | human_validated`, disambiguated against `digitalSourceType` in a normative table.
  - HTML embedding; crJSON (a derived JSON-LD view, spec-flagged as "**not independently verifiable** or intended as an input format"); repository-receipt and environmental-sustainability assertions.

**A.9 is, line for line, a byte-splice contract** [fetched]:
- Fixed OpenPGP-armour delimiters `-----BEGIN C2PA MANIFEST-----` / `-----END C2PA MANIFEST-----` (modelled on RFC 4880 §6.2).
- Markdown single-line form: `<!-- -----BEGIN C2PA MANIFEST----- https://fabrikam.com/manifests/a1b2c3.c2pa -----END C2PA MANIFEST----- -->`.
- **Front-matter form**: the block sits inside the `---` fences above `title:`; the `---` delimiters are **not** part of the exclusion range.
- Hard binding: `c2pa.hash.data` carrying **a single exclusion range**; "Files shall be read in **binary mode** to preserve the exact byte representation of line terminators"; start/length expressed in **bytes**; the at-end form starts at "the byte offset of the newline character preceding the manifest block."
- "A claim generator shall **not** alter the line ending convention of the file content outside the manifest block."
- **Bare CR (0x0D) is unsupported** — such files "shall be converted to LF or CRLF before embedding."
- At most one block per file; failure codes are named: `manifest.structuredText.multipleReferences`, `…noManifest`, `…emptyReference`.
- An external manifest URL is "preferred" over an inline `data:application/c2pa;base64,…` URI.

**Would frontmatter be first?** **No — and that is the good outcome.** You would be an early implementer of an April-2026 standard whose text profile reads as if written by people solving your exact problem. The byte-range semantics are already specified, and they *match* your engine instead of fighting it. [inference]

### Layer 5 — Mapping byte-anchored provenance onto each obligation

| Obligation | Satisfied? | Why |
|---|---|---|
| AI Act **50(2)** machine-readable marking | **No, and cannot be** | Binds the *provider* of the generating system; frontmatter is not one, and sits squarely inside the "assistive function for standard editing" carve-out. [fetched + inference] |
| AI Act **50(4)¶2** deployer text disclosure | **No** — the user is the deployer | But frontmatter can *emit* the disclosure the deployer owes. |
| AI Act **50(4)¶2 exemption** (human review / editorial control / named editorial responsibility) | **Yes — this is the fit** | A byte-anchored ledger of which ranges were human-authored, which machine-inserted, when and by whom, is exactly the evidence the exemption is phrased around. No other feature you have maps this cleanly. [inference] |
| AI Act **50(5)** clear, distinguishable, accessible, at first exposure | **Partially** | A front-matter key is machine-readable but not *exposed*; the projection (site render) must surface it — cheap under your projection model. |
| China **Art. 4 final ¶** — export must carry the label | **Yes, mechanically** | Export-time injection of a visible disclosure line plus an A.9 block with a byte exclusion range is a reversible splice you already know how to do. |
| China **Art. 5** — implicit label in file header metadata | **Yes** | YAML front matter *is* the header; A.9's front-matter form lands there by spec. |
| China **Art. 10** — no tool for concealing labels | **Risk, not fit** | See anti-recommendations. |
| CA SB-942 | **N/A** | Text excluded — `image, video, or audio` is the phrase in all three operative duties (§22757.2(a)(1), §22757.3(a), §22757.3(b)), even though §22757.1(c) defines a GenAI system to include text. [fetched] |
| Nature / ICMJE / Elsevier | **Yes — the near-term revenue surface** | All three want a named-section prose declaration; rendering the ledger into Elsevier's exact sentence is a deterministic template fill. |

**Two hard incompatibilities** [fetched + inference]:
1. **A.8 is hostile to your thesis.** It injects invisible variation selectors into the byte stream and hashes after **NFC normalization and UTF-8 re-encoding** — so two byte-different files hash identically, and the act of crediting a file mutates it. Do not implement A.8.
2. **A.9's bare-CR refusal collides with a real corpus.** Your master plan already queues bare-CR set-destruction as engine work; A.9 says such files "shall be converted." Converting is a silent byte mutation you have committed not to perform. The honest behaviour is **refuse and cite the reason** — the same shape as your existing degradation certificate.

### Layer 6 — Features: honest vs pseudo-precision

**Honest (build)**

1. **Disclosure block** — a reserved front-matter key holding structured facts: tool identifier, purpose, `humanOversightLevel` (reuse the C2PA enum verbatim rather than inventing one), timestamp, responsible person. Deterministically projectable into (a) Elsevier's verbatim sentence, (b) an ICMJE Acknowledgments/Methods paragraph, (c) a PRC Art. 4(1) 文字提示 line, (d) a `c2pa.ai-disclosure` assertion. One record, four projections — your existing architecture, not a new one.
2. **Export-time attestation** — on export, splice one A.9 manifest block (front-matter form for Markdown) referencing an external `.c2pa` store; compute `c2pa.hash.data` with the byte exclusion range, binary mode. Removing the block returns the original bytes exactly. **The one feature where your engine is differentiated rather than merely adequate.**
3. **Provenance degradation certificate** — extend cross-engine certification to answer: does this target renderer / CMS / round-trip preserve the manifest block, the front-matter key, the line endings? Report per-target PRESERVED / STRIPPED / MANGLED. Nobody else can produce this, because nobody else measures byte fidelity across engines.
4. **Refusal surface** — bare-CR files, multiple blocks, non-`text/*` inputs: refuse citing the specific C2PA failure code. Refusals with citations are a trust asset, not a defect.
5. **Editorial-responsibility record** — who reviewed which byte ranges, when. Sized to AI Act 50(4)¶2, and useful to journals independently of any law.

**Pseudo-precision (do not build)**

- **A "percentage AI" report.** Unsound at four independent levels: (i) no ground truth exists for the denominator; (ii) inferential detectors are "neither accurate nor reliable" and biased against non-native writers [fetched ×2]; (iii) even a keystroke-derived percentage measures *bytes*, while the AI Act, Nature, ICMJE and Elsevier all regulate *intellectual contribution* — a human who retypes a model's dictation scores 100% human and is lying; (iv) a paste of unknown origin is unattributable, so any total is a guess wearing a decimal point. If a number is demanded, ship a **three-bucket ledger with an explicit `unattributed` bucket that is never redistributed** — never a single scalar.
- **A confidence score on the disclosure.** You either recorded the event or you did not.
- **A "verified human-written" badge.** Unprovable in principle: A.9's hard binding proves *bytes unchanged since signing*, never *bytes typed by a person*.

### Anti-recommendations

- **Never claim AI Act Art. 50 compliance.** The 50(2) marking duty is the provider's; asserting otherwise misleads a customer carrying EUR 15,000,000 / 3% exposure. Say exactly: *"produces evidence for the Art. 50(4) editorial-control exemption; does not discharge Art. 50(2)."* [fetched]
- **Never ship a "strip invisible / zero-width characters" cleanup.** Under C2PA 2.3 A.8 those characters *are* the credential, and PRC Art. 10 forbids providing tools for 隐匿 (concealing) labels. If ever added: opt-in, per-invocation, with an explicit "this destroys a Content Credential" warning. [fetched ×2]
- **Never NFC-normalize on save or export.** It is the single line that would silently falsify byte-preservation; A.8 is the only place the spec asks for it, and A.8 is the appendix you are not implementing.
- **Never build, bundle, or surface an AI-text detector.** You would be importing a documented demographic bias into a product sold globally, from India, to non-native-English writers — reputational risk far exceeding any revenue. [fetched: 2304.02819]
- **Never present a watermark as tamper-evident protection.** Strong watermarking is provably impossible under natural assumptions [fetched: 2311.04378]. C2PA's guarantee is signed byte-range integrity, not detection of removal from a copy.
- **Do not pursue C2PA membership or the conformance program yet.** The spec is public and implementable without either; the cost to a solo founder is the ongoing signing-identity and trust-list obligation, not the read. Revisit when a paying customer names it.
- **Do not implement A.8 at all.** A.9 only.
- **Do not treat the SB-942 text exclusion as stable.** A 2024 statute whose GenAI definition includes text while its duties exclude it is an asymmetry legislatures close. Parameterise the export path by jurisdiction; do not shape it around California.
- **Do not build a compliance-advice surface.** Emit records and citations; let the customer's counsel do the mapping. A solo founder in India selling into the EU should not be the party asserting what discharges an EU obligation.
- **Do not let the disclosure block become a second source of truth.** It is a front-matter key in the file, projected like everything else — the moment it lives in a sidecar database, the product's central claim is broken.

### Open, unverified, and next

- ACM policy (403), OpenAI classifier withdrawal (403), Sadasivan 2303.11156 (429) remain unopened — retry with backoff before anything here is published. [measured]
- No adoption metric (stars, downloads, C2PA member count) was obtained; any such figure in a later draft must be re-fetched **with the date read**. [measured]
- **Entirely unresearched this session, and to be reported as such rather than as absent**: Spain's draft labelling penalties, Utah AI Policy Act, Colorado AI Act, Korea's AI Framework Act, and all platform disclosure norms (YouTube / Meta / TikTok / LinkedIn — the YouTube help URL returned navigation chrome only). [measured]
- Highest-value next fetches, in order: (1) C2PA 2.4 Appendix A.9 conformance material and test vectors, to check whether a reference implementation of the Markdown front-matter form already exists; (2) the Digital Omnibus amending act, to resolve the 2 Aug vs 2 Dec 2027 disagreement and confirm Art. 50's Aug-2026 date was not moved; (3) the mandatory Chinese national standard incorporated by PRC Art. 11, which likely fixes the exact text-label syntax.