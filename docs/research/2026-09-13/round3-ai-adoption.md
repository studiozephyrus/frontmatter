# R3, measured AI-feature adoption in writing and markdown tools

Date run: 2026-09-13. Rules: WebFetch/MCP refused this session; every source opened by curl or
via WebSearch result text and then re-fetched by curl. No quote appears unless matched in the
fetched text. All figures below carry the URL and fetch date.

## 1. Obsidian community plugins, AI plugin downloads

Source: `community-plugin-stats.json` and `community-plugins.json`, fetched 2026-09-13 from
`https://raw.githubusercontent.com/obsidianmd/obsidian-releases/master/community-plugin-stats.json`
and the sibling `community-plugins.json` (the manifest of names/descriptions; the stats file has
no names, only ids, so the two were joined locally). `downloads` in this file is Obsidian's
lifetime install counter, not weekly active use; treat it as a popularity floor, not usage.

Top genuinely-AI plugins by lifetime downloads (523 candidate ids matched on AI-related keywords;
manually filtered down to true AI plugins (the raw keyword match also caught non-AI plugins like
"Mermaid Tools" and "Rollover Daily Todos" on substring hits)):

| Plugin id | Name | Downloads | What it does (own description) |
|---|---|---|---|
| `copilot` | Copilot | 1,875,423 | "Run AI agents such as Claude Code, Codex, and OpenCode inside your vault." |
| `smart-connections` | Smart Connections | 1,198,593 | "Find related notes and excerpts while writing. Your AI link building copilot..." |
| `obsidian-textgenerator-plugin` | Text Generator | 581,759 | "Generate text content using GPT-3 (OpenAI)." |
| `chatgpt-md` | ChatGPT MD | 139,712 | "A seamless integration of ChatGPT, OpenRouter.ai and local LLMs via Ollama into your notes." |
| `local-gpt` | Local GPT | 98,325 | "Local Ollama and OpenAI-like GPT's assistance for maximum privacy and offline access." |
| `gemini-scribe` | Gemini Scribe | 76,328 | "Allows you to interact with Gemini and use your notes as context." |
| `ai-providers` | AI Providers | 57,224 | "A hub for setting AI providers... in one place." |
| `bmo-chatbot` | BMO Chatbot | 52,460 | "Generate and brainstorm ideas... using LLMs." |
| `tars` | Tars | 48,885 | "Text generation based on tag suggestions, using Claude, OpenAI, Ollama, Kimi..." |
| `smart-chatgpt` | Smart Chat | 41,874 | "Integrate OpenAI's ChatGPT seamlessly in notes. Automatically saves links..." |
| `systemsculpt-ai` | SystemSculpt AI | 37,374 | AI-powered note-taking, task management, templates |
| `companion` | Companion | 34,435 | "Autocomplete with AI, including ChatGPT, through a copilot-like interface." |

**What this says for frontmatter's plan.** The two runaway leaders are not chat boxes: "Copilot"
(1.88M) runs coding-agent CLIs (Claude Code/Codex/OpenCode) *inside the vault*, and "Smart
Connections" (1.2M) is a retrieval/backlinking tool ("find related notes while writing"), not a
generation tool. The pure-generation plugins (Text Generator, ChatGPT MD, Local GPT, Gemini
Scribe, Smart Chat) each sit an order of magnitude lower, in the 40k-580k range. Read plainly:
Obsidian's most-adopted AI use case is agent-in-the-editor and context-surfacing, with inline
free-text generation a distant second tier.

## 2. Stack Overflow Developer Survey 2025

Source: `https://survey.stackoverflow.co/2025/ai`, fetched 2026-09-13 (official Stack Overflow
survey site, current published edition as of today).

- "84% of respondents are using or planning to use AI tools in their development process, an
  increase over last year (76%)." 51% of professional developers use AI tools daily (47.1% of all
  respondents "daily", n=33,662).
- Trust: "How much do you trust the accuracy of the output from AI tools": Highly trust 3.1%,
  Somewhat trust 29.6%, Somewhat distrust 26.1%, Highly distrust 19.6% (n=33,244). The page's own
  framing: "More developers actively distrust the accuracy of AI tools (46%) than trust it (33%)."
- Sentiment fell: "positive sentiment for AI tools has decreased in 2025: 70%+ in 2023 and 2024 to
  just 60% this year."
- Task breakdown ("Currently Mostly AI", n=11,202, the closest proxy to "fire and forget" use):
  Search for answers 54.1%, Generating content/synthetic data 35.8%, Learning new concepts 33.1%,
  Documenting code 30.8%, Creating/maintaining documentation 24.8%, Writing code 16.9%,
  Debugging/fixing code 20.7%, Testing code 17.9%.
- Highest resistance: "Deployment and monitoring (76% don't plan to) and Project planning (69%
  don't plan to)" (figures on page: Deployment and monitoring "Don't Plan to Use AI" 75.8%,
  Project planning 69.2%).

