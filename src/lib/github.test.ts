import { fetchGitHubStats } from "./github";

test("returns parsed stats on success", async () => {
  const fakeFetch = (async () =>
    ({ ok: true, json: async () => ({ public_repos: 12, followers: 5 }) })) as unknown as typeof fetch;
  expect(await fetchGitHubStats("ginoleeswan", fakeFetch)).toEqual({ publicRepos: 12, followers: 5 });
});

test("returns null on non-ok response", async () => {
  const fakeFetch = (async () => ({ ok: false })) as unknown as typeof fetch;
  expect(await fetchGitHubStats("ginoleeswan", fakeFetch)).toBeNull();
});

test("returns null when fetch throws", async () => {
  const fakeFetch = (async () => { throw new Error("network"); }) as unknown as typeof fetch;
  expect(await fetchGitHubStats("ginoleeswan", fakeFetch)).toBeNull();
});

test("returns null when response shape is malformed", async () => {
  const fakeFetch = (async () =>
    ({ ok: true, json: async () => ({ message: "Not Found" }) })) as unknown as typeof fetch;
  expect(await fetchGitHubStats("ginoleeswan", fakeFetch)).toBeNull();
});
