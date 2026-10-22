import { type Accessor, createSignal, onCleanup } from "solid-js";

export interface DelayedFnState<TArgs extends unknown[]> {
	/** Schedule `fn` — re-calling before it fires reschedules the timer */
	run: (...args: TArgs) => void;
	/** Cancel the pending invocation (no-op when idle) */
	cancel: () => void;
	/** True while an invocation is scheduled */
	pending: Accessor<boolean>;
}

/**
 * Delayed execution — `run` schedules `fn` to fire after `ms`, `cancel`
 * drops it, and unmounting clears the timer so `fn` never fires on a
 * disposed component.
 *
 * @param fn — Callback to invoke after the delay
 * @param ms — Delay in milliseconds
 * @returns `{ run, cancel, pending }`
 *
 * @example
 * const toast = useDelayedFn(() => dismiss(), 4000);
 * toast.run(); // auto-dismiss in 4s — toast.cancel() keeps it
 */
export function useDelayedFn<TArgs extends unknown[] = []>(
	fn: (...args: TArgs) => void,
	ms: number,
): DelayedFnState<TArgs> {
	const [pending, setPending] = createSignal(false);
	let timer: ReturnType<typeof setTimeout> | undefined;

	const cancel = () => {
		clearTimeout(timer);
		timer = undefined;
		setPending(false);
	};

	const run = (...args: TArgs) => {
		cancel();
		setPending(true);
		timer = setTimeout(() => {
			timer = undefined;
			setPending(false);
			fn(...args);
		}, ms);
	};

	onCleanup(cancel);

	return { run, cancel, pending };
}
