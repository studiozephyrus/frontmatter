# L3. Router design: a model layer that never says "AI is unavailable"

Lens 3 of the 18 September 2026 LLM research. Evidence rules from
`docs/research/2026-09-18/BRIEF.md` apply: every source opened, every number traced, no quotation
marks around anything not copied from an opened page, `INFERENCE:` and `UNVERIFIED:` markers used
where they belong, British spelling, plain hyphens only.

Method note: most pages here were opened with `curl -sL --compressed` through Bash and converted to
text locally, then grepped for the exact strings quoted. Where a page was opened with WebFetch
instead, the finding says so. Every quoted string below was copied from the local text extraction of
the page named in its Source line.

Two rules collide once in this document and the collision is resolved in favour of accuracy. The
brief forbids em dashes and en dashes, and separately forbids altering a quotation. Four quoted
strings (all from Cerebras and OpenRouter) contain the source's own em dashes, and six contain
American spellings (`behavior`, `organization`, `analyzed`). They are left byte-exact rather than
tidied, because a silently edited quotation is the exact failure this repo was burned by on
9 September. **My own prose contains no dash of either kind and uses British spelling throughout.**

Mission: how to build a model layer that never shows a user "AI is unavailable", from a chain of
free providers with different limits, on Next.js on Vercel with Cloudflare R2 and Firestore.

---

## Part one: what already exists

The question that matters for us, asked of every product in this part:

> Does it support a chain of **different providers** with **different free quotas**, and does it
> track **per-provider quota exhaustion** rather than just per-request failure?

Very few do the second half. That is the finding of Part One and it is worth stating up front:
almost every router on the market treats a 429 as a transient error to retry around, on a cooldown
measured in seconds. Only a handful carry a **ledger** that says "this provider is finished for the
day, do not try it again until 00:00 UTC". LiteLLM is the main exception, and it tracks money, not
tokens.

---

### FL3.1. LiteLLM router: the only open-source router with a real per-provider budget ledger

- **What it does:** a Python router and proxy that load-balances across deployments, with cooldowns,
  fallbacks, retries and budgets. The router page states its own scope: `Basic reliability logic -
  cooldowns, fallbacks, timeouts and retries (fixed + exponential backoff) across multiple
  deployments/providers.` and `In production, litellm supports using Redis as a way to track cooldown
  server and usage (managing tpm/rpm limits).`
- **Cooldown parameters, exactly as documented.** Defaults are given on the page as
  `allowed_fails: 3` and `cooldown_time: 5s (DEFAULT_COOLDOWN_TIME_SECONDS in constants.py)`.
  The trigger table reads: `Rate Limiting (429)` / `Immediate on 429 response` / `5 seconds
  (default)`; `High Failure Rate` / `>50% failures in current minute` / `5 seconds (default)`;
  `Non-Retryable Errors` / `401 (Auth), 404 (Not Found), 408 (Timeout)` / `5 seconds (default)`.
  Cooldowns are per deployment, not per model group: `Cooldowns apply to individual deployments, not
  entire model groups. The router isolates failures to specific deployments while keeping healthy
  alternatives available.`
- **Per-error-type policy.** `AllowedFailsPolicy` and `RetryPolicy` let you set the fuse per
  exception class. The doc's own example is `RateLimitErrorAllowedFails=100, # Allow 100
  RateLimitErrors before cooling down a deployment`, and a per-deployment variant
  `RateLimitErrorAllowedFails: 0 # cool down after the first RateLimitError`.
- **Source:** https://docs.litellm.ai/docs/routing opened 2026-09-18
- **The budget ledger, which is the part nobody else has.** A separate page documents
  `provider_budget_config`, keyed by provider name, each with a `budget_limit` in USD and a
  `time_period` that the page says can be `1d, 2d, 30d, 1mo, 2mo`. The mechanism is stated plainly:
  `Uses Redis to track spend for each provider`, `Tracks spend over specified time periods (e.g.,
  "1d", "30d")`, `Automatically resets spend after time period expires`, and routing is
  `Routes requests to providers under their budget limits` / `Skips providers that have exceeded
  their budget` / `If all providers exceed budget, raises an error`. When it trips, the error body
  on the page is `"message": "No deployments available - crossed budget for provider: Exceeded
  budget for provider openai: 0.0007350000000000001 >= 1e-12"` with `"code": "429"`. Requirement
  stated on the page: `Redis required for tracking spend across instances`.
- **Source:** https://docs.litellm.ai/docs/proxy/provider_budget_routing opened 2026-09-18
- **Cost, licence, deployment shape:** open source (BerriAI/litellm). It is a Python package and a
  Python proxy server. **It cannot run inside a Next.js route.** You would run the proxy as its own
  service and call it over HTTP from the route.
- **Does it answer our question?** Yes on both halves, with one gap. It chains different providers,
  and `provider_budget_config` is a real per-provider exhaustion ledger rather than a per-request
  retry. The gap for us: the ledger counts **dollars**, and our free pools are denominated in
  **tokens per day**, **requests per day** and **neurons per day**. A dollar budget only models a
  free token pool if you assign a synthetic price per token to each free provider and let the
  budget_limit stand in for the pool. That works but it is a fiction you have to maintain.
- **INFERENCE:** the synthetic-price trick is workable. Set Groq's price to 1 unit per 1,000 tokens
  and its `budget_limit` to the daily token pool divided by 1,000. It is exactly the sort of clever
  indirection that is fine when one person maintains it and a trap when they leave.
- **Verdict for us:** the right **reference design**, the wrong **runtime**. Running a Python proxy
  next to a Vercel Next.js app doubles the infrastructure for a product whose whole pitch is that
  the file on disk is the only truth. Copy the shape of `provider_budget_config`, not the process.

---
### FL3.2. Vercel AI Gateway: ordered model fallbacks, a $5/month free credit, no free-pool ledger

- **What it does:** a hosted gateway at `https://ai-gateway.vercel.sh/v1` that fronts many providers
  behind one credential. The overview page states the commercial position: `AI Gateway adds zero
  markup to provider token prices, including with BYOK.`
- **Source:** https://vercel.com/docs/ai-gateway opened 2026-09-18
- **Fallback API, exact shape.** A `models` array under `providerOptions.gateway`:

  ```ts
  const { text } = await generateText({
    model: 'anthropic/claude-fable-5',
    prompt: 'Write a haiku about TypeScript.',
    providerOptions: {
      gateway: {
        models: ['anthropic/claude-opus-5', 'google/gemini-3.1-pro-preview'],
      },
    },
  });
  ```

  The order of operations is documented as: `The gateway routes the request to the primary model
  (the model parameter)`, `For each model, provider routing rules apply (using order or only if
  specified)`, `If all providers for a model fail, the gateway tries the next model in the models
  array`, `The response comes from the first successful model/provider combination`.
- **Observability of the failover.** The response carries a `modelAttempts` array in provider
  metadata. The doc's own example shows two failed Gemini attempts with `"statusCode": 500` each,
  then `"modelId": "anthropic:claude-opus-5"` with `"success": true`. This is exactly the audit
  trail we would otherwise have to build.
- **Source:** https://vercel.com/docs/ai-gateway/models-and-providers/model-fallbacks opened 2026-09-18
  (page footer says `Last updated September 8, 2026`)
- **Provider ordering.** `order`, `only` and `sort` live under `providerOptions.gateway`. The page
  gives `order: ['bedrock', 'anthropic'], // Try Bedrock first, then Anthropic` and
  `sort: 'cost', // Sort by cost, latency ('ttft'), or throughput ('tps')`.
- **Source:** https://vercel.com/docs/ai-gateway/models-and-providers/provider-options opened 2026-09-18
- **Pricing, exactly.** Free tier is `$5/month included` monthly credit, `Free Tier eligible models`
  only, `Lower limits per model`, and BYOK is `Not available`. Paid tier is
  `Pay as you go with purchased credits` at `Provider list rates, zero markup`. The page also says
  `Your free credits start when you make your first AI Gateway request.` and `Once you purchase
  credits, your account transitions to the paid tier and the monthly free credit no longer applies.`
- **Source:** https://vercel.com/docs/ai-gateway/pricing opened 2026-09-18
- **Rate limits and the 429.** `AI Gateway does not rate limit paid-tier requests. The free tier
  applies lower per-model limits, and a 429 on either tier may come from the upstream provider
  rather than from AI Gateway.` The error body is
  `{"error": {"message": "Rate limit exceeded", "type": "rate_limit_exceeded"}}`. On headers:
  `Some 429 responses include a retry-after header with the number of seconds to wait. Honor it when
  it is present.` And, importantly for us, the page refuses to publish the numbers:
  `Limits can change, so this page describes behavior rather than fixed numbers. To confirm the
  current limit for a model, contact Vercel from your dashboard's Support entry.`
- **Source:** https://vercel.com/docs/ai-gateway/rate-limits opened 2026-09-18
- **Budgets are a soft cap.** `A budget is a soft cap, not a hard limit. The check runs at the start
  of each request, so the request that crosses the limit still completes and total spend can end up
  slightly over the budget.` When exceeded it returns HTTP 402 with type
  `quota_for_entity_exceeded`. Reset windows are documented as `daily | Midnight UTC each day`,
  `weekly | Monday at midnight UTC`, `monthly | The first of the month at midnight UTC`,
  `none | Never resets; the limit is cumulative`.
- **Source:** https://vercel.com/docs/ai-gateway/observability-and-spend/budgets opened 2026-09-18
- **Can it run inside a Next.js route?** Yes. It is an HTTP endpoint and the AI SDK's default
  provider. No extra service.
- **Does it answer our question?** **Half.** The `models` array is a genuine chain across different
  providers and the `modelAttempts` metadata is excellent. But it tracks **spend in dollars against
  your Vercel credit**, not **each upstream provider's free pool**. It cannot know that your own
  Groq key is finished for the day; a Groq 429 arrives as a transient error to retry. The free tier
  also cannot use BYOK at all, so on the free tier you cannot even bring the free Groq key.
- **Verdict for us:** the **best paid backstop** and the wrong primary. Use it as the last link in
  our chain, on the paid tier, where it buys breadth for pennies and gives us one audited failover
  trail. Do not build the free-pool logic on it, because it has none.

---
### FL3.3. OpenRouter: the only one that will tell you how much free quota you have left

- **What it does:** a hosted gateway with hundreds of models, a `models` fallback array, per-provider
  ordering, price and throughput sorting, and a catalogue of genuinely free model variants.
- **Fallback array.** `The models parameter lets you automatically try other models if the primary
  model's providers are down, rate-limited, or refuse to reply due to content moderation.` The
  trigger list is explicit: `Context length validation errors`, `Moderation flags for filtered
  models`, `Rate-limiting`, `Downtime`. Billing is
  `Requests are priced using the model that was ultimately used, which will be returned in the model
  attribute of the response body.` Through the Anthropic Messages shape there is also a `fallbacks`
  array, capped: `fallbacks accepts at most 3 entries; longer lists return a 400 error.`
- **Source:** https://openrouter.ai/docs/guides/routing/model-fallbacks.md opened 2026-09-18
- **`:floor` and `:nitro`, exactly.** `You can append :nitro to any model slug as a shortcut to sort
  by throughput. In addition to the throughput sort, :nitro makes priority service tier endpoints
  eligible for the request, so it is a superset of setting provider.sort to "throughput" (which only
  sorts).` And: `You can append :floor to any model slug as a shortcut to sort by price. In addition
  to the price sort, :floor makes flex service tier endpoints eligible for the request, so it is a
  superset of setting provider.sort to "price" (which only sorts).` Both are described as
  `a routing variant: it is not a separate entry in the models API, and the model's metadata is the
  base model's.`
