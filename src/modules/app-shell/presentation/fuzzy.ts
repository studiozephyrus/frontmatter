/**
 * fuzzy.ts — pure, TDD-friendly fuzzy filter with subsequence ranking.
 *
 * Algorithm: case-insensitive subsequence matching.
 * Ranking: score = position of first match char (lower = better) +
 *          bonus for contiguous runs (negative bonus = better rank).
 *
 * Empty query → all items returned unchanged.
 */

interface Scored<T> {
  item: T;
  score: number;
}

function computeScore(text: string, query: string): number | null {
  const t = text.toLowerCase();
  const q = query.toLowerCase();

  if (q.length === 0) return 0;

  let qi = 0;
  let firstMatchIndex = -1;
  let contiguous = 0;
  let score = 0;

  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) {
      if (firstMatchIndex === -1) firstMatchIndex = ti;

      // Reward contiguous matches
      if (ti > 0 && t[ti - 1] === q[qi - 1]) {
        contiguous++;
        score -= 2; // bonus: lower = better
      }

      qi++;
    } else {
      contiguous = 0;
    }
  }

  if (qi < q.length) {
    // Did not match all query chars
    return null;
  }

  void contiguous; // used above

  // Base score: position of first match (lower = better)
  score += firstMatchIndex;

  return score;
}

/**
 * Fuzzy-filters `items` by `query` using the value from `key(item)`.
 * Returns matched items sorted by quality (best match first).
 * Empty query returns all items unchanged (original order).
 */
export function fuzzyFilter<T>(
  items: T[],
  query: string,
  key: (t: T) => string,
): T[] {
  if (query.trim() === "") return items;

  const scored: Scored<T>[] = [];

  for (const item of items) {
    const score = computeScore(key(item), query);
    if (score !== null) {
      scored.push({ item, score });
    }
  }

  scored.sort((a, b) => a.score - b.score);
  return scored.map((s) => s.item);
}
