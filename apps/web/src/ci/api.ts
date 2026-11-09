import { createORPCClient, onError } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { QueryClient } from "@tanstack/solid-query";

export type RunStatus =
	| "running"
	| "success"
	| "failed"
	| "healing"
	| "healed"
	| "heal_failed";

export type RunFailure = {
	runner: { name: string; command: string; cwd?: string };
	output: string;
};

export type RunRecord = {
	id: string;
	owner: string;
	repo: string;
	ref: string;
	branch: string | null;
	sha: string;
	trigger: string;
	actor: string | null;
	message: string | null;
	status: RunStatus;
	failures: RunFailure[];
	createdAt: number;
	finishedAt: number | null;
};

export type HealStatus = "running" | "pushed" | "failed";

export type HealRecord = {
	runId: string;
	status: HealStatus;
	steps: number;
	branch: string | null;
	commit: string | null;
	prUrl: string | null;
	prNumber: number | null;
	error: string | null;
	startedAt: number;
	finishedAt: number | null;
};

export type RegistryStats = {
	totalRuns: number;
	running: number;
	succeeded: number;
	failed: number;
	healing: number;
	healed: number;
	healFailed: number;
	totalHeals: number;
	healsPushed: number;
	healsRunning: number;
	healsFailed: number;
	healRate: number;
	successRate: number;
	lastRunAt: number | null;
};

export type CiHealth = {
	ok: boolean;
	name: string;
	bindings: string;
	time: number;
};

export type CiConfig = {
	namespace: string;
	repo: string;
	backupBucket: string;
	model: string;
};

type List<T> = { items: T[]; total: number };

type CiApi = {
	health: () => Promise<CiHealth>;
	stats: () => Promise<RegistryStats>;
	watch: { config: () => Promise<CiConfig> };
	runs: {
		list: (input?: {
			status?: RunStatus;
			limit?: number;
			offset?: number;
		}) => Promise<List<RunRecord>>;
		get: (input: { id: string }) => Promise<RunWithHeal>;
	};
	heals: {
		list: (input?: {
			status?: HealStatus;
			limit?: number;
			offset?: number;
		}) => Promise<List<HealRecord>>;
		get: (input: { runId: string }) => Promise<HealRecord>;
	};
};

export type RunWithHeal = RunRecord & { heal: HealRecord | null };

export const CI_API_KEY = "cloud:ci-api";

export function ciApiBase(): string {
	const stored =
		typeof localStorage !== "undefined"
			? localStorage.getItem(CI_API_KEY)?.trim()
			: "";
	const configured =
		stored || (import.meta.env.VITE_CI_API_URL as string | undefined)?.trim();
	const base = configured || window.location.origin;
	return new URL(base, window.location.origin).toString().replace(/\/+$/, "");
}

function createClient(): CiApi {
	return createORPCClient(
		new RPCLink({
			url: `${ciApiBase()}/rpc`,
			interceptors: [
				onError((error) => {
					console.error("oRPC request failed", error);
				}),
			],
		}),
	) as unknown as CiApi;
}

export const orpc: CiApi = new Proxy({} as CiApi, {
	get(_target, prop) {
		return createClient()[prop as keyof CiApi];
	},
});

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchInterval: 10_000,
			retry: 1,
			staleTime: 3_000,
		},
	},
});
