"use client";

/**
 * PropertiesPanel — Obsidian-style frontmatter "Properties" editor rendered
 * above the note body in reading/split preview.
 *
 * Parses the YAML frontmatter via the browser-safe `yaml` package (see
 * ./frontmatter), shows each scalar/array key→value as an editable row, and
 * rewrites the frontmatter block (preserving the body + any complex/nested
 * values) on every edit — calling `onEdit(newContent)` so the normal
 * dirty/autosave/commit path picks it up.
 *
 * Arrays (e.g. `tags`) round-trip as comma-separated text. Booleans/numbers
 * are coerced back from text on blur. Nested/complex values are shown
 * read-only so an edit can never corrupt or drop them. Adding a new property
 * appends a key.
 */
import { memo, useMemo, useState } from "react";
import { GoogleIcon } from "@/shared/presentation/GoogleIcon";
import {
  spliceFrontmatterValue,
  spliceFrontmatterKey,
  SAFE_KEY,
} from "@/modules/share/domain/splice-frontmatter";
import {
  parseFrontmatter,
  isSimpleValue,
  type FrontmatterValue,
} from "./frontmatter";

interface Props {
  content: string;
  onEdit?: ((newContent: string) => void) | undefined;
}

function valueToText(v: unknown): string {
  if (Array.isArray(v)) return v.join(", ");
  if (v === null || v === undefined) return "";
  return String(v);
}

/** Coerce edited text back toward the original value's type. */
function textToValue(text: string, original: unknown): FrontmatterValue {
  if (Array.isArray(original)) {
    return text
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }
  if (typeof original === "number") {
    const n = Number(text);
    return Number.isFinite(n) ? n : text;
  }
  if (typeof original === "boolean") return text === "true";
  return text;
}

