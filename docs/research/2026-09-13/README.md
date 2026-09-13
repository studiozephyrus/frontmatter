# Research, 13 September 2026

The evidence behind `docs/MVP-PLAN-2026-09-13.md`. Three rounds, run the day the founder reset the
product to a bare-bones editor plus a document-kit generator. Every report here was written by a
sub-agent and copied in verbatim, apart from removing the agent's own chatter above the first
heading. They are raw notes, not voice-checked documents, and some carry em-dashes.

**Read this before quoting anything from them.** A sub-agent's report is a hypothesis until
checked. The table says what was checked by hand in the main session, and against what.

## The files

| File | Round | What it covers |
|---|---|---|
| `round1-writing-tools-and-funnels.json` | 1 | Four lenses, 34 findings (30 from opened sources): prose linters, AI-writing detectors, free-tool funnels, AI features in editors. JSON, one object per lens, each finding with its URL and whether it was opened. |
| `round2-code-vs-wireframes.md` | 2 | The code in both repos checked against the founder's two wireframes, plus auth, storage, AI, sharing, and the smallest change list for ten strangers. |
| `round2-doc-kit.md` | 2 | Every document type this repo generates, which ones an agent can build from, and the proposed seven-file kit with its manifest. |
| `round2-conflicts.md` | 2 | The new direction against every earlier decision card and settled rule; ends with the five conflicts to settle first. |
| `round2-prompt-to-spec-market.md` | 2 | Spec Kit, Kiro, Tessl, BMAD, CodeGuide, ChatPRD, Task Master, Traycer: what each generates, how an agent receives it, prices, stars. |
| `round2-link-delivery-storage.md` | 2 | Capability URLs (W3C TAG), indirect prompt injection (OWASP), how agents fetch, llms.txt, R2 and Firestore prices, a recommended design. |
| `round3-differentiator.md` | 3 | The plan's "nobody hosts the kit" claim tested against thirteen tools; the narrow true version; ChatPRD as the one to watch. |
| `round3-editor-matrix.md` | 3 | Eleven markdown editors across eleven capabilities; what is table stakes and what nobody has. |
| `round3-agent-fetch.md` | 3 | How Claude Code, Cursor, Codex and Copilot's coding agent would run the kickoff prompt; Firestore Standard prices. |
| `round3-promotion.md` | 3 | Badge loops (Lovable, Carrd, Framer), v0's public gallery, launch channels, Indian developer communities. |
| `round3-ai-adoption.md` | 3 | Obsidian AI plugin downloads, the Stack Overflow 2025 survey on AI use and trust, company AI figures, today's model prices and the kit cost. |
| `kickoffs/KICKOFF-ROUND-1.md`, `KICKOFF-ROUND-2.md` | earlier | The two prompts sent to the other account on 9 to 10 September to answer the handover's open questions. Its answers are `docs/HANDOVER-ANSWERS-2026-09-09.md` and `docs/HANDOVER-ANSWERS-2-2026-09-09.md`. Kept verbatim as records; they predate the zero-em-dash pass, so the doc gate flags them. |

## How each round ran

| Round | Workflow run | Agents | Subagent tokens | Duration | Notes |
|---|---|---|---|---|---|
| 1 | `wf_50264739-5af` | 4 research lenses finished, then the run was stopped | not totalled | not totalled | The same run held three triage agents and a card-drafting agent, stopped on purpose when the founder reset the scope; their work was for the old scope. |
| 2 | `wf_fd8d0b63-3c8` | 5 | 886,608 | 416,647 ms | Every agent's final reply was overwritten by a repeating stop-hook notice ("No mutation", "Ack (9)"). The reports were recovered from each agent's transcript. |
| 3 | `wf_d1f03394-f45` | 5 | 874,828 | 435,278 ms | Each agent saved its report to disk before replying, so nothing was lost to the same hook loop. |

## Checked by hand in the main session

| Claim | How it was checked | Result |
|---|---|---|
| The launcher is missing; the root route opens the editor | read `src/app/(vault)/page.tsx` | confirmed |
| `GITHUB_REPO` defaults to `sagnikmitra/md` | `sed -n 86p src/config/env.ts` | confirmed |
| Sign-in allows one login, by string equality | read `src/modules/auth/domain/allowlist.ts:5-10`, `env.ts:47` | confirmed |
| Nothing in `src` reads or writes Firestore | grep for document I/O calls: 0 files | confirmed; the handover's "Firestore write in KnowledgeUI.tsx" was wrong (my first grep matched `setDoctorOpen`, a false positive) |
| The public note route is indexable | `robots: { index: true, follow: true }` at `src/app/(public)/[slug]/page.tsx:30` | confirmed |
| Plan v15 cut the kickoff prompt | `sed -n 171p docs/PRODUCT-BRIEF.md` | confirmed, verbatim |
| 1.21 engineering days a week; one author | `docs/PRODUCT-BRIEF.md:11`, `git shortlog` in both repos (115 and 416 commits, one author) | confirmed |
| 581 of 73,030 repos | `docs/research/agent-reports-2026-08-29-r8to10/b1-spec-driven-development-market.md:74-82` | a lower bound from a narrower sweep, NOT a rate; round 2 and my first reply quoted it as a rate, since corrected |
| Spec Kit 136,067 stars; Task Master 28,065, last push 2026-04-28 | GitHub API | confirmed |
| CodeGuide $24 and $29; ChatPRD $15 and $29; Traycer $0 to $100 | their pricing pages | confirmed |
| R2 prices and free tier; W3C TAG 120 bits; Claude web fetch URL rule | the official pages | confirmed |
| Obsidian: Copilot 1,875,423, Smart Connections 1,198,593, Text Generator 581,759 | community-plugin-stats.json | confirmed; lifetime downloads, which cannot say which version of a plugin people installed |
| Stack Overflow 2025: 84% use or plan to; 46% distrust vs 33% trust; 69% keep AI off project planning | survey.stackoverflow.co/2025/ai | confirmed |
| Firestore Standard $0.06 / $0.18 / $0.02 per 100,000, $0.18 per GiB-month | cloud.google.com/firestore/pricing | strings confirmed on the page; row mapping taken from the report |
| Codex network off by default; Copilot firewall on by default; Claude Code WebFetch lossy by design | the vendors' docs | confirmed |
| ChatPRD has an MCP server | chatprd.ai/product/mcp | confirmed |
| Traycer is an IDE extension with 240K installs | traycer.ai | the page says "240K Installs on" followed by a logo the text strip removed, then "Open VSX 40K"; the store behind 240K is not certain |
| HackMD custom permalinks and inline comments | hackmd.io/pricing | confirmed; its price was not confirmed by hand |
| Haiku 4.5 at $1 and $5 per million tokens; Sonnet 5 still $2 and $10 | anthropic.com/pricing | confirmed |

## Not verified, and not used as fact in the plan

Everything a report marks UNVERIFIED or "search-corroborated": Lovable, Bolt and v0 beyond their
docs indexes; Notion AI and GitHub Copilot Spaces (not checked at all for the differentiator);
Cursor's, Codex's and Copilot's retention of fetched URLs; v0's "millions of indexed pages"; every
Show HN and Product Hunt outcome number; developersIndia's member count (their own figure);
Craft's exact Plus price; GitBook's AI plan price; several editor matrix cells marked unverified.
