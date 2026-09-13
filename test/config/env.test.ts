import { describe, it, expect } from "vitest";
import { parseEnv, env, parseAuthEnv, parseRepoEnv } from "@/config/env";

describe("parseEnv", () => {
  it("accepts a valid APP_URL", () => {
    const result = parseEnv({ APP_URL: "https://md.sgnk.ai" });
    expect(result.APP_URL).toBe("https://md.sgnk.ai");
  });
  it("throws on a missing/invalid APP_URL", () => {
    expect(() => parseEnv({ APP_URL: "not-a-url" })).toThrow();
    expect(() => parseEnv({})).toThrow();
  });
});

describe("env singleton", () => {
  it("is read-only — assigning a property throws", () => {
    expect(() => {
      (env as Record<string, unknown>)["APP_URL"] = "https://mutated.example.com";
    }).toThrow(/env is read-only/);
  });
});

describe("parseAuthEnv", () => {
  it("parses auth secrets", () => {
    const e = parseAuthEnv({ AUTH_GITHUB_ID: "id", AUTH_GITHUB_SECRET: "s", AUTH_SECRET: "x", ALLOWED_GH_LOGIN: "sagnikmitra" });
    expect(e.ALLOWED_GH_LOGIN).toBe("sagnikmitra");
  });
  it("defaults ALLOWED_GH_LOGIN to sagnikmitra", () => {
    const e = parseAuthEnv({ AUTH_GITHUB_ID: "id", AUTH_GITHUB_SECRET: "s", AUTH_SECRET: "x" });
    expect(e.ALLOWED_GH_LOGIN).toBe("sagnikmitra");
  });
  it("throws when a required auth var is missing", () => {
    expect(() => parseAuthEnv({})).toThrow();
  });
});

describe("parseRepoEnv", () => {
  it("defaults GITHUB_BRANCH but never GITHUB_REPO", () => {
    const e = parseRepoEnv({ GITHUB_REPO_TOKEN: "t", GITHUB_REPO: "owner/repo" });
    expect(e.GITHUB_REPO_TOKEN).toBe("t");
    expect(e.GITHUB_BRANCH).toBe("main");
  });
  // GITHUB_REPO feeds github-writer.ts, so a default is a write to someone
  // else's vault. It used to default to the sibling product's repo, which meant
  // a deploy that forgot the variable wrote there silently.
  it("throws when GITHUB_REPO is missing, rather than picking a repo", () => {
    expect(() => parseRepoEnv({ GITHUB_REPO_TOKEN: "t" })).toThrow();
  });
  it("never falls back to the sibling product's vault", () => {
    let repo: string | undefined;
    try { repo = parseRepoEnv({ GITHUB_REPO_TOKEN: "t" }).GITHUB_REPO; } catch { repo = undefined; }
    expect(repo).not.toBe("sagnikmitra/md");
  });
  it("accepts explicit GITHUB_REPO and GITHUB_BRANCH overrides", () => {
    const e = parseRepoEnv({ GITHUB_REPO_TOKEN: "t", GITHUB_REPO: "owner/repo", GITHUB_BRANCH: "dev" });
    expect(e.GITHUB_REPO).toBe("owner/repo");
    expect(e.GITHUB_BRANCH).toBe("dev");
  });
  it("throws when GITHUB_REPO_TOKEN is missing", () => {
    expect(() => parseRepoEnv({})).toThrow();
  });
  it("throws when GITHUB_REPO_TOKEN is empty string", () => {
    expect(() => parseRepoEnv({ GITHUB_REPO_TOKEN: "" })).toThrow();
  });
});
