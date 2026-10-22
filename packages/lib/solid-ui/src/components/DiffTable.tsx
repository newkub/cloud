/**
 * DiffTable — compares two row sets and marks each row added/removed/changed.
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

export type DiffRowStatus = "unchanged" | "added" | "removed" | "changed";

export interface DiffRow {
	key: string;
	status: DiffRowStatus;
	/** Cell values keyed by column. */
	values: Record<string, unknown>;
	/** For "changed" rows — previous values per changed cell. */
	previous?: Record<string, unknown>;
}

export interface DiffTableColumn {
	key: string;
	label: string;
	render?: (value: unknown, row: DiffRow) => JSX.Element;
}

export interface DiffTableProps extends JSX.HTMLAttributes<HTMLDivElement> {
	columns: DiffTableColumn[];
	rows: DiffRow[];
	/** Colored row backgrounds per status. @default true */
	highlight?: boolean;
	/** Show old → new for changed cells. @default true */
	showOldValues?: boolean;
	/** Status column on the left. @default true */
	showStatus?: boolean;
	size?: "sm" | "md" | "lg";
	variant?: SurfaceVariant;
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
}

const cellPad = { sm: "px-2 py-1 text-2xs", md: "px-3 py-1.5 text-xs", lg: "px-4 py-2 text-sm" } as const;
const rowCls: Record<DiffRowStatus, string> = {
	unchanged: "",
	added: "bg-success/10",
	removed: "bg-destructive/10 line-through decoration-destructive/40",
	changed: "bg-warning/10",
};
const badge: Record<DiffRowStatus, { cls: string; label: string }> = {
	unchanged: { cls: "text-muted-foreground", label: "·" },
	added: { cls: "text-success", label: "+" },
	removed: { cls: "text-destructive", label: "−" },
	changed: { cls: "text-warning", label: "~" },
};

export function DiffTable(props: DiffTableProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"columns",
		"rows",
		"highlight",
		"showOldValues",
		"showStatus",
		"size",
		"variant",
		"radius",
		"elevation",
	]);
	const cell = (row: DiffRow, col: DiffTableColumn) => {
		const value = row.values[col.key];
		const old = row.previous?.[col.key];
		const changed = row.status === "changed" && old !== undefined && old !== value;
		return (
			<td class={`border-b border-border/50 ${cellPad[local.size ?? "md"]}`}>
				{col.render ? (
					col.render(value, row)
				) : (
					<>
						<Show when={changed && (local.showOldValues ?? true)}>
							<span class="mr-1 text-destructive/70 line-through">{String(old)}</span>
							<span class="text-2xs text-muted-foreground">→</span>{" "}
						</Show>
						{String(value ?? "")}
					</>
				)}
			</td>
		);
	};

	return (
		<div
			class={`solidui-diff-table overflow-x-auto ${surfaceVariants[local.variant ?? "default"]} ${radiusMap[local.radius ?? "lg"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<table class="w-full border-collapse">
				<thead>
					<tr class="border-b border-border text-left text-muted-foreground">
						<Show when={local.showStatus ?? true}>
							<th class={`${cellPad[local.size ?? "md"]} w-6`} aria-label="Status" />
						</Show>
						<For each={local.columns}>
							{(col) => <th class={`${cellPad[local.size ?? "md"]} font-medium`}>{col.label}</th>}
						</For>
					</tr>
				</thead>
				<tbody>
					<For each={local.rows}>
						{(row) => (
							<tr class={(local.highlight ?? true) ? rowCls[row.status] : ""}>
								<Show when={local.showStatus ?? true}>
									<td class={`${cellPad[local.size ?? "md"]} text-center font-mono ${badge[row.status].cls}`}>
										<span aria-hidden="true">{badge[row.status].label}</span>
										<span class="sr-only">{row.status}</span>
									</td>
								</Show>
								<For each={local.columns}>{(col) => cell(row, col)}</For>
							</tr>
						)}
					</For>
				</tbody>
			</table>
		</div>
	);
}
