/**
 * HoverPreview — link-preview card with thumbnail, title, and description.
 */
import { type JSX, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface HoverPreviewProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Thumbnail image URL */
	src?: string;
	/** Preview title */
	title?: string;
	/** Short description */
	description?: string;
	/** Card width @default "md" */
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const sizeClass = {
	sm: "w-52 max-w-[calc(100vw-2rem)]",
	md: "w-72 max-w-[calc(100vw-2rem)]",
	lg: "w-96 max-w-[calc(100vw-2rem)]",
} as const;

export function HoverPreview(props: HoverPreviewProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"children",
		"src",
		"title",
		"description",
		"size",
		"radius",
		"elevation",
	]);
	return (
		<div
			class={`solidui-hover-preview overflow-hidden border border-border bg-surface ${sizeClass[local.size ?? "md"]} ${radiusMap[local.radius ?? "lg"]} ${elevationMap[local.elevation ?? "lg"]} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<Show when={local.src}>
				<img src={local.src} alt="" class="h-32 w-full object-cover" />
			</Show>
			<div class="p-3">
				<Show when={local.title}>
					<p class="text-sm font-semibold text-foreground">{local.title}</p>
				</Show>
				<Show when={local.description}>
					<p class="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{local.description}</p>
				</Show>
				{local.children}
			</div>
		</div>
	);
}
