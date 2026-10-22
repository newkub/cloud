import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";
import type { AsyncState } from "./useAsync";

export interface AsyncRetryState<T> extends AsyncState<T> {
	/** Number of attempts started by the current/last run (1-based) */
	attempts: Accessor<number>;
}

/**
 * `useAsync` with automatic retries — a rejected call is retried up to
 * `retries` times, waiting `backoff × 2^attempt` ms between tries.
 * Pending backoff timers are cleaned up on dispose.
 *
 * @param fn — Async function to run
 * @param options — `retries` extra attempts. @default 3 — `backoff` base delay in ms. @default 300 — `immediate` runs on mount. @default true
 * @returns `{ data, loading, error, execute, reload, attempts }`
 *
 * @example
 * const report = useAsyncRetry(fetchReport, { retries: 4, backoff: 500 });
 * <p>attempt {report.attempts()} — {report.loading() ? "…" : report.error()?.message}</p>
 */
export function useAsyncRetry<T>(
	fn: () => Promise<T>,
	options?: {
		/** Extra attempts after the first failure. @default 3 */
		retries?: number;
		/** Base backoff in ms — delay doubles each attempt. @default 300 */
		backoff?: number;
		/** Run on mount. @default true */
		immediate?: boolean;
	},
): AsyncRetryState<T> {
	const [data, setData] = createSignal<T>();
	const [error, setError] = createSignal<Error>();
	const [loading, setLoading] = createSignal(false);
	const [attempts, setAttempts] = createSignal(0);
	let runId = 0;
	let timer: ReturnType<typeof setTimeout> | undefined;

	const sleep = (ms: number) =>
		new Promise<void>((resolve) => {
			timer = setTimeout(resolve, ms);
		});

	const execute = async () => {
		const id = ++runId;
		clearTimeout(timer);
		setLoading(true);
		setAttempts(0);
		const retries = options?.retries ?? 3;
		const backoff = options?.backoff ?? 300;
		for (let attempt = 0; attempt <= retries; attempt++) {
			if (id !== runId) return undefined;
			setAttempts(attempt + 1);
			try {
				const result = await fn();
				if (id === runId) {
					setData(() => result);
					setError(undefined);
					setLoading(false);
				}
				return result;
			} catch (e) {
				if (id !== runId) return undefined;
				setError(e as Error);
				if (attempt < retries) await sleep(backoff * 2 ** attempt);
			}
		}
		if (id === runId) setLoading(false);
		return undefined;
	};

	onMount(() => {
		if (options?.immediate !== false) void execute();
	});
	onCleanup(() => clearTimeout(timer));

	return { data, loading, error, execute, reload: execute, attempts };
}
