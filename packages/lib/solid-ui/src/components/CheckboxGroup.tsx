/**
 * Group of checkbox inputs with multiple selections
 */
import { createSignal, For, type JSX, mergeProps, Show, splitProps } from "solid-js";
import {
	type ControlSize,
	paddingSizes,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

const variantMap: Record<SurfaceVariant, string> = { ...surfaceVariants, default: "" };

const controlSizeMap: Record<ControlSize, string> = {
	sm: "h-4 w-4",
	md: "h-5 w-5",
	lg: "h-6 w-6",
};

export interface CheckboxGroupOption {
	value: string;
	label?: string;
	/** Helper text rendered under the option label. */
	description?: string;
	disabled?: boolean;
}

export interface CheckboxGroupProps extends Omit<JSX.HTMLAttributes<HTMLFieldSetElement>, "onChange"> {
	value?: string[];
	defaultValue?: string[];
	onChange?: (value: string[]) => void;
	options?: CheckboxGroupOption[];
	orientation?: "horizontal" | "vertical";
	variant?: SurfaceVariant;
	size?: "xs" | "sm" | "md" | "lg" | "xl";
	/** Size of each checkbox control. @default "sm" */
	controlSize?: ControlSize;
	/** Group heading rendered as a `<legend>`. */
	label?: JSX.Element;
	/** Helper text rendered under the legend. */
	description?: JSX.Element;
	/** Error state — `true` marks every input invalid, a node also renders a message below. */
	error?: JSX.Element | boolean;
	/** Disable every checkbox in the group. */
	disabled?: boolean;
	/** `name` applied to every checkbox input — enables native form submission. */
	name?: string;
	/** Corner radius. */
	radius?: Radius;
	/** Stretch to fill the container width. @default false */
	fullWidth?: boolean;
}

let checkboxGroupId = 0;

export function CheckboxGroup(props: CheckboxGroupProps) {
	const merged = mergeProps(
		{ defaultValue: [] as string[], options: [] as CheckboxGroupOption[], orientation: "vertical" },
		props,
	);
	const [local, rest] = splitProps(merged, [
		"class",
		"value",
		"defaultValue",
		"onChange",
		"options",
		"orientation",
		"variant",
		"size",
		"controlSize",
		"label",
		"description",
		"error",
		"disabled",
		"name",
		"radius",
		"fullWidth",
	]);
	const [internal, setInternal] = createSignal(merged.defaultValue);
	const baseId = `checkboxgroup-${++checkboxGroupId}`;

	const value = () => (local.value !== undefined ? local.value : internal());

	const isSelected = (v: string) => value().includes(v);

	const toggle = (v: string) => {
		const current = value();
		const next = current.includes(v) ? current.filter((i) => i !== v) : [...current, v];
		if (local.value === undefined) setInternal(next);
		local.onChange?.(next);
	};

	const invalid = () => local.error !== undefined && local.error !== false;
	const errorText = () => (local.error !== undefined && typeof local.error !== "boolean" ? local.error : undefined);
	const describedBy = () =>
		[local.description ? `${baseId}-desc` : "", errorText() ? `${baseId}-error` : ""].filter(Boolean).join(" ") ||
		undefined;

	const orientationClass = () => (local.orientation === "horizontal" ? "flex flex-wrap gap-4" : "flex flex-col gap-2");

	const className = () =>
		[
			"m-0 min-w-0 border-0",
			orientationClass(),
			variantMap[local.variant ?? "default"],
			paddingSizes[local.size ?? "none"],
			local.radius ? radiusMap[local.radius] : "",
			local.fullWidth ? "w-full" : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		<fieldset class={className()} aria-label="Checkbox group" aria-describedby={describedBy()} {...rest}>
			<Show when={local.label}>
				<legend class="mb-1 w-full text-sm font-medium text-foreground">{local.label}</legend>
			</Show>
			<Show when={local.description}>
				<p id={`${baseId}-desc`} class="mb-1 w-full basis-full text-xs text-muted-foreground">
					{local.description}
				</p>
			</Show>
			<For each={local.options}>
				{(option) => {
					const id = `${baseId}-${option.value}`;
					return (
						<label
							for={id}
							class="inline-flex cursor-pointer items-center gap-2 py-0.5 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-70"
						>
							<input
								id={id}
								type="checkbox"
								name={local.name}
								value={option.value}
								checked={isSelected(option.value)}
								disabled={option.disabled || local.disabled}
								onChange={() => toggle(option.value)}
								aria-invalid={invalid() || undefined}
								class={`shrink-0 cursor-pointer rounded border border-primary text-primary accent-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring aria-invalid:border-destructive disabled:cursor-not-allowed disabled:opacity-50 ${controlSizeMap[local.controlSize ?? "sm"]}`}
							/>
							<Show when={option.label || option.description}>
								<span class="inline-flex flex-col gap-0.5">
									<Show when={option.label}>
										<span class="text-sm font-medium leading-none text-foreground">{option.label}</span>
									</Show>
									<Show when={option.description}>
										<span class="text-xs leading-snug text-muted-foreground">{option.description}</span>
									</Show>
								</span>
							</Show>
						</label>
					);
				}}
			</For>
			<Show when={errorText()}>
				<p id={`${baseId}-error`} role="alert" class="mt-1 basis-full text-xs text-destructive">
					{errorText()}
				</p>
			</Show>
		</fieldset>
	);
}