**Read for frontmatter.** This is developers, not general writers, but it is the closest
population to frontmatter's own kit-generation funnel users (people who then hand a kit to an
AI coding agent). Three things carry over directly: (a) generation and documentation tasks are
mid-adoption, not top-adoption; retrieval/search-for-answers and learning are what developers
already trust AI with most; (b) planning-type tasks (closest analogue to the funnel's 5-8
decision questions, which are project-planning judgment calls) are the single most resisted
category at 69% "don't plan to use AI"; (c) trust in output accuracy is falling, not rising,
which argues for the kit generator producing a verifiable, diffable artifact (files + SHA-256,
which the plan already does) rather than a black-box answer.

## 3. Notion AI, Grammarly, Google Docs: company-published figures

**Notion.** `https://www.notion.com/blog/100-million-of-you`, fetched 2026-09-13, published
2024-09-03 by Ivan Zhao: "Last month, Notion passed 100M users!" This is total Notion users, not
Notion-AI-specific; no AI-specific active-user count was found on a page opened this session
(the WebSearch snippet claiming "4 million people have used Notion AI" pointed at a URL that,
opened directly, was the same 100M-total-users post, not an AI-specific figure; that 4M number
is UNVERIFIED here and is not carried forward).

**Grammarly.** `https://www.grammarly.com/blog/company/grammarly-announces-growth-financing/`,
fetched 2026-09-13 (Grammarly's own blog, Business Wire release): "More than 40 million users
rely on Grammarly daily, contributing to Grammarly's annual revenue of more than $700 million."
This is the whole product (grammar + AI writing assistant combined), not an AI-feature-only
figure, and Grammarly's own page does not split the two; noted as a limit, not glossed over.

**Google Docs AI.** No company-published usage figure was found and opened this session. Three
searches were run and are logged rather than treated as an absence claim, since three is the
minimum this brief's rules ask for before writing "nobody publishes this": (1) "Google Docs AI
usage statistics official": returned only third-party estimate blogs, no drive.google.com or
blog.google page with a Docs-AI-specific number; (2) "Google Workspace AI adoption Duet AI Gemini
official blog million": returned Google Cloud blog posts about enterprise Workspace AI adoption
generally, none opened this session, none with a Docs-specific figure in the snippet; (3)
"site:blog.google Gemini Docs users": returned Gemini-app-wide announcements, not
Docs-feature-specific. Conclusion, narrow form: of the three searches run, none surfaced an
opened, official, Docs-AI-specific usage number. Mark as UNVERIFIED, not "Google publishes
nothing" (Google may publish this elsewhere; it was not found in three targeted searches).

**Read for frontmatter.** Neither Notion's nor Grammarly's headline figures isolate the AI
feature from the whole product, so neither should be quoted as "AI feature adoption"; they are
evidence that the host products are large, not that their AI layers specifically are used at any
given rate. This matters because the MVP plan's writing-box and AI-edit features are analogous
to Notion AI / Grammarly's assistant, and there is no company-published per-feature adoption
number to benchmark against for any of the three companies checked.

## 4. Model price trends (today's Anthropic pricing, and a cheaper option)

Source: `https://www.anthropic.com/pricing`, fetched 2026-09-13 (official Anthropic pricing page,
API tab).

| Model | Input $/MTok | Output $/MTok | Prompt-cache read | Prompt-cache write |
|---|---|---|---|---|
| Fable 5.1 | $10 | $50 | $0.25 | $12.50 |
| Sonnet 5 | **$2** | **$10** | $0.20 | $2.50 |
| Haiku 4.5 | $1 | $5 | n/a | n/a |
| Sonnet 4.6 | $3 | $15 | $0.30 | $3.75 |
| Opus 4.8 | $5 | $25 | $0.50 | $6.25 |

**The plan's Sonnet 5 assumption still holds, unchanged, at today's date.** `docs/MVP-PLAN-
2026-09-13.md:196-199` uses Sonnet 5 at $2 input / $10 output per million tokens, sourced there to
`decisions/v2/business-operations.json:2682` (fetched 2026-08-30). The live pricing page fetched
today, 2026-09-13, confirms the same $2/$10 rate for Sonnet 5. No drift in the 14 days between
the two fetches. Note the page also shows Sonnet 5's introductory rate was made permanent (per
earlier WebSearch snippets referencing a since-superseded $2/$10-until-Aug-31 framing); the
number the plan uses is the number the page shows today, so no correction is needed.

**Cheaper option: Haiku 4.5, at $1 input / $5 output per million tokens**, half of Sonnet 5 on
both axes, per the same fetched page.

### Kit cost re-derived at today's prices (arithmetic shown)

Plan's own estimate for one kit's generation (`docs/MVP-PLAN-2026-09-13.md:196`): about 60,000
input tokens and 23,000 output tokens across the questions, writing and one review pass.

