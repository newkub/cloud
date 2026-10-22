/**
 * DataGrid - DataTable upgraded with a global filter, row selection and a
 * column-visibility toggle. Same TanStack foundation; opt-in features via
 * `filterable` / `selectable` / `hideable` props. The feature bundle lives in
 * `./data-grid/table`, the toolbar in `./data-grid/DataGridToolbar`.
 */
import { createTable, FlexRender, type RowData } from "@tanstack/solid-table";
import { For, mergeProps, Show, splitProps } from "solid-js";
import { Button } from "./Button";
import { Checkbox } from "./Checkbox";
import { DataGridToolbar } from "./data-grid/DataGridToolbar";
import { cellPadding, sortIcon, variantMap } from "./data-grid/styles";
import { features } from "./data-grid/table";
import type { DataGridProps } from "./data-grid/types";

export type { DataGridProps } from "./data-grid/types";

export function DataGrid<TData extends RowData>(props: DataGridProps<TData>) {
	const merged = mergeProps(
		{ sortable: true, paginate: true, pageSize: 10, filterable: true, hideable: true, selectable: false },
		props,
	);
	const [local, rest] = splitProps(merged, [
		"class",
		"data",
		"columns",
		"pageSize",
		"sortable",
		"paginate",
		"filterable",
		"selectable",
		"hideable",
		"variant",
		"size",
		"onSelectionChange",
		"children",
	]);

	const table = createTable<typeof features, TData>({
		features,
		columns: local.columns ?? [],
		get data() {
			return local.data ?? [];
		},
		initialState: {
			pagination: { pageIndex: 0, pageSize: local.pageSize },
		},
	});

	const className = () =>
		["w-full rounded-xl border", variantMap[local.variant ?? "default"], local.class ?? ""].filter(Boolean).join(" ");
	const cellPad = () => cellPadding[local.size ?? "md"];
	const visibleCount = () => table.getVisibleLeafColumns().length + (local.selectable ? 1 : 0);
	const selectedRows = () => table.getSelectedRowModel().rows.map((r) => r.original);

	const notifySelection = () => local.onSelectionChange?.(selectedRows());

	return (
		<div class={className()} {...rest}>
			<Show when={local.filterable || local.hideable}>
				<DataGridToolbar
					table={table}
					filterable={local.filterable}
					selectable={local.selectable}
					hideable={local.hideable}
				/>
			</Show>
			<div class="overflow-x-auto">
				<table class="w-full text-sm">
					<thead class="bg-muted">
						<For each={table.getHeaderGroups()}>
							{(headerGroup) => (
								<tr>
									<Show when={local.selectable}>
										<th class={`${cellPad()} w-10`}>
											<Checkbox
												aria-label="Select all rows"
												checked={table.getIsAllRowsSelected()}
												onChange={() => {
													table.toggleAllRowsSelected();
													notifySelection();
												}}
											/>
										</th>
									</Show>
									<For each={headerGroup.headers}>
										{(header) => (
											<th
												class={`${cellPad()} text-left`}
												aria-sort={
													local.sortable
														? header.column.getIsSorted() === "asc"
															? "ascending"
															: header.column.getIsSorted() === "desc"
																? "descending"
																: "none"
														: undefined
												}
											>
												<button
													type="button"
													disabled={!local.sortable}
													class="w-full bg-transparent p-0 text-left font-semibold text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
													classList={{
														"cursor-pointer select-none hover:text-primary": local.sortable,
													}}
													onClick={local.sortable ? header.column.getToggleSortingHandler() : undefined}
													aria-label={
														local.sortable ? `Sort by ${String(header.column.columnDef.header ?? "column")}` : undefined
													}
												>
													<span class="inline-flex items-center gap-1">
														<FlexRender header={header} />
														<Show when={local.sortable && header.column.getIsSorted()}>
															<span class="text-muted-foreground">{sortIcon(header.column.getIsSorted())}</span>
														</Show>
													</span>
												</button>
											</th>
										)}
									</For>
								</tr>
							)}
						</For>
					</thead>
					<tbody class="divide-y divide-border">
						<Show
							when={table.getRowModel().rows.length > 0}
							fallback={
								<tr>
									<td role="status" class={`${cellPad()} text-center text-muted-foreground`} colSpan={visibleCount()}>
										No data
									</td>
								</tr>
							}
						>
							<For each={table.getRowModel().rows}>
								{(row) => (
									<tr class="hover:bg-muted/50" classList={{ "bg-primary/5": local.selectable && row.getIsSelected() }}>
										<Show when={local.selectable}>
											<td class={`${cellPad()} w-10`}>
												<Checkbox
													aria-label="Select row"
													checked={row.getIsSelected()}
													onChange={() => {
														row.toggleSelected();
														notifySelection();
													}}
												/>
											</td>
										</Show>
										<For each={row.getVisibleCells()}>
											{(cell) => (
												<td class={`${cellPad()} align-top`}>
													<FlexRender cell={cell} />
												</td>
											)}
										</For>
									</tr>
								)}
							</For>
						</Show>
					</tbody>
				</table>
			</div>
			<Show when={local.paginate && table.getPageCount() > 1}>
				<div class="flex items-center justify-between border-t border-border px-4 py-3">
					<span class="text-xs text-muted-foreground">
						Page {table.store.get().pagination.pageIndex + 1} of {table.getPageCount()}
					</span>
					<div class="flex items-center gap-2">
						<Button
							variant="secondary"
							size="sm"
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
						>
							Previous
						</Button>
						<Button variant="secondary" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
							Next
						</Button>
					</div>
				</div>
			</Show>
			{local.children}
		</div>
	);
}
