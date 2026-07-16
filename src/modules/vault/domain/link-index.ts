/**
 * Pure domain logic for building a link index from parsed notes.
 * No framework imports, no env reads.
 */

import type { ParsedNote } from "./note.js";

export interface LinkIndexEntry {
  /** Outbound wikilink targets (basename only) */
  readonly outbound: readonly string[];
  /** Paths of notes that link TO this note */
  readonly backlinks: readonly string[];
  readonly excludeFromGraph: boolean;
}

/** Map from vault-relative path → link index entry */
export type LinkIndex = ReadonlyMap<string, LinkIndexEntry>;

/**
 * Builds a bidirectional link index from an array of parsed notes.
 *
 * Resolution strategy: a basename target "Foo" resolves to any note whose
 * path ends with "/Foo.md" or is exactly "Foo.md".
 */
export function buildLinkIndex(notes: readonly ParsedNote[]): LinkIndex {
  // Build a lookup from basename → path. When two notes share a basename
  // (e.g. `Drafts/Daily.md` and `Archive/Daily.md`) the resolution must be
  // DETERMINISTIC so a `[[Daily]]` wikilink resolves the same way across
  // refreshes; otherwise the chosen target flips with vault iteration order.
  // Tie-break rule: shortest path wins (top-level over nested), then
  // lexicographic. This keeps a top-of-vault note as the canonical target.
  const basenameToPath = new Map<string, string>();
  for (const note of notes) {
    setBasenameEntry(basenameToPath, note.path);
  }

  // Case-insensitive fallback index (Obsidian-style weak linking): `[[hq]]`
  // counts as a backlink to `HQ.md`. Same deterministic shallowest-wins rule.
  const lowerToPath = new Map<string, string>();
  for (const [base, path] of basenameToPath) {
    setLowerCaseEntry(lowerToPath, base, path);
  }

  // Initialise index with empty backlink arrays
  const mutableIndex = new Map<string, { outbound: readonly string[]; backlinks: string[]; excludeFromGraph: boolean }>();
  for (const note of notes) {
    mutableIndex.set(note.path, {
      outbound: note.outbound,
      backlinks: [],
      excludeFromGraph: note.excludeFromGraph,
    });
  }

  // Populate backlinks
  for (const note of notes) {
    for (const target of note.outbound) {
      const targetPath = basenameToPath.get(target) ?? lowerToPath.get(target.toLowerCase());
      if (targetPath !== undefined) {
        const entry = mutableIndex.get(targetPath);
        if (entry !== undefined) {
          entry.backlinks.push(note.path);
        }
      }
    }
  }

  return mutableIndex as LinkIndex;
}

function basename(path: string): string {
  const parts = path.split("/");
  const last = parts[parts.length - 1] ?? path;
  // strip .md extension
  return last.endsWith(".md") ? last.slice(0, -3) : last;
}

/**
 * Insert a `basename → path` entry into the lookup map with deterministic
 * collision handling. Shared by EVERY site that builds such a map (graph
 * data, editor completion, runtime wikilink resolution) so a single rule
 * decides which note `[[Foo]]` resolves to when two notes share a basename.
 *
 * Rule: shallowest path wins (fewer `/` segments), tie-broken lexicographically.
 * "Foo.md" beats "Drafts/Foo.md" beats "Drafts/Old/Foo.md".
 */
export function setBasenameEntry(
  map: Map<string, string>,
  notePath: string,
): void {
  const base = basename(notePath);
  const existing = map.get(base);
  if (existing === undefined) {
    map.set(base, notePath);
    return;
  }
  const existingDepth = existing.split("/").length;
  const candidateDepth = notePath.split("/").length;
  if (
    candidateDepth < existingDepth ||
    (candidateDepth === existingDepth && notePath < existing)
  ) {
    map.set(base, notePath);
  }
}

/**
 * Insert a lowercase `basename → path` entry for the case-insensitive fallback,
 * using the same deterministic shallowest-wins, lexicographic tie-break so the
 * resolved target is stable across refreshes.
 */
function setLowerCaseEntry(map: Map<string, string>, base: string, notePath: string): void {
  const key = base.toLowerCase();
  const existing = map.get(key);
  if (existing === undefined) {
    map.set(key, notePath);
    return;
  }
  const existingDepth = existing.split("/").length;
  const candidateDepth = notePath.split("/").length;
  if (
    candidateDepth < existingDepth ||
    (candidateDepth === existingDepth && notePath < existing)
  ) {
    map.set(key, notePath);
  }
}
