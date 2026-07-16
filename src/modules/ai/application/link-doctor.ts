import type { LlmClient } from "./ports";
import { makeSuggestLinks, type Suggestion } from "./suggest-links";

export interface LinkDoctorInput {
  /** Vault paths to scan (each must be a .md note). */
  paths: readonly string[];
  /** All vault basenames (without `.md`) available as link targets. */
  candidates: readonly string[];
  /** Loader that returns file contents + sha for a vault path. */
  getFile: (path: string) => Promise<{ content: string; sha: string }>;
}

export interface LinkDoctorNoteResult {
  path: string;
  content: string;
  sha: string;
  suggestions: Suggestion[];
}

export interface LinkDoctorError {
  path: string;
  error: string;
}

export interface LinkDoctorOutput {
  results: LinkDoctorNoteResult[];
  errors: LinkDoctorError[];
}

const CONCURRENCY = 3;

function basenameOf(path: string): string {
  const last = path.split("/").pop() ?? path;
  return last.endsWith(".md") ? last.slice(0, -3) : last;
}

export function makeLinkDoctor(deps: { llm: LlmClient }) {
  const suggestLinks = makeSuggestLinks({ llm: deps.llm });
  return async function linkDoctor(
    input: LinkDoctorInput,
  ): Promise<LinkDoctorOutput> {
    const results: LinkDoctorNoteResult[] = [];
    const errors: LinkDoctorError[] = [];
    let cursor = 0;
    const paths = input.paths;

    async function worker(): Promise<void> {
      while (true) {
        const idx = cursor++;
        if (idx >= paths.length) return;
        const path = paths[idx];
        if (path === undefined) continue;
        try {
          const file = await input.getFile(path);
          const self = basenameOf(path);
          const candidates = input.candidates.filter((c) => c !== self);
          const { suggestions } = await suggestLinks({
            text: file.content,
            candidates,
          });
          if (suggestions.length > 0) {
            results.push({
              path,
              content: file.content,
              sha: file.sha,
              suggestions,
            });
          }
        } catch (err) {
          errors.push({
            path,
            error: err instanceof Error ? err.message : "error",
          });
        }
      }
    }

    await Promise.all(
      Array.from({ length: CONCURRENCY }, () => worker()),
    );
    return { results, errors };
  };
}
