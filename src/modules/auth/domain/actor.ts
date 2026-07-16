/**
 * Represents the authenticated caller within a request.
 * Access tokens are intentionally absent — they remain server-side only
 * and are never embedded in this context object.
 */
export type ActorContext = {
  readonly login: string;
  readonly name: string | null;
  readonly avatarUrl: string | null;
};
