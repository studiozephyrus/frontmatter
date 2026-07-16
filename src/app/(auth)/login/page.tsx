import { redirect } from "next/navigation";
import { getActor, LoginScreen } from "@/modules/auth";

/**
 * Dedicated `/login` route — kept for back-compat (sign-out redirects,
 * error landings, bookmarks). The same content is rendered at `/` by
 * `(vault)/layout.tsx` when no actor is present, so the home URL
 * doubles as the login page without a 307 hop.
 *
 * Signed-in visitors bounce to the workspace.
 */
export default async function LoginPage() {
  const actor = await getActor();
  if (actor !== null) {
    redirect("/");
  }
  return <LoginScreen />;
}
