/**
 * wikilink.ts — pure wikilink resolution utilities.
 *
 * Parses [[target]], [[target|alias]], [[target#heading]], [[target#heading|alias]]
 * and resolves the basename to a full vault path using the provided map.
 */

/**
 * Strip the heading fragment (`#…`) and alias (`|…`) from a raw wikilink target
 * as they appear inside `[[…]]`.
 *
 * Examples:
 *   "HQ"            → "HQ"
 *   "HQ#section"    → "HQ"
 *   "HQ|alias"      → "HQ"
 *   "HQ#sec|alias"  → "HQ"
 */
export function stripWikilinkDecorations(raw: string): string {
  // Remove alias first (everything after `|`)
  const withoutAlias = raw.split("|")[0] ?? raw;
  // Remove heading fragment (everything after `#`)
  const withoutFragment = withoutAlias.split("#")[0] ?? withoutAlias;
  return withoutFragment.trim();
}

/**
 * Resolve a wikilink target to a full vault path.
 *
 * @param target     The raw string inside `[[ ]]` (may include `#heading` or `|alias`).
 * @param basenameToPath  A Map from file basename (without `.md`) to its full path.
 *                        Build this from `snapshot.notes.map(n => [basename(n.path), n.path])`.
 * @returns  The full vault path if unambiguously resolved, otherwise `null`.
 */
export function resolveWikilink(
  target: string,
  basenameToPath: Map<string, string>,
): string | null {
  const cleaned = stripWikilinkDecorations(target);
  if (cleaned === "") return null;

  // Exact path match (e.g., "Projects/HQ/HQ")
  if (basenameToPath.has(cleaned)) {
    return basenameToPath.get(cleaned) ?? null;
  }

  // Basename match: target may already be a pure basename like "HQ"
  // Also handle case where full path was provided without .md extension
  // The map is keyed by basename — try the last segment
  const segments = cleaned.split("/");
  const basename = segments[segments.length - 1] ?? cleaned;

  if (basenameToPath.has(basename)) {
    return basenameToPath.get(basename) ?? null;
  }

  // Case-insensitive fallback (Obsidian-style weak linking): `[[hq]]` resolves
  // to `HQ.md`. Exact-case matches above always win; this only runs on a miss.
  const lower = basename.toLowerCase();
  for (const [key, path] of basenameToPath) {
    if (key.toLowerCase() === lower) return path;
  }

  return null;
}
