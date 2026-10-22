import type { FilterState, PaginationState, SortState } from "../../domain/models";
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
export declare function processTableData<T>(input: ProcessTableDataInput<T>): ProcessTableDataOutput<T>;
