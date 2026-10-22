// Table Domain Operations - Pure table logic
// This file re-exports all table operations from split modules

// Export column builders
export {
	actionsColumn,
	badgeColumn,
	boolColumn,
	customColumn,
	dateColumn,
	emailColumn,
	imageColumn,
	numberColumn,
	tagColumn,
	textColumn,
	urlColumn,
} from "./column-builders";
// Export column helpers
export {
	getColumnByKey,
	getFilterableColumns,
	getSortableColumns,
	getVisibleColumns,
} from "./column-helpers";

// Export data processing
export {
	applyFilter,
	applyGlobalFilter,
	filterData,
	paginateData,
	sortData,
} from "./data-processing";
// Export formatters
export {
	formatCurrency,
	formatDate,
	formatNumber,
	formatPercent,
} from "./formatters";
// Export pagination helpers
export {
	calculateTotalPages,
	getPageRange,
	isValidPage,
} from "./pagination-helpers";
// Export row helpers
export {
	areAllRowsSelected,
	areSomeRowsSelected,
	getRowKey,
	isRowSelected,
} from "./row-helpers";

// Export selection helpers
export {
	clearAllSelections,
	toggleAllSelection,
	toggleRowSelection,
} from "./selection-helpers";
