/**
 * Server-side session helpers.
 * Uses the auth() function from Auth.js to read the current session.
 *
 * DEV BYPASS:
 *   When DEV_BYPASS_AUTH=1 AND NODE_ENV=development AND the request host is
 *   loopback/private (localhost / 127.x / 192.168.x / 10.x), getActor() returns
 *   a synthetic actor whose login matches ALLOWED_GH_LOGIN. This skips the
 *   GitHub OAuth round-trip entirely on the local dev machine — useful when
 *   the OAuth App's single registered callback URL is for production and
 *   spinning up a second dev OAuth App isn't worth it.
 *
 *   Triple-gated so it can never trigger in prod:
 *     1. NODE_ENV must be "development"
 *     2. DEV_BYPASS_AUTH env var must be "1" (explicit opt-in)
 *     3. Request host must be loopback or RFC1918 private
 *   Missing any gate → falls through to the normal session check.
 */
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/auth";
import { readDevBypassFlags } from "@/config/env";
import type { ActorContext } from "@/modules/auth/domain/actor";

function isLocalHost(host: string | null | undefined): boolean {
  if (!host) return false;
  const h = host.toLowerCase().split(":")[0] ?? "";
  if (h === "localhost" || h === "127.0.0.1" || h === "::1" || h === "[::1]") return true;
  if (h.startsWith("192.168.") || h.startsWith("10.")) return true;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(h)) return true;
  return false;
}

async function maybeDevBypass(): Promise<ActorContext | null> {
  // Env-flag reads live in @/config/env (the only place outside
  // infrastructure where the architecture gate permits raw env access).
  // We still do the loopback-host check here because it's request-scoped
  // state, not configuration.
  const { enabled, allowedLogin } = readDevBypassFlags();
  if (!enabled) return null;
  try {
    const h = await headers();
    if (!isLocalHost(h.get("host"))) return null;
  } catch {
    return null;
  }
  return {
    login: allowedLogin,
    name: `${allowedLogin} (dev bypass)`,
    avatarUrl: null,
  };
}

/**
 * Returns the current authenticated actor, or null if there is no session
 * or the session doesn't contain a valid login.
 */
export async function getActor(): Promise<ActorContext | null> {
  const bypass = await maybeDevBypass();
  if (bypass) return bypass;

  const session = await auth();
  if (!session?.user?.login) {
    return null;
  }
  return {
    login: session.user.login,
    name: session.user.name ?? null,
    avatarUrl: session.user.image ?? null,
  };
}

/**
 * Returns the current authenticated actor.
 * If there is no session, redirects to /login.
 */
export async function requireActor(): Promise<ActorContext> {
  const actor = await getActor();
  if (actor === null) {
    redirect("/login");
  }
  return actor;
}
