import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// repoEnv reads process.env at access time; stub the token so githubFetch works.
beforeEach(() => {
  process.env["GITHUB_REPO"] = "owner/repo";
  process.env["GITHUB_BRANCH"] = "main";
  process.env["GITHUB_REPO_TOKEN"] = "test-token";
});

afterEach(() => {
  vi.restoreAllMocks();
});

async function freshClient() {
  // Re-import to get a clean module (no shared state, but keeps intent clear).
  return import("@/shared/infrastructure/github/client");
}

function res(status: number, body = ""): Response {
  return new Response(body, { status });
}

describe("githubFetch retry behaviour", () => {
  it("returns immediately on a 200 (no retry)", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(res(200, "ok"));
    const { githubFetch } = await freshClient();
    const r = await githubFetch("/x");
    expect(r.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("retries a 502 and succeeds on the second attempt", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(res(502))
      .mockResolvedValueOnce(res(200, "recovered"));
    const { githubFetch } = await freshClient();
    const r = await githubFetch("/x");
    expect(r.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("gives up after MAX_ATTEMPTS on persistent 503", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(res(503));
    const { githubFetch } = await freshClient();
    await expect(githubFetch("/x")).rejects.toThrow("GitHub API error 503");
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("does NOT retry a 404 — throws FileNotFoundError immediately", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(res(404));
    const { githubFetch } = await freshClient();
    const { FileNotFoundError } = await import("@/shared/domain/errors");
    await expect(githubFetch("/missing")).rejects.toBeInstanceOf(FileNotFoundError);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("does NOT retry a 401 (deterministic auth failure)", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(res(401));
    const { githubFetch } = await freshClient();
    await expect(githubFetch("/x")).rejects.toThrow("GitHub API error 401");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("retries a thrown network error then succeeds", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockRejectedValueOnce(new Error("ECONNRESET"))
      .mockResolvedValueOnce(res(200, "ok"));
    const { githubFetch } = await freshClient();
    const r = await githubFetch("/x");
    expect(r.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
