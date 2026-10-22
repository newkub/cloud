// Table Module - Row State Model
// Clean Architecture: Row state

export interface RowState {
	readonly selected: boolean;
	readonly expanded: boolean;
	readonly hovered: boolean;
	readonly disabled: boolean;
}
