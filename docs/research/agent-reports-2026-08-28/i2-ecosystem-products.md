# Internal sweep — Studio ecosystem: products + reuse map → frontmatter

**Source of record:** `/Users/sagnikmitra/Desktop/GitHub/md/Zephyrus/ecosystem.md` (6,401 lines) — §4.5 capability matrix (L194–284), §4.6 reuse map (L286–332), §5 product cards (L767–2457), §8 internal tooling (L3576–3725), §9.8 monograph (L3841–3859). Lineage claims cross-verified against `/Users/sagnikmitra/Desktop/GitHub/frontmatter` (git log, `docs/FRONTMATTER-PRODUCT-PLAN.md`, `src/modules/`). All line numbers below refer to ecosystem.md unless another path is given. No files were modified (read-only sweep).

---

## 0. Critical framing fact: frontmatter has NO card in ecosystem.md

`grep -in frontmatter` over ecosystem.md returns exactly one hit — L969, sgnk-md's "gray-matter frontmatter parsing" capability. The ecosystem source-of-truth does not yet know the frontmatter product exists. Meanwhile the frontmatter repo itself proves its lineage:

- First commits (`git log --reverse` in `/Users/sagnikmitra/Desktop/GitHub/frontmatter`): `b9ddcfe Hello frontmatter` → `0c1b427 feat: clone md app into frontmatter (product base)` → `8eb4de2 feat: Firebase backend foundation, product docs, Tauri shell, frontmatter rebrand` (37 commits total; remote `studiozephyrus/frontmatter`).
- `docs/FRONTMATTER-PRODUCT-PLAN.md` L3: "**Starting codebase:** this repo (`md`, branch `stabilize/md-uplift`, deployed at md.sgnk.ai)".
- `src/modules/` = sgnk-md's exact 11 modules (ai, app-shell, auth, drafts, editor, export, graph, preview, repository, share, vault) **plus two new: `ai-tools`, `mdmax`**.

So every sgnk-md asset in this report is not "liftable" into frontmatter — it is **already frontmatter's foundation**. The lift question applies to the *other* products. A `sgnk-ecosystem-sync` card-add for frontmatter is needed (flagged, not performed — RULE 4).

---

## 1. Per-product cards

### 5.2 sgnk-md — GitHub-backed markdown vault (web + macOS) — L938–1043
- **What it is:** Obsidian-replacement markdown app whose vault IS a GitHub repo; web (md.sgnk.ai) + Tauri macOS app (`ai.sgnk.md`); PROD; 216 commits (L941–945).
- **Markdown-relevant capabilities:** the whole thing — CodeMirror 6 + vim editor (L970), GFM/KaTeX/mermaid/highlight preview (L971), force-graph view (L972), minisearch full-text (L973), AI assist endpoints complete/refine/summarize/suggest-links/link-doctor over 4 providers (L974, L1008), versioning/snapshots/restore + unlinked-mentions (L975), public share `/p/[slug]` with conflict handling (L976), PDF + whole-vault export via headless Chromium (L977, L1011), gray-matter frontmatter parsing + commit-to-GitHub + conflict-aware writes (L969), hexagonal 11-module architecture with `npm run arch` gate (L979, L1014–1015).
- **Liftable per reuse map:** §4.6 L311 "Multi-provider AI gateway (Gemini default, Lovable/Groq/Cerebras/OpenRouter failover)"; §4.6 L320 "Hexagonal Next.js modular monolith with lint-enforced boundaries". Both are already inside frontmatter via the clone.
- **Customer/surface verdict:** it IS frontmatter's ancestor AND its first customer corpus — "this very doc lives at `md/Zephyrus/ecosystem.md`; also the destination for skills-registry, HQ project notes, and Daily Sync" (L943). The md repo (the vault data) is a ready-made dogfood corpus of hundreds of real notes. **Consolidation decision required — see §3.**

