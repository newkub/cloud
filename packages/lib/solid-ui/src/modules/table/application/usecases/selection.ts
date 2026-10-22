// Selection Use Case
export interface ToggleRowSelectionInput {
	readonly key: string | number;
	readonly selectedRows: ReadonlySet<string | number>;
}

export interface ToggleRowSelectionOutput {
	readonly selectedRows: ReadonlySet<string | number>;
}

/**
 * Toggle row selection state
 */
export function toggleRowSelection(input: ToggleRowSelectionInput): ToggleRowSelectionOutput {
	const { key, selectedRows } = input;
	const newSet = new Set(selectedRows);
	if (newSet.has(key)) {
		newSet.delete(key);
	} else {
		newSet.add(key);
	}
	return { selectedRows: newSet };
}

export interface ToggleAllSelectionInput {
	readonly keys: ReadonlyArray<string | number>;
	readonly selectedRows: ReadonlySet<string | number>;
}

export interface ToggleAllSelectionOutput {
	readonly selectedRows: ReadonlySet<string | number>;
}

/**
 * Toggle all rows selection state
 */
export function toggleAllSelection(input: ToggleAllSelectionInput): ToggleAllSelectionOutput {
	const { keys, selectedRows } = input;
	const allSelected = keys.every((key) => selectedRows.has(key));
	const newSet = new Set<string | number>();

	if (!allSelected) {
		keys.forEach((key) => void newSet.add(key));
	}

	return { selectedRows: newSet };
}
