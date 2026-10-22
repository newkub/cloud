/**
 * ColorSlider — single-channel color slider (hue, saturation, lightness, alpha or RGB)
 * with pointer drag and keyboard control.
 */
import { useComponentClasses } from "@wrikka/hooks";
import { type Accessor, createSignal, type JSX, splitProps } from "solid-js";

export type ColorSliderChannel = "hue" | "saturation" | "lightness" | "alpha" | "red" | "green" | "blue";

const channelMax: Record<ColorSliderChannel, number> = {
	hue: 360,
	saturation: 100,
	lightness: 100,
	alpha: 100,
	red: 255,
	green: 255,
	blue: 255,
};

const rainbow = "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)";
const checker =
	"repeating-linear-gradient(45deg, rgba(0,0,0,0.15) 0 6px, transparent 6px 12px), linear-gradient(to right, transparent, #808080)";

/** Default functional track background per channel (hue rainbow, alpha checker; others fall back to the `bg-muted` base class). */
export function defaultTrackStyle(channel: ColorSliderChannel): JSX.CSSProperties {
	if (channel === "hue") return { background: rainbow };
	if (channel === "alpha") return { background: checker };
	return {};
}

import type { SurfaceVariant } from "../lib/variants";
export interface ColorSliderProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange"> {
	/** Surface variant token. */
	variant?: SurfaceVariant;
	/** Size token. */
	size?: "sm" | "md" | "lg";
	/** Render without theme classes. */
	unstyled?: boolean;

	/** Channel being edited — determines the value range and default track. */
	channel: ColorSliderChannel;
	/** Controlled value — accepts a plain number or an accessor. */
	value?: number | Accessor<number>;
	/** Initial value @default 0 */
	defaultValue?: number;
	/** Called with the new value in channel units (hue 0–360, rgb 0–255, % 0–100). */
	onChange?: (value: number) => void;
	/** Override the track background/style. */
	trackStyle?: JSX.CSSProperties;
	/** Disable pointer and keyboard interaction. */
	disabled?: boolean;
}

const clamp = (n: number, max: number) => Math.min(max, Math.max(0, n));

export function ColorSlider(props: ColorSliderProps) {
	const { className } = useComponentClasses(props, {
		base: "relative h-8 w-full touch-none select-none border border-border bg-muted rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
	});
	const [local, htmlRest] = splitProps(props, [
		"channel",
		"value",
		"defaultValue",
		"onChange",
		"trackStyle",
		"disabled",
		"class",
		"variant",
		"size",
		"unstyled",
		"children",
	]);
	const max = () => channelMax[local.channel];
	const [internal, setInternal] = createSignal(local.defaultValue ?? 0);
	const value = () => {
		const v = typeof local.value === "function" ? local.value() : local.value;
		return clamp(v ?? internal(), max());
	};

	let trackRef: HTMLDivElement | undefined;
	let dragging = false;

	const emit = (n: number) => {
		const v = Math.round(clamp(n, max()));
		setInternal(v);
		local.onChange?.(v);
	};

	const updateFromPointer = (e: PointerEvent) => {
		if (!trackRef) return;
		const rect = trackRef.getBoundingClientRect();
		if (!rect.width) return;
		emit(((e.clientX - rect.left) / rect.width) * max());
	};

	const onKeyDown = (e: KeyboardEvent) => {
		if (local.disabled) return;
		const step = e.shiftKey ? 10 : 1;
		if (e.key === "ArrowLeft" || e.key === "ArrowDown") emit(value() - step);
		else if (e.key === "ArrowRight" || e.key === "ArrowUp") emit(value() + step);
		else if (e.key === "Home") emit(0);
		else if (e.key === "End") emit(max());
		else return;
		e.preventDefault();
	};

	return (
		<div
			ref={(el) => (trackRef = el)}
			role="slider"
			tabIndex={local.disabled ? -1 : 0}
			aria-label={local.channel}
			aria-valuemin={0}
			aria-valuemax={max()}
			aria-valuenow={value()}
			aria-disabled={local.disabled || undefined}
			class={`${className()} ${local.disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
			style={local.trackStyle ?? defaultTrackStyle(local.channel)}
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
				class="pointer-events-none absolute top-1/2 h-5 w-2 -translate-x-1/2 -translate-y-1/2 rounded border border-border bg-background shadow"
				style={{ left: `${(value() / max()) * 100}%` }}
				aria-hidden="true"
			/>
		</div>
	);
}
