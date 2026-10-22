import { type Accessor, createSignal, onCleanup } from "solid-js";

export interface BatchOptions<T> {
	/** Flush this many ms after the first item of a batch. @default 200 */
	window?: number;
	/** Flush immediately once this many items are buffered. @default 20 */
	size?: number;
	/** Receives each flushed batch */
	onBatch?: (items: T[]) => void;
}

export interface BatchState<T> {
	/** Buffer an item — starts the window timer on the first item */
	add: (item: T) => void;
	/** Emit the buffered items immediately (no-op when empty) */
	flush: () => void;
	/** Items waiting for the next flush */
	pending: Accessor<number>;
}

/**
 * Collect items into batches — flushes when `size` items accumulate or
 * `window` ms pass after the first item. Buffered items are flushed on unmount.
 *
 * @param options — `window` debounce ms, `size` eager-flush threshold, `onBatch` callback
 * @returns `{ add, flush, pending }`
 *
 * @example
 * const queue = useBatch<LogEvent>({ window: 500, size: 50, onBatch: postBatch });
 * events.forEach(queue.add);
 */
export function useBatch<T>(options?: BatchOptions<T>): BatchState<T> {
	const [pending, setPending] = createSignal(0);
	let buffer: T[] = [];
	let timer: ReturnType<typeof setTimeout> | undefined;
	const windowMs = options?.window ?? 200;
	const size = options?.size ?? 20;

	const flush = () => {
		clearTimeout(timer);
		timer = undefined;
		if (!buffer.length) return;
		const items = buffer;
		buffer = [];
		setPending(0);
		options?.onBatch?.(items);
	};

	const add = (item: T) => {
		buffer.push(item);
		setPending(buffer.length);
		if (buffer.length >= size) {
			flush();
			return;
		}
		if (timer === undefined && windowMs > 0) timer = setTimeout(flush, windowMs);
	};

	onCleanup(flush);

	return { add, flush, pending };
}
