// Table Domain Events
// Domain event types for table operations

import type { ColumnDef, PaginationState, SortState, TableConfig } from "../models";

export type TableEventType =
	| "columnSorted"
	| "columnFiltered"
	| "columnResized"
	| "columnMoved"
	| "columnHidden"
	| "columnShown"
	| "rowSelected"
	| "rowDeselected"
	| "allRowsSelected"
	| "allRowsDeselected"
	| "pageChanged"
	| "pageSizeChanged"
	| "dataLoaded"
	| "dataFiltered"
	| "dataSorted"
	| "tableRefreshed"
	| "tableReset";

export interface TableEventData {
	column?: ColumnDef;
	columnKey?: string;
	rowId?: string | number;
	rowIds?: (string | number)[];
	pagination?: PaginationState;
	sortState?: SortState;
	filterValue?: unknown;
	config?: TableConfig;
	totalCount?: number;
}

export interface TableEvent {
	type: TableEventType;
	data: TableEventData;
	timestamp: number;
}
