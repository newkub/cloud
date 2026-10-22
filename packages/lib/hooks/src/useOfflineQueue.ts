import { type Accessor, createSignal, onCleanup, onMount } from "solid-js";

/** A deferred async action — invoked with no arguments when the queue flushes */
export type QueuedTask = () => Promise<unknown>;

export interface OfflineQueueState {
	/** Tasks still waiting to run, in enqueue order */
	queue: Accessor<readonly QueuedTask[]>;
	/** Number of tasks waiting to run */
	pending: Accessor<number>;
	/** Append a task — starts flushing immediately when online */
	enqueue: (fn: QueuedTask) => void;
	/** Run queued tasks in order while online — a failed task is re-queued at the front */
	flush: () => Promise<void>;
}

/**
 * Queue async tasks for when the browser comes back online — `enqueue` while
 * offline stacks work, and the queue drains automatically on the `online`
 * window event (or immediately when already online). Tasks run sequentially
 * in enqueue order; a rejected task is restored to the front of the queue so
 * ordering is preserved for the next flush. SSR-safe: reports "online" when
 * `navigator` is missing.
 *
 * @returns `{ queue, pending, enqueue, flush }`
 *
 * @example
 * const outbox = useOfflineQueue();
 * outbox.enqueue(() => api.postMessage(draft));
 * <Badge count={outbox.pending()} label="queued" />
 */
export function useOfflineQueue(): OfflineQueueState {
	const [queue, setQueue] = createSignal<readonly QueuedTask[]>([]);
	let flushing = false;

	const online = () => (typeof navigator === "undefined" ? true : navigator.onLine);

	const flush = async () => {
		if (flushing) return;
		flushing = true;
		try {
			while (queue().length > 0 && online()) {
				const [task] = queue();
				if (!task) break;
				setQueue((q) => q.slice(1));
				try {
					await task();
				} catch {
					setQueue((q) => [task, ...q]);
					break;
				}
			}
		} finally {
			flushing = false;
		}
	};

	onMount(() => {
		const up = () => void flush();
		window.addEventListener("online", up);
		onCleanup(() => window.removeEventListener("online", up));
	});

	return {
		queue,
		pending: () => queue().length,
		enqueue: (fn) => {
			setQueue((q) => [...q, fn]);
			if (online()) void flush();
		},
		flush,
	};
}
