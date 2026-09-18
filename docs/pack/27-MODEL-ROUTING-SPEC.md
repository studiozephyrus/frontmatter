---
id: 27-MODEL-ROUTING-SPEC
title: The model routing layer
mode: reference
tier: canonical
status: living
updated: 2026-09-18
owner: sagnik
verified_against: e532e32
covers: [ai-routing, provider-chain, quota, failover, abuse, logging]
---

# 27. The model routing layer

**The requirement, in the founder's words** `[Z]`. Build a layer so "the user doesn't feel that the
AI is unavailable and will automatically fall back to the next model", serving up to 200 users, and
"foolproof" against people "token abusing" and "scamming me using random tokens".

**The honest answer to "foolproof" is bounded, not foolproof**, and the difference is the whole of
section 9. We cannot stop a person making a second GitHub account. We can make that second account
worth 2.23 cents a month, visible in a daily report, and unable to spend faster than a bucket
refills.

**A note on the line citations in this file.** They were resolved against commit `e532e32` on
2026-09-18. `docs/mvp0/PRODUCT-PLAN.md` is being edited by other writers in the same pass, and its
line numbers moved by twelve while this file was being written. **Confirm a citation by the phrase
rather than by the number** if the two disagree.

**What is built today.** A five-provider chain in `src/modules/ai/infrastructure/gateway-client.ts`
with two static orders and no memory of a refusal. Everything else in this file is `specified, not
built`. Section 11 separates the two, line by line.

**The one-line shape.** A pure planner picks an ordered candidate list from a ledger of what each
pool has left, an executor walks the list, a pure classifier turns each refusal into one of three
words, and the last link is a paid provider, so the router is architecturally incapable of saying
"AI is unavailable" while a paid key is configured.

---

## 1. The two gates

Both come from the plan and both are restated here as gates, with the place they are enforced.

**Gate A. A provider that trains on inputs is disqualified.** We hold people's private documents.
Any provider whose terms let it use inputs to train, or to improve its products, cannot enter the
chain at any position, for any call type, on any plan.

**Gate B. A provider whose terms nobody has opened cannot be enabled.** Not enabled and untested, and
not enabled behind a flag. The control on S36 is disabled and says why, per
`docs/mvp0/SCREENS.md:370`.

Where each gate lives.

Gate | Enforced in | How it fails
A | `domain/provider-policy.ts`, the catalogue constant | A provider row carries `trainsOnInputs: true` and the planner refuses to emit it, with a unit test that asserts the refusal
B | The same catalogue, field `termsOpenedOn: <ISO date> \| null` | A null date means the row cannot be enabled from S36, and the panel disables the control rather than hiding it
Both | The sign-in promise | `docs/mvp0/PRODUCT-PLAN.md` section 30 says the training promise is not a row the panel can edit, because adding a training provider changes the sentence on the sign-in page, not a number

**The search term that finds a breach.** Every provider disqualified below uses the same three
words, and none of them says "we will train on your data". Google writes `improve and develop`,
Cohere writes `IMPROVE AND ENHANCE`, NVIDIA writes `modify and improve`. When auditing a new
provider, search its terms for **improve**, not for **train**. The word "train" is what a provider
uses when it is promising not to.

**Who may add a row.** Only a founder, from S36, and only with a `termsOpenedOn` date and the quoted
sentence stored beside it. The quote is the evidence, and it is what a later reader checks.

---

## 2. The provider table

Fallback order for the default case, which is an edit on Free. Section 3 varies the order by call
type. Every quotation was copied from the provider's own page on 18 September 2026 by
`docs/research/2026-09-18-llm/raw/L1-free-providers.md`, which names the URL for each.

### 2.1 In the chain

# | Provider | Free models | Rate limits | Pool is per | Region | State
1 | Cloudflare Workers AI | 32 models carry a neuron price, including `@cf/meta/llama-3.2-3b-instruct`, `@cf/qwen/qwen3-30b-a3b-fp8`, `@cf/openai/gpt-oss-20b` | **300 requests a minute**, 10,000 neurons a day, reset `00:00 UTC` | account | edge, several points of presence in India | in the plan's chain
2 | Groq | `openai/gpt-oss-120b`, `openai/gpt-oss-20b`, `openai/gpt-oss-safeguard-20b`, `qwen/qwen3.8-27b` | 30 a minute, **1,000 a day and 200,000 tokens a day per model**, 8,000 tokens a minute | organisation | data at rest in `Google Cloud Platform (GCP) buckets located in the United States` | in the plan's chain
3 | Cerebras | `gpt-oss-120b`, `qwen-3.8-27b` | **5 a minute**, 30,000 uncached tokens a minute, 90,000 total, 1,000,000 a day per model | organisation | administered `from its offices in California` | in the plan's chain while the trial lasts
4 | OpenRouter | 21 model ids ending `:free`, of 445 listed | 20 a minute; **50 a day, or 1,000 a day after buying 10 credits once** | account, and **readable before spending** | no Asian region; in-region routing is enterprise-only | **in the chain, admitted 18 September. See 2.4**
5 | SambaNova | DeepSeek-V3.1, Llama 3.3 70B, gpt-oss-120b | 20 requests a day per model | `UNVERIFIED:` not opened by L1 | `UNVERIFIED:` | in the plan's chain, smoke test only
6 | Ollama, on the desktop only | `llama3.2:3b` at 2.0 GB, `qwen3:4b` at 2.5 GB, `gemma3:4b` at 3.3 GB, `qwen3:8b` at 5.2 GB | none | the machine | the machine | desktop, `specified, not built`
7 | The paid link | Cloudflare Workers Paid neurons, then Anthropic for Pro | Cloudflare text generation stays at `300 requests per minute` on the paid plan | account | as above | the reason the router cannot run out

**The base URLs, so the chain is a configuration table rather than a codebase.** Every entry is
OpenAI-shaped, copied from each provider's own compatibility page, opened 2026-09-18.

# | Provider | Base URL | Model to start with
1 | Cloudflare Workers AI | `https://api.cloudflare.com/client/v4/accounts/{account_id}/ai/v1/chat/completions` | `@cf/meta/llama-3.1-8b-instruct-fp8-fast`
2 | Groq | `https://api.groq.com/openai/v1` | `openai/gpt-oss-120b`
3 | OpenRouter | `https://openrouter.ai/api/v1` | `z-ai/glm-5.2:free` or `qwen/qwen3.8-27b:free`
4 | Cerebras | `https://api.cerebras.ai/v1` | `gpt-oss-120b`

So a provider row is a base URL, a key reference and a model id. That is why the whole catalogue
lives in the configuration panel of file 28 rather than in the source.

**The training clause, quoted, for every provider in the chain.**

Provider | The sentence, copied from the page
Cloudflare | `Cloudflare does not use your Customer Content to (1) train any AI models made available on Workers AI or (2) improve any Cloudflare or third-party services, and would not do so unless we received your explicit consent.`
Groq | `For clarity, Groq is not permitted to use Inputs or Outputs for training or fine-tuning any AI Model Services or other models, unless explicitly granted permission or instructed by Customer.`
Cerebras | `For clarity, the foregoing does not grant Cerebras the right to use Service Content for the purpose of training or fine-tuning models.`
OpenRouter | Its own logging is off unless turned on: `Unless explicitly opted in to prompt logging, we do not store your Inputs after categorizing them and do not associate the categorized Inputs with any specific user or organizational accounts.` The upstream is a separate question, answered per provider in its register and disclaimed by OpenRouter.
SambaNova | `UNVERIFIED:` no sentence was opened. Under gate B this row cannot be enabled until one is.
Ollama | Nothing leaves the machine, so the clause does not arise.

**Commercial use on the free tier, quoted.**

Provider | The position
Cloudflare | No restriction on the pricing, limits or data-usage pages. `Workers AI is included in both the Free and Paid Workers plans`. One caveat to check per model: `Cloudflare neither creates nor trains the AI models made available on Workers AI. The models constitute Third-Party Services and may be subject to open source or other license terms`.
Groq | Allowed. The `personal, non-commercial use only` sentence binds the marketing website, and Groq says so: `These Terms do not apply to you in connection with your use of Groq's cloud services, including GroqChat, Groq Playground, and GroqCloud.` The cost is the indemnity: section 15.3 excludes `any Cloud Services provided to Customer free of charge`.
Cerebras | Allowed. The same misreading applies and Cerebras closes it in the same paragraph: `The foregoing provision does not apply to the Service or Service Content`, and the API licence grants use `solely for your personal use or business purpose, as applicable`, including the right to `distribute or allow access to your integration of the APIs within your applications to end users of such applications`.
OpenRouter | Allowed, with a data processing agreement written for this case: `If you are part of and represent an organization in entering into these Terms or use the Service for commercial, for-profit purposes, please read the OpenRouter Data Processing Agreement`.

**The most repeated error in third-party summaries of free tiers** is reading the website licence as
if it bound the API. It costs you a provider you could have used. Read who the clause binds before
believing it.

### 2.2 Refused under gate A

