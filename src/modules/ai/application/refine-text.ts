import type { LlmClient } from "./ports";

export interface RefineInput {
  text: string;
  instruction?: string;
}

export interface RefineOutput {
  text: string;
}

const SYSTEM = `You refine markdown notes. PRESERVE the original meaning, structure, frontmatter (--- YAML ---), headings, [[wikilinks]], #tags, code blocks, lists, tables, and callouts EXACTLY. Improve clarity, grammar, flow, and conciseness. NEVER add commentary or wrap your output in code fences. Output ONLY the refined markdown.`;

export function makeRefineText(deps: { llm: LlmClient }) {
  return async function refineText(input: RefineInput): Promise<RefineOutput> {
    const prompt = input.instruction
      ? `Instruction: ${input.instruction}\n\nNote:\n${input.text}`
      : `Refine the following note:\n\n${input.text}`;
    const out = await deps.llm.generate({ prompt, system: SYSTEM });
    return { text: stripFences(out).trim() };
  };
}

function stripFences(s: string): string {
  const m = s.match(/^```(?:markdown|md)?\s*([\s\S]*?)\s*```\s*$/);
  return m ? (m[1] ?? s) : s;
}
