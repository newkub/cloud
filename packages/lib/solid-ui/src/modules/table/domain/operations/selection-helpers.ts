// Table Domain Operations - Selection Helpers

export function toggleRowSelection(key: string | number, selectedRows: Set<string | number>): Set<string | number> {
	const newSet = new Set(selectedRows);
	if (newSet.has(key)) {
		newSet.delete(key);
	} else {
		newSet.add(key);
	}
	return newSet;
}

export function toggleAllSelection(
	keys: (string | number)[],
	selectedRows: Set<string | number>,
): Set<string | number> {
	const allSelected = keys.every((key) => selectedRows.has(key));
	const newSet = new Set<string | number>();

	if (!allSelected) {
		keys.forEach((key) => void newSet.add(key));
	}

	return newSet;
}

export function clearAllSelections(): Set<string | number> {
	return new Set();
}
