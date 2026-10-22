/**
 * BulkActionsBar — floating "N selected" bar with bulk actions.
 */
import { For, type JSX, Show, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

export interface BulkAction {
	label: string;
	icon?: JSX.Element;
	onClick: () => void;
	/** Danger styling (delete…). */
	danger?: boolean;
	disabled?: boolean;
}

export interface BulkActionsBarProps extends JSX.HTMLAttributes<HTMLDivElement> {
	/** Selected count — hides the bar when 0. */
	count: number;
	actions: BulkAction[];
	onClear?: () => void;
	/** Render as floating centered bar. */
	position?: "static" | "floating";
	/** Count text, e.g. "{n} selected". */
	countLabel?: (n: number) => string;
	variant?: SurfaceVariant;
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const pad = { sm: "px-2.5 py-1.5", md: "px-3 py-2", lg: "px-4 py-2.5" } as const;
const btnSize = { sm: "h-6 text-2xs px-2", md: "h-7 text-xs px-2.5", lg: "h-8 text-sm px-3" } as const;

export function BulkActionsBar(props: BulkActionsBarProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"count",
		"actions",
		"onClear",
		"position",
		"countLabel",
		"variant",
		"size",
		"radius",
		"elevation",
	]);
	return (
		<Show when={local.count > 0}>
			<div
				role="toolbar"
				aria-label="Bulk actions"
				class={`solidui-bulk-actions-bar flex flex-wrap items-center gap-1 ${pad[local.size ?? "md"]} ${surfaceVariants[local.variant ?? "default"]} ${radiusMap[local.radius ?? "lg"]} ${local.elevation ? elevationMap[local.elevation] : "shadow-lg"} ${local.position === "floating" ? "fixed bottom-4 left-1/2 z-40 -translate-x-1/2" : ""} ${local.class ?? ""}`.trim()}
				{...rest}
			>
				<span class={`mr-1 font-medium tabular-nums text-foreground ${local.size === "sm" ? "text-2xs" : "text-xs"}`}>
					{local.countLabel?.(local.count) ?? `${local.count} selected`}
				</span>
				<For each={local.actions}>
					{(a) => (
						<button
							type="button"
							disabled={a.disabled}
							class={`inline-flex items-center gap-1 rounded-md font-medium motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 ${btnSize[local.size ?? "md"]} ${
								a.danger ? "text-destructive hover:bg-destructive/10" : "text-foreground hover:bg-muted"
							}`}
							onClick={a.onClick}
						>
							{a.icon}
							{a.label}
						</button>
					)}
				</For>
				<Show when={local.onClear}>
					<button
						type="button"
						aria-label="Clear selection"
						class={`ml-1 flex items-center rounded p-1 text-muted-foreground motion-safe:transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${local.size === "sm" ? "text-2xs" : "text-xs"}`}
						onClick={() => local.onClear?.()}
					>
						<svg
							class="h-3.5 w-3.5"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							aria-hidden="true"
						>
							<path d="M18 6 6 18M6 6l12 12" stroke-linecap="round" />
						</svg>
					</button>
				</Show>
			</div>
		</Show>
	);
}
