"use client";

/**
 * use-snapshot — thin re-export from SnapshotProvider.
 *
 * Consumers (FileTree, EditorPane, Backlinks, Outline) import `useSnapshot`
 * from this file; they are now served by the single shared provider instead
 * of making independent fetch calls.
 *
 * The `SnapshotState` type is re-exported for backward compatibility.
 */

export type { SnapshotState } from "@/modules/vault/presentation/SnapshotProvider";
export { useSnapshot } from "@/modules/vault/presentation/SnapshotProvider";
