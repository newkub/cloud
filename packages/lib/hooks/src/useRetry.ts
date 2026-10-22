import { type Accessor, createSignal, onCleanup } from "solid-js";

export interface RetryOptions {
	/** Extra attempts after the first failure. @default 2 */
	retries?: number;
	/** Base delay between attempts in milliseconds. @default 300 */
	delay?: number;
	/** Multiplier applied to the delay on each retry (exponential backoff). @default 2 */
	backoff?: number;
}

export interface RetryState<TArgs extends unknown[], TResult> {
	/**
	 * Run `fn` — retries on rejection up to `retries` times with backoff.
	 * Resolves with the result, or `undefined` once attempts are exhausted.
	 */
	run: (...args: TArgs) => Promise<TResult | undefined>;
	/** Current attempt number — 0 while idle */
	attempt: Accessor<number>;
	loading: Accessor<boolean>;
	error: Accessor<Error | undefined>;
	result: Accessor<TResult | undefined>;
}

/**
 * Retry an async function with exponential backoff — tracks the attempt
 * counter, loading flag, last error and result. Pending backoff timers are
 * cleared on unmount; `run` never throws.
 *
 * @param fn — Async function to retry
 * @param options — `retries` extra attempts, `delay` base ms, `backoff` multiplier
 * @returns `{ run, attempt, loading, error, result }`
 *
 * @example
 * const job = useRetry(() => fetch("/api/report").then(r => r.json()), { retries: 3, delay: 500 });
 * <button onClick={() => job.run()} disabled={job.loading()}>retrying: {job.attempt()}</button>
 */
export function useRetry<TArgs extends unknown[] = [], TResult = unknown>(
	fn: (...args: TArgs) => Promise<TResult>,
	options?: RetryOptions,
): RetryState<TArgs, TResult> {
	const [attempt, setAttempt] = createSignal(0);
	const [loading, setLoading] = createSignal(false);
	const [error, setError] = createSignal<Error>();
	const [result, setResult] = createSignal<TResult>();
	let timer: ReturnType<typeof setTimeout> | undefined;
	let disposed = false;

	onCleanup(() => {
		disposed = true;
		clearTimeout(timer);
	});

	const wait = (ms: number) =>
		new Promise<void>((r) => {
			timer = setTimeout(r, ms);
		});

	const run = async (...args: TArgs) => {
		const retries = options?.retries ?? 2;
		const delay = options?.delay ?? 300;
		const backoff = options?.backoff ?? 2;
		setLoading(true);
		setError(undefined);
		for (let i = 0; i <= retries; i++) {
			if (disposed) break;
			setAttempt(i);
			try {
				const value = await fn(...args);
				if (disposed) return undefined;
				setResult(() => value);
				setLoading(false);
				return value;
			} catch (e) {
				setError(e as Error);
				if (i < retries) await wait(delay * backoff ** i);
			}
		}
		setAttempt(0);
		setLoading(false);
		return undefined;
	};

	return { run, attempt, loading, error, result };
}
