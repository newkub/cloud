import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

/**
 * Ticking clock — an accessor holding the current `Date`, refreshed on an
 * interval. SSR-safe: the value is captured at creation and only starts
 * ticking after mount.
 *
 * @param interval — Refresh rate in milliseconds. @default 1000
 * @returns Accessor for the current `Date`
 *
 * @example
 * const now = useNow(1000);
 * <p>{now().toLocaleTimeString()}</p>
 */
export function useNow(interval = 1000): Accessor<Date> {
	const [now, setNow] = createSignal(new Date());

	onMount(() => {
		const id = setInterval(() => setNow(new Date()), interval);
		onCleanup(() => clearInterval(id));
	});

	return now;
}
