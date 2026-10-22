/**
 * ColorHarmonyPicker - base color swatch with computed harmony swatches (HSL math).
 */
import { useComponentClasses } from "@wrikka/hooks";
import { For, type JSX, Show, splitProps } from "solid-js";

export interface HarmonySwatch {
	/** Harmony name, e.g. "complementary". */
	name: string;
	/** Hex color, e.g. "#a1b2c3". */
	hex: string;
	/** Whether this is the base color. */
	base?: boolean;
}

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/** Parse "#rgb"/"#rrggbb" (case-insensitive) into [r,g,b] 0-255 — null when invalid. */
export function hexToRgb(hex: string): [number, number, number] | null {
	const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
	if (!m) return null;
	let h = m[1];
	if (h.length === 3)
		h = h
			.split("")
			.map((c) => c + c)
			.join("");
	return [Number.parseInt(h.slice(0, 2), 16), Number.parseInt(h.slice(2, 4), 16), Number.parseInt(h.slice(4, 6), 16)];
}

export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
	const rn = r / 255;
	const gn = g / 255;
	const bn = b / 255;
	const max = Math.max(rn, gn, bn);
	const min = Math.min(rn, gn, bn);
	const l = (max + min) / 2;
	if (max === min) return [0, 0, l];
	const d = max - min;
	const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
	let h = 0;
	if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) * 60;
	else if (max === gn) h = ((bn - rn) / d + 2) * 60;
	else h = ((rn - gn) / d + 4) * 60;
	return [h, s, l];
}

export function hslToRgb(h: number, s: number, l: number): [number, number, number] {
	const hn = ((h % 360) + 360) % 360;
	const c = (1 - Math.abs(2 * l - 1)) * s;
	const x = c * (1 - Math.abs(((hn / 60) % 2) - 1));
	const m = l - c / 2;
	let rgb: [number, number, number] = [0, 0, 0];
	if (hn < 60) rgb = [c, x, 0];
	else if (hn < 120) rgb = [x, c, 0];
	else if (hn < 180) rgb = [0, c, x];
	else if (hn < 240) rgb = [0, x, c];
	else if (hn < 300) rgb = [x, 0, c];
	else rgb = [c, 0, x];
	return rgb.map((v) => Math.round(clamp(v + m, 0, 1) * 255)) as [number, number, number];
}

export function rgbToHex(r: number, g: number, b: number): string {
	return `#${[r, g, b].map((v) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, "0")).join("")}`;
}

const rotate = (hex: string, deg: number): string | null => {
	const rgb = hexToRgb(hex);
	if (!rgb) return null;
	const [h, s, l] = rgbToHsl(...rgb);
	return rgbToHex(...hslToRgb(h + deg, s, l));
};

/** Compute base + complementary + analogous (±30°) + triadic (±120°) swatches. */
export function harmonySwatches(base: string): HarmonySwatch[] {
	const rgb = hexToRgb(base);
	if (!rgb) return [];
	const norm = rgbToHex(...rgb);
	return [
		{ name: "base", hex: norm, base: true },
		{ name: "complementary", hex: rotate(norm, 180) ?? norm },
		{ name: "analogous −30°", hex: rotate(norm, -30) ?? norm },
		{ name: "analogous +30°", hex: rotate(norm, 30) ?? norm },
		{ name: "triadic −120°", hex: rotate(norm, -120) ?? norm },
		{ name: "triadic +120°", hex: rotate(norm, 120) ?? norm },
	];
}

export interface ColorHarmonyPickerProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange"> {
	/** Base hex color, e.g. "#3366ff". */
	base?: string;
	/** Called with the clicked swatch hex. */
	onChange?: (hex: string, swatch: HarmonySwatch) => void;
	/** Currently selected hex — falls back to `base`. */
	value?: string;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

export function ColorHarmonyPicker(props: ColorHarmonyPickerProps) {
	const [local, others] = splitProps(props, ["base", "onChange", "value"]);
	const { className, rest } = useComponentClasses(others, { base: "solidui-color-harmony-picker" });
	const swatches = () => harmonySwatches(local.base ?? "");
	const selected = () => (local.value ?? local.base ?? "").toLowerCase();

	return (
		<div class={className()} {...rest}>
			<Show
				when={swatches().length > 0}
				fallback={<p class="text-xs text-muted-foreground">Enter a valid hex color</p>}
			>
				{/* biome-ignore lint/a11y/useSemanticElements: labelled swatch group, not a form fieldset */}
				<div class="flex flex-wrap items-end gap-2" role="group" aria-label="Color harmonies">
					<For each={swatches()}>
						{(s) => (
							<button
								type="button"
								class={`group flex flex-col items-center gap-1 focus-visible:outline-none ${
									s.base ? "" : "cursor-pointer"
								}`}
								aria-label={`${s.name} ${s.hex}`}
								aria-pressed={s.hex === selected() || undefined}
								onClick={() => local.onChange?.(s.hex, s)}
							>
								<span
									class={`h-10 w-10 rounded-md border shadow-sm transition-transform motion-reduce:transition-none group-hover:scale-105 group-focus-visible:ring-2 group-focus-visible:ring-ring ${
										s.hex === selected() ? "border-ring ring-2 ring-ring" : "border-border"
									}`}
									style={{ "background-color": s.hex }}
									data-hex={s.hex}
								/>
								<span class="font-mono text-2xs text-muted-foreground">{s.hex}</span>
								<span class="text-2xs text-muted-foreground">{s.name}</span>
							</button>
						)}
					</For>
				</div>
			</Show>
		</div>
	);
}
