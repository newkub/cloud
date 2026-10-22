// Table Module - Sorting Models
// Clean Architecture: Sorting state and configuration

export interface SortState {
	readonly column: string;
	readonly direction: SortDirection;
}

export type SortDirection = "asc" | "desc" | null;

export interface SortableConfig {
	readonly multiSort?: boolean;
	readonly initialSort?: ReadonlyArray<SortState>;
}
