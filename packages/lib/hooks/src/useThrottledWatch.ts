import { type Accessor, createEffect, createRoot, on, onCleanup } from "solid-js";

/** Options for {@link useThrottledWatch}. */
export interface ThrottledWatchOptions {
	/** Minimum interval in ms between invocations. @default 0 */
	throttle?: number;
	/** Emit the latest suppressed value when the window closes. @default true */
	trailing?: boolean;
	/** Skip the leading-edge emission — only the trailing one fires. @default false */
	noLeading?: boolean;
}

/**
 * Throttled `useWatch` — the first change fires on the leading edge (unless
 * `noLeading`), changes inside the window are collapsed, and the latest
 * suppressed value fires once on the trailing edge (unless `trailing: false`).
 * Returns a `stop()` handle; also stops with the owning scope.
 *
 * @param source — Accessor to observe
 * @param callback — `(value, previous)` with `previous` = last delivered value
 * @param options — `throttle`, `trailing`, `noLeading`
 * @returns `stop()` — detach the watcher early
 *
 * @example
 * useThrottledWatch(mouseX, (x) => track(x), { throttle: 100 });
 * useThrottledWatch(pos, send, { throttle: 500, noLeading: true });
 */
export function useThrottledWatch<T>(
	source: Accessor<T>,
	callback: (value: T, previous: T | undefined) => void,
	options?: ThrottledWatchOptions,
): () => void {
	const throttle = options?.throttle ?? 0;
	const trailing = options?.trailing !== false;
	const noLeading = options?.noLeading ?? false;
	let last = source();
	let lastFire = -Infinity;
	let timer: ReturnType<typeof setTimeout> | undefined;
	let hasPending = false;
	let pendingValue: T;

	const deliver = (value: T) => {
		lastFire = Date.now();
		const previous = last;
		last = value;
		callback(value, previous);
	};

	const change = (value: T) => {
		if (timer !== undefined) {
			pendingValue = value;
			hasPending = true;
			return;
		}
		const onWindowEdge = () => {
			timer = undefined;
			if (hasPending && trailing) {
				hasPending = false;
				deliver(pendingValue);
			}
		};
		const sinceLast = Date.now() - lastFire;
		if (!noLeading && sinceLast >= throttle) {
			deliver(value);
			timer = setTimeout(onWindowEdge, throttle);
			return;
		}
		pendingValue = value;
		hasPending = true;
		timer = setTimeout(onWindowEdge, noLeading ? throttle : Math.max(1, throttle - sinceLast));
	};

	const dispose = createRoot((d) => {
		createEffect(on(source, change, { defer: true }));
		return () => {
			clearTimeout(timer);
			timer = undefined;
			d();
		};
	});
	onCleanup(dispose);
	return dispose;
}
