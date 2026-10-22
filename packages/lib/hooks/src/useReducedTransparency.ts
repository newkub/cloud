import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

/**
 * `prefers-reduced-transparency: reduce` as a signal — true when the user asks
 * the OS/browser to minimize transparent and translucent effects. SSR-safe:
 * starts false.
 *
 * @returns Accessor for the reduced-transparency flag
 *
 * @example
 * const reduced = useReducedTransparency();
 * <div class={reduced() ? "bg-solid" : "bg-glass backdrop-blur"} />
 */
export function useReducedTransparency(): Accessor<boolean> {
	const [reduced, setReduced] = createSignal(false);

	onMount(() => {
		if (typeof window.matchMedia !== "function") return;
		const mql = window.matchMedia("(prefers-reduced-transparency: reduce)");
		setReduced(mql.matches);
		const read = (e: MediaQueryListEvent) => setReduced(e.matches);
		mql.addEventListener("change", read);
		onCleanup(() => mql.removeEventListener("change", read));
	});

	return reduced;
}
