export type GitHubStats = { publicRepos: number; followers: number };

export async function fetchGitHubStats(
  user: string,
  fetchImpl: typeof fetch = fetch,
): Promise<GitHubStats | null> {
  try {
    const res = await fetchImpl(`https://api.github.com/users/${user}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (typeof data.public_repos !== "number" || typeof data.followers !== "number") return null;
    return { publicRepos: data.public_repos, followers: data.followers };
  } catch {
    return null;
  }
}