### 5.1 HQ — studio operations control plane — L794–937
- **What it is:** private command-center pulling GitHub/Vercel/Cloudflare/Supabase/Sentry/Render/Netlify/Notion/Google into one view; PROD at hq.sgnk.ai; 33 modules, 12 migrations, multi-tenant SaaS spine behind flags (L797–801).
- **Markdown-relevant capabilities:** Daily Sync = **server-rendered Markdown feed** at `/daily-sync` with push-ingest API `/api/daily-sync/ingest` (L832, L895–896); react-markdown+remark-gfm in stack (L813); `notes` table in core schema (L910); `/skills` catalog reads `skills.registry.json` (L878); per-project Codex briefs (L827).
- **Liftable per reuse map:** §4.6 L317 pooled multi-tenant RLS (`workspace_id` + `app.current_workspace_id()` + scopedDb — "mandatory pattern for India SaaS"); L318 push-first ingestion (HMAC webhooks + idempotency + outbox); L319 CQRS read-model rollups behind flags; L316 connector pattern (per-provider adapter with shared port); L320 hexagonal arch gates. Plus billing scaffolding (`plans`/`subscriptions`/`usage_events`, L838/916) and versioned public API + OpenAPI (L837, L903–905).
- **Customer/surface verdict:** **strongest internal customer.** Ops reports, daily stand-ups, incident timelines, project briefs are all documents; HQ already ingests and renders markdown pushed by agents. HQ should consume frontmatter as its document layer instead of growing its own (mild overlap via `notes` + react-markdown, see §3).

### 5.12 skills-registry — unified AI-skill sync — L2134–2172
- **What it is:** canonical registry of 184 AI agent skills scanned from Claude/Codex/Antigravity, normalized and mirrored to HQ, the md vault, Obsidian, and public skills.sgnk.ai; active (L2137–2139).
- **Markdown-relevant capabilities:** every entry is normalized to **`skill.md` + `workflow.md`** (L2137, L2152) — skills ARE markdown documents with structured metadata; `skills.registry.json` content-hashed source of truth (L2162); conflict reports, never clobbers (L2163); `generate-hq-index.mjs` writes grouped Index.md MOCs into HQ + md vault (L2164); public Next.js catalog with per-slug pages + feed.xml (L2165). Related row on sgnk-md: "writes Skills/ here" (L961).
- **Liftable:** the zero-dep sync engine pattern — scan → normalize → content-hash → fan-out → soft-delete to `_Archived/` (L2152) — is the blueprint for frontmatter's multi-destination vault sync and for "collections of structured markdown" (registry-as-vault). §4.6 has no dedicated row but §5.12 pitch names "content-hash-based dedupe with conflict reports → reusable" (L2170).
- **Customer/surface verdict:** **yes — a frontmatter customer twice over**: (a) skill entries are exactly frontmatter's thesis (markdown + typed metadata + rendered catalog); (b) it proves the agents-as-authors loop — AI agents already read/write this markdown corpus.

### 5.9 sgnk Markex (content.sgnk.ai) — social scheduler + publishing agent — L1774–1902
- **What it is:** "Google Calendar for social posts" — schedule once, per-channel variants, backend agent auto-posts to FB/IG/LinkedIn/X with retry/backoff; active, most recently committed track (L1777–1781).
- **Markdown-relevant capabilities:** `content_items` carry title/description + per-channel copy fields + media + publish targets (L1870) — i.e., **scheduled posts are documents with structured metadata**; Gemini caption/hashtag assist (L1810); per-channel character/format awareness (L1807).
- **Liftable per reuse map:** §4.6 L297 distributed cron-safe job claim (`claim_due_publish_jobs` with `FOR UPDATE SKIP LOCKED`, L1813/1878); L298 OAuth token vault (AES-256-GCM at rest + refresh + revocation, L1812/1871); L299 multi-platform publisher (`server/publishers/*`, L1858–1864). pg_cron+pg_net tick pattern beats Vercel Hobby cron (L1815).
- **Customer/surface verdict:** **yes.** The natural product bridge: author a post as a frontmatter document (frontmatter block = channels/schedule/variants) → Markex machinery publishes it. Gives frontmatter a "documents that ship themselves" story no competitor in the product plan's 20-app matrix has.