Provider | The sentence that disqualifies it
Google AI Studio, the unpaid Gemini quota | `When you use Unpaid Services, including, for example, Google AI Studio and the unpaid quota on Gemini API, Google uses the content you submit to the Services and any generated responses to provide, improve, and develop Google products and services and machine learning technologies`. Then `To help with quality and improve our products, human reviewers may read, annotate, and process your API input and output.` Then the instruction that settles it for a document editor: `Do not submit sensitive, confidential, or personal information to the Unpaid Services.` The pricing page prints the row `Used to improve our products` with the value `Yes` in the Free Tier column 79 times.
Cohere trial keys | `... AND (III) IMPROVE AND ENHANCE THE SERVICES AND COHERE'S OTHER OFFERINGS AND BENCHMARK THE FOREGOING, INCLUDING BY SHARING API DATA AND FINETUNING DATA WITH THIRD PARTIES`. `API Data` is defined as anything submitted to the API, so this is not limited to fine-tuning uploads.
NVIDIA NIM | The licence grants use to `(c) modify and improve NVIDIA products or services or the technology underlying the Technology`, with no training carve-out. NVIDIA separately bans the data class: `you agree that your actions and transmission of User Content: (a) does not include any confidential information; (b) does not include any controlled or sensitive data`.
DeepSeek | `To improve and develop the Services and to train and improve our technology, such as our machine learning models and algorithms.` It also shares for the same purpose with providers who receive data for `foundation model training and optimization`. Added to the plan's refused list on 18 September. It has no free tier either
Mistral Free | Conditional, and the condition is the page that returns 404. `Mistral AI will not use Customer Data or Outputs to train ... except (a) when you ... (ii) have not opted-out of training on a Mistral AI Product set to opt-in by default ... or (d) when Customer uses Labs or Preview Models.` Unresolved, so refused under gate B as well.

**A pattern across the four, and it is a cheap test.** Google, NVIDIA and DeepSeek each print a
sentence telling you not to send them sensitive data. Google: `Do not submit sensitive, confidential,
or personal information to the Unpaid Services.` NVIDIA: `does not include any confidential
information`. DeepSeek: `We do not ask for, and you should not provide sensitive Personal Data to the
Services`. **All three of the providers that print that sentence are providers that train.** None of
the four in our chain prints it. When auditing a new provider, that sentence is a faster signal than
the training clause, because a provider writes it plainly while the training grant is buried in a
licence.

**Gemini also carries a geographic ban** that would refuse it even if the training clause vanished:
`You may use only Paid Services when making API Clients available to users in the European Economic
Area, Switzerland, or the United Kingdom.`

**Gemini is first in the shipped code's `QUALITY_ORDER`.** That is a live defect in `main`, not a
design question, and it is item 1 of section 11.

### 2.3 Refused for other reasons

Provider | Why
GitHub Models | Retired. `As of July 30, 2026, GitHub Models has been fully retired. The playground, model catalog, inference API, and bring your own key (BYOK) are no longer available to any customer.` A directory still listed it as live 50 days later, which is the argument for a health probe over a static list.
Hugging Face Inference Providers | The monthly credit for a free user is `$0.10, subject to change`.
Vercel AI Gateway free tier | `$5 /month included` is real, but `Once you purchase credits, your account transitions to the paid tier and the monthly free credit no longer applies`, and bring-your-own-key is `Not available` on free. Keep it as the paid last link, not as a free pool.
OVHcloud AI Endpoints | Free only on guard, image and speech models. No free general chat model.
Chutes.ai | No free tier, in its own words: `We do not offer a free tier at this time. Top up your account in the app to get started.`
Fireworks, Together, DeepInfra | **Signup credits, not free tiers.** Fireworks states `Get started with $1 in free credits`, once, not recurring. The other two state nothing on their pricing pages. A credit that runs out once and never returns cannot hold up a fallback chain
LLM7.io, GLHF, Nscale | Not free today, or returning HTTP 522, or unverifiable on the training clause.
Poe, Perplexity, Windsurf | Not free inference APIs. A free coding agent is not a free inference API.
Scaleway | No free tier at all, and the best privacy wording found anywhere. Hold it as the European paid answer, not as a free link.
Anything from the `gpt4free` ecosystem | Out of scope, and it should be said plainly rather than politely. These are Discord-gated reverse proxies serving frontier models they hold no licence for. Their own best-known directory disclaims them: `We are not endorsing any of the listed services!` Routing a paying customer's private document through one would be indefensible

**Only six things in the whole inventory renew**: Cloudflare's daily neurons, Groq's daily pool,
Cerebras's daily tokens, OpenRouter's daily requests, Vercel's `$5` a month and Hugging Face's ten
cents. Everything else is a signup credit. **A signup credit lets you evaluate a provider. It cannot
be a link in a chain**, because it runs out once and never comes back.

### 2.3b. There is no list to depend on, so the catalogue has to probe

The community lists the mission named do not hold up, and the finding changes how the provider
catalogue is maintained rather than just what is in it.

- `github.com/cheahjs/free-llm-api-resources`, the canonical list, **returns HTTP 404 on four
  independent checks**. The account is alive; the repository is gone.
- **Its name has been squatted.** A repository carrying the dead list's exact name, pushed the same
  week, leads with a zip download from its own README. Recorded as data and not followed.
- `github.com/zukixa/cool-ai-stuff` was last pushed **eleven months** before this was written, and
  is a directory of the proxy ecosystem above rather than of first-party providers.
- The one genuinely maintained directory, updated daily, was **wrong on five of the thirty-one
  entries anyone checked**, on the single field it exists to report. It listed GitHub Models as live
  50 days after retirement, and its own automated liveness check reported three models online for a
  service whose inference API no longer exists.

**So the catalogue is a table we maintain from provider pages, with a live health probe, and never a
list we import.** Any list, ours included, is wrong within weeks. The probe is what makes that
survivable, and it is why `provider.<id>.termsOpenedOn` in file 28 carries a date rather than a
boolean: a date goes stale visibly.

### 2.4 Where the plan and the research met, and where they still disagree

Three conflicts. One resolved while this file was being written, and two are open. The plan is the
plan of record. The research opened the pages. Both dates are 18 September, so neither is stale.

**OpenRouter, and this one resolved while the file was being written.** At commit `0af3c90` the
plan said `Never in the chain`, on the ground that the endpoints' terms were not opened. L1 then
opened them in full. **Commit `e532e32`, titled `plan: the model chain, reconciled against the
18 September provider research`, took OpenRouter off the never list**, and the plan's table now
reads `Yes. F006's condition is met`.

- **Why it was admitted.** Logging is off by default: `Unless explicitly opted in to prompt logging,
  we do not store your Inputs after categorizing them`. It carries a switch that enforces our own
  gate for us: `If you opt out of training in your account settings, OpenRouter will not route to
  providers that train`, with a separate setting for free models. And it is the only provider whose
  remaining free budget a router can read before spending it.
- **The cost of taking it.** Turning that filter on removes seven of the twenty-one free models,
  including the two largest context windows, which are served by Nvidia, Liquid and Thinking
  Machines. Take that trade.
- **Two things to set on day one.** Never opt into prompt logging, because section 6.2 of the terms
  then grants OpenRouter the right to `license or sell your User Content in anonymized form`. And set
  the free-model training filter to off.
- **The residual risk.** OpenRouter disclaims its own register in capitals: `OPENROUTER MAKES NO
  REPRESENTATION OR WARRANTY REGARDING ANY MODEL PROVIDER'S DATA HANDLING, RETENTION, TRAINING,
  SECURITY, AVAILABILITY, OR INTELLECTUAL PROPERTY PRACTICES.` It is an excellent starting filter and
  a bad final authority.
- **The register got a spot check and passed it.** OpenRouter flags DeepSeek as training, and
  DeepSeek's own privacy policy says it trains. The one row that failed the same check is Google AI
  Studio, where OpenRouter says not-training and Google's unpaid terms say training. `INFERENCE:` the
  reconciliation is that **the register describes the route OpenRouter has bought, rather than the
  provider's own free tier.** Read it that way and both results are consistent.
- **The chain's shape is still founder question 3.**

**A defect in the new plan row, and leaving it costs real money.** The plan now says OpenRouter gives
`1,000 a day once any credit has been bought, minimum purchase $5`, and its commit message says both
`$5` and `a one-off 10 dollars` about the same threshold. **The research says the threshold is ten
credits.** The constants on the limits page are `FREE_MODEL_CREDITS_THRESHOLD = 10`, the higher
ceiling is granted `starting one credit below the table's threshold (currently 9 credits)`, and the
minimum purchase is `$5`. **So a single $5 purchase buys nothing.** It leaves the account at 50
requests a day, which is a quarter of what 200 users need. The purchase has to be `$10`, or two of
`$5`. Correct the plan row before anybody acts on it.

**Cerebras.** The plan describes the free tier as `A trial: "$5 in free credits after adding a
verified payment method. These credits expire 30 days after they're granted"`. L1 read the Free
Trial tab on the same day and reports 5 requests a minute and 1,000,000 tokens a day per model, with
no mention of the credit. `UNVERIFIED:` the two readings may describe the same offer from two pages,
or the terms may have changed. **Before phase B, one person opens the Cerebras rate-limit page and
the billing page in a signed-in browser and writes down which is true.** The capacity arithmetic in
section 8 is given with and without Cerebras for that reason.

**Groq's daily pool.** The plan counts 200,000 tokens a day, which is one chat model. L1 reads the
same table and counts four chat models at 200,000 each, for 800,000. Both are correct readings of
the same page; they differ on whether we spread across models. **Spreading is free and doubles to
quadruples the pool**, so the spec assumes four models and the ledger keys on `(provider, model,
utcDay)` rather than on the provider alone. Section 8 gives the conservative total too.

### 2.5 Fail over per model before per provider

**Two incident histories were opened on 18 September, and they show the same shape.** Neither
provider's failures were platform outages. Both were single models going soft.

**Groq, from its own status API**, 7 incidents created in 2026, every one `impact: minor`:

Created | Duration | Name, verbatim
2026-01-24 | 2h 30m | `Data Center Failure Impacting Model Latency - SYD`
2026-01-26 | 1h 53m | `meta-llama/llama-4-scout-17b-16e-instruct Degraded Performance`
2026-02-05 | 1h 44m | `meta-llama/llama-4-scout-17b-16e-instruct Degraded Performance`
2026-02-05 | 0h 23m | `meta-llama/llama-4-scout-17b-16e-instruct Degraded Performance`
2026-02-07 | 1h 32m | `meta-llama/llama-4-scout-17b-16e-instruct Degraded Performance`
2026-03-19 | 0h 59m | `openai/gpt-oss-120b Performance Issue`
2026-07-01 | 1h 33m | `Data Center Failure Impacting Capacity`

