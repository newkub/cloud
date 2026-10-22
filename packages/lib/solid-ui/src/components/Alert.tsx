/**
 * Alert - inline status message with title, body and variant tones.
 */
import { type JSX, mergeProps, Show } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export type AlertVariant = "default" | "info" | "success" | "warning" | "destructive";

export interface AlertProps {
	variant?: AlertVariant;
	title?: string;
	children?: JSX.Element;
	class?: string;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Strip all visual classes — keep structure only. @default false */
	unstyled?: boolean;
}

const variantMap: Record<AlertVariant, string> = {
	default: "border-border bg-muted text-foreground",
	info: "border-info bg-info/10 text-info",
	success: "border-success bg-success/10 text-success",
	warning: "border-warning bg-warning/10 text-warning",
	destructive: "border-destructive bg-destructive/10 text-destructive",
};

export function Alert(props: AlertProps) {
	const merged = mergeProps({ variant: "default" as AlertVariant }, props);
	return (
		<div
			class={
				merged.unstyled
					? (props.class ?? "")
					: ` border p-4 ${variantMap[merged.variant]} ${radiusMap[merged.radius ?? "xl"]} ${merged.elevation ? elevationMap[merged.elevation] : ""} ${props.class ?? ""}`
			}
			role="alert"
		>
			<Show when={merged.title}>
				<h4 class={merged.unstyled ? "" : "mb-1 text-sm font-semibold"}>{merged.title}</h4>
			</Show>
			<div class={merged.unstyled ? "" : "text-sm"}>{merged.children}</div>
		</div>
	);
}
