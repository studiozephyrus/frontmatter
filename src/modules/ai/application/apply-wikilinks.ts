import type { Suggestion } from "./suggest-links";

/**
 * Replace the first occurrence of `s.phrase` in `content` (case-insensitive)
 * with an Obsidian-style wikilink to `s.basename`, skipping occurrences inside
 * fenced code blocks (``` … ```) and existing [[wikilinks]]. The display text
 * preserves the original casing; if the phrase equals the basename, the link
 * collapses to `[[basename]]`, otherwise `[[basename|phrase]]`.
 */
export function applyWikilinkSuggestion(content: string, s: Suggestion): string {
  const { phrase, basename } = s;
  if (!phrase) return content;
  const lower = phrase.toLowerCase();
  let i = 0;
  let inFence = false;
  while (i < content.length) {
    if (content.startsWith("```", i)) {
      inFence = !inFence;
      i += 3;
      continue;
    }
    if (inFence) {
      i++;
      continue;
    }
    if (content.startsWith("[[", i)) {
      const close = content.indexOf("]]", i + 2);
      i = close === -1 ? content.length : close + 2;
      continue;
    }
    if (content.slice(i, i + phrase.length).toLowerCase() === lower) {
      const match = content.slice(i, i + phrase.length);
      const link =
        basename.toLowerCase() === lower
          ? `[[${basename}]]`
          : `[[${basename}|${match}]]`;
      return content.slice(0, i) + link + content.slice(i + phrase.length);
    }
    i++;
  }
  return content;
}