634 minutes across 260 days is 0.1693 per cent, so the affected surface was at or above **99.83 per
cent**. **Four of the seven are the same model degrading four times in a fortnight.**

**Cloudflare**, in the eighteen days its status API window covers, had one incident naming Workers AI:
**2026-09-09, 5h 44m, `impact: minor`,** `Cloudflare is aware of, and investigating, increased
Workers AI errors when attempting to use GLM 5.3.` One more, the day before the research, was
`Increased Errors for Durable Objects and Downstream Services in Asia P...`, which matters to an
Indian user base and to the ledger of section 4.4.

**The design consequence, and it changes two things in this file.**

1. **The circuit breaker keys on `(provider, model)`, not on `provider`.** A chain that drops
   Cloudflare because GLM 5.3 is erroring has thrown away five healthy models.
2. **A degraded model returns 200s slowly, so an error handler will sit inside every one of these
   incidents.** The breaker needs a latency signal beside its failure count. Count a call slower than
   a per-model threshold as a failure, which is what resilience4j's `slowCallRateThreshold` and
   `slowCallDurationThreshold` exist for.

`UNVERIFIED:` neither window is a full history. Groq's status endpoint returns a recent window whose
oldest record was `2025-12-24`, and Cloudflare's 50 records buy only eighteen days.
`status.openrouter.ai` and `status.mistral.ai` both returned HTTP 403, so two of the four chain
members have no incident history in this document at all.

### 2.6 The one structural fact about pooling

**Every provider worth using pools its limit above the user.**

Provider | The sentence
Groq | `Rate limits apply at the organization level, not individual users.`
Cerebras | `Rate limits apply at the organization level, not the user level, and vary based on the model.`
Cloudflare | `Our free allocation allows anyone to use a total of 10,000 Neurons per day`
Google Gemini | `Rate limits are applied per project, not per API key.`
Vercel AI Gateway | `Every Vercel team account gets access to both a free tier and a paid tier for AI Gateway Credits.`

**The consequence, and it is not subtle.** A free chain run from one set of our own keys does not
scale with users. It is a fixed daily budget shared by the whole user base, and it degrades worst
exactly when the product is most popular. The two ways out are a per-account quota we enforce on top
of the provider's pooled one, in section 9, and bring-your-own-key, in section 7.

---

## 3. The routing table

Call types are the five the product makes. Sizes are from `docs/mvp0/PRODUCT-PLAN.md` section 14 and
section 14, and the blueprint figures are assumed until measured (F017).

Call | Tokens in | Tokens out | Calls | Latency matters
An edit on a selection | 4,000 | 800 | 1 | yes, a person is watching the cursor
A document | 2,000 | 1,500 | 1 | yes
The question set | 1,500 | 2,500 | 1 | yes, page one waits on it
A question rewrite | 3,000 | 1,500 | 1 per branching answer, capped at 3 on Free | yes, the page is blurred while it runs
A blueprint | 81,825 | 31,365 | 15 | no, it is a job

### 3.1 Free

Call | Chain | Why this order
An edit | Groq `gpt-oss-120b`, Cloudflare `qwen3-30b-a3b-fp8`, Cerebras, OpenRouter, paid Cloudflare | Groq is the fastest thing in the list and an edit is the one call a person watches. Its prompt cache exempts cached tokens from the rate limit, which matters most on the call we make most often
A document | Cloudflare, Groq, Cerebras, OpenRouter, paid Cloudflare | Cloudflare first because 300 requests a minute absorbs a burst and a document is 3,500 tokens, which is small enough that the neuron cost is low
The question set | Cloudflare, Groq, OpenRouter, paid Cloudflare | One call, 4,000 tokens, and page one of the idea flow is blocked on it. Cloudflare's burst headroom is the thing that stops ten people starting an idea at once from queueing
A question rewrite | Same as the question set, **pinned to whichever provider served the set** | The set and its rewrites share a long prefix. Pinning keeps the prefix cache warm, and a rewrite is a page turn the person is waiting through
A blueprint | Cerebras, Cloudflare, paid Cloudflare neurons | 15 calls of 7,546 tokens. On Groq that is 14.1 minutes at 8,000 tokens a minute. On Cerebras it is 3.8 minutes. Latency does not matter but wall time does, and Cerebras's 128-token block cache is built for a long shared prefix
On the desktop | A local Ollama model for edits, with nothing leaving the machine | `docs/mvp0/PRODUCT-PLAN.md` section 14

### 3.2 Pro

Call | Chain | Why
An edit | Anthropic Haiku 4.5, then the free chain, then paid Cloudflare | Plan section 14: `$0.008` an edit, `$0.80` for 100. Pro pays for quality, so the free chain is the fallback rather than the default
A document | Haiku 4.5, then the free chain | Same call shape as an edit
The question set | The free chain, same as Free | Plan decision of 18 September: dynamic questioning is `not a Pro feature`, because the free product is the funnel and a worse funnel is a worse business
A question rewrite | The free chain, **rewrites unbounded** | The cap of three is a Free row in the configuration panel, not a model choice
A blueprint | Sonnet 5 through the batch API at half price, then Haiku, then the free chain | Plan section 14: `$0.239` each, `$1.19` for 5. Batch is the right shape because a blueprint is a job, not a stream

**The whole Pro margin depends on this table.** Sonnet 5 for everything is `$3.99` a month against
`₹246` net of tax and the payment fee, which loses `₹137` on a fully active Pro user. The Haiku and
batched Sonnet routing is `$1.99`, or about `₹191`, which leaves about `₹55`. Those figures are
re-derived at `docs/mvp0/PRODUCT-PLAN.md` section 14, and marked SIMULATED there.

### 3.3 The rules that sit above the table

1. **Every row is a configuration row, not a constant.** `docs/mvp0/PRODUCT-PLAN.md` section 30 puts model
   routing in the panel, and section 30 puts the chain order and the per-provider on switch there.
   Section 27 of this pack is the spec; file 28 is the panel that edits it.
2. **A blueprint pins one provider for all 15 calls.** Pass a stable key so we get OpenRouter's
   sticky routing if we land there (`session_id`, `at most 256 characters`), and the prefix cache if
   we do not. Availability routing and caching want opposite things, and OpenRouter wrote the
   collision down: `Sticky routing is not used when you specify a manual provider order via
   provider.order`.
3. **Send a session key, and scope it per document.** Cloudflare needs one for its prefix cache to
   hit at all: `To maximize cache hit rates, send the x-session-affinity header with a unique
   identifier for your session or agent.` Cerebras offers `prompt_cache_key` and warns about the
   obvious mistake: `Don't set prompt_cache_key for prefixes that are shared across many users, such
   as a common system prompt or shared RAG context. This would funnel all of those requests to a
   single backend, creating a bottleneck`. **So: one key per document, never one key per
   deployment.** OpenRouter's `session_id` is the same idea and is capped at 256 characters.
4. **Prompt layout is part of the routing decision.** Groq: `Cached tokens do not count towards your
   rate limits.` Cerebras: `Cached tokens don't count toward your uncached TPM limit`. So on both,
   cache hits are capacity rather than only a discount. Put the system prompt, the tool definitions
   and the unchanged document prefix first, and the instruction last. Groq states the failure mode:
   `If you put variable information (like timestamps or user IDs) at the beginning, even identical
   system instructions later in the prompt won't benefit from caching because the prefixes won't
   match.`
5. **Set `maxRetries: 0` on every inner call.** The AI SDK defaults to 2 and the shipped code sets 1.
   Either way the SDK spends attempts on a pool that is empty until midnight, and our chain should
   own that decision.

---

## 4. Quota accounting

**The problem.** Groq's pool is per organisation per UTC day, our fleet is Vercel functions with no
shared memory, and the pool has to be decremented **before** the next cold function decides to spend
it.

### 4.1 Why a poll is not enough

Vercel's own spend management is honest about what a polled meter cannot promise, and the same limit
applies to anything we build on one: `Vercel checks your metered resource usage often to determine if
you are approaching or have exceeded your spend amount. This check happens every few minutes.` And:
`Because these checks are not continuous, notifications, webhooks, and project pausing can trigger
several minutes after you cross your spend amount.`

Sysdig measured 61,000 requests inside a three-hour window against a baseline of hundreds a day. **A
few minutes is enough.** So the ledger decrements before the provider call, not after it. A gate, not
a poll.

### 4.2 What the ledger holds

One record per `(provider, model, utcDay)`.

```ts
type PoolState = {
  provider: 'cloudflare' | 'groq' | 'cerebras' | 'openrouter' | 'sambanova' | 'paid';
  model: string;                  // Groq meters per model, so the key includes it
  utcDay: string;                 // '2026-09-18'
  tokensEstimated: number;        // incremented at admission, BEFORE the call
  tokensActual: number;           // reconciled from the usage block AFTER
  requests: number;
  neurons: number;                // Cloudflare only; the others leave it 0
  exhaustedUntil: number | null;  // epoch ms, set on a classified exhaustion
  consecutiveFailures: number;    // for the breaker
  openedAt: number | null;        // breaker OPEN timestamp
};
```

**`exhaustedUntil` and `openedAt` are different things, and that distinction is the point of the
design.** The breaker is about health and recovers in seconds. `exhaustedUntil` is about entitlement
and recovers at a fixed clock. No published circuit breaker has the second concept, which is why we
carry our own.

### 4.3 Firestore, the write limit, and the counter pattern

