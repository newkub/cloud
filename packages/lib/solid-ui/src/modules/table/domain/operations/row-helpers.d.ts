export declare function getRowKey<T>(row: T, rowKey: keyof T | ((row: T) => string | number)): string | number;
export declare function isRowSelected(key: string | number, selectedRows: Set<string | number>): boolean;
export declare function areAllRowsSelected(keys: (string | number)[], selectedRows: Set<string | number>): boolean;
export declare function areSomeRowsSelected(keys: (string | number)[], selectedRows: Set<string | number>): boolean;
