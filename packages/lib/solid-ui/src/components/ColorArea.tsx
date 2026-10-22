/**
 * ColorArea — 2D saturation×lightness (or saturation×value) pad driven by a hex color.
 */
import { useComponentClasses } from "@wrikka/hooks";
import { type Accessor, createSignal, type JSX, splitProps } from "solid-js";
import { type Radius, radiusMap, type SurfaceVariant } from "../lib/variants";
import { formatColor, parseColor } from "./ColorPicker";

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

function rgbToHsl(r: number, g: number, b: number) {
	const rn = r / 255;
	const gn = g / 255;
	const bn = b / 255;
	const max = Math.max(rn, gn, bn);
	const min = Math.min(rn, gn, bn);
	const l = (max + min) / 2;
	if (max === min) return { h: 0, s: 0, l };
	const d = max - min;
	const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
	let h = 0;
	if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
	else if (max === gn) h = ((bn - rn) / d + 2) / 6;
	else h = ((rn - gn) / d + 4) / 6;
	return { h, s, l };
}

function rgbToHsv(r: number, g: number, b: number) {
	const rn = r / 255;
	const gn = g / 255;
	const bn = b / 255;
	const max = Math.max(rn, gn, bn);
	const min = Math.min(rn, gn, bn);
	const d = max - min;
	let h = 0;
	if (d !== 0) {
		if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
		else if (max === gn) h = ((bn - rn) / d + 2) / 6;
		else h = ((rn - gn) / d + 4) / 6;
	}
	return { h, s: max === 0 ? 0 : d / max, v: max };
}

function hueToRgb(p: number, q: number, tIn: number) {
	let t = tIn;
	if (t < 0) t += 1;
	if (t > 1) t -= 1;
	if (t < 1 / 6) return p + (q - p) * 6 * t;
	if (t < 1 / 2) return q;
	if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
	return p;
}

function hslToRgb(h: number, s: number, l: number) {
	if (s === 0) {
		const v = Math.round(l * 255);
		return { r: v, g: v, b: v };
	}
	const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
	const p = 2 * l - q;
	return {
		r: Math.round(hueToRgb(p, q, h + 1 / 3) * 255),
		g: Math.round(hueToRgb(p, q, h) * 255),
		b: Math.round(hueToRgb(p, q, h - 1 / 3) * 255),
	};
}

function hsvToRgb(h: number, s: number, v: number) {
	const f = (n: number) => {
		const k = (n + h * 6) % 6;
		return v - v * s * Math.max(0, Math.min(k, 4 - k, 1));
	};
	return { r: Math.round(f(5) * 255), g: Math.round(f(3) * 255), b: Math.round(f(1) * 255) };
}

export interface ColorAreaProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange"> {
	/** Surface variant token. */
	variant?: SurfaceVariant;
	/** Size token. */
	size?: "sm" | "md" | "lg";
	/** Render without theme classes. */
	unstyled?: boolean;

	/** Controlled hex color — accepts a plain string or an accessor. */
	value?: string | Accessor<string>;
	/** Initial hex color @default "#3b82f6" */
	defaultValue?: string;
	/** Called with the new hex color while dragging or moving the handle. */
	onChange?: (hex: string) => void;
	/** Vertical axis mode: lightness (HSL) or value (HSV). @default "hsl" */
	channel?: "hsl" | "hsv";
	/** Disable pointer and keyboard interaction. */
	disabled?: boolean;
	/** Accessible label. @default "Color area" */
	label?: string;
	/** Corner radius. @default "md" */
	radius?: Radius;
}

