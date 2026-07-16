"use client";

/**
 * applyPathRename — keep editor state + the unsaved draft in sync when a note
 * is renamed or moved in the file tree.
 *
 * Without this, a rename/move leaves the open tab pointing at the deleted old
 * path and the IndexedDB draft orphaned under the old key, so unsaved edits are
 * silently lost on the next snapshot refresh. We migrate the draft (preserving
 * its original baseSha so OCC still works) then remap the store paths.
 */
import { getDraft, saveDraft, deleteDraft } from "@/modules/drafts";
import { useEditorStore } from "./editor-store";

export async function applyPathRename(oldPath: string, newPath: string): Promise<void> {
  if (oldPath === newPath) return;
  try {
    const draft = await getDraft(oldPath);
    if (draft) {
      await saveDraft(newPath, { content: draft.content, baseSha: draft.baseSha });
      await deleteDraft(oldPath);
    }
  } catch {
    /* draft migration is best-effort — never block the rename on it */
  }
  useEditorStore.getState().renamePath(oldPath, newPath);
}
