import { type Accessor, createSignal, onCleanup } from "solid-js";

export interface RetryableFetchOptions<T> {
	/** Fetcher — receives the url and this attempt's AbortSignal. */
	fetcher?: (url: string, signal: AbortSignal) => Promise<T>;
	/** Max retries after the first attempt. @default 2 */
	retries?: number;
	/** Base backoff in ms — doubles per attempt. @default 300 */
	backoffMs?: number;
	/** Fetch immediately. @default true */
	immediate?: boolean;
}

export interface RetryableFetchControls<T> {
	data: Accessor<T | undefined>;
	error: Accessor<unknown>;
	loading: Accessor<boolean>;
	/** Which attempt produced the current error/result. */
	attempt: Accessor<number>;
	/** Re-run the request. */
	refetch: () => void;
	/** Abort the in-flight request. */
	cancel: () => void;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Fetch with retry + exponential backoff. Stale/aborted in-flight responses
 * are discarded (latest-wins), and the request is cancelled on dispose.
 *
 * @param url - url or accessor for reactive re-fetching callers drive refetch
 * @param options - `{ fetcher, retries, backoffMs, immediate }`
 * @returns `{ data, error, loading, attempt, refetch, cancel }`
 *
 * @example
 * const q = useRetryableFetch("/api/me", { retries: 3 });
 * <Show when={!q.loading()}>{q.data()?.name}</Show>
 */
export function useRetryableFetch<T = unknown>(
	url: string,
	options: RetryableFetchOptions<T> = {},
): RetryableFetchControls<T> {
	const fetcher =
		options.fetcher ?? (async (u: string, s: AbortSignal) => (await fetch(u, { signal: s })).json() as Promise<T>);
	const retries = options.retries ?? 2;
	const backoffMs = options.backoffMs ?? 300;

	const [data, setData] = createSignal<T | undefined>(undefined);
	const [error, setError] = createSignal<unknown>(undefined);
	const [loading, setLoading] = createSignal(false);
	const [attempt, setAttempt] = createSignal(0);

	let controller: AbortController | undefined;
	let generation = 0;

	const cancel = () => {
		generation += 1;
		controller?.abort();
		controller = undefined;
		setLoading(false);
	};

	const run = async () => {
		cancel();
		const gen = generation + 1;
		generation = gen;
		const ctrl = new AbortController();
		controller = ctrl;
		setLoading(true);
		setError(undefined);
		for (let i = 0; i <= retries; i += 1) {
			if (gen !== generation) return;
			setAttempt(i + 1);
			try {
				const result = await fetcher(url, ctrl.signal);
				if (gen !== generation) return;
				setData(() => result);
				setLoading(false);
				return;
			} catch (e) {
				if (gen !== generation || ctrl.signal.aborted) return;
				if (i === retries) {
					setError(e);
					setLoading(false);
					return;
				}
				await sleep(backoffMs * 2 ** i);
			}
		}
	};

	if (options.immediate !== false) void run();
	onCleanup(cancel);
	return { data, error, loading, attempt, refetch: () => void run(), cancel };
}
