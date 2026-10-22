import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";

export interface OverflowState {
	/** True when content overflows horizontally (`scrollWidth > clientWidth`) */
	overflowX: Accessor<boolean>;
	/** True when content overflows vertically (`scrollHeight > clientHeight`) */
	overflowY: Accessor<boolean>;
	/** True when content overflows in either direction */
	overflow: Accessor<boolean>;
}

/**
 * Detect content overflow on an element — compares `scroll*` against
 * `client*` box sizes and re-checks via ResizeObserver on the element and
 * its children, so both resizes and content growth are caught. Re-observes
 * when `ref()` resolves to a new element.
 *
 * @param ref — Accessor for the element to check
 * @returns `{ overflowX, overflowY, overflow }` flag accessors
 *
 * @example
 * let box!: HTMLDivElement;
 * const { overflow } = useOverflow(() => box);
 * <div ref={box} class="overflow-auto">{overflow() && <GradientFade />}</div>
 */
export function useOverflow(ref: Accessor<HTMLElement | undefined>): OverflowState {
	const [overflowX, setOverflowX] = createSignal(false);
	const [overflowY, setOverflowY] = createSignal(false);
	const overflow: Accessor<boolean> = () => overflowX() || overflowY();

	createEffect(() => {
		const el = ref();
		if (!el || typeof ResizeObserver === "undefined") return;
		const check = () => {
			setOverflowX(el.scrollWidth > el.clientWidth);
			setOverflowY(el.scrollHeight > el.clientHeight);
		};
		check();
		const ro = new ResizeObserver(check);
		ro.observe(el);
		for (const child of el.children) ro.observe(child);
		onCleanup(() => {
			ro.disconnect();
			setOverflowX(false);
			setOverflowY(false);
		});
	});

	return { overflowX, overflowY, overflow };
}
