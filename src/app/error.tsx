"use client";

/**
 * Route-level error boundary for the App Router.
 * Catches render/runtime errors in any nested route segment beneath the
 * root layout. The root layout itself is covered by `global-error.tsx`.
 */
import { useEffect } from "react";

export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Send to console for now; wire to Sentry in the observability batch.
    console.error("[route-error]", error);
  }, [error]);

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
        <h1 style={{ fontSize: 22, fontWeight: 650, margin: "0 0 8px" }}>Something broke</h1>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.55, margin: "0 0 16px" }}>
          The page hit an error. You can try again or head back home.
        </p>
        {error.digest && (
          <p
            style={{
              fontSize: 11,
              color: "var(--muted)",
              fontFamily: "var(--font-mono)",
              margin: "0 0 16px",
            }}
          >
            ref: {error.digest}
          </p>
        )}
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          <button onClick={() => reset()} className="sgnk-btn sgnk-btn-primary">
            Try again
          </button>
          <a href="/" className="sgnk-btn sgnk-btn-ghost">
            Home
          </a>
        </div>
      </div>
    </main>
  );
}
