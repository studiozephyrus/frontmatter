"use client";

/**
 * Client form for the username/password login fallback.
 *
 * Posts to the `signInWithPassword` server action. On bad credentials the
 * action returns `{ error }` and we surface it inline. On success the action
 * throws the Next.js redirect — the user lands on `/`.
 *
 * The plain password never enters the React tree beyond this form: the input
 * is uncontrolled and FormData is consumed server-side.
 */
import { useActionState, useId } from "react";
import { signInWithPassword, type PasswordSignInState } from "./sign-in-password";

const initialState: PasswordSignInState = { error: null };

export function PasswordLoginForm() {
  const [state, formAction, pending] = useActionState(signInWithPassword, initialState);
  const userId = useId();
  const passId = useId();

  return (
    <form
      action={formAction}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.6rem",
        marginTop: "0.4rem",
        maxWidth: 320,
      }}
      aria-label="Sign in with username and password"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
        <label
          htmlFor={userId}
          style={{ fontSize: "0.78rem", color: "var(--fg-muted)", fontWeight: 500 }}
        >
          Username
        </label>
        <input
          id={userId}
          name="username"
          type="text"
          autoComplete="username"
          required
          className="sgnk-input"
          style={{ width: "100%", height: 38 }}
          disabled={pending}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
        <label
          htmlFor={passId}
          style={{ fontSize: "0.78rem", color: "var(--fg-muted)", fontWeight: 500 }}
        >
          Password
        </label>
        <input
          id={passId}
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="sgnk-input"
          style={{ width: "100%", height: 38 }}
          disabled={pending}
        />
      </div>

      {state.error ? (
        <div
          role="alert"
          style={{
            fontSize: "0.78rem",
            color: "var(--danger)",
            marginTop: "0.1rem",
          }}
        >
          {state.error}
        </div>
      ) : null}

      <button
        type="submit"
        className="sgnk-btn"
        disabled={pending}
        style={{
          width: "100%",
          height: 40,
          marginTop: "0.2rem",
          fontSize: "0.88rem",
        }}
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
