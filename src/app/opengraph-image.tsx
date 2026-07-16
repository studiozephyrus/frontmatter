import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "sgnk MD — Your Markdown HQ";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Default Open Graph image for sgnk MD. Rendered at request time by Next's
 * built-in `next/og` so it always matches the current brand tokens.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "80px",
          background:
            "linear-gradient(135deg, #1a1a1a 0%, #141519 60%, #1c1d23 100%)",
          color: "#e9eaec",
          fontFamily:
            "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "14px",
              background: "#0055ff",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              boxShadow: "0 6px 24px rgba(0, 85, 255, 0.45)",
            }}
          >
            sg
          </div>
          <div
            style={{
              fontSize: "40px",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "#e9eaec",
            }}
          >
            sgnk MD
          </div>
        </div>
        <div
          style={{
            fontSize: "60px",
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "-0.025em",
            maxWidth: "900px",
            color: "#ffffff",
            marginBottom: "20px",
          }}
        >
          Your Markdown HQ.
        </div>
        <div
          style={{
            fontSize: "26px",
            color: "#9ca0a8",
            lineHeight: 1.4,
            maxWidth: "880px",
          }}
        >
          A GitHub-backed markdown workspace. Write, link, graph, share by URL —
          on web, mobile, and a native macOS app.
        </div>
      </div>
    ),
    { ...size },
  );
}
