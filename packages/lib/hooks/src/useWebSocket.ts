import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";

export interface WebSocketReconnectOptions {
	/** Maximum reconnect attempts. @default 5 */
	retries?: number;
	/** Base delay before the first reconnect (ms). @default 1000 */
	delay?: number;
	/** Multiplier applied to the delay each attempt. @default 2 */
	backoff?: number;
}

export interface WebSocketOptions {
	/** Passed to the WebSocket constructor */
	protocols?: string | string[];
	/**
	 * Queue `send()` calls made while the socket is not OPEN and flush them
	 * on open — otherwise sends are dropped (previous behavior). @default false
	 */
	queue?: boolean;
	/**
	 * Auto-reconnect after unexpected closes — `true` for defaults or a
	 * `{ retries, delay, backoff }` config. Closes via `close()` never retry.
	 * @default false
	 */
	reconnect?: boolean | WebSocketReconnectOptions;
}

export interface WebSocketState {
	/** WebSocket.readyState — 0 connecting, 1 open, 2 closing, 3 closed */
	readyState: Accessor<number>;
	/** Every message received so far */
	messages: Accessor<string[]>;
	/** Latest message only */
	lastMessage: Accessor<string | undefined>;
	/**
	 * Send when the socket is open — queues when `options.queue` is set,
	 * otherwise no-ops while connecting/closed
	 */
	send: (data: string | ArrayBuffer | Blob) => void;
	/** Close the socket — also cancels any pending auto-reconnect */
	close: () => void;
	/** Close the current socket and open a fresh connection to `url()` */
	reconnect: () => void;
	/** Sends buffered while the socket was not open (requires `options.queue`) */
	queued: Accessor<number>;
}

/** `WebSocket.CLOSED` without touching the global at module/call time (SSR-safe). */
const WS_CLOSED = 3;

/**
 * Managed WebSocket — reconnects when `url()` changes, cleans up on unmount.
 * `send()` is a no-op until the socket is OPEN unless `options.queue` buffers
 * sends for the next open. `options.reconnect` adds auto-reconnect with
 * exponential backoff. SSR-safe (stays CLOSED).
 *
 * @param url — Accessor for the socket URL
 * @param options — `protocols`, `queue` offline sends, `reconnect` backoff config
 * @returns Reactive socket state — `{ readyState, messages, lastMessage, queued, send, close, reconnect }`
 *
 * @example
 * const ws = useWebSocket(() => "wss://echo.websocket.org", { queue: true, reconnect: true });
 * <button onClick={() => ws.send("hi")}>send</button>
 */
export function useWebSocket(url: Accessor<string>, options?: WebSocketOptions): WebSocketState {
	const [readyState, setReadyState] = createSignal<number>(
		typeof WebSocket === "undefined" ? WS_CLOSED : WebSocket.CLOSED,
	);
	const [messages, setMessages] = createSignal<string[]>([]);
	const [lastMessage, setLastMessage] = createSignal<string>();
	const [queued, setQueued] = createSignal(0);
	let socket: WebSocket | undefined;
	let closedByUser = false;
	let retryTimer: ReturnType<typeof setTimeout> | undefined;
	let doConnect: (() => void) | undefined;
	const outbox: (string | ArrayBuffer | Blob)[] = [];

	const flush = () => {
		while (socket && socket.readyState === WebSocket.OPEN && outbox.length) {
			const data = outbox.shift();
			if (data !== undefined) socket.send(data);
		}
		setQueued(outbox.length);
	};

	createEffect(() => {
		if (typeof WebSocket === "undefined") return;
		const target = url();
		const rc = options?.reconnect;
		const maxRetries = rc === true ? Number.POSITIVE_INFINITY : rc ? (rc.retries ?? 5) : 0;
		const baseDelay = typeof rc === "object" ? (rc.delay ?? 1000) : 1000;
		const backoff = typeof rc === "object" ? (rc.backoff ?? 2) : 2;
		let disposed = false;
		let retries = 0;

		const connect = () => {
			const ws = options?.protocols ? new WebSocket(target, options.protocols) : new WebSocket(target);
			socket = ws;
			setReadyState(ws.readyState);
			ws.onopen = () => {
				retries = 0;
				setReadyState(WebSocket.OPEN);
				flush();
			};
			ws.onclose = () => {
				if (socket === ws) setReadyState(WebSocket.CLOSED);
				// `socket !== ws` — a newer connection already replaced this one
				if (disposed || closedByUser || socket !== ws || retries >= maxRetries) return;
				const wait = baseDelay * backoff ** retries;
				retries += 1;
				retryTimer = setTimeout(() => {
					if (!disposed) connect();
				}, wait);
			};
			ws.onmessage = (e) => {
				const text = typeof e.data === "string" ? e.data : "";
				setLastMessage(text);
				setMessages((m) => [...m, text]);
			};
		};

		doConnect = connect;
		closedByUser = false;
		socket?.close();
		connect();
		onCleanup(() => {
			disposed = true;
			doConnect = undefined;
			clearTimeout(retryTimer);
			socket?.close();
		});
	});

	return {
		readyState,
		messages,
		lastMessage,
		queued,
		send: (data) => {
			if (socket && socket.readyState === WebSocket.OPEN) {
				socket.send(data);
			} else if (options?.queue) {
				outbox.push(data);
				setQueued(outbox.length);
			}
		},
		close: () => {
			closedByUser = true;
			clearTimeout(retryTimer);
			socket?.close();
			setReadyState(typeof WebSocket === "undefined" ? WS_CLOSED : WebSocket.CLOSED);
		},
		reconnect: () => {
			closedByUser = false;
			clearTimeout(retryTimer);
			socket?.close();
			doConnect?.();
		},
	};
}
