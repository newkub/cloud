import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

/**
 * `inverted-colors: inverted` as a signal — true when the OS inverts all
 * display colors (accessibility feature, mostly Safari on macOS/iOS). Do not
 * re-invert images or colors while active. SSR-safe: starts false.
 *
 * @returns Accessor for the inverted-colors flag
 *
 * @example
 * const inverted = useInvertedColors();
 * <img src={logo()} class={inverted() ? "" : "dark:invert"} />
 */
export function useInvertedColors(): Accessor<boolean> {
	const [inverted, setInverted] = createSignal(false);

	onMount(() => {
		if (typeof window.matchMedia !== "function") return;
		const mql = window.matchMedia("(inverted-colors: inverted)");
		setInverted(mql.matches);
		const read = (e: MediaQueryListEvent) => setInverted(e.matches);
		mql.addEventListener("change", read);
		onCleanup(() => mql.removeEventListener("change", read));
	});

	return inverted;
}
