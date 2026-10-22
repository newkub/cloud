// Table Module - Selection Model
// Clean Architecture: Selection state

export interface SelectionState {
	readonly selectedRows: ReadonlySet<string | number>;
	readonly allSelected: boolean;
	readonly someSelected: boolean;
}
