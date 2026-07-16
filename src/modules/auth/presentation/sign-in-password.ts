"use server";

/**
 * Server action for the username/password login form.
 *
 * Returns `{ error }` on bad credentials so the client component can render
 * an inline message. Calls `signIn(...)` with `redirect: true` only when the
 * caller passes valid credentials — successful sign-in throws the Next.js
 * redirect (caught by the framework, not us).
 *
 * NextAuth v5 throws `AuthError` (subclass `CredentialsSignin`) when
 * `authorize()` returns null. We catch that specifically and surface a
 * generic "Invalid credentials" message — never echoing what the user typed
 * and never leaking whether the username or the password was wrong.
 */
import { AuthError } from "next-auth";
import { signIn } from "@/auth";

export type PasswordSignInState = { error: string | null };

export async function signInWithPassword(
  _prev: PasswordSignInState,
  formData: FormData,
): Promise<PasswordSignInState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!username || !password) {
    return { error: "Username and password are required." };
  }

  try {
    await signIn("sgnk-password", {
      username,
      password,
      redirectTo: "/",
    });
    // signIn redirects on success; if it returns, treat as failure.
    return { error: "Invalid credentials." };
  } catch (err) {
    // The redirect that NextAuth throws on success is a Next.js
    // NEXT_REDIRECT error — re-throw so the framework can handle it.
    if (err instanceof Error && "digest" in err && String((err as { digest?: unknown }).digest).startsWith("NEXT_REDIRECT")) {
      throw err;
    }
    if (err instanceof AuthError) {
      return { error: "Invalid credentials." };
    }
    return { error: "Sign-in failed. Try again." };
  }
}
