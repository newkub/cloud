// Table Module - Table Config Model
// Clean Architecture: Table configuration type

export interface TableConfig<T = Readonly<Record<string, unknown>>> {
	readonly data: ReadonlyArray<T>;
	readonly columns: ReadonlyArray<import("./columns").ColumnDef>;
	readonly rowKey: keyof T | ((row: T) => string | number);
	readonly selectable?: boolean;
	readonly multiSelect?: boolean;
	readonly hoverable?: boolean;
	readonly striped?: boolean;
	readonly bordered?: boolean;
	readonly compact?: boolean;
	readonly fixedHeader?: boolean;
	readonly maxHeight?: string;
	readonly pageSize?: number;
	readonly pageSizes?: ReadonlyArray<number>;
	readonly showPagination?: boolean;
	readonly showPageSizeSelector?: boolean;
	readonly showPageInfo?: boolean;
	readonly total?: number;
}
