/**
 * Loading indicator
 */
import { type JSX, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";
import { Spinner } from "./Spinner";

const variantMap = {
	default: "",
	primary: "text-primary",
	secondary: "text-secondary",
	muted: "text-muted-foreground",
} as const;

export interface LoadingProps extends JSX.HTMLAttributes<HTMLDivElement> {
	message?: string;
	overlay?: boolean;
	variant?: keyof typeof variantMap;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function Loading(props: LoadingProps) {
	const [local, rest] = splitProps(props, ["class", "message", "overlay", "variant", "radius", "elevation"]);

	const tone = () =>
		variantMap[local.variant ?? "default"] || (local.overlay ? "text-foreground" : "text-muted-foreground");

	const base = () =>
		[
			local.overlay
				? "fixed inset-0 z-toast flex flex-col items-center justify-center gap-3 bg-overlay/80"
				: "inline-flex items-center gap-2",
			tone(),
			local.radius ? radiusMap[local.radius] : "",
			local.elevation ? elevationMap[local.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		<div class={base()} role="status" aria-live="polite" {...rest}>
			<Spinner variant={local.variant} class={local.overlay ? "h-8 w-8" : "h-5 w-5"} />
			<Show when={local.message || local.overlay}>
				<span class="text-sm">{local.message ?? "Loading…"}</span>
			</Show>
		</div>
	);
}
