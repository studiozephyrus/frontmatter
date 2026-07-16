/**
 * Auth-group layout — pass-through.
 *
 * The visual chrome (radial bg, theme toggle, login grid) lives in
 * `<LoginScreen />` (`@/modules/auth`) so the same component can render
 * at `/` from the vault layout AND at `/login` from this route group.
 * Keeping the layout here as a no-op preserves the route group while
 * letting either entry-point own its own page chrome.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
