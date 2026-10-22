import { type Accessor, createSignal, onMount } from "solid-js";

export interface AsyncState<T> {
	/** Last resolved value */
	data: Accessor<T | undefined>;
	/** True while `execute` is in flight */
	loading: Accessor<boolean>;
	/** Last rejection — cleared on the next success */
	error: Accessor<Error | undefined>;
	/** Run `fn` — resolves with the result or `undefined` on failure, never throws */
	execute: () => Promise<T | undefined>;
	/** Alias of `execute` — re-run the last call */
	reload: () => Promise<T | undefined>;
}

/**
 * Run an async function and expose `data`/`loading`/`error`. Overlapping calls
 * are race-safe — only the latest `execute` writes state. Runs on mount unless
 * `immediate: false` (SSR-safe: nothing fires during server render).
 *
 * @param fn — Async function to run
 * @param options — `immediate` runs on mount. @default true
 * @returns `{ data, loading, error, execute, reload }`
 *
 * @example
 * const user = useAsync(() => fetch("/api/me").then(r => r.json()));
 * <Show when={!user.loading()} fallback="loading…">{user.data()?.name}</Show>
 */
export function useAsync<T>(
	fn: () => Promise<T>,
	options?: {
		/** Run on mount. @default true */
		immediate?: boolean;
	},
): AsyncState<T> {
	const [data, setData] = createSignal<T>();
	const [error, setError] = createSignal<Error>();
	const [loading, setLoading] = createSignal(false);
	let runId = 0;

	const execute = async () => {
		const id = ++runId;
		setLoading(true);
		try {
			const result = await fn();
			if (id === runId) {
				setData(() => result);
				setError(undefined);
			}
			return result;
		} catch (e) {
			if (id === runId) setError(e as Error);
			return undefined;
		} finally {
			if (id === runId) setLoading(false);
		}
	};

	onMount(() => {
		if (options?.immediate !== false) void execute();
	});

	return { data, loading, error, execute, reload: execute };
}
