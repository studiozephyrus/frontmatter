/**
 * Application use-case: ResolvePublicNote.
 *
 * Maps a public slug to its note's body for unauthenticated render.
 * Returns null when the slug is unknown OR when multiple notes claim it
 * (conflict — public route stays 404 until resolved by the owner).
 */

import type { ShareSnapshotPort } from "./ports";

export interface PublicFileReader {
  getFile(path: string): Promise<{ content: string; sha: string }>;
}

export interface PublicNote {
  slug: string;
  path: string;
  title: string;
  content: string;
  sha: string;
}

export function makeResolvePublicNote(deps: {
  snapshot: ShareSnapshotPort;
  reader: PublicFileReader;
}) {
  return async function resolve(slug: string): Promise<PublicNote | null> {
    const shares = await deps.snapshot.listShares();
    const matches = shares.filter((s) => s.slug === slug);
    if (matches.length !== 1) return null; // 0 → unknown · >1 → conflict
    const m = matches[0]!;
    // Treat an upstream read failure (GitHub down/rate-limited) as "not found"
    // rather than letting it throw out of the anonymous public Server Component
    // (which would render a generic 500 to a shared-link visitor).
    let file: { content: string; sha: string };
    try {
      file = await deps.reader.getFile(m.path);
    } catch {
      return null;
    }
    return { slug, path: m.path, title: m.title, content: stripForPublicRender(file.content, m.title), sha: file.sha };
  };
}

/**
 * Strip frontmatter + any leading H1 that duplicates the title so the public
 * page doesn't show "Title" twice (the page header already shows it).
 */
function stripForPublicRender(raw: string, title: string): string {
  // Strip YAML frontmatter.
  let body = raw;
  if (body.startsWith("---")) {
    const end = body.indexOf("\n---", 4);
    if (end !== -1) body = body.slice(end + 4).replace(/^\n+/, "");
  }
  // Strip a leading H1 if it matches the title (case + whitespace insensitive).
  const lines = body.split("\n");
  let i = 0;
  while (i < lines.length && lines[i]!.trim() === "") i++;
  const firstLine = lines[i];
  if (firstLine && /^#\s+/.test(firstLine)) {
    const h1Text = firstLine.replace(/^#\s+/, "").trim();
    if (h1Text.toLowerCase() === title.trim().toLowerCase()) {
      lines.splice(i, 1);
      // Also drop any blank lines that follow.
      while (lines[i] !== undefined && lines[i]!.trim() === "") lines.splice(i, 1);
    }
  }
  return lines.join("\n").trim();
}
