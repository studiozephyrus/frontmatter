import { signIn } from "@/auth";
import { ThemeToggle } from "@/modules/app-shell";
import { PasswordLoginForm } from "./PasswordLoginForm";

/**
 * Self-contained login screen — wrapper chrome + the GitHub sign-in card.
 *
 * Rendered from two places now:
 *   1. The dedicated `/login` route (kept for backward-compatible deep
 *      links — sign-out, error redirects, bookmarks).
 *   2. The root `/` route via `(vault)/layout.tsx` when no actor is
 *      present. Lets the home URL BE the login page instead of issuing
 *      a 307 redirect to `/login`.
 *
 * Includes its own page-level chrome (theme toggle + radial-accent
 * canvas background) so it can render inside any group's layout
 * without depending on `(auth)/layout.tsx`.
 */
export function LoginScreen() {
  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{
        background:
          "radial-gradient(80% 60% at 50% 0%, color-mix(in srgb, var(--accent) 18%, transparent), transparent 65%), var(--bg)",
        color: "var(--fg)",
      }}
    >
      <div style={{ position: "absolute", top: 16, right: 16, zIndex: 1 }}>
        <ThemeToggle />
      </div>

      <div
        className="sgnk-fade-in login-grid"
        style={{
          width: "100%",
          maxWidth: 1180,
          padding: "clamp(2rem, 5vw, 4rem)",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
          gap: "clamp(2rem, 6vw, 5rem)",
          alignItems: "center",
        }}
      >
        {/* Left: pixel-bitmap markdown wordmark. Theme-swapped:
            - mdx-light.png: shown when theme = light
            - mdx-dark.png:  shown when theme = dark
            Swap rules (.dark + prefers-color-scheme fallback) live in
            globals.css; both images preload so the toggle is instant. */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img
            src="/mdx-light.png"
            alt="markdown"
            className="login-bitmap-light"
            style={{ width: "100%", maxWidth: 520, height: "auto", display: "block" }}
          />
          <img
            src="/mdx-dark.png"
            alt=""
            aria-hidden
            className="login-bitmap-dark"
            style={{ width: "100%", maxWidth: 520, height: "auto", display: "none" }}
          />
        </div>

        {/* Right: brand mark + headline + GitHub sign-in. */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", maxWidth: 440 }}>
          <img
            src="/favicon.png"
            alt="sgnk-md"
            width={44}
            height={44}
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              display: "block",
              boxShadow: "var(--shadow-md, 0 8px 24px rgba(0,85,255,.3))",
            }}
          />
          <h1
            style={{
              margin: 0,
              fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              color: "var(--fg)",
            }}
          >
            Your Markdown HQ
          </h1>
          <p style={{ margin: 0, fontSize: "1rem", lineHeight: 1.55, color: "var(--muted)" }}>
            A GitHub-backed markdown workspace. Write in plain files, share any
            note as a public URL, switch between web, mobile, and the native app —
            your notes follow you.
          </p>
          <form
            style={{ marginTop: "0.5rem" }}
            action={async () => {
              "use server";
              await signIn("github", { redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="sgnk-btn sgnk-btn-primary"
              style={{
                width: "100%",
                maxWidth: 320,
                height: 48,
                fontSize: "0.95rem",
                gap: "0.6rem",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
              Sign in with GitHub
            </button>
          </form>

          {/* Divider — hair-line + label, matches design-system tokens. */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              maxWidth: 320,
              marginTop: "0.4rem",
            }}
            aria-hidden
          >
            <span style={{ flex: 1, height: 1, background: "var(--border)" }} />
            <span style={{ fontSize: "0.72rem", color: "var(--muted)", letterSpacing: "0.04em" }}>
              OR
            </span>
            <span style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>

          <PasswordLoginForm />
        </div>
      </div>

      <style>{`
        @media (max-width: 760px) {
          .login-grid {
            grid-template-columns: minmax(0, 1fr) !important;
            text-align: center;
          }
          .login-grid > div:last-child {
            margin: 0 auto;
            align-items: center !important;
          }
        }
      `}</style>
    </div>
  );
}
