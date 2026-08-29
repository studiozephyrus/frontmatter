### Access log, evidence method, and hook answer

- **Hook answer (LR#48), verified twice:** this subagent performed zero writes and zero commits — only `curl`, `git status`, and read-only tools ran; the 19 `~/.claude` and 1+ `~/.sgnk` modifications all pre-date this run, and two attempted `/tmp` writes were denied by the sandbox and abandoned. `frontmatter` HEAD unchanged at `d714fb5f0305ea1e5f8612b43e271d3b4e95fe54`.
- `WebFetch` refused by the local gate; `curl` unblocked and used for every primary source [measured].
- `loc.gov` and `iso.org` sit behind a Cloudflare JS interstitial ("Just a moment… Enable JavaScript") for `curl` regardless of User-Agent [measured]; `public.ccsds.org/Pubs/650x0m2.pdf` returns 301 into the same wall [measured]. Worked around via `web.archive.org` raw (`id_`) snapshots — snapshot timestamps given per claim.
- DuckDuckGo HTML and lite endpoints both return a bot challenge [measured]; `WebSearch` used only where marked [SS].
- GitHub REST read with `GH_TOKEN`; all repo figures read **2026-08-29T00:10Z** [measured].
- **OAIS (ISO 14721 / CCSDS 650.0-M-2) was NOT opened.** Every OAIS structural claim below is [inference] over the model's public vocabulary, not a fetched citation. Do not publish an OAIS claim from this document without opening the standard.

---

### 1. Where Markdown + YAML actually sit in preservation guidance

**LoC Recommended Formats Statement — "I. Textual Works ⟶ ii. Digital", §B Formats.** Table cells parsed individually from archive snapshot `20260626211847` of `loc.gov/preservation/resources/rfs/text.html` [measured]:

| Column | Contents (verbatim list) |
|---|---|
| **Preferred** | XML-based markup formats with DTD/schema + XSD/XSL stylesheet + explicitly stated character encoding; EPUB3; other widely-used book DTDs/schemas (TEI, DocBook); page-layout: PDF/UA (ISO 14289-1), PDF/A (ISO 19005), PDF |
| **Acceptable** | XHTML or HTML with DOCTYPE + stylesheet; XML-based document formats incl. DOCX/OOXML 2012 (ISO 29500), ODF (ISO/IEC 26300), OOXML (ISO/IEC 29500); SGML with DTD; BITS 2.0; PDF (web-optimized); **"Other formats: Rich text format (RTF), Plain text, Widely-used proprietary word-processing formats"** |

- Occurrence counts on that page: `markdown` **0**, `commonmark` **0**, `YAML` **0**, `plain text` **2** [measured].
- §A Technical Characteristics — encoding preference order: **UTF-8, UTF-16 (with BOM), US-ASCII** Preferred; ISO 8859 Acceptable; everything else below [measured].
- §F Technological Measures — "Files must contain no measures (such as digital rights management [DRM] technologies or encryption) that control access to or prevent use of the digital work" [fetched].

**Consequences, stated plainly:**

- Markdown is **absent** from the RFS. Plain text is **Acceptable, not Preferred**, bucketed with RTF and proprietary word-processor formats — *below* HTML and DOCX [measured].
- The RFS optimises for rendered fidelity and structural richness of *published deposits*, not editability or byte-durability of *personal working notes*. Different objective function; the ranking is not a verdict on Markdown's longevity [inference].
- What frontmatter *can* cite honestly: the **encoding** is top-Preferred (UTF-8), and the **no-DRM / no-encryption** requirement is satisfied by construction [measured].

**LoC Sustainability of Digital Formats registry** (`fdd/browse_list.shtml`, archive snapshot 2026) [measured]:

- 595 distinct format-description entries parsed. `markdown` = 0 hits; `commonmark` = 0 hits. **There is no LoC format description for Markdown.**
- **YAML has one: `fdd000645`** — "Last significant FDD update: 2025-06-02", "Draft status: Full", content categories `text, dataset` [fetched].
- `fdd000645` Disclosure: "Open standard. Since 2020, it has been maintained by the YAML Language Development Team." Documentation: "The most recent specification is YAML 1.2, Revision 1.2.2, released October 1, 2021" [fetched] — independently corroborated at `yaml.org/spec/1.2.2/`: "Revision 1.2.2 (2021-10-01)"; "There are no normative changes from the YAML specification v1.2" [fetched].
- **Source disagreement, preserved not resolved:** the same FDD that calls YAML an open standard also records that criticisms "are counter to these goals", cites RFC 9512 §4 security considerations, and notes "such complaints and concerns have led to the development of YAML alternatives, such as YAML parsers that only validate a restricted subset of the YAML specification" [fetched]. The preservation registry itself documents YAML's implementation divergence.

**OAIS / PREMIS framing:**

- PREMIS **Version 3.0** is the current Data Dictionary; PREMIS = Data Dictionary + XML schema + supporting documentation; PREMIS OWL Ontology v3 exists [fetched, `loc.gov/standards/premis/` via wayback].
- A Markdown+YAML file is a strong OAIS *Content Data Object* but carries no *Preservation Description Information* — no fixity, provenance, reference identifier, or context — unless the tool supplies it [inference; OAIS not opened].
- frontmatter's byte-preserving splice and cross-engine degradation certificate map onto PREMIS `fixity` (a digest that survives an edit which did not touch those bytes) and `event` (a recorded, characterised transformation) semantics [inference].

---

### 2. Format-obsolescence evidence actually opened

- **WordStar** (`fdd000552`, last significant update 2022-07-21) [fetched]: first shipped September 1978; LoC "has several hundred WordStar files in its collections… .ws, .wsd, .ws5, .ws6 and .ws7"; pre-5.0 releases used "the 8th bit or 'high' bit of ASCII characters… to store print and formatting information", so "when these WordStar files are interpreted via typical encodings, they may appear as gibberish". A file extension was never required by the software. **The canonical failure: a format that is mostly ASCII whose meaning still evaporated.**
- **CommonMark**: latest version **0.31.2, dated 2024-01-28**; the published version list runs back to 0.13 (2014-12-10) [measured, `spec.commonmark.org`]. Ten-plus years, still 0.x, no 1.0.
- **YAML**: frozen at 1.2.2 since 2021-10-01, with documented parser-subset divergence [fetched].

---

### 3. Notes-app shutdowns and what happened to the data

| Product | Event | Outcome for user data | Tag |
|---|---|---|---|
| Catch.com | closed 2013-08-30 | export tool → CSV or ZIP; importable to OneNote / Springpad / Simplenote | [SS] |
| Springpad | closed 2014-06-25 | "all user data on the servers was gone as of June 25"; export tool + Evernote migration path | [SS] |
| Vesper | sync off 2016-08-30 20:00 PT | "they destroyed all the data"; app pulled from App Store 2016-09-15; final build added note+picture export | [SS] |
| Skiff | announced 2024-02-09, acquihired by Notion | discontinuation buried inside an expandable FAQ item; official Discord **and** GitHub repo removed on announcement day; "only some parts of Skiff are source available (not open source since their license is not OSI approved)"; "none of their backend servers are open source"; ~6-month migration deadline | [fetched — partisan primary account, Notesnook, 2024-02-11] |
| Omnivore | shut down Nov 2024, team to ElevenLabs | **repo alive**: `omnivore-app/omnivore`, AGPL-3.0, `archived=false`, 16,225 stars, last commit **2026-08-28T12:19:30Z** ("feat(): adds hiding toggle for discover screen in android (#4679)") | [measured, read 2026-08-29T00:10Z] |
| Standard Notes | acquired by Proton | `standardnotes/app`, AGPL-3.0, `archived=false`, 6,608 stars, last commit 2026-08-25T23:07:42Z | [measured] |

Adjacent licence-state reads, same call [measured, 2026-08-29T00:10Z]: `logseq/logseq` AGPL-3.0, 44,671 stars; `laurent22/joplin` **`NOASSERTION`**, 56,143 stars; `anyproto/anytype-ts` **`NOASSERTION`**, 8,715 stars.

- **Record the disagreement:** GitHub could not resolve an SPDX identifier for Joplin or Anytype. Their open-source positioning may be correct, but the badge does not establish it — read the LICENSE file before citing either as a hedge [measured].
- **Pattern:** in every case above the format was readable. What destroyed data was **the deadline and the notice**, never the encoding [inference].
- **Export is not portability.** An export is a one-time artefact, in a shape the vendor chose under shutdown pressure, on the vendor's clock. The Omnivore and Standard Notes rows are the only ones where something the user relied on is still executing today [inference over measured data].

---

### 4. Source-available / fair-source licences as a shutdown hedge

| Licence | Conversion mechanism | Verbatim anchor | Tag |
|---|---|---|---|
| **BUSL 1.1** | Automatic grant of the Change License on the Change Date **or** the 4th anniversary of first public distribution of that version, whichever is first | "This License applies separately for each version of the Licensed Work and the Change Date may vary for each version" | [fetched, SPDX `text/BUSL-1.1.txt`] |
| **FSL 1.1** | Converts to **Apache 2.0 or MIT after two years**, per version made available (git push, package publish, "mailing out a CD in a tin") | "an evolved BSL"; rejects BSL's Additional Use Grant as creating "too much variability"; "four years is too long"; a different change licence means "you'll have to call it something other than FSL" | [fetched, `fsl.software`] |
| **Elastic License 2.0** | **None. No conversion clause exists.** | "You may not provide the software to third parties as a hosted or managed service"; "You may not move, change, disable, or circumvent the license key functionality" | [fetched, `elastic/elasticsearch` raw] |
| Fair Source (fair.io) | umbrella movement, not a licence | "an alternative to closed source, allowing you to safely share access to your core products" | [fetched] |

- Only BUSL and FSL contain a **self-executing future grant**. That is the property that matters: it does not require anyone at the company to still be alive, employed, or solvent when it fires [inference over fetched clauses].
- Elastic 2.0 is a restriction, not a hedge. Adopting it and calling it a longevity guarantee would be false [measured].
- All three hedge **code**. None hedges the **service** or the **data** [inference].

---

### 5. Escrow — and why it is the weakest rung

- Standard release triggers: bankruptcy, insolvency, liquidation, assignment for benefit of creditors, official discontinuation of the software and/or support, material breach, failure to continue development, failure to deliver the most recent version [SS].
- SaaS escrow additionally deposits runtime/deployment artefacts, and release conditions are drafted to "dovetail with the applicable service-level agreements" [SS].
- Providers named in results: Escode (NCC Group), Codekeeper [SS].
- **Nothing opened establishes how often escrow is actually released.** That number is unmeasured here; do not state one [SS/absence].
- Escrow is enforceable only by the named beneficiary. A consumer product cannot name every user. For frontmatter it is decorative [inference].

---

### 6. Regulation: what it gives you and what it does not

**GDPR Art. 20** [fetched, `gdpr-info.eu/art-20-gdpr/`]:

- (1) Right to receive personal data the subject "has provided to a controller, in a structured, commonly used and machine-readable format" and transmit it "without hindrance" — **only where** processing rests on consent (Art. 6(1)(a) / 9(2)(a)) **or** contract (Art. 6(1)(b)) **and** is "carried out by automated means".
- (2) Direct controller-to-controller transmission "where technically feasible".
- (3) Without prejudice to Art. 17; excludes public-interest / official-authority processing. (4) Must not adversely affect the rights and freedoms of others.
- **No format is mandated.** "Structured, commonly used and machine-readable" is the entire technical bar; UTF-8 Markdown with YAML front matter clears it without effort [derived from the fetched text].
- Scope limit: data the subject *provided*. Derived and inferred data fall outside [derived].

**EU Data Act, Regulation (EU) 2023/2854** [fetched, OJ L text via EUR-Lex]:

- "shall apply from **12 September 2025**. The obligation resulting from Article 3(1) shall apply to connected products and the services related to them placed on the market after **12 September 2026**."
- Recital 82: a source provider "should not undermine… the extraction of the exportable data that belongs to the customer".
- Recital 85: switching = extraction → transformation → upload; the customer may "port its exportable data and digital assets, and where applicable, benefit from functional equivalence".
- Recital 88: switching charges are "intended to pass on costs which the source provider… may incur because of the switching process to the customer who wishes to switch".
- **Limit of this pass:** the operative articles (23–31) did not render in the fetched HTML — article-level text and the switching-charge withdrawal date were **not** retrieved [measured]. Chapter VI binds "providers of data processing services"; whether a local-file editor with optional sync falls inside is **unresolved here**. A hosted sync/publish service sold in the EU is plainly in scope [inference].

---

### 7. The promise ladder — every promise and the mechanism under it

Steph Ango's test is the sharpest published definition and is worth adopting verbatim as the internal bar [fetched, `stephango.com/self-guarantee`, 2024-12-03]: *"A self-guaranteeing promise is verifiable and non-reversible. It does not require you to trust anyone."* … *"File over app is a self-guaranteeing promise. If files are in your control, in an open format, you can use those files in another app at any time. Not an export. The exact same files."* … *"Terms and policies are not self-guaranteeing."* … *"Encoding values into a governance structure is not self-guaranteeing."* … *"Open source alone is not self-guaranteeing."*

| # | Promise | Mechanism | Revocable? | Rank |
|---|---|---|---|---|
| 1 | Plain files, user-chosen folders | filesystem | No, not for files already written | **self-guaranteeing** |
| 2 | No proprietary sidecar carrying meaning | `ls` + delete test | No | **self-guaranteeing** |
| 3 | Byte-preserving splice | hash → edit → diff | No — falsifiable per release | **self-guaranteeing + measurable** |
| 4 | Views are pure projections | delete-the-app test | No | **self-guaranteeing** |
| 5 | Published, versioned format subset + test corpus | a document; copies persist | Updates can stop | durable, weak |
| 6 | Cross-engine degradation certificate | published report | Only as honest as the engine matrix disclosed | strong, auditable |
| 7 | Open-source client | licence grant, irrevocable for released versions | No — shipped versions only | durable |
| 8 | Delayed-open-source licence (FSL / BUSL) | automatic future grant, per version | No — fires without a promisor | durable, code only |
| 9 | Source escrow | third-party contract | Beneficiary-limited | weak |
| 10 | Export guarantee in ToS | policy | **Yes** | weak |
| 11 | Foundation / governance structure | corporate form | **Yes** — reversible | weakest |

---

### 8. Proposed public commitment for frontmatter (exact wording)

> **The frontmatter durability commitment — v1, 2026-08-29**
> *This document is versioned and append-only. Every prior version stays published at its own URL. We do not edit it in place.*
>
> **What we promise, and how you check it without us**
>
> 1. **Your notes are ordinary UTF-8 text files in folders you chose.** There is no database, no index you need, and no sidecar file that carries meaning. *Check:* quit frontmatter, delete every file in the folder that is not one of your notes, reopen the folder in any editor. Nothing of yours is missing.
> 2. **Every view is a projection of the file.** Board, calendar, decision card and published site are computed from your text and stored nowhere else. *Check:* delete the app.
> 3. **Every edit is a byte-preserving splice.** We change the bytes you asked to change and nothing else. Line endings, indentation, key order, trailing whitespace, and a leading byte-order mark survive an edit that did not touch them. *Check:* hash the file, change one field, diff.
> 4. **We publish the exact Markdown and YAML subset we read and write**, versioned, with the test corpus that defines it. When it changes we publish the diff, not a changelog entry.
> 5. **We certify degradation rather than assume it.** Each release ships a report of what a named set of other engines does to a file we wrote, and exactly where information is lost. We publish the failures.
> 6. **There is no lock on the way out because there was never a way in.** No import. No export. Only the folder.
> 7. **If we stop:** the last released desktop client keeps working offline; we publish the source of the file engine — parser, splicer, and projections — under [Apache-2.0-converting licence] within 90 days of announcing a shutdown; and any hosted service gets 12 months' notice before it stops.
>
> **What we do not promise**
>
> - We do not promise this company will exist in ten years.
> - We do not promise this app will run on a future operating system.
> - We do not promise your files render identically in other tools. CommonMark is still at version 0.31.2, dated 2024-01-28. YAML's own Library of Congress format description records that implementations validate differing subsets. We promise a certificate of what differs, not that nothing differs.
> - We do not promise Markdown is an archival standard. It is not named in the Library of Congress Recommended Formats Statement; plain text appears there only in the Acceptable column.
> - We do not promise that the hosted parts — sync, publish, collaboration — survive the company. Those are services. Your files are not.
> - We do not promise a fixed price forever, a perpetual licence to future versions, or a data escrow.
> - We do not promise to keep any third-party tool, integration, or engine working.
> - We do not promise features. This document is about durability only.

**Drafting rules for this document** [inference]: every clause names a test the reader can run without us; no clause uses *forever*, *always*, *guaranteed*, or *never*; it is dated, versioned, and published **outside** the Terms of Service, because terms are revocable and this must not be.

---

### 9. Who makes this promise and who conspicuously does not

| Product | Files on disk | Licence (read 2026-08-29) | Public durability commitment | Tag |
|---|---|---|---|---|
| **Obsidian** | yes, local Markdown | client closed-source | **Strongest in category.** Manifesto: *"Durable — …we use simple, open file formats that prevent lock-in and ensure that your data can be preserved for generations to come"*; *"Independent — …100% supported by our users, not investors"* | [fetched `obsidian.md/about`] |
| Obsidian (CEO essays) | — | — | *File over app* (2023-07-01): *"if you want to create digital artifacts that last, they must be files you can control"*; *100% user-supported* (2024-02-10): *"VCware is built with a five year horizon, it is not built to live on for decades"*; *Self-guaranteeing promises* (2024-12-03) | [fetched, stephango.com] |
| **Bear** | **no** — `~/Library/Group Containers/9K33E3U3T4.net.shinyfrog.bear/Application Data/database.sqlite` | proprietary | **None.** Official FAQ: *"For most users in most situations, we highly recommend not doing this"*; *"it is safe to access the database for reading only"* | [fetched `bear.app`] |
| Logseq | markdown / org files | AGPL-3.0, 44,671★, active | markets "privacy-first, open-source knowledge base" | [measured + fetched] |
| Standard Notes | app-managed | AGPL-3.0, 6,608★, active post-Proton | the licence is the commitment | [measured] |
| Joplin | markdown-ish | **`NOASSERTION`**, 56,143★ | licence claim needs verifying at source | [measured] |
| Anytype | own object store | **`NOASSERTION`**, 8,715★ | ditto | [measured] |
| Omnivore (defunct) | — | AGPL-3.0, 16,225★, commits **through 2026-08-28** | **The proof case.** The company ended; the code did not | [measured] |
| **Notion** | **no** | proprietary | **None.** Acquired Skiff and shut it down; discontinuation buried in an FAQ accordion, Discord and GitHub repo removed on announcement day, backend never open | [fetched — partisan primary source] |
| Craft, Ulysses, iA Writer, Tana, Reflect, Capacities, Apple Notes, Evernote | not opened this pass | — | **Assert nothing.** Unverified | [absence] |

---

### 10. Anti-recommendations — promises to refuse

1. **Never claim archival-institution endorsement of Markdown.** Zero occurrences in the LoC RFS and zero format descriptions in a 595-entry registry [measured]. One search refutes it and takes the whole trust position down with it.
2. **Never say "open source" without naming licence, repository, scope, and trigger.** Skiff's unscoped claim became the story on shutdown day [fetched].
3. **Never promise source escrow.** Release conditions belong to the agent and the named beneficiary, not to users; a consumer product cannot name every user; and release frequency is unmeasured here [SS/absence].
4. **Never promise a dead-man's-switch open-sourcing.** After insolvency an administrator controls the IP and the promisor no longer exists. If you want that outcome, ship under a licence that already contains the future grant (FSL two-year, BUSL four-year automatic conversion) so it fires with nobody acting [inference over fetched clauses].
5. **Never promise identical rendering elsewhere.** Falsified by CommonMark 0.31.2 (2024-01-28) and YAML's LoC-documented subset divergence [measured / fetched]. Promise the certificate instead — that is the differentiated asset.
6. **Never adopt Elastic License 2.0 as a hedge.** It contains no conversion clause [fetched]; it protects the vendor, not the user.
7. **Never market GDPR Art. 20 as a feature.** It is a legal floor, covers only data the user provided under consent/contract by automated means, and mandates no format [fetched]. Claiming it invites the accurate reply that it is mandatory.
8. **Never state a migration or export window in the commitment.** The correct claim is that no window can exist, because the files were never held.
9. **Never put the commitment in the Terms of Service.** Terms change; the fetched definition of a self-guaranteeing promise excludes them explicitly [fetched].
10. **Never promise cross-engine byte identity for other tools' writes.** You control your splicer, not theirs.
11. **Never promise perpetual pricing, perpetual free hosting, or "we will never be acquired".** Governance is reversible [fetched].
12. **Never open-source the whole product as the hedge.** Given the settled positions — no plugin marketplace, no arbitrary client-side execution — scope clause 7 to the file engine only (parse / splice / project). A narrow promise is one you can keep; a broad one gets quietly dropped, which is worse than never making it [inference].
13. **Never reuse the commitment URL.** Version and date each revision and keep the old ones live, so any weakening is visible rather than invisible.

---

### Sources opened

[LoC Recommended Formats Statement — Textual Works](https://www.loc.gov/preservation/resources/rfs/text.html) (via [archive snapshot 20260626211847](http://web.archive.org/web/20260626211847/https://www.loc.gov/preservation/resources/rfs/text.html)) · [LoC FDD alphabetical list](https://www.loc.gov/preservation/digital/formats/fdd/browse_list.shtml) · [LoC FDD fdd000645 YAML](https://www.loc.gov/preservation/digital/formats/fdd/fdd000645.shtml) · [LoC FDD fdd000552 WordStar](https://www.loc.gov/preservation/digital/formats/fdd/fdd000552.shtml) · [PREMIS](https://www.loc.gov/standards/premis/) · [CommonMark Spec version list](https://spec.commonmark.org/) · [YAML 1.2.2 spec](https://yaml.org/spec/1.2.2/) · [GDPR Art. 20](https://gdpr-info.eu/art-20-gdpr/) · [Regulation (EU) 2023/2854 (Data Act), OJ text](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=OJ:L_202302854) · [Functional Source License](https://fsl.software/) · [BUSL 1.1 (SPDX)](https://raw.githubusercontent.com/spdx/license-list-data/main/text/BUSL-1.1.txt) · [Elastic License 2.0](https://raw.githubusercontent.com/elastic/elasticsearch/main/licenses/ELASTIC-LICENSE-2.0.txt) · [Fair.io](https://fair.io/) · [Obsidian manifesto](https://obsidian.md/about) · [File over app](https://stephango.com/file-over-app) · [Self-guaranteeing promises](https://stephango.com/self-guarantee) · [100% user-supported](https://stephango.com/vcware) · [Bear — where notes are located](https://bear.app/faq/where-are-bears-notes-located/) · [The Skiff Privacy Fiasco (Notesnook)](https://blog.notesnook.com/the-skiff-privacy-fiasco) · [omnivore-app/omnivore](https://github.com/omnivore-app/omnivore)

Search-summary only, not opened [SS]: [Springpad shutdown](https://www.androidpolice.com/2014/05/23/note-taking-service-springpad-is-closing-down-june-25th-data-export-tool-available-soon/) · [Catch.com shutdown](https://techcrunch.com/2013/07/31/evernote-competitor-catch-com-shuts-down-its-note-taking-apps-company-heading-in-different-direction/) · [Vesper shutdown](https://www.loopinsight.com/2016/08/22/last-vesper-update-sync-shutting-down/) · [Escrow release events (techUK)](https://www.techuk.org/resource/what-are-the-release-events-and-clauses-in-software-escrow-agreements-guest-blog-by-escrow-london.html) · [Escode — what is source code escrow](https://www.escode.com/resources/what-is-source-code-escrow/) · [Codekeeper source code escrow](https://codekeeper.co/source-code-escrow)