/**
 * SliderField - labelled slider with value bubble.
 */
import { createSignal, type JSX, Show, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

export interface SliderFieldProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange" | "prefix"> {
	/** Field label */
	label?: string;
	/** Controlled value */
	value?: string;
	/** Uncontrolled initial value */
	defaultValue?: string;
	/** Called on every change */
	onChange?: (value: string) => void;
	placeholder?: string;
	/** Helper text under the input */
	hint?: string;
	/** Error message — marks the input invalid */
	error?: string;
	disabled?: boolean;
	readOnly?: boolean;
	required?: boolean;
	/** Leading adornment inside the input */
	prefix?: JSX.Element;
	/** Trailing adornment inside the input */
	suffix?: JSX.Element;
	/** Density @default "md" */
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Numeric value */
	numValue?: number;
	min?: number;
	max?: number;
	step?: number;
	/** Called with the number */
	onValueChange?: (value: number) => void;
}

export function SliderField(props: SliderFieldProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"label",
		"value",
		"defaultValue",
		"onChange",
		"placeholder",
		"hint",
		"error",
		"disabled",
		"readOnly",
		"required",
		"prefix",
		"suffix",
		"size",
		"radius",
		"id",
		"children",
		"numValue",
		"min",
		"max",
		"step",
		"onValueChange",
	]);
	const [text, setText] = createSignal(local.defaultValue ?? "");
	const val = () => (local.value !== undefined ? local.value : text());
	const onInput = (e: Event) => {
		const v = (e.target as HTMLInputElement).value;
		setText(v);
		local.onChange?.(v);
	};
	const inputCls = () =>
		`w-full border border-input bg-background text-foreground transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${{ sm: "h-8 px-2 text-xs", md: "h-10 px-3 text-sm", lg: "h-12 px-4 text-base" }[local.size ?? "md"]} ${radiusMap[local.radius ?? "md"]} ${local.error ? "border-destructive" : ""}`;
	const inputId = local.id ?? `slider-field-${Math.random().toString(36).slice(2, 8)}`;
	return (
		<div class={`solidui-slider-field space-y-1.5 ${local.class ?? ""}`.trim()} {...rest}>
			<Show when={local.label}>
				<label for={inputId} class="text-xs font-medium text-muted-foreground">
					{local.label}
					<Show when={local.required}>
						<span class="text-destructive" aria-hidden="true">
							{" "}
							*
						</span>
					</Show>
				</label>
			</Show>
			<div class="relative flex items-center">
				<Show when={local.prefix}>
					<span class="pointer-events-none absolute left-3 text-muted-foreground">{local.prefix}</span>
				</Show>
				<input
					id={inputId}
					class={`${inputCls()} ${local.prefix ? "pl-9" : ""} ${local.suffix ? "pr-9" : ""}`}
					value={val()}
					placeholder={local.placeholder}
					disabled={local.disabled}
					readOnly={local.readOnly}
					aria-invalid={local.error ? true : undefined}
					onInput={onInput}
				/>
				<Show when={local.suffix}>
					<span class="pointer-events-none absolute right-3 text-muted-foreground">{local.suffix}</span>
				</Show>
			</div>
			<Show
				when={local.error}
				fallback={
					<Show when={local.hint}>
						<p class="text-2xs text-muted-foreground">{local.hint}</p>
					</Show>
				}
			>
				<p class="text-2xs text-destructive" role="alert">
					{local.error}
				</p>
			</Show>
			{local.children}
		</div>
	);
}
