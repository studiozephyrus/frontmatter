/**
 * Infrastructure: full-text search index over vault notes.
 *
 * Uses MiniSearch with a SHA-keyed module-level cache so the index is only
 * rebuilt when the HEAD commit changes. No process.env access — all GitHub
 * I/O goes through the shared github/client helpers.
 */

import MiniSearch from "minisearch";
import { unzipSync } from "fflate";
import { getHeadSha, getZipball } from "@/shared/infrastructure/github/client";
import { parseMarkdown } from "@/modules/vault/infrastructure/markdown-parser";

// ---------------------------------------------------------------------------
// Vault-scope guard (mirrors get-snapshot.ts — keep in sync)
// ---------------------------------------------------------------------------

const NON_VAULT_PREFIXES = [
  "src/",
  "docs/",
  "specs/",
  "public/",
  ".github/",
  ".claude/",
  ".vercel/",
  "node_modules/",
] as const;

function isVaultNote(relPath: string): boolean {
  if (relPath === "") return false;
  if (relPath === "README.md") return false;
  // Soft-deleted notes must not appear in search or unlinked-mention scans.
  if (relPath.startsWith("_Trash/")) return false;
  return !NON_VAULT_PREFIXES.some((prefix) => relPath.startsWith(prefix));
}

function stripTopLevelDir(zipPath: string): string {
  const slashIdx = zipPath.indexOf("/");
  if (slashIdx === -1) return zipPath;
  return zipPath.slice(slashIdx + 1);
}

// ---------------------------------------------------------------------------
// Body text: frontmatter + code stripped for indexing
// ---------------------------------------------------------------------------

/**
 * Produces a plain-text representation suitable for full-text indexing:
 *   - Strips YAML frontmatter (--- block)
 *   - Strips fenced code blocks
 *   - Strips inline code spans
 * This is purely additive — does not affect parseMarkdown.
 */
function extractBodyText(raw: string): string {
  // Strip frontmatter
  let text = raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "");
  // Strip fenced code blocks
  text = text.replace(/```[\s\S]*?```/g, "");
  // Strip inline code
  text = text.replace(/`[^`]*`/g, "");
  return text;
}

// ---------------------------------------------------------------------------
// MiniSearch types
// ---------------------------------------------------------------------------

interface SearchDoc {
  path: string;
  title: string;
  tags: string;
  body: string;
}

export interface SearchResult {
  path: string;
  title: string;
  snippet: string;
}

// ---------------------------------------------------------------------------
// Build helper
// ---------------------------------------------------------------------------

export function buildSearchIndex(docs: SearchDoc[]): MiniSearch<SearchDoc> {
  const index = new MiniSearch<SearchDoc>({
    fields: ["title", "tags", "body"],
    storeFields: ["path", "title"],
    idField: "path",
  });
  index.addAll(docs);
  return index;
}

// ---------------------------------------------------------------------------
// Module-level SHA cache
// ---------------------------------------------------------------------------

interface IndexCache {
  sha: string;
  index: MiniSearch<SearchDoc>;
  bodyByPath: Map<string, string>;
  titleByPath: Map<string, string>;
}

let _cache: IndexCache | null = null;

/**
 * Build (or reuse) the SHA-keyed vault index. Shared by full-text search and
 * unlinked-mention scanning so the zipball is downloaded/parsed at most once
 * per HEAD commit.
 */
async function ensureCache(): Promise<IndexCache> {
  const sha = await getHeadSha();
  if (_cache !== null && _cache.sha === sha) return _cache;

  const buf = await getZipball();
  const entries = unzipSync(new Uint8Array(buf));
  const dec = new TextDecoder();

  const docs: SearchDoc[] = [];
  const bodyByPath = new Map<string, string>();
  const titleByPath = new Map<string, string>();

  for (const [zipPath, bytes] of Object.entries(entries)) {
    if (!zipPath.endsWith(".md")) continue;
    const relPath = stripTopLevelDir(zipPath);
    if (!isVaultNote(relPath)) continue;

    const raw = dec.decode(bytes);
    const parsed = parseMarkdown(relPath, raw);
    const body = extractBodyText(raw);

    docs.push({ path: relPath, title: parsed.title, tags: parsed.tags.join(" "), body });
    bodyByPath.set(relPath, body);
    titleByPath.set(relPath, parsed.title);
  }

  _cache = { sha, index: buildSearchIndex(docs), bodyByPath, titleByPath };
  return _cache;
}

export interface UnlinkedMention {
  path: string;
  title: string;
  snippet: string;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Finds notes that mention `title` as plain text WITHOUT a `[[wikilink]]` —
 * Obsidian-style "unlinked mentions". Scans the cached body text; excludes the
 * note itself and any note that already links to it.
 */
export async function findUnlinkedMentions(
  title: string,
  selfPath: string,
): Promise<UnlinkedMention[]> {
  const needle = title.trim();
  if (needle.length < 3) return []; // too-short titles produce noise
  const cache = await ensureCache();
  const esc = escapeRegExp(needle);
  // Mention as a token, not immediately inside a wikilink bracket.
  const mentionRe = new RegExp(`(^|[^\\w[])${esc}(?![\\w\\]])`, "i");
  const linkedRe = new RegExp(`\\[\\[\\s*${esc}(\\||#|\\])`, "i");

  const out: UnlinkedMention[] = [];
  for (const [path, body] of cache.bodyByPath) {
    if (path === selfPath) continue;
    if (linkedRe.test(body)) continue; // already wikilinked → it's a backlink
    if (!mentionRe.test(body)) continue;
    out.push({ path, title: cache.titleByPath.get(path) ?? path, snippet: makeSnippet(body, needle) });
    if (out.length >= 30) break;
  }
  return out;
}

/** Reset the module-level cache. Intended for use in tests only. */
export function _resetSearchCache(): void {
  _cache = null;
}

// ---------------------------------------------------------------------------
// Snippet helper
// ---------------------------------------------------------------------------

function makeSnippet(body: string, query: string, maxLen = 120): string {
  const terms = query
    .trim()
    .split(/\s+/)
    .filter((t) => t.length > 0);

  for (const term of terms) {
    // Escape regex metacharacters — query terms are user input (ReDoS/throw guard).
    const re = new RegExp(escapeRegExp(term), "i");
    const idx = body.search(re);
    if (idx !== -1) {
      const start = Math.max(0, idx - 40);
      const end = Math.min(body.length, idx + 80);
      const raw = body.slice(start, end).trim();
      const prefix = start > 0 ? "…" : "";
      const suffix = end < body.length ? "…" : "";
      return prefix + raw.slice(0, maxLen) + suffix;
    }
  }

  // Fallback: first maxLen chars
  const fallback = body.slice(0, maxLen).trim();
  return fallback + (body.length > maxLen ? "…" : "");
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Searches vault notes using MiniSearch full-text search.
 * Rebuilds the index only when HEAD SHA changes; otherwise serves from cache.
 */
export async function searchNotes(query: string): Promise<SearchResult[]> {
  const cache = await ensureCache();

  const hits = cache.index.search(query, { prefix: true, fuzzy: 0.2 });
  const capped = hits.slice(0, 30);

  return capped.map((hit) => {
    // MiniSearch returns stored fields alongside id/score/terms/match
    const path = (hit as unknown as { path: string }).path ?? (hit.id as string);
    const title = (hit as unknown as { title: string }).title ?? path;
    const body = cache.bodyByPath.get(path) ?? "";
    const snippet = makeSnippet(body, query);
    return { path, title, snippet };
  });
}
