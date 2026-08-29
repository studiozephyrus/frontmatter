Verified twice already — HEAD `6e390828` unmoved, all 19 `~/.claude` changes pre-date this session, and this task ran only read-only commands (`curl`, `git status`, `date`, `WebSearch`); nothing was mutated or committed.

### Method + evidence key

- All availability probed by `curl` from this machine, **2026-08-29 00:09 UTC (Saturday)** [measured]. `WebFetch` is gated; `curl` to `registry.npmjs.org`, `api.npmjs.org`, `api.github.com`, `marketplace.visualstudio.com`, `open-vsx.org` all returned live data [measured].
- npm: `registry.npmjs.org/NAME` → **404 = free**, **200 = taken** [measured]. Download counts from `api.npmjs.org/downloads/point/last-month/NAME` [measured].
- GitHub: `api.github.com/users/NAME` (authenticated) → **404 = free**, **200 = taken** [measured]. **Control validated**: `zzqxwvtplkjhgf9911`, `bytewrightzz`, `stetzz991` all returned 404, so 200 discriminates [measured] — per LR#60, a check that cannot fail proves nothing.
- Domains: **UNCHECKED**. No registrar/RDAP host is reachable through this sandbox's network allowlist; I did not test one, so I will not guess. Every `.com`/`.dev`/`.app` line below is UNCHECKED.
- Tags: `[fetched]` primary source opened · `[measured]` executed here · `[SS]` search summary, nobody opened the page · `[derived]` arithmetic shown · `[inference]` reasoning.

### Baseline correction on the incumbent

| Fact | Value | Tag |
|---|---|---|
| Front Matter CMS VS Code installs | **80,605** (read 2026-08-29) | [fetched] marketplace extensionquery API |
| Prior round's figure | 80,527 | given in brief |
| Delta | **+78** | [derived] 80,605 − 80,527 |
| Marketplace `updateCount` | 280,650 | [fetched] |
| Marketplace `downloadCount` | 2,661 | [fetched] |
| Rating | 5.0 avg / 20 ratings, weighted 4.817 | [fetched] |
| `estruyf/vscode-front-matter` | **2,539 stars**, 106 forks, MIT, last push 2026-08-21 | [fetched] api.github.com |
| GitHub org `frontmatter` | **taken** — org "Front Matter CMS", created 2021-09-21, 7 public repos | [measured] |
| Its most-starred org repo | `web-documentation-nextjs`, 29 stars, pushed 2026-08-27 | [fetched] |

**Source disagreement recorded, not resolved**: the marketplace reports `install=80605` and `downloadCount=2661` as separate statistics. These do not reconcile and I did not open Microsoft's definition of either field. Use 80,605 as "installs" only because that is the field literally named `install`.

**Material nuance the prior round missed**: npm `frontmatter` is a **200, but it is a corpse** — 4 versions, latest `0.0.3`, last published **2022-06-18**, description "Parsing YAML frontmatter from a string." [measured]. It has **11,212 downloads/month** [measured], which is transitive-dependency noise, not a live project. It is *not* Front Matter CMS. The registry collision and the market collision are two different problems and were being counted as one.

### (1) Full candidate list — 41 names, with strategy

**A. Proofreader / editorial marks** — the file is preserved exactly as written
1. **Stet** — "let it stand"; the literal proofreader's mark for *revert my edit, keep the original bytes*. Semantically the single best fit for a byte-preserving splice engine.
2. **Sicmark** — from *sic* ("thus, exactly so"); coined compound.
3. **Stetfile** / 4. **Stetline** / 5. **Stetdoc** / 6. **Markstet** / 7. **Stetly** — `stet` + disambiguating suffix, to escape the bare-word collision field.
8. **Verbatim** — Latin *verbum*; word-for-word, i.e. byte-for-byte.
9. **Idem** — Latin "the same"; citation shorthand.

