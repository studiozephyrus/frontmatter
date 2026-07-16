/**
 * 404 page. Triggered by `notFound()` calls and unknown routes.
 */
export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
        background: "var(--bg)",
        color: "var(--fg)",
        padding: "24px",
      }}
    >
      <div style={{ maxWidth: 440, textAlign: "center" }}>
        <p
          style={{
            fontSize: 11,
            letterSpacing: "0.1em",
            color: "var(--muted)",
            margin: "0 0 8px",
            textTransform: "uppercase",
          }}
        >
          404
        </p>
        <h1 style={{ fontSize: 22, fontWeight: 650, margin: "0 0 8px" }}>Note not found</h1>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.55, margin: "0 0 16px" }}>
          The page you&apos;re looking for isn&apos;t in this vault.
        </p>
        <a href="/" className="sgnk-btn sgnk-btn-primary">
          Open home
        </a>
      </div>
    </main>
  );
}
