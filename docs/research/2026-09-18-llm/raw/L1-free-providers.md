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
  curl returns only the shell, so I could not enumerate the catalogue from the provider's own page.
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
  Tier models.` `UNVERIFIED:` I did not enumerate that subset.
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

