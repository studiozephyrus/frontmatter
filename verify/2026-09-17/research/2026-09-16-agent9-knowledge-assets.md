All claims verified against the files. Here is the report.

---

# What our own record already holds for the MVP 0 plan

Every claim below carries an absolute `file:line` and a quote I opened. The plan cites none of these sources: `grep -ci` on `docs/mvp0/MVP0-PLAN.md` returns **0** for `ecosystem.md`, **0** for `GitHub/knowledge`, **0** for `hack4bengal`, **0** for `skills.sgnk.ai`.

## 1. The personal knowledge base

**The topics you expected are not in it.** The base holds 175 synthesis notes; **171 are under `categories/ai`**, 4 under computer science. `/Users/sagnikmitra/Desktop/GitHub/knowledge/categories/business-startup/index.md:3` — "**0 notes**, grouped by type → subcategory." The same line, verbatim, at `categories/design/index.md:3` and `categories/content-marketing/index.md:3`.

Probing for the plan's actual subject matter: `freemium` matches 1 file, `go-to-market` 1, `local-first` 1, `paywall` 1, `product-led` 0, `word of mouth` 0, `virality` 0. The apparent hits are false. "activation" is neural-network activation (`categories/ai/books/book-foster-generative-deep-learning.md:91`: "**Activations:** ReLU / **LeakyReLU** (fixes dying ReLU)"). "local-first" is a bare tag link (`categories/ai/video/video-nateherk-claude-code-remote-control.md:94`: "Concepts: [[Local-first AI]]"). Obsidian appears only as a tool an agent writes into, never as a product analysis.

**So: onboarding and activation, freemium and pricing psychology, developer-tools GTM, editor UX, local-first software, and retention are absent from the base.** The plan's §5, §13 and §19 were researched from live vendor pages, which is the right call — there was nothing here to ground them in.

What the base *does* hold that bears on this plan:

| Note | Finding |
|---|---|
| `categories/ai/video/video-zhang-murag-dont-build-agents-build-skills.md:75` | The document kit already has a name and a shape: "skills are organized collections of files that package composable procedural knowledge for agents. In other words, they're folders." |
| same, `:129` | Against shipping the kit as a one-shot artefact: "start to treat skills like we treat software. This means exploring testing and evaluation... versioning... skills that can explicitly depend on and refer to either other skills, MCP servers, and dependencies" |
| same, `:174` | Bears on §19: "a skill built by someone else in the community will help make your own agents more capable, reliable, and useful" |
| `categories/ai/article/article-anthropic-agent-skills.md:66` | Kit structure: "skills let Claude load information only as needed." And `:75`: "If certain contexts are mutually exclusive or rarely used together, keeping the paths separate reduces token usage." A flat seven-file kit is the shape this argues against. |
| `categories/ai/article/article-anthropic-effective-context-engineering.md:57` | "LLMs have an attention budget... Every new token introduced depletes this budget by some amount." Bears on the 60,000-token blueprint in §6. |
| same, `:139` | "The presence of a file named test_utils.py in a tests folder implies a different purpose than a file with the same name located in src/core_logic/." Kit *filenames and paths* are load-bearing signal, not cosmetics. |
| `categories/ai/books/book-huyen-ai-engineering.md:156` | Bears on §22: "**User feedback = the moat.** Signals: **explicit** (thumbs, ratings, corrections) vs **implicit** (acceptance, edits, regeneration, churn)." The plan ships accept/reject in the UI (11 mentions) but §22's funnel does not measure AI-suggestion acceptance. |
| same, `:146` | "**Service-level:** batching... **prompt caching**, request routing." The plan mentions prompt caching **0 times** despite a 60,000-token blueprint. |
| `categories/ai/article/article-willison-lethal-trifecta.md:105` | "Exfiltration does not require a literal email — any outbound HTTP, image fetch, **markdown image render**, or PR/issue create can leak the data." An editor that renders untrusted markdown, runs AI over private documents, and writes to GitHub assembles all three legs. |
| `categories/ai/article/article-husain-field-guide.md:100` | On §21 ordering: "Integrated Prompt Environments (admin modes in the product) beat external prompt playgrounds." |
| `categories/ai/video/video-saraev-ai-agents-full-course.md:529` | A worked community funnel at scale: a **free** Skool community, "**428.3k members** at ingest", whose offer is "free Claude Code skills + GitHub repos, resource guides, **100+ n8n templates**, a **7-Day AIS Challenge**". The note flags the framing: `video-nateherk-ai-will-replace-millions-prepare.md:88` — "Member-count framing is self-interested marketing." |

