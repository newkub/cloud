/**
 * LoadMore - load-more row with remaining count.
 */
import { type JSX, Show, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

export interface LoadMoreProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Row label */
	label?: string;
	/** Row value */
	value?: JSX.Element;
	/** Leading icon */
	icon?: JSX.Element;
	/** Hint under the value */
	hint?: string;
	/** Trailing actions slot */
	actions?: JSX.Element;
	/** Visual surface variant @default "default" */
	variant?: SurfaceVariant;
	/** Density @default "md" */
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Items remaining */
	remaining?: number;
	/** Called to load more */
	onLoad?: () => void;
	/** Loading state */
	loading?: boolean;
}

export function LoadMore(props: LoadMoreProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"label",
		"value",
		"icon",
		"hint",
		"actions",
		"variant",
		"size",
		"radius",
		"elevation",
		"children",
		"remaining",
		"onLoad",
		"loading",
	]);
	const pad = { sm: "p-3 text-xs", md: "p-4 text-sm", lg: "p-6 text-base" } as const;
	return (
		<div
			class={`solidui-load-more flex items-center gap-3 ${surfaceVariants[local.variant ?? "default"]} ${pad[local.size ?? "md"]} ${radiusMap[local.radius ?? "md"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<Show when={local.icon}>
				<span class="shrink-0 text-muted-foreground" aria-hidden="true">
					{local.icon}
				</span>
			</Show>
			<div class="min-w-0 flex-1">
				<Show when={local.label}>
					<div class="text-xs font-medium text-muted-foreground">{local.label}</div>
				</Show>
				<div class="font-medium text-foreground">{local.value ?? local.children}</div>
				<Show when={local.hint}>
					<div class="text-2xs text-muted-foreground">{local.hint}</div>
				</Show>
			</div>
			<Show when={local.actions}>{local.actions}</Show>
		</div>
	);
}
