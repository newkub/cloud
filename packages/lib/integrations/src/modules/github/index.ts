// ============================================================================
// GitHub Integration — HTTP adapter over the GitHub REST API
// ============================================================================

export interface GitHubConfig {
	token: string;
	baseUrl?: string;
}

export interface GitHubRepository {
	owner: string;
	name: string;
	fullName: string;
	description?: string;
}

export interface GitHubIssue {
	number: number;
	title: string;
	state: string;
}

export interface GitHubClientPort {
	getRepository(owner: string, name: string): Promise<GitHubRepository>;
	listIssues(
		owner: string,
		name: string,
		state?: string,
	): Promise<GitHubIssue[]>;
}

class GitHubHttpAdapter implements GitHubClientPort {
	private readonly baseUrl: string;
	private readonly token: string;

	constructor(config: GitHubConfig) {
		this.baseUrl = config.baseUrl ?? "https://api.github.com";
		this.token = config.token;
	}

	async getRepository(owner: string, name: string): Promise<GitHubRepository> {
		const res = await fetch(`${this.baseUrl}/repos/${owner}/${name}`, {
			headers: {
				Authorization: `Bearer ${this.token}`,
				Accept: "application/vnd.github+json",
			},
		});

		if (!res.ok) {
			throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
		}

		const data = (await res.json()) as {
			full_name: string;
			description?: string;
		};

		return {
			owner,
			name,
			fullName: data.full_name,
			description: data.description,
		};
	}

	async listIssues(
		owner: string,
		name: string,
		state?: string,
	): Promise<GitHubIssue[]> {
		const url = new URL(`${this.baseUrl}/repos/${owner}/${name}/issues`);
		if (state) {
			url.searchParams.set("state", state);
		}

		const res = await fetch(url, {
			headers: {
				Authorization: `Bearer ${this.token}`,
				Accept: "application/vnd.github+json",
			},
		});

		if (!res.ok) {
			throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
		}

		return (await res.json()) as GitHubIssue[];
	}
}

export const createGitHubClient = (config: GitHubConfig): GitHubClientPort => {
	if (!config.token) {
		throw new Error("GitHub token is required");
	}
	return new GitHubHttpAdapter(config);
};
