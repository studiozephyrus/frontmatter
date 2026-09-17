# Coordinator's own measurements, 2026-09-16 (round 2, after the v1 PDF)

Everything here I ran myself. Commands and outputs are in the session transcript.

## 1. The studio's own document kits (local, verified)

| Set | Files | Words |
|---|---|---|
| `advox/frontend/docs` | 33 numbered | 119,284 |
| `advox/backend/docs` | 12 numbered | 37,056 |
| `frontmatter/docs` | 16 numbered | 57,472 |
| Total | 61 | 213,812 |

Same spine in all three: `00-EXECUTIVE-SUMMARY / 01-PRODUCT-AND-DOMAIN / 02-ARCHITECTURE / 03-DATA-MODEL / 04-API-REFERENCE / 05-FRONTEND-SPEC / 06-BACKEND-SPEC / 07-INTEGRATIONS`.
`advox/backend/docs/adr/` holds numbered ADRs `0001-...` to `0005-...` plus a README, which is the "one short decision record per structural choice" rule in the plan's `03-ARCHITECTURE.md`, already practised.
24 of the 33 advox frontend docs mention a verify command or `npm run`.
advox is live: last commits 2026-09-10 on both repos, remotes `github.com/teamadvox/advox-frontend` and `-backend`.
The plan's section 6 cites only the frontmatter set ("sixteen documents and 57,464 words"). The convention is validated three times on two products, not once.
Caveat: these are retrospective documentation of built products, not prospective kits written before a build. They validate the STRUCTURE, not the generation flow. The phase 0 gate of twenty hand-made kits still stands.
Naming caveat: advox sits under a separate GitHub org; the founders decide whether to name it in a shareable PDF.

## 2. Instruction files across the studio (local, verified)

- 138 `AGENTS.md` or `CLAUDE.md` files at any depth, excluding node_modules and .git.
- 50 repos carry one at root.
- 6 repos carry both. **All six use the `@AGENTS.md` import**, four as a pure stub (11 bytes) and two (frontmatter, pwa) adding their own content on top.
- So our own practice does NOT show drift. It shows the fix: keep one file, import it.
- This CORRECTS the plan's section 16 framing, which cites LibreChat's two drifted files as the signal. The honest version: the drift risk is real in the wild, and the known answer is the import; a tool should teach the import, not diff two copies.
- 134 skills linked in `~/.claude/skills/`, 72 of them `sgnk-` authored.

## 3. The decisions site is a studio pattern (local, verified)

`frontmatter/decisions/diagram.js` 29,335 bytes and `advox/frontend/decisions/diagram.js` 23,692 bytes. Built twice, on two products. Idea mode is that pattern, generated.

## 4. Counted demand from the market leader's issue tracker (api.github.com, 2026-09-16)

`github/spec-kit`: 137,046 stars, 12,276 forks, 321 open issues, 1,651 issues total, created 2025-08-21, pushed 2026-09-15.

Most-reacted issues of all time:

| Reactions | Comments | State | Created | Title |
|---|---|---|---|---|
| 115 | 8 | closed | 2025-11-15 | Spec-Driven Editing Flow: Can't Easily Update or Refine Existing Specs |
| 80 | 8 | closed | 2025-11-19 | Support Antigravity |
| 75 | 8 | closed | 2025-09-05 | Proposal: Set root directory to .specify |
| 70 | 11 | closed | 2025-09-22 | SpecKit Workflow Diagram, Feedback Please |
| 57 | 5 | closed | 2025-09-05 | OPEN AI codex support |
| 52 | 11 | closed | 2025-09-21 | Add Post-Implementation Debugging and Fixing Workflow |
| 39 | 7 | closed | 2025-09-15 | Reverse Engineering Command |
| 36 | 7 | closed | 2025-12-20 | EARS (Easy Approach to Requirements Syntax) Integration |

Most-reacted OPEN issues:

| Reactions | Comments | Title |
|---|---|---|
| 24 | 2 | Claude.md vs constitution.md |
| 23 | 3 | Best Practices for Providing UI Designs and Mockups to Spec-Kit Agent |
| 18 | 8 | Spec Kit with Zed Editor's Zed Agent |
| 15 | 6 | Spec-kit commands consume significant portion of context window in every session |
| 12 | 4 | Support Module-Level Persistent Specifications for Knowledge Retention |
| 12 | 13 | How to keep specs consistent and up-to-date with spec-kit? |
| 9 | 4 | Add Documentation Generation Feature to Speckit for Standardized Project Documentation |

