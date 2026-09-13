# Capability matrix, markdown editors frontmatter sits beside

Compiled 2026-09-13. Sources: local corpus (`docs/research/frontmatter-competitor-gapmap.md`,
`docs/research/agent-reports-2026-08-30/*`, `docs/research/2026-09-09/*`) cited by file name and
the date the corpus fetched it, plus 9 pages opened fresh in this run (WebSearch to find the URL,
then `curl` through the `r.jina.ai` reader or a direct `curl | sed` strip, dated 2026-09-13).
"unverified" = could not be opened, no figure given.

Legend: Y = yes, P = partial, N = no.

## The matrix

| Editor | Live preview modes | Git/GitHub sync | Unlisted-link share | Comments | Version history | Templates | AI writing | AI edit-on-selection | Agent hand-off | Offline | Price |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **Obsidian** | Y, 3: Source, Live Preview, Reading [corpus: `frontmatter-competitor-gapmap.md`, fetched pre-2026-09-13] | P, community plugin only (`obsidian-git`); documented broken merges + silent overwrites on mobile (#558, #819) [corpus, same file] | N, no built-in public link; Obsidian Publish is a paid, named site, not an unlisted link [corpus] | N, no native comments; corpus notes users round-trip to Google Docs for comment threads [corpus] | P, plugin-based (`file-recovery`/`Vault Sync` history), not a first-party product page found this run, **unverified** as a first-party feature | Y, core "Templates" + community "Templater" plugin, in general knowledge of the product but not opened this run, **unverified figure**, feature itself widely documented in corpus's plugin-ecosystem discussion | N, no first-party AI in the corpus; only a third-party plugin ecosystem | N, same | N, plain files on disk are agent-readable, but no purpose-built hand-off flow | Y, offline-native, local-first [corpus] | Free core; Sync $4-5/mo; Publish $8/site/mo, official page verified in corpus [corpus] |
| **Typora** | Y, 1 mode, live WYSIWYG only, no separate source/preview toggle by design, confirmed on typora.io today: "It removes the preview window, mode switcher... provides a real live preview" [https://typora.io/, fetched 2026-09-13] | N [corpus] | N | N | N, not mentioned on typora.io or in corpus; local single-file editor | Y, theme gallery exists (`theme.typora.io`) but no doc-template feature found, **unverified** | N | N | N, local files only | Y, local only [corpus] | $14.99 one-time, official page verified in corpus [corpus] |
| **HackMD / HedgeDoc** | Y, 3: edit-only, split (edit+view), view-only, standard for the CodiMD/HackMD family, **unverified this run**, carried from general product knowledge, flag accordingly | Y, GitHub push/pull, capped 20/mo on Free, unlimited on Prime [https://hackmd.io/pricing, fetched 2026-09-13] | Y, "Customize permalink to your note" on a public note is HackMD's unlisted-style sharing model [same page] | P, "Suggest edit" ships on Free; no threaded inline comment feature named on the pricing page [same page] | Y, "Recent 10 versions" on Free, "Unlimited versions" on Prime [same page] | Y, "3 custom templates" Free, "Unlimited custom templates" Prime [same page] | N, no AI writing feature listed on the pricing/comparison page [same page] | N | N | N, web-only [corpus] | Free (3 teammates, 20 pushes/mo); Prime $5/seat/mo billed annually [https://hackmd.io/pricing, fetched 2026-09-13, updates the corpus's older "$5/seat/mo" figure with today's "$15/mo billed annually = $5/seat" wording] |
| **StackEdit** | Y, 2: editor + live preview panel with scroll sync [https://stackedit.io/, fetched 2026-09-13] | Y, sync/publish to GitHub, Gist, Google Drive, Dropbox, SSH [same page] | P, "share a link... in a nice viewer" per search-corroborated summary, but the page itself does not use the word "unlisted" and the page's own `Published Time` header reads 2022-10-09, i.e. the marketing copy is stale and the product's maintenance state is in doubt [https://stackedit.io/, fetched 2026-09-13; corpus also lists StackEdit among apps "suffering" from git-merge problems: `frontmatter-pain-taxonomy.md:167`] | P, "insert inline comments and embed collaborator discussions," per WebSearch summary of stackedit.io/itsfoss, not independently confirmed on the page fetched this run, **flag as search-corroborated, not fetched** | N, not found on the fetched front page | N, not found | N | N | N, plain markdown files, but no dedicated flow | P, browser app, no offline-first design claim found | Free, no pricing page found, **unverified**, product appears community-run/unmaintained (2022 copy) |
| **iA Writer** | Y, corpus documents Focus Mode and Preview across platforms; a live "1 mode" WYSIWYG-adjacent editor, **exact mode count unverified this run**; ia.net/writer fetched today did not enumerate modes on the sampled excerpt [https://ia.net/writer, fetched 2026-09-13] | N [corpus] | N | N | N | N, not found on ia.net or in corpus | Y, "templates" mentioned in corpus's export-feature line (`⇧⌘E + templates`) [corpus: `agent-reports-2026-08-30/r24-v1-table-stakes.md:59`] | N | N | N, plain files, iCloud/Dropbox only [corpus] | Y [corpus] | One-time $29.99-$49.99 per platform, official page verified in corpus [corpus] |
| **Notion** | N, block editor, not a source/preview toggle; no "live preview modes" concept applies | N, no git sync [corpus] | P, "Share" produces a public web link (not literally described as "unlisted," but unindexed by default until "Allow search engines" is toggled on), this exact wording was not independently opened this run, carried from general knowledge, **unverified** | Y, inline block comments are a well-known core feature; not independently re-opened this run, **unverified this run**, high confidence from general knowledge only | Y, Version History with plan-gated retention: 7 days Free, 30 days Plus, 90 days Business, unlimited Enterprise [search-corroborated from notion.com/help via WebSearch, not directly fetched, the direct fetch of `notion.com/help/page-history*` 404'd this run; treat the day-counts as search-corroborated, not fetched] | Y, official template gallery exists (`notion.com/templates`), not independently opened this run, **unverified count** | Y, Notion AI, priced at $10 per 1,000 credits per corpus [corpus: `frontmatter-competitor-gapmap.md`] | Y, Notion AI edits/rewrites selected text; a well-known feature, not independently confirmed by page text this run, **unverified this run** | N, no purpose-built coding-agent hand-off; export is lossy (relations→text, rollups vanish) [corpus] | P, corpus: offline mode "excludes the browser entirely," caps DB at 50 rows [corpus] | Free; Plus $10/user/mo; Business $20; AI $10/1,000 credits, official page verified in corpus [corpus] |
| **Zettlr** | Y, corpus cites a dedicated "split view" and table-editor live rendering; exact preview-mode count not enumerated on zettlr.com fetched today (site emphasises workflow, not a mode list), **unverified count**, split-pane existence confirmed [https://www.zettlr.com/, fetched 2026-09-13; corpus: `agent-reports-2026-08-30/r24-v1-table-stakes.md:54`] | P, "git-able" plain files on disk via any external git tool; no in-app git UI found in corpus or on the site, treat as file-level, not product-level, sync | N, privacy-first, local-only by design: "no forced cloud-synchronization" [same page] | N | N, not found | N, no template feature found on zettlr.com or in corpus (corpus instead cites Zettlr's *export* profiles, not authoring templates) | N | N | N | Y, explicitly "Privacy First... all files stay on your computer," no telemetry [same page] | Free, open source (GPL-3.0) [corpus: `agent-reports-2026-08-30/r14-g2-reference-implementations.md:42`] |
| **Mark Text** | Y, 1, live WYSIWYG, no split/source toggle by design (same design family as Typora), carried from general knowledge, **not independently opened this run** | N | N | N | N | N | N | N | N, plain local files, no purpose-built agent flow | Y, local desktop app | Free, open source; 61,189 GitHub stars, actively maintained again with a July 2026 release candidate per corpus's own fresh fetch [corpus: `docs/research/2026-09-09/research-raw.txt:52`, `BRIEFING.md:142`] |
| **VS Code + top markdown extensions** | Y, "Markdown All in One" ships auto-preview + table-of-contents + list auto-continue on top of VS Code's native split preview, per its marketplace listing [https://marketplace.visualstudio.com/items?itemName=yzhang.markdown-all-in-one, search-corroborated via WebSearch, not independently opened this run, **flag as search-corroborated**] | Y, VS Code's native Source Control panel is full git, plus GitHub Pull Requests extension; this is general product knowledge, not re-verified this run | N, no built-in unlisted-link publish; GitHub Pages / gists are manual workflows, not a product feature | Y (via GitHub PR review comments in the GitHub extension) but N as a native markdown-file feature | Y, via git history / Timeline view (native), not markdown-specific | Y, via user/workspace snippets, not a markdown-specific template gallery | Y, GitHub Copilot / Claude Code extensions | Y, Copilot/Claude Code inline edit is exactly "AI edit on selection" | **Y, the strongest cell in the table.** VS Code is the native workspace every coding agent (Claude Code, Cursor's fork, Copilot) already reads/writes; this is definitional, not a fetched claim | Y, fully local editor and file system | Free (VS Code itself); named extensions are free; Copilot is a separate paid subscription not priced in this run, **unverified figure for Copilot** |
| **GitBook** | P, GitBook is block-based, not source/preview; ships "Live edits" as a named real-time editing surface plus "Change requests" (branch-and-review), which the corpus already fetched: `[fetched]` cites in `agent-reports-2026-08-29-r8to10/d2-collaboration-models.md:53` | Y, "Sync with GitHub or GitLab" on the Free plan [https://www.gitbook.com/pricing, fetched via r.jina.ai reader 2026-09-13] | Y, GitBook sites are public web docs by default; a Free-plan site is effectively an unlisted link until a custom domain/branding is added, inferred, not an exact product-page quote | Y, corpus's own fetch: GitBook ships "Comments" as a separate nav item alongside Git Sync, Change requests, Merge rules, Live edits [corpus: `agent-reports-2026-08-29-r8to10/d2-collaboration-models.md:53`] | P, "preview deployments" on Free act as versioned snapshots; no dedicated "version history" line item seen on the pricing page fetched today | N, no template feature found on the pricing page | Y, "AI Assistant... advanced AI chat sidebar" and "GitBook Agent" to "write, edit, and update your documentation," both gated to the $249/site/mo Ultimate tier [https://www.gitbook.com/pricing, fetched 2026-09-13] | Y, GitBook Agent edits documentation content, Ultimate tier [same page] | N, GitBook Agent edits GitBook's own docs, not a hand-off package for an external coding agent | P, cloud-hosted docs product, not offline-first | Free (1 site, 1 user); Premium $65/site/mo + $12/user/mo; Ultimate $249/site/mo + $12/user/mo; Enterprise custom [https://www.gitbook.com/pricing, fetched 2026-09-13, this overrides the corpus, which had not priced GitBook] |
| **Craft** | N, block editor, not source/preview | N, no git sync [corpus] | Y, "share Craft documents with people who don't [have an account]" per the pricing page fetched today; not confirmed as unindexed/unlisted specifically | Y, "comment without giving away edit rights" and "comments for free" both appear on the pricing page [https://www.craft.do/pricing, fetched 2026-09-13] | Y, 7-day version history Free, 30-day Plus, per the page's own FAQ schema: "Free users get 7-day version history, while Plus users enjoy 30-day history" [same page, fetched 2026-09-13, sharper than the corpus's plain "," for this cell] | Y, "Template Gallery" is a top-level nav item on the pricing page [same page] | Y, "AI assistant" bundled from Plus up, "on-device models always free" [same page] | Y, Craft's AI Assistant operates on selected block content, per its own Help Center article title "AI Assistant," not independently opened this run, **unverified this run** | N, proprietary block format, lossy markdown round-trip [corpus] | P, "Cloud+local" [corpus] | Free (1,500 blocks); Plus $8/mo (search-corroborated; corpus said $10/mo, both figures are search/aggregator-sourced, not the raw plan-card price this run resolved to a number, **flag price as needing a second check**); Family $15/mo; Team $50/mo [https://www.craft.do/pricing, fetched 2026-09-13] |

## What no editor in this matrix has (the plan's genuinely unclaimed capabilities)

Checked with three targeted searches/greps each, listed below.

1. **A splice-only write engine that refuses on ambiguity instead of rewriting the file.**
   Searches: (a) `grep -ril "splice" docs/research` → only frontmatter's own docs; (b) WebSearch
   "markdown editor byte-exact splice write refuse ambiguous" → no product results, only generic
   diff-tool and LLM-prompt-engineering hits; (c) corpus's own competitor sweep across 24+ products
   (`frontmatter-competitor-gapmap.md`) never once uses "splice," "byte-exact," or "refuse" as a
   product claim for any competitor. None of the eleven editors here rewrite-vs-splice as a stated
   design law; all either regenerate the whole block (Notion, Craft, GitBook) or leave writing to
   the OS file system with no engine-level guarantee (Obsidian, Typora, Zettlr, Mark Text, iA
   Writer, VS Code, StackEdit, HackMD).

2. **A review-state sidecar keyed by content hash, showing exactly which spans a person has read.**
   Three searches: (a) `grep -ril "review.jsonl\|content hash\|span-level" docs/research` → only
   this repo's own architecture docs; (b) WebSearch "markdown editor mark spans as reviewed content
   hash" → no product hits, only code-review-tool (GitHub PR, CodeRabbit) results, which review
   diffs, not markdown documents; (c) the corpus's own nine-lens research briefing
   (`docs/research/2026-09-09/BRIEFING.md`) is explicit that Almanac shipped the closest analogue
  , read receipts on AI-written docs, and shut down 2025-01-31, and that this exact feature is
   "under test, not proven" per this repo's own CLAUDE.md. **Narrow claim, not the broad one**:
   none of the eleven editors checked here has a per-span review-state feature; GitBook's Comments
   and Change Requests are the closest commercial analogue and operate at the diff/thread level,
   not a persistent per-span read/unread ledger.

3. **The funnel's seven-file scaffolded kit with SHA-256-verified curl-in kickoff for a coding
   agent.** Three checks: (a) `grep -ril "curl.*sha256\|kickoff prompt\|scaffolded kit" docs/research`
   → nothing outside this repo's own MVP plan; (b) WebSearch "markdown editor generate project kit
   curl into repo coding agent sha256" → no product hits; (c) direct inspection of the matrix above
   shows the closest thing is VS Code's raw agent hand-off (the agent reads whatever is in the
   workspace) and GitBook Agent (writes GitBook's own docs), neither packages a prompt-answered kit
   as a fetchable, checksum-verified artifact. No editor here does this.

## Table-stakes frontmatter must match to be taken seriously

Reading straight off the matrix, the cells where 6+ of the 11 editors already clear the bar:

- **Live preview** in some form, 8 of 11 have it (Obsidian, Typora, HackMD, StackEdit, iA Writer,
  Zettlr, Mark Text, VS Code); frontmatter's Live/Edit/Split/Read four-mode plan already exceeds
  the median (most competitors ship 1-3 modes).
- **Version history**, Craft, HackMD, Notion, and (informally, via git) VS Code all ship it;
  Obsidian and GitBook only partially. A markdown product without some notion of "what did this
  file look like before" is behind half the field, not ahead of it.
- **Templates**, HackMD, Craft, Notion, iA Writer (export templates) all have it; Zettlr, Typora,
  Mark Text, StackEdit do not. This is a 50/50 split, not settled table stakes, but frontmatter's
  MVP plan already includes a launcher template picker, which puts it in the leading half.
  **Unverified**: Obsidian's own template feature was not independently re-opened this run.
- **Comments**, HackMD (partial), Craft, Notion, GitBook all have some form; Obsidian, Typora, iA
  Writer, Zettlr, Mark Text, StackEdit (unclear) do not. Comments split the field roughly down
  the middle between "vault/local" tools (no) and "docs/collab" tools (yes), frontmatter sits
  architecturally closer to the vault side, so this is a genuine differentiator opportunity, not
  a gap to panic-fill.
- **AI writing and AI edit-on-selection**, only Notion, Craft, and GitBook (Ultimate tier only)
  ship first-party AI; none of the plain-markdown/vault-style tools (Obsidian, Typora, iA Writer,
  Zettlr, Mark Text) do. This is NOT yet table stakes in the plain-markdown category frontmatter
  is entering, though it is standard in the docs-collaboration category (HackMD is the outlier ,
  no AI writing feature was found on its pricing/comparison page this run).
- **Git/GitHub sync**, present in some form (native or plugin) in Obsidian, HackMD, StackEdit,
  GitBook, VS Code; absent in Typora, iA Writer, Notion, Zettlr (file-level only), Craft, Mark
  Text. Roughly half. Given frontmatter's whole thesis is "the file on disk is the source of
  truth," first-party git/GitHub sync without the plugin-tier failure modes documented in the
  corpus (obsidian-git's silent overwrites, GitJournal's auto-sync overwrites) is close to
  mandatory, not optional, for this specific product's positioning.

## What was not independently verified this run

Cells and figures flagged "unverified" or "search-corroborated" above should not be quoted as
fetched facts without a follow-up direct open: Obsidian's Templates feature and any first-party
version-history plugin, iA Writer's exact preview-mode count, Notion's comments/version-history/AI
edit-on-selection features (search-summary only, the direct notion.com/help fetch 404'd), Craft's
AI-edit-on-selection mechanic, Mark Text's live-preview mode count, StackEdit's comment feature and
current maintenance status (its own marketing page carries a `Published Time` header of 2022), and
Copilot's price (not looked up this run).
