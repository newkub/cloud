/**
 * Link - styled anchor with external-link affordance.
 */
import { type JSX, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

type LinkVariant = "default" | "primary" | "muted" | "underline";

const variantMap: Record<LinkVariant, string> = {
	default: "text-primary hover:underline",
	primary: "text-primary hover:underline",
	muted: "text-muted-foreground hover:text-foreground hover:underline",
	underline: "text-primary underline underline-offset-4",
};

export interface LinkProps extends JSX.AnchorHTMLAttributes<HTMLAnchorElement> {
	variant?: LinkVariant;
	external?: boolean;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function Link(props: LinkProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"variant",
		"children",
		"external",
		"target",
		"rel",
		"radius",
		"elevation",
	]);

	const base = "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
	const className = () =>
		[
			base,
			variantMap[local.variant ?? "default"],
			radiusMap[local.radius ?? "sm"],
			local.elevation ? elevationMap[local.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");
	const target = () => (local.external ? "_blank" : local.target);
	const rel = () => {
		if (!local.external) return local.rel;
		return [local.rel, "noopener", "noreferrer"].filter(Boolean).join(" ");
	};

	return (
		<a class={className()} target={target()} rel={rel()} {...rest}>
			{local.children}
		</a>
	);
}
