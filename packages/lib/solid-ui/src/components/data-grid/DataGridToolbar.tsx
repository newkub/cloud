import type { RowData, Table } from "@tanstack/solid-table";
import { For, Show } from "solid-js";
import { Checkbox } from "../Checkbox";
import { Input } from "../Input";
import type { features } from "./table";

export interface DataGridToolbarProps<TData extends RowData> {
	table: Table<typeof features, TData>;
	filterable?: boolean;
	selectable?: boolean;
	hideable?: boolean;
}

/** Toolbar row: global filter input, selection count and the column-visibility menu. */
export function DataGridToolbar<TData extends RowData>(props: DataGridToolbarProps<TData>) {
	const leafCols = () => props.table.getAllLeafColumns();

	return (
		<div class="flex flex-wrap items-center gap-3 border-b border-border px-4 py-3">
			<Show when={props.filterable}>
				<Input
					type="search"
					placeholder="Filter all columns…"
					aria-label="Filter rows"
					class="h-8 max-w-xs"
					value={String(props.table.store.get().globalFilter ?? "")}
					onInput={(e) => props.table.setGlobalFilter(e.currentTarget.value)}
				/>
			</Show>
			<Show when={props.selectable}>
				<span class="text-xs text-muted-foreground" aria-live="polite">
					{props.table.getSelectedRowModel().rows.length} selected
				</span>
			</Show>
			<Show when={props.hideable}>
				<details class="relative ml-auto">
					<summary class="cursor-pointer list-none rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
						Columns
					</summary>
					<div class="absolute right-0 z-10 mt-1 flex min-w-40 flex-col gap-1 rounded-lg border border-border bg-popover p-2 shadow-md">
						<For each={leafCols().filter((c) => c.getCanHide())}>
							{(col) => (
								<div class="flex items-center gap-2 rounded px-1.5 py-1 text-xs hover:bg-muted">
									<Checkbox
										aria-label={`Toggle ${String(col.columnDef.header ?? col.id)} column`}
										checked={col.getIsVisible()}
										onChange={() => {
											col.toggleVisibility();
										}}
									/>
									<span>{String(col.columnDef.header ?? col.id)}</span>
								</div>
							)}
						</For>
					</div>
				</details>
			</Show>
		</div>
	);
}