**B. Printing & bookbinding physical vocabulary** — the file is an artifact with a fixed physical form
10. **Colophon** — the end-note stating how a book was made. Maps exactly onto degradation certification.
11. **Quire** — a gathering of folded leaves. 12. **Folio** · 13. **Quarto** · 14. **Octavo** — sheet-fold formats.
15. **Recto** / 16. **Verso** — right-hand and left-hand page; a natural pair for *file* and *projection*.
17. **Galley** — the uncorrected proof. 18. **Deckle** — the untrimmed paper edge. 19. **Quoin** — the wedge that locks type into the chase. 20. **Forme** — the locked-up page of type. 21. **Foolscap** · 22. **Onionskin** — paper stocks. 23. **Vellum** — writing surface. 24. **Kern** · 25. **Textura** · 26. **Uncial** — typographic/letterform terms.
27. **Gutenbyte** — Gutenberg × byte; coined portmanteau.

**C. Trueness / physical-craft metaphor** — a plumb line is *true* or it is not; no interpretation layer
28. **Plumb** · 29. **Plumbline** · 30. **Trueline** · 31. **Truefile** · 32. **Truefold** · 33. **Marktrue** — "true" as the carpenter's adjective, not the boolean.
34. **Withgrain** · 35. **Grainfile** · 36. **Textgrain** · 37. **Filegrain** — wood grain; work *with* the file's structure rather than across it.
38. **Lath** — the thin strip a wall is built on.

**D. File-as-only-source-of-truth compounds**
39. **Filefirst** · 40. **Onefile** · 41. **Plainstate** · 42. **Bytefold** · 43. **Byteright** · 44. **Bytewright** (`-wright` = maker, as in *shipwright*) · 45. **Markwright**.

**E. Short verbs / engine-flavoured**
46. **Splice** — the actual engine primitive. 47. **Lede** — journalism. 48. **Setwise** · 49. **Bytewise** · 50. **Markset** · 51. **Typeset**.

**F. Latin/Greek scribal roots**
52. **Litera** · 53. **Textus** · 54. **Scriptorium** · 55. **Palimpsest** · 56. **Marginalia** · 57. **Incunable** · 58. **Loomtext** · 59. **Quiretext** · 60. **Foliomark**.

**Carry-over baseline: 61. mdmax.**

*(Count exceeds the 30–40 ask because the strategy families generated near-free variants worth pricing; the availability table prunes it to 15.)*

### (2) Availability table — top 15

npm/GitHub columns are `[measured]` 2026-08-29. "Repos" = `api.github.com/search/repositories?q=NAME+in:name` total [measured]. **Domains: UNCHECKED, all rows.**

