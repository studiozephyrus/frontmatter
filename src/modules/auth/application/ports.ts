/**
 * Application-layer ports for the auth module.
 * Pure interfaces — no framework imports, no env reads.
 */

import type { AuthUser } from "@/modules/auth/domain/auth-user";

export interface AuthGateway {
  /** Opens the Google sign-in popup and resolves with the signed-in user. */
  signInWithGoogle(): Promise<AuthUser>;

  signOut(): Promise<void>;

  /**
   * The user as currently known to the SDK, without waiting for the initial
   * token restore. Returns null before that restore completes, so prefer
   * `observeUser` for anything that renders — this is for one-shot checks.
   */
  currentUser(): AuthUser | null;

  /**
   * Subscribes to sign-in/sign-out. Fires once with the restored user (or
   * null) as soon as the SDK settles. Returns an unsubscribe function.
   */
  observeUser(onChange: (user: AuthUser | null) => void): () => void;

  /**
   * The current Firebase ID token, for authenticating calls to our own API
   * routes. Null when signed out. The SDK refreshes it automatically; pass
   * `forceRefresh` only after a claims change (e.g. a plan upgrade).
   */
  getIdToken(forceRefresh?: boolean): Promise<string | null>;
}
