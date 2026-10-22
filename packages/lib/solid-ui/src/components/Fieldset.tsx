/**
 * Fieldset - semantic fieldset grouping with legend for related form controls.
 */
import { type JSX, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

export interface FieldsetProps extends JSX.FieldsetHTMLAttributes<HTMLFieldSetElement> {
	/** Legend text describing the group. */
	legend?: string;
	/** Muted helper text under the legend. */
	description?: string;
	/** Corner radius. */
	radius?: Radius;
}

export function Fieldset(props: FieldsetProps) {
	const [local, rest] = splitProps(props, ["class", "legend", "description", "children", "radius"]);

	const className = () =>
		["solidui-fieldset border border-border p-4 space-y-4", radiusMap[local.radius ?? "md"], local.class ?? ""]
			.filter(Boolean)
			.join(" ");

	return (
		<fieldset class={className()} {...rest}>
			{local.legend ? <legend class="px-1 text-sm font-medium text-foreground">{local.legend}</legend> : null}
			{local.description ? <p class="text-sm text-muted-foreground -mt-2">{local.description}</p> : null}
			{local.children}
		</fieldset>
	);
}
