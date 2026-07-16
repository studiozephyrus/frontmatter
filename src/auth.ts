/**
 * Auth.js (NextAuth v5) initialization.
 *
 * Export handlers for the route handler, and auth/signIn/signOut helpers
 * for server-side use.
 */
import NextAuth from "next-auth";
import { authOptions } from "@/modules/auth/infrastructure/auth-options";

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
