/**
 * Icon - named SVG icon with size and a11y label.
 */
import { type JSX, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

type IconVariant = "default" | "primary" | "muted" | "success" | "warning" | "destructive" | "info";

const variantMap: Record<IconVariant, string> = {
	default: "",
	primary: "text-primary",
	muted: "text-muted-foreground",
	success: "text-success",
	warning: "text-warning",
	destructive: "text-destructive",
	info: "text-info",
};

export interface IconProps extends JSX.HTMLAttributes<HTMLSpanElement> {
	variant?: IconVariant;
	size?: number | string;
	label?: string;
	/** Corner radius. */
	radius?: Radius;
}

export function Icon(props: IconProps) {
	const [local, rest] = splitProps(props, ["class", "variant", "children", "size", "label", "radius"]);

	const base = "inline-flex shrink-0 items-center justify-center align-middle";
	const className = () =>
		[
			base,
			local.variant ? variantMap[local.variant] : "",
			local.radius ? radiusMap[local.radius] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");
	const size = () => {
		if (local.size === undefined) return "1.25rem";
		return typeof local.size === "number" ? `${local.size}px` : local.size;
	};
	const style = () => ({ width: size(), height: size() });

	if (local.label) {
		return (
			<span class={className()} style={style()} role="img" aria-label={local.label} {...rest}>
				{local.children}
			</span>
		);
	}
	return (
		<span class={className()} style={style()} aria-hidden="true" {...rest}>
			{local.children}
		</span>
	);
}
