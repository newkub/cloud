/**
 * Switch — toggle control with label, description and error states.
 */
import { createSignal, type JSX, Show, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

const variantMap = {
	default: "bg-primary",
	primary: "bg-primary",
	success: "bg-success",
	warning: "bg-warning",
	destructive: "bg-destructive",
} as const;

const thumbVariantMap = {
	default: "bg-primary-foreground",
	primary: "bg-primary-foreground",
	success: "bg-success-foreground",
	warning: "bg-warning-foreground",
	destructive: "bg-destructive-foreground",
} as const;

const trackSizeMap = {
	sm: "h-4 w-7",
	md: "h-5 w-9",
	lg: "h-6 w-11",
} as const;

const thumbSizeMap = {
	sm: "h-3 w-3",
	md: "h-4 w-4",
	lg: "h-5 w-5",
} as const;

const thumbShiftMap = {
	sm: "translate-x-3",
	md: "translate-x-4",
	lg: "translate-x-5",
} as const;

let switchId = 0;

export interface SwitchProps
	extends Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "onChange" | "role" | "aria-checked" | "value"> {
	/** Controlled checked state. */
	checked?: boolean;
	/** Initial checked state for uncontrolled usage. */
	defaultChecked?: boolean;
	onChange?: (checked: boolean) => void;
	/** Text label rendered next to the track (alias for children). */
	label?: JSX.Element;
	/** Helper text rendered under the label. */
	description?: JSX.Element;
	/** Error state — `true` marks the control invalid, a node also renders a message below. */
	error?: JSX.Element | boolean;
	/** Form field name — renders a hidden input so the value submits with forms. */
	name?: string;
	/** Form value submitted when the switch is on. @default "on" */
	value?: string;
	variant?: keyof typeof variantMap;
	size?: keyof typeof trackSizeMap;
	/** Corner radius. */
	radius?: Radius;
	/** Stretch to fill the container width. @default false */
	fullWidth?: boolean;
}

export function Switch(props: SwitchProps) {
	const [local, rest] = splitProps(props, [
		"id",
		"class",
		"children",
		"checked",
		"defaultChecked",
		"onChange",
		"disabled",
		"onClick",
		"label",
		"description",
		"error",
		"name",
		"value",
		"variant",
		"size",
		"radius",
		"fullWidth",
	]);
	const autoId = `solidui-switch-${++switchId}`;
	const id = () => local.id ?? autoId;
	const [internal, setInternal] = createSignal(!!local.defaultChecked);
	const checked = () => (local.checked !== undefined ? local.checked : internal());

	const invalid = () => local.error !== undefined && local.error !== false;
	const errorText = () => (local.error !== undefined && typeof local.error !== "boolean" ? local.error : undefined);
	const describedBy = () =>
		[local.description ? `${id()}-desc` : "", errorText() ? `${id()}-error` : ""].filter(Boolean).join(" ") ||
		undefined;

	const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
		if (local.disabled) return;
		const next = !checked();
		if (local.checked === undefined) setInternal(next);
		local.onChange?.(next);
		if (typeof local.onClick === "function") {
			local.onClick(e);
		}
	};

	const trackClass = () =>
		[
			"relative inline-flex shrink-0 items-center rounded-full border-2 border-transparent transition-colors motion-reduce:transition-none",
			trackSizeMap[local.size ?? "md"],
			checked() ? variantMap[local.variant ?? "default"] : "bg-input",
		].join(" ");

	const thumbClass = () =>
		[
			"pointer-events-none block rounded-full shadow-sm ring-0 transition-transform motion-reduce:transition-none",
			thumbSizeMap[local.size ?? "md"],
			checked()
				? `${thumbShiftMap[local.size ?? "md"]} ${thumbVariantMap[local.variant ?? "default"]}`
				: "translate-x-0 bg-foreground",
		].join(" ");

	const className = () =>
		[
			"inline-flex items-center gap-2 text-sm font-medium transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
			radiusMap[local.radius ?? "md"],
			local.fullWidth ? "w-full" : "",
			local.class || "",
		]
			.filter(Boolean)
			.join(" ");

	const control = (
		<button
			id={id()}
			type="button"
			role="switch"
			aria-checked={checked()}
			aria-invalid={invalid() || undefined}
			aria-describedby={describedBy()}
			disabled={local.disabled}
			onClick={handleClick}
			class={className()}
			{...rest}
		>
			<span class={trackClass()}>
				<span class={thumbClass()} />
			</span>
			{local.children}
		</button>
	);

	const labelled = () => !!(local.label || local.description || errorText());

	const hiddenInput = (
		<Show when={local.name}>
			<input type="hidden" name={local.name} value={checked() ? (local.value ?? "on") : ""} />
		</Show>
	);

	return (
		<>
			<Show when={labelled()} fallback={control}>
				<div class={local.fullWidth ? "flex w-full flex-col" : "inline-flex flex-col"}>
					<div class="inline-flex items-center gap-2">
						{control}
						<Show when={local.label || local.description}>
							<label for={id()} class="inline-flex cursor-pointer flex-col gap-0.5">
								<Show when={local.label}>
									<span class="text-sm font-medium leading-none text-foreground">{local.label}</span>
								</Show>
								<Show when={local.description}>
									<span id={`${id()}-desc`} class="text-xs leading-snug text-muted-foreground">
										{local.description}
									</span>
								</Show>
							</label>
						</Show>
					</div>
					<Show when={errorText()}>
						<p id={`${id()}-error`} role="alert" class="mt-0.5 text-xs text-destructive">
							{errorText()}
						</p>
					</Show>
				</div>
			</Show>
			{hiddenInput}
		</>
	);
}
