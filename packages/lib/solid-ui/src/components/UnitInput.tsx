/**
 * UnitInput — number input with a unit suffix select (px, %, kg…) or static unit badge.
 */
import { createSignal, For, type JSX, Show, splitProps } from "solid-js";
import { type ControlSize, type InputVariant, inputVariants, type Radius, radiusMap } from "../lib/variants";

export interface UnitInputProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange"> {
	/** Controlled numeric value */
	value?: number;
	defaultValue?: number;
	/** Selectable units @default ["px","%","rem"] — a single unit renders a static badge. */
	units?: string[];
	/** Controlled unit */
	unit?: string;
	defaultUnit?: string;
	variant?: InputVariant;
	size?: ControlSize;
	onChange?: (value: number, unit: string) => void;
	/** Called when the unit changes. */
	onUnitChange?: (unit: string) => void;
	/** Native step attr — also used to clamp arrow stepping. */
	step?: number;
	/** Inclusive bounds — values are clamped on commit. */
	min?: number;
	max?: number;
	/** Error message or invalid flag. */
	error?: boolean | string;
	/** Prevent editing while keeping the value visible. @default false */
	readOnly?: boolean;
	/** Stretch to fill the container width. @default false */
	fullWidth?: boolean;
	/** `name`/`id`/`placeholder`/`aria-label` applied to the inner number input. */
	name?: string;
	id?: string;
	placeholder?: string;
	"aria-label"?: string;
	disabled?: boolean;
	/** Corner radius. */
	radius?: Radius;
}

const sizeClass = { sm: "h-8 text-xs", md: "h-9 text-sm", lg: "h-10 text-sm" } as const;

export function UnitInput(props: UnitInputProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"value",
		"defaultValue",
		"units",
		"unit",
		"defaultUnit",
		"variant",
		"size",
		"onChange",
		"onUnitChange",
		"step",
		"min",
		"max",
		"error",
		"readOnly",
		"fullWidth",
		"name",
		"id",
		"placeholder",
		"aria-label",
		"disabled",
		"radius",
	]);
	const [internal, setInternal] = createSignal(local.defaultValue ?? 0);
	const [internalUnit, setInternalUnit] = createSignal(local.defaultUnit ?? local.units?.[0] ?? "px");
	const value = () => local.value ?? internal();
	const unit = () => local.unit ?? internalUnit();
	const units = () => local.units ?? ["px", "%", "rem"];
	const invalid = () => Boolean(local.error);
	const clamp = (n: number) =>
		Number.isNaN(n)
			? value()
			: Math.min(local.max ?? Number.POSITIVE_INFINITY, Math.max(local.min ?? Number.NEGATIVE_INFINITY, n));
	const commit = (n: number, u: string) => {
		const next = clamp(n);
		setInternal(next);
		setInternalUnit(u);
		local.onChange?.(next, u);
	};
	const cls = () => sizeClass[local.size ?? "md"];
	return (
		<div class={`solidui-unit-input ${local.fullWidth ? "w-full" : "inline-block"}`.trim()}>
			<div
				class={`inline-flex w-full items-center overflow-hidden border focus-within:ring-1 focus-within:ring-ring ${inputVariants[local.variant ?? "default"]} ${radiusMap[local.radius ?? "md"]} ${
					invalid() ? "border-destructive" : ""
				} ${local.class ?? ""}`.trim()}
				aria-invalid={invalid() || undefined}
				{...rest}
			>
				<input
					type="number"
					disabled={local.disabled}
					readOnly={local.readOnly}
					name={local.name}
					id={local.id}
					placeholder={local.placeholder}
					aria-label={local["aria-label"]}
					step={local.step}
					min={local.min}
					max={local.max}
					aria-invalid={invalid() || undefined}
					class={`w-full min-w-0 border-0 bg-transparent px-3 ${cls()} text-foreground focus-visible:outline-none disabled:opacity-50 read-only:cursor-default`}
					value={value()}
					onInput={(e) => commit(Number(e.currentTarget.value), unit())}
				/>
				<Show
					when={units().length > 1}
					fallback={
						<span
							class={`flex items-center border-l border-input bg-muted/50 px-2 font-medium text-muted-foreground ${cls()}`}
							aria-hidden="true"
						>
							{unit()}
						</span>
					}
				>
					<select
						disabled={local.disabled}
						class={`border-l border-input bg-muted/50 px-2 ${cls()} text-muted-foreground focus-visible:outline-none disabled:opacity-50`}
						value={unit()}
						onChange={(e) => {
							commit(value(), e.currentTarget.value);
							local.onUnitChange?.(e.currentTarget.value);
						}}
						aria-label="Unit"
					>
						<For each={units()}>{(u) => <option value={u}>{u}</option>}</For>
					</select>
				</Show>
			</div>
			<Show when={typeof local.error === "string"}>
				<span class="mt-1 block text-xs text-destructive" role="alert">
					{local.error}
				</span>
			</Show>
		</div>
	);
}
