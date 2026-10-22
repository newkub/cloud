/**
 * GitHubStats - shields.io badges for a repo (stars, forks, issues) plus an
 * optional live open-PR count fetched from the GitHub API. Fail-safe: network
 * errors degrade to badges only.
 */
import { createResource, For, type JSX, Show, splitProps } from "solid-js";

export interface GitHubStatsProps extends JSX.HTMLAttributes<HTMLElement> {
	/** "owner/repo" */
	repo: string;
	/** Badges to show. @default ["stars","forks","issues"] */
	badges?: ("stars" | "forks" | "issues")[];
	/** Fetch the open-PR count from the GitHub API. @default false */
	showOpenPrs?: boolean;
	/** Optional token to lift the GitHub rate limit. */
	token?: string;
}

const badgeSrc = (repo: string, kind: string) => `https://img.shields.io/github/${kind}/${repo}`;
const badgeLink = (repo: string, kind: string) =>
	`https://github.com/${repo}/${kind === "stars" ? "stargazers" : kind === "forks" ? "forks" : "issues"}`;

async function fetchOpenPrs(repo: string, token?: string): Promise<number> {
	const [owner, name] = repo.split("/");
	const res = await fetch(
		`https://api.github.com/search/issues?q=repo:${owner}/${name}+type:pr+state:open&per_page=1`,
		token ? { headers: { Authorization: `Bearer ${token}` } } : undefined,
	);
	if (!res.ok) throw new Error(`GitHub API ${res.status}`);
	const data = (await res.json()) as { total_count?: number };
	return data.total_count ?? 0;
}

export function GitHubStats(props: GitHubStatsProps) {
	const [local, rest] = splitProps(props, ["class", "repo", "badges", "showOpenPrs", "token"]);

	const [prs] = createResource(
		() => (local.showOpenPrs ? local.repo : undefined),
		async (repo) => fetchOpenPrs(repo, local.token).catch(() => null),
	);

	return (
		<section
			class={`solidui-github-stats flex items-center gap-2 flex-wrap ${local.class ?? ""}`.trim()}
			aria-label="GitHub stats"
			{...rest}
		>
			<For each={local.badges ?? ["stars", "forks", "issues"]}>
				{(kind) => (
					<a href={badgeLink(local.repo, kind)} target="_blank" rel="noreferrer" class="inline-block">
						<img src={badgeSrc(local.repo, kind)} alt={`GitHub ${kind}`} loading="lazy" class="h-5" />
					</a>
				)}
			</For>
			<Show when={typeof prs() === "number"}>
				<span class="text-xs text-muted-foreground">{prs()} open PRs</span>
			</Show>
		</section>
	);
}
