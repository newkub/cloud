/**
 * Slider — single-value range input with marks, value display and size/color variants.
 */
import { createSignal, For, type JSX, Show, splitProps } from "solid-js";
import { type ControlSize, type Radius, radiusMap } from "../lib/variants";

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

/** A labelled point rendered under the slider track. */
export interface SliderMark {
	value: number;
	label?: JSX.Element;
}

let sliderId = 0;

export interface SliderProps
	extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange" | "value" | "onInput"> {
	min?: number;
	max?: number;
	step?: number;
	/** Controlled value. */
	value?: number;
	/** Initial value for uncontrolled usage. */
	defaultValue?: number;
	onChange?: (value: number) => void;
	onInput?: JSX.InputHTMLAttributes<HTMLInputElement>["onInput"];
	variant?: "default" | "primary" | "success" | "warning" | "destructive" | "info";
	/** Accent color — alias for `variant`, takes precedence when both are set. */
	color?: keyof typeof variantMap;
	/** Track height. @default "md" */
	size?: ControlSize;
	/** Label rendered above the slider. */
	label?: JSX.Element;
	/** Show the current value next to the label / above the track. @default false */
	showValue?: boolean;
	/** Formatter for the displayed value and aria-valuetext. */
	formatValue?: (value: number) => string;
	/** Custom screen-reader text for the current value. */
	getAriaValueText?: (value: number) => string;
	/** Labelled points rendered under the track. */
	marks?: SliderMark[];
	/** Corner radius. */
	radius?: Radius;
}

export function Slider(props: SliderProps) {
	const [local, rest] = splitProps(props, [
		"id",
		"class",
		"min",
		"max",
		"step",
		"value",
		"defaultValue",
		"onChange",
		"onInput",
		"disabled",
		"variant",
		"color",
		"size",
		"label",
		"showValue",
		"formatValue",
		"getAriaValueText",
		"marks",
		"radius",
	]);
	const autoId = `solidui-slider-${++sliderId}`;
	const id = () => local.id ?? autoId;
	const [internal, setInternal] = createSignal(local.defaultValue);

	const min = () => local.min ?? 0;
	const max = () => local.max ?? 100;
	const step = () => local.step ?? 1;
	const value = () => local.value ?? internal() ?? min();
	const fmt = (v: number) => local.formatValue?.(v) ?? String(v);
	const pct = (v: number) => ((v - min()) / (max() - min() || 1)) * 100;

	const handleInput: JSX.InputEventHandler<HTMLInputElement, InputEvent> = (e) => {
		const num = Number.parseFloat(e.currentTarget.value);
		const next = Number.isNaN(num) ? min() : num;
		if (local.value === undefined) setInternal(next);
		local.onChange?.(next);
		if (typeof local.onInput === "function") {
			local.onInput(e);
		}
	};

	const base =
		"w-full cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";
	const className = () =>
		[
			base,
			variantMap[local.color ?? local.variant ?? "default"],
			trackSizeMap[local.size ?? "md"],
			local.radius ? radiusMap[local.radius] : "",
			local.class || "",
		]
			.filter(Boolean)
			.join(" ");

	const field = (
		<input
			id={id()}
			type="range"
			class={className()}
			min={min()}
			max={max()}
			step={step()}
			value={value()}
			disabled={local.disabled}
			aria-valuetext={local.getAriaValueText?.(value())}
			onInput={handleInput}
			{...rest}
		/>
	);

	const decorated = () => !!(local.label || local.showValue || local.marks?.length);

	return (
		<Show when={decorated()} fallback={field}>
			<div class="w-full">
				<Show when={local.label || local.showValue}>
					<div class="mb-1 flex items-center justify-between gap-2">
						<Show when={local.label}>
							<label for={id()} class="text-sm font-medium text-foreground">
								{local.label}
							</label>
						</Show>
						<Show when={local.showValue}>
							<output for={id()} class="text-xs tabular-nums text-muted-foreground">
								{fmt(value())}
							</output>
						</Show>
					</div>
				</Show>
				{field}
				<Show when={local.marks?.length}>
					<div class="relative mt-1 h-4">
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
		</Show>
	);
}
