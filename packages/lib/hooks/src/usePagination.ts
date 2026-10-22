import { type Accessor, createMemo, createSignal } from "solid-js";
import type { MaybeAccessor } from "./useEventListener";

const read = <T>(v: MaybeAccessor<T>): T => (typeof v === "function" ? (v as Accessor<T>)() : v);

export interface PaginationOptions {
	/** Total item count — value or accessor */
	total: MaybeAccessor<number>;
	/** Items per page. @default 10 */
	pageSize?: MaybeAccessor<number>;
	/** Starting page, 1-based — clamped. @default 1 */
	initial?: number;
}

export interface PaginationControls {
	/** Current page, 1-based — always within `1 .. totalPages` */
	page: Accessor<number>;
	/** Jump to a page — clamped */
	setPage: (page: number) => void;
	/** Next page — clamps on the last */
	next: () => void;
	/** Previous page — clamps on the first */
	prev: () => void;
	/** Page count — at least 1 */
	totalPages: Accessor<number>;
	/** First item index on this page, 1-based — 0 when `total` is 0 */
	start: Accessor<number>;
	/** Last item index on this page, 1-based */
	end: Accessor<number>;
	/** Slice an array to the current page */
	pageItems: <T>(items: T[]) => T[];
}

/**
 * 1-based pagination — `page`/`setPage` clamp to `1 .. totalPages`, `start`/
 * `end` expose the visible item range for "showing X–Y of Z" labels, and
 * `pageItems(items)` slices a full list to the current page. `total` and
 * `pageSize` accept accessors so the page count stays reactive.
 *
 * @param options — `total`, `pageSize`, `initial`
 * @returns `{ page, setPage, next, prev, totalPages, start, end, pageItems }`
 *
 * @example
 * const p = usePagination({ total: () => rows().length, pageSize: 8 });
 * <For each={p.pageItems(rows())}>{(r) => <Row r={r} />}</For>
 * <button onClick={p.prev} disabled={p.page() === 1}>prev</button>
 * <span>{p.start()}–{p.end()} / {rows().length}</span>
 * <button onClick={p.next} disabled={p.page() === p.totalPages()}>next</button>
 */
export function usePagination(options: PaginationOptions): PaginationControls {
	const totalPages = createMemo(() =>
		Math.max(1, Math.ceil(read(options.total) / Math.max(1, read(options.pageSize ?? 10)))),
	);
	const clamp = (n: number) => Math.min(Math.max(1, Math.round(n)), totalPages());
	const [page, setPageRaw] = createSignal(1);

	const setPage = (n: number) => setPageRaw(clamp(n));
	setPage(options.initial ?? 1);

	const start = createMemo(() => {
		const total = read(options.total);
		if (total <= 0) return 0;
		const size = Math.max(1, read(options.pageSize ?? 10));
		return (clamp(page()) - 1) * size + 1;
	});
	const end = createMemo(() =>
		Math.min(clamp(page()) * Math.max(1, read(options.pageSize ?? 10)), read(options.total)),
	);

	return {
		page: createMemo(() => clamp(page())),
		setPage,
		next: () => setPage(page() + 1),
		prev: () => setPage(page() - 1),
		totalPages,
		start,
		end,
		pageItems: (items) => (read(options.total) <= 0 ? [] : items.slice(start() - 1, end())),
	};
}
