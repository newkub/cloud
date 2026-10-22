import { type Accessor, createSignal, onCleanup } from "solid-js";

export interface DebouncedFn<A extends unknown[]> {
	(...args: A): void;
	/** Drop the pending call, if any */
	cancel: () => void;
	/** Invoke the pending call immediately, if any */
	flush: () => void;
	/** True while a call is scheduled */
	pending: Accessor<boolean>;
}

/**
 * Wrap `fn` so it only runs after `ms` milliseconds without calls — every
 * invocation resets the timer and only the latest arguments are used.
 * The returned function carries `cancel()`, `flush()` and a `pending`
 * accessor; pending calls are dropped on cleanup.
 *
 * @param fn — Function to debounce
 * @param ms — Quiet period in milliseconds. @default 250
 * @returns Debounced function with `cancel`, `flush` and `pending`
 *
 * @example
 * const search = useDebounceFn((q: string) => fetchResults(q), 300);
 * <input onInput={(e) => search(e.currentTarget.value)} />
 */
export function useDebounceFn<A extends unknown[]>(fn: (...args: A) => void, ms = 250): DebouncedFn<A> {
	const [pending, setPending] = createSignal(false);
	let timer: ReturnType<typeof setTimeout> | undefined;
	let lastArgs: A | undefined;

	const cancel = () => {
		clearTimeout(timer);
		timer = undefined;
		lastArgs = undefined;
		setPending(false);
	};

	const run = () => {
		const args = lastArgs;
		cancel();
		if (args !== undefined) fn(...args);
	};

	const debounced = (...args: A) => {
		lastArgs = args;
		clearTimeout(timer);
		timer = setTimeout(run, ms);
		setPending(true);
	};

	onCleanup(cancel);
	return Object.assign(debounced, { cancel, flush: run, pending });
}