- **Provider preferences.** `allow_fallbacks | boolean | true | Whether to allow backup providers
  when the primary is unavailable.` and `sort | string | object | - | Sort providers by price,
  throughput, or latency.` Default behaviour: `OpenRouter routes requests to the best available
  providers for your model. By default, requests are load balanced across the top providers to
  maximize uptime.`
- **Source:** https://openrouter.ai/docs/features/provider-routing opened 2026-09-18
- **Uptime behaviour.** `OpenRouter continuously monitors the health and availability of AI providers
  to ensure maximum uptime for your applications. We track response times, error rates, and
  availability across all providers in real-time, and route based on this feedback.` The page's own
  chart component fetches
  `https://openrouter.ai/api/frontend/v1/stats/model-uptime-recent?permaslug=...` and its thresholds
  in code are `if (availability >= 95) return "fill-current text-green-500"; if (availability >= 85)
  return "fill-current text-yellow-600"; return "fill-current text-red-500";`. Per-provider uptime is
  said to be available programmatically through the Endpoints API.
- **Source:** https://openrouter.ai/docs/guides/best-practices/uptime-optimization.md opened 2026-09-18
- **The free-model limits, as constants on the page.** The limits page declares them in source:
  `export const FREE_MODEL_RATE_LIMIT_RPM = 20;`,
  `export const FREE_MODEL_NO_CREDITS_RPD = 50;`,
  `export const FREE_MODEL_HAS_CREDITS_RPD = 1000;`,
  `export const FREE_MODEL_CREDITS_THRESHOLD = 10;`
  and renders them into a table of `Credits purchased (all time)` against `Requests per minute` and
  `Requests per day`. So: **20 requests a minute always; 50 a day if you have bought less than 10
  credits, 1,000 a day once you have bought at least 10 credits.** The page adds that the higher
  ceiling actually starts one credit below the threshold.
- **The part that matters most to us.** OpenRouter exposes a **live remaining-quota counter**.
  `GET /api/v1/key` returns `free_model_daily_requests` with
  `used: number; // Free-model requests recorded so far in the current UTC day`,
  `limit: number; // Free-model requests allowed per UTC day (see the free usage limits below)`,
  `remaining: number; // Free-model requests left in the current UTC day`, plus `usage_daily:
  number; // Number of credits used (current UTC day)`. The page's own advice is
  `To monitor your remaining quota before hitting a limit, call GET /api/v1/key as shown above.`
  This is the **only** provider in this survey that hands you the ledger rather than making you
  keep one.
- **Rate-limit headers, exactly.** `Successful inference responses do not include X-RateLimit-*
  headers. When OpenRouter itself returns a 429 error for a platform limit, the error response
  carries X-RateLimit-Limit, X-RateLimit-Remaining, and X-RateLimit-Reset headers describing the
  limit that was hit. When every attempted provider returned a retry hint, the error response also
  carries a Retry-After header.` The 429 body is
  `{"error": {"code": 429, "message": "Rate limit exceeded", "metadata": {"error_type":
  "rate_limit_exceeded"}}}`, and when the upstream provider caused it,
  `error.metadata.provider_code carries the provider's original error code when available`.
- **Credit limits are a 402, not a 429.** The page separates them: `Credit limits` map to
  402 Payment Required with `error.metadata.limit_source` on the error, `Rate limits` map to 429
  with `X-RateLimit-*` headers.
- **Source:** https://openrouter.ai/docs/api-reference/limits.md opened 2026-09-18
- **Free Models Router.** `openrouter/free` is a model slug that
  `automatically selects a free model at random from the available free models on OpenRouter` and
  `intelligently filters for models that support the features your request needs, such as image
  understanding, tool calling, and structured outputs`. The response's `model` field names what was
  actually used, and the doc's own sample shows `"model": "upstage/solar-pro-3:free"`.
- **Source:** https://openrouter.ai/docs/guides/routing/routers/free-router.md opened 2026-09-18
- **Can it run inside a Next.js route?** Yes, it is one HTTP endpoint.
- **Does it answer our question?** **Yes, more than anything else here.** Different providers with
  different quotas, a fallback array, and a quota counter you can read before you spend. The
  limitation is that the quota it counts is **OpenRouter's own free-request budget**, not each
  upstream's. But since OpenRouter aggregates the upstreams, that is exactly the abstraction we want
  for one link in the chain.
- **Verdict for us:** **the second link in the chain, and the one whose ledger we can trust because
  we can read it.** 1,000 free requests a UTC day after a one-off 10-credit purchase is a real,
  bankable number, unlike a vague "lower limits per model".

---
### FL3.4. Cloudflare AI Gateway plus Workers AI: the clearest quota-exhaustion error code in the survey

- **What AI Gateway does.** A Universal endpoint at
  `https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}` that takes an **array** of
  request objects and walks it. The page: `Cloudflare can trigger your fallback provider in response
  to request errors or predetermined request timeouts.` and `By default, Cloudflare triggers your
  fallback if a model request returns an error.` Its example walks Workers AI first, then OpenAI, and
  the page adds `You can add as many fallbacks as you need, just by adding another object in the
  array.`
- **Which step served the request.** A response header:
  `cf-aig-step:0 - The first (primary) model was used successfully.`,
  `cf-aig-step:1 - The request fell back to the second model.`,
  `cf-aig-step:2 - The request fell back to t[hird]`. Page footer says `Last updated Apr 20, 2026`.
- **Source:** https://developers.cloudflare.com/ai-gateway/configuration/fallbacks/index.md opened 2026-09-18
- **Its rate limiting is about protecting you from your own users, not about upstream quota.**
  `Rate limiting controls the traffic that reaches your application, which prevents expensive bills
  and suspicious activity.` You pick fixed or sliding: `if it is a fixed rate, the window is based on
  time, so there would be no more than x requests in a ten minute window. If it is a sliding rate,
  there would be no more than x requests in the last ten minutes.` Exceeding it returns
  `429 Too Many Requests`.
- **Source:** https://developers.cloudflare.com/ai-gateway/features/rate-limiting/index.md opened 2026-09-18
- **Workers AI free pool, exactly.** `Workers AI is included in both the Free and Paid Workers plans
  and is priced at $0.011 per 1,000 Neurons.` and `Our free allocation allows anyone to use a total
  of 10,000 Neurons per day at no charge.` Critically for a scheduler:
  `All limits reset daily at 00:00 UTC. If you exceed any one of the above limits, further operations
  will fail with an error.` The table gives `Workers Free | 10,000 Neurons per day | N/A - Upgrade to
  Workers Paid` and `Workers Paid | 10,000 Neurons per day | $0.011 / 1,000 Neurons`.
- **Per-model neuron rates we will need for the arithmetic.** From the LLM model pricing table:
  `@cf/meta/llama-3.1-8b-instruct-fp8-fast | $0.045 per M input tokens / $0.384 per M output tokens |
  4119 neurons per M input tokens / 34868 neurons per M output tokens`;
  `@cf/meta/llama-3.2-3b-instruct | ... | 4625 neurons per M input tokens / 30475 neurons per M
  output tokens`; `@cf/meta/llama-3.2-1b-instruct | ... | 2457 neurons per M input tokens / 18252
  neurons per M output tokens`. Page footer: `Last updated Sep 17, 2026`.
- **Source:** https://developers.cloudflare.com/workers-ai/platform/pricing/index.md opened 2026-09-18
- **Request rate.** `Text Generation` is `300 requests per minute, unless the model requires the
  Workers Paid plan`. Paid-only models get `Standard Workers AI billing | 20 requests per minute` and
  `Prepaid AI Gateway credits | 50 requests per minute`.
- **Source:** https://developers.cloudflare.com/workers-ai/platform/limits/index.md opened 2026-09-18
- **The best error taxonomy in this survey, and the reason Cloudflare is easy to schedule against.**
  Two different 429s with two different internal codes:
  - `Account limited | 3036 | 429 | You have used up your daily free allocation of 10,000 neurons.
    Please upgrade to Cloudflare's Workers Paid plan if you would like to continue usage.`
  - `Out of capacity | 3040 | 429 | Capacity temporarily exceeded, please try again. Also returned
    when rejectIfBusy rejects a request because capacity is unavailable.`
  Also relevant: `Model requires Workers Paid plan | 5035 | 403`, `Request too large | 3006 | 413`,
  `Timeout | 3007 | 408`.
- **Source:** https://developers.cloudflare.com/workers-ai/platform/errors/index.md opened 2026-09-18
- **Can it run inside a Next.js route?** Yes for the gateway (plain HTTP). The Workers AI binding
  needs a Worker, but Workers AI also has a REST API, so a Vercel route can call it with an account
  token.
- **Does it answer our question?** Half. The Universal-endpoint array is a genuine chain of different
  providers. It does not keep a per-provider quota ledger. But `3036` versus `3040` means **we can
  keep one ourselves without guessing**, which is more valuable than a ledger we cannot inspect.
- **Verdict for us:** **first link in the free chain, and the model for how error codes should read.**
  A provider that tells you in the body that your daily allocation is finished is a provider you can
  schedule around.

---

### FL3.5. Portkey: the most precise circuit-breaker configuration published by any of them

- **What it does:** a gateway with configs composed of strategies. The fallback doc says
  `Specify a prioritized list of providers/models. If the primary LLM fails, Portkey automatically
  falls back to the next in line.` and `Available on all Portkey plans.` Fallback triggers are
  configurable: `By default, fallback triggers on any non-2xx status code.` with
  `"strategy": { "mode": "fallback", "on_status_codes": [429, 503] }`. Strategies nest:
  `Fallback targets are fully composable - each target can be a load balancer, a conditional router,
  or another fallback. Any strategy can nest inside any other.`
- **Source:** https://portkey.ai/docs/product/ai-gateway/fallbacks opened 2026-09-18
  (page says `Last modified on August 3, 2026`)
- **The circuit breaker, with the parameter names and their defaults.** The config schema table
  reads: `failure_threshold | Number of failures to open circuit`,
  `failure_threshold_percentage | Percentage failure rate to trip circuit (optional)`,
  `cooldown_interval | Milliseconds to wait before retrying (min: 30s)`,
  `failure_status_codes | HTTP codes considered failures (optional, default: >500)`,
  `minimum_requests | Requests required before evaluating failure rate (optional)`.
  The worked example is `"failure_threshold_percentage": 20, "minimum_requests": 10,
  "cooldown_interval": 60000, "failure_status_codes": [401, 429, 500]`. State machine:
  `Circuit opens (OPEN) when: Failure count exceeds failure_threshold, or Failure rate exceeds
  failure_threshold_percentage` and `Circuit closes (CLOSED) automatically after cooldown_interval
  passes.` One caveat on the page: `conditional mode strategies are not evaluated by circuit
  breaker.`
- **Source:** https://portkey.ai/docs/product/ai-gateway/circuit-breaker opened 2026-09-18
- **Note on identity.** The fallback page carries the line
  `Portkey is now PRISMA AIRS AI Gateway. See it in action.` UNVERIFIED: what that means
  commercially. It is on the page; I did not open a corporate announcement to confirm the shape of
  the change.
- **Can it run inside a Next.js route?** As a hosted gateway, yes (HTTP). The open-source gateway is
  a separate service.
- **Does it answer our question?** Only the first half. Chain of different providers, yes, with the
  nicest failure semantics here. Per-provider quota exhaustion, no: `cooldown_interval` has a
  documented minimum of 30 seconds and is measured in milliseconds, which tells you what it is for.
  It is an outage breaker, not a daily-pool ledger.
