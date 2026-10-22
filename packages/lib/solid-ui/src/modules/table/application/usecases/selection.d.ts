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
export declare function toggleRowSelection(input: ToggleRowSelectionInput): ToggleRowSelectionOutput;
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
export declare function toggleAllSelection(input: ToggleAllSelectionInput): ToggleAllSelectionOutput;
