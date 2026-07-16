/**
 * Public layout — wraps unauthenticated, sharable routes (e.g. /p/<slug>).
 * Kept deliberately minimal: no AppShell, no auth gate.
 */

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
