import type { FilterOperator, FilterState, SortState } from "../models";
export declare const applyFilter: (value: unknown, operator: FilterOperator, filterValue: unknown) => boolean;
export declare function filterData<T>(data: T[], filters: FilterState[]): T[];
export declare function applyGlobalFilter<T>(data: T[], searchTerm: string): T[];
export declare function sortData<T>(data: T[], sort: SortState | null): T[];
export declare function paginateData<T>(data: T[], page: number, pageSize: number): T[];
