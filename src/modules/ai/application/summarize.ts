import type { LlmClient } from "./ports";

export interface SummarizeInput {
  text: string;
}

export interface SummarizeOutput {
  summary: string;
}

const SYSTEM = `You write tight summaries of markdown notes. Output 1-3 sentences (max ~60 words) of plain markdown, no preamble, no bullet lists, no headings, no code fences.`;

export function makeSummarize(deps: { llm: LlmClient }) {
  return async function summarize(input: SummarizeInput): Promise<SummarizeOutput> {
    const out = await deps.llm.generate({ prompt: input.text, system: SYSTEM });
    return { summary: out.trim() };
  };
}
