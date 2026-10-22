import { onCleanup } from "solid-js";

/** Controls returned by {@link useWebWorkerFn}. */
export interface WebWorkerFnControls<T, I> {
	/** Run `fn` off-thread; resolves with its return value, rejects on worker error. */
	workerFn: (input: I) => Promise<T>;
	/** Build a variant whose calls reject after `ms` if the worker has not replied. */
	timeout: (ms: number) => { workerFn: (input: I) => Promise<T> };
	/** Terminate the worker and revoke the blob URL; further calls run on the main thread. */
	terminate: () => void;
}

const SOURCE = (fnBody: string) =>
	`self.onmessage = (e) => { try { Promise.resolve((${fnBody})(e.data)).then(` +
	`(v) => self.postMessage({ type: "result", data: v }),` +
	`(err) => self.postMessage({ type: "error", message: String((err && err.message) || err) })); } ` +
	`catch (err) { self.postMessage({ type: "error", message: String((err && err.message) || err) }); } };`;

/**
 * Run a pure function in a one-off Web Worker built from a Blob URL — the
 * function source is evaluated inside `self.onmessage`, input arrives as
 * `event.data`, and each call resolves with the next `message` (one-shot
 * listener per call) or rejects when it carries `{ type: "error" }`. When
 * `Worker`/`Blob`/`URL.createObjectURL` are unavailable (SSR, test envs),
 * `workerFn` falls back to executing the function on the main thread. The
 * worker is terminated and its object URL revoked on scope dispose or via
 * `terminate()`.
 *
 * @param fn — Pure `(input) => result` function (no closure capture!)
 * @returns `{ workerFn, timeout, terminate }`
 *
 * @example
 * const { workerFn, timeout, terminate } = useWebWorkerFn((n: number) => n * n);
 * const square = await workerFn(12); // off the main thread
 * const quick = await timeout(2000).workerFn(12); // rejects after 2s
 */
export function useWebWorkerFn<T, I = T>(fn: (input: I) => T): WebWorkerFnControls<T, I> {
	const supported =
		typeof Worker !== "undefined" &&
		typeof Blob !== "undefined" &&
		typeof URL !== "undefined" &&
		typeof URL.createObjectURL === "function";
	let objectUrl: string | undefined;
	let worker: Worker | undefined;

	if (supported) {
		try {
			objectUrl = URL.createObjectURL(new Blob([SOURCE(fn.toString())], { type: "text/javascript" }));
			worker = new Worker(objectUrl);
		} catch {
			worker = undefined;
		}
	}

	const workerFn = (input: I): Promise<T> => {
		const w = worker;
		if (!w) {
			try {
				return Promise.resolve(fn(input));
			} catch (error) {
				return Promise.reject(error instanceof Error ? error : new Error(String(error)));
			}
		}
		return new Promise<T>((resolve, reject) => {
			const onError = () => {
				w.removeEventListener("message", onMessage);
				reject(new Error("[useWebWorkerFn] worker error"));
			};
			const onMessage = (event: MessageEvent) => {
				w.removeEventListener("error", onError);
				w.removeEventListener("message", onMessage);
				const payload = event.data as { type: string; data?: T; message?: string };
				if (payload && payload.type === "result") resolve(payload.data as T);
				else reject(new Error(payload?.message ?? "[useWebWorkerFn] worker error"));
			};
			w.addEventListener("message", onMessage);
			w.addEventListener("error", onError);
			w.postMessage(input);
		});
	};

	const terminate = () => {
		worker?.terminate();
		worker = undefined;
		if (objectUrl !== undefined && typeof URL?.revokeObjectURL === "function") URL.revokeObjectURL(objectUrl);
		objectUrl = undefined;
	};

	const timeout = (ms: number) => ({
		workerFn: (input: I) =>
			new Promise<T>((resolve, reject) => {
				const timer = setTimeout(() => reject(new Error("[useWebWorkerFn] timeout")), ms);
				workerFn(input).then(
					(value) => {
						clearTimeout(timer);
						resolve(value);
					},
					(error) => {
						clearTimeout(timer);
						reject(error);
					},
				);
			}),
	});

	onCleanup(terminate);
	return { workerFn, timeout, terminate };
}
