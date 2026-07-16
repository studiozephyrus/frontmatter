import { useEffect, useRef, useState } from "react";

export interface InlineDialogProps {
  title: string;
  label: string;
  initialValue: string;
  submitLabel: string;
  warning?: string;
  onSubmit: (value: string) => void;
  onCancel: () => void;
}

/** Modal text-input dialog used for New Note and Rename prompts. */
export function InlineDialog({
  title,
  label,
  initialValue,
  submitLabel,
  warning,
  onSubmit,
  onCancel,
}: InlineDialogProps) {
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (value.trim()) onSubmit(value.trim());
    } else if (e.key === "Escape") {
      e.preventDefault();
      onCancel();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.4)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        style={{
          background: "var(--bg)",
          color: "var(--fg)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          padding: "20px 24px",
          minWidth: 320,
          maxWidth: 480,
          width: "90vw",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
        }}
      >
        <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 12, color: "var(--fg)" }}>
          {title}
        </p>
        {warning && (
          <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 10, lineHeight: 1.5 }}>
            {warning}
          </p>
        )}
        <label style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 6 }}>
          {label}
        </label>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            width: "100%",
            fontSize: 13,
            padding: "6px 8px",
            borderRadius: 4,
            border: "1px solid var(--border)",
            background: "var(--panel)",
            color: "var(--fg)",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
        <div style={{ display: "flex", gap: 8, marginTop: 16, justifyContent: "flex-end" }}>
          <button
            onClick={onCancel}
            style={{
              fontSize: 12,
              padding: "5px 12px",
              borderRadius: 4,
              border: "1px solid var(--border)",
              background: "transparent",
              color: "var(--fg)",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => value.trim() && onSubmit(value.trim())}
            disabled={!value.trim()}
            style={{
              fontSize: 12,
              padding: "5px 12px",
              borderRadius: 4,
              border: "none",
              background: "var(--accent)",
              color: "#fff",
              cursor: value.trim() ? "pointer" : "not-allowed",
              opacity: value.trim() ? 1 : 0.5,
            }}
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
