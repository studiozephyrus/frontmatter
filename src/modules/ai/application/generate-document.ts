/**
 * Application use-case: GenerateDocument (Idea mode).
 *
 * Turns a raw idea/requirement into a structured document of the requested
 * kind (PRD / FRD / BRD / product note / spec) by selecting the kind's system
 * prompt and asking the LLM. Pure application logic over the LlmClient port.
 */

import type { LlmClient } from "./ports";
import { docPrompt, type DocKind } from "./doc-prompts";

export interface GenerateDocumentInput {
  kind: DocKind;
  idea: string;
}

export interface GenerateDocumentOutput {
  document: string;
}

export function makeGenerateDocument(deps: { llm: LlmClient }) {
  return async function generateDocument(
    input: GenerateDocumentInput,
  ): Promise<GenerateDocumentOutput> {
    const { system } = docPrompt(input.kind);
    const out = await deps.llm.generate({ prompt: input.idea, system });
    return { document: out.trim() };
  };
}
