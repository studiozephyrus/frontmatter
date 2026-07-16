/**
 * Behaviour test for the authOptions.callbacks.signIn callback.
 *
 * We test the callback in isolation — no need to spin up a real NextAuth instance.
 * process.env.ALLOWED_GH_LOGIN must be set before auth-options is imported,
 * because authEnv is a lazy Proxy that reads process.env on first access.
 */
import { describe, it, expect, beforeAll } from "vitest";

// Set the env var before importing auth-options so the lazy proxy picks it up.
beforeAll(() => {
  process.env.AUTH_GITHUB_ID = "test-id";
  process.env.AUTH_GITHUB_SECRET = "test-secret";
  process.env.AUTH_SECRET = "test-secret-32-chars-long-xxxxxx";
  process.env.ALLOWED_GH_LOGIN = "sagnikmitra";
});

describe("authOptions.callbacks.signIn", () => {
  it("returns true for the allowlisted login", async () => {
    // Dynamic import after env is set
    const { authOptions } = await import("@/modules/auth/infrastructure/auth-options");
    const signIn = authOptions.callbacks?.signIn;
    if (!signIn) throw new Error("signIn callback not defined");

    // Call with a GitHub-shaped profile
    const result = await signIn({
      user: { email: "sagnikmitra@example.com" },
      account: null,
      profile: { login: "sagnikmitra", sub: "1", avatar_url: "" } as Record<string, unknown>,
    });

    expect(result).toBe(true);
  });

  it("returns false for a non-allowlisted login", async () => {
    const { authOptions } = await import("@/modules/auth/infrastructure/auth-options");
    const signIn = authOptions.callbacks?.signIn;
    if (!signIn) throw new Error("signIn callback not defined");

    const result = await signIn({
      user: { email: "intruder@example.com" },
      account: null,
      profile: { login: "intruder", sub: "2", avatar_url: "" } as Record<string, unknown>,
    });

    expect(result).toBe(false);
  });

  it("returns false when profile login is undefined", async () => {
    const { authOptions } = await import("@/modules/auth/infrastructure/auth-options");
    const signIn = authOptions.callbacks?.signIn;
    if (!signIn) throw new Error("signIn callback not defined");

    const result = await signIn({
      user: { email: "noone@example.com" },
      account: null,
      profile: {} as Record<string, unknown>,
    });

    expect(result).toBe(false);
  });
});
