/**
 * PricingToggle - monthly/yearly billing period switch with optional save badge.
 */
import { type JSX, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";
import { Badge } from "./Badge";

export interface PricingToggleProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange"> {
	/** Current period. @default "monthly" */
	value?: "monthly" | "yearly";
	/** Called with the picked period. */
	onChange?: (period: "monthly" | "yearly") => void;
	/** Savings label on the yearly option, e.g. "-20%". */
	saveLabel?: string;
	/** Corner radius. */
	radius?: Radius;
}

export function PricingToggle(props: PricingToggleProps) {
	const [local, rest] = splitProps(props, ["class", "value", "onChange", "saveLabel", "radius"]);

	const opt = (id: "monthly" | "yearly", label: string) => (
		<button
			type="button"
			class={`inline-flex h-8 items-center gap-1.5 px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${radiusMap[local.radius ?? "md"]} ${
				(local.value ?? "monthly") === id
					? "bg-background text-foreground shadow-sm"
					: "text-muted-foreground hover:text-foreground"
			}`}
			aria-pressed={(local.value ?? "monthly") === id}
			onClick={() => local.onChange?.(id)}
		>
			{label}
			{id === "yearly" && local.saveLabel ? <Badge variant="success">{local.saveLabel}</Badge> : null}
		</button>
	);

	return (
		// biome-ignore lint/a11y/useSemanticElements: segmented control, not a form fieldset
		<div
			class={`solidui-pricing-toggle inline-flex items-center gap-0.5 border border-input bg-muted p-0.5 ${radiusMap[local.radius ?? "md"]} ${local.class ?? ""}`}
			role="group"
			aria-label="Billing period"
			{...rest}
		>
			{opt("monthly", "Monthly")}
			{opt("yearly", "Yearly")}
		</div>
	);
}
