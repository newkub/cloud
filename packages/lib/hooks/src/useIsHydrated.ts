import { type Accessor, createSignal, onMount } from "solid-js";

/**
 * False during SSR and the first client render, true once `onMount`
 * fires — the point where the server markup has been hydrated and
 * browser-only behaviour is safe to enable.
 *
 * @returns Accessor for the hydrated flag
 *
 * @example
 * const hydrated = useIsHydrated();
 * <Show when={hydrated()}><ClientOnlyWidget /></Show>
 */
export function useIsHydrated(): Accessor<boolean> {
	const [hydrated, setHydrated] = createSignal(false);
	onMount(() => setHydrated(true));
	return hydrated;
}
