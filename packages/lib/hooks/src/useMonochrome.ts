import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

const MAX_MONOCHROME_BITS = 64;

/**
 * Monochrome display level as a signal — `0` for a normal color display,
 * otherwise the bits-per-pixel of the monochrome screen (e-readers, system
 * monochrome modes). Resolved by binary-searching `min-monochrome` media
 * queries; re-read when `(monochrome)` changes so window moves between
 * displays are tracked. SSR/jsdom-safe: stays `0` without `matchMedia` —
 * `0` is falsy, so `monochrome()` doubles as a boolean.
 *
 * @returns Accessor for the monochrome bits-per-pixel (`0` = color)
 *
 * @example
 * const mono = useMonochrome();
 * <img src={mono() ? bwSrc : colorSrc} />
 */
export function useMonochrome(): Accessor<number> {
	const [monochrome, setMonochrome] = createSignal(0);

	onMount(() => {
		if (typeof window.matchMedia !== "function") return;
		const query = window.matchMedia("(monochrome)");
		const read = () => {
			if (!window.matchMedia("(min-monochrome: 1)").matches) {
				setMonochrome(0);
				return;
			}
			let lo = 1;
			let hi = MAX_MONOCHROME_BITS;
			while (lo < hi) {
				const mid = Math.ceil((lo + hi) / 2);
				if (window.matchMedia(`(min-monochrome: ${mid})`).matches) lo = mid;
				else hi = mid - 1;
			}
			setMonochrome(lo);
		};
		read();
		query.addEventListener("change", read);
		onCleanup(() => query.removeEventListener("change", read));
	});

	return monochrome;
}
