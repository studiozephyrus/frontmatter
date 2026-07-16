/**
 * NextAuth.js / Auth.js type augmentation.
 * Extends the Session and JWT types with GitHub-specific fields.
 */

import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      login: string;
      name: string | null;
      image: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    login?: string;
    name?: string | null;
    picture?: string | null;
  }
}
