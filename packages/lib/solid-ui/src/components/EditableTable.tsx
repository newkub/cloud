/**
 * EditableTable — table whose cells become inputs on click.
 */
import { createSignal, For, type JSX, Show, splitProps } from "solid-js";
import { type Elevation, elevationMap, type Radius, radiusMap } from "../lib/variants";

export interface EditableTableColumn {
	key: string;
	header: string;
	/** Whether cells in this column are editable. @default true */
	editable?: boolean;
	/** Input type for the cell editor. @default "text" */
	inputType?: "text" | "number";
	width?: string;
	render?: (value: unknown, row: Record<string, unknown>) => JSX.Element;
}

export interface EditableTableProps extends JSX.HTMLAttributes<HTMLDivElement> {
	columns: EditableTableColumn[];
	rows: Record<string, unknown>[];
	/** Called when a cell edit is committed (blur or Enter). */
	onCellChange?: (rowIndex: number, key: string, value: string) => void;
	/** Row-level edit guard. */
	rowEditable?: (row: Record<string, unknown>, index: number) => boolean;
	size?: "sm" | "md" | "lg";
	/** Corner radius. */
	radius?: Radius;
	/** Shadow elevation. */
	elevation?: Elevation;
	striped?: boolean;
}

const cellPad = { sm: "px-2 py-1 text-xs", md: "px-3 py-2 text-sm", lg: "px-4 py-2.5 text-base" } as const;

export function EditableTable(props: EditableTableProps) {
	const [local, rest] = splitProps(props, [
		"class",
		"columns",
		"rows",
		"onCellChange",
		"rowEditable",
		"size",
		"radius",
		"elevation",
		"striped",
	]);
	const [editing, setEditing] = createSignal<{ row: number; key: string } | null>(null);
	const canEdit = (row: Record<string, unknown>, ri: number, col: EditableTableColumn) =>
		(col.editable ?? true) && (local.rowEditable?.(row, ri) ?? true);

	const commit = (ri: number, key: string, el: HTMLInputElement) => {
		local.onCellChange?.(ri, key, el.value);
		setEditing(null);
	};

	return (
		<div
			class={`solidui-editable-table overflow-x-auto border border-border bg-surface ${radiusMap[local.radius ?? "lg"]} ${local.elevation ? elevationMap[local.elevation] : ""} ${local.class ?? ""}`.trim()}
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
				<tbody>
					<For each={local.rows}>
						{(row, ri) => (
							<tr class={local.striped && ri() % 2 === 1 ? "bg-muted/30" : undefined}>
								<For each={local.columns}>
									{(col) => {
										const isEditing = () => editing()?.row === ri() && editing()?.key === col.key;
										return (
											<td
												class={`border-b border-border/50 ${cellPad[local.size ?? "md"]} ${
													canEdit(row, ri(), col) && !isEditing()
														? "cursor-text hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
														: ""
												}`.trim()}
												tabIndex={canEdit(row, ri(), col) && !isEditing() ? 0 : undefined}
												onClick={() => {
													if (canEdit(row, ri(), col)) setEditing({ row: ri(), key: col.key });
												}}
												onKeyDown={(e) => {
													if ((e.key === "Enter" || e.key === "F2") && canEdit(row, ri(), col)) {
														setEditing({ row: ri(), key: col.key });
													}
												}}
											>
												<Show
													when={isEditing()}
													fallback={col.render ? col.render(row[col.key], row) : String(row[col.key] ?? "")}
												>
													<input
														type={col.inputType ?? "text"}
														class="w-full min-w-0 bg-transparent focus-visible:outline-none"
														aria-label={col.header}
														value={String(row[col.key] ?? "")}
														autofocus
														onBlur={(e) => commit(ri(), col.key, e.currentTarget)}
														onKeyDown={(e) => {
															if (e.key === "Enter") commit(ri(), col.key, e.currentTarget);
															if (e.key === "Escape") setEditing(null);
														}}
													/>
												</Show>
											</td>
										);
									}}
								</For>
							</tr>
						)}
					</For>
				</tbody>
			</table>
		</div>
	);
}
