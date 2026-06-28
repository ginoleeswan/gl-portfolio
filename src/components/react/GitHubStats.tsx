import { useEffect, useState } from "react";
import { fetchGitHubStats } from "../../lib/github";

export default function GitHubStats({ user = "ginoleeswan" }: { user?: string }) {
  const [stats, setStats] = useState<{ publicRepos: number; followers: number } | null>(null);
  useEffect(() => {
    fetchGitHubStats(user)
      .then(setStats)
      .catch(() => setStats(null));
  }, [user]);
  const dot = <span className="mr-2 inline-block h-[7px] w-[7px] rounded-full bg-acid align-middle" />;
  if (!stats)
    return (
      <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-steel">
        {dot}GITHUB @{user}
      </span>
    );
  return (
    <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-steel">
      {dot}
      <span className="text-bone">{stats.publicRepos}</span> REPOS &middot;{" "}
      <span className="text-bone">{stats.followers}</span> FOLLOWERS
    </span>
  );
}
