// Column Management Use Case
import type { ColumnDef } from "../../domain/models";

export interface GetVisibleColumnsInput {
	readonly columns: ReadonlyArray<ColumnDef>;
}

export interface GetVisibleColumnsOutput {
	readonly visibleColumns: ReadonlyArray<ColumnDef>;
}

/**
 * Get only visible columns from column definitions
 */
export function getVisibleColumns(input: GetVisibleColumnsInput): GetVisibleColumnsOutput {
	const { columns } = input;
	const visibleColumns = columns.filter((col) => !col.hidden);
	return { visibleColumns };
}
