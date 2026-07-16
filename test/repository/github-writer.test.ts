/**
 * Unit tests for githubWriter infrastructure adapter.
 *
 * Mocks the githubFetch function from the shared GitHub client module so no
 * real network requests are made. Verifies each writer method calls the correct
 * endpoint+method+body shape and parses the sha from the response.
 * getBlobSha is verified to return null on 404 (without throwing).
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// ---------------------------------------------------------------------------
// Mock repoEnv — must be hoisted before the module under test is imported
// ---------------------------------------------------------------------------

vi.mock("@/config/env", () => ({
  repoEnv: {
    GITHUB_REPO: "owner/repo",
    GITHUB_BRANCH: "main",
    GITHUB_REPO_TOKEN: "test-token",
  },
}));

// ---------------------------------------------------------------------------
// Mock fetch globally (used by githubFetchNullOn404 inside the adapter)
// ---------------------------------------------------------------------------

const fetchMock = vi.fn();

// ---------------------------------------------------------------------------
// Mock githubFetch from the shared client (used for most endpoints)
// ---------------------------------------------------------------------------

vi.mock("@/shared/infrastructure/github/client", () => ({
  githubFetch: vi.fn(),
}));

import { githubFetch } from "@/shared/infrastructure/github/client";
import { githubWriter } from "@/modules/repository/infrastructure/github-writer";

const mockGithubFetch = vi.mocked(githubFetch);

// Helper to build a mock Response from data
function mockResponse(data: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => data,
  } as Response;
}

// ---------------------------------------------------------------------------
// Helper to build fetch mock for getBlobSha (uses raw fetch, not githubFetch)
// ---------------------------------------------------------------------------

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
  fetchMock.mockReset();
  mockGithubFetch.mockReset();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

// ---------------------------------------------------------------------------
// getHeadCommit
// ---------------------------------------------------------------------------

describe("githubWriter.getHeadCommit", () => {
  it("calls GET ref and GET commit, returns commitSha + treeSha", async () => {
    mockGithubFetch
      .mockResolvedValueOnce(mockResponse({ object: { sha: "commit-abc" } }))
      .mockResolvedValueOnce(mockResponse({ tree: { sha: "tree-xyz" } }));

    const result = await githubWriter.getHeadCommit();

    expect(result).toEqual({ commitSha: "commit-abc", treeSha: "tree-xyz" });

    // First call: ref
    expect(mockGithubFetch).toHaveBeenNthCalledWith(
      1,
      "/repos/owner/repo/git/ref/heads/main",
    );
    // Second call: commit
    expect(mockGithubFetch).toHaveBeenNthCalledWith(
      2,
      "/repos/owner/repo/git/commits/commit-abc",
    );
  });
});

// ---------------------------------------------------------------------------
// getBlobSha
// ---------------------------------------------------------------------------

describe("githubWriter.getBlobSha", () => {
  it("returns sha when file exists", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ sha: "blob-sha-123" }),
    });

    const sha = await githubWriter.getBlobSha("notes/foo.md");

    expect(sha).toBe("blob-sha-123");

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    // Path segments are encoded individually so "/" separators are preserved.
    // "notes/foo.md" → no special chars in either segment → URL keeps "/"
    expect(url).toBe(
      "https://api.github.com/repos/owner/repo/contents/notes/foo.md?ref=main",
    );
    expect((init?.headers as Record<string, string>)?.["Authorization"]).toBe(
      "Bearer test-token",
    );
  });

  it("returns null on 404 (does not throw)", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ message: "Not Found" }),
    });

    const sha = await githubWriter.getBlobSha("notes/missing.md");

    expect(sha).toBeNull();
  });

  it("throws on non-404 errors", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      json: async () => ({ message: "server error" }),
    });

    await expect(githubWriter.getBlobSha("notes/broken.md")).rejects.toThrow(
      /GitHub API error 500/,
    );
  });

  it("encodes each path segment individually (space in name)", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ sha: "encoded-sha" }),
    });

    await githubWriter.getBlobSha("My Notes/file with spaces.md");

    const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain("My%20Notes/file%20with%20spaces.md");
  });
});

// ---------------------------------------------------------------------------
// createBlob
// ---------------------------------------------------------------------------

describe("githubWriter.createBlob", () => {
  it("POSTs to /git/blobs and returns sha", async () => {
    mockGithubFetch.mockResolvedValueOnce(mockResponse({ sha: "new-blob-sha" }));

    const sha = await githubWriter.createBlob("# Hello World");

    expect(sha).toBe("new-blob-sha");
    expect(mockGithubFetch).toHaveBeenCalledWith(
      "/repos/owner/repo/git/blobs",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ content: "# Hello World", encoding: "utf-8" }),
      }),
    );
  });
});

// ---------------------------------------------------------------------------
// createTree
// ---------------------------------------------------------------------------

describe("githubWriter.createTree", () => {
  it("POSTs to /git/trees with correct payload for writes", async () => {
    mockGithubFetch.mockResolvedValueOnce(mockResponse({ sha: "new-tree-sha" }));

    const items = [
      { path: "notes/a.md", sha: "blob-a" },
      { path: "notes/b.md", sha: "blob-b" },
    ];

    const treeSha = await githubWriter.createTree("base-tree", items);

    expect(treeSha).toBe("new-tree-sha");

    const [path, init] = mockGithubFetch.mock.calls[0] as [string, RequestInit];
    expect(path).toBe("/repos/owner/repo/git/trees");
    expect(init?.method).toBe("POST");

    const body = JSON.parse(init?.body as string) as {
      base_tree: string;
      tree: { path: string; mode: string; type: string; sha: string }[];
    };
    expect(body.base_tree).toBe("base-tree");
    expect(body.tree).toHaveLength(2);
    expect(body.tree[0]).toMatchObject({
      path: "notes/a.md",
      mode: "100644",
      type: "blob",
      sha: "blob-a",
    });
  });

  it("passes sha:null for deletions", async () => {
    mockGithubFetch.mockResolvedValueOnce(mockResponse({ sha: "del-tree-sha" }));

    await githubWriter.createTree("base-tree", [{ path: "notes/gone.md", sha: null }]);

    const [, init] = mockGithubFetch.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(init?.body as string) as {
      tree: { path: string; sha: null }[];
    };
    expect(body.tree[0]?.sha).toBeNull();
    expect(body.tree[0]?.path).toBe("notes/gone.md");
  });
});

// ---------------------------------------------------------------------------
// createCommit
// ---------------------------------------------------------------------------

describe("githubWriter.createCommit", () => {
  it("POSTs to /git/commits with correct payload and returns sha", async () => {
    mockGithubFetch.mockResolvedValueOnce(mockResponse({ sha: "commit-sha-new" }));

    const author = { name: "Test Author", email: "test@example.com" };
    const sha = await githubWriter.createCommit("test commit", "tree-sha", "parent-sha", author);

    expect(sha).toBe("commit-sha-new");

    const [path, init] = mockGithubFetch.mock.calls[0] as [string, RequestInit];
    expect(path).toBe("/repos/owner/repo/git/commits");
    expect(init?.method).toBe("POST");

    const body = JSON.parse(init?.body as string) as {
      message: string;
      tree: string;
      parents: string[];
      author: { name: string; email: string; date: string };
      committer: { name: string; email: string; date: string };
    };
    expect(body.message).toBe("test commit");
    expect(body.tree).toBe("tree-sha");
    expect(body.parents).toEqual(["parent-sha"]);
    expect(body.author.name).toBe("Test Author");
    expect(body.author.email).toBe("test@example.com");
    expect(body.author.date).toBeTruthy(); // ISO timestamp
    expect(body.committer).toEqual(body.author); // same as author
  });
});

// ---------------------------------------------------------------------------
// updateRef
// ---------------------------------------------------------------------------

describe("githubWriter.updateRef", () => {
  it("PATCHes /git/refs/heads/{branch} with sha and force:false", async () => {
    mockGithubFetch.mockResolvedValueOnce(mockResponse({ ref: "refs/heads/main" }));

    await githubWriter.updateRef("commit-to-advance");

    const [path, init] = mockGithubFetch.mock.calls[0] as [string, RequestInit];
    expect(path).toBe("/repos/owner/repo/git/refs/heads/main");
    expect(init?.method).toBe("PATCH");

    const body = JSON.parse(init?.body as string) as { sha: string; force: boolean };
    expect(body.sha).toBe("commit-to-advance");
    expect(body.force).toBe(false);
  });
});
