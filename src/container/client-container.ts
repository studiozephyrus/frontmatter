/**
 * Browser-side composition root.
 *
 * Separate from `dependency-container.ts` on purpose: that one is an eagerly
 * constructed server singleton, and the adapters wired here only work in a
 * browser (the Google popup needs a window). Keeping them apart stops a
 * client-only SDK from being instantiated during a server render.
 *
 * Client components under `src/app` import from here. Presentation modules
 * must not — the architecture gate forbids presentation → container, so a
 * gateway reaches a presentation component as a prop or through context.
 */
import { makeFirebaseAuthGateway } from "@/modules/auth/infrastructure/firebase-auth-gateway";
import type { AuthGateway } from "@/modules/auth/application/ports";

let _authGateway: AuthGateway | undefined;

/** Lazily constructed so nothing initialises Firebase at import time. */
export function authGateway(): AuthGateway {
  _authGateway ??= makeFirebaseAuthGateway();
  return _authGateway;
}
