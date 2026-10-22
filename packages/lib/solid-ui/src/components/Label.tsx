/**
 * Label - form field label with required indicator.
 */
import { type JSX, Show, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

type LabelVariant = "default" | "primary" | "muted" | "success" | "warning" | "destructive" | "info";

const variantMap: Record<LabelVariant, string> = {
	default: "",
	primary: "text-primary",
	muted: "text-muted-foreground",
	success: "text-success",
	warning: "text-warning",
	destructive: "text-destructive",
	info: "text-info",
};

const sizeMap: Record<"xs" | "sm" | "md" | "lg", string> = {
	xs: "text-2xs",
	sm: "text-xs",
	md: "text-sm",
	lg: "text-base",
};

export interface LabelProps extends JSX.LabelHTMLAttributes<HTMLLabelElement> {
	variant?: LabelVariant;
	size?: "xs" | "sm" | "md" | "lg";
	htmlFor?: string;
	/** Corner radius. */
	radius?: Radius;
	/** Stretch to fill the container width. @default false */
	fullWidth?: boolean;
	/** Show a required asterisk after the label text. @default false */
	required?: boolean;
	/** Custom marker rendered when `required` — defaults to an asterisk. */
	requiredIndicator?: JSX.Element;
	/** Dim the label and show a not-allowed cursor (pair with a disabled control). @default false */
	disabled?: boolean;
}

export function Label(props: LabelProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"variant",
		"size",
		"children",
		"for",
		"htmlFor",
		"radius",
		"fullWidth",
		"required",
		"requiredIndicator",
		"disabled",
	]);
	const targetFor = () => local.htmlFor ?? local.for;

	const base = "font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70";
	const className = () =>
		[
			base,
			sizeMap[local.size ?? "md"],
			variantMap[local.variant ?? "default"],
			local.disabled ? "cursor-not-allowed opacity-50" : "",
			local.radius ? radiusMap[local.radius] : "",
			local.fullWidth ? "w-full" : "",
			local.class || "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		<label class={className()} for={targetFor()} aria-disabled={local.disabled || undefined} {...rest}>
			{local.children}
			<Show when={local.required}>
				<span class="ml-0.5 text-destructive" aria-hidden="true">
					{local.requiredIndicator ?? "*"}
				</span>
			</Show>
		</label>
	);
}
