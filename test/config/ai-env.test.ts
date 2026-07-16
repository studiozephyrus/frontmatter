import { describe, it, expect } from "vitest";
import {
  parseAiEnv,
  configuredAiProviders,
  hasAnyAiProvider,
} from "@/config/env";

describe("parseAiEnv", () => {
  it("returns the validated keys that are present", () => {
    const out = parseAiEnv({ GROQ_API_KEY: "gk", AI_GROQ_MODEL: "llama" });
    expect(out.GROQ_API_KEY).toBe("gk");
    expect(out.AI_GROQ_MODEL).toBe("llama");
  });

  it("omits keys that are absent (all optional)", () => {
    const out = parseAiEnv({});
    expect(out.GROQ_API_KEY).toBeUndefined();
    expect(out.GOOGLE_GENERATIVE_AI_API_KEY).toBeUndefined();
  });

  it("never throws on malformed input", () => {
    expect(() => parseAiEnv({ GROQ_API_KEY: "" })).not.toThrow();
  });
});

describe("configuredAiProviders", () => {
  it("lists only provider keys with non-empty values", () => {
    const out = configuredAiProviders({
      GROQ_API_KEY: "x",
      CEREBRAS_API_KEY: "  ",
      OPENROUTER_API_KEY: "y",
    });
    expect(out).toEqual(["GROQ_API_KEY", "OPENROUTER_API_KEY"]);
  });

  it("returns an empty list when nothing is configured", () => {
    expect(configuredAiProviders({})).toEqual([]);
  });
});

describe("hasAnyAiProvider", () => {
  it("is true when any provider key is set", () => {
    expect(hasAnyAiProvider({ MISTRAL_API_KEY: "m" })).toBe(true);
  });
  it("is false when no provider key is set", () => {
    expect(hasAnyAiProvider({ AI_MODEL: "google/gemini" })).toBe(false);
  });
});
