import { type Accessor, createSignal, onMount } from "solid-js";

/**
 * True after `onMount` — false during SSR/hydration render, true once the
 * component is in the live DOM. Handy for gating browser-only widgets or
 * starting animations on entry.
 *
 * @returns Accessor for the mounted flag
 *
 * @example
 * const mounted = useMounted();
 * <Show when={mounted()}><ClientOnlyChart /></Show>
 */
export function useMounted(): Accessor<boolean> {
	const [mounted, setMounted] = createSignal(false);
	onMount(() => setMounted(true));
	return mounted;
}
