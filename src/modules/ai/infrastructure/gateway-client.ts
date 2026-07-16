import { generateText, type LanguageModel } from "ai";
import { raceProviders, type Attempt } from "./provider-race";
import { google } from "@ai-sdk/google";
import { groq } from "@ai-sdk/groq";
import { cerebras } from "@ai-sdk/cerebras";
import { mistral } from "@ai-sdk/mistral";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import type { LlmClient } from "../application/ports";

/**
 * Multi-provider LLM adapter with transparent fallback.
 *
 * A provider joins the chain ONLY if its (free) API key env var is set, so the
 * user adds keys incrementally — more keys = more resilience. On any failure
 * (429 rate-limit, 5xx, timeout) the chain silently advances to the next
 * provider; the caller only sees an error if EVERY configured provider fails.
 *
 * Ordering is task-aware:
 *   - speedFirst (ghost-text):  Groq → Cerebras → Google → OpenRouter
 *   - default (refine/etc):     Google → Groq → Cerebras → OpenRouter
 *
 * If NO direct keys are set, falls back to the Vercel AI Gateway string
 * (credit-gated) so behaviour is unchanged on a bare deploy.
 *
 * All env reads happen at request time (never module load). Per-provider model
 * overrides: AI_GOOGLE_MODEL / AI_GROQ_MODEL / AI_CEREBRAS_MODEL /
 * AI_OPENROUTER_MODEL (AI_MODEL still overrides Google for back-compat).
 */
type Provider = { id: string; model: () => LanguageModel };

function configuredProviders(): Provider[] {
  const env = process.env;
  const list: Provider[] = [];
  if (env["GOOGLE_GENERATIVE_AI_API_KEY"]) {
    const m = env["AI_GOOGLE_MODEL"]?.trim() || env["AI_MODEL"]?.trim() || "gemini-2.5-flash";
    list.push({ id: "google", model: () => google(m) });
  }
  if (env["GROQ_API_KEY"]) {
    const m = env["AI_GROQ_MODEL"]?.trim() || "llama-3.3-70b-versatile";
    list.push({ id: "groq", model: () => groq(m) });
  }
  if (env["CEREBRAS_API_KEY"]) {
    const m = env["AI_CEREBRAS_MODEL"]?.trim() || "llama-3.3-70b";
    list.push({ id: "cerebras", model: () => cerebras(m) });
  }
  if (env["MISTRAL_API_KEY"]) {
    const m = env["AI_MISTRAL_MODEL"]?.trim() || "mistral-small-latest";
    list.push({ id: "mistral", model: () => mistral(m) });
  }
  if (env["OPENROUTER_API_KEY"]) {
    const or = createOpenRouter({ apiKey: env["OPENROUTER_API_KEY"] });
    const m = env["AI_OPENROUTER_MODEL"]?.trim() || "meta-llama/llama-3.3-70b-instruct:free";
    list.push({ id: "openrouter", model: () => or(m) });
  }
  return list;
}

const QUALITY_ORDER = ["google", "groq", "cerebras", "mistral", "openrouter"];
const SPEED_ORDER = ["groq", "cerebras", "google", "mistral", "openrouter"];

export const gatewayLlmClient: LlmClient = {
  async generate({ prompt, system, speedFirst }) {
    const sys = system !== undefined ? { system } : {};
    const available = configuredProviders();

    // No direct keys → Vercel AI Gateway (credit-gated; 502s on free tier).
    if (available.length === 0) {
      const { text } = await generateText({
        model: (process.env["AI_MODEL"]?.trim() || "google/gemini-3.5-flash") as unknown as LanguageModel,
        prompt,
        ...sys,
      });
      return text;
    }

    const order = speedFirst ? SPEED_ORDER : QUALITY_ORDER;
    const chain = order
      .map((id) => available.find((p) => p.id === id))
      .filter((p): p is Provider => p !== undefined);

    const attempts: Attempt[] = chain.map((provider) => ({
      id: provider.id,
      run: async (signal) => {
        const { text } = await generateText({
          model: provider.model(),
          prompt,
          maxRetries: 1,
          abortSignal: signal,
          ...sys,
        });
        return text;
      },
    }));

    // Ghost-text (speedFirst) hedges the two fastest providers under a short
    // timeout so a cold/slow provider never stalls inline completion. Quality
    // tasks try one provider at a time under a longer timeout to keep
    // free-tier usage lean. Either way a hung provider can't block the chain.
    return raceProviders(
      attempts,
      speedFirst ? { concurrency: 2, timeoutMs: 6_000 } : { concurrency: 1, timeoutMs: 15_000 },
    );
  },
};
