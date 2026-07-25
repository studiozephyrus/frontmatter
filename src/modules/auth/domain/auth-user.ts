/**
 * The signed-in identity, as the rest of the app sees it.
 *
 * Deliberately free of any Firebase type: the domain layer must not know
 * which identity provider is behind it. ID tokens are absent by design —
 * they are fetched on demand through the AuthGateway port and never parked
 * on a domain object.
 *
 * Distinct from `ActorContext`, which is the legacy GitHub-login-shaped
 * identity used by the Auth.js path. `AuthUser` is keyed on `uid`, which is
 * what Firestore security rules match against (`request.auth.uid`).
 */
export interface AuthUser {
  /** Firebase Auth uid — the primary key for every user-owned document. */
  readonly uid: string;
  readonly email: string | null;
  readonly displayName: string | null;
  readonly photoURL: string | null;
  /** Provider ids linked to this account, e.g. ["google.com"]. */
  readonly providers: readonly string[];
}