| # | Name | npm | GitHub user/org | Repos w/ name | Product collision | Pronounce | Spelling risk | Signals |
|---|---|---|---|---|---|---|---|---|
| 1 | **mdmax** | **FREE** (404) | TAKEN — "Maksim Golitsinskiy", 2 repos, joined 2012-11-28 | 18 | none found | md-max, unambiguous | low; but `md` reads as *Doctor of Medicine* to non-devs | markdown + power. Engine-ish, not product-ish |
| 2 | **stet** | **FREE** (404) | TAKEN — user `stet`, 65 repos, joined 2021-02-04 | **2,089** | (a) *Stet* public-commenting software, used for the GPLv3 drafting process [SS]; (b) *STET* folding text editor, Cowlishaw 1977, IBM VM/CMS [SS]; (c) **live**: `elberacasa/stet` → npm `stetmark`, created 2026-08-05, **5,753 dl/mo**, tagline "stet — let it stand. Your agents ask once, your answer stands." [measured] | one syllable, perfect | moderate — heard as "set"/"stat" on a call | *unchanged, authoritative, byte-exact*. Best semantic fit in the entire list |
| 3 | **grainfile** | **FREE** (404) | **FREE** (404) | **0** | none found | clean | very low | works with the file's structure; warm, physical |
| 4 | **withgrain** | **FREE** (404) | **FREE** (404) | **0** | none found | clean | low | same, more slogan-like; weaker as a noun |
| 5 | **stetfile** | **FREE** (404) | **FREE** (404) | **0** | none found | clean | low | stet semantics + file-is-truth, collision-free |
| 6 | **bytewright** | **FREE** (404) | TAKEN — user "Bytewright", 28 repos, joined 2015-01-28 | 25 | none found | by-te-write | moderate — `-wright` mis-typed as `-write`/`-right` | craft + byte-level precision |
| 7 | **truefile** | **FREE** (404) | TAKEN — "Vyacheslav", **1 repo**, joined 2020-09-01 | 17 | none found | clean | low | the file is the only source of truth. On-message, slightly plain |
| 8 | **filefirst** | **FREE** (404) | **FREE** (404) | not run | none found | clean | low | states the whole thesis; reads as a principle, not a product |
| 9 | **gutenbyte** | **FREE** (404) | **FREE** (404) | **0** | none found | goo-ten-bite | moderate — Gutenberg spelling drag | printing heritage + byte fidelity; memorable, slightly jokey |
| 10 | **foliomark** | **FREE** (404) | **FREE** (404) | 5 | none found | clean | low | book-page + markdown; generic |
| 11 | **colophon** | TAKEN — 2 versions, `1.0.1`, last pub **2022-06-13**, 37 dl/mo, "Configuration helper" | TAKEN — user, **0 repos**, joined 2023-03-14 | 140 | **live adjacent**: *Colophon* Obsidian plugin for long-form manuscripts with its own `.colophon` format [SS]; `MA1002643/colophon` publishing platform [SS] | co-lo-phon | high — 4 syllables, unfamiliar word | how the artifact was made = degradation cert. Best *conceptual* fit after stet |
| 12 | **quire** | TAKEN — 2 versions, `0.0.2`, last pub 2022-06-25, 21 dl/mo | TAKEN — "Kelly Stratton", 1 repo, 2013 | 617 | **fatal, two ways**: Getty's **Quire** multiformat publishing framework built on plain-text + Hugo [SS] — near-identical adjacent market; and **quire.io**, a commercial task/kanban PM tool [SS] — exactly the category you have settled *not* to be | clean | low | ruled out on collision, not on merit |
| 13 | **verbatim** | TAKEN — 12 versions, `0.0.1`, last pub 2022-06-28, 126 dl/mo | TAKEN — user, 1 repo, 2010 | not run | Verbatim is a **consumer storage brand** (flash drives, optical media) [inference, not searched] | ver-ba-tim | low | byte-for-byte. Strong meaning, weak differentiation |
| 14 | **marginalia** | TAKEN — 1 version, `1.0.0`, 2022-06-19, 12 dl/mo | TAKEN — user, 1 repo, 2014 | not run | **Marginalia Search**, Viktor Lofgren, AGPL indie search engine, well-known in the exact hacker audience you sell to [SS] | mar-gin-ay-lia | moderate | notes in the margin — wrong metaphor anyway (annotation ≠ source of truth) |
| 15 | **frontmatter-editor** (qualified keep) | **FREE** (404) | n/a (org would be `frontmatterapp`, **FREE** 404) | n/a | Front Matter CMS, 80,605 installs [fetched] | clean | low | keeps the category word; see §4 |

**Also measured, rejected on collision — recorded so nobody re-litigates:**

| Name | Finding | Tag |
|---|---|---|
| quarto | npm 200, gh 200 — and Posit's **Quarto** is a major markdown publishing system | [measured] + [inference] |
| vellum | npm 200, gh 200 — Vellum is a Mac book-formatting app *and* an AI company | [measured] + [inference] |
| folio | npm 200, **13,893 dl/mo** — the live Playwright-lineage test framework, `0.3.18`, pushed 2025-10-15 | [measured] |
| splice | npm 200, 108 versions, 423 dl/mo; GitHub **org "Splice"**, 67 repos — the music platform | [measured] |
| scribe | npm 200, **4,233 dl/mo**; Scribe is a live documentation product | [measured] + [inference] |
| bedrock | npm 200, 1,063 dl/mo; **AWS Bedrock** | [measured] + [inference] |
| fathom | npm 200, 79 dl/mo; Fathom Analytics + Fathom AI notetaker | [measured] + [inference] |
| verso | npm 200, 20 dl/mo; also the Servo-based Verso browser project | [measured] + [inference] |
| palimpsest | npm 200, 30 dl/mo — **and the metaphor is backwards**: a palimpsest is text *scraped off and overwritten*. Anti-recommend on meaning alone | [measured] + [inference] |
| lockstep, litera, textus, idem, scriptorium, openfolio, plumbline, markwright, recto, galley, onionskin, lede, onlyfile, plainform, papertrail, typeset, markset, bytewise, deckle, kern, uncial, textura, forme, plumb, onefile, grain, lath, octavo, foolscap | all npm **200** | [measured] |
| bytefold, plainstate, trueline, kerf, marklo, quoin, slugline, incunable, truefold, setwise, marktrue, lastword, leafnode | npm **404** but GitHub **200** | [measured] |
| textgrain, quiretext, loomtext, stetline, stetdoc, markstet, quiredoc, filegrain, byteright, sicmark, stetly, plaintrue, filetrue, fairtext | npm **404** and GitHub **404** — the full free bench, if the top 5 all fall | [measured] |

