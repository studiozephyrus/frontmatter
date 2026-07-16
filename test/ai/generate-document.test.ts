import { describe, it, expect, vi } from "vitest";
import { makeGenerateDocument } from "@/modules/ai/application/generate-document";
import { DOC_KINDS, docPrompt, isDocKind, type DocKind } from "@/modules/ai/application/doc-prompts";
import type { LlmClient } from "@/modules/ai/application/ports";

describe("doc-prompts", () => {
  it("exposes all five document kinds", () => {
    expect([...DOC_KINDS]).toEqual(["prd", "frd", "brd", "product-note", "spec"]);
  });

  it("gives each kind a distinct, non-empty system prompt and label", () => {
    const systems = DOC_KINDS.map((k) => docPrompt(k).system);
    expect(new Set(systems).size).toBe(DOC_KINDS.length);
    for (const k of DOC_KINDS) {
      const p = docPrompt(k);
      expect(p.system.length).toBeGreaterThan(40);
      expect(p.label.length).toBeGreaterThan(0);
    }
  });

  it("isDocKind validates membership", () => {
    expect(isDocKind("prd")).toBe(true);
    expect(isDocKind("spec")).toBe(true);
    expect(isDocKind("essay")).toBe(false);
    expect(isDocKind(42)).toBe(false);
  });
});

describe("makeGenerateDocument", () => {
  function mockLlm(reply: string): { llm: LlmClient; calls: { prompt: string; system?: string }[] } {
    const calls: { prompt: string; system?: string }[] = [];
    return {
      calls,
      llm: {
        generate: vi.fn(async ({ prompt, system }) => {
          calls.push({ prompt, ...(system !== undefined ? { system } : {}) });
          return reply;
        }),
      },
    };
  }

  it("sends the idea as the prompt and the kind's system prompt", async () => {
    const { llm, calls } = mockLlm("# Generated\n\nBody.");
    const generate = makeGenerateDocument({ llm });
    const out = await generate({ kind: "prd", idea: "a vault sync feature" });
    expect(out.document).toBe("# Generated\n\nBody.");
    expect(calls).toHaveLength(1);
    expect(calls[0]!.prompt).toBe("a vault sync feature");
    expect(calls[0]!.system).toBe(docPrompt("prd").system);
  });

  it("trims surrounding whitespace from the model output", async () => {
    const { llm } = mockLlm("\n\n  # Spec\n\nText.\n  \n");
    const generate = makeGenerateDocument({ llm });
    const out = await generate({ kind: "spec", idea: "x" });
    expect(out.document).toBe("# Spec\n\nText.");
  });

  it("uses the correct system prompt for each kind", async () => {
    for (const kind of DOC_KINDS as DocKind[]) {
      const { llm, calls } = mockLlm("ok");
      const generate = makeGenerateDocument({ llm });
      await generate({ kind, idea: "idea" });
      expect(calls[0]!.system).toBe(docPrompt(kind).system);
    }
  });
});
