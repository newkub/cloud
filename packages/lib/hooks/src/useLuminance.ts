import { type Accessor, createMemo } from "solid-js";
import type { MaybeAccessor } from "./useEventListener";

const read = <T>(v: MaybeAccessor<T>): T => (typeof v === "function" ? (v as Accessor<T>)() : v);

export interface LuminanceState {
	/**
	 * WCAG relative luminance `0` (black) – `1` (white); `NaN` when the
	 * colour cannot be resolved (unsupported format, unstyled element, SSR).
	 */
	luminance: Accessor<number>;
	/** True while `luminance()` exceeds `threshold` */
	isLight: Accessor<boolean>;
}

export interface LuminanceOptions {
	/** Element property to sample. @default "backgroundColor" */
	property?: "color" | "backgroundColor";
	/** `isLight` cut-off on the `0–1` luminance scale. @default 0.5 */
	threshold?: number;
}

/** `#rgb`/`#rrggbb`/`rgb()`/`rgba()` → `[r,g,b]` in `0–255`, else `null`. */
const parseColor = (input: string): [number, number, number] | null => {
	const s = input.trim().toLowerCase();
	const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/.exec(s);
	if (hex) {
		const h = hex[1] ?? "";
		const full =
			h.length === 3
				? h
						.split("")
						.map((c) => c + c)
						.join("")
				: h;
		return [
			Number.parseInt(full.slice(0, 2), 16),
			Number.parseInt(full.slice(2, 4), 16),
			Number.parseInt(full.slice(4, 6), 16),
		];
	}
	const rgb = /^rgba?\(\s*([\d.]+)(?:%?)[\s,]+([\d.]+)(?:%?)[\s,]+([\d.]+)/.exec(s);
	if (rgb) {
		const pct = s.includes("%");
		const scale = pct ? 2.55 : 1;
		return [Number(rgb[1]) * scale, Number(rgb[2]) * scale, Number(rgb[3]) * scale];
	}
	return null;
};

/** WCAG relative luminance of an sRGB triple in `0–255`. */
const luminanceOf = ([r, g, b]: [number, number, number]): number => {
	const f = (c: number) => {
		const s = c / 255;
		return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
	};
	return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};

const resolveColor = (source: string | HTMLElement | undefined, property: "color" | "backgroundColor") => {
	if (typeof source === "string") return source;
	if (!source || typeof window === "undefined" || typeof window.getComputedStyle !== "function") return "";
	return window.getComputedStyle(source)[property];
};

/**
 * Relative luminance of a colour string (`#fff`, `rgb(…)`) or an element's
 * computed `backgroundColor`/`color` — `isLight()` flips at `threshold`
 * (default `0.5`), handy for picking light/dark foregrounds reactively.
 *
 * @param source — Colour string or element (accessor accepted)
 * @param options — `property` to sample on elements, `threshold`
 * @returns `{ luminance, isLight }`
 *
 * @example
 * const { isLight } = useLuminance(() => theme().accent);
 * <button class={isLight() ? "text-dark" : "text-light"} />
 */
export function useLuminance(
	source: MaybeAccessor<string | HTMLElement | undefined>,
	options?: LuminanceOptions,
): LuminanceState {
	const luminance = createMemo(() => {
		const raw = resolveColor(read(source), options?.property ?? "backgroundColor");
		const rgb = raw ? parseColor(raw) : null;
		return rgb ? luminanceOf(rgb) : Number.NaN;
	});
	return { luminance, isLight: () => luminance() > (options?.threshold ?? 0.5) };
}