The plan puts records in Firestore (`docs/mvp0/PRODUCT-PLAN.md` section 15). Three facts decide how the
ledger sits there.

**One. The free write quota is not the constraint.** Firestore's free tier is `20,000 per day` for
document writes, against 50,000 reads. At our volume this is not close:

Writes per model call | Flat day, 193 calls | A 5x peak day | Share of the free 20,000
1 | 193 | 967 | 4.8 per cent
2 | 387 | 1,933 | 9.7 per cent
3 | 580 | 2,900 | 14.5 per cent

Two writes per call is the design, one at admission and one at reconciliation, so the ledger costs
about a tenth of the free quota on a bad day.

**Two. The single-document write rate is no longer published, and that is not good news.** The
widely repeated figure of one sustained write a second to a single document is not on Firebase's
page any more. What is there instead:

- `The exact maximum rate that an app can update a single document depends highly on the workload.
  Factors include the write rate, contention among requests, and the number affected indexes.`
- `At high enough write rates, the database will start to encounter contention, higher latency, or
  other errors.`
- The one hard rate is a collection limit, not a document one: `If you index a field that increases
  or decreases sequentially between documents in a collection, like a timestamp, then the maximum
  write rate to the collection is 500 writes per second.`

`INFERENCE:` the number was removed because it was never a constant, not because the contention went
away. Treat one hot counter document as unquantified rather than as safe.

**Three. The documented distributed-counter pattern is exactly wrong for a quota gate.** Firebase's
own page: `Each counter is a document with a subcollection of "shards," and the value of the counter
is the sum of the value of the shards.` and `Write throughput increases linearly with the number of
shards`. The trade-off is stated too: `With too few shards, some transactions may have to retry
before succeeding, which will slow writes. With too many shards, reads become slower and more
expensive.`

A sharded counter is eventually consistent by construction. To know the total you read N shards and
add them, and the answer is stale the moment you have it. That is fine for a like count. **For
"may I spend from this pool", a stale read either overspends the pool, which produces the error we
promised the user would never see, or underspends it, which means paying a paid provider while free
quota sits unused.** Sharding trades the property we need for one we do not care about.

### 4.4 The decision, with the alternative named

**Ship Firestore first, one document per `(provider, model, utcDay)`, updated inside a
transaction.** Not a sharded counter.

- At 193 calls a day spread over hours, one document is not hot by any definition.
- The plan already requires a Firestore transaction discipline elsewhere, and records at
  `docs/mvp0/PRODUCT-PLAN.md` section 15 that ledger entries are append-only so that a balance is a sum
  rather than a row two writers race for. **The pool counter is the exception to that rule**, because
  a gate has to read the current value before it writes. Say so in the code, next to the transaction.
- **Move to a Cloudflare Durable Object when a measurement says to, not before.** One named object
  per provider per UTC day (`groq:gpt-oss-120b:2026-09-18`) is single-writer by construction:
  `Each Durable Object has some durable storage attached. Since this storage lives together with the
  object, it is strongly consistent yet fast to access.` SQLite-backed Durable Objects are on the
  free plan, and we already hold a Cloudflare account for R2.
- **The honest cost of the Durable Object route** is a third runtime. Vercel and Firebase already,
  plus a Worker, a `wrangler.toml` and a deploy that is not `git push`. That is a real tax on a
  two-person team and it is the main argument for doing it second.

**The port makes the swap cheap.** `application/quota-ledger.ts` declares the interface;
`infrastructure/quota-ledger.firestore.ts`, `.durable.ts` and `.memory.ts` implement it; the
composition root in `src/container/dependency-container.ts` picks one. The architecture gate stays
green because nothing in `application` or `domain` imports `infrastructure`.

### 4.5 A contradiction in the plan that this file has to name

`docs/mvp0/PRODUCT-PLAN.md` section 15 decides the stack: `The stack is the Next.js app we already run,
Cloudflare R2 for bytes, and Firestore for records, with Firebase Auth for sign-in.` Section 18's
data model, at `docs/mvp0/PRODUCT-PLAN.md` section 18, including its ledger row, still writes `Postgres rows` for every
entity including the ledger entry. **Two sections of the plan of record name two different
databases.** The section 15 decision is dated and attributed to the founders, so this spec follows
Firestore and flags the section 18 table as owing a correction.

### 4.6 What resets when, and in which timezone

Pool | Resets | Stated where | What our ledger does
Cloudflare neurons | `All limits reset daily at 00:00 UTC.` | the pricing page | new `utcDay` key at 00:00 UTC
Groq requests and tokens a day | daily; the reset instant is not stated on the page | `UNVERIFIED:` | assume 00:00 UTC, and correct it the first time the headers disagree
Cerebras | **never.** `We use the token bucketing algorithm for rate limiting, which means your capacity replenishes continuously rather than resetting at fixed intervals.` | the rate-limits page | no reset; the ledger carries a rolling 24-hour window instead of a day key
OpenRouter free requests | `Free-model requests left in the current UTC day` | the limits page | new `utcDay` key at 00:00 UTC, and we can also read it
Vercel AI Gateway daily budget | `Midnight UTC each day` | the budgets page | not used on free
Google Firestore's own quota | `quotas reset at midnight Pacific` | `docs/mvp0/PRODUCT-PLAN.md` section 15 | irrelevant to the pools, and named here so nobody confuses the two clocks
**Our own per-account bucket** | continuously, see section 9 | this file | a token bucket, not a calendar month

**Three different clocks are in play**: UTC for the provider pools, Pacific for Firestore's own free
quota, and India for everything a person sees. The user-facing reset in S29 is stated in the
person's own time, and the pool reset is never shown to a user at all.

### 4.7 Reading a pool before we spend it

Provider | Can we read remaining before the call? | How
OpenRouter | **yes** | `GET /api/v1/key` returns `free_model_daily_requests` with `used`, `limit` and `remaining`, plus `usage_daily`. Poll it every few minutes and cache it. This is the only provider that hands us the ledger rather than making us keep one
Groq | requests yes, daily tokens no | `x-ratelimit-remaining-requests` `Always refers to Requests Per Day (RPD)`, and the page says `retry-after is only set if you hit the rate limit and status code 429 is returned. The other headers are always included.` **So Groq's remaining daily request budget is readable from any successful call**, which is nearly as good as OpenRouter's endpoint and costs no extra request. Track it. There is **no** remaining header for tokens per day, and tokens per day is the limit that binds
Cloudflare | no | inferred from our own neuron count, and confirmed by error code `3036`
Cerebras | no | rejection is pre-flight and on its own estimate
Vercel AI Gateway | no | `Limits can change, so this page describes behavior rather than fixed numbers.`

**Groq's hole is the reason the ledger exists.** Groq meters on eight dimensions and reports two of
them. The 200,000 tokens a day is the one that bites and the one the API will never tell us, so we
count it ourselves and mark ourselves exhausted without asking.

---

## 5. Failure taxonomy

### 5.1 The crux

**Quota exhaustion and a transient blip arrive as the same HTTP status from three of five
providers.** Cloudflare is the exception and the model for how this should read.

Cloudflare error | Internal code | HTTP | The body
Account limited | `3036` | `429` | `You have used up your daily free allocation of 10,000 neurons. Please upgrade to Cloudflare's Workers Paid plan if you would like to continue usage.`
Out of capacity | `3040` | `429` | `Capacity temporarily exceeded, please try again. Also returned when rejectIfBusy rejects a request because capacity is unavailable.`

`3036` means stop until 00:00 UTC. `3040` means try again in a second. **If you read only the status
you cannot tell them apart.** Also relevant: `Model requires Workers Paid plan | 5035 | 403`,
`Request too large | 3006 | 413`, `Timeout | 3007 | 408`.

### 5.2 The classifier

`src/modules/ai/domain/failure-classification.ts`. Pure, no I/O, one switch per provider, because
there is no portable signal.

```
classify(providerId, status, headers, body) -> 'exhausted' | 'transient' | 'fatal'
```

Provider | `exhausted` when | `transient` when | Notes
Cloudflare | body internal code `3036`. Set `exhaustedUntil` to the next 00:00 UTC | body internal code `3040`, or 408 | Same HTTP 429 for both. Read the body
Groq | 429 with `x-ratelimit-remaining-requests` at 0, or our own `tokensEstimated` crossing the model's 200,000 | 429 carrying `retry-after` with remaining-requests above 0. Honour the header | `retry-after is only set if you hit the rate limit and status code 429 is returned. The other headers are always included.`
Cerebras | **never from the provider.** The bucket refills continuously, so there is nothing to be exhausted until | every 429. The error message names which of the two buckets was exceeded | The 1,000,000 a day is tracked only by our ledger. No `retry-after` and no `x-ratelimit-*` header is documented anywhere
OpenRouter | `402` for credits, carrying `error.metadata.limit_source`. 429 carrying `X-RateLimit-Reset`, exhausted until that instant | 429 carrying `Retry-After` | On success there are no rate-limit headers at all: `Successful inference responses do not include X-RateLimit-* headers.` Upstream cause arrives in `error.metadata.provider_code`
Vercel AI Gateway | `402` with type `quota_for_entity_exceeded` | `429` with type `rate_limit_exceeded` | `Some 429 responses include a retry-after header with the number of seconds to wait. Honor it when it is present.`
Any provider | | | **`400`, `401`, `403`, `413` are `fatal`. Do not fail over.** The next provider fails the same way. This is the case everyone forgets, and it turns one bad prompt into five wasted calls

### 5.3 Groq's headers, in full, because we code against them

