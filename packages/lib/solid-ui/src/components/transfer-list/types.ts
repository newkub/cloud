/**
 * TransferList item model, UI-text overrides and shared helpers.
 */

export interface TransferItem {
	id: string;
	label: string;
	/** Extra line under the label. */
	description?: string;
	disabled?: boolean;
}

/** UI text overrides for TransferList. */
export interface TransferListLabels {
	available?: string;
	selected?: string;
	/** Search box placeholder. @default "Filter…" */
	filterPlaceholder?: string;
	/** Empty-list texts (shown when a filtered panel has no rows). */
	emptyAvailable?: string;
	emptySelected?: string;
	/** Select-all header checkbox label. @default "Select all" */
	selectAll?: string;
	moveRight?: string;
	moveLeft?: string;
	moveAllRight?: string;
	moveAllLeft?: string;
}

export const textSize = { sm: "text-2xs", md: "text-xs", lg: "text-sm" } as const;

/** Merge legacy `titles` and `labels` overrides over the built-in UI text. */
export function resolveLabels(
	titles: { available?: string; selected?: string } | undefined,
	labels: TransferListLabels | undefined,
): Required<TransferListLabels> {
	return {
		available: titles?.available ?? "Available",
		selected: titles?.selected ?? "Selected",
		filterPlaceholder: "Filter…",
		emptyAvailable: "No items",
		emptySelected: "No items selected",
		selectAll: "Select all",
		moveRight: "Move selected right",
		moveLeft: "Move selected left",
		moveAllRight: "Move all right",
		moveAllLeft: "Move all left",
		...labels,
	};
}

/** Case-insensitive label filter — returns `items` untouched when `q` is blank. */
export function filterItems(items: TransferItem[], q: string): TransferItem[] {
	return q ? items.filter((i) => i.label.toLowerCase().includes(q.toLowerCase())) : items;
}
