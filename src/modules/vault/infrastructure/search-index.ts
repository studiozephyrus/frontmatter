/**
 * Infrastructure: full-text search index over vault notes.
 *
 * Uses MiniSearch with a SHA-keyed module-level cache so the index is only
 * rebuilt when the HEAD commit changes. No process.env access — all GitHub
 * I/O goes through the shared github/client helpers.
 */

import MiniSearch, {
  type SearchOptions,
  type SearchResult as MiniSearchHit,
} from "minisearch";
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

const FRONTMATTER_RE = /^---\r?\n[\s\S]*?\r?\n---\r?\n?/;
const FENCED_CODE_RE = /```[\s\S]*?```/g;
const INLINE_CODE_RE = /`[^`]*`/g;

/**
 * Produces the PROSE-ONLY text of a note: frontmatter, fenced code blocks and
 * inline code spans removed.
 *
 * Code is excluded here on purpose — this text backs unlinked-mention scanning,
 * where a note title appearing inside a code sample is a false positive, not a
 * mention. Code is indexed separately by `extractCodeText` so it stays
 * searchable. This is purely additive — does not affect parseMarkdown.
 */
function extractBodyText(raw: string): string {
  let text = raw.replace(FRONTMATTER_RE, "");
  text = text.replace(FENCED_CODE_RE, "");
  text = text.replace(INLINE_CODE_RE, "");
  return text;
}

/**
 * Produces the CODE-ONLY text of a note: the contents of every fenced block and
 * inline code span, concatenated.
 *
 * Without this, code content is unfindable: `extractBodyText` deletes every
 * fence and span before indexing. Indexed as its own MiniSearch field so a
 * query can match a symbol, a command or a config key without polluting
 * unlinked mentions.
 *
 * NOT covered here: GFM tables. They contain neither a fence nor a code span,
 * so they flow to `body` with their pipes intact — and MiniSearch's tokenizer
 * splits on `\p{Z}\p{P}` but NOT on `\p{S}`, which leaves `|` attached. A
 * compact row `|Name|Type|` therefore indexes as ONE token and no cell word in
 * it is retrievable; the same row written `| Name | Type |` indexes each word
 * correctly. Measured on this repo. Emission style, not extraction, is the fix.
 */
function extractCodeText(raw: string): string {
  const withoutFrontmatter = raw.replace(FRONTMATTER_RE, "");
  const parts: string[] = [];

  for (const block of withoutFrontmatter.match(FENCED_CODE_RE) ?? []) {
    // Drop the opening fence + info string and the closing fence.
    parts.push(block.replace(/^```[^\n]*\n?/, "").replace(/```$/, ""));
  }
  for (const span of withoutFrontmatter.match(INLINE_CODE_RE) ?? []) {
    parts.push(span.slice(1, -1));
  }

  return parts.join("\n");
}

// ---------------------------------------------------------------------------
// MiniSearch types
// ---------------------------------------------------------------------------

interface SearchDoc {
  path: string;
  title: string;
  tags: string;
  body: string;
  code: string;
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
    fields: ["title", "tags", "body", "code"],
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
  /** Prose only — backs unlinked mentions and snippets. */
  bodyByPath: Map<string, string>;
  /** Code only — backs snippets for hits that matched inside a code block. */
  codeByPath: Map<string, string>;
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
  const codeByPath = new Map<string, string>();
  const titleByPath = new Map<string, string>();

  for (const [zipPath, bytes] of Object.entries(entries)) {
    if (!zipPath.endsWith(".md")) continue;
    const relPath = stripTopLevelDir(zipPath);
    if (!isVaultNote(relPath)) continue;

    const raw = dec.decode(bytes);
    const parsed = parseMarkdown(relPath, raw);
    const body = extractBodyText(raw);
    const code = extractCodeText(raw);

    docs.push({ path: relPath, title: parsed.title, tags: parsed.tags.join(" "), body, code });
    bodyByPath.set(relPath, body);
    codeByPath.set(relPath, code);
    titleByPath.set(relPath, parsed.title);
  }

  _cache = { sha, index: buildSearchIndex(docs), bodyByPath, codeByPath, titleByPath };
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

/** True when any whitespace-separated term of `query` occurs in `text`. */
function containsAnyTerm(text: string, query: string): boolean {
  if (text === "") return false;
  return query
    .trim()
    .split(/\s+/)
    .filter((t) => t.length > 0)
    .some((term) => new RegExp(escapeRegExp(term), "i").test(text));
}

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
 * Search strategy: precision first, then recall, then typo-tolerance.
 *
 * The previous single pass was `{ prefix: true, fuzzy: 0.2 }` over an implicit
 * OR. Both settings were actively harmful. MiniSearch computes
 * `maxDistance = min(6, round(len * 0.2))`, so ANY term of 8+ characters admits
 * edit distance 2 — `snapshot` matched `snapchat`, `policy` matched `police`,
 * `graphify` matched `graphics`. With OR combination, `tauri build` matched 64%
 * of the vault and the 30-result cap then discarded 98.9% of matches unranked.
 *
 * Measured against a relevance set built from the vault's own wikilinks (every
 * `[[link]]` is a human assertion that a passage is about a note): on a sentence
 * lifted verbatim from a note, the old configuration ranked that note first
 * 0.33% of the time. Exact-only is ~16x better on MRR at ~90% lower latency;
 * AND-combination alone was worth 10x.
 *
 * Rather than pick one setting, run up to three passes and stop at the first
 * that returns anything. Fuzzy still exists as a typo safety net, but it can no
 * longer outrank or crowd out an exact match, because it only runs when exact
 * matching found nothing at all.
 */
const SEARCH_PASSES: readonly SearchOptions[] = [
  // 1. Precision: every term must match. Prefix on the last term only —
  //    that is what prefix is for (live-as-you-type), not whole-query expansion.
  { combineWith: "AND", prefix: (_t, i, terms) => i === terms.length - 1 },
  // 2. Recall: any term may match. Catches over-specified multi-word queries.
  { combineWith: "OR", prefix: (_t, i, terms) => i === terms.length - 1 },
  // 3. Typo tolerance, last resort only. A fuzzy value >= 1 is an ABSOLUTE edit
  //    distance in MiniSearch (`maxDistance = fuzzy < 1 ? round(len*fuzzy) : fuzzy`),
  //    so `1` means one edit for every term regardless of length. That is what
  //    kills the old junk — `snapshot`/`snapchat` and `graphify`/`graphics` are
  //    both distance 2 — while still catching a real single-character typo.
  { combineWith: "OR", fuzzy: 1 },
];

/**
 * Searches vault notes using MiniSearch full-text search.
 * Rebuilds the index only when HEAD SHA changes; otherwise serves from cache.
 */
export async function searchNotes(query: string): Promise<SearchResult[]> {
  const cache = await ensureCache();

  let hits: MiniSearchHit[] = [];
  for (const opts of SEARCH_PASSES) {
    hits = cache.index.search(query, opts);
    if (hits.length > 0) break;
  }
  const capped = hits.slice(0, 30);

  return capped.map((hit) => {
    // MiniSearch returns stored fields alongside id/score/terms/match
    const path = (hit as unknown as { path: string }).path ?? (hit.id as string);
    const title = (hit as unknown as { title: string }).title ?? path;
    const body = cache.bodyByPath.get(path) ?? "";
    const code = cache.codeByPath.get(path) ?? "";
    // A hit may have matched only inside a code block. Snippet from whichever
    // text actually contains a query term, so those results show the match
    // rather than the first 120 characters of unrelated prose.
    const source = containsAnyTerm(body, query) || !code ? body : code;
    return { path, title, snippet: makeSnippet(source, query) };
  });
}
