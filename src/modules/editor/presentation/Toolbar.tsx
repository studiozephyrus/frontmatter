"use client";

/**
 * Authoring Toolbar — a row of formatting buttons rendered above the editor
 * in EDIT and SPLIT modes. Operates on the active CodeMirror EditorView via
 * the module singleton `getActiveView()`. No-ops when no view is active.
 */

import { getActiveView } from "@/modules/editor/presentation/active-view";
import { GoogleIcon } from "@/shared/presentation/GoogleIcon";
import {
  wrapSelection,
  prefixLine,
  insertCodeBlock,
  insertLink,
  insertTable,
} from "@/modules/editor/presentation/toolbar-transforms";

// ---------------------------------------------------------------------------
// Toolbar button data
// ---------------------------------------------------------------------------

type ToolbarAction =
  | { type: "wrap"; before: string; after: string }
  | { type: "prefix"; prefix: string }
  | { type: "fn"; fn: () => void };

interface ToolbarButton {
  /** Google Material Symbols Rounded icon name, OR a short text label
   *  (used by heading buttons that show "H1" / "H2" / "H3"). */
  icon?: string;
  text?: string;
  title: string;
  action: ToolbarAction;
}

function makeButtons(): ToolbarButton[] {
  return [
    {
      icon: "format_bold",
      title: "Bold (Mod+B)",
      action: { type: "wrap", before: "**", after: "**" },
    },
    {
      icon: "format_italic",
      title: "Italic (Mod+I)",
      action: { type: "wrap", before: "*", after: "*" },
    },
    {
      icon: "format_strikethrough",
      title: "Strikethrough",
      action: { type: "wrap", before: "~~", after: "~~" },
    },
    {
      icon: "code",
      title: "Inline code (Mod+E)",
      action: { type: "wrap", before: "`", after: "`" },
    },
    {
      text: "H1",
      title: "Heading 1",
      action: { type: "prefix", prefix: "# " },
    },
    {
      text: "H2",
      title: "Heading 2",
      action: { type: "prefix", prefix: "## " },
    },
    {
      icon: "format_list_bulleted",
      title: "Bullet list",
      action: { type: "prefix", prefix: "- " },
    },
    {
      icon: "check_box",
      title: "Task item",
      action: { type: "prefix", prefix: "- [ ] " },
    },
    {
      icon: "format_quote",
      title: "Blockquote",
      action: { type: "prefix", prefix: "> " },
    },
    {
      icon: "data_object",
      title: "Code block",
      action: {
        type: "fn",
        fn: () => {
          const view = getActiveView();
          if (view) insertCodeBlock(view);
        },
      },
    },
    {
      icon: "link",
      title: "Link",
      action: {
        type: "fn",
        fn: () => {
          const view = getActiveView();
          if (view) insertLink(view);
        },
      },
    },
    {
      icon: "table_chart",
      title: "Insert table",
      action: {
        type: "fn",
        fn: () => {
          const view = getActiveView();
          if (view) insertTable(view);
        },
      },
    },
  ];
}

// ---------------------------------------------------------------------------
// Toolbar component
// ---------------------------------------------------------------------------

export function Toolbar({ extras }: { extras?: React.ReactNode } = {}): React.JSX.Element {
  const buttons = makeButtons();

  function handleClick(action: ToolbarAction): void {
    const view = getActiveView();
    if (!view) return;

    if (action.type === "wrap") {
      wrapSelection(view, action.before, action.after);
    } else if (action.type === "prefix") {
      prefixLine(view, action.prefix);
    } else {
      action.fn();
    }

    // Return focus to the editor after toolbar click
    view.focus();
  }

  return (
    <div
      data-testid="editor-toolbar"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "2px",
        padding: "6px 10px",
        borderBottom: "1px solid var(--border)",
        background: "var(--bg-subtle)",
        flexShrink: 0,
      }}
    >
      {buttons.map((btn) => (
        <button
          key={btn.title}
          title={btn.title}
          aria-label={btn.title}
          className="sgnk-tool-btn"
          onMouseDown={(e) => {
            // Prevent the editor from losing focus on button click
            e.preventDefault();
            handleClick(btn.action);
          }}
        >
          {btn.icon ? <GoogleIcon name={btn.icon} size={18} weight={500} /> : btn.text}
        </button>
      ))}
      {/* Right-aligned slot — the doc stats + Find / History / View controls
          ride here (instead of a separate bottom bar) so the editor has one
          consolidated control row. */}
      {extras && (
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
          {extras}
        </div>
      )}
    </div>
  );
}
