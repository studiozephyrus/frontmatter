/**
 * Provider race orchestrator for the multi-provider LLM client.
 *
 * The old chain tried providers strictly sequentially: a slow or hung first
 * provider blocked the whole request until IT timed out before the next was
 * even attempted — the "AI takes forever" symptom. This races a small leading
 * group of providers concurrently, each under a per-attempt timeout; the first
 * non-empty success wins and the losers are aborted. If the whole lead group
 * fails, it falls back to the next group. A slow tier no longer stalls the user.
 *
 * Pure orchestration: each provider is supplied as an `Attempt` whose `run`
 * receives an AbortSignal, so this is fully unit-testable with mock attempts
 * (the real gateway wires AI-SDK generateText calls behind `run`).
 */

export type Attempt = {
  id: string;
  run: (signal: AbortSignal) => Promise<string>;
};

export type RaceOptions = {
  /** How many leading attempts to race concurrently (>=1). */
  concurrency?: number;
  /** Per-attempt timeout in ms. */
  timeoutMs?: number;
};

export const DEFAULT_CONCURRENCY = 1;
export const DEFAULT_TIMEOUT_MS = 15_000;

/** Run one attempt under a hard timeout; reject on error, empty text, or
 *  timeout. The controller is owned by the caller so a sibling winner can
 *  abort this attempt's in-flight request. */
function runWithTimeout(
  attempt: Attempt,
  controller: AbortController,
  timeoutMs: number,
): Promise<string> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      controller.abort();
      reject(new Error(`${attempt.id} timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });
  const run = (async () => {
    const text = await attempt.run(controller.signal);
    if (!text || text.trim().length === 0) {
      throw new Error(`${attempt.id} returned empty`);
    }
    return text;
  })();
  return Promise.race([run, timeout]).finally(() => {
    if (timer) clearTimeout(timer);
  });
}

/**
 * Race the attempts in batches of `concurrency`. Returns the first non-empty
 * success; advances to the next batch only when an entire batch fails. Throws
 * the last error when every attempt fails.
 */
export async function raceProviders(
  attempts: readonly Attempt[],
  opts: RaceOptions = {},
): Promise<string> {
  if (attempts.length === 0) throw new Error("no AI providers configured");
  const concurrency = Math.max(1, Math.floor(opts.concurrency ?? DEFAULT_CONCURRENCY));
  const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  let lastErr: unknown = new Error("all AI providers failed");

  for (let i = 0; i < attempts.length; i += concurrency) {
    const batch = attempts.slice(i, i + concurrency);
    const controllers = batch.map(() => new AbortController());
    try {
      // Promise.any → first fulfilled; rejects (AggregateError) only if ALL fail.
      const winner = await Promise.any(
        batch.map((a, j) => runWithTimeout(a, controllers[j]!, timeoutMs)),
      );
      // Abort the losing in-flight requests so they don't keep running.
      for (const c of controllers) c.abort();
      return winner;
    } catch (err) {
      for (const c of controllers) c.abort();
      // AggregateError from Promise.any — keep a representative cause.
      if (err instanceof AggregateError && err.errors.length > 0) {
        lastErr = err.errors[err.errors.length - 1];
      } else {
        lastErr = err;
      }
    }
  }

  throw lastErr instanceof Error ? lastErr : new Error(String(lastErr));
}
