/**
 * ComparisonTable — feature comparison grid (rows = features, columns = plans/options).
 */
import { For, type JSX, splitProps } from "solid-js";
import {
	type Elevation,
	elevationMap,
	type Radius,
	radiusMap,
	type SurfaceVariant,
	surfaceVariants,
} from "../lib/variants";

export type ComparisonValue = boolean | string | JSX.Element;

export interface ComparisonColumn {
	key: string;
	label: string;
	/** Emphasized (highlighted) column — e.g. the recommended plan. */
	highlight?: boolean;
}

export interface ComparisonRow {
	feature: string;
	/** Optional group header rows use `group: true`. */
	group?: boolean;
	values: Record<string, ComparisonValue>;
}

export interface ComparisonTableProps extends JSX.HTMLAttributes<HTMLDivElement> {
	columns: ComparisonColumn[];
	rows: ComparisonRow[];
	size?: "sm" | "md" | "lg";
	variant?: SurfaceVariant;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Render JSX value as-is instead of the boolean glyphs. */
	renderValue?: (value: ComparisonValue, column: ComparisonColumn, row: ComparisonRow) => JSX.Element;
}

const cellPad = { sm: "px-2 py-1.5 text-2xs", md: "px-3 py-2 text-xs", lg: "px-4 py-2.5 text-sm" } as const;

const Check = () => (
	<svg
		class="inline h-4 w-4 text-success"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		aria-hidden="true"
	>
		<path d="m5 13 4 4L19 7" stroke-linecap="round" stroke-linejoin="round" />
	</svg>
);
const Cross = () => (
	<svg
		class="inline h-4 w-4 text-muted-foreground/50"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		aria-hidden="true"
	>
		<path d="M18 6 6 18M6 6l12 12" stroke-linecap="round" />
	</svg>
);

export function ComparisonTable(props: ComparisonTableProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"columns",
		"rows",
		"size",
		"variant",
		"radius",
		"elevation",
		"renderValue",
	]);
	const renderCell = (v: ComparisonValue, col: ComparisonColumn, row: ComparisonRow): JSX.Element => {
		if (local.renderValue) return local.renderValue(v, col, row);
		if (typeof v === "boolean")
			return v ? (
				<>
					<Check />
					<span class="sr-only">Included</span>
				</>
			) : (
				<>
					<Cross />
					<span class="sr-only">Not included</span>
				</>
			);
		return v;
	};

	return (
		<div
			class={`solidui-comparison-table overflow-x-auto ${surfaceVariants[local.variant ?? "default"]} ${radiusMap[local.radius ?? "lg"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<table class="w-full border-collapse">
				<thead>
					<tr class="border-b border-border">
						<th
							class={`${cellPad[local.size ?? "md"]} text-left font-medium text-muted-foreground`}
							aria-label="Feature"
						/>
						<For each={local.columns}>
							{(col) => (
								<th
									class={`${cellPad[local.size ?? "md"]} text-center font-semibold ${
										col.highlight ? "bg-primary/5 text-primary" : "text-foreground"
									}`}
								>
									{col.label}
								</th>
							)}
						</For>
					</tr>
				</thead>
				<tbody>
					<For each={local.rows}>
						{(row) =>
							row.group ? (
								<tr>
									<th
										scope="rowgroup"
										colSpan={(local.columns ?? []).length + 1}
										class={`${cellPad[local.size ?? "md"]} border-b border-border/50 bg-muted/30 text-left font-semibold text-muted-foreground`}
									>
										{row.feature}
									</th>
								</tr>
							) : (
								<tr>
									<th
										scope="row"
										class={`${cellPad[local.size ?? "md"]} border-b border-border/50 text-left font-normal text-foreground`}
									>
										{row.feature}
									</th>
									<For each={local.columns}>
										{(col) => (
											<td
												class={`${cellPad[local.size ?? "md"]} border-b border-border/50 text-center ${
													col.highlight ? "bg-primary/5" : ""
												}`}
											>
												{renderCell(row.values[col.key], col, row)}
											</td>
										)}
									</For>
								</tr>
							)
						}
					</For>
				</tbody>
			</table>
		</div>
	);
}
