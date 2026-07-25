export type { ActorContext } from "@/modules/auth/domain/actor";
export { getActor, requireActor } from "@/modules/auth/presentation/session";
export { LoginScreen } from "@/modules/auth/presentation/LoginScreen";

// Firebase Auth path — the identity system that replaces Auth.js.
export type { AuthUser } from "@/modules/auth/domain/auth-user";
export type { AuthGateway } from "@/modules/auth/application/ports";
export { GoogleSignInButton } from "@/modules/auth/presentation/GoogleSignInButton";
export type { GoogleSignInButtonProps } from "@/modules/auth/presentation/GoogleSignInButton";
