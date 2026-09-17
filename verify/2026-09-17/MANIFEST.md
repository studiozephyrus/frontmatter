# Verification pack, 17 September 2026

What is in this folder and where it came from. The plan under test is `docs/mvp0/PRODUCT-PLAN.md` at commit `7b49f84`; the screens were corrected at `e0ac6fa` (the blueprint's file count). The brief for the auditor is `CLAUDE-AUDIT-BRIEF-v2-2026-09-17.md`: a context section, fifty-two angles, written for Claude Code on a second account. It replaces `CLAUDE-AUDIT-BRIEF-v1-2026-09-17.md` (forty-five angles, no context section), kept for the record. It writes `CLAUDE-AUDIT-REPORT.md` and `CLAUDE-AUDIT-FINDINGS.jsonl` here and nothing else. The earlier briefs for GPT 6 (`GPT6-AUDIT-BRIEF-v2.2-2026-09-17.md` and its drafts) carry the same forty-five angles and are kept for the record; that run was stopped. The auditor writes `GPT6-AUDIT-REPORT.md` here and nothing else.

## research/ : thirty-one reports, 70,277 words

Each report was written by a read-only research agent from pages it opened on the date in the file name. They are raw material: quotes, counts and URLs, with the agent's own reading. Nothing in them was edited afterwards. Where a report says "not opened", the page failed and the number did not enter the plan.

File | Words | What it holds
2026-09-17-r1-free-llm.md | 2,354 | Free model providers for the pilot: Groq, Gemini, OpenRouter, GitHub Models, NVIDIA, Cerebras, Together, Mistral, Hugging Face, Cloudflare Workers AI, SambaNova, Anthropic, Ollama. Rate limits, training clauses, routing, capacity arithmetic, monthly cost at 1,000 users
2026-09-17-r2-stack.md | 3,284 | Cloudflare R2, D1, Durable Objects, Workers; Firestore and Firebase; Supabase; Neon, Turso, PlanetScale; Vercel; auth, live collaboration, search, email, errors and analytics. Three stacks costed at 1,000 users, first-bill thresholds, ceilings, verdict
2026-09-17-r3-free-tiers.md | 2,421 | Forty pricing pages: free document caps, AI metering models, GitHub gating, collaborator caps, public-page caps, first paid prices, and the recommendation
2026-09-17-r4-doc-mode.md | 2,605 | Sixty Google Docs features classified as plain markdown, extension, or not representable, against CommonMark, GFM, Pandoc, Tiptap, Typora, Bear, Milkdown, tui.editor and Obsidian
2026-09-17-r5-representations.md | 2,754 | Slides, mind maps, diagrams, kanban, timelines, charts, canvas, database views, site generators, PDF, forms, music and maths: renderers with licences, stars, downloads and input formats; the portfolio shape; the ship order
2026-09-17-r6-public-apis.md | 3,111 | The public-apis and free-apis directories; twenty APIs with quotas and terms; which run in the browser; which must never receive document text; document-editing APIs at Google, Microsoft, Notion, HackMD, Dropbox and Confluence
2026-09-17-r7-ecosystems.md | 3,122 | Notion integrations, templates, API and blocks; Google Docs add-ons; VS Code markdown extensions; Logseq and Joplin plugins; Craft, Bear, Typora and iA Writer features; plugin isolation at Obsidian, VS Code, Figma, Cloudflare and Deno; the twenty cross-ecosystem capabilities; gaps in the earlier plan
2026-09-17-r8-ux-principles.md | 3,476 | Nielsen, Laws of UX, Apple HIG, Material 3, Web Vitals, Shape Up, Jobs to be Done, the People + AI Guidebook and SOLID, quoted from their pages, mapped to screens; the sign-in-first argument; breakpoints
2026-09-17-r9-sharing-upload.md | 2,643 | Password and expiring links across eight products; folder upload and write-back support per browser; offline storage limits and eviction; Google Drive two-way sync mechanics and quota; the GitHub App model; settings-page precedents
2026-09-16-agent1-hackmd.md | 1,979 | HackMD: history, features, pricing, permissions, API, what to match and beat
2026-09-16-agent2-competitors.md | 2,805 | The wider competitor sweep: note apps, doc apps and AI planning tools, feature by feature
2026-09-16-agent3-google-docs-drive-bots.md | 2,051 | Google Docs onboarding friction, Google Drive API feasibility, and the no-captcha question
2026-09-16-agent4-community.md | 2,608 | Community platforms (dev.to, Skool and peers) for a later community feature
2026-09-16-agent5-vendor-canvases.md | 1,458 | Vendor canvases: OpenAI canvas retired, Claude artifacts, Gemini, Copilot pages
2026-09-16-agent6-agent-platforms.md | 2,024 | Kiro, Cursor plan mode, Antigravity, Claude Code, Spec Kit, CodeGuide, ChatPRD: what each generates and serves
2026-09-16-agent7-feasibility.md | 1,653 | Feasibility of the eleven additions: Word import, Drive, GitHub, Python on Vercel, Tauri signing, and more
2026-09-16-agent8-india-name.md | 1,695 | India pricing anchors, payment rails, and the name and domain check
2026-09-16-agent9-knowledge-assets.md | 2,437 | The studio's own reusable assets: advox docs and knowledge graph, Razorpay in lumiera, the credit engine in CareerOS, the decisions site primitives, skills.sgnk.ai
2026-09-16-coordinator-findings.md | 1,322 | The coordinator's synthesis of the nine agents above
2026-09-16-obsidian-plugin-demand.md | 556 | The Obsidian plugin registry ranked by downloads, and the share the top sixty take
2026-09-16-obsidian-requests-vs-us.md | 938 | Obsidian's thirty most-liked open requests against what frontmatter would ship
2026-09-16-obsidian-profile.md | 3,585 | Obsidian's product, pricing, sync, security audits, roadmap and its founder's agent-skills repository
2026-09-16-note-methods.md | 2,760 | Nine note-taking methods and what they agree and disagree on
2026-09-16-note-research.md | 2,685 | The research literature: folders against search, capture without filing, over-acceptance of AI edits
2026-09-16-mobile-ratings.md | 2,973 | Phone-app review counts: complaints and praise across the note apps
2026-09-16-switching-signals.md | 2,186 | The ten switching drivers with mention counts and the verbatim demands
2026-09-16-competitor-loyalty.md | 2,198 | What people love and lack in Obsidian, Notion, Bear, Notesnook, Anytype, AFFiNE and Joplin
2026-09-16-agent-era-standards.md | 2,569 | AGENTS.md, CLAUDE.md, SKILL.md, MCP, llms.txt: adoption, sizes, what agents read
2026-09-16-second-brain-market.md | 2,405 | The agent-memory market: who charges, who keeps the data, and the writing-surface gap
2026-09-16-plugin-parity.md | 990 | Every widely used Obsidian plugin against what frontmatter ships or builds, with sizes
2026-09-16-engine-baseline-draft.md | 630 | The twelve engine invariants and the two measured defects

## Also on this machine

- `docs/mvp0/PRODUCT-PLAN.md`, `docs/mvp0/SCREENS.md`, the two PDFs and the sixty screen images under `docs/mvp0/screens/`.
- `docs/mvp0/MVP0-PLAN-v3.md` (the long evidenced plan with a Sources table) and `docs/mvp0/MVP0-PLAN-print.md` (the revision 3 build sheet).
- `docs/research/2026-09-09/` and `docs/research/2026-09-13/`: the two earlier verified research rounds.
- The shipped code under `src/`, the decision cards under `decisions/v2/`.

## Not in this folder, on purpose

The agents' full transcripts, the session scratchpad, and anything under `aios/docs/10-client-inputs/`, which is under NDA and must not be read.
