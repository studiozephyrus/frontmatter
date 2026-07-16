/**
 * Data Transfer Objects for the vault snapshot.
 * Pure types and Zod schemas — no framework imports, no env reads.
 */

import { z } from "zod";

// ---------------------------------------------------------------------------
// TreeNode — recursive nested folder/file structure
// ---------------------------------------------------------------------------

export interface TreeNode {
  name: string;
  path: string;
  type: "folder" | "file";
  children?: TreeNode[];
}

// Zod schema for TreeNode (recursive)
const TreeNodeSchemaBase = z.object({
  name: z.string(),
  path: z.string(),
  type: z.enum(["folder", "file"]),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TreeNodeSchema: z.ZodType<any> = TreeNodeSchemaBase.extend({
  children: z.lazy(() => z.array(TreeNodeSchema)).optional(),
});

// ---------------------------------------------------------------------------
// NoteMeta — per-note metadata in the snapshot
// ---------------------------------------------------------------------------

export interface NoteMeta {
  path: string;
  title: string;
  tags: string[];
  outbound: string[];
  backlinks: string[];
  excludeFromGraph: boolean;
  /** Public share slug from frontmatter `public_slug:` — undefined when not shared. */
  publicSlug?: string;
}

export const NoteMetaSchema = z.object({
  path: z.string(),
  title: z.string(),
  tags: z.array(z.string()),
  outbound: z.array(z.string()),
  backlinks: z.array(z.string()),
  excludeFromGraph: z.boolean(),
  publicSlug: z.string().optional(),
});

// ---------------------------------------------------------------------------
// VaultSnapshot — the full snapshot DTO
// ---------------------------------------------------------------------------

export interface VaultSnapshot {
  sha: string;
  generatedAt: string;
  tree: TreeNode;
  notes: NoteMeta[];
}

export const VaultSnapshotSchema = z.object({
  sha: z.string(),
  generatedAt: z.string(),
  tree: TreeNodeSchema,
  notes: z.array(NoteMetaSchema),
});
