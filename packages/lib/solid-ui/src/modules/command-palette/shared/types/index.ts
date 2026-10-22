/**
 * Shared Types - Common types used across the application
 */

// Result type for error handling
export type Result<T, E = Error> = { success: true; data: T } | { success: false; error: E };

// Option type for nullable handling
export type Option<T> = { _tag: "Some"; value: T } | { _tag: "None" };

// Helper functions for Option
export const Some = <T>(value: T): Option<T> => ({ _tag: "Some", value });
export const None = (): Option<never> => ({ _tag: "None" });

// Either type for error handling
export type Either<L, R> = { _tag: "Left"; left: L } | { _tag: "Right"; right: R };

// Helper functions for Either
export const Left = <L, R>(left: L): Either<L, R> => ({ _tag: "Left", left });
export const Right = <L, R>(right: R): Either<L, R> => ({
	_tag: "Right",
	right,
});

// AsyncEither for async operations
export type AsyncEither<L, R> = Promise<Either<L, R>>;

// Common domain events
export interface DomainEvent {
	readonly id: string;
	readonly timestamp: Date;
	readonly type: string;
}

// Pagination types
export interface Pagination {
	readonly page: number;
	readonly limit: number;
	readonly offset: number;
}

export interface PaginatedResult<T> {
	readonly items: readonly T[];
	readonly pagination: Pagination;
	readonly total: number;
}

// Search and filter types
export interface SearchQuery {
	readonly query: string;
	readonly filters?: readonly Record<string, unknown>[];
}

export interface SortOptions {
	readonly field: string;
	readonly direction: "asc" | "desc";
}

// Search highlight types
export interface HighlightRange {
	readonly start: number;
	readonly end: number;
}

export interface SearchHighlight {
	readonly text: string;
	readonly highlights: readonly HighlightRange[];
}
