// Table Domain Operations - Row Helpers

export function getRowKey<T>(row: T, rowKey: keyof T | ((row: T) => string | number)): string | number {
	if (typeof rowKey === "function") {
		return rowKey(row);
	}
	return row[rowKey] as string | number;
}

export function isRowSelected(key: string | number, selectedRows: Set<string | number>): boolean {
	return selectedRows.has(key);
}

export function areAllRowsSelected(keys: (string | number)[], selectedRows: Set<string | number>): boolean {
	return keys.every((key) => selectedRows.has(key));
}

export function areSomeRowsSelected(keys: (string | number)[], selectedRows: Set<string | number>): boolean {
	return keys.some((key) => selectedRows.has(key)) && !areAllRowsSelected(keys, selectedRows);
}
