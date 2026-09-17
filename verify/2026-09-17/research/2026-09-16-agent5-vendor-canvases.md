Done. All five profiled from pages I opened myself.

---

## Vendor document surfaces, opened 2026-09-16

| Product | Opened URL | Free? | Edits a doc in place? | Markdown in/out? | Persists as a file/page? | Public link? | Offline? | Hands anything to a coding agent? | Verbatim price line |
|---|---|---|---|---|---|---|---|---|---|
| **ChatGPT canvas** (retired) | openai.com/index/introducing-canvas/ ; help.openai.com/en/articles/9624314-chatgpt-canvas | At launch: Plus/Team first | Yes — "You can directly edit text or code." | Not stated | Versioned in chat only | Not stated | Not stated | No | "Starting today we're rolling out canvas to ChatGPT Plus and Team users globally." |
| **ChatGPT writing blocks** (successor) | help.openai.com/en/articles/20001246-working-with-writing-blocks-and-code-blocks-in-chatgpt | "vary by plan… and rollout" | Yes — "Select the block and edit the text directly." | No markdown named; formatting is bold/italic/headings/links/lists/checklists | "Save supported document drafts to your Library, when available." | Code blocks only: "Share a read-only link for supported code blocks" | Not stated | No | chatgpt.com/pricing: "Free … ₹0/ month"; "Go … ₹399 / month"; "Plus … ₹1,999/ month" |
| **Claude artifacts** | support.anthropic.com/en/articles/9487310… ; /9547008-publishing-remixing-and-sharing-artifacts ; /9517075-what-are-projects | Yes | Yes — "For Markdown documents, you can edit in place" | **Yes** — "Documents (Markdown or plain text)"; "Download files to use outside the conversation" | Yes, sidebar Artifacts section after Publish | **Yes** — "Publishing (Free, Pro, Max): Makes your artifact publicly available. Anyone with the link can view and interact with it." | Not stated | Partly — MCP + "Artifacts are available in Claude Code on Team and Enterprise plans." | claude.com/pricing: "Free … $0 … Free for everyone"; Pro "$17 Per month with annual subscription discount ($200 billed up front). $20 if billed monthly." |
| **Gemini Canvas** | support.google.com/gemini/answer/16047321?hl=en&co=GENIE.Platform%3DDesktop ; /answer/14184041 | "you must be signed in to Gemini Apps" — no plan gate stated | Yes — "you can directly edit the text… Changes are auto-saved." | No markdown named. Exports: Docs, Slides, PDF, "Copy contents" | Yes, lives in the chat; auto-saved, versioned | **Yes** — "next to the g.co/gemini/share link, click Copy link" | Not stated | Code only — "Export to Colab", "Export to Replit" | none on the opened pages |
| **Microsoft Copilot Pages** | support.microsoft.com/en-us/microsoft-365-copilot/how-microsoft-365-copilot-pages-works ; /microsoft-copilot/using-copilot-pages | No — licence/storage gated | Yes — "Any changes you make are saved automatically." | No markdown; ".page and .loop files"; converts to Word/PowerPoint | Yes — "a dynamic, persistent canvas" | Shared inside the tenant (Teams, Outlook, M365 app) | Not stated | No | "If you have a personal Microsoft account, Copilot Pages is available if you're a Microsoft 365 Personal, Family, Premium, or Pro subscriber." |
| **Notion AI** | notion.com/help/guides/notion-ai-for-docs ; notion.com/pricing | Trial only | Yes — "press the space key on a new line and enter a prompt. Notion AI writes directly on the page" | "Export entire workspace as HTML, Markdown, & CSV" is a plan-table row | Yes, a Notion page | Yes — Free plan includes "Publish a Notion page to the web" | **Yes** — "Use Notion offline on the desktop and mobile app." | **Yes** — "Build on Notion and deploy Workers with code or coding agents." | "Free $0 per member / month"; "Notion Agent (chat, generate, autofill, translate) — Limited Trial"; "Free to try, then $10 per 1,000 monthly Notion credits." |

---

### A. Is "an AI box that writes a first draft into a document" free and universal?

Close to it, but not uniformly. At $0, from what I opened: **Claude** ("Free … $0 … Free for everyone … Write, edit, and create content"), **Gemini Canvas** (gated only on being signed in), and **ChatGPT** (writing blocks say availability "vary by plan… and rollout" — free access is not stated either way, and its Free tier is ₹0/month). **Copilot Pages** is not free: it needs Entra ID with SharePoint/OneDrive storage, or a paid personal subscription. **Notion AI** is not free: "Trial of Notion AI", "Limited Trial" in both the Free and Plus columns.

