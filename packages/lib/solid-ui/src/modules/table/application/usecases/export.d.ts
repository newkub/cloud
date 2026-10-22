import type { ColumnDef } from "../../domain/models";
export interface ExportToCSVInput<T> {
    readonly data: ReadonlyArray<T>;
    readonly columns: ReadonlyArray<ColumnDef>;
}
export interface ExportToCSVOutput {
    readonly csv: string;
}
/**
 * Export table data to CSV format
 */
export declare function exportToCSV<T>(input: ExportToCSVInput<T>): ExportToCSVOutput;
export interface ExportToJSONInput<T> {
    readonly data: ReadonlyArray<T>;
    readonly pretty?: boolean;
}
export interface ExportToJSONOutput {
    readonly json: string;
}
/**
 * Export table data to JSON format
 */
export declare function exportToJSON<T>(input: ExportToJSONInput<T>): ExportToJSONOutput;
