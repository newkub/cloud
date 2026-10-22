import { type Accessor, createSignal } from "solid-js";

export type UploadStatus = "queued" | "uploading" | "done" | "error";

export interface UploadItem<F = unknown, R = unknown> {
	/** Auto-assigned id — monotonically increasing */
	id: number;
	/** Payload passed to `options.upload` */
	file: F;
	/** Lifecycle state of this upload */
	status: UploadStatus;
	/** Progress fraction 0–1 reported by `onProgress` — `1` once done */
	progress: number;
	/** Resolved value of `upload` once `status === "done"` */
	result?: R;
	/** Rejection reason once `status === "error"` */
	error?: unknown;
}

export interface UploadQueueState<F, R> {
	/** All tracked uploads, in add order */
	items: Accessor<UploadItem<F, R>[]>;
	/** Enqueue one file (or many) — returns the assigned id(s); upload starts automatically */
	add: (file: F | F[]) => number | number[];
	/** Re-queue a `done`/`error` item — no-op while it is `uploading` */
	retry: (id: number) => void;
	/** Drop an item — in-flight uploads keep running but their result is discarded */
	remove: (id: number) => void;
	/** Drop every item — in-flight results are discarded */
	clear: () => void;
}

/**
 * File upload queue with bounded concurrency — `add` enqueues files and the
 * queue drains immediately, marking each item `uploading` → `done`/`error`
 * while `onProgress` updates the 0–1 `progress` fraction. `retry` re-queues
 * failed items, `remove`/`clear` drop them. SSR/jsdom-safe — nothing touches
 * the DOM or network beyond the supplied `upload` function.
 *
 * @param options — `upload(file, onProgress)` performs one upload and resolves
 * its result; `concurrency` caps simultaneous uploads. @default concurrency 3
 * @returns `{ items, add, retry, remove, clear }`
 *
 * @example
 * const up = useUploadQueue<File, string>({ upload: (f, p) => api.upload(f, p), concurrency: 2 });
 * <For each={up.items()}>{(i) => <progress value={i.progress} max={1} />}</For>
 */
export function useUploadQueue<F, R = unknown>(options: {
	/** Perform one upload — call `onProgress` with a 0–1 fraction, resolve the result */
	upload: (file: F, onProgress: (fraction: number) => void) => Promise<R>;
	/** Maximum simultaneous uploads. @default 3 */
	concurrency?: number;
}): UploadQueueState<F, R> {
	const [items, setItems] = createSignal<UploadItem<F, R>[]>([]);
	const limit = Math.max(1, options.concurrency ?? 3);
	let nextId = 0;

	const patch = (id: number, partial: Partial<UploadItem<F, R>>) =>
		setItems((list) => list.map((i) => (i.id === id ? { ...i, ...partial } : i)));

	const start = (id: number) => {
		const item = items().find((i) => i.id === id);
		if (item?.status !== "queued") return;
		patch(id, { status: "uploading", error: undefined });
		options
			.upload(item.file, (fraction) => {
				const current = items().find((i) => i.id === id);
				if (current?.status === "uploading") patch(id, { progress: Math.min(1, Math.max(0, fraction)) });
			})
			.then(
				(result) => patch(id, { status: "done", progress: 1, result }),
				(error) => patch(id, { status: "error", error }),
			)
			.finally(pump);
	};

	const pump = () => {
		const list = items();
		const active = list.filter((i) => i.status === "uploading").length;
		const slots = limit - active;
		if (slots <= 0) return;
		for (const item of list.filter((i) => i.status === "queued").slice(0, slots)) start(item.id);
	};

	return {
		items,
		add: (file) => {
			const batch = (Array.isArray(file) ? file : [file]).map(
				(f): UploadItem<F, R> => ({ id: nextId++, file: f, status: "queued", progress: 0 }),
			);
			setItems((list) => [...list, ...batch]);
			pump();
			return Array.isArray(file) ? batch.map((b) => b.id) : (batch[0]?.id ?? -1);
		},
		retry: (id) => {
			const item = items().find((i) => i.id === id);
			if (!item || item.status === "uploading" || item.status === "queued") return;
			patch(id, { status: "queued", progress: 0, error: undefined, result: undefined });
			pump();
		},
		remove: (id) => setItems((list) => list.filter((i) => i.id !== id)),
		clear: () => setItems([]),
	};
}
