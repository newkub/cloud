/**
 * LiveBadge - pulsing LIVE/streaming indicator with optional count.
 */
import { type JSX, Show, splitProps } from "solid-js";
import { chipVariants, type Radius, radiusMap } from "../lib/variants";

export interface LiveBadgeProps extends JSX.HTMLAttributes<HTMLSpanElement> {
	/** Chip label text */
	label?: string;
	/** Leading icon */
	icon?: JSX.Element;
	/** Trailing value */
	value?: string | number;
	/** Chip tone @default "default" */
	variant?: keyof typeof chipVariants;
	/** Density @default "md" */
	size?: "sm" | "md" | "lg";
	/** Corner radius. @default "full" */
	radius?: Radius;
	/** Viewer/live count */
	count?: number;
	/** Pulse the dot @default true */
	pulse?: boolean;
}

export function LiveBadge(props: LiveBadgeProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"variant",
		"size",
		"radius",
		"children",
		"icon",
		"label",
		"value",
		"count",
		"pulse",
	]);
	const chipPad = { sm: "px-2 py-0.5 text-xs", md: "px-2.5 py-1 text-xs", lg: "px-3 py-1.5 text-sm" } as const;
	const tone = () => chipVariants[local.variant ?? "default"];
	return (
		<span
			class={`solidui-live-badge inline-flex items-center gap-1.5 border font-medium ${tone()} ${chipPad[local.size ?? "md"]} ${radiusMap[local.radius ?? "full"]} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<Show when={local.icon}>
				<span class="shrink-0" aria-hidden="true">
					{local.icon}
				</span>
			</Show>
			<Show when={local.label}>{local.label}</Show>
			{local.children}
			<Show when={local.value !== undefined}>
				<span class="font-semibold tabular-nums">{local.value}</span>
			</Show>
		</span>
	);
}
