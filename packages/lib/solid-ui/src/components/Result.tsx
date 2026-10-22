/**
 * Result - status page panel (success/error/empty) with an action.
 */
import { type JSX, Show, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	paddingSizes,
	type Radius,
	radiusMap,
	type StatusVariant,
	statusVariants,
} from "../lib/variants";

const variantMap: Record<StatusVariant, string> = {
	...statusVariants,
	default: "border-border bg-card",
};

export interface ResultProps extends JSX.HTMLAttributes<HTMLDivElement> {
	variant?: StatusVariant;
	size?: "sm" | "md" | "lg";
	status?: "default" | "primary" | "success" | "error" | "warning" | "info" | "destructive";
	title?: string;
	description?: string;
	action?: JSX.Element;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const statusStyles: Record<NonNullable<ResultProps["status"]>, { icon: string; class: string }> = {
	default: { icon: "•", class: "bg-muted text-muted-foreground" },
	primary: { icon: "★", class: "bg-primary/10 text-primary" },
	success: { icon: "✓", class: "bg-success/10 text-success" },
	error: { icon: "✕", class: "bg-destructive/10 text-destructive" },
	warning: { icon: "!", class: "bg-warning/10 text-warning" },
	info: { icon: "i", class: "bg-info/10 text-info" },
	destructive: { icon: "✕", class: "bg-destructive/10 text-destructive" },
};

export function Result(props: ResultProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"children",
		"variant",
		"size",
		"status",
		"title",
		"description",
		"action",
		"radius",
		"elevation",
	]);

	const status = () => statusStyles[local.status ?? "info"];

	const className = () =>
		[
			"flex flex-col items-center justify-center gap-3 border text-center ",
			variantMap[local.variant ?? "default"],
			paddingSizes[local.size ?? "lg"],
			radiusMap[local.radius ?? "lg"],
			elevationMap[local.elevation ?? "sm"],
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");

	return (
		<div class={className()} role="status" {...rest}>
			<Show when={local.status}>
				<span
					class={`flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold ${status().class}`}
					aria-hidden="true"
				>
					{status().icon}
				</span>
			</Show>
			<Show when={local.title}>
				<div class="text-base font-semibold">{local.title}</div>
			</Show>
			<Show when={local.description}>
				<div class="text-sm text-muted-foreground">{local.description}</div>
			</Show>
			{local.children}
			<Show when={local.action}>{local.action}</Show>
		</div>
	);
}
