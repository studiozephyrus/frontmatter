## KEY FINDINGS
- MOBBIN UNREACHABLE THIS SESSION [measured]: MCP calls denied by the user's sgnk-taint-gate hook — parent session id was tainted twice on 2026-08-27 (stale carry-over, nothing today); direct curl to api.mobbin.com/mcp returns 401 (OAuth-only, no authless surface). Zero mobbin_urls cited; none fabricated. Recovery: re-run in a fresh session — the gate is session_id-scoped by design.
- Fallback delivered: 9 WebSearch [SS] queries covering all 5 surfaces + pricing modal; 0 Mobbin images loaded; all claims tagged [SS]/[inference]/[measured].
- HOME: founder's blank+templates row + recents grid matches the Google Docs convention exactly [SS]; make the row hideable, Blank tile first and ghost-styled, and build dashboard sections reorderable/hideable from v1 (Notion Home's settled pattern). Empty state = the template row promoted, not an illustration.
- EDITOR: three-state mode toggle (Source/Live/Reading, default Live, Cmd+E, upper-right) is the settled Obsidian/Typora convention — a binary edit/preview toggle would be dated [SS]. Chrome auto-fades on typing (iA/Ulysses convention); formatting = selection bubble + slash menu, no persistent ribbon; right rail default tab should be a typed frontmatter Properties editor (the namesake) + Outline.
- AI-IN-EDITOR: Accept/Discard/Try-again is a hard convention (Notion AI); prompt at the cursor, never in the right rail; inherit code-editor inline diff with per-hunk accept for edits [SS]. OPPORTUNITY: persistent AI provenance is an unmet gap in shipped products (arXiv 2601.10236) — frontmatter can store AI-origin ranges in the document's own frontmatter and render a provenance lens; nobody's convention yet.
- KANBAN: Notion convention is board = database view grouped by a property, drag rewrites the property [SS] — the frontmatter-native form: columns ARE frontmatter field values and dragging rewrites the file; ship one Draft/Review/Published template board wired to publish state.
- PUBLISH: two-tab share popover (Invite | Publish) with a single publish toggle/button yielding URL+copy, options behind disclosure, search-indexing OFF by default (Notion Sites convention) [SS]; Unpublish sits in the same popover and should promise exactly what the repo's existing unpublish-revocation machinery (d50a6b2) enforces.
- PRICING MODAL: contextual trigger naming the blocked action + pre-highlighted unlocking plan beats a generic grid [SS]; two plans max in-modal, full comparison lives on the pricing page via footer link.

---

# Design-Pattern Sweep — frontmatter mockup surfaces (2026-08-28)

## 0. Method + what happened to the Mobbin avenue (read this first)