## 2. Reusable assets in our own repos

**A. Diagram primitives — `frontmatter/decisions/diagram.js` (29,335 bytes).** Ten primitives in one dispatch table at `:525-528`: `screen, flow, state, compare, ba, arch, timeline, matrix, file, funnel`. The file's own header at `:5` is stale — it says "Nine primitives" above a list of ten.

Against the plan's §S16 requirement (`docs/mvp0/MVP0-PLAN.md:206`: "render a pie, bar or line chart from the table"):

- **Bar chart already exists, unnamed.** `funnel` is a horizontal bar chart. `:514` — `var bw = Math.max(3, (Math.abs(s.n) / max) * (W - PAD * 2 - labW - valW));` — value-to-pixel scaling, a `rect()` per row, value label after the bar. Missing: axes, vertical orientation, multi-series.
- **Line chart: new code, small.** The coordinate projection exists at `:451` (`var px = ox + p.x * size, py = oy + (1 - p.y) * size;`) with dashed axes at `:441-442`. Missing only a polyline emitter. Verified: `grep -n "polyline"` returns nothing.
- **Pie chart: entirely new code.** No arc, no `<path>` builder, no trig. The only `<path>` in the file is the arrowhead marker at `:99` — `'<path d="M0,1 L9,5 L0,9 z" fill="var(--ink-4)"/></marker>'`.

Elsewhere: `sgnkos/src/components/analytics/LightweightCharts.tsx:34` exports `SimpleColumnChart` built from Tailwind divs, not SVG — zero-dependency and liftable as-is.

**B. Service workers — four, no outbox.** `md/public/sw.js` is **byte-identical** to `frontmatter/public/sw.js` (verified with `cmp`). Its strategy at `frontmatter/public/sw.js:4-7`: "Never cache HTML navigations (always network) so a new deploy is picked up instantly... Static `/_next/static/*` chunks: stale-while-revalidate." Richer: `pwa/sw.js` (267 lines) has content-hashed cache naming (`:8` — `const VERSION = 'pwalab-d69cfa5fe8';`), a Web Share Target handler (`:146`), and Background Sync (`:248`). `adv/public/sw.js` (242 lines) runs a three-bucket cache. **An offline outbox does not exist in any repo** — no IndexedDB replay queue, and serwist/workbox appear only as prose in docs.

**C. Razorpay — one real implementation, and it is complete.** `lumiera/api/verify-payment.ts:76-79` does HMAC-SHA256 over `` `${orderId}|${paymentId}` ``, enforced at `:198` — `if (expected !== signature) { sendJson(res, 400, { success: false, error: "Signature mismatch" });`. Separate webhook signing at `:82`. Refunds over raw REST in `lumiera/api/_lib/razorpay.ts:24`. Order creation with promo/shipping math in `lumiera/api/create-order.ts`, secrets read via `requireEnv` only. Pure Node crypto, no framework coupling — drops into a Next.js route handler. A Playwright spec exists at `lumiera/tests/specs/d-payment-razorpay.spec.ts`. Stripe equivalent already in Next.js App Router shape at `hq/src/app/api/billing/checkout/route.ts`.

**D. Firebase.** The best setup is already in this repo: `frontmatter/src/shared/infrastructure/firebase/client.ts:19-31`, a named-app singleton with a Fast-Refresh race guard, reason stated at `:9-10`. **Firebase Storage is not wired anywhere** — `getStorage` returns zero hits across all repos. One hygiene item: `es/client/src/firebaseconfig.ts:7` carries a hardcoded Firebase web `apiKey` literal in source. These are project identifiers rather than secrets, so this matters only if that project's rules are permissive — unread.

**E. Tauri — three configs, no new capability.** `frontmatter/src-tauri/tauri.conf.json:3-5` and `md/src-tauri/tauri.conf.json` are the same shell. The third, `m2web-redesign/landing/src-tauri/tauri.conf.json:41`, adds `"targets": ["app", "dmg", "msi", "nsis"]` — Windows bundling, on an older schema. All three load a remote origin rather than a bundled dist, which is exactly the gap `MVP0-PLAN.md:376` already names. The ecosystem record agrees this is the only proof we have: `md/Zephyrus/ecosystem.md:280` — "Tauri desktop (Rust shell) | sgnk-md".

