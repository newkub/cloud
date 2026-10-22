/**
 * TimePicker — "HH:mm" (or "HH:mm:ss") value with optional 12h AM/PM toggle,
 * minute stepping, seconds and a clear button.
 */
import { createSignal, createUniqueId, type JSX, mergeProps, Show, splitProps } from "solid-js";
import { type ControlSize, type InputVariant, inputVariants, type Radius, radiusMap } from "../lib/variants";

const sizeMap: Record<ControlSize, string> = {
	sm: "h-8 px-2.5 py-0.5 text-xs",
	md: "h-9 px-3 py-1 text-sm",
	lg: "h-10 px-4 py-2 text-base",
};

export interface TimePickerProps
	extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "onChange" | "type" | "size"> {
	/** Controlled "HH:mm" value — always 24h, even in `hourCycle="12h"` mode. */
	value?: string;
	/** Initial value (uncontrolled). */
	defaultValue?: string;
	/** Visual style. @default "default" */
	variant?: InputVariant;
	/** Control size. @default "md" */
	size?: ControlSize;
	/** Called with the "HH:mm(:ss)" value — empty string when cleared. */
	onChange?: (value: string) => void;
	/** Display/editing convention — "12h" adds an AM/PM selector. @default "24h" */
	hourCycle?: "12h" | "24h";
	/** Minute granularity — sets the native `step` (minutes × 60s). */
	minuteStep?: number;
	/** Show seconds — value becomes "HH:mm:ss". @default false */
	withSeconds?: boolean;
	/** Earliest allowed time "HH:mm". */
	minTime?: string;
	/** Latest allowed time "HH:mm". */
	maxTime?: string;
	/** Show a × button that clears the value. */
	clearable?: boolean;
	/** Error state — `true` for styling only, or a message rendered below. */
	error?: boolean | string;
	/** Optional field label rendered above the input. */
	label?: string;
	/** Stretch to fill the container width. @default false */
	fullWidth?: boolean;
	/** Corner radius. */
	radius?: Radius;
}

export function TimePicker(props: TimePickerProps) {
	const merged = mergeProps({ defaultValue: "" }, props);
	const [internal, setInternal] = createSignal(merged.defaultValue);
	const uid = createUniqueId();
	const [local, rest] = splitProps(props, [
		"class",
		"variant",
		"size",
		"value",
		"defaultValue",
		"onChange",
		"hourCycle",
		"minuteStep",
		"withSeconds",
		"minTime",
		"maxTime",
		"clearable",
		"error",
		"label",
		"fullWidth",
		"radius",
		"disabled",
		"readOnly",
		"required",
		"id",
		"aria-label",
	]);

	const inputId = () => local.id ?? `solidui-time-picker-${uid}`;
	const value = () => (local.value !== undefined ? local.value : internal());
	const setValue = (next: string) => {
		setInternal(next);
		local.onChange?.(next);
	};

	const step = () => (local.withSeconds ? 1 : (local.minuteStep ?? 1) * 60);
	const period = () => (Number(value().split(":")[0] ?? 0) >= 12 ? "PM" : "AM");
	const setPeriod = (p: "AM" | "PM") => {
		const parts = value().split(":");
		let h = Number(parts[0] ?? 0);
		if (p === "PM" && h < 12) h += 12;
		if (p === "AM" && h >= 12) h -= 12;
		parts[0] = String(h).padStart(2, "0");
		setValue(parts.join(":"));
	};

	const base =
		"flex w-full items-center gap-1 border transition-colors motion-reduce:transition-none placeholder:text-muted-foreground focus-within:ring-1 focus-within:ring-ring has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50";
	const className = () =>
		[
			base,
			inputVariants[local.variant ?? "default"],
			sizeMap[local.size ?? "md"],
			radiusMap[local.radius ?? "md"],
			local.error ? "border-destructive" : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");
	const iconBtn =
		"flex h-6 w-6 shrink-0 items-center justify-center rounded text-muted-foreground motion-safe:transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50";
	const errorId = () => `${inputId()}-error`;

	return (
		<div class={`solidui-time-picker ${local.fullWidth ? "w-full" : "inline-block"}`}>
			<Show when={local.label}>
				<label for={inputId()} class="mb-1 block text-sm font-medium text-foreground">
					{local.label}
				</label>
			</Show>
			<div class={className()} aria-invalid={local.error ? true : undefined}>
				<input
					{...rest}
					id={inputId()}
					type="time"
					class="min-w-0 flex-1 border-0 bg-transparent text-foreground focus-visible:outline-none disabled:cursor-not-allowed"
					value={value()}
					step={step()}
					min={local.minTime}
					max={local.maxTime}
					disabled={local.disabled}
					readOnly={local.readOnly}
					required={local.required}
					aria-invalid={local.error ? true : undefined}
					aria-describedby={typeof local.error === "string" ? errorId() : undefined}
					aria-label={local["aria-label"] ?? local.label ?? "Time"}
					onInput={(e) => setValue(e.currentTarget.value)}
				/>
				<Show when={local.hourCycle === "12h"}>
					<select
						aria-label="AM or PM"
						class="border-0 bg-transparent text-inherit focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
						value={period()}
						disabled={local.disabled || local.readOnly}
						onChange={(e) => setPeriod(e.currentTarget.value as "AM" | "PM")}
					>
						<option value="AM">AM</option>
						<option value="PM">PM</option>
					</select>
				</Show>
				<Show when={local.clearable && value() && !local.disabled && !local.readOnly}>
					<button type="button" class={iconBtn} aria-label="Clear time" tabIndex={-1} onClick={() => setValue("")}>
						<svg
							class="h-3.5 w-3.5"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							aria-hidden="true"
						>
							<path d="M18 6 6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" />
						</svg>
					</button>
				</Show>
			</div>
			<Show when={typeof local.error === "string" && local.error}>
				<p id={errorId()} role="alert" class="mt-1 text-xs text-destructive">
					{local.error}
				</p>
			</Show>
		</div>
	);
}
