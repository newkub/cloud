import { type Accessor, createSignal, onCleanup } from "solid-js";

export interface TaskState<TArgs extends unknown[], TResult> {
	/**
	 * Start the task — aborts any in-flight run (latest-wins). Resolves with
	 * the result or `undefined` on failure/cancellation — never throws.
	 */
	run: (...args: TArgs) => Promise<TResult | undefined>;
	/** True while the latest run is in flight */
	running: Accessor<boolean>;
	/** Last resolved value — kept across failed/cancelled runs */
	result: Accessor<TResult | undefined>;
	/** Last rejection — cleared on the next `run` */
	error: Accessor<Error | undefined>;
	/** Abort the in-flight run — `running` clears, `result`/`error` untouched */
	cancel: () => void;
	/** `Date.now()` of the last `run` call — `undefined` before the first */
	lastRanAt: Accessor<number | undefined>;
}

/**
 * Cancellable async task — each `run` aborts the previous run via an
 * `AbortSignal` passed as `fn`'s first argument, so only the latest call can
 * write state (latest-run-wins). The task is cancelled automatically on
 * unmount.
 *
 * @param fn — `(signal, ...args) => Promise` — respect `signal` to cancel early
 * @returns `{ run, running, result, error, cancel, lastRanAt }`
 *
 * @example
 * const search = useTask(async (signal, q: string) => {
 *   const res = await fetch(`/api/search?q=${q}`, { signal });
 *   return res.json();
 * });
 * <input onInput={(e) => search.run(e.currentTarget.value)} />
 * <button onClick={search.cancel}>cancel</button>
 */
export function useTask<TArgs extends unknown[], TResult>(
	fn: (signal: AbortSignal, ...args: TArgs) => Promise<TResult>,
): TaskState<TArgs, TResult> {
	const [running, setRunning] = createSignal(false);
	const [result, setResult] = createSignal<TResult>();
	const [error, setError] = createSignal<Error>();
	const [lastRanAt, setLastRanAt] = createSignal<number>();
	let ctrl: AbortController | undefined;
	let runId = 0;

	const abortable = typeof AbortController !== "undefined";

	const run = async (...args: TArgs): Promise<TResult | undefined> => {
		const id = ++runId;
		ctrl?.abort();
		ctrl = abortable ? new AbortController() : undefined;
		const signal = ctrl?.signal ?? ({ aborted: false } as AbortSignal);
		setRunning(true);
		setError(undefined);
		setLastRanAt(Date.now());
		try {
			const value = await fn(signal, ...args);
			if (id === runId) {
				setResult(() => value);
				setRunning(false);
			}
			return value;
		} catch (e) {
			if (id === runId) {
				if (!signal.aborted) setError(e as Error);
				setRunning(false);
			}
			return undefined;
		}
	};

	const cancel = () => {
		ctrl?.abort();
		if (running()) setRunning(false);
	};

	onCleanup(() => ctrl?.abort());

	return { run, running, result, error, cancel, lastRanAt };
}