Header | Example value | What Groq says it means
`retry-after` | `2` | `In seconds`
`x-ratelimit-limit-requests` | `14400` | `Always refers to Requests Per Day (RPD)`
`x-ratelimit-limit-tokens` | `18000` | `Always refers to Tokens Per Minute (TPM)`
`x-ratelimit-remaining-requests` | `14370` | `Always refers to Requests Per Day (RPD)`
`x-ratelimit-remaining-tokens` | `17997` | `Always refers to Tokens Per Minute (TPM)`
`x-ratelimit-reset-requests` | `2m59.56s` | `Always refers to Requests Per Day (RPD)`
`x-ratelimit-reset-tokens` | `7.66s` | `Always refers to Tokens Per Minute (TPM)`

Groq meters on `RPM`, `RPD`, `TPM`, `TPD`, `ASH`, `ASD`, `ITPM`, `OTPM` and reports two of the eight.

### 5.4 Cerebras is a different machine and needs a different adapter

Cerebras rejects before it works, on its own estimate: `When you send a request, we estimate the
total tokens the request will consume by: 1. Estimating the input tokens in your prompt 2. Adding
either the max_completion_tokens parameter or an analyzed estimate for an upper bound of the output
tokens. If this estimated token consumption would exceed your available token quota, the request is
rate limited before processing begins.` Its own advice follows: `Set max_completion_tokens
appropriately for your use case to avoid overestimating token usage and triggering unnecessary rate
limits.`

**So always send `max_completion_tokens` on a Cerebras call**, sized to the call type, or we are
rejected for free. Two buckets are enforced independently, and `A 429 error will indicate which
bucket was exceeded.`

### 5.5 Circuit breaker parameters

Three published implementations, and the spread between them is the interesting part.

Parameter | resilience4j default | Portkey | LiteLLM | **Ours** | Why ours
Failure count to open | `minimumNumberOfCalls 100` | `failure_threshold`, example `minimum_requests: 10` | `allowed_fails: 3` | **3** | Failing over is cheap and failing is expensive
Failure rate to open | `failureRateThreshold 50` | `failure_threshold_percentage: 20` | not used | **50 per cent** | Below 50 a single slow minute trips a healthy provider
Minimum calls before the rate is computed | `100` | `minimum_requests: 10` | not used | **5** | Portkey's guard, scaled to our volume. Without it one cold-start blip blacklists a working provider
Wait in open state | `waitDurationInOpenState 60000 ms` | `cooldown_interval 60000 ms`, floor `min: 30s` | `cooldown_time: 5s` | **15,000 ms** | Between LiteLLM's 5 seconds and Portkey's 60. Long enough to let a hiccup pass, short enough that a recovered provider is back inside one edit
Probes in half open | `permittedNumberOfCallsInHalfOpenState 10` | not stated | not stated | **1** | One probe, and if it fails the breaker reopens
Statuses counted as failures | `>500` by default | `failure_status_codes: [401, 429, 500]` | 429 trips immediately | **5xx, 408, and a transport error. Never a 429 classified as `exhausted`, never a 4xx classified as `fatal`** | A provider correctly telling us the pool is empty is not unhealthy, and a bad prompt is not the provider's fault
Slow call counted as a failure | `slowCallDurationThreshold 60000 ms`, `slowCallRateThreshold 100` | not offered | not offered | **a per-model threshold, and a rate of 50 per cent** | Section 2.5: both opened incident histories are single models degrading, and **a degraded model returns 200s slowly**. Without this row the breaker sits inside every one of them
What the breaker is keyed on | a deployment | a target | a deployment | **`(provider, model)`** | Section 2.5. Dropping Cloudflare because one model is erroring throws away five healthy ones

**The state machine is uncontroversial and identical everywhere.** Closed, open after the threshold,
half open after the cooldown, closed again on a successful probe. What none of the published
breakers has is a concept for exhaustion, which is why `exhaustedUntil` sits beside `openedAt` rather
than inside it.

**The rule the spread teaches.** resilience4j guards a service you own, where opening the circuit
sheds load you would otherwise serve. An LLM router guards a service you do not own, where opening
the circuit costs nothing and the alternative is a person looking at an error. **When failing over is
cheap and failing is expensive, trip early and recover often.**

---

## 6. Streaming failover

This is the hardest part of the brief. What follows is what is actually true, what is hard, and what
is not settled.

### 6.1 The three moments, and they are not equally recoverable

**1. Before the upstream returns its 200.** Fully invisible. Fail over freely. **Essentially every
quota failure lands here**, because every provider checks entitlement at admission. Cerebras says so
outright, and a Cloudflare or Groq daily cap is evaluated on the way in. That is the most reassuring
fact in this section.

**2. After the upstream 200, before the first content chunk.** Invisible if and only if we have not
already written a byte to our own response. Recoverable by holding our response open. The cost is
that on the unhappy path the person waits for provider A's timeout plus provider B's full latency.

**3. After the first visible token.** **Not invisible, and no design makes it so.** The person has
read words. A replacement provider will not continue them, it will write different ones. The choices
are to restart the answer visibly, to append a second one, or to stop.

The status commits at the start of moment 2, and OpenRouter states it precisely: `Once the provider
has returned response headers, the 200 OK status is committed even if no token has been produced yet.
Any error after that point arrives as an SSE event rather than as an HTTP status.` And the trap in
that: `The error can be the first and only event in the stream, so treat a 200 carrying an error
chunk with no content as a failure, not a success.`

### 6.2 The executor

```
1. plan            pick(task, pools, now) -> ordered candidates
2. open upstream   streamText({ model, maxRetries: 0,
                                timeout: { firstChunkMs, chunkMs } })
3. HOLD            write nothing to our own response yet
4. first content   -> commit. write our 200, flush, stream through
   timeout/error   -> classify, record, advance to the next candidate, go to 2
5. after commit    a mid-stream error can no longer be hidden. emit a typed
                   error part on our own stream and let the interface decide
```

**Step 3 is the whole trick and it costs nothing on the happy path**, because we were waiting for
the first token anyway.

### 6.3 The timer, and a defect this file found

The AI SDK documents exactly the pair a stream failover needs.

- `firstChunkMs: The timeout until the first content-bearing output of each step (streaming only).
  Text deltas, reasoning deltas, tool-input deltas, generated files, and tool calls satisfy the
  timeout. Response metadata, stream starts, empty deltas, raw chunks, and transport activity do not
  satisfy or reset it.`
- `chunkMs: The timeout between content-bearing output chunks after output has started (streaming
  only). Non-content chunks do not reset it. This is useful for detecting streams that stall after
  generation begins.`

**`firstChunkMs` is not in the version this repository has installed.** `[O]` Measured on
2026-09-18: `node -e "console.log(require('ai/package.json').version)"` prints `6.0.191`, and
`grep -n "firstChunkMs" node_modules/ai/dist/index.d.ts` returns nothing, while `chunkMs` is present
at line 383. The published `latest` on the registry is `7.0.105`. So the design above needs an AI SDK
7 upgrade, and until that lands the hold in step 3 has to be timed by an `AbortController` we drive
ourselves rather than by an SDK option.

**This is a build task, not a paragraph.** Item 4 of section 11.

### 6.4 Two things that are genuinely hard

**Abandoning a stream does not always stop the meter.** OpenRouter: `Streaming requests can be
cancelled by aborting the connection. For supported providers, this immediately stops model
processing and billing.` Its unsupported list includes `AWS Bedrock, Groq, Modal`. **Groq is on the
unsupported list.** So a mid-stream failover away from Groq burns the Groq tokens anyway, and against
a 200,000-token daily pool an aggressive abandon strategy drains the pool faster than serving the
requests would.

**The timeout value is a guess.** A starting value of `firstChunkMs: 4000` has no measurement behind
it. Too low and we abandon a healthy Groq that was merely queued, and pay for it. Too high and the
person watches a spinner. **It needs measuring against real free-tier latency from India before it is
written into a configuration row**, and until then the row carries the value and a note saying it is
unmeasured.

### 6.5 What this product's architecture buys us

An edit is not a chat turn. **Splice-only writing means the bytes land only on accept, so a
half-finished edit proposal has written nothing to the file.** A failed generation can be dropped
silently and retried, and the change queue is the natural place for it to die. The hardest problem in
this section is much easier here than it would be for a chat application, and that is worth noticing
rather than solving generically.

### 6.6 The question worth asking before building any of this

**Should a blueprint stream at all?** It is 15 calls over about 4 minutes. That is a job, not a
stream. If it were a job with a progress list, the entire mid-stream failover problem disappears for
the 63 per cent of our tokens that the blueprint represents. That was not researched and it may be
the better design.

---

## 7. The exhaustion ladder

**The rule.** The last link in every chain is a paid provider, so the router is architecturally
incapable of returning "AI is unavailable" while a paid key is configured. The one case where it
genuinely must say something is when the paid link also fails, and that is an outage, not a quota.

**Nothing is deducted for a failed call.** The per-account bucket is decremented at admission and
**credited back** on any outcome that is not a delivered result. This is a hard requirement, not a
courtesy: a person who is charged for a failure learns that the product is broken and that we are
dishonest at the same time.

### 7.1 The ladder

Rung | Condition | What happens | What the person sees
0 | Normal | First provider serves it | Nothing at all. Text appears
1 | First provider exhausted or unhealthy | Planner drops it, next candidate serves | Nothing at all. A slightly slower first token
2 | Every free pool spent | The paid link serves it | Nothing at all. The person is not entitled to know which pool paid
3 | Service-wide breaker tripped, free traffic only | The call is **queued**, not refused. The change queue is already asynchronous, so a proposal that lands in forty seconds is a different experience rather than a broken one | A queued state on the proposal, with a position, and a line saying it will arrive
4 | The call is a question rewrite or a question set, and the layer is degraded | **The standard question set is served instead of a generated one.** This is the fallback the plan already names at `docs/mvp0/PRODUCT-PLAN.md` section 14, and it is why the toggle reads *use a standard question set* rather than *enable dynamic questions* | The idea flow continues with fixed questions. One line says the questions are the standard set today
5 | On the desktop | **The local Ollama model runs the edit**, with nothing leaving the machine | A line naming the local model. This is the desktop app's carrot, not its apology
6 | The person has a key of their own | **Bring your own key.** Their key, their bucket, our router | Their own provider name on the call
7 | The person is over their own monthly cap | **A different message entirely, and it must not look like a failure.** Entitlement is not an outage | S33, over the cap: what happened, what still works, what to do
8 | Genuine total outage, paid link included | One line naming what we know, and the document untouched | `The model providers are not responding. Nothing was changed.`

