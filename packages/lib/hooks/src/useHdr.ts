import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

/**
 * HDR display detection as a signal — `true` when either the
 * `dynamic-range: high` or `video-dynamic-range: high` media query matches
 * (both spellings ship in different engines). Tracks `change` events so the
 * value follows windows dragged between SDR and HDR screens. SSR-safe and
 * jsdom-safe: stays `false` when `matchMedia` is missing.
 *
 * @returns Accessor for HDR support of the current display
 *
 * @example
 * const hdr = useHdr();
 * <video src={hdr() ? hdrSrc : sdrSrc} />
 */
export function useHdr(): Accessor<boolean> {
	const [hdr, setHdr] = createSignal(false);

	onMount(() => {
		if (typeof window.matchMedia !== "function") return;
		const queries = [window.matchMedia("(dynamic-range: high)"), window.matchMedia("(video-dynamic-range: high)")];
		const read = () => setHdr(queries.some((q) => q.matches));
		read();
		for (const q of queries) q.addEventListener("change", read);
		onCleanup(() => {
			for (const q of queries) q.removeEventListener("change", read);
		});
	});

	return hdr;
}
