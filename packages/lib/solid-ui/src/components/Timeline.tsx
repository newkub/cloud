/**
 * Timeline - vertical event list with markers.
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

const variantMap: Record<SurfaceVariant, string> = { ...surfaceVariants, default: "" };

export interface TimelineProps extends JSX.HTMLAttributes<HTMLOListElement> {
	variant?: SurfaceVariant;
	size?: "xs" | "sm" | "md" | "lg" | "xl";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function Timeline(props: TimelineProps) {
	const [local, rest] = splitProps(props, ["class", "variant", "size", "children", "radius", "elevation"]);
	const className = () =>
		[
			"relative list-none space-y-6",
			variantMap[local.variant ?? "default"],
			paddingSizes[local.size ?? "none"],
			local.radius ? radiusMap[local.radius] : "",
			local.elevation ? elevationMap[local.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");
	return (
		<ol class={className()} {...rest}>
			<li class="absolute left-2.5 top-3 bottom-0 w-px bg-border" aria-hidden="true" />
			{local.children}
		</ol>
	);
}

export interface TimelineItemProps extends Omit<JSX.HTMLAttributes<HTMLLIElement>, "title"> {
	title?: JSX.Element;
	description?: JSX.Element;
	time?: JSX.Element;
	dot?: JSX.Element;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

export function TimelineItem(props: TimelineItemProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"title",
		"description",
		"time",
		"dot",
		"children",
		"radius",
		"elevation",
	]);
	const className = () =>
		[
			"relative pl-8",
			local.radius ? radiusMap[local.radius] : "",
			local.elevation ? elevationMap[local.elevation] : "",
			local.class ?? "",
		]
			.filter(Boolean)
			.join(" ");
	const dotClass =
		"absolute left-2.5 top-1.5 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-background bg-primary";

	return (
		<li class={className()} {...rest}>
			<span class={dotClass} aria-hidden="true">
				<Show when={local.dot}>{local.dot}</Show>
			</span>
			<div class="flex flex-col gap-0.5">
				<div class="flex items-center justify-between gap-2">
					<Show when={local.title}>
						<span class="text-sm font-medium text-foreground">{local.title}</span>
					</Show>
					<Show when={local.time}>
						<span class="text-xs text-muted-foreground">{local.time}</span>
					</Show>
				</div>
				<Show when={local.description}>
					<p class="text-xs text-muted-foreground">{local.description}</p>
				</Show>
				{local.children}
			</div>
		</li>
	);
}
