import Image from "next/image";
import { signOut } from "@/auth";
import { getActor, LoginScreen } from "@/modules/auth";
import { CommitBar } from "@/modules/repository";
import { ThemeToggle, RightPaneCycle, GraphButton, SidebarToggle } from "@/modules/app-shell";

export default async function VaultLayout({ children }: { children: React.ReactNode }) {
  const actor = await getActor();
  // Home page IS the login screen when nobody is signed in — no 307
  // bounce to `/login`. The dedicated `/login` route still resolves
  // (for sign-out redirects, error landings, and bookmarks).
  if (!actor) {
    return <LoginScreen />;
  }

  return (
    <>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          padding: "0 0.875rem",
          height: "52px",
          background: "var(--panel)",
          borderBottom: "1px solid var(--border)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexShrink: 0 }}>
          <SidebarToggle />
          <span
            aria-hidden
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "26px",
              height: "26px",
              borderRadius: "7px",
              background: "var(--accent)",
              color: "var(--accent-fg)",
              fontSize: "13px",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            sg
          </span>
          <span
            className="hidden sm:inline"
            style={{
              fontWeight: 650,
              fontSize: "0.95rem",
              letterSpacing: "-0.02em",
              color: "var(--fg)",
            }}
          >
            frontmatter
          </span>
        </div>

        <CommitBar />

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
          <GraphButton />
          <RightPaneCycle />
          <ThemeToggle />
          <div
            aria-hidden
            className="hidden md:block"
            style={{ width: "1px", height: "20px", background: "var(--border)", margin: "0 0.15rem" }}
          />
          {actor.avatarUrl && (
            <Image
              src={actor.avatarUrl}
              alt={actor.login}
              width={26}
              height={26}
              style={{ borderRadius: "50%", border: "1px solid var(--border)" }}
            />
          )}
          <span className="hidden md:inline" style={{ fontSize: "0.85rem", color: "var(--fg-muted)", fontWeight: 450 }}>
            {actor.name ?? actor.login}
          </span>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button type="submit" className="sgnk-btn sgnk-btn-ghost hidden sm:inline-flex">
              Sign out
            </button>
          </form>
        </div>
      </header>

      {children}
    </>
  );
}
