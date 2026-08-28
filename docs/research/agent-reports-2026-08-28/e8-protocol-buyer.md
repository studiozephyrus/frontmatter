## KEY FINDINGS
- BRUTAL HEADLINE: the standalone AI-protocol buyer does not exist yet — no product anywhere sells 'agent-document compatibility guarantees' for money; every llms.txt/AI-readability checker found (Rankability, MRS Digital, llmstxtvalidator.dev, Apify auditor) is a free SEO-agency lead magnet [SS], so the wedge frontmatter would sell is currently being given away as marketing collateral.
- Agent-tool money is real but sits one layer away from the protocol: Composio charges $29/mo (200K tool calls) and $229/mo (2M calls) with per-1K overage [SS], Zapier MCP is bundled into task quotas (1 call = 2 tasks, ~50 free calls/mo, paid from $19.99/mo) [SS], and Apify pay-per-event claims $1.2M/month paid out to actor developers at 80% rev share [SS] — while the MCP layer itself is free distribution (@modelcontextprotocol/sdk = 51,758,066 npm downloads/week, registry is a free 'app store', Smithery/Glama monetization embryonic) [fetched].
- Docs platforms already SELL AI-renderability inside docs-hosting seats: Mintlify auto-hosts llms.txt with literal 'AEO'/'GEO' keywords, .well-known agent-card/MCP-server-card discovery headers, and three MCP servers (fetched from their own docs repo); GitBook ships 'LLM-ready docs' + auto llms.txt + MCP [SS] — price anchors Doctave $59/mo, GitBook $65/site+$12/user, ReadMe $99/$399/~$2,000, Mintlify $150→~$450/mo [SS, conflicting].
- The format-compatibility precedent HOLDS and is 20 years durable, with a consistent split: compatibility DATA is always free and sponsor-funded (caniuse, caniemail sponsored by Resend, browserslist on Open Collective/Tidelift — all verified from READMEs [fetched]), while compatibility TESTING/CI is paid — Litmus $99→$500/mo, Email on Acid $74–134/mo, Chromatic $179–399/mo + $0.008/snapshot, Percy $149–649/mo, BrowserStack/Sauce $29–199/mo entry to $50–120k/yr at scale [SS]. Nobody found making the 'Litmus for markdown/agents' analogy yet.
- Markdown QA is the highest-adoption zero-revenue market in this study: markdownlint 3,111,881 npm downloads/week + markdownlint-cli2 1,618,958 + markdownlint-cli 1,174,775 + cspell 1,620,679 [fetched]; Vale (6,038 stars) runs on one developer's donations with Mintlify as a named sponsor, and the deleted vale-server repo (404 on both old paths [fetched]) marks the one direct attempt to charge for prose/markdown linting — discontinued. Market-clearing price of markdown QA today: ~$0.
- Adjacent paid categories that prove the buyer CAN pay: agent observability (Langfuse $29/$199+$300 add-on/$2,499/mo + $8/100k units, fetched from their pricing.md; LangSmith $39/seat; Braintrust $249/mo [SS]); CI quality gates (SonarQube Cloud Team from $32/mo, Snyk from $25/dev/mo, ~$125/mo entry [SS]); brand-side AEO monitoring (Profound ~$499 Lite/$2,000+ enterprise, agency retainers $2–8k/mo [SS]); enterprise content governance (Acrolinx low-five-figures/yr [SS]).
- Sell-side rails precede buyers: Stripe hosts mcp.stripe.com plus @stripe/token-meter billing SDKs and agent skills [fetched README], x402 ships an @x402/mcp payment-gated-tools package (x402-foundation/x402, 6,552 stars) [fetched] — payment infrastructure for agent-content access exists with no evidence of material GMV flowing through it for documents.
- Earliest sellable wrapper (evidence-ranked): (1) a markdown/agent-surface render-compat CI gate on the Chromatic motion — free for OSS/public repos, ~$29–99/repo/mo team tier, priced between SonarQube ($32) and Chromatic ($179), shipping the mdmax degradation certificate as the artifact; (2) sold THROUGH docs platforms and AEO agencies as infrastructure (Mintlify already pays Vale as sponsor — platforms fund markdown QA infra before end-teams do); (3) never sold as 'the protocol' — zero demand rows exist for protocol-as-product.
- Reliability caveat: WebFetch was gate-refused all session, so every pricing number except Langfuse's (fetched from their repo) is [SS] — and the pricing-search results are dominated by AI-generated comparison farms (ferndesk, docsio, bunnydesk, checkthat.ai), i.e., the docs-pricing SERP itself is now an answer-engine content economy; treat exact dollar figures as directionally right, spot-check before quoting externally.

