/**
 * Firebase Authentication adapter for the AuthGateway port.
 *
 * Browser-only: the popup flow needs a window. Server code must not import
 * this — it reaches identity through the session helpers instead.
 */
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { firebaseAuth } from "@/shared/infrastructure/firebase/client";
import type { AuthGateway } from "@/modules/auth/application/ports";
import type { AuthUser } from "@/modules/auth/domain/auth-user";

function toAuthUser(user: User): AuthUser {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    providers: user.providerData.map((p) => p.providerId),
  };
}

export function makeFirebaseAuthGateway(): AuthGateway {
  return {
    async signInWithGoogle(): Promise<AuthUser> {
      const provider = new GoogleAuthProvider();
      // Always show the chooser. Without this, a user with several Google
      // accounts is silently signed in as whichever one the browser last
      // used — a nasty surprise on a shared machine.
      provider.setCustomParameters({ prompt: "select_account" });
      const result = await signInWithPopup(firebaseAuth(), provider);
      return toAuthUser(result.user);
    },

    async signOut(): Promise<void> {
      await firebaseSignOut(firebaseAuth());
    },

    currentUser(): AuthUser | null {
      const user = firebaseAuth().currentUser;
      return user === null ? null : toAuthUser(user);
    },

    observeUser(onChange: (user: AuthUser | null) => void): () => void {
      return onAuthStateChanged(firebaseAuth(), (user) => {
        onChange(user === null ? null : toAuthUser(user));
      });
    },

    async getIdToken(forceRefresh = false): Promise<string | null> {
      const user = firebaseAuth().currentUser;
      if (user === null) return null;
      return user.getIdToken(forceRefresh);
    },
  };
}
