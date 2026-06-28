export async function fetchGitHubStats(user: string, fetchImpl: typeof fetch = fetch) {
  try {
    const res = await fetchImpl(`https://api.github.com/users/${user}`);
    if (!res.ok) return null;
    const data = await res.json();
    return { publicRepos: data.public_repos as number, followers: data.followers as number };
  } catch {
    return null;
  }
}
