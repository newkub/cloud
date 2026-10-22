import type { ColumnDef } from "../models";
export declare function getVisibleColumns(columns: ColumnDef[]): ColumnDef[];
export declare function getSortableColumns(columns: ColumnDef[]): ColumnDef[];
export declare function getFilterableColumns(columns: ColumnDef[]): ColumnDef[];
export declare function getColumnByKey(columns: ColumnDef[], key: string): ColumnDef | undefined;
