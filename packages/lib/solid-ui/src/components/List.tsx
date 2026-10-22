/**
 * Styled ordered or unordered list
 */
import { type JSX, mergeProps, splitProps } from "solid-js";
import { paddingSizes, type Radius, radiusMap, type SurfaceVariant, surfaceVariants } from "../lib/variants";

const variantMap: Record<SurfaceVariant, string> = { ...surfaceVariants, default: "" };

export interface ListProps extends JSX.HTMLAttributes<HTMLElement> {
	ordered?: boolean;
	unstyled?: boolean;
	variant?: SurfaceVariant;
	size?: "xs" | "sm" | "md" | "lg" | "xl";
	/** Corner radius. */
	radius?: Radius;
}

export function List(props: ListProps) {
	const [local, rest] = splitProps(props, ["class", "ordered", "unstyled", "variant", "size", "children", "radius"]);
	const merged = mergeProps({ ordered: false, unstyled: false }, local);

	const markers = () => (merged.unstyled ? [] : [merged.ordered ? "list-decimal" : "list-disc"]);
	const className = () =>
		[
			"my-2 ml-5 space-y-1 text-foreground",
			...markers(),
			variantMap[local.variant ?? "default"],
			paddingSizes[local.size ?? "none"],
			local.radius ? radiusMap[local.radius] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return merged.ordered ? (
		<ol class={className()} {...(rest as unknown as JSX.OlHTMLAttributes<HTMLOListElement>)}>
			{local.children}
		</ol>
	) : (
		<ul class={className()} {...(rest as unknown as JSX.HTMLAttributes<HTMLUListElement>)}>
			{local.children}
		</ul>
	);
}
