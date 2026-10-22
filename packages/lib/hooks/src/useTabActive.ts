import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

/**
 * True while `document.visibilityState === "visible"` — the tab is focused in
 * the foreground. Listens to `visibilitychange`. SSR-safe: starts true.
 *
 * @returns Accessor for the tab-active flag
 *
 * @example
 * const active = useTabActive();
 * <Show when={!active()}>paused — tab hidden</Show>
 */
export function useTabActive(): Accessor<boolean> {
	const [active, setActive] = createSignal(true);

	onMount(() => {
		const read = () => setActive(document.visibilityState === "visible");
		read();
		document.addEventListener("visibilitychange", read);
		onCleanup(() => document.removeEventListener("visibilitychange", read));
	});

	return active;
}
