/**
 * Anchor - in-page link with optional smooth scrolling.
 */
import { type JSX, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

type AnchorVariant = "default" | "primary" | "muted" | "underline";

const variantMap: Record<AnchorVariant, string> = {
	default: "text-primary underline-offset-4 hover:underline",
	primary: "text-primary underline-offset-4 hover:underline",
	muted: "text-muted-foreground underline-offset-4 hover:text-foreground hover:underline",
	underline: "text-primary underline underline-offset-4",
};

export interface AnchorProps extends JSX.AnchorHTMLAttributes<HTMLAnchorElement> {
	variant?: AnchorVariant;
	smooth?: boolean;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function Anchor(props: AnchorProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"variant",
		"children",
		"href",
		"smooth",
		"onClick",
		"radius",
		"elevation",
	]);

	const onClick = (e: MouseEvent) => {
		const href = local.href;
		if (href?.startsWith("#")) {
			const target = document.getElementById(href.slice(1));
			if (target) {
				e.preventDefault();
				const reduced =
					typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
				target.scrollIntoView({ behavior: local.smooth === false || reduced ? "auto" : "smooth" });
				history.replaceState(null, "", href);
			}
		}
		if (typeof local.onClick === "function") {
			(local.onClick as (e: MouseEvent) => void)(e);
		}
	};

	const className = () =>
		[
			"focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
			variantMap[local.variant ?? "default"],
			local.radius ? radiusMap[local.radius] : "",
			local.elevation ? elevationMap[local.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		<a class={className()} href={local.href} onClick={onClick} {...rest}>
			{local.children}
		</a>
	);
}
