/**
 * Notification - status notification card.
 */
import { type JSX, mergeProps, Show } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export type NotificationVariant = "default" | "info" | "success" | "warning" | "destructive";

export interface NotificationProps {
	variant?: NotificationVariant;
	title?: string;
	children?: JSX.Element;
	class?: string;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const variantMap: Record<NotificationVariant, string> = {
	default: "border-border bg-surface text-foreground",
	info: "border-info bg-info/10 text-info",
	success: "border-success bg-success/10 text-success",
	warning: "border-warning bg-warning/10 text-warning",
	destructive: "border-destructive bg-destructive/10 text-destructive",
};

export function Notification(props: NotificationProps) {
	const merged = mergeProps({ variant: "default" as NotificationVariant }, props);
	return (
		<div
			class={` border p-3 ${variantMap[merged.variant]} ${radiusMap[merged.radius ?? "lg"]} ${elevationMap[merged.elevation ?? "sm"]} ${props.class ?? ""}`}
			role="status"
		>
			<Show when={merged.title}>
				<h4 class="mb-0.5 text-sm font-semibold">{merged.title}</h4>
			</Show>
			<div class="text-sm">{merged.children}</div>
		</div>
	);
}
