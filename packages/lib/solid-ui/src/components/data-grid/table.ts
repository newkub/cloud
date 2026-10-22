import {
	columnFilteringFeature,
	columnVisibilityFeature,
	createFilteredRowModel,
	createPaginatedRowModel,
	createSortedRowModel,
	globalFilteringFeature,
	rowPaginationFeature,
	rowSelectionFeature,
	rowSortingFeature,
	sortFn_alphanumeric,
	tableFeatures,
} from "@tanstack/solid-table";

/** TanStack feature bundle shared by the DataGrid table and its props type. */
export const features = tableFeatures({
	rowSortingFeature,
	rowPaginationFeature,
	columnFilteringFeature,
	globalFilteringFeature,
	rowSelectionFeature,
	columnVisibilityFeature,
	sortedRowModel: createSortedRowModel(),
	paginatedRowModel: createPaginatedRowModel(),
	filteredRowModel: createFilteredRowModel(),
	sortFns: { alphanumeric: sortFn_alphanumeric },
});