So three of five give something at $0 — the box is close to table stakes, but the *document* under it is not.

### B. Markdown FILE the user keeps, vs a chat-bound document

**Only Claude produces a markdown file.** Artifact types include "Documents (Markdown or plain text)", the artifact panel offers "Download files to use outside the conversation", and it handles multi-file markdown sets: "When Claude drafts content across multiple Markdown files, such as a skill or plugin, you can leave edit requests in several files before submitting."

Notion is second-best but indirect — the page is a Notion page, and markdown comes out only via a workspace-level export row.

Chat-bound or app-bound: ChatGPT writing blocks ("Save supported document drafts to your Library"), Gemini Canvas (exports to Docs/Slides/PDF, not a file you own on disk), Copilot Pages (".page and .loop files", convertible to Word/PowerPoint).

### C. Can any hand a document set to a coding agent?

Two, both partially.

**Claude.** "Artifacts are available in Claude Code on Team and Enterprise plans," and "Claude Code can publish its session output as an artifact—a live, interactive page at a private URL." It is the reverse direction of what you want: the agent publishes to the document, not the document to the agent. MCP is present but scoped to the artifact reading external services, not to handing a kit out.

**Notion.** The pricing page's Developer platform row says, verbatim, "Build on Notion and deploy Workers with code or coding agents," alongside "Public API" and Workers ("Run custom code on Notion to extend agents, sync data, and trigger workflows").

**Nobody ships a URL-or-file document kit an outside coding agent picks up.** Gemini's code path is Colab and Replit only. Copilot Pages ends at Word and PowerPoint.

### D. What they charge for that a small editor could charge for too

- **Persistence and the shared link** — Copilot Pages gates the whole persistent canvas behind a licence or storage; Claude gates Team/Enterprise link-sharing.
- **Metered agent runs** — Notion: "Free to try, then $10 per 1,000 monthly Notion credits."
- **Retrieval over your own documents** — Claude: "Enhanced project knowledge with RAG is only available to users with paid Claude plans."
- **Project count** — Claude: "Free users can create a maximum of five projects."
- **Offline** — Notion charges for the good tier of it: Free gets "Choose pages to download for offline use," paid gets "Recents and Favorites auto-download."
- **Version history** — Notion "Page history: 7 days / 30 days / 90 days / Unlimited."
- **Custom domain on a published page** — Notion: "Pay per domain."

### E. 2026 changes (dated pages)

**The big one: OpenAI retired canvas.** help.openai.com/en/articles/9624314-chatgpt-canvas, entry headed "GPT-5.5 Instant Update (May 28, 2026)":

> "With this update, canvas will no longer be available in GPT-5.5 Instant or GPT-5.5 Thinking. Writing and coding functionality is now supported directly in chat responses through writing blocks and code blocks. Paid users can continue using canvas for a limited time through legacy models until those models are sunset."

Corroborating: help.openai.com/en/articles/9930697 now returns "UH OH. THAT PAGE DOESN'T EXIST", and the 2024 launch post carries a banner, "This post covers the Canvas launch. For current ChatGPT writing and coding capabilities: Release notes". The replacement article is dated "Updated: 2 months ago".

Also dated 2026, from claude.com/product/claude-code: "Dynamic workflows… Blog May 28, 2026"; "Agent view: One place to manage all your Claude Code sessions. Blog May 11, 2026"; "Routines… Blog Apr 14, 2026".

Notion's pricing page carries an undated deadline for Workers: "Free to try now. Starts using credits on October 15." No year is printed.

---

**Read this against the risk being tested.** The AI box is table stakes. But the largest vendor just *moved backwards* on the document — canvas, a separate window with a version history, was replaced by an inline block whose saved home is a "Library", whose share link covers code only, and none of whose editing verbs the current page names. The 2024 verbs (reading level from Kindergarten to Graduate School, add final polish, add emojis) are gone from the live documentation. Nobody in the five hands a document set to a coding agent.

### Not opened
- `help.openai.com/en/articles/9930697-what-is-canvas` and `/9930697` — both 404, article removed.
- `learn.microsoft.com/en-us/copilot/microsoft-365/copilot-pages` — 404.
- `support.google.com/gemini/search?q=canvas` — 200 but results are JS-rendered; empty.
- `notion.com/product/ai` — fetched 200, not read; Notion facts above come from the help guide and the pricing page.
- Gemini and Copilot price pages — never opened, so no price line for either beyond Copilot's eligibility sentence.
- ChatGPT USD prices — the pricing page served Indian rupees from this location.