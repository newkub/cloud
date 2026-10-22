export interface SelectionState {
    readonly selectedRows: ReadonlySet<string | number>;
    readonly allSelected: boolean;
    readonly someSelected: boolean;
}
