/**
 * Data table with sorting and pagination
 */
import {
	type ColumnDef,
	createPaginatedRowModel,
	createSortedRowModel,
	createTable,
	FlexRender,
	type RowData,
	rowPaginationFeature,
	rowSortingFeature,
	sortFn_alphanumeric,
	tableFeatures,
} from "@tanstack/solid-table";
import { For, type JSX, mergeProps, Show, splitProps } from "solid-js";
import { type SurfaceVariant, surfaceVariants } from "../lib/variants";
import { Button } from "./Button";

const variantMap: Record<SurfaceVariant, string> = {
	...surfaceVariants,
	default: "border-border bg-card text-card-foreground shadow-sm",
};

const cellPadding: Record<"sm" | "md" | "lg", string> = {
	sm: "px-3 py-2",
	md: "px-4 py-3",
	lg: "px-6 py-4",
};

export interface DataTableProps<TData extends RowData = RowData> {
	data?: TData[];
	columns?: ColumnDef<typeof features, TData, unknown>[];
	pageSize?: number;
	sortable?: boolean;
	paginate?: boolean;
	variant?: SurfaceVariant;
	size?: "sm" | "md" | "lg";
	class?: string;
	children?: JSX.Element;
}

const features = tableFeatures({
	rowSortingFeature,
	rowPaginationFeature,
	sortedRowModel: createSortedRowModel(),
	paginatedRowModel: createPaginatedRowModel(),
	sortFns: { alphanumeric: sortFn_alphanumeric },
});

function sortIcon(state: "asc" | "desc" | false) {
	if (state === "asc") return "↑";
	if (state === "desc") return "↓";
	return "⇅";
}

export function DataTable<TData extends RowData>(props: DataTableProps<TData>) {
	const merged = mergeProps({ sortable: true, paginate: true, pageSize: 10 }, props);
	const [local, rest] = splitProps(merged, [
		"class",
		"data",
		"columns",
		"pageSize",
		"sortable",
		"paginate",
		"variant",
		"size",
		"children",
	]);

	const table = createTable<typeof features, TData>({
		features,
		columns: local.columns ?? [],
		get data() {
			return local.data ?? [];
		},
		initialState: {
			pagination: {
				pageIndex: 0,
				pageSize: local.pageSize,
			},
		},
	});

	const className = () =>
		["w-full rounded-xl border", variantMap[local.variant ?? "default"], local.class ?? ""].filter(Boolean).join(" ");

	const cellPad = () => cellPadding[local.size ?? "md"];

	return (
		<div class={className()} {...rest}>
			<div class="overflow-x-auto">
				<table class="w-full text-sm">
					<thead class="bg-muted">
						<For each={table.getHeaderGroups()}>
							{(headerGroup) => (
								<tr>
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
									<td
										role="status"
										class={`${cellPad()} text-center text-muted-foreground`}
										colSpan={table.getAllColumns().length}
									>
										No data
									</td>
								</tr>
							}
						>
							<For each={table.getRowModel().rows}>
								{(row) => (
									<tr class="hover:bg-muted/50">
										<For each={row.getAllCells()}>
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
