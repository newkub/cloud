/**
 * PaperStack — card with stacked-paper depth rendered as offset sheets behind the content.
 */
import { useComponentClasses } from "@wrikka/hooks";
import { For, type JSX, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

export interface PaperStackProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Number of offset sheets behind the card. @default 2 */
	layers?: 1 | 2;
	/** Panel tone. @default "default" */
	variant?: SurfaceVariant;
	/** Corner radius. @default "lg" */
	radius?: Radius;
	/** Shadow elevation on the top card. */
	elevation?: Elevation;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

const offsets = ["translate-x-1.5 translate-y-1.5", "translate-x-3 translate-y-3"];

export function PaperStack(props: PaperStackProps) {
	const [local, pass] = splitProps(props, ["layers", "children"]);
	const { className, rest } = useComponentClasses(pass, {
		base: "relative",
		variants: surfaceVariants,
		defaultVariant: "default",
		unstyled: props.unstyled,
		axes: [
			{ prop: "radius", map: radiusMap, default: "lg" },
			{ prop: "elevation", map: elevationMap, default: "sm" },
		],
	});
	const radius = () => radiusMap[props.radius ?? "lg"];

	return (
		<div class={`relative ${props.class ?? ""}`.trim()}>
			<For each={Array.from({ length: props.unstyled ? 0 : (local.layers ?? 2) })}>
				{(_, i) => (
					<div
						aria-hidden="true"
						class={`solidui-paper-stack-sheet absolute inset-0 border border-border bg-surface ${offsets[i()]} ${radius()} ${i() > 0 ? "opacity-60" : "opacity-80"}`}
					/>
				)}
			</For>
			<div class={className()} {...rest}>
				{local.children}
			</div>
		</div>
	);
}
