/**
 * FormField — labelled control wrapper with description, error and required marker.
 * Provides a `useFormField` context so custom controls can wire id/aria attrs.
 */
import { createContext, createUniqueId, type JSX, Show, splitProps, useContext } from "solid-js";
import { paddingSizes, type Radius, radiusMap, type SurfaceVariant, surfaceVariants } from "../lib/variants";
import { Label } from "./Label";

const variantMap: Record<SurfaceVariant, string> = { ...surfaceVariants, default: "" };

export interface FormFieldContextValue {
	/** Generated or explicit control id (use as the control's `id`). */
	controlId: () => string;
	/** Ids for `aria-describedby` — description and/or error nodes. */
	describedBy: () => string | undefined;
	/** Whether the field is in an invalid state. */
	invalid: () => boolean;
	/** Whether the field is required. */
	required: () => boolean;
	/** Whether the field is disabled. */
	disabled: () => boolean;
	/** Convenience props to spread onto the inner control. */
	controlProps: () => {
		id: string;
		"aria-describedby"?: string;
		"aria-invalid"?: boolean;
		"aria-required"?: boolean;
		disabled?: boolean;
	};
}

const FormFieldContext = createContext<FormFieldContextValue>();

/** Read the enclosing FormField context — returns undefined outside a FormField. */
export function useFormField(): FormFieldContextValue | undefined {
	return useContext(FormFieldContext);
}

export interface FormFieldProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Label content — string or element slot. */
	label?: JSX.Element;
	/** `for`/`id` of the control; defaults to a generated id exposed via context. */
	htmlFor?: string;
	/** Error message — switches the field to the invalid state. */
	error?: JSX.Element;
	/** Help text under the control. `hint` is a deprecated alias. */
	description?: JSX.Element;
	/** @deprecated use `description`. */
	hint?: JSX.Element;
	/** Show the required marker on the label and mark the field required. */
	required?: boolean;
	/** Disable the control — exposed via context and used for label styling. */
	disabled?: boolean;
	variant?: SurfaceVariant;
	size?: "xs" | "sm" | "md" | "lg" | "xl";
	/** Corner radius. */
	radius?: Radius;
	/** Stretch to fill the container width. @default false */
	fullWidth?: boolean;
}

export function FormField(props: FormFieldProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"children",
		"label",
		"htmlFor",
		"error",
		"description",
		"hint",
		"required",
		"disabled",
		"variant",
		"size",
		"radius",
		"fullWidth",
	]);

	const baseId = createUniqueId();
	const controlId = () => local.htmlFor ?? baseId;
	const descriptionId = () => ((local.description ?? local.hint) ? `${controlId()}-description` : undefined);
	const errorId = () => (local.error ? `${controlId()}-error` : undefined);
	const invalid = () => Boolean(local.error);
	const describedBy = () => [descriptionId(), errorId()].filter(Boolean).join(" ") || undefined;

	const ctx: FormFieldContextValue = {
		controlId,
		describedBy,
		invalid,
		required: () => Boolean(local.required),
		disabled: () => Boolean(local.disabled),
		controlProps: () => ({
			id: controlId(),
			"aria-describedby": describedBy(),
			"aria-invalid": invalid() || undefined,
			"aria-required": local.required || undefined,
			disabled: local.disabled || undefined,
		}),
	};

	const labelSize = () => {
		const s = local.size ?? "md";
		return s === "xs" || s === "sm" ? "sm" : s === "lg" || s === "xl" ? "lg" : "md";
	};

	const base = "grid gap-2";
	const className = () =>
		[
			base,
			variantMap[local.variant ?? "default"],
			paddingSizes[local.size ?? "none"],
			local.radius ? radiusMap[local.radius] : "",
			local.fullWidth ? "w-full" : "",
			local.class || "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		<FormFieldContext.Provider value={ctx}>
			<div class={className()} data-invalid={invalid() || undefined} {...rest}>
				<Show when={local.label !== undefined && local.label !== null}>
					<Label for={controlId()} required={local.required} disabled={local.disabled} size={labelSize()}>
						{local.label}
					</Label>
				</Show>
				{local.children}
				<Show when={local.error}>
					<span id={errorId()} class="text-sm text-destructive" role="alert">
						{local.error}
					</span>
				</Show>
				<Show when={local.description ?? local.hint}>
					<span id={descriptionId()} class="text-sm text-muted-foreground">
						{local.description ?? local.hint}
					</span>
				</Show>
			</div>
		</FormFieldContext.Provider>
	);
}