### 5.11 sgnk Brand OS (guideline-forge) — brand-guidelines builder — L2029–2133
- **What it is:** AI-assisted brand-book builder (upload assets → AI generates mission/vision/voice/tagline → edit color/typography/logo → preview → publish + download); MVP/active, 176 commits mostly Lovable-authored (L2032–2036).
- **Markdown-relevant capabilities:** a brand book is a **structured document with custom renders** — color tokens, typography scales, logo variants as visual blocks (L2063–2069); hosted shareable preview `/preview/:projectId` (L2068/2093); `project_versions` document versioning (L2070/2119); AI copy generation edge fn (L2061, L2103–2107).
- **Liftable per reuse map:** §4.6 L313 AI brand-copy generator ("Any brand/marketing product"); image-crop asset upload + project versioning (L2131).
- **Customer/surface verdict:** **yes — the clearest "custom renders" proof case.** Brand guidelines are exactly the document class frontmatter's thesis targets (markdown source + token/palette/type-specimen render blocks). Long-term overlap risk noted in §3.

### 9.8 monograph — physics/geometry visual compendium — L3841–3859
- **What it is:** interactive compendium of theoretical-physics & geometry visualizations (manifold/Lie-group/string-theory galleries + Unified Theory deep-dive); Vite+React+Plotly+KaTeX; active, monograph.sgnk.ai (L3841–3853).
- **Markdown-relevant capabilities:** the studio's proof that **documents want interactive embedded visualizations** — KaTeX + Plotly charts inside long-form explanatory content; §13 index groups it with sgnk-md/adem/lossless under "KaTeX + Mermaid" (L5663).
- **Liftable:** no reuse-map row; the liftable thing is the concept + component patterns: lazy/code-split gallery routes, chart components as embeddable blocks (L3853). [inference] These become frontmatter custom-render blocks (```plot / ```math-figure).
- **Customer/surface verdict:** **yes — flagship demo content.** Rebuilt as a frontmatter vault with custom renders, monograph is the "this is what a document can be" showcase.

### 5.10 Advox — citation-gated legal AI — L1903–2028
- **What it is:** two-persona legal AI (layman `/ask`, advocate workspace) over RAG on Indian court/statute sources; fails closed if citations can't verify; MVP v0.1.0 (L1906–1910).
- **Markdown-relevant capabilities:** case workspace = `legal_cases` + `case_documents` + `case_notes` (L1940/2009) — advocate research output is documents; `document_analyzer` agent extracts clauses/parties/dates (L1984); `ai_interactions` + `ai_response_citations` audit trail (L1941/2008).
- **Liftable per reuse map:** §4.6 L321 **citation-gated RAG** (fail-closed `citation_verifier` — "Any RAG product in regulated/compliance domains"); L322 temporally-aware fact retrieval (`LEGAL_TRANSITION_DATE` — answers change by as-of date); L323 compliance-safe scraping; plus PII-scrub-before-embed (L1938/2026) and the multi-agent FastAPI layout (L1934).
- **Customer/surface verdict:** donor first, customer second. The citation-gated pattern is the **trust core of frontmatter's AI protocol**: "ask your vault" answers that cite specific notes and refuse when ungrounded. Advocate case workspaces are themselves a frontmatter-shaped document surface.

