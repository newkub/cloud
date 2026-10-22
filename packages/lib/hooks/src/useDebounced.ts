import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";

/**
 * A debounced accessor — call it like a normal `Accessor<T>`. It also
 * carries imperative controls: `flush()` emits the pending value now,
 * `cancel()` drops it, and `pending()` reports a scheduled emission.
 */
export type DebouncedValue<T> = Accessor<T> & {
	/** Emit the pending value immediately */
	flush: () => void;
	/** Drop the pending value */
	cancel: () => void;
	/** True while a change is scheduled */
	pending: Accessor<boolean>;
};

/**
 * Debounced copy of a reactive value — the returned accessor only updates
 * after `ms` milliseconds without changes. Supports leading-edge
 * emission, a `maxWait` cap, and trailing-edge suppression.
 *
 * @param source — Accessor to debounce
 * @param ms — Quiet period in milliseconds. @default 250
 * @param options — `leading` emits the first edge of a burst; `trailing`
 * emits the last edge; `maxWait` caps the delay
 * @returns Accessor that trails the source by `ms`, with `flush`/`cancel`/`pending` attached
 *
 * @example
 * const query = useDebounced(input, 300);
 * const firstOnly = useDebounced(input, 300, { leading: true, trailing: false });
 */
export function useDebounced<T>(
	source: Accessor<T>,
	ms = 250,
	options?: {
		/** Emit the first edge of a burst immediately. @default false */
		leading?: boolean;
		/** Emit the final value when the burst settles. @default true */
		trailing?: boolean;
		/** Force the latest value through after this many ms even if the source keeps changing. */
		maxWait?: number;
	},
): DebouncedValue<T> {
	const [value, setValue] = createSignal(source());
	const [isPending, setIsPending] = createSignal(false);
	let timer: ReturnType<typeof setTimeout> | undefined;
	let maxTimer: ReturnType<typeof setTimeout> | undefined;
	let latest: T = source();
	let first = true;
	let leadingEmitted = false;

	const clear = () => {
		clearTimeout(timer);
		clearTimeout(maxTimer);
		timer = undefined;
		maxTimer = undefined;
		leadingEmitted = false;
		setIsPending(false);
	};

	const settle = (emit: boolean) => {
		clear();
		if (emit) {
			const next = latest;
			setValue(() => next);
		}
	};

	const flush = () => settle(true);
	const cancel = () => settle(false);

	createEffect(() => {
		const next = source();
		if (first) {
			first = false;
			return;
		}
		latest = next;
		if (options?.leading && timer === undefined && !leadingEmitted) {
			leadingEmitted = true;
			setValue(() => next);
		}
		clearTimeout(timer);
		timer = setTimeout(() => settle(options?.trailing !== false), ms);
		setIsPending(true);
		if (options?.maxWait !== undefined && maxTimer === undefined) {
			maxTimer = setTimeout(() => settle(options?.trailing !== false), options.maxWait);
		}
	});
	onCleanup(clear);
	return Object.assign(value, { flush, cancel, pending: isPending });
}
