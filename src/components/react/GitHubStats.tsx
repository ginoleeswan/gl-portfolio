import { useEffect, useState } from "react";
import { fetchGitHubStats } from "../../lib/github";

export default function GitHubStats({ user = "ginoleeswan" }: { user?: string }) {
  const [stats, setStats] = useState<{ publicRepos: number; followers: number } | null>(null);
  useEffect(() => { fetchGitHubStats(user).then(setStats); }, [user]);
  if (!stats) return <span className="text-[var(--color-muted)]">GitHub: @{user}</span>;
  return (
    <span className="text-[var(--color-muted)]">
      {stats.publicRepos} public repos · {stats.followers} followers
    </span>
  );
}
