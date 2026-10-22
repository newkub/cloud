import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

export interface CoarsePointerState {
	/** True when the primary pointer is coarse (touch) — tracks media changes */
	coarse: Accessor<boolean>;
	/** Whether `window.matchMedia` exists */
	supported: boolean;
}

const QUERY = "(pointer: coarse)";

/**
 * Reactive `(pointer: coarse)` media query — `coarse()` is true when the
 * primary input is touch/imprecise, false for mouse-first devices. Updates if
 * the primary pointer changes.
 *
 * @returns `{ coarse, supported }`
 *
 * @example
 * const { coarse } = useCoarsePointer();
 * <button class={coarse() ? "h-12 px-6" : "h-8 px-3"}>bigger hit target on touch</button>
 */
export function useCoarsePointer(): CoarsePointerState {
	const supported = typeof window !== "undefined" && typeof window.matchMedia === "function";
	const [coarse, setCoarse] = createSignal(supported ? window.matchMedia(QUERY).matches : false);

	onMount(() => {
		if (!supported) return;
		const mql = window.matchMedia(QUERY);
		const update = () => setCoarse(mql.matches);
		update();
		mql.addEventListener("change", update);
		onCleanup(() => mql.removeEventListener("change", update));
	});

	return { coarse, supported };
}
