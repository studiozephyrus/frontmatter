"use client";

/**
 * Last-resort error UI for crashes inside the root layout itself.
 * Must include its own <html> and <body> because the root layout is unmounted.
 */
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global-error]", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          minHeight: "100dvh",
          margin: 0,
          background: "#1a1a1a",
          color: "#e9eaec",
          display: "grid",
          placeItems: "center",
          fontFamily:
            "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          padding: "24px",
        }}
      >
        <div style={{ maxWidth: 440, textAlign: "center" }}>
          <h1 style={{ fontSize: 22, fontWeight: 650, margin: "0 0 8px" }}>
            sgnk MD crashed
          </h1>
          <p style={{ fontSize: 13, color: "#8a93a4", lineHeight: 1.55, margin: "0 0 16px" }}>
            A fatal error escaped the root layout. Reload or head home.
          </p>
          {error.digest && (
            <p
              style={{
                fontSize: 11,
                color: "#8a93a4",
                fontFamily:
                  "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
                margin: "0 0 16px",
              }}
            >
              ref: {error.digest}
            </p>
          )}
          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            <button
              onClick={() => reset()}
              style={{
                fontSize: 12,
                padding: "6px 14px",
                borderRadius: 6,
                border: "none",
                background: "#ededed",
                color: "#1a1a1a",
                cursor: "pointer",
              }}
            >
              Reload
            </button>
            <a
              href="/"
              style={{
                fontSize: 12,
                padding: "6px 14px",
                borderRadius: 6,
                border: "1px solid #2e2f37",
                background: "transparent",
                color: "#e9eaec",
                textDecoration: "none",
              }}
            >
              Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
