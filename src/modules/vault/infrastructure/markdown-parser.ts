/**
 * Infrastructure concern: parse raw markdown files into ParsedNote domain objects.
 * Uses gray-matter for frontmatter. No framework imports, no process.env.
 */

import matter from "gray-matter";
import type { ParsedNote } from "../domain/note.js";

// Matches [[target]], [[target#heading]], [[target|alias]], ![[embed]]
// Group 1: optional "!" (embed marker)
// Group 2: full inner content
const WIKILINK_RE = /(!?)\[\[([^\]]+)\]\]/g;

// Matches #tag (word chars, no leading space allowed before)
const INLINE_TAG_RE = /(?:^|\s)#([a-zA-Z][a-zA-Z0-9_/-]*)/g;

/**
 * Resolves a raw wikilink target to its basename (strips #heading and |alias).
 */
function resolveTarget(raw: string): string {
  // strip alias  (everything after |)
  const withoutAlias = raw.split("|")[0] ?? raw;
  // strip heading (everything after #)
  const withoutHeading = withoutAlias.split("#")[0] ?? withoutAlias;
  return withoutHeading.trim();
}

/**
 * Removes fenced code blocks and inline code spans from a string so that
 * wikilinks and tags inside them are not picked up.
 */
function stripCode(text: string): string {
  // Remove fenced code blocks (``` ... ```) — non-greedy, multiline
  let result = text.replace(/```[\s\S]*?```/g, "");
  // Remove inline code spans (` ... `)
  result = result.replace(/`[^`]*`/g, "");
  return result;
}

/**
 * Extracts wikilink targets from a string that may contain `[[...]]` syntax.
 * Returns resolved basenames (deduplicated).
 */
function extractWikilinks(text: string): string[] {
  const targets: string[] = [];
  WIKILINK_RE.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = WIKILINK_RE.exec(text)) !== null) {
    const inner = match[2];
    if (inner !== undefined) {
      targets.push(resolveTarget(inner));
    }
  }
  return targets;
}

/**
 * Extracts frontmatter wikilinks from a value that may be:
 *   - a string like "[[Foo]]"
 *   - an array of strings like ["[[A]]", "[[B]]"]
 */
function extractFrontmatterLinks(value: unknown): string[] {
  if (typeof value === "string") {
    return extractWikilinks(value);
  }
  if (Array.isArray(value)) {
    return value.flatMap((v: unknown) =>
      typeof v === "string" ? extractWikilinks(v) : [],
    );
  }
  return [];
}

/**
 * Extracts inline #tags from body text (code already stripped).
 */
function extractInlineTags(text: string): string[] {
  const tags: string[] = [];
  INLINE_TAG_RE.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = INLINE_TAG_RE.exec(text)) !== null) {
    const tag = match[1];
    if (tag !== undefined) {
      tags.push(tag);
    }
  }
  return tags;
}

/**
 * Returns the basename of a path without the .md extension.
 */
function basenameWithoutExt(path: string): string {
  const parts = path.split("/");
  const last = parts[parts.length - 1] ?? path;
  return last.endsWith(".md") ? last.slice(0, -3) : last;
}

/**
 * Parses a raw markdown file into a ParsedNote.
 *
 * @param path  Vault-relative path (e.g. "Projects/HQ/Foo.md")
 * @param raw   Raw file contents
 */
export function parseMarkdown(path: string, raw: string): ParsedNote {
  // gray-matter throws (via js-yaml) on malformed YAML frontmatter. A single
  // bad note must NEVER crash the whole vault snapshot — degrade gracefully to
  // body-only parsing (title from basename, body links/tags still indexed).
  let fm: Record<string, unknown>;
  let body: string;
  try {
    const parsed = matter(raw);
    fm = parsed.data as Record<string, unknown>;
    body = parsed.content;
  } catch {
    fm = {};
    // Strip a leading frontmatter-ish block if present so its text doesn't
    // pollute the rendered body; otherwise keep the raw content.
    body = raw.replace(/^---\r?\n[\s\S]*?\r?\n[*]*---[*]*\r?\n?/, "");
  }

  // --- Title ---
  const title =
    typeof fm["title"] === "string" && fm["title"].length > 0
      ? fm["title"]
      : basenameWithoutExt(path);

  // --- Frontmatter tags ---
  const fmTags: string[] = [];
  if (Array.isArray(fm["tags"])) {
    for (const t of fm["tags"]) {
      if (typeof t === "string") fmTags.push(t);
    }
  } else if (typeof fm["tags"] === "string") {
    fmTags.push(fm["tags"]);
  }

  // --- Outbound links ---
  // 1. Frontmatter wikilinks (up, related, and any other string/array values)
  const fmLinks: string[] = [
    ...extractFrontmatterLinks(fm["up"]),
    ...extractFrontmatterLinks(fm["related"]),
  ];

  // 2. Body wikilinks (strip code first)
  const cleanBody = stripCode(body);
  const bodyLinks: string[] = [];
  const bodyEmbeds: string[] = [];

  WIKILINK_RE.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = WIKILINK_RE.exec(cleanBody)) !== null) {
    const isEmbed = match[1] === "!";
    const inner = match[2];
    if (inner !== undefined) {
      const target = resolveTarget(inner);
      if (isEmbed) {
        bodyEmbeds.push(target);
      } else {
        bodyLinks.push(target);
      }
    }
  }

  // Deduplicate outbound (embeds are also outbound)
  const allOutbound = Array.from(new Set([...fmLinks, ...bodyLinks, ...bodyEmbeds]));

  // --- Inline tags (body only, code stripped) ---
  const inlineTags = extractInlineTags(cleanBody);

  // Deduplicate tags
  const allTags = Array.from(new Set([...fmTags, ...inlineTags]));

  // --- Archive + Trash exclusion (kept out of the knowledge graph) ---
  const excludeFromGraph = path.startsWith("_Archive/") || path.startsWith("_Trash/");

  return {
    path,
    title,
    tags: allTags,
    outbound: allOutbound,
    embeds: bodyEmbeds,
    frontmatter: fm as Record<string, unknown>,
    excludeFromGraph,
  };
}
