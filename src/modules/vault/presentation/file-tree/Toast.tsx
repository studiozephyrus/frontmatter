/** Brief status toast used for "relinked N notes" and similar messages. */
export function Toast({ message }: { message: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 10000,
        background: "var(--fg)",
        color: "var(--bg)",
        padding: "8px 14px",
        borderRadius: 6,
        fontSize: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        maxWidth: 320,
      }}
    >
      {message}
    </div>
  );
}
