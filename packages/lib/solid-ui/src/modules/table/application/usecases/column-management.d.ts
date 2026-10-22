import type { ColumnDef } from "../../domain/models";
export interface GetVisibleColumnsInput {
    readonly columns: ReadonlyArray<ColumnDef>;
}
export interface GetVisibleColumnsOutput {
    readonly visibleColumns: ReadonlyArray<ColumnDef>;
}
/**
 * Get only visible columns from column definitions
 */
export declare function getVisibleColumns(input: GetVisibleColumnsInput): GetVisibleColumnsOutput;