export function ColorArea(props: ColorAreaProps) {
	const { className } = useComponentClasses(props, {
		base: "relative touch-none overflow-hidden border border-border select-none motion-safe:transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
		axes: [{ prop: "radius", map: radiusMap, default: "md" }],
	});
	const [local, htmlRest] = splitProps(props, [
		"value",
		"defaultValue",
		"onChange",
		"channel",
		"disabled",
		"label",
		"radius",
		"class",
		"variant",
		"size",
		"unstyled",
		"children",
	]);
	const [internal, setInternal] = createSignal(local.defaultValue ?? "#3b82f6");
	const current = () => {
		const v = typeof local.value === "function" ? local.value() : local.value;
		return v ?? internal();
	};
	const parsed = () => parseColor(current()) ?? { r: 59, g: 130, b: 246, a: 1 };
	const hueDeg = () => {
		const p = parsed();
		return Math.round((local.channel === "hsv" ? rgbToHsv(p.r, p.g, p.b).h : rgbToHsl(p.r, p.g, p.b).h) * 360);
	};

	let padRef: HTMLDivElement | undefined;
	let dragging = false;

	const pos = () => {
		const p = parsed();
		if (local.channel === "hsv") {
			const hsv = rgbToHsv(p.r, p.g, p.b);
			return { x: hsv.s, y: 1 - hsv.v };
		}
		const hsl = rgbToHsl(p.r, p.g, p.b);
		return { x: hsl.s, y: 1 - hsl.l };
	};

	const emitAt = (x: number, y: number) => {
		const sx = clamp01(x);
		const sy = clamp01(y);
		const h = hueDeg() / 360;
		const rgb = local.channel === "hsv" ? hsvToRgb(h, sx, 1 - sy) : hslToRgb(h, sx, 1 - sy);
		const hex = formatColor({ ...rgb, a: parsed().a }, "hex", false);
		setInternal(hex);
		local.onChange?.(hex);
	};

	const updateFromPointer = (e: PointerEvent) => {
		if (!padRef) return;
		const rect = padRef.getBoundingClientRect();
		if (!rect.width || !rect.height) return;
		emitAt((e.clientX - rect.left) / rect.width, (e.clientY - rect.top) / rect.height);
	};

	const onKeyDown = (e: KeyboardEvent) => {
		if (local.disabled) return;
		const step = e.shiftKey ? 0.1 : 0.01;
		const { x, y } = pos();
		if (e.key === "ArrowLeft") emitAt(x - step, y);
		else if (e.key === "ArrowRight") emitAt(x + step, y);
		else if (e.key === "ArrowUp") emitAt(x, y - step);
		else if (e.key === "ArrowDown") emitAt(x, y + step);
		else return;
		e.preventDefault();
	};

	return (
		<div
			ref={(el) => (padRef = el)}
			role="application"
			tabIndex={local.disabled ? -1 : 0}
			aria-label={local.label ?? "Color area"}
			aria-disabled={local.disabled || undefined}
			class={`${className()} h-40 w-full min-h-32 ${local.disabled ? "cursor-not-allowed opacity-50" : "cursor-crosshair"}`}
			style={{
				background: `linear-gradient(to top, #000, rgba(0,0,0,0)), linear-gradient(to right, #fff, hsl(${hueDeg()}, 100%, 50%))`,
			}}
			onKeyDown={onKeyDown}
			onPointerDown={(e) => {
				if (local.disabled) return;
				dragging = true;
				e.currentTarget.focus();
				try {
					e.currentTarget.setPointerCapture?.(e.pointerId);
				} catch {
					/* pointer capture unsupported */
				}
				updateFromPointer(e);
			}}
			onPointerMove={(e) => dragging && updateFromPointer(e)}
			onPointerUp={(e) => {
				dragging = false;
				try {
					e.currentTarget.releasePointerCapture?.(e.pointerId);
				} catch {
					/* no capture to release */
				}
			}}
			{...htmlRest}
		>
			<div
				class="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
				style={{ left: `${pos().x * 100}%`, top: `${pos().y * 100}%` }}
				aria-hidden="true"
			>
				<div class="h-4 w-4 rounded-full border-2 border-white shadow" style={{ "background-color": current() }} />
			</div>
		</div>
	);
}
