import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

/**
 * `forced-colors: active` as a signal — true when the OS forces a limited
 * color palette (e.g. Windows High Contrast), meaning the page cannot control
 * colors freely. SSR-safe: starts false.
 *
 * @returns Accessor for the forced-colors flag
 *
 * @example
 * const forced = useForcedColors();
 * <Show when={!forced()}><CustomColorPicker /></Show>
 */
export function useForcedColors(): Accessor<boolean> {
	const [forced, setForced] = createSignal(false);

	onMount(() => {
		if (typeof window.matchMedia !== "function") return;
		const mql = window.matchMedia("(forced-colors: active)");
		setForced(mql.matches);
		const read = (e: MediaQueryListEvent) => setForced(e.matches);
		mql.addEventListener("change", read);
		onCleanup(() => mql.removeEventListener("change", read));
	});

	return forced;
}
