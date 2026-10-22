/**
 * LoadingDots — three bouncing dots for inline loading states.
 */
import { type JSX, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface LoadingDotsProps extends JSX.HTMLAttributes<HTMLSpanElement> {
	/** Dot size @default "md" */
	size?: "sm" | "md" | "lg";
	/** Dot tone @default "muted" */
	variant?: "muted" | "primary" | "current";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const dotSize = { sm: "h-1 w-1", md: "h-1.5 w-1.5", lg: "h-2 w-2" } as const;
const dotColor = {
	muted: "bg-muted-foreground",
	primary: "bg-primary",
	current: "bg-current",
} as const;

export function LoadingDots(props: LoadingDotsProps) {
	const [local, rest] = splitProps(props, ["class", "size", "variant", "radius", "elevation"]);
	const cls = () => `${dotSize[local.size ?? "md"]} ${dotColor[local.variant ?? "muted"]}`;
	return (
		<span
			role="status"
			aria-label="Loading"
			class={`solidui-loading-dots inline-flex items-center gap-1 ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<span
				class={`${cls()} motion-safe:animate-bounce  ${radiusMap[local.radius ?? "full"]} ${local.elevation ? elevationMap[local.elevation] : ""}`}
				style={{ "animation-delay": "0ms" }}
			/>
			<span class={`${cls()} motion-safe:animate-bounce rounded-full`} style={{ "animation-delay": "150ms" }} />
			<span class={`${cls()} motion-safe:animate-bounce rounded-full`} style={{ "animation-delay": "300ms" }} />
		</span>
	);
}
