/**
 * CornerBrackets - card framed by L-shaped corner brackets instead of a full border.
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

export interface CornerBracketsProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Bracket accent color token. @default "primary" */
	accent?: "primary" | "success" | "warning" | "destructive" | "info" | "muted";
	variant?: SurfaceVariant;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

const accentMap: Record<NonNullable<CornerBracketsProps["accent"]>, string> = {
	primary: "border-primary",
	success: "border-success",
	warning: "border-warning",
	destructive: "border-destructive",
	info: "border-info",
	muted: "border-muted-foreground/50",
};

const corners = [
	"left-0 top-0 border-l-2 border-t-2",
	"right-0 top-0 border-r-2 border-t-2",
	"bottom-0 left-0 border-b-2 border-l-2",
	"bottom-0 right-0 border-b-2 border-r-2",
] as const;

const variantMap: Record<SurfaceVariant, string> = {
	...surfaceVariants,
	default: "border-transparent bg-card text-card-foreground shadow-sm",
};

export function CornerBrackets(props: CornerBracketsProps) {
	const [local, restProps] = splitProps(props, ["children", "accent"]);
	const { className, rest } = useComponentClasses(restProps, {
		base: "solidui-corner-brackets relative border p-4 transition-shadow hover:shadow-md motion-reduce:transition-none",
		variants: variantMap,
		defaultVariant: "default",
		axes: [
			{ prop: "radius", map: radiusMap, default: "lg" },
			{ prop: "elevation", map: elevationMap },
		],
	});
	return (
		<div class={className()} {...rest}>
			<For each={corners}>
				{(c) => (
					<span
						aria-hidden="true"
						class={`pointer-events-none absolute h-3.5 w-3.5 ${c} ${
							props.unstyled ? "" : accentMap[local.accent ?? "primary"]
						}`}
					/>
				)}
			</For>
			{local.children}
		</div>
	);
}
