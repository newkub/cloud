/**
 * Group of radio inputs with single selection
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

export interface RadioGroupOption {
	value: string;
	label?: string;
	/** Helper text rendered under the option label. */
	description?: string;
	disabled?: boolean;
}

export interface RadioGroupProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange"> {
	value?: string;
	defaultValue?: string;
	onChange?: (value: string) => void;
	name?: string;
	options?: RadioGroupOption[];
	orientation?: "horizontal" | "vertical";
	variant?: SurfaceVariant;
	size?: "xs" | "sm" | "md" | "lg" | "xl";
	/** Size of each radio control. @default "sm" */
	controlSize?: ControlSize;
	/** Group heading rendered above the options. */
	label?: JSX.Element;
	/** Helper text rendered under the label. */
	description?: JSX.Element;
	/** Error state — `true` marks every input invalid, a node also renders a message below. */
	error?: JSX.Element | boolean;
	/** Disable every radio in the group. */
	disabled?: boolean;
	/** Corner radius. */
	radius?: Radius;
	/** Stretch to fill the container width. @default false */
	fullWidth?: boolean;
}

let radioGroupId = 0;

export function RadioGroup(props: RadioGroupProps) {
	const merged = mergeProps({ defaultValue: "", options: [] as RadioGroupOption[], orientation: "vertical" }, props);
	const [local, rest] = splitProps(merged, [
		"class",
		"value",
		"defaultValue",
		"onChange",
		"name",
		"options",
		"orientation",
		"variant",
		"size",
		"controlSize",
		"label",
		"description",
		"error",
		"disabled",
		"radius",
		"fullWidth",
	]);
	const [internal, setInternal] = createSignal(merged.defaultValue);
	const baseId = `radiogroup-${++radioGroupId}`;

	const value = () => (local.value !== undefined ? local.value : internal());

	const setValue = (next: string) => {
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
		<div
			class={className()}
			role="radiogroup"
			aria-orientation={local.orientation as "horizontal" | "vertical" | undefined}
			aria-label={local.name ?? "Radio group"}
			aria-describedby={describedBy()}
			{...rest}
		>
			<Show when={local.label}>
				<span class="w-full basis-full text-sm font-medium text-foreground">{local.label}</span>
			</Show>
			<Show when={local.description}>
				<p id={`${baseId}-desc`} class="w-full basis-full text-xs text-muted-foreground">
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
								type="radio"
								name={local.name ?? baseId}
								value={option.value}
								checked={value() === option.value}
								disabled={option.disabled || local.disabled}
								onChange={() => setValue(option.value)}
								aria-invalid={invalid() || undefined}
								class={`shrink-0 cursor-pointer rounded-full border border-primary text-primary accent-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring aria-invalid:border-destructive disabled:cursor-not-allowed disabled:opacity-50 ${controlSizeMap[local.controlSize ?? "sm"]}`}
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
				<p id={`${baseId}-error`} role="alert" class="mt-1 w-full basis-full text-xs text-destructive">
					{errorText()}
				</p>
			</Show>
		</div>
	);
}
