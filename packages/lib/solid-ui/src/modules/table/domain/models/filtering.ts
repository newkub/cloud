// Table Module - Filtering Models
// Clean Architecture: Filtering state and configuration

export interface FilterState {
	readonly column: string;
	readonly operator: import("./types").FilterOperator;
	readonly value: unknown;
}

export interface FilterableConfig {
	readonly globalFilter?: boolean;
	readonly filterPlaceholder?: string;
}
