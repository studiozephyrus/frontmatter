import { useEffect, useRef, useState } from "react";
import type { TreeNode } from "@/modules/vault/application/dto";
import { useEditorStore, applyPathRename } from "@/modules/editor";
import { useSnapshotMutate } from "@/modules/vault/presentation/SnapshotProvider";
import { insertNodeIntoTree } from "@/modules/vault/presentation/tree-insert";
import { defaultNoteContent } from "@/modules/repository";
import { saveDraft, getDraft, deleteDraft } from "@/modules/drafts";
import { InlineDialog } from "./InlineDialog";
import { ConfirmDialog } from "./ConfirmDialog";
import { Toast } from "./Toast";
import { buildPath, folderOf } from "./path-utils";
import type { WindowWithFileTreeActions } from "./types";

/** Notify the SnapshotProvider to refetch the vault. Defined here as well as
 *  in FileTree.tsx — both files are siblings and need it; safe to duplicate. */
function dispatchVaultChanged(): void {
  window.dispatchEvent(new CustomEvent("sgnk:vault-changed"));
}

type DialogState =
  | { kind: "none" }
  | { kind: "new-note"; parentFolder: string }
  | { kind: "new-folder"; parentFolder: string }
  | { kind: "rename"; node: TreeNode }
  | { kind: "rename-folder"; node: TreeNode }
  | { kind: "delete-confirm"; node: TreeNode }
  | { kind: "deleting"; node: TreeNode }
  | { kind: "delete-folder-confirm"; node: TreeNode }
  | { kind: "deleting-folder"; node: TreeNode };

/**
 * Owns the FileTree's modal state machine — new note/folder, rename,
 * delete (with confirm + in-flight states). Exposes its open-dialog APIs
 * via `window.__fileTreeActions` so TreeItem rows can invoke them.
 */
