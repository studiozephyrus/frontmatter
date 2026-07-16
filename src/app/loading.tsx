/**
 * Top-level loading UI for the App Router. Rendered as the Suspense fallback
 * while a route segment is streaming.
 */
export default function RouteLoading() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
        background: "var(--bg)",
        color: "var(--muted)",
        fontSize: 13,
      }}
    >
      <div className="sgnk-fade-in" style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span
          aria-hidden
          style={{
            display: "inline-block",
            width: 14,
            height: 14,
            borderRadius: "50%",
            border: "2px solid var(--border)",
            borderTopColor: "var(--accent)",
            animation: "sgnk-spin 0.8s linear infinite",
          }}
        />
        Loading…
      </div>
    </div>
  );
}
