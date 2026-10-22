import { type Accessor, createSignal } from "solid-js";

export interface LockFnState<TArgs extends unknown[], TResult> {
	/**
	 * The wrapped `fn` — calls made while a previous invocation is still
	 * running are dropped and resolve `undefined`. Never throws.
	 */
	run: (...args: TArgs) => Promise<TResult | undefined>;
	/** True while a call is in flight — alias of `running` */
	locked: Accessor<boolean>;
	/** True while a call is in flight */
	running: Accessor<boolean>;
}

/**
 * Wrap an async function so it can never run concurrently — double-clicks
 * and repeated triggers are dropped while `running` is true.
 *
 * @param fn — Async function to guard
 * @returns `{ run, locked, running }` — `run` is the lock-guarded `fn`
 *
 * @example
 * const save = useLockFn((doc: Doc) => api.save(doc));
 * <button disabled={save.running()} onClick={() => save.run(doc)}>save</button>
 */
export function useLockFn<TArgs extends unknown[] = [], TResult = unknown>(
	fn: (...args: TArgs) => Promise<TResult>,
): LockFnState<TArgs, TResult> {
	const [running, setRunning] = createSignal(false);

	const run = async (...args: TArgs) => {
		if (running()) return undefined;
		setRunning(true);
		try {
			return await fn(...args);
		} finally {
			setRunning(false);
		}
	};

	return { run, locked: running, running };
}
