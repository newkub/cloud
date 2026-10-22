import { type Accessor, createSignal, onCleanup } from "solid-js";

export interface WorkerControls {
	/** Send a message to the worker — spawns it lazily on first call; no-op when unsupported */
	post: (message: unknown, transfer?: Transferable[]) => void;
	/** Last `event.data` received from the worker */
	lastMessage: Accessor<unknown>;
	/** Terminate the worker — `post` spawns a fresh one afterwards */
	terminate: () => void;
	/** True while a worker instance is alive */
	running: Accessor<boolean>;
	/** False where `Worker` is unavailable (SSR, old browsers) */
	supported: boolean;
}

/**
 * Wrap a dedicated Web Worker behind a factory — bundler-agnostic, so the
 * caller decides how the worker is constructed (`new Worker(url)`,
 * `new Worker(new URL("./w.ts", import.meta.url))`, a module worker, …).
 * The factory runs lazily on the first `post`; the worker is terminated on
 * unmount. Guarded: with no `Worker` global, `supported` is `false` and
 * `post`/`terminate` no-op.
 *
 * @param factory — `() => Worker` — called once per spawn, not at hook setup
 * @returns `{ post, lastMessage, terminate, running, supported }`
 *
 * @example
 * const worker = useWorker(() => new Worker(new URL("./hash.worker.ts", import.meta.url)));
 * worker.post({ file });
 * <p>{JSON.stringify(worker.lastMessage())}</p>
 */
export function useWorker(factory: () => Worker): WorkerControls {
	const supported = typeof Worker !== "undefined";
	const [lastMessage, setLastMessage] = createSignal<unknown>();
	const [running, setRunning] = createSignal(false);
	let worker: Worker | undefined;

	const spawn = () => {
		if (!supported || worker) return;
		try {
			worker = factory();
		} catch {
			worker = undefined;
			return;
		}
		worker.onmessage = (event: MessageEvent) => setLastMessage(event.data);
		worker.onerror = () => {
			/* surface via caller's own onerror if needed — keep state consistent */
		};
		setRunning(true);
	};

	const terminate = () => {
		worker?.terminate();
		worker = undefined;
		setRunning(false);
	};

	onCleanup(terminate);

	return {
		post: (message: unknown, transfer?: Transferable[]) => {
			spawn();
			if (!worker) return;
			if (transfer) worker.postMessage(message, transfer);
			else worker.postMessage(message);
		},
		lastMessage,
		terminate,
		running,
		supported,
	};
}