- **Verdict for us:** **steal the parameter names.** `failure_threshold_percentage`,
  `minimum_requests`, `cooldown_interval`, `failure_status_codes` is exactly the right set for our
  own breaker, and `minimum_requests` is the one an amateur implementation forgets, so a single
  early failure trips the circuit on a provider that is fine.

---

### FL3.6. Helicone: an observability layer with a standards-shaped rate-limit header, pointed the wrong way for us

- **What it does:** both an observability platform and, more recently, an AI Gateway. The gateway
  page: `Use any LLM provider through a single OpenAI-compatible API with intelligent routing,
  fallbacks, and unified observability` and `Helicone AI Gateway provides a unified API for 100+ LLM
  providers through the OpenAI SDK format.` Its own comparison table claims `Open Source | ✅ | ❌`
  against OpenRouter and `Automatic Fallbacks | ✅ | ✅`.
- **Source:** https://docs.helicone.ai/gateway/overview opened 2026-09-18
- **Its rate limiting is per-caller, not per-provider.** Set with a header:
  `"Helicone-RateLimit-Policy": "[quota];w=[time_window];u=[unit];s=[segment]"`, with
  `w` documented as `Time window in seconds. Minimum is 60 seconds.` and `u` as
  `Unit type: request (default) or cents for cost-based limiting.` and `s` as
  `Segment type: user for per-user limits, or custom property name for per-property limits.` The doc
  notes `This header format follows the IETF standard for rate limit headers (except for our custom
  segment field)!` and, candidly, `Each model provider has their own rate limit for your key.
  Helicone's rate limit is bounded by your provider's policy.`
- **Source:** https://docs.helicone.ai/features/advanced-usage/custom-rate-limits opened 2026-09-18
- **Does it answer our question?** No on the second half, and it says so. Its limits govern
  **our users' consumption of us**, which is a different and also necessary job.
- **Verdict for us:** **useful for the other half of the problem.** We need a per-user cap anyway
  (10 edits and 1 Low blueprint a month), and `u=cents` plus `s=user` is a clean way to express it.
  But this is not the provider-exhaustion ledger.

---

### FL3.7. Kong AI Gateway, Braintrust proxy, Martian, Not Diamond, RouteLLM, Unify: what each is actually for

Grouped because none of them changes our design, and two of them no longer exist as routers.

- **Kong AI Gateway.** Positioned around enterprise plumbing: the page names
  `Routing and load balancing across AI providers`, `AI Semantic Cache`,
  `Model cost management and AI Rate Limiting Advanced`, `AI Semantic Prompt Guard`, and
  `Route requests across multiple LLM providers with failover and load balancing.` It has moved to
  an entity model: `Instead of configuring the AI Proxy/AI Proxy Advanced plugin directly, you now
  create AI Model Provider and AI Model entities to manage upstream connectivity and routing.`
  **Source:** https://developer.konghq.com/ai-gateway/ opened 2026-09-18. It is a Kong data-plane
  deployment, so it cannot live inside a Next.js route. For a two-person product this is the wrong
  weight class.
- **Braintrust proxy.** **Source:** https://www.braintrust.dev/docs/guides/proxy opened 2026-09-18.
  UNVERIFIED on detail: the page fetched as the docs shell and I did not get a clean text extraction
  of its routing semantics, so I am not going to characterise its fallback behaviour. What I can say
  from the fetch is that it is documented as a guide under an evaluation platform, and an eval
  platform's proxy is optimised for capturing traces, not for surviving a quota wall.
- **Martian.** **It is no longer a router company.** Its homepage is headed
  `Martian: Understanding Intelligence` and opens
  `A Lab Building Best Execution for LLMs` under the name `Thesean AI`, describing itself as
  `We're a team of researchers who've left the big labs to focus on understanding machine
  intelligence.` The docs site's navigation is `ARES`, `K-STEERING`, `GATEWAY`, and the self
  description is `Martian is an AI research lab focused on understanding machine intelligence. As we
  experiment, we often build new solutions and tools to meet our workflows. Martian makes some of
  these solutions available externally.` The gateway survives as
  `The Martian Gateway provides unified access to 200+ AI models through a single API`.
  **Sources:** https://withmartian.com/ and https://docs.withmartian.com/ both opened 2026-09-18.
  **INFERENCE:** a router whose vendor has become a research lab is a dependency with a shelf life.
- **Not Diamond.** Alive, and repositioned at coding agents. The homepage reads
  `Not Diamond is the world's most powerful intelligent model router for coding agents.` and
  `Not Diamond intelligently predicts which model to use for each input, reducing costs while
  maintaining accuracy.` Its headline figures on the page are `Accuracy gains5% +5% +`,
  `Cost savings20% +20% +`, `Faster dev cycles2x2x`. It carries an OpenRouter endorsement:
  `We use Not Diamond to power our intelligent routing feature, giving developers the ability to
  automatically use the best model on every input across every leading language model.Alex Atallah
  CEO and Co-founder, OpenRouter`. Crucially it does not execute:
  `Integrations are stack agnostic through our secure API - our intelligent recommendations are
  executed in your model gateway and harness of choice.`
  **Source:** https://www.notdiamond.ai/ opened 2026-09-18.
  It answers **which model is best for this prompt**, never **which provider still has quota**.
  Different question.
- **RouteLLM.** The repo (`lm-sys/RouteLLM`, `5.5k stars` on the page as opened) describes itself as
  `a framework for serving and evaluating LLM routers` and claims
  `Trained routers are provided out of the box, which we have shown to reduce costs by up to 85%
  while maintaining 95% GPT-4 performance on widely-used benchmarks like MT Bench.` and
  `Benchmarks also demonstrate that these routers achieve the same performance as commercial
  offerings while being >40% cheaper.` Its mechanism is a calibrated threshold over a strong/weak
  pair: `For 50.0% strong model calls for mf, threshold = 0.11593`.
  **Sources:** https://github.com/lm-sys/RouteLLM opened 2026-09-18; paper abstract at
  https://arxiv.org/abs/2406.18665 opened 2026-09-18, which states
  `we propose several efficient router models that dynamically select between a stronger and a
  weaker LLM during inference` and `significantly reduces costs-by over 2 times in certain
  cases-without compromising the quality of responses`, plus the transfer claim
  `maintaining their performance even when the strong and weak models are changed at test time`.
  Python, so its own service. **It is a quality router, not an availability router.** Same category
  error as Not Diamond for our purpose.
- **Unify.** **Also no longer an LLM router.** The site now reads
  `unify is a research lab working on continual learning: systems that improve from a stream of
  experience without forgetting what they know.` and
  `Today's models are trained once and frozen. Everything they learn after deployment is thrown
  away.` **Source:** https://unify.ai/ opened 2026-09-18.

**The pattern across all six.** The market split into two kinds of router and neither is ours.
Quality routers (RouteLLM, Not Diamond, the surviving Martian gateway) answer *which model is best
for this prompt*. Enterprise gateways (Kong, Portkey, Helicone) answer *how do I govern this traffic*.
**Availability routing across heterogeneous free pools is a niche nobody is serving**, because the
people who care about free pools are not the people who buy gateways.

---

### FL3.8. Vercel AI SDK: version 7 is current, `maxRetries` defaults to 2, and there is no fallback primitive in core

- **Current major version, from the registry itself.** `https://registry.npmjs.org/ai` opened
  2026-09-18 by curl and parsed with Python reports `"latest": "7.0.105"`, published
  `2026-09-16T22:47:10.578Z`. The full `dist-tags` map on that document is
  `{"alpha": "5.0.0-alpha.15", "canary": "7.0.0-canary.176", "beta": "7.0.0-beta.187",
  "snapshot": "0.0.0-f1630544-20260811180950", "ai-v5": "5.0.259", "ai-v6": "6.0.285",
  "latest": "7.0.105"}`. So **AI SDK 7 is the stable line**, v6 is pinned at 6.0.285 on its own tag,
  and this is consistent with the AI Gateway docs saying `These examples use AI SDK 7 and the AI SDK
  for Python beta.`
  (Correction recorded deliberately: my first draft of this finding said v6 was `latest`. That was
  from memory, not from the registry, and it was wrong. RULE 1.)
- **Retry behaviour, from the SDK's own settings page.** Under Request Options:
  `maxRetries` / `Maximum number of retries. Set to 0 to disable retries. Default: 2.`
  The Gateway docs restate it: `The AI SDK retries failed requests automatically with exponential
  backoff, and its maxRetries option defaults to 2.`
  **Source:** https://ai-sdk.dev/docs/ai-sdk-core/settings opened 2026-09-18
- **The timeout options are the single most useful thing the SDK gives our design.** Also from the
  settings page, `timeout` takes an object, and two of its fields are streaming-specific:
  `firstChunkMs: The timeout until the first content-bearing output of each step (streaming only).
  Text deltas, reasoning deltas, tool-input deltas, generated files, and tool calls satisfy the
  timeout. Response metadata, stream starts, empty deltas, raw chunks, and transport activity do not
  satisfy or reset it.` and
  `chunkMs: The timeout between content-bearing output chunks after output has started (streaming
  only). Non-content chunks do not reset it. This is useful for detecting streams that stall after
  generation begins.` Others are `totalMs`, `stepMs`, `toolMs` and per-tool `{toolName}Ms`.
  **This is exactly the pair a streaming failover needs**, and I did not expect the SDK to have it.
  `firstChunkMs` is the clean line between a failover the user never sees and one they do.
- **The exact fallback API: there is no `fallback` option in AI SDK core.** Failover is expressed
  three ways, and only the second is a real primitive:
  1. `providerOptions.gateway.models` (FL3.2), which is the **Gateway's** feature, not the SDK's.
  2. `customProvider({ ..., fallbackProvider: gateway })`. The provider-management page uses
     `fallbackProvider: gateway` in several examples and notes
     `If no files or skills option is set but a fallbackProvider is configured, the custom provider
     will inherit those interfaces from the fallback.` INFERENCE, and worth flagging: this is a
     **resolution** fallback (what to do with an unknown model id), not a **runtime failover**
     (what to do when a call fails). Do not confuse the two. One example on the page is even
     annotated `// no fallback provider`.
  3. Catch and re-call. Which is what everyone actually does.
- **The interception seam we want.** `wrapLanguageModel` takes `{ model, middleware }` and
  `Language model middleware is a way to enhance the behavior of language models` in
  `a language model agnostic way`. Multiple middlewares compose:
  `The middlewares will be applied in the order they are provided.` with the doc's own note
  `// applied as: firstMiddleware(secondMiddleware(yourModel))`. The three hooks are
  `transformParams: Transforms the parameters before they are passed to the language model, for both
  doGenerate and doStream.`, `wrapGenerate: Wraps the doGenerate method of the language model .`,
  and `wrapStream: Wraps the doStream method of the language model .`
  **Source:** https://ai-sdk.dev/docs/ai-sdk-core/middleware opened 2026-09-18
- **The registry.** `createProviderRegistry` keys models as `provider:model`, and
  `By default, the registry uses : as the separator between provider and model IDs.` with an option
  `{ separator: ' > ' }`.
  **Source:** https://ai-sdk.dev/docs/ai-sdk-core/provider-management opened 2026-09-18
- **Streaming errors.** The error-handling page distinguishes two cases:
  `When errors occur during streams that do not support error chunks, the error is thrown as a
  regular error. You can handle these errors using the try/catch block.` versus
  `The stream result supports error parts. You can handle those parts similar to other parts. It is
  recommended to also add a try-catch block for errors that happen outside of the streaming.`
  **Source:** https://ai-sdk.dev/docs/ai-sdk-core/error-handling opened 2026-09-18
