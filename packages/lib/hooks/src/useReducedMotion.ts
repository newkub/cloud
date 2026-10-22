import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

/**
 * `prefers-reduced-motion: reduce` as a signal — true when the user asks the
 * OS/browser to minimize animation. SSR-safe: starts false.
 *
 * @returns Accessor for the reduced-motion flag
 *
 * @example
 * const reduced = useReducedMotion();
 * <div class={reduced() ? "" : "transition-all"} />
 */
export function useReducedMotion(): Accessor<boolean> {
	const [reduced, setReduced] = createSignal(false);

	onMount(() => {
		const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
		setReduced(mql.matches);
		const read = (e: MediaQueryListEvent) => setReduced(e.matches);
		mql.addEventListener("change", read);
		onCleanup(() => mql.removeEventListener("change", read));
	});

	return reduced;
}
