/**
 * Pulse — wraps content with an expanding ping ring (live/activity indicator).
 */
import { type JSX, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface PulseProps extends JSX.HTMLAttributes<HTMLSpanElement> {
	/** Ring tone @default "primary" */
	variant?: "primary" | "success" | "warning" | "destructive" | "info";
	/** Show the ring @default true */
	active?: boolean;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const ringColor = {
	primary: "bg-primary/40",
	success: "bg-success/40",
	warning: "bg-warning/40",
	destructive: "bg-destructive/40",
	info: "bg-info/40",
} as const;

export function Pulse(props: PulseProps) {
	const [local, rest] = splitProps(props, ["class", "children", "variant", "active", "radius", "elevation"]);
	return (
		<span class={`solidui-pulse relative inline-flex ${local.class ?? ""}`.trim()} {...rest}>
			{(local.active ?? true) ? (
				<span
					aria-hidden="true"
					class={`absolute inset-0 motion-safe:animate-ping ${ringColor[local.variant ?? "primary"]} ${radiusMap[local.radius ?? "full"]} ${local.elevation ? elevationMap[local.elevation] : ""}`}
				/>
			) : null}
			<span class="relative inline-flex">{local.children}</span>
		</span>
	);
}
