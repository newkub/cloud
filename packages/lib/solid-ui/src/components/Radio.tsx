/**
 * Radio — single radio input with label, description and error states.
 */
import { createSignal, type JSX, Show, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

let radioId = 0;

const variantMap = {
	default: "border-primary text-primary accent-primary",
	primary: "border-primary text-primary accent-primary",
	success: "border-success text-success accent-success",
	warning: "border-warning text-warning accent-warning",
	destructive: "border-destructive text-destructive accent-destructive",
} as const;

const sizeMap = {
	sm: "h-4 w-4",
	md: "h-5 w-5",
	lg: "h-6 w-6",
} as const;

export interface RadioProps
	extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "onChange" | "checked" | "type" | "children"> {
	/** Controlled checked state. */
	checked?: boolean;
	/** Initial checked state for uncontrolled usage. */
	defaultChecked?: boolean;
	label?: JSX.Element;
	/** Helper text rendered under the label. */
	description?: JSX.Element;
	/** Error state — `true` marks the input invalid, a node also renders a message below. */
	error?: JSX.Element | boolean;
	value?: string;
	onChange?: (value: string) => void;
	variant?: keyof typeof variantMap;
	size?: keyof typeof sizeMap;
	/** Corner radius. */
	radius?: Radius;
	/** Stretch to fill the container width. @default false */
	fullWidth?: boolean;
}

export function Radio(props: RadioProps) {
	const [local, rest] = splitProps(props, [
		"id",
		"class",
		"checked",
		"defaultChecked",
		"label",
		"description",
		"error",
		"value",
		"onChange",
		"variant",
		"size",
		"radius",
		"fullWidth",
	]);
	const autoId = `solidui-radio-${++radioId}`;
	const id = () => local.id ?? autoId;
	const [internal, setInternal] = createSignal(!!local.defaultChecked);
	const checked = () => (local.checked !== undefined ? local.checked : internal());

	const invalid = () => local.error !== undefined && local.error !== false;
	const errorText = () => (local.error !== undefined && typeof local.error !== "boolean" ? local.error : undefined);
	const describedBy = () =>
		[local.description ? `${id()}-desc` : "", errorText() ? `${id()}-error` : ""].filter(Boolean).join(" ") ||
		undefined;

	const base =
		"shrink-0 cursor-pointer border focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring aria-invalid:border-destructive disabled:cursor-not-allowed disabled:opacity-50";
	const className = () =>
		[
			base,
			sizeMap[local.size ?? "sm"],
			variantMap[local.variant ?? "default"],
			radiusMap[local.radius ?? "full"],
			local.fullWidth ? "w-full" : "",
			local.class || "",
		]
			.filter(Boolean)
			.join(" ");

	const handleChange = (e: Event) => {
		const target = e.currentTarget as HTMLInputElement;
		if (target.checked) {
			if (local.checked === undefined) setInternal(true);
			local.onChange?.(target.value);
		}
	};

	const input = (
		<input
			id={id()}
			type="radio"
			value={local.value}
			checked={checked()}
			onChange={handleChange}
			class={className()}
			aria-invalid={invalid() || undefined}
			aria-describedby={describedBy()}
			{...rest}
		/>
	);

	const errorBlock = (
		<Show when={errorText()}>
			<p id={`${id()}-error`} role="alert" class="mt-0.5 text-xs text-destructive">
				{errorText()}
			</p>
		</Show>
	);

	return (
		<Show
			when={local.label || local.description}
			fallback={
				<Show when={errorText()} fallback={input}>
					<div class="inline-flex flex-col">
						{input}
						{errorBlock}
					</div>
				</Show>
			}
		>
			<div class={local.fullWidth ? "flex w-full flex-col" : "inline-flex flex-col"}>
				<label
					for={id()}
					class="inline-flex cursor-pointer items-center gap-2 py-0.5 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-70"
				>
					{input}
					<span class="inline-flex flex-col gap-0.5">
						<Show when={local.label}>
							<span class="text-sm font-medium leading-none text-foreground">{local.label}</span>
						</Show>
						<Show when={local.description}>
							<span id={`${id()}-desc`} class="text-xs leading-snug text-muted-foreground">
								{local.description}
							</span>
						</Show>
					</span>
				</label>
				{errorBlock}
			</div>
		</Show>
	);
}
