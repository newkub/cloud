/**
 * ColumnSelector — toggle which table/list columns are visible.
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

export interface ColumnOption {
	key: string;
	label: string;
	/** Cannot be hidden. */
	locked?: boolean;
}

export interface ColumnSelectorProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange"> {
	columns: ColumnOption[];
	/** Visible column keys. */
	visible: string[];
	onChange?: (visible: string[]) => void;
	/** Select-all / none row. @default true */
	showAll?: boolean;
	size?: "sm" | "md" | "lg";
	variant?: SurfaceVariant;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	disabled?: boolean;
}

const rowSize = { sm: "text-2xs py-1", md: "text-xs py-1.5", lg: "text-sm py-2" } as const;

export function ColumnSelector(props: ColumnSelectorProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"columns",
		"visible",
		"onChange",
		"showAll",
		"size",
		"variant",
		"radius",
		"elevation",
		"disabled",
	]);
	const isVisible = (key: string) => (local.visible ?? []).includes(key);
	const toggle = (col: ColumnOption) => {
		if (col.locked) return;
		local.onChange?.(
			isVisible(col.key) ? (local.visible ?? []).filter((k) => k !== col.key) : [...(local.visible ?? []), col.key],
		);
	};
	const setAll = (on: boolean) =>
		local.onChange?.(
			on ? (local.columns ?? []).map((c) => c.key) : (local.columns ?? []).filter((c) => c.locked).map((c) => c.key),
		);

	return (
		<div
			class={`solidui-column-selector min-w-44 ${surfaceVariants[local.variant ?? "default"]} p-1.5 ${radiusMap[local.radius ?? "lg"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<Show when={local.showAll ?? true}>
				<div class="flex gap-1 border-b border-border pb-1.5">
					<button
						type="button"
						disabled={local.disabled}
						class="flex-1 rounded px-2 py-1 text-2xs font-medium text-muted-foreground motion-safe:transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
						onClick={() => setAll(true)}
					>
						Show all
					</button>
					<button
						type="button"
						disabled={local.disabled}
						class="flex-1 rounded px-2 py-1 text-2xs font-medium text-muted-foreground motion-safe:transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
						onClick={() => setAll(false)}
					>
						Hide all
					</button>
				</div>
			</Show>
			<For each={local.columns ?? []}>
				{(col) => (
					<label
						class={`flex items-center gap-2 rounded px-2 ${rowSize[local.size ?? "md"]} ${col.locked || local.disabled ? "opacity-60" : "cursor-pointer hover:bg-muted/60"}`}
					>
						<input
							type="checkbox"
							class="h-3.5 w-3.5 shrink-0 accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
							checked={isVisible(col.key)}
							disabled={col.locked || local.disabled}
							onChange={() => toggle(col)}
						/>
						<span class="text-foreground">{col.label}</span>
						<Show when={col.locked}>
							<span class="ml-auto text-2xs text-muted-foreground">locked</span>
						</Show>
					</label>
				)}
			</For>
		</div>
	);
}
