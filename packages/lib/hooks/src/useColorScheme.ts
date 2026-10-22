import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

export type ColorScheme = "light" | "dark" | "no-preference";

/**
 * System `prefers-color-scheme` as a signal — "dark", "light", or
 * "no-preference" when the user has expressed neither. SSR-safe: starts
 * "no-preference".
 *
 * @returns Accessor for the current color scheme
 *
 * @example
 * const scheme = useColorScheme();
 * <Show when={scheme() === "dark"}><DarkLogo /></Show>
 */
export function useColorScheme(): Accessor<ColorScheme> {
	const [scheme, setScheme] = createSignal<ColorScheme>("no-preference");

	onMount(() => {
		const dark = window.matchMedia("(prefers-color-scheme: dark)");
		const light = window.matchMedia("(prefers-color-scheme: light)");
		const read = () => setScheme(dark.matches ? "dark" : light.matches ? "light" : "no-preference");
		read();
		dark.addEventListener("change", read);
		light.addEventListener("change", read);
		onCleanup(() => {
			dark.removeEventListener("change", read);
			light.removeEventListener("change", read);
		});
	});

	return scheme;
}
