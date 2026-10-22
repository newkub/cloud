// Table Domain Operations - Data Processing

import type { FilterOperator, FilterState, SortState } from "../models";

// Apply filter to a single value
export const applyFilter = (value: unknown, operator: FilterOperator, filterValue: unknown): boolean => {
	switch (operator) {
		case "eq":
			return value === filterValue;
		case "neq":
			return value !== filterValue;
		case "gt":
			return (value as number) > (filterValue as number);
		case "gte":
			return (value as number) >= (filterValue as number);
		case "lt":
			return (value as number) < (filterValue as number);
		case "lte":
			return (value as number) <= (filterValue as number);
		case "contains":
			return String(value).toLowerCase().includes(String(filterValue).toLowerCase());
		case "startsWith":
			return String(value).toLowerCase().startsWith(String(filterValue).toLowerCase());
		case "endsWith":
			return String(value).toLowerCase().endsWith(String(filterValue).toLowerCase());
		case "in":
			return (filterValue as unknown[]).includes(value);
		case "notIn":
			return !(filterValue as unknown[]).includes(value);
		case "isNull":
			return value === null || value === undefined;
		case "isNotNull":
			return value !== null && value !== undefined;
		default:
			return true;
	}
};

// Filter data based on filter states
export function filterData<T>(data: T[], filters: FilterState[]): T[] {
	if (filters.length === 0) return data;

	return data.filter((row) => {
		return filters.every((filter) => {
			const value = (row as Record<string, unknown>)[filter.column];
			return applyFilter(value, filter.operator, filter.value);
		});
	});
}

// Apply global search filter
export function applyGlobalFilter<T>(data: T[], searchTerm: string): T[] {
	if (!searchTerm) return data;

	const term = searchTerm.toLowerCase();
	return data.filter((row) => {
		return Object.values(row as Record<string, unknown>).some((value) => {
			if (value === null || value === undefined) return false;
			return String(value).toLowerCase().includes(term);
		});
	});
}

// Sort data based on sort state
export function sortData<T>(data: T[], sort: SortState | null): T[] {
	if (!sort) return data;

	const { column, direction } = sort;
	const sorted = [...data];

	sorted.sort((a, b) => {
		const aVal = (a as Record<string, unknown>)[column];
		const bVal = (b as Record<string, unknown>)[column];

		if (aVal === bVal) return 0;
		if (aVal === null || aVal === undefined) return 1;
		if (bVal === null || bVal === undefined) return -1;

		let comparison = 0;
		if (typeof aVal === "string" && typeof bVal === "string") {
			comparison = aVal.localeCompare(bVal);
		} else if (typeof aVal === "number" && typeof bVal === "number") {
			comparison = aVal - bVal;
		} else {
			comparison = String(aVal).localeCompare(String(bVal));
		}

		return direction === "asc" ? comparison : -comparison;
	});

	return sorted;
}

// Paginate data
export function paginateData<T>(data: T[], page: number, pageSize: number): T[] {
	const start = (page - 1) * pageSize;
	return data.slice(start, start + pageSize);
}
