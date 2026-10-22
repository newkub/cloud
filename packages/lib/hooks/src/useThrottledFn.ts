import { onCleanup } from "solid-js";

/**
 * Wrap `fn` so it runs at most once per `ms` — the first call of a window
 * fires immediately (leading edge) and the last call of the window fires
 * when it closes (trailing edge). Both edges can be disabled
 * independently. Pending timers are dropped on cleanup.
 *
 * @param fn — Function to throttle
 * @param ms — Minimum milliseconds between invocations
 * @param options — `leading` / `trailing` toggles for each edge
 * @returns Throttled function with the same signature as `fn`
 *
 * @example
 * const onScroll = useThrottledFn((e: Event) => track(e), 100);
 * window.addEventListener("scroll", onScroll);
 */
export function useThrottledFn<A extends unknown[]>(
	fn: (...args: A) => void,
	ms: number,
	options?: {
		/** Invoke on the leading edge of a window. @default true */
		leading?: boolean;
		/** Invoke the most recent call on the trailing edge. @default true */
		trailing?: boolean;
	},
): (...args: A) => void {
	let timer: ReturnType<typeof setTimeout> | undefined;
	let lastArgs: A | undefined;

	const endWindow = () => {
		if (lastArgs !== undefined && options?.trailing !== false) {
			const args = lastArgs;
			lastArgs = undefined;
			timer = setTimeout(endWindow, ms);
			fn(...args);
		} else {
			lastArgs = undefined;
			timer = undefined;
		}
	};

	const throttled = (...args: A) => {
		if (timer === undefined) {
			timer = setTimeout(endWindow, ms);
			if (options?.leading !== false) fn(...args);
			else lastArgs = args;
		} else {
			lastArgs = args;
		}
	};

	onCleanup(() => clearTimeout(timer));
	return throttled;
}