**F. The scoring tools — both importable, and one already imports the other.** `sgnkai/scoring/gate.py` (21,792 bytes) runs three tiers, `:17-22`: "BLOCK near-zero false positive rate... WARN real signal, fallible. Surfaces, never blocks. INFO measured and reported, explicitly not judged." BLOCK checks: model-artifact, invisible-unicode, attested-reject, em-dash, plus six promoted from WARN. Flags at `:448-451`: positional `text`, `--file`, `--json`, `--strict`. Exit 0/1 at `:466` and `:491`.

**Both are server-route-ready.** `gate.py:414` is `def run(text: str) -> dict` — text, not a path; file I/O is confined to `main()`. `simplicity.py:122` is `def check(text: str) -> list` and `:209` `def measures(text: str) -> dict`, documented at `:210` as "Numbers, reported and never judged." The proof is that `gate.py:434-436` already does it: `import simplicity` / `plain = simplicity.check(strip_quoted(text))`. One caveat: `gate.py:39` mutates `sys.path` at import time to reach sibling `patterns.py`. `simplicity.py` never blocks — every return path is `return 0`, and `:250` prints "None of these block."

## 3. The ecosystem record

`md/Zephyrus/ecosystem.md`, `hq/docs/ecosystem.md` and `GitHub/ecosystem.md` are byte-identical (verified with `cmp`). **It is stale for this purpose**: `:7` — "last synced 2026-06-06". The word "frontmatter" appears once, at `:969`, and only as "gray-matter frontmatter parsing". There is no card for this product. Client-engagement sections (§6) are skipped as client material.

**(a) What already shares an audience or a component.**

- **sgnk-md** (`:938`) is this codebase's predecessor and already ships the MVP 0 substrate: `:974` "CodeMirror 6 with vim mode, markdown language, search/replace, multi-cursor; idb-keyval for local autosave"; `:977` AI assist "Complete / refine / summarize / suggest-links / link-doctor endpoints; provider-agnostic"; `:979` "History, snapshots, restore-to-version"; `:980` "`/p/[slug]` public reader pages"; `:981` "PDF (via headless Chromium) + whole-vault export".
- **skills-registry / skills.sgnk.ai** (`:2134`) — "one canonical registry of AI agent skills (**184 skills**)... and mirrored to HQ landing, the md vault, Obsidian, and the public catalog". The plan's §19 step 2 routes shared blueprints through `skills.sh`; the studio already owns a live public skill catalogue and a sync engine with content-hash conflict detection, and the plan does not mention it.
- **CareerOS** (`:1087`) already has the credit engine §6 specifies: "`user_credits`, `plans`, `plan_entitlements`, `billing_customers/subscriptions/transactions/webhook_events`". Reuse-map row `:312`: "**3-tier AI cost model** (budget/standard/premium per request + usage log)... `ai_usage_logs`". Row `:315`: "**Runtime feature registry + plan entitlements + kill switches + owner bypass**" — which is the server-side cap-setting §6 says it needs.
- **pdf / pdf.sgnk.ai** (`:2282`) — "19 PDF tools that run **entirely in the browser** — no uploads, no server", stack at `:2300` including `jspdf`, `html2canvas`, `pdf-lib`, `tesseract.js`. Directly supports `MVP0-PLAN.md:655` ("wire the browser PDF path that exists, delete the server route").
- Other reuse rows that map onto the plan: `:311` multi-provider AI gateway; `:302` "Versioned digital prescriptions (draft → finalize + parent chain + printable)" for §15 document history; `:320` hexagonal Next.js with lint-enforced boundaries.
- **Hack4Bengal** (`:3491`) — "Eastern India's Largest IRL Hackathon... Built, executed & community-created by founder Sagnik Mitra. MLH member". The plan's §19 builds a community from zero and never mentions the one the studio already runs.

**Stack divergence, stated as fact.** `:172` — "Database | Supabase (Postgres) default". The plan uses Supabase **0 times**; it chooses R2 + Firestore + Durable Objects. The record shows **zero** Durable Objects precedent (`grep -ci` = 0), R2 used only for OG assets (`:2050`), one Cloudflare Workers project (`:279`, `lossless`), and Firestore only on one product (`:1586`).

**(b) Pricing precedents in rupees** — §4.8, `:416`, "Replicate = how long would it take us to rebuild this from scratch with our current team and tooling?" Relevant rows: `:434` "AI career / hiring platform (CareerOS scale, 60+ features, feature registry, credits) | 24–36 weeks | ₹25–50L"; `:426` "Static report or single-file artifact | 1–3 weeks | ₹50k–2L". Two floors that bear on a product business: `:449` — "**Founding-client launch rate** ≈ 50–60% of these numbers"; `:453` — "**AMC / retainer post-launch**: ₹50k–2L/month for active development; ₹15–40k/month for SLA-only maintenance." Note the unit mismatch: every price in this record is per-project in lakhs; the plan sells at ₹299/month.

