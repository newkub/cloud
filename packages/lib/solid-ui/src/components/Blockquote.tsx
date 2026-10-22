/**
 * Semantic blockquote with citation
 */
import { type JSX, Show, splitProps } from "solid-js";
import { paddingSizes, type Radius, radiusMap, type SurfaceVariant, surfaceVariants } from "../lib/variants";

export interface BlockquoteProps extends JSX.BlockquoteHTMLAttributes<HTMLQuoteElement> {
	variant?: SurfaceVariant;
	size?: "sm" | "md" | "lg";
	citation?: JSX.Element;
	/** Corner radius. */
	radius?: Radius;
}

export function Blockquote(props: BlockquoteProps) {
	const [local, rest] = splitProps(props, ["class", "variant", "size", "citation", "children", "radius"]);

	const className = () =>
		[
			"border-l-4 border-border pl-4 italic text-foreground",
			local.variant ? surfaceVariants[local.variant] : "",
			local.size ? paddingSizes[local.size] : "",
			local.radius ? radiusMap[local.radius] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		<blockquote class={className()} {...rest}>
			{local.children}
			<Show when={local.citation}>
				<footer class="mt-2 text-sm not-italic text-muted-foreground">
					— <cite>{local.citation}</cite>
				</footer>
			</Show>
		</blockquote>
	);
}
