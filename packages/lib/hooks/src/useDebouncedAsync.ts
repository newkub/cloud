import { type Accessor, createSignal, onCleanup } from "solid-js";

export interface DebouncedAsyncControls<A extends unknown[], T> {
	/** Schedule a debounced call — only the latest call within `ms` invokes `fn` */
	run: (...args: A) => void;
	/** True while a call is debouncing or in flight */
	pending: Accessor<boolean>;
	/** Result of the most recently settled call — stale resolutions are ignored */
	result: Accessor<T | undefined>;
	/** Rejection of the most recently settled call — cleared on the next success */
	error: Accessor<unknown>;
	/** Drop the scheduled call and ignore any in-flight result */
	cancel: () => void;
}

/**
 * Debounced async runner — `run(...)` waits `ms` of quiet before invoking
 * `fn`, so rapid calls collapse into one execution. Latest-wins: a run is
 * superseded by the next `run()`, and results from superseded runs never
 * write state. Timers and in-flight stale writes are cleaned up on dispose.
 * SSR-safe.
 *
 * @param fn — Async function to invoke after the quiet period
 * @param ms — Debounce delay in milliseconds. @default 250
 * @returns `{ run, pending, result, error, cancel }`
 *
 * @example
 * const search = useDebouncedAsync((q: string) => api.search(q), 300);
 * <input onInput={(e) => search.run(e.currentTarget.value)} />
 * <Show when={search.pending()}>searching…</Show>
 * <p>{search.result()?.total} hits</p>
 */
export function useDebouncedAsync<A extends unknown[], T>(
	fn: (...args: A) => Promise<T>,
	ms = 250,
): DebouncedAsyncControls<A, T> {
	const [pending, setPending] = createSignal(false);
	const [result, setResult] = createSignal<T>();
	const [error, setError] = createSignal<unknown>(undefined);
	let timer: ReturnType<typeof setTimeout> | undefined;
	let runId = 0;

	const cancel = () => {
		clearTimeout(timer);
		timer = undefined;
		runId++; // invalidate any in-flight or scheduled run
		setPending(false);
	};

	const run = (...args: A) => {
		clearTimeout(timer);
		const id = ++runId;
		setPending(true);
		timer = setTimeout(() => {
			timer = undefined;
			Promise.resolve()
				.then(() => fn(...args))
				.then(
					(value) => {
						if (id !== runId) return;
						setResult(() => value);
						setError(undefined);
						setPending(false);
					},
					(e) => {
						if (id !== runId) return;
						setError(e);
						setPending(false);
					},
				);
		}, ms);
	};

	onCleanup(cancel);
	return { run, pending, result, error, cancel };
}
