import { type Accessor, createEffect, createSignal, onCleanup, onMount } from "solid-js";
import type { MaybeAccessor } from "./useEventListener";

/**
 * Resolved value of a CSS custom property (or any `getPropertyValue` key) on
 * `<html>` — e.g. `"--primary"` or `"color-scheme"`. Re-reads when a
 * MutationObserver sees `class`/`style`/`data-*` attribute changes on the
 * root element, so theme toggles update the accessor; also tracks `token`
 * when it's an accessor. SSR-safe: returns "".
 *
 * @param token — CSS property name, usually a custom property like `"--primary"` (or an accessor for one)
 * @returns Accessor for the trimmed computed value ("" when unset or SSR)
 *
 * @example
 * const accent = useThemeValue("--primary");
 * <span style={{ "background-color": accent() }} />
 */
export function useThemeValue(token: MaybeAccessor<string>): Accessor<string> {
	const [value, setValue] = createSignal("");

	const read = () => {
		if (typeof document === "undefined") return;
		const t = typeof token === "function" ? (token as Accessor<string>)() : token;
		setValue(getComputedStyle(document.documentElement).getPropertyValue(t).trim());
	};

	onMount(() => {
		const observer = new MutationObserver(read);
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["class", "style", "data-theme", "data-mode"],
		});
		createEffect(read);
		onCleanup(() => observer.disconnect());
	});

	return value;
}
