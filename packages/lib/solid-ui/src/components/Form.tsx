/**
 * Form — form wrapper with optional disabled-all, spacing and a live error summary region.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import { paddingSizes, type Radius, radiusMap, type SurfaceVariant, surfaceVariants } from "../lib/variants";

const variantMap: Record<SurfaceVariant, string> = { ...surfaceVariants, default: "" };

/** A single form validation error — plain message or field-linked. */
export type FormError = string | { field?: string; message: string };

export interface FormProps extends JSX.FormHTMLAttributes<HTMLFormElement> {
	variant?: SurfaceVariant;
	size?: "xs" | "sm" | "md" | "lg" | "xl";
	/** Corner radius. */
	radius?: Radius;
	/**
	 * Validation errors shown in an aria-live summary above the fields.
	 * Accepts a `name → message` record or a list of `FormError` items.
	 */
	errors?: Record<string, string | undefined> | FormError[];
	/** Heading of the error summary region. @default "Please fix the following errors" */
	errorSummaryTitle?: string;
	/** Disable every control in the form (rendered inside a disabled fieldset). @default false */
	disabled?: boolean;
}

/** Normalize the `errors` prop to `{ field, message }` rows. */
function normalizeErrors(errors: FormProps["errors"]): { field?: string; message: string }[] {
	if (!errors) return [];
	if (Array.isArray(errors))
		return errors.map((e) => (typeof e === "string" ? { message: e } : e)).filter((e) => Boolean(e.message));
	return Object.entries(errors)
		.filter(([, m]) => Boolean(m))
		.map(([field, message]) => ({ field, message: message as string }));
}

export function Form(props: FormProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"children",
		"onSubmit",
		"variant",
		"size",
		"radius",
		"errors",
		"errorSummaryTitle",
		"disabled",
	]);
	const base = "w-full";
	const className = () =>
		[
			base,
			variantMap[local.variant ?? "default"],
			paddingSizes[local.size ?? "none"],
			local.radius ? radiusMap[local.radius] : "",
			local.class || "",
		]
			.filter(Boolean)
			.join(" ");
	const errorList = () => normalizeErrors(local.errors);

	return (
		<form class={className()} onSubmit={local.onSubmit} {...rest}>
			<div aria-live="polite" aria-atomic="true">
				<Show when={errorList().length > 0}>
					<div role="alert" class="mb-3 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm">
						<div class="font-medium text-destructive">
							{local.errorSummaryTitle ?? "Please fix the following errors"}
						</div>
						<ul class="mt-1 list-inside list-disc space-y-0.5 text-destructive">
							<For each={errorList()}>
								{(e) => (
									<li>
										{e.field ? `${e.field}: ` : ""}
										{e.message}
									</li>
								)}
							</For>
						</ul>
					</div>
				</Show>
			</div>
			<fieldset disabled={local.disabled} class="contents">
				{local.children}
			</fieldset>
		</form>
	);
}