export const PropertiesPanel = memo(function PropertiesPanel({ content, onEdit }: Props): React.JSX.Element | null {
  const parsed = useMemo(() => parseFrontmatter(content), [content]);
  const [adding, setAdding] = useState(false);
  const [newKey, setNewKey] = useState("");

  if (!parsed || !onEdit) return null;
  const entries = Object.entries(parsed.data);
  if (entries.length === 0 && !adding) {
    return (
      <div style={{ margin: "0 auto 14px", maxWidth: 760 }}>
        <button
          className="sgnk-btn sgnk-btn-ghost"
          style={{ height: 24, fontSize: 12 }}
          onClick={() => setAdding(true)}
        >
          + Add property
        </button>
      </div>
    );
  }

  // Every mutation is a BYTE-RANGE SPLICE against the original source. Re-emitting the block
  // from the parsed Document — which this panel used to do — rewrites bytes the user authored:
  // measured over corpus_id sha256:3a010b16, re-emission left only 114 of 907 files
  // byte-identical after a no-op edit, and a key RENAME altered 100% of them. Splicing leaves
  // 907 of 907 untouched. See scripts/fm-properties-audit.mjs and PLAN.md §0.
  //
  // A splice that cannot be performed safely returns the source unchanged. The panel therefore
  // checks whether anything moved and stays silent when nothing did, rather than writing a
  // rewritten file the user did not ask for.
  function emit(next: string) {
    if (!onEdit || next === content) return;
    onEdit(next);
  }

  function setValue(key: string, text: string) {
    if (!parsed) return;
    emit(spliceFrontmatterValue(content, key, textToValue(text, parsed.data[key])));
  }

  function renameKey(oldKey: string, nextKey: string) {
    const trimmed = nextKey.trim();
    if (!parsed || trimmed === oldKey || trimmed === "") return;
    // Refuse to rename onto an existing key — would silently merge/drop a value.
    if (Object.prototype.hasOwnProperty.call(parsed.data, trimmed)) return;
    // Same address-space limit as addProperty. The writer refuses these anyway; checking here
    // keeps the two paths honest about the same rule.
    if (!SAFE_KEY.test(trimmed)) return;
    emit(spliceFrontmatterKey(content, oldKey, trimmed));
  }

  function removeKey(key: string) {
    if (!parsed) return;
    emit(spliceFrontmatterValue(content, key, null));
  }

  function addProperty() {
    const k = newKey.trim();
    if (k === "" || !parsed) {
      setAdding(false);
      setNewKey("");
      return;
    }
    // The writer can only address `[A-Za-z0-9_.$-]`. Ask it for anything else and it refuses
    // (correctly — before it refused, a key it could not FIND was appended again on every
    // edit, and three edits to `título` left a document YAML would no longer load).
    //
    // A refusal reaches `emit` as an unchanged string and is dropped silently, which is right
    // for the writer and wrong for a person who just typed a name. So validate here and keep
    // the field OPEN with their text still in it — the add visibly did not happen, instead of
    // the input clearing and closing as though it had.
    if (!SAFE_KEY.test(k)) return;
    emit(spliceFrontmatterValue(content, k, ""));
    setAdding(false);
    setNewKey("");
  }

  return (
    <div
      style={{
        margin: "0 auto 18px",
        maxWidth: 760,
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        background: "var(--panel-2)",
        padding: "8px 12px",
      }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <tbody>
          {entries.map(([key, value]) => {
            const simple = isSimpleValue(value);
            return (
            <tr key={key}>
              <td style={{ padding: "3px 8px 3px 0", width: 160, verticalAlign: "top" }}>
                <input
                  className="sgnk-input"
                  defaultValue={key}
                  onBlur={(e) => renameKey(key, e.target.value)}
                  disabled={!simple}
                  style={{ height: 26, width: "100%", fontWeight: 600, color: "var(--fg-muted)" }}
                />
              </td>
              <td style={{ padding: "3px 0" }}>
                {simple ? (
                  <input
                    key={valueToText(value)}
                    className="sgnk-input"
                    defaultValue={valueToText(value)}
                    onBlur={(e) => setValue(key, e.target.value)}
                    style={{ height: 26, width: "100%" }}
                  />
                ) : (
                  <span
                    title="Nested value — edit in source"
                    style={{ fontSize: 12, color: "var(--muted)", fontStyle: "italic", display: "inline-block", padding: "4px 0" }}
                  >
                    {Array.isArray(value) ? "[…]" : "{ nested — edit in source }"}
                  </span>
                )}
              </td>
              <td style={{ width: 28, textAlign: "right" }}>
                <button
                  className="sgnk-icon-btn"
                  title={`Remove ${key}`}
                  onClick={() => removeKey(key)}
                  style={{ width: 22, height: 22 }}
                ><GoogleIcon name="close" size={16} weight={500} /></button>
              </td>
            </tr>
            );
          })}
        </tbody>
      </table>
      {adding ? (
        <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
          <input
            className="sgnk-input"
            autoFocus
            placeholder="property name"
            value={newKey}
            aria-invalid={newKey.trim() !== "" && !SAFE_KEY.test(newKey.trim())}
            title={
              newKey.trim() !== "" && !SAFE_KEY.test(newKey.trim())
                ? "Use letters, digits, and _ . $ - only"
                : undefined
            }
            onChange={(e) => setNewKey(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addProperty();
              if (e.key === "Escape") {
                setAdding(false);
                setNewKey("");
              }
            }}
            style={{ height: 26, flex: 1 }}
          />
          <button
            className="sgnk-btn"
            style={{ height: 26 }}
            disabled={newKey.trim() !== "" && !SAFE_KEY.test(newKey.trim())}
            onClick={addProperty}
          >
            Add
          </button>
        </div>
      ) : (
        <button
          className="sgnk-btn sgnk-btn-ghost"
          style={{ height: 22, fontSize: 12, marginTop: 4 }}
          onClick={() => setAdding(true)}
        >
          + Add property
        </button>
      )}
    </div>
  );
});
