/**
 * Application use-case: GetSnapshot.
 *
 * Fetches the vault's latest GitHub zipball, parses all .md files into
 * ParsedNotes, builds a LinkIndex, then assembles and caches a VaultSnapshot.
 *
 * Pure application logic: no framework imports, no infrastructure imports,
 * no env access. All side-effecting dependencies are injected via ports.
 */

import { unzipSync } from "fflate";
import { buildLinkIndex } from "@/modules/vault/domain/link-index";
import { decodeStrict } from "@/modules/mdmax/domain/shape-gate";
import type { VaultReader, NoteParserFn } from "./ports";
import type { VaultSnapshot, TreeNode, NoteMeta } from "./dto";

// ---------------------------------------------------------------------------
// Cache port (narrow interface so infrastructure can implement it)
// ---------------------------------------------------------------------------

export interface SnapshotCache {
  get(sha: string): VaultSnapshot | null;
  set(sha: string, snapshot: VaultSnapshot): void;
}

// ---------------------------------------------------------------------------
// Internal: build a nested TreeNode from a list of vault-relative paths
// ---------------------------------------------------------------------------

function ensureFolderPath(root: TreeNode, segments: readonly string[]): void {
  let current = root;
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    if (seg === undefined) continue;
    const partial = segments.slice(0, i + 1).join("/");
    current.children ??= [];
    let folder = current.children.find((c) => c.name === seg && c.type === "folder");
    if (!folder) {
      folder = { name: seg, path: partial, type: "folder", children: [] };
      current.children.push(folder);
    }
    current = folder;
  }
}

function buildTree(paths: readonly string[]): TreeNode {
  const root: TreeNode = { name: "", path: "", type: "folder", children: [] };

  for (const filePath of paths) {
    const segments = filePath.split("/");
    let current = root;

    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      if (seg === undefined) continue;
      const isLast = i === segments.length - 1;
      const partialPath = segments.slice(0, i + 1).join("/");

      if (isLast) {
        // File node
        current.children ??= [];
        current.children.push({ name: seg, path: partialPath, type: "file" });
      } else {
        // Folder node — find or create
        current.children ??= [];
        let folder = current.children.find(
          (c) => c.name === seg && c.type === "folder",
        );
        if (folder === undefined) {
          folder = { name: seg, path: partialPath, type: "folder", children: [] };
          current.children.push(folder);
        }
        current = folder;
      }
    }
  }

  return root;
}

// ---------------------------------------------------------------------------
// Vault scope: the repo is both the Next.js app AND the note vault. Only the
// note files are part of the vault — exclude the app's own directories so app
// code/docs (READMEs, plans, specs) never appear in the notes tree.
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
  if (relPath === "README.md") return false; // repo readme, not a note
  return !NON_VAULT_PREFIXES.some((prefix) => relPath.startsWith(prefix));
}

// ---------------------------------------------------------------------------
// Internal: strip the first path segment (GitHub zipball top-level dir)
// e.g. "repo-abc123/Projects/HQ/HQ.md" → "Projects/HQ/HQ.md"
// ---------------------------------------------------------------------------

