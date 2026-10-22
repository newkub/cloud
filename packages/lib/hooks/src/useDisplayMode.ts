import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

export type DisplayMode = "browser" | "standalone" | "fullscreen" | "minimal-ui";

export interface DisplayModeState {
	/** Current display mode — `"browser"` when no display-mode query matches */
	mode: Accessor<DisplayMode>;
	/** Whether `window.matchMedia` exists */
	supported: boolean;
}

const MODES: readonly DisplayMode[] = ["fullscreen", "minimal-ui", "standalone"];

const detect = (): DisplayMode => {
	if (typeof window === "undefined" || typeof window.matchMedia !== "function") return "browser";
	for (const m of MODES) {
		if (window.matchMedia(`(display-mode: ${m})`).matches) return m;
	}
	return "browser";
};

/**
 * Reactive CSS `display-mode` — detects installed-PWA (`standalone`),
 * `fullscreen` and `minimal-ui` presentations. Falls back to `"browser"` and
 * re-checks on every media-query change.
 *
 * @returns `{ mode, supported }`
 *
 * @example
 * const { mode } = useDisplayMode();
 * <Show when={mode() === "standalone"}><InstallHints hidden /></Show>
 */
export function useDisplayMode(): DisplayModeState {
	const [mode, setMode] = createSignal<DisplayMode>(detect());
	const supported = typeof window !== "undefined" && typeof window.matchMedia === "function";

	onMount(() => {
		if (!supported) return;
		const queries = MODES.map((m) => window.matchMedia(`(display-mode: ${m})`));
		const update = () => setMode(detect());
		update();
		for (const q of queries) q.addEventListener("change", update);
		onCleanup(() => {
			for (const q of queries) q.removeEventListener("change", update);
		});
	});

	return { mode, supported };
}
