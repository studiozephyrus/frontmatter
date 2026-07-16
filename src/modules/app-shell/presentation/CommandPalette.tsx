"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useEditorStore } from "@/modules/editor";
import { useSnapshot } from "@/modules/vault";
import { getActiveView } from "@/modules/editor";
import {
  dailyNotePath,
  dailyNoteTemplate,
  substituteTemplateVars,
} from "@/modules/vault";
import { fuzzyFilter } from "./fuzzy";
import type { EditorMode } from "@/modules/editor";
import type { NoteMeta } from "@/modules/vault";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

interface Command {
  id: string;
  label: string;
  run: () => void;
}

const MAX_RESULTS = 20;

function buildStaticCommands(): Command[] {
  return [
    {
      id: "mode-edit",
      label: "Toggle to Edit mode",
      run: () => {
        useEditorStore.getState().setMode("edit" as EditorMode);
      },
    },
    {
      id: "mode-reading",
      label: "Reading mode",
      run: () => {
        useEditorStore.getState().setMode("reading" as EditorMode);
      },
    },
    {
      id: "mode-split",
      label: "Split mode",
      run: () => {
        useEditorStore.getState().setMode("split" as EditorMode);
      },
    },
    {
      id: "open-graph",
      label: "Open graph",
      run: () => {
        window.dispatchEvent(new CustomEvent("sgnk:open-graph"));
      },
    },
    {
      id: "open-search",
      label: "Open search",
      run: () => {
        window.dispatchEvent(new CustomEvent("sgnk:open-search"));
      },
    },
    {
      id: "open-link-doctor",
      label: "AI: Link Doctor (vault-wide wikilink sweep)",
      run: () => {
        window.dispatchEvent(new CustomEvent("sgnk:open-link-doctor"));
      },
    },
    {
      id: "open-trash",
      label: "Open Trash (restore deleted notes)",
      run: () => {
        window.dispatchEvent(new CustomEvent("sgnk:open-trash"));
      },
    },
    {
      id: "open-settings",
      label: "Open settings",
      run: () => {
        window.dispatchEvent(new CustomEvent("sgnk:open-settings"));
      },
    },
    {
      id: "import-markdown",
      label: "Import markdown files",
      run: () => {
        window.dispatchEvent(new CustomEvent("sgnk:open-import"));
      },
    },
    {
      id: "close-tab",
      label: "Close current tab",
      run: () => {
        const { activePath, closeTab } = useEditorStore.getState();
        if (activePath) closeTab(activePath);
      },
    },
    {
      id: "export-vault-zip",
      label: "Export vault (zip)",
      run: () => {
        window.location.href = "/api/export/vault";
      },
    },
    {
      id: "sign-out",
      label: "Sign out",
      run: () => {
        window.location.href = "/api/auth/signout";
      },
    },
  ];
}

/** Build the "Open today's daily note" command, given the current snapshot notes. */
function buildDailyNoteCommand(notes: NoteMeta[]): Command {
  return {
    id: "daily-note-today",
    label: "Open today's daily note",
    run: () => {
      const path = dailyNotePath(new Date());
      // Extract date string from path: "Daily/YYYY-MM-DD.md" → "YYYY-MM-DD"
      const dateStr = path.replace(/^Daily\//, "").replace(/\.md$/, "");
      const exists = notes.some((n) => n.path === path);

      if (exists) {
        useEditorStore.getState().openTab(path);
      } else {
        void (async () => {
          try {
            const res = await fetch("/api/vault/create", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                path,
                content: dailyNoteTemplate(dateStr),
              }),
            });
            // 200 = created, 409 = already exists — open in both cases
            if (res.ok || res.status === 409) {
              window.dispatchEvent(new CustomEvent("sgnk:vault-changed"));
              useEditorStore.getState().openTab(path);
            } else {
              console.error(
                "[daily-note] create failed:",
                res.status,
                await res.text(),
              );
            }
          } catch (err) {
            console.error("[daily-note] create error:", err);
          }
        })();
      }
    },
  };
}

