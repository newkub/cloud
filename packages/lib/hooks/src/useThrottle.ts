import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";

/**
 * Throttled copy of a reactive value — the returned accessor emits the
 * first change immediately, then at most once per `ms`, always landing
 * on the latest source value (trailing edge).
 *
 * @param source — Accessor to throttle
 * @param ms — Minimum milliseconds between emissions
 * @param options — `leading: false` suppresses the immediate edge so even
 * the first change of a window is delayed to the trailing edge
 * @returns Accessor that trails the source by up to `ms`
 *
 * @example
 * const pos = useThrottle(pointer, 100);
 */
export function useThrottle<T>(
	source: Accessor<T>,
	ms: number,
	options?: {
		/** Emit the first change of a window immediately. @default true */
		leading?: boolean;
	},
): Accessor<T> {
	const [value, setValue] = createSignal(source());
	let timer: ReturnType<typeof setTimeout> | undefined;
	let latest: T = source();
	let hasTrailing = false;
	let first = true;

	const endWindow = () => {
		if (hasTrailing) {
			hasTrailing = false;
			const next = latest;
			setValue(() => next);
			timer = setTimeout(endWindow, ms);
		} else {
			timer = undefined;
		}
	};

	createEffect(() => {
		const next = source();
		if (first) {
			first = false;
			return;
		}
		latest = next;
		if (timer === undefined) {
			timer = setTimeout(endWindow, ms);
			if (options?.leading !== false) setValue(() => next);
			else hasTrailing = true;
		} else {
			hasTrailing = true;
		}
	});
	onCleanup(() => clearTimeout(timer));
	return value;
}
