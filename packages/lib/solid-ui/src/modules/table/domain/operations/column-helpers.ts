// Table Domain Operations - Column Helpers

import type { ColumnDef } from "../models";

export function getVisibleColumns(columns: ColumnDef[]): ColumnDef[] {
	return columns.filter((col) => !col.hidden);
}

export function getSortableColumns(columns: ColumnDef[]): ColumnDef[] {
	return columns.filter((col) => col.sortable);
}

export function getFilterableColumns(columns: ColumnDef[]): ColumnDef[] {
	return columns.filter((col) => col.filterable);
}

export function getColumnByKey(columns: ColumnDef[], key: string): ColumnDef | undefined {
	return columns.find((col) => col.key === key);
}