/** Build per-template "Insert template: <name>" commands from snapshot notes. */
function buildTemplateCommands(notes: NoteMeta[]): Command[] {
  const templateNotes = notes.filter((n) => n.path.startsWith("Templates/"));

  if (templateNotes.length === 0) {
    return [
      {
        id: "insert-template-none",
        label: "Insert template (none found — create notes under Templates/)",
        run: () => {
          // no-op: informational entry
        },
      },
    ];
  }

  return templateNotes.map((note) => {
    const name = note.title || note.path.replace(/^Templates\//, "").replace(/\.md$/, "");
    return {
      id: `insert-template:${note.path}`,
      label: `Insert template: ${name}`,
      run: () => {
        void (async () => {
          try {
            const res = await fetch(
              `/api/vault/file?path=${encodeURIComponent(note.path)}`,
            );
            if (!res.ok) {
              console.error(
                "[template] fetch failed:",
                res.status,
                await res.text(),
              );
              return;
            }
            const data = (await res.json()) as { content: string };
            const view = getActiveView();
            if (!view) return;

            // Substitute {{date}}/{{time}}/{{title}} tokens before insertion.
            const activePath = useEditorStore.getState().activePath;
            const title = activePath
              ? (activePath.split("/").pop() ?? activePath).replace(/\.md$/, "")
              : "";
            const filled = substituteTemplateVars(data.content, { now: new Date(), title });

            const { from, to } = view.state.selection.main;
            view.dispatch({
              changes: { from, to, insert: filled },
            });
          } catch (err) {
            console.error("[template] insert error:", err);
          }
        })();
      },
    };
  });
}

export function CommandPalette({
  open,
  onClose,
}: CommandPaletteProps): React.ReactNode {
  const [query, setQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const snapshotState = useSnapshot();
  const notes: NoteMeta[] =
    snapshotState.snapshot?.notes ?? [];

  // Build the full command list: static + daily note + template commands.
  const allCommands: Command[] = [
    ...buildStaticCommands(),
    buildDailyNoteCommand(notes),
    ...buildTemplateCommands(notes),
  ];

  const results = fuzzyFilter(allCommands, query, (c) => c.label).slice(
    0,
    MAX_RESULTS,
  );

  // Reset state when opening
  useEffect(() => {
    if (open) {
      setQuery("");
      setHighlightedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [open]);

  // Clamp highlighted index when results shrink
  useEffect(() => {
    if (highlightedIndex >= results.length) {
      setHighlightedIndex(Math.max(0, results.length - 1));
    }
  }, [results.length, highlightedIndex]);

  const runSelected = useCallback(() => {
    const selected = results[highlightedIndex];
    if (selected) {
      selected.run();
      onClose();
    }
  }, [results, highlightedIndex, onClose]);

  function handleKeyDown(e: React.KeyboardEvent): void {
    if (e.key === "Escape") {
      onClose();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((i) => Math.min(i + 1, results.length - 1));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((i) => Math.max(i - 1, 0));
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      runSelected();
      return;
    }
  }

  if (!open) return null;

  return (
    <div
      role="presentation"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "15vh",
        background: "rgba(0,0,0,0.45)",
      }}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        style={{
          background: "var(--panel)",
          border: "1px solid var(--border)",
          borderRadius: 10,
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          width: "min(600px, 90vw)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <input
          ref={inputRef}
          type="text"
          placeholder="Run a command…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setHighlightedIndex(0);
          }}
          style={{
            display: "block",
            width: "100%",
            padding: "14px 16px",
            fontSize: 15,
            background: "transparent",
            color: "var(--fg)",
            border: "none",
            borderBottom: "1px solid var(--border)",
            outline: "none",
          }}
        />

        {results.length > 0 ? (
          <ul
            role="listbox"
            style={{
              listStyle: "none",
              margin: 0,
              padding: "4px 0",
              maxHeight: 360,
              overflowY: "auto",
            }}
          >
            {results.map((cmd, idx) => (
              <li
                key={cmd.id}
                role="option"
                aria-selected={idx === highlightedIndex}
                style={{
                  padding: "10px 16px",
                  cursor: "pointer",
                  background:
                    idx === highlightedIndex
                      ? "color-mix(in srgb, var(--accent) 12%, transparent)"
                      : "transparent",
                  color: "var(--fg)",
                  fontSize: 14,
                }}
                onClick={() => {
                  cmd.run();
                  onClose();
                }}
                onMouseEnter={() => setHighlightedIndex(idx)}
              >
                {cmd.label}
              </li>
            ))}
          </ul>
        ) : (
          <div
            style={{
              padding: "24px 16px",
              textAlign: "center",
              color: "var(--muted)",
              fontSize: 14,
            }}
          >
            {query ? "No matching commands" : "Type to filter commands…"}
          </div>
        )}
      </div>
    </div>
  );
}
