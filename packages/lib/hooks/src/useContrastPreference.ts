import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

export type ContrastPreference = "no-preference" | "more" | "less" | "custom";

/**
 * System `prefers-contrast` as a signal — "more", "less", "custom", or
 * "no-preference" when the user has expressed neither. `null` where
 * `matchMedia` is missing (SSR). Priority order when several queries match:
 * `more` > `less` > `custom`.
 *
 * @returns Accessor for the current contrast preference (`null` unsupported)
 *
 * @example
 * const contrast = useContrastPreference();
 * <Show when={contrast() === "more"}><HighContrastTheme /></Show>
 */
export function useContrastPreference(): Accessor<ContrastPreference | null> {
	const supported = typeof window !== "undefined" && typeof window.matchMedia === "function";
	const [preference, setPreference] = createSignal<ContrastPreference | null>(supported ? "no-preference" : null);

	onMount(() => {
		if (!supported) return;
		const more = window.matchMedia("(prefers-contrast: more)");
		const less = window.matchMedia("(prefers-contrast: less)");
		const custom = window.matchMedia("(prefers-contrast: custom)");
		const read = () =>
			setPreference(more.matches ? "more" : less.matches ? "less" : custom.matches ? "custom" : "no-preference");
		read();
		more.addEventListener("change", read);
		less.addEventListener("change", read);
		custom.addEventListener("change", read);
		onCleanup(() => {
			more.removeEventListener("change", read);
			less.removeEventListener("change", read);
			custom.removeEventListener("change", read);
		});
	});

	return preference;
}