### 5.3 sgnk CareerOS — AI career platform — L1044–1163
- **What it is:** 71-page, 65-feature career OS (resume upload → 9-card AI scoring → builder → export → jobs → interviews → portfolio); PROD at os.sgnk.ai; 1091 commits, 43 migrations (L1047–1051).
- **Markdown-relevant capabilities:** resumes/cover letters/portfolios are documents; **Export Center: PDF / DOCX / LaTeX via edge functions** (L1075/1095); Humanizer + rewrites + JD-tailoring as document transformations (L1076); compare-versions/compare-analytics (L1075); hosted portfolio publish (L1080).
- **Liftable per reuse map:** §4.6 L314 9-card resume scoring framework — explicitly generalized to "**Any document-scoring product (essays, JDs, contracts, audits)**"; L315 runtime feature registry + plan entitlements + kill switches + owner bypass; §4.6 L312 (via INW) 3-tier AI cost model; CareerOS's own credits engine `user_credits`/`plans`/`plan_entitlements` + Stripe-ready billing (L1087/1142–1143).
- **Customer/surface verdict:** donor of frontmatter's **entire monetization + governance spine** (flags, plans, credits, AI metering) and of a "document quality score" feature; its document-generation suites are a vertical frontmatter could later absorb as templates.

### 5.13 stock (Investment Bible OS) — L2173–2224 and 5.14 trade (sgnk Trades) — L2225–2278
- **What they are:** stock = Turborepo equity decision OS, 43 Prisma models, worker-generated digests, WIP (L2176–2180); trade = Chartink/TradingView scraper dashboard with scores, active, trade.sgnk.ai (L2228–2232).
- **Markdown-relevant capabilities:** stock's **digest pipeline** — pre-market/post-close/weekly/month-end digests "generated by worker, archived + browsable" (L2205) — is scheduled generated-documents as a product feature; stock's Learning hub = "knowledge documents/sections/concepts + glossary + ambiguity ledger" (L2210) — a knowledge vault inside another app; per-stock notes + journal (L2207). trade's hand-written spec docs (`docs/swing-expansion-indicators.md`, L2249) show docs-as-source-of-truth.
- **Liftable per reuse map:** trade: §4.6 L325 GitHub-Actions-as-cron; L326 committed-JSON-snapshot deploy (serve a static snapshot on Vercel); L324 Pine→Python translation pattern (not frontmatter-relevant). stock: no reuse row; the digest-worker pattern is the lift. [inference]
- **Customer/surface verdict:** **yes, as generated-document producers.** AI/worker-generated digests and journals are documents; frontmatter's "scheduled generated docs" feature has two live internal precedents.

### 5.15 pdf — in-browser PDF toolkit — L2279–2316
- **What it is:** iLovePDF-style suite of 19 tools running entirely client-side (no uploads, files never leave the machine); early, pdf.sgnk.ai (L2282–2285).
- **Markdown-relevant capabilities:** the **document conversion arsenal**: pdf-lib, pdfjs-dist, jspdf, jszip, docx, mammoth (docx→html), xlsx, html2canvas, tesseract.js WASM OCR, dompurify (L2297); declarative tool registry + shared ToolShell (L2283/2298); conversion families incl. html-to-pdf, word-to-pdf, pdf-to-word, ocr-pdf (L2306–2310).
- **Liftable:** the whole client-side conversion layer → frontmatter import/export (docx↔md, pdf→md via OCR, md→pdf without a server) with a privacy story ("files never leave your machine") that matches the product plan's trust theme. Reuse map references it as client OCR proof (§4.5 L230).
- **Customer/surface verdict:** less a customer, more an **absorbable engine + standalone SEO funnel** (pdf.sgnk.ai already ranks-able utility traffic). See §3.

### §8 Internal tooling — L3576–3725 (quick hits)
- **8.1 zs-agents** (L3578–3599): 17 reusable Claude/Codex skills — all markdown skill files; more markdown-corpus evidence, minor direct lift.
- **8.2** points back to skills-registry (L3601–3602).
- **8.3 testing** — Framer→GitHub-Pages pipeline (L3604–3634): multi-tenant deploy queue; marginal to frontmatter (static publishing precedent only). [inference]
- **8.5 cli-printing-press** (L3650–3665): third-party generator of "token-efficient CLIs + Claude skills + MCP servers" — its outputs are markdown skills; relevant only as corpus.
- **8.6/8.7 zephyrus.studio + ZS social campaign** (L3667–3723): brand statement + multi-platform launch content — campaign copy with per-platform variants (L3714–3715) is again documents-with-channel-metadata, i.e., Markex/frontmatter-shaped content.

