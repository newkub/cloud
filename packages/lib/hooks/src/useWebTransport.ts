import { type Accessor, createSignal, onCleanup } from "solid-js";

/** Minimal structural shape of the WebTransport API used by this hook. */
export interface WebTransportLike {
	ready: Promise<void>;
	closed: Promise<unknown>;
	datagrams: {
		writable: WritableStream<Uint8Array>;
		readable: ReadableStream<Uint8Array>;
	};
	close(reason?: { closeCode?: number; reason?: string }): void;
}

export interface WebTransportState {
	/** `WebTransport` availability flag — false on SSR and unsupported browsers */
	supported: boolean;
	/** Live transport instance while a session is open */
	transport: Accessor<WebTransportLike | undefined>;
	/** True after `transport.ready` resolves until close/failure */
	connected: Accessor<boolean>;
	/** Open a session to `url` — resolves once `ready` resolves, rethrows failures */
	connect: (url: string) => Promise<void>;
	/** Send one datagram — resolves `false` while disconnected or on write failure */
	send: (data: Uint8Array) => Promise<boolean>;
	/** Close the session and reset `connected`/`transport` */
	close: () => void;
	/** Last connection/stream error, cleared on `connect`/`close` */
	error: Accessor<Error | undefined>;
}

/**
 * WebTransport datagram session — `connect(url)` opens the transport, `send`
 * writes unreliable datagrams, and every inbound datagram is delivered to
 * `options.onMessage`. The datagram reader runs until the transport closes.
 * `supported` is false where `WebTransport` is missing (jsdom, SSR, most
 * browsers today), in which case `connect` rejects with an `error` signal set.
 *
 * @param options — `onMessage` receives each inbound datagram
 * @returns `{ supported, transport, connected, connect, send, close, error }`
 *
 * @example
 * const wt = useWebTransport({ onMessage: (bytes) => feed(bytes) });
 * <button onClick={() => wt.connect("https://relay.example/chat")} disabled={!wt.supported}>
 *   {wt.connected() ? "Connected" : "Connect"}
 * </button>
 */
export function useWebTransport(options?: {
	/** Called with each inbound datagram. */
	onMessage?: (data: Uint8Array) => void;
}): WebTransportState {
	const Ctor = (globalThis as { WebTransport?: new (url: string) => WebTransportLike }).WebTransport;
	const supported = typeof Ctor === "function";
	const [transport, setTransport] = createSignal<WebTransportLike | undefined>();
	const [connected, setConnected] = createSignal(false);
	const [error, setError] = createSignal<Error | undefined>();
	let writer: WritableStreamDefaultWriter<Uint8Array> | undefined;
	let cancelled = false;

	const asError = (e: unknown) => (e instanceof Error ? e : new Error(String(e)));

	const pump = async (t: WebTransportLike) => {
		const reader = t.datagrams.readable.getReader();
		try {
			for (;;) {
				const { done, value } = await reader.read();
				if (done || cancelled) return;
				if (value) options?.onMessage?.(value);
			}
		} catch (e) {
			if (!cancelled) setError(asError(e));
		} finally {
			reader.releaseLock();
		}
	};

	const connect = async (url: string) => {
		close();
		cancelled = false;
		if (!supported) {
			const e = new Error("WebTransport is not supported in this environment");
			setError(e);
			throw e;
		}
		const t = new (Ctor as new (url: string) => WebTransportLike)(url);
		setTransport(t);
		try {
			await t.ready;
			if (cancelled) return;
			setConnected(true);
			setError(undefined);
			void pump(t);
			void t.closed.then(
				() => {
					if (!cancelled) {
						setConnected(false);
						setTransport(undefined);
					}
				},
				(e) => {
					if (!cancelled) {
						setError(asError(e));
						setConnected(false);
						setTransport(undefined);
					}
				},
			);
		} catch (e) {
			setError(asError(e));
			setTransport(undefined);
			throw e;
		}
	};

	const send = async (data: Uint8Array) => {
		const t = transport();
		if (!t || !connected()) return false;
		try {
			writer ??= t.datagrams.writable.getWriter();
			await writer.write(data);
			return true;
		} catch (e) {
			setError(asError(e));
			return false;
		}
	};

	const close = () => {
		cancelled = true;
		const t = transport();
		setConnected(false);
		setTransport(undefined);
		try {
			writer?.releaseLock();
		} catch {
			// already released
		}
		writer = undefined;
		try {
			t?.close();
		} catch {
			// transport already closed — ignore
		}
	};

	onCleanup(close);

	return { supported, transport, connected, connect, send, close, error };
}
