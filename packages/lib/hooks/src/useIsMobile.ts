import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

/**
 * True on phones and tablets — combines a `max-width: 768px` viewport check
 * with a touch heuristic (coarse pointer or `maxTouchPoints`) capped at
 * `max-width: 1024px`, so narrow desktop windows and touch laptops are
 * handled sanely. SSR-safe: starts false.
 *
 * @returns Accessor for the mobile flag
 *
 * @example
 * const mobile = useIsMobile();
 * <Show when={mobile()} fallback={<Sidebar />}><DrawerNav /></Show>
 */
export function useIsMobile(): Accessor<boolean> {
	const [mobile, setMobile] = createSignal(false);

	onMount(() => {
		const narrow = window.matchMedia("(max-width: 768px)");
		const tablet = window.matchMedia("(max-width: 1024px)");
		const coarse = window.matchMedia("(pointer: coarse)");
		const read = () => {
			const touch = coarse.matches || navigator.maxTouchPoints > 0;
			setMobile(narrow.matches || (touch && tablet.matches));
		};
		read();
		for (const mql of [narrow, tablet, coarse]) mql.addEventListener("change", read);
		onCleanup(() => {
			for (const mql of [narrow, tablet, coarse]) mql.removeEventListener("change", read);
		});
	});

	return mobile;
}