- **Sonnet 5** (unchanged from the plan): 60,000 × $2/1,000,000 + 23,000 × $10/1,000,000
  = $0.12 + $0.23 = **$0.35 per kit** to $350/month at 1,000 kits, $3,500/month at 10,000 kits
  (same as the plan's own figures; reconfirmed, not just carried forward).
- **Haiku 4.5** at the same token counts: 60,000 × $1/1,000,000 + 23,000 × $5/1,000,000
  = $0.06 + $0.115 = **$0.175 per kit** to $175/month at 1,000 kits, $1,750/month at 10,000 kits.
  Half the cost, but Haiku is Anthropic's fastest/cheapest tier, not its strongest reasoning tier.
  Swapping it in for the kit generator (which does multi-step planning: parsing a prompt, backing
  5-8 decision questions, and writing seven structured cross-referenced files) is a quality
  question this research did not test, so it is a lever to hold in reserve (e.g. Haiku for the
  cheap parts of the pipeline (question generation, formatting), Sonnet for the parts that need
  to reason about the user's actual project), not a blind swap.

## What the evidence says to ship first

Ranked by the strength of the adoption signal actually found this session, not by intuition:

1. **Kit generation (the funnel itself) has the strongest indirect signal.** The single largest
   Obsidian AI plugin by downloads (1.88M, "Copilot") is specifically an agent-in-the-editor
   pattern: hand a coding agent context and let it work inside the document tree, which is
   structurally the same shape as frontmatter's kit to kickoff-prompt to agent-builds flow. This is
   the one AI feature in the MVP plan with a real market precedent at scale, not just a plausible
   guess.
2. **A writing check (verification/diffable output), not a bigger writing box, matches the
   trust data.** Stack Overflow 2025: developer trust in AI accuracy is down (29% trust vs 46%
   distrust) and sentiment fell from 70%+ to 60% in one year; the task category closest to "AI
   writes something I then commit to" (project planning, deployment/monitoring) is the most
   resisted, at up to 76% "don't plan to use AI for this." That argues for shipping the kit's
   SHA-256-checked, diffable, file-based output (already in the plan, §6) over an open-ended
   writing box as the trust-critical surface, and for treating the writing box and AI-edit
   features as secondary conveniences rather than the differentiator.
3. **AI edit (targeted, in-place, on a selection) ranks above a general writing box.** Both the
   Obsidian data (retrieval/context tools like Smart Connections outdraw pure generation tools by
   roughly 2x) and the Stack Overflow task table (search-for-answers and documentation tasks
   outrank open creative generation) point the same direction: a scoped, context-aware edit on
   existing text is a better-evidenced first AI feature than a blank-page writing assistant.
4. **The writing box (general chat/generate-from-scratch) is the weakest-evidenced of the four,**
   not absent from the market (Text Generator, ChatGPT MD, Smart Chat all exist and have real but
   smaller followings) but consistently the second-tier use case everywhere this research looked.
   It is reasonable to keep it in the MVP (the plan already scopes it as one box, not many
   features) but it should not be the feature the pilot is evaluated against.

No usage figure was found, in any source opened this session, that isolates writing-box-style
generation as the most-adopted AI writing feature anywhere. Every strong adoption signal found (Obsidian downloads, Stack Overflow's own task breakdown) favours agent-in-context and
retrieval/editing over blank-page generation.

## Sources opened this run (14)

1. `https://raw.githubusercontent.com/obsidianmd/obsidian-releases/master/community-plugin-stats.json` (2026-09-13)
2. `https://raw.githubusercontent.com/obsidianmd/obsidian-releases/master/community-plugins.json` (2026-09-13)
3. `https://survey.stackoverflow.co/2025/ai` (2026-09-13)
4. `https://www.anthropic.com/pricing` (2026-09-13)
5. `https://www.grammarly.com/about` (2026-09-13, no usable stat found)
6. `https://www.notion.com/blog` (2026-09-13, index page, no usable stat found)
7. `https://www.grammarly.com/press` (2026-09-13, no clean stat found)
8. `https://www.grammarly.com/blog/company/grammarly-announces-growth-financing/` (2026-09-13, cited above)
9. `https://www.notion.com/en-US/blog/millions-have-used-notion-ai-heres-what-weve-learned` (2026-09-13, no AI-specific figure found in fetched text)
10. `https://www.notion.com/blog/100-million-of-you` (2026-09-13, cited above)

Plus 4 WebSearch calls (Stack Overflow overview, Anthropic pricing overview, Notion overview,
Grammarly overview) used only to locate URLs, and 3 targeted absence-check searches for Google
Docs AI usage figures (logged in §3), none of which yielded a page opened and confirmed this
session.

## Local corpus checked first

`grep -ril` over `docs/research` found no existing file on Obsidian plugin downloads, the Stack
Overflow 2025 survey, or company AI-usage figures, this is new evidence, not a repeat of prior
research. The existing `decisions/v2/business-operations.json:2682` Sonnet-5 pricing figure
(fetched 2026-08-30) was reconfirmed against today's live page rather than re-derived from
scratch.
