import { memo, useEffect, useState } from "react";
import { useEditorStore, applyPathRename } from "@/modules/editor";
import { GoogleIcon } from "@/shared/presentation/GoogleIcon";
import { ContextMenu } from "./ContextMenu";
import { folderOf } from "./path-utils";
import type { MenuEntry, TreeItemProps, WindowWithFileTreeActions } from "./types";

const OPEN_KEY_PREFIX = "sgnk-tree-open:";
const DND_MIME = "application/x-sgnk-path";

/** Surface a transient message via the file-tree toast bus. */
function toast(message: string): void {
  window.dispatchEvent(new CustomEvent("sgnk:toast", { detail: { message } }));
}

/** Move a note into a target folder ("" = root) via the rename/relink API. */
export async function moveNote(oldPath: string, targetFolder: string): Promise<void> {
  const base = oldPath.split("/").pop();
  if (!base) return;
  // Never move into the trash/archive system folders via drag-drop.
  if (targetFolder === "_Trash" || targetFolder.startsWith("_Trash/") ||
      targetFolder === "_Archive" || targetFolder.startsWith("_Archive/")) {
    toast("Can't move notes into system folders");
    return;
  }
  // Guard against dragging a folder/note onto itself or one of its own
  // descendants — otherwise the API receives a path like `Folder/Sub/Folder`
  // which silently creates phantom paths.
  if (targetFolder === oldPath || targetFolder.startsWith(`${oldPath}/`)) {
    toast("Can't move a folder into itself");
    return;
  }
  const newPath = targetFolder === "" ? base : `${targetFolder}/${base}`;
  if (newPath === oldPath) return; // already in this folder — no-op
  // Optimistic UX: migrate the open tab + draft to the new path *before* the
  // GitHub round-trip so the editor doesn't blink. The sidebar tree catches
  // up after the snapshot refresh. Roll back on 409/error.
  await applyPathRename(oldPath, newPath);
  try {
    const res = await fetch("/api/vault/rename", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ oldPath, newPath }),
    });
    if (res.ok) {
      window.dispatchEvent(new CustomEvent("sgnk:vault-changed"));
    } else if (res.status === 409) {
      await applyPathRename(newPath, oldPath);
      toast(`A note named "${base}" already exists there`);
    } else {
      await applyPathRename(newPath, oldPath);
      toast("Move failed");
    }
  } catch {
    await applyPathRename(newPath, oldPath);
    toast("Move failed");
  }
}
/** Folders with this many or more children collapse by default to keep the
 *  sidebar usable on big vaults (e.g. Skills/ with 13 cat subfolders or any
 *  cat with >20 leaf folders). User toggle still wins (persisted per path). */
const BIG_FOLDER_THRESHOLD = 14;

function readPersistedOpen(path: string): boolean | null {
  try {
    const v = localStorage.getItem(OPEN_KEY_PREFIX + path);
    if (v === "open") return true;
    if (v === "closed") return false;
    return null;
  } catch {
    return null;
  }
}

function writePersistedOpen(path: string, open: boolean): void {
  try {
    localStorage.setItem(OPEN_KEY_PREFIX + path, open ? "open" : "closed");
  } catch {
    /* ignore */
  }
}

/** Recursive renderer for one node (file or folder) in the vault tree.
 *  Memoized: with a memoized `orderTree` upstream + stable `onOpen` /
 *  `dirtyPaths` / `activePath` refs, a single mutation re-renders only the
 *  affected branch instead of cascading through every node. */
