/**
 * NextAuth v5 (Auth.js) configuration.
 *
 * Two providers:
 *   - GitHub OAuth (primary).
 *   - Credentials (`sgnk` / password) — fallback for environments where the
 *     GitHub OAuth callback isn't reachable. Password verified server-side
 *     against scrypt hash in SGNK_AUTH_HASH; plain text never leaves the
 *     request handler. Grants the same actor surface as the OAuth user, so
 *     all repo-backed notes are readable.
 *
 * IMPORTANT: Do NOT reference authEnv or process.env at module load time.
 * - clientId/clientSecret/secret are auto-read from AUTH_GITHUB_ID /
 *   AUTH_GITHUB_SECRET / AUTH_SECRET at request time by NextAuth.
 * - authEnv.ALLOWED_GH_LOGIN is accessed ONLY inside the signIn callback
 *   (request time), never at import time.
 */
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import type { GitHubProfile } from "@auth/core/providers/github";
import { isAllowed } from "@/modules/auth/domain/allowlist";
import { authEnv } from "@/config/env";
import { verifyPassword } from "@/modules/auth/infrastructure/password";

export const authOptions: NextAuthConfig = {
  providers: [
    GitHub({
      authorization: { params: { scope: "read:user" } },
    }),

    Credentials({
      id: "sgnk-password",
      name: "Username / password",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(raw) {
        // Request-time env reads (never at module load).
        const expectedUser = process.env["SGNK_AUTH_USER"];
        const hash = process.env["SGNK_AUTH_HASH"];
        if (!expectedUser || !hash) return null;

        const username = typeof raw?.["username"] === "string" ? raw["username"].trim() : "";
        const password = typeof raw?.["password"] === "string" ? raw["password"] : "";
        if (!username || !password) return null;

        // Constant-time username comparison via verifyPassword's all-paths
        // KDF run + an explicit string check.
        const userMatch = username.toLowerCase() === expectedUser.trim().toLowerCase();
        const passOk = await verifyPassword(password, hash);
        if (!userMatch || !passOk) return null;

        // The returned user shape becomes `user` in the jwt callback (first
        // sign-in only). `login` mirrors the GitHub provider so downstream
        // code (`session.user.login`, allowlist checks, repo writer attribution)
        // continues to work unchanged.
        return {
          id: expectedUser.toLowerCase(),
          login: expectedUser.toLowerCase(),
          name: expectedUser,
          image: null,
        };
      },
    }),
  ],

  session: { strategy: "jwt" },

  pages: { signIn: "/login" },

  callbacks: {
    signIn({ account, profile }) {
      // Credentials path: `authorize` already validated user+password —
      // no allowlist gate needed (only the configured SGNK_AUTH_USER can
      // reach here).
      if (account?.provider === "sgnk-password") return true;

      // GitHub path: gate on the configured login allowlist.
      const ghProfile = profile as unknown as GitHubProfile | undefined;
      return isAllowed(ghProfile?.login, authEnv.ALLOWED_GH_LOGIN);
    },

    jwt({ token, profile, user, account }) {
      if (account?.provider === "sgnk-password" && user) {
        // Credentials first sign-in: copy login/name from authorize() result.
        const u = user as { login?: string; name?: string | null };
        if (u.login) token.login = u.login;
        token.name = u.name ?? null;
        token.picture = null;
        return token;
      }

      if (profile) {
        // GitHub first sign-in: profile is available. Store identity only.
        const ghProfile = profile as unknown as GitHubProfile;
        token.login = ghProfile.login;
        token.name = ghProfile.name ?? null;
        token.picture = ghProfile.avatar_url ?? null;
      }
      return token;
    },

    session({ session, token }) {
      if (token.login) {
        session.user.login = token.login as string;
      }
      if (token.name !== undefined) {
        session.user.name = token.name as string | null;
      }
      if (token.picture !== undefined) {
        session.user.image = token.picture as string | null;
      }
      return session;
    },
  },
};
