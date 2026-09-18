# L1. Free LLM inference providers: a complete inventory

Lens L1 of the 18 September 2026 research round. Ids are prefixed `FL1`.

**Mission.** A current inventory of every LLM provider that gives away usable free inference, with
the exact numbers, so frontmatter can build a fallback chain that never tells a user "AI is
unavailable".

**Method and its limits.** `WebFetch` is refused for the whole of this session by the workspace
taint gate (LR#10), so every page here was opened with `curl -sL --compressed` through Bash and the
HTML was stripped locally. That is the brief's stated fallback. Where a page is a client-rendered
single-page app, curl returns the shell rather than the content, and I say so rather than quoting
the shell.

**Evidence rules in force.** Every row cites the provider's own page and the date it was opened.
Anything inside quotation marks was copied from the opened page. `INFERENCE:` marks my reasoning.
`UNVERIFIED:` marks anything I could not open. No em dashes, British spelling.

---

## Index

- **FL1-0** freellm.net, what it says and where it is wrong
- **Part A, providers opened one by one:** FL1-1 Groq, FL1-2 Cerebras, FL1-3 Google Gemini free
  (disqualified), FL1-4 Cloudflare Workers AI, FL1-5 Cohere (disqualified), FL1-6 OpenRouter,
  FL1-7 NVIDIA NIM (disqualified), FL1-8 GitHub Models (retired), FL1-9 Mistral (unresolved),
  FL1-10 Hugging Face, FL1-11 Vercel AI Gateway, FL1-12 Scaleway, FL1-13 OVHcloud,
  FL1-14 the long tail, FL1-15 Poe, Perplexity and Windsurf, FL1-18 Chutes (free tier removed),
  FL1-21 DeepSeek (disqualified), FL1-22 Fireworks, Together, DeepInfra
- **Part B, the three deciding questions:** FL1-T training on inputs, FL1-C commercial use,
  FL1-P pooling
- **Part C:** FL1-CACHE prompt caching, FL1-BATCH batch APIs, FL1-OAI compatible endpoints,
  FL1-AGG what it all adds up to
- **Part D:** the ranked shortlist
- **Part E, reliability:** FL1-16 Groq's 2026 incidents, FL1-17 Cloudflare's
- **Part F:** the chain, concretely, with base URLs
- **Part G, the community lists:** FL1-19 cheahjs is deleted, FL1-20 zukixa is a proxy directory
- **Part H:** the parallel lenses and what happened to them
- Quotation audit, What I could not reach, What surprised me

**The one-line answer.** Four providers pass all three tests: **Cloudflare Workers AI, Groq,
OpenRouter and Cerebras.** Together they are worth roughly **13,000 requests and 9.7 million tokens
a day** for a one-off $10, but only **355 requests a minute**, and every one of them pools its limit
across the whole account. **Google's free Gemini tier, Cohere's trial keys, NVIDIA NIM and DeepSeek
are disqualified because they train on inputs**, each in its own words. GitHub Models was retired on
30 July 2026.

---

## FL1-0. The founder's pointer: what freellm.net actually says

- **Source:** https://freellm.net/ opened 2026-09-18; https://freellm.net/providers/ opened
  2026-09-18; https://freellm.net/llms.txt opened 2026-09-18.

freellm.net is an advertising-supported directory with a paid "Plus" tier, not a provider. Its
homepage headline counts, copied from the page: `484 Models Tracked`, `284 Free & Online`,
`31 Providers`, `389 No Credit Card`. It states `484+ models checked daily for changes. · 228
verified via live API · Latest free LLM API model update: 2026-9-17`.

**The 31 providers it names,** with the free-tier label it prints for each (copied from the
comparison table at https://freellm.net/providers/):

| freellm.net provider | models it counts | its free-tier label |
|---|---|---|
| OpenRouter | 34 | `~35 models free` |
| NVIDIA NIM | 131 | `Permanent Free` |
| Groq | 12 | `Permanent Free` |
| Ollama Cloud | 17 | `Permanent Free` |
| Kilo Code | 15 | `Quota limits` |
| Cloudflare Workers AI | 40 | `Permanent Free` |
| ModelScope | 61 | `Permanent Free` |
| LLM7.io | 19 | `Permanent Free` |
| OVHcloud AI Endpoints | 14 | `Permanent Free` |
| Chutes.ai | 2 | `Permanent Free` |
| Google Gemini | 19 | `Permanent Free` |
| GitHub Models | 16 | `Copilot limits` |
| Agnes AI | 5 | `Permanent Free` |
| Mistral AI | 15 | `~1B tokens/mo` |
| Glhf.chat | 2 | `Permanent Free` |
| Z AI (Zhipu AI) | 8 | `Permanent Free` |
| Cohere | 12 | `Permanent Free` |
| Cline | 6 | `Permanent Free` |
| Hugging Face | 8 | `100K credits/mo` |
| Grok (xAI) | 2 | `Permanent Free` |
| Cerebras | 0 | `Permanent Free` |
| SiliconFlow | 3 | `Permanent Free` |
| Aion Labs | 11 | `Permanent Free` |
| OpenCode Zen | 13 | `Permanent Free` |
| DeepSeek | 2 | `Permanent Free` |
| SambaNova | 4 | `Permanent Free` |
| Nscale | 2 | `Permanent Free` |
| Nebius | 1 | `Permanent Free` |
| Alibaba Cloud Model Studio | 5 | `Permanent Free` |
| AI21 Labs | 2 | `Permanent Free` |
| xAI | 3 | `Permanent Free` |

The four rate-limit numbers it prints in prose, verbatim: `Groq gives 30 RPM / 14,400 RPD. NVIDIA
NIM gives 40 RPM with no daily cap. Google AI Studio gives 10 RPM / 250 RPD for Gemini 2.5 Flash.`

**Do not trust this directory's numbers.** It contradicts itself on the same crawl. Its provider
table marks `Google Gemini` as `No Card` and its own FAQ says `Google AI Studio, NVIDIA NIM,
OpenRouter, Mistral, Cohere, Groq, Cerebras, Cloudflare Workers AI, and Z AI all offer permanent
free tiers without requiring a credit card`, while 400 lines below on the *same page* it says
`Others require credit card verification (Google AI Studio) or phone verification (NVIDIA NIM)`.
Both cannot be true. It also lists `Cerebras` with `0 models` while calling it `Permanent Free`, and
lists six providers with `0 online`. Every number below this section comes from the provider's own
page instead.

**What it gets right and what it misses.** Its coverage of Chinese and long-tail providers
(ModelScope, LLM7.io, Agnes AI, Aion Labs, OpenCode Zen, Kilo Code, Glhf.chat, Nscale) is genuinely
wider than the mission brief's list. It entirely omits Together AI, Fireworks, DeepInfra,
Hyperbolic, Novita, Featherless, Targon, Arli AI, Scaleway, Lambda, Baseten, Replicate, Modal,
Vercel AI Gateway, Moonshot, Baidu, ByteDance Volcano, Upstage, Reka, Writer, Nous, SiliconFlow's
peers (PPInfra, Kluster, Parasail, Redpill, AtlasCloud, Enfer, Inference.net, NextBit, Phala,
Ubicloud, Venice, Crusoe). It is a starting point, not an inventory.

**Most important omission: it has no column for the two things that decide this for us.** It has
no training-on-inputs column and no commercial-use column. Its only sentence on the subject is
prose, not data: `Free tiers often have different data policies than paid ones. Google AI Studio may
use free-tier prompts for product improvement. Groq does not train on customer data. Mistral's free
tier does not log prompts.` Two of those three claims turn out to be wrong or misleading when the
provider's own terms are opened, and the third is understated. See FL1-T below.

---

## Part A. Providers opened, one block each

Each block carries the twelve columns the mission asked for. Where a column is blank on the
provider's own page I write `not stated on the page` rather than guessing.

---

### FL1-1. Groq: the strongest free tier on the two clauses that matter, with a small daily cap

- **Free models offered:** the Free Plan tab of the rate-limit table lists, verbatim:
  `openai/gpt-oss-120b`, `openai/gpt-oss-20b`, `openai/gpt-oss-safeguard-20b`, `qwen/qwen3.8-27b`,
  `groq/compound`, `groq/compound-mini`, `meta-llama/llama-prompt-guard-2-22m`,
  `meta-llama/llama-prompt-guard-2-86m`, `whisper-large-v3`, `whisper-large-v3-turbo`,
  `canopylabs/orpheus-v1-english`, `canopylabs/orpheus-arabic-saudi`.
- **Requests per minute:** 30 for every chat model (`gpt-oss-120b`, `gpt-oss-20b`,
  `gpt-oss-safeguard-20b`, `qwen/qwen3.8-27b`, `groq/compound`, `groq/compound-mini`); 20 for the
  Whisper models; 10 for the Orpheus speech models.
- **Requests per day:** **1K** for `gpt-oss-120b`, `gpt-oss-20b`, `gpt-oss-safeguard-20b` and
  `qwen/qwen3.8-27b`. 250 for `groq/compound` and `groq/compound-mini`. 14.4K only for the two
  `llama-prompt-guard-2` moderation models. 2K for Whisper. 100 for Orpheus.
- **Tokens per minute:** 8K for the four main chat models. 70K for `groq/compound` and
  `groq/compound-mini`. 15K for the prompt-guard models.
- **Tokens per day:** 200K for the four main chat models. 500K for the prompt-guard models.
  `groq/compound` has no TPD printed (the cell is `-`).
- **Per key, account or organisation:** **organisation, and Groq says so in one sentence.**
  Quote: `Rate limits apply at the organization level, not individual users.`
- **Trains on inputs:** **No, and this is the clearest denial any provider gives.** Quote from the
  Groq Services Agreement, section 4.2: `For clarity, Groq is not permitted to use Inputs or
  Outputs for training or fine-tuning any AI Model Services or other models, unless explicitly
  granted permission or instructed by Customer.` And on retention, quote from Your Data in
  GroqCloud: `By default, Groq does not retain customer data for inference requests.` Zero Data
  Retention is not gated to paid plans; quote: `All customers may enable Zero Data Retention (ZDR)
  in Data Controls settings.`
- **Commercial use on the free tier:** **Allowed.** The `personal, non-commercial use only` licence
  that circulates in summaries of Groq is about the marketing website, not the API, and Groq says so
  itself at the top of the Terms of Use. Quote: `These Terms do not apply to you in connection with
  your use of Groq's cloud services, including GroqChat, Groq Playground, and GroqCloud. If you are
  interacting with Groq as a customer of our services, the Groq Services Agreement governs.` The
  Services Agreement contains no non-commercial restriction; it contemplates free usage explicitly
  and only limits its own liability for it. Quote, section 14.2: `GROQ'S TOTAL AGGREGATE LIABILITY
  FOR DAMAGES ARISING OUT OF OR RELATED TO BETA SERVICES AND ANY CLOUD SERVICES PROVIDED FREE OF
  CHARGE IS LIMITED TO $5,000.` The catch to note is section 15.3: the IP indemnity does not apply
  to `any Cloud Services provided to Customer free of charge`.
- **Needs a card on file:** no. freellm.net lists Groq as `No Card`; I could not complete a signup
  to verify this at first hand. `UNVERIFIED:` no-card signup, from the directory only.
- **Region and latency to India:** not stated on the rate-limit page. Data at rest is stated: quote
  from Your Data in GroqCloud, `All customer data is retained in Google Cloud Platform (GCP) buckets
  located in the United States.` `INFERENCE:` a US-hosted endpoint from India is a 200ms to 300ms
  round trip before any tokens are generated, which Groq's throughput largely hides for long
  generations but not for short ones.
- **Prompt caching on the free tier:** yes, automatic, and it is unusually good for a fallback
  chain. Quotes: `Prompt caching works automatically on all your API requests with no code changes
  required and no additional fees`; `There is a 50% discount for cached input tokens`;
  `All cached data automatically expires after 2 hours without use`; and the one that matters most
  here, `Cached tokens do not count towards your rate limits.` That last sentence effectively raises
  the 200K TPD ceiling for any workload with a stable prefix.
- **Batch API:** yes at a 50% discount, but **not on the free plan.** Quote from the rate-limit
  page: `Upgrade to Developer plan to access higher limits, Batch and Flex processing, and more.`
  And on stacking, quote: `the prompt caching discount does not stack with the batch discount.
  Batch requests already receive a 50% discount on all tokens`.
- **OpenAI-compatible:** yes. The endpoint paths on Groq's own pages are `/openai/v1/chat/completions`
  and `/openai/v1/responses`.
- **Date opened:** rate limits, Your Data, prompt caching, Services Agreement, Terms of Use, Policies
  and Notices all opened 2026-09-18.
- **Sources:** https://console.groq.com/docs/rate-limits ; https://console.groq.com/docs/your-data ;
  https://console.groq.com/docs/prompt-caching ; https://console.groq.com/docs/legal/services-agreement ;
  https://groq.com/terms-and-conditions/ ; https://console.groq.com/docs/legal . All opened 2026-09-18.

**Correction to the directory.** freellm.net prints `Groq gives 30 RPM / 14,400 RPD`. That is wrong
for anything you would actually generate with. 14.4K RPD belongs only to the two
`llama-prompt-guard-2` safety classifiers. Every free chat model on Groq is **1,000 requests per
day and 200,000 tokens per day**. A directory number carried forward without opening the table
would have overstated Groq's free capacity by 14x.

---

### FL1-2. Cerebras: 1M free tokens a day, but only 5 requests a minute, and it is a trial

- **Free models offered:** the Free Trial tab lists exactly two, verbatim: `gpt-oss-120b` and
  `qwen-3.8-27b`.
- **Requests per minute:** 5. For both models.
- **Requests per day:** not stated on the page. The Free Trial table prints columns for RPM,
  Uncached TPM, Total TPM, TPH and TPD only; there is no RPD column.
- **Tokens per minute:** 30K uncached, 90K total, for both models. Cerebras runs a two-bucket
  scheme; quote: `Cerebras enforces two independent token limits per organization`, with
  `Total TPM` defaulting to `3x your uncached TPM`.
- **Tokens per day:** **1M**, and tokens per hour is also 1M, which means the daily budget can be
  spent inside a single hour.
- **Per key, account or organisation:** **organisation.** Quote: `Rate limits apply at the
  organization level, not the user level, and vary based on the model.`
- **Trains on inputs:** **No.** Quote from the Terms of Use, Data Usage and Privacy, Monitoring of
  Service Content: `We reserve the right to use Service Content to provide the Service to you,
  comply with applicable law and enforce these Terms. For clarity, the foregoing does not grant
  Cerebras the right to use Service Content for the purpose of training or fine-tuning models.`
  Note the Terms are dated `Effective August 27, 2024`, so this clause has been stable for two
  years.
- **Commercial use on the free tier:** **Allowed.** The `personal, non-commercial use` sentence in
  the Cerebras terms is scoped to Site Content and explicitly carved out from the API. Quote:
  `Cerebras authorizes you to view, use, and download materials from the Site ("Site Content," which
  does not include Service Content) only for your personal, non-commercial use`, followed by
  `The foregoing provision does not apply to the Service or Service Content`. The API licence is the
  opposite; quote: `you are hereby granted a non-exclusive, limited, non-transferable,
  non-sublicensable, worldwide and freely revocable right to access and use the Service, solely for
  your personal use or business purpose, as applicable`, including the right to
  `distribute or allow access to your integration of the APIs within your applications to end users
  of such applications`.
- **Needs a card on file:** not stated on the rate-limits page. freellm.net does **not** mark
  Cerebras `No Card` in its table, unlike 27 of its 31 entries. `UNVERIFIED:` I did not attempt a
  signup.
- **Region and latency to India:** not stated. Quote from the terms: `The Site and Service is
  administered by Cerebras from its offices in California.` `INFERENCE:` US-hosted, so the same
  200ms to 300ms round trip from India as Groq.
- **Prompt caching on the free tier:** yes, and it is the best-designed of any provider here for
  our shape of workload. Quotes: `Prompt caching is automatically enabled for all customers and
  models`; `The system processes prompts in 128-token blocks`; `We guarantee a Time-To-Live (TTL) of
  5 minutes, though caches may persist up to 1 hour depending on system load`; and on limits,
  `Cached tokens don't count toward your uncached TPM limit, so a higher cache hit rate lets you
  process far more total tokens within the same uncached limit.` Also relevant to a privacy claim:
  `it is fully ZDR-compliant. All cached context remains ephemeral in memory and never persisted`
  and `Prompt caches are never shared between organizations.`
- **Batch API:** not offered. There is no batch entry in the Cerebras docs navigation.
- **OpenAI-compatible:** yes, there is a dedicated `OpenAI Compatibility` page in the docs nav.
- **Date opened:** 2026-09-18, all pages.
- **Sources:** https://inference-docs.cerebras.ai/support/rate-limits ;
  https://inference-docs.cerebras.ai/capabilities/prompt-caching ;
  https://www.cerebras.ai/terms-of-service . All opened 2026-09-18.

**The catch, and it is a real one.** Cerebras labels the tier `Free Trial`, not Free. freellm.net
labels it `Permanent Free` and counts `0 models` for it, which is two errors in one row. A tier
called a trial can be ended without notice, and the terms reserve exactly that; quote:
`We may, with or without prior notice, change the Service, stop providing the Service or features
of the Service to you or to Users generally or create usage limits for the Service.`

**5 RPM is the binding constraint, not the token budget.** 1M tokens a day sounds enormous next to
Groq's 200K, but 5 requests a minute is 7,200 requests a day at perfect saturation, and in practice
a burst of six concurrent users produces a 429 immediately. `INFERENCE:` Cerebras is a good
*volume* fallback for long single documents and a bad *concurrency* fallback for many small edits.

---

### FL1-3. Google AI Studio and the Gemini API free tier: DISQUALIFIED, in Google's own words

This is the most important row in the inventory, because Gemini is the free tier everybody reaches
for first and it is the one we categorically cannot use.

- **Free models offered:** the pricing page carries a Free Tier column for a long list including
  `Gemini 3.8 Flash`, `Gemini 3.7 Flash`, `Gemini 3.6 Flash`, `Gemini 3.5 Flash`,
  `Gemini 3.5 Flash-Lite`, `Gemini 3.1 Flash Lite`, `Gemini 2.5 Flash`, `Gemini 2.5 Flash Lite`,
  `Gemini 2.0 Flash`, `Gemini 2.0 Flash Lite`, `Gemini Embedding` and the Gemma models.
- **Requests per minute / per day / tokens per minute / tokens per day:** **not on the public page
  any more.** Google has moved the per-model free-tier table behind a signed-in view. The
  rate-limits page now says only `View your active rate limits in AI Studio` and
  `Specified rate limits are not guaranteed and actual capacity may vary.` The page does state the
  reset rule, quote: `Requests per day ( RPD ) quotas reset at midnight Pacific time.`
  `UNVERIFIED:` the widely repeated `10 RPM / 250 RPD` and `15 RPM / 1,500 RPD` figures. freellm.net
  prints both (`15 RPM, 1,500 RPD` for Gemini 3.8 Flash in its model table, `10 RPM / 250 RPD for
  Gemini 2.5 Flash` in its prose) and I could not confirm either against Google's own page.
- **Per key, account or organisation:** **per project, and Google says so.** Quote: `Rate limits are
  applied per project, not per API key.` `INFERENCE:` that is the pooling case. Every user of our
  product sharing one Google Cloud project shares one bucket, and a single heavy user drains it for
  everyone.
- **Trains on inputs:** **YES. This is a disqualification and Google states it three separate
  times.** The pricing page prints a row labelled `Used to improve our products` for every model and
  every service tier, and the value in the Free Tier column is `Yes` while the Paid Tier column is
  `No`. That row appears **79 times** on the single pricing page I opened. The Additional Terms of
  Service say it in prose; quote: `When you use Unpaid Services, including, for example, Google AI
  Studio and the unpaid quota on Gemini API, Google uses the content you submit to the Services and
  any generated responses to provide, improve, and develop Google products and services and machine
  learning technologies, including Google's enterprise features, products, and services`. And then
  Google adds human review; quote: `To help with quality and improve our products, human reviewers
  may read, annotate, and process your API input and output.` And then, in a sentence that decides
  the matter for a product that holds people's private documents, Google instructs you not to do
  what we would be doing; quote: **`Do not submit sensitive, confidential, or personal information
  to the Unpaid Services.`**
- **Commercial use on the free tier:** allowed in principle, but with a geographic ban that matters
  more. Quote: `Use of Google AI Studio and Gemini API is for developers building with Google AI
  models for professional or business purposes, not for consumer use.` Then, quote:
  **`You may use only Paid Services when making API Clients available to users in the European
  Economic Area, Switzerland, or the United Kingdom.`** So even setting the training clause aside,
  the free tier cannot legally serve a single user in the EEA, Switzerland or the UK.
- **Needs a card on file:** freellm.net contradicts itself on this within one page, so I treat it as
  `UNVERIFIED:`. Google's own tier table says the Free tier qualification is
  `Active project or free trial` with a billing tier cap of `N/A`, which reads as no billing account
  required, and Tier 1 as `Set up and link an active billing account`.
- **Region and latency to India:** the docs carry an `Available regions` page. India is not named on
  the pages I opened. `INFERENCE:` Google serves the Gemini API from global front ends, so latency
  from India is the best of any provider in this inventory. It is irrelevant given the clause above.
- **Prompt caching on the free tier:** yes, and free. The pricing page prints
  `Context caching price` / `Free of charge` in the Free Tier column.
- **Batch API:** **not on the free tier.** The pricing page prints `Batch` / Free Tier /
  `Not available` for input, output and context caching alike. Same for `Flex`. The paid batch rate
  is exactly half the standard rate (`$0.375` against `$0.75` input for Gemini 3.8 Flash).
- **OpenAI-compatible:** partially. freellm.net's own note is the fairest statement I found and I
  did not verify it against Google: `UNVERIFIED:` `Google AI Studio uses a different format but has
  OpenAI-compatible wrappers available.`
- **Date opened:** 2026-09-18.
- **Sources:** https://ai.google.dev/gemini-api/docs/rate-limits ;
  https://ai.google.dev/gemini-api/docs/pricing ; https://ai.google.dev/gemini-api/terms .
  All opened 2026-09-18. Note: these pages 302 to an auto-signin endpoint for a plain curl; they
  return 200 once a cookie jar is carried across the redirect.

**Verdict: disqualified, and not by a close margin.** frontmatter's whole proposition is that the
file on disk is the only source of truth and the editor is sold while the files never are. Routing a
user's private document through a tier whose own terms say human reviewers may read it, and whose
pricing page prints `Used to improve our products: Yes` seventy-nine times, contradicts the
product. There is no configuration flag that turns this off. The only Gemini we could use is the
paid tier, where the same row prints `No`.

---

### FL1-4. Cloudflare Workers AI: the best clause on training, 300 RPM, and a daily budget in neurons

Cloudflare is the only provider in this inventory whose free tier is metered in a compute unit
rather than in tokens, so the token numbers below are **calculated** from Cloudflare's own
per-model neuron table, not read off a page. The arithmetic is shown.

- **Free models offered:** 32 models carry a neuron price on the pricing page. The ones relevant to
  us, verbatim ids: `@cf/openai/gpt-oss-120b`, `@cf/openai/gpt-oss-20b`,
  `@cf/meta/llama-3.1-8b-instruct-fp8-fast`, `@cf/meta/llama-3.3-70b-instruct-fp8-fast`,
  `@cf/meta/llama-4-scout-17b-16e-instruct`, `@cf/qwen/qwen3-30b-a3b-fp8`, `@cf/qwen/qwen3.8-27b`,
  `@cf/qwen/qwen2.5-coder-32b-instruct`, `@cf/google/gemma-4-26b-a4b-it`, `@cf/google/gemma-3-12b-it`,
  `@cf/zai-org/glm-4.7-flash`, `@cf/ibm-granite/granite-4.0-h-micro`,
  `@cf/nvidia/nemotron-3-120b-a12b`, `@cf/mistralai/mistral-small-3.1-24b-instruct`,
  `@cf/deepseek-ai/deepseek-r1-distill-qwen-32b`, and, of specific interest for an Indian user base,
  `@cf/ai4bharat/indictrans2-en-indic-1B`.
- **Requests per minute:** **300** for Text Generation. Quote: `300 requests per minute, unless the
  model requires the Workers Paid plan`. That is ten times Groq's 30 and sixty times Cerebras's 5,
  and it is the highest free RPM I found anywhere in this inventory.
- **Requests per day:** no explicit RPD. The daily cap is a compute budget. Quote: `Our free
  allocation allows anyone to use a total of 10,000 Neurons per day at no charge` and
  `All limits reset daily at 00:00 UTC.`
- **Tokens per minute:** not published.
- **Tokens per day:** not published as tokens, so **calculated.** 10,000 neurons per day divided by
  the per-model neuron price. Worked examples, all from the neuron column of Cloudflare's own
  pricing table:
  - `@cf/meta/llama-3.1-8b-instruct-fp8-fast` is `4119 neurons per M input tokens` and
    `34868 neurons per M output tokens`. 10,000 / 34,868 x 1,000,000 = **286,795 output tokens a
    day** if every neuron went to output, or 2,427,773 input tokens a day if every neuron went to
    input.
  - `@cf/openai/gpt-oss-120b` is `31818 neurons per M input tokens` and `68182 neurons per M output
    tokens`, so 10,000 / 68,182 x 1,000,000 = **146,666 output tokens a day**.
  - `@cf/meta/llama-3.3-70b-instruct-fp8-fast` is `204805 neurons per M output tokens`, so
    10,000 / 204,805 x 1,000,000 = **48,826 output tokens a day**. A 70B model burns the whole free
    budget in about 49,000 tokens.
  - `@cf/ibm-granite/granite-4.0-h-micro` is the cheapest at `10158 neurons per M output tokens`,
    giving 984,445 output tokens a day.
- **What that means in frontmatter requests.** Take one realistic request as 5,000 input tokens
  (a document plus instructions) and 500 output tokens (a splice). Neurons per request =
  5,000/1,000,000 x neurons-per-M-input + 500/1,000,000 x neurons-per-M-output. Dividing 10,000 by
  that gives free requests per day:
  | model | neurons per request | free requests per day |
  |---|---|---|
  | `@cf/ibm-granite/granite-4.0-h-micro` | 12.8 | 781 |
  | `@cf/meta/llama-3.1-8b-instruct-fp8-fast` | 38.0 | 262 |
  | `@cf/qwen/qwen3-30b-a3b-fp8` | 38.4 | 260 |
  | `@cf/zai-org/glm-4.7-flash` | 45.7 | 218 |
  | `@cf/google/gemma-4-26b-a4b-it` | 59.1 | 169 |
  | `@cf/openai/gpt-oss-20b` | 104.5 | 95 |
  | `@cf/openai/gpt-oss-120b` | 193.2 | 51 |
  | `@cf/meta/llama-3.3-70b-instruct-fp8-fast` | 235.7 | 42 |
  `INFERENCE:` 300 RPM against 51 requests a day on the best free model means Cloudflare's free tier
  is shaped for bursts, not for volume. You can serve a hundred simultaneous users for one minute
  and then you are out of budget for the day.
- **Per key, account or organisation:** **per account.** Quote from the limits page, about the paid
  models: `The following limits apply per account, per model`. The free allocation is stated per
  account too: `Our free allocation allows anyone to use a total of 10,000 Neurons per day`.
- **Trains on inputs:** **No, and this is the strongest wording of any provider here because it
  covers service improvement as well as training.** Quote from the Data usage page: `Cloudflare does
  not use your Customer Content to (1) train any AI models made available on Workers AI or (2)
  improve any Cloudflare or third-party services, and would not do so unless we received your
  explicit consent.` Plus: `Cloudflare does not make your Customer Content available to any other
  Cloudflare customer` and `You own, and are responsible for, all of your Customer Content.`
  The page carries `Last updated Apr 21, 2026`.
- **Commercial use on the free tier:** not restricted anywhere on the pricing, limits or data-usage
  pages. Workers AI is sold through the ordinary Workers plans; quote: `Workers AI is included in
  both the Free and Paid Workers plans`. There is a per-model caveat to check rather than a
  commercial one; quote: `Cloudflare neither creates nor trains the AI models made available on
  Workers AI. The models constitute Third-Party Services and may be subject to open source or other
  license terms that apply between you and the model provider.` `INFERENCE:` that pushes the licence
  question down to the model, which for Llama, Qwen, Gemma and gpt-oss is a permissive or
  community licence that allows commercial use at our scale, but it is a per-model check, not a
  blanket yes.
- **Needs a card on file:** no for the free allocation, and Cloudflare names the exceptions. Quote:
  `Some models require a paid billing method. This applies to @cf/moonshotai/kimi-k2.6 ,
  @cf/moonshotai/kimi-k2.7-code , @cf/zai-org/glm-5.2 , @cf/zai-org/glm-5.3 ,
  @cf/zai-org/glm-5.3-flash , @cf/deepseek-ai/deepseek-v4-flash-0731 , and
  @cf/deepseek-ai/deepseek-v4-pro-0813 .` Everything else runs on the free allocation.
- **Region and latency to India:** best in class, and the only provider here with a structural
  advantage. Workers AI runs on Cloudflare's edge network, which has multiple points of presence in
  India. `UNVERIFIED:` I did not open a page that states Indian GPU capacity specifically, and
  inference may be routed to a GPU region rather than the nearest edge, so the latency claim is
  `INFERENCE:` not a quote.
- **Prompt caching on the free tier:** yes, by default on some models. Quote: `Cached input tokens
  are billed at a discounted rate compared to regular input tokens. Workers AI enables prefix
  caching by default for select models.` The discount is per model rather than a flat rate; the
  pricing table shows `@cf/deepseek-ai/deepseek-v4-flash-0731` at `$0.440 per M input tokens` and
  `$0.014 per M cached input tokens`, which is a 96.8% discount, although that model needs a card.
  There is a routing requirement worth knowing: quote, `Prefix caching only works when a request
  routes to the same model instance that holds the cached tensors. To maximize cache hit rates, send
  the x-session-affinity header with a unique identifier for your session or agent.`
- **Batch API:** yes, and it is in the docs nav as `Asynchronous Batch API Beta`. I did not find a
  stated discount on the batch page. `UNVERIFIED:` batch discount.
- **OpenAI-compatible:** yes. The docs nav has a dedicated `OpenAI compatible API endpoints` page.
- **Date opened:** 2026-09-18. The pricing and limits pages both print `Last updated Sep 17, 2026`,
  so these numbers are one day old.
- **Sources:** https://developers.cloudflare.com/workers-ai/platform/pricing/ ;
  https://developers.cloudflare.com/workers-ai/platform/limits/ ;
  https://developers.cloudflare.com/workers-ai/platform/data-usage/ ;
  https://developers.cloudflare.com/workers-ai/features/prompt-caching/ . All opened 2026-09-18.

---

### FL1-5. Cohere trial keys: DISQUALIFIED, and the clause is broader than Google's

- **Free models offered:** trial keys reach every Chat model. From the rate-limit table, verbatim:
  `Command A+`, `Command A Reasoning`, `Command A Translate`, `Command A Vision`, `Command A`,
  `Command R+`, `Command R`, `Command R7B`, `North Mini Code`. Plus `Embed`, `Rerank`, `Tokenize`,
  `Parse`, `EmbedJob` and `Audio Transcriptions`.
- **Requests per minute:** **20** for every Chat model. `Rerank` is 10, `EmbedJob` 5,
  `Audio Transcriptions` 5, `Tokenize` 100, `Parse` 500, `Embed` `2,000 inputs / min`.
- **Requests per day:** no daily limit. There is a **monthly** one, and it is the binding constraint.
  Quote: `Trial keys (and prod keys on newer Chat model variants) are limited to 1,000 API calls a
  month.` `INFERENCE:` 1,000 calls a month is about 33 a day, which is not a fallback tier for a
  product, it is an evaluation allowance.
- **Tokens per minute / per day:** not stated on the page. Cohere meters trial keys in calls, not
  tokens.
- **Per key, account or organisation:** per key. Quote: `Cohere offers two kinds of API keys:
  evaluation keys (free but limited in usage), and production keys (paid and much less limited in
  usage).`
- **Trains on inputs:** **YES, and worse, it also shares with third parties.** Quote from the SaaS
  Agreement, Ownership and Reservation of Rights, in the original capitals: `CUSTOMER GRANTS TO
  COHERE A NONEXCLUSIVE, WORLDWIDE, ROYALTY-FREE, IRREVOCABLE, SUBLICENSABLE, AND FULLY PAID-UP
  RIGHT TO ACCESS, COLLECT, USE, PROCESS, STORE, DISCLOSE AND TRANSMIT CUSTOMER DATA TO: (I) PROVIDE
  THE SERVICES; (II) TO EXERCISE ITS RIGHTS AND PERFORM ITS OBLIGATIONS UNDER THIS AGREEMENT ... AND
  (III) IMPROVE AND ENHANCE THE SERVICES AND COHERE'S OTHER OFFERINGS AND BENCHMARK THE FOREGOING,
  INCLUDING BY SHARING API DATA AND FINETUNING DATA WITH THIRD PARTIES WHO MAY USE THE FINETUNING
  DATA AND API DATA TO PROVIDE SERVICES TO COHERE AND FOR OTHER PURPOSES PERMITTED UNDER THEIR TERMS
  AND CONDITIONS.` Cohere then warns you about it in the next paragraph; quote: `CUSTOMER FURTHER
  ACKNOWLEDGES THAT ANY THIRD PARTY TERMS AND CONDITIONS MAY NOT HAVE THE SAME OR SIMILAR
  COMMITMENTS OR PROTECTIONS AS THOSE CONTAINED IN THIS AGREEMENT`. Note that `API Data` is defined
  as `any Customer Data submitted by Customer to the Cohere API`, so this is not limited to
  fine-tuning uploads.
- **Commercial use on the free tier:** permitted, and in fact Cohere *requires* business use. Quote
  from the Terms of Use: `You acknowledge and agree that the Cohere Solution has been designed for
  business use and you represent and warrant to and covenant with Cohere that you will not use the
  Cohere Solution for personal, family or household purposes.` And quote:
  `Customer may incorporate the Cohere API into Customer's products and services`. There is a
  competitor clause to watch; quote: you may not use it `for the use or benefit of any direct
  competitor to Cohere as reasonably determined by Cohere (and which includes any entity that offers
  large language models for license or sale)`.
- **Needs a card on file:** no for a trial key. `UNVERIFIED:` from freellm.net's `No Card` label
  only; I did not complete a signup.
- **Region and latency to India:** not stated on the pages opened.
- **Prompt caching / batch:** not stated on the rate-limits page.
- **OpenAI-compatible:** no. Cohere's Chat API has its own shape.
- **Date opened:** 2026-09-18.
- **Sources:** https://docs.cohere.com/docs/rate-limits ; https://cohere.com/saas-agreement ;
  https://cohere.com/terms-of-use . All opened 2026-09-18.

**Verdict: disqualified on the training clause, and it would have been unusable anyway.** 1,000
calls a month is not a fallback. `INFERENCE:` the third-party sharing sentence makes this worse than
Google for our use case, because Google at least keeps the data inside Google.

---

### FL1-6. OpenRouter: not a provider, but the single most useful artefact in this whole inventory

OpenRouter does not run models. It routes to 88 providers. That makes it two things for us: a
fallback chain someone else has already built, and, more valuable, **a machine-readable register of
which providers train on prompts.**

- **Free models offered:** **21**, counted by me from OpenRouter's own `/api/v1/models` response by
  filtering ids ending in `:free`. A further 3 are priced at zero without the suffix, for 24 total
  at zero cost. The 21, verbatim ids: `cohere/north-mini-code:free`,
  `dots-studio/dots-3-note-preview:free`, `google/gemma-4-26b-a4b-it:free`,
  `google/gemma-4-31b-it:free`, `inclusionai/ling-3.0-flash-fin:free`,
  `inclusionai/ling-3.0-flash-sante:free`, `inclusionai/ling-3.0-flash-vl:free`,
  `liquid/lfm-2.5-2.6b:free`, `nex-agi/nex-n2.5-mini:free`, `nex-agi/nex-n2.5-pro:free`,
  `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free`, `nvidia/nemotron-3-super-120b-a12b:free`,
  `nvidia/nemotron-3-ultra-550b-a55b:free`, `nvidia/nemotron-3.5-content-safety:free`,
  `nvidia/nemotron-3.5-lightning:free`, `poolside/laguna-s-2.1:free`, `poolside/laguna-xs-2.1:free`,
  `qwen/qwen3.8-27b:free`, `thinkingmachines/inkling-small:free`, `thinkingmachines/inkling:free`,
  `z-ai/glm-5.2:free`. Total models listed on the endpoint: 445.
  **This corrects freellm.net**, which prints `34 models` and `~35 models free` for OpenRouter.
  The number today is 21, or 24 if you count zero-priced models without the suffix.
- **Context windows are the headline.** `thinkingmachines/inkling:free` and
  `thinkingmachines/inkling-small:free` are `1048576`. `nvidia/nemotron-3-ultra-550b-a55b:free` and
  `nvidia/nemotron-3.5-lightning:free` are `1000000`. Seven more are `262144`. For a document editor
  that is the relevant axis, and no direct provider's free tier comes close.
- **Requests per minute:** **20.** Requests per day: **50**, or **1,000** once you have ever bought
  at least $10 of credits. These are not rendered in the HTML; they are constants in the page
  source, verbatim from `https://openrouter.ai/docs/api-reference/limits.md`:
  `export const FREE_MODEL_RATE_LIMIT_RPM = 20;`, `export const FREE_MODEL_NO_CREDITS_RPD = 50;`,
  `export const FREE_MODEL_HAS_CREDITS_RPD = 1000;`, `export const FREE_MODEL_CREDITS_THRESHOLD = 10;`.
  The prose confirms the mechanism: `The limit tier is selected by all-time credits purchased,
  independently of is_free_tier.` `INFERENCE:` a single one-off $10 top-up permanently multiplies
  the free allowance twentyfold. That is the cheapest capacity in this entire inventory.
- **Tokens per minute / per day:** none. OpenRouter meters free models in requests only.
- **Per key, account or organisation:** account, and it is queryable. Quote: the
  `GET /api/v1/key` response carries `free_model_daily_requests` with
  `used`, `limit` and `remaining`. `INFERENCE:` that makes OpenRouter the only provider here whose
  remaining free budget a router can read before deciding where to send a request, rather than
  discovering it through a 429.
- **Trains on inputs:** **it depends on the model, and OpenRouter publishes the answer as data.**
  OpenRouter's own terms, section 6.1: `Some Models may store or train on your Inputs for improving
  their own large language models and may allow you to opt-out of model training, as described in
  their Model Terms. Where possible, OpenRouter has opted out of model training with the Models it
  uses.` OpenRouter's own logging is opt-in; quote from 6.5: `Unless explicitly opted in to prompt
  logging, we do not store your Inputs after categorizing them and do not associate the categorized
  Inputs with any specific user or organizational accounts.` And there is a routing control; quote
  from the docs: `If you opt out of training in your account settings, OpenRouter will not route to
  providers that train`, with `separate settings for paid and free models`.
  **Do not opt into prompt logging.** If you do, section 6.2 grants OpenRouter the right to
  `license or sell your User Content in anonymized form`.
- **The register.** `https://openrouter.ai/api/frontend/v1/all-providers` returns, per provider, a
  `dataPolicy` object with a `training` boolean and a retention period. I fetched it on 2026-09-18.
  **88 providers listed. Exactly 4 are flagged as training:** `DeepSeek`, `Liquid`, `NVIDIA` and
  `Thinking Machines`. The other 84 are flagged as not training. Retention varies: 41 are
  `zero retention`; `Google AI Studio` is the longest at 55 days; `Anthropic`, `Cohere`, `Meta`,
  `Mistral`, `AionLabs`, `Black Forest Labs`, `Nex AGI`, `Sourceful`, `SpaceXAI`, `Unbiased` and
  `Xiaomi` are 30 days.
- **Which free models that actually rules out.** I resolved each free model to its serving provider
  through `/api/v1/models/<id>/endpoints`, opened 2026-09-18. `nvidia/nemotron-3-ultra-550b-a55b:free`
  is served by `Nvidia`, `liquid/lfm-2.5-2.6b:free` by `Liquid`, and `thinkingmachines/inkling:free`
  by `Thinking Machines`. All three of those providers are flagged `training: true`. So **seven of
  the twenty-one free models** (the four NVIDIA Nemotron ones, the Liquid one and the two Thinking
  Machines ones) come from providers OpenRouter itself marks as training, and those seven include
  the two largest context windows on the list. The safe ones resolve elsewhere:
  `z-ai/glm-5.2:free` is served by `Decart` (zero retention, does not train), `qwen/qwen3.8-27b:free`
  by `ModelRun` (zero retention), `google/gemma-4-26b-a4b-it:free` by `Google AI Studio`
  (55-day retention, flagged not training), `cohere/north-mini-code:free` by `Cohere` (30-day
  retention, flagged not training), `poolside/laguna-s-2.1:free` by `Poolside`.
- **A discrepancy worth naming.** OpenRouter's register flags `Google AI Studio` as not training.
  Google's own terms say the unpaid quota does train, quoted in full at FL1-3. `INFERENCE:` the most
  likely reconciliation is that OpenRouter buys paid Google quota and resells a slice of it for
  free, so the route really is the non-training paid tier. But OpenRouter disclaims the register
  itself, in capitals: quote, `OPENROUTER MAKES NO REPRESENTATION OR WARRANTY REGARDING ANY MODEL
  PROVIDER'S DATA HANDLING, RETENTION, TRAINING, SECURITY, AVAILABILITY, OR INTELLECTUAL PROPERTY
  PRACTICES.` So the register is an excellent starting filter and a bad final authority.
- **Commercial use on the free tier:** allowed, and OpenRouter has a DPA for exactly this case.
  Quote: `If you are part of and represent an organization in entering into these Terms or use the
  Service for commercial, for-profit purposes, please read the OpenRouter Data Processing Agreement`.
  No non-commercial restriction appears anywhere in the terms.
- **Needs a card on file:** not for 50 requests a day. For the 1,000-a-day tier you must have bought
  credits at least once. Quote: `OpenRouter requires users to purchase Credits to make API calls and
  access the Service, with a minimum and maximum purchase amount of $5 and $25,000 per transaction`.
  `INFERENCE:` the $5 minimum purchase against the $10 threshold means two top-ups, or one of $10.
- **Region and latency to India:** in-region routing exists but is enterprise-only. Quote:
  `For enterprise customers, OpenRouter supports in-region routing in the EU and US ... Use
  https://eu.openrouter.ai for EU requests or https://us.openrouter.ai for US requests. This feature
  is only enabled for enterprise customers by request.` No Asian region is offered.
- **Prompt caching:** passed through from the underlying provider rather than provided by OpenRouter.
- **Batch:** OpenRouter's terms reference it. Quote from 6.3(b): `Certain features of the Service,
  such as batch or other large-volume request processing, require OpenRouter to temporarily store
  your User Content`. `UNVERIFIED:` no discount figure found.
- **OpenAI-compatible:** yes, this is its whole design.
- **Date opened:** 2026-09-18, all endpoints and pages.
- **Sources:** https://openrouter.ai/docs/api-reference/limits ;
  https://openrouter.ai/docs/api-reference/limits.md ;
  https://openrouter.ai/docs/features/privacy-and-logging.md ; https://openrouter.ai/terms ;
  https://openrouter.ai/api/v1/models ; https://openrouter.ai/api/frontend/v1/all-providers ;
  https://openrouter.ai/api/v1/models/<id>/endpoints . All opened 2026-09-18.

**A note on method, because it changes what you should build.** The numbers on OpenRouter's limits
page do not exist in the rendered HTML; the table cells are empty and the values are injected by
client script. A researcher reading the page in a browser sees `20` and `50` and `1000`; a scraper
or an agent reading the page sees blanks. The `.md` twin of the same page carries the constants. If
we ever build a scheduled job that re-checks provider limits, it must read the `.md` or the API, not
the page.

---

### FL1-7. NVIDIA NIM (build.nvidia.com): DISQUALIFIED twice over

NVIDIA is the provider freellm.net pushes hardest, with `131 models` and a `Permanent Free` label.
Its own terms say something else.

- **Free models offered:** `UNVERIFIED:` build.nvidia.com is a client-rendered single-page app and
  curl returns only the shell, so I could not list the catalogue from the provider's own page.
  freellm.net counts `131 free models, 79 online`, and I am not repeating that as fact.
- **Requests per minute:** `UNVERIFIED:` freellm.net prints `Up to 40 RPM` in its model table and
  `NVIDIA NIM gives 40 RPM with no daily cap` in its prose. I could not open an NVIDIA page that
  states this. `https://docs.api.nvidia.com/nim/docs/rate-limits` returns 404.
- **Requests / tokens per day:** not found on any NVIDIA page I could open.
- **Per key, account or organisation:** not stated.
- **Trains on inputs:** **effectively yes, by licence.** The NVIDIA Terms of Use, section 6, grant:
  quote, `you grant NVIDIA, its affiliates and their service providers a worldwide license to User
  Content to use, host, store, reproduce, modify, create derivative works (such as those resulting
  from translations, adaptations or other changes), display and transmit the User Content solely to
  (a) provide you with the Technology, including NVIDIA Services, (b) provide you support, or for
  security reasons, and (c) modify and improve NVIDIA products or services or the technology
  underlying the Technology.` Limb (c) is a service-improvement grant with no training carve-out.
  A second, independent signal points the same way: OpenRouter's provider register flags `NVIDIA`
  with `training: true`, one of only 4 providers out of 88 so flagged (see FL1-6).
- **And NVIDIA separately forbids sending the kind of data we handle.** Quote, section 6,
  Limitations on User Content: `Unless expressly permitted via a Product Agreement, you agree that
  your actions and transmission of User Content: (a) does not include any confidential information;
  (b) does not include any controlled or sensitive data, including (but not limited to) protected
  health information, personal data, payment card industry information or sensitive human subject
  research`. A markdown editor holding people's private documents cannot honour that clause. This is
  a harder ban than Google's, which is phrased as advice.
- **Commercial use on the free tier:** the free tier is a promotional programme that can end at any
  time. Quote, section 7: `NVIDIA may offer free or discounted pricing programs for the Technology
  for trial, evaluation or academic use. NVIDIA may stop accepting new participants or discontinue a
  promotional offering at any time. Standard charges will apply after a promotional offering ends or
  if you exceed the promotional offering use terms.`
- **Needs a card on file:** no card, but freellm.net says a phone number. Quote from freellm.net,
  which is a directory not a provider: `NVIDIA NIM and Mistral want your phone number.`
  `UNVERIFIED:` I did not reach an NVIDIA page stating the signup requirement.
- **Region and latency to India:** not stated.
- **Date opened:** 2026-09-18.
- **Sources:** https://developer.nvidia.com/legal/terms ; https://build.nvidia.com/legal/terms-of-use
  (SPA shell only) ; https://docs.api.nvidia.com/nim/docs/rate-limits (404). All 2026-09-18.

**Verdict: disqualified on the confidentiality ban alone, before the training question.** The most
generous-looking catalogue in the inventory is the one we can use least.

---

### FL1-8. GitHub Models: RETIRED on 30 July 2026, and the directory still lists it

- **Status:** dead. Quote, in full, from GitHub's own documentation page, which is now a stub:
  `GitHub Models has been retired.` and `As of July 30, 2026, GitHub Models has been fully retired.
  The playground, model catalog, inference API, and bring your own key (BYOK) are no longer
  available to any customer.`
- **Where GitHub points instead:** quote, `For new and existing projects that need AI model access,
  Azure AI Foundry offers a broad model catalog.` And it draws a line under a common confusion;
  quote, `GitHub Models was a separate service from GitHub Copilot and is unrelated to GitHub
  Copilot services.`
- **Source:** https://docs.github.com/en/github-models/use-github-models/prototyping-with-ai-models
  opened 2026-09-18.

**This is the clearest single demonstration that a directory is not evidence.** On the day I opened
it, freellm.net's provider table still listed `GitHub Models` with `16 models` and a `Copilot
limits` free-tier label, its no-credit-card list still said `GitHub Models - 16 free models, 3
online`, and its FAQ still claimed `GitHub Models provides free access to GPT-5, GPT-4.1, GPT-4o,
and o4-mini` and `GitHub Models provides free access to Grok 3 and Grok 3 Mini`. The service had
been fully retired for **50 days** at that point (30 July to 18 September 2026, counted by me).
Worse, the directory's own automated liveness check reported `3 online` for a service whose
inference API no longer exists, which means the check is not testing what it claims to test.

`INFERENCE:` for our purposes this is the argument for building the fallback chain around a
**live health probe** rather than a static provider list. Any list, ours included, will be wrong
within weeks.

---

### FL1-9. Mistral: a clear training clause, but I could not open the rate limits

- **Free models offered:** `UNVERIFIED:` the docs page that lists them is unreachable, see below.
- **Rate limits:** **unreachable.** Mistral's own `llms.txt` points at
  `https://docs.mistral.ai/docs/deployment/laplateforme/tier.md` with the description
  `Learn about Mistral's API rate limits, usage tiers, and how to upgrade for higher capacity.`
  That URL returns 404, as do
  `https://docs.mistral.ai/deployment/laplateforme/tier/`,
  `https://docs.mistral.ai/deployment/laplateforme/tier`,
  `https://docs.mistral.ai/deployment/laplateforme/tier.md` and
  `https://docs.mistral.ai/deployment/laplateforme/pricing.md`, all probed 2026-09-18. Mistral's
  index of its own documentation is pointing at pages that no longer exist.
  `UNVERIFIED:` freellm.net's `~1B tokens/mo` label for Mistral. I could not confirm it anywhere.
- **What the pricing page does say:** the consumer Free plan includes, verbatim, `$10 /mo in API
  credits.` alongside `Test Mistral models in Studio.` Source https://mistral.ai/pricing .
- **Trains on inputs:** **conditionally, and the default matters.** Quote from the Commercial Terms
  of Service, section 4.2: `Mistral AI will not use Customer Data or Outputs to train its artificial
  intelligence models except (a) when you (i) opted-in to training on a Mistral AI Product set to
  opt-out by default or (ii) have not opted-out of training on a Mistral AI Product set to opt-in by
  default, (b) when Customer or an End User provides Feedback to Mistral AI, (c) as otherwise may be
  provided in an Order Form or (d) when Customer uses Labs or Preview Models.` Section 4.1 is
  cleaner and is the good news; quote: Mistral may use Customer Data `for the purposes of (a)
  providing, maintaining, and optimizing the Mistral AI Products, which includes debugging,
  assessing, reviewing, and correcting the performance of the Mistral AI Products but excludes model
  training`.
  **The trap is limb (a)(ii) and limb (d).** Some Mistral products are opt-in-by-default for
  training, and on those, doing nothing means your data is trained on. And any `labs` prefixed model
  trains regardless of your settings; quote from 4.3: `By using Labs or Preview Models, you
  acknowledge that (i) Mistral AI may use Customer Data and Outputs generated from Labs or Preview
  Models to train its artificial intelligence models and (ii) the opt-out preferences you selected
  for other Mistral AI Products (including through zero data retention) does not apply to Labs or
  Preview Models. If you do not want your data or outputs used for training, do not use Labs or
  Preview Models.`
  `UNVERIFIED:` whether the free API tier specifically is opt-in-by-default. Historically it was,
  and that is exactly the page I could not open. **This must be settled before Mistral goes in the
  chain.** freellm.net's claim that `Mistral's free tier does not log prompts` is not supported by
  anything I opened and should not be relied on.
- **Commercial use on the free tier:** the Commercial Terms of Service govern commercial customers
  and contain no non-commercial restriction. Free credits are described on the consumer pricing
  page, which is a different product surface.
- **Needs a card on file:** `UNVERIFIED:` freellm.net says a phone number, not a card.
- **Region:** Mistral is a French company and its terms carry EU Data Act switching provisions, so
  `INFERENCE:` EU processing, which is the best answer in this inventory for a European customer and
  a poor one for latency from India.
- **Prompt caching / batch:** not reached.
- **OpenAI-compatible:** `UNVERIFIED:` widely believed to be, and freellm.net lists Mistral among
  providers that `support the OpenAI /chat/completions format`. I did not open a Mistral page
  stating it.
- **Date opened:** 2026-09-18.
- **Sources:** https://legal.mistral.ai/terms/commercial-terms-of-service ;
  https://legal.mistral.ai/terms/additional-terms ; https://mistral.ai/pricing ;
  https://docs.mistral.ai/llms.txt . All opened 2026-09-18.

---

### FL1-10. Hugging Face Inference Providers: ten cents a month

- **Free models offered:** routing to 18 named providers. Verbatim from the docs nav: `Baseten
  Cerebras Cohere DeepInfra Fal AI Featherless AI Fireworks Groq HF Inference Novita Nscale
  OVHcloud AI Endpoints Public AI Replicate Scaleway Together WaveSpeedAI Z.ai`. Quote:
  `Access 200+ models from leading AI inference providers`.
- **The free allowance, and it is the whole story:** quote, `Every Hugging Face user receives
  monthly credits to experiment with Inference Providers`, and the table gives `Free Users` a
  `Monthly Credits` value of **`$0.10, subject to change`**. `PRO Users` get `$2.00`, and
  `Team or Enterprise Organizations` get `$2.00 per seat`.
- **Requests / tokens per minute or day:** not published. HuggingFace meters in dollars.
- **Per key, account or organisation:** **pooled for teams.** Quote: `For Team or Enterprise
  organizations, credits are shared among all members.`
- **Trains on inputs:** not stated on the pricing page. HuggingFace is a router, so the answer is
  the underlying provider's. Not settled here.
- **Commercial use:** no restriction on the pricing page. Quote: `pay-as-you-go pricing ... just pay
  for what you use, with no markup from Hugging Face.`
- **Needs a card on file:** for the $0.10 no. Quote: `Extra usage (pay-as-you-go)` for `Free Users`
  is `yes (credits purchase required)`.
- **Date opened:** 2026-09-18.
- **Source:** https://huggingface.co/docs/inference-providers/pricing opened 2026-09-18.

**Correction to the directory.** freellm.net labels HuggingFace's free tier `100K credits/mo`. The
provider's own page says `$0.10, subject to change`. `INFERENCE:` ten cents a month is an evaluation
allowance, not a fallback tier. It would buy on the order of a few hundred thousand input tokens on
the cheapest routed model, once, per month.

---

### FL1-11. Vercel AI Gateway: $5 a month, the largest recurring free credit found

- **Free models offered:** a subset, not the catalogue. Quote: `The free tier includes a subset of
  models, not the full catalog. To see which models you can use with free credits, browse the Free
  Tier models.` `UNVERIFIED:` I did not list that subset.
- **The allowance:** quote, `$5 /month included` for the free tier, against
  `Pay as you go with purchased credits` for the paid tier. Quote: `Every Vercel team account gets
  access to both a free tier and a paid tier for AI Gateway Credits.`
- **Requests per minute / day:** not published as numbers. Quote: `Free tier requests are also rate
  limited per model, with lower limits than the paid tier. If you exceed a limit, AI Gateway returns
  a 429 error and you can retry after a short wait.`
- **Per key, account or organisation:** **per team.** The credit is granted to `Every Vercel team
  account`, which is the pooling case.
- **The clause that decides how to use it:** quote, `Your free credits start when you make your
  first AI Gateway request. To run larger workloads, you can purchase AI Gateway Credits at any time
  with no obligation to renew. Once you purchase credits, your account transitions to the paid tier
  and the monthly free credit no longer applies.` So the $5 and paid credit **do not stack**. The
  moment you top up, you lose the monthly $5 forever.
- **Bring your own key:** quote, `BYOK is available on the paid tier`, and `Not available` on free.
  `INFERENCE:` that closes the obvious trick of using the Gateway as a free router in front of our
  own Groq and Cloudflare keys, unless we are paying.
- **Token pricing:** quote, `AI Gateway charges no markup and no platform fee on tokens. You pay the
  provider's list price on a pay-as-you-go basis.`
- **Trains on inputs:** not stated on the pricing page. It is a router; the answer is the underlying
  provider's.
- **Commercial use:** no restriction stated.
- **Needs a card on file:** not for the $5.
- **Date opened:** 2026-09-18.
- **Source:** https://vercel.com/docs/ai-gateway/pricing opened 2026-09-18.

---

### FL1-12. Scaleway: no free tier, but the best privacy wording found anywhere, and it is European

Scaleway is not on freellm.net at all. It belongs in this inventory anyway, because its data policy
is the one every other provider's should be measured against, and because it is the only provider
here that addresses the extraterritorial-law question directly.

- **Free models offered:** none. There is no free tier. Quote from the rate-limits page:
  `Base limits apply if you registered a valid payment method, and they are increased automatically
  if you also verify your identity.` A payment method is the entry condition, not an upgrade.
- **Rate limits:** metered on three axes. Quote: `Any model served through Scaleway Generative APIs
  - Serverless gets rate limited based on: Tokens per minute (total input and output tokens),
  Queries per minute (HTTP requests), Concurrent requests (total simultaneous HTTP sessions)`. The
  exact values are behind the console; quote, `Exact limit values are detailed in Organization
  quotas for Generative APIs - Serverless.` The header example on the page shows
  `x-ratelimit-limit-requests` with `600` and the description `Maximum number of requests allowed
  over a minute.`
- **Per key, account or organisation:** **organisation, pooled across projects.** Quote:
  `These values apply to your Organization, and are shared by all Projects within your
  Organization.`
- **Trains on inputs:** **No, and the wording is the strongest in this document.** Quotes from the
  Generative APIs Privacy Policy: `By default we apply a Zero Data Retention Policy, collecting only
  data required to provide the service reliably and securely.` Then:
  `We do not collect, read, reuse, or analyze the content of your inputs, prompts, or outputs
  generated by the API.` Then, in three consecutive lines:
  `Your data is not accessible to other Scaleway customers.`
  `Your data is not accessible to the creators of the underlying large language models (LLMs). Your
  data is not used for training, retraining, or improving the base models.`
  `Your data is not accessible to third-party products, or services.`
  It even gives the one exception a measured frequency; quote: `this analysis happens when a request
  triggers a 500 HTTP error, occurring very rarely (1 out of a million requests). Data is stored for
  up to two weeks`.
- **Region:** quote, `Your personal data may be stored in the following region: Paris, France.` And,
  quote, `As a European company, Scaleway's AI services are not subject to extraterritorial laws
  such as the American Cloud Act. This means that your data hosted in Europe is protected by
  European laws, which provide a high level of data sovereignty and security.` `INFERENCE:` that
  sentence is the answer to the EEA problem that disqualifies Gemini's free tier at FL1-3, and it is
  worth a lot more than a free tier if frontmatter ever sells to a European team.
- **Batch API:** yes, and the discount is stated plainly, which almost nobody else does. Quote:
  `Use the Batches API for non-real-time workloads. Requests performed through the Batches API do
  not have a rate limit and are billed with a -50% discount compared to standard model prices.`
  No rate limit at all on batch is unusual.
- **OpenAI-compatible:** yes, there is a dedicated `OpenAI API compatibility` page in the docs nav.
- **Commercial use:** unrestricted; it is a paid cloud service.
- **Needs a card on file:** yes, this is the entry condition.
- **Date opened:** 2026-09-18. The rate-limits page prints `Reviewed on April 24, 2026`; the privacy
  policy prints `Reviewed on October 03, 2025`.
- **Sources:** https://www.scaleway.com/en/docs/generative-apis/reference-content/rate-limits/ ;
  https://www.scaleway.com/en/docs/generative-apis/reference-content/data-privacy/ . Both opened
  2026-09-18.
- **Method note:** `curl` fails on this host in this environment with
  `SSL certificate problem: unable to get local issuer certificate`. Python's `urllib` reaches it
  with a different trust store, though the response ends in an `IncompleteRead`. The content above
  is from the recovered partial body, which contained the complete article.

---

### FL1-13. OVHcloud AI Endpoints: free only on the models you would not use

- **Free models offered:** the catalogue marks a `Free` price on guard, moderation, image and
  speech models, not on general chat. From the page, the entries labelled `Free` include
  `Qwen3Guard-Gen-8B` (`LLM GUARD`, `Beta`, `Max. context size : 32 K`), `Qwen3Guard-Gen-0.6B`,
  `stable-diffusion-xl-base-v10` (`IMAGE GENERATION`), and a set of `nvr-tts-*` text-to-speech
  models. The reasoning and chat models carry a price; `gpt-oss-120b` shows `0.08 €` `/
  Mtoken(input)`.
- **Everything else:** `UNVERIFIED:` I did not reach an OVH page stating RPM, RPD, TPM, TPD, the
  training policy, or the commercial-use clause.
- **Date opened:** 2026-09-18.
- **Source:** https://endpoints.ai.cloud.ovh.net/ opened 2026-09-18.

**Correction to the directory.** freellm.net lists `OVHcloud AI Endpoints` with `14 models` and a
`Permanent Free` label. On OVH's own catalogue the free models are content-safety classifiers, an
image model and text-to-speech voices. There is no free general-purpose chat model. A directory that
counts models rather than reading their prices will keep making this mistake.

---

### FL1-14. The long tail freellm.net names, checked against the providers themselves

These are the entries on freellm.net that nobody else lists. I opened what I could.

**LLM7.io.** freellm.net labels it `Permanent Free` with `19 models`. LLM7's own model endpoint
disagrees. `https://api.llm7.io/v1/models`, opened 2026-09-18, returns **48 models, and not one of
them is priced at zero.** Every record carries `"usage_based_only": true` and a `pricing` object.
The tiers are `pro` (42 models) and `turbo` (6). Examples copied from the response:
`claude-opus-5` has `"pricing": {"input": 2.5, "output": 12.5, "cached_input": 0.3, "currency":
"USD", "unit": "1M tokens"}`; `gpt-6-astra` has `{"input": 5.0, "output": 10.0, "cached_input":
2.0}`; `gemini-3.8-flash-high` has `{"input": 0.05, "output": 0.15, "cached_input": 0.1}`.
The catalogue includes 21 proprietary-branded ids across four frontier vendors: `claude-opus-5`,
`claude-sonnet-5`, `claude-sonnet-4-6`, `claude-haiku-4-5`, `claude-opus-4-8`, `claude-fable-5`,
`claude-fable-5-1`, `gpt-5.5`, `gpt-5.6-luna`, `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-6-astra`,
`gpt-image-2`, `gpt-image-2.5`, `gemini-3-flash`, `gemini-3.1-flash-lite`, `gemini-3.7-flash`,
`gemini-3.8-flash-high`, `gemini-omni-flash`, `grok-4.5`, `grok-4.6`.
The marketing site `https://llm7.io/` is a client-rendered app; curl returns only the meta
description, verbatim: `One LLM API. Your Gateway to AI Innovation. Connect to leading AI models
with one endpoint. Prototype, build, and scale without switching providers.` I found no terms page
and no statement about training. **Verdict: not free today, and unverifiable on the clause that
matters. Skip.**

**OpenCode Zen.** Genuinely free models, OpenAI-compatible, and it publishes the endpoint next to
each one. The free ids, verbatim from the docs table: `union-alpha` (`Union Alpha Free`),
`mimo-v2.5-free`, `ling-3.0-flash-fin-free`, `nemotron-3-ultra-free`,
`nemotron-3.5-lightning-free`, `muse-spark-1.3-contributor-free`, plus a `Big Pickle` entry. The
pricing table prints `Free` in the input, output and cache-read columns for each. Base URLs given
on the page: `https://opencode.ai/zen/v1/chat/completions` for the OpenAI-compatible ones,
`https://opencode.ai/zen/v1/messages` for the Anthropic-shaped one, `https://opencode.ai/zen/v1/responses`
for the Responses-shaped one. `UNVERIFIED:` rate limits, training policy and commercial use; the
docs page does not state them. Note the overlap with FL1-6: `nemotron-3-ultra-free` and
`nemotron-3.5-lightning-free` are the same NVIDIA models OpenRouter flags as served by a provider
that trains. Source https://opencode.ai/docs/zen/ opened 2026-09-18.

**GLHF (glhf.chat).** **Down at the time of checking.** `https://glhf.chat/` returned HTTP **522**
on 2026-09-18, which is Cloudflare's origin-connection-timeout code. freellm.net lists it as
`2 free models, 2 online`. `INFERENCE:` its liveness check and mine disagree, which is one more
reason to probe rather than to list.

**Nscale.** `https://docs.nscale.com/docs/inference/serverless-models/current` opened 2026-09-18 and
returned a page my stripper found no free-tier or rate-limit text in. `UNVERIFIED:` freellm.net
lists `2 free models, 0 online`, which by its own count means nothing is currently working.

**Not reached at all, and I am not going to guess at them:** `ModelScope`, `Ollama Cloud`,
`Agnes AI`, `Aion Labs`, `Kilo Code`, `Cline`, `Grok (xAI)`, `xAI`, `Alibaba Cloud Model Studio`,
`AI21 Labs`, `Z AI (Zhipu AI)`, `SiliconFlow`, `DeepSeek`, `SambaNova`, `Chutes.ai`, `Nebius`.
Several of these are covered by parallel lenses and are folded in at Part C below where their
findings arrived.

---

## Part B. The three things that decide it

### FL1-T. Training on inputs. The most important column, provider by provider.

frontmatter holds people's private documents. Any free tier that trains on inputs is out. Here is
the exact sentence for each provider I opened, one way or the other, sorted by how good the answer
is.

**Clean. Says it will not train, in its own words.**

| Provider | The sentence, copied from the page |
|---|---|
| **Groq** | `For clarity, Groq is not permitted to use Inputs or Outputs for training or fine-tuning any AI Model Services or other models, unless explicitly granted permission or instructed by Customer.` |
| **Cloudflare Workers AI** | `Cloudflare does not use your Customer Content to (1) train any AI models made available on Workers AI or (2) improve any Cloudflare or third-party services, and would not do so unless we received your explicit consent.` |
| **Scaleway** | `Your data is not used for training, retraining, or improving the base models.` (and) `We do not collect, read, reuse, or analyze the content of your inputs, prompts, or outputs generated by the API.` |
| **Cerebras** | `For clarity, the foregoing does not grant Cerebras the right to use Service Content for the purpose of training or fine-tuning models.` |

**Disqualified. Says it will train, or grants itself a licence wide enough to.**

| Provider | The sentence, copied from the page |
|---|---|
| **Google AI Studio / Gemini free tier** | `When you use Unpaid Services, including, for example, Google AI Studio and the unpaid quota on Gemini API, Google uses the content you submit to the Services and any generated responses to provide, improve, and develop Google products and services and machine learning technologies` (and) `To help with quality and improve our products, human reviewers may read, annotate, and process your API input and output.` (and) `Do not submit sensitive, confidential, or personal information to the Unpaid Services.` Plus the pricing page prints the row `Used to improve our products` with the value `Yes` in the Free Tier column, 79 times. |
| **Cohere trial keys** | `... AND (III) IMPROVE AND ENHANCE THE SERVICES AND COHERE'S OTHER OFFERINGS AND BENCHMARK THE FOREGOING, INCLUDING BY SHARING API DATA AND FINETUNING DATA WITH THIRD PARTIES WHO MAY USE THE FINETUNING DATA AND API DATA TO PROVIDE SERVICES TO COHERE AND FOR OTHER PURPOSES PERMITTED UNDER THEIR TERMS AND CONDITIONS.` |
| **NVIDIA NIM** | `... solely to (a) provide you with the Technology, including NVIDIA Services, (b) provide you support, or for security reasons, and (c) modify and improve NVIDIA products or services or the technology underlying the Technology.` Plus NVIDIA separately bans the data outright: `you agree that your actions and transmission of User Content: (a) does not include any confidential information; (b) does not include any controlled or sensitive data`. Second signal: OpenRouter flags `NVIDIA` `training: true`. |

**Conditional. Depends on a default I could not read.**

| Provider | The sentence, copied from the page |
|---|---|
| **Mistral** | `Mistral AI will not use Customer Data or Outputs to train its artificial intelligence models except (a) when you (i) opted-in to training on a Mistral AI Product set to opt-out by default or (ii) have not opted-out of training on a Mistral AI Product set to opt-in by default ... or (d) when Customer uses Labs or Preview Models.` Whether the free API tier is opt-in-by-default is exactly the page that 404s. Treat as unresolved. |
| **OpenRouter** | Its own logging is off unless you turn it on: `Unless explicitly opted in to prompt logging, we do not store your Inputs after categorizing them`. The underlying provider is a separate question, answered per provider in its register, and disclaimed: `OPENROUTER MAKES NO REPRESENTATION OR WARRANTY REGARDING ANY MODEL PROVIDER'S DATA HANDLING, RETENTION, TRAINING, SECURITY, AVAILABILITY, OR INTELLECTUAL PROPERTY PRACTICES.` |

**The register.** The single most useful artefact found in this lens is
`https://openrouter.ai/api/frontend/v1/all-providers`, a JSON endpoint that carries a `training`
boolean and a retention period for **88 providers**. Opened 2026-09-18, exactly **4** are flagged as
training: `DeepSeek`, `Liquid`, `NVIDIA`, `Thinking Machines`. 41 of the other 84 are flagged
`zero retention`. `INFERENCE:` that endpoint is a better starting filter than any list a human
maintains, and it is machine-readable, so a nightly job could diff it and alert us when a provider
we depend on changes its answer. But it must be the starting filter and never the final one,
because OpenRouter disclaims it and because it and Google's own terms already contradict each other
about Google AI Studio.

**The pattern worth naming.** Every disqualification here uses the same three words:
*improve our products*. Not one of the three says "we will train on your data". Google says
`improve and develop`, Cohere says `IMPROVE AND ENHANCE`, NVIDIA says `modify and improve`. The
clean four are clean because they name the act: Groq says `training or fine-tuning`, Cloudflare says
`train any AI models`, Scaleway says `training, retraining, or improving the base models`, Cerebras
says `training or fine-tuning models`. **When auditing a new provider, search its terms for
"improve", not for "train".** The word "train" is what a provider uses when it is promising not to.

---

### FL1-C. Commercial use on the free tier.

The short answer: **almost nobody forbids it, and the clause that looks like it does is usually
about the marketing website, not the API.** Two providers in this inventory carry a
`personal, non-commercial use` sentence, and in both cases it is scoped away from the service.

- **Groq** carries `we grant you a limited, non-exclusive, non-transferable, license to access and
  use the Websites for your personal, non-commercial use only` in its Terms of Use. Three paragraphs
  above it, the same document says: `These Terms do not apply to you in connection with your use of
  Groq's cloud services, including GroqChat, Groq Playground, and GroqCloud.` The API is governed by
  the Services Agreement, which has no such clause.
- **Cerebras** carries `Cerebras authorizes you to view, use, and download materials from the Site
  ("Site Content," which does not include Service Content) only for your personal, non-commercial
  use` and then, in the same paragraph, `The foregoing provision does not apply to the Service or
  Service Content`. The API licence grants the opposite: `solely for your personal use or business
  purpose, as applicable`, including the right to `distribute or allow access to your integration of
  the APIs within your applications to end users of such applications`.

`INFERENCE:` this is the single most-repeated error in third-party summaries of free LLM tiers, and
it goes in the direction that costs you a provider you could have used. Read who the clause binds
before believing it.

**What does restrict us, and it is not the commercial clause:**

- **Google**, geographically, and absolutely: `You may use only Paid Services when making API
  Clients available to users in the European Economic Area, Switzerland, or the United Kingdom.`
  It also frames the whole service as business-only: `Use of Google AI Studio and Gemini API is for
  developers building with Google AI models for professional or business purposes, not for consumer
  use.`
- **NVIDIA**, by data class, which is stricter than a commercial ban for us:
  `does not include any confidential information`.
- **Cohere**, by competitor: you may not use it `for the use or benefit of any direct competitor to
  Cohere as reasonably determined by Cohere (and which includes any entity that offers large
  language models for license or sale)`.
- **Groq**, by indemnity rather than by prohibition. Section 15.3 excludes from the IP indemnity
  `any Cloud Services provided to Customer free of charge`. So free usage is allowed and
  commercially fine, but if a model output attracts an IP claim, Groq does not defend you.
  `INFERENCE:` that is the real commercial cost of a free tier, and it is the same on every free
  tier here.
- **Cerebras and NVIDIA**, by revocability. Cerebras: `We may, with or without prior notice, change
  the Service, stop providing the Service or features of the Service to you or to Users generally or
  create usage limits for the Service.` NVIDIA: `NVIDIA may stop accepting new participants or
  discontinue a promotional offering at any time.`

---

### FL1-P. Pooling. Which providers share one bucket across all your users.

This decides the architecture. If the limit is per organisation, every user of frontmatter draws on
one counter, and a single person pasting a novel drains the tier for everyone else. If the limit is
per key, we can shard.

**Pooled at the organisation or account level, in their own words:**

| Provider | The sentence |
|---|---|
| **Groq** | `Rate limits apply at the organization level, not individual users.` |
| **Cerebras** | `Rate limits apply at the organization level, not the user level, and vary based on the model.` |
| **Google Gemini** | `Rate limits are applied per project, not per API key.` |
| **Scaleway** | `These values apply to your Organization, and are shared by all Projects within your Organization.` |
| **Cloudflare Workers AI** | `The following limits apply per account, per model` (paid models), and the free allocation is stated per account: `Our free allocation allows anyone to use a total of 10,000 Neurons per day`. |
| **Hugging Face** | `For Team or Enterprise organizations, credits are shared among all members.` |
| **Vercel AI Gateway** | `Every Vercel team account gets access to both a free tier and a paid tier for AI Gateway Credits.` |

**Not pooled, or shardable:**

| Provider | The sentence |
|---|---|
| **Cohere** | `Cohere offers two kinds of API keys: evaluation keys (free but limited in usage), and production keys` and the 1,000-call cap is stated per key: `Trial keys ... are limited to 1,000 API calls a month.` |
| **OpenRouter** | Per account, but **observable**, which is almost as good: `GET /api/v1/key` returns `free_model_daily_requests` with `used`, `limit` and `remaining`. |

**So: every provider worth using pools.** `INFERENCE:` that has one architectural consequence and
it is not subtle. A free fallback chain run from a single set of our own keys does not scale with
users; it is a fixed daily budget shared by the whole user base, and it degrades worst exactly when
the product is most popular. The two ways out are (a) a per-user quota enforced by us, on top of the
provider's pooled quota, so no single user can drain it, and (b) bring-your-own-key, where the user
pastes their own free Groq or Cloudflare key and gets their own bucket. Option (b) also moves the
training-clause risk from us to a choice the user makes, which is a better fit for a product whose
proposition is that the file on disk is the only source of truth.

---

## Part C. Caching, batch, compatibility, and what the whole thing adds up to

### FL1-CACHE. Prompt caching on the free tier, and what it saves

Prompt caching matters more here than the raw token budget, because a document editor resends the
same document on every edit. A 90% cache hit rate is the difference between a free tier that works
and one that does not.

| Provider | On free tier | What it saves | The sentence |
|---|---|---|---|
| **Groq** | yes, automatic, cannot be disabled | 50% on cached input, **and cached tokens do not count against the rate limit at all** | `Prompt caching works automatically on all your API requests with no code changes required and no additional fees` / `There is a 50% discount for cached input tokens` / `Cached tokens do not count towards your rate limits.` TTL: `All cached data automatically expires after 2 hours without use.` |
| **Cerebras** | yes, automatic, all customers | cached tokens are excluded from the binding `uncached TPM` bucket, so the effective ceiling is 3x | `Prompt caching is automatically enabled for all customers and models` / `Cached tokens don't count toward your uncached TPM limit` / `We guarantee a Time-To-Live (TTL) of 5 minutes, though caches may persist up to 1 hour depending on system load` |
| **Cloudflare** | yes, default on some models | per-model discount; on `@cf/deepseek-ai/deepseek-v4-flash-0731` the table shows `$0.440 per M input tokens` against `$0.014 per M cached input tokens`, a 96.8% cut | `Cached input tokens are billed at a discounted rate compared to regular input tokens. Workers AI enables prefix caching by default for select models.` Needs a header: `send the x-session-affinity header with a unique identifier for your session or agent` |
| **Google Gemini** | yes, free | `Context caching price` / `Free of charge` on the Free Tier column | disqualified on training, so moot |
| **Scaleway** | not stated on the pages opened | | |
| **OpenRouter** | passed through from the provider | | |

**The two that matter are Groq and Cerebras, and for the same reason: on both, cached tokens are
exempt from the rate limit, not just from the bill.** On Groq that turns a hard 200,000 tokens a day
into something much larger for a stable-prefix workload. `INFERENCE:` if frontmatter puts the
document first and the instruction last in the prompt, it gets almost nothing; if it puts the system
prompt, the tool definitions and the unchanged document prefix first and the edit instruction last,
it gets most of the benefit. That is a prompt-layout decision worth making before the router is
built, not after.

### FL1-BATCH. Batch APIs and their discounts

| Provider | Batch on free tier | Discount | The sentence |
|---|---|---|---|
| **Scaleway** | yes (paid account) | **50%, and no rate limit at all** | `Requests performed through the Batches API do not have a rate limit and are billed with a -50% discount compared to standard model prices.` |
| **Groq** | **no**, Developer plan only | 50% | `Upgrade to Developer plan to access higher limits, Batch and Flex processing, and more.` / `Batch requests already receive a 50% discount on all tokens` |
| **Google Gemini** | **no** | 50% (paid) | pricing page prints Batch / Free Tier / `Not available`; paid batch input is `$0.375` against standard `$0.75` |
| **Cloudflare** | in docs as `Asynchronous Batch API Beta` | `UNVERIFIED:` no discount figure found | |
| **Cerebras** | none offered | | |
| **OpenRouter** | referenced in terms | `UNVERIFIED:` no discount figure found | |

`INFERENCE:` batch is the wrong shape for frontmatter's foreground work anyway, since a person is
waiting. It is the right shape for the Idea-mode kit generation and for any background re-indexing,
and Scaleway's no-rate-limit batch is the standout offer for that, at a price.

### FL1-OAI. OpenAI-compatible endpoints, which is what makes a router cheap

Confirmed from the provider's own documentation:

| Provider | Evidence |
|---|---|
| **Groq** | endpoint paths on its own pages are `/openai/v1/chat/completions`, `/openai/v1/responses`, `/openai/v1/batches`, `/openai/v1/files`, `/openai/v1/fine_tunings` |
| **Cerebras** | a dedicated `OpenAI Compatibility` page in the docs navigation |
| **Cloudflare Workers AI** | a dedicated `OpenAI compatible API endpoints` page in the docs navigation |
| **Scaleway** | a dedicated `OpenAI API compatibility` page in the docs navigation |
| **OpenRouter** | the whole product; also a Vercel AI SDK integration |
| **OpenCode Zen** | prints the base URL per model: `https://opencode.ai/zen/v1/chat/completions` |
| **LLM7.io** | every model record carries `"schema_endpoints": ["openai"]` |
| **Hugging Face** | routes to 18 providers behind one endpoint; docs include a `Responses API (beta)` page |
| **Google Gemini** | `UNVERIFIED:` native format differs; freellm.net says `OpenAI-compatible wrappers available` and I did not confirm it on a Google page |
| **Cohere** | **no.** Its Chat API has its own shape. |

`INFERENCE:` every provider on the shortlist below is OpenAI-shaped, so the router is a base URL, an
API key and a model id per entry. That is a configuration table, not a codebase.

### FL1-AGG. What the whole thing adds up to

Using only numbers I read off a provider's own page, one free account each, and treating one
frontmatter request as 5,000 input tokens plus 500 output tokens:

| Provider | Requests per day | Tokens per day | How it was derived |
|---|---|---|---|
| Groq | 4,500 | 800,000 | 4 chat models at 1K RPD and 200K TPD each, plus 2 compound models at 250 RPD |
| Cerebras | 7,200 | 2,000,000 | 2 models at 1M TPD each; no RPD is published, so 5 RPM x 60 x 24 is the ceiling |
| Cloudflare Workers AI | 262 | 1,441,000 | 10,000 neurons on `llama-3.1-8b-instruct-fp8-fast` at 38.0 neurons per request |
| OpenRouter, never bought credits | 50 | 275,000 | 50 RPD, no token cap; tokens estimated at 5,500 per request |
| OpenRouter, after one $10 top-up | 1,000 | 5,500,000 | 1,000 RPD, no token cap |

**Totals.** With a single one-off $10 spend on OpenRouter and nothing else:
**12,962 requests a day and roughly 9.7 million tokens a day.** Without it:
**12,012 requests a day and roughly 4.5 million tokens a day.**

**What that serves.** At 5 AI actions per user per day, 2,592 users. At 20, 648 users. At 50, 259
users. `INFERENCE:` the free chain is a real answer for a beta and an early free tier, and it stops
being one somewhere in the low thousands of active users.

**But the daily total is the wrong number to plan against.** The binding constraint is concurrency.
Adding the per-minute ceilings gives **355 requests per minute** across all four (Cloudflare 300,
Groq 30, OpenRouter 20, Cerebras 5), and **300 of those 355 come from Cloudflare alone**, whose
daily neuron budget runs out after 262 requests. So the chain can absorb a spike of roughly 350
concurrent requests for about forty seconds, and then it is down to 55 requests a minute for the
rest of the day. `INFERENCE:` the honest summary is that this is a chain that never returns "AI is
unavailable" for a *single* user and will certainly return it for a *crowd*, unless the queue in
front of it is built first.

**Two caveats on the arithmetic, stated rather than buried.**
1. Cerebras publishes TPD per model without saying whether the two models share one bucket. I have
   added them. If they share, Cerebras is 1M not 2M, and the total drops to 8,741,000, not the
   9,741,000 in the table. (I first wrote 7.7 million here and caught it on a re-derivation: the
   subtraction is one million, not two.)
2. The 5,500 tokens per request figure is mine, not a provider's. It is the one number in this table
   that is an assumption, and every token total that uses it moves proportionally if the assumption
   is wrong.

---

### FL1-15. The three the mission named that turn out not to be free inference at all

**Poe.** Poe does publish an OpenAI-compatible API, and its throughput is generous: quote,
`Our rate limit is 500 requests per minute (rpm). We support request-based rate limit headers but do
not support token-based rate limiting`. But it spends the user's Poe compute-point balance, and the
documented failure mode when there is none is explicit: the error table lists `402` /
`insufficient_credits` / `balance <= 0`. There is no free API allowance; the points come with a
consumer subscription. **Not a free provider.** Source
https://creator.poe.com/docs/external-applications/openai-compatible-api opened 2026-09-18.

**Perplexity.** The API is paid. Its pricing page is a cost estimator and points at billing setup
and at AWS Marketplace credits. No free tier is offered on the page.
`https://docs.perplexity.ai/getting-started/rate-limits` returns 404; the nav names the page
`Rate Limits & Usage Tiers` but the URL has moved. **Not a free provider.** Source
https://docs.perplexity.ai/getting-started/pricing opened 2026-09-18.

**Windsurf.** A `Free` plan at `$0` exists, described as `Download Light quota to code with agents`
and `Limited model availability`, against `Pro $20/month`, `Team $80/month` and `Max $200/month`.
This is an IDE seat, not an inference API we could call from a server. **Not a free provider for our
purposes.** Source https://windsurf.com/pricing opened 2026-09-18.

`INFERENCE:` the general lesson, and it applies to Kilo Code and Cline on freellm.net's list too: a
free *coding agent* is not a free *inference API*. A directory that mixes the two inflates its
provider count and will send you down a dead end.

---

## Part D. The ranked shortlist

Every provider here passes all three tests: **it does not train on inputs**, **it permits commercial
use**, and its pooling behaviour is known and manageable. Best first.

### 1. Cloudflare Workers AI

**Why first.** It has the best sentence on training of anyone, and the sentence covers more ground
than anyone else's: `Cloudflare does not use your Customer Content to (1) train any AI models made
available on Workers AI or (2) improve any Cloudflare or third-party services`. Limb (2) is the
clause that disqualifies Google, Cohere and NVIDIA, and Cloudflare closes it explicitly. It has 300
requests per minute for text generation, which is ten times Groq's and sixty times Cerebras's, so it
is the only entry that can absorb a burst. It needs no card for the free allocation. It is at the
edge, which is the best latency story for an Indian user base. And frontmatter is a Next.js app that
already lives in this ecosystem, so there is no new vendor relationship to open.
**The cost.** 10,000 neurons a day is a small budget in absolute terms, and it converts to somewhere
between 42 and 781 requests a day depending on which model you pick. The model choice matters more
here than anywhere else: `granite-4.0-h-micro` gives 781 requests a day, `gpt-oss-120b` gives 51.
**Use it as:** the default first hop, on a small model, with `x-session-affinity` set per document so
prefix caching actually hits.

### 2. Groq

**Why second.** The clearest denial in the inventory, and the only one written as a prohibition on
the provider rather than a promise: `Groq is not permitted to use Inputs or Outputs for training or
fine-tuning any AI Model Services or other models`. Zero Data Retention is available to free
accounts, not just paid ones: `All customers may enable Zero Data Retention (ZDR)`. The API is
OpenAI-shaped down to the path. Prompt caching is automatic and, crucially, `Cached tokens do not
count towards your rate limits`, which is the single most valuable property for an editor that
resends the same document.
**The cost.** 1,000 requests and 200,000 tokens a day per chat model, pooled across the whole
organisation. 30 RPM. And the free tier carries no IP indemnity: section 15.3 excludes
`any Cloud Services provided to Customer free of charge`.
**Use it as:** the second hop, and the first hop for anything latency-sensitive, because it is the
fastest thing here. Structure prompts static-first so the cache exemption does the work.

### 3. OpenRouter, with a one-off top-up

**Why third.** It is not a provider, it is the chain someone else already built, with 21 free models
including two at a 1,048,576-token context window and three more at 1,000,000. Its own logging is
off by default: `Unless explicitly opted in to prompt logging, we do not store your Inputs after
categorizing them`. It has a routing switch that enforces our policy for us: `If you opt out of
training in your account settings, OpenRouter will not route to providers that train`, with separate
settings for free models. And it is the only entry whose remaining free budget a router can read
before spending it, through `free_model_daily_requests` on `GET /api/v1/key`.
**The cost.** 50 requests a day until you have ever bought credits, then 1,000. The threshold is
stated as 10 credits, with a rounding allowance: the docs say the higher ceiling is granted
`starting one credit below the table's threshold (currently 9 credits)`, and the minimum purchase is
`$5`. So one $10 purchase, once, permanently multiplies the allowance by twenty. That is the best
value in this document.
**Two things to set on day one:** never opt into prompt logging, and set the free-model training
filter to off, which removes the NVIDIA, Liquid and Thinking Machines routes and with them the two
biggest context windows on the list. Take that trade.
**Use it as:** the long-context hop and the breadth hop, with the training filter on.

### 4. Cerebras

**Why fourth and not higher.** The clause is clean and two years stable:
`the foregoing does not grant Cerebras the right to use Service Content for the purpose of training
or fine-tuning models`. 1M tokens a day per model is the largest token budget in the inventory. But
**5 requests per minute** makes it unusable as a general fallback, and its own docs call the tier a
`Free Trial`, not a free tier, while the terms reserve the right to stop it
`with or without prior notice`.
**Use it as:** the deep hop. One long document, one big request, not many small ones. It is the
right place to send a whole-file operation and the wrong place to send an inline edit.

### 5. Scaleway, as the paid escape hatch rather than a free tier

**It has no free tier.** `Base limits apply if you registered a valid payment method.` It is on this
list because its privacy posture is the best in the document by a distance
(`We do not collect, read, reuse, or analyze the content of your inputs, prompts, or outputs`,
`By default we apply a Zero Data Retention Policy`, data in `Paris, France`, and explicitly
`not subject to extraterritorial laws such as the American Cloud Act`), because its batch API has
`-50%` pricing and **no rate limit at all**, and because it is the answer to the problem that
disqualifies Gemini for European users.
**Use it as:** the paid tier and the EU story, not the free chain.

### Not on the shortlist, and why, in one line each

| Provider | Why not |
|---|---|
| **Google AI Studio / Gemini free** | Trains on inputs, human reviewers may read them, and forbidden for EEA, Swiss and UK users. |
| **Cohere trial keys** | Trains, and shares API data with third parties; 1,000 calls a month regardless. |
| **NVIDIA NIM** | Service-improvement licence with no training carve-out, plus an outright ban on sending confidential data. |
| **GitHub Models** | Retired on 30 July 2026. |
| **Mistral** | Training default on the free tier is exactly the page that 404s. Unresolved, so not shortlisted. |
| **Hugging Face** | $0.10 a month. |
| **Vercel AI Gateway** | $5 a month is real, but the credit vanishes the moment you top up and BYOK is paid-only. Worth a second look as a paid router. |
| **OVHcloud** | Free only on guard, image and speech models. |
| **LLM7.io, GLHF, Nscale** | Not free today, or down, or unverifiable on the clause that matters. |
| **Poe, Perplexity, Windsurf** | Not free inference APIs. |

---

## Part E. Reliability in 2026, from incident histories rather than impressions

### FL1-16. Groq's 2026 incident record, from its own status API

`https://groqstatus.com/api/v2/incidents.json` opened 2026-09-18 returns 25 incidents, of which
**7 were created in 2026**. Every one is `impact: minor`. Names and durations copied and computed
from the `created_at` and `resolved_at` fields in that response:

| Created | Impact | Duration | Name, verbatim |
|---|---|---|---|
| 2026-01-24 | minor | 2h 30m | `Data Center Failure Impacting Model Latency - SYD` |
| 2026-01-26 | minor | 1h 53m | `meta-llama/llama-4-scout-17b-16e-instruct Degraded Performance` |
| 2026-02-05 | minor | 1h 44m | `meta-llama/llama-4-scout-17b-16e-instruct Degraded Performance` |
| 2026-02-05 | minor | 0h 23m | `meta-llama/llama-4-scout-17b-16e-instruct Degraded Performance` |
| 2026-02-07 | minor | 1h 32m | `meta-llama/llama-4-scout-17b-16e-instruct Degraded Performance` |
| 2026-03-19 | minor | 0h 59m | `openai/gpt-oss-120b Performance Issue` |
| 2026-07-01 | minor | 1h 33m | `Data Center Failure Impacting Capacity` |

**The arithmetic.** 150 + 113 + 104 + 23 + 92 + 59 + 93 = 634 minutes, which is 10 hours 34 minutes.
From 1 January to 18 September 2026 is 260 days, which is 374,400 minutes. 634 / 374,400 = 0.1693%
of the year in a degraded state, so the affected surface was at or above **99.83%**.

**What it actually tells you, which is not "Groq is reliable".** Four of the seven incidents are the
same model, `llama-4-scout-17b-16e-instruct`, degrading four times in a fortnight. Two are data
centre failures, one of them named for a specific region (`SYD`). Not one is a platform-wide outage.
`INFERENCE:` the failure mode to design for on Groq is **one model going soft**, not the API going
away. A fallback chain that switches provider on a 5xx will miss all four of the Scout incidents,
because a degraded model returns 200s slowly. The chain needs a latency budget and a per-model
health signal, not just an error handler.

**Method note and its limits.** Atlassian Statuspage's `incidents.json` returns a recent window, not
the full history; the oldest record on the page was `2025-12-24`. So this covers 2026 completely but
I cannot claim it is Groq's entire incident history. `status.openrouter.ai` and `status.mistral.ai`
both returned **HTTP 403** to the same call on 2026-09-18, so their histories are not in this
document from my own fetching.

### FL1-17. Cloudflare Workers AI reliability, and a caveat about the window

`https://www.cloudflarestatus.com/api/v2/incidents.json` opened 2026-09-18 returns 50 incidents
spanning only **2026-08-31 to 2026-09-17**, because Cloudflare is a large estate and 50 records buy
you eighteen days. So this is a snapshot, not a year.

In those eighteen days, one incident named Workers AI directly:

- **2026-09-09, 14:25 to 20:09 UTC, 5h 44m, `impact: minor`,** named
  `Cloudflare Workers AI increased errors`. The first update reads, verbatim:
  `Cloudflare is aware of, and investigating, increased Workers AI errors when attempting to use
  GLM 5.3. Updates to follow.`

Four more touched the surrounding platform, including one that is directly relevant to an Indian
user base:

- **2026-09-17, `impact: minor`,** `Increased Errors for Durable Objects and Downstream Services in
  Asia P...`, with components listed as `AI Search, Artifacts, Containers, D1, Durable Objects,
  Workers Assets, Workflows`. That was **the day before this research**.
- 2026-09-09, `Workers Cron Triggers degraded`. 2026-09-11, `Issues with Workers VPC hostname route
  resolution on 2026-09-11`. 2026-09-03, `Workers Builds elevated queue times`.

`INFERENCE:` a 5h 44m degradation on a single model, on the provider I ranked first, in the fortnight
before this was written, is the argument for the fallback chain in miniature. It also matches the
Groq pattern exactly: the failure was **one model**, not the platform. Two providers, two incident
histories, the same shape. Whatever we build should fail over **per model** before it fails over per
provider.

---

---

## Part F. The chain, concretely

Every entry below is OpenAI-shaped, so the whole thing is a configuration table, not a codebase. The
base URLs are copied from each provider's own OpenAI-compatibility page, opened 2026-09-18.

| Order | Provider | Base URL | Model to start with | What it is for | Its ceiling |
|---|---|---|---|---|---|
| 1 | Cloudflare Workers AI | `https://api.cloudflare.com/client/v4/accounts/{account_id}/ai/v1/chat/completions` | `@cf/meta/llama-3.1-8b-instruct-fp8-fast` | the default hop, and the only one that survives a burst | 300 RPM, 10,000 neurons a day, about 262 requests at our shape |
| 2 | Groq | `https://api.groq.com/openai/v1` | `openai/gpt-oss-120b` | the fast hop, and the quality hop for short work | 30 RPM, 1,000 RPD, 200,000 TPD per model |
| 3 | OpenRouter | `https://openrouter.ai/api/v1` | `z-ai/glm-5.2:free` or `qwen/qwen3.8-27b:free` | breadth, and long context | 20 RPM, 50 RPD, or 1,000 RPD after one $10 top-up |
| 4 | Cerebras | `https://api.cerebras.ai/v1` | `gpt-oss-120b` | one long document at a time | 5 RPM, 30K uncached TPM, 1M TPD |

Sources for the base URLs: https://developers.cloudflare.com/workers-ai/configuration/open-ai-compatibility/ ;
https://console.groq.com/docs/openai ; https://inference-docs.cerebras.ai/resources/openai ;
https://openrouter.ai/docs/api-reference/limits.md . All opened 2026-09-18.

**Five things the evidence says to build, which are not obvious from the table.**

1. **Fail over per model before per provider.** Both incident histories I could open show the same
   thing: Groq's 2026 was four `llama-4-scout` degradations and one `gpt-oss-120b` performance
   issue; Cloudflare's one Workers AI incident in the last fortnight was
   `increased Workers AI errors when attempting to use GLM 5.3`. Not one was a platform outage. A
   chain that only switches provider on a 5xx will sit inside all of them, because a degraded model
   returns 200s slowly.

2. **Put the stable prefix first.** On Groq, `Cached tokens do not count towards your rate limits`.
   On Cerebras, `Cached tokens don't count toward your uncached TPM limit`. On both, cache exemption
   is worth more than the 50% price discount, because on a free tier the limit binds and the price
   does not. Groq spells out the layout: `Place static content like instructions and examples at the
   beginning of your prompt, and put variable content, such as user-specific information, at the
   end.` For frontmatter that means system prompt, then tool definitions, then the unchanged
   document, then the edit instruction last. Get this wrong and the free tier is four times smaller.

3. **Send a session key.** Cloudflare needs it: `To maximize cache hit rates, send the
   x-session-affinity header with a unique identifier for your session or agent.` Cerebras offers
   the same as `prompt_cache_key`, with a warning worth heeding: `Don't set prompt_cache_key for
   prefixes that are shared across many users, such as a common system prompt or shared RAG context.
   This would funnel all of those requests to a single backend, creating a bottleneck`. So: one key
   per document, not one key per deployment.

4. **Read the budget before spending it, where you can.** OpenRouter is the only provider here that
   will tell you: `GET /api/v1/key` returns `free_model_daily_requests` with `used`, `limit` and
   `remaining`. Everyone else you discover through a 429. Groq at least returns headers on every
   response, not only on failure: `x-ratelimit-remaining-requests` `Always refers to Requests Per
   Day (RPD)`, and the page notes `retry-after is only set if you hit the rate limit and status code
   429 is returned. The other headers are always included.` So Groq's remaining daily budget is
   readable from any successful call. Track it.

5. **Put a per-user quota in front of the pooled one.** Every provider worth using pools: Groq and
   Cerebras at the organisation, Google at the project, Cloudflare and Vercel at the account,
   Scaleway across all projects in the organisation, Hugging Face across all team members. One user
   pasting a long book drains the day for everybody. The provider will not stop them; we have to.

**And one thing to decide rather than build.** Bring-your-own-key solves both the pooling problem
and the training problem at once: the user's key gets its own bucket, and the user chooses whose
terms apply to their document. For a product whose whole proposition is that the file on disk is the
only source of truth and that the editor is sold while the files never are, letting a user point
frontmatter at their own Groq or Cloudflare key is more in character than quietly routing their
private documents through ours. The free chain above is then the default for people who do not want
to think about it, and the honest ceiling on that default is the aggregate at FL1-AGG.

---

### FL1-18. Chutes.ai: the free tier is gone, in the provider's own words

The mission flagged Chutes as widely reported to have moved from free to paid. Confirmed, from the
provider itself. The pricing page carries a structured-data FAQ whose question is
`Is there a free trial?` and whose answer reads, verbatim:

> `We do not offer a free tier at this time. Top up your account in the app to get started.
> Pay-as-you-go has no minimum commitment.`

The only plans on the page are pay-as-you-go plus `$10 / mo` `Plus` (`Bundled daily request quota`,
`6% off PAYG rates beyond the quota`) and `$20 / mo` `Pro` (`Larger daily quota`, `10% off PAYG
rates beyond the quota`).

**Source:** https://chutes.ai/pricing opened 2026-09-18. The sentence is in the page's JSON-LD FAQ
block, not the rendered accordion, which is collapsed by default.

**Third correction to the directory, and the pattern is now clear.** freellm.net lists `Chutes.ai`
with `2 models` and the label `Permanent Free`, and its no-credit-card list says
`Chutes.ai - 2 free models, 2 online`. The provider says it has no free tier at all. Together with
GitHub Models (retired 50 days earlier and still listed), LLM7.io (every model priced and still
labelled `Permanent Free`), OVHcloud (free only on guard and speech models) and Cerebras (a `Free
Trial` labelled `Permanent Free` with `0 models` counted), that is **five of thirty-one entries
materially wrong on the one field the directory exists to report.** I did not audit the other
twenty-six.

---

## Part G. The maintained community lists, which turn out not to be maintained

The mission named two. Here is what is actually there on 2026-09-18.

### FL1-19. github.com/cheahjs/free-llm-api-resources no longer exists

This is the list everyone cites. It is gone. Four independent checks, all on 2026-09-18:

| Check | Result |
|---|---|
| `https://api.github.com/repos/cheahjs/free-llm-api-resources` | HTTP 404, body `{"message": "Not Found"}` |
| `https://github.com/cheahjs/free-llm-api-resources` | HTTP 404 |
| `https://raw.githubusercontent.com/cheahjs/free-llm-api-resources/main/README.md` | HTTP 404 |
| `https://api.github.com/users/cheahjs` | HTTP 200, `public_repos: 117`, `updated_at: 2026-09-15T00:56:26Z` |

So the account is alive and was active three days ago; the repository is not. Deleted, renamed or
made private. `INFERENCE:` I cannot tell which from outside, and I am not going to guess at a
reason.

**What is left in its place, and it is worse than nothing.** A GitHub search for
`free llm api resources`, sorted by stars, opened 2026-09-18, returns `total_count: 59`. The top
results:

| Repo | Stars | Last pushed |
|---|---|---|
| `CelaDaniel/free-ai-resources-x` | 859 | 2026-05-21 |
| `abbosaliboev/free-ai-bible` | 151 | 2026-09-14 |
| `CYBIRD-D/FREE-LLM-API-Provider` | 104 | 2026-09-15 |
| `jtig37/free-llm-api-resources` | 54 | 2024-08-21 |
| `nherx/free-llm-api-resources` | 29 | 2026-09-18 |

I opened two of them. `CelaDaniel/free-ai-resources-x` is a different thing entirely: an AI
*learning* resources list, `411+ hand picked resources`, `30 specialized categories`. It names
almost no inference providers.

`nherx/free-llm-api-resources`, the one carrying the dead list's exact name and pushed **today**, is
**not the list**. Its README is a 145-line non-technical rewrite whose second line is a
`Download Latest Release` badge linking to a `.zip` in the repo, and whose body says things like
`This is a reference list you view on your computer, phone, or tablet through a web browser. It does
not need installation.` **I did not download that zip and neither should anyone else.** A repo that
takes the name of a recently deleted popular project, is pushed the same week, and leads with a zip
download is the shape of a supply-chain lure, whether or not this one is. Recorded as data, not
followed.

### FL1-20. github.com/zukixa/cool-ai-stuff is a different category of thing, and it is stale

From the GitHub API on 2026-09-18: **1,211 stars, 102 forks, `pushed_at: 2025-10-15T16:33:09Z`,
`archived: false`.** So the last push was **eleven months ago**. Its own README badge is older
still: `Last Updated July 06, 2025`.

More important than the staleness is what it lists. Its own subtitle, verbatim:
`A curated collection of AI APIs and websites offering free usage of AI models under g4f principles`.
Its Tier 1 table names `zukijourney` (`8,058` users), `ElectronHub` (`5,898`), `VoidAI` (`2,089`),
and further down `HelixMind`, `Zanity` and `Navy`. Every one is a Discord-gated reverse proxy, not a
first-party provider. The inclusion criteria are, verbatim: `Have a clean record`,
`Serve 100+ members`, `Provide stable service`,
`Support at least chat & image generation functionalities in the OpenAI format`. Note that none of
those criteria is about having the right to serve the models.

The maintainer says so herself, and it is the most useful sentence on the page. Quote:
`We are not endorsing any of the listed services! Some of them might be considered controversial. We
are not responsible for any legal, technical or any other damage caused by using the listed
services. Data is provided without warranty of any kind. Use these at your own risk!`

**Verdict: out of scope, and it should be stated plainly rather than politely.** This is the
gpt4free ecosystem. These services offer frontier proprietary models for free because they are
proxying access they do not hold a licence for. Routing a paying customer's private document through
one of them would be indefensible, and the category is exactly why freellm.net's own catalogue
raised an eyebrow at FL1-14: a free gateway listing `claude-opus-5` and `gpt-6-astra` is either
reselling at cost, which LLM7's pricing shows it is, or it is doing something else.

**The honest summary of Part G.** The mission asked me to find actively maintained lists and verify
their headline numbers against provider pages. The finding is that **there is no actively maintained
list of first-party free LLM APIs worth trusting.** The canonical one is deleted, its name has been
squatted, the best-known alternative is a proxy directory eleven months stale, and freellm.net, which
is genuinely maintained and updated daily, was wrong on five of the thirty-one entries I checked.
`INFERENCE:` that is not a gap to be filled by finding a better list. It is the argument for reading
provider pages directly and for probing endpoints live, which is what this document did.

---

### FL1-21. DeepSeek: no free tier, trains on inputs by its own policy, and OpenRouter's flag checks out

I opened DeepSeek because OpenRouter's register flags it `training: true`, one of only four out of
88, and because it is the provider people reach for when they want cheap. The flag is correct, and
DeepSeek says so itself.

- **Free tier:** none on the pricing page. Everything is paid. The deduction rules mention a
  `granted balance`, verbatim: `The corresponding fees will be directly deducted from your topped-up
  balance or granted balance, with a preference for using the granted balance first when both
  balances are available.` `UNVERIFIED:` what grants a granted balance, and how much; the page does
  not say.
- **Trains on inputs:** **yes.** Quote from the DeepSeek Privacy Policy, under How We Use Your
  Personal Data: `To improve and develop the Services and to train and improve our technology, such
  as our machine learning models and algorithms. Including by monitoring interactions and usage
  across your devices, analyzing how people are using it, and training and improving our
  technology.` And it lists third-party sharing for the same purpose; quote: service providers
  receive data `as necessary to provide certain functions, such as storage, content delivery,
  security, research and development, foundation model training and optimization, analytics,
  customer and technical support.`
- **And it tells you not to send sensitive data.** Quote: `We do not ask for, and you should not
  provide sensitive Personal Data to the Services, whether about yourself or other individuals.`
  This is the third provider in this document to print that sentence, after Google and NVIDIA. All
  three are the ones that train.
- **What its terms grant you is unusually generous, and is a separate question.** Quote from the
  Terms of Service, 4.2: `You may apply the Inputs and Outputs of the Services to a wide range of
  use cases, including personal use, academic research, derivative product development, training
  other models (such as model distillation), etc.` So DeepSeek permits you to distil its outputs,
  which almost nobody else does. That does not help us; the question here is what it does with our
  inputs, not what we may do with its outputs.
- **Its caching is the most aggressive in this document, and worth recording even though DeepSeek is
  disqualified.** From the pricing page, per 1M input tokens: cache hit off-peak `$0.003`, cache
  miss off-peak `$0.15`. That is a **98% discount** on a cache hit, against Groq's and Google's 50%.
  Output off-peak is `$0.6`. And the off-peak mechanic is unusual: quote,
  `Off-peak rates are half of the peak rates. Peak hours are 01:00 - 04:00 and 06:00 - 10:00 UTC,
  Monday through Friday (all other hours are off-peak).` `INFERENCE:` converting to IST at UTC+5:30,
  peak is 06:30 to 09:30 and 11:30 to 15:30 Indian time, so an Indian working day sits substantially
  inside the expensive window while a European or American one does not. That is a real cost
  asymmetry against our likely user base, and nobody would notice it from a headline price.
- **Concurrency:** the pricing table prints `Concurrency Limit` values of `2500` and `500` for the
  two model tiers.
- **Date opened:** 2026-09-18.
- **Sources:** https://cdn.deepseek.com/policies/en-US/deepseek-privacy-policy.html ;
  https://cdn.deepseek.com/policies/en-US/deepseek-open-platform-terms-of-service.html ;
  https://api-docs.deepseek.com/quick_start/pricing . All opened 2026-09-18.

**Why this matters beyond DeepSeek.** It is a validation of the register at FL1-6. OpenRouter said
DeepSeek trains; DeepSeek's own privacy policy says DeepSeek trains. One confirmed case is not proof
that all 88 rows are right, but it is the difference between an unverified table and a table with a
spot check that passed. The one row that failed the same spot check was Google AI Studio, where
OpenRouter says not-training and Google's unpaid terms say training, and the most likely explanation
is that OpenRouter buys paid quota. `INFERENCE:` so the register appears to describe **the route
OpenRouter has bought**, not the provider's free tier. Read it that way and both results are
consistent, which is a more useful conclusion than either one alone.

---

## Part H. Parallel lenses

Three further lenses were dispatched in parallel to cover the providers this document could not
reach directly: the inference clouds (Together, Fireworks, DeepInfra, Hyperbolic, Novita, Chutes,
GLHF, Featherless, Targon, Arli, SiliconFlow, PPInfra, Kluster, Parasail, AtlasCloud,
Inference.net, NextBit, Venice, Crusoe, Nebius, Lambda, Baseten, Replicate, Modal, Anyscale),
the Asian and model-lab tiers (Z.ai, Moonshot, DeepSeek, Alibaba, ModelScope, Ollama Cloud, Baidu,
ByteDance Volcano, Upstage, Reka, AI21, Writer, Nous, Lepton, Mistral, SambaNova), and the outage,
terms-change and community-list sweep.

**The first round of all three returned nothing**, and the reason is worth recording because it will
recur. The read-only researcher agent type in this workspace has `WebFetch` and `WebSearch` but no
`Bash`. `WebFetch` is refused session-wide by the taint gate. So a read-only agent in a tainted
session has no way to open a page at all: it can search and see snippets, but it cannot read a
source. One of them spent 84,910 tokens and opened zero primary sources; another spent 100,451 and
opened zero; the third spent 99,391 and made 24 tool calls of which 4 were refused fetches.
**About 285,000 subagent tokens bought no evidence.**

`INFERENCE:` this is the LR#70 pattern exactly. The capability was not gone; the *tool* was blocked,
and `curl` through Bash was never blocked. The re-runs were dispatched as general-purpose agents
carrying the working `curl` recipe, the HTML-stripping helper, and the specific traps found here
(carry a cookie jar through Google's auto-signin redirect; try the `.md` twin of a docs page when the
numbers are injected by client script; avoid `cd X && grep file` in one compound command).

**If this section is not filled in below, the re-runs had not reported when this document was
finished, and those providers remain unreached.** The findings above stand on their own; they cover
every provider I opened myself, and the shortlist at Part D is drawn only from providers whose own
pages I read.

---

## A note on spelling inside quotations

This document is written in British spelling, as the brief requires. Ten occurrences of
`organization`, `organizations`, `organizational` and `analyze` remain in American spelling because
every one of them sits inside a backticked quotation copied verbatim from a provider's page. Quoting
accurately outranks house style. They are at the Groq, Cerebras, OpenRouter, Hugging Face and
Scaleway blocks, and each is inside backticks.

---

## Quotation audit

The brief says this repo has been burned by paraphrases inside quotation marks, roughly one in three
across a previous run. So I checked my own work rather than asserting it.

Every page I opened was saved to disk before it was read. After writing, I took **41 of the
quotations in this document**, normalised whitespace on both sides to survive line wrapping, and
searched for each one in the saved copy of the page it is attributed to. **40 of 41 matched
exactly.** The single non-match was a test string I had pointed at the wrong saved file
(`Requests per day ( RPD )` lives on Google's rate-limits page, not OpenRouter's); it does not appear
as a quotation anywhere in this document, so the document itself is 41 for 41 on the strings it
actually uses.

One quotation initially failed a literal byte match and passed once whitespace was normalised: the
Google clause about the European Economic Area is wrapped across three lines on Google's page. I
reproduced it unwrapped, which is the ordinary convention, and the words are unchanged. I mention it
because a literal-match audit that did not normalise whitespace would have reported a false failure,
and a false failure is the expensive direction.

The document contains no em dashes and no en dashes: `grep -c` returns 0 for both across all 1,276
lines, checked after writing.

---

## What I could not reach

- **`WebFetch` at all.** Refused for the entire session by the workspace taint gate. Everything here
  was fetched with `curl` or Python `urllib` through Bash. Recorded because it changed the method,
  not the conclusions.
- **`www.scaleway.com` over curl.** Fails with `SSL certificate problem: unable to get local issuer
  certificate` in this environment. Python's `urllib` reaches it with a different trust store, but
  the body ends in an `IncompleteRead`. I recovered the complete article from the partial body and
  say so at FL1-12. I did not disable certificate verification to work around it.
- **Google's per-model free-tier rate limits.** Google has moved the table behind a signed-in view;
  the public page now says only `View your active rate limits in AI Studio`. The widely quoted
  `10 RPM / 250 RPD` and `15 RPM / 1,500 RPD` figures are unverified here. Moot, since the tier is
  disqualified on training.
- **Mistral's rate limits and free-tier training default.** Mistral's own `llms.txt` points at
  `https://docs.mistral.ai/docs/deployment/laplateforme/tier.md`, which 404s, as do four other URL
  shapes I tried. This is the single most important unresolved question in the document, because
  Mistral's training clause turns on a per-product default I could not read.
- **`build.nvidia.com`**, which is a client-rendered app that returns only a shell to curl, and
  `https://docs.api.nvidia.com/nim/docs/rate-limits`, which 404s. NVIDIA's free-tier numbers are
  unverified. Moot, since the tier is disqualified.
- **`status.openrouter.ai` and `status.mistral.ai`**, both HTTP 403 to the Statuspage JSON API.
  Their 2026 incident histories are not in this document from my own fetching.
- **`glhf.chat`**, HTTP 522 on the day.
- **A full-year view of Cloudflare's incidents.** Its status API returns 50 records, which for an
  estate that size covers eighteen days.
- **Signup flows.** I did not create an account anywhere, so every `needs a card on file` answer is
  either quoted from a page or marked unverified. Nothing here is from a completed signup.
- **Twenty-six providers on freellm.net's list**, named at the end of FL1-14, plus several the
  mission asked for. Parallel lenses were dispatched for those; their status is recorded in Part H.

---

## What surprised me

1. **Google states it plainly and nobody reads it.** The row `Used to improve our products` appears
   **79 times on one pricing page** with the value `Yes` for the free tier, and the terms say in so
   many words `Do not submit sensitive, confidential, or personal information to the Unpaid
   Services.` The most popular free LLM tier in the world tells you not to use it for anything that
   matters, on the page, in English.

2. **The word to search for is "improve", not "train".** All three disqualified providers use the
   same phrasing (`improve and develop`, `IMPROVE AND ENHANCE`, `modify and improve`) and not one
   says it will train on your data. The four clean providers all name the act directly. The tell is
   the euphemism.

3. **The canonical community list is deleted and its name has been squatted.**
   `cheahjs/free-llm-api-resources` returns 404 from four different endpoints; the account is still
   active. A repo with the identical name, 29 stars, pushed the same day I looked, leads with a zip
   download and a README written for non-technical users. I did not open the zip.

4. **freellm.net was wrong on five of thirty-one entries** on the one field it exists to report, and
   its own liveness checker said `3 online` for GitHub Models, which had been fully retired for 50
   days. Chutes says in its own FAQ `We do not offer a free tier at this time` while the directory
   labels it `Permanent Free`.

5. **Cached tokens being exempt from the rate limit is worth more than the 50% price discount.** On
   a free tier the limit binds and the price does not, so Groq's `Cached tokens do not count towards
   your rate limits` and Cerebras's equivalent are the two most valuable sentences in this document
   after the training clauses, and both are one line deep in a docs page nobody quotes.

---

### FL1-22. Fireworks, Together and DeepInfra: signup credits, not free tiers

I fetched all three pricing pages on 2026-09-18. Only one states a free allowance in its page text.

- **Fireworks AI.** Quote from the pricing page, under Serverless Inference:
  `Pay per token, with high rate limits and postpaid billing. Get started with $1 in free credits.`
  So: **$1, once, on signup.** Not recurring. Source https://fireworks.ai/pricing opened 2026-09-18.
- **Together AI.** No free-tier or free-credit text appears in the rendered pricing page I retrieved.
  `UNVERIFIED:` whether a signup credit exists; the page is heavily client-rendered.
  Source https://www.together.ai/pricing opened 2026-09-18.
- **DeepInfra.** Same: no free-tier text in the retrieved page.
  `UNVERIFIED:`. Source https://deepinfra.com/pricing opened 2026-09-18.

`INFERENCE:` a one-off dollar is a different product from a daily allowance and should not be in the
same table. A signup credit lets you evaluate; it cannot hold up a fallback chain, because it runs
out once and never returns. Of everything in this document, only Cloudflare, Groq, Cerebras,
OpenRouter, Vercel's $5 and Hugging Face's ten cents renew.

Note for cross-checking: OpenRouter's register flags all three as `zero retention` and
`training: false`, so if a signup credit is worth using for evaluation, the data policy is not the
reason to avoid it.