**Rung 7 is the one most likely to be got wrong.** The router has two reasons to stop and they must
never share a message. Conflating them is how a free tier teaches people the product is broken.

**Rung 8 is never the words "AI is unavailable".** That phrase tells a person nothing and implies we
removed a feature. S32 already carries the right shape: the document is untouched, nothing was
charged, and the status of each provider in the chain is shown so the person knows it is not their
document.

### 7.2 Bring your own key, built as a secret

Not a settings field. GitGuardian counted `28.65 million new hardcoded secrets` added to public
GitHub commits in 2025, including `113,000 leaked DeepSeek API keys`, and observed that
`the documentation itself encourages unsafe patterns`.

- Encrypt at rest, never render it back after saving, never write it into any file the person's own
  repository holds.
- Never publish a setup example with a key in it.
- **The projection-law wrinkle specific to us.** The file on disk is the only source of truth, and a
  provider key is the one piece of state that must not be in the file. Say so where the rule is
  written down, or somebody will helpfully put it in front matter.
- OpenRouter exempts these from its own free-model counters, and we do the same:
  `It does not apply to requests to free models, to requests served entirely with your own provider
  keys (see BYOK) that use no paid plugins`.

---

## 8. Capacity arithmetic for 200 users

Every number below was computed in Python on 18 September 2026 and the working is printed. Inputs are
from `docs/mvp0/PRODUCT-PLAN.md` section 14. The blueprint figures are assumed until measured.

### 8.1 The demand

Free caps are 10 edits and 1 Low blueprint a month, plus one generated question set and up to three
rewrites.

```
per free user per month
  in  = 10x4,000 + 81,825 + 1,500 + 3x3,000 = 132,325
  out = 10x800   + 31,365 + 2,500 + 3x1,500 =  46,365
  total tokens = 178,690        requests = 10 + 15 + 1 + 3 = 29

200 users per month
  in = 26,465,000   out = 9,273,000   total = 35,738,000   requests = 5,800

flat daily average, 30-day month
  1,191,267 tokens a day        193.33 requests a day
```

**The shape matters more than the total.** The blueprint is 113,190 of the 178,690 tokens, which is
63 per cent, and 15 of the 29 requests, for one action a month. The edits are the visible feature and
the minority of the load. The question set and its rewrites add 17,500 tokens, which is 9.8 per cent,
for four more requests.

### 8.2 Do the free pools cover it?

Cloudflare meters in neurons, so its pool is converted at our own input and output mix using the
published rate for `@cf/meta/llama-3.2-3b-instruct`, `4625 neurons per M input tokens` and
`30475 neurons per M output tokens`.

```
neurons per free user per month = 132,325x4,625/1e6 + 46,365x30,475/1e6 = 2,025.0
neurons per token = 2,025.0 / 178,690 = 0.011332
tokens a day from 10,000 neurons = 10,000 / 0.011332 = 882,430
```

Pool | Tokens a day | Reading
Groq | 200,000 | one chat model, which is the plan's reading
Groq | 800,000 | four chat models at 200,000 each, which is L1's reading of the same table
Cerebras | 1,000,000 | one model
Cerebras | 2,000,000 | two models, if they do not share a bucket, which the page does not say
Cloudflare | 882,430 | 10,000 neurons at our mix

```
conservative total   = 2,082,430 a day   cover = 1.75x   users at cap = 350
widest reading total = 3,682,430 a day   cover = 3.09x   users at cap = 618
```

**On volume it clears.** Even on the conservative reading there is 1.75 times cover, and the flat
ceiling is 350 users against a target of 200.

### 8.3 And now the number that actually decides it

Volume is not the constraint. The minute is.

Pool | Requests a minute | Tokens a minute | Concurrent edits a minute | Concurrent blueprint calls a minute
Groq, main chat models | 30 | 8,000 | min(30, 8,000/4,800) = **1.67** | min(30, 8,000/7,546) = **1.06**
Cerebras Free Trial | 5 | 30,000 uncached | min(5, 6.25) = **5.00** | min(5, 3.98) = **3.98**
Cloudflare Workers AI | **300** | not published | bounded by the day, not the minute | same

**Groq's free tier can serve 1.67 edits a minute.** Two people editing at the same moment is a 429.
A 15-call blueprint takes 14.1 minutes there against 3.8 on Cerebras.