- **Does it answer our question?** No, and it should not. It is a client library. What matters is
  that it hands us a clean interception point (`wrapLanguageModel`), a registry, and
  `firstChunkMs`/`chunkMs`, which is where our own ledger and our stream failover will attach.
- **Verdict for us:** **the substrate, not the solution.** Use AI SDK 7 with our own chain on top,
  and set `maxRetries: 0` on the inner calls so our chain owns the decision rather than the SDK's
  blind backoff spending three seconds on a pool that is empty until midnight.

---

---

## Part two: the mechanics, with real numbers

### FL3.9. Circuit breaker parameters: what three production implementations actually default to

The three-state machine is uncontroversial and identical everywhere. The numbers are not, and the
gap between them is the interesting part.

**resilience4j**, the reference Java implementation, with its published defaults:

| Parameter | Default | What the page says it does |
|---|---|---|
| `failureRateThreshold` | `50` | `Configures the failure rate threshold in percentage.` |
| `slowCallRateThreshold` | `100` | `Configures a threshold in percentage. The CircuitBreaker considers a call as slow when the call duration is greater than slowCallDurationThreshold` |
| `slowCallDurationThreshold` | `60000 [ms]` | `Configures the duration threshold above which calls are considered as slow` |
| `permittedNumberOfCallsInHalfOpenState` | `10` | `Configures the number of permitted calls when the CircuitBreaker is half open.` |
| `maxWaitDurationInHalfOpenState` | `0 [ms]` | `Value 0 means Circuit Breaker would wait infinitely in HalfOpen State until all permitted calls have been completed.` |
| `slidingWindowType` | `COUNT_BASED` | count-based or time-based |
| `slidingWindowSize` | `100` | `Configures the size of the sliding window` |
| `minimumNumberOfCalls` | `100` | `Configures the minimum number of calls which are required (per sliding window period) before the CircuitBreaker can calculate the error rate` |
| `waitDurationInOpenState` | `60000 [ms]` | `The time that the CircuitBreaker should wait before transitioning from open to half-open.` |
| `automaticTransitionFromOpenToHalfOpenEnabled` | `false` | if false, `the transition to HALF_OPEN only happens if a call is made, even after waitDurationInOpenState is passed` |

The state machine: `The CircuitBreaker rejects calls with a CallNotPermittedException when it is
OPEN. After a wait time duration has elapsed, the CircuitBreaker state changes from OPEN to HALF_OPEN
and permits a configurable number of calls to see if the backend is still unavailable or has become
available again.` And the guard against tripping on noise:
`if the minimum number of required calls is 10, then at least 10 calls must be recorded, before the
failure rate can be calculated. If only 9 calls have been evaluated the CircuitBreaker will not trip
open even if all 9 calls have failed.`

- **Source:** https://resilience4j.readme.io/docs/circuitbreaker opened 2026-09-18

**Portkey** (an actual LLM gateway, from FL3.5): `failure_threshold_percentage: 20`,
`minimum_requests: 10`, `cooldown_interval: 60000`, `failure_status_codes: [401, 429, 500]`, with the
documented floor `cooldown_interval | Milliseconds to wait before retrying (min: 30s)`.

**LiteLLM** (FL3.1): `allowed_fails: 3`, `cooldown_time: 5s`, and 429 trips it immediately.

**What the spread tells us.** The wait-in-open-state ranges over **five seconds (LiteLLM) to sixty
seconds (resilience4j and Portkey), a factor of twelve**, and the minimum-calls guard ranges over
**3 (LiteLLM) to 100 (resilience4j), a factor of thirty-three**. That is not disagreement about
theory. It is a difference in what is being protected. resilience4j guards a service you own, where
opening the circuit sheds load you would otherwise have to serve. An LLM router guards a service you
do not own, where opening the circuit costs you nothing and the alternative is a user staring at an
error. **INFERENCE, and it is the design rule I would take from this:** when failing over is cheap
and failing is expensive, trip early and recover often. LiteLLM's 3-fails-then-5-seconds is closer
to right for us than resilience4j's 100-and-60-seconds, and Portkey's `minimum_requests: 10` is the
guard that stops a single cold-start blip from blacklisting a healthy provider.

**One parameter none of them has, and we need.** Every breaker above measures **failure**. None
measures **exhaustion**. A provider whose daily pool is finished is not failing: it is correctly
telling you it is out. A breaker that treats those the same will retry a Groq key every five seconds
for the remaining eleven hours of the UTC day. The ledger in Part Four exists because the circuit
breaker literature has no concept for this.

---

### FL3.10. Distinguishing quota exhaustion from a transient error: the four providers, opened

This is the crux of the whole design, so here is each provider's actual signal, copied.

**Cloudflare Workers AI. The clearest of the four, and the only one that separates the two cases by
error code.** From the errors table:

| Name | Internal Code | HTTP Code | Description |
|---|---|---|---|
| `Account limited` | `3036` | `429` | `You have used up your daily free allocation of 10,000 neurons. Please upgrade to Cloudflare's Workers Paid plan if you would like to continue usage.` |
| `Out of capacity` | `3040` | `429` | `Capacity temporarily exceeded, please try again. Also returned when rejectIfBusy rejects a request because capacity is unavailable.` |