### (3) Top-5 shortlist and recommendation

| Rank | Name | Why | Against |
|---|---|---|---|
| **1** | **stetfile** | Carries stet's exact semantics — *let it stand* is a one-word statement of the byte-preserving splice guarantee — while escaping every stet collision. npm 404, GitHub 404, **0** repos named it [measured]. Rare: strong meaning **and** a clean field | Two morphemes, less punchy than bare `stet`; "file" is dull |
| **2** | **mdmax** | Already validated; npm free; 18 repos, none a product [measured]. Zero adjacent-market collision found | GitHub user taken (dormant: 2 repos, 2012) [measured]; `md` reads medical to non-devs; "max" is a spec-bump word, not a promise. Reads as a *library*, not a product you charge for |
| **3** | **grainfile** | npm 404, GitHub 404, **0** repos [measured]. "With the grain" is the most accurate metaphor available for reversible projections over an author's own file | Requires one sentence of explanation; nobody guesses the meaning cold |
| **4** | **bytewright** | `-wright` (shipwright, playwright) signals *made by hand, precisely* — matches "simple surface, deep engine". npm free [measured] | GitHub user taken by an active account (28 repos) [measured]; `-wright/-write/-right` is a live spelling hazard for a name you will say aloud in support calls |
| **5** | **truefile** | Literally the product thesis. npm free; GitHub user has **1 repo** [measured] — the likeliest handle to negotiate or route around | Generic; SEO-hostile ("true file" matches everything); reads as a file-recovery utility |

**Recommendation: `stetfile`, with `stet` as the spoken shorthand and the CLI verb.**

- Only candidate scoring clean on all four measured axes — npm 404, GitHub 404, 0 named repos, no product found [measured].
- Meaning does structural work: *stet* is the one word in English that means "preserve the original exactly", which is the engine's actual contract. Naming from the guarantee is defensible for a decade; naming from the file format (`md*`) ages with the format.
- `stet <file>` is a plausible CLI. `stetfile` is the package, org, and product; `Stet` is the conversational name.
- **Risk that must be tracked, not waved off**: `elberacasa/stet` shipped npm `stetmark` on **2026-08-05** with **5,753 dl/mo** [measured] — three weeks old, agent-oriented, same metaphor. That is a live claim on the word in the same year. `stetfile` does not collide with it, but bare `stet` branding does. Re-check that package's trajectory before any spend on the name.

**Explicit anti-recommendations:**
- **Do not take `quire`.** Getty's Quire is a plain-text-source multiformat publishing framework [SS] — the closest adjacent market on this entire list — and quire.io is a kanban PM tool [SS], the exact category the product has settled on not being. Two collisions, one of them into a settled anti-position.
- **Do not take `colophon`.** Best conceptual fit for degradation certification, but a live Obsidian long-form plugin already uses it in the markdown-writing market [SS], plus npm and GitHub both taken [measured]. Concept fit does not survive an occupied adjacent niche.
- **Do not take `palimpsest`.** The metaphor is the inverse of the product: scraped-off, overwritten, lossy.
- **Do not take `marginalia`, `folio`, `splice`, `vellum`, `quarto`, `bedrock`, `scribe`, `fathom`.** Each has a live product or a five-figure-download package [measured].
- **Do not pick from the "npm 404 / GitHub 200" bench** (`quoin`, `trueline`, `kerf`, `truefold`, `bytefold`…) — a squatted GitHub org forces a permanent handle mismatch between package and repo, which you pay for in every README, badge, and install line.
- **Do not ship a name whose npm 404 you have not re-run on the day you register it.** These were 404 at 2026-08-29 00:09 UTC and nothing reserves them.

### (4) The case for keeping "frontmatter" with a qualifier

