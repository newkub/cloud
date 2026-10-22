/**
 * StatusDot - colored status dot with optional pulse and label.
 */
import { type JSX, Show, splitProps } from "solid-js";
import type { StatusVariant } from "../lib/variants";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface StatusDotProps extends JSX.HTMLAttributes<HTMLSpanElement> {
	variant?: StatusVariant;
	status?: "default" | "primary" | "success" | "warning" | "danger" | "destructive" | "info";
	pulse?: boolean;
	label?: string;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const statusClasses: Record<NonNullable<StatusDotProps["status"]>, string> = {
	default: "bg-muted-foreground",
	primary: "bg-primary",
	success: "bg-success",
	warning: "bg-warning",
	danger: "bg-destructive",
	destructive: "bg-destructive",
	info: "bg-info",
};

export function StatusDot(props: StatusDotProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"children",
		"variant",
		"status",
		"pulse",
		"label",
		"radius",
		"elevation",
	]);

	const color = () => statusClasses[local.variant ?? local.status ?? "default"];
	const hasText = () => Boolean(local.label || local.children);
	const dot = (
		<span class="relative inline-flex h-2.5 w-2.5" aria-hidden="true">
			<Show when={local.pulse}>
				<span
					class={`absolute inline-flex h-full w-full rounded-full opacity-60 motion-safe:animate-ping ${color()}`}
				/>
			</Show>
			<span class={`relative inline-flex h-2.5 w-2.5 rounded-full ${color()}`} />
		</span>
	);

	return (
		<span
			class={`inline-flex items-center gap-1.5 ${local.radius ? radiusMap[local.radius] : ""} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`}
			{...rest}
		>
			{dot}
			<Show when={!hasText()}>
				<span class="sr-only">{local.status ?? local.variant ?? "default"}</span>
			</Show>
			<Show when={local.label || local.children}>
				<span class="text-xs text-muted-foreground">{local.label ?? local.children}</span>
			</Show>
		</span>
	);
}