---


# GAP 3 — The AI-Protocol Buyer: first evidence pass

**Date:** 2026-08-28 · **Scope:** WHO pays for agent-document infrastructure today, at what anchors, and what is the earliest sellable wrapper. First demand-evidence pass — zero prior rows in the corpus for this buyer.

**Method note:** WebFetch was refused by the session taint gate for the entire session, so primary fetches were limited to curl against the allowlisted hosts (api.github.com authenticated, raw.githubusercontent.com, api.npmjs.org). Tags: **[fetched]** = primary source opened; **[SS]** = WebSearch summary, unverified; **[inference]** = reasoning. All npm figures are last-week downloads for 2026-08-21 → 2026-08-27; all GitHub figures observed 2026-08-28.

---

## Verdict up front

**The AI-protocol buyer — someone paying for agent-document compatibility guarantees as such — does not exist yet. Zero products found selling it; zero budget lines named for it.** What DOES exist is four live adjacent budget lines the buyer already draws on (docs-platform seats, CI quality gates, agent-tool usage, AEO monitoring), a 20-year-durable precedent that cross-target *testing* monetizes while compatibility *data* never does, and sell-side payment rails (Stripe MCP billing, x402) built ahead of demand. The earliest sellable wrapper is a CI gate priced into an existing line, not a protocol priced as a new one.

---

## 1. Do developers/teams pay for MCP servers or agent tools today?

**Distribution is enormous; direct monetization of the MCP layer is ~zero.**