Body of #1191 (115 reactions), verbatim opening: "Multiple users find it difficult to update, refine, or iterate on existing specs in Spec Kit without creating new branches and redundant specification artifacts."
Body of #620 (12 reactions, 13 comments), verbatim: "With `spec-kit`, each feature defines its own spec. This works well at first, but over time and with the multiplication of features, some descriptions become outdated or are enriched by new features."

Reading: the single most-reacted issue in the market leader's tracker is the editing and refinement of existing specs, which is frontmatter's thesis. This is stronger counted demand for the product than anything in the previous twelve months of research.

## 5. Counted demand for rendering features (Obsidian community registry, 2026-09-16)

Source: `obsidianmd/obsidian-releases` `community-plugin-stats.json` and `community-plugins.json`. 7,679 plugins, 148,000,042 total downloads.

| Downloads | Plugin |
|---|---|
| 7,974,073 | Excalidraw |
| 4,967,706 | Dataview |
| 3,193,578 | Advanced Tables |
| 2,668,372 | Kanban |
| 822,469 | Advanced Canvas |
| 339,682 | Mermaid Tools |
| 324,208 | Charts |
| 218,817 | Multi-Column Markdown |
| 214,738 | Diagrams |
| 210,705 | Callout Manager |
| 202,718 | Excel to Markdown Table |

Notes. Charts at 324,208 updates the corpus figure of 320,106 and validates `fm-chart`. Multi-Column Markdown at 218,817 is honest counter-evidence to the founders' dislike of HackMD's multi-column layout: the demand exists, even if the HackMD implementation is the wrong shape. Excalidraw is the single largest community plugin.

## 6. Embeddable render dependencies (npm, last week, 2026-09-16)

`katex` 18,887,573; `mermaid` 12,122,962; `@excalidraw/excalidraw` 403,648 (latest 0.18.1, MIT, published 2026-04-20); `y-codemirror.next` 100,283.

## 7. Corrections to numbers already in the plan

- Claude Pro is "$17 Per month with annual subscription discount ($200 billed up front). $20 if billed monthly." (claude.com/pricing, opened 2026-09-16). API prices unchanged and still correct: Sonnet 5 $2/$10, Haiku 4.5 $1/$5. Opus 5 is $5/$25; Fable 5.1 is $10/$50.
- Firestore: cloud.google.com/firestore/pricing lists "Mumbai (asia-south1)" and "Delhi (asia-south2)" in its region selector, so the region is confirmed available. The unit table shown is $0.03 per 100,000 reads, $0.09 per 100,000 writes, $0.01 per 100,000 deletes; the page switches regions with scripts, so a Mumbai-specific unit price is still unconfirmed.
- Overleaf: "GitHub synchronization is a premium feature" (overleaf.com/learn/how-to/GitHub_Synchronization), already folded into section 12.

## 8. Markdown for agents is now a web convention (verified by curl)

`claude.com/pricing` carries "Copy as markdown"; `docs.stripe.com/payments` carries "View as Markdown". Both observed in the page text this session.

## 9. Counted demand, VS Code marketplace (gallery API, query "markdown", sorted by installs, 2026-09-16)

| Installs | Extension | Publisher |
|---|---|---|
| 14,528,511 | Markdown All in One | yzhang |
| 12,172,880 | markdownlint | DavidAnson |
| 10,279,432 | Markdown Preview Enhanced | shd101wyy |
| 5,291,014 | Markdown Preview Mermaid Support | bierner |
| 4,139,157 | Draw.io Integration | hediet |
| 4,132,694 | Markdown PDF | yzane |
| 2,913,661 | Markdown Preview Github Styling | bierner |

Readings. A markdown LINTER is the second most installed markdown extension at 12.1 million, and no product in either competitor sweep ships one. "Markdown Preview Github Styling" at 2.9 million is counted demand for exactly the "how does this look elsewhere" panel in section 8 of the plan. Mermaid and PDF export are confirmed table stakes. Draw.io at 4.1 million is a third independent signal for diagrams, alongside Excalidraw's 7.97 million Obsidian downloads and spec-kit's mockups issue.

## 10. Zoho Writer (2026-09-16)

"Yes, Zoho Writer is free for both individual users and organizations. You will get unrestricted access to all its features as soon as you sign up" (zoho.com/writer/pricing.html), with Zia AI included. Its features page (zoho.com/writer/features.html) contains zero occurrences of "markdown", so it is a word processor rather than a markdown tool. The pricing anchor still matters: Zoho Workplace Standard is ₹99 a user a month and Professional ₹399, and Google Workspace Base is ₹99 and Starter ₹270 (workspace.google.com/pricing?hl=en_in).
