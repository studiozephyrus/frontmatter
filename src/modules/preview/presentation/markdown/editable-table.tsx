import { useCallback, useRef, useState } from "react";
import { setTableCell } from "@/modules/preview/presentation/table-edit";
import { renderTextWithWikilinks } from "./wikilinks";

/**
 * An inline editable cell that commits its value on blur or Enter.
 * Escape cancels and reverts to the original value.
 *
 * In display mode the cell text is run through `renderTextWithWikilinks` so
 * `[[wikilinks]]` inside table cells render as clickable links. Raw `[[…]]`
 * text only appears while the cell is being edited.
 */
function EditableCell({
  tag: Tag,
  initialValue,
  onCommit,
  style,
  basenameToPath,
  onWikilink,
  depth,
}: {
  tag: "th" | "td";
  initialValue: string;
  onCommit: (value: string) => void;
  style?: React.CSSProperties;
  basenameToPath?: Map<string, string> | undefined;
  onWikilink?: ((target: string) => void) | undefined;
  depth: number;
}): React.JSX.Element {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  const startEditing = useCallback(() => {
    setDraft(initialValue);
    setEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);
  }, [initialValue]);

  const commit = useCallback(() => {
    setEditing(false);
    if (draft !== initialValue) {
      onCommit(draft);
    }
  }, [draft, initialValue, onCommit]);

  const cancel = useCallback(() => {
    setEditing(false);
    setDraft(initialValue);
  }, [initialValue]);

  if (editing) {
    return (
      <Tag style={style}>
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => { setDraft(e.target.value); }}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") { e.preventDefault(); commit(); }
            else if (e.key === "Escape") { e.preventDefault(); cancel(); }
          }}
          style={{
            width: "100%",
            background: "var(--input-bg, var(--panel))",
            color: "var(--fg)",
            border: "1px solid var(--accent)",
            borderRadius: "3px",
            padding: "1px 4px",
            fontSize: "inherit",
            fontFamily: "inherit",
            boxSizing: "border-box",
          }}
        />
      </Tag>
    );
  }

  return (
    <Tag
      style={{ ...style, cursor: "text" }}
      title="Click to edit"
      onClick={startEditing}
    >
      {renderTextWithWikilinks(initialValue, basenameToPath, onWikilink, depth)}
    </Tag>
  );
}

/**
 * Renders a single GFM pipe-table with editable cells.
 * `tableIndex` identifies which table in the document this is (0-based).
 */
export function EditableTable({
  tableIndex,
  rows,
  content,
  onEdit,
  basenameToPath,
  onWikilink,
  depth,
}: {
  tableIndex: number;
  rows: string[][];
  content: string;
  onEdit: (newContent: string) => void;
  basenameToPath?: Map<string, string> | undefined;
  onWikilink?: ((target: string) => void) | undefined;
  depth: number;
}): React.JSX.Element {
  const [headerRow, ...bodyRows] = rows;

  const handleCellCommit = useCallback(
    (rowInData: number, col: number) => (value: string) => {
      const newContent = setTableCell(content, tableIndex, rowInData, col, value);
      onEdit(newContent);
    },
    [content, tableIndex, onEdit],
  );

  return (
    <table>
      {headerRow && (
        <thead>
          <tr>
            {headerRow.map((cell, cIdx) => (
              <EditableCell
                key={cIdx}
                tag="th"
                initialValue={cell}
                onCommit={handleCellCommit(0, cIdx)}
                basenameToPath={basenameToPath}
                onWikilink={onWikilink}
                depth={depth}
              />
            ))}
          </tr>
        </thead>
      )}
      {bodyRows.length > 0 && (
        <tbody>
          {bodyRows.map((row, rIdx) => (
            <tr key={rIdx}>
              {row.map((cell, cIdx) => (
                <EditableCell
                  key={cIdx}
                  tag="td"
                  initialValue={cell}
                  onCommit={handleCellCommit(rIdx + 1, cIdx)}
                  basenameToPath={basenameToPath}
                  onWikilink={onWikilink}
                  depth={depth}
                />
              ))}
            </tr>
          ))}
        </tbody>
      )}
    </table>
  );
}
