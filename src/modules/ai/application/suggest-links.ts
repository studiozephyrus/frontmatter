import type { LlmClient } from "./ports";

export interface SuggestLinksInput {
  text: string;
  /** Vault note basenames (without `.md`) the LLM may suggest as link targets. */
  candidates: readonly string[];
}

export interface Suggestion {
  phrase: string;
  basename: string;
}

export interface SuggestLinksOutput {
  suggestions: Suggestion[];
}

const SYSTEM = `You spot phrases in a markdown note that should become Obsidian-style wikilinks to other notes in the same vault. You will receive a list of available note basenames. ONLY suggest a link when there is a clear semantic match between a phrase in the text and one of those basenames. SKIP phrases already wrapped in [[...]]. SKIP phrases inside code fences. SKIP frontmatter content. Return ONLY a JSON array of {"phrase":"...","basename":"..."} objects. No preamble, no code fences. If nothing fits, return [].`;

export function makeSuggestLinks(deps: { llm: LlmClient }) {
  return async function suggestLinks(
    input: SuggestLinksInput,
  ): Promise<SuggestLinksOutput> {
    if (input.candidates.length === 0) return { suggestions: [] };
    const prompt = `Available notes:\n${input.candidates.join("\n")}\n\nNote:\n${input.text}`;
    const raw = await deps.llm.generate({ prompt, system: SYSTEM });
    return { suggestions: parseSuggestions(raw, input.candidates) };
  };
}

function parseSuggestions(raw: string, candidates: readonly string[]): Suggestion[] {
  let s = raw.trim();
  // Strip optional code fences
  const fence = s.match(/^```(?:json)?\s*([\s\S]*?)\s*```\s*$/);
  if (fence && fence[1]) s = fence[1].trim();
  // Find the first '[' to tolerate stray preamble
  const start = s.indexOf("[");
  const end = s.lastIndexOf("]");
  if (start === -1 || end === -1 || end <= start) return [];
  const slice = s.slice(start, end + 1);
  try {
    const parsed = JSON.parse(slice) as unknown;
    if (!Array.isArray(parsed)) return [];
    const set = new Set(candidates);
    const out: Suggestion[] = [];
    for (const item of parsed) {
      if (typeof item !== "object" || item === null) continue;
      const obj = item as Record<string, unknown>;
      const phrase = obj["phrase"];
      const basename = obj["basename"];
      if (
        typeof phrase === "string" &&
        phrase.length > 0 &&
        typeof basename === "string" &&
        set.has(basename)
      ) {
        out.push({ phrase, basename });
      }
    }
    return out;
  } catch {
    return [];
  }
}
