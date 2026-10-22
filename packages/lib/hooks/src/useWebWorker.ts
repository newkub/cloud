import { type Accessor, createSignal, onCleanup } from "solid-js";

/** Options for {@link useWebWorker}. */
export interface WebWorkerOptions {
	/** Worker script kind. @default "classic" */
	type?: "classic" | "module";
	/** Default `post()` timeout in ms — unlimited when omitted. */
	timeout?: number;
}

/** Per-call options for `post()`. */
export interface WebWorkerPostOptions {
	/** Override the hook-level timeout (ms). */
	timeout?: number;
}

/** State and controls returned by {@link useWebWorker}. */
export interface WebWorkerControls {
	/** Live worker instance — `undefined` when unsupported or terminated. */
	worker: Accessor<Worker | undefined>;
	/** Send data and wait for the next `message` reply; rejects on timeout/error/terminate. */
	post: (data: unknown, options?: WebWorkerPostOptions) => Promise<unknown>;
	/** Fire-and-forget `postMessage`. */
	postSync: (data: unknown) => void;
	/** Terminate the worker and reject pending `post()` calls. */
	terminate: () => void;
	/** Register a `message` listener; returns an unsubscribe function. */
	onmessage: (cb: (event: MessageEvent) => void) => () => void;
	/** Register an `error` listener; returns an unsubscribe function. */
	onerror: (cb: (event: Event) => void) => () => void;
	/** Register a `messageerror` listener; returns an unsubscribe function. */
	onmessageerror: (cb: (event: MessageEvent) => void) => () => void;
}

/**
 * Wrap a classic or module `Worker` built from a URL, with a promise-based
 * request channel: `post()` queues a task and resolves it with the next
 * `message` payload (FIFO), rejecting on timeout, worker `error`, or
 * `terminate()`. The worker is created immediately when the `Worker` global
 * exists and terminated on scope dispose; otherwise every method degrades
 * safely (SSR-safe).
 *
 * @param url — Worker script URL
 * @param options — `type` and default `timeout`
 * @returns `{ worker, post, postSync, terminate, onmessage, onerror, onmessageerror }`
 *
 * @example
 * const w = useWebWorker("/workers/hash.js", { timeout: 5000 });
 * const digest = await w.post({ file });
 * <Show when={w.worker()}><p>running</p></Show>
 */
export function useWebWorker(url: string | URL, options?: WebWorkerOptions): WebWorkerControls {
	const [worker, setWorker] = createSignal<Worker | undefined>();
	const messageCbs = new Set<(event: MessageEvent) => void>();
	const errorCbs = new Set<(event: Event) => void>();
	const messageErrorCbs = new Set<(event: MessageEvent) => void>();
	const pending: {
		resolve: (v: unknown) => void;
		reject: (e: Error) => void;
		timer?: ReturnType<typeof setTimeout>;
	}[] = [];

	const failPending = (message: string) => {
		for (const task of pending.splice(0)) {
			if (task.timer !== undefined) clearTimeout(task.timer);
			task.reject(new Error(message));
		}
	};

	const handleMessage = (event: MessageEvent) => {
		const task = pending.shift();
		if (task) {
			if (task.timer !== undefined) clearTimeout(task.timer);
			task.resolve(event.data);
		}
		for (const cb of [...messageCbs]) cb(event);
	};
	const handleError = (event: Event) => {
		failPending("[useWebWorker] worker error");
		for (const cb of [...errorCbs]) cb(event);
	};
	const handleMessageError = (event: MessageEvent) => {
		for (const cb of [...messageErrorCbs]) cb(event);
	};

	const attach = (w: Worker) => {
		w.addEventListener("message", handleMessage);
		w.addEventListener("error", handleError);
		w.addEventListener("messageerror", handleMessageError);
	};

	const terminate = () => {
		const w = worker();
		if (!w) return;
		w.removeEventListener("message", handleMessage);
		w.removeEventListener("error", handleError);
		w.removeEventListener("messageerror", handleMessageError);
		w.terminate();
		setWorker(undefined);
		failPending("[useWebWorker] terminated");
	};

	if (typeof Worker !== "undefined") {
		try {
			const w = new Worker(url, { type: options?.type ?? "classic" });
			attach(w);
			setWorker(w);
		} catch {
			setWorker(undefined);
		}
	}
	onCleanup(terminate);

	const post = (data: unknown, postOptions?: WebWorkerPostOptions): Promise<unknown> =>
		new Promise<unknown>((resolve, reject) => {
			const w = worker();
			if (!w) {
				reject(new Error("[useWebWorker] worker unavailable"));
				return;
			}
			const task: (typeof pending)[number] = { resolve, reject };
			const ms = postOptions?.timeout ?? options?.timeout;
			if (ms !== undefined) {
				task.timer = setTimeout(() => {
					const at = pending.indexOf(task);
					if (at !== -1) pending.splice(at, 1);
					reject(new Error("[useWebWorker] timeout"));
				}, ms);
			}
			pending.push(task);
			w.postMessage(data);
		});

	const unsub = <A>(bucket: Set<A>, cb: A) => {
		bucket.add(cb);
		return () => {
			bucket.delete(cb);
		};
	};

	return {
		worker,
		post,
		postSync: (data) => worker()?.postMessage(data),
		terminate,
		onmessage: (cb) => unsub(messageCbs, cb),
		onerror: (cb) => unsub(errorCbs, cb),
		onmessageerror: (cb) => unsub(messageErrorCbs, cb),
	};
}
