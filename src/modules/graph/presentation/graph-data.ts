/**
 * Pure graph-data utilities — no React, no framework imports.
 * Safe to import from tests and from client components.
 */

import type { NoteMeta } from "@/modules/vault";
import { setBasenameEntry } from "@/modules/vault/domain/link-index";

// ---------------------------------------------------------------------------
// Group type
// ---------------------------------------------------------------------------

export type NoteGroup =
  | "moc"
  | "project"
  | "course"
  | "research"
  | "markets"
  | "prompts"
  | "marketing"
  | "qa"
  | "default";

// ---------------------------------------------------------------------------
// Color palette (matches .obsidian/graph.json)
// ---------------------------------------------------------------------------

export const COLORS: Record<NoteGroup, string> = {
  moc: "#e6b800",
  project: "#4f8ff7",
  course: "#46c46e",
  research: "#a062f0",
  markets: "#f0913a",
  prompts: "#36c5d9",
  marketing: "#f25c9c",
  qa: "#f25c9c",
  default: "#9a9a9a",
};

// ---------------------------------------------------------------------------
// groupForTags
// Priority: moc → project → course → research → markets → prompts → marketing → qa → default
// Tags are stored WITHOUT '#', e.g. "moc", "project/hq", "markets"
// ---------------------------------------------------------------------------

export function groupForTags(tags: string[]): NoteGroup {
  for (const tag of tags) {
    if (tag === "moc") return "moc";
  }
  for (const tag of tags) {
    if (tag.startsWith("project/") || tag === "project") return "project";
  }
  for (const tag of tags) {
    if (tag.startsWith("course/") || tag === "course") return "course";
  }
  for (const tag of tags) {
    if (tag.startsWith("research/") || tag === "research") return "research";
  }
  for (const tag of tags) {
    if (tag === "markets" || tag.startsWith("markets/")) return "markets";
  }
  for (const tag of tags) {
    if (tag === "prompts" || tag.startsWith("prompts/")) return "prompts";
  }
  for (const tag of tags) {
    if (tag === "marketing" || tag.startsWith("marketing/")) return "marketing";
  }
  for (const tag of tags) {
    if (tag === "qa" || tag.startsWith("qa/")) return "qa";
  }
  return "default";
}

// ---------------------------------------------------------------------------
// Graph node / link types
// ---------------------------------------------------------------------------

export interface GraphNode {
  id: string;
  label: string;
  group: NoteGroup;
  color: string;
}

export interface GraphLink {
  source: string;
  target: string;
}

/**
 * An outbound wikilink whose target could not be resolved to an included note.
 *
 * These are NOT graph edges — they have no target node to attach to — but they
 * are the single most useful diagnostic the graph can produce: a broken link,
 * or a note that has been referenced but not yet written. Dropping them
 * silently loses that signal, so they are reported alongside the graph.
 */
export interface UnresolvedLink {
  /** Path of the note containing the link. */
  source: string;
  /** The unresolved link target, as written. */
  target: string;
  reason: "no-such-note" | "target-excluded";
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
  unresolved: UnresolvedLink[];
}

// ---------------------------------------------------------------------------
// buildGraph
// ---------------------------------------------------------------------------

export function buildGraph(notes: NoteMeta[]): GraphData {
  // 1. Exclude notes that opt-out
  const included = notes.filter((n) => !n.excludeFromGraph);

  // 2. Build basename→path map (basename = last segment without .md). Use the
  // shared deterministic collision rule so the graph resolves the same way as
  // the editor / preview / domain link index.
  const basenameToPath = new Map<string, string>();
  for (const note of included) {
    setBasenameEntry(basenameToPath, note.path);
  }

  // Diagnosis-only map over EVERY note, including opted-out ones. Resolution
  // still uses `basenameToPath` (included notes only) so graph edges are
  // unchanged; this map exists solely to tell "the note does not exist" apart
  // from "the note exists but opted out of the graph", which are different
  // problems for the author.
  const allBasenameToPath = new Map<string, string>();
  for (const note of notes) {
    setBasenameEntry(allBasenameToPath, note.path);
  }

  // 3. Build node list
  const nodes: GraphNode[] = included.map((note) => {
    const group = groupForTags(note.tags);
    return {
      id: note.path,
      label: note.title,
      group,
      color: COLORS[group],
    };
  });

  // 4. Build links with deduplication
  //
  // Note: there is no separate "is the target included?" check. `basenameToPath`
  // is built from included notes only, so anything it resolves is included by
  // construction; the old check could never fire. Exclusion is detected on the
  // unresolved path instead, via `allBasenameToPath`.
  const seenLinks = new Set<string>();
  const links: GraphLink[] = [];
  const unresolved: UnresolvedLink[] = [];
  const seenUnresolved = new Set<string>();

  const reportUnresolved = (
    source: string,
    target: string,
    reason: UnresolvedLink["reason"],
  ): void => {
    const key = `${source}→${target}`;
    if (seenUnresolved.has(key)) return;
    seenUnresolved.add(key);
    unresolved.push({ source, target, reason });
  };

  for (const note of included) {
    for (const outbound of note.outbound) {
      const targetPath = basenameToPath.get(outbound);
      // Unresolved links are not edges — there is no node to point at — but
      // they are a diagnostic, so they are reported rather than dropped.
      if (targetPath === undefined) {
        // Distinguish a genuinely missing note from one that merely opted out.
        const existsButExcluded = allBasenameToPath.has(outbound);
        reportUnresolved(
          note.path,
          outbound,
          existsButExcluded ? "target-excluded" : "no-such-note",
        );
        continue;
      }
      if (targetPath === note.path) continue; // self-link — not an edge

      const key = `${note.path}→${targetPath}`;
      if (seenLinks.has(key)) continue; // duplicate — drop
      seenLinks.add(key);

      links.push({ source: note.path, target: targetPath });
    }
  }

  return { nodes, links, unresolved };
}
