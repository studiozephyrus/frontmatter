"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { listDirtyPaths } from "@/modules/drafts";
import { useEditorStore } from "@/modules/editor";
import { useSnapshot } from "./use-snapshot";
import { orderTree } from "./tree-order";
import { TreeItem, moveNote } from "./file-tree/TreeItem";
import { ContextMenu } from "./file-tree/ContextMenu";
import { GoogleIcon } from "@/shared/presentation/GoogleIcon";
import type { MenuEntry, WindowWithFileTreeActions } from "./file-tree/types";

// ---------------------------------------------------------------------------
// Public surface re-exported from extracted modules
// ---------------------------------------------------------------------------

export { openNewNoteDialog } from "./file-tree/FileTreeActions";

/** Notify the SnapshotProvider to refetch the vault. Exported for callers
 *  outside this module (e.g., the AI Link Doctor commit flow). */
export function dispatchVaultChanged(): void {
  window.dispatchEvent(new CustomEvent("sgnk:vault-changed"));
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/** Memoized orderTree — skips the deep-copy + recursive sort while the
 *  snapshot sha is unchanged. Both sha and tree are listed in the deps so a
 *  caller that mutates the tree without bumping the sha still gets a fresh
 *  ordering (defensive — every known producer bumps sha on mutation). */
function useOrderedTree<T>(tree: T | null | undefined, sha: string | undefined) {
  return useMemo(
    () => (tree == null ? null : orderTree(tree as unknown as Parameters<typeof orderTree>[0])),
    [sha, tree],
  );
}

// ---------------------------------------------------------------------------
// Public component
// ---------------------------------------------------------------------------

interface FileTreeProps {
  onOpen?: (path: string) => void;
}

export function FileTree({ onOpen }: FileTreeProps) {
  const state = useSnapshot();

  // Select STABLE references from the store. Returning a new object/Set from a
  // Zustand selector triggers an infinite re-render loop (v5 compares by Object.is).
  const tabs = useEditorStore((s) => s.tabs);
  const activePath = useEditorStore((s) => s.activePath);

  // Seed persisted drafts (files not open but with a stored draft after reload).
  // Re-read on every vault-changed so saves/commits/AI-accepts flush stale
  // dirty markers — the previous empty-deps useEffect only read once at mount.
  const [persistedDirty, setPersistedDirty] = useState<ReadonlySet<string>>(new Set());
  // Root-level context-menu anchor — declared HERE (before any early return)
  // so the hook order stays stable across the loading → loaded transition.
  const [rootCtx, setRootCtx] = useState<{ x: number; y: number } | null>(null);
  useEffect(() => {
    const refresh = () => setPersistedDirty(new Set(listDirtyPaths()));
    refresh();
    window.addEventListener("sgnk:vault-changed", refresh);
    return () => window.removeEventListener("sgnk:vault-changed", refresh);
  }, []);

  // Derive the dirty set in render (memoized) — NOT inside a selector.
  const dirtyPaths: ReadonlySet<string> = useMemo(
    () => new Set([...persistedDirty, ...tabs.filter((t) => t.dirty).map((t) => t.path)]),
    [persistedDirty, tabs],
  );

  // Stable onOpen ref so memoized TreeItem children don't churn each render.
  const handleOpen = useCallback(
    (path: string) => {
      useEditorStore.getState().openTab(path);
      onOpen?.(path);
    },
    [onOpen],
  );

  // orderTree deep-copies + recursively sorts the whole vault — was O(n log n)
  // on every render. Memoize on the snapshot sha so child node refs stay
  // stable and the memoized TreeItem can skip work on unaffected branches.
  // MUST be called unconditionally, BEFORE the early returns below, so the hook
  // order stays stable across the loading → loaded transition (else React #310).
  const root = useOrderedTree(state.snapshot?.tree, state.snapshot?.sha);

  if (state.loading) {
    return (
      <div className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
        Loading…
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
        {state.error === "unauthorized" ? "Not signed in" : `Error: ${state.error}`}
      </div>
    );
  }

  const topLevel = root?.children ?? [];

  const rootMenu: MenuEntry[] = [
    { label: "New note", onClick: () => (window as WindowWithFileTreeActions).__fileTreeActions?.newNoteInFolder("") },
    { label: "New folder", onClick: () => (window as WindowWithFileTreeActions).__fileTreeActions?.newFolderIn("") },
  ];

  return (
    <>
      <div className="flex items-center justify-between px-2" style={{ height: "32px", flexShrink: 0 }}>
        <span
          style={{
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--muted)",
          }}
        >
          Notes
        </span>
        <div style={{ display: "flex", gap: 4 }}>
          <button
            aria-label="New folder"
            onClick={() => (window as WindowWithFileTreeActions).__fileTreeActions?.newFolderIn("")}
            className="sgnk-icon-btn"
            title="New folder"
          >
            <GoogleIcon name="create_new_folder" size={16} weight={500} />
          </button>
          <button
            aria-label="New note"
            onClick={() => (window as WindowWithFileTreeActions).__fileTreeActions?.newNoteInFolder("")}
            className="sgnk-icon-btn"
            title="New note"
          >
            <GoogleIcon name="note_add" size={16} weight={500} />
          </button>
        </div>
      </div>

      <div
        className="sgnk-tree-scroll mt-0.5 min-h-0 flex-1 overflow-y-auto"
        onContextMenu={(e) => {
          // Only fire root menu when right-click is on the empty tree gutter,
          // NOT on a child node (children call stopPropagation via their own handlers).
          if (e.target === e.currentTarget) {
            e.preventDefault();
            setRootCtx({ x: e.clientX, y: e.clientY });
          }
        }}
        onDragOver={(e) => {
          // Allow dropping a note onto the empty gutter to move it to the root.
          if (e.target === e.currentTarget && e.dataTransfer.types.includes("application/x-sgnk-path")) {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
          }
        }}
        onDrop={(e) => {
          if (e.target !== e.currentTarget) return;
          const src = e.dataTransfer.getData("application/x-sgnk-path");
          if (!src) return;
          e.preventDefault();
          // Move to root ("") — handles collision + tab/draft migration.
          void moveNote(src, "");
        }}
      >
        {topLevel.map((node) => (
          <TreeItem
            key={node.path}
            node={node}
            depth={0}
            onOpen={handleOpen}
            dirtyPaths={dirtyPaths}
            activePath={activePath}
          />
        ))}
      </div>

      {rootCtx && <ContextMenu items={rootMenu} anchor={rootCtx} onClose={() => setRootCtx(null)} />}
    </>
  );
}
