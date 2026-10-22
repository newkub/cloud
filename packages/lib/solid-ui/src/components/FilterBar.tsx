/**
 * FilterBar — row of toggleable filter chips.
 */
import { For, type JSX, splitProps } from "solid-js";
import { chipVariants, type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface FilterItem {
	/** Filter value */
	value: string;
	/** Chip label */
	label: string;
	/** Selected state */
	active?: boolean;
	/** Optional result count badge */
	count?: number;
}

export interface FilterBarProps extends Omit<JSX.HTMLAttributes<HTMLFieldSetElement>, "onToggle"> {
	filters: FilterItem[];
	/** Chip size @default "md" */
	size?: "sm" | "md" | "lg";
	onToggle?: (filter: FilterItem) => void;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const chipSize = { sm: "h-6 px-2 text-2xs", md: "h-7 px-2.5 text-xs", lg: "h-8 px-3 text-sm" } as const;

export function FilterBar(props: FilterBarProps) {
	const [local, rest] = splitProps(props, ["class", "filters", "size", "onToggle", "radius", "elevation"]);
	return (
		<fieldset
			aria-label="Filters"
			class={`solidui-filter-bar flex min-w-0 flex-wrap items-center gap-1.5 border-0 p-0 ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<For each={local.filters}>
				{(f) => (
					<button
						type="button"
						aria-pressed={f.active}
						class={`inline-flex items-center gap-1 border font-medium motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${chipSize[local.size ?? "md"]} ${
							f.active ? chipVariants.primary : chipVariants.outline
						} ${radiusMap[local.radius ?? "full"]} ${local.elevation ? elevationMap[local.elevation] : ""}`}
						onClick={() => local.onToggle?.(f)}
					>
						{f.label}
						{f.count !== undefined ? <span class="opacity-60">{f.count}</span> : null}
					</button>
				)}
			</For>
		</fieldset>
	);
}
