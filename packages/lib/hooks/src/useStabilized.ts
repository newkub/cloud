import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";

/** Result of {@link useStabilized}. */
export interface StabilizedValue<T> {
	/** Emits the source value only once it has stayed put for `settleMs`. */
	value: Accessor<T>;
}

/**
 * Suppresses rapid value flicker — `value` trails the source and only
 * updates when the source has stayed unchanged for `settleMs`, always
 * landing on the latest value (trailing-edge debounce).
 *
 * @param source — Accessor to stabilise
 * @param options — `settleMs` is the quiet period required before emitting. @default 100
 * @returns `{ value }` — stabilised accessor starting at the current source value
 *
 * @example
 * const { value: width } = useStabilized(rawWidth, { settleMs: 150 });
 */
export function useStabilized<T>(
	source: Accessor<T>,
	options?: {
		/** Milliseconds the source must stay unchanged before `value` updates. @default 100 */
		settleMs?: number;
	},
): StabilizedValue<T> {
	const settleMs = options?.settleMs ?? 100;
	const [value, setValue] = createSignal(source());
	let timer: ReturnType<typeof setTimeout> | undefined;
	let first = true;
	createEffect(() => {
		const next = source();
		if (first) {
			first = false;
			return;
		}
		clearTimeout(timer);
		timer = setTimeout(() => {
			timer = undefined;
			setValue(() => next);
		}, settleMs);
	});
	onCleanup(() => clearTimeout(timer));
	return { value };
}
