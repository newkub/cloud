/**
 * ColorChannelField — labelled numeric stepper input bound to one color channel.
 */
import { useComponentClasses } from "@wrikka/hooks";
import { type Accessor, createEffect, createSignal, type JSX, splitProps } from "solid-js";

export type ColorChannel = "red" | "green" | "blue" | "alpha" | "hue" | "saturation" | "lightness";

const channelMax: Record<ColorChannel, number> = {
	red: 255,
	green: 255,
	blue: 255,
	alpha: 100,
	hue: 360,
	saturation: 100,
	lightness: 100,
};

const channelSuffix: Record<ColorChannel, string> = {
	red: "",
	green: "",
	blue: "",
	alpha: "%",
	hue: "°",
	saturation: "%",
	lightness: "%",
};

import type { SurfaceVariant } from "../lib/variants";
export interface ColorChannelFieldProps extends Omit<JSX.LabelHTMLAttributes<HTMLLabelElement>, "onChange" | "value"> {
	/** Surface variant token. */
	variant?: SurfaceVariant;
	/** Size token. */
	size?: "sm" | "md" | "lg";
	/** Render without theme classes. */
	unstyled?: boolean;

	/** Channel edited — sets the label default and the clamp range (rgb 0–255, hue 0–360, % 0–100). */
	channel: ColorChannel;
	/** Visible prefix label @defaults to the channel name. */
	label?: string;
	/** Controlled value — accepts a plain number or an accessor. */
	value?: number | Accessor<number>;
	/** Initial value @default 0 */
	defaultValue?: number;
	/** Called with the clamped channel value. */
	onChange?: (value: number) => void;
	/** Disable editing. */
	disabled?: boolean;
}

const clamp = (n: number, max: number) => Math.min(max, Math.max(0, n));

export function ColorChannelField(props: ColorChannelFieldProps) {
	const { className } = useComponentClasses(props, {
		base: "inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-2 shadow-sm focus-within:ring-2 focus-within:ring-ring",
	});
	const [local, htmlRest] = splitProps(props, [
		"channel",
		"label",
		"value",
		"defaultValue",
		"onChange",
		"disabled",
		"class",
		"variant",
		"size",
		"unstyled",
		"children",
	]);
	const max = () => channelMax[local.channel];
	const [internal, setInternal] = createSignal(local.defaultValue ?? 0);
	const controlled = () => (typeof local.value === "function" ? local.value() : local.value);
	const value = () => clamp(controlled() ?? internal(), max());
	const [text, setText] = createSignal(String(value()));

	createEffect(() => {
		const v = controlled();
		setText(String(v !== undefined ? clamp(v, max()) : internal()));
	});

	const emit = (n: number) => {
		const v = Math.round(clamp(n, max()));
		setInternal(v);
		setText(String(v));
		local.onChange?.(v);
	};

	const commit = (raw: string) => {
		const n = Number.parseInt(raw, 10);
		if (Number.isNaN(n)) {
			setText(String(value()));
			return;
		}
		emit(n);
	};

	const step = (dir: number, big: boolean) => emit(value() + dir * (big ? 10 : 1));
	const label = () => local.label ?? local.channel;

	return (
		<label class={className()} {...htmlRest}>
			<span class="text-xs font-medium text-muted-foreground select-none">{label()}</span>
			<input
				type="text"
				inputmode="numeric"
				role="spinbutton"
				aria-label={label()}
				aria-valuemin={0}
				aria-valuemax={max()}
				aria-valuenow={value()}
				value={text()}
				disabled={local.disabled}
				class="w-12 bg-transparent py-1 font-mono text-sm text-foreground tabular-nums outline-none disabled:opacity-50"
				onInput={(e) => setText(e.currentTarget.value)}
				onBlur={(e) => commit(e.currentTarget.value)}
				onKeyDown={(e) => {
					if (e.key === "ArrowUp") {
						e.preventDefault();
						step(1, e.shiftKey);
					} else if (e.key === "ArrowDown") {
						e.preventDefault();
						step(-1, e.shiftKey);
					} else if (e.key === "Enter") {
						commit(e.currentTarget.value);
					}
				}}
			/>
			<span class="text-xs text-muted-foreground select-none">{channelSuffix[local.channel]}</span>
		</label>
	);
}
