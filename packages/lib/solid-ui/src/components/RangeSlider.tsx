/**
 * RangeSlider — dual-handle range input for [min, max] value pairs.
 */
import { createSignal, For, type JSX, Show, splitProps } from "solid-js";
import { type ControlSize, type Radius, radiusMap } from "../lib/variants";
import type { SliderMark } from "./Slider";

const variantMap: Record<string, string> = {
	default: "accent-primary",
	primary: "accent-primary",
	success: "accent-success",
	warning: "accent-warning",
	destructive: "accent-destructive",
	info: "accent-info",
};

const trackSizeMap: Record<ControlSize, string> = {
	sm: "h-1",
	md: "h-1.5",
	lg: "h-2",
};

export type RangeSliderValue = [min: number, max: number];

export interface RangeSliderProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange"> {
	min?: number;
	max?: number;
	step?: number;
	/** Controlled [min, max] pair. */
	value?: RangeSliderValue;
	/** Initial [min, max] pair for uncontrolled usage. */
	defaultValue?: RangeSliderValue;
	onChange?: (value: RangeSliderValue) => void;
	/** Minimum gap enforced between the two handles. @default 0 */
	minGap?: number;
	disabled?: boolean;
	variant?: "default" | "primary" | "success" | "warning" | "destructive" | "info";
	/** Accent color — alias for `variant`, takes precedence when both are set. */
	color?: keyof typeof variantMap;
	/** Track height. @default "md" */
	size?: ControlSize;
	/** Show current min/max values below the track. */
	showValues?: boolean;
	/** Custom value formatter for showValues labels and aria-valuetext. */
	formatValue?: (value: number) => string;
	/** Custom screen-reader text for each handle's current value. */
	getAriaValueText?: (value: number, handle: "min" | "max") => string;
	/** aria-label for the lower handle. @default "Minimum value" */
	minLabel?: string;
	/** aria-label for the upper handle. @default "Maximum value" */
	maxLabel?: string;
	/** Labelled points rendered under the track. */
	marks?: SliderMark[];
	/** Corner radius. */
	radius?: Radius;
}

export function RangeSlider(props: RangeSliderProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"min",
		"max",
		"step",
		"value",
		"defaultValue",
		"onChange",
		"minGap",
		"disabled",
		"variant",
		"color",
		"size",
		"showValues",
		"formatValue",
		"getAriaValueText",
		"minLabel",
		"maxLabel",
		"marks",
		"radius",
	]);
	const [internal, setInternal] = createSignal<RangeSliderValue | undefined>(local.defaultValue);

	const min = () => local.min ?? 0;
	const max = () => local.max ?? 100;
	const step = () => local.step ?? 1;
	const gap = () => local.minGap ?? 0;
	const current = () => local.value ?? internal() ?? ([min(), max()] as RangeSliderValue);
	const lo = () => current()[0];
	const hi = () => current()[1];
	const fmt = (v: number) => local.formatValue?.(v) ?? String(v);
	const pct = (v: number) => ((v - min()) / (max() - min() || 1)) * 100;

	const commit = (next: RangeSliderValue) => {
		if (local.value === undefined) setInternal(next);
		local.onChange?.(next);
	};

	const setLo = (e: InputEvent & { currentTarget: HTMLInputElement }) => {
		const v = Math.min(Number.parseFloat(e.currentTarget.value), hi() - gap());
		commit([Number.isNaN(v) ? min() : v, hi()]);
	};
	const setHi = (e: InputEvent & { currentTarget: HTMLInputElement }) => {
		const v = Math.max(Number.parseFloat(e.currentTarget.value), lo() + gap());
		commit([lo(), Number.isNaN(v) ? max() : v]);
	};

	const inputCls = () =>
		[
			"w-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
			variantMap[local.color ?? local.variant ?? "default"],
			trackSizeMap[local.size ?? "md"],
		].join(" ");

	return (
		<div
			class={`solidui-range-slider ${local.showValues || local.marks?.length ? "space-y-2" : ""} ${local.radius ? radiusMap[local.radius] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<div class="grid">
				<input
					type="range"
					class={`${inputCls()} col-start-1 row-start-1`}
					min={min()}
					max={max()}
					step={step()}
					value={lo()}
					disabled={local.disabled}
					aria-label={local.minLabel ?? "Minimum value"}
					aria-valuetext={local.getAriaValueText?.(lo(), "min") ?? fmt(lo())}
					onInput={setLo}
				/>
				<input
					type="range"
					class={`${inputCls()} col-start-1 row-start-1 bg-transparent`}
					min={min()}
					max={max()}
					step={step()}
					value={hi()}
					disabled={local.disabled}
					aria-label={local.maxLabel ?? "Maximum value"}
					aria-valuetext={local.getAriaValueText?.(hi(), "max") ?? fmt(hi())}
					onInput={setHi}
				/>
			</div>
			<Show when={local.showValues}>
				<div class="flex justify-between text-xs tabular-nums text-muted-foreground">
					<span>{fmt(lo())}</span>
					<span>{fmt(hi())}</span>
				</div>
			</Show>
			<Show when={local.marks?.length}>
				<div class="relative h-4">
					<For each={local.marks}>
						{(mark) => (
							<span
								class="absolute -translate-x-1/2 whitespace-nowrap text-2xs text-muted-foreground"
								style={{ left: `${pct(mark.value)}%` }}
							>
								{mark.label ?? mark.value}
							</span>
						)}
					</For>
				</div>
			</Show>
		</div>
	);
}
