# Research briefing for the frontmatter decision set — 2026-09-09

Nine lenses ran today. The coordinator opened a subset personally and refuted two claims. Where
the VERIFIED file and a lens disagree, **the VERIFIED file wins** and the line says so. Tags are
the raw file's own and must not be upgraded.

---

## 1. The five things that changed today

**1. Almanac shipped frontmatter's whole feature sentence, raised $45M, and switched off.**
Read Receipts, Version Control Mode, Layers, Approvals, Doc History diffing and scheduled
deprecation reviews are still listed on the live site (https://get.almanac.io/) `[opened]`. $9M
seed plus a $34M Series A led by Tiger Global in September 2021; 7-figure ARR; 50+ staff
(https://saasclub.io/podcast/almanac-adam-nathan-364/) `[opened]` — a podcast summary, not the
founder's writing. Shut down 2025-01-31, cause stated as capacity, not demand: the team's own AI
content product grew to "tens of thousands of users in a matter of months" and consumed them
(https://get.almanac.io/go-forward) `[opened]`. Kortex died the same way. **Forces:** the
read-receipt half of the headline has a $45M corpse. Name it first, or hear it as an objection.

**2. The attention literature says an "18% unreviewed" surface produces dismissal, not review.**
Cisco/SmartBear: no review above 250 lines beat 37 defects/kLOC; above 450 LOC/hour, defect
density was below average in 87% of cases; sessions should stay under 60 minutes
(https://static1.smartbear.co/support/media/resources/cc/book/code-review-cisco-case-study.pdf)
`[opened]`. Google measured a 3.2 h/week review budget and a 24-line median change
(https://sback.it/publications/icse2018seip.pdf) `[opened]`. Clinical alerting is the mature
version: 55–98% override across 34 studies (https://pubmed.ncbi.nlm.nih.gov/35673040/); 86.6% of
14,612 alerts overridden with 88.3% of typed justifications meaningless
(https://pubmed.ncbi.nlm.nih.gov/38658357/); the one system that earned acceptance fired 31 rules
in 0.19% of 500,274 sessions (https://pubmed.ncbi.nlm.nih.gov/34450669/) — all `[opened]`.
Against this repo's own 4,446,724 markdown words, 18% is 55.6 hours at 240 wpm: 17.4 weeks of one
engineer's review budget `[inferred]`. Four dead precedents sit underneath — Codebrag, JetBrains
Upsource (end of sales 2022-02-01, citing "a gradual industry trend of moving away from
standalone code review tools"), SpaceCode and Swimm `[opened]`. **Forces:** suppression, not
enumeration.

**3. Nine weeks of platform absorption took three of four claims.** Notion shipped per-change
agent-edit approval on 2026-08-28 (https://www.notion.com/releases) `[opened]`. Claude Code
shipped an auto-opening working-tree diff panel in v2.1.260, published 2026-09-03T23:48:12Z
(https://raw.githubusercontent.com/anthropics/claude-code/main/CHANGELOG.md) `[opened]`. Google
Antigravity shipped an Agent Edits / Uncommitted / Branch pane on 2026-08-24
(https://antigravity.google/blog/vcs-and-terminal) `[opened]`. Codex's review pane already covers
the whole git tree `[opened]`. Below them, free OSS: human-review went 0 → 1,241 stars in six
weeks (https://api.github.com/repos/petergyang/human-review) `[opened]`, and 501 repos match
"agent diff review" created since 2026-05-01 `[opened]`. **Forces:** "see what the agent changed"
cannot be the headline; anyone in the room refutes it by opening their editor.

**4. VS Code merged a review/unreview operation and a markdown feedback editor, and documented
neither.** PR #324218, "Agents - add review/unreview operation to the multi-file diff editor",
milestone 1.128.0, created and closed 2026-07-03; issues #326539 and #326540, markdown feedback
in the Agents window, milestone 1.130.0, 2026-07-19 → 20, behind
`workbench.editor.markdownDefaultEditorInAgentsWindow`. Verified via api.github.com `[opened]`.
**My VERIFIED file overrides lens 3 here:** the live docs page (9,516 characters, footer 9/2/2026)
has zero occurrences of "reviewed state", "clears if", "markdown", "locked mode" or
"attribution", so the lens's "free, default-on, tens of millions" framing is wrong. Microsoft
built it, gated it in an experimental window, and told nobody. **Forces:** read it as intent, not
as a shipped competitor — and note that whether the state survives outside the editor is the
differentiation axis, and nothing opened answers it.

**5. Zed Delta is a purpose-built competitor with the same thesis and the opposite architecture.**
Private beta 2026-08-12 on DeltaDB, comments anchored to spans that survive edits; 679 HN points
on launch, 529 on DeltaDB, 319 on "Software Is Made Between Commits" `[opened]`. The 2026-09-01
post commits to attribution "down to the span" and stakes it on CRDTs
(https://zed.dev/blog/agentic-xanadu) `[opened]`. **Forces:** Delta joins the competitive set,
and "never a CRDT" needs a written rebuttal naming Zed — a team with ten years of CRDT work
reached the opposite conclusion in public.

---

## 2. What is now table stakes

- **Working-tree diff of agent changes** — free in four places: Claude Code v2.1.260 (2026-09-03,
  opens itself at ≥144 columns, three scopes, no reviewed marker), Antigravity (2026-08-24),
  Codex, VS Code's Agents window. All `[opened]`.
- **Per-file reviewed/unreviewed marker** — VS Code, merged 2026-07-03, milestone 1.128.0.
  Gated: Agents window, experimental, undocumented `[opened]`.
- **Markdown-specific agent review surface** — VS Code milestone 1.130.0, 2026-07-19/20, setting
  on by default per the issue body, same gating `[opened]`.
- **Per-change agent-edit approval** — Notion, 2026-08-28 `[opened]`.
- **Markdown agent review as a free skill** — human-review, 1,241 stars in six weeks `[opened]`.
- **Word-level prose diff** — free in git since 2006-08-10 `[opened]`.
- **Git-backed markdown editing** — Pages CMS, MIT, 3,976 stars, no paid tier; its inline
  Comments feature is still listed as "Soon" (https://pagescms.org/) `[opened]`.
- **Dictation** — Apple gave every app on-device speech-to-text in iOS/macOS 26 `[opened]`.
- **Accessibility** — Notion high contrast 2026-07-30; Obsidian RTL and system text scaling in
  1.14.x `[opened]`.
- **Database views over YAML frontmatter** — Obsidian Bases is core; kanban since 2026-09-02
  `[opened]`.

---

## 3. What is still open

- **Attribution of which spans an agent wrote.** No platform shipped it; the only implementation
  found is a VS Code extension with 88 installs `[opened]`. iA Writer 8 ships authorship marking,
  but for pasted-versus-typed text in a personal document — and the earlier demotion of this
  claim rested on iA Writer, so that demotion should be reopened.
- **Review state durable outside one editor.** Whether VS Code's marker survives a machine change
  is unresolved in the VERIFIED file. Per-span rather than per-file, stored in the repository
  rather than editor workspace state, is the only version nothing observed reaches.
- **Cursor is not in this race.** Coordinator-opened: its answer to agent output volume is Agent
  Review and Bugbot — another agent reviews it. Its own learn page returns zero for "mark as
  reviewed", "viewed", "markdown", "attribution", "per-span" and "unreviewed" `[opened]`. The
  most-cited comparison in the space leaves the human ledger unoccupied.
- **The review shelf is empty where it should be full.** In Obsidian, agent-writing plugins total
  2.04M cumulative downloads against the best diff plugin at 51,806 and the only review-shaped
  plugin at 6,961 — roughly 40:1 `[inferred]`. Core shipped zero mentions of AI, agent, MCP,
  Claude, diff or review across 20 releases `[inferred]`. 7,425 plugins have not filled the gap,
  which is either the opening or the warning.
- **Sub-word granularity.** Nobody in the 30-year redlining category sells below word level
  `[opened]`, so byte-exact splicing sits under the category floor, unwanted by any trained buyer.
- **Evidence on reviewing AI-written prose.** None exists; every attention finding is transferred
  from code review, clinical alerting or fact-checking.

**Which claims survive.** "See what the agent changed with no PR" — not as a differentiator.
"Know what nobody has reviewed" — only per-span, durable in the repository, across machines,
scoped to agent-authored changes; the general-document form is Almanac's and is dead. "Which text
the agent wrote" — survives, the only unoccupied claim of the four. "Byte-exact, refuses rather
than guesses" — survives, sellable only as its consequence. "$4–5 team tier" — does not survive;
the barbell has no observed middle.

---

## 4. Numbers you may use

The only figures permitted in a diagram or on a slide. All from opened sources.

| Figure | Source |
|---|---|
| Draftable $129/user/yr Business, $261/user/yr Legal; "1,300 law firms"; no Mac client | https://draftable.com/pricing |
| Diffchecker $15 / $20 / $40 per user/month | https://www.diffchecker.com/pricing/ |
| Litera $16M → ~$250M revenue, 15,000+ customers, 99% of Am Law 100 (self-claim) | https://www.litera.com/our-story |
| Almanac shut down 2025-01-31; cause stated as capacity | https://get.almanac.io/go-forward |
| Almanac $34M Series A, Tiger Global, September 2021 | https://www.thesaasnews.com/news/almanac-raises-34-million-in-series-a/ |
| Almanac $45M total, 7-figure ARR, 50+ staff (secondary summary) | https://saasclub.io/podcast/almanac-adam-nathan-364/ |
| Almanac's 2020 "GitHub for Docs" Show HN: 6 points, no comments | https://hn.algolia.com/api/v1/items/23339147 |
| claude-code#33932 open since 2026-03-13: 266 reactions (189 up), 35 comments | https://api.github.com/repos/anthropics/claude-code/issues/33932 |
| claude-code#31888 open since 2026-03-07: 52 reactions, 19 comments | https://api.github.com/repos/anthropics/claude-code/issues/31888 |
| human-review 1,241 stars / 98 forks, created 2026-07-27 | https://api.github.com/repos/petergyang/human-review |
| 501 repos "agent diff review" since 2026-05-01; 315 "markdown agent review" since 2026-04-01 | https://api.github.com/search/repositories |
| claude-edits-scm attribution extension: 88 installs | https://marketplace.visualstudio.com/items?itemName=dfarkash.claude-edits-scm |
| Mark Text 61,189 stars; Pages CMS 3,976; Dendron 7,465; Fumadocs 13,101 | https://api.github.com/repos/marktext/marktext |
| Dendron 168,830 VS Code installs vs Markdown All in One 14,470,109 | https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery |
| Dendron's cause of death: no PMF "for a venture backed business" | https://github.com/dendronhq/dendron/discussions/3890 |
| Obsidian Sync $48/yr; Bear $29.99/yr; Ulysses $39.99/yr; iA Writer $49.99 once; Typora $14.99 once | https://obsidian.md/pricing |
| Mintlify Pro $450/mo; GitBook $65–249/site/mo + $12/user/mo; ReadMe $250/mo + $150/mo AI | https://mintlify.com/pricing |
| Obsidian: 8 staff, no investors, per-seat licence made optional 2025-02-20, "over 10,000 organizations" | https://obsidian.md/blog/free-for-work/ |
| Atlassian FY2026 revenue $6,572,308,000, +26.0% (SEC XBRL) | https://data.sec.gov/api/xbrl/companyconcept/CIK0001650372/us-gaap/RevenueFromContractWithCustomerExcludingAssessedTax.json |
| Notion 100M registered users Aug 2024; Plus $10/member/mo | https://www.notion.com/blog/100-million-of-you |
| Cisco: 250-line ceiling; 87% below average above 450 LOC/hr; 60-minute wear-out; 13 defects/hr | https://static1.smartbear.co/support/media/resources/cc/book/code-review-cisco-case-study.pdf |
| Google: 3.2 h/week review budget, 24-line median change, 1 median reviewer | https://sback.it/publications/icse2018seip.pdf |
| Microsoft: defects were 78 of 570 review comments (14%), 4th of 9 categories | https://sback.it/publications/icse2013.pdf |
| Tricorder: analyzer on probation at 10% not-useful; observed ~5% | https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/43322.pdf |
| Habituation: approval 30.1% → 36.8%; comments −22%; ρ = −0.556; latency +3.5× | https://arxiv.org/abs/2606.22721 |
| DDI alert override 55–98% across 34 studies | https://pubmed.ncbi.nlm.nih.gov/35673040/ |
| 12,659 of 14,612 alerts overridden (86.6%); 88.3% of reasons meaningless | https://pubmed.ncbi.nlm.nih.gov/38658357/ |
| Heidelberg: 31 rules, 935 of 500,274 sessions (0.19%), 57.5% acceptance | https://pubmed.ncbi.nlm.nih.gov/34450669/ |
| METR RCT: AI increased completion time 19% against a predicted 24% reduction | https://arxiv.org/abs/2507.09089 |
| AIDev: 932,791 agent-authored PRs, 5 agents, 116,211 repos | https://arxiv.org/abs/2602.09185 |
| Silent reading 240–260 wpm | https://pubmed.ncbi.nlm.nih.gov/34516216/ |
| This repo: 8,909 markdown files, 4,446,724 words (local measurement) `[inferred]` | local |
| diff-match-patch 4,577,392 PyPI/mo vs draftable-compare-api 3,308 | https://pypistats.org/api/packages/draftable-compare-api/recent |
| npm `diff` 550,411,040/mo vs `diffchecker` CLI 98 | https://api.npmjs.org/downloads/point/last-month/diffchecker |
| Templater 5,536,902 cumulative (#2 of 7,403); latest version 225,003 | https://raw.githubusercontent.com/obsidianmd/obsidian-releases/master/community-plugin-stats.json |
| Obsidian 7,425 plugins, 736 themes; a 2,300-deep plugin review queue cleared | https://obsidian.md/blog/future-of-plugins/ |
| 21 CFR 11.10(e): "Record changes shall not obscure previously recorded information." | https://www.ecfr.gov/api/versioner/v1/full/2026-01-01/title-21.xml?part=11 |
| MHRA: audit trails may be reviewed as a list "or by an 'exception reporting' process" | https://assets.publishing.service.gov.uk/media/5aa2b9ede5274a3e391e37f3/MHRA_GxP_data_integrity_guide_March_edited_Final.pdf |
| EMA, 9 Sept 2024: model-generated text needs a quality review mechanism (non-binding) | https://www.ema.europa.eu/en/documents/scientific-guideline/reflection-paper-use-artificial-intelligence-ai-medicinal-product-lifecycle_en.pdf |
| Atrium shut down 2020-03-03 after $75.5M | https://techcrunch.com/2020/03/03/atrium-shuts-down/ |
| Editorially closed 2014-05-30: "Even if all of our users paid up, it wouldn't be enough." | http://stet.editorially.com/articles/goodbye/ |
| Poetica acquired by Condé Nast 2016-03-01, dead 2016-06-01; goals "at odds" | http://web.archive.org/web/20160302063505id_/https://blog.poetica.com/2016/03/01/our-next-chapter/ |
| Zed Delta 679 HN points (2026-08-12); DeltaDB 529; between-commits 319 | https://hn.algolia.com/api/v1/search?query=Zed%20Delta&tags=story |

---

## 5. Numbers and quotes you may NOT use

**Refuted — the VERIFIED file wins.** "The reviewed state clears if you or the agent changes the
file again" and "Markdown files follow the same feedback flow", both attributed to the VS Code
review docs: neither string is on that page, which does not document the capability at all. The
derived framing — free, default-on, tens of millions — goes with them.

**Paraphrases wearing quotation marks.** "Every edit and conversation is captured between your
commits" (zed.dev/blog/introducing-delta) and "When the side panel only tracks agent tool edits,
your UI gets out of sync with your working directory" (antigravity.google/blog/vcs-and-terminal)
are on neither page. Verbatim and safe: "diff panel that opens beside the conversation";
"comments attach to snapshots"; "Agent Edits"; "Uncommitted". **One quotation mark in three is a
paraphrase. Re-fetch and string-match before any quote reaches a card or a diagram.**

**Tagged NOT-OPENED or unverified — do not repeat.**
- Every note-taking market size: six firms span $1.35B–$15.46B, and one publishes $11.02B and
  $2.2B for the same base year. Technavio's $9.74B / 17% CAGR is `[NOT-OPENED|unverified]` and is
  an increment, not a level.
- Notion revenue: $600M / $500M / ~$400M ARR from three contradicting aggregators
  `[opened|unverified]`. Use the $10/member/month price only.
- Confluence revenue does not exist; Atlassian discloses two categories. The $6,262M subscription
  split came from stockanalysis.com, not the filing.
- CodeStream's defunct status and end-of-life date `[NOT-OPENED|unverified]`.
- **The 18% figure itself.** No source produces it and the methodology is unknown; the 55.6-hour
  reading debt is arithmetic on an unverified input and must be labelled as such.
- Litera Compare's per-seat price — never read, quote-only. Litera's $16M → $250M is a CEO-bio
  self-claim, undated at both ends.
- Draftable's scale: 1,300+, 1,500+, 2,500+ and 4,000+ appear on three of its own pages. Use the
  prices, never a customer count. Do not state a Draftable/Affinda acquisition.
- Google's 10% Tricorder threshold is from ICSE 2015 and was not confirmed as still operative.
- Cisco's numbers are defects per kLOC of source code; mapping "200 lines" onto markdown spans is
  an analogy, not a measured equivalence. Say so wherever it is used.
- Habituation at the Gate: a five-page workshop paper, n=400, one dataset; its authors say "most
  consistent with" habituation.
- The Coolify claim that an anti-slop action "could have closed 98 percent of slop PRs".
- Notion's marketplace commission (the widely repeated 0%).
- Obsidian and VS Code figures are cumulative downloads and installs, not users: Claudian has
  2.04M cumulative but 5,134 on its latest version.
- HN title counts for "Litera" (3,741) and "redlining" (1,357) — substring false positives.
- S1000D was read from an open-source implementation, not the specification.
- The EMA paper is non-binding and names no granularity. No regulation opened mandates per-span
  review: pharma mandates whole-document approval, aviation a per-page revision date. Do not
  imply a mandate.
- Editorially's funding total; Draft's and Penflip's shutdown causes (death verified, cause not).

---

## 6. The 53 candidate decisions

63 were raised; 10 were duplicates across lenses. Five are marked **[task]** and must not become
cards.

**Product & definition**
1. Keep "see what the agent changed" as the headline? — four platforms ship it free.
2. Reopen the demotion of authorship marking? — now the only unoccupied claim of four.
3. Defect detection or orientation? — Microsoft put defects at 14% of review comments.
4. Lead with review state, or with a narrow urgent job? — Almanac led with the abstraction.
5. Does "know what nobody has read" stay the headline? — verbatim an Almanac feature.
6. Byte-range granularity user-facing, or only its consequence? — no buyer was taught to want it.
7. Claim the git-native seam? — unoccupied, and worth nothing sold as diffing.
8. Is "last version I approved" a first-class object? — Draftable has sold that shape since 2013.

**Market & competition**
9. Name Almanac in the pitch, or stay quiet? — anyone who knows the space will raise it.
10. Does Zed Delta enter the competitive set? — same thesis, absent from prior research.
11. Four dead review-state products: why does this one differ? — Upsource's stated cause is the direct threat.
12. Position against docs.dev's rendered-page model, or accept the split? — the only live post-agent competitor.
13. Target regulated-software teams keeping QMS docs as markdown in git? — the only genuinely adjacent buyer found.
14. Spend anything on lawyers this year? — .docx substrate, Word add-in incumbents, Atrium burned $75.5M.
15. **[task]** Write the paragraph stating redlining tools are adjacent, not competitive.

**Pricing & buyer**
16. Which price rung — ~$40/yr indie or ~$3,000/yr docs platform? — $4–5/seat sits in an empty middle.
17. Who pays — the developer who opens the file, or the org answerable for unreviewed content?
18. Free editor, paid review only? — Obsidian examined per-seat and gave it up in Feb 2025.
19. Venture-scale or two-person business? — Dendron's founder named this as the cause of death.

**Engine & sidecar**
20. Does the sidecar carry a document id in YAML front matter, independent of path? — Bike ships the failure this prevents.
21. What wins when sidecar and document disagree? — darktable's silent clobber is its worst-reviewed behaviour.
22. How does review.jsonl merge across branches? — only git's built-in `union` works on a fresh clone.
23. Pin byte offsets with a shipped `.gitattributes`? — CRLF shifts every offset on a Windows checkout.
24. One sidecar file or two, authored versus derived? — DVC's split is what makes conflicts tractable.
25. How is the schema versioned, and does an older reader break a newer file? — Cambria: translate on read.
26. review.jsonl or provenance.jsonl, one file or two? — two names is the darktable/Lightroom split in miniature.
27. Does Zed's CRDT bet reopen "never a CRDT"? — keep the position; the rebuttal is unwritten.
28. Reset review state on any byte change, with a logged "no content change" override? — S1000D's shipped state machine.
29. Adopt semantic line breaks, and does the editor impose them? — a reflow is the exact unrequested edit we exist to catch.
30. **[task]** Add Obsidian 1.14 colour highlights and `.base` blocks to the corpus red-proofing.

**Design, UI & attention**
31. Ever show a percentage-of-repo figure? — memorable in a demo, corrosive in use.
32. What caps the spans surfaced in one sitting — a time budget or a span count?
33. Badge or notify outside a review session? — the element with the worst evidence behind it.
34. Full list or exception-first? — MHRA has adjudicated this and permits exception reporting.
35. RTL, system text scaling and high contrast in v1? — both competitors shipped this in six weeks.

**Flow & interaction**
36. Does reviewing require a reason? — **the lenses conflict**: alert-fatigue says one keystroke (88.3% garbage justifications), regulation says record the why. Split it: required on rejections and overrides, optional on approvals.
37. Is a clickable, exhaustible change list the primary surface? — the affordance the category converged on.
38. What shows when a record matches no document? — retain and mark, never prune.
39. Git visible or invisible? — every product that showed git to writers got the same complaint.
40. Instrument a dismissal-rate kill threshold? — Tricorder disables a category at 10%.

**Features & scope**
41. Ship voice dictation? — Apple made it free at the OS layer; the clearest negative found.
42. Ship templates, in which of the two meanings? — Templater is #2 of 7,403 but is a scripting engine, not a gallery.
43. Read-only database views over frontmatter properties? — Obsidian Bases is now core.
44. Read receipts scoped to agent changes rather than general readership? — the general form is Almanac's.

**Plan, business & channels**
45. Build horizon, and how much engine work before a paying user? — three of four claims moved in nine weeks.
46. Scope ceiling and the written not-building list? — Obsidian needs eight people; Almanac died of capacity.
47. Acquisition by a docs platform, CMS or agent vendor — goal or fallback? — absorption is the modal outcome, four of eight.
48. How does frontmatter reach anyone? — the category cannot generate noise even when a loved product dies.
49. Use the git-backed CMS adjacency as distribution? — right audience, review-shaped hole, trained to expect it free.
50. Ship a paid Obsidian plugin? — paid plugins were formalised in May 2026 and the gap is unfilled.

**Evidence & claims**
51. Ever cite a top-down market size? — the 8.2x same-year disagreement is more useful than any figure.
52. Quote regulators, and say plainly that none require per-span review? — compliance buyers punish the missing caveat.
53. **[task]** Cite claude-code#33932 only as a six-month unfilled gap at a well-resourced vendor, never as willingness to pay.

**Also tasks, not cards:** the CRDT rebuttal naming Zed (from 27); the dead-product section with
dates and stated causes; the habituation question, which is a v1 logging requirement rather than
a research programme.