**The daily pools are a fiction at full rate.** Groq's 200,000 tokens is `200,000 / 8,000 = 25
minutes` of full-rate use. Cerebras's 1,000,000 is `1,000,000 / 30,000 = 33.3 minutes` of a day that
looks five times larger.

### 8.4 The peak

`INFERENCE:` stated as an assumption, because we have no traffic data. Traffic concentrates on a
busiest day at 3 to 5 times the flat average, and about half of a day's traffic lands in a two-hour
window.

Scenario | Tokens on the day | Tokens a minute in the window | Free tokens a minute available
flat | 1,191,267 | 4,964 | 38,000
3x day | 3,573,800 | 14,891 | 38,000
5x day | 5,956,333 | 24,818 | 38,000

**The peak clears the minute and breaks the day.** At 24,818 tokens a minute, Cerebras's whole
1,000,000 is gone in about 40 minutes and does not come back, because it refills by bucket rather
than at a reset. Groq's 200,000 follows in another 8 minutes of the same rate.

### 8.5 Where it breaks first, in order

1. **Groq's 8,000 tokens a minute, at two concurrent users.** Day one, with three friends testing.
2. **Cerebras's 5 requests a minute.** One blueprint occupies the entire Cerebras request budget for
   nearly four minutes.
3. **Cloudflare's 10,000 neurons a day, at 148 users** on `llama-3.2-3b`, or 256 on
   `llama-3.2-1b`, or 139 on `llama-3.1-8b`. **The model choice moves the ceiling by 1.8 times**, and
   it is the single most consequential row on S36.
4. **OpenRouter's 50 requests a day**, if it is ever enabled without buying credits once. Demand is
   193 requests a day, so 50 covers 52 users. After one purchase of 10 credits it is 1,000 a day,
   which covers 1,034 users at cap and the whole 5x peak.
5. **Nothing else.** Firestore is not close, at 9.7 per cent of its free daily write quota on a 5x
   peak day with two writes per call.

### 8.6 The cheapest paid step, and the finding that reframes the exercise

Applying Cloudflare's published token prices to the monthly totals for 200 users.

Model | Input | Output | The month | Per user
`@cf/meta/llama-3.2-1b-instruct` | $0.71 | $1.86 | **$2.58** | $0.0129
`@cf/meta/llama-3.2-3b-instruct` | $1.35 | $3.11 | **$4.46** | $0.0223
`@cf/meta/llama-3.1-8b-instruct-fp8-fast` | $1.19 | $3.56 | **$4.75** | $0.0238

Cross-checked two ways on the 3b model: 404,995 neurons a month at `$0.011 per 1,000 Neurons` is
`$4.45`, against `$4.46` by the token route. Subtracting the free 10,000 neurons a day leaves
104,995 chargeable neurons and **$1.15 a month**.

**So the entire free tier, 200 users, every edit, every blueprint and every question set, costs about
four dollars a month at list price and about one dollar after the free allowance.** Four dollars is
not money.

**We are not chaining free providers to save money. We are chaining them to buy rate**, because no
single free tier serves two people at once, and the cheapest paid step has no rate problem at all.
That is a different design brief from the one the requirement implies, and it should change how much
engineering goes into the chain.

**The paid step, ranked.**

1. **Turn on Workers Paid for Workers AI.** The plan fee is the cost, not the inference. Text
   generation stays at `300 requests per minute`, and a provider at 300 a minute with no daily cap
   removes constraints 1, 2 and 3 above. `UNVERIFIED:` the Workers Paid plan fee was quoted by L3 as
   a `$5 USD per month` minimum for an account, and nobody has modelled our Worker usage on top of
   it.
2. **Buy 10 OpenRouter credits, once**, if the founders admit OpenRouter under 2.4. Twenty times the
   request budget, permanently, on the one provider whose remaining budget we can read.
3. **Vercel AI Gateway paid tier as the last link.** Not for price. For the `modelAttempts` failover
   audit trail, which we would otherwise build ourselves.

### 8.7 The caveats, stated rather than buried

- Cerebras publishes tokens a day per model without saying whether the two models share one bucket.
  Both readings are given above.
- The blueprint's 81,825 and 31,365 are assumed, not measured (F017), and 63 per cent of the load
  moves with them.
- The 3x and 5x peak multipliers are assumptions. Everything downstream of them moves if they are
  wrong.
- Prompt caching is not counted anywhere above. On Groq and Cerebras cached tokens are exempt from
  the rate limit, so a warm cache raises every ceiling in section 8.3. The plan says caching is
  measured in week one.

---

## 9. The abuse guardrails

**The hard constraint.** No captchas, no puzzles, no tours. Sign-in is one tap with Google or GitHub.
Every layer below is scored against that, and a layer that breaks it says so.

### 9.1 The arithmetic that decides where the engineering goes

Case | Neurons | At `$0.011 per 1,000 Neurons` | Against the honest tier's whole month
200 honest free users, a whole month | 405,000 | **$4.46**, which is 2.23 cents each | 1x
One uncapped account at 1 request a second for 24 hours | 3,704,832 | **$40.75** | **9.1x**
Sysdig's measured burst, 61,000 requests in 3 hours | 2,615,680 | **$28.77** | **6.5x**

**One abusive account outweighs the entire honest population by an order of magnitude.** So every
rupee of engineering belongs on bounding the tail and none on inspecting the head. A captcha inspects
the head. A budget bounds the tail. **The founder's rule costs us nothing here.**

**And one more number, which turns a refinement into a precondition.** A calendar-month counter lets
a person spend the whole month on one day. `10,000 neurons / 2,025 neurons per user-month = 4.94`.
**Only 4.94 of the 200 free users can spend a full month's allowance on the same day** before the
Cloudflare daily wall is hit. A token bucket forbids that shape. A monthly counter permits it.

### 9.2 The layers

Each row says what it stops, what it costs, how much friction it adds, and whether it survives the
no-captcha rule.

# | Layer | Stops | Cost to build | Friction | Survives the rule | Phase
1 | **Pre-flight per-account budget on a token bucket** | Everything, eventually. It is the only control that bounds the loss whichever other layer was bypassed | Two columns, one function, about two days | None for anyone inside the limit | **Yes** | A
2 | **Service-wide circuit breaker, per hour** | A pooled-key drain. The per-account bucket does not protect the shared organisation ceiling | One counter, one branch, about a day | None until it trips, then a queue | **Yes** | A
3 | **A usage row per model call, and a daily alert** | Nothing by itself. It is the precondition for every other response, and it is what caught every incident in the record | One collection, one scheduled query, about a day | None | **Yes** | A
4 | **A starting allowance that rises with account history** | The one-week-old empty account, which is what a farm looks like | One function over fields we already hold, about a day | None, and no consent screen | **Yes** | A
5 | **Refuse rather than bill** | An unbounded bill from a free user | A policy decision, zero days | None | **Yes** | A
6 | **Queue the free request instead of refusing it** | A burst. Not a patient attacker | A job queue and an interface state, about a week | Low, and proportional to how much the person asks for | **Yes** | B
7 | **Bring your own key** | Nothing directly. It removes the pressure that makes a small free tier feel mean | Three to five days done as a secret | None | **Yes** | B
8 | **An invisible challenge on the sign-in route only** | Cheap automated signup | About a day | None visible | **Only in one mode. See 9.4** | B
9 | **An emergency switch that stops new signups** | A bad night, without touching existing accounts | A flag, half a day | None for existing users | **Yes** | B
10 | Device fingerprinting | Multi-accounting, in theory | Medium engineering, large legal | A consent modal on the front door | **No. See 9.5** | never
11 | A card on the free tier | Most casual multi-accounting. The most effective control on this list | Medium, and it drags in a payment provider early | Very high in India | **No. See 9.6** | never
12 | A disposable-address detector | Nothing we have | None | None | Moot. There is no address field, because there is no signup form | never
13 | An address-based hard block | Nothing. A farm rotates a commercial virtual private network per account | Small | Real harm to honest users behind a shared carrier address | **No, as a block.** Keep it as one input to a score | never as a block
14 | A captcha or a puzzle | Not what people think. See 9.7 | Small to build, paid by every honest user | High | **No** | never

### 9.3 What a Google or GitHub sign-in actually gives us

Checked against the live interface rather than recalled.

**GitHub gives a real account-age and activity signal, free, with no extra scope.** The public user
object already carries `created_at`, `public_repos`, `public_gists`, `followers`, `following` and
`updated_at`. A farm of one-week-old empty accounts is visible in the first two fields alone.

- **Two-factor status costs a scope.** `OAuth app tokens and personal access tokens (classic) need
  the read:user scope, or the broader user scope, for this endpoint to return the private user
  response.` That response adds `two_factor_authentication`. `INFERENCE:` asking for `read:user`
  raises the consent screen from the minimum for one boolean. Take age and repository count, leave
  the two-factor field alone.
- **GitHub forbids multi-accounting itself**, which is its rule to enforce and not ours: `One person
  or legal entity may maintain no more than one free Account`.

**Google gives almost nothing.** There is no account creation date claim at all. The useful claims
are:

Claim | What Google's page says it is
`sub` | `An identifier for the user, unique among all Google Accounts and never reused.` and `Use sub within your application as the unique-identifier key for the user.`
`email_verified` | `True if the user's email address has been verified; otherwise false.`
`hd` | `The domain associated with the Google Workspace or Cloud organization of the user.` Absence means a consumer account
`amr` | The authentication methods used, one or more of `hwk`, `mfa`, `pwd`, `sms`, `swk`, `tel`. `Present only when the amr claim is included in the authentication request and enabled in settings`
`auth_time` | When the authentication happened. Same conditional availability

Google also warns against the mistake most signup systems make: `Don't use the email field as a
unique identifier for a user. Always use the sub field.`

**So layer 4 has two inputs and they are not symmetric.** For a GitHub sign-in the starting allowance
reads `created_at` and `public_repos`. For a Google sign-in there is no age to read, so the input is
our own first-seen date. Both are data we already hold to sign the person in, so neither needs a new
consent.

**A starting shape to tune, not a finding.** An account under seven days old with no history gets
three edits and no blueprint. It reaches the full ten and one at thirty days, or earlier after a
first accepted change. The thresholds are configuration rows, and layer 3's data is what tunes them.

**Where this idea comes from.** Anthropic does it by name: `New organizations and organizations with
limited usage history may start in the Evaluation tier, with limits below the standard limits shown
on this page while account history is established. These starting limits are part of how Anthropic
prevents fraud and abuse, and they increase automatically as your organization builds usage history.`
Nobody in that group gates a free tier on identity. They gate it on a ceiling and sell trust for
money already spent.

### 9.4 Layer 8, and the word the founder has to rule on

Cloudflare Turnstile has three widget types: `Managed (recommended): Automatically decides whether to
show a checkbox based on visitor risk level.`, `Non-interactive: Visitors never need to interact with
the widget.`, and `Invisible: The widget is completely hidden from the visitor.`

- **`Managed` is the banned thing** and we do not use it, because it can show a checkbox.
- **`Invisible` shows nothing, asks nothing and is nothing to solve.** It is a script that runs while
  the page loads. It also gives us proof of work without building one: `These challenges include
  proof-of-work (computational puzzles), proof-of-space, probing for web APIs, and various other
  challenges`.
- It works without routing our traffic through Cloudflare, and the server check is mandatory:
  `Server-side validation is mandatory.`
- Vercel BotID Basic is the alternative and is free on our existing platform. **Vercel calls it an
  invisible CAPTCHA in its own first sentence.** If the founder's rule bans the word, BotID is out;
  if it bans the experience, it passes. He should be shown that sentence and decide which he meant.
- **Never on a document route.** A false positive there loses somebody's writing.
- `UNVERIFIED:` Turnstile's free usage ceiling. Its limits page returned 404 on 2026-09-18, so do not
  write a free-forever claim without checking.

### 9.5 Layer 10, and the Indian Digital Personal Data Protection Act

A device fingerprint is personal data under the Act by construction, because its whole purpose is to
make a person identifiable across sessions. Section 2(t): `"personal data" means any data about an
individual who is identifiable by or in relation to such data`. Collecting it is processing under
section 2(x).

Section 4(1) gives exactly two lawful grounds: `(a) for which the Data Principal has given her
consent; or (b) for certain legitimate uses.` **The legitimate uses in section 7 do not include fraud
prevention.** The only clause that mentions protecting a business from loss is scoped to employees:
`(i) for the purposes of employment or those related to safeguarding the employer from loss or
liability`.

`INFERENCE:` the Act has no general legitimate-interest ground of the European kind, so fingerprinting
a person to stop them abusing a free tier has no clause to sit under. It needs consent, and the
consent it needs is strict. Section 6(1): `The consent given by the Data Principal shall be free,
specific, informed, unconditional and unambiguous with a clear affirmative action`. Section 6(4)
requires withdrawal to be as easy as giving it. Section 6(10) puts the burden of proof on us.

**That is a consent banner, which is a modal on the front door, which is the thing we are not
building.** The privacy cost and the founder's rule point the same way. Layer 10 is refused.

**Anyone citing these sections in a legal or client document should re-read the gazette** rather than
trusting this file. The research transcribed them by hand from page images because the text layer
would not extract.

**Where else the Act touches this layer.** Layer 3's usage row carries an account identifier, which
is personal data. It is processed for a purpose the person provided it for, and it is retained 180
days per `docs/mvp0/PRODUCT-PLAN.md` section 18, which is section 18's ledger row. That is inside the
consent the sign-in already takes. A usage row that carried document text would not be, which is why
section 10 forbids it.

### 9.6 Layer 11, and why a card is the wrong control in this market

A card gate is the most effective anti-farming control on the list, and the wrong one here.

- Outstanding credit cards in India were reported at 119.44 million in April 2026 against a
  population well over a billion. `UNVERIFIED:` this is a news report of central bank data, not the
  release. Cards are held several to a person, so the share of people is lower than the share of
  cards.
- The plan already records that `₹15,000` per transaction is an architectural constant set by the
  Reserve Bank and that Indian cards get one payment attempt. A card gate in this market fails for
  reasons unrelated to intent to pay.
- **Note it as the lever to pull if abuse ever becomes existential, and not before.**

### 9.7 Why the captcha ban costs less than it looks

Two independent pieces of evidence, and they point the same way.

