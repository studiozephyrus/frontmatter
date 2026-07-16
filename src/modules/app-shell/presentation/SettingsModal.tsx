"use client";

/**
 * SettingsModal — central settings surface. Exposes editor view preferences
 * (mirrors the statusbar "View" menu) plus the default editor mode. Opened via
 * the `sgnk:open-settings` window event (command palette).
 */
import { useEditorSettings, useEditorStore } from "@/modules/editor";
import { GoogleIcon } from "@/shared/presentation/GoogleIcon";
import type { EditorMode } from "@/modules/editor";

interface Props {
  open: boolean;
  onClose: () => void;
}

const TOGGLES: { key: "lineNumbers" | "vimMode" | "spellcheck" | "focusMode" | "aiGhostText"; label: string; help: string }[] = [
  { key: "aiGhostText", label: "AI autocomplete", help: "Inline continue-writing suggestions (Tab to accept)" },
  { key: "lineNumbers", label: "Line numbers", help: "Show gutter line numbers" },
  { key: "vimMode", label: "Vim mode", help: "Modal vim keybindings in the editor" },
  { key: "spellcheck", label: "Spellcheck", help: "Browser spellcheck in the editor" },
  { key: "focusMode", label: "Focus mode", help: "Hide chrome, center a narrow column" },
];

const MODES: EditorMode[] = ["edit", "reading", "split"];

export function SettingsModal({ open, onClose }: Props): React.JSX.Element | null {
  const settings = useEditorSettings();
  const mode = useEditorStore((s) => s.mode);
  const setMode = useEditorStore((s) => s.setMode);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="sgnk-surface sgnk-fade-in"
        style={{ width: "min(480px, 96vw)", maxHeight: "85vh", overflow: "auto", padding: 0 }}
      >
        <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
          <strong style={{ fontSize: 14 }}>Settings</strong>
          <button className="sgnk-icon-btn" style={{ marginLeft: "auto" }} onClick={onClose} aria-label="Close"><GoogleIcon name="close" size={16} weight={500} /></button>
        </div>

        <div style={{ padding: 16 }}>
          <h3 style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", margin: "0 0 10px" }}>
            Editor
          </h3>
          {TOGGLES.map((t) => (
            <label
              key={t.key}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", cursor: "pointer", borderBottom: "1px solid var(--border)" }}
            >
              <input type="checkbox" checked={settings[t.key]} onChange={() => settings.toggle(t.key)} />
              <span style={{ flex: 1 }}>
                <span style={{ fontSize: 13, color: "var(--fg)" }}>{t.label}</span>
                <br />
                <span style={{ fontSize: 11, color: "var(--muted)" }}>{t.help}</span>
              </span>
            </label>
          ))}

          <h3 style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", margin: "16px 0 10px" }}>
            Default mode
          </h3>
          <div className="sgnk-seg" style={{ width: "fit-content" }}>
            {MODES.map((m) => (
              <button key={m} className="sgnk-seg-item" aria-pressed={mode === m} onClick={() => setMode(m)}>
                {m[0]?.toUpperCase()}
                {m.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
