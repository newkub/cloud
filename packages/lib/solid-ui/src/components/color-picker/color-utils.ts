/**
 * Color conversion helpers shared by ColorPicker and ColorInput —
 * parse hex/rgb/hsl strings into RGBA and serialize back per format.
 */

export type ColorFormat = "hex" | "rgb" | "hsl";

export interface RGBA {
	r: number;
	g: number;
	b: number;
	/** 0–1 */
	a: number;
}

const clamp255 = (n: number) => Math.min(255, Math.max(0, Math.round(n)));
const clampA = (n: number) => Math.min(1, Math.max(0, n));

/** Parse hex (#rgb/#rgba/#rrggbb/#rrggbbaa), rgb()/rgba() or hsl()/hsla() into RGBA. */
export function parseColor(input: string): RGBA | null {
	const v = input.trim().toLowerCase();
	const hex = /^#([0-9a-f]{3,8})$/.exec(v)?.[1];
	if (hex) {
		if (hex.length === 3 || hex.length === 4) {
			return {
				r: Number.parseInt(hex[0] + hex[0], 16),
				g: Number.parseInt(hex[1] + hex[1], 16),
				b: Number.parseInt(hex[2] + hex[2], 16),
				a: hex.length === 4 ? Number.parseInt(hex[3] + hex[3], 16) / 255 : 1,
			};
		}
		if (hex.length === 6 || hex.length === 8) {
			return {
				r: Number.parseInt(hex.slice(0, 2), 16),
				g: Number.parseInt(hex.slice(2, 4), 16),
				b: Number.parseInt(hex.slice(4, 6), 16),
				a: hex.length === 8 ? Number.parseInt(hex.slice(6, 8), 16) / 255 : 1,
			};
		}
		return null;
	}
	const rgb = /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*([\d.]+)\s*)?\)$/.exec(v);
	if (rgb) {
		return {
			r: clamp255(Number(rgb[1])),
			g: clamp255(Number(rgb[2])),
			b: clamp255(Number(rgb[3])),
			a: clampA(Number(rgb[4] ?? 1)),
		};
	}
	const hsl = /^hsla?\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*(?:,\s*([\d.]+)\s*)?\)$/.exec(v);
	if (hsl) {
		return { ...hslToRgb(Number(hsl[1]), Number(hsl[2]), Number(hsl[3])), a: clampA(Number(hsl[4] ?? 1)) };
	}
	return null;
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
	const sn = s / 100;
	const ln = l / 100;
	const k = (n: number) => (n + h / 30) % 12;
	const a = sn * Math.min(ln, 1 - ln);
	const f = (n: number) => ln - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
	return { r: clamp255(f(0) * 255), g: clamp255(f(8) * 255), b: clamp255(f(4) * 255) };
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
	const rn = r / 255;
	const gn = g / 255;
	const bn = b / 255;
	const max = Math.max(rn, gn, bn);
	const min = Math.min(rn, gn, bn);
	const l = (max + min) / 2;
	if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) };
	const d = max - min;
	const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
	let h = 0;
	if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) * 60;
	else if (max === gn) h = ((bn - rn) / d + 2) * 60;
	else h = ((rn - gn) / d + 4) * 60;
	return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

const hex2 = (n: number) => clamp255(n).toString(16).padStart(2, "0");
const alphaHex = (a: number) =>
	Math.round(clampA(a) * 255)
		.toString(16)
		.padStart(2, "0");
const alphaStr = (a: number) => String(Math.round(clampA(a) * 100) / 100);

/** Serialize an RGBA in the requested format — alpha channel included only when `withAlpha`. */
export function formatColor(c: RGBA, format: ColorFormat, withAlpha: boolean): string {
	if (format === "rgb") {
		return withAlpha ? `rgba(${c.r}, ${c.g}, ${c.b}, ${alphaStr(c.a)})` : `rgb(${c.r}, ${c.g}, ${c.b})`;
	}
	if (format === "hsl") {
		const { h, s, l } = rgbToHsl(c.r, c.g, c.b);
		return withAlpha ? `hsla(${h}, ${s}%, ${l}%, ${alphaStr(c.a)})` : `hsl(${h}, ${s}%, ${l}%)`;
	}
	return `#${hex2(c.r)}${hex2(c.g)}${hex2(c.b)}${withAlpha ? alphaHex(c.a) : ""}`;
}
