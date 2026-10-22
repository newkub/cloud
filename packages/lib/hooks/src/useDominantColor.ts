import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";
import type { MaybeAccessor } from "./useEventListener";

export type RGB = readonly [number, number, number];

export type DominantColorSource = string | HTMLImageElement | HTMLCanvasElement;

export interface DominantColorOptions {
	/** Edge the image is downscaled to before sampling (`N`×`N` pixels). @default 16 */
	sampleSize?: number;
	/** `crossOrigin` attribute applied to URL sources — required for images served with CORS. @default "anonymous" */
	crossOrigin?: string;
	/** Quantization width per channel (0-255). Lower values group more shades together. @default 32 */
	bucketSize?: number;
}

export interface DominantColorState {
	/** Most frequent quantized `[r, g, b]` triple — `null` until sampled or on failure */
	color: Accessor<RGB | null>;
	/** True while an image is loading / being analyzed */
	loading: Accessor<boolean>;
	/** Last load or analysis failure — `null` while healthy */
	error: Accessor<Error | null>;
}

const resolve = <T>(v: MaybeAccessor<T>): T => (typeof v === "function" ? (v as Accessor<T>)() : v);

const asError = (e: unknown): Error => (e instanceof Error ? e : new Error(String(e)));

/**
 * Dominant color of an image — draws the source onto a tiny offscreen canvas,
 * quantizes each opaque pixel into RGB buckets and returns the most frequent
 * triple. Accepts a URL string, an `HTMLImageElement`, or an
 * `HTMLCanvasElement` (all maybe-accessors) and re-extracts when the source
 * changes. jsdom/SSR-safe: `color()` stays `null` and `error()` reports why
 * when `Image` or a 2D canvas context is unavailable.
 *
 * @param source — Image URL, `<img>`, or `<canvas>` (value or accessor)
 * @param options — See {@link DominantColorOptions}
 * @returns `{ color, loading, error }` accessors
 *
 * @example
 * const dom = useDominantColor(() => album().coverUrl);
 * <div style={{ "background-color": dom.color()?.join(",") ? `rgb(${dom.color()!.join(",")})` : "#333" }} />
 */
export function useDominantColor(
	source: MaybeAccessor<DominantColorSource | undefined>,
	options?: DominantColorOptions,
): DominantColorState {
	const [color, setColor] = createSignal<RGB | null>(null);
	const [loading, setLoading] = createSignal(false);
	const [error, setError] = createSignal<Error | null>(null);

	const sample = (src: CanvasImageSource): RGB | null => {
		if (typeof document === "undefined") return null;
		const size = Math.max(1, options?.sampleSize ?? 16);
		const canvas = document.createElement("canvas");
		canvas.width = size;
		canvas.height = size;
		const ctx = canvas.getContext("2d", { willReadFrequently: true });
		if (!ctx) throw new Error("2d canvas context unavailable");
		ctx.drawImage(src, 0, 0, size, size);
		const { data } = ctx.getImageData(0, 0, size, size);
		const bucket = Math.max(1, options?.bucketSize ?? 32);
		const counts = new Map<number, { count: number; rgb: RGB }>();
		for (let i = 0; i < data.length; i += 4) {
			if ((data[i + 3] ?? 0) < 128) continue;
			const r = Math.min(255, Math.floor((data[i] ?? 0) / bucket) * bucket);
			const g = Math.min(255, Math.floor((data[i + 1] ?? 0) / bucket) * bucket);
			const b = Math.min(255, Math.floor((data[i + 2] ?? 0) / bucket) * bucket);
			const key = (r << 16) | (g << 8) | b;
			const entry = counts.get(key);
			if (entry) entry.count += 1;
			else counts.set(key, { count: 1, rgb: [r, g, b] });
		}
		let best: { count: number; rgb: RGB } | undefined;
		for (const entry of counts.values()) if (!best || entry.count > best.count) best = entry;
		return best?.rgb ?? null;
	};

	const analyze = (src: CanvasImageSource) => {
		try {
			setColor(sample(src));
			setError(null);
		} catch (e) {
			setColor(null);
			setError(asError(e));
		} finally {
			setLoading(false);
		}
	};

	createEffect(() => {
		const src = resolve(source);
		setColor(null);
		setError(null);
		if (!src) {
			setLoading(false);
			return;
		}

		if (typeof src === "string") {
			if (typeof Image === "undefined") {
				setLoading(false);
				setError(new Error("Image constructor unavailable"));
				return;
			}
			setLoading(true);
			const img = new Image();
			img.crossOrigin = options?.crossOrigin ?? "anonymous";
			const onLoad = () => analyze(img);
			const onError = () => {
				setLoading(false);
				setColor(null);
				setError(new Error(`Failed to load image: ${src}`));
			};
			img.addEventListener("load", onLoad);
			img.addEventListener("error", onError);
			img.src = src;
			onCleanup(() => {
				img.removeEventListener("load", onLoad);
				img.removeEventListener("error", onError);
				img.src = "";
			});
			return;
		}

		if (typeof HTMLCanvasElement !== "undefined" && src instanceof HTMLCanvasElement) {
			setLoading(true);
			analyze(src);
			return;
		}

		if (typeof HTMLImageElement === "undefined" || !(src instanceof HTMLImageElement)) {
			setLoading(false);
			return;
		}

		if (src.complete && src.naturalWidth > 0) {
			setLoading(true);
			analyze(src);
			return;
		}

		setLoading(true);
		const onLoad = () => analyze(src);
		const onError = () => {
			setLoading(false);
			setColor(null);
			setError(new Error("Failed to load image element"));
		};
		src.addEventListener("load", onLoad);
		src.addEventListener("error", onError);
		onCleanup(() => {
			src.removeEventListener("load", onLoad);
			src.removeEventListener("error", onError);
		});
	});

	return { color, loading, error };
}
