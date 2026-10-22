/**
 * EmptyState — centered placeholder for empty lists/pages: icon, title, description, action.
 */
import { type JSX, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface EmptyStateProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Icon/illustration slot */
	icon?: JSX.Element;
	/** Heading text */
	title?: string;
	/** Supporting description */
	description?: string;
	/** Call-to-action slot (button, link) */
	action?: JSX.Element;
	/** Vertical density @default "md" */
	size?: "sm" | "md" | "lg";
	/** Bordered surface treatment @default "ghost" */
	variant?: "ghost" | "outline" | "filled";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const sizeClass = { sm: "py-6", md: "py-10", lg: "py-16" } as const;
const variantClass = {
	ghost: "border-transparent bg-transparent",
	outline: "border-dashed border-border",
	filled: "border-border bg-muted/30",
} as const;

export function EmptyState(props: EmptyStateProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"icon",
		"title",
		"description",
		"action",
		"size",
		"variant",
		"radius",
		"elevation",
	]);
	return (
		<div
			class={`solidui-empty-state flex flex-col items-center justify-center gap-2 border px-6 text-center ${sizeClass[local.size ?? "md"]} ${variantClass[local.variant ?? "ghost"]} ${radiusMap[local.radius ?? "lg"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<Show when={local.icon}>
				<div class="text-3xl text-muted-foreground" aria-hidden="true">
					{local.icon}
				</div>
			</Show>
			<Show when={local.title}>
				<p class="text-sm font-semibold text-foreground">{local.title}</p>
			</Show>
			<Show when={local.description}>
				<p class="max-w-sm text-xs text-muted-foreground">{local.description}</p>
			</Show>
			<Show when={local.action}>
				<div class="mt-2">{local.action}</div>
			</Show>
		</div>
	);
}