**(c) Capacity and who builds.** `:113` — "Creative + engineering studio: brand design, client websites/apps, our own software products, and the Hack4Bengal community". `:118` — "~280 GitHub repos · 9 owners · 33 Vercel projects". Two founders (`:126-127`), and the second is "now Manager-Eng at Commonwealth Bank of Australia". Seven others listed at `:136-143`, of whom two are design leads, one a business analyst, and four are developers attached to named projects. **sgnk-md's own card says the team was one person**: `:955` — "Sagnik Mitra (sole, 216 commits)". The studio's own build SOP is `:618` — "Phase 1 — Build (**5–8 weeks for an MVP**; longer for enterprise)", against `MVP0-PLAN.md:720` ("Everything above: 99 to 168 engineering days") at the rate in `:530` ("1.21 engineering days a week... the last thirty days measured 0.70").

## 4. Promising ideas the plan does not carry

Ten, each verified against the plan's Appendix A (`:755-878`). Already-in-MVP-0 items were discarded.

1. **Generate and edit the agent instruction files.** `docs/GENERATION-SURFACE-2026-09-13-2113.md:58` — "| `CLAUDE.md`, `AGENTS.md`, `.cursorrules` | days | **Yes. Nobody serves this well** |". Size: **days**. Same file `:61`: "The third row is the one I would move on first, and it is not in the plan anywhere." The plan defers it to MVP 1 (`:868`).
2. **Per-span review state.** `docs/research/2026-09-13/round3-editor-matrix.md:49` — "none of the eleven editors checked here has a per-span review-state feature". No size stated. Explicitly cut at `MVP0-PLAN.md:285`.
3. **Per-span attribution of what an agent wrote.** `docs/research/2026-09-09/BRIEFING.md:94` — "**Attribution of which spans an agent wrote.** No platform shipped it". No size stated. Not in Appendix A.
4. **Correct rendering of nested constructs in list items.** `docs/PRODUCT-BRIEF.md:25` — "The rendering bug this plan treats as a week-2 channel has **501 likes, 117 posts, 18,331 views**." Deferred at `MVP0-PLAN.md:325`.
5. **One-command deck export, fixed template, no options.** `docs/BRIEF-v16-2026-09-14.md:197` — "slides as one command with one template and no options, which is days of work". Size: **days**. No slide row exists in Appendix A.
6. **Repo docs scan, with no model.** `docs/GAPS-2026-09-08.md:95` — "the repo docs scan derives stale sections, broken links and missing documents from git dates and the tree (F, no model)". No size. Zero hits for "stale section" or "broken link" in the plan.
7. **Bring-your-own key plus a hide-all-AI switch.** `docs/GAPS-2026-09-08.md:79` — "Bring-your-own key and a hide-all-AI switch (E)", where `(E)` is defined at `:77` as "evidence-backed (primary sources, verified twice)". MVP 0 ships only metered first-party credits.
8. **Answer in place.** `docs/GAPS-2026-09-08.md:95` — "answer in place closes the questions an agent left (E, small)." Size given only as **small**.
9. **A public, forkable gallery of generated kits at indexable URLs.** `docs/research/2026-09-13/round3-promotion.md:148` — "**A public, forkable gallery of generated kits at unlisted-but-indexable**", ranked second of three in that file's evidence list. The plan has an opt-in index of published *documents*, no kit gallery and no fork.
10. **Method-stamped documents with a `verify:` array.** `docs/research/2026-09-13/round2-doc-kit.md:50` — "a doc that states its own method... is the strongest pattern found." And `:51` — "`specs/engine/splice-writer.md`'s `verify:` array of literal shell commands plus a numeric exit condition — an agent can mechanically check whether it succeeded." The blueprint ships a consistency check but no method stamp.

Also rated but weaker, all from `docs/GENERATION-SURFACE-2026-09-13-2113.md`: glossary extraction (`:59`, "days | Small"), changelog from the git log (`:60`, "days | Small"), ADRs from decisions (`:111`, "days | Small audience, cheap, fine to have"). One non-feature gap worth naming: `docs/GAPS-2026-09-08.md:48` calls the VS Code extension form factor "**Never weighed. This is the largest unreasoned decision in the plan.**"

---

**One caveat on method.** The ecosystem record is 102 days stale and has no card for this product, so its capacity, status and stack lines describe the studio as of 2026-06-06, not today. Everything else above was opened in this session.