- `@modelcontextprotocol/sdk`: **51,758,066 downloads/week** [fetched — https://api.npmjs.org/downloads/point/last-week/@modelcontextprotocol%2Fsdk]. `modelcontextprotocol/servers`: **89,926 stars**; `punkpeye/awesome-mcp-servers` (Glama's founder): **92,935 stars** [fetched — api.github.com].
- The official **MCP Registry is free** — self-described "app store for MCP servers," API-freeze v0.1 since 2025-10-24, no payment layer anywhere in it [fetched — https://raw.githubusercontent.com/modelcontextprotocol/registry/main/README.md].
- Free MCP wrappers move at scale with $0 attached: `@upstash/context7-mcp` **918,346/wk**, `firecrawl-mcp` **43,091/wk** [fetched — api.npmjs.org]. The money is in the API behind the wrapper (Firecrawl, Exa, Browserbase subscriptions), not the wrapper [inference from pricing structure].

**Where money actually changes hands:**

- **Composio** (ComposioHQ/composio, **29,914 stars** [fetched]): Free (20K–100K tool calls/mo, sources conflict) / **Pro $29/mo** (200K calls, ~$0.299/1K overage) / **$229/mo** (2M calls, ~$0.249/1K) / Enterprise custom [SS — https://composio.dev/pricing via search; aggregators freetier.co, usagepricing.com]. Their new SDK `@composio/core` is at **670,923 downloads/wk** [fetched] — genuine paid usage-based agent-tool infra with real adoption.
- **Zapier MCP**: not separately priced — bundled into the task quota. 1 successful MCP tool call = 2 tasks; free plan 100 tasks ≈ 50 calls/mo; paid from **$19.99/mo** (750 tasks) [SS — https://docs.zapier.com/mcp/usage/overview, zapier.com/pricing via search]. Model: MCP as retention feature of an automation seat.
- **Apify**: the strongest "developers earn from agent tools" datapoint. Pay-per-event actor monetization (`Actor.charge()`), **80% revenue share**, and a claimed **$1.2M/month in developer payouts** (that figure covers all actors, not MCP-only — MCP is a distribution channel onto the same catalog) [SS — https://apify.com/mcp/developers, https://docs.apify.com/platform/actors/publishing/monetize]. Rental model retiring Oct 2026 in favor of pay-per-event [SS].
- **Smithery**: `@smithery/cli` only **7,821 downloads/wk** [fetched]; a comparison site claims a **$30/mo creator fee with $0 revenue share** [SS — mcpize.com, a competitor/aggregator: low confidence]. **Glama**: hosted MCP gateway **$0–80/mo**, creator monetization "coming soon" [SS — respan.ai, mcpize.com]. Marketplaces promising rev-share (MCPize "80%") are embryonic [SS].
- **Sell-side rails exist ahead of buyers.** Stripe's AI repo (stripe/agent-toolkit → now **stripe/ai**, 1,772 stars) hosts a remote MCP server at `mcp.stripe.com` and ships `@stripe/token-meter` + `@stripe/ai-sdk` for billing LLM/agent usage, plus agent-skills plugins for Claude Code/Codex/Cursor [fetched — https://raw.githubusercontent.com/stripe/ai/main/README.md]. **x402** (x402-foundation/x402, **6,552 stars**) is an open payment standard with a shipping `@x402/mcp` package — payment-gated tool calls [fetched — https://raw.githubusercontent.com/x402-foundation/x402/main/README.md]. No evidence found of material document-access GMV moving over either [inference from absence].

**Sub-answer:** developers pay for agent *actions* (usage-metered: Composio, Zapier, Apify) — nobody pays for agent *legibility*. The protocol layer is free everywhere it appears.

## 2. Docs-as-code team budgets, and "renders correctly for AI" in marketing

**Both questions come back YES — but AI-renderability is sold as a docs-hosting feature, never as a standalone product.**

Price anchors (all [SS] except where noted; the docs-pricing SERP is dominated by AI-generated comparison farms — ferndesk.com, docsio.co, bunnydesk.ai, checkthat.ai — so treat exact dollars as directional):

| Platform | Anchor | Source |
|---|---|---|
| Doctave | from **$59/mo**, markdown-in-git → CI deploy | [SS] doctave.com/pricing via search |
| GitBook | Premium **$65/site/mo** + **$12/user/mo**; Ultimate **$249/site/mo** | [SS] gitbook.com/pricing via search |
| ReadMe | Startup **$99/mo** / Business **$399/mo** / Enterprise ~**$2,000/mo**; AI "Owlbert" suite gated to Business+ | [SS] saasworthy/docsie via search |
| Mintlify | historic Pro **$150/mo** / Growth **$550/mo**; mid-2026 restructure; now reportedly Pro **~$450/mo annual ($540 monthly)** | [SS — conflicting across sources; flag before quoting] |

Docs-as-code CI motion is real and measurable: ReadMe's `rdme` CLI = **151,681 downloads/wk**; Mintlify's CLIs = **170,884 + 362,475/wk** [fetched — api.npmjs.org].

**The AI-renderability marketing is already explicit — verified at the primary source for Mintlify:** their own docs repo ships `ai/llmstxt.mdx` with frontmatter keywords `["llms.txt", "LLM indexing", "AEO", "GEO", "content discovery"]`; auto-hosted `llms.txt` + `llms-full.txt` (also at `/.well-known/llms.txt`); HTTP `Link` headers advertising llms.txt, an API catalog, an **MCP server card**, an **agent card** (`/.well-known/agent-card.json`), and an **agent-skills index**; plus three productized MCP servers (Admin at mcp.mintlify.com with write/PR access, per-site Search MCP, and a cross-customer Index MCP at index.mintlify.com) and a whole `agent-context/` package with SKILL.md files in the repo [fetched — https://raw.githubusercontent.com/mintlify/docs/main/ai/llmstxt.mdx and /ai/mintlify-mcp.mdx]. GitBook mirrors this: "LLM-ready docs" product page, auto llms.txt/llms-full.txt, per-page .md outputs, docs MCP server, a published GEO guide, "Open in AI tool" buttons [SS — https://docs.gitbook.com/llm-ready-docs, gitbook.com/blog/what-is-llms-txt].

**Sub-answer:** teams already pay $59–550+/mo for docs where "AI can read this correctly" is a headline feature — the budget line exists, but it is owned by the hosting platforms, which give the AI-legibility away inside the seat. A standalone vendor must either sell *to* these platforms or sell the part they can't do (cross-platform verification) [inference].

## 3. Precedent for paying for format-compatibility guarantees

**The precedent holds, with one iron pattern: compatibility DATA is free and sponsor-funded; compatibility TESTING is paid.**

Free data layer (all business models verified from READMEs [fetched]):
- **caniemail** (939 stars): sponsored by a single vendor, Resend [fetched — https://raw.githubusercontent.com/hteumeuleu/caniemail/main/README.md].
- **browserslist** (13,559 stars; **195.4M npm downloads/wk**) and **caniuse-lite** (**199.7M/wk**): Open Collective sponsors + Tidelift subscription for commercial support [fetched — README + api.npmjs.org]. **caniuse** (5,869 stars): "## Sponsor" donation section [fetched].

Paid testing layer (all [SS]):
- **Email rendering** — the closest structural analogy to markdown-across-agents (fragmented renderers, no enforcement of the spec): **Litmus** Basic was $99/mo, Plus $199 → hiked to **$500/mo** (~151% increase, Basic eliminated), enterprise ~$5,000/yr+; **Email on Acid** **$74–134/mo** [SS — vendr.com/marketplace/litmus, emailwarmup.com, xhtmlteam.com]. This category has monetized for ~20 years because a broken render costs a campaign.
- **Visual render-diff CI**: **Chromatic** free 5,000 snapshots → **$179/mo** (35K) → **$399/mo** (85K), **$0.008/extra snapshot**; **Percy** (BrowserStack) **$149–649/mo** [SS — chromatic.com/compare/percy, argos-ci.com/blog]. 
- **Cross-browser device clouds**: BrowserStack Live from **$29–39/mo** ($30/user team), Sauce Labs **$39–199/mo** entry; at 100 parallel sessions **$50–75k/yr** (BrowserStack) vs **$80–120k/yr** (Sauce) [SS — browserstack.com/pricing, ghostinspector.com].

**Does anyone else make the markdown/agent analogy?** No. No product or essay found positioning "Litmus/Chromatic for markdown renderers or agent surfaces." The nearest artifacts are **llms.txt validators — and every one found is free**: Rankability, MRS Digital, llmstxtvalidator.dev, IA-QA, an Apify auditor actor; Spindora gates at 3 free checks/week before signup [SS — search "llms.txt validator"]. They are SEO-agency lead magnets: proof of wedge interest, zero proof of willingness to pay [inference]. The analogy slot is empty — which is simultaneously the opportunity and the warning.

## 4. CI/lint markets — and does "markdown CI" exist as a paid category?

**Paid CI-gate anchors** (what teams demonstrably pay per gate): SonarQube Cloud Team from **$32/mo** (100K LOC, scaling to 1.9M) [SS — sonarsource.com/plans-and-pricing]; Snyk from **$25/contributing dev/mo** billed annually, Team min 5 devs ⇒ **~$125/mo entry**, list often $52–98/dev/mo [SS — snyk.io/plans, vendr.com]. Enterprise prose governance exists too: **Acrolinx** custom, "typically starts in the low five figures annually" [SS — selecthub, saasworthy].

**Markdown CI as a market: massive adoption, zero revenue.**
- Weekly npm downloads [all fetched — api.npmjs.org]: `markdownlint` **3,111,881**; `markdownlint-cli2` **1,618,958**; `markdownlint-cli` **1,174,775**; `cspell` **1,620,679**; `remark-lint` **329,640**; `textlint` **225,435**.
- Stars [fetched — api.github.com]: DavidAnson/markdownlint **6,306**; vale-cli/vale **6,038**; textlint **3,175**; vale-action **249**.
- **No paid tier found anywhere in this stack.** Vale's README (fetched): "*I'm @jdkato, the sole developer of Vale*" — funded by GitHub Sponsors/Open Collective donations, with **Mintlify listed as a named sponsor** (a docs platform paying the markdown linter's rent — the closest thing to an infra budget line this category has) [fetched — https://raw.githubusercontent.com/vale-cli/vale/v3/README.md].
- **The cautionary tale:** Vale Server, the one direct attempt to sell prose/markdown linting as a product (paid desktop app, introduced 2019 — jdkato.medium.com [SS]), is gone: both `errata-ai/vale-server` and `jdkato/vale-server` return 404 [fetched — api.github.com]. Its successors (Vale Studio, a new hosted "Vale CMS" at cms.vale.sh) show **no public pricing** [SS — vale.sh, search].
- Doctave sells "docs CI" but as hosting-with-checks at $59/mo, not as a gate product [SS].

**Sub-answer:** markdown CI exists as a *practice* (millions of weekly installs, GitHub Actions everywhere) and as a *market* clears at **~$0**. Anyone entering must attach to the SonarQube/Snyk/Chromatic budget lines that already pay $25–179/mo, not create a "markdown lint" line that 10 years of evidence says nobody funds [inference].

## 5. Agent-observability pricing (the adjacent paid dev-tool category)

The proof that AI-era dev teams open new budget lines fast when the pain is per-request and visible:

- **Langfuse** [fetched — https://raw.githubusercontent.com/langfuse/langfuse-docs/main/md-override/pricing.md]: Hobby free (50K units) / **Core $29/mo** / **Pro $199/mo** + **Teams add-on $300/mo** / **Enterprise $2,499/mo**; overage **$8/100K units**; self-claims "50,000+ companies." Repo: 33,856 stars [fetched].
- **LangSmith**: Plus **$39/seat/mo** (10K base traces/seat) [SS — inference.net, coverge.ai]. **Braintrust**: Pro **$249/mo** flat, unlimited users [SS — costbench.com, braintrust.dev].
- **Profound** (brand-side AEO monitoring — the marketing twin of agent-legibility): Lite ~**$499/mo** (3 seats, 24K responses analyzed), enterprise **$2,000+/mo**; AEO agency retainers **$2,000–8,000/mo** mid-market [SS — thedigitalelevator.com, arvow.com, stackmatix.com].

---

## Price-anchor summary (what a frontmatter trust product can price against)

| Budget line | Entry | Team/scale | Tag |
|---|---|---|---|
| CI quality gate (SonarQube/Snyk) | $25–32/mo | $125+/mo | [SS] |
| Render-diff CI (Chromatic/Percy) | free 5K snaps | $149–649/mo | [SS] |
| Email render testing (EoA/Litmus) | $74–99/mo | $500/mo–$5K/yr | [SS] |
| Docs hosting w/ AI-legibility (Doctave/GitBook/ReadMe/Mintlify) | $59–99/mo | $249–550+/mo | [SS] |
| Agent observability (Langfuse/LangSmith/Braintrust) | $29–39/mo | $199–2,499/mo | Langfuse [fetched], rest [SS] |
| Agent-tool usage (Composio/Zapier/Apify) | $19.99–29/mo | $229/mo + usage | [SS] |
| AEO monitoring (Profound + agencies) | ~$499/mo | $2K–8K/mo | [SS] |
| Enterprise content governance (Acrolinx) | — | low five figures/yr | [SS] |
| Markdown QA today (markdownlint/Vale) | $0 | $0 (donations) | [fetched] |

## The earliest sellable wrapper (evidence-ranked)

1. **A render/agent-compat CI gate on the Chromatic motion, priced into the CI line.** Free for OSS and public repos (the markdownlint installed base is the funnel: 3.1M weekly downloads with no owner monetizing it), paid **~$29–99/repo/mo** for private/team — deliberately between SonarQube's $32 and Chromatic's $179, usage-capped like Langfuse's $8/100K-unit overage. The sellable artifact is not "lint passed" but the **certificate** — "this document degrades gracefully across GitHub/Obsidian/chat-UI/agent-context targets" — which is exactly the mdmax `cert` shape already built. Precedent says the certificate/report is what Litmus and Chromatic customers actually buy [inference on [fetched]+[SS] anchors].
2. **Sell through platforms and agencies before selling to end teams.** Mintlify already *sponsors Vale* [fetched] — docs platforms fund markdown-QA infrastructure before any end team does; AEO agencies ($2–8K/mo retainers) need an evidence artifact to justify fees and currently hand out free llms.txt checks. An embeddable verification layer (OEM/API) rides both without needing the nonexistent end-buyer [inference].
3. **Do NOT sell the protocol.** Every protocol-shaped artifact in this space is free and its stewards intend it to stay free: MCP registry [fetched], AGENTS.md (agentsmd/agents.md, 23,964 stars, "a simple, open format" [fetched]), llms.txt (AnswerDotAI/llms-txt, 2,587 stars [fetched]). Monetization attaches to metering (Stripe/x402/Apify) or to hosting/observability — never to the spec [fetched/[SS]].

## Honesty ledger — what would change this verdict

- **Nobody pays today; this is a pre-demand market.** The strongest counter-signal to building for this buyer now: Vale Server's death, the $0-revenue markdownlint installed base, and free llms.txt validators as far as the eye can see.
- **The demand trigger to watch:** the first documented incident where an agent misreading a markdown document costs a company money publicly (the email-market equivalent of a broken campaign), or the first docs platform charging separately for AI-render verification. Either event converts the free-lead-magnet layer into a Litmus-shaped market roughly overnight [inference].
- **Data reliability:** all dollar figures except Langfuse's are [SS], and the pricing-comparison SERP is itself an AI-content farm economy (ferndesk, docsio, bunnydesk, checkthat.ai dominated every pricing query) — an ironic confirmation that answer-engine-mediated content is where the money is moving. Spot-check any figure before external use. Mintlify's 2026 pricing is actively in flux ($150/$550 → free+Enterprise → Pro ~$450) and should be re-verified at quote time.