function TreeItemImpl({ node, depth, onOpen, dirtyPaths, activePath }: TreeItemProps) {
  const isArchive = node.name === "_Archive";
  const dimmed = isArchive;
  const isFolder = node.type === "folder";
  const childCount = node.children?.length ?? 0;
  const isBig = isFolder && childCount >= BIG_FOLDER_THRESHOLD;

  // Default: depth 0 open UNLESS folder is "big" (collapse big vaults so the
  // sidebar stays usable). Persisted user choice (localStorage) overrides.
  const defaultOpen = depth === 0 && !isBig;
  const [open, setOpen] = useState<boolean>(defaultOpen);
  // Hydrate persisted state after mount (avoids SSR/CSR divergence).
  useEffect(() => {
    if (!isFolder) return;
    const v = readPersistedOpen(node.path);
    if (v !== null) setOpen(v);
  }, [isFolder, node.path]);
  function toggleOpen() {
    setOpen((prev) => {
      const next = !prev;
      writePersistedOpen(node.path, next);
      return next;
    });
  }
  const [menuOpen, setMenuOpen] = useState(false);
  const [ctxAnchor, setCtxAnchor] = useState<{ x: number; y: number } | null>(null);
  const [dragOver, setDragOver] = useState(false);

  // Drop handler for folders: accept a dragged note path and move it in.
  function onFolderDragOver(e: React.DragEvent) {
    if (e.dataTransfer.types.includes(DND_MIME)) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      if (!dragOver) setDragOver(true);
    }
  }
  function onFolderDrop(e: React.DragEvent) {
    const src = e.dataTransfer.getData(DND_MIME);
    setDragOver(false);
    if (!src) return;
    e.preventDefault();
    e.stopPropagation();
    void moveNote(src, node.path);
    setOpen(true);
  }

  const indent = depth * 12;
  const isActive = !isFolder && node.path === activePath;
  const isDirty = !isFolder && dirtyPaths.has(node.path);

  const items: MenuEntry[] = isFolder
    ? [
        { label: "New note here",  onClick: () => (window as WindowWithFileTreeActions).__fileTreeActions?.newNoteInFolder(node.path) },
        { label: "New folder here", onClick: () => (window as WindowWithFileTreeActions).__fileTreeActions?.newFolderIn(node.path) },
        { label: "Rename folder",  onClick: () => (window as WindowWithFileTreeActions).__fileTreeActions?.renameFolder(node) },
        { label: "Delete folder",  onClick: () => (window as WindowWithFileTreeActions).__fileTreeActions?.deleteFolder(node), variant: "danger" },
      ]
    : (() => {
        const parent = folderOf(node.path);
        return [
          { label: "Open",                 onClick: () => onOpen(node.path) },
          { label: parent ? `New note in ${parent}` : "New note in root",
            onClick: () => (window as WindowWithFileTreeActions).__fileTreeActions?.newNoteInFolder(parent) },
          { label: parent ? `New folder in ${parent}` : "New folder in root",
            onClick: () => (window as WindowWithFileTreeActions).__fileTreeActions?.newFolderIn(parent) },
          { label: "Rename",     onClick: () => (window as WindowWithFileTreeActions).__fileTreeActions?.rename(node) },
          { label: "Copy path",  onClick: () => { void navigator.clipboard.writeText(node.path); } },
          { label: "Delete",     onClick: () => (window as WindowWithFileTreeActions).__fileTreeActions?.delete(node), variant: "danger" },
        ];
      })();

  function handleContext(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setCtxAnchor({ x: e.clientX, y: e.clientY });
  }

  if (isFolder) {
    return (
      <div>
        <div
          className="group relative flex items-center"
          onContextMenu={handleContext}
          onDragOver={onFolderDragOver}
          onDragLeave={() => setDragOver(false)}
          onDrop={onFolderDrop}
          style={dragOver ? { background: "var(--accent-soft)", borderRadius: "var(--radius-sm)", outline: "1px solid var(--accent)" } : undefined}
        >
          <button
            onClick={toggleOpen}
            className="sgnk-tree-row min-w-0 flex-1"
            style={{
              paddingLeft: `${8 + indent}px`,
              color: dimmed ? "var(--muted)" : "var(--fg)",
              opacity: dimmed ? 0.6 : 1,
              fontWeight: 500,
            }}
          >
            {/* Fixed 16px disclosure box → the folder name never shifts
                between open/closed, and the caret stays crisply centred.
                A small inline SVG (not a font glyph) renders pixel-perfect
                at this size and just rotates 90° when open. */}
            <span
              className="shrink-0 select-none"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 16,
                height: 16,
                color: "var(--muted)",
              }}
              aria-hidden
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 16 16"
                fill="none"
                style={{
                  transform: open ? "rotate(90deg)" : "none",
                  transition: "transform 0.12s ease",
                }}
              >
                <path
                  d="M6 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="truncate">{node.name}</span>
          </button>
          <div className="relative shrink-0">
            <button
              aria-label={`Actions for folder ${node.name}`}
              onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => !v); }}
              className="rounded px-1 py-0.5 text-xs opacity-0 group-hover:opacity-100 focus:opacity-100"
              style={{ color: "var(--muted)", lineHeight: 1 }}
            >
              ⋯
            </button>
            <button
              aria-label={`New note in ${node.name}`}
              onClick={(e) => { e.stopPropagation(); (window as WindowWithFileTreeActions).__fileTreeActions?.newNoteInFolder(node.path); }}
              className="rounded px-1 py-0.5 text-xs opacity-0 group-hover:opacity-100 focus:opacity-100"
              style={{ color: "var(--muted)", lineHeight: 1 }}
              title="New note here"
            >
              <GoogleIcon name="add" size={14} weight={500} />
            </button>
            {menuOpen && <ContextMenu items={items} anchor="below" onClose={() => setMenuOpen(false)} />}
          </div>
        </div>
        {open && node.children && node.children.length > 0 && (
          <div>
            {node.children.map((child) => (
              <TreeItem
                key={child.path}
                node={child}
                depth={depth + 1}
                onOpen={onOpen}
                dirtyPaths={dirtyPaths}
                activePath={activePath}
              />
            ))}
          </div>
        )}
        {ctxAnchor && <ContextMenu items={items} anchor={ctxAnchor} onClose={() => setCtxAnchor(null)} />}
      </div>
    );
  }

  // file
  // Align the filename under the folder NAME above it: a folder row pads
  // `8 + indent`, then a 16px caret box + 6px gap before its name (= 30 +
  // indent). Files have no caret, so pad to the same 30 + indent to keep
  // the column flush instead of ragged.
  return (
    <div
      className="group relative flex items-center"
      style={{ paddingLeft: `${30 + indent}px` }}
      onContextMenu={handleContext}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData(DND_MIME, node.path);
        e.dataTransfer.effectAllowed = "move";
      }}
    >
      <button
        onClick={(e) => {
          // ⌘/Ctrl/Alt-click opens the note in the split (secondary) pane.
          if (e.metaKey || e.ctrlKey || e.altKey) {
            useEditorStore.getState().openSecondary(node.path);
          } else {
            onOpen(node.path);
          }
        }}
        title="Click to open · ⌘/Alt-click to open in split"
        className="sgnk-tree-row min-w-0 flex-1"
        data-active={isActive || undefined}
        style={{
          color: dimmed ? "var(--muted)" : undefined,
          opacity: dimmed ? 0.5 : 1,
        }}
      >
        <span className="truncate">{node.name}</span>
        {isDirty && (
          <span aria-label="unsaved changes" className="ml-auto shrink-0" style={{ color: "var(--accent)", lineHeight: 1 }}>
            ●
          </span>
        )}
      </button>
      <div className="relative shrink-0">
        <button
          aria-label={`Actions for ${node.name}`}
          onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => !v); }}
          className="rounded px-1 py-0.5 text-xs opacity-0 group-hover:opacity-100 focus:opacity-100"
          style={{ color: "var(--muted)", lineHeight: 1 }}
        >
          ⋯
        </button>
        {menuOpen && <ContextMenu items={items} anchor="below" onClose={() => setMenuOpen(false)} />}
      </div>
      {ctxAnchor && <ContextMenu items={items} anchor={ctxAnchor} onClose={() => setCtxAnchor(null)} />}
    </div>
  );
}

export const TreeItem = memo(TreeItemImpl, (prev, next) =>
  prev.node === next.node &&
  prev.depth === next.depth &&
  prev.dirtyPaths === next.dirtyPaths &&
  prev.activePath === next.activePath &&
  prev.onOpen === next.onOpen,
);
