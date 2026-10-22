import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";

export interface ImageLoadState {
	/** True once the image finished loading */
	loaded: Accessor<boolean>;
	/** Error message when the fetch/decode fails */
	error: Accessor<string | undefined>;
	/** Intrinsic pixel size of the loaded image */
	natural: Accessor<{ width: number; height: number } | undefined>;
}

/**
 * Preload an image reactively — re-fetches whenever `src()` changes and resets
 * state for the new source. Useful for showing placeholders before an `<img>`
 * has real pixels.
 *
 * @param src — Accessor for the image URL (empty string idles)
 * @returns `{ loaded, error, natural }`
 *
 * @example
 * const img = useImageLoad(() => user().avatarUrl);
 * <Show when={img.loaded()} fallback={<Skeleton />}>{img.natural()?.width}px</Show>
 */
export function useImageLoad(src: Accessor<string>): ImageLoadState {
	const [loaded, setLoaded] = createSignal(false);
	const [error, setError] = createSignal<string>();
	const [natural, setNatural] = createSignal<{ width: number; height: number }>();

	createEffect(() => {
		const url = src();
		setLoaded(false);
		setError(undefined);
		setNatural(undefined);
		if (!url || typeof Image === "undefined") return;
		const img = new Image();
		img.onload = () => {
			setNatural({ width: img.naturalWidth, height: img.naturalHeight });
			setLoaded(true);
		};
		img.onerror = () => setError("image failed to load");
		img.src = url;
		onCleanup(() => {
			img.onload = null;
			img.onerror = null;
			img.src = "";
		});
	});

	return { loaded, error, natural };
}