**One. The published security consensus already agrees with the rule.** OWASP's entry for this exact
risk is LLM10:2025 Unbounded Consumption, which names Denial of Wallet in so many words: `By
initiating a high volume of operations, attackers exploit the cost-per-use model of cloud-based AI
services, leading to unsustainable financial burdens on the provider`. **Not one of its twelve
mitigations is a captcha, a puzzle or a human challenge.** The whole standard is budgets, limits,
timeouts, logging and graceful degradation. Three of the twelve are the three we build:
`3. Rate Limiting`, `7. Comprehensive Logging, Monitoring and Anomaly Detection`, and
`9. Graceful Degradation`.

**Two. The one operator with a full technical write-up beat every front-door control.** Sysdig's
PURPLEURCHIN farm: `Provider attempts to ward off this fraud ranges from making it more
time-consuming to create accounts with CAPTCHA and other technologies to requiring a valid credit
card on file. The operation detailed in this article bypasses a number of these defenses`. It beat
the captcha with a browser extension and a keyboard automation tool, beat email verification with its
own mail server, and beat address limits with a commercial virtual private network chosen at random
per account. **It would still have been stopped cold by a per-account ceiling.**

**And the closest published analogue to our own risk says the same.** Sourcegraph's 2023 incident ran
entirely on legitimately created free accounts, was found by a usage anomaly rather than a signup
control, and was remedied by cutting limits for every free user. Every signup-side defence would have
caught nothing.

### 9.8 One more reason the risk here is smaller than it looks, and its limit

Sysdig measured what farmed model access is actually spent on: `the majority of the content were
roleplay related (~95%)`, largely by people banned by their own provider or in sanctioned countries.

`INFERENCE:` our AI surface returns structured edits against a file the person supplies, which is a
poor substitute for a chat completion endpoint. That lowers the chance of organised farming. **It
does not lower the cost of one abusive user, and it says nothing about a competitor scraping the
blueprint generator.**

**The day we ship a raw completion route, this whole analysis has to be redone.** So do not ship one.

---

## 10. What we log, and what we must never log

### 10.1 One line per attempt, not per request

```
{ correlationId, accountId, task, plan, attempt,
  provider, model, ledgerKey,
  outcome: 'ok'|'exhausted'|'transient'|'fatal',
  httpStatus, providerCode,
  estimatedTokens, actualTokens, cachedTokens,
  firstChunkMs, totalMs,
  poolBefore, poolAfter, ledgerTier: 'firestore'|'durable'|'memory',
  bucketBefore, bucketAfter, refunded }
```

Four of those fields exist because of something opened in the research and would not otherwise be
there.

- `providerCode` exists because Cloudflare's `3036` and `3040` are the same HTTP status.
- `cachedTokens` exists because cached tokens are exempt from the rate limit on two providers, so a
  cache hit is capacity, and we cannot see the effect without measuring it.
- `estimatedTokens` beside `actualTokens` exists because the gap between them **is** the error in our
  ledger. If we never log both we will never know whether the ledger is honest.
- `ledgerTier` exists because a number read through a field that might not be there must say which
  writer produced it.

**Pin the field names in one place.** A producer writing one key while a consumer reads another is
this workspace's most expensive recurring defect, and a missing key coerced to a falsy default is
indistinguishable from a real negative. The reader fails loudly on a missing key rather than treating
it as zero.

### 10.2 The one metric worth a dashboard

**Failover depth**, the distribution of `attempt` at the successful call. If it is 1 almost always,
the chain is theatre and one provider is doing the work. If it climbs through the day and resets at
00:00 UTC, the ledger is working and the pools draining are visible in the shape of the graph.

### 10.3 What we must never log

Never | Why
**The prompt, the document, the selection, or any span of the person's bytes** | The product's whole proposition is that the file is theirs. A log that holds document text is a second copy of the document in a place the person cannot see or delete
**The model's output text** | Same reason. The output is a proposed splice of their document
**Any provider API key, ours or the person's**, in any form, including a prefix | A prefix is enough to identify a key in a leak report and gives an attacker a target
**A raw OAuth access token or refresh token** | Section 23's security log is an operational record, not a credential store
**The person's email address in the model-call log** | The account identifier is sufficient, and Google's own guidance says not to key on the address anyway
**A device fingerprint** | Refused in 9.5, so it must not arrive by the back door of a log field
**Anything inside the delimited data block** the document text is sent in | The plan's security control 7 says content inside that block is data. A log that extracts it undoes the control

**What may be logged about the content**: its size in tokens, its hash, and the document id. Those
answer every operational question the text would answer, and none of the private ones.

**Retention.** The model-call log is the ledger entry of `docs/mvp0/PRODUCT-PLAN.md` section 18, so 180
days, then aggregated with the account id dropped. The security log is 180 days rolling in Indian
jurisdiction per section 23.

---

## 11. What exists, and what does not

`[O]` Checked against the repository at commit `0af3c90` on 2026-09-18.

Item | State | Evidence
A multi-provider chain | **built** | `src/modules/ai/infrastructure/gateway-client.ts` holds `QUALITY_ORDER` and `SPEED_ORDER`
A provider race under a per-attempt timeout | **built** | `src/modules/ai/infrastructure/provider-race.ts`, concurrency 1 and 15,000 ms by default
Providers join only when a key is set | **built** | `GOOGLE_GENERATIVE_AI_API_KEY`, `GROQ_API_KEY`, `CEREBRAS_API_KEY`, `MISTRAL_API_KEY`, `OPENROUTER_API_KEY`
**Gemini first in the default order** | **built, and a defect** | `QUALITY_ORDER` begins `"google"`, and the default model is `gemini-2.5-flash`. Under gate A this provider cannot be in the chain at all
**Mistral in the chain** | **built, and a defect** | Same file. Refused at 2.2
A quota ledger | `specified, not built` | Nothing in `src/modules/ai/` records that a provider returned a 429
A failure classifier | `specified, not built` | The chain treats every failure the same
Circuit breaker state | `specified, not built` |
Streaming | `specified, not built` | The port is `generate(...): Promise<string>` in `src/modules/ai/application/ports.ts`. There is no stream method
Usage returned from a call | `specified, not built` | `generateText` returns a `usage` block and the adapter discards it
Per-account budget | `specified, not built` |
Cloudflare Workers AI as a provider | `specified, not built` | There is no Cloudflare provider in the file and no `@ai-sdk` package for it in `package.json`
SambaNova as a provider | `specified, not built` |
`firstChunkMs` | **not available** | `ai@6.0.191` installed; `firstChunkMs` absent from `node_modules/ai/dist/index.d.ts`; `chunkMs` present at line 383; registry `latest` is `7.0.105`
`maxRetries` | **built, set to 1** | The chain should set 0 so it owns the decision

**The build order that falls out of this.**

1. Remove Gemini and Mistral from the chain. One commit, and it is the only item on this list that is
   a live defect rather than missing work.
2. Change the port: add a streaming method and return `usage`.
3. Build `domain/provider-policy.ts` and `domain/failure-classification.ts`, both pure, both unit
   tested without a network.
4. Upgrade to AI SDK 7, or write the first-chunk hold against an `AbortController`.
5. Build the Firestore ledger behind the port, with the in-memory adapter for tests.
6. Add the Cloudflare Workers AI provider through its REST API, and add SambaNova only once its terms
   are opened.
7. Build the per-account bucket and the service-wide breaker together with the usage log, because a
   budget with no telemetry cannot be tuned.

**The tests that matter, and why they rot.** Each provider adapter needs a test that asserts against
a **captured real response body**, because there is no portable exhaustion signal and every adapter
breaks silently when a provider changes its error shape. Those tests go stale without failing. Date
each captured fixture and re-capture on a schedule.

---

## 12. The limits of this document

**What was not assessed.**

- Latency from India to any of these providers. Every ordering decision in section 3 that rests on
  speed is reasoned rather than measured, and `firstChunkMs` cannot be set until somebody measures.
- Prompt caching hit rates on our own prompt shapes. Section 8 excludes caching entirely, so every
  ceiling there is a floor.
- Whether a blueprint should be a job rather than a stream, which would remove the hardest problem in
  section 6 for 63 per cent of the load.
- The Workers Paid plan fee against our actual Worker usage.
- Any provider on the long tail that L1 could not reach, including ModelScope, Ollama Cloud, Z AI,
  SiliconFlow, DeepSeek, SambaNova and Nebius. SambaNova is in the plan's chain and has no opened
  terms, which means today it fails gate B.

**What could not be verified.**

- The Cerebras free tier's actual shape. Two readings from the same day disagree, at 2.4.
- Groq's daily reset instant. Nobody found the page that states it.
- Turnstile's free usage ceiling. Its limits page returns 404.
- The credit-card conversion figures behind layer 11. Every source found was a vendor blog citing
  other vendor blogs.
- The Gemini free tier's published limits, which returned a redirect to a sign-in for every client
  that tried. It does not matter, because the provider is refused, but it is a hole in the record.

**What is not established.**

- That 200 users is the right target. Section 8 shows the free chain covers 350 users flat and
  collapses to well under 200 on a 5x day, so the number that matters is the peak shape and we have
  no data on it.
- That the free chain is worth building at all, given that the paid step costs about four dollars a
  month. **The chain buys rate, not money.** If the founders turn on Workers Paid in phase A, most of
  sections 4, 5 and 6 become insurance rather than infrastructure.

**What would falsify this document.**

- A measured blueprint that is not 113,190 tokens. Sixty-three per cent of the arithmetic moves.
- A traffic peak that is flatter than 3x, which would make the free chain comfortable, or spikier
  than 5x, which would make it unusable at any size.
- A provider changing its training clause. The chain is a list of quotations, and a quotation has a
  date. Re-read all four before the pilot meets a stranger.
- Any single free provider offering both burst capacity and a real daily pool. The whole design
  exists because no one of them does.
