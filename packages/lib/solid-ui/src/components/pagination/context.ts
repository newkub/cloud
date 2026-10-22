import { type Accessor, createContext, useContext } from "solid-js";

export interface PaginationContextValue {
	page: Accessor<number>;
	totalPages: Accessor<number>;
	setPage: (page: number) => void;
}

export const PaginationContext = createContext<PaginationContextValue>();

export function usePaginationContext(component: string): PaginationContextValue {
	const ctx = useContext(PaginationContext);
	if (!ctx) {
		throw new Error(`${component} must be used inside a Pagination.`);
	}
	return ctx;
}
