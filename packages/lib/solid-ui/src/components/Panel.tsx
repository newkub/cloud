/**
 * Panel — bordered section with optional header, actions slot, and footer.
 */
import { type JSX, Show, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	paddingSizes,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

export interface PanelProps extends JSX.HTMLAttributes<HTMLElement> {
	/** Header title */
	title?: string;
	/** Header description under the title */
	description?: string;
	/** Right-aligned header actions slot */
	actions?: JSX.Element;
	/** Footer slot */
	footer?: JSX.Element;
	variant?: SurfaceVariant;
	/** Inner padding @default "md" */
	padding?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function Panel(props: PanelProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"children",
		"title",
		"description",
		"actions",
		"footer",
		"variant",
		"padding",
		"radius",
		"elevation",
	]);
	const hasHeader = () => local.title || local.actions;
	return (
		<section
			class={`solidui-panel overflow-hidden border ${surfaceVariants[local.variant ?? "default"]} ${radiusMap[local.radius ?? "lg"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<Show when={hasHeader()}>
				<header class="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
					<div class="min-w-0">
						<Show when={local.title}>
							<h3 class="truncate text-sm font-semibold text-foreground">{local.title}</h3>
						</Show>
						<Show when={local.description}>
							<p class="mt-0.5 text-xs text-muted-foreground">{local.description}</p>
						</Show>
					</div>
					<Show when={local.actions}>
						<div class="flex shrink-0 items-center gap-2">{local.actions}</div>
					</Show>
				</header>
			</Show>
			<div class={paddingSizes[local.padding ?? "md"]}>{local.children}</div>
			<Show when={local.footer}>
				<footer class="border-t border-border px-4 py-3">{local.footer}</footer>
			</Show>
		</section>
	);
}