export function FileTreeActions() {
  const [dialog, setDialog] = useState<DialogState>({ kind: "none" });
  const applyOptimistic = useSnapshotMutate();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (msg: string, durationMs = 2500) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast(msg);
    toastTimerRef.current = setTimeout(() => setToast(null), durationMs);
  };

  // Clear any pending toast timer on unmount.
  useEffect(() => () => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
  }, []);

  // Surface toasts dispatched from elsewhere (drag-drop move, root drop).
  useEffect(() => {
    const onToast = (e: Event) => {
      const msg = (e as CustomEvent<{ message?: string }>).detail?.message;
      if (typeof msg === "string") showToast(msg);
    };
    window.addEventListener("sgnk:toast", onToast);
    return () => window.removeEventListener("sgnk:toast", onToast);
  }, []);

  // New-note / new-folder via the header "+" buttons and native (Tauri) menus.
  useEffect(() => {
    const onNewNote = () => { setErrorMsg(null); setDialog({ kind: "new-note", parentFolder: "" }); };
    const onNewFolder = () => { setErrorMsg(null); setDialog({ kind: "new-folder", parentFolder: "" }); };
    window.addEventListener("sgnk:new-note", onNewNote);
    window.addEventListener("sgnk:new-folder", onNewFolder);
    return () => {
      window.removeEventListener("sgnk:new-note", onNewNote);
      window.removeEventListener("sgnk:new-folder", onNewFolder);
    };
  }, []);

  useEffect(() => {
    (window as WindowWithFileTreeActions).__fileTreeActions = {
      rename: (node) => { setErrorMsg(null); setDialog({ kind: "rename", node }); },
      delete: (node) => { setErrorMsg(null); setDialog({ kind: "delete-confirm", node }); },
      renameFolder: (node) => { setErrorMsg(null); setDialog({ kind: "rename-folder", node }); },
      deleteFolder: (node) => { setErrorMsg(null); setDialog({ kind: "delete-folder-confirm", node }); },
      newNoteInFolder: (folder) => { setErrorMsg(null); setDialog({ kind: "new-note", parentFolder: folder }); },
      newFolderIn: (folder) => { setErrorMsg(null); setDialog({ kind: "new-folder", parentFolder: folder }); },
    };
    return () => {
      delete (window as WindowWithFileTreeActions).__fileTreeActions;
    };
  }, []);

  if (dialog.kind === "none" && !errorMsg && !toast) return null;

  return (
    <>
      {dialog.kind === "new-note" && (
        <InlineDialog
          title={dialog.parentFolder ? `New note in ${dialog.parentFolder}` : "New note"}
          label={dialog.parentFolder ? "Note name" : "Note name (e.g. My Note or folder/My Note)"}
          initialValue="Untitled"
          submitLabel="Create"
          onCancel={() => { setDialog({ kind: "none" }); setErrorMsg(null); }}
          onSubmit={async (raw) => {
            const path = buildPath(raw, dialog.parentFolder);
            const content = defaultNoteContent(path);
            setDialog({ kind: "none" });
            // Seed the note's template as a draft BEFORE opening the tab, so the
            // editor opens an editable note INSTANTLY — with a draft present,
            // use-note-content never fetches, so there's no "not found" flash
            // during the ~1s GitHub create. The sidebar node is inserted
            // optimistically too.
            await saveDraft(path, { content, baseSha: "" });
            useEditorStore.getState().openTab(path);
            applyOptimistic((snap) => ({ ...snap, tree: insertNodeIntoTree(snap.tree, path, "file") }));
            // Send the same content so client + server agree byte-for-byte.
            const res = await fetch("/api/vault/create", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ path, content }),
            });
            if (res.ok) {
              const j = (await res.json().catch(() => ({}))) as { sha?: string };
              const sha = typeof j.sha === "string" ? j.sha : "";
              useEditorStore.getState().setBaseSha(path, sha);
              const draft = await getDraft(path);
              if (draft && draft.content === content) {
                // Untouched blank note — it's committed as created, so NOT dirty.
                await deleteDraft(path);
                useEditorStore.getState().setDirty(path, false);
              } else if (draft) {
                // User already typed while it created — keep edits, adopt base sha.
                await saveDraft(path, { content: draft.content, baseSha: sha });
              }
              dispatchVaultChanged();
            } else if (res.status === 409) {
              await deleteDraft(path);
              useEditorStore.getState().closeTab(path);
              useEditorStore.getState().setDirty(path, false);
              showToast(`A note named "${path}" already exists`);
              dispatchVaultChanged(); // reconcile away the optimistic node
            } else {
              await deleteDraft(path);
              useEditorStore.getState().closeTab(path);
              useEditorStore.getState().setDirty(path, false);
              const j = (await res.json().catch(() => ({}))) as { error?: string };
              showToast(j.error ?? `Create failed (${res.status})`);
              dispatchVaultChanged(); // reconcile away the optimistic node
            }
          }}
        />
      )}

      {dialog.kind === "new-folder" && (
        <InlineDialog
          title={dialog.parentFolder ? `New folder in ${dialog.parentFolder}` : "New folder"}
          label="Folder name"
          initialValue="Untitled folder"
          submitLabel="Create"
          onCancel={() => { setDialog({ kind: "none" }); setErrorMsg(null); }}
          onSubmit={async (raw) => {
            const folderName = raw.trim().replace(/\/+/g, "/").replace(/^\/+|\/+$/g, "");
            if (!folderName) { setErrorMsg("Folder name is required."); return; }
            const path = dialog.parentFolder ? `${dialog.parentFolder}/${folderName}` : folderName;
            const res = await fetch("/api/vault/folder", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ op: "create", path }),
            });
            if (res.ok) {
              setDialog({ kind: "none" });
              showToast(`Created folder ${path}`);
              dispatchVaultChanged();
            } else {
              const j = (await res.json().catch(() => ({}))) as { detail?: string; error?: string };
              setErrorMsg(j.detail ?? j.error ?? `Error ${res.status}`);
            }
          }}
        />
      )}

      {dialog.kind === "rename-folder" && (
        <InlineDialog
          title={`Rename folder "${dialog.node.name}"`}
          label="New folder name"
          initialValue={dialog.node.name}
          submitLabel="Rename"
          warning="All files in this folder move with it."
          onCancel={() => { setDialog({ kind: "none" }); setErrorMsg(null); }}
          onSubmit={async (raw) => {
            const newName = raw.trim().replace(/\/+/g, "/").replace(/^\/+|\/+$/g, "");
            if (!newName) { setErrorMsg("Folder name is required."); return; }
            const parent = folderOf(dialog.node.path);
            const newPath = parent ? `${parent}/${newName}` : newName;
            const res = await fetch("/api/vault/folder", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ op: "rename", oldPath: dialog.node.path, newPath }),
            });
            if (res.ok) {
              const j = (await res.json().catch(() => ({}))) as { moved?: number };
              setDialog({ kind: "none" });
              showToast(`Moved ${j.moved ?? 0} files`);
              dispatchVaultChanged();
            } else {
              const j = (await res.json().catch(() => ({}))) as { detail?: string };
              setErrorMsg(j.detail ?? `Error ${res.status}`);
            }
          }}
        />
      )}

      {(dialog.kind === "delete-folder-confirm" || dialog.kind === "deleting-folder") && (
        <ConfirmDialog
          message={`Delete folder "${dialog.node.name}" and ALL files inside it? This commits a recursive deletion to GitHub.`}
          confirmLabel={dialog.kind === "deleting-folder" ? "Deleting…" : "Delete folder"}
          onCancel={() => {
            if (dialog.kind !== "deleting-folder") { setDialog({ kind: "none" }); setErrorMsg(null); }
          }}
          onConfirm={async () => {
            if (dialog.kind !== "delete-folder-confirm") return;
            const node = dialog.node;
            setDialog({ kind: "deleting-folder", node });
            const res = await fetch("/api/vault/folder", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ op: "delete", path: node.path }),
            });
            if (res.ok) {
              const j = (await res.json().catch(() => ({}))) as { deleted?: number };
              showToast(`Deleted folder (${j.deleted ?? 0} files)`);
              // Sweep persisted open-state keys for this folder + all
              // descendants so localStorage doesn't grow with dead paths
              // (you can re-create a folder of the same name later and
              // inherit a stale open/closed state otherwise).
              try {
                const prefix = `sgnk-tree-open:${node.path}`;
                for (let i = localStorage.length - 1; i >= 0; i--) {
                  const key = localStorage.key(i);
                  if (key === null) continue;
                  if (key === prefix || key.startsWith(`${prefix}/`)) {
                    localStorage.removeItem(key);
                  }
                }
              } catch {
                /* localStorage may be unavailable (private mode) */
              }
              setDialog({ kind: "none" });
              dispatchVaultChanged();
            } else {
              const j = (await res.json().catch(() => ({}))) as { detail?: string };
              setErrorMsg(j.detail ?? `Error ${res.status}`);
              setDialog({ kind: "delete-folder-confirm", node });
            }
          }}
        />
      )}

      {dialog.kind === "rename" && (
        <InlineDialog
          title={`Rename "${dialog.node.name}"`}
          label="New name"
          initialValue={dialog.node.name.replace(/\.md$/, "")}
          submitLabel="Rename"
          warning="Renaming rewrites inbound [[links]]."
          onCancel={() => { setDialog({ kind: "none" }); setErrorMsg(null); }}
          onSubmit={async (raw) => {
            const folder = folderOf(dialog.node.path);
            const newPath = buildPath(raw, folder);
            const res = await fetch("/api/vault/rename", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ oldPath: dialog.node.path, newPath }),
            });
            if (res.ok) {
              const j = (await res.json().catch(() => ({}))) as { relinkedCount?: number };
              // Migrate the open tab + unsaved draft to the new path.
              await applyPathRename(dialog.node.path, newPath);
              setDialog({ kind: "none" });
              showToast(`Renamed (relinked ${j.relinkedCount ?? 0})`);
              dispatchVaultChanged();
            } else if (res.status === 409) {
              setErrorMsg("Target name already exists.");
            } else {
              const j = (await res.json().catch(() => ({}))) as { error?: string };
              setErrorMsg(j.error ?? `Error ${res.status}`);
            }
          }}
        />
      )}

      {(dialog.kind === "delete-confirm" || dialog.kind === "deleting") && (
        <ConfirmDialog
          message={`Delete "${dialog.node.name}"? This commits a deletion to GitHub.`}
          confirmLabel={dialog.kind === "deleting" ? "Deleting…" : "Delete"}
          onCancel={() => {
            if (dialog.kind !== "deleting") { setDialog({ kind: "none" }); setErrorMsg(null); }
          }}
          onConfirm={async () => {
            if (dialog.kind !== "delete-confirm") return;
            const node = dialog.node;
            setDialog({ kind: "deleting", node });
            try {
              const fileRes = await fetch(`/api/vault/file?path=${encodeURIComponent(node.path)}`);
              if (!fileRes.ok) {
                setErrorMsg(`Could not fetch file sha: ${fileRes.status}`);
                setDialog({ kind: "delete-confirm", node });
                return;
              }
              const fileJson = (await fileRes.json()) as { sha: string };
              const delRes = await fetch("/api/vault/delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ path: node.path, baseSha: fileJson.sha }),
              });
              if (delRes.ok) {
                useEditorStore.getState().closeTab(node.path);
                setDialog({ kind: "none" });
                dispatchVaultChanged();
              } else if (delRes.status === 409) {
                setErrorMsg("Conflict: file was modified externally. Please refresh.");
                setDialog({ kind: "delete-confirm", node });
              } else {
                const j = (await delRes.json().catch(() => ({}))) as { error?: string };
                setErrorMsg(j.error ?? `Error ${delRes.status}`);
                setDialog({ kind: "delete-confirm", node });
              }
            } catch {
              setErrorMsg("Network error. Please try again.");
              setDialog({ kind: "delete-confirm", node });
            }
          }}
        />
      )}

      {errorMsg && (
        <div
          role="alert"
          style={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10001,
            background: "#dc2626",
            color: "#fff",
            padding: "8px 16px",
            borderRadius: 6,
            fontSize: 12,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span>{errorMsg}</span>
          <button
            onClick={() => setErrorMsg(null)}
            style={{
              background: "transparent",
              border: "none",
              color: "#fff",
              cursor: "pointer",
              fontSize: 14,
              lineHeight: 1,
              padding: 0,
            }}
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      {toast && <Toast message={toast} />}
    </>
  );
}

/** Helper used by `+ New` buttons in the header to open the root new-note dialog. */
export function openNewNoteDialog() {
  window.dispatchEvent(new CustomEvent("sgnk:new-note"));
}
