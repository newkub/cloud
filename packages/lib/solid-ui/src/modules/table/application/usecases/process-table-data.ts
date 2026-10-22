// Table Data Processing Use Case
import type { FilterState, PaginationState, SortState } from "../../domain/models";
import { applyGlobalFilter, filterData, paginateData, sortData } from "../../domain/operations";

export interface ProcessTableDataInput<T> {
	readonly data: ReadonlyArray<T>;
	readonly filters: ReadonlyArray<FilterState>;
	readonly sort: SortState | null;
	readonly globalFilter: string;
	readonly pagination: PaginationState;
}

export interface ProcessTableDataOutput<T> {
	readonly filteredData: ReadonlyArray<T>;
	readonly sortedData: ReadonlyArray<T>;
	readonly paginatedData: ReadonlyArray<T>;
}

/**
 * Process table data through the full pipeline: filter -> sort -> paginate
 * This is a pure function that orchestrates domain operations
 */
export function processTableData<T>(input: ProcessTableDataInput<T>): ProcessTableDataOutput<T> {
	const { data, filters, sort, globalFilter, pagination } = input;

	// Step 1: Apply global filter
	const globalFiltered = applyGlobalFilter([...data], globalFilter);

	// Step 2: Apply column filters
	const filtered = filterData(globalFiltered, [...filters]);

	// Step 3: Apply sorting
	const sorted = sortData(filtered, sort);

	// Step 4: Apply pagination
	const paginated = paginateData(sorted, pagination.page, pagination.pageSize);

	return {
		filteredData: filtered,
		sortedData: sorted,
		paginatedData: paginated,
	};
}
