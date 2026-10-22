/**
 * ColorWheel — hue ring selector: a conic-gradient wheel where the pointer angle
 * sets the hue (0–360°) of the current color.
 */
import { useComponentClasses } from "@wrikka/hooks";
import { type Accessor, createSignal, type JSX, splitProps } from "solid-js";
import { formatColor, parseColor } from "./ColorPicker";

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

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
	if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) * 60;
	else if (max === gn) h = ((bn - rn) / d + 2) * 60;
	else h = ((rn - gn) / d + 4) * 60;
	return { h, s, l };
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

const RAINBOW = "conic-gradient(from 0deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)";

export interface ColorWheelProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange"> {
	/** Controlled hex color — accepts a plain string or an accessor. Hue is rotated in place. */
	value?: string | Accessor<string>;
	/** Initial hex color when uncontrolled. @default "#ff0000" */
	defaultValue?: string;
	/** Called with the new hex color when the hue changes. */
	onChange?: (hex: string) => void;
	/** Wheel diameter in pixels. @default 160 */
	size?: number;
	/** Disable pointer and keyboard interaction. */
	disabled?: boolean;
}

export function ColorWheel(props: ColorWheelProps) {
	const { className } = useComponentClasses(
		{ class: props.class },
		{
			base: "relative rounded-full touch-none select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
		},
	);
	const [local, htmlRest] = splitProps(props, [
		"value",
		"defaultValue",
		"onChange",
		"size",
		"disabled",
		"class",
		"children",
	]);
	const [internal, setInternal] = createSignal(local.defaultValue ?? "#ff0000");
	const current = () => {
		const v = typeof local.value === "function" ? local.value() : local.value;
		return v ?? internal();
	};
	const parsed = () => parseColor(current()) ?? { r: 255, g: 0, b: 0, a: 1 };
	const hue = () => {
		const p = parsed();
		return Math.round(rgbToHsl(p.r, p.g, p.b).h);
	};
	const diameter = () => clamp(Math.round(props.size ?? 160), 40, 512);

	const emitHue = (h: number) => {
		const p = parsed();
		const { s, l } = rgbToHsl(p.r, p.g, p.b);
		const rgb = hslToRgb((((h % 360) + 360) % 360) / 360, s, l);
		const hex = formatColor({ ...rgb, a: p.a }, "hex", false);
		setInternal(hex);
		local.onChange?.(hex);
	};

	let wheelRef: HTMLDivElement | undefined;
	let dragging = false;

	const updateFromPointer = (e: PointerEvent) => {
		if (!wheelRef) return;
		const rect = wheelRef.getBoundingClientRect();
		if (!rect.width || !rect.height) return;
		const dx = e.clientX - (rect.left + rect.width / 2);
		const dy = e.clientY - (rect.top + rect.height / 2);
		const deg = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
		emitHue(Math.round(((deg % 360) + 360) % 360));
	};

	const onKeyDown = (e: KeyboardEvent) => {
		if (local.disabled) return;
		const step = e.shiftKey ? 15 : 2;
		if (e.key === "ArrowLeft") emitHue(hue() - step);
		else if (e.key === "ArrowRight") emitHue(hue() + step);
		else if (e.key === "ArrowDown") emitHue(hue() - step);
		else if (e.key === "ArrowUp") emitHue(hue() + step);
		else return;
		e.preventDefault();
	};

	// Handle sits on the ring at the current hue angle (0° = top, clockwise).
	const angle = () => (hue() * Math.PI) / 180 - Math.PI / 2;
	const radiusPct = 46;

	return (
		<div
			ref={(el) => (wheelRef = el)}
			role="slider"
			tabIndex={local.disabled ? -1 : 0}
			aria-label="Hue wheel"
			aria-valuemin={0}
			aria-valuemax={360}
			aria-valuenow={hue()}
			aria-valuetext={`${hue()} degrees`}
			aria-disabled={local.disabled || undefined}
			class={`${className()} ${local.disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
			style={{ width: `${diameter()}px`, height: `${diameter()}px`, background: RAINBOW }}
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
				class="absolute inset-[22%] rounded-full border border-border bg-surface"
				style={{ "background-color": current() }}
				aria-hidden="true"
			/>
			<div
				class="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow"
				style={{
					left: `${50 + radiusPct * Math.cos(angle())}%`,
					top: `${50 + radiusPct * Math.sin(angle())}%`,
					"background-color": current(),
				}}
				aria-hidden="true"
			/>
		</div>
	);
}
