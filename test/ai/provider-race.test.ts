import { describe, it, expect, vi } from "vitest";
import { raceProviders, type Attempt } from "@/modules/ai/infrastructure/provider-race";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

function attempt(
  id: string,
  behavior: { text?: string; delayMs?: number; throws?: boolean; honorsAbort?: boolean },
): Attempt {
  return {
    id,
    run: async (signal) => {
      if (behavior.delayMs) {
        if (behavior.honorsAbort !== false) {
          await new Promise<void>((resolve, reject) => {
            const t = setTimeout(resolve, behavior.delayMs);
            signal.addEventListener("abort", () => {
              clearTimeout(t);
              reject(new Error("aborted"));
            });
          });
        } else {
          await delay(behavior.delayMs);
        }
      }
      if (behavior.throws) throw new Error(`${id} failed`);
      return behavior.text ?? `${id}-ok`;
    },
  };
}

describe("raceProviders", () => {
  it("returns the single attempt's text", async () => {
    const out = await raceProviders([attempt("a", { text: "hello" })]);
    expect(out).toBe("hello");
  });

  it("throws when no attempts are configured", async () => {
    await expect(raceProviders([])).rejects.toThrow(/no AI providers/i);
  });

  it("falls through a failing provider to the next (concurrency 1)", async () => {
    const out = await raceProviders(
      [attempt("a", { throws: true }), attempt("b", { text: "from-b" })],
      { concurrency: 1, timeoutMs: 500 },
    );
    expect(out).toBe("from-b");
  });

  it("treats an empty completion as a failure and advances", async () => {
    const out = await raceProviders(
      [attempt("a", { text: "   " }), attempt("b", { text: "real" })],
      { concurrency: 1, timeoutMs: 500 },
    );
    expect(out).toBe("real");
  });

  it("advances past a provider that exceeds the timeout", async () => {
    const start = Date.now();
    const out = await raceProviders(
      [attempt("slow", { delayMs: 1000 }), attempt("fast", { text: "quick" })],
      { concurrency: 1, timeoutMs: 40 },
    );
    expect(out).toBe("quick");
    // Should not have waited the full 1000ms for the slow provider.
    expect(Date.now() - start).toBeLessThan(500);
  });

  it("races concurrently and returns the fastest success (concurrency 2)", async () => {
    const start = Date.now();
    const out = await raceProviders(
      [attempt("slow", { text: "slow", delayMs: 200 }), attempt("fast", { text: "fast", delayMs: 10 })],
      { concurrency: 2, timeoutMs: 1000 },
    );
    expect(out).toBe("fast");
    expect(Date.now() - start).toBeLessThan(150);
  });

  it("throws the last error when every provider fails", async () => {
    await expect(
      raceProviders([attempt("a", { throws: true }), attempt("b", { throws: true })], {
        concurrency: 1,
        timeoutMs: 200,
      }),
    ).rejects.toThrow(/failed/i);
  });

  it("aborts the losing attempt's signal when a winner is found", async () => {
    const aborted = vi.fn();
    const loser: Attempt = {
      id: "loser",
      run: (signal) =>
        new Promise<string>((resolve) => {
          signal.addEventListener("abort", aborted);
          setTimeout(() => resolve("late"), 300);
        }),
    };
    const winner = attempt("winner", { text: "win", delayMs: 5 });
    const out = await raceProviders([winner, loser], { concurrency: 2, timeoutMs: 1000 });
    expect(out).toBe("win");
    await delay(20);
    expect(aborted).toHaveBeenCalled();
  });
});
