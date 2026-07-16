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

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
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

  // 4. Build included path set for fast membership checks
  const includedPaths = new Set(included.map((n) => n.path));

  // 5. Build links with deduplication
  const seenLinks = new Set<string>();
  const links: GraphLink[] = [];

  for (const note of included) {
    for (const outbound of note.outbound) {
      const targetPath = basenameToPath.get(outbound);
      if (targetPath === undefined) continue; // unresolved — drop
      if (targetPath === note.path) continue; // self-link — drop
      if (!includedPaths.has(targetPath)) continue; // target excluded — drop

      const key = `${note.path}→${targetPath}`;
      if (seenLinks.has(key)) continue; // duplicate — drop
      seenLinks.add(key);

      links.push({ source: note.path, target: targetPath });
    }
  }

  return { nodes, links };
}
