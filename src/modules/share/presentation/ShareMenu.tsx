"use client";

/**
 * ShareMenu — single button in the editor header that opens ShareModal
 * for the currently active note. Pulls publicSlug from the snapshot so
 * the modal can offer "update / unpublish" when the note is already shared.
 */

import { useMemo, useState } from "react";
import { useEditorStore } from "@/modules/editor";
import { useSnapshot } from "@/modules/vault";
import { GoogleIcon } from "@/shared/presentation/GoogleIcon";
import { ShareModal } from "./ShareModal";

export function ShareMenu(): React.JSX.Element | null {
  const activePath = useEditorStore((s) => s.activePath);
  const { snapshot } = useSnapshot();
  const [open, setOpen] = useState(false);

  const note = useMemo(() => {
    if (!activePath || !snapshot) return null;
    return snapshot.notes.find((n) => n.path === activePath) ?? null;
  }, [activePath, snapshot]);

  if (!activePath || !note) return null;

  const isShared = typeof note.publicSlug === "string" && note.publicSlug.length > 0;

  // Icon-only button. State is communicated by tinting the icon to the
  // accent token (the same purple-in-dark, deep-violet-in-light that the
  // rest of the link affordances use). Tooltip surfaces the public URL
  // when published so the destination is one hover away.
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title={isShared ? `Public at /${note.publicSlug}` : "Share publicly"}
        aria-pressed={isShared}
        aria-label={isShared ? "Note is published — manage share" : "Share note"}
        className="sgnk-icon-btn"
        style={{ color: isShared ? "var(--link, var(--accent))" : undefined }}
      >
        <GoogleIcon name="share" size={18} fill={isShared} weight={500} />
      </button>
      <ShareModal
        open={open}
        notePath={activePath}
        noteTitle={note.title}
        currentSlug={note.publicSlug}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