- [measured] The Mobbin MCP tools loaded fine via ToolSearch, but every call was **denied by the user's own `sgnk-taint-gate` PreToolUse hook** (`/Users/sagnikmitra/.sgnk/bin/sgnk-taint-gate.sh`). I read the script: it denies `WebFetch|mcp__*` when the current `session_id` appears in `~/.sgnk/state/injection-taint.log` (line 101). This session's lineage matches — the parent session id `bc6d6dfc-a0a5-4ed7-983d-2f97a3bb5b98` was tainted **twice on 2026-08-27** (16:30:48Z, 17:22:58Z), pattern "IGNORE ALL PREVIOUS INSTRUCTIONS" per `injection-hits.jsonl`. Nothing in TODAY's work tripped it; the taint is carried state from yesterday's session.
- [measured] Per LR#70 I tested the alternative the task provisioned: direct `curl` to `api.mobbin.com` (allowlisted, and Bash is deliberately outside the gate's scope per the script's own SCOPE comment). Result: `POST /mcp` → **HTTP 401** `{"error":{"code":"unauthorized","message":"Missing or invalid Authorization header"}}`; root → 404; no OAuth discovery doc. The MCP server authenticates via Claude Code's own OAuth credential store, which I refused to extract tokens from (policy). No authless surface exists.
- **Conclusion: Mobbin is unreachable from this session by any legitimate means; zero mobbin_url citations below — none are fabricated.** Fallback executed as the task sanctions: 9 WebSearch queries ([SS]-grade), 0 Mobbin images loaded, token budget preserved.
- **Recovery path [measured, from the gate's own design]:** the gate is session-scoped. Re-running this exact sweep in a **fresh session** (new session_id not in the taint log) will pass the gate and the MCP tools will work — the hook's error message itself names this remedy. Alternative (user decision only, do not automate): pruning yesterday's entries from `~/.sgnk/state/injection-taint.log` — that is a security-control edit, RULE-2 territory, not taken.

Tags used below: [SS] = WebSearch result summary (pages not opened — WebFetch is gate-blocked and non-allowlisted hosts are sandbox-blocked); [inference] = my synthesis; [measured] = executed here.

---

## 1. HOME / dashboard (founder's mockup: blank+templates row + recents grid)

**Pattern H1 — "Blank-first create row + templates + gallery overflow" (Google Docs).** [SS] Docs' home puts a horizontal create row up top — Blank tile first, template thumbnails after, "Template gallery" button expanding the full categorized library — with recents below; a Settings toggle ("Display recent templates on home screens") lets users hide the row ([Google Docs help](https://support.google.com/docs/answer/148833), [Zapier](https://zapier.com/blog/create-google-docs-template/)). **Convention.** → The founder's wireframe already matches this convention exactly. Adopt the two refinements: (a) Blank is the FIRST tile and visually distinct (dashed/ghost style vs. thumbnail tiles); (b) the row is user-hideable — power users kill template rows, and Docs ships that toggle for a reason.

**Pattern H2 — "Sectioned, reorderable home hub" (Notion Home).** [SS] Notion's Home is sections — Upcoming events, Recents, Favorites, database views — each with `•••` controls for Show-count / Move up-down / Hide section; the 2025 direction is a dynamic widget dashboard, not a static list ([Thomas Frank](https://thomasjfrank.com/notion-home-everything-you-need-to-know/), [kurashi-notion](https://kurashi-notion.com/en/blogs/notion/notion-home-mytask)). **Convention (newly settled).** → Build the dashboard as independently hideable/reorderable sections from v1 — retrofitting section plumbing later is expensive; a static grid reads dated against Notion's current home.

**Pattern H3 — "Daily note as calendar-anchored hub" (Craft).** [SS] Craft anchors daily notes under dates with a settable Daily Note Template ([craft.do/templates](https://www.craft.do/templates/category/daily-notes), [Craft support](https://support.craft.do/hc/en-us/articles/6691050233117)). **Taste** — only pays off in daily-notes-centric products. → Don't build a daily-notes hub surface; if wanted, one pinned "Today" tile at the head of the recents grid covers 90% of the value at 5% of the cost.

**Pattern H4 — Above the fold = two jobs.** [inference, from H1+H2] Best-in-class homes answer exactly "resume the last thing" (recents with real content previews) and "start a new thing" (create row). Favorites/analytics/feeds all live below the fold. → Keep the founder's two-band layout; resist adding a third band above recents.

**Pattern H5 — Empty state = the templates row, promoted.** [inference; the searches surfaced no counter-example] First-run: recents grid is empty, so let starter templates + one primary "New document" CTA occupy that space rather than an illustration + caption. The template row IS the empty state; don't design a separate one.

---

## 2. EDITOR chrome (founder's mockup: tree / tabs / mode-toggle / right-rail)

**Pattern E1 — "Chrome fades on typing" (iA Writer, Ulysses).** [SS] iA Writer's window chrome fades as you start typing; toolbar shows only what the current context needs; ⌘D hides sidebars and dims to the active sentence. Ulysses ships "Hide Interface" (even window controls) and a fading toolbar ([Ry Walker's iA Writer research](https://rywalker.com/research/ia-writer), [Ulysses help](https://help.ulysses.app/dive-into-editing/editor-customization-guide)). **Convention among premium writing apps.** → This is how the founder's busy frame (tree+tabs+rail) stays premium: everything except the text column auto-fades on typing, returns on mouse-to-edge; one shortcut toggles all chrome. Chrome you can dismiss instantly is chrome you're allowed to have.

**Pattern E2 — "Live preview kills the binary toggle" (Typora → Obsidian).** [SS] Obsidian's Live Preview renders formatting in place while editing (the Typora WYSIWYM model, adopted after a multi-page feature-request thread), keeping Source mode for precision and Reading mode for consumption; switcher sits upper-right of the editor pane, plus Cmd/Ctrl+E and a status-bar icon ([Obsidian blog](https://obsidian.md/blog/live-preview-update/), [Obsidian help](https://help.obsidian.md/edit-and-read)). **Convention now.** → Make the founder's mode-toggle three-state — Source / Live / Reading — defaulting to Live, placed upper-right of the editor pane, cycled by Cmd+E. A binary edit/preview toggle would ship 2020's pattern.

**Pattern E3 — "Selection bubble + slash menu, no persistent ribbon" (Bear, Notion-class editors).** [SS] Bear leads on one-tap formatting with visual polish; the Notion-like pattern (see [Tiptap's Notion-like template](https://tiptap.dev/docs/ui-components/templates/notion-like-editor)) is a floating toolbar on selection plus a slash command menu. **Convention.** → No persistent formatting bar in the mockup; formatting appears on selection, block insertion via `/`. This is also what keeps E1 possible.

**Pattern E4 — "Focus mode dims all but the current sentence" (iA Writer signature).** [SS] ([selfpublishing.com roundup](https://selfpublishing.com/distraction-free-writing-apps/)). **Taste** — a signature differentiator, not table stakes. → Cheap to build on a CodeMirror-class editor, reads premium; ship as a toggle, not a default.

**Pattern E5 — Right rail = Outline + Properties tabs (Obsidian).** [SS] Obsidian's right sidebar carries contextual panels — properties, outline, backlinks, tags — with properties also rendered as a structured panel at the top of the note ([Obsidian forum](https://forum.obsidian.md/t/properties-panel-in-right-sidebar/71078), [PracticalPKM](https://practicalpkm.com/complete-guide-to-obsidian-properties/)). **Convention for PKM-class tools.** → [inference] For a product literally named **frontmatter**, the right rail's default tab should be a first-class Properties (frontmatter) editor — typed fields, not raw YAML — with Outline as the second tab. Backlinks are a later tab, not v1.

---

## 3. AI-in-editor (maps onto the editor mockup + product thesis)

**Pattern A1 — "Accept / Discard / Try again" tri-action (Notion AI).** [SS] Every Notion AI output ends in accept, discard, or try-again; replace flows offer Replace/Discard; AI never commits without an explicit action ([Notion AI FAQs](https://www.notion.com/help/notion-ai-faqs), [eesel guide](https://www.eesel.ai/blog/notion-ai-inline)). **Hard convention.** → Non-negotiable baseline for frontmatter's AI: no auto-apply, ever; three verbs, same order, same position.

**Pattern A2 — "Prompt at the cursor" (inline popup / dropdown / small sidebar).** [SS] The document-AI prompting surface lives in the editor at the selection — inline popup + dropdown presets — not in a detached chat ([Notion AI case study](https://medium.com/design-bootcamp/ai-product-case-study-1-notion-ai-42f6e58f94b3), [AI patterns for document editors](https://aipatterns.substack.com/p/ai-patterns-for-document-editors)). **Convention.** → Trigger from selection (bubble's AI item) and from space-on-empty-block; the founder's right rail is NOT the place for the prompt box — rail-based AI reads as bolted-on.

**Pattern A3 — "Ghost text for insertions, inline diff for edits" (Copilot / Cursor / Copilot Edits).** [SS] Ghost (dimmed) text at the cursor for pure insertions; for multi-line edits, an in-editor diff — additions green, removals struck/red — with Tab-to-accept and per-hunk accept/reject; the per-hunk control is repeatedly cited as the highest-impact UX feature of AI IDEs ([VS Code docs](https://code.visualstudio.com/docs/editing/ai-powered-suggestions), [Copilot Edits](https://learn.microsoft.com/en-us/visualstudio/ide/copilot-edits?view=vs-2022), [Kiro issue](https://github.com/kirodotdev/Kiro/issues/8968)). **Convention in code tools, migrating to prose.** → frontmatter is markdown-native, so inherit the code-editor form: tinted inline diff per edit region with per-hunk accept — this also rhymes with the repo's existing mdmax explicit-degradation/review ethos [inference].

**Pattern A4 — Route AI edits through suggested-edits (Notion).** [SS] Notion ships a tracked-changes "suggested edits" mode for humans ([Notion help](https://www.notion.com/help/suggested-edits)). **Convention (from Google Docs lineage).** → [inference] One review pipeline: AI proposals land as suggestions in the SAME suggested-edits model humans use — one mental model, one accept/reject UI, and collaboration comes free.

**Pattern A5 — Provenance persists nowhere today: the open gap.** [SS] The authorship literature ("Who Owns the Text?", [arXiv 2601.10236](https://arxiv.org/html/2601.10236)) finds provenance is legible only pre-acceptance (ghost rendering + explicit accept); once accepted, AI text is indistinguishable — persistent provenance is named an unmet design implication; trust-pattern guidance wants per-claim citations with hover previews ([AYDesign 2026](https://www.aydesign.ai/blog/ai-citation-source-ui-patterns-2026)). **Nobody's convention — an opportunity.** → [inference] frontmatter can own this: persist AI-origin ranges as metadata **in the document's frontmatter** (the namesake doing real work), surfaced as an optional "provenance lens" toggle that tints AI-originated spans. Differentiator, and honest-by-construction.

---

## 4. KANBAN / board views in document tools

**Pattern K1 — "Board = a grouped database view, columns are property values" (Notion).** [SS] Board view groups pages by a select/status/people property; drag-drop between columns rewrites that property; card previews and visible properties are configurable ([Notion help](https://www.notion.com/help/boards), [Sparxno](https://www.sparxno.com/blog/notion-board-view)). **Convention.** → [inference] The frontmatter-native version writes itself: **columns are values of a frontmatter field** (`status: draft → review → published`), and dragging a card rewrites the file's frontmatter. The board is a lens over frontmatter — thesis-aligned, and trivially explainable.

**Pattern K2 — Cards show 2-3 properties max.** [SS] Cards surface key properties at a glance (assignee, due date, tags) with customizable previews ([NoteForms glossary](https://noteforms.com/notion-glossary/kanban-board)). **Convention.** → Default card = title + status-adjacent field + date; everything else opt-in.

**Pattern K3 — Content-pipeline is the canonical use.** [SS] Editorial calendars and content pipelines are the repeatedly named use-case for boards in doc tools ([super.so](https://super.so/blog/how-to-create-a-kanban-board-in-notion)). → Ship one template board — Draft / Review / Published — wired to the publish state (§5), as the demo of K1.

---

## 5. PUBLISH / share flows (one-toggle publish)

**Pattern P1 — "Share popover, single 'Share to web' toggle, progressive link options" (Notion classic).** [SS] Share button top-right → toggle → public link, with a "Show link options" disclosure: allow editing, link expiry, **search-engine indexing**, duplicate-as-template ([Notion sharing guide](https://www.notion.com/help/guides/understanding-notions-sharing-settings), [Landmark Labs](https://www.landmarklabs.co/notion-tutorials/share-to-web)). **Convention.** → One toggle gets you a URL; options stay behind a disclosure; indexing defaults OFF.

**Pattern P2 — "Invite vs Publish as two tabs of one popover" (Notion Sites).** [SS] Notion split people-sharing from web-publishing: Share → **Publish tab** → Publish button ([Notion help](https://www.notion.com/help/public-pages-and-web-publishing)). **Convention, newly settled.** → Adopt the two-tab popover; the Publish tab carries slug/domain + SEO toggle and ends in ONE primary Publish button that immediately yields URL + copy affordance.

**Pattern P3 — Post-publish state is a first-class state.** [inference from P1/P2 + repo] After publish: URL field + Copy + View + **Unpublish** in the same popover. The repo already carries unpublish-revocation semantics (commit `d50a6b2` "unpublish revocation" — [measured] from git log in session context), so the UI should promise exactly what that machinery enforces: unpublish revokes, immediately.

---

## 6. Pricing modal (founder's mockup)

**Pattern $1 — Contextual trigger beats generic modal.** [SS] The limit-hit moment is the highest-intent moment; a modal naming the exact blocked action and the specific plan that unlocks it converts meaningfully better than a generic plan grid ([Exposed Magazine on billing UX](https://www.exposedmagazine.co.uk/featured-articles/the-billing-ux-problem-killing-saas-freemium-conversion/), [DesignerUp](https://designerup.co/blog/how-to-design-paywall-subscription-and-upgrade-screens/)). **Convention (of the well-run kind).** → Top line of the modal states what the user was doing ("Publishing needs Pro"); the unlocking plan is pre-highlighted.

**Pattern $2 — Modals are small; don't cram the pricing page in.** [SS] Modal paywalls get less space — longform or carousel only if truly needed ([Adapty](https://adapty.io/blog/the-10-types-of-mobile-app-paywalls/)). → Two plans max inside the modal; the full comparison table is a link in the modal footer to the pricing page, not embedded.

**Pattern $3 — Smallest plan set that represents real choices; upgrade framed as progress.** [SS] One plan removes comparison, two separate flexibility vs savings, three need a stated reason; the upgrade should feel like progress, not punishment ([Eleken](https://www.eleken.co/blog-posts/paywall-examples), [Webstacks](https://www.webstacks.com/blog/saas-pricing-page-design)). → Free vs Pro in the modal, benefit-worded rows ("Publish unlimited sites") not feature-nouns.

---

## 7. Verification ceiling + follow-up

Every design claim above is [SS] (WebSearch summaries; pages not opened — WebFetch gate-blocked, non-allowlisted hosts sandbox-blocked) or [inference] (marked). No claim is image-verified against real screens — that is exactly what the Mobbin pass would add. **Follow-up that recovers the original task:** re-run this sweep in a fresh session where `mcp__mobbin__search_screens/flows` will pass the taint gate; the query set in §1-6 headers is ready to reuse verbatim, limit 6, platform web.