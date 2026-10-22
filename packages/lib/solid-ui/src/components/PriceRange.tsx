/**
 * PriceRange — dual number inputs synced with a low/high range slider and currency prefix.
 */
import { createSignal, createUniqueId, type JSX, splitProps } from "solid-js";

export interface PriceRangeProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange" | "value"> {
	/** Minimum selectable price. @default 0 */
	min?: number;
	/** Maximum selectable price. @default 1000 */
	max?: number;
	/** Controlled [low, high] value. */
	value?: [number, number];
	/** Initial [low, high] value for uncontrolled usage. @default [min, max] */
	defaultValue?: [number, number];
	/** Called with the next [low, high] tuple on any input. */
	onChange?: (value: [number, number]) => void;
	/** Currency symbol shown inside the number inputs. @default "$" */
	currency?: string;
	/** Slider step. @default 1 */
	step?: number;
}

export function PriceRange(props: PriceRangeProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"min",
		"max",
		"value",
		"defaultValue",
		"onChange",
		"currency",
		"step",
	]);
	const id = `solidui-price-range-${createUniqueId()}`;
	const min = () => local.min ?? 0;
	const max = () => local.max ?? 1000;
	const step = () => local.step ?? 1;
	const currency = () => local.currency ?? "$";
	const [internal, setInternal] = createSignal<[number, number]>(local.defaultValue ?? [min(), max()]);
	const value = () => local.value ?? internal();

	const setValue = (next: [number, number]) => {
		const lo = Math.min(Math.max(next[0], min()), max());
		const hi = Math.min(Math.max(next[1], min()), max());
		const clamped: [number, number] = [Math.min(lo, hi), Math.max(lo, hi)];
		if (local.value === undefined) setInternal(clamped);
		local.onChange?.(clamped);
	};

	const onLowInput: JSX.InputEventHandler<HTMLInputElement, InputEvent> = (e) =>
		setValue([Number(e.currentTarget.value || min()), value()[1]]);
	const onHighInput: JSX.InputEventHandler<HTMLInputElement, InputEvent> = (e) =>
		setValue([value()[0], Number(e.currentTarget.value || max())]);

	const numInputCls =
		"h-9 w-full rounded-md border border-input bg-background pl-7 pr-2 text-sm tabular-nums text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";
	const rangeCls =
		"w-full cursor-pointer accent-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

	return (
		<div class={`solidui-price-range flex flex-col gap-3 ${local.class ?? ""}`} {...rest}>
			<div class="grid grid-cols-2 gap-3">
				<div class="flex flex-col gap-1">
					<label for={`${id}-min`} class="text-xs font-medium text-muted-foreground">
						Min price
					</label>
					<div class="relative">
						<span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5 text-sm text-muted-foreground">
							{currency()}
						</span>
						<input
							id={`${id}-min`}
							type="number"
							class={numInputCls}
							min={min()}
							max={value()[1]}
							step={step()}
							value={value()[0]}
							onInput={onLowInput}
						/>
					</div>
				</div>
				<div class="flex flex-col gap-1">
					<label for={`${id}-max`} class="text-xs font-medium text-muted-foreground">
						Max price
					</label>
					<div class="relative">
						<span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5 text-sm text-muted-foreground">
							{currency()}
						</span>
						<input
							id={`${id}-max`}
							type="number"
							class={numInputCls}
							min={value()[0]}
							max={max()}
							step={step()}
							value={value()[1]}
							onInput={onHighInput}
						/>
					</div>
				</div>
			</div>
			<div class="flex flex-col gap-1">
				<input
					type="range"
					class={rangeCls}
					min={min()}
					max={max()}
					step={step()}
					value={value()[0]}
					onInput={onLowInput}
					aria-label="Minimum price"
					aria-valuetext={`${currency()}${value()[0]}`}
				/>
				<input
					type="range"
					class={rangeCls}
					min={min()}
					max={max()}
					step={step()}
					value={value()[1]}
					onInput={onHighInput}
					aria-label="Maximum price"
					aria-valuetext={`${currency()}${value()[1]}`}
				/>
			</div>
			<p class="text-xs tabular-nums text-muted-foreground">
				{currency()}
				{value()[0]} – {currency()}
				{value()[1]}
			</p>
		</div>
	);
}