---

## 2. Cross-product synthesis — ranked unfair advantages for frontmatter

1. **The sgnk-md codebase itself (already cloned in).** A production markdown editor with vault-CRUD-on-git, live preview (GFM/KaTeX/mermaid), graph, search, versioning, share pages, PDF export, Tauri desktop, hexagonal arch gates — 216 commits of head start, verified as frontmatter's literal base (frontmatter commit `0c1b427`; plan doc L3). Competitors in the product plan start from zero on at least one of {web, files, desktop}; frontmatter starts with all three. (ecosystem §5.2; /Users/sagnikmitra/Desktop/GitHub/frontmatter)
2. **HQ's multi-tenant SaaS spine.** Pooled RLS `workspace_id` pattern + scopedDb, push-first HMAC ingestion + outbox + idempotency, CQRS rollups, versioned public API + OpenAPI, billing tables — every piece the product plan names as the gap before Wedge A ("sellable once multi-tenancy lands", FRONTMATTER-PRODUCT-PLAN.md) already exists behind flags in a sibling repo with the same architecture style. (§4.6 L316–320; §5.1)
3. **CareerOS governance + monetization layer.** Runtime feature registry, plan entitlements, kill switches, owner bypass, credit-metered AI with cost governance, Stripe-ready billing — solves frontmatter's rollout, paywall, and AI-cost problems (pain theme #3, "price backlash") with shipped code. Bonus: the 9-card scoring framework generalizes to document-quality scoring. (§4.6 L314–315; §5.3)
4. **Advox's citation-gated RAG.** Fail-closed citation verification + pgvector + PII-scrub-before-embed + temporally-aware retrieval — the trust architecture for frontmatter's AI protocol: vault answers that cite notes and refuse to hallucinate. This converts "AI in a notes app" from a liability into the differentiator, and unlocks regulated verticals (legal/medical/finance — where the pdf privacy story also lands). (§4.6 L321–323; §5.10)
5. **Markex's publishing agent.** `FOR UPDATE SKIP LOCKED` job queue + AES-256-GCM OAuth token vault + four platform publishers + retry/backoff — bolt this behind frontmatter and a document's frontmatter block becomes a publishing instruction: docs → scheduled multi-channel posts. No markdown editor in the researched competitor set ships this. (§4.6 L297–299; §5.9)
6. **The pdf repo's client-side conversion arsenal.** 19 in-browser tools (tesseract OCR, mammoth, docx, xlsx, pdf-lib) = frontmatter's import/export engine with a "files never leave your machine" privacy guarantee, plus a standalone acquisition funnel at pdf.sgnk.ai. (§5.15)
7. **skills-registry's sync engine + the studio's live markdown substrate.** Content-hash conflict detection, normalize + fan-out, never-clobber conflict reports — the design for multi-destination sync; and the studio already runs on markdown documents (ecosystem.md in the vault, Daily Sync into HQ, 184 skill.md files, digests, briefs) — an instant dogfood customer base of real corpora and real agent authors. (§5.12; §5.2 L943; §5.1 L832)
8. **Delivery infrastructure: GVC + arch-gate discipline.** One-name GitHub+Vercel+Cloudflare bootstrap to `*.sgnk.ai` in ~60s (§4.6 L331) and the lint-enforced hexagonal pattern proven across HQ/sgnk-md/INW/trade (§4.5.3 L272) — frontmatter can ship satellites (docs sites, share domains, funnels) at near-zero marginal cost without codebase rot.

---

## 3. Overlaps / consolidation decisions

### 3.1 sgnk-md vs frontmatter — THE decision (highest priority)
**Verified relationship:** frontmatter = clone of the md app (`0c1b427 feat: clone md app into frontmatter (product base)`), rebranded (`8eb4de2`), moved from `sagnikmitra/md` to `studiozephyrus/frontmatter`, extended with `ai-tools` + `mdmax` modules. sgnk-md remains PROD at md.sgnk.ai + Tauri `ai.sgnk.md` as Sagnik's daily-use live vault (ecosystem §5.2 L945), and ecosystem.md carries a full sgnk-md card but **no frontmatter card**.