function stripTopLevelDir(zipPath: string): string {
  const slashIdx = zipPath.indexOf("/");
  if (slashIdx === -1) return zipPath;
  return zipPath.slice(slashIdx + 1);
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

export function makeGetSnapshot(deps: {
  reader: VaultReader;
  cache: SnapshotCache;
  parseNote?: NoteParserFn;
}): () => Promise<VaultSnapshot> {
  const { reader, cache, parseNote } = deps;

  // In-flight de-duplication. The shell fires several snapshot-dependent
  // requests on mount (/api/vault/snapshot, /api/share/conflicts, …). On a
  // cold cache each would otherwise download + unzip + parse the WHOLE repo
  // zipball independently — N× the work and N× the GitHub bandwidth, all
  // contending on the single dev thread. Key the in-flight promise by sha so
  // every concurrent caller awaits ONE build.
  const inFlight = new Map<string, Promise<VaultSnapshot>>();

  return async function getSnapshot(): Promise<VaultSnapshot> {
    const sha = await reader.getHeadSha();

    const cached = cache.get(sha);
    if (cached !== null) {
      return cached;
    }

    const pending = inFlight.get(sha);
    if (pending !== undefined) {
      return pending;
    }

    const build = buildSnapshot(sha).finally(() => inFlight.delete(sha));
    inFlight.set(sha, build);
    return build;
  };

  async function buildSnapshot(sha: string): Promise<VaultSnapshot> {
    // Fetch and unzip
    const buf = await reader.getZipball();
    const entries = unzipSync(new Uint8Array(buf));

    // Decode markdown files, strip top-level dir prefix
    const rawNotes: Array<{ path: string; content: string }> = [];
    // Track folders made visible by an explicit `.gitkeep` placeholder
    // (so "New folder" can show an empty folder in the tree).
    const explicitFolders: string[] = [];

    for (const [zipPath, bytes] of Object.entries(entries)) {
      const relPath = stripTopLevelDir(zipPath);
      if (zipPath.endsWith(".md")) {
        if (!isVaultNote(relPath)) continue;
        // Strict decode, never lossy. A non-fatal TextDecoder would silently
        // turn an invalid byte into U+FFFD, and that mojibake is what gets
        // committed back to git on the note's next save — permanently, and
        // without the user ever knowing a byte changed. Refusing leaves the
        // file untouched on disk; it just can't appear in this snapshot.
        const decoded = decodeStrict(bytes);
        if (!decoded.ok) {
          // decodeStrict only ever fails with INVALID_UTF8 — the `at` field belongs to that
          // variant of the wider ShapeFailure union it shares with shapeGate.
          const where = decoded.reason === "INVALID_UTF8" ? ` at line ${decoded.at.line}, col ${decoded.at.col}` : "";
          console.error(`[vault] skipping ${relPath}: invalid UTF-8${where}`);
          continue;
        }
        rawNotes.push({ path: relPath, content: decoded.text });
        continue;
      }
      if (zipPath.endsWith("/.gitkeep") && isVaultNote(relPath)) {
        const folder = relPath.slice(0, -"/.gitkeep".length);
        if (folder) explicitFolders.push(folder);
      }
    }

    // Parse + build link index
    // parseNote may be undefined in tests that don't need markdown parsing features;
    // a no-op stub is used in that case.
    const parser: NoteParserFn =
      parseNote ??
      ((path, _raw) => ({
        path,
        title: path.replace(/\.md$/, "").split("/").pop() ?? path,
        tags: [],
        outbound: [],
        embeds: [],
        frontmatter: {},
        excludeFromGraph: path.startsWith("_Archive/") || path.startsWith("_Trash/"),
      }));

    const parsedNotes = rawNotes.map(({ path, content }) =>
      parser(path, content),
    );
    const linkIndex = buildLinkIndex(parsedNotes);

    // Assemble NoteMeta[]
    const notes: NoteMeta[] = parsedNotes.map((note) => {
      const entry = linkIndex.get(note.path);
      const slugRaw = (note.frontmatter as Record<string, unknown>)["public_slug"];
      const publicSlug = typeof slugRaw === "string" && slugRaw.trim().length > 0 ? slugRaw.trim() : undefined;
      return {
        path: note.path,
        title: note.title,
        tags: [...note.tags],
        outbound: [...note.outbound],
        backlinks: entry ? [...entry.backlinks] : [],
        excludeFromGraph: note.excludeFromGraph,
        ...(publicSlug !== undefined ? { publicSlug } : {}),
      };
    });

    // Build nested tree. Exclude _Trash/ (soft-deleted notes stay in notes[]
    // for the Trash UI, but must not appear in the file tree). Include explicit
    // (empty) folders so the UI shows them.
    const sortedPaths = notes
      .map((n) => n.path)
      .filter((p) => !p.startsWith("_Trash/"))
      .sort();
    const tree = buildTree(sortedPaths);
    // Stitch in folders that have no notes yet (just a .gitkeep marker).
    for (const folder of explicitFolders) {
      ensureFolderPath(tree, folder.split("/"));
    }

    const snapshot: VaultSnapshot = {
      sha,
      generatedAt: new Date().toISOString(),
      tree,
      notes,
    };

    cache.set(sha, snapshot);
    return snapshot;
  }
}