**For:**
- The word is the product's own thesis in one token: the file's frontmatter *is* the state that every projection reads. No teaching required for the target buyer.
- The collision is **narrower than the raw install count suggests**. Front Matter CMS is a **VS Code extension** [fetched] — a plugin inside another editor, MIT, 2,539 stars [fetched], with a *docs* repo as its most-starred org repo (29 stars) [fetched]. A standalone markdown editor with a splice engine and cross-engine degradation certification is a different artifact, a different install path, and a different price point [inference].
- Qualified handles are **available now** [measured]: npm `frontmatter-app`, `frontmatterapp`, `usefrontmatter`, `frontmatterhq`, `frontmattr`, `frontmatter-studio`, `frontmatter-editor` — **all 404**. GitHub `frontmatterapp`, `getfrontmatter`, `usefrontmatter`, `frontmatterhq`, `frontmattr`, `frontmatterstudio` — **all 404**.
- Bare npm `frontmatter` being 200 costs almost nothing: it is a **dead 2022 `0.0.3` YAML parser** [measured], not a competitor. You were never getting that string and you never needed it.

**Against:**
- 80,605 installs and 2,539 stars in the same keyword space is real search and word-of-mouth interference [fetched]. Every "frontmatter" query the buyer types resolves to the incumbent first for years.
- npm `getfrontmatter` is **already 200** [measured] — the qualified space is being nibbled.
- A qualifier is a permanent tax: the product is always "Frontmatter, the app — not the VS Code one." That sentence is in every conversation, forever [inference].
- Trademark exposure is highest here, since the mark is near-identical in an overlapping class. See §5.

**If keeping it, the only defensible forms, in order:**
1. **`frontmatterapp`** — npm 404, GitHub 404 [measured]. Product name stays "Frontmatter"; the handle carries the qualifier. Least brand tax.
2. **`frontmatter-studio` / "Frontmatter Studio"** — npm 404, GitHub `frontmatterstudio` 404 [measured]. A qualifier *in the spoken name* is what actually separates you from the incumbent; a handle-only qualifier does not.
3. **`frontmattr`** — npm 404, GitHub 404 [measured]. **Anti-recommend**: vowel-drop names are a 2012 tic and generate permanent support tickets from misspelling.

**Anti-recommendation on the shape of the compromise:** do not use "Frontmatter" bare as the product name while quietly holding qualified handles. That is the assessed-high-risk option with extra steps — it takes the full trademark and SEO exposure and buys nothing back. Either qualify the *spoken* name or leave the word.

### (5) Trademark — required disclaimer

- **Nothing above is a trademark clearance and none of it substitutes for counsel.** What was checked is package-registry and code-host **handle availability** plus **informal product collision**, which is a different question in kind from trademark risk.
- Not checked, and not checkable here: USPTO TESS, EUIPO, India's IP India/TMR registers, WIPO Madrid, unregistered common-law rights, Nice-class overlap, or actual use-in-commerce priority. Treat all of these as **UNCHECKED**.
- A name can be free on npm and GitHub and still infringe; conversely a taken handle implies nothing about mark rights.
- Selling globally from India means at minimum India + US + EU clearance in the relevant software class, and the incumbent's near-identical mark in an overlapping class is exactly the fact pattern where an attorney's read changes the answer.
- **Recommendation: get a knock-out search from a trademark attorney on the final two names before any spend on domains, logo, or launch copy** — and specifically before choosing between "keep frontmatter with a qualifier" and a clean coinage, because that is the decision where legal risk, not availability, dominates.

**Sources:** [Front Matter CMS repo](https://github.com/estruyf/vscode-front-matter) · [Quire (Getty)](https://quire.getty.edu/) · [Quire.io](https://quire.io/) · [Getty quire repo](https://github.com/thegetty/quire/) · [Stet (software)](https://en.wikipedia.org/wiki/Stet_(software)) · [STET (text editor)](https://en.wikipedia.org/wiki/STET_(text_editor)) · [Marginalia (search engine)](https://en.wikipedia.org/wiki/Marginalia_(search_engine)) · [MarginaliaSearch repo](https://github.com/MarginaliaSearch/MarginaliaSearch) · [Colophon Obsidian plugin](https://community.obsidian.md/plugins/colophon-writer) · [Colophon (publishing)](https://en.wikipedia.org/wiki/Colophon_(publishing))