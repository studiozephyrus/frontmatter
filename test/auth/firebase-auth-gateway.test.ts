import { describe, it, expect, vi, beforeEach } from "vitest";

// The gateway is browser-only, so firebase/auth is mocked wholesale. What we
// actually care about here is the User -> AuthUser mapping and the popup
// options — the parts that are ours rather than the SDK's.
const signInWithPopup = vi.fn();
const firebaseSignOut = vi.fn();
const onAuthStateChanged = vi.fn();
const setCustomParameters = vi.fn();

const authState: { currentUser: unknown } = { currentUser: null };

vi.mock("firebase/auth", () => ({
  GoogleAuthProvider: class {
    setCustomParameters = setCustomParameters;
  },
  signInWithPopup: (...args: unknown[]) => signInWithPopup(...args),
  signOut: (...args: unknown[]) => firebaseSignOut(...args),
  onAuthStateChanged: (...args: unknown[]) => onAuthStateChanged(...args),
}));

vi.mock("@/shared/infrastructure/firebase/client", () => ({
  firebaseAuth: () => authState,
}));

const { makeFirebaseAuthGateway } = await import(
  "@/modules/auth/infrastructure/firebase-auth-gateway"
);

const GOOGLE_USER = {
  uid: "uid-123",
  email: "sagnik@example.com",
  displayName: "Sagnik Mitra",
  photoURL: "https://example.com/a.png",
  providerData: [{ providerId: "google.com" }],
  getIdToken: vi.fn(async () => "id-token"),
};

beforeEach(() => {
  vi.clearAllMocks();
  authState.currentUser = null;
});

describe("firebaseAuthGateway", () => {
  it("maps a Firebase user onto the AuthUser domain shape", async () => {
    signInWithPopup.mockResolvedValueOnce({ user: GOOGLE_USER });

    const user = await makeFirebaseAuthGateway().signInWithGoogle();

    expect(user).toEqual({
      uid: "uid-123",
      email: "sagnik@example.com",
      displayName: "Sagnik Mitra",
      photoURL: "https://example.com/a.png",
      providers: ["google.com"],
    });
  });

  it("never leaks a token onto the domain object", async () => {
    signInWithPopup.mockResolvedValueOnce({ user: GOOGLE_USER });

    const user = await makeFirebaseAuthGateway().signInWithGoogle();

    expect(Object.keys(user)).not.toContain("getIdToken");
    expect(Object.keys(user)).not.toContain("accessToken");
  });

  it("forces the Google account chooser", async () => {
    signInWithPopup.mockResolvedValueOnce({ user: GOOGLE_USER });

    await makeFirebaseAuthGateway().signInWithGoogle();

    expect(setCustomParameters).toHaveBeenCalledWith({ prompt: "select_account" });
  });

  it("reports null for currentUser and getIdToken when signed out", async () => {
    const gateway = makeFirebaseAuthGateway();

    expect(gateway.currentUser()).toBeNull();
    await expect(gateway.getIdToken()).resolves.toBeNull();
  });

  it("returns an id token when signed in", async () => {
    authState.currentUser = GOOGLE_USER;

    await expect(makeFirebaseAuthGateway().getIdToken()).resolves.toBe("id-token");
    expect(GOOGLE_USER.getIdToken).toHaveBeenCalledWith(false);
  });

  it("maps the observer's null through unchanged on sign-out", () => {
    const seen: unknown[] = [];
    onAuthStateChanged.mockImplementation((_auth: unknown, cb: (u: unknown) => void) => {
      cb(null);
      cb(GOOGLE_USER);
      return () => undefined;
    });

    makeFirebaseAuthGateway().observeUser((u) => seen.push(u));

    expect(seen[0]).toBeNull();
    expect(seen[1]).toMatchObject({ uid: "uid-123", providers: ["google.com"] });
  });
});