`3036` means **stop until 00:00 UTC**. `3040` means **try again in a second**. Same HTTP status.
If you only read the status you cannot tell them apart, and that is the single most important
sentence in this document.
**Source:** https://developers.cloudflare.com/workers-ai/platform/errors/index.md opened 2026-09-18.
Reset time is pinned: `All limits reset daily at 00:00 UTC.`
(https://developers.cloudflare.com/workers-ai/platform/pricing/index.md opened 2026-09-18)

**Groq. Rich headers, and one hole exactly where we need it.** The documented headers, with the
page's own notes column:

| Header | Value | Notes |
|---|---|---|
| `retry-after` | `2` | `In seconds` |
| `x-ratelimit-limit-requests` | `14400` | `Always refers to Requests Per Day (RPD)` |
| `x-ratelimit-limit-tokens` | `18000` | `Always refers to Tokens Per Minute (TPM)` |
| `x-ratelimit-remaining-requests` | `14370` | `Always refers to Requests Per Day (RPD)` |
| `x-ratelimit-remaining-tokens` | `17997` | `Always refers to Tokens Per Minute (TPM)` |
| `x-ratelimit-reset-requests` | `2m59.56s` | `Always refers to Requests Per Day (RPD)` |
| `x-ratelimit-reset-tokens` | `7.66s` | `Always refers to Tokens Per Minute (TPM)` |

And the operational note: `Note: retry-after is only set if you hit the rate limit and status code
429 is returned. The other headers are always included.` Plus
`When you exceed rate limits, our API returns a 429 Too Many Requests HTTP status code.`

**The hole.** Groq's limits are measured in `RPM`, `RPD`, `TPM`, `TPD`, `ASH`, `ASD`, `ITPM`, `OTPM`
(all eight named on the page), but **only two of the eight are reported in headers**: RPD for
requests and TPM for tokens. **There is no `x-ratelimit-remaining` for TPD.** Groq's free plan caps
the four main chat models at 200K tokens per day (per L1 FL1-1, which opened the same table), and
that 200K is the limit that will actually bite us, and it is the one number the API will never tell
us. We have to count it ourselves.

Two more facts from the same page that shape the design:
`Rate limits apply at the organization level, not individual users.` (so one key, one pool, shared
across every user and every Vercel instance) and
`Cached tokens do not count towards your rate limits.` (so prompt caching directly buys quota, not
just latency).
**Source:** https://console.groq.com/docs/rate-limits opened 2026-09-18

**Cerebras. A different model entirely: no reset, and a pre-flight rejection.**
`We use the token bucketing algorithm for rate limiting, which means your capacity replenishes
continuously rather than resetting at fixed intervals. As you consume tokens or requests, your
available capacity automatically refills up to your maximum limit.` with
`Available quota = min(Rate limit, Rate limit + replenished tokens by time − current usage)`.
Its rejection is **before the work**, based on an estimate:
`When you send a request, we estimate the total tokens the request will consume by: 1. Estimating the
input tokens in your prompt 2. Adding either the max_completion_tokens parameter or an analyzed
estimate for an upper bound of the output tokens. If this estimated token consumption would exceed
your available token quota, the request is rate limited before processing begins.` with the advice
`Set max_completion_tokens appropriately for your use case to avoid overestimating token usage and
triggering unnecessary rate limits.`
Two buckets: `Cerebras enforces two independent token limits per organization`, `Uncached TPM`
(`Tokens that require full compute (cache misses)`) and `Total TPM` (`3× your uncached TPM`), with
`Both limits are enforced independently. A 429 error will indicate which bucket was exceeded.` and
`If you exceed your rate limits, you will receive a 429 Too Many Requests error. The error message
will indicate whether your uncached or total token limit was exceeded.`
Free Trial table: `gpt-oss-120b | 5 | 30K | 90K | 1M | 1M` across `RPM | Uncached TPM | Total TPM |
TPH | TPD`. No `retry-after` or `x-ratelimit-*` header is documented anywhere on the rate-limits or
error page. The error page lists only `429 | RateLimitError/Too many requests` in a plain status
table, and its SDK guidance is `max_retries=0, # Disable retries (default is 2)`.
**Sources:** https://inference-docs.cerebras.ai/support/rate-limits.md and
https://inference-docs.cerebras.ai/support/error.md, both opened 2026-09-18

**OpenRouter. The only one with a queryable ledger, and it separates money from rate.** Repeating
the key facts from FL3.3 because this is where they belong: 429 carries `X-RateLimit-Limit`,
`X-RateLimit-Remaining` and `X-RateLimit-Reset` **only on the error response, never on success**
(`Successful inference responses do not include X-RateLimit-* headers.`); `Retry-After` appears
`When every attempted provider returned a retry hint`; upstream cause is carried in
`error.metadata.provider_code`; and credit exhaustion is a **402**, not a 429, with
`error.metadata.limit_source`. `GET /api/v1/key` returns `free_model_daily_requests`
(`used`, `limit`, `remaining`) and `usage_daily`.
**Source:** https://openrouter.ai/docs/api-reference/limits.md opened 2026-09-18

**The summary table we will actually code against.**

| Provider | Exhaustion signal | Transient signal | Can we read remaining before spending? | Reset |
|---|---|---|---|---|
| Cloudflare Workers AI | 429 + internal `3036` | 429 + internal `3040` | No | `00:00 UTC` daily, stated |
| Groq | 429, and `x-ratelimit-remaining-requests` hits 0 for RPD | 429 with `retry-after` seconds | **Requests yes, daily tokens no** | RPD implied daily; TPD not exposed |
| Cerebras | 429 naming the bucket | 429 naming the bucket | No | **Never** (token bucket, continuous refill) |
| OpenRouter | 429 with `X-RateLimit-*`; 402 for credits | 429 with `Retry-After` | **Yes, `GET /api/v1/key`** | `current UTC day` |
| Vercel AI Gateway | 402 `quota_for_entity_exceeded` (budget) | 429 `rate_limit_exceeded` | No (limits not published) | `Midnight UTC each day` for daily budgets |

**INFERENCE, and it is the hard-won bit:** there is no portable way to tell exhaustion from a blip.
Every provider encodes it differently, two of them do not encode it at all, and one has no notion of
a daily reset to encode. Any router that claims to handle this generically is guessing. The only
honest design is a per-provider adapter that knows each one's dialect, plus our own ledger as the
backstop for the cases where the dialect says nothing.

---
### FL3.11. Quota accounting across a serverless fleet: Firestore is the wrong shape and the docs no longer give you the number

The problem: Groq's pool is `per organisation per day`, our fleet is Vercel functions with no shared
memory, and the pool has to be decremented before the next cold function decides to spend it.

**Firestore's published write limits, opened and quoted.** The free tier table:

| Free tier | Quota |
|---|---|
| Stored data | `1 GiB` |
| Document reads | `50,000 per day` |
| Document writes | `20,000 per day` |
| Document deletes | `20,000 per day` |
| Outbound data transfer | `10 GiB per month` |

**Source:** https://firebase.google.com/docs/firestore/quotas opened 2026-09-18

**The single-document write rate, and a correction to received wisdom.** The widely repeated figure
is one sustained write per second to a single document. **Firebase no longer publishes that number.**
The current best-practices page says instead:
`The exact maximum rate that an app can update a single document depends highly on the workload. The
best way to characterize your workload's performance is to perform load testing. Factors include the
write rate, contention among requests, and the number affected indexes.` and
`A document write operation updates the document and any associated indexes, and Cloud Firestore
synchronously applies the write operation across a quorum of replicas. At high enough write rates,
the database will start to encounter contention, higher latency, or other errors.`
The one hard rate on that page is a **collection** limit, not a document one:
`If you index a field that increases or decreases sequentially between documents in a collection,
like a timestamp, then the maximum write rate to the collection is 500 writes per second.`
**Sources:** https://firebase.google.com/docs/firestore/best-practices and
https://cloud.google.com/firestore/native/docs/best-practices, both opened 2026-09-18.
**INFERENCE:** the number was removed because it was never a constant, not because the contention
went away. Treat a single hot counter document as unsafe and unquantified rather than as safe.

**The documented pattern is sharding, and the docs are candid about its cost.**
`In Cloud Firestore, you can't update a single document at an unlimited rate. If you have a counter
based on single document and frequent enough increments to it you will eventually see contention on
the updates to the document.` The fix: `Each counter is a document with a subcollection of "shards,"
and the value of the counter is the sum of the value of the shards.` and
`Write throughput increases linearly with the number of shards, so a distributed counter with 10
shards can handle 10x as many writes as a traditional counter.` The stated trade-off:
`With too few shards, some transactions may have to retry before succeeding, which will slow writes.
With too many shards, reads become slower and more expensive. You can offset the read-expense by
keeping the counter total in a separate roll-up document which is updated at a slower cadence`.
**Source:** https://firebase.google.com/docs/firestore/solutions/counters opened 2026-09-18

**Why sharding is exactly wrong for a quota gate.** A sharded counter is eventually consistent by
construction: to know the total you read N shards and add them up, and the answer is stale the moment
you have it. That is fine for a like count. It is wrong for **should I spend from this pool**, where
a stale read either overspends the pool (and the user gets the error we promised they would never
see) or underspends it (and we pay for a paid provider while free quota sits unused). Sharding
trades the exact property we need for the one we do not care about.

**Durable Objects are the right shape and we are not using them.** The overview:
`Each Durable Object has a globally-unique name, which allows you to send requests to a specific
object from anywhere in the world. Thus, a Durable Object can be used to coordinate between multiple
clients who need to work together.` and
`Each Durable Object has some durable storage attached. Since this storage lives together with the
object, it is strongly consistent yet fast to access.` and the pitch line
`without requiring you to build serialization and coordination primitives on your own.`
Free-plan limits as published: `Maximum Durable Object classes (per account) | 500 (Workers Paid) /
100 (Free)`, `Storage per account | Unlimited (Workers Paid) / 5GB (Free)`, and
`Workers Free plan: Only Durable Objects with SQLite storage backend are available.`
**Sources:** https://developers.cloudflare.com/durable-objects/index.md and
https://developers.cloudflare.com/durable-objects/platform/limits/index.md, both opened 2026-09-18

One named-object-per-provider-per-UTC-day (`groq:2026-09-18`) gives a single-writer, strongly
consistent counter with no shards and no contention design. **We already have a Cloudflare account
for R2.** INFERENCE: this is the cheapest correct answer available to us, and the fact that it sits
outside the Vercel and Firebase halves of the stack is a real cost, not a footnote. It adds a third
runtime to reason about.

**The honest third option: do not count tokens at all, count requests.** Because Groq will not tell
us TPD remaining (FL3.10), any token ledger is an estimate we maintain. A **request** ledger is
exact, cheap and needs one write per call. We can convert: at roughly 4,800 tokens for an edit
(Part Three), Groq's 200K TPD is about 41 edits a day, which is well under the 1K RPD, so **tokens
bind before requests and a request counter alone is not enough**. The workable compromise is a
counter of **estimated tokens**, reconciled against the `usage` block every provider returns on
completion. That is two writes per call, which at 20,000 free Firestore writes a day is the number
to watch.

---

### FL3.12. Streaming failover: the honest answer is that you get one free switch, and only before the first visible token

This is the hardest part of the brief, so here is what is actually true, from the pages.

**Fact one: the HTTP status commits before the first token.** OpenRouter states it precisely:
`Once the provider has returned response headers, the 200 OK status is committed even if no token has
been produced yet. Any error after that point arrives as an SSE event rather than as an HTTP
status.` The shape of that event:

```text
data: {"id":"cmpl-abc123","object":"chat.completion.chunk","created":1234567890,"model":"openai/gpt-4o","provider":"openai","error":{"code":"server_error","message":"Provider disconnected unexpectedly"},"choices":[{"index":0,"delta":{"content":""},"finish_reason":"error"}]}
```

with these characteristics, copied:
`The error appears at the top level alongside standard response fields (id, object, created, etc.)`,
`A choices array is included with finish_reason: "error" to properly terminate the stream`,
`The HTTP status remains 200 OK since headers were already sent`,
`The stream is terminated after this unified error event`, and the one that matters most:
`The error can be the first and only event in the stream, so treat a 200 carrying an error chunk with
no content as a failure, not a success`.
The rate-limit page gives the 429 flavour of the same thing:
`If a rate limit is hit after streaming has started, the error arrives as an SSE event with
finish_reason: "error" instead of an HTTP 429, since the 200 OK status was already sent.`
**Sources:** https://openrouter.ai/docs/api_reference/streaming.md and
https://openrouter.ai/docs/api-reference/limits.md, both opened 2026-09-18

**Fact two: there is a window between the committed 200 and the first visible token, and the AI SDK
hands you a timer for exactly that window.** `firstChunkMs: The timeout until the first
content-bearing output of each step (streaming only). Text deltas, reasoning deltas, tool-input
deltas, generated files, and tool calls satisfy the timeout. Response metadata, stream starts, empty
deltas, raw chunks, and transport activity do not satisfy or reset it.` and its sibling
`chunkMs: The timeout between content-bearing output chunks after output has started (streaming
only). Non-content chunks do not reset it. This is useful for detecting streams that stall after
generation begins.`
**Source:** https://ai-sdk.dev/docs/ai-sdk-core/settings opened 2026-09-18

**So there are three moments and they are not equally recoverable.**

1. **Before the upstream 200.** Fully invisible. Fail over freely. This is where the overwhelming
   majority of quota failures land, because a quota check is a pre-flight check: Cerebras says so
   outright (`the request is rate limited before processing begins`) and a Groq or Cloudflare daily
   cap is evaluated at admission. **Quota exhaustion is almost never a mid-stream event.** That is
   the single most reassuring fact in this whole document.
2. **After the upstream 200, before the first content chunk.** Invisible **if and only if** we have
   not already flushed a 200 and an opening byte to the browser. Recoverable by holding our own
   response open and not writing until the first content delta arrives. `firstChunkMs` is the timer.
   The cost is time-to-first-token on the happy path is unchanged, and on the unhappy path the user
   waits for provider A's timeout plus provider B's full latency.
3. **After the first visible token.** **Not invisible, and anybody who tells you otherwise is
   selling something.** The user has read words. The replacement provider will not continue them; it
   will write different ones. Your choices are: restart the answer visibly, or append a second
   answer, or stop.

**What the real implementations do at moment 3, and it is not failover.** They make the stream
**resumable** rather than **replaceable**. The AI SDK's own resume mechanism keeps the generation
running server-side and lets the client reconnect to the same stream:
`Stream resumption lets a client reconnect to an active stream after the original connection closes.
To make that possible, the server keeps the stream running even when no client is actively consuming
it. If the user refreshes the page, closes the tab, loses their connection, or navigates away, the
client can reconnect later with resumeStream().` It needs infrastructure:
`The resumable-stream package - Handles the publisher/subscriber mechanism for streams` and
`A Redis instance - Stores stream data`, with `Stream expiration: Streams in Redis expire after a set
time (configurable in the resumable-stream package)`.
**Source:** https://ai-sdk.dev/docs/ai-sdk-ui/chatbot-resume-streams opened 2026-09-18. The package
is real and current: `https://registry.npmjs.org/resumable-stream` opened 2026-09-18 reports
`latest` `2.2.13` published `2026-09-16T19:27:57.336Z`, described as
`Library for resuming and following streams in distributed systems`.
Note what this solves and what it does not: it survives **the client's** connection dying. It does
not survive **the provider** dying, because the thing being resumed is the same generation.

**Fact three, and a trap: abandoning a stream does not always stop the meter.** OpenRouter:
`Streaming requests can be cancelled by aborting the connection. For supported providers, this
immediately stops model processing and billing.` Its `Not Currently Supported` list includes, copied:
`AWS Bedrock, Groq, Modal`, `Google, Google AI Studio, Minimax`, `HuggingFace, Replicate,
Perplexity`, `Mistral, AI21, Featherless`. **Groq is on the unsupported list.** So a mid-stream
failover away from Groq burns the Groq tokens anyway. On a 200K-token daily pool, a failover strategy
that abandons half-finished Groq generations will drain the pool faster than serving them would.
**Source:** https://openrouter.ai/docs/api_reference/streaming.md opened 2026-09-18

**The design conclusion.** Do not promise invisible mid-stream failover. Promise **pre-stream
failover**, which covers essentially all quota failures, and handle moment 3 with an honest
interface rather than a clever one. For an editor this is easier than for a chat app: an edit
proposal that half-arrives can simply be discarded and retried, because **nothing has been written
to the file yet.** The change queue is the natural place for a failed generation to die quietly.

---
### FL3.13. Prompt caching: it buys us quota, not just money, and it survives a router only if the router pins the provider

**Groq. Free, automatic, and it directly enlarges the pool we are short of.**
`Prompt caching works automatically on all your API requests with no code changes required and no
additional fees.` Mechanism: `Prefix Matching: When you send a request, the system examines and
identifies matching prefixes from recently processed requests stored temporarily in volatile memory.
Prefixes can include system prompts, tool definitions, few-shot examples, and more.` Saving:
`Cache Hit: If a matching prefix is found, cached computation is reused, dramatically reducing
latency and token costs by 50% for cached portions.` and
`Prompt caching is provided at no additional cost. There is a 50% discount for cached input tokens.`
Lifetime: `All cached data automatically expires after 2 hours without use.`

**The sentence that matters more than the discount**, with its own caveat attached:
`Cached tokens do not count towards your rate limits. However, cached tokens are subtracted from your
limits after processing, so it's still possible to hit your limits if you are sending a large number
of input tokens in parallel requests.`
On a free tier this is not a cost saving, it is a **capacity multiplier**: a cached prefix is
capacity we get back. And the ordering rule is stated plainly:
`Place static content like instructions and examples at the beginning of your prompt, and put
variable content, such as user-specific information, at the end.` with the failure mode spelled out:
`If you put variable information (like timestamps or user IDs) at the beginning, even identical
system instructions later in the prompt won't benefit from caching because the prefixes won't match.`
Also: `Cache hits are only possible for exact prefix matches within a prompt.`
**Source:** https://console.groq.com/docs/prompt-caching opened 2026-09-18

**Cerebras.** Per L1 FL1-2, which opened https://inference-docs.cerebras.ai/capabilities/prompt-caching
on 2026-09-18: `Prompt caching is automatically enabled for all customers and models`,
`The system processes prompts in 128-token blocks`, `We guarantee a Time-To-Live (TTL) of 5 minutes,
though caches may persist up to 1 hour depending on system load`, and, matching Groq's logic,
`Cached tokens don't count toward your uncached TPM limit, so a higher cache hit rate lets you
process far more total tokens within the same uncached limit.` The rate-limits page puts a number on
it: `With a 1M uncached TPM limit, your total limit is 3M TPM. At a 70% cache hit rate, you can
effectively process up to 3M total tokens per minute — 1M uncached plus up to 2M cached — all within
your standard limits.`

**The multipliers, collected on one page.** OpenRouter's caching page declares the read and write
multipliers as constants: `MOONSHOT_CACHE_READ_MULTIPLIER = '0.25'`,
`GROK_CACHE_READ_MULTIPLIER = '0.25'`, `GOOGLE_CACHE_READ_MULTIPLIER = '0.25'`,
`DEEPSEEK_CACHE_READ_MULTIPLIER = '0.1'`, `ANTHROPIC_CACHE_WRITE_MULTIPLIER = '1.25'`,
`ANTHROPIC_CACHE_READ_MULTIPLIER = '0.1'`, `ALIBABA_CACHE_WRITE_MULTIPLIER = '1.25'`,
`ALIBABA_CACHE_READ_MULTIPLIER = '0.1'`. On OpenAI models:
`Cache writes: no cost on models before the GPT-5.6 family. GPT-5.6 and later charge cache writes at
1.25x the price of the original input pricing, even with automatic caching — no opt-in required.` and
`Cache reads: (depending on the model) charged at 0.25x or 0.50x the price of the original input
pricing`. The page also notes `Most providers automatically enable prompt caching, but note that some
(see Alibaba and Anthropic below) require you to enable it on a per-message basis.` and offers
`The cache_discount field in the response body will tell you how much the response saved on cache
usage.` with a sample `"cached_tokens": 10318`.

**Does it survive a router? Only with deliberate pinning, and OpenRouter is the one that does it.**
`To maximize cache hit rates, OpenRouter uses provider sticky routing to route your subsequent
requests to the same provider endpoint after a cached request.` The rules, copied:
- `After a request that uses prompt caching, OpenRouter remembers which provider served your request.`
- `Subsequent requests for the same model are routed to the same provider, keeping your cache warm.`
- `Sticky routing only activates when the provider's cache read pricing is cheaper than regular prompt pricing`
- `If the sticky provider becomes unavailable, OpenRouter automatically falls back to the next-best provider.`
- `Sticky routing is not used when you specify a manual provider order via provider.order — in that case, your explicit ordering takes priority.`
- `Sticky sessions expire after 10 minutes of inactivity. Each successful request resets the timer. If the sticky provider returns an error, the cache is not updated, allowing the next request to be re-routed.`
Granularity: `Sticky routing is tracked at the account level, per model, and per conversation. By
default, OpenRouter identifies conversations by hashing the first system (or developer) message and
the first non-system message in each request`. And there is an explicit key:
`you can pass a session_id in your request. When a session_id is present, OpenRouter uses it directly
as the sticky routing key instead of deriving one from message hashing. This is especially useful for
multi-turn agentic workflows where the opening messages may change between requests but you still
want to route to the same provider.` with `The session_id must be at most 256 characters.` and
`When session_id is set, sticky routing activates on any successful request — even before cache usage
is observed`. Fallback key: `If neither is set, OpenRouter falls back to the OpenAI-style
prompt_cache_key request field as the sticky routing key.`
**Source:** https://openrouter.ai/docs/guides/best-practices/prompt-caching.md opened 2026-09-18

**The tension our design has to hold, and it is genuine.** Caching wants **stickiness**. Availability
routing wants **freedom to move**. The fifth bullet above is the collision written down by
OpenRouter themselves: the moment you assert `provider.order`, sticky routing stops and your caches
go cold. **INFERENCE:** the resolution is to put the cache-sensitive work and the availability-
sensitive work in different lanes. A blueprint's 15 calls share a long static prefix and want the
same provider for all 15; an edit is a one-shot and does not care. Pin the blueprint with a
`session_id`, let the edit roam.

---

---

## Part three: capacity arithmetic

Inputs, taken from the brief as given and not re-derived: a free user gets **10 edits and 1 Low
blueprint a month**; an **edit** is about **4,000 tokens in and 800 out**; a **blueprint** is about
**81,825 in and 31,365 out across 15 calls**; target **200 active free users**.

Free-pool numbers are the ones L1 opened on 2026-09-18
(`docs/research/2026-09-18-llm/raw/L1-free-providers.md`, findings FL1-1 and FL1-2) plus the
Cloudflare pricing page opened above. Every figure below was computed in Python and the working is
printed, not asserted.

### FL3.14. The demand, worked

**Per unit.**
- edit = 4,000 + 800 = **4,800 tokens**
- blueprint = 81,825 + 31,365 = **113,190 tokens**
- one blueprint call = 113,190 / 15 = **7,546 tokens** (5,455 in, 2,091 out)

**Per user per month.**
- in = (10 x 4,000) + 81,825 = 40,000 + 81,825 = **121,825**
- out = (10 x 800) + 31,365 = 8,000 + 31,365 = **39,365**
- total = **161,190 tokens**
- requests = 10 + 15 = **25**

**200 users per month.**
- in = 121,825 x 200 = **24,365,000**
- out = 39,365 x 200 = **7,873,000**
- total = 161,190 x 200 = **32,238,000 tokens**
- requests = 25 x 200 = **5,000**

**Flat daily average**, 30-day month:
- 32,238,000 / 30 = **1,074,600 tokens a day**
- 5,000 / 30 = **166.67 requests a day**

Note the shape: **the blueprint is 70.2% of the tokens** (113,190 of 161,190) **and 60% of the
requests** (15 of 25), for one action a month. The edits are the visible feature and the minority of
the load.

### FL3.15. Do the free pools cover it? On volume yes, comfortably. On rate, not even close.

**Converting Cloudflare's neurons to our tokens.** Using `@cf/meta/llama-3.1-8b-instruct-fp8-fast` at
the published `4119 neurons per M input tokens` and `34868 neurons per M output tokens`:
- neurons per edit = (4,000/1e6 x 4,119) + (800/1e6 x 34,868) = 16.476 + 27.894 = **44.370**
- neurons per blueprint = 337.0 + 1,093.6 = **1,430.7**
- so the 10,000 free neurons a day buy **10,000 / 44.370 = 225.4 edits** or
  **10,000 / 1,430.7 = 6.99 blueprints**
- at our overall in/out mix, 374,875 neurons buys 32,238,000 tokens, so 0.011628 neurons per token,
  and **10,000 / 0.011628 = 859,966 tokens a day**

**Combined daily free pool.**

| Provider | Daily free pool, in our tokens | Source |
|---|---|---|
| Groq | **200,000** TPD on the four main chat models | L1 FL1-1, from the Groq rate-limit table |
| Cerebras | **1,000,000** TPD | L1 FL1-2, Free Trial table `gpt-oss-120b \| 5 \| 30K \| 90K \| 1M \| 1M` |
| Cloudflare Workers AI | **859,966** (10,000 neurons at our mix) | computed above |
| **Total** | **2,059,966 tokens a day** | |

Demand is 1,074,600 a day. **Headroom = 2,059,966 - 1,074,600 = 985,366, which is 1.92x cover.**
Not comfortable, but it clears.

At the daily cap, the pools support **2,059,966 / 5,373 = 383 users**, where 5,373 is
161,190 / 30 tokens per user per day. So 200 is roughly half the flat-average ceiling.

**And now the number that actually matters.**

| Pool | RPM | TPM | Concurrent **edits** per minute | Concurrent **blueprint calls** per minute |
|---|---|---|---|---|
| Groq, main chat models | 30 | 8,000 | min(30, 8,000/4,800) = **1.67** | min(30, 8,000/7,546) = **1.06** |
| Cerebras Free Trial | 5 | 30,000 uncached | min(5, 6.25) = **5.00** | min(5, 3.98) = **3.98** |
| Cloudflare Workers AI | 300 | not published | bounded by the daily pool, not the minute | same |

**Groq's free tier can serve 1.67 edits a minute.** Two people editing at the same moment is a 429.
The 200,000 daily token pool is a fiction in practice, because
**200,000 / 8,000 = 25 minutes of full-rate use exhausts the entire day.** Cerebras is the same
story from the other direction: **1,000,000 / 30,000 = 33.3 minutes** of full-rate use exhausts a day
that looks five times bigger than Groq's.

A single 15-call blueprint takes **15 / 1.06 = 14.1 minutes on Groq** and
**15 / 3.98 = 3.8 minutes on Cerebras** if it has the pool to itself.

### FL3.16. The peak, which is where the design is decided

Volumes are averages and nobody arrives on the average. Two multipliers, stated as assumptions
because that is what they are.

**INFERENCE, stated as an assumption:** traffic concentrates on a busiest day at 3x to 5x the flat
daily average, and roughly half of a day's traffic lands inside a two-hour window.

| Scenario | Tokens on the day | Requests on the day | Tokens/min in the 2h window |
|---|---|---|---|
| flat | 1,074,600 | 166.7 | 537,300 / 120 = **4,478** |
| busiest day 3x | 3,223,800 | 500.0 | 1,611,900 / 120 = **13,432** |
| busiest day 5x | 5,373,000 | 833.3 | 2,686,500 / 120 = **22,388** |

Free capacity available in a minute, all pools at once: Groq 8,000 + Cerebras 30,000 =
**38,000 tokens a minute**, plus Cloudflare which is neuron-capped rather than minute-capped.

So on the arithmetic the peak clears, 22,388 against 38,000. **But look at what it costs to clear
it.** At 22,388 tokens a minute against a 1,000,000 Cerebras daily pool, you drain Cerebras's whole
day in 45 minutes, and the pool does not come back, because Cerebras refills by token bucket
continuously rather than at a reset. Then Groq's 200,000 goes in another nine minutes of the same
rate. **The peak does not break the minute. It breaks the day, in under an hour.**

And on the same busy-day multipliers the user ceiling collapses:
**383 users flat, 128 users at a 3x day, 77 users at a 5x day.**

**Where it breaks first, in order.**
1. **Groq's 8,000 TPM**, at two concurrent users. Immediately, on day one, with three friends
   testing.
2. **Cerebras's 5 RPM**, at five concurrent requests a minute. A single blueprint occupies the
   entire Cerebras request budget for three minutes.
3. **Cloudflare's 10,000 neurons a day**, at 6.99 blueprints. And here is a coincidence worth
   naming: 200 users at one blueprint a month is **200/30 = 6.67 blueprints a day**, so the free
   Cloudflare pool covers **105%** of the average blueprint day and **338%** of the average edit
   day. The whole free tier balances on a knife edge that is one busy Tuesday wide.
4. **Nothing else.** Firestore is not close: at 166.7 LLM calls a day, even three ledger writes per
   call is 500 writes a day against the free quota of `20,000 per day`, which is **2.5%**. At a 5x
   peak day with three writes it is 2,500, which is **12.5%**. The ledger is free.

### FL3.17. The cheapest paid step, and the finding that reframes the problem

Cloudflare's published token prices for the same model, applied to our monthly totals:

| Model | Input cost | Output cost | Month, 200 users | Per user |
|---|---|---|---|---|
| `@cf/meta/llama-3.2-1b-instruct` ($0.027/$0.201 per M) | 24.365M x $0.027 = $0.66 | 7.873M x $0.201 = $1.58 | **$2.24** | $0.0112 |
| `@cf/meta/llama-3.2-3b-instruct` ($0.051/$0.335) | $1.24 | $2.64 | **$3.88** | $0.0194 |
| `@cf/meta/llama-3.1-8b-instruct-fp8-fast` ($0.045/$0.384) | $1.10 | $3.02 | **$4.12** | $0.0206 |
| `@cf/meta/llama-3.1-70b-instruct-fp8-fast` ($0.293/$2.253) | $7.14 | $17.74 | **$24.88** | $0.1244 |

(Prices copied from https://developers.cloudflare.com/workers-ai/platform/pricing/index.md opened
2026-09-18. Cross-checked against the neuron route: 1,074,600 tokens a day at 0.011628 neurons per
token is 12,495 neurons a day; at `$0.011 per 1,000 Neurons` that is $0.1374 a day and $4.12 a
month, which matches the token-price route to the cent. Two routes, same answer.)

**So the entire free tier, 200 users, every edit and every blueprint, costs about four dollars a
month on an 8B model, or under a dollar after the 10,000 free neurons a day.**

**This reframes the whole exercise, and I want to say it plainly because it is the most useful thing
in this document.** We are not chaining free providers to save money. Four dollars a month is not
money. **We are chaining them to buy rate**, because no single free tier will serve two people at
once, and because the cheapest paid step has no rate problem at all.

The paid step, ranked:
1. **Turn on Workers Paid for Workers AI.** The plan itself is the cost, not the inference; the
   inference is four dollars. The rate limit for text generation stays at `300 requests per minute`.
   This is the cheapest step by a wide margin and it removes constraints 3 and, effectively, 1 and 2,
   because a 300 RPM provider with no daily cap does not need the free ones.
2. **Buy 10 OpenRouter credits, once.** Per FL3.3 this moves free-model requests a day from
   `FREE_MODEL_NO_CREDITS_RPD = 50` to `FREE_MODEL_HAS_CREDITS_RPD = 1000`. Against a demand of
   166.7 requests a day flat and 833.3 on a 5x day, 1,000 free requests a day covers the peak. Ten
   dollars, once, for twenty times the request budget, on the one provider that will tell us how
   much is left.
3. **Vercel AI Gateway paid tier**, as the last link. `$5/month included` on free, then
   `Provider list rates, zero markup`. Its value is not price, it is that BYOK and the higher rate
   limits both require the paid tier, and that `modelAttempts` gives us a failover audit trail we
   would otherwise build.

**UNVERIFIED:** I did not open the Workers Paid plan page, so I have not confirmed the monthly plan
fee. The inference arithmetic above is from the Workers AI pricing page and stands on its own; the
plan fee is a number to check before quoting it to anyone.

---

---

## Part four: the design

### FL3.18. What we already have, and the three things wrong with it

Before proposing anything: **there is already a provider chain in this repo**, and it is better than
nothing and worse than it looks.

- `src/modules/ai/application/ports.ts` defines the port, and it is one method:
  `generate(input: { prompt, system?, speedFirst? }): Promise<string>`.
- `src/modules/ai/infrastructure/gateway-client.ts` builds the chain. Providers join only if their
  key is set (`GOOGLE_GENERATIVE_AI_API_KEY`, `GROQ_API_KEY`, `CEREBRAS_API_KEY`,
  `MISTRAL_API_KEY`, `OPENROUTER_API_KEY`), and two static orders decide the sequence:
  `const QUALITY_ORDER = ["google", "groq", "cerebras", "mistral", "openrouter"];` and
  `const SPEED_ORDER = ["groq", "cerebras", "google", "mistral", "openrouter"];`
- `src/modules/ai/infrastructure/provider-race.ts` races a lead group under a per-attempt timeout,
  with `DEFAULT_CONCURRENCY = 1` and `DEFAULT_TIMEOUT_MS = 15_000`, and its own header explains the
  bug it was written to fix: `The old chain tried providers strictly sequentially: a slow or hung
  first provider blocked the whole request until IT timed out before the next was even attempted`.
- It is wired in `src/container/dependency-container.ts` as `{ llm: gatewayLlmClient }` into five
  use cases.

**Three defects, in order of seriousness.**

1. **Gemini is first in `QUALITY_ORDER` and it should not be in the chain at all.** L1 FL1-3
   establishes, from Google's own pricing page and terms, that the free tier is marked
   `Used to improve our products` = `Yes`, and that
   `To help with quality and improve our products, human reviewers may read, annotate, and process
   your API input and output.` For an editor holding people's private documents, the current default
   ordering sends their prose to the one provider that reads it. This is a live issue in `main`, not
   a design question.
2. **The chain has no memory.** Nothing anywhere records that Groq returned a 429. The next request,
   in the next cold function, starts at the top of the same list and pays the same 429 again. On a
   free tier that is exhausted for the rest of the UTC day, this is a permanent tax on every request
   until midnight, and the user pays it in latency.
3. **There is no streaming path at all.** `grep -rn "streamText\|stream" src/modules/ai/` returns
   nothing. The port returns `Promise<string>`. So the hardest question in this brief is currently
   answered by not having the feature.

Minor: the inner calls use `maxRetries: 1`, so the AI SDK burns an extra attempt against a
known-dead provider before the chain advances (FL3.8 says the default is 2, so this is already
partly tuned, just not to zero). And `generateText` returns a `usage` block that is discarded, which
is the input the ledger needs.

---

### FL3.19. The proposal: a ledger, a planner, and an executor, in three files

Keep the existing hexagonal shape. The port stays the seam; everything below is infrastructure.

```
src/modules/ai/
  application/
    ports.ts                    CHANGE: add a streaming method and a usage return
    quota-ledger.ts             NEW: the QuotaLedger port (interface only)
  domain/
    provider-policy.ts          NEW: pure. the catalogue, the costing, the pick
    failure-classification.ts   NEW: pure. one 429 into {exhausted|transient|fatal}
  infrastructure/
    gateway-client.ts           CHANGE: executor. consults ledger, records usage
    provider-race.ts            KEEP as is. it is good and it is tested
    quota-ledger.durable.ts     NEW: Durable Object adapter (the real one)
    quota-ledger.firestore.ts   NEW: Firestore adapter (the fallback)
    quota-ledger.memory.ts      NEW: in-process adapter (dev and tests)
src/container/dependency-container.ts   CHANGE: choose the ledger adapter
src/config/env.ts                        CHANGE: the provider key and cap table
```

Two of those files are pure domain with no I/O, which means the interesting logic is unit-testable
without a network, and the arch gate (`npm run arch`) stays green because nothing in `application`
or `domain` imports `infrastructure`.

#### Where the quota ledger lives

**Recommendation: a Cloudflare Durable Object, one per provider per UTC day, named
`groq:2026-09-18`.** Justification from Part Two: a DO gives `strongly consistent yet fast to access`
storage with a `globally-unique name`, which is single-writer by construction, so there is no shard
count to tune and no stale read to reconcile. Firestore's documented counter pattern is explicitly
the opposite trade (FL3.11), and its own docs no longer publish a single-document write rate to
design against.

Cost check: `The Workers Paid plan includes Workers, Pages Functions, Workers KV, Hyperdrive, and
Durable Objects usage for a minimum charge of $5 USD per month for an account.`
(https://developers.cloudflare.com/workers/platform/pricing/index.md opened 2026-09-18). And
SQLite-backed Durable Objects are on the free plan: `Workers Free plan: Only Durable Objects with
SQLite storage backend are available.` with `Storage per account | Unlimited (Workers Paid) / 5GB
(Free)`.

**The honest cost of this recommendation:** it adds a third runtime. We are already on Vercel and
Firebase; a DO means a Worker, a `wrangler.toml`, and a deploy that is not `git push`. That is a real
tax on a two-person team and it is the main argument against.

**The fallback, if the third runtime is unacceptable:** Firestore, one document per provider per UTC
day, with a **transaction** rather than a sharded counter. Part Three showed the write volume is
trivial (500 writes a day at three per call, 2.5% of the free `20,000 per day`), so the only question
is contention on one document, and at 166.7 calls a day spread over hours that is not a hot document
by any definition. Sharding would be solving a problem we do not have and would cost us the
consistency we do need. **INFERENCE, and I want to be clear it is one:** a single Firestore document
under a transaction is very likely fine at our volume, and I would ship that first and move to a
Durable Object when a measurement says to, not before.

**What the ledger holds**, per `(provider, utcDay)`:

```ts
type PoolState = {
  provider: 'groq' | 'cerebras' | 'cloudflare' | 'openrouter' | 'vercel';
  utcDay: string;              // '2026-09-18'
  tokensEstimated: number;     // incremented at admission, before the call
  tokensActual: number;        // reconciled from the usage block after
  requests: number;
  exhaustedUntil: number | null;  // epoch ms. set on a classified exhaustion
  consecutiveFailures: number;    // for the breaker
  openedAt: number | null;        // breaker OPEN timestamp
};
```

`exhaustedUntil` and `openedAt` are two different things and that distinction is the whole point of
this design. The breaker is about **health** and recovers in seconds. `exhaustedUntil` is about
**entitlement** and recovers at 00:00 UTC. FL3.9 showed no published circuit breaker has the second
concept.

#### How a request picks a provider

Pure function, in `domain/provider-policy.ts`, no I/O:

```
pick(task, pools, now) -> ordered candidate list
```

1. **Filter out entitlement.** Drop any provider with `exhaustedUntil > now`.
2. **Filter out health.** Drop any provider whose breaker is OPEN and whose
   `openedAt + cooldownMs > now`. Parameters, taking FL3.9's lesson that failing over is cheap:
   trip at `failureThreshold: 3` **or** `failureRatePct: 50`, but only once
   `minimumRequests: 5` have been seen (Portkey's guard, scaled to our volume), and
   `cooldownMs: 15_000`, then HALF_OPEN with one permitted probe.
3. **Estimate the cost.** `estimateTokens(task)` = prompt length plus `max_completion_tokens`. This
   is not optional politeness: Cerebras does exactly this itself and says so
   (`If this estimated token consumption would exceed your available token quota, the request is
   rate limited before processing begins`), so an estimate that is too loose gets us rejected by
   Cerebras for free.
4. **Drop anyone who cannot afford it.** `pool.tokensEstimated + estimate > pool.dailyCap` removes a
   provider before we waste a round trip on it. This is the step the current code does not have.
5. **Order the survivors by task shape**, not by a single static list:
   - **edit** (4,800 tokens, one call, latency matters): Groq, then Cloudflare, then Cerebras, then
     OpenRouter, then Vercel Gateway paid.
   - **blueprint** (15 calls, 113,190 tokens, long shared prefix, latency does not matter): Cerebras
     first, because FL3.15 shows a blueprint takes 3.8 minutes there against 14.1 on Groq, and
     because its prompt cache (`128-token blocks`, 5-minute guaranteed TTL) is built for exactly
     this shape. **Pin the whole blueprint to one provider** and pass a stable key, so we get
     OpenRouter's sticky routing if we land there (`session_id`, `at most 256 characters`) and
     Groq's or Cerebras's prefix cache if we do not.
   - Gemini appears in **no** list. See FL3.18.

#### What happens on exhaustion

`domain/failure-classification.ts`, also pure, one function, one switch, per provider, because
FL3.10 proved there is no portable signal:

```
classify(providerId, status, headers, body) -> 'exhausted' | 'transient' | 'fatal'
```

- **Cloudflare:** body internal code `3036` is `exhausted` and we set `exhaustedUntil` to the next
  `00:00 UTC`, because the page says `All limits reset daily at 00:00 UTC.` Code `3040` is
  `transient`. Same HTTP 429 for both.
- **Groq:** 429 with `x-ratelimit-remaining-requests` at 0 is `exhausted` for the day. 429 with a
  `retry-after` of a few seconds and remaining-requests above 0 is `transient`, and we honour the
  header. Because there is no TPD header at all, the **daily token pool is tracked only by our
  ledger**, and when `tokensEstimated` crosses 200,000 we mark ourselves exhausted without asking.
- **Cerebras:** 429 is `transient` **and only transient**, because the token bucket
  `replenishes continuously rather than resetting at fixed intervals`. Back off by our own estimate
  of the refill, do not set `exhaustedUntil`, and rely on the ledger for the 1M TPD.
- **OpenRouter:** 402 is `exhausted` (credits). 429 with `X-RateLimit-Reset` is `exhausted` until
  that instant. We can also pre-empt: poll `GET /api/v1/key` once every few minutes and cache
  `free_model_daily_requests.remaining`, which makes OpenRouter the one provider where the ledger is
  read rather than inferred.
- **Anything 400, 401, 403, 413:** `fatal`. Do not fail over; the next provider will fail the same
  way. This is the case everyone forgets and it turns one bad prompt into five wasted calls.

When every candidate is filtered out, the answer is not an error. It is the paid step. The last
entry in every chain is the Vercel AI Gateway on the paid tier, and Part Three says that costs about
four dollars a month for all 200 users. **The router should be architecturally incapable of
returning "AI is unavailable" while a paid provider is configured**, and the one case where it
genuinely must say something is when the paid provider also fails, which is an outage, not a quota.

#### How a stream fails over

From FL3.12, the design follows the three moments and refuses to pretend about the third.

```
1. plan            pick() -> [groq, cloudflare, cerebras, openrouter, vercel]
2. open upstream   streamText({ model, maxRetries: 0,
                                timeout: { firstChunkMs: 4000, chunkMs: 8000 } })
3. HOLD            do not write a byte to our own response yet
4. first content   -> commit. write our 200, flush, stream through
   timeout/error   -> classify, record, advance to the next candidate, go to 2
5. after commit    a mid-stream error can no longer be hidden. emit a typed
                   error part on our own stream and let the UI decide
```

Step 3 is the whole trick and it costs us nothing on the happy path, because we were waiting for the
first token anyway. `firstChunkMs` is the right timer and not a general timeout, for the reason the
SDK states: `Response metadata, stream starts, empty deltas, raw chunks, and transport activity do
not satisfy or reset it.` A provider that returns headers and then thinks for four seconds is
treated as dead, which on a free tier under load is usually correct.

**The number to tune, and I do not know it yet.** `firstChunkMs: 4000` is a guess. Too low and we
abandon a healthy Groq that was merely queued, and abandoning a Groq stream **still burns the
tokens**, because OpenRouter's cancellation-support list puts Groq under `Not Currently Supported`
(FL3.12). Too high and the user watches a spinner. This needs measuring against real free-tier
latency from India, and until it is measured the value is a placeholder.

**Two mitigations that make step 5 rare enough to live with.**
- **Quota exhaustion almost never arrives mid-stream.** Every provider checks entitlement at
  admission. The mid-stream case is an outage or a disconnect, which is much rarer and which the
  user will forgive differently.
- **An edit is not a chat.** A half-finished edit proposal has written nothing to the file, because
  splice-only writing means the bytes land only on accept. So a failed generation can be dropped
  silently and retried, and the change queue is the natural place for it to die. **This product's
  architecture makes the hardest problem in Part Two much easier than it would be for a chat app**,
  and that is worth noticing rather than solving generically.

#### What the user sees, at each stage

| Stage | What the user sees | Why |
|---|---|---|
| Normal, first provider | Nothing at all. Text appears. | The only acceptable default. |
| Failover before first token | Nothing at all. Slightly slower first token. | This is the case we engineer for, and it covers essentially every quota failure. |
| All free pools spent, paid link used | Nothing at all. | The user is not entitled to know which pool paid. |
| Mid-stream failure, edit | The proposal disappears from the queue with one line: `That did not finish. Try again.` | Nothing was written to the file. Honest and cheap. |
| Mid-stream failure, blueprint | The blueprint keeps its completed sections and names the one that failed, with a retry on that section only. | 15 calls means partial progress is real progress. Do not throw away 12 good sections. |
| Genuine total outage | One line naming what we know: `The model providers are not responding. Nothing was changed.` | Never `AI is unavailable`, which tells the user nothing and implies we removed a feature. |
| User's own monthly cap reached | A different message entirely, and it must not look like a failure. | Entitlement is not an outage, and conflating them is how a free tier teaches people the product is broken. |

That last row is the one most likely to be got wrong. The router will have two reasons to stop and
they must never share a message.

#### What we log

One line per attempt, not per request, appended wherever the trace ledger already goes:

```
{ correlationId, task: 'edit'|'blueprint', attempt: 1,
  provider: 'groq', model: 'llama-3.3-70b-versatile',
  outcome: 'ok'|'exhausted'|'transient'|'fatal',
  httpStatus, providerCode,          // eg cloudflare 3036 vs 3040
  estimatedTokens, actualTokens, cachedTokens,
  firstChunkMs, totalMs,
  poolBefore, poolAfter, ledgerTier: 'durable'|'firestore'|'memory' }
```

Four of these fields exist because of something opened in this research and would not otherwise be
there. `providerCode` exists because Cloudflare's `3036` and `3040` are the same HTTP status
(FL3.10). `cachedTokens` exists because Groq says `Cached tokens do not count towards your rate
limits`, so cache hits are capacity and we cannot see the effect without measuring it (FL3.13).
`estimatedTokens` next to `actualTokens` exists because the gap between them is the error in our
ledger, and if we never log both we will never know whether the ledger is honest. `ledgerTier`
exists because of LR#59 in the global rules: a number read through a field that might not be there
must say which writer produced it.

The one derived metric worth a dashboard: **failover depth**, the distribution of `attempt` at the
successful call. If that is 1 almost always, the chain is theatre and one provider is doing the
work. If it climbs through the day and resets at 00:00 UTC, the ledger is working and you can see
the pools draining in the shape of the graph.

---

### FL3.20. What is hard, and what I am not sure about

**Hard, and I am confident these are the hard parts.**

1. **There is no portable exhaustion signal, and there will not be one.** Four providers, four
   dialects, two of which do not encode it at all and one of which has no concept of a daily reset.
   Every adapter is hand-written and every adapter rots when a provider changes its error shape. The
   only defence is a test per provider that asserts against a **captured real response body**, and
   those tests go stale silently.
2. **The ledger is an estimate that we reconcile, not a measurement.** Groq will not tell us
   remaining TPD (FL3.10). So our count drifts from theirs, and when it drifts the wrong way we get
   the 429 we built the ledger to avoid. The reconciliation from the `usage` block bounds the drift
   but does not remove it.
3. **Caching and availability want opposite things**, and OpenRouter wrote the collision down:
   `Sticky routing is not used when you specify a manual provider order via provider.order`. Any
   ordering we assert to route around exhaustion costs us cache warmth, which costs us quota, which
   makes exhaustion more likely. That loop is real and I do not have a clean answer to it beyond
   separating the lanes.
4. **The peak drains the day in under an hour** (FL3.16), and no amount of routing cleverness fixes
   a pool that is genuinely spent. At a 5x busy day the free chain supports 77 users, not 200.

**Genuinely unsure.**

- **Whether to add a third runtime for the ledger.** A Durable Object is the technically right
  answer and Firestore-under-a-transaction is very probably fine at 166 calls a day. I lean
  Firestore-first, but I am aware that is partly because it is the answer that does not require
  learning a new deploy, and that is a bad reason.
- **`firstChunkMs`.** Pure guess until measured from India against real free-tier latency, and the
  penalty for guessing low is paying Groq tokens for a stream we abandon.
- **Whether the blueprint should stream at all.** 15 calls over 3.8 minutes is not a stream, it is a
  job. If it were a job with a progress list rather than a stream, the entire mid-stream failover
  problem disappears for the 70% of our tokens that the blueprint represents. I did not research
  that alternative and it may be the better design. It is the question I would ask next.
- **The `3x` and `5x` peak multipliers in FL3.16.** Assumptions, labelled as such. Everything
  downstream of them, including the 77-user figure, moves if they are wrong, and we have no traffic
  data to check them against.
- **Braintrust proxy**, which I could not extract cleanly (FL3.7). It is a small gap and I do not
  think it changes the conclusion, but it is a gap.

---

## What I could not reach

- **`https://unify.ai/` docs.** `https://docs.unify.ai/` returned HTTP `000` with a zero-byte body,
  which is a connection failure rather than a 404. The main site resolved and showed the company has
  become a continual-learning research lab, so the docs subdomain is probably gone with the old
  product, but I did not confirm that and have not claimed it.
- **Braintrust proxy's routing semantics.** `https://www.braintrust.dev/docs/guides/proxy` returned
  200 and 100 KB, but my text extraction produced the docs shell rather than the guide body. I have
  not characterised its fallback behaviour and FL3.7 says so.
- **`https://docs.notdiamond.ai/docs/quickstart`** returned 404. The marketing site was opened
  instead, so the positioning is sourced and the API detail is not.
- **Vercel AI Gateway's actual free-tier rate limits.** Not a fetch failure: the page deliberately
  withholds them. `Limits can change, so this page describes behavior rather than fixed numbers. To
  confirm the current limit for a model, contact Vercel from your dashboard's Support entry.` So the
  one number needed to plan against the Gateway free tier cannot be planned against.
- **Groq's per-model free-plan table as rendered numbers.** The table body is client-rendered and my
  static fetch got the header row (`MODEL ID | RPM | RPD | TPM | TPD | ASH | ASD`) and the model ids
  but not the cells. I used L1's figures, which came from the same table opened the same day, rather
  than guessing.
- **The Workers Paid plan's total cost to us.** I opened the pricing page and quoted the
  `$5 USD per month` minimum, but I did not model our Worker request and CPU usage on top of it.

## What surprised me

1. **Almost nobody tracks per-provider quota exhaustion.** Ten products opened, and exactly one
   (LiteLLM's `provider_budget_config`) keeps a real per-provider pool ledger, and it counts dollars
   rather than tokens. The market split into quality routers and governance gateways, and
   availability routing across heterogeneous free tiers is simply not a product anyone sells.
2. **Cloudflare gives quota exhaustion its own error code and everyone else conflates it.**
   `3036` versus `3040`, both HTTP 429, one meaning stop until midnight and one meaning try again in
   a second. That distinction is the difference between a working router and a retry loop, and three
   of the four providers do not make it.
3. **The whole free tier costs about four dollars a month on a paid model.** 200 users, every edit,
   every blueprint, $4.12 on `llama-3.1-8b-instruct-fp8-fast`, cross-checked two ways. We are not
   chaining free providers to save money. We are chaining them to buy **rate**, and that is a
   completely different design brief from the one I started with.
4. **Groq's free tier cannot serve two people at once.** 8,000 TPM against a 4,800-token edit is
   1.67 concurrent edits a minute, and 25 minutes of full-rate use spends the entire day's 200,000
   tokens. The daily numbers everyone quotes are not the constraint; the minute is.
5. **The AI SDK already ships the exact primitive the hardest part needs.** `firstChunkMs`, with a
   definition that explicitly excludes metadata and empty deltas from satisfying it, is a
   purpose-built timer for the window between a committed 200 and the first visible token. I went
   looking for how people hack around this and found it was a documented option.
