import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

export interface ScreenSafeAreaState {
	/** Resolved `env(safe-area-inset-top)` (e.g. `"0px"`, `"44px"`). */
	top: Accessor<string>;
	/** Resolved `env(safe-area-inset-bottom)`. */
	bottom: Accessor<string>;
	/** Resolved `env(safe-area-inset-left)`. */
	left: Accessor<string>;
	/** Resolved `env(safe-area-inset-right)`. */
	right: Accessor<string>;
}

/**
 * Measures the CSS `env(safe-area-inset-*)` values by applying them to an
 * offscreen probe element and reading the computed padding — the only reliable
 * way to get pixel insets from JS. Re-measures on `resize` and
 * `orientationchange`; the probe and listeners are removed on cleanup. During
 * SSR (or when `env()` is unsupported) every value resolves to the browser
 * default.
 *
 * @returns `{ top, bottom, left, right }` accessors
 *
 * @example
 * const area = useScreenSafeArea();
 * <header style={{ "padding-top": area.top() }} />
 */
export function useScreenSafeArea(): ScreenSafeAreaState {
	const [top, setTop] = createSignal("0px");
	const [bottom, setBottom] = createSignal("0px");
	const [left, setLeft] = createSignal("0px");
	const [right, setRight] = createSignal("0px");

	onMount(() => {
		if (typeof document === "undefined") return;
		const probe = document.createElement("div");
		probe.style.cssText =
			"position:fixed;top:0;left:0;width:0;height:0;visibility:hidden;pointer-events:none;" +
			"padding:env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);";
		document.body.appendChild(probe);

		const measure = () => {
			const style = getComputedStyle(probe);
			setTop(style.paddingTop);
			setRight(style.paddingRight);
			setBottom(style.paddingBottom);
			setLeft(style.paddingLeft);
		};
		measure();

		window.addEventListener("resize", measure);
		window.addEventListener("orientationchange", measure);
		onCleanup(() => {
			window.removeEventListener("resize", measure);
			window.removeEventListener("orientationchange", measure);
			probe.remove();
		});
	});

	return { top, bottom, left, right };
}