**Open risks if left undecided:** (a) two diverging copies of the same editor — every CodeMirror/preview/proxy fix must land twice or silently fork (the mdmax Tier-1/2 fixes in frontmatter's recent commits, e.g. `d50a6b2` "CodeMirror sync", have no stated counterpart in md); (b) brand confusion — sgnk-md is pitched to clients as "the canonical markdown CMS answer" (§4.5 L223, §5.2 L982) while the actual product is now frontmatter; (c) the `/sgnk-md-update` skill, Tauri bundle id, and NextAuth single-user gate all bind to md.

**Recommended consolidation [inference, for the synthesis round]:** declare `studiozephyrus/frontmatter` the sole product codebase; freeze md's app code to critical-fix-only; keep the `md` repo permanently as the **vault data + first customer corpus**; when frontmatter reaches parity, redeploy md.sgnk.ai as a frontmatter instance pointed at the md vault; update ecosystem.md via `sgnk-ecosystem-sync` (add frontmatter card, mark sgnk-md's app "superseded by frontmatter, vault remains"). Not performed — RULE 4.

### 3.2 pdf vs frontmatter export module
Both do document conversion (frontmatter inherits sgnk-md's puppeteer PDF export, L977/1011; pdf ships 19 client-side tools, §5.15). Decision: absorb pdf's client-side converters as frontmatter's import/export engine (server-free, privacy-first) and keep pdf.sgnk.ai alive as a funnel — or keep them separate and duplicate conversion work. [inference: absorb-and-keep-funnel]

### 3.3 skills-registry vs frontmatter sync
Both solve "one markdown corpus, many destinations, no clobbering." The registry's scan→normalize→hash→fan-out engine (§5.12 L2152) should either become a frontmatter-powered surface (registry entries as a frontmatter collection with a catalog render) or donate its conflict-detection design — not evolve as a parallel third sync pipeline. [inference]

### 3.4 Brand OS — roadmap-level overlap
A brand book is a document with custom renders; guideline-forge is a separate Lovable SPA building exactly that (§5.11). Near-term: donor (AI copy gen, versioning). Long-term the "documents with rich render blocks" thesis says brand books become a frontmatter template/render pack; a second document-builder codebase competes with the thesis. Flag for a later roadmap decision — no near-term action. [inference]

### 3.5 HQ notes/Daily Sync — keep HQ a consumer
HQ has its own `notes` table + react-markdown rendering + markdown Daily Sync feed (§5.1 L813/832/910). It should consume frontmatter (API/embed) as its document layer rather than grow editor features; this makes HQ frontmatter's first paying-shaped integration instead of a competitor. [inference]

---

## 4. Notes for the synthesis round
- ecosystem.md's capability matrix already routes "Knowledge base / docs portal" asks to sgnk-md + perccent-docs (MDX + FlexSearch, "4-audience docs proven", §4.5 L223) — client-side demand for markdown doc surfaces is documented in the sales layer, not just the product layer.
- The studio's markdown gravity is total: the ecosystem doc, skills, stand-ups, digests, briefs, campaign copy, and specs are all markdown already. frontmatter's first ten customers exist in-house, each mapping to a distinct product feature (see hooks list).
- Unverified/out-of-scope here: current deploy state of md.sgnk.ai vs frontmatter, and whether any md-repo commits landed after the clone (would need md repo git log — not read this sweep).

## FRONTMATTER HOOKS (structured)

- **sgnk-md full editor stack — CodeMirror 6 vault editor, GFM/KaTeX/mermaid preview, graph view, minisearch, versioning, /p/[slug] share, Tauri shell (verified as frontmatter's cloned base)** -> frontmatter's core product surface — already in-repo; every §5.2 capability is shipped head start, not a lift  
  evidence: `/Users/sagnikmitra/Desktop/GitHub/md/Zephyrus/ecosystem.md (§5.2 L964-979) + /Users/sagnikmitra/Desktop/GitHub/frontmatter (git commit 0c1b427; docs/FRONTMATTER-PRODUCT-PLAN.md L3)`
- **Multi-provider AI gateway — Gemini default with Groq/Cerebras/OpenRouter failover (sgnk-md ai module)** -> Provider-agnostic AI assist (complete/refine/summarize/suggest-links/link-doctor) with cost/lock-in control for the AI protocol  
  evidence: `/Users/sagnikmitra/Desktop/GitHub/md/Zephyrus/ecosystem.md (§4.6 L311; §5.2 L974, L1017-1023)`
- **HQ pooled multi-tenant RLS pattern — workspace_id + app.current_workspace_id() + scopedDb belt** -> frontmatter workspaces/multi-tenancy — the product plan's named gap before Wedge A is sellable  
  evidence: `/Users/sagnikmitra/Desktop/GitHub/md/Zephyrus/ecosystem.md (§4.6 L317; §5.1 L825, L912)`
- **HQ push-first ingestion — HMAC-verified webhooks + idempotency keys + outbox + CQRS read models + versioned /api/v1 with OpenAPI** -> frontmatter sync/integration API: agents and services push documents into vaults; webhook fan-out on document events  
  evidence: `/Users/sagnikmitra/Desktop/GitHub/md/Zephyrus/ecosystem.md (§4.6 L318-319; §5.1 L835-837, L903-905)`
- **HQ Daily Sync — server-rendered Markdown feed with push-ingest endpoint (/api/daily-sync/ingest)** -> HQ as frontmatter's first internal customer: ops reports/stand-ups are markdown documents authored by agents and rendered in-product  
  evidence: `/Users/sagnikmitra/Desktop/GitHub/md/Zephyrus/ecosystem.md (§5.1 L832, L895-896)`
- **CareerOS runtime feature registry + plan entitlements + kill switches + owner bypass + credit-metered AI cost governance** -> frontmatter's monetization and rollout spine: plan gating, beta cohorts, panic kill, per-user AI credit metering  
  evidence: `/Users/sagnikmitra/Desktop/GitHub/md/Zephyrus/ecosystem.md (§4.6 L315; §5.3 L1049, L1086-1087, L1142-1143)`
- **CareerOS 9-card document scoring framework (fwrk.md) — archetype + seniority-aware, reuse map generalizes to 'any document-scoring product'** -> Document quality score / writing analysis feature (essays, specs, contracts, blog drafts) inside frontmatter  
  evidence: `/Users/sagnikmitra/Desktop/GitHub/md/Zephyrus/ecosystem.md (§4.6 L314; §5.3 L1074, L1148-1149)`
- **CareerOS Export Center — PDF / DOCX / LaTeX generation via edge functions** -> Multi-format document export beyond sgnk-md's Chromium PDF (md → DOCX/LaTeX)  
  evidence: `/Users/sagnikmitra/Desktop/GitHub/md/Zephyrus/ecosystem.md (§5.3 L1075, L1095, L1146)`
- **INW 3-tier AI cost model — budget/standard/premium per request + ai_usage_logs** -> Per-request AI tiering and usage logging for frontmatter's metered AI features  
  evidence: `/Users/sagnikmitra/Desktop/GitHub/md/Zephyrus/ecosystem.md (§4.6 L312)`
- **Advox citation-gated RAG — citation_verifier fails closed, pgvector corpus, PII-scrub-before-embed** -> Trust core of the AI protocol: 'ask your vault' answers that cite specific notes and refuse when ungrounded; unlocks regulated verticals  
  evidence: `/Users/sagnikmitra/Desktop/GitHub/md/Zephyrus/ecosystem.md (§4.6 L321; §5.10 L1935-1938, L1998-1999)`
- **Advox temporally-aware fact retrieval — LEGAL_TRANSITION_DATE swaps corpus semantics by as-of date** -> Version-aware vault answers: query a knowledge base as-of a date/document version  
  evidence: `/Users/sagnikmitra/Desktop/GitHub/md/Zephyrus/ecosystem.md (§4.6 L322; §5.10 L1939, L2019)`
- **Markex publishing agent — FOR UPDATE SKIP LOCKED job claim, AES-256-GCM OAuth token vault, FB/IG/LinkedIn/X publishers, retry/backoff, pg_cron tick** -> 'Documents that ship themselves': frontmatter block declares channels/schedule → multi-platform auto-publish of a note  
  evidence: `/Users/sagnikmitra/Desktop/GitHub/md/Zephyrus/ecosystem.md (§4.6 L297-299; §5.9 L1813-1815, L1858-1878)`
- **pdf repo client-side conversion arsenal — tesseract.js OCR, mammoth, docx, xlsx, pdf-lib, 19-tool declarative registry, zero uploads** -> Privacy-first in-browser import/export engine (docx↔md, pdf→md OCR, md→pdf serverless) + standalone acquisition funnel at pdf.sgnk.ai  
  evidence: `/Users/sagnikmitra/Desktop/GitHub/md/Zephyrus/ecosystem.md (§5.15 L2282-2310)`
- **skills-registry sync engine — scan → normalize to skill.md+workflow.md → content-hash → fan-out → conflict reports, never clobbers** -> Multi-destination vault sync design + 'structured markdown collections' surface (184-skill registry as a frontmatter-rendered catalog)  
  evidence: `/Users/sagnikmitra/Desktop/GitHub/md/Zephyrus/ecosystem.md (§5.12 L2152, L2161-2166)`
- **Brand OS AI brand-copy generator + color/typography/logo token editors + project_versions + hosted brand-book preview/publish** -> Custom-render proof case: brand guidelines as frontmatter documents with token/palette/type-specimen render blocks and AI-drafted copy  
  evidence: `/Users/sagnikmitra/Desktop/GitHub/md/Zephyrus/ecosystem.md (§4.6 L313; §5.11 L2061-2070, L2103-2119)`
- **monograph interactive compendium — KaTeX + Plotly visualizations embedded in long-form explanatory content** -> Flagship demo of custom-render blocks: interactive figures/math inside documents (```plot / math-figure blocks)  
  evidence: `/Users/sagnikmitra/Desktop/GitHub/md/Zephyrus/ecosystem.md (§9.8 L3851-3853; §13 L5663)`
- **stock digest worker — pre-market/post-close/weekly/month-end digests generated, archived, browsable; learning hub of knowledge documents + glossary** -> Scheduled generated-documents as a first-class frontmatter feature (AI/worker-authored reports landing in a vault)  
  evidence: `/Users/sagnikmitra/Desktop/GitHub/md/Zephyrus/ecosystem.md (§5.13 L2205, L2210)`
- **trade deploy patterns — GitHub-Actions-as-cron + committed JSON snapshot served by Vercel** -> Cheap static publishing/snapshot pattern for frontmatter public shares and scheduled rebuilds on free-tier infra  
  evidence: `/Users/sagnikmitra/Desktop/GitHub/md/Zephyrus/ecosystem.md (§4.6 L325-326; §5.14 L2261-2265)`
- **Clinix versioned digital prescriptions — draft → finalize + parent chain + printable, reuse map generalizes to 'any document workflow needing versioning + brand-themed PDFs'** -> Versioned document workflows with branded PDF output (draft/finalize states, lineage chain) in frontmatter  
  evidence: `/Users/sagnikmitra/Desktop/GitHub/md/Zephyrus/ecosystem.md (§4.6 L302)`
- **GVC bootstrap — one name → GitHub + Vercel + Cloudflare + live *.sgnk.ai in ~60s** -> Instant satellite surfaces for frontmatter (per-vault publish domains, docs funnels, campaign microsites)  
  evidence: `/Users/sagnikmitra/Desktop/GitHub/md/Zephyrus/ecosystem.md (§4.6 L331)`
