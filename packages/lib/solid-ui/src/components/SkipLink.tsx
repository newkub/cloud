/**
 * SkipLink — accessibility "skip to content" link, visually hidden until focused.
 */
import { type JSX, splitProps } from "solid-js";
import { type Radius, radiusMap } from "../lib/variants";

export interface SkipLinkProps extends JSX.AnchorHTMLAttributes<HTMLAnchorElement> {
	/** Target fragment the link jumps to. @default "#main" */
	to?: string;
	/** Link text. @default "Skip to content" */
	label?: string;
	/** Corner radius when focused. @default "md" */
	radius?: Radius;
}

export function SkipLink(props: SkipLinkProps) {
	const [local, rest] = splitProps(props, ["class", "to", "label", "radius"]);
	return (
		<a
			href={local.to ?? "#main"}
			class={`solidui-skip-link sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:inline-flex focus:items-center focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring ${radiusMap[local.radius ?? "md"]} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			{local.label ?? "Skip to content"}
		</a>
	);
}
