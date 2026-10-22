/**
 * TreeTable — table with expandable nested rows.
 */
import { createSignal, For, type JSX, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface TreeTableColumn<T = Record<string, unknown>> {
	/** Key read from each row, or a custom render. */
	key: keyof T | string;
	header: string;
	/** Column width hint (CSS). */
	width?: string;
	render?: (row: T) => JSX.Element;
}

export interface TreeTableRow {
	id: string;
	children?: TreeTableRow[];
	[key: string]: unknown;
}

export interface TreeTableProps extends JSX.HTMLAttributes<HTMLDivElement> {
	columns: TreeTableColumn[];
	rows: TreeTableRow[];
	/** Initially expanded row ids. */
	defaultExpanded?: string[];
	/** Indent per depth level (px). @default 16 */
	indent?: number;
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	/** Zebra striping on body rows. */
	striped?: boolean;
}

const cellPad = { sm: "px-2 py-1 text-xs", md: "px-3 py-2 text-sm", lg: "px-4 py-2.5 text-base" } as const;

export function TreeTable(props: TreeTableProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"columns",
		"rows",
		"defaultExpanded",
		"indent",
		"size",
		"radius",
		"elevation",
		"striped",
	]);
	const [expanded, setExpanded] = createSignal(new Set(local.defaultExpanded ?? []));
	const toggle = (id: string) =>
		setExpanded((s) => {
			const next = new Set(s);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});

	const renderRows = (rows: TreeTableRow[], depth: number): JSX.Element =>
		rows.map((row, i) => {
			const hasKids = (row.children?.length ?? 0) > 0;
			const open = expanded().has(row.id);
			return (
				<>
					<tr class={local.striped && i % 2 === 1 ? "bg-muted/30" : undefined}>
						<For each={local.columns}>
							{(col, ci) => (
								<td
									class={`border-b border-border/50 ${cellPad[local.size ?? "md"]}`}
									style={col.width ? { width: col.width } : undefined}
								>
									{ci() === 0 ? (
										<span
											class="flex items-center gap-1"
											style={{ "padding-left": `${depth * (local.indent ?? 16)}px` }}
										>
											{hasKids ? (
												<button
													type="button"
													class="-m-2 flex h-9 w-9 items-center justify-center rounded text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
													aria-expanded={open}
													aria-label={open ? "Collapse row" : "Expand row"}
													onClick={() => toggle(row.id)}
												>
													<svg
														class={`h-3 w-3 motion-safe:transition-transform ${open ? "rotate-90" : ""}`}
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														stroke-width="2"
														aria-hidden="true"
													>
														<path d="m9 6 6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
													</svg>
												</button>
											) : (
												<span class="-m-2 h-9 w-9" aria-hidden="true" />
											)}
											{col.render ? col.render(row) : String(row[col.key] ?? "")}
										</span>
									) : col.render ? (
										col.render(row)
									) : (
										String(row[col.key] ?? "")
									)}
								</td>
							)}
						</For>
					</tr>
					{hasKids && open ? renderRows(row.children ?? [], depth + 1) : null}
				</>
			);
		});

	return (
		<div
			class={`solidui-tree-table overflow-x-auto border border-border bg-surface ${radiusMap[local.radius ?? "lg"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
			{...rest}
		>
			<table class="w-full border-collapse">
				<thead>
					<tr>
						<For each={local.columns}>
							{(col) => (
								<th
									class={`border-b border-border text-left font-medium text-muted-foreground ${cellPad[local.size ?? "md"]}`}
									style={col.width ? { width: col.width } : undefined}
								>
									{col.header}
								</th>
							)}
						</For>
					</tr>
				</thead>
				<tbody>{renderRows(local.rows ?? [], 0)}</tbody>
			</table>
		</div>
	);
}
