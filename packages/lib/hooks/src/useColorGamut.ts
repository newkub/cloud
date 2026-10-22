import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

export type ColorGamut = "srgb" | "p3" | "rec2020";

/**
 * Widest supported `color-gamut` as a signal — "rec2020", "p3", or "srgb",
 * reported widest-first since gamuts are nested (rec2020 ⊃ p3 ⊃ srgb).
 * `null` where `matchMedia` is missing or no gamut query matches.
 *
 * @returns Accessor for the widest supported color gamut (`null` unsupported)
 *
 * @example
 * const gamut = useColorGamut();
 * <Show when={gamut() === "p3" || gamut() === "rec2020"}><WideGamutPalette /></Show>
 */
export function useColorGamut(): Accessor<ColorGamut | null> {
	const [gamut, setGamut] = createSignal<ColorGamut | null>(null);

	onMount(() => {
		if (typeof window.matchMedia !== "function") return;
		const rec2020 = window.matchMedia("(color-gamut: rec2020)");
		const p3 = window.matchMedia("(color-gamut: p3)");
		const srgb = window.matchMedia("(color-gamut: srgb)");
		const read = () => setGamut(rec2020.matches ? "rec2020" : p3.matches ? "p3" : srgb.matches ? "srgb" : null);
		read();
		rec2020.addEventListener("change", read);
		p3.addEventListener("change", read);
		srgb.addEventListener("change", read);
		onCleanup(() => {
			rec2020.removeEventListener("change", read);
			p3.removeEventListener("change", read);
			srgb.removeEventListener("change", read);
		});
	});

	return gamut;
}
