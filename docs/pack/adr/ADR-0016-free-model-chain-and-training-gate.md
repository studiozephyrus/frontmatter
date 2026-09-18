---
id: ADR-0016-free-model-chain-and-training-gate
title: A free-model fallback chain, behind a training gate
mode: explanation
tier: canonical
status: decided
verified_against: 4de879d
updated: 2026-09-18
owner: sagnik
covers: [ADR-0016]
---

# ADR-0016. A free-model fallback chain, behind a training gate

**Decision id:** ADR-0016. **Decided:** 18 September 2026, in `27-MODEL-ROUTING-SPEC.md` and the plan
commit `e532e32` of the same day. **Recorded here:** 18 September 2026.

## Context

- Free users get AI edits, question sets and a Low blueprint. `INFERENCE:` paying a model provider for
  every free call would make the free tier a model bill.
- Free inference tiers exist, but each is small, and several providers pay for theirs by training on
  what users send.
- This product holds people's private documents. The founder's requirement, quoted at the opening of
  `27`, is that a user never feels the AI is unavailable, for up to 200 users, and that the layer resists
  "token abusing".

## Decision

- **Gate A. A provider that trains on inputs is disqualified**, at every position, for every call
  type, on every plan.
- **Gate B. A provider whose terms nobody has opened cannot be enabled.** Not behind a flag, and not
  untested.
- **Free calls walk a fallback chain of free providers** that pass both gates, and the last link is a
  paid provider. So the router cannot say "AI is unavailable" while a paid key is configured.
- **Pro edits, documents and blueprints start on Claude**, with the free chain as the fallback. Pro
  question sets use the free chain, per `27` section 3.2.
- The chain is configuration rows in the panel, not code. Its exact order is founder question 3.

## Evidence

- `27-MODEL-ROUTING-SPEC.md` section 1 states both gates and where each is enforced: a
  `trainsOnInputs` field the planner refuses to emit, and a `termsOpenedOn` date without which S36
  cannot enable a row.
- `27-MODEL-ROUTING-SPEC.md` section 2.1 lists the chain, each training clause copied on 18 September:

Position | Provider | State in `27`
1 | Cloudflare Workers AI | in the plan's chain
2 | Groq | in the plan's chain
3 | Cerebras | while the trial lasts
4 | OpenRouter | admitted 18 September
5 | SambaNova | **Held out of the chain.** Its training sentence is now opened and meets gate B: the cloud licence limits use of customer content to providing the service, "and for no other purposes". But its Free plan now reads "Add a payment method and purchase credits to run your first requests", so it is no longer a no-card free tier `[M]`
6 | Ollama, desktop only | nothing leaves the machine
7 | Paid Cloudflare, then Anthropic for Pro | the link that means the chain never runs out

- `27-MODEL-ROUTING-SPEC.md` section 2.2 lists the providers refused under gate A: Google AI Studio's
  unpaid tier, Cohere trial keys, NVIDIA NIM, DeepSeek, and Mistral Free.
- `27` section 1 notes the audit tip: search a provider's terms for "improve", not for "train".

## A disagreement inside the plan

- `docs/mvp0/PRODUCT-PLAN.md` section 3, the AI row, still says: no OpenRouter endpoint.
- `docs/mvp0/PRODUCT-PLAN.md` section 14, after commit `e532e32`, admits OpenRouter because its terms
  were opened and quoted on 18 September.
- `27-MODEL-ROUTING-SPEC.md` section 2.4 follows section 14. **Section 3 of the plan is stale** and
  its owner should bring it into line.
- `27` section 2.4 also flags a cost defect in the plan's OpenRouter row: the higher daily ceiling
  needs 10 credits, so a single $5 purchase buys nothing.

## Alternatives rejected and why

Alternative | Why rejected
Gemini's free tier, first in the shipped `QUALITY_ORDER` | Trains on unpaid inputs. `27` section 2.2 calls its presence in `main` a live defect
Signup credits from Fireworks, Together or DeepInfra | A credit that runs out once cannot hold up a fallback chain, per `27` section 2.3
Paid models only, from day one | `INFERENCE:` the pilot's free tier would carry a model bill the free chain avoids
`gpt4free` reverse proxies | Unlicensed. `27` section 2.3 calls routing a customer's document through one indefensible

## Consequences

- The training promise is on the sign-in page, so adding a training provider changes a sentence, not
  a number. The panel cannot edit it, per `docs/mvp0/PRODUCT-PLAN.md` section 30.
- Quota is tracked in our ledger per provider, model and UTC day, per `27` sections 2.4
  and 4.
- Abuse is bounded by budgets, never by a captcha, per ADR-0009 and `27` section 9.
- `[O]` state per `27`: a five-provider chain exists in
  `src/modules/ai/infrastructure/gateway-client.ts` with two static orders. Everything else is
  `specified, not built`.

## What would reverse it

- A provider in the chain changing its terms to allow training. Gate A then removes it at once.
- The free pools proving too small for real use. `27` section 8 derives where the chain breaks first.

## Limits of this record

- Cerebras's free terms, which two readings described differently, are settled: both are true of one
  offer. Its rate-limits page answers "Is there a permanently free tier?" with "No. The Free Trial
  is time- and credit-bounded: $5 in credits that expire 30 days after they're granted" `[M]`. So Cerebras sits in the
  chain only while the trial lasts, as the table says.
- Three provider pages were re-opened on 18 September 2026 for this record, matching `27`:
  `https://sambanova.ai/cloud-end-user-license-agreement`, `https://cloud.sambanova.ai/plans` and
  `https://inference-docs.cerebras.ai/support/rate-limits`. No other provider page was re-opened.
